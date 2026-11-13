// ============================================================
//  KAS — CATAT BANYAK SEKALIGUS (ramah HP)
//  Sumber: (1) tempel teks — catatan WA / tabel yang disalin dari Excel/Google Sheets,
//          (2) foto/screenshot laporan atau nota (dibaca OCR di perangkat),
//          (3) isi tabel langsung.
//  Semua baris tampil sebagai daftar yang bisa diubah (tanggal, uraian, masuk/keluar, nominal, kategori).
//  Bila sumbernya punya kolom SALDO, saldo dicocokkan BARIS PER BARIS — simpan dikunci sampai cocok
//  (atau bendahara menyatakan sudah memeriksa), lalu saldo akun diverifikasi ulang dari database.
// ============================================================
const KB = { baris: [], saldoAwal: null, saldoAwalTebak: false, akunId: null, tglBawaan: null, setuju: false, sumber: "" };

function bukaCatatBanyakKas() {
  if (!KAS.siap) { toast(KAS.galat || "Kas belum siap", "err"); return; }
  if (!KAS.akun.length) { toast("Tambahkan akun kas dulu di tab Atur", "err"); return; }
  const contoh = "03/11 Konsumsi kantor 70rb\nRapat evaluasi bulanan bersama mudir 192.000\nAqua dus 22rb\nKain lap meja 2 x 5.000\n+ Uang SPP Sayyid & Fatih 1.700.000";
  openModal(`<div class="kb">
    <h3>⚡ Catat banyak sekaligus</h3>
    <div class="kb-sub">Pilih cara yang paling mudah. Semua baris bisa diperiksa & diubah dulu sebelum disimpan.</div>
    <div class="kb-sumber">
      <button type="button" onclick="kbTampilTempel()"><span>📋</span><b>Tempel teks</b><small>Catatan WA atau tabel yang disalin dari Excel / Google Sheets</small></button>
      <label><span>📷</span><b>Foto / screenshot</b><small>Laporan, nota, atau tulisan tangan yang rapi — dibaca otomatis</small><input type="file" accept="image/*" multiple hidden onchange="kbBacaFoto(this)"></label>
      <button type="button" onclick="kbMulaiKosong()"><span>✍️</span><b>Isi tabel langsung</b><small>Ketik baris demi baris, cepat di HP</small></button>
    </div>
    <div id="kb-tempel" hidden>
      <textarea id="kb-teks" class="input" rows="8" placeholder="${escapeHtml(contoh)}"></textarea>
      <div class="kb-ket">Satu baris = satu transaksi. Boleh pakai <b>70rb</b>, <b>1,5jt</b>, <b>Rp 100.000</b>, <b>2 x 5.000</b>. Awali dengan <b>+</b> untuk uang masuk. Tanggal di depan baris (03/11, 19 Okt) — baris tanpa tanggal ikut tanggal baris sebelumnya.</div>
      <button class="btn btn-accent" style="width:100%;margin-top:8px" onclick="kbBacaTeks(qs('kb-teks').value,'teks')">🔎 Baca teks</button>
    </div>
  </div>`, { lebar: true });
}
function kbTampilTempel() { qs("kb-tempel").hidden = false; setTimeout(() => qs("kb-teks")?.focus(), 30); }
function kbMulaiKosong() { kbSiapkan([], null, "manual"); for (let i = 0; i < 5; i++) kbTambahBaris(true); kbGambar(); }

// ── PEMBACA TEKS ────────────────────────────────────────────
const _KB_BULAN_RE = Object.keys(_KAS_BULAN_TEKS).sort((a, b) => b.length - a.length).join("|");
const _KB_TGL_RE = new RegExp(`(\\d{4}-\\d{1,2}-\\d{1,2})|(\\d{1,2}[/.-]\\d{1,2}[/.-]\\d{2,4})|(\\d{1,2}[\\s-]+(?:${_KB_BULAN_RE})\\.?(?:[\\s,-]+\\d{4})?)(?![a-z])|(\\d{1,2}/\\d{1,2})(?![\\d/])`, "i");
const _KB_UANG_RE = /\(\s*-?\s*(?:rp\.?\s*)?\d[\d.,]*\s*\)|rp\.?\s*-?\s*\d[\d.,]*|\d+(?:[.,]\d+)?\s*(?:rb|ribu|k|jt|juta)\b|\d{1,3}(?:[.,]\d{3})+(?:[.,]\d{1,2})?|\b\d{4,}\b/gi;
function _kbAngka(tok) {
  const s = String(tok).toLowerCase().trim();
  const u = s.match(/^(-?\d+(?:[.,]\d+)?)\s*(rb|ribu|k|jt|juta)$/);
  if (u) { const n = Number(u[1].replace(",", ".")); return Math.round(n * (/^j/.test(u[2]) ? 1e6 : 1e3)); }
  return _kasImporAngka(s);
}
const _KB_MASUK_RE = /^\s*\+|\b(uang masuk|pemasukan|diterima|terima|setoran|spp|syahriah|infa[qk]|donasi|sedekah|shodaqoh|sumbangan|hibah|dana bop|bop\b|kembalian|pengembalian|saldo masuk)\b/i;

function _kbUraiBaris(baris, ctx) {
  let s = String(baris).replace(/\s+/g, " ").trim();
  if (!s) return null;
  const kecil = s.toLowerCase();
  // judul tabel & baris ringkasan
  if (/\buraian\b/.test(kecil) && /\b(saldo|keluar|masuk)\b/.test(kecil)) return null;
  const uangSemua = (s.match(_KB_UANG_RE) || []).map(_kbAngka);
  if (/saldo\s*awal/.test(kecil)) { if (uangSemua.length) ctx.saldoAwal = uangSemua[uangSemua.length - 1]; return null; }
  if (/^(total|jumlah|saldo akhir|sub ?total)\b/.test(kecil.replace(/^\d+\s*/, ""))) { if (uangSemua.length) ctx.saldoAkhir = uangSemua[uangSemua.length - 1]; return null; }
  const masukTanda = /^\s*\+/.test(s);
  s = s.replace(/^\s*[+\-•*]\s*/, "");
  // tanggal (di depan, boleh didahului nomor urut)
  let tanggal = null;
  const mt = s.slice(0, 40).match(_KB_TGL_RE);
  if (mt && mt.index <= 6) {
    const tahun = ctx.tglKini ? +ctx.tglKini.slice(0, 4) : +(ctx.tglBawaan || tanggalISO()).slice(0, 4);
    tanggal = _kasImporTanggal(mt[0].replace(/\s+/g, " ").replace(/^(\d{1,2})\/(\d{1,2})$/, "$1-$2"), tahun);
    if (tanggal) s = (s.slice(0, mt.index).replace(/^\d{1,3}[.)]?\s*$/, "") + " " + s.slice(mt.index + mt[0].length)).trim();
  }
  if (!tanggal) s = s.replace(/^\d{1,3}[.)]?\s+(?=[A-Za-z(])/, ""); // nomor urut
  // nominal: semua angka uang setelah uraian
  const toks = []; let m; _KB_UANG_RE.lastIndex = 0;
  while ((m = _KB_UANG_RE.exec(s))) { if (/^(19|20)\d{2}$/.test(m[0].trim())) continue; toks.push({ i: m.index, t: m[0], n: _kbAngka(m[0]) }); } // angka tahun bukan uang
  const pertama = toks[0];
  let uraian = (pertama ? s.slice(0, pertama.i) : s).trim();
  // jumlah barang: "2 x 5.000", "3 @ 20rb", atau angka kecil tepat sebelum harga (tabel)
  let qty = 1, kali = false;
  const mq = uraian.match(/(?:^|\s)(\d{1,3})\s*(x|×|@|pcs|buah|bh|dus|pak|pack|lembar|lbr|porsi|kotak|botol|bungkus|bks|rim|unit)?\s*[x×@]?\s*$/i);
  if (mq && toks.length) { qty = +mq[1] || 1; kali = !!mq[2] || /[x×@]\s*$/.test(uraian); uraian = uraian.slice(0, mq.index).trim(); }
  uraian = uraian.replace(/\s*(rp\.?|[-–|:@x×])\s*$/i, "").replace(/^[-–|:]\s*/, "").trim();
  if (/^[\d\s.,\-–]*$/.test(uraian)) uraian = ""; // sisa nomor urut saja = baris kosong
  const A = toks.map((x) => x.n).filter((n) => n !== 0 || toks.length === 1);
  if (!uraian && !A.length) return null;
  if (!uraian && A.length <= 1) return null; // baris kosong yang hanya berisi saldo
  let nominal = 0, harga = 0, saldo = null;
  const p = ctx.saldoKini;
  if (A.length >= 3) { harga = Math.abs(A[0]); nominal = Math.abs(A[A.length - 2]); saldo = A[A.length - 1]; }
  else if (A.length === 2) {
    const [a, b] = A;
    if (qty > 1 && Math.abs(a) * qty === Math.abs(b)) { harga = Math.abs(a); nominal = Math.abs(b); }
    else if (p != null && (p - Math.abs(a) === b || p + Math.abs(a) === b)) { nominal = Math.abs(a); saldo = b; }
    else if (ctx.modeTabel) { nominal = Math.abs(a); saldo = b; }
    else if (Math.abs(a) === Math.abs(b)) nominal = Math.abs(a);
    else { harga = Math.abs(a); nominal = Math.abs(b); }
  } else if (A.length === 1) { nominal = Math.abs(A[0]) * (kali ? qty : 1); if (kali) harga = Math.abs(A[0]); }
  // masuk / keluar: dari saldo (paling pasti), lalu tanda +, lalu kata kunci
  let jenis = masukTanda || _KB_MASUK_RE.test(uraian) ? "masuk" : "keluar", pasti = false;
  if (saldo != null && p != null) {
    if (p + nominal === saldo) { jenis = "masuk"; pasti = true; } else if (p - nominal === saldo) { jenis = "keluar"; pasti = true; }
  }
  if (tanggal) ctx.tglKini = tanggal;
  const tgl = tanggal || ctx.tglKini || ctx.tglBawaan;
  if (saldo != null) ctx.saldoKini = saldo; else if (p != null) ctx.saldoKini = p + (jenis === "masuk" ? nominal : -nominal);
  const rinci = qty > 1 && harga ? ` (${qty} × Rp ${formatRibuan(harga)})` : qty > 1 ? ` (${qty})` : "";
  return { tanggal: tgl, tglIkut: !tanggal, uraian: (uraian || "(tanpa uraian)") + rinci, jenis, nominal, saldoFile: saldo, jenisPasti: pasti };
}
// Tabel yang disalin dari Excel/Google Sheets (dipisah TAB) dengan baris judul → pakai nama kolom
function _kbUraiTabel(baris, ctx) {
  const sel = baris.map((b) => b.split("\t").map((c) => c.trim()));
  const iJudul = sel.findIndex((r) => r.some((c) => /^(uraian|keterangan|rincian)$/i.test(c)) && r.some((c) => /keluar|masuk|nominal|jumlah|saldo/i.test(c)));
  if (iJudul < 0) return null;
  const h = sel[iJudul].map((c) => c.toLowerCase());
  const k = (re, kecuali = []) => h.findIndex((c, j) => re.test(c) && !kecuali.includes(j));
  const kol = { tgl: k(/^(tanggal|tgl)/), ur: k(/uraian|keterangan|rincian/), kat: k(/kategori/), ms: k(/masuk|debit|penerimaan|pemasukan/), kl: k(/keluar|kredit|pengeluaran/), saldo: k(/saldo/) };
  kol.qty = k(/^(jumlah|qty|vol|banyak)$/, [kol.ms, kol.kl]); kol.harga = k(/harga/); kol.nom = kol.ms < 0 && kol.kl < 0 ? k(/nominal|total|jumlah/, [kol.qty]) : -1;
  sel.slice(0, iJudul).forEach((r) => { const t = r.join(" "); if (/saldo\s*awal/i.test(t)) { const a = (t.match(_KB_UANG_RE) || []).map(_kbAngka); if (a.length) ctx.saldoAwal = a[a.length - 1]; } });
  ctx.saldoKini = ctx.saldoAwal;
  const out = [];
  sel.slice(iJudul + 1).forEach((r) => {
    const ur = kol.ur >= 0 ? r[kol.ur] || "" : "", gabung = r.join(" ");
    if (/saldo\s*awal/i.test(gabung)) { const a = (gabung.match(_KB_UANG_RE) || []).map(_kbAngka); if (a.length) { ctx.saldoAwal = a[a.length - 1]; ctx.saldoKini = ctx.saldoAwal; } return; }
    if (/^(total|jumlah|saldo akhir)/i.test(gabung.replace(/^\d+\s*/, ""))) { const a = (gabung.match(_KB_UANG_RE) || []).map(_kbAngka); if (a.length) ctx.saldoAkhir = a[a.length - 1]; return; }
    const angka = (i) => (i >= 0 && String(r[i] || "").trim() && !/^[-–]+$/.test(String(r[i]).replace(/rp\.?/i, "").trim()) ? Math.abs(_kbAngka(r[i])) : 0);
    const masuk = angka(kol.ms), keluar = angka(kol.kl), nom = angka(kol.nom);
    const saldo = kol.saldo >= 0 && String(r[kol.saldo] || "").trim() ? _kbAngka(r[kol.saldo]) : null;
    if (!ur.trim() && !masuk && !keluar && !nom) return;
    const tglSel = kol.tgl >= 0 ? _kasImporTanggal(r[kol.tgl], ctx.tglKini ? +ctx.tglKini.slice(0, 4) : +(ctx.tglBawaan || tanggalISO()).slice(0, 4)) : null;
    if (tglSel) ctx.tglKini = tglSel;
    const qty = kol.qty >= 0 ? String(r[kol.qty] || "").trim() : "", harga = angka(kol.harga);
    const rinci = qty && !/^1$/.test(qty) && harga ? ` (${qty} × Rp ${formatRibuan(harga)})` : "";
    const jenis = masuk && !keluar ? "masuk" : keluar ? "keluar" : _KB_MASUK_RE.test(ur) ? "masuk" : "keluar";
    const nominal = masuk || keluar || nom;
    const p = ctx.saldoKini;
    ctx.saldoKini = saldo != null ? saldo : p != null ? p + (jenis === "masuk" ? nominal : -nominal) : null;
    out.push({ tanggal: ctx.tglKini || ctx.tglBawaan, tglIkut: !tglSel, uraian: (ur || "(tanpa uraian)") + rinci, teksKategori: kol.kat >= 0 ? r[kol.kat] : "", jenis, nominal, saldoFile: saldo, jenisPasti: !!(masuk || keluar) });
  });
  return out;
}
function kbBacaTeks(teks, sumber) {
  const baris = String(teks || "").replace(/\r/g, "").split("\n").filter((x) => x.trim());
  if (!baris.length) { toast("Teksnya masih kosong", "info"); return; }
  const ctx = { saldoAwal: null, saldoAkhir: null, saldoKini: null, tglKini: null, tglBawaan: (KAS.bulan === tanggalISO().slice(0, 7) ? tanggalISO() : `${KAS.bulan}-01`) };
  let hasil = baris.filter((b) => b.includes("\t")).length >= Math.max(2, baris.length / 2) ? _kbUraiTabel(baris, ctx) : null;
  if (!hasil) {
    // saldo awal dulu (supaya masuk/keluar bisa ditentukan dari perubahan saldo)
    baris.forEach((b) => { if (/saldo\s*awal/i.test(b)) { const a = (b.match(_KB_UANG_RE) || []).map(_kbAngka); if (a.length) ctx.saldoAwal = a[a.length - 1]; } });
    ctx.saldoKini = ctx.saldoAwal;
    // mode tabel (hasil foto/salinan laporan): kebanyakan baris berisi ≥2 angka uang
    ctx.modeTabel = baris.filter((b) => (b.match(_KB_UANG_RE) || []).length >= 2).length >= baris.length / 2;
    hasil = baris.map((b) => _kbUraiBaris(b.replace(/\t/g, " "), ctx)).filter(Boolean);
  }
  if (!hasil.length) { toast("Belum ada transaksi yang terbaca. Pastikan tiap baris berisi uraian & nominal.", "err"); return; }
  kbSiapkan(hasil, ctx, sumber);
  kbGambar();
}

// ── FOTO / SCREENSHOT (OCR di perangkat) ──
async function _kbMuatOcr() {
  if (window.Tesseract) return;
  await new Promise((ok, gagal) => { const s = document.createElement("script"); s.src = "https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js"; s.onload = ok; s.onerror = () => gagal(new Error("Pembaca gambar gagal dimuat — periksa internet")); document.head.appendChild(s); });
}
async function _kbPerbesar(file) {
  // perbesar gambar kecil supaya huruf & angka lebih terbaca
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise((ok, gagal) => { const i = new Image(); i.onload = () => ok(i); i.onerror = gagal; i.src = url; });
    const skala = img.width < 1400 ? Math.min(2.2, 2600 / img.width) : 1;
    const c = document.createElement("canvas"); c.width = Math.round(img.width * skala); c.height = Math.round(img.height * skala);
    const x = c.getContext("2d"); x.imageSmoothingQuality = "high"; x.drawImage(img, 0, 0, c.width, c.height);
    return c;
  } finally { URL.revokeObjectURL(url); }
}
async function kbBacaFoto(input) {
  const files = [...(input.files || [])]; input.value = "";
  if (!files.length) return;
  try {
    setGlobalLoading(true, "Menyiapkan pembaca gambar…");
    await _kbMuatOcr();
    let teks = "";
    for (let i = 0; i < files.length; i++) {
      setGlobalLoading(true, `Membaca gambar ${files.length > 1 ? `${i + 1}/${files.length} ` : ""}…`);
      const kanvas = await _kbPerbesar(files[i]);
      const r = await Tesseract.recognize(kanvas, "ind+eng", { logger: (m) => { if (m.status === "recognizing text") setGlobalLoading(true, `Membaca gambar ${files.length > 1 ? `${i + 1}/${files.length} ` : ""}${Math.round(m.progress * 100)}%`); } });
      teks += (r.data.text || "") + "\n";
    }
    setGlobalLoading(false);
    KB.teksOcr = teks;
    kbBacaTeks(teks, "foto");
  } catch (e) { console.error(e); toast("Gagal membaca gambar: " + (e.message || e), "err"); }
  finally { setGlobalLoading(false); }
}

// ── DAFTAR YANG BISA DIUBAH ─────────────────────────────────
function kbSiapkan(hasil, ctx, sumber) {
  const akunTunai = KAS.akun.find((a) => a.jenis === "tunai") || KAS.akun[0];
  KB.sumber = sumber; KB.setuju = false; KB.akunId = KB.akunId && _kasAkun(KB.akunId) ? KB.akunId : akunTunai.id;
  KB.tglBawaan = ctx?.tglBawaan || tanggalISO();
  KB.saldoAkhirFile = ctx?.saldoAkhir ?? null;
  KB.baris = hasil.map((b) => {
    const tebak = _kasTebakKategori(b.jenis, b.uraian, b.teksKategori);
    const dobel = KAS.semua.some((t) => t.tanggal === b.tanggal && t.jenis === b.jenis && Number(t.nominal) === b.nominal);
    return { ...b, kategori_id: tebak.id, yakin: tebak.yakin, pilih: !dobel, duplikat: dobel };
  });
  // saldo awal: dari teks; kalau tidak ada tapi ada kolom saldo → ditebak dari baris pertama
  KB.saldoAwal = ctx?.saldoAwal ?? null; KB.saldoAwalTebak = false;
  const b0 = KB.baris[0];
  if (KB.saldoAwal == null && b0 && b0.saldoFile != null) { KB.saldoAwal = b0.saldoFile + (b0.jenis === "masuk" ? -b0.nominal : b0.nominal); KB.saldoAwalTebak = true; }
}
function kbTambahBaris(diam) {
  const akhir = KB.baris[KB.baris.length - 1];
  KB.baris.push({ tanggal: akhir?.tanggal || KB.tglBawaan || tanggalISO(), uraian: "", jenis: "keluar", nominal: 0, kategori_id: _kasTebakKategori("keluar", "").id, yakin: false, pilih: true, saldoFile: null, baru: true });
  if (!diam) { kbGambar(); setTimeout(() => { const el = qsa(".kb-ur"); el[el.length - 1]?.focus(); }, 30); }
}
// Hitung ulang saldo berjalan & cocokkan dengan kolom saldo sumber
function _kbCek() {
  const adaSaldo = KB.baris.some((b) => b.saldoFile != null);
  let berjalan = KB.saldoAwal, bedaPertama = -1;
  KB.baris.forEach((b, i) => {
    b.cocok = null;
    if (berjalan != null) berjalan += b.jenis === "masuk" ? b.nominal : -b.nominal;
    b.hitung = berjalan;
    if (b.saldoFile != null && berjalan != null) { b.cocok = Math.round(b.saldoFile) === Math.round(berjalan); if (!b.cocok && bedaPertama < 0) bedaPertama = i; }
  });
  const pilih = KB.baris.filter((b) => b.pilih);
  const masuk = pilih.filter((b) => b.jenis === "masuk").reduce((s, b) => s + b.nominal, 0), keluar = pilih.filter((b) => b.jenis === "keluar").reduce((s, b) => s + b.nominal, 0);
  const kurang = pilih.filter((b) => !b.nominal || !b.tanggal || !b.uraian.trim()).length;
  const akhirCocok = KB.saldoAkhirFile == null || berjalan == null || Math.round(KB.saldoAkhirFile) === Math.round(berjalan);
  const cocok = bedaPertama < 0 && akhirCocok;
  return { adaSaldo, bedaPertama, akhir: berjalan, pilih, masuk, keluar, kurang, cocok, akhirCocok, boleh: pilih.length > 0 && !kurang && (cocok || KB.setuju) };
}
function kbGambar() {
  const opsiAkun = KAS.akun.map((a) => `<option value="${a.id}" ${a.id === KB.akunId ? "selected" : ""}>${escapeHtml(a.nama)}</option>`).join("");
  const tglPertama = KB.baris.map((b) => b.tanggal).filter(Boolean).sort()[0];
  const sebelum = tglPertama ? (() => { const d = new Date(tglPertama + "T00:00:00"); d.setDate(d.getDate() - 1); return tanggalISO(d); })() : null;
  const saldoApp = sebelum ? kasSaldoAkun(KB.akunId, sebelum) : null;
  openModal(`<div class="kb">
    <h3>⚡ Periksa sebelum disimpan</h3>
    <div class="kb-sub">${KB.sumber === "foto" ? "📷 Dibaca dari gambar — cek angka & uraiannya, terutama yang ditandai." : KB.sumber === "teks" ? "📋 Dibaca dari teks." : "✍️ Isi baris di bawah."} Ketuk nominal / uraian untuk mengubah.</div>
    <div class="kb-atas">
      <label>Catat ke akun<select class="input" onchange="KB.akunId=this.value;kbGambar()">${opsiAkun}</select></label>
      <label>Saldo awal catatan<input class="input" inputmode="numeric" placeholder="tidak ada" value="${KB.saldoAwal == null ? "" : formatRibuan(KB.saldoAwal)}" onchange="KB.saldoAwal=this.value.trim()===''?null:_kasImporAngka(this.value);KB.saldoAwalTebak=false;kbGambar()"></label>
    </div>
    ${KB.saldoAwal != null && saldoApp != null && Math.round(saldoApp) !== Math.round(KB.saldoAwal) ? `<div class="kb-peringatan">ℹ️ Saldo ${escapeHtml(_kasAkun(KB.akunId)?.nama || "")} di aplikasi per ${_kasTglDok(sebelum)} adalah <b>${_kasRp(saldoApp)}</b>, sedangkan saldo awal di catatan <b>${_kasRp(KB.saldoAwal)}</b>${KB.saldoAwalTebak ? " (ditebak dari baris pertama)" : ""}. Pastikan tidak ada transaksi yang terlewat / tercatat dua kali.</div>` : ""}
    <div id="kb-status"></div>
    <div class="kb-daftar" id="kb-daftar">${KB.baris.map(_kbHtmlBaris).join("")}</div>
    <button type="button" class="kb-tambah" onclick="kbTambahBaris()">＋ Tambah baris</button>
    <label class="kas-imp-opsi" id="kb-setuju" hidden><input type="checkbox" ${KB.setuju ? "checked" : ""} onchange="KB.setuju=this.checked;_kbSegarkan()"><span>Saya sudah memeriksa selisih saldo dan tetap ingin menyimpan<small>Sebaiknya perbaiki angka yang ditandai merah dulu supaya saldo aplikasi sama persis dengan catatan.</small></span></label>
    <div class="kb-kaki"><div id="kb-total"></div><button class="btn btn-accent" id="kb-simpan" onclick="kbSimpan()">💾 Simpan</button></div>
  </div>`, { lebar: true });
  _kbSegarkan();
}
function _kbHtmlBaris(b, i) {
  const opsi = KAS.kategori.filter((k) => k.jenis === b.jenis).map((k) => `<option value="${k.id}" ${k.id === b.kategori_id ? "selected" : ""}>${k.ikon || ""} ${escapeHtml(k.nama)}</option>`).join("");
  return `<div class="kb-baris ${b.jenis} ${b.pilih ? "" : "mati"}" data-i="${i}">
    <input type="checkbox" class="kb-cek" ${b.pilih ? "checked" : ""} onchange="KB.baris[${i}].pilih=this.checked;this.closest('.kb-baris').classList.toggle('mati',!this.checked);_kbSegarkan()" aria-label="Ikut disimpan">
    <input type="date" class="input kb-tgl ${b.tglIkut ? "ikut" : ""}" value="${b.tanggal || ""}" onchange="KB.baris[${i}].tanggal=this.value;KB.baris[${i}].tglIkut=false;this.classList.remove('ikut');_kbSegarkan()" aria-label="Tanggal">
    <button type="button" class="kb-jenis" onclick="kbBalikJenis(${i})" title="Ketuk untuk ganti Masuk / Keluar">${b.jenis === "masuk" ? "＋ Masuk" : "－ Keluar"}</button>
    <input class="input kb-nom" inputmode="numeric" value="${b.nominal ? formatRibuan(b.nominal) : ""}" placeholder="Nominal" oninput="this.value=formatRibuan(this.value);KB.baris[${i}].nominal=Number(this.value.replace(/\\D/g,''))||0;_kbSegarkan()" aria-label="Nominal">
    <input class="input kb-ur" value="${escapeHtml(b.uraian)}" placeholder="Uraian (untuk apa?)" oninput="KB.baris[${i}].uraian=this.value" onchange="_kbTebakUlang(${i})" aria-label="Uraian">
    <select class="input kb-kat ${b.yakin ? "" : "ragu"}" onchange="KB.baris[${i}].kategori_id=this.value;KB.baris[${i}].yakin=true;this.classList.remove('ragu')" aria-label="Kategori">${opsi}</select>
    <button type="button" class="kb-hapus" onclick="KB.baris.splice(${i},1);kbGambar()" aria-label="Hapus baris">✕</button>
    <div class="kb-info" id="kb-info-${i}"></div>
  </div>`;
}
function kbBalikJenis(i) {
  const b = KB.baris[i]; b.jenis = b.jenis === "masuk" ? "keluar" : "masuk";
  const t = _kasTebakKategori(b.jenis, b.uraian); b.kategori_id = t.id; b.yakin = t.yakin;
  const el = document.querySelector(`.kb-baris[data-i="${i}"]`); if (el) el.outerHTML = _kbHtmlBaris(b, i);
  _kbSegarkan();
}
function _kbTebakUlang(i) { const b = KB.baris[i]; if (b.yakin && !b.baru) return; const t = _kasTebakKategori(b.jenis, b.uraian); if (t.yakin) { b.kategori_id = t.id; b.yakin = true; const s = document.querySelector(`.kb-baris[data-i="${i}"] .kb-kat`); if (s) { s.value = t.id; s.classList.remove("ragu"); } } }
function _kbSegarkan() {
  const c = _kbCek();
  KB.baris.forEach((b, i) => {
    const el = qs(`kb-info-${i}`); if (!el) return;
    const tanda = [];
    if (b.duplikat) tanda.push(`<span class="dobel">sudah tercatat${b.pilih ? "" : " — tidak disimpan"}</span>`);
    if (b.tglIkut && b.tanggal) tanda.push(`<span class="ikut">tanggal ikut baris atas</span>`);
    if (b.saldoFile != null) tanda.push(b.cocok === false ? `<span class="beda">saldo catatan ${_kasRp(b.saldoFile)} ≠ hitungan ${_kasRp(b.hitung)}</span>` : b.cocok ? `<span class="ok">saldo ${_kasRp(b.saldoFile)} ✓</span>` : `<span>saldo catatan ${_kasRp(b.saldoFile)}</span>`);
    else if (b.hitung != null && c.adaSaldo === false && KB.saldoAwal != null) tanda.push(`<span>saldo ${_kasRp(b.hitung)}</span>`);
    el.innerHTML = tanda.join("");
    el.closest(".kb-baris")?.classList.toggle("salah", b.cocok === false);
  });
  const st = qs("kb-status");
  if (st) st.innerHTML = c.adaSaldo || KB.saldoAkhirFile != null
    ? `<div class="kb-cek-saldo ${c.cocok ? "ok" : "beda"}">${c.cocok ? `✓ Saldo cocok baris per baris${c.akhir != null ? ` · saldo akhir <b>${_kasRp(c.akhir)}</b>` : ""}` : c.bedaPertama >= 0 ? `⚠ Saldo mulai beda di <b>baris ${c.bedaPertama + 1}</b> — biasanya angka salah baca / masuk-keluar tertukar. Perbaiki yang ditandai merah.` : `⚠ Saldo akhir hitungan ${_kasRp(c.akhir)} ≠ saldo akhir catatan ${_kasRp(KB.saldoAkhirFile)}`}</div>`
    : `<div class="kb-cek-saldo info">Catatan ini tidak punya kolom saldo — periksa nominalnya sekali lagi sebelum menyimpan.</div>`;
  const setuju = qs("kb-setuju"); if (setuju) setuju.hidden = c.cocok;
  const tot = qs("kb-total"); if (tot) tot.innerHTML = `<b>${c.pilih.length}</b> transaksi <span class="masuk">+ ${_kasRp(c.masuk)}</span><span class="keluar">− ${_kasRp(c.keluar)}</span>`;
  const tb = qs("kb-simpan");
  if (tb) { tb.disabled = !c.boleh; tb.innerHTML = c.kurang ? `Lengkapi ${c.kurang} baris dulu` : !c.cocok && !KB.setuju ? "Periksa selisih saldo dulu" : `💾 Simpan ${c.pilih.length} transaksi`; }
}
let _KB_SEDANG = false;
async function kbSimpan() {
  if (_KB_SEDANG) return;
  const c = _kbCek(); if (!c.boleh) return;
  const akun = _kasAkun(KB.akunId);
  if (!(await konfirmasiTema(`Simpan ${c.pilih.length} transaksi ke akun "${escapeHtml(akun?.nama || "")}"?\nMasuk ${_kasRp(c.masuk)} · Keluar ${_kasRp(c.keluar)}`, { ikon: "💾", judul: "Catat banyak" }))) { kbGambar(); return; }
  _KB_SEDANG = true; setGlobalLoading(true, "Menyimpan transaksi…");
  try {
    const saldoHarus = kasSaldoAkun(KB.akunId) + c.masuk - c.keluar;
    const hitung = {};
    KAS.semua.forEach((t) => { const k = `${t.jenis}|${t.tanggal?.slice(0, 7)}`; hitung[k] = (hitung[k] || 0) + 1; });
    const t0 = Date.now();
    const rows = c.pilih.map((b, i) => {
      const ym = b.tanggal.slice(0, 7), k = `${b.jenis}|${ym}`;
      hitung[k] = (hitung[k] || 0) + 1;
      return { jenis: b.jenis, tanggal: b.tanggal, nominal: Math.round(b.nominal), akun_id: KB.akunId, akun_tujuan_id: null, kategori_id: b.kategori_id || null,
        pihak: null, keterangan: b.uraian.trim(), metode: "Tunai", dicatat_oleh: STATE.guruId || null, dihapus: false,
        dibuat_at: new Date(t0 + i).toISOString(), nomor_bukti: `${b.jenis === "masuk" ? "KM" : "KK"}/${ym.replace("-", "")}/${String(hitung[k]).padStart(3, "0")}` };
    });
    for (let i = 0; i < rows.length; i += 200) { const { error } = await supa.from("kas_transaksi").insert(rows.slice(i, i + 200)); if (error) throw error; }
    closeModal();
    KB.baris = [];
    KAS.bulan = rows[rows.length - 1].tanggal.slice(0, 7); KAS.tab = "transaksi";
    await renderKasInit();
    const kini = kasSaldoAkun(akun.id);
    if (Math.round(kini) === Math.round(saldoHarus)) toast(`✓ ${rows.length} transaksi tersimpan · saldo ${akun.nama} ${_kasRp(kini)}`, "ok");
    else await konfirmasiTema(`Tersimpan, tetapi saldo ${escapeHtml(akun.nama)} di aplikasi ${_kasRp(kini)} sedangkan seharusnya ${_kasRp(saldoHarus)}. Periksa tab Buku Kas.`, { ikon: "⚠️", judul: "Saldo tidak sama" });
  } catch (e) { console.error(e); toast("Gagal menyimpan: " + _kasPesanGalat(e), "err"); }
  finally { _KB_SEDANG = false; setGlobalLoading(false); }
}

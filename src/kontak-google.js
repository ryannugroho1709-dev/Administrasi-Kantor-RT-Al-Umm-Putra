// ============================================================
//  SINKRON NOMOR WA GURU DENGAN KONTAK GOOGLE
//  Supaya tag @nomor di pesan WhatsApp (pengumpulan soal, absensi, dll.) tepat orangnya, nomor WA guru di
//  aplikasi disamakan dengan nomor yang tersimpan di Kontak Google admin.
//  Cara: contacts.google.com → Ekspor → "Google CSV" (atau vCard) → unggah di sini. File hanya dibaca di
//  perangkat ini (tidak diunggah ke server); yang disimpan hanya nomor WA guru yang dicentang.
// ============================================================
const KG = { hasil: [] };

function guruSinkronKontak() {
  openModal(`<div class="kg">
    <h3>📇 Sinkron nomor WA dengan Kontak Google</h3>
    <div class="kg-langkah">
      <div><b>1</b><span>Buka <a href="https://contacts.google.com" target="_blank" rel="noopener">contacts.google.com</a> (akun Google yang dipakai di HP).</span></div>
      <div><b>2</b><span>Tekan <b>Ekspor</b> (ikon ⬇ di kiri / menu ⋮) → pilih <b>Google CSV</b> → Ekspor.</span></div>
      <div><b>3</b><span>Unggah file <b>contacts.csv</b> di bawah. Aplikasi mencocokkan nama guru dengan nama kontak.</span></div>
    </div>
    <label class="kg-unggah"><span>📤</span><b>Pilih file kontak</b><small>contacts.csv (Google CSV) atau .vcf</small><input type="file" accept=".csv,.vcf,text/csv,text/vcard" hidden onchange="kgBaca(this)"></label>
    <div class="kg-ket">🔒 File kontak hanya dibaca di perangkat ini dan tidak dikirim ke mana pun. Yang disimpan hanya nomor WA guru yang Antum centang.</div>
  </div>`, { lebar: true });
}

// ── baca file ──
function _kgCsv(teks) {
  const baris = [], b = []; let sel = "", kutip = false;
  for (let i = 0; i < teks.length; i++) {
    const c = teks[i];
    if (kutip) { if (c === '"' && teks[i + 1] === '"') { sel += '"'; i++; } else if (c === '"') kutip = false; else sel += c; }
    else if (c === '"') kutip = true;
    else if (c === ",") { b.push(sel); sel = ""; }
    else if (c === "\n" || c === "\r") { if (c === "\r" && teks[i + 1] === "\n") i++; b.push(sel); baris.push(b.splice(0)); sel = ""; }
    else sel += c;
  }
  if (sel || b.length) { b.push(sel); baris.push(b.splice(0)); }
  return baris.filter((r) => r.some((x) => x.trim()));
}
function _kgDariCsv(teks) {
  const rows = _kgCsv(teks.replace(/^﻿/, "")); if (!rows.length) return [];
  const h = rows[0].map((x) => x.trim().toLowerCase());
  const k = (re) => h.findIndex((x) => re.test(x));
  const iNama = k(/^name$/), iDepan = k(/^(first name|given name)$/), iTengah = k(/^(middle name|additional name)$/), iBelakang = k(/^(last name|family name)$/), iPanggil = k(/^nickname$/);
  const iTelp = h.map((x, i) => (/^phone \d+ - value$/.test(x) ? i : -1)).filter((i) => i >= 0);
  return rows.slice(1).map((r) => {
    const nama = (iNama >= 0 && r[iNama]) || [iDepan, iTengah, iBelakang].filter((i) => i >= 0).map((i) => r[i]).filter(Boolean).join(" ") || (iPanggil >= 0 ? r[iPanggil] : "");
    const nomor = iTelp.flatMap((i) => String(r[i] || "").split(":::")).map((x) => normalisasiNomorWa(x)).filter((x) => x.valid).map((x) => x.nomor);
    return { nama: String(nama || "").trim(), nomor: [...new Set(nomor)] };
  }).filter((c) => c.nama && c.nomor.length);
}
function _kgDariVcf(teks) {
  return teks.split(/END:VCARD/i).map((kartu) => {
    const fn = (kartu.match(/^FN[^:]*:(.*)$/im) || [])[1] || "";
    const nomor = [...kartu.matchAll(/^TEL[^:]*:(.*)$/gim)].map((m) => normalisasiNomorWa(m[1])).filter((x) => x.valid).map((x) => x.nomor);
    return { nama: fn.trim(), nomor: [...new Set(nomor)] };
  }).filter((c) => c.nama && c.nomor.length);
}
// nama tanpa gelar/sapaan, untuk dicocokkan
const _KG_GELAR = /\b(ustadz|ustadzah|ustad|ustaz|ust|ustd|ustz|pak|bapak|bu|ibu|kak|abah|umi|dr|drs|ir|hj?|lc|ma|m\s?a|m\s?pd|s\s?pd|s\s?ag|s\s?h|s\s?hi|s\s?sos|s\s?e|s\s?t|s\s?kom|s\s?si|s\s?psi|m\s?si|m\s?h|m\s?ag|m\s?kom|m\s?e|guru|pkbm|alumm|al\s?umm|rt|putra)\b/g;
function _kgKata(nama) {
  return String(nama || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[.,'`’()\-_/]/g, " ").replace(_KG_GELAR, " ")
    .replace(/\b(muhammad|muhamad|mohammad|moh|muh|m)\b/g, "muhammad").replace(/\s+/g, " ").trim().split(" ").filter((w) => w.length > 1);
}
function _kgSkor(a, b) {
  const A = _kgKata(a), B = _kgKata(b); if (!A.length || !B.length) return 0;
  const sama = A.filter((w) => B.some((v) => v === w || (w.length >= 4 && v.length >= 4 && (v.startsWith(w) || w.startsWith(v))))).length;
  const inti = A.filter((w) => w !== "muhammad").length && B.filter((w) => w !== "muhammad").length;
  const samaInti = A.filter((w) => w !== "muhammad" && B.includes(w)).length;
  if (inti && !samaInti && sama <= 1) return 0; // hanya sama "Muhammad" saja → bukan orang yang sama
  return sama / Math.min(A.length, B.length);
}
async function kgBaca(input) {
  const f = input.files && input.files[0]; input.value = ""; if (!f) return;
  try {
    setGlobalLoading(true, "Membaca kontak…");
    const teks = await f.text();
    const kontak = /BEGIN:VCARD/i.test(teks) ? _kgDariVcf(teks) : _kgDariCsv(teks);
    if (!kontak.length) { toast("Tidak ada kontak bernomor HP di file ini. Pastikan memilih format Google CSV.", "err"); return; }
    const guru = (await apiGetAllGuru()).filter((g) => g.status_aktif !== false);
    KG.hasil = guru.map((g) => {
      const kini = normalisasiNomorWa(g.no_wa);
      const calon = kontak.map((c) => ({ c, s: _kgSkor(g.nama, c.nama) })).filter((x) => x.s >= 0.6).sort((a, b) => b.s - a.s || (b.c.nomor.includes(kini.nomor) ? 1 : 0) - (a.c.nomor.includes(kini.nomor) ? 1 : 0));
      const pas = calon[0];
      const dariNomor = kini.valid ? kontak.find((c) => c.nomor.includes(kini.nomor)) : null;
      let status, nomorBaru = null, namaKontak = pas?.c.nama || "";
      if (pas && kini.valid && pas.c.nomor.includes(kini.nomor)) status = "sama";
      else if (pas) { status = kini.valid ? "beda" : "isi"; nomorBaru = pas.c.nomor[0]; }
      else if (dariNomor) { status = "sama"; namaKontak = dariNomor.nama; }
      else status = "tidak";
      return { g, kini: kini.valid ? kini.nomor : (g.no_wa || ""), nomorBaru, pilihan: pas ? pas.c.nomor : [], namaKontak, ragu: pas && pas.s < 0.99 && calon[1] && calon[1].s === pas.s, status, pilih: status === "isi" || status === "beda" };
    }).sort((a, b) => ["beda", "isi", "tidak", "sama"].indexOf(a.status) - ["beda", "isi", "tidak", "sama"].indexOf(b.status) || a.g.nama.localeCompare(b.g.nama, "id"));
    KG.jumlahKontak = kontak.length;
    _kgGambar();
  } catch (e) { console.error(e); toast("Gagal membaca file: " + (e.message || e), "err"); }
  finally { setGlobalLoading(false); }
}
function _kgGambar() {
  const H = KG.hasil, hit = (s) => H.filter((x) => x.status === s).length;
  const lbl = { sama: ["ok", "✓ sudah sama"], beda: ["beda", "nomor beda"], isi: ["isi", "nomor kosong di aplikasi"], tidak: ["tidak", "tidak ditemukan di kontak"] };
  openModal(`<div class="kg">
    <h3>📇 Hasil cocokkan Kontak Google</h3>
    <div class="kg-ket">${KG.jumlahKontak} kontak bernomor HP dibaca · ${H.length} guru aktif</div>
    <div class="kg-ubin"><div class="ok"><b>${hit("sama")}</b><span>sudah sama</span></div><div class="beda"><b>${hit("beda")}</b><span>nomor beda</span></div><div class="isi"><b>${hit("isi")}</b><span>belum ada nomor</span></div><div class="tidak"><b>${hit("tidak")}</b><span>tidak ketemu</span></div></div>
    <div class="kg-daftar">${H.map((x, i) => `<div class="kg-baris ${x.status}">
      ${x.nomorBaru ? `<input type="checkbox" ${x.pilih ? "checked" : ""} onchange="KG.hasil[${i}].pilih=this.checked" aria-label="Perbarui">` : `<span class="kg-kosong"></span>`}
      <div class="kg-nama"><b>${escapeHtml(x.g.nama)}</b><small>${x.namaKontak ? `kontak: ${escapeHtml(x.namaKontak)}${x.ragu ? " · <i>periksa, ada nama mirip</i>" : ""}` : "—"}</small></div>
      <div class="kg-nomor">${x.status === "beda" ? `<s>${escapeHtml(x.kini)}</s>` : x.kini ? escapeHtml(x.kini) : "<i>kosong</i>"}${x.nomorBaru ? ` → ${x.pilihan.length > 1 ? `<select class="input" onchange="KG.hasil[${i}].nomorBaru=this.value">${x.pilihan.map((n) => `<option>${n}</option>`).join("")}</select>` : `<b>${x.nomorBaru}</b>`}` : ""}</div>
      <span class="kg-st ${lbl[x.status][0]}">${lbl[x.status][1]}</span></div>`).join("")}</div>
    <button class="btn btn-accent" style="width:100%;margin-top:12px" onclick="kgSimpan()" ${hit("beda") + hit("isi") ? "" : "disabled"}>💾 Perbarui nomor WA yang dicentang</button>
  </div>`, { lebar: true });
}
async function kgSimpan() {
  const pilih = KG.hasil.filter((x) => x.pilih && x.nomorBaru);
  if (!pilih.length) { toast("Belum ada yang dicentang", "info"); return; }
  if (!(await konfirmasiTema(`Perbarui nomor WA <b>${pilih.length} guru</b> sesuai Kontak Google?`, { ikon: "📇", judul: "Sinkron nomor WA", teksYa: "Perbarui" }))) { _kgGambar(); return; }
  let n = 0;
  try { setGlobalLoading(true, "Memperbarui nomor WA…"); for (const x of pilih) { await apiSimpanGuru({ id: x.g.id, no_wa: x.nomorBaru }); const lk = (LOOKUP.guruAll || []).find((g) => g.id === x.g.id); if (lk) lk.no_wa = x.nomorBaru; n++; } toast(`📇 ${n} nomor WA guru diperbarui`, "ok"); }
  catch (e) { toast(`Diperbarui ${n}, gagal: ${e.message}`, "err"); }
  finally { setGlobalLoading(false); }
  closeModal();
  if (STATE.currentPage === "data-guru" && typeof renderDataGuru === "function") renderDataGuru();
}

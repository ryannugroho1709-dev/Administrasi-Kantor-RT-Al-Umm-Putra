// ============================================================
//  UJIAN & LATIHAN SANTRI (sisi guru)
//  • Bank soal per bab (impor JSON) → kunci disimpan terpisah, tidak terbaca santri.
//  • Guru membuka sesi untuk satu kelas (latihan / ujian, durasi, token, acak soal).
//  • Santri mengerjakan di santri.html (pilih kelas → ujian → nama), dinilai di server.
//  • Rekap: nilai PG/PGK otomatis, uraian dinilai guru, lalu "Kirim ke rapor"
//    → nilai_rapor.ulangan_harian[bab − 1] (Ujian Bab N = Ulangan Harian N).
//  Butuh SQL_UJIAN_SANTRI.sql sudah dijalankan di Supabase.
// ============================================================
const UJ = { bank: [], sesi: [], rekapSesi: null, rekapTimer: null };
const UJ_LABEL = { pg: "Pilihan Ganda", pgk: "PG Kompleks", uraian: "Uraian" };

function _ujPesan(e) {
  const m = (e && e.message) || String(e);
  if (/susulan|tampil_hasil|ujian_hasil_rinci/i.test(m) && /column|schema cache|does not exist/i.test(m))
    return "Fitur ini butuh pembaruan database: jalankan SQL_UJIAN_SANTRI_2.sql di Supabase → SQL Editor.";
  if (/ujian_\w+.*(does not exist|schema cache)|relation .*ujian_/i.test(m) || /Could not find the function public\.ujian/i.test(m))
    return "Fitur ujian belum aktif: jalankan file SQL_UJIAN_SANTRI.sql di Supabase → SQL Editor.";
  return m;
}
async function _ujRpc(nama, arg) {
  const { data, error } = await supa.rpc(nama, arg);
  if (error) throw new Error(_ujPesan(error));
  return data;
}
function _ujTautanSantri() {
  return location.origin + location.pathname.replace(/[^/]*$/, "") + "santri.html";
}
function _ujSemesterSekarang(tglISO) {
  const ym = (tglISO || tanggalISO()).slice(0, 7);
  return typeof _kbTahunAjaran === "function" ? _kbTahunAjaran(ym) : { ta: "", semester: "Ganjil" };
}
const _ujNamaKelas = (id) => (LOOKUP.kelas.find((k) => k.id === id) || {}).nama_kelas || "-";
const _ujNamaMapel = (id) => (LOOKUP.mapel.find((m) => m.id === id) || {}).nama_mapel || "-";
// Jenis penilaian tiap bank soal (dipilih saat membuat soal): uh | tugas | uts | uas, + ke- (untuk UH/Tugas).
// Disimpan di kuliah_pengaturan "ujian:jenis" (tanpa kolom baru di tabel ujian_bank).
const UJ_JENIS_NILAI = { uh: "Ulangan Harian", tugas: "Tugas", uts: "UTS", uas: "UAS" };
function _ujJenisNilai(b) {
  const x = (UJ.jenisNilai || {})[b && b.id];
  if (x && x.jenis) return { jenis: x.jenis, ke: Number(x.ke) || 1 };
  const j = String((b && b.judul) || "").toLowerCase();
  const tebak = /\buas\b|akhir semester|ujian akhir|\bpas\b|\bpat\b|sumatif akhir/.test(j) ? "uas" : /\buts\b|tengah semester|\bpts\b/.test(j) ? "uts" : "uh";
  return { jenis: tebak, ke: Math.max(1, Number(b && b.bab) || 1) };
}
const _ujLabelJenis = (b) => { const x = _ujJenisNilai(b); return x.jenis === "uh" || x.jenis === "tugas" ? `${UJ_JENIS_NILAI[x.jenis]} ${x.ke}` : UJ_JENIS_NILAI[x.jenis]; };
async function _ujSimpanJenis(bankId, jenis, ke, info) {
  if (!bankId || !jenis) return;
  try { const d = await _kvAmbil("ujian:jenis", {}); d[bankId] = { jenis, ke: Number(ke) || 1, ...(info || {}), t: new Date().toISOString() }; await _kvSimpan("ujian:jenis", d); UJ.jenisNilai = d; }
  catch (e) { console.warn("Jenis nilai tidak tersimpan:", e); }
}
const _ujJumlahSoal = (bagian) => (bagian || []).reduce((a, b) => a + (b.soal || []).length, 0);

// ── PIN Kunci Ujian (disimpan di perangkat guru setelah benar sekali) ──
async function _ujPin(judul) {
  let pin = "";
  try { pin = localStorage.getItem("ujianPin") || ""; } catch (e) {}
  if (pin && (await _ujRpc("ujian_pin_cek", { p_pin: pin }))) return pin;
  const ada = await _ujRpc("ujian_pin_ada", {});
  if (!ada) {
    if (!isAdmin()) { toast("Admin belum membuat PIN Kunci Ujian. Minta admin membuatnya di menu Ujian & Latihan.", "err"); return null; }
    return await ujAturPin(true);
  }
  const pr = promptTema("Masukkan PIN Kunci Ujian (minta ke admin). PIN diingat di perangkat ini.", "", { judul: judul || "PIN Kunci Ujian", ikon: "🔐", teksOk: "Buka" });
  const inp = qs("prompt-tema-input"); if (inp) { inp.type = "password"; inp.autocomplete = "off"; }
  const val = await pr;
  if (!val) return null;
  if (!(await _ujRpc("ujian_pin_cek", { p_pin: val }))) { toast("PIN salah", "err"); return null; }
  try { localStorage.setItem("ujianPin", val); } catch (e) {}
  return val;
}
async function ujAturPin(pertama) {
  try {
    const ada = await _ujRpc("ujian_pin_ada", {});
    let lama = null;
    if (ada) {
      const p1 = promptTema("PIN lama", "", { judul: "Ganti PIN Kunci Ujian", ikon: "🔐", teksOk: "Lanjut" });
      const i1 = qs("prompt-tema-input"); if (i1) i1.type = "password";
      lama = await p1; if (!lama) return null;
    }
    const p2 = promptTema(`${pertama ? "Buat PIN untuk melindungi kunci jawaban & rekap nilai. Bagikan PIN ini hanya ke guru. " : ""}PIN baru (minimal 4 karakter)`, "", { judul: "PIN Kunci Ujian", ikon: "🔐", teksOk: "Simpan" });
    const i2 = qs("prompt-tema-input"); if (i2) i2.type = "password";
    const baru = await p2; if (!baru) return null;
    await _ujRpc("ujian_pin_atur", { p_lama: lama, p_baru: baru });
    try { localStorage.setItem("ujianPin", baru); } catch (e) {}
    toast("PIN Kunci Ujian tersimpan", "ok");
    return baru;
  } catch (e) { toast(_ujPesan(e), "err"); return null; }
}

// ── Halaman utama ──
async function renderUjianInit() {
  const root = qs("ujian-root"); if (!root) return;
  const url = _ujTautanSantri();
  root.innerHTML = `
    <div class="card uj-hero">
      <div style="flex:1;min-width:220px">
        <div style="font-weight:800;font-size:16px">📝 Ruang Santri</div>
        <div style="font-size:12.5px;color:var(--text-secondary);line-height:1.6;margin-top:4px">Santri membuka tautan ini (atau tombol <b>🎓 Masuk sebagai Santri</b> di layar Pilih Nama), memilih kelas → ujian/latihan → namanya. Kunci jawaban tidak pernah dikirim ke santri.</div>
        <div class="uj-tautan"><code>${escapeHtml(url)}</code></div>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:flex-start">
        <button class="btn btn-outline" onclick="ujSalinTautan()">📋 Salin tautan</button>
        <button class="btn btn-outline" onclick="window.open('${url}','_blank')">↗ Buka</button>
        ${isAdmin() ? `<button class="btn btn-ghost" onclick="ujAturPin()">🔐 PIN</button>` : ""}
      </div>
    </div>
    <div class="card" style="margin-top:14px">
      <div class="uj-judul-bagian"><span>🟢 Sesi latihan & ujian</span><button class="btn btn-ghost btn-sm" onclick="ujMuat()">↻</button></div>
      <div id="uj-sesi">${loadingHTML("Memuat sesi…")}</div>
    </div>
    <div class="card" style="margin-top:14px">
      <div class="uj-judul-bagian"><span>📚 Bank soal per bab</span>
        <span class="uj-aksi">
          <button class="btn btn-sm uj-b-hijau" onclick="ujEditorBuka()">✨ Buat soal baru</button>
          <button class="btn btn-sm uj-b-ungu" onclick="ujEditorBuka().then(()=>UJE.m&&ujeTempelBuka())">📋 Tempel dari Word</button>
          <label class="btn btn-sm uj-b-abu" style="cursor:pointer" title="Untuk file .json (mis. dari cadangan)">⬆️ Impor .json<input type="file" accept=".json,application/json" style="display:none" onchange="ujImporBank(event)"></label>
        </span></div>
      <div id="uj-bank">${loadingHTML("Memuat bank soal…")}</div>
    </div>`;
  await ujMuat();
}
function ujSalinTautan() {
  const url = _ujTautanSantri();
  (navigator.clipboard ? navigator.clipboard.writeText(url) : Promise.reject()).then(() => toast("Tautan Ruang Santri disalin", "ok"), () => promptTema("Salin tautan ini:", url, { judul: "Tautan Ruang Santri", ikon: "🔗" }));
}
async function ujMuat() {
  try {
    UJ.jenisNilai = await _kvAmbil("ujian:jenis", {}).catch(() => ({}));
    const [bank, sesi] = await Promise.all([
      supa.from("ujian_bank").select("id,kode,mapel_id,tingkat,bab,judul,soal,skor_maksimal,updated_at,dibuat_oleh").order("tingkat").order("bab"),
      supa.from("ujian_sesi").select("*").order("created_at", { ascending: false }).limit(60),
    ]);
    if (bank.error) throw bank.error;
    if (sesi.error) throw sesi.error;
    UJ.bank = bank.data || [];
    UJ.sesi = (sesi.data || []).filter((s) => isAdmin() || !s.guru_id || s.guru_id === STATE.guruId);
  } catch (e) {
    const m = `<div style="padding:14px;color:var(--danger,#c0392b);font-size:13px">⚠️ ${escapeHtml(_ujPesan(e))}</div>`;
    if (qs("uj-sesi")) qs("uj-sesi").innerHTML = m;
    if (qs("uj-bank")) qs("uj-bank").innerHTML = "";
    return;
  }
  _ujGambarSesi(); _ujGambarBank();
}
// Nama tampilan bank: mapel gabungan (mis. "Geografi/Sosiologi/Ek") dipecah memakai judul bank → "Ekonomi"
function _ujNamaMapelTampil(b) {
  const nama = _ujNamaMapel(b.mapel_id);
  const subs = typeof _maSubMapel === "function" ? _maSubMapel(nama) : null;
  const sub = subs && typeof _maSubDariJudul === "function" ? _maSubDariJudul(b.judul, subs) : null;
  return sub || nama;
}
const _ujKelasAngka = (t) => parseInt(String(t || "").replace(/\D/g, ""), 10) || 99;
function _ujGambarBank() {
  const el = qs("uj-bank"); if (!el) return;
  if (!UJ.bank.length) { el.innerHTML = `<div class="uj-kosong">Belum ada bank soal. Tekan <b>✨ Buat soal baru</b> atau <b>📋 Tempel dari Word</b>.</div>`; return; }
  // penyaring kelas & mapel (diingat di perangkat)
  const pilihan = UJ.saring || (UJ.saring = (() => { try { return JSON.parse(localStorage.getItem("ujSaring") || "{}"); } catch (e) { return {}; } })());
  const kelasAda = [...new Set(UJ.bank.map((b) => String(b.tingkat || "-")))].sort((a, b) => _ujKelasAngka(a) - _ujKelasAngka(b));
  const mapelAda = [...new Set(UJ.bank.map(_ujNamaMapelTampil))].sort((a, b) => a.localeCompare(b, "id"));
  const daftar = UJ.bank.filter((b) => (!pilihan.kelas || String(b.tingkat || "-") === pilihan.kelas) && (!pilihan.mapel || _ujNamaMapelTampil(b) === pilihan.mapel));
  const grup = new Map();
  daftar.slice().sort((a, b) => _ujKelasAngka(a.tingkat) - _ujKelasAngka(b.tingkat) || _ujNamaMapelTampil(a).localeCompare(_ujNamaMapelTampil(b), "id") || (a.bab || 0) - (b.bab || 0))
    .forEach((b) => { const k = `Kelas ${b.tingkat || "-"} · ${_ujNamaMapelTampil(b)}`; if (!grup.has(k)) grup.set(k, []); grup.get(k).push(b); });
  const saringHtml = UJ.bank.length > 1 ? `<div class="uj-saring">
      <select onchange="UJ.saring.kelas=this.value;_ujSimpanSaring()"><option value="">🏫 Semua kelas</option>${kelasAda.map((k) => `<option value="${escapeHtml(k)}" ${pilihan.kelas === k ? "selected" : ""}>Kelas ${escapeHtml(k)}</option>`).join("")}</select>
      <select onchange="UJ.saring.mapel=this.value;_ujSimpanSaring()"><option value="">📘 Semua mapel</option>${mapelAda.map((m) => `<option ${pilihan.mapel === m ? "selected" : ""}>${escapeHtml(m)}</option>`).join("")}</select>
      <span class="uj-sub">${daftar.length} dari ${UJ.bank.length} bank soal</span></div>` : "";
  el.innerHTML = saringHtml + ([...grup.entries()].map(([judulGrup, isi]) => `<div class="uj-grup-judul">${escapeHtml(judulGrup)} <span>${isi.length}</span></div><div class="uj-daftar">${isi.map((b) => {
    const pembuat = (LOOKUP.guruAll || []).find((g) => g.id === b.dibuat_oleh);
    const adaGambar = JSON.stringify(b.soal || []).includes('"g":"http');
    return `
    <div class="uj-item">
      <div class="uj-ikon">📘</div>
      <div style="flex:1;min-width:0"><b>${escapeHtml(b.judul)}</b>
        <div class="uj-sub">${escapeHtml(_ujNamaMapelTampil(b))} · Kelas ${escapeHtml(b.tingkat || "-")} · Bab ${b.bab} · ${_ujJumlahSoal(b.soal)} soal${adaGambar ? " · 🖼️ bergambar" : ""} · → ${escapeHtml(_ujLabelJenis(b))}${pembuat ? ` · oleh ${escapeHtml(typeof _namaSingkatTopbar === "function" ? _namaSingkatTopbar(pembuat.nama) : pembuat.nama)}` : ""}</div></div>
      <div class="uj-aksi">
        <button class="btn btn-accent btn-sm" onclick="ujBukaSesiModal('${b.id}')">▶ Buka sesi</button>
        <button class="btn btn-sm uj-b-ungu" onclick="ujEditorBuka('${b.id}')" title="Ubah soal, kunci, gambar">✏️ Ubah</button>
        <button class="btn btn-sm uj-b-emas" onclick="ujLihatKunci('${b.id}')" title="Lihat kunci jawaban (PIN)">🔑</button>
        <button class="btn btn-sm uj-b-abu" onclick="ujCetakSoal('${b.id}')" title="Cetak / simpan PDF naskah soal untuk arsip">🖨️</button>
        ${isAdmin() ? `<button class="btn btn-sm uj-b-merah" onclick="ujHapusBank('${b.id}')" title="Hapus bank soal">🗑️</button>` : ""}
      </div>
    </div>`; }).join("")}</div>`).join("") || `<div class="uj-kosong">Tidak ada bank soal untuk saringan ini.</div>`);
}
function _ujSimpanSaring() { try { localStorage.setItem("ujSaring", JSON.stringify(UJ.saring || {})); } catch (e) {} _ujGambarBank(); }
function _ujGambarSesi() {
  const el = qs("uj-sesi"); if (!el) return;
  if (!UJ.sesi.length) { el.innerHTML = `<div class="uj-kosong">Belum ada sesi. Pilih bank soal di bawah lalu tekan <b>▶ Buka sesi</b>.</div>`; return; }
  el.innerHTML = `<div class="uj-daftar">${UJ.sesi.map((s) => {
    const b = UJ.bank.find((x) => x.id === s.bank_id) || {};
    return `<div class="uj-item ${s.dibuka ? "" : "uj-tutup"}">
      <div class="uj-ikon">${s.mode === "ujian" ? "📝" : "🎯"}</div>
      <div style="flex:1;min-width:0"><b>${escapeHtml(b.judul || "Bank soal terhapus")}</b>
        <div class="uj-sub">${escapeHtml(_ujNamaKelas(s.kelas_id))} · <span class="uj-lencana ${s.mode}">${s.mode === "ujian" ? "UJIAN" : "LATIHAN"}</span>${s.durasi_menit ? ` · ${s.durasi_menit} mnt` : ""}${s.token ? ` · token <b>${escapeHtml(s.token)}</b>` : ""} · ${s.dibuka ? "<b style='color:var(--success,#1F8A5F)'>dibuka</b>" : "ditutup"}${s.dikirim_rapor_at ? " · ✅ sudah ke rapor" : ""}
        · ${new Date(s.created_at).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "short" })}</div></div>
      <div class="uj-aksi">
        <button class="btn btn-accent btn-sm" onclick="ujBukaRekap('${s.id}')">📊 Rekap</button>
        <button class="btn btn-ghost btn-sm" onclick="ujToggleSesi('${s.id}')">${s.dibuka ? "⏹ Tutup" : "▶ Buka lagi"}</button>
      </div>
    </div>`; }).join("")}</div>`;
}

// ── Impor bank soal JSON ──
function _ujPisahKunci(j) {
  const bagian = j.bagian || [];
  const publik = bagian.map((b) => ({ ...b, soal: (b.soal || []).map(({ k, kunci, poin_kunci, cek, catatan, penjelasan, ...r }) => r) }));
  const kunci = { skor_maksimal: j.skor_maksimal || 100, bagian: bagian.map((b) => ({ jenis: b.jenis, poin: b.poin, soal: (b.soal || []).map((s) => ({ no: s.no, k: s.k, poin: s.poin, kunci: s.kunci, poin_kunci: s.poin_kunci, cek: s.cek, catatan: s.catatan, penjelasan: s.penjelasan })) })) };
  return { publik, kunci };
}
function _ujValidasiBank(j) {
  const err = [];
  if (!j || !Array.isArray(j.bagian) || !j.bagian.length) err.push("Tidak ada 'bagian' soal.");
  (j.bagian || []).forEach((b) => {
    if (!["pg", "pgk", "uraian"].includes(b.jenis)) err.push(`Jenis bagian tidak dikenal: ${b.jenis}`);
    (b.soal || []).forEach((s) => {
      const id = `${b.jenis} no ${s.no}`;
      if (s.no === undefined) err.push(`Soal tanpa nomor di ${b.jenis}`);
      if (b.jenis === "pg" && (s.k === undefined || !(s.o || []).length)) err.push(`${id}: opsi/kunci kosong`);
      if (b.jenis === "pg" && [].concat(s.k).some((k) => k < 0 || k >= (s.o || []).length)) err.push(`${id}: kunci di luar opsi`);
      if (b.jenis === "pgk" && (!Array.isArray(s.k) || !s.k.length)) err.push(`${id}: kunci harus berupa daftar`);
    });
  });
  return err;
}
async function ujImporBank(ev) {
  const f = ev.target.files && ev.target.files[0]; ev.target.value = "";
  if (!f) return;
  let j;
  try { j = JSON.parse(await f.text()); } catch (e) { toast("File bukan JSON yang valid", "err"); return; }
  const err = _ujValidasiBank(j);
  if (err.length) { openModal(`<h3>⚠️ Bank soal belum valid</h3><ul style="font-size:12.5px;line-height:1.7">${err.slice(0, 15).map((x) => `<li>${escapeHtml(x)}</li>`).join("")}</ul>`); return; }
  const mapelCocok = LOOKUP.mapel.find((m) => m.nama_mapel.toLowerCase().trim() === String(j.mapel || "").toLowerCase().trim());
  const cek = (j.bagian || []).flatMap((b) => (b.soal || []).filter((s) => s.cek).map((s) => `${UJ_LABEL[b.jenis]} no ${s.no}`));
  openModal(`<h3>⬆️ Impor bank soal</h3>
    <div style="font-size:12.5px;color:var(--text-secondary);margin-bottom:12px"><b>${escapeHtml(j.judul || f.name)}</b><br>${(j.bagian || []).map((b) => `${UJ_LABEL[b.jenis]}: ${(b.soal || []).length} soal × ${b.poin} poin`).join(" · ")}</div>
    <div class="field"><label class="form-label">Kode unik</label><input id="uj-i-kode" class="input" value="${escapeHtml(j.id || f.name.replace(/\.json$/i, ""))}"></div>
    <div class="field"><label class="form-label">Judul</label><input id="uj-i-judul" class="input" value="${escapeHtml(j.judul || "")}"></div>
    <div class="field"><label class="form-label">Mapel</label><select id="uj-i-mapel" class="input">${LOOKUP.mapel.map((m) => `<option value="${m.id}" ${mapelCocok && mapelCocok.id === m.id ? "selected" : ""}>${escapeHtml(m.nama_mapel)}</option>`).join("")}</select></div>
    <div style="display:flex;gap:10px">
      <div class="field" style="flex:1"><label class="form-label">Kelas (tingkat)</label><input id="uj-i-tingkat" class="input" value="${escapeHtml(j.kelas || "")}"></div>
      <div class="field" style="flex:1"><label class="form-label">Bab → Ulangan Harian ke-</label><input id="uj-i-bab" type="number" min="1" class="input" value="${Number(j.bab) || 1}"></div>
    </div>
    ${cek.length ? `<div class="uj-peringatan">🔎 ${cek.length} kunci ditandai perlu dicek guru: ${escapeHtml(cek.join(", "))}. Periksa lewat tombol 🔑 setelah impor.</div>` : ""}
    <button class="btn btn-accent" style="width:100%;margin-top:8px" id="uj-i-ok">Simpan bank soal</button>`);
  qs("uj-i-ok").onclick = async () => {
    const isian = { kode: qs("uj-i-kode").value.trim(), judul: qs("uj-i-judul").value.trim(), mapel: qs("uj-i-mapel").value, tingkat: qs("uj-i-tingkat").value.trim(), bab: Number(qs("uj-i-bab").value) || 1 };
    if (!isian.kode || !isian.judul) { toast("Kode & judul wajib diisi", "err"); return; }
    try {
      const pin = await _ujPin("PIN untuk menyimpan kunci"); if (!pin) return;
      const { publik, kunci } = _ujPisahKunci(j);
      await _ujRpc("ujian_bank_simpan", { p_pin: pin, p_kode: isian.kode, p_mapel_id: isian.mapel, p_tingkat: isian.tingkat, p_bab: isian.bab, p_judul: isian.judul, p_soal: publik, p_kunci: kunci, p_skor_maksimal: j.skor_maksimal || 100, p_guru: STATE.guruId || null });
      toast("Bank soal tersimpan", "ok"); closeModal(); ujMuat();
    } catch (e) { toast(_ujPesan(e), "err"); }
  };
}
async function ujHapusBank(id) {
  const b = UJ.bank.find((x) => x.id === id); if (!b) return;
  if (!(await konfirmasiTema(`Hapus bank soal "${escapeHtml(b.judul)}"?\nSemua sesi & jawaban santri untuk bank ini ikut terhapus. Nilai yang sudah dikirim ke rapor tetap ada.`, { judul: "Hapus bank soal", ikon: "🗑️", teksYa: "Hapus" }))) return;
  try { const pin = await _ujPin(); if (!pin) return; await _ujRpc("ujian_bank_hapus", { p_pin: pin, p_bank: id }); toast("Bank soal dihapus", "ok"); ujMuat(); }
  catch (e) { toast(_ujPesan(e), "err"); }
}
async function ujLihatKunci(id) {
  const b = UJ.bank.find((x) => x.id === id); if (!b) return;
  try {
    const pin = await _ujPin(); if (!pin) return;
    const k = await _ujRpc("ujian_kunci_ambil", { p_pin: pin, p_bank: id });
    const H = "ABCDEFGHIJ";
    const isi = (b.soal || []).map((bg) => {
      const kb = ((k && k.bagian) || []).find((x) => x.jenis === bg.jenis) || { soal: [] };
      return `<div class="uj-judul-bagian" style="margin-top:12px"><span>${UJ_LABEL[bg.jenis]} · ${bg.poin} poin/soal</span></div>` + (bg.soal || []).map((s) => {
        const ks = kb.soal.find((x) => x.no === s.no) || {};
        const jaw = bg.jenis === "uraian" ? `<div class="uj-kunci-uraian">${escapeHtml(ks.kunci || "-")}${(ks.poin_kunci || []).length ? `<div class="uj-sub">Poin penilaian: ${ks.poin_kunci.map(escapeHtml).join(" · ")}</div>` : ""}</div>`
          : s.bs ? (s.o || []).map((o, i) => `<div style="font-size:12.5px">${ks.k && ks.k[i] ? "✅ " + escapeHtml(s.bs[0]) : "❌ " + escapeHtml(s.bs[1])} — ${escapeHtml(o)}</div>`).join("")
          : `<b>${[].concat(ks.k).map((i) => H[i] + ". " + escapeHtml((s.o || [])[i] || "")).join(" / ")}</b>`;
        return `<div class="uj-kunci-baris ${ks.cek ? "uj-cek" : ""}"><div class="uj-no">${s.no}</div><div style="flex:1"><div style="font-size:12.5px;margin-bottom:3px">${escapeHtml(String(s.t || "").replace(/\*\*/g, ""))}</div>${jaw}${ks.penjelasan ? `<div class="uj-penjelasan">💡 ${escapeHtml(ks.penjelasan).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")}</div>` : ""}${ks.catatan ? `<div class="uj-sub">📝 ${escapeHtml(ks.catatan)}</div>` : ""}${ks.cek ? `<div class="uj-sub" style="color:#a66a00">🔎 Mohon dicek guru</div>` : ""}</div></div>`;
      }).join("");
    }).join("");
    openModal(`<h3>🔑 Kunci · ${escapeHtml(b.judul)}</h3><div class="uj-sub" style="margin-bottom:6px">Hanya untuk guru. Untuk mengubah soal atau kunci, tekan <b>✏️ Ubah</b> pada bank soal ini.</div>${isi}`, { lebar: true });
  } catch (e) { toast(_ujPesan(e), "err"); }
}

// ── Buka sesi ──
function ujBukaSesiModal(bankId) {
  const b = UJ.bank.find((x) => x.id === bankId); if (!b) return;
  const cocok = LOOKUP.kelas.find((k) => b.tingkat && new RegExp(`\\b${String(b.tingkat).replace(/\D/g, "")}\\b`).test(k.nama_kelas));
  const { ta, semester } = _ujSemesterSekarang();
  openModal(`<h3>▶ Buka sesi · ${escapeHtml(b.judul)}</h3>
    <div class="field"><label class="form-label">Kelas</label><select id="uj-s-kelas" class="input">${LOOKUP.kelas.map((k) => `<option value="${k.id}" ${cocok && cocok.id === k.id ? "selected" : ""}>${escapeHtml(k.nama_kelas)}</option>`).join("")}</select></div>
    <div class="field"><label class="form-label">Jenis</label>
      <div class="uj-mode">
        <label><input type="radio" name="uj-s-mode" value="latihan" checked onchange="_ujModeBerubah()"> 🎯 <b>Latihan</b><span>Boleh diulang, nilai langsung keluar (PG saja). Tidak masuk rapor. Santri langsung melihat soal mana yang benar/belum tepat — jadi <b>jangan pakai bank soal yang sama untuk ujian</b>.</span></label>
        <label><input type="radio" name="uj-s-mode" value="ujian" onchange="_ujModeBerubah()"> 📝 <b>Ujian</b><span>Sekali kirim, uraian dinilai guru, bisa dikirim ke rapor sebagai <b>${escapeHtml(_ujLabelJenis(b))}</b>.</span></label>
      </div></div>
    <div style="display:flex;gap:10px">
      <div class="field" style="flex:1"><label class="form-label">Durasi (menit, kosong = bebas)</label><input id="uj-s-durasi" type="number" min="5" class="input" placeholder="mis. 60"></div>
      <div class="field" style="flex:1"><label class="form-label">Token masuk (opsional)</label><input id="uj-s-token" class="input" maxlength="8" placeholder="kosong = tanpa token" style="text-transform:uppercase"></div>
    </div>
    <label style="display:flex;gap:8px;align-items:center;font-size:12.5px;margin:4px 0 10px"><input type="checkbox" id="uj-s-acak"> Acak urutan soal PG untuk tiap santri</label>
    <div class="uj-sub" style="margin-bottom:10px">Nilai dicatat untuk semester <b>${semester} ${ta}</b>.</div>
    <button class="btn btn-accent" style="width:100%" onclick="ujSimpanSesi('${b.id}')">Buka sekarang</button>`);
}
function _ujModeBerubah() {
  const ujian = document.querySelector('input[name="uj-s-mode"]:checked')?.value === "ujian";
  const tok = qs("uj-s-token"), dur = qs("uj-s-durasi");
  if (ujian && tok && !tok.value) tok.value = Array.from({ length: 4 }, () => "ABCDEFGHJKMNPQRSTUVWXYZ23456789"[Math.floor(Math.random() * 31)]).join("");
  if (ujian && dur && !dur.value) dur.value = 60;
  if (ujian && qs("uj-s-acak")) qs("uj-s-acak").checked = true;
}
async function ujSimpanSesi(bankId) {
  const mode = document.querySelector('input[name="uj-s-mode"]:checked')?.value || "latihan";
  const { ta, semester } = _ujSemesterSekarang();
  const row = {
    bank_id: bankId, kelas_id: qs("uj-s-kelas").value, guru_id: STATE.guruId || null, mode,
    durasi_menit: Number(qs("uj-s-durasi").value) || null, token: qs("uj-s-token").value.trim().toUpperCase() || null,
    acak: qs("uj-s-acak").checked, dibuka: true, semester, tahun_ajaran: ta,
  };
  try {
    const { error } = await supa.from("ujian_sesi").insert(row);
    if (error) throw error;
    closeModal(); toast(`Sesi dibuka untuk ${_ujNamaKelas(row.kelas_id)}${row.token ? " · token " + row.token : ""}`, "ok"); ujMuat();
  } catch (e) { toast(_ujPesan(e), "err"); }
}
async function ujToggleSesi(id) {
  const s = UJ.sesi.find((x) => x.id === id); if (!s) return;
  if (s.dibuka && !(await konfirmasiTema("Tutup sesi ini? Santri yang sedang mengerjakan masih bisa mengirim jawabannya, tetapi santri baru tidak bisa mulai.", { judul: "Tutup sesi", ikon: "⏹", teksYa: "Tutup" }))) return;
  const { error } = await supa.from("ujian_sesi").update({ dibuka: !s.dibuka, ditutup_at: s.dibuka ? new Date().toISOString() : null }).eq("id", id);
  if (error) { toast(_ujPesan(error), "err"); return; }
  ujMuat();
}

// ── Rekap & penilaian ──
async function ujBukaRekap(sesiId) {
  const pin = await _ujPin("PIN untuk melihat rekap"); if (!pin) return;
  UJ.rekapSesi = sesiId;
  openModal(`<div id="uj-rekap">${loadingHTML("Memuat rekap…")}</div>`, { lebar: true });
  await _ujMuatRekap(pin);
  clearInterval(UJ.rekapTimer);
  UJ.rekapTimer = setInterval(() => {
    const s = UJ.sesi.find((x) => x.id === UJ.rekapSesi);
    if (!qs("uj-rekap")) { clearInterval(UJ.rekapTimer); return; }
    if (s && s.dibuka && !document.hidden) _ujMuatRekap(pin, true);
  }, 30000);
}
async function _ujMuatRekap(pin, diam) {
  const s = UJ.sesi.find((x) => x.id === UJ.rekapSesi); if (!s) return;
  const b = UJ.bank.find((x) => x.id === s.bank_id) || { soal: [] };
  try {
    const [siswa, rows, kunci] = await Promise.all([
      apiGetSiswaByKelas(s.kelas_id),
      _ujRpc("ujian_rekap", { p_pin: pin, p_sesi: s.id }),
      UJ.kunciCache && UJ.kunciCache.bank === b.id ? UJ.kunciCache.data : _ujRpc("ujian_kunci_ambil", { p_pin: pin, p_bank: b.id }),
    ]);
    UJ.kunciCache = { bank: b.id, data: kunci };
    UJ.rekap = { s, b, siswa, rows: rows || [], kunci, pin };
  } catch (e) { if (!diam && qs("uj-rekap")) qs("uj-rekap").innerHTML = `<div style="padding:14px">⚠️ ${escapeHtml(_ujPesan(e))}</div>`; return; }
  _ujGambarRekap();
}
function _ujMaks(kunci) {
  let obj = 0, ur = 0;
  ((kunci && kunci.bagian) || []).forEach((bg) => (bg.soal || []).forEach((s) => { const p = Number(s.poin || bg.poin || 1); bg.jenis === "uraian" ? (ur += p) : (obj += p); }));
  return { obj, ur };
}
function _ujGambarRekap() {
  const el = qs("uj-rekap"); if (!el || !UJ.rekap) return;
  const { s, b, siswa, rows, kunci } = UJ.rekap;
  const maks = _ujMaks(kunci);
  const byId = Object.fromEntries(rows.map((r) => [r.siswa_id, r]));
  const st = { mengerjakan: "⏳ mengerjakan", dikirim: "📨 tunggu nilai uraian", dinilai: "✅ selesai" };
  const selesai = rows.filter((r) => r.status === "dinilai" && r.nilai_akhir != null);
  const rata = selesai.length ? Math.round(selesai.reduce((a, r) => a + Number(r.nilai_akhir), 0) / selesai.length) : null;
  const kkm = typeof kkmMapel === "function" ? kkmMapel(b.mapel_id, s.kelas_id) : ((LOOKUP.mapel.find((m) => m.id === b.mapel_id) || {}).kkm || 75);
  const ujian = s.mode === "ujian";
  // analisis butir: % santri yang mendapat poin penuh per soal objektif
  const kirim = rows.filter((r) => r.rincian);
  const butir = [];
  ((kunci && kunci.bagian) || []).filter((bg) => bg.jenis !== "uraian").forEach((bg) => (bg.soal || []).forEach((so) => {
    const p = Number(so.poin || bg.poin || 1), key = `${bg.jenis}-${so.no}`;
    const penuh = kirim.filter((r) => Number(r.rincian[key]) >= p).length;
    butir.push({ label: `${bg.jenis === "pg" ? "" : "K"}${so.no}`, persen: kirim.length ? Math.round((penuh * 100) / kirim.length) : null });
  }));
  el.innerHTML = `
    <h3 style="margin-bottom:2px">📊 ${escapeHtml(b.judul || "")}</h3>
    <div class="uj-sub" style="margin-bottom:10px">${escapeHtml(_ujNamaKelas(s.kelas_id))} · ${ujian ? "UJIAN" : "LATIHAN"} · ${escapeHtml(s.semester || "")} ${escapeHtml(s.tahun_ajaran || "")}${s.token ? ` · token <b style="font-size:15px;letter-spacing:2px">${escapeHtml(s.token)}</b>` : ""} · ${s.dibuka ? "dibuka (rekap diperbarui tiap 30 detik)" : "ditutup"}</div>
    <div class="uj-statistik">
      <div><b>${rows.length}/${siswa.length}</b><span>mulai</span></div>
      <div><b>${rows.filter((r) => r.status !== "mengerjakan").length}</b><span>terkirim</span></div>
      <div><b>${rows.filter((r) => r.status === "dikirim").length}</b><span>uraian belum dinilai</span></div>
      <div><b>${rata ?? "–"}</b><span>rata-rata</span></div>
      <div><b>${selesai.filter((r) => Number(r.nilai_akhir) >= kkm).length}</b><span>tuntas (≥${kkm})</span></div>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin:10px 0">
      <button class="btn btn-outline btn-sm" onclick="_ujMuatRekap(UJ.rekap.pin)">↻ Muat ulang</button>
      ${ujian ? `<button class="btn btn-accent btn-sm" onclick="ujPilihKirimRapor()">📤 Kirim ke rapor (UH / UTS / UAS)</button>` : ""}
      ${ujian ? `<button class="btn btn-sm ${s.tampil_hasil ? "uj-b-hijau" : "uj-b-ungu"}" onclick="ujTampilHasil(${!s.tampil_hasil})" title="Santri bisa melihat nilai per bagian, soal yang benar/belum tepat (tanpa kunci), dan grafik kelas">${s.tampil_hasil ? "👁 Hasil terlihat santri · sembunyikan" : "👁 Tampilkan hasil ke santri"}</button>` : ""}
      <button class="btn btn-ghost btn-sm" onclick="ujUnduhRekap()">⬇️ Excel</button>
    </div>
    <div style="overflow:auto"><table class="simple-table uj-tabel"><thead><tr><th>No</th><th>Nama</th><th>Status</th><th>PG+PGK<br><small>/${maks.obj}</small></th>${ujian && maks.ur ? `<th>Uraian<br><small>/${maks.ur}</small></th>` : ""}<th>Nilai</th>${ujian ? "<th title='Berapa kali santri keluar dari halaman ujian (membuka aplikasi lain, tab lain, atau mematikan layar) selama mengerjakan'>Pindah<br>layar ⓘ</th>" : "<th>Coba</th>"}<th></th></tr></thead><tbody>
      ${siswa.map((sw, i) => { const r = byId[sw.id]; const ur = r && r.skor_uraian ? Object.values(r.skor_uraian).reduce((a, v) => a + Number(v || 0), 0) : null;
        return `<tr><td>${i + 1}</td><td>${escapeHtml(sw.nama)}</td><td style="white-space:nowrap">${r ? st[r.status] : "<span style='color:var(--text-secondary)'>belum</span>"}</td>
        <td>${r && r.skor_otomatis != null ? Number(r.skor_otomatis) : "–"}</td>
        ${ujian && maks.ur ? `<td>${r && r.status !== "mengerjakan" ? `<button class="btn btn-${r.status === "dikirim" ? "accent" : "ghost"} btn-sm" onclick="ujNilaiUraian('${r.id}')">${ur != null ? ur : "Nilai"}</button>` : "–"}</td>` : ""}
        <td><b class="${r && r.nilai_akhir != null ? (Number(r.nilai_akhir) >= kkm ? "uj-tuntas" : "uj-belum") : ""}">${r && r.nilai_akhir != null ? Math.round(r.nilai_akhir) : "–"}</b>${!ujian && r && r.nilai_terbaik != null ? `<div class="uj-sub">terbaik ${Math.round(r.nilai_terbaik)}</div>` : ""}</td>
        <td>${r ? (ujian ? (r.pindah_tab ? `<span style="color:#c0392b;font-weight:700">${r.pindah_tab}×</span>` : "0") : r.percobaan) : ""}</td>
        <td>${r ? `<button class="btn btn-ghost btn-sm" title="Hapus jawaban supaya santri bisa mengulang" onclick="ujResetJawaban('${r.id}','${escapeHtml(sw.nama).replace(/'/g, "")}')">↺</button>`
          : ujian ? `<button class="btn btn-sm ${(s.susulan || []).includes(sw.id) ? "uj-b-ungu" : "uj-b-abu"}" title="Izinkan ujian susulan (santri izin/sakit) walaupun sesi sudah ditutup" onclick="ujSusulan('${sw.id}')">🩺 ${(s.susulan || []).includes(sw.id) ? "Susulan ✓" : "Susulan"}</button>` : ""}</td></tr>`; }).join("")}
    </tbody></table></div>
    ${ujian ? `<div class="uj-sub" style="margin-top:6px">ⓘ <b>Pindah layar</b> = berapa kali santri keluar dari halaman ujian (membuka WhatsApp/aplikasi lain, pindah tab, atau mematikan layar). Angka besar patut ditanyakan; 1× bisa karena layar mati sebentar. 🩺 <b>Susulan</b> = izinkan santri yang izin/sakit mengerjakan walaupun sesi sudah ditutup.</div>` : ""}
    ${selesai.length ? _ujGrafikSebaran(selesai, kkm) : ""}
    ${butir.length && kirim.length ? `<div class="uj-judul-bagian" style="margin-top:14px"><span>🔬 Analisis soal (persen santri yang menjawab benar)</span></div>
      <div class="uj-butir">${butir.map((x) => `<div class="${x.persen < 40 ? "sulit" : x.persen < 70 ? "sedang" : "mudah"}"><b>${x.label}</b><span>${x.persen}%</span></div>`).join("")}</div>
      <div class="uj-sub">Merah = kurang dari 40% benar (materi perlu diulang, atau kuncinya perlu dicek). K = PG kompleks.</div>` : ""}`;
}
// Grafik sebaran nilai (batang SVG ringan, tanpa pustaka tambahan)
function _ujGrafikSebaran(rows, kkm) {
  const ember = [["< 60", 0, 60, "#d64545"], ["60–69", 60, 70, "#ea7a1a"], ["70–79", 70, 80, "#d4a72c"], ["80–89", 80, 90, "#1f9c7c"], ["90+", 90, 101, "#13715b"]];
  const n = ember.map(([, a, b]) => rows.filter((r) => Number(r.nilai_akhir) >= a && Number(r.nilai_akhir) < b).length);
  const maks = Math.max(1, ...n), W = 360, H = 150, lebar = W / ember.length;
  const batang = ember.map(([lab, , , w], i) => {
    const h = (n[i] / maks) * (H - 40), x = i * lebar + 10, y = H - 22 - h;
    return `<rect x="${x}" y="${y}" width="${lebar - 20}" height="${Math.max(h, 2)}" rx="6" fill="${w}"/><text x="${x + (lebar - 20) / 2}" y="${y - 5}" text-anchor="middle" font-size="12" font-weight="700" fill="currentColor">${n[i]}</text><text x="${x + (lebar - 20) / 2}" y="${H - 6}" text-anchor="middle" font-size="11" fill="currentColor" opacity=".7">${lab}</text>`;
  }).join("");
  const nilai = rows.map((r) => Number(r.nilai_akhir));
  return `<div class="uj-judul-bagian" style="margin-top:14px"><span>📈 Sebaran nilai</span><span class="uj-sub">tertinggi ${Math.max(...nilai)} · terendah ${Math.min(...nilai)} · KKM ${kkm}</span></div>
    <svg viewBox="0 0 ${W} ${H}" style="width:100%;max-width:520px;color:var(--text-primary)">${batang}</svg>`;
}
async function ujTampilHasil(nilai) {
  const s = UJ.rekap.s;
  const { error } = await supa.from("ujian_sesi").update({ tampil_hasil: nilai }).eq("id", s.id);
  if (error) { toast(_ujPesan(error), "err"); return; }
  s.tampil_hasil = nilai; const x = UJ.sesi.find((y) => y.id === s.id); if (x) x.tampil_hasil = nilai;
  toast(nilai ? "Santri sekarang bisa melihat rincian hasilnya (tanpa kunci)" : "Rincian hasil disembunyikan dari santri", "ok");
  _ujGambarRekap();
}
async function ujSusulan(siswaId) {
  const s = UJ.rekap.s, daftar = new Set(s.susulan || []);
  daftar.has(siswaId) ? daftar.delete(siswaId) : daftar.add(siswaId);
  const { error } = await supa.from("ujian_sesi").update({ susulan: [...daftar] }).eq("id", s.id);
  if (error) { toast(_ujPesan(error), "err"); return; }
  s.susulan = [...daftar]; const x = UJ.sesi.find((y) => y.id === s.id); if (x) x.susulan = s.susulan;
  toast(daftar.has(siswaId) ? "Santri boleh ujian susulan (walau sesi ditutup)" : "Izin susulan dibatalkan", "ok");
  _ujGambarRekap();
}
async function ujResetJawaban(id, nama) {
  const pin = UJ.rekap.pin, sesiId = UJ.rekapSesi;
  if (!(await konfirmasiTema(`Hapus jawaban ${nama}?\nSantri bisa mengerjakan ulang dari awal. Nilai lamanya hilang.`, { judul: "Ulang dari awal", ikon: "↺", teksYa: "Hapus jawaban" }))) { ujBukaRekap(sesiId); return; }
  try { await _ujRpc("ujian_reset_jawaban", { p_pin: pin, p_jawaban_id: id }); toast("Jawaban dihapus", "ok"); } catch (e) { toast(_ujPesan(e), "err"); }
  ujBukaRekap(sesiId);
}
// Saran skor uraian: proporsi "poin penilaian" yang kata kuncinya muncul di jawaban santri.
function _ujSaranUraian(jawab, ks, poin) {
  const t = String(jawab || "").toLowerCase();
  if (!t.trim()) return 0;
  const pk = ks.poin_kunci || [];
  if (!pk.length) return null;
  const kena = pk.filter((p) => String(p).toLowerCase().split(/[^a-z0-9à-ÿ-]+/i).filter((w) => w.length >= 4).some((w) => t.includes(w))).length;
  return Math.round((poin * kena) / pk.length);
}
function ujNilaiUraian(jawabanId) {
  const { rows, kunci, siswa, b } = UJ.rekap;
  const r = rows.find((x) => x.id === jawabanId); if (!r) return;
  const nama = (siswa.find((x) => x.id === r.siswa_id) || {}).nama || "";
  const bgK = ((kunci && kunci.bagian) || []).find((x) => x.jenis === "uraian") || { soal: [], poin: 0 };
  const bgS = (b.soal || []).find((x) => x.jenis === "uraian") || { soal: [] };
  const daftar = bgK.soal.map((ks) => {
    const poin = Number(ks.poin || bgK.poin || 1), so = bgS.soal.find((x) => x.no === ks.no) || {};
    const jaw = ((r.jawaban || {}).uraian || {})[ks.no] || "";
    const lama = r.skor_uraian && r.skor_uraian[ks.no] != null ? r.skor_uraian[ks.no] : "";
    const saran = _ujSaranUraian(jaw, ks, poin);
    return `<div class="uj-uraian">
      <div style="font-weight:700;font-size:13px">${ks.no}. ${escapeHtml(so.t || "")}</div>
      <div class="uj-jawaban">${jaw ? escapeHtml(jaw) : "<i style='color:var(--text-secondary)'>(tidak dijawab)</i>"}</div>
      <div class="uj-kunci-uraian"><b>Kunci:</b> ${escapeHtml(ks.kunci || "-")}${(ks.poin_kunci || []).length ? `<div class="uj-sub">Poin: ${ks.poin_kunci.map(escapeHtml).join(" · ")}</div>` : ""}</div>
      <div style="display:flex;align-items:center;gap:8px;margin-top:6px;flex-wrap:wrap">
        <label class="form-label" style="margin:0">Skor (0–${poin})</label>
        <input type="number" class="input uj-skor" data-no="${ks.no}" min="0" max="${poin}" step="0.5" value="${lama !== "" ? lama : (saran ?? "")}" style="width:90px">
        ${saran != null && lama === "" ? `<span class="uj-sub">saran otomatis: ${saran}</span>` : ""}
        <span class="uj-cepat">${[0, Math.round(poin / 2), poin].map((v) => `<button type="button" class="btn btn-ghost btn-sm" onclick="this.closest('.uj-uraian').querySelector('.uj-skor').value=${v}">${v}</button>`).join("")}</span>
      </div></div>`;
  }).join("");
  openModal(`<h3>✍️ Nilai uraian · ${escapeHtml(nama)}</h3>
    <div class="uj-sub" style="margin-bottom:8px">PG + PGK: <b>${Number(r.skor_otomatis || 0)}</b> poin. Skor yang terisi otomatis hanyalah saran — periksa lalu sesuaikan.</div>
    ${daftar}
    <div style="display:flex;gap:10px;margin-top:12px"><button class="btn btn-outline" style="flex:1" onclick="ujBukaRekap(UJ.rekapSesi)">‹ Kembali</button><button class="btn btn-accent" style="flex:1" onclick="ujSimpanUraian('${r.id}')">Simpan nilai</button></div>`, { lebar: true });
}
async function ujSimpanUraian(id) {
  const skor = {};
  let salah = false;
  qsa(".uj-skor").forEach((i) => {
    const v = i.value === "" ? 0 : Number(i.value), mx = Number(i.max);
    if (isNaN(v) || v < 0 || v > mx) salah = true;
    skor[i.dataset.no] = v;
  });
  if (salah) { toast("Ada skor di luar rentang", "err"); return; }
  try {
    const n = await _ujRpc("ujian_nilai_uraian", { p_pin: UJ.rekap.pin, p_jawaban_id: id, p_skor: skor });
    toast(`Tersimpan · nilai akhir ${Math.round(n)}`, "ok");
    // langsung ke santri berikutnya yang belum dinilai
    await _ujMuatRekap(UJ.rekap.pin, true);
    const next = UJ.rekap.rows.find((x) => x.status === "dikirim");
    if (next) ujNilaiUraian(next.id); else ujBukaRekap(UJ.rekapSesi);
  } catch (e) { toast(_ujPesan(e), "err"); }
}

// ── Kirim ke rapor: guru memilih masuk sebagai Ulangan Harian ke-N, UTS, atau UAS ──
// (nilai UAS/UTS tetap bisa diisi manual di Input Nilai; kirim dari sini hanya mengisi/mengganti kolomnya)
function ujPilihKirimRapor() {
  const { b } = UJ.rekap, bab = Math.max(1, Number(b.bab) || 1);
  const judul = String(b.judul || "").toLowerCase();
  const jn = _ujJenisNilai(b), tebak = jn.jenis, keAwal = jn.ke || bab;
  openModal(`<h3>📤 Kirim nilai ke rapor</h3>
    <div class="uj-sub" style="margin:-4px 0 10px">${escapeHtml(b.judul || "")} · ${escapeHtml(_ujNamaMapel(b.mapel_id))}. Nilai ini masuk sebagai:</div>
    <div class="rc-pilih" style="grid-template-columns:repeat(2,1fr)">
      <label><input type="radio" name="uj-tujuan" value="uh" ${tebak === "uh" ? "checked" : ""}> 📝 <b>Ulangan Harian</b><span>ke-<select id="uj-uh-ke" class="input" style="display:inline-block;width:auto;padding:2px 6px;font-size:12px" onclick="event.stopPropagation()">${Array.from({ length: Math.max(10, keAwal) }, (_, i) => `<option ${i + 1 === keAwal ? "selected" : ""}>${i + 1}</option>`).join("")}</select></span></label>
      <label><input type="radio" name="uj-tujuan" value="tugas" ${tebak === "tugas" ? "checked" : ""}> ✍️ <b>Tugas</b><span>ke-<select id="uj-tg-ke" class="input" style="display:inline-block;width:auto;padding:2px 6px;font-size:12px" onclick="event.stopPropagation()">${Array.from({ length: Math.max(10, keAwal) }, (_, i) => `<option ${i + 1 === keAwal ? "selected" : ""}>${i + 1}</option>`).join("")}</select></span></label>
      <label><input type="radio" name="uj-tujuan" value="uts" ${tebak === "uts" ? "checked" : ""}> 📘 <b>UTS</b><span>tengah semester</span></label>
      <label><input type="radio" name="uj-tujuan" value="uas" ${tebak === "uas" ? "checked" : ""}> 🎓 <b>UAS</b><span>akhir semester</span></label>
    </div>
    <div class="uj-sub" style="margin-top:8px">Nilai yang sudah diisi manual di kolom itu akan diganti (Anda diberi tahu sebelum dikirim). Kolom lain tidak berubah.</div>
    <div style="display:flex;gap:10px;margin-top:12px"><button class="btn btn-outline" style="flex:1" onclick="ujBukaRekap(UJ.rekapSesi)">‹ Kembali</button>
      <button class="btn btn-accent" style="flex:2" onclick="(function(j){ujKirimRapor(j, Number(qs(j==='tugas'?'uj-tg-ke':'uj-uh-ke').value))})(document.querySelector('input[name=uj-tujuan]:checked').value)">Lanjut</button></div>`);
}
async function ujKirimRapor(jenis = "uh", ke = null) {
  const { s, b, rows, siswa } = UJ.rekap;
  const sesiId = UJ.rekapSesi;
  const kolom = jenis === "uas" ? "uas" : jenis === "uts" ? "uts" : jenis === "tugas" ? "tugas" : "ulangan_harian";
  if (!b.mapel_id) { toast("Bank soal belum punya mapel", "err"); return; }
  const siap = rows.filter((r) => r.status === "dinilai" && r.nilai_akhir != null);
  const belum = rows.filter((r) => r.status === "dikirim").length;
  if (!siap.length) { toast("Belum ada nilai akhir yang siap dikirim", "err"); return; }
  const sem = s.semester ? { semester: s.semester, ta: s.tahun_ajaran } : (() => { const x = _ujSemesterSekarang(s.created_at.slice(0, 10)); return { semester: x.semester, ta: x.ta }; })();
  const idx = kolom === "ulangan_harian" || kolom === "tugas" ? Math.max(0, (Number(ke) || Number(b.bab) || 1) - 1) : 0;
  const label = kolom === "uas" ? "UAS" : kolom === "uts" ? "UTS" : kolom === "tugas" ? `Tugas ${idx + 1}` : `Ulangan Harian ${idx + 1}`;
  const namaIsi = (i) => (kolom === "ulangan_harian" ? `Ulangan Harian ${i + 1}` : kolom === "tugas" ? `Tugas ${i + 1}` : kolom === "uas" ? "UAS" : "UTS");
  let data;
  try { data = await apiGetNilaiRaporByKelasMapel(s.kelas_id, b.mapel_id, sem.semester, sem.ta); }
  catch (e) { toast(e.message, "err"); return; }
  const timpa = siap.filter((r) => { const n = (data.find((d) => d.siswa.id === r.siswa_id) || {}).nilai; const lama = n && (n[kolom] || [])[idx]; return lama && Number(lama.nilai) > 0 && Number(lama.nilai) !== Math.round(r.nilai_akhir); }).length;
  const ok = await konfirmasiTema(`Kirim ${siap.length} nilai ke rapor ${escapeHtml(_ujNamaMapel(b.mapel_id))} sebagai <b>${label}</b> (${sem.semester} ${sem.ta})?${belum ? `\n\n⚠️ ${belum} santri belum dinilai uraiannya — nilainya belum ikut terkirim.` : ""}${timpa ? `\n\n⚠️ ${timpa} santri sudah punya nilai ${label} yang berbeda (mis. diisi manual) — akan diganti.` : ""}${siswa.length > rows.length ? `\n\n${siswa.length - rows.length} santri belum ikut ujian (tidak diubah).` : ""}`, { judul: "Kirim ke rapor", ikon: "📤", teksYa: "Kirim" });
  if (!ok) { ujBukaRekap(sesiId); return; }
  let berhasil = 0;
  try {
    for (const r of siap) {
      const lama = (data.find((d) => d.siswa.id === r.siswa_id) || {}).nilai;
      const isi = lama ? (lama[kolom] || []).map((x) => ({ ...x })) : [];
      while (isi.length <= idx) isi.push({ nama: namaIsi(isi.length), nilai: 0 });
      isi[idx] = { nama: isi[idx].nama || namaIsi(idx), nilai: Math.round(Number(r.nilai_akhir)) };
      let row;
      if (lama) { const { id, updated_at, mapel, ...sisa } = lama; row = { ...sisa, [kolom]: isi }; }
      else row = {
        siswa_id: r.siswa_id, mapel_id: b.mapel_id, kelas_id: s.kelas_id, guru_id: STATE.guruId || s.guru_id || null,
        semester: sem.semester, tahun_ajaran: sem.ta, ulangan_harian: [], tugas: [{ nama: "Tugas 1", nilai: 0 }], ada_uts: false, uts: [], uas: [{ nama: "UAS", nilai: 0 }],
        nilai_kehadiran: null, capaian_pembelajaran: "", diisi_oleh: "guru", [kolom]: isi,
      };
      if (kolom === "uts") row.ada_uts = true;
      await apiSimpanNilaiRapor(row);
      berhasil++;
    }
    await supa.from("ujian_sesi").update({ dikirim_rapor_at: new Date().toISOString() }).eq("id", s.id);
    toast(`${berhasil} nilai masuk rapor (${label})`, "ok");
  } catch (e) { toast(`Terkirim ${berhasil}, gagal: ${e.message}`, "err"); }
  await ujMuat();
  ujBukaRekap(sesiId);
}
function ujUnduhRekap() {
  if (!window.XLSX || !UJ.rekap) return;
  const { s, b, siswa, rows } = UJ.rekap;
  const byId = Object.fromEntries(rows.map((r) => [r.siswa_id, r]));
  const data = siswa.map((sw, i) => { const r = byId[sw.id] || {}; return { No: i + 1, Nama: sw.nama, NIS: sw.nis || "", Status: r.status || "belum", "PG+PGK": r.skor_otomatis ?? "", Uraian: r.skor_uraian ? Object.values(r.skor_uraian).reduce((a, v) => a + Number(v || 0), 0) : "", "Nilai akhir": r.nilai_akhir ?? "", "Pindah layar": r.pindah_tab ?? "" }; });
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data), "Rekap");
  XLSX.writeFile(wb, `Rekap ${b.judul} - ${_ujNamaKelas(s.kelas_id)}.xlsx`.replace(/[\\/:*?"<>|]/g, "-"));
}

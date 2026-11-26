// ============================================================
//  🔍 CARI FITUR — ikon kaca pembesar di samping pilihan bahasa.
//  Ketik kata apa saja (mis. "stempel", "tukar jadwal", "sidik jari", "coffee break") → muncul fitur beserta
//  LETAKNYA (Menu › Tombol › Bagian) dan tombol untuk langsung membukanya. Hanya fitur yang boleh dibuka
//  akun ini yang ditampilkan (mengikuti hak akses menu, Admin utama/Kedua, Pengelola, Bendahara).
// ============================================================
const CF = { q: "", pilih: 0 };
const _cfAdmin = () => typeof isAdmin === "function" && isAdmin();
const _cfAdminUtama = () => _cfAdmin() && !(typeof isAdminKedua === "function" && isAdminKedua());
const _cfAturUjian = () => typeof _juBolehAtur === "function" && _juBolehAtur();
const _cfTunggu = (cek, ms = 8000) => new Promise((r) => { const t0 = Date.now(); const iv = setInterval(() => { let ok = false; try { ok = cek(); } catch (e) {} if (ok || Date.now() - t0 > ms) { clearInterval(iv); r(ok); } }, 150); });
const _cfEditorUjian = async () => { await _cfTunggu(() => JU.daftar && JU.daftar.length && qs("ju-wadah")); const j = _juJadwalAktif(); if (j && _cfAturUjian()) juBukaEditor(j.id); return j; };

// ── kata kunci untuk setiap menu utama ──
const CF_KATA_MENU = {
  dashboard: "beranda dasbor halaman utama ringkasan", "absensi-guru": "absen masuk pulang kehadiran guru tutor presensi selfie lokasi", monitor: "pantau kelas berjalan monitoring hari ini",
  "rekap-siswa": "rekap kehadiran santri siswa persen alpha izin sakit", "riwayat-absen": "riwayat absen alpha klarifikasi terlambat tukar jam izin", "jurnal-guru": "jurnal mengajar materi kelas absensi santri",
  jadwal: "jadwal pelajaran roster jam mengajar mapel kelas", kurikulum: "kurikulum capaian pembelajaran cp", silabus: "silabus atp alur tujuan pembelajaran", "modul-ajar": "modul ajar rpp unduh perangkat ajar",
  kaldik: "kalender akademik agenda libur ujian kegiatan tanggal", ujian: "ujian online bank soal latihan token cbt", "jadwal-ujian": "jadwal ujian pengawas uas uts sumatif pas pat tahfizh",
  "kop-soal": "kop soal kepala soal word cetak naskah", "input-nilai": "input nilai rapor harian uh tugas tempel nilai", "rapor-umum": "rapor umum cetak raport nilai mapel umum",
  "rapor-diniyyah": "rapor diniyyah raport diniyah pesantren", rapor: "rapor wali kelas catatan wali sikap ekskul kenaikan", "bop-laporan": "laporan bop bosp spj", "bop-data": "data bop bosp anggaran",
  kas: "kas bendahara uang masuk keluar transaksi saldo bku", insentif: "insentif honor gaji slip gaji tutor", "insentif-musyrif": "insentif musyrif honor musyrif asrama", "laporan-kinerja": "laporan kinerja guru tutor capaian",
  kepsek: "perizinan izin sakit persetujuan kepala sekolah penyelenggara tukar jam antrian", "data-guru": "data guru tutor ptk pegawai jabatan biodata", "data-siswa": "data siswa santri peserta didik biodata nisn nik mutasi",
  "riwayat-terhapus": "riwayat terhapus sampah pulihkan hapus restore", pengaturan: "pengaturan sekolah kop logo nama lembaga tahun ajaran", "bel-sekolah": "bel sekolah jam bel suara", kuliah: "kuliah kampus s1 s2 tugas kuliah",
};
// ── fitur di dalam halaman (letaknya ditulis lengkap) ──
const CF_FITUR = [
  { j: "Cap Stempel di PDF", i: "🔵", l: "Jadwal Ujian › ✏️ Susun › ✍️ Tanda Tangan › Cap Stempel", k: "stempel cap logo stempel basah tanda tangan pdf", m: "jadwal-ujian", s: _cfAturUjian, a: () => juTandaTangan() },
  { j: "Tanda Tangan Penyelenggara", i: "✍️", l: "Jadwal Ujian › ✏️ Susun › ✍️ Tanda Tangan", k: "tanda tangan ttd paraf signature kepala sekolah penyelenggara", m: "jadwal-ujian", s: _cfAturUjian, a: () => juTandaTangan() },
  { j: "Pindah / Tukar Jadwal Ujian", i: "↔️", l: "Jadwal Ujian › ✏️ Susun › tekan lama mapel / ↔️ Pindah/Tukar", k: "tukar jam pindah jadwal geser seret drag ujian sesi", m: "jadwal-ujian", s: _cfAturUjian, a: async () => { await _cfEditorUjian(); toast("Tekan lama mapel lalu geser, atau ketuk ↔️ Pindah/Tukar di selnya", "info"); } },
  { j: "Mapel yang Diujikan", i: "📚", l: "Jadwal Ujian › ✏️ Susun › ⚙️ Pengaturan Ujian › Mapel yang Diujikan", k: "mapel tidak diujikan centang mapel ujian tahfizh muhadhoroh pengaturan ujian", m: "jadwal-ujian", s: _cfAturUjian, a: async () => { await _cfEditorUjian(); JU.aturBuka = true; _juGambarEditor(); document.querySelector(".ju-atur")?.scrollIntoView({ behavior: "smooth" }); } },
  { j: "Hari, Sesi & Jam Ujian", i: "🕒", l: "Jadwal Ujian › ✏️ Susun › ⚙️ Pengaturan Ujian", k: "hari ujian sesi jam ujian jumat sabtu kelas peserta jenis ujian", m: "jadwal-ujian", s: _cfAturUjian, a: async () => { await _cfEditorUjian(); JU.aturBuka = true; _juGambarEditor(); } },
  { j: "Cek Sebelum Dibagikan (soal belum terkumpul)", i: "🔎", l: "Jadwal Ujian › ✏️ Susun › panel Cek Sebelum Dibagikan", k: "soal terkumpul belum terkumpul cek jadwal pengumpulan soal belum masuk jadwal", m: "jadwal-ujian", s: _cfAturUjian, a: async () => { await _cfEditorUjian(); document.querySelector(".juc-panel")?.scrollIntoView({ behavior: "smooth" }); } },
  { j: "Pengumpulan Soal Ujian", i: "📥", l: "Jadwal Ujian › 📥 Pengumpulan soal", k: "kumpulkan soal kirim soal word pdf fisik rekap soal batas pengumpulan", m: "jadwal-ujian", a: async () => { await _cfTunggu(() => JU.daftar && JU.daftar.length); const j = _juJadwalAktif(); if (j && typeof juPengumpulanSoal === "function") juPengumpulanSoal(j.id); } },
  { j: "Susun Merata / Susun dari Jadwal", i: "🧠", l: "Jadwal Ujian › ✏️ Susun › 🧠 Susun Merata / 🪄 Susun dari Jadwal", k: "susun otomatis jadwal ujian merata acak otomatis", m: "jadwal-ujian", s: _cfAturUjian, a: () => _cfEditorUjian() },
  { j: "Pengawas Otomatis", i: "⚡", l: "Jadwal Ujian › ✏️ Susun › ⚡ Pengawas Otomatis", k: "pengawas otomatis bagi pengawas beban mengawas", m: "jadwal-ujian", s: _cfAturUjian, a: () => _cfEditorUjian() },
  { j: "Absen Mengawas Ujian", i: "✋", l: "Jadwal Ujian › Saya Mengawas › ✋ Absen Mengawas", k: "absen mengawas hadir pengawas ujian gabungan", m: "jadwal-ujian" },
  { j: "Layar Penuh Jadwal Ujian", i: "⛶", l: "Jadwal Ujian › ⛶ Layar Penuh", k: "layar penuh fullscreen landscape zoom jadwal ujian", m: "jadwal-ujian", a: async () => { await _cfTunggu(() => JU.daftar && JU.daftar.length); juLayarPenuh(); } },
  { j: "Cetak / PDF & Bagikan WA Jadwal Ujian", i: "🖨️", l: "Jadwal Ujian › 🖨️ PDF / 💬 WA", k: "cetak pdf print bagikan wa whatsapp jadwal pengawas", m: "jadwal-ujian" },
  { j: "Ujian Online & Token", i: "💻", l: "Ujian › Ujian Online", k: "ujian online token sesi lab komputer cbt latihan", m: "ujian" },
  { j: "Bank Soal", i: "🗃️", l: "Ujian › Bank Soal", k: "bank soal buat soal pilihan ganda uraian essay", m: "ujian" },
  { j: "Koreksi Uraian", i: "📝", l: "Ujian › hasil sesi › nilai uraian", k: "koreksi uraian essay nilai manual saran nilai", m: "ujian" },
  { j: "Tempel Nilai dari Excel/WA", i: "📋", l: "Input Nilai › Tempel Nilai", k: "tempel nilai paste nilai excel cocokkan nama", m: "input-nilai" },
  { j: "Izin / Sakit Tutor", i: "🤒", l: "Absensi Guru › Izin/Sakit", k: "izin sakit cuti tidak masuk tugas kelas pengganti", m: "absensi-guru" },
  { j: "Tukar Jam Mengajar", i: "🔁", l: "Jadwal Pelajaran › Tukar/Pindah Jam", k: "tukar jam pindah jam mengajar ganti jadwal", m: "jadwal" },
  { j: "Klarifikasi Alpha", i: "❗", l: "Riwayat Absen › Klarifikasi", k: "alpha klarifikasi alasan tidak absen", m: "riwayat-absen" },
  { j: "Slip Gaji", i: "🧾", l: "Insentif › Slip Gaji", k: "slip gaji honor cetak slip insentif bulan", m: "insentif" },
  { j: "Kenaikan Kelas & Catatan Wali", i: "🎓", l: "Rapor Wali Kelas", k: "naik kelas kenaikan catatan wali kelas sikap", m: "rapor" },
  { j: "Kalender Akademik & Libur", i: "📅", l: "Kalender Akademik", k: "libur agenda tanggal merah ujian kegiatan desain kalender", m: "kaldik" },
  // akun & keamanan
  { j: "Profil Saya & Dokumen Pribadi", i: "👤", l: "Klik nama Anda (kanan atas) › Profil", k: "profil biodata data diri pendidikan ktp kk ijazah sertifikat sk foto", a: () => bukaMenuAkun() },
  { j: "Masuk dengan Sidik Jari", i: "👆", l: "Halaman masuk › ikon sidik jari (khusus HP)", k: "sidik jari fingerprint login biometrik", a: () => (typeof kaDaftarSidik === "function" ? kaDaftarSidik() : bukaMenuAkun()) },
  { j: "Tema, Warna & Mode Gelap", i: "✨", l: "Bilah atas › ✨", k: "tema warna mode gelap dark terang tampilan", a: () => bukaPilihPalet() },
  { j: "Ganti Bahasa", i: "🌐", l: "Bilah atas › pilihan bahasa", k: "bahasa inggris arab english language", a: () => qs("lang-switch")?.focus() },
  // pengaturan ruang (admin utama)
  { j: "Absensi Wajib per Jenjang", i: "🕌", l: "Pengaturan Ruang › 🧩 Fitur Per Ruang › Absensi Wajib Tutor", k: "absensi wajib sakelar alpha otomatis on off jenjang", s: _cfAdminUtama, a: () => rgBukaPengaturan("fitur") },
  { j: "Akses Admin Kedua", i: "🔐", l: "Pengaturan › Akses Admin Kedua", k: "admin kedua akses izin menu hak akses pendamping", s: _cfAdminUtama, m: "pengaturan" },
  { j: "Akun Guru & Reset Kata Sandi", i: "🔑", l: "Pengaturan Ruang › 🔐 Akun Guru", k: "akun guru reset sandi kata sandi email login buat akun", s: _cfAdminUtama, a: () => rgBukaPengaturan("akun") },
  { j: "Catatan Aktivitas", i: "📜", l: "Pengaturan Ruang › 📜 Catatan Aktivitas", k: "log aktivitas riwayat perubahan siapa mengubah", s: _cfAdminUtama, a: () => rgBukaPengaturan("log") },
  { j: "Guru per Ruang", i: "👥", l: "Pengaturan Ruang › 👥 Guru Per Ruang", k: "guru per ruang pindah ruang anggota ruang", s: _cfAdminUtama, a: () => rgBukaPengaturan("anggota") },
  // keuangan BOSP (jenjang)
  { j: "Kertas Kerja BOSP", i: "📒", l: "Menu kiri › Kertas Kerja BOSP", k: "kertas kerja bosp arkas usulan pagu tahap", s: () => typeof bspBolehSusun === "function" && bspBolehSusun(), a: () => bspBukaKK() },
  { j: "Draft RKAS & Realisasi", i: "🗂️", l: "Menu kiri › Draft RKAS", k: "draft rkas realisasi nota belanja bosp bulan kegiatan", s: () => typeof _rkBoleh === "function" && _rkBoleh(), a: () => rkBuka() },
  // Pengelola
  { j: "Pencarian Cepat Data", i: "🔎", l: "Ruang Pengelola › Data › Pencarian Cepat", k: "cari santri alumni guru nik nisn no induk hp", pg: "pg-cari" },
  { j: "Buku Induk Siswa", i: "📘", l: "Ruang Pengelola › Data › Buku Induk Siswa", k: "buku induk lembar induk no induk nis kelengkapan data", pg: "pg-induk" },
  { j: "Buku Klaper", i: "🔤", l: "Ruang Pengelola › Data › Buku Klaper", k: "buku klaper abjad indeks siswa", pg: "pg-klaper" },
  { j: "Alumni", i: "🎖️", l: "Ruang Pengelola › Data › Alumni", k: "alumni lulusan paket c tracer pendataan dinas", pg: "pg-alumni" },
  { j: "Arsip e-Ijazah", i: "📄", l: "Ruang Pengelola › Data › Alumni › Arsip e-Ijazah", k: "ijazah e-ijazah eijazah pdf ijazah folder drive", pg: "pg-alumni" },
  { j: "SOP Induk & Capaian", i: "📋", l: "Ruang Pengelola › Pengelolaan › SOP Induk", k: "sop tupoksi tugas pokok ceklis capaian penanggung jawab pj", pg: "pg-sop" },
  { j: "SOP & Tugas Saya", i: "✅", l: "Menu kiri › SOP & Tugas", k: "sop tugas saya ceklis harian pekanan baca pahami pengingat", s: () => STATE.ruang !== "Pg", a: () => sopBuka("saya") },
  { j: "Rancangan BOSP (ARKAS)", i: "💰", l: "Ruang Pengelola › Keuangan › Rancangan BOSP", k: "rancangan bosp arkas pagu honor pengelola bendahara", pg: "pg-bosp" },
  { j: "Draft RKAS Semua Jenjang", i: "🗂️", l: "Ruang Pengelola › Keuangan › Draft RKAS Jenjang", k: "rkas jenjang pantau realisasi", pg: "pg-rkas" },
  { j: "Data SSH (Batas Harga)", i: "🏷️", l: "Ruang Pengelola › Keuangan › Data SSH", k: "ssh standar harga batas harga satuan", pg: "pg-ssh" },
  { j: "Buku Induk Siswa (Semua Jenjang)", i: "🎓", l: "Ruang Pengelola › Data › Buku Induk Siswa", k: "peserta didik rekap siswa semua jenjang unduh excel buku induk aktif nonaktif lulus", pg: "pg-induk" },
  { j: "Buku Induk Guru & PTK", i: "👤", l: "Ruang Pengelola › Data › Buku Induk Guru & PTK", k: "ptk guru dapodik nuptk honda akun jadwal nonaktif", pg: "pg-induk-guru" },
  // Kantor Maya (admin / yang diizinkan menonton)
  { j: "Kantor Maya PKBM", i: "🏢", l: "Menu kiri › Kantor PKBM", k: "kantor maya virtual 3d headquarters rapat petugas", s: _cfAdmin, a: () => ktBuka() },
  { j: "Struktur Organisasi (ubah sendiri)", i: "🧭", l: "Kantor PKBM › 🏢 Direktori › Struktur", k: "struktur organisasi bagan atasan bawahan susunan", s: _cfAdmin, a: async () => { await ktBuka(); await _cfTunggu(() => KT.staf && KT.staf.length && typeof kmDirektori === "function"); kmDirektori("struktur"); } },
  { j: "Coffee Break / Istirahat", i: "☕", l: "Kantor PKBM › ☕ Istirahat", k: "istirahat coffee break ngopi pojok kopi kopi kue", s: _cfAdmin, a: () => ktBuka() },
  { j: "Sholat Berjamaah & Waktu Sholat", i: "🕌", l: "Kantor PKBM › 🌗 Suasana", k: "sholat salat waktu sholat musholla adzan dzuhur ashar maghrib", s: _cfAdmin, a: async () => { await ktBuka(); await _cfTunggu(() => typeof ksPanel === "function" && KT.renderer); ksPanel(); } },
  { j: "Siang / Malam & Suara Kantor", i: "🌗", l: "Kantor PKBM › 🌗 Suasana", k: "siang malam pagi sore suasana suara latar jam pulang kehadiran nyata", s: _cfAdmin, a: async () => { await ktBuka(); await _cfTunggu(() => typeof ksPanel === "function" && KT.renderer); ksPanel(); } },
  { j: "Tiket Tim IT (keluhan aplikasi)", i: "🎫", l: "Kantor PKBM › 🎫 Tiket", k: "tiket keluhan error bug aplikasi tim it laporan masalah", s: _cfAdmin, a: async () => { await ktBuka(); await _cfTunggu(() => KT.staf && KT.staf.length); ktTiketBuka(); } },
  { j: "Petugas Kantor & Izin Menyaksikan", i: "⚙️", l: "Kantor PKBM › ⚙️", k: "pengaturan kantor petugas peran penonton izin menyaksikan keliling", s: _cfAdminUtama, a: async () => { await ktBuka(); await _cfTunggu(() => KT.staf && KT.staf.length); ktAturBuka(); } },
];

// ── kumpulkan & saring sesuai hak akses ──
function _cfMenu(key) { for (const g of MENU) for (const it of g.items) if (it.key === key) return { ...it, grup: g.group }; return null; }
function _cfBolehMenu(it) {
  if (!it || !it.fase1) return false;
  if (it.kuliahOnly && !(typeof kulBolehAkses === "function" && kulBolehAkses())) return false;
  if (it.adminOnly && !adaAksesModul(it.key) && !(it.kepsekAllowed && isKepsekOrTU()) && !(it.bendaharaAllowed && typeof isBendahara === "function" && isBendahara())) return false;
  return true;
}
function _cfBoleh(e) {
  try {
    if (e.s && !e.s()) return false;
    if (e.pg) return _cfAdmin() || (typeof rgAkses === "function" && rgAkses("Pg") === "U");
    if (e.m) return _cfBolehMenu(_cfMenu(e.m));
    return true;
  } catch (x) { return false; }
}
function _cfDaftar() {
  const menu = MENU.flatMap((g) => g.items.map((it) => ({ ...it, grup: g.group }))).filter(_cfBolehMenu)
    .map((it) => ({ id: "menu:" + it.key, j: t(it.i18n), i: it.icon, l: `Menu kiri › ${it.grup} › ${t(it.i18n)}`, k: CF_KATA_MENU[it.key] || "", m: it.key, menu: true }));
  const fitur = CF_FITUR.map((e, n) => ({ ...e, id: "f:" + n })).filter(_cfBoleh);
  return [...fitur, ...menu];
}
const _cfNorm = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9\s]/g, " ");
function _cfCari(q) {
  const kata = _cfNorm(q).split(/\s+/).filter(Boolean); const semua = _cfDaftar();
  if (!kata.length) return [];
  return semua.map((e) => {
    const judul = _cfNorm(e.j), teks = `${judul} ${_cfNorm(e.l)} ${_cfNorm(e.k)}`;
    const awal = (t, w) => (" " + t).includes(" " + w); // cocok dari awal kata ("kas" tidak cocok dengan "klarifikasi")
    if (!kata.every((w) => awal(teks, w))) return null;
    let skor = 0; kata.forEach((w) => { if (judul.startsWith(w)) skor += 4; else if (awal(judul, w)) skor += 3; else if (awal(_cfNorm(e.k), w)) skor += 2; else skor += 1; });
    if (!e.menu) skor += 0.5; return { e, skor };
  }).filter(Boolean).sort((a, b) => b.skor - a.skor).slice(0, 25).map((x) => x.e);
}

// ── tampilan ──
function cfBuka() {
  openModal(`<h3>🔍 Cari Fitur</h3>
    <input id="cf-input" class="input cf-input" placeholder="Ketik apa saja… mis. stempel, tukar jadwal, sidik jari, slip gaji" autocomplete="off"/>
    <div class="cf-ket">Hanya menampilkan fitur yang boleh Anda buka. Tekan ↑↓ untuk memilih, Enter untuk membuka.</div>
    <div id="cf-hasil" class="cf-hasil"></div>
    <div class="cf-ket">Mencari nama guru/siswa? <a href="#" onclick="event.preventDefault();closeModal();bukaPencarianCepat()">Buka Cari Cepat</a></div>`);
  const inp = qs("cf-input"); inp.value = CF.q || ""; inp.focus(); inp.select();
  inp.addEventListener("input", () => { CF.q = inp.value; CF.pilih = 0; _cfTampil(); });
  inp.addEventListener("keydown", (ev) => {
    const n = qsa("#cf-hasil .cf-item").length;
    if (ev.key === "ArrowDown") { ev.preventDefault(); CF.pilih = Math.min(n - 1, CF.pilih + 1); _cfTandai(); }
    else if (ev.key === "ArrowUp") { ev.preventDefault(); CF.pilih = Math.max(0, CF.pilih - 1); _cfTandai(); }
    else if (ev.key === "Enter") { ev.preventDefault(); qsa("#cf-hasil .cf-item")[CF.pilih]?.click(); }
  });
  _cfTampil();
}
function _cfTandai() { qsa("#cf-hasil .cf-item").forEach((el, i) => { el.classList.toggle("on", i === CF.pilih); if (i === CF.pilih) el.scrollIntoView({ block: "nearest" }); }); }
function _cfTampil() {
  const w = qs("cf-hasil"); if (!w) return;
  if (!(CF.q || "").trim()) {
    const contoh = ["stempel", "tukar jadwal", "sidik jari", "slip gaji", "sholat", "buku induk", "soal belum terkumpul", "izin sakit"];
    w.innerHTML = `<div class="cf-contoh">Coba: ${contoh.map((c) => `<button onclick="CF.q='${c}';qs('cf-input').value='${c}';_cfTampil()">${c}</button>`).join("")}</div>`; return;
  }
  const hasil = _cfCari(CF.q); CF.hasil = hasil;
  w.innerHTML = hasil.length ? hasil.map((e, i) => `<button class="cf-item ${i === CF.pilih ? "on" : ""}" onclick="cfJalankan('${e.id}')"><span class="cf-ikon">${e.i || "•"}</span><span class="cf-teks"><b>${escapeHtml(e.j)}</b><small>📍 ${escapeHtml(e.l)}</small></span><span class="cf-buka">Buka ›</span></button>`).join("")
    : `<div class="empty-state" style="padding:18px">Tidak ditemukan fitur untuk "${escapeHtml(CF.q)}".<br><small>Bisa jadi fitur itu belum ada, atau tidak termasuk hak akses akun ini.</small></div>`;
}
const _cfRuangJenjang = () => { const s = (typeof RG !== "undefined" && RG.saya) || {}; if (["A", "Pa", "Pi"].includes(s.ruang_utama)) return s.ruang_utama; return (s.ruang || []).find((r) => ["A", "Pa", "Pi"].includes(r)) || "Pa"; };
function _cfPindah(r, id) { try { sessionStorage.setItem("cf:buka", JSON.stringify({ id, t: Date.now() })); } catch (e) {} toast("Pindah ruang dulu…", "info"); rgPindah(r); }
async function cfJalankan(id) {
  const e = _cfDaftar().find((x) => x.id === id); if (!e) return;
  closeModal();
  try {
    if (e.pg) { if (STATE.ruang !== "Pg") return _cfPindah("Pg", id); await rgBukaPengelola(e.pg); }
    else if (e.m) { if (typeof RG !== "undefined" && STATE.ruang === "Pg" && !["pengaturan"].includes(e.m)) return _cfPindah(_cfRuangJenjang(), id); const it = _cfMenu(e.m); if (it) showPage(it.key, it.page, it.i18n); }
    if (e.a) { if (e.m || e.pg) await new Promise((r) => setTimeout(r, 500)); await e.a(); }
  } catch (x) { console.warn("Cari fitur:", x); toast("Fitur ini belum bisa dibuka dari sini — letaknya: " + e.l, "info"); }
}
// lanjutkan membuka setelah pindah ruang
setTimeout(async () => {
  try {
    const s = JSON.parse(sessionStorage.getItem("cf:buka") || "null"); if (!s || Date.now() - s.t > 60000) return;
    sessionStorage.removeItem("cf:buka");
    await _cfTunggu(() => typeof RG !== "undefined" && RG.siap && STATE.guruId, 15000);
    setTimeout(() => cfJalankan(s.id), 800);
  } catch (e) {}
}, 1200);
// tombol kaca pembesar di samping pilihan bahasa
(function cfPasang() {
  const pasang = () => {
    const wadah = qs("topbar-prefs"), bahasa = qs("lang-switch"); if (!wadah || !bahasa || qs("cf-tombol")) return;
    bahasa.insertAdjacentHTML("afterend", `<span class="pill cf-tombol" id="cf-tombol" onclick="cfBuka()" title="Cari fitur aplikasi" aria-label="Cari fitur"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-4.2-4.2"/></svg></span>`);
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", pasang); else pasang();
  setTimeout(pasang, 2000);
})();

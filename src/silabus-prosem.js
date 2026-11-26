// ============================================================
//  📘 SILABUS & PROGRAM SEMESTER (PROSEM)
//  • Bab tiap mapel per kelas & semester (bawaan kelas 7 diambil dari Daftar Isi buku di Modul Ajar).
//  • Jumlah pertemuan dihitung dari Jadwal Pelajaran × hari aktif KBM di Kalender Akademik
//    (libur & hari ujian tidak dihitung; ujian khusus Diniyah tidak memotong mapel umum, dan sebaliknya).
//  • Pertemuan dibagi ke tiap bab sebanding tebal bab (jumlah halaman), + pertemuan asesmen tiap bab.
//  • Capaian dideteksi dari Jurnal Mengajar: materi jurnal dicocokkan dengan judul bab / sub-bab →
//    Sesuai / Tertinggal / Lebih Cepat.
//  • Yang boleh mengubah: Admin, Kepala/Penyelenggara jenjang. Bisa unduh template Excel & unggah kembali.
//  Data: kuliah_pengaturan (per ruang) "silabus:<TP>:<kelasId>" → { [mapelId]: {bab:{id:{…}}, asesmen, cadangan, oleh, t} }
//        "silabus:<TP>:atur" → { awal:{ganjil,genap}, akhir:{ganjil,genap} } (bila Kalender Akademik belum lengkap)
// ============================================================
const SP = { th: "", kelasId: "", sem: "", mapelId: "", data: {}, atur: {}, jadwal: [], kaldik: [], jurnal: [], muat: false, edit: null };
const SP_HARI = { Minggu: 0, Ahad: 0, Senin: 1, Selasa: 2, Rabu: 3, Kamis: 4, Jumat: 5, "Jum'at": 5, Sabtu: 6 };
const SP_NM_HARI = ["Ahad", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const _spE = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const _spTPKini = () => { const d = new Date(), y = d.getFullYear(); return d.getMonth() >= 6 ? `${y}/${y + 1}` : `${y - 1}/${y}`; };
const _spSemKini = () => (new Date().getMonth() >= 6 ? "ganjil" : "genap");
const _spISO = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const _spHariIni = () => _spISO(new Date());
const _spTgl = (s, opsi = { day: "numeric", month: "short" }) => (s ? new Date(s + "T00:00:00").toLocaleDateString("id-ID", opsi) : "—");
const _spKunci = (kelasId) => `silabus:${SP.th}:${kelasId}`;
const _spId = () => "b" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const _spBoleh = () => (typeof isAdmin === "function" && isAdmin()) || (typeof isKepsek === "function" && isKepsek()) || (typeof isAdminKedua === "function" && isAdminKedua());

// ── Bawaan kelas 7 Putra: dari Daftar Isi buku di Modul Ajar (judul bab & jumlah halaman file PDF) ──
// Aturan semester (arahan Kepala PKBM): Bab 1–3 semester ganjil, Bab 4 dst. semester genap. Semua bisa diubah.
const SP_BAWAAN = {
  "Kelas 7": {
    "Bahasa Indonesia": [[1, "Jelajah Nusantara", 25], [2, "Berkelana di Dunia Imajinasi", 37], [3, "Hal yang Baik bagi Tubuh", null, "File PDF Bab 3 belum ada di Modul Ajar"], [4, "", null, "isi"]],
    "Bahasa Inggris": [[1, "My Name Is …", 44], [2, "My Favorite Food", 33], [3, "Rooms in the House", 39], [4, "", null, "isi"]],
    "IPA": [[1, "Hakikat Ilmu Sains dan Metode Ilmiah", 68], [2, "Zat dan Perubahannya", 62], [3, "Mengenal dan Memanfaatkan Suhu, Kalor, serta Fenomena Pemuaian", 55], [4, "Gerak dan Gaya dalam Teknologi", null, "File PDF Bab 4 rusak/tidak terbaca"], [5, "Karakteristik dan Klasifikasi Makhluk Hidup", 89], [6, "Ekologi dan Pelestarian Lingkungan", 82], [7, "Bumi dan Tata Surya", 116]],
    "IPS": [[1, "Kehidupan Sosial dan Kondisi Lingkungan Sekitar", 216], [2, "Keberagaman Lingkungan Sekitar", 126], [3, "", null, "isi"], [4, "", null, "isi"]],
    "Matematika": [[1, "Bilangan Bulat", 61], [2, "Bilangan Rasional", 65], [3, "Rasio", 30], [4, "", null, "isi"]],
    "PJOK": [[1, "Aktivitas Permainan Bola Basket", 25], [2, "Aktivitas Permainan Bola Voli", 24], [3, "Aktivitas Permainan Kasti", 22], [4, "Aktivitas Bela Diri Pencak Silat", 21], [5, "Lari Jarak Pendek", null, "File PDF Bab 5 belum ada di Modul Ajar"], [6, "Aktivitas Senam Lantai", 23], [7, "Aktivitas Gerak Berirama", 24], [8, "Aktivitas Kebugaran untuk Kesehatan", 33], [9, "Pola Makan Sehat, Bergizi, dan Seimbang", 27]],
    "PPKN/Seni Budaya": [[1, "Sejarah Kelahiran Pancasila", 39, null, "PPKn"], [2, "Penerapan Nilai-Nilai Pancasila", 34, null, "PPKn"], [3, "Patuh terhadap Norma", 37, null, "PPKn"], [4, "", null, "isi", "PPKn"],
      [1, "Menggambar", 73, null, "Seni Rupa"], [2, "Mendesain", 61, null, "Seni Rupa"], [3, "Membuat Tipografi dan Logo", 59, null, "Seni Rupa"], [4, "Berkarya Seni untuk Perubahan", null, "File PDF Bab 4 belum ada di Modul Ajar", "Seni Rupa"]],
  },
};
// Sub-bab kelas 7 hasil pembacaan (OCR) halaman buku di Modul Ajar, 26 Nov 2026. Hanya judul yang benar-benar terbaca;
// salah baca huruf yang jelas dibetulkan. Kunci "Mapel|Buku|No". [daftar sub-bab, catatan bila belum lengkap]
const SP_SUB_BAWAAN = {
  "Kelas 7": {
    "Bahasa Indonesia||1": [["A. Memahami Isi Teks Deskripsi", "B. Memahami Unsur Bahasa dalam Teks Deskripsi", "C. Menganalisis Informasi Lisan", "D. Menyunting Teks Deskripsi", "E. Menyajikan Teks Deskripsi Sederhana"]],
    "Bahasa Indonesia||2": [["A. Mengenal dan Mengidentifikasi Unsur Puisi Rakyat", "B. Mengidentifikasi Elemen dalam Teks Naratif", "Menulis Cerita Fantasi Sederhana"], "Sub-bab ketiga (hal. 31–33, menulis cerita fantasi) judulnya tidak terbaca jelas — mohon dicek"],
    "Bahasa Inggris||1": [[], "Buku berbahasa Inggris tidak memakai penomoran A/B sehingga sub-bab tidak terbaca otomatis — mohon diisi"],
    "Bahasa Inggris||2": [[], "Buku berbahasa Inggris tidak memakai penomoran A/B sehingga sub-bab tidak terbaca otomatis — mohon diisi"],
    "Bahasa Inggris||3": [[], "Buku berbahasa Inggris tidak memakai penomoran A/B sehingga sub-bab tidak terbaca otomatis — mohon diisi"],
    "IPA||1": [["Sains Ada di Sekitar Kita", "Laboratorium IPA", "Pengamatan dalam Sains", "Prosedur Percobaan", "Pengukuran", "Pelaporan Hasil Percobaan"], "Judul sub-bab pertama tidak terbaca; sebagian diambil dari judul bagian — mohon dicek"],
    "IPA||2": [["A. Wujud Zat dan Model Partikel", "B. Perubahan Wujud Zat", "C. Kerapatan Zat"]],
    "IPA||3": [["A. Suhu", "B. Kalor (termasuk Perpindahan Kalor & Pemuaian Zat)", "C. Pemanfaatan Energi Kalor"]],
    "IPA||5": [["Ciri-Ciri Makhluk Hidup", "Kunci Klasifikasi dan Determinasi", "Urutan Takson Makhluk Hidup", "Klasifikasi Makhluk Hidup Lima Kingdom"], "Judul sub-bab utama tidak terbaca; disusun dari judul bagian — mohon dicek"],
    "IPA||6": [["Komponen Lingkungan Biotik", "Tingkatan Organisasi Kehidupan dalam Ekologi dan Interaksinya", "Aliran Energi", "Daur Biogeokimia", "Pertanian dan Produksi Pangan", "Perubahan Iklim, Polusi, dan Kerusakan Habitat", "Metode dan Manfaat Konservasi"], "Sebagian besar disusun dari judul bagian — mohon dicek"],
    "IPA||7": [["A. Sistem Tata Surya", "B. Pengaruh Pergerakan Bumi dan Benda Langit Lainnya terhadap Kehidupan"]],
    "IPS||1": [["Mengenal Lokasi Tempat Tinggal", "Konektivitas Antarruang", "Perubahan Iklim", "Potensi Bencana Alam di Indonesia", "Interaksi Sosial", "Konsep Dasar Ilmu Sejarah"]],
    "IPS||2": [["Berkenalan dengan Lingkungan Sekitar", "Pembiasaan Diri untuk Melestarikan Lingkungan", "Pembangunan Berkelanjutan", "Masalah Pokok Ekonomi"], "Ada bagian tentang dinamika sosial (hal. 30) dan zaman praaksara (hal. 81) yang judul sub-babnya tidak terbaca — mohon dicek"],
    "Matematika||1": [["A. Memahami Bilangan Bulat", "B. Operasi Hitung Bilangan Bulat", "C. Faktor Bilangan Bulat (FPB dan KPK)"]],
    "Matematika||2": [["Pengertian Bilangan Rasional", "Membandingkan Bilangan Rasional", "Penjumlahan dan Pengurangan Bilangan Rasional", "Perkalian dan Pembagian Bilangan Rasional", "Operasi Hitung Campuran Bilangan Rasional", "Penerapan Operasi Hitung Bilangan Rasional"], "Diambil dari judul bagian (sub-bab utama hanya terbaca sebagian)"],
    "Matematika||3": [["A. Konsep Rasio", "B. Skala"]],
    "PJOK||1": [["Sejarah Permainan Bola Basket", "Variasi Melempar dan Menangkap", "Pivot", "Menembak Bola (Shooting)", "Rebound", "Bermain Bola Basket dengan Aturan Sederhana"], "Teknik menggiring (dribble) tidak terbaca — mohon dicek"],
    "PJOK||2": [["Passing Bawah dan Passing Atas", "Servis Bawah dan Servis Atas", "Pukulan Spike", "Bendungan (Blocking)", "Bermain Bola Voli dengan Aturan Sederhana"]],
    "PJOK||3": [["Menangkap dan Lempar Tangkap Bola", "Variasi Gerak Memukul", "Memukul dan Berlari Menuju Tiang Hinggap", "Bermain Kasti dengan Aturan Sederhana"], "Judul sub-bab utama tidak terbaca; disusun dari judul bagian — mohon dicek"],
    "PJOK||4": [["Sejarah Pencak Silat", "Teknik Pukulan dan Tendangan", "Tangkisan dan Elakan"]],
    "PJOK||6": [["A. Pengertian Senam Lantai", "B. Gerakan Senam Lantai (Rol Depan & Rol Belakang)"]],
    "PJOK||7": [["A. Hakikat Aktivitas Gerak Berirama", "B. Pembelajaran Macam-Macam Langkah Kaki", "C. Pembelajaran Kombinasi Langkah Kaki dan Ayunan Lengan"]],
    "PJOK||8": [["Komposisi Tubuh", "Pengukuran Komponen Kebugaran Terkait Kesehatan (IMT, Kekuatan & Daya Tahan Otot, Kelenturan)"], "Sub-bab pertama (hal. 5–21) tidak terbaca — mohon dicek"],
    "PJOK||9": [["A. Pola Makan Sehat dan Bergizi Seimbang", "B. Pedoman Gizi Seimbang"]],
    "PPKN/Seni Budaya|PPKn|1": [["A. Kelahiran Pancasila dalam Sidang BPUPK", "B. Perumusan Pancasila oleh Panitia Sembilan", "Pembentukan PPKI dan Penetapan Pancasila sebagai Dasar Negara"], "Sub-bab ketiga diambil dari judul bagian — mohon dicek"],
    "PPKN/Seni Budaya|PPKn|2": [["A. Makna Sila-Sila Pancasila", "B. Penerapan Pancasila dalam Kehidupan Bermasyarakat"]],
    "PPKN/Seni Budaya|PPKn|3": [["A. Manusia sebagai Makhluk Tuhan Yang Maha Esa, Makhluk Individu, dan Makhluk Sosial", "B. Pengertian Norma", "C. Macam-Macam Norma", "D. Mari Bertindak Sesuai Norma"]],
    "PPKN/Seni Budaya|Seni Rupa|1": [["A. Komposisi Bentuk Geometris", "B. Karya Alam Benda"]],
    "PPKN/Seni Budaya|Seni Rupa|2": [["A. Desain Ragam Hias", "B. Ragam Hias Organis dan Geometris", "C. Aplikasi Desain Pola Organis dan Geometris pada Benda"]],
    "PPKN/Seni Budaya|Seni Rupa|3": [["A. Sejarah Tipografi", "B. Mengenal Dasar Tipografi", "Mengenal dan Membuat Logo"], "Sub-bab tentang logo diambil dari judul bagian — mohon dicek"],
  },
};
function _spDariBawaan(namaKelas, namaMapel) {
  const d = ((SP_BAWAAN[namaKelas] || {})[namaMapel]) || null; if (!d) return null;
  const bab = {}, subK = SP_SUB_BAWAAN[namaKelas] || {};
  d.forEach(([no, judul, hal, cat, buku], i) => {
    const isi = cat === "isi", s = subK[`${namaMapel}|${buku || ""}|${no}`] || [[], ""];
    const catatan = isi ? "Buku semester genap belum ada di Modul Ajar — judul bab perlu diisi" : [cat, s[1]].filter(Boolean).join(" · ");
    bab["w" + i] = { no, judul: isi ? "" : judul, buku: buku || "", sem: no <= 3 ? "ganjil" : "genap", hal: hal || null, sub: [...s[0]], jp: null, isi, catatan, u: i };
  });
  return { bab, asesmen: 1, cadangan: 0, bawaan: true };
}

// ── Muat data ──
async function _spMuat() {
  SP.muat = true; _spGambar();
  try {
    if (typeof ensureLookups === "function") await ensureLookups();
    const [y1] = SP.th.split("/").map(Number), dari = `${y1}-06-01`, sampai = `${y1 + 1}-07-31`;
    const [jd, kd, jr, data, atur] = await Promise.all([
      supa.from("jadwal_pelajaran").select("hari,jam_mulai,mapel_id,guru_id,aktif,tipe_minggu").eq("kelas_id", SP.kelasId),
      supa.from("kaldik_item").select("judul,jenis,keterangan,tanggal_mulai,tanggal_selesai").gte("tanggal_mulai", dari).lte("tanggal_mulai", sampai).order("tanggal_mulai"),
      supa.from("jurnal_kelas").select("tanggal,mapel_id,materi_pokok,guru_id").eq("kelas_id", SP.kelasId).gte("tanggal", `${y1}-07-01`).lte("tanggal", `${y1 + 1}-06-30`).order("tanggal"),
      _kvAmbil(_spKunci(SP.kelasId), {}), _kvAmbil(`silabus:${SP.th}:atur`, {}),
    ]);
    SP.jadwal = (jd.data || []).filter((x) => x.aktif !== false); SP.kaldik = kd.data || []; SP.jurnal = jr.data || [];
    SP.data = data || {}; SP.atur = atur || {};
  } catch (e) { toast("Gagal memuat silabus: " + (e.message || e), "err"); }
  SP.muat = false; _spGambar();
}
const _spMapel = (id) => (LOOKUP.mapel || []).find((m) => m.id === id) || {};
const _spKelas = (id) => (LOOKUP.kelas || []).find((k) => k.id === id) || {};
const _spGuru = (id) => ((LOOKUP.guruAll || LOOKUP.guru || []).find((g) => g.id === id) || {}).nama || "";
function _spMapelData(mapelId) {
  const d = SP.data[mapelId]; if (d && d.bab && Object.keys(d.bab).length) return d;
  return _spDariBawaan(_spKelas(SP.kelasId).nama_kelas, _spMapel(mapelId).nama_mapel) || { bab: {}, asesmen: 1, cadangan: 0, kosong: true };
}
const _spBabSem = (d, sem) => Object.entries(d.bab || {}).filter(([, b]) => b && !b.dihapus && b.sem === sem).map(([id, b]) => ({ id, ...b })).sort((a, b) => (a.u ?? 0) - (b.u ?? 0) || (a.buku || "").localeCompare(b.buku || "") || a.no - b.no);
const _spNamaBab = (b) => `${b.buku ? b.buku + " · " : ""}Bab ${b.no}${b.judul ? " " + b.judul : ""}`;

// ── Rentang semester dari Kalender Akademik (bisa diisi manual bila belum ada) ──
function _spRentang(sem) {
  const [y1] = SP.th.split("/").map(Number), k = SP.kaldik, a = SP.atur || {};
  const cari = (re, dariT, sampaiT) => k.find((x) => re.test(x.judul || "") && x.tanggal_mulai >= dariT && x.tanggal_mulai <= sampaiT);
  const kemarin = (s) => { const d = new Date(s + "T00:00:00"); d.setDate(d.getDate() - 1); return _spISO(d); };
  let awal, akhir, sumberAwal = "Kalender Akademik", sumberAkhir = "Kalender Akademik";
  if (sem === "ganjil") {
    const aw = cari(/awal\s*kbm|hari pertama|awal tahun (pelajaran|ajaran)/i, `${y1}-06-15`, `${y1}-09-30`); awal = aw && aw.tanggal_mulai;
    const ak = cari(/(sumatif|penilaian|ujian)\s*akhir\s*semester\s*(ganjil|1)|\bPAS\b|\bSAS\b/i, `${y1}-10-01`, `${y1 + 1}-01-15`); akhir = ak && kemarin(ak.tanggal_mulai);
    if (!akhir) { const lb = cari(/libur\s*semester\s*ganjil/i, `${y1}-11-01`, `${y1 + 1}-01-15`); akhir = lb && kemarin(lb.tanggal_mulai); }
  } else {
    const aw = cari(/awal\s*kbm\s*semester\s*genap|awal\s*semester\s*genap/i, `${y1}-12-01`, `${y1 + 1}-02-28`); awal = aw && aw.tanggal_mulai;
    const ak = cari(/(sumatif|penilaian|ujian)\s*akhir\s*(semester\s*genap|semester\s*2|tahun)|\bPAT\b|\bSAT\b|kenaikan kelas/i, `${y1 + 1}-04-01`, `${y1 + 1}-07-15`); akhir = ak && kemarin(ak.tanggal_mulai);
  }
  if ((a.awal || {})[sem]) { awal = a.awal[sem]; sumberAwal = "diatur"; }
  if ((a.akhir || {})[sem]) { akhir = a.akhir[sem]; sumberAkhir = "diatur"; }
  return { awal: awal || null, akhir: akhir || null, sumberAwal, sumberAkhir };
}
// tanggal tanpa KBM untuk mapel ini (libur & ujian; ujian khusus Diniyah/Umum hanya memotong kelompoknya)
function _spTanpaKbm(mp) {
  const noKelas = ((_spKelas(SP.kelasId).nama_kelas || "").match(/\d{1,2}/) || [])[0];
  const s = new Set(), umum = !!mp.masuk_umum || !mp.masuk_diniyyah, diniyah = !!mp.masuk_diniyyah && !mp.masuk_umum;
  const daftar = typeof _kaldikTanpaKbm === "function" ? _kaldikTanpaKbm(SP.kaldik) : SP.kaldik.filter((x) => x.jenis === "libur");
  daftar.forEach((x) => {
    const j = x.judul || "";
    if (x.jenis !== "libur") {
      if (/diniy/i.test(j) && !/umum/i.test(j) && !diniyah) return; if (/umum/i.test(j) && !/diniy/i.test(j) && !umum) return;
      const kls = [...j.matchAll(/kelas\s*(\d{1,2})/gi)].map((m) => m[1]); if (kls.length && noKelas && !kls.includes(noKelas)) return; // agenda khusus kelas lain (AN kelas 8, TKA kelas 12)
    }
    const d = new Date(x.tanggal_mulai + "T00:00:00"), e = new Date((x.tanggal_selesai || x.tanggal_mulai) + "T00:00:00");
    for (; d <= e; d.setDate(d.getDate() + 1)) s.add(_spISO(d));
  });
  return s;
}
// daftar tanggal pertemuan mapel di semester ini
function _spPertemuan(mapelId, sem) {
  const r = _spRentang(sem); if (!r.awal || !r.akhir) return { tgl: [], rentang: r, perPekan: 0 };
  const hari = SP.jadwal.filter((j) => j.mapel_id === mapelId).map((j) => SP_HARI[j.hari]).filter((x) => x != null);
  const libur = _spTanpaKbm(_spMapel(mapelId)), tgl = [];
  const d = new Date(r.awal + "T00:00:00"), e = new Date(r.akhir + "T00:00:00");
  for (; d <= e; d.setDate(d.getDate() + 1)) { const s = _spISO(d); if (libur.has(s)) continue; hari.filter((h) => h === d.getDay()).forEach(() => tgl.push(s)); }
  return { tgl, rentang: r, perPekan: hari.length, hari: [...new Set(hari)].sort().map((h) => SP_NM_HARI[h]) };
}
// ── Bagi pertemuan ke tiap bab (sebanding halaman; minimal 1 pertemuan materi + asesmen) ──
function _spRencana(mapelId, sem) {
  const d = _spMapelData(mapelId), bab = _spBabSem(d, sem), p = _spPertemuan(mapelId, sem), N = p.tgl.length;
  const A = Math.max(0, Number(d.asesmen ?? 1)), cad = Math.max(0, Number(d.cadangan ?? 0));
  const hasil = { bab: [], cadangan: [], N, p, kurang: 0, d };
  if (!bab.length || !N) return hasil;
  const tetap = bab.filter((b) => Number(b.jp) > 0), otomatis = bab.filter((b) => !(Number(b.jp) > 0));
  const halAda = bab.map((b) => Number(b.hal) || 0).filter(Boolean).sort((a, b) => a - b), median = halAda.length ? halAda[Math.floor(halAda.length / 2)] : 1;
  const w = (b) => Number(b.hal) || median;
  let sisa = N - cad - tetap.reduce((a, b) => a + Number(b.jp), 0);
  const min = 1 + A, jp = {};
  tetap.forEach((b) => (jp[b.id] = Number(b.jp)));
  if (otomatis.length) {
    if (sisa < otomatis.length * min) { hasil.kurang = otomatis.length * min - sisa; otomatis.forEach((b) => (jp[b.id] = Math.max(1, Math.floor(Math.max(0, sisa) / otomatis.length)))); }
    else {
      const bebas = sisa - otomatis.length * min, sw = otomatis.reduce((a, b) => a + w(b), 0);
      const dasar = otomatis.map((b) => ({ b, x: (bebas * w(b)) / sw }));
      dasar.forEach((o) => (jp[o.b.id] = min + Math.floor(o.x)));
      let lebih = bebas - dasar.reduce((a, o) => a + Math.floor(o.x), 0);
      dasar.slice().sort((a, b) => (b.x % 1) - (a.x % 1)).forEach((o) => { if (lebih > 0) { jp[o.b.id]++; lebih--; } });
    }
  }
  let k = 0;
  bab.forEach((b) => {
    const n = jp[b.id] || 0, tgl = p.tgl.slice(k, k + n); k += n;
    hasil.bab.push({ ...b, jp: n, tgl, mulai: tgl[0] || null, selesai: tgl[tgl.length - 1] || null, asesmen: Math.min(A, Math.max(0, n - 1)) });
  });
  hasil.cadangan = p.tgl.slice(k);
  if (k > N) hasil.kurang = Math.max(hasil.kurang, k - N);
  return hasil;
}
// ── Capaian dari jurnal ──
const _spNorm = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9؀-ۿ ]/g, " ").replace(/\s+/g, " ").trim();
const SP_KATA_UMUM = new Set(("dan di ke dari yang untuk pada dengan dalam serta atau bab materi pembelajaran tentang the of in a an to is are my " +
  "kehidupan sehari hari lanjutan melanjutkan mengulang penugasan pengenalan dasar contoh soal latihan tugas koreksi bersama memahami mengenal pengertian").split(" "));
const _spKata = (s) => [...new Set(_spNorm(s).split(" ").filter((x) => x.length > 2 && !SP_KATA_UMUM.has(x)))];
// kata jurnal dianggap sama bila persis, atau (≥4 huruf) yang satu memuat yang lain: "pengoperasian" ~ "operasi"
const _spSama = (a, b) => a === b || (a.length >= 4 && b.length >= 4 && (a.includes(b) || b.includes(a)));
function _spCocokBab(materi, bab) {
  const m = _spNorm(materi); if (!m) return -1;
  const nomor = m.match(/\b(?:bab|chapter|unit)\s*(\d{1,2})\b/);
  if (nomor) { const i = bab.findIndex((b) => Number(b.no) === Number(nomor[1])); if (i >= 0) return i; }
  const kataM = _spKata(m); if (!kataM.length) return -1;
  const vocab = bab.map((b) => ({ j: _spKata(b.judul), s: _spKata((b.sub || []).join(" ")) }));
  // bobot: kata di judul bab ×2, di sub-bab ×1, dibagi jumlah bab yang memuat kata itu (kata umum di banyak bab bernilai kecil)
  const skor = vocab.map(() => 0);
  kataM.forEach((t) => {
    const ada = vocab.map((v) => (v.j.some((x) => _spSama(t, x)) ? 2 : v.s.some((x) => _spSama(t, x)) ? 1 : 0));
    const df = ada.filter(Boolean).length; if (!df) return;
    ada.forEach((w, i) => { if (w) skor[i] += w / df; });
  });
  const maks = Math.max(...skor); if (maks < 0.6) return -1;
  const juara = skor.map((s, i) => (s === maks ? i : -1)).filter((i) => i >= 0);
  return juara.length === 1 ? juara[0] : -1; // seri → belum bisa dipastikan
}
function _spCapaian(mapelId, sem, rc) {
  const r = rc.p.rentang, hariIni = _spHariIni();
  const jr = SP.jurnal.filter((j) => j.mapel_id === mapelId && r.awal && j.tanggal >= r.awal && j.tanggal <= (r.akhir || "9999"));
  const rencanaSd = rc.p.tgl.filter((t) => t <= hariIni).length;
  let idx = -1; const cocok = jr.map((j) => { const i = _spCocokBab(j.materi_pokok, rc.bab); if (i > idx) idx = i; return { ...j, bab: i }; });
  let target = -1; rc.bab.forEach((b, i) => { if (b.mulai && b.mulai <= hariIni) target = i; }); // bab yang seharusnya sedang/sudah dipelajari
  let status = "belum", label = "Belum Dimulai";
  if (!rc.bab.length) return { jr: cocok, terlaksana: jr.length, rencanaSd, idx, target, status: "kosong", label: "Belum Ada Daftar Bab", selesai: false };
  if (r.awal && hariIni < r.awal) { status = "belum"; label = "Belum Dimulai"; }
  else if (!jr.length) { status = rencanaSd ? "kosong" : "belum"; label = rencanaSd ? "Belum Ada Jurnal" : "Belum Dimulai"; }
  else if (idx < 0) { status = "tak"; label = "Jurnal Belum Terbaca"; }
  else if (idx < target) { status = "telat"; label = `Tertinggal ${target - idx} Bab`; }
  else if (idx > target) { status = "cepat"; label = "Lebih Cepat"; }
  else { status = "sesuai"; label = "Sesuai Rencana"; }
  const selesai = r.akhir && hariIni > r.akhir;
  if (selesai && idx >= 0) { if (idx >= rc.bab.length - 1) { status = "tuntas"; label = "Target Tercapai"; } else { status = "telat"; label = `Kurang ${rc.bab.length - 1 - idx} Bab`; } }
  return { jr: cocok, terlaksana: jr.length, rencanaSd, idx, target, status, label, selesai };
}

// ── Tampilan ──
function _spPasang() {
  const pg = document.getElementById("page-silabus"); if (!pg || document.getElementById("sl-tab-prosem")) return;
  const bar = pg.querySelector("div"); if (!bar) return;
  bar.insertAdjacentHTML("afterbegin", `<button id="sl-tabbtn-prosem" class="btn btn-accent" onclick="gantiTabSilabus('prosem')">📘 Silabus & Prosem</button>`);
  bar.insertAdjacentHTML("afterend", `<div id="sl-tab-prosem"></div>`);
}
function spBuka() {
  _spPasang();
  SP.th = SP.th || _spTPKini(); SP.sem = SP.sem || _spSemKini();
  const kelasRuang = (LOOKUP.kelas || []).filter((k) => !k.ruang_id || k.ruang_id === STATE.ruang);
  if (!SP.kelasId || !kelasRuang.some((k) => k.id === SP.kelasId)) SP.kelasId = (kelasRuang.find((k) => /\b7\b/.test(k.nama_kelas)) || kelasRuang[0] || {}).id || "";
  SP.mapelId = ""; _spMuat();
}
function spPilih(jenis, nilai) {
  if (jenis === "kelas") { SP.kelasId = nilai; SP.mapelId = ""; return _spMuat(); }
  if (jenis === "th") { SP.th = nilai; SP.mapelId = ""; return _spMuat(); }
  if (jenis === "sem") SP.sem = nilai;
  if (jenis === "mapel") SP.mapelId = nilai;
  _spGambar();
  if (jenis === "mapel") { const el = document.getElementById("sl-tab-prosem"); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); }
}
const SP_WARNA = { sesuai: "#16a34a", tuntas: "#0f766e", cepat: "#2563eb", telat: "#dc2626", tak: "#d97706", kosong: "#94a3b8", belum: "#94a3b8" };
function _spGambar() {
  const w = document.getElementById("sl-tab-prosem"); if (!w) return;
  const kelasRuang = (LOOKUP.kelas || []).filter((k) => !k.ruang_id || k.ruang_id === STATE.ruang);
  const [y1] = (SP.th || _spTPKini()).split("/").map(Number), pilTh = [`${y1 - 1}/${y1}`, `${y1}/${y1 + 1}`, `${y1 + 1}/${y1 + 2}`];
  const kepala = `<div class="sp-hero"><div><small>Program Semester · Kurikulum Merdeka</small><h2>📘 Silabus & Prosem</h2><p>Bab tiap mapel dibagi ke pertemuan sesuai Jadwal Pelajaran dan hari aktif di Kalender Akademik. Capaian dibaca dari Jurnal Mengajar.</p></div>
    <div class="sp-pilih"><label>Tahun Pelajaran<select onchange="spPilih('th',this.value)">${pilTh.map((t) => `<option ${t === SP.th ? "selected" : ""}>${t}</option>`).join("")}</select></label>
      <label>Kelas<select onchange="spPilih('kelas',this.value)">${kelasRuang.map((k) => `<option value="${k.id}" ${k.id === SP.kelasId ? "selected" : ""}>${_spE(k.nama_kelas)}</option>`).join("")}</select></label>
      <div class="sp-seg">${["ganjil", "genap"].map((s) => `<button class="${s === SP.sem ? "on" : ""}" onclick="spPilih('sem','${s}')">Semester ${s === "ganjil" ? "Ganjil" : "Genap"}</button>`).join("")}</div></div></div>`;
  if (SP.muat) { w.innerHTML = kepala + `<div class="sp-muat">⏳ Memuat jadwal, kalender, dan jurnal…</div>`; return; }
  if (!SP.kelasId) { w.innerHTML = kepala + `<div class="card empty-state">Belum ada kelas di jenjang ini.</div>`; return; }
  const mapelIds = [...new Set(SP.jadwal.map((j) => j.mapel_id))].filter(Boolean).sort((a, b) => (_spMapel(a).nama_mapel || "").localeCompare(_spMapel(b).nama_mapel || ""));
  const r = _spRentang(SP.sem), boleh = _spBoleh();
  const infoSem = `<div class="sp-rentang ${!r.awal || !r.akhir ? "kurang" : ""}">🗓️ Semester ${SP.sem === "ganjil" ? "Ganjil" : "Genap"} ${SP.th}: <b>${_spTgl(r.awal, { day: "numeric", month: "long", year: "numeric" })}</b> s.d. <b>${r.akhir ? _spTgl(r.akhir, { day: "numeric", month: "long", year: "numeric" }) : `<mark class="kd-isi">belum ada di Kalender Akademik</mark>`}</b>
    <small>${r.awal && r.akhir ? `Awal & akhir KBM ${r.sumberAwal === "diatur" || r.sumberAkhir === "diatur" ? "diatur di sini" : "dari Kalender Akademik"}; libur & hari ujian tidak dihitung.` : "Isi tanggal awal/akhir KBM di Kalender Akademik, atau atur di sini."}</small>
    ${boleh ? `<button class="btn btn-sm btn-ghost" onclick="spAturRentang()">Atur Tanggal</button>` : ""}</div>`;
  const kartu = mapelIds.map((id) => {
    const mp = _spMapel(id), rc = _spRencana(id, SP.sem), c = _spCapaian(id, SP.sem, rc), d = rc.d;
    const guru = [...new Set(SP.jadwal.filter((j) => j.mapel_id === id).map((j) => _spGuru(j.guru_id)).filter(Boolean))].map((n) => n.split(",")[0]).join(", ");
    const pct = rc.N ? Math.round((c.terlaksana / rc.N) * 100) : 0, pctR = rc.N ? Math.round((c.rencanaSd / rc.N) * 100) : 0;
    const nIsi = rc.bab.filter((b) => b.isi).length;
    return `<button class="sp-kartu ${id === SP.mapelId ? "aktif" : ""}" style="--sw:${SP_WARNA[c.status]}" onclick="spPilih('mapel','${id}')">
      <div class="sp-k-atas"><b>${_spE(mp.nama_mapel || "?")}</b><em>${c.label}</em></div>
      <small>${_spE(guru || "—")} · ${rc.p.perPekan}× sepekan</small>
      <div class="sp-k-angka"><span><b>${rc.bab.length}</b> bab</span><span><b>${rc.N}</b> pertemuan</span><span><b>${c.terlaksana}</b> terjurnal</span></div>
      <div class="sp-bar" title="Garis = rencana sampai hari ini"><i style="width:${Math.min(100, pct)}%"></i><s style="left:${Math.min(100, pctR)}%"></s></div>
      ${d.kosong ? `<small class="sp-k-catat">Belum ada daftar bab</small>` : nIsi ? `<small class="sp-k-catat">${nIsi} bab perlu diisi</small>` : d.bawaan ? `<small class="sp-k-catat biru">Bawaan dari buku — belum disimpan</small>` : ""}</button>`;
  }).join("");
  w.innerHTML = kepala + infoSem + `<div class="sp-cari"><span>🔎</span><input type="search" id="sp-cari" placeholder="Cari bab / sub-bab di semua mapel kelas ini… mis. pecahan, pancasila, voli" value="${_spE(SP.cari || "")}" oninput="spCari(this.value)" autocomplete="off"><div id="sp-cari-hasil"></div></div><div class="sp-alat">${boleh ? `<button class="btn btn-sm btn-ghost" onclick="spUnduhTemplate()">⬇️ Unduh Template Excel</button><label class="btn btn-sm btn-ghost">⬆️ Unggah Excel<input type="file" accept=".xlsx,.xls" hidden onchange="spUnggah(this)"></label>` : ""}<button class="btn btn-sm btn-ghost" onclick="spCetak()">🖨️ Cetak Prosem Kelas</button>
    <span class="sp-legenda">${[["sesuai", "Sesuai"], ["cepat", "Lebih Cepat"], ["telat", "Tertinggal"], ["tak", "Jurnal Belum Terbaca"], ["kosong", "Belum Ada Jurnal"]].map(([k, l]) => `<i style="--sw:${SP_WARNA[k]}"></i>${l}`).join("")}</span></div>
    ${_spHtmlLengkap(mapelIds)}
    <div class="sp-grid">${kartu || `<div class="card empty-state">Belum ada jadwal pelajaran untuk kelas ini.</div>`}</div>
    <div id="sp-rinci">${SP.mapelId ? _spHtmlRinci(SP.mapelId) : `<div class="sp-petunjuk">Ketuk salah satu mapel untuk melihat pembagian bab, tanggal pertemuan, dan capaiannya.</div>`}</div>`;
}
function _spHtmlRinci(id) {
  const mp = _spMapel(id), rc = _spRencana(id, SP.sem), c = _spCapaian(id, SP.sem, rc), d = rc.d, boleh = _spBoleh(), hariIni = _spHariIni();
  const garis = rc.bab.map((b, i) => `<div class="sp-seg-bab ${i <= c.idx ? "lewat" : ""} ${i === c.target ? "target" : ""}" style="flex:${Math.max(1, b.jp)}" title="${_spE(_spNamaBab(b))}: ${b.jp} pertemuan"><span>${b.buku ? _spE(b.buku.slice(0, 4)) + " " : ""}${b.no}</span></div>`).join("") + (rc.cadangan.length ? `<div class="sp-seg-bab cad" style="flex:${rc.cadangan.length}"><span>±</span></div>` : "");
  const baris = rc.bab.map((b, i) => {
    const st = i < c.idx || (c.selesai && i <= c.idx) ? ["✓", "Tuntas", "ok"] : i === c.idx ? ["▶", "Sedang Dipelajari", "jalan"] : b.mulai && b.mulai <= hariIni ? ["⚠", "Seharusnya Sudah Dimulai", "telat"] : ["○", "Belum", ""];
    const jurnalBab = c.jr.filter((j) => j.bab === i);
    return `<div class="sp-bab ${st[2]} ${b.isi ? "isi" : ""}">
      <div class="sp-bab-no">${b.buku ? `<small>${_spE(b.buku)}</small>` : ""}Bab ${b.no}</div>
      <div class="sp-bab-isi"><b>${b.judul ? _spE(b.judul) : `<mark class="kd-isi">Judul bab perlu diisi</mark>`}</b>
        ${(b.sub || []).length ? `<ul>${b.sub.map((s) => `<li>${_spE(s)}</li>`).join("")}</ul>` : `<small class="sp-redup">${b.isi ? "" : "Sub-bab belum diisi"}</small>`}
        ${b.catatan ? `<small class="sp-catat">ℹ️ ${_spE(b.catatan)}</small>` : ""}
        ${jurnalBab.length ? `<details class="sp-jr"><summary>📓 ${jurnalBab.length} jurnal cocok dengan bab ini</summary>${jurnalBab.map((j) => `<div>${_spTgl(j.tanggal)} — ${_spE(j.materi_pokok)}</div>`).join("")}</details>` : ""}</div>
      <div class="sp-bab-jp"><b>${b.jp}</b><small>pertemuan${b.asesmen ? ` (${b.asesmen} asesmen)` : ""}${b.hal ? ` · ${b.hal} hlm` : ""}</small></div>
      <div class="sp-bab-tgl">${b.mulai ? `${_spTgl(b.mulai)} – ${_spTgl(b.selesai)}` : "—"}<div class="sp-chip-tgl">${b.tgl.map((t, k) => `<i class="${t <= hariIni ? "lewat" : ""} ${k >= b.tgl.length - b.asesmen ? "ases" : ""}" title="${SP_NM_HARI[new Date(t + "T00:00:00").getDay()]}, ${_spTgl(t, { day: "numeric", month: "long" })}${k >= b.tgl.length - b.asesmen ? " · Asesmen" : ""}">${new Date(t + "T00:00:00").getDate()}</i>`).join("")}</div></div>
      <div class="sp-bab-st"><span>${st[0]}</span>${st[1]}</div></div>`;
  }).join("");
  const tanpaBab = c.jr.filter((j) => j.bab < 0);
  return `<div class="card sp-rinci" style="--sw:${SP_WARNA[c.status]}">
    <div class="sp-r-kepala"><div><small>${_spE(_spKelas(SP.kelasId).nama_kelas)} · Semester ${SP.sem === "ganjil" ? "Ganjil" : "Genap"} ${SP.th}</small><h3>${_spE(mp.nama_mapel)}</h3>
      <p>${rc.p.hari && rc.p.hari.length ? `Jadwal: ${rc.p.hari.join(", ")} (${rc.p.perPekan}× sepekan)` : "Tidak ada di jadwal"} · <b>${rc.N}</b> pertemuan efektif · asesmen ${d.asesmen ?? 1}× per bab${Number(d.cadangan) ? ` · cadangan ${d.cadangan}` : ""}</p></div>
      <div class="sp-r-status"><em>${c.label}</em><small>${c.terlaksana} jurnal dari ${c.rencanaSd} pertemuan yang seharusnya sudah berjalan</small></div></div>
    ${rc.kurang ? `<div class="sp-peringatan">⚠️ Pertemuan tidak cukup: kurang ${rc.kurang} pertemuan untuk semua bab (minimal ${1 + Number(d.asesmen ?? 1)} per bab). Kurangi asesmen, pindahkan bab ke semester lain, atau tambah jam di jadwal.</div>` : ""}
    ${d.bawaan ? `<div class="sp-info">📚 Daftar bab ini <b>bawaan dari Daftar Isi buku</b> di Modul Ajar (bab 1–3 semester ganjil, bab 4 dst. genap). ${boleh ? "Periksa lalu tekan <b>Ubah</b> → <b>Simpan</b> agar ditetapkan." : "Menunggu ditetapkan Penyelenggara/Admin."}</div>` : d.oleh ? `<div class="sp-info hijau">✓ Ditetapkan oleh ${_spE(String(d.oleh).split(",")[0])} · ${new Date(d.t || Date.now()).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</div>` : ""}
    ${rc.bab.length ? `<div class="sp-garis">${garis}</div>` : ""}
    <div class="sp-bab-daftar">${baris || `<div class="sp-petunjuk">Belum ada bab untuk semester ini.${boleh ? " Tekan Ubah untuk menambahkan." : ""}</div>`}</div>
    ${rc.cadangan.length ? `<div class="sp-cad">± ${rc.cadangan.length} pertemuan cadangan: ${rc.cadangan.map((t) => _spTgl(t)).join(", ")}</div>` : ""}
    ${tanpaBab.length ? `<details class="sp-jr luar"><summary>📓 ${tanpaBab.length} jurnal belum bisa dicocokkan dengan bab mana pun</summary>${tanpaBab.map((j) => `<div>${_spTgl(j.tanggal)} — ${_spE(j.materi_pokok || "(materi kosong)")}</div>`).join("")}<small>Tips: tulis materi jurnal dengan judul bab/sub-bab, mis. "Bab 2 Bilangan Rasional – penjumlahan pecahan".</small></details>` : ""}
    <div class="sp-r-aksi">${boleh ? `<button class="btn btn-accent" onclick="spUbah('${id}')">✏️ Ubah Bab & Sub-bab</button>` : ""}<button class="btn btn-ghost" onclick="spPilih('mapel','')">Tutup</button></div></div>`;
}

// ── Catatan kelengkapan silabus satu kelas (kedua semester) ──
function _spHtmlLengkap(mapelIds) {
  const kls = _spKelas(SP.kelasId).nama_kelas || "", baris = [], tanpaBab = [];
  mapelIds.forEach((id) => {
    const nm = _spMapel(id).nama_mapel || "?", d = _spMapelData(id), semua = ["ganjil", "genap"].flatMap((s) => _spBabSem(d, s));
    if (!semua.length) { tanpaBab.push(nm); return; }
    const isi = [];
    semua.forEach((b) => {
      const label = `${b.buku ? b.buku + " " : ""}Bab ${b.no}${b.judul ? " " + b.judul : ""} (${b.sem === "ganjil" ? "Ganjil" : "Genap"})`;
      if (b.isi) isi.push(`<b>${_spE(label)}</b>: judul bab & sub-bab perlu diisi (buku semester genap belum ada di Modul Ajar)`);
      else if (!(b.sub || []).length) isi.push(`<b>${_spE(label)}</b>: sub-bab belum diisi${b.catatan ? ` — ${_spE(b.catatan)}` : ""}`);
      else if (b.catatan) isi.push(`<b>${_spE(label)}</b>: ${_spE(b.catatan)}`);
    });
    if (isi.length) baris.push(`<li><b class="sp-l-mapel">${_spE(nm)}</b><ul>${isi.map((x) => `<li>${x}</li>`).join("")}</ul></li>`);
  });
  ["ganjil", "genap"].forEach((s) => { const r = _spRentang(s); if (!r.awal || !r.akhir) baris.push(`<li><b class="sp-l-mapel">Kalender Akademik</b><ul><li>Tanggal ${!r.awal ? "awal" : "akhir"} KBM semester ${s} ${SP.th} belum ada — isi di Kalender Akademik atau tombol Atur Tanggal</li></ul></li>`); });
  if (tanpaBab.length) baris.push(`<li><b class="sp-l-mapel">Belum ada daftar bab</b><ul><li>${tanpaBab.map(_spE).join(", ")} — belum ada buku di Modul Ajar (mapel diniyah menyusul)</li></ul></li>`);
  const n = baris.length; if (!n) return `<div class="sp-lengkap ok">✓ Silabus ${_spE(kls)} lengkap untuk kedua semester.</div>`;
  return `<details class="sp-lengkap"><summary>⚠️ Catatan Kelengkapan Silabus ${_spE(kls)} — ${n} hal perlu dilengkapi</summary><ul>${baris.join("")}</ul></details>`;
}

// ── Cari bab & sub-bab di semua mapel (kedua semester) ──
function spCari(q) {
  SP.cari = q; clearTimeout(SP.tCari);
  SP.tCari = setTimeout(() => {
    const w = document.getElementById("sp-cari-hasil"); if (!w) return;
    const kata = _spNorm(q).split(" ").filter((k) => k.length >= 2 || /\d/.test(k)); if (!kata.length) { w.innerHTML = ""; return; }
    const mapelIds = [...new Set(SP.jadwal.map((j) => j.mapel_id))].filter(Boolean), hasil = [];
    const sorot = (t) => { let h = _spE(t); kata.forEach((k) => { h = h.replace(new RegExp("(" + k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "ig"), "<mark>$1</mark>"); }); return h; };
    mapelIds.forEach((id) => {
      const nm = _spMapel(id).nama_mapel || "";
      ["ganjil", "genap"].forEach((sem) => {
        _spRencana(id, sem).bab.forEach((b) => {
          const teks = _spNorm([nm, b.buku, "bab " + b.no, b.judul, ...(b.sub || [])].join(" "));
          if (!kata.every((k) => teks.includes(k))) return;
          const subCocok = (b.sub || []).filter((x) => kata.some((k) => _spNorm(x).includes(k)));
          hasil.push({ id, sem, html: `<b>${_spE(nm)}</b> · ${sorot(_spNamaBab(b))}${subCocok.length ? `<small>${subCocok.slice(0, 3).map(sorot).join(" · ")}</small>` : ""}<em>Semester ${sem === "ganjil" ? "Ganjil" : "Genap"}${b.mulai ? ` · ${_spTgl(b.mulai)}–${_spTgl(b.selesai)} · ${b.jp} pertemuan` : ""}</em>` });
        });
      });
    });
    w.innerHTML = hasil.length ? `<div class="sp-cari-daftar">${hasil.slice(0, 30).map((h) => `<button onclick="spCariBuka('${h.id}','${h.sem}')">${h.html}</button>`).join("")}${hasil.length > 30 ? `<small>… ${hasil.length - 30} hasil lain, persempit kata kuncinya</small>` : ""}</div>` : `<div class="sp-cari-daftar kosong">Tidak ditemukan di silabus kelas ini.</div>`;
  }, 200);
}
function spCariBuka(id, sem) {
  const q = SP.cari || ""; SP.sem = sem; SP.mapelId = id; SP.cari = ""; _spGambar();
  setTimeout(() => {
    const r = document.getElementById("sp-rinci"); if (!r) return;
    const kata = _spNorm(q).split(" ").filter((k) => k.length >= 2);
    const bab = [...r.querySelectorAll(".sp-bab")].find((x) => kata.every((k) => _spNorm(x.textContent).includes(k))) || [...r.querySelectorAll(".sp-bab")].find((x) => kata.some((k) => _spNorm(x.textContent).includes(k))) || r;
    bab.classList.add("sp-kilat"); bab.scrollIntoView({ behavior: "smooth", block: "center" }); setTimeout(() => bab.classList.remove("sp-kilat"), 2600);
  }, 80);
}

// ── Atur tanggal semester (bila Kalender Akademik belum lengkap) ──
function spAturRentang() {
  if (!_spBoleh()) return; const r = _spRentang(SP.sem), a = SP.atur || {};
  openModal(`<div class="sp-modal"><h3>Tanggal KBM Semester ${SP.sem === "ganjil" ? "Ganjil" : "Genap"} ${SP.th}</h3>
    <p class="bsp-ket">Biarkan kosong agar mengikuti Kalender Akademik. Sekarang: ${_spTgl(r.awal, { day: "numeric", month: "long", year: "numeric" })} s.d. ${r.akhir ? _spTgl(r.akhir, { day: "numeric", month: "long", year: "numeric" }) : "belum ada"}.</p>
    <label class="bsp-f"><span>Awal KBM</span><input type="date" id="spr-awal" class="input" value="${(a.awal || {})[SP.sem] || ""}"></label>
    <label class="bsp-f"><span>Hari terakhir KBM (sebelum asesmen akhir semester)</span><input type="date" id="spr-akhir" class="input" value="${(a.akhir || {})[SP.sem] || ""}"></label>
    <div class="bsp-aksi-bawah"><button class="btn btn-outline" onclick="closeModal()">Tutup</button><button class="btn btn-accent" onclick="spSimpanRentang()">Simpan</button></div></div>`);
}
async function spSimpanRentang() {
  const aw = qs("spr-awal").value || null, ak = qs("spr-akhir").value || null;
  try { SP.atur = await _kvGabung(`silabus:${SP.th}:atur`, { awal: { [SP.sem]: aw }, akhir: { [SP.sem]: ak } }); closeModal(); toast("Tanggal semester disimpan", "ok"); _spGambar(); }
  catch (e) { toast("Gagal: " + (e.message || e), "err"); }
}

// ── Penyunting bab & sub-bab ──
function spUbah(mapelId) {
  if (!_spBoleh()) return;
  const d = _spMapelData(mapelId);
  SP.edit = { mapelId, asesmen: d.asesmen ?? 1, cadangan: d.cadangan ?? 0, bab: Object.entries(d.bab || {}).filter(([, b]) => b && !b.dihapus).map(([id, b]) => ({ id: b.isi || d.bawaan ? _spId() : id, ...b, sub: [...(b.sub || [])] })).sort((a, b) => (a.u ?? 0) - (b.u ?? 0)) };
  _spGambarUbah();
}
function _spGambarUbah() {
  const E = SP.edit, mp = _spMapel(E.mapelId);
  openModal(`<div class="sp-modal"><h3>Ubah Bab — ${_spE(mp.nama_mapel)} · ${_spE(_spKelas(SP.kelasId).nama_kelas)}</h3>
    <p class="bsp-ket">Tulis sub-bab satu per baris. Kolom <b>Pertemuan</b> boleh dikosongkan agar dibagi otomatis sebanding jumlah halaman. Bab yang judulnya masih kosong tidak disimpan.</p>
    <div class="sp-ed-atur"><label>Asesmen per bab <input type="number" min="0" max="3" class="input" value="${E.asesmen}" onchange="SP.edit.asesmen=Number(this.value)||0"></label>
      <label>Pertemuan cadangan per semester <input type="number" min="0" max="10" class="input" value="${E.cadangan}" onchange="SP.edit.cadangan=Number(this.value)||0"></label></div>
    <div class="sp-ed-daftar">${E.bab.map((b, i) => `<div class="sp-ed-bab">
      <div class="sp-ed-b1"><input class="input" style="width:62px" type="number" min="1" value="${b.no}" title="Nomor bab" onchange="SP.edit.bab[${i}].no=Number(this.value)||1">
        <input class="input" value="${_spE(b.judul)}" placeholder="Judul bab" oninput="SP.edit.bab[${i}].judul=this.value">
        <select class="input" style="width:auto" onchange="SP.edit.bab[${i}].sem=this.value"><option value="ganjil" ${b.sem === "ganjil" ? "selected" : ""}>Ganjil</option><option value="genap" ${b.sem === "genap" ? "selected" : ""}>Genap</option></select>
        <button class="btn btn-sm btn-ghost" title="Naikkan" onclick="spEdGeser(${i},-1)">↑</button><button class="btn btn-sm btn-ghost" title="Turunkan" onclick="spEdGeser(${i},1)">↓</button><button class="btn btn-sm btn-ghost" title="Hapus bab" onclick="spEdHapus(${i})">🗑️</button></div>
      <div class="sp-ed-b2"><textarea class="input" rows="2" placeholder="Sub-bab (satu per baris), mis.&#10;A. Mengenal Bilangan Bulat&#10;B. Operasi Hitung Bilangan Bulat" oninput="SP.edit.bab[${i}].sub=this.value.split('\\n').map(s=>s.trim()).filter(Boolean)">${_spE((b.sub || []).join("\n"))}</textarea>
        <div class="sp-ed-kecil"><label>Buku <input class="input" value="${_spE(b.buku || "")}" placeholder="(opsional)" oninput="SP.edit.bab[${i}].buku=this.value.trim()"></label>
        <label>Halaman <input class="input" type="number" min="0" value="${b.hal || ""}" oninput="SP.edit.bab[${i}].hal=Number(this.value)||null"></label>
        <label>Pertemuan <input class="input" type="number" min="0" value="${b.jp || ""}" placeholder="otomatis" oninput="SP.edit.bab[${i}].jp=Number(this.value)||null"></label></div></div></div>`).join("")}</div>
    <button class="btn btn-ghost" onclick="spEdTambah()">+ Tambah Bab</button>
    <div class="bsp-aksi-bawah"><button class="btn btn-outline" onclick="closeModal()">Batal</button><button class="btn btn-accent" onclick="spSimpanUbah()">Simpan & Tetapkan</button></div></div>`, { lebar: true });
}
function spEdGeser(i, arah) { const b = SP.edit.bab, j = i + arah; if (j < 0 || j >= b.length) return; [b[i], b[j]] = [b[j], b[i]]; _spGambarUbah(); }
function spEdHapus(i) { SP.edit.bab.splice(i, 1); _spGambarUbah(); }
function spEdTambah() { const b = SP.edit.bab, akhir = b[b.length - 1]; b.push({ id: _spId(), no: akhir ? Number(akhir.no) + 1 : 1, judul: "", buku: akhir ? akhir.buku || "" : "", sem: SP.sem, hal: null, sub: [], jp: null }); _spGambarUbah(); }
async function spSimpanUbah() {
  const E = SP.edit; if (!E) return;
  const bab = {};
  E.bab.filter((b) => String(b.judul || "").trim()).forEach((b, i) => { bab[b.id] = { no: Number(b.no) || i + 1, judul: String(b.judul).trim(), buku: b.buku || "", sem: b.sem === "genap" ? "genap" : "ganjil", hal: b.hal || null, sub: b.sub || [], jp: b.jp || null, catatan: b.isi ? "" : b.catatan || "", u: i }; });
  if (!Object.keys(bab).length) { toast("Isi minimal satu judul bab", "err"); return; }
  const isi = { bab, asesmen: E.asesmen, cadangan: E.cadangan, oleh: STATE.guruNama || "", t: Date.now() };
  try {
    // mapel ini diganti utuh (bab yang dihapus ikut hilang); mapel lain tidak tersentuh
    SP.data = await _kvGabung(_spKunci(SP.kelasId), { [E.mapelId]: null });
    SP.data = await _kvGabung(_spKunci(SP.kelasId), { [E.mapelId]: isi });
    if (typeof _rgLog === "function") _rgLog("silabus-ubah", { kelas: _spKelas(SP.kelasId).nama_kelas, mapel: _spMapel(E.mapelId).nama_mapel, bab: Object.keys(bab).length });
    closeModal(); toast("Silabus disimpan & ditetapkan", "ok"); SP.edit = null; _spGambar();
  } catch (e) { toast("Gagal menyimpan: " + (e.message || e), "err"); }
}

// ── Template Excel: unduh (sudah terisi) & unggah ──
const SP_KOLOM = ["Mapel", "Semester", "Buku", "No Bab", "Judul Bab", "Sub-bab (pisahkan dengan ;)", "Halaman", "Pertemuan (kosong = otomatis)"];
function spUnduhTemplate() {
  if (typeof XLSX === "undefined") { toast("Pustaka Excel belum termuat", "err"); return; }
  const mapelIds = [...new Set(SP.jadwal.map((j) => j.mapel_id))].filter(Boolean), baris = [SP_KOLOM];
  mapelIds.sort((a, b) => (_spMapel(a).nama_mapel || "").localeCompare(_spMapel(b).nama_mapel || "")).forEach((id) => {
    const d = _spMapelData(id), bab = ["ganjil", "genap"].flatMap((s) => _spBabSem(d, s));
    if (!bab.length) baris.push([_spMapel(id).nama_mapel, "Ganjil", "", 1, "", "", "", ""]);
    bab.forEach((b) => baris.push([_spMapel(id).nama_mapel, b.sem === "genap" ? "Genap" : "Ganjil", b.buku || "", b.no, b.judul || "", (b.sub || []).join("; "), b.hal || "", b.jp || ""]));
  });
  const ws = XLSX.utils.aoa_to_sheet(baris); ws["!cols"] = [{ wch: 20 }, { wch: 9 }, { wch: 10 }, { wch: 7 }, { wch: 42 }, { wch: 60 }, { wch: 9 }, { wch: 14 }];
  const petunjuk = XLSX.utils.aoa_to_sheet([["PETUNJUK"], ["1. Satu baris = satu bab. Nama Mapel harus sama dengan nama di Jadwal Pelajaran."], ["2. Semester: Ganjil atau Genap."], ["3. Sub-bab dipisahkan titik koma (;), mis. A. Bilangan Bulat; B. Operasi Hitung"], ["4. Halaman dipakai untuk membagi pertemuan (bab tebal dapat lebih banyak). Pertemuan boleh diisi sendiri."], ["5. Mapel yang ada di file ini akan DIGANTI isinya; mapel yang tidak ada tidak berubah."]]);
  const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, "Silabus"); XLSX.utils.book_append_sheet(wb, petunjuk, "Petunjuk");
  XLSX.writeFile(wb, `Template Silabus ${_spKelas(SP.kelasId).nama_kelas} ${SP.th.replace("/", "-")}.xlsx`);
}
async function spUnggah(input) {
  const f = input.files && input.files[0]; input.value = ""; if (!f || !_spBoleh()) return;
  try {
    const wb = XLSX.read(await f.arrayBuffer(), { type: "array" }), ws = wb.Sheets[wb.SheetNames.find((n) => /silabus/i.test(n)) || wb.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" }).slice(1).filter((r) => String(r[0]).trim() && String(r[4]).trim());
    const mapelNama = Object.fromEntries((LOOKUP.mapel || []).map((m) => [String(m.nama_mapel).toLowerCase().trim(), m.id]));
    const per = {}, takDikenal = new Set();
    rows.forEach((r, i) => {
      const id = mapelNama[String(r[0]).toLowerCase().trim()]; if (!id) { takDikenal.add(String(r[0]).trim()); return; }
      const d = (per[id] = per[id] || { bab: {}, asesmen: (SP.data[id] || {}).asesmen ?? 1, cadangan: (SP.data[id] || {}).cadangan ?? 0, oleh: STATE.guruNama || "", t: Date.now() });
      d.bab[_spId() + i] = { no: Number(r[3]) || i + 1, judul: String(r[4]).trim(), buku: String(r[2] || "").trim(), sem: /genap|2/i.test(String(r[1])) ? "genap" : "ganjil", sub: String(r[5] || "").split(/;|\n/).map((s) => s.trim()).filter(Boolean), hal: Number(r[6]) || null, jp: Number(r[7]) || null, u: i };
    });
    const n = Object.keys(per).length;
    if (!n) { toast("Tidak ada baris yang bisa dibaca. Pastikan memakai template dari tombol Unduh Template.", "err"); return; }
    const ok = await konfirmasiTema(`Ditemukan ${rows.length} bab untuk ${n} mapel (${Object.keys(per).map((id) => _spMapel(id).nama_mapel).join(", ")}).${takDikenal.size ? ` Mapel tidak dikenal (dilewati): ${[...takDikenal].join(", ")}.` : ""} Isi mapel tersebut akan diganti. Lanjutkan?`, { judul: "Unggah Silabus", teksOk: "Simpan" });
    if (!ok) return;
    for (const [id, isi] of Object.entries(per)) { await _kvGabung(_spKunci(SP.kelasId), { [id]: null }); SP.data = await _kvGabung(_spKunci(SP.kelasId), { [id]: isi }); }
    if (typeof _rgLog === "function") _rgLog("silabus-unggah", { kelas: _spKelas(SP.kelasId).nama_kelas, mapel: n, bab: rows.length });
    toast(`Silabus ${n} mapel disimpan dari Excel`, "ok"); _spGambar();
  } catch (e) { toast("Gagal membaca file: " + (e.message || e), "err"); }
}

// ── Cetak Prosem satu kelas (semester yang dipilih) ──
function spCetak() {
  const mapelIds = [...new Set(SP.jadwal.map((j) => j.mapel_id))].filter(Boolean).sort((a, b) => (_spMapel(a).nama_mapel || "").localeCompare(_spMapel(b).nama_mapel || ""));
  const r = _spRentang(SP.sem), nmKelas = _spKelas(SP.kelasId).nama_kelas, nmSem = SP.sem === "ganjil" ? "Ganjil" : "Genap";
  const isi = mapelIds.map((id) => {
    const rc = _spRencana(id, SP.sem); if (!rc.bab.length) return "";
    const guru = [...new Set(SP.jadwal.filter((j) => j.mapel_id === id).map((j) => _spGuru(j.guru_id)).filter(Boolean))].join(", ");
    return `<section><h2>${_spE(_spMapel(id).nama_mapel)}</h2><p>Tutor: ${_spE(guru || "—")} · ${rc.p.perPekan}× sepekan · ${rc.N} pertemuan efektif</p>
      <table><thead><tr><th>Bab</th><th>Judul & Sub-bab</th><th>Pertemuan</th><th>Tanggal</th></tr></thead><tbody>${rc.bab.map((b) => `<tr><td>${b.buku ? _spE(b.buku) + "<br>" : ""}Bab ${b.no}</td><td><b>${_spE(b.judul || "(perlu diisi)")}</b>${(b.sub || []).length ? `<ul>${b.sub.map((s) => `<li>${_spE(s)}</li>`).join("")}</ul>` : ""}</td><td style="text-align:center">${b.jp}${b.asesmen ? `<br><small>termasuk ${b.asesmen} asesmen</small>` : ""}</td><td>${b.mulai ? `${_spTgl(b.mulai)} – ${_spTgl(b.selesai)}` : "—"}<br><small>${b.tgl.map((t) => _spTgl(t)).join(", ")}</small></td></tr>`).join("")}</tbody></table></section>`;
  }).join("");
  const w = window.open("", "_blank"); if (!w) { toast("Izinkan jendela baru untuk mencetak", "err"); return; }
  w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Prosem ${_spE(nmKelas)} Semester ${nmSem} ${SP.th}</title><style>body{font-family:Arial,sans-serif;font-size:11px;color:#111;margin:18mm}h1{font-size:16px;text-align:center;margin:0}h1+p{text-align:center;margin:2px 0 14px}h2{font-size:13px;margin:16px 0 2px;border-bottom:2px solid #111}table{width:100%;border-collapse:collapse;margin-top:4px}th,td{border:1px solid #555;padding:4px;vertical-align:top}th{background:#eee}ul{margin:2px 0 0 14px;padding:0}small{color:#444}section{page-break-inside:avoid}@page{size:A4;margin:12mm}</style></head><body>
    <h1>PROGRAM SEMESTER (PROSEM) — ${_spE(nmKelas.toUpperCase())}</h1><p>PKBM Al-Umm Barabai · Semester ${nmSem} Tahun Pelajaran ${SP.th} · ${_spTgl(r.awal, { day: "numeric", month: "long", year: "numeric" })} s.d. ${_spTgl(r.akhir, { day: "numeric", month: "long", year: "numeric" })}</p>${isi}<script>setTimeout(()=>print(),400)<\/script></body></html>`);
  w.document.close();
}

// ── Pemasangan ke halaman Silabus ──
(function () {
  if (typeof gantiTabSilabus === "function") {
    const a = gantiTabSilabus;
    gantiTabSilabus = function (tab) {
      _spPasang();
      const t = document.getElementById("sl-tab-prosem"), b = document.getElementById("sl-tabbtn-prosem");
      if (tab === "prosem") {
        try { SILABUS_TAB_AKTIF = "prosem"; } catch (e) {}
        ["materi", "cpatp"].forEach((x) => { const el = document.getElementById("sl-tab-" + x), bt = document.getElementById("sl-tabbtn-" + x); if (el) el.style.display = "none"; if (bt) bt.className = "btn btn-outline"; });
        if (t) t.style.display = ""; if (b) b.className = "btn btn-accent";
        spBuka();
        return;
      }
      if (t) t.style.display = "none"; if (b) b.className = "btn btn-outline";
      return a.apply(this, arguments);
    };
  }
  try { SILABUS_TAB_AKTIF = "prosem"; } catch (e) {}
  if (typeof renderSilabusInit === "function") {
    const a = renderSilabusInit;
    renderSilabusInit = async function () { _spPasang(); return a.apply(this, arguments); };
  }
})();

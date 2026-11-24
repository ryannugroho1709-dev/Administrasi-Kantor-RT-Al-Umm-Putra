// ============================================================
//  🏢 KANTOR PKBM (Tahap 1 — tanpa AI) — khusus Admin utama
//  Kantor 3D: Ruang Ustadz, Ruang Rapat, Ruang Ustadzah. Para petugas (tanpa wajah) diambil dari
//  jabatan di aplikasi: Kepala PKBM, Sekretaris, Bendahara (Admin ARKAS), Admin Dapodik,
//  Penyelenggara & Admin tiap jenjang, Tim IT. Ustadzah bergamis hitam & bercadar.
//  Keluhan / masukan diarahkan otomatis ke petugas yang tepat (kata kunci), dijawab dengan
//  ringkasan data aplikasi (baca saja). Laporan aplikasi (bug / tampilan / fitur) dicatat Tim IT
//  sebagai TIKET — bisa disalin untuk dikerjakan Claude.
//  Penyimpanan (kuliah_pengaturan, ruang "*" lewat awalan "profil:"):
//    profil:kantor:atur   → { peran: {kode: [guruId]}, jk: {guruId: "L"|"P"} }
//    profil:kantor:tiket  → { id: {judul, isi, jenis, prioritas, status, t, oleh} }
//    profil:kantor:riwayat→ { id: {teks, peran:[...], jawab:[{kode, teks}], t} }
// ============================================================
const KT = { buka: false, staf: [], peran: {}, atur: { peran: {}, jk: {} }, tiket: {}, riwayat: {}, tokoh: {}, label: {}, gelembung: {}, kursiRapat: [], sibuk: false, sudut: Math.PI / 4, zoom: 1 };
const KT_ATUR = "bosp:kantor:atur", KT_TIKET = "bosp:kantor:tiket", KT_RIWAYAT = "bosp:kantor:riwayat";
// Data kantor bersama (ruang "*"), digabung di server lewat kv_gabung_umum (awalan bosp:) — bukan kv_gabung biasa,
// yang menyimpan ke ruang aktif lalu bentrok ("duplicate key") saat disimpan kedua kali.
const _ktSimpan = (kunci, potongan) => _bspGabungUmum(kunci, potongan);
async function _ktAmbil(kunci) {
  const baru = await supaSemua.from("kuliah_pengaturan").select("nilai").eq("kunci", kunci).eq("ruang_id", "*").maybeSingle();
  if (baru.data && baru.data.nilai) return baru.data.nilai;
  // pindahkan data lama (profil:kantor:*) bila ada
  const lama = await supaSemua.from("kuliah_pengaturan").select("nilai").eq("kunci", kunci.replace(/^bosp:/, "profil:")).limit(1).maybeSingle();
  const isi = (lama.data && lama.data.nilai) || {};
  if (Object.keys(isi).length) { try { await _ktSimpan(kunci, isi); } catch (e) {} }
  return isi;
}
const KT_JENJANG = { A: "Paket A", Pa: "Paket B & C Putra", Pi: "Paket B & C Putri" };
const _ktE = (s) => escapeHtml(s == null ? "" : String(s));
const _ktNama = (n) => String(n || "").split(",")[0].trim();

// ── Peran & jobdesk umum (bisa ditambah nanti) ──
const KT_PERAN = [
  { kode: "yayasan", nama: "Ketua Yayasan", ikon: "🕌", warna: "#0f766e",
    tugas: ["Pembina & penanggung jawab tertinggi lembaga (di atas Kepala PKBM)", "Menyimak rapat inti, terutama keuangan & laporan lengkap", "Mengawasi penggunaan dana BOSP & keuangan yayasan", "Menetapkan kebijakan & arah pengembangan PKBM", "Mengesahkan pengangkatan pengelola & tutor"],
    kata: ["yayasan", "ketua yayasan", "pembina"] },
  { kode: "kepala", nama: "Kepala PKBM", ikon: "🏛️", warna: "#b45309",
    tugas: ["Memimpin & mengarahkan seluruh kegiatan PKBM (selaku kepala sekolah)", "Memimpin rapat koordinasi di Ruang Rapat", "Menyetujui rencana anggaran (RKAS/ARKAS) & laporan", "Menandatangani surat, rapor, ijazah & dokumen resmi", "Mengevaluasi kinerja penyelenggara, admin & tutor", "Menjalin hubungan dengan Dinas Pendidikan & yayasan"],
    kata: ["kebijakan", "keputusan", "persetujuan", "setuju", "rapat", "evaluasi", "visi", "misi", "program kerja", "dinas", "yayasan", "kepala", "tanda tangan", "akreditasi"] },
  { kode: "sekretaris", nama: "Sekretaris", ikon: "🗂️", warna: "#0e7490",
    tugas: ["Memeriksa kelengkapan data guru & peserta didik", "Mengelola surat masuk / keluar & arsip", "Membuat notulen rapat", "Menyiapkan administrasi kegiatan & undangan", "Mengelola data mutasi siswa (masuk/keluar)", "Merekap kehadiran & laporan bulanan"],
    kata: ["data guru", "data siswa", "data santri", "biodata", "profil", "surat", "arsip", "administrasi", "notulen", "undangan", "mutasi", "kelengkapan", "foto guru", "no wa", "alamat"] },
  { kode: "bendahara", nama: "Bendahara & Admin ARKAS", ikon: "💰", warna: "#15803d",
    tugas: ["Menyusun & mengesahkan Kertas Kerja BOSP (ARKAS)", "Mengatur pagu & honor pengelola tiap jenjang", "Memeriksa realisasi belanja & bukti (nota, foto)", "Membuat laporan pertanggungjawaban (SPJ) & BKU", "Mengelola kas, insentif & slip gaji", "Menyiapkan bahan pemeriksaan / kunjungan keuangan"],
    kata: ["uang", "keuangan", "bosp", "bop", "arkas", "rkas", "anggaran", "pagu", "honor", "insentif", "gaji", "slip", "kas", "bayar", "nota", "kwitansi", "belanja", "realisasi", "spj", "pajak", "dana"] },
  { kode: "dapodik", nama: "Admin Dapodik", ikon: "🧾", warna: "#7c3aed",
    tugas: ["Memutakhirkan data Dapodik (peserta didik, PTK, rombel)", "Memeriksa NISN, NIK, No. KK & nama ibu kandung", "Sinkronisasi & verval data peserta didik", "Menyiapkan data untuk BOSP, ijazah & ANBK/TKA", "Mencocokkan data aplikasi dengan Dapodik"],
    kata: ["dapodik", "nisn", "nik", "no kk", "kartu keluarga", "npsn", "verval", "emis", "sinkron", "ptk", "rombel", "ibu kandung", "pip", "kip"] },
  ...["A", "Pa", "Pi"].map((r) => ({ kode: "peny-" + r, ruang: r, nama: "Penyelenggara " + KT_JENJANG[r], ikon: "🎓", warna: r === "A" ? "#047857" : r === "Pa" ? "#1d4ed8" : "#be185d",
    tugas: ["Menyelenggarakan KBM " + KT_JENJANG[r] + " (jadwal, tutor, kelas)", "Menyetujui izin, sakit & tukar jam tutor", "Menyusun kalender akademik & kegiatan jenjang", "Mengawasi ujian, rapor & kenaikan kelas", "Mengusulkan kebutuhan anggaran jenjang (Draft RKAS)", "Melaporkan perkembangan jenjang ke Kepala PKBM"],
    kata: ["kbm", "jadwal", "izin", "sakit", "tukar jam", "kalender", "libur", "ujian", "kegiatan", "tutor", "kurikulum", "wisuda", "kenaikan"] })),
  ...["A", "Pa", "Pi"].map((r) => ({ kode: "admin-" + r, ruang: r, nama: "Admin " + KT_JENJANG[r], ikon: "🖥️", warna: r === "A" ? "#0f766e" : r === "Pa" ? "#2563eb" : "#db2777",
    tugas: ["Mengelola data siswa, kelas & guru jenjang di aplikasi", "Memantau absensi & jurnal tutor", "Menginput / memeriksa nilai & mencetak rapor", "Membuat akun guru & membantu kendala login", "Menyusun Kertas Kerja BOSP & Draft RKAS jenjang", "Melaporkan kendala aplikasi ke Tim IT"],
    kata: ["absen", "absensi", "nilai", "rapor", "input", "kelas", "jurnal", "akun guru", "login guru", "cetak"] })),
  { kode: "desain", nama: "Tim Desain & Konten Creator", ikon: "🎨", warna: "#c2410c",
    tugas: ["Mengelola website PKBM Al-Umm & website Yayasan", "Mengelola Instagram & YouTube Rumah Tahfizh Al-Umm Putra Barabai (sementara)", "Membuat flyer, poster, banner & pamflet semua kegiatan", "Mendokumentasikan kegiatan (foto & video) lalu mengunggahnya", "Menjaga identitas visual PKBM (logo, warna, huruf) tetap seragam", "Menyiapkan konten penerimaan santri baru & pengumuman"],
    kata: ["desain", "flyer", "flayer", "poster", "banner", "pamflet", "spanduk", "konten", "instagram", "ig", "youtube", "website", "web", "media sosial", "medsos", "dokumentasi", "video kegiatan", "foto kegiatan", "brosur", "pengumuman"] },
  { kode: "it", nama: "Tim IT", ikon: "🛠️", warna: "#475569",
    tugas: ["Menerima laporan bug, tampilan & permintaan fitur aplikasi", "Mencatat tiket & menentukan prioritas", "Memperbaiki & memperbarui aplikasi", "Mengelola akun, keamanan & cadangan data", "Melatih guru memakai fitur baru", "Melaporkan perkembangan aplikasi di Ruang Rapat"],
    kata: ["bug", "error", "eror", "galat", "tampilan", "layar", "tombol", "fitur", "aplikasi", "lambat", "loading", "macet", "crash", "tidak bisa", "gak bisa", "ga bisa", "nggak bisa", "hp", "android", "browser", "sandi", "password", "login", "sidik jari", "notifikasi", "tambah fitur", "tambahkan", "perbaiki", "berantakan", "rusak", "hilang"] },
];
const _ktPeran = (k) => KT_PERAN.find((p) => p.kode === k);
const _ktPeranPendek = (k) => ({ yayasan: "Ketua Yayasan", kepala: "Kepala PKBM", sekretaris: "Sekretaris", bendahara: "Bendahara", dapodik: "Dapodik", it: "Tim IT", desain: "Desain & Konten" })[k] || (/^peny-/.test(k) ? "Penyelenggara " + ({ A: "A", Pa: "Putra", Pi: "Putri" })[k.slice(5)] : "Admin " + ({ A: "A", Pa: "Putra", Pi: "Putri" })[k.slice(6)]);

// ── Data: petugas dari jabatan di aplikasi (+ pengaturan kantor) ──
async function _ktMuatStaf() {
  const [g, jm, gj, bend, peny, atur, tiket] = await Promise.all([
    supaSemua.from("guru").select("id,nama,foto_url,ruang,ruang_utama,ruang_pendamping,status_aktif").eq("status_aktif", true),
    supaSemua.from("jabatan_master").select("id,kode,nama"),
    supaSemua.from("guru_jabatan").select("guru_id,jabatan_id,is_utama,ruang_id"),
    supaSemua.from("kuliah_pengaturan").select("nilai").eq("kunci", "bosp:bendahara").eq("ruang_id", "*").maybeSingle(),
    supaSemua.from("kuliah_pengaturan").select("ruang_id,nilai").eq("kunci", "penyelenggara"),
    _ktAmbil(KT_ATUR), _ktAmbil(KT_TIKET),
  ]);
  const guru = g.data || [], jab = jm.data || [], pegang = gj.data || [];
  KT.guru = guru; KT.atur = { peran: {}, jk: {}, ...(atur || {}) }; KT.tiket = tiket || {};
  const ada = (id) => guru.some((x) => x.id === id);
  const olehJabatan = (rx, ruang) => [...new Set(pegang.filter((p) => { const j = jab.find((x) => x.id === p.jabatan_id); return j && rx.test(j.kode + " " + j.nama) && (!ruang || p.ruang_id === ruang); }).map((p) => p.guru_id))].filter(ada);
  const p = {};
  p.kepala = olehJabatan(/kepala_pkbm|kepala pkbm/i).slice(0, 1);
  p.yayasan = olehJabatan(/ketua_yayasan|ketua yayasan/i).filter((id) => !p.kepala.includes(id)).slice(0, 1);
  p.bendahara = ((bend.data && bend.data.nilai && bend.data.nilai.ids) || []).filter(ada);
  if (!p.bendahara.length) p.bendahara = olehJabatan(/bendahara/i).slice(0, 1);
  p.sekretaris = olehJabatan(/sekretaris|^tu\b|tata usaha/i).slice(0, 1);
  p.dapodik = olehJabatan(/dapodik|operator/i).slice(0, 1);
  p.it = olehJabatan(/\bit\b|teknologi|programmer/i).slice(0, 1);
  p.desain = olehJabatan(/desain|konten|creator|media|humas/i).slice(0, 1);
  ["A", "Pa", "Pi"].forEach((r) => {
    const ids = ((peny.data || []).find((x) => x.ruang_id === r)?.nilai?.ids || []).filter(ada);
    p["peny-" + r] = (ids.length ? ids : olehJabatan(/kepala_sekolah|kepala sekolah|penyelenggara/i, r)).slice(0, 1);
    const adm = olehJabatan(/^admin\b|\badmin$/i, r).concat(guru.filter((x) => (x.ruang_pendamping || []).includes(r)).map((x) => x.id));
    p["admin-" + r] = [...new Set(adm)].filter((id) => !_ktAdminUtama(id)).slice(0, 2);
  });
  // pengaturan kantor menimpa hasil otomatis
  Object.entries(KT.atur.peran || {}).forEach(([k, ids]) => { if (Array.isArray(ids)) p[k] = ids.filter(ada); });
  KT.peran = p;
  // satu orang = satu meja (jabatan digabung)
  const orang = {};
  KT_PERAN.forEach((pr) => (p[pr.kode] || []).forEach((id) => { (orang[id] = orang[id] || []).push(pr.kode); }));
  KT.staf = Object.entries(orang).map(([id, peran]) => { const x = guru.find((y) => y.id === id) || {}; return { id, nama: _ktNama(x.nama), namaLengkap: x.nama, peran, jk: _ktJk(x), foto: x.foto_url || "" }; });
}
const _ktAdminUtama = (id) => { const x = (KT.guru || []).find((g) => g.id === id); return !!(x && (window.ADMIN_NAMES || ["Ryan Nugroho"]).some((n) => _ktNama(n).toLowerCase() === _ktNama(x.nama).toLowerCase())); };
function _ktJk(x) {
  const pilih = (KT.atur.jk || {})[x.id]; if (pilih === "L" || pilih === "P") return pilih;
  if (/^(ustadzah|ustzh|ibu|bu)\b/i.test(x.nama || "")) return "P";
  return x.ruang_utama === "Pi" || ((x.ruang || []).length === 1 && (x.ruang || [])[0] === "Pi") ? "P" : "L";
}

// ── Pintu masuk ──
async function ktBuka() {
  const pemilik = typeof isAdmin === "function" && isAdmin() && !(typeof isAdminKedua === "function" && isAdminKedua());
  if (!pemilik && !(await _ktBolehNonton())) { toast("Kantor PKBM hanya untuk Admin & yang diberi izin menyaksikan", "warn"); return; }
  if (KT.buka) return; KT.buka = true; KT.pemilik = pemilik; KT.penonton = !pemilik;
  const el = document.createElement("div"); el.id = "kantor-ai";
  el.innerHTML = `<div class="kt-atas"><div class="kt-judul"><b>🏢 Kantor PKBM Al-Umm</b><small>Ruang Kepala · Ruang Rapat · Ruang Ustadz · Ruang Ustadzah</small></div><button id="kt-rapat-tb" class="kt-rapat-tb" hidden onclick="ktPanelRapat()">🪑 Rapat Berlangsung</button>
      <div class="kt-alat">${pemilik ? `<button onclick="ktKabar()" title="Kabar baru dari tiap jenjang">📰<span class="kt-sembunyi-hp"> Kabar</span></button><button onclick="ktKeliling()" title="Kepala PKBM berkeliling">🚶</button><button onclick="ktTiketBuka()" title="Tiket Tim IT">🎫<span class="kt-sembunyi-hp"> Tiket</span><span id="kt-tiket-n"></span></button><button onclick="ktAturBuka()" title="Atur petugas">⚙️</button>` : `<span class="kt-nonton">👁️ Menyaksikan langsung</span>`}<button onclick="ktTutup()" title="Tutup">✕</button></div></div>
    <div class="kt-tengah"><div class="kt-layar" id="kt-layar"><div class="kt-memuat" id="kt-memuat"><i></i>Menyiapkan kantor…</div><div class="kt-hamparan" id="kt-hamparan"></div>
      <div class="kt-sorot"><button onclick="ktSorot(-1)" title="Ruang sebelumnya">‹</button><span id="kt-sorot-nama">Seluruh Kantor</span><button onclick="ktSorot(1)" title="Ruang berikutnya">›</button><button id="kt-auto" onclick="ktAuto()" title="Berpindah ruang otomatis">AUTO</button></div>
      <div class="kt-putar"><button onclick="ktPutar(-1)" title="Putar kiri">⟲</button><button onclick="ktZoom(1)" title="Perbesar">＋</button><button onclick="ktZoom(-1)" title="Perkecil">－</button><button onclick="ktPutar(1)" title="Putar kanan">⟳</button></div></div>
    <div class="kt-panel" id="kt-panel" hidden></div></div>
    <div class="kt-bawah" ${pemilik ? "" : "hidden"}><div class="kt-chip" id="kt-chip"></div>
      <div class="kt-kirim"><textarea id="kt-teks" rows="1" placeholder="Sampaikan keluhan, masukan, atau pertanyaan… (mis. tombol simpan rapor tidak bisa diklik)"></textarea><button onclick="ktKirim()" id="kt-tombol-kirim">Kirim</button></div></div>
`;
  document.body.appendChild(el);
  document.body.classList.add("kt-terbuka");
  const ta = el.querySelector("#kt-teks");
  ta.addEventListener("keydown", (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); ktKirim(); } });
  ta.addEventListener("input", () => { ta.style.height = "auto"; ta.style.height = Math.min(110, ta.scrollHeight) + "px"; });
  try {
    await Promise.all([_ktMuatThree(), _ktMuatStaf()]);
    if (!KT.buka) return;
    await _ktBangun(); _ktChip(); _ktTiketBadge();
    document.getElementById("kt-memuat")?.remove();
    if (!KT.staf.length) { _ktPanel(`<h3>Belum ada petugas</h3><p>Jabatan belum terbaca. Buka ⚙️ untuk memilih petugas tiap peran.</p>`); return; }
    // Kepala berkeliling tiap N menit (atur di ⚙️), kabar baru dilaporkan saat kantor dibuka
    KT.kelilingT = Date.now();
    _ktKanalBuka(); _ktSegarLayar(); KT.timerLayar = setInterval(() => { if (!document.hidden) _ktSegarLayar(); }, 60000);
    if (!pemilik) { await _ktPulihkanSiaran(); return; }
    KT.timer = setInterval(() => { const m = Number((KT.atur || {}).keliling ?? 30); if (m > 0 && !document.hidden && Date.now() - (KT.kelilingT || 0) >= m * 60000) ktKeliling(); }, 20000);
    setTimeout(() => { if (KT.buka) ktKabar(null, true); }, 1200);
  } catch (e) { const m = document.getElementById("kt-memuat"); if (m) m.innerHTML = "Gagal memuat kantor: " + _ktE(e.message || e); }
}
function ktTutup() {
  KT.buka = false; clearInterval(KT.autoT); KT.autoAktif = false; KT.fokus = null; KT.pusat = null; KT.zoom = 1; KT.sorotI = 0; cancelAnimationFrame(KT.raf); clearInterval(KT.timer); clearInterval(KT.timerLayar); KT.sibuk = false; KT.sesi = { aktif: false, ids: new Set(), judul: "" };
  try { KT.kanal && supaSemua.removeChannel(KT.kanal); } catch (e) {} KT.kanal = null; try { KT.ro && KT.ro.disconnect(); } catch (e) {}
  try { KT.renderer && KT.renderer.dispose(); } catch (e) {}
  KT.renderer = null; KT.tokoh = {}; KT.label = {}; KT.gelembung = {};
  window.removeEventListener("resize", _ktUkur);
  document.getElementById("kantor-ai")?.remove(); document.body.classList.remove("kt-terbuka");
}
function _ktMuatThree() {
  if (window.THREE) return Promise.resolve();
  return new Promise((res, rej) => { const s = document.createElement("script"); s.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"; s.onload = res; s.onerror = () => rej(new Error("Pustaka 3D gagal dimuat — periksa internet")); document.head.appendChild(s); });
}

// ── Kartu petugas & chip peran ──
function _ktChip() {
  const w = document.getElementById("kt-chip"); if (!w) return;
  if (!w.dataset.geser) {
    w.dataset.geser = "1";
    w.addEventListener("wheel", (e) => { if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) { e.preventDefault(); w.scrollLeft += e.deltaY; } }, { passive: false });
    let tarik = null; w.addEventListener("pointerdown", (e) => { if (e.pointerType === "mouse") tarik = { x: e.clientX, s: w.scrollLeft, g: 0 }; });
    window.addEventListener("pointermove", (e) => { if (tarik) { tarik.g = Math.abs(e.clientX - tarik.x); w.scrollLeft = tarik.s - (e.clientX - tarik.x); } });
    window.addEventListener("pointerup", () => { if (tarik && tarik.g > 5) w.addEventListener("click", (ev) => ev.stopPropagation(), { capture: true, once: true }); tarik = null; });
  }
  w.innerHTML = KT_PERAN.map((p) => { const ids = KT.peran[p.kode] || []; return `<button style="--w:${p.warna}" class="${ids.length ? "" : "kosong"}" onclick="${ids.length ? `ktKartu('${ids[0]}','${p.kode}')` : `ktAturBuka()`}">${p.ikon} ${_ktE(p.nama)}</button>`; }).join("");
}
function _ktPanel(html) { const p = document.getElementById("kt-panel"); if (!p) return; p.hidden = false; p.innerHTML = `<button class="kt-panel-x" onclick="this.parentElement.hidden=true;setTimeout(_ktUkur,30)">✕</button>${html}`; p.scrollTop = 0; setTimeout(_ktUkur, 30); }
function ktKartu(id, kode) {
  const s = KT.staf.find((x) => x.id === id); if (!s) return;
  if (!kode && (KT.peran.kepala || [])[0] === id && !KT.penonton) return ktMenuKepala();
  const daftar = kode ? [kode] : s.peran;
  _ktPanel(`<div class="kt-kartu-kepala">${_ktFoto(s, 46)}<div><b>${s.jk === "P" ? "Ustadzah" : "Ustadz"} ${_ktE(s.namaLengkap || s.nama)}</b><small>${s.peran.map((k) => _ktE(_ktPeran(k).nama)).join(" · ")}</small></div></div>
    ${daftar.map((k) => { const p = _ktPeran(k); return `<div class="kt-tugas" style="--w:${p.warna}"><b>${p.ikon} ${_ktE(p.nama)} — Tugas</b><ul>${p.tugas.map((t) => `<li>${_ktE(t)}</li>`).join("")}</ul>
      <div class="kt-cepat">${KT.penonton ? "" : _ktTanyaCepat(k).map(([lbl, q]) => `<button onclick="ktKirim(${_ktE(JSON.stringify(q))})">${_ktE(lbl)}</button>`).join("")}</div></div>`; }).join("")}`);
  const t = KT.tokoh[id]; if (t && !KT.penonton) _ktBicara(id, "Assalamu'alaikum, ada yang bisa ana bantu?", 2500);
}
function _ktTanyaCepat(k) {
  if (k === "sekretaris") return [["Cek Data Guru", "cek kelengkapan data guru"], ["Cek Data Siswa", "cek kelengkapan data siswa"]];
  if (k === "bendahara") return [["Laporan BOSP Lengkap", "laporan bosp lengkap semua jenjang"]];
  if (k === "dapodik") return [["Cek NISN & NIK", "cek nisn nik dapodik siswa"]];
  if (k === "it") return [["Lihat Tiket", "__tiket"]];
  if (k === "desain") return [["Minta Flyer", "buatkan flyer kegiatan"], ["Laporan Konten", "laporan konten media dan desain"]];
  if (k === "kepala") return [["📰 Kabar Baru", "__kabar"], ["Evaluasi KBM", "evaluasi kegiatan semua jenjang"], ["Laporan BOSP", "laporan bosp"]];
  if (/^peny-/.test(k)) { const r = k.slice(5); return [["Evaluasi KBM", `evaluasi kegiatan ${KT_JENJANG[r]}`], ["BOSP Jenjang", `laporan bosp ${KT_JENJANG[r]}`]]; }
  if (/^admin-/.test(k)) { const r = k.slice(6); return [["Evaluasi KBM", `evaluasi kegiatan ${KT_JENJANG[r]}`], ["Data Siswa", `cek data siswa`]]; }
  return [];
}

// ── Perintah Kepala PKBM: Kepala berjalan sendiri ke bagian terkait lalu memimpin rapat / memanggil ke ruangannya ──
const KT_RAPAT_KEPALA = [
  ["📰", "Kabar Baru Tiap Jenjang", "__kabar"], ["💰", "Rapat BOSP / RKAS", "laporan bosp semua jenjang", "bendahara"],
  ["📚", "Evaluasi KBM", "evaluasi kegiatan semua jenjang", "peny-Pa"], ["🧪", "Ujian & Bank Soal", "laporan ujian semua jenjang", "admin-Pa"],
  ["📘", "Modul Ajar & Kop Soal", "laporan modul ajar semua jenjang", "admin-A"], ["🗓️", "Jadwal & Kalender", "laporan jadwal dan kalender", "peny-A"],
  ["🧒", "Kehadiran Siswa", "laporan kehadiran siswa", "admin-Pi"], ["💼", "Kas, Insentif & Slip Gaji", "laporan kas insentif gaji", "bendahara"],
  ["🗂️", "Data Siswa & Guru", "cek data siswa dan guru", "sekretaris"], ["🎨", "Desain & Konten Media", "laporan konten media dan desain", "desain"], ["🏫", "Laporan Lengkap Semua Fitur", "laporan lengkap semua fitur", "sekretaris"],
];
function ktMenuKepala() {
  const kid = (KT.peran.kepala || [])[0], s = KT.staf.find((x) => x.id === kid) || {};
  const lain = KT.staf.filter((x) => x.id !== kid && !(KT.peran.yayasan || []).includes(x.id));
  KT.perintah = KT_RAPAT_KEPALA;
  _ktPanel(`<div class="kt-kartu-kepala">${_ktFoto(s, 46)}<div><b>${_ktE(_ktGelar(s))} ${_ktE(s.namaLengkap || s.nama || "")}</b><small>Kepala PKBM — pilih perintah</small></div></div>
    <h4>🪑 Pimpin Rapat</h4><p class="kt-ket">Kepala mendatangi bagian terkait, lalu semua petugas berkumpul di Ruang Rapat.</p>
    <div class="kt-perintah">${KT_RAPAT_KEPALA.map(([ik, l], i) => `<button onclick="ktPerintahNo(${i})"><span>${ik}</span>${_ktE(l)}</button>`).join("")}</div>
    <h4>🚪 Panggil Petugas</h4><p class="kt-ket">Ustadz dijemput ke Ruang Kepala. Ustadzah dipanggil dari depan pintu Ruang Ustadzah, lalu bertemu di Ruang Rapat (ruang terbuka).</p>
    <div class="kt-perintah">${lain.map((x) => `<button onclick="ktPanggil('${x.id}')">${_ktFoto(x, 30)}${_ktE(_ktGelar(x))} ${_ktE(x.nama.split(" ")[0])}<small>${_ktE(_ktPeranPendek(x.peran[0]))}</small></button>`).join("")}</div>
    <h4>🚶 Lainnya</h4><div class="kt-perintah"><button onclick="ktKeliling()"><span>🚶</span>Keliling Kantor</button><button onclick="ktTiketBuka()"><span>🎫</span>Tiket Tim IT</button></div>`);
}
function ktPerintahNo(i) { const p = KT_RAPAT_KEPALA[i]; if (p) ktPerintah(p[2], p[3] || ""); }
// titik berdiri di belakang kursi seseorang
const _ktDekatKursi = (k) => ({ x: k.x - Math.sin(k.hadap) * 0.85, z: k.z - Math.cos(k.hadap) * 0.85, hadap: k.hadap });
async function ktPerintah(teks, kodeUtama) {
  if (teks === "__kabar") return ktKabar();
  if (KT.sibuk) { toast("Kepala sedang sibuk, tunggu sebentar", "info"); return; }
  if (KT.sesi && KT.sesi.aktif) return ktKirim(teks);
  const sTuju = kodeUtama && (KT.staf.find((x) => x.id === (KT.peran[kodeUtama] || [])[0]) || {});
  if (sTuju && sTuju.jk === "P") { // ustadzah: cukup dipanggil dari depan pintu Ruang Ustadzah
    const kid0 = (KT.peran.kepala || [])[0], kp0 = kid0 && KT.tokoh[kid0];
    if (kp0) { KT.sibuk = true; try { await _ktPergi(kp0, { x: 4.2, z: 6.3, hadap: Math.PI / 2 }, { berdiri: true }); await _ktBicara(kid0, `Ustadzah ${sTuju.nama.split(" ")[0]} dan kawan-kawan, mari ke Ruang Rapat.`, 2400); } finally { KT.sibuk = false; } }
    return ktKirim(teks);
  }
  const kid = (KT.peran.kepala || [])[0], kp = kid && KT.tokoh[kid], tujuan = kodeUtama && (KT.peran[kodeUtama] || [])[0], tt = tujuan && KT.tokoh[tujuan];
  if (kp && tt && tujuan !== kid) {
    KT.sibuk = true;
    try {
      const s = KT.staf.find((x) => x.id === tujuan);
      await _ktBicara(kid, "Bismillah, ana ke bagian " + _ktPeranPendek(kodeUtama) + " dulu.", 1600);
      await _ktPergi(kp, _ktDekatKursi(tt.userData.meja), { berdiri: true });
      await _ktBicara(kid, `${_ktGelar(s)} ${s.nama.split(" ")[0]}, mari kita rapat sekarang. Tolong siapkan datanya.`, 2600);
      await _ktBicara(tujuan, "Na'am, siap. Ana kabari yang lain.", 2000);
    } finally { KT.sibuk = false; }
  }
  return ktKirim(teks);
}
// panggil petugas ke kursi tamu Ruang Kepala → melapor → kembali
async function ktPanggil(id) {
  if (KT.sibuk) { toast("Kepala sedang sibuk, tunggu sebentar", "info"); return; }
  const kid = (KT.peran.kepala || [])[0], kp = KT.tokoh[kid], t = KT.tokoh[id], s = KT.staf.find((x) => x.id === id);
  if (!kp || !t || !s) return;
  KT.sibuk = true;
  try {
    _ktPanel(`<div class="kt-obrolan"><div class="kt-info">🚪 ${_ktE(_ktGelar(s))} ${_ktE(s.nama)} dipanggil ke Ruang Kepala</div><div id="kt-jawaban"></div></div>`);
    await _ktPergi(kp, _ktDekatKursi(t.userData.meja), { berdiri: true });
    await _ktBicara(kid, `${_ktGelar(s)} ${s.nama.split(" ")[0]}, ke ruangan ana sebentar ya.`, 2200);
    await Promise.all([_ktPergi(kp, KT.kursiKepala), _ktTunggu(500).then(() => _ktPergi(t, KT.kursiTamu[0]))]);
    const k = s.peran[0], r = /^(peny|admin)-/.test(k) ? k.split("-")[1] : null;
    const topik = /^peny-/.test(k) ? "evaluasi" : k === "bendahara" ? "bosp" : /^admin-/.test(k) ? "lengkap" : k === "sekretaris" || k === "dapodik" ? "data" : null;
    await _ktTampilBaris({ kode: "kepala", html: "Silakan laporkan perkembangan bagian antum.", singkat: "Silakan laporkan perkembangan bagian antum." });
    const skrip = topik ? await _ktSkrip(topik, (r ? KT_JENJANG[r] : "") + " " + topik) : null;
    const baris = skrip ? skrip.baris.filter((b) => b.kode !== "kepala").slice(0, 4) : [];
    if (!baris.length) { const j = await _ktJawab(k, k === "it" ? "laporan tiket" : "laporan"); baris.push({ kode: k, html: _ktE(j.teks).replace(/\n/g, "<br>"), singkat: j.singkat || j.teks }); }
    for (const b of baris) await _ktTampilBaris({ ...b, kode: k });
    await _ktTampilBaris({ kode: "kepala", html: "Jazakallahu khairan, lanjutkan. Laporkan bila ada kendala.", singkat: "Jazakallahu khairan, lanjutkan." });
    await _ktPergi(t, t.userData.meja);
  } finally { KT.sibuk = false; }
}

// ── Mengarahkan pesan ke petugas ──
function _ktJenjangDari(t) { if (/paket\s*a\b/.test(t)) return "A"; if (/putri|ustadzah/.test(t)) return "Pi"; if (/putra/.test(t)) return "Pa"; return null; }
function _ktArahkan(teks) {
  const t = " " + teks.toLowerCase() + " ", jj = _ktJenjangDari(t), skor = {};
  KT_PERAN.forEach((p) => { if (p.ruang && jj && p.ruang !== jj) return; p.kata.forEach((k) => { if (t.includes(k)) skor[p.kode] = (skor[p.kode] || 0) + (k.includes(" ") ? 2 : 1); }); });
  // peran jenjang tanpa jenjang disebut → pakai ruang aktif (bukan Pengelola) atau Putra
  const rg = jj || (STATE.ruang && STATE.ruang !== "Pg" ? STATE.ruang : "Pa");
  Object.keys(skor).forEach((k) => { if (/^(peny|admin)-/.test(k) && !k.endsWith("-" + rg)) delete skor[k]; });
  let urut = Object.entries(skor).sort((a, b) => b[1] - a[1]).map(([k]) => k);
  if (!urut.length) urut = ["sekretaris"];
  urut = urut.slice(0, 3);
  if (/rapat|semua petugas|koordinasi/.test(t) && !urut.includes("kepala")) urut.unshift("kepala");
  return urut;
}
async function ktKirim(teksLangsung) {
  if (teksLangsung === "__tiket") return ktTiketBuka();
  if (teksLangsung === "__kabar") return ktKabar();
  const ta = document.getElementById("kt-teks"); const teks = String(teksLangsung || (ta && ta.value) || "").trim();
  if (!teks || KT.sibuk) return; if (ta && !teksLangsung) { ta.value = ""; ta.style.height = ""; }
  const topik = _ktTopik(teks); KT.topikIni = topik;
  if (topik === "kabar") return ktKabar(/7 hari|seminggu|pekan/.test(teks.toLowerCase()) ? 168 : null);
  KT.sibuk = true; const tb = document.getElementById("kt-tombol-kirim"); if (tb) tb.disabled = true;
  let ids = [];
  try {
    _ktPanel(`<div class="kt-obrolan"><div class="kt-saya"><small>Antum</small>${_ktE(teks)}</div><div id="kt-jawaban"></div><div id="kt-lanjut"></div></div>`);
    let skrip = null;
    if (topik) { document.getElementById("kt-jawaban").innerHTML = `<div class="kt-info">⏳ Petugas mengumpulkan data…</div>`; skrip = await _ktSkrip(topik, teks); document.getElementById("kt-jawaban").innerHTML = ""; }
    if (!skrip) { // per peran (kata kunci)
      let peran = _ktArahkan(teks);
      const rapat = peran.length > 1 || peran.includes("kepala") || /rapat/.test(teks.toLowerCase());
      if (rapat && (KT.peran.kepala || []).length && !peran.includes("kepala")) peran = ["kepala", ...peran];
      const baris = [];
      for (const k of peran) { let j; try { j = await _ktJawab(k, teks); } catch (e) { j = { teks: "Afwan, data belum bisa dibaca: " + (e.message || e) }; } baris.push({ kode: k, html: j.html || _ktE(j.teks).replace(/\n/g, "<br>"), singkat: j.singkat || j.teks }); }
      skrip = { baris, rapat, judul: "Rapat Koordinasi", tv: [], ticker: teks };
    }
    const kodes = [...new Set(skrip.baris.map((x) => x.kode))];
    const rapat = KT.sesi.aktif || (skrip.rapat !== false && (kodes.length > 1 || topik));
    if (rapat) { document.getElementById("kt-jawaban").insertAdjacentHTML("beforeend", `<div class="kt-info">🪑 ${_ktE(skrip.judul)} — Ruang Rapat</div>`); ids = await _ktRapat(kodes, skrip.judul, skrip.tv, skrip.ticker); }
    for (const b of skrip.baris) await _ktTampilBaris(b);
    const ln = document.getElementById("kt-lanjut");
    if (KT.sesi.aktif) _ktOpsiRapat();
    else if (ln && skrip.lanjut) ln.innerHTML = skrip.lanjut.map(([l, q]) => `<button onclick="ktKirim(${_ktE(JSON.stringify(q))})">${_ktE(l)}</button>`).join("");
    const idR = "r" + Date.now().toString(36);
    _ktSimpan(KT_RIWAYAT, { [idR]: { teks, topik: topik || null, peran: kodes, t: Date.now() } }).catch(() => {});
  } finally { void ids; KT.sibuk = false; if (tb) tb.disabled = false; }
}

// ── Jawaban tiap petugas (data dibaca saja, tidak mengubah apa pun) ──
async function _ktJawab(k, teks) {
  const t = teks.toLowerCase();
  if (k === "it") return _ktJawabIt(teks);
  if (k === "desain") return _ktJawabDesain(teks);
  if (k === "sekretaris") {
    const bag = [];
    if (!/siswa|santri|peserta/.test(t) || /guru|ptk|tutor/.test(t)) {
      const kurang = (KT.guru || []).map((g) => g).filter(Boolean);
      const { data } = await supaSemua.from("guru").select("nama,nip_nik,no_wa,foto_url,tanggal_lahir,alamat_domisili").eq("status_aktif", true);
      const bolong = (data || []).map((g) => ({ n: _ktNama(g.nama), k: [!String(g.nip_nik || "").replace(/\D/g, "").match(/^\d{16}$/) && "NIK", !g.no_wa && "WA", !g.foto_url && "foto", !g.tanggal_lahir && "tgl lahir", !g.alamat_domisili && "alamat"].filter(Boolean) })).filter((x) => x.k.length);
      void kurang;
      bag.push(`Data guru: ${(data || []).length} aktif, ${bolong.length} belum lengkap.` + (bolong.length ? "\n" + bolong.slice(0, 8).map((x) => `• ${x.n}: ${x.k.join(", ")}`).join("\n") + (bolong.length > 8 ? `\n• …dan ${bolong.length - 8} lainnya` : "") : ""));
    }
    if (/siswa|santri|peserta/.test(t) || !/guru|ptk|tutor/.test(t)) {
      const { data } = await supaSemua.from("siswa").select("nama,ruang_id,tanggal_lahir,nama_ibu,no_wa_ayah,no_wa_ibu,kelas_id").eq("status_aktif", true);
      const per = {}; (data || []).forEach((s) => { const r = s.ruang_id; per[r] = per[r] || { n: 0, tgl: 0, ibu: 0, wa: 0, kls: 0 }; per[r].n++; if (!s.tanggal_lahir) per[r].tgl++; if (!s.nama_ibu) per[r].ibu++; if (!s.no_wa_ayah && !s.no_wa_ibu) per[r].wa++; if (!s.kelas_id) per[r].kls++; });
      bag.push("Data siswa aktif:\n" + Object.entries(per).map(([r, x]) => `• ${KT_JENJANG[r] || r}: ${x.n} siswa — tanpa tgl lahir ${x.tgl}, tanpa nama ibu ${x.ibu}, tanpa no. WA wali ${x.wa}, tanpa kelas ${x.kls}`).join("\n"));
    }
    return { teks: "Baik, Ustadz. Ana sudah periksa:\n" + bag.join("\n\n"), singkat: "Sudah ana periksa, rinciannya ana tulis di panel ya, Ustadz." };
  }
  if (k === "dapodik") {
    const { data } = await supaSemua.from("siswa").select("ruang_id,nisn,nik,no_kk,nama_ibu").eq("status_aktif", true);
    const per = {}; (data || []).forEach((s) => { const r = s.ruang_id; per[r] = per[r] || { n: 0, nisn: 0, nik: 0, kk: 0, ibu: 0 }; per[r].n++; if (!/^\d{10}$/.test(String(s.nisn || "").trim())) per[r].nisn++; if (!/^\d{16}$/.test(String(s.nik || "").replace(/\D/g, ""))) per[r].nik++; if (!/^\d{16}$/.test(String(s.no_kk || "").replace(/\D/g, ""))) per[r].kk++; if (!s.nama_ibu) per[r].ibu++; });
    const teksJ = "Hasil pemeriksaan data untuk Dapodik:\n" + Object.entries(per).map(([r, x]) => `• ${KT_JENJANG[r] || r} (${x.n} siswa): NISN belum benar ${x.nisn}, NIK belum 16 angka ${x.nik}, No. KK belum 16 angka ${x.kk}, nama ibu kosong ${x.ibu}`).join("\n") + "\n\nPerbaikannya lewat Data Siswa di tiap jenjang, lalu cocokkan dengan menu Cocokkan Dapodik.";
    return { teks: teksJ, singkat: "Sudah ana cek NISN, NIK & KK — rinciannya di panel." };
  }
  if (k === "bendahara") {
    const th = typeof _bspTahunAwal === "function" ? _bspTahunAwal() : new Date().getFullYear();
    const baris = [];
    for (const r of ["A", "Pa", "Pi"]) {
      const { data } = await supaSemua.from("kuliah_pengaturan").select("nilai").eq("kunci", "bosp:kk:" + th).eq("ruang_id", r).maybeSingle();
      const kk = (data && data.nilai) || {}, isi = Object.values(kk.baris || {}).filter((b) => b && !b.hapus);
      const total = isi.reduce((a, b) => a + (typeof bspTotalBaris === "function" ? bspTotalBaris(b) : 0), 0), st = (kk._status && kk._status.status) || "draf";
      baris.push(`• ${KT_JENJANG[r]}: ${isi.length} uraian, Rp ${Math.round(total).toLocaleString("id-ID")} — status ${({ draf: "masih disusun", diajukan: "menunggu pengesahan", disahkan: "sudah disahkan", dikembalikan: "dikembalikan untuk diperbaiki" })[st] || st}`);
    }
    return { teks: `Kertas Kerja BOSP ${th}:\n${baris.join("\n")}\n\nRincian realisasi & bukti belanja bisa dipantau di ruang Pengelola → Pantau Realisasi Jenjang.`, singkat: "Ringkasan BOSP sudah ana siapkan di panel, Ustadz." };
  }
  if (/^peny-/.test(k)) {
    const r = k.slice(5), sejak = new Date(Date.now() - 14 * 864e5).toISOString().slice(0, 10);
    const { data } = await supaSemua.from("pengajuan_izin_sakit").select("tanggal,jenis,status_verifikasi,diproses_at,dihapus").eq("ruang_id", r).gte("tanggal", sejak);
    const aktif = (data || []).filter((x) => !x.dihapus), tunggu = aktif.filter((x) => !x.diproses_at);
    return { teks: `${KT_JENJANG[r]} — 14 hari terakhir: ${aktif.length} pengajuan izin/sakit tutor, ${tunggu.length} masih menunggu keputusan.${tunggu.length ? "\nAna proses lewat menu Perizinan di ruang " + KT_JENJANG[r] + "." : ""}\n\nCatatan Antum sudah ana terima dan akan ana koordinasikan dengan Admin jenjang.`, singkat: tunggu.length ? `${tunggu.length} izin masih menunggu, segera ana proses.` : "Insya Allah ana tindak lanjuti di jenjang." };
  }
  if (/^admin-/.test(k)) {
    const r = k.slice(6);
    const [s, kls] = await Promise.all([supaSemua.from("siswa").select("kelas_id").eq("ruang_id", r).eq("status_aktif", true), supaSemua.from("kelas").select("id").eq("ruang_id", r)]);
    const tanpa = (s.data || []).filter((x) => !x.kelas_id).length;
    return { teks: `${KT_JENJANG[r]}: ${(s.data || []).length} siswa aktif di ${(kls.data || []).length} kelas${tanpa ? `, ${tanpa} siswa belum punya kelas` : ""}.\nUntuk absensi, nilai & rapor, ana periksa di ruang jenjang dan laporkan bila ada kendala aplikasi ke Tim IT.`, singkat: "Data jenjang sudah ana rangkum, Ustadz." };
  }
  if (k === "kepala") {
    const buka = Object.values(KT.tiket || {}).filter((x) => x && x.status !== "selesai" && x.status !== "hapus").length;
    return { teks: `Jazakallahu khairan atas masukannya. Ana pimpin koordinasi: tiap petugas menyampaikan bagiannya. Saat ini ada ${buka} tiket aplikasi yang belum selesai di Tim IT.`, singkat: "Bismillah, kita koordinasikan bersama." };
  }
  return { teks: "Baik, ana catat." };
}
// Tim IT: catat tiket
async function _ktJawabIt(teks) {
  const t = teks.toLowerCase();
  const jenis = /fitur|tambah|tambahkan|usul|saran|bisa (dibuat|ditambah)/.test(t) ? "Fitur Baru" : /tampilan|warna|rapi|berantakan|tulisan|ikon|desain|layar/.test(t) ? "Tampilan" : "Bug";
  const prioritas = /tidak bisa|gak bisa|ga bisa|nggak bisa|error|eror|hilang|rusak|crash|macet|login|sandi/.test(t) ? "Tinggi" : jenis === "Fitur Baru" ? "Rendah" : "Sedang";
  const no = Object.keys(KT.tiket || {}).length + 1, id = "t" + Date.now().toString(36);
  const tk = { no, judul: teks.split(/[.!?\n]/)[0].slice(0, 90), isi: teks, jenis, prioritas, status: "baru", t: Date.now(), oleh: STATE.guruNama || "Admin", ruang: STATE.ruang };
  try { await _ktSimpan(KT_TIKET, { [id]: tk }); KT.tiket[id] = tk; _ktTiketBadge(); }
  catch (e) { return { teks: "Afwan, tiket belum tersimpan: " + (e.message || e) }; }
  return { teks: `Tiket #${no} dicatat — ${jenis}, prioritas ${prioritas}.\nAna laporkan di Ruang Rapat dan masuk daftar 🎫 Tiket. Antum bisa salin daftar tiket untuk dikerjakan Claude.`, singkat: `Tiket #${no} (${jenis}) sudah ana catat.` };
}

// ── Tiket ──
function _ktTiketBadge() { const n = Object.values(KT.tiket || {}).filter((x) => x && (x.status === "baru" || x.status === "dikerjakan")).length; const b = document.getElementById("kt-tiket-n"); if (b) b.textContent = n ? ` ${n}` : ""; }
async function ktTiketBuka() {
  try { KT.tiket = await _ktAmbil(KT_TIKET); } catch (e) {}
  const daftar = Object.entries(KT.tiket || {}).filter(([, x]) => x && x.status !== "hapus").sort((a, b) => b[1].t - a[1].t);
  const label = { baru: "🆕 Baru", dikerjakan: "🔧 Dikerjakan", selesai: "✅ Selesai" };
  _ktPanel(`<h3>🎫 Tiket Tim IT</h3><div class="kt-tugas" style="--w:#475569"><b>Cara memakai tiket</b><ol class="kt-ul"><li>Ketik keluhan di kotak bawah, mis. <i>"tombol simpan rapor putra tidak bisa diklik"</i> → Tim IT otomatis mencatatnya jadi tiket (jenis & prioritas ditebak).</li><li>Di sini, ubah status: 🆕 Baru → 🔧 Dikerjakan → ✅ Selesai.</li><li>Tekan <b>📋 Salin Tiket Belum Selesai</b>, lalu tempel ke Claude (Claude Code) untuk diperbaiki.</li><li>Setelah diperbaiki & dicoba, tandai ✅ Selesai.</li></ol></div>
    <button class="kt-salin" onclick="ktTiketSalin()">📋 Salin Tiket Belum Selesai</button>
    ${daftar.map(([id, x]) => `<div class="kt-tiket ${x.status}"><div><b>#${x.no} ${_ktE(x.judul)}</b><small>${_ktE(x.jenis)} · prioritas ${_ktE(x.prioritas)} · ${new Date(x.t).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}</small>${x.isi !== x.judul ? `<p>${_ktE(x.isi)}</p>` : ""}</div>
      <select onchange="ktTiketStatus('${id}',this.value)">${Object.entries(label).map(([k, l]) => `<option value="${k}" ${x.status === k ? "selected" : ""}>${l}</option>`).join("")}<option value="hapus">🗑️ Hapus</option></select></div>`).join("") || `<p class="kt-ket">Belum ada tiket.</p>`}`);
}
async function ktTiketStatus(id, status) {
  const x = KT.tiket[id]; if (!x) return;
  try { await _ktSimpan(KT_TIKET, { [id]: { ...x, status, diubah: Date.now() } }); x.status = status; _ktTiketBadge(); if (status === "hapus") ktTiketBuka(); toast("Tiket diperbarui", "ok"); }
  catch (e) { toast("Gagal: " + (e.message || e), "err"); }
}
function ktTiketSalin() {
  const d = Object.values(KT.tiket || {}).filter((x) => x && (x.status === "baru" || x.status === "dikerjakan")).sort((a, b) => a.no - b.no);
  if (!d.length) { toast("Tidak ada tiket yang belum selesai", "info"); return; }
  const teks = "Tiket aplikasi PKBM (dari Kantor PKBM):\n" + d.map((x) => `${x.no}. [${x.jenis} · ${x.prioritas}] ${x.isi}`).join("\n");
  navigator.clipboard.writeText(teks).then(() => toast(`${d.length} tiket disalin — tempel ke Claude`, "ok"), () => { _ktPanel(`<h3>Salin manual</h3><textarea class="kt-salin-isi" readonly>${_ktE(teks)}</textarea>`); });
}

// ── Pengaturan petugas ──
function ktAturBuka() {
  const guru = (KT.guru || []).slice().sort((a, b) => String(a.nama).localeCompare(String(b.nama)));
  const pil = (kode) => { const ids = KT.peran[kode] || []; return `<select data-kt-peran="${kode}"><option value="">— otomatis / kosong —</option>${guru.map((g) => `<option value="${g.id}" ${ids[0] === g.id ? "selected" : ""}>${_ktE(_ktNama(g.nama))}</option>`).join("")}</select>`; };
  _ktPanel(`<h3>⚙️ Atur Petugas Kantor</h3><p class="kt-ket">Petugas terisi otomatis dari jabatan di Data Guru. Pilih di sini untuk peran yang belum ada jabatannya (Sekretaris, Admin Dapodik, Tim IT) atau untuk mengganti.</p>
    <div class="kt-atur">${KT_PERAN.map((p) => `<label><span>${p.ikon} ${_ktE(p.nama)}</span>${pil(p.kode)}</label>`).join("")}</div>
    <h4>Ustadz / Ustadzah</h4><p class="kt-ket">Ustadzah duduk di Ruang Ustadzah (gamis hitam & bercadar).</p>
    <div class="kt-atur">${KT.staf.map((s) => `<label><span>${_ktE(s.nama)}</span><select data-kt-jk="${s.id}"><option value="L" ${s.jk !== "P" ? "selected" : ""}>Ustadz</option><option value="P" ${s.jk === "P" ? "selected" : ""}>Ustadzah</option></select></label>`).join("")}</div>
    <h4>👁️ Yang Boleh Menyaksikan Kantor</h4><p class="kt-ket">Hanya melihat (tidak bisa memerintah). Mereka ikut menyaksikan rapat & kegiatan kantor secara langsung.</p>
    <input class="kt-cari" placeholder="Cari nama…" oninput="document.querySelectorAll('[data-kt-nonton]').forEach((l)=>{l.hidden=!l.textContent.toLowerCase().includes(this.value.toLowerCase())})">
    <div class="kt-atur kt-nonton-daftar">${guru.map((g) => `<label data-kt-nonton><span>${_ktE(_ktNama(g.nama))}</span><input type="checkbox" value="${g.id}" ${(KT.atur.penonton || []).includes(g.id) ? "checked" : ""}></label>`).join("")}</div>
    <h4>📣 Masa Sosialisasi SOP</h4><div class="kt-atur"><label><span>Kepala hanya mencatat (belum menegur) & tanpa tanda peringatan</span><input type="checkbox" id="kt-sosialisasi" ${(KT.atur || {}).sosialisasi !== false ? "checked" : ""}></label></div>
    <h4>Kepala PKBM Berkeliling</h4><div class="kt-atur"><label><span>🚶 Setiap</span><select id="kt-keliling">${[[0, "Mati"], [15, "15 menit"], [30, "30 menit"], [60, "1 jam"]].map(([v, l]) => `<option value="${v}" ${Number(KT.atur.keliling ?? 30) === v ? "selected" : ""}>${l}</option>`).join("")}</select></label></div>
    <button class="kt-salin" onclick="ktAturSimpan()">💾 Simpan & Susun Ulang Kantor</button>`);
}
async function ktAturSimpan() {
  const peran = { ...(KT.atur.peran || {}) }, jk = { ...(KT.atur.jk || {}) };
  document.querySelectorAll("[data-kt-peran]").forEach((s) => { const k = s.dataset.ktPeran; if (s.value) peran[k] = [s.value]; else delete peran[k]; });
  document.querySelectorAll("[data-kt-jk]").forEach((s) => { jk[s.dataset.ktJk] = s.value; });
  try {
    const keliling = Number((document.getElementById("kt-keliling") || {}).value ?? 30);
    const penonton = [...document.querySelectorAll(".kt-nonton-daftar input:checked")].map((c) => c.value);
    const sosialisasi = !!(document.getElementById("kt-sosialisasi") || {}).checked;
    await _ktSimpan(KT_ATUR, { peran, jk, keliling, penonton, sosialisasi });
    toast("Petugas kantor disimpan", "ok");
    ktTutup(); setTimeout(ktBuka, 50);
  } catch (e) { toast("Gagal menyimpan: " + (e.message || e), "err"); }
}

// ── Menu: khusus Admin utama ──
(function () {
  if (typeof renderSidebar !== "function") return;
  const asli = renderSidebar;
  renderSidebar = function () {
    const h = asli.apply(this, arguments);
    try {
      const admin = typeof isAdmin === "function" && isAdmin() && !(typeof isAdminKedua === "function" && isAdminKedua());
      if (!admin) { if (KT_AKSES.ids === null) { _ktMuatAkses().then(() => { if ((KT_AKSES.ids || []).includes(STATE.guruId)) renderSidebar(); }); return h; } if (!(KT_AKSES.ids || []).includes(STATE.guruId)) return h; }
      const nav = qs("nav-list"); if (!nav || nav.querySelector("[data-kantor]")) return h;
      const el = document.createElement("div"); el.className = "nav-item"; el.dataset.kantor = "1";
      el.innerHTML = `<span class="nav-icon">🏢</span><span>Kantor PKBM</span>`; el.onclick = () => ktBuka();
      const pertama = nav.querySelector(".nav-item"); if (pertama) pertama.after(el); else nav.prepend(el);
    } catch (e) { console.warn("Menu Kantor:", e); }
    return h;
  };
})();

// ── izin menyaksikan (dibaca sekali) ──
const KT_AKSES = { ids: null };
async function _ktMuatAkses() {
  if (KT_AKSES.ids !== null || !STATE.guruId) return KT_AKSES.ids || [];
  try { const r = await supaSemua.from("kuliah_pengaturan").select("nilai").eq("kunci", KT_ATUR).eq("ruang_id", "*").maybeSingle(); KT_AKSES.ids = ((r.data && r.data.nilai) || {}).penonton || []; } catch (e) { KT_AKSES.ids = []; }
  return KT_AKSES.ids;
}
async function _ktBolehNonton() { KT_AKSES.ids = null; return (await _ktMuatAkses()).includes(STATE.guruId); }

// Tim Desain & Konten: permintaan desain dicatat sebagai tiket "Desain & Konten"
async function _ktJawabDesain(teks) {
  const t = teks.toLowerCase(), minta = /buat|minta|tolong|bikin|siapkan|flyer|flayer|poster|banner|pamflet|spanduk|brosur/.test(t) && !/^laporan/.test(t);
  const terbuka = Object.values(KT.tiket || {}).filter((x) => x && x.jenis === "Desain & Konten" && (x.status === "baru" || x.status === "dikerjakan")).length;
  if (!minta) return { teks: `Laporan media: website PKBM & Yayasan, Instagram & YouTube Rumah Tahfizh Al-Umm Putra Barabai ana kelola. Saat ini ada ${terbuka} permintaan desain/konten yang belum selesai. Untuk flyer baru, sampaikan judul kegiatan, tanggal, dan tempatnya.`, singkat: `${terbuka} permintaan desain sedang ana kerjakan.` };
  const no = Object.keys(KT.tiket || {}).length + 1, id = "t" + Date.now().toString(36);
  const tk = { no, judul: teks.split(/[.!?\n]/)[0].slice(0, 90), isi: teks, jenis: "Desain & Konten", prioritas: /segera|besok|hari ini|mendesak/.test(t) ? "Tinggi" : "Sedang", status: "baru", t: Date.now(), oleh: STATE.guruNama || "Admin", ruang: STATE.ruang };
  try { await _ktSimpan(KT_TIKET, { [id]: tk }); KT.tiket[id] = tk; _ktTiketBadge(); }
  catch (e) { return { teks: "Afwan, permintaan belum tersimpan: " + (e.message || e) }; }
  return { teks: `Permintaan desain #${no} ana catat (prioritas ${tk.prioritas}). Insya Allah ana siapkan rancangannya sesuai identitas visual PKBM, lalu ana kirim untuk diperiksa sebelum diunggah ke IG/YouTube/website.`, singkat: `Siap, desain #${no} ana kerjakan.` };
}

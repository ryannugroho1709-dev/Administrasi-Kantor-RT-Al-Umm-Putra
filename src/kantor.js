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
const KT_ATUR = "profil:kantor:atur", KT_TIKET = "profil:kantor:tiket", KT_RIWAYAT = "profil:kantor:riwayat";
const KT_JENJANG = { A: "Paket A", Pa: "Paket B & C Putra", Pi: "Paket B & C Putri" };
const _ktE = (s) => escapeHtml(s == null ? "" : String(s));
const _ktNama = (n) => String(n || "").split(",")[0].trim();

// ── Peran & jobdesk umum (bisa ditambah nanti) ──
const KT_PERAN = [
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
  { kode: "it", nama: "Tim IT", ikon: "🛠️", warna: "#475569",
    tugas: ["Menerima laporan bug, tampilan & permintaan fitur aplikasi", "Mencatat tiket & menentukan prioritas", "Memperbaiki & memperbarui aplikasi", "Mengelola akun, keamanan & cadangan data", "Melatih guru memakai fitur baru", "Melaporkan perkembangan aplikasi di Ruang Rapat"],
    kata: ["bug", "error", "eror", "galat", "tampilan", "layar", "tombol", "fitur", "aplikasi", "lambat", "loading", "macet", "crash", "tidak bisa", "gak bisa", "ga bisa", "nggak bisa", "hp", "android", "browser", "sandi", "password", "login", "sidik jari", "notifikasi", "tambah fitur", "tambahkan", "perbaiki", "berantakan", "rusak", "hilang"] },
];
const _ktPeran = (k) => KT_PERAN.find((p) => p.kode === k);
const _ktPeranPendek = (k) => ({ kepala: "Kepala PKBM", sekretaris: "Sekretaris", bendahara: "Bendahara", dapodik: "Dapodik", it: "Tim IT" })[k] || (/^peny-/.test(k) ? "Penyelenggara " + ({ A: "A", Pa: "Putra", Pi: "Putri" })[k.slice(5)] : "Admin " + ({ A: "A", Pa: "Putra", Pi: "Putri" })[k.slice(6)]);

// ── Data: petugas dari jabatan di aplikasi (+ pengaturan kantor) ──
async function _ktMuatStaf() {
  const [g, jm, gj, bend, peny, atur, tiket] = await Promise.all([
    supaSemua.from("guru").select("id,nama,foto_url,ruang,ruang_utama,ruang_pendamping,status_aktif").eq("status_aktif", true),
    supaSemua.from("jabatan_master").select("id,kode,nama"),
    supaSemua.from("guru_jabatan").select("guru_id,jabatan_id,is_utama,ruang_id"),
    supaSemua.from("kuliah_pengaturan").select("nilai").eq("kunci", "bosp:bendahara").eq("ruang_id", "*").maybeSingle(),
    supaSemua.from("kuliah_pengaturan").select("ruang_id,nilai").eq("kunci", "penyelenggara"),
    _kvAmbil(KT_ATUR, {}), _kvAmbil(KT_TIKET, {}),
  ]);
  const guru = g.data || [], jab = jm.data || [], pegang = gj.data || [];
  KT.guru = guru; KT.atur = { peran: {}, jk: {}, ...(atur || {}) }; KT.tiket = tiket || {};
  const ada = (id) => guru.some((x) => x.id === id);
  const olehJabatan = (rx, ruang) => [...new Set(pegang.filter((p) => { const j = jab.find((x) => x.id === p.jabatan_id); return j && rx.test(j.kode + " " + j.nama) && (!ruang || p.ruang_id === ruang); }).map((p) => p.guru_id))].filter(ada);
  const p = {};
  p.kepala = olehJabatan(/kepala_pkbm|kepala pkbm/i).slice(0, 1);
  p.bendahara = ((bend.data && bend.data.nilai && bend.data.nilai.ids) || []).filter(ada);
  if (!p.bendahara.length) p.bendahara = olehJabatan(/bendahara/i).slice(0, 1);
  p.sekretaris = olehJabatan(/sekretaris|^tu\b|tata usaha/i).slice(0, 1);
  p.dapodik = olehJabatan(/dapodik|operator/i).slice(0, 1);
  p.it = olehJabatan(/\bit\b|teknologi|programmer/i).slice(0, 1);
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
  KT.staf = Object.entries(orang).map(([id, peran]) => { const x = guru.find((y) => y.id === id) || {}; return { id, nama: _ktNama(x.nama), namaLengkap: x.nama, peran, jk: _ktJk(x) }; });
}
const _ktAdminUtama = (id) => { const x = (KT.guru || []).find((g) => g.id === id); return !!(x && (window.ADMIN_NAMES || ["Ryan Nugroho"]).some((n) => _ktNama(n).toLowerCase() === _ktNama(x.nama).toLowerCase())); };
function _ktJk(x) {
  const pilih = (KT.atur.jk || {})[x.id]; if (pilih === "L" || pilih === "P") return pilih;
  if (/^(ustadzah|ustzh|ibu|bu)\b/i.test(x.nama || "")) return "P";
  return x.ruang_utama === "Pi" || ((x.ruang || []).length === 1 && (x.ruang || [])[0] === "Pi") ? "P" : "L";
}

// ── Pintu masuk ──
async function ktBuka() {
  if (!(typeof isAdmin === "function" && isAdmin()) || (typeof isAdminKedua === "function" && isAdminKedua())) { toast("Kantor PKBM khusus Admin utama", "warn"); return; }
  if (KT.buka) return; KT.buka = true;
  const el = document.createElement("div"); el.id = "kantor-ai";
  el.innerHTML = `<div class="kt-atas"><div class="kt-judul"><b>🏢 Kantor PKBM Al-Umm</b><small>Ruang Ustadz · Ruang Rapat · Ruang Ustadzah</small></div>
      <div class="kt-alat"><button onclick="ktTiketBuka()" title="Tiket Tim IT">🎫 Tiket<span id="kt-tiket-n"></span></button><button onclick="ktAturBuka()" title="Atur petugas">⚙️</button><button onclick="ktTutup()" title="Tutup">✕</button></div></div>
    <div class="kt-layar" id="kt-layar"><div class="kt-memuat" id="kt-memuat"><i></i>Menyiapkan kantor…</div><div class="kt-hamparan" id="kt-hamparan"></div>
      <div class="kt-putar"><button onclick="ktPutar(-1)" title="Putar kiri">⟲</button><button onclick="ktZoom(1)" title="Perbesar">＋</button><button onclick="ktZoom(-1)" title="Perkecil">－</button><button onclick="ktPutar(1)" title="Putar kanan">⟳</button></div></div>
    <div class="kt-bawah"><div class="kt-chip" id="kt-chip"></div>
      <div class="kt-kirim"><textarea id="kt-teks" rows="1" placeholder="Sampaikan keluhan, masukan, atau pertanyaan… (mis. tombol simpan rapor tidak bisa diklik)"></textarea><button onclick="ktKirim()" id="kt-tombol-kirim">Kirim</button></div></div>
    <div class="kt-panel" id="kt-panel" hidden></div>`;
  document.body.appendChild(el);
  document.body.classList.add("kt-terbuka");
  const ta = el.querySelector("#kt-teks");
  ta.addEventListener("keydown", (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); ktKirim(); } });
  ta.addEventListener("input", () => { ta.style.height = "auto"; ta.style.height = Math.min(110, ta.scrollHeight) + "px"; });
  try {
    await Promise.all([_ktMuatThree(), _ktMuatStaf()]);
    if (!KT.buka) return;
    _ktBangun(); _ktChip(); _ktTiketBadge();
    document.getElementById("kt-memuat")?.remove();
    if (!KT.staf.length) _ktPanel(`<h3>Belum ada petugas</h3><p>Jabatan belum terbaca. Buka ⚙️ untuk memilih petugas tiap peran.</p>`);
  } catch (e) { const m = document.getElementById("kt-memuat"); if (m) m.innerHTML = "Gagal memuat kantor: " + _ktE(e.message || e); }
}
function ktTutup() {
  KT.buka = false; cancelAnimationFrame(KT.raf);
  try { KT.renderer && KT.renderer.dispose(); } catch (e) {}
  KT.renderer = null; KT.tokoh = {}; KT.label = {}; KT.gelembung = {};
  window.removeEventListener("resize", _ktUkur);
  document.getElementById("kantor-ai")?.remove(); document.body.classList.remove("kt-terbuka");
}
function _ktMuatThree() {
  if (window.THREE) return Promise.resolve();
  return new Promise((res, rej) => { const s = document.createElement("script"); s.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"; s.onload = res; s.onerror = () => rej(new Error("Pustaka 3D gagal dimuat — periksa internet")); document.head.appendChild(s); });
}

// ── 3D ──
const KT_KULIT = 0xe9c6a0;
function _ktKotak(w, h, d, warna, x = 0, y = 0, z = 0, opsi = {}) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshLambertMaterial({ color: warna, ...opsi }));
  m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; return m;
}
function _ktTeksKanvas(teks, { lebar = 512, tinggi = 128, latar = "#14532d", warna = "#fef3c7", ukuran = 54, sub = "" } = {}) {
  const c = document.createElement("canvas"); c.width = lebar; c.height = tinggi; const x = c.getContext("2d");
  x.fillStyle = latar; x.fillRect(0, 0, lebar, tinggi); x.strokeStyle = "rgba(254,243,199,.55)"; x.lineWidth = 6; x.strokeRect(8, 8, lebar - 16, tinggi - 16);
  x.fillStyle = warna; x.textAlign = "center"; x.textBaseline = "middle"; x.font = `800 ${ukuran}px Plus Jakarta Sans, system-ui, sans-serif`;
  x.fillText(teks, lebar / 2, sub ? tinggi * 0.4 : tinggi / 2);
  if (sub) { x.font = `600 ${Math.round(ukuran * 0.45)}px system-ui, sans-serif`; x.globalAlpha = 0.85; x.fillText(sub, lebar / 2, tinggi * 0.74); }
  const t = new THREE.CanvasTexture(c); t.anisotropy = 4; return t;
}
function _ktTokohBaru(jk) {
  const g = new THREE.Group(), badan = new THREE.Group(); g.add(badan);
  const kaki = [];
  if (jk === "P") {
    const gamis = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.36, 1.05, 10), new THREE.MeshLambertMaterial({ color: 0x15151a }));
    gamis.position.y = 0.53; gamis.castShadow = true; badan.add(gamis);
    const jilbab = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.34, 0.42, 10), new THREE.MeshLambertMaterial({ color: 0x0d0d10 }));
    jilbab.position.y = 1.02; jilbab.castShadow = true; badan.add(jilbab);
    const kepala = _ktKotak(0.34, 0.36, 0.34, 0x0d0d10, 0, 1.32, 0); badan.add(kepala); // cadar — tanpa wajah
    [-0.24, 0.24].forEach((x) => { const t = _ktKotak(0.12, 0.5, 0.14, 0x15151a, x, 0.82, 0.02); t.rotation.z = x < 0 ? 0.12 : -0.12; badan.add(t); });
  } else {
    [-0.1, 0.1].forEach((x) => { const k = new THREE.Group(); k.position.set(x, 0.5, 0); const b = _ktKotak(0.16, 0.5, 0.18, 0x334155, 0, -0.25, 0); k.add(b); badan.add(k); kaki.push(k); });
    badan.add(_ktKotak(0.5, 0.58, 0.3, 0xf8fafc, 0, 0.8, 0));
    [-0.31, 0.31].forEach((x) => badan.add(_ktKotak(0.12, 0.5, 0.16, 0xf1f5f9, x, 0.82, 0)));
    badan.add(_ktKotak(0.34, 0.36, 0.34, KT_KULIT, 0, 1.28, 0)); // kepala tanpa wajah
    badan.add(_ktKotak(0.36, 0.12, 0.36, 0x111827, 0, 1.5, 0)); // peci
  }
  g.userData = { kaki, badan, jk };
  return g;
}
function _ktBangun() {
  const layar = document.getElementById("kt-layar");
  const sc = (KT.scene = new THREE.Scene()); sc.background = new THREE.Color(0xdbe7f3);
  const r = (KT.renderer = new THREE.WebGLRenderer({ antialias: true })); r.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFSoftShadowMap; layar.prepend(r.domElement);
  KT.kamera = new THREE.OrthographicCamera(-10, 10, 10, -10, 0.1, 200);
  sc.add(new THREE.HemisphereLight(0xffffff, 0x8a9bb0, 0.62));
  const mt = new THREE.DirectionalLight(0xfff4e0, 0.6); mt.position.set(8, 16, 10); mt.castShadow = true; mt.shadow.mapSize.set(1024, 1024);
  Object.assign(mt.shadow.camera, { left: -16, right: 16, top: 12, bottom: -12 }); sc.add(mt);
  // lantai tiga ruangan
  const L = 9, W = 7, XR = W / 2 + L / 2; // pusat ruang samping = ±8
  sc.add(_ktKotak(L, 0.2, 12, 0xc99a63, -XR, -0.1, 0));   // Ruang Ustadz — kayu
  sc.add(_ktKotak(W, 0.2, 12, 0x1f6f4a, 0, -0.1, 0));          // Ruang Rapat — karpet hijau
  sc.add(_ktKotak(L, 0.2, 12, 0xdcb7c4, XR, -0.1, 0));    // Ruang Ustadzah
  const karpet = _ktKotak(W - 1.2, 0.02, 10.8, 0x2f855a, 0, 0.01, 0); sc.add(karpet);
  // dinding belakang & samping
  const tembok = 0xe6dccb;
  sc.add(_ktKotak(2 * L + W + 0.5, 3, 0.25, tembok, 0, 1.5, -6.1));
  sc.add(_ktKotak(0.25, 3, 12.2, tembok, -XR - L / 2 - 0.12, 1.5, 0)); // kiri
  sc.add(_ktKotak(0.25, 3, 12.2, tembok, XR + L / 2 + 0.12, 1.5, 0));  // kanan
  // sekat dengan pintu
  [-W / 2, W / 2].forEach((x) => { [-3.9, 3.9].forEach((z) => { sc.add(_ktKotak(0.18, 1.1, 4.2, 0xcdbfa8, x, 0.55, z)); sc.add(_ktKotak(0.24, 0.08, 4.2, 0x8b6b43, x, 1.12, z)); }); }); // sekat rendah supaya isi ruangan terlihat
  // papan nama
  const papan = (teks, sub, x, lebar, latar) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(lebar, lebar / 4), new THREE.MeshBasicMaterial({ map: _ktTeksKanvas(teks, { latar, sub }) })); m.position.set(x, 2.15, -5.96); sc.add(m); };
  papan("Ruang Ustadz", "Petugas Ikhwan", -XR, 4.2, "#1e3a8a");
  papan("Ruang Rapat", "PKBM Al-Umm Barabai", 0, 5, "#14532d");
  papan("Ruang Ustadzah", "Petugas Akhawat", XR, 4.2, "#831843");
  // meja rapat
  sc.add(_ktKotak(1.8, 0.12, 6.2, 0x7c4a21, 0, 0.78, 0.4)); [[-0.7, -2.4], [0.7, -2.4], [-0.7, 3.2], [0.7, 3.2]].forEach(([x, z]) => sc.add(_ktKotak(0.12, 0.76, 0.12, 0x5b3412, x, 0.38, z)));
  KT.kursiRapat = [];
  for (let i = 0; i < 5; i++) [-1.45, 1.45].forEach((x) => { const z = -2.1 + i * 1.25; sc.add(_ktKotak(0.55, 0.45, 0.55, 0x9a3412, x, 0.23, z)); KT.kursiRapat.push({ x: x * 0.98, z, hadap: x < 0 ? Math.PI / 2 : -Math.PI / 2 }); });
  KT.kursiRapat.unshift({ x: 0, z: -3.35, hadap: 0 }); // kursi pimpinan
  sc.add(_ktKotak(0.6, 0.45, 0.6, 0x7c2d12, 0, 0.23, -3.3));
  // tanaman & rak
  [[-XR - 3.9, -5.3], [XR + 3.9, -5.3], [-W / 2 + 0.5, 5.4], [W / 2 - 0.5, 5.4]].forEach(([x, z]) => { sc.add(_ktKotak(0.45, 0.45, 0.45, 0xa16207, x, 0.23, z)); const d = new THREE.Mesh(new THREE.SphereGeometry(0.42, 10, 8), new THREE.MeshLambertMaterial({ color: 0x16a34a })); d.position.set(x, 0.8, z); d.castShadow = true; sc.add(d); });
  [-XR - 2.2, XR + 2.2].forEach((x) => { sc.add(_ktKotak(2.4, 1.8, 0.45, 0x8b5a2b, x, 0.9, -5.7)); for (let i = 0; i < 3; i++) sc.add(_ktKotak(2.2, 0.06, 0.4, 0x6b4423, x, 0.4 + i * 0.5, -5.65)); });
  // meja kerja tiap petugas
  const lakiLaki = KT.staf.filter((s) => s.jk !== "P"), perempuan = KT.staf.filter((s) => s.jk === "P");
  const susun = (daftar, xPusat) => daftar.forEach((s, i) => {
    const kol = i % 3, bar = Math.floor(i / 3), x = xPusat + (kol - 1) * 2.9, z = [-4, -1.6, 1.9, 4.3][bar] ?? (4.3 + (bar - 3) * 2.2); // lorong z≈0 dibiarkan kosong untuk berjalan
    sc.add(_ktKotak(1.7, 0.1, 0.9, 0xc08a4f, x, 0.76, z)); sc.add(_ktKotak(1.6, 0.7, 0.08, 0xa47148, x, 0.38, z - 0.38));
    sc.add(_ktKotak(0.55, 0.06, 0.38, 0x1f2937, x - 0.25, 0.83, z - 0.1)); sc.add(_ktKotak(0.5, 0.36, 0.04, 0x0f172a, x - 0.25, 1.05, z - 0.26)); // laptop
    sc.add(_ktKotak(0.3, 0.04, 0.22, 0xfefce8, x + 0.4, 0.83, z)); // kertas
    sc.add(_ktKotak(0.55, 0.45, 0.55, 0x334155, x, 0.23, z + 0.75));
    const t = _ktTokohBaru(s.jk); t.scale.setScalar(1.3); t.position.set(x, 0, z + 0.72); t.rotation.y = Math.PI; sc.add(t);
    t.userData.meja = { x, z: z + 0.72, hadap: Math.PI }; t.userData.staf = s; _ktDuduk(t, true);
    KT.tokoh[s.id] = t;
  });
  susun(lakiLaki, -XR); susun(perempuan, XR);
  // label nama
  const ham = document.getElementById("kt-hamparan"); ham.innerHTML = "";
  KT.staf.forEach((s) => {
    const p = _ktPeran(s.peran[0]);
    const d = document.createElement("button"); d.className = "kt-label"; d.style.setProperty("--w", p.warna);
    d.innerHTML = `<b>${_ktE(_ktPeranPendek(s.peran[0]))}${s.peran.length > 1 ? ` <i>+${s.peran.length - 1}</i>` : ""}</b>`; d.title = (s.namaLengkap || s.nama) + " — " + s.peran.map((k) => _ktPeran(k).nama).join(", ");
    d.onclick = () => ktKartu(s.id); ham.appendChild(d); KT.label[s.id] = d;
    const b = document.createElement("div"); b.className = "kt-gelembung"; b.hidden = true; ham.appendChild(b); KT.gelembung[s.id] = b;
  });
  // kendali: geser untuk memutar, cubit/roda untuk zoom, ketuk tokoh
  const kan = r.domElement; let tarik = null;
  kan.addEventListener("pointerdown", (e) => { tarik = { x: e.clientX, s: KT.sudut, gerak: 0 }; kan.setPointerCapture(e.pointerId); });
  kan.addEventListener("pointermove", (e) => { if (!tarik) return; const dx = e.clientX - tarik.x; tarik.gerak = Math.max(tarik.gerak, Math.abs(dx)); KT.sudut = tarik.s - dx * 0.008; });
  kan.addEventListener("pointerup", (e) => { if (tarik && tarik.gerak < 6) _ktKetuk(e); tarik = null; });
  kan.addEventListener("wheel", (e) => { e.preventDefault(); ktZoom(e.deltaY < 0 ? 1 : -1, 0.08); }, { passive: false });
  window.addEventListener("resize", _ktUkur); _ktUkur();
  KT.jam = performance.now(); _ktJalan();
}
function _ktDuduk(t, duduk) {
  const u = t.userData; u.duduk = duduk;
  if (u.jk === "P") u.badan.position.y = duduk ? -0.3 : 0;
  else { u.badan.position.y = duduk ? -0.28 : 0; u.kaki.forEach((k) => (k.rotation.x = duduk ? -Math.PI / 2 : 0)); }
}
function _ktUkur() {
  const layar = document.getElementById("kt-layar"); if (!layar || !KT.renderer) return;
  const w = layar.clientWidth, h = layar.clientHeight, a = w / h, s = (a < 1 ? 12.2 / a : 10.5) / KT.zoom;
  Object.assign(KT.kamera, { left: -s * a, right: s * a, top: s, bottom: -s }); KT.kamera.updateProjectionMatrix();
  KT.renderer.setSize(w, h);
}
function ktPutar(arah) { KT.sudut += arah * Math.PI / 8; }
function ktZoom(arah, langkah = 0.15) { KT.zoom = Math.min(2.6, Math.max(0.6, KT.zoom * (1 + arah * langkah))); _ktUkur(); }
function _ktKetuk(e) {
  const kan = KT.renderer.domElement, kot = kan.getBoundingClientRect();
  const m = new THREE.Vector2(((e.clientX - kot.left) / kot.width) * 2 - 1, -((e.clientY - kot.top) / kot.height) * 2 + 1);
  const ray = new THREE.Raycaster(); ray.setFromCamera(m, KT.kamera);
  const kena = ray.intersectObjects(Object.values(KT.tokoh), true)[0];
  if (!kena) return; let o = kena.object; while (o && !o.userData.staf) o = o.parent; if (o) ktKartu(o.userData.staf.id);
}
function _ktJalan() {
  if (!KT.buka || !KT.renderer) return;
  KT.raf = requestAnimationFrame(_ktJalan);
  const kini = performance.now(), dt = Math.min(0.05, (kini - KT.jam) / 1000); KT.jam = kini;
  const k = KT.kamera, jarak = 30; k.position.set(Math.sin(KT.sudut) * jarak, 19, Math.cos(KT.sudut) * jarak); k.lookAt(0, 0.5, 0);
  // gerak tokoh
  Object.values(KT.tokoh).forEach((t) => {
    const u = t.userData;
    if (u.tuju) {
      const dx = u.tuju.x - t.position.x, dz = u.tuju.z - t.position.z, d = Math.hypot(dx, dz), v = 3.2 * dt;
      if (d <= v) { t.position.x = u.tuju.x; t.position.z = u.tuju.z; t.rotation.y = u.tuju.hadap; const s = u.tuju.selesai; u.tuju = null; u.jalan = 0; _ktDuduk(t, true); if (s) s(); }
      else { t.position.x += (dx / d) * v; t.position.z += (dz / d) * v; t.rotation.y = Math.atan2(dx, dz); u.jalan = (u.jalan || 0) + dt * 10; }
      const ay = Math.sin(u.jalan || 0); u.kaki.forEach((kk, i) => (kk.rotation.x = (i ? -1 : 1) * ay * 0.5)); u.badan.position.y = Math.abs(ay) * 0.04;
    } else if (u.bicara) { u.badan.position.y = (u.duduk ? (u.jk === "P" ? -0.3 : -0.28) : 0) + Math.abs(Math.sin(kini / 140)) * 0.03; }
  });
  KT.renderer.render(KT.scene, k);
  // posisi label & gelembung
  const w = KT.renderer.domElement.clientWidth, h = KT.renderer.domElement.clientHeight, v = new THREE.Vector3();
  Object.entries(KT.tokoh).forEach(([id, t]) => {
    v.set(t.position.x, 1.95, t.position.z).project(k);
    const x = (v.x * 0.5 + 0.5) * w, y = (-v.y * 0.5 + 0.5) * h, lb = KT.label[id], gb = KT.gelembung[id];
    if (lb) lb.style.transform = `translate(${x}px,${y}px) translate(-50%,-100%)`;
    if (gb && !gb.hidden) gb.style.transform = `translate(${x}px,${y - 46}px) translate(-50%,-100%)`;
  });
}
// berjalan lewat pintu (z = 0 di sekat) supaya tidak menembus dinding
function _ktJalanKe(t, tujuan) {
  return new Promise((res) => {
    const u = t.userData; _ktDuduk(t, false);
    const titik = [];
    const sisiAwal = Math.sign(t.position.x) * (Math.abs(t.position.x) > 3.6 ? 1 : 0), sisiAkhir = Math.sign(tujuan.x) * (Math.abs(tujuan.x) > 3.6 ? 1 : 0);
    if (sisiAwal !== sisiAkhir) { titik.push({ x: t.position.x, z: 0 }); if (sisiAwal) titik.push({ x: sisiAwal * 3.5, z: 0 }); if (sisiAkhir) titik.push({ x: sisiAkhir * 3.5, z: 0 }); titik.push({ x: tujuan.x, z: 0 }); }
    titik.push(tujuan);
    const lanjut = () => { const p = titik.shift(); if (!p) return res(); u.tuju = { x: p.x, z: p.z, hadap: p.hadap ?? tujuan.hadap ?? 0, selesai: titik.length ? () => { _ktDuduk(t, false); lanjut(); } : res }; };
    lanjut();
  });
}
const _ktTunggu = (ms) => new Promise((r) => setTimeout(r, ms));
function _ktBicara(id, teks, ms = 4200) {
  const gb = KT.gelembung[id], t = KT.tokoh[id]; if (!gb || !t) return _ktTunggu(0);
  gb.hidden = false; gb.textContent = teks.length > 150 ? teks.slice(0, 147) + "…" : teks; t.userData.bicara = true;
  return _ktTunggu(ms).then(() => { gb.hidden = true; t.userData.bicara = false; });
}

// ── Kartu petugas & chip peran ──
function _ktChip() {
  const w = document.getElementById("kt-chip"); if (!w) return;
  w.innerHTML = KT_PERAN.map((p) => { const ids = KT.peran[p.kode] || []; return `<button style="--w:${p.warna}" class="${ids.length ? "" : "kosong"}" onclick="${ids.length ? `ktKartu('${ids[0]}','${p.kode}')` : `ktAturBuka()`}">${p.ikon} ${_ktE(p.nama)}</button>`; }).join("");
}
function _ktPanel(html) { const p = document.getElementById("kt-panel"); if (!p) return; p.hidden = false; p.innerHTML = `<button class="kt-panel-x" onclick="this.parentElement.hidden=true">✕</button>${html}`; p.scrollTop = 0; }
function ktKartu(id, kode) {
  const s = KT.staf.find((x) => x.id === id); if (!s) return;
  const daftar = kode ? [kode] : s.peran;
  _ktPanel(`<div class="kt-kartu-kepala"><span class="kt-avatar ${s.jk === "P" ? "p" : ""}"></span><div><b>${_ktE(s.namaLengkap || s.nama)}</b><small>${s.jk === "P" ? "Ustadzah" : "Ustadz"} · ${s.peran.map((k) => _ktE(_ktPeran(k).nama)).join(" · ")}</small></div></div>
    ${daftar.map((k) => { const p = _ktPeran(k); return `<div class="kt-tugas" style="--w:${p.warna}"><b>${p.ikon} ${_ktE(p.nama)} — Tugas</b><ul>${p.tugas.map((t) => `<li>${_ktE(t)}</li>`).join("")}</ul>
      <div class="kt-cepat">${_ktTanyaCepat(k).map(([lbl, q]) => `<button onclick="ktKirim(${_ktE(JSON.stringify(q))})">${_ktE(lbl)}</button>`).join("")}</div></div>`; }).join("")}`);
  const t = KT.tokoh[id]; if (t) _ktBicara(id, "Assalamu'alaikum, ada yang bisa ana bantu?", 2500);
}
function _ktTanyaCepat(k) {
  if (k === "sekretaris") return [["Cek Data Guru", "cek kelengkapan data guru"], ["Cek Data Siswa", "cek kelengkapan data siswa"]];
  if (k === "bendahara") return [["Ringkasan BOSP", "ringkasan keuangan bosp tahun ini"]];
  if (k === "dapodik") return [["Cek NISN & NIK", "cek nisn nik dapodik siswa"]];
  if (k === "it") return [["Lihat Tiket", "__tiket"]];
  if (k === "kepala") return [["Rapat Koordinasi", "rapat koordinasi semua petugas"]];
  if (/^peny-/.test(k)) { const r = k.slice(5); return [["Izin Menunggu", `izin tutor ${KT_JENJANG[r]} yang menunggu`]]; }
  if (/^admin-/.test(k)) { const r = k.slice(6); return [["Ringkasan Jenjang", `data kelas siswa ${KT_JENJANG[r]}`]]; }
  return [];
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
  const ta = document.getElementById("kt-teks"); const teks = String(teksLangsung || (ta && ta.value) || "").trim();
  if (!teks || KT.sibuk) return; if (ta && !teksLangsung) { ta.value = ""; ta.style.height = ""; }
  KT.sibuk = true; const tb = document.getElementById("kt-tombol-kirim"); if (tb) tb.disabled = true;
  try {
    let peran = _ktArahkan(teks);
    const rapat = peran.length > 1 || peran.includes("kepala") || /rapat/.test(teks.toLowerCase());
    if (rapat && (KT.peran.kepala || []).length && !peran.includes("kepala")) peran = ["kepala", ...peran];
    const orang = [...new Set(peran.map((k) => (KT.peran[k] || [])[0]).filter(Boolean))];
    _ktPanel(`<div class="kt-obrolan"><div class="kt-saya"><small>Antum</small>${_ktE(teks)}</div><div id="kt-jawaban"></div></div>`);
    const jawabWrap = document.getElementById("kt-jawaban");
    if (rapat && orang.length) {
      await Promise.all(orang.map((id, i) => _ktJalanKe(KT.tokoh[id], KT.kursiRapat[i] || KT.kursiRapat[0])));
      jawabWrap.insertAdjacentHTML("beforeend", `<div class="kt-info">🪑 Rapat di Ruang Rapat — ${orang.length} petugas</div>`);
    }
    const hasil = [];
    for (const k of peran) {
      const id = (KT.peran[k] || [])[0], p = _ktPeran(k), s = id && KT.staf.find((x) => x.id === id);
      let j; try { j = await _ktJawab(k, teks); } catch (e) { j = { teks: "Afwan, data belum bisa dibaca: " + (e.message || e) }; }
      hasil.push({ kode: k, teks: j.teks });
      jawabWrap.insertAdjacentHTML("beforeend", `<div class="kt-jawab" style="--w:${p.warna}"><small>${p.ikon} ${s ? _ktE(s.nama) + " · " : ""}${_ktE(p.nama)}${s ? "" : " (petugas belum ditetapkan — atur di ⚙️)"}</small><div>${j.html || _ktE(j.teks).replace(/\n/g, "<br>")}</div></div>`);
      if (id) await _ktBicara(id, j.singkat || j.teks, 3800);
    }
    const idR = "r" + Date.now().toString(36);
    _kvGabung(KT_RIWAYAT, { [idR]: { teks, peran, jawab: hasil.map((x) => ({ kode: x.kode, teks: String(x.teks).slice(0, 600) })), t: Date.now() } }).catch(() => {});
    if (rapat) { await _ktTunggu(2500); orang.forEach((id) => { const t = KT.tokoh[id]; if (t) _ktJalanKe(t, t.userData.meja); }); }
  } finally { KT.sibuk = false; if (tb) tb.disabled = false; }
}

// ── Jawaban tiap petugas (data dibaca saja, tidak mengubah apa pun) ──
async function _ktJawab(k, teks) {
  const t = teks.toLowerCase();
  if (k === "it") return _ktJawabIt(teks);
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
  try { await _kvGabung(KT_TIKET, { [id]: tk }); KT.tiket[id] = tk; _ktTiketBadge(); }
  catch (e) { return { teks: "Afwan, tiket belum tersimpan: " + (e.message || e) }; }
  return { teks: `Tiket #${no} dicatat — ${jenis}, prioritas ${prioritas}.\nAna laporkan di Ruang Rapat dan masuk daftar 🎫 Tiket. Antum bisa salin daftar tiket untuk dikerjakan Claude.`, singkat: `Tiket #${no} (${jenis}) sudah ana catat.` };
}

// ── Tiket ──
function _ktTiketBadge() { const n = Object.values(KT.tiket || {}).filter((x) => x && (x.status === "baru" || x.status === "dikerjakan")).length; const b = document.getElementById("kt-tiket-n"); if (b) b.textContent = n ? ` ${n}` : ""; }
async function ktTiketBuka() {
  try { KT.tiket = await _kvAmbil(KT_TIKET, {}); } catch (e) {}
  const daftar = Object.entries(KT.tiket || {}).filter(([, x]) => x && x.status !== "hapus").sort((a, b) => b[1].t - a[1].t);
  const label = { baru: "🆕 Baru", dikerjakan: "🔧 Dikerjakan", selesai: "✅ Selesai" };
  _ktPanel(`<h3>🎫 Tiket Tim IT</h3><p class="kt-ket">Laporan bug, tampilan & fitur dari Kantor. Salin tiket yang belum selesai lalu tempel ke Claude untuk dikerjakan.</p>
    <button class="kt-salin" onclick="ktTiketSalin()">📋 Salin Tiket Belum Selesai</button>
    ${daftar.map(([id, x]) => `<div class="kt-tiket ${x.status}"><div><b>#${x.no} ${_ktE(x.judul)}</b><small>${_ktE(x.jenis)} · prioritas ${_ktE(x.prioritas)} · ${new Date(x.t).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}</small>${x.isi !== x.judul ? `<p>${_ktE(x.isi)}</p>` : ""}</div>
      <select onchange="ktTiketStatus('${id}',this.value)">${Object.entries(label).map(([k, l]) => `<option value="${k}" ${x.status === k ? "selected" : ""}>${l}</option>`).join("")}<option value="hapus">🗑️ Hapus</option></select></div>`).join("") || `<p class="kt-ket">Belum ada tiket.</p>`}`);
}
async function ktTiketStatus(id, status) {
  const x = KT.tiket[id]; if (!x) return;
  try { await _kvGabung(KT_TIKET, { [id]: { ...x, status, diubah: Date.now() } }); x.status = status; _ktTiketBadge(); if (status === "hapus") ktTiketBuka(); toast("Tiket diperbarui", "ok"); }
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
    <button class="kt-salin" onclick="ktAturSimpan()">💾 Simpan & Susun Ulang Kantor</button>`);
}
async function ktAturSimpan() {
  const peran = { ...(KT.atur.peran || {}) }, jk = { ...(KT.atur.jk || {}) };
  document.querySelectorAll("[data-kt-peran]").forEach((s) => { const k = s.dataset.ktPeran; if (s.value) peran[k] = [s.value]; else delete peran[k]; });
  document.querySelectorAll("[data-kt-jk]").forEach((s) => { jk[s.dataset.ktJk] = s.value; });
  try {
    await _kvGabung(KT_ATUR, { peran, jk });
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
      if (!(typeof isAdmin === "function" && isAdmin()) || (typeof isAdminKedua === "function" && isAdminKedua())) return h;
      const nav = qs("nav-list"); if (!nav || nav.querySelector("[data-kantor]")) return h;
      const el = document.createElement("div"); el.className = "nav-item"; el.dataset.kantor = "1";
      el.innerHTML = `<span class="nav-icon">🏢</span><span>Kantor PKBM</span>`; el.onclick = () => ktBuka();
      const pertama = nav.querySelector(".nav-item"); if (pertama) pertama.after(el); else nav.prepend(el);
    } catch (e) { console.warn("Menu Kantor:", e); }
    return h;
  };
})();

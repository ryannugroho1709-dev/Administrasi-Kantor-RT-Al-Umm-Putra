// ============================================================
//  KOSP — Kurikulum Operasional Satuan Pendidikan PKBM Al Umm Barabai
//  Dasar kurikulum semua jenjang (Paket A, B & C Putra, B & C Putri) → dibaca semua guru seperti buku:
//  sampul, daftar isi, pencarian kata, cetak/PDF, unduh Word per bab atau seluruhnya.
//  • Isi bawaan per tahun pelajaran: src/kosp-data/<2026-2027>.js (dimuat hanya saat KOSP dibuka).
//  • Unggahan per bab (.docx → diubah jadi halaman) disimpan di kuliah_pengaturan ruang "*":
//      bosp:kosp:info              → { "2027/2028": { dibuat, oleh } }   (tahun pelajaran tambahan)
//      bosp:kosp:<2026-2027>:b<n>  → { judul, html, berkas, diubah, oleh, riwayat }
//    Berkas aslinya diarsipkan ke Google Drive (Arsip PKBM › 12 KOSP › <tahun>) bila Arsip tersambung.
//  • Tahun pelajaran baru memakai isi tahun sebelumnya sampai bab-nya diunggah ulang.
//  • Yang boleh mengubah: Pengesah (Kepala PKBM) & Admin utama → langsung terbit; PJ bab → usulan yang disahkan Kepala.
//      bosp:kosp:pj → { pengesah, bab: { n: [guruId] } }   (lihat bagian TATA KELOLA di akhir berkas)
// ============================================================
const KOSP = { siap: false, info: {}, kv: {}, tahun: null, n: 0, q: "", indeks: null, tunda: null, pending: null };
const KOSP_DATA_TAHUN = ["2026/2027", "2027/2028"];
const KOSP_BAB_BAKU = { 1: "Pendahuluan", 2: "Visi, Misi dan Tujuan", 3: "Pengorganisasian Pembelajaran", 4: "Perencanaan Pembelajaran", 5: "Evaluasi, Pendampingan dan Pengembangan Profesional", 6: "Lampiran", 7: "Bagian Awal", 8: "Penutup" };
const KOSP_URUT = [7, 1, 2, 3, 4, 5, 8, 6]; // urutan tampil: Bagian Awal, BAB I–V, Penutup, Lampiran
const KOSP_IKON = { 1: "📖", 2: "🎯", 3: "🧩", 4: "📝", 5: "📈", 6: "📎" };
const KOSP_ROMAWI = ["", "I", "II", "III", "IV", "V", ""];
const KOSP_ALAMAT = "Jl. Masjid Al Umm, Komplek Bulau Indah Baru, RT.09 RW.03, Desa Banua Binjai, Kec. Barabai, Kab. Hulu Sungai Tengah, Kalimantan Selatan";
// Catatan pemeriksaan draf (tampil untuk pengelola selama bab itu belum diunggah ulang)
const KOSP_CATATAN = {
  "2026/2027": {
    0: ["Belum ada Kata Pengantar dan Lembar Pengesahan (tanda tangan Kepala PKBM & Ketua Yayasan). Sampul & daftar isi sudah dibuat otomatis oleh aplikasi."],
    1: ["Jumlah peserta didik tidak cocok: teks menulis 335 (152 L, 183 P), sedangkan tabel per fase berjumlah 336 (153 L, 183 P).",
        "Tutor Paket B & C Asrama Putra masih titik-titik (jumlah, mapel, kualifikasi) dan tertulis \"semuanya adalah perempuan\" — tersalin dari bagian Putri.",
        "Tutor Putri: jumlah 23 orang, tetapi S1 30 + S2 3 = 33 orang, dan mapel umum 23 + halaqah 11 = 34 orang. Paket A: 31 tutor, tetapi 25 + 11 = 36.",
        "\"Karakteristik Peserta Didik sebagai berikut :\" belum ada uraiannya (hanya diagram). Perlu diisi: latar keluarga, asrama/non-asrama, minat-bakat, kebutuhan khusus.",
        "Tabel sarana: Ruang Makan & Listrik Paket C kosong; \"Kamar mandi + WC\" ada di dua tabel dengan angka berbeda.",
        "Paragraf Analisis Lingkungan tertulis dua kali (sama persis)."],
    2: ["Tujuan no. 1 sama persis dengan Misi no. 1, dan Tujuan no. 3 mengulang Tujuan no. 1.",
        "Belum ada rumusan Profil Lulusan (8 Dimensi Profil Lulusan) padahal dipakai di modul ajar BAB IV.",
        "Tujuan sebaiknya terukur (mis. target hafalan lulusan tiap jenjang)."],
    3: ["Paket B & C Asrama Putra belum ada sama sekali (struktur kurikulum, tahfizh, kokurikuler, ekstrakurikuler) — semua bagian B & C masih milik Putri.",
        "Kurikulum Kekhasan Tahfizh baru untuk Rumah Tahfizh Putri; Paket A dan Putra belum.",
        "Kalimat KKM terpotong: \"Nilai Adab & Kedisiplinan: Minimal Baik (\".",
        "D. Ekstrakurikuler › 1. Program Paket A masih kosong (isinya ada di bagian A.1).",
        "Tabel SKK Paket B: nomor 8 terlewat. Kokurikuler Paket C: Ecoprint belum bernomor.",
        "Saran: tambahkan kriteria kenaikan kelas & kelulusan serta pengaturan beban belajar (JP per pekan)."],
    4: ["Contoh ATP/Modul Ajar Putra belum ada; Fase F (kelas 12) belum ada contoh.",
        "Urutan tercampur: \"B. Ruang Lingkup Kelas\" Paket A muncul sebelum Paket B & C (di daftar isi ditandai \"Ruang Lingkup Kelas – Paket A\").",
        "Modul Bahasa Indonesia Fase E memakai huruf H, I … N (melanjutkan modul sebelumnya), seharusnya mulai A lagi.",
        "Istilah belum seragam: modul Paket C masih \"Profil Pelajar Pancasila\", yang lain \"Dimensi Profil Lulusan\"; \"Ketua PKBM\" dan \"Kepala PKBM\" bercampur.",
        "Kolom \"Kelas / Semester\" ATP Matematika Fase D masih kosong."],
    5: ["IHT tertulis \"sekali dalam sebulan sekali, biasanya pada awal atau akhir tahun pelajaran\" — bertentangan, perlu dipilih salah satu.",
        "Belum ada jadwal/rencana tindak lanjut yang terukur (mis. supervisi tiap semester, IHT bulan apa).",
        "Saran: tambahkan Penutup dan Lampiran (Kalender Pendidikan, SK Tim Pengembang Kurikulum, Struktur Organisasi)."],
  },
};

const _kE = (s) => (typeof escapeHtml === "function" ? escapeHtml(String(s == null ? "" : s)) : String(s == null ? "" : s));
const _kTh = (th) => String(th || "").replace("/", "-");
const _kKunci = (th, n) => `bosp:kosp:${_kTh(th)}:b${n}`;
const _kNamaBab = (n) => ({ 6: "Lampiran", 7: "Bagian Awal", 8: "Penutup" }[n] || "BAB " + KOSP_ROMAWI[n]);
const _kTglTampil = (iso) => { try { return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }); } catch (e) { return ""; } };
const _kNormal = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[’‘`]/g, "'").replace(/[“”]/g, '"');

// ── Muat ──
function _kospMuatBawaan(th) {
  if ((window.KOSP_BAWAAN || {})[th] || !KOSP_DATA_TAHUN.includes(th)) return Promise.resolve();
  return new Promise((ok) => { const s = document.createElement("script"); s.src = `src/kosp-data/${_kTh(th)}.js?v=2`; s.onload = ok; s.onerror = () => ok(); document.head.appendChild(s); });
}
async function kospMuat(paksa) {
  if (!KOSP.siap || paksa) {
    const r = await supaSemua.from("kuliah_pengaturan").select("kunci,nilai").eq("ruang_id", "*").like("kunci", "bosp:kosp:%");
    if (r.error) throw r.error;
    KOSP.kv = {}; KOSP.info = {};
    KOSP.pj = {};
    (r.data || []).forEach((x) => { if (x.kunci === "bosp:kosp:info") KOSP.info = x.nilai || {}; else if (x.kunci === "bosp:kosp:pj") KOSP.pj = x.nilai || {}; else KOSP.kv[x.kunci] = x.nilai || {}; });
    KOSP.siap = true; KOSP.indeks = null;
  }
  if (!KOSP.tahun || !kospDaftarTahun().includes(KOSP.tahun)) KOSP.tahun = kospDaftarTahun().includes(_kospTPKini()) ? _kospTPKini() : kospDaftarTahun()[0];
  await Promise.all(KOSP_DATA_TAHUN.filter((t) => t <= KOSP.tahun).map(_kospMuatBawaan));
}
const kospDaftarTahun = () => [...new Set([...KOSP_DATA_TAHUN, ...Object.keys(KOSP.info || {}).filter((t) => /^\d{4}\/\d{4}$/.test(t))])].sort().reverse();

// Isi satu bab: unggahan tahun ini › bawaan tahun ini › warisan tahun sebelumnya
function kospBab(th, n, warisan = true) {
  const u = KOSP.kv[_kKunci(th, n)];
  const b = (((window.KOSP_BAWAAN || {})[th] || {}).bab || []).find((x) => x.no === n);
  if (u && u.html) return { no: n, judul: u.judul || (b && b.judul) || KOSP_BAB_BAKU[n], html: u.html, berkas: u.berkas, diubah: u.diubah, oleh: u.oleh, riwayat: u.riwayat || [], sumber: "unggah", th };
  if (b) return { no: n, judul: b.judul, html: b.html, sumber: "bawaan", th };
  if (warisan) for (const t of kospDaftarTahun().filter((x) => x < th)) { const w = kospBab(t, n, false); if (w.html) return { ...w, sumber: "warisan", asal: t }; }
  return { no: n, judul: KOSP_BAB_BAKU[n], html: "", sumber: "kosong", th };
}
const kospSemuaBab = (th) => KOSP_URUT.map((n) => kospBab(th, n)).filter((b) => (b.no >= 1 && b.no <= 5) || b.html);

// ── Halaman ──
function kospLompatIsi() { const m = [...document.querySelectorAll("#kosp-isi mark.kd-isi")]; if (!m.length) return; KOSP.iIsi = ((KOSP.iIsi == null ? -1 : KOSP.iIsi) + 1) % m.length; const el = m[KOSP.iIsi]; el.scrollIntoView({ block: "center" }); el.classList.remove("kosp-kilat"); void el.offsetWidth; el.classList.add("kosp-kilat"); toast(`Titik kuning ${KOSP.iIsi + 1} dari ${m.length}`, "info"); }
const _kospKeyHal = () => (STATE.ruang === "Pg" ? "pg-kosp" : "kosp");
async function kospBuka(n, opsi = {}) {
  const sec = _rgBukaHal(_kospKeyHal(), "KOSP", `<div class="card"><div class="rg-memuat">Memuat KOSP…</div></div>`);
  try { if (typeof sopMuat === "function") await sopMuat().catch(() => {}); await kospMuat(opsi.segar); }
  catch (e) { sec.innerHTML = `<div class="card">Gagal memuat KOSP: ${_kE(e.message || e)}</div>`; return; }
  KOSP.n = n || 0;
  _kospRender(sec, opsi);
}
// ── Ikon garis (gaya antarmuka modern) ──
const KOSP_SVG = {
  cari: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>', unduh: '<path d="M12 4v11m0 0-4-4m4 4 4-4"/><path d="M5 19h14"/>', cetak: '<path d="M7 9V4h10v5"/><rect x="4" y="9" width="16" height="8" rx="2"/><path d="M7 14h10v6H7z"/>',
  atur: '<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
  kiri: '<path d="m15 18-6-6 6-6"/>', kanan: '<path d="m9 18 6-6-6-6"/>', panah: '<path d="M7 17 17 7M8 7h9v9"/>', unggah: '<path d="M12 20V9m0 0-4 4m4-4 4 4"/><path d="M5 5h14"/>',
  lampir: '<path d="m21 11-8.5 8.5a5 5 0 0 1-7-7L14 4a3.3 3.3 0 0 1 4.7 4.7l-8.6 8.6a1.7 1.7 0 0 1-2.4-2.4L15.5 7"/>', riwayat: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/>',
  daftar: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>', buku: '<path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2zM22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z"/>', grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  b1: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>', b2: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>', b3: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
  b4: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1M9 10h6M9 14h6M9 18h3"/>', b5: '<path d="M3 20h18M6 16v-4M11 16V8M16 16v-6M21 4l-5 4-4-2-5 4"/>', b7: '<path d="M4 4h16v16H4z"/><path d="M8 8h8M8 12h8M8 16h5"/>', b8: '<path d="M20 6 9 17l-5-5"/>', b6: '<path d="m21 11-8.5 8.5a5 5 0 0 1-7-7L14 4a3.3 3.3 0 0 1 4.7 4.7l-8.6 8.6a1.7 1.7 0 0 1-2.4-2.4L15.5 7"/>',
};
const _kIk = (n, c = "") => `<svg class="kosp-ik ${c}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${KOSP_SVG[n] || ""}</svg>`;
const _kDua = (n) => ({ 7: "00", 8: "06", 6: "07" }[n] || String(n).padStart(2, "0"));
function _kospStat(b) { const t = document.createElement("div"); t.innerHTML = b.html || ""; return { bagian: t.querySelectorAll("h2,h3").length, tabel: t.querySelectorAll("table").length, kata: (t.textContent.match(/\S+/g) || []).length, judul: [...t.querySelectorAll("h2,h3")].map((h) => h.textContent.replace(/^[A-Z0-9]+[.)]\s*/, "")) }; }

function _kospRender(sec, opsi = {}) {
  sec = sec || document.getElementById("page-rg"); if (!sec) return;
  const th = KOSP.tahun, kelola = _kospBolehKelola(), daftarTh = kospDaftarTahun();
  sec.innerHTML = `<div class="kosp">
    <div class="kosp-bar">
      <div class="kosp-bar-kiri">
        ${KOSP.n ? `<button class="kosp-tb" onclick="kospBuka(0)" title="Beranda KOSP">${_kIk("grid")}<span>Beranda KOSP</span></button>` : `<span class="kosp-merek">${_kIk("buku")}<b>KOSP</b></span>`}
        <label class="kosp-th" title="Tahun Pelajaran"><span>TP</span><select onchange="kospGantiTahun(this.value)">${daftarTh.map((t) => `<option ${t === th ? "selected" : ""}>${t}</option>`).join("")}</select></label>
      </div>
      <div class="kosp-cari">${_kIk("cari")}<input id="kosp-q" type="search" autocomplete="off" placeholder="Cari kata di seluruh KOSP…" value="${_kE(KOSP.q)}" oninput="kospKetikCari(this.value)" onkeydown="if(event.key==='Enter'){event.preventDefault();kospCari(this.value,true)}"><kbd>Ctrl K</kbd></div>
      <div class="kosp-bar-kanan">
        <button class="kosp-tb" onclick="kospUnduhSemua()" title="Unduh seluruh KOSP (Word)">${_kIk("unduh")}<span>Word</span></button>
        <button class="kosp-tb" onclick="kospCetak()" title="Cetak / simpan PDF">${_kIk("cetak")}<span>PDF</span></button>
        ${kelola ? `<button class="kosp-tb" onclick="kospKelola()" title="Kelola KOSP">${_kIk("atur")}<span>Kelola</span></button>` : ""}
      </div>
    </div>
    <div id="kosp-hasil" class="kosp-hasil" hidden></div>
    <div id="kosp-badan">${KOSP.n ? _kospHtmlBaca(KOSP.n) : _kospHtmlSampul()}</div>
  </div>`;
  if (opsi.k == null) { const pc = document.getElementById("page-container"); if (pc) pc.scrollTo({ top: 0, behavior: "instant" }); }
  if (KOSP.n) _kospSetelBaca(opsi);
  if (KOSP.n && opsi.isi) { KOSP.iIsi = -1; setTimeout(kospLompatIsi, 150); }
  if (KOSP.q && KOSP.q.length >= 2) kospCari(KOSP.q);
  if (!KOSP._tombolK) { KOSP._tombolK = true; document.addEventListener("keydown", (e) => { const q = document.getElementById("kosp-q"); if (!q) return; if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); q.focus(); q.select(); } }); }
}
async function kospGantiTahun(th) { KOSP.tahun = th; KOSP.indeks = null; await kospMuat(); _kospRender(); }

// ── Beranda KOSP: hero + statistik + kartu bab ──
function _kospHtmlSampulKartu(th) {
  const logo = window.LOGO_PKBM_DEFAULT || (typeof urlLogoSekolah === "function" ? urlLogoSekolah() : "") || "assets/logo-pkbm-default.png";
  return `<div class="kosp-dok"><div class="kosp-dok-kilau"></div>
    <div class="kosp-dok-atas"><img src="${_kE(logo)}" alt="" onerror="this.style.display='none'"><div><b>PKBM Al Umm Barabai</b><small>Satuan Pendidikan Kesetaraan</small></div></div>
    <div class="kosp-dok-kode">KOSP</div>
    <div class="kosp-dok-sub">Kurikulum Operasional<br>Satuan Pendidikan</div>
    <div class="kosp-dok-prog"><span>Paket A</span><span>Paket B</span><span>Paket C</span></div>
    <div class="kosp-dok-bawah"><span>Tahun Pelajaran</span><b>${_kE(th)}</b></div>
  </div>`;
}
function _kospTerakhir() { try { return JSON.parse(localStorage.getItem("kosp:terakhir") || "null"); } catch (e) { return null; } }
function _kospHtmlSampul() {
  const th = KOSP.tahun, bab = kospSemuaBab(th), kelola = _kospBolehKelola(), ter = _kospTerakhir();
  const lanjut = ter && ter.th === th && ter.n ? bab.find((b) => b.no === ter.n) : null;
  const st = bab.map(_kospStat), tot = st.reduce((a, s) => ({ bagian: a.bagian + s.bagian, tabel: a.tabel + s.tabel, kata: a.kata + s.kata }), { bagian: 0, tabel: 0, kata: 0 });
  const baru = bab.filter((b) => b.sumber === "unggah").map((b) => b.diubah).sort().pop();
  const kartu = bab.map((b, i) => {
    const s = st[i];
    const pj = _kospPjBab(b.no), usul = _kospUsulan(b.no), kuning = _kospJmlIsi(b.html);
    const status = b.sumber === "unggah" ? `<span class="kosp-lbl ok"><i></i>Diperbarui ${_kE(_kTglTampil(b.diubah))}</span>` : b.sumber === "warisan" ? `<span class="kosp-lbl warn"><i></i>Isi TP ${_kE(b.asal)}</span>` : b.sumber === "kosong" ? `<span class="kosp-lbl"><i></i>Belum ada</span>` : `<span class="kosp-lbl draf"><i></i>Draf ${_kE(th)}</span>`;
    const persen = tot.kata ? Math.max(4, Math.round((s.kata / tot.kata) * 100)) : 0;
    return `<div class="kosp-kartu ${b.html ? "" : "kosong"}" style="--i:${i}" ${b.html ? `onclick="kospBuka(${b.no})"` : ""}>
      <div class="kosp-k-atas"><span class="kosp-k-ikon">${_kIk("b" + b.no)}</span><span class="kosp-k-no">${_kDua(b.no)}</span></div>
      <div class="kosp-k-bab">${_kE(_kNamaBab(b.no))}</div>
      <h3>${_kE(b.judul)}</h3>
      <p>${_kE(s.judul.slice(0, 3).join(" · ") || (b.html ? "" : "Belum diunggah"))}</p>
      <div class="kosp-k-meta">${status}${usul ? `<span class="kosp-lbl usul"><i></i>Usulan menunggu</span>` : ""}${kuning ? `<span class="kosp-lbl kuning"><i></i>${kuning} perlu diisi</span>` : ""}${b.html ? `<span>${s.bagian} bagian</span>${s.tabel ? `<span>${s.tabel} tabel</span>` : ""}` : ""}</div>
      <div class="kosp-k-pj">PJ: ${pj.length ? pj.map((id) => _kE(_kospNama(id))).join(", ") : `<i>${_kE(_kospNama(_kospPengesahId()))} (pengesah)</i>`}</div>
      <div class="kosp-k-bar" title="Porsi isi dari seluruh KOSP"><i style="width:${persen}%"></i></div>
      <div class="kosp-k-aksi" onclick="event.stopPropagation()">
        ${b.html ? `<button class="kosp-ib" title="Unduh bab ini (Word)" onclick="kospUnduhBab(${b.no})">${_kIk("unduh")}</button>` : ""}
        ${b.berkas ? `<button class="kosp-ib" title="Berkas asli yang diunggah" onclick="kospBerkasAsli(${b.no})">${_kIk("lampir")}</button>` : ""}
        ${_kospBolehUbah(b.no) ? `<button class="kosp-ib" title="Sunting di aplikasi" onclick="kospSunting(${b.no})">✏️</button><button class="kosp-ib" title="Unggah bab ini (.docx)" onclick="kospUnggah(${b.no})">${_kIk("unggah")}</button>` : ""}
        ${b.html ? `<span class="kosp-k-buka" onclick="kospBuka(${b.no})">Baca ${_kIk("panah")}</span>` : ""}
      </div></div>`;
  }).join("");
  const cat = kelola ? _kospHtmlCatatan(th, bab) : "";
  const menunggu = _kospBolehSahkan() ? KOSP_URUT.filter((n) => _kospUsulan(n)) : [], ditolak = KOSP_URUT.filter((n) => { const t = (KOSP.kv[_kKunci(th, n)] || {}).tolak; return t && t.untuk === STATE.guruId; });
  const pemberitahuan = (menunggu.length ? `<div class="kosp-banner biru">📥 <b>${menunggu.length} usulan perubahan</b> menunggu pengesahan Anda: ${menunggu.map((n) => `<button class="kosp-lbl-btn" onclick="kospBuka(${n})">${_kE(_kNamaBab(n))}</button>`).join("")}</div>` : "") + ditolak.map((n) => { const t = KOSP.kv[_kKunci(th, n)].tolak; return `<div class="kosp-banner merah">↩️ Usulan ${_kE(_kNamaBab(n))} dikembalikan oleh ${_kE(t.oleh)}: “${_kE(t.catatan)}” <button class="kosp-lbl-btn" onclick="kospSunting(${n})">Perbaiki</button></div>`; }).join("");
  const lanjutTP = kelola && th === _kospTPKini() && kospDaftarTahun().some((t) => t > th) ? `<div class="kosp-banner">🗓️ Draf KOSP <b>TP ${_kE(kospDaftarTahun().find((t) => t > th))}</b> sudah disiapkan. <button class="kosp-lbl-btn" onclick="kospGantiTahun('${kospDaftarTahun().find((t) => t > th)}')">Buka Draf</button></div>` : "";
  return `${pemberitahuan}${lanjutTP}<section class="kosp-hero">
      <div class="kosp-hero-grid"></div><div class="kosp-hero-glow a"></div><div class="kosp-hero-glow b"></div>
      <div class="kosp-hero-teks">
        ${_kospSah(th) ? `<span class="kosp-chip"><i></i>Disahkan ${_kE(_kTglTampil(_kospSah(th).t))} · TP ${_kE(th)}</span>` : `<span class="kosp-chip draf"><i></i>Draf · TP ${_kE(th)} · belum disahkan</span>`}
        <h1>Kurikulum Operasional <em>Satuan Pendidikan</em></h1>
        <p>Dasar penyelenggaraan pembelajaran PKBM Al Umm Barabai untuk semua jenjang — Paket A, Paket B &amp; C Putra, dan Paket B &amp; C Putri.</p>
        <div class="kosp-hero-aksi">
          <button class="kosp-cta" onclick="kospBuka(${lanjut ? lanjut.no : 1})">${_kIk("buku")}${lanjut ? `Lanjut ${_kE(_kNamaBab(lanjut.no))}` : "Mulai Membaca"}</button>
          <button class="kosp-cta2" onclick="document.getElementById('kosp-q').focus()">${_kIk("cari")}Cari Isi</button>
        </div>
      </div>
      <div class="kosp-hero-dok">${_kospHtmlSampulKartu(th)}</div>
    </section>
    <div class="kosp-statistik">
      <div><b>${bab.filter((b) => b.html).length}</b><span>Bab</span></div>
      <div><b>${tot.bagian}</b><span>Bagian</span></div>
      <div><b>${tot.tabel}</b><span>Tabel</span></div>
      <div><b>${(tot.kata / 1000).toFixed(1).replace(".", ",")}rb</b><span>Kata</span></div>
      <div class="lebar"><b>${baru ? _kE(_kTglTampil(baru)) : "Draf Awal"}</b><span>Pembaruan Terakhir</span></div>
    </div>
    ${kelola ? _kospHtmlPeriksa() : ""}
    <div class="kosp-sekat"><h2>Struktur Dokumen</h2><span>Ketuk kartu untuk membaca · cari kata untuk langsung ke letaknya</span></div>
    <div class="kosp-daftar">${kartu}
      ${_kospBolehUbah(6) && !bab.some((b) => b.no === 6) ? `<button class="kosp-kartu kosp-tambah" onclick="kospUnggah(6)"><span class="kosp-k-ikon">${_kIk("lampir")}</span><h3>Tambah Lampiran</h3><p>Unggah berkas .docx (kalender pendidikan, SK tim, dll.)</p></button>` : ""}
    </div>
    ${cat}`;
}
function _kospHtmlCatatan(th, bab) {
  const c = KOSP_CATATAN[th]; if (!c) return "";
  const grup = Object.entries(c).filter(([n]) => +n === 0 || (bab.find((b) => b.no === +n) || {}).sumber === "bawaan");
  if (!grup.length) return "";
  const jml = grup.reduce((a, [, x]) => a + x.length, 0);
  return `<details class="kosp-catatan"><summary><span class="kosp-cat-ikon">!</span><b>Catatan Penyempurnaan Draf</b><span class="kosp-cat-jml">${jml}</span><small>hanya terlihat oleh pengelola</small></summary>
    <div class="kosp-cat-isi">${grup.map(([n, x]) => `<div class="kosp-cat-grup"><b>${+n ? _kE(_kNamaBab(+n) + " · " + KOSP_BAB_BAKU[n]) : "Umum"}</b><ul>${x.map((t) => `<li>${_kE(t)}</li>`).join("")}</ul></div>`).join("")}</div>
    <p class="kosp-ket">Catatan sebuah bab hilang otomatis setelah bab itu diunggah ulang.</p></details>`;
}

// ── Membaca satu bab ──
function _kospHtmlBaca(n) {
  const th = KOSP.tahun, b = kospBab(th, n), semua = kospSemuaBab(th), kelola = _kospBolehKelola();
  const i = semua.findIndex((x) => x.no === n), seb = semua[i - 1], ses = semua[i + 1], s = _kospStat(b), pj = _kospPjBab(n), usul = _kospUsulan(n), kuning = _kospJmlIsi(b.html), rec = KOSP.kv[_kKunci(th, n)] || {};
  const ubah = _kospBolehUbah(n), tolak = rec.tolak && rec.tolak.untuk === STATE.guruId ? rec.tolak : null;
  const sumber = b.sumber === "unggah" ? `Diperbarui ${_kE(_kTglTampil(b.diubah))}${b.oleh ? ` · ${_kE(b.oleh)}` : ""}` : b.sumber === "warisan" ? `Memakai isi TP ${_kE(b.asal)}` : b.sumber === "bawaan" ? `Draf TP ${_kE(th)}` : "Belum ada isi";
  const tocBab = semua.map((x) => `<a class="kosp-toc-bab ${x.no === n ? "aktif" : ""}" onclick="kospBuka(${x.no})"><b>${_kDua(x.no)}</b><span>${_kE(x.judul)}</span></a>${x.no === n ? `<div id="kosp-toc-sub" class="kosp-toc-sub"></div>` : ""}`).join("");
  return `<div class="kosp-baca">
    <aside class="kosp-toc" id="kosp-toc"><div class="kosp-toc-judul">${_kIk("daftar")}<span>Daftar Isi</span><span class="kosp-toc-persen" id="kosp-persen">0%</span><button class="kosp-toc-tutup" onclick="kospToc(false)">✕</button></div>${tocBab}</aside>
    <div class="kosp-toc-latar" onclick="kospToc(false)"></div>
    <article class="kosp-artikel">
      <header class="kosp-bab-kepala"><div class="kosp-hero-grid"></div><div class="kosp-hero-glow a"></div><div class="kosp-bk-angka">${_kDua(n)}</div>
        <div class="kosp-bk-jejak"><a onclick="kospBuka(0)">KOSP</a>${_kIk("kanan")}<span>TP ${_kE(th)}</span>${_kIk("kanan")}<span>${_kE(_kNamaBab(n))}</span></div>
        <h1>${_kE(b.judul)}</h1>
        <div class="kosp-bk-meta"><span class="kosp-bk-status"><i></i>${sumber}</span>${b.html ? `<span>${s.bagian} bagian</span><span>${s.tabel} tabel</span><span>± ${Math.max(1, Math.round(s.kata / 200))} menit baca</span>` : ""}<span>PJ: ${pj.length ? pj.map((id) => _kE(_kospNama(id))).join(", ") : _kE(_kospNama(_kospPengesahId()))}</span></div>
        <div class="kosp-bk-aksi">
          <button class="kosp-tb kosp-toc-buka" onclick="kospToc(true)">${_kIk("daftar")}Daftar Isi</button>
          ${b.html ? `<button class="kosp-tb" onclick="kospUnduhBab(${n})">${_kIk("unduh")}Unduh Bab</button>` : ""}
          ${b.berkas ? `<button class="kosp-tb" onclick="kospBerkasAsli(${n})">${_kIk("lampir")}Berkas Asli</button>` : ""}
          ${ubah ? `<button class="kosp-tb" onclick="kospSunting(${n})">✏️ Sunting</button><button class="kosp-tb" onclick="kospUnggah(${n})">${_kIk("unggah")}Unggah .docx</button>` : ""}
          ${(ubah || kelola) && (b.riwayat || []).length ? `<button class="kosp-tb" onclick="kospRiwayat(${n})">${_kIk("riwayat")}Riwayat</button>` : ""}
          ${kuning && ubah ? `<button class="kosp-tb kuning" onclick="kospLompatIsi()">🟨 ${kuning} Perlu Diisi</button>` : ""}
        </div></header>
      ${usul && _kospBolehSahkan() ? `<div class="kosp-banner biru dalam">📥 Usulan perubahan dari <b>${_kE(usul.oleh)}</b> (${_kE(_kTglTampil(usul.t))})${usul.catatan ? `: “${_kE(usul.catatan)}”` : ""} <button class="kosp-lbl-btn" onclick="kospLihatUsulan(${n})">Lihat Perubahan & Sahkan</button></div>` : usul && usul.olehId === STATE.guruId ? `<div class="kosp-banner dalam">⏳ Usulan Anda menunggu pengesahan ${_kE(_kospNama(_kospPengesahId()))}. Yang tampil di bawah masih versi lama. <button class="kosp-lbl-btn" onclick="kospLihatUsulan(${n})">Lihat Usulan</button></div>` : usul && ubah ? `<div class="kosp-banner dalam">⏳ Ada usulan dari ${_kE(usul.oleh)} yang menunggu pengesahan.</div>` : ""}
      ${tolak ? `<div class="kosp-banner merah dalam">↩️ Usulan Anda dikembalikan oleh ${_kE(tolak.oleh)}: “${_kE(tolak.catatan)}” <button class="kosp-lbl-btn" onclick="kospSunting(${n})">Perbaiki</button></div>` : ""}
      <div class="kosp-isi" id="kosp-isi">${b.html || `<p class="kosp-kosong">Bab ini belum diisi.${kelola ? " Tekan Unggah untuk menambahkan berkas .docx." : ""}</p>`}</div>
      <nav class="kosp-nav">${seb ? `<button onclick="kospBuka(${seb.no})">${_kIk("kiri")}<span><small>Sebelumnya · ${_kE(_kNamaBab(seb.no))}</small><b>${_kE(seb.judul)}</b></span></button>` : "<span></span>"}
        ${ses ? `<button class="kanan" onclick="kospBuka(${ses.no})"><span><small>Berikutnya · ${_kE(_kNamaBab(ses.no))}</small><b>${_kE(ses.judul)}</b></span>${_kIk("kanan")}</button>` : `<button class="kanan" onclick="kospBuka(0)"><span><small>Selesai</small><b>Kembali ke Beranda KOSP</b></span>${_kIk("grid")}</button>`}</nav>
    </article>
    <div class="kosp-progres"><i id="kosp-progres"></i></div>
  </div>`;
}
function _kospSetelBaca(opsi = {}) {
  const isi = document.getElementById("kosp-isi"), sub = document.getElementById("kosp-toc-sub"); if (!isi) return;
  isi.querySelectorAll("table").forEach((t) => { if (!t.parentElement.classList.contains("kd-tabel")) { const w = document.createElement("div"); w.className = "kd-tabel"; t.before(w); w.appendChild(t); } });
  _kospBlok(isi).forEach((el, k) => { el.dataset.k = k; });
  const judul = [...isi.querySelectorAll("h2,h3")];
  judul.forEach((h, i) => { h.id = `kosp-j${i}`; });
  if (sub) sub.innerHTML = judul.map((h, i) => `<a class="kosp-toc-${h.tagName.toLowerCase()}" data-j="${i}" onclick="kospLompat(${i})">${_kE(h.textContent)}</a>`).join("");
  // sorot bagian yang sedang dibaca + garis kemajuan
  if (KOSP._amati) KOSP._amati.disconnect();
  if ("IntersectionObserver" in window && judul.length) {
    KOSP._amati = new IntersectionObserver((ent) => {
      ent.forEach((e) => { if (e.isIntersecting) { const i = e.target.id.slice(6); document.querySelectorAll("#kosp-toc-sub a").forEach((a) => a.classList.toggle("aktif", a.dataset.j === i)); } });
    }, { rootMargin: "-80px 0px -70% 0px" });
    judul.forEach((h) => KOSP._amati.observe(h));
  }
  if (!KOSP._gulir) { KOSP._gulir = true; document.addEventListener("scroll", _kospGulir, { passive: true, capture: true }); }
  try { localStorage.setItem("kosp:terakhir", JSON.stringify({ th: KOSP.tahun, n: KOSP.n })); } catch (e) {}
  if (opsi.k != null) setTimeout(() => _kospSorot(opsi.k, opsi.kata), 60);
}
function _kospGulir() {
  const bar = document.getElementById("kosp-progres"), art = document.querySelector(".kosp-artikel"); if (!bar || !art) return;
  const r = art.getBoundingClientRect(), tot = r.height - window.innerHeight;
  const p = Math.max(0, Math.min(100, tot > 0 ? (-r.top / tot) * 100 : 100)); bar.style.width = p + "%"; const ps = document.getElementById("kosp-persen"); if (ps) ps.textContent = Math.round(p) + "%";
}
function kospLompat(i) { const h = document.getElementById("kosp-j" + i); if (!h) return; kospToc(false); h.scrollIntoView({ behavior: "smooth", block: "start" }); }
function kospToc(buka) { document.querySelector(".kosp-baca")?.classList.toggle("toc-buka", !!buka); }

// ── Pencarian ──
const _kospBlok = (akar) => [...akar.querySelectorAll("h2,h3,h4,p,li,tr")].filter((el) => !(el.tagName === "P" && el.closest("tr")) && !(el.tagName === "P" && el.closest("li")));
function _kospIndeks() {
  if (KOSP.indeks && KOSP.indeks.th === KOSP.tahun) return KOSP.indeks.data;
  const data = [];
  kospSemuaBab(KOSP.tahun).forEach((b) => {
    const tmp = document.createElement("div"); tmp.innerHTML = b.html || ""; let judul = "";
    _kospBlok(tmp).forEach((el, k) => {
      const t = (el.tagName === "TR" ? [...el.cells].map((c) => c.textContent.trim()).filter(Boolean).join(" | ") : el.textContent).replace(/\s+/g, " ").trim();
      if (/^H[234]$/.test(el.tagName)) judul = t;
      if (t) data.push({ n: b.no, k, t, nt: _kNormal(t), judul, bab: b.judul, tag: el.tagName });
    });
  });
  KOSP.indeks = { th: KOSP.tahun, data };
  return data;
}
function kospKetikCari(q) { clearTimeout(KOSP.tunda); KOSP.tunda = setTimeout(() => kospCari(q), 220); }
function kospCari(q, enter) {
  KOSP.q = q = String(q || "").trim();
  const box = document.getElementById("kosp-hasil"); if (!box) return;
  if (q.length < 2) { box.hidden = true; box.innerHTML = ""; document.querySelectorAll("#kosp-isi mark.kosp-m").forEach((m) => m.replaceWith(m.textContent)); return; }
  const kata = _kNormal(q).split(/\s+/).filter(Boolean);
  const hasil = _kospIndeks().filter((x) => kata.every((w) => x.nt.includes(w)));
  // judul bagian didahulukan
  hasil.sort((a, b) => (/^h/i.test(b.tag) ? 1 : 0) - (/^h/i.test(a.tag) ? 1 : 0));
  if (enter && hasil.length) { kospBukaHasil(hasil[0].n, hasil[0].k); return; }
  const grup = {}; hasil.slice(0, 60).forEach((x) => { (grup[x.n] = grup[x.n] || []).push(x); });
  box.hidden = false;
  box.innerHTML = `<div class="kosp-h-kepala"><b>${hasil.length ? `${hasil.length} temuan` : "Tidak ditemukan"}</b> untuk “${_kE(q)}”${hasil.length > 60 ? " · 60 teratas" : ""}<button onclick="kospTutupCari()">✕</button></div>
    ${hasil.length ? Object.entries(grup).map(([n, xs]) => `<div class="kosp-h-grup"><div class="kosp-h-bab">${_kIk("b" + n)}${_kE(_kNamaBab(+n))} · ${_kE(xs[0].bab)} <span>${hasil.filter((x) => x.n === +n).length}</span></div>
      ${xs.map((x) => `<button class="kosp-h-item" onclick="kospBukaHasil(${x.n},${x.k})">${x.judul && x.judul !== x.t ? `<small>${_kE(x.judul)}</small>` : ""}<span>${_kospCuplikan(x.t, kata)}</span></button>`).join("")}</div>`).join("") : `<p class="kosp-ket">Coba kata lain atau lebih pendek, mis. “tahfizh”, “SKK”, “ekstrakurikuler”.</p>`}`;
}
function _kospCuplikan(t, kata) {
  const nt = _kNormal(t); let i = nt.indexOf(kata[0]); if (i < 0) i = 0;
  const a = Math.max(0, i - 60), b = Math.min(t.length, i + 140);
  let s = _kE((a ? "…" : "") + t.slice(a, b) + (b < t.length ? "…" : ""));
  kata.forEach((w) => { const re = new RegExp("(" + _kE(w).replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "gi"); s = s.replace(re, "<mark>$1</mark>"); });
  return s;
}
function kospTutupCari() { const i = document.getElementById("kosp-q"); if (i) i.value = ""; kospCari(""); }
function kospBukaHasil(n, k) {
  const box = document.getElementById("kosp-hasil"); if (box) box.hidden = true;
  const kata = _kNormal(KOSP.q).split(/\s+/).filter(Boolean);
  if (KOSP.n === n && document.getElementById("kosp-isi")) { _kospSorot(k, kata); return; }
  KOSP.n = n; _kospRender(null, { k, kata }); if (box) document.getElementById("kosp-hasil").hidden = true;
}
function _kospSorot(k, kata) {
  const isi = document.getElementById("kosp-isi"); if (!isi) return;
  isi.querySelectorAll("mark.kosp-m").forEach((m) => m.replaceWith(m.textContent)); isi.normalize();
  if (kata && kata.length) _kospTandai(isi, kata);
  const el = isi.querySelector(`[data-k="${k}"]`); if (!el) return;
  el.scrollIntoView({ behavior: "auto", block: "start" });
  el.classList.remove("kosp-kilat"); void el.offsetWidth; el.classList.add("kosp-kilat");
  const h = document.getElementById("kosp-hasil"); if (h) h.hidden = true;
}
function _kospTandai(akar, kata) {
  const re = new RegExp(kata.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|"), "gi");
  const jalan = document.createTreeWalker(akar, NodeFilter.SHOW_TEXT), simpul = [];
  while (jalan.nextNode()) simpul.push(jalan.currentNode);
  simpul.forEach((t) => {
    const asli = t.nodeValue, nt = _kNormal(asli); if (nt.length !== asli.length) return;
    let m, akhir = 0, frag = null; re.lastIndex = 0;
    while ((m = re.exec(nt))) {
      frag = frag || document.createDocumentFragment();
      frag.appendChild(document.createTextNode(asli.slice(akhir, m.index)));
      const mk = document.createElement("mark"); mk.className = "kosp-m"; mk.textContent = asli.slice(m.index, m.index + m[0].length); frag.appendChild(mk);
      akhir = m.index + m[0].length; if (!m[0].length) re.lastIndex++;
    }
    if (frag) { frag.appendChild(document.createTextNode(asli.slice(akhir))); t.replaceWith(frag); }
  });
}

// ── Unduh Word & Cetak ──
const KOSP_GAYA_CETAK = `body{font-family:"Times New Roman",serif;font-size:12pt;line-height:1.5;color:#000}
h1{font-size:14pt;text-align:center;margin:0 0 4pt}h2{font-size:12.5pt;margin:14pt 0 6pt}h3{font-size:12pt;margin:12pt 0 4pt}h4{font-size:12pt;font-style:italic;margin:10pt 0 4pt}
p{margin:0 0 6pt;text-align:justify}p.kd-li{margin-left:18pt;text-indent:-14pt}
table{border-collapse:collapse;width:100%;margin:6pt 0 10pt}td,th{border:1px solid #000;padding:3pt 5pt;vertical-align:top;font-size:10.5pt;text-align:left}
img{max-width:100%}img.kd-rumus{vertical-align:middle}mark.kd-isi{background:#fde68a}.bab-kop{text-align:center;margin-bottom:14pt}.bab-kop .no{font-size:14pt;font-weight:bold}`;
function _kospHtmlBabDok(b, putus) {
  return `${putus ? '<br clear="all" style="page-break-before:always">' : ""}<div class="bab-kop">${b.no >= 1 && b.no <= 5 ? `<div class="no">${_kE(_kNamaBab(b.no))}</div>` : ""}<h1>${_kE(String(b.judul).toUpperCase())}</h1></div>${b.html}`;
}
function _kospSampulDok(th) {
  return `<div style="text-align:center;padding-top:90pt"><p style="text-align:center;font-size:13pt;letter-spacing:2pt">DOKUMEN KURIKULUM</p>
    <p style="text-align:center;font-size:22pt;font-weight:bold;margin-top:30pt">KURIKULUM OPERASIONAL<br>SATUAN PENDIDIKAN<br>(KOSP)</p>
    <p style="text-align:center;font-size:18pt;font-weight:bold;margin-top:60pt">PKBM AL UMM BARABAI</p>
    <p style="text-align:center;font-size:13pt">Program Paket A · Paket B · Paket C</p>
    <p style="text-align:center;font-size:14pt;font-weight:bold;margin-top:30pt">TAHUN PELAJARAN ${_kE(th)}</p>
    <p style="text-align:center;font-size:10.5pt;margin-top:90pt">${_kE(KOSP_ALAMAT)}</p></div>`;
}
function _kospSimpanDoc(nama, badan) {
  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>${_kE(nama)}</title>
    <!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom></w:WordDocument></xml><![endif]-->
    <style>@page WordSection1{size:21cm 29.7cm;margin:2.5cm 2.5cm 2.5cm 3cm}div.WordSection1{page:WordSection1}${KOSP_GAYA_CETAK}</style></head><body><div class="WordSection1">${badan}</div></body></html>`;
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob(["﻿", html], { type: "application/msword" }));
  a.download = nama.replace(/[\\/:*?"<>|]+/g, "-") + ".doc"; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
}
function kospUnduhBab(n) {
  const b = kospBab(KOSP.tahun, n); if (!b.html) return toast("Bab ini belum ada isinya", "err");
  _kospSimpanDoc(`KOSP ${_kTh(KOSP.tahun)} - ${_kNamaBab(n)} ${b.judul}`, _kospHtmlBabDok(b, false));
  toast("Berkas Word diunduh", "ok");
}
function kospUnduhSemua() {
  const th = KOSP.tahun, bab = kospSemuaBab(th).filter((b) => b.html);
  const daftar = `<br clear="all" style="page-break-before:always"><h1>DAFTAR ISI</h1>${bab.map((b) => `<p style="margin:8pt 0 2pt"><b>${b.no >= 1 && b.no <= 5 ? _kE(_kNamaBab(b.no)) + " · " : ""}${_kE(String(b.judul).toUpperCase())}</b></p>${(() => { const t = document.createElement("div"); t.innerHTML = b.html; return [...t.querySelectorAll("h2,h3")].map((h) => `<p style="margin:0 0 1pt ${h.tagName === "H2" ? 14 : 28}pt">${_kE(h.textContent)}</p>`).join(""); })()}`).join("")}`;
  _kospSimpanDoc(`KOSP PKBM Al Umm Barabai ${_kTh(th)}`, _kospSampulDok(th) + daftar + bab.map((b) => _kospHtmlBabDok(b, true)).join(""));
  toast("KOSP lengkap diunduh (Word)", "ok");
}
function kospCetak() {
  const th = KOSP.tahun, bab = kospSemuaBab(th).filter((b) => b.html);
  const pilih = KOSP.n ? bab.filter((b) => b.no === KOSP.n) : bab;
  const w = window.open("", "_blank"); if (!w) return toast("Izinkan jendela munculan (pop-up) untuk mencetak", "err");
  const sampul = KOSP.n ? "" : `<section class="hal sampul">${_kospSampulDok(th)}</section>`;
  w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>KOSP PKBM Al Umm Barabai ${_kE(th)}${KOSP.n ? " - " + _kE(_kNamaBab(KOSP.n)) : ""}</title>
    <style>@page{size:A4;margin:20mm 20mm 20mm 25mm}${KOSP_GAYA_CETAK}.hal{page-break-after:always}.hal:last-child{page-break-after:auto}tr{page-break-inside:avoid}h2,h3,h4{page-break-after:avoid}</style></head>
    <body>${sampul}${pilih.map((b) => `<section class="hal">${_kospHtmlBabDok(b, false)}</section>`).join("")}<script>window.onload=function(){setTimeout(function(){window.print()},300)}<\/script></body></html>`);
  w.document.close();
}
async function kospBerkasAsli(n) { const b = kospBab(KOSP.tahun, n); if (!b.berkas) return; if (typeof arsipLihat === "function") arsipLihat(b.berkas); else if (b.berkas.url) window.open(b.berkas.url, "_blank"); }

// ── Unggah per bab (.docx) ──
function _kospMuatMammoth() {
  if (window.mammoth) return Promise.resolve();
  return new Promise((ok, gagal) => {
    const s = document.createElement("script"); s.src = "https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js";
    s.onload = () => (window.mammoth ? ok() : gagal(new Error("Pustaka pembaca Word tidak termuat")));
    s.onerror = () => gagal(new Error("Pustaka pembaca Word gagal dimuat — periksa internet lalu coba lagi"));
    document.head.appendChild(s);
  });
}
async function _kospKecilkanGambar(src) {
  if (src.length < 260000) return src;
  try {
    const img = await new Promise((r, j) => { const i = new Image(); i.onload = () => r(i); i.onerror = j; i.src = src; });
    const sk = Math.min(1, 1200 / Math.max(img.width, img.height)), c = document.createElement("canvas");
    c.width = Math.round(img.width * sk); c.height = Math.round(img.height * sk);
    const x = c.getContext("2d"); x.fillStyle = "#fff"; x.fillRect(0, 0, c.width, c.height); x.drawImage(img, 0, 0, c.width, c.height);
    return c.toDataURL("image/jpeg", 0.72);
  } catch (e) { return src; }
}
// Rapikan HTML hasil Word: buang gaya, kenali judul bagian dari baris tebal pendek
function _kospRapikan(html, daftarCadangan) {
  const t = document.createElement("template"); t.innerHTML = html;
  const akar = t.content;
  akar.querySelectorAll("script,style,iframe,object,embed,link,meta,form,input,button").forEach((x) => x.remove());
  akar.querySelectorAll("*").forEach((el) => {
    [...el.attributes].forEach((a) => {
      const n = a.name.toLowerCase();
      const boleh = (/^(td|th)$/i.test(el.tagName) && /^(colspan|rowspan)$/.test(n)) || (el.tagName === "IMG" && /^(src|alt|width|height)$/.test(n)) || (el.tagName === "A" && n === "href" && /^https?:/i.test(a.value));
      if (!boleh || (n === "src" && !/^data:image\//i.test(a.value))) el.removeAttribute(a.name);
    });
  });
  akar.querySelectorAll("h1,h5,h6").forEach((h) => { const g = document.createElement(h.tagName === "H1" ? "h2" : "h4"); g.innerHTML = h.innerHTML; h.replaceWith(g); });
  akar.querySelectorAll("a:not([href])").forEach((a) => a.replaceWith(...a.childNodes));
  // tabel yang hanya berisi gambar (bingkai diagram Word) → gambar saja
  akar.querySelectorAll("table").forEach((t) => { if (!t.textContent.trim() && t.querySelector("img")) { const ps = [...t.querySelectorAll("img")].map((i) => { const p = document.createElement("p"); p.className = "kd-gambar"; p.appendChild(i); return p; }); t.replaceWith(...ps); } });
  // td: satu paragraf → isi langsung
  akar.querySelectorAll("td,th").forEach((c) => { const ps = c.querySelectorAll(":scope > p"); if (ps.length === 1 && c.children.length === 1) c.innerHTML = ps[0].innerHTML; });
  // judul bab di awal (BAB III / PENGORGANISASIAN …) dibuang — ditampilkan sendiri
  let buang = 0;
  for (const el of [...akar.children]) {
    const tx = el.textContent.replace(/\s+/g, " ").trim();
    if (!tx && !el.querySelector("img,table")) { el.remove(); continue; }
    if (buang < 3 && (/^BAB\s+[IVX]+\b/i.test(tx) || (/^[A-Z ,&/()-]+$/.test(tx) && tx.length < 70 && buang > 0))) { el.remove(); buang++; continue; }
    break;
  }
  if (daftarCadangan) _kospJudulDariDaftar(akar);
  [...akar.querySelectorAll("p")].forEach((p) => {
    if (p.closest("td,th,li")) return;
    const tx = p.textContent.replace(/\s+/g, " ").trim();
    if (!tx && !p.querySelector("img")) { p.remove(); return; }
    const salin = p.cloneNode(true); salin.querySelectorAll("strong,b").forEach((b) => b.remove());
    const tebal = !salin.textContent.trim() && p.querySelector("strong,b");
    if (tebal && tx.length < 110) {
      const tag = /:$/.test(tx) ? "h4" : /^[A-Z]\.\s/.test(tx) ? "h2" : /^\d+\.\s/.test(tx) ? "h3" : "h4";
      const h = document.createElement(tag); h.textContent = tx; p.replaceWith(h); return;
    }
    if (/^(\d+[.)]|[a-z][.)]|•|-)\s/.test(tx)) p.className = "kd-li";
  });
  const d = document.createElement("div"); d.appendChild(akar); return d.innerHTML;
}
// Nomor otomatis Word ("A.", "1.", "a)") dihitung dari numbering.xml supaya bisa ditulis ulang sebagai teks
function _kospMuatJSZip() {
  if (window.JSZip) return Promise.resolve();
  return new Promise((ok, gagal) => { const s = document.createElement("script"); s.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"; s.onload = () => (window.JSZip ? ok() : gagal(new Error("JSZip tidak termuat"))); s.onerror = () => gagal(new Error("Pustaka Word gagal dimuat")); document.head.appendChild(s); });
}
async function _kospLabelNomor(buf) {
  await _kospMuatJSZip();
  const zip = await JSZip.loadAsync(buf), baca = async (p) => { const f = zip.file(p); return f ? new DOMParser().parseFromString(await f.async("string"), "application/xml") : null; };
  const [doc, num, gaya] = await Promise.all([baca("word/document.xml"), baca("word/numbering.xml"), baca("word/styles.xml")]);
  if (!doc || !num) return [];
  const W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main", el = (n, t) => [...n.getElementsByTagNameNS(W, t)], at = (n, a) => (n ? n.getAttributeNS(W, a) || n.getAttribute("w:" + a) : null);
  const satu = (n, t) => (n ? n.getElementsByTagNameNS(W, t)[0] : null);
  const abs = {}; el(num, "abstractNum").forEach((a) => { abs[at(a, "abstractNumId")] = Object.fromEntries(el(a, "lvl").map((l) => [at(l, "ilvl"), { mulai: +(at(satu(l, "start"), "val") || 1), fmt: at(satu(l, "numFmt"), "val") || "decimal", teks: at(satu(l, "lvlText"), "val") || "" }])); });
  const nums = {}; el(num, "num").forEach((n) => { const o = {}; el(n, "lvlOverride").forEach((x) => { const s = satu(x, "startOverride"); if (s) o[at(x, "ilvl")] = +at(s, "val"); }); nums[at(n, "numId")] = { abs: at(satu(n, "abstractNumId"), "val"), ganti: o }; });
  const gayaNum = {}; if (gaya) el(gaya, "style").forEach((s) => { const np = satu(s, "numPr"); if (np) gayaNum[at(s, "styleId")] = { id: at(satu(np, "numId"), "val"), lv: at(satu(np, "ilvl"), "val") || "0" }; });
  const romawi = (x) => { let r = "", v = [[1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]]; v.forEach(([a, b]) => { while (x >= a) { r += b; x -= a; } }); return r; };
  const huruf = (x) => { let s = ""; while (x > 0) { s = String.fromCharCode(65 + ((x - 1) % 26)) + s; x = Math.floor((x - 1) / 26); } return s; };
  const bentuk = (v, f) => ({ upperLetter: huruf(v), lowerLetter: huruf(v).toLowerCase(), upperRoman: romawi(v), lowerRoman: romawi(v).toLowerCase(), decimalZero: String(v).padStart(2, "0") }[f] || String(v));
  const hit = {}, hasil = [];
  el(doc, "p").forEach((p) => {
    const ppr = satu(p, "pPr"); let np = ppr && [...ppr.children].find((c) => c.localName === "numPr"), id, lv;
    if (np) { id = at(satu(np, "numId"), "val"); lv = at(satu(np, "ilvl"), "val") || "0"; }
    else { const st = ppr && [...ppr.children].find((c) => c.localName === "pStyle"); const g = st && gayaNum[at(st, "val")]; if (g) { id = g.id; lv = g.lv; } }
    if (!id || id === "0" || !nums[id]) return;
    const def = abs[nums[id].abs] || {}, L = def[lv]; if (!L) return;
    const c = (hit[id] = hit[id] || {}); const iv = +lv;
    c[iv] = c[iv] == null ? (nums[id].ganti[lv] != null ? nums[id].ganti[lv] : L.mulai) : c[iv] + 1;
    Object.keys(c).forEach((k) => { if (+k > iv) delete c[k]; });
    const label = L.fmt === "bullet" || L.fmt === "none" ? (L.fmt === "bullet" ? "•" : "") : L.teks.replace(/%(\d)/g, (m, k) => { const kl = String(+k - 1), d = def[kl] || L; const v = c[+k - 1] != null ? c[+k - 1] : d.mulai; return bentuk(v, d.fmt); });
    const t = el(p, "t").map((x) => x.textContent).join("").replace(/\s+/g, " ").trim();
    hasil.push({ t, label });
  });
  return hasil;
}
function _kospTeksMammoth(x) { return x.type === "text" ? x.value : (x.children || []).map(_kospTeksMammoth).join(""); }
function _kospPasangNomor(daftar) {
  let i = 0;
  return mammoth.transforms.paragraph((p) => {
    if (!p.numbering) return p;
    const t = _kospTeksMammoth(p).replace(/\s+/g, " ").trim();
    let j = -1; for (let k = i; k < Math.min(daftar.length, i + 8); k++) if (daftar[k].t === t) { j = k; break; }
    if (j < 0) return p;
    i = j + 1; const lab = daftar[j].label; if (!lab) return { ...p, numbering: null };
    const run = (p.children || []).filter((c) => c.type === "run"), tebal = run.length && run.every((r) => r.isBold || !_kospTeksMammoth(r).trim());
    return { ...p, numbering: null, children: [{ type: "run", children: [{ type: "text", value: lab + " " }], isBold: !!tebal, isItalic: false, isUnderline: false, isStrikethrough: false, isAllCaps: false, isSmallCaps: false, verticalAlignment: "baseline" }, ...(p.children || [])] };
  });
}
// Cadangan bila penomoran tidak terbaca: daftar <ol>.
// Penomoran otomatis Word ("A.", "1.") terbaca sebagai daftar <ol>. Butir daftar yang seluruhnya tebal & pendek
// dijadikan judul: tingkat 1 → "A." (h2), tingkat 2 → "1." (h3), lebih dalam → "a." (h4); daftar dipecah di situ.
function _kospJudulDariDaftar(akar) {
  const semua = [...akar.querySelectorAll("li")].filter((li) => !li.closest("td,th"));
  const dalam = new Map(semua.map((li) => { let d = 0, p = li.parentElement; while (p && p !== akar) { if (p.tagName === "LI") d++; p = p.parentElement; } return [li, d]; }));
  const hit = [0, 0, 0, 0];
  semua.forEach((li) => {
    const salin = li.cloneNode(true); salin.querySelectorAll("ol,ul").forEach((x) => x.remove());
    const tx = salin.textContent.replace(/\s+/g, " ").trim();
    const polos = salin.cloneNode(true); polos.querySelectorAll("strong,b").forEach((x) => x.remove());
    if (!tx || polos.textContent.trim() || !salin.querySelector("strong,b") || tx.length > 110 || (/[.;]$/.test(tx) && tx.length > 50)) return;
    const d = Math.min(3, dalam.get(li) || 0);
    hit[d]++; for (let i = d + 1; i < hit.length; i++) hit[i] = 0;
    const label = d === 0 ? String.fromCharCode(64 + hit[0]) + ". " : d === 1 ? hit[1] + ". " : String.fromCharCode(96 + hit[d]) + ". ";
    const h = document.createElement(d === 0 ? "h2" : d === 1 ? "h3" : "h4"); h.textContent = (/^([A-Z]|\d+|[a-z])[.)]\s/.test(tx) ? "" : label) + tx;
    const ol = li.parentElement, sesudah = [];
    for (let x = li.nextElementSibling; x; x = x.nextElementSibling) sesudah.push(x);
    let titik = ol; titik.after(h); titik = h;
    [...li.children].filter((c) => /^(OL|UL)$/.test(c.tagName)).forEach((c) => { titik.after(c); titik = c; });
    if (sesudah.length) { const ol2 = document.createElement(ol.tagName); sesudah.forEach((s) => ol2.appendChild(s)); titik.after(ol2); }
    li.remove(); if (!ol.children.length) ol.remove();
  });
}
async function kospUnggah(n) {
  if (!_kospBolehUbah(n)) return toast("Hanya penanggung jawab bab ini dan Kepala PKBM yang bisa mengunggah", "err");
  const f = await arsipPilihBerkas(".docx,.doc,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword");
  if (!f) return;
  if (!/\.docx$/i.test(f.name)) return toast("Simpan dulu sebagai .docx di Word (File › Simpan Sebagai › Dokumen Word .docx), lalu unggah lagi", "err");
  if (f.size > 25 * 1024 * 1024) return toast("Berkas lebih dari 25 MB", "err");
  toast("Membaca berkas Word…");
  try {
    await _kospMuatMammoth();
    const gambar = [];
    const buf = await f.arrayBuffer();
    let nomor = []; try { nomor = await _kospLabelNomor(buf.slice(0)); } catch (e) { console.warn("Nomor Word:", e); }
    const r = await mammoth.convertToHtml({ arrayBuffer: buf }, {
      ...(nomor.length ? { transformDocument: _kospPasangNomor(nomor) } : {}),
      convertImage: mammoth.images.imgElement((img) => img.read("base64").then(async (d) => { const src = await _kospKecilkanGambar(`data:${img.contentType};base64,${d}`); gambar.push(src.length); return { src }; })),
    });
    const html = _kospRapikan(r.value, !nomor.length);
    const lama = kospBab(KOSP.tahun, n);
    KOSP.pending = { n, file: f };
    const tmp = document.createElement("div"); tmp.innerHTML = html;
    openModal(`<h3>⬆️ Unggah ${_kE(_kNamaBab(n))} · KOSP TP ${_kE(KOSP.tahun)}</h3>
      <div class="field"><label class="form-label">Judul Bab</label><input id="kosp-u-judul" class="input" value="${_kE(lama.judul || KOSP_BAB_BAKU[n])}"></div>
      <div class="kosp-u-info"><span>📄 ${_kE(f.name)}</span><span>${tmp.querySelectorAll("h2,h3").length} bagian</span><span>${tmp.querySelectorAll("table").length} tabel</span><span>${tmp.querySelectorAll("img").length} gambar</span></div>
      <p class="kosp-ket">Periksa pratinjau di bawah. <b>Ketuk gambar untuk membuangnya</b> (mis. tanda tangan atau stempel). Berkas asli juga disimpan ke Arsip Drive agar bisa diunduh lagi.</p>
      <div id="kosp-u-pratinjau" class="kosp-u-pratinjau kosp-isi">${html}</div>
      <div style="display:flex;gap:10px;margin-top:12px"><button class="btn btn-outline" style="flex:1" onclick="closeModal()">Batal</button><button id="kosp-u-simpan" class="btn btn-accent" style="flex:2" onclick="kospSimpanUnggah()">${_kospBolehSahkan() ? "💾 Simpan & Terbitkan" : "📤 Kirim sebagai Usulan"}</button></div>`, { lebar: true });
    document.getElementById("kosp-u-pratinjau").addEventListener("click", (e) => { if (e.target.tagName === "IMG") { e.target.remove(); toast("Gambar dibuang dari bab ini", "ok"); } });
  } catch (e) { toast("Gagal membaca berkas: " + (e.message || e), "err"); }
}
async function kospSimpanUnggah() {
  const p = KOSP.pending; if (!p) return;
  const tombol = document.getElementById("kosp-u-simpan"), judul = (document.getElementById("kosp-u-judul").value || "").trim() || KOSP_BAB_BAKU[p.n];
  const html = document.getElementById("kosp-u-pratinjau").innerHTML;
  if (html.length > 4.5 * 1024 * 1024) return toast("Isi bab terlalu besar (gambar terlalu banyak). Buang sebagian gambar lalu coba lagi.", "err");
  tombol.disabled = true; tombol.textContent = "Menyimpan…";
  const th = KOSP.tahun, kunci = _kKunci(th, p.n), lama = KOSP.kv[kunci] || {};
  let berkas = null, catatan = "";
  try {
    if (typeof arsipUnggah === "function") {
      const h = await arsipUnggah(p.file, { jalur: ["12 KOSP", _kTh(th)], nama: `KOSP ${_kTh(th)} - ${_kNamaBab(p.n)} ${judul}.docx`, ket: "KOSP " + th });
      berkas = { id: h.id, url: h.url, nama: h.nama || p.file.name, ukuran: p.file.size };
    }
  } catch (e) { catatan = " (berkas asli tidak tersimpan ke Drive: " + (e.message || e) + ")"; }
  try {
    const h = await _kospSimpan(p.n, { judul, html, berkas, nama: p.file.name, catatan: "Unggah berkas " + p.file.name });
    KOSP.pending = null; void lama;
    closeModal(); toast(_kospPesanSimpan(h, p.n) + catatan, catatan ? "info" : "ok");
    kospBuka(p.n);
  } catch (e) { tombol.disabled = false; tombol.textContent = "💾 Simpan & Terbitkan"; toast("Gagal menyimpan: " + (e.message || e), "err"); }
}
function kospRiwayat(n) {
  const b = kospBab(KOSP.tahun, n), bawaan = (((window.KOSP_BAWAAN || {})[KOSP.tahun] || {}).bab || []).some((x) => x.no === n);
  openModal(`<h3>🕘 Riwayat ${_kE(_kNamaBab(n))} · TP ${_kE(KOSP.tahun)}</h3>
    <div class="kosp-riwayat">${(b.riwayat || []).map((r, i) => `<div><b>${_kE(_kTglTampil(r.t))}</b> · ${_kE(r.oleh || "-")}<br><small>${_kE(r.nama || "")}${r.catatan ? ` · ${_kE(r.catatan)}` : ""}${r.disahkan ? ` · disahkan ${_kE(r.disahkan)}` : ""}${i === 0 ? " · versi yang tampil" : ""}</small>${r.berkas ? ` <button class="btn btn-ghost btn-sm" onclick='arsipLihat(${JSON.stringify(r.berkas).replace(/'/g, "&#39;")})'>📎 Buka</button>` : ""}</div>`).join("") || "<p>Belum ada riwayat.</p>"}</div>
    ${bawaan && _kospBolehSahkan() ? `<div style="margin-top:12px"><button class="btn btn-outline" onclick="kospKembalikan(${n})">↺ Kembalikan ke Draf Bawaan</button></div>` : ""}`);
}
async function kospKembalikan(n) {
  const ok = await konfirmasiTema(`Tampilkan lagi draf bawaan untuk ${_kNamaBab(n)}? Isi unggahan disembunyikan, berkas aslinya tetap ada di Arsip Drive.`, { judul: "Kembalikan ke Draf", teksOk: "Kembalikan" });
  if (!ok) return;
  const kunci = _kKunci(KOSP.tahun, n);
  try { await _bspGabungUmum(kunci, { html: null, judul: null, berkas: null, diubah: null, oleh: null }); const l = KOSP.kv[kunci] || {}; KOSP.kv[kunci] = { riwayat: l.riwayat }; KOSP.indeks = null; toast("Dikembalikan ke draf bawaan", "ok"); kospBuka(n); }
  catch (e) { toast("Gagal: " + (e.message || e), "err"); }
}

// ── Tahun pelajaran baru ──
async function kospTahunBaru() {
  const akhir = kospDaftarTahun()[0], [a] = akhir.split("/").map(Number);
  const th = await promptTema("Tahun pelajaran baru", `${a + 1}/${a + 2}`, { judul: "KOSP Tahun Baru", ikon: "📚", teksOk: "Buat" });
  if (!th) return;
  if (!/^\d{4}\/\d{4}$/.test(th.trim())) return toast("Tulis seperti 2027/2028", "err");
  try {
    await _bspGabungUmum("bosp:kosp:info", { [th.trim()]: { dibuat: new Date().toISOString(), oleh: STATE.guruNama || "" } });
    KOSP.info[th.trim()] = { dibuat: new Date().toISOString() }; KOSP.tahun = th.trim(); KOSP.indeks = null;
    closeModal(); toast(`KOSP TP ${th.trim()} dibuat — isinya memakai tahun sebelumnya sampai diunggah ulang`, "ok"); kospBuka(0);
  } catch (e) { toast("Gagal: " + (e.message || e), "err"); }
}


// ══════════════════════════════════════════════════════════════════════════════
//  TATA KELOLA KOSP
//  • Penanggung jawab (PJ) per bab + Pengesah (bawaan: Kepala PKBM) → kv bosp:kosp:pj { pengesah, bab: { n: [guruId] } }
//  • PJ mengubah bab (sunting di aplikasi / unggah .docx) → tersimpan sebagai USULAN (bab yang tampil tidak berubah)
//    → Pengesah melihat perbedaannya lalu Sahkan / Kembalikan dengan catatan. Pengesah & Admin utama langsung terbit.
//  • Teks <mark class="kd-isi"> = bagian yang PERLU DIISI; Pemeriksa Kelengkapan menghitungnya per bab.
//  • Pengesahan KOSP per tahun pelajaran: bosp:kosp:info { "<TP>": { sah: { oleh, t } } }
// ══════════════════════════════════════════════════════════════════════════════
const _kospAdminUtama = () => typeof isAdmin === "function" && isAdmin() && !(typeof isAdminKedua === "function" && isAdminKedua());
function _kospIdKepala() {
  try { const a = (typeof SOP !== "undefined" && SOP.pj && SOP.pj.kepala) || []; if (a[0]) return a[0]; } catch (e) {}
  try { return (KT.peran.kepala || [])[0] || null; } catch (e) { return null; }
}
const _kospPengesahId = () => (KOSP.pj && KOSP.pj.pengesah) || _kospIdKepala();
const _kospBolehSahkan = () => _kospAdminUtama() || (!!STATE.guruId && STATE.guruId === _kospPengesahId());
const _kospPjBab = (n) => (((KOSP.pj && KOSP.pj.bab) || {})[n] || []).filter(Boolean);
const _kospBolehUbah = (n) => _kospBolehSahkan() || _kospPjBab(n).includes(STATE.guruId);
function _kospBolehKelola() { return _kospBolehSahkan() || KOSP_URUT.some((n) => _kospPjBab(n).includes(STATE.guruId)); }
const _kospGuru = (id) => (typeof LOOKUP !== "undefined" && (LOOKUP.guruAll || []).find((x) => x.id === id)) || null;
const _kospNama = (id) => { const g = _kospGuru(id); return g ? String(g.nama).replace(/\s*,.*$/, "") : "—"; };
const _kospTPKini = () => { const d = new Date(), y = d.getFullYear(); return d.getMonth() >= 6 ? `${y}/${y + 1}` : `${y - 1}/${y}`; };
const _kospUsulan = (n, th = KOSP.tahun) => (KOSP.kv[_kKunci(th, n)] || {}).usulan || null;
const _kospJmlIsi = (html) => (String(html || "").match(/class="kd-isi"/g) || []).length;
const _kospSah = (th = KOSP.tahun) => ((KOSP.info || {})[th] || {}).sah || null;

// Simpan perubahan bab: Pengesah/Admin → terbit; PJ → usulan
async function _kospSimpan(n, d) {
  const th = KOSP.tahun, kunci = _kKunci(th, n), lama = KOSP.kv[kunci] || {}, kini = new Date().toISOString(), oleh = STATE.guruNama || "";
  if (_kospBolehSahkan()) {
    const riwayat = [{ t: kini, oleh, nama: d.nama || "Disunting di aplikasi", berkas: d.berkas || null, catatan: d.catatan || "" }, ...(lama.riwayat || [])].slice(0, 15);
    const pot = { judul: d.judul, html: d.html, berkas: d.berkas || lama.berkas || null, diubah: kini, oleh, riwayat, usulan: null, disahkan: { oleh, t: kini } };
    await _bspGabungUmum(kunci, pot);
    KOSP.kv[kunci] = { ...lama, ...pot }; delete KOSP.kv[kunci].usulan; KOSP.indeks = null;
    if (typeof _rgLog === "function") _rgLog("kosp-terbit", { tahun: th, bab: n, judul: d.judul });
    return "terbit";
  }
  const usulan = { judul: d.judul, html: d.html, berkas: d.berkas || null, nama: d.nama || "", catatan: d.catatan || "", oleh, olehId: STATE.guruId, t: kini };
  await _bspGabungUmum(kunci, { usulan, tolak: null });
  KOSP.kv[kunci] = { ...lama, usulan }; delete KOSP.kv[kunci].tolak;
  if (typeof _rgLog === "function") _rgLog("kosp-usulan", { tahun: th, bab: n, judul: d.judul });
  return "usulan";
}
const _kospPesanSimpan = (h, n) => (h === "terbit" ? `${_kNamaBab(n)} diperbarui & langsung terbit` : `Usulan ${_kNamaBab(n)} terkirim — menunggu pengesahan ${_kospNama(_kospPengesahId())}`);

// ── perbedaan isi (per paragraf / tabel) ──
function _kospBlok2(html) { const d = document.createElement("div"); d.innerHTML = html || ""; return [...d.children].map((el) => ({ html: el.outerHTML, t: el.textContent.replace(/\s+/g, " ").trim() })); }
function _kospHtmlBeda(lamaHtml, baruHtml) {
  const a = _kospBlok2(lamaHtml), b = _kospBlok2(baruHtml), n = a.length, m = b.length;
  if (n * m > 400000) return { html: `<p class="kosp-ket">Isi terlalu panjang untuk dibandingkan — berikut isi usulan.</p>${baruHtml}`, tambah: m, hapus: n };
  const L = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) L[i][j] = a[i].t === b[j].t ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
  const ops = []; let i = 0, j = 0;
  while (i < n && j < m) { if (a[i].t === b[j].t) { ops.push(["=", b[j]]); i++; j++; } else if (L[i + 1][j] >= L[i][j + 1]) ops.push(["-", a[i++]]); else ops.push(["+", b[j++]]); }
  while (i < n) ops.push(["-", a[i++]]); while (j < m) ops.push(["+", b[j++]]);
  let out = "", sama = [], tambah = 0, hapus = 0;
  const lepas = () => { if (!sama.length) return; if (sama.length <= 2) out += sama.map((x) => `<div class="kosp-sama">${x.html}</div>`).join(""); else out += `<div class="kosp-sama">${sama[0].html}</div><div class="kosp-lewat">… ${sama.length - 2} bagian tidak berubah …</div><div class="kosp-sama">${sama[sama.length - 1].html}</div>`; sama = []; };
  ops.forEach(([o, x]) => { if (o === "=") sama.push(x); else { lepas(); if (o === "+") { tambah++; out += `<div class="kosp-tambah-b">${x.html}</div>`; } else { hapus++; out += `<div class="kosp-hapus-b">${x.html}</div>`; } } });
  lepas();
  return { html: out || "<p>Tidak ada perubahan isi.</p>", tambah, hapus };
}
function kospLihatUsulan(n) {
  const u = _kospUsulan(n); if (!u) return;
  const b = kospBab(KOSP.tahun, n), beda = _kospHtmlBeda(b.html, u.html);
  openModal(`<h3>📥 Usulan ${_kE(_kNamaBab(n))} · ${_kE(u.judul)}</h3>
    <div class="kosp-u-info"><span>👤 ${_kE(u.oleh)}</span><span>🕘 ${_kE(_kTglTampil(u.t))}</span><span class="tambah">+${beda.tambah} ditambah/diubah</span><span class="hapus">−${beda.hapus} dihapus/diganti</span>${u.nama ? `<span>📄 ${_kE(u.nama)}</span>` : ""}</div>
    ${u.catatan ? `<p class="kosp-catatan-u"><b>Catatan perubahan:</b> ${_kE(u.catatan)}</p>` : ""}
    <p class="kosp-ket"><span class="kosp-leg tambah">hijau = baru</span> <span class="kosp-leg hapus">merah = dihapus</span> · bagian yang sama diringkas.</p>
    <div class="kosp-u-pratinjau kosp-isi kosp-beda">${beda.html}</div>
    <div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap">
      ${_kospBolehSahkan() ? `<button class="btn btn-accent" style="flex:2" onclick="kospSahkanUsulan(${n})">✅ Sahkan & Terbitkan</button><button class="btn btn-outline" style="flex:1" onclick="kospTolakUsulan(${n})">↩️ Kembalikan</button>` : ""}
      ${u.olehId === STATE.guruId ? `<button class="btn btn-outline" style="flex:1" onclick="closeModal();kospSunting(${n})">✏️ Lanjut Sunting</button><button class="btn btn-ghost" style="flex:1" onclick="kospBatalUsulan(${n})">Batalkan Usulan</button>` : ""}
      <button class="btn btn-ghost" style="flex:1" onclick="closeModal()">Tutup</button></div>`, { lebar: true });
}
async function kospSahkanUsulan(n) {
  const kunci = _kKunci(KOSP.tahun, n), lama = KOSP.kv[kunci] || {}, u = lama.usulan; if (!u || !_kospBolehSahkan()) return;
  const kini = new Date().toISOString(), saya = STATE.guruNama || "";
  const riwayat = [{ t: kini, oleh: u.oleh, nama: u.nama || "Usulan disunting di aplikasi", berkas: u.berkas || null, catatan: u.catatan || "", disahkan: saya }, ...(lama.riwayat || [])].slice(0, 15);
  const pot = { judul: u.judul, html: u.html, berkas: u.berkas || lama.berkas || null, diubah: kini, oleh: u.oleh, riwayat, usulan: null, disahkan: { oleh: saya, t: kini } };
  try {
    await _bspGabungUmum(kunci, pot); KOSP.kv[kunci] = { ...lama, ...pot }; delete KOSP.kv[kunci].usulan; KOSP.indeks = null;
    if (typeof _rgLog === "function") _rgLog("kosp-sahkan", { tahun: KOSP.tahun, bab: n, dari: u.oleh });
    closeModal(); toast(`${_kNamaBab(n)} disahkan & terbit`, "ok"); kospBuka(n);
  } catch (e) { toast("Gagal: " + (e.message || e), "err"); }
}
async function kospTolakUsulan(n) {
  const kunci = _kKunci(KOSP.tahun, n), u = (KOSP.kv[kunci] || {}).usulan; if (!u) return;
  const catatan = await promptTema("Alasan / bagian yang perlu diperbaiki", "", { judul: "Kembalikan Usulan", ikon: "↩️", teksOk: "Kembalikan" });
  if (!catatan || !String(catatan).trim()) return;
  const tolak = { oleh: STATE.guruNama || "", t: new Date().toISOString(), catatan: String(catatan).trim(), untuk: u.olehId, judul: u.judul };
  try {
    // usulan tetap disimpan agar pengusul bisa melanjutkan, tetapi ditandai dikembalikan
    await _bspGabungUmum(kunci, { usulan: null, tolak, simpanUsulan: { ...u } });
    const l = KOSP.kv[kunci] || {}; delete l.usulan; KOSP.kv[kunci] = { ...l, tolak, simpanUsulan: { ...u } };
    toast("Usulan dikembalikan ke " + u.oleh, "ok"); closeModal(); kospBuka(n);
  } catch (e) { toast("Gagal: " + (e.message || e), "err"); }
}
async function kospBatalUsulan(n) {
  const ok = await konfirmasiTema(`Batalkan usulan ${_kNamaBab(n)}? Isi yang tampil tidak berubah.`, { judul: "Batalkan Usulan", teksOk: "Batalkan" }); if (!ok) return;
  const kunci = _kKunci(KOSP.tahun, n);
  try { await _bspGabungUmum(kunci, { usulan: null }); const l = KOSP.kv[kunci] || {}; delete l.usulan; closeModal(); toast("Usulan dibatalkan", "ok"); kospBuka(n); } catch (e) { toast("Gagal: " + (e.message || e), "err"); }
}
async function kospAdopsi(n) {
  const daftar = kospDaftarTahun(), lalu = daftar.filter((t) => t < KOSP.tahun)[0]; if (!lalu) return toast("Belum ada tahun pelajaran sebelumnya", "info");
  await Promise.all(KOSP_DATA_TAHUN.filter((t) => t <= lalu).map(_kospMuatBawaan));
  const b = kospBab(lalu, n); if (!b.html) return toast(`${_kNamaBab(n)} TP ${lalu} kosong`, "info");
  const ok = await konfirmasiTema(`Pakai isi ${_kNamaBab(n)} dari TP ${lalu} (versi terakhir yang terbit) untuk TP ${KOSP.tahun}? Tahun pelajaran otomatis diganti ke ${KOSP.tahun}.`, { judul: "Adopsi dari Tahun Lalu", teksOk: "Pakai" });
  if (!ok) return;
  const html = b.html.split(lalu).join(KOSP.tahun);
  try { const h = await _kospSimpan(n, { judul: b.judul, html, nama: `Diadopsi dari TP ${lalu}`, catatan: `Adopsi isi TP ${lalu}` }); closeModal(); toast(_kospPesanSimpan(h, n), "ok"); kospBuka(n); }
  catch (e) { toast("Gagal: " + (e.message || e), "err"); }
}

// ── PENYUNTING di aplikasi ──
const KOSP_ED_ALAT = [
  ["h2", "Judul Bagian", "H2"], ["h3", "Sub Bagian", "H3"], ["h4", "Sub Kecil", "H4"], ["p", "Paragraf", "¶"], ["|"],
  ["b", "Tebal", "<b>B</b>"], ["i", "Miring", "<i>I</i>"], ["ul", "Daftar Titik", "• ≡"], ["ol", "Daftar Nomor", "1. ≡"], ["|"],
  ["tabel", "Sisipkan Tabel 3×3", "▦ Tabel"], ["baris", "Tambah baris di bawah baris ini", "+ Baris"], ["hapusbaris", "Hapus baris ini", "− Baris"], ["|"],
  ["isi", "Tandai sebagai Perlu Diisi", "🟨 Perlu Diisi"], ["sudah", "Hapus tanda kuning (sudah diisi)", "✓ Sudah Diisi"], ["|"],
  ["pd", "Sisipkan tabel jumlah peserta didik dari aplikasi", "📊 Data Peserta Didik"], ["tutor", "Sisipkan tabel jumlah tutor dari aplikasi", "📊 Data Tutor"], ["|"],
  ["undo", "Urungkan", "↶"], ["redo", "Ulangi", "↷"], ["bersih", "Hapus format", "⌫ Format"],
];
function kospSunting(n) {
  if (!_kospBolehUbah(n)) return toast("Hanya penanggung jawab bab ini dan Kepala PKBM yang bisa menyunting", "err");
  const kunci = _kKunci(KOSP.tahun, n), rec = KOSP.kv[kunci] || {}, u = rec.usulan, simpan = rec.simpanUsulan, b = kospBab(KOSP.tahun, n);
  const sumber = u && u.olehId === STATE.guruId ? u : simpan && simpan.olehId === STATE.guruId && rec.tolak ? simpan : null;
  const html = sumber ? sumber.html : b.html, judul = sumber ? sumber.judul : b.judul;
  const kd = `kosp:draf:${_kTh(KOSP.tahun)}:${n}`; let draf = null; try { draf = JSON.parse(localStorage.getItem(kd) || "null"); } catch (e) {}
  const sah = _kospBolehSahkan();
  openModal(`<div class="kosp-ed-wadah"><h3>✏️ Sunting ${_kE(_kNamaBab(n))} · TP ${_kE(KOSP.tahun)}</h3>
    ${sah ? "" : `<p class="kosp-ket">Perubahan Anda dikirim sebagai <b>usulan</b> kepada <b>${_kE(_kospNama(_kospPengesahId()))}</b> (pengesah). Isi yang dibaca guru lain tidak berubah sampai disahkan.</p>`}
    ${draf && draf.html && draf.html !== html ? `<div class="kosp-banner kuning" id="kosp-ed-draf">💾 Ada suntingan yang belum tersimpan (${_kE(_kTglTampil(draf.t))}). <button class="btn btn-sm btn-accent" onclick="kospEdPulihkan(${n})">Pulihkan</button> <button class="btn btn-sm btn-ghost" onclick="localStorage.removeItem('${kd}');this.parentElement.remove()">Buang</button></div>` : ""}
    <div class="field"><label class="form-label">Judul Bab</label><input id="kosp-ed-judul" class="input" value="${_kE(judul)}"></div>
    <div class="kosp-ed-alat">${KOSP_ED_ALAT.map((x) => (x[0] === "|" ? `<i></i>` : `<button type="button" title="${_kE(x[1])}" onmousedown="event.preventDefault()" onclick="kospEd('${x[0]}')">${x[2]}</button>`)).join("")}</div>
    <div id="kosp-ed" class="kosp-isi kosp-ed" contenteditable="true" spellcheck="false">${html}</div>
    <div class="field" style="margin-top:10px"><label class="form-label">Catatan perubahan ${sah ? "(boleh kosong)" : "(wajib — apa yang diubah & alasannya)"}</label><input id="kosp-ed-catatan" class="input" placeholder="mis. memperbarui jumlah peserta didik TP 2027/2028"></div>
    <div style="display:flex;gap:10px;margin-top:10px"><button class="btn btn-outline" style="flex:1" onclick="kospEdTutup(${n})">Batal</button><button id="kosp-ed-simpan" class="btn btn-accent" style="flex:2" onclick="kospSimpanSunting(${n})">${sah ? "💾 Simpan & Terbitkan" : "📤 Kirim Usulan"}</button></div></div>`, { lebar: true });
  const ed = document.getElementById("kosp-ed");
  ed.addEventListener("keyup", _kospEdIngatPosisi); ed.addEventListener("mouseup", _kospEdIngatPosisi);
  clearInterval(KOSP.edIv);
  KOSP.edIv = setInterval(() => { const e = document.getElementById("kosp-ed"); if (!e) return clearInterval(KOSP.edIv); try { localStorage.setItem(kd, JSON.stringify({ html: e.innerHTML, judul: document.getElementById("kosp-ed-judul").value, t: new Date().toISOString() })); } catch (x) {} }, 5000);
}
function kospEdPulihkan(n) { try { const d = JSON.parse(localStorage.getItem(`kosp:draf:${_kTh(KOSP.tahun)}:${n}`) || "null"); if (!d) return; document.getElementById("kosp-ed").innerHTML = d.html; if (d.judul) document.getElementById("kosp-ed-judul").value = d.judul; document.getElementById("kosp-ed-draf")?.remove(); toast("Suntingan dipulihkan", "ok"); } catch (e) {} }
async function kospEdTutup(n) { const ok = await konfirmasiTema("Tutup penyunting? Suntingan yang belum disimpan tetap tersimpan sementara di perangkat ini dan bisa dipulihkan.", { judul: "Tutup Penyunting", teksOk: "Tutup" }); if (ok) { clearInterval(KOSP.edIv); closeModal(); } else kospSunting(n); }
function _kospEdIngatPosisi() { const s = window.getSelection(), ed = document.getElementById("kosp-ed"); if (s && s.rangeCount && ed && ed.contains(s.anchorNode)) KOSP.edRange = s.getRangeAt(0).cloneRange(); }
function _kospEdPulihPosisi() { const ed = document.getElementById("kosp-ed"); if (!ed) return; ed.focus(); if (KOSP.edRange && ed.contains(KOSP.edRange.startContainer)) { const s = window.getSelection(); s.removeAllRanges(); s.addRange(KOSP.edRange); } }
const _kospEdSel = (tag) => { const s = window.getSelection(); if (!s.rangeCount) return null; let n = s.anchorNode; while (n && n.id !== "kosp-ed") { if (n.nodeType === 1 && n.matches(tag)) return n; n = n.parentNode; } return null; };
async function kospEd(c) {
  const ed = document.getElementById("kosp-ed"); if (!ed) return;
  if (!ed.contains(document.activeElement) && c !== "pd" && c !== "tutor") _kospEdPulihPosisi();
  const x = (k, v) => document.execCommand(k, false, v);
  if (/^(h2|h3|h4|p)$/.test(c)) x("formatBlock", c.toUpperCase());
  else if (c === "b") x("bold"); else if (c === "i") x("italic");
  else if (c === "ul") x("insertUnorderedList"); else if (c === "ol") x("insertOrderedList");
  else if (c === "undo" || c === "redo") x(c); else if (c === "bersih") x("removeFormat");
  else if (c === "tabel") x("insertHTML", `<div class="kd-tabel"><table><tr><td><b>Kolom 1</b></td><td><b>Kolom 2</b></td><td><b>Kolom 3</b></td></tr><tr><td>…</td><td>…</td><td>…</td></tr><tr><td>…</td><td>…</td><td>…</td></tr></table></div><p><br></p>`);
  else if (c === "baris" || c === "hapusbaris") { const tr = _kospEdSel("tr"); if (!tr) return toast("Letakkan kursor di dalam baris tabel dulu", "info"); if (c === "baris") { const b = tr.cloneNode(true); b.querySelectorAll("td,th").forEach((td) => { td.innerHTML = "…"; }); tr.after(b); } else tr.remove(); }
  else if (c === "isi") {
    const s = window.getSelection(); if (!s.rangeCount) return;
    const r = s.getRangeAt(0), m = document.createElement("mark"); m.className = "kd-isi";
    if (r.collapsed) { m.textContent = "Perlu diisi: …"; r.insertNode(m); } else { m.appendChild(r.extractContents()); r.insertNode(m); }
  } else if (c === "sudah") { const m = _kospEdSel("mark.kd-isi"); if (!m) return toast("Letakkan kursor di dalam teks kuning dulu", "info"); m.replaceWith(...m.childNodes); }
  else if (c === "pd" || c === "tutor") {
    _kospEdIngatPosisi(); toast("Mengambil data dari aplikasi…");
    try { const html = c === "pd" ? await _kospDataPeserta() : await _kospDataTutor(); _kospEdPulihPosisi(); x("insertHTML", html + "<p><br></p>"); toast("Tabel data disisipkan — periksa lalu sesuaikan bila perlu", "ok"); }
    catch (e) { toast("Gagal mengambil data: " + (e.message || e), "err"); }
  }
  _kospEdIngatPosisi();
}
function _kospBersihEdit(html) {
  const t = document.createElement("template"); t.innerHTML = html; const akar = t.content;
  akar.querySelectorAll("script,style,iframe,object,embed,link,meta,form,input,button,textarea,select").forEach((x) => x.remove());
  akar.querySelectorAll("*").forEach((el) => {
    [...el.attributes].forEach((a) => {
      const n = a.name.toLowerCase(); let ok = false;
      if (n === "class") { const k = a.value.split(/\s+/).filter((c) => /^kd-(li|isi|gambar|rumus|tabel)$/.test(c)); if (k.length) { el.setAttribute("class", k.join(" ")); ok = true; } }
      else if (/^(td|th)$/i.test(el.tagName) && /^(colspan|rowspan)$/.test(n)) ok = true;
      else if (el.tagName === "IMG" && /^(src|alt|width|height)$/.test(n) && (n !== "src" || /^data:image\//i.test(a.value))) ok = true;
      if (!ok) el.removeAttribute(a.name);
    });
  });
  akar.querySelectorAll("span,font,a").forEach((s) => s.replaceWith(...s.childNodes));
  akar.querySelectorAll("mark:not(.kd-isi)").forEach((s) => s.replaceWith(...s.childNodes));
  akar.querySelectorAll("div:not(.kd-tabel)").forEach((d) => { if (d.querySelector("table,p,h2,h3,h4,ul,ol")) d.replaceWith(...d.childNodes); else { const p = document.createElement("p"); p.innerHTML = d.innerHTML; d.replaceWith(p); } });
  akar.querySelectorAll("table").forEach((tb) => { const p = tb.parentElement; if (!(p && p.classList && p.classList.contains("kd-tabel"))) { const w = document.createElement("div"); w.className = "kd-tabel"; tb.before(w); w.appendChild(tb); } });
  akar.querySelectorAll("p").forEach((p) => { if (!p.textContent.trim() && !p.querySelector("img")) p.remove(); });
  const d = document.createElement("div"); d.appendChild(akar); return d.innerHTML.trim();
}
async function kospSimpanSunting(n) {
  const ed = document.getElementById("kosp-ed"); if (!ed) return;
  const judul = (document.getElementById("kosp-ed-judul").value || "").trim() || KOSP_BAB_BAKU[n], catatan = (document.getElementById("kosp-ed-catatan").value || "").trim();
  if (!_kospBolehSahkan() && !catatan) { toast("Tulis catatan perubahan dulu supaya pengesah tahu apa yang diubah", "err"); document.getElementById("kosp-ed-catatan").focus(); return; }
  const html = _kospBersihEdit(ed.innerHTML);
  if (html.length > 4.5 * 1024 * 1024) return toast("Isi bab terlalu besar (terlalu banyak gambar)", "err");
  const tb = document.getElementById("kosp-ed-simpan"); tb.disabled = true; tb.textContent = "Menyimpan…";
  try {
    const h = await _kospSimpan(n, { judul, html, nama: "Disunting di aplikasi", catatan });
    clearInterval(KOSP.edIv); try { localStorage.removeItem(`kosp:draf:${_kTh(KOSP.tahun)}:${n}`); } catch (e) {}
    closeModal(); toast(_kospPesanSimpan(h, n), "ok"); kospBuka(n);
  } catch (e) { tb.disabled = false; tb.textContent = _kospBolehSahkan() ? "💾 Simpan & Terbitkan" : "📤 Kirim Usulan"; toast("Gagal menyimpan: " + (e.message || e), "err"); }
}

// ── DATA LAPANGAN dari aplikasi ──
const _kospTingkat = (nm) => { const m = String(nm || "").toUpperCase().match(/\b(XII|XI|X|IX|VIII|VII|VI|V|IV|III|II|I|1[0-2]|[1-9])\b/); if (!m) return null; const r = { I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6, VII: 7, VIII: 8, IX: 9, X: 10, XI: 11, XII: 12 }; return r[m[1]] || +m[1]; };
const _kospFase = (k) => (k == null ? null : k <= 2 ? "A" : k <= 4 ? "B" : k <= 6 ? "C" : k <= 9 ? "D" : k <= 11 ? "E" : "F");
async function _kospDataPeserta() {
  const [s, k, bi] = await Promise.all([
    supaSemua.from("siswa").select("id,nik,kelas_id,ruang_id").eq("status_aktif", true),
    supaSemua.from("kelas").select("id,nama_kelas,ruang_id"),
    supaSemua.from("kuliah_pengaturan").select("kunci,nilai").eq("ruang_id", "*").like("kunci", "bosp:induk:%"),
  ]);
  if (s.error) throw s.error;
  const tambah = {}; (bi.data || []).forEach((r) => { tambah[r.kunci.split(":").pop()] = r.nilai || {}; });
  const kl = Object.fromEntries((k.data || []).map((x) => [x.id, x.nama_kelas]));
  const jk = (x) => { const t = tambah[x.id] || {}; if (t.jk === "L" || t.jk === "P") return t.jk; const nk = String(x.nik || "").replace(/\D/g, ""); if (nk.length === 16) return +nk.slice(6, 8) > 40 ? "P" : "L"; return x.ruang_id === "Pa" ? "L" : x.ruang_id === "Pi" ? "P" : "?"; };
  const F = { A: "Fase A (Kelas 1 dan 2)", B: "Fase B (Kelas 3 dan 4)", C: "Fase C (Kelas 5 dan 6)", D: "Fase D (Kelas 7, 8 dan 9)", E: "Fase E (Kelas 10 dan 11)", F: "Fase F (Kelas 12)" };
  const h = {}; let tanpa = 0, ragu = 0;
  (s.data || []).filter((x) => ["A", "Pa", "Pi"].includes(x.ruang_id)).forEach((x) => { const f = _kospFase(_kospTingkat(kl[x.kelas_id])); if (!f) { tanpa++; return; } const j = jk(x); if (j === "?") ragu++; const o = (h[f] = h[f] || { L: 0, P: 0, "?": 0 }); o[j]++; });
  let tL = 0, tP = 0, tQ = 0;
  const baris = Object.keys(F).map((f, i) => { const o = h[f] || { L: 0, P: 0, "?": 0 }; tL += o.L; tP += o.P; tQ += o["?"]; return `<tr><td>${i + 1}.</td><td>${F[f]}</td><td>${o.L}</td><td>${o.P}</td><td>${o.L + o.P + o["?"]}</td></tr>`; }).join("");
  const tgl = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  return `<div class="kd-tabel"><table><tr><td><b>No</b></td><td><b>Fase</b></td><td><b>L</b></td><td><b>P</b></td><td><b>Jumlah</b></td></tr>${baris}<tr><td colspan="2"><b>Jumlah</b></td><td><b>${tL}</b></td><td><b>${tP}</b></td><td><b>${tL + tP + tQ}</b></td></tr></table></div>
    <p>Sumber: data peserta didik aktif di aplikasi PKBM per ${tgl}.${tQ ? ` <mark class="kd-isi">${tQ} peserta didik belum diketahui jenis kelaminnya — lengkapi di Buku Induk.</mark>` : ""}${tanpa ? ` <mark class="kd-isi">${tanpa} peserta didik belum punya kelas.</mark>` : ""}</p>`;
}
async function _kospDataTutor() {
  const g = await supaSemua.from("guru").select("*").eq("status_aktif", true); if (g.error) throw g.error;
  try { if (typeof KT !== "undefined" && (!KT.atur || !Object.keys(KT.atur.jk || {}).length) && typeof _ktAmbil === "function" && typeof KT_ATUR !== "undefined") { const a = await _ktAmbil(KT_ATUR); if (a) KT.atur = { peran: {}, jk: {}, ...a }; } } catch (e) {}
  const jk = (x) => (typeof _ktJk === "function" ? _ktJk(x) : "?");
  const R = { A: "Paket A", Pa: "Paket B & C Putra", Pi: "Paket B & C Putri", Pg: "Pengelola" }, h = {};
  (g.data || []).forEach((x) => { const r = (typeof rgRuangUtama === "function" ? rgRuangUtama(x) : x.ruang_utama) || "?"; const o = (h[r] = h[r] || { L: 0, P: 0 }); o[jk(x) === "P" ? "P" : "L"]++; });
  let tL = 0, tP = 0;
  const baris = Object.keys(R).concat(Object.keys(h).filter((r) => !R[r])).filter((r) => h[r]).map((r) => { const o = h[r]; tL += o.L; tP += o.P; return `<tr><td>${R[r] || "Belum ditentukan"}</td><td>${o.L}</td><td>${o.P}</td><td>${o.L + o.P}</td></tr>`; }).join("");
  return `<div class="kd-tabel"><table><tr><td><b>Jenjang (Ruang Utama)</b></td><td><b>L</b></td><td><b>P</b></td><td><b>Jumlah</b></td></tr>${baris}<tr><td><b>Jumlah</b></td><td><b>${tL}</b></td><td><b>${tP}</b></td><td><b>${tL + tP}</b></td></tr></table></div>
    <p>Sumber: Data Guru aktif di aplikasi per ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}. <mark class="kd-isi">Periksa: data ini mencakup semua akun guru/tenaga kependidikan aktif; kualifikasi (SMA/S1/S2) diisi manual.</mark></p>`;
}

// ── PEMERIKSA KELENGKAPAN (komponen KOSP & bahan akreditasi) ──
const KOSP_CEK = [
  ["Bagian Awal", "Kata pengantar", /kata pengantar/i], ["Bagian Awal", "Lembar pengesahan", /lembar pengesahan/i], ["Bagian Awal", "Tim pengembang kurikulum", /tim pengembang/i],
  ["Karakteristik", "Karakteristik peserta didik", /karakteristik peserta didik/i], ["Karakteristik", "Pendidik & tenaga kependidikan", /tenaga kependidikan/i],
  ["Karakteristik", "Sarana & prasarana", /sarana dan prasarana/i], ["Karakteristik", "Lingkungan & kemitraan", /kemitraan/i], ["Karakteristik", "Refleksi Rapor Pendidikan", /refleksi rapor pendidikan/i],
  ["Arah", "Visi", /visi satuan pendidikan/i], ["Arah", "Misi", /misi satuan pendidikan/i], ["Arah", "Tujuan", /tujuan satuan pendidikan/i], ["Arah", "Profil lulusan", /profil lulusan/i],
  ["Pengorganisasian", "Struktur kurikulum Paket A", /total skk paket a/i], ["Pengorganisasian", "Struktur kurikulum Paket B", /total skk paket b/i], ["Pengorganisasian", "Struktur kurikulum Paket C", /total skk paket c/i],
  ["Pengorganisasian", "Program Paket B & C Putra", /program paket [bc] \(putra\)/i], ["Pengorganisasian", "Kurikulum kekhasan (tahfizh)", /kekhasan tahfizh/i],
  ["Pengorganisasian", "Kokurikuler", /kokurikuler/i], ["Pengorganisasian", "Ekstrakurikuler", /ekstrakurikuler/i], ["Pengorganisasian", "Pengaturan beban belajar", /beban belajar/i],
  ["Pengorganisasian", "Kriteria kenaikan kelas", /kriteria kenaikan kelas/i], ["Pengorganisasian", "Kriteria kelulusan", /kriteria kelulusan/i], ["Pengorganisasian", "Kalender pendidikan", /kalender pendidikan/i],
  ["Perencanaan", "Contoh ATP", /alur tujuan pembelajaran/i], ["Perencanaan", "Contoh modul ajar", /modul ajar/i],
  ["Pendampingan & Evaluasi", "Pendampingan (IHT, coaching, supervisi)", /supervisi/i], ["Pendampingan & Evaluasi", "Evaluasi kurikulum", /evaluasi kurikulum/i],
  ["Pendampingan & Evaluasi", "Pengembangan profesional", /pengembangan profesional/i], ["Pendampingan & Evaluasi", "Rencana tindak lanjut", /tindak lanjut/i],
];
function _kospPeriksa(th = KOSP.tahun) {
  const bab = kospSemuaBab(th), blok = [];
  bab.forEach((b) => { const d = document.createElement("div"); d.innerHTML = b.html || ""; [...d.children].forEach((el) => blok.push({ n: b.no, el, t: el.textContent, h: /^H[234]$/.test(el.tagName) ? +el.tagName[1] : 0 })); });
  const hasil = KOSP_CEK.map(([grup, nama, re]) => {
    let i = blok.findIndex((x) => x.h && re.test(x.t)); if (i < 0) i = blok.findIndex((x) => re.test(x.t)); if (i < 0) return { grup, nama, st: "kosong" };
    let isi = blok[i].el.querySelector && blok[i].el.querySelector("mark.kd-isi");
    if (!isi && blok[i].h) for (let k = i + 1; k < blok.length && !(blok[k].h && blok[k].h <= blok[i].h) && blok[k].n === blok[i].n; k++) if (blok[k].el.querySelector && (blok[k].el.matches("mark.kd-isi") || blok[k].el.querySelector("mark.kd-isi"))) { isi = true; break; }
    return { grup, nama, st: isi ? "isi" : "ok", n: blok[i].n };
  });
  const isiBab = bab.map((b) => ({ n: b.no, jml: _kospJmlIsi(b.html) })).filter((x) => x.jml);
  return { hasil, isiBab, ok: hasil.filter((x) => x.st === "ok").length, total: hasil.length, titik: isiBab.reduce((a, x) => a + x.jml, 0) };
}
function _kospHtmlPeriksa() {
  const p = _kospPeriksa(), persen = Math.round((p.ok / p.total) * 100), grup = [...new Set(p.hasil.map((x) => x.grup))];
  return `<details class="kosp-periksa" ${persen < 100 ? "open" : ""}><summary><span class="kosp-cincin" style="--p:${persen}"><b>${persen}%</b></span><span><b>Kelengkapan KOSP TP ${_kE(KOSP.tahun)}</b><small>${p.ok} dari ${p.total} komponen lengkap · ${p.titik} titik bertanda kuning masih perlu diisi</small></span></summary>
    <div class="kosp-cek-grid">${grup.map((g) => `<div class="kosp-cek-grup"><b>${_kE(g)}</b>${p.hasil.filter((x) => x.grup === g).map((x) => `<a class="kosp-cek ${x.st}" ${x.n ? `onclick="kospBuka(${x.n})"` : ""}><i>${x.st === "ok" ? "✓" : x.st === "isi" ? "!" : "✕"}</i>${_kE(x.nama)}<small>${x.st === "ok" ? "" : x.st === "isi" ? "perlu dilengkapi" : "belum ada"}</small></a>`).join("")}</div>`).join("")}</div>
    ${p.isiBab.length ? `<div class="kosp-cek-isi"><b>Titik kuning per bab:</b> ${p.isiBab.map((x) => `<button class="kosp-lbl-btn" onclick="kospBuka(${x.n},{isi:true})">${_kE(_kNamaBab(x.n))} <span>${x.jml}</span></button>`).join("")}</div>` : ""}
    <p class="kosp-ket">Daftar ini mengikuti komponen Kurikulum Satuan Pendidikan (karakteristik satuan pendidikan; visi, misi & tujuan; pengorganisasian pembelajaran; perencanaan pembelajaran; pendampingan, evaluasi & pengembangan profesional) ditambah dokumen yang biasa diminta saat akreditasi. Cocokkan juga dengan instrumen akreditasi Program Pendidikan Kesetaraan yang berlaku.</p></details>`;
}

// ── KELOLA: PJ, pengesah, pengesahan TP, adopsi, tahun baru ──
function kospKelola() {
  if (!_kospBolehSahkan()) return toast("Kelola KOSP hanya untuk Kepala PKBM (pengesah) dan Admin utama", "err");
  KOSP.pjEdit = JSON.parse(JSON.stringify(KOSP.pj || {})); KOSP.pjEdit.bab = KOSP.pjEdit.bab || {}; if (!KOSP.pjEdit.pengesah) KOSP.pjEdit.pengesah = _kospIdKepala() || "";
  _kospGambarKelola();
}
const _kospGuruAktif = () => ((typeof LOOKUP !== "undefined" && LOOKUP.guruAll) || []).filter((g) => g.status_aktif !== false).sort((a, b) => String(a.nama).localeCompare(String(b.nama), "id"));
function _kospGambarKelola() {
  const e = KOSP.pjEdit, guru = _kospGuruAktif(), th = KOSP.tahun, sah = _kospSah(th), lalu = kospDaftarTahun().filter((t) => t < th)[0];
  const opsi = (pilih, kosong) => `${kosong ? `<option value="">${kosong}</option>` : ""}${guru.map((g) => `<option value="${g.id}" ${g.id === pilih ? "selected" : ""}>${_kE(String(g.nama).replace(/\s*,.*$/, ""))}</option>`).join("")}`;
  openModal(`<h3>⚙️ Kelola KOSP</h3>
    <div class="kosp-kelola-blok"><b>✍️ Pengesah KOSP</b><p class="kosp-ket">Yang berhak menyetujui setiap perubahan. Bawaan: Kepala PKBM.</p>
      <select class="input" onchange="KOSP.pjEdit.pengesah=this.value">${opsi(e.pengesah, "— Kepala PKBM (otomatis) —")}</select></div>
    <div class="kosp-kelola-blok"><b>👥 Penanggung Jawab (PJ) per Bab</b><p class="kosp-ket">Hanya PJ bab dan pengesah yang bisa menyunting atau mengunggah bab itu. Perubahan dari PJ masuk sebagai <b>usulan</b> dan baru tampil setelah disahkan, jadi isi KOSP tidak berubah tanpa sepengetahuan Kepala.</p>
      <button class="btn btn-sm btn-outline" onclick="kospPjOtomatis()">🪄 Isi Otomatis dari Jabatan (SOP & Tugas)</button>
      <div class="kosp-pj-daftar">${KOSP_URUT.map((n) => `<div class="kosp-pj-baris"><span class="kosp-pj-bab"><b>${_kDua(n)}</b>${_kE(KOSP_BAB_BAKU[n])}</span>
        <span class="kosp-pj-chip">${(e.bab[n] || []).map((id) => `<em>${_kE(_kospNama(id))}<button onclick="kospPjUbah(${n},'${id}',false)">✕</button></em>`).join("") || `<i>belum ada PJ</i>`}</span>
        <select onchange="if(this.value)kospPjUbah(${n},this.value,true)">${opsi("", "+ Tambah PJ")}</select></div>`).join("")}</div>
      <button class="btn btn-accent" style="margin-top:10px" onclick="kospPjSimpan()">💾 Simpan PJ & Pengesah</button></div>
    <div class="kosp-kelola-blok"><b>📅 TP ${_kE(th)}</b>
      <p class="kosp-ket">${sah ? `✅ Disahkan ${_kE(_kTglTampil(sah.t))} oleh ${_kE(sah.oleh)}.` : "Status: draf, belum disahkan."} KOSP memakai sistem <b>tahun pelajaran</b> (Juli–Juni), bukan tahun Masehi.</p>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${sah ? `<button class="btn btn-sm btn-outline" onclick="kospSahkanTP(false)">Buka Kembali sebagai Draf</button>` : `<button class="btn btn-sm btn-accent" onclick="kospSahkanTP(true)">✅ Sahkan KOSP TP ${_kE(th)}</button>`}
        ${lalu ? `<button class="btn btn-sm btn-outline" onclick="kospPilihAdopsi()">♻️ Adopsi Bab dari TP ${_kE(lalu)}</button>` : ""}
        <button class="btn btn-sm btn-outline" onclick="kospTahunBaru()">➕ Tahun Pelajaran Baru</button></div></div>
    <div style="text-align:right;margin-top:10px"><button class="btn btn-ghost" onclick="closeModal()">Tutup</button></div>`, { lebar: true });
}
function kospPjUbah(n, id, tambah) { const e = KOSP.pjEdit; const a = new Set(e.bab[n] || []); tambah ? a.add(id) : a.delete(id); e.bab[n] = [...a]; _kospGambarKelola(); }
function kospPjOtomatis() {
  const pj = (typeof SOP !== "undefined" && SOP.pj) || {}, ambil = (...k) => [...new Set(k.flatMap((x) => pj[x] || []))].filter((id) => { const g = _kospGuru(id); return g && g.status_aktif !== false; });
  const kep = ambil("kepala"), sek = ambil("sekretaris"), peny = ambil("peny@A", "peny@Pa", "peny@Pi");
  KOSP.pjEdit.bab = { 7: [...new Set([...kep, ...sek])], 1: [...new Set([...sek, ...peny])], 2: kep, 3: peny, 4: peny, 5: kep, 8: sek.length ? sek : kep, 6: sek.length ? sek : kep };
  _kospGambarKelola(); toast("PJ diisi dari jabatan di SOP & Tugas — periksa lalu Simpan", "info");
}
async function kospPjSimpan() {
  const e = KOSP.pjEdit;
  try { await _bspGabungUmum("bosp:kosp:pj", { pengesah: e.pengesah || null, bab: e.bab, diubah: new Date().toISOString(), oleh: STATE.guruNama || "" }); KOSP.pj = { ...e }; toast("PJ & pengesah KOSP disimpan", "ok"); closeModal(); _kospRender(); }
  catch (x) { toast("Gagal: " + (x.message || x), "err"); }
}
async function kospSahkanTP(sahkan) {
  const th = KOSP.tahun, p = _kospPeriksa(th), menunggu = KOSP_URUT.filter((n) => _kospUsulan(n));
  const pesan = sahkan ? `Sahkan KOSP TP ${th}?${p.titik ? `\n\n⚠️ Masih ada ${p.titik} titik kuning "perlu diisi".` : ""}${menunggu.length ? `\n⚠️ ${menunggu.length} usulan belum diputuskan.` : ""}` : `Buka kembali KOSP TP ${th} sebagai draf?`;
  const ok = await konfirmasiTema(pesan, { judul: sahkan ? "Sahkan KOSP" : "Buka sebagai Draf", teksOk: sahkan ? "Sahkan" : "Buka" }); if (!ok) return;
  const nilai = { ...((KOSP.info || {})[th] || {}), sah: sahkan ? { oleh: STATE.guruNama || "", t: new Date().toISOString() } : null };
  try { await _bspGabungUmum("bosp:kosp:info", { [th]: nilai }); KOSP.info[th] = nilai; toast(sahkan ? `KOSP TP ${th} disahkan` : "Dibuka kembali sebagai draf", "ok"); closeModal(); _kospRender(); }
  catch (x) { toast("Gagal: " + (x.message || x), "err"); }
}
function kospPilihAdopsi() {
  const lalu = kospDaftarTahun().filter((t) => t < KOSP.tahun)[0];
  openModal(`<h3>♻️ Adopsi dari TP ${_kE(lalu)}</h3><p class="kosp-ket">Pilih bab yang isinya dipakai lagi tahun ini (versi terakhir yang terbit di TP ${_kE(lalu)}). Setelah itu bab tetap bisa disunting.</p>
    <div class="kosp-riwayat">${KOSP_URUT.map((n) => { const b = kospBab(lalu, n, false); return b.html ? `<div style="display:flex;align-items:center;gap:8px"><span style="flex:1"><b>${_kE(_kNamaBab(n))}</b> · ${_kE(b.judul)}<br><small>${b.sumber === "unggah" ? `diperbarui ${_kE(_kTglTampil(b.diubah))}` : "draf bawaan"}</small></span><button class="btn btn-sm btn-outline" onclick="kospAdopsi(${n})">Pakai</button></div>` : ""; }).join("")}</div>`);
}

// ── Menu ──
(function kospPasang() {
  const ikon = '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/><path d="M9 7h7M9 10.5h5"/>';
  if (typeof RG_IKON !== "undefined") { RG_IKON["kosp"] = ikon; RG_IKON["pg-kosp"] = ikon; }
  if (typeof RG_MENU_PENGELOLA !== "undefined") { const g = RG_MENU_PENGELOLA.find((x) => x.group === "Pengelolaan"); if (g && !g.items.some((x) => x[0] === "pg-kosp")) g.items.splice(1, 0, ["pg-kosp", "", "KOSP"]); }
  if (typeof PG_MODUL_SIAP !== "undefined" && !PG_MODUL_SIAP.includes("pg-kosp")) PG_MODUL_SIAP.push("pg-kosp");
  if (typeof rgBukaPengelola === "function") { const a = rgBukaPengelola; rgBukaPengelola = async function (key) { if (key === "pg-kosp") return kospBuka(0); return a.apply(this, arguments); }; }
  if (typeof renderSidebar === "function") {
    const a = renderSidebar;
    renderSidebar = function () {
      const h = a.apply(this, arguments);
      try {
        if (typeof RG === "undefined" || !RG.siap || STATE.ruang === "Pg") return h;
        const nav = qs("nav-list"); if (!nav || nav.querySelector("[data-kosp]")) return h;
        const el = document.createElement("div"); el.className = "nav-item" + (STATE.currentPage === "kosp" ? " active" : ""); el.dataset.kosp = "1";
        el.innerHTML = `${rgSvg("kosp")}<span>KOSP</span>`; el.title = "Kurikulum Operasional Satuan Pendidikan"; el.onclick = () => kospBuka(0);
        const sop = nav.querySelector("[data-sop]"), pertama = nav.querySelector(".nav-item");
        if (sop) sop.after(el); else if (pertama) pertama.after(el); else nav.appendChild(el);
      } catch (e) { console.warn("Menu KOSP:", e); }
      return h;
    };
  }
  if (typeof CF_FITUR !== "undefined") CF_FITUR.push({ j: "KOSP (Kurikulum Operasional Satuan Pendidikan)", i: "📚", l: "Menu KOSP › Sampul › BAB I–V", k: "kosp ksp kurikulum operasional satuan pendidikan visi misi tujuan struktur kurikulum skk tahfizh kokurikuler ekstrakurikuler iht dokumen kurikulum", a: () => kospBuka(0) });
  if (typeof CF_KATA_MENU !== "undefined") CF_KATA_MENU.kosp = "kosp ksp kurikulum operasional satuan pendidikan dokumen kurikulum";
})();

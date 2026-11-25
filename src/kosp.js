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
//  • Yang boleh mengunggah: Admin utama, Kepala PKBM, Sekretaris, Penyelenggara (dari SOP & Tugas).
// ============================================================
const KOSP = { siap: false, info: {}, kv: {}, tahun: null, n: 0, q: "", indeks: null, tunda: null, pending: null };
const KOSP_DATA_TAHUN = ["2026/2027"];
const KOSP_BAB_BAKU = { 1: "Pendahuluan", 2: "Visi, Misi dan Tujuan", 3: "Pengorganisasian Pembelajaran", 4: "Perencanaan Pembelajaran", 5: "Evaluasi, Pendampingan dan Pengembangan Profesional", 6: "Lampiran" };
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
const _kNamaBab = (n) => (n === 6 ? "Lampiran" : "BAB " + KOSP_ROMAWI[n]);
const _kTglTampil = (iso) => { try { return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }); } catch (e) { return ""; } };
const _kNormal = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[’‘`]/g, "'").replace(/[“”]/g, '"');

function _kospBolehKelola() {
  if (typeof isAdmin === "function" && isAdmin() && !(typeof isAdminKedua === "function" && isAdminKedua())) return true;
  try {
    const pj = (typeof SOP !== "undefined" && SOP.pj) || {};
    return Object.entries(pj).some(([k, ids]) => /^(kepala|sekretaris|peny@)/.test(k) && (ids || []).includes(STATE.guruId));
  } catch (e) { return false; }
}

// ── Muat ──
function _kospMuatBawaan(th) {
  if ((window.KOSP_BAWAAN || {})[th] || !KOSP_DATA_TAHUN.includes(th)) return Promise.resolve();
  return new Promise((ok) => { const s = document.createElement("script"); s.src = `src/kosp-data/${_kTh(th)}.js?v=1`; s.onload = ok; s.onerror = () => ok(); document.head.appendChild(s); });
}
async function kospMuat(paksa) {
  if (!KOSP.siap || paksa) {
    const r = await supaSemua.from("kuliah_pengaturan").select("kunci,nilai").eq("ruang_id", "*").like("kunci", "bosp:kosp:%");
    if (r.error) throw r.error;
    KOSP.kv = {}; KOSP.info = {};
    (r.data || []).forEach((x) => { if (x.kunci === "bosp:kosp:info") KOSP.info = x.nilai || {}; else KOSP.kv[x.kunci] = x.nilai || {}; });
    KOSP.siap = true; KOSP.indeks = null;
  }
  if (!KOSP.tahun || !kospDaftarTahun().includes(KOSP.tahun)) KOSP.tahun = kospDaftarTahun()[0];
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
const kospSemuaBab = (th) => [1, 2, 3, 4, 5, 6].map((n) => kospBab(th, n)).filter((b) => b.no <= 5 || b.html);

// ── Halaman ──
const _kospKeyHal = () => (STATE.ruang === "Pg" ? "pg-kosp" : "kosp");
async function kospBuka(n, opsi = {}) {
  const sec = _rgBukaHal(_kospKeyHal(), "KOSP", `<div class="card"><div class="rg-memuat">Memuat KOSP…</div></div>`);
  try { if (typeof sopMuat === "function") await sopMuat().catch(() => {}); await kospMuat(opsi.segar); }
  catch (e) { sec.innerHTML = `<div class="card">Gagal memuat KOSP: ${_kE(e.message || e)}</div>`; return; }
  KOSP.n = n || 0;
  _kospRender(sec, opsi);
}
function _kospRender(sec, opsi = {}) {
  sec = sec || document.getElementById("page-rg"); if (!sec) return;
  const th = KOSP.tahun, kelola = _kospBolehKelola(), daftarTh = kospDaftarTahun();
  sec.innerHTML = `<div class="kosp">
    <div class="kosp-bar">
      <div class="kosp-bar-kiri">
        ${KOSP.n ? `<button class="kosp-tb" onclick="kospBuka(0)" title="Sampul & Daftar Bab">📚 <span>Sampul</span></button>` : ""}
        <label class="kosp-th" title="Tahun Pelajaran">TP <select onchange="kospGantiTahun(this.value)">${daftarTh.map((t) => `<option ${t === th ? "selected" : ""}>${t}</option>`).join("")}</select></label>
      </div>
      <div class="kosp-cari"><span>🔍</span><input id="kosp-q" type="search" placeholder="Cari di KOSP… (mis. tahfizh, SKK, IHT)" value="${_kE(KOSP.q)}" oninput="kospKetikCari(this.value)" onkeydown="if(event.key==='Enter'){event.preventDefault();kospCari(this.value,true)}"></div>
      <div class="kosp-bar-kanan">
        <button class="kosp-tb" onclick="kospUnduhSemua()" title="Unduh seluruh KOSP (Word)">⬇️ <span>Unduh Word</span></button>
        <button class="kosp-tb" onclick="kospCetak()" title="Cetak / simpan PDF">🖨️ <span>Cetak / PDF</span></button>
        ${kelola ? `<button class="kosp-tb" onclick="kospKelola()" title="Kelola KOSP">⚙️ <span>Kelola</span></button>` : ""}
      </div>
    </div>
    <div id="kosp-hasil" class="kosp-hasil" hidden></div>
    <div id="kosp-badan">${KOSP.n ? _kospHtmlBaca(KOSP.n) : _kospHtmlSampul()}</div>
  </div>`;
  if (opsi.k == null) { const pc = document.getElementById("page-container"); if (pc) pc.scrollTo({ top: 0, behavior: "instant" }); }
  if (KOSP.n) _kospSetelBaca(opsi);
  if (KOSP.q && KOSP.q.length >= 2) kospCari(KOSP.q);
}
async function kospGantiTahun(th) { KOSP.tahun = th; KOSP.indeks = null; await kospMuat(); _kospRender(); }

// ── Sampul + daftar bab ──
function _kospHtmlSampulKartu(th) {
  const logo = window.LOGO_PKBM_DEFAULT || (typeof urlLogoSekolah === "function" ? urlLogoSekolah() : "") || "assets/logo-pkbm-default.png";
  return `<div class="kosp-sampul">
    <div class="kosp-sp-pola"></div>
    <div class="kosp-sp-isi">
      <div class="kosp-sp-atas">Dokumen Kurikulum</div>
      <img class="kosp-sp-logo" src="${_kE(logo)}" alt="" onerror="this.style.display='none'">
      <h1>Kurikulum Operasional<br>Satuan Pendidikan</h1>
      <div class="kosp-sp-kode">KOSP</div>
      <div class="kosp-sp-garis"><i></i><b>✦</b><i></i></div>
      <div class="kosp-sp-lembaga">PKBM AL UMM BARABAI</div>
      <div class="kosp-sp-prog"><span>Paket A</span><span>Paket B</span><span>Paket C</span></div>
      <div class="kosp-sp-th">Tahun Pelajaran ${_kE(th)}</div>
      <div class="kosp-sp-alamat">${_kE(KOSP_ALAMAT)}</div>
    </div>
  </div>`;
}
function _kospTerakhir() { try { return JSON.parse(localStorage.getItem("kosp:terakhir") || "null"); } catch (e) { return null; } }
function _kospHtmlSampul() {
  const th = KOSP.tahun, bab = kospSemuaBab(th), kelola = _kospBolehKelola(), ter = _kospTerakhir();
  const lanjut = ter && ter.th === th && ter.n ? bab.find((b) => b.no === ter.n) : null;
  const kartu = bab.map((b) => {
    const tmp = document.createElement("div"); tmp.innerHTML = b.html || "";
    const bagian = tmp.querySelectorAll("h2,h3").length, tabel = tmp.querySelectorAll("table").length;
    const ringkas = [...tmp.querySelectorAll("h2,h3")].slice(0, 4).map((h) => h.textContent.replace(/^[A-Z0-9]+[.)]\s*/, "")).join(" · ");
    const status = b.sumber === "unggah" ? `<span class="kosp-lbl ok">Diperbarui ${_kE(_kTglTampil(b.diubah))}</span>` : b.sumber === "warisan" ? `<span class="kosp-lbl warn">Isi TP ${_kE(b.asal)}</span>` : b.sumber === "kosong" ? `<span class="kosp-lbl">Belum ada</span>` : `<span class="kosp-lbl">Draf ${_kE(th)}</span>`;
    return `<div class="kosp-kartu ${b.html ? "" : "kosong"}" ${b.html ? `onclick="kospBuka(${b.no})"` : ""}>
      <div class="kosp-k-no"><small>${b.no === 6 ? "" : "BAB"}</small><b>${b.no === 6 ? "📎" : KOSP_ROMAWI[b.no]}</b></div>
      <div class="kosp-k-isi"><h3>${KOSP_IKON[b.no]} ${_kE(b.judul)}</h3><p>${_kE(ringkas || (b.html ? "" : "Belum diunggah"))}</p>
        <div class="kosp-k-meta">${status}${b.html ? `<span>${bagian} bagian</span>${tabel ? `<span>${tabel} tabel</span>` : ""}` : ""}</div></div>
      <div class="kosp-k-aksi" onclick="event.stopPropagation()">
        ${b.html ? `<button class="kosp-ib" title="Unduh bab ini (Word)" onclick="kospUnduhBab(${b.no})">⬇️</button>` : ""}
        ${b.berkas ? `<button class="kosp-ib" title="Berkas asli yang diunggah" onclick="kospBerkasAsli(${b.no})">📎</button>` : ""}
        ${kelola ? `<button class="kosp-ib" title="Unggah bab ini (.docx)" onclick="kospUnggah(${b.no})">⬆️</button>` : ""}
      </div></div>`;
  }).join("");
  const cat = kelola ? _kospHtmlCatatan(th, bab) : "";
  return `<div class="kosp-depan">
    <div class="kosp-depan-kiri">${_kospHtmlSampulKartu(th)}
      <button class="btn btn-accent kosp-mulai" onclick="kospBuka(${lanjut ? lanjut.no : 1})">${lanjut ? `▶ Lanjut Membaca ${_kE(_kNamaBab(lanjut.no))}` : "📖 Mulai Membaca"}</button></div>
    <div class="kosp-depan-kanan">
      <div class="kosp-pengantar"><b>Dasar kurikulum PKBM Al Umm Barabai</b> untuk semua jenjang — Paket A, Paket B & C Putra, dan Paket B & C Putri. Ketuk bab untuk membaca, atau ketik kata di kotak 🔍 untuk langsung menemukan letaknya.</div>
      <div class="kosp-daftar">${kartu}</div>
      ${kelola && !bab.some((b) => b.no === 6) ? `<button class="btn btn-ghost kosp-tambah" onclick="kospUnggah(6)">📎 Tambah Lampiran (.docx)</button>` : ""}
      ${cat}
    </div></div>`;
}
function _kospHtmlCatatan(th, bab) {
  const c = KOSP_CATATAN[th]; if (!c) return "";
  const grup = Object.entries(c).filter(([n]) => +n === 0 || (bab.find((b) => b.no === +n) || {}).sumber === "bawaan");
  if (!grup.length) return "";
  const jml = grup.reduce((a, [, x]) => a + x.length, 0);
  return `<details class="kosp-catatan"><summary>📋 Catatan Penyempurnaan Draf <span>${jml}</span><small>hanya terlihat oleh pengelola</small></summary>
    ${grup.map(([n, x]) => `<div class="kosp-cat-grup"><b>${+n ? _kE(_kNamaBab(+n) + " · " + KOSP_BAB_BAKU[n]) : "Umum"}</b><ul>${x.map((t) => `<li>${_kE(t)}</li>`).join("")}</ul></div>`).join("")}
    <p class="kosp-ket">Catatan sebuah bab hilang otomatis setelah bab itu diunggah ulang.</p></details>`;
}

// ── Membaca satu bab ──
function _kospHtmlBaca(n) {
  const th = KOSP.tahun, b = kospBab(th, n), semua = kospSemuaBab(th), kelola = _kospBolehKelola();
  const i = semua.findIndex((x) => x.no === n), seb = semua[i - 1], ses = semua[i + 1];
  const sumber = b.sumber === "unggah" ? `Diperbarui ${_kE(_kTglTampil(b.diubah))}${b.oleh ? ` oleh ${_kE(b.oleh)}` : ""}` : b.sumber === "warisan" ? `Masih memakai isi TP ${_kE(b.asal)} — belum diunggah untuk TP ${_kE(th)}` : b.sumber === "bawaan" ? `Draf TP ${_kE(th)}` : "Belum ada isi";
  const tocBab = semua.map((x) => `<a class="kosp-toc-bab ${x.no === n ? "aktif" : ""}" onclick="kospBuka(${x.no})"><b>${x.no === 6 ? "📎" : KOSP_ROMAWI[x.no]}</b><span>${_kE(x.judul)}</span></a>${x.no === n ? `<div id="kosp-toc-sub" class="kosp-toc-sub"></div>` : ""}`).join("");
  return `<div class="kosp-baca">
    <aside class="kosp-toc" id="kosp-toc"><div class="kosp-toc-judul">Daftar Isi <button class="kosp-toc-tutup" onclick="kospToc(false)">✕</button></div>${tocBab}</aside>
    <div class="kosp-toc-latar" onclick="kospToc(false)"></div>
    <article class="kosp-artikel">
      <button class="kosp-toc-buka" onclick="kospToc(true)">☰ Daftar Isi</button>
      <header class="kosp-bab-kepala"><div class="kosp-bk-no">${_kE(_kNamaBab(n))}</div><h1>${_kE(b.judul)}</h1>
        <div class="kosp-bk-meta">${sumber}</div>
        <div class="kosp-bk-aksi">
          ${b.html ? `<button class="kosp-tb" onclick="kospUnduhBab(${n})">⬇️ Unduh Bab Ini</button>` : ""}
          ${b.berkas ? `<button class="kosp-tb" onclick="kospBerkasAsli(${n})">📎 Berkas Asli</button>` : ""}
          ${kelola ? `<button class="kosp-tb" onclick="kospUnggah(${n})">⬆️ Unggah Pengganti</button>` : ""}
          ${kelola && b.sumber === "unggah" ? `<button class="kosp-tb" onclick="kospRiwayat(${n})">🕘 Riwayat</button>` : ""}
        </div></header>
      <div class="kosp-isi" id="kosp-isi">${b.html || `<p class="kosp-kosong">Bab ini belum diisi.${kelola ? " Tekan ⬆️ Unggah untuk menambahkan berkas .docx." : ""}</p>`}</div>
      <nav class="kosp-nav">${seb ? `<button onclick="kospBuka(${seb.no})"><small>← Sebelumnya</small><b>${_kE(_kNamaBab(seb.no))} · ${_kE(seb.judul)}</b></button>` : "<span></span>"}
        ${ses ? `<button class="kanan" onclick="kospBuka(${ses.no})"><small>Berikutnya →</small><b>${_kE(_kNamaBab(ses.no))} · ${_kE(ses.judul)}</b></button>` : `<button class="kanan" onclick="kospBuka(0)"><small>Selesai</small><b>Kembali ke Sampul</b></button>`}</nav>
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
  bar.style.width = Math.max(0, Math.min(100, tot > 0 ? (-r.top / tot) * 100 : 100)) + "%";
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
    ${hasil.length ? Object.entries(grup).map(([n, xs]) => `<div class="kosp-h-grup"><div class="kosp-h-bab">${KOSP_IKON[n]} ${_kE(_kNamaBab(+n))} · ${_kE(xs[0].bab)} <span>${hasil.filter((x) => x.n === +n).length}</span></div>
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
img{max-width:100%}img.kd-rumus{vertical-align:middle}.bab-kop{text-align:center;margin-bottom:14pt}.bab-kop .no{font-size:14pt;font-weight:bold}`;
function _kospHtmlBabDok(b, putus) {
  return `${putus ? '<br clear="all" style="page-break-before:always">' : ""}<div class="bab-kop"><div class="no">${_kE(_kNamaBab(b.no))}</div><h1>${_kE(String(b.judul).toUpperCase())}</h1></div>${b.html}`;
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
  const daftar = `<br clear="all" style="page-break-before:always"><h1>DAFTAR ISI</h1>${bab.map((b) => `<p style="margin:8pt 0 2pt"><b>${_kE(_kNamaBab(b.no))} · ${_kE(String(b.judul).toUpperCase())}</b></p>${(() => { const t = document.createElement("div"); t.innerHTML = b.html; return [...t.querySelectorAll("h2,h3")].map((h) => `<p style="margin:0 0 1pt ${h.tagName === "H2" ? 14 : 28}pt">${_kE(h.textContent)}</p>`).join(""); })()}`).join("")}`;
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
  if (!_kospBolehKelola()) return toast("Hanya Admin, Kepala PKBM, Sekretaris, dan Penyelenggara yang bisa mengunggah KOSP", "err");
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
      <div style="display:flex;gap:10px;margin-top:12px"><button class="btn btn-outline" style="flex:1" onclick="closeModal()">Batal</button><button id="kosp-u-simpan" class="btn btn-accent" style="flex:2" onclick="kospSimpanUnggah()">💾 Simpan & Terbitkan</button></div>`, { lebar: true });
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
  const kini = new Date().toISOString(), oleh = STATE.guruNama || "";
  const riwayat = [{ t: kini, oleh, nama: p.file.name, berkas }, ...(lama.riwayat || [])].slice(0, 12);
  try {
    await _bspGabungUmum(kunci, { judul, html, berkas, diubah: kini, oleh, riwayat });
    KOSP.kv[kunci] = { ...lama, judul, html, berkas, diubah: kini, oleh, riwayat }; KOSP.indeks = null; KOSP.pending = null;
    if (typeof _rgLog === "function") _rgLog("unggah-kosp", { tahun: th, bab: p.n, judul });
    closeModal(); toast(`${_kNamaBab(p.n)} tersimpan${catatan}`, catatan ? "info" : "ok");
    kospBuka(p.n);
  } catch (e) { tombol.disabled = false; tombol.textContent = "💾 Simpan & Terbitkan"; toast("Gagal menyimpan: " + (e.message || e), "err"); }
}
function kospRiwayat(n) {
  const b = kospBab(KOSP.tahun, n), bawaan = (((window.KOSP_BAWAAN || {})[KOSP.tahun] || {}).bab || []).some((x) => x.no === n);
  openModal(`<h3>🕘 Riwayat ${_kE(_kNamaBab(n))} · TP ${_kE(KOSP.tahun)}</h3>
    <div class="kosp-riwayat">${(b.riwayat || []).map((r, i) => `<div><b>${_kE(_kTglTampil(r.t))}</b> · ${_kE(r.oleh || "-")}<br><small>${_kE(r.nama || "")}${i === 0 ? " · versi yang tampil" : ""}</small>${r.berkas ? ` <button class="btn btn-ghost btn-sm" onclick='arsipLihat(${JSON.stringify(r.berkas).replace(/'/g, "&#39;")})'>📎 Buka</button>` : ""}</div>`).join("") || "<p>Belum ada riwayat.</p>"}</div>
    ${bawaan ? `<div style="margin-top:12px"><button class="btn btn-outline" onclick="kospKembalikan(${n})">↺ Kembalikan ke Draf Bawaan</button></div>` : ""}`);
}
async function kospKembalikan(n) {
  const ok = await konfirmasiTema(`Tampilkan lagi draf bawaan untuk ${_kNamaBab(n)}? Isi unggahan disembunyikan, berkas aslinya tetap ada di Arsip Drive.`, { judul: "Kembalikan ke Draf", teksOk: "Kembalikan" });
  if (!ok) return;
  const kunci = _kKunci(KOSP.tahun, n);
  try { await _bspGabungUmum(kunci, { html: null, judul: null, berkas: null, diubah: null, oleh: null }); const l = KOSP.kv[kunci] || {}; KOSP.kv[kunci] = { riwayat: l.riwayat }; KOSP.indeks = null; toast("Dikembalikan ke draf bawaan", "ok"); kospBuka(n); }
  catch (e) { toast("Gagal: " + (e.message || e), "err"); }
}

// ── Kelola: tahun pelajaran baru ──
function kospKelola() {
  const th = kospDaftarTahun();
  openModal(`<h3>⚙️ Kelola KOSP</h3>
    <p class="kosp-ket">KOSP diperbarui tiap tahun pelajaran. Buat tahun baru → semua bab otomatis memakai isi tahun sebelumnya, lalu unggah ulang hanya bab yang berubah.</p>
    <div class="kosp-riwayat">${th.map((t) => { const isi = kospSemuaBab(t); const baru = isi.filter((b) => b.sumber === "unggah").length; return `<div><b>TP ${_kE(t)}</b>${t === KOSP.tahun ? " · sedang dibuka" : ""}<br><small>${baru} bab diunggah · ${isi.filter((b) => b.sumber === "warisan").length} bab memakai isi tahun sebelumnya</small></div>`; }).join("")}</div>
    <div style="display:flex;gap:10px;margin-top:14px;flex-wrap:wrap"><button class="btn btn-accent" onclick="kospTahunBaru()">➕ Tahun Pelajaran Baru</button><button class="btn btn-outline" onclick="closeModal()">Tutup</button></div>`);
}
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

// ============================================================
//  RUANG PKBM — satu aplikasi, 4 ruang (Tahap 1)
//  🟢 Paket A · 🔵 Paket B & C Putra · 🩷 Paket B & C Putri · 🟡 Pengelola PKBM
//
//  • Setiap permintaan ke Supabase membawa penanda "x-ruang" → RLS (SQL_PKBM_1_RUANG.sql)
//    menyaring data sesuai ruang. Sebelum SQL dijalankan penanda ini diabaikan server,
//    jadi aplikasi tetap berjalan seperti biasa (semua data = Paket B & C Putra).
//  • Pilih ruang hanya di layar depan (setelah masuk); di dalam ruang cukup satu tombol
//    "Kembali Ke Pilihan Ruang" di paling bawah menu.
//  • Ruang tempat guru mengajar = boleh ubah. Ruang jenjang lain = Mode Lihat (tidak bisa ubah).
//  • Warna mengikuti ruang (hijau/biru/pink/kuning), bisa diganti per ruang lewat ✨.
// ============================================================
const RG = {
  bawaan: [
    { id: "A", nama: "Paket A", sub: "Kelas 1–6", palet: "hijau", warna: "#0f6b55", ikon: "🟢", jenjang: true },
    { id: "Pa", nama: "Paket B & C Putra", sub: "Rumah Tahfizh Putra", palet: "biru", warna: "#1546a8", ikon: "🔵", jenjang: true },
    { id: "Pi", nama: "Paket B & C Putri", sub: "Rumah Tahfizh Putri", palet: "pink", warna: "#c0306f", ikon: "🩷", jenjang: true },
    { id: "Pg", nama: "Pengelola PKBM", sub: "Kantor Pengelola", palet: "kuning", warna: "#b45309", ikon: "🟡", jenjang: false },
  ],
  daftar: [], saya: null, siap: false, toastLihat: 0,
};
window.RUANG_SIAP = false;
STATE.ruang = (() => { try { const r = localStorage.getItem("ruangAktif"); return ["A", "Pa", "Pi", "Pg"].includes(r) ? r : "Pa"; } catch (e) { return "Pa"; } })();
STATE.modeLihat = false;
const _rgSesi = {
  get: (k) => { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
  set: (k, v) => { try { sessionStorage.setItem(k, v); } catch (e) {} },
  del: (k) => { try { sessionStorage.removeItem(k); } catch (e) {} },
};
const rgRuang = (id = STATE.ruang) => (RG.daftar.length ? RG.daftar : RG.bawaan).find((r) => r.id === id) || RG.bawaan[1];

// ── 1. Penanda ruang di setiap permintaan (REST + RPC) ──
(function () {
  const f0 = supa.rest.fetch;
  supa.rest.fetch = (u, o = {}) => { const h = new Headers(o.headers); if (!h.has("x-ruang")) h.set("x-ruang", STATE.ruang); return f0(u, { ...o, headers: h }); };
})();
// Klien khusus untuk membaca/mengatur lintas ruang (layar pilih ruang, Pengelola, Pengaturan Ruang)
const supaSemua = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY, {
  global: { headers: { "x-ruang": "*" } }, auth: { persistSession: false, autoRefreshToken: false, storageKey: "sb-ruang-semua" },
});

// ── 2. Mode Lihat: tulis data ditolak di ruang yang bukan tempat mengajar ──
(function () {
  const fromAsli = supa.from.bind(supa);
  const bebas = new Set(["log_aktivitas", "push_subscriptions"]);
  supa.from = (t) => {
    const b = fromAsli(t);
    if (!STATE.modeLihat || bebas.has(t)) return b;
    ["insert", "update", "upsert", "delete"].forEach((m) => { b[m] = () => _rgDitolak(); });
    return b;
  };
})();
function _rgDitolak() {
  if (Date.now() - RG.toastLihat > 4000) { RG.toastLihat = Date.now(); toast(`👁️ Mode Lihat: kamu tidak mengajar di ${rgRuang().nama}, data tidak bisa diubah`, "warn"); }
  const hasil = { data: null, error: { message: "Mode Lihat — data ruang ini tidak bisa diubah" } };
  const p = new Proxy(function () {}, {
    get(_, k) { if (k === "then") return (a, b) => Promise.resolve(hasil).then(a, b); return () => p; },
    apply() { return p; },
  });
  return p;
}

// ── 3. Hak akses per ruang ──
function rgAkses(id) {
  const r = rgRuang(id);
  if (!r || r.id !== id) return "-";
  if (typeof isAdmin === "function" && isAdmin()) return "U";
  const s = RG.saya || {};
  if (s.status_aktif === false) return r.jenjang ? "L" : "-"; // guru nonaktif: hanya melihat
  if ((s.ruang || []).includes(id) || (s.ruang_pendamping || []).includes(id)) return "U";
  return r.jenjang ? "L" : "-";
}
const rgPendamping = () => ((RG.saya || {}).ruang_pendamping || []).includes(STATE.ruang);
const rgBisaPengaturan = () => typeof isAdmin === "function" && isAdmin();

async function _rgLog(aksi, rincian) {
  try { await supa.from("log_aktivitas").insert({ guru_id: STATE.guruId || null, nama: STATE.guruNama || null, aksi, rincian: rincian || null }); } catch (e) {}
}

// Daftar nama untuk MASUK selalu dari semua ruang (guru Paket A bisa masuk dari perangkat mana pun)
// + guru NONAKTIF yang tetap boleh masuk: punya akses Fitur Kuliah, atau dicentang admin di
//   Pengaturan Ruang → Guru Per Ruang → "Tetap Bisa Masuk" (kunci "masuk_akses").
const RG_MASUK = { ids: [] };
async function _rgIdTetapMasuk() {
  try {
    const r = await supaSemua.from("kuliah_pengaturan").select("kunci,nilai").in("kunci", ["akses", "masuk_akses"]);
    const peta = Object.fromEntries((r.data || []).map((x) => [x.kunci, x.nilai || {}]));
    RG_MASUK.ids = (peta.masuk_akses && peta.masuk_akses.ids) || [];
    return [...new Set([...RG_MASUK.ids, ...Object.keys((peta.akses && peta.akses.guru) || {})])];
  } catch (e) { return []; }
}
apiGetDaftarGuru = async function () {
  try {
    const tambahan = (await _rgIdTetapMasuk()).filter((x) => /^[0-9a-f-]{36}$/i.test(x));
    let q = supaSemua.from("guru").select("id,nama,jenis_guru,jabatan,foto_url,status_aktif,ruang,ruang_nonaktif").order("nama");
    q = tambahan.length ? q.or(`status_aktif.eq.true,id.in.(${tambahan.join(",")})`) : q.eq("status_aktif", true);
    const r = await q;
    if (r.error) throw r.error;
    // hanya guru yang terdaftar (dan aktif) di ruang yang sedang dibuka; admin selalu tampil
    const X = STATE.ruang;
    const semua = r.data || [];
    const disaring = X === "Pg" ? semua : semua.filter((g) => _namaTermasukAdmin(g.nama) || ((g.ruang || []).includes(X) && !(g.ruang_nonaktif || []).includes(X)));
    return disaring.length ? disaring : semua;
  } catch (e) { throw new Error(_pesanErrorRamah(e) || e.message); }
};

// Admin tidak perlu memasukkan PIN lagi sesaat setelah pindah ruang (halaman dimuat ulang)
const _rgMintaPinAsli = mintaPinAdminUntukLogin;
mintaPinAdminUntukLogin = function (g) {
  const t = +(_rgSesi.get("adminLanjut") || 0);
  _rgSesi.del("adminLanjut");
  if (t && Date.now() - t < 120000) { _ADMIN_TERVERIFIKASI = true; _selesaikanPilihGuru(g); return; }
  return _rgMintaPinAsli(g);
};

// ── 4. Setelah masuk: muat ruang, tentukan akses, tampilkan pilihan ruang bila perlu ──
async function _rgMuat() {
  if (!STATE.guruId) return;
  if (_namaTermasukAdmin(STATE.guruNama) && !isAdmin()) return; // tunggu PIN admin
  try {
    const [a, b] = await Promise.all([
      supaSemua.from("ruang").select("*").order("urutan"),
      supaSemua.from("guru").select("id,ruang,ruang_pendamping,status_aktif").eq("id", STATE.guruId).maybeSingle(),
    ]);
    if (a.error) throw a.error;
    if (b.error) throw b.error;
    RG.daftar = (a.data || []).filter((r) => r.aktif !== false);
    RG.saya = b.data || {};
    try { const p = await supaSemua.from("kuliah_pengaturan").select("nilai").eq("kunci", "penyelenggara").eq("ruang_id", STATE.ruang).maybeSingle(); RG.penyelenggara = (p.data && p.data.nilai && p.data.nilai.ids) || []; } catch (e) { RG.penyelenggara = []; }
    RG.siap = window.RUANG_SIAP = RG.daftar.length > 0;
  } catch (e) { RG.siap = window.RUANG_SIAP = false; return; } // SQL Tahap 1 belum dijalankan
  if (!RG.siap) return;
  const ubah = RG.daftar.filter((r) => rgAkses(r.id) === "U");
  const sesiBaru = !_rgSesi.get("ruangDipilih");
  const akses = rgAkses(STATE.ruang);
  // ruang tersimpan tidak boleh dibuka, atau guru hanya punya satu ruang → langsung ke ruangnya
  if (ubah.length && (akses === "-" || (sesiBaru && ubah.length === 1 && ubah[0].id !== STATE.ruang))) return rgPindah(ubah[0].id);
  STATE.modeLihat = akses === "L";
  _rgTerapkanTampilan();
  if (sesiBaru && ubah.length >= 2) rgTampilPilih();
  else _rgSesi.set("ruangDipilih", "1");
  if (STATE.ruang === "Pg") rgBukaPengelola();
}
const _rgBootAsli = boot;
boot = async function () { await _rgBootAsli(); await _rgMuat(); };
const _rgSelesaiAsli = _selesaikanPilihGuru;
_selesaikanPilihGuru = function (g) { const h = _rgSelesaiAsli(g); _rgMuat(); return h; };

function _rgTransisi(id) {
  if (qs("rg-transisi")) return;
  const r = rgRuang(id), el = document.createElement("div");
  el.id = "rg-transisi";
  el.style.setProperty("--rw", r.warna);
  el.innerHTML = `<div class="rg-tr-cincin"><i></i><i></i><div class="rg-tr-logo">${htmlLogoSekolah(64)}</div></div><b>PKBM Al-Umm Barabai</b><span>${escapeHtml((RG_INFO[id] || {}).guru || r.nama)}</span>`;
  document.body.appendChild(el);
}
async function rgPindah(id) {
  if (rgAkses(id) === "-") return;
  try { localStorage.setItem("ruangAktif", id); } catch (e) {}
  _rgSesi.set("ruangDipilih", "1");
  if (isAdmin()) _rgSesi.set("adminLanjut", String(Date.now()));
  if (id === STATE.ruang && qs("rg-pilih")) { qs("rg-pilih").remove(); return; }
  _rgTransisi(id);
  await Promise.race([_rgLog("pindah-ruang", { dari: STATE.ruang, ke: id }), new Promise((r) => setTimeout(r, 800))]);
  location.reload();
}

// ── 5. Layar pilih ruang (hanya di depan) ──
// Keterangan singkat & ikon garis tiap ruang (kartu bergaya pita bernomor)
const RG_INFO = {
  A: { label: "Jenjang", guru: "Guru Kelas Paket A", setara: "Setara SD · Kelas 1–6", ket: "Pendidikan dasar kesetaraan: membaca, menulis, berhitung, dan dasar-dasar agama.",
    svg: '<path d="M4 19.5V5a2 2 0 0 1 2-2h12v14H6a2 2 0 0 0-2 2.5z"/><path d="M6 17h12v4H6a2 2 0 0 1 0-4z"/><path d="M9 7h6M9 10.5h4"/>' },
  Pa: { label: "Jenjang", guru: "Guru Kelas Rumah Tahfizh Putra", setara: "Setara SMP & SMA · Kelas 7–12", ket: "Rumah Tahfizh Putra: pendidikan kesetaraan berpadu program tahfizh Al-Qur'an.",
    svg: '<path d="M12 6.5C10 5 7 4.5 3 5v13c4-.5 7 0 9 1.5 2-1.5 5-2 9-1.5V5c-4-.5-7 0-9 1.5z"/><path d="M12 6.5V19"/>' },
  Pi: { label: "Jenjang", guru: "Guru Kelas Rumah Tahfizh Putri", setara: "Setara SMP & SMA · Kelas 7–12", ket: "Rumah Tahfizh Putri: pendidikan kesetaraan berpadu program tahfizh Al-Qur'an.",
    svg: '<path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4z"/><path d="M14.5 5.5l3 3"/><path d="M4 21h16"/>' },
  Pg: { label: "Kantor", guru: "Kantor Pengelola PKBM", setara: "Pengelola · Seluruh Jenjang", ket: "Data peserta didik & PTK, BOSP/ARKAS, surat, sarpras, TKA, ijazah, dan akreditasi.",
    svg: '<path d="M3 21h18"/><path d="M5 21V8l7-5 7 5v13"/><path d="M9 21v-5h6v5"/><path d="M9 11h.01M15 11h.01"/>' },
};
// Ikon garis ruang (sama dengan kartu layar pilih ruang) dan nama pendeknya
function rgIkonRuang(id) { return `<svg class="rg-ikon-ruang" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${(RG_INFO[id] || {}).svg || ""}</svg>`; }
function rgNamaPendek(id) { return { A: "Paket A", Pa: "Putra", Pi: "Putri", Pg: "Pengelola" }[id] || rgRuang(id).nama; }
function rgTampilPilih() {
  qs("rg-pilih")?.remove();
  _rgSuaraSiapkan();
  const urut = ["A", "Pa", "Pi", "Pg"];
  const daftar = urut.map((id) => RG.daftar.find((r) => r.id === id)).filter(Boolean)
    .concat(RG.daftar.filter((r) => !urut.includes(r.id)));
  const kartu = (r, i) => {
    const info = RG_INFO[r.id] || { label: "Ruang", setara: r.sub || "", ket: "", svg: "" };
    const akses = rgAkses(r.id);
    const status = akses === "-" ? ["tutup", "Terkunci"] : r.id === STATE.ruang ? ["sedang", "Sedang Dibuka"] : akses === "U" ? ["saya", "Ruang Saya"] : ["lihat", "Lihat Saja"];
    return `<button type="button" class="rg-kartu${akses === "-" ? " rg-tutup" : ""}" style="--rw:${r.warna}" ${akses === "-" ? "disabled" : `onclick="rgMasuk('${r.id}',this)"`}>
      <span class="rg-atas">
        <small class="rg-no">${info.label} ${String(i + 1).padStart(2, "0")}</small>
        <b class="rg-nama">${escapeHtml(r.nama)}</b>
        <em class="rg-st rg-st-${status[0]}">${status[1]}</em>
        <small class="rg-setara">${escapeHtml(info.setara)}</small>
        <span class="rg-ket2">${escapeHtml(info.ket)}</span>
      </span>
      <span class="rg-alas"><span class="rg-lidah"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${akses === "-" ? '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>' : info.svg}</svg></span></span>
    </button>`;
  };
  const el = document.createElement("div");
  el.id = "rg-pilih";
  el.innerHTML = `<div class="rg-cahaya"></div><div class="rg-panel">
    <div class="rg-kepala"><div class="rg-logo">${htmlLogoSekolah(54)}</div><small>PKBM AL-UMM BARABAI</small>
      <b>Masuk Ke Ruang</b><span>Assalamu'alaikum, ${escapeHtml(_namaSingkatTopbar(STATE.guruNama))}. Pilih ruang yang ingin dibuka.</span></div>
    <div class="rg-daftar">${daftar.map(kartu).join("")}</div>
  </div>`;
  document.body.appendChild(el);
}
// Efek suara pintu dibuka saat masuk ruang
let _rgSuara = null;
// Suara disimpan sebagai data di src/suara-masuk.js (dimuat saat layar pilih ruang tampil) —
// bukan berkas .ogg, supaya tidak ditangkap pengelola unduhan seperti IDM.
function _rgSuaraSiapkan() {
  if (_rgSuara) return;
  if (!window.RG_SUARA_MASUK) {
    if (!document.getElementById("rg-suara-js")) {
      const s = document.createElement("script"); s.id = "rg-suara-js"; s.src = "src/suara-masuk.js?v=1";
      s.onload = () => _rgSuaraSiapkan(); document.head.appendChild(s);
    }
    return;
  }
  try { _rgSuara = new Audio(window.RG_SUARA_MASUK); _rgSuara.preload = "auto"; _rgSuara.volume = 0.8; } catch (e) { _rgSuara = null; }
}
async function rgMasuk(id, tombol) {
  const pilih = qs("rg-pilih");
  if (!pilih || pilih.dataset.masuk) return;
  pilih.dataset.masuk = "1";
  tombol?.classList.add("rg-dibuka");
  pilih.classList.add("rg-keluar");
  let lama = 900;
  try {
    _rgSuaraSiapkan();
    if (_rgSuara) {
      _rgSuara.currentTime = 0;
      await _rgSuara.play();
      const d = _rgSuara.duration;
      lama = isFinite(d) && d > 0 ? Math.min(d * 1000, 2600) : 1600;
    }
  } catch (e) { /* suara diblokir peramban — tetap lanjut */ }
  await new Promise((r) => setTimeout(r, id === STATE.ruang ? Math.min(lama, 700) : lama));
  rgPindah(id);
}

// ── 6. Tampilan per ruang: warna, nama di samping logo, pita Mode Lihat ──
PALET_WARNA.push(
  { kode: "pink", nama: "Gradasi Pink", ket: "Pink + emas (Putri)", warna: ["#c0306f", "#4a0b2c", "#f7c9a0"], theme: "#8f1f55" },
  { kode: "kuning", nama: "Gradasi Kuning", ket: "Kuning keemasan (Pengelola)", warna: ["#b45309", "#4a2604", "#fde68a"], theme: "#8a4b06" },
);
const _rgWarnaDokAsli = _warnaDok;
_warnaDok = function () {
  const p = paletAktif();
  if (p === "pink") return { tua: "#8f1f55", utama: "#c0306f", lembut: "#fce7f1" };
  if (p === "kuning") return { tua: "#8a4b06", utama: "#b45309", lembut: "#fef3c7" };
  return _rgWarnaDokAsli();
};
const _rgKunciPalet = () => (STATE.ruang === "Pa" ? "paletWarna" : "paletWarna:" + STATE.ruang);
paletAktif = function () {
  try { return localStorage.getItem(_rgKunciPalet()) || rgRuang().palet || "biru"; } catch (e) { return rgRuang().palet || "biru"; }
};
terapkanPalet = function (kode) {
  const p = PALET_WARNA.find((x) => x.kode === kode) || PALET_WARNA[0];
  const el = document.documentElement;
  el.classList.toggle("tema-elegan", p.kode !== "klasik");
  if (p.kode === "klasik") el.removeAttribute("data-palet"); else el.setAttribute("data-palet", p.kode);
  try { localStorage.setItem(_rgKunciPalet(), p.kode); localStorage.removeItem("temaElegan"); } catch (e) {}
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", p.theme);
  renderSidebar();
  terapkanIkonDasbor();
};
function _rgTerapkanTampilan() {
  const r = rgRuang();
  terapkanPalet(paletAktif());
  _rgNamaRuang();
  qs("rg-pita")?.remove();
  if (STATE.modeLihat) {
    const pita = document.createElement("div");
    pita.id = "rg-pita";
    pita.innerHTML = `👁️ <b>Mode Lihat · ${escapeHtml(r.nama)}</b><span>Kamu tidak mengajar di ruang ini — isinya bisa dilihat, tetapi tidak bisa diubah.</span><button class="btn btn-sm" onclick="rgTampilPilih()">↩️ Pilihan Ruang</button>`;
    qs("main").insertBefore(pita, qs("main").firstChild);
  }
  // Dasbor: sembunyikan pintasan ke fitur yang tidak ada di ruang ini
  qsa('#page-dashboard [onclick*="showPage("]').forEach((el) => {
    const k = (el.getAttribute("onclick").match(/showPage\(['"]([\w-]+)/) || [])[1];
    if (k) el.style.display = rgAdaFitur(k) ? "" : "none";
  });
  renderSidebar();
}
function _rgNamaRuang() {
  if (!RG.siap) return;
  const r = rgRuang();
  const teks = (RG_INFO[r.id] || {}).guru || r.nama;
  qsa('[data-i18n="appNameLine2"]').forEach((el) => { el.textContent = teks; });
  document.title = "PKBM Al-Umm Barabai - " + teks;
}
const _rgBahasaAsli = applyLanguage;
applyLanguage = function (...a) { const h = _rgBahasaAsli(...a); _rgNamaRuang(); return h; };

// ── 7. Menu samping per ruang ──
// Ikon garis (tanpa bentuk tanda tambah/silang) untuk ruang Pengelola & menu bawah
const RG_IKON = {
  "pg-beranda": '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M10 21v-6h4v6"/>',
  "pg-pd": '<path d="M2 9.5 12 4.5l10 5-10 5z"/><path d="M6 11.5v4.8c3.4 2.4 8.6 2.4 12 0v-4.8"/>',
  "pg-ptk": '<circle cx="9" cy="8" r="3.4"/><path d="M2.8 20c.8-3.5 3.3-5.4 6.2-5.4s5.4 1.9 6.2 5.4"/><path d="M15.5 4.8a3.4 3.4 0 0 1 0 6.4M17.6 14.9c1.8.8 3 2.4 3.4 5.1"/>',
  "pg-bosp": '<path d="M3 20.5h18"/><rect x="5" y="11" width="3" height="7" rx="1"/><rect x="10.5" y="5" width="3" height="13" rx="1"/><rect x="16" y="13.5" width="3" height="4.5" rx="1"/>',
  "pg-real": '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h4"/>',
  "pg-surat": '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 7 8.5 6 8.5-6"/>',
  "pg-sarpras": '<rect x="3" y="4" width="18" height="5" rx="1.2"/><path d="M5 9v11h14V9"/><path d="M10 13h4"/>',
  "pg-tka": '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2"/><path d="M5.8 16.2c.6-1.6 1.8-2.4 3.2-2.4s2.6.8 3.2 2.4"/><path d="M15 10h3.5M15 13.5h3.5"/>',
  "pg-ijazah": '<path d="M5 3h11l3 3v9"/><path d="M5 3v14h7"/><path d="M8 8h7M8 11.5h5"/><circle cx="16.5" cy="17" r="2.8"/><path d="m15 19.4-.6 2.6 2.1-1 2.1 1-.6-2.6"/>',
  "pg-kegiatan": '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/><path d="M7.5 14.5h3"/>',
  "pg-rapat": '<path d="M4 5h16v10H10l-4.5 4V15H4z"/><path d="M8 9h8M8 11.8h5"/>',
  "pg-akreditasi": '<circle cx="12" cy="9" r="5.5"/><path d="m9 13.8-1.2 7.2 4.2-2 4.2 2-1.2-7.2"/>',
  "pg-total": '<path d="M12 3 21 8l-9 5-9-5z"/><path d="m3 12.5 9 5 9-5"/><path d="m3 16.5 9 5 9-5"/>',
  "rg-santri": '<path d="M4 19.5V5a2 2 0 0 1 2-2h12v14H6a2 2 0 0 0-2 2.5z"/><path d="M6 17h12v4H6a2 2 0 0 1 0-4z"/><path d="M9 7h6"/>',
  "rg-atur": '<path d="M4 6h10M18 6h2M4 12h3M11 12h9M4 18h12"/><circle cx="16" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
  "rg-balik": '<path d="M9 14 4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-3"/>',
  "rg-akun": '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/><circle cx="12" cy="15.5" r="1.4"/>',
};
const rgSvg = (k, kelas = "ikon-garis") => `<svg class="${kelas}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${RG_IKON[k] || ""}</svg>`;
const RG_MENU_PENGELOLA = [
  { group: "Pengelola", items: [["pg-beranda", "", "Beranda Pengelola"]] },
  { group: "Data", items: [["pg-pd", "", "Peserta Didik"], ["pg-ptk", "", "Guru & PTK"]] },
  { group: "Keuangan", items: [["pg-bosp", "", "Rancangan BOSP (ARKAS)"], ["pg-real", "", "Realisasi BOSP"]] },
  { group: "Administrasi", items: [["pg-surat", "", "Surat Menyurat"], ["pg-sarpras", "", "Sarpras"], ["pg-tka", "", "TKA"], ["pg-ijazah", "", "Ijazah"]] },
  { group: "Pengelolaan", items: [["pg-kegiatan", "", "Kegiatan Pengelola"], ["pg-rapat", "", "Rapat & Notulen"], ["pg-akreditasi", "", "Akreditasi & Program"]] },
];
const _rgSidebarAsli = renderSidebar;
renderSidebar = function () {
  if (!RG.siap) return _rgSidebarAsli();
  const nav = qs("nav-list");
  nav.innerHTML = "";
  const tambahLabel = (teks) => { const l = document.createElement("div"); l.className = "nav-group-label"; l.textContent = teks; nav.appendChild(l); };
  const tambahItem = (key, html, onclick, kelas = "") => {
    const el = document.createElement("div");
    el.className = "nav-item" + (key === STATE.currentPage ? " active" : "") + (kelas ? " " + kelas : "");
    el.innerHTML = html; el.onclick = onclick; nav.appendChild(el);
  };
  if (STATE.ruang === "Pg") {
    RG_MENU_PENGELOLA.forEach((g) => {
      tambahLabel(g.group);
      g.items.forEach(([key, ikon, nama]) => tambahItem(key, `${rgSvg(key)}<span>${nama}</span>${key === "pg-beranda" || (typeof PG_MODUL_SIAP !== "undefined" && PG_MODUL_SIAP.includes(key)) ? "" : '<span class="nav-badge">Segera</span>'}`, () => rgBukaPengelola(key)));
    });
  } else {
    const r = rgRuang(), fitur = r.fitur ? new Set(r.fitur) : null;
    MENU.forEach((g) => {
      if (g.kuliahOnly && !(typeof kulBolehAkses === "function" && kulBolehAkses())) return;
      const isi = g.items.map((item) => {
        if (fitur && !fitur.has(item.key) && !item.kuliahOnly) return null;
        if (rgKhususPengisi(item.key)) return { item, kunci: true, pesan: "Hanya Admin dan Admin Pendamping yang mengisi ini." };
        const boleh = !item.adminOnly || adaAksesModul(item.key) || (item.kepsekAllowed && isKepsekOrTU()) || (item.bendaharaAllowed && typeof isBendahara === "function" && isBendahara());
        if (boleh) return { item, kunci: false };
        return g.group === "Kepegawaian" ? { item, kunci: true } : null; // Kepegawaian tetap tampil, bergembok
      }).filter(Boolean);
      if (!isi.length) return;
      tambahLabel(g.group);
      isi.forEach(({ item, kunci, pesan }) => {
        const badge = item.key === "kepsek" && STATE.kepsekAntrianCount > 0 ? `<span class="nav-badge-count">${STATE.kepsekAntrianCount > 99 ? "99+" : STATE.kepsekAntrianCount}</span>` : "";
        tambahItem(item.key, `${ikonMenu(item)}<span>${t(item.i18n)}</span>${kunci ? '<span class="nav-kunci">🔒</span>' : badge}`,
          kunci ? () => rgHalTerkunci(item, pesan) : () => showPage(item.key, item.page, item.i18n), kunci ? "rg-terkunci" : "");
      });
    });
  }
  // bagian bawah: pengaturan ruang (admin), halaman santri, kembali ke pilihan ruang
  tambahLabel(STATE.ruang === "Pg" ? "Lainnya" : "Santri & Ruang");
  if (rgRuang().jenjang) tambahItem("rg-profil", `${rgSvg("pg-beranda")}<span>Profil Lembaga</span>`, () => rgBukaProfil());
  if (rgRuang().jenjang) tambahItem("rg-santri", `${rgSvg("rg-santri")}<span>Halaman Ujian Santri</span>`, () => window.open(_rgAlamatSantri(STATE.ruang), "_blank", "noopener"));
  if (rgBisaPengaturan()) tambahItem("rg-atur", `${rgSvg("rg-atur")}<span>Pengaturan Ruang</span>`, () => rgBukaPengaturan());
  if (RG.daftar.filter((x) => rgAkses(x.id) !== "-").length > 1) tambahItem("rg-balik", `${rgSvg("rg-balik")}<span>Kembali Ke Pilihan Ruang</span>`, () => rgTampilPilih(), "rg-balik");
  renderBottomNav();
};
const _rgAlamatSantri = (id) => location.origin + location.pathname.replace(/[^/]*$/, "") + "santri.html?ruang=" + id;

// Halaman milik fitur ruang (terkunci, Pengelola, Pengaturan Ruang)
function _rgBukaHal(key, judul, html) {
  if (typeof turTutup === "function") turTutup(true); // panduan halaman sebelumnya jangan tertinggal
  let sec = qs("page-rg");
  if (!sec) { sec = document.createElement("section"); sec.className = "page"; sec.id = "page-rg"; qs("page-container").appendChild(sec); }
  qsa(".page").forEach((p) => p.classList.remove("show"));
  sec.classList.add("show");
  sec.innerHTML = html;
  STATE.currentPage = key;
  qs("topbar-title").textContent = judul;
  toggleSidebar(false);
  renderSidebar();
  window.scrollTo(0, 0);
  return sec;
}
function rgHalTerkunci(item, pesan) {
  _rgBukaHal(item.key, t(item.i18n), `<div class="card rg-terkunci-kartu"><div class="rg-gembok">🔒</div><h3>${escapeHtml(t(item.i18n))}</h3><p>${escapeHtml(pesan || "Hanya Admin yang bisa mengakses ini.")}</p></div>`);
}
// Fitur yang tersedia di ruang aktif (dipakai dasbor & kartu Fitur Baru)
function rgAdaFitur(key) {
  if (!RG.siap) return true;
  if (STATE.ruang === "Pg") return false;
  const f = rgRuang().fitur;
  return !f || f.includes(key);
}
// Di Paket A & Putri, Nilai & Rapor diisi Admin utama dan Admin Pendamping saja
const RG_NILAI_RAPOR = ["input-nilai", "rapor-umum", "rapor-diniyyah", "rapor"];
function rgKhususPengisi(key) {
  if (!RG.siap || STATE.ruang === "Pa" || !RG_NILAI_RAPOR.includes(key)) return false;
  return !(isAdmin() || rgPendamping());
}

// ── 8. Ruang Pengelola (Tahap 1: rangkuman; modul lain menyusul) ──
async function rgBukaPengelola(key = "pg-beranda") {
  if (key !== "pg-beranda") {
    const nama = RG_MENU_PENGELOLA.flatMap((g) => g.items).find((x) => x[0] === key) || [key, "", key];
    _rgBukaHal(key, nama[2], `<div class="card rg-terkunci-kartu"><div class="rg-gembok rg-gembok-svg">${rgSvg(key, "")}</div><h3>${nama[2]}</h3><p>Sedang dibangun. Untuk BOSP, rinciannya menunggu juknis & kode rekening ARKAS.</p></div>`);
    return;
  }
  const sec = _rgBukaHal(key, "Beranda Pengelola", `<div class="card"><div class="rg-memuat">Memuat rangkuman 3 jenjang…</div></div>`);
  try {
    const [s, g, k] = await Promise.all([
      supaSemua.from("siswa").select("ruang_id").eq("status_aktif", true),
      supaSemua.from("guru").select("*").eq("status_aktif", true),
      supaSemua.from("kelas").select("ruang_id"),
    ]);
    const hitung = (rows, f) => (rows || []).reduce((a, x) => { [].concat(f(x) || []).forEach((r) => { a[r] = (a[r] || 0) + 1; }); return a; }, {});
    if (s.error) throw s.error;
    const S = hitung(s.data, (x) => x.ruang_id), K = hitung(k.data, (x) => x.ruang_id);
    const G = hitung(g.data, (x) => rgRuangUtama(x)), Gjuga = hitung(g.data, (x) => (x.ruang || []).filter((r) => r !== rgRuangUtama(x)));
    const belum = (g.data || []).filter((x) => !rgRuangUtama(x)).length;
    const jenjang = RG.daftar.filter((r) => r.jenjang);
    sec.innerHTML = `<div class="rg-hero"><b>Ruang Pengelola PKBM</b><span>Rangkuman seluruh jenjang · ${escapeHtml(_namaSingkatTopbar(STATE.guruNama))}</span></div>
      <div class="rg-grid">${jenjang.map((r) => `<div class="card rg-angka" style="--rw:${r.warna}"><span class="rg-judul-angka"><i class="rg-ikon-bulat"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${(RG_INFO[r.id] || {}).svg || ""}</svg></i>${escapeHtml(r.nama)}</span>
        <b>${S[r.id] || 0}</b><small>peserta didik aktif · ${K[r.id] || 0} kelas</small>
        <div class="rg-tutor"><b>${G[r.id] || 0}</b> tutor${Gjuga[r.id] ? ` <em>· ${Gjuga[r.id]} guru jenjang lain juga mengajar di sini</em>` : ""}</div></div>`).join("")}
        <div class="card rg-angka" style="--rw:#b45309"><span class="rg-judul-angka"><i class="rg-ikon-bulat">${rgSvg("pg-total", "")}</i>Jumlah Seluruhnya</span><b>${jenjang.reduce((a, r) => a + (S[r.id] || 0), 0)}</b><small>peserta didik aktif PKBM</small>
          <div class="rg-tutor"><b>${jenjang.reduce((a, r) => a + (G[r.id] || 0), 0)}</b> tutor${belum ? ` <em>· ${belum} guru belum ditentukan ruang utamanya</em>` : ""}</div></div></div>
      <div class="card"><h3 style="margin-top:0">Modul Pengelola</h3><div class="rg-modul">${RG_MENU_PENGELOLA.slice(1).flatMap((g) => g.items).map(([k, , n]) => `<span>${rgSvg(k, "")}${n}</span>`).join("")}</div>
      <p class="rg-ket">Modul di atas dibangun bertahap. Rancangan BOSP menunggu juknis dan kode rekening ARKAS.</p></div>`;
  } catch (e) { sec.innerHTML = `<div class="card">Gagal memuat rangkuman: ${escapeHtml(e.message)}</div>`; }
}

// Ruang utama guru (tempat ia pegawai tetap) — dipakai menghitung tutor tiap jenjang tanpa dobel
function rgRuangUtama(g) {
  if (g.ruang_utama) return g.ruang_utama;
  const r = (g.ruang || []).filter((x) => x !== "Pg");
  return r.length === 1 ? r[0] : null;
}

// ── 9. Pengaturan Ruang (khusus Admin) ──
const RG_ATUR = { tab: "fitur", guru: null };
async function rgBukaPengaturan(tab) {
  if (!rgBisaPengaturan()) { toast("Hanya Admin yang bisa mengakses ini", "err"); return; }
  if (tab) RG_ATUR.tab = tab;
  const sec = _rgBukaHal("rg-atur", "Pengaturan Ruang", `<div class="card"><div class="rg-memuat">Memuat…</div></div>`);
  const tabs = [["fitur", "🧩 Fitur Per Ruang"], ["anggota", "👥 Guru Per Ruang"], ["santri", "🎒 Halaman Santri"], ["akun", "🔐 Akun Guru"], ["log", "📜 Catatan Aktivitas"]];
  const kepala = `<div class="rg-tab">${tabs.map(([k, n]) => `<button class="${RG_ATUR.tab === k ? "aktif" : ""}" onclick="rgBukaPengaturan('${k}')">${n}</button>`).join("")}</div>`;
  try {
    let isi = "";
    if (RG_ATUR.tab === "fitur") {
      const atur = RG.daftar.filter((r) => r.jenjang && r.id !== "Pa");
      const kepalaKol = atur.map((r) => `<span class="rg-ft-kol" style="--rw:${r.warna}">${rgIkonRuang(r.id)}${escapeHtml(rgNamaPendek(r.id))}</span>`).join("");
      isi = `<p class="rg-ket">Paket B & C Putra selalu lengkap. Ketuk sakelar untuk menyalakan/mematikan menu di ruang lain — berlaku saat guru membuka aplikasi berikutnya. Data tiap ruang tetap terpisah.</p>
        <div class="rg-ft-grid">${MENU.filter((grp) => !grp.kuliahOnly).map((grp) => `<div class="rg-ft-kartu"><div class="rg-ft-h"><b>${escapeHtml(grp.group)}</b><span class="rg-ft-kols">${kepalaKol}</span></div>
          ${grp.items.map((it) => `<div class="rg-ft-baris"><span class="rg-ft-ikon">${typeof svgIkon === "function" && IKON_GARIS[it.key] ? svgIkon(it.key) : `<span>${it.icon}</span>`}</span><span class="rg-ft-nama">${escapeHtml(t(it.i18n))}</span>
            <span class="rg-ft-kols">${atur.map((r) => { const on = !r.fitur || r.fitur.includes(it.key); return `<button class="rg-ft-sakelar ${on ? "on" : ""}" style="--rw:${r.warna}" onclick="rgUbahFitur('${r.id}','${it.key}')" aria-label="${escapeHtml(rgNamaPendek(r.id))}: ${on ? "matikan" : "nyalakan"}"><i></i></button>`; }).join("")}</span></div>`).join("")}</div>`).join("")}</div>`;
    } else if (RG_ATUR.tab === "anggota") {
      const r = await supaSemua.from("guru").select("*").eq("status_aktif", true).order("nama");
      if (r.error) throw r.error;
      RG_ATUR.guru = r.data || [];
      try { const p = await supaSemua.from("kuliah_pengaturan").select("ruang_id,nilai").eq("kunci", "penyelenggara"); RG_ATUR.peny = Object.fromEntries((p.data || []).map((x) => [x.ruang_id, (x.nilai && x.nilai.ids) || []])); } catch (e) { RG_ATUR.peny = {}; }
      isi = `<div id="rg-anggota">${_rgHtmlAnggota()}</div>`;
      // Guru nonaktif (tidak mengajar / tidak ada di jadwal) yang tetap boleh masuk aplikasi
      const [na] = await Promise.all([supaSemua.from("guru").select("id,nama").eq("status_aktif", false).order("nama"), _rgIdTetapMasuk()]);
      const nonaktif = na.data || [];
      isi += `<h4 style="margin:18px 0 4px">Guru Nonaktif Yang Tetap Bisa Masuk</h4>
        <p class="rg-ket">Untuk guru yang namanya ada di Data Guru tetapi tidak ada di jadwal (mis. hanya memakai Fitur Kuliah). Mereka muncul di daftar masuk dan pojok kanan atas, tetapi data jenjang hanya bisa <b>dilihat</b>. Guru yang punya akses Fitur Kuliah otomatis termasuk.</p>
        <div class="rg-nonaktif">${nonaktif.map((g) => `<label class="rg-cek"><input type="checkbox" ${RG_MASUK.ids.includes(g.id) ? "checked" : ""} onchange="rgUbahTetapMasuk('${g.id}',this.checked)"> ${escapeHtml(g.nama)}</label>`).join("") || "<small>Tidak ada guru nonaktif.</small>"}</div>`;
    } else if (RG_ATUR.tab === "santri") {
      isi = `<p class="rg-ket">Setiap jenjang punya halaman ujian santri sendiri (tanpa akun guru). Bagikan alamat ini ke santri.</p>
        ${RG.daftar.filter((r) => r.jenjang).map((r) => `<div class="rg-alamat" style="--rw:${r.warna}"><b class="rg-judul-ruang"><i class="rg-ikon-bulat">${rgIkonRuang(r.id)}</i>${escapeHtml(r.nama)}</b><code>${escapeHtml(_rgAlamatSantri(r.id))}</code>
          <span><button class="btn btn-sm" onclick="navigator.clipboard.writeText('${_rgAlamatSantri(r.id)}').then(()=>toast('Alamat disalin','ok'))">📋 Salin</button>
          <button class="btn btn-sm btn-outline" onclick="window.open('${_rgAlamatSantri(r.id)}','_blank','noopener')">↗ Buka</button></span></div>`).join("")}`;
    } else if (RG_ATUR.tab === "akun") {
      isi = typeof akIsiTabAkun === "function" ? await akIsiTabAkun() : "<p>Fitur akun belum dimuat.</p>";
    } else {
      const r = await supaSemua.from("log_aktivitas").select("waktu,ruang_id,nama,aksi,rincian").order("waktu", { ascending: false }).limit(200);
      if (r.error) throw r.error;
      RG_LOG.data = r.data || [];
      isi = `<div id="rg-log">${_rgHtmlLog()}</div>`;
    }
    sec.innerHTML = `<div class="card">${kepala}${isi}</div>`;
  } catch (e) { sec.innerHTML = `<div class="card">${kepala}<p>Gagal memuat: ${escapeHtml(e.message)}</p></div>`; }
}
async function rgUbahFitur(ruangId, key) {
  const r = RG.daftar.find((x) => x.id === ruangId);
  if (!r) return;
  const semua = MENU.flatMap((g) => g.items.map((i) => i.key));
  const set = new Set(r.fitur || semua);
  set.has(key) ? set.delete(key) : set.add(key);
  const fitur = semua.filter((k) => set.has(k));
  const { error } = await supaSemua.from("ruang").update({ fitur, updated_at: new Date().toISOString() }).eq("id", ruangId);
  if (error) { toast("Gagal menyimpan: " + error.message, "err"); return; }
  r.fitur = fitur;
  _rgLog("ubah-fitur-ruang", { ruang: ruangId, fitur: key, aktif: set.has(key) });
  rgBukaPengaturan("fitur");
}
async function rgUbahTetapMasuk(guruId, centang) {
  await _rgIdTetapMasuk();
  const ids = new Set(RG_MASUK.ids);
  centang ? ids.add(guruId) : ids.delete(guruId);
  const { error } = await supaSemua.from("kuliah_pengaturan").upsert({ ruang_id: "*", kunci: "masuk_akses", nilai: { ids: [...ids], diubah: new Date().toISOString() } });
  if (error) { toast("Gagal menyimpan: " + error.message, "err"); rgBukaPengaturan("anggota"); return; }
  RG_MASUK.ids = [...ids];
  _rgLog("tetap-bisa-masuk", { guru: guruId, aktif: centang });
  try { STATE.daftarGuru = await apiGetDaftarGuru(); } catch (e) {}
  toast(centang ? "Guru ini sekarang bisa masuk aplikasi" : "Guru ini tidak lagi muncul di daftar masuk", "ok");
}
// ── Guru Per Ruang: kartu per guru, pil ruang berwarna (ketuk = mengajar / tidak) ──
const RG_ANG = { cari: "", saring: "semua" };
function _rgHtmlAnggota() {
  const daftar = RG_ATUR.guru || [], kol = RG.daftar;
  const jumlah = Object.fromEntries(kol.map((x) => [x.id, daftar.filter((g) => (g.ruang || []).includes(x.id)).length]));
  const cari = RG_ANG.cari.toLowerCase();
  const tampil = daftar.filter((g) => (!cari || g.nama.toLowerCase().includes(cari)) && (RG_ANG.saring === "semua" || (g.ruang || []).includes(RG_ANG.saring)));
  const pil = (g, x) => {
    const on = (g.ruang || []).includes(x.id), pend = (g.ruang_pendamping || []).includes(x.id), utama = x.jenjang && rgRuangUtama(g) === x.id;
    return `<div class="rg-pil ${on ? "on" : ""}" style="--rw:${x.warna}">
      <button class="rg-pil-b" onclick="rgTogAnggota('${g.id}','${x.id}')" title="${on ? "Keluarkan dari" : "Tambahkan ke"} ${escapeHtml(x.nama)}"><i class="rg-pil-titik"></i>${escapeHtml(x.id === "Pa" ? "Putra" : x.id === "Pi" ? "Putri" : x.id === "Pg" ? "Pengelola" : x.nama)}</button>
      ${on && x.jenjang ? `<button class="rg-pil-k ${utama ? "aktif" : ""}" onclick="rgTogUtama('${g.id}','${x.id}')" title="Ruang utama (pegawai tetap)">Utama</button><button class="rg-pil-k ${pend ? "aktif" : ""}" onclick="rgUbahAnggota('${g.id}','${x.id}','ruang_pendamping',${!pend})" title="Admin Pendamping ruang ini">Pendamping</button>${x.id !== "Pa" ? `<button class="rg-pil-k ${((RG_ATUR.peny || {})[x.id] || []).includes(g.id) ? "aktif" : ""}" onclick="rgTogPenyelenggara('${g.id}','${x.id}')" title="Penyelenggara jenjang ini: menerima notifikasi & menyetujui izin/sakit/tukar jam">Penyelenggara</button>` : ""}` : ""}
    </div>`;
  };
  return `<p class="rg-ket">Ketuk nama ruang untuk menambah/mengeluarkan guru. Pada ruang yang aktif: <b>Utama</b> = tempat guru menjadi pegawai tetap (dihitung sebagai tutor jenjang itu), <b>Pendamping</b> = Admin Pendamping ruang itu. <b>Penyelenggara</b> (Paket A/Putri) = menerima notifikasi dan bisa menyetujui/menolak izin, sakit, dan tukar jam di jenjangnya. Guru baru Paket A/Putri cukup ditambahkan lewat <b>Data Guru</b> di ruangnya — otomatis masuk ruang itu.</p>
    <div class="rg-ang-alat"><input class="input" placeholder="Cari nama guru…" value="${escapeHtml(RG_ANG.cari)}" oninput="RG_ANG.cari=this.value;_rgSegarAnggota(true)">
      <div class="rg-ang-saring">${[["semua", "Semua", daftar.length, "#64748b"], ...kol.map((x) => [x.id, x.id === "Pa" ? "Putra" : x.id === "Pi" ? "Putri" : x.id === "Pg" ? "Pengelola" : x.nama, jumlah[x.id], x.warna])].map(([k, n, j, w]) => `<button class="${RG_ANG.saring === k ? "aktif" : ""}" style="--rw:${w}" onclick="RG_ANG.saring='${k}';_rgSegarAnggota()">${escapeHtml(n)} <b>${j}</b></button>`).join("")}</div></div>
    <div class="rg-ang-daftar">${tampil.map((g) => `<div class="rg-ang-baris"><div class="rg-ang-nama"><b>${escapeHtml(g.nama)}</b><small>${(g.ruang || []).length} ruang</small></div><div class="rg-ang-pil">${kol.map((x) => pil(g, x)).join("")}</div></div>`).join("") || '<div class="rg-ket">Tidak ada guru yang cocok.</div>'}</div>`;
}
function _rgSegarAnggota(tetapFokus) {
  const w = qs("rg-anggota"); if (!w) return;
  const pos = tetapFokus ? w.querySelector(".rg-ang-alat input")?.selectionStart : null;
  w.innerHTML = _rgHtmlAnggota();
  if (tetapFokus) { const i = w.querySelector(".rg-ang-alat input"); i.focus(); try { i.setSelectionRange(pos, pos); } catch (e) {} }
}
async function rgTogAnggota(guruId, ruangId) {
  const g = (RG_ATUR.guru || []).find((x) => x.id === guruId); if (!g) return;
  await rgUbahAnggota(guruId, ruangId, "ruang", !(g.ruang || []).includes(ruangId));
}
async function rgTogUtama(guruId, ruangId) { await rgUbahUtama(guruId, ruangId); }
async function rgUbahUtama(guruId, ruangId) {
  const g = (RG_ATUR.guru || []).find((x) => x.id === guruId);
  if (!g) return;
  if (!("ruang_utama" in g)) { toast("Jalankan SQL_PKBM_3_TUTOR.sql dulu", "warn"); rgBukaPengaturan("anggota"); return; }
  const { error } = await supaSemua.from("guru").update({ ruang_utama: ruangId }).eq("id", guruId);
  if (error) { toast("Gagal menyimpan: " + error.message, "err"); rgBukaPengaturan("anggota"); return; }
  g.ruang_utama = ruangId;
  _rgSegarAnggota();
  _rgLog("ubah-ruang-utama", { guru: g.nama, ruang: ruangId });
  toast(`${_namaSingkatTopbar(g.nama)}: ruang utama ${rgRuang(ruangId).nama}`, "ok");
}
async function rgUbahAnggota(guruId, ruangId, kolom, centang) {
  const g = (RG_ATUR.guru || []).find((x) => x.id === guruId);
  if (!g) return;
  const set = new Set(g[kolom] || []);
  centang ? set.add(ruangId) : set.delete(ruangId);
  if (kolom === "ruang" && !set.size) { toast("Guru harus punya minimal satu ruang", "warn"); return; }
  const nilai = [...set];
  const { error } = await supaSemua.from("guru").update({ [kolom]: nilai }).eq("id", guruId);
  if (error) { toast("Gagal menyimpan: " + error.message, "err"); rgBukaPengaturan("anggota"); return; }
  g[kolom] = nilai;
  _rgSegarAnggota();
  _rgLog("ubah-ruang-guru", { guru: g.nama, ruang: ruangId, peran: kolom === "ruang" ? "anggota" : "pendamping", aktif: centang });
  toast(`${_namaSingkatTopbar(g.nama)}: ${centang ? "ditambahkan ke" : "dikeluarkan dari"} ${rgRuang(ruangId).nama}${kolom === "ruang_pendamping" ? " (Pendamping)" : ""}`, "ok");
}

// ── 10. Admin Pendamping = Admin Kedua di ruangnya (bawaan: Data Guru, Data Siswa, Kepegawaian) ──
const _rgAdminKeduaAsli = isAdminKedua;
isAdminKedua = function () { if (RG.siap && rgPendamping() && !isAdmin()) return true; return _rgAdminKeduaAsli(); };
const _rgIzinAsli = _menuDiizinkanAdminKedua;
_menuDiizinkanAdminKedua = function (k) {
  if (RG.siap && rgPendamping()) {
    const izin = (LOOKUP.adminIzin || []).find((a) => a.guru_id === STATE.guruId);
    if (izin && (izin.menu_keys || []).length) return izin.menu_keys.includes(k);
    return ["data-guru", "data-siswa", "kepsek", "insentif-musyrif", "laporan-kinerja", "riwayat-terhapus"].includes(k);
  }
  return _rgIzinAsli(k);
};

// ── 11. Penjaga halaman: fitur yang tidak ada di ruang ini / Nilai & Rapor khusus pengisi ──
const _rgShowAsli = showPage;
showPage = function (key, ...sisa) {
  if (RG.siap && STATE.ruang !== "Pg") {
    const item = MENU.flatMap((g) => g.items).find((x) => x.key === key);
    if (item && rgKhususPengisi(key)) return rgHalTerkunci(item, "Hanya Admin dan Admin Pendamping yang mengisi ini.");
    if (item && key !== "dashboard" && !item.kuliahOnly && !rgAdaFitur(key)) { toast(`Fitur ini tidak tersedia di ${rgRuang().nama}`, "warn"); return; }
  }
  return _rgShowAsli(key, ...sisa);
};

// ── 12. Insentif & slip per ruang: di Paket A lajur pertama bernama "JP Paket A" ──
const _rgTAsli = t;
t = function (k, ...a) {
  if (STATE.ruang === "A" && k === "jpPaketB") return "JP Paket A";
  return _rgTAsli(k, ...a);
};


// ── 13. Pengaturan per jenjang = bagian ABSEN saja; pengaturan utama (kop, logo, nama lembaga, tahun ajaran,
//        penilaian, dsb.) tetap dari Paket B & C Putra ──
// Milik masing-masing ruang: absen (lokasi bisa beda per jenjang), nama lembaga di kop, desain Kalender Akademik
const RG_KOLOM_ABSEN = ["lokasi_lat", "lokasi_lng", "radius_meter", "blokir_hari_minggu", "toleransi_masuk_menit", "batas_pulang_menit", "minggu_ganjil_genap_acuan",
  "nama_lembaga_kop", "kaldik_latar_url", "kaldik_latar_pos_x", "kaldik_latar_pos_y", "kaldik_latar_zoom", "kaldik_latar_opacity", "kaldik_warna_judul", "kaldik_warna_teks", "kaldik_teks_panel", "kaldik_logo_ukuran", "kaldik_ukuran_judul"];
const rgPengaturanIkutPutra = () => STATE.ruang === "A" || STATE.ruang === "Pi";
const _rgPengAmbilAsli = apiGetPengaturanSekolah;
apiGetPengaturanSekolah = async function () {
  const sendiri = await _rgPengAmbilAsli();
  if (!rgPengaturanIkutPutra()) return sendiri;
  try {
    const r = await supaSemua.from("pengaturan_sekolah").select(KOLOM_PENGATURAN_SEKOLAH_PUBLIK).eq("ruang_id", "Pa").eq("id", 1).limit(1);
    const pa = r.data && r.data[0];
    if (!pa) return sendiri;
    const hasil = { ...pa };
    RG_KOLOM_ABSEN.forEach((k) => { if (sendiri && k in sendiri) hasil[k] = sendiri[k]; });
    return hasil;
  } catch (e) { return sendiri; }
};
const _rgPengSimpanAsli = apiSimpanPengaturanSekolah;
// Nama Kepala PKBM sama di semua ruang: diubah di satu ruang → ikut berubah di ruang lain
async function _rgSamakanKepala(nama) {
  try { await supaSemua.from("pengaturan_sekolah").update({ kepala_pkbm: nama }).eq("id", 1); } catch (e) {}
}
apiSimpanPengaturanSekolah = async function (data) {
  if (!rgPengaturanIkutPutra()) { const h = await _rgPengSimpanAsli(data); if (data && data.kepala_pkbm && RG.siap) await _rgSamakanKepala(data.kepala_pkbm); return h; }
  // milik ruang ini → baris ruang ini; pengaturan bersama → baris Putra (pengaturan utama)
  const isi = {}, bersama = {};
  Object.entries(data || {}).forEach(([k, v]) => { (RG_KOLOM_ABSEN.includes(k) ? isi : bersama)[k] = v; });
  delete bersama.admin_pin; delete bersama.id;
  if (data && data.kepala_pkbm) { await _rgSamakanKepala(data.kepala_pkbm); delete bersama.kepala_pkbm; }
  if (Object.keys(isi).length) await _rgPengSimpanAsli(isi);
  if (Object.keys(bersama).length) {
    const { error } = await supaSemua.from("pengaturan_sekolah").update({ ...bersama, updated_at: new Date().toISOString() }).eq("ruang_id", "Pa").eq("id", 1);
    if (error) throw new Error(error.message);
  }
  return apiGetPengaturanSekolah();
};
const _rgTabPengAsli = pilihTabPengaturan;
pilihTabPengaturan = function (kode) {
  if (!rgPengaturanIkutPutra()) return _rgTabPengAsli(kode);
  _rgTabPengAsli("absensi");
  qsa("#pg-tab-bar button").forEach((b) => { b.hidden = b.dataset.tab !== "absensi"; });
  if (!qs("rg-peng-ket")) qs("pg-tab-bar")?.insertAdjacentHTML("afterend", `<div id="rg-peng-ket" class="rg-ket" style="margin:0 0 10px">Di ${escapeHtml(rgRuang().nama)}, pengaturan yang terpisah hanya bagian <b>Absensi</b> (lokasi, radius, jam masuk/pulang, hari libur). Pengaturan lain mengikuti Paket B & C Putra.</div>`);
};


// ── 14. Catatan Aktivitas: linimasa per hari, kalimat yang mudah dibaca, saring per ruang ──
const RG_LOG = { data: [], ruang: "semua", cari: "" };
function _rgKalimatLog(x) {
  const r = x.rincian || {}, nm = (id) => escapeHtml(rgNamaPendek(id));
  const guru = (v) => `<b>${escapeHtml(_namaSingkatTopbar(v || "guru"))}</b>`;
  switch (x.aksi) {
    case "pindah-ruang": return `membuka ruang <b>${nm(r.ke)}</b> (dari ${nm(r.dari)})`;
    case "ubah-ruang-guru":
      if (r.peran === "anggota") return `${r.aktif ? "menambahkan" : "mengeluarkan"} ${guru(r.guru)} ${r.aktif ? "ke" : "dari"} <b>${nm(r.ruang)}</b>`;
      if (r.peran === "pendamping") return `${r.aktif ? "menjadikan" : "mencabut"} ${guru(r.guru)} ${r.aktif ? "sebagai" : "dari"} Admin Pendamping <b>${nm(r.ruang)}</b>`;
      if ("ruang_pendamping" in r) return `${r.ruang_pendamping ? "menjadikan" : "mencabut"} ${guru(r.guru)} ${r.ruang_pendamping ? "sebagai" : "dari"} Admin Pendamping ${nm(r.ruang)}`;
      return `${r.ruang === false || r.ruang === true ? (r.ruang ? "menambahkan" : "mengeluarkan") : "mengubah ruang"} ${guru(r.guru)} ${r.ruang ? "ke" : "dari"} ruang`;
    case "ubah-ruang-utama": return `menetapkan ruang utama ${guru(r.guru)}: <b>${nm(r.ruang)}</b>`;
    case "ubah-fitur-ruang": { const it = MENU.flatMap((m) => m.items).find((m) => m.key === r.fitur); return `${r.aktif ? "menyalakan" : "mematikan"} menu <b>${escapeHtml(it ? t(it.i18n) : r.fitur)}</b> di ${nm(r.ruang)}`; }
    case "buat-akun": return `membuat akun untuk ${guru(r.guru)}`;
    case "ubah-akun": return `mengubah email akun ${guru(r.guru)}`;
    case "reset-sandi": return `mereset sandi ${guru(r.guru)}`;
    case "hapus-akun": return `menghapus akun ${guru(r.guru)}`;
    case "masuk-akun": return `masuk dengan akun${r.perangkat ? ` dari <b>${escapeHtml(r.perangkat)}</b>` : ""}`;
    case "akun-wajib": return `${r.aktif ? "menyalakan" : "mematikan"} <b>Wajib Masuk Dengan Akun</b>`;
    case "ubah-penyelenggara": return `${r.aktif ? "menjadikan" : "mencabut"} ${guru(r.guru)} ${r.aktif ? "sebagai" : "dari"} Penyelenggara <b>${nm(r.ruang)}</b>`;
    case "tetap-bisa-masuk": return `${r.aktif ? "mengizinkan" : "mencabut izin"} guru nonaktif masuk aplikasi`;
    case "lihat-nik": return `melihat NIK/KK ${guru(r.siswa || r.nama)}`;
    default: return escapeHtml(x.aksi.replace(/-/g, " "));
  }
}
function _rgIkonLog(aksi) {
  return /akun|sandi|masuk/.test(aksi) ? "rg-akun" : aksi === "pindah-ruang" ? "rg-balik" : /fitur/.test(aksi) ? "rg-atur" : "pg-ptk";
}
function _rgHtmlLog() {
  const cari = RG_LOG.cari.toLowerCase();
  const data = RG_LOG.data.filter((x) => (RG_LOG.ruang === "semua" || x.ruang_id === RG_LOG.ruang) && (!cari || (String(x.nama || "") + " " + _rgKalimatLog(x).replace(/<[^>]+>/g, "")).toLowerCase().includes(cari)));
  const hari = {};
  data.forEach((x) => { const k = new Date(x.waktu).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" }); (hari[k] = hari[k] || []).push(x); });
  const pilihan = [["semua", "Semua", "#64748b"], ...RG.daftar.map((r) => [r.id, rgNamaPendek(r.id), r.warna])];
  return `<div class="rg-log-alat"><input class="input" placeholder="Cari nama atau aktivitas…" value="${escapeHtml(RG_LOG.cari)}" oninput="RG_LOG.cari=this.value;_rgSegarLog()">
      <div class="rg-ang-saring">${pilihan.map(([k, n, w]) => `<button class="${RG_LOG.ruang === k ? "aktif" : ""}" style="--rw:${w}" onclick="RG_LOG.ruang='${k}';_rgSegarLog()">${escapeHtml(n)}</button>`).join("")}</div></div>
    <p class="rg-ket">${data.length} dari ${RG_LOG.data.length} aktivitas terakhir. Hanya Admin yang bisa melihat catatan ini.</p>
    ${Object.entries(hari).map(([tgl, xs]) => `<div class="rg-log-hari"><div class="rg-log-tgl">${escapeHtml(tgl)}</div>
      ${xs.map((x) => { const r = rgRuang(x.ruang_id); return `<div class="rg-log-baris"><span class="rg-log-jam">${new Date(x.waktu).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</span>
        <span class="rg-log-titik" style="--rw:${r.warna}">${rgSvg(_rgIkonLog(x.aksi), "")}</span>
        <div class="rg-log-isi"><div><b>${escapeHtml(_namaSingkatTopbar(x.nama || "Sistem"))}</b> ${_rgKalimatLog(x)}</div>
          <span class="rg-log-ruang" style="--rw:${r.warna}">${rgIkonRuang(r.id)}${escapeHtml(rgNamaPendek(r.id))}</span></div></div>`; }).join("")}</div>`).join("") || '<div class="rg-ket">Belum ada catatan.</div>'}`;
}
function _rgSegarLog() {
  const w = qs("rg-log"); if (!w) return;
  const i = w.querySelector(".rg-log-alat input"), pos = document.activeElement === i ? i.selectionStart : null;
  w.innerHTML = _rgHtmlLog();
  if (pos !== null) { const j = w.querySelector(".rg-log-alat input"); j.focus(); try { j.setSelectionRange(pos, pos); } catch (e) {} }
}

// ── 15. Data Guru per jenjang: Honda & nonaktif dicatat per ruang (SQL_PKBM_7_GURU_PER_RUANG.sql) ──
function _rgGuruPerRuang(g) {
  const X = STATE.ruang, o = { ...g };
  if (g && "honda_ruang" in g) { const m = g.honda_ruang || {}; o.penerima_honda = X in m ? m[X] : X === "Pa" ? g.penerima_honda : null; }
  if (g && Array.isArray(g.ruang_nonaktif) && g.ruang_nonaktif.includes(X)) o.status_aktif = false;
  return o;
}
const _rgGetAllGuruAsli = apiGetAllGuru;
// Wali kelas PER RUANG: sumbernya kolom kelas.wali_kelas_id milik ruang ini, jadi satu guru bisa
// menjadi wali kelas di Putra dan di Paket A sekaligus. Putra yang belum memakai kelas.wali_kelas_id
// tetap memakai guru.wali_kelas_id lama.
async function _rgPetaWaliRuang() {
  try { const r = await supa.from("kelas").select("id,wali_kelas_id"); return r.error ? null : (r.data || []); } catch (e) { return null; }
}
function _rgPasangWali(g, kelas) {
  if (!kelas || !g) return g;
  const k = kelas.find((x) => x.wali_kelas_id === g.id);
  const milikRuang = kelas.some((x) => x.id === g.wali_kelas_id);
  return { ...g, wali_kelas_id: k ? k.id : milikRuang && !kelas.some((x) => x.wali_kelas_id && x.id === g.wali_kelas_id && x.wali_kelas_id !== g.id) ? g.wali_kelas_id : null };
}
apiGetAllGuru = async function () {
  const [rows, kelas] = await Promise.all([_rgGetAllGuruAsli(), RG.siap ? _rgPetaWaliRuang() : null]);
  return rows.map(_rgGuruPerRuang).map((x) => _rgPasangWali(x, kelas));
};
const _rgDetailAsli = apiGetGuruDetail;
apiGetGuruDetail = async function (id) {
  const [g, kelas] = await Promise.all([_rgDetailAsli(id), RG.siap ? _rgPetaWaliRuang() : null]);
  return g ? _rgPasangWali(_rgGuruPerRuang(g), kelas) : g;
};
const _rgSimpanGuruAsli = apiSimpanGuru;
apiSimpanGuru = async function (row) {
  if (row && row.id && RG.siap && "wali_kelas_id" in row) {
    // wali kelas disimpan di kelas ruang ini (bukan menimpa wali kelas guru itu di ruang lain)
    const baru = row.wali_kelas_id || null;
    const lepas = await supa.from("kelas").update({ wali_kelas_id: null }).eq("wali_kelas_id", row.id);
    if (lepas.error) throw new Error(lepas.error.message);
    if (baru) { const r = await supa.from("kelas").update({ wali_kelas_id: row.id }).eq("id", baru); if (r.error) throw new Error(r.error.message); }
    row = { ...row };
    if (STATE.ruang !== "Pa") delete row.wali_kelas_id; // kolom lama tetap milik Putra
    if (Object.keys(row).length <= 1) return [row];
  }
  if (!row || !row.id || !RG.siap || !("penerima_honda" in row || "status_aktif" in row)) return _rgSimpanGuruAsli(row);
  const X = STATE.ruang, isi = { ...row };
  const { data: lama, error } = await supaSemua.from("guru").select("honda_ruang,ruang_nonaktif,ruang,status_aktif").eq("id", row.id).maybeSingle();
  if (error || !lama || !("honda_ruang" in lama)) return _rgSimpanGuruAsli(row); // SQL belum dijalankan → cara lama
  if ("penerima_honda" in isi) {
    isi.honda_ruang = { ...(lama.honda_ruang || {}), [X]: isi.penerima_honda };
    if (X !== "Pa") delete isi.penerima_honda; // kolom lama tetap milik Putra
  }
  if ("status_aktif" in isi) {
    const set = new Set(lama.ruang_nonaktif || []);
    isi.status_aktif ? set.delete(X) : set.add(X);
    isi.ruang_nonaktif = [...set];
    isi.status_aktif = (lama.ruang || []).some((r) => !set.has(r)); // aktif bila masih aktif di salah satu ruangnya
  }
  return _rgSimpanGuruAsli(isi);
};
apiHapusGuru = async function (id) { return apiSimpanGuru({ id, status_aktif: false }); };

// ── 16. Layar pilih nama: pilihan ruang di atas daftar (daftar nama mengikuti ruang) ──
const _rgPilihGuruAsli = openPilihGuru;
openPilihGuru = function () {
  const hasil = _rgPilihGuruAsli();
  const panel = qs("modal-panel"), sel = qs("pilih-guru-select");
  if (panel && sel && !qs("rg-pilih-ruang-mini")) {
    const ruang = (RG.daftar.length ? RG.daftar : RG.bawaan).filter((r) => r.jenjang);
    const el = document.createElement("div");
    el.id = "rg-pilih-ruang-mini"; el.className = "rg-mini";
    el.innerHTML = `<small>Ruang</small>${ruang.map((r) => `<button type="button" class="${r.id === STATE.ruang ? "aktif" : ""}" style="--rw:${r.warna}" onclick="rgGantiRuangMasuk('${r.id}')">${rgIkonRuang(r.id)}${escapeHtml(rgNamaPendek(r.id))}</button>`).join("")}`;
    sel.closest(".field")?.insertAdjacentElement("beforebegin", el);
  }
  return hasil;
};
function rgGantiRuangMasuk(id) {
  if (id === STATE.ruang) return;
  try { localStorage.setItem("ruangAktif", id); } catch (e) {}
  _rgTransisi(id);
  setTimeout(() => location.reload(), 350);
}

// ── 17. Builder jadwal: beri tahu bila ruang ini belum punya daftar mata pelajaran ──
const _rgBuilderAsli = renderJadwalBuilder;
renderJadwalBuilder = async function () {
  await ensureLookups();
  const wrap = qs("jadwal-builder");
  if (wrap && !(LOOKUP.mapel || []).length) {
    wrap.innerHTML = `<div class="card rg-kosong-mapel"><b>Belum ada mata pelajaran di ${escapeHtml(rgRuang().nama)}</b>
      <p>Builder menyusun jadwal dari daftar mata pelajaran ruang ini. Tambahkan mapel dulu di menu <b>Kurikulum</b>, lalu kembali ke Builder.</p>
      <button class="btn btn-accent" onclick="showPage('kurikulum','page-kurikulum','menuKurikulum')">Buka Kurikulum</button></div>`;
    return;
  }
  return _rgBuilderAsli();
};

// ── 18. Builder jadwal: jam bawaan ruang (kunci "jadwal:slot_bawaan") langsung tampil sebagai baris jam ──
const _rgGridAsli = renderGridBuilder;
renderGridBuilder = async function () {
  try {
    const d = await _kvAmbil("jadwal:slot_bawaan", null);
    (d && d.slot || []).forEach((s) => { if (!JB_EXTRA_SLOTS.some((x) => x.jam_mulai === s.jam_mulai && x.jam_selesai === s.jam_selesai)) JB_EXTRA_SLOTS.push({ jam_mulai: s.jam_mulai, jam_selesai: s.jam_selesai }); });
  } catch (e) {}
  return _rgGridAsli();
};

// ── 19. Profil Lembaga per ruang (kunci "profil_lembaga"): visi, misi, program unggulan, sarana prasarana ──
const RG_PROFIL = { data: null };
const rgBolehUbahProfil = () => isAdmin() || rgPendamping();
async function rgBukaProfil() {
  const sec = _rgBukaHal("rg-profil", "Profil Lembaga", `<div class="card"><div class="rg-memuat">Memuat profil…</div></div>`);
  RG_PROFIL.data = await _kvAmbil("profil_lembaga", null);
  const p = RG_PROFIL.data, r = rgRuang(), e = escapeHtml, boleh = rgBolehUbahProfil() && !STATE.modeLihat;
  if (!p) { sec.innerHTML = `<div class="card rg-kosong-mapel"><b>Profil ${e(r.nama)} belum diisi</b><p>Isi visi, misi, program unggulan, dan sarana prasarana lembaga.</p>${boleh ? `<button class="btn btn-accent" onclick="rgUbahProfil()">Isi Profil</button>` : ""}</div>`; return; }
  const KONDISI = ["", "Baik", "Rusak Ringan", "Rusak Berat"];
  sec.innerHTML = `<div class="rg-pf-hero" style="--rw:${r.warna}"><div class="rg-pf-logo">${htmlLogoSekolah(52)}</div><div><small>${e(p.yayasan || "")}</small><h2>${e(p.nama || r.nama)}</h2><p>${e(p.ringkas || "")}</p>${p.instagram ? `<span class="rg-pf-ig">@${e(p.instagram)}</span>` : ""}</div>
      ${boleh ? `<button class="btn btn-sm rg-pf-ubah" onclick="rgUbahProfil()">Ubah Profil</button>` : ""}</div>
    <div class="rg-pf-grid">
      <div class="card"><h3>Visi</h3><p class="rg-pf-visi">${e(p.visi || "-")}</p></div>
      <div class="card"><h3>Misi</h3><ol class="rg-pf-list">${(p.misi || []).map((x) => `<li>${e(x)}</li>`).join("")}</ol></div>
    </div>
    <div class="card"><h3>Program Unggulan</h3><ul class="rg-pf-list">${(p.program || []).map((x) => `<li>${e(x)}</li>`).join("")}</ul></div>
    <div class="card"><div class="rg-pf-h3"><h3>Sarana & Prasarana</h3><small>${(p.sarpras || []).length} jenis · kondisi dicatat untuk akreditasi & laporan Dinas</small></div>
      <div class="table-wrap"><table class="table rg-pf-sarpras"><thead><tr><th>Sarana</th><th style="width:90px">Jumlah</th><th style="width:150px">Kondisi</th><th>Keterangan</th></tr></thead><tbody>
      ${(p.sarpras || []).map((s, i) => `<tr><td><b>${e(s.nama)}</b></td>
        <td>${boleh ? `<input class="input" type="number" min="0" value="${s.jumlah ?? ""}" onchange="rgSimpanSarpras(${i},'jumlah',this.value)">` : e(s.jumlah ?? "-")}</td>
        <td>${boleh ? `<select class="input rg-kondisi k${KONDISI.indexOf(s.kondisi)}" onchange="rgSimpanSarpras(${i},'kondisi',this.value)">${KONDISI.map((k) => `<option value="${k}" ${k === (s.kondisi || "") ? "selected" : ""}>${k || "Belum dicatat"}</option>`).join("")}</select>` : `<span class="rg-kondisi k${KONDISI.indexOf(s.kondisi)}">${e(s.kondisi || "Belum dicatat")}</span>`}</td>
        <td>${boleh ? `<input class="input" value="${e(s.ket || "")}" placeholder="mis. 2 lantai, 6 ruang" onchange="rgSimpanSarpras(${i},'ket',this.value)">` : e(s.ket || "")}</td></tr>`).join("")}
      </tbody></table></div></div>
    ${p.sumber ? `<p class="rg-ket">Sumber: ${e(p.sumber)}</p>` : ""}`;
}
async function rgSimpanSarpras(i, kolom, nilai) {
  const p = RG_PROFIL.data; if (!p || !p.sarpras[i]) return;
  p.sarpras[i][kolom] = kolom === "jumlah" ? (nilai === "" ? null : +nilai) : nilai;
  try { RG_PROFIL.data = await _kvGabung("profil_lembaga", { sarpras: p.sarpras, diubah: new Date().toISOString() }); toast("Tersimpan", "ok"); if (kolom === "kondisi") rgBukaProfil(); }
  catch (e) { toast("Gagal menyimpan: " + e.message, "err"); }
}
function rgUbahProfil() {
  const p = RG_PROFIL.data || {}, e = escapeHtml;
  openModal(`<h3>Ubah Profil Lembaga</h3>
    <div class="field"><label class="form-label">Nama Lembaga</label><input id="pf-nama" class="input" value="${e(p.nama || rgRuang().nama)}"></div>
    <div class="field"><label class="form-label">Yayasan</label><input id="pf-yayasan" class="input" value="${e(p.yayasan || "")}"></div>
    <div class="field"><label class="form-label">Deskripsi Singkat</label><textarea id="pf-ringkas" class="input" rows="3">${e(p.ringkas || "")}</textarea></div>
    <div class="field"><label class="form-label">Visi</label><textarea id="pf-visi" class="input" rows="3">${e(p.visi || "")}</textarea></div>
    <div class="field"><label class="form-label">Misi (satu baris satu misi)</label><textarea id="pf-misi" class="input" rows="5">${e((p.misi || []).join("\n"))}</textarea></div>
    <div class="field"><label class="form-label">Program Unggulan (satu baris satu program)</label><textarea id="pf-program" class="input" rows="4">${e((p.program || []).join("\n"))}</textarea></div>
    <div class="field"><label class="form-label">Daftar Sarana (satu baris satu sarana)</label><textarea id="pf-sarpras" class="input" rows="6">${e((p.sarpras || []).map((s) => s.nama).join("\n"))}</textarea></div>
    <div class="field"><label class="form-label">Instagram (tanpa @)</label><input id="pf-ig" class="input" value="${e(p.instagram || "")}"></div>
    <button class="btn btn-accent" style="width:100%" onclick="rgSimpanProfil()">Simpan</button>`, { lebar: true });
}
async function rgSimpanProfil() {
  const baris = (id) => qs(id).value.split("\n").map((x) => x.trim()).filter(Boolean);
  const lama = Object.fromEntries(((RG_PROFIL.data || {}).sarpras || []).map((s) => [s.nama, s]));
  const isi = { nama: qs("pf-nama").value.trim(), yayasan: qs("pf-yayasan").value.trim(), ringkas: qs("pf-ringkas").value.trim(), visi: qs("pf-visi").value.trim(),
    misi: baris("pf-misi"), program: baris("pf-program"), instagram: qs("pf-ig").value.trim().replace(/^@/, ""),
    sarpras: baris("pf-sarpras").map((n) => lama[n] || { nama: n, jumlah: null, kondisi: "", ket: "" }), diubah: new Date().toISOString() };
  try { await _kvGabung("profil_lembaga", isi); _rgLog("ubah-profil-lembaga", {}); closeModal(); toast("Profil tersimpan", "ok"); rgBukaProfil(); }
  catch (e) { toast("Gagal menyimpan: " + e.message, "err"); }
}


// ── 20. Penyelenggara jenjang (kunci "penyelenggara" per ruang): hak seperti Kepala Sekolah di ruangnya —
//        menerima notifikasi & menyetujui/menolak izin, sakit, tukar jam ──
async function rgTogPenyelenggara(guruId, ruangId) {
  const ids = new Set((RG_ATUR.peny || {})[ruangId] || []);
  const aktif = !ids.has(guruId);
  aktif ? ids.add(guruId) : ids.delete(guruId);
  const { error } = await supaSemua.from("kuliah_pengaturan").upsert({ ruang_id: ruangId, kunci: "penyelenggara", nilai: { ids: [...ids], diubah: new Date().toISOString() } }, { onConflict: "ruang_id,kunci" });
  if (error) { toast("Gagal menyimpan: " + error.message, "err"); return; }
  (RG_ATUR.peny = RG_ATUR.peny || {})[ruangId] = [...ids];
  if (ruangId === STATE.ruang) RG.penyelenggara = [...ids];
  const gg = (RG_ATUR.guru || []).find((x) => x.id === guruId);
  _rgLog("ubah-penyelenggara", { guru: gg && gg.nama, ruang: ruangId, aktif });
  toast(`${_namaSingkatTopbar(gg ? gg.nama : "")}: ${aktif ? "menjadi" : "bukan lagi"} Penyelenggara ${rgNamaPendek(ruangId)}`, "ok");
  _rgSegarAnggota();
}
const _rgKepsekAsli = isKepsek;
isKepsek = function () {
  if (typeof RG !== "undefined" && RG.siap && (RG.penyelenggara || []).includes(STATE.guruId) && !isAdmin()) return true;
  return _rgKepsekAsli();
};

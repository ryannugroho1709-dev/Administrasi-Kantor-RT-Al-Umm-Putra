// ============================================================
//  MODUL: KULIAH — ruang belajar pribadi
//  • S1 Psikologi Islam (IOU): folder kuliah-s1/  • S2 Ulumul Qur'an (Shofwa): folder kuliah-s2/
//    Keduanya dibuka layar penuh (iframe) — mesin & desain Forum Kuliah (materi bergambar, latihan
//    & game, arena UTS/UAS, muraja'ah, transkrip). Isi materi berupa file statis (tidak memakai kuota
//    Supabase); kemajuan belajar disimpan di perangkat lalu disinkronkan ke 1 baris kuliah_pengaturan
//    per program per pengguna (kunci "s1:store" / "s2:store", + ":<guruId>" untuk selain Ryan).
//  • Siapa yang boleh membuka diatur admin di Pengaturan → Akun & Akses → Akses Fitur Kuliah
//    (disimpan di kuliah_pengaturan kunci "akses"). Ryan Nugroho (admin utama) selalu boleh.
//  Tabel: kuliah_pengaturan (SQL_KULIAH_DAN_PENGAMAN_ABSEN.sql).
// ============================================================

const KUL_PROGRAM = {
  s1: { jenjang: "S1", kampus: "International Open University (IOU)", jurusan: "Psikologi Islam", arab: "علم النفس الإسلامي", semester: 8, aktif: "1 & 5",
        matkul: "ENES101 Bahasa Inggris · PPAB301 Psikologi Perilaku Adiktif · PMAD301 Model & Pendekatan Disabilitas", src: "kuliah-s1/?v=11", lokal: "fk-s1.v1", ikon: "📘" },
  s2: { jenjang: "S2", kampus: "Shofwa", jurusan: "Ulumul Qur'an", arab: "علوم القرآن", semester: 4, aktif: "1",
        matkul: "Ushul Tafsir · Ulumul Qur'an · Nasikh Mansukh · Aqidah · Nahwu · Tajwid", src: "kuliah-s2/?v=6", lokal: "fk-uq.v1", ikon: "🌙" },
};
const KUL = { set: {}, lama: [], siap: false, galat: "", sinkron: "" };
let KUL_AKSES = (() => { try { return JSON.parse(localStorage.getItem("kulAkses") || "null") || {}; } catch (e) { return {}; } })();

function isRyanPribadi() {
  if (typeof isAdmin !== "function" || !isAdmin()) return false;
  const g = (LOOKUP.guruAll || []).find((x) => x.id === STATE.guruId);
  return /^ryan nugroho/i.test(g?.nama || STATE.guruNama || "");
}
// Program yang boleh dibuka pengguna yang sedang login (["s1","s2"], atau [] = menu Kuliah disembunyikan)
function kulProgramSaya() {
  if (isRyanPribadi()) return ["s1", "s2"];
  if (!STATE.guruId) return [];
  return ((KUL_AKSES.guru || {})[STATE.guruId] || []).filter((p) => KUL_PROGRAM[p]);
}
function kulBolehAkses() { return kulProgramSaya().length > 0; }
const _kulKunci = (p) => p + ":store" + (isRyanPribadi() ? "" : ":" + STATE.guruId);
function kulAkhiranLokal() { return isRyanPribadi() ? "" : ":" + STATE.guruId; }

// ── API ─────────────────────────────────────────────────────
function _kulGalat(e) {
  const m = String(e?.message || e || "");
  if (/relation .* does not exist|could not find the table|schema cache/i.test(m)) return "Tabel Kuliah belum ada — jalankan SQL_KULIAH_DAN_PENGAMAN_ABSEN.sql di Supabase agar kemajuan tersinkron antar-perangkat.";
  return m;
}
// Hemat kuota: hanya baris milik pengguna ini yang diambil
async function kulMuat() {
  const p = await supa.from("kuliah_pengaturan").select("kunci,nilai").in("kunci", kulProgramSaya().map(_kulKunci));
  if (p.error) throw p.error;
  KUL.set = Object.fromEntries((p.data || []).map((x) => [x.kunci, x.nilai]));
  KUL.lama = [];
  if (isRyanPribadi()) {
    // Catatan dari versi Kuliah sebelumnya (kalau pernah ditulis) — ditampilkan sebagai arsip baca saja
    const d = await supa.from("kuliah_modul").select("id,judul,ringkasan,catatan,poin_kunci,urutan").order("urutan");
    KUL.lama = d.error ? [] : (d.data || []).filter((m) => [m.ringkasan, m.catatan, m.poin_kunci].some((x) => (x || "").trim()));
  }
}
async function kulSetel(kunci, nilai) {
  KUL.set[kunci] = nilai;
  const { error } = await supa.from("kuliah_pengaturan").upsert({ kunci, nilai });
  if (error) throw error;
}
// Daftar akses (dimuat saat login; disimpan juga di perangkat supaya menu langsung tampil)
async function kulMuatAkses() {
  try {
    const r = await supa.from("kuliah_pengaturan").select("nilai").eq("kunci", "akses").maybeSingle();
    if (r.error) return;
    const baru = r.data?.nilai || {};
    const berubah = JSON.stringify(baru) !== JSON.stringify(KUL_AKSES);
    KUL_AKSES = baru;
    try { localStorage.setItem("kulAkses", JSON.stringify(baru)); } catch (e) {}
    if (berubah && typeof renderSidebar === "function") renderSidebar();
  } catch (e) {}
}
setTimeout(kulMuatAkses, 1500);

// ── JEMBATAN untuk kuliah-s1/ & kuliah-s2/ (dipanggil dari dalam iframe lewat window.parent) ──
function _kulProfil() {
  const g = (LOOKUP.guruAll || []).find((x) => x.id === STATE.guruId);
  return { nama: (g?.nama || STATE.guruNama || "Ryan Nugroho").replace(/\s*,.*$/, "") };
}
// Hemat kuota: paling sering 1× per 20 detik per program (yang terakhir selalu ikut terkirim), + kirim segera saat ditutup
const KUL_JEDA_SINKRON = 20000;
const _kulAntre = { s1: { akhir: 0, tunda: null, kirim: false }, s2: { akhir: 0, tunda: null, kirim: false } };
function _kulSimpan(p, state, segera) {
  const k = _kulKunci(p), q = _kulAntre[p];
  KUL.set[k] = state;
  if (!KUL.siap) return;
  clearTimeout(q.tunda);
  const sisa = KUL_JEDA_SINKRON - (Date.now() - q.akhir);
  if (!segera && (sisa > 0 || q.kirim)) { q.tunda = setTimeout(() => _kulSimpan(p, KUL.set[k], true), Math.max(sisa, 1000)); return; }
  q.kirim = true; q.akhir = Date.now();
  kulSetel(k, state).then(() => { KUL.sinkron = "ok"; }, (e) => { KUL.sinkron = "gagal"; console.warn("Sinkron kuliah " + p + " gagal:", e); }).finally(() => { q.kirim = false; });
}
function kulS1Muat() { return KUL.set[_kulKunci("s1")] || null; }
function kulS2Muat() { return KUL.set[_kulKunci("s2")] || null; }
function kulS1Profil() { return _kulProfil(); }
function kulS2Profil() { return _kulProfil(); }
function kulS1Simpan(state, segera) { _kulSimpan("s1", state, segera); }
function kulS2Simpan(state, segera) { _kulSimpan("s2", state, segera); }

// ── LAYAR PENUH ─────────────────────────────────────────────
let _kulLayarProg = "";
function kulBuka(p, hash) {
  if (qs("kul-layar") || !kulProgramSaya().includes(p)) return;
  const P = KUL_PROGRAM[p];
  const el = document.createElement("div");
  el.id = "kul-layar";
  el.innerHTML = `<div class="kul-muat"><div class="kul-putar"></div><span>Membuka Ruang Kuliah ${P.jenjang}…</span></div>
    <iframe src="${P.src}${hash || ""}" title="Ruang Kuliah ${P.jenjang} ${escapeHtml(P.jurusan)}" allow="fullscreen; clipboard-write" onload="this.previousElementSibling?.remove()"></iframe>`;
  document.body.appendChild(el);
  document.documentElement.classList.add("kul-buka");
  _kulLayarProg = p;
  try { localStorage.setItem("kulTerakhir", p); } catch (e) {}
  // Tombol "kembali" HP menutup layar kuliah, bukan keluar aplikasi
  try { history.pushState({ kulLayar: 1 }, ""); } catch (e) {}
}
function kulBukaS1() { kulBuka("s1"); }
function kulBukaS2() { kulBuka("s2"); }
function kulTutupLayar(dariRiwayat) {
  const el = qs("kul-layar");
  if (!el) return;
  const p = _kulLayarProg;
  try { const w = el.querySelector("iframe")?.contentWindow; w?.Store?.saveNow?.(); } catch (e) {}
  if (p && KUL.set[_kulKunci(p)]) _kulSimpan(p, KUL.set[_kulKunci(p)], true);

  el.remove();
  document.documentElement.classList.remove("kul-buka");
  _kulLayarProg = "";
  try { localStorage.setItem("kulTerakhir", ""); } catch (e) {}
  if (!dariRiwayat && history.state?.kulLayar) { _kulAbaikanPop = true; try { history.back(); } catch (e) { _kulAbaikanPop = false; } }
  renderKuliah();
}
function kulTutupS1() { kulTutupLayar(); } // dipakai tombol kembali di kuliah-s1/
let _kulAbaikanPop = false; // popstate akibat history.back() milik kita sendiri jangan menutup layar yang baru dibuka
window.addEventListener("popstate", () => { if (_kulAbaikanPop) { _kulAbaikanPop = false; return; } if (qs("kul-layar")) kulTutupLayar(true); });

// ── HALAMAN ─────────────────────────────────────────────────
async function renderKuliahInit() {
  const root = qs("kuliah-root");
  if (!root) return;
  if (!kulBolehAkses()) { root.innerHTML = `<div class="card">${htmlKosong("🔒", "Belum ada akses", "Minta admin membuka akses Fitur Kuliah untuk akunmu di Pengaturan.")}</div>`; return; }
  root.innerHTML = loadingHTML("Membuka ruang kuliah...");
  try { await kulMuat(); KUL.siap = true; KUL.galat = ""; }
  catch (e) { KUL.siap = false; KUL.galat = _kulGalat(e); }
  renderKuliah();
  // Buka otomatis hanya bila pengguna cuma punya 1 program; punya S1 & S2 → tampilkan halaman pilihan
  const prog = kulProgramSaya();
  if (prog.length === 1) kulBuka(prog[0]);
}

// Ringkasan kemajuan dari salinan store (tanpa memuat iframe)
function _kulRingkas(p) {
  let s = KUL.set[_kulKunci(p)];
  try { const lok = JSON.parse(localStorage.getItem(KUL_PROGRAM[p].lokal + kulAkhiranLokal()) || "null"); if (lok && (lok._t || 0) > (s?._t || 0)) s = lok; } catch (e) {}
  if (!s) return null;
  const selesai = Object.values(s.baca || {}).filter((b) => b.selesai).length;
  const skor = Object.values(s.skor || {}).filter((x) => x.total), rata = skor.length ? Math.round(skor.reduce((a, x) => a + x.best / x.total, 0) / skor.length * 100) : null;
  const kunci = (x) => x.getFullYear() + "-" + String(x.getMonth() + 1).padStart(2, "0") + "-" + String(x.getDate()).padStart(2, "0");
  let streak = 0; const d = new Date();
  if (!(s.hari || {})[kunci(d)]) d.setDate(d.getDate() - 1);
  while ((s.hari || {})[kunci(d)]) { streak++; d.setDate(d.getDate() - 1); }
  return { selesai, xp: s.xp || 0, rata, streak };
}

function _kulKartu(p) {
  const P = KUL_PROGRAM[p], r = _kulRingkas(p), emas = p === "s2";
  return `<article class="kul-prog ${p}" onclick="kulBuka('${p}')" tabindex="0" onkeydown="if(event.key==='Enter')kulBuka('${p}')">
        <div class="kul-prog-atas"><span class="kul-badge">${P.jenjang}</span><span class="kul-kampus">${escapeHtml(P.kampus)}</span></div>
        <h2>${escapeHtml(P.jurusan)}</h2>
        <div class="kul-arab">${P.arab}</div>
        <div class="kul-prog-mk">${P.ikon} Semester ${P.aktif} · ${escapeHtml(P.matkul)}</div>
        <div class="kul-stat">
          <div><b>${r ? r.selesai : 0}</b><small>${p === "s2" ? "pertemuan" : "modul"} selesai</small></div>
          <div><b>${r ? r.xp : 0}</b><small>XP</small></div>
          <div><b>${r && r.rata != null ? r.rata + "%" : "–"}</b><small>rata-rata latihan</small></div>
          <div><b>${r ? r.streak : 0}</b><small>hari istiqamah</small></div>
        </div>
        <button class="btn ${emas ? "kul-btn-emas" : "kul-btn-utama"}" type="button">📖 Buka Ruang Kuliah ${P.jenjang}</button>
      </article>`;
}

function renderKuliah() {
  const root = qs("kuliah-root");
  if (!root) return;
  const prog = kulProgramSaya();
  const jam = new Date().getHours(), sapa = jam < 11 ? "Shabahal khair" : jam < 15 ? "Selamat siang" : jam < 18 ? "Selamat sore" : "Masa'al khair";
  root.innerHTML = `<div class="kul">
    <section class="kul-hero">
      <div class="kul-hero-isi">
        <div class="kul-bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
        <h1>${sapa}, ${escapeHtml(_kulProfil().nama)}</h1>
        <p>Ruang kuliah — pilih program yang ingin dipelajari hari ini. Kemajuan & tugas tersimpan di akunmu.</p>
      </div>
    </section>

    ${KUL.siap ? "" : `<div class="kul-info">⚠️ ${escapeHtml(KUL.galat)} <small>Untuk sementara kemajuan tetap tersimpan di perangkat ini.</small></div>`}

    <div class="kul-program">${prog.map(_kulKartu).join("")}</div>

    <div class="kul-cara">
      <button type="button" onclick="kulFitur('#/arena')"><span>🎯</span><b>Simulasi Ujian</b><small>S1: UTS & UAS · S2: ujian akhir · tantangan harian</small></button>
      <button type="button" onclick="kulFitur('#/profil')"><span>✍️</span><b>Latihan esai</b><small>Lihat rapor & jawaban esai yang tersimpan</small></button>
      <button type="button" onclick="kulFitur('#/murajaah')"><span>🃏</span><b>Muraja'ah berjarak</b><small>Ulang kartu istilah yang jatuh tempo hari ini</small></button>
      <button type="button" onclick="kulSinkronSekarang()"><span>☁️</span><b>${KUL.siap ? (KUL.sinkron === "gagal" ? "Sinkron tertunda" : "Tersinkron") : "Tersimpan lokal"}</b><small>${KUL.siap ? "Ketuk untuk sinkron sekarang" : "Jalankan SQL agar bisa pindah perangkat"}</small></button>
      <button type="button" onclick="kulSiapkanOffline(this)"><span>📴</span><b>${_kulOfflineInfo() ? "Siap offline ✓" : "Siapkan offline"}</b><small>${_kulOfflineInfo() ? "Disiapkan " + _kulOfflineInfo() + " · ketuk untuk perbarui" : "Simpan semua modul di perangkat agar bisa dibuka tanpa internet"}</small></button>
    </div>
    <div id="kul-pilih-fitur" class="kul-pilih" hidden></div>

    ${KUL.lama.length ? `<details class="kul-lama"><summary>🗂️ Arsip catatan Kuliah versi lama (${KUL.lama.length})</summary>
      ${KUL.lama.map((m) => `<div class="kul-lama-item"><b>${escapeHtml(m.judul || "")}</b>${["ringkasan", "catatan", "poin_kunci"].filter((k) => (m[k] || "").trim()).map((k) => `<div><small>${k.replace("_", " ")}</small><p>${escapeHtml(m[k]).replace(/\n/g, "<br>")}</p></div>`).join("")}</div>`).join("")}
    </details>` : ""}
  </div>`;
}

// ── PENGATURAN ADMIN: siapa yang boleh membuka Fitur Kuliah ──
function renderAksesKuliahUI() {
  const root = qs("akses-kuliah-root");
  if (!root) return;
  if (!isAdmin()) { root.innerHTML = `<div style="font-size:11px;color:var(--text-secondary);">🔒 Khusus admin utama.</div>`; return; }
  const peta = KUL_AKSES.guru || {};
  const guru = (LOOKUP.guruAll || []).filter((g) => g.status_aktif !== false).sort((a, b) => a.nama.localeCompare(b.nama));
  root.innerHTML = `<input id="aku-cari" class="input" placeholder="Cari nama guru..." style="margin-bottom:8px;" oninput="qsa('.aku-baris').forEach(b=>b.hidden=!b.dataset.nama.includes(this.value.toLowerCase()))"/>
    <div style="max-height:320px;overflow-y:auto;border:1px solid var(--border-soft);border-radius:10px;">
    ${guru.map((g) => {
      const ryan = /^ryan nugroho/i.test(g.nama), punya = ryan ? ["s1", "s2"] : (peta[g.id] || []);
      return `<div class="aku-baris" data-nama="${escapeHtml(g.nama.toLowerCase())}" style="display:flex;align-items:center;gap:10px;padding:7px 10px;border-bottom:1px solid var(--border-soft);font-size:12px;">
        <span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHtml(g.nama)}${ryan ? ` <small style="color:var(--text-secondary);">(admin utama, selalu)</small>` : ""}</span>
        ${Object.keys(KUL_PROGRAM).map((p) => `<label style="display:flex;align-items:center;gap:4px;cursor:pointer;"><input type="checkbox" class="aku-chk" data-guru="${g.id}" data-prog="${p}" ${punya.includes(p) ? "checked" : ""} ${ryan ? "disabled" : ""}/> ${KUL_PROGRAM[p].jenjang}</label>`).join("")}
      </div>`;
    }).join("")}
    </div>
    <button class="btn btn-accent" style="margin-top:10px;padding:6px 14px;font-size:11.5px;" onclick="_akuSimpan()">💾 Simpan Akses Kuliah</button>
    <button class="btn" style="margin-top:10px;margin-left:6px;padding:6px 14px;font-size:11.5px;" onclick="kulLaporanAdmin()">📊 Laporan Kemajuan Kuliah</button>
    <div id="kul-laporan" style="margin-top:10px;"></div>`;
}
async function _akuSimpan() {
  const guru = {};
  qsa(".aku-chk:not([disabled])").forEach((c) => { if (c.checked) (guru[c.dataset.guru] = guru[c.dataset.guru] || []).push(c.dataset.prog); });
  const nilai = { guru, diubah: new Date().toISOString() };
  try {
    await kulSetel("akses", nilai);
    KUL_AKSES = nilai;
    try { localStorage.setItem("kulAkses", JSON.stringify(nilai)); } catch (e) {}
    renderSidebar();
    toast("Akses Fitur Kuliah disimpan (" + Object.keys(guru).length + " guru + admin utama)", "ok");
  } catch (e) { toast("Gagal menyimpan: " + _kulGalat(e), "err"); }
}

// ── LAPORAN ADMIN: kemajuan belajar per guru (dimuat hanya saat tombol ditekan — hemat kuota) ──
const KUL_MK_LABEL = { "bahasa-inggris": "ENES101", "psikologi-adiktif": "PPAB301", disabilitas: "PMAD301", "rumus-inggris": "Rumus Mahir", "kisi-inggris": "Kisi ENES", "kisi-disabilitas": "Kisi PMAD",
  aqidah: "Aqidah", "ulumul-quran": "Ulumul Qur'an", "ushul-tafsir": "Ushul Tafsir", "nasikh-mansukh": "Nasikh Mansukh", tajwid: "Tajwid", nahwu: "Nahwu" };
// modul selesai per pekan (Senin–Ahad), 8 pekan terakhir — untuk tren di laporan admin
function _kulPekan(s) {
  const awal = new Date(); awal.setHours(0, 0, 0, 0); awal.setDate(awal.getDate() - (awal.getDay() + 6) % 7);
  const pekan = Array(8).fill(0), mulai = +awal - 7 * 7 * 864e5;
  Object.values(s.baca || {}).forEach((b) => { const t = typeof b?.selesai === "number" ? b.selesai : b?.selesai ? b.terakhir : 0; if (t >= mulai) pekan[Math.min(7, Math.floor((t - mulai) / (7 * 864e5)))]++; });
  const menit7 = Object.entries(s.hari || {}).filter(([k]) => +new Date(k + "T12:00:00") >= +awal).reduce((a, [, v]) => a + (v.menit || 0), 0);
  return { pekan, menit7: Math.round(menit7) };
}
function _kulTrenHtml(p) {
  const max = Math.max(1, ...(p || [0]));
  return `<span title="Modul selesai per pekan: ${(p || []).join(", ")}" style="display:inline-flex;align-items:flex-end;gap:2px;height:22px;">${(p || []).map((v, i) => `<i style="display:block;width:6px;height:${Math.max(2, Math.round(v / max * 22))}px;border-radius:2px;background:var(--accent,#0d5c4b);opacity:${i === 7 ? 1 : 0.45};"></i>`).join("")}</span>`;
}
function _kulRingkasStore(s) {
  if (!s || typeof s !== "object") return null;
  const baca = s.baca || {}, selesai = Object.entries(baca).filter(([, b]) => b && b.selesai);
  const perMk = {};
  selesai.forEach(([k]) => { const mk = k.split("/")[0]; perMk[mk] = (perMk[mk] || 0) + 1; });
  const skor = Object.values(s.skor || {}).filter((x) => x && x.total), rata = skor.length ? Math.round(skor.reduce((a, x) => a + x.best / x.total, 0) / skor.length * 100) : null;
  const ujian = {}; (s.ujian || []).forEach((u) => { if (u && u.id) ujian[u.id] = Math.max(ujian[u.id] || 0, u.pct || 0); });
  const tugas = Object.entries(s.tugas || {}).filter(([k, t]) => !k.endsWith("/_ujian") && t && (t.teks || "").trim().length > 10).length;
  const hari = Object.keys(s.hari || {}).sort(), akhir = s._t || 0;
  return { selesai: selesai.length, perMk, xp: s.xp || 0, rata, ujian, tugas, aktifHari: hari.length, akhir, ..._kulPekan(s) };
}
async function kulLaporanAdmin() {
  const box = qs("kul-laporan");
  if (!box || !isAdmin()) return;
  box.innerHTML = loadingHTML("Memuat kemajuan belajar…");
  try {
    const r = await supa.from("kuliah_pengaturan").select("kunci,nilai").like("kunci", "s_:store%");
    if (r.error) throw r.error;
    const guruNama = (id) => ((LOOKUP.guruAll || []).find((g) => String(g.id) === String(id)) || {}).nama || "(guru #" + id + ")";
    const ryan = ((LOOKUP.guruAll || []).find((g) => /^ryan nugroho/i.test(g.nama)) || {}).nama || "Ryan Nugroho";
    const baris = (r.data || []).map((x) => { const [prog, , gid] = x.kunci.split(":"); return { prog, nama: gid ? guruNama(gid) : ryan, ...(_kulRingkasStore(x.nilai) || {}) }; })
      .filter((b) => b.prog && KUL_PROGRAM[b.prog]).sort((a, b) => (b.akhir || 0) - (a.akhir || 0));
    if (!baris.length) { box.innerHTML = `<div style="font-size:12px;color:var(--text-secondary);">Belum ada data kemajuan yang tersinkron.</div>`; return; }
    const tgl = (t) => t ? new Date(t).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "2-digit" }) : "–";
    const ujianTeks = (u) => Object.entries(u || {}).filter(([k]) => /^(uts|uas)-/.test(k)).map(([k, v]) => k.replace(/^(uts|uas)-(.*)$/, (m, j, mk) => j.toUpperCase() + " " + (KUL_MK_LABEL[mk] || mk)) + " " + v + "%").join(", ") || "–";
    const mkTeks = (p) => Object.entries(p || {}).map(([mk, n]) => (KUL_MK_LABEL[mk] || mk) + " " + n).join(" · ") || "–";
    box.innerHTML = `<div style="overflow-x:auto;border:1px solid var(--border-soft);border-radius:10px;"><table style="width:100%;border-collapse:collapse;font-size:11.5px;">
      <thead><tr style="background:var(--bg-soft,rgba(0,0,0,.03));text-align:left;">${["Guru", "Prog.", "Modul selesai", "Per mata kuliah", "Rata latihan", "Esai ditulis", "Simulasi ujian terbaik", "Tren 8 pekan", "Pekan ini", "Hari aktif", "Terakhir"].map((h) => `<th style="padding:7px 8px;white-space:nowrap;">${h}</th>`).join("")}</tr></thead>
      <tbody>${baris.map((b) => `<tr style="border-top:1px solid var(--border-soft);"><td style="padding:6px 8px;">${escapeHtml(b.nama)}</td><td style="padding:6px 8px;">${KUL_PROGRAM[b.prog].jenjang}</td><td style="padding:6px 8px;text-align:center;"><b>${b.selesai || 0}</b></td><td style="padding:6px 8px;">${escapeHtml(mkTeks(b.perMk))}</td><td style="padding:6px 8px;text-align:center;">${b.rata != null ? b.rata + "%" : "–"}</td><td style="padding:6px 8px;text-align:center;">${b.tugas || 0}</td><td style="padding:6px 8px;">${escapeHtml(ujianTeks(b.ujian))}</td><td style="padding:6px 8px;">${_kulTrenHtml(b.pekan)}</td><td style="padding:6px 8px;white-space:nowrap;">${(b.pekan || [])[7] || 0} modul · ${b.menit7 || 0} mnt</td><td style="padding:6px 8px;text-align:center;">${b.aktifHari || 0}</td><td style="padding:6px 8px;white-space:nowrap;">${tgl(b.akhir)}</td></tr>`).join("")}</tbody></table></div>
      <div style="font-size:10.5px;color:var(--text-secondary);margin-top:6px;">Data dari salinan kemajuan yang tersinkron (±20 detik setelah belajar). ${baris.length} baris · dimuat ${new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}.</div>`;
  } catch (e) { box.innerHTML = `<div style="font-size:12px;color:var(--danger,#c0392b);">Gagal memuat: ${escapeHtml(_kulGalat(e))}</div>`; }
}

// ── Mode offline: unduh semua berkas program ke cache service worker (sw.js menyimpan setiap GET yang lewat) ──
function _kulOfflineInfo() { try { const t = +localStorage.getItem("kulOffline"); return t ? new Date(t).toLocaleDateString("id-ID", { day: "numeric", month: "short" }) : ""; } catch (e) { return ""; } }
async function kulSiapkanOffline(btn) {
  if (!("serviceWorker" in navigator) || !navigator.serviceWorker.controller) { toast("Mode offline butuh service worker aktif — muat ulang halaman sekali lalu coba lagi.", "warn"); return; }
  const b = btn && btn.querySelector("b"), set = (t) => { if (b) b.textContent = t; };
  const url = [];
  for (const p of kulProgramSaya()) {
    const src = KUL_PROGRAM[p].src, base = new URL(src, location.href);
    const html = await fetch(base).then((r) => r.text()).catch(() => "");
    if (!html) continue;
    url.push(base.href);
    for (const m of html.matchAll(/(?:src|href)="([^"#]+\.(?:js|css|png|svg|webp|jpg|json)(?:\?[^"]*)?)"/g)) if (!/^(https?:)?\/\//.test(m[1])) url.push(new URL(m[1], base).href);
  }
  if (!url.length) { toast("Tidak bisa mengambil daftar berkas — pastikan sedang online.", "warn"); return; }
  let ok = 0, gagal = 0, i = 0;
  const kerja = async () => { while (i < url.length) { const u = url[i++]; try { const r = await fetch(u); r.ok ? ok++ : gagal++; } catch (e) { gagal++; } set("Mengunduh " + (ok + gagal) + "/" + url.length); } };
  await Promise.all(Array.from({ length: 6 }, kerja));
  if (!gagal) { try { localStorage.setItem("kulOffline", String(Date.now())); } catch (e) {} }
  set(gagal ? "Sebagian gagal (" + gagal + ")" : "Siap offline ✓");
  toast(gagal ? gagal + " berkas gagal diunduh — coba lagi saat sinyal stabil." : ok + " berkas tersimpan. Kuliah bisa dibuka tanpa internet di perangkat ini.", gagal ? "warn" : "ok");
}

// ── 4 kotak fitur di halaman Kuliah ──
function kulFitur(hash) {
  const prog = kulProgramSaya();
  if (prog.length === 1) return kulBuka(prog[0], hash);
  const box = qs("kul-pilih-fitur");
  if (!box) return;
  box.hidden = false;
  box.innerHTML = '<span>Buka di program:</span>' + prog.map((p) => `<button type="button" class="btn ${p === "s2" ? "kul-btn-emas" : "kul-btn-utama"}" onclick="kulBuka('${p}','${hash}')">${KUL_PROGRAM[p].jenjang} · ${escapeHtml(KUL_PROGRAM[p].jurusan)}</button>`).join("") + '<button type="button" class="btn" onclick="this.parentElement.hidden=true">Batal</button>';
  box.scrollIntoView({ behavior: "smooth", block: "nearest" });
}
async function kulSinkronSekarang() {
  if (!KUL.siap) { toast("Sinkron belum aktif: " + (KUL.galat || "tabel Kuliah belum ada"), "warn"); return; }
  const prog = kulProgramSaya().filter((p) => KUL.set[_kulKunci(p)]);
  if (!prog.length) { toast("Belum ada kemajuan untuk disinkronkan — mulai belajar dulu ya.", "info"); return; }
  try { await Promise.all(prog.map((p) => kulSetel(_kulKunci(p), KUL.set[_kulKunci(p)]))); KUL.sinkron = "ok"; toast("Kemajuan kuliah tersinkron ✓", "ok"); }
  catch (e) { KUL.sinkron = "gagal"; toast("Sinkron gagal: " + _kulGalat(e), "err"); }
  renderKuliah();
}

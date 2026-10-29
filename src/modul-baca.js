// ============================================================
//  MODUL AJAR — BACA DI TEMPAT & PRESENTASI LANGSUNG
//  PDF dirender dengan PDF.js (sudah dimuat di index.html); PPT/PPTX lewat penampil Office Online.
//  Fitur presentasi: layar penuh, pindah slide (panah/klik/geser/remote clicker), pena & stabilo,
//  laser pointer, layar hitam/putih, timer, dan "Proyektor" (jendela kedua untuk layar proyektor;
//  laptop guru menampilkan slide berikutnya). File PDF disimpan di Cache browser setelah dibuka
//  sekali → buka ulang tidak memakai kuota unduh Supabase lagi & bisa tanpa internet.
// ============================================================
const MV = { doc: null, m: null, hal: 1, total: 0, mode: "baca", alat: null, warna: "#ef4444", coret: {}, garis: null,
  layar: "", zoom: 1, mulai: 0, dikunjungi: new Set(), proj: null, renderId: 0, tTimer: null, tBar: null, sentuh: null };
const _MV_CACHE = "modul-ajar-v1";
const _MV_WARNA = ["#ef4444", "#2563eb", "#16a34a", "#f59e0b", "#111827", "#ffffff"];

async function _mvAmbilPdf(url) {
  try {
    const c = await caches.open(_MV_CACHE);
    let r = await c.match(url);
    if (!r) {
      r = await fetch(url, { mode: "cors" });
      if (!r.ok) throw new Error("HTTP " + r.status);
      try { await c.put(url, r.clone()); } catch (e) {}
    }
    return await r.arrayBuffer();
  } catch (e) {
    const r = await fetch(url);
    if (!r.ok) throw new Error("File tidak bisa diambil (" + r.status + ")");
    return r.arrayBuffer();
  }
}

function bukaModulAjar(id, mode) {
  const m = (typeof MODUL_AJAR_BUKU_CACHE !== "undefined" ? MODUL_AJAR_BUKU_CACHE : []).find((x) => x.id === id);
  if (!m) { toast("Data modul tidak ditemukan, muat ulang halaman.", "err"); return; }
  _mvTutup();
  const pdf = _jenisFileModul({ name: (m.file_nama || m.file_url || "").split("?")[0] }) !== "pptx";
  Object.assign(MV, { m, mode: mode || "baca", alat: null, coret: {}, garis: null, layar: "", zoom: 1, mulai: Date.now(), dikunjungi: new Set(), doc: null, total: 0, pdf });
  MV.hal = pdf ? Math.max(1, +(_mvLS("maHal:" + m.id) || 1)) : 1;
  if (MV.mode === "presentasi") MV.hal = 1;
  const el = document.createElement("div");
  el.id = "mv"; el.className = "mv mv-" + MV.mode + (pdf ? "" : " mv-ppt");
  const tombol = (a, ikon, judul, cls) => `<button type="button" data-a="${a}" title="${judul}" class="${cls || ""}">${ikon}</button>`;
  el.innerHTML = `
    <div class="mv-bar">
      ${tombol("tutup", "✕", "Tutup (Esc)", "mv-x")}
      <div class="mv-judul"><b>${escapeHtml(m.judul || "")}</b><small>${escapeHtml(m.mapel?.nama_mapel || "")} · ${escapeHtml(m.kelas?.nama_kelas || "")}</small></div>
      <div class="mv-grup mv-pdf"><button type="button" data-a="prev" title="Sebelumnya (←)">‹</button><span class="mv-no"><input type="number" min="1" value="${MV.hal}" aria-label="Halaman"/> / <span class="mv-tot">…</span></span><button type="button" data-a="next" title="Berikutnya (→)">›</button></div>
      <div class="mv-grup mv-pdf mv-zoom">${tombol("zout", "−", "Perkecil")}${tombol("zin", "+", "Perbesar")}</div>
      <div class="mv-grup mv-pdf">${tombol("pena", "🖊️", "Pena (P)")}${tombol("stabilo", "🖍️", "Stabilo (H)")}${tombol("laser", "🔴", "Laser pointer (L)")}${tombol("hapus", "🧹", "Hapus coretan halaman ini (E)")}
        <span class="mv-warna">${_MV_WARNA.map((w) => `<i data-w="${w}" style="background:${w}"${w === MV.warna ? ' class="on"' : ""}></i>`).join("")}</span></div>
      <div class="mv-grup mv-pdf">${tombol("hitam", "⬛", "Layar hitam (B)")}${tombol("putih", "⬜", "Layar putih (W)")}</div>
      <span class="mv-timer" title="Lama presentasi">00:00</span>
      <div class="mv-grup">
        ${tombol("proyektor", "🪟 <span>Proyektor</span>", "Buka layar kedua untuk proyektor/TV — laptop menampilkan slide berikutnya", "mv-pdf mv-teks")}
        ${tombol("mode", MV.mode === "presentasi" ? "📖 <span>Baca</span>" : "🖥️ <span>Presentasi</span>", "Ganti mode", "mv-teks mv-mode")}
        ${tombol("unduh", "⬇️", "Unduh file")}
      </div>
    </div>
    <div class="mv-stage"><div class="mv-page"><canvas class="mv-cv"></canvas><canvas class="mv-ink"></canvas><div class="mv-laser"></div></div><div class="mv-tirai"></div>
      <div class="mv-muat">${loadingHTML("Membuka modul…")}</div></div>
    <div class="mv-next mv-pdf"><small>Berikutnya</small><canvas></canvas></div>
    <div class="mv-tip">← → atau klik kiri/kanan: pindah slide · P pena · H stabilo · L laser · E hapus · B layar hitam · F layar penuh · Esc keluar</div>`;
  document.body.appendChild(el);
  document.body.classList.add("mv-buka");
  el.querySelector(".mv-bar").addEventListener("click", _mvKlikBar);
  el.querySelector(".mv-no input").addEventListener("change", (e) => _mvKe(+e.target.value));
  el.querySelectorAll(".mv-warna i").forEach((w) => w.onclick = () => { MV.warna = w.dataset.w; el.querySelectorAll(".mv-warna i").forEach((x) => x.classList.toggle("on", x === w)); if (!MV.alat || MV.alat === "laser") _mvAlat("pena"); });
  _mvPasangPointer(el);
  document.addEventListener("keydown", _mvKey);
  window.addEventListener("resize", _mvResize);
  el.addEventListener("mousemove", _mvTampilBar);
  MV.tTimer = setInterval(_mvTimer, 1000);
  if (MV.mode === "presentasi") _mvLayarPenuh(true);
  _mvTampilBar();
  if (!pdf) return _mvBukaPpt(el);
  _mvMuatPdf(el);
}
async function _mvMuatPdf(el) {
  try {
    if (!window.pdfjsLib) throw new Error("Pembaca PDF belum termuat — periksa internet lalu coba lagi.");
    const data = await _mvAmbilPdf(MV.m.file_url);
    MV.doc = await pdfjsLib.getDocument({ data }).promise;
    MV.total = MV.doc.numPages;
    if (MV.hal > MV.total) MV.hal = 1;
    el.querySelector(".mv-tot").textContent = MV.total;
    el.querySelector(".mv-muat")?.remove();
    await _mvRender();
  } catch (e) {
    console.error(e);
    const muat = el.querySelector(".mv-muat");
    if (muat) muat.innerHTML = `<div class="mv-galat">⚠️ ${escapeHtml(e.message || "Gagal membuka file")}<br/><button class="btn btn-accent" onclick="unduhModulAjar('${MV.m.file_url}')">⬇️ Unduh saja</button></div>`;
  }
}
// PPT/PPTX tidak bisa dirender langsung di browser → penampil Office Online (butuh internet; file ≤ 10 MB)
function _mvBukaPpt(el) {
  const stage = el.querySelector(".mv-stage");
  stage.innerHTML = `<iframe class="mv-office" src="https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(MV.m.file_url)}" allowfullscreen></iframe>
    <div class="mv-ppt-info">File PowerPoint ditampilkan lewat penampil Office Online (perlu internet). Untuk presentasi yang lebih cepat, bisa offline, dan bisa dicoret, simpan PPT sebagai <b>PDF</b> lalu unggah ulang.</div>`;
}

// ── Render halaman ke layar utama (+ jendela proyektor bila terbuka) ──
function _mvTarget() {
  const el = document.getElementById("mv"); if (!el) return [];
  const t = [{ win: window, stage: el.querySelector(".mv-stage"), page: el.querySelector(".mv-page"), cv: el.querySelector(".mv-cv"), ink: el.querySelector(".mv-ink"), laser: el.querySelector(".mv-laser"), tirai: el.querySelector(".mv-tirai"), utama: true }];
  if (MV.proj && !MV.proj.closed) {
    const d = MV.proj.document;
    if (d.querySelector(".cv")) t.push({ win: MV.proj, stage: d.querySelector(".st"), page: d.querySelector(".pg"), cv: d.querySelector(".cv"), ink: d.querySelector(".ink"), laser: d.querySelector(".las"), tirai: d.querySelector(".tir") });
  }
  return t;
}
async function _mvRender() {
  if (!MV.doc) return;
  const id = ++MV.renderId;
  const page = await MV.doc.getPage(MV.hal);
  if (id !== MV.renderId) return;
  for (const tg of _mvTarget()) {
    const W = tg.stage.clientWidth, H = tg.stage.clientHeight, v1 = page.getViewport({ scale: 1 });
    const pas = Math.min((W - 16) / v1.width, (H - 16) / v1.height);
    const scale = tg.utama && MV.mode === "baca" ? Math.max(pas, Math.min((W - 24) / v1.width, 2.2)) * MV.zoom : pas;
    const dpr = Math.min(tg.win.devicePixelRatio || 1, 2), v = page.getViewport({ scale: scale * dpr });
    const off = tg.win.document.createElement("canvas");
    off.width = Math.floor(v.width); off.height = Math.floor(v.height);
    await page.render({ canvasContext: off.getContext("2d"), viewport: v }).promise;
    if (id !== MV.renderId) return;
    [tg.cv, tg.ink].forEach((c) => { c.width = off.width; c.height = off.height; c.style.width = off.width / dpr + "px"; c.style.height = off.height / dpr + "px"; });
    tg.cv.getContext("2d").drawImage(off, 0, 0);
    _mvGambarCoret(tg);
    tg.tirai.className = (tg.utama ? "mv-tirai " : "tir ") + MV.layar;
  }
  MV.dikunjungi.add(MV.hal);
  _mvLS("maHal:" + MV.m.id, MV.hal);
  const el = document.getElementById("mv");
  if (el) {
    el.querySelector(".mv-no input").value = MV.hal;
    el.querySelector('[data-a="prev"]').disabled = MV.hal <= 1;
    el.querySelector('[data-a="next"]').disabled = MV.hal >= MV.total;
    if (MV.mode === "baca") el.querySelector(".mv-stage").scrollTop = 0;
  }
  _mvRenderBerikutnya();
  if (MV.hal < MV.total) MV.doc.getPage(MV.hal + 1); // siapkan halaman berikutnya
}
async function _mvRenderBerikutnya() {
  const el = document.getElementById("mv"), box = el?.querySelector(".mv-next");
  if (!box || !MV.proj || MV.proj.closed) return;
  const cv = box.querySelector("canvas");
  if (MV.hal >= MV.total) { cv.width = 0; box.querySelector("small").textContent = "Slide terakhir"; return; }
  box.querySelector("small").textContent = "Berikutnya · " + (MV.hal + 1) + "/" + MV.total;
  const page = await MV.doc.getPage(MV.hal + 1), v1 = page.getViewport({ scale: 1 }), v = page.getViewport({ scale: 260 / v1.width });
  cv.width = v.width; cv.height = v.height;
  await page.render({ canvasContext: cv.getContext("2d"), viewport: v }).promise;
}
function _mvKe(n) {
  if (!MV.doc) return;
  n = Math.max(1, Math.min(MV.total, Math.round(n) || 1));
  if (n === MV.hal) { const inp = document.querySelector("#mv .mv-no input"); if (inp) inp.value = n; return; }
  MV.hal = n; MV.layar = ""; _mvRender();
}

// ── Coretan (pena/stabilo) disimpan per halaman dalam koordinat 0..1 → ikut tampil di proyektor ──
function _mvGambarCoret(tg, hanyaTerakhir) {
  const ctx = tg.ink.getContext("2d"), W = tg.ink.width, H = tg.ink.height;
  const daftar = (MV.coret[MV.hal] || []).concat(MV.garis ? [MV.garis] : []);
  if (!hanyaTerakhir) ctx.clearRect(0, 0, W, H);
  (hanyaTerakhir ? daftar.slice(-1) : daftar).forEach((g) => {
    if (g.pts.length < 1) return;
    ctx.save();
    ctx.globalAlpha = g.alat === "stabilo" ? 0.32 : 1;
    ctx.strokeStyle = g.warna; ctx.lineWidth = (g.alat === "stabilo" ? 0.022 : 0.0045) * W;
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    if (hanyaTerakhir && g.pts.length > 1) { const a = g.pts[g.pts.length - 2], b = g.pts[g.pts.length - 1]; if (g.alat === "stabilo") { ctx.restore(); return _mvGambarCoret(tg); } ctx.beginPath(); ctx.moveTo(a[0] * W, a[1] * H); ctx.lineTo(b[0] * W, b[1] * H); ctx.stroke(); ctx.restore(); return; }
    ctx.beginPath(); ctx.moveTo(g.pts[0][0] * W, g.pts[0][1] * H);
    g.pts.forEach((p) => ctx.lineTo(p[0] * W, p[1] * H));
    if (g.pts.length === 1) ctx.lineTo(g.pts[0][0] * W + 0.1, g.pts[0][1] * H);
    ctx.stroke(); ctx.restore();
  });
}
function _mvPasangPointer(el) {
  const ink = el.querySelector(".mv-ink"), stage = el.querySelector(".mv-stage");
  const pos = (e) => { const r = ink.getBoundingClientRect(); return [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height]; };
  ink.addEventListener("pointerdown", (e) => {
    if (MV.alat !== "pena" && MV.alat !== "stabilo") return;
    e.preventDefault(); ink.setPointerCapture(e.pointerId);
    MV.garis = { alat: MV.alat, warna: MV.alat === "stabilo" && MV.warna === "#ef4444" ? "#facc15" : MV.warna, pts: [pos(e)] };
    _mvTarget().forEach((tg) => _mvGambarCoret(tg));
  });
  ink.addEventListener("pointermove", (e) => {
    if (MV.alat === "laser") return _mvLaser(pos(e));
    if (!MV.garis) return;
    MV.garis.pts.push(pos(e));
    _mvTarget().forEach((tg) => _mvGambarCoret(tg, true));
  });
  const selesai = () => { if (!MV.garis) return; (MV.coret[MV.hal] = MV.coret[MV.hal] || []).push(MV.garis); MV.garis = null; };
  ink.addEventListener("pointerup", selesai); ink.addEventListener("pointercancel", selesai);
  ink.addEventListener("pointerleave", () => { if (MV.alat === "laser") _mvLaser(null); });
  // Tanpa alat: klik sisi kanan = maju, kiri = mundur (mode presentasi); geser kiri/kanan di layar sentuh
  stage.addEventListener("click", (e) => {
    if (MV.alat || MV.mode !== "presentasi" || !MV.doc || e.target.closest("button,iframe")) return;
    const x = e.clientX / stage.clientWidth;
    if (x > 0.55) _mvKe(MV.hal + 1); else if (x < 0.45) _mvKe(MV.hal - 1);
  });
  stage.addEventListener("touchstart", (e) => { if (!MV.alat) MV.sentuh = [e.touches[0].clientX, e.touches[0].clientY, Date.now()]; }, { passive: true });
  stage.addEventListener("touchend", (e) => {
    const s = MV.sentuh; MV.sentuh = null; if (!s || MV.alat || !MV.doc) return;
    const dx = e.changedTouches[0].clientX - s[0], dy = e.changedTouches[0].clientY - s[1];
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5 && Date.now() - s[2] < 700) _mvKe(MV.hal + (dx < 0 ? 1 : -1));
  }, { passive: true });
}
function _mvLaser(p) {
  _mvTarget().forEach((tg) => {
    if (!p) { tg.laser.style.display = "none"; return; }
    tg.laser.style.display = "block";
    tg.laser.style.left = p[0] * 100 + "%"; tg.laser.style.top = p[1] * 100 + "%";
  });
}
function _mvAlat(a) {
  MV.alat = MV.alat === a ? null : a;
  const el = document.getElementById("mv"); if (!el) return;
  el.classList.toggle("mv-menggambar", !!MV.alat);
  el.querySelectorAll('[data-a="pena"],[data-a="stabilo"],[data-a="laser"]').forEach((b) => b.classList.toggle("on", b.dataset.a === MV.alat));
  if (MV.alat !== "laser") _mvLaser(null);
}
function _mvLayar(jenis) {
  MV.layar = MV.layar === jenis ? "" : jenis;
  _mvTarget().forEach((tg) => tg.tirai.className = (tg.utama ? "mv-tirai " : "tir ") + MV.layar);
}

// ── Jendela proyektor: guru geser ke layar proyektor/TV, laptop jadi tampilan presenter ──
function _mvBukaProyektor() {
  if (MV.proj && !MV.proj.closed) { MV.proj.focus(); return; }
  const w = window.open("", "mv-proyektor", "width=1100,height=680");
  if (!w) { toast("Izinkan pop-up untuk membuka layar proyektor", "warn"); return; }
  w.document.open();
  w.document.write(`<!doctype html><html lang="id"><head><meta charset="utf-8"><title>Proyektor — ${escapeHtml(MV.m.judul || "")}</title><style>
    html,body{margin:0;height:100%;background:#000;overflow:hidden;cursor:none}
    .st{position:fixed;inset:0;display:flex;align-items:center;justify-content:center}.pg{position:relative}.pg canvas{display:block}
    .ink{position:absolute;left:0;top:0}.las{position:absolute;width:18px;height:18px;margin:-9px 0 0 -9px;border-radius:50%;background:#ff2d2d;box-shadow:0 0 16px 7px rgba(255,40,40,.55);display:none}
    .tir{position:fixed;inset:0;display:none}.tir.hitam{display:block;background:#000}.tir.putih{display:block;background:#fff}
    .fs{position:fixed;bottom:18px;left:50%;transform:translateX(-50%);font:600 14px system-ui,sans-serif;color:#fff;background:rgba(255,255,255,.16);padding:10px 16px;border-radius:999px;cursor:pointer;text-align:center}
  </style></head><body><div class="st"><div class="pg"><canvas class="cv"></canvas><canvas class="ink"></canvas><div class="las"></div></div></div><div class="tir"></div>
  <div class="fs">1) Geser jendela ini ke layar proyektor/TV &nbsp; 2) Klik di sini untuk layar penuh</div></body></html>`);
  w.document.close();
  const fs = w.document.querySelector(".fs");
  fs.onclick = () => { try { w.document.documentElement.requestFullscreen(); } catch (e) {} fs.remove(); };
  w.addEventListener("keydown", _mvKey);
  w.addEventListener("resize", _mvResize);
  w.addEventListener("beforeunload", () => setTimeout(() => { document.getElementById("mv")?.classList.remove("mv-dual"); }, 50));
  MV.proj = w;
  document.getElementById("mv")?.classList.add("mv-dual");
  setTimeout(_mvRender, 150);
}

// ── Keyboard: panah, PageUp/PageDown (remote clicker), spasi, angka, pintasan alat ──
function _mvKey(e) {
  const el = document.getElementById("mv"); if (!el) return;
  if (e.target?.matches?.("input,textarea,select")) return;
  const k = e.key, baca = MV.mode === "baca";
  if (["ArrowRight", "PageDown", " ", "Enter"].includes(k) || (!baca && k === "ArrowDown")) { e.preventDefault(); _mvKe(MV.hal + 1); }
  else if (["ArrowLeft", "PageUp", "Backspace"].includes(k) || (!baca && k === "ArrowUp")) { e.preventDefault(); _mvKe(MV.hal - 1); }
  else if (k === "Home") _mvKe(1);
  else if (k === "End") _mvKe(MV.total);
  else if (/^[bB.]$/.test(k)) _mvLayar("hitam");
  else if (/^[wW,]$/.test(k)) _mvLayar("putih");
  else if (/^[pP]$/.test(k)) _mvAlat("pena");
  else if (/^[hH]$/.test(k)) _mvAlat("stabilo");
  else if (/^[lL]$/.test(k)) _mvAlat("laser");
  else if (/^[eE]$/.test(k)) { delete MV.coret[MV.hal]; _mvTarget().forEach((tg) => _mvGambarCoret(tg)); }
  else if (/^[fF]$/.test(k)) _mvLayarPenuh(!document.fullscreenElement);
  else if (k === "Escape") { if (MV.alat) _mvAlat(MV.alat); else if (MV.layar) _mvLayar(MV.layar); else if (!document.fullscreenElement) _mvTutup(); }
}
function _mvKlikBar(e) {
  const b = e.target.closest("button[data-a]"); if (!b) return;
  const a = b.dataset.a;
  if (a === "tutup") _mvTutup();
  else if (a === "prev") _mvKe(MV.hal - 1);
  else if (a === "next") _mvKe(MV.hal + 1);
  else if (a === "zin" || a === "zout") { MV.zoom = Math.max(0.5, Math.min(3, MV.zoom * (a === "zin" ? 1.2 : 1 / 1.2))); _mvRender(); }
  else if (["pena", "stabilo", "laser"].includes(a)) _mvAlat(a);
  else if (a === "hapus") { delete MV.coret[MV.hal]; _mvTarget().forEach((tg) => _mvGambarCoret(tg)); }
  else if (a === "hitam" || a === "putih") _mvLayar(a);
  else if (a === "proyektor") _mvBukaProyektor();
  else if (a === "unduh") unduhModulAjar(MV.m.file_url);
  else if (a === "mode") {
    MV.mode = MV.mode === "baca" ? "presentasi" : "baca";
    const el = document.getElementById("mv");
    el.classList.toggle("mv-baca", MV.mode === "baca"); el.classList.toggle("mv-presentasi", MV.mode === "presentasi");
    b.innerHTML = MV.mode === "presentasi" ? "📖 <span>Baca</span>" : "🖥️ <span>Presentasi</span>";
    _mvLayarPenuh(MV.mode === "presentasi");
    setTimeout(_mvRender, 200);
  }
}
function _mvLayarPenuh(on) {
  const el = document.getElementById("mv"); if (!el) return;
  try { if (on && !document.fullscreenElement) el.requestFullscreen?.(); else if (!on && document.fullscreenElement) document.exitFullscreen?.(); } catch (e) {}
}
let _mvTResize = null;
function _mvResize() { clearTimeout(_mvTResize); _mvTResize = setTimeout(_mvRender, 150); }
function _mvTampilBar() {
  const el = document.getElementById("mv"); if (!el) return;
  el.classList.add("mv-bar-on");
  clearTimeout(MV.tBar);
  MV.tBar = setTimeout(() => { if (MV.mode === "presentasi") el.classList.remove("mv-bar-on"); }, 2600);
}
function _mvTimer() {
  const t = document.querySelector("#mv .mv-timer"); if (!t) return;
  const s = Math.floor((Date.now() - MV.mulai) / 1000);
  t.textContent = String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");
}
function _mvLS(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, String(v)); } catch (e) { return null; } }

function _mvTutup() {
  const el = document.getElementById("mv");
  if (!el) return;
  // Catat presentasi (≥ 2 menit) → ditawarkan sebagai isian "Materi Pokok" saat mengisi jurnal kelas
  if (MV.m && MV.dikunjungi.size && Date.now() - MV.mulai > 120000) {
    const hal = [...MV.dikunjungi].sort((a, b) => a - b);
    let log = []; try { log = JSON.parse(localStorage.getItem("maPresentasi") || "[]"); } catch (e) {}
    log.unshift({ kelas_id: MV.m.kelas_id, mapel_id: MV.m.mapel_id, judul: MV.m.judul, dari: hal[0], sampai: hal[hal.length - 1], t: Date.now() });
    try { localStorage.setItem("maPresentasi", JSON.stringify(log.slice(0, 15))); } catch (e) {}
  }
  if (MV.proj && !MV.proj.closed) MV.proj.close();
  MV.proj = null;
  if (document.fullscreenElement) { try { document.exitFullscreen(); } catch (e) {} }
  clearInterval(MV.tTimer); clearTimeout(MV.tBar);
  document.removeEventListener("keydown", _mvKey);
  window.removeEventListener("resize", _mvResize);
  el.remove();
  document.body.classList.remove("mv-buka");
  MV.doc = null; MV.renderId++;
}

// Dipakai form Jurnal: tawarkan "Materi dari presentasi hari ini" untuk kelas & mapel yang sama
function _tawarkanMateriPresentasi(kelasId, mapelId, tanggal) {
  let log = []; try { log = JSON.parse(localStorage.getItem("maPresentasi") || "[]"); } catch (e) { return; }
  const p = log.find((x) => x.kelas_id === kelasId && x.mapel_id === mapelId && tanggalISO(new Date(x.t)) === (tanggal || tanggalISO()));
  const ta = qs("jurnal-materi");
  if (!p || !ta || ta.value.trim()) return;
  const teks = `${p.judul}${p.sampai > 1 ? ` (hal. ${p.dari}${p.sampai !== p.dari ? "–" + p.sampai : ""})` : ""}`;
  const btn = document.createElement("button");
  btn.type = "button"; btn.className = "btn btn-ghost";
  btn.style.cssText = "margin-top:6px;margin-right:6px;padding:5px 10px;font-size:11px;text-align:left;white-space:normal;";
  btn.textContent = `🖥️ Dari presentasi hari ini: "${teks.slice(0, 90)}"`;
  btn.onclick = () => { ta.value = teks; btn.remove(); ta.focus(); };
  ta.insertAdjacentElement("afterend", btn);
}

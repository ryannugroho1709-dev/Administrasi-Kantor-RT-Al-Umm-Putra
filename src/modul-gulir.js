// ============================================================
//  MODUL AJAR — DUA CARA MEMBALIK HALAMAN (Baca & Presentasi)
//  • ↔ Geser  : satu halaman di layar, pindah kanan/kiri (cara lama).
//  • ↕ Gulir  : semua halaman tersusun memanjang ke bawah seperti PDF, tinggal digulir atas–bawah.
//  Pilihan diingat per perangkat (localStorage "mvGulir"). Halaman dirender bila mendekati layar saja
//  (hemat memori). Coretan/harakat yang sudah ada ikut tampil. Saat memilih pena/stabilo/penghapus/
//  harakat/laser, tampilan otomatis pindah ke ↔ Geser di halaman itu (alat coret bekerja per halaman).
// ============================================================
const MVG = { on: false, obs: null, wadah: null, rasio: 1.414, render: new Set(), sedangGulir: false, tGulir: null };

function _mvgLS(v) { try { if (v === undefined) return localStorage.getItem("mvGulir") === "1"; localStorage.setItem("mvGulir", v ? "1" : "0"); } catch (e) { return false; } }

// Tombol di toolbar
function _mvgPasangTombol(el) {
  const grup = el.querySelector(".mv-grup.mv-pdf"); // grup nomor halaman
  if (!grup || el.querySelector('[data-a="gulir"]')) return;
  const b = document.createElement("button");
  b.type = "button"; b.dataset.a = "gulir"; b.className = "mv-teks mv-gulir-btn";
  grup.after(b);
  b.addEventListener("click", (e) => { e.stopPropagation(); _mvgAtur(!MVG.on, true); });
  _mvgLabel();
}
function _mvgLabel() {
  const b = document.querySelector('#mv [data-a="gulir"]'); if (!b) return;
  b.innerHTML = MVG.on ? "↔ <span>Geser</span>" : "↕ <span>Gulir</span>";
  b.title = MVG.on ? "Ganti ke tampilan per halaman (geser kanan–kiri)" : "Ganti ke tampilan memanjang ke bawah seperti PDF (gulir atas–bawah)";
}

// Nyalakan / matikan mode gulir
async function _mvgAtur(on, simpan) {
  const el = document.getElementById("mv"); if (!el || !MV.doc || MV.papanSaja || !MV.pdf) return;
  MVG.on = !!on; if (simpan) _mvgLS(MVG.on);
  el.classList.toggle("mv-gulir", MVG.on);
  _mvgLabel();
  if (MVG.on) {
    if (MV.alat) _mvAlat(MV.alat); // matikan alat coret
    if (MV.layar) _mvLayar(MV.layar);
    await _mvgBangun();
    _mvgKe(MV.hal, false);
  } else {
    _mvgBongkar();
    _mvRenderAsli();
  }
}

async function _mvgBangun() {
  const el = document.getElementById("mv"), stage = el.querySelector(".mv-stage");
  _mvgBongkar();
  const p1 = await MV.doc.getPage(1), v1 = p1.getViewport({ scale: 1 });
  MVG.rasio = v1.height / v1.width;
  const w = document.createElement("div"); w.className = "mv-gulir-wadah";
  for (let h = 1; h <= MV.total; h++) {
    const hal = document.createElement("div"); hal.className = "mv-gulir-hal"; hal.dataset.h = h;
    hal.innerHTML = `<canvas class="g-cv"></canvas><canvas class="g-ink"></canvas><span class="mv-gulir-no">${h} / ${MV.total}</span>`;
    w.appendChild(hal);
  }
  stage.appendChild(w); MVG.wadah = w;
  _mvgUkur();
  MVG.obs = new IntersectionObserver((ents) => ents.forEach((x) => { if (x.isIntersecting) _mvgRenderHal(+x.target.dataset.h); }), { root: stage, rootMargin: "800px 0px" });
  w.querySelectorAll(".mv-gulir-hal").forEach((x) => MVG.obs.observe(x));
  stage.addEventListener("scroll", _mvgSaatGulir, { passive: true });
}
function _mvgBongkar() {
  const stage = document.querySelector("#mv .mv-stage");
  if (MVG.obs) MVG.obs.disconnect(); MVG.obs = null;
  if (stage) stage.removeEventListener("scroll", _mvgSaatGulir);
  MVG.wadah?.remove(); MVG.wadah = null; MVG.render.clear();
}
// Lebar halaman = lebar layar (dikali zoom); tinggi mengikuti rasio halaman → gulir terasa mulus
function _mvgLebar() {
  const stage = document.querySelector("#mv .mv-stage"); if (!stage) return 600;
  const W = stage.clientWidth - 24, H = stage.clientHeight - 24;
  const pas = MV.mode === "presentasi" ? Math.min(W, H / MVG.rasio) : Math.min(W, 1100);
  return Math.max(240, Math.round(pas * (MV.mode === "presentasi" ? 1 : MV.zoom)));
}
function _mvgUkur() {
  if (!MVG.wadah) return;
  const lebar = _mvgLebar();
  MVG.wadah.querySelectorAll(".mv-gulir-hal").forEach((x) => { x.style.width = lebar + "px"; x.style.height = Math.round(lebar * MVG.rasio) + "px"; });
  MVG.render.clear();
}
async function _mvgRenderHal(h) {
  if (!MVG.wadah || MVG.render.has(h)) return;
  MVG.render.add(h);
  const kotak = MVG.wadah.querySelector(`.mv-gulir-hal[data-h="${h}"]`); if (!kotak) return;
  try {
    const page = await MV.doc.getPage(h), v1 = page.getViewport({ scale: 1 });
    const lebar = parseFloat(kotak.style.width) || _mvgLebar(), dpr = Math.min(window.devicePixelRatio || 1, 2);
    const v = page.getViewport({ scale: (lebar / v1.width) * dpr });
    kotak.style.height = Math.round(lebar * (v1.height / v1.width)) + "px"; // halaman beda ukuran
    const cv = kotak.querySelector(".g-cv"), ink = kotak.querySelector(".g-ink");
    const off = document.createElement("canvas"); off.width = Math.floor(v.width); off.height = Math.floor(v.height);
    await page.render({ canvasContext: off.getContext("2d"), viewport: v }).promise;
    if (!MVG.wadah) return;
    [cv, ink].forEach((c) => { c.width = off.width; c.height = off.height; });
    cv.getContext("2d").drawImage(off, 0, 0);
    _mvgGambarCoret(h, ink);
  } catch (e) { MVG.render.delete(h); }
}
// Pakai penggambar coretan bawaan dengan "meminjam" nomor halaman sebentar (sinkron, aman)
function _mvgGambarCoret(h, ink) {
  if (!(MV.coret[h] || []).length) return;
  const simpan = { hal: MV.hal, layar: MV.layar, garis: MV.garis };
  MV.hal = h; MV.layar = ""; MV.garis = null;
  try { _mvGambarCoret({ ink, papan: null }); } finally { MV.hal = simpan.hal; MV.layar = simpan.layar; MV.garis = simpan.garis; }
}
// Halaman yang paling banyak terlihat = halaman aktif (nomor di toolbar, penanda, statistik, proyektor)
function _mvgSaatGulir() {
  if (MVG.sedangGulir) return;
  clearTimeout(MVG.tGulir);
  MVG.tGulir = setTimeout(() => {
    const stage = document.querySelector("#mv .mv-stage"); if (!stage || !MVG.wadah) return;
    const tengah = stage.getBoundingClientRect().top + stage.clientHeight * 0.35;
    let pilih = MV.hal;
    for (const x of MVG.wadah.children) { const r = x.getBoundingClientRect(); if (r.top <= tengah && r.bottom > tengah) { pilih = +x.dataset.h; break; } }
    if (pilih !== MV.hal) { MV.hal = pilih; _mvgSetelHal(); }
  }, 120);
}
function _mvgSetelHal() {
  const el = document.getElementById("mv"); if (!el) return;
  el.querySelector(".mv-no input").value = MV.hal;
  el.querySelector('[data-a="prev"]').disabled = MV.hal <= 1;
  el.querySelector('[data-a="next"]').disabled = MV.hal >= MV.total;
  MV.dikunjungi.add(MV.hal); _mvCatatLama(MV.hal); _mvLS("maHal:" + MV.m.id, MV.hal);
  if (MV.proj && !MV.proj.closed) _mvRenderAsli(); // layar proyektor tetap mengikuti halaman aktif
  if (MV.panel === "catatan") _mvPanel("catatan", true);
}
function _mvgKe(n, halus) {
  if (!MVG.wadah) return;
  const x = MVG.wadah.querySelector(`.mv-gulir-hal[data-h="${n}"]`); if (!x) return;
  const stage = document.querySelector("#mv .mv-stage");
  MVG.sedangGulir = true;
  stage.scrollTo({ top: x.offsetTop - 8, behavior: halus ? "smooth" : "auto" });
  setTimeout(() => { MVG.sedangGulir = false; }, halus ? 950 : 60);
  MV.hal = n; _mvgSetelHal();
}

// Zoom / ukuran layar / ganti mode → susun ulang lebar halaman, tetap di halaman yang sama
function _mvgSusunUlang() {
  clearTimeout(MVG.tUkur);
  MVG.tUkur = setTimeout(() => {
    if (!MVG.wadah) return;
    const h = MV.hal, lebarBaru = _mvgLebar();
    if (Math.abs(lebarBaru - (parseFloat(MVG.wadah.firstElementChild?.style.width) || 0)) < 2) return;
    _mvgUkur();
    MVG.wadah.querySelectorAll(".mv-gulir-hal").forEach((x) => { MVG.obs.unobserve(x); MVG.obs.observe(x); });
    _mvgKe(h, false);
  }, 150);
}
// ── Sambungan ke pembaca yang sudah ada ──
const _mvRenderAsli = window._mvRender;
(function () {
  const muatAsli = window._mvMuatPdf;
  window._mvMuatPdf = function (el) {
    const hasil = muatAsli.apply(this, arguments), m = MV.m;
    MVG.on = false;
    // pasang tombol begitu PDF terbaca (tidak menunggu halaman pertama selesai digambar)
    const t = setInterval(() => {
      if (MV.m !== m || !document.getElementById("mv")) return clearInterval(t);
      if (!MV.doc || !MV.total) return;
      clearInterval(t);
      if (MV.papanSaja) return;
      _mvgPasangTombol(el);
      if (_mvgLS()) _mvgAtur(true, false);
    }, 200);
    return hasil;
  };
  window._mvRender = function () {
    if (MVG.on && MVG.wadah) {
      if (MV.proj && !MV.proj.closed) _mvRenderAsli.apply(this, arguments);
      _mvgSusunUlang();
      return Promise.resolve();
    }
    return _mvRenderAsli.apply(this, arguments);
  };
  const keAsli = window._mvKe;
  window._mvKe = function (n) {
    if (MVG.on && MVG.wadah && !MV.papanSaja) { n = Math.max(1, Math.min(MV.total, Math.round(n) || 1)); return _mvgKe(n, true); }
    return keAsli.apply(this, arguments);
  };
  // Alat coret dipilih saat mode gulir → pindah ke tampilan per halaman di halaman yang sedang dibaca
  const alatAsli = window._mvAlat;
  window._mvAlat = function (a) {
    if (MVG.on && a && MV.alat !== a && ["pena", "stabilo", "laser", "harakat", "karet"].includes(a)) {
      _mvgAtur(false, false);
      toast("Untuk mencoret, tampilan pindah ke per halaman. Tekan ↕ Gulir untuk kembali memanjang.", "ok");
    }
    return alatAsli.apply(this, arguments);
  };
  const layarAsli = window._mvLayar;
  window._mvLayar = function (j) { if (MVG.on && j) _mvgAtur(false, false); return layarAsli.apply(this, arguments); };
  // Mode gulir: klik layar / geser kiri-kanan tidak memindah halaman (cukup digulir)
  document.addEventListener("click", (e) => { if (MVG.on && e.target.closest && e.target.closest("#mv .mv-gulir-wadah")) e.stopPropagation(); }, true);
  document.addEventListener("touchend", (e) => { if (MVG.on && e.target.closest && e.target.closest("#mv .mv-gulir-wadah")) MV.sentuh = null; }, true);
  // Tombol panah atas/bawah di mode gulir = gulir biasa (bukan lompat halaman)
  document.addEventListener("keydown", (e) => {
    if (!MVG.on || !document.getElementById("mv") || e.target?.matches?.("input,textarea,select")) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.stopImmediatePropagation(); e.preventDefault();
      document.querySelector("#mv .mv-stage")?.scrollBy({ top: (e.key === "ArrowDown" ? 1 : -1) * 120, behavior: "smooth" });
    }
  }, true);
  const tutupAsli = window._mvTutup;
  window._mvTutup = function () { _mvgBongkar(); MVG.on = false; return tutupAsli.apply(this, arguments); };
})();

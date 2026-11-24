// ============================================================
//  JADWAL UJIAN — tambahan:
//  1. Seret-lepas di penyusun jadwal: tekan lama mapel (±0,45 detik) → terangkat → lepas di
//     • sel kosong kelas yang sama  = PINDAH
//     • mapel lain kelas yang sama  = TUKAR (dikonfirmasi dulu)
//     • tab hari lain               = pindah ke sesi yang sama di hari itu (atau tukar bila terisi)
//  2. ⛶ Layar Penuh: seluruh jadwal (baris = hari, kolom = kelas) satu layar, mendatar; ✕ kembali.
//  3. Kartu Dasbor: setelah batas pengumpulan soal lewat sampai ujian selesai, jadwal ujian tampil paling atas.
// ============================================================
const JUS = { timer: null, asal: null, aktif: false, hantu: null, x0: 0, y0: 0, target: null, tahanKlik: false };
const _jusTitik = (e) => { const t = e.touches ? e.touches[0] || e.changedTouches[0] : e; return { x: t.clientX, y: t.clientY }; };
function _jusMulai(e) {
  if (!JU.edit || (e.type === "mousedown" && e.button !== 0)) return;
  const sel = e.target.closest && e.target.closest("[data-kunci]"), wadah = qs("ju-wadah");
  if (!sel || !wadah || !wadah.contains(sel)) return;
  if (e.target.closest("select,button:not(.ju-grip),input,textarea,option,a")) return;
  const k = sel.dataset.kunci; if (!_juLabelSlot(JU.edit.slot[k])) return;
  const p = _jusTitik(e); JUS.x0 = p.x; JUS.y0 = p.y; JUS.asal = k; JUS.el = sel;
  clearTimeout(JUS.timer); JUS.timer = setTimeout(() => _jusAngkat(p), 450);
}
function _jusAngkat(p) {
  JUS.aktif = true; JUS.tahanKlik = true;
  try { navigator.vibrate && navigator.vibrate(25); } catch (e) {}
  const j = JU.edit, x = j.slot[JUS.asal], [, , kelas] = JUS.asal.split("|");
  const h = document.createElement("div"); h.className = "jus-hantu"; h.style.setProperty("--kw", _juWarnaKelas(kelas));
  h.innerHTML = `<b>${_juEsc(_juLabelSlot(x))}</b><small>Kelas ${_juEsc(_juAngkaKelas(kelas))} · lepas di sel kosong / mapel lain / tab hari</small>`;
  document.body.appendChild(h); JUS.hantu = h; _jusGeserHantu(p);
  JUS.el.classList.add("jus-asal"); document.body.classList.add("jus-menyeret");
  document.querySelectorAll("#ju-wadah [data-kunci]").forEach((c) => { if (c.dataset.kunci.split("|")[2] === kelas && c.dataset.kunci !== JUS.asal) c.classList.add("jus-boleh"); });
}
function _jusGeserHantu(p) { if (JUS.hantu) { JUS.hantu.style.left = p.x + "px"; JUS.hantu.style.top = p.y + "px"; } }
function _jusGerak(e) {
  if (!JUS.asal) return;
  const p = _jusTitik(e);
  if (!JUS.aktif) { if (Math.hypot(p.x - JUS.x0, p.y - JUS.y0) > 10) _jusBatal(); return; }
  if (e.cancelable) e.preventDefault();
  _jusGeserHantu(p);
  const di = document.elementFromPoint(p.x, p.y), t = di && (di.closest("#ju-wadah [data-kunci]") || di.closest("#ju-wadah [data-hari]"));
  if (JUS.target && JUS.target !== t) JUS.target.classList.remove("jus-atas");
  JUS.target = t; if (t) t.classList.add("jus-atas");
  // geser layar otomatis di tepi
  const tepi = 70, wadah = _jusGulir(); if (p.y < tepi + 50) wadah.scrollBy(0, -14); else if (p.y > window.innerHeight - tepi) wadah.scrollBy(0, 14);
}
// wadah yang benar-benar menggulir (di aplikasi ini #page-container, bukan window)
function _jusGulir() { let p = qs("ju-wadah"); while (p) { const o = getComputedStyle(p).overflowY; if (/(auto|scroll)/.test(o) && p.scrollHeight > p.clientHeight) return p; p = p.parentElement; } return window; }
function _jusBatal() {
  clearTimeout(JUS.timer); JUS.timer = null;
  if (JUS.hantu) JUS.hantu.remove();
  document.querySelectorAll(".jus-asal,.jus-boleh,.jus-atas").forEach((c) => c.classList.remove("jus-asal", "jus-boleh", "jus-atas"));
  document.body.classList.remove("jus-menyeret");
  JUS.asal = null; JUS.aktif = false; JUS.hantu = null; JUS.target = null; JUS.el = null;
}
async function _jusLepas(e) {
  if (!JUS.asal) return;
  if (!JUS.aktif) { _jusBatal(); return; }
  if (e.cancelable) e.preventDefault();
  const asal = JUS.asal, t = JUS.target; _jusBatal();
  setTimeout(() => { JUS.tahanKlik = false; }, 350);
  if (!t) return;
  const j = JU.edit, [t0, s0, kelas] = asal.split("|");
  let tujuan = null;
  if (t.dataset.kunci) tujuan = t.dataset.kunci;
  else if (t.dataset.hari) { if (t.dataset.hari === t0) return; tujuan = _juKunci(t.dataset.hari, s0, kelas); }
  if (!tujuan || tujuan === asal) return;
  if (tujuan.split("|")[2] !== kelas) { toast("Mapel hanya bisa dipindah di kelas yang sama", "err"); return; }
  if (_juLabelSlot(j.slot[tujuan])) await juTukarTanya(asal, tujuan);
  else juPindahKe(asal, tujuan);
}
(function jusPasang() {
  document.addEventListener("mousedown", _jusMulai);
  document.addEventListener("touchstart", _jusMulai, { passive: true });
  document.addEventListener("mousemove", _jusGerak);
  document.addEventListener("touchmove", _jusGerak, { passive: false });
  document.addEventListener("mouseup", _jusLepas);
  document.addEventListener("touchend", _jusLepas, { passive: false });
  document.addEventListener("touchcancel", _jusBatal);
  document.addEventListener("contextmenu", (e) => { if (JUS.asal) e.preventDefault(); });
  document.addEventListener("click", (e) => { if (JUS.tahanKlik && e.target.closest && e.target.closest("#ju-wadah")) { e.preventDefault(); e.stopPropagation(); } }, true);
})();

// ── ⛶ Layar penuh: seluruh jadwal sekaligus ──
function _jusHtmlPenuh(j) {
  const e = _juEsc, hariIni = tanggalISO();
  const kepala = `<tr><th class="jus-pn-pojok">Hari</th>${(j.kelas || []).map((k) => `<th style="--kw:${_juWarnaKelas(k)}">Kelas ${e(_juAngkaKelas(k))}</th>`).join("")}</tr>`;
  const baris = (j.hari || []).map((t) => {
    const d = _juTgl(t);
    return `<tr class="${t === hariIni ? "kini" : t < hariIni ? "lewat" : ""}"><th class="jus-pn-hari"><span>${d.toLocaleDateString("id-ID", { weekday: "long" })}</span><b>${d.getDate()}</b><small>${d.toLocaleDateString("id-ID", { month: "short" })}</small></th>
      ${(j.kelas || []).map((k) => `<td style="--kw:${_juWarnaKelas(k)}">${j.sesi.map((s, i) => { const x = j.slot?.[_juKunci(t, s.id, k)], l = _juLabelSlot(x); return l ? `<div class="jus-pn-it"><i>S${i + 1}</i><div><b>${e(l)}</b>${(x.p || []).length ? `<small>${(x.p || []).map(_juNamaGelar).map(e).join(", ")}</small>` : ""}</div></div>` : ""; }).join("") || '<span class="jus-pn-kosong">—</span>'}</td>`).join("")}</tr>`;
  }).join("");
  return `<div class="jus-pn-h"><div><b>${e(j.judul)}</b><small>${_juHariPanjang(j.mulai)}${j.selesai !== j.mulai ? " – " + _juHariPanjang(j.selesai) : ""} · ${j.sesi.map((s, i) => `S${i + 1} ${s.mulai}–${s.selesai}`).join(" · ")}${j.jamHari && (j.jamHari.jumat || j.jamHari.sabtu) ? " (Jumat/Sabtu bisa berbeda)" : ""}</small></div>
    <button class="jus-pn-x" onclick="juTutupPenuh()" aria-label="Tutup">✕</button></div>
    <div class="jus-pn-isi"><table class="jus-pn">${kepala}${baris}</table></div>`;
}
async function juLayarPenuh(id) {
  const j = (id && JU.daftar.find((x) => x.id === id)) || JU.edit || _juJadwalAktif(); if (!j) return toast("Belum ada jadwal ujian", "err");
  juTutupPenuh(true);
  // tampilan sama persis dengan PDF/cetak (versi semua berwarna, nama lengkap + gelar)
  const el = document.createElement("div"); el.id = "jus-penuh"; el.className = "jus-penuh jus-cetak";
  el.innerHTML = `<button class="jus-pn-x" onclick="juTutupPenuh()" aria-label="Tutup">✕</button><iframe title="Jadwal ujian"></iframe>`;
  document.body.appendChild(el);
  try { const html = await _juHtmlCetak(j, "warna", false); el.querySelector("iframe").srcdoc = html; } catch (e) { el.innerHTML = _jusHtmlPenuh(j); }
  el.querySelector("iframe")?.addEventListener("load", function () { try { this.contentDocument.addEventListener("keydown", (ev) => { if (ev.key === "Escape") juTutupPenuh(); }); } catch (e) {} });
  try { if (el.requestFullscreen) await el.requestFullscreen({ navigationUI: "hide" }); } catch (e) {}
  try { if (screen.orientation && screen.orientation.lock) await screen.orientation.lock("landscape"); } catch (e) {}
  _jusPutar();
}
// HP yang tidak bisa dikunci mendatar: putar tampilan 90°
function _jusPutar() { const el = document.getElementById("jus-penuh"); if (!el) return; el.classList.toggle("putar", window.innerHeight > window.innerWidth && window.innerWidth < 700); }
function juTutupPenuh(diam) {
  const el = document.getElementById("jus-penuh"); if (!el) return;
  el.remove();
  try { if (screen.orientation && screen.orientation.unlock) screen.orientation.unlock(); } catch (e) {}
  if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
}
window.addEventListener("resize", () => setTimeout(_jusPutar, 150));
document.addEventListener("fullscreenchange", () => { if (!document.fullscreenElement && document.getElementById("jus-penuh") && !document.getElementById("jus-penuh").classList.contains("tanpa-fs")) juTutupPenuh(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") juTutupPenuh(); });

// ── Kartu Dasbor: batas soal lewat → jadwal ujian paling atas ──
const _JUS_BATAS = { t: 0, isi: {} };
async function _jusKartuDasbor() {
  try {
    const page = qs("page-dashboard"); if (!page || !STATE.guruId || STATE.currentPage !== "dashboard") return;
    if (!JU.daftar.length) { JU.daftar = await _kvAmbil(_JU_KUNCI, []); await ensureLookups(); }
    const hariIni = tanggalISO();
    const j = JU.daftar.filter((x) => (x.selesai || x.mulai) >= hariIni && Object.keys(x.slot || {}).length).sort((a, b) => a.mulai.localeCompare(b.mulai))[0];
    page.querySelector("#jus-dasbor")?.remove();
    if (!j) return;
    if (Date.now() - _JUS_BATAS.t > 600000) { _JUS_BATAS.isi = {}; _JUS_BATAS.t = Date.now(); }
    if (!(j.id in _JUS_BATAS.isi)) { const d = (await _kvAmbil("ujian:soal:" + j.id, {}).catch(() => ({}))) || {}; _JUS_BATAS.isi[j.id] = d._batas || null; }
    const batas = _JUS_BATAS.isi[j.id] || (() => { const d = _juTgl(j.mulai); d.setDate(d.getDate() - 7); return _juIso(d); })();
    if (!(hariIni > batas || j.jenis === "tahfizh" && hariIni >= j.mulai)) return; // masih masa pengumpulan soal
    const e = _juEsc, hariTampil = j.hari.includes(hariIni) ? hariIni : j.hari.find((t) => t >= hariIni) || j.hari[0];
    const sisa = Math.round((_juTgl(j.mulai) - _juTgl(hariIni)) / 86400000);
    const ket = sisa > 0 ? `Dimulai ${sisa === 1 ? "besok" : sisa + " hari lagi"}` : `Hari ke-${j.hari.indexOf(hariIni) + 1} dari ${j.hari.length}`;
    const div = document.createElement("div"); div.id = "jus-dasbor"; div.className = "card jus-dasbor";
    div.innerHTML = `<div class="jus-d-h"><span>🗓️</span><div><b>${e(j.judul)}</b><small>${e(ket)} · ${hariTampil === hariIni ? "Jadwal hari ini" : "Hari ujian berikutnya"}: ${_juHariPanjang(hariTampil)}</small></div></div>
      <div class="jus-d-tabel"><table><tr><th></th>${j.kelas.map((k) => `<th style="--kw:${_juWarnaKelas(k)}">Kls ${e(_juAngkaKelas(k))}</th>`).join("")}</tr>
      ${j.sesi.map((s, i) => `<tr><th>S${i + 1}<small>${_juJamTeks(j, hariTampil, s)}</small></th>${j.kelas.map((k) => { const x = j.slot?.[_juKunci(hariTampil, s.id, k)], l = _juLabelSlot(x), aku = (x?.p || []).includes(STATE.guruId); return `<td class="${aku ? "aku" : ""}" style="--kw:${_juWarnaKelas(k)}">${l ? `<b>${e(l)}</b>${(x.p || []).length ? `<small class="jus-d-pw">${(x.p || []).map(_juNamaGelar).map(e).join(", ")}</small>` : ""}${aku ? "<small>📋 Saya mengawas</small>" : ""}` : "—"}</td>`; }).join("")}</tr>`).join("")}</table></div>
      <div class="jus-d-aksi"><button class="btn btn-accent btn-sm" onclick="juLayarPenuh('${j.id}')">⛶ Layar Penuh</button><button class="btn btn-outline btn-sm" onclick="showPage('jadwal-ujian','page-jadwal-ujian','menuJadwalUjian')">Jadwal Lengkap →</button></div>`;
    const hero = page.querySelector(".dash-hero");
    if (hero) hero.after(div); else page.prepend(div);
  } catch (err) { console.warn("Kartu jadwal ujian gagal:", err); }
}
(function jusPasangDasbor() {
  const coba = () => {
    if (typeof window.renderDashboard !== "function" || window.renderDashboard._jus) return;
    const asli = window.renderDashboard;
    window.renderDashboard = async function (...a) { const r = await asli.apply(this, a); setTimeout(_jusKartuDasbor, 1000); return r; };
    window.renderDashboard._jus = true; window.renderDashboard._ju = asli._ju; window.renderDashboard._sw = asli._sw;
  };
  setTimeout(coba, 3500);
  window.addEventListener("load", () => setTimeout(() => { if (typeof STATE !== "undefined" && STATE.currentPage === "dashboard") _jusKartuDasbor(); }, 3800));
})();

// ============================================================
//  STRUKTUR ORGANISASI yang bisa diubah sendiri (Direktori → Struktur)
//  • Bagan pohon: tiap kotak = jabatan + nama petugasnya.
//  • Ubah atasan: TEKAN LAMA sebuah kotak (±0,5 detik) → kotak terangkat → lepaskan di atas kotak atasannya
//    (atau di "Jadikan Paling Atas"). Cara lain: ketuk ✎ lalu pilih atasan dari daftar.
//  • Tersimpan di pengaturan Kantor (bosp:kantor:atur → struktur.induk), berlaku untuk semua yang melihat.
// ============================================================
const KS_BAWAAN = { yayasan: null, kepala: "yayasan", sekretaris: "kepala", bendahara: "kepala", dapodik: "kepala", "peny-A": "kepala", "peny-Pa": "kepala", "peny-Pi": "kepala", "admin-A": "peny-A", "admin-Pa": "peny-Pa", "admin-Pi": "peny-Pi", it: "kepala", desain: "kepala" };
const KS = { seret: null, timer: null };
function ksInduk() {
  const simpan = ((KT.atur || {}).struktur || {}).induk || {};
  const kode = (typeof KT_PERAN !== "undefined" ? KT_PERAN.map((p) => p.kode) : Object.keys(KS_BAWAAN));
  const hasil = {}; kode.forEach((k) => { hasil[k] = k in simpan ? simpan[k] : (k in KS_BAWAAN ? KS_BAWAAN[k] : "kepala"); });
  Object.keys(hasil).forEach((k) => { if (hasil[k] && !(hasil[k] in hasil)) hasil[k] = null; }); // atasan tidak dikenal → paling atas
  return hasil;
}
const _ksTurunan = (induk, k) => { const t = new Set(); const cari = (x) => Object.keys(induk).forEach((y) => { if (induk[y] === x && !t.has(y)) { t.add(y); cari(y); } }); cari(k); return t; };
function _ksKartu(k, induk) {
  const p = _ktPeran(k), o = (KT.peran[k] || []).map((id) => KT.staf.find((s) => s.id === id)).filter(Boolean), ubah = KT.pemilik;
  return `<div class="ks-k" data-ks="${k}" style="--w:${p.warna}"><div class="ks-k-isi"><small>${p.ikon} ${_ktE(p.nama)}</small>${o.length ? o.map((s) => `<b onclick="event.stopPropagation();ktKartu('${s.id}')">${_ktE(s.nama.replace(/,.*$/, ""))}</b>`).join("") : "<i>belum ditetapkan</i>"}</div>${ubah ? `<button class="ks-ubah" onclick="event.stopPropagation();ksPilihAtasan('${k}')" title="Ubah atasan">✎</button>` : ""}</div>`;
}
function _ksPohon(induk, akar) {
  const anak = (x) => Object.keys(induk).filter((k) => induk[k] === x);
  const cabang = (k) => { const a = anak(k); return `<li>${_ksKartu(k, induk)}${a.length ? `<ul>${a.map(cabang).join("")}</ul>` : ""}</li>`; };
  return `<ul class="ks-pohon">${akar.map(cabang).join("")}</ul>`;
}
function ksHtml() {
  const induk = ksInduk(), akar = Object.keys(induk).filter((k) => !induk[k]);
  return `${KT.pemilik ? `<p class="kt-ket ks-ket">✋ <b>Tekan lama</b> sebuah kotak lalu lepaskan di atas <b>kotak atasannya</b>. Atau ketuk ✎.</p><div class="ks-puncak" data-ks="__puncak">⬆ Jadikan Paling Atas</div>` : ""}
    <div class="ks-wadah" id="ks-wadah">${_ksPohon(induk, akar)}</div>
    ${KT.pemilik ? `<button class="kt-salin" onclick="ksBawaan()">↺ Kembalikan Susunan Bawaan</button>` : ""}`;
}
async function ksSimpan(induk) {
  KT.atur = KT.atur || {}; KT.atur.struktur = { induk, t: Date.now() };
  try { await _ktSimpan(KT_ATUR, { struktur: KT.atur.struktur }); toast("Struktur organisasi tersimpan", "ok"); }
  catch (e) { toast("Gagal menyimpan: " + (e.message || e), "err"); }
  kmDirektori("struktur");
}
async function ksSetAtasan(k, atasan) {
  if (!KT.pemilik) return; const induk = ksInduk();
  if (atasan === k) return; if (atasan && _ksTurunan(induk, k).has(atasan)) { toast("Tidak bisa: atasan baru adalah bawahan jabatan ini", "warn"); return; }
  induk[k] = atasan || null; await ksSimpan(induk);
}
function ksPilihAtasan(k) {
  const induk = ksInduk(), tak = _ksTurunan(induk, k); tak.add(k);
  const opsi = Object.keys(induk).filter((x) => !tak.has(x));
  _ktPanel(`<div class="km-info"><small>UBAH ATASAN</small><h3>${_ktE(_ktPeran(k).nama)}</h3><p>Pilih atasan langsung jabatan ini:</p>
    <div class="km-orang"><button onclick="ksSetAtasan('${k}',null)"><span><b>⬆ Paling Atas</b><small>tidak punya atasan</small></span></button>
    ${opsi.map((x) => `<button class="${induk[k] === x ? "ks-dipilih" : ""}" onclick="ksSetAtasan('${k}','${x}')"><span><b>${_ktPeran(x).ikon} ${_ktE(_ktPeran(x).nama)}</b><small>${_ktE((KT.peran[x] || []).map((id) => (KT.staf.find((s) => s.id === id) || {}).nama || "").filter(Boolean).join(", ") || "belum ditetapkan")}</small></span></button>`).join("")}</div>
    <button class="kt-salin" onclick="kmDirektori('struktur')">‹ Kembali</button></div>`);
}
async function ksBawaan() { if (!KT.pemilik || !(await konfirmasiTema("Kembalikan susunan struktur ke bawaan?"))) return; await ksSimpan({ ...KS_BAWAAN }); }

// ── tekan lama & seret ──
function _ksMulai(e) {
  if (!KT.pemilik) return; const kotak = e.target.closest && e.target.closest(".ks-k"); if (!kotak || e.target.closest(".ks-ubah")) return;
  if (e.type === "mousedown" && e.button !== 0) return;
  const t = e.touches ? e.touches[0] : e; KS.x0 = t.clientX; KS.y0 = t.clientY; KS.calon = kotak;
  clearTimeout(KS.timer); KS.timer = setTimeout(() => _ksAngkat(t.clientX, t.clientY), 480);
}
function _ksAngkat(x, y) {
  const k = KS.calon; if (!k) return; KS.seret = k.dataset.ks;
  try { navigator.vibrate && navigator.vibrate(25); } catch (e) {}
  const h = document.createElement("div"); h.className = "ks-hantu"; h.innerHTML = k.querySelector(".ks-k-isi").innerHTML; h.style.setProperty("--w", k.style.getPropertyValue("--w")); document.body.appendChild(h); KS.hantu = h;
  k.classList.add("ks-asal"); document.body.classList.add("ks-menyeret"); _ksGeserHantu(x, y);
  const tak = _ksTurunan(ksInduk(), KS.seret); document.querySelectorAll(".ks-k").forEach((c) => { if (!tak.has(c.dataset.ks) && c.dataset.ks !== KS.seret) c.classList.add("ks-boleh"); });
}
function _ksGeserHantu(x, y) { if (KS.hantu) { KS.hantu.style.left = x + "px"; KS.hantu.style.top = y + "px"; } }
function _ksGerak(e) {
  if (!KS.calon) return; const t = e.touches ? e.touches[0] : e;
  if (!KS.seret) { if (Math.hypot(t.clientX - KS.x0, t.clientY - KS.y0) > 10) _ksBatal(); return; }
  if (e.cancelable) e.preventDefault(); _ksGeserHantu(t.clientX, t.clientY);
  const di = document.elementFromPoint(t.clientX, t.clientY), tg = di && di.closest("[data-ks]");
  document.querySelectorAll(".ks-atas").forEach((c) => c !== tg && c.classList.remove("ks-atas")); if (tg && (tg.classList.contains("ks-boleh") || tg.dataset.ks === "__puncak")) { tg.classList.add("ks-atas"); KS.target = tg.dataset.ks; } else KS.target = null;
  const w = document.getElementById("kt-panel"); if (w) { const r = w.getBoundingClientRect(); if (t.clientY < r.top + 50) w.scrollTop -= 10; else if (t.clientY > r.bottom - 50) w.scrollTop += 10; }
}
function _ksBatal() { clearTimeout(KS.timer); if (KS.hantu) KS.hantu.remove(); document.querySelectorAll(".ks-asal,.ks-boleh,.ks-atas").forEach((c) => c.classList.remove("ks-asal", "ks-boleh", "ks-atas")); document.body.classList.remove("ks-menyeret"); KS.calon = KS.seret = KS.hantu = KS.target = null; }
function _ksLepas(e) {
  if (!KS.calon) return; const k = KS.seret, tg = KS.target; if (KS.seret && e.cancelable) e.preventDefault(); _ksBatal();
  if (k && tg) ksSetAtasan(k, tg === "__puncak" ? null : tg);
}
document.addEventListener("mousedown", _ksMulai); document.addEventListener("touchstart", _ksMulai, { passive: true });
document.addEventListener("mousemove", _ksGerak); document.addEventListener("touchmove", _ksGerak, { passive: false });
document.addEventListener("mouseup", _ksLepas); document.addEventListener("touchend", _ksLepas, { passive: false }); document.addEventListener("touchcancel", _ksBatal);

// pasang ke Direktori
(function () {
  if (typeof kmDirektori !== "function") return;
  const a = kmDirektori;
  kmDirektori = function (tab = "struktur") {
    a.call(this, tab);
    if (tab !== "struktur") return;
    const p = document.getElementById("kt-panel"), org = p && p.querySelector(".km-org");
    if (org) org.outerHTML = ksHtml();
  };
})();

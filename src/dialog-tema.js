// ============================================================
//  DIALOG BERTEMA — pengganti confirm()/prompt()/alert() bawaan browser.
//  Tampil di LAPISAN SENDIRI di atas jendela (modal) yang sedang terbuka, sehingga isian formulir
//  di bawahnya tidak hilang. Dipakai: konfirmasiTema(pesan, opsi) → true/false,
//  promptTema(label, nilaiAwal, opsi) → teks / null (Batal), salinTema(judul, teks).
// ============================================================
function _dlgBuka(html, lebar) {
  let o = document.getElementById("dlg-tema");
  if (!o) { o = document.createElement("div"); o.id = "dlg-tema"; document.body.appendChild(o); }
  o.innerHTML = `<div class="dlg-panel ${lebar ? "lebar" : ""}" role="dialog" aria-modal="true">${html}</div>`;
  o.classList.add("open");
  return o;
}
function _dlgTutup() { const o = document.getElementById("dlg-tema"); if (o) { o.classList.remove("open"); o.innerHTML = ""; } }
const _dlgE = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

konfirmasiTema = function (pesan, opsi = {}) {
  return new Promise((resolve) => {
    const bahaya = opsi.bahaya || /hapus|keluar|nonaktif|ganti seluruh|kembalikan/i.test(String(opsi.teksYa || opsi.judul || pesan));
    const o = _dlgBuka(`<div class="dlg-ikon ${bahaya ? "bahaya" : ""}">${opsi.ikon || (bahaya ? "⚠️" : "❓")}</div>
      <h3>${_dlgE(opsi.judul || "Konfirmasi")}</h3><p class="dlg-pesan">${pesan}</p>
      <div class="dlg-aksi"><button type="button" class="btn btn-outline" data-v="0">${_dlgE(opsi.teksTidak || "Batal")}</button><button type="button" class="btn ${bahaya ? "dlg-merah" : "btn-accent"}" data-v="1">${_dlgE(opsi.teksYa || opsi.teksOk || "Ya, Lanjutkan")}</button></div>`);
    const selesai = (v) => { document.removeEventListener("keydown", tombol); _dlgTutup(); resolve(v); };
    const tombol = (e) => { if (e.key === "Escape") selesai(false); };
    o.querySelectorAll("[data-v]").forEach((b) => (b.onclick = () => selesai(b.dataset.v === "1")));
    o.onclick = (e) => { if (e.target === o) selesai(false); };
    document.addEventListener("keydown", tombol);
    setTimeout(() => o.querySelector('[data-v="1"]')?.focus(), 30);
  });
};
promptTema = function (labelTeks, nilaiAwal = "", opsi = {}) {
  return new Promise((resolve) => {
    const multi = opsi.multi || String(nilaiAwal || "").length > 80;
    const o = _dlgBuka(`<div class="dlg-ikon">${opsi.ikon || "✏️"}</div><h3>${_dlgE(opsi.judul || "Isi Data")}</h3>
      <label class="dlg-label">${labelTeks}</label>
      ${multi ? `<textarea class="input dlg-input" rows="4">${_dlgE(nilaiAwal)}</textarea>` : `<input class="input dlg-input" type="${opsi.tipe || "text"}" value="${_dlgE(nilaiAwal)}" placeholder="${_dlgE(opsi.placeholder || "")}">`}
      ${opsi.ket ? `<small class="dlg-ket">${opsi.ket}</small>` : ""}
      <div class="dlg-aksi"><button type="button" class="btn btn-outline" data-v="0">Batal</button><button type="button" class="btn btn-accent" data-v="1">${_dlgE(opsi.teksOk || "Simpan")}</button></div>`);
    const inp = o.querySelector(".dlg-input");
    const selesai = (ok) => { document.removeEventListener("keydown", tombol); const v = inp.value.trim(); _dlgTutup(); resolve(ok ? (v || (opsi.bolehKosong ? "" : null)) : null); };
    const tombol = (e) => { if (e.key === "Escape") selesai(false); if (e.key === "Enter" && !multi) { e.preventDefault(); selesai(true); } };
    o.querySelectorAll("[data-v]").forEach((b) => (b.onclick = () => selesai(b.dataset.v === "1")));
    o.onclick = (e) => { if (e.target === o) selesai(false); };
    document.addEventListener("keydown", tombol);
    setTimeout(() => { inp.focus(); inp.select && inp.select(); }, 30);
  });
};
function salinTema(judul, teks) {
  const o = _dlgBuka(`<div class="dlg-ikon">📋</div><h3>${_dlgE(judul || "Salin Teks")}</h3><p class="dlg-pesan">Salin otomatis tidak didukung perangkat ini. Tekan lama/blok teks di bawah lalu salin.</p>
    <textarea class="input dlg-input" rows="8" readonly>${_dlgE(teks)}</textarea>
    <div class="dlg-aksi"><button type="button" class="btn btn-accent" data-v="1">Selesai</button></div>`, true);
  const ta = o.querySelector("textarea"); setTimeout(() => { ta.focus(); ta.select(); }, 30);
  o.querySelector("[data-v]").onclick = _dlgTutup; o.onclick = (e) => { if (e.target === o) _dlgTutup(); };
}
// Jaring pengaman: alert() bawaan yang mungkin masih ada diganti pemberitahuan bertema
window.alert = function (pesan) { if (typeof toast === "function") toast(String(pesan), "info"); };

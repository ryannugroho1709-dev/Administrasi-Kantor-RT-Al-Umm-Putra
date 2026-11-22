// ============================================================
//  MODUL AJAR — TANDA BUKU BELUM LENGKAP
//  • Buku tanpa sampul → pita "Sampul Belum Ada".
//  • Sampul yang PDF-nya belum ada disimpan sebagai buku "tempat" (file_url diawali "belum-ada:")
//    → pita "PDF Belum Ada"; diketuk = pemberitahuan, admin langsung dibukakan form Ubah untuk mengunggah PDF.
// ============================================================
const _maBelumAdaPdf = (m) => !m || !m.file_url || String(m.file_url).startsWith("belum-ada:");

(function pasangTandaLengkap() {
  const bukaAsli = window.bukaModulAjar;
  if (typeof bukaAsli === "function") {
    window.bukaModulAjar = function (id, mode) {
      const m = (typeof MODUL_AJAR_BUKU_CACHE !== "undefined" ? MODUL_AJAR_BUKU_CACHE : []).find((x) => x.id === id);
      if (m && _maBelumAdaPdf(m)) {
        toast("PDF buku ini belum ada — segera dilengkapi", "err");
        if (typeof isAdmin === "function" && isAdmin()) bukaModalEditModul(id);
        return;
      }
      return bukaAsli.apply(this, arguments);
    };
  }
  const unduhAsli = window.unduhModulAjar;
  if (typeof unduhAsli === "function") {
    window.unduhModulAjar = function (fileUrl) {
      if (!fileUrl || String(fileUrl).startsWith("belum-ada:")) { toast("PDF buku ini belum ada — segera dilengkapi", "err"); return; }
      return unduhAsli.apply(this, arguments);
    };
  }
  const renderAsli = window.renderModulAjar;
  if (typeof renderAsli === "function") {
    window.renderModulAjar = async function () {
      const hasil = await renderAsli.apply(this, arguments);
      try { _maTandaiBelumLengkap(); } catch (e) { console.warn(e); }
      return hasil;
    };
  }
})();

function _maTandaiBelumLengkap() {
  const daftar = typeof MODUL_AJAR_BUKU_CACHE !== "undefined" ? MODUL_AJAR_BUKU_CACHE : [];
  document.querySelectorAll("#modul-ajar-rak .ma-book[data-id], .ma-book[data-id]").forEach((el) => {
    const m = daftar.find((x) => x.id === el.dataset.id);
    if (!m || el.dataset.lengkap) return;
    el.dataset.lengkap = "1";
    const sampul = el.querySelector(".ma-book-cover");
    const pita = [];
    if (_maBelumAdaPdf(m)) {
      pita.push("PDF Belum Ada");
      el.classList.add("ma-belum-pdf");
      el.querySelector(".ma-book-bersama")?.remove();
      el.title = "PDF buku ini belum ada — segera dilengkapi";
    }
    if (!m.cover_url) pita.push("Sampul Belum Ada");
    if (sampul && pita.length) sampul.insertAdjacentHTML("beforeend", `<div class="ma-pita-belum">${pita.map((p) => `<span>${p}</span>`).join("")}</div>`);
  });
}

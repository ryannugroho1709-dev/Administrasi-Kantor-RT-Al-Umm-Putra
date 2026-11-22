// ============================================================
//  KERTAS KERJA BOSP — TAMPILAN HP & LANGKAH BISA MUNDUR
//  • Di HP, setiap baris tabel BOSP tampil sebagai kartu (judul kolom ditulis di depan isinya)
//    → tidak perlu menggeser ke kanan.
//  • Langkah Tambah Kegiatan (1. Kegiatan → 2. Rekening Belanja → 3. Detail Anggaran):
//    langkah yang sudah lewat bisa diketuk untuk kembali, plus tombol "‹ Kembali" di langkah 3.
//    Uraian & harga yang sudah diketik tidak hilang saat mundur ke Rekening Belanja.
// ============================================================

// ── 1. Label kolom untuk tampilan kartu di HP ──
function _bspLabelTabel(akar) {
  (akar || document).querySelectorAll("table.bsp-tabel").forEach((t) => {
    const judul = [...t.querySelectorAll("thead th")].map((th) => th.textContent.trim());
    if (!judul.length) return;
    t.querySelectorAll("tbody tr").forEach((tr) => {
      [...tr.children].forEach((td, i) => { if (td.tagName === "TD" && !td.hasAttribute("colspan") && judul[i] && !td.dataset.label) td.dataset.label = judul[i]; });
    });
  });
}
(function pantauTabelBosp() {
  let t = null;
  new MutationObserver(() => { clearTimeout(t); t = setTimeout(() => _bspLabelTabel(), 30); }).observe(document.body, { childList: true, subtree: true });
})();

// ── 2. Langkah Tambah Kegiatan bisa mundur ──
function _bspSimpanIsianDraf() {
  if (!BSP.draf) return;
  const u = qs("bsp-uraian"), h = qs("bsp-harga");
  if (u) BSP.draf.uraian = u.value;
  if (h) BSP.draf.harga = typeof _bspAngka === "function" ? _bspAngka(h.value) || "" : h.value;
  const sat = BSP.edit && BSP.edit.kartu && BSP.edit.kartu[0] && BSP.edit.kartu[0].sat;
  if (sat) BSP.draf.satuan = sat;
}
function bspKeLangkah(n) {
  if (n === 1) {
    _bspSimpanIsianDraf();
    bspTambah();
    return;
  }
  if (n === 2 && BSP.draf && BSP.draf.kode) {
    _bspSimpanIsianDraf();
    const simpan = { ...BSP.draf };
    _bspPilihKeg(simpan.kode);
    BSP.draf = { ...simpan, rek: undefined, jenis: undefined };
  }
}
// Ketuk langkah yang sudah selesai (berwarna hijau) untuk kembali ke sana
document.addEventListener("click", (e) => {
  const sp = e.target.closest && e.target.closest(".bsp-langkah span.selesai");
  if (!sp) return;
  const urutan = [...sp.parentElement.children].indexOf(sp) + 1;
  bspKeLangkah(urutan);
});
// Tombol "‹ Kembali" di langkah 3 (hanya saat menambah kegiatan baru, bukan saat mengedit)
(function pasangKembaliDetail() {
  const asli = window.bspIsiDetail;
  if (typeof asli !== "function") return;
  window.bspIsiDetail = function (id, sisip) {
    const hasil = asli.apply(this, arguments);
    if (!id && BSP.draf && BSP.draf.kode) {
      const bawah = document.querySelector(".bsp-detail .bsp-aksi-bawah");
      if (bawah && !bawah.querySelector(".bsp-mundur")) {
        bawah.insertAdjacentHTML("afterbegin", `<button class="btn btn-ghost bsp-mundur" onclick="bspKeLangkah(2)" title="Kembali memilih rekening belanja">‹ Kembali</button>`);
      }
    }
    return hasil;
  };
})();

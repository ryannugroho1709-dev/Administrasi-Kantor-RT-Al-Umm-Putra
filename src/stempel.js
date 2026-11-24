// ============================================================
//  Jabatan penanda tangan surat/cetakan sesuai ruang (cap stempel memakai gambar asli yang diunggah admin)
// ============================================================
// nama jabatan penandatangan sesuai ruang: di PKBM, "Kepala Sekolah" jenjang = Penyelenggara jenjang
function jabatanPenandatangan(ruang) {
  const r = ruang || (typeof STATE !== "undefined" ? STATE.ruang : "");
  return { A: "Penyelenggara Paket A", Pa: "Penyelenggara Paket B & C Putra", Pi: "Penyelenggara Paket B & C Putri", Pg: "Kepala PKBM" }[r] || "Kepala PKBM";
}

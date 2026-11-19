/* =====================================================================
   PERINGKAT KELAS — nilai ujian akhir tiap mahasiswa (S2 Ulumul Qur'an)
   • "nilai" = nilai 6 mata kuliah sesuai urutan kolom di lembar nilai resmi akademi.
   • Jumlah, persentase, dan peringkat dihitung otomatis (persentase = jumlah ÷ nilai maksimal).
   • Semester berikutnya: tambahkan objek baru di "semester".
   ===================================================================== */
window.PERINGKAT = {
  semester: [
    {
      id: "s1",
      judul: { id: "Semester 1", ar: "الفصل الدراسي الأول" },
      maks: 100,
      mapel: [],            // isi nama mata kuliah sesuai urutan kolom bila sudah dipastikan
      mahasiswa: [
        { nama: "Nur Adli Zal Farizi", nilai: [82, 82, 70, 62, 60, 78] },
        { nama: "Abdul Gani Majidi", nilai: [82, 90, 66, 60, 80, 70] },
        { nama: "Yusuf Duwi Ramadhan", nilai: [56, 80, 82, 84, 74, 84] },
        { nama: "Muhammad Yassar Faishal", nilai: [68, 88, 76, 72, 58, 88] },
        { nama: "Ryan Nugroho", nilai: [66, 76, 82, 74, 64, 76] }
      ]
    }
  ]
};

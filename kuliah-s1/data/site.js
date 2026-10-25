/* =====================================================================
   PENGATURAN UMUM — Ruang Kuliah S1 Psikologi Islam (IOU)
   Mesin tampilan sama dengan Forum Kuliah S2 Ulumul Qur'an.
   ===================================================================== */
window.SITE = {
  brand: "Ruang Kuliah S1 Psikologi Islam",
  brandShort: "Kuliah S1 IOU",
  brandAr: "علم النفس الإسلامي",
  tagline: "Membaca modul, menguji pemahaman, mengulang istilah — bekal UTS & UAS di IOU.",
  owner: "Ryan Nugroho, S.H., M.A.",
  ownerBio: "Ruang belajar pribadi untuk program S1 Psikologi Islam di International Open University (IOU): materi modul yang dirapikan, latihan interaktif, simulasi UTS/UAS, transkrip kuliah, dan muraja'ah istilah berkala.",
  contact: { whatsapp: "", email: "" },
  disclaimer: "Ruang belajar mandiri, bukan situs resmi IOU. Hak materi ada pada IOU dan dosen pengampu. Ringkasan disusun dari slide (PPT) dan transkrip (PDF) modul; penjelasan dari luar modul selalu diberi label \"Di luar modul\" beserta referensinya.",
  sumber: "Materi Modul 1–15 disusun dari **slide (PPT) resmi** mata kuliah PPAB301 / PSY 204 *Psikologi Perilaku Adiktif* (Prof. Dr. G. Hussein Rassool, IOU). Tab **Transkrip** memuat teks kuliah video Modul 1–30 apa adanya. Penjelasan tambahan di luar slide diberi label **Di luar modul** dengan referensi.\n\nMateri **ENES101 Bahasa Inggris** (Semester 1, Modul 1–30, plus kisi-kisi UTS & UAS dari dosen) disusun dari **transkrip PDF** kuliah Rasheeda Abdul Hakeem, dwibahasa Indonesia–Inggris, dan setiap modul ditutup **Rumus Mahir** (di luar modul, berreferensi). Mata kuliah pengayaan **Rumus Mahir Bahasa Inggris** seluruhnya di luar modul.\n\nMateri **PMAD301 Model dan Pendekatan terhadap Disabilitas** (Semester 5, Modul 1–30) disusun dari **transkrip video** kuliah Hannah Morris, dengan istilah Inggris–Arab, ayat & hadits, animasi sampul per modul, dan pengayaan **Di luar modul** berreferensi. **Kisi-kisi PMAD301** memuat 20 soal UTS resmi beserta jawaban model.",
  labelTugas: ["Latihan Esai", "أسئلة المقال"],
  labelTeks: ["Transkrip", "النص"],
  tugasIntro: "Latihan esai untuk persiapan ujian. Tulis jawabanmu sendiri dulu, lalu buka <b>jawaban model</b> sebagai pembanding dan nilai pemahamanmu.",

  palettes: [
    { id: "biru", name: "Biru Kerajaan", desc: "Sama dengan aplikasi kantor", colors: ["#1546a8", "#d4a64a", "#f7f8fc"] },
    { id: "hijau", name: "Hijau Zamrud", desc: "Hijau elegan + emas", colors: ["#0f6b55", "#d4a64a", "#f5f8f6"] },
    { id: "maroon", name: "Maroon", desc: "Merah marun + emas", colors: ["#8a1f33", "#d4a64a", "#fbf8f8"] },
    { id: "ungu", name: "Ungu Anggur", desc: "Ungu + emas", colors: ["#5b3d93", "#d4a64a", "#f9f8fc"] }
  ],
  defaultPalette: "biru",
  backsoundFiles: [],

  hikmah: [
    { ar: "يَا أَيُّهَا الَّذِينَ آمَنُوا إِنَّمَا الْخَمْرُ وَالْمَيْسِرُ وَالْأَنصَابُ وَالْأَزْلَامُ رِجْسٌ مِّنْ عَمَلِ الشَّيْطَانِ فَاجْتَنِبُوهُ لَعَلَّكُمْ تُفْلِحُونَ", id: "Wahai orang-orang yang beriman, sesungguhnya khamar, judi, berhala, dan mengundi nasib dengan anak panah adalah perbuatan keji termasuk perbuatan setan. Maka jauhilah agar kamu beruntung.", src: "QS. Al-Ma'idah: 90" },
    { ar: "كُلُّ مُسْكِرٍ خَمْرٌ، وَكُلُّ مُسْكِرٍ حَرَامٌ", id: "Setiap yang memabukkan adalah khamar, dan setiap yang memabukkan adalah haram.", src: "HR. Muslim" },
    { ar: "وَلَا تُلْقُوا بِأَيْدِيكُمْ إِلَى التَّهْلُكَةِ", id: "Dan janganlah kamu menjatuhkan dirimu sendiri ke dalam kebinasaan.", src: "QS. Al-Baqarah: 195" },
    { ar: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", id: "Ingatlah, hanya dengan mengingat Allah hati menjadi tenteram.", src: "QS. Ar-Ra'd: 28" },
    { ar: "وَنَفْسٍ وَمَا سَوَّاهَا ۝ فَأَلْهَمَهَا فُجُورَهَا وَتَقْوَاهَا ۝ قَدْ أَفْلَحَ مَن زَكَّاهَا", id: "Demi jiwa serta penyempurnaannya, maka Dia mengilhamkan kepadanya (jalan) kefasikan dan ketakwaan; sungguh beruntung orang yang menyucikannya.", src: "QS. Asy-Syams: 7–9" },
    { ar: "مَا أَسْكَرَ كَثِيرُهُ فَقَلِيلُهُ حَرَامٌ", id: "Apa yang banyaknya memabukkan, maka sedikitnya pun haram.", src: "HR. Abu Dawud & At-Tirmidzi" },
    { ar: "لَا ضَرَرَ وَلَا ضِرَارَ", id: "Tidak boleh membahayakan diri sendiri dan tidak boleh membahayakan orang lain.", src: "HR. Ibnu Majah" },
    { ar: "مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ", id: "Siapa yang menempuh jalan untuk mencari ilmu, Allah mudahkan baginya jalan menuju surga.", src: "HR. Muslim" }
  ],

  fitur: [
    ["book", "Materi tersusun rapi", "Daftar isi per modul, kartu definisi, perbandingan, peta konsep, tabel, dan alur langkah."],
    ["scroll", "Transkrip kuliah", "Teks video kuliah PPAB301, PMAD301, dan ENES101 Modul 1–30, bisa dicari kata per kata."],
    ["puzzle", "7 jenis latihan & game", "Pilihan ganda, benar/salah, menjodohkan, urutan, isian, pilah kategori, kartu istilah."],
    ["language", "Mode Inggris–Indonesia", "Mata kuliah bahasa Inggris tampil dwibahasa EN–ID tanpa bahasa Arab, plus 15 Rumus Mahir dan 6 pelajaran pengayaan."],
    ["pen", "Latihan esai + jawaban model", "Persiapan soal uraian dengan penilaian diri."],
    ["trophy", "Arena ujian", "Tantangan harian, kuis kilat, adu cepat, tahan uji, simulasi UTS (M1–15) & UAS (M16–30)."],
    ["calendar", "Hitung mundur ujian", "Atur tanggal UTS/UAS — tampil sisa hari dan target modul per hari."],
    ["cards", "Muraja'ah berjarak", "Kartu istilah dengan sistem 5 kotak Leitner."],
    ["medal", "XP, level & lencana", "Gelar bertingkat dan 15 lencana prestasi."],
    ["download", "Tersimpan di akun kantor", "Kemajuan & catatan tersinkron ke Supabase — lanjut belajar dari HP maupun laptop."]
  ]
};

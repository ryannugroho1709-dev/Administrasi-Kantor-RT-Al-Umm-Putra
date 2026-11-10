/* PPTA 301 — Modul 27: Studi Kasus Contoh II — Membuat Diagnosis */
Kuliah.pertemuan("tes-psikologi", {
  no: 27, tema: 5, motif: "stetoskop", motifOpt: { lbl: "Membuat Diagnosis" }, durasi: 65,
  judul: { id: "Studi Kasus Contoh II: Membuat Diagnosis", en: "Sample Case Study II: Making a Diagnosis" },
  ringkas: { id: "Kasus **Ayesha** (28 th, residen kedokteran tahun ke-2, perfeksionis): lelah, sulit konsentrasi, mudah marah, sering izin sakit, sulit tidur, masalah intim, **pikiran bunuh diri**. Periksa fisik: **kehamilan, hormon, kurang zat besi**. Skrining **PRIME-MD** 2 pertanyaan: sensitivitas **94%**, spesifisitas **35%** → bila positif, 4 pertanyaan lanjutan. Alat: DSM-5, **BDI**, **PHQ-9** (< 3 menit), **HAM-D** (tertua, paling banyak dipakai), tes neuropsikologis. **MDD**: ≥ **5 dari 9** gejala hampir tiap hari ≥ **2 minggu**. Penyebab multifaktor; risiko: perempuan, riwayat keluarga, episode sebelumnya, trauma, komorbid. Terapi: **CBT** + **SSRI**; gaya hidup. Bunuh diri: rawat inap bila perlu, \"jika ragu, beri tahu atasan\". Diagnosis tidak tepat bila ada mania/hipomania, **duka**, zat/medis. Islam: **khauf** (masa depan) & **ḥuzn** (masa lalu); dzikir menenangkan hati." },
  tujuan: [
    { id: "Mengumpulkan dan mengorganisasi data kasus menjadi ciri utama (emosi, perilaku, pikiran, fisik, situasi)." },
    { id: "Menggunakan skrining dan alat ukur (PRIME-MD, PHQ-9, BDI, HAM-D) serta kriteria MDD DSM-5." },
    { id: "Menetapkan diagnosis banding, menilai risiko bunuh diri, dan merencanakan penanganan." }
  ],
  isi: [
    { t: "pembuka", id: "Ayesha selalu juara — dari SMA hingga fakultas kedokteran. Kini, di tahun kedua residensi, ia berkali-kali izin sakit dan menghabiskan hari di tempat tidur, merasa malu karena \"tak sebaik dulu\". Dan ia sering berpikir: *lebih baik aku tidak ada.*" },
    { t: "tabel", judul: { id: "Mengorganisasi data Ayesha" }, kolom: ["Ranah", "Temuan"], baris: [
      ["**Emosi**", "Sedih, putus asa, rendah diri, malu"],
      ["**Perilaku**", "Menarik diri, izin sakit, di tempat tidur, mudah marah pada rekan, hilang minat"],
      ["**Pikiran**", "**Ingin mati** — pikiran bunuh diri berulang; standar diri sangat tinggi, keras pada diri"],
      ["**Fisik**", "Lelah, sulit tidur, masalah intim; **cek kehamilan, hormon, zat besi**"],
      ["**Obat**", "Tidak ada / tidak berubah"],
      ["**Situasi**", "Stabil (menikah), tetapi tuntutan sekolah & kerja meningkat"]
    ] },
    { t: "judul", id: "Skrining: PRIME-MD dua pertanyaan" },
    { t: "daftar", item: [{ id: "Apakah Anda merasa **kurang tertarik** atau tidak menikmati aktivitas yang biasanya menyenangkan?" }, { id: "Apakah Anda merasa **sedih, tertekan, atau putus asa** dalam sebulan terakhir?" }] },
    { t: "anim", jenis: "dua-kurva", judul: { id: "Mengapa skrining 2 pertanyaan sangat sensitif tetapi kurang spesifik" }, a: { label: "Tidak depresi", m: 50, sd: 10 }, b: { label: "Depresi", m: 62, sd: 10 }, cut: 46, sumbu: "skor skrining", catatan: "Cut-off sengaja rendah: sekitar 94% kasus depresi tertangkap (sensitivitas), tetapi hanya sekitar 35% orang sehat terbebas (spesifisitas) — banyak positif palsu. Karena itu, hasil positif harus diikuti 4 pertanyaan lanjutan: tidur, nafsu makan, harga diri, anhedonia." },
    { t: "judul", id: "Alat ukur yang dipilih" },
    { t: "tabel", kolom: ["Alat", "Ciri"], baris: [
      ["**DSM-5**", "Kecemasan kini dipecah menjadi 3 bab berurutan: kecemasan; OCD & terkait; trauma & stres"],
      ["**PHQ**", "3 halaman, 5 masalah tersering di layanan primer (depresi, cemas, alkohol, somatoform, makan); **PHQ-9** < 3 menit"],
      ["**BDI**", "21 item laporan diri (Beck, 1961)"],
      ["**HAM-D**", "**Tertua, paling banyak dipakai**, terverifikasi; versi klinisi, laporan diri, komputer"],
      ["**Neuropsikologis**", "Motivasi, pengaruh mood terhadap memori & perhatian"]
    ] },
    { t: "anim", jenis: "profil", judul: { id: "Jawaban PHQ-9 Ayesha (0 = tidak pernah … 3 = hampir setiap hari)" }, mode: "batang", min: 0, max: 3, skala: [{ k: "a", v: 2, n: "Minat" }, { k: "b", v: 3, n: "Sedih" }, { k: "c", v: 3, n: "Tidur" }, { k: "d", v: 3, n: "Lelah" }, { k: "e", v: 1, n: "Makan" }, { k: "f", v: 3, n: "Gagal" }, { k: "g", v: 3, n: "Konsentrasi" }, { k: "h", v: 1, n: "Lambat" }, { k: "i", v: 2, n: "Mati" }], ket: { id: "Total **21** (rentang 0–27) — tergolong berat. Butir **i** (pikiran lebih baik mati/menyakiti diri) bernilai 2 → **wajib** asesmen risiko bunuh diri hari itu juga. (Data ilustrasi untuk latihan.)" } },
    { t: "judul", id: "Kriteria Major Depressive Disorder" },
    { t: "catatan", gaya: "faidah", id: "**≥ 5 dari 9** gejala, **hampir setiap hari**, **≥ 2 minggu berturut-turut** (salah satunya mood tertekan atau hilang minat): (1) mood tertekan — pada anak/remaja bisa **mudah tersinggung**; (2) hilang minat/kesenangan, termasuk libido; (3) perubahan berat badan/nafsu makan; (4) perubahan tidur; (5) agitasi atau melambat; (6) lelah; (7) rasa bersalah/tak berguna; (8) sulit konsentrasi/memutuskan; (9) pikiran kematian/bunuh diri." },
    { t: "catatan", gaya: "info", judul: { id: "Kembali ke Ayesha" }, id: "Terpenuhi: mood tertekan/putus asa, hilang minat, gangguan tidur, lelah, rasa tak berguna/malu, sulit konsentrasi, pikiran bunuh diri = **7 dari 9**. Yang masih harus dipastikan: **durasi ≥ 2 minggu**, singkirkan penyebab **medis** (kehamilan, hormon, anemia), **zat**, riwayat **mania/hipomania**, dan **duka**." },
    { t: "banding", judul: { id: "Diagnosis MDD TIDAK tepat bila…" }, kiri: { judul: { id: "Gangguan mood lain" }, warna: "amber", poin: [{ id: "Kriteria episode **manik** juga terpenuhi → *episode campuran*" }, { id: "Ada riwayat **manik/hipomanik** → **bipolar I/II**" }] }, kanan: { judul: { id: "Penjelasan lain" }, warna: "blue", poin: [{ id: "Lebih tepat dijelaskan **duka** kehilangan orang tercinta" }, { id: "Disebabkan langsung **zat** (obat/narkoba) atau **kondisi medis**" }] } },
    { t: "judul", id: "Penyebab, risiko, penanganan" },
    { t: "poin", item: [
      { ikon: "layers", judul: { id: "Penyebab" }, id: "Tidak pasti; kombinasi **genetik, biokimia, lingkungan, kepribadian, respons yang dipelajari, peristiwa hidup**." },
      { ikon: "flag", judul: { id: "Risiko" }, id: "**Perempuan**; riwayat keluarga; episode sebelumnya; kekerasan/trauma masa kecil; komorbid (ambang, skizofrenia, OCD, makan, zat)." }
    ] },
    { t: "anim", jenis: "siklus", judul: { id: "Model CBT untuk depresi" }, pusat: { id: "Situasi" }, item: [
      { judul: { id: "Pikiran" }, ket: { id: "\"Aku gagal, aku tak berguna\"" } },
      { judul: { id: "Perasaan" }, ket: { id: "Sedih, malu, putus asa" } },
      { judul: { id: "Perilaku" }, ket: { id: "Izin sakit, di tempat tidur" } },
      { judul: { id: "Tubuh" }, ket: { id: "Lelah, sulit tidur" } }
    ] },
    { t: "banding", kiri: { judul: { id: "CBT" }, warna: "green", poin: [{ id: "Salah satu terapi **paling efektif** untuk semua jenis depresi" }, { id: "Menyasar pola pikir negatif & keyakinan irasional (mis. perfeksionisme Ayesha)" }] }, kanan: { judul: { id: "Obat (SSRI)" }, warna: "blue", poin: [{ id: "Menyeimbangkan zat kimia otak (mis. **serotonin**)" }, { id: "Tak manjur untuk semua; sering coba-coba; **paling efektif bersama psikoterapi**" }, { id: "Bila akar masalah tak ditangani, gejala kembali saat obat dihentikan" }] } },
    { t: "catatan", gaya: "info", id: "Pilihan gaya hidup: **olahraga aerobik teratur** (lari, jalan cepat, renang), relaksasi, dan suplemen tertentu — sebagai pelengkap." },
    { t: "catatan", gaya: "tanbih", judul: { id: "Risiko bunuh diri" }, id: "Bila gejala berat dan ada risiko bunuh diri, **rawat inap jangka pendek** mungkin perlu untuk keselamatan & stabilisasi (pemantauan 24 jam). Bagi mahasiswa/praktikan: **jika ragu, hubungi atasan atau beri tahu seseorang** — jangan menanggung sendiri." },
    { t: "ayat", ar: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", id: "Ingatlah, hanya dengan mengingat Allah hati menjadi tenang.", src: "Ar-Ra'd [13]: 28" },
    { t: "catatan", gaya: "hikmah", judul: { id: "Khauf & ḥuzn" }, id: "Al-Qur'an berulang kali menyebut dua emosi: **khauf** (takut akan **masa depan** — terkait kecemasan, panik) dan **ḥuzn** (sedih/menyesal atas **masa lalu** — terkait depresi, duka). Janji bagi wali-wali Allah: *\"lā khaufun 'alaihim wa lā hum yaḥzanūn\"* (QS Yunus [10]: 62). Hidup **di masa kini** — tidak tenggelam dalam cemas akan esok atau sedih atas kemarin." },
    { t: "ringkasan", item: [{ id: "Organisasi data: emosi, perilaku, pikiran, fisik, situasi; singkirkan medis." }, { id: "PRIME-MD: sensitivitas 94%, spesifisitas 35% → 4 pertanyaan lanjutan." }, { id: "PHQ-9, BDI, HAM-D; MDD ≥ 5/9, ≥ 2 minggu." }, { id: "Bukan MDD bila mania/hipomania, duka, zat/medis." }, { id: "CBT + SSRI; risiko bunuh diri → keselamatan dulu; khauf & ḥuzn." }] },
    { t: "cek", q: { id: "Pasien positif pada dua pertanyaan PRIME-MD. Langkah selanjutnya yang tepat…" }, o: [{ id: "Langsung diagnosis MDD" }, { id: "Ajukan 4 pertanyaan lanjutan (tidur, nafsu makan, harga diri, anhedonia) dan konfirmasi kriteria" }, { id: "Abaikan karena spesifisitas rendah" }, { id: "Resepkan SSRI" }], j: 1, b: { id: "Skrining sensitif menangkap banyak positif palsu → perlu **konfirmasi**." } }
  ],
  istilah: [
    { t: "PRIME-MD", id: "Primary Care Evaluation of Mental Disorders." },
    { t: "PHQ-9", id: "Patient Health Questionnaire 9 butir untuk depresi." },
    { t: "HAM-D", id: "Hamilton Depression Rating Scale." },
    { t: "MDD", id: "Major Depressive Disorder." },
    { t: "Episode campuran", id: "Kriteria depresi & mania terpenuhi bersamaan." },
    { t: "SSRI", id: "Selective serotonin reuptake inhibitors." },
    { t: "Khauf", id: "Takut akan masa depan." },
    { t: "Ḥuzn", id: "Sedih atas masa lalu." }
  ],
  latihan: {
    pg: [
      { q: { id: "Sebelum mendiagnosis depresi pada Ayesha, hal fisik yang PERLU disingkirkan menurut slide adalah…" }, o: [{ id: "Miopia" }, { id: "Kehamilan, ketidakseimbangan hormon, kekurangan zat besi" }, { id: "Alergi debu" }, { id: "Tinggi badan" }], j: 1 },
      { q: { id: "Skrining PRIME-MD memiliki sensitivitas 94% dan spesifisitas 35%. Artinya…" }, o: [{ id: "Jarang melewatkan kasus, tetapi banyak positif palsu" }, { id: "Banyak kasus terlewat" }, { id: "Sempurna untuk diagnosis" }, { id: "Tidak bisa dipakai" }], j: 0 },
      { q: { id: "Klien memenuhi 6 gejala depresi selama 10 hari. Kesimpulan…" }, o: [{ id: "MDD terpenuhi" }, { id: "Belum memenuhi MDD karena durasi kurang dari 2 minggu" }, { id: "Bipolar" }, { id: "Duka" }], j: 1 },
      { q: { id: "Klien memenuhi kriteria MDD, tetapi dua tahun lalu pernah 5 hari tidak tidur, merasa hebat, dan belanja besar-besaran. Diagnosis yang lebih tepat…" }, o: [{ id: "MDD episode tunggal" }, { id: "Gangguan bipolar" }, { id: "Duka" }, { id: "ADHD" }], j: 1 },
      { q: { id: "Instrumen depresi tertua dan paling banyak dipakai menurut slide adalah…" }, o: [{ id: "PHQ-9" }, { id: "HAM-D" }, { id: "BDI-II" }, { id: "STAI" }], j: 1 },
      { q: { id: "Pada remaja, mood tertekan dalam kriteria MDD dapat tampil sebagai…" }, o: [{ id: "Euforia" }, { id: "Mudah tersinggung" }, { id: "Halusinasi" }, { id: "Kompulsi" }], j: 1 },
      { q: { id: "Menurut slide, mengapa gejala depresi sering kembali setelah obat dihentikan?" }, o: [{ id: "Obat palsu" }, { id: "Masalah yang mendasari tidak ditangani" }, { id: "Dosis terlalu tinggi" }, { id: "Pasien malingering" }], j: 1 },
      { q: { id: "Seorang praktikan menemukan klien dengan rencana bunuh diri yang jelas, tetapi ragu harus berbuat apa. Langkah sesuai slide…" }, o: [{ id: "Menunggu sesi berikutnya" }, { id: "Segera hubungi atasan/beri tahu seseorang; pertimbangkan rawat inap untuk keselamatan" }, { id: "Merahasiakan sepenuhnya" }, { id: "Memberi PR tambahan" }], j: 1 },
      { q: { id: "Perfeksionisme Ayesha (“harus selalu terbaik”) paling tepat disasar dengan…" }, o: [{ id: "SSRI saja" }, { id: "CBT yang menantang keyakinan irasional" }, { id: "Rawat inap" }, { id: "Tes IQ" }], j: 1 },
      { q: { id: "Dalam Al-Qur'an, emosi yang terkait dengan penyesalan atas masa lalu disebut…" }, o: [{ id: "Khauf" }, { id: "Ḥuzn" }, { id: "Raja'" }, { id: "Ghadhab" }], j: 1 },
      { q: { id: "Klien memenuhi gejala depresi 3 minggu setelah ayahnya wafat, tanpa pikiran tak berguna yang berat. Pertimbangan utama…" }, o: [{ id: "Langsung MDD" }, { id: "Apakah gejala lebih tepat dijelaskan oleh duka" }, { id: "Skizofrenia" }, { id: "ADHD" }], j: 1 }
    ],
    bs: [
      { t: { id: "PHQ-9 dapat dikerjakan dalam waktu kurang dari 3 menit." }, j: true },
      { t: { id: "Penyebab MDD sudah diketahui pasti, yaitu genetik saja." }, j: false },
      { t: { id: "Perempuan lebih cenderung mengalami MDD daripada laki-laki." }, j: true },
      { t: { id: "Obat antidepresan bekerja untuk semua orang." }, j: false },
      { t: { id: "DSM-5 memisahkan OCD dan gangguan trauma dari bab kecemasan." }, j: true }
    ],
    isian: [
      { t: { id: "MDD membutuhkan minimal 5 dari ______ gejala." }, j: { id: "9" }, x: [{ id: "6" }, { id: "12" }, { id: "18" }] },
      { t: { id: "Obat antidepresan yang paling sering diresepkan adalah golongan ______." }, j: { id: "SSRI" }, x: [{ id: "antipsikotik" }, { id: "stimulan" }, { id: "benzodiazepin" }] },
      { t: { id: "Sensitivitas skrining PRIME-MD dua pertanyaan adalah ______%." }, j: { id: "94" }, x: [{ id: "35" }, { id: "50" }, { id: "70" }] }
    ],
    pilah: { t: { id: "Pilah data Ayesha ke ranahnya" }, kategori: [{ id: "Emosi" }, { id: "Perilaku" }, { id: "Pikiran" }, { id: "Fisik" }], item: [{ t: { id: "Putus asa" }, k: 0 }, { t: { id: "Izin sakit berulang" }, k: 1 }, { t: { id: "Ingin mati" }, k: 2 }, { t: { id: "Sulit tidur" }, k: 3 }, { t: { id: "Malu" }, k: 0 }, { t: { id: "Menarik diri" }, k: 1 }, { t: { id: "Standar diri sangat tinggi" }, k: 2 }, { t: { id: "Lelah" }, k: 3 }] }
  },
  tugas: [
    { t: { id: "Tulis formulasi diagnosis Ayesha: data, alat, kriteria, diagnosis banding, dan langkah keselamatan." }, j: { id: "Data: perempuan 28 tahun, residen kedokteran perfeksionis, dengan sedih dan putus asa, hilang minat, sulit tidur, lelah, sulit konsentrasi, mudah marah, rasa malu dan tak berguna, menarik diri, serta pikiran bunuh diri. Skrining PRIME-MD positif, dilanjutkan 4 pertanyaan; alat: PHQ-9, BDI, HAM-D, wawancara DSM-5, dan tes neuropsikologis untuk motivasi serta perhatian. Kriteria: 7 dari 9 gejala MDD; pastikan durasi ≥ 2 minggu. Diagnosis banding: singkirkan kehamilan, gangguan hormon, anemia, efek zat, riwayat mania atau hipomania (bipolar), episode campuran, dan duka. Keselamatan: asesmen risiko bunuh diri segera, rencana keselamatan, libatkan suami dengan izin, rawat inap bila risiko tinggi, dan konsultasikan dengan atasan." } },
    { t: { id: "Rancang rencana penanganan Ayesha yang memadukan CBT, obat, gaya hidup, dan nilai Islam." }, j: { id: "CBT untuk mengenali dan menantang pikiran \"aku gagal\" serta standar perfeksionis, aktivasi perilaku untuk kembali pada aktivitas bermakna, dan pemecahan masalah beban kerja. Rujuk psikiater untuk pertimbangan SSRI, dengan edukasi bahwa obat paling efektif bersama psikoterapi dan butuh penyesuaian. Gaya hidup: olahraga aerobik teratur, tidur teratur, cek zat besi dan hormon. Nilai Islam: memaknai dzikir sebagai penenang hati (QS Ar-Ra'd 28), membedakan khauf tentang masa depan dan ḥuzn tentang masa lalu agar ia hidup di masa kini, serta melatih penerimaan diri karena Allah Maha Pengampun, tanpa menghakimi tingkat keimanannya." } }
  ]
});

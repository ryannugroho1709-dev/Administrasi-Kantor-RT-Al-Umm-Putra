/* PPTA 301 — Modul 13: Kontroversi dalam Pengujian: Bias */
Kuliah.pertemuan("tes-psikologi", {
  no: 13, tema: 5, motif: "neraca", motifOpt: { lbl: "Bias dalam Pengujian" }, durasi: 55,
  judul: { id: "Kontroversi dalam Pengujian Psikologis: Bias", en: "Controversies in Testing: Bias" },
  ringkas: { id: "**Bias** = sifat **empiris/statistik** tes pada dua kelompok atau lebih; **keadilan (fairness)** = isu **moral/filosofis/hukum**. Sumber bias: sampel normatif minim minoritas, **stereotype threat**, konten tak tepat, penguji & bahasa, konsekuensi sosial, konstruk berbeda, **validitas prediktif berbeda**, perbedaan kualitatif; **cultural loading**. Reynolds (2000): **genetik, lingkungan, interaksi, bias tes**. Ras penguji tak signifikan (Sattler & Gwynne, 1982) tetapi rapport penting. Usulan **Association of Black Psychologists** & pedoman mengurangi bias; Islam: kemuliaan karena **taqwa**." },
  tujuan: [
    { id: "Membedakan bias tes dan keadilan penggunaan tes." },
    { id: "Mengidentifikasi tujuh sumber bias dan cultural loading pada item." },
    { id: "Menjelaskan empat penjelasan perbedaan skor (Reynolds) dan pedoman mengurangi bias." }
  ],
  isi: [
    { t: "pembuka", id: "Bias tes **tidak selalu** berarti ketidakadilan atau pelecehan. Sebuah tes bisa nyaris tanpa bias statistik, tetapi **digunakan** secara tidak adil hingga merugikan minoritas — dan sebaliknya. Membedakan keduanya adalah langkah pertama." },
    { t: "banding", judul: { id: "Bias vs keadilan" }, kiri: { judul: { id: "Bias" }, warna: "blue", poin: [{ id: "Sifat **empiris** tes pada ≥ 2 kelompok" }, { id: "Ditentukan **statistik** (perbedaan hasil, validitas prediktif)" }] }, kanan: { judul: { id: "Keadilan (fairness)" }, warna: "amber", poin: [{ id: "Isu **moral, filosofis, hukum**" }, { id: "Ditentukan lewat **perdebatan & opini**; orang berakal sehat bisa berbeda pendapat" }] } },
    { t: "catatan", gaya: "info", id: "Isu utama: **konsekuensi** ketika rata-rata skor berbeda antar-kelompok etnis. Bias sering muncul karena **proporsi minoritas yang rendah dalam sampel normatif**." },
    { t: "anim", jenis: "dua-kurva", judul: { id: "Satu cut-off, dua kelompok: siapa yang tersaring?" }, a: { label: "Mayoritas", m: 58, sd: 10 }, b: { label: "Minoritas", m: 50, sd: 10 }, cut: 60, sumbu: "skor tes seleksi", geserLabel: "Geser skor batas seleksi", labelBaca: ["Minoritas lolos", "Mayoritas tertolak", "Mayoritas lolos", "Minoritas tertolak"], catatan: "Perbedaan rata-rata kecil saja (8 poin) membuat proporsi lolos sangat timpang pada cut-off tinggi. Apakah ini bias tes (validitas prediktif berbeda) atau perbedaan lingkungan nyata? Itulah pertanyaan Reynolds." },
    { t: "judul", id: "Tujuh sumber bias" },
    { t: "akordion", item: [
      { judul: { id: "1. Stereotype threat (\"efek Steele\")" }, id: "**Takut mengonfirmasi stereotip** tentang kelompoknya menghambat kinerja — mis. siswi yang diingatkan stereotip \"perempuan lemah matematika\" sebelum tes. (Slide menulis \"efek Steelean\", merujuk Claude **Steele**.)" },
      { judul: { id: "2. Konten tidak tepat" }, id: "Tes dirancang dari **pengalaman & nilai mayoritas**." },
      { judul: { id: "3. Penguji & bahasa" }, id: "Bahasa dan cara penyampaian menguntungkan satu kelompok." },
      { judul: { id: "4. Konsekuensi sosial tidak adil" }, id: "Stereotip & **pelabelan** yang merugikan individu." },
      { judul: { id: "5. Konstruk berbeda" }, id: "Tes tidak mengukur konsep yang sama secara **setara** untuk semua kelompok." },
      { judul: { id: "6. Validitas prediktif berbeda" }, id: "Akurasi prediksi berbeda bagi mayoritas & minoritas — **bentuk bias yang paling dapat diuji statistik**." },
      { judul: { id: "7. Perbedaan bakat & kepribadian" }, id: "Kelompok mungkin berbeda secara **kualitatif**." }
    ] },
    { t: "definisi", judul: { id: "Cultural loading (muatan budaya)" }, lughah: { id: "Sejauh mana tes/item **spesifik terhadap budaya tertentu**; makin tinggi muatannya, makin bias bagi peserta lintas budaya." }, istilah: { id: "Contoh: \"**Siapa Eleanor Roosevelt?**\" relevan bagi lulusan SD di AS, tidak bagi budaya lain. Versi Indonesia: \"Siapa pencipta lagu *Indonesia Raya*?\" mudah bagi siswa Indonesia, tidak bagi anak imigran." } },
    { t: "judul", id: "Menafsirkan perbedaan skor (Reynolds, 2000)" },
    { t: "poin", item: [{ ikon: "brain", judul: { id: "Genetik" }, id: "Faktor biologis." }, { ikon: "map", judul: { id: "Lingkungan" }, id: "Ekonomi, pendidikan, gizi." }, { ikon: "swap", judul: { id: "Interaksi gen–lingkungan" }, id: "Keduanya membentuk kemampuan." }, { ikon: "scale", judul: { id: "Bias tes" }, id: "Tes yang meremehkan kemampuan sebenarnya minoritas." }] },
    { t: "catatan", gaya: "tanbih", judul: { id: "Nature vs nurture" }, id: "Anggapan **inferioritas genetik** kelompok tertentu ditolak: penjelasan **murni genetik tidak dapat diterima secara ilmiah** karena lingkungan berperan besar. **Jika tes tidak bias**, maka faktor **lingkungan** harus menjadi pertimbangan utama." },
    { t: "catatan", gaya: "info", judul: { id: "Ras penguji" }, id: "Sebagian profesional mengira penguji kulit putih menghambat kinerja minoritas, tetapi **Sattler & Gwynne (1982)** tidak menemukan hubungan signifikan ras penguji–skor. Yang penting: **rapport**, terutama bagi peserta minoritas, untuk menurunkan kecemasan." },
    { t: "judul", id: "Solusi" },
    { t: "daftar", judul: { id: "Usulan Association of Black Psychologists" }, item: [{ id: "**Moratorium** tes standar pada kelompok kulit hitam hingga ada tes yang sesuai budaya." }, { id: "Penguji dari **etnis yang sama**." }, { id: "Menghapus hasil tes standar dari catatan akademik siswa yang terdampak bias." }, { id: "Memulangkan siswa yang **salah didiagnosis** dan ditempatkan di pendidikan khusus." }] },
    { t: "langkah", judul: { id: "Pedoman praktis mengurangi bias" }, item: [{ judul: { id: "Hilangkan prasangka" }, id: "Jangan membawa stereotip terhadap peserta beda etnis." }, { judul: { id: "Bahasa yang dimengerti" }, id: "Penerjemah bila perlu." }, { judul: { id: "Klarifikasi" }, id: "Tanpa mengorbankan standar, beri penjelasan bila peserta bingung." }] },
    { t: "ayat", ar: "يَا أَيُّهَا النَّاسُ إِنَّا خَلَقْنَاكُم مِّن ذَكَرٍ وَأُنثَىٰ وَجَعَلْنَاكُمْ شُعُوبًا وَقَبَائِلَ لِتَعَارَفُوا ۚ إِنَّ أَكْرَمَكُمْ عِندَ اللَّهِ أَتْقَاكُمْ ۚ إِنَّ اللَّهَ عَلِيمٌ خَبِيرٌ", id: "Wahai manusia, sesungguhnya Kami menciptakan kamu dari laki-laki dan perempuan, lalu menjadikan kamu berbangsa-bangsa dan bersuku-suku agar saling mengenal. Sesungguhnya yang paling mulia di sisi Allah ialah yang paling bertakwa. Sungguh Allah Maha Mengetahui, Maha Teliti.", src: "Al-Hujurat [49]: 13" },
    { t: "hadits", ar: "لَا فَضْلَ لِعَرَبِيٍّ عَلَى أَعْجَمِيٍّ ... إِلَّا بِالتَّقْوَى", id: "Tidak ada keutamaan orang Arab atas non-Arab … kecuali dengan takwa.", src: "HR. Ahmad no. 23489; Al-Silsilah al-Shahihah no. 2700" },
    { t: "ringkasan", item: [{ id: "Bias = statistik; keadilan = moral/hukum." }, { id: "Tujuh sumber bias; validitas prediktif berbeda paling teruji statistik." }, { id: "Cultural loading: item spesifik budaya (Eleanor Roosevelt)." }, { id: "Reynolds: genetik, lingkungan, interaksi, bias tes; penjelasan murni genetik ditolak." }, { id: "Ras penguji tak signifikan; rapport penting; hilangkan prasangka, bahasa, klarifikasi." }] },
    { t: "cek", q: { id: "Tes masuk memprediksi IPK mahasiswa mayoritas dengan r = 0,55 tetapi untuk minoritas hanya r = 0,15. Ini contoh sumber bias…" }, o: [{ id: "Cultural loading saja" }, { id: "Validitas prediktif yang berbeda" }, { id: "Stereotype threat" }, { id: "Inviolacy" }], j: 1, b: { id: "Akurasi prediksi berbeda antar-kelompok = **validitas prediktif berbeda**." } }
  ],
  istilah: [
    { t: "Test bias", id: "Sifat empiris tes yang berbeda antar-kelompok." },
    { t: "Fairness", id: "Isu moral/hukum penggunaan tes." },
    { t: "Stereotype threat", id: "Takut mengonfirmasi stereotip menurunkan kinerja (Steele)." },
    { t: "Cultural loading", id: "Muatan budaya spesifik dalam item." },
    { t: "Differential predictive validity", id: "Akurasi prediksi berbeda antar-kelompok." },
    { t: "Sampel normatif", id: "Kelompok acuan pembentuk norma." },
    { t: "Nature–nurture", id: "Perdebatan bawaan vs lingkungan." },
    { t: "Moratorium", id: "Penghentian sementara penggunaan tes." }
  ],
  latihan: {
    pg: [
      { q: { id: "Pernyataan yang TEPAT tentang bias dan keadilan adalah…" }, o: [{ id: "Keduanya ditentukan secara statistik" }, { id: "Bias ditentukan statistik; keadilan adalah isu moral/hukum yang diperdebatkan" }, { id: "Keadilan ditentukan statistik; bias opini" }, { id: "Tes tanpa bias pasti dipakai secara adil" }], j: 1 },
      { q: { id: "Sebelum tes matematika, siswi diingatkan “perempuan biasanya lemah matematika”, lalu skornya menurun. Sumber bias ini adalah…" }, o: [{ id: "Cultural loading" }, { id: "Stereotype threat" }, { id: "Bias penguji ras" }, { id: "Konstruk berbeda" }], j: 1 },
      { q: { id: "Item “Siapa Eleanor Roosevelt?” diberikan kepada anak imigran dari Indonesia. Masalah utamanya adalah…" }, o: [{ id: "Reliabilitas rendah" }, { id: "Muatan budaya tinggi (cultural loading)" }, { id: "Faking bad" }, { id: "Validitas tampak" }], j: 1 },
      { q: { id: "Temuan Sattler & Gwynne (1982) adalah…" }, o: [{ id: "Penguji kulit putih selalu menurunkan skor minoritas" }, { id: "Tidak ada hubungan signifikan antara ras penguji dan skor" }, { id: "Ras penguji menentukan validitas" }, { id: "Minoritas lebih baik dengan penguji kulit putih" }], j: 1 },
      { q: { id: "Menurut slide, bila sebuah tes terbukti TIDAK bias, perbedaan skor antar-kelompok harus terutama dijelaskan oleh…" }, o: [{ id: "Inferioritas genetik" }, { id: "Faktor lingkungan" }, { id: "Ras penguji" }, { id: "Kesalahan statistik" }], j: 1 },
      { q: { id: "Penyebab bias yang paling sering menurut slide adalah…" }, o: [{ id: "Penguji yang galak" }, { id: "Proporsi kelompok minoritas yang rendah dalam sampel normatif" }, { id: "Tes terlalu pendek" }, { id: "Peserta tidak sarapan" }], j: 1 },
      { q: { id: "Usulan Association of Black Psychologists, KECUALI…" }, o: [{ id: "Moratorium tes standar" }, { id: "Penguji dari etnis yang sama" }, { id: "Menghapus hasil tes bias dari catatan akademik" }, { id: "Menurunkan cut-off untuk semua kelompok mayoritas" }], j: 3 },
      { q: { id: "Seorang peserta minoritas tampak bingung dengan instruksi. Tindakan sesuai pedoman adalah…" }, o: [{ id: "Melanjutkan tanpa penjelasan demi standar" }, { id: "Memberi klarifikasi tanpa mengorbankan standar tes" }, { id: "Memberi kunci jawaban" }, { id: "Membatalkan tes" }], j: 1 },
      { q: { id: "Empat penjelasan Reynolds (2000) tentang perbedaan skor antar-kelompok adalah…" }, o: [{ id: "Motivasi, kelelahan, kecemasan, rapport" }, { id: "Genetik, lingkungan, interaksi gen-lingkungan, bias tes" }, { id: "Reliabilitas, validitas, norma, SEM" }, { id: "ABC" }], j: 1 }
    ],
    bs: [
      { t: { id: "Bias tes selalu berarti pelecehan terhadap minoritas." }, j: false },
      { t: { id: "Penjelasan murni genetik atas perbedaan skor antar-kelompok dapat diterima secara ilmiah." }, j: false },
      { t: { id: "Rapport sangat penting bagi peserta tes dari kelompok minoritas." }, j: true },
      { t: { id: "Tes dengan muatan budaya tinggi cenderung lebih bias bagi peserta lintas budaya." }, j: true },
      { t: { id: "QS Al-Hujurat 13 menegaskan kemuliaan berdasarkan suku bangsa." }, j: false }
    ],
    isian: [
      { t: { id: "Takut mengonfirmasi stereotip yang menghambat kinerja disebut stereotype ______." }, j: { id: "threat" }, x: [{ id: "loading" }, { id: "bias" }, { id: "effect" }] },
      { t: { id: "Sejauh mana item spesifik pada budaya tertentu disebut cultural ______." }, j: { id: "loading" }, x: [{ id: "threat" }, { id: "fairness" }, { id: "norm" }] }
    ],
    pilah: { t: { id: "Pilah: isu BIAS (statistik) atau KEADILAN (moral/hukum)?" }, kategori: [{ id: "Bias" }, { id: "Keadilan" }], item: [
      { t: { id: "Korelasi tes–IPK berbeda antar-kelompok" }, k: 0 }, { t: { id: "Apakah kuota afirmasi layak dipakai?" }, k: 1 }, { t: { id: "Item berfungsi berbeda pada dua kelompok" }, k: 0 }, { t: { id: "Apakah tes boleh menentukan beasiswa?" }, k: 1 }
    ] }
  },
  tugas: [
    { t: { id: "Bedakan bias tes dan keadilan, lalu jelaskan tujuh sumber bias." }, j: { id: "Bias adalah sifat empiris tes saat dipakai pada dua kelompok atau lebih, ditentukan statistik dari perbedaan hasil; keadilan adalah isu moral, filosofis, atau hukum tentang penggunaan tes, ditentukan lewat perdebatan. Sumber bias: (1) stereotype threat; (2) konten tak tepat karena dirancang dari pengalaman mayoritas; (3) penguji dan bahasa; (4) konsekuensi sosial tak adil seperti pelabelan; (5) tes mengukur konstruk berbeda antar-kelompok; (6) validitas prediktif berbeda; (7) perbedaan bakat dan kepribadian kualitatif. Ditambah cultural loading dan minimnya minoritas dalam sampel normatif." } },
    { t: { id: "Jelaskan empat penjelasan Reynolds (2000) atas perbedaan skor dan mengapa penjelasan murni genetik ditolak." }, j: { id: "Reynolds menyebut: pengaruh genetik, faktor lingkungan (ekonomi, pendidikan), interaksi gen-lingkungan, dan bias tes yang meremehkan kemampuan minoritas. Penjelasan murni genetik ditolak karena lingkungan berperan besar dan gen selalu berinteraksi dengan lingkungan; jika tes terbukti tidak bias, perbedaan skor harus terutama dipahami lewat faktor lingkungan, bukan inferioritas bawaan. Ini selaras dengan QS Al-Hujurat 13 bahwa kemuliaan diukur dengan takwa, bukan suku bangsa." } }
  ]
});

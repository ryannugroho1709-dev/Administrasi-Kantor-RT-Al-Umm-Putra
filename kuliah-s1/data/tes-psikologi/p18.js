/* PPTA 301 — Modul 18: Pendahuluan Asesmen Neuropsikologis */
Kuliah.pertemuan("tes-psikologi", {
  no: 18, tema: 0, motif: "otak", motifOpt: { lbl: "Asesmen Neuropsikologis" }, durasi: 60,
  judul: { id: "Pendahuluan Asesmen Neuropsikologis", en: "Introduction to Neuropsychological Assessment" },
  ringkas: { id: "Neuropsikologi mempelajari bagaimana **disfungsi otak** memengaruhi pikiran, perasaan, perilaku. Sejarah: **Phineas Gage**, **Wilder Penfield** (epilepsi) & **Brenda Milner** (hemisfer, memori). Pengujian menilai **integritas fungsional** dan **lokalisasi** — tanpa hubungan satu-satu antara area & fungsi. Tetap diperlukan meski ada fMRI/PET/CT karena banyak cedera menimbulkan **perubahan halus**. **7 tujuan** (Seidman & Bruder, 2003); metode: wawancara-observasi, IQ, tes baku, tes non-baku. Langkah klinis: medis → neurologis → neuroimaging → neuropsikologis (1–2 jam). Kondisi pasca-lesi: amnesia, afasia, dispraksia, prosopagnosia, hemiparesis, **neglect unilateral**. Penyebab: **TBI** (penetratif vs tertutup), stroke (infark, iskemia, hemoragi, aneurisma), Alzheimer, tumor." },
  tujuan: [
    { id: "Menjelaskan cakupan neuropsikologi, konsep integritas fungsional dan lokalisasi." },
    { id: "Menguraikan tujuan, metode, langkah klinis, dan tes umum asesmen neuropsikologis." },
    { id: "Mengaitkan jenis cedera otak dengan gangguan kognitif dan perilaku." }
  ],
  isi: [
    { t: "pembuka", id: "Tahun 1848, sebatang besi menembus kepala **Phineas Gage**, pekerja rel kereta. Ia selamat — tetapi orang-orang berkata, \"Gage **bukan lagi Gage**.\" Dari yang tadinya tekun dan sopan menjadi impulsif dan kasar. Kisah ini membuka pertanyaan besar: bagaimana **otak** membentuk **kepribadian**?" },
    { t: "poin", item: [
      { ikon: "user", judul: { id: "Neuropsikolog" }, id: "Psikolog yang mempelajari dampak **disfungsi otak** pada pikiran, perasaan, perilaku; bekerja bersama dokter, ahli saraf, psikiater." },
      { ikon: "star8", judul: { id: "Wilder Penfield" }, id: "Bekerja dengan pasien **epilepsi**; meletakkan dasar neuropsikologi." },
      { ikon: "star8", judul: { id: "Brenda Milner" }, id: "Interaksi antar-**hemisfer**: belajar, bahasa, emosi, persepsi." }
    ] },
    { t: "banding", judul: { id: "Dua pertanyaan pengujian" }, kiri: { judul: { id: "Integritas fungsional" }, warna: "blue", poin: [{ id: "Apakah **fungsi** tertentu masih utuh?" }, { id: "Memori, numerik, perhatian, motorik" }] }, kanan: { judul: { id: "Lokalisasi" }, warna: "green", poin: [{ id: "Apakah **area otak** tertentu berfungsi baik?" }, { id: "Catatan: satu area bisa punya **banyak fungsi** — tak ada hubungan satu-satu" }] } },
    { t: "anim", jenis: "otak", judul: { id: "Peta fungsi otak & tes yang memeriksanya" }, petunjuk: { id: "Ketuk lobus untuk melihat fungsinya dan tes yang biasa dipakai. Ingat: pemetaan ini penyederhanaan — fungsi kompleks melibatkan jaringan banyak area." } },
    { t: "catatan", gaya: "info", judul: { id: "Sudah ada fMRI, PET, CT — mengapa masih perlu tes?" }, id: "Banyak kelainan menimbulkan **perubahan halus** yang tak tampak pada pemeriksaan fisik/gambar. Pencitraan menunjukkan **struktur**; tes neuropsikologis menunjukkan **apa yang tidak bisa lagi dilakukan pasien**. Keduanya dipakai **bersama**." },
    { t: "judul", id: "Tujuh tujuan pengujian (Seidman & Bruder, 2003)" },
    { t: "daftar", item: [{ id: "Mengukur andal **korelasi perilaku–fungsi otak**." }, { id: "Menentukan kemungkinan **lokalisasi, lateralitas, etiologi** lesi." }, { id: "Mengidentifikasi profil sindrom neurobehavioral (**diagnosis banding**)." }, { id: "Menentukan ada tidaknya **defisit** kognitif, perseptual, motorik." }, { id: "Mendeskripsikan **kekuatan, kelemahan, strategi** pemecahan masalah." }, { id: "Menilai **perasaan pasien** terhadap sindromnya." }, { id: "Memberi **rekomendasi pengobatan**." }] },
    { t: "tabel", kolom: ["Metode", "Kemampuan yang dinilai"], baris: [
      ["Wawancara & observasi perilaku", "IQ; perhatian/konsentrasi"],
      ["Tes psikometrik (skala IQ)", "Fungsi motorik; fungsi eksekutif"],
      ["Tes neuropsikologis baku", "Belajar & memori; bahasa"],
      ["Tes klinis non-baku", "Mood; visuospasial"]
    ] },
    { t: "anim", jenis: "alur", judul: { id: "Langkah klinis pasien cedera otak" }, item: [{ judul: { id: "Medis darurat" }, ket: { id: "Pastikan bertahan hidup" } }, { judul: { id: "Pemeriksaan neurologis" } }, { judul: { id: "Neuroimaging" }, ket: { id: "CT, MRI, PET" } }, { judul: { id: "Asesmen neuropsikologis" }, ket: { id: "1–2 jam; profil kekuatan–kelemahan untuk **rehabilitasi**" } }] },
    { t: "judul", id: "Kondisi setelah lesi terlokalisasi" },
    { t: "tabel", kolom: ["Kondisi", "Gambaran"], baris: [
      ["**Amnesia**", "Kehilangan ingatan"],
      ["**Afasia**", "Gangguan berbicara/berbahasa"],
      ["**Dispraksia**", "Gangguan sensorimotor (merencanakan gerak)"],
      ["**Prosopagnosia**", "Tidak mengenali wajah"],
      ["**Hemiparesis**", "Tak mampu memakai satu sisi tubuh"],
      ["**Neglect unilateral**", "Tak sadar objek/peristiwa di bidang visual **kontralateral**"]
    ] },
    { t: "catatan", gaya: "faidah", judul: { id: "Tes yang umum" }, id: "**Digit Span**, **WAIS**, **Tactile Performance Test**, **Trail Making Test**, **Clock Drawing Test**. Pada neglect sisi kiri, pasien sering menggambar angka jam **menumpuk di sisi kanan**." },
    { t: "judul", id: "Penyebab cedera otak" },
    { t: "banding", judul: { id: "Traumatic Brain Injury (TBI)" }, kiri: { judul: { id: "Cedera penetratif" }, warna: "red", poin: [{ id: "Lesi **fokal**; terkait syok & tekanan" }, { id: "**Kejang** sebagai konsekuensi sekunder" }, { id: "Defisit sangat bervariasi (lokasi lesi, demografi)" }] }, kanan: { judul: { id: "Cedera tertutup" }, warna: "amber", poin: [{ id: "Benturan/gerakan kepala: **tinju, tekel sepak bola**" }, { id: "Sakit kepala, mual, pandangan kabur, gangguan tidur" }, { id: "Lelah, mood tertekan, sulit konsentrasi" }] } },
    { t: "akordion", judul: { id: "Gangguan vaskular (stroke)" }, item: [
      { judul: { id: "Infark" }, id: "Area jaringan yang rusak atau **mati** (mis. di batang otak)." },
      { judul: { id: "Iskemia" }, id: "**Penyumbatan parsial** arteri; aliran darah tidak cukup." },
      { judul: { id: "Hemoragi" }, id: "**Pendarahan** luas akibat pecahnya pembuluh darah." },
      { judul: { id: "Aneurisma" }, id: "\"**Gelembung**\" pembuluh darah yang membesar lalu pecah." }
    ] },
    { t: "catatan", gaya: "info", judul: { id: "Mengapa diuji pada demensia?" }, id: "Memantau **respons pengobatan** & perkembangan penyakit; mendukung pengajuan **disabilitas**; merekomendasikan **dukungan & perawatan**." },
    { t: "catatan", gaya: "hikmah", id: "Al-Qur'an menyebut **an-nāṣiyah** (ubun-ubun/dahi) sebagai \"ubun-ubun yang **berdusta lagi durhaka**\" (QS Al-'Alaq [96]: 16). Sebagian ulama dan peneliti kontemporer mengaitkannya dengan peran **lobus frontal** dalam pengambilan keputusan dan kendali diri — pelajaran bahwa akal dan perilaku tak terpisahkan, dan keduanya amanah." },
    { t: "ringkasan", item: [{ id: "Phineas Gage; Penfield & Milner." }, { id: "Integritas fungsional vs lokalisasi; tak ada hubungan satu-satu." }, { id: "Tetap perlu meski ada pencitraan: perubahan halus." }, { id: "7 tujuan; 4 metode; langkah medis → neurologis → imaging → neuropsikologis." }, { id: "TBI penetratif vs tertutup; stroke: infark, iskemia, hemoragi, aneurisma." }] },
    { t: "cek", q: { id: "Pasien stroke hanya memakan makanan di sisi kanan piring dan menggambar jam dengan angka menumpuk di kanan. Kondisinya kemungkinan…" }, o: [{ id: "Prosopagnosia" }, { id: "Neglect unilateral (kiri)" }, { id: "Afasia" }, { id: "Amnesia" }], j: 1, b: { id: "Tak menyadari bidang **kontralateral** = **neglect unilateral**, sering setelah lesi parietal kanan." } }
  ],
  istilah: [
    { t: "Neuropsikologi", id: "Ilmu hubungan otak–perilaku." },
    { t: "Integritas fungsional", id: "Utuh tidaknya suatu fungsi." },
    { t: "Lokalisasi", id: "Berfungsi tidaknya area otak tertentu." },
    { t: "Lateralitas", id: "Sisi hemisfer tempat lesi." },
    { t: "Afasia", id: "Gangguan berbahasa." },
    { t: "Prosopagnosia", id: "Gangguan mengenali wajah." },
    { t: "Neglect unilateral", id: "Abai pada satu sisi bidang visual." },
    { t: "TBI", id: "Traumatic Brain Injury." },
    { t: "Aneurisma", id: "Penggelembungan pembuluh darah yang bisa pecah." }
  ],
  latihan: {
    pg: [
      { q: { id: "Seorang neuropsikolog bertanya, “Apakah memori jangka pendek pasien masih utuh?” Ini menilai…" }, o: [{ id: "Lokalisasi" }, { id: "Integritas fungsional" }, { id: "Lateralitas" }, { id: "Etiologi" }], j: 1 },
      { q: { id: "Alasan paling kuat tes neuropsikologis tetap diperlukan di era fMRI adalah…" }, o: [{ id: "Lebih murah dari dokter" }, { id: "Banyak cedera menimbulkan perubahan halus; tes menunjukkan dampak fungsional pada perilaku" }, { id: "fMRI selalu salah" }, { id: "Pencitraan dilarang" }], j: 1 },
      { q: { id: "Pernyataan “tidak ada hubungan satu-satu antara lokalisasi dan fungsi” berarti…" }, o: [{ id: "Otak tidak berfungsi sesuai area" }, { id: "Satu area bisa memiliki banyak fungsi dan satu fungsi melibatkan banyak area" }, { id: "Lokalisasi tidak perlu dinilai" }, { id: "Fungsi hanya di hemisfer kiri" }], j: 1 },
      { q: { id: "Urutan langkah klinis yang benar untuk korban kecelakaan dengan cedera kepala…" }, o: [{ id: "Neuropsikologis → medis → imaging → neurologis" }, { id: "Medis → neurologis → neuroimaging → neuropsikologis" }, { id: "Imaging → neuropsikologis → medis" }, { id: "Neurologis → neuropsikologis → medis" }], j: 1 },
      { q: { id: "Pemain sepak bola sering ditekel dan kini mengeluh sakit kepala, mual, sulit tidur, dan sulit konsentrasi. Jenis cederanya…" }, o: [{ id: "Cedera penetratif" }, { id: "Cedera kepala tertutup" }, { id: "Aneurisma" }, { id: "Tumor otak" }], j: 1 },
      { q: { id: "Pasien tidak mengenali wajah istrinya, tetapi langsung mengenali suaranya. Kondisi ini adalah…" }, o: [{ id: "Afasia" }, { id: "Prosopagnosia" }, { id: "Dispraksia" }, { id: "Amnesia global" }], j: 1 },
      { q: { id: "Penyumbatan parsial arteri akibat aliran darah tidak mencukupi disebut…" }, o: [{ id: "Hemoragi" }, { id: "Iskemia" }, { id: "Infark" }, { id: "Aneurisma" }], j: 1 },
      { q: { id: "Tujuan Seidman & Bruder yang menyangkut sisi emosional pasien adalah…" }, o: [{ id: "Menentukan etiologi lesi" }, { id: "Menilai perasaan pasien terhadap sindrom yang dialaminya" }, { id: "Mengukur IQ" }, { id: "Menentukan lateralitas" }], j: 1 },
      { q: { id: "Kejang sebagai konsekuensi sekunder lebih khas pada…" }, o: [{ id: "Cedera tertutup ringan" }, { id: "Cedera kepala penetratif" }, { id: "Depresi" }, { id: "Iskemia ringan" }], j: 1 },
      { q: { id: "Tujuan utama asesmen neuropsikologis 1–2 jam setelah tahap medis adalah…" }, o: [{ id: "Menentukan biaya rumah sakit" }, { id: "Profil kekuatan dan kelemahan untuk rehabilitasi" }, { id: "Mengganti pemeriksaan neurologis" }, { id: "Diagnosis kepribadian" }], j: 1 }
    ],
    bs: [
      { t: { id: "Phineas Gage mengalami perubahan kepribadian setelah cedera lobus frontal." }, j: true },
      { t: { id: "Hemiparesis adalah ketidakmampuan memakai satu sisi tubuh." }, j: true },
      { t: { id: "Aneurisma adalah area jaringan otak yang sudah mati." }, j: false },
      { t: { id: "Tes neuropsikologis pada demensia dapat memantau respons pengobatan." }, j: true },
      { t: { id: "Brenda Milner terkenal karena kerja dengan pasien epilepsi sebagai pendiri bedah saraf." }, j: false }
    ],
    isian: [
      { t: { id: "Gangguan berbicara/berbahasa setelah lesi disebut ______." }, j: { id: "afasia" }, x: [{ id: "amnesia" }, { id: "apraksia" }, { id: "agnosia" }] },
      { t: { id: "Asesmen neuropsikologis umumnya memakan waktu 1–______ jam." }, j: { id: "2" }, x: [{ id: "5" }, { id: "8" }, { id: "12" }] }
    ],
    jodoh: [
      { a: { id: "Infark" }, b: { id: "Jaringan rusak atau mati" } },
      { a: { id: "Hemoragi" }, b: { id: "Pendarahan pembuluh pecah" } },
      { a: { id: "Neglect unilateral" }, b: { id: "Abai sisi kontralateral" } },
      { a: { id: "Dispraksia" }, b: { id: "Gangguan sensorimotor" } },
      { a: { id: "Clock Drawing Test" }, b: { id: "Visuospasial & perencanaan" } }
    ],
    urut: { t: { id: "Urutkan langkah klinis" }, item: [{ id: "Prosedur medis darurat" }, { id: "Pemeriksaan neurologis" }, { id: "Neuroimaging" }, { id: "Asesmen neuropsikologis" }] }
  },
  tugas: [
    { t: { id: "Jelaskan perbedaan integritas fungsional dan lokalisasi, serta alasan asesmen neuropsikologis tetap diperlukan di era neuroimaging." }, j: { id: "Integritas fungsional menilai apakah fungsi tertentu (memori, numerik, perhatian, motorik) masih utuh; lokalisasi menilai apakah area neuroanatomi tertentu masih berfungsi. Hubungan area–fungsi tidak satu-satu karena satu area bisa memiliki banyak fungsi. Meski ada fMRI, PET, dan CT, banyak kelainan menyebabkan perubahan halus yang tidak tampak, dan pencitraan hanya menunjukkan struktur; tes neuropsikologis menunjukkan dampak fungsional pada perilaku, kekuatan–kelemahan untuk rehabilitasi, dan perasaan pasien, sehingga keduanya dipakai bersama." } },
    { t: { id: "Bandingkan cedera kepala penetratif dan tertutup serta empat jenis gangguan vaskular." }, j: { id: "Penetratif: lesi fokal, terkait syok dan tekanan, kejang sebagai konsekuensi sekunder, defisit bervariasi menurut lokasi lesi dan demografi. Tertutup: akibat benturan atau gerakan kepala seperti tinju dan tekel, dengan sakit kepala, mual, penglihatan kabur, gangguan tidur, lelah, mood tertekan, sulit konsentrasi. Vaskular: infark (jaringan mati), iskemia (sumbatan parsial arteri), hemoragi (pendarahan karena pembuluh pecah), aneurisma (gelembung pembuluh yang membesar lalu pecah)." } }
  ]
});

/* PPTA 301 — Modul 21: Tes Memori & Penyakit Alzheimer (Wechsler Memory Scale) */
Kuliah.pertemuan("tes-psikologi", {
  no: 21, tema: 2, motif: "keping-otak", motifOpt: { lbl: "Memori & Alzheimer" }, durasi: 60,
  judul: { id: "Tes Memori & Penyakit Alzheimer", en: "Memory Testing & Alzheimer's Disease" },
  ringkas: { id: "Tes memori adalah **inti** asesmen kognitif; keluhan memori umum pada depresi, kecemasan, skizofrenia, stroke. Klinisi harus membedakan **penurunan normal akibat usia** dari **demensia awal**. **WMS** awal: angka, desain, pasangan kata → **Memory Quotient (MQ)**; keterbatasan: MQ terlalu sederhana, norma hanya **200** orang 25–30 th. **WMS-III**: konsistensi 0,74–0,93, antar-penilai Logical Memory > 0,90, bentuk paralel. Perbandingan indeks: **langsung vs tertunda**, auditori vs visual, **tertunda vs rekognisi** (masalah *retrieval*), **memori kerja vs langsung**. Fungsi khusus: **orientasi**, **malingering** (≈ 50% = menebak). Perubahan bermakna 80%: Indeks Memori Umum **≥ 8 poin** (Iverson, 1999). Islam: *insān* — *nisyān*." },
  tujuan: [
    { id: "Menjelaskan peran tes memori, sejarah, dan psikometri Wechsler Memory Scale." },
    { id: "Menafsirkan perbandingan indeks memori (langsung–tertunda, auditori–visual, retrieval–rekognisi, kerja–langsung)." },
    { id: "Menilai orientasi, malingering, dan perubahan memori yang bermakna secara klinis." }
  ],
  isi: [
    { t: "pembuka", id: "Nenek sering lupa menaruh kacamata — wajar karena usia, atau tanda awal **Alzheimer**? Dengan populasi lansia yang terus bertambah, membedakan keduanya menjadi tugas penting klinisi." },
    { t: "poin", item: [
      { ikon: "layers", judul: { id: "Bagian baterai" }, id: "Inti setiap asesmen kognitif; berbasis teori memori terkini." },
      { ikon: "flag", judul: { id: "Keluhan umum" }, id: "Depresi, kecemasan, skizofrenia, stroke." },
      { ikon: "user", judul: { id: "Alzheimer" }, id: "Pada WMS: **pengenalan wajah relatif utuh**, tetapi **memori verbal terganggu**." }
    ] },
    { t: "anim", jenis: "otak", judul: { id: "Otak & memori" }, lobus: {
      hipokampus: { nama: "Hipokampus", fungsi: "Membentuk memori **baru**; biasanya terdampak **paling awal** pada Alzheimer → recall tertunda anjlok.", tes: "Indeks memori tertunda (WMS), recall cerita (Logical Memory)" },
      temporal: { nama: "Lobus temporal", fungsi: "Memori **verbal-auditori**, terutama hemisfer **kiri**.", tes: "Auditory Immediate & Delayed Index" },
      frontal: { nama: "Lobus frontal", fungsi: "**Memori kerja** dan strategi mengambil kembali (*retrieval*).", tes: "Working Memory Index, Digit Span" },
      oksipital: { nama: "Lobus oksipital", fungsi: "Masukan **visual** sebelum disimpan.", tes: "Visual Immediate Index" }
    }, petunjuk: { id: "Ketuk area untuk melihat peranannya dalam memori." } },
    { t: "judul", id: "Sejarah & psikometri WMS" },
    { t: "banding", kiri: { judul: { id: "Kekuatan" }, warna: "green", poin: [{ id: "Konsistensi internal **0,74–0,93**" }, { id: "Logical Memory: antar-penilai **> 0,90**" }, { id: "Membedakan populasi klinis & non-klinis" }, { id: "±15 menit; **bentuk paralel** mengurangi efek latihan" }, { id: "WMS-III: lebih banyak subtes, skor canggih, stimulus baru" }] }, kanan: { judul: { id: "Keterbatasan (WMS awal)" }, warna: "red", poin: [{ id: "**MQ** terlalu sederhana (sebanding IQ)" }, { id: "Norma dari **200** pasien usia **25–30**" }, { id: "Riset terbatas" }, { id: "Logical Memory tanpa pedoman jelas (kecepatan membaca, intonasi)" }] } },
    { t: "catatan", gaya: "info", judul: { id: "Struktur memori berubah dengan usia" }, id: "Analisis faktor menunjukkan pola skor memori **berbeda** pada kelompok muda dan lansia (memori kerja, visual, auditori) — wajar, karena komponen memori makin **terdisosiasi** seiring usia." },
    { t: "catatan", gaya: "tanbih", judul: { id: "IQ jauh lebih tinggi dari memori?" }, id: "Dulu dipakai sebagai tanda **disfungsi otak**. Hati-hati: fluktuasi besar juga terjadi pada orang **normal**; pada disfungsi otak biasanya **kemampuan non-memori lain** ikut menurun." },
    { t: "judul", id: "Membaca perbandingan indeks" },
    { t: "anim", jenis: "profil", judul: { id: "Kasus Pak H (68 th): indeks WMS-III" }, mode: "batang", min: 40, max: 130, rata: 100, sd: 15, skala: [{ k: "AI", v: 98, n: "Aud. langsung" }, { k: "AD", v: 74, n: "Aud. tertunda" }, { k: "ARD", v: 95, n: "Rekognisi" }, { k: "VI", v: 96, n: "Vis. langsung" }, { k: "VD", v: 78, n: "Vis. tertunda" }, { k: "WM", v: 90, n: "Mem. kerja" }], ket: { id: "Langsung normal, **tertunda turun tajam** (24 poin auditori) → ia bisa belajar tetapi informasi **memudar**. Namun **rekognisi (95) jauh di atas recall tertunda (74)** → sebagian masalahnya **pengambilan kembali (*retrieval*)**: \"saya tahu, tapi tak bisa memikirkannya sekarang\"." } },
    { t: "tabel", kolom: ["Perbandingan", "Bila…", "Makna & contoh"], baris: [
      ["**Langsung vs tertunda**", "Tertunda ≪ langsung", "Bisa belajar, tetapi memudar — lupa nomor telepon"],
      ["**Auditori langsung vs tertunda**", "AI > AD", "Laju lupa tinggi — lupa waktu & tempat rapat yang diberitahukan lisan"],
      ["**Visual langsung vs tertunda**", "VI > VD", "Info visual hilang — lupa siapa yang hadir rapat"],
      ["**Auditori vs visual langsung**", "Auditori ≪ visual", "Lesi hemisfer **kiri**; lebih baik diberi **peta** daripada petunjuk lisan"],
      ["**Tertunda vs rekognisi**", "Rekognisi > tertunda", "Masalah **retrieval** (WMS-III memakai pilihan ganda)"],
      ["**Kerja vs langsung**", "Kerja < langsung", "Bisa belajar di tempat tenang, tetapi tak bisa **multitasking**; keduanya rendah = sulit belajar info baru"]
    ] },
    { t: "judul", id: "Fungsi khusus" },
    { t: "poin", item: [
      { ikon: "compass", judul: { id: "Orientasi" }, id: "Tempat, waktu, dll. Pasien Alzheimer bisa menyebut tahun sekarang **1947**." },
      { ikon: "flag", judul: { id: "Malingering" }, id: "Ya/tidak: apakah item ada di cerita? **≈ 50% benar** = menebak; atau **rekognisi tidak lebih baik** daripada recall bebas (seharusnya rekognisi lebih mudah)." }
    ] },
    { t: "anim", jenis: "spektrum", judul: { id: "Perubahan Indeks Memori Umum: nyata atau kebetulan?" }, min: -20, max: 20, satuan: "Perubahan skor", awal: 5, rentang: [
      { label: { id: "Penurunan nyata" }, dari: -20, sampai: -8, ket: { id: "≤ −8: penurunan bermakna (80%)" } },
      { label: { id: "Belum pasti" }, dari: -8, sampai: 8, ket: { id: "Bisa karena kesalahan ukur/latihan" } },
      { label: { id: "Perbaikan nyata" }, dari: 8, sampai: 20, ket: { id: "≥ 8: perbaikan bermakna (80%)" } }
    ], ket: { id: "Indeks perubahan **Iverson (1999)** — ambang 80%: Aud. langsung 11, Vis. langsung 10, Langsung 10, Aud. tertunda 13, Vis. tertunda 10, Rekognisi aud. tertunda 15, **Memori Umum 8**, Memori kerja 9. Contoh: dari 80 harus menjadi **≥ 88**." } },
    { t: "catatan", gaya: "hikmah", judul: { id: "Perspektif Islam: insān dan nisyān" }, id: "Sebagian ulama mengaitkan kata **insān** (manusia) dengan **nisyān** (lupa). Karena manusia mudah lupa, Al-Qur'an disebut **adz-Dzikr** (pengingat). Kadang masalahnya bukan memori, tetapi **perhatian** — menjaga **taqwa** agar tidak lupa menaati perintah-Nya dan menjauhi larangan-Nya." },
    { t: "ayat", ar: "وَلَقَدْ عَهِدْنَا إِلَىٰ آدَمَ مِن قَبْلُ فَنَسِيَ وَلَمْ نَجِدْ لَهُ عَزْمًا", id: "Dan sungguh, telah Kami pesankan kepada Adam dahulu, tetapi dia lupa, dan Kami tidak dapati padanya kemauan yang kuat.", src: "Thaha [20]: 115" },
    { t: "ringkasan", item: [{ id: "Tes memori inti asesmen; bedakan penuaan normal vs demensia." }, { id: "WMS awal: MQ, norma 200 orang; WMS-III: reliabel, paralel." }, { id: "Tertunda ≪ langsung = memudar; rekognisi > tertunda = retrieval." }, { id: "Auditori ≪ visual = hemisfer kiri; kerja < langsung = sulit multitasking." }, { id: "Malingering ≈ 50%; perubahan bermakna Memori Umum ≥ 8 poin." }] },
    { t: "cek", q: { id: "Pada tes rekognisi ya/tidak, klien menjawab benar 49%, dan skor rekognisinya tidak lebih baik daripada recall bebas. Kemungkinan terbesar…" }, o: [{ id: "Alzheimer berat" }, { id: "Malingering (menebak/berpura-pura)" }, { id: "Masalah retrieval murni" }, { id: "Memori normal" }], j: 1, b: { id: "≈ 50% = tingkat tebakan; dan rekognisi seharusnya **lebih mudah** daripada recall." } }
  ],
  istilah: [
    { t: "WMS", id: "Wechsler Memory Scale." },
    { t: "Memory Quotient", id: "Skor global WMS awal, sebanding IQ." },
    { t: "Memori langsung", id: "Recall segera setelah materi disajikan." },
    { t: "Memori tertunda", id: "Recall setelah jeda waktu." },
    { t: "Retrieval", id: "Mengambil kembali informasi yang tersimpan." },
    { t: "Rekognisi", id: "Mengenali informasi di antara pilihan." },
    { t: "Memori kerja", id: "Menahan & mengolah info sambil mengerjakan tugas lain." },
    { t: "Malingering", id: "Sengaja berpura-pura mengalami defisit." },
    { t: "Indeks perubahan", id: "Ambang perubahan bermakna (Iverson, 1999)." }
  ],
  latihan: {
    pg: [
      { q: { id: "Klien mampu mengulang cerita dengan baik segera setelah dibacakan, tetapi 30 menit kemudian hampir tak ingat apa pun, dan pada pilihan ganda juga gagal. Masalah utamanya…" }, o: [{ id: "Retrieval" }, { id: "Penyimpanan (informasi memudar/tidak terkonsolidasi)" }, { id: "Perhatian awal" }, { id: "Malingering pasti" }], j: 1 },
      { q: { id: "Klien gagal mengingat daftar kata secara bebas tetapi mengenali hampir semuanya pada pilihan ganda. Tafsiran…" }, o: [{ id: "Informasi tidak pernah dipelajari" }, { id: "Kesulitan retrieval — informasi tersimpan tetapi sulit diambil" }, { id: "Malingering" }, { id: "Gangguan visual" }], j: 1 },
      { q: { id: "Pasien stroke hemisfer kiri lebih mudah mengikuti peta daripada petunjuk lisan. Pola indeksnya…" }, o: [{ id: "Visual langsung ≪ auditori langsung" }, { id: "Auditori langsung ≪ visual langsung" }, { id: "Memori kerja > langsung" }, { id: "Semua setara" }], j: 1 },
      { q: { id: "Indeks Memori Umum pasien cedera kepala naik dari 82 (bulan ke-3) menjadi 87 (bulan ke-6). Kesimpulan berdasarkan Iverson (1999)…" }, o: [{ id: "Perbaikan nyata pasti terjadi" }, { id: "Belum dapat dipastikan sebagai perubahan nyata; ambangnya 8 poin" }, { id: "Memburuk" }, { id: "Tes tidak valid" }], j: 1 },
      { q: { id: "Keterbatasan norma WMS awal adalah…" }, o: [{ id: "Terlalu banyak lansia" }, { id: "Sampel kecil 200 pasien usia 25–30 tahun" }, { id: "Tidak ada norma sama sekali" }, { id: "Norma hanya anak-anak" }], j: 1 },
      { q: { id: "Karyawan bisa belajar efektif di ruangan sepi, tetapi kacau saat harus mendengar instruksi sambil mengetik. Pola indeksnya…" }, o: [{ id: "Memori kerja < memori langsung" }, { id: "Memori langsung < memori kerja" }, { id: "Rekognisi < tertunda" }, { id: "Visual < auditori" }], j: 0 },
      { q: { id: "Mengapa IQ yang jauh lebih tinggi dari skor memori harus ditafsirkan hati-hati?" }, o: [{ id: "IQ tidak berkaitan dengan otak" }, { id: "Fluktuasi besar juga terjadi pada orang normal; disfungsi otak biasanya juga menurunkan kemampuan lain" }, { id: "Skor memori selalu salah" }, { id: "Karena WMS tidak punya norma" }], j: 1 },
      { q: { id: "Pasien Alzheimer menurut slide pada WMS menunjukkan…" }, o: [{ id: "Memori verbal utuh, wajah terganggu" }, { id: "Pengenalan wajah relatif utuh, memori verbal terganggu" }, { id: "Semua utuh" }, { id: "Hanya orientasi terganggu" }], j: 1 },
      { q: { id: "Struktur faktor memori berbeda antara kelompok muda dan lansia karena…" }, o: [{ id: "Lansia tidak memahami instruksi" }, { id: "Komponen memori makin terdisosiasi seiring usia" }, { id: "Norma salah" }, { id: "Lansia malingering" }], j: 1 },
      { q: { id: "Nilai ambang perubahan bermakna yang paling BESAR dalam daftar Iverson adalah pada indeks…" }, o: [{ id: "Memori Umum (8)" }, { id: "Rekognisi auditori tertunda (15)" }, { id: "Memori kerja (9)" }, { id: "Visual langsung (10)" }], j: 1 }
    ],
    bs: [
      { t: { id: "Bentuk paralel WMS membantu mengurangi efek latihan saat tes ulang." }, j: true },
      { t: { id: "Reliabilitas antar-penilai Logical Memory di bawah 0,50." }, j: false },
      { t: { id: "Skor sekitar 50% pada tes rekognisi ya/tidak mengindikasikan menebak." }, j: true },
      { t: { id: "Memory Quotient dinilai mempertimbangkan banyak variabel klien." }, j: false },
      { t: { id: "Pasien Alzheimer bisa salah menyebut tahun sekarang dalam tes orientasi." }, j: true }
    ],
    isian: [
      { t: { id: "Skor global WMS awal disebut Memory ______." }, j: { id: "Quotient" }, x: [{ id: "Index" }, { id: "Scale" }, { id: "Span" }] },
      { t: { id: "Indeks Memori Umum harus berubah minimal ______ poin untuk perubahan bermakna (80%)." }, j: { id: "8" }, x: [{ id: "3" }, { id: "15" }, { id: "20" }] }
    ],
    jodoh: [
      { a: { id: "Tertunda ≪ langsung" }, b: { id: "Informasi memudar" } },
      { a: { id: "Rekognisi > tertunda" }, b: { id: "Masalah retrieval" } },
      { a: { id: "Auditori ≪ visual" }, b: { id: "Lesi hemisfer kiri" } },
      { a: { id: "Kerja < langsung" }, b: { id: "Sulit multitasking" } },
      { a: { id: "≈ 50% ya/tidak" }, b: { id: "Kemungkinan malingering" } }
    ]
  },
  tugas: [
    { t: { id: "Tafsirkan profil: Auditori langsung 100, Auditori tertunda 76, Rekognisi auditori tertunda 98, Memori kerja 85. Apa artinya dan apa saranmu?" }, j: { id: "Auditori langsung normal tetapi tertunda turun 24 poin (melebihi ambang 13), menunjukkan laju lupa tinggi untuk informasi lisan. Namun rekognisi 98 jauh di atas recall tertunda 76, sehingga informasi sebenarnya tersimpan dan masalah utamanya adalah pengambilan kembali (retrieval). Memori kerja 85 lebih rendah daripada memori langsung, jadi ia kesulitan saat harus memperhatikan sambil mengerjakan tugas lain. Saran: beri petunjuk pengingat (cue), catatan tertulis atau visual, kurangi multitasking, dan lakukan tes ulang dengan bentuk paralel untuk memantau perubahan memakai indeks Iverson." } },
    { t: { id: "Jelaskan cara WMS membantu membedakan penurunan memori normal, Alzheimer, dan malingering." }, j: { id: "Penuaan normal: penurunan ringan dan seimbang, struktur faktor memang berubah dengan usia, orientasi utuh, rekognisi baik. Alzheimer: memori verbal dan recall tertunda terganggu sejak awal (hipokampus), informasi memudar, orientasi terganggu (mis. menyebut tahun 1947), meski pengenalan wajah relatif utuh. Malingering: jawaban ya/tidak sekitar 50% (menebak) dan rekognisi tidak lebih baik daripada recall bebas, padahal rekognisi seharusnya lebih mudah. Perbandingan dengan IQ ditafsirkan hati-hati karena fluktuasi juga ada pada orang normal." } }
  ]
});

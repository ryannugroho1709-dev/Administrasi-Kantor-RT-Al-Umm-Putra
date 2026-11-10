/* PPTA301 — Peta alat tes: tes apa untuk apa */
Kuliah.pertemuan("peta-tes", {
  no: 2, tema: 2, motif: "lembar-tes", motifOpt: { lbl: "Peta Alat Tes" }, durasi: 45,
  judul: { id: "Peta Alat Tes: Tes Apa untuk Apa?", en: "Map of Tests" },
  ringkas: { id: "Semua alat ukur yang muncul di PPTA301 dikelompokkan menurut fungsinya: kecerdasan, kepribadian objektif & proyektif, gejala klinis singkat, neuropsikologi & memori, perkembangan & autisme, adiksi, serta wawancara terstruktur. Untuk setiap alat: **sasaran usia**, **jumlah butir/skor kunci**, dan **kapan dipakai**." },
  tujuan: [
    { id: "Memilih alat ukur yang tepat untuk pertanyaan rujukan tertentu." },
    { id: "Mengingat ciri kunci (usia, butir, skor batas) setiap alat." }
  ],
  isi: [
    { t: "pembuka", id: "Soal ujian sering berbunyi: *\"Klien X dengan keluhan Y — tes apa yang paling tepat dan mengapa?\"*. Hafalkan alat **beserta alasannya** (sasaran, kelebihan, keterbatasan)." },
    { t: "tabel", judul: { id: "Kecerdasan & kemampuan" }, kolom: ["Alat", "Sasaran", "Ciri kunci", "Dipakai untuk"], baris: [
      ["**WAIS-III/IV**", "16–89 th", "FSIQ, VIQ, PIQ / 4 indeks; norma 2.450 orang; 60–90 menit", "IQ dewasa, garis dasar kognitif, cedera otak"],
      ["**WISC-IV**", "6–16 th", "Menekankan kecepatan; profil ACID", "IQ anak, gangguan belajar, disabilitas intelektual"],
      ["**K-ABC**", "3–18 th", "Minim verbal, boleh mengajarkan butir awal", "Anak ASD/bahasa terbatas, minoritas"],
      ["**Bayley Scales**", "1–42 bulan", "Indeks mental, psikomotor, perilaku", "Perkembangan bayi (IQ dihindari < 4 th)"],
      ["**UNIT**", "Anak–remaja", "Nonverbal sepenuhnya", "Klien beda bahasa/budaya"],
      ["**Bentuk singkat WAIS**", "Dewasa", "r ≥ 0,90 dengan bentuk penuh; tulis *Est IQ*", "Skrining cepat"]
    ] },
    { t: "tabel", judul: { id: "Kepribadian" }, kolom: ["Alat", "Jenis", "Ciri kunci", "Catatan"], baris: [
      ["**MMPI-2**", "Objektif (laporan diri)", "567 butir B/S; ≥ 16 th; ±90 menit; 10 skala klinis + L, F, Back F, K; T ≥ 65", "Kunci empiris; nama skala menyesatkan; bias religius"],
      ["**Rorschach**", "Proyektif", "10 kartu bercak tinta; skor lokasi–determinan–konten; Exner Comprehensive System", "±2,5 jam total; terbatas < 14 th"],
      ["**TAT**", "Proyektif", "Kartu bergambar orang; cerita sebelum–sekarang–perasaan–akhir", "Stimulus Barat bisa asing bagi klien Muslim"],
      ["**Tes menggambar**", "Proyektif/perkembangan", "Gambar spontan", "Kognisi, minat, pemahaman sosial anak"]
    ] },
    { t: "tabel", judul: { id: "Gejala klinis singkat (laporan diri/rating)" }, kolom: ["Alat", "Mengukur", "Ciri kunci"], baris: [
      ["**BDI-II**", "Depresi", "21 butir 0–3; 0–63; cut-off 18; butir 9 = bunuh diri; baca kelas 5–6"],
      ["**PHQ-9**", "Depresi", "9 butir 0–3, 2 minggu terakhir; < 3 menit"],
      ["**PRIME-MD (2 pertanyaan)**", "Skrining depresi", "Sensitivitas 94%, spesifisitas 35%"],
      ["**HAM-D**", "Depresi (dinilai klinisi)", "Tertua & paling banyak dipakai"],
      ["**STAI**", "Kecemasan state & trait", "20 butir per bagian; > 8.000 penelitian"],
      ["**PANSS**", "Gejala positif & negatif skizofrenia", "Rating klinisi"],
      ["**AUDIT / FTND**", "Alkohol / nikotin", "AUDIT ≥ 8 berisiko; FTND 0–10"]
    ] },
    { t: "tabel", judul: { id: "Neuropsikologi & memori" }, kolom: ["Alat", "Ciri kunci", "Dipakai untuk"], baris: [
      ["**WMS-III**", "Indeks langsung/tertunda, auditori/visual, rekognisi, memori kerja; ±15 menit; bentuk paralel; perubahan bermakna Indeks Memori Umum ≥ 8 poin", "Alzheimer, cedera kepala, malingering"],
      ["**Digit Span**", "Mengulang angka maju/mundur", "Perhatian & memori kerja"],
      ["**Trail Making Test**", "Menghubungkan angka/huruf", "Kecepatan & fleksibilitas (frontal)"],
      ["**Clock Drawing Test**", "Menggambar jam", "Visuospasial, perencanaan, neglect"],
      ["**Tactile Performance Test**", "Memasang balok tanpa melihat", "Fungsi taktil & motorik"],
      ["**NEPSY**", "3–12 th: perhatian, bahasa, visuospasial, eksekutif, memori", "Profil neuropsikologis anak (ASD)"],
      ["**MMSE / MoCA**", "Skrining kognitif singkat", "Demensia"]
    ] },
    { t: "tabel", judul: { id: "Perkembangan, ADHD & autisme" }, kolom: ["Alat", "Ciri kunci"], baris: [
      ["**ADI-R**", "Wawancara semi-terstruktur orang tua; cenderung over-diagnosis pada usia 2 th dengan keterlambatan kognitif"],
      ["**ADOS**", "Observasi bermain bebas → klaster autisme; melengkapi ADI-R"],
      ["**M-CHAT / daftar periksa DSM-5**", "Skrining autisme balita"],
      ["**Conners, ASRS, Barkley, Brown**", "Skala penilaian ADHD anak & dewasa"]
    ] },
    { t: "tabel", judul: { id: "Wawancara & sistem" }, kolom: ["Alat", "Ciri kunci"], baris: [
      ["**MSE (Mental Status Examination)**", "Penampilan, perilaku, bicara, mood, afek, pikiran, persepsi, kognisi, wawasan"],
      ["**SADS**", "Wawancara semi-terstruktur gangguan afektif & skizofrenia; 6 skala; 3 bagian"],
      ["**Social Support Questionnaire**", "Dukungan sosial untuk perencanaan pengobatan"],
      ["**SOMPA**", "Asesmen pluralistik multikultural (medis, sosial, pluralistik)"],
      ["**Religiosity of Islam Scale**", "Mengukur religiusitas klien Muslim"],
      ["**Body Image Virtual Reality Scale**", "Citra tubuh berbasis VR"]
    ] },
    { t: "catatan", gaya: "faidah", judul: { id: "Rumus memilih tes" }, id: "**Pertanyaan rujukan → usia & bahasa klien → konstruk → reliabilitas & validitas → norma yang sesuai budaya → kualifikasi penguji → waktu & biaya.** Tidak ada satu tes yang cukup: gabungkan **wawancara + observasi + tes + data pihak lain**." },
    { t: "ringkasan", item: [{ id: "Kecerdasan: WAIS, WISC, K-ABC, Bayley, UNIT." }, { id: "Kepribadian: MMPI-2 (objektif), Rorschach & TAT (proyektif)." }, { id: "Gejala: BDI-II, PHQ-9, HAM-D, STAI, PANSS." }, { id: "Neuro: WMS, Digit Span, Trail Making, Clock Drawing, NEPSY." }, { id: "Autisme/ADHD: ADI-R, ADOS, Conners, ASRS." }] }
  ],
  latihan: {
    pg: [
      { q: { id: "Anak 2 tahun dengan keterlambatan perkembangan perlu dinilai kemampuannya. Alat yang tepat…" }, o: [{ id: "WAIS" }, { id: "Bayley Scales" }, { id: "MMPI" }, { id: "Rorschach" }], j: 1 },
      { q: { id: "Klien imigran berbahasa Arab, belum bisa bahasa Indonesia, perlu tes kecerdasan. Pilihan terbaik…" }, o: [{ id: "WAIS verbal" }, { id: "UNIT (nonverbal)" }, { id: "BDI-II" }, { id: "TAT" }], j: 1 },
      { q: { id: "Untuk memantau perubahan memori pasien cedera kepala setiap 3 bulan sambil mengurangi efek latihan…" }, o: [{ id: "WMS dengan bentuk paralel" }, { id: "Rorschach" }, { id: "STAI" }, { id: "Bayley" }], j: 0 },
      { q: { id: "Alat yang membedakan kecemasan sesaat dan kecenderungan cemas…" }, o: [{ id: "PHQ-9" }, { id: "STAI" }, { id: "HAM-D" }, { id: "PANSS" }], j: 1 },
      { q: { id: "Klien berusia 15 tahun akan diberi MMPI-2. Masalahnya…" }, o: [{ id: "Tidak ada" }, { id: "MMPI-2 ditujukan untuk usia 16 tahun ke atas" }, { id: "MMPI-2 hanya untuk lansia" }, { id: "MMPI-2 tidak punya skala validitas" }], j: 1 },
      { q: { id: "Tes yang paling peka mendeteksi neglect visual sisi kiri…" }, o: [{ id: "Clock Drawing Test" }, { id: "BDI-II" }, { id: "STAI" }, { id: "AUDIT" }], j: 0 }
    ],
    jodoh: [
      { a: { id: "WISC" }, b: { id: "IQ anak 6–16 tahun" } },
      { a: { id: "K-ABC" }, b: { id: "Anak minim bahasa, 3–18 tahun" } },
      { a: { id: "MMPI-2" }, b: { id: "567 butir, skala validitas L-F-K" } },
      { a: { id: "Rorschach" }, b: { id: "10 bercak tinta" } },
      { a: { id: "PANSS" }, b: { id: "Gejala positif-negatif" } },
      { a: { id: "NEPSY" }, b: { id: "Neuropsikologi anak 3–12 tahun" } }
    ]
  },
  tugas: [
    { t: { id: "Seorang ibu membawa anak 7 tahun yang jarang bicara, tidak menatap mata, dan suka menyusun mainan berbaris. Susun baterai asesmen beserta alasannya." }, j: { id: "Wawancara riwayat perkembangan dan ADI-R dengan ibu; observasi langsung ADOS yang dimulai dengan bermain bebas; tes kecerdasan minim bahasa seperti K-ABC di ruang terstruktur (bukan WISC yang sarat bahasa); NEPSY untuk profil perhatian, eksekutif, dan memori wajah; penilaian bicara-bahasa dan perilaku adaptif; tes menggambar dan bermain spontan; pemeriksaan pendengaran untuk menyingkirkan tuli kongenital. Alasan: autisme sangat heterogen sehingga diperlukan profil kekuatan-defisit, laporan orang tua dan observasi saling melengkapi, dan tes harus menyesuaikan bahasa, tuntutan sosial, serta peralihan tugas." } }
  ]
});

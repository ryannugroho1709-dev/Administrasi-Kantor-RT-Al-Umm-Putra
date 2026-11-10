/* PPTA 301 — Modul 12: DSM — Menentukan Diagnosis */
Kuliah.pertemuan("tes-psikologi", {
  no: 12, tema: 0, motif: "kamus", motifOpt: { lbl: "DSM — Menentukan Diagnosis" }, durasi: 65,
  judul: { id: "DSM — Menentukan Diagnosis", en: "DSM — Making a Diagnosis" },
  ringkas: { id: "Kritik DSM (model medis, berorientasi patologi, dukungan uji klinis kurang, bukan berbasis genetika, over-diagnosis & over-prescribing). **DSM-5**: revisi besar pertama dalam 30 tahun, **tanpa sistem Axis I–V**, 3 bagian, 20-an kelompok diagnostik; informasi per gangguan (kriteria, prevalensi, perjalanan, risiko, budaya, gender, bunuh diri, diagnosis banding, komorbiditas). Pergeseran ke **dimensional** (skala 0–4, spektrum) dan **perkembangan**; perubahan penting: disabilitas intelektual, ASD, gangguan komunikasi sosial, kecemasan tanpa OCD/PTSD, gangguan penggunaan zat, neurokognitif 6 domain." },
  tujuan: [
    { id: "Menjelaskan kritik terhadap DSM dan struktur DSM-5." },
    { id: "Membedakan diagnosis kategorikal dan dimensional, termasuk skala 0–4." },
    { id: "Mengidentifikasi perubahan penting kategori diagnostik DSM-5." }
  ],
  isi: [
    { t: "pembuka", id: "DSM adalah \"bahasa bersama\" para klinisi untuk menamai gangguan. Tetapi bahasa membentuk cara berpikir: apakah seseorang \"punya depresi\" (ya/tidak) — atau berada di titik tertentu pada **kontinum** kesedihan?" },
    { t: "judul", id: "Kritik terhadap DSM" },
    { t: "daftar", item: [{ id: "Berdasarkan **model medis**." }, { id: "Berorientasi pada **patologi**, bukan **kekuatan** individu (vs psikologi positif & terapi bicara)." }, { id: "Dukungan **uji klinis** kurang memadai." }, { id: "Kriteria **tidak didasarkan pada genetika**." }, { id: "Kekhawatiran **over-diagnosing** dan **over-prescribing**." }] },
    { t: "judul", id: "DSM-5: revisi & struktur" },
    { t: "poin", item: [
      { ikon: "refresh", judul: { id: "Revisi besar" }, id: "Pertama dalam **30 tahun**; ingin menjadi **dokumen hidup** yang terus diperbarui berbasis bukti (masukan via situs resmi)." },
      { ikon: "x", judul: { id: "Tanpa Axis I–V" }, id: "Diganti **kode diagnostik** (masih 5 jenis kode)." },
      { ikon: "layers", judul: { id: "3 bagian" }, id: "(1) Dasar-dasar; (2) **Kriteria & kode**; (3) Pengukuran & model yang berkembang — alat penilaian, **formulasi budaya**, model gangguan kepribadian." }
    ] },
    { t: "akordion", judul: { id: "Informasi yang tersedia untuk setiap gangguan" }, item: [
      { judul: { id: "Kriteria & ciri" }, id: "Kriteria diagnostik dengan pengkodean & pencatatan; ciri diagnostik (deskripsi gejala); ciri tambahan pendukung." },
      { judul: { id: "Prevalensi & perjalanan" }, id: "Data AS (dan dunia), usia, jenis kelamin; onset, perkembangan, remisi, kekambuhan." },
      { judul: { id: "Risiko & prognosis" }, id: "Temperamen, lingkungan, genetika, fisiologis." },
      { judul: { id: "Budaya, gender, bunuh diri" }, id: "Isu diagnostik terkait budaya & gender; risiko bunuh diri; konsekuensi fungsional." },
      { judul: { id: "Diagnosis banding & komorbiditas" }, id: "Gangguan lain yang mirip & yang sering muncul bersamaan." }
    ] },
    { t: "judul", id: "Kategorikal → dimensional" },
    { t: "banding", kiri: { judul: { id: "Kategorikal" }, warna: "amber", poin: [{ id: "Ya/Tidak memenuhi kriteria" }, { id: "Batas tegas antara normal–gangguan" }] }, kanan: { judul: { id: "Dimensional" }, warna: "green", poin: [{ id: "Diagnosis berada pada **kontinum/spektrum**" }, { id: "Gejala dinilai **0–4**" }, { id: "Contoh: **Gangguan Spektrum Autisme**" }] } },
    { t: "anim", jenis: "spektrum", judul: { id: "Skala gejala dimensional DSM-5 (0–4)" }, min: 0, max: 4, satuan: "Nilai gejala", awal: 2, rentang: [
      { label: { id: "0 Tidak ada" }, dari: 0, sampai: 0.5 }, { label: { id: "1 Ringan/jarang" }, dari: 0.5, sampai: 1.5 }, { label: { id: "2 Ringan/beberapa hari" }, dari: 1.5, sampai: 2.5 }, { label: { id: "3 Sedang" }, dari: 2.5, sampai: 3.5 }, { label: { id: "4 Parah" }, dari: 3.5, sampai: 4 }
    ], ket: { id: "Berbeda dari sistem lama yang hanya **Ya/Tidak** — kini keparahan gejala tercatat bertingkat." } },
    { t: "catatan", gaya: "info", judul: { id: "Pendekatan perkembangan" }, id: "Patologi anak & remaja dipandang sebagai **penyimpangan dari norma perkembangan**: usia munculnya gejala, presentasi yang khas per kelompok usia, dan bagaimana gejala **berubah sepanjang hidup**." },
    { t: "judul", id: "Kelompok diagnostik & perubahan penting" },
    { t: "tabel", kolom: ["Kelompok", "Poin penting DSM-5"], baris: [
      ["**Neurodevelopmental**", "IQ + **fungsi adaptif**; keparahan ditentukan **fungsi adaptif**; *Mental Retardation* → **Intellectual Disability**. **ADHD**: inatensi & hiperaktivitas/impulsivitas. **Gangguan Komunikasi Sosial** (baru)."],
      ["**Autisme (ASD)**", "Menyatukan autisme, **Asperger**, gangguan disintegratif masa kanak-kanak, **PDD-NOS**; 2 ranah: komunikasi/interaksi sosial + perilaku/minat **terbatas & repetitif**."],
      ["**Skizofrenia & psikotik**", "Delusi aneh, halusinasi auditori, ucapan tak terorganisasi; minimal satu episode mayor."],
      ["**Bipolar**", "Episode depresif mayor & **mania**; perubahan aktivitas, energi, mood."],
      ["**Depresif**", "Distres signifikan/gangguan fungsi; **duka (bereavement)** dapat memicu depresi mayor, lebih mungkin bila ada riwayat pribadi/keluarga."],
      ["**Kecemasan**", "**Tidak lagi** mencakup OCD & PTSD; kecemasan **tak proporsional** terhadap ancaman (pertimbangkan budaya); serangan panik."],
      ["**Trauma & stres**", "Gangguan stres akut: dialami langsung, disaksikan, tak langsung; intrusi, mood negatif, disosiasi, penghindaran, arousal."],
      ["**Makan**", "ARFID, anoreksia (keparahan via **BMI**), bulimia (episode binge & purging/minggu), **binge eating**: ≥ 1×/minggu selama 3 bulan + ≥ 3 ciri."],
      ["**Zat & adiksi**", "Abuse + dependence → satu **use disorder**; withdrawal; **gambling**; kafein & internet gaming (untuk kajian lanjut)."],
      ["**Neurokognitif**", "6 domain: perhatian kompleks, fungsi eksekutif, belajar & memori, bahasa, perseptual-motorik, **kognisi sosial**; delirium; Alzheimer."]
    ] },
    { t: "catatan", gaya: "faidah", judul: { id: "Binge eating disorder: kriteria minimal 3 dari 5" }, id: "Makan jauh lebih cepat; makan hingga tidak nyaman; makan banyak meski tak lapar; makan sendirian karena malu; merasa jijik/depresi/bersalah setelahnya — **≥ 1× seminggu selama 3 bulan**." },
    { t: "catatan", gaya: "hikmah", judul: { id: "Perspektif Islam: kategori vs kontinum" }, id: "**Munafik vs kemunafikan**: bukan penilaian hitam-putih — kita berlindung dari sifat nifak, meski dalam keseharian mungkin tampak sebagian bentuknya dalam ucapan & perilaku. Seorang Muslim berserah diri kepada Allah — tetapi **sejauh mana**? Ketundukan pun berada pada **kontinum** yang naik-turun, bukan status statis." },
    { t: "ringkasan", item: [{ id: "Kritik: model medis, patologi, minim uji klinis, bukan genetik, over-diagnosis." }, { id: "DSM-5: tanpa Axis, kode diagnostik, 3 bagian, dokumen hidup." }, { id: "Dimensional (0–4, spektrum) & perkembangan." }, { id: "Intellectual disability (fungsi adaptif), ASD menyatukan Asperger & PDD-NOS." }, { id: "Kecemasan tanpa OCD/PTSD; use disorder; neurokognitif 6 domain." }] },
    { t: "cek", q: { id: "Menurut DSM-5, tingkat keparahan disabilitas intelektual ditentukan terutama oleh…" }, o: [{ id: "Skor IQ saja" }, { id: "Fungsi adaptif" }, { id: "Usia onset" }, { id: "Riwayat keluarga" }], j: 1, b: { id: "IQ tetap dinilai, tetapi **keparahan ditentukan fungsi adaptif**." } }
  ],
  istilah: [
    { t: "DSM-5", id: "Diagnostic and Statistical Manual edisi 5 (2013)." },
    { t: "Sistem multiaksial", id: "Axis I–V di DSM-IV; dihapus di DSM-5." },
    { t: "Diagnosis dimensional", id: "Gejala pada kontinum, skala 0–4." },
    { t: "Diagnosis banding", id: "Membedakan gangguan yang mirip." },
    { t: "Komorbiditas", id: "Dua gangguan atau lebih bersamaan." },
    { t: "Intellectual disability", id: "Pengganti istilah mental retardation." },
    { t: "Fungsi adaptif", id: "Kemampuan mengurus diri & beradaptasi sehari-hari." },
    { t: "Use disorder", id: "Gabungan abuse & dependence zat." },
    { t: "Bereavement", id: "Duka akibat kehilangan orang tercinta." }
  ],
  latihan: {
    pg: [
      { q: { id: "Perubahan struktural DSM-5 yang PALING menonjol dibanding DSM-IV adalah…" }, o: [{ id: "Penambahan Axis VI" }, { id: "Penghapusan sistem Axis I–V dan penggunaan kode diagnostik" }, { id: "Penghapusan semua gangguan kepribadian" }, { id: "Penghapusan kriteria diagnostik" }], j: 1 },
      { q: { id: "Seorang anak dulu didiagnosis “Asperger”. Menurut DSM-5, diagnosisnya kini termasuk…" }, o: [{ id: "Gangguan Komunikasi Sosial" }, { id: "Gangguan Spektrum Autisme" }, { id: "Disabilitas intelektual" }, { id: "ADHD" }], j: 1 },
      { q: { id: "Klien memenuhi gejala kompulsi mencuci tangan berulang. Menurut DSM-5, ia TIDAK lagi diklasifikasi di bawah…" }, o: [{ id: "Gangguan kecemasan" }, { id: "Gangguan obsesif-kompulsif" }, { id: "Gangguan neurokognitif" }, { id: "Gangguan zat" }], j: 0 },
      { q: { id: "Sebuah gejala dinilai “3” pada asesmen dimensional DSM-5. Artinya…" }, o: [{ id: "Tidak ada" }, { id: "Ringan/jarang" }, { id: "Sedang" }, { id: "Parah" }], j: 2 },
      { q: { id: "Seseorang makan berlebihan 2× seminggu selama 4 bulan, makan sangat cepat, makan sendirian karena malu, dan merasa bersalah setelahnya. Diagnosis yang paling sesuai adalah…" }, o: [{ id: "Anoreksia" }, { id: "Binge eating disorder" }, { id: "Bulimia (tanpa purging tidak mungkin)" }, { id: "ARFID" }], j: 1 },
      { q: { id: "DSM-5 menggabungkan “penyalahgunaan” dan “ketergantungan” alkohol menjadi…" }, o: [{ id: "Alcohol use disorder" }, { id: "Alcohol dependence" }, { id: "Axis II" }, { id: "Delirium" }], j: 0 },
      { q: { id: "Domain neurokognitif DSM-5 yang mencakup memahami emosi dan niat orang lain adalah…" }, o: [{ id: "Fungsi eksekutif" }, { id: "Kognisi sosial" }, { id: "Bahasa" }, { id: "Perseptual-motorik" }], j: 1 },
      { q: { id: "Kritik “berorientasi patologi” terhadap DSM paling dekat dengan pandangan…" }, o: [{ id: "Psikologi positif yang menekankan kekuatan individu" }, { id: "Model medis" }, { id: "Genetika perilaku" }, { id: "Psikofarmakologi" }], j: 0 },
      { q: { id: "Keparahan anoreksia dalam DSM-5 ditentukan oleh…" }, o: [{ id: "Jumlah episode purging" }, { id: "Indeks massa tubuh (BMI)" }, { id: "Skor IQ" }, { id: "Lama sakit" }], j: 1 },
      { q: { id: "Pendekatan perkembangan DSM-5 memandang patologi anak sebagai…" }, o: [{ id: "Versi kecil gangguan dewasa" }, { id: "Penyimpangan dari norma perkembangan, dengan presentasi khas tiap usia" }, { id: "Tidak dapat didiagnosis" }, { id: "Selalu genetik" }], j: 1 }
    ],
    bs: [
      { t: { id: "DSM-5 adalah revisi besar pertama dalam 30 tahun terakhir." }, j: true },
      { t: { id: "PTSD tetap termasuk kelompok gangguan kecemasan dalam DSM-5." }, j: false },
      { t: { id: "Gangguan Komunikasi Sosial adalah kondisi baru di DSM-5." }, j: true },
      { t: { id: "Kriteria DSM didasarkan sepenuhnya pada genetika." }, j: false },
      { t: { id: "Gambling disorder termasuk kelompok gangguan terkait zat dan adiksi." }, j: true },
      { t: { id: "Asesmen dimensional DSM-5 hanya memakai jawaban Ya/Tidak." }, j: false }
    ],
    isian: [
      { t: { id: "Mental retardation diganti istilah ______ disability." }, j: { id: "intellectual" }, x: [{ id: "learning" }, { id: "adaptive" }, { id: "cognitive" }] },
      { t: { id: "Dua gangguan atau lebih yang muncul bersamaan disebut ______." }, j: { id: "komorbiditas" }, x: [{ id: "prevalensi" }, { id: "remisi" }, { id: "prognosis" }] },
      { t: { id: "Binge eating disorder: minimal sekali seminggu selama ______ bulan." }, j: { id: "3" }, x: [{ id: "1" }, { id: "6" }, { id: "12" }] }
    ],
    pilah: { t: { id: "Pilah ke kelompok diagnostik DSM-5" }, kategori: [{ id: "Neurodevelopmental" }, { id: "Zat & adiksi" }, { id: "Neurokognitif" }], item: [
      { t: { id: "ADHD" }, k: 0 }, { t: { id: "Gambling disorder" }, k: 1 }, { t: { id: "Delirium" }, k: 2 }, { t: { id: "Disabilitas intelektual" }, k: 0 }, { t: { id: "Alcohol use disorder" }, k: 1 }, { t: { id: "Alzheimer" }, k: 2 }
    ] }
  },
  tugas: [
    { t: { id: "Uraikan lima kritik terhadap DSM dan bagaimana DSM-5 berusaha meresponsnya." }, j: { id: "Kritik: berbasis model medis, berorientasi patologi bukan kekuatan, dukungan uji klinis kurang, kriteria tidak berbasis genetika, dan risiko over-diagnosing serta over-prescribing. DSM-5 merespons dengan menjadi dokumen hidup yang diperbarui berbasis bukti, memasukkan pendekatan dimensional (gejala 0–4 dan spektrum) dan perkembangan, menyertakan formulasi budaya, isu gender, faktor risiko (temperamen, lingkungan, genetika, fisiologis), serta diagnosis banding untuk mengurangi kesalahan diagnosis." } },
    { t: { id: "Bandingkan diagnosis kategorikal dan dimensional dengan contoh, lalu kaitkan dengan perspektif Islam." }, j: { id: "Kategorikal memutuskan ya/tidak memenuhi kriteria dengan batas tegas; dimensional menempatkan gejala pada kontinum—DSM-5 menilai gejala 0 (tidak ada) hingga 4 (parah) dan menyusun gangguan seperti autisme sebagai spektrum. Contoh: dua anak sama-sama didiagnosis ASD tetapi berbeda jauh dalam bahasa dan kemandirian. Dalam Islam, munafik vs kemunafikan juga bukan hitam-putih: seorang Muslim berlindung dari sifat nifak meski mungkin menampakkan sebagiannya, dan ketundukan kepada Allah berada pada kontinum yang naik-turun." } }
  ]
});

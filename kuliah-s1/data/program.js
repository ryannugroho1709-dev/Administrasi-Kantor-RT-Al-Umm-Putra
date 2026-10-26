/* =====================================================================
   PROGRAM S1 PSIKOLOGI ISLAM — INTERNATIONAL OPEN UNIVERSITY (IOU), 8 SEMESTER
   - Kuliah mandiri (tanpa jadwal hari), ujian: UTS = Modul 1–15, UAS = Modul 16–30
   - Mata kuliah semester lain ditambahkan ketika modulnya tersedia
     (isi mk: [ … ] pada semesternya + buat folder data/<id>/pNN.js).
   ===================================================================== */
(function () {
  const kosong = no => ({ no, status: no === 1 || no === 5 ? "aktif" : "segera", ar: "الفصل الدراسي " + ["الأول", "الثاني", "الثالث", "الرابع", "الخامس", "السادس", "السابع", "الثامن"][no - 1], mk: [] });
  const sem = [1, 2, 3, 4, 5, 6, 7, 8].map(kosong);

  sem[0].mk.push({
    id: "bahasa-inggris", kode: "ENES101", ikon: "language", tema: 10, motif: "abc", motifOpt: { lbl: "English 101" }, jumlah: 30,
    ujian: { uts: [1, 15], uas: [16, 30] }, teksBahasa: "id", bahasa: "en", labelKitab: "Buku", sampul: "Academic Literacy", sampulPenulis: "Underhill & Dube",
    nama: { id: "Bahasa Inggris (Literasi Akademik)", en: "English 101 — Academic Literacy" },
    kitab: { id: "Academic Literacy · English Grammar for the Utterly Confused · Introduction to Academic Writing", en: "Academic Literacy · English Grammar for the Utterly Confused · Introduction to Academic Writing" },
    penulis: { id: "Underhill & Dube · Laurie Rozakis · Oshima & Hogue", en: "Underhill & Dube · Laurie Rozakis · Oshima & Hogue" },
    dosen: { id: "Rasheeda Abdul Hakeem", en: "Rasheeda Abdul Hakeem" },
    tentang: {
      id: "Mata kuliah ini memperkuat **literasi akademik**: gaya belajar, membangun kosakata, membaca aktif (**SQ3R**, anotasi), mencatat & meringkas, peta pikiran, kerangka, argumen, menghindari **plagiarisme** (parafrase & sitasi), hingga **proses menulis** — pra-menulis, menyusun draf, dan merevisi. Ujian memakai materi kuliah **dan** buku teks. Setiap modul dilengkapi **Rumus Mahir** (di luar modul) untuk menjadi pengguna bahasa Inggris yang mahir."
    },
    tentangPenulis: {
      id: "Dosen: **Rasheeda Abdul Hakeem** (Amerika), pendidik sejak 1986 dan mengajar di IOU sejak awal berdiri. Buku: *Academic Literacy* (Underhill & Dube), *English Grammar for the Utterly Confused* (Rozakis), *Introduction to Academic Writing* (Oshima & Hogue)."
    },
    bab: [
      { id: "Belajar cara belajar & kosakata", en: "Learning to learn", dari: 1, sampai: 2 },
      { id: "Membaca aktif", en: "Active reading", dari: 3, sampai: 4 },
      { id: "Mencatat & memetakan ide", en: "Notes & mind maps", dari: 5, sampai: 8 },
      { id: "Argumen & integritas akademik", en: "Arguments & integrity", dari: 9, sampai: 10 },
      { id: "Proses menulis", en: "The writing process", dari: 11, sampai: 15 },
      { id: "Transisi & mengedit", en: "Transitions & editing", dari: 16, sampai: 17 },
      { id: "Tanda baca", en: "Punctuation", dari: 18, sampai: 19 },
      { id: "Tata kalimat: SVA, koordinasi, paralel", en: "Sentence grammar", dari: 20, sampai: 22 },
      { id: "Pendahuluan, kesimpulan, ringkasan", en: "Intros, conclusions, summaries", dari: 23, sampai: 25 },
      { id: "Laporan & tugas menulis", en: "Reports & assignments", dari: 26, sampai: 27 },
      { id: "Keterampilan belajar & ujian", en: "Study & exam skills", dari: 28, sampai: 30 }
    ]
  });

  sem[0].mk.push({
    id: "kisi-inggris", induk: "bahasa-inggris", kode: "Kisi-kisi", ikon: "target", tema: 3, motif: "toga", motifOpt: { lbl: "Study Questions" }, jumlah: 2, tanpaUjian: true, bahasa: "en", labelKitab: "Sumber", sampul: "Study Questions", sampulPenulis: "ENES101 · UTS & UAS",
    nama: { id: "Kisi-kisi Ujian ENES101", en: "ENES101 Study Questions" },
    kitab: { id: "ENES101 Study Questions (UTS) · Final Study Questions (UAS)", en: "ENES101 Study Questions (UTS) · Final Study Questions (UAS)" },
    dosen: { id: "Rasheeda Abdul Hakeem", en: "Rasheeda Abdul Hakeem" },
    tentang: { id: "Soal latihan resmi dari dosen: **UTS** (25 soal singkat + 34 uraian, Modul 1–15) dan **UAS** (per unit 16–30), lengkap dengan jawaban model yang disusun dari materi modul. Soal singkatnya juga ikut masuk ke bank soal Arena." },
    bab: [{ id: "UTS", en: "Midterm", dari: 1, sampai: 1 }, { id: "UAS", en: "Final", dari: 2, sampai: 2 }]
  });

  sem[0].mk.push({
    id: "rumus-inggris", induk: "bahasa-inggris", kode: "Pengayaan", ikon: "bolt", tema: 6, motif: "target", motifOpt: { lbl: "Fluency Formula" }, jumlah: 6, tanpaUjian: true, bahasa: "en", labelKitab: "Rujukan", sampul: "Fluency Formula", sampulPenulis: "4 Strands · SRS · PEEL",
    nama: { id: "Rumus Mahir Bahasa Inggris", en: "The Fluency Formula" },
    kitab: { id: "Nation (Four Strands) · Krashen · Ebbinghaus · Swain", en: "Fluency Formula" },
    dosen: { id: "Pengayaan di luar modul (disusun dari riset pemerolehan bahasa)", en: "Enrichment" },
    tentang: { id: "**Di luar modul resmi.** Enam pelajaran singkat berisi *rumus* yang dipakai para pembelajar mahir: keseimbangan empat untai (Four Strands), kosakata berulang berjarak, membaca ekstensif, shadowing & kelancaran bicara, menulis paragraf PEEL, serta rutinitas harian. Tanpa ujian — cukup dibaca dan dipraktikkan." },
    bab: [{ id: "Rumus inti", en: "Core formulas", dari: 1, sampai: 6 }]
  });

  sem[4].mk.push({
    id: "psikologi-adiktif", kode: "PPAB301", sks: 3, ikon: "brain", tema: 1, motif: "otak", motifOpt: { lbl: "علم نفس السلوك الإدماني" }, jumlah: 30,
    ujian: { uts: [1, 15], uas: [16, 30] }, teksBahasa: "id",
    nama: { id: "Psikologi Perilaku Adiktif", ar: "علم نفس السلوك الإدماني" },
    kitab: { id: "PPAB301 · PSY 204 — Psychology of Addictive Behaviours", ar: "علم نفس السلوك الإدماني" },
    penulis: { id: "Prof. Dr. G. Hussein Rassool", ar: "أ.د. حسين رسول" },
    dosen: { id: "Prof. Dr. G. Hussein Rassool", ar: "أ.د. حسين رسول" },
    tentang: {
      id: "Mata kuliah ini membahas **perilaku adiktif** dari sudut psikologi dan **perspektif Islam**: pengertian, sejarah, dan dampak sosial adiksi; teori-teori penyebabnya (biologis, psikologis, sosiokultural) dan model adiksi dalam Islam; lalu zat-zat utama — **alkohol, nikotin, opiat, psikostimulan** — hingga adiksi perilaku, pencegahan, dan penanganan berbasis bukti."
    },
    tentangPenulis: {
      id: "Prof. Dr. G. Hussein Rassool adalah profesor psikologi Islam dan pakar adiksi. Rujukan utama mata kuliah: *Understanding Addiction Behaviours* (2011) dan *Alcohol and Drug Misuse* (2009)."
    },
    bab: [
      { id: "Pengantar & sejarah adiksi", ar: "مدخل وتاريخ", dari: 1, sampai: 4 },
      { id: "Islam & teori adiksi", ar: "الإسلام ونظريات الإدمان", dari: 5, sampai: 9 },
      { id: "Alkohol", ar: "الكحول", dari: 10, sampai: 11 },
      { id: "Nikotin", ar: "النيكوتين", dari: 12, sampai: 13 },
      { id: "Opiat & psikostimulan", ar: "الأفيونات والمنشطات", dari: 14, sampai: 16 },
      { id: "Halusinogen, ganja, inhalansia & obat resep", ar: "المهلوسات والقنب والمستنشقات", dari: 17, sampai: 20 },
      { id: "Adiksi perilaku: makan, judi, internet, seks", ar: "الإدمان السلوكي", dari: 21, sampai: 24 },
      { id: "Diagnosis ganda, dukungan & intervensi", ar: "التشخيص المزدوج والتدخل", dari: 25, sampai: 28 },
      { id: "Perspektif Islam & refleksi", ar: "المنظور الإسلامي والتأمل", dari: 29, sampai: 30 }
    ]
  });

  sem[4].mk.push({
    id: "disabilitas", kode: "PMAD301", ikon: "users", tema: 7, motif: "payung", motifOpt: { lbl: "نماذج ومقاربات الإعاقة" }, jumlah: 30,
    ujian: { uts: [1, 15], uas: [16, 30] }, teksBahasa: "id",
    nama: { id: "Model dan Pendekatan terhadap Disabilitas", en: "Models and Approaches to Disability", ar: "نماذج ومقاربات الإعاقة" },
    kitab: { id: "PMAD301 · PSY 404 — Psychological Models and Approaches to Disability", ar: "نماذج ومقاربات الإعاقة" },
    penulis: { id: "Hannah Morris", ar: "هانا موريس" },
    dosen: { id: "Hannah Morris", ar: "هانا موريس" },
    tentang: {
      id: "Mata kuliah ini membahas **apa itu disabilitas** (definisi WHO, disabilitas fisik, psikiatris, intelektual & belajar), **perspektif Islam** (Al-Qur'an & Sunnah, rukhsah, tokoh-tokoh Muslim penyandang disabilitas, surah 'Abasa), lalu **model-model disabilitas** — medis, sosial, konstruksionis, teori kritis, normalisasi, kapabilitas, berbasis kekuatan, keterbatasan fungsional, Nagi, dan biopsikososial/ICF — hingga **penerapannya**: tim multidisipliner, peran psikolog, budaya, penyesuaian, asesmen, rehabilitasi, dan masa depan (model afirmasi)."
    },
    tentangPenulis: { id: "Dosen: **Hannah Morris** (IOU). Materi disusun dari transkrip video kuliah Modul 1–30; setiap modul memuat pengayaan *Di luar modul* berreferensi, termasuk konteks pendidikan inklusif di Indonesia." },
    bab: [
      { id: "Dasar: definisi & jenis disabilitas", ar: "المفهوم والأنواع", dari: 1, sampai: 4 },
      { id: "Disabilitas dalam Islam", ar: "الإعاقة في الإسلام", dari: 5, sampai: 7 },
      { id: "Model medis & kritiknya", ar: "النموذج الطبي", dari: 8, sampai: 10 },
      { id: "Model sosial & turunannya", ar: "النموذج الاجتماعي وفروعه", dari: 11, sampai: 17 },
      { id: "Fungsional, Nagi & biopsikososial", ar: "الوظيفي ونموذج ناجي والحيوي النفسي الاجتماعي", dari: 18, sampai: 21 },
      { id: "Tim, psikolog & budaya", ar: "الفريق والأخصائي والثقافة", dari: 22, sampai: 24 },
      { id: "Penyesuaian, pengalaman, asesmen & rehabilitasi", ar: "التكيف والتجربة والتقييم والتأهيل", dari: 25, sampai: 28 },
      { id: "Masa depan & penutup", ar: "المستقبل والخاتمة", dari: 29, sampai: 30 }
    ]
  });

  sem[4].mk.push({
    id: "kisi-disabilitas", induk: "disabilitas", kode: "Kisi-kisi", ikon: "target", tema: 5, motif: "target", motifOpt: { lbl: "Study Questions" }, jumlah: 2, tanpaUjian: true, teksBahasa: "id", labelKitab: "Sumber", sampul: "Study Questions", sampulPenulis: "PMAD301 · UTS",
    nama: { id: "Kisi-kisi Ujian PMAD301", en: "PMAD301 Study Questions" },
    kitab: { id: "PMAD301 · PSY 404 — Midterm study questions (INA)", en: "PMAD301 Midterm study questions" },
    dosen: { id: "Hannah Morris", en: "Hannah Morris" },
    tentang: { id: "**20 soal uraian UTS resmi** dari dosen (Modul 1–15) lengkap dengan jawaban model + soal Benar/Salah. Pelajaran 2 berisi **latihan UAS mandiri** (Modul 16–30) yang disusun aplikasi — bukan soal resmi, karena berkas UAS belum tersedia." },
    bab: [{ id: "UTS (resmi)", en: "Midterm", dari: 1, sampai: 1 }, { id: "UAS (latihan mandiri)", en: "Final practice", dari: 2, sampai: 2 }]
  });

  window.PROGRAM = {
    nama: { id: "S1 Psikologi Islam", ar: "بكالوريوس علم النفس الإسلامي" },
    singkat: "S1",
    lembaga: { id: "International Open University (IOU)", ar: "الجامعة الدولية المفتوحة" },
    naungan: { id: "Kuliah daring mandiri", ar: "تعليم عن بعد" },
    angkatan: { id: "Semester 1 & Semester 5 sedang berjalan", ar: "الفصل الأول والخامس" },
    mulai: { id: "", ar: "" },
    info: { id: "Kuliah mandiri berbasis modul. Tiap mata kuliah 30 modul: **Modul 1–15 untuk UTS**, **Modul 16–30 untuk UAS**; setiap modul diakhiri kuis." },
    mandiri: true,
    semesterAktif: [1, 5],
    kanal: {},
    semester: sem
  };
})();

/* PPTA 301 — Modul 2: Jenis-jenis Tes */
Kuliah.pertemuan("tes-psikologi", {
  no: 2, tema: 2, motif: "puzzle", motifOpt: { lbl: "Jenis-jenis Tes Psikologi" }, durasi: 50,
  judul: { id: "Jenis-jenis Tes Psikologi", en: "Types of Psychological Tests" },
  ringkas: { id: "Tes psikologi meminta seseorang **melakukan perilaku** yang dapat diamati & diukur untuk menaksir atribut dan **memprediksi hasil**. Tujuh kategori: **prestasi & bakat, kecerdasan, neuropsikologis, pekerjaan, kepribadian (objektif & proyektif), klinis, DSM**. Waspadai **tes pseudo-psikologis** daring." },
  tujuan: [
    { id: "Mengelompokkan tes ke dalam tujuh kategori beserta contohnya." },
    { id: "Membedakan prestasi vs bakat, integritas fungsional vs lokalisasi, tes objektif vs proyektif." },
    { id: "Menjelaskan mengapa tes daring populer bukan tes psikologis yang sah." }
  ],
  isi: [
    { t: "pembuka", id: "Tes psikologi selalu **meminta perilaku**: menjawab, menyusun balok, mengulang angka, bercerita tentang gambar. Perilaku yang teramati itu diukur agar kita bisa menaksir **atribut, sifat, atau karakteristik** — dan **memprediksi** hasil di masa depan." },
    { t: "anim", jenis: "siklus", judul: { id: "Tujuh kategori tes" }, pusat: { id: "Tes psikologi" }, item: [
      { judul: { id: "Prestasi & bakat" }, ket: { id: "SAT, GRE, MCAT" } }, { judul: { id: "Kecerdasan" }, ket: { id: "WAIS-IV" } }, { judul: { id: "Neuropsikologis" }, ket: { id: "Digit Span" } },
      { judul: { id: "Pekerjaan" }, ket: { id: "Minat & seleksi" } }, { judul: { id: "Kepribadian" }, ket: { id: "MMPI, Rorschach" } }, { judul: { id: "Klinis" }, ket: { id: "BDI, BAI" } }, { judul: { id: "DSM-5" }, ket: { id: "Klasifikasi diagnosis" } }
    ] },
    { t: "judul", id: "1. Prestasi & bakat" },
    { t: "banding", kiri: { judul: { id: "Prestasi (achievement)" }, warna: "blue", poin: [{ id: "Mengukur **seberapa banyak yang sudah kamu ketahui** — pengetahuan yang dicapai" }, { id: "Melihat ke **belakang** (hasil belajar)" }] }, kanan: { judul: { id: "Bakat (aptitude)" }, warna: "green", poin: [{ id: "Mengukur **kapasitas untuk belajar/menguasai** suatu topik" }, { id: "Melihat ke **depan** (potensi)" }] } },
    { t: "catatan", gaya: "info", id: "Contoh: SAT, GRE, MCAT — dipakai di pendidikan/pekerjaan. **Di setting klinis, psikolog tidak menguji hal ini.**" },
    { t: "judul", id: "2. Kecerdasan" },
    { t: "definisi", judul: { id: "Kecerdasan" }, lughah: { id: "Kemampuan mental umum: berpikir logis, merencanakan, memecahkan masalah, berpikir **abstrak**, memahami ide & bahasa, serta **belajar dari pengalaman**." }, istilah: { id: "**WAIS-IV**: prosedur standar yang membandingkan kinerja seseorang di berbagai bidang dengan **rekan seusia**; 4 skor indeks: **Pemahaman Verbal, Penalaran Perseptual, Memori Kerja, Kecepatan Pemrosesan**." } },
    { t: "anim", jenis: "profil", judul: { id: "Contoh profil 4 indeks WAIS-IV" }, mode: "batang", min: 40, max: 150, rata: 100, sd: 15, skala: [{ k: "VCI", v: 108, n: "Verbal" }, { k: "PRI", v: 101, n: "Perseptual" }, { k: "WMI", v: 86, n: "Memori kerja" }, { k: "PSI", v: 79, n: "Kecepatan" }], ket: { id: "Rata-rata 100, SD 15. Pada pasien cedera otak traumatis, WAIS dipakai melihat **perubahan kognitif** — misalnya sebelum & sesudah bedah saraf. Profil seperti ini (WMI & PSI turun) sering dijumpai pasca-cedera." } },
    { t: "daftar", judul: { id: "Kritik terhadap tes IQ (dibahas rinci di M16–17)" }, item: [{ id: "Masalah **pelabelan**." }, { id: "Bukan ukuran akurat kecerdasan itu sendiri — lebih tepatnya **memprediksi perilaku masa depan**." }, { id: "**Bias** yang melekat ketika dipakai secara individu." }] },
    { t: "judul", id: "3. Neuropsikologis" },
    { t: "banding", judul: { id: "Dua pertanyaan neuropsikologis" }, kiri: { judul: { id: "Integritas fungsional" }, warna: "green", poin: [{ id: "Apakah **fungsi** tertentu masih utuh?" }, { id: "Memori jangka pendek/panjang, numerik, perhatian, motorik" }] }, kanan: { judul: { id: "Lokalisasi" }, warna: "amber", poin: [{ id: "Apakah **wilayah otak** tertentu berfungsi baik?" }, { id: "Menghubungkan defisit dengan area neuroanatomi" }] } },
    { t: "daftar", judul: { id: "Kegunaan klinis & metode" }, item: [{ id: "Menyingkirkan kemungkinan **sindrom otak organik**." }, { id: "Membedakan **depresi vs demensia** pada lansia (pseudo-demensia depresif)." }, { id: "Metode: wawancara & observasi, tes psikometrik (IQ), tes neuropsikologis **terstandarisasi** (mis. **Digit Span**), dan tes klinis tidak terstandarisasi." }] },
    { t: "judul", id: "4. Pekerjaan · 5. Kepribadian" },
    { t: "daftar", item: [{ id: "**Tes pekerjaan**: mencocokkan **minat** Anda dengan orang yang sukses di karier tertentu; mengidentifikasi kandidat berkualifikasi, pra-skrining, menilai kerja tim & kepemimpinan." }, { id: "**Tes/inventori kepribadian**: menggambarkan aspek karakter yang **stabil lintas situasi** (mis. \"Pada skala 1–10, seberapa mudah Anda merasa terganggu?\")." }] },
    { t: "banding", judul: { id: "Dua wajah tes kepribadian" }, kiri: { judul: { id: "Objektif — MMPI" }, warna: "blue", poin: [{ id: "Paling umum dipakai" }, { id: "**10 subskala** (mis. histeria, depresi, paranoia, maskulinitas/feminitas)" }, { id: "Format **Benar/Salah**" }, { id: "Sifat kepribadian & **psikopatologi**" }] }, kanan: { judul: { id: "Proyektif — Rorschach" }, warna: "amber", poin: [{ id: "Kartu **bercak tinta**" }, { id: "Pasien menggambarkan apa yang dilihat/diingatkan" }, { id: "Menilai **struktur kepribadian**: cara membangun & memaknai pengalaman perseptual" }] } },
    { t: "catatan", gaya: "tanbih", id: "Slide menulis singkatan MMPI sebagai \"Multiphasic *Mini* Personality Inventory\" — nama yang baku adalah **Minnesota Multiphasic Personality Inventory** (lihat M3 & M15)." },
    { t: "anim", jenis: "tinta", judul: { id: "Coba rasakan stimulus ambigu" }, tanya: { id: "Bercak ini mengingatkan Anda pada apa?" } },
    { t: "judul", id: "6. Klinis · 7. DSM-5" },
    { t: "tabel", kolom: ["Tes klinis", "Menguji"], baris: [["**Beck Depression Inventory (BDI)**", "Gejala depresi — kehilangan nafsu makan, ide bunuh diri"], ["**Beck Anxiety Inventory (BAI)**", "Gejala kecemasan — mati rasa, takut mati"], ["**Eating Disorders Scale**", "Makan berlebihan (*binge eating*)"]] },
    { t: "catatan", gaya: "info", judul: { id: "DSM-5" }, id: "*Diagnostic and Statistical Manual of Mental Disorders* — di AS menjadi rujukan **berwenang untuk diagnosis**; direvisi **2013** dengan kategori baru; mengklasifikasikan gangguan berdasarkan **gejala** (suasana hati, kepribadian, seksual, terkait gender, dll.). Ingat: DSM adalah **sistem klasifikasi**, bukan tes dalam arti alat ukur berbutir." },
    { t: "judul", id: "Waspadalah, pembeli!" },
    { t: "catatan", gaya: "tanbih", id: "Banyak \"tes\" daring adalah **tes pseudo-psikologis**: \"Apa kata warna favoritmu tentang kepribadianmu?\" Interpretasinya **tidak berbasis riset**. **Semua** tes psikologi yang sah harus melewati proses ketat: **etika, standardisasi, pemilihan item, uji validitas & reliabilitas**." },
    { t: "ringkasan", item: [{ id: "Tes = meminta perilaku yang teramati untuk menaksir atribut & memprediksi." }, { id: "Prestasi = yang sudah dikuasai; bakat = kapasitas belajar." }, { id: "WAIS-IV: 4 indeks; dipakai melihat perubahan kognitif." }, { id: "Neuropsikologis: integritas fungsional & lokalisasi." }, { id: "Kepribadian: objektif (MMPI) vs proyektif (Rorschach); klinis: BDI, BAI." }, { id: "Tes daring populer ≠ tes psikologis yang terstandar." }] },
    { t: "cek", q: { id: "Seorang dokter ingin membedakan apakah lansia yang pelupa mengalami demensia atau depresi. Jenis tes yang PALING tepat adalah…" }, o: [{ id: "Tes bakat" }, { id: "Tes pekerjaan" }, { id: "Tes neuropsikologis" }, { id: "Rorschach" }], j: 2, b: { id: "Tes neuropsikologis dipakai membedakan depresi vs demensia pada populasi lansia." } }
  ],
  istilah: [
    { t: "Achievement test", id: "Mengukur pengetahuan yang sudah dicapai." },
    { t: "Aptitude test", id: "Mengukur kapasitas untuk belajar." },
    { t: "WAIS-IV", id: "Skala kecerdasan dewasa Wechsler; 4 indeks." },
    { t: "Integritas fungsional", id: "Apakah fungsi tertentu masih utuh." },
    { t: "Lokalisasi", id: "Apakah area otak tertentu berfungsi baik." },
    { t: "MMPI", id: "Minnesota Multiphasic Personality Inventory; Benar/Salah." },
    { t: "Rorschach", id: "Tes proyektif bercak tinta." },
    { t: "BDI / BAI", id: "Inventori depresi / kecemasan Beck." },
    { t: "Pseudo-psychological test", id: "Tes populer tanpa dasar riset & standardisasi." }
  ],
  latihan: {
    pg: [
      { q: { id: "Seorang siswa memperoleh skor tinggi pada tes yang memprediksi kemampuannya menguasai pemrograman, padahal ia belum pernah belajar koding. Tes ini adalah tes…" }, o: [{ id: "Prestasi" }, { id: "Bakat" }, { id: "Kepribadian" }, { id: "Klinis" }], j: 1 },
      { q: { id: "Pernyataan yang BENAR tentang tes prestasi di setting klinis adalah…" }, o: [{ id: "Selalu menjadi tes utama psikolog klinis" }, { id: "Psikolog klinis umumnya tidak menguji hal ini" }, { id: "Wajib untuk diagnosis DSM" }, { id: "Sama dengan tes kecerdasan" }], j: 1 },
      { q: { id: "Indeks WAIS-IV yang paling relevan untuk tugas “ulangi deret angka secara terbalik” adalah…" }, o: [{ id: "Pemahaman Verbal" }, { id: "Penalaran Perseptual" }, { id: "Memori Kerja" }, { id: "Kecepatan Pemrosesan" }], j: 2 },
      { q: { id: "Pertanyaan “Apakah area lobus frontal pasien ini berfungsi normal?” merupakan pertanyaan…" }, o: [{ id: "Integritas fungsional" }, { id: "Lokalisasi" }, { id: "Bakat" }, { id: "Proyektif" }], j: 1 },
      { q: { id: "Kritik terhadap tes IQ menurut slide, KECUALI…" }, o: [{ id: "Masalah pelabelan" }, { id: "Lebih memprediksi perilaku masa depan daripada mengukur kecerdasan itu sendiri" }, { id: "Bias ketika dipakai secara individu" }, { id: "Tidak memiliki norma sama sekali" }], j: 3 },
      { q: { id: "Format jawaban MMPI adalah…" }, o: [{ id: "Benar/Salah" }, { id: "Skala Likert 1–10" }, { id: "Bercerita tentang gambar" }, { id: "Menyusun balok" }], j: 0 },
      { q: { id: "Seorang klien diminta menceritakan apa yang ia lihat pada kartu bercak tinta. Asumsi yang mendasari tes ini adalah…" }, o: [{ id: "Jawaban benar/salah dapat diskor objektif tanpa penafsir" }, { id: "Stimulus ambigu memancing cara individu memaknai pengalamannya" }, { id: "Mengukur pengetahuan yang dicapai" }, { id: "Mengukur kecepatan motorik" }], j: 1 },
      { q: { id: "Item “kehilangan nafsu makan” dan “ide bunuh diri” paling mungkin berasal dari…" }, o: [{ id: "BAI" }, { id: "BDI" }, { id: "Eating Disorders Scale" }, { id: "WAIS-IV" }], j: 1 },
      { q: { id: "Kuis daring “Warna favoritmu mengungkap kepribadianmu” tidak layak disebut tes psikologis terutama karena…" }, o: [{ id: "Tidak berbayar" }, { id: "Tidak melalui standardisasi, pemilihan item, serta uji validitas & reliabilitas" }, { id: "Terlalu pendek" }, { id: "Tidak memakai kertas" }], j: 1 },
      { q: { id: "Manakah pasangan yang SALAH?" }, o: [{ id: "Tes pekerjaan — mencocokkan minat dengan karier" }, { id: "DSM-5 — sistem klasifikasi gangguan berdasarkan gejala" }, { id: "Digit Span — tes neuropsikologis terstandar" }, { id: "Rorschach — tes kepribadian objektif Benar/Salah" }], j: 3 }
    ],
    bs: [
      { t: { id: "Tes bakat mengukur apa yang sudah dipelajari seseorang." }, j: false },
      { t: { id: "WAIS dapat dipakai melihat perubahan kognitif setelah bedah saraf." }, j: true },
      { t: { id: "DSM-5 direvisi pada tahun 2013." }, j: true },
      { t: { id: "Tes kepribadian mengukur aspek karakter yang berubah-ubah tiap situasi." }, j: false },
      { t: { id: "Tes neuropsikologis dapat membantu membedakan depresi dan demensia pada lansia." }, j: true },
      { t: { id: "Semua tes kepribadian di internet telah melalui uji validitas." }, j: false }
    ],
    isian: [
      { t: { id: "Apakah suatu fungsi masih utuh disebut integritas ______." }, j: { id: "fungsional" }, x: [{ id: "struktural" }, { id: "proyektif" }, { id: "emosional" }] },
      { t: { id: "Tes proyektif bercak tinta diciptakan oleh ______." }, j: { id: "Rorschach" }, x: [{ id: "Wechsler" }, { id: "Beck" }, { id: "Binet" }] },
      { t: { id: "Tes yang mengukur kapasitas untuk belajar disebut tes ______." }, j: { id: "bakat" }, x: [{ id: "prestasi" }, { id: "klinis" }, { id: "proyektif" }] }
    ],
    jodoh: [
      { a: { id: "SAT / GRE" }, b: { id: "Prestasi & bakat" } }, { a: { id: "WAIS-IV" }, b: { id: "Kecerdasan" } }, { a: { id: "Digit Span" }, b: { id: "Neuropsikologis" } },
      { a: { id: "MMPI" }, b: { id: "Kepribadian objektif" } }, { a: { id: "Rorschach" }, b: { id: "Kepribadian proyektif" } }, { a: { id: "BAI" }, b: { id: "Klinis — kecemasan" } }
    ],
    pilah: { t: { id: "Pilah: OBJEKTIF atau PROYEKTIF?" }, kategori: [{ id: "Objektif" }, { id: "Proyektif" }], item: [
      { t: { id: "MMPI" }, k: 0 }, { t: { id: "Rorschach" }, k: 1 }, { t: { id: "Jawaban Benar/Salah" }, k: 0 }, { t: { id: "Stimulus ambigu" }, k: 1 }, { t: { id: "Skor dari kunci baku" }, k: 0 }, { t: { id: "Bercerita tentang gambar" }, k: 1 }
    ] }
  },
  tugas: [
    { t: { id: "Bedakan tes prestasi dan tes bakat, beri contoh, dan jelaskan mengapa jarang dipakai di setting klinis." }, j: { id: "Tes prestasi mengukur pengetahuan yang sudah dicapai seseorang tentang topik tertentu; tes bakat mengukur kapasitasnya untuk belajar atau menguasai topik. Contoh: SAT, GRE, MCAT dipakai di pendidikan/pekerjaan. Di setting klinis, pertanyaan rujukan biasanya tentang kecerdasan, fungsi neuropsikologis, kepribadian, atau psikopatologi—bukan prestasi akademik—sehingga psikolog klinis umumnya tidak menguji hal ini." } },
    { t: { id: "Jelaskan dua tujuan tes neuropsikologis dan dua kegunaan klinisnya." }, j: { id: "Tujuan: (1) integritas fungsional—menilai apakah fungsi tertentu (memori jangka pendek/panjang, numerik, perhatian, motorik) masih utuh; (2) lokalisasi—menilai apakah area neuroanatomi tertentu berfungsi baik. Kegunaan: menyingkirkan sindrom otak organik dan membedakan depresi dari demensia pada lansia. Metodenya meliputi wawancara/observasi, tes psikometrik, tes terstandar seperti Digit Span, dan tes klinis tidak terstandar." } },
    { t: { id: "Mengapa banyak “tes kepribadian” di internet tidak dapat dianggap tes psikologis? Apa syarat tes yang sah?" }, j: { id: "Karena interpretasinya tidak berbasis riset: tidak ada standardisasi pada sampel representatif, item tidak dipilih secara ilmiah, dan tidak diuji validitas maupun reliabilitasnya. Tes yang sah harus melewati proses ketat yang mencakup etika, standardisasi, pemilihan pertanyaan, serta uji validitas dan reliabilitas." } }
  ]
});

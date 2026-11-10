/* PPTA 301 — Modul 17: Topik Khusus dalam Pengujian Kecerdasan */
Kuliah.pertemuan("tes-psikologi", {
  no: 17, tema: 4, motif: "blok-desain", motifOpt: { lbl: "Topik Khusus Kecerdasan" }, durasi: 65,
  judul: { id: "Topik Khusus dalam Pengujian Kecerdasan", en: "Special Topics in Intelligence Testing" },
  ringkas: { id: "**Verbal**: simbol abstrak, manfaat pendidikan, memori verbal, kelancaran bicara; **Performa**: kontak nonverbal, integrasi persepsi–motorik, visuo-spasial, kecepatan — kurang dipengaruhi pendidikan. **Kerusakan otak**: tak ada profil tunggal; indikator utama = skor **lebih rendah dari harapan** (SES, usia, pendidikan, pekerjaan). **Alzheimer**: tes performa (*fluid*) lebih terdampak daripada verbal (*crystallized*); tambah WMS. **Disabilitas belajar**: profil **ACID** (≥ 3 dari 4 terendah = profil parsial). **Disabilitas intelektual**: ringan 50–70, sedang 35–50, berat 20–35, sangat berat < 20; organik vs non-organik. **Berbakat**: IQ > 130, kecepatan menjadi kendala. Minoritas: UNIT; **bentuk singkat**: r ≥ 0,90, untuk skrining, tulis *Est IQ*." },
  tujuan: [
    { id: "Menafsirkan perbedaan skala Verbal dan Performa serta indikasi kerusakan otak dan Alzheimer." },
    { id: "Mengenali profil disabilitas belajar (ACID), tingkat & jenis disabilitas intelektual, serta isu anak berbakat." },
    { id: "Menerapkan pertimbangan etnis minoritas dan bentuk singkat WAIS." }
  ],
  isi: [
    { t: "pembuka", id: "Dua orang sama-sama ber-IQ 95. Yang satu insinyur 60 tahun yang dulu ber-IQ 125; yang lain buruh dengan pendidikan SD. Angka sama — **makna berbeda**. Pada kerusakan otak, pertanyaan kuncinya: *apakah skor ini lebih rendah dari yang seharusnya?*" },
    { t: "banding", judul: { id: "Skala Verbal vs Performa" }, kiri: { judul: { id: "Verbal" }, warna: "blue", poin: [{ id: "Bekerja dengan **simbol abstrak**" }, { id: "Seberapa besar **manfaat pendidikan**" }, { id: "Memori verbal & **kelancaran bicara**" }, { id: "V > P: pendidikan tinggi, orientasi berprestasi, atau **perlambatan psikomotorik akibat depresi**" }] }, kanan: { judul: { id: "Performa" }, warna: "green", poin: [{ id: "Kontak **nonverbal** dengan lingkungan" }, { id: "Integrasi **persepsi–motorik**" }, { id: "Evaluasi **visuo-spasial**; bekerja cepat di situasi konkret" }, { id: "Picture Completion, Digit Symbol, Block Design, Matrix Reasoning — **kurang dipengaruhi pendidikan**" }] } },
    { t: "judul", id: "Kerusakan otak & Alzheimer" },
    { t: "catatan", gaya: "info", judul: { id: "Tidak ada \"profil kerusakan otak\" tunggal" }, id: "Riset menunjukkan IQ dan selisih V–P **bervariasi**. Indikator utama: skor **lebih rendah dari yang diharapkan** berdasarkan **SES, usia, pendidikan, dan pekerjaan**." },
    { t: "banding", judul: { id: "Mengapa Alzheimer lebih memukul tes performa?" }, kiri: { judul: { id: "Crystallized (bertahan)" }, warna: "blue", poin: [{ id: "Pengetahuan umum, kosakata" }, { id: "Diperoleh dari **pengalaman** — tersimpan lama" }] }, kanan: { judul: { id: "Fluid (menurun)" }, warna: "red", poin: [{ id: "**Digit Symbol, Block Design**" }, { id: "Berpikir fleksibel & memecahkan masalah **baru**" }] } },
    { t: "anim", jenis: "profil", judul: { id: "Contoh profil awal Alzheimer (skor skala, rata-rata 10)" }, mode: "batang", min: 0, max: 19, rata: 10, sd: 3, skala: [{ k: "Inf", v: 11, n: "Informasi" }, { k: "Voc", v: 12, n: "Kosakata" }, { k: "Sim", v: 9, n: "Persamaan" }, { k: "PC", v: 7, n: "Gambar" }, { k: "BD", v: 5, n: "Blok" }, { k: "DSy", v: 4, n: "Simbol" }], ket: { id: "Subtes verbal (*crystallized*) relatif bertahan; Block Design & Digit Symbol (*fluid*) turun tajam. Ciri klinis: **apatis**, memori jangka pendek menurun, sulit memecahkan masalah. Diagnosis lebih akurat dengan **Wechsler Memory Scale (WMS)**." } },
    { t: "judul", id: "Disabilitas belajar" },
    { t: "p", id: "Gangguan **kompleks dan heterogen**: kesulitan membaca, menulis, mendengar, berbicara, bernalar, mengeja, atau matematika — ringkasnya **\"pemrosesan informasi yang buruk\"**. Ciri: kecerdasan **rata-rata**, **kesenjangan signifikan antara prestasi dan kemampuan**, kemungkinan disfungsi sistem saraf pusat — **bukan** akibat kerusakan otak, masalah perilaku, atau lingkungan buruk." },
    { t: "anim", jenis: "profil", judul: { id: "Profil ACID pada disabilitas belajar" }, mode: "batang", min: 0, max: 19, rata: 10, sd: 3, skala: [{ k: "A", v: 6, n: "Aritmetika" }, { k: "C", v: 5, n: "Coding" }, { k: "I", v: 7, n: "Informasi" }, { k: "D", v: 9, n: "Digit Span" }, { k: "PC", v: 12, n: "Gambar" }, { k: "BD", v: 13, n: "Blok" }], ket: { id: "**A**rithmetic, **C**oding/Digit Symbol, **I**nformation, **D**igit Span. Skor terendah di **3 dari 4** subtes ACID = **profil parsial**. Tugas holistik-simultan (Picture Completion, Block Design) sering lebih baik; pemrosesan **berurutan** (Digit Span) lemah → sulit merencana, membaca, berhitung; fungsi eksekutif buruk." } },
    { t: "catatan", gaya: "faidah", judul: { id: "Apa saja yang dinilai?" }, id: "Proses perkembangan-kognitif, prestasi akademik, tuntutan lingkungan, reaksi keluarga/teman, **ketakutan akan kegagalan**, riwayat keluarga — untuk merancang **program pendidikan** yang tepat." },
    { t: "judul", id: "Disabilitas intelektual" },
    { t: "anim", jenis: "spektrum", judul: { id: "Tingkat disabilitas intelektual (DSM-IV) pada rentang IQ" }, min: 0, max: 150, satuan: "IQ", awal: 60, rentang: [
      { label: { id: "Sangat berat" }, dari: 0, sampai: 20, ket: { id: "IQ < 20" } },
      { label: { id: "Berat" }, dari: 20, sampai: 35, ket: { id: "IQ 20–35" } },
      { label: { id: "Sedang" }, dari: 35, sampai: 50, ket: { id: "IQ 35–50; banyak kasus organik (< 50)" } },
      { label: { id: "Ringan" }, dari: 50, sampai: 70, ket: { id: "IQ 50–70; banyak kasus non-organik/keluarga (50–69)" } },
      { label: { id: "Rata-rata luas" }, dari: 70, sampai: 130, ket: { id: "Di luar kategori disabilitas" } },
      { label: { id: "Berbakat" }, dari: 130, sampai: 150, ket: { id: "VIQ atau PIQ > 130" } }
    ], ket: { id: "Namun psikolog dianjurkan mengikuti **AAMR**: tekankan **dukungan berbasis komunitas** — bukan sekadar skor IQ. Onset lahir–**18 tahun**; IQ di bawah rata-rata **dan** kesulitan perilaku adaptif." } },
    { t: "tabel", kolom: ["Aspek", "Non-organik (keluarga)", "Organik"], baris: [
      ["Penyebab", "Warisan genetik rendah + lingkungan kurang mendukung", "Disfungsi neurologis & kelainan genetik"],
      ["IQ", "50–69", "< 50"],
      ["Fungsi", "Lebih tinggi; **dapat mengikuti pendidikan formal**", "Lebih parah; butuh pengawasan & perawatan, tetapi masih bisa aktivitas harian"]
    ] },
    { t: "catatan", gaya: "info", judul: { id: "WISC pada anak dengan disabilitas intelektual" }, id: "Paling sulit: **Informasi, Aritmetika, Kosakata**. Paling mudah: **Penyelesaian Gambar, Perakitan Objek**. Selalu sertakan **rentang kesalahan** IQ." },
    { t: "judul", id: "Anak berbakat" },
    { t: "daftar", item: [{ id: "Definisi: **VIQ atau PIQ > 130**." }, { id: "WISC-III menekankan **kecepatan** — anak berbakat yang reflektif/lambat bisa tidak mendapat skor tinggi." }, { id: "Lengkapi dengan **tes prestasi** dan **contoh karya sekolah**." }, { id: "IQ tinggi hanya satu faktor; kuncinya interaksi **motivasi intrinsik, disiplin, lingkungan**, dan kesempatan." }, { id: "Korelasi **kreativitas–kecerdasan rendah** → bakat artistik perlu tes lain." }] },
    { t: "judul", id: "Etnis minoritas & bentuk singkat" },
    { t: "poin", item: [
      { ikon: "map", judul: { id: "Minoritas" }, id: "Pahami nilai budaya; perhatikan bahasa; nilai **tingkat asimilasi**; pakai tes nonverbal (**UNIT**); tambah wawancara, observasi, laporan sekolah. Seimbang: jangan **buta budaya**, jangan pula **terlalu sensitif**." },
      { ikon: "clock", judul: { id: "Bentuk singkat" }, id: "Sebagian subtes/butir saja. Kekurangan: info lebih sedikit, **kesalahan lebih tinggi**. Kelebihan: **skrining**. Syarat: **r ≥ 0,90** dengan bentuk lengkap; tulis jelas **Est IQ**." }
    ] },
    { t: "ringkasan", item: [{ id: "V: simbol, pendidikan; P: nonverbal, visuo-spasial, kurang dipengaruhi pendidikan." }, { id: "Kerusakan otak: skor lebih rendah dari harapan; Alzheimer: fluid turun, crystallized bertahan." }, { id: "LD: ACID, 3 dari 4 = profil parsial." }, { id: "ID: 50–70/35–50/20–35/< 20; organik vs non-organik; AAMR menekankan dukungan." }, { id: "Berbakat > 130; kecepatan & kreativitas; UNIT; bentuk singkat r ≥ 0,90, Est IQ." }] },
    { t: "cek", q: { id: "Pensiunan profesor (pendidikan S3) mendapat FSIQ 100. Tafsiran paling tepat?" }, o: [{ id: "Normal, tidak perlu tindak lanjut" }, { id: "Lebih rendah dari harapan berdasarkan pendidikan & pekerjaan — curigai penurunan kognitif" }, { id: "Disabilitas intelektual ringan" }, { id: "Berbakat" }], j: 1, b: { id: "Indikator utama kerusakan otak: skor **di bawah yang diharapkan** dari SES, pendidikan, pekerjaan." } }
  ],
  istilah: [
    { t: "Crystallized intelligence", id: "Kecerdasan dari pengalaman/pengetahuan." },
    { t: "Fluid intelligence", id: "Penalaran fleksibel pada masalah baru." },
    { t: "Profil ACID", id: "Arithmetic, Coding, Information, Digit Span." },
    { t: "Disabilitas belajar", id: "Kesenjangan prestasi–kemampuan dengan IQ rata-rata." },
    { t: "Non-organik", id: "Disabilitas intelektual keluarga/lingkungan, IQ 50–69." },
    { t: "Organik", id: "Akibat kelainan neurologis/genetik, IQ < 50." },
    { t: "UNIT", id: "Universal Nonverbal Intelligence Test." },
    { t: "Est IQ", id: "IQ hasil estimasi bentuk singkat." },
    { t: "WMS", id: "Wechsler Memory Scale." }
  ],
  latihan: {
    pg: [
      { q: { id: "Klien depresi berat memperoleh VIQ jauh lebih tinggi daripada PIQ. Penjelasan yang paling sesuai slide adalah…" }, o: [{ id: "Kerusakan otak kiri" }, { id: "Perlambatan psikomotorik akibat depresi menurunkan tugas performa yang menuntut kecepatan" }, { id: "Disabilitas intelektual" }, { id: "Berbakat verbal" }], j: 1 },
      { q: { id: "Indikator UTAMA kerusakan otak pada tes Wechsler adalah…" }, o: [{ id: "VIQ selalu lebih rendah dari PIQ" }, { id: "Skor lebih rendah dari yang diharapkan berdasarkan SES, usia, pendidikan, pekerjaan" }, { id: "FSIQ di bawah 70" }, { id: "Profil ACID lengkap" }], j: 1 },
      { q: { id: "Pada Alzheimer, Block Design dan Digit Symbol lebih terdampak dibanding Informasi karena…" }, o: [{ id: "Keduanya mengukur crystallized" }, { id: "Keduanya mengukur fluid intelligence, sedangkan pengetahuan verbal tersimpan sebagai crystallized" }, { id: "Instruksinya lebih panjang" }, { id: "Pasien bosan" }], j: 1 },
      { q: { id: "Siswa ber-IQ 104 dengan skor terendah pada Aritmetika, Coding, dan Digit Span, tetapi Informasi normal. Profil ini disebut…" }, o: [{ id: "Profil ACID lengkap" }, { id: "Profil parsial (3 dari 4 ACID)" }, { id: "Profil Alzheimer" }, { id: "Profil berbakat" }], j: 1 },
      { q: { id: "Seorang anak mengalami kesulitan membaca berat akibat cedera kepala kecelakaan. Mengapa TIDAK tepat disebut disabilitas belajar?" }, o: [{ id: "IQ-nya pasti rendah" }, { id: "Disabilitas belajar tidak boleh disebabkan kerusakan otak, masalah perilaku, atau lingkungan buruk" }, { id: "Ia terlalu tua" }, { id: "Membaca tidak termasuk" }], j: 1 },
      { q: { id: "Anak ber-IQ 62, orang tuanya juga mengalami kesulitan belajar, tanpa kelainan neurologis, mampu sekolah formal. Klasifikasi yang tepat…" }, o: [{ id: "Organik, sedang" }, { id: "Non-organik (keluarga), ringan" }, { id: "Organik, berat" }, { id: "Disabilitas belajar" }], j: 1 },
      { q: { id: "Anak sangat cerdas tetapi perfeksionis dan lambat menjawab memperoleh IQ 118 pada WISC-III. Masalah utamanya…" }, o: [{ id: "WISC-III menekankan kecepatan sehingga meremehkan anak reflektif" }, { id: "Anak berbohong" }, { id: "Norma WISC terlalu tinggi" }, { id: "Tidak ada masalah" }], j: 0 },
      { q: { id: "Syarat sebuah bentuk singkat WAIS boleh dipakai adalah…" }, o: [{ id: "Korelasi ≥ 0,50 dengan bentuk lengkap" }, { id: "Korelasi ≥ 0,90 dengan bentuk lengkap dan skor ditulis Est IQ" }, { id: "Hanya untuk diagnosis final" }, { id: "Tidak perlu norma" }], j: 1 },
      { q: { id: "Subtes WISC yang paling MUDAH bagi anak dengan disabilitas intelektual adalah…" }, o: [{ id: "Informasi dan Kosakata" }, { id: "Aritmetika" }, { id: "Penyelesaian Gambar dan Perakitan Objek" }, { id: "Digit Span" }], j: 2 },
      { q: { id: "Klien imigran baru dengan bahasa Indonesia terbatas perlu dites kecerdasannya. Pilihan terbaik…" }, o: [{ id: "WAIS verbal lengkap dalam bahasa Indonesia" }, { id: "Tes nonverbal seperti UNIT, ditambah wawancara, observasi, dan laporan sekolah" }, { id: "Bentuk singkat verbal" }, { id: "Tidak perlu dites" }], j: 1 },
      { q: { id: "Pedoman AAMR berbeda dari klasifikasi DSM-IV karena menekankan…" }, o: [{ id: "Skor IQ yang lebih rinci" }, { id: "Dukungan berbasis komunitas dan perawatan, bukan sekadar skor IQ" }, { id: "Penghapusan tes" }, { id: "Diagnosis genetik" }], j: 1 }
    ],
    bs: [
      { t: { id: "Skala Performa lebih dipengaruhi pendidikan daripada skala Verbal." }, j: false },
      { t: { id: "Ada satu profil Wechsler yang khas untuk semua kerusakan otak." }, j: false },
      { t: { id: "Korelasi kreativitas dan kecerdasan rendah." }, j: true },
      { t: { id: "Disabilitas intelektual muncul pada masa perkembangan, lahir hingga 18 tahun." }, j: true },
      { t: { id: "Klien minoritas selalu lebih nyaman dengan penilai dari budaya yang sama." }, j: false }
    ],
    isian: [
      { t: { id: "Menurut DSM-IV, disabilitas intelektual sedang berada pada IQ 35 sampai ______." }, j: { id: "50" }, x: [{ id: "70" }, { id: "20" }, { id: "85" }] },
      { t: { id: "Anak berbakat didefinisikan VIQ atau PIQ lebih dari ______." }, j: { id: "130" }, x: [{ id: "115" }, { id: "120" }, { id: "145" }] },
      { t: { id: "Untuk diagnosis Alzheimer yang lebih akurat, tambahkan Wechsler ______ Scale." }, j: { id: "Memory" }, x: [{ id: "Adult" }, { id: "Verbal" }, { id: "Child" }] }
    ],
    jodoh: [
      { a: { id: "Block Design" }, b: { id: "Fluid, visuo-spasial" } },
      { a: { id: "Informasi" }, b: { id: "Crystallized, pengetahuan umum" } },
      { a: { id: "Digit Span" }, b: { id: "Pemrosesan berurutan" } },
      { a: { id: "UNIT" }, b: { id: "Tes kecerdasan nonverbal" } },
      { a: { id: "Est IQ" }, b: { id: "Label skor bentuk singkat" } }
    ]
  },
  tugas: [
    { t: { id: "Jelaskan bagaimana tes Wechsler membantu menilai kerusakan otak dan Alzheimer, termasuk peran crystallized dan fluid intelligence." }, j: { id: "Tidak ada profil tunggal kerusakan otak; IQ dan selisih Verbal–Performa bervariasi. Indikator utamanya adalah skor yang lebih rendah dari harapan berdasarkan SES, usia, pendidikan, dan pekerjaan. Pada Alzheimer (apatis, memori jangka pendek turun, sulit memecahkan masalah), tes performa lebih terdampak: Digit Symbol dan Block Design mencerminkan fluid intelligence yang menurun, sedangkan pengetahuan umum dan kosakata mencerminkan crystallized intelligence dari pengalaman yang relatif bertahan. Diagnosis lebih akurat dengan menambahkan Wechsler Memory Scale." } },
    { t: { id: "Bandingkan disabilitas belajar dan disabilitas intelektual dari segi definisi, profil tes, dan fokus asesmen." }, j: { id: "Disabilitas belajar: kecerdasan rata-rata, kesenjangan signifikan antara prestasi dan kemampuan, pemrosesan informasi buruk, kemungkinan disfungsi saraf pusat, bukan akibat kerusakan otak atau lingkungan; profil ACID (3 dari 4 terendah = parsial), lebih baik pada tugas holistik dan lemah pada pemrosesan berurutan. Disabilitas intelektual: muncul lahir–18 tahun, IQ di bawah rata-rata dan kesulitan adaptif; DSM-IV: ringan 50–70, sedang 35–50, berat 20–35, sangat berat < 20; jenis non-organik (50–69) dan organik (< 50); pada WISC paling sulit Informasi, Aritmetika, Kosakata. Fokus asesmen LD adalah merancang program pendidikan; fokus ID adalah profil kekuatan–kelemahan dan dukungan yang dibutuhkan (AAMR), bukan sekadar skor." } }
  ]
});

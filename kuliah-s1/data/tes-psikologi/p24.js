/* PPTA 301 — Modul 24: Mendiagnosis Gangguan Spektrum Autisme pada Anak & Remaja */
Kuliah.pertemuan("tes-psikologi", {
  no: 24, tema: 3, motif: "puzzle", motifOpt: { lbl: "Spektrum Autisme" }, durasi: 65,
  judul: { id: "Mendiagnosis Gangguan Spektrum Autisme pada Anak & Remaja", en: "Diagnosing Autism Spectrum Disorder in Children & Adolescents" },
  ringkas: { id: "Autisme: defisit sosial-komunikasi + kekakuan perilaku (dulu kelompok **PDD**). **Pendekatan perkembangan**: diagnosis sering ditandai **ketiadaan perilaku normatif**. Setting memengaruhi hasil (terstruktur untuk IQ, spontan untuk sosial); **keterlibatan orang tua**; asesmen bicara-bahasa kuantitatif & kualitatif. Diagnosis: **laporan orang tua (ADI-R)** + **observasi langsung (ADOS)**; formulasi berbasis **profil kekuatan–defisit**. Pilih tes yang **minim bahasa**, konkret, sedikit peralihan; WISC-IV vs **K-ABC** (3–18 th, boleh mengajarkan item awal); hindari konsep IQ < 4 th → **Bayley** (1–42 bln); **NEPSY** (3–12 th); tes gambar & bermain spontan. Remaja: diferensiasi, harga diri, makna hidup; depresi (41,9%) & cemas (30%) pada perempuan; **kesejahteraan Ryff** & aqidah Islam." },
  tujuan: [
    { id: "Menjelaskan pendekatan perkembangan, pengaruh setting, dan peran orang tua dalam asesmen autisme." },
    { id: "Membandingkan ADI-R dan ADOS serta memilih tes kecerdasan, perkembangan, dan neuropsikologis yang sesuai." },
    { id: "Menguraikan isu kesehatan mental remaja dan pencegahan berbasis kesejahteraan psikologis dan Islam." }
  ],
  isi: [
    { t: "pembuka", id: "Bayangkan dua anak autis berusia 6 tahun: yang satu belum bicara, yang lain hafal nama semua planet dan bulannya. Satu label — **\"autisme\"** — tidak cukup untuk merancang bantuan. Yang dibutuhkan adalah **profil** masing-masing anak." },
    { t: "definisi", judul: { id: "Autisme" }, lughah: { id: "Gangguan dengan **defisit sosial & komunikasi** serta **kekakuan perilaku**." }, istilah: { id: "Dulu termasuk **pervasive developmental disorders (PDD)** — \"pervasif\" karena mengenai **banyak area** perkembangan, termasuk perilaku bermain. Kini disatukan sebagai **spektrum** dalam DSM-5 (lihat modul 12)." } },
    { t: "catatan", gaya: "info", judul: { id: "Pendekatan perkembangan" }, id: "Bingkai asesmen dalam **jalur perkembangan normatif** untuk melihat keterlambatan. Di klinik, yang paling menandai autisme sering adalah **tidak hadirnya perilaku normatif** (mis. jarang menunjuk, jarang berbagi perhatian), **bukan** perilaku aneh." },
    { t: "anim", jenis: "spektrum", judul: { id: "Tingkat dukungan ASD (DSM-5)" }, min: 0, max: 30, satuan: "Kebutuhan dukungan", awal: 15, rentang: [
      { label: { id: "Tingkat 1" }, dari: 0, sampai: 10, ket: { id: "Membutuhkan dukungan — sulit memulai interaksi; tak fleksibel beralih aktivitas" } },
      { label: { id: "Tingkat 2" }, dari: 10, sampai: 20, ket: { id: "Membutuhkan dukungan substansial — defisit komunikasi jelas meski dibantu" } },
      { label: { id: "Tingkat 3" }, dari: 20, sampai: 30, ket: { id: "Membutuhkan dukungan sangat substansial — komunikasi sangat terbatas, perilaku repetitif sangat mengganggu" } }
    ], ket: { id: "Tambahan dari DSM-5 (bukan dari slide): keparahan dinilai terpisah untuk komunikasi sosial dan perilaku repetitif. Individu ASD mencakup **seluruh spektrum** kecerdasan dan bahasa." } },
    { t: "judul", id: "Setting, orang tua, bahasa" },
    { t: "banding", judul: { id: "Setting yang optimal berbeda" }, kiri: { judul: { id: "Tes kecerdasan" }, warna: "blue", poin: [{ id: "Lingkungan **terstruktur** & minim gangguan → kinerja \"terbaik\"" }] }, kanan: { judul: { id: "Asesmen sosial" }, warna: "green", poin: [{ id: "Lingkungan lebih **spontan** → perilaku sosial alami tampak" }] } },
    { t: "poin", item: [
      { ikon: "users", judul: { id: "Orang tua" }, id: "Menerjemahkan temuan ke **kehidupan nyata**; mengamati langsung lalu berdiskusi; menjadi **pendukung & koordinator** intervensi." },
      { ikon: "chat", judul: { id: "Bicara & bahasa" }, id: "Aspek **inti**: kosakata, sintaksis, nada, volume, kecepatan — dalam konteks relasi sosial (mis. cemas karena **dibuli**)." }
    ] },
    { t: "judul", id: "Prosedur diagnostik" },
    { t: "banding", kiri: { judul: { id: "ADI-R" }, warna: "amber", poin: [{ id: "Autism Diagnostic Interview-Revised — **wawancara semi-terstruktur** dengan **orang tua**" }, { id: "Pola onset, komunikasi, perkembangan sosial, bermain" }, { id: "Keterbatasan: cenderung **over-diagnosis** anak dengan keterlambatan kognitif berat di usia **2 tahun**" }] }, kanan: { judul: { id: "ADOS" }, warna: "green", poin: [{ id: "Autism Diagnostic Observation Schedule — **observasi langsung** anak" }, { id: "Mulai **bermain bebas**: perhatian ke orang atau objek? sebab-akibat vs representasional? soliter vs sosial? peka isyarat sosial?" }, { id: "Dikodekan ke klaster yang mendefinisikan autisme" }] } },
    { t: "anim", jenis: "alur", judul: { id: "Dari data ke formulasi" }, item: [{ judul: { id: "Laporan orang tua" }, ket: { id: "Sejarah & perilaku kini (ADI-R)" } }, { judul: { id: "Observasi langsung" }, ket: { id: "Sampel independen sosial, komunikasi, bermain (ADOS)" } }, { judul: { id: "Tes kognitif & adaptif" } }, { judul: { id: "Formulasi" }, ket: { id: "Profil kekuatan–defisit; kebutuhan layanan pendidikan khusus; pertimbangkan **tuli kongenital**" } }] },
    { t: "akordion", judul: { id: "Empat fungsi asesmen psikologis" }, item: [
      { judul: { id: "1. Kerangka tafsir" }, id: "Untuk semua informasi kuantitatif & kualitatif." },
      { judul: { id: "2. Strategi pengajaran" }, id: "Intervensi sesuai **tingkat kognitif**." },
      { judul: { id: "3. Tingkat fungsi kognitif" }, id: "Memengaruhi keparahan gejala lain." },
      { judul: { id: "4. Dokumentasi" }, id: "Bukti anak butuh **dukungan tambahan** di sekolah." }
    ] },
    { t: "catatan", gaya: "tanbih", judul: { id: "Kesenjangan kognitif–adaptif" }, id: "Anak ASD sering menunjukkan **kesenjangan besar** antara potensi kognitif dan keterampilan hidup nyata (kemandirian). Anak ber-IQ 110 bisa belum mampu memakai baju sendiri." },
    { t: "judul", id: "Memilih tes" },
    { t: "daftar", judul: { id: "Lima pertimbangan" }, item: [{ id: "Tingkat **bahasa** yang diperlukan." }, { id: "Kompleksitas **instruksi & tugas**." }, { id: "Tingkat **tuntutan sosial**." }, { id: "Tugas **berwaktu**." }, { id: "Jumlah **peralihan** antarsubtes." }] },
    { t: "catatan", gaya: "faidah", judul: { id: "Aturan praktis" }, id: "Pilih tes yang **lebih sedikit bahasa** dan imitasi, **lebih konkret**, dan **lebih sedikit peralihan perhatian**. Prosedur kaku mungkin perlu luwes: selingi tugas verbal dengan visual, pakai **camilan/mainan** sebagai penguat. Hasil tes berbasis **komputer** bisa berbeda dari tes yang diberikan penguji." },
    { t: "tabel", kolom: ["Alat", "Usia", "Catatan"], baris: [
      ["**WISC-IV**", "Anak sekolah", "Paling sering dipakai (psikometri kuat), tetapi **bergantung bahasa**, pengetahuan, dan tugas pendengaran"],
      ["**K-ABC**", "3–18 th", "Kurangi penekanan verbal & pengetahuan; penguji **boleh mengajarkan item awal** tanpa merusak standardisasi"],
      ["**Differential Abilities Scales**", "Anak", "Baterai alternatif"],
      ["**Bayley**", "1–42 bulan", "Mental Development Index, Psychomotor Development Index, Behavior Rating Scale"],
      ["**NEPSY**", "3–12 th", "Perhatian, bahasa, visuospasial, eksekutif, memori & belajar; ASD: defisit perhatian, eksekutif, **memori wajah**"]
    ] },
    { t: "catatan", gaya: "info", judul: { id: "Mengapa IQ dihindari di bawah 4 tahun?" }, id: "Fungsi kognitif masih **sangat terkait** dengan domain perkembangan lain. Gunakan **skala perkembangan** (laporan orang tua dan/atau kontak langsung) dan pakai laporan orang tua untuk **mengontekstualisasikan** hasil klinis." },
    { t: "catatan", gaya: "info", judul: { id: "Asesmen sosial-emosional" }, id: "**Tes menggambar spontan**: tingkat kognitif, minat, pemahaman kehidupan sosial, ikatan. **Bermain spontan**: keterampilan sosial-kognitif esensial." },
    { t: "judul", id: "Catatan tentang remaja" },
    { t: "poin", item: [
      { ikon: "user", judul: { id: "Isu utama" }, id: "**Diferensiasi vs penyatuan** dengan orang tua; penerimaan sosial, harga diri, welas diri; nilai; **tujuan hidup**." },
      { ikon: "heart", judul: { id: "Remaja perempuan" }, id: "Depresi mayor **41,9%**, kecemasan **30%**; kurang dilaporkan; hormon memperburuk gejala (WHO: gender menentukan kendali atas determinan kesehatan mental)." },
      { ikon: "home", judul: { id: "Orang tua/saudara sakit" }, id: "\"**Bukan salahmu**\"; bicara dengan orang dewasa tepercaya; cari konselor; tetap **ihsan** kepada orang tua." }
    ] },
    { t: "anim", jenis: "siklus", judul: { id: "Enam unsur kesejahteraan psikologis (Ryff & Keyes, 1995)" }, pusat: { id: "Sejahtera" }, item: [
      { judul: { id: "Penerimaan diri" }, ket: { id: "Allah Maha Pengampun" } },
      { judul: { id: "Tujuan hidup" }, ket: { id: "Beribadah hanya kepada Allah" } },
      { judul: { id: "Otonomi" }, ket: { id: "Maksimalkan potensi, tetapkan tujuan" } },
      { judul: { id: "Relasi positif" }, ket: { id: "Akhlak yang baik" } },
      { judul: { id: "Penguasaan lingkungan" }, ket: { id: "Cari ilmu & keterampilan" } },
      { judul: { id: "Pertumbuhan pribadi" }, ket: { id: "Muhasabah & perbaikan" } }
    ] },
    { t: "catatan", gaya: "hikmah", id: "**3D** remaja dalam slide: **pacaran** (ketertarikan itu normal; tindakan sesudahnya yang dimintai pertanggungjawaban), **obat/zat memabukkan** (ada manfaat, tetapi mudaratnya lebih besar — QS Al-Baqarah [2]: 219), dan **hiburan** (bersantai yang halal). Psikologi positif mencegah gangguan dengan meningkatkan kepuasan hidup — dan **aqidah Islam** menopang kesehatan mental positif." },
    { t: "ringkasan", item: [{ id: "ASD: sosial-komunikasi + kekakuan; ketiadaan perilaku normatif." }, { id: "Setting terstruktur untuk IQ, spontan untuk sosial; orang tua sebagai mitra." }, { id: "ADI-R (orang tua) + ADOS (observasi) → profil kekuatan–defisit." }, { id: "Tes minim bahasa; K-ABC, Bayley (< 4 th hindari IQ), NEPSY." }, { id: "Remaja: diferensiasi, makna hidup; Ryff + nilai Islam." }] },
    { t: "cek", q: { id: "Anak 2 tahun dengan keterlambatan kognitif berat didiagnosis autis hanya berdasarkan ADI-R. Kritik utamanya…" }, o: [{ id: "ADI-R tidak mewawancarai orang tua" }, { id: "ADI-R cenderung over-diagnosis pada usia 2 tahun dengan keterlambatan kognitif; perlu dilengkapi observasi ADOS" }, { id: "ADOS tidak boleh dipakai" }, { id: "Anak harus dites WAIS" }], j: 1, b: { id: "ADI-R dan ADOS **saling melengkapi**: laporan orang tua + observasi langsung." } }
  ],
  istilah: [
    { t: "PDD", id: "Pervasive developmental disorders." },
    { t: "ADI-R", id: "Wawancara semi-terstruktur orang tua untuk autisme." },
    { t: "ADOS", id: "Observasi terstruktur perilaku anak untuk autisme." },
    { t: "K-ABC", id: "Kaufman Assessment Battery for Children (3–18 th)." },
    { t: "Bayley", id: "Skala perkembangan bayi 1–42 bulan." },
    { t: "NEPSY", id: "Baterai neuropsikologis anak 3–12 th." },
    { t: "Diferensiasi", id: "Menjadi pribadi mandiri sambil tetap terhubung keluarga." },
    { t: "Kesejahteraan psikologis", id: "Enam unsur Ryff & Keyes." }
  ],
  latihan: {
    pg: [
      { q: { id: "Menurut pendekatan perkembangan, tanda autisme di klinik paling sering berupa…" }, o: [{ id: "Perilaku aneh yang mencolok" }, { id: "Ketiadaan perilaku normatif seperti interaksi sosial yang wajar" }, { id: "IQ sangat tinggi" }, { id: "Halusinasi" }], j: 1 },
      { q: { id: "Psikolog ingin mendapat gambaran kemampuan kognitif terbaik anak ASD. Setting yang dianjurkan…" }, o: [{ id: "Taman bermain yang ramai" }, { id: "Lingkungan terstruktur dan minim gangguan" }, { id: "Pesta ulang tahun" }, { id: "Di depan banyak orang dewasa" }], j: 1 },
      { q: { id: "Perbedaan pokok ADI-R dan ADOS adalah…" }, o: [{ id: "ADI-R observasi; ADOS wawancara" }, { id: "ADI-R wawancara orang tua; ADOS observasi langsung anak" }, { id: "Keduanya tes IQ" }, { id: "ADOS hanya untuk dewasa" }], j: 1 },
      { q: { id: "Anak ASD 7 tahun dengan bahasa terbatas dan sulit beralih tugas perlu dites kecerdasannya. Pilihan paling sesuai…" }, o: [{ id: "WISC-IV verbal penuh" }, { id: "K-ABC yang mengurangi penekanan verbal dan membolehkan mengajarkan item awal" }, { id: "MMPI" }, { id: "Bayley" }], j: 1 },
      { q: { id: "Mengapa konsep IQ dihindari pada anak di bawah 4 tahun?" }, o: [{ id: "Anak tidak bisa duduk" }, { id: "Fungsi kognitif masih sangat terkait dengan domain perkembangan lain" }, { id: "Tidak ada tes" }, { id: "Dilarang hukum" }], j: 1 },
      { q: { id: "Bayley Scales digunakan untuk usia…" }, o: [{ id: "3–18 tahun" }, { id: "1–42 bulan" }, { id: "3–12 tahun" }, { id: "16–89 tahun" }], j: 1 },
      { q: { id: "Anak ASD ber-IQ 112 belum mampu memakai baju dan makan sendiri. Hal ini menunjukkan…" }, o: [{ id: "IQ salah ukur" }, { id: "Kesenjangan besar antara potensi kognitif dan perilaku adaptif yang khas pada ASD" }, { id: "Malingering" }, { id: "Disabilitas intelektual" }], j: 1 },
      { q: { id: "Pada NEPSY, anak autis khas menunjukkan defisit dalam…" }, o: [{ id: "Motorik kasar saja" }, { id: "Perhatian, fungsi eksekutif, dan memori wajah" }, { id: "Memori angka saja" }, { id: "Tidak ada defisit" }], j: 1 },
      { q: { id: "Dalam formulasi diagnosis ASD, kondisi yang perlu dipertimbangkan sebagai penjelas alternatif adalah…" }, o: [{ id: "Tuli kongenital" }, { id: "Hipertensi" }, { id: "Miopia ringan" }, { id: "Alergi" }], j: 0 },
      { q: { id: "Unsur Ryff yang paling dekat dengan prinsip “beribadah hanya kepada Allah” menurut slide adalah…" }, o: [{ id: "Otonomi" }, { id: "Tujuan hidup" }, { id: "Penguasaan lingkungan" }, { id: "Relasi positif" }], j: 1 }
    ],
    bs: [
      { t: { id: "Satu label autisme cukup untuk merancang intervensi bagi semua anak autis." }, j: false },
      { t: { id: "Keterlibatan orang tua membuat intervensi lebih efektif." }, j: true },
      { t: { id: "Hasil tes berbasis komputer selalu sama dengan tes yang diberikan penguji." }, j: false },
      { t: { id: "K-ABC dapat digunakan untuk anak usia 3–18 tahun." }, j: true },
      { t: { id: "Depresi mayor adalah gangguan mental paling umum pada perempuan menurut slide." }, j: true }
    ],
    isian: [
      { t: { id: "Wawancara semi-terstruktur dengan orang tua untuk autisme disingkat ______." }, j: { id: "ADI-R" }, x: [{ id: "ADOS" }, { id: "NEPSY" }, { id: "SADS" }] },
      { t: { id: "Baterai neuropsikologis untuk anak usia 3–12 tahun adalah ______." }, j: { id: "NEPSY" }, x: [{ id: "WMS" }, { id: "Bayley" }, { id: "MMPI" }] }
    ],
    jodoh: [
      { a: { id: "ADOS" }, b: { id: "Observasi bermain bebas" } },
      { a: { id: "ADI-R" }, b: { id: "Laporan orang tua" } },
      { a: { id: "Bayley" }, b: { id: "Skala perkembangan bayi" } },
      { a: { id: "K-ABC" }, b: { id: "Mengurangi tuntutan verbal" } },
      { a: { id: "Tes menggambar" }, b: { id: "Pemahaman sosial & ikatan" } }
    ]
  },
  tugas: [
    { t: { id: "Rancang asesmen untuk anak 4 tahun yang dicurigai ASD: alat, setting, dan peran orang tua." }, j: { id: "Mulai dengan laporan orang tua melalui ADI-R tentang onset, komunikasi, perkembangan sosial, dan bermain, lalu observasi langsung dengan ADOS yang diawali bermain bebas (perhatian ke orang atau objek, bermain sosial atau soliter, peka isyarat sosial). Bingkai temuan dalam jalur perkembangan normatif, mencari ketiadaan perilaku normatif. Untuk kognisi pakai tes minim bahasa seperti K-ABC di ruang terstruktur; untuk sosial gunakan situasi spontan. Nilai bicara-bahasa secara kuantitatif dan kualitatif, perilaku adaptif, dan sertakan tes menggambar serta bermain spontan. Singkirkan tuli kongenital. Libatkan orang tua sebagai pengamat dan mitra agar temuan diterjemahkan ke kehidupan nyata, lalu susun profil kekuatan–defisit dan kebutuhan layanan khusus." } },
    { t: { id: "Jelaskan mengapa pemilihan tes untuk anak ASD harus berbeda dan berikan contoh alternatifnya." }, j: { id: "Prosedur baku menjaga semua kondisi konstan agar kemampuan menjadi satu-satunya sumber variasi, tetapi anak ASD sangat dipengaruhi tuntutan bahasa, kompleksitas instruksi, tuntutan sosial, batas waktu, dan peralihan antarsubtes, sehingga skor bisa meremehkan kemampuan. Aturan praktisnya memilih tes yang minim bahasa, konkret, dan sedikit peralihan; penguji dapat menyelipkan tugas visual dan memakai camilan atau mainan sebagai penguat. WISC-IV paling sering dipakai tetapi sarat bahasa; alternatifnya K-ABC (3–18 th, boleh mengajarkan item awal), Differential Abilities Scales, Bayley untuk di bawah 4 tahun, dan NEPSY untuk profil neuropsikologis." } }
  ]
});

/* PPTA 301 — Modul 26: Studi Kasus Contoh I — Dari Rujukan ke Laporan */
Kuliah.pertemuan("tes-psikologi", {
  no: 26, tema: 4, motif: "laporan", motifOpt: { lbl: "Studi Kasus I" }, durasi: 60,
  judul: { id: "Studi Kasus Contoh I: Dari Rujukan ke Laporan", en: "Sample Case Study I" },
  ringkas: { id: "Membedah kasus **Jane (9 th 7 bln)** yang dirujuk karena kelancaran & pemahaman membaca: kesulitan saat harus **membaca sendiri** dibanding tugas **lisan**; ibu menganggapnya ringan. Tahapan: **demografi** (perhatikan sumber rujukan), **pertanyaan rujukan**, **wawancara klien** (tangani ekspektasi tak realistis), **tujuan asesmen**, **jadwal** (transparansi, persetujuan, kerahasiaan & batasnya), **pemilihan tes** (terpercaya, adil, valid, hemat biaya, panjang sesuai, sesuai kualifikasi, mudah, hasil jelas, sesuai klien) — contoh WAIS-III; **administrasi** baku; **interpretasi** (skor mentah → z; jangan hanya skor; jangan mengkotak-kotakkan); **laporan** nonteknis untuk pembaca tertentu. Islam: QS Al-Hujurat 12 — jauhi prasangka; minta izin sebelum menghubungi pihak lain." },
  tujuan: [
    { id: "Menelusuri tahapan asesmen dari demografi dan pertanyaan rujukan hingga penulisan laporan." },
    { id: "Menerapkan kriteria pemilihan dan administrasi tes yang tepat." },
    { id: "Menafsirkan hasil secara terintegrasi dan menulis laporan yang etis tanpa prasangka." }
  ],
  isi: [
    { t: "pembuka", id: "\"Jane tidak suka membaca — mungkin itu saja masalahnya,\" kata ibunya. Tetapi mengapa Jane lancar saat soal **dibacakan**, dan kesulitan saat harus **membaca sendiri**? Studi kasus melatih kita mengubah keluhan sehari-hari menjadi **pertanyaan asesmen** yang tajam." },
    { t: "tabel", judul: { id: "Lembar identitas kasus (diringkas)" }, kolom: ["Butir", "Isi"], baris: [
      ["Nama / usia", "Jane, **9 tahun 7 bulan**; selesai kelas 3"],
      ["Pemeriksa", "Mahasiswa psikologi sekolah (kasus latihan)"],
      ["Pertanyaan rujukan", "Ibu khawatir kelancaran & **pemahaman membaca**; kesulitan menguraikan kata, kosakata, pemahaman bila **harus membaca** (vs lisan); ibu menilai masalahnya **ringan** dan karena Jane **tidak suka membaca**"],
      ["Wawancara ibu", "Keluarga harmonis; ayah sering bepergian kerja; aktif di komunitas agama; Jane sehat, ceria, ingin menyenangkan orang, banyak teman; tak tampak tegang atau takut"]
    ] },
    { t: "catatan", gaya: "faidah", judul: { id: "Membaca data kasus secara kritis" }, id: "Pola \"lisan baik, tertulis buruk\" mengarahkan hipotesis ke **proses membaca (decoding)**, bukan kemampuan bahasa umum atau motivasi semata. Label ibu (\"cuma tidak suka membaca\") adalah **data**, bukan kesimpulan — bisa jadi tidak suka membaca adalah **akibat**, bukan sebab." },
    { t: "anim", jenis: "alur", judul: { id: "Tahapan asesmen" }, item: [
      { judul: { id: "Demografi" }, ket: { id: "Usia, etnis, pendidikan, riwayat keluarga-medis-kriminal-kerja; siapa yang merujuk?" } },
      { judul: { id: "Pertanyaan rujukan" }, ket: { id: "Mengapa, oleh siapa, untuk apa" } },
      { judul: { id: "Wawancara klien" }, ket: { id: "Masa kecil, keluarga, sekolah/kerja; harapan klien" } },
      { judul: { id: "Tujuan & jadwal" }, ket: { id: "Domain tes; transparansi; persetujuan & kerahasiaan" } },
      { judul: { id: "Pilih & beri tes" }, ket: { id: "Kriteria tes; administrasi baku" } },
      { judul: { id: "Interpretasi" }, ket: { id: "Skor + perilaku + riwayat" } },
      { judul: { id: "Laporan & umpan balik" }, ket: { id: "Nonteknis; jelaskan ke klien & keluarga" } }
    ] },
    { t: "catatan", gaya: "tanbih", judul: { id: "Sumber rujukan memengaruhi asesmen" }, id: "Apakah orang tua yang meminta, atau sekolah? Pihak perujuk punya **harapan & kepentingan** berbeda — dan itu memengaruhi apa yang diceritakan, apa yang ditanyakan, dan siapa yang membaca laporan." },
    { t: "daftar", judul: { id: "Domain tujuan asesmen" }, item: [{ id: "Asesmen & pengujian **perilaku**" }, { id: "Diagnostik **kesehatan mental**" }, { id: "**Vokasional/karier** (penempatan)" }, { id: "**Kemampuan** & **kognitif**" }, { id: "**Pendidikan**" }, { id: "**IQ/kecerdasan**" }] },
    { t: "catatan", gaya: "info", judul: { id: "Saat menjadwalkan" }, id: "Jelaskan langkah selanjutnya secara **transparan**: manual atau komputer, berapa lama, apa yang dibawa, ada jeda atau tidak, standar pengujian, serta **persetujuan, kerahasiaan, dan batas kerahasiaan**." },
    { t: "judul", id: "Memilih tes" },
    { t: "poin", item: [
      { ikon: "check", judul: { id: "Terpercaya" }, id: "Cek koefisien reliabilitas & riset di manual." },
      { ikon: "scale", judul: { id: "Adil" }, id: "Sensitivitas budaya." },
      { ikon: "target", judul: { id: "Valid" }, id: "Apakah pendidikan/disabilitas memengaruhi?" },
      { ikon: "scale", judul: { id: "Hemat biaya" }, id: "Manual, lembar jawab, lembar skor berbayar." },
      { ikon: "clock", judul: { id: "Panjang sesuai" }, id: "Terlalu panjang → cemas & lelah." },
      { ikon: "medal", judul: { id: "Sesuai kualifikasi" }, id: "Mungkin butuh pelatihan khusus." },
      { ikon: "list", judul: { id: "Mudah & jelas" }, id: "Lembar sederhana; skor, diagnosis, rekomendasi jelas." },
      { ikon: "user", judul: { id: "Sesuai klien" }, id: "Kemampuan membaca & budaya." }
    ] },
    { t: "tabel", judul: { id: "Contoh kartu tes: WAIS-III" }, kolom: ["Butir", "Isi"], baris: [
      ["Mengukur", "Kemampuan intelektual dewasa. Verbal: Informasi, Pemahaman, Persamaan, Aritmetika, Kosakata, Digit Span. Kinerja: Penyelesaian Gambar, Pengaturan Gambar, Desain Blok, Kode, Penalaran Matriks"],
      ["Sasaran & norma", "16–89 th; **2.450** orang, representatif ras, pendidikan, wilayah"],
      ["Kualifikasi", "**Psikolog berlisensi**"],
      ["Cara & waktu", "Kertas-pensil; **60–90 menit**; skor manual/komputer"],
      ["Biaya", "Set lengkap ±**$825** (manual, buku stimulus, 25 formulir)"]
    ] },
    { t: "catatan", gaya: "faidah", judul: { id: "Untuk Jane" }, id: "Jane berusia 9 tahun, sehingga WAIS-III (16–89 th) **tidak tepat**; pilih tes kecerdasan anak (mis. WISC) + **tes prestasi membaca** (decoding, kelancaran, pemahaman) + observasi & laporan guru. Membandingkan pemahaman **lisan vs membaca** langsung menjawab pertanyaan rujukan." },
    { t: "judul", id: "Administrasi & interpretasi" },
    { t: "banding", kiri: { judul: { id: "Administrasi baku" }, warna: "blue", poin: [{ id: "Bangun **rapport**" }, { id: "Bahasa verbal & tubuh jelas" }, { id: "Instruksi **verbatim**" }, { id: "Ruang baku: pencahayaan, suhu, **jarak duduk sesuai budaya**" }] }, kanan: { judul: { id: "Interpretasi terintegrasi" }, warna: "green", poin: [{ id: "Skor mentah → **z** atau skor baku" }, { id: "Gabungkan **perilaku saat tes**, laporan keluarga, riwayat medis, fMRI bila relevan" }, { id: "Hati-hati **mengkotak-kotakkan** (tinggi/sedang/rendah)" }] } },
    { t: "anim", jenis: "kurva", judul: { id: "Dari skor mentah ke skor z" }, skala: "z", awal: -1.3, ket: { id: "Misal skor pemahaman membaca Jane z = −1,3 (sekitar persentil 10), sementara pemahaman lisan z = +0,4. **Selisih** itulah temuan klinis yang penting — bukan label \"rendah\" semata." } },
    { t: "catatan", gaya: "tanbih", judul: { id: "Menulis laporan" }, id: "Ingat **siapa pembacanya** (dokter keluarga, guru, asuransi) dan bagaimana laporan memengaruhi **peran & masa depan** klien. Tulis dengan istilah **nonteknis**, lalu luangkan waktu menjelaskan hasil kepada klien dan keluarga." },
    { t: "catatan", gaya: "info", judul: { id: "Pelajaran dari video sesi pertama" }, id: "Konselor menanyakan **mengapa klien datang**, memakai **validasi** dan mengulang kata kunci, serta menggali latar belakang (pendidikan, kondisi hidup)." },
    { t: "ayat", ar: "يَا أَيُّهَا الَّذِينَ آمَنُوا اجْتَنِبُوا كَثِيرًا مِّنَ الظَّنِّ إِنَّ بَعْضَ الظَّنِّ إِثْمٌ ۖ وَلَا تَجَسَّسُوا وَلَا يَغْتَب بَّعْضُكُم بَعْضًا", id: "Wahai orang-orang yang beriman, jauhilah banyak prasangka, sesungguhnya sebagian prasangka itu dosa; janganlah mencari-cari kesalahan orang lain dan janganlah sebagian kamu menggunjing sebagian yang lain.", src: "Al-Hujurat [49]: 12" },
    { t: "catatan", gaya: "hikmah", judul: { id: "Perspektif Islam" }, id: "Nilai klien **tanpa prasangka** tentang keluarga, pendidikan, atau gejala yang disampaikan; jangan terburu-buru mencentang daftar gejala lalu mendiagnosis. **Minta izin** sebelum menghubungi keluarga, atasan, atau sekolah — jangan bergerak diam-diam di belakang klien (*lā tajassasū*). Pada klien Muslim, jangan menghakimi tingkat **iman** atau pengetahuan agamanya." },
    { t: "ringkasan", item: [{ id: "Demografi + sumber rujukan → pertanyaan rujukan yang tajam." }, { id: "Wawancara klien; kelola ekspektasi; transparansi & kerahasiaan." }, { id: "Kriteria tes: terpercaya, adil, valid, biaya, panjang, kualifikasi, kejelasan, sesuai klien." }, { id: "Administrasi baku; interpretasi = skor + perilaku + riwayat." }, { id: "Laporan nonteknis; tanpa prasangka; minta izin (QS 49:12)." }] },
    { t: "cek", q: { id: "Untuk menjawab pertanyaan rujukan Jane, perbandingan data yang PALING informatif adalah…" }, o: [{ id: "IQ Jane dengan IQ kakaknya" }, { id: "Pemahaman saat soal dibacakan vs saat Jane membaca sendiri" }, { id: "Tinggi badan dengan berat badan" }, { id: "Skor MMPI" }], j: 1, b: { id: "Keluhan intinya adalah selisih **lisan vs tertulis** — itulah yang harus diuji." } }
  ],
  istilah: [
    { t: "Pertanyaan rujukan", id: "Alasan, perujuk, dan tujuan asesmen." },
    { t: "Demografi", id: "Data latar belakang klien." },
    { t: "Batas kerahasiaan", id: "Kondisi informasi wajib dibuka (mis. bahaya)." },
    { t: "Skor z", id: "Skor baku: (X − rata-rata) / SD." },
    { t: "Administrasi baku", id: "Prosedur seragam: instruksi, ruang, waktu." },
    { t: "Tajassus", id: "Mencari-cari kesalahan/memata-matai." }
  ],
  latihan: {
    pg: [
      { q: { id: "Hipotesis awal paling tepat untuk Jane berdasarkan pertanyaan rujukan adalah…" }, o: [{ id: "Disabilitas intelektual umum" }, { id: "Kesulitan pada proses membaca (decoding/pemahaman bacaan), bukan bahasa lisan" }, { id: "Depresi berat" }, { id: "ADHD pasti" }], j: 1 },
      { q: { id: "Pernyataan ibu “Jane cuma tidak suka membaca” sebaiknya diperlakukan sebagai…" }, o: [{ id: "Diagnosis final" }, { id: "Data yang perlu diuji — bisa jadi akibat, bukan sebab" }, { id: "Informasi tidak relevan" }, { id: "Bukti malingering" }], j: 1 },
      { q: { id: "Mengapa WAIS-III tidak tepat untuk Jane?" }, o: [{ id: "Terlalu murah" }, { id: "Normanya untuk usia 16–89 tahun" }, { id: "Tidak punya subtes verbal" }, { id: "Hanya untuk lansia" }], j: 1 },
      { q: { id: "Kriteria pemilihan tes “adil” terutama berkaitan dengan…" }, o: [{ id: "Harga" }, { id: "Sensitivitas budaya" }, { id: "Lama tes" }, { id: "Kualifikasi penguji" }], j: 1 },
      { q: { id: "Saat menjadwalkan asesmen, yang WAJIB dijelaskan kepada klien adalah…" }, o: [{ id: "Hasil yang diharapkan pemeriksa" }, { id: "Persetujuan, kerahasiaan, dan batas kerahasiaan" }, { id: "Gaji pemeriksa" }, { id: "Diagnosis awal" }], j: 1 },
      { q: { id: "Seorang psikolog menyimpulkan “IQ rendah” hanya dari skor, padahal klien demam tinggi saat tes. Kesalahannya…" }, o: [{ id: "Tidak mengubah skor ke z" }, { id: "Interpretasi hanya berdasarkan skor tanpa mempertimbangkan perilaku/kondisi saat tes" }, { id: "Memakai tes terlalu murah" }, { id: "Instruksi verbatim" }], j: 1 },
      { q: { id: "Laporan untuk guru Jane sebaiknya…" }, o: [{ id: "Penuh istilah teknis agar tampak profesional" }, { id: "Nonteknis, mempertimbangkan dampaknya bagi peran Jane di sekolah" }, { id: "Memuat semua skor mentah tanpa penjelasan" }, { id: "Tidak perlu dijelaskan" }], j: 1 },
      { q: { id: "Psikolog menelepon sekolah klien dewasa tanpa memberitahunya untuk “mengecek kejujurannya”. Ini bertentangan dengan…" }, o: [{ id: "Prinsip verbatim" }, { id: "Larangan tajassus dan prinsip meminta izin klien" }, { id: "Kriteria biaya" }, { id: "Skor z" }], j: 1 },
      { q: { id: "Klien lansia mengeluh mudah lupa. Rangkaian tes yang sesuai contoh slide…" }, o: [{ id: "Rorschach saja" }, { id: "Tes memori, WAIS, tes neuropsikologis (perhatian, eksekutif), dan BDI" }, { id: "Tes minat karier" }, { id: "Bayley" }], j: 1 },
      { q: { id: "Penataan jarak duduk dalam administrasi tes sebaiknya…" }, o: [{ id: "Selalu sedekat mungkin" }, { id: "Sesuai budaya klien dan tetap baku" }, { id: "Bebas sesuka penguji" }, { id: "Tidak penting" }], j: 1 }
    ],
    bs: [
      { t: { id: "Sumber rujukan dapat memengaruhi proses asesmen." }, j: true },
      { t: { id: "Interpretasi cukup berdasarkan skor tes saja." }, j: false },
      { t: { id: "WAIS-III harus diadministrasi psikolog berlisensi." }, j: true },
      { t: { id: "Tes yang terlalu panjang dapat menimbulkan kecemasan dan kelelahan." }, j: true },
      { t: { id: "Mencentang daftar gejala lalu cepat mendiagnosis adalah praktik klinis yang baik." }, j: false }
    ],
    isian: [
      { t: { id: "Norma WAIS-III disusun dari 2.450 orang usia 16 sampai ______ tahun." }, j: { id: "89" }, x: [{ id: "65" }, { id: "74" }, { id: "99" }] },
      { t: { id: "Instruksi tes dibacakan secara ______." }, j: { id: "verbatim" }, x: [{ id: "bebas" }, { id: "ringkas" }, { id: "improvisasi" }] }
    ],
    urut: { t: { id: "Urutkan tahapan asesmen" }, item: [{ id: "Demografi" }, { id: "Pertanyaan rujukan" }, { id: "Wawancara klien" }, { id: "Tujuan & jadwal" }, { id: "Pemilihan & administrasi tes" }, { id: "Interpretasi" }, { id: "Laporan & umpan balik" }] }
  },
  tugas: [
    { t: { id: "Susun rencana asesmen lengkap untuk Jane, dari pertanyaan rujukan hingga laporan." }, j: { id: "Pertanyaan rujukan: mengapa Jane kesulitan menguraikan kata dan memahami bacaan saat harus membaca sendiri, padahal baik saat soal dibacakan, dan apakah ini sekadar tidak suka membaca. Lengkapi demografi dan wawancara (ibu, guru, Jane), catat bahwa perujuk adalah ibu. Jelaskan prosedur, persetujuan, dan kerahasiaan. Pilih tes yang sesuai usia: tes kecerdasan anak (bukan WAIS-III), tes prestasi membaca (decoding, kelancaran, pemahaman) dibandingkan dengan pemahaman lisan, observasi, dan laporan sekolah. Administrasi baku dengan rapport. Interpretasi mengubah skor mentah ke skor baku dan memadukan perilaku saat tes serta riwayat. Laporan nonteknis untuk orang tua dan guru, dijelaskan langsung, dengan rekomendasi pembelajaran membaca." } },
    { t: { id: "Jelaskan kriteria pemilihan tes dan nilai-nilai Islam yang relevan dalam proses asesmen." }, j: { id: "Kriteria: terpercaya (reliabilitas di manual), adil (sensitif budaya), valid (tidak bias pendidikan/disabilitas), hemat biaya, panjang yang sesuai, sesuai kualifikasi pemeriksa, mudah diterapkan, hasil mudah dipahami, dan sesuai kemampuan membaca serta budaya klien. Nilai Islam: QS Al-Hujurat 12 memerintahkan menjauhi prasangka, tidak mencari-cari kesalahan, dan tidak menggunjing; maka klien dinilai tanpa prasangka tentang keluarga, pendidikan, atau gejala, diagnosis tidak diburu-buru, izin diminta sebelum menghubungi pihak lain, dan tingkat keimanan klien Muslim tidak dihakimi." } }
  ]
});

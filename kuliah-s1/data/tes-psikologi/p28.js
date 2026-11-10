/* PPTA 301 — Modul 28: Tren Masa Depan dalam Pengujian */
Kuliah.pertemuan("tes-psikologi", {
  no: 28, tema: 2, motif: "layar", motifOpt: { lbl: "Tren Masa Depan" }, durasi: 55,
  judul: { id: "Tren Masa Depan dalam Pengujian", en: "Future Trends in Testing" },
  ringkas: { id: "Asesmen berbasis komputer tumbuh: narasi komputer dipakai **17%** psikolog (1990) → **40%** (1999); > **400** paket perangkat lunak. Kini: efisiensi skor, penyimpanan, laporan; ke depan: **tes adaptif**, norma jaringan, **realitas virtual**, pemantauan psikofisiologis, **AI**. Neuropsikologi: COGSCREEN (pilot), validasi masih terbatas. Keuntungan: hemat waktu, tes-ulang lebih andal, bias penguji berkurang, efisien. Kontroversi: reliabilitas **setara** kertas-pensil; tetapi hanya **60%** interpretasi komputer sesuai (Butcher dkk., 2000) → jangan salin-tempel, pakai untuk **verifikasi**. Pedoman **APA** CBTI. **Pengujian ≠ asesmen**. VR: cara dikendalikan, umpan balik, apa yang dikendalikan; Kelas Virtual, simulasi mengemudi/belanja; pertimbangkan efek kohort, biaya, validitas konstruk, standardisasi." },
  tujuan: [
    { id: "Menjelaskan perkembangan, penggunaan, keuntungan, dan kontroversi asesmen berbasis komputer." },
    { id: "Membedakan pengujian dan asesmen serta menerapkan pedoman APA dalam memakai laporan komputer." },
    { id: "Menguraikan pemanfaatan realitas virtual dan faktor yang perlu dipertimbangkan saat memakai teknologi." }
  ],
  isi: [
    { t: "pembuka", id: "Sebuah aplikasi bisa menskor MMPI dalam detik dan mencetak laporan 10 halaman yang terdengar sangat meyakinkan. Pertanyaannya: **berapa persen kalimat di laporan itu benar untuk klien di depan Anda?**" },
    { t: "anim", jenis: "garis-waktu", judul: { id: "Komputer dalam asesmen" }, item: [
      { th: "1990", judul: { id: "17% psikolog" }, ket: { id: "Sering memakai narasi buatan komputer." } },
      { th: "1999", judul: { id: "40% psikolog" }, ket: { id: "> 400 paket perangkat lunak dari penerbit tes." } },
      { th: "2000", judul: { id: "Butcher dkk." }, ket: { id: "Hanya **60%** interpretasi komputer dinilai sesuai." } },
      { th: "Kini", judul: { id: "Efisiensi" }, ket: { id: "Skor, tabel, grafik (Excel/SPSS), laporan; wawancara & diagnosis berbasis komputer; simulasi wawancara psikiatri." } },
      { th: "Masa depan", judul: { id: "Adaptif, VR, AI" }, ket: { id: "Item adaptif, norma jaringan, realitas virtual, pemantauan psikofisiologis, kecerdasan buatan." } }
    ] },
    { t: "banding", kiri: { judul: { id: "Keuntungan" }, warna: "green", poin: [{ id: "Menghemat **waktu profesional**" }, { id: "**Reliabilitas tes-ulang** meningkat" }, { id: "Mengurangi **bias penguji**" }, { id: "Menekan biaya sistem kesehatan" }, { id: "Kelak: tafsir skor kini berdasarkan skor lampau" }] }, kanan: { judul: { id: "Kontroversi" }, warna: "red", poin: [{ id: "Reliabilitas & validitas dulu **belum diuji**" }, { id: "Riset: reliabilitas **setara** kertas-pensil, beda skor tak signifikan" }, { id: "Tetapi **40%** interpretasi tidak sesuai" }, { id: "Perangkat lunak bisa dibeli orang **tak berkualifikasi**" }] } },
    { t: "anim", jenis: "spektrum", judul: { id: "Seberapa bisa dipercaya laporan komputer?" }, min: 0, max: 100, satuan: "% pernyataan", awal: 60, rentang: [
      { label: { id: "Sesuai" }, dari: 0, sampai: 60, ket: { id: "±60% pernyataan sesuai (Butcher dkk., 2000)" } },
      { label: { id: "Tidak sesuai" }, dari: 60, sampai: 100, ket: { id: "±40% — itulah sebabnya laporan tak boleh disalin-tempel" } }
    ], ket: { id: "Gunakan laporan komputer untuk **verifikasi** hipotesis, bukan pengganti penilaian klinis." } },
    { t: "catatan", gaya: "info", judul: { id: "Neuropsikologi berbasis komputer" }, id: "Baterai dikembangkan oleh organisasi besar (militer, otoritas penerbangan). Contoh **COGSCREEN** untuk seleksi pilot maskapai — tetapi belum memiliki **studi validasi** seluas tes tradisional." },
    { t: "judul", id: "Pedoman" },
    { t: "poin", item: [
      { ikon: "book", judul: { id: "APA — pengguna" }, id: "Paham pengukuran psikologis/pendidikan, isu validasi, riset tes (*Guidelines for Computer-Based Test Interpretation*)." },
      { ikon: "medal", judul: { id: "APA — psikolog" }, id: "Batasi pada teknik yang **dikenal & dikuasai**." },
      { ikon: "search", judul: { id: "Untuk kita" }, id: "Hubungkan narasi dengan riset empiris, **sejarah & situasi unik** klien; pengembang wajib menyediakan manual memadai; tetap mutakhir." }
    ] },
    { t: "catatan", gaya: "faidah", judul: { id: "Contoh analisis kritis" }, id: "Laporan berkata \"klien tampak **tertekan**\". Periksa: apakah benar tertekan, atau **bosan**, **cemas**, lelah, atau sedang puasa dan mengantuk? Hanya penilaian manusia yang menghubungkan skor dengan konteks." },
    { t: "banding", judul: { id: "Pengujian vs asesmen" }, kiri: { judul: { id: "Pengujian" }, warna: "blue", poin: [{ id: "Seperangkat **keterampilan teknis**" }, { id: "Berorientasi **pengukuran**" }, { id: "Menghasilkan **hasil tes**" }] }, kanan: { judul: { id: "Asesmen" }, warna: "green", poin: [{ id: "**Sistem**, berorientasi **masalah**" }, { id: "**Dinamis & konseptual**" }, { id: "Menjawab **arti** hasil bagi kasus nyata — butuh **penilaian manusia**" }] } },
    { t: "catatan", gaya: "tanbih", id: "Masalah utama asesmen berbasis komputer saat ini: **mengubah asesmen psikologis menjadi sekadar pengujian psikologis**." },
    { t: "judul", id: "Realitas virtual (VR)" },
    { t: "p", id: "Lingkungan virtual 3D menjadikan pengguna **peserta aktif**, dengan stimulasi **realistis** dalam lingkungan **terkendali** (contoh: *Body Image Virtual Reality Scale*)." },
    { t: "anim", jenis: "siklus", judul: { id: "Tiga aspek VR dalam asesmen" }, pusat: { id: "VR" }, item: [
      { judul: { id: "Cara dikendalikan" }, ket: { id: "Bukan sekadar tombol: gerak banyak bagian tubuh terbaca; gerak tangan → dorongan" } },
      { judul: { id: "Umpan balik" }, ket: { id: "Multisensori; bisa dialihkan ke indera lain bagi penyandang gangguan indera" } },
      { judul: { id: "Apa yang dikendalikan" }, ket: { id: "Lingkungan meniru objek nyata; representasi multisensori lewat gerak alami" } }
    ] },
    { t: "tabel", kolom: ["Pemanfaatan", "Contoh"], baris: [
      ["**Gangguan perhatian**", "**Kelas Virtual**: penguji mengatur jenis & jumlah pengalih; dipadukan tes seperti Boston Naming, Stroop"],
      ["**Fungsi sehari-hari**", "Simulasi **mengemudi** (layar imersif, umpan balik multisensori) & **toko grosir**"],
      ["**Fungsi eksekutif**", "**Tugas banyak urusan** (*Multiple Errands*) untuk lesi lobus frontal"]
    ] },
    { t: "daftar", judul: { id: "Faktor saat menerapkan teknologi" }, item: [{ id: "**Efek kohort**: keakraban dengan teknologi (lansia vs remaja)." }, { id: "**Efisiensi biaya**." }, { id: "**Validitas konstruk**: apakah mengukur konstruk yang sama dengan versi kertas?" }, { id: "**Standardisasi**: kecepatan prosesor dapat memengaruhi akurasi **waktu reaksi**." }] },
    { t: "catatan", gaya: "hikmah", id: "Teknologi adalah alat; amanah penilaian tetap pada manusia. Allah ﷻ berfirman: *\"Dan janganlah kamu mengikuti sesuatu yang tidak kamu ketahui. Sesungguhnya pendengaran, penglihatan, dan hati, semuanya akan dimintai pertanggungjawaban.\"* (QS Al-Isra' [17]: 36). Menyalin laporan komputer tanpa memverifikasinya berarti mengikuti apa yang tidak kita ketahui." },
    { t: "ringkasan", item: [{ id: "17% (1990) → 40% (1999); > 400 paket." }, { id: "Keuntungan: waktu, reliabilitas tes-ulang, bias berkurang, biaya." }, { id: "Reliabilitas setara; 60% interpretasi sesuai → verifikasi, bukan salin-tempel." }, { id: "Pedoman APA CBTI; pengujian ≠ asesmen." }, { id: "VR: kendali, umpan balik, lingkungan; Kelas Virtual; efek kohort, validitas konstruk, standardisasi." }] },
    { t: "cek", q: { id: "Psikolog menyalin utuh laporan interpretasi MMPI dari perangkat lunak ke laporan kliennya. Masalah utamanya…" }, o: [{ id: "Reliabilitas komputer rendah" }, { id: "Sekitar 40% interpretasi komputer tidak sesuai; laporan harus diverifikasi dengan konteks klien" }, { id: "Komputer selalu bias" }, { id: "MMPI tidak boleh diskor komputer" }], j: 1, b: { id: "Reliabilitas setara, tetapi **kesesuaian interpretasi** hanya ±60%." } }
  ],
  istilah: [
    { t: "CBTI", id: "Computer-Based Test Interpretation." },
    { t: "Tes adaptif", id: "Item disesuaikan dengan jawaban sebelumnya." },
    { t: "COGSCREEN", id: "Baterai kognitif komputer untuk seleksi pilot." },
    { t: "Realitas virtual", id: "Lingkungan 3D interaktif buatan komputer." },
    { t: "Efek kohort", id: "Perbedaan karena generasi/keakraban teknologi." },
    { t: "Validitas konstruk", id: "Sejauh mana tes mengukur konstruk yang dimaksud." },
    { t: "Validitas ekologis", id: "Kemiripan tugas tes dengan kehidupan nyata." }
  ],
  latihan: {
    pg: [
      { q: { id: "Persentase psikolog yang sering memakai narasi komputer pada 1999 adalah…" }, o: [{ id: "17%" }, { id: "40%" }, { id: "60%" }, { id: "90%" }], j: 1 },
      { q: { id: "Temuan riset tentang reliabilitas tes komputer dibanding kertas-pensil…" }, o: [{ id: "Jauh lebih rendah" }, { id: "Sangat baik dan setara; beda skor tidak signifikan" }, { id: "Tidak pernah diteliti" }, { id: "Selalu lebih tinggi 50%" }], j: 1 },
      { q: { id: "Cara yang tepat memakai laporan interpretasi komputer adalah…" }, o: [{ id: "Disalin langsung" }, { id: "Untuk verifikasi, dihubungkan dengan riset dan konteks unik klien" }, { id: "Diabaikan sepenuhnya" }, { id: "Diberikan langsung ke klien" }], j: 1 },
      { q: { id: "Perbedaan pokok pengujian dan asesmen adalah…" }, o: [{ id: "Pengujian dinamis, asesmen teknis" }, { id: "Pengujian teknis-pengukuran; asesmen sistem berorientasi masalah yang butuh penilaian manusia" }, { id: "Sama saja" }, { id: "Asesmen hanya untuk anak" }], j: 1 },
      { q: { id: "Lansia yang tidak terbiasa memakai komputer mendapat skor waktu reaksi buruk pada tes komputer. Faktor yang paling relevan…" }, o: [{ id: "Validitas isi" }, { id: "Efek kohort (keakraban dengan teknologi)" }, { id: "Reliabilitas antar-penilai" }, { id: "Bias budaya agama" }], j: 1 },
      { q: { id: "Dua komputer dengan kecepatan prosesor berbeda menghasilkan waktu reaksi berbeda untuk orang yang sama. Ini masalah…" }, o: [{ id: "Standardisasi" }, { id: "Efek kohort" }, { id: "Cultural loading" }, { id: "Malingering" }], j: 0 },
      { q: { id: "Kelas Virtual paling berguna untuk menilai…" }, o: [{ id: "Kepribadian proyektif" }, { id: "Gangguan perhatian dengan pengalih yang dapat dikendalikan" }, { id: "IQ verbal" }, { id: "Minat karier" }], j: 1 },
      { q: { id: "Tugas “banyak urusan” (multiple errands) dikembangkan untuk menilai…" }, o: [{ id: "Memori jangka panjang" }, { id: "Fungsi eksekutif pada lesi lobus frontal" }, { id: "Persepsi warna" }, { id: "Bahasa" }], j: 1 },
      { q: { id: "Pedoman APA untuk psikolog terkait tes komputer adalah…" }, o: [{ id: "Bebas memakai perangkat lunak apa pun" }, { id: "Membatasi pada teknik yang dikenal dan dikuasai" }, { id: "Menyerahkan pada teknisi" }, { id: "Tidak perlu manual" }], j: 1 },
      { q: { id: "Kelebihan VR dibanding antarmuka komputer biasa dalam aspek “cara dikendalikan”…" }, o: [{ id: "Hanya menerima tombol keyboard" }, { id: "Membuka saluran input: memantau gerak banyak bagian tubuh sekaligus" }, { id: "Lebih murah" }, { id: "Tanpa umpan balik" }], j: 1 }
    ],
    bs: [
      { t: { id: "COGSCREEN telah divalidasi seluas tes tradisional." }, j: false },
      { t: { id: "Asesmen komputer dapat mengurangi bias penguji." }, j: true },
      { t: { id: "Perangkat lunak tes kadang tersedia bagi orang tanpa kualifikasi." }, j: true },
      { t: { id: "Tes komputer memberikan jawaban lengkap untuk kasus dunia nyata." }, j: false },
      { t: { id: "Umpan balik VR dapat diterjemahkan ke indera lain bagi pengguna dengan gangguan indera." }, j: true }
    ],
    isian: [
      { t: { id: "Menurut Butcher dkk. (2000), sekitar ______% interpretasi komputer sesuai." }, j: { id: "60" }, x: [{ id: "17" }, { id: "40" }, { id: "95" }] },
      { t: { id: "Tersedia lebih dari ______ paket perangkat lunak tes." }, j: { id: "400" }, x: [{ id: "40" }, { id: "4.000" }, { id: "100" }] }
    ],
    pilah: { t: { id: "Pilah: ciri pengujian atau asesmen?" }, kategori: [{ id: "Pengujian" }, { id: "Asesmen" }], item: [{ t: { id: "Menghitung skor mentah" }, k: 0 }, { t: { id: "Mengintegrasikan riwayat dan konteks klien" }, k: 1 }, { t: { id: "Keterampilan teknis administrasi" }, k: 0 }, { t: { id: "Menjawab pertanyaan rujukan" }, k: 1 }, { t: { id: "Mencetak profil skala" }, k: 0 }, { t: { id: "Merumuskan rekomendasi" }, k: 1 }] }
  },
  tugas: [
    { t: { id: "Jelaskan keuntungan dan kontroversi asesmen berbasis komputer serta pedoman memakainya secara etis." }, j: { id: "Keuntungan: menghemat waktu profesional, meningkatkan reliabilitas tes-ulang, mengurangi bias penguji, menekan biaya, dan kelak memungkinkan tafsir berbasis skor lampau. Kontroversi: dulu reliabilitas dan validitas belum diuji; riset menunjukkan reliabilitas setara kertas-pensil, tetapi hanya sekitar 60% interpretasi yang sesuai (Butcher dkk., 2000), dan perangkat lunak bisa diakses orang tak berkualifikasi. Pedoman: pengguna harus memahami pengukuran dan validasi; psikolog membatasi diri pada teknik yang dikuasai (APA CBTI); narasi komputer dipakai untuk verifikasi, dihubungkan dengan riset dan konteks unik klien, tidak disalin-tempel; pengembang menyediakan manual memadai." } },
    { t: { id: "Uraikan tiga aspek VR dalam asesmen, contoh pemanfaatannya, dan faktor yang perlu dipertimbangkan." }, j: { id: "Cara dikendalikan: VR membuka saluran input yang memantau gerak banyak bagian tubuh, tidak hanya tombol. Umpan balik: multisensori dan dapat dialihkan ke indera lain bagi penyandang gangguan indera. Apa yang dikendalikan: lingkungan dapat meniru objek nyata dan dimanipulasi lewat gerak alami. Contoh: Kelas Virtual untuk gangguan perhatian dengan pengalih yang diatur, simulasi mengemudi dan toko grosir untuk fungsi sehari-hari, tugas banyak urusan untuk fungsi eksekutif lobus frontal, Body Image VR Scale. Faktor: efek kohort, efisiensi biaya, validitas konstruk dibanding versi kertas, dan standardisasi perangkat (kecepatan prosesor memengaruhi waktu reaksi)." } }
  ]
});

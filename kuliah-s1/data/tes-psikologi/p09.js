/* PPTA 301 — Modul 9: Faktor Pasien dalam Pengujian */
Kuliah.pertemuan("tes-psikologi", {
  no: 9, tema: 3, motif: "tangan", motifOpt: { lbl: "Faktor Pasien dalam Pengujian" }, durasi: 50,
  judul: { id: "Faktor Pasien dalam Pengujian", en: "Patient Factors in Testing" },
  ringkas: { id: "Skor dipengaruhi kondisi orang yang dites: **motivasi** (lesu, tidak terlibat; depresi pasca-cedera otak), **kondisi optimal** (Heaton, 1981: kinerja terbaik — bebas gangguan, tidak mengancam, tidak lelah) **dan kondisi standar** (administrasi seragam, wajib untuk WAIS), **kesehatan fisik** & diagnosis ganda, **kecemasan tes** (dorongan netral di sepanjang tes), **bias budaya & bahasa**, serta **sensitivitas terhadap klien Muslim** (mahram, pintu sedikit terbuka, psikolog perempuan untuk klien bercadar)." },
  tujuan: [
    { id: "Menjelaskan bagaimana motivasi, kesehatan, dan kecemasan memengaruhi skor." },
    { id: "Menyeimbangkan kondisi optimal (Heaton) dan kondisi standar." },
    { id: "Menerapkan adaptasi budaya, bahasa, dan syariat dalam pengujian." }
  ],
  isi: [
    { t: "pembuka", id: "Tes psikologis bisa berlangsung **2–3 jam** dalam sekali duduk: menulis, menggambar, mengingat — latihan kognitif **dan emosional**. Pasien geriatri yang tak ingat ulang tahunnya bisa **menangis** di tengah tes. Seperti pemeriksaan medis, pasien perlu datang dalam kondisi prima: tidak lelah dan sudah sarapan." },
    { t: "judul", id: "Motivasi pasien" },
    { t: "daftar", item: [{ id: "Kurang motivasi tampak dari skor **jauh lebih rendah**, kelesuan, ketidakterlibatan." }, { id: "Tidak ada alat khusus — mengandalkan **intuisi & pengalaman klinis**." }, { id: "Pada **cedera otak, psikosis**, masalah emosional: nilai tingkat motivasi & adanya **depresi**." }, { id: "Meyakinkan klien bahwa depresi setelah **cedera otak traumatis** itu **wajar & umum** dapat memberi kelegaan." }] },
    { t: "judul", id: "Kondisi optimal vs kondisi standar" },
    { t: "banding", kiri: { judul: { id: "Kondisi optimal (Heaton, 1981)" }, warna: "green", poin: [{ id: "Tujuan: **kinerja terbaik** yang bisa dicapai pasien" }, { id: "Bebas gangguan" }, { id: "Suasana emosional **tidak mengancam**" }, { id: "Terlindung dari **kelelahan**" }] }, kanan: { judul: { id: "Kondisi standar" }, warna: "blue", poin: [{ id: "Administrasi **seragam**: kata-kata, ruangan, prosedur" }, { id: "Wajib untuk tes ber-skoring baku (**WAIS**)" }, { id: "Situasi nyaris identik → perbedaan respons mencerminkan **karakteristik individu**" }] } },
    { t: "catatan", gaya: "faidah", id: "Keduanya **tidak bertentangan**: kondisi standar mengatur **apa** yang diucapkan dan dilakukan; kondisi optimal mengatur **suasana** agar pasien mampu menampilkan kemampuan terbaiknya di dalam aturan itu." },
    { t: "judul", id: "Kesehatan pasien" },
    { t: "catatan", gaya: "tanbih", id: "Banyak tes dirancang untuk menilai gangguan psikologis pada orang yang **sehat secara medis**. Pada pasien sakit fisik, skor bisa terdistorsi oleh **penyakitnya** (Healthy Psychology Associates, 1997) — mis. item kelelahan & gangguan tidur pada inventori depresi bisa tinggi karena **kanker atau tiroid**, bukan depresi. Hati-hati menafsirkan pasien dengan **diagnosis ganda**." },
    { t: "judul", id: "Kecemasan tes" },
    { t: "anim", jenis: "siklus", judul: { id: "Lingkaran kecemasan tes" }, pusat: { id: "Kecemasan" }, item: [
      { judul: { id: "Penguji kaku" }, ket: { id: "Jawaban singkat, tanpa senyum (demi standar)" } }, { judul: { id: "Pasien menduga gagal" }, ket: { id: "\"Pasti saya salah\"" } },
      { judul: { id: "Cemas meningkat" }, ket: { id: "Terutama pasien bermasalah memori" } }, { judul: { id: "Performa turun" }, ket: { id: "Skor di bawah kemampuan sebenarnya" } }
    ], ket: { id: "Memutus lingkaran: suasana **percakapan santai**, dorongan halus agar pasien tetap merespons, dan ucapan \"bagus\" / \"kamu melakukannya dengan baik\" **sepanjang tes — bukan hanya setelah jawaban benar** (agar tidak membocorkan benar-salah). Ini juga mengurangi **ketimpangan kuasa** psikolog–klien." } },
    { t: "judul", id: "Bias budaya & bahasa" },
    { t: "daftar", item: [{ id: "Sebagian pasien sulit memahami instruksi standar berbahasa Inggris." }, { id: "Instruksi tambahan dalam bahasa lain; **penerjemah** bila perlu." }, { id: "Minta pasien **mengulang instruksi** untuk memastikan pemahaman." }, { id: "Pada tes IQ, perbanyak teknik **non-verbal** untuk mengurangi hambatan bahasa." }] },
    { t: "judul", id: "Perspektif Islam" },
    { t: "poin", item: [
      { ikon: "door", judul: { id: "Khalwat" }, id: "Hindari pasien **berduaan** dengan lawan jenis non-mahram, atau bila hal itu menimbulkan kecemasan." },
      { ikon: "lock", judul: { id: "Pintu sedikit terbuka" }, id: "Pasien boleh meminta pintu sedikit terbuka — kenyamanan tetap, privasi terjaga." },
      { ikon: "user", judul: { id: "Klien bercadar" }, id: "Perempuan bercadar (niqab) mungkin lebih leluasa dengan **psikolog perempuan**." }
    ] },
    { t: "hadits", ar: "لَا يَخْلُوَنَّ رَجُلٌ بِامْرَأَةٍ إِلَّا مَعَ ذِي مَحْرَمٍ", id: "Janganlah seorang laki-laki berduaan dengan seorang perempuan kecuali bersama mahramnya.", src: "HR. Al-Bukhari no. 5233 & Muslim no. 1341" },
    { t: "ringkasan", item: [{ id: "Motivasi rendah → skor jauh lebih rendah; nilai depresi pada cedera otak/psikosis." }, { id: "Heaton (1981): kondisi optimal untuk kinerja terbaik; tetap dalam kondisi standar." }, { id: "Penyakit fisik dapat mendistorsi skor; hati-hati diagnosis ganda." }, { id: "Kurangi kecemasan: santai, dorongan merata sepanjang tes." }, { id: "Budaya & bahasa: penerjemah, ulang instruksi, non-verbal." }, { id: "Islam: hindari khalwat, pintu sedikit terbuka, psikolog sesama gender bila perlu." }] },
    { t: "cek", q: { id: "Penguji hanya berkata “bagus” setiap kali pasien menjawab benar. Masalahnya adalah…" }, o: [{ id: "Tidak ada masalah" }, { id: "Pasien bisa menebak benar-salah dari pujian, sehingga administrasi tidak standar; pujian sebaiknya merata sepanjang tes" }, { id: "Melanggar informed consent" }, { id: "Menurunkan motivasi" }], j: 1, b: { id: "Dorongan diberikan **sepanjang tes**, bukan hanya setelah jawaban benar." } }
  ],
  istilah: [
    { t: "Motivasi tes", id: "Kesungguhan pasien saat dites; memengaruhi skor." },
    { t: "Kondisi optimal", id: "Lingkungan untuk kinerja terbaik (Heaton, 1981)." },
    { t: "Kondisi standar", id: "Administrasi seragam untuk semua pasien." },
    { t: "Diagnosis ganda", id: "Kondisi medis & psikologis bersamaan." },
    { t: "Test anxiety", id: "Kecemasan saat dites yang menurunkan performa." },
    { t: "Power imbalance", id: "Ketimpangan kuasa psikolog–klien." },
    { t: "Khalwat", id: "Berduaan dengan lawan jenis non-mahram." }
  ],
  latihan: {
    pg: [
      { q: { id: "Pasien pasca-cedera otak traumatis mendapat skor memori sangat rendah, tampak lesu dan sering berkata “percuma”. Langkah klinis yang PALING tepat adalah…" }, o: [{ id: "Langsung menyimpulkan amnesia berat" }, { id: "Menilai motivasi dan kemungkinan depresi sebelum menafsirkan skor memori" }, { id: "Memberi tes yang sama tiga kali" }, { id: "Menghentikan semua asesmen" }], j: 1 },
      { q: { id: "Menurut Heaton (1981), tujuan utama pengujian adalah…" }, o: [{ id: "Menyelesaikan tes secepat mungkin" }, { id: "Mendapatkan kinerja terbaik yang dapat dicapai pasien" }, { id: "Membuat pasien merasa tertantang" }, { id: "Mendapatkan skor serendah mungkin" }], j: 1 },
      { q: { id: "Mengapa WAIS menuntut kondisi standar yang ketat?" }, o: [{ id: "Agar pasien tidak bosan" }, { id: "Karena skoringnya baku sehingga perbedaan respons harus mencerminkan individu, bukan perbedaan prosedur" }, { id: "Karena WAIS proyektif" }, { id: "Karena WAIS tidak punya norma" }], j: 1 },
      { q: { id: "Pasien hipotiroid berat mendapat skor tinggi pada item kelelahan dan gangguan tidur di inventori depresi. Kesimpulan yang hati-hati adalah…" }, o: [{ id: "Pasti depresi berat" }, { id: "Skor dapat dipengaruhi kondisi medis; perlu menimbang diagnosis ganda" }, { id: "Inventori tidak reliabel" }, { id: "Pasien faking bad" }], j: 1 },
      { q: { id: "Cara memberi dorongan yang TIDAK membocorkan jawaban adalah…" }, o: [{ id: "Mengangguk hanya saat jawaban benar" }, { id: "Memberi pujian merata sepanjang tes atas usaha pasien" }, { id: "Mengoreksi jawaban salah" }, { id: "Diam total" }], j: 1 },
      { q: { id: "Seorang imigran sulit memahami instruksi berbahasa Inggris pada tes IQ. Adaptasi yang dianjurkan slide, KECUALI…" }, o: [{ id: "Penerjemah atau instruksi dalam bahasanya" }, { id: "Meminta ia mengulang instruksi" }, { id: "Memperbanyak teknik non-verbal" }, { id: "Mengurangi skornya agar sesuai norma lokal" }], j: 3 },
      { q: { id: "Klien perempuan bercadar meminta pintu sedikit dibuka saat dites psikolog laki-laki. Respons yang sesuai adalah…" }, o: [{ id: "Menolak karena mengganggu kerahasiaan" }, { id: "Menyetujui; atau menawarkan psikolog perempuan bila tersedia" }, { id: "Membatalkan tes" }, { id: "Meminta ia membuka cadar" }], j: 1 }
    ],
    bs: [
      { t: { id: "Ada alat baku khusus untuk mengukur motivasi pasien saat tes." }, j: false },
      { t: { id: "Depresi setelah cedera otak traumatis adalah hal yang umum." }, j: true },
      { t: { id: "Standardisasi dapat membuat penguji tampak kaku dan meningkatkan kecemasan pasien." }, j: true },
      { t: { id: "Tes psikologis selalu valid pada pasien dengan penyakit fisik berat." }, j: false },
      { t: { id: "Pujian “bagus” sebaiknya diberikan hanya setelah jawaban benar." }, j: false }
    ],
    isian: [
      { t: { id: "Kondisi untuk mencapai kinerja terbaik pasien dikemukakan oleh ______ (1981)." }, j: { id: "Heaton" }, x: [{ id: "Lezak" }, { id: "Wechsler" }, { id: "Binet" }] },
      { t: { id: "Untuk mengurangi hambatan bahasa pada tes IQ, gunakan lebih banyak teknik ______." }, j: { id: "non-verbal" }, x: [{ id: "proyektif" }, { id: "verbal" }, { id: "tertulis" }] }
    ],
    pilah: { t: { id: "Pilah: menurunkan atau mendukung keabsahan skor?" }, kategori: [{ id: "Mendukung" }, { id: "Menurunkan" }], item: [
      { t: { id: "Ruang tes bebas gangguan" }, k: 0 }, { t: { id: "Pasien belum sarapan & lelah" }, k: 1 }, { t: { id: "Instruksi dibacakan sesuai manual" }, k: 0 }, { t: { id: "Pujian hanya saat jawaban benar" }, k: 1 }, { t: { id: "Penerjemah untuk pasien imigran" }, k: 0 }, { t: { id: "Depresi tak terdeteksi pada pasien cedera otak" }, k: 1 }
    ] }
  },
  tugas: [
    { t: { id: "Jelaskan hubungan kondisi optimal dan kondisi standar dalam pengujian." }, j: { id: "Kondisi standar menuntut administrasi seragam—kata, ruangan, prosedur—terutama untuk tes ber-skoring baku seperti WAIS, agar perbedaan respons mencerminkan karakteristik individu. Kondisi optimal (Heaton, 1981) bertujuan memperoleh kinerja terbaik pasien: lingkungan bebas gangguan, suasana tidak mengancam, dan terhindar dari kelelahan. Keduanya saling melengkapi: psikolog mengikuti skrip dan prosedur baku sambil menciptakan suasana nyaman, memberi istirahat, dan dorongan netral." } },
    { t: { id: "Bagaimana kecemasan tes muncul dan bagaimana mengurangInya tanpa merusak standardisasi?" }, j: { id: "Standardisasi membuat penguji tampak kaku—jawaban singkat, tanpa ekspresi atau senyum—sehingga pasien merasa gagal; kecemasan naik dan performa turun, terutama pada pasien bermasalah memori. Penguji dapat menjaga percakapan santai di sela tugas, memberi dorongan halus agar pasien tetap merespons, dan mengucapkan “bagus” atau “kamu melakukannya dengan baik” sepanjang tes—bukan hanya setelah jawaban benar—sehingga tidak membocorkan benar-salah dan mengurangi ketimpangan kuasa." } },
    { t: { id: "Sebutkan adaptasi budaya dan pertimbangan Islam dalam pengujian klien Muslim." }, j: { id: "Budaya/bahasa: instruksi tambahan dalam bahasa klien, penerjemah, meminta klien mengulang instruksi, dan memakai lebih banyak tugas non-verbal pada tes IQ. Islam: menghindari khalwat—klien berduaan dengan lawan jenis non-mahram—atau situasi yang membuatnya cemas; mengizinkan pintu sedikit terbuka demi kenyamanan sambil menjaga privasi; dan menyediakan psikolog perempuan bagi klien bercadar agar interaksi lebih leluasa." } }
  ]
});

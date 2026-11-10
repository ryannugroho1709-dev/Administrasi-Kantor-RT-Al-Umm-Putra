/* PPTA 301 — Modul 16: Pengujian Kecerdasan (Skala Wechsler) */
Kuliah.pertemuan("tes-psikologi", {
  no: 16, tema: 2, motif: "keping-otak", motifOpt: { lbl: "Pengujian Kecerdasan" }, durasi: 65,
  judul: { id: "Pengujian Kecerdasan: Skala Wechsler", en: "Intelligence Testing: The Wechsler Scales" },
  ringkas: { id: "Skala Wechsler: tes individual berformat **baterai**, menghasilkan **FSIQ, VIQ, PIQ**. Linimasa: **Wechsler-Bellevue 1939** → WAIS 1955 → WAIS-R 1981 → **WAIS-III 1997** (norma **2.450** orang, 16–89 th); WISC (anak ≥ 5 th). Kelebihan: memprediksi prestasi akademik, kerja, defisit neuropsikologis. Kekurangan: pelabelan, prediksi jangka pendek, bias **konvergen-analitis**, tak mengukur keterampilan praktis/sosial. Validitas WAIS-III–WAIS-R **0,86–0,94**. IQ < 70 = **2% terendah**. Interpretasi **5 tingkat**: FSIQ → VIQ/PIQ & indeks → variabilitas antarsubtes → dalam subtes → kualitatif. Islam: **'aql** anugerah Allah." },
  tujuan: [
    { id: "Menjelaskan sejarah, kelebihan, kekurangan, dan psikometri skala Wechsler." },
    { id: "Menafsirkan skor IQ dengan persentil dan rentang kesalahan." },
    { id: "Menerapkan pendekatan interpretasi lima tingkat secara hati-hati." }
  ],
  isi: [
    { t: "pembuka", id: "\"IQ Ayesha 110.\" Kalimat itu terdengar pasti — padahal yang benar: dengan keyakinan 95%, kemampuan Ayesha berada di **105–115**. Skor IQ bukan angka mati, melainkan **perkiraan dengan margin kesalahan**." },
    { t: "poin", item: [
      { ikon: "user", judul: { id: "Individual & baterai" }, id: "Diberikan satu per satu; banyak subtes membentuk skor komposit." },
      { ikon: "eye", judul: { id: "Jendela kepribadian" }, id: "Situasi tes memperlihatkan perilaku, kepercayaan diri, motivasi." },
      { ikon: "layers", judul: { id: "Tiga skor IQ" }, id: "**Full Scale IQ**, **Verbal IQ**, **Performance IQ**." }
    ] },
    { t: "anim", jenis: "garis-waktu", judul: { id: "Linimasa skala Wechsler" }, item: [
      { th: "1939", judul: { id: "Wechsler-Bellevue" }, ket: { id: "Masalah teknis, mis. reliabilitas antarsubtes." } },
      { th: "1955", judul: { id: "WAIS" }, ket: { id: "Revisi pertama." } },
      { th: "1981", judul: { id: "WAIS-R" }, ket: { id: "Pembaruan." } },
      { th: "1991", judul: { id: "WISC baru" }, ket: { id: "Untuk anak usia 5 tahun ke atas." } },
      { th: "1997", judul: { id: "WAIS-III" }, ket: { id: "Norma **2.450** orang dewasa 16–89 th, bertingkat wilayah, pendidikan, usia; kini ada norma lansia **74–89**." } }
    ] },
    { t: "banding", kiri: { judul: { id: "Kelebihan" }, warna: "green", poin: [{ id: "Memprediksi **prestasi akademik**, kinerja kerja, defisit neuropsikologis" }, { id: "Prediksi makin kuat pada pekerjaan yang menuntut kecerdasan tinggi" }, { id: "Norma sangat baik, instruksi jelas, subtes mudah diberikan" }] }, kanan: { judul: { id: "Kekurangan" }, warna: "red", poin: [{ id: "**Pelabelan** & stereotip anak; membatasi pilihan studi" }, { id: "Prediksi **jangka pendek** — fungsi saat ini saja" }, { id: "Bias pola pikir **konvergen, analitis, ilmiah** — merugikan yang kreatif" }, { id: "Tak mengukur keterampilan **praktis & sosial**; validitas ekologis lemah" }, { id: "Bisa menjadi mekanisme sosial meneruskan keuntungan pendidikan" }] } },
    { t: "catatan", gaya: "info", judul: { id: "Implikasi klinis" }, id: "Memberi **garis dasar** untuk mengukur perubahan: efektivitas program pendidikan, perubahan kognitif setelah **cedera kepala atau operasi saraf**, serta pengaruh lingkungan (gizi, sistem sekolah) pada kognisi." },
    { t: "judul", id: "Psikometri & makna skor" },
    { t: "daftar", item: [{ id: "**Reliabilitas** ditingkatkan dengan prosedur baku — instruksi dibacakan **verbatim** — dan digabung wawancara terstruktur." }, { id: "**Validitas**: korelasi WAIS-III dengan WAIS-R **0,86–0,94** per skala → mengukur konstruk yang sama." }, { id: "Skor **indeks/subtes kurang andal** dibanding IQ keseluruhan." }, { id: "Waspadai bias penilai yang **terlalu murah memberi skor**." }] },
    { t: "anim", jenis: "kurva", judul: { id: "Letak IQ pada kurva normal" }, skala: "iq", awal: -2, ket: { id: "IQ **70** (z = −2) → sekitar **2% terendah** dibanding sebayanya. IQ **130** (z = +2) → 2% tertinggi. Laporkan dalam **persentil + rentang kesalahan**." } },
    { t: "catatan", gaya: "tanbih", judul: { id: "Yang perlu diingat tentang IQ" }, id: "Hubungan teori kecerdasan dengan skala Wechsler **lemah**; IQ relatif **stabil pada dewasa** tetapi dapat berubah pada **anak**; dipengaruhi budaya, rasa ingin tahu, kepribadian; **IQ tinggi tidak menjamin sukses**." },
    { t: "judul", id: "Interpretasi lima tingkat" },
    { t: "anim", jenis: "alur", judul: { id: "Dari global ke rinci" }, item: [
      { judul: { id: "I. FSIQ" }, ket: { id: "Skor paling andal; laporkan persentil + SEM" } },
      { judul: { id: "II. VIQ–PIQ & indeks" }, ket: { id: "Uji beda p < 0,05; > 20 poin patut dicermati" } },
      { judul: { id: "III. Antarsubtes" }, ket: { id: "Kekuatan–kelemahan; hanya hipotesis" } },
      { judul: { id: "IV. Dalam subtes" }, ket: { id: "Gagal mudah, lolos sulit?" } },
      { judul: { id: "V. Kualitatif" }, ket: { id: "Isi jawaban: pola pikir konkret, kepribadian" } }
    ] },
    { t: "akordion", item: [
      { judul: { id: "Tingkat I — Full Scale IQ" }, id: "Skor tunggal **paling andal dan valid**; perkiraan global. Contoh: FSIQ 110, **95% berada di 105–115**." },
      { judul: { id: "Tingkat II — Verbal vs Performa" }, id: "Verbal = **pemahaman**; Performa = **persepsi/organisasi**. Selisih besar (mis. **> 20 poin**) bisa tanda patologi atau masalah emosional — tetap pertimbangkan konteks." },
      { judul: { id: "Tingkat III — Variabilitas antarsubtes" }, id: "Seberapa jauh tiap subtes menyimpang dari rata-rata subtes. **Kontroversial**, minim dukungan riset — perlakukan sebagai **hipotesis**. Digit span rendah: memori buruk atau **tidak termotivasi**?" },
      { judul: { id: "Tingkat IV — Variabilitas dalam subtes" }, id: "Butir disusun mudah → sulit. **Gagal di soal mudah tetapi berhasil di soal sulit** dapat menandakan pemalsuan, gangguan perhatian, atau kehilangan ingatan." },
      { judul: { id: "Tingkat V — Analisis kualitatif" }, id: "Menelaah isi respons untuk wawasan kepribadian, pola pikir konkret, dll." }
    ] },
    { t: "catatan", gaya: "faidah", id: "Makin besar **scatter** (perbedaan antarsubskala), makin **kurang bermakna** FSIQ sebagai ringkasan — kecerdasan bukan konsep sederhana." },
    { t: "ayat", ar: "أَفَلَا تَعْقِلُونَ", id: "Tidakkah kamu berpikir (menggunakan akal)?", src: "Al-Baqarah [2]: 44" },
    { t: "catatan", gaya: "hikmah", judul: { id: "Perspektif Islam: 'aql" }, id: "Allah ﷻ menganugerahkan **'aql** dan berbagai cara bernalar, termasuk lewat panca indera. Tingkat 'aql tiap orang berbeda — dipengaruhi **usia, pengalaman, budaya, pendidikan**. Menggunakan 'aql dengan benar membantu sampai pada kesimpulan yang tepat tentang kebenaran **din**." },
    { t: "ringkasan", item: [{ id: "Wechsler: individual, baterai; FSIQ, VIQ, PIQ." }, { id: "1939 → 1955 → 1981 → 1997 (norma 2.450, 16–89 th)." }, { id: "Prediktif, tetapi jangka pendek, bias konvergen, validitas ekologis lemah." }, { id: "IQ < 70 = 2% terendah; laporkan persentil + SEM." }, { id: "Lima tingkat: FSIQ → V/P → antarsubtes → dalam subtes → kualitatif." }] },
    { t: "cek", q: { id: "Klien gagal pada butir 2, 3, dan 5 subtes Informasi, tetapi benar pada butir 18–22 yang jauh lebih sulit. Tingkat interpretasi yang menyoroti pola ini adalah…" }, o: [{ id: "Tingkat I" }, { id: "Tingkat II" }, { id: "Tingkat III" }, { id: "Tingkat IV" }], j: 3, b: { id: "Pola **dalam satu subtes** = Tingkat IV; bisa menandakan pemalsuan, gangguan perhatian, atau kehilangan memori." } }
  ],
  istilah: [
    { t: "FSIQ", id: "Full Scale IQ: skor global paling andal." },
    { t: "VIQ", id: "Verbal IQ: pemahaman verbal." },
    { t: "PIQ", id: "Performance IQ: persepsi & organisasi." },
    { t: "Scatter", id: "Sebaran perbedaan antarsubtes." },
    { t: "Verbatim", id: "Dibacakan persis kata per kata." },
    { t: "Validitas ekologis", id: "Kegunaan hasil tes dalam kehidupan sehari-hari." },
    { t: "'Aql", id: "Akal; anugerah Allah untuk bernalar." }
  ],
  latihan: {
    pg: [
      { q: { id: "Cara melaporkan IQ yang paling tepat menurut slide adalah…" }, o: [{ id: "Angka tunggal tanpa keterangan" }, { id: "Peringkat persentil disertai rentang kesalahan" }, { id: "Label “jenius/bodoh”" }, { id: "Hanya skor subtes" }], j: 1 },
      { q: { id: "Klien memiliki VIQ 118 dan PIQ 92. Menurut Tingkat II, langkah paling tepat adalah…" }, o: [{ id: "Langsung simpulkan kerusakan otak kanan" }, { id: "Uji signifikansi selisih dan telusuri konteks (pendidikan, depresi, patologi)" }, { id: "Abaikan karena FSIQ normal" }, { id: "Laporkan FSIQ saja sebagai angka pasti" }], j: 1 },
      { q: { id: "Korelasi WAIS-III dengan WAIS-R sebesar 0,86–0,94 terutama menjadi bukti…" }, o: [{ id: "Reliabilitas antar-penilai" }, { id: "Kedua tes mengukur konstruk yang sama" }, { id: "Validitas ekologis" }, { id: "Bias budaya" }], j: 1 },
      { q: { id: "Seorang klien memiliki scatter subtes sangat besar (dari skor skala 4 hingga 16). Implikasinya terhadap FSIQ…" }, o: [{ id: "FSIQ makin bermakna" }, { id: "FSIQ makin kurang bermakna sebagai ringkasan kemampuan" }, { id: "FSIQ harus dinaikkan" }, { id: "Tidak ada pengaruh" }], j: 1 },
      { q: { id: "Kritik bahwa tes IQ menjadi “mekanisme sosial” berarti…" }, o: [{ id: "Tes dipakai di media sosial" }, { id: "Kelompok bernilai sama meneruskan keuntungan pendidikan kepada anak yang mirip dengan mereka" }, { id: "Tes mengukur keterampilan sosial" }, { id: "Tes dibuat oleh masyarakat" }], j: 1 },
      { q: { id: "Interpretasi variabilitas antarsubtes (Tingkat III) harus hati-hati karena…" }, o: [{ id: "Subtes terlalu mudah" }, { id: "Minim dukungan riset; satu skor rendah bisa karena motivasi, bukan kemampuan" }, { id: "Tidak ada norma subtes" }, { id: "Selalu menunjukkan pemalsuan" }], j: 1 },
      { q: { id: "Seorang seniman berbakat mendapat IQ rata-rata. Kritik tes IQ yang paling relevan adalah…" }, o: [{ id: "Prediksi jangka panjang terlalu akurat" }, { id: "Bias pada pola pikir konvergen-analitis, bukan artistik-imajinatif" }, { id: "Norma lansia tidak tersedia" }, { id: "Instruksi tidak verbatim" }], j: 1 },
      { q: { id: "Pasien pascaoperasi tumor otak dites WAIS sebelum dan 6 bulan setelah operasi. Fungsi tes IQ di sini adalah…" }, o: [{ id: "Seleksi kerja" }, { id: "Garis dasar untuk mengukur perubahan kognitif" }, { id: "Diagnosis kepribadian" }, { id: "Skrining bakat seni" }], j: 1 },
      { q: { id: "IQ 70 berarti individu berfungsi pada…" }, o: [{ id: "50% terendah" }, { id: "16% terendah" }, { id: "Sekitar 2% terendah dibanding sebayanya" }, { id: "0,1% terendah" }], j: 2 },
      { q: { id: "Pernyataan yang SALAH tentang IQ adalah…" }, o: [{ id: "Relatif stabil pada dewasa" }, { id: "Dapat berubah pada anak" }, { id: "Dipengaruhi budaya dan kepribadian" }, { id: "IQ tinggi menjamin kesuksesan" }], j: 3 }
    ],
    bs: [
      { t: { id: "Skala Wechsler pertama diterbitkan tahun 1939 sebagai Wechsler-Bellevue." }, j: true },
      { t: { id: "Skor indeks dan subtes lebih andal daripada FSIQ." }, j: false },
      { t: { id: "Norma WAIS-III mencakup orang dewasa usia 16–89 tahun." }, j: true },
      { t: { id: "Tes IQ mengukur keterampilan praktis seperti berbelanja dan interaksi sosial." }, j: false },
      { t: { id: "Instruksi Wechsler harus dibacakan verbatim." }, j: true }
    ],
    isian: [
      { t: { id: "Norma WAIS-III disusun dari ______ orang dewasa." }, j: { id: "2.450" }, x: [{ id: "1.000" }, { id: "4.500" }, { id: "600" }] },
      { t: { id: "FSIQ 110 dengan keyakinan 95% berada di rentang 105 sampai ______." }, j: { id: "115" }, x: [{ id: "120" }, { id: "112" }, { id: "130" }] }
    ],
    urut: { t: { id: "Urutkan tingkat interpretasi Wechsler" }, item: [{ id: "Full Scale IQ" }, { id: "Verbal–Performa & indeks" }, { id: "Variabilitas antarsubtes" }, { id: "Variabilitas dalam subtes" }, { id: "Analisis kualitatif" }] }
  },
  tugas: [
    { t: { id: "Uraikan kelebihan dan kekurangan tes IQ, lalu jelaskan bagaimana melaporkan skor IQ secara bertanggung jawab." }, j: { id: "Kelebihan: memprediksi prestasi akademik, kinerja kerja (makin kuat pada pekerjaan menuntut kecerdasan tinggi), mendeteksi defisit neuropsikologis, memberi garis dasar perubahan setelah cedera atau program pendidikan. Kekurangan: pelabelan dan stereotip, prediksi jangka pendek, bias pola pikir konvergen-analitis, tidak mengukur keterampilan praktis dan sosial, validitas ekologis lemah, norma kurang relevan bagi etnis tertentu atau SES rendah, dan bisa menjadi mekanisme sosial meneruskan keuntungan. Pelaporan bertanggung jawab: sajikan persentil dan rentang kesalahan (mis. FSIQ 110, 95% di 105–115), kaitkan dengan wawancara dan konteks, dan jangan menyamakan IQ dengan nilai atau masa depan seseorang." } },
    { t: { id: "Jelaskan pendekatan lima tingkat interpretasi Wechsler beserta kehati-hatian di tiap tingkat." }, j: { id: "Tingkat I: FSIQ sebagai skor paling andal, dilaporkan dengan persentil dan SEM; maknanya berkurang bila scatter besar. Tingkat II: bandingkan VIQ–PIQ dan indeks dengan uji p < 0,05; selisih besar (> 20) dapat mengisyaratkan patologi atau masalah emosional tetapi harus dibaca dalam konteks. Tingkat III: variabilitas antarsubtes untuk kekuatan–kelemahan; kontroversial, hanya hipotesis (digit span rendah bisa karena motivasi). Tingkat IV: pola dalam subtes, misalnya gagal soal mudah tetapi lolos soal sulit yang dapat menandakan pemalsuan, gangguan perhatian, atau kehilangan memori. Tingkat V: analisis kualitatif isi jawaban untuk melihat pola pikir dan kepribadian." } }
  ]
});

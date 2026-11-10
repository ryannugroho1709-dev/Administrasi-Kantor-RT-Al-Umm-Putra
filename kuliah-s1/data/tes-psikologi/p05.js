/* PPTA 301 — Modul 5: Pengantar Statistik */
Kuliah.pertemuan("tes-psikologi", {
  no: 5, tema: 2, motif: "kurva-normal", motifOpt: { lbl: "Pengantar Statistik" }, durasi: 60,
  judul: { id: "Pengantar Statistik untuk Pengujian", en: "Introduction to Statistics" },
  ringkas: { id: "Statistik **deskriptif** (meringkas) vs **inferensial** (sampel → populasi); skala pengukuran (**nominal, ordinal, interval, rasio**); distribusi frekuensi; **persentil**; **mean**; **varians & standar deviasi**; **z-score**; dan **distribusi normal standar** (mean 0, SD 1) — kunci membaca arti skor “65”." },
  tujuan: [
    { id: "Membedakan statistik deskriptif & inferensial serta empat skala pengukuran." },
    { id: "Menghitung mean, varians, SD, dan z-score secara manual." },
    { id: "Mengonversi z-score ke skor T, IQ, dan persentil dengan kurva normal." }
  ],
  isi: [
    { t: "pembuka", id: "Seseorang memperoleh skor **65** pada tes psikologi. Apa artinya? Tinggi? Rendah? **Angka mentah tidak bermakna** sampai kita tahu **rata-rata** dan **sebaran** kelompok pembandingnya. Statistik mengubah angka mentah menjadi informasi." },
    { t: "banding", judul: { id: "Dua fungsi statistik" }, kiri: { judul: { id: "Deskriptif" }, warna: "blue", poin: [{ id: "Deskripsi **ringkas** informasi kuantitatif" }, { id: "Contoh: rata-rata kelas, sebaran skor" }] }, kanan: { judul: { id: "Inferensial" }, warna: "green", poin: [{ id: "Menarik **kesimpulan logis** dari **sampel** ke **populasi**" }, { id: "Contoh: survei sampel tentang makanan favorit, bukan bertanya ke semua orang" }] } },
    { t: "judul", id: "Skala pengukuran" },
    { t: "catatan", gaya: "info", id: "**Pengukuran** = memberi angka pada objek, mengubah **kualitas** atribut menjadi **angka** — mis. \"lingkari seberapa sedih Anda, 1 (tidak sedih) sampai 10 (sangat sedih)\"." },
    { t: "tabel", kolom: ["Skala", "Info yang diberikan", "Contoh dalam psikologi"], baris: [
      ["**Nominal**", "Kategori/label saja", "Jenis kelamin, diagnosis (kode)"], ["**Ordinal**", "Urutan, jarak tidak sama", "Peringkat kelas, juara 1–2–3"],
      ["**Interval (equal interval)**", "Urutan **+ jarak sama**; nol tidak mutlak", "Skala penilaian 1–10 bila jarak 1→2 = 7→8; skor IQ"], ["**Rasio**", "Jarak sama **+ nol mutlak**", "Waktu reaksi (ms), jumlah kesalahan"]
    ] },
    { t: "catatan", gaya: "faidah", luar: true, id: "Slide menekankan skala **interval** karena kebanyakan skor tes psikologis diperlakukan sebagai interval — itulah sebabnya kita boleh menghitung mean & SD. Skala nominal & rasio ditambahkan untuk melengkapi tipologi Stevens (1946).", ref: "Stevens (1946); Kaplan & Saccuzzo, Psychological Testing, bab 2" },
    { t: "judul", id: "Distribusi, persentil, mean" },
    { t: "daftar", item: [{ id: "**Distribusi frekuensi**: tabel jumlah \"hitungan\" tiap kategori/hasil dalam sampel." }, { id: "**Persentil**: nilai yang **di bawahnya** terdapat persentase tertentu observasi — persentil ke-20 = nilai yang di bawahnya ada 20% observasi." }, { id: "**Mean**: jumlah skor ÷ banyaknya skor (μ untuk populasi; μM untuk rata-rata distribusi sampel dari mean)." }] },
    { t: "judul", id: "Varians & standar deviasi" },
    { t: "langkah", judul: { id: "Menghitung SD langkah demi langkah" }, item: [
      { judul: { id: "Hitung mean" }, id: "X̄ = ΣX ÷ n" }, { judul: { id: "Selisih & kuadratkan" }, id: "(X − X̄)² untuk setiap skor" },
      { judul: { id: "Rata-ratakan kuadrat selisih" }, id: "= **varians** (populasi: ÷ n; sampel: ÷ n−1)" }, { judul: { id: "Akar kuadrat" }, id: "SD = √varians" }
    ] },
    { t: "contoh", judul: { id: "Contoh lengkap (angka dibuat bulat)" }, id: "Skor 5 mahasiswa: **4, 6, 8, 10, 12**.\n1) Mean = 40 ÷ 5 = **8**.\n2) Selisih: −4, −2, 0, 2, 4 → kuadrat: 16, 4, 0, 4, 16 → jumlah **40**.\n3) Varians populasi = 40 ÷ 5 = **8** → SD = √8 ≈ **2,83**.\n4) Skor **12** → z = (12 − 8) ÷ 2,83 ≈ **+1,41**; skor **4** → z ≈ **−1,41**." },
    { t: "catatan", gaya: "tanbih", id: "Contoh \"Monica\" di transkrip mengandung angka yang rancu akibat penerjemahan (mis. mean \"221\"). Pegang **langkahnya**: mean → selisih kuadrat → rata-rata → akar → z = (skor − mean) ÷ SD." },
    { t: "judul", id: "Z-score & distribusi normal standar" },
    { t: "definisi", judul: { id: "Z-score" }, lughah: { id: "Ukuran posisi suatu skor **relatif terhadap mean**, dalam satuan SD: **z = (X − X̄) ÷ SD**." }, istilah: { id: "z = 0 bila skor = mean; **positif** di atas mean, **negatif** di bawah. Mengubah semua skor menjadi z menghasilkan distribusi **mean 0, SD 1** — proses ini disebut **standarisasi distribusi**." } },
    { t: "anim", jenis: "kurva", judul: { id: "Geser skor: lihat z, T, IQ, dan persentil sekaligus" }, skala: "semua", awal: 1, ket: { id: "Aturan **68–95–99,7**: ±1 SD ≈ 68%, ±2 SD ≈ 95%, ±3 SD ≈ 99,7% populasi. Rumus konversi: **T = 50 + 10z**; **IQ = 100 + 15z**. Geser ke z = −2: IQ 70, T 30, persentil ≈ 2." } },
    { t: "tabel", judul: { id: "Konversi cepat" }, kolom: ["z", "T (50, 10)", "IQ (100, 15)", "Persentil ≈"], baris: [["−2", "30", "70", "2"], ["−1", "40", "85", "16"], ["0", "50", "100", "50"], ["+1", "60", "115", "84"], ["+1,5", "65", "122,5", "93"], ["+2", "70", "130", "98"]] },
    { t: "catatan", gaya: "hikmah", luar: true, id: "Dalam Islam, menimbang dengan **adil** adalah perintah: *“Dan tegakkanlah timbangan itu dengan adil dan janganlah kamu mengurangi neraca itu”* (Ar-Rahman: 9). Mengukur manusia dengan statistik yang benar — tidak menaikkan/menurunkan makna skor — adalah bagian dari keadilan itu.", ref: "QS Ar-Rahman [55]: 9" },
    { t: "ringkasan", item: [{ id: "Deskriptif meringkas; inferensial menyimpulkan dari sampel ke populasi." }, { id: "Nominal < ordinal < interval (jarak sama) < rasio (nol mutlak)." }, { id: "SD = akar rata-rata kuadrat selisih dari mean." }, { id: "z = (X − mean) ÷ SD; distribusi z: mean 0, SD 1." }, { id: "T = 50 + 10z; IQ = 100 + 15z; ±1 SD ≈ 68%." }] },
    { t: "cek", q: { id: "Mean tes kecemasan 20, SD 4. Skor Hana 26. Berapa z-score dan skor T-nya?" }, o: [{ id: "z = +1,0; T = 60" }, { id: "z = +1,5; T = 65" }, { id: "z = +6; T = 110" }, { id: "z = −1,5; T = 35" }], j: 1, b: { id: "z = (26 − 20) ÷ 4 = **1,5**; T = 50 + 10(1,5) = **65**." } }
  ],
  istilah: [
    { t: "Statistik deskriptif", id: "Meringkas data kuantitatif." },
    { t: "Statistik inferensial", id: "Menyimpulkan populasi dari sampel." },
    { t: "Skala interval", id: "Urutan + jarak sama, tanpa nol mutlak." },
    { t: "Persentil", id: "Nilai yang di bawahnya ada % tertentu observasi." },
    { t: "Varians", id: "Rata-rata kuadrat selisih dari mean." },
    { t: "Standar deviasi", id: "Akar varians; ukuran sebaran." },
    { t: "Z-score", id: "(X − mean) ÷ SD." },
    { t: "Distribusi normal standar", id: "Distribusi normal dengan mean 0 dan SD 1." },
    { t: "Skor T", id: "Skor baku mean 50, SD 10." }
  ],
  latihan: {
    pg: [
      { q: { id: "Peneliti mensurvei 400 mahasiswa untuk menyimpulkan tingkat stres seluruh mahasiswa Indonesia. Ini contoh statistik…" }, o: [{ id: "Deskriptif" }, { id: "Inferensial" }, { id: "Nominal" }, { id: "Ordinal" }], j: 1 },
      { q: { id: "Skor 4, 6, 8, 10, 12. Berapa SD populasinya?" }, o: [{ id: "2,00" }, { id: "2,83" }, { id: "4,00" }, { id: "8,00" }], j: 1 },
      { q: { id: "Pada tes dengan mean 50 dan SD 10, skor 35 setara dengan z…" }, o: [{ id: "−1,5" }, { id: "−0,35" }, { id: "+1,5" }, { id: "−15" }], j: 0 },
      { q: { id: "Skor IQ seseorang 85. Pada skala T, skor setaranya adalah…" }, o: [{ id: "35" }, { id: "40" }, { id: "45" }, { id: "85" }], j: 1 },
      { q: { id: "Sekitar berapa persen populasi memiliki IQ antara 70 dan 130?" }, o: [{ id: "68%" }, { id: "95%" }, { id: "99,7%" }, { id: "50%" }], j: 1 },
      { q: { id: "Rudi berada di persentil ke-84 tes memori. Interpretasi yang BENAR adalah…" }, o: [{ id: "Ia menjawab benar 84% soal" }, { id: "84% kelompok norma memperoleh skor di bawahnya; kira-kira z = +1" }, { id: "Skornya 84" }, { id: "Ia lebih buruk dari 84% orang" }], j: 1 },
      { q: { id: "Dua siswa: Ani 70 di tes A (mean 60, SD 5) dan Budi 80 di tes B (mean 70, SD 20). Siapa yang relatif lebih unggul?" }, o: [{ id: "Budi, karena skornya lebih tinggi" }, { id: "Ani (z = +2) lebih unggul daripada Budi (z = +0,5)" }, { id: "Sama saja karena selisihnya 10" }, { id: "Tidak bisa dibandingkan sama sekali" }], j: 1 },
      { q: { id: "Jika setiap skor dalam kelompok ditambah 5 poin, maka…" }, o: [{ id: "Mean dan SD naik 5" }, { id: "Mean naik 5, SD tetap" }, { id: "SD naik 5, mean tetap" }, { id: "Keduanya tetap" }], j: 1 },
      { q: { id: "Waktu reaksi dalam milidetik paling tepat digolongkan skala…" }, o: [{ id: "Nominal" }, { id: "Ordinal" }, { id: "Interval" }, { id: "Rasio" }], j: 3 },
      { q: { id: "Setelah standarisasi, distribusi z memiliki…" }, o: [{ id: "Mean 50, SD 10" }, { id: "Mean 100, SD 15" }, { id: "Mean 0, SD 1" }, { id: "Mean 1, SD 0" }], j: 2 }
    ],
    bs: [
      { t: { id: "Z-score negatif berarti skor berada di bawah rata-rata." }, j: true },
      { t: { id: "Standar deviasi adalah kuadrat dari varians." }, j: false },
      { t: { id: "Persentil ke-50 pada distribusi normal sama dengan mean." }, j: true },
      { t: { id: "Pada skala interval, jarak antar angka berurutan dianggap sama." }, j: true },
      { t: { id: "Skor T 70 setara dengan 2 SD di atas rata-rata." }, j: true },
      { t: { id: "Statistik inferensial hanya meringkas data sampel tanpa menyimpulkan apa pun." }, j: false }
    ],
    isian: [
      { t: { id: "Rumus z-score: (X − ______) ÷ SD." }, j: { id: "mean" }, x: [{ id: "median" }, { id: "varians" }, { id: "n" }] },
      { t: { id: "Akar kuadrat dari varians disebut ______ deviasi." }, j: { id: "standar" }, x: [{ id: "rata-rata" }, { id: "normal" }, { id: "baku mutlak" }] },
      { t: { id: "Distribusi normal dengan mean 0 dan SD 1 disebut distribusi normal ______." }, j: { id: "standar" }, x: [{ id: "miring" }, { id: "frekuensi" }, { id: "kumulatif" }] }
    ],
    urut: { t: { id: "Urutkan langkah menghitung z-score." }, item: [{ id: "Hitung mean" }, { id: "Kurangi mean dari tiap skor & kuadratkan" }, { id: "Rata-ratakan kuadrat selisih (varians)" }, { id: "Akar kuadrat → SD" }, { id: "(Skor − mean) ÷ SD" }] },
    pilah: { t: { id: "Pilah ke skala pengukuran yang tepat" }, kategori: [{ id: "Nominal" }, { id: "Ordinal" }, { id: "Interval/Rasio" }], item: [
      { t: { id: "Kode diagnosis" }, k: 0 }, { t: { id: "Peringkat juara lomba" }, k: 1 }, { t: { id: "Skor IQ" }, k: 2 }, { t: { id: "Golongan darah" }, k: 0 }, { t: { id: "Waktu reaksi (ms)" }, k: 2 }, { t: { id: "Tingkat pendidikan SD–SMP–SMA" }, k: 1 }
    ] }
  },
  tugas: [
    { t: { id: "Hitung mean, SD (populasi), dan z-score untuk skor 3, 5, 7, 9, 11, lalu tafsirkan skor 11." }, j: { id: "Mean = 35 ÷ 5 = 7. Selisih: −4, −2, 0, 2, 4; kuadrat: 16, 4, 0, 4, 16; jumlah 40; varians = 40 ÷ 5 = 8; SD = √8 ≈ 2,83. Skor 11 → z = (11 − 7) ÷ 2,83 ≈ +1,41, setara T ≈ 64 dan persentil ≈ 92: skornya lebih tinggi dari sekitar 92% kelompok—di atas rata-rata." } },
    { t: { id: "Jelaskan mengapa skor mentah “65” tidak bermakna tanpa statistik, dan bagaimana z-score menyelesaikannya." }, j: { id: "Skor mentah hanya angka; maknanya bergantung pada rata-rata dan sebaran kelompok pembanding. Bila mean 50 dan SD 5, skor 65 sangat tinggi (z = +3); bila mean 70 dan SD 10, skor 65 di bawah rata-rata (z = −0,5). Z-score menyatakan posisi skor relatif terhadap mean dalam satuan SD, sehingga skor dari tes berbeda bisa dibandingkan dan dikonversi ke persentil, skor T, atau IQ." } }
  ]
});

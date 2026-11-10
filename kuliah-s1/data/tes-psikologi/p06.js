/* PPTA 301 — Modul 6: Norma, Reliabilitas, dan Validitas */
Kuliah.pertemuan("tes-psikologi", {
  no: 6, tema: 6, motif: "target", motifOpt: { lbl: "Norma · Reliabilitas · Validitas" }, durasi: 70,
  judul: { id: "Norma, Reliabilitas, dan Validitas", en: "Norms, Reliability, and Validity" },
  ringkas: { id: "**Standarisasi & norma** (sampel representatif, cukup besar, punya norma subkelompok; kontroversi **over-selection**; norm- vs **criterion-referenced**). **Reliabilitas** = konsistensi (klinis ≥ 0,90; riset ≥ 0,70): **test-retest, bentuk alternatif, antar-penilai**, dan **SEM**. **Validitas** = mengukur apa yang seharusnya: **konten (vs tampak), kriteria (prediktif & konkuren), konstruk (analisis faktor, konsistensi internal, konvergen–diskriminan), konseptual**. Tes bisa reliabel tanpa valid, tetapi tidak sebaliknya." },
  tujuan: [
    { id: "Menilai kelayakan sampel standarisasi dan memakai norma untuk menafsirkan skor." },
    { id: "Memilih jenis reliabilitas yang tepat dan menghitung/menafsirkan SEM." },
    { id: "Membedakan jenis-jenis validitas dan hubungan reliabilitas–validitas." }
  ],
  isi: [
    { t: "pembuka", id: "Tiga pertanyaan menentukan apakah sebuah tes layak dipercaya: **Dibandingkan dengan siapa?** (norma) — **Apakah hasilnya konsisten?** (reliabilitas) — **Apakah benar mengukur yang dimaksud?** (validitas)." },
    { t: "judul", id: "Standarisasi & norma" },
    { t: "daftar", judul: { id: "Tiga pertanyaan tentang sampel standarisasi" }, item: [{ id: "Apakah sampelnya **representatif**?" }, { id: "Apakah sampelnya **cukup besar**?" }, { id: "Apakah ada **norma subkelompok** (usia, gender, budaya)?" }] },
    { t: "catatan", gaya: "info", id: "Tes yang distandarisasi pada mahasiswa **18–22 tahun** hanya berguna untuk membandingkan mahasiswa di rentang itu. **Norma** = performa kelompok tertentu pada tes, dinyatakan dengan **z-score, persentil, mean** — memberi informasi performa **relatif** terhadap sampel standarisasi." },
    { t: "contoh", judul: { id: "Contoh norma" }, id: "Inventori kecemasan ujian diberikan kepada kelompok normatif mahasiswa; rata-rata **19**. Ayesha memperoleh **24** → kecemasan ujiannya **di atas rata-rata** kelompok norma." },
    { t: "anim", jenis: "dua-kurva", judul: { id: "Kontroversi norma: skor batas pada dua kelompok" }, a: { label: "Kelompok A", m: 46, sd: 10 }, b: { label: "Kelompok B", m: 56, sd: 10 }, cut: 55, sumbu: "skor tes bakat", geserLabel: "Geser skor batas penerimaan", labelBaca: ["Kelompok B lolos", "Kelompok A tertolak", "Kelompok A lolos", "Kelompok B tertolak"], catatan: "Bila rata-rata dua kelompok berbeda, satu skor batas meloloskan proporsi yang tak seimbang — inilah akar over-selection (60% pelamar kulit putih tetapi 75% yang diterima kulit putih).", ket: { id: "Solusi yang dibahas: **norma terpisah** per kelompok, atau beralih ke **criterion-referenced**." } },
    { t: "banding", kiri: { judul: { id: "Norm-referenced" }, warna: "amber", poin: [{ id: "Membandingkan individu dengan **norma** kelompok" }, { id: "Dapat memicu persaingan \"melampaui rata-rata\"" }] }, kanan: { judul: { id: "Criterion-referenced" }, warna: "green", poin: [{ id: "Membandingkan dengan **standar performa** yang diharapkan" }, { id: "Apa yang **bisa ditunjukkan** peserta, bukan siapa yang lebih baik" }] } },
    { t: "judul", id: "Reliabilitas: konsistensi" },
    { t: "catatan", gaya: "faidah", id: "Reliabilitas = **konsistensi** pengukuran: hasil serupa dalam kondisi yang sama (tinggi & berat badan sangat reliabel). Selalu ada **kesalahan acak**; tugas administrator meminimalkannya. Faktor: **personal** (mood, kecemasan tes yang berubah antar-sesi) dan **konstruksi tes** (konstruk diukur tak langsung — kecerdasan diamati lewat perilaku yang didefinisikan cerdas)." },
    { t: "anim", jenis: "spektrum", judul: { id: "Batas koefisien reliabilitas yang memadai" }, min: 0, max: 100, satuan: "r × 100", awal: 92, rentang: [{ label: { id: "Lemah" }, dari: 0, sampai: 69, ket: { id: "Belum memadai bahkan untuk riset." } }, { label: { id: "Cukup untuk riset" }, dari: 70, sampai: 89, ket: { id: "≥ 0,70 memadai untuk penelitian kelompok." } }, { label: { id: "Keputusan klinis individual" }, dari: 90, sampai: 100, ket: { id: "≥ 0,90 dibutuhkan untuk keputusan tentang satu orang." } }] },
    { t: "tabel", judul: { id: "Jenis reliabilitas" }, kolom: ["Jenis", "Cara", "Perhatian"], baris: [
      ["**Test-retest**", "Tes yang sama 2× pada waktu berbeda; korelasikan skor", "Jarak waktu (peristiwa hidup), **efek latihan & memori**, hanya cocok untuk variabel **stabil** — bukan kecemasan (state)"],
      ["**Bentuk alternatif/paralel**", "Dua bentuk setara pada orang yang sama", "Efek carryover; sulit menjamin **kesetaraan** (satu bentuk lebih sulit)"],
      ["**Antar-penilai (inter-rater)**", "Respons satu orang diskor 2 penilai", "Penilai ketat vs longgar; penting untuk **tes proyektif**"]
    ] },
    { t: "anim", jenis: "korelasi", judul: { id: "Koefisien reliabilitas = korelasi dua pengukuran" }, x: "Skor tes ke-1", y: "Skor tes ke-2 (retest)", awal: 0.9, ket: { id: "Makin rapat titik pada garis, makin tinggi r — makin kecil pengaruh faktor luar. Geser r ke 0,5 dan lihat betapa \"berantakannya\" urutan orang antar-sesi." } },
    { t: "judul", id: "SEM — kesalahan baku pengukuran" },
    { t: "definisi", judul: { id: "Standard Error of Measurement" }, lughah: { id: "Indeks di **manual tes** tentang besar kesalahan (\"noise\") dalam skor; dinyatakan sebagai **SD** kesalahan." }, istilah: { id: "Bila SEM tes IQ = **3**, ada **68%** kemungkinan skor sejati berada **±3** poin dari skor amatan (95% ≈ ±1,96 SEM). Rumus: **SEM = SD × √(1 − rxx)**." } },
    { t: "anim", jenis: "sem", judul: { id: "Geser reliabilitas: rentang kesalahan menyempit" }, sejati: 100, sd: 15, r: 0.9, ket: { id: "Titik merah = skor yang mungkin diperoleh orang yang **sama** bila dites berulang. r = 0,96 → SEM 3 (contoh slide). r = 0,75 → SEM 7,5 → CI 95% ≈ 85–115: cukup untuk mengubah klasifikasi!" } },
    { t: "judul", id: "Validitas: mengukur yang seharusnya" },
    { t: "anim", jenis: "target", judul: { id: "Reliabel ≠ valid" }, ket: { id: "Tes **bisa reliabel tanpa valid** (konsisten tapi meleset — tes kemampuan musik dipakai mengukur kreativitas), tetapi **tidak bisa valid tanpa reliabel**." } },
    { t: "tabel", judul: { id: "Jenis-jenis validitas" }, kolom: ["Jenis", "Pertanyaan kunci", "Bukti/cara"], baris: [
      ["**Konten**", "Apakah item mewakili & relevan dengan konstruk?", "Penilaian **ahli**; umum di tes prestasi"],
      ["**Tampak (face)**", "Apakah tes **terlihat** kredibel bagi peserta?", "Kesan **pengguna** — subjektif, bukan bukti ilmiah"],
      ["**Kriteria — prediktif**", "Apakah skor memprediksi ukuran **masa depan**?", "Korelasi tes masuk ↔ IPK tahun depan"],
      ["**Kriteria — konkuren**", "Apakah skor sejalan dengan ukuran **saat ini**?", "Korelasi tes depresi baru ↔ diagnosis klinis sekarang"],
      ["**Konstruk**", "Apakah tes mengukur **konstruk teoretis**?", "3 langkah; **analisis faktor**, konsistensi internal (subtes ↔ total), **konvergen vs diskriminan**"],
      ["**Konseptual**", "Apakah kesimpulan klinisi tentang **individu ini** akurat?", "Konstruk dikembangkan khusus untuk tiap individu dari integrasi data"]
    ] },
    { t: "langkah", judul: { id: "Validitas konstruk: 3 langkah" }, item: [{ judul: { id: "Analisis konstruk" }, id: "Uraikan dengan cermat konstruk yang diukur." }, { judul: { id: "Hipotesiskan hubungan" }, id: "Tentukan hubungan konstruk dengan variabel lain." }, { judul: { id: "Uji" }, id: "Periksa apakah hubungan yang dihipotesiskan benar-benar muncul." }] },
    { t: "catatan", gaya: "faidah", id: "**Konvergen**: berkorelasi tinggi dengan ukuran konstruk **yang sama** (tes depresi baru ↔ BDI). **Diskriminan**: berkorelasi rendah dengan konstruk **berbeda** (tes depresi ↔ kecerdasan). Subtes kecerdasan harus berkorelasi memadai dengan **Full Scale IQ**." },
    { t: "ayat", ar: "الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا", id: "Yang menciptakan mati dan hidup untuk menguji kamu, siapa di antara kamu yang lebih baik amalnya.", src: "Al-Mulk [67]: 2" },
    { t: "catatan", gaya: "hikmah", judul: { id: "Perspektif Islam" }, id: "Allah ﷻ menguji keimanan manusia (slide merujuk Al-Mulk). Analogi: seberapa **andal (reliabel)** seorang mukmin dalam berdoa dan bersabar — konsisten dalam lapang & sempit? Seberapa **sahih (valid)** klaimnya saat mengucap *Laa ilaaha illallah* — apakah amalnya membuktikan ucapannya?" },
    { t: "ringkasan", item: [{ id: "Norma butuh sampel representatif, besar, dengan norma subkelompok." }, { id: "Over-selection → norma terpisah atau criterion-referenced." }, { id: "Reliabilitas: test-retest, alternatif, antar-penilai; klinis ≥ 0,90, riset ≥ 0,70." }, { id: "SEM = SD√(1 − r); 68% skor sejati dalam ±1 SEM." }, { id: "Validitas: konten, tampak, kriteria (prediktif/konkuren), konstruk, konseptual." }, { id: "Reliabel tanpa valid mungkin; valid tanpa reliabel tidak." }] },
    { t: "cek", q: { id: "Tes IQ (SD 15) memiliki reliabilitas 0,91. Berapa SEM dan rentang 95% bagi skor amatan 110?" }, o: [{ id: "SEM 1,35; 107–113" }, { id: "SEM 4,5; ±1,96×4,5 → kira-kira 101–119" }, { id: "SEM 13,65; 83–137" }, { id: "SEM 9; 92–128" }], j: 1, b: { id: "SEM = 15 × √(1 − 0,91) = 15 × 0,3 = **4,5**; 1,96 × 4,5 ≈ 8,8 → **≈101–119**." } }
  ],
  istilah: [
    { t: "Standarisasi", id: "Prosedur & norma baku dari sampel representatif." },
    { t: "Norma", id: "Performa kelompok acuan pada tes." },
    { t: "Over-selection", id: "Proporsi yang diterima dari satu kelompok melebihi proporsinya di pelamar." },
    { t: "Criterion-referenced", id: "Dibandingkan dengan standar performa, bukan orang lain." },
    { t: "Reliabilitas", id: "Konsistensi pengukuran." },
    { t: "Test-retest", id: "Tes sama, dua waktu; untuk variabel stabil." },
    { t: "Inter-rater", id: "Kesepakatan dua penilai." },
    { t: "SEM", id: "SD × √(1 − r); sebaran kesalahan skor." },
    { t: "Validitas konten", id: "Keterwakilan item, dinilai ahli." },
    { t: "Validitas tampak", id: "Kesan kredibel bagi peserta." },
    { t: "Validitas prediktif", id: "Korelasi dengan kriteria masa depan." },
    { t: "Validitas konkuren", id: "Korelasi dengan kriteria saat ini." },
    { t: "Validitas diskriminan", id: "Korelasi rendah dengan konstruk berbeda." }
  ],
  latihan: {
    pg: [
      { q: { id: "Tes kecemasan-state (kecemasan saat ini) menunjukkan reliabilitas test-retest 0,45 dalam 3 bulan. Kesimpulan yang PALING tepat adalah…" }, o: [{ id: "Tes pasti tidak berguna" }, { id: "Test-retest kurang cocok untuk konstruk yang berfluktuasi; pakai indeks lain seperti konsistensi internal" }, { id: "Tes harus diganti dengan Rorschach" }, { id: "Reliabilitas 0,45 sudah memadai untuk diagnosis" }], j: 1 },
      { q: { id: "Dua penilai menskor respons Rorschach yang sama dengan hasil sangat berbeda. Indeks yang bermasalah adalah reliabilitas…" }, o: [{ id: "Test-retest" }, { id: "Bentuk alternatif" }, { id: "Antar-penilai" }, { id: "Konkuren" }], j: 2 },
      { q: { id: "Tes IQ dengan SD 15 dan r = 0,96. SEM-nya adalah…" }, o: [{ id: "0,6" }, { id: "3" }, { id: "6" }, { id: "14,4" }], j: 1 },
      { q: { id: "Jika reliabilitas turun dari 0,96 ke 0,64 (SD 15), SEM berubah dari 3 menjadi…" }, o: [{ id: "4" }, { id: "6" }, { id: "9" }, { id: "12" }], j: 2 },
      { q: { id: "Seorang psikolog akan memutuskan apakah seorang anak masuk kelas khusus berdasarkan satu tes. Reliabilitas minimal yang dianjurkan adalah…" }, o: [{ id: "≥ 0,50" }, { id: "≥ 0,70" }, { id: "≥ 0,90" }, { id: "Tidak penting" }], j: 2 },
      { q: { id: "Skor tes seleksi diambil Januari dan dikorelasikan dengan kinerja kerja Desember. Ini bukti validitas…" }, o: [{ id: "Konkuren" }, { id: "Prediktif" }, { id: "Tampak" }, { id: "Konten" }], j: 1 },
      { q: { id: "Tes depresi baru berkorelasi 0,78 dengan BDI tetapi hanya 0,05 dengan tes kosakata. Pola ini mendukung validitas…" }, o: [{ id: "Konten saja" }, { id: "Konvergen dan diskriminan (konstruk)" }, { id: "Tampak" }, { id: "Test-retest" }], j: 1 },
      { q: { id: "Peserta berkata, “Soal-soal ini jelas tentang kepemimpinan.” Ini menunjukkan validitas…" }, o: [{ id: "Tampak" }, { id: "Konten (dinilai ahli)" }, { id: "Prediktif" }, { id: "Konseptual" }], j: 0 },
      { q: { id: "Timbangan selalu menunjukkan berat 2 kg lebih tinggi dari sebenarnya. Timbangan itu…" }, o: [{ id: "Tidak reliabel dan tidak valid" }, { id: "Reliabel tetapi tidak valid" }, { id: "Valid tetapi tidak reliabel" }, { id: "Reliabel dan valid" }], j: 1 },
      { q: { id: "60% pelamar berasal dari kelompok X, tetapi 85% yang diterima dari kelompok X. Fenomena ini disebut…" }, o: [{ id: "Under-selection" }, { id: "Over-selection" }, { id: "Inviolacy" }, { id: "Carryover" }], j: 1 },
      { q: { id: "Validitas yang berfokus pada akurasi kesimpulan klinisi tentang satu individu unik adalah validitas…" }, o: [{ id: "Konstruk" }, { id: "Konseptual" }, { id: "Konten" }, { id: "Kriteria" }], j: 1 },
      { q: { id: "Masalah utama reliabilitas bentuk alternatif adalah…" }, o: [{ id: "Penilai berbeda" }, { id: "Menjamin kedua bentuk benar-benar setara tingkat kesulitannya" }, { id: "Tidak ada korelasi" }, { id: "Tidak bisa dipakai untuk tes kognitif" }], j: 1 }
    ],
    bs: [
      { t: { id: "Tes dapat valid meskipun tidak reliabel." }, j: false },
      { t: { id: "SEM 3 pada tes IQ berarti 68% kemungkinan skor sejati berada ±3 poin dari skor amatan." }, j: true },
      { t: { id: "Validitas tampak didasarkan pada penilaian ahli." }, j: false },
      { t: { id: "Efek latihan dapat mengganggu reliabilitas test-retest." }, j: true },
      { t: { id: "Reliabilitas ≥ 0,70 dianggap memadai untuk penelitian." }, j: true },
      { t: { id: "Criterion-referenced test membandingkan peserta dengan peringkat peserta lain." }, j: false },
      { t: { id: "Makin tinggi reliabilitas, makin besar SEM." }, j: false }
    ],
    isian: [
      { t: { id: "SEM = SD × √(1 − ______)." }, j: { id: "r" }, x: [{ id: "n" }, { id: "z" }, { id: "mean" }] },
      { t: { id: "Validitas kriteria yang membandingkan dengan ukuran masa depan disebut validitas ______." }, j: { id: "prediktif" }, x: [{ id: "konkuren" }, { id: "konten" }, { id: "tampak" }] },
      { t: { id: "Metode menentukan dimensi dasar tes, dipakai untuk validitas konstruk: analisis ______." }, j: { id: "faktor" }, x: [{ id: "regresi" }, { id: "varians" }, { id: "frekuensi" }] }
    ],
    jodoh: [
      { a: { id: "Test-retest" }, b: { id: "Tes sama, dua waktu" } }, { a: { id: "Bentuk alternatif" }, b: { id: "Dua versi setara" } }, { a: { id: "Antar-penilai" }, b: { id: "Dua penskor, satu respons" } },
      { a: { id: "Validitas konten" }, b: { id: "Keterwakilan item (ahli)" } }, { a: { id: "Validitas konkuren" }, b: { id: "Kriteria saat ini" } }, { a: { id: "Validitas diskriminan" }, b: { id: "Korelasi rendah dengan konstruk lain" } }
    ],
    pilah: { t: { id: "Pilah: bukti RELIABILITAS atau VALIDITAS?" }, kategori: [{ id: "Reliabilitas" }, { id: "Validitas" }], item: [
      { t: { id: "Korelasi skor minggu 1 dan minggu 4" }, k: 0 }, { t: { id: "Korelasi tes masuk dengan IPK" }, k: 1 }, { t: { id: "Dua penilai sepakat 0,92" }, k: 0 }, { t: { id: "Ahli menilai item mewakili kurikulum" }, k: 1 }, { t: { id: "SEM di manual tes" }, k: 0 }, { t: { id: "Analisis faktor menemukan 4 indeks" }, k: 1 }
    ] }
  },
  tugas: [
    { t: { id: "Jelaskan tiga jenis reliabilitas beserta kelemahannya, dan mengapa kecemasan tidak cocok diuji dengan test-retest." }, j: { id: "Test-retest: tes yang sama diberikan dua kali dan skornya dikorelasikan; kelemahannya jarak waktu (peristiwa hidup dapat mengubah skor), efek latihan dan memori, dan hanya cocok untuk variabel stabil. Bentuk alternatif: dua bentuk paralel diberikan pada orang yang sama; kelemahannya efek carryover dan sulit menjamin kedua bentuk setara. Antar-penilai: respons satu orang diskor dua penilai untuk melihat perbedaan penilai ketat vs longgar; penting untuk tes proyektif yang subjektif. Kecemasan (terutama state) memang berfluktuasi dari waktu ke waktu, sehingga perubahan skor mencerminkan perubahan nyata—bukan kesalahan ukur—dan koefisien test-retest menjadi rendah secara menyesatkan." } },
    { t: { id: "Hitung SEM tes IQ (SD 15) dengan r = 0,91, buat rentang 68% dan 95% untuk skor 104, lalu jelaskan maknanya bagi pelaporan." }, j: { id: "SEM = 15 × √(1 − 0,91) = 15 × 0,3 = 4,5. Rentang 68%: 104 ± 4,5 = 99,5–108,5. Rentang 95%: 104 ± 1,96 × 4,5 ≈ 104 ± 8,8 = 95–113. Artinya skor tunggal tidak pasti; laporan sebaiknya menyebut rentang (mis. “kemungkinan besar antara 95 dan 113, rentang rata-rata”), bukan satu angka, terutama bila keputusan bergantung pada batas klasifikasi." } },
    { t: { id: "Bandingkan validitas konten, tampak, kriteria, konstruk, dan konseptual; mengapa tes bisa reliabel tanpa valid?" }, j: { id: "Konten: keterwakilan & relevansi item terhadap konstruk, dinilai ahli (tes prestasi). Tampak: kesan peserta apakah tes tampak kredibel—subjektif. Kriteria: korelasi dengan ukuran eksternal yang relevan, prediktif (masa depan) atau konkuren (saat ini). Konstruk: sejauh mana tes mengukur konstruk teoretis melalui analisis konstruk, hipotesis hubungan, dan pengujian—dengan analisis faktor, konsistensi internal, konvergen–diskriminan. Konseptual: akurasi kesimpulan klinisi tentang individu unik. Tes dapat konsisten tetapi konsisten mengukur hal lain (tes musik untuk kreativitas), sehingga reliabel tanpa valid; sebaliknya tes yang tidak konsisten tidak mungkin akurat, sehingga tidak bisa valid." } }
  ]
});

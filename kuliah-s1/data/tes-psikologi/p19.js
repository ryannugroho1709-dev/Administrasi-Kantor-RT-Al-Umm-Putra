/* PPTA 301 — Modul 19: Depresi & Kecemasan — Instrumen Laporan Diri Singkat */
Kuliah.pertemuan("tes-psikologi", {
  no: 19, tema: 3, motif: "awan-pikiran", motifOpt: { lbl: "BDI & STAI" }, durasi: 60,
  judul: { id: "Mendiagnosis Depresi & Kecemasan: Instrumen Laporan Diri Singkat", en: "Brief Self-Report Measures of Depression & Anxiety" },
  ringkas: { id: "Sejak awal 1990-an kebutuhan **instrumen singkat** (< 10–15 menit) meningkat: hemat biaya, asuransi enggan membayar baterai panjang, kebutuhan riset. Kriteria memilih: relevan untuk rencana pengobatan & hasil, ≤ 15 menit, skrining, cocok untuk berbagai kelompok, mudah dipahami & ditafsirkan. **BDI** (Beck 1961; **BDI-II 1996**): 21 item skala 0–3, skor 0–63; **0–13 minimal, 14–19 ringan, 20–28 sedang, 29–63 parah**; < 4 kemungkinan menyangkal; cut-off **18** → 92% benar; perhatikan **item 9 & 2** (bunuh diri, pesimisme). **STAI**: 20 item, **state vs trait**; > 8.000 kajian. Islam: kecemasan diubah menjadi **doa**; doa *al-hamm wal-ḥazan*." },
  tujuan: [
    { id: "Menjelaskan alasan dan kriteria memilih instrumen laporan diri singkat." },
    { id: "Menskor dan menafsirkan BDI/BDI-II termasuk tanda risiko bunuh diri." },
    { id: "Membedakan kecemasan keadaan (state) dan sifat (trait) pada STAI." }
  ],
  isi: [
    { t: "pembuka", id: "Satu lembar, 21 pertanyaan, 10 menit. Dokter keluarga memakainya untuk **menyaring**, psikolog untuk menentukan **garis dasar** dan mengevaluasi terapi, perusahaan asuransi untuk **kontrol mutu**. Itulah kekuatan instrumen singkat seperti BDI." },
    { t: "judul", id: "Memilih instrumen singkat" },
    { t: "banding", kiri: { judul: { id: "Keuntungan laporan diri" }, warna: "green", poin: [{ id: "**Hemat waktu** klinisi" }, { id: "Persepsi **langsung** klien tentang kesulitannya" }] }, kanan: { judul: { id: "Risiko" }, warna: "red", poin: [{ id: "Bias persepsi klien" }, { id: "Rentan **melebihkan** atau **mengurangi** gejala" }] } },
    { t: "daftar", judul: { id: "Kriteria instrumen yang baik" }, item: [{ id: "Relevan untuk **rencana pengobatan & penilaian hasil**." }, { id: "**≤ 15 menit**." }, { id: "Berguna untuk **skrining awal**." }, { id: "Sesuai berbagai kelompok (anak vs lansia)." }, { id: "Dipahami profesional & non-profesional; mudah ditafsirkan, jelas bagi klien & keluarga." }] },
    { t: "judul", id: "Beck Depression Inventory (BDI)" },
    { t: "anim", jenis: "garis-waktu", judul: { id: "Perjalanan BDI" }, item: [
      { th: "1961", judul: { id: "BDI diperkenalkan" }, ket: { id: "A.T. Beck dkk.; item dari observasi pasien depresi." } },
      { th: "1971/1978", judul: { id: "Revisi & hak cipta" } },
      { th: "1996", judul: { id: "BDI-II" }, ket: { id: "Empat item diganti: **agitasi, merasa tak berharga, sulit konsentrasi, kehilangan energi**; membaca setara **kelas 5–6**." } }
    ] },
    { t: "poin", item: [{ ikon: "list", judul: { id: "21 item" }, id: "Intensitas tiap gejala dinilai **0–3**; 5–10 menit." }, { ikon: "check", judul: { id: "Isi" }, id: "Perasaan gagal, rasa bersalah, mudah marah, gangguan tidur, hilang nafsu makan." }, { ikon: "target", judul: { id: "Efektif" }, id: "Mendeteksi depresi **seefektif wawancara terstruktur** yang lebih mahal." }] },
    { t: "anim", jenis: "spektrum", judul: { id: "Geser skor total BDI (0–63)" }, min: 0, max: 63, satuan: "Skor BDI", awal: 22, rentang: [
      { label: { id: "Menyangkal?" }, dari: 0, sampai: 4, ket: { id: "< 4: kemungkinan menyangkal, berpura-pura baik" } },
      { label: { id: "Minimal" }, dari: 4, sampai: 14, ket: { id: "0–13: tidak ada/minimal" } },
      { label: { id: "Ringan" }, dari: 14, sampai: 20, ket: { id: "14–19" } },
      { label: { id: "Sedang" }, dari: 20, sampai: 29, ket: { id: "20–28" } },
      { label: { id: "Parah" }, dari: 29, sampai: 63, ket: { id: "29–63; skor 40–50 hanya pada depresi sangat parah" } }
    ], ket: { id: "Kelompok klinis maupun non-klinis yang depresi biasanya mendapat **14–28**." } },
    { t: "anim", jenis: "dua-kurva", judul: { id: "Cut-off 18: menyaring depresi mayor" }, min: 0, max: 63, a: { label: "Tidak depresi", m: 8, sd: 6 }, b: { label: "Depresi mayor", m: 28, sd: 8 }, cut: 18, sumbu: "skor BDI", catatan: "Dengan cut-off 18, sekitar 92% pasien depresi mayor terklasifikasi benar. Turunkan cut-off untuk skrining (lebih sedikit kasus terlewat), naikkan untuk riset yang butuh sampel pasti." },
    { t: "catatan", gaya: "tanbih", judul: { id: "Tanda bahaya: item 9 dan 2" }, id: "Skor **2 atau 3** pada **item 9** (pikiran/keinginan bunuh diri) dan **item 2** (pesimisme/putus asa) menandakan risiko bunuh diri — **tindak lanjuti segera**, apa pun skor totalnya. Skor total menilai **keparahan**; diagnosis DSM tetap harus **dikonfirmasi klinisi**." },
    { t: "tabel", judul: { id: "Psikometri BDI" }, kolom: ["Aspek", "Temuan"], baris: [
      ["Konsistensi internal", "0,73–0,92 (BDI); **0,89–0,94** (BDI-II)"],
      ["Tes-retest", "0,48–0,86 (tergantung interval & populasi)"],
      ["Validitas isi", "Konsensus klinisi + kriteria DSM-IV"],
      ["Validitas konkuren", "Sedang–tinggi dengan penilaian klinis; sedang dengan **Hamilton**"],
      ["Diskriminan", "Mampu membedakan gejala depresi dari kecemasan"]
    ] },
    { t: "judul", id: "State-Trait Anxiety Inventory (STAI)" },
    { t: "p", id: "**20 item** laporan diri; peka pada kecemasan **sementara** maupun **menetap**. Alat ukur kecemasan paling sering dipakai (**> 8.000 kajian**): fobia, kecemasan ujian, panik, **GAD**, dan evaluasi **CBT**. Tes-retest trait **0,73–0,86** (30 & 60 hari); state **lebih rendah** karena memang berfluktuasi. Validitas: 5 dari 8 domain GAD DSM-IV; korelasi dengan Manifest Anxiety Scale **0,73–0,75**; kurang terpengaruh depresi." },
    { t: "tabel", judul: { id: "Menafsirkan kombinasi state–trait" }, kolom: ["Pola", "Makna"], baris: [
      ["**Trait tinggi**", "Melihat banyak situasi sebagai ancaman; khawatir dinilai orang lain."],
      ["**State tinggi**", "Saat ini merasa cemas, gugup, tegang."],
      ["**State tinggi / Trait rendah**", "Kecemasan karena **stresor situasional** saat ini."],
      ["**Trait tinggi / State rendah**", "Tidak cemas sekarang, tetapi **cenderung** bereaksi cemas pada situasi tertentu."]
    ] },
    { t: "judul", id: "Perspektif Islam" },
    { t: "p", id: "Setiap kecemasan, ketakutan, dan kekhawatiran dapat diubah menjadi **doa**. Gunakan kecemasan sebagai jalan mendekat kepada Allah, terutama dalam **sujud**." },
    { t: "hadits", ar: "أَقْرَبُ مَا يَكُونُ الْعَبْدُ مِنْ رَبِّهِ وَهُوَ سَاجِدٌ فَأَكْثِرُوا الدُّعَاءَ", id: "Keadaan paling dekat seorang hamba dengan Rabbnya adalah ketika ia sujud, maka perbanyaklah doa.", src: "HR. Muslim no. 482" },
    { t: "hadits", ar: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْجُبْنِ وَالْبُخْلِ، وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ", id: "Ya Allah, aku berlindung kepada-Mu dari kegelisahan dan kesedihan, dari kelemahan dan kemalasan, dari sifat pengecut dan kikir, dari lilitan utang dan tekanan orang-orang.", src: "HR. al-Bukhari no. 6369" },
    { t: "tabel", kolom: ["Kata", "Makna"], baris: [
      ["**Al-Hamm**", "Gelisah tentang sesuatu yang **mungkin terjadi** — pikiran berputar-putar (mirip kecemasan/*worry*)."],
      ["**Al-Ḥazan**", "Sedih atas sesuatu yang **sudah terjadi**; *'Ām al-Ḥuzn* — tahun wafatnya Abu Thalib & Khadijah radhiyallahu 'anha."],
      ["**Al-'Ajz**", "Lemah, kehilangan daya, gagal."],
      ["**Al-Kasal**", "Malas, lesu, lamban, lalai."]
    ] },
    { t: "ringkasan", item: [{ id: "Instrumen singkat: hemat biaya, ≤ 15 menit, skrining & pemantauan." }, { id: "BDI-II: 21 item 0–3; 0–13/14–19/20–28/29–63; < 4 menyangkal." }, { id: "Cut-off 18 → 92%; item 9 & 2 = risiko bunuh diri." }, { id: "STAI 20 item: state berfluktuasi, trait stabil." }, { id: "Hamm (masa depan) vs ḥazan (masa lalu); ubah cemas menjadi doa." }] },
    { t: "cek", q: { id: "Klien mendapat skor BDI total 11, tetapi memilih jawaban “3” pada item 9. Tindakan yang tepat?" }, o: [{ id: "Abaikan, skor total minimal" }, { id: "Segera lakukan asesmen risiko bunuh diri" }, { id: "Ulangi tes bulan depan" }, { id: "Diagnosis depresi berat" }], j: 1, b: { id: "Item 9 bernilai 2–3 adalah **tanda bahaya** terlepas dari skor total." } }
  ],
  istilah: [
    { t: "BDI-II", id: "Beck Depression Inventory edisi II (1996), 21 item." },
    { t: "STAI", id: "State-Trait Anxiety Inventory, 20 item." },
    { t: "State anxiety", id: "Kecemasan sesaat, berfluktuasi." },
    { t: "Trait anxiety", id: "Kecenderungan cemas yang stabil." },
    { t: "Cut-off", id: "Skor batas untuk klasifikasi." },
    { t: "Al-Hamm", id: "Gelisah tentang masa depan." },
    { t: "Al-Ḥazan", id: "Sedih atas peristiwa yang telah terjadi." }
  ],
  latihan: {
    pg: [
      { q: { id: "Skor BDI-II klien 24. Kategori keparahannya…" }, o: [{ id: "Minimal" }, { id: "Ringan" }, { id: "Sedang" }, { id: "Parah" }], j: 2 },
      { q: { id: "Klien yang dirujuk karena percobaan bunuh diri minggu lalu mendapat skor BDI 2. Tafsiran paling tepat…" }, o: [{ id: "Klien sudah pulih" }, { id: "Kemungkinan menyangkal atau berpura-pura baik; perlu wawancara mendalam" }, { id: "Depresi ringan" }, { id: "Tes tidak berlaku untuk dewasa" }], j: 1 },
      { q: { id: "Empat item yang diganti pada BDI-II adalah…" }, o: [{ id: "Sedih, gagal, bersalah, menangis" }, { id: "Agitasi, merasa tak berharga, sulit konsentrasi, kehilangan energi" }, { id: "Nafsu makan, tidur, berat badan, libido" }, { id: "Cemas, panik, fobia, obsesi" }], j: 1 },
      { q: { id: "Reliabilitas tes-retest state anxiety lebih rendah daripada trait anxiety karena…" }, o: [{ id: "Item state lebih sedikit" }, { id: "State memang berfluktuasi mengikuti situasi" }, { id: "Peserta lupa" }, { id: "Skala state rusak" }], j: 1 },
      { q: { id: "Mahasiswa sangat cemas sesaat sebelum sidang skripsi, tetapi biasanya tenang. Pola STAI-nya…" }, o: [{ id: "State tinggi / trait rendah" }, { id: "Trait tinggi / state rendah" }, { id: "Keduanya rendah" }, { id: "Trait tinggi / state tinggi" }], j: 0 },
      { q: { id: "Menaikkan cut-off BDI dari 18 ke 25 akan…" }, o: [{ id: "Menaikkan sensitivitas" }, { id: "Menurunkan sensitivitas dan menaikkan spesifisitas" }, { id: "Tidak berpengaruh" }, { id: "Menaikkan positif palsu" }], j: 1 },
      { q: { id: "Salah satu kriteria instrumen singkat yang baik adalah…" }, o: [{ id: "Minimal 60 menit" }, { id: "Hanya dipahami psikolog" }, { id: "Relevan dengan rencana pengobatan dan penilaian hasil" }, { id: "Hanya untuk satu kelompok usia" }], j: 2 },
      { q: { id: "Klien gelisah memikirkan “bagaimana kalau saya dipecat bulan depan?” berulang-ulang. Dalam istilah doa Nabi ﷺ, ini paling dekat dengan…" }, o: [{ id: "Al-ḥazan" }, { id: "Al-hamm" }, { id: "Al-kasal" }, { id: "Al-bukhl" }], j: 1 },
      { q: { id: "Keunggulan STAI dibanding alat ukur kecemasan lain…" }, o: [{ id: "Lebih panjang sehingga akurat" }, { id: "Lebih singkat dan kurang terpengaruh oleh depresi" }, { id: "Mengukur IQ juga" }, { id: "Tidak perlu norma" }], j: 1 },
      { q: { id: "Klien dengan kemampuan baca setara kelas 3 SD diberi BDI-II. Masalahnya…" }, o: [{ id: "Tidak ada" }, { id: "BDI-II membutuhkan pemahaman baca kelas 5–6" }, { id: "BDI-II hanya untuk lansia" }, { id: "Skor otomatis parah" }], j: 1 }
    ],
    bs: [
      { t: { id: "Skor teoretis BDI berkisar 0–63." }, j: true },
      { t: { id: "Skor total BDI cukup untuk menegakkan diagnosis DSM tanpa klinisi." }, j: false },
      { t: { id: "BDI dapat membedakan gejala depresi dari gejala kecemasan." }, j: true },
      { t: { id: "STAI terdiri dari 21 item skala 0–3." }, j: false },
      { t: { id: "'Ām al-Ḥuzn adalah tahun wafatnya Abu Thalib dan Khadijah." }, j: true }
    ],
    isian: [
      { t: { id: "Cut-off BDI ______ mengklasifikasikan benar 92% pasien depresi mayor." }, j: { id: "18" }, x: [{ id: "10" }, { id: "29" }, { id: "40" }] },
      { t: { id: "Item BDI tentang pikiran bunuh diri adalah item nomor ______." }, j: { id: "9" }, x: [{ id: "1" }, { id: "13" }, { id: "21" }] },
      { t: { id: "Kecemasan yang stabil sebagai ciri kepribadian disebut ______ anxiety." }, j: { id: "trait" }, x: [{ id: "state" }, { id: "panic" }, { id: "test" }] }
    ],
    pilah: { t: { id: "Pilah skor BDI ke kategorinya" }, kategori: [{ id: "Minimal" }, { id: "Ringan" }, { id: "Sedang" }, { id: "Parah" }], item: [{ t: { id: "9" }, k: 0 }, { t: { id: "17" }, k: 1 }, { t: { id: "28" }, k: 2 }, { t: { id: "35" }, k: 3 }, { t: { id: "14" }, k: 1 }, { t: { id: "29" }, k: 3 }, { t: { id: "13" }, k: 0 }, { t: { id: "20" }, k: 2 }] }
  },
  tugas: [
    { t: { id: "Seorang klien memperoleh BDI-II 31 dengan skor 2 pada item 2 dan 3 pada item 9. Susun tafsiran dan langkah tindak lanjut." }, j: { id: "Skor 31 berada pada kategori parah (29–63). Skor 2 pada item 2 (pesimisme) dan 3 pada item 9 (keinginan bunuh diri) merupakan tanda bahaya risiko bunuh diri, sehingga perlu asesmen risiko segera (rencana, sarana, riwayat percobaan, faktor pelindung), rencana keselamatan, dan rujukan atau koordinasi dengan psikiater. BDI hanya menilai keparahan; diagnosis depresi mayor perlu dikonfirmasi lewat wawancara klinis berdasarkan kriteria DSM. BDI juga dipakai sebagai garis dasar untuk memantau efektivitas terapi." } },
    { t: { id: "Jelaskan perbedaan state dan trait anxiety pada STAI beserta empat pola tafsirannya, lalu kaitkan dengan konsep al-hamm dan al-ḥazan." }, j: { id: "State anxiety adalah kecemasan sesaat yang berfluktuasi (reliabilitas tes-retest lebih rendah); trait anxiety adalah kecenderungan cemas yang stabil (tes-retest 0,73–0,86). Trait tinggi: melihat banyak situasi sebagai ancaman; state tinggi: sedang cemas dan tegang; state tinggi/trait rendah: kecemasan akibat stresor situasional; trait tinggi/state rendah: tidak cemas kini tetapi rentan bereaksi cemas. Al-hamm adalah gelisah tentang yang mungkin terjadi (mirip worry yang berulang), sedangkan al-ḥazan adalah sedih atas yang sudah terjadi; Nabi ﷺ mengajarkan berlindung dari keduanya, dan kecemasan dapat diarahkan menjadi doa, terutama dalam sujud." } }
  ]
});

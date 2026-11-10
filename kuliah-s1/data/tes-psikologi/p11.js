/* PPTA 301 — Modul 11: Asesmen Perilaku */
Kuliah.pertemuan("tes-psikologi", {
  no: 11, tema: 9, motif: "siklus", motifOpt: { lbl: "Asesmen Perilaku" }, durasi: 55,
  judul: { id: "Asesmen Perilaku", en: "Behavioral Assessment" },
  ringkas: { id: "Asesmen perilaku menekankan **faktor situasional** dan perubahan perilaku. **Model ABC**: Antecedent–Behavior–Consequence; gangguan diekspresikan lewat **perilaku terbuka, kognisi, fisiologis, verbal**. Manfaat: relevan dengan pengobatan, banyak teknik. Keterbatasan: psikometrik lemah, bias pengamat, mahal. **4 tahap wawancara perilaku**; observasi alami (masalah **reaktivitas**); pencatatan **naratif, interval (5–30 detik), kejadian, rating**." },
  tujuan: [
    { id: "Menerapkan model ABC pada kasus perilaku." },
    { id: "Mengurutkan empat tahap wawancara perilaku." },
    { id: "Memilih metode pencatatan observasi yang tepat dan menyadari reaktivitas." }
  ],
  isi: [
    { t: "pembuka", id: "Asesmen tradisional bertanya \"**siapa** orang ini?\" (sifat, diagnosis). Asesmen perilaku bertanya \"**kapan, di mana, apa pemicunya, dan apa yang mempertahankan** perilaku ini?\" — karena jawabannya langsung menunjukkan **apa yang bisa diubah**." },
    { t: "anim", jenis: "siklus", judul: { id: "Model ABC" }, pusat: { id: "ABC" }, item: [
      { judul: { id: "A — Antecedent" }, ket: { id: "Pemicu internal/eksternal & kondisi yang melingkupi" } },
      { judul: { id: "B — Behavior" }, ket: { id: "Perilaku terbuka/tersembunyi yang diukur" } },
      { judul: { id: "C — Consequence" }, ket: { id: "Akibat yang menguatkan/melemahkan" } }
    ], ket: { id: "Contoh: **A** guru memberi soal matematika sulit → **B** anak merobek kertas → **C** anak dikeluarkan dari kelas (lepas dari tugas = penguat negatif). Mengubah **C** (tetap mengerjakan dengan bantuan) memutus siklus." } },
    { t: "poin", judul: { id: "Gangguan diekspresikan dalam berbagai bentuk" }, item: [{ ikon: "eye", judul: { id: "Perilaku terbuka" }, id: "Memukul, menghindar." }, { ikon: "brain", judul: { id: "Kognisi" }, id: "Pola pikir \"saya pasti gagal\"." }, { ikon: "heart", judul: { id: "Fisiologis" }, id: "Jantung berdebar, berkeringat." }, { ikon: "chat", judul: { id: "Verbal" }, id: "Pola ekspresi ucapan." }] },
    { t: "banding", judul: { id: "Manfaat vs keterbatasan" }, kiri: { judul: { id: "Manfaat" }, warna: "green", poin: [{ id: "**Relevan dengan pengobatan** — fokus mengubah perilaku, bukan sekadar diagnosis" }, { id: "Banyak teknik: laporan diri, observasi alami, pemantauan fisiologis, observasi terstruktur, **pemantauan diri**" }, { id: "Cocok untuk masalah yang dipengaruhi **lingkungan**" }] }, kanan: { judul: { id: "Keterbatasan" }, warna: "red", poin: [{ id: "Sifat psikometrik **lemah/belum teruji**" }, { id: "Bias pengamat, efek halo, **efek primasi**, kesepakatan antar-pengamat rendah, **bias konfirmatori**" }, { id: "Butuh banyak **waktu, tenaga, peralatan**" }] } },
    { t: "judul", id: "Empat tahap wawancara perilaku" },
    { t: "anim", jenis: "alur", judul: { id: "Dari masalah ke evaluasi" }, item: [
      { judul: { id: "1. Identifikasi masalah" }, ket: { id: "Definisikan & eksplorasi; tetapkan cara mengukur kinerja kini & perilaku target" } },
      { judul: { id: "2. Analisis masalah" }, ket: { id: "Sumber daya klien & kondisi lingkungan yang memengaruhi" } },
      { judul: { id: "3. Pelaksanaan rencana" }, ket: { id: "Intervensi diterapkan" } },
      { judul: { id: "4. Evaluasi strategi" }, ket: { id: "Apakah efektif? Ukur ulang perilaku target" } }
    ] },
    { t: "judul", id: "Observasi perilaku" },
    { t: "catatan", gaya: "faidah", id: "Perilaku harus diterjemahkan ke bahasa **spesifik & teramati** — bukan \"sedih\" atau \"apatis\", melainkan \"duduk diam > 10 menit tanpa berbicara\". Tentukan dengan jelas kapan perilaku **dimulai dan berakhir**. Alat: **penghitung golf, stopwatch, formulir kertas-pensil**." },
    { t: "daftar", judul: { id: "Setting alami" }, item: [{ id: "Rumah, kelas, taman bermain — **relevan** dengan hidup klien; efektif untuk perilaku yang sering terjadi." }, { id: "Bisa juga dibuat **terstruktur**: bermain peran atau simulasi untuk memunculkan perilaku tertentu." }, { id: "Orang di lingkungan klien (guru, orang tua) dapat **dilatih** membantu observasi." }, { id: "Keterbatasan: lama; sulit untuk perilaku **jarang** atau yang terjadi tanpa orang lain; perlu **sistem pengkodean**." }] },
    { t: "catatan", gaya: "tanbih", judul: { id: "Reaktivitas" }, id: "Partisipan **mengubah perilakunya karena sadar sedang diamati** — anak yang biasanya agresif menjadi \"manis\" saat psikolog duduk di kelas. Kurangi dengan masa adaptasi, pengamat yang sudah dikenal, atau observasi yang tidak mencolok." },
    { t: "tabel", judul: { id: "Metode pencatatan" }, kolom: ["Metode", "Cara", "Cocok untuk", "Keterbatasan"], baris: [
      ["**Naratif**", "Catat deskriptif perilaku yang menarik (\"sering tersenyum & tertawa\")", "Eksplorasi awal", "Tak bisa dikuantifikasi"],
      ["**Interval** (time/interval sampling)", "Apakah perilaku terjadi dalam interval **5–30 detik**", "Perilaku **overt** berfrekuensi **sedang**", "Harus tentukan durasi interval, cara catat, total periode"],
      ["**Kejadian (event)**", "Tunggu perilaku target terjadi, catat detailnya", "Perilaku **jarang**: agresi, salam, ucapan tertentu", "Tak memberi info **urutan/pola** keseluruhan"],
      ["**Rating (asesmen)**", "Kesan umum dimensi luas via checklist/skala", "Kerja sama, perawatan diri; analisis statistik", "Kesepakatan antar-penilai rendah; minim info A & C"]
    ] },
    { t: "catatan", gaya: "hikmah", judul: { id: "Perspektif Islam: muraqabah" }, id: "Reaktivitas mengajarkan bahwa manusia berubah ketika **merasa diawasi**. Bagaimana perilaku kita bila kita sadar **Allah ﷻ selalu mengawasi** — bukan hanya manusia? Inilah **taqwa/ihsan**: *engkau menyembah Allah seakan-akan melihat-Nya; jika tidak, sungguh Dia melihatmu* (HR. Muslim)." },
    { t: "ringkasan", item: [{ id: "Fokus situasional & perubahan; model ABC." }, { id: "Ekspresi: terbuka, kognisi, fisiologis, verbal." }, { id: "Manfaat: relevan pengobatan; keterbatasan: psikometrik lemah, bias, mahal." }, { id: "4 tahap: identifikasi → analisis → pelaksanaan → evaluasi." }, { id: "Reaktivitas; pencatatan naratif, interval, kejadian, rating." }] },
    { t: "cek", q: { id: "Psikolog ingin mencatat seberapa sering anak menggigit temannya — perilaku yang terjadi 2–3 kali seminggu. Metode yang paling tepat adalah…" }, o: [{ id: "Pencatatan interval 10 detik" }, { id: "Pencatatan kejadian (event)" }, { id: "Pencatatan naratif" }, { id: "Rating global" }], j: 1, b: { id: "Perilaku **jarang** → pencatatan kejadian." } }
  ],
  istilah: [
    { t: "Model ABC", id: "Antecedent–Behavior–Consequence." },
    { t: "Antecedent", id: "Pemicu/kondisi sebelum perilaku." },
    { t: "Consequence", id: "Akibat yang mempertahankan perilaku." },
    { t: "Reaktivitas", id: "Perubahan perilaku karena sadar diamati." },
    { t: "Interval recording", id: "Catat ada/tidaknya perilaku tiap interval 5–30 detik." },
    { t: "Event recording", id: "Catat setiap kemunculan perilaku target." },
    { t: "Narrative recording", id: "Catatan deskriptif tanpa kuantifikasi." },
    { t: "Self-monitoring", id: "Klien mencatat perilakunya sendiri." },
    { t: "Bias konfirmatori", id: "Cenderung mencari bukti yang menguatkan dugaan awal." }
  ],
  latihan: {
    pg: [
      { q: { id: "Setiap kali ibunya menelepon (A), Sari mengurung diri (B), lalu ayahnya memanjakannya dengan jajan (C). Komponen yang PALING mungkin mempertahankan perilaku adalah…" }, o: [{ id: "Telepon ibu" }, { id: "Mengurung diri" }, { id: "Dimanjakan dengan jajan" }, { id: "Kamar Sari" }], j: 2 },
      { q: { id: "Definisi perilaku yang PALING operasional adalah…" }, o: [{ id: "“Anak tampak apatis”" }, { id: "“Anak sedih”" }, { id: "“Anak duduk diam tanpa berbicara lebih dari 10 menit”" }, { id: "“Anak bermasalah”" }], j: 2 },
      { q: { id: "Perilaku mengetuk-ngetuk meja yang muncul cukup sering selama pelajaran paling tepat dicatat dengan…" }, o: [{ id: "Pencatatan interval" }, { id: "Pencatatan kejadian" }, { id: "Naratif" }, { id: "Wawancara terstruktur" }], j: 0 },
      { q: { id: "Saat psikolog hadir di kelas, Budi yang biasanya mengganggu menjadi sangat tenang. Fenomena ini disebut…" }, o: [{ id: "Efek halo" }, { id: "Reaktivitas" }, { id: "Bias konfirmatori" }, { id: "Efek primasi" }], j: 1 },
      { q: { id: "Tahap wawancara perilaku yang menilai sumber daya klien dan kondisi lingkungan adalah…" }, o: [{ id: "Identifikasi masalah" }, { id: "Analisis masalah" }, { id: "Pelaksanaan rencana" }, { id: "Evaluasi strategi" }], j: 1 },
      { q: { id: "Pengamat yang sudah yakin anak itu “nakal” cenderung hanya mencatat perilaku buruk. Ini…" }, o: [{ id: "Reaktivitas" }, { id: "Bias konfirmatori" }, { id: "Reliabilitas tinggi" }, { id: "Validitas konten" }], j: 1 },
      { q: { id: "Keterbatasan pencatatan rating menurut slide adalah…" }, o: [{ id: "Tidak bisa dianalisis statistik" }, { id: "Kesepakatan antar-penilai rendah dan minim info antecedent/consequence" }, { id: "Hanya untuk perilaku jarang" }, { id: "Tidak memakai checklist" }], j: 1 },
      { q: { id: "Keunggulan utama asesmen perilaku dibanding diagnosis tradisional adalah…" }, o: [{ id: "Psikometrik selalu lebih kuat" }, { id: "Langsung relevan untuk perubahan/pengobatan perilaku" }, { id: "Lebih murah dan cepat" }, { id: "Tidak butuh observasi" }], j: 1 }
    ],
    bs: [
      { t: { id: "Asesmen perilaku menekankan faktor situasional." }, j: true },
      { t: { id: "Pencatatan naratif menghasilkan data kuantitatif yang mudah dianalisis." }, j: false },
      { t: { id: "Interval pada pencatatan interval biasanya 5–30 detik." }, j: true },
      { t: { id: "Pencatatan kejadian memberi informasi lengkap tentang urutan perilaku." }, j: false },
      { t: { id: "Orang di lingkungan alami klien dapat dilatih membantu observasi." }, j: true }
    ],
    isian: [
      { t: { id: "Perubahan perilaku karena sadar sedang diamati disebut ______." }, j: { id: "reaktivitas" }, x: [{ id: "reliabilitas" }, { id: "regresi" }, { id: "resiliensi" }] },
      { t: { id: "Dalam model ABC, C adalah ______." }, j: { id: "consequence" }, x: [{ id: "cognition" }, { id: "context" }, { id: "criterion" }] }
    ],
    urut: { t: { id: "Urutkan tahap wawancara perilaku" }, item: [{ id: "Identifikasi masalah" }, { id: "Analisis masalah" }, { id: "Pelaksanaan rencana" }, { id: "Evaluasi strategi pengobatan" }] },
    pilah: { t: { id: "Pilah ke komponen ABC" }, kategori: [{ id: "Antecedent" }, { id: "Behavior" }, { id: "Consequence" }], item: [
      { t: { id: "Diminta mengerjakan PR" }, k: 0 }, { t: { id: "Membanting pintu" }, k: 1 }, { t: { id: "Tidak jadi mengerjakan PR" }, k: 2 }, { t: { id: "Kakak mengejek" }, k: 0 }, { t: { id: "Menangis keras" }, k: 1 }, { t: { id: "Diberi gawai agar diam" }, k: 2 }
    ] }
  },
  tugas: [
    { t: { id: "Jelaskan model ABC dan terapkan pada satu contoh perilaku anak di kelas." }, j: { id: "ABC menganalisis Antecedent (pemicu internal/eksternal dan kondisi yang melingkupi), Behavior (perilaku terbuka/tersembunyi yang diukur), dan Consequence (akibat yang menguatkan atau melemahkan). Contoh: A—guru membagikan lembar matematika sulit; B—anak merobek kertas dan berteriak; C—anak dikeluarkan dari kelas sehingga lepas dari tugas (penguatan negatif). Intervensi: memecah tugas menjadi langkah kecil (mengubah A), mengajarkan cara meminta bantuan (B alternatif), dan tetap meminta tugas diselesaikan dengan dukungan (mengubah C)." } },
    { t: { id: "Bandingkan empat metode pencatatan observasi dan kapan masing-masing dipakai." }, j: { id: "Naratif: catatan deskriptif perilaku menarik, untuk eksplorasi awal, tetapi tak bisa dikuantifikasi. Interval (time sampling): mencatat ada/tidaknya perilaku dalam interval 5–30 detik, untuk perilaku overt berfrekuensi sedang; perlu menentukan durasi interval, cara catat, dan total periode. Kejadian: menunggu perilaku target dan mencatat detailnya, untuk perilaku jarang seperti agresi atau sapaan, tetapi tak memberi urutan/pola keseluruhan. Rating: kesan umum dimensi luas (kerja sama, perawatan diri) dengan checklist/skala, memungkinkan analisis statistik, tetapi kesepakatan antar-penilai rendah dan minim info antecedent/consequence." } }
  ]
});

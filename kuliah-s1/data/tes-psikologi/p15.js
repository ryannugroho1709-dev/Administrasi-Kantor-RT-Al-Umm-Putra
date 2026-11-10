/* PPTA 301 — Modul 15: Pengujian Kepribadian — Tes Objektif (MMPI) */
Kuliah.pertemuan("tes-psikologi", {
  no: 15, tema: 1, motif: "lembar-tes", motifOpt: { lbl: "MMPI" }, durasi: 65,
  judul: { id: "Pengujian Kepribadian: Tes Objektif (MMPI)", en: "Personality Testing: Objective Tests" },
  ringkas: { id: "Tes objektif = **inventori laporan diri** kertas-pensil. **MMPI** (Hathaway & McKinley, 1939–1940-an; MMPI-2 1980-an): **567 item** benar/salah/tidak tahu, usia **≥ 16 th**, ±90 menit; **10 skala klinis** + **skala validitas** (L, F, Back F, K). Item dipilih dengan **kunci empiris**: membedakan kelompok normal vs psikiatri (contoh sakit kepala 12% vs 4%). Reliabilitas 0,71–0,84; antarskala tumpang tindih. Keterbatasan: sedikit info populasi normal, **nama skala menyesatkan**. Islam: zuhud & mengingat mati bisa menaikkan skala Depresi; iman pada yang gaib bisa disalahartikan." },
  tujuan: [
    { id: "Menjelaskan sejarah, konstruksi empiris, administrasi, dan psikometri MMPI." },
    { id: "Mengidentifikasi 10 skala klinis dan skala validitas beserta isinya." },
    { id: "Menafsirkan profil MMPI secara hati-hati, termasuk pada klien Muslim." }
  ],
  isi: [
    { t: "pembuka", id: "\"Sebagian besar waktu, kepala saya terasa sakit di seluruh bagian.\" Pernyataan sederhana ini masuk MMPI bukan karena teori, tetapi karena **data**: pasien hipokondriasis menjawab \"benar\" **12%**, orang normal hanya **4%**." },
    { t: "definisi", judul: { id: "Tes objektif" }, lughah: { id: "Biasanya **inventori laporan diri** (*self-report inventory*)." }, istilah: { id: "Berformat kertas-pensil; individu menjawab pertanyaan tentang **perilakunya sehari-hari**, dengan pilihan jawaban terbatas dan skor baku." } },
    { t: "poin", item: [
      { ikon: "note", judul: { id: "567 item" }, id: "Jawaban **benar / salah / tidak tahu** (MMPI-2)." },
      { ikon: "user", judul: { id: "Usia ≥ 16 tahun" }, id: "Instruksikan menjawab **sejujur mungkin**; ±**90 menit**." },
      { ikon: "layers", judul: { id: "10 + validitas" }, id: "10 skala klinis dan skala validitas (L, F, Back F, K)." }
    ] },
    { t: "catatan", gaya: "tanbih", judul: { id: "Lebih dari 2 jam? Waspadai…" }, id: "(1) Gangguan psikologis signifikan; (2) **kesulitan memutuskan secara obsesif**; (3) IQ di bawah rata-rata atau **kemampuan membaca buruk**; (4) **gangguan otak** (*cerebral impairment*)." },
    { t: "judul", id: "Sejarah & konstruksi" },
    { t: "p", id: "Dimulai **1939** di University of Minnesota oleh **Starke R. Hathaway** dan **J. Charnley McKinley**, untuk membantu evaluasi pasien dewasa dan menilai **perubahan akibat psikoterapi**. Tes diberikan kepada orang dewasa normal dan pasien psikiatri; **setiap item yang secara efektif membedakan kedua kelompok dimasukkan** ke skala klinis (*kunci empiris*). Kini diterjemahkan ke **lebih dari 50 bahasa**." },
    { t: "catatan", gaya: "info", judul: { id: "Mengapa antarskala tumpang tindih?" }, id: "Reliabilitas moderat (**0,71–0,84**), tetapi korelasi antarskala tinggi — satu item bisa masuk beberapa skala. Sebabnya: item dipilih karena membedakan **normal vs psikiatri**, bukan membedakan **satu gangguan dari gangguan lain**." },
    { t: "judul", id: "Sepuluh skala klinis" },
    { t: "tabel", kolom: ["No", "Skala", "Mengukur", "Item"], baris: [
      ["1", "**Hs** Hipokondriasis", "Keluhan tubuh samar (perut, punggung) meski tes medis negatif", "32"],
      ["2", "**D** Depresi", "Moral rendah, tanpa harapan, tidak puas hidup", "57"],
      ["3", "**Hy** Histeria", "Kesehatan fisik buruk, malu, sinisme (rendah), sakit kepala, neurotisme", "60"],
      ["4", "**Pd** Psikopati deviasi", "Ketidaksesuaian sosial; keluhan keluarga & otoritas; keterasingan; bosan", "50"],
      ["5", "**Mf** Maskulinitas/feminitas", "Minat, estetika, aktif–pasif; penyesuaian peran gender stereotipik", "56"],
      ["6", "**Pa** Paranoia", "Sensitivitas interpersonal, moral berlebihan, curiga; sebagian item psikotik", "40"],
      ["7", "**Pt** Psikastenia", "Kini dikenal sebagai OCD: obsesi, takut, kritik diri, rasa bersalah", "48"],
      ["8", "**Sc** Skizofrenia", "Pikiran & persepsi aneh, terasing, identitas kabur — **terbanyak**", "78"],
      ["9", "**Ma** Hipomania", "Mood naik tak stabil, ide berlompatan, grandiositas, mudah marah", "46"],
      ["0", "**Si** Introversi sosial", "Tidak nyaman & menghindari interaksi sosial", "69"]
    ] },
    { t: "judul", id: "Skala validitas: apakah ia menjawab jujur?" },
    { t: "akordion", item: [
      { judul: { id: "L — Lie (15 item)" }, id: "Sikap yang **diterima budaya tetapi jarang dimiliki** orang (mis. \"Saya tidak pernah marah\"). Skor tinggi = menampilkan diri lebih baik dari kenyataan." },
      { judul: { id: "F — (60 item)" }, id: "Huruf F **tak punya kepanjangan resmi** (sering salah disebut Infrequency). Mendeteksi pola janggal/**acak**, pikiran aneh, deskripsi diri mustahil. Tersebar hingga sekitar **item 360**; terlalu banyak F → tes **tidak valid**." },
      { judul: { id: "Back F (40 item)" }, id: "Sama seperti F, tetapi hanya di **bagian akhir** tes — mendeteksi peserta yang mulai asal menjawab." },
      { judul: { id: "K — (30 item)" }, id: "Mendeteksi psikopatologi pada orang yang hasilnya **tampak normal**; kontrol diri, hubungan keluarga; skor tinggi = **defensif**." }
    ] },
    { t: "anim", jenis: "profil", judul: { id: "Profil kasus: klien Muslim yang zuhud" }, skala: [{ k: "L", v: 58 }, { k: "F", v: 52 }, { k: "K", v: 60 }, { k: "Hs", v: 50 }, { k: "D", v: 68, n: "Depresi" }, { k: "Hy", v: 52 }, { k: "Pd", v: 45 }, { k: "Mf", v: 48 }, { k: "Pa", v: 55 }, { k: "Pt", v: 54 }, { k: "Sc", v: 66, n: "Skizofrenia" }, { k: "Ma", v: 44 }, { k: "Si", v: 57 }], batas: 65, batasLabel: "T 65", min: 30, max: 100, ket: { id: "D dan Sc melewati T 65. Wawancara menemukan: ia sering **mengingat kematian**, kurang tertarik pada dunia materi, dan meyakini **malaikat & alam gaib**. Tanpa konteks agama, profil ini mudah disalahartikan sebagai depresi atau gangguan berpikir. Ingat: **nama skala bukan diagnosis**." } },
    { t: "banding", judul: { id: "Kekuatan & keterbatasan MMPI" }, kiri: { judul: { id: "Kekuatan" }, warna: "green", poin: [{ id: "Konstruksi empiris berbasis data" }, { id: "Skala validitas mendeteksi kebohongan & acak" }, { id: "> 50 bahasa; riset sangat luas" }] }, kanan: { judul: { id: "Keterbatasan" }, warna: "red", poin: [{ id: "Sedikit info tentang **populasi normal** (fokus patologi)" }, { id: "**Nama skala menyesatkan**: Sc tinggi ≠ otomatis skizofrenia" }, { id: "Antarskala tumpang tindih" }] } },
    { t: "catatan", gaya: "hikmah", judul: { id: "Perspektif Islam" }, id: "Pandangan dunia Muslim memengaruhi cara menjawab. **Merenungkan kematian** atau **kurang minat pada dunia** dapat menaikkan skor Depresi, padahal dalam Islam itu terpuji. Keyakinan pada **malaikat & alam gaib** bisa dianggap gangguan berpikir dalam psikologi Barat. Nabi ﷺ bersabda: *\"Perbanyaklah mengingat pemutus kenikmatan (kematian).\"* (HR. at-Tirmidzi no. 2307, hasan shahih)." },
    { t: "ringkasan", item: [{ id: "Inventori laporan diri; MMPI-2: 567 item, ≥ 16 th, ±90 menit." }, { id: "Hathaway & McKinley 1939; kunci empiris normal vs psikiatri." }, { id: "10 skala klinis (Sc terbanyak 78 item) + L, F, Back F, K." }, { id: "Reliabilitas 0,71–0,84; tumpang tindih; nama skala menyesatkan." }, { id: "Konteks agama mencegah salah tafsir D & Sc." }] },
    { t: "cek", q: { id: "Seorang peserta menjawab semua item “Saya tidak pernah bergosip” dan “Saya selalu sabar” dengan BENAR. Skala yang akan meningkat adalah…" }, o: [{ id: "F" }, { id: "L" }, { id: "Back F" }, { id: "Sc" }], j: 1, b: { id: "Sikap terpuji yang jarang dimiliki orang = **skala L (Lie)**." } }
  ],
  istilah: [
    { t: "Inventori laporan diri", id: "Tes yang diisi sendiri tentang perilaku & perasaan." },
    { t: "MMPI-2", id: "Minnesota Multiphasic Personality Inventory revisi; 567 item." },
    { t: "Kunci empiris", id: "Item dipilih karena membedakan kelompok kriteria." },
    { t: "Skala L", id: "Lie: kesan diri terlalu baik." },
    { t: "Skala F", id: "Respons janggal/acak; tanpa kepanjangan resmi." },
    { t: "Back F", id: "Skala F di bagian akhir tes." },
    { t: "Skala K", id: "Defensif; psikopatologi tersembunyi." },
    { t: "Psikastenia", id: "Istilah lama untuk gejala obsesif-kompulsif." },
    { t: "T 65", id: "Ambang elevasi klinis pada MMPI-2." }
  ],
  latihan: {
    pg: [
      { q: { id: "Item MMPI dimasukkan ke skala klinis terutama karena…" }, o: [{ id: "Sesuai teori kepribadian Freud" }, { id: "Secara empiris membedakan kelompok normal dan pasien psikiatri" }, { id: "Disetujui panel ahli" }, { id: "Mudah dipahami" }], j: 1 },
      { q: { id: "Korelasi antarskala MMPI tinggi. Penyebab yang paling tepat adalah…" }, o: [{ id: "Jumlah item terlalu sedikit" }, { id: "Item dipilih untuk membedakan normal vs psikiatri, bukan antar-gangguan" }, { id: "Peserta selalu berbohong" }, { id: "Skor dihitung manual" }], j: 1 },
      { q: { id: "Seorang klien perlu 2 jam 40 menit menyelesaikan MMPI-2. Kemungkinan berikut perlu dipertimbangkan, KECUALI…" }, o: [{ id: "Kesulitan memutuskan secara obsesif" }, { id: "Kemampuan membaca rendah" }, { id: "Gangguan otak" }, { id: "Skor L yang tinggi pasti" }], j: 3 },
      { q: { id: "Skala klinis dengan jumlah item terbanyak adalah…" }, o: [{ id: "Si (69)" }, { id: "Sc (78)" }, { id: "Hy (60)" }, { id: "D (57)" }], j: 1 },
      { q: { id: "Peserta tampak menjawab dengan baik di awal, tetapi asal-asalan menjelang akhir tes. Skala yang paling peka adalah…" }, o: [{ id: "L" }, { id: "K" }, { id: "Back F" }, { id: "Mf" }], j: 2 },
      { q: { id: "Pasien mengeluh nyeri perut dan punggung bertahun-tahun meski semua pemeriksaan medis normal. Skala yang paling relevan…" }, o: [{ id: "Hs" }, { id: "Pa" }, { id: "Ma" }, { id: "Si" }], j: 0 },
      { q: { id: "Pernyataan yang BENAR tentang skala F adalah…" }, o: [{ id: "F singkatan resmi dari Frequency" }, { id: "F tidak punya kepanjangan resmi; mendeteksi pola janggal/acak" }, { id: "F mengukur feminitas" }, { id: "F hanya ada di akhir tes" }], j: 1 },
      { q: { id: "Klien dengan skor Sc T = 72 berarti…" }, o: [{ id: "Pasti didiagnosis skizofrenia" }, { id: "Ada elevasi yang perlu dikonfirmasi lewat wawancara & data lain; nama skala bukan diagnosis" }, { id: "Tes tidak valid" }, { id: "Klien berbohong" }], j: 1 },
      { q: { id: "Klien direktur perusahaan, skor klinis semua normal tetapi K sangat tinggi, dirujuk karena sering meledak marah. Tafsiran terbaik…" }, o: [{ id: "Ia sehat sepenuhnya" }, { id: "Kemungkinan defensif sehingga psikopatologi tertutupi" }, { id: "Menjawab acak" }, { id: "Skor F tinggi" }], j: 1 },
      { q: { id: "Skala yang dulu bernama psikastenia kini paling dekat dengan…" }, o: [{ id: "Skizofrenia" }, { id: "Gangguan obsesif-kompulsif" }, { id: "Hipomania" }, { id: "Introversi" }], j: 1 },
      { q: { id: "Seorang santri menjawab “benar” pada item “Saya sering memikirkan kematian” dan “Harta dunia tidak terlalu menarik bagi saya.” Implikasinya…" }, o: [{ id: "Diagnosis depresi berat" }, { id: "Skor D bisa naik karena nilai religius; perlu konfirmasi budaya" }, { id: "Skala L naik" }, { id: "Tes harus dibatalkan" }], j: 1 }
    ],
    bs: [
      { t: { id: "MMPI dikembangkan oleh Hathaway dan McKinley di University of Minnesota." }, j: true },
      { t: { id: "MMPI-2 dapat diberikan kepada anak usia 10 tahun." }, j: false },
      { t: { id: "Skala K dirancang mendeteksi psikopatologi pada individu yang tampak normal." }, j: true },
      { t: { id: "MMPI memberikan informasi yang kaya tentang kekuatan populasi normal." }, j: false },
      { t: { id: "Reliabilitas skala MMPI berkisar 0,71–0,84." }, j: true },
      { t: { id: "Skala Mf menilai kesesuaian dengan peran gender stereotipik." }, j: true }
    ],
    isian: [
      { t: { id: "MMPI-2 berisi ______ item." }, j: { id: "567" }, x: [{ id: "120" }, { id: "344" }, { id: "1000" }] },
      { t: { id: "Skala validitas yang menunjukkan kesan diri terlalu baik adalah skala ______." }, j: { id: "L" }, x: [{ id: "F" }, { id: "K" }, { id: "Si" }] },
      { t: { id: "Item sakit kepala dijawab benar oleh 12% pasien hipokondriasis dan ______% orang normal." }, j: { id: "4" }, x: [{ id: "12" }, { id: "25" }, { id: "40" }] }
    ],
    jodoh: [
      { a: { id: "Pa" }, b: { id: "Curiga, sensitivitas interpersonal" } },
      { a: { id: "Ma" }, b: { id: "Ide berlompatan, grandiositas" } },
      { a: { id: "Pd" }, b: { id: "Konflik dengan keluarga & otoritas" } },
      { a: { id: "Si" }, b: { id: "Menghindari interaksi sosial" } },
      { a: { id: "D" }, b: { id: "Tanpa harapan, moral rendah" } }
    ]
  },
  tugas: [
    { t: { id: "Jelaskan konstruksi empiris MMPI dan konsekuensinya terhadap reliabilitas serta penafsiran nama skala." }, j: { id: "Hathaway dan McKinley (1939) memberikan banyak item kepada orang normal dan pasien psikiatri; item yang secara efektif membedakan keduanya dimasukkan ke skala, misalnya item sakit kepala yang dijawab benar 12% pasien hipokondriasis vs 4% orang normal. Konsekuensinya: reliabilitas moderat (0,71–0,84) dan korelasi antarskala tinggi karena item membedakan normal vs patologis, bukan antar-gangguan; satu item dapat masuk beberapa skala. Karena itu nama skala menyesatkan—skor Sc tinggi tidak otomatis berarti skizofrenia—sehingga profil harus dikonfirmasi dengan wawancara dan data lain." } },
    { t: { id: "Uraikan empat skala validitas MMPI-2 dan jelaskan mengapa konteks agama penting dalam menafsirkan profil klien Muslim." }, j: { id: "L (15 item) menangkap upaya tampil lebih baik lewat sikap terpuji yang jarang dimiliki; F (60 item, tanpa kepanjangan resmi) menangkap pola janggal atau acak hingga sekitar item 360; Back F (40 item) mengukur hal yang sama di bagian akhir; K (30 item) menangkap sikap defensif yang menutupi psikopatologi. Pada klien Muslim, merenungkan kematian dan zuhud dapat menaikkan skala D, sedangkan iman pada malaikat dan alam gaib dapat menaikkan Sc atau dianggap gangguan berpikir. Tanpa konteks agama, klinisi bisa salah mendiagnosis; maka profil perlu dibaca bersama wawancara dan pemahaman norma budaya." } }
  ]
});

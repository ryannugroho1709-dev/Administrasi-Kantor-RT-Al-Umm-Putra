/* PPTA 301 — Modul 14: Pengujian Kepribadian — Tes Proyektif */
Kuliah.pertemuan("tes-psikologi", {
  no: 14, tema: 3, motif: "bercak", motifOpt: { lbl: "Tes Proyektif" }, durasi: 60,
  judul: { id: "Pengujian Kepribadian: Tes Proyektif", en: "Personality Testing: Projective Tests" },
  ringkas: { id: "Tes proyektif memakai **stimulus ambigu** berdasarkan **hipotesis proyektif**: cara seseorang menafsirkan stimulus mengungkap kekhawatiran, kebutuhan, konflik, keinginan & perasaannya. **Rorschach**: 10 bercak tinta simetris bilateral; skor **Lokasi–Determinan–Konten**; tradisi **Beck** (perseptual-kognitif) vs **Klopfer** (simbolis, Freud–Jung); **Exner** (1974) menyatukan menjadi *Comprehensive System* (ed. 4, 2003). Kelebihan: menembus resistensi sadar, sulit dipalsukan (masih diperdebatkan); total ±2,5 jam. Keterbatasan: pelatihan panjang, terbatas untuk anak < 14 th. **TAT**: kartu sosok manusia → cerita. Islam: stimulus Barat terasa asing; proyektif membantu melihat **nafs**." },
  tujuan: [
    { id: "Menjelaskan hipotesis proyektif dan asumsi tes Rorschach." },
    { id: "Menguraikan sistem skor, sejarah (Beck, Klopfer, Exner), kelebihan dan keterbatasan Rorschach." },
    { id: "Menjelaskan prosedur administrasi Rorschach dan TAT serta isu klien Muslim." }
  ],
  isi: [
    { t: "pembuka", id: "Bayangkan Anda diberi selembar kartu bergambar noda tinta dan ditanya: \"Ini bisa jadi apa?\" Tidak ada jawaban benar — justru karena itulah jawaban Anda bercerita banyak tentang **diri Anda**." },
    { t: "definisi", judul: { id: "Tes proyektif & hipotesis proyektif" }, lughah: { id: "Tes yang meminta respons terhadap **stimulus ambigu** (gambar, frasa) yang dapat ditafsirkan dengan banyak cara." }, istilah: { id: "**Hipotesis proyektif**: individu menafsirkan stimulus ambigu dengan cara yang mengungkapkan **kekhawatiran, kebutuhan, konflik, keinginan, dan perasaannya**." } },
    { t: "anim", jenis: "tinta", judul: { id: "Rasakan sendiri: stimulus ambigu" }, tanya: { id: "Apa yang Anda lihat? Seluruh bercak, bagian tertentu, atau ruang putihnya? Karena bentuk atau warnanya?" }, catatan: { id: "Bercak acak ini hanya ilustrasi, bukan kartu Rorschach asli. Pertanyaan di atas meniru tiga kategori skor: lokasi, determinan, konten." } },
    { t: "judul", id: "Tes Rorschach" },
    { t: "poin", item: [
      { ikon: "layers", judul: { id: "10 kartu" }, id: "Bercak tinta **simetris secara bilateral**; peserta menyebut apa yang dilihat atau diingatkan oleh bercak." },
      { ikon: "brain", judul: { id: "Tujuan" }, id: "Menilai **struktur kepribadian**: cara membangun pengalaman (**pembentukan kognitif**) dan makna yang diberikan (**imajinasi tematik**)." },
      { ikon: "info", judul: { id: "Informasi" }, id: "Motivasi, kecenderungan respons, operasi kognitif, persepsi personal & interpersonal; termasuk tes **paling banyak diteliti**." }
    ] },
    { t: "catatan", gaya: "info", judul: { id: "Asumsi" }, id: "Stimulus diorganisasi berdasarkan **kebutuhan, motif, konflik** pribadi. Kebutuhan mengorganisasi ini makin **menonjol** saat stimulus **ambigu**, sehingga peserta harus mengandalkan gambaran, ide, dan hubungan **internal**. Cara seseorang mengorganisasi bercak mencerminkan cara ia menghadapi **situasi ambigu lain** dalam hidup." },
    { t: "tabel", judul: { id: "Tiga kategori skor Rorschach" }, kolom: ["Kategori", "Pertanyaan", "Contoh"], baris: [
      ["**Lokasi**", "Area mana yang difokuskan?", "Seluruh bercak, detail kecil, ruang putih"],
      ["**Determinan**", "Ciri bercak apa yang dipakai?", "Bentuk, warna, bayangan, kesan gerak"],
      ["**Konten**", "Kategori objek apa?", "Manusia, hewan, anatomi, alam"]
    ] },
    { t: "anim", jenis: "garis-waktu", judul: { id: "Perjalanan sistem Rorschach" }, item: [
      { th: "1921", judul: { id: "Hermann Rorschach" }, ket: { id: "Mencatat respons khas berbagai populasi; norma awal untuk membedakan kelompok **klinis vs normal**." } },
      { th: "1937", judul: { id: "S.J. Beck" }, ket: { id: "Setia pada format Rorschach; menekankan proses **perseptual-kognitif**." } },
      { th: "1937", judul: { id: "B. Klopfer" }, ket: { id: "Dekat dengan teori **Freud & Jung**; respons = produk **fantasi** yang bermakna simbolis." } },
      { th: "1970-an", judul: { id: "Krisis metodologi" }, ket: { id: "75% pengguna memakai **racikan skor sendiri**; administrasi tidak baku; riset dinilai lemah." } },
      { th: "1974", judul: { id: "John Exner" }, ket: { id: "Basis data normatif luas + **sistem terpadu**: posisi duduk, instruksi, pencatatan, investigasi." } },
      { th: "2003", judul: { id: "Comprehensive System ed. 4" }, ket: { id: "Standar penilaian & interpretasi yang paling dipakai." } }
    ] },
    { t: "banding", judul: { id: "Kelebihan vs keterbatasan" }, kiri: { judul: { id: "Kelebihan" }, warna: "green", poin: [{ id: "Menembus **resistensi sadar**; menilai struktur bawah sadar" }, { id: "Pasien **borderline** bisa normal di tes terstruktur, tetapi tampak gangguan berpikir di Rorschach" }, { id: "**Sulit dipalsukan** (makna respons tidak diketahui) — masih diperdebatkan" }, { id: "Administrasi mudah (±50 menit)" }] }, kanan: { judul: { id: "Keterbatasan" }, warna: "red", poin: [{ id: "Skor ±45 menit + interpretasi ±50 menit → total **±2,5 jam**" }, { id: "Pelatihan panjang (ada program **2 semester**)" }, { id: "**25–35%** kursus tidak memakai Comprehensive System" }, { id: "Terbatas untuk anak **< 14 tahun**; tidak untuk asesmen jangka panjang" }] } },
    { t: "catatan", gaya: "faidah", judul: { id: "Enam tahap penyaringan" }, id: "Saat menyusun respons, peserta melewati **enam tahap penyaringan**: ia sebenarnya menghasilkan **lebih banyak** respons daripada yang diucapkan, lalu memilih yang dianggap paling pantas. Inilah sebabnya klaim \"tidak bisa dipalsukan\" masih diperdebatkan." },
    { t: "langkah", judul: { id: "Administrasi Rorschach" }, item: [
      { judul: { id: "Kenyamanan" }, id: "Biarkan peserta nyaman — di banyak budaya tes identik dengan kecemasan." },
      { judul: { id: "Instruksi" }, id: "\"Ceritakan semua yang Anda lihat\" atau \"Menurut Anda, ini bisa jadi apa?\" — **kebebasan maksimal**." },
      { judul: { id: "Fase respons" }, id: "Tak ada jawaban benar/salah; catat **waktu respons pertama** tiap kartu." },
      { judul: { id: "Fase investigasi" }, id: "**Setelah ke-10 kartu** selesai: klarifikasi lokasi & determinan tiap respons." }
    ] },
    { t: "judul", id: "Thematic Apperception Test (TAT)" },
    { t: "p", id: "Alat proyektif untuk menilai **pola berpikir, sikap, kapasitas observasi, dan respons emosional**. Kartu menampilkan **sosok manusia** dalam berbagai situasi; klien menceritakan kisah yang memuat:" },
    { t: "anim", jenis: "alur", judul: { id: "Kerangka cerita TAT" }, item: [{ judul: { id: "Sebelumnya" }, ket: { id: "Apa yang terjadi sebelum adegan?" } }, { judul: { id: "Peristiwa" }, ket: { id: "Apa yang tampak di gambar?" } }, { judul: { id: "Pikiran & perasaan" }, ket: { id: "Apa yang dirasakan tokoh?" } }, { judul: { id: "Akhir" }, ket: { id: "Bagaimana kisahnya berakhir?" } }] },
    { t: "catatan", gaya: "hikmah", judul: { id: "Perspektif Islam" }, id: "Klien Muslim yang terdidik di lingkungan Islam menunjukkan respons **berbeda dari norma Barat**. Stimulus TAT sering menggambarkan orang & lingkungan **Barat** yang terasa asing, sehingga cerita bisa lebih mencerminkan **stereotip tentang Barat** daripada pengalaman pribadi (Ahmed & Amer, *Counseling Muslims*). Namun tes proyektif dapat membantu melihat ke dalam **nafs** — keinginan, fantasi, dan tujuan yang tak tampak di kesadaran." },
    { t: "ringkasan", item: [{ id: "Hipotesis proyektif: tafsir stimulus ambigu mengungkap diri." }, { id: "Rorschach: 10 kartu; Lokasi–Determinan–Konten." }, { id: "Beck (kognitif) vs Klopfer (simbolis) → Exner Comprehensive System." }, { id: "Kelebihan: tembus resistensi; keterbatasan: lama, pelatihan berat, anak < 14 th." }, { id: "TAT: cerita sebelum–peristiwa–perasaan–akhir; hati-hati stimulus Barat." }] },
    { t: "cek", q: { id: "Peserta berkata, “Ini kelelawar — karena warnanya hitam dan sayapnya terbentang.” Kata “warnanya hitam” dinilai dalam kategori…" }, o: [{ id: "Lokasi" }, { id: "Determinan" }, { id: "Konten" }, { id: "Investigasi" }], j: 1, b: { id: "Ciri bercak yang dipakai (warna, bentuk) = **determinan**; \"kelelawar\" = konten (hewan)." } }
  ],
  istilah: [
    { t: "Hipotesis proyektif", id: "Tafsir stimulus ambigu mencerminkan kebutuhan & konflik batin." },
    { t: "Rorschach", id: "Tes 10 bercak tinta simetris bilateral." },
    { t: "Lokasi", id: "Area bercak yang difokuskan." },
    { t: "Determinan", id: "Ciri bercak (warna, bentuk) yang mendasari respons." },
    { t: "Konten", id: "Kategori objek dalam respons." },
    { t: "Comprehensive System", id: "Sistem terpadu Exner untuk skor & interpretasi." },
    { t: "Fase investigasi", id: "Klarifikasi respons setelah semua kartu diberikan." },
    { t: "TAT", id: "Thematic Apperception Test: bercerita dari kartu bergambar." }
  ],
  latihan: {
    pg: [
      { q: { id: "Dasar teoretis tes proyektif adalah…" }, o: [{ id: "Asumsi bahwa laporan diri selalu jujur" }, { id: "Hipotesis proyektif: tafsir stimulus ambigu mengungkap kebutuhan dan konflik" }, { id: "Teori dua faktor Spearman" }, { id: "Model ABC" }], j: 1 },
      { q: { id: "Respons: “Dua orang menari, terlihat dari seluruh bercak.” Bagian “seluruh bercak” dinilai sebagai…" }, o: [{ id: "Determinan" }, { id: "Konten" }, { id: "Lokasi" }, { id: "Waktu reaksi" }], j: 2 },
      { q: { id: "Pendekatan yang menekankan sifat simbolis respons sebagai produk fantasi, dekat dengan Freud dan Jung, adalah milik…" }, o: [{ id: "S.J. Beck" }, { id: "B. Klopfer" }, { id: "John Exner" }, { id: "Hathaway" }], j: 1 },
      { q: { id: "Masalah utama Rorschach pada 1970-an yang mendorong lahirnya Comprehensive System adalah…" }, o: [{ id: "Kartu terlalu sedikit" }, { id: "Mayoritas pengguna memakai racikan skor sendiri dan administrasi tidak baku" }, { id: "Tes terlalu mudah dipalsukan" }, { id: "Tidak ada yang mau memakainya" }], j: 1 },
      { q: { id: "Pasien borderline mendapat hasil normal pada inventori terstruktur tetapi menunjukkan gangguan berpikir di Rorschach. Penjelasan paling tepat adalah…" }, o: [{ id: "Rorschach tidak reliabel" }, { id: "Stimulus tak terstruktur menuntut organisasi internal sehingga gangguan berpikir lebih tampak" }, { id: "Pasien berpura-pura" }, { id: "Inventori selalu lebih valid" }], j: 1 },
      { q: { id: "Kapan fase investigasi Rorschach dilakukan?" }, o: [{ id: "Setelah setiap kartu" }, { id: "Sebelum kartu pertama" }, { id: "Setelah ke-10 kartu diberikan" }, { id: "Hanya bila peserta menolak" }], j: 2 },
      { q: { id: "Klaim bahwa Rorschach sulit dipalsukan masih diperdebatkan terutama karena…" }, o: [{ id: "Kartunya sudah tersebar di internet saja" }, { id: "Peserta melewati enam tahap penyaringan dan memilih respons yang dianggap paling pantas" }, { id: "Tidak ada skala validitas" }, { id: "Waktunya terlalu singkat" }], j: 1 },
      { q: { id: "Seorang psikolog ingin memakai Rorschach untuk anak usia 9 tahun guna memantau perubahan selama 2 tahun. Masalahnya adalah…" }, o: [{ id: "Tidak ada masalah" }, { id: "Penggunaan terbatas untuk anak di bawah 14 tahun dan tidak untuk asesmen jangka panjang" }, { id: "Rorschach hanya untuk lansia" }, { id: "Anak harus memakai MMPI" }], j: 1 },
      { q: { id: "Klien Muslim menceritakan kartu TAT bergambar pesta dansa ala Barat dengan nada menghakimi. Penafsiran yang paling hati-hati adalah…" }, o: [{ id: "Klien pasti memiliki konflik seksual" }, { id: "Cerita mungkin mencerminkan stereotip tentang budaya Barat, bukan konflik pribadi" }, { id: "Klien paranoid" }, { id: "Respons tidak valid sehingga tes diulang" }], j: 1 },
      { q: { id: "Estimasi total waktu Rorschach (administrasi, skor, interpretasi) adalah sekitar…" }, o: [{ id: "30 menit" }, { id: "1 jam" }, { id: "2,5 jam" }, { id: "6 jam" }], j: 2 }
    ],
    bs: [
      { t: { id: "Kartu Rorschach berjumlah 10 dan simetris bilateral." }, j: true },
      { t: { id: "Dalam Rorschach, pemeriksa memberi tahu jawaban yang benar setelah tiap kartu." }, j: false },
      { t: { id: "Pemeriksa mencatat waktu respons pertama pada setiap kartu." }, j: true },
      { t: { id: "Kartu TAT berupa bercak tinta abstrak." }, j: false },
      { t: { id: "Comprehensive System edisi ke-4 terbit tahun 2003." }, j: true }
    ],
    isian: [
      { t: { id: "Tiga kategori skor Rorschach: lokasi, determinan, dan ______." }, j: { id: "konten" }, x: [{ id: "frekuensi" }, { id: "latensi" }, { id: "norma" }] },
      { t: { id: "Sistem terpadu penilaian Rorschach dikembangkan oleh ______ (1974)." }, j: { id: "Exner" }, x: [{ id: "Beck" }, { id: "Klopfer" }, { id: "Murray" }] }
    ],
    urut: { t: { id: "Urutkan administrasi Rorschach" }, item: [{ id: "Membuat peserta nyaman" }, { id: "Memberi instruksi “ini bisa jadi apa?”" }, { id: "Fase respons & catat waktu" }, { id: "Fase investigasi setelah 10 kartu" }] },
    pilah: { t: { id: "Pilah komponen respons “Kupu-kupu berwarna merah di bagian tengah”" }, kategori: [{ id: "Lokasi" }, { id: "Determinan" }, { id: "Konten" }], item: [{ t: { id: "Bagian tengah" }, k: 0 }, { t: { id: "Berwarna merah" }, k: 1 }, { t: { id: "Kupu-kupu" }, k: 2 }, { t: { id: "Seluruh bercak" }, k: 0 }, { t: { id: "Bentuknya" }, k: 1 }, { t: { id: "Manusia" }, k: 2 }] }
  },
  tugas: [
    { t: { id: "Jelaskan asumsi dan sistem skor Rorschach beserta perkembangannya dari Beck & Klopfer hingga Exner." }, j: { id: "Asumsinya: stimulus diorganisasi berdasarkan kebutuhan, motif, dan konflik pribadi; kebutuhan itu makin tampak saat stimulus ambigu sehingga peserta mengandalkan gambaran internal, dan cara mengorganisasi bercak mencerminkan cara menghadapi situasi ambigu lain. Skor: lokasi (area), determinan (warna, bentuk), konten (manusia, anatomi). Beck (1937) menekankan proses perseptual-kognitif; Klopfer (1937) menekankan makna simbolis ala Freud–Jung. Tahun 1970-an 75% pengguna meracik skor sendiri dan riset dinilai lemah, maka Exner (1974) membangun basis norma luas dan sistem terpadu (Comprehensive System, ed. 4 2003)." } },
    { t: { id: "Bandingkan Rorschach dan TAT, lalu jelaskan pertimbangan memakainya pada klien Muslim." }, j: { id: "Rorschach memakai 10 bercak abstrak untuk menilai struktur kepribadian melalui lokasi, determinan, konten; TAT memakai kartu sosok manusia dan meminta cerita (sebelumnya, peristiwa, perasaan tokoh, akhir) untuk menilai pola berpikir, sikap, dan respons emosional. Keduanya bergantung pada stimulus ambigu. Pada klien Muslim, stimulus TAT yang berlatar Barat dapat memancing cerita berisi stereotip budaya, bukan konflik pribadi; norma Barat tidak bisa langsung dipakai. Meski begitu, tes proyektif dapat membantu melihat dinamika nafs—keinginan dan fantasi yang tak disadari—asal ditafsirkan dengan kepekaan budaya." } }
  ]
});

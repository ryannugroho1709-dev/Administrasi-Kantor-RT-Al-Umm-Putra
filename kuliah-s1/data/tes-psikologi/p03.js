/* PPTA 301 — Modul 3: Sejarah Pengujian Psikologi */
Kuliah.pertemuan("tes-psikologi", {
  no: 3, tema: 4, motif: "sejarah", motifOpt: { lbl: "Sejarah Pengujian Psikologi" }, durasi: 55,
  judul: { id: "Sejarah Pengujian Psikologi", en: "History of Psychological Testing" },
  ringkas: { id: "Dari **ujian pejabat Tiongkok (2200 SM)** ke laboratorium **instrumen perunggu** (Galton, Wundt, Cattell), kritik **Wissler**, **humanisme** (Esquirol, Seguin), tes kecerdasan pertama **Binet–Simon (1905)**, **Stanford-Binet (1916)**, penyalahgunaan oleh **Goddard** dan **Army Alpha/Beta**, tes pendidikan (**ETS**), analisis faktor **Thurstone**, **Woodworth Personal Data Sheet → MMPI**, hingga tes proyektif (**asosiasi kata, Rorschach 1921, TAT 1935**)." },
  tujuan: [
    { id: "Mengurutkan tonggak sejarah pengujian psikologi beserta tokohnya." },
    { id: "Menjelaskan pergeseran dari instrumen perunggu ke humanisme dan mengapa." },
    { id: "Menganalisis penyalahgunaan tes (Goddard, Army Alpha/Beta) sebagai pelajaran etika." }
  ],
  isi: [
    { t: "pembuka", id: "Sejarah tes psikologi bukan sekadar daftar nama — ia adalah kisah **mencari ukuran yang objektif**, menemukan bahwa ukuran awal **keliru**, lalu belajar bahwa tes yang sahih pun bisa **disalahgunakan**. Ketuk tiap peristiwa pada garis waktu untuk rinciannya." },
    { t: "anim", jenis: "garis-waktu", judul: { id: "Garis waktu pengujian psikologi" }, item: [
      { th: "2200 SM", judul: { id: "Ujian pejabat kekaisaran Tiongkok" }, ket: { id: "Pejabat diperiksa tiap **3 tahun**. Dinasti Han (202 SM–200 M) memperkenalkan ujian tertulis: hukum sipil, militer, pertanian, pendapatan, geografi. Kondisi melelahkan (sehari semalam di bilik terisolasi); seleksi tak sepenuhnya tepat (tulisan tangan ikut dinilai). Dihapus **1906**." } },
      { th: "1879", judul: { id: "Wundt — laboratorium psikologi pertama (Jerman)" }, ket: { id: "Mengukur kecepatan berpikir dengan **pendulum terkalibrasi** berjarum di kedua sisi (\"pengukur pikiran\")." } },
      { th: "Akhir 1800-an", judul: { id: "Galton — Bapak Pengujian Mental" }, ket: { id: "Menguji ribuan orang; tak menemukan korelasi tugas sensorik dengan kecerdasan, tetapi menunjukkan pentingnya **standardisasi**." } },
      { th: "1885", judul: { id: "Hubert von Grashey — tes memori cedera otak" }, ket: { id: "Kata/simbol/gambar digerakkan pelan di balik celah; banyak pasien mengenali stimulus biasa tetapi tidak lewat celah bergerak. (Conrad Rieger membuat tes serupa yang butuh **100 jam**!)" } },
      { th: "1890", judul: { id: "Cattell — istilah “tes mental”" }, ket: { id: "Membawa pendekatan instrumen perunggu ke AS; percaya energi tubuh = energi mental (\"hand squeezing\")." } },
      { th: "~1901", judul: { id: "Wissler membantah instrumen perunggu" }, ket: { id: "300+ mahasiswa Columbia: waktu reaksi & diskriminasi sensorik **tidak berkorelasi** dengan nilai kuliah → pergeseran ke humanisme. (Catatan: sampelnya hanya mahasiswa cerdas — rentang terbatas.)" } },
      { th: "1905", judul: { id: "Binet & Simon — tes kecerdasan pertama yang berguna" }, ket: { id: "30 item di Paris untuk mengidentifikasi anak yang tidak mendapat manfaat dari sekolah reguler; tujuan **kemanusiaan**, belum ada sistem skoring." } },
      { th: "1908 · 1911", judul: { id: "Revisi Binet: tingkat mental" }, ket: { id: "1908: 58 item + konsep **tingkat mental**, distandardisasi pada 300 anak. 1911: lima tes per tingkat usia, diperluas ke dewasa → cikal bakal **pendidikan khusus**." } },
      { th: "1910–1911", judul: { id: "Goddard menyalahgunakan Binet-Simon" }, ket: { id: "Menguji 1000+ anak; 3% dicap \"lemah pikiran\" dan diusulkan **dipisahkan dari masyarakat**." } },
      { th: "1916", judul: { id: "Terman — Stanford-Binet" }, ket: { id: "Revisi terstandar & tepat yang menjadi dasar kuat tes kecerdasan." } },
      { th: "1917–1918", judul: { id: "PD I: Army Alpha & Beta; Woodworth" }, ket: { id: "Yerkes: **Alpha** (verbal, rekrut rata-rata & unggul) dan **Beta** (non-verbal, rekrut tak berbahasa Inggris). Hasil dipakai membenarkan **pembatasan imigrasi**. Woodworth Personal Data Sheet menyaring rekrut \"neurotik\"." } },
      { th: "1910 · 1921 · 1935", judul: { id: "Tes proyektif: asosiasi kata, Rorschach, TAT" }, ket: { id: "Galton & **Jung** (asosiasi kata, 1910); **Rorschach** (1921); **Morgan & Murray** — TAT (1935)." } },
      { th: "1947", judul: { id: "ETS menggantikan CEEB" }, ket: { id: "Mengawasi **SAT** dan **GRE** hingga kini." } },
      { th: "PD II", judul: { id: "Thurstone — analisis faktor & baterai tes" }, ket: { id: "Menentukan bakat-bakat utama yang terpisah; baterai tes untuk menyeleksi rekrut posisi khusus." } }
    ] },
    { t: "judul", id: "Instrumen perunggu → humanisme" },
    { t: "banding", kiri: { judul: { id: "Psikologi instrumen perunggu" }, warna: "amber", poin: [{ id: "Eropa akhir 1800-an; pengujian di **laboratorium** agar \"objektif\" & terukur" }, { id: "Ambang sensorik & **waktu reaksi** disamakan dengan kecerdasan" }, { id: "Tokoh: Galton, Wundt, Cattell" }] }, kanan: { judul: { id: "Humanisme" }, warna: "green", poin: [{ id: "Bekerja **mendiagnosis** individu dengan gangguan mental" }, { id: "Gangguan psikiatri bisa **reversibel**, tak selalu terkait kecerdasan rendah" }, { id: "Tokoh: dokter Prancis **Esquirol & Seguin**" }] } },
    { t: "catatan", gaya: "faidah", judul: { id: "Esquirol: dua pembedaan penting" }, id: "Orang pertama yang menulis beda **keterbelakangan mental** (perkembangan seumur hidup) vs **gangguan mental** (mulai mendadak di usia dewasa). Klasifikasi pertamanya berdasar **bahasa**: (1) memakai frasa pendek, (2) hanya monosilabel, (3) hanya suara & tangisan." },
    { t: "catatan", gaya: "info", judul: { id: "Perjalanan Alfred Binet" }, id: "Belajar kelumpuhan **histeris** bersama ahli saraf **Charcot**, sempat yakin **magnetisme** menyembuhkan histeria — terbukti **salah**. Ia beralih ke studi persepsi-sensori dengan **anak-anaknya sendiri** sebagai peserta, lalu menyusun skala 20 area (bagian tubuh, bahasa lisan, menyebut benda, membaca, menulis, aritmatika)." },
    { t: "judul", id: "Penggunaan & penyalahgunaan" },
    { t: "catatan", gaya: "tanbih", id: "Tes yang dibuat Binet untuk tujuan **kemanusiaan** (membantu anak yang tertinggal) dipakai **Goddard** untuk mencap 3% anak \"lemah pikiran\" dan mengusulkan **segregasi**; hasil Army Alpha/Beta dipakai membenarkan **perbedaan etnis** dan pembatasan imigrasi — padahal Army Alpha bergantung pada **bahasa & budaya Amerika**. Pelajaran: **validitas penggunaan** sama penting dengan validitas alat." },
    { t: "tanya", q: { id: "**Analisis diri** (dari dosen): Mengapa saya belajar psikologi/ilmu pengetahuan? Minat pribadi apa yang mungkin menghalangi interpretasi atau temuan saya?" }, a: { id: "Goddard dan para peneliti era itu membawa **prasangka** ke dalam interpretasi data. Kesadaran akan bias pribadi — niat, kepentingan, budaya — adalah benteng pertama melawan penyalahgunaan tes. Dalam Islam ini terkait **ikhlas** dan **amanah ilmu**." } },
    { t: "daftar", judul: { id: "Tes nonverbal (awal 1900-an)" }, item: [{ id: "Dibuat untuk menguji **imigran** yang tidak berbahasa Inggris." }, { id: "Contoh: **Kohs Block Design** dan **Digit-Symbol Substitution** — kini menjadi subtes Wechsler." }] },
    { t: "judul", id: "Kepribadian & proyektif" },
    { t: "anim", jenis: "alur", judul: { id: "Dari daftar periksa ke MMPI" }, item: [{ judul: { id: "Woodworth Personal Data Sheet" }, ket: { id: "Daftar gejala ya/tidak (PD I)" } }, { judul: { id: "Menyaring rekrut “neurotik”" }, ket: { id: "Skrining massal" } }, { judul: { id: "MMPI" }, ket: { id: "Meminjam format daftar periksa; dipakai hingga kini" } }] },
    { t: "catatan", gaya: "faidah", judul: { id: "Hipotesis proyektif" }, id: "Saat merespons stimulus **ambigu/tak terstruktur**, responden **tanpa sadar** mengungkap kebutuhan, fantasi, dan konflik terdalamnya. TAT: membuat cerita dari gambar dengan emosi & perasaan." },
    { t: "ringkasan", item: [{ id: "2200 SM Tiongkok → dihapus 1906." }, { id: "Instrumen perunggu (Galton, Wundt 1879, Cattell 1890) → dibantah Wissler → humanisme (Esquirol, Seguin)." }, { id: "Binet–Simon 1905 (30 item) → 1908 → 1911 → Stanford-Binet 1916 (Terman)." }, { id: "Penyalahgunaan: Goddard (1911), Army Alpha/Beta (Yerkes, PD I)." }, { id: "ETS 1947; Thurstone (analisis faktor, PD II); Woodworth → MMPI; Jung 1910, Rorschach 1921, TAT 1935." }] },
    { t: "cek", q: { id: "Temuan Wissler bahwa waktu reaksi tidak berkorelasi dengan nilai kuliah dapat dikritik karena…" }, o: [{ id: "Sampelnya anak-anak" }, { id: "Sampelnya hanya mahasiswa cerdas sehingga rentang skornya terbatas" }, { id: "Ia tidak memakai statistik" }, { id: "Ia memakai tes proyektif" }], j: 1, b: { id: "Rentang yang terbatas (range restriction) menekan korelasi; studi kemudian menemukan korelasi moderat waktu reaksi–kecerdasan." } }
  ],
  istilah: [
    { t: "Brass instruments psychology", id: "Pengujian berbasis alat laboratorium: waktu reaksi, ambang sensorik." },
    { t: "Francis Galton", id: "Bapak pengujian mental; tekankan standardisasi." },
    { t: "Wilhelm Wundt", id: "Lab psikologi pertama, 1879." },
    { t: "James McKeen Cattell", id: "Pencipta istilah “tes mental” (1890)." },
    { t: "Clark Wissler", id: "Membuktikan waktu reaksi tak berkorelasi dengan nilai kuliah." },
    { t: "Esquirol", id: "Bedakan keterbelakangan mental vs gangguan mental." },
    { t: "Binet–Simon (1905)", id: "Tes kecerdasan pertama yang berguna; 30 item." },
    { t: "Stanford-Binet (1916)", id: "Revisi Terman yang terstandar." },
    { t: "Army Alpha / Beta", id: "Tes kelompok verbal / non-verbal PD I." },
    { t: "Analisis faktor", id: "Metode Thurstone menemukan bakat-bakat utama." }
  ],
  latihan: {
    pg: [
      { q: { id: "Ciri ujian pejabat Tiongkok kuno yang MENUNJUKKAN masalah validitas adalah…" }, o: [{ id: "Diadakan tiap tiga tahun" }, { id: "Tulisan tangan ikut memengaruhi seleksi" }, { id: "Menguji lima topik" }, { id: "Diperkenalkan ujian tertulis" }], j: 1 },
      { q: { id: "Urutan kronologis yang BENAR adalah…" }, o: [{ id: "Stanford-Binet → Binet-Simon → Army Alpha" }, { id: "Wundt → Binet-Simon → Stanford-Binet → TAT" }, { id: "TAT → Rorschach → Jung" }, { id: "ETS → Army Beta → Binet-Simon" }], j: 1 },
      { q: { id: "Gagasan Cattell bahwa “hand squeezing” mengukur kecerdasan didasari asumsi bahwa…" }, o: [{ id: "Kecerdasan bersifat proyektif" }, { id: "Energi tubuh berkaitan dengan energi mental" }, { id: "Kecerdasan diwariskan lewat bahasa" }, { id: "Waktu reaksi tidak penting" }], j: 1 },
      { q: { id: "Kontribusi terbesar Galton bagi psikometri modern, meskipun hipotesis sensoriknya gagal, adalah…" }, o: [{ id: "Tes proyektif" }, { id: "Pentingnya standardisasi pengukuran yang dapat diulang" }, { id: "Konsep IQ" }, { id: "Analisis faktor" }], j: 1 },
      { q: { id: "Tujuan awal skala Binet-Simon (1905) adalah…" }, o: [{ id: "Menyeleksi tentara" }, { id: "Membatasi imigrasi" }, { id: "Mengidentifikasi anak yang tidak mendapat manfaat dari sekolah reguler" }, { id: "Mendiagnosis histeria" }], j: 2 },
      { q: { id: "Esquirol mengklasifikasikan tingkat keterbelakangan mental berdasarkan…" }, o: [{ id: "Waktu reaksi" }, { id: "Penggunaan bahasa (frasa, monosilabel, suara)" }, { id: "Bercak tinta" }, { id: "Tinggi badan" }], j: 1 },
      { q: { id: "Seorang rekrut PD I yang tidak bisa berbahasa Inggris akan diberi…" }, o: [{ id: "Army Alpha" }, { id: "Army Beta" }, { id: "Stanford-Binet" }, { id: "MMPI" }], j: 1 },
      { q: { id: "Mengapa penggunaan Army Alpha untuk menyimpulkan perbedaan kecerdasan antar-etnis imigran tidak sahih?" }, o: [{ id: "Karena tesnya non-verbal" }, { id: "Karena tes verbal itu bergantung pada bahasa & budaya Amerika, bukan kecerdasan murni" }, { id: "Karena dikerjakan individual" }, { id: "Karena dibuat oleh Binet" }], j: 1 },
      { q: { id: "Subtes Wechsler modern yang berakar dari tes nonverbal untuk imigran adalah…" }, o: [{ id: "Kosakata" }, { id: "Block Design & Digit-Symbol" }, { id: "Informasi" }, { id: "Pemahaman" }], j: 1 },
      { q: { id: "MMPI meminjam formatnya dari…" }, o: [{ id: "TAT" }, { id: "Woodworth Personal Data Sheet" }, { id: "Army Beta" }, { id: "SAT" }], j: 1 },
      { q: { id: "Hipotesis proyektif menyatakan bahwa…" }, o: [{ id: "Stimulus terstruktur menghasilkan skor objektif" }, { id: "Respons pada stimulus ambigu mengungkap kebutuhan & konflik terdalam secara tak sadar" }, { id: "Waktu reaksi mencerminkan kecerdasan" }, { id: "Tes harus berbentuk Benar/Salah" }], j: 1 }
    ],
    bs: [
      { t: { id: "Ujian pejabat Tiongkok dihapus pada tahun 1906." }, j: true },
      { t: { id: "Wissler membuktikan waktu reaksi adalah prediktor terbaik nilai kuliah." }, j: false },
      { t: { id: "Binet awalnya meyakini magnetisme dapat menyembuhkan histeria." }, j: true },
      { t: { id: "Skala Binet-Simon 1905 sudah memiliki sistem skor IQ." }, j: false },
      { t: { id: "Revisi Binet 1911 menjadi awal kelas pendidikan khusus di Paris." }, j: true },
      { t: { id: "TAT dikembangkan oleh Rorschach pada 1921." }, j: false }
    ],
    isian: [
      { t: { id: "Istilah “tes mental” diciptakan oleh ______ (1890)." }, j: { id: "Cattell" }, x: [{ id: "Galton" }, { id: "Wundt" }, { id: "Terman" }] },
      { t: { id: "Stanford-Binet diterbitkan oleh Lewis ______ pada 1916." }, j: { id: "Terman" }, x: [{ id: "Goddard" }, { id: "Yerkes" }, { id: "Wissler" }] },
      { t: { id: "Analisis faktor dikembangkan oleh L.L. ______." }, j: { id: "Thurstone" }, x: [{ id: "Thorndike" }, { id: "Murray" }, { id: "Jung" }] }
    ],
    urut: { t: { id: "Urutkan dari yang paling awal." }, item: [{ id: "Ujian pejabat Tiongkok" }, { id: "Laboratorium Wundt" }, { id: "Binet–Simon" }, { id: "Stanford-Binet" }, { id: "Rorschach" }, { id: "TAT" }, { id: "ETS" }] },
    jodoh: [
      { a: { id: "Galton" }, b: { id: "Bapak pengujian mental" } }, { a: { id: "Esquirol" }, b: { id: "Keterbelakangan vs gangguan mental" } }, { a: { id: "Goddard" }, b: { id: "Mencap 3% anak “lemah pikiran”" } },
      { a: { id: "Yerkes" }, b: { id: "Army Alpha & Beta" } }, { a: { id: "Morgan & Murray" }, b: { id: "TAT (1935)" } }
    ]
  },
  tugas: [
    { t: { id: "Jelaskan pergeseran dari psikologi instrumen perunggu ke humanisme, termasuk peran Wissler." }, j: { id: "Instrumen perunggu (Galton, Wundt, Cattell; akhir 1800-an) menguji ambang sensorik dan waktu reaksi di laboratorium karena dianggap objektif, dan menyamakannya dengan kecerdasan. Wissler mengumpulkan skor tes mental dan nilai 300+ mahasiswa Columbia dan menemukan waktu reaksi serta diskriminasi sensorik tidak berkorelasi dengan nilai kuliah, sehingga ukuran ini ditinggalkan (meski sampelnya terbatas pada mahasiswa cerdas). Fokus bergeser ke humanisme: dokter Prancis Esquirol dan Seguin mendiagnosis individu dengan gangguan mental, menyadari gangguan psikiatri bisa reversibel dan tak selalu terkait kecerdasan rendah, dan Esquirol membedakan keterbelakangan mental dari gangguan mental." } },
    { t: { id: "Analisis penyalahgunaan tes oleh Goddard dan pada Army Alpha/Beta. Pelajaran etis apa yang dapat diambil?" }, j: { id: "Goddard menerjemahkan skala Binet-Simon, menguji 1000+ anak, mencap 3% \"lemah pikiran\", dan mengusulkan mereka dipisahkan dari masyarakat—bertentangan dengan tujuan kemanusiaan Binet. Hasil Army Alpha (verbal) dan Beta (non-verbal) yang dikembangkan Yerkes dipakai untuk membenarkan perbedaan kecerdasan antar-etnis dan pembatasan imigrasi, padahal skor sangat dipengaruhi bahasa dan budaya. Pelajarannya: tes harus dipakai sesuai tujuan dan populasi normanya, interpretasi harus mempertimbangkan budaya dan bahasa, dan peneliti perlu menyadari bias pribadi—validitas penggunaan sama pentingnya dengan validitas alat." } }
  ]
});

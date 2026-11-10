/* PPTA 301 — Modul 8: Pemilihan, Administrasi, dan Evaluasi Tes */
Kuliah.pertemuan("tes-psikologi", {
  no: 8, tema: 8, motif: "corong", motifOpt: { lbl: "Pemilihan · Administrasi · Evaluasi" }, durasi: 50,
  judul: { id: "Pemilihan, Administrasi, dan Evaluasi Tes", en: "Test Selection, Administration, and Evaluation" },
  ringkas: { id: "**Memilih** tes: kegunaannya menjawab pertanyaan rujukan, kondisi klien, pelatihan & preferensi praktisi, pemahaman literatur, efisiensi — membentuk **baterai inti** (Tabel 2.1, hlm. 63). Tinjau **manual & literatur** (mis. *Neuropsychology Review*). **Administrasi**: waspadai **pemalsuan respons** (cek skala validitas) dan **versi singkat** (WAIS). **Evaluasi**: kebanyakan integrasi klinis, tetapi untuk prediksi tertentu pakai **regresi berganda** atau **skor batas berganda**." },
  tujuan: [
    { id: "Menyebutkan faktor pemilihan tes dan peran literatur." },
    { id: "Menjelaskan risiko pemalsuan respons dan keterbatasan versi singkat." },
    { id: "Membedakan persamaan regresi berganda dan skor batas berganda." }
  ],
  isi: [
    { t: "pembuka", id: "Dengan ratusan tes tersedia, keahlian pertama psikolog adalah **memilih** — tes yang tepat untuk pertanyaan yang tepat, lalu memberikannya dengan cara yang menjaga keabsahan skor." },
    { t: "judul", id: "Pemilihan tes" },
    { t: "anim", jenis: "alur", judul: { id: "Menyaring tes menjadi baterai" }, item: [
      { judul: { id: "Pertanyaan rujukan" }, ket: { id: "Seberapa berguna tes menjawabnya?" } }, { judul: { id: "Kondisi klien" }, ket: { id: "Depresi ≠ pasien neurologis" } },
      { judul: { id: "Praktisi" }, ket: { id: "Pelatihan, pengalaman, preferensi" } }, { judul: { id: "Literatur & manual" }, ket: { id: "Statistik, norma, instruksi" } }, { judul: { id: "Efisiensi praktis" }, ket: { id: "Waktu, biaya" } }, { judul: { id: "Baterai inti" }, ket: { id: "Kombinasi tes per domain" } }
    ] },
    { t: "catatan", gaya: "faidah", id: "Setiap tes punya **manual** berisi statistik, norma, dan instruksi. Perbarui wawasan dengan literatur terbaru — mis. *Neuropsychology Review* melakukan **tinjauan sistematis** tes neuropsikologis. Psikolog juga **peneliti**: belajar berkelanjutan itu wajib." },
    { t: "catatan", gaya: "info", judul: { id: "Pemilihan tes untuk perawatan" }, id: "**Tingkat keparahan** kondisi memengaruhi keterbatasan, durasi, dan hasil perawatan — maka pilih tes berdasarkan **kegunaannya dalam perencanaan perawatan**, bukan hanya diagnosis." },
    { t: "judul", id: "Administrasi tes" },
    { t: "banding", kiri: { judul: { id: "Pemalsuan respons" }, warna: "red", poin: [{ id: "Klien sadar/tak sadar memberi respons tak akurat" }, { id: "**Faking good** (tampak sehat — seleksi kerja, hak asuh)" }, { id: "**Faking bad** (tampak sakit — klaim asuransi, pengadilan)" }, { id: "**Selalu periksa skala validitas**" }] }, kanan: { judul: { id: "Versi singkat" }, warna: "amber", poin: [{ id: "Menghemat waktu (mis. versi singkat **WAIS-III**)" }, { id: "Cocok untuk skrining" }, { id: "**Tidak dapat sepenuhnya menggantikan** versi panjang" }, { id: "Reliabilitas & cakupan konten berkurang" }] } },
    { t: "anim", jenis: "profil", judul: { id: "Skala validitas memberi alarm pemalsuan" }, skala: [{ k: "L", v: 74, n: "Lie" }, { k: "F", v: 48, n: "Infrequency" }, { k: "K", v: 70, n: "Defensif" }, { k: "D", v: 46 }, { k: "Pt", v: 44 }, { k: "Sc", v: 42 }], batas: 65, batasLabel: "T 65", min: 30, max: 100, ket: { id: "Contoh profil **faking good**: L & K tinggi, skala klinis rendah sekali — klien menyangkal kelemahan wajar. Hasil klinisnya **tidak dapat ditafsirkan apa adanya**. (Rincian skala MMPI di M15.)" } },
    { t: "judul", id: "Evaluasi & menggabungkan hasil" },
    { t: "catatan", gaya: "info", id: "Dalam kasus individual (mis. diagnosis), psikolog umumnya **tidak** menggabungkan skor secara formal — mengandalkan **penilaian, pengalaman klinis, dan integrasi** hasil. Namun untuk **prediksi akademik** dan beberapa keputusan klinis (mis. **risiko bunuh diri**), **rumus statistik** dianjurkan." },
    { t: "banding", judul: { id: "Dua cara formal menggabungkan tes" }, kiri: { judul: { id: "Regresi berganda" }, warna: "blue", poin: [{ id: "Setiap tes/subtes dikorelasikan dengan **kriteria**" }, { id: "Makin tinggi korelasi → makin besar **bobot**" }, { id: "Skor rendah di satu tes **dapat dikompensasi** tes lain" }] }, kanan: { judul: { id: "Skor batas berganda" }, warna: "green", poin: [{ id: "Batas optimal untuk **setiap** tes/subtes" }, { id: "Harus mencapai/melampaui batas di **semua** tes" }, { id: "**Tidak kompensatoris**" }] } },
    { t: "contoh", judul: { id: "Ilustrasi" }, id: "Seleksi pilot: skor penalaran spasial 90 (tinggi) tetapi waktu reaksi gagal batas.\n• **Regresi berganda**: total tertimbang mungkin tetap lolos — spasial mengompensasi.\n• **Skor batas berganda**: **tidak lolos**, karena waktu reaksi di bawah batas minimum yang tak bisa ditawar." },
    { t: "catatan", gaya: "hikmah", judul: { id: "Perspektif Islam" }, id: "Hubungan psikolog–klien dibangun di atas **taqwa** (kesadaran akan Allah ﷻ). Klien sebaiknya **jujur** agar mendapat perawatan terbaik — pemalsuan respons merugikan dirinya sendiri. Psikolog memakai **norma yang sesuai, metode terstandar, dan pengalaman klinis** demi diagnosis yang akurat." },
    { t: "ringkasan", item: [{ id: "Pilih tes sesuai rujukan, kondisi klien, kompetensi praktisi, literatur, efisiensi." }, { id: "Manual & tinjauan literatur wajib dibaca." }, { id: "Cek skala validitas untuk faking good/bad." }, { id: "Versi singkat untuk efisiensi, bukan pengganti penuh." }, { id: "Regresi berganda (kompensatoris) vs skor batas berganda (semua batas harus lolos)." }] },
    { t: "cek", q: { id: "Seleksi perawat ICU mensyaratkan skor minimum pada tes perhatian DAN tes empati; skor tinggi di satu tes tidak menutup kekurangan tes lain. Metode ini adalah…" }, o: [{ id: "Regresi berganda" }, { id: "Skor batas berganda" }, { id: "Norma terpisah" }, { id: "Versi singkat" }], j: 1, b: { id: "Skor batas berganda bersifat **non-kompensatoris**." } }
  ],
  istilah: [
    { t: "Baterai inti", id: "Kombinasi tes yang rutin dipakai psikolog per domain." },
    { t: "Manual tes", id: "Berisi statistik, norma, instruksi administrasi." },
    { t: "Faking good", id: "Berusaha tampak lebih sehat/baik." },
    { t: "Faking bad", id: "Berusaha tampak lebih terganggu." },
    { t: "Skala validitas", id: "Skala pendeteksi gaya respons tak akurat." },
    { t: "Short form", id: "Versi singkat tes untuk efisiensi." },
    { t: "Regresi berganda", id: "Kombinasi tes berbobot; kompensatoris." },
    { t: "Multiple cutoff", id: "Batas minimum tiap tes; non-kompensatoris." }
  ],
  latihan: {
    pg: [
      { q: { id: "Faktor pemilihan tes menurut slide, KECUALI…" }, o: [{ id: "Kegunaan menjawab pertanyaan rujukan" }, { id: "Pelatihan & pengalaman praktisi" }, { id: "Efisiensi praktis" }, { id: "Popularitas tes di media sosial" }], j: 3 },
      { q: { id: "Seorang ayah yang memperebutkan hak asuh mengerjakan MMPI dan menyangkal semua kekurangan kecil yang wajar. Pola yang dicurigai adalah…" }, o: [{ id: "Faking bad" }, { id: "Faking good" }, { id: "Respons acak" }, { id: "Inviolacy" }], j: 1 },
      { q: { id: "Pemohon kompensasi kecelakaan melaporkan gejala yang sangat langka dan berlebihan. Yang dicurigai adalah…" }, o: [{ id: "Faking good" }, { id: "Faking bad" }, { id: "Reliabilitas tinggi" }, { id: "Validitas konten" }], j: 1 },
      { q: { id: "Pernyataan yang TEPAT tentang versi singkat WAIS adalah…" }, o: [{ id: "Sama akuratnya dengan versi panjang untuk semua keputusan" }, { id: "Menghemat waktu, tetapi tidak dapat sepenuhnya menggantikan versi panjang" }, { id: "Dilarang dipakai" }, { id: "Hanya untuk anak" }], j: 1 },
      { q: { id: "Dalam regresi berganda, bobot sebuah subtes ditentukan oleh…" }, o: [{ id: "Lamanya subtes" }, { id: "Besarnya korelasi subtes dengan kriteria" }, { id: "Urutan subtes" }, { id: "Preferensi klien" }], j: 1 },
      { q: { id: "Pelamar A: verbal sangat tinggi, numerik sedikit di bawah batas. Metode yang memungkinkan A tetap lolos adalah…" }, o: [{ id: "Skor batas berganda" }, { id: "Regresi berganda (kompensatoris)" }, { id: "Keduanya pasti meloloskan" }, { id: "Keduanya pasti menolak" }], j: 1 },
      { q: { id: "Untuk keputusan mana statistik formal (rumus) DIANJURKAN menurut slide?" }, o: [{ id: "Semua diagnosis kepribadian" }, { id: "Prediksi akademik dan risiko bunuh diri" }, { id: "Membangun rapport" }, { id: "Memilih ruang tes" }], j: 1 },
      { q: { id: "Sumber terbaik untuk mengetahui norma, statistik, dan instruksi administrasi sebuah tes adalah…" }, o: [{ id: "Blog populer" }, { id: "Manual tes dan literatur terbaru" }, { id: "Ingatan pribadi" }, { id: "Klien" }], j: 1 }
    ],
    bs: [
      { t: { id: "Dalam kasus individual, psikolog umumnya mengandalkan integrasi klinis daripada rumus formal." }, j: true },
      { t: { id: "Skor batas berganda bersifat kompensatoris." }, j: false },
      { t: { id: "Pemalsuan respons selalu dilakukan dengan sadar." }, j: false },
      { t: { id: "Tingkat keparahan kondisi memengaruhi durasi dan hasil perawatan." }, j: true },
      { t: { id: "Psikolog juga berperan sebagai peneliti yang terus belajar." }, j: true }
    ],
    isian: [
      { t: { id: "Daftar tes per domain dapat dilihat di Tabel 2.1 halaman ______ buku Groth-Marnat." }, j: { id: "63" }, x: [{ id: "13" }, { id: "103" }, { id: "36" }] },
      { t: { id: "Untuk mendeteksi pemalsuan, selalu periksa skala ______ dalam tes." }, j: { id: "validitas" }, x: [{ id: "klinis" }, { id: "kecerdasan" }, { id: "proyektif" }] }
    ],
    pilah: { t: { id: "Pilah: REGRESI BERGANDA atau SKOR BATAS BERGANDA?" }, kategori: [{ id: "Regresi berganda" }, { id: "Skor batas berganda" }], item: [
      { t: { id: "Kekurangan satu tes ditutup tes lain" }, k: 0 }, { t: { id: "Harus lolos batas di semua tes" }, k: 1 }, { t: { id: "Bobot sesuai korelasi dengan kriteria" }, k: 0 }, { t: { id: "Non-kompensatoris" }, k: 1 }
    ] }
  },
  tugas: [
    { t: { id: "Jelaskan dua perhatian utama dalam administrasi tes dan cara mengatasinya." }, j: { id: "(1) Pemalsuan respons: klien sadar atau tak sadar memberi jawaban tidak akurat—faking good (tampak sehat, mis. seleksi kerja atau hak asuh) atau faking bad (tampak terganggu, mis. klaim kompensasi); diatasi dengan selalu memeriksa skala validitas dan membandingkan dengan data lain. (2) Penggunaan versi singkat: menghemat waktu (mis. versi singkat WAIS-III) dan berguna untuk skrining, tetapi tidak dapat sepenuhnya menggantikan versi panjang karena cakupan dan reliabilitasnya lebih rendah—dipakai sesuai tujuan dan diinterpretasi hati-hati." } },
    { t: { id: "Bandingkan persamaan regresi berganda dan skor batas berganda dengan contoh seleksi." }, j: { id: "Regresi berganda mengorelasikan tiap tes dengan kriteria; tes yang korelasinya lebih tinggi mendapat bobot lebih besar, lalu skor dijumlahkan—bersifat kompensatoris (kelemahan satu tes ditutup kekuatan tes lain). Skor batas berganda menetapkan batas optimal tiap tes; kandidat harus mencapai atau melampaui semua batas—non-kompensatoris. Contoh: calon pilot dengan spasial sangat tinggi tetapi waktu reaksi di bawah batas bisa lolos lewat regresi berganda, tetapi gagal pada skor batas berganda karena waktu reaksi adalah syarat minimum keselamatan." } }
  ]
});

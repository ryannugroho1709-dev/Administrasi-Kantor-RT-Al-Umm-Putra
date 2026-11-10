/* PPTA 301 — Modul 30: Perencanaan Pengobatan Sistematis */
Kuliah.pertemuan("tes-psikologi", {
  no: 30, tema: 3, motif: "tangga-penyesuaian", motifOpt: { lbl: "Perencanaan Pengobatan" }, durasi: 65,
  judul: { id: "Perencanaan Pengobatan Sistematis", en: "Systematic Treatment Planning" },
  ringkas: { id: "**Beutler dkk. (1990)** mengaitkan dimensi pasien dengan keputusan pengobatan: **gangguan fungsional** (tinggi → restriktif, intensif, obat, prognosis, urgensi; MSE, MMPI Pa/Sc), **dukungan sosial** (tinggi → terapi lebih singkat; rendah → CBT/kelompok suportif), **kompleksitas/kronisitas** (TAT, Rorschach, MMPI, gangguan kepribadian; tinggi → kelompok/keluarga, mimpi, katarsis; rendah → paparan bertahap, penguatan, tantang kognisi, pemantauan diri, relaksasi), **gaya koping** (eksternalisasi Pd+Pa+Ma vs internalisasi D+Si; keterampilan sosial & marah vs katarsis & kursi kosong), **resistensi** (tinggi → non-direktif, suportif, mandiri; rendah → direktif, terstruktur), **distres subjektif** (kurangi cemas + keterampilan koping), **fase perubahan**: prekontemplasi → kontemplasi → persiapan → aksi → pemeliharaan. Islam: contoh menegakkan **shalat**." },
  tujuan: [
    { id: "Menjelaskan dimensi pasien dalam perencanaan pengobatan sistematis dan keputusan yang terkait." },
    { id: "Memilih tes dan teknik yang sesuai untuk tiap dimensi (fungsional, dukungan, kompleksitas, koping, resistensi, distres)." },
    { id: "Mengidentifikasi tahap perubahan klien dan mencocokkan intervensi dengannya." }
  ],
  isi: [
    { t: "pembuka", id: "Dua klien sama-sama didiagnosis depresi. Yang satu masih bekerja, didukung keluarga, dan siap berubah; yang lain tak bisa mengurus diri, hidup sendiri, dan menolak semua saran. Diagnosis sama — **rencana pengobatan sangat berbeda**. Inilah gunanya perencanaan sistematis." },
    { t: "anim", jenis: "profil", judul: { id: "Profil dimensi Beutler: dua klien depresi (0 rendah – 10 tinggi)" }, mode: "batang", min: 0, max: 10, batas: 7, batasLabel: "tinggi", skala: [{ k: "Fungsi", v: 8, n: "Gangguan" }, { k: "Dukungan", v: 2, n: "Sosial" }, { k: "Kompleks", v: 7 }, { k: "Ekstern", v: 3, n: "Koping" }, { k: "Resisten", v: 8 }, { k: "Distres", v: 9 }], ket: { id: "Klien B: gangguan fungsional tinggi, dukungan rendah, resistensi & distres tinggi → setting lebih **restriktif**, intensitas tinggi, pertimbangkan **obat**, pendekatan **non-direktif & suportif**, prioritas menurunkan distres. Klien A (dukungan tinggi, fungsional ringan, siap berubah) cukup rawat jalan singkat yang lebih terstruktur." } },
    { t: "judul", id: "1. Gangguan fungsional" },
    { t: "p", id: "Seberapa parah masalah **mengganggu tuntutan harian** (memasak, kebersihan diri, bekerja, mengemudi). Distres subjektif ikut dilihat, **tetapi harus ada tanda objektif**. Di klinik: konsentrasi buruk saat asesmen, mudah teralih hal kecil, sulit berinteraksi. Alat: **MSE**, **MMPI** (terutama Pa, Sc)." },
    { t: "banding", kiri: { judul: { id: "Gangguan fungsional tinggi" }, warna: "red", poin: [{ id: "Pengobatan lebih **restriktif** (rawat inap)" }, { id: "**Intensitas** tinggi" }, { id: "**Obat** vs psikososial dipertimbangkan" }, { id: "Memengaruhi **prognosis** & **urgensi** tujuan awal" }] }, kanan: { judul: { id: "Gangguan fungsional rendah" }, warna: "green", poin: [{ id: "Lingkungan **tidak restriktif** (rawat jalan)" }, { id: "Frekuensi & durasi **rendah**" }] } },
    { t: "catatan", gaya: "tanbih", judul: { id: "Kondisi tertentu" }, id: "Kadang tepat: **terapi singkat intermiten** di titik-titik kritis kehidupan; atau **tidak merekomendasikan** pengobatan bila klien berpotensi merespons negatif (mis. gangguan kepribadian ambang) atau tak merespons. **Skizofrenia, bipolar, kecemasan berat** mungkin perlu intervensi **medis** dulu agar klien cukup sehat untuk intervensi psikososial." },
    { t: "judul", id: "2. Dukungan sosial" },
    { t: "p", id: "Keluarga kuat-kohesif dan pekerjaan aman **memodifikasi dampak stres**. Alat tersering: **Social Support Questionnaire**. Dukungan **tinggi** → terapi **lebih singkat**; **rendah** → **CBT** lebih efektif daripada terapi peningkatan relasi; kadang **kelompok suportif** efektif." },
    { t: "judul", id: "3. Kompleksitas / kronisitas masalah" },
    { t: "banding", kiri: { judul: { id: "Kompleksitas rendah" }, warna: "green", poin: [{ id: "Sempit, fokus, dipicu lingkungan (mis. **fobia sederhana**)" }, { id: "Teknik: **paparan bertahap**, penguatan perilaku target, menantang kognisi disfungsional, **pemantauan diri** (catatan makan), relaksasi/pernapasan, relaksasi otot dalam" }] }, kanan: { judul: { id: "Kompleksitas tinggi" }, warna: "amber", poin: [{ id: "Luas, menahun, banyak konteks; mungkin **konflik batin**" }, { id: "Alat: **TAT, Rorschach, MMPI**; adanya **gangguan kepribadian** DSM" }, { id: "Teknik: terapi **kelompok/keluarga**, kerja dengan **mimpi**, **katarsis**" }] } },
    { t: "catatan", gaya: "info", id: "Kompleksitas paling sulit diukur karena **berakar pada teori**: psikodinamik melihat tema simbolis mendasar; behavioral memakai bahasa yang **sempit, konkret, berorientasi lingkungan**." },
    { t: "judul", id: "4. Gaya koping" },
    { t: "anim", jenis: "spektrum", judul: { id: "Kontinum gaya koping" }, min: -10, max: 10, satuan: "Internal ← → Eksternal", awal: 4, rentang: [
      { label: { id: "Internalisasi" }, dari: -10, sampai: -2, ket: { id: "Menyalahkan diri, merasa tak cakap, distres subjektif tinggi. MMPI: **D + Si**. Teknik: **katarsis**, interpretasi mimpi, **kursi kosong**/peran" } },
      { label: { id: "Seimbang" }, dari: -2, sampai: 2, ket: { id: "Campuran keduanya" } },
      { label: { id: "Eksternalisasi" }, dari: 2, sampai: 10, ket: { id: "Impulsif, menyalahkan orang lain/nasib, menghindar. MMPI: **Pd + Pa + Ma**. Teknik: **keterampilan sosial**, **manajemen amarah**" } }
    ], ket: { id: "Geser jarum untuk melihat profil dan teknik yang cocok." } },
    { t: "judul", id: "5. Resistensi & 6. Distres subjektif" },
    { t: "banding", kiri: { judul: { id: "Resistensi tinggi" }, warna: "red", poin: [{ id: "Bertahan terhadap kesan **dikendalikan** orang lain" }, { id: "Ciri: butuh kontrol, permusuhan, impulsif, menghindar" }, { id: "Intervensi **non-direktif, suportif, mandiri** (*self-directed*)" }] }, kanan: { judul: { id: "Resistensi rendah" }, warna: "green", poin: [{ id: "Menerima & responsif terhadap pengobatan" }, { id: "Pendekatan **direktif & terstruktur**" }] } },
    { t: "catatan", gaya: "info", judul: { id: "Distres subjektif" }, id: "Sejauh mana masalah **dirasakan**: cemas, bingung, depresi. Distres **tinggi** → tujuan utama **menurunkan kecemasan**; obat boleh dipakai, **disertai** belajar keterampilan koping baru." },
    { t: "judul", id: "7. Fase pemecahan masalah (tahap perubahan)" },
    { t: "anim", jenis: "alur", judul: { id: "Lima tahap perubahan" }, item: [
      { judul: { id: "Prekontemplasi" }, ket: { id: "Hampir tak berniat berubah; orang lain melihat jelas (pasangan mengancam pergi, masalah hukum)" } },
      { judul: { id: "Kontemplasi" }, ket: { id: "Sadar ada masalah, menimbang serius, belum berkomitmen" } },
      { judul: { id: "Persiapan" }, ket: { id: "Berniat bertindak dalam waktu dekat; mencoba kecil-kecilan" } },
      { judul: { id: "Aksi" }, ket: { id: "Mengubah lingkungan/sikap/perilaku; butuh waktu & energi; terlihat orang lain" } },
      { judul: { id: "Pemeliharaan" }, ket: { id: "Mengonsolidasi & mencegah kambuh" } }
    ] },
    { t: "catatan", gaya: "faidah", id: "Setiap tahap punya **tugas** yang harus tuntas sebelum lanjut. Memberi rencana aksi rinci kepada klien yang masih **prekontemplasi** biasanya gagal — ia butuh bantuan **menyadari** dulu." },
    { t: "catatan", gaya: "hikmah", judul: { id: "Perspektif Islam: contoh menegakkan shalat" }, id: "Bayangkan klien yang ingin kembali shalat. **Prekontemplasi**: \"Nanti saja kalau sudah siap.\" **Kontemplasi**: mulai gelisah, sadar ada yang hilang. **Persiapan**: belajar lagi bacaan, memasang pengingat azan. **Aksi**: shalat lima waktu, mulai berjamaah. **Pemeliharaan**: menjaga dengan teman saleh dan muhasabah agar tidak kendur. Tujuh dimensi Beutler pun berlaku: fungsi harian, dukungan (teman masjid), kompleksitas, gaya koping, resistensi, distres, fase. Allah berfirman: *\"Sesungguhnya Allah tidak mengubah keadaan suatu kaum hingga mereka mengubah apa yang ada pada diri mereka.\"* (QS Ar-Ra'd [13]: 11)." },
    { t: "ringkasan", item: [{ id: "Beutler (1990): dimensi pasien → keputusan pengobatan." }, { id: "Fungsional tinggi → restriktif, intensif, obat; dukungan tinggi → lebih singkat." }, { id: "Kompleksitas rendah → teknik perilaku; tinggi → kelompok/keluarga, mimpi, katarsis." }, { id: "Eksternal (Pd+Pa+Ma) vs internal (D+Si); resistensi tinggi → non-direktif." }, { id: "Prekontemplasi → kontemplasi → persiapan → aksi → pemeliharaan." }] },
    { t: "cek", q: { id: "Klien sangat resisten, mudah bermusuhan, dan butuh kontrol. Pendekatan yang didukung riset…" }, o: [{ id: "Direktif dan terstruktur ketat" }, { id: "Non-direktif, suportif, dan mandiri" }, { id: "Konfrontasi keras" }, { id: "Tidak diberi pengobatan" }], j: 1, b: { id: "Resistensi tinggi berhubungan positif dengan hasil pada intervensi **non-direktif**." } }
  ],
  istilah: [
    { t: "Gangguan fungsional", id: "Sejauh mana masalah mengganggu tuntutan harian." },
    { t: "Dukungan sosial", id: "Keluarga kohesif & pekerjaan aman sebagai penyangga stres." },
    { t: "Kompleksitas masalah", id: "Luas, menahun, banyak konteks." },
    { t: "Eksternalisasi", id: "Koping dengan bertindak, menyalahkan orang lain." },
    { t: "Internalisasi", id: "Koping dengan menyalahkan diri sendiri." },
    { t: "Resistensi", id: "Oposisi terhadap pengobatan karena merasa dikendalikan." },
    { t: "Prekontemplasi", id: "Tahap belum berniat berubah." },
    { t: "Pemeliharaan", id: "Tahap menjaga perubahan dan mencegah kambuh." }
  ],
  latihan: {
    pg: [
      { q: { id: "Klien tidak mampu mandi, makan, atau bekerja selama berminggu-minggu. Implikasi utama perencanaan…" }, o: [{ id: "Rawat jalan sebulan sekali" }, { id: "Pengobatan lebih restriktif dan intensif, pertimbangkan obat" }, { id: "Tidak perlu pengobatan" }, { id: "Terapi mimpi saja" }], j: 1 },
      { q: { id: "Klien dengan dukungan sosial rendah. Menurut slide, pendekatan yang lebih efektif…" }, o: [{ id: "Terapi peningkatan relasi" }, { id: "CBT, atau kelompok suportif" }, { id: "Tanpa terapi" }, { id: "Psikoanalisis panjang" }], j: 1 },
      { q: { id: "Klien takut naik lift sejak setahun lalu, tanpa masalah lain. Teknik yang paling sesuai…" }, o: [{ id: "Kerja dengan mimpi" }, { id: "Paparan bertahap" }, { id: "Terapi keluarga jangka panjang" }, { id: "Katarsis" }], j: 1 },
      { q: { id: "Ukuran eksternalisasi MMPI dihitung dengan menjumlahkan skala…" }, o: [{ id: "D + Si" }, { id: "Pd + Pa + Ma" }, { id: "Hs + Hy" }, { id: "L + K" }], j: 1 },
      { q: { id: "Klien sering menyalahkan diri, merasa tidak cakap, dan sangat tertekan. Teknik yang cocok…" }, o: [{ id: "Manajemen amarah" }, { id: "Katarsis, interpretasi mimpi, kursi kosong" }, { id: "Pelatihan ketegasan saja" }, { id: "Hukuman" }], j: 1 },
      { q: { id: "Seorang suami datang terapi hanya karena istri mengancam bercerai, dan ia merasa “tidak ada masalah”. Tahap perubahannya…" }, o: [{ id: "Aksi" }, { id: "Prekontemplasi" }, { id: "Pemeliharaan" }, { id: "Persiapan" }], j: 1 },
      { q: { id: "Klien berkata, “Saya tahu harus berhenti merokok, tapi belum yakin kapan.” Tahapnya…" }, o: [{ id: "Prekontemplasi" }, { id: "Kontemplasi" }, { id: "Aksi" }, { id: "Pemeliharaan" }], j: 1 },
      { q: { id: "Alat yang dipakai untuk menilai kompleksitas masalah menurut slide, KECUALI…" }, o: [{ id: "TAT" }, { id: "Rorschach" }, { id: "MMPI" }, { id: "Bayley" }], j: 3 },
      { q: { id: "Klien skizofrenia dengan halusinasi aktif sulit mengikuti terapi kelompok. Pertimbangan sesuai slide…" }, o: [{ id: "Langsung terapi mimpi" }, { id: "Intervensi medis lebih dulu agar cukup sehat untuk psikososial" }, { id: "Hentikan semua pengobatan" }, { id: "Paparan bertahap" }], j: 1 },
      { q: { id: "Klien kooperatif, resistensi rendah, ingin langkah jelas. Pendekatan terbaik…" }, o: [{ id: "Non-direktif murni" }, { id: "Direktif dan terstruktur" }, { id: "Tanpa struktur" }, { id: "Menunda terapi" }], j: 1 },
      { q: { id: "Klien dengan distres subjektif sangat tinggi mendapat obat antiansietas. Menurut slide, obat seharusnya…" }, o: [{ id: "Satu-satunya intervensi" }, { id: "Disertai pembelajaran keterampilan koping baru" }, { id: "Dihindari sama sekali" }, { id: "Diberikan seumur hidup" }], j: 1 }
    ],
    bs: [
      { t: { id: "Dukungan sosial tinggi menunjukkan durasi terapi yang lebih singkat." }, j: true },
      { t: { id: "Kompleksitas masalah adalah dimensi yang paling mudah diukur." }, j: false },
      { t: { id: "Kadang tepat untuk tidak merekomendasikan pengobatan sama sekali." }, j: true },
      { t: { id: "Pada tahap aksi, perubahan sudah terlihat oleh orang lain." }, j: true },
      { t: { id: "Eksternalisator cenderung menyalahkan diri sendiri." }, j: false }
    ],
    isian: [
      { t: { id: "Skala dukungan sosial yang paling sering dipakai adalah Social Support ______." }, j: { id: "Questionnaire" }, x: [{ id: "Inventory" }, { id: "Index" }, { id: "Scale" }] },
      { t: { id: "Tahap perubahan setelah persiapan adalah ______." }, j: { id: "aksi" }, x: [{ id: "kontemplasi" }, { id: "pemeliharaan" }, { id: "prekontemplasi" }] }
    ],
    urut: { t: { id: "Urutkan tahap perubahan" }, item: [{ id: "Prekontemplasi" }, { id: "Kontemplasi" }, { id: "Persiapan" }, { id: "Aksi" }, { id: "Pemeliharaan" }] },
    pilah: { t: { id: "Pilah teknik: untuk kompleksitas rendah atau tinggi?" }, kategori: [{ id: "Rendah" }, { id: "Tinggi" }], item: [{ t: { id: "Paparan bertahap" }, k: 0 }, { t: { id: "Terapi keluarga" }, k: 1 }, { t: { id: "Pemantauan diri" }, k: 0 }, { t: { id: "Kerja dengan mimpi" }, k: 1 }, { t: { id: "Relaksasi otot dalam" }, k: 0 }, { t: { id: "Katarsis" }, k: 1 }] }
  },
  tugas: [
    { t: { id: "Susun rencana pengobatan sistematis untuk klien: laki-laki 35 tahun, sering marah dan menyalahkan atasan, dukungan keluarga baik, masih bekerja, datang karena disuruh istri." }, j: { id: "Gangguan fungsional rendah–sedang (masih bekerja) → rawat jalan dengan frekuensi sedang. Dukungan sosial baik → durasi relatif singkat, libatkan istri bila setuju. Kompleksitas dinilai lewat wawancara dan MMPI; bila masalah terfokus pada marah di kerja, gunakan teknik perilaku. Gaya koping eksternalisasi (menyalahkan atasan; cek Pd + Pa + Ma) → pelatihan keterampilan sosial dan manajemen amarah. Resistensi kemungkinan tinggi karena datang atas desakan istri → pendekatan non-direktif, suportif, dan mandiri. Distres subjektif mungkin rendah. Tahap perubahan prekontemplasi → fokus awal membangun kesadaran dan motivasi, bukan langsung rencana aksi." } },
    { t: { id: "Jelaskan tujuh dimensi Beutler beserta tes dan tekniknya, lalu kaitkan tahap perubahan dengan contoh dalam kehidupan Muslim." }, j: { id: "Gangguan fungsional (MSE, MMPI Pa/Sc; tinggi → restriktif, intensif, obat), dukungan sosial (Social Support Questionnaire; tinggi → singkat, rendah → CBT/kelompok), kompleksitas (TAT, Rorschach, MMPI, gangguan kepribadian; rendah → paparan, penguatan, pemantauan diri, relaksasi; tinggi → kelompok/keluarga, mimpi, katarsis), gaya koping (eksternal Pd+Pa+Ma → keterampilan sosial, amarah; internal D+Si → katarsis, kursi kosong), resistensi (tinggi → non-direktif; rendah → direktif), distres subjektif (turunkan cemas, obat + keterampilan koping), dan fase perubahan. Contoh shalat: prekontemplasi (menunda), kontemplasi (gelisah sadar), persiapan (belajar bacaan, pasang pengingat), aksi (shalat lima waktu), pemeliharaan (teman saleh dan muhasabah), sejalan dengan QS Ar-Ra'd 11." } }
  ]
});

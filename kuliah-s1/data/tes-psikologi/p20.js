/* PPTA 301 — Modul 20: Mendiagnosis Skizofrenia — Tantangan & Kesalahpahaman */
Kuliah.pertemuan("tes-psikologi", {
  no: 20, tema: 5, motif: "dua-wajah", motifOpt: { lbl: "Skizofrenia" }, durasi: 65,
  judul: { id: "Mendiagnosis Skizofrenia: Tantangan & Kesalahpahaman", en: "Diagnosing Schizophrenia: Challenges & Misconceptions" },
  ringkas: { id: "Salah satu gangguan **paling parah** dan **termahal** (AS $62,7 miliar). Sejarah: **Kraepelin** (*dementia praecox*), **Bleuler** (*schizophrenia*), **Schneider** (gejala peringkat pertama & kedua). Fase: **akut → stabilisasi → pemeliharaan/pemulihan → kekambuhan**. Kerabat tingkat pertama berisiko **10×**; onset **15–25 th**. Diagnosis: ≥ 2 dari 5 kategori dalam **1 bulan** + gangguan fungsi. Gejala **positif** (delusi, halusinasi, bicara/perilaku kacau), **negatif** (afek tumpul, alogia, avolisi, anhedonia, ambivalensi), **neurokognitif** (memori kerja, kewaspadaan, eksekutif) yang **independen**. Biologis: model **stres-diatesis**, ventrikel membesar, dopamin **mesolimbik** (positif) & **mesokortikal** (negatif). Asesmen: SADS, MSE, MMPI, **PANSS**. Islam: gejala positif sering diatribusikan pada **jin** → konseling berbasis iman + psikiatri." },
  tujuan: [
    { id: "Menjelaskan sejarah, fase, faktor risiko, dan subtipe skizofrenia." },
    { id: "Membedakan gejala positif, negatif, dan disorganisasi/neurokognitif beserta contohnya." },
    { id: "Menguraikan asesmen biologis-psikologis, intervensi farmakologis, dan kepekaan budaya Muslim." }
  ],
  isi: [
    { t: "pembuka", id: "\"Skizofrenia = kepribadian ganda.\" Ini **kesalahpahaman** paling umum. Bleuler memakai \"pikiran yang terpecah\" untuk keterpecahan antara **pikiran, emosi, dan perilaku** — bukan dua kepribadian." },
    { t: "anim", jenis: "garis-waktu", judul: { id: "Menamai gangguan" }, item: [
      { th: "1800-an", judul: { id: "Emil Kraepelin" }, ket: { id: "*Dementia praecox* — \"demensia dini\"." } },
      { th: "1900-an", judul: { id: "Eugen Bleuler" }, ket: { id: "Istilah **schizophrenia**; mengenali lebih dari satu jenis." } },
      { th: "Abad 20", judul: { id: "Kurt Schneider" }, ket: { id: "**First-rank symptoms** (psikosis, delusi) & **second-rank** (pengalaman lain)." } }
    ] },
    { t: "anim", jenis: "siklus", judul: { id: "Fase skizofrenia" }, pusat: { id: "Skizofrenia" }, item: [
      { judul: { id: "Akut" }, ket: { id: "Gejala positif muncul halus; dinamika keluarga terganggu" } },
      { judul: { id: "Stabilisasi" }, ket: { id: "Pengobatan intensif, atur obat, mulai rehabilitasi" } },
      { judul: { id: "Pemeliharaan" }, ket: { id: "Cegah kambuh, strategi coping" } },
      { judul: { id: "Kekambuhan" }, ket: { id: "Sering karena **tidak patuh obat**; kenali pemicu" } }
    ] },
    { t: "catatan", gaya: "info", judul: { id: "Keluarga & usia" }, id: "Kerabat biologis tingkat pertama berisiko **10 kali** lebih tinggi; anggota keluarga lain berisiko gangguan psikiatri lain. Onset umumnya **dewasa awal (15–25 tahun)**." },
    { t: "tabel", judul: { id: "Jenis-jenis skizofrenia (klasifikasi lama)" }, kolom: ["Jenis", "Ciri"], baris: [
      ["**Paranoid**", "Sangat curiga, merasa terancam, keyakinan kebesaran"],
      ["**Disorganisasi**", "Pikiran & bicara inkoheren, tanpa delusi jelas"],
      ["**Katatonik**", "Menarik diri, diam, negativistik, postur tak biasa"],
      ["**Skizoafektif**", "Gejala skizofrenia + gangguan mood mayor"],
      ["**Residual**", "Delusi/halusinasi hilang, tetapi motivasi & minat hilang"]
    ] },
    { t: "catatan", gaya: "faidah", judul: { id: "Kriteria diagnosis" }, id: "Minimal **dua dari lima** kategori dalam **satu bulan** (delusi, halusinasi, bicara kacau, perilaku kacau/katatonik, gejala negatif) **ditambah** gangguan pada satu atau lebih aspek fungsi **sosial atau pekerjaan**." },
    { t: "banding", judul: { id: "Gejala positif vs negatif" }, kiri: { judul: { id: "Positif — fungsi BERLEBIH" }, warna: "red", poin: [{ id: "**Delusi**: kebesaran, kejar (persekutori), somatik" }, { id: "**Halusinasi**" }, { id: "Gangguan berpikir; bicara tak teratur" }, { id: "Perilaku kacau/katatonik" }] }, kanan: { judul: { id: "Negatif — fungsi BERKURANG" }, warna: "blue", poin: [{ id: "**Afek tumpul**: ekspresi emosi menyempit" }, { id: "**Alogia**: bicara & pikiran miskin" }, { id: "**Avolisi**: tak mampu memulai/mempertahankan tujuan" }, { id: "**Anhedonia**; **ambivalensi**" }] } },
    { t: "akordion", judul: { id: "Gejala disorganisasi & neurokognitif" }, item: [
      { judul: { id: "Gangguan berpikir" }, id: "**Ekolalia** (mengulang kata orang), **sirkumstansial** (terlalu detail tapi sampai), **tangensial** (logis tetapi menyimpang & tak kembali), **asosiasi longgar**, **flight of ideas**, **word salad**." },
      { judul: { id: "Perilaku kacau" }, id: "**Ekopraksia** (meniru gerak), regresi, **stereotipi**, hiperwaspada, **waxy flexibility** (bertahan pada postur aneh)." },
      { judul: { id: "Kognitif" }, id: "Gangguan **memori kerja**, **kewaspadaan** (*vigilance*), kelancaran verbal, fungsi **eksekutif** (kemauan, perencanaan, tindakan bertujuan, pemantauan diri) — terjadi **independen** dari gejala positif & negatif." },
      { judul: { id: "Dampak psikologis & sosial" }, id: "Sulit menjalin relasi, inhibisi sensorik lemah, sulit memutuskan; penurunan finansial, beban caregiver, risiko **tunawisma**, **stigma** & isolasi." }
    ] },
    { t: "judul", id: "Faktor biologis" },
    { t: "anim", jenis: "otak", judul: { id: "Temuan neuroanatomi pada skizofrenia" }, lobus: {
      frontal: { nama: "Lobus prefrontal", fungsi: "**Hipofrontalitas**: tak ada peningkatan aliran darah normal; jalur dopamin **mesokortikal** yang hipoaktif → gejala **negatif** & kognitif.", tes: "Wisconsin Card Sorting, kelancaran verbal" },
      temporal: { nama: "Sistem limbik (temporal medial)", fungsi: "Jalur dopamin **mesolimbik** yang hiperaktif → gejala **positif** (halusinasi, delusi). Atrofi **amigdala**.", tes: "PANSS skala positif" },
      hipokampus: { nama: "Hipokampus & parahipokampus", fungsi: "**Atrofi** — terkait gangguan memori.", tes: "Recall tertunda, Logical Memory" },
      parietal: { nama: "Ventrikel (bagian dalam)", fungsi: "**Pembesaran ventrikel** otak — ruang berisi cairan meluas karena jaringan menyusut.", tes: "Dilihat lewat CT/MRI" }
    }, petunjuk: { id: "Ketuk area untuk melihat temuan. Ingat: tidak disebabkan oleh **satu** neurotransmiter saja; ada juga penurunan aliran darah ke **globus pallidus kiri**." } },
    { t: "catatan", gaya: "info", judul: { id: "Model stres-diatesis" }, id: "Kerentanan (**diatesis**, mis. genetik 10% pada kerabat tingkat pertama) + **stres** lingkungan → gangguan muncul. Keduanya diperlukan." },
    { t: "judul", id: "Asesmen & intervensi" },
    { t: "tabel", kolom: ["Asesmen", "Isi"], baris: [
      ["**Biologis**", "Riwayat kesehatan, fungsi fisik, **status nutrisi**, keseimbangan cairan, obat (resep, herbal, ilegal), gerakan motorik abnormal"],
      ["**SADS**", "Wawancara semi-terstruktur; **6 skala**; 3 bagian: gejala kini, riwayat seumur hidup, tingkat perubahan"],
      ["**MSE**", "Pemeriksaan status mental"],
      ["**MMPI**", "Skala 8 (Sc)"],
      ["**PANSS**", "Keparahan gejala **positif & negatif**"]
    ] },
    { t: "poin", item: [
      { ikon: "seal", judul: { id: "Antipsikotik generasi baru" }, id: "Memblok **dopamin & serotonin**; lebih aman (mis. **risperidone**)." },
      { ikon: "clock", judul: { id: "Waktu kerja" }, id: "Mulai **1–2 minggu**; uji coba memadai **6–12 minggu**." },
      { ikon: "shield", judul: { id: "Kepatuhan" }, id: "**Pencegahan terbaik** kekambuhan; edukasi efek samping & cara melapor." }
    ] },
    { t: "catatan", gaya: "hikmah", judul: { id: "Perspektif Islam" }, id: "Gejala **positif** sering lebih menyerupai **gangguan jin** dalam persepsi masyarakat Muslim (*Transcultural Psychiatry*). Atribusi umum: \"**Ini ujian**\", \"**Saya sedang dihukum**\". Psikolog harus peka budaya, membedakan gejala positif & negatif dengan cermat, dan menempuh **konseling berbasis iman bersama konsultasi psikiatri** — ruqyah syar'iyyah dan pengobatan medis tidak saling meniadakan." },
    { t: "ringkasan", item: [{ id: "Kraepelin → Bleuler → Schneider." }, { id: "Fase: akut, stabilisasi, pemeliharaan, kekambuhan." }, { id: "Positif (berlebih) vs negatif (berkurang); neurokognitif independen." }, { id: "Mesolimbik hiper → positif; mesokortikal hipo → negatif; ventrikel membesar." }, { id: "SADS, MSE, MMPI, PANSS; antipsikotik 6–12 minggu; kepatuhan kunci." }] },
    { t: "cek", q: { id: "Pasien ditanya “Di mana rumah Anda?” lalu bercerita panjang tentang jalan, pohon, tetangga, dan akhirnya tetap menyebut alamatnya. Ini adalah…" }, o: [{ id: "Tangensialitas" }, { id: "Bicara sirkumstansial" }, { id: "Word salad" }, { id: "Ekolalia" }], j: 1, b: { id: "Sirkumstansial: terlalu detail tetapi **sampai pada tujuan**. Tangensial: menyimpang dan **tidak kembali**." } }
  ],
  istilah: [
    { t: "Dementia praecox", id: "Istilah Kraepelin untuk skizofrenia." },
    { t: "First-rank symptoms", id: "Gejala utama Schneider: psikosis, delusi." },
    { t: "Gejala positif", id: "Fungsi berlebih: delusi, halusinasi." },
    { t: "Gejala negatif", id: "Fungsi berkurang: alogia, avolisi, anhedonia." },
    { t: "Avolisi", id: "Tak mampu memulai perilaku bertujuan." },
    { t: "Tangensialitas", id: "Menyimpang dari topik tanpa kembali." },
    { t: "Waxy flexibility", id: "Mempertahankan postur aneh." },
    { t: "Stres-diatesis", id: "Kerentanan + stres memicu gangguan." },
    { t: "PANSS", id: "Positive and Negative Syndrome Scale." },
    { t: "SADS", id: "Schedule for Affective Disorders and Schizophrenia." }
  ],
  latihan: {
    pg: [
      { q: { id: "Pasien yakin dirinya utusan istimewa yang bisa mengendalikan cuaca. Jenis delusinya…" }, o: [{ id: "Persekutori" }, { id: "Grandiose (kebesaran)" }, { id: "Somatik" }, { id: "Nihilistik" }], j: 1 },
      { q: { id: "Pasien duduk berjam-jam tanpa inisiatif mandi, makan, atau bekerja meski mampu secara fisik. Gejala ini…" }, o: [{ id: "Alogia" }, { id: "Avolisi" }, { id: "Ekopraksia" }, { id: "Halusinasi" }], j: 1 },
      { q: { id: "Hiperaktivitas jalur dopamin mesolimbik terutama dikaitkan dengan…" }, o: [{ id: "Gejala negatif" }, { id: "Gejala positif" }, { id: "Gangguan memori saja" }, { id: "Afek tumpul" }], j: 1 },
      { q: { id: "Temuan bahwa gangguan neurokognitif terjadi independen dari gejala positif dan negatif berarti…" }, o: [{ id: "Mengobati halusinasi pasti memulihkan memori kerja" }, { id: "Defisit kognitif perlu dinilai dan ditangani tersendiri" }, { id: "Kognisi tidak terganggu" }, { id: "Hanya gejala negatif yang penting" }], j: 1 },
      { q: { id: "Pasien skizofrenia yang stabil 1 tahun tiba-tiba kambuh. Penyebab paling umum menurut slide…" }, o: [{ id: "Terlalu banyak tidur" }, { id: "Ketidakpatuhan terhadap pengobatan" }, { id: "Usia" }, { id: "Terlalu banyak terapi" }], j: 1 },
      { q: { id: "Seorang pasien mengalami halusinasi dan delusi selama 2 bulan, bersamaan dengan episode depresi mayor. Jenis yang paling sesuai…" }, o: [{ id: "Residual" }, { id: "Skizoafektif" }, { id: "Katatonik" }, { id: "Paranoid murni" }], j: 1 },
      { q: { id: "Dokter memberi antipsikotik; setelah 10 hari keluarga ingin berhenti karena “tidak ada perubahan”. Respons berbasis slide…" }, o: [{ id: "Setuju berhenti" }, { id: "Jelaskan bahwa uji coba memadai 6–12 minggu dan kepatuhan mencegah kekambuhan" }, { id: "Ganti dengan herbal" }, { id: "Gandakan dosis sendiri" }], j: 1 },
      { q: { id: "Pasien menjawab: “Meja lari biru tidur kemarin pintu.” Ini disebut…" }, o: [{ id: "Flight of ideas" }, { id: "Word salad" }, { id: "Sirkumstansial" }, { id: "Ekolalia" }], j: 1 },
      { q: { id: "Instrumen yang khusus mengukur keparahan gejala positif dan negatif adalah…" }, o: [{ id: "BDI" }, { id: "PANSS" }, { id: "STAI" }, { id: "WAIS" }], j: 1 },
      { q: { id: "Keluarga Muslim yakin anaknya yang mendengar bisikan “diganggu jin” dan menolak ke psikiater. Pendekatan yang dianjurkan slide…" }, o: [{ id: "Mengabaikan keyakinan keluarga" }, { id: "Konseling berbasis keimanan bersama konsultasi psikiatri" }, { id: "Hanya ruqyah tanpa medis" }, { id: "Menghentikan kontak dengan keluarga" }], j: 1 },
      { q: { id: "Pasien mempertahankan lengannya terangkat dalam posisi aneh selama berjam-jam setelah diposisikan pemeriksa. Ini…" }, o: [{ id: "Stereotipi" }, { id: "Waxy flexibility" }, { id: "Ekopraksia" }, { id: "Hiperwaspada" }], j: 1 }
    ],
    bs: [
      { t: { id: "Skizofrenia sama dengan kepribadian ganda." }, j: false },
      { t: { id: "Onset skizofrenia umumnya pada usia 15–25 tahun." }, j: true },
      { t: { id: "Skizofrenia disebabkan oleh disfungsi satu neurotransmiter saja." }, j: false },
      { t: { id: "Pembesaran ventrikel otak termasuk temuan neuroanatomi pada skizofrenia." }, j: true },
      { t: { id: "SADS terdiri dari tiga bagian: gejala saat ini, riwayat seumur hidup, dan tingkat perubahan." }, j: true }
    ],
    isian: [
      { t: { id: "Kraepelin menamai skizofrenia dengan istilah dementia ______." }, j: { id: "praecox" }, x: [{ id: "senilis" }, { id: "paranoid" }, { id: "simplex" }] },
      { t: { id: "Kerabat biologis tingkat pertama berisiko ______ kali lebih tinggi." }, j: { id: "10" }, x: [{ id: "2" }, { id: "50" }, { id: "100" }] }
    ],
    pilah: { t: { id: "Pilah gejala: positif atau negatif?" }, kategori: [{ id: "Positif" }, { id: "Negatif" }], item: [{ t: { id: "Halusinasi auditori" }, k: 0 }, { t: { id: "Anhedonia" }, k: 1 }, { t: { id: "Delusi dikejar" }, k: 0 }, { t: { id: "Alogia" }, k: 1 }, { t: { id: "Bicara kacau" }, k: 0 }, { t: { id: "Afek tumpul" }, k: 1 }] },
    urut: { t: { id: "Urutkan fase skizofrenia" }, item: [{ id: "Akut" }, { id: "Stabilisasi" }, { id: "Pemeliharaan & pemulihan" }, { id: "Kekambuhan (bila terjadi)" }] }
  },
  tugas: [
    { t: { id: "Bedakan gejala positif, negatif, dan neurokognitif skizofrenia beserta dasar biologisnya." }, j: { id: "Gejala positif adalah fungsi yang berlebih: delusi (kebesaran, persekutori, somatik), halusinasi, gangguan berpikir, bicara dan perilaku kacau; dikaitkan dengan hiperaktivitas dopamin jalur mesolimbik. Gejala negatif adalah berkurangnya fungsi normal: afek tumpul, alogia, avolisi, anhedonia, ambivalensi; dikaitkan dengan hipofrontalitas jalur mesokortikal. Gejala neurokognitif—gangguan memori kerja, kewaspadaan, kelancaran verbal, dan fungsi eksekutif—terjadi independen dari keduanya. Temuan lain: atrofi amigdala, hipokampus, parahipokampus; pembesaran ventrikel; penurunan aliran darah globus pallidus kiri; tidak disebabkan satu neurotransmiter saja; model stres-diatesis." } },
    { t: { id: "Rancang asesmen untuk klien Muslim yang dicurigai skizofrenia dan keluarganya yakin ia terkena gangguan jin." }, j: { id: "Mulai dengan asesmen biologis (riwayat kesehatan, fisik, nutrisi, cairan, penggunaan obat termasuk herbal dan zat, gerakan abnormal) untuk menyingkirkan penyebab medis. Lakukan SADS (gejala kini, riwayat seumur hidup, perubahan), MSE, MMPI (skala 8), dan PANSS untuk keparahan gejala positif dan negatif. Bedakan gejala positif dan negatif dengan teliti karena gejala positif sering dimaknai sebagai gangguan jin. Dengarkan atribusi keluarga (ujian, hukuman) dengan hormat, lalu tawarkan konseling berbasis iman bersamaan dengan konsultasi psikiatri, edukasi tentang antipsikotik (6–12 minggu, kepatuhan mencegah kambuh), dan libatkan keluarga sebagai caregiver." } }
  ]
});

/* PPTA 301 — Modul 10: Wawancara Klinis/Asesmen */
Kuliah.pertemuan("tes-psikologi", {
  no: 10, tema: 1, motif: "percakapan", motifOpt: { lbl: "Wawancara Klinis" }, durasi: 60,
  judul: { id: "Wawancara Klinis/Asesmen", en: "The Assessment Interview" },
  ringkas: { id: "Wawancara = **metode utama** pengumpulan data; tanpanya skor tes kehilangan makna. **Terstruktur** (SCID: psikometrik baik, bisa oleh tenaga kurang terlatih, tetapi kaku) vs **tidak terstruktur** (fleksibel, rapport, tetapi reliabilitas diragukan). Sejarah 1940-an → 1990-an (Rogers, DSM-III, managed care, **ingatan yang ditekan**). Reliabilitas naik dengan area spesifik & pelatihan; validitas terancam **efek halo**. Riwayat kasus semi-terstruktur (Tabel 3.1), tahap awal 7 langkah & cara mengakhiri." },
  tujuan: [
    { id: "Membandingkan wawancara terstruktur, semi-terstruktur, dan tidak terstruktur." },
    { id: "Menelusuri perkembangan wawancara klinis per dekade." },
    { id: "Mengenali bias pewawancara dan menerapkan tahap awal & akhir wawancara." }
  ],
  isi: [
    { t: "pembuka", id: "Skor MMPI yang tinggi pada skala depresi bisa berarti duka karena kematian ayah minggu lalu — atau depresi kronis bertahun-tahun. **Hanya wawancara** yang bisa membedakannya. Wawancara juga satu-satunya cara mengamati **respons individu terhadap situasi hidupnya** dan sarana utama membangun **kepercayaan**." },
    { t: "daftar", judul: { id: "Ciri wawancara klinis" }, item: [{ id: "Punya **urutan jelas** — berbeda dari percakapan biasa." }, { id: "Disusun berdasarkan **tema spesifik & relevan** untuk tujuan tertentu." }, { id: "Dapat mengharuskan klien membahas **peristiwa traumatis** & emosi tak menyenangkan." }, { id: "Ada yang memakai penilaian terstruktur/daftar periksa, ada yang lebih bebas." }] },
    { t: "banding", judul: { id: "Terstruktur vs tidak terstruktur" }, kiri: { judul: { id: "Terstruktur (mis. SCID)" }, warna: "blue", poin: [{ id: "Properti **psikometrik** baik; cocok untuk **riset**" }, { id: "Bisa dilakukan tenaga **kurang terlatih**" }, { id: "✗ Kurang efektif membangun rapport" }, { id: "✗ Berisiko kehilangan detail unik klien" }] }, kanan: { judul: { id: "Tidak terstruktur" }, warna: "green", poin: [{ id: "**Fleksibel**; meningkatkan hubungan terapeutik" }, { id: "Melihat **cara klien mengorganisasi** responsnya" }, { id: "✗ Reliabilitas & validitas **dipertanyakan**" }, { id: "✗ Banyak dikritik" }] } },
    { t: "judul", id: "Sejarah & perkembangan" },
    { t: "catatan", gaya: "info", id: "Awalnya meniru format **medis**, lalu dipengaruhi **psikoanalisis**. Tujuan umumnya: (1) gambaran psikologis individu, (2) faktor penyebab kesulitan saat ini, (3) **diagnosis**, (4) **rencana intervensi**." },
    { t: "anim", jenis: "garis-waktu", judul: { id: "Wawancara klinis dari dekade ke dekade" }, item: [
      { th: "1940–50-an", judul: { id: "Konseptualisasi dimensi wawancara" }, ket: { id: "Isi vs **proses**; orientasi tujuan vs elemen ekspresif; tingkat **direktivitas**; seberapa terstruktur; tingkat aktivitas partisipan." } },
      { th: "1960-an", judul: { id: "Carl Rogers & fragmentasi aliran" }, ket: { id: "**Kehangatan & penerimaan positif tanpa syarat**; asesmen perilaku berorientasi tujuan; aliran terpecah: perilaku vs terapi keluarga vs eksplorasi diri." } },
      { th: "1970-an", judul: { id: "Wawancara terstruktur naik" }, ket: { id: "Asesmen anak mulai menekankan **pengalaman subjektif anak**, bukan hanya laporan orang tua; minat pada data biografis, komputer daring, pelatihan pewawancara." } },
      { th: "1980-an", judul: { id: "DSM-III" }, ket: { id: "Wawancara makin terstruktur — batas **tes vs wawancara** kabur; kombinasi terstruktur & terbuka; perhatian pada **budaya & gender**." } },
      { th: "1990-an+", judul: { id: "Managed care & ingatan yang ditekan" }, ket: { id: "Efektivitas biaya → info secepat mungkin. Kontroversi **repressed memories**: laporan diri = **rekonstruksi**; gaya wawancara tak boleh mendistorsi (mis. investigasi pelecehan masa kanak-kanak)." } }
    ] },
    { t: "judul", id: "Reliabilitas & validitas wawancara" },
    { t: "daftar", item: [{ id: "Banyak sumber **bias**, terutama wawancara tidak terstruktur." }, { id: "Reliabilitas pewawancara ≈ **kesepakatan antar-rater**; riset menunjukkan variasi besar." }, { id: "Reliabilitas **naik** bila pewawancara diberi **area asesmen spesifik** dan **pelatihan strategi**; wawancara sangat terstruktur cenderung lebih reliabel." }] },
    { t: "catatan", gaya: "tanbih", judul: { id: "Ancaman validitas: bias pewawancara" }, id: "Klien yang tampak **hangat** cenderung dinilai **sehat**; **kesan pertama** memengaruhi penilaian berikutnya. **Efek halo**: pewawancara membentuk kesan umum lalu menyimpulkan karakteristik lain yang \"tampak berkaitan\" — klien berpenampilan rapi & ramah dikira juga jujur, cerdas, dan bebas gangguan." },
    { t: "judul", id: "Riwayat kasus semi-terstruktur" },
    { t: "catatan", gaya: "faidah", id: "Tabel 3.1 (hlm. 79): **riwayat masalah, latar belakang keluarga, sejarah pribadi** — masa kanak-kanak awal & pertengahan, remaja, dewasa awal & pertengahan, usia lanjut, dan aspek lain. Pertanyaannya **fleksibel**. Perhatikan **isyarat nonverbal** (kontak mata, gerakan tangan); catatan **secukupnya** (terlalu banyak membuat cemas); rekaman audio/video dengan izin." },
    { t: "langkah", judul: { id: "Tahap awal wawancara (7 langkah)" }, item: [
      { judul: { id: "Atur ruangan" }, id: "Pencahayaan; jarak duduk tidak terlalu dekat/jauh." }, { judul: { id: "Perkenalan" }, id: "Nama & cara ingin disapa (mis. Dr. [nama depan])." }, { judul: { id: "Tujuan" }, id: "Nyatakan tujuan wawancara." },
      { judul: { id: "Penggunaan informasi" }, id: "Bagaimana data akan dipakai." }, { judul: { id: "Kerahasiaan" }, id: "Aspek & batasannya." }, { judul: { id: "Peran & instrumen" }, id: "Aktivitas klien, instrumen, durasi." }, { judul: { id: "Biaya" }, id: "Bila berlaku." }
    ] },
    { t: "catatan", gaya: "info", judul: { id: "Mengakhiri wawancara" }, id: "Beri tahu klien saat tersisa **5–10 menit**, dan beri kesempatan **bertanya atau berkomentar** sebelum berakhir." },
    { t: "catatan", gaya: "hikmah", luar: true, judul: { id: "Adab mendengar" }, id: "Rasulullah ﷺ mendengarkan lawan bicara hingga selesai dan menghadap dengan seluruh tubuhnya — teladan **penerimaan positif** yang mendahului Rogers berabad-abad. Mendengar dengan penuh perhatian adalah fondasi rapport.", ref: "Rassool, Islamic Counselling (2016); sirah Nabi ﷺ" },
    { t: "ringkasan", item: [{ id: "Wawancara = metode utama; memberi makna pada skor & membangun kepercayaan." }, { id: "Terstruktur (SCID): reliabel, kaku; tidak terstruktur: fleksibel, kurang reliabel." }, { id: "Rogers 1960-an; DSM-III 1980-an; managed care & repressed memories 1990-an." }, { id: "Reliabilitas naik dengan area spesifik & pelatihan; efek halo mengancam validitas." }, { id: "Tahap awal 7 langkah; akhiri dengan peringatan 5–10 menit & kesempatan bertanya." }] },
    { t: "cek", q: { id: "Peneliti ingin mendiagnosis 500 responden secara konsisten oleh pewawancara mahasiswa terlatih singkat. Format yang paling tepat adalah…" }, o: [{ id: "Wawancara tidak terstruktur" }, { id: "Wawancara terstruktur seperti SCID" }, { id: "Tes proyektif" }, { id: "Observasi naratif" }], j: 1, b: { id: "Terstruktur: psikometrik baik, cocok riset, bisa oleh tenaga kurang terlatih." } }
  ],
  istilah: [
    { t: "SCID", id: "Structured Clinical Interview for DSM — wawancara terstruktur." },
    { t: "Wawancara semi-terstruktur", id: "Topik ditentukan, pertanyaan fleksibel (Tabel 3.1)." },
    { t: "Unconditional positive regard", id: "Penerimaan positif tanpa syarat (Rogers)." },
    { t: "Managed care", id: "Sistem layanan yang menekankan efisiensi biaya." },
    { t: "Repressed memories", id: "Kontroversi ingatan yang ditekan; laporan = rekonstruksi." },
    { t: "Efek halo", id: "Kesan umum memengaruhi penilaian karakteristik lain." },
    { t: "Case history", id: "Riwayat kasus: masalah, keluarga, perkembangan." }
  ],
  latihan: {
    pg: [
      { q: { id: "Klinisi ingin memahami bagaimana klien menyusun ceritanya sendiri tentang konflik keluarga dan membangun kepercayaan di sesi pertama. Format yang paling sesuai adalah…" }, o: [{ id: "SCID" }, { id: "Wawancara tidak terstruktur/semi-terstruktur" }, { id: "Checklist ya/tidak" }, { id: "Tes Benar/Salah" }], j: 1 },
      { q: { id: "Kelemahan utama wawancara terstruktur adalah…" }, o: [{ id: "Reliabilitas rendah" }, { id: "Kurang efektif membangun rapport dan dapat melewatkan detail unik klien" }, { id: "Tidak bisa dipakai riset" }, { id: "Butuh pewawancara sangat ahli" }], j: 1 },
      { q: { id: "Pewawancara menilai klien yang berpakaian rapi dan ramah sebagai “stabil emosinya dan jujur” tanpa bukti. Ini contoh…" }, o: [{ id: "Efek halo" }, { id: "Reliabilitas antar-rater" }, { id: "Validitas konten" }, { id: "Inviolacy" }], j: 0 },
      { q: { id: "Dekade ketika asesmen anak mulai menekankan pengalaman subjektif anak, bukan hanya laporan orang tua, adalah…" }, o: [{ id: "1950-an" }, { id: "1960-an" }, { id: "1970-an" }, { id: "1990-an" }], j: 2 },
      { q: { id: "Kontroversi “ingatan yang ditekan” (1990-an) mengajarkan pewawancara untuk…" }, o: [{ id: "Menggali sedalam mungkin dengan pertanyaan sugestif" }, { id: "Menjaga gaya wawancara agar tidak mendistorsi informasi, karena laporan diri adalah rekonstruksi" }, { id: "Tidak pernah menanyakan masa kecil" }, { id: "Selalu merekam video" }], j: 1 },
      { q: { id: "Cara paling efektif meningkatkan reliabilitas antar-rater wawancara adalah…" }, o: [{ id: "Membiarkan pewawancara bebas sepenuhnya" }, { id: "Memberi area asesmen spesifik dan pelatihan strategi wawancara" }, { id: "Memperpendek wawancara" }, { id: "Mengganti pewawancara tiap 5 menit" }], j: 1 },
      { q: { id: "Langkah yang BUKAN bagian tahap awal wawancara menurut slide adalah…" }, o: [{ id: "Mengatur ruangan & jarak duduk" }, { id: "Menjelaskan batas kerahasiaan" }, { id: "Menjelaskan pengaturan biaya" }, { id: "Memberikan diagnosis sementara" }], j: 3 },
      { q: { id: "Menjelang akhir wawancara, pewawancara sebaiknya…" }, o: [{ id: "Berhenti mendadak tepat waktu" }, { id: "Memberi tahu saat tersisa 5–10 menit dan memberi kesempatan bertanya" }, { id: "Menambah topik trauma baru" }, { id: "Menyerahkan hasil tes" }], j: 1 },
      { q: { id: "Pengaruh managed health care (1990-an) terhadap wawancara adalah…" }, o: [{ id: "Wawancara makin panjang" }, { id: "Tuntutan mengumpulkan informasi penting dalam waktu sesingkat mungkin" }, { id: "Wawancara dihapus" }, { id: "Fokus pada psikoanalisis" }], j: 1 }
    ],
    bs: [
      { t: { id: "Tanpa data wawancara, sebagian besar tes psikologis sulit diinterpretasikan." }, j: true },
      { t: { id: "Wawancara terstruktur harus selalu dilakukan oleh psikolog senior." }, j: false },
      { t: { id: "Carl Rogers menekankan kehangatan dan penerimaan positif tanpa syarat." }, j: true },
      { t: { id: "Mencatat sebanyak mungkin selama wawancara selalu dianjurkan." }, j: false },
      { t: { id: "Pada 1980-an, batas antara tes dan wawancara menjadi kabur." }, j: true }
    ],
    isian: [
      { t: { id: "Contoh wawancara terstruktur untuk DSM adalah ______." }, j: { id: "SCID" }, x: [{ id: "MMPI" }, { id: "TAT" }, { id: "WAIS" }] },
      { t: { id: "Kesan umum yang memengaruhi penilaian karakteristik lain disebut efek ______." }, j: { id: "halo" }, x: [{ id: "primasi" }, { id: "plasebo" }, { id: "carryover" }] }
    ],
    urut: { t: { id: "Urutkan perkembangan wawancara klinis" }, item: [{ id: "Dimensi isi vs proses (1940–50-an)" }, { id: "Rogers & penerimaan positif (1960-an)" }, { id: "Fokus terstruktur & subjektivitas anak (1970-an)" }, { id: "DSM-III (1980-an)" }, { id: "Managed care & repressed memories (1990-an)" }] },
    pilah: { t: { id: "Pilah: TERSTRUKTUR atau TIDAK TERSTRUKTUR?" }, kategori: [{ id: "Terstruktur" }, { id: "Tidak terstruktur" }], item: [
      { t: { id: "Psikometrik baik" }, k: 0 }, { t: { id: "Fleksibel" }, k: 1 }, { t: { id: "Bisa oleh tenaga kurang terlatih" }, k: 0 }, { t: { id: "Melihat organisasi respons klien" }, k: 1 }, { t: { id: "Cocok untuk riset" }, k: 0 }, { t: { id: "Reliabilitas dipertanyakan" }, k: 1 }
    ] }
  },
  tugas: [
    { t: { id: "Mengapa wawancara klinis disebut metode utama asesmen? Bandingkan format terstruktur dan tidak terstruktur." }, j: { id: "Tanpa wawancara, skor tes kehilangan makna atau sulit ditafsirkan dalam konteks individu; wawancara memberi observasi perilaku, respons terhadap situasi hidup yang tak bisa diperoleh dari tes, serta membangun hubungan terapeutik dan kepercayaan. Terstruktur (mis. SCID) memiliki properti psikometrik baik, cocok untuk riset, dan bisa dilakukan tenaga kurang terlatih, tetapi kurang membangun rapport dan dapat melewatkan detail unik. Tidak terstruktur fleksibel, meningkatkan hubungan terapeutik, dan memperlihatkan cara klien mengorganisasi respons, tetapi reliabilitas dan validitasnya dipertanyakan." } },
    { t: { id: "Jelaskan sumber bias dalam wawancara dan cara meningkatkan reliabilitasnya." }, j: { id: "Bias muncul terutama pada wawancara tidak terstruktur: klien yang tampak hangat cenderung dinilai sehat, kesan pertama memengaruhi penilaian berikutnya, dan efek halo membuat pewawancara menyimpulkan karakteristik lain dari kesan umum. Reliabilitas (kesepakatan antar-rater) meningkat bila pewawancara diberi area asesmen yang spesifik dan dilatih strategi wawancara; wawancara sangat terstruktur cenderung paling reliabel. Pada topik sensitif seperti ingatan masa kecil, gaya wawancara harus netral agar tidak mendistorsi informasi." } }
  ]
});

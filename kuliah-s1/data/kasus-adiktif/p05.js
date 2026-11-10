/* PPAB301 — Materi dosen · LS01: Pengantar adiksi, sejarah, isu & pandangan Islam (Ahmad Yunus) */
Kuliah.pertemuan("kasus-adiktif", {
  no: 5, tema: 0, motif: "otak", motifOpt: { lbl: "LS 01" }, durasi: 60,
  judul: { id: "LS01 · Pengantar Adiksi: Sejarah, Isu & Pandangan Islam", en: "LS01 · Introduction to Addiction" },
  ringkas: { id: "Ringkasan materi pertemuan langsung (LS) 1 oleh **Ahmad Yunus, S.Pd., M.Couns.** — melengkapi Modul 1–5: definisi adiksi (NIDA 2020, ASAM), 4 alasan memakai zat, **sirkuit hadiah otak** (VTA, nucleus accumbens, korteks prefrontal, hipokampus), *Go–Stop*, siklus adiksi & *habit loop*, **HALT**, kriteria DSM-5 SUD (11) & judi (9), 10 kelas zat, spektrum penggunaan, istilah kunci, adiksi perilaku, klasifikasi **NAPZA**, stigma, dampak adiksi, dan pandangan Islam." },
  tujuan: [
    { id: "Menjelaskan konsep dasar adiksi secara konseptual dan neurobiologis." },
    { id: "Membedakan adiksi zat dan non-zat serta kriteria DSM-5-nya." },
    { id: "Menjelaskan dampak, stigma, dan posisi normatif Islam terhadap zat memabukkan." }
  ],
  isi: [
    { t: "pembuka", id: "\"Adiksi tidak akan pernah berhenti, melainkan hanya akan bersalin rupa dan berganti identitas.\" — Ahmad Yunus. Karena itu pencegahan dan pemulihan adalah **proses sepanjang hayat**." },
    { t: "definisi", judul: { id: "Definisi adiksi" }, lughah: { id: "**NIDA (2020):** gangguan **kronis dan kambuh** yang ditandai pencarian dan penggunaan zat — atau perilaku lain seperti judi, game, pornografi — secara **kompulsif** meskipun ada konsekuensi buruk; dianggap **gangguan otak** karena mengubah sirkuit hadiah, stres, dan kendali diri, bahkan lama setelah berhenti." }, istilah: { id: "**ASAM:** penyakit medis kronis yang **dapat diobati**, melibatkan interaksi sirkuit otak, genetika, lingkungan, dan pengalaman hidup. Pencegahan dan pengobatannya sama berhasilnya dengan penyakit kronis lain." } },
    { t: "poin", judul: { id: "Empat alasan orang memakai zat / berperilaku adiktif" }, item: [
      { ikon: "compass", judul: { id: "To explore" }, id: "Mencari kebaruan & sensasi." },
      { ikon: "heart", judul: { id: "To feel good" }, id: "Mencari nikmat/euforia." },
      { ikon: "shield", judul: { id: "To feel better" }, id: "Meredakan cemas, stres, depresi (*self-medication*)." },
      { ikon: "trophy", judul: { id: "To do better" }, id: "Meningkatkan performa, \"bertahan\"." }
    ] },
    { t: "judul", id: "Apa yang terjadi di dalam otak?" },
    { t: "tabel", kolom: ["Bagian otak", "Sistem", "Peran dalam adiksi"], baris: [
      ["**Ventral Tegmental Area (VTA)**", "Dopamin", "Pusat sirkuit mesokortikolimbik; lonjakan dopamin saat konsumsi zat"],
      ["**Nucleus accumbens**", "Dopamin", "Pusat kenikmatan (*reward center*) — **inti kecanduan**"],
      ["**Korteks prefrontal**", "Dopamin & serotonin", "Kendali diri melemah → sulit menahan keinginan"],
      ["**Striatum**", "Dopamin", "Membentuk **kebiasaan** otomatis"],
      ["**Substantia nigra**", "Dopamin", "Gerakan halus; terkait kebiasaan"],
      ["**Hipokampus**", "Serotonin & dopamin", "Mengingat pengalaman \"nikmat\" & konteksnya → memicu **relapse**"],
      ["**Raphe nucleus**", "Serotonin", "Mood & tidur; gangguan → mood labil, risiko adiksi"]
    ] },
    { t: "anim", jenis: "profil", judul: { id: "Perbandingan pelepasan dopamin (% dari baseline)" }, mode: "batang", min: 0, max: 1400, skala: [{ k: "Makan", v: 150 }, { k: "Game", v: 175 }, { k: "Seks", v: 200 }, { k: "Kokain", v: 450 }, { k: "Amfet.", v: 1000 }, { k: "Metamfet.", v: 1300 }], ket: { id: "Sumber slide: Ferguson (2018), SAMHSA. Zat melonjakkan dopamin jauh di atas hadiah alami — otak lalu menganggap zat sebagai kebutuhan bertahan hidup (\"pembajakan\")." } },
    { t: "banding", judul: { id: "Kerangka Go–Stop (Koob & Volkow)" }, kiri: { judul: { id: "Otak tidak adiktif" }, warna: "green", poin: [{ id: "Korteks prefrontal & girus singulata **mampu berkata STOP** pada dorongan" }] }, kanan: { judul: { id: "Otak adiktif" }, warna: "red", poin: [{ id: "Salience (NAc) & dorongan (OFC) menguat; kendali (PFC) melemah → **GO**: kompulsi memakai" }] } },
    { t: "anim", jenis: "siklus", judul: { id: "Siklus adiksi (7 langkah)" }, pusat: { id: "Siklus" }, item: [
      { judul: { id: "1. Zat dipakai" } }, { judul: { id: "2. Nikmat dari dopamin" } }, { judul: { id: "3. Otak menandai \"penting untuk bertahan\"" } },
      { judul: { id: "4. Withdrawal & rasa negatif saat efek habis" } }, { judul: { id: "5. Craving" } }, { judul: { id: "6. Preokupasi → memakai lagi" } }, { judul: { id: "7. Siklus berulang" } }
    ] },
    { t: "anim", jenis: "alur", judul: { id: "4 tahap habit loop (James Clear)" }, item: [{ judul: { id: "Cue" }, ket: { id: "Isyarat pemicu" } }, { judul: { id: "Craving" }, ket: { id: "Keinginan" } }, { judul: { id: "Response" }, ket: { id: "Perilaku" } }, { judul: { id: "Reward" }, ket: { id: "Hadiah" } }] },
    { t: "catatan", gaya: "faidah", judul: { id: "People, Places & Things + HALT" }, id: "Pemulihan berarti mengenali **orang, tempat, dan benda** yang mengingatkan pada zat. **HALT** = empat tanda peringatan relapse: **H**ungry (lapar), **A**ngry (marah), **L**onely (kesepian), **T**ired (lelah). Respons: makan bergizi, ekspresikan emosi dengan sehat, hubungi pendukung, istirahat 7–8 jam." },
    { t: "catatan", gaya: "info", judul: { id: "Kekurangan & cara sehat menaikkan \"zat bahagia\"" }, id: "**Dopamin** (hadiah): menyelesaikan tugas, merawat diri, makan, merayakan keberhasilan kecil. **Oksitosin** (cinta): bermain dengan hewan/bayi, berpegangan tangan, memeluk keluarga, memuji. **Serotonin** (mood): meditasi/dzikir, lari, sinar matahari, alam, berenang, bersepeda. **Endorfin** (pereda nyeri): tertawa, aroma, komedi, cokelat hitam, olahraga. Terlalu banyak dopamin buatan → **kepekaan nikmat menurun, crash, motivasi hilang**." },
    { t: "judul", id: "Kriteria & simptom adiksi" },
    { t: "tabel", judul: { id: "11 kriteria DSM-5 Substance Use Disorder (4 domain)" }, kolom: ["Domain", "Kriteria"], baris: [
      ["**A. Kontrol terganggu**", "1. Jumlah/lama melebihi rencana · 2. Ingin/gagal mengurangi · 3. Banyak waktu untuk memperoleh, memakai, pulih · 4. Craving"],
      ["**B. Hendaya sosial**", "5. Gagal memenuhi peran utama · 6. Tetap memakai meski masalah interpersonal · 7. Aktivitas penting ditinggalkan"],
      ["**C. Penggunaan berisiko**", "8. Situasi berbahaya secara fisik · 9. Tetap memakai meski tahu masalah fisik/psikologis"],
      ["**D. Farmakologis**", "10. Toleransi · 11. Withdrawal"]
    ] },
    { t: "anim", jenis: "spektrum", judul: { id: "Keparahan SUD" }, min: 0, max: 11, satuan: "Jumlah kriteria dalam 12 bulan", awal: 4, rentang: [{ label: { id: "Bukan SUD" }, dari: 0, sampai: 2 }, { label: { id: "Ringan (2–3)" }, dari: 2, sampai: 4 }, { label: { id: "Sedang (4–5)" }, dari: 4, sampai: 6 }, { label: { id: "Berat (≥ 6)" }, dari: 6, sampai: 11 }], ket: { id: "DSM-IV dulu membedakan *abuse* & *dependence*; DSM-5 menyatukannya menjadi satu kontinum **use disorder**. Kriteria \"masalah hukum\" dihapus; **craving** ditambahkan." } },
    { t: "tabel", judul: { id: "Gangguan judi vs SUD" }, kolom: ["Aspek", "Gambling Disorder", "SUD"], baris: [["Jumlah kriteria", "9", "11"], ["Cut-off", "≥ 4 dalam 12 bulan", "≥ 2 dalam 12 bulan"], ["Keparahan", "Ringan 4–5 · Sedang 6–7 · Berat 8–9", "Ringan 2–3 · Sedang 4–5 · Berat ≥ 6"], ["Farmakologis", "Tidak ada (mirip withdrawal: gelisah saat berhenti)", "Toleransi & withdrawal"], ["Khas", "*Chasing losses*, berbohong, bergantung pada orang lain untuk uang", "Craving, penggunaan berbahaya"], ["Spesifier", "Episodik/persisten; remisi awal ≥ 3 bln < 12 bln; berkelanjutan ≥ 12 bln", "Remisi awal/berkelanjutan; lingkungan terkontrol; terapi rumatan"]] },
    { t: "daftar", judul: { id: "10 kelas zat dalam DSM-5" }, item: [{ id: "Alkohol" }, { id: "Kafein (perlu riset lanjutan untuk use disorder)" }, { id: "Ganja (cannabis)" }, { id: "Halusinogen (mis. PCP, MDMA)" }, { id: "Inhalansia" }, { id: "Opioid (mis. heroin)" }, { id: "Sedatif, hipnotik, ansiolitik (mis. benzodiazepin)" }, { id: "Stimulan (kokain, metamfetamin)" }, { id: "Tembakau" }, { id: "Lainnya/tidak diketahui" }] },
    { t: "anim", jenis: "alur", judul: { id: "5 tahap perkembangan adiksi" }, item: [{ judul: { id: "Eksperimen" }, ket: { id: "Mencoba pertama kali" } }, { judul: { id: "Penggunaan teratur" } }, { judul: { id: "Penggunaan berisiko" }, ket: { id: "Mulai merugikan" } }, { judul: { id: "Ketergantungan" }, ket: { id: "Bergantung fisik & psikologis" } }, { judul: { id: "Adiksi" }, ket: { id: "Kompulsif meski konsekuensi berat" } }] },
    { t: "catatan", gaya: "info", judul: { id: "Spektrum penggunaan zat" }, id: "**Tidak memakai** → **penggunaan bermanfaat** (mis. obat sesuai resep) → **risiko rendah** → **risiko tinggi** → **adiksi**. Orang dapat bergerak maju-mundur sepanjang spektrum. Dalam piramida WHO: non-pengguna → penggunaan risiko rendah → *hazardous use* → *harmful use* (ICD) → *dependence* (ICD) / *use disorder* (DSM-5)." },
    { t: "judul", id: "Adiksi perilaku & NAPZA" },
    { t: "daftar", judul: { id: "Adakah adiksi selain narkoba?" }, item: [{ id: "**Judi** (Gambling Disorder, DSM-5)" }, { id: "**Game** (Gaming Disorder, ICD-11 6C51) & penggunaan media sosial/internet bermasalah (mis. TikTok/Facebook pada remaja Bangladesh — Begum dkk.)" }, { id: "**Pornografi** & hiperseksualitas (dipetakan: impulsif, kompulsif, *reward deficiency syndrome*, genetik & epigenetik)" }, { id: "**Belanja**, **olahraga** (dari teratur → bersemangat → berlebihan → adiksi → cedera), **tanning/UV**, **makanan**" }] },
    { t: "tabel", judul: { id: "NAPZA (Narkotika, Psikotropika, Zat Adiktif)" }, kolom: ["Komponen", "Sifat", "Contoh"], baris: [["**Narkotika**", "Depresan; analgesik kuat, sedatif, euforia", "Heroin, morfin, ganja (dalam UU RI)"], ["**Psikotropika**", "Stimulan, depresan, atau halusinogen", "Amfetamin, ekstasi, diazepam"], ["**Zat adiktif lain**", "Psikoaktif ringan–sedang, dipakai sosial", "Alkohol, nikotin, inhalansia"]] },
    { t: "tabel", judul: { id: "Pengelompokan zat menurut efek (Drugs World)" }, kolom: ["Kelompok", "Contoh", "Mekanisme"], baris: [["**Stimulan (uppers)**", "Amfetamin, kokain, katinon; kafein; modafinil", "↑ dopamin & noradrenalin; antagonis adenosin (kafein)"], ["**Depresan (downers)**", "Benzodiazepin, barbiturat, alkohol, opioid", "↑ GABA; aktivasi reseptor μ-opioid"], ["**Halusinogen (trips)**", "LSD, psilosibin, DMT; MDMA, meskalin; ketamin, PCP; skopolamin", "Agonis 5-HT2A; antagonis NMDA (disosiatif); antagonis asetilkolin (delirian)"], ["**Campuran**", "Ganja (THC), GHB, kava, ibogain", "CB1; GABA"], ["**Lainnya**", "Nikotin, muskarin", "Reseptor kolinergik"]] },
    { t: "judul", id: "Stigma, dampak, & Islam" },
    { t: "catatan", gaya: "tanbih", judul: { id: "Stigma = prasangka + diskriminasi" }, id: "Latihan \"jarak sosial\" di kelas: maukah kita **menikah, berteman dekat, bertetangga, bekerja bersama** dengan mantan pengguna? Stigma membuat orang **tidak mencari bantuan**. Ubah bahasa: dari \"pecandu/junkie\" menjadi **\"orang dengan gangguan penggunaan zat\"**; dari \"bersih\" menjadi **\"dalam pemulihan\"**. Ingat: adiksi adalah **kondisi medis**, bukan pilihan semata." },
    { t: "daftar", judul: { id: "Kerugian akibat adiksi" }, item: [{ id: "**Individu:** kesehatan fisik & mental, ketergantungan, penurunan kognitif & kendali diri, risiko kematian." }, { id: "**Keluarga:** kehilangan peran, konflik, beban emosional & stigma, *broken family*." }, { id: "**Ekonomi:** produktivitas hilang, pengangguran, biaya rehabilitasi." }, { id: "**Sistem kesehatan:** biaya layanan & perawatan jangka panjang." }, { id: "**Sosial & kriminalitas:** kejahatan, perdagangan narkoba, pencucian uang." }, { id: "**Masyarakat & lingkungan:** kesejahteraan turun, kerusakan fasilitas, dampak produksi narkoba." }] },
    { t: "hadits", ar: "مَا أَسْكَرَ كَثِيرُهُ فَقَلِيلُهُ حَرَامٌ", id: "Sesuatu yang banyaknya memabukkan, maka sedikitnya pun haram.", src: "HR. Abu Dawud no. 3681 (dikutip slide LS01)" },
    { t: "hadits", ar: "نَهَى رَسُولُ اللَّهِ ﷺ عَنْ كُلِّ مُسْكِرٍ وَمُفْتِرٍ", id: "Rasulullah ﷺ melarang segala yang memabukkan dan yang melemahkan (mufattir).", src: "HR. Abu Dawud no. 3686, dari Ummu Salamah (dikutip slide LS01)" },
    { t: "catatan", gaya: "hikmah", judul: { id: "Pendosa atau hamba yang sedang diuji?" }, id: "Kisah **Abdullah \"Himar\"** (HR. al-Bukhari no. 6780): seorang sahabat berkali-kali dihukum karena minum; ketika seseorang melaknatnya, Nabi ﷺ bersabda, *\"Jangan kalian melaknatnya; demi Allah, yang aku tahu ia mencintai Allah dan Rasul-Nya.\"* Hadits tentang menghina dosa orang lain: siapa mencela saudaranya karena dosa yang sudah ia taubati, ia tidak mati sebelum melakukannya (HR. at-Tirmidzi no. 2505 — dikutip slide; sanadnya dinilai sangat lemah oleh al-Albani, sehingga cukup dipakai sebagai nasihat, bukan dalil utama). Pesan dosen: adiksi adalah **masalah bersama** — konsep **ummah**, satu tubuh satu hati. Contoh program: masjid di Malaysia memberi terapi narkoba; rujukan *Overcoming Addiction: An Islamic Approach to Recovery* (Tayba Foundation), *Treating Addiction from an Islamic Psychology Perspective* (G. Hussein Rassool), *Hope for the Muslim Alcoholic* (Yunus P.)." },
    { t: "ayat", ar: "يَا أَيُّهَا الَّذِينَ آمَنُوا لَا تَأْكُلُوا أَمْوَالَكُم بَيْنَكُم بِالْبَاطِلِ إِلَّا أَن تَكُونَ تِجَارَةً عَن تَرَاضٍ مِّنكُمْ ۚ وَلَا تَقْتُلُوا أَنفُسَكُمْ ۚ إِنَّ اللَّهَ كَانَ بِكُمْ رَحِيمًا", id: "Wahai orang-orang yang beriman, janganlah kamu saling memakan harta sesamamu dengan cara batil, kecuali dengan perdagangan yang berlaku suka sama suka di antara kamu; dan janganlah kamu membunuh dirimu. Sungguh Allah Maha Penyayang kepadamu.", src: "An-Nisa' [4]: 29" },
    { t: "ringkasan", item: [{ id: "Adiksi: gangguan otak kronis-kambuh, kompulsif, dapat diobati (NIDA, ASAM)." }, { id: "VTA → nucleus accumbens → PFC; hipokampus memicu relapse; Go–Stop." }, { id: "SUD ≥ 2/11 (ringan 2–3, sedang 4–5, berat ≥ 6); judi ≥ 4/9." }, { id: "HALT, people–places–things, habit loop." }, { id: "NAPZA; stigma = prasangka + diskriminasi; Islam: haram yang memabukkan, tetapi kasih sayang & taubat." }] }
  ],
  istilah: [
    { t: "Craving", id: "Dorongan kuat memakai zat, dipicu kondisi internal atau isyarat." },
    { t: "Toleransi", id: "Respons menurun sehingga butuh dosis lebih tinggi." },
    { t: "Impulsivitas", id: "Bertindak cepat tanpa pertimbangan; memilih hadiah langsung." },
    { t: "Kompulsivitas", id: "Perilaku berulang meski tahu dampak negatif." },
    { t: "Penguatan positif", id: "Penggunaan meningkat karena menimbulkan nikmat." },
    { t: "Penguatan negatif", id: "Penggunaan dipertahankan untuk menghindari rasa tidak enak." },
    { t: "Cue reactivity", id: "Respons psikofisiologis terhadap isyarat terkait zat." },
    { t: "Relapse", id: "Kembali memakai setelah abstinen." },
    { t: "Abstinensi", id: "Sengaja tidak memakai zat." },
    { t: "Harm reduction", id: "Meminimalkan dampak buruk tanpa menuntut berhenti total." },
    { t: "Incentive salience", id: "Zat menjadi sangat menarik akibat sensitisasi dopamin." },
    { t: "Neuroadaptasi", id: "Perubahan otak akibat paparan berulang." },
    { t: "Automaticity", id: "Perilaku otomatis tanpa kesadaran penuh." },
    { t: "HALT", id: "Hungry, Angry, Lonely, Tired — tanda waspada relapse." },
    { t: "NAPZA", id: "Narkotika, Psikotropika, dan Zat Adiktif lainnya." }
  ],
  latihan: {
    pg: [
      { q: { id: "Bagian otak yang disebut “inti dari kecanduan” karena memberi rasa nikmat adalah…" }, o: [{ id: "Raphe nucleus" }, { id: "Nucleus accumbens" }, { id: "Substantia nigra" }, { id: "Serebelum" }], j: 1 },
      { q: { id: "Hipokampus berperan dalam relapse karena…" }, o: [{ id: "Mengatur gerakan" }, { id: "Menyimpan ingatan pengalaman nikmat beserta konteksnya" }, { id: "Memproduksi serotonin" }, { id: "Mengatur napas" }], j: 1 },
      { q: { id: "Klien kambuh setiap kali sendirian di kos pada malam hari dan kelelahan. Tanda HALT yang terlibat…" }, o: [{ id: "Hungry & Angry" }, { id: "Lonely & Tired" }, { id: "Angry & Hungry" }, { id: "Tidak ada" }], j: 1 },
      { q: { id: "Seseorang memenuhi 4 kriteria SUD. Keparahannya…" }, o: [{ id: "Ringan" }, { id: "Sedang" }, { id: "Berat" }, { id: "Bukan SUD" }], j: 1 },
      { q: { id: "Kriteria DSM-IV yang DIHAPUS dalam DSM-5 untuk SUD adalah…" }, o: [{ id: "Craving" }, { id: "Masalah hukum berulang" }, { id: "Toleransi" }, { id: "Withdrawal" }], j: 1 },
      { q: { id: "Ekstasi (MDMA) dalam pengelompokan zat termasuk…" }, o: [{ id: "Opioid" }, { id: "Phenethylamine (halusinogen dengan efek stimulan)" }, { id: "Benzodiazepin" }, { id: "Barbiturat" }], j: 1 },
      { q: { id: "Ungkapan yang paling sesuai untuk mengurangi stigma adalah…" }, o: [{ id: "Junkie" }, { id: "Orang dengan gangguan penggunaan zat" }, { id: "Mantan pecandu kotor" }, { id: "Pemakai bersih" }], j: 1 },
      { q: { id: "Pemakaian zat agar tetap kuat lembur termasuk motif…" }, o: [{ id: "To explore" }, { id: "To feel good" }, { id: "To do better" }, { id: "To feel better" }], j: 2 }
    ],
    bs: [
      { t: { id: "Menurut NIDA, adiksi dapat juga berupa perilaku seperti judi dan game." }, j: true },
      { t: { id: "Ketamin bekerja sebagai antagonis reseptor NMDA." }, j: true },
      { t: { id: "Stigma terdiri dari prasangka dan diskriminasi." }, j: true },
      { t: { id: "Hadits “ma askara katsiruhu faqaliluhu haram” membolehkan sedikit khamr." }, j: false }
    ],
    jodoh: [
      { a: { id: "VTA" }, b: { id: "Sumber utama dopamin" } },
      { a: { id: "Korteks prefrontal" }, b: { id: "Kendali diri & keputusan" } },
      { a: { id: "Striatum" }, b: { id: "Pembentukan kebiasaan" } },
      { a: { id: "Raphe nucleus" }, b: { id: "Produksi serotonin, mood & tidur" } }
    ]
  },
  tugas: [
    { t: { id: "Jelaskan bagaimana otak \"belajar\" menjadi adiktif dengan sirkuit hadiah, kerangka Go–Stop, dan habit loop." }, j: { id: "Zat memicu VTA melepaskan dopamin ke nucleus accumbens jauh melebihi hadiah alami (makan 150%, metamfetamin ±1.300%), sehingga otak menandainya sebagai kebutuhan bertahan hidup; hipokampus menyimpan konteks nikmat sehingga isyarat memicu craving dan relapse; striatum mengubah perilaku menjadi kebiasaan otomatis. Dalam kerangka Go–Stop, pada otak sehat korteks prefrontal dan girus singulata mampu menghentikan dorongan, sedangkan pada otak adiktif salience dan dorongan menguat sementara kendali melemah sehingga muncul kompulsi. Habit loop cue–craving–response–reward memperkuat siklus, ditambah penguatan negatif saat withdrawal; pemulihan menyasar pemicu (people–places–things, HALT) dan memperkuat kendali." } }
  ]
});

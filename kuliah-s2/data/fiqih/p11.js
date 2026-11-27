/* Fiqih Ibadah — Pertemuan 11: Kitab I'tikaf & awal Kitab Haji (syarat wajib, miqat, larangan ihram) */
Kuliah.pertemuan("fiqih", {
  no: 11, motif: "sanad", motifOpt: { items: ["ذو الحليفة", "الجحفة", "قرن المنازل", "يلملم", "ذات عرق"], big: "المواقيت", lbl: "الاعتكاف والحج" }, tema: 3, durasi: 30,
  bab: { id: "I'tikaf & Haji (1)", ar: "الاعتكاف والحج (١)" },
  judul: { id: "Kitab I'tikaf, lalu Haji: Syarat Wajib, Miqat, dan Larangan Ihram", ar: "كتاب الاعتكاف، ثم الحج: شروط الوجوب والمواقيت ومحظورات الإحرام" },
  ringkas: {
    id: "**I'tikaf**: definisi, hukum (sunnah, ijma'), hikmah (mendapat Lailatul Qadar), enam syarat sah, dan tiga pembatal. Lalu **Kitab Haji** (11 dhabit; pertemuan ini dhabit 1–3): definisi & keutamaan, **syarat wajib** (Islam, akal, baligh, merdeka, mampu, dan mahram bagi wanita), **miqat zamani & makani**, serta **sebelas larangan ihram**.",
    ar: "كتاب الاعتكاف: تعريفه وحكمه وحكمته وشروطه ومبطلاته، ثم كتاب الحج: شروط الوجوب والمواقيت ومحظورات الإحرام."
  },
  tujuan: [
    { id: "Menjelaskan hukum, hikmah, syarat, dan pembatal i'tikaf.", ar: "" },
    { id: "Menentukan masjid yang sah untuk i'tikaf menurut pendapat rajih.", ar: "" },
    { id: "Menyebut syarat wajib haji termasuk mahram bagi wanita.", ar: "" },
    { id: "Menyebut miqat zamani dan lima miqat makani beserta penduduknya.", ar: "" },
    { id: "Memilah larangan ihram yang khusus laki-laki, khusus wanita, dan yang umum, serta fidyahnya.", ar: "" }
  ],
  isi: [
    { t: "judul", id: "Kitab I'tikaf", ar: "كتاب الاعتكاف" },
    { t: "definisi", judul: { id: "Al-I'tikaf", ar: "الاعتكاف" },
      lughah: { id: "**Menahan diri dan menetapi sesuatu** — {مَا هَٰذِهِ التَّمَاثِيلُ الَّتِي أَنتُمْ لَهَا عَاكِفُونَ} (Al-Anbiya': 52).", ar: "الحبس، من العكوف على الشيء والملازمة له." },
      istilah: { id: "**Menetapi masjid untuk ketaatan kepada Allah.** \"Masjid\" mengecualikan rumah, sekolah, atau mushalla; \"ketaatan\": menyendiri dari manusia, sibuk shalat, tahajjud, tilawah, dan dzikir.", ar: "لزوم مسجدٍ لطاعة الله تعالى." } },
    { t: "p", id: "**Hukumnya sunnah tanpa khilaf** — Nabi ﷺ beri'tikaf sepuluh hari terakhir Ramadhan hingga wafat, lalu istri-istrinya setelahnya. Ibnul Mundzir: ijma' i'tikaf sunnah, tidak wajib — **kecuali bila dinazarkan**. **Hikmahnya: mendapatkan Lailatul Qadar** — *\"Carilah Lailatul Qadar pada malam ganjil sepuluh terakhir Ramadhan.\"*", ar: "" },
    { t: "hukum", judul: { id: "Syarat sah i'tikaf", ar: "شروط صحة الاعتكاف" }, item: [
      { h: "info", judul: { id: "Islam, akal, tamyiz, niat", ar: "" }, id: "Seperti ibadah lainnya.", ar: "" },
      { h: "info", judul: { id: "Tidak dalam keadaan yang mewajibkan mandi", ar: "عدم ما يوجب الغسل" }, id: "{…وَلَا جُنُبًا إِلَّا عَابِرِي سَبِيلٍ حَتَّىٰ تَغْتَسِلُوا} (An-Nisa': 43) — orang junub tidak berdiam di masjid, hanya melintas.", ar: "" },
      { h: "info", judul: { id: "Di masjid", ar: "كونه بمسجد" }, id: "Tidak sah di rumah, sekolah, atau rumah tahfizh walaupun wakaf.", ar: "" }
    ] },
    { t: "khilaf", masalah: { id: "Masjid mana yang sah untuk i'tikaf?", ar: "" }, pendapat: [
      { siapa: { id: "Sebagian ulama", ar: "" }, isi: { id: "Setiap masjid.", ar: "" } },
      { siapa: { id: "Sebagian ulama — rajih", ar: "" }, isi: { id: "**Setiap masjid yang ditegakkan shalat jamaah di dalamnya**, walau tidak ada shalat Jumat.", ar: "" }, rajih: true }
    ], alasan: { id: "Hadits *\"Tidak ada i'tikaf kecuali di tiga masjid\"* ditafsirkan ulama sebagai **i'tikaf yang sempurna**; adapun {وَأَنتُمْ عَاكِفُونَ فِي الْمَسَاجِدِ} umum untuk setiap masjid.", ar: "" } },
    { t: "hukum", judul: { id: "Tiga pembatal i'tikaf", ar: "مبطلات الاعتكاف ثلاثة" }, item: [
      { h: "batal", judul: { id: "Keluar masjid tanpa keperluan", ar: "الخروج من المسجد من غير حاجة" }, id: "'Aisyah: *\"Sunnah bagi orang i'tikaf: tidak menjenguk orang sakit, tidak menghadiri jenazah, tidak menyentuh dan bermesraan dengan istri, dan tidak keluar kecuali untuk yang harus.\"* Keluar mengambil makanan atau kasur boleh.", ar: "" },
      { h: "batal", judul: { id: "Jima'", ar: "الجماع" }, id: "{وَلَا تُبَاشِرُوهُنَّ وَأَنتُمْ عَاكِفُونَ فِي الْمَسَاجِدِ} — walau pulang ke rumah malam hari; bila terjadi, batal dan bila kembali harus dengan niat baru. Ibnul Mundzir: ijma'; bermesraan juga terlarang.", ar: "" },
      { h: "batal", judul: { id: "Murtad", ar: "الردة" }, id: "{لَئِنْ أَشْرَكْتَ لَيَحْبَطَنَّ عَمَلُكَ}.", ar: "" }
    ] },

    { t: "judul", id: "Kitab Haji (dhabit 1–3)", ar: "كتاب الحج" },
    { t: "definisi", judul: { id: "Al-Hajj", ar: "الحج" },
      lughah: { id: "**Al-qashd** — menuju suatu arah tertentu.", ar: "القصد." },
      istilah: { id: "**Beribadah kepada Allah dengan menuju Makkah untuk menunaikan manasik sesuai Sunnah Rasulullah ﷺ** — *\"Ambillah dariku manasik kalian.\"*", ar: "التعبد لله بقصد مكة لأداء المناسك." } },
    { t: "p", id: "Keutamaan: *\"Umrah ke umrah menghapus dosa di antaranya, dan haji mabrur tidak ada balasan selain surga\"*; *\"Siapa berhaji tanpa rafats dan fasiq, ia kembali seperti hari dilahirkan ibunya.\"* **Hukumnya wajib sekali seumur hidup bagi yang mampu** (Ali 'Imran: 97; ijma' Ibnu Qudamah), dan **wajib segera** menurut pendapat terkuat.", ar: "وهو واجب على الفور على أرجح أقوال أهل العلم." },
    { t: "hukum", judul: { id: "Syarat wajib haji", ar: "شروط وجوب الحج" }, item: [
      { h: "info", judul: { id: "Islam", ar: "" }, id: "Orang musyrik bahkan dilarang memasuki Masjidil Haram (At-Taubah: 28).", ar: "" },
      { h: "info", judul: { id: "Berakal & baligh", ar: "" }, id: "Tidak wajib atas anak dan orang gila. **Haji anak kecil sah dan berpahala** (*\"Apakah anak ini boleh berhaji?\" — \"Ya, dan bagimu pahala\"*), tetapi Ibnul Mundzir: ijma' setelah baligh ia **tetap wajib haji Islam**.", ar: "" },
      { h: "info", judul: { id: "Merdeka sempurna", ar: "كمال الحرية" }, id: "Budak tidak wajib; budak yang berhaji lalu merdeka wajib haji lagi.", ar: "" },
      { h: "info", judul: { id: "Mampu (istitha'ah)", ar: "الاستطاعة" }, id: "Harta, badan, dan keamanan jalan: punya kendaraan (beli/sewa) ke Makkah dan meninggalkan nafkah yang cukup bagi tanggungannya hingga ia pulang.", ar: "" },
      { h: "info", judul: { id: "Mahram bagi wanita (tambahan ulama)", ar: "المحرم للمرأة" }, id: "Wanita tidak boleh safar — haji maupun lainnya — tanpa mahram, menurut pendapat rajih (Ahmad, al-Hasan, an-Nakha'i, Ishaq, Ashabur-ra'yi, Ibnul Mundzir): *\"Tidak halal bagi wanita yang beriman safar sehari semalam tanpa mahram\"*; *\"Pergilah berhaji bersama istrimu.\"* Malikiyyah & Syafi'iyyah membolehkan dalam rombongan aman — **tetapi yang rajih yang pertama**. Syarat mahram: baligh, berakal, mampu melindungi.", ar: "لكن الراجح الأول." }
    ] },
    { t: "tabel", judul: { id: "Miqat", ar: "المواقيت" }, kolom: [{ id: "Miqat", ar: "الميقات" }, { id: "Untuk", ar: "لأهل" }], baris: [
      [{ id: "**Zamani**: bulan-bulan haji — Syawal, Dzulqa'dah, sepuluh hari Dzulhijjah (Ibnu 'Umar). Ibnu 'Abbas: sunnahnya tidak berihram haji kecuali di bulan haji.", ar: "" }, { id: "Semua jamaah", ar: "" }],
      [{ id: "**Dzul Hulaifah**", ar: "ذو الحليفة" }, { id: "Penduduk Madinah", ar: "" }],
      [{ id: "**Juhfah** (kini Rabigh)", ar: "الجحفة" }, { id: "Syam dan Mesir", ar: "" }],
      [{ id: "**Qarnul Manazil**", ar: "قرن المنازل" }, { id: "Najd", ar: "" }],
      [{ id: "**Yalamlam**", ar: "يلملم" }, { id: "Yaman", ar: "" }],
      [{ id: "**Dzatu 'Irq**", ar: "ذات عرق" }, { id: "Penduduk timur/Iraq", ar: "" }]
    ] },
    { t: "catatan", gaya: "tanbih", id: "*\"Miqat-miqat itu untuk penduduknya dan siapa saja yang melewatinya dari selain penduduknya… siapa yang di dalamnya, (berihram) dari tempatnya, hingga penduduk Makkah dari Makkah.\"* **Melewati miqat tanpa ihram**: kembali berihram dari miqat, atau berihram dari tempatnya dan wajib **dam**.", ar: "" },
    { t: "hukum", judul: { id: "Larangan ihram (mahzhurat)", ar: "محظورات الإحرام" }, item: [
      { h: "haram", judul: { id: "Pakaian berjahit seukuran tubuh — khusus laki-laki", ar: "لبس المخيط للرجال" }, id: "*\"Tidak memakai gamis, sorban, celana, burnus, dan khuff — kecuali yang tidak mendapat sandal…\"* Ibnul Mundzir: ijma'; laki-laki hanya memakai izar dan rida'.", ar: "" },
      { h: "haram", judul: { id: "Menutup kepala — khusus laki-laki", ar: "تغطية الرأس للرجال" }, id: "*\"…tidak memakai sorban\"*; *\"Jangan tutupi kepalanya, ia dibangkitkan bertalbiyah.\"* Wanita boleh menutup kepala dan memakai pakaian berjahit.", ar: "" },
      { h: "haram", judul: { id: "Wewangian — laki-laki dan wanita", ar: "الطيب" }, id: "*\"…tidak memakai pakaian yang terkena za'faran atau wars.\"* Ijma'; boleh memakai wangi saat mandi untuk ihram (sebelum niat).", ar: "" },
      { h: "haram", judul: { id: "Mencukur rambut", ar: "حلق الشعر" }, id: "{وَلَا تَحْلِقُوا رُءُوسَكُمْ حَتَّىٰ يَبْلُغَ الْهَدْيُ مَحِلَّهُ}. Bila terganggu kutu dsb., **boleh mencukur dan memilih**: memberi makan enam miskin, menyembelih kambing, atau puasa tiga hari (hadits Ka'b bin 'Ujrah).", ar: "" },
      { h: "haram", judul: { id: "Memotong kuku", ar: "تقليم الأظفار" }, id: "Ijma' (Ibnul Mundzir, Ibnu Qudamah).", ar: "" },
      { h: "haram", judul: { id: "Membunuh buruan darat yang liar dan dimakan", ar: "قتل الصيد البري الوحشي المأكول" }, id: "Tiga syarat: buruan, darat, liar. Buruan laut dan hewan jinak boleh: {وَحُرِّمَ عَلَيْكُمْ صَيْدُ الْبَرِّ مَا دُمْتُمْ حُرُمًا}.", ar: "" },
      { h: "haram", judul: { id: "Khitbah dan akad nikah", ar: "الخطبة وعقد النكاح" }, id: "*\"Orang ihram tidak menikah, tidak menikahkan, dan tidak meminang.\"* Riwayat Nabi ﷺ menikahi Maimunah saat ihram adalah **kekeliruan Ibnu 'Abbas** — Maimunah sendiri mengabarkan beliau menikahinya dalam keadaan halal.", ar: "فهذا وهم فيه ابن عباس." },
      { h: "haram", judul: { id: "Jima'", ar: "الجماع" }, id: "Sebelum tahallul awal **merusak haji**: tetap menyelesaikannya, berhaji lagi tahun depan, dan menyembelih unta (badanah). Ibnul Mundzir: ijma' haji tidak rusak oleh larangan apa pun selain jima'.", ar: "" },
      { h: "haram", judul: { id: "Mubasyarah dengan syahwat", ar: "المباشرة" }, id: "{فَلَا رَفَثَ وَلَا فُسُوقَ وَلَا جِدَالَ فِي الْحَجِّ} — Ibnu 'Abbas & Ibnu 'Umar: pendahuluan jima' adalah mubasyarah.", ar: "" },
      { h: "haram", judul: { id: "Niqab dan sarung tangan — khusus wanita", ar: "النقاب والقفازين للمرأة" }, id: "*\"Wanita ihram tidak memakai niqab dan sarung tangan.\"* Bila ada laki-laki asing, ia **menjulurkan kain dari atas kepala** (bukan niqab) — Fathimah binti al-Mundzir: kami menutup wajah bersama Asma' binti Abi Bakr dalam keadaan ihram.", ar: "" }
    ] },
    { t: "cek", q: { id: "Seorang jamaah dari Jakarta yang terbang langsung ke Jeddah melewati miqat tanpa berihram. Menurut modul…", ar: "" }, o: [
      { id: "Kembali ke miqat, atau ihram dan dam", ar: "" },
      { id: "Hajinya batal dan wajib diulang tahun depan", ar: "" },
      { id: "Tidak mengapa, karena ia lewat di udara", ar: "" },
      { id: "Cukup memperbanyak talbiyah sebagai gantinya", ar: "" }], j: 0,
      b: { id: "\"Siapa melewatinya tanpa ihram: kembali lalu berihram darinya, atau berihram dari tempatnya dan wajib dam.\"", ar: "" } },
    { t: "ringkasan", item: [
      { id: "I'tikaf sunnah (wajib bila dinazar), hikmahnya Lailatul Qadar; sah di masjid yang ditegakkan jamaah (rajih); batal karena keluar tanpa keperluan, jima', murtad.", ar: "" },
      { id: "Haji wajib sekali seumur hidup bagi yang mampu, segera; syarat: Islam, akal, baligh, merdeka, mampu, mahram bagi wanita (rajih).", ar: "" },
      { id: "Miqat zamani: Syawal–10 Dzulhijjah; makani: Dzul Hulaifah, Juhfah, Qarnul Manazil, Yalamlam, Dzatu 'Irq.", ar: "" },
      { id: "Larangan ihram: berjahit & tutup kepala (laki-laki), niqab & sarung tangan (wanita), wangi, cukur, kuku, berburu, nikah, jima', mubasyarah.", ar: "" }
    ] }
  ],
  istilah: [
    { ar: "الاعتكاف", latin: "al-i'tikaf", id: "I'tikaf", def: { id: "Menetapi masjid untuk ketaatan kepada Allah.", ar: "" } },
    { ar: "الاستطاعة", latin: "al-istitha'ah", id: "Mampu", def: { id: "Kemampuan harta, badan, dan keamanan jalan.", ar: "" } },
    { ar: "الميقات الزماني", latin: "al-miqat az-zamani", id: "Miqat zamani", def: { id: "Bulan-bulan haji: Syawal, Dzulqa'dah, 10 hari Dzulhijjah.", ar: "" } },
    { ar: "الميقات المكاني", latin: "al-miqat al-makani", id: "Miqat makani", def: { id: "Tempat memulai ihram; lima tempat.", ar: "" } },
    { ar: "المحظور", latin: "al-mahzhur", id: "Larangan", def: { id: "Yang terlarang bagi orang ihram — {وَمَا كَانَ عَطَاءُ رَبِّكَ مَحْظُورًا}.", ar: "" } },
    { ar: "المخيط", latin: "al-makhith", id: "Berjahit", def: { id: "Pakaian yang dijahit seukuran tubuh; terlarang bagi laki-laki ihram.", ar: "" } },
    { ar: "البدنة", latin: "al-badanah", id: "Badanah", def: { id: "Unta sembelihan; denda jima' sebelum tahallul awal.", ar: "" } }
  ],
  latihan: {
    pg: [
      { q: { id: "Seseorang bernazar i'tikaf tiga hari. Hukumnya bagi dia…", ar: "" }, o: [
        { id: "Wajib karena nazar", ar: "" }, { id: "Tetap sunnah saja", ar: "" }, { id: "Makruh di luar Ramadhan", ar: "" }, { id: "Gugur bila di rumah", ar: "" }], j: 0,
        b: { id: "Ijma': i'tikaf sunnah \"kecuali bila seseorang mewajibkannya atas dirinya dengan nazar.\"", ar: "" } },
      { q: { id: "I'tikaf di mushalla kantor yang tidak dipakai shalat jamaah menurut yang rajih…", ar: "" }, o: [
        { id: "Tidak sah, bukan masjid jamaah", ar: "" }, { id: "Sah, karena itu tempat shalat", ar: "" }, { id: "Sah bila diniatkan masjid", ar: "" }, { id: "Sah asalkan ada khutbah di sana", ar: "" }], j: 0,
        b: { id: "Tidak sah di selain masjid; dan yang rajih masjid yang ditegakkan jamaah.", ar: "" } },
      { q: { id: "Orang i'tikaf keluar sebentar untuk menjenguk temannya yang sakit tanpa keperluan mendesak. Menurut hadits 'Aisyah…", ar: "" }, o: [
        { id: "Menyelisihi sunnah, membatalkan", ar: "" }, { id: "Dianjurkan karena silaturahim", ar: "" }, { id: "Boleh bila kurang dari satu jam", ar: "" }, { id: "Boleh bila temannya kerabat", ar: "" }], j: 0,
        b: { id: "\"Sunnah bagi orang i'tikaf tidak menjenguk orang sakit… dan tidak keluar kecuali untuk yang harus.\"", ar: "" } },
      { q: { id: "Anak 10 tahun berhaji bersama orang tuanya. Setelah baligh dan mampu…", ar: "" }, o: [
        { id: "Ia tetap wajib haji Islam", ar: "" }, { id: "Hajinya dahulu sudah mencukupi", ar: "" }, { id: "Hajinya dahulu tidak sah", ar: "" }, { id: "Ia cukup berumrah saja", ar: "" }], j: 0,
        b: { id: "Haji anak sah dan berpahala, tetapi ijma': setelah baligh ia wajib haji Islam.", ar: "" } },
      { q: { id: "Seorang muslimah ingin berhaji dengan rombongan wanita terpercaya tanpa mahram. Pendapat yang dirajihkan modul…", ar: "" }, o: [
        { id: "Tidak boleh tanpa mahram", ar: "" }, { id: "Boleh bila rombongan aman", ar: "" }, { id: "Boleh hanya untuk haji wajib", ar: "" }, { id: "Boleh bila jaraknya dekat", ar: "" }], j: 0,
        b: { id: "Rajih: mahram syarat; Malikiyyah & Syafi'iyyah membolehkan rombongan aman — \"tetapi yang rajih yang pertama.\"", ar: "" } },
      { q: { id: "Jamaah haji dari Mesir berihram dari…", ar: "" }, o: [
        { id: "Al-Juhfah", ar: "" }, { id: "Yalamlam", ar: "" }, { id: "Qarnul Manazil", ar: "" }, { id: "Dzatu 'Irq", ar: "" }], j: 0,
        b: { id: "Juhfah untuk Syam dan Mesir (kini Rabigh).", ar: "" } },
      { q: { id: "Seorang muhrim laki-laki terganggu kutu di kepalanya. Menurut hadits Ka'b bin 'Ujrah…", ar: "" }, o: [
        { id: "Boleh cukur lalu memilih fidyah", ar: "" }, { id: "Haram mencukur dalam keadaan apa pun", ar: "" }, { id: "Boleh cukur tanpa fidyah apa pun", ar: "" }, { id: "Wajib menyembelih unta", ar: "" }], j: 0,
        b: { id: "\"Cukurlah, lalu puasa tiga hari, atau beri makan enam miskin, atau sembelih kambing\" — pilihan.", ar: "" } },
      { q: { id: "Orang ihram memancing ikan di laut. Hukumnya…", ar: "" }, o: [
        { id: "Boleh, buruan laut tak terlarang", ar: "" }, { id: "Haram, karena tetap termasuk buruan", ar: "" }, { id: "Makruh tetapi tanpa denda", ar: "" }, { id: "Haram bila ikannya dimakan", ar: "" }], j: 0,
        b: { id: "Larangan khusus buruan **darat** yang liar dan dimakan; buruan laut keluar dari larangan.", ar: "" } },
      { q: { id: "Riwayat bahwa Nabi ﷺ menikahi Maimunah saat ihram, menurut modul…", ar: "" }, o: [
        { id: "Kekeliruan Ibnu 'Abbas", ar: "" }, { id: "Khusus bagi Nabi ﷺ", ar: "" }, { id: "Menasakh larangan nikah", ar: "" }, { id: "Dalil bolehnya akad saja", ar: "" }], j: 0,
        b: { id: "\"Ini kekeliruan Ibnu 'Abbas, karena Maimunah sendiri mengabarkan beliau menikahinya dalam keadaan halal.\"", ar: "" } },
      { q: { id: "Pasangan suami-istri berjima' sebelum wukuf di 'Arafah. Akibatnya menurut ijma'…", ar: "" }, o: [
        { id: "Rusak; diselesaikan, diulang, hadyu", ar: "" }, { id: "Hajinya sah, cukup bayar dam kambing", ar: "" }, { id: "Haji rusak; berhenti dan pulang saat itu", ar: "" }, { id: "Hajinya tetap sah, cukup istighfar", ar: "" }], j: 0,
        b: { id: "\"Rusak hajinya dan wajib melanjutkannya… haji tahun depan dan menyembelih badanah.\"", ar: "" } }
    ],
    bs: [
      { t: { id: "Hikmah i'tikaf sepuluh terakhir adalah mendapatkan Lailatul Qadar.", ar: "" }, j: true, b: { id: "", ar: "" } },
      { t: { id: "Orang junub boleh berdiam di masjid selama ia tidak shalat.", ar: "" }, j: false, b: { id: "Hanya melintas (An-Nisa': 43).", ar: "" } },
      { t: { id: "Haji wajib segera menurut pendapat terkuat.", ar: "" }, j: true, b: { id: "", ar: "" } },
      { t: { id: "Wanita ihram dilarang menutup kepalanya.", ar: "" }, j: false, b: { id: "Larangan menutup kepala khusus laki-laki.", ar: "" } },
      { t: { id: "Wanita ihram boleh menjulurkan kain menutupi wajah di hadapan laki-laki asing.", ar: "" }, j: true, b: { id: "Menjulurkan dari kepala, bukan niqab.", ar: "" } },
      { t: { id: "Memakai wewangian ketika mandi sebelum ihram termasuk larangan ihram.", ar: "" }, j: false, b: { id: "\"…tetapi boleh memakai wangi saat mandi untuk ihram.\"", ar: "" } }
    ],
    jodoh: [
      { a: { id: "Dzul Hulaifah", ar: "" }, b: { id: "Madinah", ar: "" } },
      { a: { id: "Qarnul Manazil", ar: "" }, b: { id: "Najd", ar: "" } },
      { a: { id: "Yalamlam", ar: "" }, b: { id: "Yaman", ar: "" } },
      { a: { id: "Dzatu 'Irq", ar: "" }, b: { id: "Iraq/timur", ar: "" } },
      { a: { id: "Juhfah", ar: "" }, b: { id: "Syam & Mesir", ar: "" } }
    ],
    pilah: { t: { id: "Pilah larangan ihram: khusus LAKI-LAKI, khusus WANITA, atau UMUM keduanya?", ar: "" }, kategori: [{ id: "Khusus laki-laki", ar: "" }, { id: "Khusus wanita", ar: "" }, { id: "Keduanya", ar: "" }], item: [
      { t: { id: "Memakai gamis berjahit", ar: "" }, k: 0 }, { t: { id: "Menutup kepala dengan peci", ar: "" }, k: 0 },
      { t: { id: "Memakai niqab", ar: "" }, k: 1 }, { t: { id: "Memakai sarung tangan", ar: "" }, k: 1 },
      { t: { id: "Memakai parfum", ar: "" }, k: 2 }, { t: { id: "Memotong kuku", ar: "" }, k: 2 }, { t: { id: "Akad nikah", ar: "" }, k: 2 }, { t: { id: "Berburu kijang", ar: "" }, k: 2 }
    ] },
    isian: [
      { t: { id: "I'tikaf secara istilah: menetapi ______ untuk ketaatan kepada Allah.", ar: "" }, j: { id: "masjid", ar: "" }, x: [{ id: "rumah", ar: "" }, { id: "mushalla", ar: "" }, { id: "Ka'bah", ar: "" }] },
      { t: { id: "Haji secara bahasa adalah al-______ (menuju).", ar: "" }, j: { id: "qashd", ar: "" }, x: [{ id: "safar", ar: "" }, { id: "thawaf", ar: "" }, { id: "nusuk", ar: "" }] }
    ]
  }
});

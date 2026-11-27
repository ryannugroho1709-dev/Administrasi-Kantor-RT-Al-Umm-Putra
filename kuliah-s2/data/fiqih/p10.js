/* Fiqih Ibadah — Pertemuan 10: Kitab Shiyam */
Kuliah.pertemuan("fiqih", {
  no: 10, motif: "lentera", motifOpt: { lbl: "كتاب الصيام" }, tema: 3, durasi: 30,
  bab: { id: "Kitab Shiyam", ar: "كتاب الصيام" },
  judul: { id: "Kitab Puasa: Syarat, Sunnah, Pembatal, serta Hari yang Dianjurkan dan Dilarang", ar: "كتاب الصيام: شروطه وسننه ومفطراته والأيام المستحبة والمنهي عنها" },
  ringkas: {
    id: "Kitab Puasa dalam enam dhabit: **enam syarat wajib** (masuk bulan, Islam, baligh, berakal, mampu, mukim), **syarat sah** (termasuk niat di malam hari dan suci dari haidh-nifas), **sunnah puasa**, **tujuh pembatal**, **hari-hari yang dianjurkan berpuasa**, dan **hari-hari yang dilarang**.",
    ar: "كتاب الصيام: شروط الوجوب والصحة، وسنن الصوم، والمفطرات السبعة، والأيام المستحب صيامها والمنهي عنها."
  },
  tujuan: [
    { id: "Menjelaskan cara menetapkan masuknya Ramadhan dan hukum puasa hari syak.", ar: "" },
    { id: "Membedakan uzur tetap dan uzur sementara serta konsekuensinya (fidyah atau qadha).", ar: "" },
    { id: "Menjelaskan niat malam hari dan bahwa tiap hari butuh niat.", ar: "" },
    { id: "Menyebut tujuh pembatal puasa dan kaffarah jima'.", ar: "" },
    { id: "Memilah hari yang dianjurkan dan dilarang untuk berpuasa.", ar: "" }
  ],
  isi: [
    { t: "definisi", judul: { id: "Ash-Shiyam", ar: "الصيام" },
      lughah: { id: "**Menahan** — {إِنِّي نَذَرْتُ لِلرَّحْمَٰنِ صَوْمًا فَلَنْ أُكَلِّمَ الْيَوْمَ إِنسِيًّا} (Maryam: 26).", ar: "الإمساك." },
      istilah: { id: "**Beribadah kepada Allah dengan menahan diri dari pembatal-pembatal, sejak terbit fajar shadiq hingga terbenam matahari.** Wajib dengan Al-Qur'an (Al-Baqarah: 183), Sunnah, dan ijma'.", ar: "التعبد لله تعالى بالإمساك عن المفطرات من طلوع الفجر الصادق إلى غروب الشمس." } },
    { t: "hadits", ar: "مَنْ صَامَ رَمَضَانَ إِيمَانًا وَاحْتِسَابًا غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ", id: "Siapa berpuasa Ramadhan karena iman dan mengharap pahala, diampuni dosanya yang telah lalu.", src: "Muttafaq 'alaih" },
    { t: "p", id: "**Kapan Ramadhan wajib?** Dengan salah satu dari dua: **melihat hilal**, atau **menyempurnakan Sya'ban tiga puluh hari** — *\"Berpuasalah karena melihatnya dan berbukalah karena melihatnya; bila tertutup awan, genapkan tiga puluh.\"* Hilal Ramadhan ditetapkan dengan **kesaksian satu muslim yang adil** (Ibnu 'Umar melihat hilal, Nabi ﷺ berpuasa dan menyuruh manusia berpuasa). Bila hilal terlihat di satu negeri, ulama berselisih; **setiap negeri punya mathla'**.", ar: "" },
    { t: "khilaf", masalah: { id: "Puasa pada hari syak (30 Sya'ban yang mendung)", ar: "صيام يوم الشك" }, pendapat: [
      { siapa: { id: "Sebagian ulama", ar: "" }, isi: { id: "Boleh/dianjurkan sebagai kehati-hatian.", ar: "" } },
      { siapa: { id: "Pendapat rajih dalam modul", ar: "الراجح" }, isi: { id: "**Haram** berpuasa pada hari itu.", ar: "يحرم صيام هذا اليوم." }, rajih: true }
    ], alasan: { id: "*\"Jangan mendahului Ramadhan… bila terhalang mendung, sempurnakan tiga puluh hari\"*; 'Ammar: *\"Siapa berpuasa pada hari yang diragukan, ia telah durhaka kepada Abul Qasim ﷺ.\"*", ar: "" } },

    { t: "judul", id: "Dhabit 1: Enam Syarat Wajib Puasa", ar: "الضابط الأول: شروط وجوب الصوم ستة" },
    { t: "hukum", item: [
      { h: "info", judul: { id: "Masuknya bulan", ar: "دخول الشهر" }, id: "{فَمَن شَهِدَ مِنكُمُ الشَّهْرَ فَلْيَصُمْهُ}.", ar: "" },
      { h: "info", judul: { id: "Islam", ar: "الإسلام" }, id: "Bila nafkah yang manfaatnya meluas tidak diterima dari orang kafir, ibadah murni lebih utama lagi.", ar: "" },
      { h: "info", judul: { id: "Baligh", ar: "البلوغ" }, id: "Tanda: mimpi basah, tumbuh rambut kasar di sekitar kemaluan, atau genap lima belas tahun; wanita ditambah haidh dan hamil.", ar: "" },
      { h: "info", judul: { id: "Berakal", ar: "العقل" }, id: "Orang gila, lemah akal (ma'tuh), atau pikun tidak wajib.", ar: "" },
      { h: "info", judul: { id: "Mampu", ar: "القدرة عليه" }, id: "Lihat pembagian uzur di bawah.", ar: "" },
      { h: "info", judul: { id: "Mukim", ar: "الإقامة" }, id: "Tidak wajib saat safar (lihat khilaf).", ar: "" }
    ] },
    { t: "banding", judul: { id: "Orang yang tidak mampu berpuasa", ar: "العاجز عن الصيام" },
      kiri: { judul: { id: "Uzur tetap (da'im)", ar: "قسم دائم" }, ikon: "clock", poin: [
        { id: "Orang tua renta, wanita lanjut usia, sakit yang tak diharap sembuh (gagal ginjal, kanker, dll.)", ar: "" },
        { id: "**Berbuka dan memberi makan seorang miskin setiap hari** — Ibnu 'Abbas: ayat {وَعَلَى الَّذِينَ يُطِيقُونَهُ فِدْيَةٌ} tidak mansukh, berlaku bagi orang tua", ar: "" },
        { id: "Tiap miskin setengah sha' (hadits Ka'b bin 'Ujrah)", ar: "" } ] },
      kanan: { judul: { id: "Uzur sementara (thari')", ar: "قسم طارئ" }, ikon: "refresh", poin: [
        { id: "Sakit yang diharap sembuh, safar, hamil, menyusui", ar: "" },
        { id: "**Berbuka lalu mengqadha di hari lain** — {فَعِدَّةٌ مِّنْ أَيَّامٍ أُخَرَ}", ar: "" },
        { id: "Hamil/menyusui yang berbuka karena khawatir diri atau anak: qadha bila mampu (asalnya, karena mirip orang sakit); bila tidak mampu, memberi makan", ar: "" } ] } },
    { t: "khilaf", masalah: { id: "Berpuasa ketika safar", ar: "الصيام في السفر" }, pendapat: [
      { siapa: { id: "Zhahiriyyah", ar: "الظاهرية" }, isi: { id: "Tidak boleh — *\"Bukan termasuk kebajikan berpuasa dalam safar\"*; *\"Mereka orang-orang yang durhaka\"*; *\"Orang-orang yang berbuka hari ini pergi membawa pahala.\"*", ar: "" } },
      { siapa: { id: "Jumhur ulama", ar: "الجمهور" }, isi: { id: "**Boleh**; mana yang lebih utama tergantung keadaan orangnya.", ar: "" }, rajih: true }
    ], alasan: { id: "Anas: *\"Kami safar bersama Nabi ﷺ; yang berpuasa tidak mencela yang berbuka, dan sebaliknya\"*; Nabi ﷺ sendiri berpuasa dalam safar dan bersabda: *\"Bila mau berpuasalah, bila mau berbukalah.\"*", ar: "إن شئت فصم وإن شئت فأفطر." } },

    { t: "judul", id: "Dhabit 2: Syarat Sah Puasa", ar: "الضابط الثاني: شروط صحة الصوم" },
    { t: "hukum", item: [
      { h: "info", judul: { id: "Islam, akal, tamyiz", ar: "" }, id: "Tidak sah dari orang kafir, gila, dan yang belum tamyiz.", ar: "" },
      { h: "info", judul: { id: "Niat — dan dimalamkan", ar: "النية وتبييتها" }, id: "*\"Siapa tidak memalamkan niat puasa sebelum fajar, tidak ada puasa baginya.\"* **Puasa sunnah boleh berniat di siang hari.** Yang rajih: **setiap hari adalah ibadah tersendiri yang butuh niat**, karena ibadah berakhir di malam hari (Al-Baqarah: 187).", ar: "الراجح أن كل يوم عبادة مستقلة يجب له نية." },
      { h: "info", judul: { id: "Berhentinya darah haidh dan nifas", ar: "انقطاع دم الحيض والنفاس" }, id: "Mu'adzah bertanya kepada 'Aisyah mengapa wanita haidh mengqadha puasa tetapi tidak shalat: *\"Kami mengalami itu, lalu diperintah mengqadha puasa dan tidak diperintah mengqadha shalat.\"*", ar: "" }
    ] },

    { t: "judul", id: "Dhabit 3: Sunnah-sunnah Puasa", ar: "الضابط الثالث: سنن الصوم" },
    { t: "hukum", item: [
      { h: "sunnah", judul: { id: "Menyegerakan berbuka", ar: "تعجيل الفطر" }, id: "*\"Manusia senantiasa dalam kebaikan selama menyegerakan berbuka.\"* At-Tirmidzi: itulah pilihan para sahabat dan setelahnya.", ar: "" },
      { h: "sunnah", judul: { id: "Mengakhirkan sahur", ar: "تأخير السحور" }, id: "*\"Bersahurlah, karena dalam sahur ada berkah\"*; *\"Pembeda puasa kita dan puasa Ahli Kitab adalah makan sahur\"*; ijma' sahur dianjurkan. Boleh makan hingga adzan fajar.", ar: "" },
      { h: "sunnah", judul: { id: "Memperbanyak kebaikan", ar: "الزيادة في أعمال الخير" }, id: "Sedekah, silaturahim, tilawah — Nabi ﷺ paling dermawan di Ramadhan, lebih dari angin yang berhembus.", ar: "" },
      { h: "sunnah", judul: { id: "Menjaga lisan", ar: "حفظ اللسان" }, id: "*\"Bila dicela atau diajak berkelahi, ucapkan: aku sedang berpuasa\"*; *\"Siapa tidak meninggalkan perkataan dusta dan mengamalkannya, Allah tidak butuh ia meninggalkan makan dan minumnya.\"*", ar: "" },
      { h: "sunnah", judul: { id: "Berdoa ketika berbuka", ar: "الدعاء عند الفطر" }, id: "[[ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللَّهُ]] — doa orang berpuasa termasuk tiga doa yang dikabulkan.", ar: "" },
      { h: "sunnah", judul: { id: "Berbuka dengan ruthab, lalu kurma, lalu air", ar: "الفطر على رطبات" }, id: "Anas: bila tidak ada ruthab, beberapa butir tamr; bila tidak ada, beberapa teguk air.", ar: "" }
    ] },

    { t: "judul", id: "Dhabit 4: Tujuh Pembatal Puasa", ar: "الضابط الرابع: المفطرات سبعة" },
    { t: "hukum", item: [
      { h: "batal", judul: { id: "1. Makan atau minum dengan sengaja", ar: "الأكل أو الشرب عمدًا" }, id: "**Bila lupa, puasanya sah**: *\"…sempurnakan puasanya, sesungguhnya Allah yang memberinya makan dan minum.\"*", ar: "" },
      { h: "batal", judul: { id: "2. Jima' dengan sengaja", ar: "الجماع عمدًا" }, id: "Berdosa, wajib **menahan diri sisa hari, mengqadha**, dan **kaffarah**: memerdekakan budak → bila tidak ada, puasa dua bulan berturut-turut → bila tidak mampu, memberi makan enam puluh miskin; kaffarah tidak gugur. Wanita: rajih wajib kaffarah bila ia rela.", ar: "" },
      { h: "batal", judul: { id: "3. Muntah dengan sengaja", ar: "القيء عمدًا" }, id: "*\"Siapa terpaksa muntah tidak wajib qadha; siapa sengaja muntah hendaklah mengqadha.\"* Ibnul Mundzir: ijma'.", ar: "" },
      { h: "batal", judul: { id: "4. Istimna'", ar: "الاستمناء" }, id: "Mengeluarkan mani dengan cara apa pun — *\"…ia meninggalkan makan, minum, dan syahwatnya karena-Ku.\"*", ar: "" },
      { h: "batal", judul: { id: "5. Bertekad membatalkan", ar: "العزم على الفطر" }, id: "Walau belum makan apa pun, karena memutus niat yang diperintahkan.", ar: "" },
      { h: "batal", judul: { id: "6. Keluarnya darah haidh/nifas", ar: "نزول دم الحيض أو النفاس" }, id: "Walau sesaat sebelum maghrib; bila berhenti sesaat setelah fajar, puasa hari itu tidak sah.", ar: "" },
      { h: "batal", judul: { id: "7. Murtad", ar: "الردة" }, id: "Dengan ucapan, perbuatan, atau keyakinan — Ibnu Qudamah: tanpa khilaf, puasanya rusak dan wajib qadha.", ar: "" }
    ] },
    { t: "hadits", ar: "هَلْ تَجِدُ رَقَبَةً تُعْتِقُهَا؟ قَالَ: لَا، قَالَ: فَهَلْ تَسْتَطِيعُ أَنْ تَصُومَ شَهْرَيْنِ مُتَتَابِعَيْنِ؟ قَالَ: لَا، قَالَ: فَهَلْ تَجِدُ إِطْعَامَ سِتِّينَ مِسْكِينًا؟ قَالَ: لَا… خُذْ هَذَا فَتَصَدَّقْ بِهِ… أَطْعِمْهُ أَهْلَكَ", id: "Orang yang menggauli istrinya di siang Ramadhan: \"Celaka aku!\" — beliau menanyakan tiga kaffarah berurutan, lalu memberinya sekeranjang kurma untuk disedekahkan; ketika ia mengaku paling miskin di Madinah, Nabi ﷺ tertawa: *\"Berikan makan keluargamu.\"* Juga: *\"Berpuasalah sehari sebagai gantinya.\"*", src: "Muttafaq 'alaih" },

    { t: "judul", id: "Dhabit 5–6: Hari yang Dianjurkan dan Dilarang", ar: "الأيام المستحب صيامها والمنهي عنها" },
    { t: "banding", kiri: { judul: { id: "Dianjurkan (urut keutamaan)", ar: "المستحب" }, ikon: "sparkle", poin: [
        { id: "**Puasa Dawud** (sehari puasa sehari tidak) — tingkatan tertinggi", ar: "" },
        { id: "'Arafah bagi yang tidak berhaji — menghapus dosa dua tahun", ar: "" },
        { id: "Tasu'a & 'Asyura — menghapus dosa setahun sebelumnya", ar: "" },
        { id: "Senin & Kamis — amal diperlihatkan", ar: "" },
        { id: "Enam hari Syawal — seperti puasa setahun", ar: "" },
        { id: "Sepuluh hari pertama Dzulhijjah", ar: "" },
        { id: "Ayyamul bidh (13, 14, 15)", ar: "" },
        { id: "Sebagian besar Muharram — puasa terbaik setelah Ramadhan", ar: "" },
        { id: "Sebagian besar Sya'ban", ar: "" } ] },
      kanan: { judul: { id: "Dilarang", ar: "المنهي عنه" }, ikon: "x", poin: [
        { id: "**Dua hari raya** (haram)", ar: "" },
        { id: "**Hari tasyriq** (11–13 Dzulhijjah) — kecuali bagi haji yang tidak mendapat hadyu", ar: "" },
        { id: "**Hari syak**", ar: "" },
        { id: "**Jumat sendirian** — kecuali dengan sehari sebelum/sesudahnya; **Sabtu sendirian** kecuali yang diwajibkan", ar: "" },
        { id: "**Puasa dahr** — *\"tidak berpuasa orang yang berpuasa selamanya\"*", ar: "" },
        { id: "**Istri berpuasa sunnah** saat suami di rumah tanpa izinnya", ar: "" } ] } },
    { t: "cek", q: { id: "Seseorang lupa lalu minum di siang Ramadhan, kemudian teringat. Hukumnya…", ar: "" }, o: [
      { id: "Melanjutkan puasa; puasanya sah", ar: "يتم صومه" },
      { id: "Batal dan wajib mengqadha sehari", ar: "يفطر ويقضي" },
      { id: "Batal, wajib qadha dan kaffarah", ar: "يقضي ويكفر" },
      { id: "Sah, tetapi wajib membayar fidyah", ar: "يصح ويفدي" }], j: 0,
      b: { id: "*\"Siapa lupa padahal ia berpuasa lalu makan atau minum, hendaklah menyempurnakan puasanya.\"*", ar: "" } },
    { t: "ringkasan", item: [
      { id: "Ramadhan ditetapkan dengan rukyah (satu saksi adil) atau menggenapkan Sya'ban; puasa hari syak haram (rajih).", ar: "" },
      { id: "Uzur tetap: berbuka + fidyah; uzur sementara: berbuka + qadha; puasa safar boleh menurut jumhur.", ar: "" },
      { id: "Niat wajib dimalamkan untuk puasa wajib; tiap hari niat baru; sunnah boleh niat siang.", ar: "" },
      { id: "Pembatal: makan-minum sengaja, jima' (+ kaffarah), muntah sengaja, istimna', tekad berbuka, haidh/nifas, murtad.", ar: "" }
    ] }
  ],
  istilah: [
    { ar: "يوم الشك", latin: "yaum asy-syakk", id: "Hari syak", def: { id: "Tanggal 30 Sya'ban ketika hilal terhalang; haram dipuasai (rajih).", ar: "" } },
    { ar: "تبييت النية", latin: "tabyit an-niyyah", id: "Memalamkan niat", def: { id: "Berniat puasa wajib di malam hari sebelum fajar.", ar: "" } },
    { ar: "الفدية", latin: "al-fidyah", id: "Fidyah", def: { id: "Memberi makan seorang miskin per hari bagi yang uzur tetap.", ar: "" } },
    { ar: "الكفارة", latin: "al-kaffarah", id: "Kaffarah jima'", def: { id: "Memerdekakan budak, atau puasa dua bulan berturut, atau memberi makan 60 miskin.", ar: "" } },
    { ar: "الاستمناء", latin: "al-istimna'", id: "Istimna'", def: { id: "Sengaja mengeluarkan mani; membatalkan puasa.", ar: "" } },
    { ar: "أيام التشريق", latin: "ayyam at-tasyriq", id: "Hari tasyriq", def: { id: "11–13 Dzulhijjah, hari makan dan minum; dilarang berpuasa.", ar: "" } },
    { ar: "الأيام البيض", latin: "al-ayyam al-bidh", id: "Ayyamul bidh", def: { id: "Tanggal 13, 14, 15 setiap bulan hijriah.", ar: "" } }
  ],
  latihan: {
    pg: [
      { q: { id: "Tanggal 29 Sya'ban hilal tidak terlihat karena mendung. Hari berikutnya…", ar: "" }, o: [
        { id: "Digenapkan Sya'ban, tidak berpuasa", ar: "" },
        { id: "Berpuasa untuk kehati-hatian", ar: "" },
        { id: "Berpuasa dengan niat sunnah", ar: "" },
        { id: "Berpuasa setengah hari dahulu", ar: "" }], j: 0,
        b: { id: "Genapkan tiga puluh hari; puasa hari syak haram menurut yang rajih.", ar: "" } },
      { q: { id: "Seorang kakek 85 tahun tidak sanggup berpuasa dan tidak diharapkan mampu lagi. Kewajibannya…", ar: "" }, o: [
        { id: "Berbuka dan memberi makan miskin tiap hari", ar: "" },
        { id: "Berbuka dan mengqadha bila sudah kuat", ar: "" },
        { id: "Tetap berpuasa walau sangat payah", ar: "" },
        { id: "Gugur semuanya tanpa ada ganti", ar: "" }], j: 0,
        b: { id: "Uzur tetap: berbuka dan fidyah — Ibnu 'Abbas: ayat itu tidak mansukh.", ar: "" } },
      { q: { id: "Seorang ibu menyusui berbuka karena khawatir ASI berkurang, dan ia mampu mengqadha. Menurut modul…", ar: "" }, o: [
        { id: "Ia mengqadha di hari lain", ar: "" },
        { id: "Ia cukup membayar fidyah", ar: "" },
        { id: "Ia berdosa dan wajib kaffarah", ar: "" },
        { id: "Ia tidak menanggung apa pun", ar: "" }], j: 0,
        b: { id: "\"Bila mampu mengqadha, itulah asalnya, karena ia lebih dekat kepada orang sakit; bila tidak mampu, memberi makan.\"", ar: "" } },
      { q: { id: "Menurut pendapat rajih, bagaimana hukum puasa Ramadhan bagi musafir yang kuat?", ar: "" }, o: [
        { id: "Boleh berpuasa atau berbuka", ar: "" },
        { id: "Wajib berbuka, puasanya tidak sah", ar: "" },
        { id: "Wajib berpuasa, tidak boleh berbuka", ar: "" },
        { id: "Makruh berpuasa dalam safar", ar: "" }], j: 0,
        b: { id: "Jumhur: boleh; mana yang lebih utama sesuai keadaan — *\"bila mau berpuasalah, bila mau berbukalah.\"*", ar: "" } },
      { q: { id: "Seseorang berniat puasa Ramadhan sekali di malam pertama untuk sebulan penuh. Menurut yang dirajihkan modul…", ar: "" }, o: [
        { id: "Tiap hari butuh niat tersendiri", ar: "" },
        { id: "Cukup satu niat untuk sebulan", ar: "" },
        { id: "Niat tidak diperlukan di Ramadhan", ar: "" },
        { id: "Niat cukup diucapkan saat sahur pertama", ar: "" }], j: 0,
        b: { id: "\"Yang rajih: setiap hari ibadah tersendiri yang wajib diniatkan\" — ibadah berakhir di malam hari.", ar: "" } },
      { q: { id: "Pukul 10 pagi seseorang yang belum makan apa pun berniat puasa sunnah Senin. Puasanya…", ar: "" }, o: [
        { id: "Sah, puasa sunnah boleh niat siang", ar: "" },
        { id: "Tidak sah, niat wajib di malam hari", ar: "" },
        { id: "Sah, hanya bila diqadha esok harinya", ar: "" },
        { id: "Tidak sah, kecuali hari 'Arafah", ar: "" }], j: 0,
        b: { id: "\"Adapun puasa nafilah, boleh berpuasa dari siang hari bila ia meniatkannya.\"", ar: "" } },
      { q: { id: "Urutan kaffarah jima' di siang Ramadhan…", ar: "" }, o: [
        { id: "Budak, puasa 2 bulan, makan 60 miskin", ar: "" },
        { id: "Makan 60 miskin, budak, puasa 2 bulan", ar: "" },
        { id: "Puasa 2 bulan, budak, makan 60 miskin", ar: "" },
        { id: "Bebas memilih salah satu dari ketiganya", ar: "" }], j: 0,
        b: { id: "Hadits orang yang menggauli istrinya: beliau menanyakan berurutan.", ar: "" } },
      { q: { id: "Seseorang mual lalu muntah tanpa disengaja. Puasanya…", ar: "" }, o: [
        { id: "Sah, tidak wajib qadha", ar: "" },
        { id: "Batal, wajib qadha", ar: "" },
        { id: "Batal, wajib kaffarah", ar: "" },
        { id: "Sah, tetapi wajib fidyah", ar: "" }], j: 0,
        b: { id: "*\"Siapa terpaksa muntah, tidak ada qadha baginya.\"*", ar: "" } },
      { q: { id: "Seorang wanita haidh 10 menit sebelum maghrib. Puasa hari itu…", ar: "" }, o: [
        { id: "Batal, wajib diqadha", ar: "" },
        { id: "Sah karena hampir selesai", ar: "" },
        { id: "Sah bila ia tidak makan", ar: "" },
        { id: "Batal tanpa kewajiban qadha", ar: "" }], j: 0,
        b: { id: "\"Bila darah haidh turun sesaat sebelum maghrib, rusak puasa hari itu.\"", ar: "" } },
      { q: { id: "Seseorang ingin puasa sunnah hanya pada hari Jumat saja. Menurut modul…", ar: "" }, o: [
        { id: "Dilarang, kecuali digandeng hari lain", ar: "" },
        { id: "Dianjurkan karena Jumat hari mulia", ar: "" },
        { id: "Boleh tanpa syarat apa pun juga", ar: "" },
        { id: "Wajib diganti dengan hari Sabtu", ar: "" }], j: 0,
        b: { id: "*\"Janganlah berpuasa hari Jumat kecuali (bersama) sehari sebelum atau sesudahnya.\"*", ar: "" } }
    ],
    bs: [
      { t: { id: "Hilal Ramadhan ditetapkan dengan kesaksian satu muslim yang adil.", ar: "" }, j: true, b: { id: "Hadits Ibnu 'Umar.", ar: "" } },
      { t: { id: "Bertekad membatalkan puasa tidak membatalkan selama belum makan.", ar: "" }, j: false, b: { id: "Tekad berbuka membatalkan karena memutus niat.", ar: "" } },
      { t: { id: "Boleh makan sahur hingga adzan fajar.", ar: "" }, j: true, b: { id: "Bilal adzan di malam hari… hingga Ibnu Ummi Maktum adzan.", ar: "" } },
      { t: { id: "Puasa 'Arafah dianjurkan juga bagi jamaah haji di 'Arafah.", ar: "" }, j: false, b: { id: "\"Bagi yang tidak berhaji.\"", ar: "" } },
      { t: { id: "Istri boleh berpuasa sunnah tanpa izin suami yang sedang di rumah.", ar: "" }, j: false, b: { id: "*\"Wanita tidak berpuasa saat suaminya ada kecuali dengan izinnya\"* — selain Ramadhan.", ar: "" } },
      { t: { id: "Orang yang menggauli istrinya di siang Ramadhan wajib menahan diri sisa hari itu dan mengqadha.", ar: "" }, j: true, b: { id: "", ar: "" } }
    ],
    jodoh: [
      { a: { id: "'Arafah", ar: "عرفة" }, b: { id: "Dosa dua tahun", ar: "سنتين" } },
      { a: { id: "'Asyura", ar: "عاشوراء" }, b: { id: "Dosa setahun lalu", ar: "السنة التي قبله" } },
      { a: { id: "Puasa Dawud", ar: "صيام داود" }, b: { id: "Puasa paling dicintai Allah", ar: "أحب الصيام" } },
      { a: { id: "Enam Syawal", ar: "ست من شوال" }, b: { id: "Seperti puasa setahun", ar: "كصيام الدهر" } },
      { a: { id: "Senin & Kamis", ar: "الاثنين والخميس" }, b: { id: "Amal diperlihatkan", ar: "تعرض الأعمال" } },
      { a: { id: "Tasyriq", ar: "التشريق" }, b: { id: "Hari makan dan minum", ar: "أيام أكل وشرب" } }
    ],
    pilah: { t: { id: "Pilah: puasa DIANJURKAN atau DILARANG?", ar: "" }, kategori: [{ id: "Dianjurkan", ar: "يستحب" }, { id: "Dilarang", ar: "ينهى" }], item: [
      { t: { id: "13 Dzulhijjah", ar: "" }, k: 1 }, { t: { id: "1 Syawal", ar: "" }, k: 1 }, { t: { id: "Jumat sendirian", ar: "" }, k: 1 }, { t: { id: "Puasa setahun penuh", ar: "" }, k: 1 },
      { t: { id: "9 Dzulhijjah (bukan haji)", ar: "" }, k: 0 }, { t: { id: "10 Muharram", ar: "" }, k: 0 }, { t: { id: "14 Rajab", ar: "" }, k: 0 }, { t: { id: "Kamis", ar: "" }, k: 0 }
    ] },
    isian: [
      { t: { id: "Puasa adalah menahan diri dari terbit fajar ______ hingga terbenam matahari.", ar: "" }, j: { id: "shadiq", ar: "الصادق" }, x: [{ id: "kadzib", ar: "" }, { id: "pertama", ar: "" }, { id: "dhuha", ar: "" }] },
      { t: { id: "\"Bersahurlah, karena dalam sahur ada ______.\"", ar: "" }, j: { id: "berkah", ar: "بركة" }, x: [{ id: "kekuatan", ar: "" }, { id: "pahala", ar: "" }, { id: "rahmat", ar: "" }] }
    ]
  }
});

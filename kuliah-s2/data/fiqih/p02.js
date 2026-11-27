/* Fiqih Ibadah — Pertemuan 2: Bab Siwak & Khishal al-Fithrah, Bab Wudhu, Bab Mengusap Khuff */
Kuliah.pertemuan("fiqih", {
  no: 2, motif: "kalam", motifOpt: { big: "فَاغْسِلُوا وُجُوهَكُمْ", lbl: "باب الوضوء" }, tema: 3, durasi: 30,
  bab: { id: "Thaharah: siwak, fithrah, wudhu & khuff", ar: "الطهارة: السواك والفطرة والوضوء والمسح على الخفين" },
  judul: { id: "Siwak & Khishal al-Fithrah, Wudhu, dan Mengusap Khuff", ar: "باب السواك وخصال الفطرة، وباب الوضوء، وباب المسح على الخفين" },
  ringkas: {
    id: "**Bab Siwak & Fithrah**: enam waktu siwak sangat dianjurkan dan lima khishal al-fithrah (khitan, istihdad, mencabut bulu ketiak, mencukur kumis, memotong kuku). **Bab Wudhu**: fardhu wudhu, syarat sah (dengan definisi syarat), sepuluh sunnah, dan tata cara lengkap. **Bab Mengusap Khuff**: tiga syarat, tiga pembatal, masa berlaku, serta perbedaannya dengan jabirah.",
    ar: "باب السواك وخصال الفطرة: مواضع تأكد السواك الستة وخصال الفطرة الخمس، وباب الوضوء: فروضه وشروطه وسننه العشر وصفته، وباب المسح على الخفين: شروطه الثلاثة ومبطلاته الثلاثة ومدته، والفرق بينه وبين الجبيرة."
  },
  tujuan: [
    { id: "Menyebut enam keadaan yang sangat dianjurkan bersiwak beserta dalilnya.", ar: "ذكر مواضع تأكد السواك الستة بأدلتها." },
    { id: "Menjelaskan lima khishal al-fithrah dan membedakan hukumnya bagi laki-laki dan perempuan.", ar: "بيان خصال الفطرة الخمس والتفريق في حكمها بين الرجل والمرأة." },
    { id: "Membedakan fardhu, syarat, dan sunnah wudhu, termasuk definisi syarat secara ushul.", ar: "التفريق بين فروض الوضوء وشروطه وسننه مع تعريف الشرط." },
    { id: "Mempraktikkan tata cara wudhu sesuai urutan ayat dan hadits 'Utsman.", ar: "تطبيق صفة الوضوء على ترتيب الآية وحديث عثمان." },
    { id: "Menerapkan syarat, pembatal, dan masa mengusap khuff, serta membedakannya dari jabirah.", ar: "تطبيق شروط المسح على الخفين ومبطلاته ومدته والفرق بينه وبين الجبيرة." }
  ],
  isi: [
    { t: "pembuka", id: "Pertemuan kedua melanjutkan Kitab Thaharah setelah bab air, bejana, dan buang hajat. Dosen mengingatkan: kajian ini adalah **pengenalan fiqih ibadah secara ringkas (*mujmal*)**, bukan terperinci — ia adalah *bidayah* (awal jalan). Siapa yang ingin sampai ke ujungnya, hendaklah bergabung dengan program, akademi, atau fakultas yang mendalami fiqih.", ar: "هذه الدراسة إنما هي باب بيان التعريف بفقه العبادات، والكلام مجمل وليس مفصلًا؛ فهذا هو الباب وأول الطريق، وإذا أردت منتهاه فعليك أن تلتحق بالدورات والأكاديميات المتخصصة في الفقه." },

    { t: "judul", id: "Bab 4: Siwak & Khishal al-Fithrah", ar: "الباب الرابع: باب السواك وخصال الفطرة" },
    { t: "p", id: "Bab ini berisi **dua dhabit**. Dhabit pertama: *\"Waktu-waktu yang sangat dianjurkan bersiwak ada enam.\"* Ketahuilah, bersiwak **disunnahkan setiap saat**, berdasarkan sabda Nabi ﷺ: *\"Siwak itu menyucikan mulut dan diridhai Rabb.\"* Namun anjurannya menguat pada enam keadaan.", ar: "الضابط الأول: «أوقات تأكد استحباب السواك ستة». اعلم أن السواك مستحب في كل وقت؛ لقول النبي ﷺ: «السواك مطهرة للفم مرضاة للرب»." },
    { t: "hadits", ar: "السِّوَاكُ مَطْهَرَةٌ لِلْفَمِ مَرْضَاةٌ لِلرَّبِّ", id: "Siwak itu menyucikan mulut dan mendatangkan ridha Rabb.", src: "HR. Ahmad, an-Nasa'i" },
    { t: "tabel", judul: { id: "Enam waktu siwak sangat dianjurkan", ar: "مواضع تأكد السواك الستة" }, kolom: [{ id: "Keadaan", ar: "الموضع" }, { id: "Dalil", ar: "الدليل" }], baris: [
      [{ id: "**1. Ketika berwudhu**", ar: "عند الوضوء" }, { id: "\"Seandainya tidak memberatkan umatku, niscaya kuperintahkan mereka bersiwak setiap kali wudhu.\" (Ahmad, sanad shahih, dari Abu Hurairah)", ar: "لولا أن أشق على أمتي لأمرتهم بالسواك مع كل وضوء." }],
      [{ id: "**2. Ketika hendak shalat**", ar: "عند الصلاة" }, { id: "\"…niscaya kuperintahkan mereka bersiwak setiap kali shalat.\" (Abu Hurairah)", ar: "لأمرتهم بالسواك عند كل صلاة." }],
      [{ id: "**3. Ketika bangun tidur** (malam, untuk shalat)", ar: "عند الانتباه من النوم" }, { id: "Hudzaifah: \"Bila Rasulullah ﷺ bangun malam, beliau menggosok mulutnya dengan siwak.\" Dalam ash-Shahihain: \"…bangun untuk tahajjud.\"", ar: "كان إذا قام من الليل يشوص فاه بالسواك." }],
      [{ id: "**4. Ketika membaca Al-Qur'an**", ar: "عند تلاوة القرآن" }, { id: "'Ali: \"Kami diperintah bersiwak.\" Dan: malaikat mendekat kepada orang yang bersiwak lalu shalat, meletakkan mulutnya di atas mulutnya — maka sucikanlah mulut kalian untuk Al-Qur'an.", ar: "فطهروا أفواهكم للقرآن." }],
      [{ id: "**5. Ketika masuk rumah**", ar: "عند دخول المنزل" }, { id: "Al-Miqdam bin Syuraih bertanya kepada 'Aisyah: \"Apa yang pertama dilakukan Nabi ﷺ bila masuk rumah?\" Ia menjawab: \"Bersiwak.\"", ar: "بأي شيء كان يبدأ النبي ﷺ إذا دخل بيته؟ قالت: بالسواك." }],
      [{ id: "**6. Ketika bau mulut berubah** (lama diam, banyak bicara)", ar: "عند تغير رائحة الفم" }, { id: "\"Siwak itu menyucikan mulut dan diridhai Rabb.\"", ar: "السواك مطهرة للفم مرضاة للرب." }]
    ] },
    { t: "catatan", gaya: "faidah", judul: { id: "Sunnah yang ditinggalkan", ar: "سنة مهجورة" }, id: "Dosen menyebut ini **sunnah yang banyak ditinggalkan**: orang yang bangun tidur bersiwak; lalu ketika hendak berwudhu ia bersiwak lagi; lalu ketika hendak shalat bersiwak untuk ketiga kalinya.", ar: "وهذه من السنن المهجورة: أنه بمجرد أن يقوم من النوم يستاك، ثم إذا أراد أن يتوضأ استاك مرة أخرى، ثم إذا أراد أن يصلي استاك مرة ثالثة." },
    { t: "kutipan", ar: "خصال الفطرة خمسٌ", id: "Dhabit kedua: khishal al-fithrah ada lima.", oleh: { id: "Bidayah al-Mutafaqqih", ar: "بداية المتفقه" } },
    { t: "hadits", ar: "خَمْسٌ مِنَ الْفِطْرَةِ: الِاسْتِحْدَادُ، وَالْخِتَانُ، وَقَصُّ الشَّارِبِ، وَنَتْفُ الْإِبْطِ، وَتَقْلِيمُ الْأَظْفَارِ", id: "Lima perkara termasuk fitrah: mencukur bulu kemaluan, khitan, memendekkan kumis, mencabut bulu ketiak, dan memotong kuku. — Dalam riwayat Muslim: *\"Sepuluh perkara termasuk fitrah.\"*", src: "Muttafaq 'alaih" },
    { t: "catatan", gaya: "tanbih", judul: { id: "Fitrah tidak terbatas pada bilangan", ar: "الفطرة ليست محصورة" }, id: "Fitrah **tidak terbatas** pada lima atau sepuluh; semuanya termasuk perkara yang manusia diciptakan di atasnya.", ar: "فالفطرة ليس منحصرة لا في عشر ولا في خمس؛ إنما هي من الأمور التي فطر الإنسان عليها." },
    { t: "hukum", judul: { id: "Lima khishal al-fithrah", ar: "خصال الفطرة الخمس" }, item: [
      { h: "wajib", judul: { id: "Khitan — wajib bagi laki-laki", ar: "الختان واجب على الرجل" }, id: "Sabda Nabi ﷺ kepada seorang yang masuk Islam: *\"Buanglah darimu rambut kekafiran dan berkhitanlah.\"* Juga: *\"Ibrahim, kekasih Ar-Rahman, berkhitan setelah berusia delapan puluh tahun\"* — dan kita diperintah mengikuti millah Ibrahim (QS. An-Nahl: 123).", ar: "ألقِ عنك شعر الكفر واختتن." },
      { h: "sunnah", judul: { id: "Khitan — mustahab bagi perempuan", ar: "الختان مستحب للمرأة" }, id: "Sabda Nabi ﷺ kepada Ummu 'Athiyyah, juru khitan wanita: *\"Bila engkau mengkhitan, sedikit saja dan jangan berlebihan, karena itu lebih mencerahkan wajah dan lebih disukai suami.\"*", ar: "إذا خفضت فأشمي ولا تنهكي." },
      { h: "sunnah", judul: { id: "Istihdad", ar: "الاستحداد" }, id: "Mencukur bulu kemaluan (*al-'anah*) — dinamai *istihdad* karena memakai besi (pisau cukur). Disunnahkan mencukurnya, dan boleh dihilangkan dengan alat apa saja.", ar: "حلق العانة؛ سمي استحدادًا لأنه يحلق بالموسى." },
      { h: "sunnah", judul: { id: "Mencabut bulu ketiak", ar: "نتف الإبط" }, id: "Yang sunnah adalah **mencabut**; boleh pula dengan alat lain (nurah, krim pembersih), bahkan mencukur pun tidak mengapa.", ar: "النتف هو السنة، ويجوز أن يزال بأي شيء آخر." },
      { h: "sunnah", judul: { id: "Memendekkan kumis", ar: "قص الشارب" }, id: "Ada **dua riwayat shahih**: (1) memotong yang jatuh menutupi bibir; (2) *ihfa'* — memangkasnya hingga tampak putih kulit.", ar: "القص والحف روايتان صحيحتان." },
      { h: "sunnah", judul: { id: "Memotong kuku", ar: "تقليم الأظفار" }, id: "Sunnah, bukan wajib — sebagaimana dikatakan an-Nawawi ketika mengomentari hadits \"lima termasuk fitrah\".", ar: "وهو سنة ليس بواجب كما قال النووي." }
    ] },
    { t: "hadits", ar: "جُزُّوا الشَّوَارِبَ، وَأَرْخُوا اللِّحَى، خَالِفُوا الْمَجُوسَ", id: "Potonglah kumis dan biarkanlah jenggot; selisihilah orang-orang (Majusi/musyrik). — Juga hadits Ibnu 'Umar dalam ash-Shahihain: *\"Selisihilah orang musyrik: biarkan jenggot dan pangkaslah kumis.\"*", src: "HR. Muslim" },

    { t: "judul", id: "Bab 5: Wudhu", ar: "الباب الخامس: باب الوضوء" },
    { t: "p", id: "Urutannya logis: **air sudah di bejana → hajat sudah ditunaikan → mulai wudhu dengan bersiwak →** kini masuk ke tata cara wudhu. Bab ini berisi **tiga dhabit**.", ar: "أتينا بالماء في الإناء، ثم قضينا الحاجة، ثم شرعنا في الوضوء فاستعملنا السواك، هنا نبدأ في صفة الوضوء." },
    { t: "definisi", judul: { id: "Al-Wudhu'", ar: "الوضوء" },
      lughah: { id: "Dari *al-wadha'ah*: kebersihan dan keindahan. **Al-wudhu'** (dhammah) = perbuatannya; **al-wadhu'** (fathah) = airnya.", ar: "من الوضاءة ومن النزاهة ومن النظافة؛ والوُضوء بالضم: الفعل، والوَضوء بالفتح: الماء." },
      istilah: { id: "Membasuh wajah dan kedua tangan, mengusap kepala, dan perbuatan wudhu lainnya.", ar: "يطلق على غسل الوجه واليدين ومسح الرأس وغير ذلك من أفعال الوضوء." } },
    { t: "ayat", ar: "يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا قُمْتُمْ إِلَى الصَّلَاةِ فَاغْسِلُوا وُجُوهَكُمْ وَأَيْدِيَكُمْ إِلَى الْمَرَافِقِ وَامْسَحُوا بِرُءُوسِكُمْ وَأَرْجُلَكُمْ إِلَى الْكَعْبَيْنِ ۚ وَإِن كُنتُمْ جُنُبًا فَاطَّهَّرُوا", id: "Wahai orang-orang beriman, apabila kalian hendak shalat, basuhlah wajah kalian dan tangan kalian sampai siku, usaplah kepala kalian, dan (basuhlah) kaki kalian sampai kedua mata kaki. Jika kalian junub, mandilah.", src: "QS. Al-Ma'idah: 6" },
    { t: "hadits", ar: "رَأَيْتُ النَّبِيَّ ﷺ تَوَضَّأَ نَحْوَ وُضُوئِي هَذَا، ثُمَّ قَالَ: مَنْ تَوَضَّأَ نَحْوَ وُضُوئِي هَذَا ثُمَّ صَلَّى رَكْعَتَيْنِ لَا يُحَدِّثُ فِيهِمَا نَفْسَهُ غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ", id: "Humran, maula 'Utsman: 'Utsman meminta air wudhu, menuangkan ke kedua telapak tangan dan membasuhnya tiga kali, memasukkan tangan kanan ke air lalu berkumur, istinsyaq, dan istintsar, membasuh wajah tiga kali, tangan sampai siku tiga kali, mengusap kepala, lalu membasuh kedua kaki tiga kali. Lalu berkata: \"Aku melihat Nabi ﷺ berwudhu seperti wudhuku ini, dan bersabda: Siapa berwudhu seperti wudhuku ini lalu shalat dua rakaat tanpa berbicara dengan dirinya (melamun) di dalamnya, diampuni dosanya yang telah lalu.\"", src: "Muttafaq 'alaih" },
    { t: "hukum", judul: { id: "Dhabit 1 — Fardhu wudhu (rekap akhir modul)", ar: "الضابط الأول: فروض الوضوء" }, item: [
      { h: "wajib", judul: { id: "1. Membasuh wajah, termasuk berkumur & istinsyaq", ar: "غسل الوجه ومنه المضمضة والاستنشاق" }, id: "Batas wajah: dari pangkal telinga ke pangkal telinga, dan dari tempat tumbuh rambut hingga bawah dagu.", ar: "وحد الوجه من شحمة الأذن إلى شحمة الأذن، ومن منبت الشعر إلى أسفل الذقن." },
      { h: "wajib", judul: { id: "2. Membasuh kedua tangan bersama siku", ar: "غسل اليدين مع المرفقين" }, id: "{وَأَيْدِيَكُمْ إِلَى الْمَرَافِقِ} dan hadits 'Utsman: \"membasuh tangan kanan sampai siku tiga kali, lalu kiri seperti itu.\" **Menyela jari** (*takhlil*) termasuk di dalamnya: \"Sempurnakan wudhu dan sela-selalah jari-jemari.\"", ar: "وتخليل الأصابع يدخل فيه، كذلك يدخل معه غسل المرفق." },
      { h: "wajib", judul: { id: "3. Mengusap kepala, termasuk kedua telinga", ar: "مسح الرأس ومنه الأذنان" }, id: "\"Kedua telinga termasuk kepala\" — mengikuti kepala dalam kewajiban dan cara mengusapnya.", ar: "الأذنان من الرأس؛ أي تبعًا لهما في الوجوب وفي المسح." },
      { h: "wajib", judul: { id: "4. Membasuh kedua kaki bersama mata kaki", ar: "غسل الرجلين مع الكعبين" }, id: "*Ka'bain* = dua tulang yang menonjol di bagian bawah betis. Termasuk menyela jari-jari kaki.", ar: "والكعبان هما العظمان الناتئان في أسفل الساق." },
      { h: "wajib", judul: { id: "5. Tertib (berurutan)", ar: "الترتيب" }, id: "Wajah → tangan → kepala → kaki, sesuai ayat; semua sahabat yang menggambarkan wudhu Nabi ﷺ menyebutnya berurutan seperti dalam ayat.", ar: "وجميع الواصفين لوضوء النبي ﷺ ما ذكروه إلا هكذا مرتبًا." },
      { h: "wajib", judul: { id: "6. Muwalah (bersambung tanpa jeda lama)", ar: "الموالاة" }, id: "Hadits Khalid bin Ma'dan: Nabi ﷺ melihat seorang yang shalat sementara di punggung kakinya ada bagian sebesar dirham yang tak terkena air, maka beliau menyuruhnya **mengulang wudhu dan shalat**.", ar: "فأمره أن يعيد الوضوء والصلاة." }
    ] },
    { t: "catatan", gaya: "info", judul: { id: "Catatan modul tentang muwalah", ar: "الموالاة" }, id: "Di satu tempat modul menyebut muwalah sebagai **syarat** \"menurut pendapat terkuat\", lalu menambahkan \"atau dikatakan termasuk fardhu wudhu\". Pada rekap akhir, modul menghitungnya sebagai salah satu dari **enam fardhu**: wajah (dengan kumur & istinsyaq), tangan bersama siku, kepala (dengan telinga), kaki sampai mata kaki, tertib, dan muwalah. Daftar awal di dhabit menyebut *takhlil* jari secara terpisah; dalam rekap ia masuk ke dalam membasuh tangan/kaki.", ar: "الموالاة شرط على أرجح أقوال أهل العلم، أو قيل هي من فرائض الوضوء، وعلى هذا نقول: فروض الوضوء ستة." },
    { t: "catatan", gaya: "faidah", judul: { id: "Mengapa yang diusap diselipkan di antara yang dibasuh?", ar: "إدخال الممسوح بين المغسولات" }, id: "Ulama berkata: **memasukkan anggota yang diusap (kepala) di antara anggota yang dibasuh** dalam ayat adalah dalil disyaratkannya (diwajibkannya) tertib — andai tidak dimaksudkan urutan, tentu anggota yang dibasuh akan disebut berturut-turut.", ar: "إدخال الممسوح بين المغسولات دليل على اشتراط الوجوب أو اشتراط الترتيب." },
    { t: "khilaf", masalah: { id: "Huruf *ba'* pada {وَامْسَحُوا بِرُءُوسِكُمْ}: sebagian atau menempel?", ar: "الباء في «برءوسكم»: للتبعيض أم للإلصاق؟" }, pendapat: [
      { siapa: { id: "Sebagian ulama", ar: "بعض العلماء" }, isi: { id: "*Li-t-tab'idh* (menunjukkan sebagian): cukup mengusap sebagian kepala.", ar: "للتبعيض." } },
      { siapa: { id: "Sebagian lainnya", ar: "وآخرون" }, isi: { id: "*Lil-ilshaq* (menempelkan): tangan ditempelkan dan diusapkan ke kepala.", ar: "للإلصاق." } }
    ], alasan: { id: "Bagaimanapun, **harus ada pengusapan kepala atau sebagian darinya**; bila mengusap sebagian, itu mencukupi. Adapun sifat yang dicontohkan Nabi ﷺ: mulai dari depan kepala hingga tengkuk, lalu kembali ke tempat semula (hadits 'Abdullah bin Zaid: \"lalu beliau mengusap kepalanya dengan kedua tangan, menghadapkan dan membelakangkannya\").", ar: "وعلى كلٍّ إذا مسح جزءًا من الرأس أجزأه، والصفة كما بين النبي ﷺ." } },
    { t: "langkah", judul: { id: "Tata cara wudhu menurut modul", ar: "صفة الوضوء" }, item: [
      { id: "Membaca **basmalah**, lalu **bersiwak**.", ar: "بعد أن يسمي، ويستاك." },
      { id: "Membasuh **kedua telapak tangan** tiga kali.", ar: "يغسل الكفين ثلاثًا." },
      { id: "**Berkumur dan istinsyaq** tiga kali dengan tiga cidukan.", ar: "ثم يتمضمض ويستنشق ثلاثًا بثلاث غرفات." },
      { id: "Membasuh **wajah**: dari pangkal telinga ke pangkal telinga, dari tempat tumbuh rambut ke bawah dagu.", ar: "ثم يغسل وجهه." },
      { id: "Membasuh **tangan sampai siku**: mulai dari ujung jari hingga meliputi siku; kanan dulu, lalu kiri.", ar: "يبدأ من أطراف الأصابع ويستوعب المرفق، يبدأ باليمنى ثم اليسرى." },
      { id: "Mengusap **kepala**: mulai dari depan hingga tengkuk, lalu dikembalikan ke tempat awal.", ar: "يبدأ بمقدم رأسه حتى يذهب بهما إلى قفاه ثم يردهما." },
      { id: "Mengusap **kedua telinga** sekali — kepala dan telinga cukup sekali.", ar: "ثم يمسح أذنيه مرة واحدة." },
      { id: "Membasuh **kaki kanan** tiga kali, lalu **kaki kiri** tiga kali.", ar: "ثم يغسل رجله اليمنى ثلاثًا ثم اليسرى ثلاثًا." }
    ] },
    { t: "definisi", judul: { id: "Asy-Syarth (syarat)", ar: "الشرط" }, istilah: { id: "**Sesuatu yang ketiadaannya menyebabkan ketiadaan (hukum), tetapi keberadaannya tidak menyebabkan ada atau tidaknya.** Contoh: orang yang hendak shalat wajib berwudhu; tetapi orang yang berwudhu tidak wajib shalat.", ar: "ما يلزم من عدمه العدم، ولا يلزم من وجوده وجود ولا عدم." } },
    { t: "hukum", judul: { id: "Dhabit 2 — Syarat sah wudhu", ar: "شروط صحة الوضوء" }, item: [
      { h: "info", judul: { id: "Terhentinya hal yang mewajibkannya", ar: "انقطاع ما يوجبه" }, id: "Seperti buang air besar, kencing, dan segala yang keluar dari dua jalan — Nabi ﷺ menunaikan hajatnya dulu, membasuh tangan, baru berwudhu.", ar: "وما يوجب الوضوء كالغائط والبول ونحوه وما خرج من السبيلين." },
      { h: "info", judul: { id: "Islam", ar: "الإسلام" }, id: "{لَئِنْ أَشْرَكْتَ لَيَحْبَطَنَّ عَمَلُكَ} (QS. Az-Zumar: 65).", ar: "لئن أشركت ليحبطن عملك." },
      { h: "info", judul: { id: "Niat", ar: "النية" }, id: "\"Sesungguhnya amal itu tergantung niat.\" Seandainya air dialirkan ke anggota wudhu tanpa niat, **tidak sah**.", ar: "فلو أجرى الماء على أعضاء الوضوء بلا نية لا يجزئه." },
      { h: "info", judul: { id: "Berakal dan tamyiz", ar: "العقل والتمييز" }, id: "\"Pena diangkat dari tiga: orang tidur hingga bangun, anak kecil hingga baligh, orang gila hingga berakal.\" Tidak ada ibadah atas orang gila dan anak sebelum tamyiz.", ar: "رفع القلم عن ثلاثة." },
      { h: "info", judul: { id: "Air thahur", ar: "الماء الطهور" }, id: "Wudhu **tidak sah** dengan air thahir maupun air najis — hanya dengan air thahur.", ar: "فلا يصح الوضوء بماء طاهر ولا بماء نجس." },
      { h: "info", judul: { id: "Menghilangkan penghalang sampainya air ke kulit", ar: "إزالة ما يمنع وصول الماء إلى البشرة" }, id: "\"Sempurnakan wudhu.\" Ibnu 'Umar: *isbagh* adalah **al-inqa'** (membersihkan dengan tuntas).", ar: "قال ابن عمر: الإسباغ الإنقاء." }
    ] },
    { t: "hukum", judul: { id: "Dhabit 3 — Sepuluh sunnah wudhu", ar: "الضابط الثالث: سنن الوضوء عشر" }, item: [
      { h: "sunnah", judul: { id: "1. Basmalah", ar: "البسملة" }, id: "\"Tidak ada shalat bagi yang tidak berwudhu, dan tidak ada wudhu bagi yang tidak menyebut nama Allah.\" Perintah ini dipalingkan (menjadi sunnah) karena basmalah tidak disebut dalam hadits 'Abdullah bin Zaid maupun 'Utsman.", ar: "وخرج هذا الأمر بفعله ﷺ أن البسملة لم تذكر في حديث عبد الله بن زيد ولا في حديث عثمان." },
      { h: "sunnah", judul: { id: "2. Siwak", ar: "السواك" }, id: "\"…niscaya kuperintahkan mereka bersiwak setiap wudhu.\"", ar: "لأمرتهم بالسواك مع كل وضوء." },
      { h: "sunnah", judul: { id: "3. Membasuh kedua telapak tangan", ar: "غسل الكفين" }, id: "\"Ia menuangkan air ke kedua tangannya lalu membasuhnya tiga kali.\"", ar: "فأفرغ على يديه من إنائه فغسلهما ثلاث مرات." },
      { h: "sunnah", judul: { id: "4. Mendahulukan kumur & istinsyaq sebelum wajah", ar: "البداءة بالمضمضة والاستنشاق قبل غسل الوجه" }, id: "\"Ia memasukkan tangannya ke bejana, lalu berkumur, istinsyaq, dan istintsar tiga kali dengan tiga cidukan.\"", ar: "فمضمض واستنشق واستنثر ثلاثًا بثلاث غرفات." },
      { h: "sunnah", judul: { id: "5. Bersungguh-sungguh dalam keduanya, kecuali orang puasa", ar: "المبالغة فيهما لغير الصائم" }, id: "\"…dan bersungguh-sungguhlah dalam istinsyaq, kecuali bila engkau berpuasa.\" (Laqith bin Shabirah)", ar: "وبالغ في الاستنشاق إلا أن تكون صائمًا." },
      { h: "sunnah", judul: { id: "6. Menyela jenggot yang lebat", ar: "تخليل اللحية الكثيفة" }, id: "Nabi ﷺ mengambil seciduk air, memasukkannya di bawah dagu, lalu menyela jenggotnya. Jenggot **tipis** yang kulitnya tampak, dibasuh seperti wajah.", ar: "أما إذا كانت اللحية خفيفة ويرى لون البشرة فإنها تغسل كما يغسل الوجه." },
      { h: "sunnah", judul: { id: "7. Mendahulukan kanan atas kiri", ar: "تقديم اليمنى على اليسرى" }, id: "Hadits 'Utsman: beliau membasuh tangan dan kaki kanan lebih dahulu.", ar: "أنه كان يغسل اليمنى من اليد والرجل." },
      { h: "sunnah", judul: { id: "8. Basuhan kedua dan ketiga", ar: "الغسلة الثانية والثالثة" }, id: "Ibnu 'Abbas: Nabi ﷺ berwudhu sekali-sekali; 'Abdullah bin Zaid: dua kali-dua kali. Ini dalil bahwa **yang wajib hanya basuhan pertama**.", ar: "فيه دليل على أن الواجبة هي الأولى فقط." },
      { h: "sunnah", judul: { id: "9. Menggosok anggota wudhu", ar: "دلك الأعضاء" }, id: "Nabi ﷺ diberi dua pertiga mud air, lalu menggosok kedua lengannya.", ar: "أنه أتي بثلثي مد فجعل يدلك ذراعيه." },
      { h: "sunnah", judul: { id: "10. Doa ma'tsur setelah wudhu", ar: "الدعاء بعده بالمأثور" }, id: "[[أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ]] — dibukakan baginya delapan pintu surga. Tambahan: [[اللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ وَاجْعَلْنِي مِنَ الْمُتَطَهِّرِينَ]]", ar: "إلا فتحت له أبواب الجنة الثمانية يدخل من أيها شاء." }
    ] },
    { t: "banding", judul: { id: "Jangan tertukar: fardhu vs sunnah", ar: "الفرض والسنة" },
      kiri: { judul: { id: "Fardhu / syarat", ar: "فرض أو شرط" }, poin: [
        { id: "Basuhan **pertama** setiap anggota", ar: "الغسلة الأولى" }, { id: "Kumur & istinsyaq (bagian dari wajah)", ar: "المضمضة والاستنشاق" }, { id: "Niat", ar: "النية" }, { id: "Tertib & muwalah", ar: "الترتيب والموالاة" } ] },
      kanan: { judul: { id: "Sunnah", ar: "سنة" }, poin: [
        { id: "Basuhan **kedua dan ketiga**", ar: "الغسلة الثانية والثالثة" }, { id: "**Bersungguh-sungguh** dalam kumur & istinsyaq", ar: "المبالغة فيهما" }, { id: "Basmalah", ar: "البسملة" }, { id: "Mendahulukan kanan", ar: "تقديم اليمنى" } ] } },
    { t: "cek", q: { id: "Seseorang yang berpuasa ingin wudhunya sempurna. Apa yang sebaiknya ia lakukan pada istinsyaq?", ar: "الصائم والاستنشاق:" }, o: [
      { id: "Melakukannya tanpa berlebihan", ar: "يستنشق دون مبالغة" },
      { id: "Meninggalkannya selama puasa", ar: "يترك الاستنشاق" },
      { id: "Melakukannya dengan sangat dalam", ar: "يبالغ في الاستنشاق" },
      { id: "Menggantinya dengan mengusap hidung", ar: "يمسح أنفه بدلًا منه" }], j: 0,
      b: { id: "Istinsyaq tetap dilakukan (ia bagian dari membasuh wajah), tetapi **mubalaghah** dikecualikan bagi orang yang puasa: \"…kecuali bila engkau berpuasa.\"", ar: "وبالغ في الاستنشاق إلا أن تكون صائمًا." } },

    { t: "judul", id: "Bab 6: Mengusap Khuff", ar: "الباب السادس: باب المسح على الخفين" },
    { t: "p", id: "Kadang seseorang berwudhu dan sampai ke anggota kaki, ternyata ia memakai khuff. Apa yang dilakukan? **Ia mengusap di atasnya.** *Khuff* adalah alas kaki dari kulit, wol, dan semisalnya yang menutupi kaki. Bab ini berisi **tiga dhabit**.", ar: "والخف: هو ما يلبس عن القدم من الجلد ومن الصوف ونحوهما." },
    { t: "hukum", judul: { id: "Dhabit 1 — Tiga syarat mengusap khuff", ar: "شروط المسح على الخفين ثلاثة" }, item: [
      { h: "info", judul: { id: "1. Dipakai setelah thaharah dengan air sempurna", ar: "لبسهما بعد كمال الطهارة المائية" }, id: "Al-Mughirah: \"Aku bersama Nabi ﷺ dalam safar, aku membungkuk untuk melepas khuffnya, beliau bersabda: *Biarkan, aku memasukkan keduanya dalam keadaan suci*, lalu beliau mengusapnya.\" Ibnul Mundzir: ulama **berijma'** bahwa orang yang menyempurnakan thaharah lalu memakai khuff kemudian berhadats boleh mengusapnya — berlaku bagi laki-laki dan perempuan.", ar: "دعهما فإني أدخلتهما طاهرتين." },
      { h: "info", judul: { id: "2. Menutupi sebagian besar area wajib basuh", ar: "سترهما لغالب محل الفرض" }, id: "Lihat khilaf tentang khuff yang berlubang di bawah.", ar: "" },
      { h: "info", judul: { id: "3. Zat khuff suci", ar: "طهارة عينهما" }, id: "Tidak najis dan tidak dibuat dari kulit najis — seperti kulit anjing atau babi, atau kulit yang belum disamak — menurut pendapat yang menajiskan anjing dan babi.", ar: "فلا يكون نجس أو مصنوع من جلد نجس." }
    ] },
    { t: "khilaf", masalah: { id: "Mengusap khuff yang berlubang/robek", ar: "المسح على الخف المخرق" }, pendapat: [
      { siapa: { id: "Sebagian ulama", ar: "بعض العلماء" }, isi: { id: "Tidak boleh bila lubang membuat sebagian area wajib terbuka.", ar: "لا يجوز." } },
      { siapa: { id: "Pilihan Syaikhul Islam Ibnu Taimiyah", ar: "اختيار شيخ الإسلام" }, isi: { id: "**Boleh** mengusapnya.", ar: "جواز المسح عليه." }, rajih: true }
    ], alasan: { id: "Syaikhul Islam menjelaskan bahwa **kebanyakan khuff para sahabat tidak selamat dari lubang/robekan**, namun mereka tetap mengusapnya. (Modul menandai pendapat ini sebagai pilihan Syaikhul Islam.)", ar: "وبين أن غالب خفاف الصحابة لم تسلم من ذلك." } },
    { t: "hukum", judul: { id: "Dhabit 2 — Tiga pembatal mengusap khuff", ar: "مبطلات المسح على الخف ثلاثة" }, item: [
      { h: "batal", judul: { id: "1. Hadats besar", ar: "الحدث الأكبر" }, id: "Shafwan bin 'Assal: \"Rasulullah ﷺ memerintahkan kami bila safar agar tidak melepas khuff tiga hari tiga malam **kecuali karena janabah**, tetapi (tetap mengusap) karena buang air besar, kencing, dan tidur.\"", ar: "إلا من جنابة، ولكن من غائط وبول ونوم." },
      { h: "batal", judul: { id: "2. Habisnya masa", ar: "انقضاء المدة" }, id: "Bila masa habis, tidak boleh lagi mengusap.", ar: "فإذا انتهت المدة لا يجوز لك أن تمسح." },
      { h: "batal", judul: { id: "3. Melepas yang diusap", ar: "خلع الممسوح عليه" }, id: "Bila khuff dilepas setelah diusap, tidak boleh memakainya lagi lalu mengusapnya sebelum berwudhu (dengan membasuh kaki).", ar: "لا يجوز لك أن تلبسه مرة أخرى قبل أن تتوضأ وتمسح عليه." }
    ] },
    { t: "catatan", gaya: "tanbih", judul: { id: "Yang batal: mengusapnya, bukan wudhunya", ar: "يبطل المسح لا الوضوء" }, id: "Melepas khuff atau habisnya masa **tidak membatalkan wudhu**; yang batal hanyalah *mash*-nya. Jadi bila ia memakai khuff, mengusapnya, lalu melepasnya dan memakai (atau mengganti) khuff lain, ia **tidak boleh** mengusap sebelum berwudhu dan membasuh kakinya.", ar: "اعلم أن خلع الممسوح عليه أو انقضاء المدة لا ينقض الوضوء، إنما يبطل المسح فقط." },
    { t: "hadits", ar: "جَعَلَ النَّبِيُّ ﷺ ثَلَاثَةَ أَيَّامٍ وَلَيَالِيَهُنَّ لِلْمُسَافِرِ، وَيَوْمًا وَلَيْلَةً لِلْمُقِيمِ", id: "Dhabit 3 — masa mengusap: Nabi ﷺ menetapkan tiga hari tiga malam bagi musafir, dan sehari semalam bagi orang mukim (dalam mengusap khuff).", src: "HR. Muslim, dari 'Ali" },
    { t: "banding", judul: { id: "Khuff vs jabirah (gips/perban)", ar: "الخف والجبيرة" },
      kiri: { judul: { id: "Khuff", ar: "الخف" }, ikon: "clock", poin: [
        { id: "Harus dipakai dalam keadaan suci", ar: "يلبس على طهارة" }, { id: "Ada masa: 1 hari (mukim), 3 hari (musafir)", ar: "محدد المدة" }, { id: "Wajib dilepas karena hadats besar", ar: "ينزع للجنابة" }, { id: "Khusus kaki", ar: "خاص بالقدم" } ] },
      kanan: { judul: { id: "Jabirah", ar: "الجبيرة" }, ikon: "shield", poin: [
        { id: "**Tidak** disyaratkan dipakai dalam keadaan suci", ar: "لا يشترط أن تلبس على طهارة" }, { id: "**Tidak** ada batas masa", ar: "لا مدة لها" }, { id: "Tidak wajib dilepas, baik hadats kecil maupun besar", ar: "لا يشترط نزعها" }, { id: "Bisa di lengan, kaki, dsb.", ar: "على الذراع أو القدم" } ] } },
    { t: "tanya", q: { id: "Lengan seseorang patah lalu dipasang gips tanpa berwudhu terlebih dahulu. Bolehkah ia mengusap gips itu saat wudhu dan mandi?", ar: "كسر الذراع ووضع جبيرة على غير وضوء:" }, a: { id: "**Boleh.** Jabirah tidak disyaratkan dipakai dalam keadaan suci, tidak wajib dilepas baik karena hadats kecil maupun besar, dan tidak ada batas masanya — berbeda dengan khuff.", ar: "لا يشترط أن تلبس على طهارة، ولا يشترط نزعها لا عند الحدث الأكبر ولا الأصغر، ولا مدة لها." } },
    { t: "tanya", q: { id: "Mengapa basmalah dihukumi sunnah, padahal ada hadits \"tidak ada wudhu bagi yang tidak menyebut nama Allah\"?", ar: "لماذا كانت التسمية سنة؟" }, a: { id: "Karena dalam sifat wudhu Nabi ﷺ yang diriwayatkan 'Abdullah bin Zaid dan 'Utsman **tidak disebutkan basmalah**; ini memalingkan perintah dari wajib menjadi sunnah — demikian penjelasan modul.", ar: "لأن البسملة لم تذكر في حديث عبد الله بن زيد ولا في حديث عثمان." } },

    { t: "ringkasan", item: [
      { id: "Siwak sunnah setiap saat; sangat dianjurkan pada 6 keadaan: wudhu, shalat, bangun tidur, tilawah, masuk rumah, mulut berubah bau.", ar: "مواضع تأكد السواك الستة." },
      { id: "Fitrah lima: khitan (wajib bagi laki-laki, mustahab bagi perempuan), istihdad, mencabut bulu ketiak, memendekkan kumis, memotong kuku.", ar: "خصال الفطرة الخمس." },
      { id: "Fardhu wudhu (rekap): wajah dengan kumur-istinsyaq, tangan dengan siku, kepala dengan telinga, kaki dengan mata kaki, tertib, muwalah.", ar: "فروض الوضوء ستة." },
      { id: "Syarat: terhentinya pembatal, Islam, niat, akal, tamyiz, air thahur, hilangnya penghalang air. Sunnahnya sepuluh.", ar: "شروط الوضوء وسننه العشر." },
      { id: "Khuff: 3 syarat (dipakai setelah thaharah sempurna, menutupi area wajib, zatnya suci), 3 pembatal (janabah, habis masa, dilepas), masa 1 hari mukim / 3 hari musafir.", ar: "شروط المسح ومبطلاته ومدته." }
    ] }
  ],
  istilah: [
    { ar: "السواك", latin: "as-siwak", id: "Siwak", def: { id: "Membersihkan mulut dengan kayu siwak; sunnah setiap saat, sangat dianjurkan pada enam keadaan.", ar: "مطهرة للفم مرضاة للرب." } },
    { ar: "الفطرة", latin: "al-fithrah", id: "Fitrah", def: { id: "Perkara yang manusia diciptakan di atasnya; khishalnya tidak terbatas pada lima atau sepuluh.", ar: "الأمور التي فطر الإنسان عليها." } },
    { ar: "الاستحداد", latin: "al-istihdad", id: "Istihdad", def: { id: "Mencukur bulu kemaluan; dinamai demikian karena memakai besi (pisau cukur).", ar: "حلق العانة." } },
    { ar: "الإحفاء", latin: "al-ihfa'", id: "Ihfa'", def: { id: "Memangkas kumis hingga tampak putih kulit — salah satu dari dua riwayat shahih.", ar: "الأخذ من الشارب حتى يبدو بياض البشرة." } },
    { ar: "الوُضوء / الوَضوء", latin: "al-wudhu' / al-wadhu'", id: "Wudhu / air wudhu", def: { id: "Dengan dhammah: perbuatannya; dengan fathah: airnya.", ar: "بالضم الفعل وبالفتح الماء." } },
    { ar: "الشرط", latin: "asy-syarth", id: "Syarat", def: { id: "Yang ketiadaannya menyebabkan ketiadaan, tetapi keberadaannya tidak menyebabkan ada atau tidaknya.", ar: "ما يلزم من عدمه العدم ولا يلزم من وجوده وجود ولا عدم." } },
    { ar: "الموالاة", latin: "al-muwalah", id: "Muwalah", def: { id: "Berwudhu secara bersambung tanpa jeda yang lama; dalilnya hadits lum'ah sebesar dirham.", ar: "تتابع غسل الأعضاء." } },
    { ar: "الإسباغ", latin: "al-isbagh", id: "Isbagh", def: { id: "Menyempurnakan wudhu; kata Ibnu 'Umar: al-inqa' (membersihkan dengan tuntas).", ar: "الإنقاء." } },
    { ar: "الكعبان", latin: "al-ka'ban", id: "Dua mata kaki", def: { id: "Dua tulang yang menonjol di bagian bawah betis.", ar: "العظمان الناتئان في أسفل الساق." } },
    { ar: "الخف", latin: "al-khuff", id: "Khuff", def: { id: "Alas kaki dari kulit, wol, dan semisalnya yang menutupi kaki.", ar: "ما يلبس على القدم من الجلد والصوف ونحوهما." } },
    { ar: "الجبيرة", latin: "al-jabirah", id: "Jabirah", def: { id: "Pembalut/gips pada anggota yang patah; diusap tanpa syarat suci dan tanpa batas masa.", ar: "ما يوضع على الكسر." } }
  ],
  latihan: {
    pg: [
      { q: { id: "Hadits \"Siwak itu menyucikan mulut dan diridhai Rabb\" dalam modul dijadikan dalil untuk dua hal. Yang mana?", ar: "حديث «السواك مطهرة للفم» دليل على:" }, o: [
        { id: "Siwak setiap saat & ketika bau mulut berubah", ar: "السواك كل وقت وعند تغير الفم" },
        { id: "Siwak ketika wudhu & ketika hendak shalat", ar: "السواك عند الوضوء والصلاة" },
        { id: "Siwak ketika masuk rumah & bangun malam", ar: "السواك عند دخول البيت والقيام" },
        { id: "Siwak ketika tilawah & ketika berpuasa", ar: "السواك عند التلاوة والصيام" }], j: 0,
        b: { id: "Modul memakainya sebagai dalil umum (siwak sunnah setiap waktu) dan dalil keadaan keenam (berubahnya bau mulut).", ar: "استحباب السواك في كل وقت، وعند تغير رائحة الفم." } },
      { q: { id: "Pertanyaan al-Miqdam bin Syuraih kepada 'Aisyah menjadi dalil siwak pada keadaan…", ar: "حديث المقدام عن عائشة دليل السواك عند:" }, o: [
        { id: "Masuk ke dalam rumah", ar: "دخول المنزل" },
        { id: "Bangun dari tidur malam", ar: "القيام من النوم" },
        { id: "Hendak membaca Al-Qur'an", ar: "تلاوة القرآن" },
        { id: "Hendak menunaikan shalat", ar: "القيام إلى الصلاة" }], j: 0,
        b: { id: "\"Dengan apa Nabi ﷺ memulai bila masuk rumahnya?\" Ia menjawab: \"Dengan siwak.\"", ar: "بأي شيء كان يبدأ إذا دخل بيته؟ قالت: بالسواك." } },
      { q: { id: "Menurut modul, hukum khitan bagi laki-laki dan perempuan adalah…", ar: "حكم الختان للرجل والمرأة:" }, o: [
        { id: "Wajib bagi laki-laki, mustahab bagi perempuan", ar: "واجب للرجل مستحب للمرأة" },
        { id: "Wajib bagi keduanya tanpa perbedaan", ar: "واجب عليهما" },
        { id: "Mustahab bagi keduanya tanpa perbedaan", ar: "مستحب لهما" },
        { id: "Mustahab bagi laki-laki, wajib bagi perempuan", ar: "مستحب للرجل واجب للمرأة" }], j: 0,
        b: { id: "Dalil wajib bagi laki-laki: \"Buanglah rambut kekafiran dan berkhitanlah\" dan khitannya Ibrahim. Bagi perempuan mustahab: hadits Ummu 'Athiyyah.", ar: "واجب على الرجل ومستحب للمرأة." } },
      { q: { id: "Dalam masalah kumis, modul menyebut dua riwayat shahih. Keduanya adalah…", ar: "قص الشارب فيه روايتان:" }, o: [
        { id: "Memotong yang menutupi bibir, atau memangkas hingga kulit", ar: "أخذ ما يسقط على الشفتين أو الحف" },
        { id: "Mencukur habis, atau membiarkannya tumbuh memanjang", ar: "الحلق كله أو الإعفاء" },
        { id: "Memotong setiap Jumat, atau setiap empat puluh hari", ar: "كل جمعة أو كل أربعين يومًا" },
        { id: "Memotong dengan gunting, atau mencabut dengan tangan", ar: "بالمقص أو بالنتف" }], j: 0,
        b: { id: "\"Al-qashsh wal-haff: dua riwayat shahih — mengambil yang jatuh di bibir, dan mengambil hingga tampak putih kulit.\"", ar: "القص والحف روايتان صحيحتان." } },
      { q: { id: "Seseorang mengalirkan air ke seluruh anggota wudhu dengan benar dan berurutan, tetapi hanya untuk menyegarkan badan. Wudhunya…", ar: "أجرى الماء على أعضاء الوضوء للتبرد:" }, o: [
        { id: "Tidak sah, karena tidak ada niat", ar: "لا يصح لعدم النية" },
        { id: "Sah, karena anggotanya sudah basah", ar: "يصح لحصول الغسل" },
        { id: "Sah, asalkan ia membaca basmalah di awal", ar: "يصح إن سمى" },
        { id: "Tidak sah, karena tidak bersiwak", ar: "لا يصح لترك السواك" }], j: 0,
        b: { id: "Niat adalah syarat: \"Seandainya air dialirkan ke anggota wudhu tanpa niat, tidak mencukupinya.\" Basmalah dan siwak hanya sunnah.", ar: "فلو أجرى الماء على أعضاء الوضوء بلا نية لا يجزئه." } },
      { q: { id: "Definisi syarat: \"ketiadaannya menyebabkan ketiadaan…\" Contoh yang paling tepat dari modul adalah…", ar: "مثال الشرط:" }, o: [
        { id: "Shalat butuh wudhu, tetapi wudhu tak mewajibkan shalat", ar: "الصلاة تحتاج الوضوء والوضوء لا يلزم منه الصلاة" },
        { id: "Wudhu butuh air, dan adanya air mewajibkan wudhu", ar: "الوضوء يحتاج الماء والماء يوجب الوضوء" },
        { id: "Shalat butuh niat, dan adanya niat menghasilkan shalat", ar: "الصلاة تحتاج النية والنية توجب الصلاة" },
        { id: "Hadats mewajibkan wudhu, dan wudhu menghapus hadats", ar: "الحدث يوجب الوضوء والوضوء يرفعه" }], j: 0,
        b: { id: "\"Bila ingin shalat ia harus berwudhu, dan bila ia berwudhu tidak wajib baginya shalat.\"", ar: "فإذا أراد الإنسان أن يصلي لا بد أن يتوضأ، وإذا توضأ لا يلزمه أن يصلي." } },
      { q: { id: "Hadits Khalid bin Ma'dan tentang bagian kaki sebesar dirham yang tak terkena air menunjukkan wajibnya…", ar: "حديث اللمعة قدر الدرهم دليل على:" }, o: [
        { id: "Muwalah, karena wudhu harus diulang semua", ar: "الموالاة؛ لأنه أمر بإعادة الوضوء" },
        { id: "Tertib, karena kaki dibasuh paling akhir", ar: "الترتيب؛ لأن الرجل آخر الأعضاء" },
        { id: "Isbagh, cukup membasuh bagian itu saja", ar: "الإسباغ بغسل الموضع فقط" },
        { id: "Niat, karena ia lupa berniat wudhu", ar: "النية لأنه نسيها" }], j: 0,
        b: { id: "Ia disuruh **mengulang wudhu** (bukan hanya membasuh bagian itu) dan shalatnya — dalil muwalah.", ar: "فأمره أن يعيد الوضوء والصلاة." } },
      { q: { id: "Ulama berkata, disebutnya anggota yang diusap di antara anggota yang dibasuh dalam ayat wudhu menunjukkan…", ar: "إدخال الممسوح بين المغسولات دليل على:" }, o: [
        { id: "Disyaratkannya tertib", ar: "اشتراط الترتيب" },
        { id: "Bolehnya mengusap kaki", ar: "جواز مسح الرجلين" },
        { id: "Cukupnya mengusap sebagian", ar: "إجزاء مسح البعض" },
        { id: "Sunnahnya membasuh tiga kali", ar: "سنية التثليث" }], j: 0,
        b: { id: "Seandainya urutan tidak dimaksudkan, yang dibasuh akan disebut berturut-turut — maka ini dalil tertib.", ar: "دليل على اشتراط الترتيب." } },
      { q: { id: "Perbedaan pendapat tentang huruf *ba'* dalam {وَامْسَحُوا بِرُءُوسِكُمْ} adalah antara makna…", ar: "الخلاف في الباء:" }, o: [
        { id: "Tab'idh (sebagian) dan ilshaq (menempel)", ar: "التبعيض والإلصاق" },
        { id: "Isti'anah (alat) dan sababiyyah (sebab)", ar: "الاستعانة والسببية" },
        { id: "Zharfiyyah (tempat) dan mushahabah (bersama)", ar: "الظرفية والمصاحبة" },
        { id: "Qasam (sumpah) dan badal (pengganti)", ar: "القسم والبدل" }], j: 0,
        b: { id: "\"Ulama berbeda tentang *ba'*: untuk tab'idh ataukah ilshaq?\" Bagaimanapun, mengusap sebagian kepala mencukupi.", ar: "هل هي للتبعيض أم هي للإلصاق؟" } },
      { q: { id: "Seseorang berwudhu dengan membasuh setiap anggota satu kali saja. Menurut dalil yang dibawakan modul, wudhunya…", ar: "توضأ مرة مرة:" }, o: [
        { id: "Sah, karena yang wajib basuhan pertama", ar: "يصح؛ الواجب الأولى" },
        { id: "Tidak sah, karena wajib tiga kali", ar: "لا يصح؛ الواجب ثلاثًا" },
        { id: "Tidak sah, karena wajib dua kali", ar: "لا يصح؛ الواجب مرتين" },
        { id: "Sah, tetapi wajib diulang untuk shalat", ar: "يصح ويعاد للصلاة" }], j: 0,
        b: { id: "Ibnu 'Abbas: Nabi ﷺ berwudhu sekali-sekali; maka basuhan kedua dan ketiga sunnah, bukan wajib.", ar: "الواجبة هي الأولى فقط." } },
      { q: { id: "Jenggot seseorang tipis sehingga kulit dagunya tampak. Bagaimana cara membasuhnya ketika wudhu?", ar: "اللحية الخفيفة:" }, o: [
        { id: "Dibasuh sampai kulit seperti wajah", ar: "تغسل كما يغسل الوجه" },
        { id: "Cukup disela dengan jari yang basah", ar: "يكفي تخليلها" },
        { id: "Cukup diusap bagian luarnya saja", ar: "يمسح ظاهرها" },
        { id: "Dibiarkan, karena bukan bagian wajah", ar: "لا تغسل" }], j: 0,
        b: { id: "Takhlil disunnahkan untuk jenggot **lebat**; jenggot tipis yang tampak kulitnya dibasuh seperti wajah.", ar: "إذا كانت خفيفة ويرى لون البشرة فإنها تغسل." } },
      { q: { id: "Seorang musafir memakai khuff setelah berwudhu sempurna, lalu junub di hari kedua. Untuk mandi janabah ia harus…", ar: "مسافر لابس خفين أصابته جنابة:" }, o: [
        { id: "Melepas khuff dan membasuh kakinya", ar: "ينزع الخفين ويغسل رجليه" },
        { id: "Mengusap khuff karena masih dalam masa", ar: "يمسح لبقاء المدة" },
        { id: "Mengusap khuff karena ia sedang safar", ar: "يمسح لأنه مسافر" },
        { id: "Bertayammum sebagai ganti membasuh kaki", ar: "يتيمم عن الرجلين" }], j: 0,
        b: { id: "Hadats besar membatalkan mash: \"…agar kami tidak melepas khuff tiga hari **kecuali karena janabah**.\"", ar: "إلا من جنابة." } },
      { q: { id: "Seseorang yang mukim mengusap khuff, lalu melepasnya untuk dibersihkan dan memakainya kembali. Ia masih punya wudhu. Hukum yang benar…", ar: "خلع الخف بعد المسح وهو على طهارة:" }, o: [
        { id: "Wudhu tetap; mengusap baru boleh setelah wudhu ulang", ar: "وضوءه باق ولا يمسح حتى يتوضأ" },
        { id: "Wudhunya batal sehingga ia wajib berwudhu lagi", ar: "انتقض وضوؤه" },
        { id: "Wudhu tetap dan ia boleh mengusap seperti semula", ar: "وضوءه باق ويمسح" },
        { id: "Wudhu tetap; cukup membasuh kedua kaki sebelum shalat", ar: "يكفيه غسل الرجلين" }], j: 0,
        b: { id: "\"Melepas yang diusap atau habis masanya **tidak membatalkan wudhu**, hanya membatalkan mash.\" Untuk mengusap lagi, ia harus memakainya setelah wudhu dengan membasuh kaki.", ar: "لا ينقض الوضوء، إنما يبطل المسح فقط." } },
      { q: { id: "Manakah perbedaan jabirah dari khuff yang disebut dalam modul?", ar: "مما تختص به الجبيرة:" }, o: [
        { id: "Tidak disyaratkan dipakai dalam keadaan suci", ar: "لا يشترط لبسها على طهارة" },
        { id: "Masanya sehari semalam bagi orang mukim", ar: "مدتها يوم وليلة للمقيم" },
        { id: "Wajib dilepas ketika junub", ar: "تنزع عند الجنابة" },
        { id: "Hanya boleh dipakai pada kaki", ar: "خاصة بالقدم" }], j: 0,
        b: { id: "Jabirah: tidak disyaratkan suci, tidak wajib dilepas (hadats kecil maupun besar), tidak ada masa. Tiga pilihan lain adalah sifat khuff.", ar: "لا يشترط أن تلبس على طهارة." } }
    ],
    bs: [
      { t: { id: "Bersiwak disunnahkan setiap waktu, bukan hanya pada enam keadaan.", ar: "السواك مستحب في كل وقت." }, j: true, b: { id: "\"Ketahuilah, siwak mustahab setiap waktu\"; enam keadaan itu tempat anjurannya menguat.", ar: "اعلم أن السواك مستحب في كل وقت." } },
      { t: { id: "Menurut modul, khishal al-fithrah hanya terbatas lima perkara.", ar: "الفطرة محصورة في خمس." }, j: false, b: { id: "Ada riwayat \"sepuluh\"; dan fitrah tidak terbatas pada lima maupun sepuluh.", ar: "ليس منحصرة لا في عشر ولا في خمس." } },
      { t: { id: "Bulu ketiak boleh dihilangkan dengan krim atau dicukur, walau yang sunnah adalah mencabutnya.", ar: "يجوز إزالة شعر الإبط بغير النتف." }, j: true, b: { id: "\"Mencabut adalah sunnah, dan boleh dihilangkan dengan apa saja seperti nurah dan krim, bahkan mencukur pun tidak mengapa.\"", ar: "ولا حرج إذا أراد أن يحلق." } },
      { t: { id: "Kedua telinga diusap dengan air baru setelah kepala, tiga kali.", ar: "يمسح الأذنين ثلاثًا." }, j: false, b: { id: "Modul: \"lalu mengusap kedua telinganya sekali; kepala dan telinga sekali.\"", ar: "ثم يمسح أذنيه مرة واحدة." } },
      { t: { id: "Wudhu dengan air teh tidak sah walaupun tehnya suci.", ar: "لا يصح الوضوء بالشاي." }, j: true, b: { id: "Salah satu syarat: air thahur. \"Tidak sah wudhu dengan air thahir maupun najis.\"", ar: "فلا يصح الوضوء بماء طاهر." } },
      { t: { id: "Bersungguh-sungguh dalam istinsyaq disunnahkan bagi semua orang tanpa pengecualian.", ar: "المبالغة في الاستنشاق لكل أحد." }, j: false, b: { id: "Dikecualikan orang yang berpuasa.", ar: "إلا أن تكون صائمًا." } },
      { t: { id: "Masa mengusap khuff bagi musafir adalah tiga hari tiga malam.", ar: "مدة المسح للمسافر ثلاثة أيام." }, j: true, b: { id: "Hadits 'Ali dalam Shahih Muslim.", ar: "ثلاثة أيام ولياليهن للمسافر." } },
      { t: { id: "Habisnya masa mengusap khuff membatalkan wudhu seseorang.", ar: "انقضاء المدة ينقض الوضوء." }, j: false, b: { id: "Yang batal hanya mash-nya, bukan wudhunya.", ar: "لا ينقض الوضوء إنما يبطل المسح." } },
      { t: { id: "Ijma' yang dinukil Ibnul Mundzir tentang khuff berlaku bagi laki-laki dan perempuan.", ar: "الإجماع يشمل الرجال والنساء." }, j: true, b: { id: "\"Dalam satu riwayat: setiap orang yang menyempurnakan thaharahnya — mencakup laki-laki dan perempuan.\"", ar: "ليشمل الرجال والنساء على السواء." } }
    ],
    jodoh: [
      { a: { id: "Istihdad", ar: "الاستحداد" }, b: { id: "Mencukur bulu kemaluan", ar: "حلق العانة" } },
      { a: { id: "Ihfa' asy-syarib", ar: "حف الشارب" }, b: { id: "Memangkas kumis hingga kulit tampak", ar: "حتى يبدو بياض البشرة" } },
      { a: { id: "Al-wudhu' (dhammah)", ar: "الوُضوء" }, b: { id: "Perbuatan berwudhu", ar: "الفعل" } },
      { a: { id: "Al-wadhu' (fathah)", ar: "الوَضوء" }, b: { id: "Air untuk berwudhu", ar: "الماء" } },
      { a: { id: "Isbagh", ar: "الإسباغ" }, b: { id: "Al-inqa' (kata Ibnu 'Umar)", ar: "الإنقاء" } },
      { a: { id: "Ka'bain", ar: "الكعبان" }, b: { id: "Tulang menonjol di bawah betis", ar: "العظمان الناتئان" } },
      { a: { id: "Jabirah", ar: "الجبيرة" }, b: { id: "Diusap tanpa batas masa", ar: "لا مدة لها" } }
    ],
    urut: { t: { id: "Urutkan tata cara wudhu sesuai modul (awal → akhir).", ar: "رتب صفة الوضوء." }, item: [
      { id: "Basmalah & siwak", ar: "التسمية والسواك" }, { id: "Membasuh telapak tangan 3×", ar: "غسل الكفين" }, { id: "Kumur & istinsyaq 3× dengan 3 cidukan", ar: "المضمضة والاستنشاق" }, { id: "Membasuh wajah", ar: "غسل الوجه" }, { id: "Tangan sampai siku, kanan lalu kiri", ar: "غسل اليدين" }, { id: "Mengusap kepala depan → tengkuk → kembali", ar: "مسح الرأس" }, { id: "Mengusap telinga sekali", ar: "مسح الأذنين" }, { id: "Kaki kanan 3×, lalu kiri 3×", ar: "غسل الرجلين" } ] },
    pilah: { t: { id: "Pilah: termasuk FARDHU/SYARAT wudhu atau SUNNAH wudhu?", ar: "صنف: فرض أو شرط، أم سنة؟" }, kategori: [{ id: "Fardhu / syarat", ar: "فرض أو شرط" }, { id: "Sunnah", ar: "سنة" }], item: [
      { t: { id: "Niat", ar: "النية" }, k: 0 },
      { t: { id: "Tertib anggota", ar: "الترتيب" }, k: 0 },
      { t: { id: "Berkumur & istinsyaq", ar: "المضمضة والاستنشاق" }, k: 0 },
      { t: { id: "Air thahur", ar: "الماء الطهور" }, k: 0 },
      { t: { id: "Mengusap kepala", ar: "مسح الرأس" }, k: 0 },
      { t: { id: "Basmalah", ar: "البسملة" }, k: 1 },
      { t: { id: "Basuhan ketiga", ar: "الغسلة الثالثة" }, k: 1 },
      { t: { id: "Menggosok anggota (dalk)", ar: "الدلك" }, k: 1 },
      { t: { id: "Mendahulukan anggota kanan", ar: "تقديم اليمنى" }, k: 1 },
      { t: { id: "Doa setelah wudhu", ar: "الدعاء بعده" }, k: 1 }
    ] },
    isian: [
      { t: { id: "Khitan hukumnya wajib bagi laki-laki dan ______ bagi perempuan.", ar: "الختان واجب على الرجل و______ للمرأة." }, j: { id: "mustahab", ar: "مستحب" }, x: [{ id: "makruh", ar: "مكروه" }, { id: "wajib", ar: "واجب" }, { id: "mubah", ar: "مباح" }] },
      { t: { id: "Wudhu dengan dhammah (al-wudhu') bermakna ______.", ar: "الوُضوء بالضم: ______." }, j: { id: "perbuatannya", ar: "الفعل" }, x: [{ id: "airnya", ar: "الماء" }, { id: "niatnya", ar: "النية" }, { id: "tempatnya", ar: "المكان" }] },
      { t: { id: "Masa mengusap khuff bagi orang mukim adalah ______.", ar: "مدة المسح للمقيم: ______." }, j: { id: "sehari semalam", ar: "يوم وليلة" }, x: [{ id: "tiga hari", ar: "ثلاثة أيام" }, { id: "dua hari", ar: "يومان" }, { id: "satu shalat", ar: "صلاة واحدة" }] },
      { t: { id: "Mengusap khuff yang robek dibolehkan menurut pilihan ______.", ar: "جواز المسح على الخف المخرق اختيار ______." }, j: { id: "Syaikhul Islam", ar: "شيخ الإسلام" }, x: [{ id: "Ibnul Mundzir", ar: "ابن المنذر" }, { id: "an-Nawawi", ar: "النووي" }, { id: "at-Tirmidzi", ar: "الترمذي" }] }
    ]
  }
});

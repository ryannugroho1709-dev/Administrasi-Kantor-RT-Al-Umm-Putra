/* Fiqih Ibadah — Pertemuan 5: Kitab Shalat — definisi, Adzan & Iqamah, Syarat Sah Shalat */
Kuliah.pertemuan("fiqih", {
  no: 5, motif: "sanad", motifOpt: { items: ["الظهر", "العصر", "المغرب", "العشاء", "الفجر"], big: "إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا", lbl: "كتاب الصلاة" }, tema: 3, durasi: 30,
  bab: { id: "Shalat: adzan & syarat sah", ar: "الصلاة: الأذان وشروط الصحة" },
  judul: { id: "Pengantar Kitab Shalat, Adzan & Iqamah, dan Sembilan Syarat Sah Shalat", ar: "مقدمة كتاب الصلاة، والأذان والإقامة، وشروط صحة الصلاة" },
  ringkas: {
    id: "Pembuka **Kitab Shalat** (dibahas dalam tiga pertemuan): definisi dan hukum shalat; **adzan dan iqamah** — definisi, hukum fardhu kifayah, lafaz, **sepuluh syarat adzan**, **sepuluh sunnah muadzin**, dan adab pendengar; lalu **sembilan syarat sah shalat** — termasuk rincian waktu lima shalat, aurat, menjauhi najis, dan menghadap kiblat beserta pengecualiannya.",
    ar: "مقدمة كتاب الصلاة: تعريفها وحكمها، ثم الأذان والإقامة: تعريفهما وحكمهما وصفتهما وشروط الأذان العشرة وسنن المؤذن العشر، ثم شروط صحة الصلاة التسعة ومنها المواقيت وستر العورة واجتناب النجاسة واستقبال القبلة."
  },
  tujuan: [
    { id: "Menjelaskan definisi shalat dan mengapa shalat bersifat *tauqifiyyah*.", ar: "بيان تعريف الصلاة وكونها توقيفية." },
    { id: "Membedakan hukum shalat (fardhu 'ain) dari hukum adzan dan iqamah (fardhu kifayah).", ar: "التفريق بين حكم الصلاة وحكم الأذان والإقامة." },
    { id: "Menyebut sepuluh syarat adzan dan sepuluh sunnah muadzin beserta dalilnya.", ar: "ذكر شروط الأذان وسنن المؤذن بأدلتها." },
    { id: "Menentukan awal dan akhir waktu lima shalat, termasuk tiga waktu 'ashar.", ar: "تحديد مواقيت الصلوات الخمس ومنها أوقات العصر الثلاثة." },
    { id: "Menerapkan syarat aurat, najis, dan kiblat beserta keringanan bagi yang tidak mampu.", ar: "تطبيق شروط الستر والطهارة من النجس والقبلة مع أحوال العجز." }
  ],
  isi: [
    { t: "pembuka", id: "Setelah fiqih thaharah selesai, dosen membuka **Kitab Shalat** yang akan dibahas dalam **tiga pertemuan**. Pertemuan ini: definisi dan hukum shalat, adzan dan iqamah, lalu bab syarat sah shalat.", ar: "انتهينا بفضل الله عز وجل فيما سبق من فقه الطهارة، واليوم إن شاء الله تعالى وعلى مدار ثلاث لقاءات سوف نأخذ فقه الصلاة." },

    { t: "judul", id: "Definisi dan Hukum Shalat", ar: "تعريف الصلاة وحكمها" },
    { t: "definisi", judul: { id: "Ash-Shalah", ar: "الصلاة" },
      lughah: { id: "**Doa** — {وَصَلِّ عَلَيْهِمْ} (At-Taubah: 103), yakni doakanlah mereka.", ar: "الدعاء." },
      istilah: { id: "**Ungkapan untuk ucapan dan perbuatan tertentu, dibuka dengan takbir dan ditutup dengan salam.**", ar: "عبارةٌ عن أقوالٍ وأفعالٍ مخصوصة، مفتتحةٌ بالتكبير، ومختتمةٌ بالتسليم." } },
    { t: "poin", item: [
      { ikon: "lock", judul: { id: "\"Ucapan dan perbuatan tertentu\" = tauqifiyyah", ar: "أقوال وأفعال مخصوصة" }, id: "Tidak boleh ditambah atau dikurangi: *\"Shalatlah sebagaimana kalian melihatku shalat.\"* Hadits Mu'awiyah bin al-Hakam as-Sulami: *\"Shalat ini tidak layak ada sedikit pun ucapan manusia di dalamnya; ia hanyalah tasbih, takbir, dan bacaan Al-Qur'an.\"*", ar: "أي: أنها توقيفية." },
      { ikon: "key", judul: { id: "\"Dibuka takbir, ditutup salam\"", ar: "مفتاحها وتحليلها" }, id: "Hadits 'Ali: *\"Kunci shalat adalah bersuci, pengharamnya takbir, dan penghalalnya salam.\"*", ar: "مفتاح الصلاة الطهور، وتحريمها التكبير، وتحليلها التسليم." }
    ] },
    { t: "p", id: "**Hukum shalat: fardhu 'ain** — wajib atas setiap orang baligh dan berakal — ditetapkan dengan Al-Qur'an, Sunnah, dan ijma': {وَمَا أُمِرُوا إِلَّا لِيَعْبُدُوا اللَّهَ مُخْلِصِينَ لَهُ الدِّينَ حُنَفَاءَ وَيُقِيمُوا الصَّلَاةَ} (Al-Bayyinah: 5), {إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا} (An-Nisa': 103), dan hadits *\"Islam dibangun di atas lima…\"* Umat telah berijma' bahwa shalat lima waktu fardhu 'ain atas setiap mukallaf.", ar: "وأما حكمها فهي فرض عين، وهي ثابتةٌ بالكتاب والسنة والإجماع." },

    { t: "judul", id: "Adzan dan Iqamah", ar: "الأذان والإقامة" },
    { t: "definisi", judul: { id: "Al-Adzan", ar: "الأذان" },
      lughah: { id: "**Pemberitahuan** — {وَأَذَانٌ مِّنَ اللَّهِ وَرَسُولِهِ إِلَى النَّاسِ يَوْمَ الْحَجِّ الْأَكْبَرِ} (At-Taubah: 3).", ar: "الإعلام." },
      istilah: { id: "**Beribadah kepada Allah dengan memberitahukan masuknya waktu shalat dengan dzikir tertentu.**", ar: "هو التعبد لله تعالى بالإعلام بدخول وقت الصلاة بذكرٍ مخصوص." } },
    { t: "banding", judul: { id: "Adzan dan iqamah", ar: "الأذان والإقامة" },
      kiri: { judul: { id: "Adzan", ar: "الأذان" }, ikon: "volume", poin: [
        { id: "Memberitahukan **masuknya waktu**", ar: "الإعلام بدخول الوقت" }, { id: "**Fardhu kifayah**: bila sebagian sudah melakukan, gugur dari yang lain", ar: "فرض على الكفاية" }, { id: "*\"Bila waktu shalat tiba, hendaklah salah seorang kalian adzan dan yang tertua mengimami\"* (Malik bin al-Huwairits)", ar: "فليؤذن لكم أحدكم وليؤمكم أكبركم" }, { id: "Lafaznya genap (berulang)", ar: "" } ] },
      kanan: { judul: { id: "Iqamah", ar: "الإقامة" }, ikon: "flag", poin: [
        { id: "Mashdar *aqama*: memberitahukan **berdiri untuk shalat**", ar: "الإعلام بالقيام إلى الصلاة" }, { id: "**Fardhu kifayah** juga, persis seperti adzan", ar: "فرض كفاية كالأذان تمامًا" }, { id: "Lafaznya **tunggal** (*ifrad*)", ar: "والإقامة هي إفراد ذلك" } ] } },
    { t: "kutipan", ar: "اللهُ أكبرُ اللهُ أكبرُ، اللهُ أكبرُ اللهُ أكبرُ، أشهدُ أن لا إلهَ إلا اللهُ، أشهدُ أن لا إلهَ إلا اللهُ، أشهدُ أنَّ محمدًا رسولُ اللهِ، أشهدُ أنَّ محمدًا رسولُ اللهِ، حيَّ على الصلاةِ، حيَّ على الصلاةِ، حيَّ على الفلاحِ، حيَّ على الفلاحِ، اللهُ أكبرُ اللهُ أكبرُ، لا إلهَ إلا اللهُ", id: "Lafaz adzan sebagaimana kita dengar lima kali sehari. Pada shalat fajr, setelah *hayya 'alal-falah* disunnahkan *ash-shalatu khairun minan-naum* dua kali.", oleh: { id: "Sifat adzan dalam modul", ar: "صفة الأذان" } },
    { t: "catatan", gaya: "faidah", judul: { id: "Keutamaan adzan", ar: "فضل الأذان" }, id: "Tidaklah jin, manusia, dan segala sesuatu mendengar suara muadzin sejauh jangkauannya melainkan akan bersaksi untuknya pada hari kiamat; dan *\"Para muadzin adalah manusia yang paling panjang lehernya pada hari kiamat.\"* Keutamaan juga bagi yang menirukan ucapan muadzin.", ar: "المؤذنون أطول الناس أعناقًا يوم القيامة." },
    { t: "hukum", judul: { id: "Sepuluh syarat sah adzan", ar: "شروط الأذان العشر" }, item: [
      { h: "info", judul: { id: "1. Niat", ar: "النية" }, id: "Seandainya seseorang mengulang lafaz adzan tanpa niat adzan, tidak mencukupi.", ar: "فلو أن رجلًا ردد الأذان بلا نية أنه لا يؤذن، لا يجزئ له ذلك." },
      { h: "info", judul: { id: "2. Muslim", ar: "أن يكون مسلمًا" }, id: "{وَمَا مَنَعَهُمْ أَن تُقْبَلَ مِنْهُمْ نَفَقَاتُهُمْ إِلَّا أَنَّهُمْ كَفَرُوا} (At-Taubah: 54). Ibadah yang manfaatnya meluas ke orang lain tidak diterima dari orang kafir, apalagi ibadah murni.", ar: "فالعبادة التي يتعدى نفعها إلى الغير لا تقبل، كذلك المحضة من باب أولى." },
      { h: "info", judul: { id: "3. Laki-laki", ar: "أن يكون ذكرًا" }, id: "Adzan wanita tidak dianggap untuk laki-laki; tidak pernah dinukil seorang wanita adzan untuk shalat. Anas ditanya, \"Apakah wanita wajib adzan dan iqamah?\" — *\"Tidak; bila mereka melakukannya, itu dzikir kepada Allah.\"* Ini pendapat jumhur.", ar: "لم ينقل الخلف عن السلف أن امرأة أذنت قط للصلاة." },
      { h: "info", judul: { id: "4–6. Berakal, tamyiz, dan bisa berbicara", ar: "عاقلًا مميزًا ناطقًا" }, id: "Tidak sah dari orang gila dan anak sebelum tamyiz (ijma'); tidak sah dari orang bisu karena adzan adalah pemberitahuan yang harus dengan suara.", ar: "فلا يصح من الأخرس؛ لأنه لا يمكنه أن يرفع صوته به." },
      { h: "info", judul: { id: "7. Setelah masuk waktu", ar: "بعد دخول الوقت" }, id: "Tidak sah sebelum waktu, **kecuali adzan pertama shalat fajr**: *\"Bilal adzan di malam hari, maka makan dan minumlah hingga Ibnu Ummi Maktum adzan.\"*", ar: "إلا في الفجر في الأذان الأول." },
      { h: "info", judul: { id: "8. Dari satu orang", ar: "من واحد" }, id: "Tidak pernah dinukil dari salaf adzan dikumandangkan dua orang (bersahutan). Bila muadzin berhalangan di tengah, orang yang menggantikannya **memulai dari awal**.", ar: "فإن حصل للمؤذن عذر، استأنف من يأتي مكانه." },
      { h: "info", judul: { id: "9. Tertib sesuai sunnah", ar: "الترتيب" }, id: "Nabi ﷺ menyetujui mimpi 'Abdullah bin Zaid dan ia mengajarkannya kepada Bilal. *\"Siapa mengada-adakan dalam urusan kami ini yang bukan darinya, tertolak.\"*", ar: "من أحدث في أمرنا هذا ما ليس منه فهو رد." },
      { h: "info", judul: { id: "10. Muwalah", ar: "الموالاة" }, id: "Diam lama, ucapan, atau perbuatan lain yang memutus adzan merusaknya. Terputus karena ucapan singkat, batuk, bersin, atau menjawab penanya — **ia melanjutkan**.", ar: "لكن انقطع لكلامٍ يسير أو سعال أو عطاس أو إجابة سائل، فإنه يبني على ما سبق." }
    ] },
    { t: "tabel", judul: { id: "Empat muadzin Nabi ﷺ", ar: "مؤذنو النبي ﷺ" }, kolom: [{ id: "Muadzin", ar: "المؤذن" }, { id: "Masjid", ar: "المسجد" }], baris: [
      [{ id: "Sa'd al-Qarazh", ar: "سعد القرظ" }, { id: "Quba'", ar: "قباء" }],
      [{ id: "Bilal & Ibnu Ummi Maktum", ar: "بلال وابن أم مكتوم" }, { id: "Masjid Nabawi", ar: "المسجد النبوي" }],
      [{ id: "Abu Mahdzurah", ar: "أبو محذورة" }, { id: "Masjid al-Haram", ar: "المسجد الحرام" }]
    ] },
    { t: "hukum", judul: { id: "Sunnah-sunnah muadzin", ar: "سنن المؤذن" }, item: [
      { h: "sunnah", judul: { id: "Suaranya indah", ar: "حسن الصوت" }, id: "Agar orang tertarik hadir. Kepada 'Abdullah bin Zaid: *\"Ajarkan kepada Bilal, karena suaranya lebih lantang/indah darimu.\"* Adzan oleh yang terindah suaranya, iqamah olehnya juga; adapun imam adalah yang paling pandai membaca (akan datang).", ar: "ألقه على بلال؛ فإنه أندى منك صوتًا." },
      { h: "sunnah", judul: { id: "Amanah", ar: "أمينًا" }, id: "*\"Imam itu penanggung, muadzin itu yang dipercaya\"*; *\"Orang kepercayaan kaum muslimin atas shalat dan sahur mereka adalah para muadzin.\"*", ar: "الإمام ضامن والمؤذن مؤتمن." },
      { h: "sunnah", judul: { id: "Mengetahui waktu", ar: "عالمًا بالوقت" }, id: "Dengan tanda-tanda syar'i atau diberi tahu orang lain — Ibnu Ummi Maktum buta, ia baru adzan bila dikatakan \"sudah pagi, sudah pagi\"; kini dengan jam dan jadwal waktu shalat.", ar: "أصبحت أصبحت." },
      { h: "sunnah", judul: { id: "Suci dari dua hadats", ar: "متطهرًا من الحدثين" }, id: "Nabi ﷺ tidak menjawab salam seseorang hingga berwudhu: *\"Aku tidak suka menyebut Allah kecuali dalam keadaan suci.\"* **Adzan orang berhadats sah, tetapi iqamahnya makruh** karena dekat dengan shalat.", ar: "لكن يجوز أذان المحدث، وتكره إقامته لقربها من الصلاة." },
      { h: "sunnah", judul: { id: "Berdiri", ar: "قائمًا" }, id: "*\"Berdirilah dan adzanlah\"* kepada Bilal. Ibnul Mundzir: ijma' bahwa termasuk sunnah adzan sambil berdiri.", ar: "قم فأذن." },
      { h: "sunnah", judul: { id: "Di tempat tinggi", ar: "على علو" }, id: "Menara, atap tinggi, atau kini pengeras suara. Bilal adzan di atap rumah wanita Bani Najjar yang tertinggi di sekitar masjid; Abu Juhaifah: *\"Aku melihat Bilal adzan dan berputar, mulutnya mengikuti ke sana dan ke sini, jarinya di kedua telinganya.\"*", ar: "رأيت بلالًا يؤذن ويدور، ويتبع فاه هاهنا وهاهنا، إصبعيه في أذنيه." },
      { h: "sunnah", judul: { id: "Menghadap kiblat", ar: "مستقبلًا القبلة" }, id: "Selama menara tidak berada di arah kiblat desa. Ibnul Mundzir: ijma'. Menoleh ke kanan pada *hayya 'alash-shalah* dan ke kiri pada *hayya 'alal-falah*.", ar: "ملتفتًا يمينًا وشمالًا في الحيعلتين." },
      { h: "sunnah", judul: { id: "Adzan di awal waktu; tatswib pada fajr", ar: "في أول الوقت والتثويب" }, id: "Tidak menunda, sebagaimana Bilal. Pada fajr, setelah *hayya 'alal-falah*: [[الصَّلَاةُ خَيْرٌ مِنَ النَّوْمِ]] dua kali.", ar: "الصلاة خير من النوم مرتين." }
    ] },
    { t: "hukum", judul: { id: "Adab orang yang mendengar adzan", ar: "ما يستحب لمن سمع المؤذن" }, item: [
      { h: "sunnah", judul: { id: "Menirukan muadzin", ar: "يقول مثل قوله" }, id: "Kecuali pada *hayya 'alash-shalah* dan *hayya 'alal-falah*, ia mengucapkan [[لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ]].", ar: "إلا في الحيعلتين يقول: لا حول ولا قوة إلا بالله." },
      { h: "sunnah", judul: { id: "Shalawat lalu memohon wasilah", ar: "الصلاة على النبي ﷺ وسؤال الوسيلة" }, id: "[[اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ وَالصَّلَاةِ الْقَائِمَةِ آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ]] — halal baginya syafa'at Nabi ﷺ.", ar: "تحل له شفاعة النبي ﷺ." },
      { h: "sunnah", judul: { id: "Berdoa antara adzan dan iqamah", ar: "الدعاء بين الأذان والإقامة" }, id: "*\"Doa antara adzan dan iqamah tidak ditolak.\"*", ar: "الدعاء لا يرد بين الأذان والإقامة." },
      { h: "haram", judul: { id: "Keluar masjid setelah adzan tanpa keperluan", ar: "الخروج من المسجد بعد الأذان لغير حاجة" }, id: "Haram.", ar: "يحرم." },
      { h: "info", judul: { id: "Menjamak shalat", ar: "إذا جمع الصلوات" }, id: "Adzan sekali untuk yang pertama, dan iqamah untuk masing-masing (yang pertama dan kedua).", ar: "يؤذن للأولى ويقيم للأولى والثانية." }
    ] },

    { t: "judul", id: "Bab Syarat Sah Shalat (sembilan)", ar: "باب شروط صحة الصلاة" },
    { t: "p", id: "Empat syarat pertama telah sering dibahas (pada wudhu, mandi, tayammum, dan adzan): **Islam, akal, tamyiz, niat.** Berikut lima sisanya.", ar: "الإسلام والعقل والتمييز والنية: أربعة شروط مروا معنا كثيرًا." },
    { t: "hukum", judul: { id: "Syarat-syarat lanjutan", ar: "بقية الشروط" }, item: [
      { h: "info", judul: { id: "Thaharah — sesuai kemampuan", ar: "الطهارة مع القدرة" }, id: "Wudhu, atau mandi bila junub (ayat wudhu; *\"Allah tidak menerima shalat seseorang bila berhadats hingga ia berwudhu\"*; *\"…tanpa bersuci\"*). \"Sesuai kemampuan\" mengecualikan pemilik uzur: mustahadhah, penderita beser kencing, dan yang anginnya terus keluar — **mereka shalat sesuai keadaannya**: *\"Bila aku perintahkan sesuatu, kerjakan semampu kalian.\"*", ar: "مع القدرة: ليخرج ذوي الأعذار." },
      { h: "info", judul: { id: "Masuknya waktu", ar: "دخول الوقت" }, id: "Shalat tidak sah sebelum waktunya: {إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا}. Lihat tabel waktu di bawah.", ar: "فلا تصح الصلاة قبل دخول الوقت." },
      { h: "info", judul: { id: "Menutup aurat — sesuai kemampuan", ar: "ستر العورة مع القدرة" }, id: "{يَا بَنِي آدَمَ خُذُوا زِينَتَكُمْ عِندَ كُلِّ مَسْجِدٍ} (Al-A'raf: 31). Aurat: apa yang buruk bila ditampakkan. Ulama berijma': yang shalat telanjang padahal mampu menutup, shalatnya batal. Orang yang tak mampu (dipenjara, pakaiannya dicuri) shalat sesuai keadaannya.", ar: "إجماع العلماء على أن من صلى عريانًا مع قدرته على ستر العورة أن صلاته باطلة." },
      { h: "info", judul: { id: "Menjauhi najis pada badan, pakaian, dan tempat", ar: "اجتناب النجاسة لبدنه وثوبه وبقعته" }, id: "Badan: *\"Bersihkanlah diri dari kencing, karena kebanyakan azab kubur karenanya.\"* Pakaian: {وَثِيَابَكَ فَطَهِّرْ} (Al-Muddatstsir: 4) dan hadits Asma'. Tempat: hadits badui yang kencing di masjid — *\"Siramkan seember air di atasnya.\"* \"Sesuai kemampuan\": orang terpenjara/terikat di tempat najis, mustahadhah, dan beser kencing dimaafkan.", ar: "تنزهوا من البول فإن عامة عذاب القبر منه." },
      { h: "info", judul: { id: "Menghadap kiblat", ar: "استقبال القبلة" }, id: "{فَوَلِّ وَجْهَكَ شَطْرَ الْمَسْجِدِ الْحَرَامِ ۚ وَحَيْثُ مَا كُنتُمْ فَوَلُّوا وُجُوهَكُمْ شَطْرَهُ} (Al-Baqarah: 144); hadits orang yang buruk shalatnya: *\"…lalu menghadaplah ke kiblat dan bertakbirlah.\"*", ar: "إذا قمت إلى الصلاة فأسبغ الوضوء، ثم استقبل القبلة، فكبر." }
    ] },
    { t: "tabel", judul: { id: "Waktu lima shalat (hadits Jibril dan 'Abdullah bin 'Amr)", ar: "مواقيت الصلوات الخمس" }, kolom: [{ id: "Shalat", ar: "الصلاة" }, { id: "Awal", ar: "أوله" }, { id: "Akhir & catatan", ar: "آخره وفوائد" }], baris: [
      [{ id: "**Zhuhur**", ar: "الظهر" }, { id: "Tergelincirnya matahari (*zawal*): bayangan paling pendek lalu mulai bertambah", ar: "من الزوال" }, { id: "Hingga bayangan sesuatu sama dengan bendanya. Disunnahkan menyegerakan, **kecuali saat sangat panas: *ibrad*** — *\"Bila panas sangat terik, tundalah sampai agak dingin, karena panas yang terik dari hembusan Jahannam.\"*", ar: "إذا اشتد الحر فأبردوا بالصلاة." }],
      [{ id: "**'Ashar**", ar: "العصر" }, { id: "Bayangan sama dengan bendanya", ar: "من صيرورة ظل كل شيء مثله" }, { id: "Tiga waktu: **afdhal** (bayangan 1× → 2×); **jawaz** (2× → matahari menguning; *\"waktu 'ashar selama matahari belum menguning\"*); **dharurah** (hingga terbenam: *\"siapa mendapati satu rakaat 'ashar sebelum terbenam, ia mendapatkan 'ashar\"*; dan *\"itulah shalat munafik… mematuk empat kali\"*).", ar: "وقت أفضلية، ووقت جواز، ووقت ضرورة." }],
      [{ id: "**Maghrib**", ar: "المغرب" }, { id: "Terbenamnya matahari", ar: "حين وجبت الشمس" }, { id: "Jibril datang pada dua hari di **satu waktu yang sama** — dalil sunnahnya menyegerakan maghrib. Hadits 'Abdullah bin 'Amr (Muslim): *\"selama mega merah belum hilang.\"*", ar: "ما لم يغب الشفق." }],
      [{ id: "**'Isya'**", ar: "العشاء" }, { id: "Hilangnya mega merah (*syafaq*)", ar: "من مغيب الشفق" }, { id: "Hingga **pertengahan malam** — hadits Jabir ragu (\"pertengahan malam atau sepertiganya\"), sedangkan hadits 'Abdullah bin 'Amr tegas: pertengahan malam.", ar: "إلى نصف الليل." }],
      [{ id: "**Fajr/Shubuh**", ar: "الفجر" }, { id: "Terbitnya fajar", ar: "من طلوع الفجر" }, { id: "Selama matahari belum terbit: *\"…bila terbit, tahanlah dari shalat, karena ia terbit di antara dua tanduk setan\"*; *\"siapa mendapati satu rakaat shubuh sebelum matahari terbit, ia mendapatkan shubuh.\"*", ar: "ما لم تطلع الشمس." }]
    ] },
    { t: "banding", judul: { id: "Aurat dalam shalat", ar: "العورة في الصلاة" },
      kiri: { judul: { id: "Laki-laki", ar: "الرجل" }, ikon: "user", poin: [
        { id: "Antara **pusar dan lutut**", ar: "ما بين السرة والركبة" }, { id: "*\"Antara pusar dan lutut adalah aurat\"* ('Abdullah bin 'Amr)", ar: "" } ] },
      kanan: { judul: { id: "Wanita baligh", ar: "المرأة البالغة" }, ikon: "shield", poin: [
        { id: "*\"Allah tidak menerima shalat wanita yang sudah haidh kecuali dengan khimar\"* — walau shalat di kamar tidurnya, yang tampak hanya **wajah dan kedua telapak tangan**", ar: "لا يقبل الله صلاة حائض إلا بخمار" }, { id: "Ibnul Mundzir: ijma' wanita merdeka baligh wajib menutup kepala saat shalat; bila shalat dengan kepala terbuka, **wajib mengulang**", ar: "" }, { id: "Di luar shalat seluruhnya aurat: *\"Wanita adalah aurat; bila keluar, setan memperindahnya.\"*", ar: "المرأة عورة، فإذا خرجت استشرفها الشيطان" } ] } },
    { t: "hukum", judul: { id: "Pengecualian syarat menghadap kiblat", ar: "ما يستثنى من استقبال القبلة" }, item: [
      { h: "sah", judul: { id: "Yang tidak mampu", ar: "العاجز" }, id: "Karena gelap, diikat, dipenjara, atau sakit — ke mana pun wajahnya menghadap ia shalat: {فَاتَّقُوا اللَّهَ مَا اسْتَطَعْتُمْ}.", ar: "فأيما كان وجهه صلى." },
      { h: "sah", judul: { id: "Yang ketakutan", ar: "الخائف" }, id: "Lari dari musuh, binatang buas, banjir, atau api: {فَإِنْ خِفْتُمْ فَرِجَالًا أَوْ رُكْبَانًا} (Al-Baqarah: 239). Ibnu 'Umar: *\"ke arah kiblat dan selainnya.\"*", ar: "" },
      { h: "sah", judul: { id: "Yang berijtihad lalu keliru", ar: "المجتهد المخطئ" }, id: "Ia shalat ke selain kiblat setelah berijtihad — **shalatnya sah**.", ar: "الذي اجتهد فصلى إلى غير القبلة فصلاته صحيحة." },
      { h: "sah", judul: { id: "Musafir yang shalat sunnah", ar: "المسافر المتطوع" }, id: "Tidak disyaratkan menghadap kiblat.", ar: "لا يشترط له أن يستقبل القبلة." }
    ] },
    { t: "cek", q: { id: "Seorang muadzin batuk keras di tengah adzan lalu melanjutkan. Hukumnya…", ar: "سعل المؤذن في أثناء الأذان:" }, o: [
      { id: "Sah, ia melanjutkan dari yang tersisa", ar: "يصح ويبني على ما سبق" },
      { id: "Batal, ia wajib mengulang dari awal", ar: "يبطل ويستأنف" },
      { id: "Batal, orang lain harus menggantikannya", ar: "يبطل ويكمل غيره" },
      { id: "Sah, tetapi adzannya harus diulang", ar: "يصح ثم يعاد" }], j: 0,
      b: { id: "Muwalah rusak oleh diam lama atau perbuatan lain; tetapi terputus karena ucapan singkat, batuk, bersin, atau menjawab penanya — ia **membangun di atas yang telah lalu**.", ar: "فإنه يبني على ما سبق." } },

    { t: "ringkasan", item: [
      { id: "Shalat = ucapan & perbuatan tertentu, dibuka takbir, ditutup salam; tauqifiyyah; fardhu 'ain (Al-Qur'an, Sunnah, ijma').", ar: "تعريف الصلاة وحكمها." },
      { id: "Adzan & iqamah fardhu kifayah. Adzan: lafaz genap; iqamah: tunggal. Sepuluh syarat adzan: niat, Islam, laki-laki, akal, tamyiz, bisa bicara, masuk waktu (kecuali adzan pertama fajr), satu orang, tertib, muwalah.", ar: "الأذان والإقامة." },
      { id: "Sunnah muadzin: suara indah, amanah, tahu waktu, suci, berdiri, di tempat tinggi, menghadap kiblat & menoleh pada hai'alatain, di awal waktu, tatswib di fajr.", ar: "سنن المؤذن." },
      { id: "Sembilan syarat sah shalat: Islam, akal, tamyiz, niat, thaharah, masuk waktu, menutup aurat, menjauhi najis, menghadap kiblat — tiga di antaranya \"sesuai kemampuan\".", ar: "شروط الصلاة التسعة." },
      { id: "'Ashar punya waktu afdhal, jawaz, dan dharurah; maghrib disunnahkan disegerakan; 'isya' sampai pertengahan malam; zhuhur di-*ibrad* saat sangat panas.", ar: "المواقيت." }
    ] }
  ],
  istilah: [
    { ar: "الصلاة", latin: "ash-shalah", id: "Shalat", def: { id: "Bahasa: doa. Istilah: ucapan & perbuatan tertentu, dibuka takbir, ditutup salam.", ar: "أقوال وأفعال مخصوصة مفتتحة بالتكبير مختتمة بالتسليم." } },
    { ar: "توقيفية", latin: "tauqifiyyah", id: "Tauqifiyyah", def: { id: "Ditetapkan oleh syariat; tidak boleh ditambah atau dikurangi.", ar: "لا يجوز أن يضاف عليها ولا أن ينقص منها." } },
    { ar: "فرض عين", latin: "fardhu 'ain", id: "Fardhu 'ain", def: { id: "Wajib atas setiap mukallaf secara pribadi, seperti shalat lima waktu.", ar: "تجب على كل بالغ عاقل." } },
    { ar: "فرض كفاية", latin: "fardhu kifayah", id: "Fardhu kifayah", def: { id: "Bila sebagian telah melakukan, gugur dari yang lain — seperti adzan dan iqamah.", ar: "إذا قام به من يكفي سقط عن الباقين." } },
    { ar: "الأذان", latin: "al-adzan", id: "Adzan", def: { id: "Beribadah dengan memberitahukan masuknya waktu shalat dengan dzikir tertentu.", ar: "التعبد لله بالإعلام بدخول وقت الصلاة بذكر مخصوص." } },
    { ar: "الإقامة", latin: "al-iqamah", id: "Iqamah", def: { id: "Pemberitahuan berdiri untuk shalat dengan dzikir tertentu; lafaznya tunggal.", ar: "الإعلام بالقيام إلى الصلاة بذكر مخصوص." } },
    { ar: "الحيعلتان", latin: "al-hai'alatan", id: "Hai'alatan", def: { id: "*Hayya 'alash-shalah* dan *hayya 'alal-falah*; muadzin menoleh kanan-kiri, pendengar menjawab *la haula wa la quwwata illa billah*.", ar: "حي على الصلاة، حي على الفلاح." } },
    { ar: "التثويب", latin: "at-tatswib", id: "Tatswib", def: { id: "Ucapan *ash-shalatu khairun minan-naum* dua kali pada adzan fajr.", ar: "الصلاة خير من النوم." } },
    { ar: "الإبراد", latin: "al-ibrad", id: "Ibrad", def: { id: "Menunda zhuhur hingga agak dingin ketika panas sangat terik.", ar: "إذا اشتد الحر فأبردوا بالصلاة." } },
    { ar: "وقت الضرورة", latin: "waqt adh-dharurah", id: "Waktu darurat", def: { id: "Untuk 'ashar: dari menguningnya matahari hingga terbenam.", ar: "من الاصفرار إلى الغروب." } },
    { ar: "الشفق", latin: "asy-syafaq", id: "Syafaq", def: { id: "Mega merah setelah maghrib; hilangnya menandai akhir maghrib dan awal 'isya'.", ar: "" } }
  ],
  latihan: {
    pg: [
      { q: { id: "Hadits Mu'awiyah bin al-Hakam (\"shalat ini tidak layak ada ucapan manusia di dalamnya\") paling tepat dijadikan dalil bahwa shalat itu…", ar: "حديث معاوية بن الحكم دليل على:" }, o: [
        { id: "Tauqifiyyah, tidak boleh ditambah", ar: "توقيفية لا يزاد فيها" },
        { id: "Wajib dimulai dengan takbir", ar: "تفتتح بالتكبير" },
        { id: "Fardhu 'ain atas setiap mukallaf", ar: "فرض عين" },
        { id: "Sah walau tanpa bacaan Al-Qur'an", ar: "تصح بلا قراءة" }], j: 0,
        b: { id: "Modul menjelaskan \"ucapan dan perbuatan tertentu\" = **tauqifiyyah**, lalu membawakan hadits ini dan \"shalatlah sebagaimana kalian melihatku shalat\".", ar: "أي: أنها توقيفية." } },
      { q: { id: "Di sebuah desa, sudah ada satu orang yang adzan di masjid. Bagaimana hukum adzan bagi penduduk lain?", ar: "أذن واحد في القرية:" }, o: [
        { id: "Gugur kewajibannya dari mereka", ar: "سقط عن الباقين" },
        { id: "Tetap wajib atas setiap laki-laki", ar: "يجب على كل رجل" },
        { id: "Wajib atas yang mendengarnya saja", ar: "يجب على من سمعه" },
        { id: "Sunnah bagi yang belum shalat", ar: "يسن لمن لم يصل" }], j: 0,
        b: { id: "Adzan **fardhu kifayah**: \"bila telah dilakukan oleh yang mencukupi, gugur dari yang lain.\"", ar: "إذا قام به من يكفي، سقط عن الباقين." } },
      { q: { id: "Seorang anak yang belum tamyiz menirukan adzan dengan lengkap di masjid. Apakah adzannya mencukupi?", ar: "أذان غير المميز:" }, o: [
        { id: "Tidak, karena syaratnya tamyiz", ar: "لا؛ يشترط التمييز" },
        { id: "Ya, karena lafaznya lengkap", ar: "نعم؛ لتمام ألفاظه" },
        { id: "Ya, bila suaranya lantang", ar: "نعم إن كان صيتًا" },
        { id: "Tidak, kecuali didampingi ayahnya", ar: "لا إلا بحضور أبيه" }], j: 0,
        b: { id: "\"Tidak sah dari orang gila dan dari yang belum tamyiz — dengan ijma'.\"", ar: "فلا يصح من المجنون، ولا ممن دون التمييز بالإجماع." } },
      { q: { id: "Adzan manakah yang SAH dikumandangkan sebelum masuk waktu menurut modul?", ar: "الأذان الذي يصح قبل الوقت:" }, o: [
        { id: "Adzan pertama shalat fajr", ar: "الأذان الأول للفجر" },
        { id: "Adzan shalat Jumat", ar: "أذان الجمعة" },
        { id: "Adzan maghrib di bulan Ramadhan", ar: "أذان المغرب في رمضان" },
        { id: "Adzan shalat yang dijamak", ar: "أذان الصلاة المجموعة" }], j: 0,
        b: { id: "\"Tidak sah sebelum waktu **kecuali fajr pada adzan pertama**: Bilal adzan di malam hari…\"", ar: "إلا في الفجر في الأذان الأول." } },
      { q: { id: "Muadzin pingsan setelah mengucapkan separuh adzan. Yang benar menurut modul…", ar: "حصل للمؤذن عذر في أثناء الأذان:" }, o: [
        { id: "Penggantinya memulai adzan dari awal", ar: "يستأنف من يأتي مكانه" },
        { id: "Penggantinya melanjutkan separuh sisanya", ar: "يكمل من يأتي مكانه" },
        { id: "Adzan dianggap cukup separuhnya", ar: "يكتفى بما أذن" },
        { id: "Ditunggu hingga muadzin sadar kembali", ar: "ينتظر حتى يفيق" }], j: 0,
        b: { id: "Syarat \"dari satu orang\": adzan ibadah yang mudah diulang, maka **orang yang menggantikannya memulai dari awal**.", ar: "فإن حصل للمؤذن عذر، استأنف من يأتي مكانه." } },
      { q: { id: "Seseorang adzan dalam keadaan belum berwudhu. Hukum yang sesuai dengan modul…", ar: "أذان المحدث:" }, o: [
        { id: "Adzannya sah; iqamahnya yang dimakruhkan", ar: "يجوز أذانه وتكره إقامته" },
        { id: "Adzannya batal dan wajib diulang", ar: "يبطل أذانه" },
        { id: "Adzan dan iqamahnya sama-sama haram", ar: "يحرمان" },
        { id: "Adzannya makruh; iqamahnya boleh", ar: "يكره أذانه وتجوز إقامته" }], j: 0,
        b: { id: "\"Boleh adzan orang berhadats, dan **dimakruhkan iqamahnya** karena dekat dengan shalat.\"", ar: "لكن يجوز أذان المحدث، وتكره إقامته لقربها من الصلاة." } },
      { q: { id: "Ketika muadzin mengucapkan *hayya 'alal-falah*, pendengar disunnahkan mengucapkan…", ar: "يقول السامع عند «حي على الفلاح»:" }, o: [
        { id: "La haula wa la quwwata illa billah", ar: "لا حول ولا قوة إلا بالله" },
        { id: "Hayya 'alal-falah, menirukannya", ar: "حي على الفلاح" },
        { id: "Shadaqta wa bararta, membenarkannya", ar: "صدقت وبررت" },
        { id: "Allahumma rabba hadzihid-da'wah", ar: "اللهم رب هذه الدعوة" }], j: 0,
        b: { id: "\"Menirukan ucapannya kecuali pada *hai'alatain*: ia mengucapkan la haula wa la quwwata illa billah.\"", ar: "" } },
      { q: { id: "Seorang wanita penderita beser kencing tidak bisa menahan tetesan. Bagaimana syarat thaharah baginya?", ar: "من به سلس البول:" }, o: [
        { id: "Ia shalat sesuai keadaannya", ar: "يصلي على حسب حاله" },
        { id: "Ia gugur kewajiban shalatnya", ar: "تسقط عنه الصلاة" },
        { id: "Ia wajib menunggu sampai sembuh", ar: "ينتظر حتى يبرأ" },
        { id: "Ia cukup bertayammum selamanya", ar: "يتيمم دائمًا" }], j: 0,
        b: { id: "Kata \"sesuai kemampuan\" mengecualikan pemilik uzur (mustahadhah, beser kencing, angin terus keluar): \"ia shalat sesuai keadaannya.\"", ar: "فإنه يصلي على حسب حاله." } },
      { q: { id: "Bayangan sebuah tongkat sudah 2,5 kali panjangnya dan matahari mulai menguning, tetapi belum terbenam. Seseorang baru shalat 'ashar. Ia berada di waktu…", ar: "صلى العصر بعد الاصفرار قبل الغروب:" }, o: [
        { id: "Dharurah", ar: "وقت الضرورة" },
        { id: "Afdhaliyyah", ar: "وقت الأفضلية" },
        { id: "Jawaz", ar: "وقت الجواز" },
        { id: "Ikhtiyar", ar: "وقت الاختيار" }], j: 0,
        b: { id: "Afdhal: bayangan 1×→2×; jawaz: 2× hingga menguning; **dharurah: dari menguning hingga terbenam**.", ar: "ووقت ضرورة إلى الغروب." } },
      { q: { id: "Apa dalil modul bahwa maghrib disunnahkan disegerakan?", ar: "دليل استحباب تعجيل المغرب:" }, o: [
        { id: "Jibril datang dua hari di waktu yang sama", ar: "جاءه وقتًا واحدًا لم يزل عنه" },
        { id: "Waktunya sampai mega merah hilang", ar: "ما لم يغب الشفق" },
        { id: "Ancaman shalat munafik yang ditunda", ar: "تلك صلاة المنافق" },
        { id: "Perintah ibrad ketika sangat panas", ar: "الأمر بالإبراد" }], j: 0,
        b: { id: "\"Lalu waktu maghrib, ia datang pada satu waktu yang tidak berubah — **di dalamnya ada dalil sunnahnya menyegerakan maghrib**.\"", ar: "وفي هذا فيه استحباب تعجيل صلاة المغرب." } },
      { q: { id: "Menurut modul, mengapa akhir waktu 'isya' ditetapkan pertengahan malam, bukan sepertiga malam?", ar: "لماذا آخر العشاء نصف الليل؟" }, o: [
        { id: "Hadits Jabir ragu, hadits Ibnu 'Amr tegas", ar: "شك في حديث جابر وجزم ابن عمرو" },
        { id: "Ijma' yang dinukil oleh Ibnul Mundzir", ar: "إجماع ابن المنذر" },
        { id: "Qiyas terhadap waktu shalat 'ashar", ar: "القياس على العصر" },
        { id: "Hadits Jibril hari pertama", ar: "حديث جبريل في اليوم الأول" }], j: 0,
        b: { id: "\"Ada keraguan dalam hadits Jabir, tetapi dalam hadits 'Abdullah bin 'Amr beliau bersabda: hingga pertengahan malam.\"", ar: "شك في حديث جابر، لكن في حديث عبد الله ابن عمرو قال: إلى نصف الليل." } },
      { q: { id: "Seorang muslimah shalat di kamarnya sendirian dengan rambut terbuka. Menurut nukilan Ibnul Mundzir…", ar: "صلت الحرة البالغة مكشوفة الرأس:" }, o: [
        { id: "Ia wajib mengulang shalatnya", ar: "عليها الإعادة" },
        { id: "Shalatnya sah karena tidak dilihat orang", ar: "تصح لعدم الناظر" },
        { id: "Shalatnya sah tetapi makruh", ar: "تصح مع الكراهة" },
        { id: "Cukup ia beristighfar setelahnya", ar: "يكفيها الاستغفار" }], j: 0,
        b: { id: "\"Ijma': wanita merdeka baligh menutup kepala saat shalat; bila shalat dengan kepala terbuka, **wajib mengulang**\" — \"walau shalat di kamar tidurnya.\"", ar: "وعلى أنها إن صلت وجميع رأسها مكشوف أن عليها الإعادة." } },
      { q: { id: "Seorang musafir di malam gelap berijtihad menentukan kiblat lalu shalat; esoknya ternyata arahnya keliru. Hukumnya…", ar: "اجتهد فصلى إلى غير القبلة:" }, o: [
        { id: "Shalatnya sah, tidak perlu diulang", ar: "صلاته صحيحة" },
        { id: "Wajib mengulang karena kiblat syarat", ar: "يعيد لأن القبلة شرط" },
        { id: "Wajib mengulang bila waktu masih ada", ar: "يعيد في الوقت" },
        { id: "Sah hanya bila ia shalat sunnah", ar: "تصح في النافلة فقط" }], j: 0,
        b: { id: "\"Yang berijtihad lalu shalat ke selain kiblat, shalatnya sah.\"", ar: "فصلاته صحيحة." } }
    ],
    bs: [
      { t: { id: "Iqamah hukumnya sunnah, berbeda dengan adzan yang fardhu kifayah.", ar: "الإقامة سنة." }, j: false, b: { id: "\"…dan ia juga fardhu kifayah persis seperti adzan.\"", ar: "وهو أيضًا فرض كفاية كالأذان تمامًا." } },
      { t: { id: "Menurut jumhur, wanita tidak wajib adzan dan iqamah.", ar: "لا أذان على المرأة ولا إقامة." }, j: true, b: { id: "Jawaban Anas: \"Tidak; bila melakukannya, itu dzikir.\"", ar: "" } },
      { t: { id: "Orang bisu sah menjadi muadzin bila ia memberi isyarat yang jelas.", ar: "يصح أذان الأخرس." }, j: false, b: { id: "Adzan adalah pemberitahuan dengan suara; maka tidak sah dari orang bisu.", ar: "" } },
      { t: { id: "Ibnul Mundzir menukil ijma' bahwa termasuk sunnah muadzin adzan sambil berdiri dan menghadap kiblat.", ar: "" }, j: true, b: { id: "Keduanya dinukil ijma' oleh Ibnul Mundzir.", ar: "" } },
      { t: { id: "Keluar dari masjid setelah adzan tanpa keperluan hukumnya makruh.", ar: "الخروج بعد الأذان مكروه." }, j: false, b: { id: "Modul: **haram** keluar dari masjid setelah adzan tanpa keperluan.", ar: "يحرم." } },
      { t: { id: "Bila menjamak dua shalat, adzan sekali dan iqamah untuk masing-masing shalat.", ar: "" }, j: true, b: { id: "\"Ia adzan untuk yang pertama dan iqamah untuk yang pertama dan kedua.\"", ar: "" } },
      { t: { id: "Aurat laki-laki dalam shalat adalah antara pusar dan lutut.", ar: "" }, j: true, b: { id: "Hadits 'Abdullah bin 'Amr.", ar: "" } },
      { t: { id: "Musafir yang shalat sunnah di kendaraan tetap disyaratkan menghadap kiblat.", ar: "" }, j: false, b: { id: "\"Musafir yang shalat sunnah dalam safar tidak disyaratkan menghadap kiblat.\"", ar: "" } }
    ],
    jodoh: [
      { a: { id: "Sa'd al-Qarazh", ar: "سعد القرظ" }, b: { id: "Muadzin Quba'", ar: "مؤذن قباء" } },
      { a: { id: "Abu Mahdzurah", ar: "أبو محذورة" }, b: { id: "Muadzin Masjid al-Haram", ar: "مؤذن المسجد الحرام" } },
      { a: { id: "Ibnu Ummi Maktum", ar: "ابن أم مكتوم" }, b: { id: "Adzan bila dikatakan \"sudah pagi\"", ar: "أصبحت أصبحت" } },
      { a: { id: "Tatswib", ar: "التثويب" }, b: { id: "Ash-shalatu khairun minan-naum", ar: "الصلاة خير من النوم" } },
      { a: { id: "Ibrad", ar: "الإبراد" }, b: { id: "Menunda zhuhur saat sangat panas", ar: "تأخير الظهر لشدة الحر" } },
      { a: { id: "Waktu dharurah 'ashar", ar: "وقت الضرورة" }, b: { id: "Dari menguning hingga terbenam", ar: "إلى الغروب" } },
      { a: { id: "{خُذُوا زِينَتَكُمْ}", ar: "خذوا زينتكم" }, b: { id: "Dalil menutup aurat", ar: "ستر العورة" } }
    ],
    pilah: { t: { id: "Pilah: termasuk SYARAT adzan atau SUNNAH muadzin?", ar: "صنف: شرط أم سنة؟" }, kategori: [{ id: "Syarat adzan", ar: "شرط" }, { id: "Sunnah muadzin", ar: "سنة" }], item: [
      { t: { id: "Niat", ar: "النية" }, k: 0 },
      { t: { id: "Laki-laki", ar: "الذكورة" }, k: 0 },
      { t: { id: "Setelah masuk waktu", ar: "دخول الوقت" }, k: 0 },
      { t: { id: "Tertib lafaz", ar: "الترتيب" }, k: 0 },
      { t: { id: "Muwalah", ar: "الموالاة" }, k: 0 },
      { t: { id: "Suara indah", ar: "حسن الصوت" }, k: 1 },
      { t: { id: "Dalam keadaan suci", ar: "الطهارة" }, k: 1 },
      { t: { id: "Berdiri", ar: "القيام" }, k: 1 },
      { t: { id: "Menghadap kiblat", ar: "استقبال القبلة" }, k: 1 },
      { t: { id: "Jari di telinga", ar: "الإصبعان في الأذنين" }, k: 1 }
    ] },
    isian: [
      { t: { id: "Kunci shalat adalah bersuci, pengharamnya takbir, dan penghalalnya ______.", ar: "وتحليلها ______." }, j: { id: "salam", ar: "التسليم" }, x: [{ id: "doa", ar: "الدعاء" }, { id: "tasyahhud", ar: "التشهد" }, { id: "shalawat", ar: "الصلاة على النبي" }] },
      { t: { id: "\"Imam itu penanggung, dan muadzin itu ______.\"", ar: "والمؤذن ______." }, j: { id: "yang dipercaya", ar: "مؤتمن" }, x: [{ id: "penyeru", ar: "داع" }, { id: "pengikut", ar: "تابع" }, { id: "saksi", ar: "شاهد" }] },
      { t: { id: "Akhir waktu shubuh adalah terbitnya ______.", ar: "آخر وقت الفجر: طلوع ______." }, j: { id: "matahari", ar: "الشمس" }, x: [{ id: "fajar kedua", ar: "الفجر الثاني" }, { id: "dhuha", ar: "الضحى" }, { id: "mega", ar: "الشفق" }] },
      { t: { id: "Lafaz iqamah diucapkan secara ______ (ifrad).", ar: "الإقامة ______." }, j: { id: "tunggal", ar: "إفراد" }, x: [{ id: "genap", ar: "شفع" }, { id: "tiga kali", ar: "تثليث" }, { id: "bersahutan", ar: "تناوب" }] }
    ]
  }
});

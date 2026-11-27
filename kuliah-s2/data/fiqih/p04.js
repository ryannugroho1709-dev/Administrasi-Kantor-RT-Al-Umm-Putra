/* Fiqih Ibadah — Pertemuan 4: Bab Menghilangkan Najis & Bab Haidh (penutup Kitab Thaharah) */
Kuliah.pertemuan("fiqih", {
  no: 4, motif: "mizan", motifOpt: { l1: "طاهر", l2: "نجس", lbl: "إزالة النجاسة والحيض" }, tema: 3, durasi: 30,
  bab: { id: "Thaharah: najis, haidh, nifas & istihadhah", ar: "الطهارة: إزالة النجاسة والحيض" },
  judul: { id: "Menghilangkan Najis dan Bab Haidh, Nifas, & Istihadhah", ar: "باب إزالة النجاسة، وباب الحيض" },
  ringkas: {
    id: "Penutup Kitab Thaharah. **Bab 10 — Menghilangkan najis** (empat dhabit): definisi najis secara syar'i, najis bisa hilang tanpa air, bilangan & tanah hanya untuk jilatan anjing, kencing bayi laki-laki diperciki, dan *istihalah* menyucikan. **Bab 11 — Haidh** (tiga dhabit): tiga darah wanita (haidh, nifas, istihadhah dengan tiga jenisnya), tujuh hal yang haram karena haidh, tiga hal yang boleh setelah darah berhenti sebelum mandi, lalu faedah-faedah.",
    ar: "ختام كتاب الطهارة: باب إزالة النجاسة بضوابطه الأربعة، وباب الحيض بضوابطه الثلاثة: الدماء الخارجة من المرأة، وما يحرم بالحيض، وما يباح بعد انقطاعه وقبل الاغتسال، مع فوائد."
  },
  tujuan: [
    { id: "Menjelaskan definisi najis dan mengapa ukuran \"menjijikkan\" adalah syariat, bukan kebiasaan.", ar: "بيان تعريف النجاسة وأن الاستقذار شرعي لا عرفي." },
    { id: "Membuktikan dengan dalil bahwa najis dapat hilang tanpa air, serta pengecualian jilatan anjing.", ar: "الاستدلال على زوال النجاسة بغير الماء واستثناء ولوغ الكلب." },
    { id: "Membedakan cara menyucikan kencing bayi laki-laki dan bayi perempuan, serta memahami istihalah.", ar: "التفريق بين بول الغلام والجارية، وفهم الاستحالة." },
    { id: "Membedakan haidh, nifas, dan tiga jenis wanita mustahadhah beserta cara bersucinya.", ar: "التفريق بين الحيض والنفاس وأنواع المستحاضة وكيف تتطهر." },
    { id: "Menyebut tujuh larangan karena haidh dan tiga hal yang boleh setelah darah berhenti sebelum mandi.", ar: "ذكر ما يحرم بالحيض وما يباح بعد انقطاعه قبل الاغتسال." }
  ],
  isi: [
    { t: "pembuka", id: "Pertemuan keempat **menutup Kitab Thaharah**. Dosen kembali meminta maaf karena pembahasan diringkas: Syaikh Sami (pengelola program) menghendaki fiqih ibadah selesai dalam **dua belas pertemuan**, masing-masing setengah jam — padahal Kitab Thaharah saja butuh sekitar enam jam. *\"Ini hanya pembuka pintu.\"*", ar: "هذا من باب العلم لا من باب الدراسة المفصلة للفقه، فنحن نختصر اختصارًا، نزولًا على رغبة فضيلة الشيخ سامي حفظه الله، فهو يريد فقه العبادات في اثنا عشر محاضرة." },

    { t: "judul", id: "Bab 10: Menghilangkan Najis", ar: "الباب العاشر: باب إزالة النجاسة" },
    { t: "p", id: "Yang dimaksud najis di sini: **najis *thari'ah*** (yang menimpa benda suci sehingga ia ternajisi) maupun **najis *'ainiyyah*** (zatnya najis, seperti kotoran keledai).", ar: "والمقصود بالنجاسة سواء كانت نجاسةٌ حسية أو غيرها؛ الطارئة: هي التي تقع على شيءٍ طاهر فتنجسه، أو كانت نجاسة عينية: كروثة الحمار ونحوها." },
    { t: "daftar", judul: { id: "Contoh benda-benda najis yang disebut modul", ar: "أنواع النجاسات" }, item: [
      { id: "Kencing dan tinja manusia; madzi dan wadi.", ar: "بول الآدمي وغائطه والمذي والودي." },
      { id: "Kotoran dan kencing hewan yang tidak dimakan dagingnya.", ar: "وروث ما لا يؤكل لحمه وبوله." },
      { id: "Darah haidh dan nifas; air liur anjing.", ar: "ودم الحيض ودم النفاس، ولعاب الكلب." },
      { id: "Bangkai — **kecuali ikan dan belalang**.", ar: "والميتة ما عدا السمك والجراد." }
    ] },
    { t: "kutipan", ar: "النجاسة عينٌ مستقذرةٌ شرعًا يزول حكمها بزوالها ولو بغير الماء", id: "Dhabit 1: Najis adalah **benda** yang dianggap kotor **menurut syariat**; hukumnya hilang dengan hilangnya benda itu, **walaupun tanpa air**.", oleh: { id: "Bidayah al-Mutafaqqih", ar: "بداية المتفقه" } },
    { t: "akordion", judul: { id: "Dua masalah dalam dhabit pertama", ar: "مسألتان في الضابط الأول" }, item: [
      { judul: { id: "Masalah 1: \"benda yang kotor menurut syariat\"", ar: "المسألة الأولى: عين مستقذرة شرعًا" }, id: "Najis adalah **benda** (*'ain*), bukan sifat — harus bisa dilihat, dicium, atau dirasa. Kata **\"syar'an\"** berarti harus ada dalil syar'i yang menetapkannya, seperti {قُل لَّا أَجِدُ فِي مَا أُوحِيَ إِلَيَّ مُحَرَّمًا…} (Al-An'am: 145). Adapun rasa jijik karena **kebiasaan ('urf)** tidak dianggap — misalnya di Mesir orang jijik makan daging kuda padahal halal. Kisah **dhabb** yang dihidangkan di rumah Maimunah: Nabi ﷺ mengangkat tangan; Khalid bertanya, \"Haramkah?\" Beliau menjawab, *\"Tidak, tetapi ia tidak ada di negeri kaumku, maka aku merasa tidak suka.\"* Lalu Khalid memakannya sementara Rasulullah ﷺ melihat.", ar: "فإذن أول مسألة: النجاسة عينٌ مستقذرة من قبل الشرع، لا من قبل العرف والعادات." },
      { judul: { id: "Masalah 2: \"hilang walaupun tanpa air\"", ar: "المسألة الثانية: يزول حكمها ولو بغير ماء" }, id: "Apakah air disyaratkan untuk menghilangkan najis? **Tidak** — dalilnya banyak: (1) *\"Bila salah seorang dari kalian buang air besar, hendaklah beristinja' dengan tiga batu, itu mencukupinya\"* ('Aisyah); (2) Ibnu 'Umar: *\"Dahulu anjing-anjing kencing, keluar-masuk di masjid, dan mereka tidak memercikkan air sedikit pun\"*; (3) hadits dua sandal (Abu Sa'id): *\"Bila ia melihat kotoran di sandalnya, hendaklah mengusapnya lalu shalat dengannya.\"* Maka **pendapat yang rajih: najis bisa hilang tanpa air.**", ar: "وهكذا فالقول الراجح أن النجاسة تزول بغير الماء." }
    ] },
    { t: "kutipan", ar: "لا يشرع العدد ولا التتريب إلا بلعاب الكلب في الإناء ونحوه", id: "Dhabit 2: Tidak disyariatkan bilangan (cucian) dan tidak pula tanah, kecuali untuk air liur anjing pada bejana dan semisalnya.", oleh: { id: "Bidayah al-Mutafaqqih", ar: "بداية المتفقه" } },
    { t: "p", id: "Asalnya, najis **dicuci sampai hilang** — sekali, dua kali, tiga, atau lima; bila najisnya hilang, pakaian menjadi suci. Dalilnya hadits Asma' tentang darah haidh di pakaian: *\"Keriklah, lalu gosok dengan air, lalu perciki, kemudian shalatlah dengannya\"* — tanpa bilangan. Dan sabda Nabi ﷺ saat memandikan putrinya: *\"Mandikan ia tiga, lima, tujuh kali, atau lebih bila kalian pandang perlu.\"*", ar: "إنما الأصل في النجاسة أنها تغسل حتى تزول." },
    { t: "hadits", ar: "إِذَا وَلَغَ الْكَلْبُ فِي الْإِنَاءِ فَاغْسِلُوهُ سَبْعًا، وَعَفِّرُوهُ الثَّامِنَةَ بِالتُّرَابِ", id: "Bila anjing menjilat bejana, cucilah tujuh kali, dan gosoklah yang kedelapan dengan tanah. — Riwayat lain: *\"yang pertama dengan tanah\"*; riwayat lain: *\"yang pertama atau yang terakhir dengan tanah\"*. Abu Hurairah: *\"Bila anjing minum di bejana salah seorang dari kalian, cucilah tujuh kali.\"*", src: "HR. Muslim, dari 'Abdullah bin Mughaffal" },
    { t: "catatan", gaya: "faidah", judul: { id: "Air bekas jilatan anjing najis", ar: "نجاسة الماء الذي ولغ فيه" }, id: "Dalam riwayat Muslim, Nabi ﷺ **memerintahkan menumpahkan airnya** — ini menunjukkan air itu najis, berbeda dengan yang berpendapat suci. Praktiknya: bila anjing menjilat bejana, piring, atau wadah apa pun yang berisi air, **airnya dibuang**, lalu wadah dicuci tujuh kali, salah satunya dengan tanah: yang pertama, yang terakhir, atau di tengah.", ar: "وأمر النبي ﷺ كما في رواية مسلم بإراقة الماء؛ فدل على نجاسته، خلافًا لمن يرى طهارته." },
    { t: "kutipan", ar: "بول الغلام الذي لم يأكل الطعام لشهوةٍ ينضح، وبول الجارية يغسل", id: "Dhabit 3: Kencing bayi laki-laki yang belum makan makanan karena keinginannya cukup diperciki; kencing bayi perempuan dicuci.", oleh: { id: "Bidayah al-Mutafaqqih", ar: "بداية المتفقه" } },
    { t: "banding", judul: { id: "Kencing bayi: laki-laki vs perempuan", ar: "بول الغلام والجارية" },
      kiri: { judul: { id: "Bayi laki-laki (belum makan karena ingin)", ar: "الغلام الذي لم يأكل الطعام" }, ikon: "waves", poin: [
        { id: "Cukup ***nadh*** (diperciki)", ar: "ينضح" }, { id: "*Nadh*: mengalirkan/menggenangi tempat yang terkena dengan air tanpa dicuci (digosok-diperas)", ar: "إمرار الماء على المكان وغمره بدون غسل" }, { id: "Ummu Qais: bayinya kencing di pangkuan Nabi ﷺ, beliau meminta air lalu memercikinya dan tidak mencucinya", ar: "فدعا بماء فنضحه ولم يغسله" } ] },
      kanan: { judul: { id: "Bayi perempuan — atau laki-laki yang sudah makan", ar: "الجارية أو الغلام إذا أكل الطعام" }, ikon: "refresh", poin: [
        { id: "Wajib **dicuci**", ar: "يغسل" }, { id: "Bayi laki-laki yang sudah makan dan menginginkan makanan dicuci seperti kencing bayi perempuan — mafhum hadits", ar: "يغسل كبول الجارية تمامًا لمفهوم هذا الحديث" } ] } },
    { t: "catatan", gaya: "tanbih", judul: { id: "Mengapa dibedakan?", ar: "لماذا؟" }, id: "Illahnya ***ta'abbudiyyah*** (ibadah murni): tidak ada nash dari Nabi ﷺ yang menjelaskan sebabnya, walaupun sebagian ulama mencoba memberi alasan. Jawabannya: **nash, sebagai bentuk ta'abbud.**", ar: "وهذا العلة فيه تعبدية ولم يأتي نص عن النبي ﷺ، وإن كان حاول بعض أهل العلم التعليل لذلك. لماذا؟ نص، تعبدًا." },
    { t: "kutipan", ar: "الاستحالة مطهرة", id: "Dhabit 4: *Istihalah* (berubahnya zat) itu menyucikan.", oleh: { id: "Bidayah al-Mutafaqqih", ar: "بداية المتفقه" } },
    { t: "definisi", judul: { id: "Al-Istihalah", ar: "الاستحالة" }, istilah: { id: "**Berubahnya sesuatu dari asalnya menjadi sesuatu yang lain.** Contoh: kotoran keledai terbakar menjadi abu; khamr berubah menjadi cuka; anjing jatuh ke tambak garam lalu menjadi garam — semuanya menjadi **suci**.", ar: "هي تحول الشيء عن أصله إلى شيءٍ آخر." } },
    { t: "khilaf", masalah: { id: "Apakah istihalah menyucikan benda najis?", ar: "هل الاستحالة مطهرة؟" }, pendapat: [
      { siapa: { id: "Pilihan Syaikhul Islam, mazhab Ahlu azh-Zhahir, dan dirajihkan Ibnul Qayyim dalam *Zad al-Ma'ad*", ar: "اختيار شيخ الإسلام ومذهب أهل الظاهر ورجحه ابن القيم في الزاد" }, isi: { id: "**Ya, menyucikan.**", ar: "الاستحالة مطهرة." }, rajih: true }
    ], alasan: { id: "Ibnu Rusyd: ulama **berijma'** bahwa khamr yang berubah menjadi cuka **dengan sendirinya** boleh dimakan.", ar: "قال ابن رشد: وأجمعوا على أن الخمر إذا تخللت من ذاتها جاز أكلها." } },
    { t: "cek", q: { id: "Seseorang menginjak kotoran dengan sandalnya di jalan, lalu menggosokkan sandal itu ke tanah sampai bersih. Menurut pendapat rajih dalam modul…", ar: "مسح نعله من الأذى بالأرض:" }, o: [
      { id: "Sandalnya suci dan boleh dipakai shalat", ar: "طهرت ويصلي فيها" },
      { id: "Sandalnya tetap najis sampai dicuci air", ar: "لا تطهر إلا بالماء" },
      { id: "Sandalnya suci bila digosok tujuh kali", ar: "تطهر بسبع مسحات" },
      { id: "Sandalnya suci bila juga diberi tanah", ar: "تطهر مع التتريب" }], j: 0,
      b: { id: "Hadits dua sandal: *\"…hendaklah ia mengusapnya dan shalat dengannya.\"* Najis hilang walaupun tanpa air; bilangan & tanah hanya untuk jilatan anjing.", ar: "فليمسحه وليصل فيهما." } },

    { t: "judul", id: "Bab 11 (terakhir): Haidh", ar: "الباب الحادي عشر والأخير: باب الحيض" },
    { t: "p", id: "Bab khusus wanita, berisi **tiga dhabit**: (1) darah-darah yang keluar dari wanita, (2) yang haram karena haidh, (3) yang boleh setelah haidh berhenti sebelum mandi. Ulama dahulu berkata: *\"Darah wanita adalah lautan tanpa tepi\"* — tetapi mereka telah menyusun dan merapikannya sehingga menjadi **salah satu bab fiqih yang paling mudah**.", ar: "العلماء قديمًا يقولون: دماء النساء بحرٌ لا ساحل له، لكن بوَّبوها وهذَّبوها وصارت من أسهل أبواب الفقه." },
    { t: "tabel", judul: { id: "Dhabit 1 — Tiga darah wanita", ar: "الدماء من النساء ثلاثة أنواع" }, kolom: [{ id: "Darah", ar: "الدم" }, { id: "Definisi & ketentuan", ar: "التعريف والضابط" }], baris: [
      [{ id: "**Haidh**", ar: "الحيض" }, { id: "Bahasa: mengalir. Istilah: **darah alami yang menimpa wanita pada hari-hari tertentu bila ia telah baligh** — \"kebiasaan bulanan\". Menurut pendapat terkuat: **tidak ada batas minimal maupun maksimal** masanya, dan **tidak ada batas usia** (bisa mulai 13–15 tahun, bisa masih datang di usia 50–60).", ar: "دماءٌ طبيعية تصيب المرأة في أيامٍ معلومة إذا بلغت؛ ولا حد لأقله ولا لأكثره ولا لسنه." }],
      [{ id: "**Nifas**", ar: "النفاس" }, { id: "Dari *naffasallahu kurbatahu* (Allah melapangkan kesusahannya). Darah yang keluar ketika melahirkan, bersamaan atau sedikit sebelumnya disertai rasa sakit (*thalq*). **Tidak ada batas minimal**; **maksimal empat puluh hari** (pendapat jumhur). Bila berhenti lebih awal — sepekan, dua, atau tiga — ia mandi dan shalat.", ar: "دماءٌ تنزل من المرأة عند الولادة معها أو قبلها بشيءٍ قليل مع آلام الولادة؛ لا حد لأقله وأكثره أربعون يومًا." }],
      [{ id: "**Istihadhah**", ar: "الاستحاضة" }, { id: "Yang kita sebut **pendarahan**: darah yang terus keluar **di luar waktunya** — wanita itu tidak sedang haidh dan tidak sedang nifas, tetapi darah keluar.", ar: "استمرار نزول الدم وجريانه في غير أوانه." }]
    ] },
    { t: "ayat", ar: "وَاللَّائِي يَئِسْنَ مِنَ الْمَحِيضِ مِن نِّسَائِكُمْ إِنِ ارْتَبْتُمْ فَعِدَّتُهُنَّ ثَلَاثَةُ أَشْهُرٍ وَاللَّائِي لَمْ يَحِضْنَ", id: "Dan wanita-wanita yang telah putus asa dari haidh… dan wanita-wanita yang belum haidh. — Allah mengaitkan hukum dengan **turun dan berhentinya darah**, bukan dengan usia: Dia menyebut wanita tua dan anak kecil tanpa menentukan umur 60, 70, atau 80.", src: "QS. Ath-Thalaq: 4" },
    { t: "catatan", gaya: "info", judul: { id: "Haidh sebagai tanda", ar: "علامة" }, id: "Bila haidh datang, itu **tanda baligh**, wajibnya taklif, dan berlakunya hukum-hukum. Bila haidh terhenti (karena usia), wanita berpindah dari golongan yang beriddah dengan *quru'* menjadi golongan *ayisat* (yang telah putus haidh).", ar: "فمتى نزل الحيض فهو علامةٌ على البلوغ والوجوب وجريان الأحكام، ومتى انقطع الحيض انتقلت المرأة من ذوات القروء إلى الآيسات." },
    { t: "hadits", ar: "كَانَتِ النُّفَسَاءُ تَجْلِسُ عَلَى عَهْدِ رَسُولِ اللَّهِ ﷺ أَرْبَعِينَ يَوْمًا", id: "Ummu Salamah: Wanita nifas pada masa Rasulullah ﷺ duduk (tidak shalat) selama empat puluh hari. — At-Tirmidzi: ulama dari kalangan sahabat, tabi'in, dan setelahnya berijma' bahwa wanita nifas meninggalkan shalat empat puluh hari, **kecuali bila melihat suci sebelumnya** maka ia mandi dan shalat. Bila darah masih terlihat setelah empat puluh hari, menurut Ahmad, asy-Syafi'i, Sufyan, Ibnul Mubarak, dan Ishaq: ia mandi dan shalat.", src: "HR. Abu Dawud, at-Tirmidzi" },
    { t: "hadits", ar: "إِنَّمَا هِيَ رَكْضَةٌ مِنَ الشَّيْطَانِ، فَتَحَيَّضِي سِتَّةَ أَيَّامٍ أَوْ سَبْعَةَ أَيَّامٍ، ثُمَّ اغْتَسِلِي، فَإِذَا اسْتَنْقَأْتِ فَصَلِّي أَرْبَعَةً وَعِشْرِينَ أَوْ ثَلَاثَةً وَعِشْرِينَ", id: "Kepada Hamnah: \"Itu hanyalah gangguan dari setan. Anggaplah dirimu haidh enam atau tujuh hari, lalu mandilah; bila engkau telah bersih, shalatlah dua puluh empat atau dua puluh tiga hari.\"", src: "HR. Abu Dawud, at-Tirmidzi" },
    { t: "tabel", judul: { id: "Tiga jenis wanita mustahadhah", ar: "أقسام المستحاضة" }, kolom: [{ id: "Jenis", ar: "القسم" }, { id: "Keadaan", ar: "حالها" }, { id: "Yang ia lakukan", ar: "ما تفعل" }], baris: [
      [{ id: "**Mu'tadah**", ar: "المعتادة" }, { id: "Punya kebiasaan (mis. lima hari di awal bulan selama bertahun-tahun), lalu tiba-tiba darah terus keluar.", ar: "لها عادة." }, { id: "Pada jadwal haidhnya ia meninggalkan shalat (mis. lima hari); setelah lewat, mandi dan shalat. *\"Tinggallah selama haidhmu biasa menahanmu, lalu mandilah\"* (kepada Ummu Habibah).", ar: "امكثي قدر ما كانت تحبسك حيضتك ثم اغتسلي." }],
      [{ id: "**Mumayyizah**", ar: "المميزة" }, { id: "Bisa membedakan darah haidh dari darah istihadhah.", ar: "التي تستطيع أن تميز." }, { id: "*\"Bila itu darah haidh, ia hitam dan dikenali; tahanlah shalat. Bila yang lain, berwudhulah dan shalatlah\"* (kepada Fathimah).", ar: "فإنه دمٌ أسود يعرف." }],
      [{ id: "**Mutahayyirah**", ar: "المتحيرة" }, { id: "Tidak punya kebiasaan dan tidak bisa membedakan.", ar: "لا عادة لها ولا تمييز." }, { id: "Melihat wanita sebayanya dari kerabat (ibu, saudari, putri, bibi): bila mereka seragam dalam jumlah dan waktu, ia mengikuti; bila tidak, kembali ke hadits Hamnah — **enam atau tujuh hari**, lalu mandi dan shalat.", ar: "تنظر إلى أقرانها؛ وإلا ردت إلى حديث النبي ﷺ ستة أيام أو سبعة." }]
    ] },
    { t: "tabel", judul: { id: "Empat pembeda darah haidh dari istihadhah", ar: "يميز دم الحيض عن دم الاستحاضة بأربعة" }, kolom: [{ id: "Aspek", ar: "الوجه" }, { id: "Haidh", ar: "الحيض" }, { id: "Istihadhah", ar: "الاستحاضة" }], baris: [
      [{ id: "Warna", ar: "اللون" }, { id: "Hitam atau cokelat tua", ar: "أسود أو بني قاتم" }, { id: "Merah biasa", ar: "أحمر عادي" }],
      [{ id: "Kekentalan", ar: "الغلظ" }, { id: "Kental, pekat", ar: "ثخين غليظ" }, { id: "Encer", ar: "رقيق" }],
      [{ id: "Bau", ar: "الرائحة" }, { id: "Berbau tidak sedap", ar: "منتن الرائحة" }, { id: "Tidak berbau", ar: "لا رائحة له" }],
      [{ id: "Membeku", ar: "التجلط" }, { id: "Tidak menggumpal/membeku", ar: "لا يتجلط ولا يتجمد" }, { id: "Seperti darah biasa", ar: "بخلاف الدم المعتاد" }]
    ] },
    { t: "langkah", judul: { id: "Cara wanita mustahadhah bersuci (pilih salah satu)", ar: "كيف تتطهر المستحاضة" }, item: [
      { id: "**Mandi untuk setiap shalat**, sebagaimana dilakukan Ummu Habibah.", ar: "إما أن تغتسل لكل صلاة." },
      { id: "**Berwudhu untuk setiap shalat.**", ar: "وإما أن تتوضأ لكل صلاة." },
      { id: "**Menjamak dua shalat**: mengakhirkan zhuhur dan menyegerakan 'ashar — mandi sesaat sebelum 'ashar sekadar dapat zhuhur di akhir waktunya lalu shalat 'ashar; demikian pula maghrib dan 'isya'; dan mandi untuk shubuh.", ar: "وإما أن تجمع بين الصلاتين." }
    ] },

    { t: "hukum", judul: { id: "Dhabit 2 — Tujuh hal yang haram karena haidh (5 ijma', 2 menurut pendapat terkuat)", ar: "يحرم بالحيض سبعة أشياء: خمسة بإجماع واثنتين على أرجح الأقوال" }, item: [
      { h: "haram", judul: { id: "1. Jima' (ijma')", ar: "الجماع" }, id: "{وَيَسْأَلُونَكَ عَنِ الْمَحِيضِ قُلْ هُوَ أَذًى فَاعْتَزِلُوا النِّسَاءَ فِي الْمَحِيضِ…} (Al-Baqarah: 222) dan *\"Lakukan apa saja kecuali nikah (jima')\"*. Bila seorang suami bermaksiat dengannya, ia bersedekah **satu dinar atau setengah dinar** emas (sekitar 4¼ gram emas murni).", ar: "اصنعوا كل شيء إلا النكاح." },
      { h: "haram", judul: { id: "2. Thalaq (ijma')", ar: "الطلاق" }, id: "{فَطَلِّقُوهُنَّ لِعِدَّتِهِنَّ} (Ath-Thalaq: 1). Ibnu 'Umar menceraikan istrinya yang haidh; Nabi ﷺ menyuruhnya merujuk, menahannya hingga suci, haidh lagi, lalu suci — kemudian bila mau menahan atau menceraikan sebelum menyentuhnya: *\"Itulah iddah yang Allah perintahkan untuk menceraikan wanita.\"*", ar: "فتلك العدة التي أمر الله أن تُطلق لها النساء." },
      { h: "haram", judul: { id: "3–4. Shalat dan puasa (ijma')", ar: "الصلاة والصيام" }, id: "*\"Bukankah bila haidh ia tidak shalat dan tidak puasa?\"* — *\"Bila haidh datang, tinggalkan shalat.\"* Ia **mengqadha puasa, tidak mengqadha shalat** (Ibnul Mundzir: ijma').", ar: "لكن تقضي الحائض الصيام ولا تقضي الصلاة." },
      { h: "haram", judul: { id: "5. Thawaf (ijma')", ar: "الطواف" }, id: "'Aisyah haidh saat haji: *\"Lakukan apa yang dilakukan orang berhaji, kecuali jangan thawaf di Baitullah hingga engkau suci.\"*", ar: "افعلي ما يفعل الحاج غير ألا تطوفي بالبيت حتى تطهري." },
      { h: "haram", judul: { id: "6. Berdiam di masjid (pendapat terkuat)", ar: "المكث في المسجد" }, id: "Pendapat **imam empat** dan yang rajih: tidak boleh; Zhahiriyyah menyelisihi. Jumhur berdalil dengan hadits 'Aisyah: *\"Ambilkan sajadah (khumrah) dari masjid\" — \"Aku sedang haidh\" — \"Haidhmu tidak berada di tanganmu.\"*", ar: "إن حيضتك ليست في يدك." },
      { h: "haram", judul: { id: "7. Menyentuh mushaf (pendapat terkuat)", ar: "مس المصحف" }, id: "Bila haram bagi yang berhadats kecil, hadats besar lebih utama: *\"Tidak menyentuh Al-Qur'an kecuali orang suci\"* — pendapat jumhur dan imam empat.", ar: "فالأكبر من باب أولى." }
    ] },
    { t: "khilaf", masalah: { id: "Apakah wanita juga wajib membayar kaffarah bila suami menggaulinya saat haidh?", ar: "هل تلزم المرأة الكفارة؟" }, pendapat: [
      { siapa: { id: "Bila ia **rela/menurut**", ar: "إن طاوعت" }, isi: { id: "Ia juga menanggung kaffarah.", ar: "فعليها الكفارة." } },
      { siapa: { id: "Bila ia **dipaksa** suami", ar: "إن كانت مكرهة" }, isi: { id: "Tidak ada kewajiban apa pun atasnya.", ar: "فلا شيء عليها." } }
    ], alasan: { id: "Ulama berselisih; mereka **membedakan antara yang dipaksa dan yang menurut**. Faedah penutup modul: bila terjadi di **awal** masa darah, kaffarahnya satu dinar; bila di **akhir**, setengah dinar.", ar: "إذا كان في أول الدم فعليه دينار، وإذا كان في آخر الدم فعليه نصف دينار." } },
    { t: "catatan", gaya: "faidah", judul: { id: "Membaca Al-Qur'an bagi wanita haidh", ar: "قراءة الحائض" }, id: "Yang dilarang adalah **menyentuh mushaf**. Bila wanita haidh ingin membaca Al-Qur'an, ia bisa membaca dari **kitab tafsir** atau dari **HP** — bahkan HP berlayar besar yang memuat mushaf boleh ia pegang dan geser halamannya, **karena HP bukan mushaf**.", ar: "فإذا كان الهاتف مما له شاشة كبيرة وعليه المصحف يجوز أن تقرأ وتقلب الصفحات بيدها؛ لأنه ليس بمصحف." },
    { t: "hukum", judul: { id: "Dhabit 3 — Tiga hal yang boleh setelah darah berhenti, sebelum mandi", ar: "يباح بعد انقطاع الدم وقبل الاغتسال ثلاثة أشياء" }, item: [
      { h: "mubah", judul: { id: "Puasa", ar: "الصيام" }, id: "Bila darah berhenti sesaat sebelum fajar, ia boleh berpuasa walau mandinya setelah adzan fajar — Nabi ﷺ pernah masuk waktu shubuh dalam keadaan junub karena jima' lalu berpuasa. **Tetapi** ia wajib mandi sebelum matahari terbit agar mendapatkan shalat shubuh.", ar: "لكن هذه المرأة يلزمها أن تغتسل قبل طلوع الشمس لكي تدرك صلاة الصبح." },
      { h: "mubah", judul: { id: "Thalaq", ar: "الطلاق" }, id: "Bila istri telah suci dari haidh, suami boleh menceraikannya walau ia belum mandi.", ar: "جاز له أن يطلقها ولو قبل الاغتسال." },
      { h: "mubah", judul: { id: "Berdiam di masjid — dengan wudhu", ar: "المكث في المسجد بوضوء" }, id: "Boleh berdiam di masjid, tetapi dengan berwudhu.", ar: "جاز لها أن تمكث في المسجد ولكن بوضوء." }
    ] },
    { t: "akordion", judul: { id: "Faedah-faedah penutup bab haidh", ar: "فوائد من باب الحيض" }, item: [
      { judul: { id: "Wanita hamil tidak haidh", ar: "الحامل لا تحيض" }, id: "Kehamilan diketahui dengan berhentinya darah. Sabda Nabi ﷺ tentang tawanan Authas: *\"Wanita hamil tidak digauli hingga melahirkan, dan yang tidak hamil hingga ia haidh sekali.\"* Masalah ini khilafiyah; **inilah yang rajih** menurut modul.", ar: "والمسائل التي أذكرها خلافية وهذا هو الراجح." },
      { judul: { id: "Tanda berhentinya haidh", ar: "علامة انقطاع الدم" }, id: "Salah satu dari dua: (1) keluarnya **al-qashshah al-baidha'** — cairan putih bening yang dikeluarkan rahim; atau (2) meletakkan kapas/kain putih: bila keluar putih bersih, haidh telah berhenti. 'Aisyah: *\"Jangan tergesa-gesa hingga kalian melihat al-qashshah al-baidha'.\"*", ar: "لا تعجلن حتى ترين القصة البيضاء." },
      { judul: { id: "Kapas wangi setelah suci", ar: "الفرصة الممسكة" }, id: "Disunnahkan bagi wanita yang suci dari haidh atau nifas mengambil kapas yang diberi misk atau wewangian untuk mengusap bekas darah — kepada Asma': *\"…ia mengambil kapas yang diberi misk lalu bersuci dengannya\"*; 'Aisyah menjelaskan: *\"Usaplah bekas darah dengannya.\"*", ar: "تتبعين بها أثر الدم." },
      { judul: { id: "Bermesraan selain jima'", ar: "المباشرة" }, id: "Suami boleh bermesraan dengan istri yang haidh selain jima' (mencium, memeluk): *\"Rasulullah ﷺ menyuruhku memakai kain, lalu bermesraan denganku saat aku haidh.\"*", ar: "كان رسول الله ﷺ يأمرني فأتزر فيباشرني وأنا حائض." },
      { judul: { id: "Cairan keruh & kekuningan", ar: "الكدرة والصفرة" }, id: "**Di masa haidh: haidh; di masa suci: suci.** Bila keluar sebelum haidh, tidak dianggap dan ia tidak meninggalkan shalat. Ummu 'Athiyyah: *\"Kami tidak menganggap kekuningan dan keruh setelah suci sebagai apa pun.\"*", ar: "الكدرة والصفرة في زمن الحيض حيض، وفي زمن الطهر طهر." },
      { judul: { id: "Keguguran", ar: "السقط" }, id: "Bila janin yang gugur **sudah berbentuk**, wanita itu nifas; bila belum berbentuk, hukumnya istihadhah.", ar: "فإذا تخلق فهي نفساء، وإذا لم يتخلق فأحكامها أحكام المستحاضة." },
      { judul: { id: "Menggauli istri yang mustahadhah", ar: "وطء المستحاضة" }, id: "Boleh. Ibnu 'Abbas: *\"Tidak mengapa suaminya menggaulinya; adapun wanita haidh dan nifas, tidak.\"* Imam Ahmad: *\"Shalat lebih agung\"* (bila ia boleh shalat, jima' lebih ringan).", ar: "قال الإمام أحمد: الصلاة أعظم." },
      { judul: { id: "Pakaian khusus haidh & keluar ke mushalla 'Id", ar: "ثياب الحيض والخروج للعيد" }, id: "Tidak mengapa wanita punya pakaian khusus untuk masa haidh, sebagaimana Ummu Salamah. Disunnahkan wanita haidh, nifas, dan mustahadhah **keluar ke mushalla 'Id**.", ar: "يستحب للحائض والنفساء والمستحاضة أن تخرج إلى مصلى العيد." }
    ] },

    { t: "ringkasan", item: [
      { id: "Najis = benda yang kotor menurut syariat (bukan 'urf); hilang dengan hilangnya benda itu walau tanpa air.", ar: "الضابط الأول." },
      { id: "Bilangan dan tanah hanya untuk jilatan anjing: airnya dibuang, wadah dicuci 7×, salah satunya dengan tanah.", ar: "الضابط الثاني." },
      { id: "Kencing bayi laki-laki (belum makan karena ingin) diperciki; bayi perempuan dicuci — illah ta'abbudiyyah. Istihalah menyucikan.", ar: "الضابطان الثالث والرابع." },
      { id: "Darah wanita tiga: haidh (tanpa batas min/maks/usia), nifas (tanpa batas min; maks 40 hari), istihadhah (mu'tadah, mumayyizah, mutahayyirah).", ar: "الدماء الثلاثة." },
      { id: "Haram karena haidh: jima', thalaq, shalat, puasa, thawaf (ijma'), berdiam di masjid & menyentuh mushaf (pendapat terkuat). Setelah darah berhenti sebelum mandi boleh: puasa, thalaq, berdiam di masjid dengan wudhu.", ar: "ما يحرم وما يباح." }
    ] }
  ],
  istilah: [
    { ar: "النجاسة الطارئة", latin: "an-najasah ath-thari'ah", id: "Najis yang menimpa", def: { id: "Najis yang mengenai benda suci sehingga menajiskannya.", ar: "التي تقع على شيء طاهر فتنجسه." } },
    { ar: "النجاسة العينية", latin: "an-najasah al-'ainiyyah", id: "Najis zat", def: { id: "Benda yang zatnya najis, seperti kotoran keledai.", ar: "كروثة الحمار." } },
    { ar: "التتريب", latin: "at-tatrib", id: "Menggosok dengan tanah", def: { id: "Hanya disyariatkan pada jilatan anjing: salah satu dari tujuh cucian.", ar: "خاص بولوغ الكلب." } },
    { ar: "النضح", latin: "an-nadh", id: "Memerciki", def: { id: "Mengalirkan/menggenangi tempat yang terkena kencing dengan air tanpa dicuci; untuk kencing bayi laki-laki.", ar: "إمرار الماء على المكان وغمره بدون غسل." } },
    { ar: "علة تعبدية", latin: "'illah ta'abbudiyyah", id: "Alasan ta'abbudi", def: { id: "Hukum yang dijalankan karena nash, tanpa alasan yang dijelaskan syariat.", ar: "نص تعبدًا." } },
    { ar: "الاستحالة", latin: "al-istihalah", id: "Istihalah", def: { id: "Berubahnya sesuatu dari asalnya menjadi zat lain; menyucikan.", ar: "تحول الشيء عن أصله إلى شيء آخر." } },
    { ar: "الحيض", latin: "al-haidh", id: "Haidh", def: { id: "Darah alami wanita pada hari-hari tertentu setelah baligh; tanpa batas minimal, maksimal, maupun usia.", ar: "دماء طبيعية تصيب المرأة في أيام معلومة إذا بلغت." } },
    { ar: "النفاس", latin: "an-nifas", id: "Nifas", def: { id: "Darah saat melahirkan atau sedikit sebelumnya disertai sakit; maksimal 40 hari.", ar: "أكثره أربعون يومًا." } },
    { ar: "الاستحاضة", latin: "al-istihadhah", id: "Istihadhah", def: { id: "Darah yang terus keluar di luar waktu haidh dan nifas.", ar: "استمرار نزول الدم في غير أوانه." } },
    { ar: "المتحيرة", latin: "al-mutahayyirah", id: "Mutahayyirah", def: { id: "Mustahadhah tanpa kebiasaan dan tanpa kemampuan membedakan darah.", ar: "لا عادة لها ولا تمييز." } },
    { ar: "القصة البيضاء", latin: "al-qashshah al-baidha'", id: "Cairan putih", def: { id: "Cairan putih bening dari rahim, tanda suci dari haidh.", ar: "سائل أبيض شفاف يقذفه الرحم." } },
    { ar: "الكدرة والصفرة", latin: "al-kudrah wash-shufrah", id: "Keruh & kekuningan", def: { id: "Di masa haidh dihukumi haidh; di masa suci dihukumi suci.", ar: "في زمن الحيض حيض وفي زمن الطهر طهر." } }
  ],
  latihan: {
    pg: [
      { q: { id: "Di suatu daerah orang merasa jijik pada sejenis makanan yang halal. Menurut dhabit pertama, apakah makanan itu najis?", ar: "طعام حلال يستقذره العرف:" }, o: [
        { id: "Tidak, ukuran najis adalah syariat", ar: "لا؛ العبرة بالشرع" },
        { id: "Ya, karena dianggap kotor penduduknya", ar: "نعم؛ لاستقذار أهل البلد" },
        { id: "Ya, bila mayoritas ulama setempat setuju", ar: "نعم إن وافق علماء البلد" },
        { id: "Tidak, kecuali bila baunya menyengat", ar: "لا إلا إن كان منتنًا" }], j: 0,
        b: { id: "\"Najis adalah benda kotor **dari sisi syariat**, bukan dari sisi 'urf dan kebiasaan\" — contoh daging kuda di Mesir dan kisah dhabb.", ar: "لا من قبل العرف والعادات." } },
      { q: { id: "Kisah dhabb di rumah Maimunah dalam modul dibawakan untuk menunjukkan bahwa…", ar: "قصة الضب دليل على:" }, o: [
        { id: "Rasa jijik karena kebiasaan bukan dalil haram", ar: "الكراهة العرفية ليست دليل تحريم" },
        { id: "Dhabb termasuk makanan yang makruh dimakan", ar: "الضب مكروه" },
        { id: "Nabi ﷺ mengharamkan hewan padang pasir", ar: "تحريم حيوان البادية" },
        { id: "Hewan buruan harus disembelih sebelum dimakan", ar: "وجوب تذكية الصيد" }], j: 0,
        b: { id: "\"Tidak (haram), tetapi ia tidak ada di negeri kaumku, maka aku merasa tidak suka\" — lalu Khalid memakannya di hadapan beliau.", ar: "لا، ولكني لم يكن بأرض قومي فأجدني أعافه." } },
      { q: { id: "Manakah yang BUKAN dalil modul bahwa najis dapat hilang tanpa air?", ar: "ليس من أدلة زوال النجاسة بغير الماء:" }, o: [
        { id: "Hadits Asma' tentang darah haidh di pakaian", ar: "حديث أسماء في دم الحيض" },
        { id: "Istinja' dengan tiga batu mencukupi", ar: "الاستطابة بثلاثة أحجار" },
        { id: "Anjing kencing di masjid tanpa diperciki", ar: "بول الكلاب في المسجد" },
        { id: "Mengusap kotoran yang menempel pada sandal", ar: "مسح الأذى من النعلين" }], j: 0,
        b: { id: "Hadits Asma' (\"keriklah, gosok dengan air, perciki\") dibawakan untuk dhabit **kedua**: najis dicuci sampai hilang **tanpa bilangan**.", ar: "حديث أسماء في الضابط الثاني." } },
      { q: { id: "Seekor anjing menjilat mangkuk berisi air. Urutan penanganan yang sesuai modul…", ar: "ولغ الكلب في إناء فيه ماء:" }, o: [
        { id: "Buang airnya, cuci 7×, sekali dengan tanah", ar: "يراق ثم يغسل سبعًا إحداها بالتراب" },
        { id: "Airnya tetap dipakai, mangkuk dicuci 7×", ar: "يستعمل الماء ويغسل الإناء سبعًا" },
        { id: "Buang airnya, lalu cuci 3× sampai bersih", ar: "يراق ويغسل ثلاثًا" },
        { id: "Buang airnya, cuci sampai hilang tanpa bilangan", ar: "يراق ويغسل حتى يزول" }], j: 0,
        b: { id: "Perintah menumpahkan air menunjukkan najisnya; lalu tujuh kali, salah satunya dengan tanah (pertama, terakhir, atau tengah).", ar: "فإنه يراق هذا الماء ثم يغسل سبع مرات إحداها بالتراب." } },
      { q: { id: "Perintah Nabi ﷺ menumpahkan air bekas jilatan anjing (riwayat Muslim) menjadi bantahan terhadap pendapat bahwa…", ar: "الأمر بإراقة الماء رد على:" }, o: [
        { id: "Air bekas jilatan anjing itu suci", ar: "من يرى طهارته" },
        { id: "Tanah wajib di cucian pertama", ar: "من يوجب التتريب أولًا" },
        { id: "Bilangan cucian cukup tiga kali saja", ar: "من يرى التثليث" },
        { id: "Anjing boleh dipelihara di rumah", ar: "من يجيز اقتناء الكلب" }], j: 0,
        b: { id: "\"Maka itu menunjukkan najisnya, **berbeda dengan yang berpendapat sucinya**.\"", ar: "فدل على نجاسته، خلافًا لمن يرى طهارته." } },
      { q: { id: "Bayi laki-laki berusia dua tahun yang sudah makan nasi dan suka makan kencing di karpet. Cara menyucikannya…", ar: "غلام يأكل الطعام بشهوة بال:" }, o: [
        { id: "Dicuci seperti kencing bayi perempuan", ar: "يغسل كبول الجارية" },
        { id: "Cukup diperciki karena ia laki-laki", ar: "ينضح لأنه غلام" },
        { id: "Cukup dikeringkan dengan kain bersih", ar: "يجفف بخرقة" },
        { id: "Dicuci tujuh kali dengan tanah", ar: "يغسل سبعًا بالتراب" }], j: 0,
        b: { id: "Keringanan *nadh* hanya untuk bayi laki-laki yang **belum** makan karena keinginan; bila sudah, dicuci seperti bayi perempuan — mafhum hadits.", ar: "يغسل كبول الجارية تمامًا لمفهوم هذا الحديث." } },
      { q: { id: "Alasan dibedakannya kencing bayi laki-laki dan perempuan menurut modul adalah…", ar: "علة التفريق بين بول الغلام والجارية:" }, o: [
        { id: "Ta'abbudi: mengikuti nash", ar: "تعبدية؛ نص" },
        { id: "Kencing bayi laki-laki lebih sedikit", ar: "بول الغلام أقل" },
        { id: "Kencing bayi perempuan lebih berbau", ar: "بول الجارية أنتن" },
        { id: "Bayi laki-laki lebih sering digendong", ar: "الغلام يحمل أكثر" }], j: 0,
        b: { id: "\"Illahnya ta'abbudiyyah dan tidak ada nash dari Nabi ﷺ, walaupun sebagian ulama mencoba memberi alasan.\"", ar: "العلة فيه تعبدية." } },
      { q: { id: "Khamr berubah sendiri menjadi cuka. Hukumnya menurut ijma' yang dinukil Ibnu Rusyd…", ar: "الخمر إذا تخللت من ذاتها:" }, o: [
        { id: "Suci dan boleh dimakan", ar: "طاهرة يجوز أكلها" },
        { id: "Tetap najis karena asalnya khamr", ar: "نجسة باعتبار أصلها" },
        { id: "Suci, tetapi makruh dimakan", ar: "طاهرة مع الكراهة" },
        { id: "Boleh dimakan bila dicampur air", ar: "تؤكل إن خلطت بالماء" }], j: 0,
        b: { id: "\"Mereka berijma' bahwa khamr bila menjadi cuka dengan sendirinya boleh dimakan.\" Ini penerapan dhabit *istihalah muthahhirah*.", ar: "وأجمعوا على أن الخمر إذا تخللت من ذاتها جاز أكلها." } },
      { q: { id: "Seorang gadis haidh pertama kali di usia 10 tahun, dan seorang ibu masih haidh di usia 58 tahun. Menurut pendapat terkuat dalam modul…", ar: "حيض بنت عشر وامرأة في الثامنة والخمسين:" }, o: [
        { id: "Keduanya haidh, karena tak ada batas usia", ar: "كلاهما حيض؛ لا حد لسنه" },
        { id: "Keduanya istihadhah, karena di luar usia normal", ar: "كلاهما استحاضة" },
        { id: "Yang muda haidh, yang tua istihadhah", ar: "الصغيرة حيض والكبيرة استحاضة" },
        { id: "Yang tua haidh, yang muda istihadhah", ar: "الكبيرة حيض والصغيرة استحاضة" }], j: 0,
        b: { id: "\"Tidak ada batas bagi usianya, tidak untuk minimal dan tidak untuk maksimal\" — Allah mengaitkan hukum dengan turun dan berhentinya darah, tidak dengan usia (Ath-Thalaq: 4).", ar: "ولا حد لسنه لأقل سن ولا حد لأكثره." } },
      { q: { id: "Seorang ibu melahirkan dan darahnya berhenti pada hari ke-12. Apa yang ia lakukan?", ar: "نفساء انقطع دمها في اليوم الثاني عشر:" }, o: [
        { id: "Mandi lalu shalat sejak hari itu", ar: "تغتسل وتصلي" },
        { id: "Menunggu genap empat puluh hari", ar: "تنتظر تمام الأربعين" },
        { id: "Shalat tanpa mandi karena darah berhenti", ar: "تصلي بلا غسل" },
        { id: "Menunggu hingga hari ke-30", ar: "تنتظر إلى الثلاثين" }], j: 0,
        b: { id: "Tidak ada batas minimal nifas: \"bila darah berhenti, ia mandi dan shalat walau setelah sepekan, dua, atau tiga pekan.\"", ar: "فإذا انقطع الدم اغتسلت وصلت." } },
      { q: { id: "Seorang wanita punya kebiasaan haidh lima hari di awal bulan, lalu darahnya terus keluar sebulan penuh. Ia termasuk…", ar: "امرأة لها عادة ثم استمر الدم:" }, o: [
        { id: "Mu'tadah: mengikuti lima hari kebiasaannya", ar: "معتادة تعمل بعادتها" },
        { id: "Mumayyizah: berpegang pada warna darah", ar: "مميزة تعمل بالتمييز" },
        { id: "Mutahayyirah: mengikuti kerabat sebayanya", ar: "متحيرة ترجع لأقرانها" },
        { id: "Nifas: meninggalkan shalat empat puluh hari", ar: "نفساء أربعين يومًا" }], j: 0,
        b: { id: "Ia punya kebiasaan, maka \"pada jadwal haidh ia meninggalkan shalat lima hari di awal bulan; setelah lewat, mandi dan shalat.\"", ar: "هذه المعتادة التي لها عادة." } },
      { q: { id: "Mana yang sesuai dengan ciri darah haidh menurut modul?", ar: "من صفات دم الحيض:" }, o: [
        { id: "Hitam, kental, berbau, tidak membeku", ar: "أسود ثخين منتن لا يتجلط" },
        { id: "Merah segar, encer, tidak berbau", ar: "أحمر رقيق لا رائحة له" },
        { id: "Hitam, encer, tidak berbau, membeku", ar: "أسود رقيق يتجلط" },
        { id: "Merah, kental, tidak berbau, membeku", ar: "أحمر ثخين يتجلط" }], j: 0,
        b: { id: "Haidh: hitam/cokelat tua, kental, berbau, tidak menggumpal; istihadhah: merah biasa, encer, tidak berbau.", ar: "" } },
      { q: { id: "Dari tujuh hal yang haram karena haidh, dua yang disebut \"menurut pendapat terkuat\" (bukan ijma') adalah…", ar: "المحرمان على أرجح الأقوال:" }, o: [
        { id: "Berdiam di masjid dan menyentuh mushaf", ar: "المكث في المسجد ومس المصحف" },
        { id: "Thawaf di Ka'bah dan menyentuh mushaf", ar: "الطواف ومس المصحف" },
        { id: "Berpuasa dan berdiam di dalam masjid", ar: "الصيام والمكث في المسجد" },
        { id: "Dijatuhi thalaq dan melakukan thawaf", ar: "الطلاق والطواف" }], j: 0,
        b: { id: "Lima dengan ijma': jima', thalaq, shalat, puasa, thawaf. Dua menurut pendapat terkuat: berdiam di masjid (Zhahiriyyah menyelisihi) dan menyentuh mushaf.", ar: "خمسة بإجماع واثنتين على أرجح أقوال أهل العلم." } },
      { q: { id: "Darah haidh seorang wanita berhenti pukul 04.00, adzan shubuh pukul 04.30, dan ia baru sempat mandi pukul 05.15 (matahari terbit 05.45). Hukumnya…", ar: "انقطع دمها قبيل الفجر واغتسلت بعد الأذان:" }, o: [
        { id: "Puasanya sah dan shubuhnya masih terkejar", ar: "صومها صحيح وتدرك الصبح" },
        { id: "Puasanya batal karena mandi setelah fajar", ar: "يبطل صومها" },
        { id: "Puasanya sah, tetapi shubuh wajib diqadha", ar: "يصح صومها وتقضي الصبح" },
        { id: "Ia wajib menunggu hari esok untuk berpuasa", ar: "لا تصوم إلا غدًا" }], j: 0,
        b: { id: "Boleh berpuasa walau mandinya setelah adzan fajar (Nabi ﷺ pernah junub di waktu shubuh dan berpuasa), tetapi wajib mandi sebelum matahari terbit agar mendapatkan shalat shubuh.", ar: "يلزمها أن تغتسل قبل طلوع الشمس لكي تدرك صلاة الصبح." } },
      { q: { id: "Wanita haidh ingin muraja'ah hafalan dari aplikasi mushaf di tabletnya. Menurut modul…", ar: "الحائض تقرأ من الجهاز:" }, o: [
        { id: "Boleh, karena perangkat itu bukan mushaf", ar: "يجوز؛ لأنه ليس بمصحف" },
        { id: "Tidak boleh, karena layarnya menampilkan mushaf", ar: "لا يجوز؛ لأنه يعرض المصحف" },
        { id: "Boleh, tetapi tidak boleh menggeser halamannya", ar: "يجوز دون تقليب الصفحات" },
        { id: "Boleh, asalkan dengan berwudhu dahulu", ar: "يجوز بشرط الوضوء" }], j: 0,
        b: { id: "\"Bila HP berlayar besar memuat mushaf, ia boleh membaca dan membalik halaman dengan tangannya, karena itu bukan mushaf.\"", ar: "لأنه ليس بمصحف." } }
    ],
    bs: [
      { t: { id: "Bangkai ikan dan belalang termasuk najis.", ar: "ميتة السمك والجراد نجسة." }, j: false, b: { id: "\"…dan bangkai, **kecuali ikan dan belalang**.\"", ar: "ما عدا السمك والجراد." } },
      { t: { id: "Menurut modul, najis harus dicuci tiga kali agar suci.", ar: "يجب غسل النجاسة ثلاثًا." }, j: false, b: { id: "Tidak disyariatkan bilangan kecuali jilatan anjing; najis dicuci sampai hilang.", ar: "لا يشرع العدد." } },
      { t: { id: "Anjing yang jatuh ke tambak garam lalu berubah menjadi garam dihukumi suci.", ar: "الكلب إذا صار ملحًا طهر." }, j: true, b: { id: "Contoh istihalah dalam modul.", ar: "فهذا صار طاهرًا." } },
      { t: { id: "Haidh adalah tanda baligh dan berlakunya taklif.", ar: "الحيض علامة البلوغ." }, j: true, b: { id: "\"Bila haidh turun, ia tanda baligh, wajibnya (taklif), dan berlakunya hukum.\"", ar: "" } },
      { t: { id: "Wanita haidh mengqadha shalat dan puasa yang ditinggalkannya.", ar: "تقضي الحائض الصلاة والصيام." }, j: false, b: { id: "Ia mengqadha puasa, **tidak** mengqadha shalat (ijma').", ar: "تقضي الصوم دون الصلاة." } },
      { t: { id: "Wanita mustahadhah boleh menjamak zhuhur–'ashar dan maghrib–'isya' dengan satu kali mandi untuk tiap jamak.", ar: "للمستحاضة أن تجمع بين الصلاتين." }, j: true, b: { id: "Salah satu dari tiga cara bersuci mustahadhah.", ar: "" } },
      { t: { id: "Cairan kekuningan yang keluar di masa suci dihukumi haidh.", ar: "الصفرة في زمن الطهر حيض." }, j: false, b: { id: "\"Di masa haidh: haidh; di masa suci: suci.\"", ar: "وفي زمن الطهر طهر." } },
      { t: { id: "Janin gugur yang belum berbentuk membuat ibunya dihukumi nifas.", ar: "السقط غير المخلق نفاس." }, j: false, b: { id: "Belum berbentuk: hukumnya istihadhah; sudah berbentuk: nifas.", ar: "" } },
      { t: { id: "Wanita haidh dianjurkan ikut keluar ke mushalla 'Id.", ar: "تخرج الحائض إلى مصلى العيد." }, j: true, b: { id: "Disunnahkan bagi haidh, nifas, dan mustahadhah.", ar: "" } }
    ],
    jodoh: [
      { a: { id: "Najis thari'ah", ar: "النجاسة الطارئة" }, b: { id: "Najis yang mengenai benda suci", ar: "تقع على طاهر فتنجسه" } },
      { a: { id: "Istihalah", ar: "الاستحالة" }, b: { id: "Kotoran terbakar menjadi abu", ar: "روثة احترقت فصارت رمادًا" } },
      { a: { id: "Nadh", ar: "النضح" }, b: { id: "Kencing bayi laki-laki", ar: "بول الغلام" } },
      { a: { id: "Tatrib", ar: "التتريب" }, b: { id: "Jilatan anjing", ar: "ولوغ الكلب" } },
      { a: { id: "Mu'tadah", ar: "المعتادة" }, b: { id: "Mengikuti kebiasaan haidhnya", ar: "تعمل بعادتها" } },
      { a: { id: "Mutahayyirah", ar: "المتحيرة" }, b: { id: "Enam atau tujuh hari", ar: "ستة أو سبعة أيام" } },
      { a: { id: "Nifas maksimal", ar: "أكثر النفاس" }, b: { id: "Empat puluh hari", ar: "أربعون يومًا" } },
      { a: { id: "Al-qashshah al-baidha'", ar: "القصة البيضاء" }, b: { id: "Tanda suci dari haidh", ar: "علامة الطهر" } }
    ],
    pilah: { t: { id: "Pilah: hukumnya bagi wanita HAIDH (darah masih keluar), atau BOLEH setelah darah berhenti meski belum mandi?", ar: "صنف." }, kategori: [{ id: "Haram saat haidh", ar: "يحرم بالحيض" }, { id: "Boleh setelah berhenti, sebelum mandi", ar: "يباح بعد الانقطاع قبل الغسل" }], item: [
      { t: { id: "Shalat", ar: "الصلاة" }, k: 0 },
      { t: { id: "Thawaf", ar: "الطواف" }, k: 0 },
      { t: { id: "Jima'", ar: "الجماع" }, k: 0 },
      { t: { id: "Menyentuh mushaf", ar: "مس المصحف" }, k: 0 },
      { t: { id: "Berpuasa", ar: "الصيام" }, k: 1 },
      { t: { id: "Dijatuhi thalaq", ar: "الطلاق" }, k: 1 },
      { t: { id: "Berdiam di masjid dengan wudhu", ar: "المكث في المسجد بوضوء" }, k: 1 }
    ] },
    isian: [
      { t: { id: "Najis hilang hukumnya dengan hilangnya zat najis walaupun tanpa ______.", ar: "يزول حكمها بزوالها ولو بغير ______." }, j: { id: "air", ar: "الماء" }, x: [{ id: "tanah", ar: "التراب" }, { id: "niat", ar: "النية" }, { id: "sabun", ar: "الصابون" }] },
      { t: { id: "Jilatan anjing: dicuci tujuh kali, dan menurut riwayat 'Abdullah bin Mughaffal, digosok tanah pada cucian ke-______.", ar: "وعفروه ______ بالتراب." }, j: { id: "delapan", ar: "الثامنة" }, x: [{ id: "tiga", ar: "الثالثة" }, { id: "lima", ar: "الخامسة" }, { id: "tujuh", ar: "السابعة" }] },
      { t: { id: "Kaffarah menggauli istri saat haidh adalah bersedekah satu dinar atau ______ dinar.", ar: "دينار أو ______ دينار." }, j: { id: "setengah", ar: "نصف" }, x: [{ id: "seperempat", ar: "ربع" }, { id: "dua", ar: "اثنان" }, { id: "sepertiga", ar: "ثلث" }] },
      { t: { id: "Wanita yang tidak punya kebiasaan dan tidak bisa membedakan darah disebut ______.", ar: "التي لا عادة لها ولا تمييز: ______." }, j: { id: "mutahayyirah", ar: "المتحيرة" }, x: [{ id: "mu'tadah", ar: "المعتادة" }, { id: "mumayyizah", ar: "المميزة" }, { id: "ayisah", ar: "الآيسة" }] }
    ]
  }
});

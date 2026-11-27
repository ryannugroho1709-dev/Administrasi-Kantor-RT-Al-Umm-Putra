/* Fiqih Ibadah — Pertemuan 7: Makruh & pembatal shalat, sujud sahwi, shalat berjamaah, shalat Jumat */
Kuliah.pertemuan("fiqih", {
  no: 7, motif: "mizan", motifOpt: { l1: "مكروه", l2: "مبطل", lbl: "السهو والجماعة والجمعة" }, tema: 3, durasi: 30,
  bab: { id: "Shalat: makruh, pembatal, sahwi, jamaah & Jumat", ar: "المكروهات والمبطلات والسهو والجماعة والجمعة" },
  judul: { id: "Makruh & Pembatal Shalat, Sujud Sahwi, Shalat Berjamaah, dan Shalat Jumat", ar: "مكروهات الصلاة ومبطلاتها، وسجود السهو، وصلاة الجماعة، وصلاة الجمعة" },
  ringkas: {
    id: "Penutup bab hukum-hukum shalat: **sembilan belas makruh** dan **delapan pembatal** shalat. Lalu **sujud sahwi** (sebab: kurang, lebih, ragu; tempat: sebelum atau sesudah salam), **shalat berjamaah** (enam hal yang ditanggung imam, empat keadaan makmum, tujuh uzur), dan **shalat Jumat** (lima syarat wajib, tiga syarat sah).",
    ar: "مكروهات الصلاة التسعة عشر ومبطلاتها الثمانية، ثم سجود السهو: أسبابه ومحله، ثم صلاة الجماعة: ما يتحمله الإمام وأحوال المأموم وأعذار الترك، ثم صلاة الجمعة: شروط وجوبها وصحتها."
  },
  tujuan: [
    { id: "Membedakan perbuatan yang makruh dalam shalat dari yang membatalkannya.", ar: "التفريق بين المكروه والمبطل." },
    { id: "Menentukan tempat sujud sahwi (sebelum/sesudah salam) untuk kasus kurang, lebih, dan ragu.", ar: "تحديد محل سجود السهو." },
    { id: "Menjelaskan bahwa sujud sahwi menutup wajib dan sunnah, tetapi tidak menutup rukun.", ar: "بيان ما يجبره السهو وما لا يجبره." },
    { id: "Menyebut enam hal yang ditanggung imam dan empat keadaan makmum beserta hukumnya.", ar: "ذكر ما يتحمله الإمام وأحوال المأموم." },
    { id: "Menyebut uzur meninggalkan jamaah, serta syarat wajib dan syarat sah Jumat.", ar: "ذكر الأعذار وشروط الجمعة." }
  ],
  isi: [
    { t: "pembuka", id: "Setelah rukun, wajib, dan sunnah, pertemuan ketujuh menuntaskan **hukum-hukum shalat** (dhabit 6–7: makruh dan pembatal), lalu masuk ke **sujud sahwi**, **shalat berjamaah**, dan **shalat Jumat**.", ar: "بعد ما تكلمنا عن الأركان والواجبات والسنن نتكلم اليوم إن شاء الله تعالى عن باقي أحكام الصلاة." },

    { t: "judul", id: "Dhabit 6: Sembilan Belas Makruh Shalat", ar: "الضابط السادس: مكروهات الصلاة تسعة عشر" },
    { t: "definisi", judul: { id: "Al-Makruh", ar: "المكروه" }, istilah: { id: "Yang dilarang syariat **tidak dengan cara pasti dan mengikat**. Meninggalkan sunnah **dengan sengaja** makruh; karena lupa, tidak apa-apa.", ar: "ما نهى عنه الشارع ليس على سبيل الحتم واللزوم." } },
    { t: "hukum", item: [
      { h: "makruh", judul: { id: "Meninggalkan sunnah dengan sengaja", ar: "ترك سنة عمدًا" }, id: "Menyelisihi petunjuk Nabi ﷺ — mis. shalat tanpa surah, atau mengubah tasbih dan tata gerak. *\"Shalatlah sebagaimana kalian melihatku shalat.\"*", ar: "" },
      { h: "makruh", judul: { id: "Menoleh tanpa keperluan", ar: "الالتفات بلا حاجة" }, id: "*\"Itu adalah curian yang dicuri setan dari shalat seorang hamba.\"* Baik menoleh dengan mata, badan, maupun hati.", ar: "هو اختلاس يختلسه الشيطان من صلاة العبد." },
      { h: "makruh", judul: { id: "Menghamparkan lengan saat sujud & banyak bergerak ('abats)", ar: "افتراش الذراعين والعبث" }, id: "*\"…jangan membentangkan lengan seperti anjing.\"* 'Abats: banyak bergerak/bermain dengan badan, jenggot, atau pakaian — *\"Mengapa kulihat kalian mengangkat tangan seperti ekor kuda yang liar? Tenanglah dalam shalat.\"*", ar: "اسكنوا في الصلاة." },
      { h: "makruh", judul: { id: "Takhashshur (tangan di pinggang)", ar: "التخصر" }, id: "Meletakkan tangan di atas pinggang; Nabi ﷺ melarang shalat dengan *ikhtishar*.", ar: "" },
      { h: "makruh", judul: { id: "Menguap", ar: "التثاؤب" }, id: "*\"Menguap dalam shalat dari setan; bila menguap, tahanlah semampunya.\"*", ar: "" },
      { h: "makruh", judul: { id: "Menghadap gambar", ar: "استقبال صورة" }, id: "*\"Singkirkan tirai ini dari kami, gambarnya terus muncul dalam shalatku\"* — gambar di kiblat, dinding, atau sajadah.", ar: "" },
      { h: "makruh", judul: { id: "Membunyikan jari & menjalin jari (tasybik)", ar: "فرقعة الأصابع وتشبيكها" }, id: "Ibnu 'Abbas kepada maula yang membunyikan jari: *\"Jangan membunyikan jarimu saat shalat.\"* Ibnu 'Umar tentang tasybik: *\"Itulah shalat orang yang dimurkai.\"*", ar: "" },
      { h: "makruh", judul: { id: "Pakaian bergambar/bercorak mencolok", ar: "لبس ثوب معلم" }, id: "Khamishah bercorak: *\"…sungguh ia tadi melalaikanku dalam shalatku.\"*", ar: "فإنها ألهتني آنفًا في صلاتي." },
      { h: "makruh", judul: { id: "Menyingsingkan pakaian atau menggulung rambut", ar: "كف الثوب أو الشعر" }, id: "*\"Aku diperintah sujud di atas tujuh anggota dan tidak menahan rambut atau pakaian.\"* Menyingsingkan khusus saat sujud dibenci ulama; bila memang kebiasaannya, tidak mengapa.", ar: "" },
      { h: "makruh", judul: { id: "Mengusap bekas sujud sebelum selesai", ar: "مسح أثر السجود قبل الفراغ" }, id: "Ibnu Mas'ud: *\"Termasuk perangai kasar, sering mengusap dahi sebelum selesai shalat.\"*", ar: "" },
      { h: "makruh", judul: { id: "Saat makanan terhidang / menahan dua hadats", ar: "بحضرة الطعام ومدافعة الأخبثين" }, id: "*\"Tidak ada shalat saat makanan terhidang, dan tidak pula saat menahan dua kotoran\"*; *\"Bila makan malam dihidangkan dan iqamah dikumandangkan, mulailah dengan makan.\"*", ar: "" },
      { h: "makruh", judul: { id: "Tanpa sutrah (bagi imam dan munfarid)", ar: "الصلاة إلى غير سترة" }, id: "*\"Hendaklah ia shalat menghadap sutrah dan mendekat padanya; jangan biarkan seorang pun lewat di depannya — bila tetap lewat, cegahlah, sesungguhnya ia setan.\"*", ar: "" },
      { h: "makruh", judul: { id: "Sadl & menutup mulut", ar: "السدل وتغطية الفم" }, id: "Sadl: menaruh pakaian berlengan di bahu tanpa dipakai (seperti jaket). Menutup mulut makruh kecuali ada keperluan (dingin, sakit, pilek).", ar: "" },
      { h: "makruh", judul: { id: "Meludah ke arah kiblat/kanan", ar: "البصاق إلى القبلة أو عن يمينه" }, id: "*\"Allah berada di hadapan wajahnya…\"* — kini masjid berkarpet, maka sangat makruh; hendaklah memakai kain/sapu tangan.", ar: "" },
      { h: "makruh", judul: { id: "Mengangkat pandangan ke langit", ar: "رفع البصر إلى السماء" }, id: "*\"Hendaklah orang-orang berhenti mengangkat pandangan ke langit ketika berdoa dalam shalat, atau pandangan mereka akan disambar.\"*", ar: "" }
    ] },

    { t: "judul", id: "Dhabit 7: Delapan Pembatal Shalat", ar: "الضابط السابع: مبطلات الصلاة ثمانية" },
    { t: "hukum", item: [
      { h: "batal", judul: { id: "1. Meninggalkan syarat atau rukun dengan sengaja", ar: "ترك شرط أو ركن عمدًا" }, id: "Syarat: hadits *lum'ah* sebesar dirham. Rukun: hadits *al-musi' shalatahu* — \"ulangi, engkau belum shalat.\" **Bila ditinggalkan karena tidak mampu, shalatnya sah** ({فَاتَّقُوا اللَّهَ مَا اسْتَطَعْتُمْ}).", ar: "أما إن تركها عجزًا فصلاته صحيحة." },
      { h: "batal", judul: { id: "2. Makan atau minum dengan sengaja", ar: "الأكل أو الشرب عمدًا" }, id: "Ibnul Mundzir: ijma' — yang makan/minum dengan sengaja dalam shalat fardhu wajib mengulang.", ar: "" },
      { h: "batal", judul: { id: "3. Berbicara dengan sengaja", ar: "الكلام عمدًا" }, id: "Walaupun demi kemaslahatan shalat, menurut pendapat terkuat: *\"Shalat ini tidak layak ada ucapan manusia\"*; untuk kemaslahatan shalat Nabi ﷺ membimbing: *\"Tasbih bagi laki-laki, tepuk tangan bagi wanita.\"*", ar: "التسبيح للرجال والتصفيق للنساء." },
      { h: "batal", judul: { id: "4. Tertawa (bersuara dengan dua huruf atau lebih)", ar: "الضحك" }, id: "Ibnul Mundzir: ijma' tertawa merusak shalat.", ar: "" },
      { h: "batal", judul: { id: "5. Banyak gerak dari selain jenis shalat", ar: "العمل الكثير من غير جنسها" }, id: "Tambahan **dari jenis shalat** tidak membatalkan (kecuali menambah rukun fi'li); dari **selain jenisnya** membatalkan bila banyak. Sedikit tidak — Nabi ﷺ shalat sambil menggendong Umamah: bila sujud diletakkan, bila berdiri digendong.", ar: "" },
      { h: "batal", judul: { id: "6. Sengaja menambah rukun fi'li", ar: "تعمد زيادة ركن فعلي" }, id: "Menambah rukuk, sujud, atau berdiri mengubah bentuk shalat — batal. Tambahan **ucapan** hanya makruh. Ibnu Qudamah: tambahan dari jenis shalat atau selain jenisnya, bila disengaja, membatalkan.", ar: "" },
      { h: "batal", judul: { id: "7. Lewatnya wanita baligh, keledai, atau anjing hitam (di dalam batas sujud)", ar: "مرور المرأة البالغة أو الحمار أو الكلب الأسود" }, id: "Hadits Abu Dzar: *\"Shalat seseorang terputus bila di depannya tidak ada (sutrah) setinggi sandaran pelana: wanita haidh (baligh), keledai, dan anjing hitam\"* — \"anjing hitam itu setan.\"", ar: "الكلب الأسود شيطان." },
      { h: "batal", judul: { id: "8. Bermakmum kepada yang tidak sah menjadi imam", ar: "الائتمام بمن لا تصح إمامته" }, id: "Seperti bermakmum kepada orang yang sengaja berhadats, wanita bagi laki-laki, orang berhadats bagi yang berwudhu, orang telanjang bagi yang berpakaian. Bila shalat imam tidak sah, shalat makmum pun tidak sah.", ar: "" }
    ] },

    { t: "judul", id: "Bab Sujud Sahwi", ar: "باب سجود السهو" },
    { t: "definisi", judul: { id: "Sujud Sahwi", ar: "سجود السهو" }, istilah: { id: "**Dua sujud yang dilakukan orang shalat untuk menambal kekurangan.** Sebabnya tiga: **kurang, lebih, ragu.**", ar: "عبارة عن سجدتين يسجدهما المصلي لجبر الخلل." } },
    { t: "tabel", judul: { id: "Tempat sujud sahwi menurut rincian modul", ar: "محل سجود السهو" }, kolom: [{ id: "Sebab", ar: "السبب" }, { id: "Tempat", ar: "المحل" }, { id: "Dalil", ar: "الدليل" }], baris: [
      [{ id: "**Kurang** (mis. lupa tasyahhud awal)", ar: "النقص" }, { id: "**Sebelum salam**", ar: "قبل السلام" }, { id: "'Abdullah bin Buhainah: Nabi ﷺ berdiri dari dua rakaat pertama zhuhur tanpa duduk; di akhir beliau bertakbir sambil duduk dan sujud dua kali **sebelum salam**.", ar: "" }],
      [{ id: "**Lebih** (mis. salam setelah dua rakaat)", ar: "الزيادة" }, { id: "**Sesudah salam**", ar: "بعد السلام" }, { id: "Kisah Dzul-Yadain: \"Engkau lupa atau shalat diqashar?\" — beliau shalat dua rakaat lagi, salam, lalu sujud dua kali, lalu salam.", ar: "" }],
      [{ id: "**Ragu — membangun di atas yakin**", ar: "شك مع البناء على اليقين" }, { id: "**Sebelum salam**", ar: "قبل السلام" }, { id: "*\"Buanglah keraguan dan bangunlah di atas yang ia yakini, lalu sujud dua kali sebelum salam.\"* Yakin = jumlah yang lebih sedikit.", ar: "فليطرح الشك وليبن على ما استيقن." }],
      [{ id: "**Ragu — dengan tahharri** (menimbang yang lebih kuat)", ar: "شك مع التحري" }, { id: "**Sesudah salam**", ar: "بعد السلام" }, { id: "Ibnu Mas'ud: *\"…bila salah seorang ragu, hendaklah ia mencari yang benar, menyempurnakannya, salam, lalu sujud dua kali.\"*", ar: "فليتحر الصواب فليتم عليه ثم ليسلم ثم يسجد سجدتين." }]
    ] },
    { t: "catatan", gaya: "info", judul: { id: "Kelapangan dalam masalah ini", ar: "الأمر فيه سعة" }, id: "Menurut modul, perkaranya lapang: **semua sebelum salam** mencukupi menurut asy-Syafi'i; **semua sesudah salam** mencukupi menurut Hanafiyyah. Tetapi **merinci** seperti di atas lebih utama dan lebih dekat kepada dalil dan perbuatan Nabi ﷺ.", ar: "ولو فصّل كما فصلنا فهو الأولى والأقرب للأدلة." },
    { t: "banding", judul: { id: "Apa yang bisa ditambal sujud sahwi?", ar: "ما يجبره سجود السهو" },
      kiri: { judul: { id: "Ditambal sujud sahwi", ar: "يجبره" }, poin: [{ id: "Wajib-wajib shalat", ar: "الواجب" }, { id: "Sunnah (ucapan maupun perbuatan)", ar: "السنة" }] },
      kanan: { judul: { id: "TIDAK ditambal — wajib didatangkan", ar: "لا يجبره، بل يجب الإتيان به" }, poin: [{ id: "Semua rukun: mis. lupa Al-Fatihah, rukuk, atau satu sujud", ar: "الركن" }, { id: "Dosen: *\"Ini perkataan yang indah dan berharga.\"*", ar: "وهذا كلام رائع نفيس" }] } },
    { t: "cek", q: { id: "Seseorang ragu: sudah tiga atau empat rakaat? Ia tidak punya dugaan yang lebih kuat. Apa yang dilakukan?", ar: "شك ثلاثًا أم أربعًا بلا ترجيح:" }, o: [
      { id: "Menganggap tiga, tambah satu, sujud sebelum salam", ar: "يبني على ثلاث ويسجد قبل السلام" },
      { id: "Menganggap empat, lalu sujud sesudah salam", ar: "يبني على أربع ويسجد بعد السلام" },
      { id: "Mengulang shalat dari awal karena ragu", ar: "يستأنف الصلاة" },
      { id: "Menganggap tiga, tanpa sujud sahwi sama sekali", ar: "يبني على ثلاث بلا سجود" }], j: 0,
      b: { id: "Bangun di atas **yakin** (yang lebih sedikit = tiga), lalu sujud **sebelum salam**: bila ternyata lima, sujud itu menggenapkan; bila tepat empat, sujud itu penghinaan bagi setan.", ar: "" } },

    { t: "judul", id: "Bab Shalat Berjamaah", ar: "باب صلاة الجماعة" },
    { t: "khilaf", masalah: { id: "Hukum shalat berjamaah", ar: "حكم صلاة الجماعة" }, pendapat: [
      { siapa: { id: "Sebagian ulama", ar: "" }, isi: { id: "Wajib ('ain)", ar: "واجبة" } },
      { siapa: { id: "Sebagian ulama", ar: "" }, isi: { id: "Sunnah muakkadah", ar: "سنة مؤكدة" } },
      { siapa: { id: "Syafi'iyyah, pilihan Syaikhul Islam", ar: "قول الشافعية واختيار شيخ الإسلام" }, isi: { id: "**Fardhu kifayah**", ar: "فرض على الكفاية" }, rajih: true }
    ], alasan: { id: "Modul: *\"Yang lebih condong jiwa kepadanya: fardhu kifayah.\"* Nabi ﷺ sendiri mendorong dan menganjurkannya.", ar: "التي تميل إليه النفس أنه فرض على الكفاية." } },
    { t: "hukum", judul: { id: "Dhabit 1 — Enam hal yang ditanggung imam dari makmum", ar: "يتحمل الإمام عن المأموم ستة أشياء" }, item: [
      { h: "info", judul: { id: "Al-Fatihah bagi masbuq", ar: "قراءة الفاتحة عن المسبوق" }, id: "Yang datang ketika imam rukuk lalu ikut rukuk, mendapat rakaat itu. Abu Bakrah rukuk sebelum sampai shaf: *\"Semoga Allah menambah semangatmu, tetapi jangan diulang.\"*", ar: "زادك الله حرصًا ولا تعد." },
      { h: "info", judul: { id: "Sujud sahwi", ar: "سجود السهو" }, id: "Ibnul Mundzir: ijma' — makmum yang lupa di belakang imam tidak sujud sahwi; tidak dinukil sahabat sujud setelah imam salam.", ar: "" },
      { h: "info", judul: { id: "Sujud tilawah", ar: "سجود التلاوة" }, id: "Makmum yang membaca ayat sajdah tidak sujud sendiri: *\"Imam dijadikan untuk diikuti, jangan menyelisihinya.\"*", ar: "" },
      { h: "info", judul: { id: "Sutrah", ar: "السترة" }, id: "*\"Sutrah imam adalah sutrah bagi makmum di belakangnya\"* (at-Tirmidzi). Nabi ﷺ menancapkan tombak di hari 'Id dan shalat menghadapnya.", ar: "" },
      { h: "info", judul: { id: "Doa qunut", ar: "دعاء القنوت" }, id: "Baik witir maupun nazilah: imam yang berdoa, makmum cukup mengaminkan.", ar: "" },
      { h: "info", judul: { id: "Tasyahhud awal bagi masbuq", ar: "التشهد الأول عن المسبوق" }, id: "Yang datang di rakaat kedua: rakaat ketiga imam adalah rakaat keduanya, tetapi ia ikut berdiri bersama imam — imam menanggung tasyahhud awalnya.", ar: "" }
    ] },
    { t: "hukum", judul: { id: "Dhabit 2 — Empat keadaan makmum terhadap imam", ar: "أحوال المأموم مع الإمام أربعة" }, item: [
      { h: "makruh", judul: { id: "Musawah (bersamaan)", ar: "المساواة" }, id: "Rukuk dan sujud bersamaan dengan imam — makruh. **Kecuali takbiratul ihram: bila bersamaan, shalatnya tidak sah** (*\"bila ia bertakbir, bertakbirlah\"*).", ar: "فإذا ساواه في تكبيرة الإحرام فإن الصلاة لا تنعقد." },
      { h: "makruh", judul: { id: "Takhalluf (tertinggal tanpa uzur)", ar: "التخلف" }, id: "Makruh, karena umumnya perintah mengikuti.", ar: "" },
      { h: "haram", judul: { id: "Musabaqah (mendahului)", ar: "المسابقة" }, id: "*\"Tidakkah takut orang yang mengangkat kepala sebelum imam, Allah jadikan kepalanya kepala keledai?\"*", ar: "" },
      { h: "sunnah", judul: { id: "Mutaba'ah (mengikuti tepat setelahnya)", ar: "المتابعة" }, id: "Inilah sunnah: *\"Bila ia takbir maka takbirlah, bila rukuk maka rukuklah…\"* — huruf *fa'* menunjukkan mengikuti dan berurutan.", ar: "والفاء تقتضي المتابعة والترتيب." }
    ] },
    { t: "hukum", judul: { id: "Dhabit 3 — Uzur meninggalkan Jumat & jamaah", ar: "أعذار ترك الجمعة والجماعة" }, item: [
      { h: "mubah", judul: { id: "Sakit", ar: "المرض" }, id: "Saat sakit menjelang wafat, Nabi ﷺ tidak hadir dan bersabda: *\"Suruh Abu Bakr mengimami manusia.\"*", ar: "" },
      { h: "mubah", judul: { id: "Takut", ar: "الخوف" }, id: "Atas diri atau harta: {فَإِنْ خِفْتُمْ فَرِجَالًا أَوْ رُكْبَانًا}.", ar: "" },
      { h: "mubah", judul: { id: "Menahan buang air", ar: "مدافعة الأخبثين" }, id: "*\"Tidak ada shalat… dan tidak pula saat menahan dua kotoran.\"*", ar: "" },
      { h: "mubah", judul: { id: "Hujan atau angin kencang", ar: "المطر أو الريح الشديد" }, id: "Muadzin Nabi ﷺ menyeru di malam dingin dan hujan: *\"Shalatlah di tempat tinggal kalian.\"* Ibnu 'Abbas melakukannya bahkan pada hari Jumat.", ar: "صلوا في رحالكم." },
      { h: "mubah", judul: { id: "Imam memanjangkan berlebihan atau memendekkan hingga merusak", ar: "تطويل الإمام المُمل أو تقصيره المُخل" }, id: "Kisah Mu'adz membaca Al-Baqarah: *\"Apakah engkau tukang fitnah, wahai Mu'adz?\"* Imam yang shalat 'isya' empat rakaat dalam dua menit tanpa thuma'ninah — jangan shalat di belakangnya.", ar: "أفتان أنت يا معاذ؟" }
    ] },

    { t: "judul", id: "Bab Shalat Jumat", ar: "باب صلاة الجمعة" },
    { t: "banding", kiri: { judul: { id: "Lima syarat wajib Jumat", ar: "شروط وجوب الجمعة خمسة" }, ikon: "user", poin: [
        { id: "Islam", ar: "الإسلام" }, { id: "Taklif (baligh & berakal) — anak kecil diperintah tetapi tidak wajib", ar: "التكليف" }, { id: "Laki-laki — Ibnul Mundzir: ijma' tidak ada Jumat bagi wanita", ar: "الذكورية" }, { id: "Merdeka — juga tidak wajib bagi musafir", ar: "الحرية" }, { id: "Bebas dari uzur (sakit, takut, menahan buang air, dll.)", ar: "الخلو من الأعذار" } ] },
      kanan: { judul: { id: "Tiga syarat sah Jumat", ar: "شروط صحة الجمعة ثلاثة" }, ikon: "check", poin: [
        { id: "Syarat sah shalat (yang telah dibahas)", ar: "شروط صحة الصلاة" }, { id: "**Jumlah** — diperselisihkan antara tiga hingga empat puluh orang; *\"Tidaklah tiga orang di desa… tidak ditegakkan shalat di antara mereka kecuali setan menguasai mereka\"*", ar: "العدد" }, { id: "**Dua khutbah** — {فَاسْعَوْا إِلَىٰ ذِكْرِ اللَّهِ}; Nabi ﷺ berkhutbah setelah adzan secara mutawatir; haram berbicara dan memainkan kerikil saat khutbah", ar: "الخطبتان" } ] } },
    { t: "hadits", ar: "الْجُمُعَةُ حَقٌّ وَاجِبٌ عَلَى كُلِّ مُسْلِمٍ فِي جَمَاعَةٍ إِلَّا أَرْبَعَةً: عَبْدٌ مَمْلُوكٌ، أَوِ امْرَأَةٌ، أَوْ صَبِيٌّ، أَوْ مَرِيضٌ", id: "Jumat adalah hak yang wajib atas setiap muslim secara berjamaah, kecuali empat: budak, wanita, anak kecil, dan orang sakit.", src: "HR. Abu Dawud, dari Thariq bin Syihab" },

    { t: "ringkasan", item: [
      { id: "Makruh: menoleh, 'abats, takhashshur, menguap, gambar di kiblat, membunyikan/menjalin jari, menyingsingkan pakaian, tanpa sutrah, sadl, meludah ke kiblat, melihat ke langit, dll.", ar: "المكروهات." },
      { id: "Pembatal: tinggalkan syarat/rukun dengan sengaja, makan-minum, bicara, tertawa, banyak gerak dari selain jenis shalat, sengaja tambah rukun fi'li, lewatnya wanita/keledai/anjing hitam, bermakmum kepada yang tak sah imamnya.", ar: "المبطلات." },
      { id: "Sahwi: kurang → sebelum salam; lebih → sesudah; ragu + yakin → sebelum; ragu + tahharri → sesudah. Menambal wajib & sunnah, tidak rukun.", ar: "سجود السهو." },
      { id: "Jamaah: fardhu kifayah (rajih); imam menanggung 6 hal; mutaba'ah sunnah, musabaqah haram, musawah & takhalluf makruh; uzur: sakit, takut, menahan buang air, hujan, imam berlebihan.", ar: "الجماعة." },
      { id: "Jumat: wajib atas muslim mukallaf laki-laki merdeka tanpa uzur; sah dengan syarat shalat, jumlah, dan dua khutbah.", ar: "الجمعة." }
    ] }
  ],
  istilah: [
    { ar: "العبث", latin: "al-'abats", id: "'Abats", def: { id: "Banyak bergerak dan bermain dengan badan, jenggot, atau pakaian dalam shalat; makruh.", ar: "كثرة الحركة واللعب." } },
    { ar: "التخصر", latin: "at-takhashshur", id: "Takhashshur", def: { id: "Meletakkan tangan di pinggang saat shalat; makruh.", ar: "وضع اليد على الخاصرة." } },
    { ar: "السدل", latin: "as-sadl", id: "Sadl", def: { id: "Menaruh pakaian berlengan di bahu tanpa memakainya; makruh.", ar: "" } },
    { ar: "السترة", latin: "as-sutrah", id: "Sutrah", def: { id: "Pembatas di depan orang shalat; sutrah imam adalah sutrah makmum.", ar: "" } },
    { ar: "سجود السهو", latin: "sujud as-sahwi", id: "Sujud sahwi", def: { id: "Dua sujud untuk menambal kekurangan; sebabnya kurang, lebih, ragu.", ar: "" } },
    { ar: "التحري", latin: "at-tahharri", id: "Tahharri", def: { id: "Menimbang dugaan yang lebih kuat ketika ragu; sujudnya sesudah salam.", ar: "" } },
    { ar: "المتابعة", latin: "al-mutaba'ah", id: "Mutaba'ah", def: { id: "Mengikuti imam tepat setelah gerakannya; sunnah.", ar: "" } },
    { ar: "المسابقة", latin: "al-musabaqah", id: "Musabaqah", def: { id: "Mendahului imam; haram.", ar: "" } },
    { ar: "المسبوق", latin: "al-masbuq", id: "Masbuq", def: { id: "Makmum yang tertinggal sebagian rakaat.", ar: "" } }
  ],
  latihan: {
    pg: [
      { q: { id: "Seseorang shalat sambil memainkan jam tangan beberapa kali tanpa keperluan. Hukumnya…", ar: "العبث في الصلاة:" }, o: [
        { id: "Makruh, termasuk 'abats", ar: "مكروه؛ من العبث" },
        { id: "Membatalkan, karena gerak dari selain shalat", ar: "مبطل" },
        { id: "Mubah, selama ia tetap berdiri tegak", ar: "مباح" },
        { id: "Haram, tetapi shalatnya tetap sah", ar: "حرام مع الصحة" }], j: 0,
        b: { id: "'Abats (banyak bermain) makruh: \"tenanglah dalam shalat.\" Yang membatalkan adalah gerak **banyak** dari selain jenis shalat.", ar: "" } },
      { q: { id: "Seorang ayah shalat sunnah sambil menggendong anaknya; saat sujud diletakkan, saat berdiri digendong lagi. Shalatnya…", ar: "حمل الطفل في الصلاة:" }, o: [
        { id: "Sah, gerakannya sedikit dan ada contohnya", ar: "صحيحة؛ حركة قليلة لها أصل" },
        { id: "Batal, karena gerakan dari selain shalat", ar: "باطلة" },
        { id: "Sah hanya bila shalat yang dikerjakan sunnah", ar: "تصح في النفل فقط" },
        { id: "Makruh dan wajib ditutup sujud sahwi", ar: "مكروهة ويسجد للسهو" }], j: 0,
        b: { id: "Nabi ﷺ shalat sambil menggendong Umamah binti Zainab — gerak sedikit tidak membatalkan.", ar: "" } },
      { q: { id: "Makmum yang ingin mengingatkan imam yang lupa jumlah rakaat, menurut modul, sebaiknya…", ar: "تنبيه الإمام:" }, o: [
        { id: "Laki-laki bertasbih, wanita menepuk tangan", ar: "التسبيح للرجال والتصفيق للنساء" },
        { id: "Mengucapkan \"rakaatnya kurang\" dengan lirih", ar: "يكلمه بصوت خافت" },
        { id: "Diam saja lalu memberi tahu setelah salam", ar: "يسكت ثم يخبره بعد السلام" },
        { id: "Laki-laki menepuk tangan, wanita bertasbih", ar: "التصفيق للرجال والتسبيح للنساء" }], j: 0,
        b: { id: "Berbicara membatalkan walau demi kemaslahatan shalat; yang dibimbingkan: tasbih bagi laki-laki, tepuk tangan bagi wanita.", ar: "" } },
      { q: { id: "Seseorang lupa tasyahhud awal dan baru sadar setelah berdiri. Ia sujud sahwi…", ar: "نسي التشهد الأول:" }, o: [
        { id: "Sebelum salam, karena kurang", ar: "قبل السلام للنقص" },
        { id: "Sesudah salam, karena lebih", ar: "بعد السلام للزيادة" },
        { id: "Sesudah salam, karena ia ragu", ar: "بعد السلام للشك" },
        { id: "Tidak perlu, karena hanya sunnah", ar: "لا يسجد" }], j: 0,
        b: { id: "Hadits Ibnu Buhainah: Nabi ﷺ meninggalkan tasyahhud awal lalu sujud dua kali **sebelum salam**.", ar: "" } },
      { q: { id: "Imam salam setelah dua rakaat zhuhur, diingatkan, lalu menambah dua rakaat. Sujud sahwinya…", ar: "سلم عن ركعتين:" }, o: [
        { id: "Sesudah salam, karena ada tambahan salam", ar: "بعد السلام للزيادة" },
        { id: "Sebelum salam, karena rakaat kurang", ar: "قبل السلام للنقص" },
        { id: "Tidak perlu, karena sudah disempurnakan", ar: "لا يسجد" },
        { id: "Sebelum salam, karena ada keraguan", ar: "قبل السلام للشك" }], j: 0,
        b: { id: "Kisah Dzul-Yadain: tambahan tasyahhud dan salam setelah dua rakaat → sujud **sesudah salam**.", ar: "" } },
      { q: { id: "Seseorang lupa membaca Al-Fatihah di satu rakaat dan baru teringat setelah salam. Apakah cukup sujud sahwi?", ar: "نسي الفاتحة:" }, o: [
        { id: "Tidak, rukun harus didatangkan", ar: "لا؛ الركن يجب الإتيان به" },
        { id: "Ya, sujud sahwi menutup semuanya", ar: "نعم يجبره السهو" },
        { id: "Ya, asalkan dua kali sujud sahwi", ar: "نعم بسجدتين" },
        { id: "Ya, bila ia makmum di belakang imam", ar: "نعم إن كان مأمومًا" }], j: 0,
        b: { id: "Sujud sahwi menambal wajib dan sunnah, **tidak menambal rukun**: \"bila meninggalkan Al-Fatihah, tidak ditambal sujud sahwi.\"", ar: "ولا يجبر الركن بل يجب الإتيان به." } },
      { q: { id: "Menurut modul, hukum shalat berjamaah yang \"lebih condong jiwa kepadanya\" adalah…", ar: "حكم الجماعة الراجح:" }, o: [
        { id: "Fardhu kifayah", ar: "فرض كفاية" },
        { id: "Fardhu 'ain", ar: "فرض عين" },
        { id: "Sunnah muakkadah", ar: "سنة مؤكدة" },
        { id: "Syarat sahnya shalat", ar: "شرط صحة" }], j: 0,
        b: { id: "Pendapat Syafi'iyyah dan pilihan Syaikhul Islam.", ar: "" } },
      { q: { id: "Makmum mengucapkan takbiratul ihram persis bersamaan dengan imam. Akibatnya…", ar: "ساوى الإمام في تكبيرة الإحرام:" }, o: [
        { id: "Shalatnya tidak sah (tidak terakad)", ar: "لا تنعقد صلاته" },
        { id: "Makruh, tetapi shalatnya sah", ar: "مكروه وتصح" },
        { id: "Sunnah, karena menunjukkan semangat", ar: "سنة" },
        { id: "Sah, cukup diganti sujud sahwi", ar: "تصح ويسجد للسهو" }], j: 0,
        b: { id: "Musawah makruh pada gerakan lain, tetapi \"bila menyamai pada takbiratul ihram, shalatnya tidak terakad.\"", ar: "" } },
      { q: { id: "Mana yang BUKAN termasuk hal yang ditanggung imam dari makmum menurut modul?", ar: "ليس مما يتحمله الإمام:" }, o: [
        { id: "Takbiratul ihram makmum", ar: "تكبيرة الإحرام" },
        { id: "Sujud tilawah makmum", ar: "سجود التلاوة" },
        { id: "Sutrah bagi makmum", ar: "السترة" },
        { id: "Doa qunut makmum", ar: "دعاء القنوت" }], j: 0,
        b: { id: "Enam: Al-Fatihah masbuq, sujud sahwi, sujud tilawah, sutrah, qunut, tasyahhud awal masbuq. Takbiratul ihram adalah rukun yang wajib dilakukan makmum sendiri.", ar: "" } },
      { q: { id: "Imam masjid shalat 'isya' empat rakaat dalam dua menit tanpa thuma'ninah. Sikap yang dibenarkan modul…", ar: "إمام لا يطمئن:" }, o: [
        { id: "Boleh tidak shalat di belakangnya", ar: "يجوز ترك الصلاة خلفه" },
        { id: "Wajib tetap bermakmum demi jamaah", ar: "تجب الصلاة خلفه" },
        { id: "Bermakmum lalu sujud sahwi sendiri", ar: "يصلي خلفه ويسجد للسهو" },
        { id: "Bermakmum dan menegurnya dalam shalat", ar: "يصلي وينبهه بالكلام" }], j: 0,
        b: { id: "Imam yang memendekkan hingga merusak termasuk uzur: \"jangan shalat di belakang imam seperti ini, karena shalatnya cacat.\"", ar: "لا تصل خلف إمام كهذا." } },
      { q: { id: "Seorang musafir laki-laki dewasa tiba di kota pada hari Jumat. Menurut syarat wajib dalam modul…", ar: "المسافر والجمعة:" }, o: [
        { id: "Jumat tidak wajib atasnya", ar: "لا تجب عليه" },
        { id: "Jumat wajib atasnya seperti orang mukim", ar: "تجب عليه" },
        { id: "Ia wajib shalat zhuhur dan Jumat", ar: "يصلي الظهر والجمعة" },
        { id: "Jumat wajib bila ia membawa keluarga", ar: "تجب إن كان معه أهله" }], j: 0,
        b: { id: "Ibnul Mundzir: ijma' Jumat wajib atas orang merdeka, baligh, **mukim**, tanpa uzur — \"maka tidak wajib pula atas musafir.\"", ar: "فلا تجب أيضًا على المسافر." } }
    ],
    bs: [
      { t: { id: "Meninggalkan sunnah karena lupa termasuk makruh shalat.", ar: "" }, j: false, b: { id: "Yang makruh adalah meninggalkan **dengan sengaja**; karena lupa tidak apa-apa.", ar: "" } },
      { t: { id: "Menoleh dengan hati (melamun) juga termasuk menoleh yang makruh.", ar: "" }, j: true, b: { id: "\"Baik dengan mata, badan, maupun hati — semuanya makruh.\"", ar: "" } },
      { t: { id: "Tambahan ucapan (dzikir) di tempat yang bukan semestinya membatalkan shalat.", ar: "" }, j: false, b: { id: "Tambahan ucapan makruh, tidak membatalkan; yang membatalkan tambahan perbuatan (rukun fi'li).", ar: "" } },
      { t: { id: "Bila shalat imam tidak sah, shalat makmum juga tidak sah walau ia memenuhi rukun dan syarat.", ar: "" }, j: true, b: { id: "Pembatal kedelapan.", ar: "" } },
      { t: { id: "Menurut modul, sujud sahwi semuanya sebelum salam adalah satu-satunya cara yang sah.", ar: "" }, j: false, b: { id: "Perkaranya lapang: semua sebelum (Syafi'i) atau semua sesudah (Hanafiyyah) mencukupi; rincian lebih utama.", ar: "" } },
      { t: { id: "Mendahului imam hukumnya haram.", ar: "" }, j: true, b: { id: "Ancaman kepala keledai.", ar: "" } },
      { t: { id: "Hujan lebat dan angin kencang termasuk uzur meninggalkan jamaah.", ar: "" }, j: true, b: { id: "\"Shalatlah di tempat tinggal kalian.\"", ar: "" } },
      { t: { id: "Para ulama berijma' bahwa Jumat sah dengan empat puluh orang dan tidak kurang.", ar: "" }, j: false, b: { id: "Jumlahnya **diperselisihkan** antara tiga hingga empat puluh.", ar: "" } }
    ],
    jodoh: [
      { a: { id: "Kurang", ar: "النقص" }, b: { id: "Sujud sebelum salam", ar: "قبل السلام" } },
      { a: { id: "Lebih", ar: "الزيادة" }, b: { id: "Sujud sesudah salam", ar: "بعد السلام" } },
      { a: { id: "Ragu + tahharri", ar: "شك مع التحري" }, b: { id: "Sujud sesudah salam", ar: "بعد السلام" } },
      { a: { id: "Musabaqah", ar: "المسابقة" }, b: { id: "Haram", ar: "حرام" } },
      { a: { id: "Mutaba'ah", ar: "المتابعة" }, b: { id: "Sunnah", ar: "سنة" } },
      { a: { id: "Menoleh dalam shalat", ar: "الالتفات" }, b: { id: "Curian setan", ar: "اختلاس الشيطان" } },
      { a: { id: "Tasybik", ar: "التشبيك" }, b: { id: "Shalat orang yang dimurkai", ar: "صلاة المغضوب عليهم" } }
    ],
    pilah: { t: { id: "Pilah: MAKRUH atau MEMBATALKAN shalat (bila disengaja)?", ar: "صنف: مكروه أم مبطل؟" }, kategori: [{ id: "Makruh", ar: "مكروه" }, { id: "Membatalkan", ar: "مبطل" }], item: [
      { t: { id: "Menguap", ar: "التثاؤب" }, k: 0 },
      { t: { id: "Membunyikan jari", ar: "فرقعة الأصابع" }, k: 0 },
      { t: { id: "Melihat ke langit", ar: "رفع البصر" }, k: 0 },
      { t: { id: "Shalat tanpa sutrah", ar: "ترك السترة" }, k: 0 },
      { t: { id: "Tangan di pinggang", ar: "التخصر" }, k: 0 },
      { t: { id: "Minum seteguk", ar: "الشرب" }, k: 1 },
      { t: { id: "Tertawa bersuara", ar: "الضحك" }, k: 1 },
      { t: { id: "Menambah satu rukuk", ar: "زيادة ركوع" }, k: 1 },
      { t: { id: "Menjawab telepon", ar: "الكلام" }, k: 1 }
    ] },
    isian: [
      { t: { id: "Sujud sahwi menambal wajib dan sunnah, tetapi tidak menambal ______.", ar: "ولا يجبر ______." }, j: { id: "rukun", ar: "الركن" }, x: [{ id: "makruh", ar: "المكروه" }, { id: "syarat jamaah", ar: "شرط الجماعة" }, { id: "doa", ar: "الدعاء" }] },
      { t: { id: "Bila ragu tanpa dugaan kuat, bangunlah di atas ______ yaitu jumlah yang lebih sedikit.", ar: "يبني على ______." }, j: { id: "yakin", ar: "اليقين" }, x: [{ id: "dugaan", ar: "الظن" }, { id: "kebiasaan", ar: "العادة" }, { id: "imam", ar: "الإمام" }] },
      { t: { id: "\"Sutrah imam adalah sutrah bagi ______ di belakangnya.\"", ar: "سترة لمن ______." }, j: { id: "makmum", ar: "خلفه" }, x: [{ id: "muadzin", ar: "المؤذن" }, { id: "masbuq saja", ar: "المسبوق" }, { id: "wanita", ar: "النساء" }] }
    ]
  }
});

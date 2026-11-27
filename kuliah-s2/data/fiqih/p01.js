/* Fiqih Ibadah — Pertemuan 1: Pengantar Fiqih, Kitab Thaharah, Bab Air, Bab Bejana, Bab Qadha' al-Hajah */
Kuliah.pertemuan("fiqih", {
  no: 1, motif: "sumber", motifOpt: { items: ["المياه", "الآنية", "قضاء الحاجة", "الوضوء", "الغسل"], lbl: "كتاب الطهارة" }, tema: 3, durasi: 30,
  bab: { id: "Thaharah: air, bejana & adab buang hajat", ar: "الطهارة: المياه والآنية وقضاء الحاجة" },
  judul: { id: "Pengantar Fiqih, Bab Air, Bab Bejana, dan Bab Buang Hajat", ar: "مقدمة الفقه، وباب المياه، وباب الآنية، وباب قضاء الحاجة" },
  ringkas: {
    id: "Makna fiqih (bahasa & istilah) dan lima hukum taklifi; definisi thaharah, hadats dan khabats; peta Kitab Thaharah; **Bab Air**: tiga macam air (thahur, thahir, najis) beserta hukumnya; **Bab Bejana**: lima dhabit (bejana emas–perak, bejana orang kafir, tulang bangkai, kulit bangkai yang disamak, menutup bejana); **Bab Qadha' al-Hajah**: enam hal yang haram, empat yang makruh, dan adab-adab yang disunnahkan.",
    ar: "معنى الفقه لغة واصطلاحًا والأحكام التكليفية الخمسة، وتعريف الطهارة والحدث والخبث، وترتيب كتاب الطهارة، ثم باب المياه وأقسامها الثلاثة، وباب الآنية وضوابطه الخمسة، وباب قضاء الحاجة: ما يحرم وما يكره وما يستحب."
  },
  tujuan: [
    { id: "Membedakan makna fiqih secara bahasa dan istilah, serta menyebut lima hukum taklifi.", ar: "التفريق بين معنى الفقه لغة واصطلاحًا، وذكر الأحكام التكليفية الخمسة." },
    { id: "Menjelaskan definisi thaharah, hadats, dan khabats, lalu menurunkan konsekuensinya.", ar: "بيان تعريف الطهارة والحدث والخبث وما يترتب عليه." },
    { id: "Mengklasifikasikan air ke dalam thahur, thahir, atau najis berdasarkan kasus nyata.", ar: "تصنيف المياه إلى طهور وطاهر ونجس في الصور الواقعية." },
    { id: "Menguraikan lima dhabit bab bejana lengkap dengan dalil dan pendapat yang rajih.", ar: "شرح ضوابط باب الآنية الخمسة بأدلتها والراجح فيها." },
    { id: "Memilah adab buang hajat menjadi haram, makruh, dan mustahab beserta dalilnya.", ar: "تقسيم آداب قضاء الحاجة إلى محرم ومكروه ومستحب بأدلتها." }
  ],
  isi: [
    { t: "pembuka", id: "Pertemuan pertama mata kuliah **Fiqih Ibadah** membuka kitab **Bidayah al-Mutafaqqih** karya Syaikh Wahid bin 'Abdussalam Bali, dengan penjelasan dari syarahnya *Raudhah al-Mutanazzah fi Syarh Bidayah al-Mutafaqqih*. Dosen pengampu: **Syaikh Aiman Musa**. Pembahasan semester ini dikhususkan pada **fiqih ibadah**, dimulai dari Kitab Thaharah.", ar: "افتتح الشيخ أيمن موسى مادة فقه العبادات بشرح كتاب «بداية المتفقه» للشيخ وحيد بن عبد السلام بالي، مع الاستفادة من شرحه «روضة المتنزه في شرح بداية المتفقه»، مبتدئًا بكتاب الطهارة." },

    { t: "judul", id: "Pengantar: Apa Itu Fiqih?", ar: "مقدمة: ما الفقه؟" },
    { t: "definisi", judul: { id: "Al-Fiqh", ar: "الفقه" },
      lughah: { id: "**Al-fahm** — pemahaman.", ar: "الفهم." },
      istilah: { id: "**Mengetahui hukum-hukum syar'i dari dalil-dalilnya yang terperinci.**", ar: "معرفة الأحكام الشرعية من أدلتها التفصيلية." } },
    { t: "ayat", ar: "قَالُوا يَا شُعَيْبُ مَا نَفْقَهُ كَثِيرًا مِّمَّا تَقُولُ", id: "Mereka berkata, \"Wahai Syu'aib, kami tidak banyak *memahami* apa yang engkau katakan.\" — dalil makna bahasa: *naf-qahu* = kami pahami.", src: "QS. Hud: 91" },
    { t: "hadits", ar: "مَنْ يُرِدِ اللَّهُ بِهِ خَيْرًا يُفَقِّهْهُ فِي الدِّينِ", id: "Siapa yang Allah kehendaki kebaikan baginya, Allah jadikan ia paham dalam agama.", src: "Muttafaq 'alaih" },
    { t: "hadits", ar: "اللَّهُمَّ فَقِّهْهُ فِي الدِّينِ وَعَلِّمْهُ التَّأْوِيلَ", id: "Doa Nabi ﷺ untuk Ibnu 'Abbas: Ya Allah, pahamkanlah ia dalam agama dan ajarkan kepadanya takwil.", src: "HR. Ahmad" },
    { t: "hukum", judul: { id: "Lima hukum taklifi", ar: "الأحكام التكليفية الخمسة" }, item: [
      { h: "wajib", judul: { id: "Wajib", ar: "الواجب" }, id: "Dituntut dikerjakan secara pasti: pelakunya diberi pahala, yang meninggalkannya berhak dihukum.", ar: "ما طُلب فعله على وجه الحتم والإلزام." },
      { h: "sunnah", judul: { id: "Mustahab", ar: "المستحب" }, id: "Diperintahkan syariat tetapi **tidak** dengan cara pasti dan mengikat.", ar: "ما أمر به الشارع لا على سبيل الحتم والإلزام." },
      { h: "mubah", judul: { id: "Mubah", ar: "المباح" }, id: "Pilihan antara mengerjakan dan meninggalkan: tidak berpahala dan tidak berdosa — **kecuali bila disertai niat** (baik).", ar: "التخيير بين الفعل والترك؛ فلا يثاب فاعله ولا يعاقب تاركه إلا إذا قُرن بالنية." },
      { h: "makruh", judul: { id: "Makruh", ar: "المكروه" }, id: "Dilarang tetapi tidak dengan cara pasti: yang meninggalkannya karena patuh diberi pahala, pelakunya tidak dihukum.", ar: "ما نهى عنه الشارع لا على سبيل الحتم والإلزام." },
      { h: "haram", judul: { id: "Haram", ar: "الحرام" }, id: "Dituntut ditinggalkan secara pasti: yang meninggalkannya karena patuh diberi pahala, pelakunya berhak dihukum.", ar: "ما طلب الشارع الكف عنه على وجه الحتم واللزوم." }
    ] },
    { t: "catatan", gaya: "faidah", judul: { id: "Kunci belajar fiqih", ar: "مفتاح الفقه" }, id: "Bila engkau berkata \"perkara ini wajib\", dua pertanyaan harus selalu siap dijawab: **mengapa?** dan **apa dalilnya?** Inilah yang membedakan fiqih dari sekadar hafalan hukum — sesuai definisinya: hukum *dari dalil-dalilnya yang terperinci*.", ar: "إذا قلت: هذا الأمر واجب، فاسأل: لماذا؟ وما الدليل على ذلك؟" },

    { t: "judul", id: "Kitab Thaharah: Definisi & Peta Bab", ar: "كتاب الطهارة: التعريف وترتيب الأبواب" },
    { t: "definisi", judul: { id: "Ath-Thaharah", ar: "الطهارة" },
      lughah: { id: "Kebersihan dan kesucian dari kotoran (*al-aqdzar*).", ar: "النزاهة والنظافة عن الأقذار." },
      istilah: { id: "**Mengangkat hadats dan menghilangkan khabats.**", ar: "رفع الحدث وزوال الخبث." } },
    { t: "banding", judul: { id: "Dua objek thaharah", ar: "الحدث والخبث" },
      kiri: { judul: { id: "Hadats", ar: "الحدث" }, ikon: "user", warna: "green", poin: [
        { id: "Sifat yang melekat pada badan", ar: "وصف قائم بالبدن" },
        { id: "Menghalangi shalat dan semisalnya", ar: "مانع من الصلاة ونحوها" },
        { id: "Diangkat dengan wudhu, mandi, atau tayammum", ar: "يُرفع بالوضوء أو الغسل أو التيمم" } ] },
      kanan: { judul: { id: "Khabats", ar: "الخبث" }, ikon: "waves", warna: "amber", poin: [
        { id: "Najis (benda kotor menurut syariat)", ar: "النجاسة" },
        { id: "Bisa mengenai badan, pakaian, atau tempat", ar: "تكون على البدن أو الثوب أو المكان" },
        { id: "Dihilangkan (*zawal*), bukan \"diangkat\"", ar: "يُزال" } ] } },
    { t: "langkah", judul: { id: "Logika urutan bab-bab Kitab Thaharah", ar: "ترتيب أبواب كتاب الطهارة" }, item: [
      { judul: { id: "Air", ar: "المياه" }, id: "Asal thaharah — maka dimulai dengan air.", ar: "أصل الطهارة." },
      { judul: { id: "Bejana", ar: "الآنية" }, id: "Air diletakkan di dalam wadah.", ar: "يوضع في الإناء." },
      { judul: { id: "Buang hajat & istinja'", ar: "قضاء الحاجة والاستنجاء" }, id: "Sebelum wudhu, seseorang menunaikan hajatnya lalu beristinja'.", ar: "ثم قبل الوضوء الاستنجاء." },
      { judul: { id: "Wudhu", ar: "الوضوء" }, id: "Dimulai dengan **siwak** dan diakhiri dengan **mengusap khuff**.", ar: "فيبدأ بالسواك وينتهي بالمسح على الخفين." },
      { judul: { id: "Pembatal wudhu", ar: "نواقض الوضوء" }, id: "Apa saja yang merusak wudhu.", ar: "ثم ما ينقض الوضوء." },
      { judul: { id: "Mandi", ar: "الغسل" }, id: "Bila terjadi sesuatu yang mewajibkan mandi.", ar: "ثم إذا أوجب شيئًا الغسل." },
      { judul: { id: "Tayammum & najis", ar: "التيمم والنجاسات" }, id: "Bila air tidak dapat dipakai, ia bertayammum; atau ia bersiap lalu mendapati najis.", ar: "ثم قد يتعذر استعمال الماء فيتيمم أو يجد نجاسة." },
      { judul: { id: "Darah wanita", ar: "أحكام الدماء" }, id: "Ditutup dengan hukum-hukum darah (haidh dan semisalnya).", ar: "ونختم بأحكام الدماء عند النساء." }
    ] },

    { t: "judul", id: "Bab Air (Bab al-Miyah)", ar: "باب المياه" },
    { t: "p", id: "*Al-bab* adalah pintu masuk menuju sesuatu dan tanda yang menunjukkannya; *al-miyah* bentuk jamak dari *ma'* (air). Yang dimaksud di sini: **hukum-hukum yang berkaitan dengan air dari sisi suci dan najisnya.**", ar: "الباب: المدخل إلى الشيء والعلامة التي تدل عليه، والمياه: جمع ماء، والمراد: الأحكام المتعلقة بالماء من حيث الطهارة والنجاسة." },
    { t: "kutipan", ar: "باب المياه، وفيه ضابطٌ واحد: أقسام المياه ثلاثة: طهورٌ، وطاهرٌ، ونجسٌ.", id: "Bab Air, berisi satu dhabit: air ada tiga macam — thahur, thahir, dan najis.", oleh: { id: "Bidayah al-Mutafaqqih", ar: "بداية المتفقه" } },
    { t: "khilaf", masalah: { id: "Berapa pembagian air?", ar: "كم أقسام المياه؟" }, pendapat: [
      { siapa: { id: "Sebagian ulama", ar: "بعض العلماء" }, isi: { id: "Dua: thahur dan najis.", ar: "قسمان: طهور ونجس." } },
      { siapa: { id: "Pendapat yang dipilih penulis", ar: "ما اختاره المصنف" }, isi: { id: "Tiga: thahur, thahir, dan najis.", ar: "ثلاثة: طهور وطاهر ونجس." }, rajih: true }
    ], alasan: { id: "Dosen menyebut pembagian tiga sebagai **pendapat yang paling kuat** (*arjah aqwal ahl al-'ilm*).", ar: "هذا على أرجح أقوال أهل العلم." } },
    { t: "tabel", judul: { id: "Tiga macam air sekaligus hukumnya", ar: "أقسام المياه وأحكامها" }, kolom: [{ id: "Macam", ar: "القسم" }, { id: "Definisi", ar: "التعريف" }, { id: "Hukum", ar: "الحكم" }], baris: [
      [{ id: "**Thahur**", ar: "طهور" }, { id: "Air yang tetap pada sifat asal ciptaannya — turun dari langit atau memancar dari bumi (sumur, sungai, hujan, mata air, laut).", ar: "الباقي على خلقته، سواء نزل من السماء أو نبع من الأرض." }, { id: "Mengangkat hadats **dan** menghilangkan khabats.", ar: "يرفع الحدث ويزيل الخبث." }],
      [{ id: "**Thahir**", ar: "طاهر" }, { id: "Air yang bercampur benda suci hingga keluar dari kemutlakannya: **namanya berubah** (teh, kuah, rebusan hulbah) atau **menjadi terikat** (air mawar, air misk).", ar: "ما خالطه شيء طاهر فأخرجه عن إطلاقه أو غير اسمه." }, { id: "**Tidak** mengangkat hadats, tetapi **boleh** menghilangkan najis.", ar: "لا يرفع الحدث لكنه يزيل الخبث." }],
      [{ id: "**Najis**", ar: "نجس" }, { id: "Air yang bercampur najis lalu **salah satu sifatnya** (rasa, warna, atau bau) berubah.", ar: "ما خالطته نجاسة فغيرت أحد أوصافه." }, { id: "Tidak mengangkat hadats, tidak menghilangkan najis; tidak boleh dipakai **kecuali darurat** (takut binasa).", ar: "لا يرفع حدثًا ولا يزيل خبثًا، ولا يستعمل إلا عند الضرورة." }]
    ] },
    { t: "ayat", ar: "وَأَنزَلْنَا مِنَ السَّمَاءِ مَاءً طَهُورًا", id: "Dan Kami turunkan dari langit air yang suci lagi menyucikan.", src: "QS. Al-Furqan: 48" },
    { t: "hadits", ar: "هُوَ الطَّهُورُ مَاؤُهُ، الْحِلُّ مَيْتَتُهُ", id: "Ketika ditanya tentang air laut, Nabi ﷺ bersabda: \"Laut itu suci airnya (dan halal bangkainya).\" — maka boleh berwudhu dan mandi dengannya.", src: "HR. Abu Dawud, at-Tirmidzi" },
    { t: "contoh", judul: { id: "Kasus: kapan air berubah status?", ar: "صور تطبيقية" }, sorot: [
      { label: { id: "Air sumur yang tawar atau asin", ar: "ماء البئر عذبًا أو ملحًا" }, warna: "hijau", id: "**Thahur.** Asin atau tawar tidak memengaruhi — air tetap cair, bening, pada asal ciptaannya.", ar: "طهور؛ الماء سائل شفاف ولو كان مالحًا أو عذبًا." },
      { label: { id: "Air direbus bersama daun teh", ar: "الماء يغلى مع الشاي" }, warna: "biru", id: "**Thahir.** Ia berpindah dari nama \"air\" ke nama lain (\"ini teh\").", ar: "طاهر؛ انتقل من مسمى الماء إلى مسمى آخر." },
      { label: { id: "Air diberi wewangian mawar", ar: "ماء الورد" }, warna: "biru", id: "**Thahir.** Ia menjadi air yang terikat (*ma' ward*), tidak lagi air mutlak.", ar: "طاهر؛ صار مقيدًا." },
      { label: { id: "Air yang baunya berubah karena bangkai", ar: "ماء تغير ريحه بنجاسة" }, warna: "merah", id: "**Najis**, sedikit maupun banyak — berdasarkan ijma'.", ar: "نجس قليلًا كان أو كثيرًا بالإجماع." }
    ] },
    { t: "atsar", ar: "وأجمعوا على أن الوضوء لا يجوز بماء الورد، وماء الشجر، وماء العصفر، ولا تجوز الطهارة إلا بماءٍ مطلقٍ يقع عليه اسم الماء", id: "Ulama berijma' bahwa wudhu tidak sah dengan air mawar, air pohon, dan air 'ushfur; thaharah hanya sah dengan **air mutlak** yang disebut \"air\".", src: "Ibnul Mundzir" },
    { t: "atsar", ar: "وأجمعوا على أن الماء القليل والكثير إذا وقعت فيه نجاسة فغيرت الماء طعمًا أو لونًا أو ريحًا؛ أنه ينجس ما دام كذلك", id: "Ulama berijma': air sedikit maupun banyak yang kemasukan najis lalu berubah rasa, warna, atau baunya, menjadi najis selama keadaannya demikian.", src: "Ibnul Mundzir" },
    { t: "catatan", gaya: "tanbih", judul: { id: "Bedakan dua jenis perubahan", ar: "تنبيه" }, id: "Najis cukup mengubah **satu sifat** saja untuk membuat air najis. Adapun campuran benda **suci** baru memengaruhi bila **mengeluarkan air dari kemutlakannya** (berganti nama atau menjadi terikat). Jangan menyamakan keduanya.", ar: "فرق بين النجاسة التي تغير أحد الأوصاف، والطاهر الذي يخرج الماء عن إطلاقه." },
    { t: "cek", q: { id: "Air sungai keruh karena lumpur, tetapi orang tetap menyebutnya \"air sungai\". Statusnya…", ar: "ماء نهر تعكر بالطين ولا يزال يسمى ماء:" }, o: [{ id: "Thahur, karena masih air mutlak", ar: "طهور لبقائه على إطلاقه" }, { id: "Thahir, karena warnanya berubah", ar: "طاهر لتغير لونه" }, { id: "Najis, karena warnanya berubah", ar: "نجس لتغير لونه" }, { id: "Makruh dipakai dan tidak sah", ar: "مكروه لا تصح به الطهارة" }], j: 0, b: { id: "Ukuran thahir adalah **keluar dari kemutlakan** (nama berganti/terikat), bukan sekadar berubah warna. Lumpur bukan najis, dan namanya tetap \"air\".", ar: "العبرة بخروج الماء عن إطلاقه، لا بمجرد تغير اللون." } },

    { t: "judul", id: "Bab Bejana (Bab al-Aniyah): Lima Dhabit", ar: "باب الآنية: خمسة ضوابط" },
    { t: "p", id: "Setelah ada air, ia butuh wadah untuk menampungnya — karena itu para fuqaha menyebut bab bejana setelah bab air. *Al-aniyah* bentuk jamak dari *ina'*: wadah tempat air diletakkan. **Hukum asal bejana adalah halal dan mubah.**", ar: "الآنية جمع إناء: الوعاء الذي يوضع فيه الماء، والأصل في الآنية الحل والإباحة." },
    { t: "ayat", ar: "هُوَ الَّذِي خَلَقَ لَكُم مَّا فِي الْأَرْضِ جَمِيعًا", id: "Dialah yang menciptakan untuk kalian segala yang ada di bumi.", src: "QS. Al-Baqarah: 29" },
    { t: "hukum", judul: { id: "Lima dhabit bab bejana", ar: "ضوابط باب الآنية" }, item: [
      { h: "mubah", judul: { id: "Dhabit 1 — semua bejana boleh, kecuali emas & perak", ar: "يباح استعمال كل الآنية إلا الذهب والفضة" }, id: "Besar–kecil, murah–mahal, semuanya boleh, karena kata **\"kull\"** termasuk lafaz umum. Dikecualikan bejana emas dan perak: **haram** (makan, minum, dan penggunaan lain).", ar: "لأن كلمة «كل» من ألفاظ العموم." },
      { h: "mubah", judul: { id: "Dhabit 2 — bejana orang kafir suci", ar: "آنية الكفار طاهرة" }, id: "Suci **selama tidak diketahui** mereka memakainya untuk najis. Bila mereka biasa memakai najis (khamr, babi), wajib dicuci sebelum dipakai; bila dugaan kuat tidak, boleh dipakai tanpa dicuci.", ar: "ما لم يعلم أنهم يستخدمونها في نجاسة." },
      { h: "mubah", judul: { id: "Dhabit 3 — tulang, tanduk, kuku, kuku kaki hewan, rambut, bulu wol, dan bulu sayap bangkai: suci", ar: "عظم الميتة وقرنها وظفرها وحافرها وشعرها وصوفها وريشها طاهر" }, id: "Boleh dimanfaatkan. Az-Zuhri: ulama salaf bersisir dan memakai minyak dari tulang bangkai seperti gading gajah.", ar: "يجوز الانتفاع بها." },
      { h: "mubah", judul: { id: "Dhabit 4 — kulit bangkai suci dengan disamak, kecuali anjing & babi", ar: "جميع جلود الميتات تطهر بالدباغ إلا الكلب والخنزير" }, id: "Berdasarkan hadits \"Kulit apa pun yang disamak, ia telah suci.\" Anjing dan babi dikecualikan karena **zatnya najis**.", ar: "إلا الكلب والخنزير لنجاسة عينهما." },
      { h: "sunnah", judul: { id: "Dhabit 5 — menutup bejana, mengikat tempat air, menutup pintu, menyebut nama Allah ketika tidur", ar: "يسن تغطية الآنية وإيكاء الأسقية وإغلاق الأبواب" }, id: "Adab-adab nabawi yang disunnahkan.", ar: "جملة من الآداب النبوية." }
    ] },
    { t: "hadits", ar: "لَا تَشْرَبُوا فِي آنِيَةِ الذَّهَبِ وَالْفِضَّةِ، وَلَا تَأْكُلُوا فِي صِحَافِهَا؛ فَإِنَّهَا لَهُمْ فِي الدُّنْيَا وَلَكُمْ فِي الْآخِرَةِ", id: "Jangan minum dengan bejana emas dan perak, dan jangan makan dengan piringnya; sungguh itu untuk mereka (orang kafir) di dunia dan untuk kalian di akhirat.", src: "Muttafaq 'alaih, dari Hudzaifah" },
    { t: "hadits", ar: "الَّذِي يَشْرَبُ فِي آنِيَةِ الْفِضَّةِ إِنَّمَا يُجَرْجِرُ فِي بَطْنِهِ نَارَ جَهَنَّمَ", id: "Orang yang minum dari bejana perak, sesungguhnya ia sedang menenggak api Jahannam ke dalam perutnya.", src: "Muttafaq 'alaih, dari Ummu Salamah" },
    { t: "kutipan", ar: "ولا خلاف بين أصحابنا في أن استعمال آنية الذهب والفضة حرام، وهو مذهب أبي حنيفة ومالك والشافعي، ولا أعلم فيه خلافًا", id: "Tidak ada perbedaan di kalangan sahabat kami (Hanabilah) bahwa memakai bejana emas dan perak haram; itu juga mazhab Abu Hanifah, Malik, dan asy-Syafi'i — aku tidak mengetahui ada khilaf.", oleh: { id: "Ibnu Qudamah", ar: "ابن قدامة" } },
    { t: "catatan", gaya: "tanbih", judul: { id: "Bejana dari tulang & kulit manusia", ar: "آنية من عظم الآدمي" }, id: "Sebagian ulama menegaskan: **tidak boleh** memakai bejana dari tulang atau kulit manusia, karena manusia terhormat sebelum dan sesudah mati. Nabi ﷺ bersabda: *\"Mematahkan tulang mayit seperti mematahkannya ketika hidup.\"*", ar: "لا يجوز استعمال آنية من عظم الآدمي وجلده؛ لأن الآدمي له حرمة قبل الموت وبعده." },
    { t: "hadits", ar: "يَا رَسُولَ اللَّهِ، إِنَّا بِأَرْضِ قَوْمٍ أَهْلِ كِتَابٍ، أَفَنَأْكُلُ فِي آنِيَتِهِمْ؟ قَالَ: لَا تَأْكُلُوا فِيهَا، إِلَّا أَلَّا تَجِدُوا غَيْرَهَا فَاغْسِلُوهَا وَكُلُوا فِيهَا", id: "Abu Tsa'labah al-Khusyani: \"Kami tinggal di negeri Ahli Kitab, bolehkah kami makan dengan bejana mereka?\" Beliau menjawab: \"Jangan makan dengannya, kecuali jika kalian tidak mendapat yang lain; cucilah lalu makanlah dengannya.\"", src: "Muttafaq 'alaih" },
    { t: "p", id: "Di sisi lain, **Nabi ﷺ berwudhu dari wadah air (*mazadah*) milik seorang wanita musyrik.** Dari dua dalil ini ulama menjelaskan: bila mereka biasa memakai najis, cuci dulu; bila dugaan kuat tidak, boleh tanpa dicuci.", ar: "وثبت أن النبي ﷺ توضأ من مزادة امرأة مشركة." },
    { t: "khilaf", masalah: { id: "Tulang bangkai (gading gajah dan semisalnya): suci atau najis?", ar: "عظم الميتة: طاهر أم نجس؟" }, pendapat: [
      { siapa: { id: "Riwayat kedua dari Imam Ahmad, satu pendapat dalam mazhab Malik, dan pendapat Abu Hanifah; dirajihkan Syaikhul Islam", ar: "الرواية الثانية عن أحمد، وقول في مذهب مالك، وقول أبي حنيفة، ورجحه شيخ الإسلام" }, isi: { id: "Suci; boleh dimanfaatkan.", ar: "طاهر يجوز الانتفاع به." }, rajih: true }
    ], alasan: { id: "Dosen: **\"Inilah pendapat yang benar.\"** Didukung atsar az-Zuhri tentang ulama salaf yang memakai sisir dan wadah minyak dari tulang bangkai.", ar: "قال الشيخ: وهذا القول هو الصواب." } },
    { t: "hadits", ar: "إِذَا دُبِغَ الْإِهَابُ فَقَدْ طَهُرَ", id: "Apabila kulit (bangkai) telah disamak, maka ia telah suci. — Dalam riwayat lain: *\"Kulit mana pun yang disamak, sungguh telah suci.\"*", src: "HR. Muslim, dari Ibnu 'Abbas" },
    { t: "hadits", ar: "هَلَّا انْتَفَعْتُمْ بِجِلْدِهَا؟ قَالُوا: إِنَّهَا مَيْتَةٌ، قَالَ: إِنَّمَا حَرُمَ أَكْلُهَا", id: "Nabi ﷺ melewati kambing mati milik maula Maimunah: \"Mengapa tidak kalian manfaatkan kulitnya?\" Mereka berkata: \"Itu bangkai.\" Beliau bersabda: \"Yang diharamkan hanyalah memakannya.\"", src: "Muttafaq 'alaih" },
    { t: "catatan", gaya: "info", judul: { id: "Kata at-Tirmidzi", ar: "قال الترمذي" }, id: "Mayoritas ulama mengamalkan hadits ini: kulit bangkai yang telah disamak menjadi suci. Pengecualian anjing dan babi adalah **masalah khilafiyah**; penulis mengecualikannya karena keduanya najis zatnya.", ar: "والعمل على هذا عند أكثر أهل العلم، واستثناء الكلب والخنزير محل خلاف." },
    { t: "hadits", ar: "غَطُّوا الْإِنَاءَ، وَأَوْكُوا السِّقَاءَ؛ فَإِنَّ فِي السَّنَةِ لَيْلَةً يَنْزِلُ فِيهَا وَبَاءٌ، لَا يَمُرُّ بِإِنَاءٍ لَيْسَ عَلَيْهِ غِطَاءٌ، أَوْ سِقَاءٍ لَيْسَ عَلَيْهِ وِكَاءٌ، إِلَّا نَزَلَ فِيهِ مِنْ ذَلِكَ الْوَبَاءِ", id: "Tutuplah bejana dan ikatlah tempat air; sesungguhnya dalam setahun ada satu malam turun wabah, tidaklah ia melewati bejana tanpa tutup atau tempat air tanpa ikatan, melainkan wabah itu masuk ke dalamnya.", src: "HR. Muslim, dari Jabir" },
    { t: "hadits", ar: "أَغْلِقُوا الْأَبْوَابَ وَاذْكُرُوا اسْمَ اللَّهِ؛ فَإِنَّ الشَّيْطَانَ لَا يَفْتَحُ بَابًا مُغْلَقًا", id: "Tutuplah pintu-pintu dan sebutlah nama Allah, karena setan tidak membuka pintu yang tertutup. — Juga: *\"Ikatlah tempat airmu dan sebut nama Allah, tutuplah bejanamu dan sebut nama Allah, walaupun hanya dengan melintangkan sebatang kayu di atasnya.\"*", src: "Muttafaq 'alaih, dari Jabir" },
    { t: "definisi", judul: { id: "Al-Wika'", ar: "الوكاء" }, lughah: { id: "Tali pengikat. Segala wadah yang mulutnya diikat: ikatannya disebut *wika'*, wadahnya *siqa'*.", ar: "الرباط؛ كل ما يربط فمه فهو وكاء وسقاء." } },

    { t: "judul", id: "Bab Qadha' al-Hajah (Adab Buang Hajat)", ar: "باب قضاء الحاجة" },
    { t: "p", id: "Bab yang menghimpun hukum-hukum buang hajat dan perkara yang semestinya dijauhi atau dikerjakan seorang muslim. Berisi **tiga dhabit**: (1) yang **haram** — enam, (2) yang **makruh** — empat, (3) yang **mustahab**.", ar: "الباب الجامع لأحكام قضاء الحاجة، وفيه ثلاثة ضوابط: ما يحرم، وما يكره، وما يستحب." },
    { t: "hukum", judul: { id: "Enam hal yang HARAM ketika buang hajat", ar: "ما يحرم أثناء قضاء الحاجة (ستة)" }, item: [
      { h: "haram", judul: { id: "1. Menghadap atau membelakangi kiblat tanpa penghalang", ar: "استقبال القبلة واستدبارها بلا حائل" }, id: "Yakni di padang terbuka. Di dalam bangunan dikecualikan.", ar: "أي في الصحراء والخلاء." },
      { h: "haram", judul: { id: "2. Di jalan umum, tempat berteduh, dan sumber air manusia", ar: "في قارعة الطريق والظل وموارد الناس" }, id: "Jalan yang dilalui orang, naungan yang dimanfaatkan, atau tempat orang mengambil air dan duduk-duduk.", ar: "طريق مسلوك، أو ظل ينتفع به، أو مكان يرده الناس." },
      { h: "haram", judul: { id: "3. Di tengah kuburan", ar: "وسط القبور" }, id: "Disamakan oleh Nabi ﷺ dengan buang hajat di tengah pasar — dan membuka aurat di hadapan manusia haram berdasarkan kesepakatan.", ar: "كالذي يبول وسط الناس في السوق." },
      { h: "haram", judul: { id: "4. Di air yang diam (tergenang)", ar: "في الماء الراكد" }, id: "\"Nabi ﷺ melarang kencing di air yang tergenang.\"", ar: "نهى أن يبال في الماء الراكد." },
      { h: "haram", judul: { id: "5. Di dalam masjid", ar: "في المسجد" }, id: "Masjid hanya untuk dzikir, shalat, dan membaca Al-Qur'an.", ar: "إنما هي لذكر الله والصلاة وقراءة القرآن." },
      { h: "haram", judul: { id: "6. Beristinja' dengan kotoran hewan, tulang, atau makanan", ar: "الاستنجاء بروث أو عظم أو طعام" }, id: "Tulang adalah makanan jin dan kotoran hewan adalah makanan hewan tunggangan mereka — \"makanan saudara kalian\".", ar: "فإنهما طعام إخوانكم." }
    ] },
    { t: "hadits", ar: "إِذَا أَتَيْتُمُ الْغَائِطَ فَلَا تَسْتَقْبِلُوا الْقِبْلَةَ وَلَا تَسْتَدْبِرُوهَا، وَلَكِنْ شَرِّقُوا أَوْ غَرِّبُوا", id: "Apabila kalian mendatangi tempat buang hajat, janganlah menghadap kiblat dan jangan membelakanginya, tetapi menghadaplah ke timur atau ke barat (bagi penduduk Madinah).", src: "Muttafaq 'alaih, dari Abu Ayyub" },
    { t: "khilaf", masalah: { id: "Menghadap/membelakangi kiblat ketika buang hajat", ar: "استقبال القبلة واستدبارها عند قضاء الحاجة" }, pendapat: [
      { siapa: { id: "Zhahir hadits Abu Ayyub", ar: "ظاهر حديث أبي أيوب" }, isi: { id: "Terlarang mutlak — di padang terbuka maupun di bangunan. Abu Ayyub: \"Kami mendapati WC di Syam dibangun menghadap kiblat, maka kami berpaling dan memohon ampun kepada Allah.\"", ar: "لا يجوز لا في الصحراء ولا في البنيان." } },
      { siapa: { id: "Pendapat yang rajih (dari empat pendapat)", ar: "الراجح من أربعة أقوال" }, isi: { id: "**Haram di padang terbuka, boleh di dalam bangunan.**", ar: "لا يجوز في الخلاء، ويجوز في البنيان." }, rajih: true }
    ], alasan: { id: "Hadits Ibnu 'Umar: *\"Suatu hari aku naik ke atas rumah Hafshah, lalu kulihat Nabi ﷺ buang hajat membelakangi kiblat menghadap Syam.\"* Hadits ini mengecualikan bangunan dari larangan.", ar: "حديث ابن عمر: رقيت يومًا على بيت حفصة فرأيت النبي ﷺ يقضي حاجته مستدبر القبلة مستقبل الشام." } },
    { t: "hadits", ar: "اتَّقُوا اللَّعَّانَيْنِ، قَالُوا: وَمَا اللَّعَّانَانِ يَا رَسُولَ اللَّهِ؟ قَالَ: الَّذِي يَتَخَلَّى فِي طَرِيقِ النَّاسِ أَوْ فِي ظِلِّهِمْ", id: "Jauhilah dua hal yang mendatangkan laknat: buang hajat di jalan manusia atau di tempat berteduh mereka.", src: "HR. Muslim, dari Abu Hurairah" },
    { t: "hadits", ar: "اتَّقُوا الْمَلَاعِنَ الثَّلَاثَ: الْبَرَازَ فِي الْمَوَارِدِ، وَقَارِعَةِ الطَّرِيقِ، وَالظِّلِّ", id: "Jauhilah tiga tempat yang mendatangkan laknat: buang hajat di sumber air, di tengah jalan, dan di tempat berteduh. — *Zhill* yang dimaksud: setiap naungan bermanfaat yang dipakai manusia.", src: "HR. Abu Dawud, dari Mu'adz" },
    { t: "hadits", ar: "وَمَا أُبَالِي أَوَسْطَ الْقُبُورِ قَضَيْتُ حَاجَتِي، أَمْ وَسْطَ السُّوقِ", id: "Aku tidak peduli (sama buruknya) apakah aku buang hajat di tengah kuburan ataukah di tengah pasar.", src: "HR. Ibnu Majah, dari 'Uqbah" },
    { t: "hadits", ar: "لَا يَبُولَنَّ أَحَدُكُمْ فِي الْمَاءِ الدَّائِمِ ثُمَّ يَغْتَسِلُ مِنْهُ", id: "Janganlah salah seorang dari kalian kencing di air yang tergenang lalu mandi darinya.", src: "Muttafaq 'alaih, dari Abu Hurairah" },
    { t: "hadits", ar: "إِنَّ هَذِهِ الْمَسَاجِدَ لَا تَصْلُحُ لِشَيْءٍ مِنْ هَذَا الْبَوْلِ وَلَا الْقَذَرِ، إِنَّمَا هِيَ لِذِكْرِ اللَّهِ وَالصَّلَاةِ وَقِرَاءَةِ الْقُرْآنِ", id: "Seorang Arab badui kencing di sudut masjid; orang-orang menghardiknya, Nabi ﷺ melarang mereka. Setelah selesai, beliau menyuruh menyiramkan seember air, lalu bersabda: \"Masjid-masjid ini tidak layak untuk kencing dan kotoran; ia hanya untuk dzikir kepada Allah, shalat, dan membaca Al-Qur'an.\"", src: "HR. Muslim, dari Anas" },
    { t: "hadits", ar: "لَكُمْ كُلُّ عَظْمٍ ذُكِرَ اسْمُ اللَّهِ عَلَيْهِ يَقَعُ فِي أَيْدِيكُمْ أَوْفَرَ مَا يَكُونُ لَحْمًا ... فَلَا تَسْتَنْجُوا بِهِمَا؛ فَإِنَّهُمَا طَعَامُ إِخْوَانِكُمْ", id: "Kepada jin: \"Untuk kalian setiap tulang yang disebut nama Allah atasnya, kalian dapati penuh daging.\" Lalu beliau bersabda (kepada manusia): \"Janganlah beristinja' dengan keduanya (tulang dan kotoran hewan), karena keduanya makanan saudara kalian.\"", src: "HR. Muslim, dari Ibnu Mas'ud" },

    { t: "hukum", judul: { id: "Empat hal yang MAKRUH", ar: "ما يكره (أربعة)" }, item: [
      { h: "makruh", judul: { id: "1. Berbicara ketika buang hajat", ar: "الكلام أثناء قضاء الحاجة" }, id: "Seseorang memberi salam kepada Nabi ﷺ yang sedang kencing, beliau tidak menjawabnya. An-Nawawi: makruh berbicara dengan jenis apa pun — kecuali darurat (melihat orang buta hampir jatuh, perlu meminta air, dsb.).", ar: "ويستثنى ما مواضع الضرورة." },
      { h: "makruh", judul: { id: "2. Kencing di arah datangnya angin", ar: "في مهب الريح" }, id: "Illahnya logis (*nazhariyyah*): agar air kencing tidak berbalik mengenai pakaian dan badan.", ar: "العلة نظرية؛ لئلا ترد البول على الثياب والبدن." },
      { h: "makruh", judul: { id: "3. Membawa sesuatu yang bertuliskan dzikrullah", ar: "استصحاب ما فيه ذكر الله" }, id: "Termasuk mengagungkan syiar Allah. An-Nawawi: makruh pula berdzikir apa pun — tidak bertasbih, tidak bertahlil, tidak menjawab salam, tidak mendoakan orang bersin, tidak memuji Allah ketika bersin, dan tidak menirukan muadzin.", ar: "يكره للقاعد على قضاء الحاجة أن يذكر الله تعالى بشيء من الأذكار." },
      { h: "makruh", judul: { id: "4. Beristinja' dengan tangan kanan", ar: "الاستنجاء باليمين" }, id: "An-Nawawi: ulama berijma' bahwa hal itu dilarang; jumhur memandangnya **larangan tanzih dan adab, bukan larangan tahrim**.", ar: "الجماهير على أنه نهي تنزيه وأدب لا نهي تحريم." }
    ] },
    { t: "ayat", ar: "ذَٰلِكَ وَمَن يُعَظِّمْ شَعَائِرَ اللَّهِ فَإِنَّهَا مِن تَقْوَى الْقُلُوبِ", id: "Demikianlah; siapa yang mengagungkan syiar-syiar Allah, maka itu termasuk ketakwaan hati.", src: "QS. Al-Hajj: 32" },
    { t: "hadits", ar: "نَهَانَا النَّبِيُّ ﷺ أَنْ نَسْتَقْبِلَ الْقِبْلَةَ بِغَائِطٍ وَلَا بَوْلٍ، أَوْ أَنْ نَسْتَنْجِيَ بِالْيَمِينِ، أَوْ أَنْ يَسْتَنْجِيَ أَحَدُنَا بِأَقَلَّ مِنْ ثَلَاثَةِ أَحْجَارٍ", id: "Nabi ﷺ melarang kami menghadap kiblat ketika buang air besar atau kecil, beristinja' dengan tangan kanan, atau beristinja' dengan kurang dari tiga batu.", src: "HR. Muslim, dari Salman" },

    { t: "hukum", judul: { id: "Yang DISUNNAHKAN", ar: "ما يستحب" }, item: [
      { h: "sunnah", judul: { id: "Basmalah sebelum masuk", ar: "البسملة قبل الدخول" }, id: "\"Penghalang antara mata jin dan aurat anak Adam ketika masuk WC adalah ucapan: *Bismillah*.\"", ar: "ستر ما بين أعين الجن وعورات بني آدم إذا دخل أحدهم الخلاء أن يقول: بسم الله." },
      { h: "sunnah", judul: { id: "Isti'adzah sebelum masuk", ar: "الاستعاذة قبل الدخول" }, id: "[[اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ]]", ar: "اللهم إني أعوذ بك من الخبث والخبائث." },
      { h: "sunnah", judul: { id: "Kaki kiri saat masuk, kaki kanan saat keluar", ar: "تقديم اليسرى في الدخول واليمنى في الخروج" }, id: "Hadits 'Aisyah: Nabi ﷺ menyukai mendahulukan yang kanan dalam memakai sandal, menyisir, bersuci, dan seluruh urusannya (yang mulia) — maka kebalikannya untuk tempat kotor.", ar: "كان النبي ﷺ يعجبه التيمن في تنعله وترجله وطهوره وفي شأنه كله." },
      { h: "sunnah", judul: { id: "Mengucap *Ghufranaka* saat keluar", ar: "قول غفرانك إذا خرج" }, id: "Hadits 'Aisyah: bila Nabi ﷺ keluar dari WC beliau mengucapkan **غُفْرَانَكَ**.", ar: "كان النبي ﷺ إذا خرج من الخلاء قال: غفرانك." }
    ] },
    { t: "catatan", gaya: "hikmah", id: "Semua ini adalah **adab nabawi yang disepakati kesunnahannya**. Thaharah bukan hanya urusan air dan najis, tetapi juga adab — bahkan di tempat yang paling sederhana sekalipun, seorang muslim tetap bersama dzikir dan adabnya.", ar: "هذه آداب نبوية متفق على استحبابها." },

    { t: "ringkasan", item: [
      { id: "Fiqih = mengetahui hukum syar'i dari dalil terperinci; hukumnya lima: wajib, mustahab, mubah, makruh, haram.", ar: "الفقه معرفة الأحكام الشرعية من أدلتها التفصيلية، والأحكام خمسة." },
      { id: "Thaharah = mengangkat hadats (sifat pada badan) dan menghilangkan khabats (najis).", ar: "الطهارة رفع الحدث وزوال الخبث." },
      { id: "Air ada tiga: thahur (mengangkat hadats & menghilangkan najis), thahir (hanya menghilangkan najis), najis (tidak keduanya; hanya untuk darurat).", ar: "المياه ثلاثة: طهور وطاهر ونجس." },
      { id: "Bejana: semua mubah kecuali emas–perak; bejana orang kafir suci; tulang dkk. bangkai suci; kulit bangkai suci dengan disamak kecuali anjing–babi; disunnahkan menutup bejana.", ar: "ضوابط الآنية الخمسة." },
      { id: "Buang hajat: 6 haram, 4 makruh, dan adab mustahab (basmalah, isti'adzah, kaki kiri masuk, ghufranaka).", ar: "ما يحرم وما يكره وما يستحب في قضاء الحاجة." }
    ] }
  ],
  istilah: [
    { ar: "الفقه", latin: "al-fiqh", id: "Fiqih", def: { id: "Bahasa: pemahaman. Istilah: mengetahui hukum-hukum syar'i dari dalil-dalilnya yang terperinci.", ar: "لغة: الفهم، واصطلاحًا: معرفة الأحكام الشرعية من أدلتها التفصيلية." } },
    { ar: "الطهارة", latin: "ath-thaharah", id: "Thaharah", def: { id: "Bahasa: bersih dari kotoran. Istilah: mengangkat hadats dan menghilangkan khabats.", ar: "رفع الحدث وزوال الخبث." } },
    { ar: "الحدث", latin: "al-hadats", id: "Hadats", def: { id: "Sifat yang melekat pada badan yang menghalangi shalat dan semisalnya.", ar: "الوصف القائم بالبدن المانع من الصلاة ونحوها." } },
    { ar: "الخبث", latin: "al-khabats", id: "Khabats", def: { id: "Najis.", ar: "النجاسة." } },
    { ar: "الماء الطهور", latin: "al-ma' ath-thahur", id: "Air thahur", def: { id: "Air yang tetap pada asal ciptaannya; mengangkat hadats dan menghilangkan najis.", ar: "الباقي على خلقته؛ يرفع الحدث ويزيل الخبث." } },
    { ar: "الماء الطاهر", latin: "al-ma' ath-thahir", id: "Air thahir", def: { id: "Air bercampur benda suci hingga keluar dari kemutlakannya; tidak mengangkat hadats, tetapi menghilangkan najis.", ar: "ما خالطه طاهر فأخرجه عن إطلاقه." } },
    { ar: "الماء النجس", latin: "al-ma' an-najis", id: "Air najis", def: { id: "Air bercampur najis yang mengubah salah satu sifatnya (rasa, warna, bau).", ar: "ما خالطته نجاسة فغيرت أحد أوصافه." } },
    { ar: "الإباحة", latin: "al-ibahah", id: "Mubah", def: { id: "Pilihan antara melakukan dan meninggalkan.", ar: "التخيير بين الفعل والترك." } },
    { ar: "الدباغ", latin: "ad-dibagh", id: "Penyamakan", def: { id: "Proses mengolah kulit bangkai yang menjadikannya suci (kecuali anjing dan babi).", ar: "ما تطهر به جلود الميتات." } },
    { ar: "الوكاء", latin: "al-wika'", id: "Wika'", def: { id: "Tali pengikat mulut wadah air (siqa').", ar: "الرباط الذي يربط به فم السقاء." } },
    { ar: "اللعانان", latin: "al-la''anan", id: "Dua sebab laknat", def: { id: "Buang hajat di jalan manusia dan di tempat berteduh mereka.", ar: "الذي يتخلى في طريق الناس أو في ظلهم." } },
    { ar: "غفرانك", latin: "ghufranaka", id: "Ghufranaka", def: { id: "Doa ketika keluar dari WC: \"(Aku memohon) ampunan-Mu.\"", ar: "ما يقال عند الخروج من الخلاء." } }
  ],
  latihan: {
    pg: [
      { q: { id: "Seseorang mewudhukan diri dengan air yang telah direbus bersama daun teh hingga orang menyebutnya \"teh\". Menurut pembagian penulis, hukum wudhunya…", ar: "توضأ بماء غلي مع الشاي حتى سمي شايًا:" }, o: [
        { id: "Tidak sah, sebab airnya thahir", ar: "لا يصح؛ لأنه طاهر" },
        { id: "Sah, sebab airnya masih thahur", ar: "يصح؛ لأنه طهور" },
        { id: "Tidak sah, sebab airnya najis", ar: "لا يصح؛ لأنه نجس" },
        { id: "Sah, tetapi hukumnya makruh", ar: "يصح مع الكراهة" }], j: 0,
        b: { id: "Air yang berganti nama karena campuran benda suci adalah **thahir**: tidak mengangkat hadats, sehingga wudhunya tidak sah — walau tetap boleh untuk menghilangkan najis.", ar: "انتقل عن مسمى الماء فصار طاهرًا لا يرفع الحدث." } },
      { q: { id: "Bajunya terkena najis dan yang tersedia hanya air mawar. Bolehkah dipakai untuk menyucikan baju itu menurut penjelasan dosen?", ar: "تنجس ثوبه ولم يجد إلا ماء الورد:" }, o: [
        { id: "Boleh, air thahir menghilangkan najis", ar: "يجوز؛ الطاهر يزيل الخبث" },
        { id: "Tidak boleh, air thahir tak menyucikan", ar: "لا يجوز؛ الطاهر لا يطهر" },
        { id: "Boleh, hanya bila tiada air lain", ar: "يجوز عند فقد غيره فقط" },
        { id: "Tidak boleh, kecuali darurat binasa", ar: "لا يجوز إلا لضرورة الهلاك" }], j: 0,
        b: { id: "Dalam modul: hukum air thahir — **tidak mengangkat hadats, tetapi menghilangkan khabats**. Yang khusus untuk darurat adalah air najis.", ar: "الطاهر لا يرفع الحدث لكنه يزيل الخبث." } },
      { q: { id: "Manakah yang membuat air menjadi **najis** menurut ijma' yang dinukil Ibnul Mundzir?", ar: "متى ينجس الماء بالإجماع؟" }, o: [
        { id: "Najis mengubah rasa, warna, atau baunya", ar: "إذا غيرت النجاسة طعمه أو لونه أو ريحه" },
        { id: "Najis jatuh ke air yang sedikit saja", ar: "إذا وقعت النجاسة في القليل فقط" },
        { id: "Najis mengubah ketiga sifatnya sekaligus", ar: "إذا غيرت أوصافه الثلاثة جميعًا" },
        { id: "Najis menyentuhnya walau tidak berubah", ar: "إذا لاقته النجاسة ولو لم يتغير" }], j: 0,
        b: { id: "Ijma': air sedikit **maupun banyak** yang berubah salah satu sifatnya (rasa/warna/bau) karena najis menjadi najis selama tetap demikian.", ar: "القليل والكثير إذا تغير أحد أوصافه بالنجاسة." } },
      { q: { id: "Mengapa para fuqaha menempatkan Bab Bejana tepat sesudah Bab Air?", ar: "لماذا يذكر الفقهاء باب الآنية بعد باب المياه؟" }, o: [
        { id: "Air memerlukan wadah untuk ditampung", ar: "لأن الماء يحتاج إلى إناء" },
        { id: "Bejana lebih dulu ada daripada air", ar: "لأن الإناء أسبق وجودًا من الماء" },
        { id: "Hukum bejana diqiyaskan kepada air", ar: "لأن أحكام الآنية مقيسة على الماء" },
        { id: "Bejana termasuk bagian dari air", ar: "لأن الآنية جزء من المياه" }], j: 0,
        b: { id: "\"Engkau telah mendapatkan air, maka engkau butuh bejana untuk mengambil air dengannya.\"", ar: "وجدت الماء فتحتاج إلى إناء لتستخرج به الماء." } },
      { q: { id: "Kata apa dalam dhabit \"Yubahu isti'malu **kull** al-aniyah\" yang menunjukkan bejana besar, kecil, murah, dan mahal semuanya tercakup?", ar: "ما الدليل اللفظي على شمول الإباحة لكل الآنية؟" }, o: [
        { id: "\"Kull\", karena termasuk lafaz umum", ar: "«كل»؛ لأنها من ألفاظ العموم" },
        { id: "\"Yubahu\", karena bentuk pasif", ar: "«يباح»؛ لأنها مبنية للمجهول" },
        { id: "\"Isti'mal\", karena berbentuk mashdar", ar: "«استعمال»؛ لأنها مصدر" },
        { id: "\"Al-aniyah\", karena berbentuk jamak", ar: "«الآنية»؛ لأنها جمع" }], j: 0,
        b: { id: "Dosen: kata **\"kull\"** termasuk *alfazh al-'umum* yang mencakup seluruh bejana.", ar: "لأن كلمة «كل» من ألفاظ العموم." } },
      { q: { id: "Seorang musafir ingin memakai bejana milik Ahli Kitab yang diketahui biasa dipakai untuk khamr. Sikap yang benar…", ar: "آنية أهل كتاب يستعملون فيها الخمر:" }, o: [
        { id: "Mencucinya dulu, baru boleh dipakai", ar: "يغسلها ثم يستعملها" },
        { id: "Memakainya langsung, karena asalnya suci", ar: "يستعملها مباشرة؛ الأصل الطهارة" },
        { id: "Tidak memakainya sama sekali", ar: "لا يستعملها مطلقًا" },
        { id: "Memakainya hanya untuk air, bukan makanan", ar: "يستعملها للماء دون الطعام" }], j: 0,
        b: { id: "Bila mereka biasa memakai najis (khamr, babi), **wajib dicuci sebelum dipakai** — hadits Abu Tsa'labah: \"cucilah lalu makanlah dengannya.\"", ar: "وجب غسل الإناء قبل الاستعمال." } },
      { q: { id: "Dalil yang menunjukkan bejana orang musyrik boleh dipakai tanpa dicuci bila tidak diketahui ada najis adalah…", ar: "دليل جواز استعمال آنية المشركين بلا غسل:" }, o: [
        { id: "Nabi ﷺ berwudhu dari mazadah wanita musyrik", ar: "توضؤ النبي ﷺ من مزادة امرأة مشركة" },
        { id: "Hadits \"cucilah lalu makanlah dengannya\"", ar: "حديث «فاغسلوها وكلوا فيها»" },
        { id: "Hadits \"kulit yang disamak telah suci\"", ar: "حديث «إذا دبغ الإهاب فقد طهر»" },
        { id: "Ayat \"Dia menciptakan segala yang di bumi\"", ar: "آية «خلق لكم ما في الأرض جميعًا»" }], j: 0,
        b: { id: "Perbuatan Nabi ﷺ berwudhu dari wadah air wanita musyrik menunjukkan kebolehan tanpa mencuci bila tidak diketahui najisnya.", ar: "ثبت أن النبي ﷺ توضأ من مزادة امرأة مشركة." } },
      { q: { id: "Mengapa kulit anjing dan babi tidak suci walaupun disamak, menurut alasan yang disebut dalam modul?", ar: "لماذا استثني جلد الكلب والخنزير؟" }, o: [
        { id: "Karena zat keduanya najis", ar: "لنجاسة عينهما" },
        { id: "Karena tidak pernah disembelih", ar: "لأنهما لا يذكيان" },
        { id: "Karena kulitnya tidak bisa disamak", ar: "لأن جلدهما لا يدبغ" },
        { id: "Karena haram dimakan dagingnya", ar: "لأن لحمهما محرم الأكل" }], j: 0,
        b: { id: "Modul: \"Mereka berkata: karena **najisnya zat keduanya**.\" Masalah ini sendiri diperselisihkan ulama.", ar: "قالوا: لنجاسة عينهما." } },
      { q: { id: "Seorang tukang membuat sisir dari gading gajah yang mati tanpa disembelih. Menurut pendapat yang dibenarkan dosen…", ar: "مشط من عاج فيل ميت:" }, o: [
        { id: "Suci dan boleh dimanfaatkan", ar: "طاهر يجوز الانتفاع به" },
        { id: "Najis, kecuali setelah disamak", ar: "نجس إلا بعد الدباغ" },
        { id: "Najis, karena bagian bangkai", ar: "نجس لأنه من الميتة" },
        { id: "Suci, tetapi makruh dipakai", ar: "طاهر مع كراهة الاستعمال" }], j: 0,
        b: { id: "Tulang, tanduk, kuku, rambut, bulu bangkai: **suci** — riwayat kedua dari Ahmad, dipilih Syaikhul Islam; dosen: \"inilah yang benar\". Az-Zuhri: salaf bersisir dengannya.", ar: "الراجح أنها طاهرة." } },
      { q: { id: "Hadits \"Hanyalah yang diharamkan memakannya\" (tentang kambing maula Maimunah) dijadikan dalil untuk…", ar: "حديث «إنما حرم أكلها» دليل على:" }, o: [
        { id: "Bolehnya memanfaatkan kulit bangkai", ar: "جواز الانتفاع بجلد الميتة" },
        { id: "Sucinya tulang dan bulu bangkai", ar: "طهارة عظم الميتة وشعرها" },
        { id: "Halalnya bangkai hewan ternak", ar: "حل ميتة بهيمة الأنعام" },
        { id: "Najisnya seluruh bagian bangkai", ar: "نجاسة جميع أجزاء الميتة" }], j: 0,
        b: { id: "Nabi ﷺ: \"Mengapa tidak kalian manfaatkan kulitnya?\" — dalil dhabit keempat: kulit bangkai suci dengan disamak.", ar: "هلا انتفعتم بجلدها؟" } },
      { q: { id: "Menurut pendapat yang dirajihkan dalam modul, buang hajat menghadap kiblat di dalam kamar mandi rumah hukumnya…", ar: "قضاء الحاجة مستقبل القبلة في البنيان:" }, o: [
        { id: "Boleh, karena berada dalam bangunan", ar: "يجوز؛ لأنه في البنيان" },
        { id: "Haram, sebagaimana di padang terbuka", ar: "يحرم كما في الصحراء" },
        { id: "Makruh, karena ada khilaf ulama", ar: "يكره للخلاف" },
        { id: "Boleh membelakangi, haram menghadap", ar: "يجوز الاستدبار دون الاستقبال" }], j: 0,
        b: { id: "Pendapat rajih dari empat pendapat: **tidak boleh di padang terbuka, boleh di bangunan**, berdasarkan hadits Ibnu 'Umar di atas rumah Hafshah.", ar: "لا يجوز في الخلاء ويجوز في البنيان." } },
      { q: { id: "Hadits Ibnu 'Umar di atas rumah Hafshah berfungsi terhadap hadits Abu Ayyub sebagai…", ar: "حديث ابن عمر بالنسبة لحديث أبي أيوب:" }, o: [
        { id: "Pengecualian bangunan dari larangan", ar: "استثناء البنيان من النهي" },
        { id: "Penghapus (nasikh) seluruh larangan", ar: "ناسخ للنهي كله" },
        { id: "Penguat larangan di segala tempat", ar: "مؤكد للنهي في كل مكان" },
        { id: "Penjelas arah timur dan barat", ar: "مبين لجهة التشريق والتغريب" }], j: 0,
        b: { id: "Modul: \"Telah datang hadits Ibnu 'Umar, maka **dikecualikan bangunan** dari syarat ini.\"", ar: "فاستثنى البنيان." } },
      { q: { id: "Seseorang sedang buang hajat lalu melihat orang buta hampir terperosok ke lubang. Hukum ia berbicara memperingatkannya…", ar: "رأى أعمى يقع وهو على حاجته:" }, o: [
        { id: "Boleh, termasuk keadaan darurat", ar: "يجوز؛ لأنه من مواضع الضرورة" },
        { id: "Makruh, tetapi tetap mendapat pahala", ar: "مكروه مع حصول الأجر" },
        { id: "Haram, karena ada larangan berbicara", ar: "يحرم للنهي عن الكلام" },
        { id: "Boleh, hanya dengan isyarat tangan", ar: "يجوز بالإشارة فقط" }], j: 0,
        b: { id: "Berbicara saat buang hajat makruh, **dikecualikan keadaan darurat**: melihat orang buta akan jatuh, butuh meminta air, dan semisalnya.", ar: "ويستثنى مواضع الضرورة." } },
      { q: { id: "Larangan kencing di arah datangnya angin dalam modul disebut memiliki illah…", ar: "علة كراهة البول في مهب الريح:" }, o: [
        { id: "Nazhariyyah: agar kencing tak berbalik ke badan", ar: "نظرية: لئلا يرتد البول عليه" },
        { id: "Ta'abbudiyyah: tidak diketahui hikmahnya", ar: "تعبدية لا تعقل" },
        { id: "Syar'iyyah: ada nash larangan khusus", ar: "منصوصة بنهي خاص" },
        { id: "'Urfiyyah: mengikuti kebiasaan Arab", ar: "عرفية تبعًا لعادة العرب" }], j: 0,
        b: { id: "\"Illahnya *nazhariyyah*: agar air kencing tidak kembali ke pakaian dan badan sehingga menajiskannya.\"", ar: "العلة نظرية؛ لئلا ترد البول على الثياب والبدن." } },
      { q: { id: "Menurut nukilan an-Nawawi, larangan beristinja' dengan tangan kanan dipahami jumhur sebagai…", ar: "النهي عن الاستنجاء باليمين عند الجماهير:" }, o: [
        { id: "Larangan tanzih dan adab", ar: "نهي تنزيه وأدب" },
        { id: "Larangan tahrim yang tegas", ar: "نهي تحريم" },
        { id: "Larangan yang telah mansukh", ar: "نهي منسوخ" },
        { id: "Larangan khusus bagi lelaki", ar: "نهي خاص بالرجال" }], j: 0,
        b: { id: "Ulama berijma' bahwa ia dilarang, lalu **jumhur: larangan tanzih dan adab, bukan tahrim** — karena itu dimasukkan ke bagian makruh.", ar: "الجماهير على أنه نهي تنزيه وأدب لا نهي تحريم." } }
    ],
    bs: [
      { t: { id: "Air laut termasuk air thahur, sehingga sah dipakai berwudhu dan mandi.", ar: "ماء البحر طهور." }, j: true, b: { id: "\"Laut itu suci airnya\" — boleh wudhu dan mandi dengannya.", ar: "هو الطهور ماؤه." } },
      { t: { id: "Air yang asin karena kandungan garam alami keluar dari status thahur.", ar: "الماء المالح ليس طهورًا." }, j: false, b: { id: "Air tetap cair dan bening walau asin atau tawar; ia masih pada asal ciptaannya.", ar: "اللهم إن كان بالملوحة والعذب." } },
      { t: { id: "Air najis sama sekali tidak boleh dipakai, termasuk ketika seseorang takut binasa karena haus.", ar: "الماء النجس لا يستعمل ولو للضرورة." }, j: false, b: { id: "Ia tidak boleh dipakai **kecuali darurat**, yaitu bila seseorang takut binasa.", ar: "لا يجوز استعماله إلا عند الضرورة." } },
      { t: { id: "Perbuatan mubah bisa berpahala apabila disertai niat yang baik.", ar: "المباح يثاب عليه إذا قرن بالنية." }, j: true, b: { id: "\"Tidak berpahala dan tidak dihukum — kecuali bila disertai niat.\"", ar: "إلا إذا قرنت بالنية." } },
      { t: { id: "Haramnya bejana emas dan perak menurut Ibnu Qudamah hanya pendapat Hanabilah, sedangkan Malik dan asy-Syafi'i membolehkan.", ar: "تحريم آنية الذهب والفضة قول الحنابلة وحدهم." }, j: false, b: { id: "Ibnu Qudamah: itu juga mazhab Abu Hanifah, Malik, dan asy-Syafi'i; \"aku tidak mengetahui ada khilaf.\"", ar: "وهو مذهب أبي حنيفة ومالك والشافعي." } },
      { t: { id: "Bejana yang dibuat dari tulang manusia tidak boleh dipakai karena kehormatan manusia tetap ada setelah wafat.", ar: "لا يجوز استعمال آنية من عظم الآدمي." }, j: true, b: { id: "\"Mematahkan tulang mayit seperti mematahkannya ketika hidup.\"", ar: "كسر عظم الميت ككسره حيًّا." } },
      { t: { id: "Menutup bejana dan mengikat tempat air termasuk perkara yang diwajibkan dalam dhabit kelima.", ar: "تغطية الآنية واجبة." }, j: false, b: { id: "Dhabit kelima menyebut lafaz **\"yusannu\"**: disunnahkan, termasuk adab nabawi.", ar: "يسن تغطية الآنية." } },
      { t: { id: "Buang hajat di tengah kuburan diserupakan Nabi ﷺ dengan buang hajat di tengah pasar.", ar: "قضاء الحاجة بين القبور كالذي في وسط السوق." }, j: true, b: { id: "\"Aku tidak peduli apakah buang hajat di tengah kuburan atau di tengah pasar.\"", ar: "أوسط القبور قضيت حاجتي أم وسط السوق." } },
      { t: { id: "Beristinja' dengan tulang dilarang karena tulang adalah makanan jin.", ar: "النهي عن الاستنجاء بالعظم لأنه طعام الجن." }, j: true, b: { id: "\"Janganlah kalian beristinja' dengan keduanya, karena keduanya makanan saudara kalian.\"", ar: "فإنهما طعام إخوانكم." } },
      { t: { id: "Menjawab salam ketika sedang buang hajat termasuk perkara yang disunnahkan.", ar: "رد السلام على قاضي الحاجة مستحب." }, j: false, b: { id: "Nabi ﷺ tidak menjawab salam orang yang menyalaminya saat beliau kencing; an-Nawawi memakruhkannya.", ar: "فسلم فلم يرد عليه." } }
    ],
    jodoh: [
      { a: { id: "Hadats", ar: "الحدث" }, b: { id: "Sifat pada badan yang menghalangi shalat", ar: "وصف قائم بالبدن مانع من الصلاة" } },
      { a: { id: "Khabats", ar: "الخبث" }, b: { id: "Najis", ar: "النجاسة" } },
      { a: { id: "Air thahur", ar: "الطهور" }, b: { id: "Mengangkat hadats & menghilangkan najis", ar: "يرفع الحدث ويزيل الخبث" } },
      { a: { id: "Air thahir", ar: "الطاهر" }, b: { id: "Menghilangkan najis saja", ar: "يزيل الخبث فقط" } },
      { a: { id: "Air najis", ar: "النجس" }, b: { id: "Hanya untuk darurat", ar: "لا يستعمل إلا للضرورة" } },
      { a: { id: "Wika'", ar: "الوكاء" }, b: { id: "Tali pengikat tempat air", ar: "الرباط" } },
      { a: { id: "Al-la''anan", ar: "اللعانان" }, b: { id: "Buang hajat di jalan & naungan", ar: "التخلي في الطريق والظل" } }
    ],
    urut: { t: { id: "Urutkan bab-bab Kitab Thaharah sesuai logika penulis (pertama → terakhir).", ar: "رتب أبواب كتاب الطهارة." }, item: [
      { id: "Air", ar: "المياه" }, { id: "Bejana", ar: "الآنية" }, { id: "Buang hajat & istinja'", ar: "قضاء الحاجة والاستنجاء" }, { id: "Wudhu (siwak s.d. mengusap khuff)", ar: "الوضوء" }, { id: "Pembatal wudhu", ar: "نواقض الوضوء" }, { id: "Mandi", ar: "الغسل" }, { id: "Tayammum & najis", ar: "التيمم والنجاسات" }, { id: "Hukum darah wanita", ar: "أحكام الدماء" } ] },
    pilah: { t: { id: "Pilah: hukum masing-masing perbuatan ketika buang hajat.", ar: "صنف حسب الحكم." }, kategori: [{ id: "Haram", ar: "يحرم" }, { id: "Makruh", ar: "يكره" }, { id: "Mustahab", ar: "يستحب" }], item: [
      { t: { id: "Buang hajat di tempat berteduh orang", ar: "التخلي في الظل" }, k: 0 },
      { t: { id: "Kencing di air yang tergenang", ar: "البول في الماء الراكد" }, k: 0 },
      { t: { id: "Beristinja' dengan kotoran hewan", ar: "الاستنجاء بالروث" }, k: 0 },
      { t: { id: "Menghadap kiblat di padang terbuka", ar: "استقبال القبلة في الصحراء" }, k: 0 },
      { t: { id: "Membawa kertas bertuliskan dzikir", ar: "استصحاب ما فيه ذكر الله" }, k: 1 },
      { t: { id: "Beristinja' dengan tangan kanan", ar: "الاستنجاء باليمين" }, k: 1 },
      { t: { id: "Kencing di arah datangnya angin", ar: "البول في مهب الريح" }, k: 1 },
      { t: { id: "Bercakap-cakap tanpa keperluan", ar: "الكلام بلا حاجة" }, k: 1 },
      { t: { id: "Masuk dengan kaki kiri", ar: "تقديم اليسرى في الدخول" }, k: 2 },
      { t: { id: "Mengucap ghufranaka saat keluar", ar: "قول غفرانك" }, k: 2 },
      { t: { id: "Membaca basmalah sebelum masuk", ar: "البسملة قبل الدخول" }, k: 2 }
    ] },
    isian: [
      { t: { id: "Thaharah secara istilah adalah mengangkat ______ dan menghilangkan khabats.", ar: "الطهارة: رفع ______ وزوال الخبث." }, j: { id: "hadats", ar: "الحدث" }, x: [{ id: "najis", ar: "النجس" }, { id: "kotoran", ar: "القذر" }, { id: "junub", ar: "الجنابة" }] },
      { t: { id: "Kulit bangkai menjadi suci dengan ______, kecuali kulit anjing dan babi.", ar: "جلود الميتات تطهر بـ______." }, j: { id: "disamak", ar: "الدباغ" }, x: [{ id: "dicuci", ar: "الغسل" }, { id: "dijemur", ar: "التجفيف" }, { id: "disembelih", ar: "الذكاة" }] },
      { t: { id: "Doa ketika keluar dari WC adalah ______.", ar: "يقال إذا خرج من الخلاء: ______." }, j: { id: "ghufranaka", ar: "غفرانك" }, x: [{ id: "bismillah", ar: "بسم الله" }, { id: "alhamdulillah", ar: "الحمد لله" }, { id: "astaghfirullah", ar: "أستغفر الله" }] },
      { t: { id: "Air yang bercampur benda suci hingga berganti nama disebut air ______.", ar: "ما خالطه طاهر فغير اسمه: ______." }, j: { id: "thahir", ar: "طاهر" }, x: [{ id: "thahur", ar: "طهور" }, { id: "musta'mal", ar: "مستعمل" }, { id: "mutlak", ar: "مطلق" }] }
    ]
  },
  tugas: [
    { t: { ar: "اذكر أنواع المياه مع ضرب مثال لكل نوع.", id: "Sebutkan macam-macam air beserta contoh untuk setiap macam." },
      j: { ar: "المياه ثلاثة أقسام: ١- الطهور: الباقي على خلقته، كماء المطر والآبار والأنهار والعيون والبحار؛ يرفع الحدث ويزيل الخبث. ٢- الطاهر: ما خالطه شيء طاهر فأخرجه عن إطلاقه أو غير اسمه، كالشاي والمرق وماء الورد وماء المسك؛ لا يرفع الحدث لكنه يزيل الخبث. ٣- النجس: ما خالطته نجاسة فغيرت أحد أوصافه (الطعم أو اللون أو الريح)؛ لا يرفع حدثًا ولا يزيل خبثًا ولا يستعمل إلا عند الضرورة.",
        id: "Air ada **tiga**: (1) **Thahur** — tetap pada asal ciptaannya, mis. air hujan, sumur, sungai, mata air, laut; mengangkat hadats dan menghilangkan najis. (2) **Thahir** — bercampur benda suci hingga keluar dari kemutlakan atau berganti nama, mis. teh, kuah, air mawar, air misk; tidak mengangkat hadats tetapi menghilangkan najis. (3) **Najis** — bercampur najis yang mengubah salah satu sifatnya (rasa/warna/bau); tidak mengangkat hadats, tidak menghilangkan najis, hanya dipakai saat darurat." } },
    { t: { ar: "ما حكم استعمال آنية الذهب والفضة؟", id: "Apa hukum memakai bejana emas dan perak?" },
      j: { ar: "يحرم استعمال آنية الذهب والفضة في الأكل والشرب وغيرهما؛ لحديث حذيفة: «لا تشربوا في آنية الذهب والفضة ولا تأكلوا في صحافها فإنها لهم في الدنيا ولكم في الآخرة»، وحديث أم سلمة: «الذي يشرب في آنية الفضة إنما يجرجر في بطنه نار جهنم». قال ابن قدامة: لا خلاف بين أصحابنا في تحريمه، وهو مذهب أبي حنيفة ومالك والشافعي، ولا أعلم فيه خلافًا.",
        id: "**Haram**, untuk makan, minum, dan penggunaan lainnya. Dalilnya hadits Hudzaifah: \"Jangan minum dengan bejana emas dan perak dan jangan makan dengan piringnya…\" serta hadits Ummu Salamah: \"Yang minum dari bejana perak sedang menenggak api Jahannam.\" Ibnu Qudamah: tidak ada khilaf di kalangan Hanabilah, dan itu juga mazhab Abu Hanifah, Malik, dan asy-Syafi'i." } },
    { t: { ar: "ما هي الأمور التي تحرم أثناء قضاء الحاجة؟", id: "Apa saja perkara yang haram ketika buang hajat?" },
      j: { ar: "يحرم ستة أشياء: ١- استقبال القبلة واستدبارها بلا حائل (في الصحراء دون البنيان على الراجح). ٢- قضاء الحاجة في قارعة الطريق والظل وموارد الناس. ٣- وسط القبور. ٤- في الماء الراكد. ٥- في المسجد. ٦- الاستنجاء بروث أو عظم أو طعام.",
        id: "Enam: (1) menghadap/membelakangi kiblat tanpa penghalang (di padang terbuka; di bangunan boleh menurut pendapat rajih); (2) di jalan umum, tempat berteduh, dan sumber air manusia; (3) di tengah kuburan; (4) di air yang tergenang; (5) di dalam masjid; (6) beristinja' dengan kotoran hewan, tulang, atau makanan." } }
  ]
});

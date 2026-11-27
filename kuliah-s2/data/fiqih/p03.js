/* Fiqih Ibadah — Pertemuan 3: Pembatal Wudhu, Bab Mandi, Bab Tayammum */
Kuliah.pertemuan("fiqih", {
  no: 3, motif: "kaidah", motifOpt: { lbl: "النواقض والغسل والتيمم" }, tema: 3, durasi: 30,
  bab: { id: "Thaharah: pembatal wudhu, mandi & tayammum", ar: "الطهارة: النواقض والغسل والتيمم" },
  judul: { id: "Pembatal Wudhu, Bab Mandi, dan Bab Tayammum", ar: "باب نواقض الوضوء، وباب الغسل، وباب التيمم" },
  ringkas: {
    id: "**Bab 7 — Pembatal wudhu**: enam pembatal dan tiga hal yang haram bagi orang berhadats kecil (shalat, thawaf, menyentuh mushaf) beserta khilafnya. **Bab Mandi** (lima dhabit): yang mewajibkan mandi, syarat, fardhu, sunnah & tata cara, serta sembilan mandi yang dianjurkan. **Bab Tayammum**: dalil, syarat, tiga fardhu, tiga pembatal, dan tata cara satu tepukan.",
    ar: "باب نواقض الوضوء الستة وما يحرم على المحدث حدثًا أصغر، وباب الغسل بضوابطه الخمسة: موجباته وشروطه وفرضه وسننه والأغسال المستحبة، وباب التيمم: أدلته وشروطه وفروضه ونواقضه وصفته."
  },
  tujuan: [
    { id: "Menyebut enam pembatal wudhu dan memilah yang disepakati dari yang khas mazhab tertentu.", ar: "ذكر نواقض الوضوء الستة وتمييز ما اختص به بعض المذاهب." },
    { id: "Menjelaskan tiga hal yang haram bagi orang berhadats kecil beserta perbedaan pendapat tentang thawaf.", ar: "بيان ما يحرم على المحدث حدثًا أصغر والخلاف في الطواف." },
    { id: "Membedakan syarat keluarnya mani yang mewajibkan mandi ketika terjaga dan ketika tidur.", ar: "التفريق بين شروط إيجاب المني للغسل في اليقظة والنوم." },
    { id: "Mempraktikkan tata cara mandi janabah dan membedakan fardhunya dari sunnahnya.", ar: "تطبيق صفة الغسل والتفريق بين فرضه وسننه." },
    { id: "Menerapkan syarat, fardhu, pembatal, dan tata cara tayammum dalam kasus nyata.", ar: "تطبيق شروط التيمم وفروضه ونواقضه وصفته." }
  ],
  isi: [
    { t: "pembuka", id: "Pertemuan ketiga sampai pada **bab ketujuh**. Setelah wudhu dan tata caranya dijelaskan, kini dibahas **apa yang merusak wudhu**, lalu **mandi**, lalu **tayammum** — bersuci pengganti yang termasuk kekhususan umat ini.", ar: "سبق أن بينا الوضوء وأحكام الوضوء وصفته الواردة عن النبي ﷺ، ثم نتكلم اليوم عما يفسد الوضوء." },

    { t: "judul", id: "Bab 7: Pembatal Wudhu (dua dhabit)", ar: "الباب السابع: باب نواقض الوضوء" },
    { t: "kutipan", ar: "نواقض الوضوء ستةٌ: الخارج من السبيلين، وزوال العقل أو تغطيته بإغماءٍ أو نومٍ مستغرق، ومس الفرج بباطن الكف، وأكل لحم الإبل، والتقاء الختانين، والردة.", id: "Pembatal wudhu ada enam: yang keluar dari dua jalan; hilang atau tertutupnya akal karena pingsan atau tidur pulas; menyentuh kemaluan dengan telapak tangan bagian dalam; makan daging unta; bertemunya dua khitan; dan murtad.", oleh: { id: "Bidayah al-Mutafaqqih — dhabit 1", ar: "بداية المتفقه" } },
    { t: "hukum", judul: { id: "Enam pembatal wudhu", ar: "نواقض الوضوء الستة" }, item: [
      { h: "batal", judul: { id: "1. Yang keluar dari dua jalan (qubul & dubur)", ar: "الخارج من السبيلين" }, id: "Sedikit atau banyak, suci atau najis. Abu Hurairah ditanya \"apa hadats itu?\" — ia menjawab: *\"Kentut tanpa suara atau bersuara.\"* Hadits 'Ali tentang madzi: *\"Berwudhulah dan basuh kemaluanmu.\"* Termasuk yang suci seperti mani (menurut pendapat rajih) dan angin.", ar: "سواء كان قليلًا أو كثيرًا، سواء كان طاهرًا أو نجسًا." },
      { h: "batal", judul: { id: "2. Hilang/tertutupnya akal: pingsan atau tidur pulas", ar: "زوال العقل أو تغطيته بإغماء أو نوم مستغرق" }, id: "Hadits 'Ali: *\"Mata adalah tali pengikat dubur; siapa yang tidur hendaklah berwudhu.\"* Gila, pingsan, mabuk: **ijma'** batal (Ibnul Mundzir, Ibnu Qudamah). Tidur yang membatalkan: tidur yang **menghilangkan kesadaran**, dalam posisi apa pun — berdiri, duduk, atau berbaring.", ar: "فالنوم الذي يفسد الوضوء هو النوم الذي يزول معه شعوره على أي صفة كان." },
      { h: "batal", judul: { id: "3. Menyentuh kemaluan dengan telapak tangan bagian dalam", ar: "مس الفرج بباطن الكف" }, id: "Laki-laki atau perempuan, **tanpa penghalang**. Hadits Busrah: *\"Siapa menyentuh kemaluannya, hendaklah berwudhu.\"* Hadits Abu Hurairah: *\"…tanpa ada penutup di antaranya, wajib wudhu.\"* Bila dari balik penghalang, **tidak batal**.", ar: "فإن مسه من وراء حائل فإنه لا ينقض الوضوء." },
      { h: "batal", judul: { id: "4. Makan daging unta", ar: "أكل لحم الإبل" }, id: "Hadits Jabir bin Samurah: \"Apakah aku berwudhu karena daging kambing?\" — *\"Jika engkau mau.\"* \"Karena daging unta?\" — *\"Ya, berwudhulah karena daging unta.\"* Dosen: **ini termasuk kekhasan (*infiradat*) mazhab Ahmad.**", ar: "وهذا من إفرادات مذهب أحمد رحمه الله تعالى." },
      { h: "batal", judul: { id: "5. Bertemunya dua khitan", ar: "التقاء الختانين" }, id: "Bila hal itu mewajibkan mandi, maka **wudhu lebih utama lagi** (*min bab aula*).", ar: "فإذا كان يوجب الغسل فالوضوء من باب أولى." },
      { h: "batal", judul: { id: "6. Murtad dari Islam", ar: "الردة عن الإسلام" }, id: "Siapa murtad, batal wudhunya dan terhapus amalnya — **pilihan Syaikhul Islam Ibnu Taimiyah**.", ar: "وهو اختيار شيخ الإسلام ابن تيمية." }
    ] },
    { t: "atsar", ar: "وأجمع أهل العلم على أن الصلاة لا تجزئ إلا بطهارةٍ إذا وجد المرء إليها سبيلًا", id: "Ulama berijma' bahwa shalat tidak sah kecuali dengan thaharah bila seseorang mampu melakukannya.", src: "Ibnul Mundzir" },
    { t: "hukum", judul: { id: "Dhabit 2 — Tiga hal yang haram bagi orang berhadats kecil", ar: "يحرم على المحدث حدثًا أصغر ثلاثة" }, item: [
      { h: "haram", judul: { id: "Shalat", ar: "الصلاة" }, id: "Ayat wudhu (Al-Ma'idah: 6); *\"Allah tidak menerima shalat seseorang bila berhadats hingga ia berwudhu\"*; *\"Allah tidak menerima shalat tanpa bersuci.\"*", ar: "لا يقبل الله صلاة بغير طهور." },
      { h: "haram", judul: { id: "Thawaf", ar: "الطواف" }, id: "'Aisyah: *\"Hal pertama yang dilakukan Nabi ﷺ ketika tiba: berwudhu lalu thawaf.\"* Ibnu 'Abbas: *\"Thawaf di Baitullah adalah shalat, hanya saja Allah membolehkan berbicara di dalamnya; maka jangan berbicara kecuali yang baik.\"*", ar: "الطواف بالبيت صلاة إلا أن الله أباح فيه الكلام." },
      { h: "haram", judul: { id: "Menyentuh mushaf", ar: "مس المصحف" }, id: "*\"Tidak boleh menyentuh Al-Qur'an kecuali orang yang suci.\"* Pendapat Sa'd bin Abi Waqqash, Salman al-Farisi, Ibnu 'Umar, tujuh fuqaha Madinah, dan imam empat. Ibnu 'Abdil Barr: ijma' fuqaha negeri-negeri. Ibnu Qudamah: *\"Kami tidak mengetahui ada yang menyelisihi kecuali Dawud (azh-Zhahiri).\"*", ar: "لا نعرف مخالفًا في ذلك إلا داود." }
    ] },
    { t: "khilaf", masalah: { id: "Apakah wudhu wajib untuk thawaf?", ar: "الطهارة للطواف" }, pendapat: [
      { siapa: { id: "Jumhur ulama", ar: "الجمهور" }, isi: { id: "**Wajib**; thawaf tanpa wudhu tidak boleh.", ar: "على وجوب ذلك." } },
      { siapa: { id: "Syaikhul Islam, Hanafiyyah, dan satu riwayat dari Ahmad", ar: "شيخ الإسلام والحنفية ورواية عن أحمد" }, isi: { id: "**Mustahab** (dianjurkan), tidak wajib.", ar: "مستحب." } }
    ], alasan: { id: "Modul menyebut: **\"masalah ini diperselisihkan\"** — dhabit penulis memasukkan thawaf ke dalam yang haram bagi orang berhadats, sesuai pendapat jumhur. Modul tidak menegaskan tarjih lain.", ar: "والجمهور على وجوب ذلك والمسألة محل خلاف." } },

    { t: "judul", id: "Bab Mandi (Ghusl): Lima Dhabit", ar: "باب الغسل: خمسة ضوابط" },
    { t: "p", id: "Dosen: **Bab mandi termasuk bab terpenting** yang harus diperhatikan penuntut ilmu. Lima dhabitnya: (1) yang mewajibkan mandi, (2) syarat sahnya, (3) fardhunya, (4) sunnahnya, (5) mandi-mandi yang dianjurkan.", ar: "وباب الغسل من أهم الأبواب التي ينبغي أن تنتبه إليها أيها الطالب." },
    { t: "tabel", judul: { id: "Yang mewajibkan mandi", ar: "موجبات الغسل" }, kolom: [{ id: "Sebab", ar: "الموجب" }, { id: "Ketentuan & dalil", ar: "الضابط والدليل" }], baris: [
      [{ id: "**Keluarnya mani**", ar: "خروج المني" }, { id: "**Terjaga**: disyaratkan keluar dengan **nikmat (syahwat) dan memancar** — {مِن مَّاءٍ دَافِقٍ}; *\"Bila engkau memancarkan air, mandilah.\"* **Tidur**: cukup **melihat air (basah)**, tanpa syarat memancar atau nikmat.", ar: "في اليقظة بلذة ودفق، وفي النوم يكفي رؤية الماء." }],
      [{ id: "**Bertemunya dua khitan**", ar: "التقاء الختانين" }, { id: "*\"Bila ia duduk di antara empat cabangnya lalu bersungguh-sungguh, wajib mandi walau tidak keluar (mani).\"* Juga: *\"Bila khitan melewati khitan, wajib mandi.\"*", ar: "وجب الغسل وإن لم ينزل." }],
      [{ id: "**Darah haidh dan nifas**", ar: "خروج دم الحيض والنفاس" }, { id: "Kepada Fathimah binti Hubaisy: *\"…tinggalkan shalat sebanyak hari haidhmu, lalu mandilah dan shalatlah.\"* Ibnul Mundzir: ijma' wajibnya mandi bagi wanita nifas bila telah suci.", ar: "ثم اغتسلي وصلي." }],
      [{ id: "**Masuk Islamnya orang kafir**", ar: "إسلام الكافر" }, { id: "Menurut pendapat terkuat — **walaupun ia murtad (lalu kembali)**. Qais bin 'Ashim masuk Islam lalu diperintah mandi dengan air dan daun bidara; kisah Islamnya Tsumamah: \"Bawalah ia ke kebun Bani Fulan dan suruh ia mandi.\"", ar: "على أرجح أقوال أهل العلم ولو مرتدًا." }]
    ] },
    { t: "hadits", ar: "سُئِلَ النَّبِيُّ ﷺ عَنِ الرَّجُلِ يَجِدُ الْبَلَلَ وَلَا يَذْكُرُ احْتِلَامًا؟ قَالَ: يَغْتَسِلُ. وَعَنِ الرَّجُلِ يَرَى أَنَّهُ احْتَلَمَ وَلَمْ يَجِدْ بَلَلًا، قَالَ: لَا غُسْلَ عَلَيْهِ", id: "Nabi ﷺ ditanya tentang orang yang mendapati basah tetapi tidak ingat mimpi: \"Ia mandi.\" Dan tentang orang yang merasa mimpi tetapi tidak mendapati basah: \"Tidak wajib mandi.\"", src: "HR. Abu Dawud, at-Tirmidzi — dari 'Aisyah" },
    { t: "catatan", gaya: "tanbih", judul: { id: "Kunci perbedaan terjaga dan tidur", ar: "اليقظة والنوم" }, id: "**Terjaga**: mani keluar dengan nikmat **dan** memancar. **Tidur**: yang dilihat adalah **keluarnya/terlihatnya air** saja. Ibnul Mundzir: ulama berijma' bahwa orang yang bermimpi (berjima') tetapi tidak mendapati basah, tidak wajib mandi.", ar: "يبقى إذن في اليقظة يخرج المني بلذة ودفق، وفي النوم يخرج أو يرى الماء وفقط." },
    { t: "p", id: "**Syarat sah mandi** sama dengan syarat sah wudhu (lihat Pertemuan 2) — modul sengaja tidak mengulanginya. **Fardhu mandi hanya satu: meratakan air ke seluruh badan.** Maka bila seseorang menyelam ke dalam air dengan niat mengangkat hadats, hadatsnya terangkat.", ar: "فرض الغسل واحد: تعميم البدن بالماء؛ فإذا غطس فيه بنية رفع الحدث فإنه يرتفع." },
    { t: "hadits", ar: "وَضَعَ رَسُولُ اللَّهِ ﷺ وَضُوءَ الْجَنَابَةِ، فَأَكْفَأَ بِيَمِينِهِ عَلَى شِمَالِهِ مَرَّتَيْنِ أَوْ ثَلَاثًا، ثُمَّ غَسَلَ فَرْجَهُ، ثُمَّ ضَرَبَ يَدَهُ بِالْأَرْضِ أَوِ الْحَائِطِ مَرَّتَيْنِ أَوْ ثَلَاثًا، ثُمَّ مَضْمَضَ وَاسْتَنْشَقَ، وَغَسَلَ وَجْهَهُ وَذِرَاعَيْهِ، ثُمَّ أَفَاضَ عَلَى رَأْسِهِ الْمَاءَ، ثُمَّ غَسَلَ جَسَدَهُ، ثُمَّ تَنَحَّى فَغَسَلَ رِجْلَيْهِ", id: "Maimunah: Rasulullah ﷺ menyiapkan air untuk mandi janabah, menuangkan dengan tangan kanan ke kiri dua atau tiga kali, membasuh kemaluannya, menggosokkan tangan ke tanah atau dinding dua atau tiga kali, berkumur dan istinsyaq, membasuh wajah dan lengannya, menuangkan air ke kepala, membasuh badannya, lalu bergeser dan membasuh kedua kakinya.", src: "Muttafaq 'alaih" },
    { t: "hukum", judul: { id: "Sunnah-sunnah mandi", ar: "سنن الغسل" }, item: [
      { h: "sunnah", judul: { id: "Menghilangkan kotoran yang menempel", ar: "إزالة ما لوثه من أذى" }, id: "Membasuh antara pusar dan lutut dengan baik memakai air, bidara, sabun, dsb. Dalam riwayat: *\"lalu ia membasuh kemaluannya.\"*", ar: "فغسل مذاكيره." },
      { h: "sunnah", judul: { id: "Wudhu sebelum mandi, kaki diakhirkan", ar: "الوضوء قبله وترك الرجلين" }, id: "Maimunah: *\"Lalu beliau berwudhu seperti wudhu shalat kecuali kedua kakinya.\"*", ar: "ثم توضأ وضوءه للصلاة غير رجليه." },
      { h: "sunnah", judul: { id: "Membasuh anggota tiga kali", ar: "غسل الأعضاء ثلاثًا" }, id: "Kepala, sisi kanan, lalu kiri. *\"Lalu menyela rambut kepalanya dengan tangan hingga yakin kulitnya basah, menuangkan air tiga kali, lalu membasuh seluruh badannya.\"*", ar: "حتى إذا ظن أنه قد أروى بشرته." },
      { h: "sunnah", judul: { id: "Tayamun (mendahulukan kanan)", ar: "التيامن" }, id: "*\"Nabi ﷺ menyukai mendahulukan yang kanan…\"*", ar: "" },
      { h: "sunnah", judul: { id: "Muwalah", ar: "الموالاة" }, id: "Disunnahkan bersambung — **dalam mandi muwalah adalah sunnah**, sedangkan dalam wudhu ia wajib.", ar: "فيستحب أن يوالي بين الغسل." },
      { h: "sunnah", judul: { id: "Menggosok anggota", ar: "دلك الأعضاء" }, id: "Agar air sampai dan diyakini merata ke seluruh badan.", ar: "" },
      { h: "sunnah", judul: { id: "Membasuh kaki di tempat lain", ar: "غسل الرجلين بمكان آخر" }, id: "*\"…lalu beliau bergeser dan membasuh kedua kakinya.\"*", ar: "تنحى فغسل رجليه." }
    ] },
    { t: "langkah", judul: { id: "Ringkas tata cara mandi", ar: "صفة الغسل" }, item: [
      { id: "Membasuh kemaluan dengan baik.", ar: "يغسل مذاكيره جيدًا." },
      { id: "Berwudhu seperti wudhu shalat.", ar: "ثم يتوضأ وضوءه للصلاة." },
      { id: "Menuangkan air ke kepala tiga kali.", ar: "ثم يفيض الماء على رأسه ثلاثًا." },
      { id: "Membasuh sisi kanan, lalu sisi kiri.", ar: "ثم الشق الأيمن، ثم الأيسر." },
      { id: "Bila kaki belum dibasuh, bergeser lalu membasuhnya.", ar: "ثم إذا ترك رجله تنحى فغسل رجليه." }
    ] },
    { t: "tanya", q: { id: "Bolehkah shalat dengan mandi tersebut tanpa berwudhu lagi?", ar: "هل يجوز أن يصلي بهذا الغسل؟" }, a: { id: "**Boleh**, selama ia tidak melakukan pembatal wudhu setelah wudhu dan mandinya — seperti menyentuh kemaluan dengan telapak tangan atau keluarnya sesuatu dari dua jalan.", ar: "نعم، إذا لم يرتكب ناقضًا من نواقض الوضوء بعد الوضوء والغسل." } },
    { t: "hukum", judul: { id: "Sembilan mandi yang dianjurkan (al-aghsal al-mustahabbah)", ar: "الأغسال المستحبة تسعة" }, item: [
      { h: "sunnah", judul: { id: "1. Mandi Jumat — yang paling ditekankan", ar: "غسل الجمعة وهو آكدها" }, id: "*\"Mandi Jumat wajib bagi setiap yang baligh\"*; *\"Siapa datang Jumat hendaklah mandi\"*; dan anjuran: *\"Siapa berwudhu pada hari Jumat, itu baik; siapa mandi, mandi lebih utama.\"*", ar: "من توضأ يوم الجمعة فبها ونعمت ومن اغتسل فالغسل أفضل." },
      { h: "sunnah", judul: { id: "2. Setelah memandikan mayit", ar: "من غسل ميتًا" }, id: "*\"Siapa memandikan mayit hendaklah mandi, siapa memikulnya hendaklah berwudhu.\"* Kewajibannya dipalingkan oleh hadits Ibnu 'Abbas: *\"Mayit kalian tidak najis, cukup kalian mencuci tangan.\"*", ar: "إن ميتكم ليس بنجس فحسبكم أن تغسلوا أيديكم." },
      { h: "sunnah", judul: { id: "3. Dua hari raya", ar: "للعيدين" }, id: "Ditanya tentang mandi, 'Ali menjawab: *\"Hari Jumat, hari 'Arafah, hari Adha, dan hari Fithri.\"* Ibnu 'Umar mandi sebelum berangkat ke mushalla.", ar: "" },
      { h: "sunnah", judul: { id: "4. Setelah pingsan", ar: "للإغماء" }, id: "Nabi ﷺ pingsan ketika sakit, lalu meminta air di bejana dan mandi — tiga kali — lalu bersabda: *\"Suruh Abu Bakr mengimami manusia.\"*", ar: "" },
      { h: "sunnah", judul: { id: "5. Setelah gila (sadar kembali)", ar: "للجنون" }, id: "Ibnu 'Utsaimin: diqiyaskan dengan pingsan; bila disyariatkan untuk pingsan, untuk gila lebih utama.", ar: "فالجنون من باب أولى." },
      { h: "sunnah", judul: { id: "6. Wanita mustahadhah untuk setiap shalat", ar: "المستحاضة لكل صلاة" }, id: "Rinciannya akan datang di bab haidh.", ar: "" },
      { h: "sunnah", judul: { id: "7. Ihram", ar: "الإحرام" }, id: "Zaid: *\"Ia melihat Nabi ﷺ menanggalkan pakaian untuk berihram dan mandi.\"*", ar: "" },
      { h: "sunnah", judul: { id: "8–9. Masuk Makkah & wukuf di 'Arafah", ar: "دخول مكة والوقوف بعرفة" }, id: "Ibnu 'Umar melakukannya dan menyebut bahwa Nabi ﷺ melakukannya; hadits 'Ali menyebut hari 'Arafah.", ar: "" }
    ] },

    { t: "judul", id: "Bab Tayammum", ar: "باب التيمم" },
    { t: "p", id: "**Tayammum termasuk kekhususan umat yang diberkahi ini**, disyariatkan dengan Al-Qur'an, Sunnah, dan ijma'.", ar: "وباب التيمم من خصائص هذه الأمة المباركة، وهو مشروع بالكتاب والسنة والإجماع." },
    { t: "hadits", ar: "أُعْطِيتُ خَمْسًا لَمْ يُعْطَهُنَّ أَحَدٌ قَبْلِي: نُصِرْتُ بِالرُّعْبِ مَسِيرَةَ شَهْرٍ، وَجُعِلَتْ لِيَ الْأَرْضُ مَسْجِدًا وَطَهُورًا، فَأَيُّمَا رَجُلٍ مِنْ أُمَّتِي أَدْرَكَتْهُ الصَّلَاةُ فَلْيُصَلِّ…", id: "Aku diberi lima hal yang tidak diberikan kepada seorang pun sebelumku: aku ditolong dengan rasa takut (musuh) sejauh perjalanan sebulan; bumi dijadikan untukku masjid dan alat bersuci — maka siapa saja dari umatku yang didapati waktu shalat, hendaklah ia shalat; harta rampasan dihalalkan bagiku; aku diberi syafa'at; dan nabi dahulu diutus khusus kepada kaumnya sedangkan aku diutus kepada seluruh manusia.", src: "Muttafaq 'alaih, dari Jabir" },
    { t: "ayat", ar: "وَإِن كُنتُم مَّرْضَىٰ أَوْ عَلَىٰ سَفَرٍ أَوْ جَاءَ أَحَدٌ مِّنكُم مِّنَ الْغَائِطِ أَوْ لَامَسْتُمُ النِّسَاءَ فَلَمْ تَجِدُوا مَاءً فَتَيَمَّمُوا صَعِيدًا طَيِّبًا فَامْسَحُوا بِوُجُوهِكُمْ وَأَيْدِيكُم مِّنْهُ", id: "Jika kalian sakit, dalam safar, salah seorang dari kalian datang dari buang hajat, atau menyentuh perempuan, lalu kalian tidak mendapat air, maka bertayammumlah dengan tanah yang baik; usaplah wajah dan tangan kalian dengannya.", src: "QS. An-Nisa': 43 (bdk. Al-Ma'idah: 6)" },
    { t: "hadits", ar: "إِنَّ الصَّعِيدَ الطَّيِّبَ وَضُوءُ الْمُسْلِمِ وَإِنْ لَمْ يَجِدِ الْمَاءَ عَشْرَ سِنِينَ، فَإِذَا وَجَدَ الْمَاءَ فَلْيُمِسَّهُ بَشَرَتَهُ؛ فَإِنَّ ذَلِكَ خَيْرٌ", id: "Tanah yang baik adalah wudhu seorang muslim walaupun ia tidak mendapat air sepuluh tahun; bila ia mendapat air, hendaklah ia menyentuhkannya ke kulitnya, karena itu lebih baik. (Riwayat lain: \"…*thahur* seorang muslim\".) Ibnul Mundzir: ijma' bolehnya tayammum dengan tanah berdebu.", src: "HR. Abu Dawud, at-Tirmidzi — dari Abu Dzar" },
    { t: "hukum", judul: { id: "Syarat tayammum", ar: "شروط التيمم" }, item: [
      { h: "info", judul: { id: "1–4. Islam, niat, akal, tamyiz", ar: "الإسلام والنية والعقل والتمييز" }, id: "Syarat yang disebut pada setiap ibadah — sudah dijelaskan di bab wudhu.", ar: "هذه شروط تذكر في كل عبادة." },
      { h: "info", judul: { id: "5. Tidak ada air, atau tidak mampu memakainya", ar: "انعدام الماء أو تعذر استعماله" }, id: "{فَلَمْ تَجِدُوا مَاءً فَتَيَمَّمُوا}. Termasuk: punya sedikit air tetapi takut kehausan, atau sakit/luka/terbakar/sakit perut sehingga tak sanggup berwudhu. Ibnul Mundzir: ijma' — musafir yang punya air dan takut haus, menyimpan airnya untuk minum lalu bertayammum. {لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا}, {فَاتَّقُوا اللَّهَ مَا اسْتَطَعْتُمْ}, *\"Bila aku perintahkan sesuatu, kerjakan semampu kalian.\"*", ar: "فهنا نقول: ينتقل إلى التيمم." },
      { h: "info", judul: { id: "6. Dengan sha'id yang suci dan berdebu", ar: "أن يكون بصعيد طاهر له غبار" }, id: "*Sha'id*: segala yang naik di permukaan bumi dan termasuk bagiannya — tanah, pasir, batu besar, bebatuan, dsb. *Berdebu*: menempel di tangan; maka bila mengusap dinding, dinding itu berdebu.", ar: "كل ما صعد على وجه الأرض وكان من أجزائها." }
    ] },
    { t: "banding", judul: { id: "Tayammum: fardhu vs pembatal", ar: "فروض التيمم ونواقضه" },
      kiri: { judul: { id: "Tiga fardhu", ar: "فروضه ثلاثة" }, ikon: "check", poin: [
        { id: "Mengusap wajah", ar: "مسح الوجه" }, { id: "Mengusap kedua tangan (telapak)", ar: "مسح اليدين" }, { id: "Muwalah antara keduanya — agar layak disebut bertayammum", ar: "الموالاة" } ] },
      kanan: { judul: { id: "Tiga pembatal", ar: "نواقضه ثلاثة" }, ikon: "x", poin: [
        { id: "Semua pembatal wudhu — tayammum adalah pengganti, dan pengganti mengambil hukum yang digantikan", ar: "ما ينقض الوضوء؛ لأن البدل له حكم المبدل" }, { id: "Adanya air, bila tayammum karena tidak ada air", ar: "وجود الماء إذا كان تيمم لعدمه" }, { id: "Hilangnya uzur yang membolehkan (sakit sembuh, dsb.)", ar: "زوال المبيح" } ] } },
    { t: "hadits", ar: "إِنَّمَا كَانَ يَكْفِيكَ أَنْ تَصْنَعَ هَكَذَا، فَضَرَبَ بِكَفِّهِ ضَرْبَةً عَلَى الْأَرْضِ ثُمَّ نَفَضَهَا، ثُمَّ مَسَحَ بِهِمَا ظَهْرَ كَفِّهِ بِشِمَالِهِ، أَوْ ظَهْرَ شِمَالِهِ بِكَفِّهِ، ثُمَّ مَسَحَ بِهِمَا وَجْهَهُ", id: "Kepada 'Ammar: \"Sebenarnya cukup bagimu berbuat begini\" — beliau menepukkan telapak tangannya sekali ke tanah, mengibaskannya, lalu mengusap punggung telapak tangan (kanan) dengan tangan kiri atau punggung tangan kiri dengan telapaknya, kemudian mengusap wajahnya.", src: "Muttafaq 'alaih" },
    { t: "langkah", judul: { id: "Tata cara tayammum", ar: "صفة التيمم" }, item: [
      { id: "**Satu tepukan** ke tanah dengan kedua telapak tangan.", ar: "ضربة واحدة." },
      { id: "Meniup atau mengibaskan keduanya.", ar: "ينفخ فيهما أو ينفضهما." },
      { id: "Mengusap **wajah**.", ar: "ثم يمسح وجهه." },
      { id: "Mengusap **kedua telapak**: punggung tangan kanan dengan bagian dalam tangan kiri, dan punggung tangan kiri dengan bagian dalam tangan kanan.", ar: "يمسح ظاهر اليمنى بباطن اليسرى، وظاهر اليسرى بباطن اليمنى." }
    ] },
    { t: "cek", q: { id: "Seorang musafir hanya punya sebotol air dan khawatir kehausan di perjalanan. Waktu shalat masuk. Apa yang ia lakukan?", ar: "مسافر معه ماء قليل يخشى العطش:" }, o: [
      { id: "Menyimpan air untuk minum, lalu bertayammum", ar: "يبقي الماء للشرب ويتيمم" },
      { id: "Berwudhu dengan airnya, lalu menahan haus", ar: "يتوضأ ويصبر على العطش" },
      { id: "Menunda shalat hingga menemukan sumber air", ar: "يؤخر الصلاة حتى يجد الماء" },
      { id: "Membasuh wajah dengan air, lalu bertayammum", ar: "يغسل وجهه ثم يتيمم" }], j: 0,
      b: { id: "Ibnul Mundzir: ulama berijma' bahwa musafir yang membawa air dan takut kehausan menyimpan airnya untuk minum dan bertayammum.", ar: "أجمعوا أن المسافر إذا كان معه ماء وخشي العطش أن يبقي ماءه للشرب ويتيمم." } },

    { t: "ringkasan", item: [
      { id: "Pembatal wudhu: yang keluar dari dua jalan, hilang akal (pingsan/tidur pulas), menyentuh kemaluan tanpa penghalang, daging unta (khas mazhab Ahmad), bertemunya dua khitan, murtad.", ar: "نواقض الوضوء الستة." },
      { id: "Haram bagi orang berhadats kecil: shalat, thawaf (jumhur: wajib wudhu; Syaikhul Islam: mustahab), menyentuh mushaf.", ar: "ما يحرم على المحدث." },
      { id: "Wajib mandi: keluar mani (terjaga: nikmat & memancar; tidur: cukup melihat basah), bertemunya dua khitan, haidh & nifas, masuk Islam.", ar: "موجبات الغسل." },
      { id: "Fardhu mandi satu: meratakan air ke seluruh badan; sisanya sunnah. Mandi yang dianjurkan sembilan, paling ditekankan mandi Jumat.", ar: "فرض الغسل والأغسال المستحبة." },
      { id: "Tayammum: syarat (Islam, niat, akal, tamyiz, tidak ada/tak bisa pakai air, sha'id suci berdebu); fardhu tiga; pembatal tiga; satu tepukan untuk wajah dan telapak.", ar: "التيمم." }
    ] }
  ],
  istilah: [
    { ar: "نواقض الوضوء", latin: "nawaqidh al-wudhu'", id: "Pembatal wudhu", def: { id: "Enam: yang keluar dari dua jalan, hilang akal, menyentuh kemaluan, daging unta, bertemunya dua khitan, murtad.", ar: "ستة." } },
    { ar: "السبيلان", latin: "as-sabilan", id: "Dua jalan", def: { id: "Qubul dan dubur.", ar: "القبل والدبر." } },
    { ar: "نوم مستغرق", latin: "naum mustaghriq", id: "Tidur pulas", def: { id: "Tidur yang menghilangkan kesadaran, dalam posisi apa pun.", ar: "النوم الذي يزول معه الشعور." } },
    { ar: "إفرادات المذهب", latin: "infiradat al-madzhab", id: "Kekhasan mazhab", def: { id: "Pendapat yang hanya dipegang satu mazhab; mis. batalnya wudhu karena daging unta dalam mazhab Ahmad.", ar: "ما انفرد به مذهب." } },
    { ar: "التقاء الختانين", latin: "iltiqa' al-khitanain", id: "Bertemunya dua khitan", def: { id: "Kiasan jima'; mewajibkan mandi walau tidak keluar mani.", ar: "يوجب الغسل وإن لم ينزل." } },
    { ar: "تعميم البدن", latin: "ta'mim al-badan", id: "Meratakan air ke badan", def: { id: "Satu-satunya fardhu mandi.", ar: "فرض الغسل." } },
    { ar: "الأغسال المستحبة", latin: "al-aghsal al-mustahabbah", id: "Mandi-mandi sunnah", def: { id: "Sembilan; paling ditekankan mandi Jumat.", ar: "تسعة آكدها الجمعة." } },
    { ar: "الصعيد", latin: "ash-sha'id", id: "Sha'id", def: { id: "Segala yang naik di permukaan bumi dan termasuk bagiannya: tanah, pasir, batu.", ar: "كل ما صعد على وجه الأرض من أجزائها." } },
    { ar: "البدل له حكم المبدل", latin: "al-badal lahu hukm al-mubdal", id: "Pengganti mengikuti hukum yang diganti", def: { id: "Kaidah: tayammum (pengganti wudhu) batal oleh semua pembatal wudhu.", ar: "قاعدة." } },
    { ar: "زوال المبيح", latin: "zawal al-mubih", id: "Hilangnya uzur", def: { id: "Hilangnya sebab yang membolehkan tayammum, seperti sembuh dari sakit.", ar: "زوال العلة." } }
  ],
  latihan: {
    pg: [
      { q: { id: "Seseorang tertidur sambil duduk bersandar sampai tidak sadar apa yang terjadi di sekitarnya. Menurut modul, wudhunya…", ar: "نام جالسًا حتى زال شعوره:" }, o: [
        { id: "Batal, karena kesadarannya hilang", ar: "ينتقض لزوال الشعور" },
        { id: "Tetap, karena ia dalam posisi duduk", ar: "لا ينتقض لأنه جالس" },
        { id: "Tetap, kecuali bila ia terjatuh", ar: "لا ينتقض إلا إن سقط" },
        { id: "Batal, hanya bila tidurnya berbaring", ar: "ينتقض إن كان مضطجعًا فقط" }], j: 0,
        b: { id: "\"Tidur yang membatalkan adalah tidur yang **menghilangkan kesadaran, dalam posisi apa pun** — berdiri, duduk, atau berbaring.\"", ar: "على أي صفة كان." } },
      { q: { id: "Seseorang menyentuh kemaluannya dari balik celana. Hukum wudhunya menurut modul…", ar: "مس فرجه من وراء حائل:" }, o: [
        { id: "Tidak batal, karena ada penghalang", ar: "لا ينتقض لوجود الحائل" },
        { id: "Batal, karena tetap menyentuh kemaluan", ar: "ينتقض لحصول المس" },
        { id: "Batal, bila disertai dengan syahwat", ar: "ينتقض إن كان بشهوة" },
        { id: "Tidak batal, bila hanya dengan jari", ar: "لا ينتقض إن كان بالأصابع" }], j: 0,
        b: { id: "Pembatalnya adalah menyentuh dengan **telapak bagian dalam tanpa penghalang**: \"…tanpa ada penutup di antaranya.\" Dari balik penghalang tidak membatalkan.", ar: "فإن مسه من وراء حائل فإنه لا ينقض الوضوء." } },
      { q: { id: "Modul menyebut batalnya wudhu karena makan daging unta sebagai…", ar: "النقض بلحم الإبل:" }, o: [
        { id: "Kekhasan mazhab Ahmad", ar: "من إفرادات مذهب أحمد" },
        { id: "Ijma' seluruh imam mazhab", ar: "إجماع الأئمة" },
        { id: "Pendapat yang sudah dihapus", ar: "قول منسوخ" },
        { id: "Pilihan khusus Syaikhul Islam Ibnu Taimiyah", ar: "اختيار شيخ الإسلام وحده" }], j: 0,
        b: { id: "\"Dan ini termasuk *infiradat* mazhab Ahmad rahimahullah.\" Dalilnya hadits Jabir bin Samurah dan al-Bara' bin 'Azib.", ar: "وهذا من إفرادات مذهب أحمد." } },
      { q: { id: "Alasan modul memasukkan \"bertemunya dua khitan\" ke dalam pembatal wudhu adalah…", ar: "وجه النقض بالتقاء الختانين:" }, o: [
        { id: "Bila mewajibkan mandi, wudhu lebih utama", ar: "إذا أوجب الغسل فالوضوء أولى" },
        { id: "Karena pasti disertai keluarnya madzi", ar: "لأنه يصحبه المذي" },
        { id: "Karena termasuk menyentuh kemaluan", ar: "لأنه من مس الفرج" },
        { id: "Karena ada ijma' yang dinukil Ibnul Mundzir", ar: "لإجماع ابن المنذر" }], j: 0,
        b: { id: "\"Bila ia mewajibkan mandi, maka wudhu **min bab aula**.\"", ar: "فالوضوء من باب أولى." } },
      { q: { id: "Tentang menyentuh mushaf tanpa wudhu, Ibnu Qudamah berkata tidak diketahui ada yang menyelisihi kecuali…", ar: "لا نعرف مخالفًا إلا:" }, o: [
        { id: "Dawud azh-Zhahiri", ar: "داود الظاهري" },
        { id: "Abu Hanifah", ar: "أبو حنيفة" },
        { id: "Ibnu Taimiyah al-Harrani", ar: "ابن تيمية" },
        { id: "Salman al-Farisi", ar: "سلمان الفارسي" }], j: 0,
        b: { id: "\"Kami tidak mengetahui ada yang menyelisihi dalam hal itu kecuali Dawud, yakni azh-Zhahiri.\" Salman justru termasuk yang mengharamkan.", ar: "إلا داود يعني الظاهري." } },
      { q: { id: "Seorang laki-laki terbangun dan merasa bermimpi, tetapi tidak mendapati basah apa pun. Hukumnya…", ar: "رأى أنه احتلم ولم يجد بللًا:" }, o: [
        { id: "Tidak wajib mandi", ar: "لا غسل عليه" },
        { id: "Wajib mandi karena mimpinya", ar: "يجب الغسل للاحتلام" },
        { id: "Wajib berwudhu saja", ar: "يجب الوضوء فقط" },
        { id: "Dianjurkan mandi sebagai kehati-hatian", ar: "يستحب الغسل احتياطًا" }], j: 0,
        b: { id: "Hadits 'Aisyah: \"…merasa mimpi tetapi tidak mendapati basah: tidak wajib mandi\"; Ibnul Mundzir menukil ijma'.", ar: "قال: لا غسل عليه." } },
      { q: { id: "Seseorang dalam keadaan terjaga mendapati mani keluar karena sakit, tanpa nikmat dan tanpa memancar. Menurut syarat dalam modul…", ar: "خرج المني يقظة بلا لذة ولا دفق:" }, o: [
        { id: "Tidak mewajibkan mandi", ar: "لا يوجب الغسل" },
        { id: "Mewajibkan mandi, karena mani keluar", ar: "يوجب الغسل لخروجه" },
        { id: "Mewajibkan mandi, bila banyak", ar: "يوجبه إن كثر" },
        { id: "Mewajibkan tayammum saja", ar: "يوجب التيمم" }], j: 0,
        b: { id: "Ketika terjaga ulama mensyaratkan dua hal: keluar **dengan nikmat** dan **memancar**. Bila tidak ada, tidak masuk sebab wajib mandi ini.", ar: "اشترط العلماء فيه شرطين: أن يخرج بلذة، وأن يخرج متدفقًا." } },
      { q: { id: "Seseorang junub lalu menyelam di kolam yang airnya suci dengan niat mengangkat hadats, tanpa berwudhu dan tanpa urutan. Mandinya…", ar: "انغمس في الماء بنية رفع الحدث:" }, o: [
        { id: "Sah, karena fardhunya hanya meratakan air", ar: "يصح لأن الفرض تعميم البدن" },
        { id: "Tidak sah, karena tidak berwudhu dulu", ar: "لا يصح لترك الوضوء" },
        { id: "Tidak sah, karena tidak mendahulukan kanan", ar: "لا يصح لترك التيامن" },
        { id: "Sah, tetapi wajib mengulang shalatnya", ar: "يصح ويعيد الصلاة" }], j: 0,
        b: { id: "\"Fardhu mandi satu: meratakan air ke badan; bila menyelam dengan niat mengangkat hadats, hadatsnya terangkat.\" Wudhu, tayamun, dsb. adalah sunnah.", ar: "إذا غطس فيه بنية رفع الحدث فإنه يرتفع." } },
      { q: { id: "Hadits mana yang memalingkan perintah mandi setelah memandikan mayit dari wajib menjadi sunnah?", ar: "صارف الأمر بالغسل من تغسيل الميت:" }, o: [
        { id: "\"Mayit kalian tidak najis, cukup mencuci tangan\"", ar: "إن ميتكم ليس بنجس فحسبكم أن تغسلوا أيديكم" },
        { id: "\"Siapa yang memikul mayit hendaklah berwudhu\"", ar: "ومن حمله فليتوضأ" },
        { id: "\"Mandi Jumat wajib bagi setiap yang baligh\"", ar: "غسل الجمعة واجب على كل محتلم" },
        { id: "\"Suruh Abu Bakr mengimami manusia\"", ar: "مروا أبا بكر فليصل بالناس" }], j: 0,
        b: { id: "Modul: \"Kewajiban itu dipalingkan oleh hadits Ibnu 'Abbas: Mayit kalian tidak najis; cukup bagi kalian mencuci tangan.\"", ar: "وصرف الوجوب حديث ابن عباس." } },
      { q: { id: "Disyariatkannya mandi setelah sadar dari gila dalam modul didasarkan pada…", ar: "مشروعية الغسل للجنون:" }, o: [
        { id: "Qiyas aula terhadap pingsan", ar: "القياس على الإغماء من باب أولى" },
        { id: "Hadits khusus tentang orang yang gila", ar: "حديث خاص بالمجنون" },
        { id: "Ijma' yang dinukil Ibnul Mundzir", ar: "إجماع نقله ابن المنذر" },
        { id: "Atsar Ibnu 'Umar sebelum ke mushalla", ar: "أثر ابن عمر" }], j: 0,
        b: { id: "Ibnu 'Utsaimin: \"Mereka mengqiyaskannya pada pingsan; bila disyariatkan untuk pingsan, gila lebih utama.\"", ar: "فالجنون من باب أولى." } },
      { q: { id: "Seseorang bertayammum karena luka di tangan. Setelah lukanya sembuh, tayammumnya…", ar: "تيمم لجرح ثم برئ:" }, o: [
        { id: "Batal karena hilangnya uzur", ar: "يبطل لزوال المبيح" },
        { id: "Tetap berlaku sampai ia berhadats", ar: "يبقى حتى يحدث" },
        { id: "Tetap berlaku sampai habis hari itu", ar: "يبقى إلى آخر اليوم" },
        { id: "Batal hanya bila ia menemukan air", ar: "يبطل بوجود الماء فقط" }], j: 0,
        b: { id: "Pembatal ketiga: **zawal al-mubih** — \"bila ia bertayammum karena suatu sebab atau sakit lalu sembuh, ia kembali memakai air.\"", ar: "أي إذا كان تيمم لعلة أو مرض فزال وبرئ، رجع إلى استعمال الماء." } },
      { q: { id: "Mengapa semua pembatal wudhu juga membatalkan tayammum?", ar: "لماذا ينقض التيمم ما ينقض الوضوء؟" }, o: [
        { id: "Pengganti mengikuti hukum asalnya", ar: "البدل له حكم المبدل" },
        { id: "Tayammum lebih lemah dari wudhu", ar: "التيمم أضعف من الوضوء" },
        { id: "Debu mudah hilang dari kulit", ar: "التراب يزول سريعًا" },
        { id: "Tayammum hanya berlaku untuk satu shalat", ar: "التيمم لصلاة واحدة" }], j: 0,
        b: { id: "\"Karena tayammum adalah pengganti, dan pengganti memiliki hukum yang digantikan.\"", ar: "لأن التيمم بدل، والبدل له حكم المبدل." } },
      { q: { id: "Berdasarkan hadits 'Ammar, urutan dalam tayammum menurut modul adalah…", ar: "صفة التيمم في حديث عمار:" }, o: [
        { id: "Satu tepukan, dikibaskan, lalu tangan dan wajah", ar: "ضربة ثم نفض ثم الكفان والوجه" },
        { id: "Dua tepukan: satu wajah, satu tangan sampai siku", ar: "ضربتان للوجه واليدين إلى المرفقين" },
        { id: "Satu tepukan untuk wajah, lalu tangan sampai siku", ar: "ضربة للوجه ثم إلى المرفقين" },
        { id: "Tiga tepukan, masing-masing untuk satu anggota", ar: "ثلاث ضربات" }], j: 0,
        b: { id: "\"Menepukkan telapaknya sekali ke tanah, mengibaskannya, mengusap punggung telapak, lalu wajah.\" Modul: satu tepukan untuk wajah dan **telapak tangan**.", ar: "ضربة واحدة يمسح وجهه وكفيه." } }
    ],
    bs: [
      { t: { id: "Yang keluar dari dua jalan membatalkan wudhu walaupun sedikit dan walaupun suci.", ar: "الخارج من السبيلين ينقض قليلًا وكثيرًا طاهرًا أو نجسًا." }, j: true, b: { id: "\"Sedikit atau banyak, suci atau najis.\"", ar: "" } },
      { t: { id: "Ijma' yang dinukil Ibnul Mundzir menyatakan pingsan membatalkan wudhu, dan gila lebih utama lagi.", ar: "الإجماع على الوضوء من الإغماء والمجنون أولى." }, j: true, b: { id: "\"Ulama berijma' wajibnya wudhu bagi orang yang pingsan, dan orang gila lebih utama.\"", ar: "والمجنون من باب أولى." } },
      { t: { id: "Menurut dhabit penulis, berhadats kecil hanya mengharamkan shalat.", ar: "لا يحرم على المحدث إلا الصلاة." }, j: false, b: { id: "Tiga: shalat, thawaf, dan menyentuh mushaf.", ar: "يحرم ثلاثة." } },
      { t: { id: "Mani yang keluar ketika tidur mewajibkan mandi walaupun tidak terasa memancar.", ar: "المني في النوم يوجب الغسل ولو بلا دفق." }, j: true, b: { id: "\"Adapun tidur, tidak disyaratkan memancar maupun nikmat; yang disyaratkan hanya melihat air.\"", ar: "إنما يشترط رؤية الماء فقط." } },
      { t: { id: "Bertemunya dua khitan tidak mewajibkan mandi bila tidak keluar mani.", ar: "التقاء الختانين بلا إنزال لا يوجب الغسل." }, j: false, b: { id: "\"…wajib mandi **walaupun tidak keluar**.\"", ar: "وجب الغسل وإن لم ينزل." } },
      { t: { id: "Muwalah dalam mandi hukumnya wajib sebagaimana dalam wudhu.", ar: "الموالاة في الغسل واجبة." }, j: false, b: { id: "Dalam bab mandi, muwalah disebut di antara **sunnah**: \"disunnahkan bersambung dalam mandi.\"", ar: "فيستحب أن يوالي." } },
      { t: { id: "Orang kafir yang masuk Islam wajib mandi menurut pendapat terkuat, walaupun ia orang murtad yang kembali.", ar: "يجب الغسل على من أسلم ولو مرتدًا." }, j: true, b: { id: "\"Menurut pendapat terkuat — walaupun ia murtad.\"", ar: "ولو مرتدًا." } },
      { t: { id: "Tayammum hanya sah dengan tanah yang berdebu dan tidak sah dengan batu.", ar: "لا يصح التيمم بالحجارة." }, j: false, b: { id: "Sha'id mencakup tanah, pasir, batu besar, dan bebatuan — bagian permukaan bumi; disyaratkan suci dan berdebu.", ar: "كالتراب والرمال والصخور والحجارة." } },
      { t: { id: "Menemukan air membatalkan tayammum bila tayammumnya karena tidak ada air.", ar: "وجود الماء ينقض التيمم لعدمه." }, j: true, b: { id: "\"Bila ia mendapat air, hendaklah menyentuhkannya ke kulitnya.\"", ar: "فإذا وجد الماء فليمسه بشرته." } }
    ],
    jodoh: [
      { a: { id: "Daging unta", ar: "لحم الإبل" }, b: { id: "Kekhasan mazhab Ahmad", ar: "من إفرادات مذهب أحمد" } },
      { a: { id: "Murtad membatalkan wudhu", ar: "الردة" }, b: { id: "Pilihan Ibnu Taimiyah", ar: "اختيار شيخ الإسلام" } },
      { a: { id: "Menyentuh mushaf tanpa wudhu", ar: "مس المصحف" }, b: { id: "Hanya diselisihi Dawud azh-Zhahiri", ar: "إلا داود" } },
      { a: { id: "Mani saat terjaga", ar: "المني يقظة" }, b: { id: "Disyaratkan nikmat & memancar", ar: "بلذة ودفق" } },
      { a: { id: "Mani saat tidur", ar: "المني نومًا" }, b: { id: "Cukup melihat basah", ar: "رؤية الماء" } },
      { a: { id: "Fardhu mandi", ar: "فرض الغسل" }, b: { id: "Meratakan air ke badan", ar: "تعميم البدن" } },
      { a: { id: "Mandi paling ditekankan", ar: "آكد الأغسال" }, b: { id: "Mandi Jumat", ar: "غسل الجمعة" } },
      { a: { id: "Zawal al-mubih", ar: "زوال المبيح" }, b: { id: "Sembuh dari sakit setelah tayammum", ar: "برء المريض" } }
    ],
    pilah: { t: { id: "Pilah: membatalkan WUDHU, mewajibkan MANDI, atau termasuk mandi SUNNAH?", ar: "صنف." }, kategori: [{ id: "Membatalkan wudhu saja", ar: "ينقض الوضوء" }, { id: "Mewajibkan mandi", ar: "يوجب الغسل" }, { id: "Mandi sunnah", ar: "غسل مستحب" }], item: [
      { t: { id: "Kentut", ar: "الريح" }, k: 0 },
      { t: { id: "Tidur pulas", ar: "النوم المستغرق" }, k: 0 },
      { t: { id: "Makan daging unta", ar: "أكل لحم الإبل" }, k: 0 },
      { t: { id: "Menyentuh kemaluan tanpa penghalang", ar: "مس الفرج بلا حائل" }, k: 0 },
      { t: { id: "Selesainya haidh", ar: "انقطاع الحيض" }, k: 1 },
      { t: { id: "Bertemunya dua khitan", ar: "التقاء الختانين" }, k: 1 },
      { t: { id: "Orang kafir masuk Islam", ar: "إسلام الكافر" }, k: 1 },
      { t: { id: "Hari Jumat", ar: "يوم الجمعة" }, k: 2 },
      { t: { id: "Setelah memandikan mayit", ar: "تغسيل الميت" }, k: 2 },
      { t: { id: "Sebelum ihram", ar: "الإحرام" }, k: 2 },
      { t: { id: "Wukuf di 'Arafah", ar: "الوقوف بعرفة" }, k: 2 }
    ] },
    isian: [
      { t: { id: "Abu Hurairah menafsirkan hadats dengan ______ tanpa suara atau bersuara.", ar: "الحدث: فساء أو ______." }, j: { id: "kentut", ar: "ضراط" }, x: [{ id: "kencing", ar: "بول" }, { id: "tidur", ar: "نوم" }, { id: "madzi", ar: "مذي" }] },
      { t: { id: "\"Mata adalah tali pengikat ______; siapa tidur hendaklah berwudhu.\"", ar: "العين وكاء ______." }, j: { id: "dubur (as-sah)", ar: "السه" }, x: [{ id: "hati", ar: "القلب" }, { id: "jiwa", ar: "النفس" }, { id: "akal", ar: "العقل" }] },
      { t: { id: "Fardhu mandi hanya satu, yaitu ______ air ke seluruh badan.", ar: "فرض الغسل: ______ البدن بالماء." }, j: { id: "meratakan", ar: "تعميم" }, x: [{ id: "menggosokkan", ar: "دلك" }, { id: "mengurutkan", ar: "ترتيب" }, { id: "mengulang tiga kali", ar: "تثليث" }] },
      { t: { id: "Tayammum dilakukan dengan ______ tepukan untuk wajah dan kedua telapak.", ar: "التيمم ضربة ______." }, j: { id: "satu", ar: "واحدة" }, x: [{ id: "dua", ar: "ضربتان" }, { id: "tiga", ar: "ثلاث" }, { id: "empat", ar: "أربع" }] }
    ]
  }
});

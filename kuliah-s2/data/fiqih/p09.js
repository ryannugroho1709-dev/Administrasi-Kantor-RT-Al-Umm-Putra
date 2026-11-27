/* Fiqih Ibadah — Pertemuan 9: Kitab Zakat */
Kuliah.pertemuan("fiqih", {
  no: 9, motif: "mizan", motifOpt: { l1: "النصاب", l2: "الحول", lbl: "كتاب الزكاة" }, tema: 3, durasi: 30,
  bab: { id: "Kitab Zakat", ar: "كتاب الزكاة" },
  judul: { id: "Kitab Zakat: Harta Wajib Zakat, Syarat, Kadar, dan Penerima", ar: "كتاب الزكاة: الأموال الزكوية وشروطها ومقاديرها وأهلها" },
  ringkas: {
    id: "Kitab Zakat dalam **enam dhabit**: lima jenis harta wajib zakat (emas-perak/uang, hewan ternak, hasil bumi, barang dagangan, rikaz), lima syarat wajib, empat harta yang tidak disyaratkan haul, enam kadar zakat (termasuk zakat fitrah dan tabel unta-sapi-kambing), delapan ashnaf penerima, dan lima golongan yang tidak boleh diberi zakat.",
    ar: "كتاب الزكاة وفيه ستة ضوابط: الأموال الزكوية الخمسة، وشروط الوجوب، وما لا يشترط فيه الحول، ومقادير الزكاة، وأهل الزكاة الثمانية، ومن لا يجزئ دفعها إليهم."
  },
  tujuan: [
    { id: "Menyebut lima jenis harta wajib zakat dan nishabnya.", ar: "ذكر الأموال الزكوية وأنصبتها." },
    { id: "Menghitung nishab emas dan perak dalam gram.", ar: "حساب نصاب الذهب والفضة بالجرامات." },
    { id: "Menyebut syarat wajib zakat dan harta yang tidak disyaratkan haul.", ar: "ذكر شروط الوجوب وما لا يشترط فيه الحول." },
    { id: "Menerapkan kadar zakat: 1/5, 1/10, 1/20, 1/40, satu sha', dan tabel hewan ternak.", ar: "تطبيق المقادير." },
    { id: "Membedakan delapan ashnaf penerima dari golongan yang tidak boleh menerima.", ar: "التفريق بين أهل الزكاة ومن لا تدفع إليهم." }
  ],
  isi: [
    { t: "pembuka", id: "Pertemuan kesembilan membuka **Kitab Zakat**. Zakat adalah salah satu rukun dan bangunan agung Islam: **siapa yang mengingkari kewajibannya kafir**, keluar dari agama. Abu Bakr memerangi para penolak zakat; Ibnu Qudamah: kaum muslimin di setiap masa berijma' atas wajibnya, dan para sahabat sepakat memerangi penolaknya.", ar: "والزكاة أحد أركان الإسلام ومبانيه العظام، من جحد وجوبها فهو كافر." },
    { t: "definisi", judul: { id: "Az-Zakah", ar: "الزكاة" },
      lughah: { id: "**Tumbuh dan bertambah** — *zaka az-zar'u*: tanaman tumbuh dan banyak.", ar: "النماء والزيادة." },
      istilah: { id: "**Bagian yang ditentukan syariat, diserahkan dari harta tertentu kepada golongan tertentu.**", ar: "نصيبٌ مقدرٌ شرعًا يُصرف من مالٍ معين لطائفةٍ مخصوصة." } },
    { t: "p", id: "\"Bagian yang ditentukan\": seperlima pada rikaz, seperempat puluh pada uang dan barang dagangan, sepersepuluh atau setengahnya pada hasil bumi. \"Harta tertentu\": **tidak semua harta** dizakati — ini rahmat Allah bagi orang kaya sebelum orang miskin. \"Golongan tertentu\": yang disebut Allah dalam Kitab-Nya. Dalil: {وَآتُوا الزَّكَاةَ}, {خُذْ مِنْ أَمْوَالِهِمْ صَدَقَةً تُطَهِّرُهُمْ وَتُزَكِّيهِم بِهَا}, dan hadits \"Islam dibangun di atas lima\".", ar: "" },

    { t: "judul", id: "Dhabit 1: Lima Jenis Harta Wajib Zakat", ar: "الضابط الأول: الأموال التي تجب فيها الزكاة خمسة" },
    { t: "p", id: "Ulama sepakat atas empat di antaranya dan berselisih pada yang kelima.", ar: "وهذه الخمسة أيضًا اتفق العلماء على أربعة منها واختلفوا في الخامس." },
    { t: "tabel", kolom: [{ id: "Jenis", ar: "الصنف" }, { id: "Nishab & keterangan", ar: "النصاب" }], baris: [
      [{ id: "**1. Atsman** — emas, perak, dan yang menggantikannya (uang kertas, cek: zakatnya zakat emas menurut pendapat rajih)", ar: "الأثمان" }, { id: "Emas **20 mitsqal** (1 mitsqal ≈ 4¼ g emas murni → ±**85 g** emas 24 karat; ±97 g bila 21 karat; ±113 g bila 18 karat). Perak **200 dirham** (5 uqiyah × 40 dirham; 1 dirham ≈ 3 g → ±**600 g**). Emas dan perak **tidak digabungkan**: 100 dirham + 10 dinar tidak wajib zakat. Ancaman: {وَالَّذِينَ يَكْنِزُونَ الذَّهَبَ وَالْفِضَّةَ…} dan hadits lempengan api.", ar: "" }],
      [{ id: "**2. Bahimatul an'am** — unta, sapi, kambing", ar: "بهيمة الأنعام" }, { id: "Tiga syarat: **saimah** (merumput sendiri tanpa biaya pakan), mencapai nishab, dan berlalu haul.", ar: "أن تكون سائمة، وأن تبلغ النصاب، وأن يحول عليها الحول." }],
      [{ id: "**3. Hasil bumi**", ar: "الخارج من الأرض" }, { id: "Nishab **5 wasaq** (1 wasaq = 60 sha'; 1 sha' = 4 mud cakupan dua telapak orang dewasa) — gandum ±600 kg. Jumhur: wajib pada setiap biji dan buah yang **ditakar/ditimbang, kering, dan bisa disimpan**, walau bukan makanan pokok; Hanafiyyah: pada semua yang keluar dari bumi.", ar: "" }],
      [{ id: "**4. 'Urudh at-tijarah** — barang dagangan", ar: "عروض التجارة" }, { id: "Harta yang disiapkan untuk diperdagangkan; dinamai *'urudh* karena tidak menetap. Pendapat jumhur; Ibnul Mundzir: ijma' zakatnya bila telah berlalu haul.", ar: "" }],
      [{ id: "**5. Rikaz**", ar: "الركاز" }, { id: "Harta terpendam dari masa jahiliyah tanpa tanda-tanda Islam. *\"…dan pada rikaz seperlima.\"*", ar: "" }]
    ] },
    { t: "hadits", ar: "فِيمَا سَقَتِ السَّمَاءُ وَالْعُيُونُ أَوْ كَانَ عَثَرِيًّا الْعُشْرُ، وَفِيمَا سُقِيَ بِالنَّضْحِ نِصْفُ الْعُشْرِ", id: "Pada tanaman yang diairi hujan dan mata air, atau yang menyerap sendiri, zakatnya sepersepuluh; pada yang diairi dengan pengairan (berbiaya), setengah dari sepersepuluh.", src: "HR. al-Bukhari, dari Ibnu 'Umar" },

    { t: "judul", id: "Dhabit 2: Lima Syarat Wajib Zakat", ar: "الضابط الثاني: شروط وجوب الزكاة خمسة" },
    { t: "hukum", item: [
      { h: "info", judul: { id: "Islam", ar: "الإسلام" }, id: "Tidak wajib atas orang kafir dan tidak diterima walau ia mengeluarkannya. Ibnu 'Utsaimin: *\"Orang kafir itu najis walau disucikan dengan air laut dan emas sepenuh bumi, ia tidak suci hingga bertaubat dari kekafirannya.\"*", ar: "" },
      { h: "info", judul: { id: "Merdeka", ar: "الحرية" }, id: "Harta budak milik tuannya. Ibnul Mundzir: ijma' tidak ada zakat pada harta mukatab hingga ia merdeka.", ar: "" },
      { h: "info", judul: { id: "Memiliki nishab dengan kepemilikan sempurna", ar: "ملك النصاب ملكًا تامًا" }, id: "Hartanya stabil di tangan pemilik. Yang belum stabil tidak dizakati: sewa rumah sebelum ditempati, upah sebelum bekerja, mahar sebelum dukhul, bagian mudharib sebelum laba dibagi.", ar: "" },
      { h: "info", judul: { id: "Berlalu haul (setahun hijriah)", ar: "تمام الحول" }, id: "*\"Tidak ada zakat pada harta hingga berlalu haul atasnya\"* — misalnya Muharram ke Muharram, Rajab ke Rajab. Kecuali empat harta (dhabit 3).", ar: "" }
    ] },
    { t: "hukum", judul: { id: "Dhabit 3 — Empat harta yang tidak disyaratkan haul", ar: "أموال لا يشترط فيها تمام الحول" }, item: [
      { h: "info", judul: { id: "Hasil bumi", ar: "الخارج من الأرض" }, id: "Wajib saat panen: {وَآتُوا حَقَّهُ يَوْمَ حَصَادِهِ} — tanpa khilaf.", ar: "" },
      { h: "info", judul: { id: "Anak hewan ternak (nitaj)", ar: "نتاج بهيمة الأنعام" }, id: "Punya 40 kambing, setelah haul menjadi 200 → zakatnya dua kambing. Petugas zakat Nabi ﷺ menghitung semua, termasuk anak kambing yang baru lahir.", ar: "" },
      { h: "info", judul: { id: "Laba barang dagangan", ar: "ربح عروض التجارة" }, id: "Modal 100 ribu, setelah setahun modal+laba menjadi 150 ribu → semuanya dizakati; cabang mengikuti pokok.", ar: "فالفرع يلحق بالأصل." },
      { h: "info", judul: { id: "Rikaz", ar: "الركاز" }, id: "Begitu ditemukan, langsung dikeluarkan seperlimanya.", ar: "" }
    ] },

    { t: "judul", id: "Dhabit 4: Enam Kadar Zakat", ar: "الضابط الرابع: مقادير الزكاة ستة" },
    { t: "tabel", kolom: [{ id: "Kadar", ar: "المقدار" }, { id: "Pada harta", ar: "في" }], baris: [
      [{ id: "**Seperlima (20%)** — yang tertinggi", ar: "الخمس" }, { id: "Rikaz", ar: "الركاز" }],
      [{ id: "**Sepersepuluh (10%)**", ar: "العشر" }, { id: "Hasil bumi tanpa biaya pengairan", ar: "" }],
      [{ id: "**Setengah sepersepuluh (5%)**", ar: "نصف العشر" }, { id: "Hasil bumi dengan biaya pengairan", ar: "" }],
      [{ id: "**Seperempat puluh (2,5%)**", ar: "ربع العشر" }, { id: "Uang dan barang dagangan — *\"200 dirham: 5 dirham; 20 mitsqal: ½ mitsqal\"*", ar: "" }],
      [{ id: "**Satu sha' makanan**", ar: "صاع من طعام" }, { id: "Zakat fitrah, menurut pendapat rajih — atas budak dan merdeka, laki-laki dan perempuan, kecil dan besar; ditunaikan sebelum shalat 'Id; wajib atas yang punya kelebihan dari makanan hari 'Id. **Jumhur: tidak dikeluarkan dalam bentuk uang (qimah).**", ar: "والجمهور على أن القيمة لا تخرج." }],
      [{ id: "**Rincian hewan ternak**", ar: "بهيمة الأنعام على تفصيلها" }, { id: "Lihat tabel di bawah", ar: "" }]
    ] },
    { t: "tabel", judul: { id: "Zakat unta (surat Abu Bakr kepada Anas)", ar: "زكاة الإبل" }, kolom: [{ id: "Jumlah unta", ar: "العدد" }, { id: "Zakatnya", ar: "الواجب" }], baris: [
      ["1–4", { id: "Tidak ada (kecuali sukarela)", ar: "لا شيء" }],
      ["5–9", { id: "1 kambing", ar: "شاة" }], ["10–14", { id: "2 kambing", ar: "شاتان" }], ["15–19", { id: "3 kambing", ar: "ثلاث" }], ["20–24", { id: "4 kambing", ar: "أربع" }],
      ["25–35", { id: "**Bintu makhadh** — unta betina genap 1 tahun", ar: "بنت مخاض" }],
      ["36–45", { id: "**Bintu labun** — genap 2 tahun", ar: "بنت لبون" }],
      ["46–60", { id: "**Hiqqah** — genap 3 tahun", ar: "حقة" }],
      ["61–75", { id: "**Jadza'ah** — genap 4 tahun", ar: "جذعة" }],
      ["76–90", { id: "2 bintu labun", ar: "بنتا لبون" }], ["91–120", { id: "2 hiqqah", ar: "حقتان" }],
      [{ id: "> 120", ar: "" }, { id: "Tiap 40: 1 bintu labun; tiap 50: 1 hiqqah", ar: "" }]
    ] },
    { t: "banding", kiri: { judul: { id: "Sapi", ar: "البقر" }, poin: [{ id: "Tiap 30: *tabi'/tabi'ah* (umur 1 tahun)", ar: "تبيع أو تبيعة" }, { id: "Tiap 40: *musinnah* (umur 2 tahun)", ar: "مسنة" }] },
      kanan: { judul: { id: "Kambing (saimah)", ar: "الغنم" }, poin: [{ id: "40–120: 1 kambing", ar: "" }, { id: "121–200: 2 kambing", ar: "" }, { id: "201–300: 3 kambing", ar: "" }, { id: "Lebih dari 300: tiap 100 satu kambing", ar: "" }] } },

    { t: "judul", id: "Dhabit 5: Delapan Penerima Zakat", ar: "الضابط الخامس: أهل الزكاة ثمانية" },
    { t: "ayat", ar: "إِنَّمَا الصَّدَقَاتُ لِلْفُقَرَاءِ وَالْمَسَاكِينِ وَالْعَامِلِينَ عَلَيْهَا وَالْمُؤَلَّفَةِ قُلُوبُهُمْ وَفِي الرِّقَابِ وَالْغَارِمِينَ وَفِي سَبِيلِ اللَّهِ وَابْنِ السَّبِيلِ ۖ فَرِيضَةً مِّنَ اللَّهِ", id: "Allah **membatasi** zakat pada delapan golongan ini — pendapat jumhur, berbeda dengan Hanafiyyah yang meluaskan; bila diperluas, pembatasan dalam ayat tidak bernilai lagi.", src: "QS. At-Taubah: 60" },
    { t: "tabel", kolom: [{ id: "Golongan", ar: "الصنف" }, { id: "Definisi menurut modul", ar: "التعريف" }], baris: [
      [{ id: "**Fakir**", ar: "الفقراء" }, { id: "Tidak punya, atau punya **setengah kecukupan atau kurang**. *\"Sedekah tidak halal bagi orang kaya dan orang kuat yang mampu bekerja.\"*", ar: "" }],
      [{ id: "**Miskin**", ar: "المسكين" }, { id: "Punya **setengah kecukupan atau lebih**, tetapi tidak mencukupi — pemilik perahu disebut miskin (Al-Kahf: 79). Fakir dan miskin: bila disebut bersama berbeda, bila terpisah saling mencakup; **fakir lebih rendah**.", ar: "" }],
      [{ id: "**'Amil**", ar: "العاملون عليها" }, { id: "Petugas yang ditunjuk imam untuk mengumpulkan, menjaga, mendata, dan membagikan zakat.", ar: "" }],
      [{ id: "**Muallaf**", ar: "المؤلفة قلوبهم" }, { id: "Pemimpin yang ditaati kaumnya, diharapkan Islamnya atau dicegah keburukannya — seperti al-Aqra' bin Habis, 'Uyainah bin Badr.", ar: "" }],
      [{ id: "**Riqab**", ar: "في الرقاب" }, { id: "Budak yang membuat perjanjian kitabah dengan tuannya, dibantu hingga merdeka.", ar: "" }],
      [{ id: "**Gharim**", ar: "الغارمون" }, { id: "Orang yang menanggung utang karena sebab mubah, atau menanggung beban (damai) untuk orang lain; juga yang hartanya musnah tertimpa bencana.", ar: "" }],
      [{ id: "**Fi sabilillah**", ar: "في سبيل الله" }, { id: "Jalan yang mengantarkan kepada Allah, yaitu **jihad**, dan apa yang membantunya.", ar: "" }],
      [{ id: "**Ibnu sabil**", ar: "ابن السبيل" }, { id: "Musafir asing yang kehabisan bekal di luar negerinya (bukan yang baru memulai safar dari negerinya) — diberi hingga sampai tujuan lalu pulang.", ar: "" }]
    ] },
    { t: "hukum", judul: { id: "Dhabit 6 — Lima golongan yang tidak boleh diberi zakat", ar: "الذين لا يجزئ دفع الزكاة لهم خمسة" }, item: [
      { h: "haram", judul: { id: "Orang kafir", ar: "الكافر" }, id: "*\"…diambil dari orang kaya mereka lalu dikembalikan kepada orang fakir mereka\"* (kaum muslimin). Ibnul Mundzir: ijma' dzimmi tidak diberi zakat — kecuali bila ia muallaf.", ar: "" },
      { h: "haram", judul: { id: "Orang kaya", ar: "الغني" }, id: "Kaya karena harta, keterampilan, atau kekuatan badannya: *\"Tidak ada bagian padanya bagi orang kaya dan orang kuat yang mampu bekerja.\"*", ar: "" },
      { h: "haram", judul: { id: "Budak (raqiq)", ar: "الرقيق" }, id: "Bila ia mengambil harta bukan untuk kitabah, sebenarnya untuk kepentingan tuannya.", ar: "" },
      { h: "haram", judul: { id: "Ahlul Bait Nabi ﷺ (Bani Hasyim)", ar: "آل بيت النبي ﷺ" }, id: "Mereka manusia termulia, maka tidak mengambil zakat.", ar: "" },
      { h: "haram", judul: { id: "Orang yang wajib dinafkahi pemberi zakat", ar: "من تلزمه نفقته" }, id: "Istri, anak, orang tua. Ibnul Mundzir: ijma' tidak boleh kepada orang tua dan anak saat ia wajib menafkahi mereka. **Tetapi istri boleh memberi zakat kepada suaminya**, karena nafkah suami tidak wajib atas istri — *\"Ibnu Mas'ud benar, suamimu dan anakmu lebih berhak menerima sedekahmu.\"*", ar: "لكن يجوز للمرأة أن تعطي الزكاة لزوجها." }
    ] },
    { t: "cek", q: { id: "Seseorang punya tabungan uang senilai 70 g emas dan perhiasan perak 300 g. Menurut modul, apakah ia wajib zakat?", ar: "" }, o: [
      { id: "Tidak; emas & perak tak digabung", ar: "لا يضم بعضها إلى بعض" },
      { id: "Ya, karena totalnya melewati nishab", ar: "نعم بالضم" },
      { id: "Ya, tetapi hanya pada bagian perak", ar: "نعم في الفضة" },
      { id: "Ya, bila dihitung menurut harga pasar", ar: "نعم بالقيمة" }], j: 0,
      b: { id: "Emas di bawah ±85 g dan perak di bawah ±600 g; \"tidak digabungkan satu sama lain\" — seperti contoh 100 dirham dan 10 dinar.", ar: "ولا يُضم بعضها الى بعض." } },
    { t: "ringkasan", item: [
      { id: "Harta zakat: uang/emas-perak, hewan ternak saimah, hasil bumi, barang dagangan, rikaz.", ar: "" },
      { id: "Nishab: emas 20 mitsqal (±85 g), perak 200 dirham (±600 g), hasil bumi 5 wasaq (±600 kg gandum), kambing 40, sapi 30, unta 5.", ar: "" },
      { id: "Syarat: Islam, merdeka, milik sempurna atas nishab, haul — kecuali hasil bumi, anak ternak, laba dagang, rikaz.", ar: "" },
      { id: "Kadar: 1/5 rikaz, 1/10 atau 1/20 hasil bumi, 1/40 uang & dagangan, satu sha' zakat fitrah, rincian ternak.", ar: "" },
      { id: "Penerima delapan ashnaf (dibatasi); tidak boleh kepada kafir, kaya, budak, Bani Hasyim, dan tanggungan nafkah — istri boleh ke suami.", ar: "" }
    ] }
  ],
  istilah: [
    { ar: "النصاب", latin: "an-nishab", id: "Nishab", def: { id: "Batas minimal harta yang mewajibkan zakat.", ar: "" } },
    { ar: "الحول", latin: "al-haul", id: "Haul", def: { id: "Berlalunya satu tahun hijriah atas harta.", ar: "" } },
    { ar: "المثقال", latin: "al-mitsqal", id: "Mitsqal/dinar", def: { id: "± 4¼ gram emas murni; nishab emas 20 mitsqal.", ar: "" } },
    { ar: "السائمة", latin: "as-saimah", id: "Saimah", def: { id: "Ternak yang merumput sendiri tanpa biaya pakan.", ar: "" } },
    { ar: "الوسق", latin: "al-wasq", id: "Wasaq", def: { id: "60 sha'; nishab hasil bumi 5 wasaq.", ar: "" } },
    { ar: "عروض التجارة", latin: "'urudh at-tijarah", id: "Barang dagangan", def: { id: "Harta yang disiapkan untuk jual-beli dan laba.", ar: "" } },
    { ar: "الركاز", latin: "ar-rikaz", id: "Rikaz", def: { id: "Harta terpendam dari masa jahiliyah tanpa tanda Islam; zakatnya seperlima.", ar: "" } },
    { ar: "بنت مخاض", latin: "bintu makhadh", id: "Bintu makhadh", def: { id: "Unta betina genap satu tahun; zakat 25–35 unta.", ar: "" } },
    { ar: "الغارم", latin: "al-gharim", id: "Gharim", def: { id: "Orang yang menanggung utang karena sebab mubah.", ar: "" } },
    { ar: "ابن السبيل", latin: "ibnu sabil", id: "Ibnu sabil", def: { id: "Musafir yang kehabisan bekal di luar negerinya.", ar: "" } }
  ],
  latihan: {
    pg: [
      { q: { id: "Seorang pedagang memulai modal Rp100 juta; setahun kemudian modal dan laba menjadi Rp150 juta. Yang dizakati…", ar: "" }, o: [
        { id: "Rp150 juta, laba ikut modal", ar: "الجميع تبعًا للأصل" },
        { id: "Modal Rp100 juta, tanpa labanya", ar: "رأس المال فقط" },
        { id: "Laba Rp50 juta, tanpa modalnya", ar: "الربح فقط" },
        { id: "Laba dizakati setahun berikutnya", ar: "الربح بعد حول" }], j: 0,
        b: { id: "Laba dagang tidak disyaratkan haul sendiri: \"cabang mengikuti pokok.\"", ar: "" } },
      { q: { id: "Seorang peternak punya 40 kambing di awal haul; di akhir haul jumlahnya 200 karena beranak. Zakatnya…", ar: "" }, o: [
        { id: "Dua ekor kambing", ar: "شاتان" },
        { id: "Satu ekor kambing", ar: "شاة" },
        { id: "Tiga ekor kambing", ar: "ثلاث شياه" },
        { id: "Belum wajib zakat pada tahun ini", ar: "لا شيء" }], j: 0,
        b: { id: "Anak ternak mengikuti induknya tanpa haul sendiri; 121–200 kambing → dua ekor.", ar: "" } },
      { q: { id: "Seorang petani mengairi sawahnya dengan pompa berbiaya. Kadar zakat padinya…", ar: "" }, o: [
        { id: "Separuh sepersepuluh (5%)", ar: "نصف العشر" },
        { id: "Sepersepuluh penuh (10%)", ar: "العشر" },
        { id: "Seperempat puluh (2,5%) saja", ar: "ربع العشر" },
        { id: "Seperlima bagian (20%)", ar: "الخمس" }], j: 0,
        b: { id: "*\"…pada yang diairi dengan pengairan, setengah dari sepersepuluh.\"*", ar: "" } },
      { q: { id: "Sayuran segar yang dijual per ikat, menurut jumhur dalam modul…", ar: "" }, o: [
        { id: "Tidak wajib zakat hasil bumi", ar: "لا زكاة فيها" },
        { id: "Wajib sepersepuluh bila diairi hujan", ar: "العشر" },
        { id: "Wajib seperempat puluh dari harganya", ar: "ربع العشر من قيمتها" },
        { id: "Wajib bila panen mencapai 5 wasaq", ar: "إذا بلغت خمسة أوسق" }], j: 0,
        b: { id: "Jumhur: wajib pada biji/buah yang **ditakar atau ditimbang, kering, dan bisa disimpan**; sayur dan buah segar tidak termasuk. Hanafiyyah mewajibkan pada semua hasil bumi.", ar: "" } },
      { q: { id: "Seseorang menerima uang muka sewa rumah setahun, tetapi penyewa belum menempatinya. Menurut syarat \"kepemilikan sempurna\"…", ar: "" }, o: [
        { id: "Belum dizakati, belum stabil", ar: "لا زكاة حتى يستقر" },
        { id: "Langsung dizakati seluruhnya", ar: "يزكيه فورًا" },
        { id: "Dizakati separuhnya saja", ar: "يزكي نصفه" },
        { id: "Wajib dikembalikan kepada penyewa", ar: "يرده" }], j: 0,
        b: { id: "Contoh modul: sewa rumah sebelum ditempati, upah sebelum bekerja, mahar sebelum dukhul — harta belum stabil, tidak dizakati hingga stabil dan berlalu haul.", ar: "" } },
      { q: { id: "Seseorang memiliki 30 ekor unta saimah. Zakatnya…", ar: "" }, o: [
        { id: "Bintu makhadh", ar: "بنت مخاض" },
        { id: "Satu bintu labun", ar: "بنت لبون" },
        { id: "Enam ekor kambing", ar: "ست شياه" },
        { id: "Satu hiqqah", ar: "حقة" }], j: 0,
        b: { id: "25–35 unta: bintu makhadh (unta betina genap setahun).", ar: "" } },
      { q: { id: "Menurut jumhur dalam modul, bolehkah zakat fitrah dikeluarkan berupa uang?", ar: "" }, o: [
        { id: "Tidak; dikeluarkan makanan", ar: "لا تخرج القيمة" },
        { id: "Boleh, bahkan lebih utama", ar: "تجوز وهي أفضل" },
        { id: "Wajib berupa uang di kota", ar: "تجب القيمة في المدن" },
        { id: "Boleh bila disepakati keluarga", ar: "تجوز بالاتفاق" }], j: 0,
        b: { id: "\"Mereka berselisih tentang qimah; **jumhur: qimah tidak dikeluarkan**.\"", ar: "" } },
      { q: { id: "Seseorang punya rumah dan gaji, tetapi gajinya hanya cukup 60% kebutuhan. Menurut definisi modul ia termasuk…", ar: "" }, o: [
        { id: "Miskin", ar: "مسكين" },
        { id: "Fakir", ar: "فقير" },
        { id: "Gharim", ar: "غارم" },
        { id: "Ibnu sabil", ar: "ابن السبيل" }], j: 0,
        b: { id: "Fakir: tidak punya atau setengah kecukupan ke bawah; **miskin: setengah kecukupan ke atas tetapi belum cukup**.", ar: "" } },
      { q: { id: "Seorang istri kaya ingin memberikan zakatnya kepada suaminya yang fakir. Menurut modul…", ar: "" }, o: [
        { id: "Boleh, nafkah suami tak wajib atasnya", ar: "يجوز" },
        { id: "Tidak boleh, karena tanggungan keluarga", ar: "لا يجوز" },
        { id: "Boleh, hanya untuk zakat fitrah", ar: "يجوز في الفطر فقط" },
        { id: "Makruh, sebaiknya kepada orang lain", ar: "يكره" }], j: 0,
        b: { id: "\"Boleh bagi wanita memberi zakat kepada suaminya, karena nafkah suami tidak wajib atasnya\" — hadits istri Ibnu Mas'ud.", ar: "" } },
      { q: { id: "Seseorang menemukan peti koin kuno berlambang raja pra-Islam di kebunnya. Kewajibannya…", ar: "" }, o: [
        { id: "Keluarkan 1/5 segera, tanpa haul", ar: "الخمس فورًا" },
        { id: "Keluarkan 1/40 setelah setahun", ar: "ربع العشر بعد حول" },
        { id: "Keluarkan 1/10 saat dijual", ar: "العشر عند البيع" },
        { id: "Tidak ada zakat karena itu rezeki tak terduga", ar: "لا شيء" }], j: 0,
        b: { id: "Rikaz: harta terpendam jahiliyah; \"begitu ditemukan dikeluarkan seperlima\" — tanpa haul.", ar: "" } }
    ],
    bs: [
      { t: { id: "Orang yang mengingkari kewajiban zakat menjadi kafir.", ar: "" }, j: true, b: { id: "", ar: "" } },
      { t: { id: "Uang kertas tidak wajib dizakati karena bukan emas dan perak.", ar: "" }, j: false, b: { id: "Zakatnya zakat emas menurut pendapat rajih.", ar: "" } },
      { t: { id: "Hasil bumi dizakati saat panen tanpa menunggu haul.", ar: "" }, j: true, b: { id: "{وَآتُوا حَقَّهُ يَوْمَ حَصَادِهِ}", ar: "" } },
      { t: { id: "Menurut jumhur, kambing yang diberi pakan sepanjang tahun tetap wajib zakat ternak.", ar: "" }, j: false, b: { id: "Disyaratkan saimah.", ar: "" } },
      { t: { id: "Zakat fitrah ditunaikan sebelum orang keluar menuju shalat 'Id.", ar: "" }, j: true, b: { id: "", ar: "" } },
      { t: { id: "Hanafiyyah membatasi penerima zakat lebih ketat daripada jumhur.", ar: "" }, j: false, b: { id: "Hanafiyyah justru **meluaskan**.", ar: "" } },
      { t: { id: "Orang dzimmi boleh diberi zakat bila ia termasuk muallaf.", ar: "" }, j: true, b: { id: "\"…kecuali bila ia muallaf.\"", ar: "" } }
    ],
    jodoh: [
      { a: { id: "Rikaz", ar: "الركاز" }, b: { id: "Seperlima", ar: "الخمس" } },
      { a: { id: "Uang & dagangan", ar: "الأثمان والعروض" }, b: { id: "Seperempat puluh", ar: "ربع العشر" } },
      { a: { id: "Tadah hujan", ar: "ما سقت السماء" }, b: { id: "Sepersepuluh", ar: "العشر" } },
      { a: { id: "30 sapi", ar: "ثلاثون بقرة" }, b: { id: "Tabi' / tabi'ah", ar: "تبيع أو تبيعة" } },
      { a: { id: "40 sapi", ar: "أربعون بقرة" }, b: { id: "Musinnah", ar: "مسنة" } },
      { a: { id: "Nishab perak", ar: "نصاب الفضة" }, b: { id: "200 dirham (±600 g)", ar: "مائتا درهم" } },
      { a: { id: "Nishab emas", ar: "نصاب الذهب" }, b: { id: "20 mitsqal (±85 g)", ar: "عشرون مثقالًا" } }
    ],
    pilah: { t: { id: "Pilah: BOLEH atau TIDAK BOLEH menerima zakat?", ar: "" }, kategori: [{ id: "Boleh", ar: "يجوز" }, { id: "Tidak boleh", ar: "لا يجوز" }], item: [
      { t: { id: "'Amil yang ditunjuk imam", ar: "" }, k: 0 }, { t: { id: "Musafir kehabisan bekal", ar: "" }, k: 0 }, { t: { id: "Suami fakir dari istrinya", ar: "" }, k: 0 }, { t: { id: "Orang yang terlilit utang mubah", ar: "" }, k: 0 },
      { t: { id: "Ayah kandung yang dinafkahi", ar: "" }, k: 1 }, { t: { id: "Keturunan Bani Hasyim", ar: "" }, k: 1 }, { t: { id: "Pemuda kuat yang mampu bekerja", ar: "" }, k: 1 }, { t: { id: "Orang kafir non-muallaf", ar: "" }, k: 1 }
    ] },
    isian: [
      { t: { id: "Zakat secara bahasa berarti tumbuh dan ______.", ar: "" }, j: { id: "bertambah", ar: "الزيادة" }, x: [{ id: "bersih", ar: "" }, { id: "berkurang", ar: "" }, { id: "berbagi", ar: "" }] },
      { t: { id: "Nishab hasil bumi adalah lima ______.", ar: "" }, j: { id: "wasaq", ar: "أوسق" }, x: [{ id: "sha'", ar: "" }, { id: "mud", ar: "" }, { id: "dirham", ar: "" }] }
    ]
  }
});

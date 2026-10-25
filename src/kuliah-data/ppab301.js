// ============================================================
//  KATALOG MATERI — PPAB301 (PSY 204) Psikologi Perilaku Adiktif
//  International Open University · Dosen: Prof. Dr. G. Hussein Rassool
//  Disusun dari PPT modul resmi (bahasa Indonesia). File statis → tidak memakai kuota Supabase;
//  yang disimpan di database hanya progres, ringkasan & catatan pribadi, dan nilai kuis.
//  Format modul:
//    tujuan  : hasil pembelajaran (dari PPT)
//    materi  : ringkasan materi (format: # judul, - poin, **tebal**, > kutipan)
//    poin    : poin kunci untuk ujian
//    istilah : [istilah, arti]
//    kuis    : [soal, [pilihan], indeks_jawaban_benar, pembahasan]
//    tambahan: penjelasan DI LUAR MODUL (selalu disertai referensi) — { judul, isi, ref }
// ============================================================
(window.KUL_KATALOG = window.KUL_KATALOG || {}).PPAB301 = {
  kode: "PPAB301", kodeAlt: "PSY 204", program: "s1", semester: 3, sks: 3,
  nama: "Psikologi Perilaku Adiktif", nama_en: "Psychology of Addictive Behaviours", nama_arab: "علم نفس السلوك الإدماني",
  dosen: "Prof. Dr. G. Hussein Rassool",
  deskripsi: "Sifat & ruang lingkup adiksi zat dan perilaku, teori dan model adiksi (termasuk perspektif Islam), serta pencegahan dan intervensinya.",
  ujian: { UTS: [1, 15], UAS: [16, 30] },
  buku: [
    "Rassool, G. H. (2011). Understanding Addiction Behaviours: Theoretical & Clinical Practice in Health & Social Care. Palgrave Macmillan.",
    "Rassool, G. H. (2009). Alcohol and Drug Misuse: A Handbook for Students and Health Professionals. Routledge.",
  ],
  daftarModul: [
    "Pengantar & Gambaran Umum Perilaku Adiktif", "Di Balik Layar Adiksi", "Sejarah Adiksi", "Adiksi dan Masyarakat",
    "Adiksi dari Perspektif Islam", "Perspektif Teoretis tentang Adiksi I", "Perspektif Teoretis tentang Adiksi II",
    "Model-model Adiksi: Perspektif Islam", "Pengalaman Adiksi", "Alkohol I: Induk Segala Kejahatan", "Alkohol II",
    "Adiksi Nikotin I", "Adiksi Nikotin II", "Opiat", "Psikostimulan I",
    "Psikostimulan II", "Halusinogen & Obat Disosiatif", "Ganja", "Inhalansia & Steroid Anabolik",
    "Penyalahgunaan Obat Resep & Obat Bebas", "Citra Tubuh & Gangguan Makan", "Adiksi Judi", "Adiksi Internet dan Game",
    "Adiksi Seks", "Diagnosis Ganda: Adiksi & Gangguan Kejiwaan", "Adiksi Bersama, Bantuan Mandiri & Dukungan Keluarga",
    "Strategi Intervensi", "Adiksi & Pengurangan Dampak Buruk", "Adiksi dari Perspektif Islam (Lanjutan)", "Refleksi tentang Adiksi",
  ],
  modul: [
    {
      no: 1, judul: "Pengantar & Gambaran Umum Perilaku Adiktif",
      ringkas: "Apa itu adiksi, beda ketergantungan psikologis & fisiologis, toleransi, putus zat, dan kriteria DSM-5.",
      tujuan: [
        "Mendiskusikan mengapa studi tentang adiksi itu penting",
        "Menjelaskan konsep adiksi dan konsep narkoba (zat psikoaktif)",
        "Membandingkan ketergantungan psikologis dan fisiologis",
        "Menyebutkan jenis-jenis perilaku adiksi",
        "Menjelaskan konsep toleransi dan putus zat (withdrawal)",
        "Memahami kriteria DSM-5 untuk Gangguan Penggunaan Zat & Gangguan Adiktif",
      ],
      materi: `# Mengapa adiksi penting dipelajari
- Adiksi menjelaskan **mengapa orang bertindak dengan cara yang akhirnya merusak kesehatannya** (merokok, narkoba, alkohol).
- Cara kita menjelaskan perilaku berbahaya menentukan cara penelitian, pencegahan, dan penanganannya.
- Belum ada "obat" yang menyembuhkan adiksi, tetapi **ada banyak perawatan berbasis bukti** yang efektif untuk mengelolanya.
> QS Al-Baqarah 2:219 — pada khamar dan judi ada dosa besar dan beberapa manfaat, tetapi dosanya lebih besar daripada manfaatnya.

# Apa itu adiksi?
- Definisi umum: keterlibatan **berkelanjutan** dengan suatu zat atau aktivitas **meskipun ada konsekuensi negatif**.
- Definisi klinis (ASAM): penyakit **primer dan kronis** pada sirkuit *reward* (penghargaan), motivasi, dan memori otak, yang tampak dalam manifestasi **biologis, psikologis, sosial, dan spiritual**.
- Empat kriteria (APA): ketergantungan psikologis & fisiologis, **putus zat**, **kekambuhan (relapse)**, dan **toleransi**.

# Karakteristik adiksi
1. Tidak mampu berpantang secara konsisten
2. Gangguan pengendalian perilaku
3. **Craving** (ketagihan) — "rasa lapar" yang meningkat terhadap zat/pengalaman
4. Berkurangnya kesadaran akan masalah dalam perilaku & hubungan
5. Respons emosional yang tidak berfungsi

# Ketergantungan psikologis vs fisiologis
- **Psikologis:** penggunaan kompulsif, hilang kendali, perilaku mencari zat, keinginan kuat, cenderung kambuh, diperkuat oleh konsekuensinya — inilah alasan terbesar pengguna terus memakai.
- **Fisiologis:** tubuh telah **beradaptasi** dengan zat; ditandai **sindrom putus zat** bila dihentikan tiba-tiba. **Toleransi biasanya mendahului** ketergantungan fisik.

# Toleransi & putus zat
- **Toleransi:** respons terhadap zat melemah sehingga butuh **dosis lebih tinggi** untuk efek yang sama. Keinginan dan toleransi berkembang bersamaan.
- **Sindrom putus zat (penghentian):** kumpulan gejala saat zat dihentikan/dikurangi; risikonya naik seiring **dosis dan lama** penggunaan.
- **PAWS (Post-Acute Withdrawal Syndrome):** gejala lanjutan setelah fase akut, sering pada pengguna alkohol/zat jangka panjang yang berhenti tiba-tiba.

# Narkoba & zat psikoaktif
- Narkoba = zat kimia yang memengaruhi kerja tubuh; masuk ke otak dan mengganggu sinyal kimia (**neurotransmiter**). Heroin, alkohol, ekstasi, kafein, nikotin termasuk.
- **Zat psikoaktif** memengaruhi proses mental (kognisi, afek); psikoaktif **tidak selalu** berarti menimbulkan ketergantungan.
- Obat **keras**: cenderung adiktif secara fisik & mudah overdosis. Obat **ringan**: tidak adiktif secara fisik.

# Jenis perilaku adiksi
- **Zat:** alkohol, ganja, heroin, kokain, amfetamin, ekstasi, zat psikoaktif baru, khat, tembakau.
- **Perilaku (proses):** judi, internet & game, seks, makan, belanja, kerja, olahraga berlebihan — bisa sama merusaknya dengan narkoba.

# Apakah adiksi sukarela? Apakah penyakit mental?
- Keputusan **awal** memakai sebagian besar **sukarela**; setelah adiksi terbentuk, kontrol diri sangat terganggu.
- Pencitraan otak menunjukkan perubahan di area **penilaian, pengambilan keputusan, belajar, memori, dan kontrol perilaku**.
- DSM memuat kriteria gangguan penggunaan zat. Lebih dari separuh pecandu juga mengalami gangguan jiwa (dan sebaliknya) — **komorbiditas ±50%**.

# DSM-5: Gangguan Penggunaan Zat (Substance Use Disorder)
Pola penggunaan bermasalah yang menyebabkan gangguan/penderitaan bermakna, ditandai **≥2 dari 11 kriteria dalam 12 bulan**:
1. Dipakai lebih banyak/lebih lama dari yang dimaksudkan
2. Keinginan terus-menerus / gagal mengurangi
3. Banyak waktu untuk mendapatkan, memakai, atau pulih
4. Craving
5. Gagal memenuhi kewajiban (kerja, sekolah, rumah)
6. Tetap memakai meski ada masalah sosial/interpersonal
7. Aktivitas penting ditinggalkan
8. Dipakai berulang dalam situasi berbahaya secara fisik
9. Tetap memakai meski tahu ada masalah fisik/psikologis
10. **Toleransi**
11. **Putus zat**
- Kategori DSM-5: gangguan penggunaan alkohol, ganja, halusinogen (termasuk PCP), inhalan, opioid, sedatif/hipnotik/anxiolitik, stimulan, tembakau, zat lain — dan **Gangguan Judi** (satu-satunya adiksi perilaku di kategori ini).

# Perawatan berbasis bukti
Psikoterapi individu & kelompok, **CBT**, **Motivational Interviewing (MI)**, pencegahan kekambuhan, metadon & farmakoterapi lain, serta pendekatan **pengurangan dampak buruk (harm reduction)**.`,
      poin: [
        "Adiksi = keterlibatan berkelanjutan dengan zat/aktivitas meskipun ada konsekuensi negatif; penyakit kronis pada sirkuit reward otak.",
        "Empat kriteria APA: ketergantungan psikologis & fisiologis, putus zat, kekambuhan, toleransi.",
        "Toleransi biasanya mendahului ketergantungan fisik; ketergantungan fisik ditandai sindrom putus zat.",
        "DSM-5: Gangguan Penggunaan Zat = ≥2 dari 11 kriteria dalam 12 bulan; Gangguan Judi masuk kategori yang sama.",
        "Keputusan awal memakai bersifat sukarela, tetapi adiksi mengubah otak sehingga kontrol diri terganggu.",
        "Sekitar separuh pecandu juga memiliki gangguan jiwa (komorbiditas).",
      ],
      istilah: [
        ["Adiksi", "Keterlibatan berkelanjutan dengan zat atau aktivitas meskipun menimbulkan konsekuensi negatif."],
        ["Toleransi", "Melemahnya respons terhadap zat sehingga dibutuhkan dosis lebih tinggi untuk efek yang sama."],
        ["Sindrom putus zat (withdrawal)", "Kumpulan gejala yang muncul saat zat dihentikan atau dosisnya dikurangi."],
        ["PAWS", "Post-Acute Withdrawal Syndrome — gejala putus zat lanjutan setelah fase akut berlalu."],
        ["Zat psikoaktif", "Zat yang memengaruhi proses mental seperti kognisi atau afek."],
        ["Craving", "Keinginan/ketagihan kuat terhadap zat atau pengalaman yang memberi efek menyenangkan."],
        ["Komorbiditas", "Terjadinya dua gangguan sekaligus pada satu orang, mis. adiksi dan gangguan jiwa."],
      ],
      kuis: [
        ["Menurut DSM-5, diagnosis Gangguan Penggunaan Zat ditegakkan bila terpenuhi minimal…", ["1 kriteria dalam 6 bulan", "2 kriteria dalam 12 bulan", "3 kriteria dalam 12 bulan", "6 kriteria dalam 24 bulan"], 1, "DSM-5 mensyaratkan dua (atau lebih) dari 11 kriteria dalam periode 12 bulan."],
        ["Kebutuhan dosis yang makin besar untuk memperoleh efek yang sama disebut…", ["Craving", "Relapse", "Toleransi", "Komorbiditas"], 2, "Toleransi = respons terhadap zat melemah sehingga dosis harus dinaikkan."],
        ["Ketergantungan fisiologis terutama ditandai oleh…", ["Perilaku mencari zat", "Sindrom putus zat saat zat dihentikan", "Keinginan untuk kambuh", "Rasa penasaran mencoba"], 1, "Ketergantungan fisik didefinisikan dengan terjadinya sindrom penarikan/putus zat."],
        ["Pernyataan yang BENAR tentang hubungan toleransi dan ketergantungan fisik adalah…", ["Toleransi muncul setelah ketergantungan fisik hilang", "Toleransi biasanya mendahului ketergantungan fisik", "Keduanya tidak berhubungan", "Toleransi hanya terjadi pada adiksi perilaku"], 1, "PPT modul menegaskan: toleransi biasanya mendahului ketergantungan fisik."],
        ["Satu-satunya adiksi perilaku yang masuk kategori 'Gangguan Penggunaan Zat & Gangguan Adiktif' DSM-5 adalah…", ["Adiksi internet", "Gangguan judi", "Adiksi belanja", "Adiksi seks"], 1, "DSM-5 memasukkan Gangguan Judi; adiksi internet/game masih dalam kajian."],
        ["Ayat yang menyatakan khamar dan judi memiliki dosa besar dan beberapa manfaat adalah…", ["QS Al-Ma'idah 5:90", "QS Al-Baqarah 2:219", "QS An-Nisa' 4:43", "QS Al-A'raf 7:157"], 1, "QS Al-Baqarah 2:219 dikutip di pembukaan modul 1."],
        ["Tentang 'keputusan awal menggunakan narkoba', modul menyatakan bahwa…", ["Sepenuhnya dipaksa oleh faktor genetik", "Sebagian besar bersifat sukarela", "Selalu karena tekanan teman", "Tidak dapat dijelaskan"], 1, "Keputusan awal sebagian besar sukarela; setelah adiksi terbentuk, kontrol diri terganggu."],
        ["Berapa kira-kira proporsi pecandu narkoba yang juga mengalami gangguan jiwa?", ["Sekitar 10%", "Sekitar 25%", "Lebih dari separuh", "Hampir tidak ada"], 2, "Modul menyebut lebih dari separuh pecandu juga mengalami gangguan jiwa, dan sebaliknya."],
        ["Gejala lanjutan setelah fase putus zat akut, umum pada pengguna jangka panjang, disebut…", ["DSM", "PAWS", "MI", "CBT"], 1, "PAWS = Post-Acute Withdrawal Syndrome."],
        ["Berikut termasuk perawatan berbasis bukti untuk adiksi, KECUALI…", ["Cognitive Behavioural Therapy", "Motivational Interviewing", "Menunggu pecandu mencapai 'titik terendah'", "Pencegahan kekambuhan"], 2, "Anggapan pecandu harus mencapai titik terendah dulu adalah mitos (pernyataan benar-salah di awal modul)."],
      ],
      tambahan: [
        { judul: "Mengapa DSM-5 tidak lagi memakai istilah 'penyalahgunaan' dan 'ketergantungan'?",
          isi: "DSM-IV memisahkan diagnosis 'abuse' dan 'dependence'. DSM-5 (2013) menggabungkannya menjadi satu kontinum 'Substance Use Disorder' dengan tingkat keparahan: ringan (2–3 kriteria), sedang (4–5), berat (≥6). Kriteria 'masalah hukum berulang' dihapus dan 'craving' ditambahkan.",
          ref: "American Psychiatric Association. (2013). Diagnostic and Statistical Manual of Mental Disorders (5th ed.). Washington, DC: APA." },
      ],
    },
    {
      no: 2, judul: "Di Balik Layar Adiksi",
      ringkas: "Stigma & stereotip terhadap pecandu, adiksi yang tersembunyi di komunitas Muslim, serta bahaya fisik, sosial, dan ekonomi adiksi (studi Nutt et al.).",
      tujuan: [
        "Memahami efek negatif stigma terhadap pengguna narkoba",
        "Mendiskusikan bahaya stereotip dan stigma adiksi",
        "Menyebutkan elemen-elemen kunci stigma terkait adiksi",
        "Mendiskusikan isu 'di balik tabir' adiksi dari perspektif Islam",
        "Memeriksa bahaya adiksi berdasarkan studi Nutt et al.",
        "Memeriksa bahaya sosial dari adiksi",
      ],
      materi: `# Norma budaya yang berubah
- **Opium** dulu diterima secara sosial (rekreasi & pengobatan) — para *Lakeland poets* adalah pengguna terkenal; **laudanum** = larutan opium dalam alkohol. Kini opium membawa stigma besar dan dianggap kejahatan.
- **Rokok** pernah menjadi norma budaya yang diiklankan luas (contoh iklan rokok *Alf-Layla* di majalah Mesir *Ruz al-Yusuf*, 1932).
- Pelajaran: label "baik/buruk" terhadap zat dibentuk oleh **budaya dan zaman**, bukan hanya oleh farmakologinya.

# Sikap terhadap pengguna zat
- Rassool menyusun **RATSMQ-10** (*Rassool Attitude Towards Substance Misusers Questionnaire*) untuk mengukur sikap/keyakinan terhadap penyalahguna zat, dan **Addiction Intervention Skills Questionnaire** untuk mengukur rasa percaya diri tenaga profesional dalam menangani adiksi (edukasi, mengenali gejala, mengambil riwayat, merujuk, merawat).

# Stigma adiksi
- **Stigma** = stereotip negatif yang dilekatkan pada seseorang karena atributnya dianggap berbeda/lebih rendah dari norma masyarakat.
- **Goffman (1963):** stigma adalah interaksi sosial antara yang "terstigma" dan yang "normal"; prosesnya sangat **mendiskreditkan**.
- Jenis stigma: dari **individu/masyarakat**, dari **institusi**, dari **diri sendiri (terinternalisasi)**, dan stigma **karena asosiasi** (keluarga ikut terkena).
> "Orang yang menjadi korban stigma menginternalisasi kebencian, mengubahnya menjadi rasa malu, dan bersembunyi." — David L. Rosenbloom
- Stigma & diskriminasi bisa lebih merusak daripada narkobanya sendiri, karena **menghalangi orang mencari bantuan**.

# Bahaya stereotip
- Stereotip membuat asumsi negatif tentang gaya hidup; kenyataannya kebanyakan pecandu sama seperti orang lain — adiksi **tidak membedakan kaya-miskin, tua-muda**.
- Profesional kesehatan, polisi, asuransi, dan pemberi kerja bisa bertindak berdasarkan stereotip. **Bahasa** sangat berperan (mis. "pecandu" vs "orang dengan gangguan penggunaan zat").

# Elemen kunci stigma adiksi
1. **Menyalahkan** & membuat penilaian moral
2. **Mengkriminalisasi**
3. **Mematologisasi** (menganggap sakit/cacat)
4. **Menggurui**
5. **Ketakutan & isolasi**
- Mematahkan stigma: adiksi seperti penyakit kronis lain yang butuh perawatan berkelanjutan; melibatkan keluarga dalam pemulihan menghilangkan "mistisisme" di sekitar penyakit ini.

# Di balik tabir adiksi di komunitas Muslim
- Karena alasan **hukum, sosial, dan agama**, alkoholisme dalam masyarakat Muslim **diselimuti kerahasiaan** → pengakuan dan respons yang terbatas.
- Masalah utama: **penyangkalan** dan **rasa malu**; adiksi dianggap tanda iman lemah, hukuman Tuhan, atau ujian.
- Kenyataannya **adiksi ada di komunitas Muslim**. Menangani adiksi **bukan berarti menormalkannya**.
- Islam **mendorong** umat mencari pengobatan; hambatan lain: diskriminasi, rasisme, Islamofobia.
- **Seorang Muslim bisa menjadi pecandu dan tetap mencintai Allah dan Rasul-Nya.**
> Hadis (HR Bukhari): seorang sahabat bernama Abdullah ("Himar") berkali-kali dicambuk karena minum khamar. Ketika ada yang melaknatnya, Nabi ﷺ bersabda: "Jangan melaknatnya, demi Allah aku tahu ia mencintai Allah dan Rasul-Nya."
- Umat seperti **satu tubuh** (HR Bukhari & Muslim) — penderitaan pecandu adalah penderitaan umat.

# Bahaya adiksi
- Lima dimensi: **fisik, psikologis, sosial, ekonomi, spiritual**.
- **Nutt, King & Phillips (2010, The Lancet):** analisis multikriteria 20 zat; bahaya dinilai bagi **pengguna** dan bagi **orang lain**. Hasil terkenal: **alkohol mendapat skor bahaya keseluruhan tertinggi** (terutama bahaya bagi orang lain), di atas heroin dan crack kokain.

# Bahaya sosial (NICE 2010; BMA 2013)
- Bagi **individu:** pengucilan sosial ("*skid row*", Segal 1991), **tunawisma** (sulit ke dokter, kerja, rentan dieksploitasi).
- Bagi **keluarga:** kekerasan dalam rumah tangga (Galvani 2012: narkoba menaikkan frekuensi & keparahannya), contoh buruk bagi anak, masalah keuangan, komunikasi terganggu.
- Anak dari orang tua pengguna (Barnard 2007): **peran terdistorsi**, terpapar kriminalitas, orang tua absen fisik/emosional.
- **Peradilan pidana:** kejahatan akuisitif (demi membiayai kebiasaan), kekerasan saat mabuk, mengemudi mabuk, pengedaran.

# Kerugian ekonomi
- **Langsung:** perawatan medis, peradilan pidana, layanan sosial, biaya zat/perilaku itu sendiri.
- **Tidak langsung:** kematian dini (hilang pendapatan), absen kerja & hilangnya produktivitas.`,
      poin: [
        "Stigma (Goffman 1963) = stereotip negatif karena atribut dianggap menyimpang; sangat mendiskreditkan dan menghalangi orang mencari bantuan.",
        "Empat jenis stigma: masyarakat, institusi, diri sendiri (terinternalisasi), dan karena asosiasi.",
        "Lima elemen kunci stigma: menyalahkan/menilai moral, mengkriminalisasi, mematologisasi, menggurui, ketakutan & isolasi.",
        "Di komunitas Muslim adiksi tersembunyi karena rasa malu & penyangkalan; menangani adiksi tidak sama dengan menormalkannya.",
        "Nutt et al. (2010): alkohol memiliki skor bahaya keseluruhan tertinggi, terutama bagi orang lain.",
        "Bahaya adiksi: fisik, psikologis, sosial, ekonomi, spiritual; kerugian ekonomi langsung & tidak langsung.",
      ],
      istilah: [
        ["Stigma", "Stereotip negatif yang dilekatkan pada seseorang karena atributnya dianggap berbeda atau lebih rendah dari norma."],
        ["Stigma terinternalisasi", "Stigma yang diterima dan diyakini oleh orang yang terstigma sendiri, berubah menjadi rasa malu."],
        ["Stigma karena asosiasi", "Stigma yang ikut menimpa keluarga atau orang dekat pecandu."],
        ["Laudanum", "Larutan opium dalam alkohol yang dahulu dipakai luas sebagai obat."],
        ["Kejahatan akuisitif", "Kejahatan untuk memperoleh uang/barang demi membiayai kebiasaan memakai zat."],
        ["Skid row", "Kondisi seseorang yang terpinggirkan dari masyarakat normal akibat kemerosotan hidup (Segal 1991)."],
      ],
      kuis: [
        ["Tokoh yang mendefinisikan stigma sebagai interaksi sosial antara yang 'terstigma' dan yang 'normal' adalah…", ["Rassool", "Goffman", "Nutt", "Galvani"], 1, "Erving Goffman (1963) dalam karyanya tentang stigma."],
        ["Stigma yang dialami keluarga karena salah satu anggotanya pecandu disebut stigma…", ["Institusional", "Terinternalisasi", "Karena asosiasi", "Struktural"], 2, "Stigma oleh asosiasi = ikut terkena karena kedekatan dengan orang yang terstigma."],
        ["Berikut termasuk elemen kunci stigma adiksi, KECUALI…", ["Mengkriminalisasi", "Menggurui", "Melibatkan keluarga dalam perawatan", "Menyalahkan dan menilai moral"], 2, "Melibatkan keluarga justru cara mematahkan stigma."],
        ["Menurut studi Nutt et al. (2010) di The Lancet, zat dengan skor bahaya keseluruhan tertinggi adalah…", ["Heroin", "Crack kokain", "Alkohol", "Ganja"], 2, "Alkohol tertinggi terutama karena bahayanya bagi orang lain."],
        ["Hadis tentang sahabat yang sering dihukum karena minum khamar mengajarkan bahwa…", ["Pecandu boleh dilaknat", "Pecandu tetap bisa mencintai Allah dan Rasul-Nya", "Hukuman tidak perlu dijatuhkan", "Khamar dibolehkan dalam jumlah kecil"], 1, "Nabi ﷺ melarang melaknatnya karena ia mencintai Allah dan Rasul-Nya (HR Bukhari)."],
        ["Mengapa alkoholisme di masyarakat Muslim sering 'di balik tabir'?", ["Karena tidak pernah terjadi", "Karena alasan hukum, sosial, dan agama sehingga dirahasiakan", "Karena alkohol murah", "Karena tidak ada layanan kesehatan"], 1, "Kerahasiaan, rasa malu, dan penyangkalan membatasi pengakuan dan respons."],
        ["Kejahatan yang dilakukan demi membiayai kebiasaan memakai narkoba disebut kejahatan…", ["Akuisitif", "Impulsif", "Terorganisasi", "Domestik"], 0, "Acquisitive crime: mencuri/merampok demi mendapatkan uang untuk membeli zat."],
        ["Menurut Barnard (2007), masalah umum pada anak-anak dari orang tua pengguna narkoba adalah…", ["Prestasi akademik selalu tinggi", "Peran terdistorsi dan orang tua absen secara emosional", "Tidak terpengaruh sama sekali", "Hanya masalah ekonomi"], 1, "Barnard: peran terdistorsi, paparan kriminalitas, ketidakhadiran orang tua."],
        ["Contoh biaya TIDAK LANGSUNG dari adiksi adalah…", ["Biaya rehabilitasi", "Biaya penjara", "Hilangnya produktivitas kerja", "Biaya membeli zat"], 2, "Biaya tidak langsung: kematian dini dan hilangnya produktivitas."],
        ["Contoh perubahan norma budaya yang dibahas: opium dulu…", ["Selalu dilarang", "Diterima secara sosial untuk rekreasi dan pengobatan", "Hanya dipakai di militer", "Tidak dikenal di Eropa"], 1, "Opium & laudanum dulu diterima luas, kini distigma."],
      ],
      tambahan: [
        { judul: "Bahasa yang mengurangi stigma",
          isi: "Pedoman kesehatan masyarakat menganjurkan bahasa yang mendahulukan orangnya ('person-first'), mis. 'orang dengan gangguan penggunaan zat' alih-alih 'pecandu/junkie', dan 'pemulihan' alih-alih 'bersih'. Penelitian menunjukkan label 'substance abuser' membuat tenaga kesehatan lebih cenderung memilih hukuman daripada perawatan.",
          ref: "Kelly, J. F., & Westerhoff, C. M. (2010). Does it matter how we refer to individuals with substance-related conditions? International Journal of Drug Policy, 21(3), 202–207." },
      ],
    },
    {
      no: 3, judul: "Sejarah Adiksi",
      ringkas: "Sejarah budaya alkohol, opium & turunannya, ganja, kokain, amfetamin, kopi, tembakau, halusinogen, hingga obat sintetis (NPS).",
      tujuan: [
        "Memahami sejarah budaya alkohol, narkoba, dan tembakau",
        "Menguraikan sejarah penggunaan alkohol dan narkoba",
        "Memberi gambaran perkembangan obat sintetis (New Psychoactive Substances/NPS)",
        "Mendiskusikan alasan suatu zat berubah status dari legal menjadi ilegal",
      ],
      materi: `# Asal kata "alkohol" dan "khamr"
- **Alkohol** dari bahasa Arab **al-kuhl (الكحل)**; dalam mitologi Arab *al-ghawl* = jin/makhluk gaib, juga dimaknai zat yang **menutupi akal**. Kata ini masuk ke bahasa Latin pada **abad ke-13**, lalu dipakai untuk alkohol suling murni (etanol).
- **Khamr (خمر)** secara bahasa = anggur/minuman dari anggur; maknanya: sesuatu yang **menutupi akal**.
- Kata khamr disebut **enam kali** dalam Al-Qur'an: Al-Baqarah 2:219, Al-Ma'idah 5:90 & 91, Yusuf 12:36 & 41, Muhammad 47:15.

# Alkohol dalam Taurat & Alkitab
- Anggur dipakai dalam ritual Yahudi (Sabat, pernikahan, sunat; berkat *Hagafen*).
- Kisah peringatan: **Nuh** dipermalukan karena mabuk (Kejadian 9:21), Lot, Nabal; **Nadab & Abihu** binasa karena masuk Kemah Suci dalam keadaan mabuk.
- Peringatan: Yesaya 5:11, Galatia 5:19-21, Efesus 5:18 ("Janganlah kamu mabuk oleh anggur").

# Alkohol: minuman memabukkan tertua
- **Mesir:** bir jelai sebelum **4200 SM**; papirus Mesir ±3500 SM berisi deskripsi tempat pembuatan bir.
- **Cina (Jiahu, Henan):** minuman fermentasi beras, madu & buah sekitar **7000 SM**.
- **Yunani & Romawi:** dewa anggur **Dionysus** (Yunani) dan **Bacchus** (Romawi); *symposium* = "minum bersama".
- **Peringatan kuno:** keruntuhan dinasti Mesir & Tiongkok (1600–1050 SM) dikaitkan dengan minum berlebihan; **Plato** melarang di bawah 18 tahun dan menganjurkan sedang untuk usia 18–30; **Aristoteles & Hipokrates** mengkritik kemabukan; **Simeon Seth** (abad ke-11, Bizantium) mencatat anggur berlebihan menyebabkan **radang hati**.
- **Arab pra-Islam:** khamr tersebar luas dan diagungkan dalam syair → Allah menurunkan **larangan secara bertahap**.
- **Eropa abad pertengahan:** minuman beralkohol dipakai melawan penyakit air (kolera) — sebenarnya **proses perebusannya** yang membunuh mikroba.
- **Inggris abad ke-16:** Elizabeth I memperingatkan bir "double-double"; rata-rata orang Inggris minum **17 liter bir/minggu** karena bir lebih aman daripada air.
- **Amerika kolonial:** kedai minum = pusat politik & bisnis; konsumsi 6 galon alkohol murni per kapita (1790) → 7 galon (1830). **Benjamin Rush (1785)** menulis efek *distilled spirits*, memicu **Gerakan Temperance**.
- **Masalah abad ke-21:** *binge drinking*, peminum di bawah umur, minum saat hamil, keracunan alkohol, adiksi ganda.

# Opium dan turunannya
- Bangsa **Sumeria ±5000 SM**: ideogram opium **"HUL"** = sukacita. Mesir kuno memperdagangkannya; dilarang saat Inkuisisi, diperkenalkan lagi tahun 1500-an.
- Bukti tertua makan biji poppy: penghuni danau di Swiss ±2500 SM.
- Abad ke-19: obat penenang bayi berbasis opium (Godfrey's Cordial, Mrs. Winslow's Soothing Syrup).
- **Thomas De Quincey (1822)**, *Confessions of an English Opium Eater*: kebiasaan opium **harus dipelajari** — butuh lebih dari 120 hari untuk terbentuk kuat.
- Kesaksian pecandu laudanum (Journal of Mental Science, 1889): gelisah ekstrem, tidak bisa tidur, mudah tersinggung — gambaran **sindrom putus zat**.
- Rantai turunan: **opium → laudanum → morfin → heroin**.

# Ganja, kokain, amfetamin, kopi, tembakau
- **Ganja:** salah satu tanaman pertama yang dibudidayakan untuk tujuan non-pangan; dipakai dalam ritual keagamaan; **hashish** (resin) dikenal di kalangan Arab sekitar abad ke-10. *Club des Hashischins* di Paris (1840-an); meluas di Eropa tahun **1960-an** lewat gerakan budaya anak muda.
- **Kokain:** dari daun koka; pernah menjadi bahan **Coca-Cola**.
- **Amfetamin:** dipasarkan sebagai **inhaler Benzedrine** untuk hidung tersumbat, depresi ringan, skizofrenia, alkoholisme, obesitas.
- **Kopi:** ditemukan penggembala kambing Ethiopia (abad ke-9), menyebar di Mesir, Timur Tengah, Persia, Turki (abad ke-15), masuk Eropa **1615**.
- **Teh:** mulai dipakai di Tiongkok ±3000 SM.
- **Tembakau:** dipakai penduduk asli Amerika sejak ±3000 SM, diisap sejak ±2000 SM untuk tujuan pengobatan & sosial.
- **Halusinogen:** "penguat mental" yang meningkatkan kepekaan terhadap lingkungan secara fisik dan mental.
- **Obat sintetis / NPS (New Psychoactive Substances):** zat baru buatan laboratorium yang meniru efek narkoba lama.

# Kesimpulan
Status legal/ilegal suatu zat berubah karena **bukti bahaya, budaya, politik, dan ekonomi** — bukan semata karena farmakologinya.`,
      poin: [
        "Alkohol berasal dari kata Arab al-kuhl; khamr = 'yang menutupi akal', disebut 6 kali dalam Al-Qur'an.",
        "Minuman beralkohol tertua: Cina (Jiahu) ±7000 SM; bir jelai Mesir sebelum 4200 SM.",
        "Bangsa Sumeria (±5000 SM) menyebut opium 'HUL' = sukacita.",
        "De Quincey (1822): kebiasaan opium dipelajari dan butuh waktu (>120 hari) untuk terbentuk kuat.",
        "Benjamin Rush (1785) memicu Gerakan Temperance di Amerika.",
        "Urutan turunan opium: opium → laudanum → morfin → heroin; amfetamin awalnya dijual sebagai inhaler Benzedrine.",
      ],
      istilah: [
        ["Khamr", "Bahasa Arab untuk minuman memabukkan (asalnya anggur); bermakna sesuatu yang menutupi akal."],
        ["Al-kuhl", "Akar kata Arab dari 'alkohol'."],
        ["Gerakan Temperance", "Gerakan sosial (abad 18–19) yang menyerukan pembatasan atau pantangan alkohol."],
        ["Hashish", "Resin tanaman ganja yang dipadatkan; lebih kuat daripada daun ganja."],
        ["NPS", "New Psychoactive Substances — zat psikoaktif sintetis baru yang meniru efek narkoba lama."],
        ["Symposium", "Kata Yunani yang berarti 'minum bersama'."],
      ],
      kuis: [
        ["Kata 'alkohol' berasal dari bahasa Arab…", ["Khamr", "Al-kuhl", "Nabidz", "Sukr"], 1, "Al-kuhl masuk ke bahasa Latin pada abad ke-13 dan kemudian dipakai untuk etanol."],
        ["Berapa kali kata khamr disebut dalam Al-Qur'an menurut modul?", ["Tiga", "Empat", "Enam", "Sembilan"], 2, "Enam kali: 2:219, 5:90, 5:91, 12:36, 12:41, 47:15."],
        ["Bukti minuman fermentasi tertua (±7000 SM) ditemukan di…", ["Mesir", "Yunani", "Jiahu, Cina", "Mesopotamia"], 2, "McGovern et al. (2004): minuman beras, madu, dan buah di desa neolitikum Jiahu, Henan."],
        ["Bangsa Sumeria menyebut opium dengan ideogram 'HUL' yang berarti…", ["Kematian", "Sukacita", "Tidur", "Obat"], 1, "HUL = joy/rejoicing."],
        ["Penulis 'Confessions of an English Opium Eater' (1822) adalah…", ["Benjamin Rush", "Thomas De Quincey", "Simeon Seth", "Hipokrates"], 1, "Thomas De Quincey."],
        ["Tokoh yang risalahnya (1785) tentang efek 'distilled spirits' memicu Gerakan Temperance adalah…", ["Benjamin Rush", "Elizabeth I", "Plato", "Satori Kato"], 0, "Benjamin Rush, salah satu pilar Gerakan Temperance."],
        ["Menurut Plato, alkohol…", ["Dilarang total", "Tidak boleh di bawah 18 tahun dan sedang untuk usia 18–30", "Wajib untuk prajurit", "Hanya untuk upacara"], 1, "Plato membatasi berdasarkan usia."],
        ["Di Eropa abad pertengahan, minuman beralkohol dipakai melawan penyakit air. Yang sebenarnya membunuh mikroba adalah…", ["Etanol murni", "Proses perebusan", "Gula", "Ragi"], 1, "Modul menegaskan proses perebusanlah yang penting."],
        ["Amfetamin awalnya dipasarkan dalam bentuk…", ["Tablet diet", "Inhaler Benzedrine", "Sirup bayi", "Rokok"], 1, "Inhaler Benzedrine untuk hidung tersumbat, depresi ringan, dll."],
        ["Larangan khamr dalam Islam diturunkan…", ["Sekaligus pada awal dakwah", "Secara bertahap", "Setelah wafatnya Nabi ﷺ", "Hanya lewat hadis"], 1, "Karena khamr tersebar luas di Arab pra-Islam, larangan diturunkan bertahap (dibahas lebih lanjut di Modul 5)."],
      ],
      tambahan: [
        { judul: "Tonggak sejarah turunan opium & stimulan (melengkapi slide bergambar)",
          isi: "Morfin diisolasi dari opium oleh Friedrich Sertürner (sekitar 1804–1805); heroin (diasetilmorfin) disintesis tahun 1874 dan dipasarkan Bayer sejak 1898 sebagai obat batuk 'tidak adiktif'. Kokain diisolasi dari daun koka sekitar 1860; Coca-Cola mengandung ekstrak koka hingga awal abad ke-20. Ketiganya kemudian dikendalikan lewat perjanjian internasional, dimulai dari Konvensi Opium Den Haag 1912.",
          ref: "UNODC. (2008). A Century of International Drug Control. Vienna: United Nations Office on Drugs and Crime." },
      ],
    },
    {
      no: 4, judul: "Adiksi dan Masyarakat",
      ringkas: "Dampak adiksi pada masyarakat, budaya adiksi (White), faktor sosial-budaya, dunia narkoba global, jenis peminum, Sindrom Ketergantungan Alkohol, ICD-10, dan strategi global.",
      tujuan: [
        "Mendiskusikan selera masyarakat untuk memakai dan menyalahgunakan zat/aktivitas adiktif",
        "Mendiskusikan dampak alkohol & narkoba terhadap masyarakat; menyebut manfaat obat",
        "Menjelaskan 'budaya adiksi' dan faktor sosial-budaya yang menumbuhkannya",
        "Menguraikan situasi alkohol & narkoba global",
        "Menjelaskan jenis-jenis peminum dan ciri Sindrom Ketergantungan Alkohol",
      ],
      materi: `# Mengapa adiksi menjadi masalah?
- Penggunaan alkohol, tembakau & narkoba **dimulai sejak dini** dan memuncak di **pertengahan usia 20-an**; memakai di **usia remaja awal** meningkatkan risiko adiksi.
- Adiksi memengaruhi **semua lapisan masyarakat**; biayanya sangat tinggi (kematian, produktivitas, keluarga).
- Ada pandangan populer bahwa adiksi "hanya pilihan, bukan penyakit" — modul menantang anggapan ini.

# Dampak adiksi pada masyarakat
- **Individu, ekonomi, biaya kesehatan, kejahatan**, dan rantai perdagangan narkoba: **produksi → transit → pencucian uang → konsumsi**.
- **Kesehatan masyarakat**, kehilangan keluarga, kesejahteraan sosial, kerusakan fasilitas publik, dan **lingkungan**.
- **Manfaat obat:** melawan dan menyembuhkan penyakit, menghilangkan rasa sakit, mengatasi penyakit fisik lain.

# Budaya dan adiksi
- **Konsep adiksi adalah konstruksi budaya** — dipengaruhi praktik agama dan tradisi.
- Faktor biologis yang berbeda antarbangsa: kekurangan enzim pemecah alkohol (ALDH) pada sebagian populasi.
- **Faktor sosial-budaya yang menumbuhkan adiksi:** pengalaman ikatan (*bonding*), meredakan stres, rasa kebersamaan, daya tarik memberontak, daya tarik gaya hidup, **identitas dua budaya**, remaja dalam subkultur, serta peran/perilaku/ritual keluarga.
> "Identitas budaya adalah kombinasi holistik faktor nasional, politik, budaya, agama, dan keluarga yang membentuk identitas seseorang."

# Budaya adiksi (White)
- **White (1990):** "Budaya adiksi adalah **cara hidup**, sarana mengatur keberadaan sehari-hari, dan cara memandang orang & peristiwa di dunia luar."
- Jaringan sosial informal yang **normanya mendorong** penggunaan berlebihan.
- Tiga gaya (White 1996): gaya budaya adiksi, gaya adiksi **lintas budaya**, gaya adiksi yang **terjalin secara budaya**.
- Fungsi budaya adiksi dalam **mempertahankan** adiksi: memberi **pengetahuan & keterampilan** (cara memakai, mengurangi risiko, mengakses), **dukungan**, **identitas baru** sebagai pengguna, dan menjaga **harga diri**.

# Dunia narkoba global
- Zat utama: **ganja, amfetamin, heroin, kokain, NPS**; isu lain: kanabinoid sintetis, komorbiditas, alkohol, tembakau, **polydrug use**, obat resep nonmedis, obat bebas (OTC).
- **Narkoba suntik** → penularan infeksi lewat darah: **HIV, hepatitis B & C**.
- **Global Drug Survey 2016** — 10 zat terfavorit: ganja, MDMA, kokain, amfetamin, LSD, jamur ajaib, opioid (resep & nonresep), nitrogen oksida, ketamin, popper.

# Jenis-jenis peminum
- **Penggunaan berbahaya (hazardous use, WHO 1994):** pola yang **meningkatkan risiko** konsekuensi berbahaya, walau belum ada gangguan; penting bagi kesehatan masyarakat; **bukan label diagnostik**.
- **Penggunaan merugikan (harmful use, ICD-10):** pola yang **sudah menyebabkan kerusakan** fisik atau mental, tetapi **tidak termasuk** ketergantungan.
- **Pengguna narkoba/peminum bermasalah:** siapa pun yang mengalami masalah **sosial, psikologis, fisik, atau hukum** akibat intoksikasi, konsumsi berlebihan, atau ketergantungan — definisi holistik yang bisa diperluas dengan kebutuhan **spiritual** (Rassool 2001).
- **Ketergantungan sedang:** sadar punya masalah, belum sampai "minum untuk menghilangkan sakit" putus zat; sering bisa ditangani **di masyarakat** (NTA 2006).
- **Sangat tergantung:** "alkoholisme kronis", minum untuk menghindari putus zat; bisa punya masalah kejiwaan, polydrug; sering perlu **rawat inap** detoksifikasi & rehabilitasi.

# Binge drinking (pesta minuman keras)
- Minum banyak dalam waktu singkat / untuk mabuk.
- **UK (ONS 2015):** >8 unit/sesi (pria), >6 unit (wanita).
- **AS (SAMHSA 2015):** ≥5 gelas pada satu kesempatan, minimal sekali dalam 30 hari terakhir.
- **NIAAA:** pola yang menaikkan **BAC > 0,08 g/dL** — biasanya **4 gelas (wanita) / 5 gelas (pria) dalam 2 jam**.

# Sindrom Ketergantungan Alkohol (Edwards & Gross 1976)
1. Peningkatan toleransi
2. Gejala putus zat berulang
3. Keterpaksaan (*compulsion*) untuk minum
4. **Penonjolan (salience)** perilaku mencari minuman
5. Minum untuk meredakan/menghindari putus zat
6. **Penyempitan repertoar** (pola minum makin seragam)
7. **Pemulihan cepat** (reinstatement) setelah berpantang

# ICD-10: sindrom ketergantungan
Keinginan kuat/keterpaksaan; sulit mengendalikan; putus zat fisiologis; toleransi; pengabaian kesenangan lain; tetap memakai meski jelas berbahaya.

# Strategi global
- **WHO — strategi alkohol (10 area):** kepemimpinan, layanan kesehatan, aksi masyarakat, kebijakan mengemudi mabuk, **ketersediaan**, **pemasaran**, **harga**, mengurangi akibat negatif, alkohol ilegal/informal, pemantauan.
- **Kebijakan narkoba:** komitmen pada **tiga konvensi pengendalian narkoba internasional** PBB.
- **Strategi tembakau:** pantau, lindungi, tawarkan bantuan berhenti, peringatkan bahaya, larang iklan/sponsor, **naikkan pajak**. Isu baru: rokok elektrik & shisha.`,
      poin: [
        "Penggunaan zat dimulai dini, memuncak pertengahan usia 20-an; mulai di remaja awal menaikkan risiko adiksi.",
        "Budaya adiksi (White 1990) = cara hidup; mempertahankan adiksi lewat pengetahuan, dukungan, identitas baru, dan harga diri.",
        "Hazardous use (WHO) = meningkatkan risiko; harmful use (ICD-10) = sudah menimbulkan kerusakan; keduanya bukan ketergantungan.",
        "Binge drinking NIAAA: BAC > 0,08 g/dL, biasanya 4 gelas (wanita)/5 gelas (pria) dalam 2 jam.",
        "Sindrom Ketergantungan Alkohol Edwards & Gross (1976): 7 ciri, termasuk salience, penyempitan repertoar, pemulihan cepat setelah pantang.",
        "Strategi WHO untuk alkohol mencakup ketersediaan, pemasaran, dan kebijakan harga.",
      ],
      istilah: [
        ["Budaya adiksi", "Cara hidup dan jaringan sosial yang normanya mendorong dan mempertahankan penggunaan zat (White 1990)."],
        ["Hazardous use", "Pola penggunaan yang meningkatkan risiko bahaya walau belum ada kerusakan (WHO 1994)."],
        ["Harmful use", "Pola penggunaan yang sudah menyebabkan kerusakan fisik atau mental (ICD-10)."],
        ["Binge drinking", "Minum alkohol dalam jumlah besar dalam waktu singkat hingga BAC > 0,08 g/dL."],
        ["Polydrug use", "Pemakaian beberapa jenis zat sekaligus atau bergantian."],
        ["Salience", "Perilaku mencari zat menjadi prioritas utama di atas kegiatan lain."],
        ["BAC", "Blood Alcohol Concentration — kadar alkohol dalam darah."],
      ],
      kuis: [
        ["Definisi 'budaya adiksi adalah cara hidup…' dikemukakan oleh…", ["Edwards", "White", "Nutt", "Goffman"], 1, "White (1990)."],
        ["Pola penggunaan yang SUDAH menyebabkan kerusakan fisik/mental tetapi bukan ketergantungan disebut…", ["Hazardous use", "Harmful use", "Binge drinking", "Polydrug use"], 1, "Harmful use (ICD-10)."],
        ["Menurut NIAAA, binge drinking menghasilkan BAC lebih dari…", ["0,02 g/dL", "0,05 g/dL", "0,08 g/dL", "0,15 g/dL"], 2, "BAC > 0,08 g/dL, biasanya 4 gelas wanita / 5 gelas pria dalam 2 jam."],
        ["Sindrom Ketergantungan Alkohol dirumuskan oleh…", ["Edwards & Gross (1976)", "White (1996)", "Rassool (2001)", "WHO (1994)"], 0, "Edwards & Gross, 1976."],
        ["Berikut ciri Sindrom Ketergantungan Alkohol, KECUALI…", ["Penyempitan repertoar minum", "Pemulihan cepat setelah berpantang", "Minum hanya saat acara keagamaan", "Minum untuk menghindari putus zat"], 2, "Pilihan lain adalah ciri-ciri yang tercantum."],
        ["Penggunaan zat umumnya memuncak pada…", ["Usia anak-anak", "Pertengahan usia 20-an", "Usia 40-an", "Usia lanjut"], 1, "Dimulai dini dan meningkat tinggi pada pertengahan usia 20-an."],
        ["Penularan HIV dan hepatitis B/C terutama dikaitkan dengan…", ["Merokok", "Narkoba suntik", "Minum alkohol", "Judi"], 1, "Berbagi alat suntik menularkan infeksi lewat darah."],
        ["Fungsi budaya adiksi dalam mempertahankan adiksi meliputi, KECUALI…", ["Memberi pengetahuan cara memakai", "Memberi identitas baru sebagai pengguna", "Mendorong pemulihan", "Menjaga harga diri"], 2, "Budaya adiksi justru mempertahankan, bukan memulihkan."],
        ["Peminum dengan ketergantungan SEDANG biasanya…", ["Selalu perlu rawat inap", "Bisa ditangani di lingkungan masyarakat", "Tidak sadar punya masalah", "Sudah alkoholisme kronis"], 1, "NTA 2006: sering dapat dikelola di masyarakat."],
        ["Rantai perdagangan narkoba yang disebut modul adalah…", ["Produksi → transit → pencucian uang → konsumsi", "Impor → ekspor → pajak", "Tanam → panen → bakar", "Distribusi → iklan → jual"], 0, "Produksi, transit, pencucian uang, konsumsi."],
      ],
      tambahan: [
        { judul: "Koreksi istilah enzim: ADH dan ALDH",
          isi: "Alkohol dipecah dua tahap: alkohol dehidrogenase (ADH) mengubah etanol menjadi asetaldehida, lalu aldehid dehidrogenase (ALDH2) mengubah asetaldehida menjadi asetat. Varian ALDH2 yang kurang aktif — umum di Asia Timur — membuat asetaldehida menumpuk (wajah memerah, mual), dan ini terbukti menurunkan risiko ketergantungan alkohol.",
          ref: "Edenberg, H. J. (2007). The genetics of alcohol metabolism: Role of alcohol dehydrogenase and aldehyde dehydrogenase variants. Alcohol Research & Health, 30(1), 5–13." },
      ],
    },
    {
      no: 5, judul: "Adiksi dari Perspektif Islam",
      ringkas: "Sejarah zat memabukkan di dunia Islam, situasi narkoba di Timur Tengah & Afrika Utara (MENA), ayat-ayat khamr, hukum narkoba menurut ulama, dan cara Islam memandang orang dengan adiksi.",
      tujuan: [
        "Memahami penggunaan zat memabukkan di dunia Islam dan negara-negara MENA",
        "Menjelaskan apa yang dikatakan Al-Qur'an tentang narkoba dan minuman keras",
        "Mendiskusikan bagaimana Islam memandang orang dengan gangguan adiksi",
        "Menjelaskan penggunaan zat psikoaktif untuk keperluan terapi",
        "Mengidentifikasi ayat-ayat Al-Qur'an tentang khamr",
      ],
      materi: `# Zat memabukkan di dunia Islam
- Budaya Islam mengenal obat-obatan yang sama dengan masyarakat Barat. **Haram:** alkohol, obat terlarang, tembakau (menurut banyak ulama kontemporer).
> "Setiap yang memabukkan adalah khamr, dan setiap yang memabukkan adalah haram." (HR Bukhari & Muslim)
- **Kopi:** ditemukan di Ethiopia, menyebar ke Yaman & Jazirah Arab; **larangan pertama** oleh gubernur Makkah tahun **1511**, tetapi akhirnya dinyatakan **halal**. Masuk Istanbul 1555 (Sultan Sulaiman), Eropa 1615 (Venesia).
- **Pala:** sebagian ulama (Ibnu Daqiq al-'Id, mazhab Maliki, Syafi'i, Hanbali) menganggapnya memabukkan dalam jumlah besar. **Wahbah az-Zuhaili:** jumlah kecil sebagai bumbu boleh, jumlah besar haram — namun lebih hati-hati dihindari. Kaidah: **bila halal dan haram berkumpul, yang haram didahulukan**.
- **Hikmah ilahi:** setiap larangan syariat punya hikmah (Allah Al-Hakim). Contoh: **merokok dilarang** berdasarkan hadis *"Tidak boleh membahayakan diri sendiri dan orang lain"* (lā ḍarar wa lā ḍirār) dan bukti medis bahayanya.

# Sejarah di wilayah Muslim
- **Turki Utsmani:** kopi (1555), tembakau (1601); **1621** kopi, tembakau, dan wine dilarang, tetapi opium & ganja tetap legal; **1971** penanaman poppy dilarang.
- **Persia/Iran:** tembakau ±1600, kopi 1597; opium berasimilasi dalam masyarakat (*taryaki* = pengguna opium); Pahlevi membatasi opium (1928); 1970-an mengadopsi model penyakit Barat & terapi **metadon**.
- Modul menyebut **Ibnu Sina** (w. 1037) sebagai pengguna opium yang mungkin wafat karena overdosis; dalam *Al-Qanun fi al-Tibb* ia menjelaskan cara memanen dan memilih opium.
- **Ganja** menyebar luas di dunia Islam abad ke-13–14 bersamaan dengan invasi Tatar. **Ibnu Taimiyah** (*Majmu' al-Fatawa*): ganja dalam banyak hal lebih buruk dari khamr — memabukkan, menimbulkan *takhnīth* dan *dayyūthah* (hilangnya kecemburuan/kehormatan).
- **Hashish & kaum Sufi:** sebagian kelompok sufi memakainya untuk "meditasi" dan menyebutnya penghubung hati dengan Tuhan (*muṣīlat al-qalb*) — praktik yang menyimpang.
- **Al-Biruni** (973–1048) mencatat penduduk daerah panas, termasuk Makkah, memakai opium harian dengan dosis yang naik bertahap hingga mematikan.
- **Penggunaan terapeutik:** para dokter Muslim memandang ganja & opium sebagai **obat kuat yang hanya dipakai bila ada kebutuhan terapi**; ganja (*al-qinnab al-hindi*) masuk dari India lewat Persia.

# Narkoba di Timur Tengah & Afrika Utara (MENA)
- **Ganja** = narkoba paling umum pada orang dewasa.
- Opioid tertinggi: **Afghanistan, Mesir, Iran, Pakistan**; penasun (pengguna narkoba suntik) banyak di Iran, Pakistan, Mesir; **heroin** adalah narkoba suntik utama.
- Contoh: **Iran** di jalur heroin terbesar dunia (metamfetamin = *shisheh*); **Mesir** produsen ganja & poppy (ganja *bango*); **Yaman** — **khat**; **Saudi Arabia** — **Captagon** (dulu fenetilin, kini isinya amfetamin); **Pakistan** — suntikan Avil (antihistamin), heroin, Temgesic; **Irak** — *Krystal* (sabu).
- **HIV** terus meningkat; pendorong utama: seks tanpa kondom & suntik tidak aman. Pakistan memiliki prevalensi HIV tertinggi di antara penasun di kawasan.
- **Pengurangan dampak buruk:** OST (terapi substitusi opioid) di Afghanistan, Iran, Lebanon, Maroko, UEA — **Iran satu-satunya yang menyediakan OST secara luas**; program jarum suntik (NSP) di beberapa negara.

# Al-Qur'an tentang khamr (larangan bertahap)
1. **QS Al-Baqarah 2:219** — ada dosa besar dan beberapa manfaat; dosanya lebih besar.
2. **QS An-Nisa' 4:43** — jangan mendekati salat dalam keadaan mabuk.
3. **QS Al-Ma'idah 5:90** — khamr, judi, berhala, mengundi nasib adalah perbuatan keji dari setan; **jauhilah**.
4. **QS Al-Ma'idah 5:91** — setan ingin menimbulkan permusuhan dan menghalangi dari mengingat Allah dan salat; "maka tidakkah kamu mau berhenti?"
- **Makna khamr:** semua minuman yang memabukkan (Abdel Haleem); yang **menutupi akal** (Ath-Thabari). Hadis Bukhari menyebut khamr dari anggur/kurma, *bit'* (madu), *mizr* (jelai).
- Tidak ada bukti penyalahgunaan ganja, *banj* (henbane), atau opium untuk rekreasi pada **masa awal Islam**; kini ulama sepakat **nikotin, amfetamin, kokain, heroin, ganja** termasuk yang dilarang.
- **Yusuf Al-Qaradawi (2007):** narkoba dipakai untuk **melarikan diri** dari realitas batin, kehidupan, dan agama ke dunia fantasi.

# Memahami adiksi dalam Islam
- Muslim bertanggung jawab **pribadi kepada Allah** sekaligus bagian dari **komunitas**; dukungan meluas melampaui keluarga dekat.
- Masyarakat Muslim tradisional berbasis **budaya malu** (termasuk malu di hadapan Allah), juga mengenal **rasa bersalah** yang diarahkan pada **taubat**.
- **Orang dengan adiksi bukan hanya kegagalan individu, tetapi juga kegagalan masyarakat.**
> QS Al-Anbiya' 21:87 — doa Nabi Yunus: "Lā ilāha illā anta subḥānaka innī kuntu minaẓ-ẓālimīn."`,
      poin: [
        "Hadis: 'Setiap yang memabukkan adalah khamr, dan setiap yang memabukkan adalah haram.'",
        "Larangan khamr bertahap: Al-Baqarah 2:219 → An-Nisa' 4:43 → Al-Ma'idah 5:90–91.",
        "Khamr = semua yang memabukkan/menutupi akal; ulama sepakat narkoba modern termasuk yang diharamkan.",
        "Kopi sempat dilarang di Makkah (1511) lalu dinyatakan halal; merokok dilarang berdasar kaidah 'tidak boleh membahayakan'.",
        "Di MENA: ganja paling umum; heroin narkoba suntik utama; Iran satu-satunya yang menyediakan OST secara luas.",
        "Islam memandang orang dengan adiksi sebagai kegagalan individu dan juga kegagalan masyarakat; jalan keluarnya taubat dan dukungan umat.",
      ],
      istilah: [
        ["Khamr", "Segala sesuatu yang memabukkan dan menutupi akal."],
        ["Lā ḍarar wa lā ḍirār", "Kaidah hadis: tidak boleh membahayakan diri sendiri maupun orang lain."],
        ["Taryaki", "Sebutan untuk pengguna opium dalam masyarakat Persia."],
        ["Captagon", "Tablet stimulan (dulu fenetilin, kini umumnya amfetamin) yang marak di Timur Tengah."],
        ["Khat", "Daun stimulan yang dikunyah, narkoba utama di Yaman."],
        ["OST", "Opioid Substitution Treatment — terapi substitusi opioid, mis. metadon."],
        ["Budaya malu", "Budaya yang mengatur perilaku lewat rasa malu terhadap orang lain dan terhadap Allah."],
      ],
      kuis: [
        ["Ayat yang melarang mendekati salat dalam keadaan mabuk adalah…", ["QS Al-Baqarah 2:219", "QS An-Nisa' 4:43", "QS Al-Ma'idah 5:90", "QS Al-Ma'idah 5:91"], 1, "An-Nisa' 4:43 adalah tahap kedua larangan."],
        ["Ayat yang memerintahkan 'jauhilah' khamr dan judi sebagai perbuatan setan adalah…", ["QS Al-Ma'idah 5:90", "QS Yusuf 12:36", "QS Muhammad 47:15", "QS Al-An'am 6:59"], 0, "Al-Ma'idah 5:90."],
        ["Larangan pertama terhadap kopi dalam sejarah Islam terjadi di Makkah pada tahun…", ["1037", "1511", "1621", "1971"], 1, "Tahun 1511 oleh gubernur Makkah; kopi kemudian dinyatakan halal."],
        ["Dasar pengharaman merokok yang disebut modul adalah hadis…", ["'Kebersihan sebagian dari iman'", "'Tidak boleh membahayakan diri sendiri dan orang lain'", "'Setiap bid'ah adalah sesat'", "'Agama itu nasihat'"], 1, "Lā ḍarar wa lā ḍirār ditambah bukti medis bahaya rokok."],
        ["Ulama yang menyatakan ganja dalam banyak hal lebih buruk daripada khamr adalah…", ["Ibnu Sina", "Al-Biruni", "Ibnu Taimiyah", "Al-Qaradawi"], 2, "Ibnu Taimiyah dalam Majmu' al-Fatawa."],
        ["Satu-satunya negara di kawasan MENA yang menyediakan terapi substitusi opioid (OST) secara luas adalah…", ["Mesir", "Saudi Arabia", "Iran", "Yordania"], 2, "Iran."],
        ["Narkoba yang paling umum digunakan orang dewasa di kawasan MENA adalah…", ["Heroin", "Ganja", "Kokain", "Alkohol"], 1, "Ganja; heroin adalah narkoba suntik utama."],
        ["Kaidah yang dipakai dalam kasus pala: bila sifat halal dan haram berkumpul dalam suatu zat, maka…", ["Yang halal didahulukan", "Yang haram didahulukan", "Diserahkan pada adat", "Hukumnya makruh"], 1, "Prinsip: yang haram lebih diutamakan (untuk kehati-hatian)."],
        ["Menurut modul, Islam memandang orang dengan adiksi sebagai…", ["Murtad", "Hanya kegagalan pribadi", "Kegagalan individu dan juga kegagalan masyarakat", "Tidak bertanggung jawab atas perbuatannya"], 2, "Adiksi juga menunjukkan kegagalan masyarakat menjaga anggotanya."],
        ["Narkoba utama di Yaman adalah…", ["Captagon", "Khat", "Krystal", "Avil"], 1, "Khat."],
      ],
      tambahan: [
        { judul: "Tahapan larangan khamr menurut riwayat asbabun nuzul",
          isi: "Para mufassir menjelaskan urutan: (1) QS An-Nahl 16:67 menyebut 'sakar' tanpa larangan; (2) Al-Baqarah 2:219 menyatakan dosanya lebih besar; (3) An-Nisa' 4:43 melarang salat saat mabuk setelah ada sahabat yang keliru membaca surat dalam salat; (4) Al-Ma'idah 5:90–91 mengharamkan secara tegas — para sahabat lalu menumpahkan khamr hingga mengalir di jalan-jalan Madinah. Pendekatan bertahap ini sering dijadikan inspirasi pendekatan perubahan perilaku dalam konseling adiksi.",
          ref: "Ibnu Katsir, Tafsir al-Qur'an al-'Azhim, tafsir QS Al-Ma'idah 5:90–91; HR Bukhari no. 2464 (kisah khamr ditumpahkan di Madinah)." },
      ],
    },
    {
      no: 6, judul: "Perspektif Teoretis tentang Adiksi I",
      ringkas: "Cara kerja narkoba di otak (neurotransmiter, dopamin, sirkuit reward), lalu model-model adiksi: moral, penyakit, genetik, psikologis, sosiokultural, bio-psiko-sosial(-spiritual), karier, kesehatan masyarakat, serta teori pembelajaran, dorongan, disfungsi penghambatan, dan peniruan.",
      tujuan: [
        "Menjelaskan cara kerja narkoba di otak dan neurotransmiter yang terlibat",
        "Menjelaskan bagaimana narkoba menghasilkan kenikmatan dan apa yang terjadi pada sirkuit otak bila dipakai jangka panjang",
        "Menyebutkan teori dan model yang menjelaskan adiksi",
        "Menjelaskan teori dengan bukti dan keterbatasannya; implikasinya bagi pencegahan & pemulihan",
      ],
      materi: `# Adiksi dan otak
- Neuron: dendrit → badan sel (soma) → akson (bermielin) → terminal → **sinapsis**.
- Reseptor dan neurotransmiter bekerja seperti **lubang kunci dan anak kunci**; masuknya neurotransmiter ke reseptor disebut **pengikatan**.
- **Agonis** mengaktifkan reseptor; **antagonis** memblokirnya.
- Neurotransmiter **rangsang** (mis. **glutamat**) dan **penghambat** (mis. **GABA**).

# Zat dan sistem neurotransmiternya (NIDA 2014)
- **Kokain & metamfetamin** → dopamin.
- **Opiat** (heroin, kodein, OxyContin, Vicodin) → dopamin, opioid endogen (endorfin), GABA.
- **Alkohol** → dopamin, glutamat, GABA.
- **Ganja** → dopamin + sistem **kanabinoid** otak.
- **Nikotin** → **asetilkolin**.
- **Ekstasi (MDMA)** → dopamin & **serotonin**.

# Bagaimana narkoba menghasilkan kenikmatan
- Ganja & heroin **meniru struktur** neurotransmiter alami sehingga mengaktifkan neuron.
- Amfetamin & kokain membuat neuron **melepaskan** neurotransmiter berlebihan atau **mencegah daur ulangnya**.
- Hampir semua narkoba **membanjiri sirkuit reward dengan dopamin**. Dopamin mengatur gerakan, emosi, motivasi, dan rasa senang.
- Jalur reward: **area tegmental ventral (VTA) → nukleus accumbens → korteks prefrontal**.

# Bila dipakai terus-menerus
- Efek dopamin di sirkuit reward menjadi **sangat rendah**; kemampuan menikmati hal lain berkurang.
- Butuh dosis lebih besar (**toleransi**), yang akhirnya mengubah neuron dan sirkuit otak.
- Pemakaian jangka panjang memicu adaptasi pada **kebiasaan / memori bawah sadar** → penggunaan menjadi otomatis.

# Penjelasan populer tentang adiksi
Cacat moral, kebiasaan buruk, pengobatan diri, alergi, kekurangan nutrisi, mengurangi penderitaan emosional, kesadaran mistik/eksistensial, memperbaiki kekurangan pengaturan diri. Adiksi terjadi pada pertemuan **zat**, **biologi/mekanisme otak** (genetik, ritme sirkadian, jenis kelamin), dan **lingkungan** (keluarga, stres, interaksi sosial, stimulus terkondisi, ekspektasi, pembelajaran).

# Model-model adiksi
1. **Model moral:** adiksi = kelemahan moral/karakter, penyimpangan dari norma; individu sepenuhnya bertanggung jawab → cenderung **menyalahkan korban**; intervensi lewat celaan sosial, nasihat agama, bujukan moral, penjara.
2. **Model penyakit:** adiksi = penyakit unik, **progresif, tidak dapat disembuhkan**; orang mengambil "peran sakit"; karena tidak bisa mengontrol konsumsi, **pantang total** satu-satunya pilihan.
3. **Model genetik/neurofarmakologis:** studi keluarga, adopsi, dan kembar menunjukkan peran kelainan biologis; peningkatan transmisi **dopamin di sistem limbik**; sistem **opioid endogen**; serotonin, norepinefrin, GABA. Seberapa besar peran genetik masih diteliti.
4. **Model psikologis:** psikoanalisis (fiksasi oral, menghindari kecemasan); **behavioral** — perilaku yang dipelajari (pengkondisian klasik & operan), **pembelajaran sosial**; penguatan positif dari sensasi menyenangkan; asosiasi dengan lingkungan penggunaan.
5. **Model sosiokultural:** adiksi = perilaku individu dengan efek sosial; alkoholisme sebagai **"penyakit keluarga"**; **makin besar ketersediaan, makin besar prevalensi & keparahan**; dipengaruhi gender, usia, pekerjaan, kelas sosial, etnis, subkultur, agama.
6. **Model bio-psiko-sosial:** banyak jalur menuju adiksi, tergantung individu — biologi (genetik, neurokimia, poros HPA, respons *fight or flight*), psikologi (belajar, emosi, keyakinan, manajemen stres), sosial (dukungan, keluarga, budaya, ekonomi, kemiskinan).
7. **Model bio-psiko-sosial-spiritual (BPSS):** adiksi akibat **terputusnya hubungan dengan Tuhan/Kekuatan yang Lebih Tinggi**; pemulihan = membangun kembali hubungan itu (AA & program **12 langkah**; bagi Muslim **Millati Islami**). Variannya: **bio-psiko-sosial-budaya-spiritual**.
8. **Model "karier" adiksi** (Clinard & Meier 2011; Waldorf 1983): eksperimen → eskalasi → pemeliharaan ("mengurus bisnis") → disfungsi → pemulihan ("keluar dari kehidupan") → mantan pecandu.
9. **Model kesehatan masyarakat:** selain diagnosis & pengobatan, juga pengawasan epidemiologi, promosi kesehatan, pencegahan, **pengurangan dampak buruk**, akses layanan. Langkah: definisikan masalah → identifikasi faktor risiko & pelindung → kembangkan & uji strategi pencegahan → pastikan adopsi luas.

# Kategori teori (West 2013, EMCDDA)
Pemrosesan otomatis, pilihan reflektif, berfokus tujuan, integratif, proses perubahan, neurobiologis, pemodelan populasi, jaringan sosial, ekonomi, komunikasi/pemasaran, sistem organisasi.

# Empat teori beserta bukti & keterbatasannya
- **Teori pembelajaran & perilaku:** adiksi = asosiasi antara **isyarat, respons, dan penguat** yang kuat. *Bukti:* hewan bisa "belajar" adiksi (Ahmed 2011); pola akuisisi & kepunahan sesuai teori pengkondisian (Hyman dkk. 2006); kebiasaan otomatis (Tiffany 1990). *Batasan:* mengabaikan niat & keyakinan sadar; terapi **paparan isyarat (cue exposure)** belum terbukti berhasil.
- **Teori dorongan:** adiksi = dorongan kuat yang ditopang mekanisme **homeostatis** (seperti lapar). *Bukti:* craving saat pantang (Kostowski 2002), dipengaruhi rasa lapar (Kokavec 2008), mirip dorongan alami (Shiffman 2000). *Batasan:* tidak semua adiksi mengikuti pola homeostasis (Koob & Le Moal 2008).
- **Teori disfungsi penghambatan:** adiksi = gangguan mekanisme **pengendalian impuls**. *Bukti:* kontrol impuls yang buruk = faktor risiko (Perry & Carroll 2008); kerusakan jalur penghambatan perilaku (Goldstein & Volkow 2002). *Batasan:* hubungannya hanya **moderat**; banyak adiksi tanpa disfungsi penghambatan (Crews & Boettiger 2009).
- **Teori peniruan:** adiksi dimulai dengan **meniru** pola perilaku & menyerap identitas. *Bukti:* paparan model orang tua/saudara/teman (Kandel & Andrews 1987) dan model di **media** (Anderson dkk. 2009). *Batasan:* adiksi bisa berkembang tanpa model; banyak yang terpapar tidak meniru; bukti intervensinya masih sedikit.`,
      poin: [
        "Hampir semua narkoba membanjiri sirkuit reward (VTA → nukleus accumbens → korteks prefrontal) dengan dopamin.",
        "Nikotin → asetilkolin; ekstasi → dopamin & serotonin; alkohol → dopamin, glutamat, GABA; opiat → dopamin, endorfin, GABA.",
        "Model moral menyalahkan korban; model penyakit: progresif, tak dapat disembuhkan, solusi pantang total.",
        "Model BPSS: adiksi karena terputusnya hubungan dengan Tuhan; contoh AA/12 langkah, bagi Muslim Millati Islami.",
        "Model karier: eksperimen → eskalasi → pemeliharaan → disfungsi → pemulihan → mantan pecandu.",
        "Empat teori + bukti + batasan: pembelajaran, dorongan (homeostasis), disfungsi penghambatan, peniruan.",
      ],
      istilah: [
        ["Neurotransmiter", "Zat kimia pembawa pesan antar-neuron melalui sinapsis."],
        ["Agonis", "Zat yang mengikat dan mengaktifkan reseptor."],
        ["Antagonis", "Zat yang mengikat reseptor tetapi memblokir aktivasinya."],
        ["Dopamin", "Neurotransmiter yang mengatur gerakan, emosi, motivasi, dan rasa senang; inti sirkuit reward."],
        ["GABA", "Neurotransmiter penghambat utama di otak."],
        ["Nukleus accumbens", "Bagian otak pusat rasa senang dalam sirkuit reward."],
        ["Millati Islami", "Program pemulihan 12 langkah berbasis Islam."],
        ["Cue exposure", "Terapi paparan isyarat pemicu tanpa memakai zat agar respons ketagihan padam."],
      ],
      kuis: [
        ["Neurotransmiter utama yang dipengaruhi nikotin adalah…", ["Dopamin saja", "Asetilkolin", "Serotonin", "Glutamat"], 1, "Modul: nikotin menyebabkan perubahan pada sistem asetilkolin."],
        ["Ekstasi (MDMA) terutama memengaruhi sistem…", ["GABA & glutamat", "Dopamin & serotonin", "Asetilkolin", "Kanabinoid"], 1, "Ekstasi memengaruhi dopamin dan serotonin."],
        ["Kokain dan amfetamin bekerja dengan cara…", ["Meniru struktur neurotransmiter", "Membuat neuron melepaskan neurotransmiter berlebih atau mencegah daur ulangnya", "Memblokir semua reseptor", "Menghancurkan neuron secara langsung"], 1, "Ganja & heroin meniru; kokain & amfetamin melepas/mencegah daur ulang."],
        ["Model yang memandang adiksi sebagai penyakit progresif yang tak dapat disembuhkan sehingga satu-satunya pilihan adalah pantang total adalah…", ["Model moral", "Model penyakit", "Model sosiokultural", "Model karier"], 1, "Model penyakit."],
        ["Pendekatan 'menyalahkan korban' paling jelas terlihat pada…", ["Model moral", "Model kesehatan masyarakat", "Model BPSS", "Model genetik"], 0, "Model moral menganggap individu sebagai 'orang jahat'."],
        ["Menurut model sosiokultural, semakin besar ketersediaan alkohol…", ["Semakin kecil masalahnya", "Semakin besar prevalensi dan keparahan masalah", "Tidak berpengaruh", "Hanya berpengaruh pada remaja"], 1, "Ketersediaan berbanding lurus dengan prevalensi & keparahan."],
        ["Urutan model 'karier' adiksi yang benar adalah…", ["Eskalasi → eksperimen → pemulihan", "Eksperimen → eskalasi → pemeliharaan → disfungsi → pemulihan", "Pemeliharaan → eksperimen → disfungsi", "Disfungsi → eksperimen → eskalasi"], 1, "Clinard & Meier; Waldorf."],
        ["Keterbatasan teori pembelajaran & perilaku menurut modul adalah…", ["Tidak ada bukti pada hewan", "Mengabaikan niat & keyakinan sadar, dan terapi cue exposure belum terbukti berhasil", "Terlalu menekankan genetik", "Hanya berlaku untuk alkohol"], 1, "Dua batasan itu disebut di PPT."],
        ["Teori yang menyatakan adiksi = gangguan mekanisme pengendalian impuls adalah…", ["Teori dorongan", "Teori peniruan", "Teori disfungsi penghambatan", "Teori pembelajaran"], 2, "Goldstein & Volkow 2002 menjadi salah satu buktinya."],
        ["Program pemulihan spiritual 12 langkah yang berbasis Islam adalah…", ["Alcoholics Anonymous", "Millati Islami", "SMART Recovery", "Narcotics Anonymous"], 1, "Millati Islami."],
      ],
      tambahan: [
        { judul: "Model 'brain disease' dan kritiknya",
          isi: "NIDA mempopulerkan pandangan adiksi sebagai penyakit otak kronis yang kambuhan. Volkow dkk. (2016) merangkum bukti neurobiologisnya: perubahan sirkuit reward, stres, dan kontrol eksekutif. Para pengkritik (mis. Lewis 2015) berpendapat perubahan otak itu juga terjadi pada pembelajaran biasa, sehingga adiksi lebih tepat dipandang sebagai pembelajaran yang sangat kuat, bukan penyakit. Perdebatan ini relevan dengan Model Moral vs Model Penyakit di modul ini.",
          ref: "Volkow, N. D., Koob, G. F., & McLellan, A. T. (2016). Neurobiologic advances from the brain disease model of addiction. New England Journal of Medicine, 374(4), 363–371; Lewis, M. (2015). The Biology of Desire: Why Addiction Is Not a Disease. PublicAffairs." },
      ],
    },
    {
      no: 7, judul: "Perspektif Teoretis tentang Adiksi II",
      ringkas: "Teori pilihan rasional & bias, penghargaan positif, kebutuhan yang diperoleh/sudah ada, identitas, regulasi diri, integratif, biologis, proses perubahan (transteoretis), jejaring sosial, ekonomi, pemasaran, sistem organisasi — plus COM-B dan teori motivasi PRIME (West).",
      tujuan: [
        "Menjelaskan berbagai teori adiksi beserta bukti dan keterbatasannya",
        "Mendiskusikan implikasi tiap teori untuk pencegahan dan pemulihan",
        "Menjelaskan model COM-B dan teori motivasi PRIME",
      ],
      materi: `# Teori pilihan
- **Pilihan "rasional":** adiksi = keputusan rasional yang lebih mengutamakan manfaat daripada biaya. *Bukti:* banyak pecandu merasa hidup lebih baik dengan perilakunya (Davies 1997); insentif/disinsentif efektif jangka pendek (Lussier dkk. 2006). *Batasan:* buruk memprediksi kekambuhan (Mooney dkk. 1987); **edukasi tentang konsekuensi sering hampir tidak berefek** (Flay 2009).
- **Pilihan "bias":** adiksi muncul dari **bias emosional & kognitif** saat membandingkan pilihan. *Bukti:* pecandu menunjukkan bias kognitif & motivasional (Field & Cox 2008); preferensi berubah-ubah (Skog 2000). *Batasan:* sedikit bukti bias itu menentukan jalannya adiksi (Wiers dkk. 2010); pelatihan mengurangi bias terbatas hasilnya.

# Teori penghargaan & kebutuhan
- **Penghargaan positif:** makin besar kesenangan/kepuasan, makin besar risiko adiksi. *Bukti:* efek euforia (Wise & Bozarth 1987); pola belajar mirip imbalan alami. *Batasan:* pada merokok, kenikmatan **tidak memprediksi** keberhasilan berhenti (Fidler & West 2011).
- **Kebutuhan yang diperoleh:** perilaku adiktif menciptakan kebutuhan fisiologis/psikologis baru yang lalu dipenuhinya (gejala putus zat). *Bukti:* obat peredam putus zat meningkatkan pantang. *Batasan:* **kekambuhan sering terjadi lama setelah putus zat akut berakhir** (Weiss dkk. 2001); banyak kasus tanpa sindrom putus zat jelas (mis. judi).
- **Kebutuhan yang sudah ada sebelumnya:** perilaku adiktif memenuhi kebutuhan yang sudah ada (mis. depresi, kecemasan) → lebih mudah adiksi, lebih sulit pulih. *Batasan:* banyak pecandu tanpa masalah psikologis sebelumnya; kesehatan psikologis sering **membaik setelah pantang**.

# Identitas & regulasi diri
- **Teori identitas:** adiksi dipertahankan oleh cara orang memandang dirinya. *Bukti:* perubahan identitas saat transisi (Kearney & O'Sullivan 2003); identitas baru "dalam pemulihan" di program 12 langkah membantu. *Batasan:* belum ada bukti langsung yang tegas.
- **Teori regulasi diri:** adiksi = gagalnya strategi & kapasitas mengendalikan diri melawan dorongan; sebagian karena **"penipisan ego" (ego depletion)**. *Bukti:* pecandu ingin berhenti tetapi merasa kewalahan (Baumeister & Heatherton 1996); kapasitas kontrol diri terkait pemulihan. *Batasan:* banyak adiksi tanpa konflik; adiksi juga terjadi pada orang yang kontrol dirinya tinggi di bidang lain.

# Teori integratif & biologis
- **Integratif yang lebih luas:** banyak proses berinteraksi (sosial, lingkungan, disposisi). *Batasan:* kehilangan **keringkasan dan kemampuan diuji**.
- **Excessive Appetites (Orford 2001):** proses sekunder memperkuat konsumsi, mis. **siklus regulasi emosi yang diperoleh**.
- **Teori biologis:** adiksi = **"penyakit otak"**; jalur dopamin otak tengah & korteks prefrontal. *Batasan:* mengabaikan proses psikologis lain; banyak riset pada hewan; hampir tidak menghasilkan intervensi baru **kecuali varenicline** (agonis parsial reseptor nikotinat, Cahill dkk. 2010).

# Teori proses perubahan (transteoretis)
- Inisiasi, perkembangan, upaya pemulihan, dan berhasil/gagalnya melibatkan **proses berbeda** yang butuh intervensi berbeda (Prochaska & DiClemente 1983).
- Contoh tahap: **perenungan** (berniat berubah dalam 6 bulan) lebih mungkin berlanjut ke **persiapan** (dalam 1 bulan) daripada langsung **tindakan**.
- *Batasan:* intervensi berbasis tahap **tidak terbukti lebih efektif**; definisi tahap **arbitrer**; orang sering "melompat" antar-tahap (West & Sohal 2006).

# Teori tingkat populasi
- **Jejaring sosial:** keluar-masuk adiksi bergantung pada hubungan sosial; prevalensi menyebar seperti **penularan** (Christakis & Fowler 2008).
- **Ekonomi:** prevalensi diprediksi dari **biaya keuangan** & ketersediaan. *Batasan:* respons kompleks — perokok bisa mengurangi batang tetapi menghisap lebih dalam.
- **Komunikasi/pemasaran:** iklan alkohol & tembakau efektif menaikkan penjualan; pemasaran sosial kadang berhasil, kadang gagal.
- **Sistem organisasi:** pemerintah, industri, dan masyarakat saling berinteraksi; inovasi bisa dinetralkan oleh perubahan kompensasi. *Batasan:* bisa menjelaskan banyak hal tetapi **lemah dalam prediksi**.

# Implikasi bagi pencegahan & pemulihan
- Pembelajaran → kurangi **paparan**; dorongan → cegah dorongan yang diperoleh; disfungsi penghambatan → **latih kontrol diri**.
- Pilihan rasional → **ubah biaya & manfaat**; pilihan bias → kurangi bias; penghargaan positif → **batasi akses** sumber kesenangan berisiko.
- Kebutuhan yang diperoleh → obati **putus zat** dengan obat/konseling; identitas → **model peran positif**.
- Biologis → dasar **obat baru**; proses perubahan → intervensi sesuai **tahap**; jejaring → lemahkan hubungan pendukung adiksi; ekonomi → **pajak/harga**; pemasaran → batasi taktik pemasaran industri.

# Menuju teori komprehensif
- **COM-B (Michie, van Stralen & West 2011):** perilaku (**B**) terjadi bila ada **Capability** (kapabilitas), **Opportunity** (peluang), dan **Motivation** (motivasi); ketiganya berinteraksi dan motivasi harus lebih kuat daripada perilaku pesaing. Dasar *Behaviour Change Wheel*.
- **Teori PRIME (West 2006):** **motivasi adalah inti adiksi**. Lima tingkat yang saling berinteraksi:
  1. **P**lans — rencana (niat sadar, orientasi masa depan)
  2. **R**esponses — respons/perilaku
  3. **I**mpulses/inhibitions — dorongan & penghambat
  4. **M**otives — keinginan (*wants*, kesenangan yang diantisipasi) & kebutuhan (*needs*, kelegaan yang diantisipasi)
  5. **E**valuations — evaluasi/keyakinan baik-buruk
- Setiap saat kita mengejar apa yang **paling kita inginkan atau butuhkan saat itu**. Perubahan perilaku melibatkan pembuatan **"aturan pribadi"**; kekuatan aturan "saya tidak merokok" memprediksi keberhasilan berhenti.

# Kesimpulan
Tiap teori punya implikasi kebijakan berbeda; konteks dan budaya berbeda butuh **perpaduan kebijakan** berbeda. Inti penanganan: **mengurangi paparan** pada faktor lingkungan & internal yang memunculkan keinginan berperilaku adiktif.`,
      poin: [
        "Edukasi tentang konsekuensi saja hampir tidak efektif (Flay 2009) — batasan teori pilihan rasional.",
        "Kekambuhan sering terjadi lama setelah putus zat akut berakhir — batasan teori kebutuhan yang diperoleh.",
        "Teori biologis hampir tak menghasilkan intervensi baru kecuali varenicline.",
        "Model transteoretis (Prochaska & DiClemente): intervensi berbasis tahap tidak terbukti lebih efektif; tahapnya arbitrer.",
        "COM-B: Capability + Opportunity + Motivation → Behaviour.",
        "PRIME (West): Plans, Responses, Impulses/inhibitions, Motives, Evaluations — motivasi adalah inti adiksi.",
      ],
      istilah: [
        ["Ego depletion", "Penipisan kapasitas kontrol diri setelah dipakai, membuat orang lebih mudah menyerah pada dorongan."],
        ["Excessive appetites", "Teori Orford (2001) tentang selera berlebihan yang diperkuat proses sekunder seperti regulasi emosi."],
        ["Model transteoretis", "Model tahapan perubahan Prochaska & DiClemente: prakontemplasi, kontemplasi, persiapan, tindakan, pemeliharaan."],
        ["Varenicline", "Obat berhenti merokok (agonis parsial reseptor nikotinat) yang lahir dari riset biologis."],
        ["COM-B", "Model perilaku: Capability, Opportunity, Motivation → Behaviour."],
        ["Teori PRIME", "Teori motivasi Robert West: Plans, Responses, Impulses, Motives, Evaluations."],
      ],
      kuis: [
        ["Dalam teori PRIME, huruf 'M' merujuk pada…", ["Memory", "Motives (keinginan & kebutuhan)", "Moral", "Mindset"], 1, "M = Motives: wants (kesenangan yang diantisipasi) & needs (kelegaan yang diantisipasi)."],
        ["Teori motivasi PRIME dikembangkan oleh…", ["Orford", "Robert West", "Prochaska", "Baumeister"], 1, "West (2006)."],
        ["Komponen model COM-B adalah…", ["Cognition, Opportunity, Memory", "Capability, Opportunity, Motivation", "Control, Obligation, Mood", "Craving, Obsession, Mania"], 1, "Michie, van Stralen & West (2011)."],
        ["Batasan utama teori pilihan 'rasional' menurut modul adalah…", ["Tidak ada insentif yang efektif", "Edukasi tentang konsekuensi sering hampir tidak berefek", "Hanya berlaku pada hewan", "Terlalu menekankan genetik"], 1, "Flay (2009)."],
        ["Fakta bahwa kekambuhan sering terjadi lama setelah fase putus zat akut berakhir melemahkan teori…", ["Kebutuhan yang diperoleh", "Identitas", "Jejaring sosial", "Pemasaran"], 0, "Weiss dkk. (2001)."],
        ["Satu-satunya intervensi yang disebut lahir dari riset teori biologis adalah…", ["Metadon", "Varenicline", "Naltrekson", "Disulfiram"], 1, "Varenicline untuk berhenti merokok."],
        ["'Penipisan ego' (ego depletion) dikaitkan dengan teori…", ["Regulasi diri", "Ekonomi", "Dorongan", "Peniruan"], 0, "Teori regulasi diri."],
        ["Kritik terhadap model transteoretis adalah…", ["Tahapnya ditetapkan secara ilmiah dan pasti", "Intervensi berbasis tahap tidak terbukti lebih efektif", "Tidak pernah diteliti", "Hanya untuk judi"], 1, "Juga: definisi tahap arbitrer dan orang sering melompati tahap."],
        ["Perubahan prevalensi perilaku adiktif yang menyebar seperti penyakit menular dijelaskan oleh teori…", ["Jejaring sosial", "Identitas", "Penghargaan positif", "Ekonomi"], 0, "Christakis & Fowler (2008)."],
        ["Implikasi teori penghargaan positif bagi pencegahan adalah…", ["Menaikkan identitas", "Membatasi akses ke sumber kesenangan berisiko", "Mengobati putus zat", "Mengubah jejaring"], 1, "Batasi akses ke sumber kesenangan yang berisiko."],
      ],
      tambahan: [
        { judul: "Lima tahap perubahan (untuk melengkapi teori proses perubahan)",
          isi: "Prochaska & DiClemente membagi perubahan menjadi: (1) prakontemplasi — belum berniat berubah; (2) kontemplasi — berniat dalam ±6 bulan; (3) persiapan — berniat dalam ±1 bulan & mulai langkah kecil; (4) tindakan — sedang berubah (<6 bulan); (5) pemeliharaan — bertahan >6 bulan. Kekambuhan dipandang bagian wajar siklus, bukan kegagalan total. Motivational Interviewing sering dipadukan dengan model ini.",
          ref: "Prochaska, J. O., & DiClemente, C. C. (1983). Stages and processes of self-change of smoking: Toward an integrative model of change. Journal of Consulting and Clinical Psychology, 51(3), 390–395." },
      ],
    },
    {
      no: 8, judul: "Model-model Adiksi: Perspektif Islam",
      ringkas: "Spiritualitas dan adiksi, tiga model adiksi dalam Islam (penyakit spiritual, kejahatan, Millati Islami), hukum terkait mabuk, hadis-hadis khamr, dan tujuh tingkatan nafs.",
      tujuan: [
        "Menjelaskan hubungan spiritualitas dan adiksi serta manfaatnya dalam pemulihan",
        "Melacak akar intervensi berbasis spiritual terhadap alkohol dan judi",
        "Menyebutkan hukum talak dalam keadaan mabuk dan ciri utama larangan Islam",
        "Menjelaskan model-model adiksi dari perspektif Islam beserta kekuatan dan keterbatasannya",
        "Mengidentifikasi hadis sahih tentang alkohol dan judi",
      ],
      materi: `# Spiritualitas dan adiksi
- Data National Center on Addiction (Columbia University): >80% orang Amerika percaya Tuhan. Remaja yang **tidak** rutin beribadah **4× lebih mungkin** memakai narkoba dan **3× lebih mungkin** binge drinking; orang dewasa **5× lebih mungkin** memakai narkoba dan **7× lebih mungkin** binge drinking.
- Manusia terdiri dari **ruh, jiwa (nafs), pikiran, dan tubuh**.
- **Akar intervensi spiritual** untuk alkohol & judi dimulai **Nabi Muhammad ﷺ 1400 tahun lalu di Madinah** — Allah mengungkap keburukannya dulu (2:219), lalu melarang saat salat (4:43), lalu mengharamkan mutlak (5:90).
- **Manfaat spiritualitas dalam pemulihan:** penyangga saat putus zat & craving, menyembuhkan emosi merusak (benci, takut, marah, malu, bersalah), membangun harga diri & nilai, **memaafkan diri sendiri dan orang lain**, hubungan yang lebih dalam, dan **harapan**.
- Empat hal yang mendefinisikan spiritualitas dalam Islam: **iman, perilaku baik, kepedulian sosial & mengejar kebenaran, sabar dalam keberagaman**.
- **Bukti:** program 12 langkah berbasis spiritual meningkatkan ketenangan (sobriety) jangka panjang; orang religius/bermeditasi berisiko lebih rendah, juga punya tekanan darah, kolesterol, depresi, kecemasan, dan nyeri yang lebih rendah.

# Model 1: Adiksi sebagai penyakit spiritual
- **Hati** adalah pusat spiritual. *"Di dalam jasad ada segumpal daging; jika baik, baik seluruh jasad… itulah hati."* (HR Bukhari & Muslim)
- Hati yang selamat (QS Asy-Syu'ara' 26:89); hati tenteram dengan zikir (QS Ar-Ra'd 13:28); "dalam hati mereka ada penyakit" (QS Al-Baqarah 2:10).
- Hadis titik hitam (Tirmidzi 3334): setiap dosa menimbulkan **titik hitam di hati**; bila bertaubat dibersihkan, bila diulang menutup hati.
- Aspek **nafs** (rendah) vs **ruh** (suci); kejahatan pertama-tama adalah kejahatan terhadap hati.
- **Az-Zarkashi** (*Zahr al-'Arish fi Tahrim al-Hashish*): ganja melemahkan jiwa, merusak pikiran, membuat lupa zikir, menghilangkan rasa malu, meninggalkan salat, dll.
- **Dua ciri utama larangan Islam:** (1) menghentikan keburukan **dari akarnya, bukan di ujungnya**; (2) melarang **jalan menuju** narkoba/alkohol (*sadd adz-dzari'ah*).

# Model 2: Adiksi sebagai kejahatan
- Melanggar norma = dosa, tetapi belum tentu kejahatan; **semua kejahatan adalah dosa** yang punya implikasi hukum.
- Mayoritas ulama (kecuali sedikit, mis. **al-Qarafi**, w. 1285) memandang ganja terlarang → kejahatan sekaligus dosa.
- Alasan keharaman: membahayakan kesehatan diri & orang lain, membuang harta, efek memabukkan, merusak pikiran rasional, mengganggu keterampilan motorik.
- **Hukuman:** peminum dikenai **had 40 atau 80 cambukan** (Ibnu Taimiyah, *Al-Fatawa al-Kubra*); **mazhab Hanafi:** pemakan ganja dikenai **ta'zir** (hukuman kebijaksanaan hakim), bukan had. Yang menganggapnya halal diminta bertaubat.
- **Talak saat mabuk:** syarat talak sah = berakal & sukarela. Ijma': talak orang hilang akal **bukan** karena zat haram (tidur, pingsan, gila, obat medis) **tidak jatuh**. **Hanafi:** talak orang mabuk karena zat terlarang **tetap jatuh** sebagai hukuman — kecuali karena alasan medis.
- **Kritik model ini:** berfokus pencegahan & implikasi hukum, tetapi **gagal memberi solusi di era modern** (sebagian besar negara Muslim tidak menerapkan hukuman fisik) dan **diskriminatif terhadap istri** (dalam kasus talak).

# Hadis-hadis penting
- "Setiap yang memabukkan adalah khamr dan setiap khamr haram." (Muslim)
- "Khamr adalah sesuatu yang mengaburkan akal." (Bukhari, Muslim)
- "Yang banyaknya memabukkan, sedikitnya pun haram." (Ahmad, Abu Dawud, Tirmidzi)
- "Khamr adalah induk segala keburukan." (Ath-Thabrani)
- Allah melaknat **10 pihak** terkait khamr: pembuat, peminum, penyaji, pembawa, yang dibawakan, penjual, yang makan hasilnya, pembeli, yang dibelikan… (Tirmidzi, Ibnu Majah)
- "Berobatlah, tetapi **jangan berobat dengan yang haram**." (Abu Dawud)
- "Jangan duduk satu meja dengan yang meminum khamr." (Ahmad, Tirmidzi)

# Model 3: Millati Islami (jalan kedamaian)
- Persaudaraan bagi Muslim dengan gangguan adiksi di **Amerika Serikat**, memadukan **cara hidup Islami dengan 12 langkah**. Seperti NA dibuat tidak spesifik zat, MI dibuat **spesifik secara prinsip spiritual**.
- Contoh langkah: (1) mengakui lalai terhadap diri yang lebih tinggi; (2) percaya Allah dapat memulihkan; (3) menyerahkan kehendak kepada Allah; (4) inventaris moral tanpa takut; … (11) memperdalam takwa & ihsan lewat **salat dan iqra'**; (12) membawa pesan kepada manusia.
- Semboyan: **"kita pulih dari salat ke salat"**. QS Al-A'la 87:14-15.

# Tujuh tingkatan nafs (Dharamsi & Maynard 2012)
1. **Ammarah** (yang memerintah keburukan) — paling jauh dari ruh
2. **Lawwamah** (yang mencela diri)
3. **Mulhamah** (yang diilhami)
4. **Muthma'innah** (yang tenang)
5. **Radhiyah** (yang ridha)
6. **Mardhiyyah** (yang diridhai)
7. **Kamilah** (yang sempurna) — paling dekat dengan ruh

# Kesimpulan
- Model penyakit spiritual sejalan dengan "model moral": berbasis pencegahan dan **budaya malu**.
- Kitab suci dan teologi Islam punya alat untuk membangun **model teologis** adiksi yang bisa menjadi dasar program terapi (Mansur Ali 2014).`,
      poin: [
        "Tiga model adiksi dalam Islam: penyakit spiritual, kejahatan, Millati Islami.",
        "Dua ciri larangan Islam: menghentikan keburukan dari akarnya & menutup jalan menuju keburukan.",
        "Hukuman peminum: had 40/80 cambukan; Hanafi: ganja dikenai ta'zir.",
        "Talak orang yang mabuk karena zat haram tetap jatuh menurut Hanafi; tidak jatuh bila hilang akal karena sebab yang tidak haram.",
        "Kritik model kejahatan: tidak memberi solusi modern dan diskriminatif terhadap istri.",
        "Millati Islami = 12 langkah + cara hidup Islami; 'pulih dari salat ke salat'; tujuh tingkatan nafs dari ammarah hingga kamilah.",
      ],
      istilah: [
        ["Had", "Hukuman yang kadarnya ditetapkan syariat, mis. cambuk bagi peminum khamr."],
        ["Ta'zir", "Hukuman yang jenis dan kadarnya diserahkan kepada kebijaksanaan hakim."],
        ["Sadd adz-dzari'ah", "Menutup jalan yang dapat mengantarkan kepada keharaman."],
        ["Millati Islami", "'Jalan kedamaian' — persaudaraan pemulihan 12 langkah berbasis Islam di Amerika Serikat."],
        ["Nafs ammarah", "Jiwa yang selalu memerintahkan keburukan; tingkat nafs terendah."],
        ["Nafs lawwamah", "Jiwa yang mencela dirinya ketika berbuat salah."],
        ["Nafs muthma'innah", "Jiwa yang tenang karena iman dan zikir."],
      ],
      kuis: [
        ["Remaja yang tidak rutin menghadiri kegiatan keagamaan, menurut data Columbia University, berapa kali lebih mungkin memakai narkoba?", ["2 kali", "3 kali", "4 kali", "7 kali"], 2, "4× narkoba dan 3× binge drinking (remaja); orang dewasa 5× dan 7×."],
        ["Dua ciri utama larangan dalam Islam menurut modul adalah…", ["Menghukum di akhir dan memberi denda", "Menghentikan keburukan dari akarnya dan melarang jalan menuju keburukan", "Hanya melarang dalam jumlah besar", "Menyerahkan kepada adat setempat"], 1, "Islam memutus dari akar dan menutup jalan (sadd adz-dzari'ah)."],
        ["Menurut mazhab Hanafi, orang yang memakan ganja dikenai…", ["Had 80 cambukan", "Ta'zir", "Tidak dihukum", "Diasingkan"], 1, "Ta'zir, bukan had."],
        ["Menurut mazhab Hanafi, talak yang diucapkan orang mabuk karena zat terlarang…", ["Tidak sah", "Tetap jatuh sebagai hukuman", "Harus diulang saat sadar", "Ditangguhkan"], 1, "Mengikat secara hukum, kecuali bila karena alasan medis."],
        ["Kritik terhadap model 'adiksi sebagai kejahatan' adalah…", ["Terlalu lunak", "Gagal memberi solusi di era modern dan diskriminatif terhadap istri", "Tidak berdasar hadis", "Hanya untuk non-Muslim"], 1, "Dua kritik itu disebut di slide."],
        ["Semboyan Millati Islami yang dikutip dalam kesaksian anggotanya adalah…", ["Satu hari satu waktu", "Kita pulih dari salat ke salat", "Tetap bersih", "Berhenti sekarang"], 1, "'We recover from salat to salat.'"],
        ["Tingkatan nafs yang paling dekat dengan ruh adalah…", ["Ammarah", "Lawwamah", "Muthma'innah", "Kamilah"], 3, "Nafs kamilah (sempurna) paling dekat dengan ruh; ammarah paling jauh."],
        ["Hadis 'Yang banyaknya memabukkan, sedikitnya pun haram' diriwayatkan oleh…", ["Bukhari saja", "Ahmad, Abu Dawud, Tirmidzi", "Malik", "Ath-Thabrani"], 1, "Ahmad, Abu Dawud, Tirmidzi."],
        ["Hadis tentang titik hitam di hati karena dosa diriwayatkan oleh…", ["Tirmidzi", "Muslim", "Nasa'i", "Ibnu Majah"], 0, "Jami' At-Tirmidzi no. 3334."],
        ["Ulama yang disebut sebagai pengecualian (tidak memandang ganja terlarang) adalah…", ["Ibnu Taimiyah", "Az-Zarkashi", "Al-Qarafi", "Ibnu Abidin"], 2, "Al-Qarafi (w. 1285)."],
      ],
      tambahan: [
        { judul: "Konsep nafs dalam Al-Qur'an",
          isi: "Hanya tiga tingkatan nafs yang disebut eksplisit dalam Al-Qur'an: nafs al-ammarah bis-su' (QS Yusuf 12:53), nafs al-lawwamah (QS Al-Qiyamah 75:2), dan nafs al-muthma'innah (QS Al-Fajr 89:27–28; di ayat ini juga disebut radhiyah & mardhiyyah). Tingkatan mulhamah dan kamilah berasal dari tradisi tasawuf, antara lain ditafsirkan dari QS Asy-Syams 91:8 ('fa alhamaha fujuraha wa taqwaha').",
          ref: "Al-Qur'an QS 12:53, 75:2, 89:27–28, 91:8; Rassool, G. H. (2021). Islamic Psychology: Human Behaviour and Experience from an Islamic Perspective. Routledge (bab tentang nafs)." },
      ],
    },
    {
      no: 9, judul: "Pengalaman Adiksi",
      ringkas: "Adiksi sebagai masalah kesehatan masyarakat, pengalaman adiktif (drug–set–setting), adiksi silang, siklus adiksi, faktor risiko & pelindung, kontinum penggunaan, rute pemberian obat, komplikasi suntik, dan mitos 'kepribadian adiktif'.",
      tujuan: [
        "Mendiskusikan mengapa adiksi merupakan masalah kesehatan masyarakat dan karakteristiknya",
        "Menjelaskan 'pengalaman adiktif' dan faktor yang memengaruhi keputusan memakai zat",
        "Membedakan alasan memulai dan alasan melanjutkan penggunaan",
        "Mengidentifikasi faktor risiko & pelindung serta pola penggunaan zat",
        "Menjelaskan rute pemberian obat dan komplikasi narkoba suntik",
        "Mendiskusikan apakah 'kepribadian adiktif' itu mitos",
      ],
      materi: `# Mengapa adiksi masalah kesehatan masyarakat
- Sejak 1960-an penggunaan narkoba meluas; obat kini **jauh lebih kuat**; bisnis bernilai miliaran dolar.
- Dicoba di **usia makin muda**, sering diberikan kakak, teman, kenalan; paparan media & internet (situs, ruang obrolan, cara membuat obat).
- NPS menawarkan efek kuat dengan biaya murah.
- Merusak generasi muda; pengedaran memicu kriminalitas remaja; **7 dari 10 pengguna narkoba bekerja penuh waktu** → risiko kecelakaan kerja.
- Nutt dkk. menilai obat dari **kesenangan, ketergantungan psikologis, ketergantungan fisik** (skala 0–3).

# Karakteristik adiksi
Penyakit **kronis**, **primer**, **progresif & fatal**, obsesi & craving, "kegilaan" & **penyangkalan**, hidup yang tidak bisa diatur.

# Pengalaman adiktif
> "Pengalaman adiktif adalah totalitas efek yang dihasilkan oleh suatu keterlibatan; berasal dari sumber farmakologis dan fisiologis, tetapi bentuk akhirnya dibangun oleh pengalaman budaya dan individu." — **Stanton Peele**
- Interaksi obat-otak **bukan peristiwa kimia sederhana**: melibatkan obat, orang, dan pesan lingkungan (Royal College of Psychiatrists 1987).
- **Model Drug, Set, Setting (Zinberg):**
  - **Drug (obat):** jenis, kualitas, dosis, frekuensi, rute, legalitas, biaya.
  - **Set (keadaan individu):** fisiologi, kesehatan, kepribadian, usia, jenis kelamin, toleransi, suasana hati, harga diri, ketegasan, keterampilan memutuskan, **pengetahuan, sikap & harapan**.
  - **Setting (lingkungan):** di mana, dengan siapa, tingkat stres, dukungan, pengaruh budaya.
- Tiga faktor saling terkait (Ghodse 1989; Rassool 2011): **farmakologis, individu, konteks**.

# Adiksi silang & siklus adiksi
- **Adiksi silang (cross addiction):** pecandu satu zat pengubah suasana hati berpotensi kecanduan **zat lain dan proses** (judi, makan berlebihan, seks).
- **Siklus adiksi:** pemicu emosional → hasrat → **ritual** → memakai → **rasa bersalah** → pemicu emosional lagi.
- Pemicu bisa internal/eksternal; tanda peringatan fisik, perilaku, psikologis.

# Mengapa orang memakai zat?
Kenikmatan, lingkungan, **rasa ingin tahu & eksperimen**, mekanisme pertahanan/**mengobati diri sendiri**, pemberontakan, ketersediaan & harga, **tekanan teman sebaya**.
- **Alasan memulai ≠ alasan melanjutkan.** Keputusan awal sebagian besar sukarela; kelanjutannya lebih didorong **ketergantungan fisiologis & psikologis** daripada keputusan rasional.

# Faktor risiko & pelindung (NIDA 2014)
| Risiko | Pelindung |
|---|---|
| Agresif di masa kanak-kanak | Pengendalian diri yang baik |
| Kurang pengawasan orang tua | Pemantauan & dukungan orang tua |
| Keterampilan sosial buruk | Hubungan positif |
| Eksperimen obat | Kompetensi akademik |
| Obat tersedia di sekolah | Kebijakan anti-narkoba sekolah |
| Kemiskinan masyarakat | Kebanggaan lingkungan |
- Faktor yang mengarah ke adiksi: **biologi/gen** (gen, jenis kelamin, gangguan mental), **lingkungan** (rumah berantakan, orang tua memakai, prestasi sekolah buruk), **obat** (penggunaan dini, ketersediaan, biaya, rute).

# Kontinum penggunaan
**Tidak memakai → eksperimental → rekreasional → bermasalah → ketergantungan**.
- **Eksperimental:** pertama kali, tekanan teman, ingin terlihat keren/menyesuaikan diri, bosan, penasaran.
- **Rekreasional:** di pesta, santai, jarang, bisa menolak, tidak ada putus zat, toleransi rendah.
- **Bermasalah:** memakai menjadi penting, masalah hubungan/sekolah/hukum/keuangan, hilang kendali.
- **Ketergantungan:** harus memakai, tidak bisa berkata "tidak", memakai terus, mengabaikan tanggung jawab.
- Eksperimen biasanya **berumur pendek**; kebanyakan orang membatasi diri pada zat yang diterima sosial. **Penggunaan kacau (chaotic)** = spontan, tidak berpola.

# Rute pemberian obat
- **Oral:** paling populer, **paling lambat** diserap, tanpa stigma.
- **Merokok/menghirup asap:** efektif; heroin "**mengejar naga**" (*chasing the dragon*); ganja dalam "joint".
- **Mengendus (snorting):** lewat selaput lendir hidung — kokain, pelarut; penyerapan cepat.
- **Menyuntik** (intramuskular, subkutan, intravena): **paling jarang tetapi paling berbahaya** — overdosis, hepatitis B/C, HIV, abses, gangren, trombosis; efek **paling cepat** (IV). Obat yang disuntik: heroin, kokain, amfetamin, sebagian penenang.
- **Komplikasi suntik** (Pates dkk. 2005): dari peralatan (jarum, air, filter), obat (kontaminan, alergi, interaksi), tempat suntik (abses, nekrosis lemak, injeksi arteri/saraf), dan efek sistemik (**overdosis, infeksi, keracunan, emboli, trombosis**).

# Kepribadian adiktif: mitos?
- Ciri yang sering disebut: **mencari sensasi, impulsif, kompulsif**; keengganan menerima aturan masyarakat tampak prediktif.
- **DSM tidak memasukkan "kepribadian adiktif"** sebagai gangguan (ada 10 gangguan kepribadian, mis. ambang, narsistik, paranoid, obsesif-kompulsif).
- **Bukti melawan:** tidak ada ciri universal pada semua pecandu; **hanya ±18%** pecandu memiliki gangguan kepribadian antisosial; banyak pecandu tidak pernah antisosial di masa kecil, dan banyak anak antisosial tidak menjadi pecandu.
- **Studi kembar:** bila satu kembar kecanduan, kembarannya lebih mungkin juga — tergantung **kelas obat**.
- Ciri remaja berisiko tinggi: populer tetapi buruk di sekolah, harga diri rendah, tanpa hambatan, menolak otoritas, berbohong/mencuri, agresif.
> QS Al-Baqarah 2:195 — "janganlah kamu jerumuskan dirimu ke dalam kebinasaan"; QS An-Nisa' 4:29 — "janganlah kamu membunuh dirimu".`,
      poin: [
        "Model Drug–Set–Setting (Zinberg): pengalaman memakai zat ditentukan obat, keadaan individu, dan lingkungan.",
        "Alasan memulai ≠ alasan melanjutkan; kelanjutan lebih didorong ketergantungan daripada keputusan rasional.",
        "Siklus adiksi: pemicu emosional → hasrat → ritual → memakai → rasa bersalah.",
        "Kontinum: tidak memakai → eksperimental → rekreasional → bermasalah → ketergantungan.",
        "Rute oral paling populer & paling lambat; suntik paling jarang tetapi paling berbahaya dan efeknya paling cepat.",
        "Kepribadian adiktif tidak diakui DSM; hanya ±18% pecandu memiliki gangguan kepribadian antisosial.",
      ],
      istilah: [
        ["Drug, Set, Setting", "Model Zinberg: efek zat dipengaruhi obatnya, kondisi individu, dan lingkungan pemakaian."],
        ["Adiksi silang", "Kecenderungan pecandu satu zat untuk juga kecanduan zat atau perilaku lain."],
        ["Chasing the dragon", "Menghirup uap heroin yang dipanaskan di atas foil."],
        ["Penggunaan kacau (chaotic use)", "Pemakaian spontan tanpa pola yang teratur."],
        ["Faktor pelindung", "Kondisi yang menurunkan kemungkinan seseorang mengalami adiksi, mis. pengawasan orang tua."],
        ["Kepribadian adiktif", "Anggapan adanya tipe kepribadian yang membuat orang mudah kecanduan; tidak diakui DSM."],
      ],
      kuis: [
        ["Model 'Drug, Set, and Setting' dikembangkan oleh…", ["Peele", "Zinberg", "Ghodse", "Nutt"], 1, "Model Zinberg."],
        ["Dalam model Zinberg, 'set' merujuk pada…", ["Jenis obat", "Keadaan/kondisi individu (fisiologi, harapan, suasana hati)", "Tempat pemakaian", "Harga obat"], 1, "Set = keadaan individu; setting = lingkungan."],
        ["Urutan siklus adiksi yang benar adalah…", ["Rasa bersalah → ritual → hasrat", "Pemicu emosional → hasrat → ritual → memakai → rasa bersalah", "Memakai → hasrat → pemicu", "Ritual → pemicu → memakai"], 1, "Siklus kembali ke pemicu emosional."],
        ["Rute pemberian obat yang paling populer sekaligus paling lambat diserap adalah…", ["Suntik", "Merokok", "Oral", "Mengendus"], 2, "Oral."],
        ["Rute pemberian obat yang paling berbahaya adalah…", ["Oral", "Suntik", "Mengendus", "Merokok"], 1, "Penyuntikan: risiko overdosis dan infeksi."],
        ["Istilah 'mengejar naga' merujuk pada…", ["Menyuntik kokain", "Menghirup asap heroin", "Minum alkohol cepat", "Mengunyah khat"], 1, "Chasing the dragon = menghirup uap heroin."],
        ["Berapa persen pecandu yang memiliki gangguan kepribadian antisosial menurut modul?", ["Sekitar 5%", "Sekitar 18%", "Sekitar 50%", "Hampir 100%"], 1, "Hanya ±18% — bukti kepribadian adiktif adalah mitos."],
        ["Berikut termasuk faktor PELINDUNG menurut NIDA, KECUALI…", ["Pengendalian diri yang baik", "Kompetensi akademik", "Kurangnya pengawasan orang tua", "Kebijakan anti-narkoba di sekolah"], 2, "Kurang pengawasan orang tua adalah faktor risiko."],
        ["Kecenderungan pecandu alkohol untuk juga kecanduan judi atau makan berlebihan disebut…", ["Toleransi silang", "Adiksi silang", "Polydrug use", "Komorbiditas"], 1, "Cross addiction."],
        ["Penggunaan zat yang berkelanjutan menurut modul lebih didorong oleh…", ["Keputusan rasional", "Ketergantungan fisiologis dan psikologis", "Iklan media", "Harga murah"], 1, "Bukan keputusan rasional."],
      ],
      tambahan: [
        { judul: "Overdosis opioid dan nalokson",
          isi: "Penyuntikan memberi efek tercepat sehingga risiko overdosis paling tinggi, terutama pada opioid. Overdosis opioid ditandai trias: pupil sangat kecil (pinpoint), penurunan kesadaran, dan depresi napas. Nalokson adalah antagonis opioid yang dapat membalikkan overdosis dalam hitungan menit; WHO merekomendasikan nalokson tersedia bagi orang yang kemungkinan menyaksikan overdosis.",
          ref: "World Health Organization. (2014). Community Management of Opioid Overdose. Geneva: WHO." },
      ],
    },
    {
      no: 10, judul: "Alkohol I: Induk Segala Kejahatan",
      ringkas: "Hadis khamr, sejarah penyulingan oleh ilmuwan Muslim, beban global alkohol, DSM-5 Gangguan Penggunaan Alkohol, alkohol di negara mayoritas Muslim, satuan alkohol, farmakologi, efek jangka pendek & panjang, Wernicke–Korsakoff, serta sindrom putus alkohol & delirium tremens.",
      tujuan: [
        "Menjelaskan sejarah singkat alkohol dan bahaya yang ditimbulkannya",
        "Menjelaskan Gangguan Penggunaan Alkohol menurut DSM-5",
        "Meneliti penggunaan alkohol di negara mayoritas Muslim",
        "Menjelaskan satuan alkohol dan farmakologi alkohol",
        "Menjelaskan efek jangka pendek & panjang alkohol",
        "Menjelaskan sindrom putus alkohol beserta tanda & gejalanya",
      ],
      materi: `# Alkohol dalam hadis
- "**Khamr adalah induk segala kejahatan** (*ummul khaba'its*) dan dosa paling besar." (HR Ath-Thabrani)
- "Setiap yang memabukkan adalah khamr, setiap yang memabukkan haram. Siapa yang meminum khamr di dunia lalu mati sebagai pecandu dan belum bertaubat, ia tidak akan meminumnya di akhirat." (HR Muslim & Al-Baihaqi)
- Abu Musa Al-Asy'ari bertanya tentang *al-bit'* (nabidz madu) dan *al-mizr* (nabidz gandum) di Yaman → "Setiap yang memabukkan adalah haram." (HR Bukhari 4343)

# Sejarah & penyulingan
- **Al-kuhl** awalnya = bubuk hitam (celak) dari kondensasi uap logam **antimon**; baru **abad ke-16** dipakai khusus untuk minuman beralkohol suling.
- **Ilmuwan Muslim era Abbasiyah** pertama kali mengisolasi etanol murni lewat penyulingan (abad ke-8–9): **Jabir ibn Hayyan** (Geber, 721–815) menemukan alembik dan mencatat uap anggur yang mudah terbakar; **Al-Kindi**; **Ar-Razi** (864–930) menjelaskan penyulingan alkohol untuk pengobatan. Teknik ini masuk Eropa sekitar **abad ke-12**.

# Beban global (WHO 2014)
- Penyebab utama **>200 penyakit & cedera**; **±3,3 juta kematian/tahun** — lebih besar dari HIV/AIDS, kekerasan, atau TBC; **1 dari 25 kematian** di dunia.
- >10% beban penyakit tidak menular: sirosis, pankreatitis, kanker (mulut, faring, laring, kerongkongan, hati, kolorektal), stroke hemoragik, hipertensi.
- Risiko kematian terkait alkohol **7× lebih tinggi** di Eropa Timur dibanding Mediterania.
- **1 dari 13 wanita hamil** di AS minum alkohol (CDC); anak dengan **FASD** jauh lebih berisiko masalah mental, hukum, dan zat.
- Alkohol terkait kekerasan seksual (korban tidak mampu memberi persetujuan karena mabuk).
- Alkohol berperan dalam: **30%** kecelakaan jalan, **44%** cedera kebakaran, **34%** jatuh & tenggelam, **16%** pelecehan anak, **12%** bunuh diri, **10%** kecelakaan industri.

# DSM-5: Gangguan Penggunaan Alkohol (AUD)
- 11 kriteria (sama seperti gangguan penggunaan zat) dalam 12 bulan; **keparahan: ringan 2–3, sedang 4–5, berat ≥6**.
- Gangguan kejiwaan umum, etiologi multifaktorial, kronis; **±40%** mengalami gejala pertama di usia **15–19 tahun**; **±70%** pecandu alkohol adalah **perokok berat**.
- Faktor yang memengaruhi: perkembangan (pematangan otak, pubertas), genetik, perilaku/temperamen, lingkungan (teman, stres, ketersediaan), fisiologi (metabolisme, craving, reward, toleransi, putus zat).

# Alkohol di negara mayoritas Muslim
- WHO menempatkan negara Muslim **paling rendah** konsumsi per kapita; **39 dari 43** negara Muslim di bawah median. Angka "dilaporkan" bisa lebih rendah dari nyata (selundupan, buatan rumah). Tingkat pantang lebih tinggi pada perempuan.
- Contoh (liter/orang/tahun, 2003–2005): Lebanon 2,23 (legal), Turki 1,87 (legal), Iran 1,02 (ilegal dengan pengecualian), Mesir 0,37, Saudi 0,25 (ilegal), Libya 0,11, Pakistan 0,06.
- Negara Teluk (GCC) bervariasi: dari dilarang total hingga tersedia di hotel.

# Satuan alkohol
- **1 unit = 10 ml (8 g) alkohol murni** (standar UK).
- Rumus: **volume (ml) × ABV (%) ÷ 1000**. Contoh: bir 500 ml dengan ABV 6% = 500 × 6 ÷ 1000 = **3 unit**.
- Label: jumlah unit per sajian/kemasan, pedoman Chief Medical Officer, peringatan kehamilan.

# Farmakologi
- Senyawa karbon, hidrogen, oksigen; tiga jenis yang umum: **metanol, isopropanol, etanol** (yang diminum).
- **Depresan sistem saraf pusat.**
- Penyerapan dipengaruhi laju pengosongan lambung → **makanan (terutama susu) memperlambat** penyerapan.
- Dimetabolisme di **hati** oleh **alkohol dehidrogenase**; dikeluarkan **±¼–⅓ ons per jam**.
- Neurotransmiter: **GABA, serotonin, dopamin, glutamat**. Saat putus zat: pelepasan **glutamat** meningkat (reseptor NMDA aktif berlebihan) dan inhibisi **GABA** berkurang → kecemasan & hiperaktivitas.

# Efek alkohol
- **Jangka pendek:** rileks & euforia, hambatan berkurang, bicara cadel, koordinasi terganggu, emosi meningkat, penilaian buruk, muntah, sakit kepala, insomnia, mabuk.
- **Jangka panjang:** overdosis/keracunan, ketergantungan fisik, gangguan menstruasi & kesuburan, **Sindrom Alkohol Janin**; kerusakan saraf, jantung (hipertensi, aritmia, pembesaran), paru (TBC), **hati**, organ seksual, darah, otak, lambung (tukak), pankreas (pankreatitis), otot, kulit; kanker, diabetes, cedera.
- **Tahapan kerusakan hati:** (1) **perlemakan hati** — bisa pulih penuh dengan pantang; (2) **fibrosis** — pulih sebagian, jaringan parut tetap; (3) **sirosis** — **tidak dapat dipulihkan**.
- Bahaya dibagi **fisik, psikologis, sosial** (Royal College of GPs 1986).

# Wernicke–Korsakoff
- **Ensefalopati Wernicke:** akibat alkohol + **kekurangan tiamin (vitamin B1)** → ataksia (jalan tidak stabil), gerakan mata tersentak (nistagmus), kelumpuhan otot mata, kebingungan; diobati **tiamin dosis tinggi**.
- **Psikosis Korsakoff:** bila Wernicke tidak diobati → amnesia anterograd & retrograd, **konfabulasi** (mengarang cerita untuk mengisi celah ingatan), apatis.

# Sindrom putus alkohol (NICE 2015)
- **Mengancam jiwa**; penyebabnya **pembalikan neurotransmiter** yang sebelumnya ditekan alkohol.
- Garis waktu: **tahap 1** (mulai ±8 jam) — cemas, insomnia, mual, nyeri perut; **tahap 2** (1–3 hari) — tekanan darah & suhu naik; **tahap 3** — halusinasi, demam, **kejang**, agitasi.
- Gejala: cemas, gelisah, mudah tersinggung, mual-muntah, diare, **tremor** (tangan, lidah, kelopak mata), berkeringat, takikardia, hipertensi, halusinasi, delirium.
- **Kejang terkait alkohol:** gejala mulai 6–8 jam; kejang **12–48 jam** setelah minum terakhir; jarang setelah 48 jam; ±70% kejang pada pecandu alkohol karena putus alkohol.
- **Delirium tremens (DT):** perubahan mental-neurologis berat mendadak, biasanya **48–96 jam** setelah minum terakhir; terjadi pada **±3–5%** pasien putus alkohol, terutama yang berhenti mendadak (*cold turkey*). Gejala: tremor, demam >38,3°C, hipertensi, kebingungan, disorientasi, halusinasi, paranoid. Faktor risiko: riwayat putus zat/DT, gejala berat, penyakit penyerta, usia tua.`,
      poin: [
        "Khamr = induk segala kejahatan (HR Ath-Thabrani).",
        "Ilmuwan Muslim Abbasiyah (Jabir ibn Hayyan, Al-Kindi, Ar-Razi) pertama mengisolasi etanol lewat penyulingan.",
        "Alkohol: ±3,3 juta kematian/tahun, 1 dari 25 kematian dunia (WHO 2014).",
        "DSM-5 AUD: ringan 2–3, sedang 4–5, berat ≥6 kriteria.",
        "1 unit = 10 ml/8 g alkohol murni; unit = ml × ABV ÷ 1000.",
        "Hati: perlemakan (reversibel) → fibrosis → sirosis (ireversibel). Wernicke (kurang tiamin) → Korsakoff (amnesia, konfabulasi).",
        "Kejang putus alkohol 12–48 jam; delirium tremens 48–96 jam pada ±3–5% pasien.",
      ],
      istilah: [
        ["Ummul khaba'its", "'Induk segala keburukan' — sebutan Nabi ﷺ untuk khamr."],
        ["Unit alkohol", "10 ml atau 8 g alkohol murni (standar Inggris)."],
        ["ABV", "Alcohol by Volume — persentase kandungan alkohol dalam minuman."],
        ["Sirosis", "Kerusakan hati tahap akhir berupa jaringan parut yang tidak dapat dipulihkan."],
        ["Ensefalopati Wernicke", "Gangguan otak akut karena kekurangan tiamin pada peminum berat."],
        ["Konfabulasi", "Mengarang cerita untuk mengisi kekosongan ingatan, ciri psikosis Korsakoff."],
        ["Delirium tremens", "Komplikasi putus alkohol berat: kebingungan, halusinasi, tremor, demam."],
        ["FASD", "Fetal Alcohol Spectrum Disorder — gangguan pada anak akibat alkohol selama kehamilan."],
      ],
      kuis: [
        ["Satu unit alkohol (standar Inggris) setara dengan…", ["5 ml alkohol murni", "10 ml / 8 g alkohol murni", "14 g alkohol murni", "330 ml bir"], 1, "1 unit = 10 ml atau 8 g alkohol murni."],
        ["Berapa unit alkohol dalam 500 ml bir dengan ABV 6%?", ["1,5 unit", "3 unit", "6 unit", "30 unit"], 1, "500 × 6 ÷ 1000 = 3 unit."],
        ["Menurut DSM-5, Gangguan Penggunaan Alkohol tingkat SEDANG ditandai…", ["2–3 kriteria", "4–5 kriteria", "6 kriteria atau lebih", "1 kriteria"], 1, "Ringan 2–3, sedang 4–5, berat ≥6."],
        ["Tahap kerusakan hati yang TIDAK dapat dipulihkan adalah…", ["Perlemakan hati", "Fibrosis", "Sirosis", "Hepatitis ringan"], 2, "Sirosis bersifat ireversibel."],
        ["Ensefalopati Wernicke disebabkan oleh alkohol dan kekurangan…", ["Vitamin C", "Tiamin (vitamin B1)", "Zat besi", "Vitamin D"], 1, "Diobati dengan tiamin dosis tinggi."],
        ["Mengarang cerita untuk mengisi celah ingatan, ciri psikosis Korsakoff, disebut…", ["Halusinasi", "Konfabulasi", "Delirium", "Ataksia"], 1, "Konfabulasi."],
        ["Delirium tremens biasanya muncul berapa lama setelah minum terakhir?", ["2–4 jam", "8–12 jam", "48–96 jam", "2 minggu"], 2, "48–96 jam, pada ±3–5% pasien."],
        ["Kejang akibat putus alkohol paling sering terjadi…", ["Dalam 1 jam", "12–48 jam setelah minum terakhir", "Setelah 2 minggu", "Hanya saat mabuk"], 1, "Jarang terjadi setelah 48 jam."],
        ["Ilmuwan Muslim yang menemukan alat penyulingan alembik adalah…", ["Ibnu Sina", "Jabir ibn Hayyan", "Al-Biruni", "Ibnu Khaldun"], 1, "Jabir ibn Hayyan (Geber)."],
        ["Makanan yang sangat efektif memperlambat penyerapan alkohol menurut modul adalah…", ["Roti", "Susu", "Kopi", "Air es"], 1, "Susu disebut sangat efektif memperlambat penyerapan."],
        ["Persentase pecandu alkohol yang juga perokok berat menurut modul adalah sekitar…", ["10%", "40%", "70%", "95%"], 2, "Sekitar 70%."],
      ],
      tambahan: [
        { judul: "Alat skrining AUDIT",
          isi: "WHO mengembangkan AUDIT (Alcohol Use Disorders Identification Test): 10 pertanyaan tentang jumlah minum, tanda ketergantungan, dan masalah akibat alkohol. Skor 8–15 menunjukkan konsumsi berisiko (perlu nasihat singkat), 16–19 merugikan, dan ≥20 kemungkinan ketergantungan (perlu rujukan). AUDIT-C adalah versi pendek 3 pertanyaan.",
          ref: "Babor, T. F., Higgins-Biddle, J. C., Saunders, J. B., & Monteiro, M. G. (2001). AUDIT: The Alcohol Use Disorders Identification Test — Guidelines for Use in Primary Care (2nd ed.). Geneva: WHO." },
      ],
    },
    {
      no: 11, judul: "Alkohol II",
      ringkas: "Larangan bertahap alkohol dalam Islam, hadis-hadis ancaman bagi peminum, metabolisme alkohol pada wanita, FASD, skrining (CAGE) & asesmen, tes laboratorium, BAC, detoksifikasi & farmakoterapi, intervensi psikososial, pengurangan dampak buruk, dan intervensi spiritual.",
      tujuan: [
        "Menguraikan sejarah alkohol dari sudut pandang Islam dan larangan bertahapnya",
        "Mengidentifikasi hadis-hadis tentang alkohol dan hukuman bagi peminumnya",
        "Menjelaskan metabolisme alkohol dan ciri FASD",
        "Mengidentifikasi satu instrumen skrining alkohol",
        "Mendiskusikan intervensi farmakologis, non-farmakologis, pengurangan dampak buruk, dan spiritual",
      ],
      materi: `# Larangan bertahap dalam Islam
- Pendekatan **holistik** Islam: apa pun yang berbahaya (atau sebagian besar berbahaya) dilarang.
- Ayat pertama (kronologis) tentang minuman memabukkan turun di **Makkah sebelum hijrah**: **QS An-Nahl 16:67** (dari kurma & anggur kamu membuat minuman memabukkan dan rezeki yang baik).
- Tahap 1 — **QS Al-Baqarah 2:219:** menunjukkan bahaya, belum melarang tegas.
- Tahap 2 — **QS An-Nisa' 4:43:** setelah seorang imam yang mabuk **salah membaca QS Al-Kafirun**; dilarang mendekati salat dalam keadaan mabuk.
- Doa Umar: "Ya Allah, berilah kami penjelasan yang tuntas tentang khamr."
- Tahap 3 — **QS Al-Ma'idah 5:90–91:** diharamkan secara mutlak.
- QS Al-Ma'idah 5:91: setan ingin (1) menimbulkan **permusuhan**, (2) **kebencian**, dan (3) **menghalangi dari mengingat Allah dan salat** melalui khamr dan judi.

# Hadis-hadis tentang peminum
- "Yang banyaknya memabukkan, sedikitnya pun haram." (Abu Dawud 3681)
- **10 orang yang dilaknat** terkait khamr: pembuat, yang membantu membuat, peminum, pembawa, yang dibawakan, yang menyuguhkan, penjual, yang memakan hasilnya, pembeli, dan yang dibelikan. (Ibnu Majah, Tirmidzi)
- "Khamr adalah induk segala kejahatan." (Ibnu Majah 3371)
- **Hukuman di dunia:** "Siapa yang meminum khamr, **salatnya tidak diterima selama 40 hari**." (An-Nasa'i 5570, sahih menurut Al-Albani)
- **Hukuman di akhirat:** dipaksa meminum **ṭīnat al-khabāl** = keringat/cairan penghuni neraka (HR Muslim); air yang sangat panas bagi yang meminum seteguk (HR Ahmad).
- "Tiga orang tidak masuk surga: **pemabuk**, pemutus silaturahim, dan yang memercayai sihir." (Ahmad)
- Peminum yang meninggal (tanpa taubat) menemui Allah **seperti penyembah berhala** (Ahmad, Ibnu Majah).
- Nubuat: sebagian umat akan **menghalalkan khamr** (Bukhari 5590) dan **menyebutnya dengan nama lain** (Ahmad).
- Larangan juga mencakup **mufattir** (segala yang melemahkan/mengiritasi pikiran dan tubuh) (Abu Dawud).

# Metabolisme alkohol
- Metabolisme = mengubah zat menjadi senyawa lain, terutama lewat **oksidasi**.
- **Wanita** menyerap & memetabolisme alkohol berbeda: aktivitas **ADH lambung lebih rendah** → lebih rentan penyakit hati, kerusakan otot jantung, dan kerusakan otak.

# FASD (Fetal Alcohol Spectrum Disorder)
- **100% dapat dicegah**; penyebab utama keterbelakangan mental yang dapat dicegah; **tidak ada kadar alkohol yang aman** saat hamil; kecacatan seumur hidup, tak terlihat, tak dapat dipulihkan; gejala baru jelas usia 3–4 tahun; tidak ada obatnya.
- Spektrum: **Sindrom Alkohol Janin (FAS)**, FAS parsial, cacat lahir terkait alkohol, gangguan perkembangan saraf terkait alkohol.
- Ciri: **kekurangan pertumbuhan**; gangguan **SSP** (sulit belajar, bahasa, konsentrasi, ingatan, hiperaktif); **wajah**: **filtrum rata**, mata kecil, **bibir atas tipis**, batang hidung rendah; cacat jantung (septum ventrikel), sendi, ginjal.

# Skrining & asesmen
- **Pertanyaan dasar (NICE 2007):** zat apa, bagaimana dipakai (suntik/isap/telan/endus), berapa banyak, seberapa sering, perawatan sebelumnya, tujuan & dukungan yang diinginkan.
- **Kuesioner CAGE** — 4 pertanyaan; **2 jawaban "ya"** = kemungkinan minum bermasalah:
  1. **C**ut down — pernah merasa harus mengurangi?
  2. **A**nnoyed — terganggu karena dikritik?
  3. **G**uilty — merasa bersalah?
  4. **E**ye-opener — minum di pagi hari untuk menenangkan saraf/hilangkan pengar?
- **Riwayat & penilaian alkohol:** masalah utama, pola & jumlah, zat lain, tingkat ketergantungan (putus zat, toleransi), masalah terkait (medis, jiwa, sosial, hukum), kondisi mental, pemeriksaan fisik, **motivasi (tahap perubahan)**, kekuatan & upaya sebelumnya, perilaku berisiko, riwayat pantang/kambuh, sumber bantuan.
- **Tes laboratorium:** **GGT (gamma-glutamiltransferase)**, **MCV** (volume sel darah merah), **CDT** (*carbohydrate deficient transferrin*), kadar alkohol darah/napas.
- **BAC & efek:** 0,02 ≈ 1 gelas; 0,04–0,05 mabuk ringan-sedang; **0,08** ≈ 3–5 gelas; 0,16 mabuk signifikan; **0,30** mabuk berat (bisa tidak sadar); **≥0,40 keracunan, dapat mematikan**.

# Intervensi farmakologis
- Tujuan detoks (Rassool 2009): **meredakan gejala putus zat**, mencegah & menangani komplikasi, menyiapkan intervensi psikososial.
- Fase putus zat: awal (0–12 jam), menengah (12–72 jam), **pasca putus zat (2 minggu–1 tahun)**.
- Obat: **chlordiazepoxide / diazepam** (pilihan untuk ketergantungan sedang-berat); **tiamin** & multivitamin; antiemetik & analgesik (parasetamol).
- **Naltrexone:** membantu **mengurangi** minum berat. **Acamprosate:** membantu **mempertahankan pantang**. **Disulfiram:** menghambat pemecahan alkohol → mual & kulit memerah bila minum.
- **Detoks saja tidak cukup** — tidak mengatasi masalah psikologis & sosial; **detoks saja → 95–98% kambuh**. Detoks hanyalah **langkah pertama**.

# Intervensi psikososial
- Intervensi singkat (*brief intervention*), **Motivational Interviewing / Terapi Peningkatan Motivasi**, **CBT**, konseling perkawinan & keluarga, kelompok swadaya **AA**.
- Pendekatan menyeluruh: biologis (detoks, nutrisi, tidur, skrining virus darah), psikologis (konseling, relaksasi, spiritualitas), sosiologis (mentor sebaya, keluarga, pekerjaan, perumahan, hobi).

# Pengendalian & pengurangan dampak buruk
- Kebijakan (WHO): **naikkan pajak**, tegakkan **usia legal**, batas **BAC pengemudi**, **tes napas acak**.
- **Harm reduction** (CAMH 2002): mengurangi dampak negatif **tanpa mengharuskan berhenti**; menemui peminum di tempatnya, **tidak memberi label** "pecandu", memberdayakan orang memilih tujuan sendiri (minum lebih aman, mengurangi, atau berhenti) yang realistis.

# Intervensi spiritual (perspektif Islam)
- QS Al-Isra' 17:82 — Al-Qur'an adalah **penawar (syifa')** dan rahmat bagi orang beriman.
- Islam terbukti berperan **protektif** terhadap alkohol (Riley dkk. 1999; Rehm dkk. 2003).
- **Baasher (1981):** kebijakan awal Islam efektif karena metode **"langkah demi langkah"** mirip **desensitisasi sistematis** — pengekangan agama, persuasi bertahap, dan **keterlibatan masyarakat**; keberhasilan bergantung pada kemauan, keyakinan, dan dukungan masyarakat.
- Komitmen agama terkait dengan kemampuan mengatasi stres yang lebih baik, depresi & kecemasan lebih rendah, risiko bunuh diri & kriminalitas lebih rendah (Gartner 1996; Larson dkk. 1992).
- Bentuk intervensi: **doa** ("doa adalah senjata orang beriman"), tilawah Al-Qur'an, **zikir**, puasa, sedekah/zakat; diintegrasikan dengan **CBT** (restrukturisasi kognitif Islami, Hamdan 2008), konseling, psikoterapi.
- Doa perlindungan dari kesedihan, kelemahan, kemalasan, dll. (HR Bukhari); QS Ali 'Imran 3:135 tentang istighfar.
- **Millati Islami** — 12 langkah berbasis Al-Qur'an & Sunnah.

# Kisah moral
Seorang laki-laki saleh dipaksa memilih: minum khamr, berzina, atau membunuh anak. Ia memilih yang dianggapnya "paling ringan", yaitu minum — lalu dalam keadaan mabuk ia **melakukan ketiganya**. Inilah makna khamr sebagai **induk segala kejahatan**.`,
      poin: [
        "Ayat pertama tentang minuman memabukkan turun di Makkah: QS An-Nahl 16:67; tahap larangan: 2:219 → 4:43 → 5:90–91.",
        "QS 5:91: setan memakai khamr untuk permusuhan, kebencian, dan menghalangi dari zikir & salat.",
        "Peminum khamr: salat tidak diterima 40 hari; di akhirat diberi minum ṭīnat al-khabāl.",
        "CAGE: Cut down, Annoyed, Guilty, Eye-opener — 2 'ya' = kemungkinan bermasalah.",
        "Naltrexone mengurangi minum berat; acamprosate mempertahankan pantang; disulfiram menimbulkan reaksi tidak enak bila minum.",
        "Detoksifikasi saja → 95–98% kambuh; detoks hanya langkah pertama.",
        "Baasher (1981): metode bertahap Islam awal mirip desensitisasi sistematis + keterlibatan masyarakat.",
      ],
      istilah: [
        ["CAGE", "Kuesioner skrining alkohol 4 pertanyaan: Cut down, Annoyed, Guilty, Eye-opener."],
        ["Eye-opener", "Minum alkohol di pagi hari untuk menenangkan saraf atau menghilangkan pengar."],
        ["Ṭīnat al-khabāl", "Keringat/cairan penghuni neraka yang akan diminumkan kepada peminum khamr."],
        ["Mufattir", "Segala sesuatu yang melemahkan dan mengiritasi pikiran, tubuh, dan hati."],
        ["Naltrexone", "Obat yang membantu mengurangi minum berat dan craving."],
        ["Acamprosate", "Obat yang membantu mempertahankan pantang alkohol."],
        ["Disulfiram", "Obat yang menghambat pemecahan alkohol sehingga minum menimbulkan mual dan kemerahan."],
        ["GGT", "Gamma-glutamiltransferase — enzim hati yang meningkat pada peminum berat."],
        ["Harm reduction", "Kebijakan untuk mengurangi dampak buruk penggunaan zat tanpa mengharuskan berhenti."],
      ],
      kuis: [
        ["Ayat pertama (kronologis) tentang minuman memabukkan, turun di Makkah, adalah…", ["QS Al-Baqarah 2:219", "QS An-Nahl 16:67", "QS An-Nisa' 4:43", "QS Al-Ma'idah 5:90"], 1, "An-Nahl 16:67 turun sebelum hijrah."],
        ["Peristiwa yang melatarbelakangi turunnya QS An-Nisa' 4:43 adalah…", ["Perkelahian di pasar", "Imam yang mabuk salah membaca surat dalam salat", "Pertanyaan Umar", "Kematian seorang sahabat"], 1, "Imam mabuk keliru membaca QS Al-Kafirun."],
        ["Menurut hadis An-Nasa'i, salat peminum khamr tidak diterima selama…", ["7 hari", "40 hari", "1 tahun", "Seumur hidup"], 1, "40 hari (sahih menurut Al-Albani)."],
        ["Tiga perbuatan buruk yang ingin ditimbulkan setan melalui khamr menurut QS 5:91 adalah…", ["Mencuri, berzina, membunuh", "Permusuhan, kebencian, dan menghalangi dari zikir & salat", "Malas, boros, sombong", "Dusta, ghibah, fitnah"], 1, "QS Al-Ma'idah 5:91."],
        ["Dalam kuesioner CAGE, huruf 'E' (Eye-opener) berarti…", ["Mata merah setelah minum", "Minum di pagi hari untuk menenangkan saraf/menghilangkan pengar", "Minum di depan umum", "Melihat orang lain minum"], 1, "Eye-opener = minum pagi hari."],
        ["Berapa jawaban 'ya' pada CAGE yang menunjukkan kemungkinan minum bermasalah?", ["1", "2", "3", "4"], 1, "Dua jawaban 'ya'."],
        ["Obat yang membuat peminum merasa mual dan kulitnya memerah bila minum alkohol adalah…", ["Naltrexone", "Acamprosate", "Disulfiram", "Diazepam"], 2, "Disulfiram menghambat metabolisme alkohol."],
        ["Obat pilihan untuk detoksifikasi ketergantungan alkohol sedang hingga berat adalah…", ["Metadon", "Chlordiazepoxide atau diazepam", "Nikotin", "Varenicline"], 1, "Benzodiazepin: chlordiazepoxide/diazepam."],
        ["Bila hanya didetoksifikasi tanpa perawatan lanjutan, angka kekambuhan menurut modul adalah…", ["10–20%", "40–50%", "70%", "95–98%"], 3, "95–98% kambuh."],
        ["Ciri wajah khas Sindrom Alkohol Janin adalah…", ["Bibir atas tebal", "Filtrum rata dan bibir atas tipis", "Mata besar", "Hidung mancung"], 1, "Filtrum rata, mata kecil, bibir atas tipis, batang hidung rendah."],
        ["Baasher (1981) menyamakan metode larangan bertahap di awal Islam dengan…", ["Terapi aversi", "Desensitisasi sistematis", "Psikoanalisis", "Hipnoterapi"], 1, "Langkah demi langkah = desensitisasi sistematis."],
        ["BAC berapa yang dapat menyebabkan keracunan dan kematian?", ["0,02", "0,08", "0,16", "0,40 ke atas"], 3, "≥0,40 keracunan alkohol, bisa mematikan."],
      ],
      tambahan: [
        { judul: "Intervensi singkat FRAMES",
          isi: "Intervensi singkat untuk peminum berisiko sering disusun dengan akronim FRAMES: Feedback (umpan balik tentang risiko pribadi), Responsibility (perubahan tanggung jawab klien), Advice (nasihat jelas untuk berubah), Menu (beberapa pilihan cara berubah), Empathy (sikap empatik), dan Self-efficacy (menumbuhkan keyakinan diri). Cukup 5–15 menit dan terbukti mengurangi konsumsi di layanan primer.",
          ref: "Miller, W. R., & Sanchez, V. C. (1994). Motivating young adults for treatment and lifestyle change. In G. Howard (Ed.), Issues in Alcohol Use and Misuse by Young Adults. University of Notre Dame Press; Kaner, E. F. S. et al. (2018). Effectiveness of brief alcohol interventions in primary care populations. Cochrane Database of Systematic Reviews." },
      ],
    },
    {
      no: 12, judul: "Adiksi Nikotin I",
      ringkas: "Nikotin, tar, karsinogen, karbon monoksida; DSM-5 Gangguan Penggunaan Tembakau; bentuk produk tembakau; cara kerja nikotin; isi asap rokok; perokok pasif; faktor & kelompok risiko; alat ukur (Fagerström); gejala & putus nikotin; efek jangka pendek-panjang; kehamilan; rokok elektrik; dan shisha.",
      tujuan: [
        "Memeriksa besarnya masalah merokok dan bentuk-bentuk konsumsi tembakau",
        "Mendiskusikan keamanan rokok elektrik dan bahaya shisha",
        "Menjelaskan karakteristik & mekanisme kerja nikotin serta zat berbahaya dalam asap",
        "Mendiskusikan efek perokok pasif dan merokok saat hamil",
        "Menyebutkan alat ukur kecanduan nikotin, faktor & kelompok risiko",
        "Menjelaskan gejala kecanduan dan putus nikotin serta efek jangka pendek & panjang",
      ],
      materi: `# Pendahuluan
- Tembakau (terutama rokok) = salah satu ancaman kesehatan **paling mahal dan mematikan**.
- **Kecanduan nikotin = penyakit kronis & kambuhan**; prevalensinya **lebih tinggi** daripada kecanduan alkohol dan obat lain.
- Rokok elektrik & ENDS lebih tidak berbahaya daripada tembakau dan bisa menjadi alternatif bagi pecandu lama, tetapi penyebarannya memprihatinkan karena **tidak dipakai eksklusif sebagai pengganti rokok**.

# Istilah kunci
- **Nikotin:** obat sangat adiktif dalam semua produk tembakau.
- **Karsinogen:** zat penyebab kanker.
- **Tar:** zat hitam lengket yang melapisi saluran napas, mengandung banyak karsinogen.
- **Karbon monoksida (CO):** gas yang menghalangi oksigen masuk ke darah.

# DSM-5: Gangguan Penggunaan Tembakau
≥2 dari 11 kriteria dalam 12 bulan (sama seperti zat lain); **ringan 2–3, sedang 4–5, berat ≥6**.

# Bentuk produk tembakau
Rokok, rokok herbal, tembakau kunyah, tembakau pipa, cerutu, tembakau isap (*snuff*), serta hookah/shisha dan rokok elektrik.

# Nikotin
- Hanya ditemukan di daun tembakau; dosis rendah **merangsang** saraf, dosis tinggi adalah **racun** (dulu dipakai insektisida); **2–3 tetes nikotin murni dapat membunuh**.
- **Stimulan SSP**; sangat adiktif karena memicu pelepasan zat kimia **reward**.
- Satu isapan → nikotin masuk darah **<10 detik**; **¼ nikotin mencapai otak dalam 7 detik** → pelepasan **dopamin** → rasa sejahtera palsu → awal kecanduan.
- **80% remaja yang mencoba ≥2 batang** akan berjuang melawan kecanduan seumur hidup.
- Efek: denyut jantung & tekanan darah naik, pusing, sakit kepala, gangguan tidur, mudah tersinggung, tremor, mual, mulut kering.

# Merokok
- Membahayakan hampir setiap bagian tubuh; angka kematian perokok **2–3× lebih tinggi** (Carter dkk. 2015).
- **Isi rokok: ±4.800 bahan kimia, 69 karsinogen** — tar, **sianida**, **formaldehida** (pengawet/pembalseman), **timbal**, **vinil klorida**, karbon monoksida, **amonia**.
- Kecanduan nikotin terkait gangguan zat lain: gangguan penggunaan alkohol **15,2% vs 5,9%**; gangguan obat lain **10,9% vs 1,9%** (CASA Columbia 2014).

# Perokok pasif
- Gabungan asap dari ujung rokok yang terbakar + asap yang dihembuskan; >4.000 bahan kimia.
- Pada **bayi & anak:** SIDS (sindrom kematian bayi mendadak), infeksi saluran napas, infeksi telinga, serangan asma lebih sering & berat.
- Pada **dewasa bukan perokok:** penyakit jantung, stroke, kanker paru.

# Faktor & kelompok risiko
- **Genetik:** ±½ perilaku merokok dijelaskan faktor genetik (studi kembar); orang yang memetabolisme nikotin **sangat cepat** lebih berisiko.
- **Usia mulai:** mulai usia **8–12 tahun → 5× lebih mungkin** kecanduan dibanding mulai usia 18–19.
- **Riwayat kejiwaan:** prevalensi depresi seumur hidup **59%** pada yang pernah merokok vs **17%** populasi umum.
- Faktor perkembangan, psikologis, lingkungan, dan **pemasaran yang ditargetkan**.
- Kelompok tinggi: **anak muda** (gejala berkembang cepat), pengguna beberapa produk nikotin, dan orang dengan **gangguan jiwa** (depresi berat, fobia, gangguan kepribadian obsesif-kompulsif, antisosial, paranoid).

# Mengukur kecanduan nikotin
- **FTND (Fagerström Test for Nicotine Dependence)** — 6 pertanyaan: seberapa cepat merokok setelah bangun; sulit menahan di tempat terlarang; rokok yang paling berat ditinggalkan; jumlah batang/hari; lebih sering di pagi hari; tetap merokok saat sakit.
- **HSI (Heaviness of Smoking Index)** = item 1 & 4 FTND (waktu rokok pertama + batang/hari).
- Lainnya: **NDSS**, **WISDM**.

# Gejala kecanduan & putus nikotin
- Gejala kecanduan: toleransi, putus nikotin saat berhenti, merokok lebih banyak dari niat, gagal mengurangi, banyak waktu untuk merokok, menunda aktivitas, tetap merokok meski tahu risikonya.
- **Putus nikotin — fisiologis:** mulut kering, mual, sakit tenggorokan, batuk, sakit kepala, lelah, gusi berdarah, sembelit, **nafsu makan & berat badan naik**, insomnia, dada sesak.
- **Psikologis:** **craving**, gelisah, kesepian, sulit konsentrasi, marah, mudah tersinggung, cemas, depresi.

# Efek merokok
- **Jangka pendek:** napas bau, gigi & jari kuning, penciuman & pengecapan berkurang, kapasitas paru & stamina turun, sesak napas, kulit keriput, batuk & pilek, jantung berdebar.
- **Jangka panjang:** kanker (paru, mulut, tenggorokan, kandung kemih), **emfisema**, bronkitis, serangan jantung, stroke, hipertensi, kebutaan, penyakit gusi, tukak lambung, osteoporosis, infertilitas & impotensi, kekebalan menurun.

# Merokok & kehamilan
- Oksigen untuk ibu & janin berkurang; detak jantung janin naik; risiko **keguguran, lahir mati, prematur, berat badan lahir rendah**, masalah paru, cacat lahir, **SIDS**. **Tidak ada tingkat merokok yang aman** selama hamil. Perokok pasif saat hamil juga berisiko.

# Rokok elektrik (ENDS)
- Sejarah: **1963** Herbert A. Gilbert mematenkan rokok elektrik pertama; 1979 Phillip Ray (konsep vaping); **2003 Hon Lik** (apoteker Tiongkok) menciptakan bentuk modern; masuk Eropa 2006, AS 2007; WHO mulai memperhatikan 2008; 2014 dilarang untuk anak di bawah umur di Inggris.
- Komponen: lampu indikator, baterai, sensor, **kumparan pemanas**, ruang penguapan, kartrid **e-liquid** berisi nikotin.
- **Public Health England:** vaping **setidaknya 95% lebih aman** daripada merokok; sisa 5% karena kurangnya riset jangka panjang. Ditemukan ±8 senyawa beracun, tetapi kadarnya **jauh lebih rendah** daripada rokok.
- Kekhawatiran: merusak **perkembangan otak anak** (memori, perhatian), membahayakan janin, sebagian mengandung **formaldehida** dan perasa **diacetyl**; bukti sebagai alat berhenti merokok **belum meyakinkan**; dipakai juga oleh bukan perokok yang ingin berhenti.

# Shisha / hookah
- Shisha = tembakau beraroma (difermentasi dengan molase & buah) yang diisap lewat **hookah** ("hubble bubble", *narghile*). *Narghile* dari bahasa Persia *nārghile* = kelapa. **Hakim Abul Fateh Gilani** menciptakan sistem penyaringan asap lewat air.
- Tren anak muda **18–25 tahun**, "pelumas sosial" di budaya kafe.
- **Tiga mitos:** tidak lebih berbahaya dari rokok; tidak membuat ketagihan; asapnya lebih sedikit racun — **semuanya salah**.
- **Perbandingan:** sebatang rokok = 5–7 menit, 8–12 isapan, 40–75 ml/isapan; **satu sesi shisha = 20–80 menit, 20–200 isapan, 0,15–1 liter/isapan** — setara asap **100+ batang rokok** (WHO 2005). Volume asap ±**90.000 ml** vs 500–600 ml sebatang rokok (CDC).
- **Arang** pemanas menambah CO, logam, dan karsinogen; air **tidak** menyaring racun secara berarti.
- Risiko: kanker paru, mulut, kerongkongan, lambung, kandung kemih; penyakit jantung; menularkan **herpes oral & TBC** lewat corong bersama; bayi dari ibu perokok shisha **lebih ringan** saat lahir.
- Shisha "herbal" non-tembakau **tetap** menghasilkan CO dan zat beracun. **WHO (2005)** merekomendasikan pipa air **dilarang di tempat umum** seperti rokok.`,
      poin: [
        "Kecanduan nikotin: penyakit kronis kambuhan dengan prevalensi lebih tinggi daripada adiksi alkohol & obat lain.",
        "Nikotin mencapai otak dalam ±7 detik dan memicu dopamin; 2–3 tetes nikotin murni dapat mematikan.",
        "Rokok: ±4.800 bahan kimia, 69 karsinogen (tar, sianida, formaldehida, timbal, vinil klorida, CO, amonia).",
        "Mulai merokok usia 8–12 → 5× lebih mungkin kecanduan; ±½ perilaku merokok dijelaskan genetik.",
        "FTND (6 pertanyaan); HSI = item 1 & 4 FTND.",
        "Public Health England: vaping ≥95% lebih aman, tetapi berbahaya bagi otak remaja & janin.",
        "Satu sesi shisha (20–80 menit) ≈ asap 100+ batang rokok; WHO merekomendasikan larangan di tempat umum.",
      ],
      istilah: [
        ["Nikotin", "Stimulan SSP yang sangat adiktif, hanya terdapat pada tembakau."],
        ["Tar", "Zat hitam lengket dalam asap tembakau yang melapisi saluran napas dan mengandung banyak karsinogen."],
        ["Karbon monoksida", "Gas beracun yang menghalangi oksigen masuk ke aliran darah."],
        ["FTND", "Fagerström Test for Nicotine Dependence — 6 pertanyaan untuk mengukur ketergantungan nikotin."],
        ["HSI", "Heaviness of Smoking Index — item 1 dan 4 FTND."],
        ["ENDS", "Electronic Nicotine Delivery Systems, mis. rokok elektrik/vape."],
        ["Shisha", "Tembakau beraroma yang diisap menggunakan hookah (pipa air)."],
        ["SIDS", "Sudden Infant Death Syndrome — kematian bayi mendadak yang risikonya naik karena asap rokok."],
      ],
      kuis: [
        ["Berapa lama ¼ nikotin dari satu isapan mencapai otak?", ["7 detik", "1 menit", "10 menit", "1 jam"], 0, "Sekitar 7 detik; masuk darah kurang dari 10 detik."],
        ["Jumlah bahan kimia dalam rokok dan karsinogennya menurut modul adalah…", ["1.000 & 10", "4.800 & 69", "10.000 & 200", "500 & 5"], 1, "±4.800 bahan kimia, 69 di antaranya karsinogen."],
        ["Orang yang mulai merokok usia 8–12 tahun, berapa kali lebih mungkin kecanduan dibanding yang mulai usia 18–19?", ["2 kali", "3 kali", "5 kali", "10 kali"], 2, "5 kali lebih mungkin."],
        ["Heaviness of Smoking Index (HSI) terdiri dari item FTND nomor…", ["1 & 4", "2 & 3", "5 & 6", "1 & 6"], 0, "Waktu rokok pertama setelah bangun + jumlah batang per hari."],
        ["Menurut Public Health England, vaping setidaknya … lebih aman daripada merokok.", ["50%", "75%", "95%", "100%"], 2, "Setidaknya 95% lebih aman; sisanya karena kurang riset jangka panjang."],
        ["Penemu rokok elektrik bentuk modern (2003) adalah…", ["Herbert A. Gilbert", "Hon Lik", "Phillip Ray", "Abul Fateh Gilani"], 1, "Hon Lik, apoteker Tiongkok."],
        ["Satu sesi merokok shisha dapat setara dengan menghirup asap sekitar…", ["2 batang rokok", "10 batang rokok", "100 batang rokok atau lebih", "1 bungkus rokok"], 2, "WHO (2005): 100 batang atau lebih."],
        ["Kata 'narghile' berasal dari bahasa Persia yang berarti…", ["Air", "Kelapa", "Asap", "Bunga"], 1, "Nārghile = kelapa."],
        ["Gejala putus nikotin yang bersifat fisiologis adalah…", ["Craving", "Kesepian", "Nafsu makan dan berat badan meningkat", "Sulit konsentrasi"], 2, "Craving, kesepian, dan sulit konsentrasi termasuk psikologis."],
        ["Gas dalam asap rokok yang menghalangi oksigen masuk ke darah adalah…", ["Amonia", "Karbon monoksida", "Vinil klorida", "Sianida"], 1, "Karbon monoksida."],
        ["Prevalensi depresi seumur hidup pada orang yang pernah merokok menurut modul adalah…", ["17%", "30%", "59%", "80%"], 2, "59% vs 17% pada populasi umum."],
      ],
      tambahan: [
        { judul: "Kerangka WHO MPOWER",
          isi: "WHO meringkas pengendalian tembakau dengan MPOWER: Monitor (pantau penggunaan & kebijakan), Protect (lindungi dari asap rokok), Offer (tawarkan bantuan berhenti), Warn (peringatan bahaya, termasuk peringatan bergambar), Enforce (tegakkan larangan iklan, promosi & sponsor), Raise (naikkan pajak). Ini sama dengan strategi tembakau yang disebut di Modul 4, dan diturunkan dari Konvensi Kerangka Kerja Pengendalian Tembakau (FCTC) 2003.",
          ref: "World Health Organization. (2008). WHO Report on the Global Tobacco Epidemic, 2008: The MPOWER Package. Geneva: WHO." },
      ],
    },
    {
      no: 13, judul: "Adiksi Nikotin II",
      ringkas: "Merokok di dunia Muslim, taktik industri tembakau, dalil & fatwa keharaman rokok, kebijakan pencegahan (termasuk shisha/TobReg), program Nafis Salaam, serta intervensi berhenti merokok: 5A, NRT, bupropion, varenicline, terapi psikososial, quitline, dan kiat Islami.",
      tujuan: [
        "Menelaah adiksi nikotin dan hukum merokok dari sudut pandang Islam",
        "Memeriksa kebijakan & strategi pencegahan rokok tembakau dan shisha",
        "Menjelaskan alasan berhenti merokok",
        "Mendiskusikan intervensi farmakologis dan non-farmakologis serta peran kelompok swadaya",
        "Menelaah berhenti merokok dari perspektif Islam",
      ],
      materi: `# Merokok di dunia Muslim
- **1,6 miliar Muslim (2010) ≈ 23% populasi dunia**; 62% di Asia-Pasifik; **Indonesia** negara Muslim terbesar (Pew).
- Prevalensi pria tertinggi: **Yaman 77%**, **Indonesia 69%**; Yaman juga tertinggi pada wanita (±⅓). Tunisia 62%, Guinea 59%, Turki 51% (pria) (Ghouri dkk. 2006).
- Studi **BREATHE** (Khattab dkk. 2012) di MENA: terendah di Maghreb & Pakistan, tertinggi Mediterania Timur — dari **15,3% (Maroko) hingga 53,9% (Lebanon)**; rokok 28,8%, pipa air 3,5% (tertinggi di Saudi 8,5%).
- Saudi, Yaman, Oman termasuk 10 negara dengan konsumsi harian tertinggi (Ng dkk. 2014, JAMA); **Lebanon** salah satu dari sedikit negara dengan perokok wanita >20%.
- Ringkasan: prevalensi masih sangat tinggi; banyak ulama MENA sudah mengharamkan, ulama Asia Selatan perlu mengikuti; UU anti-rokok sering tidak ditegakkan; aturan agama perlu didukung **larangan iklan & layanan berhenti**.

# Taktik industri tembakau
- Dokumen internal **British American Tobacco** & **Philip Morris (1985)** menganggap fatwa anti-rokok dan WHO sebagai ancaman; strategi mereka: membingkai penentang rokok sebagai "fundamentalis", memakai **individualisme** dan "modernitas" sebagai tameng.
- Merek (mis. Gauloises, Philip Morris) diyakini **menargetkan negara Muslim** lewat iklan.

# Dalil keharaman merokok
- Kaidah syariah: haram memakan/meminum apa pun yang menyebabkan kematian cepat atau bertahap, atau merusak tubuh; syariah juga melarang **pemborosan**.
- QS Al-A'raf 7:157 (menghalalkan yang baik, mengharamkan yang buruk/*khaba'its*); QS An-Nisa' 4:29 (jangan membunuh dirimu); QS Al-Baqarah 2:195 (jangan menjatuhkan diri ke kebinasaan); hadis **"Tidak boleh membahayakan dan saling membahayakan"** (Ibnu Majah).
- **Perokok pasif:** QS Al-Ahzab 33:58 — menyakiti orang mukmin tanpa kesalahan adalah dosa nyata.
- **Pemborosan:** QS Al-Isra' 17:26–27 (pemboros saudara setan); hadis **lima pertanyaan hari kiamat** — umur, masa muda, harta (dari mana & untuk apa), ilmu (Tirmidzi).
- Bukti larangan (rangkuman mufti): membahayakan tubuh, pikiran & kemauan, lingkungan, harta; kemerosotan moral; zat buruk; contoh buruk.

# Fatwa-fatwa
- Fatwa pertama melarang tembakau: **tahun 1602**.
- **Komite Fatwa Al-Azhar:** merokok, mengimpor, mengekspor, dan memperdagangkan tembakau **haram** (bahaya kanker & pembuluh darah, membuang harta).
- **Konferensi Islam Internasional Memerangi Zat Memabukkan** (Madinah, 1402 H/1982): merokok, menanam, dan memperdagangkan tembakau **haram**.
- **Syekh Muhammad bin Ibrahim Alu Syekh** (mantan Mufti Saudi): haram, termasuk **shisha** — "nama tidak mengubah hakikat".
- **Yusuf Al-Qaradawi:** bila terbukti membahayakan → haram; perbedaan ulama dulu karena **perbedaan pembuktian bahaya**, bukan dalilnya.
- Mazhab: **Maliki** (Al-Laqqani) haram; **Syafi'i** (Al-Najm al-Ghazi) — menyebabkan kelesuan (*mufattir*) → haram; menjadi dosa besar bila terus-menerus; **Hanafi** (Asy-Syurunbulali) dilarang & membatalkan puasa.
- **Komite Tetap Fatwa Saudi** dan **Grand Syekh Al-Azhar Gad al-Haq**: haram.
- **Inisiatif Saudi (2014):** larangan merokok di sekitar **Masjidil Haram & Masjid Nabawi**; larangan penjualan di dekat masjid & sekolah.

# Kebijakan & strategi pencegahan
- Edukasi publik & **kampanye media**; program pencegahan di sekolah & masyarakat.
- Kebijakan: **pajak tembakau**, larangan merokok, pembatasan iklan, **label peringatan**, pembatasan akses remaja, kebijakan sekolah, deteksi dini.
- **WHO TobReg (shisha):** edukasi tentang risiko hookah & perokok pasif; hookah **diatur sama** dengan rokok; **peringatan kesehatan** kuat; larang klaim aman/"0 mg tar"; masukkan dalam program pencegahan & berhenti; larang di tempat umum.

# Agama sebagai pendorong berhenti
- Keyakinan & pedoman agama dapat meningkatkan program berhenti (Ghouri dkk. 2006).
- **Ramadan:** tidak merokok di siang hari → momentum berhenti (White dkk. 2006). Program di London untuk Muslim Bangladesh bermitra dengan **masjid**.
- **Nafis Salaam** ("napas kedamaian"), New York (MCN + IMANA, 2009): survei 408 Muslim — yang **meyakini Islam melarang** merokok **lebih kecil kemungkinannya merokok**; minat besar pada **edukasi berbasis masjid**.
- Religiusitas berdampak positif pada remaja (Rew & Wong 2006; Sinha dkk. 2007), tetapi **belum ada basis bukti kuat** tentang efektivitas ajaran Islam dalam program berhenti (Jabbour & Fouad 2004).

# Intervensi berhenti merokok
- Intensitas intervensi sesuai **keparahan**: ringan → konseling & dukungan; berat → **NRT atau obat**; sangat tergantung jangka panjang → konseling intensif + farmakoterapi.
- **Intervensi singkat 5A:** **Ask** (tanyakan tiap kunjungan), **Advise** (nasihati jelas, kuat, personal), **Assess** (nilai kesediaan), **Assist** (bantu), **Arrange** (jadwalkan tindak lanjut).
- **NRT (Nicotine Replacement Therapy):** nikotin = agen farmakologis **pertama yang disetujui FDA** untuk berhenti merokok; menggantikan sebagian nikotin dari tembakau.
  - **Patch transdermal** (NicoDerm, Nicotrol, Habitrol): >10 batang/hari → **21 mg/hari 6 minggu → 14 mg 2 minggu → 7 mg 2 minggu**.
  - **Semprot hidung:** paling cepat; 0,5 mg/semprot; 1–2 dosis/jam, maksimal 40/hari.
  - **Permen karet:** 1 butir tiap 1–2 jam selama 6 minggu; **hindari minuman asam** (soda, kopi) 15 menit sebelum/saat mengunyah; teknik "kunyah lalu selipkan" di antara pipi & gusi.
  - **Lozenge** (2 & 4 mg), **inhaler** (10 mg/kartrid, 4 mg dihantarkan, 2 mg diserap), tablet **sublingual**.
  - Efek samping NRT: pusing, mual, sakit kepala.
- **Non-nikotin:** **Bupropion** (Zyban) 150 mg 2×/hari — efek samping mulut kering, insomnia, risiko kecil **kejang**; **Varenicline** (Champix/Chantix) — **agonis parsial** reseptor nikotin, efek samping mimpi abnormal, mual; **Nortriptyline** (antidepresan trisiklik); **Clonidine**; **Cytisine** (mirip nikotin, toksisitas rendah).
- **Psikososial:** Motivational Interviewing, CBT, **manajemen kontingensi**; strategi coping tanpa rokok, manajemen stres, dukungan sosial.
- **Quitline:** layanan telepon (materi, konseling singkat, akses obat, telepon tindak lanjut); efektif juga untuk tembakau tanpa asap (Mustaq dkk. 2015).

# Berhenti merokok secara Islami
- Berhenti **sekaligus** lebih baik daripada bertahap (menurut slide).
- **Tawakal** dengan tekad bulat (QS Ali 'Imran 3:159); tolak bisikan setan (3:175; 4:76 — tipu daya setan itu lemah).
- Jauhi teman & lingkungan perokok, perbaiki pola makan, gunakan NRT.
- Renungan: kalau rokok halal, mengapa tidak membaca *bismillah* sebelumnya dan *alhamdulillah* sesudahnya? Mengapa dimatikan dengan sepatu? Mengapa tidak merokok di depan orang tua atau mengajarkannya pada anak?
- Kesimpulan: berhenti itu sulit, butuh komitmen, dukungan, dan waktu, tetapi **perokok lama pun bisa membalikkan sebagian besar kerusakan**.`,
      poin: [
        "Prevalensi merokok pria tertinggi: Yaman 77%, Indonesia 69%; MENA berkisar 15,3% (Maroko)–53,9% (Lebanon).",
        "Dalil: QS 7:157, 4:29, 2:195, hadis lā ḍarar wa lā ḍirār; perokok pasif QS 33:58; pemborosan QS 17:26–27.",
        "Fatwa pertama melarang tembakau 1602; Al-Azhar & Konferensi Madinah 1982 mengharamkan merokok, menanam, dan memperdagangkan tembakau.",
        "Al-Qaradawi: perbedaan ulama karena pembuktian bahaya; bila terbukti berbahaya → haram.",
        "Intervensi singkat 5A: Ask, Advise, Assess, Assist, Arrange.",
        "Patch: 21 mg (6 minggu) → 14 mg (2 minggu) → 7 mg (2 minggu); varenicline = agonis parsial; bupropion berisiko kejang kecil.",
        "Nafis Salaam: yang yakin Islam melarang rokok lebih jarang merokok; Ramadan adalah momentum berhenti.",
      ],
      istilah: [
        ["NRT", "Nicotine Replacement Therapy — mengganti sebagian nikotin dari rokok lewat patch, permen karet, semprot, dll."],
        ["5A", "Ask, Advise, Assess, Assist, Arrange — langkah intervensi singkat berhenti merokok."],
        ["Bupropion", "Antidepresan (Zyban) untuk berhenti merokok; efek samping insomnia & risiko kecil kejang."],
        ["Quitline", "Layanan telepon untuk membantu berhenti merokok."],
        ["Nafis Salaam", "'Napas kedamaian' — program berhenti merokok bagi Muslim di New York."],
        ["TobReg", "Kelompok Studi WHO tentang Regulasi Produk Tembakau."],
        ["Manajemen kontingensi", "Terapi perilaku yang memberi hadiah untuk perilaku sehat (mis. hasil tes bebas nikotin)."],
      ],
      kuis: [
        ["Negara dengan prevalensi merokok pria tertinggi menurut Ghouri dkk. (2006) adalah…", ["Indonesia", "Yaman", "Turki", "Lebanon"], 1, "Yaman 77%, disusul Indonesia 69%."],
        ["Fatwa pertama yang melarang penggunaan tembakau berasal dari tahun…", ["1511", "1602", "1802", "1982"], 1, "1602."],
        ["Konferensi yang menyatakan merokok, menanam, dan memperdagangkan tembakau haram diadakan di…", ["Kairo, 1960", "Madinah, 1982", "Makkah, 2014", "Istanbul, 1621"], 1, "Konferensi Islam Internasional, Madinah 1402 H/1982."],
        ["Menurut Al-Qaradawi, perbedaan pendapat ulama dahulu tentang rokok disebabkan oleh…", ["Perbedaan dalil Al-Qur'an", "Perbedaan pembuktian bahaya rokok", "Perbedaan mazhab teologi", "Tekanan politik"], 1, "Mereka sepakat yang berbahaya itu haram; berbeda dalam membuktikan bahayanya."],
        ["Ayat yang dipakai untuk melarang merugikan perokok pasif adalah…", ["QS Al-Ahzab 33:58", "QS Al-Isra' 17:26", "QS Al-Baqarah 2:219", "QS An-Nur 24:61"], 0, "Menyakiti orang mukmin tanpa kesalahan adalah dosa nyata."],
        ["Urutan langkah intervensi singkat 5A yang benar adalah…", ["Advise, Ask, Assist, Assess, Arrange", "Ask, Advise, Assess, Assist, Arrange", "Assess, Ask, Arrange, Advise, Assist", "Ask, Assist, Advise, Arrange, Assess"], 1, "Ask → Advise → Assess → Assist → Arrange."],
        ["Dosis awal patch nikotin bagi perokok >10 batang/hari adalah…", ["7 mg/hari", "14 mg/hari", "21 mg/hari", "42 mg/hari"], 2, "21 mg/hari selama 6 minggu."],
        ["Mengapa minuman asam harus dihindari saat memakai permen karet nikotin?", ["Merusak gigi", "Mengganggu penyerapan nikotin lewat mukosa mulut", "Menyebabkan mual", "Membuat permen cepat habis"], 1, "Asam menghambat penyerapan nikotin."],
        ["Obat berhenti merokok yang bekerja sebagai agonis parsial reseptor nikotin adalah…", ["Bupropion", "Varenicline", "Nortriptyline", "Clonidine"], 1, "Varenicline (Champix/Chantix)."],
        ["Efek samping bupropion yang perlu diwaspadai adalah…", ["Risiko kecil kejang", "Ketergantungan berat", "Kerusakan hati", "Kebutaan"], 0, "Mulut kering, insomnia, risiko kecil kejang."],
        ["Temuan utama survei Nafis Salaam adalah…", ["Masjid tidak berperan", "Yang meyakini Islam melarang rokok lebih kecil kemungkinannya merokok", "Shisha lebih aman", "Ramadan meningkatkan merokok"], 1, "Keyakinan agama terkait perilaku tidak merokok."],
        ["Menurut WHO TobReg, hookah seharusnya…", ["Dikecualikan dari aturan tembakau", "Diatur sama seperti rokok dan dilarang di tempat umum", "Dipromosikan sebagai alternatif aman", "Hanya diberi label '0 mg tar'"], 1, "Klaim aman dan label menyesatkan harus dilarang."],
      ],
      tambahan: [
        { judul: "Apa yang terjadi pada tubuh setelah berhenti merokok",
          isi: "Dalam 20 menit denyut jantung & tekanan darah mulai turun; 12 jam kadar karbon monoksida darah kembali normal; 2–12 minggu sirkulasi dan fungsi paru membaik; 1–9 bulan batuk dan sesak berkurang; 1 tahun risiko penyakit jantung koroner turun sekitar separuh; 5–15 tahun risiko stroke mendekati bukan perokok; 10 tahun risiko kanker paru turun sekitar separuh.",
          ref: "World Health Organization. (2020). Health benefits of smoking cessation (fact sheet); U.S. Department of Health and Human Services. (2020). Smoking Cessation: A Report of the Surgeon General." },
      ],
    },
    {
      no: 14, judul: "Opiat",
      ringkas: "Sejarah opiat & Perang Opium, opiat alami/semisintetis/sintetis, endorfin & reseptor mu-delta-kappa, cara kerja heroin, efek jangka pendek & panjang, putus zat, NAS pada bayi, overdosis & nalokson, skrining (COWS, DAST-10), metadon-buprenorfin-naltrekson, terapi perilaku, dan pengurangan dampak buruk.",
      tujuan: [
        "Mendiskusikan penggunaan heroin secara terapeutik dan non-terapeutik",
        "Menyebutkan tiga jenis opiat dan rute pemberiannya; opiat yang umum disalahgunakan",
        "Menjelaskan efek jangka pendek & panjang heroin serta gejala putus zatnya",
        "Mendiskusikan efek heroin pada kehamilan dan gejala overdosis",
        "Menjelaskan skrining, asesmen, intervensi farmakologis & psikologis, serta pengurangan dampak buruk",
      ],
      materi: `# Apa itu opiat?
- Narkotika dari tanaman **opium (poppy)**; secara medis untuk **meredakan nyeri, menekan batuk, mengobati diare**.
- Istilah opiat mencakup semua zat alami/sintetis yang **efeknya mirip morfin**.
- Kutipan **Aldous Huxley** tentang "obat surgawi" yang menghapus kesepian — gambaran daya tarik opiat.

# Sejarah singkat
- *Opium* dari bahasa Yunani **opos** (jus); *morfin* dari **Morpheus**, dewa mimpi Yunani.
- Diperdagangkan sebagai mata uang; laporan adiksi opium pertama di Eropa, India, Tiongkok pada **abad ke-16**.
- Awal 1800-an **Sertürner** mengisolasi bahan aktif opium (morfin) → dipakai sebagai anestesi & pereda nyeri; akhir 1800-an profesi medis "menciptakan" banyak pecandu morfin → bereksperimen dengan **kokain sebagai penangkal**.
- **Bayer memproduksi heroin tahun 1898**. Laudanum (opium dalam 50% alkohol) diresepkan untuk "masalah kewanitaan".
- **1960-an: terapi pemeliharaan metadon** diperkenalkan sebagai alternatif lebih aman bagi pecandu heroin.
- **Perang Opium:** adiksi opium meluas di Tiongkok; **Lin Zexu** menulis surat kepada **Ratu Victoria** (1830-an) memprotes pedagang Inggris yang menjual opium — tak dijawab.
- Wilayah produsen: **Segitiga Emas** (Asia Tenggara) dan **Bulan Sabit Emas** — **Iran, Afghanistan, Pakistan**.
- Asal: getah dari bonggol poppy → direbus & disaring → blok morfin → **asetilasi** menjadi heroin.

# Jenis opiat
| Alami | Semisintetis | Sintetis |
|---|---|---|
| Kodein, morfin, oripavin, tebain | **Heroin**, Demerol, Dilaudid (hidromorfon), oksikodon (Percocet), hidrokodon (Vicodin) | **Metadon**, Suboxone, Subutex, naltrekson, nalokson |
- Opiat yang paling sering disalahgunakan: heroin, morfin, kodein, **fentanil**, meperidin, oksikodon, hidrokodon, hidromorfon, oksimorfon.

# "Morfin otak" & reseptor
- **Endorfin & enkefalin** = opiat alami tubuh di otak & sumsum tulang belakang; menghilangkan nyeri sementara setelah cedera; kadar tinggi → euforia, kadar rendah → cemas & peka nyeri. Produksinya dipengaruhi faktor turunan.
- Saat heroin ada, tubuh **mengurangi (bahkan menghentikan) produksi endorfin**.
- **Tiga reseptor: mu (μ), delta (δ), kappa (κ)** — semuanya berpasangan protein G; morfin **agonis kuat mu**, lemah pada delta & kappa.

# Mekanisme kerja heroin
- Di otak, heroin cepat diubah menjadi **morfin** → mengaktifkan reseptor opiat di sistem reward → **"rush"** euforia singkat, lalu beberapa jam santai & puas; pelepasan **dopamin** berlebih → adiksi.
- Bekerja langsung di **pusat pernapasan batang otak** → memperlambat napas (penyebab kematian overdosis); di **sistem limbik** → rasa senang; di **sumsum tulang belakang** → memblokir sinyal nyeri.
- Rute: merokok/menghirup, mendengus, oral, supositoria, **suntik** (subkutan, IM, IV), transdermal, transmukosa. Heroin "**black tar**" dari Meksiko umum di AS.
- Heroin awalnya ±90% murni; pengedar mengencerkannya dengan kafein, soda kue, bedak bayi → biasanya **<40% murni** saat sampai ke pengguna.

# Efek heroin
- **Jangka pendek:** rush disertai kulit memerah hangat, mulut kering, anggota tubuh berat, mual-muntah, gatal; rileks, bebas nyeri & cemas; lalu **mengantuk ("mengangguk")** beberapa jam; refleks batuk, napas, detak jantung menurun.
- **Jangka panjang:** mengubah struktur & fisiologi otak; **toleransi & ketergantungan fisik tinggi**; infeksi **HIV, hepatitis B/C**, **pembuluh darah kolaps**, infeksi bakteri, abses, **infeksi lapisan & katup jantung (endokarditis)**, artritis, penyakit hati & ginjal, pneumonia.
- Hampir semua pengguna heroin juga memakai ≥1 zat lain (kebanyakan ≥3). Orang yang kecanduan **opioid pereda nyeri resep 40× lebih mungkin** kecanduan heroin (kokain 15×, ganja 3×, alkohol 2×).

# Putus zat heroin
- Mulai **6–12 jam** (8–24 jam) setelah dosis terakhir, **puncak 1–3 hari**, mereda dalam sekitar **seminggu**; sindrom pasca-akut bisa bertahan berminggu-minggu hingga bertahun-tahun.
- Gejala: menggigil & **merinding** ("cold turkey"), craving, insomnia, muntah, diare, nyeri otot & tulang, **gerakan kaki menendang** ("kicking the habit"), gelisah.
- Ketergantungan berkembang setelah penggunaan berulang **beberapa minggu**.

# Heroin & kehamilan
- **Neonatal Abstinence Syndrome (NAS):** heroin melewati plasenta → bayi ikut tergantung → setelah lahir mengalami putus zat: menangis berlebihan, demam, mudah marah, gemetar, diare, muntah, berat badan lambat naik, kejang, bahkan kematian; perlu rawat inap & obat (biasanya **morfin**).
- Juga: hambatan pertumbuhan janin; gejala SSP (hipertonia, hiperrefleksia, tremor), saluran cerna, pernapasan (takipnea, bersin, menguap), otonom (demam, berkeringat).

# Overdosis opiat
- Tanda: tidak sadar & tidak responsif, **napas dangkal/berhenti (<10/menit)**, kulit/bibir/kuku **pucat-kebiruan**, suara tersedak/mendengkur, tubuh lemas, dingin, nadi lambat (<40/menit).
- **Trias overdosis: apnea, koma, pupil sangat kecil (pinpoint)**.
- **Intoksikasi** (belum overdosis): terbius/mengantuk, bicara cadel, "mengangguk", gangguan memori, euforia, **pupil menyempit**.
- **Nalokson (Narcan):** **antagonis** yang menggeser opiat dari reseptor dan **membalikkan depresi napas**; **tanpa efek psikoaktif & tanpa potensi penyalahgunaan**; tersedia sebagai **kit penyelamat**. Overdosis = penyebab utama kematian tidak disengaja pengguna opioid. **31 Agustus = Hari Kesadaran Overdosis Internasional**.
- Respons CDC (2015): **Cegah** (kurangi penyalahgunaan obat nyeri resep), **Kurangi** (akses MAT), **Balikkan** (perluas nalokson).

# Skrining & asesmen
- Instrumen: **COWS** (Clinical Opiate Withdrawal Scale), **SOWS** (Subjective…), **DAST-10** (Drug Abuse Screening Test), **CINA**, **CAGE-AID** (CAGE yang diadaptasi untuk obat), Narcotic Withdrawal Scale.
- Asesmen tujuh domain biopsikososial: diagnosis, keparahan intoksikasi/putus zat, kondisi emosi-perilaku-kognitif, kesiapan berubah, potensi kambuh, lingkungan pemulihan.
- Riwayat: zat, pengobatan, kejiwaan, keluarga, kesehatan, sosial; jumlah/frekuensi/rute; toleransi; putus zat; periode pantang & alasan kambuh; kekuatan individu; sumber bantuan.

# Intervensi farmakologis
- **Metadon** (Dolophine, Methadose): **agonis opioid kerja lambat**, diminum oral → meredam "high" sambil mencegah putus zat; dipakai sejak 1960-an; diberikan **harian lewat program resmi**; di Inggris dianggap pengganti terbaik karena mudah & kerja panjang.
- **Buprenorfin** (Subutex): **agonis parsial** — meredakan craving tanpa "high" berbahaya. **Suboxone** = buprenorfin + **nalokson** (mencegah disalahgunakan dengan disuntik).
- **Naltrekson** (Revia): **antagonis** — memblokir efek opioid, tidak adiktif & tidak menenangkan; kelemahannya **kepatuhan pasien rendah**.
- Bukti EMCDDA (2017) bermanfaat: substitusi buprenorfin/metadon, manajemen kasus, naltrekson untuk pasien yang wajib patuh, putus zat dibantu buprenorfin, **agonis alfa-2 adrenergik** (mis. lofeksidin/klonidin), terapi substitusi untuk ibu hamil, pemeliharaan heroin untuk pengguna kronis.

# Intervensi perilaku (NIDA)
- **Manajemen kontingensi:** imbalan nyata (voucher, hadiah) untuk perilaku positif seperti pantang → meningkatkan **retensi** pengobatan.
- **Terapi fasilitasi 12 langkah:** tiga ide — **penerimaan, menyerah, keterlibatan aktif**.
- **CBT:** mengenali & memperbaiki perilaku bermasalah, memantau diri untuk mengenali craving dini, menghindari situasi berisiko tinggi; keterampilannya **bertahan** setelah terapi selesai.
- **Terapi Perilaku Keluarga (FBT):** melibatkan minimal satu orang penting; lebih efektif daripada konseling suportif pada remaja.
- **Efektivitas pengobatan (NIDA):** mengurangi penggunaan narkoba & kejahatan **40–60%**, meningkatkan peluang kerja 40%; **sama suksesnya** dengan pengobatan diabetes, asma, hipertensi (yang kepatuhannya juga rendah).

# Pengurangan dampak buruk (WHO/UNODC/UNAIDS)
- Saran praktis: dosis mudah salah → risiko terbesar adalah overdosis; **merokok di atas timah lebih aman daripada suntik/dengus**; sediakan **Narcan**; **jangan campur dengan depresan SSP** lain (alkohol, benzodiazepin, barbiturat); gunakan di lingkungan aman bersama orang tepercaya.
- Paket komprehensif: **NSP** (program jarum & alat suntik), **OST**, tes & konseling HIV, **ART**, pencegahan IMS, kondom, KIE, vaksinasi & pengobatan hepatitis, pencegahan & pengobatan TBC.
- **Ruang konsumsi obat yang diawasi** (Eropa ±30 tahun): mengurangi penularan penyakit, mencegah kematian overdosis, menghubungkan pengguna dengan layanan.`,
      poin: [
        "Tiga jenis opiat: alami (morfin, kodein), semisintetis (heroin, oksikodon), sintetis (metadon, buprenorfin, naltrekson, nalokson).",
        "Reseptor opioid: mu, delta, kappa; morfin agonis kuat mu. Heroin diubah menjadi morfin di otak.",
        "Putus heroin mulai 6–12 jam, puncak 1–3 hari; gejala merinding & kaki menendang.",
        "Trias overdosis: apnea, koma, pupil pinpoint; nalokson antagonis yang membalikkan depresi napas.",
        "Metadon = agonis kerja lambat; buprenorfin = agonis parsial (Suboxone + nalokson); naltrekson = antagonis (kepatuhan rendah).",
        "NAS: bayi dari ibu pengguna heroin mengalami putus zat setelah lahir.",
        "Pengobatan menurunkan penggunaan & kejahatan 40–60% — sama suksesnya dengan pengobatan diabetes/asma/hipertensi.",
      ],
      istilah: [
        ["Opiat", "Zat alami atau sintetis dari/menyerupai opium yang efeknya mirip morfin."],
        ["Endorfin", "Opiat alami tubuh yang meredakan nyeri dan menimbulkan rasa senang."],
        ["Reseptor mu", "Reseptor opioid utama tempat morfin bekerja sebagai agonis kuat."],
        ["Nalokson", "Antagonis opioid yang membalikkan overdosis; tanpa efek psikoaktif."],
        ["Metadon", "Agonis opioid kerja lambat yang diminum harian untuk terapi substitusi."],
        ["Buprenorfin", "Agonis parsial opioid; Suboxone mengandung buprenorfin + nalokson."],
        ["NAS", "Neonatal Abstinence Syndrome — gejala putus zat pada bayi dari ibu pengguna opioid."],
        ["COWS", "Clinical Opiate Withdrawal Scale — skala klinis gejala putus opiat."],
        ["Bulan Sabit Emas", "Kawasan produsen opium utama: Iran, Afghanistan, Pakistan."],
      ],
      kuis: [
        ["Heroin termasuk golongan opiat…", ["Alami", "Semisintetis", "Sintetis", "Endogen"], 1, "Heroin adalah opiat semisintetis hasil asetilasi morfin."],
        ["Perusahaan yang mulai memproduksi heroin tahun 1898 adalah…", ["Pfizer", "Bayer", "GlaxoSmithKline", "Merck"], 1, "Bayer."],
        ["Pejabat Tiongkok yang menulis surat kepada Ratu Victoria tentang perdagangan opium adalah…", ["Sun Yat-sen", "Lin Zexu", "Mao Zedong", "Kaisar Qianlong"], 1, "Lin Zexu."],
        ["Morfin bekerja sebagai agonis kuat pada reseptor…", ["Delta", "Kappa", "Mu", "GABA"], 2, "Mu (μ)."],
        ["Trias overdosis opioid adalah…", ["Demam, kejang, pupil lebar", "Apnea, koma, pupil sangat kecil", "Takikardia, berkeringat, cemas", "Halusinasi, agitasi, muntah"], 1, "Apnea, koma, pinpoint pupils."],
        ["Obat yang membalikkan overdosis opioid dan tidak memiliki potensi penyalahgunaan adalah…", ["Metadon", "Nalokson", "Buprenorfin", "Morfin"], 1, "Nalokson (Narcan) adalah antagonis."],
        ["Suboxone mengandung buprenorfin dan…", ["Metadon", "Nalokson", "Naltrekson", "Kodein"], 1, "Nalokson untuk mencegah penyalahgunaan dengan disuntik."],
        ["Kelemahan utama naltrekson dalam terapi adalah…", ["Sangat adiktif", "Kepatuhan pasien rendah", "Menyebabkan euforia", "Hanya bisa disuntik"], 1, "Pasien sering sulit patuh."],
        ["Gejala putus heroin biasanya memuncak pada…", ["Jam pertama", "Hari ke-1 sampai ke-3", "Minggu ketiga", "Bulan keenam"], 1, "Mulai 6–12 jam, puncak 1–3 hari."],
        ["Bayi dari ibu pengguna heroin yang mengalami putus zat setelah lahir menderita…", ["FASD", "SIDS", "NAS", "PAWS"], 2, "Neonatal Abstinence Syndrome."],
        ["Orang yang kecanduan opioid pereda nyeri resep, berapa kali lebih mungkin kecanduan heroin?", ["2 kali", "3 kali", "15 kali", "40 kali"], 3, "40 kali (CDC)."],
        ["Tiga ide utama Terapi Fasilitasi 12 Langkah adalah…", ["Edukasi, hukuman, isolasi", "Penerimaan, menyerah, keterlibatan aktif", "Detoks, obat, rawat inap", "Motivasi, kontrak, hadiah"], 1, "Acceptance, surrender, active involvement."],
      ],
      tambahan: [
        { judul: "Mengapa fentanil sangat berbahaya",
          isi: "Fentanil adalah opioid sintetis sekitar 50 kali lebih kuat dari heroin dan 100 kali lebih kuat dari morfin; dosis 2 mg bisa mematikan. Fentanil ilegal sering dicampurkan ke heroin atau pil palsu tanpa sepengetahuan pengguna, sehingga menjadi pendorong utama lonjakan kematian overdosis di Amerika Utara sejak pertengahan 2010-an. Overdosisnya kadang membutuhkan lebih dari satu dosis nalokson.",
          ref: "U.S. Drug Enforcement Administration. (2020). Drugs of Abuse: A DEA Resource Guide — Fentanyl; Centers for Disease Control and Prevention. (2023). Fentanyl Facts." },
      ],
    },
    {
      no: 15, judul: "Psikostimulan I: Kokain & Metamfetamin",
      ringkas: "Psikostimulan alami & sintetis, sejarahnya, penggunaan terapi kokain & amfetamin, cara kerja di otak, efek & komplikasi kokain, tiga fase putus kokain, kehamilan, pengobatan; metamfetamin vs kokain, efek, komplikasi, kehamilan, risiko HIV/hepatitis, overdosis, dan pengobatan (Model Matriks).",
      tujuan: [
        "Menjelaskan penggunaan terapi awal kokain dan penggunaannya kini sebagai anestesi lokal",
        "Menjelaskan mekanisme kerja, efek jangka pendek & panjang, dan komplikasi medis kokain",
        "Menjelaskan fase-fase putus kokain, efeknya pada kehamilan, dan pengobatannya",
        "Membandingkan mekanisme & rute kokain dan metamfetamin",
        "Menjelaskan efek, komplikasi, kehamilan, risiko HIV/hepatitis, dan pengobatan penyalahgunaan metamfetamin",
      ],
      materi: `# Psikostimulan
- Zat yang **meningkatkan aktivitas fisiologis/saraf**: kewaspadaan, perhatian, energi, tekanan darah, detak jantung, pernapasan.
- Penggunaan terapi: asma & masalah napas, obesitas, gangguan neurologis (narkolepsi, ADHD).
- **Dari tumbuhan:** kafein, kokain, ephedra, **khat**. **Sintetis:** amfetamin, metamfetamin, **metilfenidat (Ritalin)**, mazindol, efedrin, pseudoefedrin, fenilefrin, MDA/MDMA.
- Rute: oral (pil), dihirup lewat hidung, diisap, disuntik.

# Sejarah stimulan
- **±5000 SM** tabib Cina memakai **ephedra**; **±2000 SM** mengunyah daun koka.
- 1828 nikotin diisolasi; **1860 kokain diisolasi**; **1880-an amfetamin disintesis**; 1914 MDMA; **1919 metamfetamin kristal disintesis di Jepang**.
- 1930-an **inhaler Benzedrine**; amfetamin untuk narkolepsi; **Perang Dunia II:** "pep pills" untuk kelelahan tempur; 1959 Benzedrine dilarang.
- 1970-an epidemi kokain dimulai; **1970 cathinone** (zat aktif khat) diisolasi; 1980-an orang mulai mencari pengobatan untuk berhenti stimulan.
- Dulu kokain dipercaya mengobati depresi, kecanduan morfin, TBC kronis; **Sigmund Freud (1880-an)** menyebutnya "obat ajaib"; dipakai dalam **Coca-Cola** (kini daunnya dipakai setelah kokainnya dihilangkan). **Penggunaan medis yang disetujui kini hanya anestesi lokal.**
- Amfetamin: pertama untuk **narkolepsi** (meredakan gejala, tidak menyembuhkan); juga Parkinson, depresi, epilepsi, ADHD, obesitas; dipakai tentara dalam Perang Vietnam.
- Contoh obat: Adderall & Dexedrine (ADHD, narkolepsi), Desoxyn (metamfetamin, ADHD), **Ritalin** (metilfenidat, ADHD & narkolepsi).

# Cara stimulan memengaruhi otak
- Meningkatkan efek **dopamin** (dan norepinefrin); dopamin tinggi → **euforia** bila dipakai non-terapeutik.
- Efek fisik: tekanan darah & detak jantung naik, **pembuluh darah menyempit**, glukosa darah naik, saluran napas terbuka.
- **Konsekuensi penyalahgunaan:** ketergantungan; putus zat berupa **kelelahan, depresi, gangguan tidur**; pemakaian berulang dalam waktu singkat → **permusuhan, paranoia, bahkan psikosis**; dosis tinggi → suhu tubuh sangat tinggi, aritmia, gagal jantung, kejang.

# Kokain
- Kristal putih, pahit, tak berbau, diekstraksi dari tanaman **koka**; sangat adiktif. Nama jalanan: coke, snow, blow, powder. Dicampur heroin = **speedball**.
- Dua bentuk: **garam hidroklorida** (bubuk larut air → dihirup/disuntik) dan **basa bebas / crack** (diisap; nama "crack" dari bunyi berderak saat dibakar).
- **Mekanisme:** merangsang sistem **dopamin mesolimbik**; kokain **menempel pada transporter dopamin** dan **memblokir daur ulang** dopamin → dopamin menumpuk di sinapsis → sinyal diperkuat → euforia. Jalur serotonin (mood, memori, tidur) juga terlibat.
- **Onset & durasi:** dihirup — 1 menit, 20–40 menit; disuntik — 1–5 detik, 15–20 menit; **diisap — segera, 5–15 menit**. Mengisap sama kuatnya dengan menyuntik.
- **Efek jangka pendek:** pembuluh darah menyempit, **pupil melebar**, suhu tubuh-detak jantung-tekanan darah naik, perilaku aneh & kasar, gelisah, mudah tersinggung, cemas, panik, paranoid, tremor, vertigo, kedutan otot.
- **Komplikasi medis:** gangguan irama jantung & **serangan jantung**, sakit kepala, **kejang, stroke**, koma, nyeri perut & mual. **Kematian mendadak bisa terjadi bahkan pada pemakaian pertama.** Kokain + alkohol membentuk **kokaetilena** yang sangat beracun.
- **Jangka panjang:** toleransi, **sensitisasi**, pemakaian berlebihan (*binge*), iritabilitas, serangan panik, paranoia, **psikosis** (halusinasi pendengaran), hilang nafsu makan & berat badan, nyeri dada, perdarahan otak, Parkinson, gangguan kognitif, risiko kambuh tinggi.

# Putus kokain
- Waktu paruh sangat singkat → gejala bisa mulai **dalam 90 menit**, berlangsung **±7–10 hari** (dipengaruhi lama pakai, dosis, kemurnian, lingkungan, kesehatan mental).
- Gejala: cemas, gelisah, iritabilitas, **kelelahan ekstrem**, nafsu makan & kantuk meningkat, **anhedonia** (tak bisa merasakan senang), panik, gangguan memori, depresi, **mimpi buruk yang jelas**, disforia, agitasi psikomotor.
- **Tiga fase:** (1) **Crash** — 9 jam hingga 4 hari (depresi, kelelahan ekstrem); (2) **Withdrawal** — 1–10 minggu (depresi, craving kuat); (3) **Extinction (pemadaman)** — tanpa batas waktu (craving berkala, episode depresi).

# Kokain & kehamilan
- Ibu: migrain, kejang, **ketuban pecah dini**, **solusio plasenta**, krisis hipertensi, keguguran, persalinan prematur & sulit.
- Bayi: prematur, **berat lahir rendah, lingkar kepala kecil**, lebih pendek; kecerdasan & keterampilan sosial berkurang.

# Pengobatan kecanduan kokain
- **Farmakologis** (belum ada yang disetujui khusus): **disulfiram** paling menjanjikan; **vaksin kokain**; enzim rekayasa genetik pemecah kokain; **propranolol** untuk gejala putus zat.
- **Perilaku:** **manajemen kontingensi** (insentif motivasi), **CBT** untuk mencegah kambuh (pikiran membentuk perasaan, perasaan membentuk perilaku), **CBT4CBT** terkomputerisasi + konseling mingguan (meningkatkan pantang hingga 6 bulan), konseling via telepon.

# Metamfetamin
- Stimulan SSP kuat & sangat adiktif; nama jalanan: **sabu, ice, crystal, chalk, meth, speed**; kristal putih pahit larut air/alkohol; awalnya dipakai dalam dekongestan & inhaler bronkial.
- Efek: lebih aktif & banyak bicara, nafsu makan turun, euforia. Diisap, didengus, disuntik, atau ditelan; mengisap/menyuntik → "**rush**" instan. Pola khas: **"pesta lalu teler" (binge & crash)**.

# Metamfetamin vs kokain (NIDA 2013)
| Metamfetamin | Kokain |
|---|---|
| Stimulan | Stimulan **dan anestesi lokal** |
| **Buatan manusia** | Dari tumbuhan |
| Efek mabuk diisap **tahan lama** | Efek diisap **singkat** |
| 50% keluar dari tubuh dalam **12 jam** | 50% keluar dalam **1 jam** |
| **Meningkatkan pelepasan** & memblokir penyerapan kembali dopamin | **Memblokir** penyerapan kembali dopamin |
| Penggunaan medis terbatas (ADHD, berat badan) | Anestesi lokal pada bedah tertentu |

# Efek metamfetamin
- **Jangka pendek:** waspada, kurang lelah, aktif, nafsu makan turun, euforia, napas & detak jantung cepat/tidak teratur, **hipertermia**, pupil besar, mulut & kulit kering, gatal, jerawat, berkeringat, kedutan.
- **Jangka panjang:** toleransi, sulit merasakan senang, cemas, bingung, insomnia, gangguan mood, kekerasan, **ciri psikotik** (paranoia, halusinasi visual & pendengaran, delusi), perubahan struktur & fungsi otak, defisit berpikir & motorik, hilang memori, **masalah gigi parah ("meth mouth")**, berat badan turun.
- **Neuroimaging (Volkow dkk. 2001):** transporter dopamin **pulih sebagian setelah pantang 14 bulan** — pemulihan mungkin, tetapi lama.
- **Komplikasi medis:** takikardia, hipertensi, hipertermia, agitasi, **penyakit ginjal & stroke**, **serangan jantung pada usia muda (29–45 tahun)**, hipertensi paru akut (merokok sabu), merusak fungsi limfosit T CD8.
- **Kehamilan:** persalinan prematur, solusio plasenta; bayi kecil, lesu, kelainan jantung & otak, sulit bernapas normal; anak usia 3–5 tahun lebih cemas, kurang perhatian, destruktif & agresif.
- **HIV/hepatitis B & C:** metamfetamin memicu **perilaku seks berisiko** (tanpa kondom); memperburuk perkembangan HIV; pengguna dengan HIV mengalami cedera saraf & gangguan kognitif lebih besar.
- **Overdosis:** detak jantung & tekanan darah naik, **hipertermia**, berkeringat berlebihan, pupil melebar, banyak bicara, gemetar, mulut kering & bau, agresif, paranoia, halusinasi.

# Pengobatan penyalahgunaan amfetamin
- **CBT**, **manajemen kontingensi**, **Model Matriks** (program perilaku komprehensif **16 minggu**: terapi perilaku, edukasi keluarga, konseling individu, dukungan 12 langkah, tes narkoba, kegiatan bebas narkoba).
- Farmakologi masih riset: **AV411 (ibudilast)** dan antibodi monoklonal anti-metamfetamin **mAb7F9**.

# Poin penutup
- Peningkatan dopamin = mekanisme utama efek stimulan. Menyuntik kokain menambah risiko infeksi, kerusakan pembuluh darah, dan overdosis.
- Banyak pengguna kokain & sabu juga memakai zat lain termasuk heroin. Amfetamin, dekstroamfetamin, dan metamfetamin secara kolektif disebut **amfetamin**. Banyak pengguna metamfetamin memakai lagi saat putus zat → siklus berulang.`,
      poin: [
        "Kokain memblokir transporter (daur ulang) dopamin; metamfetamin meningkatkan pelepasan dan memblokir penyerapan kembali dopamin.",
        "Satu-satunya penggunaan medis kokain yang disetujui kini adalah anestesi lokal; Freud menyebutnya 'obat ajaib'.",
        "Kokain diisap: efek segera 5–15 menit; dihirup: 1 menit, 20–40 menit; disuntik: 1–5 detik, 15–20 menit.",
        "Tiga fase putus kokain: crash (9 jam–4 hari), withdrawal (1–10 minggu), extinction (tanpa batas).",
        "Kokain + alkohol = kokaetilena yang sangat beracun; kematian mendadak bisa terjadi pada pemakaian pertama.",
        "Metamfetamin: 50% keluar dalam 12 jam (kokain 1 jam); efek tahan lama; 'meth mouth', psikosis, serangan jantung usia muda.",
        "Model Matriks: program perilaku komprehensif 16 minggu untuk penyalahgunaan stimulan.",
      ],
      istilah: [
        ["Psikostimulan", "Zat yang meningkatkan aktivitas saraf: kewaspadaan, energi, detak jantung."],
        ["Crack", "Kokain basa bebas yang diisap; dinamai dari bunyi berderak saat dibakar."],
        ["Speedball", "Campuran kokain dan heroin."],
        ["Kokaetilena", "Senyawa sangat beracun yang terbentuk bila kokain dipakai bersama alkohol."],
        ["Transporter dopamin", "Protein yang mendaur ulang dopamin ke neuron pengirim; diblokir oleh kokain."],
        ["Anhedonia", "Ketidakmampuan merasakan kesenangan, gejala umum putus stimulan."],
        ["Model Matriks", "Program perawatan perilaku 16 minggu untuk pengguna stimulan."],
        ["Cathinone", "Zat aktif stimulan dalam daun khat."],
        ["Sensitisasi", "Efek tertentu justru makin kuat dengan pemakaian berulang (kebalikan toleransi)."],
      ],
      kuis: [
        ["Satu-satunya penggunaan medis kokain yang disetujui saat ini adalah…", ["Obat depresi", "Anestesi lokal", "Obat TBC", "Penurun berat badan"], 1, "Kini hanya sebagai anestesi lokal."],
        ["Tokoh yang pada 1880-an menyebut kokain 'obat ajaib' adalah…", ["Sigmund Freud", "Benjamin Rush", "Thomas De Quincey", "Albert Hofmann"], 0, "Sigmund Freud."],
        ["Kokain menimbulkan euforia dengan cara…", ["Meniru dopamin", "Memblokir transporter dopamin sehingga daur ulang terhambat", "Menghancurkan reseptor dopamin", "Meningkatkan produksi endorfin"], 1, "Dopamin menumpuk di sinapsis."],
        ["Rute kokain dengan onset segera dan durasi 5–15 menit adalah…", ["Dihirup", "Disuntik", "Diisap", "Ditelan"], 2, "Diisap (crack)."],
        ["Urutan tiga fase putus kokain yang benar adalah…", ["Withdrawal → crash → extinction", "Crash → withdrawal → extinction", "Extinction → crash → withdrawal", "Crash → extinction → withdrawal"], 1, "Crash, withdrawal, extinction."],
        ["Senyawa sangat beracun yang terbentuk bila kokain dipakai bersama alkohol adalah…", ["Asetaldehida", "Kokaetilena", "Metanol", "Fenetilin"], 1, "Kokaetilena."],
        ["Metamfetamin kristal pertama kali disintesis tahun 1919 di…", ["Jerman", "Amerika Serikat", "Jepang", "Inggris"], 2, "Jepang."],
        ["Perbedaan farmakologis metamfetamin dibanding kokain adalah metamfetamin…", ["Hanya memblokir reseptor", "Meningkatkan pelepasan dopamin selain memblokir penyerapan kembali", "Tidak memengaruhi dopamin", "Keluar dari tubuh dalam 1 jam"], 1, "Dan 50% baru keluar dalam 12 jam."],
        ["Program perawatan perilaku komprehensif 16 minggu untuk penyalahgunaan stimulan disebut…", ["Model Matriks", "Millati Islami", "CBT4CBT", "MPOWER"], 0, "Model Matriks."],
        ["Obat untuk alkoholisme yang menunjukkan hasil paling menjanjikan untuk kecanduan kokain adalah…", ["Naltrekson", "Disulfiram", "Metadon", "Nikotin"], 1, "Disulfiram."],
        ["Studi Volkow dkk. (2001) menunjukkan transporter dopamin pada mantan pengguna metamfetamin…", ["Tidak pernah pulih", "Pulih sebagian setelah pantang 14 bulan", "Pulih penuh dalam 1 minggu", "Justru makin rusak"], 1, "Pemulihan parsial setelah pantang panjang."],
        ["Serangan jantung akibat metamfetamin disebut sering terjadi pada usia…", ["Di bawah 15 tahun", "29–45 tahun", "Di atas 70 tahun", "Hanya lansia"], 1, "Terutama pada pasien muda 29–45 tahun."],
      ],
      tambahan: [
        { judul: "Metamfetamin di Indonesia: sabu",
          isi: "Di Indonesia, metamfetamin kristal dikenal sebagai 'sabu' dan termasuk Narkotika Golongan I menurut UU No. 35 Tahun 2009 tentang Narkotika, sehingga dilarang untuk pelayanan kesehatan. Laporan tahunan BNN menempatkan sabu di antara narkoba yang paling banyak disalahgunakan dan disita di Indonesia.",
          ref: "Undang-Undang Republik Indonesia No. 35 Tahun 2009 tentang Narkotika (Lampiran I, Golongan I); Badan Narkotika Nasional. Indonesia Drugs Report (terbitan tahunan)." },
      ],
    },
  ],
};

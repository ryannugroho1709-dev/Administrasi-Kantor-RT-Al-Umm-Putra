/* PPAB301 — Peta penyakit & penanganan Modul 1–30 */
Kuliah.pertemuan("kasus-adiktif", {
  no: 8, tema: 7, motif: "kompas", motifOpt: { lbl: "Peta Penyakit" }, durasi: 70,
  judul: { id: "Peta Penyakit & Penanganan (Modul 1–30)", en: "Map of Disorders & Treatments" },
  ringkas: { id: "Semua gangguan yang dibahas di PPAB301 Modul 1–30 dalam satu peta: **13 kelompok** (alkohol, tembakau, opioid, stimulan, halusinogen, ganja, inhalansia & steroid, obat resep, makan, judi, internet/game, seks, diagnosis ganda). Untuk setiap gangguan: **ciri kunci**, **obat/penanganan medis**, **penanganan psikologis**, dan **pendekatan psikolog Muslim**. Obat hanya diberikan oleh dokter/psikiater; peran psikolog adalah asesmen, terapi, koordinasi rujukan, dan pendampingan." },
  tujuan: [
    { id: "Memetakan seluruh gangguan adiktif berdasarkan kelompok zat dan perilaku." },
    { id: "Mengingat ciri kunci dan pilihan penanganan medis serta psikologis setiap gangguan." },
    { id: "Mengintegrasikan pendekatan Islam secara tepat dan tidak menghakimi." }
  ],
  isi: [
    { t: "pembuka", id: "Gunakan halaman ini sebagai **peta cepat** sebelum ujian: kenali kelompoknya, ingat **tanda pembeda**, lalu pilih penanganan bertingkat — **keselamatan medis → asesmen → terapi psikologis → dukungan sosial → dimensi spiritual**." },
    { t: "peta", ikon: "brain", pusat: { id: "Gangguan terkait zat & adiktif (PPAB301)" }, cabang: [
      { id: "Alkohol (M10–11)", sub: [{ id: "AUD, intoksikasi, putus & DT" }, { id: "Wernicke–Korsakoff, FASD" }] },
      { id: "Tembakau (M12–13)", sub: [{ id: "TUD, putus nikotin" }] },
      { id: "Opioid (M14)", sub: [{ id: "OUD, overdosis, putus" }] },
      { id: "Stimulan (M15–16)", sub: [{ id: "Sabu, kokain, ekstasi, kafein" }, { id: "Psikosis & crash" }] },
      { id: "Halusinogen (M17)", sub: [{ id: "LSD, PCP, ketamin, HPPD" }] },
      { id: "Ganja (M18)", sub: [{ id: "CUD, putus, psikosis, hiperemesis" }] },
      { id: "Inhalansia & steroid (M19)", sub: [{ id: "Lem/aerosol, steroid anabolik" }] },
      { id: "Obat resep & bebas (M20)", sub: [{ id: "Benzodiazepin, tramadol, kodein, DXM" }] },
      { id: "Makan & citra tubuh (M21)", sub: [{ id: "Anoreksia, bulimia, BED, food addiction" }] },
      { id: "Judi (M22)", sub: [{ id: "Gambling disorder" }] },
      { id: "Internet & game (M23)", sub: [{ id: "Gaming disorder, medsos" }] },
      { id: "Seks (M24)", sub: [{ id: "Perilaku seksual kompulsif, pornografi" }] },
      { id: "Diagnosis ganda (M25)", sub: [{ id: "SUD + depresi, cemas, PTSD, psikosis, ADHD, kepribadian" }] }
    ] },
    { t: "catatan", gaya: "tanbih", judul: { id: "Aturan emas penanganan" }, id: "(1) **Keselamatan dulu** — overdosis, putus alkohol/benzodiazepin berat, risiko bunuh diri. (2) **Jangan** menghentikan alkohol atau benzodiazepin mendadak pada pemakai berat tanpa pengawasan medis (risiko kejang). (3) Psikolog **tidak meresepkan obat**: kenali, rujuk, dan bekerja dalam tim. (4) Gunakan bahasa **tanpa stigma** dan bingkai Islam yang memberi **harapan & taubat**." },

    { t: "judul", id: "1. Alkohol (Modul 10–11)" },
    { t: "tabel", kolom: ["Gangguan", "Ciri kunci", "Medis / obat", "Psikologis & sosial"], baris: [
      ["**Alcohol Use Disorder**", "≥ 2/11 kriteria dalam 12 bulan; AUDIT ≥ 8", "Naltrexone, acamprosate, disulfiram; detoks bila perlu", "MI, CBT pencegahan kambuh, CRAFT, 12 langkah/SMART"],
      ["**Intoksikasi alkohol**", "Cadel, sempoyongan, nistagmus, gangguan perhatian; tanda CUPS = keracunan", "Pantau napas, posisi miring, IGD bila berat; cairan, tiamin", "SBI/FRAMES setelah sadar"],
      ["**Putus alkohol & delirium tremens**", "6–24 jam tremor; 24–48 kejang; 48–96 jam DT", "Benzodiazepin bertahap, tiamin sebelum glukosa, elektrolit; PAWSS/CIWA-Ar", "Orientasi realitas, dukungan keluarga, rujukan rehabilitasi"],
      ["**Wernicke–Korsakoff**", "Bingung, ataksia, oftalmoplegia → amnesia + konfabulasi", "Tiamin dosis tinggi parenteral, gizi", "Rehabilitasi kognitif, alat bantu memori"],
      ["**FASD**", "Wajah khas, hambatan tumbuh, gangguan SSP", "Tidak dapat disembuhkan; pencegahan: nol alkohol saat hamil", "Pendidikan khusus, terapi perilaku, dukungan keluarga"],
      ["**Depresi/cemas akibat alkohol**", "Muncul saat intoksikasi/putus; membaik dalam ± 1 bulan abstinen", "Abstinensi; antidepresan bila menetap", "CBT, bedakan dari gangguan primer"]
    ] },
    { t: "judul", id: "2. Tembakau (Modul 12–13)" },
    { t: "tabel", kolom: ["Gangguan", "Ciri kunci", "Medis / obat", "Psikologis & sosial"], baris: [
      ["**Tobacco Use Disorder**", "≥ 2/11 kriteria; FTND 0–10; termasuk vape/shisha", "NRT (koyo, permen karet, lozenge), varenicline, bupropion", "SBI 3A/5A, MI, CBT pemicu, quitline (0800-177-6565)"],
      ["**Putus nikotin**", "Iritabel, cemas, sulit konsentrasi, lapar, insomnia (24 jam–beberapa minggu)", "NRT kombinasi", "Manajemen stres, olahraga, HALT"]
    ] },
    { t: "judul", id: "3. Opioid (Modul 14)" },
    { t: "tabel", kolom: ["Gangguan", "Ciri kunci", "Medis / obat", "Psikologis & sosial"], baris: [
      ["**Opioid Use Disorder**", "Heroin, morfin, kodein, tramadol, fentanil; suntik → HIV/HCV", "Metadon (PTRM), buprenorfin, naltrexone", "CBT, manajemen kontingensi, LASS, dukungan keluarga"],
      ["**Overdosis/intoksikasi opioid**", "Pupil pinpoint, depresi napas, koma", "**Nalokson**, napas bantuan, IGD", "Edukasi overdosis, nalokson untuk keluarga"],
      ["**Putus opioid**", "Midriasis, menguap, rinorea, piloereksi, diare (puncak 24–72 jam); COWS", "Buprenorfin/metadon, klonidin, simptomatik", "Dukungan, cegah overdosis pasca-detoks"]
    ] },
    { t: "judul", id: "4. Psikostimulan (Modul 15–16)" },
    { t: "tabel", kolom: ["Gangguan", "Ciri kunci", "Medis / obat", "Psikologis & sosial"], baris: [
      ["**Stimulant Use Disorder** (sabu, kokain, amfetamin, ekstasi)", "Euforia, energi, tidak tidur; berat badan turun", "Belum ada obat khusus yang disetujui; obati komplikasi", "**Manajemen kontingensi**, CBT, Matrix Model, MI"],
      ["**Intoksikasi stimulan**", "Takikardia, hipertensi, hipertermia, midriasis, nyeri dada", "Benzodiazepin, pendinginan, EKG; IGD", "Setelah stabil: SBI"],
      ["**Psikosis akibat stimulan**", "Waham kejar, halusinasi, formikasi", "Antipsikotik jangka pendek, benzodiazepin", "Lingkungan aman; bedakan dari skizofrenia"],
      ["**Putus stimulan (crash)**", "Disforia, hipersomnia, lapar, craving, ide bunuh diri", "Simptomatik; pantau risiko bunuh diri", "Aktivitas hadiah alami, tidur, CBT"],
      ["**MDMA (ekstasi)**", "Empati semu, dehidrasi/hiponatremia, hipertermia", "Penanganan suhu & cairan", "Edukasi; depresi pasca-pemakaian"],
      ["**Intoksikasi kafein**", "Gelisah, insomnia, berdebar setelah > 250 mg", "Hentikan, cairan", "Edukasi minuman energi"]
    ] },
    { t: "judul", id: "5–8. Halusinogen, ganja, inhalansia, obat resep (Modul 17–20)" },
    { t: "tabel", kolom: ["Gangguan", "Ciri kunci", "Medis / obat", "Psikologis & sosial"], baris: [
      ["**Halusinogen** (LSD, psilosibin)", "Distorsi persepsi, *bad trip*; **HPPD** (*flashback*)", "Lingkungan tenang, benzodiazepin bila cemas berat", "*Talking down*, psikoedukasi"],
      ["**Disosiatif** (PCP, ketamin)", "Disosiasi, agresi, nistagmus, kebal nyeri; ketamin → sistitis", "Benzodiazepin, keamanan", "Asesmen risiko kekerasan, rehabilitasi"],
      ["**Cannabis Use Disorder**", "Craving, toleransi; risiko psikosis pada remaja", "Belum ada obat spesifik", "CBT, MI, manajemen kontingensi (MET/CBT)"],
      ["**Putus ganja**", "Iritabel, cemas, insomnia, mimpi aneh, nafsu makan turun", "Simptomatik", "Higiene tidur, koping"],
      ["**Sindrom hiperemesis kanabinoid**", "Muntah berulang, lega dengan mandi air panas", "Hentikan ganja; antiemetik", "Edukasi"],
      ["**Inhalansia** (lem, tiner, aerosol)", "Usia muda, murah; *sudden sniffing death*, kerusakan otak & saraf", "Penanganan aritmia, keracunan", "Intervensi keluarga & sekolah, anak jalanan"],
      ["**Steroid anabolik**", "Agresi (*roid rage*), dismorfia otot, depresi saat berhenti", "Evaluasi hormon & jantung", "Terapi citra tubuh, CBT"],
      ["**Sedatif/hipnotik/ansiolitik** (benzodiazepin)", "Toleransi; putus → cemas, insomnia, **kejang**", "**Tapering** bertahap di bawah dokter", "CBT-I untuk insomnia, terapi cemas"],
      ["**Penyalahgunaan obat resep/bebas** (tramadol, kodein, DXM, metilfenidat)", "Mulai dari resep/obat bebas → dosis naik", "Penghentian bertahap; terapi OUD bila opioid", "Edukasi, pengawasan resep"]
    ] },
    { t: "judul", id: "9–12. Adiksi perilaku (Modul 21–24)" },
    { t: "tabel", kolom: ["Gangguan", "Ciri kunci", "Medis / obat", "Psikologis & sosial"], baris: [
      ["**Anoreksia nervosa**", "Pembatasan makan, BMI rendah, takut gemuk", "Pemulihan gizi medis (waspada *refeeding syndrome*)", "FBT (terapi berbasis keluarga), CBT-E"],
      ["**Bulimia nervosa**", "Binge + kompensasi (muntah, pencahar) ≥ 1×/minggu, 3 bulan", "Fluoksetin; koreksi elektrolit", "CBT-E"],
      ["**Binge eating disorder & food addiction**", "Makan banyak cepat, hilang kendali, malu", "Lisdeksamfetamin (BED, dokter)", "CBT, makan sadar (*mindful eating*)"],
      ["**Gambling disorder**", "≥ 4/9; chasing losses, berbohong, utang", "Naltrexone (off-label) untuk craving", "CBT, Gamblers Anonymous, kontrol keuangan, self-exclusion"],
      ["**Gaming disorder / internet**", "ICD-11 6C51; kontrol hilang, prioritas game, berlanjut meski rugi", "Obati komorbid (ADHD, depresi)", "CBT, terapi keluarga, batas digital"],
      ["**Perilaku seksual kompulsif / pornografi**", "ICD-11 6C72; gagal mengendalikan dorongan, rugi bermakna", "SSRI/naltrexone untuk komorbid (dokter)", "CBT, terapi pasangan, kelompok pemulihan"],
      ["**Belanja, olahraga, tanning**", "Kompulsif, merugikan keuangan/tubuh", "—", "CBT, konseling finansial"]
    ] },
    { t: "judul", id: "13. Diagnosis ganda (Modul 25)" },
    { t: "tabel", kolom: ["Kombinasi", "Pola", "Prinsip penanganan"], baris: [
      ["SUD + depresi/cemas", "Self-medication; atau gangguan akibat zat", "**Penanganan terintegrasi** (keduanya bersamaan), bedakan primer vs induksi zat"],
      ["SUD + PTSD", "Zat untuk menumpulkan trauma", "Terapi berfokus trauma + SUD (mis. *Seeking Safety*)"],
      ["SUD + skizofrenia/bipolar", "Merokok & ganja tinggi; kepatuhan obat rendah", "Antipsikotik + rehabilitasi; perhatikan interaksi"],
      ["SUD + ADHD", "Impulsif, mulai dini", "Terapi ADHD (hati-hati stimulan), CBT"],
      ["SUD + gangguan kepribadian", "Antisosial, ambang", "DBT, batas terapeutik jelas"]
    ] },
    { t: "judul", id: "Kotak alat penanganan (Modul 26–28)" },
    { t: "poin", item: [
      { ikon: "users", judul: { id: "Bantuan mandiri & keluarga (M26)" }, id: "AA/NA/GA, 12 langkah (termasuk versi Islami), SMART Recovery, Al-Anon, CRAFT." },
      { ikon: "target", judul: { id: "Strategi intervensi (M27)" }, id: "SBI/FRAMES, MI, CBT pencegahan kambuh (Marlatt), manajemen kontingensi, terapi keluarga, *therapeutic community*." },
      { ikon: "shield", judul: { id: "Pengurangan dampak buruk (M28)" }, id: "Nalokson, LASS/alat suntik steril, terapi rumatan metadon/buprenorfin, edukasi minum aman — dalam bingkai kaidah memilih mudarat yang lebih ringan." },
      { ikon: "moonStar", judul: { id: "Perspektif Islam (M29–30)" }, id: "Taubat, tazkiyatun nafs (7 tingkatan), doa & dzikir, shalat berjamaah, dukungan masjid/ummah, maqāṣid syariah." }
    ] },
    { t: "catatan", gaya: "hikmah", judul: { id: "Untuk psikolog Muslim" }, id: "Gabungkan bukti ilmiah dan nilai Islam: **Allah tidak menurunkan penyakit kecuali menurunkan pula obatnya** (HR. al-Bukhari no. 5678). Berobat adalah bagian dari ikhtiar, sementara doa, dzikir, dan komunitas adalah sumber kekuatan. Hindari memberi **fatwa** di ruang konseling; rujuk ulama bila perlu, dan selalu jaga martabat klien." },
    { t: "ringkasan", item: [{ id: "13 kelompok gangguan; keselamatan medis selalu nomor satu." }, { id: "Alkohol: naltrexone, acamprosate, disulfiram, benzodiazepin + tiamin untuk detoks." }, { id: "Nikotin: NRT, varenicline, bupropion; opioid: metadon, buprenorfin, nalokson." }, { id: "Stimulan & adiksi perilaku: terapi perilaku (CM, CBT) sebagai andalan." }, { id: "Diagnosis ganda: penanganan terintegrasi; Islam: ikhtiar berobat + taubat + ummah." }] }
  ],
  istilah: [
    { t: "HPPD", id: "Hallucinogen Persisting Perception Disorder (flashback)." },
    { t: "Cannabinoid hyperemesis", id: "Muntah berulang pada pemakai ganja kronis." },
    { t: "Sudden sniffing death", id: "Henti jantung mendadak akibat inhalansia." },
    { t: "Tapering", id: "Penurunan dosis bertahap." },
    { t: "Refeeding syndrome", id: "Gangguan elektrolit berbahaya saat pemulihan gizi." },
    { t: "Diagnosis ganda", id: "SUD bersamaan dengan gangguan jiwa lain." },
    { t: "Penanganan terintegrasi", id: "Mengobati adiksi & gangguan jiwa bersamaan oleh satu tim." }
  ],
  latihan: {
    pg: [
      { q: { id: "Gangguan berikut yang penghentiannya mendadak paling berisiko kejang adalah…" }, o: [{ id: "Ganja" }, { id: "Benzodiazepin dan alkohol" }, { id: "Kafein" }, { id: "Nikotin" }], j: 1 },
      { q: { id: "Pemakai ganja kronis datang dengan muntah berulang yang membaik saat mandi air panas. Kemungkinan…" }, o: [{ id: "Keracunan alkohol" }, { id: "Sindrom hiperemesis kanabinoid" }, { id: "Putus opioid" }, { id: "Gastritis biasa" }], j: 1 },
      { q: { id: "Intervensi dengan bukti terkuat untuk adiksi stimulan…" }, o: [{ id: "Metadon" }, { id: "Manajemen kontingensi" }, { id: "Disulfiram" }, { id: "Nalokson" }], j: 1 },
      { q: { id: "Anak jalanan yang menghirup lem berisiko kematian mendadak karena…" }, o: [{ id: "Sudden sniffing death (aritmia)" }, { id: "Delirium tremens" }, { id: "Wernicke" }, { id: "Hipoglikemia saja" }], j: 0 },
      { q: { id: "Prinsip penanganan diagnosis ganda yang dianjurkan adalah…" }, o: [{ id: "Obati adiksi dulu bertahun-tahun, baru gangguan jiwa" }, { id: "Penanganan terintegrasi untuk keduanya" }, { id: "Abaikan gangguan jiwa" }, { id: "Hanya obat" }], j: 1 },
      { q: { id: "Kode ICD-11 untuk perilaku seksual kompulsif adalah…" }, o: [{ id: "6C51" }, { id: "6C72" }, { id: "F10.20" }, { id: "F17.210" }], j: 1 },
      { q: { id: "Obat yang menyelamatkan pada overdosis opioid adalah…" }, o: [{ id: "Naltrexone tablet" }, { id: "Nalokson" }, { id: "Bupropion" }, { id: "Acamprosate" }], j: 1 },
      { q: { id: "Pemulihan gizi pada anoreksia berat harus diawasi karena risiko…" }, o: [{ id: "Refeeding syndrome" }, { id: "Delirium tremens" }, { id: "Toleransi" }, { id: "Hiperemesis" }], j: 0 }
    ],
    bs: [
      { t: { id: "Psikolog boleh meresepkan naltrexone." }, j: false },
      { t: { id: "Hingga kini belum ada obat yang disetujui khusus untuk adiksi stimulan." }, j: true },
      { t: { id: "HPPD adalah gangguan persepsi menetap setelah memakai halusinogen." }, j: true },
      { t: { id: "Benzodiazepin dapat dihentikan mendadak tanpa risiko." }, j: false }
    ],
    pilah: { t: { id: "Pilah obat ke gangguan utamanya" }, kategori: [{ id: "Alkohol" }, { id: "Tembakau" }, { id: "Opioid" }], item: [{ t: { id: "Acamprosate" }, k: 0 }, { t: { id: "Varenicline" }, k: 1 }, { t: { id: "Metadon" }, k: 2 }, { t: { id: "Disulfiram" }, k: 0 }, { t: { id: "NRT" }, k: 1 }, { t: { id: "Buprenorfin" }, k: 2 }, { t: { id: "Tiamin" }, k: 0 }, { t: { id: "Nalokson" }, k: 2 }] }
  },
  tugas: [
    { t: { id: "Buat tabel perbandingan penanganan medis dan psikologis untuk gangguan alkohol, tembakau, opioid, dan stimulan, lalu jelaskan peran psikolog Muslim." }, j: { id: "Alkohol: detoks benzodiazepin + tiamin, lalu naltrexone/acamprosate/disulfiram; psikologis MI, CBT pencegahan kambuh, CRAFT, 12 langkah. Tembakau: NRT, varenicline, bupropion; psikologis SBI 3A/5A, MI, CBT pemicu, quitline. Opioid: nalokson untuk overdosis, metadon/buprenorfin untuk rumatan, naltrexone untuk pencegahan kambuh; psikologis CBT, manajemen kontingensi, harm reduction (LASS). Stimulan: belum ada obat khusus, tangani komplikasi; psikologis manajemen kontingensi, CBT, Matrix Model, MI, skrining bunuh diri saat crash. Peran psikolog Muslim: asesmen dan diagnosis banding, terapi berbasis bukti, koordinasi rujukan medis (tidak meresepkan), pendampingan keluarga, serta integrasi nilai Islam—ikhtiar berobat (setiap penyakit ada obatnya), taubat tanpa stigma, tazkiyatun nafs, dzikir, dan dukungan ummah—tanpa memberi fatwa di ruang konseling." } }
  ]
});

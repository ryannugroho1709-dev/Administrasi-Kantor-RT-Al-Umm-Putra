/* PPTA301 — Peta gangguan, alat ukur & penanganan (Modul 1–30) */
Kuliah.pertemuan("peta-tes", {
  no: 1, tema: 7, motif: "kompas", motifOpt: { lbl: "Peta Gangguan" }, durasi: 70,
  judul: { id: "Peta Gangguan, Alat Ukur & Penanganan (Modul 1–30)", en: "Map of Disorders, Measures & Treatments" },
  ringkas: { id: "Semua gangguan yang dibahas di PPTA301 dalam satu peta, dikelompokkan seperti **DSM-5**: neurodevelopmental, depresi & bipolar, kecemasan-OCD-trauma, skizofrenia, neurokognitif & cedera otak, kepribadian, makan, serta zat & adiksi. Untuk setiap gangguan: **ciri kunci**, **alat ukur yang dipakai** (fokus mata kuliah ini), **obat/penanganan medis**, **penanganan psikologis**, dan **pendekatan psikolog Muslim**." },
  tujuan: [
    { id: "Memetakan gangguan yang dibahas di Modul 1–30 berdasarkan kelompok DSM-5." },
    { id: "Mengaitkan setiap gangguan dengan alat asesmen yang tepat." },
    { id: "Mengingat pilihan penanganan medis, psikologis, dan Islami." }
  ],
  isi: [
    { t: "pembuka", id: "Di mata kuliah asesmen, pertanyaan ujian hampir selalu berbentuk: **\"gangguan apa?\"**, **\"diukur dengan apa?\"**, dan **\"lalu apa rekomendasinya?\"**. Peta ini menjawab ketiganya sekaligus. Ingat: psikolog **tidak meresepkan obat**, tetapi harus tahu pilihannya agar bisa merujuk dan bekerja dalam tim." },
    { t: "peta", ikon: "brain", pusat: { id: "Gangguan dalam PPTA301" }, cabang: [
      { id: "Neurodevelopmental", sub: [{ id: "Disabilitas intelektual, SLD, ADHD, ASD, berbakat (M17, M22–24)" }] },
      { id: "Depresi & bipolar", sub: [{ id: "MDD, depresi remaja, bipolar (M12, M19, M27)" }] },
      { id: "Kecemasan, OCD, trauma", sub: [{ id: "GAD, panik, fobia, OCD, PTSD, stres akut (M12, M19)" }] },
      { id: "Skizofrenia & psikotik", sub: [{ id: "Skizofrenia, skizoafektif (M20)" }] },
      { id: "Neurokognitif & otak", sub: [{ id: "Alzheimer, delirium, cedera otak, stroke, amnesia, afasia, neglect (M18, M21)" }] },
      { id: "Kepribadian & profil MMPI", sub: [{ id: "Hipokondriasis, paranoia, psikastenia, hipomania (M15)" }] },
      { id: "Makan", sub: [{ id: "Anoreksia, bulimia, BED, ARFID (M12)" }] },
      { id: "Zat & adiksi", sub: [{ id: "Use disorder, judi (M12)" }] }
    ] },
    { t: "catatan", gaya: "tanbih", judul: { id: "Prinsip asesmen sebelum menangani" }, id: "(1) **Beberapa metode**: wawancara + observasi + tes + data pihak lain. (2) **Diagnosis banding** — singkirkan penyebab medis, zat, dan budaya. (3) Laporkan skor dengan **rentang kesalahan (SEM)**. (4) Perhatikan **bias budaya** dan nilai religius klien Muslim (mis. zuhud bukan depresi, keyakinan pada jin bukan otomatis waham)." },

    { t: "judul", id: "1. Gangguan neurodevelopmental" },
    { t: "tabel", kolom: ["Gangguan", "Ciri & alat ukur", "Medis / obat", "Psikologis & Islami"], baris: [
      ["**Disabilitas intelektual** (M17, M22)", "IQ ± 2 SD di bawah rata-rata (≈ < 70) **dan** hambatan adaptif, sebelum 18 th. WISC/WAIS, skala perilaku adaptif (Vineland); ringan 50–70, sedang 35–50, berat 20–35, sangat berat < 20", "Obati penyebab/komorbid (epilepsi, gizi); tidak ada obat kecerdasan", "Pendidikan khusus, latihan keterampilan hidup, dukungan keluarga (AAIDD: fokus pada dukungan). Islam: setiap jiwa dibebani sesuai kemampuannya (QS 2:286)"],
      ["**Gangguan belajar spesifik (SLD)** (M17, M22)", "Prestasi jauh di bawah harapan meski IQ rata-rata; **profil ACID** WISC (Aritmetika, Coding, Informasi, Digit Span); 80% gangguan membaca", "—", "Pendekatan pemecahan masalah & protokol standar di sekolah, remedial membaca/berhitung, akomodasi ujian"],
      ["**ADHD** (M22, M23)", "≥ 6 dari 9 gejala (≥ 5 pada usia ≥ 17) selama ≥ 6 bulan, onset sebelum 12 th, ≥ 2 setting. Alat: Conners, ASRS, Barkley, Brown, wawancara, observasi kelas", "Stimulan (metilfenidat), atomoksetin; 60–70% dewasa membaik", "Edukasi, *coaching*, CBT, pelatihan orang tua; struktur waktu shalat sebagai jangkar"],
      ["**Gangguan spektrum autisme** (M22, M24)", "Defisit komunikasi sosial + perilaku/minat repetitif; tingkat dukungan 1–3. **ADI-R** (wawancara orang tua) + **ADOS** (observasi); K-ABC, Bayley (< 4 th), NEPSY", "Tidak ada obat inti; obat untuk agitasi/komorbid", "Intervensi perilaku dini (ABA), terapi wicara & okupasi, pelatihan orang tua; keluarga sebagai mitra"],
      ["**Anak berbakat** (M17)", "VIQ/PIQ > 130; WISC menekankan kecepatan — lengkapi dengan karya & prestasi", "—", "Pengayaan, akselerasi, perhatikan motivasi & kreativitas"]
    ] },
    { t: "judul", id: "2. Depresi & bipolar" },
    { t: "tabel", kolom: ["Gangguan", "Ciri & alat ukur", "Medis / obat", "Psikologis & Islami"], baris: [
      ["**Major Depressive Disorder** (M19, M27)", "≥ 5 dari 9 gejala, hampir tiap hari, ≥ 2 minggu. **BDI-II** (0–13 minimal, 14–19 ringan, 20–28 sedang, 29–63 berat; cut-off 18), **PHQ-9**, **HAM-D**, PRIME-MD 2 pertanyaan (sensitivitas 94%)", "SSRI (fluoksetin, sertralin); rawat inap bila risiko bunuh diri tinggi", "**CBT** (salah satu paling efektif), aktivasi perilaku; khauf & ḥuzn, dzikir menenangkan hati (QS 13:28)"],
      ["**Depresi pada remaja perempuan** (M24)", "Depresi mayor 41,9%, cemas 30%; kurang terlaporkan", "Sesuai indikasi dokter", "Konseling remaja, harga diri, welas diri, kesejahteraan Ryff"],
      ["**Bipolar** (M12)", "Episode mania/hipomania + depresi; MMPI skala Ma; riwayat penting untuk diagnosis banding MDD", "Penstabil mood (litium, valproat), antipsikotik", "Psikoedukasi, ritme sosial, deteksi dini kambuh"],
      ["**Duka (bereavement)** (M12, M27)", "Kesedihan setelah kehilangan; bisa memicu MDD pada yang rentan", "Biasanya tanpa obat", "Konseling duka; sabar & doa *innā lillāh*"]
    ] },
    { t: "judul", id: "3. Kecemasan, OCD & trauma" },
    { t: "tabel", kolom: ["Gangguan", "Ciri & alat ukur", "Medis / obat", "Psikologis & Islami"], baris: [
      ["**Gangguan kecemasan (GAD, panik, fobia)** (M12, M19)", "Cemas berlebihan & tidak proporsional. **STAI** (state vs trait, 20 butir), wawancara; serangan panik", "SSRI/SNRI; benzodiazepin jangka pendek saja", "CBT, paparan bertahap, relaksasi; ubah cemas menjadi doa, sujud (HR. Muslim 482)"],
      ["**OCD** (M12, M15)", "Obsesi + kompulsi; kini bab tersendiri di DSM-5; MMPI skala Pt (psikastenia)", "SSRI dosis tinggi", "ERP (Exposure & Response Prevention); bedakan was-was ibadah"],
      ["**PTSD & gangguan stres akut** (M12)", "Intrusi, menghindar, mood negatif, arousal; stres akut < 1 bulan", "SSRI, prazosin (mimpi buruk)", "Trauma-focused CBT, EMDR; dukungan komunitas"],
      ["**Hipokondriasis / gejala somatik** (M15)", "Keluhan tubuh samar meski tes medis normal; MMPI skala Hs", "Hindari pemeriksaan berlebihan", "CBT, jadwal kontrol teratur"]
    ] },
    { t: "judul", id: "4. Skizofrenia & psikotik (M20)" },
    { t: "tabel", kolom: ["Gangguan", "Ciri & alat ukur", "Medis / obat", "Psikologis & Islami"], baris: [
      ["**Skizofrenia**", "≥ 2 dari 5 gejala dalam 1 bulan + hendaya; gejala positif, negatif, neurokognitif. **SADS**, **MSE**, **MMPI skala 8 (Sc)**, **PANSS**", "Antipsikotik generasi baru (risperidon); 1–2 minggu mulai bekerja, uji 6–12 minggu; kepatuhan kunci", "Psikoedukasi keluarga, rehabilitasi; bedakan dari atribusi jin — konseling berbasis iman + psikiatri"],
      ["**Skizoafektif**", "Gejala skizofrenia + episode mood mayor", "Antipsikotik + penstabil mood/antidepresan", "Sama seperti di atas"],
      ["**Paranoia** (M15)", "Curiga, sensitif; MMPI skala Pa", "Sesuai diagnosis", "Bangun rapport perlahan, hindari konfrontasi"]
    ] },
    { t: "judul", id: "5. Neurokognitif & cedera otak (M18, M21)" },
    { t: "tabel", kolom: ["Gangguan", "Ciri & alat ukur", "Medis / obat", "Psikologis & Islami"], baris: [
      ["**Penyakit Alzheimer / demensia**", "Memori jangka pendek, apatis, orientasi kacau; memori verbal terganggu, wajah relatif utuh. **WMS**, WAIS (tes performa/fluid lebih terdampak), MMSE/MoCA", "Penghambat kolinesterase (donepezil), memantin", "Rehabilitasi kognitif, alat bantu memori, dukungan pengasuh; *insān–nisyān*"],
      ["**Delirium** (M12)", "Gangguan kesadaran & perhatian akut, berfluktuasi", "Cari & obati penyebab medis", "Orientasi realitas, lingkungan tenang"],
      ["**Cedera otak traumatis (TBI)**", "Penetratif (fokal, kejang) vs tertutup (sakit kepala, mual, sulit konsentrasi). Indikator: skor lebih rendah dari harapan SES/pendidikan", "Bedah saraf, antikejang", "Asesmen neuropsikologis 1–2 jam → rehabilitasi; anak: pantau di sekolah"],
      ["**Stroke** (infark, iskemia, hemoragi, aneurisma)", "Defisit fokal mendadak", "Penanganan medis darurat", "Rehabilitasi kognitif & motorik"],
      ["**Amnesia, afasia, dispraksia, prosopagnosia, hemiparesis, neglect**", "Kondisi setelah lesi terlokalisasi; Clock Drawing, Trail Making, Digit Span", "Sesuai penyebab", "Strategi kompensasi, terapi wicara/okupasi"],
      ["**Malingering memori** (M21)", "Rekognisi ya/tidak ± 50% (menebak); rekognisi tidak lebih baik dari recall", "—", "Konfrontasi lembut, telusuri motif"]
    ] },
    { t: "judul", id: "6. Makan, zat & adiksi (M12)" },
    { t: "tabel", kolom: ["Gangguan", "Ciri & alat ukur", "Medis / obat", "Psikologis & Islami"], baris: [
      ["**Anoreksia nervosa**", "Keparahan dengan **BMI**", "Pemulihan gizi (awas refeeding)", "Terapi berbasis keluarga, CBT-E"],
      ["**Bulimia nervosa**", "Binge + purging", "Fluoksetin", "CBT-E"],
      ["**Binge eating disorder**", "≥ 1×/minggu selama 3 bulan + ≥ 3 dari 5 ciri", "Lisdeksamfetamin (dokter)", "CBT, makan sadar"],
      ["**ARFID**", "Menghindari/membatasi makanan bukan karena citra tubuh", "Gizi", "Paparan bertahap makanan"],
      ["**Substance use disorder**", "≥ 2/11 kriteria; abuse + dependence disatukan; AUDIT, FTND", "Sesuai zat (lihat peta PPAB301)", "MI, CBT, dukungan sosial"],
      ["**Gambling disorder**", "≥ 4/9 kriteria", "—", "CBT, kelompok, kontrol keuangan"]
    ] },
    { t: "catatan", gaya: "hikmah", judul: { id: "Untuk psikolog Muslim" }, id: "Gunakan **SOMPA**/pendekatan pluralistik dan pahami bahwa tes Barat dapat **salah menafsirkan** nilai religius (MMPI-D naik karena mengingat mati; Sc naik karena iman pada yang gaib). Kombinasikan bukti ilmiah dengan **'aql, rūḥ, qalb, jism** (model psikoterapi Islam). *Setiap penyakit ada obatnya* (HR. Muslim no. 2204) — berobat adalah ikhtiar." },
    { t: "ringkasan", item: [{ id: "8 kelompok gangguan mengikuti DSM-5." }, { id: "Selalu pasangkan gangguan dengan alat ukurnya: BDI/PHQ-9/HAM-D, STAI, PANSS/SADS, WMS, WISC/WAIS, ADI-R/ADOS, Conners/ASRS." }, { id: "Obat oleh dokter; psikolog: asesmen, terapi, rujukan, laporan." }, { id: "Perhatikan budaya & religiusitas agar tidak salah diagnosis." }] }
  ],
  istilah: [
    { t: "Profil ACID", id: "Pola skor rendah WISC pada gangguan belajar." },
    { t: "Tingkat dukungan ASD", id: "Level 1–3 keparahan autisme DSM-5." },
    { t: "Refeeding syndrome", id: "Gangguan elektrolit saat pemulihan gizi cepat." },
    { t: "ERP", id: "Exposure & Response Prevention untuk OCD." },
    { t: "Penghambat kolinesterase", id: "Obat demensia Alzheimer (mis. donepezil)." }
  ],
  latihan: {
    pg: [
      { q: { id: "Alat yang paling tepat untuk mengukur keparahan gejala positif dan negatif skizofrenia…" }, o: [{ id: "STAI" }, { id: "PANSS" }, { id: "BDI-II" }, { id: "ADOS" }], j: 1 },
      { q: { id: "Anak 4 tahun dicurigai autis. Kombinasi alat yang dianjurkan…" }, o: [{ id: "MMPI + TAT" }, { id: "ADI-R (orang tua) + ADOS (observasi)" }, { id: "WAIS + BDI" }, { id: "STAI + PHQ-9" }], j: 1 },
      { q: { id: "Pada Alzheimer, subtes yang paling terdampak adalah…" }, o: [{ id: "Informasi & Kosakata (crystallized)" }, { id: "Digit Symbol & Block Design (fluid)" }, { id: "Semua sama" }, { id: "Tidak ada yang terdampak" }], j: 1 },
      { q: { id: "Skor BDI-II 24 menunjukkan depresi…" }, o: [{ id: "Minimal" }, { id: "Ringan" }, { id: "Sedang" }, { id: "Berat" }], j: 2 },
      { q: { id: "Terapi psikologis pilihan untuk OCD adalah…" }, o: [{ id: "Psikoanalisis" }, { id: "Exposure & Response Prevention" }, { id: "Hipnosis" }, { id: "Terapi seni" }], j: 1 },
      { q: { id: "Indikator utama kerusakan otak pada tes kecerdasan adalah…" }, o: [{ id: "IQ di atas 130" }, { id: "Skor lebih rendah dari yang diharapkan berdasarkan pendidikan & SES" }, { id: "Skor verbal tinggi" }, { id: "Skor MMPI L tinggi" }], j: 1 },
      { q: { id: "Klien santri mendapat skor D (depresi) tinggi di MMPI karena sering mengingat mati. Sikap yang tepat…" }, o: [{ id: "Langsung diagnosis MDD" }, { id: "Konfirmasi dengan wawancara & pahami konteks religius" }, { id: "Abaikan seluruh tes" }, { id: "Rujuk ke ruqyah saja" }], j: 1 },
      { q: { id: "Obat yang biasa dipakai untuk demensia Alzheimer…" }, o: [{ id: "Donepezil" }, { id: "Metilfenidat" }, { id: "Risperidon" }, { id: "Fluoksetin" }], j: 0 }
    ],
    bs: [
      { t: { id: "Psikolog boleh meresepkan antipsikotik." }, j: false },
      { t: { id: "Disabilitas intelektual mensyaratkan hambatan perilaku adaptif, bukan hanya IQ rendah." }, j: true },
      { t: { id: "OCD masih termasuk bab gangguan kecemasan dalam DSM-5." }, j: false },
      { t: { id: "PRIME-MD dua pertanyaan sangat sensitif tetapi kurang spesifik." }, j: true }
    ],
    jodoh: [
      { a: { id: "Depresi" }, b: { id: "BDI-II / PHQ-9 / HAM-D" } },
      { a: { id: "Kecemasan" }, b: { id: "STAI" } },
      { a: { id: "Skizofrenia" }, b: { id: "PANSS / SADS" } },
      { a: { id: "Memori & Alzheimer" }, b: { id: "WMS / MoCA" } },
      { a: { id: "ADHD dewasa" }, b: { id: "ASRS / Conners" } },
      { a: { id: "Autisme" }, b: { id: "ADI-R / ADOS" } }
    ]
  },
  tugas: [
    { t: { id: "Pilih tiga gangguan dari kelompok berbeda. Untuk masing-masing, tuliskan ciri kunci, alat ukur, penanganan medis, penanganan psikologis, dan pertimbangan budaya/Islam." }, j: { id: "Contoh jawaban: (1) MDD — ≥ 5/9 gejala ≥ 2 minggu; BDI-II, PHQ-9, HAM-D, PRIME-MD; SSRI oleh dokter; CBT dan aktivasi perilaku; bedakan duka dan zuhud religius, gunakan dzikir dan doa sebagai sumber koping. (2) Skizofrenia — ≥ 2/5 gejala dalam sebulan plus hendaya; SADS, MSE, MMPI Sc, PANSS; antipsikotik generasi baru dengan uji 6–12 minggu; psikoedukasi keluarga dan rehabilitasi; atribusi jin dihormati tetapi diarahkan pada konseling berbasis iman bersama psikiatri. (3) ASD — defisit komunikasi sosial dan perilaku repetitif; ADI-R dan ADOS, tes minim bahasa seperti K-ABC; tidak ada obat inti, obat hanya untuk komorbid; intervensi perilaku dini, terapi wicara, pelatihan orang tua; keluarga sebagai mitra dan anak dimuliakan sebagaimana Nabi ﷺ menyayangi anak-anak." } }
  ]
});

/* PPTA 301 — Modul 23: Mendiagnosis ADD/ADHD pada Anak & Dewasa */
Kuliah.pertemuan("tes-psikologi", {
  no: 23, tema: 1, motif: "kilat", motifOpt: { lbl: "ADHD" }, durasi: 60,
  judul: { id: "Mendiagnosis ADD/ADHD pada Anak & Dewasa", en: "Diagnosing ADD/ADHD in Children & Adults" },
  ringkas: { id: "ADHD: kurang perhatian, hiperaktivitas/impulsivitas, atau keduanya, yang **signifikan mengganggu** fungsi. Kriteria A: **≥ 6 dari 9** gejala salah satu domain, **≥ 6 bulan**, maladaptif & tak sesuai perkembangan; D: gangguan fungsi jelas; E: tak lebih baik dijelaskan gangguan lain. DSM-IV: 3 subtipe (inatentif 10–15%, hiperaktif 3%, **gabungan 85%**). DSM-5: tingkat **keparahan**, *presentasi* menggantikan subtipe, gejala muncul **sebelum usia 12**, gejala lebih sedikit untuk dewasa. Hiperaktivitas dewasa menjadi **gelisah batin**. **7 langkah evaluasi**; banyak komorbid. Biologi: frontal, prefrontal dorsal, serebelum, striatum; **dopamin** (perhatian) & **norepinefrin** (hiperaktivitas); genetik kuat. Terapi: edukasi → stimulan (**60–70%** dewasa membaik) → **coaching** & CBT. Islam: keseimbangan, doa dari malas & lalai, teladan Nabi ﷺ mengelola banyak peran." },
  tujuan: [
    { id: "Menjelaskan gejala dan kriteria diagnosis ADHD (DSM-IV & DSM-5) pada anak dan dewasa." },
    { id: "Menguraikan tujuh langkah evaluasi dan gangguan komorbid ADHD." },
    { id: "Menjelaskan dasar biologis serta pengobatan farmakologis dan psikologis ADHD." }
  ],
  isi: [
    { t: "pembuka", id: "Dulu orang mengira ADHD **hilang** saat anak dewasa. Ternyata yang hilang hanya **tampilan luarnya**: anak yang dulu memanjat meja kini menjadi orang dewasa yang **gelisah batin**, berganti pekerjaan, dan menghindari rapat panjang." },
    { t: "definisi", judul: { id: "ADHD" }, lughah: { id: "Attention Deficit Hyperactivity Disorder." }, istilah: { id: "Sindrom di mana gejala **kurang perhatian**, **hiperaktivitas/impulsivitas**, atau keduanya, **secara signifikan mengganggu** fungsi sehari-hari (pekerjaan, keluarga, dll.)." } },
    { t: "tabel", judul: { id: "Gejala seumur hidup" }, kolom: ["Domain", "Wujud"], baris: [
      ["**Kurang perhatian**", "Mudah teralihkan, kacau, pelupa, sering terlambat, sulit memutuskan & merencanakan, **tak punya rasa waktu**, suka menunda; tak memakai jam/agenda"],
      ["**Hiperaktif**", "(Batin) gelisah, tegang, banyak bicara, sibuk; diatasi dengan olahraga berlebihan, alkohol, menghindari pertemuan"],
      ["**Impulsif**", "Bertindak sebelum berpikir, tak sabar, sulit menunggu giliran, gonta-ganti pekerjaan, makan berlebihan, mencari sensasi"],
      ["**Tambahan (90% dewasa)**", "Mood berubah hingga **5× sehari** & ledakan amarah"]
    ] },
    { t: "judul", id: "Kriteria diagnosis" },
    { t: "banding", kiri: { judul: { id: "9 gejala kurang perhatian" }, warna: "blue", poin: [{ id: "Gagal memperhatikan detail; gagal mempertahankan perhatian" }, { id: "Tampak tak mendengarkan; tak menyelesaikan pekerjaan" }, { id: "Buruk merencanakan & mengorganisasi" }, { id: "Sering kehilangan barang; mudah teralihkan; pelupa" }, { id: "Menghindari upaya mental berkelanjutan" }] }, kanan: { judul: { id: "9 gejala hiperaktif/impulsif" }, warna: "amber", poin: [{ id: "Tak bisa duduk tenang; harus berdiri & bergerak" }, { id: "Gelisah subjektif; sulit bersantai tenang" }, { id: "\"Selalu bergerak\"; bicara berlebihan" }, { id: "Bicara tanpa berpikir/menyerobot" }, { id: "Sulit menunggu giliran; menyela orang lain" }] } },
    { t: "catatan", gaya: "faidah", judul: { id: "Kriteria A, D, E" }, id: "**A**: ≥ **6 dari 9** gejala kurang perhatian **atau** hiperaktif-impulsif (atau keduanya), **≥ 6 bulan**, maladaptif & **tak sesuai tingkat perkembangan**. **D**: bukti jelas gangguan fungsi sosial, akademik, atau pekerjaan. **E**: tidak lebih baik dijelaskan gangguan lain (mood, kecemasan, zat, kepribadian)." },
    { t: "anim", jenis: "profil", judul: { id: "Subtipe ADHD menurut DSM-IV (perkiraan proporsi, %)" }, mode: "batang", min: 0, max: 100, skala: [{ k: "Gabungan", v: 85 }, { k: "Inatentif", v: 13, n: "10–15% (ADD)" }, { k: "Hiperaktif", v: 3 }], ket: { id: "DSM-IV: 18 kriteria (9 A + 9 HI), didiagnosis umumnya usia **6–9 th**. Angka mengikuti slide." } },
    { t: "akordion", judul: { id: "Perubahan DSM-5 untuk ADHD" }, item: [
      { judul: { id: "1. Tingkat keparahan" }, id: "Klinisi menyebut **ringan, sedang, atau berat**." },
      { judul: { id: "2. Bukan lagi subtipe" }, id: "Dulu orang bisa memenuhi satu subtipe tetapi tidak yang lain; kini disebut **presentasi** (dominan inatentif, dominan hiperaktif-impulsif, gabungan) yang bisa berubah sepanjang waktu." },
      { judul: { id: "3. Usia munculnya gejala" }, id: "Beberapa gejala harus sudah ada **sebelum usia 12 tahun** (sebelumnya 7) — karena kompleksitas & komorbiditas membuatnya sulit dikenali sangat dini. (Slide menulis \"usia 12 tahun\": maksudnya batas usia onset dinaikkan menjadi 12.)" },
      { judul: { id: "4. Gejala lebih sedikit untuk dewasa" }, id: "Seiring usia gejala bisa berkurang, tetapi **gangguan tetap ada** — untuk usia ≥ 17 tahun cukup **5** gejala." }
    ] },
    { t: "catatan", gaya: "info", judul: { id: "\"Penurunan\" hiperaktivitas" }, id: "Pada dewasa, hiperaktivitas disesuaikan atau dikompensasi: menghindari pertemuan yang mengharuskan duduk diam, olahraga berlebihan, pekerjaan **hektik** penuh perubahan, memakai ganja/alkohol/sedatif untuk meredam gelisah, banyak bicara. Inilah sebabnya orang **keliru** mengira ADHD hilang seiring waktu." },
    { t: "judul", id: "Tujuh langkah evaluasi" },
    { t: "anim", jenis: "alur", judul: { id: "Evaluasi ADHD dewasa" }, item: [
      { judul: { id: "1. Wawancara klinis" }, ket: { id: "Gejala dulu & kini, gangguan fungsi, komorbid, riwayat, kekuatan, MSE" } },
      { judul: { id: "2. Skala baku" }, ket: { id: "ASRS, Barkley, Brown, Conners" } },
      { judul: { id: "3. Riwayat medis" } },
      { judul: { id: "4. Keluarga" }, ket: { id: "ADHD & gangguan lain" } },
      { judul: { id: "5. Orang terdekat" }, ket: { id: "Dokumen, wawancara, skala" } },
      { judul: { id: "6. Sekolah & kerja" } },
      { judul: { id: "7. Asesmen lain" }, ket: { id: "Pendidikan, psikologis, neuropsikologis, imaging, vokasional" } }
    ] },
    { t: "catatan", gaya: "tanbih", judul: { id: "Komorbid yang sering" }, id: "Kecemasan; afektif **unipolar & bipolar**; gangguan belajar; **penyalahgunaan zat**; Tourette; psikotik; disabilitas intelektual; gangguan perkembangan menyeluruh; gangguan kepribadian. Kriteria E menuntut kita memastikan gejala **tidak lebih baik dijelaskan** oleh kondisi-kondisi ini." },
    { t: "judul", id: "Biologi ADHD" },
    { t: "anim", jenis: "otak", judul: { id: "Area otak yang terlibat" }, lobus: {
      frontal: { nama: "Lobus frontal & korteks prefrontal dorsal", fungsi: "Disfungsi **paling utama** (bukan satu-satunya); volume berkurang → perencanaan, inhibisi, perhatian. Jalur **dopamin** terkait perhatian.", tes: "Continuous Performance Test, Stroop, Trail Making B" },
      serebelum: { nama: "Serebelum", fungsi: "Volume **berkurang**; berperan dalam pengaturan waktu & koordinasi.", tes: "Tugas ketepatan waktu & motorik" },
      temporal: { nama: "Striatum (bagian dalam)", fungsi: "Volume **berkurang**; sirkuit penghargaan & kendali gerak. **Norepinefrin** terkait hiperaktivitas/impulsivitas.", tes: "Tugas penundaan hadiah" }
    }, petunjuk: { id: "Perhatian dimediasi **banyak** area otak; juga ditemukan lebih sedikit materi abu-abu & putih. Beberapa sistem neurotransmiter terlibat." } },
    { t: "poin", item: [
      { ikon: "users", judul: { id: "Studi keluarga" }, id: "Lebih banyak kerabat derajat pertama terdampak." },
      { ikon: "swap", judul: { id: "Studi kembar" }, id: "Kesesuaian kembar **identik** > fraternal." },
      { ikon: "home", judul: { id: "Studi adopsi" }, id: "**Alam > asuhan**." },
      { ikon: "chain", judul: { id: "Molekuler" }, id: "Gen kandidat memengaruhi sistem neurotransmiter." }
    ] },
    { t: "judul", id: "Pengobatan komprehensif" },
    { t: "anim", jenis: "alur", judul: { id: "Urutan penanganan" }, item: [{ judul: { id: "Edukasi" }, ket: { id: "Selalu dimulai di sini" } }, { judul: { id: "Obat" }, ket: { id: "Stimulan SSP dll.; 60–70% dewasa membaik; bukan pil ajaib" } }, { judul: { id: "Psikoterapi" }, ket: { id: "Coaching & CBT" } }, { judul: { id: "Aliansi orang terdekat" } }, { judul: { id: "Sumber lain" }, ket: { id: "Pelatih, dll." } }] },
    { t: "banding", judul: { id: "Coaching vs CBT" }, kiri: { judul: { id: "Coaching" }, warna: "green", poin: [{ id: "Praktis: **manajemen waktu** (jam, timer, agenda, ponsel), rumah tangga, keuangan, karier, waktu bersama pasangan" }, { id: "Tugas **disesuaikan** kebutuhan — mengurangi rasa gagal" }, { id: "Pelatih **setara** dengan klien" }] }, kanan: { judul: { id: "CBT" }, warna: "blue", poin: [{ id: "Lebih **kognitif**: harga diri, pikiran negatif, kontrol impuls" }, { id: "PR banyak bisa memicu rasa gagal pada ADHD" }, { id: "Terapis **tidak setara** dengan klien" }] } },
    { t: "catatan", gaya: "info", id: "Kesamaan keduanya: **transparan**, fokus **saat ini**, **terstruktur**, dan berorientasi **tujuan**." },
    { t: "catatan", gaya: "hikmah", judul: { id: "Perspektif Islam" }, id: "Mencari **keseimbangan** dan kedamaian batin; memohon perlindungan kepada Allah dari **malas, lalai, takut, menunda, gelisah** (doa *al-hamm wal-ḥazan, al-'ajz wal-kasal*). Nabi ﷺ teladan dalam **mengelola banyak peran** sekaligus: pemimpin politik, guru, penasihat, kepala keluarga, pemimpin agama — dengan keteraturan waktu shalat sebagai \"agenda harian\" yang menata hidup." },
    { t: "ringkasan", item: [{ id: "A: ≥ 6/9 gejala, ≥ 6 bulan; D: gangguan fungsi; E: bukan gangguan lain." }, { id: "DSM-IV: gabungan 85%; DSM-5: keparahan, presentasi, onset < 12 th, 5 gejala dewasa." }, { id: "Hiperaktivitas dewasa = gelisah batin; ADHD tidak hilang." }, { id: "7 langkah evaluasi; banyak komorbid." }, { id: "Frontal, serebelum, striatum; dopamin & norepinefrin; edukasi → obat → coaching/CBT." }] },
    { t: "cek", q: { id: "Pria 32 tahun sering gonta-ganti pekerjaan, menghindari rapat, olahraga ekstrem tiap hari, dan minum alkohol “agar tenang”. Sejak SD sering ditegur karena tak bisa diam. Hipotesis paling kuat…" }, o: [{ id: "Hipomania murni" }, { id: "ADHD dewasa dengan hiperaktivitas yang berubah menjadi gelisah batin" }, { id: "Skizofrenia" }, { id: "Tidak ada masalah" }], j: 1, b: { id: "Gejala sejak kecil + kompensasi khas dewasa (hindari rapat, olahraga berlebihan, alkohol) = pola ADHD dewasa; tetap periksa komorbid zat." } }
  ],
  istilah: [
    { t: "Inatensi", id: "Kurang perhatian." },
    { t: "Impulsivitas", id: "Bertindak sebelum berpikir." },
    { t: "Presentasi", id: "Istilah DSM-5 pengganti subtipe ADHD." },
    { t: "Gelisah batin", id: "Wujud hiperaktivitas pada dewasa." },
    { t: "ASRS", id: "Adult ADHD Self-Report Scale." },
    { t: "Stimulan SSP", id: "Obat stimulan sistem saraf pusat." },
    { t: "Coaching", id: "Pendampingan praktis manajemen hidup." }
  ],
  latihan: {
    pg: [
      { q: { id: "Anak 8 tahun menunjukkan 7 gejala kurang perhatian dan 3 gejala hiperaktif selama 4 bulan, di rumah dan sekolah. Kesimpulan…" }, o: [{ id: "Memenuhi ADHD presentasi inatentif" }, { id: "Belum memenuhi kriteria A karena durasi kurang dari 6 bulan" }, { id: "ADHD gabungan" }, { id: "ADHD hiperaktif" }], j: 1 },
      { q: { id: "Menurut DSM-IV, subtipe ADHD yang paling banyak adalah…" }, o: [{ id: "Inatentif" }, { id: "Hiperaktif/impulsif" }, { id: "Gabungan (85%)" }, { id: "Residual" }], j: 2 },
      { q: { id: "Perubahan DSM-5 terkait usia munculnya gejala ADHD adalah…" }, o: [{ id: "Gejala harus muncul sebelum usia 7" }, { id: "Beberapa gejala harus sudah ada sebelum usia 12" }, { id: "Tidak ada batas usia" }, { id: "Hanya didiagnosis setelah 18 tahun" }], j: 1 },
      { q: { id: "Mengapa banyak orang keliru mengira ADHD hilang saat dewasa?" }, o: [{ id: "Otak berhenti berkembang" }, { id: "Hiperaktivitas luar menurun dan berubah menjadi gelisah batin atau dikompensasi" }, { id: "Obat menyembuhkan permanen" }, { id: "Dewasa tidak pernah lalai" }], j: 1 },
      { q: { id: "Klien dengan gejala kurang perhatian yang hanya muncul saat episode depresi dan hilang saat mood membaik. Kriteria yang tidak terpenuhi…" }, o: [{ id: "Kriteria A" }, { id: "Kriteria D" }, { id: "Kriteria E — lebih baik dijelaskan gangguan mood" }, { id: "Semua terpenuhi" }], j: 2 },
      { q: { id: "Neurotransmiter yang paling dikaitkan dengan hiperaktivitas/impulsivitas menurut slide adalah…" }, o: [{ id: "Dopamin" }, { id: "Norepinefrin" }, { id: "Serotonin" }, { id: "GABA" }], j: 1 },
      { q: { id: "Temuan studi adopsi ADHD adalah…" }, o: [{ id: "Asuhan > alam" }, { id: "Alam > asuhan" }, { id: "Tidak ada pengaruh genetik" }, { id: "Hanya kembar fraternal yang sama" }], j: 1 },
      { q: { id: "Klien ADHD merasa gagal karena tidak sanggup menyelesaikan PR terapi yang banyak. Penyesuaian yang paling sesuai slide…" }, o: [{ id: "Tambah PR" }, { id: "Beralih ke pendekatan coaching yang praktis dengan tugas sesuai kebutuhan" }, { id: "Hentikan terapi" }, { id: "Hanya obat" }], j: 1 },
      { q: { id: "Langkah pertama pengobatan komprehensif ADHD adalah…" }, o: [{ id: "Stimulan" }, { id: "Edukasi" }, { id: "Neuroimaging" }, { id: "Rawat inap" }], j: 1 },
      { q: { id: "Persentase dewasa ADHD yang membaik moderat hingga signifikan dengan obat adalah…" }, o: [{ id: "10–20%" }, { id: "30–40%" }, { id: "60–70%" }, { id: "100%" }], j: 2 },
      { q: { id: "Pria 40 tahun dievaluasi ADHD. Menurut DSM-5, jumlah gejala minimal per domain adalah…" }, o: [{ id: "3" }, { id: "5" }, { id: "6" }, { id: "9" }], j: 1 }
    ],
    bs: [
      { t: { id: "Disfungsi lobus frontal adalah satu-satunya lokasi gangguan pada ADHD." }, j: false },
      { t: { id: "Pada 90% dewasa ADHD terdapat perubahan mood dan ledakan amarah." }, j: true },
      { t: { id: "Obat ADHD adalah pil ajaib yang menyelesaikan semua masalah." }, j: false },
      { t: { id: "Dalam coaching, pelatih lebih setara dengan klien dibanding terapis dalam CBT." }, j: true },
      { t: { id: "DSM-5 meminta klinisi menyebut tingkat keparahan ADHD." }, j: true }
    ],
    isian: [
      { t: { id: "Kriteria A ADHD: minimal 6 dari ______ gejala pada satu domain." }, j: { id: "9" }, x: [{ id: "6" }, { id: "12" }, { id: "18" }] },
      { t: { id: "Gejala harus berlangsung minimal ______ bulan." }, j: { id: "6" }, x: [{ id: "1" }, { id: "3" }, { id: "12" }] }
    ],
    pilah: { t: { id: "Pilah gejala ke domainnya" }, kategori: [{ id: "Kurang perhatian" }, { id: "Hiperaktif/impulsif" }], item: [{ t: { id: "Sering kehilangan barang" }, k: 0 }, { t: { id: "Menyela pembicaraan" }, k: 1 }, { t: { id: "Menghindari tugas mental panjang" }, k: 0 }, { t: { id: "Sulit menunggu giliran" }, k: 1 }, { t: { id: "Gagal memperhatikan detail" }, k: 0 }, { t: { id: "Bicara berlebihan" }, k: 1 }] },
    urut: { t: { id: "Urutkan tujuh langkah evaluasi ADHD" }, item: [{ id: "Wawancara klinis" }, { id: "Skala penilaian baku" }, { id: "Riwayat medis" }, { id: "Riwayat keluarga" }, { id: "Informasi orang terdekat" }, { id: "Penilaian sekolah & kerja" }, { id: "Asesmen lain" }] }
  },
  tugas: [
    { t: { id: "Jelaskan kriteria ADHD dan perbedaan DSM-IV dengan DSM-5, termasuk implikasinya bagi diagnosis dewasa." }, j: { id: "Kriteria A: minimal 6 dari 9 gejala kurang perhatian atau hiperaktif-impulsif (atau keduanya) selama minimal 6 bulan, maladaptif dan tak sesuai perkembangan; D: gangguan fungsi sosial, akademik, atau pekerjaan yang jelas; E: tidak lebih baik dijelaskan gangguan lain. DSM-IV memakai 18 kriteria dan 3 subtipe (inatentif 10–15%, hiperaktif 3%, gabungan 85%), biasanya didiagnosis usia 6–9. DSM-5 menambahkan tingkat keparahan, mengganti subtipe dengan presentasi yang dapat berubah, menaikkan batas onset menjadi sebelum usia 12, dan menurunkan jumlah gejala untuk dewasa (5 gejala usia ≥ 17). Implikasinya, dewasa yang hiperaktivitasnya berubah menjadi gelisah batin tetap dapat terdiagnosis." } },
    { t: { id: "Rancang rencana penanganan komprehensif untuk mahasiswa dengan ADHD yang sering terlambat mengumpulkan tugas." }, j: { id: "Mulai dengan edukasi tentang ADHD agar ia menerima kondisinya dan memahami kebutuhan pengobatan. Rujuk ke psikiater untuk pertimbangan stimulan (perbaikan pada 60–70% dewasa, bukan pil ajaib). Lakukan coaching praktis: timer, agenda dan pengingat ponsel, memecah tugas besar menjadi langkah kecil, rutinitas belajar, dan tugas yang disesuaikan agar tidak menimbulkan rasa gagal; tambahkan CBT untuk harga diri, pikiran negatif, dan kontrol impuls. Libatkan orang terdekat sebagai sekutu dan dosen wali bila perlu. Dari sisi Islam, gunakan waktu shalat sebagai jangkar jadwal harian dan biasakan doa berlindung dari lemah dan malas." } }
  ]
});

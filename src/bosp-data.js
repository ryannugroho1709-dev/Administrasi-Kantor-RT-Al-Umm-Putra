// ============================================================
//  DATA REFERENSI BOSP / ARKAS 4 — Tahun Anggaran 2026
//  Sumber: Pusat Informasi Rumah Pendidikan Kemendikdasmen "Kode Referensi Pada ARKAS 4"
//  (dimutakhirkan 10 Maret 2026) dan "Implementasi Permendikdasmen No 8/2026 dalam Penggunaan
//  Dana BOSP Reguler"; Permendikdasmen Nomor 8 Tahun 2026 (berlaku 6 Februari 2026).
//  Format baris: "kode|SNP|komponen|uraian kegiatan"
// ============================================================
const BSP_DIPERBARUI = "10 Maret 2026 (kode referensi) · Permendikdasmen 8/2026";

const BSP_REF = {
  // ── BOP Kesetaraan (Paket A/B/C, PKBM, SKB) — yang dipakai PKBM Al-Umm ──
  kesetaraan: `02.02.01|Isi|Pengembangan Perpustakaan|Kegiatan pemberdayaan perpustakaan terutama untuk pengembangan minat baca peserta didik/warga belajar
02.06.01|Isi|Pengembangan profesi pendidik dan tenaga kependidikan|Kegiatan diskusi kolaborasi pengembangan RPP dalam Komunitas Belajar (termasuk Forum Tutor, Forum PKBM, Forum SKB)
03.01.01|Proses|Penerimaan Peserta Didik Baru|Pelaksanaan Pendaftaran Peserta Didik Baru (PPDB)
03.01.02|Proses|Penerimaan Peserta Didik Baru|Pendataan ulang bagi Peserta Didik lama
03.01.03|Proses|Penerimaan Peserta Didik Baru|Pelaksanaan kegiatan orientasi siswa baru yang bersifat akademik dan pengenalan lingkungan tanpa kekerasan
03.02.01|Proses|Pengembangan Perpustakaan|Pelaksanaan kegiatan publikasi berkala satuan pendidikan (Majalah Satuan Pendidikan, Majalah Dinding)
03.02.03|Proses|Pengembangan Perpustakaan|Penyediaan atau pembiayaan langganan platform perpustakaan digital
03.03.01|Proses|Pelaksanaan kegiatan pembelajaran dan ekstrakurikuler|Penyusunan Silabus / Tujuan Pembelajaran
03.03.04|Proses|Pelaksanaan kegiatan pembelajaran dan ekstrakurikuler|Pengembangan pembelajaran berbasis projek (termasuk P5)
03.03.05|Proses|Pelaksanaan kegiatan pembelajaran dan ekstrakurikuler|Penyelenggaraan Perbaikan/Pengayaan (Remedial)
03.03.06|Proses|Pelaksanaan kegiatan pembelajaran dan ekstrakurikuler|Pelaksanaan Ekstrakurikuler Kepramukaan
03.03.07|Proses|Pelaksanaan kegiatan pembelajaran dan ekstrakurikuler|Pelaksanaan Kegiatan Ekstrakurikuler (di luar Kepramukaan)
03.03.08|Proses|Pelaksanaan kegiatan pembelajaran dan ekstrakurikuler|Program Pembinaan Kesiswaan dan Kepemimpinan Siswa
03.03.10|Proses|Pelaksanaan kegiatan pembelajaran dan ekstrakurikuler|Pengembangan program pencegahan dan penanganan kekerasan di satuan pendidikan (termasuk Program Roots)
03.03.11|Proses|Pelaksanaan kegiatan pembelajaran dan ekstrakurikuler|Penerapan program pencegahan perundungan
03.03.14|Proses|Pelaksanaan kegiatan pembelajaran dan ekstrakurikuler|Penyelenggaraan Pesantren Kilat dan Kegiatan Keagamaan Sejenis
03.03.16|Proses|Pelaksanaan kegiatan pembelajaran dan ekstrakurikuler|Penyusunan Pembagian Tugas Guru/Tutor dan Jadwal Pelajaran
03.03.17|Pengembangan Standar Proses|Pelaksanaan kegiatan pembelajaran dan ekstrakurikuler|Pembiayaan untuk partisipasi kegiatan berbagi praktik baik
03.03.18|Proses|Pelaksanaan kegiatan pembelajaran dan ekstrakurikuler|Pengayaan TIK untuk memfasilitasi kegiatan pembelajaran
03.03.19|Proses|Pelaksanaan kegiatan pembelajaran dan ekstrakurikuler|Pelaksanaan Lomba-Lomba
03.03.20|Proses|Pelaksanaan kegiatan pembelajaran dan ekstrakurikuler|Pelaksanaan Program-Program Satuan Pendidikan Lainnya
03.03.22|Proses|Pelaksanaan kegiatan pembelajaran dan ekstrakurikuler|Penyelenggaraan Pembelajaran aktif, kreatif, efektif, dan nyaman
03.04.01|Proses|Pelaksanaan kegiatan asesmen dan evaluasi pembelajaran|Pelaksanaan supervisi pembelajaran semua mapel/guru/tutor di satuan pendidikan
03.04.02|Proses|Pelaksanaan kegiatan asesmen dan evaluasi pembelajaran|Pelaksanaan Evaluasi kegiatan ekstrakurikuler
03.05.01|Proses / Pembiayaan|Pelaksanaan administrasi kegiatan sekolah|Kegiatan koordinasi dan pelaporan untuk mendukung program prioritas pusat (Program Indonesia Pintar, BOSP, Sekolah Penggerak, dll.) / Biaya perjalanan dinas dalam rangka menunjang program prioritas nasional
03.05.02|Proses|Pelaksanaan administrasi kegiatan sekolah|Penyelenggaraan UKS, penyediaan alat peralatan UKS dan bahan/obat-obatan penunjang kesehatan satuan pendidikan
04.06.01|Pengembangan pendidik dan tenaga kependidikan|Pengembangan profesi pendidik dan tenaga kependidikan|Pelaksanaan kegiatan komunitas belajar di satuan pendidikan
04.06.02|PTK|Pengembangan profesi pendidik dan tenaga kependidikan|Kegiatan Komunitas Belajar antar satuan pendidikan (termasuk Forum Tutor, Forum PKBM, Forum SKB)
04.06.05|PTK|Pengembangan profesi pendidik dan tenaga kependidikan|Peningkatan Kompetensi Guru/Tutor
04.06.06|PTK|Pengembangan profesi pendidik dan tenaga kependidikan|Peningkatan Kompetensi Kepala Satuan Pendidikan
04.06.07|PTK|Pengembangan profesi pendidik dan tenaga kependidikan|Pembinaan dan Peningkatan Kompetensi Tenaga Pelaksana Satuan Pendidikan (Tenaga Ekstrakurikuler, TU, Laboratorium, Perpustakaan, dan UKS)
04.06.08|PTK|Pengembangan profesi pendidik dan tenaga kependidikan|Fasilitasi kepesertaan Guru/Tutor dalam berbagai kegiatan prestasi guru/tutor
04.06.11|PTK|Pengembangan profesi pendidik dan tenaga kependidikan|Peningkatan Kompetensi Guru/Tutor untuk keterlibatan orangtua/wali dan masyarakat dalam pembelajaran
04.06.12|PTK|Pengembangan profesi pendidik dan tenaga kependidikan|Workshop peningkatan kompetensi pengelolaan kelas bagi guru/tutor
04.06.14|PTK|Pengembangan profesi pendidik dan tenaga kependidikan|Peningkatan Kompetensi Guru/Tutor untuk memperkuat literasi
04.06.22|PTK|Pengembangan profesi pendidik dan tenaga kependidikan|Peningkatan Kompetensi Guru/Tutor untuk memahami konten pembelajaran dan cara mengajarkannya
04.06.23|PTK|Pengembangan profesi pendidik dan tenaga kependidikan|Peningkatan Kompetensi Guru/Tutor untuk memahami Kurikulum dan cara mengajarkannya
04.06.25|PTK|Pengembangan profesi pendidik dan tenaga kependidikan|Workshop peningkatan kompetensi semua guru/tutor mapel tentang analisis input peserta didik/warga belajar dalam penentuan KKM
04.06.27|PTK|Pengembangan profesi pendidik dan tenaga kependidikan|Peningkatan Kompetensi Guru/Tutor untuk asesmen, umpan balik dan pelaporan yang berpusat pada peserta didik
05.02.03|Sarpras|Pengembangan Perpustakaan|Pengadaan Buku Teks Utama/Pendamping Peserta Didik
05.02.04|Sarpras|Pengembangan Perpustakaan|Pengadaan Buku Teks Utama/Pendamping Guru
05.02.05|Sarpras|Pengembangan Perpustakaan|Pengadaan buku pengayaan dan referensi
05.02.06|Sarpras|Pengembangan Perpustakaan|Penyediaan buku teks pendamping sesuai dengan kurikulum
05.05.01|Sarpras|Pengembangan Perpustakaan|Penyediaan atau pembuatan media pembelajaran / modul pembelajaran
05.05.02|Sarpras|Pelaksanaan administrasi kegiatan sekolah|Pengembangan satuan pendidikan sehat/aman/ramah anak/inklusi/adiwiyata dan sejenisnya
05.08.01|Sarpras|Pemeliharaan Sarana dan Prasarana Sekolah|Pemeliharaan Prasarana Lahan, Bangunan dan Ruang
05.08.02|Sarpras|Pemeliharaan Sarana dan Prasarana Sekolah|Pengadaan Peralatan Satuan Pendidikan di luar komponen penyediaan alat multimedia pembelajaran
05.08.03|Sarpras|Pemeliharaan Sarana dan Prasarana Sekolah|Pemeliharaan Peralatan Satuan Pendidikan
05.08.04|Sarpras|Pemeliharaan Sarana dan Prasarana Sekolah|Pengadaan Perlengkapan Satuan Pendidikan di luar komponen penyediaan alat multimedia pembelajaran
05.08.05|Sarpras|Pemeliharaan Sarana dan Prasarana Sekolah|Pemeliharaan Perlengkapan Satuan Pendidikan
05.08.06|Sarpras|Pemeliharaan Sarana dan Prasarana Sekolah|Penyediaan prasarana akses/fasilitas bagi Peserta Didik/warga belajar Penyandang Disabilitas
05.08.07|Pengembangan sarana dan prasarana sekolah|Pemeliharaan Sarana dan Prasarana Sekolah|Pengadaan peralatan untuk menunjang pembelajaran peserta didik penyandang disabilitas
05.08.08|Pengembangan sarana dan prasarana sekolah|Pemeliharaan Sarana dan Prasarana Sekolah|Pengadaan sarana perlengkapan untuk mendukung peserta didik disabilitas
05.08.09|Sarpras|Pemeliharaan Sarana dan Prasarana Sekolah|Pengadaan Perlengkapan Daya dan Jasa Satuan Pendidikan (instalasi air, listrik, telepon, internet, termasuk genset/panel surya)
05.08.10|Sarpras|Pemeliharaan Sarana dan Prasarana Sekolah|Pemeliharaan Perlengkapan Daya dan Jasa Satuan Pendidikan (instalasi air, listrik, internet, termasuk genset/panel surya)
05.08.11|Sarpras|Pemeliharaan Sarana dan Prasarana Sekolah|Pengadaan seragam untuk peserta didik/warga belajar, pendidik/tutor, dan tenaga kependidikan yang menjadi inventaris sekolah
05.08.12|Sarpras|Pemeliharaan Sarana dan Prasarana Sekolah|Tindakan tanggap darurat dampak bencana (tidak termasuk perbaikan setelah lewat tanggap darurat)
05.09.01|Sarpras|Penyediaan alat multimedia pembelajaran|Pengadaan Komputer Desktop/Work-station untuk Pembelajaran, Administrasi dan Perpustakaan
05.09.02|Sarpras|Penyediaan alat multimedia pembelajaran|Pengadaan Komputer Laptop, Notebook untuk Pembelajaran, Administrasi dan Perpustakaan
05.09.04|Sarpras|Penyediaan alat multimedia pembelajaran|Pengadaan Printer, Printer+Scanner, dan Scanner
05.09.05|Sarpras|Penyediaan alat multimedia pembelajaran|Pengadaan Proyektor, Layar Proyektor, dan Layar LCD/LED ≥ 32"
06.05.01|Pengelolaan|Pelaksanaan administrasi kegiatan sekolah|Penyusunan perencanaan program satuan pendidikan (Visi Misi Sekolah, RKJM, RKT, RKAS)
06.05.02|Pengelolaan|Pelaksanaan administrasi kegiatan sekolah|Pengembangan dan Pelaksanaan Program Kerja Kepala Satuan Pendidikan
06.05.03|Pengelolaan|Pelaksanaan administrasi kegiatan sekolah|Pendataan Dapodik
06.05.04|Pengelolaan|Pelaksanaan administrasi kegiatan sekolah|Pelaksanaan Monitoring Program/Kegiatan Satuan Pendidikan
06.05.05|Pengelolaan|Pelaksanaan administrasi kegiatan sekolah|Pelaksanaan Supervisi Administrasi Tata Usaha
06.05.06|Pengelolaan|Pelaksanaan administrasi kegiatan sekolah|Konsumsi Rapat Kedinasan dan Tamu Satuan Pendidikan (di luar kegiatan lain)
06.05.07|Pengelolaan|Pelaksanaan administrasi kegiatan sekolah|Pengadaan Bahan Pembelajaran dan Praktik (termasuk Kejuruan/Bengkel)
06.05.08|Pengelolaan|Pelaksanaan administrasi kegiatan sekolah|Pembelian Bahan Habis Pakai untuk mendukung pembelajaran dan administrasi sekolah (termasuk ATK, Tinta Printer, Kabel Ekstension, dsb)
06.05.09|Pengelolaan|Pelaksanaan administrasi kegiatan sekolah|Pembelian bahan habis pakai/alat penunjang kebersihan dan sanitasi satuan pendidikan
06.05.12|Pengelolaan|Pelaksanaan administrasi kegiatan sekolah|Pengembangan dan pemeliharaan Website satuan pendidikan (termasuk media sosial satuan pendidikan)
06.05.13|Pengelolaan|Pelaksanaan administrasi kegiatan sekolah|Pengembangan Sistem Informasi untuk menunjang Manajemen Satuan Pendidikan
06.05.14|Pengelolaan|Pelaksanaan administrasi kegiatan sekolah|Transportasi atau perjalanan dinas dalam rangka koordinasi dan pelaporan ke Dinas Pendidikan
06.07.01|Pengelolaan|Pembiayaan langganan daya dan jasa|Pembayaran daya listrik
06.07.02|Pengelolaan|Pembiayaan langganan daya dan jasa|Penambahan daya listrik
06.07.03|Pengelolaan|Pembiayaan langganan daya dan jasa|Pembayaran langganan air
06.07.04|Pengelolaan|Pembiayaan langganan daya dan jasa|Pembayaran biaya telepon
06.07.05|Pengelolaan|Pembiayaan langganan daya dan jasa|Pembayaran jasa internet
06.07.06|Pengelolaan|Pembiayaan langganan daya dan jasa|Penambahan daya internet
06.07.07|Pengelolaan|Pembiayaan langganan daya dan jasa|Pembelian Bahan Bakar Minyak/Gas untuk keperluan pembelajaran/Rumah Tangga Satuan Pendidikan
06.07.09|Pengelolaan|Pembiayaan langganan daya dan jasa|Pembayaran langganan koran dan majalah
07.05.01|Pembiayaan|Pelaksanaan administrasi kegiatan sekolah|Bea materai, administrasi bank
07.05.02|Pembiayaan|Pelaksanaan administrasi kegiatan sekolah|Penggandaan laporan dan/atau surat-menyurat
07.05.03|Pembiayaan|Pelaksanaan administrasi kegiatan sekolah|Penyelenggaraan sosialisasi dan pelaporan program, kegiatan hasil-hasil, dan pengelolaan keuangan satuan pendidikan
07.05.04|Pembiayaan|Pelaksanaan administrasi kegiatan sekolah|Penyelenggaraan kegiatan inventarisasi dan pendokumentasian nilai aset semua sarpras satuan pendidikan pada tahun berjalan
07.05.05|Pembiayaan|Pelaksanaan administrasi kegiatan sekolah|Penggalangan, pengelolaan dan pelaporan pendanaan dari pihak ketiga (masyarakat umum, dunia industri, dan CSR)
07.12.01|Pembiayaan|Pembayaran Honor|Pembayaran honor Guru/Pendidik/Tutor
07.12.03|Pembiayaan|Pembayaran Honor|Pembayaran Honor tenaga administrasi
07.12.04|Pembiayaan|Pembayaran Honor|Pembayaran honor Tenaga Penunjang atau pelaksana
08.04.01|Penilaian|Pelaksanaan kegiatan asesmen dan evaluasi pembelajaran|Persiapan, uji coba, simulasi, dan pelaksanaan Asesmen Nasional
08.04.02|Pengembangan dan implementasi sistem penilaian|Pelaksanaan kegiatan asesmen dan evaluasi pembelajaran|Penyiapan dan pelaksanaan asesmen di awal pembelajaran
08.04.03|Penilaian|Pelaksanaan kegiatan asesmen dan evaluasi pembelajaran|Penyusunan kisi-kisi dan penyusunan soal penilaian formatif (ulangan harian)
08.04.04|Penilaian|Pelaksanaan kegiatan asesmen dan evaluasi pembelajaran|Pelaksanaan penilaian formatif (ulangan harian)
08.04.05|Penilaian|Pelaksanaan kegiatan asesmen dan evaluasi pembelajaran|Penyusunan kisi-kisi dan penyusunan soal penilaian sumatif (ulangan tengah semester/akhir semester/kenaikan kelas)
08.04.06|Penilaian|Pelaksanaan kegiatan asesmen dan evaluasi pembelajaran|Pelaksanaan penilaian sumatif (ujian modul)
08.04.08|Penilaian|Pelaksanaan kegiatan asesmen dan evaluasi pembelajaran|Penyiapan, Uji Coba, dan Pelaksanaan Penilaian/Asesmen Satuan Pendidikan (Akhir Satuan Pendidikan) — termasuk Asesmen Berbasis Komputer
08.04.09|Penilaian|Pelaksanaan kegiatan asesmen dan evaluasi pembelajaran|Penyusunan Kriteria Kenaikan Kelas
08.04.10|Penilaian|Pelaksanaan kegiatan asesmen dan evaluasi pembelajaran|Penyusunan Kompetensi Ketuntasan Minimal
08.04.11|Penilaian|Pelaksanaan kegiatan asesmen dan evaluasi pembelajaran|Pelaksanaan uji kesetaraan
08.04.12|Penilaian|Pelaksanaan kegiatan asesmen dan evaluasi pembelajaran|Pembelajaran kelas jauh
08.06.01|Penilaian|Pengembangan profesi pendidik dan tenaga kependidikan|Fasilitasi pengembangan kompetensi guru melalui diseminasi (IHT, Pelatihan, Penugasan, Pengembangan Portofolio, Pelaksanaan P5, dan Workshop)`,

  // ── BOS Reguler (SD/SMP/SMA/SMK) — pembanding ──
  bos: `02.02.01|Isi|Pengembangan Perpustakaan|Kegiatan pemberdayaan perpustakaan terutama untuk pengembangan minat baca peserta didik
02.03.01|Isi|Pelaksanaan kegiatan pembelajaran dan ekstrakurikuler|Penyusunan Kurikulum
02.03.02|—|Pelaksanaan kegiatan pembelajaran dan ekstrakurikuler|Penyusunan kurikulum kompetensi keahlian
02.06.01|Isi|Pengembangan profesi guru dan tenaga kependidikan|Kegiatan diskusi kolaborasi pengembangan RPP dalam Komunitas Belajar (termasuk KKG/MGMP/MGMPS/MGPMPK)
03.01.01|Proses|Penerimaan Peserta Didik Baru|Pelaksanaan Pendaftaran Peserta Didik Baru (PPDB)
03.01.02|Proses|Penerimaan Peserta Didik Baru|Pendataan ulang bagi Peserta Didik lama
03.01.03|Proses|Penerimaan Peserta Didik Baru|Pelaksanaan kegiatan orientasi siswa baru yang bersifat akademik dan pengenalan lingkungan tanpa kekerasan
03.02.01|Proses|Pengembangan Perpustakaan|Pelaksanaan kegiatan publikasi berkala sekolah (Majalah Sekolah, Majalah Dinding)
03.02.02|Proses|Pengembangan Perpustakaan|Pembelian Buku Lembar Kerja Siswa
03.02.03|Proses|Pengembangan Perpustakaan|Penyediaan atau pembiayaan langganan platform perpustakaan digital
03.03.01|Proses / PTK|Pelaksanaan kegiatan pembelajaran dan ekstrakurikuler|Penyusunan Silabus / Tujuan Pembelajaran
03.03.02|Proses|Pelaksanaan kegiatan pembelajaran dan ekstrakurikuler|Pengembangan Kegiatan Literasi dan Numerasi
03.03.04|Proses|Pelaksanaan kegiatan pembelajaran dan ekstrakurikuler|Pengembangan pembelajaran berbasis projek (termasuk P5)
03.03.05|Proses|Pelaksanaan kegiatan pembelajaran dan ekstrakurikuler|Penyelenggaraan Perbaikan/Pengayaan (Remedial)
03.03.06|Proses / PTK|Pelaksanaan kegiatan pembelajaran dan ekstrakurikuler|Pelaksanaan Ekstrakurikuler Kepramukaan
03.03.07|Proses / PTK|Pelaksanaan kegiatan pembelajaran dan ekstrakurikuler|Pelaksanaan Kegiatan Ekstrakurikuler (di luar Kepramukaan)
03.03.08|Proses|Pelaksanaan kegiatan pembelajaran dan ekstrakurikuler|Program Pembinaan Kesiswaan dan Kepemimpinan Siswa
03.03.10|—|Pelaksanaan kegiatan pembelajaran dan ekstrakurikuler|Pengembangan program pencegahan dan penanganan kekerasan di satuan pendidikan (termasuk Program Roots)
03.03.11|—|Pelaksanaan kegiatan pembelajaran dan ekstrakurikuler|Penerapan Program Pencegahan Perundungan
03.03.12|Proses|Pelaksanaan kegiatan pembelajaran dan ekstrakurikuler|Penyelenggaraan pencegahan penyalahgunaan narkotika, psikotropika, zat adiktif (narkoba), minuman keras, merokok, dan HIV AIDS
03.03.13|Proses|Pelaksanaan kegiatan pembelajaran dan ekstrakurikuler|Konsultasi peningkatan mutu pendidikan (Konsultan & Psikolog)
03.03.14|Proses|Pelaksanaan kegiatan pembelajaran dan ekstrakurikuler|Penyelenggaraan Pesantren Kilat dan Kegiatan Keagamaan Sejenis
03.03.15|Proses|Pelaksanaan kegiatan pembelajaran dan ekstrakurikuler|Pengembangan kegiatan pelibatan orang tua/wali/keluarga di pembelajaran
03.03.16|Proses|Pelaksanaan kegiatan pembelajaran dan ekstrakurikuler|Penyusunan Pembagian Tugas Guru dan Jadwal Pelajaran
03.03.17|—|Pelaksanaan kegiatan pembelajaran dan ekstrakurikuler|Pembiayaan untuk partisipasi kegiatan berbagi praktik baik
03.03.18|Proses|Pelaksanaan kegiatan pembelajaran dan ekstrakurikuler|Pengayaan TIK untuk memfasilitasi kegiatan pembelajaran
03.03.19|Proses|Pelaksanaan kegiatan pembelajaran dan ekstrakurikuler|Pelaksanaan Lomba-Lomba
03.03.20|Proses|Pelaksanaan kegiatan pembelajaran dan ekstrakurikuler|Pelaksanaan Program-Program Sekolah Lainnya
03.03.21|Proses|Pelaksanaan kegiatan pembelajaran dan ekstrakurikuler|Perayaan Hari Besar Agama, Nasional, dan Daerah
03.03.22|Proses|Pelaksanaan kegiatan pembelajaran dan ekstrakurikuler|Penyelenggaraan Pembelajaran aktif, kreatif, efektif, dan nyaman
03.04.01|Proses|Pelaksanaan Kegiatan Asesmen dan Evaluasi Pembelajaran|Pelaksanaan supervisi pembelajaran semua mapel/guru di sekolah
03.04.02|Proses|Pelaksanaan Kegiatan Asesmen dan Evaluasi Pembelajaran|Pelaksanaan Evaluasi kegiatan ekstrakurikuler
03.05.01|—|Pelaksanaan administrasi kegiatan sekolah|Kegiatan koordinasi dan pelaporan untuk mendukung Program Prioritas Pusat (Program Indonesia Pintar, BOSP, Sekolah Penggerak, dll.)
03.05.02|Proses|Pelaksanaan administrasi kegiatan sekolah|Penyelenggaraan UKS, penyediaan alat peralatan UKS dan bahan/obat-obatan penunjang kesehatan sekolah
03.10.01|Proses|Penyelenggaraan kegiatan peningkatan kompetensi keahlian|Pengembangan kerja sama industri dalam rangka peningkatan kompetensi keahlian di SMK atau SMALB
03.10.02|Proses|Penyelenggaraan kegiatan peningkatan kompetensi keahlian|Pengembangan Ruang Lingkup Skema Sertifikasi
03.11.01|—|Penyelenggaraan kegiatan dalam mendukung keterserapan lulusan|Pembelajaran terkait budaya kerja
03.11.02|Proses|Penyelenggaraan kegiatan dalam mendukung keterserapan lulusan|Penyelenggaraan bursa kerja khusus SMK atau SMALB
03.11.03|Proses|Penyelenggaraan kegiatan dalam mendukung keterserapan lulusan|Pemantauan kebekerjaan lulusan (tracer study) SMK atau SMALB
03.11.04|Proses|Penyelenggaraan kegiatan dalam mendukung keterserapan lulusan|Penyelenggaraan Pendidikan Kejuruan bagi Peserta Didik SMK/SMALB
04.06.01|PTK|Pengembangan profesi guru dan tenaga kependidikan|Pelaksanaan kegiatan komunitas belajar di satuan pendidikan
04.06.02|PTK|Pengembangan profesi guru dan tenaga kependidikan|Kegiatan Komunitas Belajar antar sekolah (termasuk KKG, MGMP, MGMPS, MGMPK, KKKS, atau MKKS)
04.06.03|PTK|Pengembangan profesi guru dan tenaga kependidikan|Pengembangan diri guru dan tenaga kependidikan materi lain di luar GTK
04.06.04|PTK|Pengembangan profesi guru dan tenaga kependidikan|Pengembangan diri guru dan tenaga kependidikan materi lain melalui GTK
04.06.05|PTK|Pengembangan profesi guru dan tenaga kependidikan|Peningkatan Kompetensi Guru
04.06.06|PTK|Pengembangan profesi guru dan tenaga kependidikan|Peningkatan Kompetensi Kepala Sekolah
04.06.07|PTK|Pengembangan profesi guru dan tenaga kependidikan|Pembinaan dan Peningkatan Kompetensi Tenaga Pelaksana Sekolah (Tenaga Ekstrakurikuler, TU, Laboratorium, Perpustakaan, dan UKS)
04.06.08|PTK|Pengembangan profesi guru dan tenaga kependidikan|Fasilitasi kepesertaan Guru dalam berbagai kegiatan prestasi guru
04.06.09|PTK|Pengembangan profesi guru dan tenaga kependidikan|Kegiatan Magang Guru di Sekolah Lain
04.06.11|PTK|Pengembangan profesi guru dan tenaga kependidikan|Peningkatan Kompetensi Guru untuk keterlibatan orangtua/wali dan masyarakat dalam pembelajaran
04.06.12|PTK|Pengembangan profesi guru dan tenaga kependidikan|Peningkatan Kompetensi Guru untuk pengelolaan lingkungan pembelajaran yang aman dan nyaman
04.06.13|PTK|Pengembangan profesi guru dan tenaga kependidikan|Peningkatan Kompetensi Guru untuk memperkuat numerasi
04.06.14|PTK|Pengembangan profesi guru dan tenaga kependidikan|Peningkatan Kompetensi Guru untuk memperkuat literasi
04.06.22|PTK|Pengembangan profesi guru dan tenaga kependidikan|Peningkatan Kompetensi Guru untuk memahami konten pembelajaran dan cara mengajarkannya
04.06.23|PTK|Pengembangan profesi guru dan tenaga kependidikan|Peningkatan Kompetensi Guru untuk memahami Kurikulum dan cara menggunakannya
04.06.24|PTK|Pengembangan profesi guru dan tenaga kependidikan|Peningkatan Kompetensi Guru untuk pengembangan diri melalui kebiasaan refleksi
04.06.25|PTK|Pengembangan profesi guru dan tenaga kependidikan|Peningkatan Kompetensi Guru untuk pembelajaran berorientasi pada peserta didik
04.06.26|PTK|Pengembangan profesi guru dan tenaga kependidikan|Peningkatan Kompetensi Guru untuk memahami kematangan moral, emosi, dan spiritual untuk berperilaku sesuai kode etik guru
04.06.27|PTK|Pengembangan profesi guru dan tenaga kependidikan|Peningkatan Kompetensi Guru untuk asesmen, umpan balik dan pelaporan yang berpusat pada peserta didik
04.06.31|PTK|Pengembangan profesi guru dan tenaga kependidikan|Peningkatan Kompetensi Guru untuk Pemahaman Profil Pelajar Pancasila: Bertakwa Kepada Tuhan YME dan Berakhlak Mulia
04.06.32|PTK|Pengembangan profesi guru dan tenaga kependidikan|Peningkatan Kompetensi Guru untuk Pemahaman Profil Pelajar Pancasila: Gotong Royong
04.06.33|PTK|Pengembangan profesi guru dan tenaga kependidikan|Peningkatan Kompetensi Guru untuk Pemahaman Profil Pelajar Pancasila: Kreativitas
04.06.34|PTK|Pengembangan profesi guru dan tenaga kependidikan|Peningkatan Kompetensi Guru untuk Pemahaman Profil Pelajar Pancasila: Nalar Kritis
04.06.35|PTK|Pengembangan profesi guru dan tenaga kependidikan|Peningkatan Kompetensi Guru untuk Pemahaman Profil Pelajar Pancasila: Kebinekaan Global
04.06.36|PTK|Pengembangan profesi guru dan tenaga kependidikan|Peningkatan Kompetensi Guru untuk Pemahaman Profil Pelajar Pancasila: Kemandirian
04.06.41|PTK|Pengembangan profesi guru dan tenaga kependidikan|Peningkatan Kompetensi Guru untuk memahami tentang perundungan, kekerasan, dan kekerasan seksual
04.06.42|PTK|Pengembangan profesi guru dan tenaga kependidikan|Peningkatan Kompetensi Guru untuk memahami tentang disiplin positif (dan menghindari hukuman fisik)
04.06.43|PTK|Pengembangan profesi guru dan tenaga kependidikan|Peningkatan Kompetensi Guru untuk memahami penyalahgunaan narkotika, psikotropika, zat adiktif (narkoba), minuman keras, merokok, dan HIV AIDS
04.06.44|PTK|Pengembangan profesi guru dan tenaga kependidikan|Peningkatan Kompetensi Guru untuk memahami toleransi/kesetaraan/moderasi beragama dan budaya
04.06.45|PTK|Pengembangan profesi guru dan tenaga kependidikan|Peningkatan Kompetensi Guru untuk memahami komitmen dan nilai-nilai kebangsaan
04.06.46|PTK|Pengembangan profesi guru dan tenaga kependidikan|Peningkatan Kompetensi Guru untuk memahami sikap inklusif, toleran, dan kesetaraan gender (termasuk pendidikan inklusif/disabilitas)
05.02.01|Sarpras|Pengembangan Perpustakaan|Pemeliharaan buku/koleksi perpustakaan
05.02.02|Sarpras|Pengembangan Perpustakaan|Pengadaan buku/koleksi perpustakaan (selain buku teks, pengayaan, dan referensi)
05.02.03|Sarpras|Pengembangan Perpustakaan|Pengadaan Buku Teks Utama/Pendamping Peserta Didik
05.02.04|Sarpras|Pengembangan Perpustakaan|Pengadaan Buku Teks Utama/Pendamping Guru
05.02.05|Sarpras|Pengembangan Perpustakaan|Pengadaan buku pengayaan dan referensi
05.05.01|Sarpras|Pelaksanaan administrasi kegiatan sekolah|Penyediaan atau pembuatan media pembelajaran
05.05.02|Sarpras|Pelaksanaan administrasi kegiatan sekolah|Pengembangan sekolah sehat, sekolah aman, sekolah ramah anak, sekolah inklusi, sekolah adiwiyata dan sejenisnya
05.08.01|Sarpras|Pemeliharaan Sarana dan Prasarana Sekolah|Pemeliharaan Prasarana Lahan, Bangunan dan Ruang
05.08.02|Sarpras|Pemeliharaan Sarana dan Prasarana Sekolah|Pengadaan Peralatan Sekolah di luar komponen penyediaan alat multimedia pembelajaran
05.08.03|Sarpras|Pemeliharaan Sarana dan Prasarana Sekolah|Pemeliharaan Peralatan Sekolah
05.08.04|Sarpras|Pemeliharaan Sarana dan Prasarana Sekolah|Pengadaan Perlengkapan Sekolah di luar komponen penyediaan alat multimedia pembelajaran
05.08.05|Sarpras|Pemeliharaan Sarana dan Prasarana Sekolah|Pemeliharaan Perlengkapan Sekolah
05.08.06|Sarpras|Pemeliharaan Sarana dan Prasarana Sekolah|Penyediaan prasarana akses/fasilitas bagi Peserta Didik Penyandang Disabilitas
05.08.07|—|Pemeliharaan Sarana dan Prasarana Sekolah|Pengadaan Peralatan untuk menunjang pembelajaran Peserta Didik Penyandang Disabilitas
05.08.08|—|Pemeliharaan Sarana dan Prasarana Sekolah|Pengadaan Sarana Perlengkapan untuk mendukung Peserta Didik Disabilitas
05.08.09|Sarpras|Pemeliharaan Sarana dan Prasarana Sekolah|Pengadaan Perlengkapan Daya dan Jasa Sekolah (instalasi air, listrik, telepon, internet, termasuk genset/panel surya)
05.08.10|Sarpras|Pemeliharaan Sarana dan Prasarana Sekolah|Pemeliharaan Perlengkapan Daya dan Jasa Sekolah (instalasi air, listrik, internet, termasuk genset/panel surya)
05.08.11|Sarpras|Pemeliharaan Sarana dan Prasarana Sekolah|Pengadaan seragam untuk peserta didik, pendidik, dan tenaga kependidikan yang menjadi inventaris sekolah
05.08.12|Sarpras|Pemeliharaan Sarana dan Prasarana Sekolah|Tindakan tanggap darurat dampak bencana (tidak termasuk perbaikan setelah lewat tanggap darurat)
05.09.01|Sarpras|Penyediaan alat multimedia pembelajaran|Pengadaan Komputer Desktop/Work-station untuk Pembelajaran, Administrasi dan Perpustakaan
05.09.02|Sarpras|Penyediaan alat multimedia pembelajaran|Pengadaan Komputer Laptop, Notebook untuk Pembelajaran, Administrasi dan Perpustakaan
05.09.04|Sarpras|Penyediaan alat multimedia pembelajaran|Pengadaan Printer, Printer+Scanner, dan Scanner
05.09.05|Sarpras|Penyediaan alat multimedia pembelajaran|Pengadaan Proyektor, Layar Proyektor, dan Layar LCD/LED ≥ 32"
06.05.01|Pengelolaan|Pelaksanaan administrasi kegiatan sekolah|Penyusunan perencanaan program satuan pendidikan (Visi Misi Sekolah, RKJM, RKT, RKAS)
06.05.02|Pengelolaan|Pelaksanaan administrasi kegiatan sekolah|Pengembangan dan Pelaksanaan Program Kerja Kepala Sekolah
06.05.03|Pengelolaan|Pelaksanaan administrasi kegiatan sekolah|Pendataan Dapodik
06.05.04|Pengelolaan|Pelaksanaan administrasi kegiatan sekolah|Pelaksanaan Monitoring Program/Kegiatan Sekolah
06.05.05|Pengelolaan|Pelaksanaan administrasi kegiatan sekolah|Pelaksanaan Supervisi Administrasi Tata Usaha
06.05.06|Pengelolaan|Pelaksanaan administrasi kegiatan sekolah|Konsumsi Rapat Kedinasan dan Tamu Sekolah (di luar kegiatan lain)
06.05.07|Pengelolaan|Pelaksanaan administrasi kegiatan sekolah|Pengadaan Bahan Pembelajaran dan Praktik (termasuk Kejuruan/Bengkel)
06.05.08|Pengelolaan|Pelaksanaan administrasi kegiatan sekolah|Pembelian Bahan Habis Pakai untuk mendukung pembelajaran dan administrasi sekolah (termasuk ATK, Tinta Printer, Kabel Ekstension, dsb)
06.05.09|Pengelolaan|Pelaksanaan administrasi kegiatan sekolah|Pembelian bahan habis pakai/alat penunjang kebersihan dan sanitasi sekolah
06.05.10|Pengelolaan|Pelaksanaan administrasi kegiatan sekolah|Pembelian Bahan Habis Pakai (termasuk Suku Cadang Alat) untuk Kegiatan Rumah Tangga Sekolah
06.05.11|Pengelolaan|Pelaksanaan administrasi kegiatan sekolah|Pengelolaan dan operasional rutin sekolah dalam pembelajaran jarak jauh
06.05.12|Pengelolaan|Pelaksanaan administrasi kegiatan sekolah|Pengembangan dan pemeliharaan Website Sekolah (termasuk media sosial sekolah)
06.05.13|Pengelolaan|Pelaksanaan administrasi kegiatan sekolah|Pengembangan Sistem Informasi untuk menunjang Manajemen Sekolah
06.05.14|Pengelolaan|Pelaksanaan administrasi kegiatan sekolah|Transportasi atau perjalanan dinas dalam rangka koordinasi dan pelaporan ke Dinas Pendidikan
06.06.01|Pengelolaan|Pengembangan profesi guru dan tenaga kependidikan|Kegiatan kerjasama dengan sekolah bertaraf internasional untuk peningkatan kompetensi guru
06.07.01|Pengelolaan|Pembiayaan langganan daya dan jasa|Pembayaran daya listrik
06.07.02|Pengelolaan|Pembiayaan langganan daya dan jasa|Penambahan daya listrik
06.07.03|Pengelolaan|Pembiayaan langganan daya dan jasa|Pembayaran langganan air
06.07.04|Pengelolaan|Pembiayaan langganan daya dan jasa|Pembayaran biaya telepon
06.07.05|Pengelolaan|Pembiayaan langganan daya dan jasa|Pembayaran jasa internet
06.07.06|Pengelolaan|Pembiayaan langganan daya dan jasa|Penambahan daya internet
06.07.07|Pengelolaan|Pembiayaan langganan daya dan jasa|Pembelian Bahan Bakar Minyak/Gas untuk keperluan pembelajaran/RT Sekolah
06.07.08|Pengelolaan|Pembiayaan langganan daya dan jasa|Pembayaran Retribusi keamanan dan sampah
06.07.09|Pengelolaan|Pembiayaan langganan daya dan jasa|Pembayaran langganan koran dan majalah
06.07.10|Pengelolaan|Pembiayaan langganan daya dan jasa|Sewa genset
06.07.12|Pengelolaan|Pembiayaan langganan daya dan jasa|Belanja Sewa Rumah/Gedung/Gudang/Parkir/Tanah (di luar bangunan utama sekolah, kecuali untuk Sekolah Swasta)
07.05.01|Pembiayaan|Pelaksanaan administrasi kegiatan sekolah|Bea materai, administrasi bank
07.05.02|Pembiayaan|Pelaksanaan administrasi kegiatan sekolah|Penggandaan laporan dan/atau surat-menyurat
07.05.03|Pembiayaan|Pelaksanaan administrasi kegiatan sekolah|Penyelenggaraan sosialisasi dan pelaporan program, kegiatan hasil-hasil, dan pengelolaan keuangan sekolah
07.05.04|Pembiayaan|Pelaksanaan administrasi kegiatan sekolah|Penyelenggaraan kegiatan inventarisasi dan pendokumentasian nilai aset semua sarpras sekolah pada tahun berjalan
07.05.05|Pembiayaan|Pelaksanaan administrasi kegiatan sekolah|Penggalangan, pengelolaan dan pelaporan pendanaan dari pihak ketiga (masyarakat umum, dunia industri, dan CSR)
07.05.06|Pembiayaan|Pelaksanaan administrasi kegiatan sekolah|Perjalanan dinas dalam rangka mengambil dana BOS di Bank (untuk sekolah terpencil)
07.10.01|Pembiayaan|Penyelenggaraan kegiatan peningkatan kompetensi keahlian|Kegiatan pemagangan guru dan/atau Peserta Didik di industri
07.10.02|—|Penyelenggaraan kegiatan peningkatan kompetensi keahlian|Penyelenggaraan praktik kerja industri atau lapangan bagi Peserta Didik SMK atau SMALB
07.10.03|Pembiayaan|Penyelenggaraan kegiatan peningkatan kompetensi keahlian|Penyelenggaraan kegiatan uji kompetensi kemampuan bahasa asing (termasuk bahasa Inggris)
07.10.04|Pembiayaan|Penyelenggaraan kegiatan peningkatan kompetensi keahlian|Penyelenggaraan Lembaga Sertifikasi Profesi Pihak Pertama
07.10.05|Pembiayaan|Penyelenggaraan kegiatan peningkatan kompetensi keahlian|Penyelenggaraan kegiatan uji kompetensi keahlian, sertifikasi kejuruan Peserta Didik SMK atau SMALB
07.11.01|—|Penyelenggaraan kegiatan peningkatan kompetensi keahlian|Pengembangan Pembelajaran Teaching Factory
07.11.02|—|—|Penyelenggaraan Kegiatan Sertifikasi Kompetensi Peserta Didik
07.12.01|Pembiayaan|Pembayaran Honor|Pembayaran honor Guru/Pendidik
07.12.02|Pembiayaan|Pembayaran Honor|Pembayaran honor Tenaga Kependidikan (selain pendidik)
07.12.03|Pembiayaan|Pembayaran Honor|Pembayaran Honor tenaga administrasi
07.12.04|Pembiayaan|Pembayaran Honor|Pembayaran honor Tenaga Penunjang atau pelaksana
08.03.01|Penilaian|Pelaksanaan kegiatan pembelajaran dan ekstrakurikuler|Seleksi Siswa Program Bilingual
08.03.02|Penilaian|Pelaksanaan kegiatan pembelajaran dan ekstrakurikuler|Seleksi Peserta Didik Program Kelas Akselerasi
08.04.01|Penilaian|Pelaksanaan Kegiatan Asesmen dan Evaluasi Pembelajaran|Persiapan, uji coba, simulasi, dan pelaksanaan Asesmen Nasional
08.04.02|—|Pelaksanaan Kegiatan Asesmen dan Evaluasi Pembelajaran|Penyiapan dan Pelaksanaan Asesmen di Awal Pembelajaran
08.04.03|Penilaian|Pelaksanaan Kegiatan Asesmen dan Evaluasi Pembelajaran|Penyusunan kisi-kisi dan penyusunan soal penilaian formatif (ulangan harian)
08.04.04|Penilaian|Pelaksanaan Kegiatan Asesmen dan Evaluasi Pembelajaran|Pelaksanaan penilaian formatif (ulangan harian)
08.04.05|Penilaian|Pelaksanaan Kegiatan Asesmen dan Evaluasi Pembelajaran|Penyusunan kisi-kisi dan penyusunan soal penilaian sumatif (ulangan tengah semester/akhir semester/kenaikan kelas)
08.04.06|Penilaian|Pelaksanaan Kegiatan Asesmen dan Evaluasi Pembelajaran|Pelaksanaan penilaian sumatif (ulangan tengah semester/akhir semester/kenaikan kelas)
08.04.07|Penilaian|Pelaksanaan Kegiatan Asesmen dan Evaluasi Pembelajaran|Penyusunan Kisi-Kisi dan Penyusunan Soal Penilaian/Asesmen Sekolah (Akhir Sekolah)
08.04.08|Penilaian|Pelaksanaan Kegiatan Asesmen dan Evaluasi Pembelajaran|Penyiapan, Uji Coba, dan Pelaksanaan Penilaian/Asesmen Sekolah (Akhir Sekolah) — termasuk Asesmen Sekolah Berbasis Komputer
08.04.09|Penilaian|Pelaksanaan Kegiatan Asesmen dan Evaluasi Pembelajaran|Penyusunan Kriteria Kenaikan Kelas
08.04.10|Penilaian|Pelaksanaan Kegiatan Asesmen dan Evaluasi Pembelajaran|Penyusunan Kompetensi Ketuntasan Minimal
08.04.11|—|Pelaksanaan Kegiatan Asesmen dan Evaluasi Pembelajaran|Pengembangan Perangkat Asesmen Kejuruan
08.06.01|Penilaian|Pengembangan profesi guru dan tenaga kependidikan|Fasilitasi pengembangan kompetensi guru melalui diseminasi PSP (IHT, Pelatihan, Penugasan, Pengembangan Portofolio, Pelaksanaan P5, dan Workshop)`,

  // ── BOP PAUD Reguler — pembanding ──
  paud: `02.02.01|Standar Isi|Pengembangan perpustakaan dan/atau layanan pojok baca|Kegiatan pemberdayaan perpustakaan dan/atau layanan pojok baca terutama untuk pengembangan minat baca peserta didik
02.03.01|Standar Isi|Pelaksanaan kegiatan pembelajaran dan bermain|Penyusunan Kurikulum
03.01.01|Standar Proses|Penerimaan Peserta Didik Baru|Pelaksanaan Pendaftaran Peserta Didik Baru (PPDB)
03.01.02|Standar Proses|Penerimaan Peserta Didik Baru|Pendataan ulang bagi Peserta Didik lama
03.01.03|Standar Proses|Penerimaan Peserta Didik Baru|Pelaksanaan kegiatan orientasi bagi peserta didik baru dan orang tua yang bersifat akademik dan pengenalan lingkungan
03.03.01|Standar Proses|Pelaksanaan kegiatan pembelajaran dan bermain|Penyusunan Silabus / Tujuan Pembelajaran
03.03.10|Standar Proses|Pelaksanaan kegiatan pembelajaran dan bermain|Pengembangan program pencegahan dan penanganan kekerasan di satuan pendidikan (termasuk Program Roots)
03.03.11|Standar Proses|Pelaksanaan kegiatan pembelajaran dan bermain|Penerapan program pencegahan perundungan
03.03.18|Standar Proses|Pelaksanaan kegiatan pembelajaran dan bermain|Pengayaan TIK untuk memfasilitasi kegiatan pembelajaran
03.03.19|Standar Proses|Pelaksanaan kegiatan pembelajaran dan bermain|Pelaksanaan Lomba-Lomba
03.03.20|Standar Proses|Pelaksanaan kegiatan pembelajaran dan bermain|Pelaksanaan Program-Program Satuan Pendidikan Lainnya
03.03.22|Standar Proses|Pelaksanaan kegiatan pembelajaran dan bermain|Penyelenggaraan Pembelajaran aktif, kreatif, efektif, dan nyaman
03.05.01|Standar Proses|Pelaksanaan administrasi kegiatan satuan pendidikan|Kegiatan koordinasi dan pelaporan untuk mendukung program prioritas pusat (Program Indonesia Pintar, BOSP, Sekolah Penggerak, dll.)
03.05.02|Standar Proses|Pelaksanaan administrasi kegiatan satuan pendidikan|Penyelenggaraan UKS, penyediaan alat peralatan UKS dan bahan/obat-obatan penunjang kesehatan satuan pendidikan
04.06.01|Standar Tenaga Kependidikan|Pengembangan profesi guru dan tenaga kependidikan|Pelaksanaan kegiatan komunitas belajar di satuan pendidikan
04.06.02|Standar Tenaga Kependidikan|Pengembangan profesi guru dan tenaga kependidikan|Kegiatan komunitas belajar antar satuan pendidikan (termasuk gugus, KKG, MGMP, MGMPS, MGMPK, KKKS, atau MKKS)
04.06.04|Standar Tenaga Kependidikan|Pengembangan profesi guru dan tenaga kependidikan|Pengembangan diri guru dan tenaga kependidikan materi lain melalui Ruang GTK
04.06.05|Standar Tenaga Kependidikan|Pengembangan profesi guru dan tenaga kependidikan|Peningkatan Kompetensi Guru
04.06.06|Standar Tenaga Kependidikan|Pengembangan profesi guru dan tenaga kependidikan|Peningkatan Kompetensi Kepala Satuan Pendidikan
04.06.07|Standar Tenaga Kependidikan|Pengembangan profesi guru dan tenaga kependidikan|Pembinaan dan Peningkatan Kompetensi Tenaga Pelaksana Satuan Pendidikan (Tenaga Ekstrakurikuler, TU, Laboratorium, Perpustakaan, dan UKS)
04.06.11|Standar Tenaga Kependidikan|Pengembangan profesi guru dan tenaga kependidikan|Peningkatan Kompetensi Guru untuk keterlibatan orangtua/wali dan masyarakat dalam pembelajaran
04.06.14|Standar Tenaga Kependidikan|Pengembangan profesi guru dan tenaga kependidikan|Peningkatan Kompetensi Guru untuk memperkuat literasi
04.06.22|Standar Tenaga Kependidikan|Pengembangan profesi guru dan tenaga kependidikan|Peningkatan Kompetensi Guru untuk memahami konten pembelajaran dan cara mengajarkannya
04.06.24|Standar Tenaga Kependidikan|Pengembangan profesi guru dan tenaga kependidikan|Peningkatan Kompetensi Guru untuk pengembangan diri melalui kebiasaan refleksi
05.02.03|Standar Sarana dan Prasarana|Pengembangan perpustakaan dan/atau layanan pojok baca|Pengadaan Buku Teks Utama/Pendamping Peserta Didik
05.05.01|Standar Sarana dan Prasarana|Pelaksanaan administrasi kegiatan satuan pendidikan|Penyediaan atau pembuatan media pembelajaran selain APE
05.08.01|Standar Sarana dan Prasarana|Pemeliharaan sarana dan prasarana Satuan Pendidikan|Pemeliharaan Prasarana Lahan, Bangunan dan Ruang
05.08.04|Standar Sarana dan Prasarana|Pemeliharaan sarana dan prasarana Satuan Pendidikan|Pengadaan Perlengkapan Satuan Pendidikan selain alat multimedia pembelajaran
05.08.05|Standar Sarana dan Prasarana|Pemeliharaan sarana dan prasarana Satuan Pendidikan|Pemeliharaan Perlengkapan Satuan Pendidikan
05.08.06|Standar Sarana dan Prasarana|Pemeliharaan sarana dan prasarana Satuan Pendidikan|Penyediaan prasarana akses/fasilitas bagi Peserta Didik Penyandang Disabilitas
05.08.07|Standar Sarana dan Prasarana|Pemeliharaan Sarana dan Prasarana Sekolah|Pengadaan peralatan untuk menunjang pembelajaran peserta didik penyandang disabilitas
05.08.08|Standar Sarana dan Prasarana|Pemeliharaan Sarana dan Prasarana Sekolah|Pengadaan sarana perlengkapan untuk mendukung peserta didik disabilitas
05.08.09|Standar Sarana dan Prasarana|Pemeliharaan sarana dan prasarana Satuan Pendidikan|Pengadaan Perlengkapan Daya dan Jasa Satuan Pendidikan (instalasi air, listrik, telepon, internet, termasuk genset/panel surya)
05.08.10|Standar Sarana dan Prasarana|Pemeliharaan sarana dan prasarana Satuan Pendidikan|Pemeliharaan Perlengkapan Daya dan Jasa Satuan Pendidikan (instalasi air, listrik, internet, termasuk genset/panel surya)
05.08.11|Standar Sarana dan Prasarana|Pemeliharaan sarana dan prasarana Satuan Pendidikan|Pengadaan Alat Permainan Edukatif (APE)
05.08.12|Standar Sarana dan Prasarana|Pemeliharaan sarana dan prasarana Satuan Pendidikan|Pemeliharaan/perbaikan Alat Permainan Edukatif (APE)
06.05.01|Standar Pengelolaan|Pelaksanaan administrasi kegiatan satuan pendidikan|Penyusunan perencanaan program satuan pendidikan (Visi Misi Sekolah, RKJM, RKT, RKAS)
06.05.01|Standar Pengelolaan|Pelaksanaan administrasi kegiatan satuan pendidikan|Kegiatan pertemuan orang tua/wali (termasuk parenting)
06.05.10|Standar Pengelolaan|Pelaksanaan administrasi kegiatan satuan pendidikan|Pembelian Bahan Habis Pakai (termasuk Suku Cadang Alat) untuk Kegiatan Rumah Tangga Satuan Pendidikan
06.07.01|Standar Pengelolaan|Pembiayaan langganan daya dan jasa|Pembayaran daya listrik
06.07.02|Standar Pengelolaan|Pembiayaan langganan daya dan jasa|Penambahan daya listrik
06.07.03|Standar Pengelolaan|Pembiayaan langganan daya dan jasa|Pembayaran langganan air
06.07.04|Standar Pengelolaan|Pembiayaan langganan daya dan jasa|Pembayaran biaya telepon
06.07.05|Standar Pengelolaan|Pembiayaan langganan daya dan jasa|Pembayaran jasa internet
06.07.10|Standar Pengelolaan|Pembiayaan langganan daya dan jasa|Sewa genset
07.05.03|Standar Pembiayaan|Pelaksanaan evaluasi/asesmen pembelajaran dan bermain|Penyediaan laporan capaian tingkat perkembangan anak
07.05.06|Standar Pembiayaan|Pelaksanaan administrasi kegiatan satuan pendidikan|Biaya perjalanan dinas dalam rangka menunjang program prioritas nasional (PIP, BOS, dll)
07.09.01|Standar Pembiayaan|Penyelenggaraan kegiatan kesehatan, gizi, dan kebersihan|Penyediaan Makanan Tambahan Anak
07.12.01|Standar Pembiayaan|Pembayaran Honor|Pembayaran honor Guru/Pendidik
07.12.03|Standar Pembiayaan|Pembayaran Honor|Pembayaran Honor tenaga administrasi
08.04.02|Standar Penilaian|Pelaksanaan evaluasi/asesmen pembelajaran dan bermain|Pelaksanaan refleksi pembelajaran termasuk survei lingkungan belajar`,
};
const bspUrai = (teks) => teks.split("\n").map((l) => { const [kode, snp, komponen, uraian] = l.split("|"); return { kode, snp, komponen, uraian }; });
const BSP_KEG = bspUrai(BSP_REF.kesetaraan);

// Program Kegiatan (Standar Nasional Pendidikan) dari 2 angka pertama kode — warna mengikuti ARKAS
const BSP_PROGRAM = {
  "01": ["Pengembangan Standar Kompetensi Lulusan", "#fde2e4"],
  "02": ["Pengembangan Standar Isi", "#e0f2fe"],
  "03": ["Pengembangan Standar Proses", "#dcfce7"],
  "04": ["Pengembangan Pendidik dan Tenaga Kependidikan", "#fef3c7"],
  "05": ["Pengembangan Sarana dan Prasarana Sekolah", "#ede9fe"],
  "06": ["Pengembangan Standar Pengelolaan", "#ffedd5"],
  "07": ["Pengembangan Standar Pembiayaan", "#fce7f3"],
  "08": ["Pengembangan dan Implementasi Sistem Penilaian", "#e0e7ff"],
};
const bspProgram = (kode) => BSP_PROGRAM[String(kode || "").slice(0, 2)] || ["Program Lainnya", "#f1f5f9"];

// Aturan Juknis BOSP 2026 untuk BOP Kesetaraan Reguler (Permendikdasmen 8/2026 Pasal 48 + panduan ARKAS 4)
const BSP_ATURAN = {
  honor: { maks: 40, kode: ["07.12.01", "07.12.02", "07.12.03", "07.12.04"], label: "Belanja Honor", ket: "Paling banyak 40% dari total pagu (Pasal 48 ayat 4). Dihitung dari kegiatan Pembayaran Honor (07.12.xx) dengan rekening Belanja Jasa Tenaga Pendidikan." },
  buku: { min: 10, kode: ["05.02.03", "05.02.04", "05.02.05", "05.02.06"], label: "Buku (Pengembangan Perpustakaan)", ket: "Paling sedikit 10% dari total pagu untuk penyediaan buku (Pasal 48 ayat 2). Kode Kesetaraan: 05.02.03, 05.02.04, 05.02.05, 05.02.06." },
  sarpras: { maks: 20, kode: ["05.08.01", "05.08.03", "05.08.05", "05.08.06", "05.08.08", "05.08.09", "05.08.10", "05.08.12"], label: "Pemeliharaan Sarana & Prasarana", ket: "Paling banyak 20% dari total pagu (Pasal 48 ayat 3)." },
};

// Rekening belanja — 3 kategori resmi ARKAS. Nama rekening di bawah adalah yang umum dipakai di ARKAS;
// KODE rekening lengkap diisi Bendahara/Admin ARKAS (mengikuti daftar di aplikasi ARKAS yang dimutakhirkan Dinas).
// Kode yang tercantum resmi di laman Kemendikdasmen: 5.1.02.02.01.0013 (honor) & 5.2.02.05.02.0001 (modal mebel).
// Kode 0026, 0027, 0029, 0030, 0063 dan 5.1.02.01.01.0052 diambil dari cetakan ARKAS PKBM Al-Umm sendiri
// (Rincian Kertas Kerja Perbulan, Januari 2026).
const BSP_REK = [
  { jenis: "pegawai", nama: "Belanja Jasa Tenaga Pendidikan (Honorarium Guru/Tutor)", kode: "5.1.02.02.01.0013" },
  { jenis: "barang", nama: "Belanja Jasa Tenaga Administrasi", kode: "5.1.02.02.01.0026" },
  { jenis: "barang", nama: "Belanja Jasa Tenaga Kebersihan", kode: "5.1.02.02.01.0030" }
  ,{ jenis: "barang", nama: "Belanja Jasa Tenaga Operator (Upah Operator Teknis Aplikasi/Dapodik)", kode: "5.1.02.02.01.0027" }
  ,{ jenis: "barang", nama: "Upah Tutor (Ekstrakurikuler/Kegiatan)", kode: "5.1.02.02.01.0029" },
  { jenis: "barang", nama: "Belanja Jasa Tenaga Keamanan" },
  { jenis: "barang", nama: "Honorarium Narasumber / Pembahas / Moderator / Panitia" },
  { jenis: "barang", nama: "Belanja Alat/Bahan untuk Kegiatan Kantor - Alat Tulis Kantor" },
  { jenis: "barang", nama: "Belanja Alat/Bahan untuk Kegiatan Kantor - Kertas dan Cover" },
  { jenis: "barang", nama: "Belanja Alat/Bahan untuk Kegiatan Kantor - Bahan Cetak" },
  { jenis: "barang", nama: "Belanja Alat/Bahan untuk Kegiatan Kantor - Bahan Komputer" },
  { jenis: "barang", nama: "Belanja Alat/Bahan untuk Kegiatan Kantor - Perabot Kantor" },
  { jenis: "barang", nama: "Belanja Alat/Bahan untuk Kegiatan Kantor - Alat Listrik" },
  { jenis: "barang", nama: "Belanja Alat/Bahan untuk Kegiatan Kantor - Perlengkapan Pendukung Olahraga" },
  { jenis: "barang", nama: "Belanja Alat/Bahan untuk Kegiatan Kantor Lainnya" },
  { jenis: "barang", nama: "Belanja Bahan Praktik / Bahan Pendukung Pembelajaran" },
  { jenis: "barang", nama: "Belanja Bahan Kebersihan dan Sanitasi" },
  { jenis: "barang", nama: "Belanja Obat-Obatan dan Bahan Kesehatan" },
  { jenis: "barang", nama: "Belanja Makanan dan Minuman Rapat", kode: "5.1.02.01.01.0052" },
  { jenis: "barang", nama: "Belanja Makanan dan Minuman Jamuan Tamu" },
  { jenis: "barang", nama: "Belanja Makanan dan Minuman pada Fasilitas Pelayanan Urusan Pendidikan" },
  { jenis: "barang", nama: "Belanja Makanan dan Minuman Aktivitas Lapangan" },
  { jenis: "barang", nama: "Belanja Pakaian / Seragam" },
  { jenis: "barang", nama: "Belanja Cetak" },
  { jenis: "barang", nama: "Belanja Penggandaan / Fotokopi" },
  { jenis: "barang", nama: "Belanja Tagihan Listrik" },
  { jenis: "barang", nama: "Belanja Tagihan Air" },
  { jenis: "barang", nama: "Belanja Tagihan Telepon" },
  { jenis: "barang", nama: "Belanja Kawat/Faksimili/Internet/TV Berlangganan", kode: "5.1.02.02.01.0063" },
  { jenis: "barang", nama: "Belanja Paket/Pengiriman" },
  { jenis: "barang", nama: "Belanja Sewa Gedung/Kantor/Tempat" },
  { jenis: "barang", nama: "Belanja Sewa Kendaraan" },
  { jenis: "barang", nama: "Belanja Kursus Singkat / Pelatihan" },
  { jenis: "barang", nama: "Belanja Sosialisasi" },
  { jenis: "barang", nama: "Belanja Perjalanan Dinas" },
  { jenis: "barang", nama: "Belanja Pemeliharaan Bangunan Gedung Tempat Pendidikan" },
  { jenis: "barang", nama: "Belanja Pemeliharaan Alat Kantor dan Rumah Tangga" },
  { jenis: "barang", nama: "Belanja Pemeliharaan Komputer" },
  { jenis: "barang", nama: "Belanja Pemeliharaan Mebel" },
  { jenis: "barang", nama: "Belanja Meterai / Administrasi Bank" },
  { jenis: "barang", nama: "Belanja Langganan Platform / Aplikasi Pembelajaran" },
  { jenis: "modal", nama: "Belanja Modal Mebel", kode: "5.2.02.05.02.0001" },
  { jenis: "modal", nama: "Belanja Modal Komputer Unit / Personal Computer" },
  { jenis: "modal", nama: "Belanja Modal Laptop / Notebook" },
  { jenis: "modal", nama: "Belanja Modal Printer / Scanner (Peralatan Personal Komputer)" },
  { jenis: "modal", nama: "Belanja Modal LCD Proyektor / Layar" },
  { jenis: "modal", nama: "Belanja Modal Alat Peraga / Alat Praktik Pembelajaran" },
  { jenis: "modal", nama: "Belanja Modal Alat Olahraga / Alat Kesenian" },
  { jenis: "modal", nama: "Belanja Modal Buku Teks / Bahan Perpustakaan" },
  { jenis: "modal", nama: "Belanja Modal Peralatan dan Mesin Lainnya" },
];
const BSP_JENIS = { pegawai: ["Belanja Pegawai", "#0ea5e9"], barang: ["Belanja Barang/Jasa", "#22c55e"], modal: ["Belanja Modal", "#a855f7"] };
// Kegiatan yang barangnya menjadi ASET → wajib Belanja Modal & dicatat di buku inventaris
const BSP_KODE_ASET = ["05.08.02", "05.08.04", "05.08.07", "05.08.08", "05.08.11", "05.09.01", "05.09.02", "05.09.04", "05.09.05"];
const BSP_SATUAN = ["Paket", "Buah", "Unit", "Orang", "Orang/Bulan", "OK (Orang Kegiatan)", "OH (Orang Hari)", "Kegiatan", "Bulan", "Tahun", "Eksemplar", "Set", "Rim", "Box", "Lembar", "Liter", "Meter", "Kotak", "Dus", "Bungkus", "Kali"];
const BSP_BULAN = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

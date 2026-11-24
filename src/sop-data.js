// ============================================================
//  SOP BAWAAN PKBM AL-UMM BARABAI — isi awal SOP Induk (disepakati Kepala PKBM, Nov 2026).
//  Setelah Kepala PKBM menyimpan perubahan di Pengelola → SOP Induk, isi di database yang dipakai.
//  Setiap jabatan: bagian (uraian tugas) + rutin [frekuensi, tugas] = butir Ceklis Tugas PJ.
//  frekuensi: harian | pekanan | bulanan | semesteran | tahunan | jadwal (sesuai jadwal)
// ============================================================
const SOP_BAWAAN = {
  versi: "2026-11-24",
  urut: ["kepala", "sekretaris", "dapodik", "bendahara", "arkas", "peny", "admin", "bendjenjang", "tutor", "walikelas", "musyrif"],
  jabatan: {
    kepala: { nama: "Kepala PKBM", tingkat: "pkbm", ikon: "🏛️",
      ringkas: "Bertanggung jawab atas seluruh penyelenggaraan lembaga dan memastikan setiap bagian menjalankan tugasnya.",
      bagian: [
        ["Pemantauan kegiatan tiap jenjang", ["Memeriksa laporan harian, pekanan, bulanan, dan semesteran jenjang yang sudah dirangkum Sekretaris.", "Memantau kehadiran dan kinerja tutor serta kehadiran dan keaktifan peserta didik.", "Mengawasi pembelajaran Paket A, B, dan C: kurikulum, jadwal, perangkat ajar, asesmen, hasil belajar.", "Melakukan supervisi dan evaluasi proses pembelajaran.", "Memantau santri wajib TKA sudah mengikuti TKA."]],
        ["Data siswa dan guru", ["Memperhatikan jumlah siswa dan guru aktif tiap jenjang.", "Memantau guru penerima Honda dan non-Honda.", "Menanyakan insentif guru tertentu kepada Penyelenggara atau Bendahara jenjang.", "Memastikan Dapodik dimutakhirkan oleh Admin Dapodik."]],
        ["Keuangan dan anggaran", ["Memantau penyusunan Draft RKAS tiap jenjang.", "Memantau realisasi BOSP tiap jenjang melalui Penyelenggara.", "Menandai masalah sebagai PR PKBM untuk ditindaklanjuti dan dievaluasi.", "Menyetujui penerimaan, pengeluaran, dan perubahan anggaran sesuai kewenangan.", "Memastikan dana dikelola transparan, akuntabel, dan sesuai peruntukan."]],
        ["Kelembagaan dan kemitraan", ["Menjadwalkan dan menghadiri kegiatan atas nama PKBM.", "Menjalin hubungan dengan Dinas, instansi, orang tua/wali, dan mitra.", "Mengawasi legalitas, perizinan, surat-menyurat, dan arsip lembaga.", "Mengoordinasikan persiapan dan tindak lanjut akreditasi.", "Menyusun visi, misi, program kerja, dan laporan pertanggungjawaban."]],
      ],
      rutin: [["harian", "Memantau pembelajaran, operasional, kehadiran, dan laporan harian jenjang"], ["pekanan", "Mengevaluasi kehadiran, menindaklanjuti kendala, memeriksa PR PKBM"], ["bulanan", "Mengevaluasi program, laporan bulanan, realisasi BOSP, dan kinerja tenaga pendidik"], ["semesteran", "Mengevaluasi hasil belajar, kinerja tutor, dan program tiap jenjang"], ["tahunan", "Menyusun program kerja, laporan pertanggungjawaban, dan rencana pengembangan"]] },
    sekretaris: { nama: "Sekretaris PKBM", tingkat: "pkbm", ikon: "🗂️",
      ringkas: "Membantu Kepala dalam administrasi, persuratan, rapat, dan arsip; pintu masuk laporan berkala jenjang.",
      bagian: [
        ["Persuratan dan arsip", ["Mencatat dan mendistribusikan surat masuk.", "Membuat nomor surat keluar dan mencatatnya di buku agenda.", "Menyusun konsep surat, undangan, dan pemberitahuan.", "Mengelola arsip fisik dan digital.", "Mengelola dokumen legalitas dan mengingatkan masa berlakunya.", "Menjaga keamanan dan kerahasiaan dokumen."]],
        ["Rapat dan kegiatan", ["Menyiapkan undangan, administrasi, dan daftar hadir rapat.", "Membuat notulen paling lambat 1×24 jam (boleh dari tempelan WA atau foto buku).", "Menyampaikan hasil rapat kepada pihak terkait.", "Mencatat PR PKBM dari pembicaraan langsung atau kunjungan."]],
        ["Administrasi pendidik", ["Mengarsipkan SK pengangkatan dan pembagian tugas.", "Memeriksa kelengkapan Data Guru dan mengingatkan Admin jenjang.", "Membuat rekap bulanan kehadiran tutor tingkat PKBM."]],
        ["Pelaporan dan pemantauan", ["Mengumpulkan laporan berkala jenjang, memeriksa kelengkapan, lalu merangkumnya untuk Kepala.", "Memantau inventaris tiap jenjang dan melaporkannya ke Kepala.", "Membantu laporan kelembagaan dan dokumen akreditasi."]],
      ],
      rutin: [["harian", "Memeriksa surat masuk/keluar dan menerima laporan harian jenjang"], ["pekanan", "Memeriksa arsip, merangkum laporan pekanan, menyiapkan administrasi rapat"], ["bulanan", "Merekap kehadiran tutor, memperbarui data administrasi, memantau inventaris"], ["tahunan", "Menata arsip tahunan, membantu LPJ dan akreditasi"]] },
    dapodik: { nama: "Admin Dapodik", tingkat: "pkbm", ikon: "🧾",
      ringkas: "Memastikan data Dapodik lengkap, benar, dan cocok dengan data aplikasi serta dokumen resmi.",
      bagian: [
        ["Pengelolaan data Dapodik", ["Menginput dan memutakhirkan data sekolah, peserta didik, PTK, rombel, pembelajaran, dan sarpras.", "Mencocokkan Dapodik dengan Data Siswa dan Data Guru aplikasi.", "Sinkronisasi sesuai jadwal resmi."]],
        ["Validasi dan verifikasi", ["Memeriksa NIK, NISN, No. KK, nama, tanggal lahir, dan nama ibu kandung.", "Mencari data invalid dan residu lalu memperbaikinya.", "Menyampaikan data yang salah ke Admin jenjang untuk diperbaiki di aplikasi."]],
        ["Peserta didik dan PTK", ["Menginput santri baru dan mutasi setelah disetujui Penyelenggara dan diisi Admin jenjang.", "Memperbarui status keaktifan santri.", "Menginput data PTK berdasarkan Data Guru dan SK."]],
        ["Pelaporan dan keamanan", ["Laporan bulanan kondisi data Dapodik untuk Kepala.", "Menyimpan bukti sinkronisasi.", "Menjaga kerahasiaan akun Dapodik."]],
      ],
      rutin: [["harian", "Memeriksa perubahan data dan memverifikasi dokumen yang diterima"], ["pekanan", "Memeriksa kelengkapan data santri, tutor, rombel, dan pembelajaran"], ["bulanan", "Mengevaluasi data dan melaporkan perkembangannya ke Kepala"], ["jadwal", "Validasi dan sinkronisasi sesuai jadwal pemutakhiran"]] },
    bendahara: { nama: "Bendahara PKBM", tingkat: "pkbm", ikon: "💰",
      ringkas: "Mengelola keuangan tingkat lembaga: verifikasi keuangan jenjang, dana BOSP, dan laporan pertanggungjawaban.",
      bagian: [
        ["Keuangan lembaga", ["Menyusun pembukuan keuangan PKBM.", "Mengeluarkan dana sesuai persetujuan Kepala.", "Memastikan setiap transaksi punya bukti sah."]],
        ["BOSP dan anggaran", ["Menetapkan pagu BOSP tiap jenjang dan mengatur Honor Pengelola.", "Memeriksa, mengembalikan, atau mengesahkan Kertas Kerja BOSP jenjang.", "Melaporkan kondisi keuangan dan sisa anggaran ke Kepala."]],
        ["Verifikasi jenjang", ["Memeriksa nota dan laporan realisasi Bendahara jenjang.", "Menandai realisasi Diperiksa atau Perlu Perbaikan.", "Merekap insentif yang sudah disetujui Penyelenggara."]],
        ["Pelaporan", ["Membuat BKU dan rekap transaksi.", "Menyusun laporan realisasi dan SPJ dana bantuan.", "Menyiapkan dokumen keuangan untuk pemeriksaan."]],
      ],
      rutin: [["harian", "Mencatat transaksi lembaga dan memeriksa nota dari jenjang"], ["pekanan", "Memeriksa pembukuan, saldo, dan bukti transaksi"], ["bulanan", "Menyusun laporan keuangan bulanan"], ["semesteran", "Mengevaluasi anggaran dan menyiapkan dokumen pertanggungjawaban"], ["tahunan", "Menyusun laporan keuangan tahunan dan menata arsip"]] },
    arkas: { nama: "Admin ARKAS", tingkat: "pkbm", ikon: "📒",
      ringkas: "Mengubah rencana yang disahkan menjadi anggaran resmi di ARKAS dan menjaga kesesuaian rencana dengan realisasi.",
      bagian: [
        ["Perencanaan & input", ["Mengumpulkan kebutuhan dari Draft RKAS dan Kertas Kerja BOSP jenjang.", "Memastikan rincian biaya, kode rekening, dan harga sesuai SSH.", "Menginput Kertas Kerja yang sudah disahkan ke ARKAS.", "Perubahan anggaran hanya dengan persetujuan Kepala.", "Menyimpan cetakan ARKAS di Arsip ARKAS aplikasi."]],
        ["Realisasi & pelaporan", ["Memperbarui realisasi di ARKAS berdasarkan bukti dari Bendahara.", "Menandai kegiatan yang belum terealisasi.", "Menyiapkan dokumen RKAS, laporan realisasi, dan pertanggungjawaban."]],
      ],
      rutin: [["harian", "Memeriksa kebutuhan penganggaran dan data kegiatan yang masuk"], ["pekanan", "Memeriksa kelengkapan perencanaan dan berkoordinasi soal realisasi"], ["bulanan", "Memantau realisasi dan kesesuaiannya dengan rencana"], ["jadwal", "Menyusun dan menginput RKAS sesuai jadwal penganggaran"]] },
    peny: { nama: "Penyelenggara Jenjang", tingkat: "jenjang", ikon: "🎓",
      ringkas: "Memimpin penyelenggaraan jenjang: pembelajaran, santri, tutor, anggaran jenjang, dan pelaporan.",
      bagian: [
        ["Pengelolaan program", ["Menyusun program kerja jenjang.", "Menyusun jadwal pelajaran bersama tutor (diinput Admin).", "Menyusun Kalender Akademik jenjang.", "Menyiapkan kurikulum, modul ajar, bank soal, dan jadwal ujian bersama Admin."]],
        ["Tutor", ["Menyetujui/menolak izin, sakit, dan tukar jam.", "Memantau kehadiran tutor dan jurnal (bila absensi sudah wajib).", "Supervisi kelas.", "Memeriksa dan menyetujui insentif dan slip gaji."]],
        ["Peserta didik", ["Menyetujui santri baru dan mutasi.", "Memantau kehadiran dan perkembangan santri.", "Membina kedisiplinan dan berkomunikasi dengan orang tua."]],
        ["Penilaian & anggaran", ["Mengoordinasikan ujian dan memeriksa rapor.", "Menyusun Draft RKAS dan Kertas Kerja BOSP bersama Admin.", "Memantau realisasi belanja jenjang."]],
        ["Pelaporan", ["Laporan pekanan (Sabtu 22.00), bulanan (tanggal 5), semesteran, tahunan ke Sekretaris.", "Mengusulkan PR PKBM.", "Mengisi dan memantau inventaris bersama Admin."]],
      ],
      rutin: [["harian", "Memantau pembelajaran dan memproses izin/tukar jam"], ["pekanan", "Mengevaluasi pembelajaran & kedisiplinan, kirim laporan pekanan (Sabtu 22.00)"], ["bulanan", "Menyetujui insentif, memantau realisasi, kirim laporan bulanan (tanggal 5)"], ["semesteran", "Memeriksa rapor, evaluasi hasil belajar dan tutor, kirim laporan semester"], ["tahunan", "Menyusun Draft RKAS dan rencana pengembangan jenjang"]] },
    admin: { nama: "Admin Jenjang", tingkat: "jenjang", ikon: "🖥️",
      ringkas: "Mengelola data dan fitur aplikasi jenjang supaya lengkap dan benar, serta menyusun laporan harian.",
      bagian: [
        ["Data", ["Mengisi Data Guru dan Data Siswa (siswa baru & mutasi setelah disetujui Penyelenggara).", "Memperbaiki data yang dilaporkan Admin Dapodik.", "Mengingatkan guru melengkapi data diri."]],
        ["Jadwal & absensi", ["Menginput jadwal dari Penyelenggara dan mengatur Bel Sekolah.", "Memantau absensi dan jurnal harian (bila absensi sudah wajib)."]],
        ["Pembelajaran & penilaian", ["Mengunggah kurikulum dan modul ajar (tutor hanya mengunduh).", "Mengelola bank soal, jadwal ujian, kop soal, dan sesi ujian.", "Mencetak rapor untuk diperiksa Penyelenggara."]],
        ["Lain-lain", ["Menyusun Draft RKAS/Kertas Kerja bersama Penyelenggara.", "Mengisi inventaris jenjang.", "Mengelola Snack Mingguan.", "Mengisi data calon santri saat PPDB.", "Melaporkan kendala aplikasi ke Tim IT."]],
      ],
      rutin: [["harian", "Memantau absensi & jurnal, kirim laporan harian (pukul 22.00)"], ["pekanan", "Memeriksa kelengkapan data, nilai, dan modul; mengurus snack mingguan"], ["bulanan", "Menyiapkan data laporan bulanan dan memperbarui inventaris"], ["semesteran", "Mencetak rapor dan menyiapkan ujian"], ["tahunan", "Menyiapkan data PPDB, kelas baru, dan jadwal tahun baru"]] },
    bendjenjang: { nama: "Bendahara Jenjang", tingkat: "jenjang", ikon: "💳",
      ringkas: "Mengurus belanja BOSP jenjang sesuai Draft RKAS, mengumpulkan bukti, melaporkan realisasi, dan menghitung insentif.",
      bagian: [
        ["Belanja & bukti", ["Berbelanja hanya sesuai Draft RKAS dan jadwal bulannya.", "Mengumpulkan nota/kuitansi dan foto kegiatan.", "Melaporkan realisasi di aplikasi (Draft RKAS → Realisasi).", "Memperbaiki laporan yang ditandai Perlu Perbaikan."]],
        ["Insentif & slip", ["Menghitung insentif tutor (dan musyrif) dari absensi, jurnal, dan ketentuan.", "Mengajukan ke Penyelenggara untuk disetujui.", "Membuat slip gaji dan menyampaikan rekap ke Bendahara PKBM."]],
      ],
      rutin: [["harian", "Menyimpan nota dan bukti setiap belanja"], ["pekanan", "Memeriksa kegiatan terjadwal bulan ini dan kelengkapan nota"], ["bulanan", "Melaporkan realisasi bulan itu dan menghitung insentif"], ["semesteran", "Mengevaluasi realisasi semester dan menata arsip bukti"], ["tahunan", "Membantu menyusun Draft RKAS tahun berikutnya"]] },
    tutor: { nama: "Tutor", tingkat: "jenjang", ikon: "👨‍🏫",
      ringkas: "Melaksanakan pembelajaran, mencatatnya di aplikasi, dan menilai hasil belajar santri.",
      bagian: [
        ["Mengajar", ["Mengunduh dan mempelajari modul ajar.", "Absen masuk dan pulang tiap sesi (bila absensi sudah wajib).", "Mengisi absensi santri dan jurnal kelas tiap sesi."]],
        ["Izin & jadwal", ["Mengajukan izin/sakit lewat aplikasi beserta tugas kelas.", "Mengajukan tukar/pindah jam dan menunggu persetujuan Penyelenggara."]],
        ["Penilaian & administrasi", ["Mengawasi ujian sesuai jadwal.", "Menginput nilai sebelum batas rapor.", "Melengkapi data diri di Profil Saya dan menjaga kerahasiaan akun."]],
      ],
      rutin: [["harian", "Absen, mengajar, mengisi absensi santri dan jurnal"], ["pekanan", "Memeriksa tugas santri dan menginput nilai harian"], ["bulanan", "Memastikan tidak ada jurnal atau nilai yang tertunda"], ["semesteran", "Mengawasi ujian dan menginput nilai rapor tepat waktu"]] },
    walikelas: { nama: "Wali Kelas", tingkat: "jenjang", ikon: "🧑‍🏫",
      ringkas: "Bertanggung jawab atas santri satu kelas: kehadiran, pembinaan, rapor, dan komunikasi dengan orang tua.",
      bagian: [
        ["Pembinaan & data", ["Memantau kehadiran santri kelasnya dan menindaklanjuti yang sering absen.", "Membina adab dan kedisiplinan.", "Memeriksa kelengkapan data santri kelasnya."]],
        ["Rapor & orang tua", ["Memastikan semua nilai mapel kelasnya sudah diinput.", "Mengisi catatan wali kelas, sikap, dan ekstrakurikuler.", "Membagikan rapor dan berkomunikasi dengan orang tua/wali."]],
      ],
      rutin: [["harian", "Memantau kehadiran santri kelasnya"], ["pekanan", "Menindaklanjuti santri yang sering absen atau bermasalah"], ["bulanan", "Memeriksa perkembangan belajar dan kelengkapan data kelas"], ["semesteran", "Mengecek nilai, mengisi catatan rapor, membagikan rapor"]] },
    musyrif: { nama: "Musyrif", tingkat: "jenjang", ikon: "🕌",
      ringkas: "Membina santri di asrama: ibadah, adab, bahasa, kesehatan, administrasi, dan komunikasi dengan orang tua.",
      bagian: [
        ["Pembinaan harian", ["Membimbing ibadah, adab, kebersihan, dan ketertiban asrama.", "Memastikan santri hadir tepat waktu di kegiatan belajar.", "Menangani pelanggaran secara mendidik."]],
        ["Bidang (qism)", ["Bahasa: pembiasaan bahasa Arab/Inggris.", "Kesehatan: memantau dan mendampingi santri sakit.", "Administrasi & dokumen: kehadiran, izin keluar, kejadian penting.", "Komunikasi: menjalin komunikasi dengan orang tua/wali."]],
      ],
      rutin: [["harian", "Membina ibadah, adab, kebersihan, dan kesehatan santri"], ["pekanan", "Mengevaluasi kedisiplinan dan bahasa santri, lapor ke Penyelenggara"], ["bulanan", "Menyerahkan catatan kinerja bidang untuk Insentif Musyrif"], ["semesteran", "Mengevaluasi perkembangan santri bersama Wali Kelas"]] },
  },
};

// ============================================================
//  LAPISAN API — SIM Guru PKBM Al Umm Barabai
//  Semua pemanggilan Supabase dikumpulkan di sini supaya index.html
//  cukup memanggil fungsi-fungsi berikut tanpa tahu detail query.
//  Butuh: window.SUPABASE_URL & window.SUPABASE_ANON_KEY (lihat config.js)
// ============================================================

const supa = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);

function unwrap({ data, error }) {
  if (error) {
    console.error("[Supabase error]", error);
    throw new Error(_pesanErrorRamah(error));
  }
  return data;
}
// PERBAIKAN: sebelumnya semua jenis error Supabase (ditolak izin/RLS, data dobel, referensi rusak,
// jaringan putus, dsb) dilempar sebagai pesan Postgres mentah apa adanya ke user — sering
// membingungkan ("duplicate key value violates unique constraint..."). Diklasifikasikan dulu di sini
// jadi pesan yang lebih jelas buat kasus-kasus paling umum; kalau tidak dikenali, pesan asli tetap
// dipakai apa adanya (tidak ada informasi yang hilang). Log konsol tetap pakai objek error asli utuh.
function _pesanErrorRamah(error) {
  const kode = error?.code || "";
  const pesan = error?.message || "";
  if (kode === "42501" || /permission denied/i.test(pesan)) {
    return "Aksi ini tidak diizinkan langsung ke database (mungkin memang sengaja dikunci demi keamanan) — coba lewat menu yang semestinya, atau hubungi admin.";
  }
  if (kode === "23505" || /duplicate key/i.test(pesan)) {
    return "Data ini sudah ada sebelumnya (tidak boleh dobel).";
  }
  if (kode === "23503" || /foreign key/i.test(pesan)) {
    return "Data terkait (mis. kelas/guru/mapel yang dirujuk) tidak ditemukan atau sudah dihapus.";
  }
  if (kode === "PGRST301" || /JWT/i.test(pesan)) {
    return "Sesi/izin akses bermasalah — coba muat ulang halaman.";
  }
  if (/Failed to fetch|NetworkError|network/i.test(pesan)) {
    return "Koneksi internet terputus — coba lagi.";
  }
  return pesan || "Terjadi kesalahan pada server";
}

// Panggil Supabase Edge Function — dipakai utk operasi yang sengaja dipindah dari tulis-langsung-
// tabel ke server (slip_gaji, insentif_musyrif, admin_pin), supaya siapa pun yang punya anon key
// (yang memang publik/terlihat di client) TIDAK BISA lagi kirim angka gaji/insentif sembarangan
// langsung ke database — server yang hitung ulang sendiri nominalnya dari data sumber. Fungsi ini
// menyeragamkan cara baca pesan error, baik dari Edge Function yang balas status non-200 maupun
// body `{error:"..."}`.
async function _invokeFn(name, body) {
  const { data, error } = await supa.functions.invoke(name, { body });
  if (error) {
    let msg = error.message || "Gagal memanggil server";
    try {
      if (error.context && typeof error.context.json === "function") {
        const parsed = await error.context.json();
        if (parsed && parsed.error) msg = parsed.error;
      }
    } catch (e) { /* biarkan pesan default di atas */ }
    throw new Error(msg);
  }
  if (data && data.error) throw new Error(data.error);
  return data;
}

// ── HAVERSINE (jarak dua koordinat, meter) ──
function hitungJarakMeter(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ── PENGATURAN SEKOLAH ──
// PERBAIKAN KEAMANAN: sengaja TIDAK pakai select("*") lagi. Kolom admin_pin sekarang disembunyikan
// dari akses langsung anon (baik SELECT maupun UPDATE) supaya PIN admin tidak lagi bisa dibaca
// mentah-mentah lewat REST API — verifikasi/ubah PIN sekarang HARUS lewat Edge Function
// verify-admin-pin/set-admin-pin (lihat di bawah). Kalau pakai select("*") di sini, query akan GAGAL
// TOTAL karena Postgres menolak SELECT * begitu ada satu kolom yang tidak diizinkan untuk role ini.
const KOLOM_PENGATURAN_SEKOLAH_PUBLIK =
  "id,nama_pkbm,alamat,lokasi_lat,lokasi_lng,radius_meter,bahasa_default,updated_at,blokir_hari_minggu," +
  "tunjangan_wali_kelas,logo_kiri_url,logo_kanan_url,nama_lembaga_kop,tahun_ajaran,nama_bendahara," +
  "jabatan_bendahara,toleransi_masuk_menit,batas_pulang_menit,kaldik_latar_url,kaldik_latar_pos_x," +
  "kaldik_latar_pos_y,kaldik_latar_zoom,kaldik_latar_opacity,kaldik_warna_judul,kaldik_warna_teks," +
  "kaldik_teks_panel,minggu_ganjil_genap_acuan,kaldik_logo_ukuran,kaldik_ukuran_judul," +
  "metode_mengajar_list,harga_snack_per_orang,tunjangan_wali_kelas_aktif,tahun_ajaran_mulai,bobot_nilai";
async function apiGetPengaturanSekolah() {
  try {
    const rows = unwrap(await supa.from("pengaturan_sekolah").select(KOLOM_PENGATURAN_SEKOLAH_PUBLIK).eq("id", 1).limit(1));
    return rows && rows[0] ? rows[0] : window.GEO_DEFAULT;
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}
async function apiSimpanPengaturanSekolah(data) {
  try {
    // admin_pin TIDAK PERNAH lewat jalur ini lagi, sengaja dibuang kalau ada yang kebawa terkirim —
    // ubah PIN cuma lewat apiSetAdminPin() (Edge Function set-admin-pin).
    const { admin_pin, ...dataAman } = data || {};
    const rows = unwrap(
      await supa.from("pengaturan_sekolah").upsert({ id: 1, ...dataAman, updated_at: new Date().toISOString() }).select(KOLOM_PENGATURAN_SEKOLAH_PUBLIK)
    );
    return rows[0];
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}
// ── PIN Admin (lewat Edge Function -- nilai PIN asli TIDAK PERNAH dikirim ke/dari client) ──
async function apiVerifyAdminPin(pin) {
  try {
    return _invokeFn("verify-admin-pin", { pin });
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}
async function apiCekStatusAdminPin() {
  try {
    return _invokeFn("verify-admin-pin", { pin: "" });
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}
async function apiSetAdminPin(pinLama, pinBaru) {
  try {
    // pinBaru === null berarti hapus/nonaktifkan PIN (kirim hapus: true ke edge function)
    if (pinBaru === null) {
      return _invokeFn("set-admin-pin", { pinLama, hapus: true });
    }
    return _invokeFn("set-admin-pin", { pinLama, pinBaru });
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}

// ── GURU ──
async function apiGetDaftarGuru() {
  try {
    return unwrap(
      await supa.from("guru").select("id,nama,jenis_guru,jabatan,foto_url").eq("status_aktif", true).order("nama")
    );
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}

// ── JADWAL ──
async function apiGetJadwalHari(hari, guruId) {
  try {
    let q = supa
      .from("jadwal_pelajaran")
      .select("id,hari,jam_mulai,jam_selesai,guru_id,kelas_id,mapel_id,tipe_minggu,pekan_bulan,kelas(nama_kelas),mapel(nama_mapel)")
      .eq("hari", hari)
      .eq("aktif", true)
      .order("jam_mulai");
    if (guruId) q = q.eq("guru_id", guruId);
    return unwrap(await q);
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}

async function apiGetSemuaJadwal() {
  try {
    return unwrap(
      await supa
        .from("jadwal_pelajaran")
        .select("id,hari,jam_mulai,jam_selesai,guru_id,kelas_id,mapel_id,guru_asal,tipe_minggu,pekan_bulan,guru(nama,status_aktif),kelas(nama_kelas),mapel(nama_mapel)")
        .eq("aktif", true)
        .order("hari")
        .order("jam_mulai")
    );
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}

async function apiSimpanJadwal(row) {
  try {
    if (row.id) {
      return unwrap(await supa.from("jadwal_pelajaran").update(row).eq("id", row.id).select());
    }
    return unwrap(await supa.from("jadwal_pelajaran").insert(row).select());
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}

async function apiHapusJadwal(id) {
  try {
    return unwrap(await supa.from("jadwal_pelajaran").delete().eq("id", id));
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}

async function apiImportJadwalBulk(rows) {
  try {
    // rows: [{hari, jam_mulai, jam_selesai, guru_id, kelas_id, mapel_id}, ...]
    return unwrap(await supa.from("jadwal_pelajaran").insert(rows).select());
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}

// Nama hari Indonesia dari sebuah tanggal ISO (YYYY-MM-DD), dihitung dari komponen tanggal itu
// sendiri (BUKAN new Date().getDay() yang ikut zona waktu perangkat) — dipakai sebagai pengaman
// terakhir supaya sesi absen tidak pernah dibuat untuk jadwal yang harinya tidak cocok dengan
// tanggalnya (lihat catatan bug "sesi nyasar ke tanggal kemarin" di tanggalISOFallback()).
const _HARI_INDO_API = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
function _hariDariTanggalISO(tanggalStr) {
  const [y, m, d] = (tanggalStr || "").split("-").map(Number);
  if (!y || !m || !d) return null;
  return _HARI_INDO_API[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
}

// ── SESI ABSENSI (per slot jadwal per tanggal) ──
async function apiGetOrCreateSesiHariIni(guruId, tanggal, jadwalList) {
  try {
    // Pengaman: buang dulu jadwal yang harinya TIDAK cocok dengan tanggal yang diminta (mis. gara-gara
    // "hari" & "tanggal" sempat dihitung dari sumber/waktu berbeda) — supaya tidak pernah membuat sesi
    // absen yang salah tanggal walau ada bug lain di pemanggilnya.
    const hariSeharusnya = _hariDariTanggalISO(tanggal);
    const jadwalCocok = hariSeharusnya ? jadwalList.filter((j) => !j.hari || j.hari === hariSeharusnya) : jadwalList;
    if (hariSeharusnya && jadwalCocok.length !== jadwalList.length) {
      console.warn(`[apiGetOrCreateSesiHariIni] ${jadwalList.length - jadwalCocok.length} jadwal dibuang karena harinya tidak cocok dengan tanggal ${tanggal} (seharusnya ${hariSeharusnya}).`);
    }
    // Pastikan tiap slot jadwal guru hari ini punya baris sesi (dibuat jika belum ada)
    const existing = unwrap(
      await supa.from("absensi_sesi").select("*").eq("guru_id", guruId).eq("tanggal", tanggal)
    );
    const existingByJadwal = Object.fromEntries(existing.map((s) => [s.jadwal_id, s]));
    const toCreate = jadwalCocok
      .filter((j) => !existingByJadwal[j.id])
      .map((j) => ({
        guru_id: guruId,
        jadwal_id: j.id,
        kelas_id: j.kelas_id,
        mapel_id: j.mapel_id,
        tanggal,
        dihapus: false,
      }));
    if (!toCreate.length) return _rapikanSesiDobel(existing);
    // Halaman Absen bisa terbuka 2x hampir bersamaan (2 perangkat / ketuk ganda) → dulu kedua panggilan
    // sama-sama membuat baris sesi untuk jadwal yang sama (sesi dobel: satu terisi, satu kosong yang
    // ikut terhitung "Belum Absen/Alpha"). Sekarang: kalau insert bentrok (index unik di database),
    // cukup ambil ulang; setelah itu baris kosong yang dobel dibersihkan.
    const ins = await supa.from("absensi_sesi").insert(toCreate).select();
    if (ins.error && ins.error.code !== "23505") throw ins.error;
    const semua = unwrap(await supa.from("absensi_sesi").select("*").eq("guru_id", guruId).eq("tanggal", tanggal));
    return _rapikanSesiDobel(semua);

  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}

// Satu jadwal = satu baris sesi per hari. Kalau ada dobel, pertahankan yang paling "berisi" (absen
// masuk / jurnal / status / pengajuan); yang KOSONG sama sekali dihapus lunak (masih bisa dipulihkan).
// Baris dobel yang sama-sama berisi tidak disentuh otomatis — terlalu berisiko, admin yang memutuskan.
async function _rapikanSesiDobel(rows) {
  const skor = (s) => (s.jam_masuk ? 8 : 0) + (s.jurnal_id ? 4 : 0) + (s.pengajuan_id ? 2 : 0) + (s.status_kehadiran ? 1 : 0) + (s.hadir_bersyarat ? 1 : 0);
  const pakai = {}, buang = [];
  rows.forEach((s) => {
    if (s.dihapus) return;
    const lain = pakai[s.jadwal_id];
    if (!lain) { pakai[s.jadwal_id] = s; return; }
    const [menang, kalah] = skor(s) > skor(lain) ? [s, lain] : [lain, s];
    pakai[s.jadwal_id] = menang;
    if (skor(kalah) === 0) buang.push(kalah.id);
  });
  if (buang.length) {
    try { await supa.from("absensi_sesi").update({ dihapus: true, dihapus_at: new Date().toISOString() }).in("id", buang); }
    catch (e) { console.warn("Gagal merapikan sesi dobel:", e); }
  }
  return rows.filter((s) => !buang.includes(s.id));
}

async function apiAbsenMasuk(sesiId, { lat, lng, jarak, statusLokasi }) {

  try {
    return unwrap(
      await supa
        .from("absensi_sesi")
        .update({
          jam_masuk: new Date().toISOString(),
          lat_masuk: lat,
          lng_masuk: lng,
          jarak_masuk_meter: jarak,
          status_lokasi_masuk: statusLokasi,
          status_kehadiran: "hadir",
          updated_at: new Date().toISOString(),
        })
        .eq("id", sesiId)
        .select()
    );
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}

async function apiAbsenPulang(sesiId, { lat, lng, jarak, statusLokasi }) {
  try {
    // Guard di level aplikasi: hanya panggil ini setelah jurnal_id terisi (lihat cekJurnalTerisi()).
    return unwrap(
      await supa
        .from("absensi_sesi")
        .update({
          jam_pulang: new Date().toISOString(),
          lat_pulang: lat,
          lng_pulang: lng,
          jarak_pulang_meter: jarak,
          status_lokasi_pulang: statusLokasi,
          updated_at: new Date().toISOString(),
        })
        .eq("id", sesiId)
        .select()
    );
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}

async function apiCekJurnalTerisi(sesiId) {
  try {
    const rows = unwrap(await supa.from("absensi_sesi").select("jurnal_id").eq("id", sesiId).limit(1));
    return !!(rows && rows[0] && rows[0].jurnal_id);
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}

// ── JURNAL KELAS + ABSENSI SISWA ──
async function apiGetSiswaByKelas(kelasId) {
  try {
    return unwrap(
      await supa.from("siswa").select("id,nama").eq("kelas_id", kelasId).eq("status_aktif", true).order("nama")
    );
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}

function buatDeskripsiOtomatis(materi, metodeArr) {
  if (!metodeArr || !metodeArr.length) return "";
  const metodeStr = metodeArr.join(", ");
  return `Pembelajaran dengan materi "${materi}" disampaikan menggunakan metode ${metodeStr}, ` +
    `melibatkan siswa secara aktif sesuai pendekatan yang dipilih guru untuk mencapai pemahaman materi tersebut.`;
}

async function apiSimpanJurnal({ sesi, guruId, kelasId, mapelId, jadwalId, tanggal, materiPokok, metodeArr, catatan, absensiSiswa }) {
  try {
    const hitung = { hadir: 0, izin: 0, sakit: 0, alpha: 0 };
    absensiSiswa.forEach((s) => { hitung[s.status] = (hitung[s.status] || 0) + 1; });

    const jurnalRow = {
      sesi_id: sesi.id,
      guru_id: guruId,
      kelas_id: kelasId,
      mapel_id: mapelId,
      jadwal_id: jadwalId,
      tanggal,
      materi_pokok: materiPokok,
      metode_mengajar: metodeArr,
      catatan,
      deskripsi_otomatis: buatDeskripsiOtomatis(materiPokok, metodeArr),
      jumlah_hadir: hitung.hadir,
      jumlah_izin: hitung.izin,
      jumlah_sakit: hitung.sakit,
      jumlah_alpha: hitung.alpha,
      jumlah_siswa: absensiSiswa.length,
    };

    // upsert (bukan insert polos) — sesi_id itu unique di jurnal_kelas, jadi kalau guru resubmit
    // (double-klik simpan, atau edit jurnal yang sudah pernah diisi), ini update baris yang sama
    // alih-agai gagal dengan error "duplicate key value violates unique constraint jurnal_kelas_sesi_id_key".
    const jurnal = unwrap(await supa.from("jurnal_kelas").upsert(jurnalRow, { onConflict: "sesi_id" }).select())[0];

    // Hapus dulu data absensi_siswa lama utk jurnal ini (kalau jurnalnya sudah ada sebelumnya) supaya
    // tidak dobel/basi, baru insert data absensi_siswa yang baru.
    unwrap(await supa.from("absensi_siswa").delete().eq("jurnal_id", jurnal.id));
    const siswaRows = absensiSiswa.map((s) => ({ jurnal_id: jurnal.id, siswa_id: s.siswa_id, status: s.status }));
    if (siswaRows.length) unwrap(await supa.from("absensi_siswa").insert(siswaRows));

    unwrap(await supa.from("absensi_sesi").update({ jurnal_id: jurnal.id }).eq("id", sesi.id));

    return jurnal;
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}

// Ambil jurnal + absensi per-siswa yang SUDAH ADA untuk satu sesi (dipakai supaya klik tombol/kolom
// Jurnal yang kedua kalinya membuka form berisi data lama untuk DIEDIT, bukan form kosong baru).
async function apiGetJurnalUntukEdit(sesiId) {
  try {
    const rows = unwrap(
      await supa.from("jurnal_kelas").select("*,absensi_siswa(siswa_id,status)").eq("sesi_id", sesiId).limit(1)
    );
    return rows && rows[0] ? rows[0] : null;
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}

// ── PENGAJUAN IZIN / SAKIT (harian) ──
async function apiAjukanIzinSakit(guruId, tanggal, jenis, alasan, sesiIds, tugas) {
  try {
    // Anti-dobel: tombol yang tertekan 2x (sinyal lambat) dulu menghasilkan 2 baris identik yang sama-
    // sama "menunggu" di antrian Kepsek. Kalau sudah ada pengajuan SAMA PERSIS (guru, tanggal, jenis,
    // alasan) yang masih menunggu, kembalikan yang lama saja — tidak insert baris baru.
    const sudahAda = unwrap(
      await supa.from("pengajuan_izin_sakit").select("*")
        .eq("guru_id", guruId).eq("tanggal", tanggal).eq("jenis", jenis).eq("alasan", alasan)
        .eq("status_verifikasi", "menunggu").limit(1)
    );
    if (sudahAda.length) return sudahAda[0];
    // GUNAKAN .insert() saja karena tabel pengajuan_izin_sakit tidak memiliki unique constraint
    // pada (guru_id, tanggal). Gunakan .upsert() tanpa onConflict akan gagal jika ada data ganda,
    // jadi kita gunakan .insert() dan kasih pesan error jika sudah ada.
    const { data, error } = await supa
      .from("pengajuan_izin_sakit")
      .insert({ guru_id: guruId, tanggal, jenis, alasan, tugas: tugas || null, status_verifikasi: "menunggu" })
      .select()
    .single();
    if (error) {
      // Jika error karena duplicate, berikan pesan yang ramah
      if (/duplicate key|unique constraint/i.test(error.message || "")) {
        throw new Error("Data pengajuan izin/sakit untuk tanggal ini sudah ada. Gunakan menu Riwayat untuk melihat status.");
      }
      throw new Error(_pesanErrorRamah(error) || error.message);
    }
    const row = data;
    // Tandai HANYA sesi hari itu yang BELUM mulai (jam_masuk kosong) sebagai izin/sakit.
    // Sesi yang sudah sempat diabsen (masuk/pulang) tidak boleh tertimpa supaya kehadiran & insentif yang sudah tercatat tidak hilang.
    // Kalau sesiIds diisi (guru memilih jam/mapel tertentu saja), hanya sesi itu yang ditandai —
    // jam/mapel lain hari itu yang tidak dipilih tetap "belum_absen" seperti biasa.
    let q = supa
      .from("absensi_sesi")
      .update({ status_kehadiran: jenis, pengajuan_id: row.id })
      .eq("guru_id", guruId)
      .eq("tanggal", tanggal)
      .is("jam_masuk", null);
    if (sesiIds && sesiIds.length) q = q.in("id", sesiIds);
    unwrap(await q);
    return row;
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}

// Batalkan pengajuan izin/sakit yang sudah terlanjur dikirim (mengembalikan status sesi terkait
// ke kondisi sesuai jam_masuk/jam_pulang yang sesungguhnya, bukan lagi izin/sakit).
// Ini pembatalan PERMANEN oleh guru sendiri (bukan housekeeping admin) — tetap hapus asli
// (bukan soft-delete) karena memang dimaksudkan untuk ditarik kembali, bukan disimpan di recycle bin.
async function apiBatalkanIzinSakit(pengajuanId) {
  try {
    const sesiTerkait = unwrap(await supa.from("absensi_sesi").select("id,jam_masuk").eq("pengajuan_id", pengajuanId));
    for (const s of sesiTerkait) {
      await supa
        .from("absensi_sesi")
        .update({ status_kehadiran: s.jam_masuk ? "hadir" : "belum_absen", pengajuan_id: null })
        .eq("id", s.id);
    }
    return unwrap(await supa.from("pengajuan_izin_sakit").delete().eq("id", pengajuanId).select());
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}

// Hapus (soft-delete) beberapa riwayat pengajuan izin/sakit sekaligus — status kehadiran sesi
// terkait tetap dikembalikan seperti semula (perilaku lama tidak berubah), TAPI baris pengajuannya
// sendiri hanya ditandai dihapus (bukan dihapus permanen) supaya bisa dipulihkan lewat "Riwayat
// Terhapus" kalau ternyata salah hapus. pengajuan_id di sesi SENGAJA tidak dikosongkan supaya bisa
// dilacak balik saat dipulihkan.
async function apiHapusRiwayatIzinSakitBanyak(ids) {
  try {
    for (const id of ids) {
      const sesiTerkait = unwrap(await supa.from("absensi_sesi").select("id,jam_masuk").eq("pengajuan_id", id));
      for (const s of sesiTerkait) {
        await supa.from("absensi_sesi").update({ status_kehadiran: s.jam_masuk ? "hadir" : "belum_absen" }).eq("id", s.id);
      }
      await supa.from("pengajuan_izin_sakit").update({ dihapus: true, dihapus_at: new Date().toISOString() }).eq("id", id);
    }
    return true;
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}

// Hapus (soft-delete) beberapa baris riwayat absen (absensi_sesi) sekaligus — tidak lagi dihapus
// permanen, hanya ditandai "dihapus" supaya bisa dipulihkan lewat menu "Riwayat Terhapus" (admin)
// kalau ternyata terhapus tidak sengaja.
async function apiHapusRiwayatAbsenBanyak(ids) {
  try {
    return unwrap(
      await supa.from("absensi_sesi").update({ dihapus: true, dihapus_at: new Date().toISOString() }).in("id", ids).select()
    );
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}

async function apiGetAntrianIzinSakit(tanggal) {
  try {
    return unwrap(
      await supa
        .from("pengajuan_izin_sakit")
        .select("*,guru(nama)")
        .eq("tanggal", tanggal)
        .eq("status_verifikasi", "menunggu")
        .order("created_at")
    );
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}

async function apiProsesIzinSakit(id, disetujui, diprosesOleh) {
  try {
    return unwrap(
      await supa
        .from("pengajuan_izin_sakit")
        .update({
          status_verifikasi: disetujui ? "diterima" : "ditolak",
          diproses_oleh: diprosesOleh || "Kepala Sekolah",
          diproses_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
    );
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}

// ── MONITOR HARIAN ──
async function apiGetMonitorHarian(tanggal, hari) {
  try {
    let jadwal = unwrap(
      await supa
        .from("jadwal_pelajaran")
        .select("id,jam_mulai,jam_selesai,guru_id,kelas_id,mapel_id,tipe_minggu,pekan_bulan,guru(nama,foto_url),kelas(nama_kelas),mapel(nama_mapel)")
        .eq("hari", hari)
        .eq("aktif", true)
        .order("jam_mulai")
    );
    if (typeof tipeMingguPadaTanggal === "function") {
      const tipeHariIni = tipeMingguPadaTanggal(tanggal);
      if (tipeHariIni) jadwal = jadwal.filter((j) => !j.tipe_minggu || j.tipe_minggu === "setiap_minggu" || j.tipe_minggu === tipeHariIni);
    }
    if (typeof pekanBulanPadaTanggal === "function") {
      const pekanHariIni = pekanBulanPadaTanggal(tanggal);
      if (pekanHariIni) jadwal = jadwal.filter((j) => !j.pekan_bulan || !j.pekan_bulan.length || j.pekan_bulan.includes(pekanHariIni));
    }

    // Tukar/Pindah jam yang sudah disetujui & berlaku PERSIS pada tanggal ini — dipakai untuk
    // tampilkan guru pengganti di Monitor, tanpa mengubah data jadwal_pelajaran baku sama sekali
    // (per-tanggal saja).
    const tukarAktif = unwrap(
      await supa.from("tukar_jadwal").select(_SELECT_TUKAR_JADWAL)
        .eq("status", "disetujui")
        .or(`tanggal_asal.eq.${tanggal},tanggal_tujuan.eq.${tanggal}`)
    );
    const penggantiMap = {};
    // PERBAIKAN: sebelumnya jenis "pindah" (guru pindah jam SENDIRI, tanpa guru pengganti) ikut
    // diproses lewat penggantiMap yang sama seperti "tukar" (saling tukar dengan guru lain) — karena
    // "pindah" tidak punya guru_tujuan, hasilnya guru & foto di slot asal malah ditimpa jadi kosong
    // ("-" dan avatar "?"). Sekarang "pindah" ditangani terpisah: slot asal TETAP tampilkan nama/foto
    // guru aslinya (cuma dikasih label "dipindah"), dan slot BARU (jam/tanggal tujuan) ditambahkan
    // sebagai baris sintetis (bukan ditulis ke jadwal_pelajaran) memakai id yang SAMA dengan jadwal
    // asalnya supaya nyambung ke baris absensi_sesi yang benar (persis seperti logika di halaman
    // Absensi Guru / terapkanTukarJadwalHariIni).
    const pindahAsalLabelMap = {};
    const jadwalTambahanPindah = [];
    const idJadwalUntukDisembunyikan = new Set();
    for (const t of tukarAktif) {
      if (t.jenis === "pindah") {
        const asalHariIni = t.tanggal_asal === tanggal;
        const tujuanHariIni = t.tanggal_tujuan === tanggal;
        if (asalHariIni && t.jadwal_asal_id) {
          if (tujuanHariIni) {
            // Pindah jam di HARI YANG SAMA — jangan tampilkan dua kali di jam lama, cukup di jam baru.
            idJadwalUntukDisembunyikan.add(t.jadwal_asal_id);
          } else {
            // Pindah ke tanggal lain — slot asal tetap tampil (nama/foto guru aslinya utuh), cuma
            // diberi label supaya admin tahu ini sengaja dipindah, bukan lupa absen.
            pindahAsalLabelMap[t.jadwal_asal_id] = `📤 Dipindah ke ${t.tanggal_tujuan}, ${t.jam_mulai_baru?.slice(0,5) || ""}-${t.jam_selesai_baru?.slice(0,5) || ""}`;
          }
        }
        if (tujuanHariIni && t.jadwal_asal) {
          jadwalTambahanPindah.push({
            id: t.jadwal_asal_id, jam_mulai: t.jam_mulai_baru, jam_selesai: t.jam_selesai_baru,
            guru_id: t.guru_pengaju_id, kelas_id: t.jadwal_asal.kelas_id, mapel_id: t.jadwal_asal.mapel_id,
            guru: t.guru_pengaju, kelas: t.jadwal_asal.kelas, mapel: t.jadwal_asal.mapel,
            tipe_minggu: null, pekan_bulan: null,
            _tukarLabel: `📥 Pindah jadwal${!asalHariIni ? ` dari ${t.tanggal_asal}` : ""}`,
          });
        }
        continue;
      }
      if (t.tanggal_asal === tanggal && t.jadwal_asal_id) {
        penggantiMap[t.jadwal_asal_id] = { guru: t.guru_tujuan, guruId: t.guru_tujuan_id, label: `🔄 Tukar Jam (gantinya: ${t.guru_tujuan?.nama || "-"})` };
      }
      if (t.tanggal_tujuan === tanggal && t.jadwal_tujuan_id) {
        penggantiMap[t.jadwal_tujuan_id] = { guru: t.guru_pengaju, guruId: t.guru_pengaju_id, label: `🔄 Tukar Jam (gantinya: ${t.guru_pengaju?.nama || "-"})` };
      }
    }
    jadwal = jadwal.filter((j) => !idJadwalUntukDisembunyikan.has(j.id));
    jadwal = [...jadwal, ...jadwalTambahanPindah].sort((a, b) => (a.jam_mulai || "").localeCompare(b.jam_mulai || ""));

    const sesi = unwrap(await supa.from("absensi_sesi").select("*,pengajuan:pengajuan_id(status_verifikasi)").eq("tanggal", tanggal));
    const sesiByJadwal = Object.fromEntries(sesi.map((s) => [s.jadwal_id, s]));

    return jadwal.map((j) => {
      const s = sesiByJadwal[j.id];
      let warna = "merah";
      let labelKhusus = null;
      const labelPindahAsal = pindahAsalLabelMap[j.id];
      if (labelPindahAsal) {
        // Slot ini sengaja dipindah ke tanggal lain — jangan tampil merah "Belum Absen" (menyesatkan,
        // seolah guru lupa absen), pakai warna netral (ungu, sama seperti Izin/Sakit yang sudah di-ACC).
        warna = "ungu";
        labelKhusus = labelPindahAsal;
      } else if (s) {
        if (s.status_kehadiran === "izin" || s.status_kehadiran === "sakit") {
          const disetujui = s.pengajuan?.status_verifikasi === "diterima";
          // Belum di-ACC Kepala Sekolah -> tetap merah. Sudah di-ACC -> ungu, dan label ganti jadi Izin/Sakit.
          warna = disetujui ? "ungu" : "merah";
          labelKhusus = (s.status_kehadiran === "izin" ? "Izin" : "Sakit") + (disetujui ? "" : " (Menunggu ACC)");
        } else if (s.status_kehadiran === "alpha") {
          warna = "merah";
        } else if (s.jam_masuk && s.jam_pulang && s.jurnal_id) {
          warna = "hijau";
        } else if (s.jam_masuk) {
          warna = "kuning";
        }
      }
      const pengganti = penggantiMap[j.id];
      const jadwalTampil = pengganti ? { ...j, guru: pengganti.guru, _tukarLabel: pengganti.label } : j;
      return { jadwal: jadwalTampil, sesi: s || null, warna, labelKhusus };
    });
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}

// ── REKAP / RIWAYAT ──
async function apiGetRiwayatAbsenGuru(guruId, dari, sampai) {
  try {
    let q = supa
      .from("absensi_sesi")
      .select("*,jadwal_pelajaran(hari,jam_mulai,jam_selesai),kelas(nama_kelas),mapel(nama_mapel),guru(nama)")
      .gte("tanggal", dari)
      .lte("tanggal", sampai)
      // BUKAN .neq("dihapus", true) — di SQL, NULL <> true menghasilkan NULL (bukan true), jadi baris
      // dengan dihapus IS NULL (mis. baris yang baru diperbaiki admin lewat RPC perbaiki_sesi_hadir_
      // bersyarat, yang tidak menyentuh kolom ini) ikut TERBUANG dari hasil walau bukan baris terhapus.
      // Akibatnya baris yang sudah benar diperbaiki (hadir_bersyarat=true) hilang dari Riwayat Absen,
      // lalu digantikan baris "virtual" Alpha oleh _gabungRiwayatDenganJadwal() — kelihatan seolah
      // perbaikannya tidak nyimpan padahal sudah tersimpan benar di database.
      .or("dihapus.is.null,dihapus.eq.false")
      .order("tanggal", { ascending: false });
    if (guruId) q = q.eq("guru_id", guruId);
    return unwrap(await q);
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}

// ── RIWAYAT TERHAPUS (recycle bin) — admin bisa lihat & pulihkan riwayat yang tidak sengaja dihapus ──
async function apiGetRiwayatAbsenTerhapus(dari, sampai) {
  try {
    return unwrap(
      await supa
        .from("absensi_sesi")
        .select("*,jadwal_pelajaran(hari,jam_mulai,jam_selesai),kelas(nama_kelas),mapel(nama_mapel),guru(nama)")
        .gte("tanggal", dari)
        .lte("tanggal", sampai)
        .eq("dihapus", true)
        .order("dihapus_at", { ascending: false })
    );
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}
async function apiPulihkanRiwayatAbsenBanyak(ids) {
  try {
    return unwrap(await supa.from("absensi_sesi").update({ dihapus: false, dihapus_at: null }).in("id", ids).select());
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}
async function apiGetRiwayatIzinSakitTerhapus(dari, sampai) {
  try {
    return unwrap(
      await supa
        .from("pengajuan_izin_sakit")
        .select("*,guru(nama)")
        .gte("tanggal", dari)
        .lte("tanggal", sampai)
        .eq("dihapus", true)
        .order("dihapus_at", { ascending: false })
    );
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}
async function apiPulihkanRiwayatIzinSakitBanyak(ids) {
  try {
    for (const id of ids) {
      const rows = unwrap(await supa.from("pengajuan_izin_sakit").select("*").eq("id", id).limit(1));
      const pengajuan = rows && rows[0];
      if (!pengajuan) continue;
      // Kembalikan status kehadiran sesi terkait ke izin/sakit sesuai pengajuan aslinya, baru
      // munculkan lagi baris pengajuannya (kebalikan persid dari yang terjadi saat dihapus).
      await supa.from("absensi_sesi").update({ status_kehadiran: pengajuan.jenis }).eq("pengajuan_id", id);
      await supa.from("pengajuan_izin_sakit").update({ dihapus: false, dihapus_at: null }).eq("id", id);
    }
    return true;
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}

async function apiGetRekapKehadiranSiswa(kelasId, dari, sampai) {
  try {
    const siswa = await apiGetSiswaByKelas(kelasId);
    const rekap = unwrap(
      await supa
        .from("rekap_kehadiran_harian_siswa")
        .select("*")
        .gte("tanggal", dari)
        .lte("tanggal", sampai)
        .in("siswa_id", siswa.map((s) => s.id))
    );
    return siswa.map((s) => {
      const rows = rekap.filter((r) => r.siswa_id === s.id);
      // ✅ Hadir: Termasuk record dengan status "Selesai" DAN status "Hadir Bersyarat"
      const hadir = rows.filter((r) => r.status_harian === "hadir" || r.status_harian === "hadir_bersyarat").length;
      // ✅ Izin: Record dengan status "Izin" (tidak berubah)
      const izin = rows.filter((r) => r.status_harian === "izin").length;
      // ✅ Sakit: Record dengan status "Sakit" (tidak berubah)
      const sakit = rows.filter((r) => r.status_harian === "sakit").length;
      // ✅ Alpha: Hanya menghitung record yang eksplisit bertipe "Alpha" / "Tanpa Keterangan"
      // ✅ JANGIN memasukkan status "Hadir Bersyarat" ke dalam kolom Alpha
      const alpha = rows.filter((r) => r.status_harian === "alpha").length;
      const totalHari = rows.length || 1;
      // ✅ Persentase Kehadiran = (Total Hadir / JP Seharusnya) * 100%
      const persenHadir = Math.round((hadir / totalHari) * 1000) / 10;
      return {
        siswa: s,
        hadir, izin, sakit, alpha,
        persenHadir,
      };
    });
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}

// ============================================================
//  FASE 2 — API tambahan
// ============================================================

// ── UPLOAD FOTO (Supabase Storage, bucket "foto") ──
async function apiUploadFoto(file, folder) {
  const ext = file.name.split(".").pop();
  const path = `${folder}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supa.storage.from("foto").upload(path, file, { upsert: true });
  if (error) throw new Error(error.message);
  const { data } = supa.storage.from("foto").getPublicUrl(path);
  return data.publicUrl;
}

// ── DATA GURU ──
async function apiGetAllGuru() {
  return unwrap(await supa.from("guru").select("*,guru_pendidikan(jenjang,nama_institusi,tahun_lulus,urutan)").order("nama"));
}
async function apiGetGuruDetail(id) {
  const rows = unwrap(await supa.from("guru").select("*").eq("id", id).limit(1));
  return rows[0];
}
async function apiSimpanGuru(row) {
  if (row.id) return unwrap(await supa.from("guru").update(row).eq("id", row.id).select());
  return unwrap(await supa.from("guru").insert(row).select());
}
async function apiHapusGuru(id) {
  return unwrap(await supa.from("guru").update({ status_aktif: false }).eq("id", id));
}
async function apiGetPendidikanGuru(guruId) {
  return unwrap(await supa.from("guru_pendidikan").select("*").eq("guru_id", guruId).order("urutan"));
}
async function apiSimpanPendidikan(row) {
  if (row.id) return unwrap(await supa.from("guru_pendidikan").update(row).eq("id", row.id).select());
  return unwrap(await supa.from("guru_pendidikan").insert(row).select());
}
async function apiHapusPendidikan(id) {
  return unwrap(await supa.from("guru_pendidikan").delete().eq("id", id));
}
async function apiImportGuruBulk(rows) {
  return unwrap(await supa.from("guru").insert(rows).select());
}

// ── DATA SISWA ──
async function apiGetAllSiswa(kelasId) {
  let q = supa.from("siswa").select("*,kelas(nama_kelas)").eq("status_aktif", true).order("nama");
  if (kelasId) q = q.eq("kelas_id", kelasId);
  return unwrap(await q);
}
async function apiGetJumlahSiswaPerKelas() {
  const rows = unwrap(await supa.from("siswa").select("kelas_id,kelas(nama_kelas)").eq("status_aktif", true));
  const peta = new Map();
  rows.forEach((r) => {
    const key = r.kelas_id || "-";
    if (!peta.has(key)) peta.set(key, { kelas_id: r.kelas_id, nama_kelas: r.kelas?.nama_kelas || "Tanpa Kelas", jumlah: 0 });
    peta.get(key).jumlah++;
  });
  return Array.from(peta.values());
}
async function apiSimpanSiswa(row) {
  if (row.id) return unwrap(await supa.from("siswa").update(row).eq("id", row.id).select());
  return unwrap(await supa.from("siswa").insert(row).select());
}
async function apiHapusSiswa(id) {
  return unwrap(await supa.from("siswa").update({ status_aktif: false, tanggal_mutasi: tanggalISOFallback() }).eq("id", id));
}
async function apiGetSiswaNonaktif(kelasId) {
  let q = supa.from("siswa").select("*,kelas(nama_kelas)").eq("status_aktif", false).order("tanggal_mutasi", { ascending: false });
  if (kelasId) q = q.eq("kelas_id", kelasId);
  return unwrap(await q);
}
async function apiNonaktifkanSiswaBulk(ids, alasan, tanggal) {
  return unwrap(await supa.from("siswa").update({ status_aktif: false, alasan_mutasi: alasan, tanggal_mutasi: tanggal }).in("id", ids));
}
async function apiAktifkanKembaliSiswa(id) {
  return unwrap(await supa.from("siswa").update({ status_aktif: true, tanggal_mutasi: null, alasan_mutasi: null }).eq("id", id));
}
async function apiPindahkanKelasBulk(ids, kelasId) {
  return unwrap(await supa.from("siswa").update({ kelas_id: kelasId }).in("id", ids));
}
async function apiNaikKelasSatuTingkat(kelasAsalId, kelasTujuanId) {
  return unwrap(await supa.from("siswa").update({ kelas_id: kelasTujuanId }).eq("kelas_id", kelasAsalId).eq("status_aktif", true));
}
async function apiLuluskanKelas(kelasId, tanggal) {
  return unwrap(await supa.from("siswa").update({ status_aktif: false, tanggal_mutasi: tanggal, alasan_mutasi: "Lulus (naik kelas otomatis)" }).eq("kelas_id", kelasId).eq("status_aktif", true));
}
async function apiImportSiswaBulk(rows) {
  return unwrap(await supa.from("siswa").insert(rows).select());
}

// ── RIWAYAT ABSEN (perluasan: bulanan & semester dari fungsi yang sudah ada) ──
async function apiGetRiwayatAbsenRange(guruId, dari, sampai) {
  return apiGetRiwayatAbsenGuru(guruId, dari, sampai);
}

// ── JURNAL GURU (rekap bulanan + bahan ekspor Word) ──
async function apiGetJurnalBulanan(guruId, tahunBulan /* 'YYYY-MM' */) {
  try {
    const dari = `${tahunBulan}-01`;
    const [y, m] = tahunBulan.split("-").map(Number);
    const akhir = new Date(y, m, 0).getDate();
    const sampai = `${tahunBulan}-${String(akhir).padStart(2, "0")}`;
    let q = supa
      .from("jurnal_kelas")
      .select("*,guru(nama),kelas(nama_kelas,program),mapel(nama_mapel),jadwal_pelajaran(hari,jam_mulai,jam_selesai)")
      .gte("tanggal", dari)
      .lte("tanggal", sampai)
      .order("tanggal");
    if (guruId) q = q.eq("guru_id", guruId);
    return unwrap(await q);
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}

// ── SILABUS ──
async function apiGetSilabus(mapelId, kelasId) {
  try {
    let q = supa.from("silabus").select("*").order("urutan");
    if (mapelId) q = q.eq("mapel_id", mapelId);
    if (kelasId) q = q.eq("kelas_id", kelasId);
    return unwrap(await q);
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}
async function apiSimpanSilabus(row) {
  try {
    if (row.id) return unwrap(await supa.from("silabus").update(row).eq("id", row.id).select());
    return unwrap(await supa.from("silabus").insert(row).select());
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}
async function apiHapusSilabus(id) {
  try {
    return unwrap(await supa.from("silabus").delete().eq("id", id));
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}
// Bandingkan materi_pokok jurnal terhadap daftar silabus (pencocokan sederhana berbasis teks)
function cocokkanMateriDenganSilabus(materiJurnal, daftarSilabus) {
  const norm = (s) => (s || "").toLowerCase().trim();
  const target = norm(materiJurnal);
  return daftarSilabus.some((s) => {
    const m = norm(s.materi_pokok);
    return m && (target.includes(m) || m.includes(target));
  });
}

// ── NILAI RAPOR ──
async function apiGetNilaiRaporByKelasMapel(kelasId, mapelId, semester, tahunAjaran) {
  try {
    const siswa = await apiGetSiswaByKelas(kelasId);
    const nilai = unwrap(
      await supa
        .from("nilai_rapor")
        .select("*")
        .eq("mapel_id", mapelId)
        .eq("semester", semester)
        .eq("tahun_ajaran", tahunAjaran)
        .in("siswa_id", siswa.map((s) => s.id))
    );
    return siswa.map((s) => ({ siswa: s, nilai: nilai.find((n) => n.siswa_id === s.id) || null }));
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}
async function apiSimpanNilaiRapor(row) {
  try {
    return unwrap(
      await supa
        .from("nilai_rapor")
        .upsert(row, { onConflict: "siswa_id,mapel_id,semester,tahun_ajaran" })
        .select()
    );
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}
function hitungTotalKomponen(arr) {
  if (!arr || !arr.length) return 0;
  const total = arr.reduce((a, b) => a + (Number(b.nilai) || 0), 0);
  return Math.round((total / arr.length) * 10) / 10;
}
function hitungNilaiAkhir(nilaiRow) {
  if (!nilaiRow) return null;
  const rataUH = hitungTotalKomponen(nilaiRow.ulangan_harian);
  const rataTugas = hitungTotalKomponen(nilaiRow.tugas);
  const rataUTS = nilaiRow.ada_uts ? hitungTotalKomponen(nilaiRow.uts) : null;
  const rataUAS = hitungTotalKomponen(nilaiRow.uas);
  const kehadiran = typeof nilaiRow.nilai_kehadiran === "number" ? nilaiRow.nilai_kehadiran : null;
  // STATE di index.html dibuat dengan `const`, jadi TIDAK ada di window.STATE — dulu baris ini pakai
  // window.STATE sehingga bobot nilai dari Pengaturan tidak pernah terbaca (nilai akhir selalu jadi
  // rata-rata biasa). Ambil langsung dari STATE global kalau tersedia.
  const _state = (typeof STATE !== "undefined" ? STATE : window.STATE);
  const bobotConfig = _state?.pengaturan?.bobot_nilai;
  const adaUTS = rataUTS !== null;
  const b = bobotConfig ? (adaUTS ? bobotConfig.dengan_uts : bobotConfig.tanpa_uts) : null;
  let nilaiAkhir;
  if (b) {
    let total = 0, totalBobot = 0;
    const add = (val, w) => { if (val > 0 && w) { total += val * w; totalBobot += w; } };
    add(rataUH, b.uh); add(rataTugas, b.tugas);
    if (adaUTS) add(rataUTS, b.uts);
    add(rataUAS, b.uas);
    if (kehadiran !== null) add(kehadiran, b.kehadiran);
    nilaiAkhir = totalBobot > 0 ? Math.round((total / totalBobot) * 10) / 10 : 0;
  } else {
    const komponen = [rataUH, rataTugas, rataUAS];
    if (adaUTS) komponen.push(rataUTS);
    const valid = komponen.filter((v) => v > 0);
    nilaiAkhir = valid.length ? Math.round((valid.reduce((a, b) => a + b, 0) / valid.length) * 10) / 10 : 0;
  }
  return { rataUH, rataTugas, rataUTS, rataUAS, nilaiAkhir };
}

// ── REKAP KEHADIRAN -> NILAI KEHADIRAN OTOMATIS ──
async function apiHitungNilaiKehadiran(siswaId, dari, sampai) {
  try {
    const rekap = unwrap(
      await supa.from("rekap_kehadiran_harian_siswa").select("status_harian").eq("siswa_id", siswaId).gte("tanggal", dari).lte("tanggal", sampai)
    );
    if (!rekap.length) return 100;
    // ✅ Hadir: Termasuk record dengan status "Selesai" DAN status "Hadir Bersyarat"
    const hadir = rekap.filter((r) => r.status_harian === "hadir" || r.status_harian === "hadir_bersyarat").length;
    // ✅ Alpha: Hanya menghitung record yang eksplisit bertipe "Alpha" / "Tanpa Keterangan"
    // ✅ JANGIN memasukkan status "Hadir Bersyarat" ke dalam kolom Alpha
    // const alpha = rekap.filter((r) => r.status_harian === "alpha").length; // not needed for this function
    if (!hadir) return 0;
    // ✅ Persentase Kehadiran = (Total Hadir / Jumlah Record) * 100%
    return Math.round((hadir / rekap.length) * 1000) / 10;
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}

// ── RAPOR GABUNGAN PER SISWA (dipakai Rapor Umum, Diniyyah, Fitur Rapor Wali Kelas) ──
async function apiGetRaporLengkapSiswa(siswaId, semester, tahunAjaran) {
  try {
    const siswaRows = unwrap(await supa.from("siswa").select("*,kelas(*)").eq("id", siswaId).limit(1));
    const siswa = siswaRows[0];
    const nilai = unwrap(
      await supa
        .from("nilai_rapor")
        .select("*,mapel(nama_mapel,kategori,kkm,tanpa_guru,masuk_umum,masuk_diniyyah,paket_b,paket_c,alias_rapor_umum)")
        .eq("siswa_id", siswaId)
        .eq("semester", semester)
        .eq("tahun_ajaran", tahunAjaran)
    );
    return { siswa, nilai };
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}

// ── PENGATURAN RAPOR (tempat/tanggal terbit, pejabat) ──
async function apiGetPengaturanRapor() {
  try {
    const rows = unwrap(await supa.from("pengaturan_rapor").select("*").eq("id", 1).limit(1));
    return rows[0] || { tempat_terbit: "Hulu Sungai Tengah", tanggal_terbit: tanggalISOFallback(), nama_pejabat: "", jabatan_pejabat: "" };
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}
// PENTING — pakai zona Asia/Makassar (WITA, UTC+8) secara EKSPLISIT (bukan getFullYear()/getDate()
// biasa yang ikut zona waktu perangkat, dan bukan toISOString() yang UTC) — Sekolah di Barabai,
// Kalimantan Selatan → WITA. Kalau perangkat/kiosk salah setting zona waktu (kebaca UTC dsb),
// "hari ini" bisa mundur dari kalender WITA, sehingga sesi absen nyasar ke tanggal kemarin.
// (tanggalISO() di index.html SENGAJA dibuat identik — pastikan selalu sinkron.)
function tanggalISOFallback() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Makassar", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}
// Ambil waktu dari server Supabase untuk sinkronisasi anti-manipulasi jam perangkat.
// RPC ini harus dibuat manual di Supabase SQL Editor:
//   CREATE OR REPLACE FUNCTION get_waktu_server() RETURNS timestamptz LANGUAGE sql STABLE SECURITY DEFINER AS $$ SELECT NOW(); $$;
//   GRANT EXECUTE ON FUNCTION get_waktu_server() TO anon;
async function apiGetWaktuServer() {
  const { data, error } = await supa.rpc("get_waktu_server");
  if (error) throw new Error(error.message);
  return data ? new Date(data) : null;
}
async function apiSimpanPengaturanRapor(row) {
  try {
    return unwrap(await supa.from("pengaturan_rapor").update(row).eq("id", 1).select());
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}

// ── EKSTRAKURIKULER PER SISWA (tabel "Ekstrakurikuler" di Rapor Umum) ──
async function apiGetEkstrakurikulerSiswa(siswaId, semester, tahunAjaran) {
  try {
    return unwrap(
      await supa.from("rapor_ekstrakurikuler").select("*").eq("siswa_id", siswaId).eq("semester", semester).eq("tahun_ajaran", tahunAjaran).order("urutan")
    );
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}
async function apiSimpanEkstrakurikuler(row) {
  try {
    if (row.id) return unwrap(await supa.from("rapor_ekstrakurikuler").update(row).eq("id", row.id).select());
    return unwrap(await supa.from("rapor_ekstrakurikuler").insert(row).select());
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}
async function apiHapusEkstrakurikuler(id) {
  try {
    return unwrap(await supa.from("rapor_ekstrakurikuler").delete().eq("id", id).select());
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}
// Versi borongan sekelas (dipakai Fitur Rapor Wali Kelas supaya tidak query per-siswa satu-satu)
async function apiGetEkstrakurikulerKelas(siswaIds, semester, tahunAjaran) {
  if (!siswaIds.length) return [];
  try {
    return unwrap(
      await supa.from("rapor_ekstrakurikuler").select("*").in("siswa_id", siswaIds).eq("semester", semester).eq("tahun_ajaran", tahunAjaran).order("urutan")
    );
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}

// ── CATATAN WALI KELAS + KEPUTUSAN NAIK/TINGGAL PER SISWA PER SEMESTER ──
async function apiGetCatatanSiswa(siswaId, semester, tahunAjaran) {
  try {
    const rows = unwrap(
      await supa.from("rapor_catatan_siswa").select("*").eq("siswa_id", siswaId).eq("semester", semester).eq("tahun_ajaran", tahunAjaran).limit(1)
    );
    return rows[0] || { catatan_wali_kelas: "", keputusan: "Naik", kelas_tujuan: "" };
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}
async function apiSimpanCatatanSiswa(row) {
  try {
    return unwrap(await supa.from("rapor_catatan_siswa").upsert(row, { onConflict: "siswa_id,semester,tahun_ajaran" }).select());
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}
// Versi borongan sekelas (dipakai Fitur Rapor Wali Kelas)
async function apiGetCatatanKelas(siswaIds, semester, tahunAjaran) {
  if (!siswaIds.length) return [];
  try {
    return unwrap(
      await supa.from("rapor_catatan_siswa").select("*").in("siswa_id", siswaIds).eq("semester", semester).eq("tahun_ajaran", tahunAjaran)
    );
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}

// ── INSENTIF & SLIP GAJI (tarif dipisah: jenis guru dalam/luar x Paket B/C) ──
async function apiGetInsentifRate() {
  try {
    return unwrap(await supa.from("insentif_rate").select("*").order("jenis_guru").order("paket"));
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}
async function apiSimpanInsentifRate(row) {
  try {
    // row: { jenis_guru, paket, rate_per_jp } — upsert berdasar kombinasi jenis_guru+paket
    return unwrap(await supa.from("insentif_rate").upsert(row, { onConflict: "jenis_guru,paket" }).select());
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}
async function apiRateUntuk(jenisGuru, paket) {
  try {
    const rates = await apiGetInsentifRate();
    const cocok = rates.find((r) => r.jenis_guru === jenisGuru && r.paket === paket);
    return cocok ? cocok.rate_per_jp : 0;
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}
// Kelas "KELAS 7".."KELAS 9" = Paket B, "KELAS 10".."KELAS 12" = Paket C
function paketDariNamaKelas(namaKelas) {
  const m = String(namaKelas || "").match(/(\d+)/);
  if (!m) return null;
  const n = parseInt(m[1], 10);
  if (n >= 7 && n <= 9) return "B";
  if (n >= 10 && n <= 12) return "C";
  return null;
}
// Hitung jumlah JP (sesi selesai: masuk+pulang+jurnal terisi) per guru per bulan, dipecah Paket B / Paket C
async function apiHitungJPPaketGuruBulan(guruId, bulan, tahun) {
  try {
    const dari = `${tahun}-${String(bulan).padStart(2, "0")}-01`;
    const akhirTgl = new Date(tahun, bulan, 0).getDate();
    const sampai = `${tahun}-${String(bulan).padStart(2, "0")}-${String(akhirTgl).padStart(2, "0")}`;

    const sesi = unwrap(
      await supa
        .from("absensi_sesi")
        .select("id,status_kehadiran,jam_masuk,jam_pulang,jurnal_id,kelas(nama_kelas)")
        .eq("guru_id", guruId)
        .gte("tanggal", dari)
        .lte("tanggal", sampai)
    );

    // Filter status kehadiran secara fleksibel (mencakup 'hadir' & 'hadir bersyarat')
    const selesai = (sesi || []).filter((s) => {
      const st = String(s.status_kehadiran || "").toLowerCase().replace(/_/g, " ");
      
      // Mengecek apakah status memuat kata "hadir" (termasuk 'hadir bersyarat')
      const isHadir = st.includes("hadir");
      
      // Melonggarkan saringan agar tidak langsung membuang data jika jurnal/jam belum terisi sempurna
      return isHadir;
    });

    let jpB = 0, jpC = 0;
    for (const s of selesai) {
      const paket = paketDariNamaKelas(s.kelas?.nama_kelas);
      if (paket === "B") {
        jpB++;
      } else if (paket === "C") {
        jpC++;
      } else {
        // Fallback default jika nama paket kelas tidak terdeteksi spesifik
        jpB++;
      }
    }

    return { jpB, jpC };
  } catch (err) {
    console.error("Gagal menghitung JP Paket Guru Bulan:", err);
    return { jpB: 0, jpC: 0 };
  }
}
// PERBAIKAN KEAMANAN: nominal slip gaji dulu dihitung di client lalu ditulis langsung ke tabel
// slip_gaji — tabel itu skarang dikunci dari tulisan langsung (anon cuma boleh SELECT), jadi
// perhitungan+penyimpanan dipindah ke Edge Function "recompute-slip-gaji" yang menghitung ULANG
// sendiri di server dari data sumber (JP+rate+tunjangan) — client tidak lagi bisa kirim angka jadi.
// Dipanggil tanpa PIN dengan sengaja (perhitungan ini otomatis & senyap, dipicu guru biasa buka
// dashboard-nya sendiri, bukan aksi admin) — amannya bukan dari otorisasi, tapi dari server yang
// SELALU hitung ulang sendiri, tidak pernah percaya angka dari client.
async function apiHitungSlipGaji(guruId, bulan, tahun) {
  try {
    const data = await _invokeFn("recompute-slip-gaji", { action: "recompute", guruId, bulan, tahun });
    return data && data.row;
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}
async function apiGetSlipGajiBulan(bulan, tahun) {
  try {
    return unwrap(await supa.from("slip_gaji").select("*,guru(nama,email,no_wa,jenis_guru,wali_kelas_id)").eq("bulan", bulan).eq("tahun", tahun).order("guru_id"));
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}
// Daftar guru_id yang benar-benar punya jam mengajar aktif di jadwal (dipakai Insentif & Laporan
// Kinerja supaya guru yang tidak mengajar/tidak terhubung ke Monitor tidak ikut muncul di rekap).
async function apiGetGuruIdsDenganJadwal() {
  try {
    const rows = unwrap(await supa.from("jadwal_pelajaran").select("guru_id").eq("aktif", true));
    return [...new Set(rows.map((r) => r.guru_id).filter(Boolean))];
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}

// ── KATALOG EKSKUL TERPUSAT (didaftarkan sekali di menu Kurikulum, dipakai di semua kelas) ──
async function apiGetEkskulMaster() {
  try {
    return unwrap(await supa.from("ekskul_master").select("*").order("nama_ekskul"));
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}
async function apiSimpanEkskulMaster(row) {
  try {
    return unwrap(await supa.from("ekskul_master").insert(row).select());
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}
async function apiHapusEkskulMaster(id) {
  try {
    return unwrap(await supa.from("ekskul_master").delete().eq("id", id));
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}
async function apiTandaiSlipTerkirim(id) {
  try {
    const data = await _invokeFn("recompute-slip-gaji", { action: "mark_terkirim", ids: [id] });
    return data && data.rows;
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}

// ── KEPALA SEKOLAH: antrian izin/sakit hari ini ──
async function apiGetAntrianHariIni() {
  try {
    return apiGetAntrianIzinSakit(tanggalISOFallback());
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}
async function apiGetRiwayatIzinSakit(dari, sampai) {
  try {
    return unwrap(
      await supa
        .from("pengajuan_izin_sakit")
        .select("*,guru(nama)")
        .gte("tanggal", dari)
        .lte("tanggal", sampai)
        .or("dihapus.is.null,dihapus.eq.false")
        .order("tanggal", { ascending: false })
    );
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}

// ── Reset otomatis: pengajuan izin/sakit yang belum diproses & tanggalnya sudah lewat
//    dianggap kedaluwarsa (ditutup otomatis) — mensimulasikan "reset setiap 00:00".
async function apiAutoTutupPengajuanKadaluarsa() {
  try {
    const hariIni = tanggalISOFallback();
    return unwrap(
      await supa
        .from("pengajuan_izin_sakit")
        .update({ status_verifikasi: "ditolak", diproses_oleh: "Sistem (kedaluwarsa)", diproses_at: new Date().toISOString() })
        .eq("status_verifikasi", "menunggu")
        .lt("tanggal", hariIni)
        .select()
    );
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}

// ── Reset otomatis: sesi absen hari-hari lalu yang belum lengkap (belum absen pulang / belum
//    absen sama sekali) dianggap Tidak Hadir (alpha) begitu hari sudah berganti — mensimulasikan
//    "reset jam 00:00" tanpa server yang selalu menyala. Sesi yang sudah lengkap (hadir+jurnal)
//    atau sudah izin/sakit/alpha tidak disentuh.
async function apiAutoAlphakanSesiKadaluarsa() {
  try {
    const hariIni = tanggalISOFallback();
    const kandidat = unwrap(
      await supa
        .from("absensi_sesi")
        .select("id,jam_masuk,jam_pulang,jurnal_id,status_kehadiran")
        .lt("tanggal", hariIni)
        .or("status_kehadiran.in.(belum_absen,hadir),status_kehadiran.is.null")
    );
    const idBelumLengkap = kandidat
      .filter((s) => !(s.jam_masuk && s.jam_pulang && s.jurnal_id))
      .map((s) => s.id);
    if (!idBelumLengkap.length) return [];
    return unwrap(
      await supa
        .from("absensi_sesi")
        .update({ status_kehadiran: "alpha" })
        .in("id", idBelumLengkap)
        .select()
    );
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}

// Materialisasi baris VIRTUAL (jadwal yang tidak pernah dibuka/diabsen sama sekali, dihitung murni
// di tampilan Riwayat Absen) jadi baris absensi_sesi SUNGGUHAN di DB — HANYA dipanggil saat admin
// sengaja klik "Perbaiki" pada baris itu, supaya alur Perbaikan Absen (yang butuh id sesi asli) bisa
// jalan. Status langsung "alpha" (sudah lewat, memang belum pernah diabsen), persis sama seperti
// sesi yang di-auto-alpha-kan oleh apiAutoAlphakanSesiKadaluarsa. TIDAK pernah dipanggil otomatis/
// massal — cuma satu baris, saat admin benar-benar ingin memperbaikinya.
async function apiBuatSesiAlphaDariVirtual({ guruId, jadwalId, kelasId, mapelId, tanggal }) {
  try {
    const existing = unwrap(
      await supa.from("absensi_sesi").select("*").eq("guru_id", guruId).eq("tanggal", tanggal).eq("jadwal_id", jadwalId).limit(1)
    );
    if (existing && existing[0]) return existing[0]; // jaga-jaga kalau sudah ada (race condition/klik dobel)
    const created = unwrap(
      await supa.from("absensi_sesi").insert({
        guru_id: guruId, jadwal_id: jadwalId, kelas_id: kelasId, mapel_id: mapelId, tanggal,
        status_kehadiran: "alpha", dihapus: false,
      }).select()
    );
    return created[0];
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}
// ── Perbaikan absen oleh admin (sesi yang sudah kadung alpha) ──
async function apiGetSesiUntukPerbaikan(sesiId) {
  try {
    const rows = unwrap(
      await supa
        .from("absensi_sesi")
        .select("*,guru(nama),kelas(nama_kelas),mapel(nama_mapel),jadwal_pelajaran(jam_mulai,jam_selesai)")
        .eq("id", sesiId)
        .limit(1)
    );
    return rows && rows[0];
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}
async function apiPerbaikanAbsenAdmin({ sesi, materiPokok, metodeArr, catatan, absensiSiswa }) {
  const hitung = { hadir: 0, izin: 0, sakit: 0, alpha: 0 };
  absensiSiswa.forEach((s) => {
    // ✅ Hadir: Termasuk status "hadir" AND status "hadir_bersyarat" (field tambahan)
    if (s.status === "hadir" || s.hadir_bersyarat) {
      hitung.hadir = (hitung.hadir || 0) + 1;
    } else if (s.status === "izin") {
      hitung.izin = (hitung.izin || 0) + 1;
    } else if (s.status === "sakit") {
      hitung.sakit = (hitung.sakit || 0) + 1;
    } else if (s.status === "alpha") {
      hitung.alpha = (hitung.alpha || 0) + 1;
    }
  });
  const jurnalRow = {
    sesi_id: sesi.id, guru_id: sesi.guru_id, kelas_id: sesi.kelas_id, mapel_id: sesi.mapel_id,
    jadwal_id: sesi.jadwal_id, tanggal: sesi.tanggal, materi_pokok: materiPokok, metode_mengajar: metodeArr, catatan,
    deskripsi_otomatis: buatDeskripsiOtomatis(materiPokok, metodeArr),
    jumlah_hadir: hitung.hadir, jumlah_izin: hitung.izin, jumlah_sakit: hitung.sakit, jumlah_alpha: hitung.alpha,
    jumlah_siswa: absensiSiswa.length,
  };

  // ── Langkah 0: Cek jurnal sebelumnya (hanya jika sesi sudah pernah diisi journal) ──
  // Jika jurnal sudah ada, baca data absensi_siswa lama untuk digabungkan (merge),
  // sehingga data yang sudah benar tidak akan terhapus dan hanya ditambahkan/disuaikan.
  let existingSiswaIds = [];
  try {
    const existingJurnal = unwrap(
      await supa.from("jurnal_kelas").select("id").eq("sesi_id", sesi.id).limit(1)
    );
    if (existingJurnal && existingJurnal[0]) {
      // Ambil data absensi_siswa lama yang sudah ada untuk sesi ini
      const existingAbsen = unwrap(
        await supa.from("absensi_siswa").select("siswa_id, status").eq("jurnal_id", existingJurnal.id)
      );
      existingSiswaIds = existingAbsen.map((a) => a.siswa_id);
      // Gabungkan: siswa yang sudah ada tetap dijaga, siswa baru ditambahkan
      const mergedSiswa = [...absensiSiswa];
      // Filter siswa baru yang belum ada di database (based on siswa_id)
      const siswaBelumAda = absensiSiswa.filter((s) => !existingSiswaIds.includes(s.siswa_id));
      if (siswaBelumAda.length) mergedSiswa.push(...siswaBelumAda);
      // Gunakan data yang sudah digabungkan untuk langkah selanjutnya
      // (kita tetap gunakan jurnalRow baru, tapi data absen akan difilter di langkah 2)
    }
  } catch (e) {
    // Jika gagal cek jurnal, lanjutkan saja dengan data baru (biasanya kasus pertama kali)
    console.error("[apiPerbaikanAbsenAdmin] Gagal cek jurnal sebelumnya:", e.message);
  }

  // ── Langkah 1: simpan jurnal_kelas ────────────────────────────────────────
  let jurnal;
  try {
    const rows = unwrap(await supa.from("jurnal_kelas").upsert(jurnalRow, { onConflict: "sesi_id" }).select());
    jurnal = rows && rows[0];
    if (!jurnal) throw new Error("Tidak ada data yang dikembalikan (constraint sesi_id belum ada?)");
  } catch (e) { throw new Error("[Langkah 1 – jurnal] " + e.message); }

  // ── Langkah 2: sinkron absensi_siswa ──────────────────────────────────────
  try {
    // Hapus dulu data absensi_siswa lama yang sesuai siswa yang sudah ada di database
    // (hanya hapus siswa yang lama, siswa baru akan tetap dimasukkan)
    if (existingSiswaIds.length) {
      await supa.from("absensi_siswa").delete().eq("jurnal_id", jurnal.id).in("siswa_id", existingSiswaIds);
    }
    // Siapkan data absensi: gabungkan siswa lama (yang tidak terhapus) dengan siswa baru
    const siswaRows = absensiSiswa.map((s) => ({ jurnal_id: jurnal.id, siswa_id: s.siswa_id, status: s.status }));
    if (siswaRows.length) unwrap(await supa.from("absensi_siswa").insert(siswaRows));
  } catch (e) { throw new Error("[Langkah 2 – siswa] " + e.message); }

  // ── Langkah 3: update absensi_sesi via RPC (bypass RLS) ──────────────────
  // Menggunakan fungsi perbaiki_sesi_hadir_bersyarat (SECURITY DEFINER) agar tidak
  // bergantung pada RLS policy — jalankan SQL pembuatan fungsi ini di Supabase terlebih dahulu.
  const jamMulaiJadwal = sesi.jadwal_pelajaran?.jam_mulai, jamSelesaiJadwal = sesi.jadwal_pelajaran?.jam_selesai;
  const jamMasukFallback = sesi.jam_masuk || (jamMulaiJadwal ? `${sesi.tanggal}T${jamMulaiJadwal}` : null);
  const jamPulangFallback = sesi.jam_pulang || (jamSelesaiJadwal ? `${sesi.tanggal}T${jamSelesaiJadwal}` : null);

  const { data: rpcData, error: rpcError } = await supa.rpc("perbaiki_sesi_hadir_bersyarat", {
    p_sesi_id:    sesi.id,
    p_jurnal_id:  jurnal.id,
    p_jam_masuk:  jamMasukFallback,
    p_jam_pulang: jamPulangFallback,
  });

  if (rpcError) throw new Error("[Langkah 3 – RPC] " + rpcError.message);
  if (!rpcData)  throw new Error("[Langkah 3 – RPC] Fungsi tidak mengembalikan data. Pastikan SQL RPC sudah dijalankan di Supabase.");
  return typeof rpcData === "string" ? JSON.parse(rpcData) : rpcData;
}

// Versi ringan dari perbaikan admin di atas — khusus utk guru yang SUDAH absen masuk & SUDAH mengisi
// jurnal, tapi lupa absen pulang. Tidak perlu form jurnal lagi (sudah ada), cukup isi jam_pulang dan
// tandai hadir_bersyarat, admin/Ryan Nugroho saja yang boleh panggil (dicek di sisi index.html).
async function apiBantuAbsenPulangAdmin(sesiId) {
  try {
    const rows = unwrap(
      await supa.from("absensi_sesi").select("*").eq("id", sesiId).limit(1)
    );
    const sesi = rows && rows[0];
    if (!sesi) throw new Error("Sesi tidak ditemukan");
    // Jam pulang HARUS jam sungguhan saat admin membantu (bukan jam selesai jadwal) — jadwal cuma
    // rencana, sedangkan di sini kita mencatat kapan sebenarnya bantuan absen pulang ini dilakukan.
    const update = {
      status_kehadiran: "hadir",
      hadir_bersyarat: true,
      catatan_admin: `⚠️ Hadir bersyarat — dibantu absen pulang oleh admin pada ${new Date().toLocaleString("id-ID")}.`,
      jam_pulang: new Date().toISOString(),
    };
    return unwrap(await supa.from("absensi_sesi").update(update).eq("id", sesiId).select())[0];
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}

// ── JURNAL TERTUNDA: admin bantu absen pulang SEKALIGUS (tanpa mengisi jurnal atas nama guru).
// Sesi tanpa jurnal ditandai "Jurnal tertunda" di catatan_admin → guru wajib melengkapinya saat login
// (lihat _muatJurnalTertunda di index.html). Tidak ada kolom baru: status tertunda = hadir_bersyarat
// && jam_masuk && !jurnal_id. Dua UPDATE massal (dengan/tanpa jurnal) supaya hemat request.
const JURNAL_TERTUNDA_BATAS_HARI = 3;
async function apiBantuLupaSekaligus(denganJurnalIds, tanpaJurnalIds) {
  try {
    const kini = new Date(), jam = kini.toLocaleString("id-ID");
    const dasar = { status_kehadiran: "hadir", hadir_bersyarat: true, jam_pulang: kini.toISOString() };
    let n = 0;
    if (denganJurnalIds.length) n += unwrap(await supa.from("absensi_sesi").update({ ...dasar,
      catatan_admin: `⚠️ Hadir bersyarat — dibantu absen pulang oleh admin pada ${jam}.` }).in("id", denganJurnalIds).select("id")).length;
    if (tanpaJurnalIds.length) n += unwrap(await supa.from("absensi_sesi").update({ ...dasar,
      catatan_admin: `⚠️ Hadir bersyarat — dibantu absen pulang oleh admin pada ${jam}. 📝 Jurnal tertunda: wajib dilengkapi guru (batas ${JURNAL_TERTUNDA_BATAS_HARI} hari).` }).in("id", tanpaJurnalIds).select("id")).length;
    return n;
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}
async function apiGetJurnalTertunda(guruId) {
  try {
    return unwrap(await supa.from("absensi_sesi")
      .select("*,kelas(nama_kelas),mapel(nama_mapel),jadwal_pelajaran(jam_mulai,jam_selesai)")
      .eq("guru_id", guruId).eq("hadir_bersyarat", true).is("jurnal_id", null).not("jam_masuk", "is", null)
      .order("tanggal"));
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}
async function apiTandaiJurnalTertundaLengkap(sesiId) {
  try {
    const r = unwrap(await supa.from("absensi_sesi").select("catatan_admin").eq("id", sesiId).limit(1))[0];
    const catatan = String(r?.catatan_admin || "").replace(/ ?📝 Jurnal tertunda:[^.]*\.?/, "") + ` ✅ Jurnal dilengkapi guru pada ${new Date().toLocaleString("id-ID")}.`;
    unwrap(await supa.from("absensi_sesi").update({ catatan_admin: catatan.trim() }).eq("id", sesiId));
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}
// Sesi Alpha tanpa absen masuk (≤14 hari) yang belum diajukan — untuk klarifikasi oleh guru sendiri
async function apiGetAlphaPerluKlarifikasi(guruId, dariTanggal) {
  try {
    const sesi = unwrap(await supa.from("absensi_sesi")
      .select("*,kelas(nama_kelas),mapel(nama_mapel),jadwal_pelajaran(jam_mulai,jam_selesai)")
      .eq("guru_id", guruId).eq("status_kehadiran", "alpha").is("jam_masuk", null).is("jurnal_id", null)
      .gte("tanggal", dariTanggal).order("tanggal"));
    if (!sesi.length) return [];
    const aju = unwrap(await supa.from("pengajuan_jurnal_terlambat").select("sesi_id").eq("guru_id", guruId).eq("status_verifikasi", "menunggu"));
    const sudah = new Set(aju.map((a) => a.sesi_id));
    return sesi.filter((s) => !s.hadir_bersyarat && !sudah.has(s.id));
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}
// Jurnal terakhir guru di kelas & mapel yang sama — untuk isian cepat "Lanjutan materi …"
async function apiGetJurnalTerakhir(guruId, kelasId, mapelId, sebelumTanggal) {
  try {
    let q = supa.from("jurnal_kelas").select("materi_pokok,metode_mengajar,tanggal").eq("guru_id", guruId).eq("kelas_id", kelasId).eq("mapel_id", mapelId);
    if (sebelumTanggal) q = q.lte("tanggal", sebelumTanggal);
    return unwrap(await q.order("tanggal", { ascending: false }).limit(1))[0] || null;
  } catch (e) {
    return null;
  }
}
// Rekap kedisiplinan (absen + jurnal) per guru dalam rentang tanggal — kolom ringkas saja (hemat kuota)
async function apiGetRekapKedisiplinan(dari, sampai, guruId) {
  try {
    let q = supa.from("absensi_sesi").select("guru_id,tanggal,status_kehadiran,hadir_bersyarat,jurnal_id,jam_masuk,jam_pulang,catatan_admin,guru(nama)")
      .gte("tanggal", dari).lte("tanggal", sampai);
    if (guruId) q = q.eq("guru_id", guruId);
    return unwrap(await q);
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}

// ── KALDIK (Kalender Pendidikan): hari libur & agenda ──
async function apiGetKaldikSemua() {
  try {
    return unwrap(await supa.from("kaldik_item").select("*").order("tanggal_mulai"));
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}
async function apiSimpanKaldikItem(row) {
  try {
    return unwrap(await supa.from("kaldik_item").upsert(row).select());
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}
async function apiHapusKaldikItem(id) {
  try {
    return unwrap(await supa.from("kaldik_item").delete().eq("id", id).select());
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}
async function apiHapusAlphaSesiRentang(dari, sampai) {
  try {
    return unwrap(await supa.from("absensi_sesi").delete()
      .eq("status_kehadiran", "alpha")
      .gte("tanggal", dari)
      .lte("tanggal", sampai)
      .select());
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}
async function apiImportKaldikBanyak(rows) {
  try {
    if (!rows.length) return [];
    return unwrap(await supa.from("kaldik_item").insert(rows).select());
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}
// Cek apakah tanggal (YYYY-MM-DD) termasuk hari libur kaldik. Kembalikan {libur, judul} atau null.
async function apiCekTanggalLiburKaldik(tanggal) {
  try {
    const rows = unwrap(
      await supa
        .from("kaldik_item")
        .select("judul")
        .eq("jenis", "libur")
        .lte("tanggal_mulai", tanggal)
        .gte("tanggal_selesai", tanggal)
        .limit(1)
    );
    return rows && rows[0] ? { libur: true, judul: rows[0].judul } : { libur: false };
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}

// ── SNACK MINGGUAN (catatan bendahara) ──
async function apiSimpanSnackRiwayatPekan(row) {
  try {
    return unwrap(await supa.from("snack_riwayat_pekan").insert(row).select())[0];
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}
async function apiGetSnackRiwayatPekan(limit = 20) {
  try {
    return unwrap(
      await supa.from("snack_riwayat_pekan").select("*").order("minggu_mulai", { ascending: false }).limit(limit)
    );
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}
async function apiHapusSnackRiwayatPekan(id) {
  try {
    return unwrap(await supa.from("snack_riwayat_pekan").delete().eq("id", id).select());
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}

// Agenda (bukan libur) dalam rentang tanggal tertentu, diurutkan tanggal terdekat dulu — untuk widget dashboard.
async function apiGetAgendaMendatang(dariTanggal, sampaiTanggal) {
  try {
    return unwrap(
      await supa
        .from("kaldik_item")
        .select("*")
        .eq("jenis", "agenda")
        .gte("tanggal_mulai", dariTanggal)
        .lte("tanggal_mulai", sampaiTanggal)
        .order("tanggal_mulai")
    );
  } catch (e) {
    throw new Error(_pesanErrorRamah(e) || e.message);
  }
}

// ── TUKAR JAM MENGAJAR (perlu persetujuan Kepala Sekolah) ──
const _SELECT_TUKAR_JADWAL = "*,guru_pengaju:guru_pengaju_id(nama),guru_tujuan:guru_tujuan_id(nama)," +
  "jadwal_asal:jadwal_asal_id(hari,jam_mulai,jam_selesai,kelas_id,mapel_id,kelas(nama_kelas),mapel(nama_mapel))," +
  "jadwal_tujuan:jadwal_tujuan_id(hari,jam_mulai,jam_selesai,kelas_id,mapel_id,kelas(nama_kelas),mapel(nama_mapel))";
async function apiGetJadwalMingguGuru(guruId) {
  return unwrap(
    await supa.from("jadwal_pelajaran")
      .select("id,hari,jam_mulai,jam_selesai,kelas_id,mapel_id,kelas(nama_kelas),mapel(nama_mapel)")
      .eq("guru_id", guruId).eq("aktif", true).order("hari").order("jam_mulai")
  );
}
async function apiAjukanTukarJadwal(row) {
  // Anti-dobel (sama seperti izin/sakit): jadwal + tanggal asal yang sama dan masih menunggu → pakai
  // pengajuan yang sudah ada, jangan buat baris kedua.
  const sudahAda = unwrap(
    await supa.from("tukar_jadwal").select("*")
      .eq("guru_pengaju_id", row.guru_pengaju_id).eq("jadwal_asal_id", row.jadwal_asal_id)
      .eq("tanggal_asal", row.tanggal_asal).eq("status", "menunggu").limit(1)
  );
  if (sudahAda.length) return sudahAda[0];
  return unwrap(await supa.from("tukar_jadwal").insert({ ...row, status: "menunggu" }).select())[0];
}
// Guru menarik sendiri pengajuan tukar/pindah jam-nya — HANYA yang masih "menunggu" dan miliknya
// sendiri (yang sudah diproses tidak bisa ditarik, karena jadwalnya mungkin sudah terlanjur dipakai).
async function apiBatalkanTukarJadwal(id, guruId) {
  const r = unwrap(await supa.from("tukar_jadwal").delete().eq("id", id).eq("guru_pengaju_id", guruId).eq("status", "menunggu").select());
  if (!r.length) throw new Error("Pengajuan ini sudah diproses admin, jadi tidak bisa dibatalkan lagi.");
  return r[0];
}
async function apiGetTukarJadwalSaya(guruId) {
  return unwrap(
    await supa.from("tukar_jadwal").select(_SELECT_TUKAR_JADWAL)
      .or(`guru_pengaju_id.eq.${guruId},guru_tujuan_id.eq.${guruId}`)
      .order("created_at", { ascending: false }).limit(10)
  );
}
async function apiGetTukarJadwalMenunggu() {
  return unwrap(
    await supa.from("tukar_jadwal").select(_SELECT_TUKAR_JADWAL).eq("status", "menunggu").order("created_at")
  );
}
// Riwayat SEMUA pengajuan tukar/pindah jadwal (disetujui maupun ditolak) dalam rentang tanggal —
// dipakai Kepsek di halaman Perizinan supaya yang sudah diproses tidak hilang begitu saja dari
// antrian "Menunggu" (sebelumnya cuma bisa dilihat masing-masing guru lewat widget di Absensi Guru).
async function apiGetRiwayatTukarJadwalSemua(dari, sampai) {
  return unwrap(
    await supa.from("tukar_jadwal").select(_SELECT_TUKAR_JADWAL)
      .neq("status", "menunggu")
      .gte("tanggal_asal", dari).lte("tanggal_asal", sampai)
      .order("diproses_at", { ascending: false })
  );
}
// Jumlah total yang menunggu diproses Kepala Sekolah (izin/sakit hari ini + tukar jadwal) — dipakai
// untuk badge notifikasi angka di sidebar menu Kepala Sekolah.
async function apiGetJumlahAntrianKepsek() {
  const [izinSakit, tukar, jurnal] = await Promise.all([
    apiGetAntrianIzinSakit(tanggalISOFallback()),
    apiGetTukarJadwalMenunggu(),
    apiGetPengajuanJurnalMenunggu().catch(() => []),
  ]);
  return izinSakit.length + tukar.length + jurnal.length;
}

// ── PENGAJUAN JURNAL TERLAMBAT ──────────────────────────────────────────────
// Guru yang sudah absen masuk tapi lupa isi jurnal+pulang di hari lalu bisa
// lapor ke admin. Admin approve → jurnal tersimpan + absen pulang otomatis.

async function apiKirimPengajuanJurnalTerlambat({ sesiId, guruId, tanggal, materiPokok, metodeMengajar, catatan, absensiSiswa }) {
  try {
    // Cek apakah sudah ada pengajuan menunggu untuk sesi ini
    const existing = unwrap(
      await supa.from("pengajuan_jurnal_terlambat")
        .select("id,status_verifikasi")
        .eq("sesi_id", sesiId)
        .eq("status_verifikasi", "menunggu")
        .limit(1)
    );
    if (existing.length) throw new Error("Laporan jurnal untuk sesi ini sudah ada dan sedang menunggu persetujuan admin.");
    return unwrap(
      await supa.from("pengajuan_jurnal_terlambat").insert({
        sesi_id: sesiId, guru_id: guruId, tanggal,
        materi_pokok: materiPokok, metode_mengajar: metodeMengajar,
        catatan, absensi_siswa: absensiSiswa,
      }).select()
    );
  } catch (e) { throw new Error(_pesanErrorRamah(e) || e.message); }
}

async function apiGetPengajuanJurnalMenunggu() {
  try {
    return unwrap(
      await supa.from("pengajuan_jurnal_terlambat")
        // PERBAIKAN: tabel ini punya 2 FK constraint yang sama-sama menunjuk guru_id -> guru.id
        // ("pengajuan_jurnal_terlambat_guru_id_fkey" bawaan & "pjt_guru_id_fk" duplikat) — PostgREST
        // menolak embed generik "guru(nama)" karena ambigu mau pakai constraint yang mana. Pakai nama
        // constraint eksplisit di sini supaya tidak ambigu (constraint duplikatnya sendiri aman
        // dibiarkan di database, tidak perlu migrasi).
        .select("*,guru!pengajuan_jurnal_terlambat_guru_id_fkey(nama),absensi_sesi!pengajuan_jurnal_terlambat_sesi_id_fkey(kelas_id,mapel_id,jadwal_id,tanggal,jam_masuk,kelas(nama_kelas),mapel(nama_mapel),jadwal_pelajaran(jam_mulai,jam_selesai))")
        .eq("status_verifikasi", "menunggu")
        .order("created_at", { ascending: true })
    );
  } catch (e) { throw new Error(_pesanErrorRamah(e) || e.message); }
}

async function apiGetRiwayatPengajuanJurnal(dari, sampai) {
  try {
    return unwrap(
      await supa.from("pengajuan_jurnal_terlambat")
        .select("*,guru(nama),absensi_sesi(kelas_id,mapel_id,kelas(nama_kelas),mapel(nama_mapel))")
        .gte("tanggal", dari)
        .lte("tanggal", sampai)
        .order("tanggal", { ascending: false })
    );
  } catch (e) { throw new Error(_pesanErrorRamah(e) || e.message); }
}

async function apiProsesJurnalTerlambat(id, disetujui, catatanAdmin) {
  try {
    const now = new Date().toISOString();
    if (disetujui) {
      // 1. Ambil data pengajuan + sesi
      const rows = unwrap(
        await supa.from("pengajuan_jurnal_terlambat")
          .select("*,absensi_sesi!pengajuan_jurnal_terlambat_sesi_id_fkey(id,guru_id,kelas_id,mapel_id,jadwal_id,tanggal,jadwal_pelajaran(jam_selesai))")
          .eq("id", id).limit(1)
      );
      if (!rows.length) throw new Error("Pengajuan tidak ditemukan.");
      const peng = rows[0];
      const sesi = peng.absensi_sesi;
      const absensiSiswa = peng.absensi_siswa || [];

      // 2. Hitung rekap kehadiran
      const jumlahHadir = absensiSiswa.filter(s => s.status === "hadir").length;
      const jumlahIzin  = absensiSiswa.filter(s => s.status === "izin").length;
      const jumlahSakit = absensiSiswa.filter(s => s.status === "sakit").length;
      const jumlahAlpha = absensiSiswa.filter(s => s.status === "alpha").length;

      // 3. Upsert jurnal_kelas
      const existingJurnal = unwrap(
        await supa.from("jurnal_kelas").select("id").eq("sesi_id", sesi.id).limit(1)
      );
      let jurnalId;
      if (existingJurnal.length) {
        jurnalId = existingJurnal[0].id;
        unwrap(await supa.from("jurnal_kelas").update({
          materi_pokok: peng.materi_pokok, metode_mengajar: peng.metode_mengajar,
          catatan: peng.catatan, jumlah_hadir: jumlahHadir, jumlah_izin: jumlahIzin,
          jumlah_sakit: jumlahSakit, jumlah_alpha: jumlahAlpha, jumlah_siswa: absensiSiswa.length,
          updated_at: now,
        }).eq("id", jurnalId));
      } else {
        const [jurnal] = unwrap(await supa.from("jurnal_kelas").insert({
          sesi_id: sesi.id, guru_id: sesi.guru_id, kelas_id: sesi.kelas_id,
          mapel_id: sesi.mapel_id, jadwal_id: sesi.jadwal_id, tanggal: sesi.tanggal,
          materi_pokok: peng.materi_pokok, metode_mengajar: peng.metode_mengajar,
          catatan: peng.catatan, jumlah_hadir: jumlahHadir, jumlah_izin: jumlahIzin,
          jumlah_sakit: jumlahSakit, jumlah_alpha: jumlahAlpha, jumlah_siswa: absensiSiswa.length,
        }).select());
        jurnalId = jurnal.id;
      }

      // 4. Isi absensi_siswa
      if (absensiSiswa.length) {
        await supa.from("absensi_siswa").delete().eq("jurnal_id", jurnalId);
        unwrap(await supa.from("absensi_siswa").insert(
          absensiSiswa.map(s => ({ jurnal_id: jurnalId, siswa_id: s.siswa_id, status: s.status }))
        ));
      }

      // 5. Update absensi_sesi: jurnal_id, jam_pulang, status_kehadiran
      const jamSelesai = sesi.jadwal_pelajaran?.jam_selesai;
      const jamPulang  = jamSelesai && sesi.tanggal
        ? new Date(`${sesi.tanggal}T${jamSelesai}`).toISOString()
        : now;
      // Disetujui = HADIR BERSYARAT (bukan hadir penuh) — sesi ini terlewat dicatat tepat waktu,
      // dilengkapi lewat pengajuan (lupa absen / lupa jurnal & pulang).
      unwrap(await supa.from("absensi_sesi").update({
        jurnal_id: jurnalId, jam_pulang: jamPulang,
        status_kehadiran: "hadir", hadir_bersyarat: true,
        catatan_admin: `⚠️ Hadir bersyarat — pengajuan guru disetujui pada ${new Date().toLocaleString("id-ID")}.`,
        updated_at: now,
      }).eq("id", sesi.id));

    }

    // 6. Update status pengajuan
    unwrap(await supa.from("pengajuan_jurnal_terlambat").update({
      status_verifikasi: disetujui ? "disetujui" : "ditolak",
      diproses_oleh: "Kepala Sekolah",
      diproses_at: now,
      catatan_admin: catatanAdmin || null,
    }).eq("id", id));
  } catch (e) { throw new Error(_pesanErrorRamah(e) || e.message); }
}
async function apiProsesTukarJadwal(id, status, catatan) {
  return unwrap(
    await supa.from("tukar_jadwal")
      .update({ status, catatan_kepsek: catatan || null, diproses_at: new Date().toISOString() })
      .eq("id", id).select()
  )[0];
}
// Tukar jadwal yang sudah DISETUJUI dan berlaku PERSIS untuk guru & tanggal ini (baik sebagai
// pengaju maupun tujuan) — dipakai bootDataGuru() supaya jadwal hari ini otomatis menampilkan hasil
// tukar jam, bukan jadwal baku semula.
async function apiGetTukarJadwalAktifHariIni(guruId, tanggal) {
  return unwrap(
    await supa.from("tukar_jadwal").select(_SELECT_TUKAR_JADWAL)
      .eq("status", "disetujui")
      .or(`and(guru_pengaju_id.eq.${guruId},tanggal_asal.eq.${tanggal}),and(guru_tujuan_id.eq.${guruId},tanggal_tujuan.eq.${tanggal})`)
  );
}

// ── KOP SOAL (kop surat lembar soal ujian, per kategori: diniyyah/umum x ganjil/genap x paket B/C) ──
async function apiGetKopSoalSemua() {
  return unwrap(await supa.from("kop_soal").select("*"));
}
async function apiSimpanKopSoal(row) {
  return unwrap(await supa.from("kop_soal").upsert(row, { onConflict: "kategori" }).select());
}

// ── MODUL AJAR (perpustakaan buku/modul, gaya rak e-reader) ──
// Kombinasi Kelas+Mapel yang boleh dipilih saat mengunggah modul HARUS mengikuti Jadwal Pelajaran
// yang sudah ada (bukan daftar manual terpisah), supaya rak buku selalu sinkron dengan mapel yang
// benar-benar diajarkan di tiap kelas. Diambil dari jadwal_pelajaran yang aktif, lalu di-dedupe
// per pasangan kelas_id+mapel_id di sisi client (sederhana & cukup untuk skala data sekolah ini).
async function apiGetPetaMapelKelasDariJadwal() {
  const rows = unwrap(await supa.from("jadwal_pelajaran")
    .select("kelas_id,mapel_id,kelas(nama_kelas),mapel(nama_mapel,masuk_umum,masuk_diniyyah)")
    .eq("aktif", true));
  const peta = new Map();
  rows.forEach((r) => {
    if (!r.kelas_id || !r.mapel_id) return;
    const kunci = `${r.kelas_id}_${r.mapel_id}`;
    if (!peta.has(kunci)) {
      peta.set(kunci, {
        kelas_id: r.kelas_id, mapel_id: r.mapel_id,
        nama_kelas: r.kelas?.nama_kelas || "-", nama_mapel: r.mapel?.nama_mapel || "-",
        masuk_umum: !!r.mapel?.masuk_umum, masuk_diniyyah: !!r.mapel?.masuk_diniyyah,
      });
    }
  });
  return Array.from(peta.values());
}
async function apiGetModulAjar({ kelasId, mapelId } = {}) {
  let q = supa.from("modul_ajar").select("*,kelas(nama_kelas),mapel(nama_mapel,masuk_umum,masuk_diniyyah)").order("urutan").order("created_at");
  if (kelasId) q = q.eq("kelas_id", kelasId);
  if (mapelId) q = q.eq("mapel_id", mapelId);
  return unwrap(await q);
}
async function apiSimpanModulAjar(row) {
  if (row.id) return unwrap(await supa.from("modul_ajar").update(row).eq("id", row.id).select());
  return unwrap(await supa.from("modul_ajar").insert({ id: crypto.randomUUID(), ...row }).select());
}
async function apiHapusModulAjar(id) {
  return unwrap(await supa.from("modul_ajar").delete().eq("id", id));
}

// ── CP-ATP (dokumen Capaian Pembelajaran - Alur Tujuan Pembelajaran) ──
// Beda dengan Modul Ajar: satu dokumen CP-ATP bisa berlaku untuk BANYAK kelas sekaligus (mis. Nahwu
// Kelas 10-12 dalam satu file), makanya kelas_ids berupa array, bukan satu kelas_id. Juga TIDAK
// dibatasi harus ada di Jadwal Pelajaran aktif — CP-ATP adalah dokumen perencanaan kurikulum yang
// wajar disiapkan sebelum/lepas dari jadwal semester berjalan, jadi Mapel & Kelas yang bisa dipilih
// saat unggah adalah SEMUA yang terdaftar (LOOKUP.mapel / LOOKUP.kelas di sisi client).
async function apiGetCpAtp() {
  return unwrap(await supa.from("cp_atp").select("*,mapel(nama_mapel,masuk_umum,masuk_diniyyah)").order("judul"));
}
async function apiSimpanCpAtp(row) {
  if (row.id) return unwrap(await supa.from("cp_atp").update(row).eq("id", row.id).select());
  return unwrap(await supa.from("cp_atp").insert(row).select());
}
async function apiHapusCpAtp(id) {
  return unwrap(await supa.from("cp_atp").delete().eq("id", id));
}

// ── INSENTIF MUSYRIF (Mudir, Musyrif Halaqah/Kamar, Tata Usaha, dsb — struktural, TERPISAH dari
// insentif JP mengajar di slip_gaji). Meniru struktur file Excel "Insentif ..._Musyrif.xlsx" yang
// sudah dipakai sekolah: tiap guru bisa punya beberapa baris "penugasan" jabatan sekaligus (rangkap
// jabatan, mis. Mudir Madrasah + PJ. Asrama), nominal komponennya ikut default jabatan kecuali
// ditimpa manual per orang (override_*). ──
async function apiGetJabatanMusyrif() {
  return unwrap(await supa.from("jabatan_musyrif").select("*").order("urutan").order("nama_jabatan"));
}
async function apiSimpanJabatanMusyrif(row) {
  if (row.id) return unwrap(await supa.from("jabatan_musyrif").update(row).eq("id", row.id).select())[0];
  return unwrap(await supa.from("jabatan_musyrif").insert(row).select())[0];
}
async function apiHapusJabatanMusyrif(id) {
  return unwrap(await supa.from("jabatan_musyrif").delete().eq("id", id));
}

async function apiGetMusyrifPenugasan() {
  return unwrap(
    await supa.from("musyrif_penugasan")
      .select("*,guru(nama,foto_url,email,no_wa,status_aktif),jabatan_musyrif(*)")
      .eq("aktif", true)
      .order("urutan")
  );
}
async function apiSimpanMusyrifPenugasan(row) {
  if (row.id) return unwrap(await supa.from("musyrif_penugasan").update(row).eq("id", row.id).select())[0];
  return unwrap(await supa.from("musyrif_penugasan").insert(row).select())[0];
}
// Soft-delete (aktif=false) — bukan hapus permanen — supaya histori insentif_musyrif bulan-bulan
// lalu yang sudah tercatat tidak ikut hilang/rusak (beda dari cp_atp/modul_ajar yang memang hapus
// permanen tanpa histori bulanan terkait).
async function apiHapusMusyrifPenugasan(id) {
  return unwrap(await supa.from("musyrif_penugasan").update({ aktif: false }).eq("id", id).select());
}

// Hitung/sinkronkan 1 baris insentif_musyrif bulan berjalan dari satu penugasan (pakai override
// kalau diisi, kalau tidak pakai default dari jabatan_musyrif) — dipanggil untuk tiap penugasan
// aktif setiap kali halaman Insentif Musyrif dibuka, sama seperti apiHitungSlipGaji untuk guru
// mengajar (supaya nominal selalu fresh tanpa perlu tombol hitung manual).
// PERBAIKAN KEAMANAN: sama seperti apiHitungSlipGaji — perhitungan+penyimpanan dipindah ke Edge
// Function "recompute-insentif-musyrif" yang mengambil ULANG data penugasan+jabatan_musyrif
// langsung dari server (bukan percaya objek `penugasan` yang dikirim dari client) lalu menghitung
// sendiri nominalnya. Tabel insentif_musyrif dikunci dari tulisan langsung anon.
async function apiHitungInsentifMusyrif(penugasan, bulan, tahun) {
  const data = await _invokeFn("recompute-insentif-musyrif", { action: "recompute", penugasanId: penugasan.id, bulan, tahun });
  return data && data.row;
}
// PENTING: pakai musyrif_penugasan!inner (bukan join biasa) supaya baris insentif_musyrif yang
// penugasannya sudah dihapus (soft-delete, aktif=false) ikut TERSARING dari hasil — kalau tidak,
// snapshot bulan berjalan yang sudah kadung tersimpan sebelum dihapus akan tetap muncul di tabel/
// ekspor meskipun penugasannya sudah dihapus dari halaman Setting/Penugasan.
async function apiGetInsentifMusyrifBulan(bulan, tahun) {
  return unwrap(
    await supa.from("insentif_musyrif")
      .select("*,guru(nama,foto_url,email,no_wa),musyrif_penugasan!inner(id,tmt,status,is_utama,urutan,guru_id,aktif,jabatan_musyrif(nama_jabatan))")
      .eq("bulan", bulan).eq("tahun", tahun).eq("musyrif_penugasan.aktif", true)
  );
}
async function apiGetInsentifMusyrifGuru(guruId, bulan, tahun) {
  return unwrap(
    await supa.from("insentif_musyrif")
      .select("*,musyrif_penugasan!inner(tmt,status,is_utama,aktif,jabatan_musyrif(nama_jabatan))")
      .eq("guru_id", guruId).eq("bulan", bulan).eq("tahun", tahun).eq("musyrif_penugasan.aktif", true)
  );
}
async function apiTandaiSlipMusyrifTerkirim(ids) {
  if (!ids || !ids.length) return [];
  const data = await _invokeFn("recompute-insentif-musyrif", { action: "mark_terkirim", ids });
  return data && data.rows;
}

// ── Tanda tangan Bendahara (gambar, dipakai di Slip Gaji) — lewat query TERPISAH dari
// KOLOM_PENGATURAN_SEKOLAH_PUBLIK (query boot utama), pola yang sama dengan apiGetBopTipeCustom():
// supaya kalau migrasi kolom ini belum dijalankan, itu TIDAK ikut menggagalkan apiGetPengaturanSekolah()
// yang dipanggil setiap kali aplikasi dibuka.
async function apiGetTtdBendaharaUrl() {
  try {
    const rows = unwrap(await supa.from("pengaturan_sekolah").select("ttd_bendahara_url").eq("id", 1).limit(1));
    return (rows && rows[0] && rows[0].ttd_bendahara_url) || null;
  } catch (e) { return null; }
}
async function apiSimpanTtdBendaharaUrl(url) {
  try { return unwrap(await supa.from("pengaturan_sekolah").update({ ttd_bendahara_url: url }).eq("id", 1).select("ttd_bendahara_url")); }
  catch (e) { throw new Error(_pesanErrorRamah(e) || e.message); }
}

// ── Arsip Nomor Slip Gaji — nomor resmi per guru per bulan (stabil, tidak berubah tiap unduh ulang) ──
async function apiGetSlipGajiArsipPeriode(bulan, tahun) {
  try { return unwrap(await supa.from("slip_gaji_arsip").select("*,guru(nama)").eq("bulan", bulan).eq("tahun", tahun).order("urut")); }
  catch (e) { throw new Error(_pesanErrorRamah(e) || e.message); }
}
async function apiGetSlipGajiArsipTahun(tahun) {
  try { return unwrap(await supa.from("slip_gaji_arsip").select("*,guru(nama)").eq("tahun", tahun).order("bulan").order("urut")); }
  catch (e) { throw new Error(_pesanErrorRamah(e) || e.message); }
}
async function apiTambahSlipGajiArsip(rows) {
  try { return unwrap(await supa.from("slip_gaji_arsip").insert(rows).select()); }
  catch (e) { throw new Error(_pesanErrorRamah(e) || e.message); }
}

// ============================================================
//  BEL SEKOLAH — 3 bel (masuk pertama/kedua, pulang) x 3 bahasa (ID/AR/EN)
// ============================================================
async function apiGetBelSekolahItems() {
  try { return unwrap(await supa.from("bel_sekolah_item").select("*").order("urutan")); }
  catch (e) { return []; } // isolated — jangan sampai bikin halaman lain ikut rusak kalau migrasi belum jalan
}
async function apiSimpanBelSekolahItem(row) {
  try { return unwrap(await supa.from("bel_sekolah_item").update(row).eq("id", row.id).select()); }
  catch (e) { throw new Error(_pesanErrorRamah(e) || e.message); }
}
// SENGAJA query terpisah dari KOLOM_PENGATURAN_SEKOLAH_PUBLIK (query boot utama) — pola yang sama
// dengan apiGetBopTipeCustom()/apiGetTtdBendaharaUrl(), supaya aman kalau migrasi belum dijalankan.
async function apiGetBelPengaturan() {
  try {
    const rows = unwrap(await supa.from("pengaturan_sekolah").select("bel_bahasa_aktif,bel_voice_rate,bel_voice_id,bel_voice_ar,bel_voice_en").eq("id", 1).limit(1));
    return (rows && rows[0]) || {};
  } catch (e) { return {}; }
}
async function apiSimpanBelPengaturan(data) {
  try { return unwrap(await supa.from("pengaturan_sekolah").update(data).eq("id", 1).select("bel_bahasa_aktif,bel_voice_rate,bel_voice_id,bel_voice_ar,bel_voice_en")); }
  catch (e) { throw new Error(_pesanErrorRamah(e) || e.message); }
}

// ============================================================
//  BOP (Bantuan Operasional Pendidikan) — Laporan & Data Anggaran
// ============================================================

// ── Daftar jenis Laporan BOP custom (disimpan di pengaturan_sekolah.bop_laporan_tipe_custom) ──
// SENGAJA lewat query terpisah, BUKAN ikut ditambahkan ke KOLOM_PENGATURAN_SEKOLAH_PUBLIK (query
// boot utama yang dipanggil setiap kali aplikasi dibuka) — supaya kalau migrasi kolom ini belum
// dijalankan di database, itu tidak ikut menggagalkan apiGetPengaturanSekolah() dan menjatuhkan
// lokasi/radius absen guru ke nilai default yang salah.
async function apiGetBopTipeCustom() {
  try {
    const rows = unwrap(await supa.from("pengaturan_sekolah").select("bop_laporan_tipe_custom").eq("id", 1).limit(1));
    return (rows && rows[0] && rows[0].bop_laporan_tipe_custom) || [];
  } catch (e) { return []; } // kolom/tabel belum ada (migrasi belum dijalankan) — anggap kosong saja
}
async function apiSimpanBopTipeCustom(daftar) {
  try { return unwrap(await supa.from("pengaturan_sekolah").update({ bop_laporan_tipe_custom: daftar }).eq("id", 1).select("bop_laporan_tipe_custom")); }
  catch (e) { throw new Error(_pesanErrorRamah(e) || e.message); }
}

// ── LAPORAN BOP: lampiran foto/dokumen per jenis laporan + bulan (Listrik/Wifi/Kombel/custom) ──
async function apiGetBopLaporanFoto(tipe, tahun, bulan) {
  try {
    return unwrap(
      await supa.from("bop_laporan_foto").select("*")
        .eq("tipe", tipe).eq("tahun", tahun).eq("bulan", bulan)
        .order("kategori").order("urutan").order("dibuat_at")
    );
  } catch (e) { throw new Error(_pesanErrorRamah(e) || e.message); }
}
async function apiTambahBopLaporanFoto(row) {
  try { return unwrap(await supa.from("bop_laporan_foto").insert(row).select()); }
  catch (e) { throw new Error(_pesanErrorRamah(e) || e.message); }
}
async function apiHapusBopLaporanFoto(id) {
  try { return unwrap(await supa.from("bop_laporan_foto").delete().eq("id", id)); }
  catch (e) { throw new Error(_pesanErrorRamah(e) || e.message); }
}

// ── DATA BOP: master daftar item anggaran (baris tabel) ──
async function apiGetBopAnggaranItem() {
  try { return unwrap(await supa.from("bop_anggaran_item").select("*").eq("aktif", true).order("urutan")); }
  catch (e) { throw new Error(_pesanErrorRamah(e) || e.message); }
}
async function apiTambahBopAnggaranItem(nama, urutan) {
  try { return (unwrap(await supa.from("bop_anggaran_item").insert({ nama, urutan }).select()))[0]; }
  catch (e) { throw new Error(_pesanErrorRamah(e) || e.message); }
}
async function apiUbahBopAnggaranItem(id, data) {
  try { return unwrap(await supa.from("bop_anggaran_item").update(data).eq("id", id).select()); }
  catch (e) { throw new Error(_pesanErrorRamah(e) || e.message); }
}
async function apiHapusBopAnggaranItem(id) {
  // Nonaktifkan saja (soft-delete) — supaya anggaran & riwayat realisasi bulan-bulan sebelumnya
  // yang sudah tercatat tetap utuh, tidak ikut hilang hanya karena baris itemnya dihapus.
  try { return unwrap(await supa.from("bop_anggaran_item").update({ aktif: false }).eq("id", id)); }
  catch (e) { throw new Error(_pesanErrorRamah(e) || e.message); }
}

// ── DATA BOP: nominal anggaran per item per bulan (+ status lunas manual) ──
async function apiGetBopAnggaranBulan(tahun) {
  try { return unwrap(await supa.from("bop_anggaran_bulan").select("*").eq("tahun", tahun)); }
  catch (e) { throw new Error(_pesanErrorRamah(e) || e.message); }
}
async function apiSimpanBopAnggaranBulan(itemId, tahun, bulan, nominal) {
  try {
    return unwrap(
      await supa.from("bop_anggaran_bulan")
        .upsert({ item_id: itemId, tahun, bulan, nominal, updated_at: new Date().toISOString() }, { onConflict: "item_id,tahun,bulan" })
        .select()
    );
  } catch (e) { throw new Error(_pesanErrorRamah(e) || e.message); }
}
async function apiSetBopLunasManual(itemId, tahun, bulan, lunasManual, catatanManual) {
  try {
    return unwrap(
      await supa.from("bop_anggaran_bulan")
        .upsert(
          { item_id: itemId, tahun, bulan, lunas_manual: lunasManual, catatan_manual: catatanManual || null, updated_at: new Date().toISOString() },
          { onConflict: "item_id,tahun,bulan" }
        )
        .select()
    );
  } catch (e) { throw new Error(_pesanErrorRamah(e) || e.message); }
}

// ── DATA BOP: riwayat realisasi/transaksi belanja (bisa lebih dari 1x per item per bulan — dicicil) ──
async function apiGetBopRealisasi(tahun, { itemId, bulan } = {}) {
  try {
    let q = supa.from("bop_realisasi").select("*,item:item_id(nama)").eq("tahun", tahun);
    if (itemId) q = q.eq("item_id", itemId);
    if (bulan) q = q.eq("bulan", bulan);
    return unwrap(await q.order("tanggal", { ascending: false }).order("dibuat_at", { ascending: false }));
  } catch (e) { throw new Error(_pesanErrorRamah(e) || e.message); }
}
async function apiTambahBopRealisasi(row) {
  try { return (unwrap(await supa.from("bop_realisasi").insert(row).select()))[0]; }
  catch (e) { throw new Error(_pesanErrorRamah(e) || e.message); }
}
async function apiHapusBopRealisasi(id) {
  try { return unwrap(await supa.from("bop_realisasi").delete().eq("id", id)); }
  catch (e) { throw new Error(_pesanErrorRamah(e) || e.message); }
}

// ============================================================
//  JABATAN (dropdown resmi) & ADMIN KEDUA — TERPISAH dari jabatan_musyrif (itu khusus struktur
//  Musyrif/insentif, sudah ada sebelumnya). Jabatan di sini untuk peran struktural umum (Kepala
//  Sekolah, Bendahara, TU, Admin, dst) yang dipakai Data Guru + penentuan akses (Kepsek/TU/Admin
//  Kedua) + auto-isi nama di kop surat. Semua getter di sini SENGAJA isolated (return [] kalau
//  gagal) supaya kalau migrasi SQL-nya belum dijalankan, boot utama aplikasi (kelas/mapel/guru)
//  tidak ikut rusak — pola yang sama dengan apiGetBelSekolahItems() dkk.
// ============================================================
async function apiGetJabatanMaster() {
  try { return unwrap(await supa.from("jabatan_master").select("*").eq("aktif", true).order("urutan")); }
  catch (e) { return []; }
}
async function apiSimpanJabatanMaster(row) {
  try {
    if (row.id) return (unwrap(await supa.from("jabatan_master").update(row).eq("id", row.id).select()))[0];
    return (unwrap(await supa.from("jabatan_master").insert(row).select()))[0];
  } catch (e) { throw new Error(_pesanErrorRamah(e) || e.message); }
}
async function apiHapusJabatanMaster(id) {
  try { return unwrap(await supa.from("jabatan_master").update({ aktif: false }).eq("id", id)); }
  catch (e) { throw new Error(_pesanErrorRamah(e) || e.message); }
}
// Semua relasi guru<->jabatan sekaligus (1 query, dipakai bangun peta lookup saat boot) — BUKAN
// per-guru, supaya tidak query berkali-kali untuk tiap baris di tabel Data Guru.
async function apiGetSemuaGuruJabatan() {
  try { return unwrap(await supa.from("guru_jabatan").select("guru_id,jabatan_id,is_utama,jabatan_master(kode,nama)")); }
  catch (e) { return []; }
}
async function apiGetGuruJabatan(guruId) {
  try { return unwrap(await supa.from("guru_jabatan").select("*,jabatan_master(kode,nama)").eq("guru_id", guruId)); }
  catch (e) { return []; }
}
// Ganti SEMUA jabatan guru ini sekaligus (hapus baris lama, insert baris baru) — polanya sama
// dengan simpanFormGuru untuk Riwayat Pendidikan: form selalu kirim status akhir yang lengkap,
// bukan diff, jadi "hapus-lalu-insert-ulang" lebih sederhana & tidak mungkin nyangkut data lama.
async function apiSimpanGuruJabatanBulk(guruId, items) {
  try {
    await supa.from("guru_jabatan").delete().eq("guru_id", guruId);
    if (!items.length) return [];
    return unwrap(await supa.from("guru_jabatan").insert(items.map((it) => ({ guru_id: guruId, jabatan_id: it.jabatan_id, is_utama: !!it.is_utama }))).select());
  } catch (e) { throw new Error(_pesanErrorRamah(e) || e.message); }
}
// Izin menu khusus "Admin Kedua" (guru berjabatan Admin tapi bukan admin utama) — semua sekaligus,
// dipakai bangun peta lookup saat boot.
async function apiGetSemuaAdminIzin() {
  try { return unwrap(await supa.from("guru_admin_izin").select("guru_id,menu_keys")); }
  catch (e) { return []; }
}
async function apiSimpanGuruAdminIzin(guruId, menuKeys) {
  try {
    return unwrap(
      await supa.from("guru_admin_izin")
        .upsert({ guru_id: guruId, menu_keys: menuKeys, updated_at: new Date().toISOString() }, { onConflict: "guru_id" })
        .select()
    );
  } catch (e) { throw new Error(_pesanErrorRamah(e) || e.message); }
}
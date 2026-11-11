// ============================================================
//  PENGUMUMAN WA GRUP GURU — template otomatis dari KALENDER AKADEMIK (kaldik)
//  Kegiatan di kaldik dikenali dari judulnya (UAS/PAS, UTS/PTS, ujian tahfizh, rapat, pembagian rapor,
//  libur), lalu aplikasi mengusulkan pengumuman + TANGGAL KIRIM-nya:
//   • Akhir KBM (H-7)          • Pengumpulan soal ke admin (batas H-14 ujian, dikirim H-21)
//   • Jadwal pelaksanaan ujian (H-3)   • Pengumpulan nilai (batas H-7 bagi rapor) + daftar guru & mapel yang belum lengkap
//   • Undangan rapat (H-3) & pengingat (H-1)   • Info libur & tanggal masuk kembali (H-2)
//   • Persiapan pembagian rapor untuk wali kelas (H-3)   • Agenda pekan ini
//  Teks bisa diedit, lalu dikirim lewat WhatsApp (pilih grup) atau disalin. Riwayat kirim disimpan bersama.
// ============================================================
const PG = { kaldik: [], atur: null, aturWali: null, riwayat: {}, hari: new Set(), saran: [], untuk: "guru" };
const PG_BAWAAN_WALI = {
  salam: "Assalamu'alaikum warahmatullahi wabarakatuh.",
  sapaan: "Kepada Bapak/Ibu wali santri Rumah Tahfizh Putra & PKBM Al Umm Barabai yang dirahmati Allah,",
  penutup: "Jazakumullahu khairan atas perhatian dan kerja samanya.\nWassalamu'alaikum warahmatullahi wabarakatuh.",
  pengirim: "Admin PKBM Al Umm Barabai",
};
const PG_BAWAAN = {
  salam: "Assalamu'alaikum warahmatullahi wabarakatuh.",
  sapaan: "Kepada Bapak/Ustadz dewan guru PKBM Al Umm Barabai yang dirahmati Allah,",
  penutup: "Jazakumullahu khairan atas perhatian dan kerja samanya.\nWassalamu'alaikum warahmatullahi wabarakatuh.",
  pengirim: "Admin PKBM Al Umm Barabai", hijri: true, tag: true,
};
const _pgIso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const _pgTgl = (iso) => new Date(iso + "T00:00:00");
const _pgGeser = (iso, n) => { const d = _pgTgl(iso); d.setDate(d.getDate() + n); return _pgIso(d); };
const _pgHariIni = () => _pgIso(new Date());
function _pgFmt(iso, opsi = {}) {
  if (!iso) return "-";
  const d = _pgTgl(iso);
  let s = d.toLocaleDateString("id-ID", { weekday: opsi.tanpaHari ? undefined : "long", day: "numeric", month: "long", year: "numeric" });
  if (PG.atur?.hijri && !opsi.tanpaHijri) {
    // Pakai bulan Hijriah Indonesia (Muharram … Dzulhijjah). Format "id-u-ca-islamic" bawaan browser keliru:
    // menampilkan nama bulan Masehi ("Juni") dan era "SM" → "20 Juni 1448 SM H".
    const h = typeof tanggalHijriahHariIni === "function" ? tanggalHijriahHariIni(new Date(iso + "T12:00:00")) : "";
    if (h) s += ` (${h})`;
  }
  return s;
}
const _pgRentang = (a, b) => (!b || a === b ? _pgFmt(a) : `${_pgFmt(a)} s.d. ${_pgFmt(b)}`);
const _pgSemester = (iso) => { const x = _kbTahunAjaran(iso.slice(0, 7)); return { label: `Semester ${x.semester} ${x.ta}`, semester: x.semester, ta: x.ta }; };
const _pgLibur = (iso) => PG.kaldik.some((k) => k.jenis === "libur" && k.tanggal_mulai <= iso && (k.tanggal_selesai || k.tanggal_mulai) >= iso);
const _pgHariAktif = (iso) => (!PG.hari.size || PG.hari.has(HARI_INDO[_pgTgl(iso).getDay()])) && !_pgLibur(iso);
function _pgHariAktifSebelum(iso) { let d = _pgGeser(iso, -1); for (let i = 0; i < 20 && !_pgHariAktif(d); i++) d = _pgGeser(d, -1); return d; }
function _pgHariAktifSesudah(iso) { let d = _pgGeser(iso, 1); for (let i = 0; i < 30 && !_pgHariAktif(d); i++) d = _pgGeser(d, 1); return d; }

// Jenis kegiatan kaldik dari judul/keterangan
function _pgKategori(k) {
  // KBM hanya dihentikan oleh UJIAN (atau libur). Rapat, rihlah, lomba, kemah, wisata, dsb. tetap ada KBM —
  // walaupun judulnya memuat kata seperti "Tahfizh" (mis. "Rihlah Santri Berprestasi (Tahfizh)").
  const t = `${k.judul || ""} ${k.keterangan || ""}`.toLowerCase(), judul = String(k.judul || "").toLowerCase();
  if (/rapat|musyawarah|koordinasi guru/.test(judul)) return "rapat";
  if (/rapor|raport|rapot/.test(judul)) return "rapor";
  if (/rihlah|wisata|piknik|outbound|out bound|study tour|studi tour|kunjungan|lomba|perlombaan|kemah|perkemahan|jalan sehat|tasyakuran|syukuran|santunan|bakti sosial|baksos|upacara|peringatan|maulid|isra|halal ?bi ?halal|silaturahmi|pentas|gebyar|festival|apresiasi|berprestasi|wisuda/.test(judul)
    && !/\b(ujian|imtihan|munaqasy|tasmi'?|uas|uts|pas|pts|pat|asesmen)\b/.test(judul)) return "agenda";
  if (k.jenis === "libur") return "libur";
  const ujian = /\b(ujian|imtihan|munaqasy\w*|tasmi'?\w*|asesmen|evaluasi akhir|penilaian (akhir|tengah)|sumatif)\b/.test(t);
  if (/tahfi[zd]h?|hafalan|qur'?an/.test(judul) && ujian) return "tahfizh";
  if (/\b(uts|pts|sts)\b|tengah semester/.test(t) && !/libur/.test(judul)) return "uts";
  if (/\b(uas|pas|pat|sas)\b|ujian akhir|asesmen akhir|penilaian akhir|sumatif akhir|ujian semester/.test(t) && !/libur/.test(judul)) return "uas";
  if (ujian || (k.jenis === "ujian" && !/libur/.test(judul))) return "ujian";
  return "agenda";
}
const PG_IKON = { akhir_kbm: "🏁", soal: "📝", jadwal_ujian: "🗓️", nilai: "📊", rapat: "🤝", rapat_ingat: "⏰", libur: "🏖️", rapor: "📘", pekan: "📅", bebas: "✍️",
  w_libur: "🏖️", w_ujian: "📖", w_rapor: "📘", w_agenda: "📌" };
const PG_NAMA = { akhir_kbm: "Akhir KBM", soal: "Pengumpulan soal ujian", jadwal_ujian: "Pelaksanaan ujian", nilai: "Pengumpulan nilai rapor", rapat: "Undangan rapat", rapat_ingat: "Pengingat rapat", libur: "Info libur & masuk kembali", rapor: "Persiapan pembagian rapor", pekan: "Agenda pekan ini", bebas: "Pengumuman bebas",
  w_libur: "Libur santri & tanggal kembali", w_ujian: "Ujian — mohon dukungan wali", w_rapor: "Undangan pengambilan rapor", w_agenda: "Undangan kegiatan wali santri" };

function _pgSusunSaran(untuk = PG.untuk) {
  const hariIni = _pgHariIni(), batasAwal = _pgGeser(hariIni, -7), batasAkhir = _pgGeser(hariIni, 160);
  const out = [];
  const tambah = (k, tipe, kirim, ekstra = {}) => out.push({ id: `${k.id}:${tipe}`, k, tipe, kirim, ...ekstra });
  PG.kaldik.filter((k) => k.tanggal_mulai >= batasAwal && k.tanggal_mulai <= batasAkhir).forEach((k) => {
    const kat = _pgKategori(k), mulai = k.tanggal_mulai;
    if (untuk === "wali") {
      // pengumuman untuk grup wali santri
      if (["uas", "uts", "tahfizh", "ujian"].includes(kat)) tambah(k, "w_ujian", _pgGeser(mulai, -7), { kat });
      else if (kat === "rapor") tambah(k, "w_rapor", _pgGeser(mulai, -5));
      else if (kat === "libur" && (k.tanggal_selesai || mulai) > mulai) tambah(k, "w_libur", _pgGeser(mulai, -3));
      else if (/wali santri|orang ?tua|wali murid|parenting/i.test(`${k.judul} ${k.keterangan || ""}`)) tambah(k, "w_agenda", _pgGeser(mulai, -5));
      return;
    }
    if (["uas", "uts", "tahfizh", "ujian"].includes(kat)) {
      // ujian yang menyambung ujian lain (mis. Tahfizh lalu UAS) → "akhir KBM" cukup sekali, di ujian pertama
      const sambung = PG.kaldik.some((x) => x !== k && ["uas", "uts", "tahfizh", "ujian"].includes(_pgKategori(x)) && x.tanggal_mulai < mulai && (x.tanggal_selesai || x.tanggal_mulai) >= _pgGeser(mulai, -10));
      if (!sambung) tambah(k, "akhir_kbm", _pgGeser(mulai, -7), { kat });
      if (kat === "uas" || kat === "uts" || kat === "ujian") tambah(k, "soal", _pgGeser(mulai, -21), { kat, batas: _pgGeser(mulai, -14) });
      tambah(k, "jadwal_ujian", _pgGeser(mulai, -3), { kat });
    } else if (kat === "rapor") {
      tambah(k, "nilai", _pgGeser(mulai, -14), { batas: _pgGeser(mulai, -7) });
      tambah(k, "rapor", _pgGeser(mulai, -3));
    } else if (kat === "rapat") {
      tambah(k, "rapat", _pgGeser(mulai, -3)); tambah(k, "rapat_ingat", _pgGeser(mulai, -1));
    } else if (kat === "libur" && (k.tanggal_selesai || mulai) > mulai) {
      tambah(k, "libur", _pgGeser(mulai, -2)); // libur lebih dari sehari (libur sehari biasa tidak perlu pengumuman)
    }
  });
  // usulan yang kegiatannya sudah lewat dibuang
  return out.filter((s) => (s.k.tanggal_selesai || s.k.tanggal_mulai) >= hariIni).sort((a, b) => a.kirim.localeCompare(b.kirim));
}

async function _pgMuatData() {
  await ensureLookups();
  const [kaldik, atur, riwayat, jadwal] = await Promise.all([
    apiGetKaldikSemua(), _kvAmbil("pengumuman:atur", {}), _kvAmbil("pengumuman:riwayat", {}),
    supa.from("jadwal_pelajaran").select("hari").eq("aktif", true).then(unwrap).catch(() => []),
  ]);
  PG.kaldik = kaldik || []; PG.atur = { ...PG_BAWAAN, ...(atur || {}) }; PG.aturWali = { ...PG_BAWAAN_WALI, ...((atur || {}).wali || {}) };
  delete PG.atur.wali; PG.riwayat = riwayat || {};
  PG.hari = new Set(jadwal.map((j) => j.hari).filter(Boolean));
}
async function bukaPengumumanWa(untuk) {
  if (!(isAdmin() || isKepsek())) { toast("Fitur ini untuk admin & kepala sekolah", "err"); return; }
  if (untuk) PG.untuk = untuk;
  openModal(`<h3>📢 Pengumuman WhatsApp</h3><div id="pg-isi">${loadingHTML()}</div>`, { lebar: true });
  try {
    await _pgMuatData();
    PG.saran = _pgSusunSaran();
    _pgDaftar();
  } catch (e) { console.error(e); qs("pg-isi").innerHTML = `<div class="card empty-state">Gagal memuat kalender: ${escapeHtml(e.message)}</div>`; }
}
function _pgGantiUntuk(u) { PG.untuk = u; PG.saran = _pgSusunSaran(); _pgDaftar(); }
const _pgKartuUmum = (id, ikon, judul, sub) => `<button type="button" class="pg-kartu" onclick="${id === "pengawas" ? "_pgPengawas()" : `_pgBuka('${id}')`}"><span class="pg-ikon">${ikon}</span><span class="pg-teks"><b>${judul}</b><small>${sub}</small></span></button>`;
function _pgDaftar() {
  const el = qs("pg-isi"); if (!el) { openModal(`<h3>📢 Pengumuman WhatsApp</h3><div id="pg-isi"></div>`, { lebar: true }); return _pgDaftar(); }
  const wali = PG.untuk === "wali", atur = wali ? PG.aturWali : PG.atur;
  const hariIni = _pgHariIni();
  const kartu = (s) => {
    const terkirim = PG.riwayat[s.id], jatuh = s.kirim <= hariIni;
    const status = terkirim ? `<span class="pg-st ok">✅ terkirim ${escapeHtml(_pgFmt(terkirim.slice(0, 10), { tanpaHijri: true, tanpaHari: true }))}</span>`
      : jatuh ? `<span class="pg-st kirim">🔔 kirim sekarang</span>` : `<span class="pg-st nanti">kirim ${escapeHtml(_pgFmt(s.kirim, { tanpaHijri: true }))}</span>`;
    return `<button type="button" class="pg-kartu ${!terkirim && jatuh ? "jatuh" : ""} ${terkirim ? "selesai" : ""}" onclick="_pgBuka('${s.id}')">
      <span class="pg-ikon">${PG_IKON[s.tipe]}</span>
      <span class="pg-teks"><b>${PG_NAMA[s.tipe]}</b><small>${escapeHtml(s.k.judul || "")} · ${escapeHtml(_pgFmt(s.k.tanggal_mulai, { tanpaHijri: true, tanpaHari: true }))}${s.batas ? ` · batas ${escapeHtml(_pgFmt(s.batas, { tanpaHijri: true, tanpaHari: true }))}` : ""}</small></span>${status}</button>`;
  };
  const perlu = PG.saran.filter((s) => !PG.riwayat[s.id] && s.kirim <= hariIni), nanti = PG.saran.filter((s) => !perlu.includes(s));
  const umum = wali
    ? _pgKartuUmum("pekan-wali", "📅", "Agenda santri pekan ini", "kegiatan kaldik 7 hari ke depan") + _pgKartuUmum("bebas", "✍️", "Pengumuman bebas", "salam & penutup untuk wali santri")
    : _pgKartuUmum("pekan", "📅", "Agenda pekan ini", "semua kegiatan kaldik 7 hari ke depan")
      + _pgKartuUmum("jurnal-pekan", "📝", "Jurnal belum diisi", "pekan ini — sebut guru, mapel & tanggal")
      + _pgKartuUmum("nilai-sekarang", "📊", "Kelengkapan nilai saat ini", "sebut guru & mapel yang belum lengkap")
      + _pgKartuUmum("modul-belum", "📚", "Modul ajar belum diunggah", "per guru, sesuai jadwal mengajar")
      + _pgKartuUmum("rekap-guru", "🧑‍🏫", "Rekap kehadiran guru", "bulan ini — untuk kepala sekolah")
      + _pgKartuUmum("pengawas", "🛡️", "Jadwal pengawas ujian", "dibagi rata otomatis per hari & kelas")
      + _pgKartuUmum("bebas", "✍️", "Pengumuman bebas", "salam & penutup sudah tersusun");
  el.innerHTML = `
    <div class="pg-tab"><button class="${wali ? "" : "on"}" onclick="_pgGantiUntuk('guru')">👥 Grup guru</button><button class="${wali ? "on" : ""}" onclick="_pgGantiUntuk('wali')">👪 Grup wali santri</button></div>
    <div class="uj-sub" style="margin:0 0 10px;line-height:1.6">Disusun otomatis dari <b>Kalender Akademik</b> dan data aplikasi. Pilih pengumuman → periksa/edit teks → kirim ke grup WhatsApp.</div>
    <div class="pg-umum">${umum}</div>
    ${perlu.length ? `<div class="rwk-judul">🔔 Perlu dikirim (${perlu.length})</div>${perlu.map(kartu).join("")}` : ""}
    <div class="rwk-judul">🗓️ Dari kalender akademik</div>
    ${nanti.length ? nanti.map(kartu).join("") : `<div class="card empty-state" style="font-size:12.5px">Belum ada kegiatan ${wali ? "ujian/rapor/libur/kegiatan wali santri" : "ujian/rapat/rapor/libur"} di kaldik 5 bulan ke depan.<br>Tambahkan di menu <b>Kalender Akademik</b> — judul seperti “UAS Semester Ganjil”, “Ujian Tahfizh”, “Rapat Guru”, “Pembagian Rapor”${wali ? ", “Pertemuan Wali Santri”" : ""}.</div>`}
    <details class="je-atur" style="margin-top:12px"><summary>⚙️ Salam, sapaan, penutup & nama pengirim (${wali ? "wali santri" : "guru"})</summary>
      ${["salam", "sapaan", "penutup", "pengirim"].map((k) => `<div class="field" style="margin:6px 0 0"><label class="form-label" style="text-transform:capitalize">${k}</label><textarea class="input pg-atur" data-k="${k}" rows="${k === "penutup" ? 2 : 1}">${escapeHtml(atur[k])}</textarea></div>`).join("")}
      <label class="je-opsi"><input type="checkbox" id="pg-hijri" ${PG.atur.hijri ? "checked" : ""}> <span>Sertakan tanggal Hijriah</span></label>
      <label class="je-opsi"><input type="checkbox" id="pg-tag" ${PG.atur.tag ? "checked" : ""}> <span>Tandai (tag) guru dengan @nomor WA pada daftar nama</span></label>
      <button class="btn btn-outline btn-sm" style="margin-top:6px" onclick="_pgSimpanAtur()">💾 Simpan pengaturan</button>
      <div class="uj-sub" style="margin-top:6px">${wali ? "Untuk wali santri: ujian (H-7), pengambilan rapor (H-5), libur lebih dari sehari (H-3), dan kegiatan yang judulnya memuat “wali santri / orang tua” (H-5)." : "Kegiatan dikenali dari judul di kaldik: UAS/PAS/PAT, UTS/PTS, Ujian Tahfizh, Rapat, Pembagian Rapor, dan libur lebih dari sehari. Tanggal kirim: soal H-21 (batas H-14), akhir KBM H-7, nilai H-14 (batas H-7 rapor), rapat H-3 & H-1, libur H-2."}</div>
    </details>`;
}
async function _pgSimpanAtur() {
  const atur = PG.untuk === "wali" ? PG.aturWali : PG.atur;
  qsa(".pg-atur").forEach((i) => (atur[i.dataset.k] = i.value.trim()));
  PG.atur.hijri = qs("pg-hijri").checked;
  if (qs("pg-tag")) PG.atur.tag = qs("pg-tag").checked;
  try { await _kvSimpan("pengumuman:atur", { ...PG.atur, wali: PG.aturWali }); toast("Pengaturan pengumuman tersimpan", "ok"); } catch (e) { toast("Gagal menyimpan: " + e.message, "err"); }
}

// ── Isi pengumuman ──
const _pgBungkus = (judul, isi) => { const a = PG.untuk === "wali" ? PG.aturWali : PG.atur; return `📢 *${judul}*\n\n${a.salam}\n${a.sapaan}\n\n${isi}\n\n${a.penutup}\n\n_${a.pengirim}_`; };
// "Kelas 7" / "kelas 7" / "7" → "7" (nama kelas di data sering sudah memuat kata "Kelas")
const _pgAngkaKelas = (nama) => { const s = String(nama || "").replace(/^\s*kelas\s+/i, "").trim(); return typeof formatKelasLabel === "function" ? formatKelasLabel(s) : s; };
// Tag WA: "@62812…" — di grup, WhatsApp menampilkannya sebagai tag bila nomor itu anggota grup
const _pgTagWa = (g) => { if (!PG.atur?.tag || !g?.no_wa || typeof normalisasiNomorWa !== "function") return ""; const n = normalisasiNomorWa(g.no_wa); return n.valid ? ` @${n.nomor}` : ""; };
function _pgDaftarTugasGuru() {
  // guru → mapel → kelas, dari jadwal aktif (untuk pengumpulan soal). Format rapi berbaris:
  //   1. *Ust. Abdul Gani* @62812…
  //      • Aqidah — Kelas 7, 8
  return supa.from("jadwal_pelajaran").select("guru_id,kelas_id,mapel_id").eq("aktif", true).then(unwrap).then((rows) => {
    const per = {};
    rows.forEach((r) => {
      const g = (LOOKUP.guruAll || []).find((x) => x.id === r.guru_id), m = LOOKUP.mapel.find((x) => x.id === r.mapel_id), k = LOOKUP.kelas.find((x) => x.id === r.kelas_id);
      if (!g || !m || !k) return;
      const x = (per[g.id] = per[g.id] || { g, mapel: {} });
      (x.mapel[m.nama_mapel] = x.mapel[m.nama_mapel] || new Set()).add(_pgAngkaKelas(k.nama_kelas));
    });
    const urutKelas = (a, b) => String(a).localeCompare(String(b), "id", { numeric: true });
    return Object.values(per).sort((a, b) => a.g.nama.localeCompare(b.g.nama, "id")).map((x, i) =>
      `${i + 1}. *${_pgNama(x.g.nama)}*${_pgTagWa(x.g)}\n` +
      Object.keys(x.mapel).sort((a, b) => a.localeCompare(b, "id")).map((mp) => `     ▪️ ${mp} — Kelas ${[...x.mapel[mp]].sort(urutKelas).join(", ")}`).join("\n"));
  });
}
const _pgNama = (n) => (typeof _namaSingkatTopbar === "function" ? _namaSingkatTopbar(n) : n);
async function _pgDaftarBelumLengkap(semester, ta) {
  const perGuru = await _pkHitung(semester, ta);
  const baris = [];
  Object.keys(perGuru).forEach((gid) => {
    const g = (LOOKUP.guruAll || []).find((x) => x.id === gid); if (!g) return;
    const belum = perGuru[gid].filter((i) => !_pkLengkap(i));
    if (!belum.length) return;
    const isi = belum.map((it) => it.jenis === "nilai"
      ? `${it.mapel.nama_mapel} ${_pkKelas(it.kelas)} (nilai ${it.isi}/${it.total}, UAS ${it.uas}/${it.total})`
      : `catatan wali kelas ${_pkKelas(it.kelas)} (${Math.min(it.isi, it.ar)}/${it.total})`);
    baris.push({ nama: g.nama, teks: isi });
  });
  baris.sort((a, b) => a.nama.localeCompare(b.nama, "id"));
  return baris;
}

async function _pgSusunTeks(id) {
  const hariIni = _pgHariIni();
  if (id === "bebas") return _pgBungkus("PENGUMUMAN", "[Tulis isi pengumuman di sini]");
  if (id === "jurnal-pekan") return _pgTeksJurnalPekan();
  if (id === "modul-belum") return _pgTeksModulBelum();
  if (id === "rekap-guru") return _pgTeksRekapGuru();
  if (id === "pekan" || id === "pekan-wali") {
    const akhir = _pgGeser(hariIni, 7);
    const ada = PG.kaldik.filter((k) => (k.tanggal_selesai || k.tanggal_mulai) >= hariIni && k.tanggal_mulai <= akhir && (id === "pekan" || _pgKategori(k) !== "rapat"));
    const isi = ada.length ? ada.map((k) => `• *${k.judul}* — ${_pgRentang(k.tanggal_mulai, k.tanggal_selesai)}${k.keterangan ? `\n   ${k.keterangan}` : ""}`).join("\n") : "Tidak ada agenda khusus di kalender akademik pekan ini. KBM berjalan seperti biasa.";
    return _pgBungkus(`AGENDA PEKAN INI (${_pgFmt(hariIni, { tanpaHijri: true, tanpaHari: true })} – ${_pgFmt(akhir, { tanpaHijri: true, tanpaHari: true })})`, `Berikut agenda sesuai kalender akademik:\n\n${isi}`);
  }
  if (id === "nilai-sekarang") {
    const sm = semesterAktifSekarang(), daftar = await _pgDaftarBelumLengkap(sm.semester, sm.ta);
    const rapor = PG.kaldik.find((k) => _pgKategori(k) === "rapor" && k.tanggal_mulai >= hariIni);
    return _pgBungkus(`KELENGKAPAN NILAI RAPOR — SEMESTER ${sm.semester.toUpperCase()} ${sm.ta}`,
      `${rapor ? `Batas pengumpulan nilai: *${_pgFmt(_pgGeser(rapor.tanggal_mulai, -7))}* (H-7 pembagian rapor ${_pgFmt(rapor.tanggal_mulai, { tanpaHijri: true })}).\n\n` : ""}${_pgTeksBelum(daftar)}`);
  }
  const s = PG.saran.find((x) => x.id === id); if (!s) return "";
  const k = s.k, sm = _pgSemester(k.tanggal_mulai), judul = k.judul || "";
  const ket = k.keterangan ? `\n\nKeterangan: ${k.keterangan}` : "";
  switch (s.tipe) {
    case "akhir_kbm": {
      const akhir = _pgHariAktifSebelum(k.tanggal_mulai), uts = s.kat === "uts";
      return _pgBungkus(uts ? `KBM REGULER SEBELUM ${judul.toUpperCase()}` : `AKHIR KBM ${sm.label.toUpperCase()}`,
        `Diberitahukan bahwa ${uts ? `KBM reguler terakhir sebelum *${judul}*` : `*Kegiatan Belajar Mengajar (KBM) ${sm.label}* berakhir`} pada *${_pgFmt(akhir)}*, karena mulai *${_pgFmt(k.tanggal_mulai)}* dilaksanakan *${judul}*${k.tanggal_selesai && k.tanggal_selesai !== k.tanggal_mulai ? ` sampai ${_pgFmt(k.tanggal_selesai)}` : ""}.\n\nMohon Bapak/Ustadz:\n1. Menuntaskan materi dan mengisi jurnal pembelajaran sampai ${_pgFmt(akhir, { tanpaHijri: true, tanpaHari: true })}.\n2. Menyampaikan informasi ini kepada santri di kelas masing-masing.${ket}`);
    }
    case "soal": {
      const tugas = await _pgDaftarTugasGuru().catch(() => []);
      return _pgBungkus(`PENGUMPULAN SOAL ${judul.toUpperCase()}`,
        `Sehubungan dengan pelaksanaan *${judul}* pada *${_pgRentang(k.tanggal_mulai, k.tanggal_selesai)}*, Bapak/Ustadz dimohon mengumpulkan *soal ujian beserta kunci jawaban* kepada admin paling lambat:\n\n⏰ *${_pgFmt(s.batas)}* (H-14 ujian)\n\nSoal boleh dikirim dalam bentuk file Word, atau langsung dibuat di menu *Ujian* aplikasi (bisa tempel dari Word, termasuk soal bahasa Arab).${tugas.length ? `\n\n📋 *Daftar mapel sesuai jadwal mengajar:*\n\n${tugas.join("\n\n")}` : ""}${ket}`);
    }
    case "jadwal_ujian":
      return _pgBungkus(`PELAKSANAAN ${judul.toUpperCase()}`,
        `Diinformasikan bahwa *${judul}* dilaksanakan pada *${_pgRentang(k.tanggal_mulai, k.tanggal_selesai)}*.\n\nMohon Bapak/Ustadz:\n1. Hadir tepat waktu sesuai jadwal mengawas/menguji.\n2. Memastikan soal (cetak atau di aplikasi) sudah siap.\n3. Mengingatkan santri untuk mempersiapkan diri.${ket}`);
    case "nilai": {
      const daftar = await _pgDaftarBelumLengkap(sm.semester, sm.ta).catch(() => null);
      return _pgBungkus(`PENGUMPULAN NILAI RAPOR ${sm.label.toUpperCase()}`,
        `Menjelang *${judul}* pada *${_pgFmt(k.tanggal_mulai)}*, Bapak/Ustadz dimohon melengkapi *nilai rapor* (termasuk UAS) di aplikasi paling lambat:\n\n⏰ *${_pgFmt(s.batas)}* (H-7 pembagian rapor)\n\nWali kelas juga dimohon melengkapi catatan rapor (Indonesia & Arab) dan ekskul santri.\n\n${daftar ? _pgTeksBelum(daftar) : ""}${ket}`);
    }
    case "rapor":
      return _pgBungkus(`PERSIAPAN ${judul.toUpperCase()}`,
        `*${judul}* dilaksanakan pada *${_pgFmt(k.tanggal_mulai)}*.\n\nMohon wali kelas:\n1. Memeriksa rapor setiap santri di menu *Rapor Wali Kelas*.\n2. Mencetak rapor PKBM & Diniyyah lewat tombol *🖨️ Cetak Rapor* (sudah format F4 siap cetak).\n3. Menyiapkan tanda tangan dan map rapor sebelum hari pembagian.${ket}`);
    case "rapat":
      return _pgBungkus(`UNDANGAN ${judul.toUpperCase()}`,
        `Dengan hormat, kami mengundang Bapak/Ustadz untuk menghadiri *${judul}* yang insyaAllah dilaksanakan pada:\n\n📅 Hari/tanggal: *${_pgRentang(k.tanggal_mulai, k.tanggal_selesai)}*\n🕗 Waktu: ${(/(\d{1,2}[.:]\d{2})/.exec(k.keterangan || "") || [])[1] || "[pukul …]"} WITA\n📍 Tempat: [tempat]\n📝 Agenda: ${k.keterangan || "[agenda rapat]"}\n\nMengingat pentingnya acara ini, kehadiran Bapak/Ustadz sangat diharapkan.`);
    case "rapat_ingat":
      return _pgBungkus(`PENGINGAT: ${judul.toUpperCase()} BESOK`,
        `Mengingatkan kembali, *${judul}* insyaAllah dilaksanakan *besok, ${_pgFmt(k.tanggal_mulai)}*.${k.keterangan ? `\n\n${k.keterangan}` : ""}\n\nMohon hadir tepat waktu.`);
    case "w_ujian":
      return _pgBungkus(`${judul.toUpperCase()}`,
        `Diberitahukan bahwa ananda santri akan mengikuti *${judul}* pada *${_pgRentang(k.tanggal_mulai, k.tanggal_selesai)}*.\n\nMohon dukungan Bapak/Ibu:\n1. Mendoakan dan menyemangati ananda.\n2. Mengingatkan ananda untuk ${s.kat === "tahfizh" ? "memperbanyak murajaah hafalan" : "belajar dan murajaah materi"}, menjaga kesehatan, serta istirahat yang cukup.\n3. Memastikan ananda hadir tepat waktu selama ujian berlangsung.${ket}`);
    case "w_rapor":
      return _pgBungkus(`UNDANGAN PENGAMBILAN RAPOR`,
        `Dengan hormat, kami mengundang Bapak/Ibu wali santri untuk hadir pada *${judul}* ${sm.label}:\n\n📅 *${_pgRentang(k.tanggal_mulai, k.tanggal_selesai)}*\n🕗 Pukul [jam] WITA\n📍 [tempat]\n\nRapor diserahkan langsung kepada wali santri, sekaligus kesempatan berdiskusi dengan wali kelas tentang perkembangan ananda.${ket}`);
    case "w_libur": {
      const masuk = _pgHariAktifSesudah(k.tanggal_selesai || k.tanggal_mulai);
      return _pgBungkus(/^libur/i.test(judul) ? judul.toUpperCase() : `LIBUR ${judul.toUpperCase()}`,
        `Diberitahukan bahwa sesuai kalender akademik, santri *libur* dalam rangka *${judul}* pada *${_pgRentang(k.tanggal_mulai, k.tanggal_selesai)}*.\n\nSantri *kembali belajar* pada *${_pgFmt(masuk)}*.\n\nSelama libur, mohon Bapak/Ibu membimbing ananda untuk tetap menjaga shalat, murajaah hafalan, dan adab di rumah.${ket}`);
    }
    case "w_agenda":
      return _pgBungkus(`UNDANGAN ${judul.toUpperCase()}`,
        `Dengan hormat, kami mengundang Bapak/Ibu wali santri untuk menghadiri *${judul}* yang insyaAllah dilaksanakan pada:\n\n📅 *${_pgRentang(k.tanggal_mulai, k.tanggal_selesai)}*\n🕗 Pukul [jam] WITA\n📍 [tempat]${k.keterangan ? `\n📝 ${k.keterangan}` : ""}\n\nKehadiran Bapak/Ibu sangat kami harapkan.`);
    case "libur": {
      const masuk = _pgHariAktifSesudah(k.tanggal_selesai || k.tanggal_mulai);
      return _pgBungkus(/^libur/i.test(judul) ? judul.toUpperCase() : `LIBUR ${judul.toUpperCase()}`,
        `Diberitahukan bahwa sesuai kalender akademik, kegiatan belajar *diliburkan* dalam rangka *${judul}* pada *${_pgRentang(k.tanggal_mulai, k.tanggal_selesai)}*.\n\nKBM kembali aktif pada *${_pgFmt(masuk)}*. Mohon disampaikan juga kepada santri.${ket}`);
    }
  }
  return "";
}
// Senin pekan ini
const _pgSenin = (iso) => { const d = _pgTgl(iso), g = (d.getDay() + 6) % 7; d.setDate(d.getDate() - g); return _pgIso(d); };
const _pgKelas = (k) => (k && k.nama_kelas ? "Kelas " + _pgAngkaKelas(k.nama_kelas) : "-");
async function _pgTeksJurnalPekan() {
  const hariIni = _pgHariIni(), dari = _pgSenin(hariIni);
  const rows = unwrap(await supa.from("absensi_sesi").select("tanggal,guru_id,jurnal_id,jam_masuk,jam_pulang,status_kehadiran,kelas(nama_kelas),mapel(nama_mapel)").gte("tanggal", dari).lte("tanggal", hariIni));
  const belum = {}, alpha = {};
  rows.forEach((r) => {
    if (["izin", "sakit"].includes(r.status_kehadiran) || r.jurnal_id) return;
    if (r.tanggal === hariIni && !r.jam_pulang) return; // sesi hari ini yang mungkin masih berjalan
    const baris = `${r.mapel?.nama_mapel || "-"} ${_pgKelas(r.kelas)} (${_pgFmt(r.tanggal, { tanpaHijri: true, tanpaHari: true }).replace(/ \d{4}$/, "")})`;
    const target = r.jam_masuk ? belum : alpha;
    (target[r.guru_id] = target[r.guru_id] || []).push(baris);
  });
  const nama = (id) => _pgNama(((LOOKUP.guruAll || []).find((g) => g.id === id) || {}).nama || "-");
  const daftar = (o) => Object.keys(o).sort((a, b) => nama(a).localeCompare(nama(b), "id")).map((id, i) => `${i + 1}. *${nama(id)}*: ${o[id].join("; ")}`).join("\n");
  const rentang = `${_pgFmt(dari, { tanpaHijri: true, tanpaHari: true })} – ${_pgFmt(hariIni, { tanpaHijri: true, tanpaHari: true })}`;
  let isi = `Rekap jurnal pembelajaran pekan ini (${rentang}).`;
  if (!Object.keys(belum).length && !Object.keys(alpha).length) isi += "\n\nAlhamdulillah, *semua sesi yang sudah berjalan sudah berjurnal*. Jazakumullahu khairan 🙏";
  else {
    if (Object.keys(belum).length) isi += `\n\n📝 *Sudah absen masuk, jurnal belum diisi:*\n${daftar(belum)}`;
    if (Object.keys(alpha).length) isi += `\n\n🙋 *Belum ada absen & jurnal* (bila sebenarnya mengajar, silakan ajukan hadir di aplikasi):\n${daftar(alpha)}`;
    isi += "\n\nMohon segera dilengkapi di menu *Jurnal* aplikasi.";
  }
  return _pgBungkus("PENGINGAT JURNAL PEMBELAJARAN", isi);
}
async function _pgTeksModulBelum() {
  const [jadwal, modul] = await Promise.all([
    supa.from("jadwal_pelajaran").select("guru_id,kelas_id,mapel_id").eq("aktif", true).then(unwrap),
    supa.from("modul_ajar").select("kelas_id,mapel_id").then(unwrap),
  ]);
  const ada = new Set(modul.map((m) => `${m.kelas_id || "umum"}|${m.mapel_id}`));
  const per = {}, unik = new Set();
  jadwal.forEach((j) => {
    const kunci = `${j.guru_id}|${j.kelas_id}|${j.mapel_id}`; if (!j.guru_id || !j.mapel_id || unik.has(kunci)) return; unik.add(kunci);
    if (ada.has(`${j.kelas_id}|${j.mapel_id}`) || ada.has(`umum|${j.mapel_id}`)) return;
    const m = LOOKUP.mapel.find((x) => x.id === j.mapel_id), k = LOOKUP.kelas.find((x) => x.id === j.kelas_id);
    (per[j.guru_id] = per[j.guru_id] || []).push(`${m?.nama_mapel || "-"} ${_pgKelas(k)}`);
  });
  const nama = (id) => _pgNama(((LOOKUP.guruAll || []).find((g) => g.id === id) || {}).nama || "-");
  const ids = Object.keys(per).sort((a, b) => nama(a).localeCompare(nama(b), "id"));
  const isi = ids.length
    ? `Agar pembelajaran & presentasi di kelas lebih mudah (buku bisa dibuka di layar, materi otomatis tercatat di jurnal), mohon Bapak/Ustadz mengunggah *modul ajar / buku pegangan* di menu *Modul Ajar* untuk mapel berikut:\n\n${ids.map((id, i) => `${i + 1}. *${nama(id)}*: ${per[id].sort().join(", ")}`).join("\n")}\n\nFile PDF paling dianjurkan. Bila kesulitan, silakan kirim filenya ke admin.`
    : "Alhamdulillah, *semua mapel di jadwal sudah memiliki modul ajar* di aplikasi. Jazakumullahu khairan 🙏";
  return _pgBungkus("MODUL AJAR", isi);
}
async function _pgTeksRekapGuru() {
  const hariIni = _pgHariIni(), awal = new Date().getDate() <= 5; // awal bulan → rekap bulan lalu
  const d0 = _pgTgl(hariIni); if (awal) d0.setMonth(d0.getMonth() - 1);
  const dari = `${d0.getFullYear()}-${String(d0.getMonth() + 1).padStart(2, "0")}-01`;
  const sampai = awal ? _pgGeser(hariIni.slice(0, 8) + "01", -1) : hariIni;
  const rows = await apiGetRekapKedisiplinan(dari, sampai);
  const per = {};
  rows.forEach((x) => {
    if (x.tanggal === hariIni && !x.jam_pulang && x.status_kehadiran !== "alpha") return;
    const g = (per[x.guru_id] = per[x.guru_id] || { nama: x.guru?.nama || "-", sesi: 0, hadir: 0, jurnal: 0, izin: 0, sakit: 0, alpha: 0 });
    if (x.status_kehadiran === "izin") { g.izin++; return; }
    if (x.status_kehadiran === "sakit") { g.sakit++; return; }
    g.sesi++; if (x.jam_masuk) g.hadir++; else g.alpha++; if (x.jurnal_id) g.jurnal++;
  });
  const daftar = Object.values(per).map((g) => ({ ...g, p: g.sesi ? Math.round((g.hadir * 100) / g.sesi) : 100, pj: g.sesi ? Math.round((g.jurnal * 100) / g.sesi) : 100 }))
    .sort((a, b) => b.p - a.p || b.pj - a.pj || a.nama.localeCompare(b.nama, "id"));
  const bulan = d0.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
  const tot = daftar.reduce((a, g) => ({ sesi: a.sesi + g.sesi, hadir: a.hadir + g.hadir, jurnal: a.jurnal + g.jurnal }), { sesi: 0, hadir: 0, jurnal: 0 });
  const isi = `Rekap kehadiran mengajar & jurnal *bulan ${bulan}*${awal ? "" : ` (s.d. ${_pgFmt(sampai, { tanpaHijri: true, tanpaHari: true })})`}:\n\n✅ Kehadiran mengajar: *${tot.sesi ? Math.round((tot.hadir * 100) / tot.sesi) : 0}%* (${tot.hadir}/${tot.sesi} sesi)\n📝 Jurnal terisi: *${tot.sesi ? Math.round((tot.jurnal * 100) / tot.sesi) : 0}%*\n\n${daftar.map((g, i) => `${i + 1}. ${_pgNama(g.nama)} — hadir ${g.p}% (${g.hadir}/${g.sesi}), jurnal ${g.pj}%${g.izin ? `, izin ${g.izin}` : ""}${g.sakit ? `, sakit ${g.sakit}` : ""}${g.alpha ? `, *alpha ${g.alpha}*` : ""}`).join("\n")}\n\n🏅 Paling disiplin: ${daftar.filter((g) => g.p >= 95 && g.pj >= 95 && g.sesi).slice(0, 3).map((g) => _pgNama(g.nama)).join(", ") || "-"}`;
  return _pgBungkus(`REKAP KEHADIRAN GURU — ${bulan.toUpperCase()}`, isi);
}

// ── Jadwal pengawas ujian: guru dibagi rata per hari & kelas (bisa diedit sebelum dikirim) ──
async function _pgPengawas() {
  await ensureLookups();
  const hariIni = _pgHariIni();
  const ujian = PG.kaldik.filter((k) => ["uas", "uts", "tahfizh", "ujian"].includes(_pgKategori(k)) && (k.tanggal_selesai || k.tanggal_mulai) >= hariIni);
  const jadwal = await supa.from("jadwal_pelajaran").select("guru_id,kelas_id").eq("aktif", true).then(unwrap).catch(() => []);
  const guruAktif = [...new Set(jadwal.map((j) => j.guru_id))].map((id) => (LOOKUP.guruAll || []).find((g) => g.id === id)).filter(Boolean).sort((a, b) => a.nama.localeCompare(b.nama, "id"));
  const kelas = [...new Set(jadwal.map((j) => j.kelas_id))].map((id) => LOOKUP.kelas.find((k) => k.id === id)).filter(Boolean)
    .sort((a, b) => (parseInt(a.nama_kelas.match(/\d+/)) || 99) - (parseInt(b.nama_kelas.match(/\d+/)) || 99));
  openModal(`<h3>🛡️ Jadwal Pengawas Ujian</h3>
    <div class="field"><label class="form-label">Ujian</label><select id="pw-ujian" class="input">${ujian.map((k) => `<option value="${k.id}">${escapeHtml(k.judul)} · ${escapeHtml(_pgRentang(k.tanggal_mulai, k.tanggal_selesai).replace(/ \([^)]*\)/g, ""))}</option>`).join("") || `<option value="">Belum ada ujian di kaldik</option>`}</select></div>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <div class="field" style="flex:1;min-width:120px"><label class="form-label">Sesi per hari</label><input id="pw-sesi" type="number" min="1" max="4" value="1" class="input"></div>
      <div class="field" style="flex:2;min-width:180px"><label class="form-label">Jam sesi (pisahkan koma)</label><input id="pw-jam" class="input" value="07.30–09.30"></div></div>
    <details class="je-atur" open><summary>🏫 Ruang/kelas (${kelas.length})</summary><div class="pw-cek">${kelas.map((k) => `<label><input type="checkbox" class="pw-kelas" value="${k.id}" checked> ${escapeHtml(_pgKelas(k))}</label>`).join("")}</div></details>
    <details class="je-atur"><summary>👥 Guru pengawas (${guruAktif.length}) — hapus centang yang berhalangan</summary><div class="pw-cek">${guruAktif.map((g) => `<label><input type="checkbox" class="pw-guru" value="${g.id}" checked> ${escapeHtml(_pgNama(g.nama))}</label>`).join("")}</div></details>
    <button class="btn btn-accent" style="width:100%;margin-top:10px" onclick="_pgSusunPengawas()">🔀 Susun jadwal</button>
    <button class="btn btn-outline" style="width:100%;margin-top:6px" onclick="_pgDaftar()">‹ Kembali</button>`, { lebar: true });
}
function _pgSusunPengawas() {
  if (qs("pw-ujian")) PG.pw = { uj: qs("pw-ujian").value, sesi: +qs("pw-sesi").value || 1, jam: qs("pw-jam").value,
    kelas: Array.from(qsa(".pw-kelas")).filter((c) => c.checked).map((c) => c.value), guru: Array.from(qsa(".pw-guru")).filter((c) => c.checked).map((c) => c.value) };
  const pw = PG.pw || {};
  const k = PG.kaldik.find((x) => x.id === pw.uj); if (!k) { toast("Pilih ujian dulu", "err"); return; }
  const sesi = Math.max(1, Math.min(4, pw.sesi || 1)), jam = String(pw.jam || "").split(",").map((x) => x.trim());
  const kelas = (pw.kelas || []).map((id) => LOOKUP.kelas.find((x) => x.id === id)).filter(Boolean);
  const guru = (pw.guru || []).map((id) => (LOOKUP.guruAll || []).find((x) => x.id === id)).filter(Boolean);
  if (!kelas.length || !guru.length) { toast("Pilih minimal satu kelas dan satu guru", "err"); return; }
  const hari = []; for (let d = k.tanggal_mulai; d <= (k.tanggal_selesai || k.tanggal_mulai) && hari.length < 30; d = _pgGeser(d, 1)) if (_pgHariAktif(d) || d === k.tanggal_mulai) hari.push(d);
  // urutan diacak sekali lalu digilir → beban merata; dalam satu sesi tidak ada guru ganda (bila guru ≥ kelas)
  const urut = guru.slice().sort(() => Math.random() - 0.5), beban = {};
  let c = 0;
  const baris = hari.map((d) => `*${_pgFmt(d, { tanpaHijri: true })}*\n` + Array.from({ length: sesi }, (_, s) =>
    `${sesi > 1 || jam[s] ? `  Sesi ${s + 1}${jam[s] ? ` (${jam[s]})` : ""}:\n` : ""}` + kelas.map((kl) => { const g = urut[c++ % urut.length]; beban[g.nama] = (beban[g.nama] || 0) + 1; return `   • ${_pgKelas(kl)}: ${_pgNama(g.nama)}`; }).join("\n")).join("\n")).join("\n\n");
  const catatan = guru.length < kelas.length ? "\n\n⚠️ Jumlah guru lebih sedikit dari ruang — ada guru yang mengawas dua ruang dalam satu sesi." : "";
  const teks = _pgBungkus(`JADWAL PENGAWAS ${String(k.judul).toUpperCase()}`,
    `Berikut jadwal pengawas *${k.judul}* (${_pgRentang(k.tanggal_mulai, k.tanggal_selesai).replace(/ \([^)]*H\)/g, "")}):\n\n${baris}${catatan}\n\nMohon pengawas hadir 15 menit sebelum ujian dimulai, mengambil soal & daftar hadir di kantor, serta mengisi berita acara. Bila berhalangan, mohon bertukar dengan guru lain dan mengabari admin.`);
  openModal(`<h3>🛡️ Jadwal Pengawas — ${escapeHtml(k.judul)}</h3>
    <div class="uj-sub" style="margin:-4px 0 8px">Beban: ${Object.entries(beban).sort((a, b) => b[1] - a[1]).map(([n, v]) => `${escapeHtml(_pgNama(n))} ${v}×`).join(" · ")}</div>
    <textarea id="pg-teks" class="input" rows="16" style="font-size:13px;line-height:1.55">${escapeHtml(teks)}</textarea>
    <div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap">
      <button class="btn btn-outline" style="flex:1" onclick="_pgPengawas()">‹ Ubah</button>
      <button class="btn btn-ghost" style="flex:1" onclick="_pgSusunPengawas()">🔀 Acak ulang</button>
      <button class="btn btn-ghost" style="flex:1" onclick="_pgSalin('pengawas')">📋 Salin</button>
      <button class="btn btn-wa" style="flex:2" onclick="_pgKirim('pengawas')">💬 Kirim ke grup WA</button></div>`, { lebar: true });
}
function _pgTeksBelum(daftar) {
  if (!daftar.length) return "Alhamdulillah, per hari ini *semua nilai & catatan rapor sudah lengkap*. Jazakumullahu khairan 🙏";
  return `Per ${_pgFmt(_pgHariIni(), { tanpaHijri: true })}, yang *belum lengkap*:\n${daftar.map((d, i) => `${i + 1}. *${_pgNama(d.nama)}*: ${d.teks.join("; ")}`).join("\n")}\n\nBagi yang sudah lengkap, jazakumullahu khairan.`;
}

async function _pgBuka(id) {
  const s = PG.saran.find((x) => x.id === id);
  const JUDUL_UMUM = { pekan: "📅 Agenda pekan ini", "pekan-wali": "📅 Agenda santri pekan ini", "nilai-sekarang": "📊 Kelengkapan nilai", "jurnal-pekan": "📝 Jurnal belum diisi", "modul-belum": "📚 Modul ajar belum diunggah", "rekap-guru": "🧑‍🏫 Rekap kehadiran guru", bebas: "✍️ Pengumuman bebas" };
  const judul = s ? `${PG_IKON[s.tipe]} ${PG_NAMA[s.tipe]}` : JUDUL_UMUM[id] || "📢 Pengumuman";
  openModal(`<h3>${judul}</h3>${s ? `<div class="uj-sub" style="margin:-4px 0 8px">${escapeHtml(s.k.judul || "")} · ${escapeHtml(_pgRentang(s.k.tanggal_mulai, s.k.tanggal_selesai))} · disarankan dikirim ${escapeHtml(_pgFmt(s.kirim, { tanpaHijri: true }))}</div>` : ""}
    <textarea id="pg-teks" class="input" rows="16" style="font-size:13px;line-height:1.55">Menyusun…</textarea>
    <div class="uj-sub" style="margin-top:4px">*tebal* dan _miring_ tampil sebagai huruf tebal/miring di WhatsApp. Bagian dalam [kurung siku] silakan dilengkapi.</div>
    <div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap">
      <button class="btn btn-outline" style="flex:1" onclick="_pgDaftar()">‹ Kembali</button>
      <button class="btn btn-ghost" style="flex:1" onclick="_pgSalin('${id}')">📋 Salin</button>
      <button class="btn btn-wa" style="flex:2" onclick="_pgKirim('${id}')">💬 Kirim ke grup WA</button></div>`, { lebar: true });
  try { qs("pg-teks").value = await _pgSusunTeks(id); } catch (e) { console.error(e); qs("pg-teks").value = "Gagal menyusun: " + e.message; }
}
async function _pgTandai(id) {
  if (!PG.saran.some((x) => x.id === id)) return;
  PG.riwayat[id] = new Date().toISOString();
  try { await _kvSimpan("pengumuman:riwayat", PG.riwayat); } catch (e) { console.warn(e); }
}
async function _pgSalin(id) {
  const t = typeof waAman === "function" ? waAman(qs("pg-teks").value) : qs("pg-teks").value; // emoji aman untuk WA komputer
  try { await navigator.clipboard.writeText(t); toast("📋 Teks disalin — tempel di grup WhatsApp", "ok"); }
  catch (e) { qs("pg-teks").select(); document.execCommand("copy"); toast("📋 Teks disalin", "ok"); }
  _pgTandai(id);
}
function _pgKirim(id) {
  // wa.me tanpa nomor → WhatsApp terbuka dan meminta memilih chat/grup tujuan
  window.open("https://wa.me/?text=" + encodeURIComponent(qs("pg-teks").value), "_blank", "noopener");
  _pgTandai(id);
}

// ── Pengingat di Dasbor admin/kepsek: "N pengumuman perlu dikirim hari ini" ──
// Dihitung sekali per hari per perangkat (hemat kuota); setelah mengirim, angka diperbarui saat dasbor dibuka lagi.
async function _pgHitungJatuhTempo() {
  const kunci = "pgIngat:" + _pgHariIni();
  try { const c = JSON.parse(sessionStorage.getItem(kunci) || "null"); if (c && Date.now() - c.t < 30 * 60 * 1000) return c.n; } catch (e) {}
  await _pgMuatData();
  const hariIni = _pgHariIni(), semua = [..._pgSusunSaran("guru"), ..._pgSusunSaran("wali")];
  const n = semua.filter((s) => !PG.riwayat[s.id] && s.kirim <= hariIni).length;
  try { sessionStorage.setItem(kunci, JSON.stringify({ n, t: Date.now() })); } catch (e) {}
  return n;
}
async function _pgPasangPengingat() {
  if (!(isAdmin() || isKepsek())) return;
  const halaman = document.getElementById("page-dashboard"); if (!halaman) return;
  let n = 0; try { n = await _pgHitungJatuhTempo(); } catch (e) { return; }
  let el = document.getElementById("pg-ingat");
  if (!n) { el?.remove(); return; }
  if (!el) { el = document.createElement("div"); el.id = "pg-ingat"; halaman.prepend(el); }
  el.className = "pg-ingat";
  el.innerHTML = `<span>🔔</span><div><b>${n} pengumuman perlu dikirim</b><small>sesuai kalender akademik — ke grup guru / wali santri</small></div><button class="btn btn-wa btn-sm" onclick="sessionStorage.removeItem('pgIngat:${_pgHariIni()}');bukaPengumumanWa()">📢 Buka</button>`;
}
(() => {
  const asli = window.renderDashboard; if (typeof asli !== "function") return;
  window.renderDashboard = async function (...a) { const r = await asli.apply(this, a); _pgPasangPengingat(); return r; };
})();

// Tombol di halaman Kalender Akademik (admin & kepsek)
(() => {
  const asli = window.renderKaldikInit; if (typeof asli !== "function") return;
  window.renderKaldikInit = async function (...a) { qsa(".pg-tombol").forEach((b) => (b.style.display = isAdmin() || isKepsek() ? "" : "none")); return asli.apply(this, a); };
})();

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
const PG = { kaldik: [], atur: null, riwayat: {}, hari: new Set(), saran: [] };
const PG_BAWAAN = {
  salam: "Assalamu'alaikum warahmatullahi wabarakatuh.",
  sapaan: "Kepada Bapak/Ustadz dewan guru PKBM Al Umm Barabai yang dirahmati Allah,",
  penutup: "Jazakumullahu khairan atas perhatian dan kerja samanya.\nWassalamu'alaikum warahmatullahi wabarakatuh.",
  pengirim: "Admin PKBM Al Umm Barabai", hijri: true,
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
    try { s += ` (${new Intl.DateTimeFormat("id-u-ca-islamic-umalqura", { day: "numeric", month: "long", year: "numeric" }).format(d).replace(/\s*(H|AH)$/i, "")} H)`; } catch (e) {}
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
  const t = `${k.judul || ""} ${k.keterangan || ""}`.toLowerCase();
  if (/rapat|musyawarah|koordinasi guru/.test(t)) return "rapat";
  if (/rapor|raport|rapot/.test(t)) return "rapor";
  if (/tahfi[zd]h?|tasmi'?|munaqasy|setoran hafalan/.test(t)) return "tahfizh";
  if (/\b(uts|pts|sts)\b|tengah semester/.test(t)) return "uts";
  if (/\b(uas|pas|pat|sas)\b|akhir semester|akhir tahun|ujian akhir|asesmen akhir|penilaian akhir|sumatif akhir|ujian semester/.test(t)) return "uas";
  if (k.jenis === "ujian" || /ujian|asesmen|penilaian/.test(t)) return "ujian";
  if (k.jenis === "libur") return "libur";
  return "agenda";
}
const PG_IKON = { akhir_kbm: "🏁", soal: "📝", jadwal_ujian: "🗓️", nilai: "📊", rapat: "🤝", rapat_ingat: "⏰", libur: "🏖️", rapor: "📘", pekan: "📅", bebas: "✍️" };
const PG_NAMA = { akhir_kbm: "Akhir KBM", soal: "Pengumpulan soal ujian", jadwal_ujian: "Pelaksanaan ujian", nilai: "Pengumpulan nilai rapor", rapat: "Undangan rapat", rapat_ingat: "Pengingat rapat", libur: "Info libur & masuk kembali", rapor: "Persiapan pembagian rapor", pekan: "Agenda pekan ini", bebas: "Pengumuman bebas" };

function _pgSusunSaran() {
  const hariIni = _pgHariIni(), batasAwal = _pgGeser(hariIni, -7), batasAkhir = _pgGeser(hariIni, 160);
  const out = [];
  const tambah = (k, tipe, kirim, ekstra = {}) => out.push({ id: `${k.id}:${tipe}`, k, tipe, kirim, ...ekstra });
  PG.kaldik.filter((k) => k.tanggal_mulai >= batasAwal && k.tanggal_mulai <= batasAkhir).forEach((k) => {
    const kat = _pgKategori(k), mulai = k.tanggal_mulai;
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

async function bukaPengumumanWa() {
  if (!(isAdmin() || isKepsek())) { toast("Fitur ini untuk admin & kepala sekolah", "err"); return; }
  openModal(`<h3>📢 Pengumuman WA Grup Guru</h3><div id="pg-isi">${loadingHTML()}</div>`, { lebar: true });
  try {
    await ensureLookups();
    const [kaldik, atur, riwayat, jadwal] = await Promise.all([
      apiGetKaldikSemua(), _kvAmbil("pengumuman:atur", {}), _kvAmbil("pengumuman:riwayat", {}),
      supa.from("jadwal_pelajaran").select("hari").eq("aktif", true).then(unwrap).catch(() => []),
    ]);
    PG.kaldik = kaldik || []; PG.atur = { ...PG_BAWAAN, ...(atur || {}) }; PG.riwayat = riwayat || {};
    PG.hari = new Set(jadwal.map((j) => j.hari).filter(Boolean));
    PG.saran = _pgSusunSaran();
    _pgDaftar();
  } catch (e) { console.error(e); qs("pg-isi").innerHTML = `<div class="card empty-state">Gagal memuat kalender: ${escapeHtml(e.message)}</div>`; }
}
function _pgDaftar() {
  const el = qs("pg-isi"); if (!el) { openModal(`<h3>📢 Pengumuman WA Grup Guru</h3><div id="pg-isi"></div>`, { lebar: true }); return _pgDaftar(); }
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
  el.innerHTML = `
    <div class="uj-sub" style="margin:-4px 0 10px;line-height:1.6">Disusun otomatis dari <b>Kalender Akademik</b>. Pilih pengumuman → periksa/edit teks → kirim ke grup WhatsApp.</div>
    <div class="pg-umum">
      <button type="button" class="pg-kartu" onclick="_pgBuka('pekan')"><span class="pg-ikon">📅</span><span class="pg-teks"><b>Agenda pekan ini</b><small>semua kegiatan kaldik 7 hari ke depan</small></span></button>
      <button type="button" class="pg-kartu" onclick="_pgBuka('nilai-sekarang')"><span class="pg-ikon">📊</span><span class="pg-teks"><b>Kelengkapan nilai saat ini</b><small>sebut guru & mapel yang belum lengkap</small></span></button>
      <button type="button" class="pg-kartu" onclick="_pgBuka('bebas')"><span class="pg-ikon">✍️</span><span class="pg-teks"><b>Pengumuman bebas</b><small>salam & penutup sudah tersusun</small></span></button>
    </div>
    ${perlu.length ? `<div class="rwk-judul">🔔 Perlu dikirim (${perlu.length})</div>${perlu.map(kartu).join("")}` : ""}
    <div class="rwk-judul">🗓️ Dari kalender akademik</div>
    ${nanti.length ? nanti.map(kartu).join("") : `<div class="card empty-state" style="font-size:12.5px">Belum ada kegiatan ujian/rapat/rapor/libur di kaldik 5 bulan ke depan.<br>Tambahkan di menu <b>Kalender Akademik</b> — judul seperti “UAS Semester Ganjil”, “Ujian Tahfizh”, “Rapat Guru”, “Pembagian Rapor”.</div>`}
    <details class="je-atur" style="margin-top:12px"><summary>⚙️ Salam, sapaan, penutup & nama pengirim</summary>
      ${["salam", "sapaan", "penutup", "pengirim"].map((k) => `<div class="field" style="margin:6px 0 0"><label class="form-label" style="text-transform:capitalize">${k}</label><textarea class="input pg-atur" data-k="${k}" rows="${k === "penutup" ? 2 : 1}">${escapeHtml(PG.atur[k])}</textarea></div>`).join("")}
      <label class="je-opsi"><input type="checkbox" id="pg-hijri" ${PG.atur.hijri ? "checked" : ""}> <span>Sertakan tanggal Hijriah</span></label>
      <button class="btn btn-outline btn-sm" style="margin-top:6px" onclick="_pgSimpanAtur()">💾 Simpan pengaturan</button>
      <div class="uj-sub" style="margin-top:6px">Kegiatan dikenali dari judul di kaldik: UAS/PAS/PAT, UTS/PTS, Ujian Tahfizh, Rapat, Pembagian Rapor, dan libur lebih dari sehari. Tanggal kirim: soal H-21 (batas H-14), akhir KBM H-7, nilai H-14 (batas H-7 rapor), rapat H-3 & H-1, libur H-2.</div>
    </details>`;
}
async function _pgSimpanAtur() {
  qsa(".pg-atur").forEach((i) => (PG.atur[i.dataset.k] = i.value.trim()));
  PG.atur.hijri = qs("pg-hijri").checked;
  try { await _kvSimpan("pengumuman:atur", PG.atur); toast("Pengaturan pengumuman tersimpan", "ok"); } catch (e) { toast("Gagal menyimpan: " + e.message, "err"); }
}

// ── Isi pengumuman ──
const _pgBungkus = (judul, isi) => `📢 *${judul}*\n\n${PG.atur.salam}\n${PG.atur.sapaan}\n\n${isi}\n\n${PG.atur.penutup}\n\n_${PG.atur.pengirim}_`;
function _pgDaftarTugasGuru() {
  // guru → [mapel kelas] dari jadwal aktif (untuk pengumpulan soal)
  return supa.from("jadwal_pelajaran").select("guru_id,kelas_id,mapel_id").eq("aktif", true).then(unwrap).then((rows) => {
    const per = {};
    rows.forEach((r) => {
      const g = (LOOKUP.guruAll || []).find((x) => x.id === r.guru_id), m = LOOKUP.mapel.find((x) => x.id === r.mapel_id), k = LOOKUP.kelas.find((x) => x.id === r.kelas_id);
      if (!g || !m || !k) return;
      const teks = `${m.nama_mapel} ${typeof formatKelasLabel === "function" ? "Kelas " + formatKelasLabel(k.nama_kelas) : k.nama_kelas}`;
      (per[g.nama] = per[g.nama] || new Set()).add(teks);
    });
    return Object.keys(per).sort((a, b) => a.localeCompare(b, "id")).map((n) => `• ${_pgNama(n)}: ${[...per[n]].sort().join(", ")}`);
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
  if (id === "pekan") {
    const akhir = _pgGeser(hariIni, 7);
    const ada = PG.kaldik.filter((k) => (k.tanggal_selesai || k.tanggal_mulai) >= hariIni && k.tanggal_mulai <= akhir);
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
        `Sehubungan dengan pelaksanaan *${judul}* pada *${_pgRentang(k.tanggal_mulai, k.tanggal_selesai)}*, Bapak/Ustadz dimohon mengumpulkan *soal ujian beserta kunci jawaban* kepada admin paling lambat:\n\n⏰ *${_pgFmt(s.batas)}* (H-14 ujian)\n\nSoal boleh dikirim dalam bentuk file Word, atau langsung dibuat di menu *Ujian* aplikasi (bisa tempel dari Word, termasuk soal bahasa Arab).${tugas.length ? `\n\nDaftar mapel sesuai jadwal mengajar:\n${tugas.join("\n")}` : ""}${ket}`);
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
    case "libur": {
      const masuk = _pgHariAktifSesudah(k.tanggal_selesai || k.tanggal_mulai);
      return _pgBungkus(/^libur/i.test(judul) ? judul.toUpperCase() : `LIBUR ${judul.toUpperCase()}`,
        `Diberitahukan bahwa sesuai kalender akademik, kegiatan belajar *diliburkan* dalam rangka *${judul}* pada *${_pgRentang(k.tanggal_mulai, k.tanggal_selesai)}*.\n\nKBM kembali aktif pada *${_pgFmt(masuk)}*. Mohon disampaikan juga kepada santri.${ket}`);
    }
  }
  return "";
}
function _pgTeksBelum(daftar) {
  if (!daftar.length) return "Alhamdulillah, per hari ini *semua nilai & catatan rapor sudah lengkap*. Jazakumullahu khairan 🙏";
  return `Per ${_pgFmt(_pgHariIni(), { tanpaHijri: true })}, yang *belum lengkap*:\n${daftar.map((d, i) => `${i + 1}. *${_pgNama(d.nama)}*: ${d.teks.join("; ")}`).join("\n")}\n\nBagi yang sudah lengkap, jazakumullahu khairan.`;
}

async function _pgBuka(id) {
  const s = PG.saran.find((x) => x.id === id);
  const judul = s ? `${PG_IKON[s.tipe]} ${PG_NAMA[s.tipe]}` : id === "pekan" ? "📅 Agenda pekan ini" : id === "nilai-sekarang" ? "📊 Kelengkapan nilai" : "✍️ Pengumuman bebas";
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
  const t = qs("pg-teks").value;
  try { await navigator.clipboard.writeText(t); toast("📋 Teks disalin — tempel di grup WhatsApp", "ok"); }
  catch (e) { qs("pg-teks").select(); document.execCommand("copy"); toast("📋 Teks disalin", "ok"); }
  _pgTandai(id);
}
function _pgKirim(id) {
  // wa.me tanpa nomor → WhatsApp terbuka dan meminta memilih chat/grup tujuan
  window.open("https://wa.me/?text=" + encodeURIComponent(qs("pg-teks").value), "_blank", "noopener");
  _pgTandai(id);
}

// Tombol di halaman Kalender Akademik (admin & kepsek)
(() => {
  const asli = window.renderKaldikInit; if (typeof asli !== "function") return;
  window.renderKaldikInit = async function (...a) { qsa(".pg-tombol").forEach((b) => (b.style.display = isAdmin() || isKepsek() ? "" : "none")); return asli.apply(this, a); };
})();

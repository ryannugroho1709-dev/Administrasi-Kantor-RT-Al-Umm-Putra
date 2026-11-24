// ============================================================
//  🏢 KANTOR PKBM — percakapan antarjabatan (tanpa AI): topik dikenali dari pesan, lalu petugas
//  terkait rapat & melapor bergantian dengan data aplikasi (hanya dibaca). Juga "Kabar Baru":
//  perubahan data dari guru sejak Kepala terakhir membuka kantor dilaporkan tiap jenjang.
// ============================================================
const _ktRp = (n) => "Rp " + Math.round(Number(n) || 0).toLocaleString("id-ID");
const _ktPersen = (a, b) => (b ? Math.round((a / b) * 100) : 0) + "%";
const KT_RG = ["A", "Pa", "Pi"];
const _ktBulanIni = () => new Date().getMonth() + 1;
const KT_BLN = ["", "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
const _ktLi = (a) => `<ul class="kt-ul">${a.filter(Boolean).map((x) => `<li>${x}</li>`).join("")}</ul>`;

// ── Data BOSP lengkap: pagu, honor pengelola, Kertas Kerja, Draft RKAS, realisasi, pemeriksaan ──
async function _ktDataBosp() {
  const th = typeof _bspTahunAwal === "function" ? _bspTahunAwal() : new Date().getFullYear();
  const ambil = (kunci, ruang) => supaSemua.from("kuliah_pengaturan").select("nilai").eq("kunci", kunci).eq("ruang_id", ruang).maybeSingle().then((r) => (r.data && r.data.nilai) || {});
  const [umum, cek, ...per] = await Promise.all([ambil("bosp:th:" + th, "*"), ambil("bosp:rkas-cek:" + th, "*"),
    ...KT_RG.flatMap((r) => [ambil("bosp:kk:" + th, r), ambil("bosp:rkas:" + th, r), ambil("bosp:rkas-real:" + th, r)])]);
  // honor pengelola (sama seperti Kertas Kerja)
  const pengelola = Object.values(umum.pengelola || {}).filter((p) => p && !p.dihapus);
  const honorBulan = (m) => pengelola.reduce((a, p) => a + ((p.bulan || []).includes(m) ? Number(p.honor) || 0 : 0), 0);
  const honorTahun = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].reduce((a, m) => a + honorBulan(m), 0);
  const pagu = umum.pagu || {}, sumPagu = KT_RG.reduce((a, r) => a + (Number(pagu[r]) || 0), 0), rata = umum.bagi_pengelola === "rata" || !sumPagu;
  const bagian = (r) => Math.round(honorTahun * (rata ? 1 / 3 : (Number(pagu[r]) || 0) / sumPagu));
  const bi = typeof _rkrBulanIni === "function" ? _rkrBulanIni(th) : Math.min(12, _ktBulanIni()), bln = Math.min(12, bi), hasil = { th, bulanBerjalan: bi, pagu, honorTahun, rata, nPengelola: pengelola.length, jenjang: {}, perbaiki: 0 };
  Object.entries(cek || {}).forEach(([, v]) => { if (v && v.status === "perbaiki") hasil.perbaiki++; });
  KT_RG.forEach((r, i) => {
    const kk = per[i * 3], rk = per[i * 3 + 1], real = per[i * 3 + 2];
    const baris = Object.values(kk.baris || {}).filter((b) => b && !b.dihapus && !b.hapus);
    const totKK = baris.reduce((a, b) => a + (typeof bspTotalBaris === "function" ? bspTotalBaris(b) : 0), 0);
    const kkT1 = baris.reduce((a, b) => a + [1, 2, 3, 4, 5, 6].reduce((s, m) => s + (typeof bspTotalBulan === "function" ? bspTotalBulan(b, m) : 0), 0), 0);
    const st = (umum.keputusan || {})[r] && ((umum.keputusan[r].t || 0) >= ((kk._status || {}).t || 0)) ? umum.keputusan[r].status : (kk._status || {}).status || "draf";
    const item = Object.values(rk.item || {}).filter((x) => x && !x.dihapus);
    const totRk = item.reduce((a, x) => a + (typeof rkJumlah === "function" ? rkJumlah(x) : 0), 0) + bagian(r);
    const kel = Object.values(rk.kel || {}).filter((k) => k && !k.dihapus).length;
    let rencanaSd = 0, realSd = 0, sudah = 0, telat = 0, tanpaNota = 0, nKeg = 0;
    for (let m = 1; m <= bln; m++) {
      if (typeof rkrRingkasBulan !== "function") break;
      const o = rkrRingkasBulan(rk, real, m, th); rencanaSd += o.rencana; realSd += o.real; sudah += o.sudah; telat += o.telat; tanpaNota += o.tanpaNota; nKeg += o.n;
    }
    const ini = bln && typeof rkrRingkasBulan === "function" ? rkrRingkasBulan(rk, real, bln, th) : { n: 0, sudah: 0, rencana: 0, real: 0 };
    hasil.jenjang[r] = { pagu: Number(pagu[r]) || 0, honor: bagian(r), kk: { n: baris.length, total: totKK, t1: kkT1, t2: totKK - kkT1, status: st, catatan: ((umum.keputusan || {})[r] || {}).catatan || "" },
      rkas: { kel, n: item.length, total: totRk, dana: Number(rk.dana) || 0 }, real: { rencanaSd, realSd, sudah, telat, tanpaNota, nKeg }, ini };
  });
  return hasil;
}
const KT_STATUS_KK = { draf: "masih disusun", diajukan: "menunggu pengesahan", disahkan: "sudah disahkan ✓", dikembalikan: "dikembalikan untuk revisi" };

// ── Data kegiatan jenjang (30 hari) ──
async function _ktDataJenjang(r, hari = 30) {
  const sejak = new Date(Date.now() - hari * 864e5), sTgl = sejak.toISOString().slice(0, 10), sIso = sejak.toISOString();
  const hitung = (q) => q.then((x) => x.count || 0, () => 0);
  const [abs, jur, izin, izinTunggu, tukar, nilai, ujian, siswa, tanpaKelas] = await Promise.all([
    supaSemua.from("absensi_sesi").select("guru_id,jurnal_id,status_kehadiran").eq("ruang_id", r).gte("tanggal", sTgl).lte("tanggal", new Date().toISOString().slice(0, 10)).not("status_kehadiran", "is", null).not("dihapus", "is", true),
    hitung(supaSemua.from("jurnal_kelas").select("id", { count: "exact", head: true }).eq("ruang_id", r).gte("tanggal", sTgl)),
    hitung(supaSemua.from("pengajuan_izin_sakit").select("id", { count: "exact", head: true }).eq("ruang_id", r).gte("tanggal", sTgl).not("dihapus", "is", true)),
    hitung(supaSemua.from("pengajuan_izin_sakit").select("id", { count: "exact", head: true }).eq("ruang_id", r).is("diproses_at", null).not("dihapus", "is", true)),
    hitung(supaSemua.from("tukar_jadwal").select("id", { count: "exact", head: true }).eq("ruang_id", r).gte("tanggal_asal", sTgl)),
    hitung(supaSemua.from("nilai_rapor").select("id", { count: "exact", head: true }).eq("ruang_id", r).gte("updated_at", sIso)),
    hitung(supaSemua.from("ujian_sesi").select("id", { count: "exact", head: true }).eq("ruang_id", r).gte("created_at", sIso)),
    hitung(supaSemua.from("siswa").select("id", { count: "exact", head: true }).eq("ruang_id", r).eq("status_aktif", true)),
    hitung(supaSemua.from("siswa").select("id", { count: "exact", head: true }).eq("ruang_id", r).eq("status_aktif", true).is("kelas_id", null)),
  ]);
  const a = abs.data || [];
  const hadir = a.filter((x) => x.status_kehadiran === "hadir");
  return { hari, sesi: hadir.length, guru: new Set(hadir.map((x) => x.guru_id)).size, berjurnal: hadir.filter((x) => x.jurnal_id).length, alpha: a.filter((x) => /alpha|alpa/i.test(x.status_kehadiran || "")).length, izinSesi: a.filter((x) => /izin|sakit/.test(x.status_kehadiran)).length, jurnal: jur, izin, izinTunggu, tukar, nilai, ujian, siswa, tanpaKelas };
}

// ── Kabar baru sejak terakhir dibuka ──
const _ktKunciTerakhir = () => "kt:terakhir:" + (STATE.guruId || "");
async function _ktKabarBaru(sejak) {
  const sIso = new Date(sejak).toISOString(), sTgl = new Date(sejak + 7 * 3600e3).toISOString().slice(0, 10), hariIni = new Date(Date.now() + 7 * 3600e3).toISOString().slice(0, 10), th = typeof _bspTahunAwal === "function" ? _bspTahunAwal() : new Date().getFullYear();
  const hitung = (q) => q.then((x) => x.count || 0, () => 0);
  const kabar = {};
  await Promise.all(KT_RG.map(async (r) => {
    const [abs, jur, izin, tukar, nilai, sBaru, sUbah, ujian, real] = await Promise.all([
      supaSemua.from("absensi_sesi").select("guru_id,status_kehadiran").eq("ruang_id", r).gte("tanggal", sTgl).lte("tanggal", hariIni).not("status_kehadiran", "is", null).not("dihapus", "is", true),
      hitung(supaSemua.from("jurnal_kelas").select("id", { count: "exact", head: true }).eq("ruang_id", r).gte("tanggal", sTgl).lte("tanggal", hariIni)),
      supaSemua.from("pengajuan_izin_sakit").select("jenis,diproses_at").eq("ruang_id", r).or(`created_at.gte.${sIso},and(created_at.is.null,tanggal.gte.${sTgl})`).not("dihapus", "is", true),
      hitung(supaSemua.from("tukar_jadwal").select("id", { count: "exact", head: true }).eq("ruang_id", r).or(`created_at.gte.${sIso},and(created_at.is.null,tanggal_asal.gte.${sTgl})`)),
      supaSemua.from("nilai_rapor").select("guru_id").eq("ruang_id", r).gte("updated_at", sIso),
      hitung(supaSemua.from("siswa").select("id", { count: "exact", head: true }).eq("ruang_id", r).gte("created_at", sIso)),
      hitung(supaSemua.from("siswa").select("id", { count: "exact", head: true }).eq("ruang_id", r).gte("updated_at", sIso).lt("created_at", sIso)),
      hitung(supaSemua.from("ujian_sesi").select("id", { count: "exact", head: true }).eq("ruang_id", r).gte("created_at", sIso)),
      supaSemua.from("kuliah_pengaturan").select("nilai").eq("kunci", "bosp:rkas-real:" + th).eq("ruang_id", r).maybeSingle(),
    ]);
    const k = [], a = abs.data || [], iz = izin.data || [], nl = nilai.data || [];
    const hd = a.filter((x) => x.status_kehadiran === "hadir"), al = a.filter((x) => /alpha|alpa/.test(x.status_kehadiran)), iz2 = a.filter((x) => /izin|sakit/.test(x.status_kehadiran));
    const bagA = [hd.length ? `${hd.length} sesi mengajar hadir (${new Set(hd.map((x) => x.guru_id)).size} tutor)` : "", iz2.length ? `${iz2.length} sesi izin/sakit` : "", al.length ? `<b>${al.length} sesi alpha (tidak absen)</b>` : ""].filter(Boolean);
    if (bagA.length) k.push("🕌 Absensi tutor: " + bagA.join(", "));
    if (jur) k.push(`📓 ${jur} jurnal kelas baru`);
    if (iz.length) k.push(`📝 ${iz.length} pengajuan izin/sakit${iz.filter((x) => !x.diproses_at).length ? ` — ${iz.filter((x) => !x.diproses_at).length} menunggu keputusan` : ""}`);
    if (tukar) k.push(`🔁 ${tukar} pengajuan tukar/pindah jam`);
    if (nl.length) k.push(`📊 ${nl.length} baris nilai rapor diisi/diubah oleh ${new Set(nl.map((x) => x.guru_id)).size} guru`);
    if (sBaru) k.push(`🎒 ${sBaru} siswa baru ditambahkan`);
    if (sUbah) k.push(`✏️ ${sUbah} data siswa diperbarui`);
    if (ujian) k.push(`🧪 ${ujian} sesi ujian/latihan dibuka`);
    const rl = Object.values((real.data && real.data.nilai) || {}).filter((x) => x && (x.t || 0) >= sejak);
    if (rl.length) k.push(`💳 ${rl.length} laporan realisasi Draft RKAS (${rl.filter((x) => x.status === "sudah").length} sudah dibelanjakan, ${_ktRp(rl.reduce((s, x) => s + (x.status === "sudah" ? Number(x.rp) || 0 : 0), 0))})`);
    kabar[r] = k;
  }));
  try {
    const lg = await supaSemua.from("log_aktivitas").select("aksi,nama,ruang_id,rincian").gte("waktu", sIso).not("aksi", "in", "(masuk-akun,pindah-ruang)").limit(500);
    const LABEL = { "bosp-ubah": "mengubah Kertas Kerja BOSP", "bosp-honor-pengelola": "mengatur honor pengelola", "bosp-disahkan": "mengesahkan Kertas Kerja", "ubah-ruang-guru": "mengubah anggota ruang", "ubah-ruang-utama": "mengubah ruang utama guru", "ubah-fitur-ruang": "mengatur fitur ruang", "buat-akun": "membuat akun guru", "buat-akun-massal": "membuat akun guru massal", "setujui-akun": "menyetujui akun guru", "akun-wajib": "mengatur wajib akun", "ubah-penyelenggara": "mengubah penyelenggara", "rapikan-ai": "merapikan soal" };
    const per = {};
    (lg.data || []).forEach((x) => { const r = ["A", "Pa", "Pi"].includes(x.ruang_id) ? x.ruang_id : "Pg"; const kunci = (x.nama || "?") + "|" + x.aksi; (per[r] = per[r] || {})[kunci] = ((per[r] || {})[kunci] || 0) + 1; });
    Object.entries(per).forEach(([r, isi]) => Object.entries(isi).slice(0, 6).forEach(([k, n]) => { const [nm, aksi] = k.split("|"); (kabar[r] = kabar[r] || []).push(`🗒️ ${_ktE(String(nm).split(",")[0])} ${LABEL[aksi] || aksi.replace(/-/g, " ")}${n > 1 ? ` (${n}×)` : ""}`); }));
  } catch (e) {}
  // keuangan PKBM (Kertas Kerja diajukan/disahkan)
  try {
    const um = await supaSemua.from("kuliah_pengaturan").select("nilai").eq("kunci", "bosp:th:" + th).eq("ruang_id", "*").maybeSingle();
    const kep = ((um.data && um.data.nilai) || {}).keputusan || {}, k = [];
    Object.entries(kep).forEach(([r, v]) => { if (v && (v.t || 0) >= sejak) k.push(`💰 Kertas Kerja ${KT_JENJANG[r] || r}: ${KT_STATUS_KK[v.status] || v.status}`); });
    kabar.Pg = [...k, ...(kabar.Pg || [])];
  } catch (e) { kabar.Pg = []; }
  KT.kabarCache = kabar;
  return kabar;
}

// ── Rapat: petugas berjalan ke Ruang Rapat, TV menyala, minuman disajikan ──
async function _ktRapat(kodes, judul, tv, ticker) {
  const ids = [...new Set(kodes.map((k) => (KT.peran[k] || [])[0]).filter((id) => id && KT.tokoh[id]))];
  const kid = (KT.peran.kepala || [])[0], urut = ids.filter((x) => x !== kid);
  const kursi = KT.kursiRapat.slice(1), duduk = [];
  const jalan = [];
  if (kid && KT.tokoh[kid]) { duduk.push(KT.kursiRapat[0]); jalan.push(_ktPergi(KT.tokoh[kid], KT.kursiRapat[0])); }
  urut.forEach((id, i) => { const k = kursi[i] || kursi[kursi.length - 1]; duduk.push(k); jalan.push(_ktJedaLalu(i * 350, () => _ktPergi(KT.tokoh[id], k))); });
  kdTvRapat(judul, tv, ticker);
  await Promise.all(jalan);
  kdMinuman(duduk);
  return ids;
}
const _ktJedaLalu = (ms, fn) => _ktTunggu(ms).then(fn);
async function _ktBubar(ids) {
  await _ktTunggu(2500);
  kdMinumanHapus(); kdTvDiam();
  await Promise.all(ids.map((id, i) => { const t = KT.tokoh[id]; return t ? _ktJedaLalu(i * 300, () => _ktPergi(t, t.userData.meja)) : null; }));
}

// ── Mengenali topik pesan ──
function _ktTopik(teks) {
  const t = " " + teks.toLowerCase() + " ";
  if (/kabar|apa yang baru|ada yang baru|update terbaru|perubahan data|laporan harian/.test(t)) return "kabar";
  if (/\b(bop|bosp|arkas|rkas|anggaran|keuangan|realisasi|pagu|honor pengelola|kertas kerja|belanja|spj)\b/.test(t)) return "bosp";
  if (/evaluasi|perkembangan|laporan (jenjang|kegiatan|kbm)|kegiatan|kbm|pembelajaran|kinerja/.test(t)) return "evaluasi";
  if (/data (siswa|santri|guru|peserta)|kelengkapan|dapodik|nisn|\bnik\b|biodata/.test(t)) return "data";
  return null;
}

// ── Skrip percakapan tiap topik: [{kode, html, singkat}] ──
async function _ktSkrip(topik, teks) {
  const t = teks.toLowerCase(), jj = _ktJenjangDari(" " + t + " "), daftarRg = jj ? [jj] : KT_RG;
  const wakil = (r) => ((KT.peran["peny-" + r] || []).length ? "peny-" + r : "admin-" + r);
  if (topik === "bosp") {
    const d = await _ktDataBosp(), baris = [], arahan = [];
    baris.push({ kode: "kepala", html: `Bismillah. Ana minta laporan lengkap <b>BOSP ${d.th}</b> — dari Bendahara lalu tiap jenjang: Kertas Kerja, Draft RKAS, dan realisasinya.`, singkat: `Ana minta laporan lengkap BOSP ${d.th}.` });
    const totPagu = KT_RG.reduce((a, r) => a + d.jenjang[r].pagu, 0);
    baris.push({ kode: "bendahara", html: `Baik, Ustadz. Gambaran umum BOSP ${d.th}:` + _ktLi([
      `Pagu PKBM: <b>${_ktRp(totPagu)}</b> — ${KT_RG.map((r) => `${KT_JENJANG[r]} ${_ktRp(d.jenjang[r].pagu)}`).join(" · ")}`,
      `Honor Pengelola PKBM: <b>${_ktRp(d.honorTahun)}</b>/tahun (${d.nPengelola} orang), ${d.rata ? "dibagi rata" : "dibagi sebanding pagu"} → ${KT_RG.map((r) => `${KT_JENJANG[r]} ${_ktRp(d.jenjang[r].honor)}`).join(" · ")}`,
      ...KT_RG.map((r) => { const k = d.jenjang[r].kk; return `Kertas Kerja ${KT_JENJANG[r]}: ${k.n} uraian, <b>${_ktRp(k.total)}</b> (${_ktPersen(k.total, d.jenjang[r].pagu)} dari pagu) · Tahap 1 ${_ktRp(k.t1)} · Tahap 2 ${_ktRp(k.t2)} — <b>${KT_STATUS_KK[k.status] || k.status}</b>${k.catatan ? ` (catatan: ${_ktE(k.catatan)})` : ""}`; }),
      d.perbaiki ? `⚠️ ${d.perbaiki} laporan realisasi ditandai <b>Perlu Perbaikan</b>` : "",
    ]), singkat: `Pagu ${_ktRp(totPagu)}, honor pengelola ${_ktRp(d.honorTahun)} — rincian di panel.` });
    KT_RG.forEach((r) => {
      const j = d.jenjang[r], sel = j.pagu - j.kk.total;
      baris.push({ kode: wakil(r), html: `Laporan <b>${KT_JENJANG[r]}</b>:` + _ktLi([
        `Draft RKAS: ${j.rkas.kel} kelompok, ${j.rkas.n} rincian, total <b>${_ktRp(j.rkas.total)}</b> (termasuk honor pengelola ${_ktRp(j.honor)})${j.rkas.dana ? ` · dana ${_ktRp(j.rkas.dana)}` : ""}`,
        `Kertas Kerja: ${_ktRp(j.kk.total)} — ${sel >= 0 ? `sisa pagu ${_ktRp(sel)}` : `<b style="color:#dc2626">melebihi pagu ${_ktRp(-sel)}</b>`}`,
        d.bulanBerjalan ? `Realisasi s.d. ${KT_BLN[Math.min(12, d.bulanBerjalan)]} ${d.th}: ${j.real.sudah} dari ${j.real.nKeg} kegiatan terlaksana, ${_ktRp(j.real.realSd)} dari rencana ${_ktRp(j.real.rencanaSd)} (${_ktPersen(j.real.realSd, j.real.rencanaSd)})` : `Tahun anggaran ${d.th} belum berjalan — realisasi dimulai Januari ${d.th}`,
        j.real.telat ? `⏰ ${j.real.telat} kegiatan terlambat dilaporkan` : "", j.real.tanpaNota ? `🧾 ${j.real.tanpaNota} belanja belum ada nota` : "",
        d.bulanBerjalan && d.bulanBerjalan <= 12 ? `Bulan ini: ${j.ini.n} kegiatan terjadwal (${_ktRp(j.ini.rencana)}), ${j.ini.sudah} sudah` : "",
        !j.rkas.n ? `<b>Draft RKAS belum disusun</b>` : "",
      ]), singkat: `${KT_JENJANG[r]}: Draft RKAS ${_ktRp(j.rkas.total)}${d.bulanBerjalan ? `, realisasi ${_ktPersen(j.real.realSd, j.real.rencanaSd)}` : ""}.` });
      if (!j.rkas.n) arahan.push(`${KT_JENJANG[r]}: segera susun Draft RKAS ${d.th}`);
      if (j.kk.status !== "disahkan") arahan.push(`Kertas Kerja ${KT_JENJANG[r]} ${KT_STATUS_KK[j.kk.status] || j.kk.status} — segera diselesaikan & diajukan`);
      if (sel < 0) arahan.push(`${KT_JENJANG[r]} melebihi pagu ${_ktRp(-sel)} — sesuaikan rincian`);
      if (j.real.telat) arahan.push(`${KT_JENJANG[r]}: ${j.real.telat} kegiatan terlambat — laporkan realisasinya`);
      if (j.real.tanpaNota) arahan.push(`${KT_JENJANG[r]}: lengkapi ${j.real.tanpaNota} nota belanja`);
    });
    if (d.perbaiki) arahan.push(`Tindak lanjuti ${d.perbaiki} realisasi yang perlu diperbaiki`);
    baris.push({ kode: "kepala", html: `Jazakumullahu khairan. Arahan ana:` + _ktLi(arahan.length ? arahan : ["Alhamdulillah, semua berjalan sesuai rencana. Pertahankan tertib laporan & bukti belanja."]), singkat: arahan.length ? `Ada ${arahan.length} hal yang perlu ditindaklanjuti.` : "Alhamdulillah, semua sesuai rencana." });
    const tv = KT_RG.map((r) => ({ label: { A: "Paket A", Pa: "Putra", Pi: "Putri" }[r], nilai: (d.bulanBerjalan ? d.jenjang[r].real.realSd : d.jenjang[r].rkas.total) || 0.001, teks: d.bulanBerjalan ? _ktPersen(d.jenjang[r].real.realSd, d.jenjang[r].real.rencanaSd) : (d.jenjang[r].rkas.total / 1e6).toFixed(1) + " jt", warna: { A: "#10b981", Pa: "#3b82f6", Pi: "#ec4899" }[r] }));
    return { baris, judul: `Rapat BOSP ${d.th}`, tv, ticker: arahan.join("  •  ") || "Laporan BOSP tiap jenjang", lanjut: [["Rinci Paket A", "rincian bosp paket a"], ["Rinci Putra", "rincian bosp putra"], ["Rinci Putri", "rincian bosp putri"]] };
  }
  if (topik === "evaluasi") {
    const baris = [], arahan = [], tv = [];
    baris.push({ kode: "kepala", html: `Bismillah. Kita evaluasi kegiatan ${jj ? KT_JENJANG[jj] : "semua jenjang"} 30 hari terakhir.`, singkat: "Kita evaluasi kegiatan 30 hari terakhir." });
    for (const r of daftarRg) {
      const d = await _ktDataJenjang(r);
      baris.push({ kode: wakil(r), html: `<b>${KT_JENJANG[r]}</b> — KBM 30 hari:` + _ktLi([
        `${d.sesi} sesi mengajar tercatat oleh ${d.guru} tutor · ${d.berjurnal} sesi berjurnal (${_ktPersen(d.berjurnal, d.sesi)})`,
        `${d.jurnal} jurnal kelas · ${d.izin} izin/sakit tutor${d.izinTunggu ? ` (<b>${d.izinTunggu} menunggu keputusan</b>)` : ""} · ${d.tukar} tukar/pindah jam`,
        `${d.ujian} sesi ujian/latihan · ${d.nilai} baris nilai rapor diperbarui`,
      ]), singkat: `${KT_JENJANG[r]}: ${d.sesi} sesi, jurnal ${_ktPersen(d.berjurnal, d.sesi)}.` });
      baris.push({ kode: "admin-" + r, html: `Data ${KT_JENJANG[r]}: ${d.siswa} siswa aktif${d.tanpaKelas ? `, <b>${d.tanpaKelas} belum punya kelas</b>` : ""}.`, singkat: `${d.siswa} siswa aktif.` });
      if (d.sesi && d.berjurnal / d.sesi < 0.8) arahan.push(`${KT_JENJANG[r]}: jurnal baru ${_ktPersen(d.berjurnal, d.sesi)} — ingatkan tutor mengisi jurnal`);
      if (d.izinTunggu) arahan.push(`${KT_JENJANG[r]}: ${d.izinTunggu} izin menunggu — Penyelenggara segera memutuskan`);
      if (d.tanpaKelas) arahan.push(`${KT_JENJANG[r]}: tempatkan ${d.tanpaKelas} siswa ke kelasnya`);
      if (!d.sesi) arahan.push(`${KT_JENJANG[r]}: belum ada absensi tutor 30 hari ini — periksa pelaksanaan KBM`);
      tv.push({ label: { A: "Paket A", Pa: "Putra", Pi: "Putri" }[r], nilai: d.sesi || 0.001, teks: String(d.sesi), warna: { A: "#10b981", Pa: "#3b82f6", Pi: "#ec4899" }[r] });
    }
    baris.push({ kode: "kepala", html: "Arahan ana:" + _ktLi(arahan.length ? arahan : ["Alhamdulillah KBM berjalan baik. Jaga kedisiplinan absensi & jurnal."]), singkat: arahan.length ? `Ada ${arahan.length} catatan untuk ditindaklanjuti.` : "Alhamdulillah, KBM baik." });
    return { baris, judul: `Evaluasi KBM ${jj ? KT_JENJANG[jj] : "Semua Jenjang"}`, tv, ticker: arahan.join("  •  "), lanjut: [["Laporan BOSP", "laporan bosp"], ["Data Siswa & Guru", "cek data siswa dan guru"]] };
  }
  if (topik === "data") {
    const baris = [];
    baris.push({ kode: "kepala", html: "Ana minta laporan kelengkapan data guru & siswa.", singkat: "Laporkan kelengkapan data." });
    for (const k of ["sekretaris", "dapodik"]) { const j = await _ktJawab(k, k === "sekretaris" ? "cek data guru dan siswa" : teks); baris.push({ kode: k, html: _ktE(j.teks).replace(/\n/g, "<br>"), singkat: j.singkat }); }
    baris.push({ kode: "kepala", html: "Jazakumullahu khairan. Admin tiap jenjang mohon melengkapi data yang masih kosong; Sekretaris memantau tiap pekan.", singkat: "Mohon dilengkapi, dipantau tiap pekan." });
    return { baris, judul: "Rapat Kelengkapan Data", tv: [], ticker: "Kelengkapan data guru & siswa", lanjut: [["Evaluasi KBM", "evaluasi kegiatan semua jenjang"]] };
  }
  return null;
}

// ── Kabar Baru: tiap jenjang yang ada perubahan melapor ke Kepala di Ruang Rapat ──
async function ktKabar(paksaJam, otomatis) {
  if (KT.sibuk) return; KT.sibuk = true; KT.bubarOtomatis = !!otomatis && !(KT.sesi && KT.sesi.aktif); KT.topikIni = "kabar";
  try {
    let sejak = 0; try { sejak = Number(localStorage.getItem(_ktKunciTerakhir())) || 0; } catch (e) {}
    if (paksaJam || !sejak) sejak = Date.now() - (paksaJam || 24) * 3600e3;
    const kabar = await _ktKabarBaru(sejak);
    try { localStorage.setItem(_ktKunciTerakhir(), String(Date.now())); } catch (e) {}
    const ada = KT_RG.filter((r) => (kabar[r] || []).length), keu = (kabar.Pg || []).length;
    const sejakTeks = new Date(sejak).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
    if (!ada.length && !keu) { _ktPanel(`<h3>📰 Kabar Baru</h3><p class="kt-ket">Belum ada perubahan data dari guru sejak ${sejakTeks}.</p><button class="kt-salin" onclick="ktKabar(168)">Lihat 7 Hari Terakhir</button>`); return; }
    const wakil = (r) => ((KT.peran["admin-" + r] || []).length ? "admin-" + r : "peny-" + r);
    const kodes = ["kepala", ...ada.flatMap((r) => ["admin-" + r, "peny-" + r]), ...(keu || (kabar.Pg || []).length ? ["bendahara"] : [])];
    _ktPanel(`<div class="kt-obrolan"><div class="kt-info">📰 Laporan kabar baru sejak ${sejakTeks}</div><div id="kt-jawaban"></div><div id="kt-lanjut"></div></div>`);
    const tv = ada.map((r) => ({ label: { A: "Paket A", Pa: "Putra", Pi: "Putri" }[r], nilai: kabar[r].length, teks: kabar[r].length + " kabar", warna: { A: "#10b981", Pa: "#3b82f6", Pi: "#ec4899" }[r] }));
    const ids = await _ktRapat(kodes, "Laporan Kabar Baru", tv, ada.map((r) => `${KT_JENJANG[r]}: ${kabar[r].length} kabar`).join("  •  "));
    const kid = (KT.peran.kepala || [])[0];
    await _ktTampilBaris({ kode: "kepala", html: "Assalamu'alaikum. Silakan laporkan perkembangan terbaru dari jenjang masing-masing.", singkat: "Silakan laporkan perkembangan terbaru." });
    for (const r of ada) {
      await _ktTampilBaris({ kode: wakil(r), html: `<b>${KT_JENJANG[r]}</b> — input terbaru:` + _ktLi(kabar[r]), singkat: `${KT_JENJANG[r]}: ${kabar[r][0].replace(/<[^>]+>/g, "").replace(/^\S+\s/, "")}${kabar[r].length > 1 ? `, dan ${kabar[r].length - 1} lainnya` : ""}.` });
      if ((KT.peran["peny-" + r] || []).length && wakil(r) !== "peny-" + r) await _ktTampilBaris({ kode: "peny-" + r, html: `Ana selaku Penyelenggara ${KT_JENJANG[r]} sudah menerima laporannya. ${kabar[r].some((x) => /menunggu/.test(x)) ? "Yang menunggu keputusan segera ana proses." : "Insya Allah ana pantau tindak lanjutnya."}`, singkat: "Na'am, ana tindak lanjuti di jenjang." });
    }
    if (keu) await _ktTampilBaris({ kode: "bendahara", html: "Keuangan:" + _ktLi(kabar.Pg), singkat: kabar.Pg[0].replace(/^\S+\s/, "") });
    await _ktTampilBaris({ kode: "kepala", html: "Jazakumullahu khairan. Teruskan, dan segera tindak lanjuti yang menunggu keputusan.", singkat: "Jazakumullahu khairan, lanjutkan." });
    void kid; void ids;
    if (KT.bubarOtomatis) await ktAkhiriRapat(true); else _ktOpsiRapat();
  } catch (e) { _ktPanel(`<h3>Kabar Baru</h3><p>Gagal memuat: ${_ktE(e.message || e)}</p>`); }
  finally { KT.sibuk = false; KT.bubarOtomatis = false; }
}
async function _ktTampilBaris(b) {
  const wrap = document.getElementById("kt-jawaban"), id = (KT.peran[b.kode] || [])[0], p = _ktPeran(b.kode), s = id && KT.staf.find((x) => x.id === id);
  if (wrap) { wrap.insertAdjacentHTML("beforeend", `<div class="kt-jawab" style="--w:${p.warna}"><small>${p.ikon} ${s ? _ktE(_ktGelar(s) + " " + s.nama) + " · " : ""}${_ktE(p.nama)}${s ? "" : " (petugas belum ditetapkan)"}</small><div>${b.html}</div></div>`); const pn = document.getElementById("kt-panel"); if (pn) pn.scrollTop = pn.scrollHeight; }
  if (id) await _ktBicara(id, b.singkat || "", 3600); else await _ktTunggu(600);
}

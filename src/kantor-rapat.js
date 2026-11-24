// ============================================================
//  🏢 KANTOR PKBM — rapat berkelanjutan, siaran langsung, kehadiran, lemari arsip
//  • Rapat tidak bubar sampai Admin menekan "🔚 Akhiri Rapat". Petugas lain bisa dipanggil di tengah rapat.
//  • Ustadzah selalu berjalan lebih dulu, baru ustadz (tidak berpapasan). Ustadzah tidak dipanggil ke
//    Ruang Kepala — cukup di Ruang Rapat (ruang terbuka); Kepala memanggil dari depan pintu Ruang Ustadzah.
//  • Ketua Yayasan (penyimak) datang dengan Fortuner putih lewat gapura untuk rapat inti (keuangan / laporan lengkap).
//  • Siaran: gerak & percakapan dikirim lewat Supabase Realtime ke yang diberi izin menyaksikan.
//  • Kehadiran: laptop menyala bila akun sedang masuk; berkedip bila sedang bekerja.
// ============================================================
KT.sesi = { aktif: false, ids: new Set(), judul: "" };
const KT_TOPIK_INTI = ["bosp", "kas", "lengkap"];
const _ktIdPeran = (k) => (KT.peran[k] || [])[0];
const _ktStafId = (id) => KT.staf.find((x) => x.id === id);
const _ktKursiUntuk = (id) => (KT.kursiOrang || {})[id] || KT.kursiIkhwan?.[0];

// ── rapat ──
async function ktSesiPastikan(kodes, judul, tv, ticker, topik) {
  const kid = _ktIdPeran("kepala"), yid = _ktIdPeran("yayasan");
  let ids = [...new Set((kodes || []).map(_ktIdPeran).filter((id) => id && KT.tokoh[id] && id !== yid))];
  if (kid && KT.tokoh[kid] && !ids.includes(kid)) ids.unshift(kid);
  const baru = !KT.sesi.aktif;
  if (baru) { KT.sesi = { aktif: true, ids: new Set(), judul }; }
  _ktTombolRapat();
  KT.sesi.judul = judul || KT.sesi.judul;
  kdTvRapat(KT.sesi.judul, tv, ticker);
  const datang = ids.filter((id) => !KT.sesi.ids.has(id));
  // ustadzah lebih dulu, baru ustadz
  const akhawat = datang.filter((id) => (_ktStafId(id) || {}).jk === "P"), ikhwan = datang.filter((id) => (_ktStafId(id) || {}).jk !== "P");
  for (const kelompok of [akhawat, ikhwan]) {
    await Promise.all(kelompok.map((id, i) => _ktTunggu(i * 380).then(() => _ktPergi(KT.tokoh[id], _ktKursiUntuk(id)))));
    kelompok.forEach((id) => KT.sesi.ids.add(id));
    if (kelompok.length) kdMinuman(kelompok.map(_ktKursiUntuk), true);
  }
  // Ketua Yayasan ikut menyimak rapat inti
  if (yid && KT.tokoh[yid] && KT_TOPIK_INTI.includes(topik) && !KT.sesi.ids.has(yid)) {
    await kdYayasanDatang(); await _ktPergi(KT.tokoh[yid], KT.kursiYayasan); KT.sesi.ids.add(yid); kdMinuman([KT.kursiYayasan], true);
  }
  _ktSimpanSiaran();
  return [...KT.sesi.ids];
}
// kompatibel dengan kode lama
_ktRapat = async function (kodes, judul, tv, ticker) { return ktSesiPastikan(kodes, judul, tv, ticker, KT.topikIni); };
_ktBubar = async function () { if (KT.bubarOtomatis) await ktAkhiriRapat(true); };
async function ktAkhiriRapat(diam) {
  if (!KT.sesi.aktif) return;
  const ids = [...KT.sesi.ids], yid = _ktIdPeran("yayasan"), kid = _ktIdPeran("kepala");
  if (!diam && kid) await _ktBicara(kid, "Alhamdulillah, rapat kita cukupkan. Jazakumullahu khairan. Subhanakallahumma wa bihamdika…", 2600);
  kdMinumanHapus(); kdTvDiam(); KT.sesi.aktif = false; _ktTombolRapat();
  const akhawat = ids.filter((id) => (_ktStafId(id) || {}).jk === "P" && id !== yid), ikhwan = ids.filter((id) => (_ktStafId(id) || {}).jk !== "P" && id !== yid);
  if (yid && ids.includes(yid)) kdYayasanPulang();
  for (const kel of [akhawat, ikhwan]) await Promise.all(kel.map((id, i) => _ktTunggu(i * 300).then(() => { const t = KT.tokoh[id]; return t ? _ktPergi(t, t.userData.meja) : null; })));
  KT.sesi.ids = new Set();
  if (!diam) { const ln = document.getElementById("kt-lanjut"); if (ln) ln.innerHTML = `<div class="kt-info">🔚 Rapat diakhiri</div>`; }
  _ktSimpanSiaran();
}
// pilihan lanjutan setelah tiap pembahasan (hijau), termasuk memanggil petugas & mengakhiri rapat
function _ktOpsiRapat() {
  const ln = document.getElementById("kt-lanjut"); if (!ln || KT.penonton) return;
  if (!KT.sesi.aktif) { ln.innerHTML = ""; return; }
  const hadir = KT.sesi.ids, belum = KT.staf.filter((s) => KT.tokoh[s.id] && !hadir.has(s.id) && s.id !== _ktIdPeran("yayasan"));
  ln.innerHTML = `<div class="kt-opsi-judul">Lanjutkan rapat:</div>
    <div class="kt-cepat">${(typeof KT_RAPAT_KEPALA !== "undefined" ? KT_RAPAT_KEPALA : []).filter((p) => p[2] !== "__kabar").map(([ik, l], i) => `<button onclick="ktPerintahNo(${i + 1})">${ik} ${_ktE(l)}</button>`).join("")}</div>
    ${belum.length ? `<div class="kt-opsi-judul">Panggil ke rapat untuk minta data:</div><div class="kt-cepat">${belum.map((s) => `<button onclick="ktSesiPanggil('${s.id}')">${_ktFoto(s, 18)} ${_ktE(_ktGelar(s))} ${_ktE(s.nama.split(" ")[0])} · ${_ktE(_ktPeranPendek(s.peran[0]))}</button>`).join("")}</div>` : ""}
    <div class="kt-opsi-judul">Minta data dari yang hadir:</div><div class="kt-cepat">${[...hadir].map(_ktStafId).filter((s) => s && s.id !== _ktIdPeran("kepala") && s.id !== _ktIdPeran("yayasan")).map((s) => `<button onclick="ktSesiPanggil('${s.id}')">${_ktFoto(s, 18)} ${_ktE(s.nama.split(" ")[0])}</button>`).join("")}</div>
    <button class="kt-akhiri" onclick="ktAkhiriRapat()">🔚 Akhiri Rapat</button>`;
  const pn = document.getElementById("kt-panel"); if (pn) pn.scrollTop = pn.scrollHeight;
}
// panggil seseorang ke rapat yang sedang berjalan lalu minta laporan bagiannya
async function ktSesiPanggil(id) {
  if (KT.sibuk) return; const s = _ktStafId(id); if (!s) return;
  KT.sibuk = true;
  try {
    if (!document.getElementById("kt-jawaban")) _ktPanel(`<div class="kt-obrolan"><div id="kt-jawaban"></div><div id="kt-lanjut"></div></div>`);
    const kid = _ktIdPeran("kepala");
    if (!KT.sesi.ids.has(id)) {
      if (kid) await _ktBicara(kid, `${_ktGelar(s)} ${s.nama.split(" ")[0]}, mohon hadir ke Ruang Rapat.`, 2000);
      await ktSesiPastikan([s.peran[0]], KT.sesi.judul || "Rapat Koordinasi", KT.tv.data, KT.tv.ticker, KT.topikIni);
    }
    await _ktLaporPeran(s);
  } finally { KT.sibuk = false; _ktOpsiRapat(); }
}
async function _ktLaporPeran(s) {
  const k = s.peran[0], r = /^(peny|admin)-/.test(k) ? k.split("-")[1] : null;
  const topik = k === "bendahara" ? "bosp" : /^peny-/.test(k) ? "evaluasi" : /^admin-/.test(k) ? "lengkap" : k === "sekretaris" || k === "dapodik" ? "data" : null;
  await _ktTampilBaris({ kode: "kepala", html: `Silakan ${_ktE(_ktGelar(s))} ${_ktE(s.nama.split(" ")[0])}, sampaikan data bagian antum.`, singkat: "Silakan sampaikan datanya." });
  const skrip = topik ? await _ktSkrip(topik, (r ? KT_JENJANG[r] : "") + " " + topik) : null;
  let baris = skrip ? skrip.baris.filter((b) => b.kode !== "kepala") : [];
  if (r) baris = baris.filter((b) => !/^(peny|admin)-/.test(b.kode) || b.kode.endsWith("-" + r));
  baris = baris.slice(0, 3);
  if (!baris.length) { const j = await _ktJawab(k, k === "it" ? "laporan tiket" : "laporan"); baris.push({ kode: k, html: _ktE(j.teks).replace(/\n/g, "<br>"), singkat: j.singkat || j.teks }); }
  for (const b of baris) await _ktTampilBaris({ ...b, kode: k });
}
// Kepala memanggil: ustadz → dijemput ke Ruang Kepala; ustadzah → dipanggil dari depan pintu, bertemu di Ruang Rapat
ktPanggil = async function (id) {
  if (KT.sibuk) { toast("Kepala sedang sibuk, tunggu sebentar", "info"); return; }
  const kid = _ktIdPeran("kepala"), kp = KT.tokoh[kid], t = KT.tokoh[id], s = _ktStafId(id);
  if (!kp || !t || !s) return;
  if (KT.sesi.aktif) return ktSesiPanggil(id);
  KT.sibuk = true;
  try {
    _ktPanel(`<div class="kt-obrolan"><div class="kt-info">🚪 ${_ktE(_ktGelar(s))} ${_ktE(s.nama)} dipanggil</div><div id="kt-jawaban"></div><div id="kt-lanjut"></div></div>`);
    if (s.jk === "P") {
      await _ktPergi(kp, KT.titikPintuP || { x: 4.2, z: 6.3, hadap: Math.PI / 2 }, { berdiri: true });
      await _ktBicara(kid, `Ustadzah ${s.nama.split(" ")[0]}, mohon ke Ruang Rapat sebentar.`, 2300);
      await _ktBicara(id, "Na'am, insya Allah.", 1500);
      KT.sesi = { aktif: true, ids: new Set(), judul: "Laporan " + _ktPeranPendek(s.peran[0]) }; _ktTombolRapat();
      kdTvRapat(KT.sesi.judul, [], "");
      await _ktPergi(t, _ktKursiUntuk(id)); KT.sesi.ids.add(id); // ustadzah duduk lebih dulu
      await _ktPergi(kp, KT.kursiPimpinan); KT.sesi.ids.add(kid);
      kdMinuman([_ktKursiUntuk(id), KT.kursiPimpinan]);
      await _ktLaporPeran(s);
      KT.sibuk = false; _ktOpsiRapat(); return;
    }
    await _ktPergi(kp, _ktDekatKursi(t.userData.meja), { berdiri: true });
    await _ktBicara(kid, `Ustadz ${s.nama.split(" ")[0]}, ke ruangan ana sebentar ya.`, 2200);
    await _ktPergi(kp, KT.kursiKepala); await _ktPergi(t, KT.kursiTamu[0]);
    await _ktLaporPeran(s);
    await _ktTampilBaris({ kode: "kepala", html: "Jazakallahu khairan, lanjutkan. Laporkan bila ada kendala.", singkat: "Jazakallahu khairan, lanjutkan." });
    await _ktPergi(t, t.userData.meja);
  } finally { KT.sibuk = false; }
};

// ── foto profil ──
function _ktFoto(s, ukuran = 40) {
  const url = s && s.foto;
  return url ? `<img class="kt-foto" src="${_ktE(url)}" style="width:${ukuran}px;height:${ukuran}px" alt="" loading="lazy" onerror="this.replaceWith(Object.assign(document.createElement('span'),{className:'kt-foto kosong',textContent:'${s.jk === "P" ? "🧕" : "👳"}'}))">` : `<span class="kt-foto kosong" style="width:${ukuran}px;height:${ukuran}px;font-size:${Math.round(ukuran * 0.55)}px">${s && s.jk === "P" ? "🧕" : "👳"}</span>`;
}

// ── SIARAN LANGSUNG untuk yang diberi izin menyaksikan ──
function _ktSiar(cmd, data) {
  if (!KT.pemilik || KT.memutar || !KT.kanal) return;
  try { KT.kanal.send({ type: "broadcast", event: "k", payload: { cmd, data } }); } catch (e) {}
  if (cmd === "pergi") { (KT.tujuanAkhir = KT.tujuanAkhir || {})[data.id] = { ...data.tujuan, berdiri: data.berdiri, v: KT.tokoh[data.id] ? KT.tokoh[data.id].visible : true }; }
}
let _ktSimpanT = 0;
function _ktSimpanSiaran() {
  if (!KT.pemilik) return; clearTimeout(_ktSimpanT);
  _ktSimpanT = setTimeout(() => {
    _bspGabungUmum("bosp:kantor:siaran", { t: Date.now(), rapat: KT.sesi.aktif, judul: KT.sesi.judul || "", tujuan: KT.tujuanAkhir || {}, baris: (KT.barisSiar || []).slice(-15), tv: KT.tv.mode === "rapat" ? { judul: KT.tv.judul, data: KT.tv.data, ticker: KT.tv.ticker } : null }).catch(() => {});
  }, 1500);
}
function _ktKanalBuka() {
  try {
    if (typeof supaSemua === "undefined" || !supaSemua.channel) return;
    KT.kanal = supaSemua.channel("kantor-pkbm", { config: { broadcast: { self: false } } });
    KT.kanal.on("broadcast", { event: "k" }, ({ payload }) => { if (KT.penonton) _ktPutar(payload); }).subscribe();
  } catch (e) { console.warn("Siaran kantor:", e); }
}
function _ktPutar(p) {
  if (!p || !KT.buka) return; const d = p.data || {};
  KT.memutar = true;
  try {
    if (p.cmd === "pergi" && KT.tokoh[d.id]) _ktPergi(KT.tokoh[d.id], d.tujuan, { berdiri: d.berdiri });
    else if (p.cmd === "bicara") _ktBicara(d.id, d.teks, d.ms);
    else if (p.cmd === "tv") { if (d && d.judul !== undefined) kdTvRapat(d.judul, d.data, d.ticker); else kdTvDiam(); }
    else if (p.cmd === "minum") kdMinuman(d.kursi || [], d.tambah);
    else if (p.cmd === "minumHapus") kdMinumanHapus();
    else if (p.cmd === "yayasanDatang") kdYayasanDatang();
    else if (p.cmd === "yayasanPulang") kdYayasanPulang();
    else if (p.cmd === "baris") _ktBarisPenonton(d);
  } finally { KT.memutar = false; }
}
function _ktBarisPenonton(d) {
  let w = document.getElementById("kt-jawaban");
  if (!w) { _ktPanel(`<div class="kt-obrolan"><div class="kt-info">📺 Menyaksikan langsung</div><div id="kt-jawaban"></div></div>`); w = document.getElementById("kt-jawaban"); }
  const p = _ktPeran(d.kode) || { warna: "#475569", ikon: "💬", nama: "" }, id = _ktIdPeran(d.kode), s = id && _ktStafId(id);
  w.insertAdjacentHTML("beforeend", `<div class="kt-jawab" style="--w:${p.warna}"><small>${p.ikon} ${s ? _ktE(_ktGelar(s) + " " + s.nama) + " · " : ""}${_ktE(p.nama)}</small><div>${d.html || ""}</div></div>`);
  const pn = document.getElementById("kt-panel"); if (pn) pn.scrollTop = pn.scrollHeight;
}
// tambahkan siaran ke fungsi-fungsi yang sudah ada
(function () {
  const tb = _ktTampilBaris;
  _ktTampilBaris = async function (b) {
    if (KT.pemilik) { (KT.barisSiar = KT.barisSiar || []).push({ kode: b.kode, html: b.html }); _ktSiar("baris", { kode: b.kode, html: b.html }); _ktSimpanSiaran(); }
    return tb.apply(this, arguments);
  };
  const yd = kdYayasanDatang, yp = kdYayasanPulang;
  kdYayasanDatang = function () { _ktSiar("yayasanDatang", {}); return yd.apply(this, arguments); };
  kdYayasanPulang = function () { _ktSiar("yayasanPulang", {}); return yp.apply(this, arguments); };
})();
// penonton yang baru membuka: tempatkan petugas sesuai keadaan terakhir
async function _ktPulihkanSiaran() {
  try {
    const r = await supaSemua.from("kuliah_pengaturan").select("nilai").eq("kunci", "bosp:kantor:siaran").eq("ruang_id", "*").maybeSingle();
    const s = r.data && r.data.nilai; if (!s || Date.now() - (s.t || 0) > 3 * 3600e3) return;
    Object.entries(s.tujuan || {}).forEach(([id, tj]) => { const t = KT.tokoh[id]; if (!t || !tj) return; t.position.set(tj.x, 0, tj.z); if (tj.hadap != null) t.rotation.y = tj.hadap; _ktDuduk(t, !tj.berdiri); if (tj.v === false) t.visible = false; else if (id === _ktIdPeran("yayasan") && s.rapat) { t.visible = true; if (KT.label[id]) KT.label[id].hidden = false; t.userData.diLuar = false; } });
    if (s.rapat) { if (s.tv) kdTvRapat(s.tv.judul, s.tv.data, s.tv.ticker); _ktPanel(`<div class="kt-obrolan"><div class="kt-info">📺 Sedang rapat: ${_ktE(s.judul || "")}</div><div id="kt-jawaban"></div></div>`); (s.baris || []).forEach(_ktBarisPenonton); }
  } catch (e) {}
}

// ── KEHADIRAN: laptop menyala bila akun sedang masuk, berkedip bila sedang bekerja ──
const KT_HADIR = { kanal: null, dilacak: false };
function _ktHadirMulai() {
  if (KT_HADIR.kanal || typeof supaSemua === "undefined" || !supaSemua.channel || !STATE.guruId) return;
  try {
    KT_HADIR.kanal = supaSemua.channel("pkbm-hadir", { config: { presence: { key: STATE.guruId } } });
    KT_HADIR.kanal.subscribe((st) => { if (st === "SUBSCRIBED") { KT_HADIR.dilacak = true; _ktHadirLapor(); } });
  } catch (e) {}
}
function _ktHadirLapor() { if (KT_HADIR.dilacak) KT_HADIR.kanal.track({ id: STATE.guruId, hal: STATE.currentPage || "", ruang: STATE.ruang || "", t: Date.now() }).catch(() => {}); }
(function () {
  setInterval(() => { if (STATE && STATE.guruId) { if (!KT_HADIR.kanal) _ktHadirMulai(); } }, 8000);
  if (typeof showPage === "function") { const asli = showPage; showPage = function () { const h = asli.apply(this, arguments); setTimeout(_ktHadirLapor, 300); return h; }; }
})();
async function _ktSegarLayar() {
  if (!KT.buka) return;
  const state = KT_HADIR.kanal ? KT_HADIR.kanal.presenceState() : {}, online = {};
  Object.values(state).forEach((arr) => (arr || []).forEach((p) => { if (p && p.id) online[p.id] = Math.max(online[p.id] || 0, p.t || 0); }));
  let kerjaLog = new Set();
  try { const r = await supaSemua.from("log_aktivitas").select("guru_id").gte("waktu", new Date(Date.now() - 20 * 60000).toISOString()).not("aksi", "in", "(masuk-akun,pindah-ruang)"); kerjaLog = new Set((r.data || []).map((x) => x.guru_id)); } catch (e) {}
  KT.staf.forEach((s) => {
    const ada = online[s.id] != null, kerja = kerjaLog.has(s.id) || (ada && Date.now() - online[s.id] < 5 * 60000);
    kdLayar(s.id, kerja ? "kerja" : ada ? "nyala" : "mati");
    const lb = KT.label[s.id]; if (lb) lb.classList.toggle("aktif", ada);
  });
}

// ── LEMARI ARSIP: ketuk rak → berkas data aplikasi ──
const KT_BERKAS = [
  ["👤", "Data Guru", "data-guru"], ["🎓", "Data Siswa", "data-siswa"], ["🗓️", "Jadwal Pelajaran", "jadwal"], ["📅", "Kalender Akademik", "kaldik"],
  ["📓", "Jurnal & Absensi Tutor", "riwayat-absen"], ["📝", "Ujian & Bank Soal", "ujian"], ["🧾", "Kop Soal", "kop-soal"], ["✍️", "Input Nilai", "input-nilai"],
  ["🗂️", "Rapor", "rapor"], ["📖", "Modul Ajar", "modul-ajar"], ["💼", "Kas Bendahara", "kas"], ["💵", "Insentif", "insentif"],
  ["🕌", "Insentif Musyrif", "insentif-musyrif"], ["📒", "Kertas Kerja BOSP", "fn:bspBukaKK"], ["🗂️", "Draft RKAS", "fn:rkBuka"], ["🧑‍💼", "Perizinan", "kepsek"], ["📊", "Laporan Kinerja", "laporan-kinerja"],
];
const KT_BERKAS_PG = [["📒", "Rancangan BOSP (ARKAS)", "pg:pg-bosp"], ["🗂️", "Draft RKAS Jenjang", "pg:pg-rkas"], ["💳", "Pantau Realisasi Jenjang", "pg:pg-rkas-real"], ["👤", "Data Guru", "data-guru"], ["🎓", "Data Siswa", "data-siswa"]];
function ktArsip(sisi, ruang) {
  const rg = ruang || (sisi === "Pg" ? "Pg" : STATE.ruang && STATE.ruang !== "Pg" ? STATE.ruang : "Pa"), daftar = rg === "Pg" ? KT_BERKAS_PG : KT_BERKAS;
  _ktPanel(`<h3>🗄️ Lemari Arsip ${sisi === "Pg" ? "Ruang Kepala" : sisi === "P" ? "Ruang Ustadzah" : "Ruang Ustadz"}</h3>
    <p class="kt-ket">Berkas data aplikasi tiap jenjang. Ketuk berkas untuk melihat ringkasan & membukanya.</p>
    <div class="kt-tab">${["A", "Pa", "Pi", "Pg"].map((r) => `<button class="${r === rg ? "on" : ""}" onclick="ktArsip('${sisi}','${r}')">${r === "Pg" ? "Pengelola" : KT_PENDEK_RG[r]}</button>`).join("")}</div>
    <div class="kt-perintah">${daftar.map(([ik, nm, k], i) => `<button onclick="ktBerkas('${rg}',${i})"><span>${ik}</span>${_ktE(nm)}</button>`).join("")}</div><div id="kt-berkas"></div>`);
}
async function ktBerkas(rg, i) {
  const [ik, nm, k] = (rg === "Pg" ? KT_BERKAS_PG : KT_BERKAS)[i], w = document.getElementById("kt-berkas"); if (!w) return;
  w.innerHTML = `<div class="kt-info">⏳ Membuka berkas ${_ktE(nm)}…</div>`;
  let isi = [];
  try {
    if (rg !== "Pg") {
      const f = await _ktDataFitur(rg);
      isi = ({ "ujian": [`Bank soal ${f.ujian.bank}, sesi 30 hari ${f.ujian.sesi}, ${f.ujian.buka} dibuka`], "modul-ajar": [`${f.modul.n} modul, ${f.modul.tanpaModul} mapel di jadwal belum ada modul`], "kop-soal": [`${f.modul.kop} kop soal`], "jadwal": [`${f.jadwal.sesi} sesi/pekan · ${f.jadwal.guru} tutor · ${f.jadwal.kelas} kelas`], "kaldik": f.jadwal.agenda.length ? f.jadwal.agenda.map((a) => `${_ktE(a.judul)} — ${_ktFmtTgl(a.tanggal_mulai)}`) : ["Tidak ada agenda 30 hari ke depan"], "kas": [`Kas 30 hari: masuk ${_ktRp(f.kas.masuk)}, keluar ${_ktRp(f.kas.keluar)}`], "insentif-musyrif": [f.insentif ? `${KT_BLN[f.insentif.bulan] || f.insentif.bulan} ${f.insentif.tahun}: ${_ktRp(f.insentif.total)} (${f.insentif.n} orang)` : "Belum ada data"], "insentif": [f.slip ? `Slip gaji ${KT_BLN[f.slip.bulan] || f.slip.bulan} ${f.slip.tahun}: ${f.slip.n} slip, ${_ktRp(f.slip.total)}` : "Belum ada arsip slip gaji"] })[k] || [];
      if (!isi.length && /data-siswa|riwayat-absen|input-nilai|rapor|kepsek|laporan-kinerja/.test(k)) { const d = await _ktDataJenjang(rg); isi = [`${d.siswa} siswa aktif${d.tanpaKelas ? `, ${d.tanpaKelas} tanpa kelas` : ""}`, `30 hari: ${d.sesi} sesi mengajar, ${d.jurnal} jurnal, ${d.izin} izin tutor (${d.izinTunggu} menunggu), ${d.nilai} baris nilai diperbarui`]; }
    }
    if (/fn:|pg:/.test(k)) { const b = await _ktDataBosp(), j = b.jenjang[rg]; isi = j ? [`Kertas Kerja ${_ktRp(j.kk.total)} — ${KT_STATUS_KK[j.kk.status] || j.kk.status}`, `Draft RKAS ${_ktRp(j.rkas.total)} (${j.rkas.n} rincian)`, `Pagu ${_ktRp(j.pagu)}`] : [`Pagu PKBM ${_ktRp(KT_RG.reduce((a, r) => a + b.jenjang[r].pagu, 0))}`, ...KT_RG.map((r) => `${KT_JENJANG[r]}: KK ${_ktRp(b.jenjang[r].kk.total)}, RKAS ${_ktRp(b.jenjang[r].rkas.total)}`)]; }
    if (k === "data-guru") { const j = await _ktJawab("sekretaris", "cek data guru"); isi = j.teks.split("\n").slice(1, 6); }
  } catch (e) { isi = ["Ringkasan belum bisa dibaca: " + (e.message || e)]; }
  w.innerHTML = `<div class="kt-tugas" style="--w:#14532d"><b>${ik} ${_ktE(nm)} — ${rg === "Pg" ? "Pengelola" : KT_JENJANG[rg]}</b>${_ktLi(isi.map((x) => String(x)))}
    ${KT.penonton ? "" : `<button class="kt-salin" onclick="ktBukaHalaman('${rg}','${k}')">📂 Buka di Aplikasi</button>`}</div>`;
}
function ktBukaHalaman(rg, k) {
  const buka = () => {
    if (k.startsWith("fn:")) { const f = window[k.slice(3)]; if (typeof f === "function") f(); return; }
    if (k.startsWith("pg:")) { if (typeof rgBukaPengelola === "function") rgBukaPengelola(k.slice(3)); return; }
    if (typeof showPage === "function") showPage(k);
  };
  if (rg !== STATE.ruang) {
    try { sessionStorage.setItem("kt:buka", JSON.stringify({ k, t: Date.now() })); } catch (e) {}
    ktTutup(); if (typeof rgPindah === "function") rgPindah(rg); return;
  }
  ktTutup(); setTimeout(buka, 120);
}
// setelah pindah ruang: buka halaman yang diminta dari lemari arsip
setTimeout(() => { try { const s = JSON.parse(sessionStorage.getItem("kt:buka") || "null"); if (!s || Date.now() - s.t > 60000) return; sessionStorage.removeItem("kt:buka"); const k = s.k; setTimeout(() => { if (k.startsWith("fn:")) window[k.slice(3)]?.(); else if (k.startsWith("pg:")) rgBukaPengelola?.(k.slice(3)); else showPage?.(k); }, 2500); } catch (e) {} }, 500);

function _ktTombolRapat() { const b = document.getElementById("kt-rapat-tb"); if (b) { b.hidden = !KT.sesi.aktif || KT.penonton; b.textContent = "🪑 " + (KT.sesi.judul || "Rapat") + " · Pilihan"; } }
// buka lagi jalannya rapat + pilihan lanjutan / Akhiri Rapat
function ktPanelRapat() {
  if (!KT.sesi.aktif) return;
  _ktPanel(`<div class="kt-obrolan"><div class="kt-info">🪑 ${_ktE(KT.sesi.judul || "Rapat")} — sedang berlangsung</div><div id="kt-jawaban"></div><div id="kt-lanjut"></div></div>`);
  (KT.barisSiar || []).slice(-12).forEach(_ktBarisPenonton);
  _ktOpsiRapat();
}

// ── Masa sosialisasi SOP & absensi yang belum wajib ──
// • Jenjang yang absensi tutornya belum diwajibkan (Pengaturan Ruang) → absensi tidak dibahas/ditagih.
// • Selama masa sosialisasi (bawaan: aktif, atur di ⚙️), arahan Kepala ditulis sebagai catatan, bukan teguran.
const _ktAbsenWajib = (r) => (typeof absenWajib === "function" ? absenWajib(r) : true);
const _ktSosialisasi = () => (KT.atur || {}).sosialisasi !== false;
(function () {
  const kb = _ktKabarBaru;
  _ktKabarBaru = async function () {
    const k = await kb.apply(this, arguments);
    ["A", "Pa", "Pi"].forEach((r) => { if (!_ktAbsenWajib(r) && k[r]) k[r] = k[r].filter((x) => !/Absensi tutor/.test(x)); });
    KT.kabarCache = k; return k;
  };
  const sk = _ktSkrip;
  _ktSkrip = async function (topik, teks) {
    const h = await sk.apply(this, arguments); if (!h || !h.baris) return h;
    const off = ["A", "Pa", "Pi"].filter((r) => !_ktAbsenWajib(r)), nm = (r) => KT_JENJANG[r];
    h.baris.forEach((b) => {
      const r = (b.kode.match(/^(?:peny|admin)-(A|Pa|Pi)$/) || [])[1];
      if (r && off.includes(r)) b.html = b.html.replace(/<li>[^<]*sesi mengajar tercatat[\s\S]*?<\/li>/, "<li>Absensi tutor belum diwajibkan di jenjang ini (belum dihitung)</li>");
      if (b.kode === "kepala" && /Arahan ana/.test(b.html)) {
        b.html = b.html.replace(/<li>([^<]*)<\/li>/g, (m, isi) => (off.some((x) => isi.startsWith(nm(x)) && /absensi tutor|jurnal/i.test(isi)) ? "" : m));
        if (_ktSosialisasi()) { b.html = b.html.replace("Arahan ana:", "Catatan ana (masa sosialisasi SOP — belum ditagih):"); b.singkat = "Ana catat dulu, nanti kita sosialisasikan bersama."; }
        if (!/<li>/.test(b.html)) b.html = b.html.replace(/<ul class="kt-ul">\s*<\/ul>/, "<ul class=\"kt-ul\"><li>Alhamdulillah, tidak ada catatan.</li></ul>");
      }
      if (_ktSosialisasi()) b.html = b.html.replace(/[⚠️⏰🧾]️?\s?/gu, "").replace(/<b style="color:#dc2626">/g, "<b>");
    });
    if (_ktSosialisasi() && h.ticker) h.ticker = h.judul || "";
    return h;
  };
})();

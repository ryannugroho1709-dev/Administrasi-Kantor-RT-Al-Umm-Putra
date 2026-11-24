// ============================================================
//  KANTOR MAYA — ISTIRAHAT / COFFEE BREAK
//  Alur: petugas ANTRE di meja saji Pojok Kopi ruangannya → mengambil 1 cangkir kopi + 1 potong kue
//  (stok di meja saji benar-benar berkurang) → duduk, kopi & kue ada di meja kecilnya dan perlahan habis
//  sambil mengobrol soal pekerjaan → selesai: membawa bekasnya ke BAK SAMPAH → kembali ke meja kerja.
//  • Otomatis tiap 30 menit selama 5 menit (bila tidak ada rapat); Kepala PKBM bisa memerintahkan
//    "Istirahat 5 Menit" (tombol ☕ / menu Kepala / ketik "istirahat") dan ikut ngopi di Pojok Kopi Ruang Ustadz.
//  • Ustadz & ustadzah di Pojok Kopi ruang masing-masing (tidak bercampur). Bendahara ikut Pojok Kopi Ustadzah.
// ============================================================
const KI = { aktif: false, akhir: 0, t: 0, ngobrol: null, peserta: [], selesaiJalan: false };
const KI_MENIT_JEDA = 30, KI_MENIT_ISTIRAHAT = 5;
const KI_OBROLAN_UMUM = [
  "Alhamdulillah, kopinya pas, tidak terlalu manis.", "Kuenya enak, masya Allah.", "Bismillah, istirahat sebentar biar segar lagi.",
  "Habis ini ana lanjut merapikan berkas, insya Allah.", "Jangan lupa laporan harian sebelum jam 22.00 ya.", "Alhamdulillah pekerjaan hari ini lancar.",
];
const _kiAcak = (a) => a[Math.floor(Math.random() * a.length)];
function _kiObrolanUntuk(s) {
  const k = s.peran[0] || "", kb = KT.kabarCache || {}, r = (k.split("-")[1]) || "";
  const pil = [...KI_OBROLAN_UMUM];
  if (/^(peny|admin)-/.test(k) && typeof KT_JENJANG !== "undefined") { const n = (kb[r] || []).length; pil.push(n ? `Di ${KT_JENJANG[r]} ada ${n} kabar baru hari ini, nanti ana rangkum.` : `${KT_JENJANG[r]} alhamdulillah aman, jadwal berjalan.`, `Ana mau cek lagi jadwal ujian ${KT_JENJANG[r] || "jenjang"} setelah ini.`); }
  if (k === "bendahara") pil.push("Nota belanja bulan ini tinggal sedikit lagi yang belum lengkap.", "Realisasi BOSP insya Allah ana rekap sore ini.");
  if (k === "sekretaris") pil.push("Surat masuk hari ini sudah ana catat di agenda.", "Laporan pekanan jenjang ana rangkum hari Sabtu.");
  if (k === "dapodik") pil.push("Masih ada beberapa NISN yang perlu dicocokkan.");
  if (k === "it") pil.push("Tiket aplikasi hari ini sudah ana cek, aman.");
  if (k === "desain") pil.push("Flyer kegiatan pekan depan sedang ana kerjakan.");
  if (k === "kepala") pil.push("Bagaimana pekerjaan hari ini? Ada kendala yang perlu dibantu?", "Silakan dinikmati, habis ini kita lanjutkan.");
  return _kiAcak(pil);
}
function _kiDiRuang(t) { const m = t.userData.meja || {}; return m.x < -5 ? "L" : m.x > 5 ? "P" : null; }

// ── benda: cangkir + kue (dibawa / di meja) ──
function _kiBekal() {
  const g = new THREE.Group();
  const c = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.036, 0.08, 12), new THREE.MeshStandardMaterial({ color: 0xf5f1e8, roughness: 0.3 })); c.position.set(0, 0.04, 0); g.add(c);
  const kopi = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.006, 12), new THREE.MeshLambertMaterial({ color: 0x5b3a1e })); kopi.position.set(0, 0.078, 0); g.add(kopi);
  const piring = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.01, 16), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 })); piring.position.set(0.12, 0.005, 0); g.add(piring);
  const kue = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.05, 0.07), new THREE.MeshLambertMaterial({ color: _kiAcak([0xb45309, 0xf59e0b, 0x7c2d12, 0xdb2777]) })); kue.position.set(0.12, 0.035, 0); g.add(kue);
  g.userData = { kopi, kue }; return g;
}
function _kiStok(info, butuh) {
  const sisa = info.stok.cangkir.filter((c) => c.visible).length;
  if (sisa < butuh) { info.stok.cangkir.forEach((c) => (c.visible = true)); info.stok.kue.forEach((k) => (k.visible = true)); return true; } // diisi ulang
  return false;
}
function _kiAmbil(info, p) {
  const c = info.stok.cangkir.find((x) => x.visible), k = info.stok.kue.find((x) => x.visible);
  if (c) c.visible = false; if (k) k.visible = false;
  const b = _kiBekal(); b.position.set(0.22, 0.95, 0.18); b.scale.setScalar(0.8); p.t.add(b); p.bawa = b;
}
function _kiTaruh(p) {
  if (!p.bawa) return; p.t.remove(p.bawa);
  const k = p.kursi, m = k.meja || k, arah = k.sisiMeja || 1;
  p.bawa.scale.setScalar(1); p.bawa.position.set(m.x + arah * 0.18, 0.76, m.z); p.bawa.rotation.y = arah > 0 ? 0 : Math.PI;
  KT.scene.add(p.bawa); p.diMeja = p.bawa; p.bawa = null;
}
function _kiHabiskan(p, bagian) { // kopi & kue berkurang sedikit demi sedikit
  const g = p.diMeja; if (!g) return; const { kopi, kue } = g.userData;
  if (kopi) { kopi.position.y = Math.max(0.012, kopi.position.y - 0.012 * bagian); }
  if (kue) { const s = Math.max(0.05, kue.scale.x - 0.18 * bagian); kue.scale.set(s, s, s); if (s <= 0.06) kue.visible = false; }
}
function _kiAngkat(p) { if (!p.diMeja) return; KT.scene.remove(p.diMeja); const b = p.diMeja; b.position.set(0.22, 0.95, 0.18); b.scale.setScalar(0.8); b.rotation.y = 0; p.t.add(b); p.bawa = b; p.diMeja = null; }
async function _kiBuang(info, p) {
  if (!p.bawa) return;
  if (info && info.bak) { const tp = info.bak.children[1]; if (tp) { tp.rotation.z = 0.7; setTimeout(() => (tp.rotation.z = 0), 700); } }
  p.t.remove(p.bawa); p.bawa = null;
}

// ── alur istirahat ──
async function _kiSisi(sisi, orang) {
  const info = KT.pantryInfo && KT.pantryInfo[sisi];
  if (!info) { await Promise.all(orang.map((p) => _ktPergi(p.t, p.kursi))); return; }
  if (_kiStok(info, orang.length) && orang[0]) _ktBicara(orang[0].id, "Alhamdulillah, stok kopi & kue sudah diisi lagi.", 2200);
  const slot = (i) => info.antre[Math.min(i, info.antre.length - 1)];
  let barisan = orang.slice();
  barisan.forEach((p) => (p.t.userData.antre = true)); // sesama pengantre boleh saling menyelip (lorong antre sempit)
  await Promise.all(barisan.map((p, i) => _ktTunggu(i * 350).then(() => _ktPergi(p.t, slot(i), { berdiri: true }))));
  const duduk = [];
  while (barisan.length && KI.aktif) {
    const p = barisan.shift();
    await _ktTunggu(900);
    p.t.userData.antre = false; _kiAmbil(info, p); _ktBicara(p.id, _kiAcak(["Bismillah.", "Satu kopi dan satu kue ya.", "Jazakallahu khairan."]), 1500);
    duduk.push(_ktPergi(p.t, p.kursi).then(() => _kiTaruh(p)));
    await Promise.all(barisan.map((q, i) => _ktPergi(q.t, slot(i), { berdiri: true })));
  }
  await Promise.all(duduk);
}
async function kmIstirahat(sumber = "otomatis", menit = KI_MENIT_ISTIRAHAT) {
  if (!KT.buka || !KT.pantry) return;
  if (KI.aktif) { if (sumber === "kepala") toast("Sedang istirahat", "info"); return; }
  if (KT.sesi && KT.sesi.aktif) { if (sumber === "kepala") toast("Rapat masih berlangsung — akhiri rapat dulu", "warn"); return; }
  KI.aktif = true; KI.akhir = Date.now() + menit * 60000; KI.t = Date.now(); KI.peserta = [];
  const kid = (KT.peran.kepala || [])[0], yid = (KT.peran.yayasan || [])[0], kursi = { L: (KT.pantry.L || []).slice(), P: (KT.pantry.P || []).slice() };
  _kiTanda(true);
  if (sumber === "kepala" && kid) await _ktBicara(kid, `Bismillah, istirahat dulu ${menit} menit ya. Silakan ambil kopi & kue di Pojok Kopi.`, 2600);
  const urut = Object.values(KT.tokoh).map((t) => t).filter((t) => t.userData.staf && t.visible && !t.userData.jalur)
    .sort((a, b) => Math.hypot(a.position.x, a.position.z) - Math.hypot(b.position.x, b.position.z));
  urut.forEach((t) => {
    const s = t.userData.staf; if (s.id === yid) return;
    let sisi = _kiDiRuang(t); if (s.id === kid) { if (sumber !== "kepala") return; sisi = "L"; }
    if (!sisi) { if (s.jk === "P") sisi = "P"; else return; }
    const k = kursi[sisi].shift(); if (!k) return;
    KI.peserta.push({ id: s.id, t, sisi, kursi: k, asal: s.id === kid ? KT.kursiKepala : t.userData.meja });
  });
  toast(`☕ Coffee break ${menit} menit${sumber === "otomatis" ? " (otomatis tiap " + KI_MENIT_JEDA + " menit)" : ""}`, "ok");
  // urutan antre: yang paling dekat meja saji lebih dulu
  await Promise.all(["L", "P"].map((sisi) => { const info = KT.pantryInfo && KT.pantryInfo[sisi], o = KI.peserta.filter((p) => p.sisi === sisi); if (info) { const a = info.antre[0]; o.sort((p, q) => Math.hypot(p.t.position.x - a.x, p.t.position.z - a.z) - Math.hypot(q.t.position.x - a.x, q.t.position.z - a.z)); } return _kiSisi(sisi, o); }));
  if (!KI.aktif) return;
  clearInterval(KI.ngobrol); KI.ngobrol = setInterval(_kiNgobrol, 6500); _kiNgobrol();
}
function _kiNgobrol() {
  if (!KI.aktif) return;
  if (Date.now() >= KI.akhir) return kmIstirahatSelesai();
  const sisaBagian = Math.max(1, Math.round((KI.akhir - Date.now()) / 6500));
  KI.peserta.forEach((p) => _kiHabiskan(p, 1 / sisaBagian * 4));
  ["L", "P"].forEach((sisi) => {
    const ada = KI.peserta.filter((p) => p.sisi === sisi && p.diMeja && KT.tokoh[p.id] && !KT.tokoh[p.id].userData.jalur); if (!ada.length) return;
    const p = _kiAcak(ada), s = KT.staf.find((x) => x.id === p.id); if (s) _ktBicara(p.id, _kiObrolanUntuk(s), 3800);
  });
}
async function kmIstirahatSelesai() {
  if (!KI.aktif) return; KI.aktif = false; clearInterval(KI.ngobrol); KI.ngobrol = null; KI.t = Date.now(); _kiTanda(false);
  const kid = (KT.peran.kepala || [])[0];
  const diRapat = (p) => KT.sesi && KT.sesi.aktif && KT.sesi.ids && KT.sesi.ids.has(p.id);
  // yang dipanggil rapat: bekasnya dibereskan petugas kebersihan
  KI.peserta.filter(diRapat).forEach((p) => { if (p.diMeja) KT.scene.remove(p.diMeja); if (p.bawa) p.t.remove(p.bawa); p.diMeja = p.bawa = null; });
  const balik = KI.peserta.filter((p) => !diRapat(p));
  if (balik.some((p) => p.id === kid)) await _ktBicara(kid, "Alhamdulillah, mari kembali bekerja. Jazakumullahu khairan.", 2000);
  await Promise.all(["L", "P"].map(async (sisi) => {
    const info = KT.pantryInfo && KT.pantryInfo[sisi], o = balik.filter((p) => p.sisi === sisi);
    for (const [i, p] of o.entries()) {
      _kiAngkat(p);
      (async () => {
        await _ktTunggu(i * 900);
        if (info) { await _ktPergi(p.t, info.sampah, { berdiri: true }); await _ktTunggu(500); await _kiBuang(info, p); }
        else if (p.bawa) { p.t.remove(p.bawa); p.bawa = null; }
        await _ktPergi(p.t, p.asal);
      })();
    }
  }));
  setTimeout(() => (KI.peserta = []), 30000);
}
function _kiTanda(on) {
  const b = document.getElementById("ki-tombol"); if (b) { b.classList.toggle("on", on); b.innerHTML = on ? "☕ Istirahat… <small>Kembali Bekerja</small>" : "☕<span class=\"kt-sembunyi-hp\"> Istirahat</span>"; }
}
function kmTombolIstirahat() { if (KI.aktif) kmIstirahatSelesai(); else kmIstirahat("kepala"); }
(function () {
  if (typeof KT_RAPAT_KEPALA !== "undefined" && !KT_RAPAT_KEPALA.some((x) => x[2] === "__istirahat")) KT_RAPAT_KEPALA.splice(1, 0, ["☕", "Istirahat 5 Menit (Coffee Break)", "__istirahat"]);
  if (typeof ktPerintah === "function") { const a = ktPerintah; ktPerintah = function (teks) { if (teks === "__istirahat") return kmIstirahat("kepala"); return a.apply(this, arguments); }; }
  if (typeof ktKirim === "function") { const a = ktKirim; ktKirim = function (teksLangsung) { const ta = document.getElementById("kt-teks"), teks = String(teksLangsung || (ta && ta.value) || "").trim(); if (/^(istirahat|coffee ?break|ngopi)\b/i.test(teks)) { if (ta && !teksLangsung) ta.value = ""; return kmIstirahat("kepala"); } return a.apply(this, arguments); }; }
  if (typeof _ktBangun === "function") {
    const a = _ktBangun;
    _ktBangun = async function () {
      await a.apply(this, arguments);
      KI.aktif = false; KI.peserta = []; KI.t = Date.now();
      const atas = document.querySelector("#kantor-ai .kt-alat");
      if (atas && KT.pemilik && !document.getElementById("ki-tombol")) atas.insertAdjacentHTML("afterbegin", `<button id="ki-tombol" onclick="kmTombolIstirahat()" title="Istirahat 5 menit / kembali bekerja">☕<span class="kt-sembunyi-hp"> Istirahat</span></button>`);
      clearInterval(KI.jadwal);
      KI.jadwal = setInterval(() => {
        if (!KT.buka) { clearInterval(KI.jadwal); return; }
        if (KI.aktif) { if (Date.now() >= KI.akhir) kmIstirahatSelesai(); return; }
        if (!KT.pemilik || document.hidden || KT.sibuk || (KT.sesi && KT.sesi.aktif)) return;
        if (Date.now() - KI.t >= KI_MENIT_JEDA * 60000) kmIstirahat("otomatis");
      }, 20000);
    };
  }
  if (typeof ktTutup === "function") { const a = ktTutup; ktTutup = function () { clearInterval(KI.jadwal); clearInterval(KI.ngobrol); KI.aktif = false; KI.peserta = []; return a.apply(this, arguments); }; }
})();

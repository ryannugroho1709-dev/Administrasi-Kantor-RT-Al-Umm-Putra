// ============================================================
//  KANTOR MAYA — ISTIRAHAT / COFFEE BREAK
//  • Otomatis tiap 30 menit (bila tidak ada rapat): petugas tiap ruang berjalan ke Pojok Kopi ruangannya,
//    duduk, mengobrol soal pekerjaan, lalu 5 menit kemudian kembali ke meja.
//  • Kepala PKBM bisa memerintahkan "Istirahat 5 Menit" (menu Kepala / ketik "istirahat"); Kepala ikut ngopi
//    di Pojok Kopi Ruang Ustadz. Ustadz & ustadzah tetap di ruang masing-masing (tidak bercampur).
//  • Saat istirahat, ketuk siapa saja untuk mengajak mengobrol (kartu petugas seperti biasa).
// ============================================================
const KI = { aktif: false, akhir: 0, t: 0, ngobrol: null, peserta: [] };
const KI_MENIT_JEDA = 30, KI_MENIT_ISTIRAHAT = 5;
const KI_OBROLAN_UMUM = [
  "Alhamdulillah, kopinya pas, tidak terlalu manis.", "Bismillah, istirahat sebentar biar segar lagi.", "Kuenya enak, siapa yang bawa ini?",
  "Habis ini ana lanjut merapikan berkas, insya Allah.", "Jangan lupa laporan harian sebelum jam 22.00 ya.", "Alhamdulillah pekerjaan hari ini lancar.",
];
function _kiObrolanUntuk(s) {
  const k = s.peran[0] || "", kb = KT.kabarCache || {}, r = (k.split("-")[1]) || "";
  const pil = [...KI_OBROLAN_UMUM];
  if (/^(peny|admin)-/.test(k) && typeof KT_JENJANG !== "undefined") { const n = (kb[r] || []).length; pil.push(n ? `Di ${KT_JENJANG[r]} ada ${n} kabar baru hari ini, nanti ana rangkum.` : `${KT_JENJANG[r]} alhamdulillah aman, jadwal berjalan.`); pil.push(`Ana mau cek lagi jadwal ujian ${KT_JENJANG[r] || "jenjang"} setelah ini.`); }
  if (k === "bendahara") pil.push("Nota belanja bulan ini tinggal sedikit lagi yang belum lengkap.", "Realisasi BOSP insya Allah ana rekap sore ini.");
  if (k === "sekretaris") pil.push("Surat masuk hari ini sudah ana catat di agenda.", "Laporan pekanan jenjang ana rangkum hari Sabtu.");
  if (k === "dapodik") pil.push("Masih ada beberapa NISN yang perlu dicocokkan.");
  if (k === "it") pil.push("Tiket aplikasi hari ini sudah ana cek, aman.");
  if (k === "desain") pil.push("Flyer kegiatan pekan depan sedang ana kerjakan.");
  if (k === "kepala") pil.push("Bagaimana pekerjaan hari ini? Ada kendala yang perlu dibantu?", "Silakan diminum dulu, habis ini kita lanjutkan.");
  return pil[Math.floor(Math.random() * pil.length)];
}
function _kiDiRuang(t) { const m = t.userData.meja || {}; return m.x < -5 ? "L" : m.x > 5 ? "P" : null; }
async function kmIstirahat(sumber = "otomatis", menit = KI_MENIT_ISTIRAHAT) {
  if (!KT.buka || !KT.pantry) return;
  if (KI.aktif) { if (sumber === "kepala") toast("Sedang istirahat", "info"); return; }
  if (KT.sesi && KT.sesi.aktif) { if (sumber === "kepala") toast("Rapat masih berlangsung — akhiri rapat dulu", "warn"); return; }
  KI.aktif = true; KI.akhir = Date.now() + menit * 60000; KI.t = Date.now(); KI.peserta = [];
  const kid = (KT.peran.kepala || [])[0], yid = (KT.peran.yayasan || [])[0], kursi = { L: (KT.pantry.L || []).slice(), P: (KT.pantry.P || []).slice() };
  if (sumber === "kepala" && kid) await _ktBicara(kid, `Bismillah, istirahat dulu ${menit} menit ya. Silakan ngopi di Pojok Kopi.`, 2600);
  const jalan = [];
  Object.values(KT.tokoh).forEach((t) => {
    const s = t.userData.staf; if (!s || !t.visible || s.id === yid || t.userData.jalur) return;
    let sisi = _kiDiRuang(t); if (s.id === kid) { if (sumber !== "kepala") return; sisi = "L"; }
    if (!sisi) { if (s.jk === "P" && kursi.P.length) sisi = "P"; else return; } // bendahara (akhwat) ikut Pojok Kopi Ruang Ustadzah
    const k = kursi[sisi].shift(); if (!k) return;
    KI.peserta.push({ id: s.id, t, sisi, kursi: k, asal: t.userData.meja });
    jalan.push(_ktTunggu(Math.random() * 1200).then(() => _ktPergi(t, k)));
  });
  _kiTanda(true);
  toast(`☕ Coffee break ${menit} menit${sumber === "otomatis" ? " (otomatis tiap " + KI_MENIT_JEDA + " menit)" : ""}`, "ok");
  await Promise.all(jalan);
  KI.ngobrol = setInterval(_kiNgobrol, 6500); _kiNgobrol();
}
function _kiNgobrol() {
  if (!KI.aktif) return;
  if (Date.now() >= KI.akhir) return kmIstirahatSelesai();
  ["L", "P"].forEach((sisi) => {
    const ada = KI.peserta.filter((p) => p.sisi === sisi && KT.tokoh[p.id] && !KT.tokoh[p.id].userData.jalur); if (ada.length < 1) return;
    const p = ada[Math.floor(Math.random() * ada.length)], s = KT.staf.find((x) => x.id === p.id); if (!s) return;
    _ktBicara(p.id, _kiObrolanUntuk(s), 3800);
  });
}
async function kmIstirahatSelesai() {
  if (!KI.aktif) return; KI.aktif = false; clearInterval(KI.ngobrol); KI.ngobrol = null; KI.t = Date.now(); _kiTanda(false);
  const kid = (KT.peran.kepala || [])[0];
  const balik = KI.peserta.filter((p) => !(KT.sesi && KT.sesi.aktif && KT.sesi.ids && KT.sesi.ids.has(p.id)));
  const kp = balik.find((p) => p.id === kid); if (kp) await _ktBicara(kid, "Alhamdulillah, mari kembali bekerja. Jazakumullahu khairan.", 2000);
  await Promise.all(balik.map((p) => _ktTunggu(Math.random() * 1500).then(() => _ktPergi(p.t, p.id === kid ? KT.kursiKepala : p.asal))));
  KI.peserta = [];
}
function _kiTanda(on) {
  const b = document.getElementById("ki-tombol"); if (b) { b.classList.toggle("on", on); b.innerHTML = on ? "☕ Istirahat… <small>Kembali Bekerja</small>" : "☕<span class=\"kt-sembunyi-hp\"> Istirahat</span>"; }
}
function kmTombolIstirahat() { if (KI.aktif) kmIstirahatSelesai(); else kmIstirahat("kepala"); }
(function () {
  // menu perintah Kepala PKBM + ketik "istirahat"
  if (typeof KT_RAPAT_KEPALA !== "undefined" && !KT_RAPAT_KEPALA.some((x) => x[2] === "__istirahat")) KT_RAPAT_KEPALA.splice(1, 0, ["☕", "Istirahat 5 Menit (Coffee Break)", "__istirahat"]);
  if (typeof ktPerintah === "function") { const a = ktPerintah; ktPerintah = function (teks) { if (teks === "__istirahat") return kmIstirahat("kepala"); return a.apply(this, arguments); }; }
  if (typeof ktKirim === "function") { const a = ktKirim; ktKirim = function (teksLangsung) { const ta = document.getElementById("kt-teks"), teks = String(teksLangsung || (ta && ta.value) || "").trim(); if (/^(istirahat|coffee ?break|ngopi)\b/i.test(teks)) { if (ta && !teksLangsung) ta.value = ""; return kmIstirahat("kepala"); } return a.apply(this, arguments); }; }
  // tombol di bilah atas + jadwal otomatis
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

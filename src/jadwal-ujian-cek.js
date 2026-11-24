// ============================================================
//  CEK SOAL & JADWAL sebelum dibagikan (Jadwal Ujian → ✏️ Susun)
//  • Tiap sel diberi tanda: ✅ soal terkumpul (Online/Berkas/Fisik) atau ⏳ soal belum terkumpul.
//  • Panel "Cek Sebelum Dibagikan": soal terkumpul tapi BELUM masuk jadwal (bisa langsung dimasukkan ke sesi
//    kosong), mapel terjadwal yang soalnya belum terkumpul, sel tanpa pengawas, mapel bertanda tidak diujikan.
//  • Saat menekan PDF / bagikan WA, muncul peringatan bila masih ada yang perlu dicek.
// ============================================================
const JUC = { data: {}, muat: {} };
async function _jucMuat(j, paksa) {
  if (!j) return null; const c = JUC.data[j.id];
  if (c && !paksa && Date.now() - c.t < 120000) return c.d;
  if (JUC.muat[j.id]) return JUC.muat[j.id];
  JUC.muat[j.id] = (async () => {
    try { if (typeof UA !== "undefined" && !UA.bank && typeof _uaMuatBank === "function") await _uaMuatBank(); } catch (e) {}
    const d = (await _kvAmbil("ujian:soal:" + j.id, {}).catch(() => ({}))) || {};
    JUC.data[j.id] = { d, t: Date.now() }; JUC.muat[j.id] = null; return d;
  })();
  return JUC.muat[j.id];
}
function _jucStatus(j, kode, kelasId) {
  const c = JUC.data[j.id]; if (!c || typeof _uaStatus !== "function" || typeof UA === "undefined") return null;
  const simpan = UA.data; UA.data = c.d; try { return _uaStatus(j, { mapelId: kode, kelasId }); } finally { UA.data = simpan; }
}
function jucPeriksa(j) {
  if (!j || j.jenis === "tahfizh" || !JUC.data[j.id]) return null;
  const terjadwal = new Map(), belum = [], tanpaPengawas = [], tidakDiuji = [];
  Object.entries(j.slot || {}).forEach(([k, s]) => {
    const [t, , kelasId] = k.split("|"); if (!j.hari.includes(t) || !j.kelas.includes(kelasId) || !_juLabelSlot(s)) return;
    if (!(s.p || []).length) tanpaPengawas.push(k);
    if (!s.m) return; const kode = _juKode(s); terjadwal.set(kode + "|" + kelasId, k);
    if (typeof _juDiujikan === "function" && !_juDiujikan(j, s.m)) tidakDiuji.push(k);
    const st = _jucStatus(j, kode, kelasId); if (st && !st.length) belum.push(k);
  });
  // soal sudah terkumpul (online / berkas / fisik) tapi mapel-kelasnya belum ada di jadwal
  const kandidat = new Map(), c = JUC.data[j.id].d || {};
  (JU.ajar || []).forEach((a) => { if (!j.kelas.includes(a.kelas_id)) return; (_juSubs(a.mapel_id).length ? _juSubs(a.mapel_id).map((s) => a.mapel_id + "::" + s) : [a.mapel_id]).forEach((kode) => kandidat.set(kode + "|" + a.kelas_id, { kode, kelasId: a.kelas_id })); });
  Object.keys(c).forEach((k) => { if (k.startsWith("_")) return; const [kode, kelasId] = k.split("|"); if (kode && kelasId && j.kelas.includes(kelasId)) kandidat.set(k, { kode, kelasId }); });
  const tanpaJadwal = [];
  kandidat.forEach((x, k) => {
    if (terjadwal.has(k)) return;
    // mapel gabungan utuh yang sudah dipecah (atau sebaliknya) dianggap sudah terjadwal
    const [m] = x.kode.split("::"); if ([...terjadwal.keys()].some((tk) => { const [tkode, tkel] = tk.split("|"); return tkel === x.kelasId && (tkode.split("::")[0] === m) && (!x.kode.includes("::") || !tkode.includes("::")); })) return;
    if (typeof _juDiujikan === "function" && !_juDiujikan(j, x.kode)) return;
    const st = _jucStatus(j, x.kode, x.kelasId); if (st && st.length) tanpaJadwal.push({ ...x, st });
  });
  return { belum, tanpaJadwal, tanpaPengawas, tidakDiuji, total: belum.length + tanpaJadwal.length + tanpaPengawas.length + tidakDiuji.length };
}
const _jucPosisi = (j, k) => { const [t, sid, kelasId] = k.split("|"); return `${_juHariPendek(t)} · S${j.sesi.findIndex((s) => s.id === sid) + 1} · Kls ${_juAngkaKelas(kelasId)}`; };
function _jucHtmlPanel(j) {
  const h = jucPeriksa(j), e = _juEsc;
  if (!h) return `<div class="card juc-panel"><div class="juc-h">🔎 Cek Sebelum Dibagikan</div><div class="ju-ket">Memeriksa pengumpulan soal…</div></div>`;
  const pill = (k) => `<button class="juc-pill" onclick="jucLompat('${k}')">${e(_juLabelSlot(j.slot[k]))} <small>${e(_jucPosisi(j, k))}</small></button>`;
  const blok = (ikon, judul, isi, warna, buka) => `<details class="juc-blok" style="--c:${warna}" ${buka ? "open" : ""}><summary>${ikon} ${judul}</summary><div class="juc-isi">${isi}</div></details>`;
  const ok = !h.total, atur = _juBolehAtur();
  return `<div class="card juc-panel ${ok ? "ok" : ""}"><div class="juc-h">🔎 Cek Sebelum Dibagikan <span>${ok ? "✅ Siap dibagikan" : `${h.total} hal perlu dicek`}</span><button class="btn btn-ghost btn-sm" onclick="jucSegarkan()">↻ Periksa Ulang</button></div>
    ${h.tanpaJadwal.length ? blok("📥", `<b>${h.tanpaJadwal.length}</b> soal sudah terkumpul tapi <b>belum masuk jadwal</b>`, h.tanpaJadwal.map((x) => `<div class="juc-baris"><span><b>${e(_juNamaMapelKode(x.kode))}</b> · Kelas ${e(_juAngkaKelas(x.kelasId))} <small>${x.st.map((s) => s.label).join(" ")}</small></span>${atur ? `<button class="btn btn-accent btn-sm" onclick="jucMasukkan('${x.kode}','${x.kelasId}')">➕ Masukkan ke Sesi Kosong</button>` : ""}</div>`).join(""), "#7c3aed", true) : ""}
    ${h.belum.length ? blok("⏳", `<b>${h.belum.length}</b> mapel terjadwal, <b>soalnya belum terkumpul</b>`, h.belum.map(pill).join(""), "#d97706", h.belum.length <= 12) : ""}
    ${h.tanpaPengawas.length ? blok("👤", `<b>${h.tanpaPengawas.length}</b> sel belum ada pengawas`, h.tanpaPengawas.map(pill).join(""), "#dc2626", false) : ""}
    ${h.tidakDiuji.length ? blok("🚫", `<b>${h.tidakDiuji.length}</b> mapel bertanda <b>Tidak Diujikan</b> masih ada di jadwal`, h.tidakDiuji.map(pill).join(""), "#64748b", false) : ""}
    ${ok ? `<div class="ju-ket">Semua mapel terjadwal sudah ada soalnya, semua sel ada pengawasnya, dan tidak ada soal yang tertinggal di luar jadwal.</div>` : ""}</div>`;
}
function jucLompat(k) { const [t] = k.split("|"); JU.hari = t; _juGambarEditor(); setTimeout(() => { if (typeof _juKilat === "function") _juKilat([k]); }, 50); }
async function jucSegarkan() { const j = JU.edit; if (!j) return; await _jucMuat(j, true); _juGambarEditor(); toast("Pengumpulan soal diperiksa ulang", "ok"); }
function jucMasukkan(kode, kelasId) {
  const j = JU.edit; if (!j) return; const [m, sub] = kode.split("::");
  for (const t of j.hari) for (const s of j.sesi) {
    const k = _juKunci(t, s.id, kelasId);
    if (!_juLabelSlot(j.slot[k])) {
      j.slot[k] = { m, ...(sub ? { sub } : {}), teks: "", p: [] }; JU.hari = t; _juTandai(); _juGambarEditor(); setTimeout(() => typeof _juKilat === "function" && _juKilat([k]), 50);
      toast(`➕ ${_juNamaMapelKode(kode)} Kelas ${_juAngkaKelas(kelasId)} dimasukkan ke ${_juHariPendek(t)} · Sesi ${j.sesi.indexOf(s) + 1}. Atur pengawasnya lalu 💾 Simpan.`, "ok"); return;
    }
  }
  toast("Tidak ada sesi kosong untuk kelas ini — tambah hari/sesi di ⚙️ Pengaturan", "warn");
}
// tanda di setiap sel + panel cek
(function () {
  if (typeof _juGambarEditor !== "function") return;
  const a = _juGambarEditor;
  _juGambarEditor = function () {
    const r = a.apply(this, arguments);
    try {
      const j = JU.edit, w = qs("ju-wadah"); if (!j || !w || j.jenis === "tahfizh") return r;
      if (!JUC.data[j.id]) _jucMuat(j).then(() => { if (JU.edit === j && qs("ju-wadah")?.querySelector(".ju-tab")) _juGambarEditor(); });
      const tab = w.querySelector(".ju-tab-hari"); if (tab && !w.querySelector(".juc-panel")) tab.insertAdjacentHTML("beforebegin", _jucHtmlPanel(j));
      if (!JUC.data[j.id]) return r;
      w.querySelectorAll("[data-kunci]").forEach((el) => {
        const x = j.slot[el.dataset.kunci]; if (!x || !x.m || el.querySelector(".juc-tanda")) return;
        const st = _jucStatus(j, _juKode(x), el.dataset.kunci.split("|")[2]); if (!st) return;
        el.insertAdjacentHTML("afterbegin", st.length ? `<div class="juc-tanda ok" title="Soal sudah terkumpul">✅ Soal: ${st.map((s) => s.label.replace(/^\S+\s/, "")).join(" + ")}</div>` : `<div class="juc-tanda belum" title="Soal belum dikumpulkan guru">⏳ Soal Belum Terkumpul</div>`);
      });
    } catch (e) { console.warn("Cek soal:", e); }
    return r;
  };
})();
// peringatan sebelum PDF / bagikan WA
async function _jucSebelumBagikan(id) {
  const j = (JU.edit && JU.edit.id === id ? JU.edit : JU.daftar.find((x) => x.id === id)); if (!j || j.jenis === "tahfizh") return true;
  await _jucMuat(j); const h = jucPeriksa(j); if (!h || !h.total) return true;
  const baris = [h.tanpaJadwal.length ? `📥 <b>${h.tanpaJadwal.length}</b> soal sudah terkumpul tapi belum masuk jadwal` : "", h.belum.length ? `⏳ <b>${h.belum.length}</b> mapel terjadwal, soalnya belum terkumpul` : "", h.tanpaPengawas.length ? `👤 <b>${h.tanpaPengawas.length}</b> sel belum ada pengawas` : "", h.tidakDiuji.length ? `🚫 <b>${h.tidakDiuji.length}</b> mapel bertanda Tidak Diujikan masih terjadwal` : ""].filter(Boolean);
  return konfirmasiTema(`Sebelum dibagikan, masih ada yang perlu dicek:<br>${baris.join("<br>")}<br><br>Rinciannya ada di panel <b>Cek Sebelum Dibagikan</b> (✏️ Susun).`, { ikon: "🔎", judul: "Cek Dulu Sebelum Dibagikan", teksYa: "Tetap Lanjutkan", teksTidak: "Periksa Dulu" });
}
(function () {
  ["juBagikanWa", "juCetakPdf"].forEach((nama) => {
    if (typeof window[nama] !== "function") return;
    const a = window[nama];
    window[nama] = async function (id) {
      const lanjut = await _jucSebelumBagikan(id || (JU.edit && JU.edit.id));
      if (!lanjut) { if (!JU.edit) { const j = JU.daftar.find((x) => x.id === id); if (j && _juBolehAtur()) juBukaEditor(j.id); } return; }
      return a.apply(this, arguments);
    };
  });
})();

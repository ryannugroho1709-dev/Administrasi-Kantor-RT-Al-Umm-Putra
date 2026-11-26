// ============================================================
//  KANTOR MAYA — LAPORAN RINCI
//  • Kabar Baru: perubahan Kertas Kerja BOSP, Draft RKAS, pagu, honor pengelola & iuran per jenjang dilaporkan
//    RINCI — apa yang ditambah/diubah/dihapus, dari berapa menjadi berapa, oleh siapa.
//    Caranya: keadaan data disimpan (di perangkat ini) tiap kali Kabar Baru dibuka, lalu dibandingkan
//    dengan keadaan sekarang. Pertama kali (belum ada simpanan) → yang berubah sejak waktu itu dibaca dari cap waktunya.
//  • Rapat BOSP: tiap jenjang melaporkan rincian Kertas Kerja & Draft RKAS (uraian, volume × harga = jumlah).
// ============================================================
const _ktrE = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const _ktrRp = (n) => "Rp " + Math.round(Number(n) || 0).toLocaleString("id-ID");
const _ktrAngka = (n) => (Math.round((Number(n) || 0) * 100) / 100).toLocaleString("id-ID");
const _ktrNmRg = { A: "Paket A", Pa: "Putra", Pi: "Putri" };
const _ktrKunciSnap = (th) => "kt:snap:" + (STATE.guruId || "") + ":" + th;

async function _ktrAmbil(th) {
  const ambil = (kunci, ruang) => supaSemua.from("kuliah_pengaturan").select("nilai").eq("kunci", kunci).eq("ruang_id", ruang).maybeSingle().then((r) => (r.data && r.data.nilai) || {}, () => ({}));
  const [umum, ...per] = await Promise.all([ambil("bosp:th:" + th, "*"), ...KT_RG.flatMap((r) => [ambil("bosp:kk:" + th, r), ambil("bosp:rkas:" + th, r)])]);
  const kk = {}, rk = {};
  KT_RG.forEach((r, i) => {
    const k = per[i * 2], d = per[i * 2 + 1];
    kk[r] = Object.entries(k.baris || {}).map(([id, b]) => {
      if (!b) return null; const bl = Object.values(b.bulan || {});
      return { id, hapus: !!(b.dihapus || b.hapus), nama: b.uraian || b.kegiatan || "(tanpa uraian)", keg: b.kegiatan || "", kode: b.kode || "", vol: bl.reduce((a, x) => a + (Number(x.jml) || 0), 0), sat: (bl[0] || {}).sat || "", harga: Number(b.harga) || 0, total: typeof bspTotalBaris === "function" ? bspTotalBaris(b) : 0, oleh: b.oleh || "", t: b.t || 0 };
    }).filter(Boolean);
    const kel = d.kel || {};
    rk[r] = Object.entries(d.item || {}).map(([id, x]) => {
      if (!x) return null;
      return { id, hapus: !!x.dihapus, nama: x.uraian || "(tanpa uraian)", kel: (kel[x.kel] || {}).nama || "", vol: Number(x.vol) || 0, sat: x.sat || "", harga: Number(x.harga) || 0, kali: typeof rkKali === "function" ? rkKali(x) : 1, total: typeof rkJumlah === "function" ? rkJumlah(x) : 0, oleh: x.oleh || "", t: x.t || 0, coret: !!x.coret };
    }).filter(Boolean);
  });
  return { umum, kk, rk };
}
function _ktrIuran(u) {
  const o = { A: 0, Pa: 0, Pi: 0 };
  if (typeof bspBagiDari === "function") for (let m = 1; m <= 12; m++) { const b = bspBagiDari(u, m); KT_RG.forEach((r) => (o[r] += b[r] || 0)); }
  return o;
}
// keadaan ringkas untuk dibandingkan
function _ktrSnap(d) {
  const s = { t: Date.now(), kk: {}, rk: {}, pagu: {}, peng: {}, iur: _ktrIuran(d.umum), cara: typeof bspCaraBagi === "function" ? bspCaraBagi(d.umum) : "" };
  KT_RG.forEach((r) => {
    s.pagu[r] = Number(((d.umum || {}).pagu || {})[r]) || 0;
    s.kk[r] = {}; d.kk[r].filter((x) => !x.hapus).forEach((x) => (s.kk[r][x.id] = [x.nama, x.vol, x.sat, x.harga, x.total]));
    s.rk[r] = {}; d.rk[r].filter((x) => !x.hapus).forEach((x) => (s.rk[r][x.id] = [x.nama, x.vol, x.sat, x.harga, x.total, x.kali]));
  });
  Object.entries((d.umum || {}).pengelola || {}).forEach(([id, p]) => { if (p && !p.dihapus) s.peng[id] = [p.nama || "", p.jabatan || "", Number(p.honor) || 0, (p.bulan || []).length]; });
  return s;
}
const _ktrVol = (vol, sat, harga, kali) => `${_ktrAngka(vol)}${sat ? " " + _ktrE(sat) : ""} × ${_ktrRp(harga)}${kali && kali !== 1 ? ` × ${_ktrAngka(kali)}` : ""}`;
const _ktrOleh = (o) => (o ? ` <small>(oleh ${_ktrE(String(o).split(",")[0])})</small>` : "");
const _ktrSub = (judul, isi, maks = 12) => (isi.length ? `${judul}<ul class="kt-ul kt-ul-rinci">${isi.slice(0, maks).map((x) => `<li>${x}</li>`).join("")}${isi.length > maks ? `<li><i>… dan ${isi.length - maks} lainnya</i></li>` : ""}</ul>` : "");
// bandingkan daftar (Kertas Kerja / Draft RKAS) → baris laporan
function _ktrBeda(lama, kini, sejak, adaSnap) {
  const tambah = [], ubah = [], hapus = [];
  const aktif = kini.filter((x) => !x.hapus);
  if (adaSnap) {
    aktif.forEach((x) => {
      const l = lama[x.id];
      if (!l) { tambah.push(`<b>${_ktrE(x.nama)}</b> — ${_ktrVol(x.vol, x.sat, x.harga, x.kali)} = <b>${_ktrRp(x.total)}</b>${_ktrOleh(x.oleh)}`); return; }
      const [nm, vol, sat, harga, total, kali] = l, rinci = [];
      if (nm !== x.nama) rinci.push(`nama "${_ktrE(nm)}" → "${_ktrE(x.nama)}"`);
      if (vol !== x.vol || sat !== x.sat) rinci.push(`volume ${_ktrAngka(vol)} ${_ktrE(sat)} → ${_ktrAngka(x.vol)} ${_ktrE(x.sat)}`);
      if (harga !== x.harga) rinci.push(`harga ${_ktrRp(harga)} → ${_ktrRp(x.harga)}`);
      if (kali != null && x.kali != null && kali !== x.kali) rinci.push(`frekuensi ${_ktrAngka(kali)}× → ${_ktrAngka(x.kali)}×`);
      if (total !== x.total || rinci.length) ubah.push(`<b>${_ktrE(x.nama)}</b>: ${_ktrRp(total)} → <b>${_ktrRp(x.total)}</b>${rinci.length ? ` <small>(${rinci.join("; ")})</small>` : ""}${_ktrOleh(x.oleh)}`);
    });
    const ada = new Set(aktif.map((x) => x.id));
    Object.entries(lama).forEach(([id, l]) => { if (!ada.has(id)) { const x = kini.find((y) => y.id === id); hapus.push(`<b>${_ktrE(l[0])}</b> (${_ktrRp(l[4])})${_ktrOleh(x && x.oleh)}`); } });
  } else {
    // belum ada simpanan pembanding: yang berubah sejak waktu itu (dari cap waktu), dengan angka sekarang
    kini.filter((x) => x.t >= sejak).forEach((x) => (x.hapus ? hapus : ubah).push(`<b>${_ktrE(x.nama)}</b>${x.hapus ? "" : ` — ${_ktrVol(x.vol, x.sat, x.harga, x.kali)} = <b>${_ktrRp(x.total)}</b>`}${_ktrOleh(x.oleh)}`));
  }
  return { tambah, ubah, hapus, total: aktif.reduce((a, x) => a + x.total, 0), totalLama: adaSnap ? Object.values(lama).reduce((a, l) => a + (l[4] || 0), 0) : null };
}
function _ktrBlok(judul, b) {
  if (!b.tambah.length && !b.ubah.length && !b.hapus.length) return "";
  const tot = b.totalLama != null && b.totalLama !== b.total ? `total ${_ktrRp(b.totalLama)} → <b>${_ktrRp(b.total)}</b> (${b.total > b.totalLama ? "naik" : "turun"} ${_ktrRp(Math.abs(b.total - b.totalLama))})` : `total <b>${_ktrRp(b.total)}</b>`;
  return `${judul} — ${tot}` + _ktrSub(`<br>➕ Ditambahkan ${b.tambah.length}:`, b.tambah) + _ktrSub(`<br>✏️ Diubah ${b.ubah.length}:`, b.ubah) + _ktrSub(`<br>🗑️ Dihapus ${b.hapus.length}:`, b.hapus);
}

// ── pasang ke Kabar Baru ──
(function () {
  if (typeof _ktKabarBaru !== "function") return;
  const asli = _ktKabarBaru;
  _ktKabarBaru = async function (sejak) {
    const kabar = await asli.apply(this, arguments);
    try {
      const th = typeof _bspTahunAwal === "function" ? _bspTahunAwal() : new Date().getFullYear();
      const d = await _ktrAmbil(th), kini = _ktrSnap(d);
      let lama = null; try { lama = JSON.parse(localStorage.getItem(_ktrKunciSnap(th)) || "null"); } catch (e) {}
      const adaSnap = !!(lama && lama.kk);
      // baris log umum tentang BOSP diganti laporan rinci di bawah
      Object.keys(kabar).forEach((r) => { kabar[r] = (kabar[r] || []).filter((x) => !/^🗒️ .*(Kertas Kerja BOSP|honor pengelola|bosp )/i.test(x)); });
      KT_RG.forEach((r) => {
        const a = _ktrBlok("💼 <b>Kertas Kerja BOSP</b>", _ktrBeda(adaSnap ? lama.kk[r] || {} : {}, d.kk[r], sejak, adaSnap));
        const b = _ktrBlok("🗂️ <b>Draft RKAS</b>", _ktrBeda(adaSnap ? lama.rk[r] || {} : {}, d.rk[r], sejak, adaSnap));
        [a, b].filter(Boolean).forEach((x) => (kabar[r] = kabar[r] || []).push(x));
      });
      // pengelola: pagu, honor pengelola, iuran per jenjang
      const pg = [];
      if (adaSnap) {
        KT_RG.forEach((r) => { if ((lama.pagu || {})[r] !== kini.pagu[r]) pg.push(`📌 Pagu ${_ktrNmRg[r]}: ${_ktrRp((lama.pagu || {})[r])} → <b>${_ktrRp(kini.pagu[r])}</b>`); });
        const lp = lama.peng || {}, sp = [];
        Object.entries(kini.peng).forEach(([id, p]) => { const l = lp[id]; if (!l) sp.push(`➕ <b>${_ktrE(p[0])}</b> (${_ktrE(p[1])}) — ${_ktrRp(p[2])}/bulan × ${p[3]} bulan = <b>${_ktrRp(p[2] * p[3])}</b>`); else if (l[2] !== p[2] || l[3] !== p[3] || l[1] !== p[1]) sp.push(`✏️ <b>${_ktrE(p[0])}</b>: ${_ktrRp(l[2])}/bln × ${l[3]} → <b>${_ktrRp(p[2])}/bln × ${p[3]}</b>${l[1] !== p[1] ? ` (jabatan ${_ktrE(l[1])} → ${_ktrE(p[1])})` : ""}`); });
        Object.entries(lp).forEach(([id, l]) => { if (!kini.peng[id]) sp.push(`🗑️ <b>${_ktrE(l[0])}</b> (${_ktrRp(l[2])}/bulan) dihapus`); });
        if (sp.length) pg.push(_ktrSub("👥 <b>Honor Pengelola</b> berubah:", sp));
        const li = lama.iur || {}, ui = KT_RG.filter((r) => li[r] !== kini.iur[r]);
        if (ui.length || lama.cara !== kini.cara) pg.push(_ktrSub(`💵 <b>Iuran honor pengelola per jenjang</b> (${_ktrE(kini.cara)}):`, KT_RG.map((r) => `${_ktrNmRg[r]}: ${li[r] != null && li[r] !== kini.iur[r] ? `${_ktrRp(li[r])} → ` : ""}<b>${_ktrRp(kini.iur[r])}</b> setahun`)));
      } else if (((d.umum.bagi_atur || {}).t || 0) >= sejak) {
        pg.push(_ktrSub(`💵 <b>Iuran honor pengelola per jenjang</b> diatur (${_ktrE(kini.cara)}):`, KT_RG.map((r) => `${_ktrNmRg[r]}: <b>${_ktrRp(kini.iur[r])}</b> setahun`)));
      }
      kabar.Pg = [...pg, ...(kabar.Pg || [])];
      try { localStorage.setItem(_ktrKunciSnap(th), JSON.stringify(kini)); } catch (e) {}
    } catch (e) { console.warn("Kabar rinci:", e); }
    KT.kabarCache = kabar;
    return kabar;
  };
})();

// ── Rapat BOSP: rincian Kertas Kerja & Draft RKAS tiap jenjang ──
function _ktrTabel(judul, daftar, kelompok) {
  const aktif = daftar.filter((x) => !x.hapus && !x.coret); if (!aktif.length) return `<div class="kt-rinci-kosong">${judul}: belum ada isian</div>`;
  const grup = {}; aktif.forEach((x) => (grup[kelompok(x)] = grup[kelompok(x)] || []).push(x));
  const tot = aktif.reduce((a, x) => a + x.total, 0);
  return `<details class="kt-rinci"><summary>${judul} — ${aktif.length} uraian · <b>${_ktrRp(tot)}</b></summary><div class="kt-rinci-isi"><table class="kt-tabel"><thead><tr><th>Uraian</th><th>Volume × Harga</th><th>Jumlah</th></tr></thead><tbody>
    ${Object.entries(grup).map(([g, isi]) => `<tr class="kt-tabel-grup"><td colspan="2">${_ktrE(g || "Lainnya")}</td><td>${_ktrRp(isi.reduce((a, x) => a + x.total, 0))}</td></tr>` + isi.map((x) => `<tr><td>${_ktrE(x.nama)}</td><td>${_ktrVol(x.vol, x.sat, x.harga, x.kali)}</td><td><b>${_ktrRp(x.total)}</b></td></tr>`).join("")).join("")}
    <tr class="kt-tabel-jml"><td colspan="2">Jumlah</td><td>${_ktrRp(tot)}</td></tr></tbody></table></div></details>`;
}
(function () {
  if (typeof _ktSkrip !== "function") return;
  const asli = _ktSkrip;
  _ktSkrip = async function (topik) {
    const h = await asli.apply(this, arguments);
    if (topik !== "bosp" || !h || !h.baris) return h;
    try {
      const th = typeof _bspTahunAwal === "function" ? _bspTahunAwal() : new Date().getFullYear(), d = await _ktrAmbil(th);
      KT_RG.forEach((r) => {
        const b = h.baris.find((x) => x.kode !== "kepala" && x.kode !== "bendahara" && x.html.includes(`Laporan <b>${KT_JENJANG[r]}</b>`)); if (!b) return;
        const iur = _ktrIuran(d.umum)[r];
        b.html += _ktrTabel("📋 Rincian Draft RKAS", d.rk[r], (x) => x.kel) + (iur ? `<div class="kt-rinci-kosong">+ Honor Pengelola PKBM (otomatis): <b>${_ktrRp(iur)}</b></div>` : "") + _ktrTabel("💼 Rincian Kertas Kerja", d.kk[r], (x) => (x.kode ? x.kode + " " : "") + x.keg);
      });
      const bd = h.baris.find((x) => x.kode === "bendahara");
      const peng = Object.values(d.umum.pengelola || {}).filter((p) => p && !p.dihapus);
      if (bd && peng.length) {
        const per = typeof bspBagiDari === "function" ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => bspBagiDari(d.umum, m)) : [];
        bd.html += `<details class="kt-rinci"><summary>👥 Rincian Honor Pengelola — ${peng.length} orang</summary><div class="kt-rinci-isi"><table class="kt-tabel"><thead><tr><th>Nama · Jabatan</th><th>Honor × Bulan</th><th>Setahun</th></tr></thead><tbody>
          ${peng.map((p) => `<tr><td>${_ktrE(p.nama)} · ${_ktrE(p.jabatan)}</td><td>${_ktrRp(p.honor)} × ${(p.bulan || []).length}</td><td><b>${_ktrRp((Number(p.honor) || 0) * (p.bulan || []).length)}</b></td></tr>`).join("")}
          ${per.length ? `<tr class="kt-tabel-grup"><td colspan="3">Iuran per jenjang (${_ktrE(typeof bspCaraBagi === "function" ? bspCaraBagi(d.umum) : "")})</td></tr>` + KT_RG.map((r) => { const v = per.map((x) => x[r]), mn = Math.min(...v), mx = Math.max(...v); return `<tr><td>${_ktrNmRg[r]}</td><td>${mn === mx ? _ktrRp(mn) + "/bulan" : `${_ktrRp(mn)}–${_ktrRp(mx)}/bulan`}</td><td><b>${_ktrRp(v.reduce((a, x) => a + x, 0))}</b></td></tr>`; }).join("") : ""}
          </tbody></table></div></details>`;
      }
    } catch (e) { console.warn("Rincian rapat BOSP:", e); }
    return h;
  };
})();

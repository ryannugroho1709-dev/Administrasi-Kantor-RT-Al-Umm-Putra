// ============================================================
//  DATA BOP — Rencana Anggaran Belanja (tampilan baru)
//  • Dana BOP (per tahap pencairan) vs kebutuhan (rencana) → status PAS / KURANG / LEBIH + pengingat.
//  • Pola anggaran tiap item: SEKALI habis (satu bulan), DIBAGI ke beberapa bulan, RUTIN tiap bulan, atau MANUAL.
//    Pola menghasilkan nominal per bulan di tabel bop_anggaran_bulan (data lama tetap dipakai apa adanya).
//  • Tampilan utama PER BULAN (apa yang harus dibayar bulan ini + tombol "Bayar"), lalu Per Item & Setahun.
//  • Ekspor PDF/Excel RAB berkop (logo + nama lembaga), penanggung jawab: Kepala Sekolah.
//  Pola & dana disimpan di kuliah_pengaturan "bop:rencana" → tanpa tabel baru.
// ============================================================
const BOPX = { tab: "bulan", bulan: null, rencana: null, tglBayar: null };
const _BOP_POLA = {
  sekali: { label: "Sekali habis", ikon: "🎯", ket: "dibayar sekali di satu bulan" },
  dibagi: { label: "Dibagi beberapa bulan", ikon: "🧩", ket: "total dibagi rata ke beberapa bulan" },
  rutin: { label: "Rutin tiap bulan", ikon: "🔁", ket: "nominal sama setiap bulan" },
  manual: { label: "Atur manual", ikon: "✍️", ket: "isi sendiri per bulan" },
};
const _bopBln = (b) => NAMA_BULAN_KALDIK[b];
const _bopBlnPendek = (b) => NAMA_BULAN_KALDIK[b].slice(0, 3);
const _bopRp = (n) => formatRupiah(Math.round(Number(n) || 0));
const _bopRpS = (n) => { const x = Math.round(Number(n) || 0); return (x < 0 ? "-" : "") + (formatRibuan(Math.abs(x)) || "0"); }; // angka saja, tanpa "Rp"

async function _bopMuatRencana() {
  try { BOPX.rencanaSemua = (await _kvAmbil("bop:rencana", {})) || {}; } catch (e) { BOPX.rencanaSemua = {}; }
  const th = String(STATE.bopDataTahun);
  BOPX.rencana = BOPX.rencanaSemua[th] || { dana: [], pola: {} };
  BOPX.rencana.dana = BOPX.rencana.dana || []; BOPX.rencana.pola = BOPX.rencana.pola || {};
}
async function _bopSimpanRencana() {
  const terbaru = (await _kvAmbil("bop:rencana", {}).catch(() => ({}))) || {};
  terbaru[String(STATE.bopDataTahun)] = BOPX.rencana;
  await _kvSimpan("bop:rencana", terbaru);
  BOPX.rencanaSemua = terbaru;
}
// Ringkasan semua angka (dipakai tampilan & ekspor)
function _bopHitung() {
  const { items, anggaran, realisasi } = _BOP_CACHE;
  const ang = {}, real = {}, lunasM = {};
  anggaran.forEach((a) => { ang[a.item_id + "_" + a.bulan] = Number(a.nominal) || 0; if (a.lunas_manual) lunasM[a.item_id + "_" + a.bulan] = true; });
  realisasi.forEach((r) => { const k = r.item_id + "_" + r.bulan; real[k] = (real[k] || 0) + Number(r.nominal || 0); });
  const idAktif = new Set(items.map((i) => i.id));
  const bulan = Array.from({ length: 12 }, (_, i) => i + 1).map((b) => {
    let rencana = 0, terbayar = 0;
    items.forEach((it) => { rencana += ang[it.id + "_" + b] || 0; terbayar += Math.min(real[it.id + "_" + b] || 0, Infinity); });
    return { b, rencana, terbayar };
  });
  const kebutuhan = bulan.reduce((s, x) => s + x.rencana, 0);
  const terealisasi = realisasi.filter((r) => idAktif.has(r.item_id)).reduce((s, r) => s + Number(r.nominal || 0), 0);
  const cair = (BOPX.rencana?.dana || []).reduce((s, d) => s + (Number(d.nominal) || 0), 0);
  const rumus = _bopDanaRumus(BOPX.rencana?.rumus);
  const dana = rumus ? rumus.bersih : cair; // dana dari jumlah santri × satuan biaya; bila belum diatur → total pencairan
  const status = (it, b) => { const n = ang[it.id + "_" + b] || 0, r = real[it.id + "_" + b] || 0; return { n, r, lunas: !!lunasM[it.id + "_" + b] || (n > 0 && r >= n), sebagian: r > 0 && r < n }; };
  return { ang, real, bulan, kebutuhan, terealisasi, dana, cair, rumus, selisih: dana - kebutuhan, status };
}
function _bopPolaItem(it, H) {
  const p = BOPX.rencana?.pola?.[it.id];
  if (p?.pola) return p;
  const isi = Array.from({ length: 12 }, (_, i) => H.ang[it.id + "_" + (i + 1)] || 0), terisi = isi.map((v, i) => [v, i + 1]).filter(([v]) => v > 0);
  if (!terisi.length) return { pola: "manual" };
  if (terisi.length === 1) return { pola: "sekali", nominal: terisi[0][0], mulai: terisi[0][1], akhir: terisi[0][1], tebak: true };
  if (terisi.every(([v]) => v === terisi[0][0])) return { pola: "rutin", nominal: terisi[0][0], mulai: terisi[0][1], akhir: terisi[terisi.length - 1][1], tebak: true };
  return { pola: "manual" };
}
function _bopKetPola(p) {
  if (p.pola === "sekali") return `${_bopRp(p.nominal)} · ${_bopBln(p.mulai)}`;
  if (p.pola === "rutin") return `${_bopRp(p.nominal)}/bulan · ${_bopBlnPendek(p.mulai)}–${_bopBlnPendek(p.akhir)}`;
  if (p.pola === "dibagi") return `${_bopRp(p.total)} dibagi ${p.akhir - p.mulai + 1} bulan · ${_bopBlnPendek(p.mulai)}–${_bopBlnPendek(p.akhir)}`;
  return "nominal diisi per bulan";
}
// Pola → nominal tiap bulan (1..12)
function _bopSebar(p) {
  const out = Array(13).fill(0);
  if (p.pola === "sekali") out[p.mulai] = Math.round(p.nominal || 0);
  if (p.pola === "rutin") for (let b = p.mulai; b <= p.akhir; b++) out[b] = Math.round(p.nominal || 0);
  if (p.pola === "dibagi") {
    const n = p.akhir - p.mulai + 1, per = Math.floor((p.total || 0) / n / 1000) * 1000 || Math.floor((p.total || 0) / n);
    for (let b = p.mulai; b <= p.akhir; b++) out[b] = per;
    out[p.akhir] += Math.round(p.total || 0) - per * n; // sisa pembulatan masuk bulan terakhir
  }
  return out;
}

// ── TAMPILAN UTAMA ──────────────────────────────────────────
async function _renderBopDataUI() {
  const root = qs("bop-data-root");
  root.innerHTML = loadingHTML();
  try {
    const [items, anggaran, realisasi] = await Promise.all([apiGetBopAnggaranItem(), apiGetBopAnggaranBulan(STATE.bopDataTahun), apiGetBopRealisasi(STATE.bopDataTahun)]);
    _BOP_CACHE = { items, anggaran, realisasi };
    await _bopMuatRencana();
    const kini = new Date(), thKini = Number(tanggalISO().slice(0, 4));
    if (!BOPX.bulan) BOPX.bulan = STATE.bopDataTahun === thKini ? kini.getMonth() + 1 : 1;
    _bopGambar();
  } catch (e) { console.error(e); root.innerHTML = `<div class="card empty-state">Gagal memuat Data BOP: ${escapeHtml(e.message)}</div>`; }
}
function _bopGambar() {
  const root = qs("bop-data-root"), H = _bopHitung(), th = STATE.bopDataTahun;
  const persenReal = H.dana ? Math.min(100, Math.round((H.terealisasi / H.dana) * 100)) : H.kebutuhan ? Math.min(100, Math.round((H.terealisasi / H.kebutuhan) * 100)) : 0;
  const st = !H.dana ? { k: "kosong", t: "Dana belum diisi", ikon: "❔" } : H.selisih < 0 ? { k: "kurang", t: `Kurang ${_bopRp(-H.selisih)}`, ikon: "⚠️" } : H.selisih > 0 ? { k: "lebih", t: `Lebih ${_bopRp(H.selisih)}`, ikon: "💡" } : { k: "pas", t: "Pas", ikon: "✅" };
  // pengingat
  const ingat = [];
  if (!H.dana) ingat.push(["info", "🏦", `Masukkan <b>dana BOP ${th}</b> yang diterima supaya aplikasi bisa memberi tahu anggaran sudah pas, kurang, atau lebih.`, `<button class="btn btn-sm btn-accent" onclick="bopAturDana()">Isi dana BOP</button>`]);
  else if (H.selisih < 0) ingat.push(["bahaya", "⚠️", `Rencana kebutuhan <b>${_bopRp(H.kebutuhan)}</b> melebihi dana BOP <b>${_bopRp(H.dana)}</b>. Kurangi atau tunda item senilai <b>${_bopRp(-H.selisih)}</b>.`, `<button class="btn btn-sm btn-outline" onclick="BOPX.tab='item';_bopGambar()">Lihat item</button>`]);
  else if (H.selisih > 0) ingat.push(["lebih", "💡", `Masih ada dana <b>${_bopRp(H.selisih)}</b> yang belum dialokasikan ke item mana pun.`, `<button class="btn btn-sm btn-outline" onclick="bopTambahItem()">＋ Alokasikan</button>`]);
  if (H.dana && H.terealisasi > H.dana) ingat.push(["bahaya", "🚨", `Belanja yang sudah dicatat <b>${_bopRp(H.terealisasi)}</b> melebihi dana BOP.`, ""]);
  const thKini = Number(tanggalISO().slice(0, 4)), blnKini = new Date().getMonth() + 1;
  if (th === thKini) {
    const belum = _BOP_CACHE.items.map((it) => ({ it, s: H.status(it, blnKini) })).filter((x) => x.s.n > 0 && !x.s.lunas);
    if (belum.length) ingat.push(["tugas", "🗓️", `<b>${belum.length} pembayaran ${_bopBln(blnKini)}</b> belum dicatat (${_bopRp(belum.reduce((s, x) => s + x.s.n - x.s.r, 0))}).`, `<button class="btn btn-sm btn-accent" onclick="BOPX.tab='bulan';BOPX.bulan=${blnKini};_bopGambar()">Lihat</button>`]);
  }
  const maksB = Math.max(1, ...H.bulan.map((x) => Math.max(x.rencana, x.terbayar)));
  root.innerHTML = `
  <div class="bx-hero">
    <i class="bx-grid"></i>
    <div class="bx-hero-atas">
      <div><div class="bx-label">RENCANA ANGGARAN BELANJA · BOP</div><h2>Tahun Anggaran ${th}</h2>
        <div class="bx-pj">Penanggung jawab: <b>${escapeHtml(_namaPejabat(STATE.pengaturan || {}) || "Kepala Sekolah")}</b> · Kepala Sekolah</div></div>
      <div class="bx-tahun"><button onclick="bopGeserTahun(-1)" aria-label="Tahun sebelumnya">‹</button><b>${th}</b><button onclick="bopGeserTahun(1)" aria-label="Tahun berikutnya">›</button></div>
    </div>
    <div class="bx-kpi">
      <button class="bx-k" onclick="bopAturDana()"><span>🏦 Dana BOP</span><b>${_bopRp(H.dana)}</b><small>${H.rumus ? `B ${BOPX.rencana.rumus.siswaB} + C ${BOPX.rencana.rumus.siswaC} santri${H.rumus.pajak || H.rumus.potong ? " · setelah potongan" : ""}${H.cair ? ` · cair ${_bopRp(H.cair)}` : ""}` : (BOPX.rencana.dana || []).length ? `${BOPX.rencana.dana.length} tahap · ubah` : "ketuk untuk menghitung"}</small>${(() => { const r2 = _bopDanaRumus(BOPX.rencanaSemua?.[String(th + 1)]?.rumus); return r2 ? `<small class="bx-depan">🔮 Perkiraan ${th + 1}: ${_bopRp(r2.bersih)}</small>` : ""; })()}</button>
      <div class="bx-k"><span>🧾 Kebutuhan (rencana)</span><b>${_bopRp(H.kebutuhan)}</b><small>${_BOP_CACHE.items.length} item anggaran</small></div>
      <div class="bx-k st-${st.k}"><span>⚖️ Selisih dana</span><b>${st.ikon} ${st.t}</b><small>${H.dana ? (H.selisih < 0 ? "anggaran melebihi dana" : H.selisih > 0 ? "dana belum terpakai rencana" : "rencana = dana") : "isi dana BOP dulu"}</small></div>
      <div class="bx-k"><span>✅ Terealisasi</span><b>${_bopRp(H.terealisasi)}</b><div class="bx-bar"><i style="width:${persenReal}%"></i></div><small>${persenReal}% dari ${H.dana ? "dana" : "rencana"} · sisa ${_bopRp((H.dana || H.kebutuhan) - H.terealisasi)}</small></div>
    </div>
    <div class="bx-grafik" role="img" aria-label="Rencana dan realisasi per bulan">${H.bulan.map((x) => `<button class="${x.b === BOPX.bulan && BOPX.tab === "bulan" ? "on" : ""}" onclick="BOPX.tab='bulan';BOPX.bulan=${x.b};_bopGambar()" title="${_bopBln(x.b)}: rencana ${_bopRp(x.rencana)}, terbayar ${_bopRp(x.terbayar)}">
      <span class="bx-tiang"><i class="r" style="height:${(x.rencana / maksB) * 100}%"></i><i class="t" style="height:${(Math.min(x.terbayar, x.rencana || x.terbayar) / maksB) * 100}%"></i></span><small>${_bopBlnPendek(x.b)}</small></button>`).join("")}</div>
    <div class="bx-legenda"><span><i class="r"></i>Rencana</span><span><i class="t"></i>Sudah dibayar</span></div>
  </div>
  ${ingat.length ? `<div class="bx-ingat">${ingat.map(([k, ik, t, aksi]) => `<div class="bx-ingat-baris ${k}"><span>${ik}</span><div>${t}</div>${aksi}</div>`).join("")}</div>` : ""}
  <div class="bx-alat">
    <div class="bx-tab">${[["bulan", "📅 Per Bulan"], ["item", "📦 Per Item"], ["tahun", "🗓️ Setahun"]].map(([k, l]) => `<button class="${BOPX.tab === k ? "on" : ""}" onclick="BOPX.tab='${k}';_bopGambar()">${l}</button>`).join("")}</div>
    <div class="bx-aksi">
      <button class="btn btn-accent btn-sm" onclick="bopTambahItem()">＋ Tambah item</button>
      <button class="btn btn-outline btn-sm" onclick="bopAturDana()">🏦 Dana BOP</button>
      <details class="bx-menu"><summary class="btn btn-outline btn-sm">⋯ Lainnya</summary><div>
        <button onclick="bopEksporAnggaranPDF()">🖨️ Ekspor PDF (RAB berkop)</button>
        <button onclick="bopUnduhTemplateExcel()">📊 Ekspor Excel (RAB berkop)</button>
        <label>📤 Impor Excel<input type="file" accept=".xlsx,.xls" hidden onchange="bopImporExcel(event)"></label>
        <button onclick="bopLihatRiwayatSemua()">📜 Riwayat semua belanja</button>
      </div></details>
    </div>
  </div>
  <div id="bx-isi">${BOPX.tab === "item" ? _bopHtmlItem(H) : BOPX.tab === "tahun" ? _bopHtmlTahun(H) : _bopHtmlBulan(H)}</div>`;
  // deretan bulan langsung bergeser ke bulan yang dipilih
  const chip = root.querySelector(".bx-chip"), on = chip?.querySelector("button.on");
  if (chip && on) chip.scrollLeft = on.offsetLeft - chip.clientWidth / 2 + on.clientWidth / 2;
}
function bopGeserTahun(n) { STATE.bopDataTahun += n; BOPX.bulan = null; _renderBopDataUI(); }

// ── PER BULAN ──
function _bopTglBawaan(b) {
  const th = STATE.bopDataTahun, hariIni = tanggalISO(), ym = `${th}-${String(b).padStart(2, "0")}`;
  if (hariIni.startsWith(ym)) return hariIni;
  if (ym < hariIni.slice(0, 7)) { const akhir = new Date(th, b, 0).getDate(); return `${ym}-${String(akhir).padStart(2, "0")}`; }
  return `${ym}-01`;
}
function _bopHtmlBulan(H) {
  const b = BOPX.bulan, x = H.bulan[b - 1];
  const daftar = _BOP_CACHE.items.map((it) => ({ it, s: H.status(it, b), p: _bopPolaItem(it, H) })).filter((d) => d.s.n > 0 || d.s.r > 0);
  const belum = daftar.filter((d) => d.s.n > 0 && !d.s.lunas);
  if (!BOPX.tglBayar || !BOPX.tglBayar.startsWith(`${STATE.bopDataTahun}-${String(b).padStart(2, "0")}`)) BOPX.tglBayar = _bopTglBawaan(b);
  return `<div class="bx-bulan">
    <div class="bx-chip">${H.bulan.map((m) => { const semua = _BOP_CACHE.items.filter((it) => H.status(it, m.b).n > 0), lunas = semua.filter((it) => H.status(it, m.b).lunas).length;
      return `<button class="${m.b === b ? "on" : ""} ${semua.length && lunas === semua.length ? "beres" : ""}" onclick="BOPX.bulan=${m.b};_bopGambar()"><b>${_bopBlnPendek(m.b)}</b><small>${m.rencana ? _bopRpS(m.rencana) : "–"}</small>${semua.length ? `<i>${lunas}/${semua.length}</i>` : ""}</button>`; }).join("")}</div>
    <div class="card bx-bulan-kartu">
      <div class="bx-bulan-h"><div><h3>${_bopBln(b)} ${STATE.bopDataTahun}</h3><small>${daftar.length} item · rencana ${_bopRp(x.rencana)} · dibayar ${_bopRp(x.terbayar)}</small></div>
        ${belum.length ? `<div class="bx-bayar-semua"><label>Tanggal bayar<input type="date" class="input" value="${BOPX.tglBayar}" onchange="BOPX.tglBayar=this.value"></label><button class="btn btn-accent btn-sm" onclick="bopBayarSemua(${b})">✓ Tandai semua dibayar (${belum.length})</button></div>` : daftar.length ? `<span class="bx-beres">✅ Semua sudah dibayar</span>` : ""}</div>
      ${daftar.length ? daftar.map(({ it, s, p }) => `<div class="bx-baris ${s.lunas ? "lunas" : s.sebagian ? "sebagian" : ""}">
          <span class="bx-pola" title="${escapeHtml(_BOP_POLA[p.pola].label)}">${_BOP_POLA[p.pola].ikon}</span>
          <div class="bx-nama"><b>${escapeHtml(it.nama)}</b><small>${escapeHtml(_BOP_POLA[p.pola].label)}${s.r ? ` · dibayar ${_bopRp(s.r)}` : ""}</small></div>
          <div class="bx-nom">${_bopRp(s.n)}</div>
          <div class="bx-st">${s.lunas ? `<span class="ok">✓ Lunas</span>` : s.sebagian ? `<span class="sebagian">Sisa ${_bopRp(s.n - s.r)}</span>` : `<span class="belum">Belum</span>`}</div>
          <div class="bx-tombol">${!s.lunas && s.n > 0 ? `<button class="btn btn-sm btn-accent" onclick="bopBayar('${it.id}',${b})">✓ Bayar</button>` : ""}<button class="btn btn-sm btn-ghost" onclick="bopBukaSelDetail('${it.id}',${b})" title="Rincian, ubah nominal, catat belanja sebagian">⋯</button></div>
        </div>`).join("") : `<div class="bx-kosong">Tidak ada anggaran di bulan ini. <button class="btn btn-sm btn-outline" onclick="bopTambahItem(${b})">＋ Tambah item</button></div>`}
    </div></div>`;
}
async function bopBayar(itemId, b) {
  const H = _bopHitung(), it = _BOP_CACHE.items.find((x) => x.id === itemId), s = H.status(it, b);
  const tgl = BOPX.tglBayar || _bopTglBawaan(b);
  try {
    await apiTambahBopRealisasi({ item_id: itemId, tahun: STATE.bopDataTahun, bulan: b, tanggal: tgl, nominal: s.n - s.r, catatan: "Dibayar", dibuat_oleh: STATE.guruId || null });
    toast(`✓ ${it.nama} ${_bopBln(b)} dicatat dibayar ${_bopRp(s.n - s.r)}`, "ok");
    await _renderBopDataUI();
  } catch (e) { toast("Gagal mencatat: " + e.message, "err"); }
}
async function bopBayarSemua(b) {
  const H = _bopHitung(), belum = _BOP_CACHE.items.map((it) => ({ it, s: H.status(it, b) })).filter((x) => x.s.n > 0 && !x.s.lunas);
  if (!belum.length) return;
  const tgl = BOPX.tglBayar || _bopTglBawaan(b);
  if (!(await konfirmasiTema(`Catat <b>${belum.length} pembayaran ${_bopBln(b)}</b> senilai <b>${_bopRp(belum.reduce((t, x) => t + x.s.n - x.s.r, 0))}</b> pada tanggal ${_tglPendek ? _tglPendek(tgl) : tgl}?`, { ikon: "✓", judul: "Tandai semua dibayar", teksYa: "Catat" }))) return;
  setGlobalLoading(true, "Mencatat pembayaran…");
  try { for (const x of belum) await apiTambahBopRealisasi({ item_id: x.it.id, tahun: STATE.bopDataTahun, bulan: b, tanggal: tgl, nominal: x.s.n - x.s.r, catatan: "Dibayar", dibuat_oleh: STATE.guruId || null }); toast(`✓ ${belum.length} pembayaran dicatat`, "ok"); }
  catch (e) { toast("Gagal: " + e.message, "err"); }
  finally { setGlobalLoading(false); }
  await _renderBopDataUI();
}

// ── PER ITEM ──
function _bopHtmlItem(H) {
  if (!_BOP_CACHE.items.length) return `<div class="card bx-kosong">Belum ada item anggaran. <button class="btn btn-accent btn-sm" onclick="bopTambahItem()">＋ Tambah item</button></div>`;
  const grup = { sekali: [], dibagi: [], rutin: [], manual: [] };
  _BOP_CACHE.items.forEach((it) => { const p = _bopPolaItem(it, H); grup[p.pola].push({ it, p }); });
  return Object.entries(grup).filter(([, xs]) => xs.length).map(([pola, xs]) => `<div class="bx-grup-h">${_BOP_POLA[pola].ikon} ${_BOP_POLA[pola].label} <small>${xs.length} item · ${_bopRp(xs.reduce((s, { it }) => s + Array.from({ length: 12 }, (_, i) => H.ang[it.id + "_" + (i + 1)] || 0).reduce((a, v) => a + v, 0), 0))}</small></div>
    <div class="bx-item-grid">${xs.map(({ it, p }) => {
      const total = Array.from({ length: 12 }, (_, i) => H.ang[it.id + "_" + (i + 1)] || 0).reduce((a, v) => a + v, 0);
      const bayar = Array.from({ length: 12 }, (_, i) => Math.min(H.real[it.id + "_" + (i + 1)] || 0, H.ang[it.id + "_" + (i + 1)] || Infinity)).reduce((a, v) => a + v, 0);
      return `<div class="card bx-item">
        <div class="bx-item-h"><div><b>${escapeHtml(it.nama)}</b><small>${escapeHtml(_bopKetPola(p))}</small></div><div class="bx-item-tot">${_bopRp(total)}</div></div>
        <div class="bx-strip">${Array.from({ length: 12 }, (_, i) => { const s = H.status(it, i + 1); return `<button class="${!s.n ? "kosong" : s.lunas ? "lunas" : s.sebagian ? "sebagian" : "rencana"}" onclick="bopBukaSelDetail('${it.id}',${i + 1})" title="${_bopBln(i + 1)}: ${s.n ? _bopRp(s.n) : "–"}${s.lunas ? " · lunas" : ""}">${_bopBlnPendek(i + 1)[0]}</button>`; }).join("")}</div>
        <div class="bx-bar kecil"><i style="width:${total ? Math.round((bayar / total) * 100) : 0}%"></i></div>
        <div class="bx-item-kaki"><small>dibayar ${_bopRp(bayar)} dari ${_bopRp(total)}</small><span><button class="btn btn-ghost btn-sm" onclick="bopAturPola('${it.id}')">✏️ Atur</button><button class="btn btn-ghost btn-sm" onclick="bopHapusItem('${it.id}',${escapeHtml(JSON.stringify(it.nama))})">🗑️</button></span></div>
      </div>`; }).join("")}</div>`).join("");
}
// ── SETAHUN (tabel ringkas, klik sel untuk detail) ──
function _bopHtmlTahun(H) {
  const items = _BOP_CACHE.items;
  return `<div class="card bx-tahun-wadah"><table class="bx-tabel"><thead><tr><th class="nama">Item</th>${Array.from({ length: 12 }, (_, i) => `<th>${_bopBlnPendek(i + 1)}</th>`).join("")}<th>Total</th></tr></thead>
    <tbody>${items.map((it) => { let t = 0; return `<tr><td class="nama">${escapeHtml(it.nama)}</td>${Array.from({ length: 12 }, (_, i) => { const s = H.status(it, i + 1); t += s.n; return `<td class="${!s.n ? "kosong" : s.lunas ? "lunas" : ""}" onclick="bopBukaSelDetail('${it.id}',${i + 1})">${s.n ? _bopRpS(s.n) : "–"}</td>`; }).join("")}<td class="tot">${_bopRpS(t)}</td></tr>`; }).join("") || `<tr><td colspan="14" class="kosong">Belum ada item.</td></tr>`}</tbody>
    <tfoot><tr><td class="nama">TOTAL</td>${H.bulan.map((x) => `<td>${_bopRpS(x.rencana)}</td>`).join("")}<td class="tot">${_bopRpS(H.kebutuhan)}</td></tr></tfoot></table></div>
    <div class="bx-catatan">Ketuk sel bulan untuk mengubah nominal, mencatat belanja, atau menandai lunas. Sel hijau = sudah lunas.</div>`;
}

// ── DANA BOP: dihitung dari jumlah santri × satuan biaya (Paket B = kelas 7–9, Paket C = kelas 10–12) ──
// Contoh: Paket B 56 × 1.500.000 = 84.000.000; Paket C 25 × 1.800.000 = 45.000.000 → total 129.000.000 (sebelum pajak).
const _BOP_SATUAN = { B: 1500000, C: 1800000 };
function _bopDanaRumus(r) {
  if (!r) return null;
  const B = (Number(r.siswaB) || 0) * (Number(r.satuanB) || 0), C = (Number(r.siswaC) || 0) * (Number(r.satuanC) || 0), bruto = B + C;
  const pajak = Math.round((bruto * (Number(r.pajak) || 0)) / 100), potong = Number(r.potongan) || 0;
  return { B, C, bruto, pajak, potong, bersih: bruto - pajak - potong };
}
async function _bopJumlahSantri() {
  const per = {}; // angka kelas → jumlah santri aktif
  try { (await apiGetAllSiswa(null)).forEach((s) => { const n = parseInt(String(s.kelas?.nama_kelas || "").match(/\d+/)?.[0] || "0", 10); if (n) per[n] = (per[n] || 0) + 1; }); } catch (e) { console.warn(e); }
  return { per, B: [7, 8, 9].reduce((a, k) => a + (per[k] || 0), 0), C: [10, 11, 12].reduce((a, k) => a + (per[k] || 0), 0) };
}
async function bopAturDana() {
  setGlobalLoading(true, "Menghitung jumlah santri…");
  const js = await _bopJumlahSantri(); setGlobalLoading(false);
  BOPX.santri = js;
  const r = BOPX.rencana.rumus || { satuanB: _BOP_SATUAN.B, satuanC: _BOP_SATUAN.C, siswaB: js.B, siswaC: js.C, pajak: 0, potongan: 0 };
  const d = (BOPX.rencana.dana || []).length ? BOPX.rencana.dana : [{ label: "Tahap 1", nominal: "", tanggal: "" }, { label: "Tahap 2", nominal: "", tanggal: "" }];
  const angka = (id, v, cls = "") => `<input id="${id}" class="input ${cls}" inputmode="numeric" value="${v ? formatRibuan(v) : v === 0 ? "0" : ""}" oninput="this.value=formatRibuan(this.value);_bopSegarkanDana()">`;
  const per = js.per;
  openModal(`<div class="bx-dana">
    <h3>🏦 Dana BOP ${STATE.bopDataTahun}</h3>
    <div class="bx-sub">Dana BOP dihitung dari <b>jumlah santri × satuan biaya</b> per paket. Totalnya menjadi anggaran yang dicocokkan dengan Rancangan Anggaran.</div>
    <div class="bx-rumus">
      <div class="bx-rumus-baris"><b>Paket B</b><small>kelas 7–9</small>${angka("bd-sb", r.siswaB)}<span>santri ×</span>${angka("bd-rb", r.satuanB)}<span>=</span><output id="bd-hb"></output></div>
      <div class="bx-rumus-baris"><b>Paket C</b><small>kelas 10–12</small>${angka("bd-sc", r.siswaC)}<span>santri ×</span>${angka("bd-rc", r.satuanC)}<span>=</span><output id="bd-hc"></output></div>
      <div class="bx-rumus-total"><span>Total sebelum pajak</span><output id="bd-bruto"></output></div>
      <div class="bx-rumus-potong"><label>Potongan pajak <span><input id="bd-pajak" class="input" inputmode="decimal" value="${r.pajak || 0}" oninput="_bopSegarkanDana()"> %</span></label><output id="bd-pajak-rp"></output></div>
      <div class="bx-rumus-potong"><label>Potongan lain (Rp)</label>${angka("bd-potong", r.potongan || 0)}</div>
      <div class="bx-rumus-total bersih"><span>Dana BOP dipakai untuk anggaran</span><output id="bd-bersih"></output></div>
    </div>
    <div class="bx-santri-ket">📊 Data Siswa saat ini: ${[7, 8, 9, 10, 11, 12].filter((k) => per[k]).map((k) => `kelas ${k}: <b>${per[k]}</b>`).join(" · ") || "belum ada data"} → Paket B <b>${js.B}</b>, Paket C <b>${js.C}</b>
      <button type="button" class="btn btn-ghost btn-sm" onclick="qs('bd-sb').value=${js.B};qs('bd-sc').value=${js.C};_bopSegarkanDana()">↻ Pakai jumlah ini</button></div>
    <details class="bx-lipat" ${STATE.bopDataTahun >= Number(tanggalISO().slice(0, 4)) ? "open" : ""}><summary>🔮 Perkiraan BOP tahun ${STATE.bopDataTahun + 1}</summary>
      <div class="bx-sub" style="margin-top:6px">Santri naik kelas: kelas 7–8 → Paket B, kelas 10–11 → Paket C (kelas 9 & 12 lulus). Isi perkiraan santri baru.</div>
      <div class="bx-rumus-baris"><b>Santri baru kelas 7</b>${angka("bd-baru7", per[7] || 0)}<b>Santri baru / lanjut kelas 10</b>${angka("bd-baru10", per[10] || 0)}</div>
      <div class="bx-proyeksi" id="bd-proyeksi"></div>
      <button type="button" class="btn btn-outline btn-sm" onclick="bopSimpanProyeksi()">📌 Simpan sebagai rencana dana ${STATE.bopDataTahun + 1}</button>
    </details>
    <details class="bx-lipat"><summary>💵 Catatan pencairan per tahap (opsional)</summary>
      <div class="bx-sub" style="margin-top:6px">Untuk mencatat dana yang sudah benar-benar cair.</div>
      <div id="bx-dana">${d.map((x, i) => _bopBarisDana(x, i)).join("")}</div>
      <button type="button" class="kb-tambah" onclick="qs('bx-dana').insertAdjacentHTML('beforeend',_bopBarisDana({label:'Tahap '+(qsa('.bx-dana-baris').length+1)},qsa('.bx-dana-baris').length))">＋ Tambah tahap</button>
    </details>
    <button class="btn btn-accent" style="width:100%;margin-top:12px" onclick="bopSimpanDana()">💾 Simpan dana BOP</button>
  </div>`, { lebar: true });
  _bopSegarkanDana();
}
const _bdAngka = (id) => Number(String(qs(id)?.value || "").replace(/\D/g, "")) || 0;
function _bopBacaRumus() {
  return { siswaB: _bdAngka("bd-sb"), satuanB: _bdAngka("bd-rb"), siswaC: _bdAngka("bd-sc"), satuanC: _bdAngka("bd-rc"), pajak: Number(String(qs("bd-pajak")?.value || "0").replace(",", ".")) || 0, potongan: _bdAngka("bd-potong") };
}
function _bopSegarkanDana() {
  const r = _bopBacaRumus(), h = _bopDanaRumus(r);
  qs("bd-hb").textContent = _bopRp(h.B); qs("bd-hc").textContent = _bopRp(h.C); qs("bd-bruto").textContent = _bopRp(h.bruto);
  qs("bd-pajak-rp").textContent = h.pajak ? "− " + _bopRp(h.pajak) : ""; qs("bd-bersih").textContent = _bopRp(h.bersih);
  const js = BOPX.santri || { per: {} }, per = js.per;
  const B2 = (per[7] || 0) + (per[8] || 0) + _bdAngka("bd-baru7"), C2 = (per[10] || 0) + (per[11] || 0) + _bdAngka("bd-baru10");
  const h2 = _bopDanaRumus({ ...r, siswaB: B2, siswaC: C2 });
  BOPX.proyeksi = { ...r, siswaB: B2, siswaC: C2 };
  const el = qs("bd-proyeksi"); if (el) el.innerHTML = `Paket B <b>${B2}</b> × ${_bopRp(r.satuanB)} = ${_bopRp(h2.B)}<br>Paket C <b>${C2}</b> × ${_bopRp(r.satuanC)} = ${_bopRp(h2.C)}<br>Perkiraan total ${STATE.bopDataTahun + 1}: <b>${_bopRp(h2.bruto)}</b>${h2.pajak || h2.potong ? ` · setelah potongan <b>${_bopRp(h2.bersih)}</b>` : ""} <span class="${h2.bruto >= h.bruto ? "naik" : "turun"}">${h2.bruto >= h.bruto ? "▲" : "▼"} ${_bopRp(Math.abs(h2.bruto - h.bruto))} dari ${STATE.bopDataTahun}</span>`;
}
function _bopBarisDana(x, i) { return `<div class="bx-dana-baris"><input class="input" data-k="label" value="${escapeHtml(x.label || "")}" placeholder="Tahap"><input class="input" data-k="nominal" inputmode="numeric" value="${x.nominal ? formatRibuan(x.nominal) : ""}" placeholder="Nominal" oninput="this.value=formatRibuan(this.value)"><input class="input" type="date" data-k="tanggal" value="${x.tanggal || ""}" title="Tanggal cair (opsional)"><button type="button" class="kb-hapus" onclick="this.parentElement.remove()">✕</button></div>`; }
async function bopSimpanDana() {
  const r = _bopBacaRumus();
  if (!(r.siswaB * r.satuanB + r.siswaC * r.satuanC)) { toast("Isi jumlah santri & satuan biaya dulu", "err"); return; }
  BOPX.rencana.rumus = r;
  BOPX.rencana.dana = qsa(".bx-dana-baris").map((x) => ({ label: x.querySelector("[data-k=label]").value.trim(), nominal: Number(x.querySelector("[data-k=nominal]").value.replace(/\D/g, "")) || 0, tanggal: x.querySelector("[data-k=tanggal]").value || null })).filter((x) => x.nominal > 0);
  try { await _bopSimpanRencana(); closeModal(); toast(`🏦 Dana BOP ${STATE.bopDataTahun}: ${_bopRp(_bopDanaRumus(r).bersih)}`, "ok"); _bopGambar(); } catch (e) { toast("Gagal menyimpan: " + e.message, "err"); }
}
async function bopSimpanProyeksi() {
  const p = BOPX.proyeksi; if (!p) return;
  const th = String(STATE.bopDataTahun + 1);
  try {
    const semua = (await _kvAmbil("bop:rencana", {}).catch(() => ({}))) || {};
    semua[th] = { dana: [], pola: {}, ...(semua[th] || {}), rumus: p };
    await _kvSimpan("bop:rencana", semua); BOPX.rencanaSemua = semua;
    toast(`📌 Perkiraan dana BOP ${th} tersimpan: ${_bopRp(_bopDanaRumus(p).bersih)}`, "ok");
  } catch (e) { toast("Gagal: " + e.message, "err"); }
}

// ── TAMBAH ITEM (bisa banyak sekaligus) & ATUR POLA ──
function _bopFormPola(p, i, nama) {
  const blnOpsi = (v) => Array.from({ length: 12 }, (_, k) => `<option value="${k + 1}" ${k + 1 === v ? "selected" : ""}>${_bopBln(k + 1)}</option>`).join("");
  p = { pola: "rutin", mulai: 1, akhir: 12, ...p };
  return `<div class="bx-form" data-i="${i}">
    ${nama !== null ? `<input class="input bx-f-nama" placeholder="Nama item (mis. Snack, Internet, Honor tutor)" value="${escapeHtml(nama || "")}">` : ""}
    <div class="bx-f-pola">${["sekali", "dibagi", "rutin", "manual"].map((k) => `<label><input type="radio" name="bx-pola-${i}" value="${k}" ${p.pola === k ? "checked" : ""} onchange="_bopFormSegarkan(this)"><span>${_BOP_POLA[k].ikon} ${_BOP_POLA[k].label}</span></label>`).join("")}</div>
    <div class="bx-f-isi">
      <label class="bx-f-nom"><span class="lbl">${p.pola === "dibagi" ? "Total anggaran" : p.pola === "rutin" ? "Nominal per bulan" : "Nominal"}</span><input class="input" inputmode="numeric" value="${p.pola === "dibagi" ? (p.total ? formatRibuan(p.total) : "") : p.nominal ? formatRibuan(p.nominal) : ""}" oninput="this.value=formatRibuan(this.value);_bopFormSegarkan(this)"></label>
      <label class="bx-f-mulai"><span class="lbl">${p.pola === "sekali" ? "Bulan" : "Dari bulan"}</span><select class="input" onchange="_bopFormSegarkan(this)">${blnOpsi(p.mulai)}</select></label>
      <label class="bx-f-akhir" ${p.pola === "sekali" ? "hidden" : ""}><span class="lbl">Sampai</span><select class="input" onchange="_bopFormSegarkan(this)">${blnOpsi(p.akhir)}</select></label>
    </div>
    <div class="bx-f-pratinjau"></div>
  </div>`;
}
function _bopBacaForm(el) {
  const pola = el.querySelector("input[type=radio]:checked")?.value || "rutin";
  const nom = Number(el.querySelector(".bx-f-nom input").value.replace(/\D/g, "")) || 0;
  let mulai = Number(el.querySelector(".bx-f-mulai select").value), akhir = pola === "sekali" ? mulai : Number(el.querySelector(".bx-f-akhir select").value);
  if (akhir < mulai) [mulai, akhir] = [akhir, mulai];
  return { pola, mulai, akhir, ...(pola === "dibagi" ? { total: nom } : { nominal: nom }), nama: el.querySelector(".bx-f-nama")?.value.trim() };
}
function _bopFormSegarkan(input) {
  const el = input.closest(".bx-form"), p = _bopBacaForm(el);
  el.querySelector(".bx-f-akhir").hidden = p.pola === "sekali" || p.pola === "manual";
  el.querySelector(".bx-f-isi").hidden = p.pola === "manual";
  el.querySelector(".bx-f-nom .lbl").textContent = p.pola === "dibagi" ? "Total anggaran" : p.pola === "rutin" ? "Nominal per bulan" : "Nominal";
  el.querySelector(".bx-f-mulai .lbl").textContent = p.pola === "sekali" ? "Bulan" : "Dari bulan";
  const sebar = p.pola === "manual" ? null : _bopSebar(p), tot = sebar ? sebar.reduce((a, v) => a + v, 0) : 0;
  el.querySelector(".bx-f-pratinjau").innerHTML = p.pola === "manual" ? `<small>Nominal tiap bulan diisi sendiri lewat tab Setahun / ketuk sel bulan.</small>`
    : `<div class="bx-mini">${sebar.slice(1).map((v, k) => `<span class="${v ? "isi" : ""}" title="${_bopBln(k + 1)}">${_bopBlnPendek(k + 1)}<b>${v ? _bopRpS(v) : "–"}</b></span>`).join("")}</div><small>Total setahun: <b>${_bopRp(tot)}</b></small>`;
}
function bopTambahItem(bulan) {
  const awal = { pola: bulan ? "sekali" : "rutin", mulai: bulan || 1, akhir: 12 };
  openModal(`<h3>＋ Tambah item anggaran</h3>
    <div class="bx-sub">Bisa beberapa item sekaligus. Pilih polanya: <b>sekali habis</b>, <b>dibagi</b> ke beberapa bulan, atau <b>rutin</b> tiap bulan — nominal per bulan dihitung otomatis.</div>
    <div id="bx-form-daftar">${_bopFormPola(awal, 0, "")}</div>
    <button type="button" class="kb-tambah" onclick="const n=qsa('#bx-form-daftar .bx-form').length;qs('bx-form-daftar').insertAdjacentHTML('beforeend',_bopFormPola(${JSON.stringify(awal).replace(/"/g, "&quot;")},n,''));_bopFormSegarkan(qsa('#bx-form-daftar .bx-form')[n].querySelector('select'))">＋ Item lain</button>
    <button class="btn btn-accent" style="width:100%;margin-top:12px" onclick="bopSimpanItemBaru()">💾 Simpan item</button>`, { lebar: true });
  _bopFormSegarkan(qs("bx-form-daftar").querySelector("select"));
  setTimeout(() => qs("bx-form-daftar").querySelector(".bx-f-nama")?.focus(), 50);
}
async function _bopTerapkanPola(itemId, p) {
  const sebar = _bopSebar(p);
  const lama = {}; _BOP_CACHE.anggaran.filter((a) => a.item_id === itemId).forEach((a) => { lama[a.bulan] = Number(a.nominal) || 0; });
  for (let b = 1; b <= 12; b++) if ((lama[b] || 0) !== sebar[b]) await apiSimpanBopAnggaranBulan(itemId, STATE.bopDataTahun, b, sebar[b]);
}
async function bopSimpanItemBaru() {
  const forms = qsa("#bx-form-daftar .bx-form").map(_bopBacaForm).filter((p) => p.nama);
  if (!forms.length) { toast("Isi nama item dulu", "info"); return; }
  const kurang = forms.find((p) => p.pola !== "manual" && !(p.nominal || p.total));
  if (kurang) { toast(`Nominal "${kurang.nama}" belum diisi`, "err"); return; }
  setGlobalLoading(true, "Menyimpan item…");
  try {
    let urutan = (_BOP_CACHE.items[_BOP_CACHE.items.length - 1]?.urutan || 0);
    for (const p of forms) {
      const item = await apiTambahBopAnggaranItem(p.nama, ++urutan);
      if (p.pola !== "manual") await _bopTerapkanPola(item.id, p);
      const { nama, ...simpan } = p; BOPX.rencana.pola[item.id] = simpan;
    }
    await _bopSimpanRencana();
    closeModal(); toast(`✓ ${forms.length} item ditambahkan`, "ok");
  } catch (e) { toast("Gagal menyimpan: " + e.message, "err"); }
  finally { setGlobalLoading(false); }
  await _renderBopDataUI();
}
function bopAturPola(itemId) {
  const it = _BOP_CACHE.items.find((x) => x.id === itemId); if (!it) return;
  const p = _bopPolaItem(it, _bopHitung());
  openModal(`<h3>✏️ ${escapeHtml(it.nama)}</h3>
    <div class="bx-sub">Ubah nama atau pola anggaran ${STATE.bopDataTahun}. Belanja yang sudah dicatat tidak berubah.</div>
    <div id="bx-form-daftar">${_bopFormPola(p.tebak ? { ...p } : p, 0, it.nama)}</div>
    <button class="btn btn-accent" style="width:100%;margin-top:12px" onclick="bopSimpanPola('${itemId}')">💾 Simpan</button>`, { lebar: true });
  _bopFormSegarkan(qs("bx-form-daftar").querySelector("select"));
}
async function bopSimpanPola(itemId) {
  const p = _bopBacaForm(qs("bx-form-daftar").querySelector(".bx-form"));
  const it = _BOP_CACHE.items.find((x) => x.id === itemId);
  if (p.pola !== "manual" && !(p.nominal || p.total)) { toast("Nominal belum diisi", "err"); return; }
  setGlobalLoading(true, "Menyimpan…");
  try {
    if (p.nama && p.nama !== it.nama) await apiUbahBopAnggaranItem(itemId, { nama: p.nama });
    if (p.pola !== "manual") await _bopTerapkanPola(itemId, p);
    const { nama, ...simpan } = p; BOPX.rencana.pola[itemId] = simpan;
    await _bopSimpanRencana();
    closeModal(); toast("✓ Tersimpan", "ok");
  } catch (e) { toast("Gagal: " + e.message, "err"); }
  finally { setGlobalLoading(false); }
  await _renderBopDataUI();
}

// ── EKSPOR PDF (RAB berkop, A4 landscape — pedoman cetak sekolah) ──
async function bopEksporAnggaranPDF() {
  if (!_BOP_CACHE.items.length) { toast("Belum ada item anggaran untuk diekspor", "err"); return; }
  setGlobalLoading(true, "Menyiapkan PDF…");
  try {
    const p = await apiGetPengaturanSekolah(), H = _bopHitung(), th = STATE.bopDataTahun;
    const logo = p.logo_kiri_url || urlLogoSekolah(), lembaga = p.nama_lembaga_kop || "RUMAH TAHFIZH AL UMM PUTRA BARABAI";
    const td = "padding:4px 3px;border:0.6pt solid #8C9792;font-size:9pt;font-variant-numeric:tabular-nums;white-space:nowrap;";
    const st = !H.dana ? "Dana BOP belum diisi" : H.selisih < 0 ? `KURANG ${_bopRp(-H.selisih)}` : H.selisih > 0 ? `LEBIH ${_bopRp(H.selisih)}` : "PAS";
    const baris = _BOP_CACHE.items.map((it, i) => { const pl = _bopPolaItem(it, H); let t = 0;
      return `<tr style="background:${i % 2 ? "#EEF1EF" : "#fff"}"><td style="${td}text-align:center">${i + 1}</td><td style="${td}font-weight:600;white-space:normal">${escapeHtml(it.nama)}</td><td style="${td}font-size:8pt;color:#5B6470;white-space:normal">${escapeHtml(_BOP_POLA[pl.pola].label)}</td>${Array.from({ length: 12 }, (_, k) => { const v = H.ang[it.id + "_" + (k + 1)] || 0; t += v; return `<td style="${td}text-align:right">${v ? _bopRpS(v) : ""}</td>`; }).join("")}<td style="${td}text-align:right;font-weight:700">${_bopRpS(t)}</td></tr>`; }).join("");
    const html = `<div style="font-family:'Segoe UI',Arial,sans-serif;color:#1F2328;">
      <div style="display:flex;align-items:center;gap:14px;padding-bottom:8px;border-bottom:3px double #1F5A3D;">
        <img src="${logo}" style="width:60px;height:60px;object-fit:contain;">
        <div style="flex:1"><div style="font-size:13pt;font-weight:800;letter-spacing:1.5px;color:#1F5A3D">${escapeHtml(lembaga.toUpperCase())}</div>
          <div style="font-size:9pt;color:#5B6470">${escapeHtml(p.alamat || "Barabai, Hulu Sungai Tengah, Kalimantan Selatan")}</div></div>
      </div>
      <div style="text-align:center;margin:10px 0 8px"><div style="font-size:15pt;font-weight:800;color:#1B2A41">RENCANA ANGGARAN BELANJA (RAB) DANA BOP</div><div style="font-size:10.5pt;color:#5B6470">Tahun Anggaran ${th} · Penanggung jawab: Kepala Sekolah · angka dalam Rupiah</div></div>
      <table style="border-collapse:collapse;margin:0 0 10px;font-size:9.5pt"><tr>
        <td style="padding:4px 12px 4px 0">Dana BOP diterima</td><td style="padding:4px 18px 4px 0;font-weight:800">${_bopRp(H.dana)}</td>
        <td style="padding:4px 12px 4px 0">Total kebutuhan</td><td style="padding:4px 18px 4px 0;font-weight:800">${_bopRp(H.kebutuhan)}</td>
        <td style="padding:4px 12px 4px 0">Selisih</td><td style="padding:4px 0;font-weight:800">${st}</td></tr>
        ${H.rumus ? `<tr><td colspan="6" style="padding:2px 0;color:#1F2328;font-size:9pt">Perhitungan dana: Paket B ${BOPX.rencana.rumus.siswaB} santri × ${_bopRp(BOPX.rencana.rumus.satuanB)} = ${_bopRp(H.rumus.B)} · Paket C ${BOPX.rencana.rumus.siswaC} santri × ${_bopRp(BOPX.rencana.rumus.satuanC)} = ${_bopRp(H.rumus.C)} · Total ${_bopRp(H.rumus.bruto)}${H.rumus.pajak ? ` − pajak ${BOPX.rencana.rumus.pajak}% (${_bopRp(H.rumus.pajak)})` : ""}${H.rumus.potong ? ` − potongan ${_bopRp(H.rumus.potong)}` : ""}</td></tr>` : ""}
        ${(BOPX.rencana.dana || []).length ? `<tr><td colspan="6" style="padding:2px 0;color:#5B6470;font-size:8.5pt">Rincian dana:${BOPX.rencana.dana.map((d) => `${escapeHtml(d.label)} ${_bopRp(d.nominal)}${d.tanggal ? ` (${d.tanggal})` : ""}`).join(" · ")}</td></tr>` : ""}</table>
      <table style="width:100%;border-collapse:collapse;table-layout:fixed">
        <colgroup><col style="width:2.6%"><col style="width:12.4%"><col style="width:6.5%">${Array(12).fill('<col style="width:5.9%">').join("")}<col style="width:7.7%"></colgroup>
        <thead><tr style="background:#E3EAE6;color:#1B2A41">${["No", "Uraian / Item", "Pola", ...Array.from({ length: 12 }, (_, k) => _bopBlnPendek(k + 1)), "Jumlah (Rp)"].map((h, k) => `<th style="${td}font-weight:800;text-align:${k === 1 ? "left" : "center"}">${h}</th>`).join("")}</tr></thead>
        <tbody>${baris}</tbody>
        <tfoot><tr style="background:#E3EAE6;font-weight:800"><td colspan="3" style="${td}text-align:right">JUMLAH</td>${H.bulan.map((x) => `<td style="${td}text-align:right;font-size:8.5pt">${_bopRpS(x.rencana)}</td>`).join("")}<td style="${td}text-align:right;font-size:8.5pt">${_bopRpS(H.kebutuhan)}</td></tr></tfoot>
      </table>
      <div style="display:flex;justify-content:flex-end;margin-top:16px;break-inside:avoid">
        <div style="text-align:center;font-size:10pt;line-height:1.4;min-width:260px">
          <div>${escapeHtml(p.tempat_terbit || "Barabai")}, ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</div>
          <div>Penanggung Jawab BOP RT Putra,</div><div style="color:#5B6470">Kepala Sekolah</div>
          <div style="height:58px"></div>
          <div style="font-weight:800;text-decoration:underline">${escapeHtml(_namaPejabat(p) || "( ____________________ )")}</div>
        </div>
      </div>
      <div style="margin-top:12px;padding-top:4px;border-top:0.4pt solid #8C9792;font-size:7.5pt;color:#5B6470;display:flex;justify-content:space-between"><span>RAB BOP ${th} · ${escapeHtml(lembaga)}</span><span>Dicetak dari Aplikasi Guru Kelas</span></div>
    </div>`;
    eksporHtmlSebagaiPDF(`RAB BOP ${th}`, html, { landscape: true });
  } finally { setGlobalLoading(false); }
}
// ── EKSPOR EXCEL (RAB berkop; bisa diimpor ulang lewat "Impor Excel") ──
async function bopUnduhTemplateExcel() {
  if (typeof ExcelJS === "undefined") { toast("Pustaka Excel belum termuat, coba muat ulang halaman.", "err"); return; }
  setGlobalLoading(true, "Menyiapkan Excel…");
  try {
    const p = await apiGetPengaturanSekolah(), H = _bopHitung(), th = STATE.bopDataTahun;
    const lembaga = p.nama_lembaga_kop || "RUMAH TAHFIZH AL UMM PUTRA BARABAI";
    const wb = new ExcelJS.Workbook(), ws = wb.addWorksheet(`RAB BOP ${th}`, { pageSetup: { orientation: "landscape", paperSize: 9, fitToPage: true, fitToWidth: 1, fitToHeight: 0, margins: { left: 0.5, right: 0.5, top: 0.6, bottom: 0.6, header: 0.3, footer: 0.3 } }, views: [{ state: "frozen", ySplit: 9, xSplit: 2 }] });
    const N = 16, garis = { style: "thin", color: { argb: "FF8C9792" } }, kotak = { top: garis, bottom: garis, left: garis, right: garis };
    ws.mergeCells(1, 2, 1, N); Object.assign(ws.getCell(1, 2), { value: lembaga.toUpperCase(), font: { bold: true, size: 14, color: { argb: "FF1F5A3D" } } });
    ws.mergeCells(2, 2, 2, N); Object.assign(ws.getCell(2, 2), { value: p.alamat || "Barabai, Hulu Sungai Tengah, Kalimantan Selatan", font: { size: 9, color: { argb: "FF5B6470" } } });
    ws.mergeCells(4, 1, 4, N); Object.assign(ws.getCell(4, 1), { value: "RENCANA ANGGARAN BELANJA (RAB) DANA BOP", font: { bold: true, size: 14, color: { argb: "FF1B2A41" } }, alignment: { horizontal: "center" } });
    ws.mergeCells(5, 1, 5, N); Object.assign(ws.getCell(5, 1), { value: `Tahun Anggaran ${th} · Penanggung jawab: Kepala Sekolah`, font: { size: 10, color: { argb: "FF5B6470" } }, alignment: { horizontal: "center" } });
    ws.getRow(3).border = {}; for (let c = 1; c <= N; c++) ws.getCell(3, c).border = { bottom: { style: "double", color: { argb: "FF1F5A3D" } } };
    const st = !H.dana ? "Dana belum diisi" : H.selisih < 0 ? `KURANG ${_bopRp(-H.selisih)}` : H.selisih > 0 ? `LEBIH ${_bopRp(H.selisih)}` : "PAS";
    ws.getRow(7).values = ["", "Dana BOP", H.dana, "", "Total kebutuhan", "", H.kebutuhan, "", "Selisih", "", st];
    [3, 7].forEach((c) => { ws.getCell(7, c).numFmt = '"Rp "#,##0'; ws.getCell(7, c).font = { bold: true }; }); ws.getCell(7, 11).font = { bold: true };
    if (H.rumus) { const r = BOPX.rencana.rumus; ws.mergeCells(8, 2, 8, N); Object.assign(ws.getCell(8, 2), { value: `Perhitungan dana: Paket B ${r.siswaB} santri × ${_bopRp(r.satuanB)} = ${_bopRp(H.rumus.B)} · Paket C ${r.siswaC} santri × ${_bopRp(r.satuanC)} = ${_bopRp(H.rumus.C)} · Total ${_bopRp(H.rumus.bruto)}${H.rumus.pajak ? ` − pajak ${r.pajak}%` : ""}${H.rumus.potong ? ` − potongan ${_bopRp(H.rumus.potong)}` : ""}`, font: { size: 9, color: { argb: "FF5B6470" } } }); }
    try {
      const logoUrl = p.logo_kiri_url || urlLogoSekolah();
      const buf = await (await fetch(logoUrl)).arrayBuffer();
      ws.addImage(wb.addImage({ buffer: buf, extension: /\.jpe?g(\?|$)/i.test(logoUrl) ? "jpeg" : "png" }), { tl: { col: 0.15, row: 0.1 }, ext: { width: 46, height: 46 } });
    } catch (e) { console.warn("Logo dilewati:", e.message); }
    const kepala = ws.getRow(9);
    kepala.values = ["No", "Nama Item", "Pola", ...NAMA_BULAN_KALDIK.slice(1), "Jumlah"];
    kepala.eachCell((c) => { c.font = { bold: true, color: { argb: "FF1B2A41" } }; c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE3EAE6" } }; c.alignment = { horizontal: "center", vertical: "middle" }; c.border = kotak; });
    kepala.height = 20;
    _BOP_CACHE.items.forEach((it, i) => {
      const nilai = Array.from({ length: 12 }, (_, k) => H.ang[it.id + "_" + (k + 1)] || 0);
      const r = ws.addRow([i + 1, it.nama, _BOP_POLA[_bopPolaItem(it, H).pola].label, ...nilai, nilai.reduce((a, v) => a + v, 0)]);
      r.eachCell({ includeEmpty: true }, (c, col) => { c.border = kotak; if (i % 2) c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFEEF1EF" } }; if (col >= 4) { c.numFmt = "#,##0"; c.alignment = { horizontal: "right" }; } if (col === 1) c.alignment = { horizontal: "center" }; if (col === 16) c.font = { bold: true }; });
    });
    const tot = ws.addRow(["JUMLAH", "", "", ...H.bulan.map((x) => x.rencana), H.kebutuhan]);
    ws.mergeCells(tot.number, 1, tot.number, 3);
    tot.eachCell({ includeEmpty: true }, (c, col) => { c.font = { bold: true }; c.border = kotak; c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE3EAE6" } }; if (col >= 4) c.numFmt = "#,##0"; });
    const ttd = tot.number + 2;
    [[`${p.tempat_terbit || "Barabai"}, ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`, false], ["Penanggung Jawab BOP RT Putra,", false], ["Kepala Sekolah", false], ["", false], ["", false], ["", false], [_namaPejabat(p) || "( ____________________ )", true]].forEach(([t, tebal], k) => {
      ws.mergeCells(ttd + k, 12, ttd + k, 16); Object.assign(ws.getCell(ttd + k, 12), { value: t, alignment: { horizontal: "center" }, font: { bold: tebal, underline: tebal } });
    });
    ws.getColumn(1).width = 6; ws.getColumn(2).width = 28; ws.getColumn(3).width = 16;
    for (let c = 4; c <= 15; c++) ws.getColumn(c).width = 12; ws.getColumn(16).width = 15;
    const buf = await wb.xlsx.writeBuffer();
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
    a.download = `RAB BOP ${th}.xlsx`; document.body.appendChild(a); a.click(); a.remove();
    toast("📊 Excel RAB terunduh — bisa diedit lalu diimpor ulang lewat 'Impor Excel'", "ok");
  } catch (e) { console.error(e); toast("Gagal membuat Excel: " + e.message, "err"); }
  finally { setGlobalLoading(false); }
}

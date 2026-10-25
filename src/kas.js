// ============================================================
//  MODUL: KAS BENDAHARA — pencatatan uang masuk & keluar
//  Tabel: kas_akun (kas tunai / rekening), kas_kategori (+anggaran bulanan), kas_transaksi
//  (masuk / keluar / transfer antar akun, bukti foto, nomor bukti otomatis, soft-delete untuk jejak
//  audit). Akses: admin utama, guru berjabatan Bendahara, atau Admin Kedua yang diberi menu "kas".
//  Semua query terisolasi (gagal = pesan ramah), jadi kalau SQL belum dijalankan fitur lain tetap aman.
// ============================================================

const KAS = { akun: [], kategori: [], semua: [], bulan: null, tab: "ringkasan", filter: { jenis: "", kategori: "", akun: "", cari: "" }, siap: false, galat: "" };
const KAS_IKON_PILIHAN = ["💰", "🎓", "🤲", "🏛️", "🎁", "📥", "👨‍🏫", "🍱", "✏️", "💡", "🛠️", "⚽", "🚌", "🧾", "📤", "🏠", "📚", "🩺", "📱", "🕌"];
const KAS_WARNA_PILIHAN = ["#2f8f5b", "#1546a8", "#7b55c7", "#cf8317", "#c2453d", "#0f8b8d", "#b4467d", "#5a6683"];

function isBendahara() {
  if (isAdmin()) return true;
  const baru = typeof _jabatanGuru === "function" ? _jabatanGuru(STATE.guruId) : [];
  if (baru.length) return baru.some((j) => j.kode === "bendahara");
  const g = (LOOKUP.guruAll || []).find((x) => x.id === STATE.guruId);
  return String(g?.jabatan || "").toLowerCase().includes("bendahara");
}
function bisaAksesKas() { return isBendahara() || adaAksesModul("kas"); }
// Penanggung jawab Kas = guru berjabatan Bendahara di Data Guru (Ryan Nugroho). SENGAJA terpisah dari
// "Nama Bendahara" di Pengaturan Kop Surat — itu dipakai tanda tangan Slip Gaji dan tidak diubah di sini.
function _namaPjKas() {
  const g = typeof _guruDenganJabatan === "function" ? _guruDenganJabatan("bendahara") : null;
  if (g?.nama) return g.nama;
  const ryan = (LOOKUP.guruAll || []).find((x) => /^ryan nugroho/i.test(x.nama || ""));
  return ryan?.nama || "Ryan Nugroho, S.H., M.A";
}

// ── API ─────────────────────────────────────────────────────
function _kasPesanGalat(e) {
  const m = String(e?.message || e || "");
  if (/relation .* does not exist|could not find the table|schema cache/i.test(m)) return "Tabel Kas belum ada — jalankan dulu SQL migrasi (SQL_JABATAN_DAN_KAS.sql) di Supabase.";
  if (/row-level security/i.test(m)) return "Akses tabel Kas masih dikunci (RLS) — jalankan ulang SQL migrasi Kas.";
  return m;
}
async function kasMuatMaster() {
  const [a, k] = await Promise.all([
    supa.from("kas_akun").select("*").eq("aktif", true).order("urutan"),
    supa.from("kas_kategori").select("*").eq("aktif", true).order("jenis").order("urutan"),
  ]);
  if (a.error) throw a.error;
  if (k.error) throw k.error;
  KAS.akun = a.data || []; KAS.kategori = k.data || [];
}
async function kasMuatTransaksi() {
  const semua = [];
  for (let dari = 0; ; dari += 1000) {
    const { data, error } = await supa.from("kas_transaksi").select("*").eq("dihapus", false)
      .order("tanggal", { ascending: false }).order("dibuat_at", { ascending: false }).range(dari, dari + 999);
    if (error) throw error;
    semua.push(...(data || []));
    if (!data || data.length < 1000) break;
  }
  KAS.semua = semua;
}
async function kasSimpanTransaksiApi(row) {
  if (row.id) {
    const { data, error } = await supa.from("kas_transaksi").update({ ...row, diubah_at: new Date().toISOString() }).eq("id", row.id).select();
    if (error) throw error; return data[0];
  }
  const { data, error } = await supa.from("kas_transaksi").insert(row).select();
  if (error) throw error; return data[0];
}
async function kasHapusTransaksiApi(id, dihapus = true) {
  const { error } = await supa.from("kas_transaksi").update({ dihapus, diubah_at: new Date().toISOString() }).eq("id", id);
  if (error) throw error;
}
async function kasSimpanMaster(tabel, row) {
  const q = row.id ? supa.from(tabel).update(row).eq("id", row.id) : supa.from(tabel).insert(row);
  const { data, error } = await q.select();
  if (error) throw error; return data[0];
}

// ── HITUNGAN ────────────────────────────────────────────────
const _kasRp = (n) => formatRupiah(Math.round(Number(n) || 0));
const _kasKat = (id) => KAS.kategori.find((k) => k.id === id);
const _kasAkun = (id) => KAS.akun.find((a) => a.id === id);
function kasSaldoAkun(akunId, sampaiTanggal = null) {
  const akun = _kasAkun(akunId);
  let saldo = Number(akun?.saldo_awal) || 0;
  KAS.semua.forEach((t) => {
    if (sampaiTanggal && t.tanggal > sampaiTanggal) return;
    const n = Number(t.nominal) || 0;
    if (t.jenis === "masuk" && t.akun_id === akunId) saldo += n;
    if (t.jenis === "keluar" && t.akun_id === akunId) saldo -= n;
    if (t.jenis === "transfer") { if (t.akun_id === akunId) saldo -= n; if (t.akun_tujuan_id === akunId) saldo += n; }
  });
  return saldo;
}
function kasTotalSaldo(sampai = null) { return KAS.akun.reduce((s, a) => s + kasSaldoAkun(a.id, sampai), 0); }
function kasTransaksiBulan(bulanYM) { return KAS.semua.filter((t) => t.tanggal?.startsWith(bulanYM)); }
function kasRingkasBulan(bulanYM) {
  const rows = kasTransaksiBulan(bulanYM);
  const masuk = rows.filter((t) => t.jenis === "masuk").reduce((s, t) => s + Number(t.nominal), 0);
  const keluar = rows.filter((t) => t.jenis === "keluar").reduce((s, t) => s + Number(t.nominal), 0);
  return { masuk, keluar, selisih: masuk - keluar, jumlah: rows.length };
}
function _kasGeserBulan(bulanYM, n) {
  const [y, m] = bulanYM.split("-").map(Number);
  const d = new Date(y, m - 1 + n, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
function _kasNamaBulanPendek(bulanYM) {
  const [y, m] = bulanYM.split("-").map(Number);
  return ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"][m - 1] + " " + String(y).slice(2);
}
function _kasPersenUbah(kini, lalu) {
  if (!lalu) return kini ? null : 0;
  return Math.round(((kini - lalu) / lalu) * 100);
}

// ── HALAMAN ─────────────────────────────────────────────────
async function renderKasInit() {
  const root = qs("kas-root");
  if (!root) return;
  await ensureLookups();
  if (!bisaAksesKas()) { root.innerHTML = `<div class="card">${htmlKosong("🔒", "Khusus Bendahara & Admin", "Menu ini hanya untuk Bendahara dan Admin.")}</div>`; return; }
  if (!KAS.bulan) KAS.bulan = bulanIniISO();
  root.innerHTML = loadingHTML("Memuat kas...");
  try {
    await kasMuatMaster();
    await kasMuatTransaksi();
    KAS.siap = true; KAS.galat = "";
  } catch (e) {
    KAS.siap = false; KAS.galat = _kasPesanGalat(e);
  }
  renderKas();
}
function renderKas() {
  const root = qs("kas-root");
  if (!root) return;
  if (!KAS.siap) {
    root.innerHTML = `<div class="card">${htmlKosong("🧰", "Kas Bendahara belum siap", escapeHtml(KAS.galat || "Jalankan SQL migrasi Kas dulu."), `<button class="btn btn-ghost" onclick="renderKasInit()">🔄 Coba lagi</button>`)}</div>`;
    return;
  }
  const tabs = [["ringkasan", "📊 Ringkasan"], ["transaksi", "🧾 Transaksi"], ["buku", "📒 Buku Kas"], ["laporan", "🖨️ Laporan"], ["atur", "⚙️ Atur"]];
  root.innerHTML = `
    <div class="kas-kepala">
      <div>
        <div class="kas-judul">💼 Kas Bendahara</div>
        <div class="kas-sub">Penanggung jawab: <b>${escapeHtml(_namaPjKas())}</b></div>
      </div>
      <div class="kas-kepala-aksi">
        <div class="kas-bulan">
          <button type="button" onclick="kasGantiBulan(-1)" aria-label="Bulan sebelumnya">‹</button>
          <input type="month" value="${KAS.bulan}" onchange="KAS.bulan=this.value;renderKas()" aria-label="Bulan"/>
          <button type="button" onclick="kasGantiBulan(1)" aria-label="Bulan berikutnya">›</button>
        </div>
        <button class="btn kas-btn-masuk" onclick="bukaFormKas('masuk')">＋ Uang Masuk</button>
        <button class="btn kas-btn-keluar" onclick="bukaFormKas('keluar')">－ Uang Keluar</button>
      </div>
    </div>
    <div class="pg-tab-bar kas-tab" role="tablist">${tabs.map(([k, l]) => `<button type="button" class="${KAS.tab === k ? "aktif" : ""}" onclick="KAS.tab='${k}';renderKas()">${l}</button>`).join("")}</div>
    <div id="kas-isi"></div>
    <button type="button" class="kas-fab" onclick="bukaPilihJenisKas()" aria-label="Catat transaksi">＋</button>
  `;
  const isi = qs("kas-isi");
  if (KAS.tab === "ringkasan") isi.innerHTML = (!KAS.semua.length && KAS.akun.length ? `<div class="kas-transisi">
      <span>📥</span><div><b>Mulai dari pembukuan lama?</b><small>Impor laporan kas Excel yang selama ini dipakai — saldo awal & semua transaksinya langsung masuk.</small></div>
      <button class="btn btn-accent" onclick="kasPilihFileImpor()">Impor Excel</button></div>` : "") + htmlKasRingkasan();
  else if (KAS.tab === "transaksi") isi.innerHTML = htmlKasTransaksi();
  else if (KAS.tab === "buku") isi.innerHTML = htmlKasBuku();
  else if (KAS.tab === "laporan") isi.innerHTML = htmlKasLaporan();
  else isi.innerHTML = htmlKasAtur();
  if (KAS.tab === "ringkasan") setTimeout(() => qsa("#kas-isi [data-hitung]").forEach((el) => {
    const target = Number(el.dataset.hitung) || 0, t0 = performance.now();
    (function langkah(t) { const p = Math.min(1, (t - t0) / 700); el.textContent = _kasRp(target * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(langkah); })(t0);
  }), 30);
}
function kasGantiBulan(n) { KAS.bulan = _kasGeserBulan(KAS.bulan, n); renderKas(); }

// ── TAB RINGKASAN ───────────────────────────────────────────
function htmlKasRingkasan() {
  if (!KAS.akun.length) return `<div class="card">${htmlKosong("🏦", "Belum ada akun kas", "Tambahkan dulu Kas Tunai / rekening bank beserta saldo awalnya.", `<button class="btn btn-accent" onclick="KAS.tab='atur';renderKas()">⚙️ Atur Akun</button>`)}</div>`;
  const akhirBulan = (() => { const [y, m] = KAS.bulan.split("-").map(Number); return tanggalISO(new Date(y, m, 0)); })();
  const kini = kasRingkasBulan(KAS.bulan), lalu = kasRingkasBulan(_kasGeserBulan(KAS.bulan, -1));
  const pMasuk = _kasPersenUbah(kini.masuk, lalu.masuk), pKeluar = _kasPersenUbah(kini.keluar, lalu.keluar);
  const chipUbah = (p, kebalik) => p === null ? `<span class="kas-ubah">baru</span>` : `<span class="kas-ubah ${(p >= 0) !== !!kebalik ? "naik" : "turun"}">${p >= 0 ? "▲" : "▼"} ${Math.abs(p)}% vs bln lalu</span>`;
  const saldo = kasTotalSaldo(akhirBulan);
  // Arus kas 6 bulan
  const bulan6 = Array.from({ length: 6 }, (_, i) => _kasGeserBulan(KAS.bulan, i - 5));
  const data6 = bulan6.map((b) => ({ b, ...kasRingkasBulan(b) }));
  const maks = Math.max(1, ...data6.map((d) => Math.max(d.masuk, d.keluar)));
  const grafik = `<svg viewBox="0 0 360 170" class="kas-grafik" role="img" aria-label="Grafik arus kas 6 bulan">
    ${[0, 0.25, 0.5, 0.75, 1].map((f) => `<line x1="30" x2="355" y1="${140 - f * 120}" y2="${140 - f * 120}" class="kas-grid"/>`).join("")}
    ${data6.map((d, i) => {
      const x = 40 + i * 53, hM = (d.masuk / maks) * 120, hK = (d.keluar / maks) * 120;
      return `<g><rect x="${x}" y="${140 - hM}" width="18" height="${hM}" rx="4" class="kas-bar-masuk"><title>Masuk ${_kasRp(d.masuk)}</title></rect>
        <rect x="${x + 21}" y="${140 - hK}" width="18" height="${hK}" rx="4" class="kas-bar-keluar"><title>Keluar ${_kasRp(d.keluar)}</title></rect>
        <text x="${x + 19}" y="158" text-anchor="middle" class="kas-label${d.b === KAS.bulan ? " aktif" : ""}">${_kasNamaBulanPendek(d.b)}</text></g>`;
    }).join("")}
  </svg>`;
  // Pengeluaran per kategori (donut)
  const perKat = {};
  kasTransaksiBulan(KAS.bulan).filter((t) => t.jenis === "keluar").forEach((t) => { perKat[t.kategori_id] = (perKat[t.kategori_id] || 0) + Number(t.nominal); });
  const katArr = Object.entries(perKat).map(([id, n]) => ({ k: _kasKat(id), n })).sort((a, b) => b.n - a.n);
  let sudut = 0;
  const R = 52, K = 2 * Math.PI * R;
  const donut = katArr.length ? `<svg viewBox="0 0 140 140" class="kas-donut">
      <circle cx="70" cy="70" r="${R}" fill="none" stroke="var(--nl)" stroke-width="18"/>
      ${katArr.map(({ k, n }) => { const pj = (n / kini.keluar) * K; const s = `<circle cx="70" cy="70" r="${R}" fill="none" stroke="${k?.warna || "#5a6683"}" stroke-width="18" stroke-dasharray="${pj} ${K - pj}" stroke-dashoffset="${-sudut}" transform="rotate(-90 70 70)"><title>${escapeHtml(k?.nama || "-")}: ${_kasRp(n)}</title></circle>`; sudut += pj; return s; }).join("")}
      <text x="70" y="66" text-anchor="middle" class="kas-donut-kecil">Keluar</text>
      <text x="70" y="84" text-anchor="middle" class="kas-donut-besar">${katArr.length} kategori</text>
    </svg>
    <div class="kas-legenda">${katArr.map(({ k, n }) => `<div><span style="background:${k?.warna || "#5a6683"}"></span>${k?.ikon || ""} ${escapeHtml(k?.nama || "-")}<b>${Math.round((n / kini.keluar) * 100)}%</b></div>`).join("")}</div>`
    : htmlKosong("🍃", "Belum ada pengeluaran bulan ini");
  // Anggaran vs realisasi
  const anggaran = KAS.kategori.filter((k) => k.jenis === "keluar" && Number(k.anggaran_bulanan) > 0).map((k) => {
    const pakai = perKat[k.id] || 0, batas = Number(k.anggaran_bulanan), persen = Math.round((pakai / batas) * 100);
    return `<div class="kas-anggaran">
      <div class="kas-anggaran-atas"><span>${k.ikon || ""} ${escapeHtml(k.nama)}</span><span>${_kasRp(pakai)} / ${_kasRp(batas)}</span></div>
      <div class="kas-meter"><span class="${persen >= 100 ? "lewat" : persen >= 80 ? "hampir" : ""}" style="width:${Math.min(100, persen)}%"></span></div>
      <div class="kas-anggaran-ket">${persen >= 100 ? `⚠️ Melebihi anggaran ${persen - 100}%` : `${100 - persen}% tersisa`}</div>
    </div>`;
  }).join("");
  const terbaru = KAS.semua.slice(0, 6);
  return `
    <div class="kas-hero">
      <div class="kas-hero-label">Total saldo per ${_tglPendek(akhirBulan)}</div>
      <div class="kas-hero-saldo" data-hitung="${saldo}">${_kasRp(saldo)}</div>
      <div class="kas-akun-row">${KAS.akun.map((a) => `<div class="kas-akun-chip"><span>${a.jenis === "bank" ? "🏦" : a.jenis === "ewallet" ? "📱" : "💵"} ${escapeHtml(a.nama)}</span><b>${_kasRp(kasSaldoAkun(a.id, akhirBulan))}</b></div>`).join("")}</div>
    </div>
    <div class="kas-stat-grid">
      <div class="kas-stat masuk"><div class="kas-stat-label">Uang Masuk · ${namaBulanIndo(KAS.bulan)}</div><div class="kas-stat-nilai" data-hitung="${kini.masuk}">${_kasRp(kini.masuk)}</div>${chipUbah(pMasuk)}</div>
      <div class="kas-stat keluar"><div class="kas-stat-label">Uang Keluar · ${namaBulanIndo(KAS.bulan)}</div><div class="kas-stat-nilai" data-hitung="${kini.keluar}">${_kasRp(kini.keluar)}</div>${chipUbah(pKeluar, true)}</div>
      <div class="kas-stat ${kini.selisih >= 0 ? "surplus" : "defisit"}"><div class="kas-stat-label">${kini.selisih >= 0 ? "Surplus" : "Defisit"} bulan ini</div><div class="kas-stat-nilai">${_kasRp(Math.abs(kini.selisih))}</div><span class="kas-ubah">${kini.jumlah} transaksi</span></div>
    </div>
    <div class="kas-dua">
      <div class="card"><div class="kas-kartu-judul">📈 Arus Kas 6 Bulan <span class="kas-kunci"><i class="m"></i>Masuk <i class="k"></i>Keluar</span></div>${grafik}</div>
      <div class="card"><div class="kas-kartu-judul">🍩 Pengeluaran per Kategori</div><div class="kas-donut-wrap">${donut}</div></div>
    </div>
    ${anggaran ? `<div class="card" style="margin-top:14px;"><div class="kas-kartu-judul">🎯 Anggaran vs Realisasi · ${namaBulanIndo(KAS.bulan)}</div><div class="kas-anggaran-grid">${anggaran}</div></div>` : ""}
    <div class="card" style="margin-top:14px;">
      <div class="kas-kartu-judul">🕑 Transaksi Terbaru <button class="btn btn-ghost" style="margin-left:auto;padding:5px 12px;font-size:11px;" onclick="KAS.tab='transaksi';renderKas()">Lihat semua →</button></div>
      ${terbaru.length ? terbaru.map(htmlKasBaris).join("") : htmlKosong("🧾", "Belum ada transaksi", "Catat uang masuk atau keluar pertama lewat tombol di atas.")}
    </div>`;
}

// ── BARIS TRANSAKSI (dipakai di beberapa tab) ───────────────
function htmlKasBaris(t) {
  const k = _kasKat(t.kategori_id), a = _kasAkun(t.akun_id), tj = _kasAkun(t.akun_tujuan_id);
  const tanda = t.jenis === "masuk" ? "+" : t.jenis === "keluar" ? "−" : "⇄";
  const judul = t.jenis === "transfer" ? `Transfer ${escapeHtml(a?.nama || "-")} → ${escapeHtml(tj?.nama || "-")}` : escapeHtml(k?.nama || "Tanpa kategori");
  return `<div class="kas-baris" onclick="bukaDetailKas('${t.id}')" role="button" tabindex="0">
    <span class="kas-baris-ikon" style="background:${(k?.warna || "#5a6683")}22;color:${k?.warna || "#5a6683"};">${t.jenis === "transfer" ? "🔁" : (k?.ikon || "•")}</span>
    <div class="kas-baris-isi">
      <b>${judul}</b>
      <div>${_tglPendek(t.tanggal)}${t.pihak ? " · " + escapeHtml(t.pihak) : ""}${t.keterangan ? " · " + escapeHtml(t.keterangan) : ""}</div>
      <div class="kas-baris-meta">${escapeHtml(t.nomor_bukti || "")}${t.jenis !== "transfer" && a ? " · " + escapeHtml(a.nama) : ""}${t.bukti_url ? " · 📎 bukti" : ""}</div>
    </div>
    <div class="kas-baris-nominal ${t.jenis}">${tanda} ${_kasRp(t.nominal)}</div>
  </div>`;
}

// ── TAB TRANSAKSI ───────────────────────────────────────────
function _kasTransaksiTerfilter() {
  const f = KAS.filter, q = (f.cari || "").toLowerCase().trim();
  return kasTransaksiBulan(KAS.bulan).filter((t) => (!f.jenis || t.jenis === f.jenis) && (!f.kategori || t.kategori_id === f.kategori)
    && (!f.akun || t.akun_id === f.akun || t.akun_tujuan_id === f.akun)
    && (!q || [t.keterangan, t.pihak, t.nomor_bukti, _kasKat(t.kategori_id)?.nama].some((x) => String(x || "").toLowerCase().includes(q))));
}
function htmlKasTransaksi() {
  const f = KAS.filter, rows = _kasTransaksiTerfilter();
  const masuk = rows.filter((t) => t.jenis === "masuk").reduce((s, t) => s + Number(t.nominal), 0);
  const keluar = rows.filter((t) => t.jenis === "keluar").reduce((s, t) => s + Number(t.nominal), 0);
  const grup = {};
  rows.forEach((t) => { (grup[t.tanggal] = grup[t.tanggal] || []).push(t); });
  return `<div class="card">
    <div class="riwayat-filter">
      <input class="input" style="min-width:170px;flex:1;" placeholder="🔎 Cari keterangan, pihak, no. bukti..." value="${escapeHtml(f.cari)}" oninput="KAS.filter.cari=this.value;clearTimeout(window._kasCariT);window._kasCariT=setTimeout(()=>{renderKas();const i=document.querySelector('#kas-isi input');if(i){i.focus();i.setSelectionRange(i.value.length,i.value.length);}},350)"/>
      <select class="input" onchange="KAS.filter.jenis=this.value;renderKas()"><option value="">Semua jenis</option><option value="masuk" ${f.jenis === "masuk" ? "selected" : ""}>Uang Masuk</option><option value="keluar" ${f.jenis === "keluar" ? "selected" : ""}>Uang Keluar</option><option value="transfer" ${f.jenis === "transfer" ? "selected" : ""}>Transfer</option></select>
      <select class="input" onchange="KAS.filter.kategori=this.value;renderKas()"><option value="">Semua kategori</option>${KAS.kategori.map((k) => `<option value="${k.id}" ${f.kategori === k.id ? "selected" : ""}>${k.ikon || ""} ${escapeHtml(k.nama)}</option>`).join("")}</select>
      <select class="input" onchange="KAS.filter.akun=this.value;renderKas()"><option value="">Semua akun</option>${KAS.akun.map((a) => `<option value="${a.id}" ${f.akun === a.id ? "selected" : ""}>${escapeHtml(a.nama)}</option>`).join("")}</select>
    </div>
    <div class="kas-total-filter"><span>${rows.length} transaksi</span><span class="masuk">+ ${_kasRp(masuk)}</span><span class="keluar">− ${_kasRp(keluar)}</span></div>
    ${rows.length ? Object.entries(grup).map(([tgl, list]) => `<div class="kas-grup-tgl">${_tglPendek(tgl)}</div>${list.map(htmlKasBaris).join("")}`).join("")
      : htmlKosong("🔍", "Tidak ada transaksi", `Belum ada transaksi yang cocok di ${namaBulanIndo(KAS.bulan)}.`, `<button class="btn btn-ghost" onclick="bukaPilihJenisKas()">＋ Catat Transaksi</button>`)}
  </div>`;
}

// ── TAB BUKU KAS (saldo berjalan) ───────────────────────────
function _kasBarisBuku(akunId) {
  const [y, m] = KAS.bulan.split("-").map(Number);
  const awalBulan = `${KAS.bulan}-01`;
  const sebelum = tanggalISO(new Date(y, m - 1, 0));
  const pakaiAkun = akunId ? [akunId] : KAS.akun.map((a) => a.id);
  let saldo = pakaiAkun.reduce((s, id) => s + kasSaldoAkun(id, sebelum), 0);
  const saldoAwal = saldo;
  const rows = kasTransaksiBulan(KAS.bulan)
    .filter((t) => !akunId || t.akun_id === akunId || t.akun_tujuan_id === akunId)
    .filter((t) => akunId || t.jenis !== "transfer")
    .sort((a, b) => a.tanggal.localeCompare(b.tanggal) || String(a.dibuat_at).localeCompare(String(b.dibuat_at)))
    .map((t) => {
      let debit = 0, kredit = 0;
      if (t.jenis === "masuk") debit = Number(t.nominal);
      else if (t.jenis === "keluar") kredit = Number(t.nominal);
      else if (t.akun_tujuan_id === akunId) debit = Number(t.nominal); else kredit = Number(t.nominal);
      saldo += debit - kredit;
      return { t, debit, kredit, saldo };
    });
  return { awalBulan, saldoAwal, rows, saldoAkhir: saldo };
}
function htmlKasBuku() {
  const akunId = KAS.filter.bukuAkun || "";
  const { saldoAwal, rows, saldoAkhir } = _kasBarisBuku(akunId);
  const totD = rows.reduce((s, r) => s + r.debit, 0), totK = rows.reduce((s, r) => s + r.kredit, 0);
  return `<div class="card">
    <div class="riwayat-filter">
      <select class="input" onchange="KAS.filter.bukuAkun=this.value;renderKas()"><option value="">Semua akun (gabungan)</option>${KAS.akun.map((a) => `<option value="${a.id}" ${akunId === a.id ? "selected" : ""}>${escapeHtml(a.nama)}</option>`).join("")}</select>
      <span class="riwayat-hitung">Buku Kas ${namaBulanIndo(KAS.bulan)}</span>
      <button class="btn btn-ghost" style="margin-left:auto;padding:6px 12px;font-size:11.5px;" onclick="eksporLaporanKas('pdf')">🖨️ Cetak PDF</button>
    </div>
    <div style="overflow-x:auto;">
    <table class="simple-table kas-buku">
      <thead><tr><th>Tanggal</th><th>No. Bukti</th><th>Uraian</th><th style="text-align:right;">Masuk (Debit)</th><th style="text-align:right;">Keluar (Kredit)</th><th style="text-align:right;">Saldo</th></tr></thead>
      <tbody>
        <tr class="kas-buku-awal"><td colspan="5">Saldo awal ${namaBulanIndo(KAS.bulan)}</td><td style="text-align:right;">${_kasRp(saldoAwal)}</td></tr>
        ${rows.map(({ t, debit, kredit, saldo }) => `<tr onclick="bukaDetailKas('${t.id}')" style="cursor:pointer;">
          <td style="white-space:nowrap;">${_tglPendek(t.tanggal)}</td><td style="white-space:nowrap;">${escapeHtml(t.nomor_bukti || "-")}</td>
          <td>${t.jenis === "transfer" ? "🔁 Transfer" : escapeHtml(_kasKat(t.kategori_id)?.nama || "-")}${t.keterangan ? ` — ${escapeHtml(t.keterangan)}` : ""}</td>
          <td style="text-align:right;color:var(--ok);">${debit ? _kasRp(debit) : ""}</td><td style="text-align:right;color:var(--bad);">${kredit ? _kasRp(kredit) : ""}</td>
          <td style="text-align:right;font-weight:700;">${_kasRp(saldo)}</td></tr>`).join("")}
        <tr class="kas-buku-akhir"><td colspan="3">Jumlah & saldo akhir</td><td style="text-align:right;">${_kasRp(totD)}</td><td style="text-align:right;">${_kasRp(totK)}</td><td style="text-align:right;">${_kasRp(saldoAkhir)}</td></tr>
      </tbody>
    </table></div>
  </div>`;
}

// ── TAB LAPORAN ─────────────────────────────────────────────
function htmlKasLaporan() {
  const r = kasRingkasBulan(KAS.bulan);
  const [y] = KAS.bulan.split("-").map(Number);
  const tahunan = Array.from({ length: 12 }, (_, i) => ({ b: `${y}-${String(i + 1).padStart(2, "0")}`, ...kasRingkasBulan(`${y}-${String(i + 1).padStart(2, "0")}`) }));
  const totM = tahunan.reduce((s, d) => s + d.masuk, 0), totK = tahunan.reduce((s, d) => s + d.keluar, 0);
  return `<div class="kas-dua">
    <div class="card">
      <div class="kas-kartu-judul">🖨️ Laporan Bulanan · ${namaBulanIndo(KAS.bulan)}</div>
      <div class="kas-lap-baris"><span>Saldo awal</span><b>${_kasRp(_kasBarisBuku("").saldoAwal)}</b></div>
      <div class="kas-lap-baris masuk"><span>Total uang masuk</span><b>+ ${_kasRp(r.masuk)}</b></div>
      <div class="kas-lap-baris keluar"><span>Total uang keluar</span><b>− ${_kasRp(r.keluar)}</b></div>
      <div class="kas-lap-baris total"><span>Saldo akhir</span><b>${_kasRp(_kasBarisBuku("").saldoAkhir)}</b></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:14px;">
        <button class="btn btn-accent" onclick="eksporLaporanKas('pdf')">🖨️ PDF (kop & TTD)</button>
        <button class="btn btn-outline" onclick="eksporLaporanKas('excel')">📊 Excel</button>
      </div>
      <button class="btn btn-ghost" style="width:100%;margin-top:8px;" onclick="kasPilihFileImpor()">📥 Impor dari Excel (pembukuan lama)</button>
      <div style="font-size:10.5px;color:var(--text-secondary);margin-top:8px;">PDF berisi kop lembaga, ringkasan, rincian per kategori, buku kas, dan tanda tangan Bendahara · Kepala Sekolah · Ketua Yayasan. Excel berformat rapi dengan rumus saldo berjalan.</div>
    </div>
    <div class="card">
      <div class="kas-kartu-judul">📅 Rekap Tahun ${y}</div>
      <div style="overflow-x:auto;"><table class="simple-table" style="font-size:11.5px;">
        <thead><tr><th>Bulan</th><th style="text-align:right;">Masuk</th><th style="text-align:right;">Keluar</th><th style="text-align:right;">Selisih</th></tr></thead>
        <tbody>${tahunan.map((d) => `<tr style="cursor:pointer;${d.b === KAS.bulan ? "font-weight:800;" : ""}" onclick="KAS.bulan='${d.b}';renderKas()"><td>${_kasNamaBulanPendek(d.b)}</td><td style="text-align:right;color:var(--ok);">${d.masuk ? _kasRp(d.masuk) : "-"}</td><td style="text-align:right;color:var(--bad);">${d.keluar ? _kasRp(d.keluar) : "-"}</td><td style="text-align:right;">${d.masuk || d.keluar ? _kasRp(d.selisih) : "-"}</td></tr>`).join("")}
        <tr style="font-weight:800;background:var(--accent-soft);"><td>Total</td><td style="text-align:right;">${_kasRp(totM)}</td><td style="text-align:right;">${_kasRp(totK)}</td><td style="text-align:right;">${_kasRp(totM - totK)}</td></tr></tbody>
      </table></div>
    </div>
  </div>`;
}
// ── DOKUMEN RESMI — gaya laporan keuangan kantor (bersih, tipografi rapi, angka rata kanan) ──
// Dipakai bersama oleh Laporan Kas (PDF) dan Kuitansi. Semua gaya dibungkus kelas .kd supaya tidak
// bentrok dengan gaya bawaan jendela cetak (eksporHtmlSebagaiPDF memberi semua td/th border tebal).
function _kasAngka(n) { n = Math.round(Number(n) || 0); return n < 0 ? `(${formatRibuan(-n)})` : (formatRibuan(n) || "0"); }
function _kasTglPanjang(iso) { return new Date(iso + "T00:00:00").toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }); }
function _kasTglDok(iso) { return new Date(iso + "T00:00:00").toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }); }
function _kasTerbilang(n) {
  n = Math.floor(Math.abs(Number(n) || 0));
  const s = ["", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan", "sepuluh", "sebelas"];
  const f = (x) => {
    if (x < 12) return s[x];
    if (x < 20) return f(x - 10) + " belas";
    if (x < 100) return f(Math.floor(x / 10)) + " puluh" + (x % 10 ? " " + f(x % 10) : "");
    if (x < 200) return "seratus" + (x - 100 ? " " + f(x - 100) : "");
    if (x < 1000) return f(Math.floor(x / 100)) + " ratus" + (x % 100 ? " " + f(x % 100) : "");
    if (x < 2000) return "seribu" + (x - 1000 ? " " + f(x - 1000) : "");
    if (x < 1e6) return f(Math.floor(x / 1000)) + " ribu" + (x % 1000 ? " " + f(x % 1000) : "");
    if (x < 1e9) return f(Math.floor(x / 1e6)) + " juta" + (x % 1e6 ? " " + f(x % 1e6) : "");
    if (x < 1e12) return f(Math.floor(x / 1e9)) + " miliar" + (x % 1e9 ? " " + f(x % 1e9) : "");
    return f(Math.floor(x / 1e12)) + " triliun" + (x % 1e12 ? " " + f(x % 1e12) : "");
  };
  const teks = n ? f(n) : "nol";
  return teks.charAt(0).toUpperCase() + teks.slice(1) + " rupiah";
}
function _kasDokCss(w) {
  return `<style>
    .kd{font-family:'Segoe UI','Helvetica Neue',Arial,sans-serif;color:#1d2433;font-size:9.5pt;line-height:1.45;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
    .kd table{width:100%;border-collapse:collapse;}
    .kd td,.kd th{border:0;padding:0;background:none;font-size:inherit;}
    .kd-pita{height:4px;border-radius:2px;background:linear-gradient(90deg,${w.tua},${w.utama} 60%,${w.lembut});margin-bottom:16px;}
    .kd-kop{display:flex;justify-content:space-between;align-items:flex-start;gap:24px;padding-bottom:14px;border-bottom:1px solid #d9dee7;}
    .kd-lembaga{display:flex;gap:12px;align-items:center;min-width:0;}
    .kd-logo{width:50px;height:50px;object-fit:contain;flex-shrink:0;}
    .kd-nama{font-size:11.5pt;font-weight:700;letter-spacing:.2px;color:${w.tua};}
    .kd-alamat{font-size:7.8pt;color:#6b7385;max-width:320px;margin-top:2px;}
    .kd-dok{text-align:right;flex-shrink:0;}
    .kd-dok-judul{font-size:16pt;font-weight:300;letter-spacing:3.5px;text-transform:uppercase;color:${w.tua};line-height:1.15;}
    .kd-dok-sub{font-size:7.8pt;color:#8a92a3;letter-spacing:.6px;margin-top:3px;}
    .kd-meta{display:grid;grid-template-columns:repeat(4,1fr);margin:14px 0 16px;border:1px solid #e3e7ee;border-radius:6px;}
    .kd-meta>div{padding:7px 12px;border-right:1px solid #e3e7ee;}
    .kd-meta>div:last-child{border-right:0;}
    .kd-label{display:block;font-size:6.8pt;text-transform:uppercase;letter-spacing:1.1px;color:#8a92a3;font-weight:600;}
    .kd-meta b{font-size:8.8pt;font-weight:600;}
    .kd-kpi{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:6px;}
    .kd-kpi>div{padding:10px 12px;border-top:3px solid #d9dee7;background:#f7f8fb;}
    .kd-kpi .masuk{border-top-color:#1f8a5f;} .kd-kpi .keluar{border-top-color:#c2453d;}
    .kd-kpi .akhir{background:${w.tua};border-top-color:${w.tua};color:#fff;} .kd-kpi .akhir .kd-label{color:rgba(255,255,255,.7);}
    .kd-kpi b{display:block;font-size:12.5pt;font-weight:700;margin-top:3px;font-variant-numeric:tabular-nums;}
    .kd-h{font-size:7.5pt;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:${w.tua};margin:18px 0 8px;display:flex;align-items:center;gap:10px;}
    .kd-h::after{content:"";flex:1;height:1px;background:#e3e7ee;}
    .kd-kat{display:grid;grid-template-columns:1fr 1fr;gap:26px;}
    .kd-kat-judul{font-size:8pt;font-weight:700;color:#4a5263;margin-bottom:4px;display:flex;justify-content:space-between;}
    .kd-kat-baris{padding:4px 0;border-bottom:1px solid #f0f2f6;font-size:8.3pt;}
    .kd-kat-baris div{display:flex;justify-content:space-between;gap:8px;}
    .kd-kat-bar{height:3px;background:#eef0f4;border-radius:2px;margin-top:3px;overflow:hidden;}
    .kd-kat-bar span{display:block;height:100%;border-radius:2px;}
    .kd-tabel th{font-size:6.8pt;text-transform:uppercase;letter-spacing:.9px;color:#6b7385;font-weight:700;text-align:left;padding:7px 6px;border-bottom:1.5px solid ${w.tua};}
    .kd-tabel td{padding:5px 6px;border-bottom:1px solid #eef0f4;font-size:8.3pt;vertical-align:top;}
    .kd-tabel .n{text-align:right;white-space:nowrap;font-variant-numeric:tabular-nums;}
    .kd-tabel .t{white-space:nowrap;color:#4a5263;}
    .kd-tabel .redup{color:#8a92a3;font-size:7.5pt;}
    .kd-tabel tr.awal td{background:#f7f8fb;font-style:italic;color:#4a5263;}
    .kd-tabel tr.total td{border-top:1.5px solid ${w.tua};border-bottom:3px double ${w.tua};font-weight:700;background:#f7f8fb;}
    .kd-tabel .minus{color:#c2453d;}
    .kd-ttd{display:grid;gap:28px;margin-top:30px;page-break-inside:avoid;}
    .kd-ttd>div{text-align:center;font-size:8.5pt;color:#4a5263;}
    .kd-ttd .kd-garis{margin-top:58px;border-top:1px solid #1d2433;padding-top:5px;font-weight:700;color:#1d2433;font-size:9pt;}
    .kd-kaki{margin-top:26px;padding-top:8px;border-top:1px solid #e3e7ee;display:flex;justify-content:space-between;gap:12px;font-size:6.8pt;color:#8a92a3;letter-spacing:.3px;}
    .kd-nominal{margin:18px 0;display:grid;grid-template-columns:auto 1fr;border:1px solid #e3e7ee;border-radius:8px;overflow:hidden;}
    .kd-nominal-angka{background:${w.tua};color:#fff;padding:14px 22px;display:flex;flex-direction:column;justify-content:center;}
    .kd-nominal-angka b{font-size:17pt;font-weight:700;letter-spacing:.3px;font-variant-numeric:tabular-nums;}
    .kd-nominal-angka .kd-label{color:rgba(255,255,255,.7);}
    .kd-nominal-huruf{padding:14px 18px;background:#f7f8fb;display:flex;flex-direction:column;justify-content:center;}
    .kd-nominal-huruf i{font-size:10pt;color:#1d2433;font-weight:500;}
    .kd-rinci td{padding:7px 0;border-bottom:1px solid #eef0f4;font-size:9pt;vertical-align:top;}
    .kd-rinci td:first-child{width:34%;color:#6b7385;}
    .kd-rinci td:last-child{font-weight:600;}
    .kd-cap{display:inline-block;border:2px solid #1f8a5f;color:#1f8a5f;border-radius:6px;padding:3px 12px;font-weight:800;letter-spacing:3px;font-size:10pt;transform:rotate(-6deg);opacity:.85;}
  </style>`;
}
function _kasDokKop(p, w, judul, sub) {
  const logo = p.logo_kiri_url || urlLogoSekolah();
  return `<div class="kd-pita"></div>
    <div class="kd-kop">
      <div class="kd-lembaga">
        ${logo ? `<img class="kd-logo" src="${logo}"/>` : ""}
        <div><div class="kd-nama">${escapeHtml(p.nama_lembaga_kop || "RUMAH TAHFIZH AL-UMM PUTRA BARABAI")}</div>
        ${p.alamat ? `<div class="kd-alamat">${escapeHtml(p.alamat)}</div>` : ""}</div>
      </div>
      <div class="kd-dok"><div class="kd-dok-judul">${judul}</div><div class="kd-dok-sub">${sub}</div></div>
    </div>`;
}
function _kasDokKaki(noDok) {
  const kini = new Date().toLocaleString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  return `<div class="kd-kaki"><span>${escapeHtml(noDok)} · Dokumen dihasilkan oleh Aplikasi Guru Kelas</span><span>Dicetak ${kini} oleh ${escapeHtml(STATE.guruNama || _namaPjKas())}</span></div>`;
}
function _kasDokTtd(p, tanggalTerbit) {
  const kepsek = (typeof _namaPejabat === "function" && _namaPejabat(p)) || "";
  const ketua = typeof _guruDenganJabatan === "function" ? _guruDenganJabatan("ketua_yayasan")?.nama : "";
  const kolom = [
    { atas: "Dibuat oleh,", nama: _namaPjKas(), jab: "Bendahara" },
    { atas: "Diperiksa oleh,", nama: kepsek || "( ............................ )", jab: (typeof _jabatanPejabat === "function" && _jabatanPejabat(p)) || "Kepala Sekolah" },
  ];
  if (ketua) kolom.push({ atas: "Disetujui oleh,", nama: ketua, jab: "Ketua Yayasan" });
  return `<div style="page-break-inside:avoid;">
    <div style="text-align:right;font-size:8.5pt;color:#4a5263;margin-top:26px;">${escapeHtml(p.tempat_terbit || "Barabai")}, ${tanggalTerbit}</div>
    <div class="kd-ttd" style="grid-template-columns:repeat(${kolom.length},1fr);margin-top:10px;">${kolom.map((k) => `<div>${k.atas}<div class="kd-garis">${escapeHtml(k.nama)}</div><span class="kd-label" style="margin-top:2px;">${escapeHtml(k.jab)}</span></div>`).join("")}</div>
  </div>`;
}

async function eksporLaporanKas(format) {
  const [y, m] = KAS.bulan.split("-").map(Number);
  const judulBulan = namaBulanIndo(KAS.bulan);
  const { saldoAwal, rows, saldoAkhir } = _kasBarisBuku("");
  const r = kasRingkasBulan(KAS.bulan);
  const akhirBulanISO = tanggalISO(new Date(y, m, 0));
  const noDok = `LK/${y}/${String(m).padStart(2, "0")}`;
  const periodeTeks = `1 – ${new Date(y, m, 0).getDate()} ${judulBulan}`;
  const perKat = {};
  kasTransaksiBulan(KAS.bulan).filter((t) => t.jenis !== "transfer").forEach((t) => {
    const k = `${t.jenis}|${t.kategori_id || ""}`;
    perKat[k] = perKat[k] || { n: 0, x: 0 }; perKat[k].n += Number(t.nominal); perKat[k].x++;
  });
  const daftarKat = (jenis) => Object.entries(perKat).filter(([k]) => k.startsWith(jenis + "|"))
    .map(([k, v]) => ({ kat: _kasKat(k.split("|")[1]), ...v })).sort((a, b) => b.n - a.n);
  if (format === "excel") return _kasEksporExcel({ y, m, judulBulan, periodeTeks, noDok, saldoAwal, rows, saldoAkhir, r, daftarKat });

  setGlobalLoading(true, "Menyiapkan laporan kas...");
  try {
    const p = await apiGetPengaturanSekolah();
    const w = typeof _warnaDok === "function" ? _warnaDok() : { tua: "#1B4B38", utama: "#1F8A5F", lembut: "#E3F3EA" };
    const blokKat = (jenis, judul, total, warna) => {
      const d = daftarKat(jenis);
      return `<div><div class="kd-kat-judul"><span>${judul}</span><span>Rp ${_kasAngka(total)}</span></div>
        ${d.map((x) => `<div class="kd-kat-baris"><div><span>${escapeHtml(x.kat?.nama || "Tanpa kategori")} <span style="color:#8a92a3;">· ${x.x} trx</span></span><b>${_kasAngka(x.n)}</b></div>
          <div class="kd-kat-bar"><span style="width:${total ? Math.max(2, Math.round((x.n / total) * 100)) : 0}%;background:${warna};"></span></div></div>`).join("") || `<div class="kd-kat-baris" style="color:#8a92a3;">Tidak ada transaksi</div>`}</div>`;
    };
    const html = `${_kasDokCss(w)}<div class="kd">
      ${_kasDokKop(p, w, "Laporan Kas", "Statement of Cash Receipts &amp; Disbursements")}
      <div class="kd-meta">
        <div><span class="kd-label">No. Dokumen</span><b>${noDok}</b></div>
        <div><span class="kd-label">Periode</span><b>${periodeTeks}</b></div>
        <div><span class="kd-label">Mata Uang</span><b>IDR (Rupiah)</b></div>
        <div><span class="kd-label">Penanggung Jawab</span><b>${escapeHtml(_namaPjKas())}</b></div>
      </div>
      <div class="kd-kpi">
        <div><span class="kd-label">Saldo Awal</span><b>${_kasAngka(saldoAwal)}</b></div>
        <div class="masuk"><span class="kd-label">Total Penerimaan</span><b>${_kasAngka(r.masuk)}</b></div>
        <div class="keluar"><span class="kd-label">Total Pengeluaran</span><b>${_kasAngka(r.keluar)}</b></div>
        <div class="akhir"><span class="kd-label">Saldo Akhir</span><b>${_kasAngka(saldoAkhir)}</b></div>
      </div>
      <div class="kd-h">Ringkasan per Kategori</div>
      <div class="kd-kat">${blokKat("masuk", "Penerimaan", r.masuk, "#1f8a5f")}${blokKat("keluar", "Pengeluaran", r.keluar, "#c2453d")}</div>
      <div class="kd-h">Rincian Transaksi</div>
      <table class="kd-tabel">
        <thead><tr><th style="width:22px;">No</th><th>Tanggal</th><th>No. Bukti</th><th>Uraian</th><th>Kategori</th><th class="n">Penerimaan</th><th class="n">Pengeluaran</th><th class="n">Saldo</th></tr></thead>
        <tbody>
          <tr class="awal"><td></td><td class="t">${_kasTglDok(`${KAS.bulan}-01`)}</td><td></td><td colspan="4">Saldo awal periode (saldo dibawa dari bulan sebelumnya)</td><td class="n">${_kasAngka(saldoAwal)}</td></tr>
          ${rows.map(({ t, debit, kredit, saldo }, i) => `<tr>
            <td class="redup">${i + 1}</td><td class="t">${_kasTglDok(t.tanggal)}</td><td class="t redup">${escapeHtml(t.nomor_bukti || "-")}</td>
            <td>${escapeHtml(t.keterangan || _kasKat(t.kategori_id)?.nama || "-")}${t.pihak ? `<div class="redup">${t.jenis === "masuk" ? "Dari" : "Kepada"}: ${escapeHtml(t.pihak)}</div>` : ""}</td>
            <td class="redup">${escapeHtml(_kasKat(t.kategori_id)?.nama || "")}</td>
            <td class="n">${debit ? _kasAngka(debit) : "–"}</td><td class="n">${kredit ? _kasAngka(kredit) : "–"}</td>
            <td class="n ${saldo < 0 ? "minus" : ""}" style="font-weight:600;">${_kasAngka(saldo)}</td></tr>`).join("")}
          <tr class="total"><td></td><td colspan="4">Jumlah periode ${escapeHtml(judulBulan)}</td><td class="n">${_kasAngka(r.masuk)}</td><td class="n">${_kasAngka(r.keluar)}</td><td class="n ${saldoAkhir < 0 ? "minus" : ""}">${_kasAngka(saldoAkhir)}</td></tr>
        </tbody>
      </table>
      <div style="font-size:7.5pt;color:#8a92a3;margin-top:6px;">Seluruh angka dalam Rupiah. Angka dalam kurung ( ) menunjukkan saldo negatif.</div>
      ${_kasDokTtd(p, _kasTglPanjang(akhirBulanISO))}
      ${_kasDokKaki(noDok)}
    </div>`;
    eksporHtmlSebagaiPDF(`Laporan Kas ${judulBulan}`, html);
  } catch (e) { toast("Gagal membuat laporan: " + e.message, "err"); }
  finally { setGlobalLoading(false); }
}

// Excel laporan kas — ExcelJS (bukan xlsx.js) supaya bisa berwarna, bergaris & berformat angka.
// Kolom Saldo memakai RUMUS (saldo sebelumnya + masuk − keluar), jadi tetap benar kalau diedit di Excel.
async function _kasEksporExcel({ y, m, judulBulan, periodeTeks, noDok, saldoAwal, rows, saldoAkhir, r, daftarKat }) {
  if (typeof ExcelJS === "undefined") { toast("Pustaka Excel belum termuat, coba refresh halaman lalu ulangi.", "err"); return; }
  setGlobalLoading(true, "Menyiapkan Excel...");
  try {
    const p = await apiGetPengaturanSekolah();
    const w = typeof _warnaDok === "function" ? _warnaDok() : { tua: "#1B4B38", utama: "#1F8A5F", lembut: "#E3F3EA" };
    const argb = (hex) => "FF" + hex.replace("#", "").toUpperCase();
    const TUA = argb(w.tua), LEMBUT = argb(w.lembut), ABU = "FFF7F8FB", GARIS = "FFE3E7EE", TEKS2 = "FF6B7385";
    const FMT = '#,##0;[Red](#,##0);"–"', FMT_RP = '"Rp "#,##0;[Red]("Rp "#,##0);"Rp 0"';
    const tgl = (iso) => { const [a, b, c] = iso.split("-").map(Number); return new Date(Date.UTC(a, b - 1, c)); };
    const bingkai = (warna = GARIS, gaya = "thin") => ({ top: { style: gaya, color: { argb: warna } }, bottom: { style: gaya, color: { argb: warna } }, left: { style: gaya, color: { argb: warna } }, right: { style: gaya, color: { argb: warna } } });
    const lembaga = p.nama_lembaga_kop || "RUMAH TAHFIZH AL-UMM PUTRA BARABAI";

    const wb = new ExcelJS.Workbook();
    wb.creator = _namaPjKas(); wb.created = new Date();
    const ws = wb.addWorksheet("Laporan Kas", {
      views: [{ state: "frozen", ySplit: 9, showGridLines: false }],
      pageSetup: { paperSize: 9, orientation: "landscape", fitToPage: true, fitToWidth: 1, fitToHeight: 0, margins: { left: 0.4, right: 0.4, top: 0.5, bottom: 0.6, header: 0.2, footer: 0.3 } },
      headerFooter: { oddFooter: `&L&8${noDok} · ${lembaga}&R&8Halaman &P dari &N` },
    });
    ws.columns = [{ width: 5 }, { width: 13 }, { width: 15 }, { width: 44 }, { width: 22 }, { width: 18 }, { width: 16 }, { width: 16 }, { width: 17 }];
    const N = 9;
    // Kop
    ws.mergeCells(1, 1, 1, N); ws.getCell(1, 1).value = lembaga;
    ws.getCell(1, 1).font = { bold: true, size: 15, color: { argb: TUA } };
    ws.mergeCells(2, 1, 2, N); ws.getCell(2, 1).value = "LAPORAN KAS MASUK & KAS KELUAR";
    ws.getCell(2, 1).font = { size: 11, bold: true, color: { argb: "FF1D2433" }, };
    ws.mergeCells(3, 1, 3, N); ws.getCell(3, 1).value = `Periode: ${periodeTeks}   ·   No. Dokumen: ${noDok}   ·   Penanggung jawab: ${_namaPjKas()}`;
    ws.getCell(3, 1).font = { size: 9, color: { argb: TEKS2 } };
    ws.getRow(1).height = 24; ws.getRow(2).height = 18; ws.getRow(3).height = 16; ws.getRow(4).height = 6;
    for (let c = 1; c <= N; c++) ws.getCell(4, c).border = { bottom: { style: "medium", color: { argb: TUA } } };
    // Pita ringkasan (KPI)
    const kpi = [["SALDO AWAL", saldoAwal, 1, 2], ["TOTAL PENERIMAAN", r.masuk, 3, 4], ["TOTAL PENGELUARAN", r.keluar, 5, 6], ["SALDO AKHIR", saldoAkhir, 7, 9]];
    kpi.forEach(([label, nilai, c1, c2], i) => {
      ws.mergeCells(6, c1, 6, c2); ws.mergeCells(7, c1, 7, c2);
      const akhir = i === 3;
      const l = ws.getCell(6, c1), v = ws.getCell(7, c1);
      l.value = label; v.value = nilai; v.numFmt = FMT_RP;
      l.font = { size: 8, bold: true, color: { argb: akhir ? "FFD7DEEA" : TEKS2 } };
      v.font = { size: 13, bold: true, color: { argb: akhir ? "FFFFFFFF" : i === 1 ? "FF1F8A5F" : i === 2 ? "FFC2453D" : "FF1D2433" } };
      for (let c = c1; c <= c2; c++) [6, 7].forEach((rr) => { ws.getCell(rr, c).fill = { type: "pattern", pattern: "solid", fgColor: { argb: akhir ? TUA : ABU } }; });
      l.alignment = { indent: 1, vertical: "bottom" }; v.alignment = { indent: 1, vertical: "middle" };
    });
    ws.getRow(5).height = 8; ws.getRow(6).height = 16; ws.getRow(7).height = 24; ws.getRow(8).height = 10;
    // Header tabel
    const H = 9;
    ws.getRow(H).values = ["No", "Tanggal", "No. Bukti", "Uraian", "Kategori", "Akun", "Masuk (Rp)", "Keluar (Rp)", "Saldo (Rp)"];
    ws.getRow(H).height = 22;
    ws.getRow(H).eachCell((c, col) => {
      c.font = { bold: true, size: 9, color: { argb: "FFFFFFFF" } };
      c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: TUA } };
      c.alignment = { vertical: "middle", horizontal: col >= 7 ? "right" : col <= 2 ? "center" : "left", indent: col >= 3 && col <= 6 ? 1 : 0 };
    });
    // Saldo awal
    const ra = ws.addRow(["", tgl(`${KAS.bulan}-01`), "", "Saldo awal bulan ini (dibawa dari bulan sebelumnya)", "", "", null, null, saldoAwal]);
    ra.font = { italic: true, size: 9, color: { argb: "FF4A5263" } };
    ra.eachCell({ includeEmpty: true }, (c) => { c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: LEMBUT } }; c.border = { bottom: { style: "thin", color: { argb: GARIS } } }; });
    ra.getCell(2).numFmt = "dd mmm yyyy"; ra.getCell(2).alignment = { horizontal: "center" }; ra.getCell(9).numFmt = FMT; ra.getCell(4).alignment = { indent: 1 };
    const barisAwal = ra.number;
    rows.forEach(({ t, debit, kredit, saldo }, i) => {
      const nr = barisAwal + i + 1;
      const row = ws.addRow([i + 1, tgl(t.tanggal), t.nomor_bukti || "", (t.keterangan || _kasKat(t.kategori_id)?.nama || "") + (t.pihak ? ` — ${t.pihak}` : ""), _kasKat(t.kategori_id)?.nama || "", _kasAkun(t.akun_id)?.nama || "", debit || null, kredit || null, { formula: `I${nr - 1}+G${nr}-H${nr}`, result: saldo }]);
      row.font = { size: 9, color: { argb: "FF1D2433" } };
      row.eachCell({ includeEmpty: true }, (c, col) => {
        if (i % 2 === 1) c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: ABU } };
        c.border = { bottom: { style: "hair", color: { argb: GARIS } } };
        c.alignment = { vertical: "top", wrapText: col === 4, horizontal: col <= 2 ? "center" : undefined, indent: col >= 3 && col <= 6 ? 1 : 0 };
        if (col >= 7) c.numFmt = FMT;
      });
      row.getCell(2).numFmt = "dd mmm yyyy";
      row.getCell(1).font = row.getCell(3).font = row.getCell(5).font = row.getCell(6).font = { size: 8.5, color: { argb: TEKS2 } };
      row.getCell(9).font = { size: 9, bold: true };
    });
    const akhirData = barisAwal + rows.length;
    const jml = (kol, hasil) => rows.length ? { formula: `SUM(${kol}${barisAwal + 1}:${kol}${akhirData})`, result: hasil } : 0;
    const rt = ws.addRow(["", "", "", `JUMLAH ${judulBulan.toUpperCase()}`, "", "", jml("G", r.masuk), jml("H", r.keluar), { formula: `I${akhirData}`, result: saldoAkhir }]);
    rt.height = 20;
    rt.eachCell({ includeEmpty: true }, (c, col) => {
      c.font = { bold: true, size: 9.5, color: { argb: TUA } };
      c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: LEMBUT } };
      c.border = { top: { style: "thin", color: { argb: TUA } }, bottom: { style: "double", color: { argb: TUA } } };
      c.alignment = { vertical: "middle", indent: col === 4 ? 1 : 0 };
      if (col >= 7) c.numFmt = FMT;
    });
    ws.autoFilter = { from: { row: H, column: 1 }, to: { row: akhirData, column: N } };
    // Tanda tangan
    const t0 = rt.number + 3;
    const kepsek = (typeof _namaPejabat === "function" && _namaPejabat(p)) || "( ............................ )";
    const ttd = [[2, 4, `${p.tempat_terbit || "Barabai"}, ${_kasTglPanjang(tanggalISO(new Date(y, m, 0)))}`, "Dibuat oleh, Bendahara", _namaPjKas()], [6, 9, "", "Diperiksa oleh, " + ((typeof _jabatanPejabat === "function" && _jabatanPejabat(p)) || "Kepala Sekolah"), kepsek]];
    ttd.forEach(([c1, c2, atas, peran, nama]) => {
      [[t0, atas], [t0 + 1, peran], [t0 + 5, nama]].forEach(([rr, v], j) => {
        ws.mergeCells(rr, c1, rr, c2);
        const c = ws.getCell(rr, c1); c.value = v; c.alignment = { horizontal: "center" };
        c.font = j === 2 ? { bold: true, size: 10, underline: true } : { size: 9, color: { argb: "FF4A5263" } };
      });
    });

    // Sheet 2: ringkasan kategori
    const ws2 = wb.addWorksheet("Ringkasan Kategori", { views: [{ showGridLines: false }] });
    ws2.columns = [{ width: 16 }, { width: 32 }, { width: 14 }, { width: 18 }, { width: 11 }];
    ws2.mergeCells("A1:E1"); ws2.getCell("A1").value = `Ringkasan per Kategori — ${judulBulan}`; ws2.getCell("A1").font = { bold: true, size: 13, color: { argb: TUA } };
    ws2.getRow(3).values = ["Jenis", "Kategori", "Transaksi", "Total (Rp)", "Porsi"];
    ws2.getRow(3).eachCell((c, col) => { c.font = { bold: true, size: 9, color: { argb: "FFFFFFFF" } }; c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: TUA } }; c.alignment = { horizontal: col >= 3 ? "right" : "left", vertical: "middle", indent: 1 }; });
    ws2.getRow(3).height = 20;
    [["masuk", "Penerimaan", r.masuk], ["keluar", "Pengeluaran", r.keluar]].forEach(([jenis, label, total]) => {
      daftarKat(jenis).forEach((x) => {
        const row = ws2.addRow([label, x.kat?.nama || "Tanpa kategori", x.x, x.n, total ? x.n / total : 0]);
        row.font = { size: 9.5 }; row.getCell(4).numFmt = FMT; row.getCell(5).numFmt = "0.0%";
        row.eachCell((c) => { c.border = { bottom: { style: "hair", color: { argb: GARIS } } }; c.alignment = { indent: 1 }; });
        row.getCell(1).font = { size: 9, color: { argb: jenis === "masuk" ? "FF1F8A5F" : "FFC2453D" }, bold: true };
      });
      const st = ws2.addRow([`Subtotal ${label}`, "", "", total, total ? 1 : 0]);
      st.eachCell({ includeEmpty: true }, (c) => { c.font = { bold: true, size: 9.5, color: { argb: TUA } }; c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: LEMBUT } }; c.alignment = { indent: 1 }; });
      st.getCell(4).numFmt = FMT; st.getCell(5).numFmt = "0.0%";
      ws2.addRow([]);
    });

    // Sheet 3: rekap tahunan
    const ws3 = wb.addWorksheet(`Rekap ${y}`, { views: [{ showGridLines: false }] });
    ws3.columns = [{ width: 16 }, { width: 18 }, { width: 18 }, { width: 18 }];
    ws3.mergeCells("A1:D1"); ws3.getCell("A1").value = `Rekap Kas Tahun ${y}`; ws3.getCell("A1").font = { bold: true, size: 13, color: { argb: TUA } };
    ws3.getRow(3).values = ["Bulan", "Masuk (Rp)", "Keluar (Rp)", "Selisih (Rp)"];
    ws3.getRow(3).eachCell((c, col) => { c.font = { bold: true, size: 9, color: { argb: "FFFFFFFF" } }; c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: TUA } }; c.alignment = { horizontal: col > 1 ? "right" : "left", vertical: "middle", indent: 1 }; });
    ws3.getRow(3).height = 20;
    for (let i = 1; i <= 12; i++) {
      const ym = `${y}-${String(i).padStart(2, "0")}`, d = kasRingkasBulan(ym), nr = 3 + i;
      const row = ws3.addRow([namaBulanIndo(ym), d.masuk, d.keluar, { formula: `B${nr}-C${nr}`, result: d.selisih }]);
      row.eachCell((c, col) => { c.font = { size: 9.5, bold: ym === KAS.bulan }; c.border = { bottom: { style: "hair", color: { argb: GARIS } } }; c.alignment = { indent: 1 }; if (col > 1) c.numFmt = FMT; if (i % 2 === 0) c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: ABU } }; });
    }
    const tt = ws3.addRow(["Total", { formula: "SUM(B4:B15)" }, { formula: "SUM(C4:C15)" }, { formula: "SUM(D4:D15)" }]);
    tt.eachCell((c, col) => { c.font = { bold: true, size: 9.5, color: { argb: TUA } }; c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: LEMBUT } }; c.border = { top: { style: "thin", color: { argb: TUA } }, bottom: { style: "double", color: { argb: TUA } } }; c.alignment = { indent: 1 }; if (col > 1) c.numFmt = FMT; });

    const buf = await wb.xlsx.writeBuffer();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
    link.download = `Laporan_Kas_${KAS.bulan}.xlsx`;
    document.body.appendChild(link); link.click(); link.remove();
    toast("Laporan Excel terunduh", "ok");
  } catch (e) { console.error(e); toast("Gagal membuat Excel: " + e.message, "err"); }
  finally { setGlobalLoading(false); }
}

// ── TAB ATUR (akun & kategori) ──────────────────────────────
function htmlKasAtur() {
  const katList = (jenis) => KAS.kategori.filter((k) => k.jenis === jenis).map((k) => `<div class="kas-atur-baris">
      <span class="kas-baris-ikon" style="background:${k.warna}22;color:${k.warna};">${k.ikon || "•"}</span>
      <div style="flex:1;min-width:0;"><b>${escapeHtml(k.nama)}</b>${jenis === "keluar" ? `<div style="font-size:10.5px;color:var(--text-secondary);">Anggaran/bulan: ${Number(k.anggaran_bulanan) > 0 ? _kasRp(k.anggaran_bulanan) : "tidak dibatasi"}</div>` : ""}</div>
      <button class="btn btn-ghost" style="padding:5px 10px;font-size:11px;" onclick="bukaFormKategoriKas('${k.id}')">✏️</button>
    </div>`).join("") || `<div style="font-size:11px;color:var(--text-secondary);padding:6px 0;">Belum ada kategori.</div>`;
  return `<div class="kas-dua">
    <div class="card">
      <div class="kas-kartu-judul">🏦 Akun Kas & Rekening <button class="btn btn-ghost" style="margin-left:auto;padding:5px 12px;font-size:11px;" onclick="bukaFormAkunKas()">＋ Akun</button></div>
      ${KAS.akun.map((a) => `<div class="kas-atur-baris">
        <span class="kas-baris-ikon">${a.jenis === "bank" ? "🏦" : a.jenis === "ewallet" ? "📱" : "💵"}</span>
        <div style="flex:1;min-width:0;"><b>${escapeHtml(a.nama)}</b><div style="font-size:10.5px;color:var(--text-secondary);">Saldo awal ${_kasRp(a.saldo_awal)} · Saldo kini <b>${_kasRp(kasSaldoAkun(a.id))}</b></div></div>
        <button class="btn btn-ghost" style="padding:5px 10px;font-size:11px;" onclick="bukaFormAkunKas('${a.id}')">✏️</button>
      </div>`).join("") || htmlKosong("🏦", "Belum ada akun")}
      <button class="btn btn-outline" style="width:100%;margin-top:10px;" onclick="bukaFormKas('transfer')">🔁 Pindah Saldo Antar Akun</button>
      <button class="btn btn-ghost" style="width:100%;margin-top:8px;" onclick="kasPilihFileImpor()">📥 Impor Buku Kas dari Excel</button>
      ${KAS.semua.some((t) => t.metode === "Impor Excel") ? `<button class="btn btn-outline" style="width:100%;margin-top:8px;color:var(--bad);" onclick="kasBatalkanImpor()">↩️ Batalkan hasil impor (${KAS.semua.filter((t) => t.metode === "Impor Excel").length} transaksi)</button>` : ""}
      <div style="font-size:10.5px;color:var(--text-secondary);margin-top:4px;">Untuk awal transisi: unggah laporan kas lama (format No · Tanggal · Uraian · Masuk · Keluar · Saldo). Semua baris ditinjau dulu sebelum disimpan.</div>
    </div>
    <div class="card">
      <div class="kas-kartu-judul">🏷️ Kategori <button class="btn btn-ghost" style="margin-left:auto;padding:5px 12px;font-size:11px;" onclick="bukaFormKategoriKas()">＋ Kategori</button></div>
      <div class="kas-atur-sub">Uang Masuk</div>${katList("masuk")}
      <div class="kas-atur-sub">Uang Keluar</div>${katList("keluar")}
    </div>
  </div>`;
}
function bukaFormAkunKas(id) {
  const a = id ? _kasAkun(id) : null;
  openModal(`
    <h3>${a ? "✏️ Ubah Akun" : "🏦 Akun Baru"}</h3>
    <div class="field"><label class="form-label">Nama akun</label><input id="ka-nama" class="input" value="${escapeHtml(a?.nama || "")}" placeholder="mis. Kas Tunai, Bank BRI Sekolah"/></div>
    <div class="field"><label class="form-label">Jenis</label><select id="ka-jenis" class="input">
      ${[["tunai", "💵 Kas tunai"], ["bank", "🏦 Rekening bank"], ["ewallet", "📱 Dompet digital"]].map(([v, l]) => `<option value="${v}" ${a?.jenis === v ? "selected" : ""}>${l}</option>`).join("")}</select></div>
    <div style="display:flex;gap:10px;">
      <div class="field" style="flex:1;"><label class="form-label">Saldo awal (Rp)</label><input id="ka-saldo" class="input" inputmode="numeric" value="${formatRibuan(a?.saldo_awal || 0)}" oninput="this.value=formatRibuan(this.value)"/></div>
      <div class="field" style="flex:1;"><label class="form-label">Per tanggal</label><input id="ka-tgl" type="date" class="input" value="${a?.tanggal_saldo_awal || tanggalISO()}"/></div>
    </div>
    <div style="font-size:10.5px;color:var(--text-secondary);margin:-6px 0 12px;">Isi saldo nyata saat mulai mencatat di aplikasi (hitung uang di kas / lihat saldo rekening).</div>
    <div style="display:flex;gap:8px;">
      ${a ? `<button class="btn btn-outline" style="flex:1;color:var(--bad);" onclick="simpanAkunKas('${a.id}',true)">Nonaktifkan</button>` : ""}
      <button class="btn btn-accent" style="flex:2;" onclick="simpanAkunKas('${a?.id || ""}')">💾 Simpan</button>
    </div>
  `);
}
async function simpanAkunKas(id, nonaktif = false) {
  const nama = qs("ka-nama")?.value.trim();
  if (!nonaktif && !nama) { toast("Nama akun wajib diisi", "err"); return; }
  try {
    const row = nonaktif ? { id, aktif: false } : { nama, jenis: qs("ka-jenis").value, saldo_awal: Number(String(qs("ka-saldo").value).replace(/\D/g, "")) || 0, tanggal_saldo_awal: qs("ka-tgl").value || tanggalISO(), urutan: KAS.akun.length + 1 };
    if (id) row.id = id; else row.aktif = true;
    if (nonaktif && !(await konfirmasiTema("Nonaktifkan akun ini? Riwayat transaksinya tetap tersimpan.", { ikon: "🏦" }))) return;
    await kasSimpanMaster("kas_akun", row);
    closeModal(); toast("Akun disimpan", "ok");
    await renderKasInit();
  } catch (e) { toast("Gagal: " + _kasPesanGalat(e), "err"); }
}
function bukaFormKategoriKas(id) {
  const k = id ? _kasKat(id) : null;
  const jenis = k?.jenis || "keluar";
  openModal(`
    <h3>${k ? "✏️ Ubah Kategori" : "🏷️ Kategori Baru"}</h3>
    <div class="kas-jenis-pilih" id="kk-jenis-wrap">${[["masuk", "Uang Masuk"], ["keluar", "Uang Keluar"]].map(([v, l]) => `<button type="button" class="${jenis === v ? "aktif " + v : ""}" data-jenis="${v}" onclick="qsa('#kk-jenis-wrap button').forEach(b=>b.className='');this.className='aktif ${v}';qs('kk-anggaran-wrap').hidden=${v === "masuk"}">${l}</button>`).join("")}</div>
    <div class="field" style="margin-top:12px;"><label class="form-label">Nama kategori</label><input id="kk-nama" class="input" value="${escapeHtml(k?.nama || "")}" placeholder="mis. Konsumsi Rapat"/></div>
    <div class="field"><label class="form-label">Ikon</label><div class="kas-ikon-pilih">${KAS_IKON_PILIHAN.map((i) => `<button type="button" class="${(k?.ikon || "🧾") === i ? "aktif" : ""}" onclick="qsa('.kas-ikon-pilih button').forEach(b=>b.classList.remove('aktif'));this.classList.add('aktif')">${i}</button>`).join("")}</div></div>
    <div class="field"><label class="form-label">Warna</label><div class="kas-warna-pilih">${KAS_WARNA_PILIHAN.map((w) => `<button type="button" style="background:${w}" data-warna="${w}" class="${(k?.warna || KAS_WARNA_PILIHAN[0]) === w ? "aktif" : ""}" onclick="qsa('.kas-warna-pilih button').forEach(b=>b.classList.remove('aktif'));this.classList.add('aktif')" aria-label="Warna ${w}"></button>`).join("")}</div></div>
    <div class="field" id="kk-anggaran-wrap" ${jenis === "masuk" ? "hidden" : ""}><label class="form-label">Batas anggaran per bulan (Rp, opsional)</label><input id="kk-anggaran" class="input" inputmode="numeric" value="${formatRibuan(k?.anggaran_bulanan || 0)}" oninput="this.value=formatRibuan(this.value)"/><div style="font-size:10.5px;color:var(--text-secondary);margin-top:3px;">Isi 0 kalau tidak dibatasi. Ringkasan akan memperingatkan kalau hampir/melebihi batas.</div></div>
    <div style="display:flex;gap:8px;">
      ${k ? `<button class="btn btn-outline" style="flex:1;color:var(--bad);" onclick="simpanKategoriKas('${k.id}',true)">Nonaktifkan</button>` : ""}
      <button class="btn btn-accent" style="flex:2;" onclick="simpanKategoriKas('${k?.id || ""}')">💾 Simpan</button>
    </div>
  `);
}
async function simpanKategoriKas(id, nonaktif = false) {
  try {
    let row;
    if (nonaktif) {
      if (!(await konfirmasiTema("Nonaktifkan kategori ini? Transaksi lama tetap tercatat.", { ikon: "🏷️" }))) return;
      row = { id, aktif: false };
    } else {
      const nama = qs("kk-nama").value.trim();
      if (!nama) { toast("Nama kategori wajib diisi", "err"); return; }
      const jenis = document.querySelector("#kk-jenis-wrap button.aktif")?.dataset.jenis || "keluar";
      row = { nama, jenis, ikon: document.querySelector(".kas-ikon-pilih button.aktif")?.textContent || "🧾",
        warna: document.querySelector(".kas-warna-pilih button.aktif")?.dataset.warna || KAS_WARNA_PILIHAN[0],
        anggaran_bulanan: jenis === "keluar" ? (Number(String(qs("kk-anggaran").value).replace(/\D/g, "")) || 0) : 0 };
      if (id) row.id = id; else { row.aktif = true; row.urutan = KAS.kategori.length + 1; }
    }
    await kasSimpanMaster("kas_kategori", row);
    closeModal(); toast("Kategori disimpan", "ok");
    await renderKasInit();
  } catch (e) { toast("Gagal: " + _kasPesanGalat(e), "err"); }
}

// ── FORM TRANSAKSI ──────────────────────────────────────────
function bukaPilihJenisKas() {
  openModal(`
    <h3>Catat Transaksi</h3>
    <div class="kas-pilih-jenis">
      <button type="button" class="masuk" onclick="bukaFormKas('masuk')"><span>⬇️</span><b>Uang Masuk</b><small>Infaq, donasi, dana BOP...</small></button>
      <button type="button" class="keluar" onclick="bukaFormKas('keluar')"><span>⬆️</span><b>Uang Keluar</b><small>Belanja, honor, tagihan...</small></button>
      <button type="button" class="transfer" onclick="bukaFormKas('transfer')"><span>🔁</span><b>Pindah Saldo</b><small>Setor ke bank, tarik tunai</small></button>
    </div>
  `);
}
function bukaFormKas(jenis, id) {
  if (!KAS.siap) { toast(KAS.galat || "Kas belum siap", "err"); return; }
  if (!KAS.akun.length) { toast("Tambahkan akun kas dulu di tab Atur", "err"); KAS.tab = "atur"; renderKas(); return; }
  const t = id ? KAS.semua.find((x) => x.id === id) : null;
  jenis = t?.jenis || jenis;
  const kat = KAS.kategori.filter((k) => k.jenis === jenis);
  const katTerpilih = t?.kategori_id || kat[0]?.id || "";
  const label = { masuk: "⬇️ Uang Masuk", keluar: "⬆️ Uang Keluar", transfer: "🔁 Pindah Saldo" }[jenis];
  openModal(`
    <h3>${t ? "✏️ Ubah" : ""} ${label}</h3>
    <input type="hidden" id="kt-jenis" value="${jenis}"/>
    <div class="kas-nominal ${jenis}">
      <span>Rp</span><input id="kt-nominal" inputmode="numeric" placeholder="0" value="${t ? formatRibuan(t.nominal) : ""}" oninput="this.value=formatRibuan(this.value)" autocomplete="off"/>
    </div>
    <div class="kas-cepat">${[10000, 25000, 50000, 100000, 250000, 500000, 1000000].map((n) => `<button type="button" onclick="qs('kt-nominal').value=formatRibuan(${n})">${n >= 1000000 ? n / 1000000 + " jt" : n / 1000 + " rb"}</button>`).join("")}</div>
    ${jenis !== "transfer" ? `<div class="field"><label class="form-label">Kategori</label><div class="kas-kat-pilih">
      ${kat.map((k) => `<button type="button" data-id="${k.id}" class="${k.id === katTerpilih ? "aktif" : ""}" style="--w:${k.warna};" onclick="qsa('.kas-kat-pilih button').forEach(b=>b.classList.remove('aktif'));this.classList.add('aktif')"><span>${k.ikon || "•"}</span>${escapeHtml(k.nama)}</button>`).join("") || `<span style="font-size:11px;color:var(--text-secondary);">Belum ada kategori ${jenis} — tambahkan di tab Atur.</span>`}
    </div></div>` : ""}
    <div style="display:flex;gap:10px;flex-wrap:wrap;">
      <div class="field" style="flex:1;min-width:140px;"><label class="form-label">${jenis === "transfer" ? "Dari akun" : jenis === "masuk" ? "Masuk ke akun" : "Dibayar dari akun"}</label><select id="kt-akun" class="input">${KAS.akun.map((a) => `<option value="${a.id}" ${t?.akun_id === a.id ? "selected" : ""}>${escapeHtml(a.nama)} (${_kasRp(kasSaldoAkun(a.id))})</option>`).join("")}</select></div>
      ${jenis === "transfer" ? `<div class="field" style="flex:1;min-width:140px;"><label class="form-label">Ke akun</label><select id="kt-akun-tujuan" class="input">${KAS.akun.map((a, i) => `<option value="${a.id}" ${(t?.akun_tujuan_id || KAS.akun[1]?.id) === a.id ? "selected" : ""}>${escapeHtml(a.nama)}</option>`).join("")}</select></div>` : ""}
      <div class="field" style="flex:1;min-width:140px;"><label class="form-label">Tanggal</label><input id="kt-tanggal" type="date" class="input" value="${t?.tanggal || tanggalISO()}"/></div>
    </div>
    ${jenis !== "transfer" ? `<div class="field"><label class="form-label">${jenis === "masuk" ? "Diterima dari" : "Dibayarkan kepada"}</label><input id="kt-pihak" class="input" value="${escapeHtml(t?.pihak || "")}" placeholder="${jenis === "masuk" ? "mis. Wali santri Ahmad / Donatur" : "mis. Toko Berkah / Ustadz Fauzan"}"/></div>` : ""}
    <div class="field"><label class="form-label">Keterangan</label><textarea id="kt-ket" class="input" rows="2" placeholder="Untuk apa transaksi ini?">${escapeHtml(t?.keterangan || "")}</textarea></div>
    <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:flex-end;">
      <div class="field" style="flex:1;min-width:140px;"><label class="form-label">Metode</label><select id="kt-metode" class="input">${["Tunai", "Transfer", "QRIS", "Lainnya"].map((m) => `<option ${t?.metode === m ? "selected" : ""}>${m}</option>`).join("")}</select></div>
      <div class="field" style="flex:1;min-width:160px;"><label class="form-label">Bukti (foto nota/struk)</label>
        <label class="btn btn-ghost" style="width:100%;cursor:pointer;">📎 <span id="kt-bukti-label">${t?.bukti_url ? "Ganti bukti" : "Unggah foto"}</span><input type="file" id="kt-bukti" accept="image/*,.pdf" style="display:none" onchange="qs('kt-bukti-label').textContent=this.files[0]?.name||'Unggah foto'"/></label>
      </div>
    </div>
    ${t?.bukti_url ? `<a href="${t.bukti_url}" target="_blank" rel="noopener" style="font-size:11px;">Lihat bukti saat ini</a>` : ""}
    <button class="btn btn-accent" style="width:100%;margin-top:10px;" id="kt-simpan" onclick="simpanTransaksiKas('${t?.id || ""}')">💾 Simpan ${jenis === "transfer" ? "Pindah Saldo" : label.replace(/^\S+\s/, "")}</button>
  `);
  setTimeout(() => qs("kt-nominal")?.focus(), 60);
}
let _KAS_SEDANG_SIMPAN = false;
async function simpanTransaksiKas(id) {
  if (_KAS_SEDANG_SIMPAN) return;
  const jenis = qs("kt-jenis").value;
  const nominal = Number(String(qs("kt-nominal").value).replace(/\D/g, "")) || 0;
  if (nominal <= 0) { toast("Nominal wajib diisi", "err"); qs("kt-nominal").focus(); return; }
  const kategoriId = document.querySelector(".kas-kat-pilih button.aktif")?.dataset.id || null;
  if (jenis !== "transfer" && !kategoriId) { toast("Pilih kategori dulu", "err"); return; }
  const akunId = qs("kt-akun").value, akunTujuan = qs("kt-akun-tujuan")?.value || null;
  if (jenis === "transfer" && akunId === akunTujuan) { toast("Akun asal dan tujuan tidak boleh sama", "err"); return; }
  const tanggal = qs("kt-tanggal").value || tanggalISO();
  if (jenis !== "masuk" && !id) {
    const sisa = kasSaldoAkun(akunId);
    if (nominal > sisa && !(await konfirmasiTema(`Saldo ${_kasAkun(akunId)?.nama} hanya ${_kasRp(sisa)}, sedangkan transaksi ini ${_kasRp(nominal)}. Tetap catat? (saldo akan minus)`, { ikon: "⚠️", judul: "Saldo Tidak Cukup" }))) return;
  }
  _KAS_SEDANG_SIMPAN = true;
  setGlobalLoading(true, "Menyimpan transaksi...");
  try {
    const row = {
      jenis, tanggal, nominal, akun_id: akunId, akun_tujuan_id: jenis === "transfer" ? akunTujuan : null,
      kategori_id: jenis === "transfer" ? null : kategoriId,
      pihak: qs("kt-pihak")?.value.trim() || null, keterangan: qs("kt-ket").value.trim() || null, metode: qs("kt-metode").value,
    };
    const file = qs("kt-bukti").files[0];
    if (file) row.bukti_url = await apiUploadFoto(file, "kas");
    if (id) row.id = id;
    else {
      // Nomor bukti otomatis per bulan & jenis: KM (kas masuk) / KK (kas keluar) / PS (pindah saldo)
      const awalan = { masuk: "KM", keluar: "KK", transfer: "PS" }[jenis];
      const ym = tanggal.slice(0, 7);
      const urut = KAS.semua.filter((x) => x.jenis === jenis && x.tanggal?.startsWith(ym)).length + 1;
      row.nomor_bukti = `${awalan}/${ym.replace("-", "")}/${String(urut).padStart(3, "0")}`;
      row.dicatat_oleh = STATE.guruId || null;
      row.dihapus = false;
    }
    await kasSimpanTransaksiApi(row);
    closeModal();
    toast(id ? "Transaksi diperbarui" : `Tercatat ✓ ${row.nomor_bukti || ""}`, "ok");
    KAS.bulan = tanggal.slice(0, 7);
    await kasMuatTransaksi();
    renderKas();
  } catch (e) { console.error(e); toast("Gagal menyimpan: " + _kasPesanGalat(e), "err"); }
  finally { _KAS_SEDANG_SIMPAN = false; setGlobalLoading(false); }
}
function bukaDetailKas(id) {
  const t = KAS.semua.find((x) => x.id === id);
  if (!t) return;
  const k = _kasKat(t.kategori_id), a = _kasAkun(t.akun_id), tj = _kasAkun(t.akun_tujuan_id);
  const pencatat = (LOOKUP.guruAll || []).find((g) => g.id === t.dicatat_oleh)?.nama;
  const baris = (l, v) => v ? `<div class="kas-lap-baris"><span>${l}</span><b style="text-align:right;">${v}</b></div>` : "";
  openModal(`
    <h3>${t.jenis === "masuk" ? "⬇️ Uang Masuk" : t.jenis === "keluar" ? "⬆️ Uang Keluar" : "🔁 Pindah Saldo"}</h3>
    <div class="kas-detail-nominal ${t.jenis}">${t.jenis === "masuk" ? "+" : t.jenis === "keluar" ? "−" : ""} ${_kasRp(t.nominal)}</div>
    ${baris("No. bukti", escapeHtml(t.nomor_bukti || "-"))}
    ${baris("Tanggal", _tglPendek(t.tanggal) + " " + t.tanggal.slice(0, 4))}
    ${baris("Kategori", k ? `${k.ikon || ""} ${escapeHtml(k.nama)}` : "")}
    ${baris(t.jenis === "transfer" ? "Dari → Ke" : "Akun", t.jenis === "transfer" ? `${escapeHtml(a?.nama || "-")} → ${escapeHtml(tj?.nama || "-")}` : escapeHtml(a?.nama || "-"))}
    ${baris(t.jenis === "masuk" ? "Diterima dari" : "Kepada", escapeHtml(t.pihak || ""))}
    ${baris("Metode", escapeHtml(t.metode || ""))}
    ${baris("Keterangan", escapeHtml(t.keterangan || ""))}
    ${baris("Dicatat oleh", escapeHtml(pencatat || ""))}
    ${t.bukti_url ? (/\.pdf(\?|$)/i.test(t.bukti_url) ? `<a class="btn btn-ghost" style="width:100%;margin-top:8px;" href="${t.bukti_url}" target="_blank" rel="noopener">📄 Buka bukti (PDF)</a>` : `<a href="${t.bukti_url}" target="_blank" rel="noopener"><img src="${t.bukti_url}" alt="Bukti" class="kas-bukti-img"/></a>`) : ""}
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-top:14px;">
      <button class="btn btn-outline" style="color:var(--bad);" onclick="hapusTransaksiKas('${t.id}')">🗑️ Hapus</button>
      <button class="btn btn-ghost" onclick="cetakKuitansiKas('${t.id}')">🧾 Kuitansi</button>
      <button class="btn btn-accent" onclick="bukaFormKas('${t.jenis}','${t.id}')">✏️ Ubah</button>
    </div>
  `);
}
function hapusTransaksiKas(id) {
  closeModal();
  // Soft-delete + jeda Batalkan: data tidak benar-benar hilang (jejak audit keuangan tetap ada).
  hapusDenganBatal({
    pesan: "Transaksi kas dihapus",
    jalankan: () => kasHapusTransaksiApi(id, true),
    setelah: async () => { await kasMuatTransaksi(); renderKas(); },
  });
}
async function cetakKuitansiKas(id) {
  const t = KAS.semua.find((x) => x.id === id);
  if (!t) return;
  const p = await apiGetPengaturanSekolah();
  const w = typeof _warnaDok === "function" ? _warnaDok() : { tua: "#1B4B38", utama: "#1F8A5F", lembut: "#E3F3EA" };
  const k = _kasKat(t.kategori_id), masuk = t.jenis === "masuk";
  const judul = masuk ? "Kuitansi" : t.jenis === "keluar" ? "Bukti Kas Keluar" : "Bukti Pindah Saldo";
  const sub = masuk ? "Official Receipt" : t.jenis === "keluar" ? "Payment Voucher" : "Fund Transfer Voucher";
  const baris = (l, v) => v ? `<tr><td>${l}</td><td>${v}</td></tr>` : "";
  const html = `${_kasDokCss(w)}<div class="kd" style="max-width:700px;margin:0 auto;">
    ${_kasDokKop(p, w, judul, sub)}
    <div class="kd-meta">
      <div><span class="kd-label">No. Bukti</span><b>${escapeHtml(t.nomor_bukti || "-")}</b></div>
      <div><span class="kd-label">Tanggal</span><b>${_kasTglPanjang(t.tanggal)}</b></div>
      <div><span class="kd-label">Metode</span><b>${escapeHtml(t.metode || "-")}</b></div>
      <div><span class="kd-label">Akun</span><b>${escapeHtml(_kasAkun(t.akun_id)?.nama || "-")}${t.jenis === "transfer" ? " → " + escapeHtml(_kasAkun(t.akun_tujuan_id)?.nama || "-") : ""}</b></div>
    </div>
    <div class="kd-nominal">
      <div class="kd-nominal-angka"><span class="kd-label">Jumlah</span><b>Rp ${_kasAngka(t.nominal)}</b></div>
      <div class="kd-nominal-huruf"><span class="kd-label">Terbilang</span><i>${_kasTerbilang(t.nominal)}</i></div>
    </div>
    <table class="kd-rinci">
      ${baris(masuk ? "Telah diterima dari" : "Dibayarkan kepada", escapeHtml(t.pihak || "-"))}
      ${baris("Kategori", escapeHtml(k?.nama || (t.jenis === "transfer" ? "Pindah saldo antar akun" : "-")))}
      ${baris("Untuk keperluan", escapeHtml(t.keterangan || "-"))}
    </table>
    <div style="display:flex;justify-content:flex-end;margin-top:14px;">${masuk ? `<span class="kd-cap">LUNAS</span>` : ""}</div>
    <div style="text-align:right;font-size:8.5pt;color:#4a5263;margin-top:10px;">${escapeHtml(p.tempat_terbit || "Barabai")}, ${_kasTglPanjang(t.tanggal)}</div>
    <div class="kd-ttd" style="grid-template-columns:1fr 1fr;margin-top:10px;">
      <div>${masuk ? "Penyetor" : "Penerima"},<div class="kd-garis">${escapeHtml(t.pihak || "( ............................ )")}</div></div>
      <div>Bendahara,<div class="kd-garis">${escapeHtml(_namaPjKas())}</div></div>
    </div>
    ${_kasDokKaki(t.nomor_bukti || "Kuitansi")}
  </div>`;
  eksporHtmlSebagaiPDF(`${judul} ${t.nomor_bukti || ""}`, html);
}

// ── IMPOR EXCEL (awal transisi dari pembukuan lama) ─────────
// Membaca format laporan kas yang sudah dipakai bendahara: beberapa baris judul, baris
// "SALDO AWAL BULAN INI", lalu tabel No | Tanggal | Uraian | Kategori | Jumlah | Harga Satuan |
// Masuk (Rp) | Keluar (Rp) | Saldo (Rp). Baris header dicari sendiri (tidak harus baris 1), tanggal
// kosong = melanjutkan tanggal di atasnya, angka boleh "Rp 108,000" / "(Rp 129,000)" / angka biasa.
// Semua baris ditinjau dulu di layar (kategori bisa diganti per baris) sebelum benar-benar disimpan.
const _KAS_BULAN_TEKS = { jan: 1, januari: 1, january: 1, feb: 2, peb: 2, februari: 2, pebruari: 2, february: 2, mar: 3, maret: 3, march: 3, apr: 4, april: 4, mei: 5, may: 5, jun: 6, juni: 6, june: 6, jul: 7, juli: 7, july: 7, agu: 8, agt: 8, ags: 8, agus: 8, agustus: 8, aug: 8, august: 8, sep: 9, sept: 9, september: 9, okt: 10, oct: 10, oktober: 10, october: 10, nov: 11, nop: 11, november: 11, nopember: 11, des: 12, dec: 12, desember: 12, december: 12 };
const _KAS_TEBAK_KATEGORI = {
  masuk: [
    [/spp|infa[qk]|syahriah|syariah|iuran|bulanan/, /infaq|spp/],
    [/donasi|sedekah|shodaqo|sodaqo|sadaqah|zakat|wakaf|hamba allah|donatur/, /donasi|sedekah/],
    [/\bbop\b|bosp?\b/, /bop/],
    [/hibah|bantuan|santunan/, /bantuan|hibah/],
  ],
  keluar: [
    [/honor|gaji|insentif|bisyarah|ustadz|ustaz|uang lelah|transport guru/, /honor|insentif/],
    [/listrik|pln|token|pdam|internet|wifi|wi-fi|indihome|pulsa|kuota|air bersih/, /listrik|air|internet/],
    [/bensin|bbm|pertalite|solar|ongkos|transport|ojek|parkir|angkot|travel|sewa mobil/, /transport/],
    [/makan|konsumsi|snack|kue|beras|lauk|sayur|ayam|ikan|telur|minyak|gula|kopi|teh\b|galon|air minum|nasi|bumbu|gas|elpiji|lpg|mie|roti|buah|daging|tahu|tempe/, /konsumsi/],
    [/atk|kertas|pulpen|pena|spidol|tinta|print|fotokopi|fotocopy|map\b|buku|perlengkapan|sabun|deterjen|pembersih|sapu|tisu|plastik/, /atk|perlengkapan/],
    [/perbaik|servis|service|tukang|\bcat\b|semen|bangunan|renov|keran|lampu|pipa|kunci|genteng|plafon/, /perawatan|gedung/],
    [/kegiatan|lomba|wisata|outing|hadiah|piala|wisuda|haflah|kemah|santri/, /kegiatan/],
  ],
};
function _kasImporAngka(v) {
  if (typeof v === "number") return isFinite(v) ? v : 0;
  const s = String(v ?? "").trim();
  if (!s || /^[-–—]+$/.test(s)) return 0;
  const minus = /^\(.*\)$/.test(s) || /-\s*(rp\.?\s*)?\d/i.test(s) || /rp\.?\s*-/i.test(s);
  const digit = s.replace(/[.,]\d{1,2}\s*\)?$/, "").replace(/\D/g, "");
  const n = Number(digit) || 0;
  return minus ? -n : n;
}
function _kasImporIso(y, m, d) {
  if (y < 100) y += 2000;
  if (!(y > 1990 && m >= 1 && m <= 12 && d >= 1 && d <= 31)) return null;
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}
function _kasImporTanggal(v, tahunBawaan) {
  if (v instanceof Date && !isNaN(v)) return _kasImporIso(v.getFullYear(), v.getMonth() + 1, v.getDate());
  if (typeof v === "number") {
    if (v > 20000 && v < 80000 && typeof XLSX !== "undefined") { const d = XLSX.SSF.parse_date_code(v); if (d) return _kasImporIso(d.y, d.m, d.d); }
    return null;
  }
  const s = String(v ?? "").trim().toLowerCase().replace(/^[a-z']+,\s*/, "");
  if (!s) return null;
  let m = s.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
  if (m) return _kasImporIso(+m[1], +m[2], +m[3]);
  m = s.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})/);
  if (m) return _kasImporIso(+m[3], +m[2], +m[1]);
  m = s.match(/^(\d{1,2})[\s\-]+([a-z]+)\.?[\s\-,]+(\d{2,4})/);
  if (m && _KAS_BULAN_TEKS[m[2]]) return _kasImporIso(+m[3], _KAS_BULAN_TEKS[m[2]], +m[1]);
  // Tanpa tahun, mis. "11-Oktober" / "11 Okt" → tahun diambil dari baris sebelumnya / periode sheet
  m = s.match(/^(\d{1,2})[\s\-/.]+([a-z]+)\.?$/);
  if (m && _KAS_BULAN_TEKS[m[2]] && tahunBawaan) return _kasImporIso(+tahunBawaan, _KAS_BULAN_TEKS[m[2]], +m[1]);
  m = s.match(/^(\d{1,2})[-/.](\d{1,2})$/);
  if (m && tahunBawaan) return _kasImporIso(+tahunBawaan, +m[2], +m[1]);
  return null;
}
function _kasTebakKategori(jenis, teks, teksKategori) {
  const daftar = KAS.kategori.filter((k) => k.jenis === jenis);
  const cari = (re) => daftar.find((k) => re.test(k.nama.toLowerCase()));
  const tk = String(teksKategori || "").trim().toLowerCase();
  if (tk) {
    // Hanya cocok kalau namanya sama / memuat utuh — "Dana Masuk" TIDAK boleh nyasar ke "Dana BOP".
    const pas = daftar.find((k) => k.nama.toLowerCase() === tk) || (tk.length >= 4 ? daftar.find((k) => k.nama.toLowerCase().includes(tk)) : null);
    if (pas) return { id: pas.id, yakin: true };
  }
  const u = String(teks || "").toLowerCase();
  for (const [kunci, reKat] of _KAS_TEBAK_KATEGORI[jenis]) {
    if (kunci.test(u)) { const k = cari(reKat); if (k) return { id: k.id, yakin: true }; }
  }
  const lain = cari(/lain/) || daftar[daftar.length - 1];
  return { id: lain?.id || null, yakin: false };
}
// Satu sheet → { saldoAwal, periodeYM, baris[] }. null kalau sheet ini bukan laporan kas.
function _kasBacaSheet(nama, aoa) {
  const teks = (c) => String(c ?? "").trim().toLowerCase();
  let h = -1, kol = null;
  for (let i = 0; i < Math.min(aoa.length, 40); i++) {
    const r = aoa[i].map(teks);
    const cariKol = (re, kecuali) => r.findIndex((c, j) => re.test(c) && !(kecuali || []).includes(j));
    const tgl = cariKol(/^(tanggal|tgl)\b/), ur = cariKol(/uraian|keterangan|deskripsi|rincian/);
    const ms = cariKol(/masuk|debit|penerimaan|pemasukan/), kl = cariKol(/keluar|kredit|pengeluaran/);
    if (tgl >= 0 && ur >= 0 && (ms >= 0 || kl >= 0)) {
      h = i;
      kol = { tgl, ur, ms, kl, no: cariKol(/^no\.?$|^nomor$/), kat: cariKol(/kategori|jenis/), qty: cariKol(/^(jumlah|qty|vol|volume|banyak)/, [ms, kl]), harga: cariKol(/harga/), saldo: cariKol(/saldo/) };
      break;
    }
  }
  if (h < 0) return null;
  let saldoAwal = null, periodeYM = null;
  for (let i = 0; i < h; i++) {
    const r = aoa[i];
    const idx = r.findIndex((c) => /saldo\s*awal/i.test(String(c)));
    if (idx >= 0) {
      const nilai = r.slice(idx + 1).find((c) => typeof c === "number" || /\d/.test(String(c)));
      if (nilai !== undefined) saldoAwal = _kasImporAngka(nilai);
    }
    const per = r.map((c) => String(c ?? "")).find((c) => /periode|bulan/i.test(c) && /\d{4}/.test(c));
    if (per && !periodeYM) {
      const th = per.match(/(19|20)\d{2}/)?.[0];
      const bl = (per.toLowerCase().match(/[a-z]+/g) || []).map((x) => _KAS_BULAN_TEKS[x]).find(Boolean);
      if (th && bl) periodeYM = `${th}-${String(bl).padStart(2, "0")}`;
    }
  }
  const baris = [];
  let tglKini = null, saldoAkhirFile = null, totalFile = null, berjalan = null, barisBeda = null;
  const tahunPeriode = periodeYM ? +periodeYM.slice(0, 4) : null;
  for (let i = h + 1; i < aoa.length; i++) {
    const r = aoa[i];
    const uraian = String(r[kol.ur] ?? "").trim();
    const label = [r[kol.no], r[kol.tgl], uraian].map((c) => String(c ?? "").trim()).join(" ");
    const masuk = kol.ms >= 0 ? Math.abs(_kasImporAngka(r[kol.ms])) : 0;
    const keluar = kol.kl >= 0 ? Math.abs(_kasImporAngka(r[kol.kl])) : 0;
    const saldoFile = kol.saldo >= 0 && String(r[kol.saldo] ?? "").trim() !== "" ? _kasImporAngka(r[kol.saldo]) : null;
    if (/saldo\s*awal/i.test(label)) { if (saldoAwal === null) saldoAwal = saldoFile ?? (masuk || 0); continue; }
    // Baris TOTAL / JUMLAH — juga yang TANPA label (cuma angka di bawah tabel, uraian kosong).
    // Dulu baris ini ikut terbaca sebagai transaksi "(tanpa uraian)" sehingga saldo jadi kacau.
    if (/^\s*(total|jumlah|sub\s*total|saldo)/i.test(label) || /saldo\s*akhir/i.test(label) || (!uraian && (masuk || keluar))) {
      if (masuk || keluar) totalFile = { masuk, keluar, barisFile: i + 1 };
      if (saldoFile !== null) saldoAkhirFile = saldoFile;
      continue;
    }
    if (berjalan === null) berjalan = saldoAwal || 0;
    const tglSel = _kasImporTanggal(r[kol.tgl], tglKini ? +tglKini.slice(0, 4) : tahunPeriode);
    if (tglSel) tglKini = tglSel;
    berjalan += masuk - keluar;
    // Cocokkan saldo berjalan dengan kolom Saldo di file, BARIS PER BARIS — selisih sekecil apa pun ketahuan
    if (saldoFile !== null && Math.round(saldoFile) !== Math.round(berjalan) && !barisBeda) barisBeda = { barisFile: i + 1, uraian, hitung: berjalan, file: saldoFile };
    if (!masuk && !keluar) continue;
    if (saldoFile !== null) saldoAkhirFile = saldoFile;
    const qty = kol.qty >= 0 ? String(r[kol.qty] ?? "").trim() : "";
    const harga = kol.harga >= 0 ? _kasImporAngka(r[kol.harga]) : 0;
    const rincian = qty && harga ? ` (${qty} × Rp ${formatRibuan(harga)})` : qty && !/^1(\.0+)?$/.test(qty) ? ` (${qty})` : "";
    const teksKat = kol.kat >= 0 ? String(r[kol.kat] ?? "").trim() : "";
    [["masuk", masuk], ["keluar", keluar]].forEach(([jenis, nominal]) => {
      if (!nominal) return;
      const tebak = _kasTebakKategori(jenis, uraian, teksKat);
      baris.push({ sheet: nama, barisFile: i + 1, tanggal: tglKini, tanpaTanggal: !tglKini, jenis, nominal: Math.round(nominal), keterangan: (uraian || "(tanpa uraian)") + rincian, kategori_id: tebak.id, yakin: tebak.yakin, pilih: true });
    });
  }
  // Periode diambil dari tanggal transaksi yang benar-benar ada (judul "Periode:" di file bisa lupa
  // diganti, mis. sheet Oktober masih bertuliskan September).
  const tglPertama = baris.find((b) => b.tanggal)?.tanggal;
  const periodeJudul = periodeYM;
  if (tglPertama) periodeYM = tglPertama.slice(0, 7);
  // Baris yang tanggalnya tidak terbaca sama sekali TIDAK ditebak — ditandai supaya diisi manual dulu
  const masuk = baris.reduce((s, b) => s + (b.jenis === "masuk" ? b.nominal : 0), 0);
  const keluar = baris.reduce((s, b) => s + (b.jenis === "keluar" ? b.nominal : 0), 0);
  const akhirHitung = (saldoAwal || 0) + masuk - keluar;
  return {
    nama, saldoAwal, periodeYM, periodeJudul, saldoAkhirFile, totalFile, barisBeda, baris,
    masuk, keluar, akhirHitung,
    cocokSaldo: saldoAkhirFile === null || Math.round(saldoAkhirFile) === Math.round(akhirHitung),
    cocokTotal: !totalFile || (totalFile.masuk === masuk && totalFile.keluar === keluar),
  };
}
function kasPilihFileImpor() {
  if (!KAS.siap) { toast(KAS.galat || "Kas belum siap", "err"); return; }
  if (!KAS.akun.length) { toast("Tambahkan akun kas dulu di tab Atur", "err"); return; }
  const inp = document.createElement("input");
  inp.type = "file"; inp.accept = ".xlsx,.xls,.csv";
  inp.onchange = () => { if (inp.files[0]) kasBacaFileImpor(inp.files[0]); };
  inp.click();
}
async function kasBacaFileImpor(file) {
  if (typeof XLSX === "undefined") { toast("Pustaka Excel belum termuat, coba refresh halaman.", "err"); return; }
  setGlobalLoading(true, "Membaca file...");
  try {
    const wb = XLSX.read(await file.arrayBuffer(), { type: "array" });
    const hasil = wb.SheetNames.map((n) => _kasBacaSheet(n, XLSX.utils.sheet_to_json(wb.Sheets[n], { header: 1, raw: true, defval: "" }))).filter((s) => s && s.baris.length);
    if (!hasil.length) { toast("Format tidak dikenali — pastikan ada kolom Tanggal, Uraian, dan Masuk/Keluar.", "err"); return; }
    hasil.sort((a, b) => String(a.periodeYM).localeCompare(String(b.periodeYM)));
    // Sambungan antar sheet: saldo awal sheet berikutnya HARUS sama dengan saldo akhir sheet sebelumnya
    hasil.forEach((s, i) => {
      s.urut = i;
      s.baris.forEach((b) => { b.urutSheet = i; });
      const prev = hasil[i - 1];
      s.sambung = !prev || s.saldoAwal === null || Math.round(s.saldoAwal) === Math.round(prev.akhirHitung);
      s.ok = s.cocokSaldo && s.cocokTotal && !s.barisBeda && s.sambung && !s.baris.some((b) => !b.tanggal);
    });
    const baris = hasil.flatMap((s) => s.baris);
    // Tandai yang sudah pernah tercatat (tanggal + jenis + nominal + uraian sama) supaya impor ulang tidak dobel
    baris.forEach((b) => {
      b.duplikat = KAS.semua.some((t) => t.tanggal === b.tanggal && t.jenis === b.jenis && Number(t.nominal) === b.nominal && (t.keterangan || "") === b.keterangan);
      if (b.duplikat) b.pilih = false;
    });
    const akunTunai = KAS.akun.find((a) => a.jenis === "tunai") || KAS.akun[0];
    const pertama = hasil[0];
    const akunKosong = !KAS.semua.some((t) => t.akun_id === akunTunai.id || t.akun_tujuan_id === akunTunai.id) && !Number(akunTunai.saldo_awal);
    KAS.impor = { file: file.name, sheet: hasil, baris, akunId: akunTunai.id, saldoAwal: pertama.saldoAwal, periodeAwal: pertama.periodeYM, saldoAkhirFile: hasil[hasil.length - 1].saldoAkhirFile, pakaiSaldoAwal: pertama.saldoAwal !== null && akunKosong, filter: "", setujuBeda: false };
    bukaPratinjauImporKas();
  } catch (e) { console.error(e); toast("Gagal membaca file: " + e.message, "err"); }
  finally { setGlobalLoading(false); }
}
function _kasImporRingkas() {
  const I = KAS.impor, pilih = I.baris.filter((b) => b.pilih);
  const masuk = pilih.filter((b) => b.jenis === "masuk").reduce((s, b) => s + b.nominal, 0);
  const keluar = pilih.filter((b) => b.jenis === "keluar").reduce((s, b) => s + b.nominal, 0);
  const terakhir = I.sheet[I.sheet.length - 1];
  const hitungAkhir = (I.saldoAwal || 0) + I.sheet.reduce((s, x) => s + x.masuk - x.keluar, 0);
  const semuaOk = I.sheet.every((x) => x.ok);
  const tanpaTanggal = pilih.filter((b) => !b.tanggal).length;
  return { pilih, masuk, keluar, hitungAkhir, akhirFile: terakhir.saldoAkhirFile, semuaOk, tanpaTanggal,
    bolehImpor: pilih.length > 0 && !tanpaTanggal && (semuaOk || I.setujuBeda) };
}
// Kartu pemeriksaan per sheet: saldo awal, masuk, keluar, saldo akhir hitungan aplikasi vs file,
// baris pertama yang saldonya mulai beda, dan sambungan saldo antar sheet.
function _kasImporHtmlCek() {
  const I = KAS.impor;
  return I.sheet.map((x) => {
    const masalah = [];
    if (x.barisBeda) masalah.push(`Saldo mulai beda di <b>baris ${x.barisBeda.barisFile}</b> (${escapeHtml(x.barisBeda.uraian || "-")}): aplikasi ${_kasRp(x.barisBeda.hitung)}, file ${_kasRp(x.barisBeda.file)}`);
    if (!x.cocokSaldo) masalah.push(`Saldo akhir aplikasi ${_kasRp(x.akhirHitung)} ≠ file ${_kasRp(x.saldoAkhirFile)}`);
    if (!x.cocokTotal) masalah.push(`Total di file (masuk ${_kasRp(x.totalFile.masuk)} / keluar ${_kasRp(x.totalFile.keluar)}) ≠ jumlah baris (masuk ${_kasRp(x.masuk)} / keluar ${_kasRp(x.keluar)})`);
    if (!x.sambung) masalah.push(`Saldo awal ${_kasRp(x.saldoAwal)} tidak sama dengan saldo akhir sheet sebelumnya`);
    const nTanpa = x.baris.filter((b) => !b.tanggal).length;
    if (nTanpa) masalah.push(`${nTanpa} baris tanggalnya tidak terbaca — isi tanggalnya di daftar bawah`);
    return `<div class="kas-imp-cek ${x.ok ? "ok" : "beda"}">
      <div class="kas-imp-cek-kepala"><b>${x.ok ? "✓" : "⚠"} ${escapeHtml(x.nama)}</b><span>${x.periodeYM ? namaBulanIndo(x.periodeYM) : ""} · ${x.baris.length} transaksi</span></div>
      <div class="kas-imp-cek-angka">
        <span>Awal <b>${_kasRp(x.saldoAwal || 0)}</b></span><span class="m">+ ${_kasRp(x.masuk)}</span><span class="k">− ${_kasRp(x.keluar)}</span>
        <span>Akhir <b>${_kasRp(x.akhirHitung)}</b></span><span>File <b>${x.saldoAkhirFile === null ? "–" : _kasRp(x.saldoAkhirFile)}</b></span>
      </div>
      ${masalah.length ? `<ul>${masalah.map((m) => `<li>${m}</li>`).join("")}</ul>` : ""}
    </div>`;
  }).join("");
}
function _kasImporHtmlBaris() {
  const I = KAS.impor;
  const tampil = I.baris.map((b, i) => ({ b, i })).filter(({ b }) => !I.filter || (I.filter === "ragu" ? !b.yakin : I.filter === "dobel" ? b.duplikat : I.filter === "tgl" ? !b.tanggal : b.jenis === I.filter));
  if (!tampil.length) return `<div class="kas-imp-kosong">Tidak ada baris untuk filter ini.</div>`;
  let tglSebelum;
  return tampil.map(({ b, i }) => {
    const kepala = b.tanggal !== tglSebelum ? `<div class="kas-imp-tgl">${b.tanggal ? _kasTglDok(b.tanggal) : "⚠ Tanggal belum terbaca"}</div>` : "";
    tglSebelum = b.tanggal;
    const opsi = KAS.kategori.filter((k) => k.jenis === b.jenis).map((k) => `<option value="${k.id}" ${k.id === b.kategori_id ? "selected" : ""}>${k.ikon || ""} ${escapeHtml(k.nama)}</option>`).join("");
    return `${kepala}<div class="kas-imp-baris ${b.pilih ? "" : "mati"} ${b.jenis}">
      <input type="checkbox" ${b.pilih ? "checked" : ""} onchange="KAS.impor.baris[${i}].pilih=this.checked;_kasImporSegarkan()" aria-label="Ikut diimpor"/>
      <div class="kas-imp-ur"><div>${escapeHtml(b.keterangan)}</div>
        ${!b.tanggal ? `<input type="date" class="input kas-imp-tgl-isi" onchange="KAS.impor.baris[${i}].tanggal=this.value||null;_kasImporSegarkan()" aria-label="Isi tanggal"/>` : ""}
        <div class="kas-imp-tag">${b.duplikat ? `<span class="dobel">sudah tercatat</span>` : ""}${!b.yakin ? `<span class="ragu">cek kategori</span>` : ""}<span>${escapeHtml(b.sheet)} · baris ${b.barisFile}</span></div></div>
      <select class="input kas-imp-kat" onchange="KAS.impor.baris[${i}].kategori_id=this.value;KAS.impor.baris[${i}].yakin=true;_kasImporSegarkan()">${opsi}</select>
      <div class="kas-imp-nom">${b.jenis === "masuk" ? "+" : "−"} ${_kasRp(b.nominal)}</div>
    </div>`;
  }).join("");
}
function _kasImporSegarkan() {
  const el = qs("kas-imp-daftar"); if (!el) return;
  const I = KAS.impor;
  // Tanggal yang diisi manual ikut menentukan status sheet
  I.sheet.forEach((x) => { x.ok = x.cocokSaldo && x.cocokTotal && !x.barisBeda && x.sambung && !x.baris.some((b) => !b.tanggal); });
  const scroll = el.scrollTop;
  el.innerHTML = _kasImporHtmlBaris(); el.scrollTop = scroll;
  qs("kas-imp-cek").innerHTML = _kasImporHtmlCek();
  const s = _kasImporRingkas();
  const kpi = qs("kas-imp-status");
  kpi.className = s.semuaOk ? "ok" : "beda";
  kpi.innerHTML = `<small>Cek saldo file</small><b>${s.semuaOk ? "✓ Semua cocok" : "⚠ Ada selisih"}</b>`;
  qs("kas-imp-setuju-wrap").hidden = s.semuaOk;
  const tombol = qs("kas-imp-tombol");
  tombol.innerHTML = s.tanpaTanggal ? `Isi ${s.tanpaTanggal} tanggal dulu` : !s.semuaOk && !I.setujuBeda ? "Periksa selisih dulu" : `📥 Impor ${s.pilih.length} transaksi`;
  tombol.disabled = !s.bolehImpor;
  qs("kas-imp-total").innerHTML = `<span class="masuk">+ ${_kasRp(s.masuk)}</span><span class="keluar">− ${_kasRp(s.keluar)}</span>`;
  qsa(".kas-imp-filter button").forEach((b) => b.classList.toggle("aktif", (b.dataset.f || "") === (I.filter || "")));
}
function bukaPratinjauImporKas() {
  const I = KAS.impor, s = _kasImporRingkas();
  const nRagu = I.baris.filter((b) => !b.yakin).length, nDobel = I.baris.filter((b) => b.duplikat).length, nTgl = I.baris.filter((b) => !b.tanggal).length;
  openModal(`
    <h3>📥 Impor Buku Kas dari Excel</h3>
    <div class="kas-imp-file">📄 <b>${escapeHtml(I.file)}</b> · ${I.sheet.length} sheet · ${I.baris.length} transaksi terbaca</div>
    <div class="kas-imp-kpi">
      <div><small>Saldo awal (file)</small><b>${I.saldoAwal === null ? "–" : _kasRp(I.saldoAwal)}</b></div>
      <div><small>Saldo akhir dihitung</small><b>${_kasRp(s.hitungAkhir)}</b></div>
      <div id="kas-imp-status"></div>
    </div>
    <div class="kas-imp-cek-daftar" id="kas-imp-cek"></div>
    <label class="kas-imp-opsi kas-imp-setuju" id="kas-imp-setuju-wrap" hidden><input type="checkbox" ${I.setujuBeda ? "checked" : ""} onchange="KAS.impor.setujuBeda=this.checked;_kasImporSegarkan()"/>
      <span>Saya sudah memeriksa selisih di atas dan tetap ingin mengimpor<small>Sebaiknya perbaiki dulu file Excel-nya, lalu impor ulang — supaya saldo di aplikasi sama persis dengan pembukuan.</small></span></label>
    <div style="display:flex;gap:10px;flex-wrap:wrap;">
      <div class="field" style="flex:1;min-width:170px;"><label class="form-label">Catat ke akun</label>
        <select class="input" onchange="KAS.impor.akunId=this.value">${KAS.akun.map((a) => `<option value="${a.id}" ${a.id === I.akunId ? "selected" : ""}>${escapeHtml(a.nama)}</option>`).join("")}</select></div>
    </div>
    ${I.saldoAwal !== null ? `<label class="kas-imp-opsi"><input type="checkbox" ${I.pakaiSaldoAwal ? "checked" : ""} onchange="KAS.impor.pakaiSaldoAwal=this.checked"/>
      <span>Jadikan <b>${_kasRp(I.saldoAwal)}</b> sebagai saldo awal akun ini per <b>${I.periodeAwal ? _kasTglDok(I.periodeAwal + "-01") : "-"}</b><small>Centang untuk awal transisi (akun masih kosong). Kalau akun sudah berjalan, biarkan tidak dicentang.</small></span></label>` : ""}
    <div class="kas-imp-filter">
      <button type="button" data-f="" onclick="KAS.impor.filter='';_kasImporSegarkan()">Semua</button>
      <button type="button" data-f="masuk" onclick="KAS.impor.filter='masuk';_kasImporSegarkan()">Masuk</button>
      <button type="button" data-f="keluar" onclick="KAS.impor.filter='keluar';_kasImporSegarkan()">Keluar</button>
      ${nTgl ? `<button type="button" data-f="tgl" onclick="KAS.impor.filter='tgl';_kasImporSegarkan()">Tanpa tanggal (${nTgl})</button>` : ""}
      ${nRagu ? `<button type="button" data-f="ragu" onclick="KAS.impor.filter='ragu';_kasImporSegarkan()">Cek kategori (${nRagu})</button>` : ""}
      ${nDobel ? `<button type="button" data-f="dobel" onclick="KAS.impor.filter='dobel';_kasImporSegarkan()">Sudah tercatat (${nDobel})</button>` : ""}
    </div>
    <div class="kas-imp-daftar" id="kas-imp-daftar"></div>
    <div class="kas-imp-kaki">
      <div class="kas-imp-total" id="kas-imp-total"></div>
      <button class="btn btn-accent" id="kas-imp-tombol" onclick="kasJalankanImpor()">📥 Impor</button>
    </div>
  `);
  _kasImporSegarkan();
}
let _KAS_SEDANG_IMPOR = false;
async function kasJalankanImpor() {
  const I = KAS.impor;
  if (!I || _KAS_SEDANG_IMPOR) return;
  const s = _kasImporRingkas();
  if (!s.bolehImpor) return;
  const { pilih } = s;
  const akun = _kasAkun(I.akunId);
  if (!(await konfirmasiTema(`Impor ${pilih.length} transaksi ke akun "${akun?.nama}"?${I.pakaiSaldoAwal ? ` Saldo awal akun diatur ke ${_kasRp(I.saldoAwal)}.` : ""}`, { ikon: "📥", judul: "Impor Buku Kas" }))) return;
  _KAS_SEDANG_IMPOR = true;
  setGlobalLoading(true, "Mengimpor transaksi...");
  try {
    // Saldo akun yang SEHARUSNYA setelah impor — dipakai untuk verifikasi ulang dari database
    const saldoSebelum = kasSaldoAkun(I.akunId);
    const ubahSaldoAwal = I.pakaiSaldoAwal && I.saldoAwal !== null ? Math.round(I.saldoAwal) - (Number(akun?.saldo_awal) || 0) : 0;
    const saldoHarus = saldoSebelum + ubahSaldoAwal + s.masuk - s.keluar;
    // Nomor bukti melanjutkan urutan yang sudah ada per bulan & jenis (KM/KK/YYYYMM/NNN)
    const hitung = {};
    KAS.semua.forEach((t) => { const k = `${t.jenis}|${t.tanggal?.slice(0, 7)}`; hitung[k] = (hitung[k] || 0) + 1; });
    const urut = [...pilih].sort((a, b) => a.tanggal.localeCompare(b.tanggal) || a.urutSheet - b.urutSheet || a.barisFile - b.barisFile);
    // dibuat_at dibuat berurutan per milidetik supaya urutan di Buku Kas SAMA dengan urutan baris di
    // file (dulu semua baris satu impor punya jam yang sama → urutan dalam satu hari teracak).
    const t0 = Date.now();
    const rows = urut.map((b, i) => {
      const ym = b.tanggal.slice(0, 7), k = `${b.jenis}|${ym}`;
      hitung[k] = (hitung[k] || 0) + 1;
      return { jenis: b.jenis, tanggal: b.tanggal, nominal: b.nominal, akun_id: I.akunId, akun_tujuan_id: null, kategori_id: b.kategori_id || null,
        pihak: null, keterangan: b.keterangan, metode: "Impor Excel", dicatat_oleh: STATE.guruId || null, dihapus: false,
        dibuat_at: new Date(t0 + i).toISOString(),
        nomor_bukti: `${b.jenis === "masuk" ? "KM" : "KK"}/${ym.replace("-", "")}/${String(hitung[k]).padStart(3, "0")}` };
    });
    for (let i = 0; i < rows.length; i += 200) {
      const { error } = await supa.from("kas_transaksi").insert(rows.slice(i, i + 200));
      if (error) throw error;
    }
    if (I.pakaiSaldoAwal && I.saldoAwal !== null) {
      await kasSimpanMaster("kas_akun", { id: I.akunId, saldo_awal: Math.round(I.saldoAwal), tanggal_saldo_awal: I.periodeAwal ? `${I.periodeAwal}-01` : rows[0].tanggal });
    }
    closeModal();
    KAS.impor = null;
    KAS.bulan = rows[rows.length - 1].tanggal.slice(0, 7);
    KAS.tab = "buku";
    await renderKasInit();
    // Verifikasi: baca ulang dari database & bandingkan saldo akun dengan hitungan file
    const saldoKini = kasSaldoAkun(I.akunId);
    if (Math.round(saldoKini) === Math.round(saldoHarus)) toast(`✓ ${rows.length} transaksi diimpor · saldo ${akun?.nama} ${_kasRp(saldoKini)} — sama dengan file`, "ok");
    else await konfirmasiTema(`Impor selesai, tetapi saldo ${akun?.nama} di aplikasi ${_kasRp(saldoKini)} sedangkan seharusnya ${_kasRp(saldoHarus)}. Gunakan "Batalkan hasil impor" di tab Atur lalu impor ulang.`, { ikon: "⚠️", judul: "Saldo Tidak Sama" });
  } catch (e) { console.error(e); toast("Gagal mengimpor: " + _kasPesanGalat(e), "err"); }
  finally { _KAS_SEDANG_IMPOR = false; setGlobalLoading(false); }
}
// Batalkan seluruh hasil impor Excel (soft-delete, jejak tetap ada) — untuk mengulang impor dari awal
async function kasBatalkanImpor() {
  const hasil = KAS.semua.filter((t) => t.metode === "Impor Excel");
  if (!hasil.length) { toast("Tidak ada transaksi hasil impor", "err"); return; }
  if (!(await konfirmasiTema(`Hapus ${hasil.length} transaksi hasil impor Excel? Transaksi yang dicatat manual tidak ikut terhapus. Setelah itu Anda bisa impor ulang.`, { ikon: "↩️", judul: "Batalkan Hasil Impor" }))) return;
  setGlobalLoading(true, "Membatalkan impor...");
  try {
    const ids = hasil.map((t) => t.id);
    for (let i = 0; i < ids.length; i += 200) {
      const { error } = await supa.from("kas_transaksi").update({ dihapus: true, diubah_at: new Date().toISOString() }).in("id", ids.slice(i, i + 200));
      if (error) throw error;
    }
    toast(`${ids.length} transaksi hasil impor dibatalkan`, "ok");
    await renderKasInit();
  } catch (e) { toast("Gagal: " + _kasPesanGalat(e), "err"); }
  finally { setGlobalLoading(false); }
}

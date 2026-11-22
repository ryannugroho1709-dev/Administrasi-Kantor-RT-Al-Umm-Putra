// ============================================================
//  ARSIP ARKAS — cetakan resmi "Rincian Kertas Kerja Perbulan" dari ARKAS disimpan per tahun
//  • Data tiap baris (kode rekening, kode program, uraian, volume, satuan, tarif, jumlah) disimpan di
//    kv "bosp:arkas:<tahun>" (ruang "*"): { info, nama:{kode→nama kegiatan}, Murni:{bulan:{…}},
//    Pergeseran:{…}, Perubahan:{…} }. Baris: [rek, kode, uraian, vol, satuan, tarif, jumlah].
//  • PDF aslinya disimpan di Arsip Drive "03 BOSP/<tahun>/ARKAS/<versi>" (tautan di field pdf).
//  • Tampilan: Ringkasan per bulan, Rincian per bulan (bisa dibandingkan dengan RKAS awal),
//    Pola Belanja (kegiatan/rekening/barang yang sering dipakai) → bahan belajar tahun berikutnya.
// ============================================================
const ARK = { th: null, d: null, tahunAda: [], tab: "ringkas", versi: "Final", bulan: 1, pola: "kegiatan" };
const ARK_VERSI = ["Murni", "Pergeseran", "Perubahan"];
const ARK_BLN = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
const _arkE = (s) => (typeof escapeHtml === "function" ? escapeHtml(String(s ?? "")) : String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]));
const _arkRp = (n) => Number(n || 0).toLocaleString("id-ID");
const _arkProgNama = (k) => (typeof BSP_PROGRAM_ARKAS !== "undefined" && BSP_PROGRAM_ARKAS[k]) || "";

async function _arkMuat(th) {
  const r = await supaSemua.from("kuliah_pengaturan").select("kunci,nilai").eq("ruang_id", "*").like("kunci", "bosp:arkas:%");
  if (r.error) throw r.error;
  const semua = {};
  (r.data || []).forEach((x) => { const t = x.kunci.split(":")[2]; if (/^\d{4}$/.test(t)) semua[t] = x.nilai || {}; });
  ARK.tahunAda = Object.keys(semua).sort().reverse();
  ARK.th = th && semua[th] ? String(th) : ARK.tahunAda[0] || null;
  ARK.d = ARK.th ? semua[ARK.th] : null;
}
// Versi terakhir yang berlaku untuk bulan m (Perubahan > Pergeseran > Murni)
function _arkVersiAkhir(m) { for (const v of ["Perubahan", "Pergeseran", "Murni"]) if (ARK.d && ARK.d[v] && ARK.d[v][m]) return v; return null; }
function _arkData(versi, m) {
  if (!ARK.d) return null;
  const v = versi === "Final" ? _arkVersiAkhir(m) : versi;
  return v && ARK.d[v] && ARK.d[v][m] ? { versi: v, ...ARK.d[v][m] } : null;
}
const _arkBaris = (b) => ({ rek: b[0], kode: b[1], uraian: b[2], vol: b[3], sat: b[4], tarif: b[5], jumlah: b[6] });

async function bspArsipArkas(th) {
  try {
    if (typeof setGlobalLoading === "function") setGlobalLoading(true, "Membuka Arsip ARKAS…");
    await _arkMuat(th || ARK.th || (typeof BSP !== "undefined" && BSP.th));
  } catch (e) { toast("Gagal memuat arsip: " + e.message, "err"); return; }
  finally { if (typeof setGlobalLoading === "function") setGlobalLoading(false); }
  if (!ARK.d) { openModal(`<h3>🗂 Arsip ARKAS</h3><p>Belum ada cetakan ARKAS yang diarsipkan.</p>`); return; }
  // statistik kecil untuk pita judul
  const versiAda = ARK_VERSI.filter((v) => ARK.d[v] && Object.keys(ARK.d[v]).length);
  const jmlCetak = versiAda.reduce((n, v) => n + Object.keys(ARK.d[v]).length, 0);
  const pagu = (ARK.d.info && ARK.d.info.pagu) || 0;
  const ik = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  const IK = {
    ringkas: ik('<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/>'),
    rinci: ik('<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>'),
    pola: ik('<circle cx="12" cy="12" r="8"/><path d="M12 4v8l6 4"/>'),
  };
  openModal(`<div class="ark">
    <div class="ark-hero">
      <svg class="ark-hero-hias" viewBox="0 0 400 160" preserveAspectRatio="xMaxYMid slice" aria-hidden="true">
        <g fill="none" stroke="currentColor" stroke-width="1.2" opacity=".5">
          <circle cx="340" cy="20" r="70"/><circle cx="340" cy="20" r="46"/><circle cx="395" cy="140" r="38"/>
          <path d="M210 150 L250 112 L282 128 L322 82 L360 98 L398 56"/>
        </g>
        <g fill="currentColor" opacity=".55"><circle cx="250" cy="112" r="3"/><circle cx="282" cy="128" r="3"/><circle cx="322" cy="82" r="3"/><circle cx="360" cy="98" r="3"/></g>
        <g fill="none" stroke="currentColor" stroke-width="1.3" opacity=".35"><rect x="150" y="96" width="26" height="54" rx="3"/><rect x="182" y="70" width="26" height="80" rx="3"/></g>
      </svg>
      <div class="ark-hero-ikon">${ik('<path d="M4 4h11l5 5v11a1 1 0 0 1-1 1H4z"/><path d="M15 4v5h5"/><path d="M8 13h8M8 17h5"/><circle cx="17.5" cy="17.5" r="0"/>')}</div>
      <div class="ark-hero-teks">
        <span class="ark-hero-label">BOSP Kesetaraan · Kertas Kerja</span>
        <h3>Arsip ARKAS</h3>
        <p>Salinan cetakan resmi <b>Rincian Kertas Kerja Perbulan</b> — mudah dicari &amp; jadi bahan belajar menyusun anggaran tahun berikutnya.</p>
        <div class="ark-hero-chip">
          <span>${ik('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>')} Tahun
            <select id="ark-th" onchange="bspArsipArkas(this.value)">${ARK.tahunAda.map((t) => `<option ${t === ARK.th ? "selected" : ""}>${t}</option>`).join("")}</select></span>
          <span>${ik('<path d="M12 3v18M17 7H9.5a3 3 0 0 0 0 6h5a3 3 0 0 1 0 6H6"/>')} Pagu <b>Rp ${_arkRp(pagu)}</b></span>
          <span>${ik('<path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5"/>')} <b>${jmlCetak}</b> cetakan · ${versiAda.length} versi</span>
        </div>
      </div>
    </div>
    <div class="ark-tab">${[["ringkas", "Ringkasan"], ["rinci", "Rincian Bulanan"], ["pola", "Pola Belanja"]].map(([k, n]) => `<button class="${ARK.tab === k ? "aktif" : ""}" onclick="ARK.tab='${k}';_arkGambar()">${IK[k]}<span>${n}</span></button>`).join("")}</div>
    <div id="ark-isi"></div></div>`, { lebar: true });
  qs("modal-panel").classList.add("ark-modal");
  _arkGambar();
}

function _arkGambar() {
  document.querySelectorAll(".ark-tab button").forEach((b, i) => b.classList.toggle("aktif", ["ringkas", "rinci", "pola"][i] === ARK.tab));
  const el = qs("ark-isi"); if (!el) return;
  el.innerHTML = ARK.tab === "rinci" ? _arkHtmlRinci() : ARK.tab === "pola" ? _arkHtmlPola() : _arkHtmlRingkas();
}

// ── 1. Ringkasan per bulan ──
function _arkHtmlRingkas() {
  const d = ARK.d, pagu = (d.info && d.info.pagu) || 0;
  const versiAda = ARK_VERSI.filter((v) => d[v] && Object.keys(d[v]).length);
  let totFinal = 0; const tot = {}; let maks = 1;
  const baris = ARK_BLN.map((nm, i) => {
    const m = i + 1, akhir = _arkData("Final", m);
    const f = akhir ? akhir.jumlah : 0; totFinal += f; maks = Math.max(maks, f);
    return { m, nm, akhir, f };
  });
  const sel = baris.map((b) => `<tr><td>${b.nm}</td>${versiAda.map((v) => { const x = d[v][b.m]; if (x) tot[v] = (tot[v] || 0) + x.jumlah; return `<td class="r${v !== "Murni" ? " ark-hp-x" : ""}">${x ? _arkRp(x.jumlah) : `<span class="ark-redup">—</span>`}</td>`; }).join("")}
    <td class="r"><b>${_arkRp(b.f)}</b>${b.akhir && b.akhir.versi !== "Murni" ? ` <span class="ark-chip">${b.akhir.versi}</span>` : ""}</td>
    <td class="ark-bar-td"><div class="ark-bar" style="width:${Math.round((b.f / maks) * 100)}%"></div></td>
    <td><button class="btn btn-sm btn-ghost" onclick="ARK.tab='rinci';ARK.bulan=${b.m};ARK.versi='Final';_arkGambar()">Rincian</button></td></tr>`).join("");
  const info = (d.info && d.info.versi) || {};
  return `<div class="ark-kartu-baris">
      <div class="ark-kartu k-pagu"><i></i><span>Pagu BOSP ${ARK.th}</span><b>Rp ${_arkRp(pagu)}</b></div>
      <div class="ark-kartu k-belanja"><i></i><span>Total Belanja (versi terakhir)</span><b>Rp ${_arkRp(totFinal)}</b></div>
      <div class="ark-kartu k-sisa"><i></i><span>${totFinal <= pagu ? "Sisa" : "Lebih dari pagu"}</span><b>Rp ${_arkRp(Math.abs(pagu - totFinal))}</b></div></div>
    <div class="ark-ket ark-info" style="margin:10px 0">${versiAda.map((v) => `<div>• <b>${v}</b>: ${_arkE(info[v] || "")}</div>`).join("")}
      <div>• Kolom <b>Berlaku</b> = versi terakhir untuk bulan itu (Perubahan → Pergeseran → RKAS awal).</div></div>
    <div class="table-wrap"><table class="ark-t ark-ringkas"><thead><tr><th>Bulan</th>${versiAda.map((v) => `<th class="r${v !== "Murni" ? " ark-hp-x" : ""}">${v === "Murni" ? "RKAS Awal" : v}</th>`).join("")}<th class="r">Berlaku</th><th class="ark-bar-td"></th><th></th></tr></thead>
    <tbody>${sel}</tbody><tfoot><tr><td>Jumlah</td>${versiAda.map((v) => `<td class="r${v !== "Murni" ? " ark-hp-x" : ""}">${_arkRp(tot[v] || 0)}</td>`).join("")}<td class="r"><b>${_arkRp(totFinal)}</b></td><td class="ark-bar-td"></td><td></td></tr></tfoot></table></div>`;
}

// ── 2. Rincian satu bulan (struktur Program → Sub Program → Kegiatan seperti cetakan ARKAS) ──
function _arkHtmlRinci() {
  const m = ARK.bulan, x = _arkData(ARK.versi, m);
  const pilihVersi = ["Final", ...ARK_VERSI.filter((v) => ARK.d[v] && ARK.d[v][m])];
  const kepala = `<div class="ark-atas">
    <label>Bulan <select onchange="ARK.bulan=+this.value;_arkGambar()">${ARK_BLN.map((n, i) => `<option value="${i + 1}" ${i + 1 === m ? "selected" : ""}>${n}</option>`).join("")}</select></label>
    <label>Versi <select onchange="ARK.versi=this.value;_arkGambar()">${pilihVersi.map((v) => `<option value="${v}" ${v === ARK.versi ? "selected" : ""}>${v === "Final" ? "Berlaku (terakhir)" : v === "Murni" ? "RKAS Awal" : v}</option>`).join("")}</select></label>
    ${x && x.pdf ? `<button class="btn btn-sm btn-outline" onclick="_arkBukaPdf('${x.versi}',${m})">📄 Buka PDF Asli</button>` : ""}</div>`;
  if (!x) return kepala + `<p class="ark-redup">Tidak ada cetakan untuk bulan ini.</p>`;
  const rows = x.rows.map(_arkBaris);
  const murni = x.versi !== "Murni" && ARK.d.Murni && ARK.d.Murni[m] ? ARK.d.Murni[m].rows.map(_arkBaris) : null;
  const kunci = (r) => r.kode + "|" + r.rek + "|" + r.uraian;
  const petaMurni = {}; (murni || []).forEach((r) => { (petaMurni[kunci(r)] = petaMurni[kunci(r)] || []).push(r); });
  const nama = ARK.d.nama || {};
  const jumlahKode = (pref) => rows.filter((r) => r.kode === pref || r.kode.startsWith(pref + ".")).reduce((a, r) => a + r.jumlah, 0);
  // LEBAR (≥ 860 px): 8 kolom persis cetakan ARKAS — No | Kode Rekening | Kode Program | Uraian | Volume | Satuan | Tarif | Jumlah.
  // RINGKAS (HP / layar kecil): 3 kolom — Kode (program + rekening) | Uraian (+ volume × tarif) | Jumlah. Tanpa geser ke kanan.
  const lebar = (qs("ark-isi")?.clientWidth || 900) >= 860;
  ARK._lebar = lebar;
  const titik = (k) => String(k).split(".").map((x) => x + ".").join(" ");
  const html = []; let l1 = "", l2 = "", l3 = "", no = 0;
  const judul = (kelas, kode, teks, n) => lebar
    ? `<tr class="${kelas}"><td class="ark-no">${++no}.</td><td></td><td class="ark-kode">${titik(kode)}</td><td colspan="4">${_arkE(teks)}</td><td class="r">${_arkRp(n)}</td></tr>`
    : `<tr class="${kelas}"><td class="ark-kode">${titik(kode)}</td><td>${_arkE(teks)}</td><td class="r">${_arkRp(n)}</td></tr>`;
  rows.forEach((r) => {
    const [a, b] = r.kode.split(".");
    if (a !== l1) { l1 = a; l2 = l3 = ""; html.push(judul("ark-l1", a, nama[a] || _arkProgNama(a), jumlahKode(a))); }
    if (a + "." + b !== l2) { l2 = a + "." + b; l3 = ""; html.push(judul("ark-l2", l2, nama[l2] || "", jumlahKode(l2))); }
    if (r.kode !== l3) { l3 = r.kode; html.push(judul("ark-l3", l3, nama[l3] || "", jumlahKode(l3))); }
    let tanda = "";
    if (murni) { const p = petaMurni[kunci(r)]; const sama = p && p.findIndex((q) => q.jumlah === r.jumlah); if (!p || !p.length) tanda = ` <span class="ark-chip baru">Baru</span>`; else if (sama >= 0) p.splice(sama, 1); else { tanda = ` <span class="ark-chip ubah" title="RKAS awal: ${_arkRp(p[0].jumlah)}">Berubah dari ${_arkRp(p[0].jumlah)}</span>`; p.splice(0, 1); } }
    html.push(lebar
      ? `<tr class="ark-d"><td class="ark-no">${++no}.</td><td class="ark-rek">${r.rek}</td><td class="ark-kode">${titik(r.kode)}</td><td>${_arkE(r.uraian)}${tanda}</td><td class="r">${r.vol ?? ""}</td><td>${_arkE(r.sat)}</td><td class="r">${_arkRp(r.tarif)}</td><td class="r">${_arkRp(r.jumlah)}</td></tr>`
      : `<tr class="ark-d"><td class="ark-kode">${titik(r.kode)}<div class="ark-rek-kecil">${r.rek}</div></td><td>${_arkE(r.uraian)}${tanda}<div class="ark-hitung">${r.vol ?? ""} ${_arkE(r.sat)} × ${_arkRp(r.tarif)}</div></td><td class="r">${_arkRp(r.jumlah)}</td></tr>`);
  });
  const hilang = murni ? Object.values(petaMurni).flat() : [];
  const kepalaTabel = lebar
    ? `<thead><tr><th rowspan="2" style="width:38px">No.<br>Urut</th><th rowspan="2" style="width:132px">Kode Rekening</th><th rowspan="2" style="width:88px">Kode Program</th><th rowspan="2">Uraian</th><th colspan="3">Rincian Perhitungan</th><th rowspan="2" style="width:104px">Jumlah</th></tr>
      <tr><th style="width:56px">Volume</th><th style="width:100px">Satuan</th><th style="width:92px">Tarif Harga</th></tr></thead>`
    : `<thead><tr><th style="width:92px">Kode Program<br><small>Kode Rekening</small></th><th>Uraian<br><small>Volume Satuan × Tarif</small></th><th style="width:92px">Jumlah</th></tr></thead>`;
  return kepala + `<div class="ark-judul-cetak"><b>RINCIAN KERTAS KERJA PERBULAN</b>Bulan ${ARK_BLN[m - 1]} ${ARK.th} · ${x.versi === "Murni" ? "RKAS Awal" : x.versi} · dicetak ${_arkE(x.tgl || "-")}</div>
    ${murni ? `<div class="ark-ket" style="margin-bottom:6px">Tanda <span class="ark-chip baru">Baru</span> / <span class="ark-chip ubah">Berubah</span> = dibanding RKAS awal bulan ini.</div>` : ""}
    <div class="table-wrap"><table class="ark-t ark-rinci ${lebar ? "ark-lebar" : "ark-ringkas-hp"}">${kepalaTabel}
    <tbody>${html.join("")}</tbody><tfoot><tr><td colspan="${lebar ? 7 : 2}" class="c">Jumlah</td><td class="r">${_arkRp(x.jumlah)}</td></tr></tfoot></table></div>
    ${hilang.length ? `<div class="ark-hilang"><b>Dihapus dari RKAS awal (${hilang.length}):</b> ${hilang.map((r) => `${_arkE(r.uraian)} (${r.kode}, Rp ${_arkRp(r.jumlah)})`).join("; ")}</div>` : ""}`;
}
async function _arkBukaPdf(versi, m) {
  const x = ARK.d && ARK.d[versi] && ARK.d[versi][m];
  if (!x || !x.pdf) { toast("PDF belum diarsipkan", "err"); return; }
  if (typeof arsipLihat === "function") arsipLihat(x.pdf); else window.open(x.pdf.url, "_blank");
}

// ── 3. Pola belanja setahun (versi yang berlaku tiap bulan) ──
function _arkSemuaBarisFinal() {
  const out = [];
  for (let m = 1; m <= 12; m++) { const x = _arkData("Final", m); if (x) x.rows.forEach((b) => out.push({ ..._arkBaris(b), m })); }
  return out;
}
const _arkNamaBarang = (u) => String(u || "").split("-")[0].trim() || u;
function _arkHtmlPola() {
  const semua = _arkSemuaBarisFinal(), nama = ARK.d.nama || {}, pagu = (ARK.d.info && ARK.d.info.pagu) || 0;
  const total = semua.reduce((a, r) => a + r.jumlah, 0) || 1;
  const kelompok = (fn) => { const g = {}; semua.forEach((r) => { const k = fn(r); if (!k) return; const o = (g[k] = g[k] || { k, n: 0, bulan: new Set(), baris: [] }); o.n += r.jumlah; o.bulan.add(r.m); o.baris.push(r); }); return Object.values(g).sort((a, b) => b.n - a.n); };
  const pilihan = [["kegiatan", "Per Kegiatan"], ["rekening", "Per Kode Rekening"], ["barang", "Per Barang/Jasa"], ["honor", "Honor & Upah Orang"], ["catatan", "Catatan Belajar"]];
  const kepala = `<div class="rg-tab ark-sub">${pilihan.map(([k, n]) => `<button class="${ARK.pola === k ? "aktif" : ""}" onclick="ARK.pola='${k}';_arkGambar()">${n}</button>`).join("")}</div>`;
  const pita = (s) => `<span class="ark-bulan">${ARK_BLN.map((n, i) => `<i class="${s.has(i + 1) ? "on" : ""}" title="${n}">${n[0]}</i>`).join("")}</span>`;
  const tabel = (judul, data, kolNama) => `<div class="table-wrap"><table class="ark-t ark-pola"><thead><tr><th style="width:34px">No.</th><th>${judul}</th><th>Bulan Muncul</th><th class="r">Total Setahun</th><th class="r ark-hp-x">% Belanja</th></tr></thead><tbody>${data.map((o, i) => `<tr><td class="c">${i + 1}.</td><td>${kolNama(o)}</td><td class="c" style="white-space:nowrap">${pita(o.bulan)} <small>${o.bulan.size} bln</small></td><td class="r">${_arkRp(o.n)}</td><td class="r ark-hp-x">${((o.n / total) * 100).toFixed(1)}%</td></tr>`).join("")}</tbody></table></div>`;
  if (ARK.pola === "rekening") {
    const g = kelompok((r) => r.rek);
    const namaRek = (k) => { const ref = typeof BSP_REK !== "undefined" ? BSP_REK.find((x) => x.kode === k) : null; return (ref && ref.nama) || _arkNamaBarang(g.find((o) => o.k === k).baris[0].uraian); };
    return kepala + tabel("Kode Rekening", g, (o) => `<b class="ark-rek">${o.k}</b><br><small>${_arkE(namaRek(o.k))}</small>`);
  }
  if (ARK.pola === "barang") {
    const g = kelompok((r) => (r.kode.startsWith("07.12") ? null : _arkNamaBarang(r.uraian)));
    return kepala + `<div class="ark-ket">Barang/jasa dikelompokkan dari nama sebelum tanda "-" pada uraian ARKAS. Honor per orang ada di tab Honor & Upah Orang.</div>` +
      tabel("Barang / Jasa", g, (o) => { const vol = o.baris.reduce((a, r) => a + (r.vol || 0), 0), sat = o.baris[0].sat, tarif = [...new Set(o.baris.map((r) => r.tarif))]; return `<b>${_arkE(o.k)}</b><br><small>${vol} ${_arkE(sat)} · harga ${tarif.slice(0, 3).map(_arkRp).join(" / ")}${tarif.length > 3 ? "…" : ""}</small>`; });
  }
  if (ARK.pola === "honor") {
    const g = kelompok((r) => (r.kode.startsWith("07.12") || /orang \/ bulan/.test(r.sat) ? r.uraian.replace(/\s*\(\d{8,}\)\s*/, "") + "§" + r.kode : null));
    return kepala + `<div class="ark-ket">Semua baris dengan satuan "orang / bulan" dan kegiatan 07.12 (Pembayaran Honor).</div>` +
      tabel("Nama / Uraian", g, (o) => { const [n, k] = o.k.split("§"); const per = [...new Set(o.baris.map((r) => r.jumlah))]; return `<b>${_arkE(n)}</b><br><small>${k} ${_arkE(nama[k] || "")} · ${per.map(_arkRp).join(" / ")} per bulan</small>`; });
  }
  if (ARK.pola === "catatan") return kepala + _arkHtmlCatatan(semua, total, pagu, kelompok);
  const g = kelompok((r) => r.kode);
  return kepala + tabel("Kegiatan", g, (o) => `<b class="ark-kode">${o.k}</b> ${_arkE(nama[o.k] || "")}<br><small>${_arkE(nama[o.k.split(".")[0]] || _arkProgNama(o.k.split(".")[0]))}</small>`);
}
function _arkHtmlCatatan(semua, total, pagu, kelompok) {
  const nama = ARK.d.nama || {};
  const rutin = kelompok((r) => _arkNamaBarang(r.uraian) + "§" + r.kode).filter((o) => o.bulan.size >= 10);
  const keg = kelompok((r) => r.kode).slice(0, 5);
  const prog = kelompok((r) => r.kode.split(".")[0]);
  // Kode rekening belanja modal (5.2.x) di kegiatan yang bukan pengadaan aset → patut dicek
  const curiga = semua.filter((r) => /^5\.2\.04/.test(r.rek) || (/^5\.2\./.test(r.rek) && !/^05\./.test(r.kode)));
  const rekBeda = {}; semua.forEach((r) => { if (!/orang \/ bulan/.test(r.sat)) return; const k = r.kode; (rekBeda[k] = rekBeda[k] || new Set()).add(r.rek); });
  const ganda = Object.entries(rekBeda).filter(([, s]) => s.size > 1);
  const unik = (arr) => { const s = new Set(); return arr.filter((r) => { const k = r.rek + r.kode + r.uraian; if (s.has(k)) return false; s.add(k); return true; }); };
  return `<div class="ark-catatan">
    <h4>Pembagian per Standar</h4><ul>${prog.map((o) => `<li><b>${o.k}. ${_arkE(nama[o.k] || _arkProgNama(o.k))}</b> — Rp ${_arkRp(o.n)} (${((o.n / total) * 100).toFixed(1)}%)</li>`).join("")}</ul>
    <h4>5 Kegiatan Terbesar</h4><ol>${keg.map((o) => `<li>${o.k} ${_arkE(nama[o.k] || "")} — Rp ${_arkRp(o.n)}</li>`).join("")}</ol>
    <h4>Belanja Rutin (muncul ≥ 10 bulan) — hampir pasti dianggarkan lagi tahun depan</h4>
    <ul>${rutin.map((o) => { const [n, k] = o.k.split("§"); return `<li>${_arkE(n.replace(/\s*\(\d{8,}\)/, ""))} <small>(${k}, ${o.bulan.size} bulan, Rp ${_arkRp(o.n)})</small></li>`; }).join("") || "<li>-</li>"}</ul>
    <h4>Perlu Dicek Bendahara</h4><ul>
      ${unik(curiga).map((r) => `<li>Kode rekening <b>${r.rek}</b> (belanja modal) dipakai untuk "${_arkE(r.uraian)}" di kegiatan ${r.kode} ${_arkE(nama[r.kode] || "")}. ${/^5\.2\.04/.test(r.rek) ? "Kode 5.2.04 adalah belanja modal jaringan (aset), padahal kegiatannya pembayaran rutin; pastikan kodenya sesuai." : "Belanja modal (aset) biasanya ditaruh di Standar Sarana dan Prasarana (05); pastikan kegiatannya sesuai."}</li>`).join("")}
      ${ganda.map(([k, s]) => `<li>Kegiatan ${k} ${_arkE(nama[k] || "")} memakai beberapa kode rekening untuk honor/upah: ${[...s].join(", ")}. Pastikan memang berbeda jenisnya.</li>`).join("")}
      ${!curiga.length && !ganda.length ? "<li>Tidak ada temuan.</li>" : ""}</ul>
    <div class="ark-ket">Total belanja setahun (versi berlaku) Rp ${_arkRp(total)} dari pagu Rp ${_arkRp(pagu)}.</div></div>`;
}

// Tombol "Arsip ARKAS" di sebelah Laporan Bulanan
(function pasangTombolArkas() {
  const pasang = () => {
    const kotak = document.querySelector("#page-rg .bsp-tombol");
    if (!kotak || kotak.querySelector(".bsp-ark") || (typeof BSP !== "undefined" && BSP.mode === "review")) return;
    const lap = kotak.querySelector(".bsp-lap");
    const html = `<button class="btn btn-outline bsp-ark" onclick="bspArsipArkas()" title="Cetakan ARKAS tahun-tahun sebelumnya & pola belanja">🗂 Arsip ARKAS</button>`;
    if (lap) lap.insertAdjacentHTML("afterend", html); else kotak.insertAdjacentHTML("afterbegin", html);
  };
  for (const nama of ["_bspGambar", "_bspGambarGab"]) {
    const asli = window[nama];
    if (typeof asli !== "function") continue;
    window[nama] = function () { const h = asli.apply(this, arguments); try { pasang(); } catch (e) {} return h; };
  }
})();

window.addEventListener("resize", () => {
  clearTimeout(ARK._rz);
  ARK._rz = setTimeout(() => { const el = qs("ark-isi"); if (el && ARK.tab === "rinci" && (el.clientWidth >= 860) !== ARK._lebar) _arkGambar(); }, 150);
});

// Modal Arsip ARKAS lebih lebar (seperti kertas landscape); kelasnya dilepas saat modal lain dibuka/ditutup
(function () {
  for (const nama of ["openModal", "closeModal"]) {
    const asli = window[nama]; if (typeof asli !== "function") continue;
    window[nama] = function () { const p = qs("modal-panel"); if (p) p.classList.remove("ark-modal"); return asli.apply(this, arguments); };
  }
})();

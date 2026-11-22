// ============================================================
//  LAPORAN "RINCIAN KERTAS KERJA PERBULAN" — meniru cetakan ARKAS untuk laporan ke Dinas
//  • Pilih bulan → satu laporan untuk SELURUH PKBM (satu NPSN): usulan ruang A + Pa + Pi + honor Pengelola,
//    atau hanya ruang yang sedang dibuka.
//  • Susunan seperti ARKAS: Program (03.) → Sub Program (03. 03.) → Kegiatan (03. 03. 06.) → rincian
//    (Kode Rekening · Kode Program · Uraian · Volume · Satuan · Tarif Harga · Jumlah), tiap tingkat ada subtotal.
//  • Kode Rekening (5.1.02.…) diambil dari isian Bendahara di Rancangan BOSP; bila kosong memakai kode bawaan
//    rekening. Baris yang belum punya kode rekening diberi tanda supaya dilengkapi sebelum dicetak.
//  • Identitas (NPSN, alamat, Kepala Sekolah, Bendahara, NIP) disimpan bersama di "bosp:identitas".
// ============================================================

// Nama Program (SNP) sesuai cetakan ARKAS
const BSP_PROGRAM_ARKAS = {
  "01": "Standar Kompetensi Lulusan", "02": "Standar Isi", "03": "Standar Proses", "04": "Standar Tenaga Kependidikan",
  "05": "Standar Sarana dan Prasarana", "06": "Standar Pengelolaan", "07": "Standar Pembiayaan", "08": "Standar Penilaian",
};
const _bspKodeTitik = (kode) => String(kode || "").split(".").filter(Boolean).map((x) => x + ".").join(" ");

async function _bspIdentitas() {
  try {
    const r = await supaSemua.from("kuliah_pengaturan").select("nilai").eq("kunci", "bosp:identitas").eq("ruang_id", "*").maybeSingle();
    return (r.data && r.data.nilai) || {};
  } catch (e) { return {}; }
}

// Kepala Sekolah di laporan = guru yang SEKARANG memegang jabatan "Kepala PKBM" di Data Guru
// (diutamakan yang ditandai utama; cadangan: jabatan "Kepala Sekolah"). Ganti orangnya cukup di Data Guru.
function _bspKepalaPkbm() {
  if (typeof LOOKUP === "undefined") return null;
  for (const kode of ["kepala_pkbm", "kepala_sekolah"]) {
    const kandidat = (LOOKUP.guruJabatan || []).filter((j) => j.jabatan_master?.kode === kode)
      .map((j) => ({ j, g: (LOOKUP.guruAll || []).find((x) => x.id === j.guru_id) })).filter((x) => x.g && x.g.aktif !== false);
    if (kandidat.length) return (kandidat.find((x) => x.j.is_utama) || kandidat[0]).g;
  }
  return null;
}

async function bspLaporanBulanan() {
  const th = BSP.th || _bspTahunAwal();
  const id = await _bspIdentitas();
  const kepala = _bspKepalaPkbm();
  if (kepala) id.kepsek = kepala.nama;
  const bendNama = (BSP.bend || []).map((g) => ((LOOKUP.guruAll || []).find((x) => x.id === g) || {}).nama).filter(Boolean)[0] || "";
  const bolehUbah = typeof bspBendahara === "function" && bspBendahara();
  const hariIni = new Date().toISOString().slice(0, 10);
  const f = (k, label, nilai, ph = "") => `<label class="bsp-f"><span>${label}</span><input id="bl-${k}" class="input" value="${_bspE(nilai || "")}" placeholder="${_bspE(ph)}" ${bolehUbah ? "" : "disabled"}></label>`;
  openModal(`<div class="bsp-modal"><h3>📄 Laporan Bulanan untuk Dinas</h3>
    <p class="bsp-ket" style="margin:0 0 10px">Rincian Kertas Kerja Perbulan — susunan & kolom mengikuti cetakan ARKAS. Hasilnya dibuka di tab baru, lalu pilih <b>Simpan sebagai PDF</b> atau cetak.</p>
    <div class="bl-grid">
      <label class="bsp-f"><span>Bulan</span><select id="bl-bulan" class="input">${BSP_BULAN.map((n, i) => `<option value="${i + 1}" ${i + 1 === (BSP.bulan || new Date().getMonth() + 1) ? "selected" : ""}>${n} ${th}</option>`).join("")}</select></label>
      <label class="bsp-f"><span>Cakupan</span><select id="bl-cakup" class="input"><option value="pkbm">Seluruh PKBM (untuk Dinas)</option>${STATE.ruang && STATE.ruang !== "Pg" ? `<option value="ruang">Hanya ${_bspE(_bspNamaRuang(STATE.ruang))}</option>` : ""}</select></label>
      <label class="bsp-f"><span>Tanggal Tanda Tangan</span><input id="bl-tgl" type="date" class="input" value="${hariIni}"></label>
    </div>
    <details class="bl-identitas" ${id.npsn ? "" : "open"}><summary>Identitas Sekolah & Penanda Tangan ${bolehUbah ? "" : "<small>(diisi Bendahara/Admin)</small>"}</summary>
      <div class="bl-grid">
        ${f("npsn", "NPSN", id.npsn, "P99…")}${f("nama", "Nama Sekolah", id.nama || "PKBM AL UMM BARABAI")}${f("alamat", "Alamat", id.alamat)}
        ${f("kab", "Kabupaten", id.kab, "Kab. …")}${f("prov", "Provinsi", id.prov, "Prov. …")}${f("tempat", "Tempat Tanda Tangan", id.tempat, "Kec. …")}
        ${kepala ? `<label class="bsp-f"><span>Kepala Sekolah</span><input id="bl-kepsek" class="input" value="${_bspE(kepala.nama)}" disabled title="Otomatis dari Data Guru"><small class="bsp-ket">Otomatis dari Data Guru (jabatan Kepala PKBM). Kalau Kepala PKBM berganti, ubah jabatannya di Data Guru.</small></label>` : f("kepsek", "Kepala Sekolah", id.kepsek, "Belum ada guru berjabatan Kepala PKBM")}${f("nipKepsek", "NIP Kepala Sekolah", id.nipKepsek, "boleh kosong")}
        ${f("bend", "Bendahara Sekolah", id.bend || bendNama)}${f("nipBend", "NIP Bendahara", id.nipBend, "boleh kosong")}
      </div></details>
    <div id="bl-pesan"></div>
    <div class="bsp-aksi-bawah"><button class="btn btn-outline" onclick="closeModal()">Batal</button><button class="btn bsp-hitam" onclick="_bspLaporanBuat()">📄 Buat Laporan</button></div></div>`, { lebar: true });
}

async function _bspLaporanBuat() {
  const v = (k) => (qs("bl-" + k)?.value || "").trim();
  const m = +v("bulan"), cakup = v("cakup"), th = BSP.th || _bspTahunAwal();
  const id = { npsn: v("npsn"), nama: v("nama"), alamat: v("alamat"), kab: v("kab"), prov: v("prov"), tempat: v("tempat"), kepsek: (_bspKepalaPkbm() || {}).nama || v("kepsek"), nipKepsek: v("nipKepsek"), bend: v("bend"), nipBend: v("nipBend") };
  const tombol = document.querySelector("#modal-panel .bsp-hitam"); if (tombol) { tombol.disabled = true; tombol.textContent = "Menyiapkan…"; }
  // jendela dibuka dulu (sebelum menunggu data) supaya tidak diblokir browser
  const w = window.open("", "_blank");
  try {
    if (typeof bspBendahara === "function" && bspBendahara()) { try { await _bspGabungUmum("bosp:identitas", id); } catch (e) { console.warn(e); } }
    await _bspMuatUmum(th);
    let baris;
    if (cakup === "ruang") {
      baris = _bspBarisRuang(BSP.kk, STATE.ruang).map((b) => ({ ...b, ruang: STATE.ruang, kodeRek: ((BSP.umum.rek || {})[STATE.ruang + ":" + b.id]) || (BSP_REK.find((x) => x.nama === b.rek) || {}).kode || "" }));
    } else {
      const r = await supaSemua.from("kuliah_pengaturan").select("ruang_id,nilai").eq("kunci", _bspKunciKK(th));
      if (r.error) throw r.error;
      BSP.gab = Object.fromEntries((r.data || []).map((x) => [x.ruang_id, x.nilai || { baris: {} }]));
      const orang = Object.fromEntries(_bspPengelola().map((p) => [p.id, p]));
      baris = _bspBarisGab().map((b) => (b.ruang === "Pg" && orang[b.id] ? { ...b, uraian: orang[b.id].nama || b.uraian } : b));
    }
    const isi = baris.filter((b) => (b.bulan || {})[m]).map((b) => {
      const x = b.bulan[m], tarif = Number(x.harga ?? b.harga) || 0, jumlah = bspTotalBulan(b, m);
      if (b.otomatis) return { kode: b.kode, kodeRek: b.kodeRek || "", uraian: b.uraian || "", vol: 1, sat: "Paket", tarif: jumlah, jumlah, t: 0 };
      return { kode: b.kode, kodeRek: b.kodeRek || "", uraian: b.uraian || b.rek || "", vol: Number(x.jml) || 0, sat: x.sat || "", tarif, jumlah, t: b.t || 0 };
    });
    if (!isi.length) { w && w.close(); toast(`Belum ada rincian kegiatan di bulan ${BSP_BULAN[m - 1]} ${th}`, "warn"); if (tombol) { tombol.disabled = false; tombol.textContent = "📄 Buat Laporan"; } return; }
    const tanpaKode = isi.filter((x) => !x.kodeRek).length;
    const html = _bspLaporanHtml({ th, m, id, isi, penerimaan: Number((BSP.umum.pagu || {}).total) || 0, cakup, tgl: v("tgl") });
    if (!w) { toast("Jendela baru diblokir browser — izinkan pop-up lalu coba lagi", "err"); return; }
    w.document.open(); w.document.write(html); w.document.close();
    closeModal();
    if (tanpaKode) toast(`${tanpaKode} rincian belum punya Kode Rekening (ditandai kuning). Lengkapi di Rancangan BOSP ruang Pengelola.`, "warn");
  } catch (e) {
    console.error(e); w && w.close();
    toast("Gagal membuat laporan: " + e.message, "err");
    if (tombol) { tombol.disabled = false; tombol.textContent = "📄 Buat Laporan"; }
  }
}

function _bspLaporanHtml({ th, m, id, isi, penerimaan, cakup, tgl }) {
  const rp = (n) => Math.round(Number(n) || 0).toLocaleString("id-ID");
  const E = (s) => _bspE(s);
  const namaKeg = (k) => (BSP_KEG.find((x) => x.kode === k) || {}).uraian || "";
  const namaSub = (s) => (BSP_KEG.find((x) => x.kode.startsWith(s + ".")) || {}).komponen || "";
  // kelompokkan Program → Sub → Kegiatan
  isi.sort((a, b) => a.kode.localeCompare(b.kode) || a.t - b.t);
  const pohon = new Map();
  isi.forEach((x) => {
    const [p, s] = x.kode.split(".");
    const ps = `${p}.${s}`;
    if (!pohon.has(p)) pohon.set(p, new Map());
    const sub = pohon.get(p); if (!sub.has(ps)) sub.set(ps, new Map());
    const keg = sub.get(ps); if (!keg.has(x.kode)) keg.set(x.kode, []);
    keg.get(x.kode).push(x);
  });
  const jml = (arr) => arr.reduce((a, x) => a + x.jumlah, 0);
  let no = 0, total = 0;
  const baris = [];
  for (const [p, subs] of pohon) {
    const semuaP = [...subs.values()].flatMap((k) => [...k.values()].flat());
    baris.push(`<tr class="l1"><td>${++no}.</td><td></td><td>${p}.</td><td>${E(BSP_PROGRAM_ARKAS[p] || bspProgram(p)[0])}</td><td></td><td></td><td></td><td class="r">${rp(jml(semuaP))}</td></tr>`);
    for (const [ps, kegs] of subs) {
      const semuaS = [...kegs.values()].flat();
      baris.push(`<tr class="l2"><td>${++no}.</td><td></td><td>${_bspKodeTitik(ps)}</td><td>${E(namaSub(ps))}</td><td></td><td></td><td></td><td class="r">${rp(jml(semuaS))}</td></tr>`);
      for (const [k, rinci] of kegs) {
        baris.push(`<tr class="l3"><td>${++no}.</td><td></td><td>${_bspKodeTitik(k)}</td><td>${E(namaKeg(k) || rinci[0].uraian)}</td><td></td><td></td><td></td><td class="r">${rp(jml(rinci))}</td></tr>`);
        rinci.forEach((x) => {
          total += x.jumlah;
          baris.push(`<tr><td>${++no}.</td><td class="${x.kodeRek ? "" : "kosong"}">${E(x.kodeRek || "belum diisi")}</td><td>${_bspKodeTitik(k)}</td><td>${E(x.uraian)}</td><td class="r">${rp(x.vol)}</td><td>${E(x.sat)}</td><td class="r">${rp(x.tarif)}</td><td class="r">${rp(x.jumlah)}</td></tr>`);
        });
      }
    }
  }
  const tglTeks = tgl ? new Date(tgl + "T00:00:00").toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "";
  const kaki = `Kertas Kerja perBulan - NPSN : ${id.npsn || "-"}, Nama Sekolah : ${id.nama || "-"}`;
  return `<!doctype html><html lang="id"><head><meta charset="utf-8"><title>Rincian Kertas Kerja ${BSP_BULAN[m - 1]} ${th}</title>
<style>
@page{size:A4 landscape;margin:12mm 10mm 14mm;
  @bottom-left{content:"${kaki.replace(/"/g, "'")}";font:italic 7.5pt Arial,sans-serif}
  @bottom-right{content:"Halaman " counter(page) " dari " counter(pages);font:7.5pt Arial,sans-serif}}
*{box-sizing:border-box}body{font:8.5pt Arial,Helvetica,sans-serif;color:#000;margin:0;background:#fff}
.alat{position:sticky;top:0;background:#f1f5f9;border-bottom:1px solid #cbd5e1;padding:8px 12px;display:flex;gap:8px;align-items:center;font:12px Arial}
.alat button{font:600 12px Arial;padding:6px 14px;border-radius:6px;border:1px solid #1e3a8a;background:#1e3a8a;color:#fff;cursor:pointer}
.alat span{color:#475569}
.kertas{padding:6mm 4mm;min-width:1060px}
table.t td:nth-child(2),table.t td:nth-child(3){white-space:nowrap}
h1{font-size:11pt;text-align:center;margin:0}h2{font-size:8.5pt;text-align:center;margin:2px 0 14px}
.id td{padding:1px 6px 1px 0;font-size:8.5pt}.id td:first-child{padding-left:22px;width:110px}
h3{font-size:8.5pt;margin:14px 0 6px}
table.t{border-collapse:collapse;width:100%}table.t th,table.t td{border:1px solid #000;padding:2px 4px;vertical-align:top}
table.t th{font-weight:700;text-align:center;background:#fff}
.r{text-align:right;white-space:nowrap}
tr.l1 td{background:#fcd5d5;font-weight:700}tr.l2 td{background:#d9f7d9;font-weight:700}tr.l3 td{background:#fffcd2;font-weight:700}
tr.l1 td:first-child,tr.l2 td:first-child,tr.l3 td:first-child{font-weight:700}
td.kosong{background:#fde68a;color:#92400e;font-style:italic}
tfoot td{font-weight:700}
thead{display:table-header-group}tr{page-break-inside:avoid}
.ttd{display:flex;justify-content:space-between;margin-top:18px;page-break-inside:avoid}.ttd div{width:34%;text-align:center}
.ttd b{display:block;margin-top:58px}.ttd i{display:block;border-top:1px solid #000;font-style:normal;margin-top:2px}
@media print{.alat{display:none}.kertas{padding:0;min-width:0}td.kosong{background:#fde68a!important;-webkit-print-color-adjust:exact}tr.l1 td,tr.l2 td,tr.l3 td{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
</style></head><body>
<div class="alat"><button onclick="print()">🖨️ Cetak / Simpan PDF</button><span>Atur kertas: <b>A4 · Lanskap</b>. ${cakup === "ruang" ? "Cakupan: satu ruang saja." : "Cakupan: seluruh PKBM."}</span></div>
<div class="kertas">
<h1>RINCIAN KERTAS KERJA PERBULAN</h1><h2>TAHUN ANGGARAN : ${th}</h2>
<table class="id"><tr><td>NPSN</td><td>: ${E(id.npsn)}</td></tr><tr><td>Nama Sekolah</td><td>: ${E(id.nama)}</td></tr><tr><td>Alamat</td><td>: ${E(id.alamat)}</td></tr>
<tr><td>Kabupaten</td><td>: ${E(id.kab)}</td></tr><tr><td>Provinsi</td><td>: ${E(id.prov)}</td></tr><tr><td>Bulan</td><td>: ${BSP_BULAN[m - 1]} ${th}</td></tr><tr><td>Sumber Dana</td><td>&nbsp; BOSP Kesetaraan Reguler</td></tr></table>
<h3>A. PENERIMAAN</h3><h3 style="margin-top:4px">Sumber Dana :</h3>
<table class="t" style="width:60%"><thead><tr><th style="width:90px">No. Kode</th><th>Penerimaan</th><th style="width:150px">Jumlah</th></tr></thead>
<tbody><tr><td style="text-align:center">4.3.1.01.</td><td>BOSP Kesetaraan Reguler</td><td class="r">${rp(penerimaan)}</td></tr></tbody>
<tfoot><tr><td colspan="2">Total Penerimaan</td><td class="r">${rp(penerimaan)}</td></tr></tfoot></table>
<h3>B. BELANJA</h3>
<table class="t"><thead><tr><th rowspan="2" style="width:34px">No. Urut</th><th rowspan="2" style="width:120px">Kode Rekening</th><th rowspan="2" style="width:74px">Kode Program</th><th rowspan="2">Uraian</th><th colspan="3">Rincian Perhitungan</th><th rowspan="2" style="width:120px">Jumlah</th></tr>
<tr><th style="width:56px">Volume</th><th style="width:86px">Satuan</th><th style="width:86px">Tarif Harga</th></tr></thead>
<tbody>${baris.join("")}</tbody>
<tfoot><tr><td colspan="7" style="text-align:center">Jumlah</td><td class="r">${rp(total)}</td></tr></tfoot></table>
<div class="ttd"><div><span>&nbsp;</span><br>Kepala Sekolah<b>${E(id.kepsek)}</b><i>NIP: ${E(id.nipKepsek)}</i></div>
<div>${E(id.tempat)}${id.tempat ? ", " : ""}${E(tglTeks)}<br>Bendahara Sekolah<b>${E(id.bend)}</b><i>NIP: ${E(id.nipBend)}</i></div></div>
</div></body></html>`;
}

// Tombol "Laporan Bulanan" di Kertas Kerja ruang & di Rancangan BOSP (Pengelola)
(function pasangTombolLaporan() {
  const pasang = () => {
    const kotak = document.querySelector("#page-rg .bsp-tombol");
    if (!kotak || kotak.querySelector(".bsp-lap") || BSP.mode === "review") return;
    kotak.insertAdjacentHTML("afterbegin", `<button class="btn btn-outline bsp-lap" onclick="bspLaporanBulanan()" title="Rincian Kertas Kerja Perbulan seperti cetakan ARKAS">📄 Laporan Bulanan</button>`);
  };
  for (const nama of ["_bspGambar", "_bspGambarGab"]) {
    const asli = window[nama];
    if (typeof asli !== "function") continue;
    window[nama] = function () { const h = asli.apply(this, arguments); try { pasang(); } catch (e) {} return h; };
  }
})();

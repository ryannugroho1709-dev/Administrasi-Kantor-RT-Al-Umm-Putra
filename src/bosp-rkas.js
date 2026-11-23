// ============================================================
//  DRAFT RKAS — perencanaan manual per jenjang (sebelum disusun di Kertas Kerja ARKAS)
//  Meniru lembar Excel "DRAFT RKAS <tahun>_<JENJANG>" sheet pertama:
//   • Kiri  : Rincian Kebutuhan — No, Uraian, Volume, Satuan, Harga Satuan, (× Frekuensi) = Jumlah, subtotal kelompok
//   • Kanan : Jadwal Bulanan — Tahap 1 (bulan 1–6) & Tahap 2 (bulan 7–12), jumlah per bulan & per tahap
//   • Bawah : Total Kebutuhan, Dana Anggaran (dibagi Tahap 1 / Tahap 2), Sisa
//  Penyusun: Admin, Admin Pendamping, Penyelenggara ruang (sama dengan Kertas Kerja BOSP).
//  Bendahara / Admin di ruang Pengelola bisa melihat draft ketiga jenjang (baca saja).
//  Penyimpanan per ruang: kv "bosp:rkas:<tahun>" → { kel:{id:{nama,u,t}}, item:{id:{kel,uraian,vol,sat,harga,frek,
//     jadwal:[m], manual, bulanRp:{m:rp}, coret, u, t}}, dana, tahap1 }  — digabung per entri (_kvGabung), tidak ditimpa.
// ============================================================
const RK = { th: null, ruang: null, data: null, tab: "rinci", baca: false, simpan: "", tunda: {}, pagu: 0 };
const RK_BLN = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
const RK_BLN_PANJANG = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
const _rkKunci = (th) => "bosp:rkas:" + th;
const _rkE = (s) => escapeHtml(s == null ? "" : String(s));
const _rkRp = (n) => Math.round(Number(n) || 0).toLocaleString("id-ID");
const _rkSingkat = (n) => {
  n = Math.round(Number(n) || 0); const a = Math.abs(n);
  const f = (x, s) => { const d = Math.abs(x) < 10 ? 100 : 10; return (Math.round(x * d) / d).toLocaleString("id-ID") + s; };
  return a >= 1e9 ? f(n / 1e9, "M") : a >= 1e6 ? f(n / 1e6, "jt") : a >= 1e3 ? f(n / 1e3, "rb") : String(n);
};
// angka ketikan: "15.000" → 15000, "2,5" → 2.5
const _rkAngka = (s) => { s = String(s == null ? "" : s).trim(); if (!s) return 0; if (/,/.test(s)) s = s.replace(/\./g, "").replace(",", "."); else if (/^\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, ""); const n = parseFloat(s.replace(/[^\d.-]/g, "")); return isFinite(n) ? n : 0; };
const _rkTampil = (n) => (n ? (Number.isInteger(n) ? n.toLocaleString("id-ID") : String(n).replace(".", ",")) : "");
const _rkId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const _rkBoleh = () => !!((typeof bspPenyusunInti === "function" && bspPenyusunInti()) || (typeof bspAdminJenjang === "function" && bspAdminJenjang("bsp-rkas")));
if (typeof daftarFiturAdminKedua === "function") daftarFiturAdminKedua("bsp-rkas", "🗂️", "Draft RKAS");
// Kepala PKBM (jabatan kepala_pkbm / kepala_sekolah) juga boleh memantau ketiga jenjang
const rkKepalaPkbm = () => { try { const k = typeof _bspKepalaPkbm === "function" ? _bspKepalaPkbm() : null; return !!(k && k.id === STATE.guruId); } catch (e) { return false; } };
const _rkBolehLihatSemua = () => (typeof bspBendahara === "function" && bspBendahara()) || rkKepalaPkbm();

// ── Data ──
// Honor Pengelola PKBM bagian jenjang ini — diisi Bendahara di ruang Pengelola (sama seperti di Kertas Kerja), ikut dihitung otomatis
function _rkHonorPengelola() {
  try {
    if (typeof _bspPengelola !== "function" || !_bspPengelola().length || !RK.ruang || RK.ruang === "Pg" || typeof bspBagiPengelola !== "function") return null;
    const bulanRp = {}; let tot = 0;
    for (let m = 1; m <= 12; m++) { const v = bspBagiPengelola(m)[RK.ruang] || 0; if (v) { bulanRp[m] = v; tot += v; } }
    if (!tot) return null;
    const cara = ((BSP.umum || {}).bagi_pengelola === "rata") ? "dibagi rata" : "sebanding pagu";
    return { id: "__pg-honor", kel: "__pg", uraian: `Honor Pengelola PKBM — bagian jenjang ini (${cara})`, vol: 1, sat: "tahun", harga: tot, frek: 1, manual: true, bulanRp, otomatis: true, u: 1 };
  } catch (e) { return null; }
}
const _rkKel = () => { const d = Object.entries((RK.data && RK.data.kel) || {}).filter(([, k]) => k && !k.dihapus).map(([id, k]) => ({ id, ...k })).sort((a, b) => (a.u ?? a.t ?? 0) - (b.u ?? b.t ?? 0)); if (_rkHonorPengelola()) d.push({ id: "__pg", nama: "Honor Pengelola PKBM (otomatis dari Bendahara)", otomatis: true }); return d; };
const _rkItem = (kel) => { const d = Object.entries((RK.data && RK.data.item) || {}).filter(([, x]) => x && !x.dihapus && (!kel || x.kel === kel)).map(([id, x]) => ({ id, ...x })).sort((a, b) => (a.u ?? a.t ?? 0) - (b.u ?? b.t ?? 0)); if (!kel || kel === "__pg") { const h = _rkHonorPengelola(); if (h) d.push(h); } return d; };
// "× Kali" otomatis mengikuti jumlah bulan di jadwal (mis. listrik tiap bulan → 12 kali) bila harga yang ditulis adalah harga per bulan / per kegiatan
const rkIkutBulan = (x) => !x.manual && (x.jadwal || []).length > 0 && (x.ikutBulan === true || (x.ikutBulan == null && (x.jadwal || []).length > 1 && Number(x.frek ?? 1) === x.jadwal.length));
const rkKali = (x) => (rkIkutBulan(x) ? x.jadwal.length : x.frek == null || x.frek === "" ? 1 : Number(x.frek) || 0);
const rkJumlah = (x) => (x.otomatis ? Number(x.harga) || 0 : x.coret ? 0 : (Number(x.vol) || 0) * (Number(x.harga) || 0) * rkKali(x));
// tulis angka bertitik ribuan saat mengetik (kursor tetap di tempatnya)
function _rkFormatKetik(el) {
  if (!el || /,/.test(el.value)) return;
  const v = el.value, pos = el.selectionStart ?? v.length, sesudah = v.slice(pos).replace(/\D/g, "").length;
  const n = v.replace(/\D/g, ""), f = n ? Number(n).toLocaleString("id-ID") : "";
  if (f === v) return;
  el.value = f; let q = f.length, c = 0; while (q > 0 && c < sesudah) { q--; if (/\d/.test(f[q])) c++; }
  try { el.setSelectionRange(q, q); } catch (e) {}
}
// rupiah per bulan: dibagi rata ke bulan terpilih (sisa pembulatan ke bulan terakhir) atau nominal yang diatur sendiri
function rkBulan(x) {
  const out = {}; if (x.coret) return out;
  if (x.manual) { Object.entries(x.bulanRp || {}).forEach(([m, v]) => { if (Number(v)) out[m] = Number(v); }); return out; }
  const bl = (x.jadwal || []).slice().sort((a, b) => a - b), j = Math.round(rkJumlah(x)); if (!bl.length || !j) return out;
  const tiap = Math.floor(j / bl.length);
  bl.forEach((m, i) => { out[m] = i === bl.length - 1 ? j - tiap * (bl.length - 1) : tiap; });
  return out;
}
const rkTerjadwal = (x) => Object.values(rkBulan(x)).reduce((a, v) => a + v, 0);
const _rkSubtotal = (kel) => _rkItem(kel).reduce((a, x) => a + rkJumlah(x), 0);
function rkRingkas() {
  const item = _rkItem(), total = item.reduce((a, x) => a + rkJumlah(x), 0), bulan = Array(13).fill(0);
  item.forEach((x) => Object.entries(rkBulan(x)).forEach(([m, v]) => { bulan[m] += v; }));
  const dana = Number(RK.data.dana) || RK.pagu || 0, p1 = (Number(RK.data.tahap1) || 50) / 100;
  const t1 = bulan.slice(1, 7).reduce((a, v) => a + v, 0), t2 = bulan.slice(7, 13).reduce((a, v) => a + v, 0);
  const belum = item.filter((x) => !x.coret && Math.round(rkJumlah(x)) !== Math.round(rkTerjadwal(x)));
  return { total, bulan, dana, t1, t2, jatah1: Math.round(dana * p1 * 100) / 100, jatah2: Math.round(dana * (1 - p1) * 100) / 100, sisa: dana - total, belum };
}

// ── Muat & simpan ──
async function _rkMuat() {
  const kunci = _rkKunci(RK.th);
  let r;
  if (RK.ruang === STATE.ruang) r = await supa.from("kuliah_pengaturan").select("nilai").eq("kunci", kunci).maybeSingle();
  else r = await supaSemua.from("kuliah_pengaturan").select("nilai").eq("kunci", kunci).eq("ruang_id", RK.ruang).maybeSingle();
  if (r.error) throw r.error;
  RK.data = (r.data && r.data.nilai) || {}; RK.data.kel = RK.data.kel || {}; RK.data.item = RK.data.item || {};
  try { if (typeof _bspMuatUmum === "function") { await _bspMuatUmum(RK.th); RK.pagu = Number((((BSP.umum || {}).pagu) || {})[RK.ruang]) || 0; } } catch (e) { RK.pagu = 0; }
  if (typeof _rkMuatReal === "function") { try { await _rkMuatReal(); } catch (e) { console.warn("Realisasi:", e); } }
}
function _rkTandaSimpan(teks) { RK.simpan = teks; const el = qs("rkx-simpan"); if (el) { el.textContent = teks; el.classList.toggle("proses", /Menyimpan/.test(teks)); el.classList.toggle("gagal", /Gagal/.test(teks)); } }
async function _rkTulis(potongan) {
  if (RK.baca) return;
  _rkTandaSimpan("Menyimpan…");
  try { await _kvGabung(_rkKunci(RK.th), potongan); _rkTandaSimpan("✓ Tersimpan pukul " + new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })); }
  catch (e) { console.error(e); _rkTandaSimpan("⚠️ Gagal menyimpan — periksa internet"); toast("Gagal menyimpan Draft RKAS: " + (e.message || e), "error"); }
}
// simpan tertunda (saat mengetik) per entri
function _rkSimpanNanti(jenis, id) {
  const k = jenis + ":" + id; clearTimeout(RK.tunda[k]); _rkTandaSimpan("Menyimpan…");
  RK.tunda[k] = setTimeout(() => { delete RK.tunda[k]; const obj = RK.data[jenis][id]; _rkTulis({ [jenis]: { [id]: obj } }); }, 700);
}

// ============================================================
//  HALAMAN
// ============================================================
async function rkBuka(th, ruang) {
  const diPg = STATE.ruang === "Pg";
  if (diPg ? !_rkBolehLihatSemua() : !_rkBoleh()) { toast(diPg ? "Draft RKAS jenjang dapat dilihat Bendahara / Admin." : "Draft RKAS disusun oleh Admin, Admin Pendamping, dan Penyelenggara ruang ini.", "warn"); return; }
  RK.th = th || RK.th || (typeof _bspTahunAwal === "function" ? _bspTahunAwal() : new Date().getFullYear());
  RK.ruang = diPg ? (ruang || (RK.ruang && RK.ruang !== "Pg" ? RK.ruang : "Pa")) : STATE.ruang;
  RK.baca = diPg;
  const sec = _rgBukaHal("bsp-rkas", "Draft RKAS", `<div class="card"><div class="rg-memuat">Memuat Draft RKAS…</div></div>`);
  try { await _rkMuat(); } catch (e) { sec.innerHTML = `<div class="card">Gagal memuat: ${_rkE(e.message)}</div>`; return; }
  _rkGambar();
}
const _rkIk = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
function _rkGambar() {
  const sec = qs("page-rg"); if (!sec || STATE.currentPage !== "bsp-rkas") return;
  const s = rkRingkas(), nm = typeof _bspNamaRuang === "function" ? _bspNamaRuang(RK.ruang) : RK.ruang, th = RK.th;
  const danaSendiri = Number(RK.data.dana) > 0;
  sec.innerHTML = `<div class="rkx">
    <div class="rkx-hero">
      <svg class="rkx-hero-hias" viewBox="0 0 400 160" preserveAspectRatio="xMaxYMid slice" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.2" opacity=".45">
        <rect x="236" y="22" width="150" height="116" rx="8"/><path d="M236 52h150M236 80h150M236 108h150M276 22v116M316 22v116M356 22v116"/></g>
        <g fill="currentColor" opacity=".5"><rect x="282" y="58" width="28" height="16" rx="3"/><rect x="322" y="86" width="28" height="16" rx="3"/><rect x="242" y="114" width="28" height="16" rx="3"/></g></svg>
      <div class="rkx-hero-ikon">${_rkIk('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9M15 21V9"/>')}</div>
      <div class="rkx-hero-teks">
        <span class="rkx-hero-label">BOSP Kesetaraan · Perencanaan Manual</span>
        <h3>Draft RKAS ${th}</h3>
        <p>Rincian kebutuhan &amp; jadwal belanja per bulan <b>${_rkE(nm)}</b> — disusun dulu di sini sebelum dimasukkan ke Kertas Kerja ARKAS.</p>
        <div class="rkx-hero-chip">
          <span>${_rkIk('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>')} Tahun
            <select onchange="rkBuka(+this.value,RK.ruang)">${[th - 1, th, th + 1].map((y) => `<option ${y === th ? "selected" : ""}>${y}</option>`).join("")}</select></span>
          ${RK.baca ? `<span>${_rkIk('<path d="M3 21h18M5 21V8l7-5 7 5v13"/>')} Jenjang <select onchange="rkBuka(RK.th,this.value)">${["A", "Pa", "Pi"].map((r) => `<option value="${r}" ${r === RK.ruang ? "selected" : ""}>${_rkE(typeof _bspNamaRuang === "function" ? _bspNamaRuang(r) : r)}</option>`).join("")}</select></span>` : ""}
          <span>${_rkIk('<path d="M4 6h16M4 12h16M4 18h10"/>')} <b>${_rkKel().length}</b> kelompok · <b>${_rkItem().length}</b> rincian</span>
        </div>
      </div>
    </div>
    <div class="rkx-ringkas">
      <button class="rkx-kartu dana" ${RK.baca ? "disabled" : 'onclick="rkUbahDana()"'}><span>Dana Anggaran ${RK.baca ? "" : "✏️"}</span><b>Rp ${_rkRp(s.dana)}</b><small>${danaSendiri ? "diisi di draft ini" : RK.pagu ? "pagu dari Bendahara" : "belum diisi — ketuk untuk mengisi"}</small></button>
      <div class="rkx-kartu"><span>Total Kebutuhan</span><b data-rk="total">Rp ${_rkRp(s.total)}</b><small data-rk="persen">${s.dana ? Math.round((s.total / s.dana) * 1000) / 10 + "% dari dana" : "—"}</small></div>
      <div class="rkx-kartu ${s.sisa < 0 ? "minus" : "plus"}" data-rk="sisa-kartu"><span>${s.sisa < 0 ? "Kelebihan" : "Sisa"}</span><b data-rk="sisa">Rp ${_rkRp(Math.abs(s.sisa))}</b><small>${s.sisa < 0 ? "kebutuhan melebihi dana" : "dana belum terpakai"}</small></div>
      <div class="rkx-kartu tahap"><span>Tahap 1 · Tahap 2</span><b data-rk="tahap">${_rkSingkat(s.t1)} · ${_rkSingkat(s.t2)}</b><small>jatah ${_rkSingkat(s.jatah1)} · ${_rkSingkat(s.jatah2)}</small></div>
    </div>
    <div class="rkx-alat">
      ${RK.baca ? "" : `<button class="btn btn-accent btn-sm" onclick="rkTambahKel()">＋ Kelompok</button>
      <label class="btn btn-outline btn-sm" title="Baca lembar Excel Draft RKAS (format seperti contoh)">📥 Impor Excel<input type="file" accept=".xlsx,.xls" hidden onchange="rkImpor(this)"></label>`}
      <button class="btn btn-outline btn-sm" onclick="rkUnduh()">📤 Unduh Excel</button>
      ${RK.baca ? `<span class="rkx-baca">👁️ Mode lihat — disusun oleh ruang ${_rkE(nm)}</span>` : `<span id="rkx-simpan" class="rkx-simpan">${_rkE(RK.simpan || "✓ Tersimpan otomatis")}</span>`}
    </div>
    <div class="rkx-tab">${[["rinci", "📋", "Rincian Kebutuhan"], ["jadwal", "📅", "Jadwal Bulanan"], ["real", "✅", "Realisasi"], ["ringkas", "📊", "Ringkasan"]].map(([k, i, n]) => `<button class="${RK.tab === k ? "aktif" : ""}" onclick="RK.tab='${k}';_rkGambar()"><span>${i}</span>${n}</button>`).join("")}</div>
    <div class="rkx-isi">${RK.tab === "jadwal" ? _rkHtmlJadwal(s) : RK.tab === "real" && typeof _rkHtmlReal === "function" ? _rkHtmlReal(s) : RK.tab === "ringkas" ? _rkHtmlRingkas(s) : _rkHtmlRinci()}</div>
    ${RK.tab === "jadwal" || RK.tab === "real" ? "" : _rkHtmlKaki(s)}
  </div>`;
}
function _rkHtmlKaki(s) {
  return `<div class="rkx-kaki">
    <div><span>Total Kebutuhan</span><b data-rk="total">Rp ${_rkRp(s.total)}</b></div>
    <div><span>Dana Anggaran</span><b>Rp ${_rkRp(s.dana)}</b></div>
    <div class="${s.sisa < 0 ? "minus" : "plus"}" data-rk="sisa-kaki"><span>${s.sisa < 0 ? "Kelebihan" : "Sisa"}</span><b data-rk="sisa">Rp ${_rkRp(Math.abs(s.sisa))}</b></div>
  </div>`;
}

// ── Tab Rincian Kebutuhan ──
function _rkHtmlRinci() {
  const kel = _rkKel(), dis = RK.baca ? "disabled" : "";
  if (!kel.length) return `<div class="rkx-kosong"><div>🗂️</div><b>Belum ada rincian kebutuhan</b><p>${RK.baca ? "Ruang ini belum menyusun Draft RKAS." : "Mulai dengan <b>＋ Kelompok</b> (mis. Kombel, Alat Kebersihan, ATK), atau <b>📥 Impor Excel</b> dari lembar Draft RKAS yang sudah ada."}</p></div>`;
  return `<div class="rkx-kepala"><span>Uraian</span><span>Volume</span><span>Satuan</span><span>Harga Satuan</span><span>× Kali</span><span>Jumlah</span><span>Jadwal</span><span></span></div>` +
    kel.map((k, i) => {
      const item = _rkItem(k.id);
      return `<section class="rkx-kel" data-kel="${k.id}">
        <header><i class="rkx-no">${i + 1}</i><input class="rkx-kel-nama" value="${_rkE(k.nama)}" placeholder="Nama kelompok" ${k.otomatis ? "disabled" : dis} oninput="rkUbahKel('${k.id}',this.value)">
          <b class="rkx-sub" data-rk-kel="${k.id}">Rp ${_rkRp(_rkSubtotal(k.id))}</b>
          ${RK.baca || k.otomatis ? "" : `<button class="rkx-ikon" title="Menu kelompok" onclick="rkMenuKel(event,'${k.id}')">⋯</button>`}</header>
        ${item.map((x) => _rkHtmlBaris(x)).join("")}
        ${RK.baca || k.otomatis ? "" : `<button class="rkx-tambah" onclick="rkTambahItem('${k.id}')">＋ Rincian</button>`}
      </section>`;
    }).join("");
}
function _rkPil(x) {
  if (x.coret) return `<span class="rkx-pil coret">Dicoret</span>`;
  const bl = Object.keys(rkBulan(x)).map(Number), sel = Math.round(rkJumlah(x)) - Math.round(rkTerjadwal(x));
  if (!bl.length) return `<span class="rkx-pil belum">⚠️ Belum</span>`;
  const teks = bl.length === 12 ? "Tiap bulan" : bl.length <= 3 ? bl.map((m) => RK_BLN[m - 1]).join(", ") : `${bl.length} bulan`;
  return `<span class="rkx-pil ${sel ? "selisih" : "ok"}" title="${sel ? "Selisih Rp " + _rkRp(sel) : ""}">${sel ? "⚠️ " : ""}${teks}</span>`;
}
function _rkHtmlBaris(x) {
  if (x.otomatis) return `<div class="rkx-baris otomatis" data-id="${x.id}"><input class="rkx-uraian" value="${_rkE(x.uraian)}" disabled>
    <label class="rkx-f vol"><small>Volume</small><input value="1" disabled></label><label class="rkx-f sat"><small>Satuan</small><input value="tahun" disabled></label>
    <label class="rkx-f harga"><small>Harga Satuan</small><input value="${_rkTampil(Math.round(x.harga))}" disabled></label><label class="rkx-f kali"><small>× Kali</small><input value="1" disabled></label>
    <b class="rkx-jml">Rp ${_rkRp(rkJumlah(x))}</b><span class="rkx-jadwal">${_rkPil(x)}</span><span title="Diatur Bendahara di ruang Pengelola → Rancangan BOSP">🔒</span></div>`;
  const dis = RK.baca ? "disabled" : "", ub = (f, num) => `oninput="${num && f !== "frek" ? "_rkFormatKetik(this);" : ""}rkUbahItem('${x.id}','${f}',this.value${num ? ",1" : ""})"`, ikut = rkIkutBulan(x);
  return `<div class="rkx-baris ${x.coret ? "coret" : ""}" data-id="${x.id}">
    <input class="rkx-uraian" value="${_rkE(x.uraian)}" placeholder="Uraian (mis. Snack)" ${dis} ${ub("uraian")}>
    <label class="rkx-f vol"><small>Volume</small><input inputmode="decimal" value="${_rkTampil(Number(x.vol) || 0)}" placeholder="0" ${dis} ${ub("vol", 1)}></label>
    <label class="rkx-f sat"><small>Satuan</small><input value="${_rkE(x.sat || "")}" placeholder="pcs" list="rkx-satuan" ${dis} ${ub("sat")}></label>
    <label class="rkx-f harga"><small>Harga Satuan</small><input inputmode="numeric" value="${_rkTampil(Number(x.harga) || 0)}" placeholder="0" ${dis} ${ub("harga", 1)} ></label>
    <label class="rkx-f kali ${ikut ? "oto" : ""}"><small>× Kali${ikut ? " ⚙" : ""}</small><input inputmode="decimal" value="${_rkTampil(rkKali(x))}" title="${ikut ? "Otomatis = jumlah bulan di jadwal. Ubah lewat tombol jadwal." : "Berapa kali dalam setahun (mis. snack 4 kali). Bila dijadwalkan per bulan, terisi otomatis."}" ${ikut ? "disabled" : dis} ${ub("frek", 1)}></label>
    <b class="rkx-jml" data-rk-item="${x.id}">Rp ${_rkRp(rkJumlah(x))}</b>
    <button class="rkx-jadwal" onclick="rkAturJadwal('${x.id}')" data-rk-pil="${x.id}">${_rkPil(x)}</button>
    ${RK.baca ? "<span></span>" : `<button class="rkx-ikon hapus" title="Hapus rincian" onclick="rkHapusItem('${x.id}')">🗑</button>`}
  </div>`;
}
// perbarui angka tanpa menggambar ulang (supaya kursor tidak lepas saat mengetik)
function _rkSegarkanAngka() {
  const s = rkRingkas();
  qsa("[data-rk-item]").forEach((el) => { const x = RK.data.item[el.dataset.rkItem]; if (x) el.textContent = "Rp " + _rkRp(rkJumlah(x)); });
  qsa("[data-rk-pil]").forEach((el) => { const x = RK.data.item[el.dataset.rkPil]; if (x) el.innerHTML = _rkPil({ id: el.dataset.rkPil, ...x }); });
  qsa("[data-rk-kel]").forEach((el) => { el.textContent = "Rp " + _rkRp(_rkSubtotal(el.dataset.rkKel)); });
  qsa(".rkx-baris").forEach((b) => { const x = RK.data.item[b.dataset.id], k = b.querySelector(".rkx-f.kali input"); if (x && k && rkIkutBulan(x)) k.value = _rkTampil(rkKali(x)); });
  qsa('[data-rk="total"]').forEach((el) => { el.textContent = "Rp " + _rkRp(s.total); });
  qsa('[data-rk="sisa"]').forEach((el) => { el.textContent = "Rp " + _rkRp(Math.abs(s.sisa)); });
  qsa('[data-rk="persen"]').forEach((el) => { el.textContent = s.dana ? Math.round((s.total / s.dana) * 1000) / 10 + "% dari dana" : "—"; });
  qsa('[data-rk="tahap"]').forEach((el) => { el.textContent = `${_rkSingkat(s.t1)} · ${_rkSingkat(s.t2)}`; });
  qsa('[data-rk="sisa-kartu"],[data-rk="sisa-kaki"]').forEach((el) => { el.classList.toggle("minus", s.sisa < 0); el.classList.toggle("plus", s.sisa >= 0); const sp = el.querySelector("span"); if (sp) sp.textContent = s.sisa < 0 ? "Kelebihan" : "Sisa"; });
}
function rkUbahItem(id, f, v, angka) {
  const x = RK.data.item[id]; if (!x) return;
  x[f] = angka ? _rkAngka(v) : v;
  _rkSegarkanAngka(); _rkSimpanNanti("item", id);
}
function rkUbahKel(id, v) { const k = RK.data.kel[id]; if (!k) return; k.nama = v; _rkSimpanNanti("kel", id); }
function _rkUrutBaru(daftar) { return daftar.reduce((a, x) => Math.max(a, Number(x.u ?? 0)), 0) + 1; }
function rkTambahKel() {
  const id = _rkId(), k = { nama: "", u: _rkUrutBaru(_rkKel()), t: Date.now() };
  RK.data.kel[id] = k; const iid = _rkId(); RK.data.item[iid] = { kel: id, uraian: "", vol: 1, sat: "", harga: 0, frek: 1, ikutBulan: true, jadwal: [], u: 1, t: Date.now() };
  RK.tab = "rinci"; _rkGambar(); _rkTulis({ kel: { [id]: k }, item: { [iid]: RK.data.item[iid] } });
  setTimeout(() => { const el = [...qsa(".rkx-kel-nama")].pop(); if (el) { el.focus(); el.scrollIntoView({ block: "center", behavior: "smooth" }); } }, 30);
}
function rkTambahItem(kel) {
  const id = _rkId(), sebelum = _rkItem(kel).pop();
  RK.data.item[id] = { kel, uraian: "", vol: 1, sat: sebelum ? sebelum.sat || "" : "", harga: 0, frek: 1, ikutBulan: true, jadwal: sebelum && !sebelum.manual ? (sebelum.jadwal || []).slice() : [], u: _rkUrutBaru(_rkItem(kel)), t: Date.now() };
  _rkGambar(); _rkTulis({ item: { [id]: RK.data.item[id] } });
  setTimeout(() => { const el = document.querySelector(`.rkx-baris[data-id="${id}"] .rkx-uraian`); if (el) el.focus(); }, 30);
}
async function rkHapusItem(id) {
  const x = RK.data.item[id]; if (!x) return;
  if ((x.uraian || rkJumlah(x)) && !(await konfirmasiTema(`Hapus rincian <b>${_rkE(x.uraian || "tanpa nama")}</b>${rkJumlah(x) ? ` (Rp ${_rkRp(rkJumlah(x))})` : ""}?`, { ikon: "🗑️", judul: "Hapus Rincian", teksYa: "Ya, Hapus" }))) return;
  x.dihapus = true; _rkGambar(); _rkTulis({ item: { [id]: x } });
}
function rkMenuKel(ev, id) {
  ev.stopPropagation(); document.querySelector(".rkx-menu")?.remove();
  const kel = _rkKelAsli(), i = kel.findIndex((k) => k.id === id);
  const m = document.createElement("div"); m.className = "rkx-menu";
  m.innerHTML = `<button onclick="rkTambahItem('${id}')">＋ Tambah Rincian</button><button onclick="rkJadwalKel('${id}')">📅 Jadwalkan Semua Rincian</button>
    ${i > 0 ? `<button onclick="rkGeserKel('${id}',-1)">⬆️ Naikkan</button>` : ""}${i < kel.length - 1 ? `<button onclick="rkGeserKel('${id}',1)">⬇️ Turunkan</button>` : ""}
    <button class="bahaya" onclick="rkHapusKel('${id}')">🗑 Hapus Kelompok</button>`;
  document.body.appendChild(m);
  const r = ev.currentTarget.getBoundingClientRect(); m.style.top = Math.min(window.innerHeight - m.offsetHeight - 8, r.bottom + 4) + "px"; m.style.left = Math.max(8, r.right - m.offsetWidth) + "px";
  setTimeout(() => document.addEventListener("click", () => m.remove(), { once: true }), 0);
}
// kelompok buatan sendiri saja (tanpa kelompok otomatis Honor Pengelola)
const _rkKelAsli = () => _rkKel().filter((k) => !k.otomatis && RK.data.kel[k.id]);
function rkGeserKel(id, arah) {
  const kel = _rkKelAsli(), i = kel.findIndex((k) => k.id === id), j = i + arah; if (i < 0 || j < 0 || j >= kel.length) return;
  const urut = kel.map((k) => k.id); [urut[i], urut[j]] = [urut[j], urut[i]];
  _rkTerapkanUrutan(urut, id);
}
function _rkTerapkanUrutan(urut, sorot) {
  urut.forEach((kid, n) => { RK.data.kel[kid].u = n + 1; });
  _rkGambar(); _rkTulis({ kel: Object.fromEntries(urut.map((kid) => [kid, RK.data.kel[kid]])) });
  if (sorot) setTimeout(() => { const el = document.querySelector(`.rkx-kel[data-kel="${sorot}"]`); if (el) { el.scrollIntoView({ block: "center", behavior: "smooth" }); el.classList.add("rkx-kel-pindah"); setTimeout(() => el.classList.remove("rkx-kel-pindah"), 900); } }, 40);
}
// ── Tekan lama kepala kelompok → geser naik / turun (HP & komputer) ──
(function () {
  let tahan = null, seret = null;
  const batal = () => { clearTimeout(tahan && tahan.t); tahan = null; };
  document.addEventListener("pointerdown", (e) => {
    const h = e.target.closest && e.target.closest(".rkx-kel > header");
    if (!h || RK.baca || e.target.closest("button")) return;
    const sec = h.parentElement, id = sec.dataset.kel; if (!id || id === "__pg") return;
    tahan = { x: e.clientX, y: e.clientY, t: setTimeout(() => mulai(sec, id, e.clientY), 450) };
  });
  document.addEventListener("pointermove", (e) => {
    if (tahan && Math.hypot(e.clientX - tahan.x, e.clientY - tahan.y) > 8) batal();
    if (!seret) return;
    e.preventDefault();
    const dy = e.clientY - seret.y0 + (window.scrollY - seret.gulung0); seret.el.style.transform = `translateY(${dy}px) scale(1.02)`;
    // posisi tujuan: titik tengah kelompok lain yang dilewati
    const tengah = e.clientY; let ke = seret.daftar.length - 1;
    const geserGulung = window.scrollY - seret.gulung0;
    for (let n = 0; n < seret.daftar.length; n++) { const r = n === seret.dari ? { top: seret.kotak[n].top - geserGulung, height: seret.kotak[n].height } : seret.daftar[n].getBoundingClientRect(); if (tengah < r.top + r.height / 2) { ke = n > seret.dari ? n - 1 : n; break; } }
    seret.ke = ke;
    seret.daftar.forEach((s, n) => { s.classList.toggle("rkx-sasaran-atas", n === ke && ke < seret.dari); s.classList.toggle("rkx-sasaran-bawah", n === ke && ke > seret.dari); });
    // gulung otomatis di tepi layar
    if (e.clientY < 90) window.scrollBy(0, -12); else if (e.clientY > window.innerHeight - 90) window.scrollBy(0, 12);
  }, { passive: false });
  // di HP: cegah layar ikut tergulung selama menggeser
  document.addEventListener("touchmove", (e) => { if (seret) e.preventDefault(); }, { passive: false });
  document.addEventListener("contextmenu", (e) => { if ((tahan || seret) && e.target.closest && e.target.closest(".rkx-kel > header")) e.preventDefault(); });
  const selesai = () => {
    batal(); if (!seret) return;
    const { el, dari, ke, daftar } = seret; seret = null;
    document.body.classList.remove("rkx-menyeret"); el.style.transform = ""; el.classList.remove("rkx-diseret");
    daftar.forEach((s) => s.classList.remove("rkx-sasaran-atas", "rkx-sasaran-bawah"));
    if (ke == null || ke === dari) return;
    const urut = daftar.map((s) => s.dataset.kel); const [x] = urut.splice(dari, 1); urut.splice(ke, 0, x);
    _rkTerapkanUrutan(urut, x);
    toast("Urutan kelompok disimpan ✓", "ok");
  };
  document.addEventListener("pointerup", selesai); document.addEventListener("pointercancel", selesai);
  function mulai(sec, id, y) {
    tahan = null;
    const daftar = [...document.querySelectorAll(".rkx-kel[data-kel]")].filter((s) => s.dataset.kel !== "__pg");
    const dari = daftar.indexOf(sec); if (dari < 0 || daftar.length < 2) return;
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
    seret = { el: sec, id, y0: y, dari, ke: dari, daftar, kotak: daftar.map((s) => s.getBoundingClientRect()), gulung0: window.scrollY };
    document.body.classList.add("rkx-menyeret"); sec.classList.add("rkx-diseret");
    try { navigator.vibrate && navigator.vibrate(30); } catch (e) {}
    toast("Geser ke atas / bawah, lalu lepas", "info");
  }
})();
async function rkHapusKel(id) {
  const k = RK.data.kel[id], item = _rkItem(id); if (!k) return;
  if (!(await konfirmasiTema(`Hapus kelompok <b>${_rkE(k.nama || "tanpa nama")}</b> beserta ${item.length} rinciannya?`, { ikon: "🗑️", judul: "Hapus Kelompok", teksYa: "Ya, Hapus" }))) return;
  k.dihapus = true; item.forEach((x) => { RK.data.item[x.id].dihapus = true; });
  _rkGambar(); _rkTulis({ kel: { [id]: k }, item: Object.fromEntries(item.map((x) => [x.id, RK.data.item[x.id]])) });
}
function rkUbahDana() {
  const s = rkRingkas();
  openModal(`<h3>💰 Dana Anggaran ${RK.th}</h3>
    <div class="uj-sub" style="margin-bottom:10px">Dana yang tersedia untuk ${_rkE(typeof _bspNamaRuang === "function" ? _bspNamaRuang(RK.ruang) : RK.ruang)} tahun ini. ${RK.pagu ? `Pagu dari Bendahara: <b>Rp ${_rkRp(RK.pagu)}</b> (dipakai bila kolom ini dikosongkan).` : ""}</div>
    <div class="field"><label>Dana Anggaran (Rp)</label><input id="rkx-dana" class="input" inputmode="numeric" oninput="_rkFormatKetik(this)" value="${Number(RK.data.dana) ? _rkTampil(Math.round(RK.data.dana)) : ""}" placeholder="${RK.pagu ? _rkTampil(RK.pagu) : "mis. 89.129.256"}"></div>
    <div class="field"><label>Bagian Tahap 1 (%) — sisanya Tahap 2</label><input id="rk-t1" class="input" inputmode="numeric" value="${Number(RK.data.tahap1) || 50}"></div>
    <div class="uj-sub">Saat ini kebutuhan <b>Rp ${_rkRp(s.total)}</b>.</div>
    <div style="display:flex;gap:10px;margin-top:12px"><button class="btn btn-outline" style="flex:1" onclick="closeModal()">Batal</button><button class="btn btn-accent" style="flex:1" onclick="rkSimpanDana()">Simpan</button></div>`);
  setTimeout(() => qs("rkx-dana")?.focus(), 50);
}
function rkSimpanDana() {
  const d = _rkAngka(qs("rkx-dana").value), t1 = Math.min(100, Math.max(0, _rkAngka(qs("rk-t1").value) || 50));
  RK.data.dana = d || null; RK.data.tahap1 = t1; closeModal(); _rkGambar(); _rkTulis({ dana: d || null, tahap1: t1 });
}

// ── Atur jadwal satu rincian ──
function rkAturJadwal(id) {
  const x = RK.data.item[id]; if (!x) { if (String(id).startsWith("__pg")) toast("Honor Pengelola diatur Bendahara di ruang Pengelola → Rancangan BOSP", "warn"); return; }
  RK.jd = { ikut: x.ikutBulan ?? (Number(x.frek ?? 1) === 1 || Number(x.frek) === (x.jadwal || []).length), id, jadwal: (x.manual ? Object.keys(x.bulanRp || {}).filter((m) => Number(x.bulanRp[m])).map(Number) : (x.jadwal || []).slice()), manual: !!x.manual, rp: { ...(x.bulanRp || {}) }, coret: !!x.coret };
  _rkGambarJadwal();
}
function _rkGambarJadwal() {
  const J = RK.jd, x = RK.data.item[J.id], dis = RK.baca ? "disabled" : "";
  const contoh = { ...x, coret: false, manual: J.manual, jadwal: J.jadwal, bulanRp: J.rp, ikutBulan: J.ikut }, jml = Math.round(rkJumlah(contoh)), rp = rkBulan(contoh), terj = Object.values(rp).reduce((a, v) => a + v, 0);
  const chip = (m) => `<button class="rkx-bln ${J.jadwal.includes(m) ? "on" : ""}" ${dis} onclick="rkTogBulan(${m})"><b>${RK_BLN[m - 1]}</b><small>${J.jadwal.includes(m) ? _rkSingkat(rp[m] || 0) : "—"}</small></button>`;
  openModal(`<div class="rkx-jd"><h3>📅 Jadwal Belanja</h3>
    <div class="rkx-jd-info"><b>${_rkE(x.uraian || "Rincian")}</b><span>${_rkTampil(Number(x.vol) || 0)} ${_rkE(x.sat || "")} × Rp ${_rkRp(x.harga)}${rkKali(contoh) !== 1 ? ` × ${_rkTampil(rkKali(contoh))} kali` : ""} = <b>Rp ${_rkRp(jml)}</b></span></div>
    ${RK.baca ? "" : `<label class="rkx-jd-saklar"><input type="checkbox" ${J.ikut ? "checked" : ""} onchange="RK.jd.ikut=this.checked;_rkGambarJadwal()"> <b>× Kali otomatis = jumlah bulan terpilih</b> <small>(harga di atas adalah harga per bulan / per kegiatan, mis. listrik, internet, honor bulanan)</small></label>`}
    ${RK.baca ? "" : `<div class="rkx-jd-cepat"><button onclick="rkJadwalCepat('semua')">Tiap Bulan</button><button onclick="rkJadwalCepat('t1')">Tahap 1 (Jan–Jun)</button><button onclick="rkJadwalCepat('t2')">Tahap 2 (Jul–Des)</button>${Number(x.frek) > 1 && Number(x.frek) < 12 ? `<button onclick="rkJadwalCepat('rata')">${_rkTampil(Number(x.frek))} kali menyebar</button>` : ""}<button onclick="rkJadwalCepat('kosong')">Kosongkan</button></div>`}
    <div class="rkx-jd-tahap t1"><span>Tahap 1</span><div>${[1, 2, 3, 4, 5, 6].map(chip).join("")}</div></div>
    <div class="rkx-jd-tahap t2"><span>Tahap 2</span><div>${[7, 8, 9, 10, 11, 12].map(chip).join("")}</div></div>
    <label class="rkx-jd-saklar"><input type="checkbox" ${J.manual ? "checked" : ""} ${dis} onchange="RK.jd.manual=this.checked;if(this.checked){const r=rkBulan({...RK.data.item[RK.jd.id],coret:false,manual:false,jadwal:RK.jd.jadwal});RK.jd.rp=r}_rkGambarJadwal()"> Atur nominal tiap bulan sendiri <small>(bila tidak dicentang: dibagi rata otomatis)</small></label>
    ${J.manual ? `<div class="rkx-jd-manual">${J.jadwal.slice().sort((a, b) => a - b).map((m) => `<label><span>${RK_BLN_PANJANG[m - 1]}</span><input inputmode="numeric" value="${_rkTampil(Number(J.rp[m]) || 0)}" ${dis} oninput="_rkFormatKetik(this);RK.jd.rp[${m}]=_rkAngka(this.value);_rkJdSelisih()"></label>`).join("") || "<em>Pilih bulannya dulu di atas.</em>"}</div>` : ""}
    <div id="rkx-jd-sel" class="rkx-jd-sel ${terj === jml ? "pas" : ""}">${_rkTeksSelisih(jml, terj)}</div>
    <label class="rkx-jd-saklar coret"><input type="checkbox" ${J.coret ? "checked" : ""} ${dis} onchange="RK.jd.coret=this.checked"> Dicoret / tidak dipakai <small>(tetap tercatat, tidak dihitung)</small></label>
    <div style="display:flex;gap:10px;margin-top:12px"><button class="btn btn-outline" style="flex:1" onclick="closeModal()">${RK.baca ? "Tutup" : "Batal"}</button>${RK.baca ? "" : `<button class="btn btn-accent" style="flex:1" onclick="rkSimpanJadwal()">Simpan Jadwal</button>`}</div></div>`);
}
const _rkTeksSelisih = (jml, terj) => terj === jml ? `✅ Terjadwal penuh: Rp ${_rkRp(terj)}` : terj < jml ? `⚠️ Baru terjadwal Rp ${_rkRp(terj)} — kurang <b>Rp ${_rkRp(jml - terj)}</b>` : `⚠️ Terjadwal Rp ${_rkRp(terj)} — lebih <b>Rp ${_rkRp(terj - jml)}</b> dari jumlah`;
function _rkJdSelisih() {
  const J = RK.jd, x = RK.data.item[J.id], jml = Math.round(rkJumlah({ ...x, coret: false, manual: J.manual, jadwal: J.jadwal, ikutBulan: J.ikut }));
  const terj = J.jadwal.reduce((a, m) => a + (Number(J.rp[m]) || 0), 0), el = qs("rkx-jd-sel");
  if (el) { el.innerHTML = _rkTeksSelisih(jml, terj); el.classList.toggle("pas", terj === jml); }
}
function rkTogBulan(m) {
  const J = RK.jd, i = J.jadwal.indexOf(m);
  if (i >= 0) { J.jadwal.splice(i, 1); delete J.rp[m]; } else { J.jadwal.push(m); if (J.manual) J.rp[m] = 0; }
  _rkGambarJadwal();
}
function rkJadwalCepat(jenis) {
  const J = RK.jd, x = RK.data.item[J.id], f = Math.round(Number(x.frek) || 1);
  J.jadwal = jenis === "semua" ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] : jenis === "t1" ? [1, 2, 3, 4, 5, 6] : jenis === "t2" ? [7, 8, 9, 10, 11, 12] : jenis === "rata" ? [...new Set(Array.from({ length: f }, (_, k) => 1 + Math.floor((k * 12) / f)))] : [];
  J.manual = false; J.rp = {}; _rkGambarJadwal();
}
function rkSimpanJadwal() {
  const J = RK.jd, x = RK.data.item[J.id];
  x.coret = J.coret; x.manual = J.manual; x.jadwal = J.jadwal.slice().sort((a, b) => a - b); x.ikutBulan = !!J.ikut;
  if (J.ikut && !J.manual && x.jadwal.length) x.frek = x.jadwal.length;
  x.bulanRp = J.manual ? Object.fromEntries(x.jadwal.map((m) => [m, Number(J.rp[m]) || 0])) : null;
  closeModal(); _rkGambar(); _rkTulis({ item: { [J.id]: x } });
}
// semua rincian satu kelompok dijadwalkan sekaligus (bulan sama)
function rkJadwalKel(kel) {
  const item = _rkItem(kel); if (!item.length) return;
  RK.jdKel = { kel, jadwal: (item[0].jadwal || []).slice() };
  const gb = () => openModal(`<div class="rkx-jd"><h3>📅 Jadwalkan Satu Kelompok</h3><div class="uj-sub" style="margin-bottom:10px">Semua rincian <b>${_rkE(RK.data.kel[kel].nama)}</b> (${item.length}) dibelanjakan di bulan yang sama, jumlahnya dibagi rata.</div>
    <div class="rkx-jd-tahap t1"><span>Tahap 1</span><div>${[1, 2, 3, 4, 5, 6].map((m) => `<button class="rkx-bln ${RK.jdKel.jadwal.includes(m) ? "on" : ""}" onclick="rkTogBulanKel(${m})"><b>${RK_BLN[m - 1]}</b></button>`).join("")}</div></div>
    <div class="rkx-jd-tahap t2"><span>Tahap 2</span><div>${[7, 8, 9, 10, 11, 12].map((m) => `<button class="rkx-bln ${RK.jdKel.jadwal.includes(m) ? "on" : ""}" onclick="rkTogBulanKel(${m})"><b>${RK_BLN[m - 1]}</b></button>`).join("")}</div></div>
    <div style="display:flex;gap:10px;margin-top:12px"><button class="btn btn-outline" style="flex:1" onclick="closeModal()">Batal</button><button class="btn btn-accent" style="flex:1" onclick="rkSimpanJadwalKel()">Simpan</button></div></div>`);
  RK.jdKelGambar = gb; gb();
}
function rkTogBulanKel(m) { const a = RK.jdKel.jadwal, i = a.indexOf(m); i >= 0 ? a.splice(i, 1) : a.push(m); RK.jdKelGambar(); }
function rkSimpanJadwalKel() {
  const item = _rkItem(RK.jdKel.kel), jd = RK.jdKel.jadwal.slice().sort((a, b) => a - b), pot = {};
  item.forEach((x) => { const o = RK.data.item[x.id]; o.jadwal = jd.slice(); o.manual = false; o.bulanRp = null; pot[x.id] = o; });
  closeModal(); _rkGambar(); _rkTulis({ item: pot });
}

// ── Tab Jadwal Bulanan (seperti tabel kanan di Excel) ──
function _rkHtmlJadwal(s) {
  const kel = _rkKel(); if (!kel.length) return _rkHtmlRinci();
  const sel = (v, cls) => `<td class="${cls || ""}">${v ? `<span class="p">${_rkRp(v)}</span><span class="s">${_rkSingkat(v)}</span>` : ""}</td>`;
  const baris = (rp, jml, cls) => [1, 2, 3, 4, 5, 6].map((m) => sel(rp[m])).join("") + sel([1, 2, 3, 4, 5, 6].reduce((a, m) => a + (rp[m] || 0), 0), "th1") +
    [7, 8, 9, 10, 11, 12].map((m) => sel(rp[m])).join("") + sel([7, 8, 9, 10, 11, 12].reduce((a, m) => a + (rp[m] || 0), 0), "th2") + sel(jml, "jml " + (cls || ""));
  let no = 0;
  const isi = kel.map((k) => {
    const item = _rkItem(k.id), rpK = {}; item.forEach((x) => Object.entries(rkBulan(x)).forEach(([m, v]) => { rpK[m] = (rpK[m] || 0) + v; }));
    no++;
    return `<tr class="kel"><td class="nama"><i>${no}</i>${_rkE(k.nama || "Tanpa nama")}</td>${baris(rpK, _rkSubtotal(k.id))}</tr>` +
      item.map((x) => { const sel = Math.round(rkJumlah(x)) - Math.round(rkTerjadwal(x)); return `<tr class="item ${x.coret ? "coret" : ""} ${sel && !x.coret ? "kurang" : ""}" onclick="rkAturJadwal('${x.id}')" title="Ketuk untuk mengatur bulan"><td class="nama">${sel && !x.coret ? "⚠️ " : ""}${_rkE(x.uraian || "—")}</td>${baris(rkBulan(x), rkJumlah(x))}</tr>`; }).join("");
  }).join("");
  const t1 = s.t1, t2 = s.t2;
  return `<div class="rkx-jd-pesan">Ketuk sebuah rincian untuk memilih bulan belanjanya. ${s.belum.length ? `<b class="rkx-merah">⚠️ ${s.belum.length} rincian belum terjadwal penuh.</b>` : `<b class="rkx-hijau">✅ Semua rincian sudah terjadwal.</b>`}</div>
  <div class="rkx-tabel-wrap"><table class="rkx-tabel">
    <thead><tr><th rowspan="2" class="nama">Uraian</th><th colspan="7" class="h1">TAHAP 1</th><th colspan="7" class="h2">TAHAP 2</th><th rowspan="2" class="jml">Jumlah</th></tr>
      <tr>${[1, 2, 3, 4, 5, 6].map((m) => `<th>${RK_BLN[m - 1]}</th>`).join("")}<th class="th1">Σ T1</th>${[7, 8, 9, 10, 11, 12].map((m) => `<th>${RK_BLN[m - 1]}</th>`).join("")}<th class="th2">Σ T2</th></tr></thead>
    <tbody>${isi}</tbody>
    <tfoot><tr class="tot"><td class="nama">Jumlah per Bulan</td>${baris(s.bulan, s.total)}</tr>
      <tr class="jatah"><td class="nama">Jatah Dana Tahap</td><td colspan="6"></td>${sel(s.jatah1, "th1")}<td colspan="6"></td>${sel(s.jatah2, "th2")}${sel(s.dana, "jml")}</tr>
      <tr class="sisa"><td class="nama">Sisa Tahap</td><td colspan="6"></td><td class="th1 ${s.jatah1 - t1 < 0 ? "min" : ""}"><span class="p">${_rkRp(s.jatah1 - t1)}</span><span class="s">${_rkSingkat(s.jatah1 - t1)}</span></td><td colspan="6"></td><td class="th2 ${s.jatah2 - t2 < 0 ? "min" : ""}"><span class="p">${_rkRp(s.jatah2 - t2)}</span><span class="s">${_rkSingkat(s.jatah2 - t2)}</span></td><td class="jml ${s.sisa < 0 ? "min" : ""}"><span class="p">${_rkRp(s.sisa)}</span><span class="s">${_rkSingkat(s.sisa)}</span></td></tr></tfoot>
  </table></div>`;
}

// ── Tab Ringkasan ──
function _rkHtmlRingkas(s) {
  const kel = _rkKel().map((k) => ({ ...k, jml: _rkSubtotal(k.id) })).sort((a, b) => b.jml - a.jml), maks = Math.max(1, ...kel.map((k) => k.jml)), maksB = Math.max(1, ...s.bulan.slice(1));
  const warna = ["#0f766e", "#2563eb", "#d97706", "#7c3aed", "#db2777", "#059669", "#0891b2", "#65a30d", "#dc2626", "#4f46e5"];
  return `<div class="rkx-rg">
    <div class="rkx-rg-kartu"><h4>Pembagian per Kelompok</h4>${kel.map((k, i) => `<div class="rkx-batang"><span>${_rkE(k.nama || "Tanpa nama")}</span><div><i style="width:${(k.jml / maks) * 100}%;background:${warna[i % warna.length]}"></i></div><b>${_rkSingkat(k.jml)}<small>${s.total ? Math.round((k.jml / s.total) * 1000) / 10 : 0}%</small></b></div>`).join("") || "<em>Belum ada data.</em>"}</div>
    <div class="rkx-rg-kartu"><h4>Belanja per Bulan</h4><div class="rkx-kolom">${s.bulan.slice(1).map((v, i) => `<div title="${RK_BLN_PANJANG[i]}: Rp ${_rkRp(v)}"><small>${v ? _rkSingkat(v) : ""}</small><i class="${i < 6 ? "t1" : "t2"}" style="height:${(v / maksB) * 100}%"></i><span>${RK_BLN[i]}</span></div>`).join("")}</div>
      <div class="rkx-legenda"><span><i class="t1"></i>Tahap 1</span><span><i class="t2"></i>Tahap 2</span></div></div>
    <div class="rkx-rg-kartu"><h4>Tahap 1 &amp; Tahap 2</h4>${[["Tahap 1 (Jan–Jun)", s.t1, s.jatah1, "t1"], ["Tahap 2 (Jul–Des)", s.t2, s.jatah2, "t2"]].map(([n, v, j, c]) => `<div class="rkx-tahap"><div><b>${n}</b><span>Rp ${_rkRp(v)} dari jatah Rp ${_rkRp(j)}</span></div><div class="rkx-meter"><i class="${c} ${v > j ? "lebih" : ""}" style="width:${j ? Math.min(100, (v / j) * 100) : 0}%"></i></div><small class="${j - v < 0 ? "rkx-merah" : "rkx-hijau"}">${j - v < 0 ? "Lebih Rp " + _rkRp(v - j) : "Sisa Rp " + _rkRp(j - v)}</small></div>`).join("")}</div>
    <div class="rkx-rg-kartu"><h4>Perlu Diperhatikan</h4><ul class="rkx-cek">
      ${!s.dana ? `<li class="x">Dana Anggaran belum diisi.</li>` : s.sisa < 0 ? `<li class="x">Kebutuhan melebihi dana <b>Rp ${_rkRp(-s.sisa)}</b> — kurangi volume atau coret rincian.</li>` : `<li class="v">Kebutuhan masih di bawah dana, sisa <b>Rp ${_rkRp(s.sisa)}</b>.</li>`}
      ${s.belum.length ? `<li class="x">${s.belum.length} rincian belum terjadwal penuh: ${s.belum.slice(0, 6).map((x) => _rkE(x.uraian || "—")).join(", ")}${s.belum.length > 6 ? "…" : ""}</li>` : `<li class="v">Semua rincian sudah terjadwal.</li>`}
      ${s.t1 > s.jatah1 && s.dana ? `<li class="x">Belanja Tahap 1 melebihi jatah — geser sebagian ke Juli–Desember.</li>` : ""}${s.t2 > s.jatah2 && s.dana ? `<li class="x">Belanja Tahap 2 melebihi jatah.</li>` : ""}
      ${_rkItem().filter((x) => x.coret).length ? `<li class="i">${_rkItem().filter((x) => x.coret).length} rincian dicoret (tidak dihitung).</li>` : ""}
    </ul></div>
  </div>`;
}

// ============================================================
//  IMPOR dari Excel (format lembar Draft RKAS seperti contoh)
// ============================================================
const _rkNorm = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
async function rkImpor(inp) {
  const f = inp.files && inp.files[0]; inp.value = ""; if (!f) return;
  try {
    if (typeof XLSX === "undefined") throw new Error("Pembaca Excel belum termuat, coba muat ulang halaman.");
    const wb = XLSX.read(await f.arrayBuffer(), { type: "array" });
    const nama = wb.SheetNames.find((n) => /putra|putri|paket|draft|rkas/i.test(n) && !/perhitungan|dibelanjakan/i.test(n)) || wb.SheetNames[0];
    const h = _rkBacaLembar(wb.Sheets[nama]);
    if (!h.kel.length) throw new Error(`Tidak menemukan rincian kebutuhan di sheet "${nama}". Pastikan kolom A=No, B=Uraian, C=Volume, D=Satuan, E=Harga Satuan, F=Jumlah.`);
    const lama = _rkItem().length;
    const nItem = h.kel.reduce((a, k) => a + k.item.length, 0), terj = h.kel.reduce((a, k) => a + k.item.filter((x) => (x.jadwal && x.jadwal.length) || x.manual).length, 0);
    const total = h.kel.reduce((a, k) => a + k.item.reduce((b, x) => b + rkJumlah(x), 0), 0);
    if (!(await konfirmasiTema(`Sheet "${_rkE(nama)}" terbaca:\n• ${h.kel.length} kelompok, ${nItem} rincian\n• Total kebutuhan Rp ${_rkRp(total)}\n• ${terj} rincian ikut jadwal bulanannya\n${h.dana ? `• Dana anggaran Rp ${_rkRp(h.dana)}\n` : ""}${lama ? `\n⚠️ ${lama} rincian yang sudah ada di Draft RKAS ${RK.th} akan DIGANTI.` : ""}`, { ikon: "📥", judul: "Impor Excel", teksYa: "Impor Sekarang" }))) return;
    const kelPot = {}, itemPot = {};
    _rkKel().forEach((k) => { kelPot[k.id] = { ...RK.data.kel[k.id], dihapus: true }; });
    _rkItem().forEach((x) => { itemPot[x.id] = { ...RK.data.item[x.id], dihapus: true }; });
    const t = Date.now();
    h.kel.forEach((k, i) => {
      const kid = _rkId(); kelPot[kid] = { nama: k.nama, u: i + 1, t };
      k.item.forEach((x, j) => { itemPot[_rkId()] = { ...x, kel: kid, u: j + 1, t }; });
    });
    const pot = { kel: kelPot, item: itemPot }; if (h.dana) pot.dana = Math.round(h.dana);
    Object.assign(RK.data.kel, kelPot); Object.assign(RK.data.item, itemPot); if (h.dana) RK.data.dana = pot.dana;
    RK.tab = "rinci"; _rkGambar(); await _rkTulis(pot);
    toast(`✅ ${nItem} rincian diimpor dari Excel${terj < nItem ? ` — ${nItem - terj} rincian belum terjadwal, cek tab Jadwal Bulanan` : ""}.`, "success");
  } catch (e) { console.error(e); toast("Gagal impor: " + (e.message || e), "error"); }
}
function _rkBacaLembar(ws) {
  const rg = XLSX.utils.decode_range(ws["!ref"] || "A1:A1"), v = (r, c) => { const x = ws[XLSX.utils.encode_cell({ r, c })]; return x ? x.v : undefined; };
  const num = (x) => (typeof x === "number" ? x : typeof x === "string" && x.trim() && !isNaN(+x.replace(/\./g, "").replace(",", ".")) ? +x.replace(/\./g, "").replace(",", ".") : 0);
  const kel = []; let cur = null, dana = 0;
  // ── kiri: rincian kebutuhan (A..F) ──
  for (let r = rg.s.r; r <= rg.e.r; r++) {
    const e = v(r, 4);
    if (typeof e === "string" && /total\s*kebutuhan/i.test(e)) { for (let q = r; q <= Math.min(rg.e.r, r + 6); q++) if (/dana\s*anggaran/i.test(String(v(q, 4) || ""))) dana = num(v(q, 5)); break; }
    const no = v(r, 0), ur = String(v(r, 1) ?? "").replace(/^\s*-\s*/, "").trim();
    if (!ur || /^uraian$/i.test(ur)) continue;
    const vol = num(v(r, 2)), sat = String(v(r, 3) ?? "").trim(), harga = num(v(r, 4)), jml = num(v(r, 5)), adaRp = vol || harga;
    if (typeof no === "number" || (typeof no === "string" && /^\d+$/.test(no.trim()))) { cur = { nama: ur, item: [] }; kel.push(cur); if (!adaRp) continue; }
    else if (!adaRp) continue;
    if (!cur) { cur = { nama: ur, item: [] }; kel.push(cur); }
    const dasar = (vol || 1) * harga, frek = dasar && jml ? Math.round((jml / dasar) * 100) / 100 : 1;
    cur.item.push({ uraian: ur, vol: vol || 1, sat, harga, frek: frek || 1, jadwal: [], manual: false, bulanRp: null, coret: !jml });
  }
  // ── kanan: jadwal bulanan (kolom bulan 1–12 di baris judul) ──
  let rowJ = -1, kolBln = {}, kolNama = -1;
  for (let r = rg.s.r; r <= Math.min(rg.e.r, rg.s.r + 6) && rowJ < 0; r++) {
    const kb = {}; for (let c = 6; c <= rg.e.c; c++) { const x = v(r, c); if (typeof x === "number" && x >= 1 && x <= 12 && Number.isInteger(x) && !kb[x]) kb[x] = c; }
    if (Object.keys(kb).length >= 10) { rowJ = r; kolBln = kb; for (let c = kb[1] - 1; c >= 6; c--) if (/tahap/i.test(String(v(r, c) || ""))) { kolNama = c; break; } if (kolNama < 0) kolNama = kb[1] - 1; }
  }
  if (rowJ >= 0) {
    const semua = []; kel.forEach((k) => k.item.forEach((x) => semua.push({ k, x })));
    const singkat = (s) => s.split(/\s+/).filter(Boolean).map((w) => w[0]).join("").toLowerCase();
    let konteks = null;
    for (let r = rowJ + 1; r <= rg.e.r; r++) {
      const nm = String(v(r, kolNama) ?? "").trim();
      const rp = {}; Object.entries(kolBln).forEach(([m, c]) => { const n = num(v(r, c)); if (n > 0) rp[m] = n; });
      if (!nm) { if (Object.keys(rp).length) break; continue; } // baris jumlah per bulan = akhir tabel jadwal
      const n = _rkNorm(nm);
      const cocok = (a) => { const b = _rkNorm(a); return b && (b === n || (b.length >= 3 && n.length >= 3 && (b.includes(n) || n.includes(b)))); };
      const kelPas = kel.find((k) => _rkNorm(k.nama) === n) || kel.find((k) => singkat(k.nama) === n);
      if (!Object.keys(rp).length) { konteks = kelPas || konteks; continue; }
      const dlmKonteks = konteks ? semua.find((o) => o.k === konteks && _rkNorm(o.x.uraian) === n) : null;
      const itemPas = dlmKonteks || semua.find((o) => _rkNorm(o.x.uraian) === n && !(kelPas && o.k !== kelPas && kelPas.item.length > 1));
      let target;
      if (itemPas && !(kelPas && kelPas.item.length > 1)) target = [itemPas.x];
      else if (kelPas) target = kelPas.item;
      else { const o = semua.find((o) => cocok(o.x.uraian)) || null; const kk = kel.find((k) => cocok(k.nama)); target = o ? [o.x] : kk ? kk.item : null; }
      if (!target) continue;
      const aktif = target.filter((x) => !x.coret), tot = aktif.reduce((a, x) => a + rkJumlah(x), 0);
      aktif.forEach((x) => {
        const bag = target.length === 1 ? 1 : tot ? rkJumlah(x) / tot : 1 / aktif.length, br = { ...(x.bulanRp || {}) };
        Object.entries(rp).forEach(([m, val]) => { br[m] = (br[m] || 0) + Math.round(val * bag); });
        x.bulanRp = br; x.manual = true;
      });
    }
    // sederhanakan: bila nominal tiap bulan sama & totalnya pas → cukup simpan bulannya (dibagi rata otomatis)
    semua.forEach(({ x }) => {
      if (!x.manual) return; const bl = Object.keys(x.bulanRp).map(Number).sort((a, b) => a - b);
      x.jadwal = bl;
      const rata = rkBulan({ ...x, manual: false, jadwal: bl });
      if (bl.every((m) => Math.abs((rata[m] || 0) - x.bulanRp[m]) <= 1)) { x.manual = false; x.bulanRp = null; }
      x.ikutBulan = !x.manual && bl.length > 1 && Math.round(Number(x.frek) || 1) === bl.length;
    });
  }
  return { kel: kel.filter((k) => k.item.length), dana };
}

// ============================================================
//  UNDUH EXCEL — tata letak seperti lembar Draft RKAS (kiri rincian, kanan jadwal, bawah total)
// ============================================================
async function rkUnduh() {
  if (typeof ExcelJS === "undefined") { toast("Pembuat Excel belum termuat, coba muat ulang halaman.", "warn"); return; }
  const s = rkRingkas(), nm = typeof _bspNamaRuang === "function" ? _bspNamaRuang(RK.ruang) : RK.ruang;
  const wb = new ExcelJS.Workbook(), ws = wb.addWorksheet(String(nm).slice(0, 28) || "RKAS", { views: [{ state: "frozen", ySplit: 3 }] });
  const garis = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
  const RP = '#,##0;[Red]-#,##0';
  const judul = (c, teks, warna) => { const x = ws.getCell(c); x.value = teks; x.font = { bold: true, color: { argb: "FFFFFFFF" } }; x.fill = { type: "pattern", pattern: "solid", fgColor: { argb: warna || "FF0F766E" } }; x.alignment = { horizontal: "center", vertical: "middle", wrapText: true }; x.border = garis; };
  ws.mergeCells("A1:I1"); const t = ws.getCell("A1"); t.value = `DRAFT RKAS ${RK.th} — ${String(nm).toUpperCase()}`; t.font = { bold: true, size: 14 };
  // kiri
  ["NO", "URAIAN", "VOLUME", "SATUAN", "HARGA SATUAN", "× KALI", "JUMLAH", "SUBTOTAL"].forEach((h, i) => { ws.mergeCells(2, i + 1, 3, i + 1); judul(ws.getCell(2, i + 1).address, h); });
  [6, 28, 10, 10, 15, 8, 15, 15].forEach((w, i) => { ws.getColumn(i + 1).width = w; });
  let r = 4; const awalItem = [];
  _rkKel().forEach((k, i) => {
    const item = _rkItem(k.id), r0 = r;
    ws.getCell(r, 1).value = i + 1; ws.getCell(r, 2).value = k.nama; ws.getCell(r, 2).font = { bold: true };
    for (let c = 1; c <= 8; c++) { ws.getCell(r, c).border = garis; ws.getCell(r, c).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFECFDF5" } }; }
    r++;
    const rA = r;
    item.forEach((x) => {
      const row = ws.getRow(r);
      row.getCell(2).value = (x.coret ? "(dicoret) " : "- ") + (x.uraian || ""); row.getCell(3).value = Number(x.vol) || 0; row.getCell(4).value = x.sat || ""; row.getCell(5).value = Number(x.harga) || 0; row.getCell(6).value = rkKali(x);
      row.getCell(7).value = x.coret ? 0 : { formula: `C${r}*E${r}*F${r}`, result: rkJumlah(x) };
      if (x.coret) row.font = { strike: true, color: { argb: "FF94A3B8" } };
      for (let c = 1; c <= 8; c++) row.getCell(c).border = garis;
      [3, 5, 7].forEach((c) => { row.getCell(c).numFmt = RP; });
      awalItem.push({ x, r }); r++;
    });
    if (item.length) { ws.getCell(r0, 8).value = { formula: `SUM(G${rA}:G${r - 1})`, result: _rkSubtotal(k.id) }; ws.getCell(r0, 8).numFmt = RP; ws.getCell(r0, 8).font = { bold: true }; }
  });
  r++;
  const lbl = (rr, teks, nilai, rumus, tebal) => { ws.getCell(rr, 5).value = teks; ws.getCell(rr, 5).font = { bold: true }; const c = ws.getCell(rr, 7); c.value = rumus ? { formula: rumus, result: nilai } : nilai; c.numFmt = RP; c.font = { bold: !!tebal }; c.border = garis; };
  const rTot = r; lbl(r++, "Total Kebutuhan", s.total, `SUM(G4:G${rTot - 2})`, true);
  const rDana = r; lbl(r++, "Dana Anggaran", s.dana);
  lbl(r++, "Sisa", s.sisa, `G${rDana}-G${rTot}`, true);
  lbl(r++, `Jatah Tahap 1 (${Number(RK.data.tahap1) || 50}%)`, s.jatah1); lbl(r++, "Jatah Tahap 2", s.jatah2);
  // kanan: jadwal (mulai kolom J)
  const K0 = 10, kol = (m) => K0 + 1 + (m <= 6 ? m - 1 : m) , kT1 = K0 + 7, kT2 = K0 + 14, kJ = K0 + 15;
  ws.getColumn(K0).width = 26; for (let c = K0 + 1; c <= kJ; c++) ws.getColumn(c).width = 12.5;
  ws.mergeCells(2, K0, 3, K0); judul(ws.getCell(2, K0).address, "URAIAN");
  ws.mergeCells(2, K0 + 1, 2, kT1); judul(ws.getCell(2, K0 + 1).address, "TAHAP 1", "FF1D4ED8");
  ws.mergeCells(2, kT1 + 1, 2, kT2); judul(ws.getCell(2, kT1 + 1).address, "TAHAP 2", "FFB45309");
  ws.mergeCells(2, kJ, 3, kJ); judul(ws.getCell(2, kJ).address, "JUMLAH");
  for (let m = 1; m <= 12; m++) judul(ws.getCell(3, kol(m)).address, RK_BLN_PANJANG[m - 1], m <= 6 ? "FF1D4ED8" : "FFB45309");
  judul(ws.getCell(3, kT1).address, "Jml Tahap 1", "FF1E3A8A"); judul(ws.getCell(3, kT2).address, "Jml Tahap 2", "FF92400E");
  const L = (c) => ws.getColumn(c).letter;
  let q = 4; const qAwal = 4;
  _rkKel().forEach((k, i) => {
    ws.getCell(q, K0).value = `${i + 1}. ${k.nama || ""}`; ws.getCell(q, K0).font = { bold: true };
    for (let c = K0; c <= kJ; c++) { ws.getCell(q, c).border = garis; ws.getCell(q, c).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFECFDF5" } }; }
    q++;
    _rkItem(k.id).forEach((x) => {
      const rp = rkBulan(x); ws.getCell(q, K0).value = "   " + (x.uraian || "");
      for (let m = 1; m <= 12; m++) if (rp[m]) ws.getCell(q, kol(m)).value = rp[m];
      ws.getCell(q, kT1).value = { formula: `SUM(${L(kol(1))}${q}:${L(kol(6))}${q})` }; ws.getCell(q, kT2).value = { formula: `SUM(${L(kol(7))}${q}:${L(kol(12))}${q})` };
      ws.getCell(q, kJ).value = { formula: `${L(kT1)}${q}+${L(kT2)}${q}` };
      for (let c = K0; c <= kJ; c++) { ws.getCell(q, c).border = garis; if (c > K0) ws.getCell(q, c).numFmt = RP; }
      [kT1, kT2, kJ].forEach((c) => { ws.getCell(q, c).font = { bold: true }; });
      q++;
    });
  });
  ws.getCell(q, K0).value = "JUMLAH PER BULAN"; ws.getCell(q, K0).font = { bold: true };
  for (let c = K0 + 1; c <= kJ; c++) { const x = ws.getCell(q, c); x.value = { formula: `SUM(${L(c)}${qAwal}:${L(c)}${q - 1})` }; x.numFmt = RP; x.font = { bold: true }; x.border = garis; x.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFEF3C7" } }; }
  q++;
  ws.getCell(q, K0).value = "Jatah Dana Tahap"; ws.getCell(q, kT1).value = s.jatah1; ws.getCell(q, kT2).value = s.jatah2; [kT1, kT2].forEach((c) => { ws.getCell(q, c).numFmt = RP; });
  q++;
  ws.getCell(q, K0).value = "Sisa Tahap"; ws.getCell(q, kT1).value = { formula: `${L(kT1)}${q - 1}-${L(kT1)}${q - 2}` }; ws.getCell(q, kT2).value = { formula: `${L(kT2)}${q - 1}-${L(kT2)}${q - 2}` }; [kT1, kT2].forEach((c) => { ws.getCell(q, c).numFmt = RP; ws.getCell(q, c).font = { bold: true }; });
  const buf = await wb.xlsx.writeBuffer();
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
  a.download = `DRAFT RKAS ${RK.th}_${String(nm).toUpperCase().replace(/[^\w&]+/g, " ").trim()}.xlsx`; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}

// ============================================================
//  MENU & GAYA
// ============================================================
(function rkPasang() {
  if (typeof RG_IKON !== "undefined") {
    RG_IKON["bsp-rkas"] = '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9M15 21V9"/>';
    RG_IKON["pg-rkas"] = RG_IKON["bsp-rkas"];
  }
  if (typeof RG_MENU_PENGELOLA !== "undefined") {
    const k = RG_MENU_PENGELOLA.find((g) => g.group === "Keuangan");
    if (k && !k.items.some((x) => x[0] === "pg-rkas")) k.items.push(["pg-rkas", "", "Draft RKAS Jenjang"]);
  }
  if (typeof PG_MODUL_SIAP !== "undefined" && !PG_MODUL_SIAP.includes("pg-rkas")) PG_MODUL_SIAP.push("pg-rkas");
  if (typeof rgBukaPengelola === "function") {
    const asli = rgBukaPengelola;
    rgBukaPengelola = async function (key) { if (key === "pg-rkas") return rkBuka(); return asli.apply(this, arguments); };
  }
  if (typeof renderSidebar === "function") {
    const asli = renderSidebar;
    renderSidebar = function () {
      const h = asli.apply(this, arguments);
      try {
        if (typeof RG === "undefined" || !RG.siap || STATE.ruang === "Pg" || !_rkBoleh()) return h;
        const nav = qs("nav-list"); if (!nav || nav.querySelector("[data-rkas]")) return h;
        const el = document.createElement("div"); el.className = "nav-item" + (STATE.currentPage === "bsp-rkas" ? " active" : ""); el.dataset.rkas = "1";
        el.innerHTML = `${rgSvg("bsp-rkas")}<span>Draft RKAS</span>`; el.onclick = () => rkBuka();
        const kk = nav.querySelector("[data-bsp]"); if (kk) kk.before(el); else nav.appendChild(el);
      } catch (e) { console.warn("Menu Draft RKAS:", e); }
      return h;
    };
  }
  // daftar satuan yang sering dipakai
  if (!document.getElementById("rkx-satuan")) { const d = document.createElement("datalist"); d.id = "rkx-satuan"; d.innerHTML = ["kotak", "pcs", "bulan", "orang", "rim", "pak", "lbr", "kali", "paket", "unit", "buah", "dus", "set", "OK", "OH", "OB"].map((x) => `<option value="${x}">`).join(""); document.body.appendChild(d); }
})();

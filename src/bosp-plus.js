// ============================================================
//  BOSP — fitur tambahan Kertas Kerja
//  1. Kegiatan Rutin: listrik, air, internet, ATK, dst. — pilih bulan, nominal bisa beda tiap bulan
//  2. Salin Kertas Kerja tahun lalu
//  3. Pemberitahuan: pengajuan → Bendahara; disahkan/dikembalikan → penyusun ruang (push + di aplikasi)
//  4. Isi Cepat (cerdas): ketik nama barang/jasa → kode kegiatan, rekening, satuan, & batas harga terisi
//     otomatis dari (a) Data SSH, (b) kamus kata kunci, (c) riwayat isian sebelumnya
//  5. Data SSH (Standar Satuan Harga): batas bawah & batas atas harga — diimpor Bendahara dari Excel
//  6. Realisasi BOSP: rencana vs realisasi per bulan, ambil dari Kas Bendahara, pantau Tahap 1 ≥ 50%
// ============================================================

// ── Kamus kata kunci → kegiatan, rekening, satuan ──
const BSP_KATA = [
  [/kertas|hvs|pulpen|pena\b|spidol|\batk\b|alat tulis|\bmap\b|stapler|isolasi|amplop|buku tulis|penggaris|\blem\b|pensil|penghapus|klip|binder/, "06.05.08", "Belanja Alat/Bahan untuk Kegiatan Kantor - Alat Tulis Kantor", "Paket"],
  [/tinta|toner|cartridge|catridge|flash ?disk|hardisk|hard disk|mouse|keyboard|kabel|stop ?kontak/, "06.05.08", "Belanja Alat/Bahan untuk Kegiatan Kantor - Bahan Komputer", "Buah"],
  [/listrik|\bpln\b|token listrik/, "06.07.01", "Belanja Tagihan Listrik", "Bulan"],
  [/pdam|air bersih|tagihan air|langganan air|rekening air/, "06.07.03", "Belanja Tagihan Air", "Bulan"],
  [/internet|wifi|wi-fi|indihome|paket data|kuota|langganan data/, "06.07.05", "Belanja Kawat/Faksimili/Internet/TV Berlangganan", "Bulan"],
  [/telepon|telpon|pulsa/, "06.07.04", "Belanja Tagihan Telepon", "Bulan"],
  [/laptop|notebook|chromebook/, "05.09.02", "Belanja Modal Laptop / Notebook", "Unit"],
  [/komputer|\bpc\b|desktop|all in one|aio\b/, "05.09.01", "Belanja Modal Komputer Unit / Personal Computer", "Unit"],
  [/printer|scanner|pemindai/, "05.09.04", "Belanja Modal Printer / Scanner (Peralatan Personal Komputer)", "Unit"],
  [/proyektor|projector|\blcd\b|layar proyektor|tv led|smart tv|televisi/, "05.09.05", "Belanja Modal LCD Proyektor / Layar", "Unit"],
  [/buku guru/, "05.02.04", "Belanja Modal Buku Teks / Bahan Perpustakaan", "Eksemplar"],
  [/buku teks|buku paket|buku siswa|buku pelajaran|buku murid/, "05.02.03", "Belanja Modal Buku Teks / Bahan Perpustakaan", "Eksemplar"],
  [/buku bacaan|buku cerita|pengayaan|referensi|kamus|ensiklopedia|novel|buku nonteks/, "05.02.05", "Belanja Modal Buku Teks / Bahan Perpustakaan", "Eksemplar"],
  [/honor (tutor|guru|pendidik|pengajar)/, "07.12.01", "Belanja Jasa Tenaga Pendidikan (Honorarium Guru/Tutor)", "Orang/Bulan"],
  [/honor (tu\b|tata usaha|administrasi|operator|bendahara|admin)/, "07.12.03", "Belanja Jasa Tenaga Administrasi", "Orang/Bulan"],
  [/honor (kebersihan|cleaning|penjaga|satpam|keamanan)|tenaga kebersihan/, "07.12.04", "Belanja Jasa Tenaga Kebersihan", "Orang/Bulan"],
  [/sabun|\bpel\b|sapu|tisu|tissue|pembersih|kemoceng|tempat sampah|disinfekt|karbol|pewangi|keset/, "06.05.09", "Belanja Bahan Kebersihan dan Sanitasi", "Paket"],
  [/snack|konsumsi|makan|minum|nasi kotak|\bkue\b|jamuan/, "06.05.06", "Belanja Makanan dan Minuman Rapat", "OK (Orang Kegiatan)"],
  [/materai|meterai|administrasi bank|biaya admin|adm bank/, "07.05.01", "Belanja Meterai / Administrasi Bank", "Buah"],
  [/fotokopi|foto ?copy|penggandaan|jilid|laminating/, "07.05.02", "Belanja Penggandaan / Fotokopi", "Lembar"],
  [/\bcat\b|pengecatan|plafon|atap|genteng|\bseng\b|pintu|jendela|keramik|lantai|perbaikan ruang|perbaikan kelas|toilet|\bwc\b|talang|instalasi listrik/, "05.08.01", "Belanja Pemeliharaan Bangunan Gedung Tempat Pendidikan", "Paket"],
  [/servis|service|perbaikan (laptop|komputer|printer|ac|proyektor)|perawatan ac/, "05.08.03", "Belanja Pemeliharaan Komputer", "Unit"],
  [/meja|kursi|lemari|rak buku|papan tulis|whiteboard|filing cabinet/, "05.08.04", "Belanja Modal Mebel", "Unit"],
  [/obat|p3k|\buks\b|kotak obat|termometer|masker/, "03.05.02", "Belanja Obat-Obatan dan Bahan Kesehatan", "Paket"],
  [/pramuka/, "03.03.06", "Belanja Alat/Bahan untuk Kegiatan Kantor Lainnya", "Paket"],
  [/lomba|perlombaan|piala|hadiah|medali/, "03.03.19", "Belanja Alat/Bahan untuk Kegiatan Kantor Lainnya", "Paket"],
  [/naskah soal|soal ujian|ujian|asesmen|ulangan|sumatif/, "08.04.06", "Belanja Penggandaan / Fotokopi", "Lembar"],
  [/kisi-kisi|penyusunan soal/, "08.04.05", "Honorarium Narasumber / Pembahas / Moderator / Panitia", "OK (Orang Kegiatan)"],
  [/ppdb|pendaftaran|brosur|spanduk|banner|pamflet|baliho/, "03.01.01", "Belanja Cetak", "Lembar"],
  [/pelatihan|workshop|bimtek|diklat|seminar|in house training|iht/, "04.06.05", "Belanja Kursus Singkat / Pelatihan", "OK (Orang Kegiatan)"],
  [/transport|perjalanan dinas|uang jalan|ke dinas/, "06.05.14", "Belanja Perjalanan Dinas", "OK (Orang Kegiatan)"],
  [/website|domain|hosting/, "06.05.12", "Belanja Langganan Platform / Aplikasi Pembelajaran", "Tahun"],
  [/dapodik/, "06.05.03", "Belanja Alat/Bahan untuk Kegiatan Kantor Lainnya", "Kegiatan"],
  [/modul|media pembelajaran|alat peraga/, "05.05.01", "Belanja Bahan Praktik / Bahan Pendukung Pembelajaran", "Eksemplar"],
  [/bahan praktik|bahan keterampilan|alat keterampilan|bahan praktek/, "06.05.07", "Belanja Bahan Praktik / Bahan Pendukung Pembelajaran", "Paket"],
  [/seragam/, "05.08.11", "Belanja Pakaian / Seragam", "Set"],
  [/\bbbm\b|bensin|solar|elpiji|lpg|gas melon/, "06.07.07", "Belanja Alat/Bahan untuk Kegiatan Kantor Lainnya", "Liter"],
  [/koran|majalah/, "06.07.09", "Belanja Alat/Bahan untuk Kegiatan Kantor Lainnya", "Bulan"],
  [/perpustakaan digital|e-book|ebook/, "03.02.03", "Belanja Langganan Platform / Aplikasi Pembelajaran", "Tahun"],
  [/rapat|musyawarah|sosialisasi/, "07.05.03", "Belanja Makanan dan Minuman Rapat", "OK (Orang Kegiatan)"],
];
const _bspNorm = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const _bspJenisRek = (rek) => (BSP_REK.find((r) => r.nama === rek) || {}).jenis || (/modal/i.test(rek) ? "modal" : /tenaga pendidik/i.test(rek) ? "pegawai" : "barang");
const _bspNamaKeg = (kode) => (BSP_KEG.find((k) => k.kode === kode) || {}).uraian || "";
function bspTebak(teks) {
  const t = " " + _bspNorm(teks) + " ";
  for (const [pola, kode, rek, sat] of BSP_KATA) if (pola.test(t)) return { kode, kegiatan: _bspNamaKeg(kode), rek, jenis: _bspJenisRek(rek), satuan: sat };
  return null;
}

// ============================================================
//  1. KEGIATAN RUTIN
// ============================================================
const BSP_RUTIN = [
  ["listrik", "Tagihan listrik bulanan", "06.07.01", "Belanja Tagihan Listrik"],
  ["air", "Tagihan air (PDAM)", "06.07.03", "Belanja Tagihan Air"],
  ["internet", "Langganan internet", "06.07.05", "Belanja Kawat/Faksimili/Internet/TV Berlangganan"],
  ["telepon", "Tagihan telepon / pulsa", "06.07.04", "Belanja Tagihan Telepon"],
  ["atk", "Alat tulis kantor", "06.05.08", "Belanja Alat/Bahan untuk Kegiatan Kantor - Alat Tulis Kantor"],
  ["bersih", "Bahan kebersihan & sanitasi", "06.05.09", "Belanja Bahan Kebersihan dan Sanitasi"],
  ["rapat", "Konsumsi rapat kedinasan", "06.05.06", "Belanja Makanan dan Minuman Rapat"],
  ["materai", "Bea materai & administrasi bank", "07.05.01", "Belanja Meterai / Administrasi Bank"],
  ["fotokopi", "Penggandaan laporan & surat", "07.05.02", "Belanja Penggandaan / Fotokopi"],
  ["bbm", "BBM/gas untuk keperluan PKBM", "06.07.07", "Belanja Alat/Bahan untuk Kegiatan Kantor Lainnya"],
];
function bspRutin() {
  if (!_bspBisaUbah()) return;
  BSP.rutin = BSP.rutin || { pilih: ["listrik", "internet"], bulan: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], nominal: {} };
  _bspRutinGambar();
}
function _bspRutinGambar() {
  const R = BSP.rutin, pilih = BSP_RUTIN.filter((x) => R.pilih.includes(x[0]));
  const total = pilih.reduce((a, [k]) => a + R.bulan.reduce((s, m) => s + _bspAngka((R.nominal[k] || {})[m]), 0), 0);
  openModal(`<div class="bsp-modal"><h3>⚡ Kegiatan Rutin</h3>
    <p class="bsp-ket">Tambahkan belanja rutin sekaligus. Pilih kegiatan dan bulannya, lalu isi nominal — boleh berbeda tiap bulan (mis. tagihan listrik naik turun). Ketik di kolom <b>Sama</b> untuk mengisi semua bulan sekaligus.</p>
    <div class="bsp-rutin-pilih">${BSP_RUTIN.map(([k, n, kode]) => `<label class="${R.pilih.includes(k) ? "aktif" : ""}"><input type="checkbox" ${R.pilih.includes(k) ? "checked" : ""} onchange="_bspRutinTog('${k}')"> ${n}<small>${kode}</small></label>`).join("")}</div>
    <div class="bsp-f"><span>Bulan</span><div class="bsp-pg-bulan">${BSP_BULAN.map((n, i) => `<button class="${R.bulan.includes(i + 1) ? "aktif" : ""}" onclick="_bspRutinBulan(${i + 1})">${n.slice(0, 3)}</button>`).join("")}<button class="bsp-pg-semua" onclick="BSP.rutin.bulan=BSP.rutin.bulan.length===12?[]:[1,2,3,4,5,6,7,8,9,10,11,12];_bspRutinGambar()">${R.bulan.length === 12 ? "Kosongkan" : "Semua"}</button></div></div>
    ${pilih.length && R.bulan.length ? `<div class="table-wrap"><table class="bsp-tabel kecil bsp-rutin-tabel"><thead><tr><th>Kegiatan</th><th>Sama</th>${R.bulan.map((m) => `<th>${BSP_BULAN[m - 1].slice(0, 3)}</th>`).join("")}<th>Total</th></tr></thead><tbody>
      ${pilih.map(([k, n]) => { const nm = R.nominal[k] || {}, tot = R.bulan.reduce((s, m) => s + _bspAngka(nm[m]), 0); return `<tr><td><b>${_bspE(n)}</b></td>
        <td><input class="input" inputmode="numeric" placeholder="Rp" oninput="this.value=formatRibuan(this.value);_bspRutinSama('${k}',this.value)"></td>
        ${R.bulan.map((m) => `<td><input id="rt-${k}-${m}" class="input" inputmode="numeric" placeholder="0" value="${nm[m] ? formatRibuan(nm[m]) : ""}" oninput="this.value=formatRibuan(this.value);_bspRutinSet('${k}',${m},this.value)"></td>`).join("")}
        <td><b id="rt-tot-${k}">${bspRp(tot)}</b></td></tr>`; }).join("")}</tbody></table></div>` : `<div class="bsp-kosong">Pilih kegiatan dan bulan.</div>`}
    <div class="bsp-dianggarkan"><span>Total semua</span><b id="rt-total">${bspRp(total)}</b></div>
    <div class="bsp-aksi-bawah"><button class="btn btn-outline" onclick="closeModal()">Batal</button><button class="btn bsp-hitam" onclick="bspSimpanRutin()">+ Masukkan ke Anggaran</button></div></div>`, { lebar: true });
}
function _bspRutinTog(k) { const p = BSP.rutin.pilih, i = p.indexOf(k); i >= 0 ? p.splice(i, 1) : p.push(k); _bspRutinGambar(); }
function _bspRutinBulan(m) { const b = BSP.rutin.bulan, i = b.indexOf(m); i >= 0 ? b.splice(i, 1) : b.push(m); b.sort((x, y) => x - y); _bspRutinGambar(); }
function _bspRutinSet(k, m, v) { (BSP.rutin.nominal[k] = BSP.rutin.nominal[k] || {})[m] = _bspAngka(v); _bspRutinHitung(k); }
function _bspRutinSama(k, v) { const n = _bspAngka(v); BSP.rutin.bulan.forEach((m) => { (BSP.rutin.nominal[k] = BSP.rutin.nominal[k] || {})[m] = n; const el = qs(`rt-${k}-${m}`); if (el) el.value = n ? formatRibuan(n) : ""; }); _bspRutinHitung(k); }
function _bspRutinHitung(k) {
  const R = BSP.rutin, nm = R.nominal[k] || {}, el = qs("rt-tot-" + k); if (el) el.textContent = bspRp(R.bulan.reduce((s, m) => s + _bspAngka(nm[m]), 0));
  const t = qs("rt-total"); if (t) t.textContent = bspRp(BSP_RUTIN.filter((x) => R.pilih.includes(x[0])).reduce((a, [kk]) => a + R.bulan.reduce((s, m) => s + _bspAngka((R.nominal[kk] || {})[m]), 0), 0));
}
async function bspSimpanRutin() {
  const R = BSP.rutin, baris = {};
  for (const [k, n, kode, rek] of BSP_RUTIN.filter((x) => R.pilih.includes(x[0]))) {
    const nm = R.nominal[k] || {}, bl = R.bulan.filter((m) => _bspAngka(nm[m]));
    if (!bl.length) continue;
    const harga = _bspAngka(nm[bl[0]]);
    baris[_bspId()] = { kode, kegiatan: _bspNamaKeg(kode), rek, jenis: _bspJenisRek(rek), uraian: n, harga, oleh: STATE.guruNama || "", t: Date.now(),
      bulan: Object.fromEntries(bl.map((m) => [m, { jml: 1, sat: "Bulan", ...(_bspAngka(nm[m]) !== harga ? { harga: _bspAngka(nm[m]) } : {}) }])) };
  }
  if (!Object.keys(baris).length) { toast("Isi nominal minimal satu bulan", "err"); return; }
  const tambah = Object.values(baris).reduce((a, b) => a + bspTotalBaris(b), 0), pagu = _bspPaguRuang(), ada = _bspBarisRuang(BSP.kk, STATE.ruang).reduce((a, b) => a + bspTotalBaris(b), 0);
  if (pagu && ada + tambah > pagu) { toast(`Melebihi pagu. Sisa yang belum dianggarkan ${bspRp(Math.max(0, pagu - ada))}.`, "err"); return; }
  try {
    const hasil = await _kvGabung(_bspKunciKK(BSP.th), { baris });
    BSP.kk = hasil && hasil.baris ? hasil : { ...BSP.kk, baris: { ...BSP.kk.baris, ...baris } };
    BSP.rutin.nominal = {}; closeModal(); _bspGambar(); toast(`${Object.keys(baris).length} kegiatan rutin ditambahkan (${bspRp(tambah)})`, "ok");
  } catch (e) { toast("Gagal: " + e.message, "err"); }
}

// ============================================================
//  2. SALIN DARI TAHUN LALU
// ============================================================
async function bspSalinTahunLalu() {
  const th0 = BSP.th - 1;
  try {
    const r = await supa.from("kuliah_pengaturan").select("nilai").eq("kunci", _bspKunciKK(th0)).maybeSingle();
    const lama = _bspBaris((r.data && r.data.nilai) || {});
    if (!lama.length) { toast(`Kertas Kerja ${th0} ruang ini masih kosong`, "info"); return; }
    const tot = lama.reduce((a, b) => a + bspTotalBaris(b), 0);
    if (!(await konfirmasiTema(`Salin ${lama.length} uraian (${bspRp(tot)}) dari Kertas Kerja ${th0}? Harga & bulan ikut tersalin dan bisa diubah setelahnya.`, { judul: "Salin dari Tahun Lalu", ikon: "⧉", teksYa: "Ya, Salin" }))) return;
    const baris = {};
    lama.forEach((b, i) => { const { id, sisip, oleh, t, ...isi } = b; baris[_bspId() + i] = { ...isi, oleh: STATE.guruNama || "", t: Date.now() + i, disalin: th0 }; });
    const hasil = await _kvGabung(_bspKunciKK(BSP.th), { baris });
    BSP.kk = hasil && hasil.baris ? hasil : { ...BSP.kk, baris };
    _bspGambar(); toast(`${lama.length} uraian tersalin dari ${th0}. Periksa kembali harga & pagu.`, "ok");
  } catch (e) { toast("Gagal: " + e.message, "err"); }
}

// ============================================================
//  3. PEMBERITAHUAN
// ============================================================
async function _bspPush(ids, title, body) {
  try { await supa.functions.invoke("send-push-notif", { body: { ...(ids && ids.length ? { guru_ids: [...new Set(ids)] } : { target: "admin" }), title, body, tag: "bosp", url: "/" } }); } catch (e) { console.warn("Push BOSP:", e); }
}
function _bspPushAjukan(total) {
  _bspPush(BSP.bend, `Kertas Kerja ${_bspNamaRuang(STATE.ruang)} diajukan`, `${STATE.guruNama || "Penyusun"} mengajukan Kertas Kerja BOSP ${BSP.th} (${bspRp(total)}). Buka Rancangan BOSP di ruang Pengelola untuk memeriksa.`);
}
async function _bspPushKeputusan(ruang, status, catatan) {
  const ids = [];
  const st = ((BSP.gab || {})[ruang] || {})._status || {};
  if (st.oleh_id) ids.push(st.oleh_id);
  try { const p = await supaSemua.from("kuliah_pengaturan").select("nilai").eq("kunci", "penyelenggara").eq("ruang_id", ruang).maybeSingle(); ids.push(...((p.data && p.data.nilai && p.data.nilai.ids) || [])); } catch (e) {}
  if (!ids.length) return;
  _bspPush(ids, status === "disahkan" ? `Kertas Kerja ${_bspNamaRuang(ruang)} disahkan ✓` : `Kertas Kerja ${_bspNamaRuang(ruang)} dikembalikan`, status === "disahkan" ? `Kertas Kerja BOSP ${BSP.th} sudah disahkan Bendahara.` : `Perlu diperbaiki: ${catatan}`);
}
// pengingat di dalam aplikasi (sekali per pembukaan)
async function _bspCekPemberitahuan() {
  if (BSP._dicek) return; BSP._dicek = true;
  const th = _bspTahunAwal();
  try {
    const [u, b] = await Promise.all([
      supaSemua.from("kuliah_pengaturan").select("nilai").eq("kunci", _bspKunciUmum(th)).eq("ruang_id", "*").maybeSingle(),
      supaSemua.from("kuliah_pengaturan").select("nilai").eq("kunci", "bosp:bendahara").eq("ruang_id", "*").maybeSingle(),
    ]);
    const umum = (u.data && u.data.nilai) || {}; BSP.bend = (b.data && b.data.nilai && b.data.nilai.ids) || BSP.bend;
    const simpanUmum = BSP.umum; BSP.umum = umum;
    if (bspBendahara()) {
      const r = await supaSemua.from("kuliah_pengaturan").select("ruang_id,nilai").eq("kunci", _bspKunciKK(th));
      const menunggu = (r.data || []).filter((x) => BSP_RUANG.includes(x.ruang_id) && bspStatus(x.nilai, x.ruang_id).status === "diajukan").map((x) => _bspNamaRuang(x.ruang_id));
      BSP.menunggu = menunggu.length;
      if (menunggu.length) { toast(`📥 Kertas Kerja BOSP menunggu pengesahan: ${menunggu.join(", ")}`, "info"); renderSidebar(); }
    }
    if (bspBolehSusun()) {
      const k = (umum.keputusan || {})[STATE.ruang], kunci = "bsp:lihat:" + STATE.ruang + ":" + th;
      let lihat = 0; try { lihat = +localStorage.getItem(kunci) || 0; } catch (e) {}
      if (k && k.t > lihat) { toast(k.status === "disahkan" ? `✅ Kertas Kerja BOSP ${th} sudah disahkan Bendahara` : `↩️ Kertas Kerja BOSP ${th} dikembalikan: ${k.catatan || ""}`, k.status === "disahkan" ? "ok" : "warn"); try { localStorage.setItem(kunci, String(k.t)); } catch (e) {} }
    }
    if (STATE.currentPage !== "bsp-kk" && STATE.currentPage !== "pg-bosp") BSP.umum = simpanUmum;
  } catch (e) { console.warn("Cek BOSP:", e); }
}
(function _bspTungguMasuk() {
  let n = 0;
  const cek = () => { if (typeof RG !== "undefined" && RG.siap && STATE.guruId) { setTimeout(_bspCekPemberitahuan, 3000); return; } if (n++ < 60) setTimeout(cek, 2000); };
  setTimeout(cek, 3000);
})();

// ============================================================
//  4. ISI CEPAT (CERDAS) di Tambah Kegiatan
// ============================================================
bspTambah = function () {
  if (!_bspBisaUbah()) return;
  BSP.draf = null;
  openModal(`<div class="bsp-modal"><h3>Tambah Kegiatan</h3>
    <div class="bsp-cepat"><b>✨ Isi Cepat</b><small>Ketik nama barang/jasa — kode kegiatan, rekening, satuan, dan batas harga terisi otomatis.</small>
      <input id="bsp-cepat" class="input" placeholder="mis. kertas HVS A4, tagihan listrik, laptop, honor tutor, snack rapat" oninput="_bspSaranCepat(this.value)"><div id="bsp-saran" class="bsp-pilihan"></div></div>
    <div class="bsp-atau"><i></i>atau pilih manual seperti di ARKAS<i></i></div>
    <div class="bsp-langkah"><span class="aktif">1. Kegiatan</span><span>2. Rekening Belanja</span><span>3. Detail Anggaran</span></div>
    <input id="bsp-q" class="input" placeholder="Cari kegiatan dengan kata kunci atau kode, mis. 'buku' atau '05.02'" oninput="_bspDaftarKeg(this.value)">
    <div id="bsp-keg" class="bsp-pilihan"></div></div>`, { lebar: true });
  _bspDaftarKeg(""); setTimeout(() => qs("bsp-cepat")?.focus(), 50);
};
function _bspSaranCepat(q) {
  const el = qs("bsp-saran"); if (!el) return;
  const s = _bspNorm(q); if (s.length < 2) { el.innerHTML = ""; BSP.saran = []; return; }
  const saran = [], kunci = new Set();
  const tambah = (x) => { const k = x.kode + "|" + x.rek + "|" + _bspNorm(x.uraian); if (!x.kode || kunci.has(k)) return; kunci.add(k); saran.push(x); };
  // a) Data SSH
  _bspSshCari(q, 5).forEach(({ item }) => { const t = (item.kode && { kode: item.kode, rek: item.rek || "" }) || bspTebak(item.nama + " " + (item.rek || "")) || {}; const rek = item.rek || t.rek; tambah({ sumber: "SSH", kode: t.kode, rek, jenis: _bspJenisRek(rek || ""), uraian: item.nama + (item.spek ? " " + item.spek : ""), satuan: item.satuan || t.satuan, ssh: item }); });
  // b) riwayat isian (Kertas Kerja ruang ini)
  _bspBaris(BSP.kk).filter((b) => _bspNorm(b.uraian).includes(s)).slice(0, 4).forEach((b) => tambah({ sumber: "Riwayat", kode: b.kode, rek: b.rek, jenis: b.jenis, uraian: b.uraian, satuan: Object.values(b.bulan || {})[0]?.sat, harga: b.harga }));
  // c) kamus kata kunci
  const t = bspTebak(q); if (t) tambah({ sumber: "Saran", ...t, uraian: q.trim() });
  BSP.saran = saran;
  el.innerHTML = saran.map((x, i) => { const p = bspProgram(x.kode); return `<button class="bsp-opsi" onclick="_bspPakaiSaran(${i})"><span class="bsp-kode" style="--pw:${p[1]}">${_bspE(x.kode)}</span><span><b>${_bspE(x.uraian)}</b><small>${_bspE(_bspNamaKeg(x.kode))}</small><small>${_bspE(x.rek || "Rekening dipilih kemudian")}${x.satuan ? " · " + _bspE(x.satuan) : ""}</small>
    <em class="t-${x.sumber === "SSH" ? "buku" : x.sumber === "Riwayat" ? "honor" : "sarpras"}">${x.sumber}${x.ssh ? ` · ${bspRp(x.ssh.bawah)} – ${bspRp(x.ssh.atas)}` : x.harga ? " · " + bspRp(x.harga) : ""}</em>${_bspTandaKode(x.kode)}</span></button>`; }).join("")
    || `<div class="bsp-kosong">Belum ada saran untuk "${_bspE(q)}". Pilih kegiatan secara manual di bawah.</div>`;
}
function _bspPakaiSaran(i) {
  const x = (BSP.saran || [])[i]; if (!x) return;
  BSP.draf = { kode: x.kode, kegiatan: _bspNamaKeg(x.kode), rek: x.rek, jenis: x.jenis || _bspJenisRek(x.rek || ""), uraian: x.uraian, satuan: x.satuan, harga: x.harga || "" };
  if (!x.rek) { _bspPilihKeg(x.kode); return; } // rekening belum diketahui → pilih rekening
  bspIsiDetail(null);
}
// rekening dipilih setelah kegiatan dari saran: pertahankan uraian & satuan
const _bspPilihRekAsli = _bspPilihRek;
_bspPilihRek = function (i) { const lama = BSP.draf || {}; _bspPilihRekAsli(i); };
const _bspPilihKegAsli = _bspPilihKeg;
_bspPilihKeg = function (kode) { const lama = BSP.draf || {}; _bspPilihKegAsli(kode); if (lama.uraian && BSP.draf) { BSP.draf.uraian = lama.uraian; BSP.draf.satuan = lama.satuan; BSP.draf.harga = lama.harga; } };

// ============================================================
//  5. DATA SSH (Standar Satuan Harga) — batas bawah & batas atas
// ============================================================
async function _bspMuatSSH(paksa) {
  if (BSP.ssh && !paksa) return BSP.ssh;
  try { const r = await supaSemua.from("kuliah_pengaturan").select("nilai").eq("kunci", "bosp:ssh").eq("ruang_id", "*").maybeSingle(); BSP.ssh = (r.data && r.data.nilai) || {}; }
  catch (e) { BSP.ssh = {}; }
  return BSP.ssh;
}
const _bspSshItems = () => Object.entries((BSP.ssh || {}).items || {}).filter(([, x]) => x && !x.dihapus).map(([id, x]) => ({ id, ...x }));
function _bspSshCari(teks, n = 1) {
  const kata = _bspNorm(teks).split(" ").filter((w) => w.length > 1); if (!kata.length) return [];
  return _bspSshItems().map((item) => {
    const nk = _bspNorm(item.nama + " " + (item.spek || "")).split(" ");
    const cocok = kata.filter((w) => nk.some((x) => x === w || (w.length > 3 && x.startsWith(w)) || (x.length > 3 && w.startsWith(x)))).length;
    const namaK = _bspNorm(item.nama).split(" ").filter((w) => w.length > 1);
    const skor = cocok / Math.max(kata.length, 1) * 0.6 + (namaK.filter((w) => kata.includes(w)).length / Math.max(namaK.length, 1)) * 0.4;
    return { item, skor };
  }).filter((x) => x.skor >= 0.45).sort((a, b) => b.skor - a.skor).slice(0, n);
}
function _bspCekSSH() {
  const el = qs("bsp-ssh"), ur = qs("bsp-uraian"); if (!el || !ur) return;
  const m = _bspSshCari(ur.value, 1)[0];
  if (!_bspSshItems().length) { el.innerHTML = "Batas harga (SSH) belum dimasukkan Bendahara — harga dicek saat input ke ARKAS."; el.className = ""; return; }
  if (!m) { el.innerHTML = "Tidak ditemukan di Data SSH — pastikan nama barang sesuai SSH."; el.className = "bsp-ssh-tanya"; return; }
  const x = m.item, hs = [_bspAngka(qs("bsp-harga")?.value), ...((BSP.edit && BSP.edit.beda) ? BSP.edit.kartu.map((k) => _bspAngka(k.harga)) : [])].filter(Boolean);
  const luar = hs.filter((h) => (x.bawah && h < x.bawah) || (x.atas && h > x.atas));
  el.innerHTML = `SSH: <b>${_bspE(x.nama)}</b>${x.satuan ? " / " + _bspE(x.satuan) : ""} · Batas Bawah <b>${bspRp(x.bawah)}</b> · Batas Atas <b>${bspRp(x.atas)}</b>${hs.length ? (luar.length ? " — ✗ di luar batas" : " — ✓ sesuai") : ""}`;
  el.className = hs.length ? (luar.length ? "bsp-ssh-salah" : "bsp-ssh-ok") : "bsp-ssh-info";
}
function _bspValidasiSSH(uraian, hargaList) {
  if (!_bspSshItems().length) return "";
  const m = _bspSshCari(uraian, 1)[0]; if (!m) return "";
  const x = m.item, luar = hargaList.filter((h) => h && ((x.bawah && h < x.bawah) || (x.atas && h > x.atas)));
  return luar.length ? `Harga di luar batas SSH "${x.nama}": ${bspRp(x.bawah)} – ${bspRp(x.atas)}. Sesuaikan harga (ARKAS juga akan menolak).` : "";
}
// muat SSH saat Kertas Kerja dibuka
const _bspBukaKKAsli = bspBukaKK;
bspBukaKK = async function (th) { _bspMuatSSH(); return _bspBukaKKAsli(th); };

const BSP_SSHV = { cari: "" };
async function bspBukaSSH() {
  const sec = _rgBukaHal("pg-ssh", "Data SSH (Batas Harga)", `<div class="card"><div class="rg-memuat">Memuat Data SSH…</div></div>`);
  await Promise.all([_bspMuatSSH(true), BSP.bend.length ? null : _bspMuatUmum(_bspTahunAwal())]);
  _bspGambarSSH(sec);
}
function _bspGambarSSH(sec) {
  sec = sec || qs("page-rg"); if (!sec || STATE.currentPage !== "pg-ssh") return;
  const bend = bspBendahara(), s = _bspNorm(BSP_SSHV.cari), semua = _bspSshItems(), daftar = semua.filter((x) => !s || _bspNorm(x.nama + " " + (x.spek || "") + " " + (x.rek || "")).includes(s)).slice(0, 400), info = BSP.ssh || {};
  sec.innerHTML = `<div class="bsp">
    <div class="bsp-atas"><div><h2 class="bsp-judul">Data SSH (Batas Harga)</h2><div class="bsp-sub">STANDAR SATUAN HARGA · ${semua.length} BARANG/JASA${info.tahun ? " · TAHUN " + _bspE(info.tahun) : ""}${info.sumber ? " · " + _bspE(String(info.sumber).toUpperCase()) : ""}</div></div>
      ${bend ? `<div class="bsp-kanan"><div class="bsp-tombol"><label class="btn btn-accent">⬆ Impor Excel<input type="file" accept=".xlsx,.xls,.csv" hidden onchange="bspImporSSH(this)"></label><button class="btn btn-outline" onclick="bspFormSSH()">+ Tambah Manual</button><button class="btn btn-outline" onclick="bspContohSSH()">⬇ Contoh Format</button></div></div>` : ""}</div>
    <div class="card bsp-ssh-info-kartu"><b>Apa itu SSH?</b><p>Acuan harga satuan barang/jasa yang ditetapkan daerah. Di ARKAS, harga satuan harus di antara <b>Batas Bawah</b> (harga terendah) dan <b>Batas Atas</b> (harga tertinggi) yang ditentukan Dinas — bila di luar batas, ARKAS menolak. Dengan data ini, aplikasi memeriksa harga sejak menyusun Kertas Kerja dan mengisi satuan/rekening otomatis.</p>
      <p><b>Sumber untuk Kab. Hulu Sungai Tengah:</b> SSH ditetapkan dengan Keputusan Bupati (dasar: Perbup HST 41/2024 tentang Standar Harga Satuan; perubahan terakhir yang ditemukan: Kepbup 900/178/910/2025). Daftar harganya ada di lampiran dan tidak dipublikasikan dalam bentuk data. <b>Minta berkas SSH/batas harga ARKAS ke Dinas Pendidikan HST atau BPKAD HST</b>, atau salin dari ARKAS di perangkat Bendahara, lalu impor di sini.</p></div>
    <input class="input bsp-cari-ref" placeholder="Cari barang/jasa…" value="${_bspE(BSP_SSHV.cari)}" oninput="BSP_SSHV.cari=this.value;clearTimeout(window._bspT);window._bspT=setTimeout(()=>{_bspGambarSSH();const i=document.querySelector('.bsp-cari-ref');if(i){i.focus();i.setSelectionRange(i.value.length,i.value.length)}},250)">
    <div class="table-wrap bsp-tabel-wrap"><table class="bsp-tabel"><thead><tr><th>Nama Barang/Jasa</th><th>Spesifikasi</th><th>Satuan</th><th>Batas Bawah</th><th>Batas Atas</th><th>Rekening / Kode</th>${bend ? "<th></th>" : ""}</tr></thead><tbody>
      ${daftar.map((x) => `<tr><td><b>${_bspE(x.nama)}</b></td><td>${_bspE(x.spek || "")}</td><td>${_bspE(x.satuan || "")}</td><td>${bspRp(x.bawah)}</td><td>${bspRp(x.atas)}</td><td><small>${_bspE(x.rek || "")}${x.kode ? " · " + _bspE(x.kode) : ""}</small></td>${bend ? `<td style="white-space:nowrap"><button class="btn btn-sm btn-ghost" onclick="bspFormSSH('${x.id}')">Ubah</button><button class="btn btn-sm btn-ghost" onclick="bspHapusSSH('${x.id}')">Hapus</button></td>` : ""}</tr>`).join("") || `<tr><td colspan="7" class="bsp-kosong">${semua.length ? "Tidak ditemukan." : "Belum ada Data SSH. Bendahara bisa mengimpor dari Excel."}</td></tr>`}
    </tbody></table></div>${semua.length > daftar.length ? `<small class="bsp-ket">Menampilkan ${daftar.length} dari ${semua.length} — gunakan pencarian.</small>` : ""}</div>`;
}
function bspContohSSH() {
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet([
    { "Nama Barang/Jasa": "Kertas HVS A4 70 gram", Spesifikasi: "1 rim = 500 lembar", Satuan: "Rim", "Batas Bawah": 45000, "Batas Atas": 65000, "Rekening Belanja": "Belanja Alat/Bahan untuk Kegiatan Kantor - Kertas dan Cover", "Kode Kegiatan": "06.05.08" },
    { "Nama Barang/Jasa": "Laptop", Spesifikasi: "Core i5, RAM 8GB, SSD 512GB", Satuan: "Unit", "Batas Bawah": 7000000, "Batas Atas": 12000000, "Rekening Belanja": "Belanja Modal Laptop / Notebook", "Kode Kegiatan": "05.09.02" },
  ]), "SSH");
  XLSX.writeFile(wb, "Contoh Format Data SSH.xlsx");
}
async function bspImporSSH(input) {
  const f = input.files && input.files[0]; input.value = ""; if (!f) return;
  try {
    const wb = XLSX.read(await f.arrayBuffer(), { type: "array" });
    const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1, defval: "" });
    // cari baris judul kolom
    let hi = rows.findIndex((r) => r.some((c) => /nama|uraian|barang/i.test(String(c))) && r.some((c) => /harga|batas|atas|bawah|satuan/i.test(String(c))));
    if (hi < 0) throw new Error("Baris judul kolom tidak ditemukan. Pakai Contoh Format.");
    const hd = rows[hi].map((c) => String(c).toLowerCase());
    const kol = (re, kecuali) => hd.findIndex((c) => re.test(c) && !(kecuali && kecuali.test(c)));
    const iN = kol(/nama|uraian|barang|jasa/, /satuan|kode|rekening|spesifikasi/), iS = kol(/spesifikasi|spek|keterangan/), iSat = kol(/satuan/, /harga/), iB = kol(/bawah|minimal|minimum|terendah/), iA = kol(/atas|maksimal|maksimum|tertinggi/), iH = kol(/harga/, /bawah|atas|min|maks|tertinggi|terendah/), iR = kol(/rekening/), iK = kol(/kode/, /rekening/);
    if (iN < 0) throw new Error("Kolom nama barang tidak ditemukan.");
    const items = {}; let n = 0;
    rows.slice(hi + 1).forEach((r) => {
      const nama = String(r[iN] || "").trim(); if (!nama) return;
      const atas = _bspAngka(iA >= 0 ? r[iA] : iH >= 0 ? r[iH] : 0), bawah = _bspAngka(iB >= 0 ? r[iB] : 0);
      if (!atas && !bawah) return;
      items["s" + (++n).toString(36) + Math.random().toString(36).slice(2, 5)] = { nama, spek: iS >= 0 ? String(r[iS] || "").trim() : "", satuan: iSat >= 0 ? String(r[iSat] || "").trim() : "", bawah, atas: atas || bawah, rek: iR >= 0 ? String(r[iR] || "").trim() : "", kode: iK >= 0 ? String(r[iK] || "").trim() : "" };
    });
    if (!n) throw new Error("Tidak ada baris harga yang terbaca.");
    const ganti = await konfirmasiTema(`${n} barang/jasa terbaca dari "${f.name}". Ganti seluruh Data SSH lama dengan data ini? (Pilih Batal untuk membatalkan.)`, { judul: "Impor Data SSH", ikon: "⬆", teksYa: "Ya, Ganti Semua" });
    if (!ganti) return;
    const tahun = (await promptTema("Tahun berlaku SSH ini:", String(_bspTahunAwal()))) || "";
    await _bspGabungUmum("bosp:ssh", { items: null });
    BSP.ssh = await _bspGabungUmum("bosp:ssh", { items, tahun, sumber: f.name, oleh: STATE.guruNama || "", t: Date.now() });
    toast(`${n} data SSH tersimpan`, "ok"); _bspGambarSSH();
  } catch (e) { toast("Gagal impor: " + e.message, "err"); }
}
function bspFormSSH(id) {
  const x = id ? _bspSshItems().find((i) => i.id === id) : { nama: "", spek: "", satuan: "", bawah: "", atas: "", rek: "", kode: "" };
  openModal(`<div class="bsp-modal"><h3>${id ? "Ubah" : "Tambah"} Data SSH</h3>
    <div class="bsp-baris2"><label class="bsp-f"><span>Nama Barang/Jasa</span><input id="sh-nama" class="input" value="${_bspE(x.nama)}"></label><label class="bsp-f"><span>Spesifikasi</span><input id="sh-spek" class="input" value="${_bspE(x.spek)}"></label></div>
    <div class="bsp-baris2"><label class="bsp-f"><span>Satuan</span><input id="sh-sat" class="input" list="bsp-satuan-ssh" value="${_bspE(x.satuan)}"><datalist id="bsp-satuan-ssh">${BSP_SATUAN.map((s) => `<option value="${s}">`).join("")}</datalist></label>
      <label class="bsp-f"><span>Kode Kegiatan (opsional)</span><input id="sh-kode" class="input" value="${_bspE(x.kode)}" placeholder="mis. 06.05.08"></label></div>
    <div class="bsp-baris2"><label class="bsp-f"><span>Batas Bawah</span><input id="sh-bawah" class="input" inputmode="numeric" value="${x.bawah ? formatRibuan(x.bawah) : ""}" oninput="this.value=formatRibuan(this.value)"></label><label class="bsp-f"><span>Batas Atas</span><input id="sh-atas" class="input" inputmode="numeric" value="${x.atas ? formatRibuan(x.atas) : ""}" oninput="this.value=formatRibuan(this.value)"></label></div>
    <label class="bsp-f"><span>Rekening Belanja (opsional)</span><input id="sh-rek" class="input" list="bsp-rek-ssh" value="${_bspE(x.rek)}"><datalist id="bsp-rek-ssh">${BSP_REK.map((r) => `<option value="${_bspE(r.nama)}">`).join("")}</datalist></label>
    <div class="bsp-aksi-bawah"><button class="btn btn-outline" onclick="closeModal()">Batal</button><button class="btn bsp-hitam" onclick="bspSimpanSSH('${id || ""}')">Simpan</button></div></div>`);
}
async function bspSimpanSSH(id) {
  const v = (k) => qs(k).value.trim(), x = { nama: v("sh-nama"), spek: v("sh-spek"), satuan: v("sh-sat"), kode: v("sh-kode"), rek: v("sh-rek"), bawah: _bspAngka(v("sh-bawah")), atas: _bspAngka(v("sh-atas")) };
  if (!x.nama) { toast("Isi nama barang/jasa", "err"); return; }
  if (!x.atas) { toast("Isi batas atas", "err"); return; }
  if (x.bawah > x.atas) { toast("Batas bawah tidak boleh lebih besar dari batas atas", "err"); return; }
  try { BSP.ssh = await _bspGabungUmum("bosp:ssh", { items: { [id || _bspId()]: x } }); closeModal(); toast("Tersimpan", "ok"); _bspGambarSSH(); }
  catch (e) { toast("Gagal: " + e.message, "err"); }
}
async function bspHapusSSH(id) {
  if (!(await konfirmasiTema("Hapus data SSH ini?"))) return;
  try { BSP.ssh = await _bspGabungUmum("bosp:ssh", { items: { [id]: { dihapus: true } } }); _bspGambarSSH(); } catch (e) { toast("Gagal: " + e.message, "err"); }
}

// ============================================================
//  6. REALISASI BOSP — rencana vs realisasi, terhubung ke Kas Bendahara
// ============================================================
const BSP_REAL = { th: null, bulan: new Date().getMonth() + 1, ruang: "", d: {} };
const _bspKunciReal = (th) => "bosp:real:" + th;
async function bspBukaRealisasi(th) {
  BSP_REAL.th = BSP.th = th || BSP_REAL.th || BSP.th || _bspTahunAwal();
  const sec = _rgBukaHal("pg-real", "Realisasi BOSP", `<div class="card"><div class="rg-memuat">Memuat realisasi…</div></div>`);
  try {
    await _bspMuatUmum(BSP.th);
    const [r, rl] = await Promise.all([
      supaSemua.from("kuliah_pengaturan").select("ruang_id,nilai").eq("kunci", _bspKunciKK(BSP.th)),
      supaSemua.from("kuliah_pengaturan").select("nilai").eq("kunci", _bspKunciReal(BSP.th)).eq("ruang_id", "*").maybeSingle(),
    ]);
    BSP.gab = Object.fromEntries((r.data || []).map((x) => [x.ruang_id, x.nilai || { baris: {} }]));
    BSP_REAL.d = ((rl.data && rl.data.nilai) || {}).d || {};
  } catch (e) { sec.innerHTML = `<div class="card">Gagal memuat: ${_bspE(e.message)}</div>`; return; }
  _bspGambarReal();
}
const _bspKunciBaris = (b, m) => `${b.ruang}:${b.id}:${m}`;
const _bspNilaiReal = (b, m) => Number((BSP_REAL.d[_bspKunciBaris(b, m)] || {}).n) || 0;
function _bspGambarReal() {
  const sec = qs("page-rg"); if (!sec || STATE.currentPage !== "pg-real") return;
  const bend = bspBendahara(), semua = _bspBarisGab(), th = BSP.th, bln = BSP_REAL.bulan;
  const rencanaBulan = (m) => semua.reduce((a, b) => a + bspTotalBulan(b, m), 0), realBulan = (m) => semua.reduce((a, b) => a + _bspNilaiReal(b, m), 0);
  const ren = (ms) => ms.reduce((a, m) => a + rencanaBulan(m), 0), rea = (ms) => ms.reduce((a, m) => a + realBulan(m), 0);
  const T1 = [1, 2, 3, 4, 5, 6], T2 = [7, 8, 9, 10, 11, 12], pagu = Number(((BSP.umum || {}).pagu || {}).total) || 0;
  const dana1 = pagu ? pagu / 2 : ren(T1), p1 = dana1 ? (rea(T1) / dana1) * 100 : 0;
  const batas1 = new Date(th, 6, 31), sisaHari = Math.ceil((batas1 - new Date()) / 864e5);
  const maks = Math.max(1, ...[...Array(12).keys()].map((i) => Math.max(rencanaBulan(i + 1), realBulan(i + 1))));
  const tampil = semua.filter((b) => (b.bulan || {})[bln] && (!BSP_REAL.ruang || b.ruang === BSP_REAL.ruang));
  sec.innerHTML = `<div class="bsp">
    <div class="bsp-atas"><div><h2 class="bsp-judul">Realisasi BOSP</h2><div class="bsp-sub">BOP KESETARAAN REGULER ${th} · RENCANA (KERTAS KERJA) VS REALISASI
      <select class="bsp-th" onchange="bspBukaRealisasi(+this.value)">${[th - 1, th, th + 1].map((y) => `<option ${y === th ? "selected" : ""}>${y}</option>`).join("")}</select></div></div>
      <div class="bsp-kanan"><div class="bsp-tombol"><button class="btn btn-outline" onclick="bspBukaRealisasi(BSP.th)">↻ Perbarui</button><button class="btn btn-accent" onclick="bspUnduhReal()">⬇ Unduh Excel</button></div></div></div>
    <div class="bsp-real-ringkas">
      <div class="card"><small>Pagu PKBM</small><b>${bspRp(pagu)}</b></div>
      <div class="card"><small>Rencana Setahun</small><b>${bspRp(ren([...T1, ...T2]))}</b></div>
      <div class="card"><small>Realisasi Setahun</small><b>${bspRp(rea([...T1, ...T2]))}</b><em>${ren([...T1, ...T2]) ? ((rea([...T1, ...T2]) / ren([...T1, ...T2])) * 100).toFixed(1) : 0}% dari rencana</em></div>
      <div class="card bsp-real-t1 ${p1 >= 50 ? "ok" : "awas"}"><small>Tahap I (Jan–Jun)</small><b>${p1.toFixed(1)}%</b><div class="bsp-rv-track"><i style="width:${Math.min(100, p1)}%"></i><u style="left:50%"></u></div>
        <em>${p1 >= 50 ? "✓ Sudah ≥50% — syarat penyaluran Tahap II" : `Perlu ${bspRp(Math.max(0, dana1 / 2 - rea(T1)))} lagi untuk 50%`} · lapor paling lambat 31 Juli${sisaHari > 0 && sisaHari < 200 ? ` (${sisaHari} hari lagi)` : ""}</em></div>
    </div>
    <div class="card"><h4 style="margin:0 0 8px">Rencana vs Realisasi per Bulan</h4><div class="bsp-real-grafik">${BSP_BULAN.map((n, i) => { const m = i + 1, r1 = rencanaBulan(m), r2 = realBulan(m); return `<button class="${m === bln ? "aktif" : ""}" onclick="BSP_REAL.bulan=${m};_bspGambarReal()" title="${n}: rencana ${bspRp(r1)}, realisasi ${bspRp(r2)}"><span><i class="ren" style="height:${(r1 / maks) * 100}%"></i><i class="rea" style="height:${(r2 / maks) * 100}%"></i></span><small>${n.slice(0, 3)}</small></button>`; }).join("")}</div>
      <div class="bsp-rv-legenda bsp-real-leg"><span><i style="background:#cbd5e1"></i>Rencana</span><span><i style="background:#16a34a"></i>Realisasi</span></div></div>
    <div class="bsp-saring"><b>${BSP_BULAN[bln - 1]} ${th}</b><select onchange="BSP_REAL.ruang=this.value;_bspGambarReal()"><option value="">Semua Ruang</option>${[...BSP_RUANG, "Pg"].map((r) => `<option value="${r}" ${BSP_REAL.ruang === r ? "selected" : ""}>${_bspE(_bspNamaRuang(r))}</option>`).join("")}</select>
      <span>Rencana ${bspRp(rencanaBulan(bln))} · Realisasi ${bspRp(realBulan(bln))}</span></div>
    <div class="table-wrap bsp-tabel-wrap"><table class="bsp-tabel"><thead><tr><th>Ruang</th><th>Kegiatan</th><th>Uraian</th><th>Rencana</th><th>Realisasi</th><th>Tanggal</th><th>Keterangan / Bukti</th><th>Selisih</th></tr></thead><tbody>
      ${tampil.map((b) => { const k = _bspKunciBaris(b, bln), r = BSP_REAL.d[k] || {}, rc = bspTotalBulan(b, bln), sl = rc - (Number(r.n) || 0); return `<tr><td>${_bspE(_bspNamaRuang(b.ruang))}</td><td><small>${_bspE(b.kode)}</small> ${_bspE(b.kegiatan)}</td><td class="bsp-uraian">${_bspE(b.uraian)}</td><td>${bspRp(rc)}</td>
        <td>${bend ? `<input class="bsp-kode-rek bsp-real-n" inputmode="numeric" value="${r.n ? formatRibuan(r.n) : ""}" placeholder="Rp" onchange="bspSimpanReal('${k}',{n:_bspAngka(this.value)})" oninput="this.value=formatRibuan(this.value)">` : bspRp(r.n)}</td>
        <td>${bend ? `<input type="date" class="bsp-kode-rek" value="${_bspE(r.tgl || "")}" onchange="bspSimpanReal('${k}',{tgl:this.value})">` : _bspE(r.tgl || "")}</td>
        <td>${bend ? `<input class="bsp-kode-rek" value="${_bspE(r.ket || "")}" placeholder="No. bukti / toko" onchange="bspSimpanReal('${k}',{ket:this.value})"> <button class="btn btn-sm btn-ghost" onclick="bspAmbilKas('${k}')">dari Kas</button>` : _bspE(r.ket || "")}</td>
        <td class="${r.n ? (sl < 0 ? "bsp-merah" : "") : ""}">${r.n ? bspRp(sl) : "—"}</td></tr>`; }).join("") || `<tr><td colspan="8" class="bsp-kosong">Tidak ada rencana kegiatan di bulan ${BSP_BULAN[bln - 1]}.</td></tr>`}
    </tbody></table></div></div>`;
}
async function bspSimpanReal(k, isi) {
  if (!bspBendahara()) return;
  try { const h = await _bspGabungUmum(_bspKunciReal(BSP.th), { d: { [k]: { ...(BSP_REAL.d[k] || {}), ...isi, oleh: STATE.guruNama || "", t: Date.now() } } }); BSP_REAL.d = h.d || BSP_REAL.d; _bspGambarReal(); }
  catch (e) { toast("Gagal: " + e.message, "err"); }
}
async function bspAmbilKas(k) {
  const ym = `${BSP.th}-${String(BSP_REAL.bulan).padStart(2, "0")}`;
  openModal(`<div class="bsp-modal"><h3>Ambil dari Kas Bendahara</h3><p class="bsp-ket">Pengeluaran Kas bulan ${BSP_BULAN[BSP_REAL.bulan - 1]} ${BSP.th}. Pilih transaksi yang sesuai.</p><div id="bsp-kas" class="bsp-pilihan">${typeof loadingHTML === "function" ? loadingHTML("Memuat Kas…") : "Memuat…"}</div></div>`, { lebar: true });
  try {
    const r = await supaSemua.from("kas_transaksi").select("id,tanggal,nominal,keterangan,pihak,nomor_bukti,ruang_id,jenis").eq("dihapus", false).eq("jenis", "keluar").gte("tanggal", ym + "-01").lte("tanggal", ym + "-31").order("tanggal");
    if (r.error) throw r.error;
    BSP.kasPilih = r.data || [];
    qs("bsp-kas").innerHTML = BSP.kasPilih.map((t, i) => `<button class="bsp-opsi" onclick="_bspPakaiKas('${k}',${i})"><span class="bsp-jenis-chip" style="--jw:#16a34a">${_bspE(t.tanggal)}</span><span><b>${bspRp(t.nominal)}</b><small>${_bspE([t.keterangan, t.pihak, t.nomor_bukti].filter(Boolean).join(" · "))}${t.ruang_id ? " · " + _bspE(_bspNamaRuang(t.ruang_id)) : ""}</small></span></button>`).join("") || `<div class="bsp-kosong">Tidak ada pengeluaran Kas di bulan ini.</div>`;
  } catch (e) { qs("bsp-kas").innerHTML = `<div class="bsp-kosong">Gagal memuat Kas: ${_bspE(e.message)}</div>`; }
}
function _bspPakaiKas(k, i) { const t = BSP.kasPilih[i]; if (!t) return; closeModal(); bspSimpanReal(k, { n: Number(t.nominal) || 0, tgl: t.tanggal, ket: [t.nomor_bukti, t.keterangan || t.pihak].filter(Boolean).join(" · "), kas_id: t.id }); }
function bspUnduhReal() {
  const baris = [];
  _bspBarisGab().forEach((b) => Object.keys(b.bulan || {}).map(Number).sort((x, y) => x - y).forEach((m) => { const r = BSP_REAL.d[_bspKunciBaris(b, m)] || {}; baris.push({ Bulan: BSP_BULAN[m - 1], Ruang: _bspNamaRuang(b.ruang), "Kode Kegiatan": b.kode, Kegiatan: b.kegiatan, Uraian: b.uraian, Rencana: bspTotalBulan(b, m), Realisasi: Number(r.n) || 0, Tanggal: r.tgl || "", Keterangan: r.ket || "", Selisih: bspTotalBulan(b, m) - (Number(r.n) || 0) }); }));
  baris.sort((a, b) => BSP_BULAN.indexOf(a.Bulan) - BSP_BULAN.indexOf(b.Bulan));
  const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(baris.length ? baris : [{ Keterangan: "(kosong)" }]), "Realisasi " + BSP.th);
  XLSX.writeFile(wb, `Realisasi BOP Kesetaraan ${BSP.th} - PKBM Al-Umm.xlsx`);
}

// ── Pemasangan menu Pengelola: Realisasi & Data SSH ──
(function () {
  if (typeof RG_IKON !== "undefined") RG_IKON["pg-ssh"] = '<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z"/><circle cx="7.5" cy="7.5" r="1.5"/>';
  if (typeof RG_MENU_PENGELOLA !== "undefined") { const k = RG_MENU_PENGELOLA.find((g) => g.group === "Keuangan"); if (k && !k.items.some((x) => x[0] === "pg-ssh")) k.items.splice(2, 0, ["pg-ssh", "", "Data SSH (Batas Harga)"]); }
  if (typeof PG_MODUL_SIAP !== "undefined") ["pg-real", "pg-ssh"].forEach((x) => { if (!PG_MODUL_SIAP.includes(x)) PG_MODUL_SIAP.push(x); });
  const asli = rgBukaPengelola;
  rgBukaPengelola = async function (key) {
    if (key === "pg-real") return bspBukaRealisasi();
    if (key === "pg-ssh") return bspBukaSSH();
    return asli.apply(this, arguments);
  };
  // lencana jumlah pengajuan pada menu Rancangan BOSP
  const sb = renderSidebar;
  renderSidebar = function () { const h = sb.apply(this, arguments); try { if (BSP.menunggu && STATE.ruang === "Pg") { const el = [...document.querySelectorAll("#nav-list .nav-item")].find((x) => /Rancangan BOSP/.test(x.textContent)); if (el && !el.querySelector(".nav-badge-count")) el.insertAdjacentHTML("beforeend", `<span class="nav-badge-count">${BSP.menunggu}</span>`); } } catch (e) {} return h; };
})();

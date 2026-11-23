// ============================================================
//  BOSP / ARKAS — Kertas Kerja BOP Kesetaraan Reguler
//  Tampilan & alur meniru ARKAS 4 (Menyusun Kertas Kerja → Tambah Kegiatan → Isi Detail Anggaran →
//  Edit Detail Anggaran / Sisip Uraian → Review → Ajukan Pengesahan).
//  • Satu NPSN = satu Kertas Kerja PKBM. Ruang Paket A, B&C Putra, B&C Putri menyusun USULAN masing-
//    masing (pagu tiap ruang diisi Bendahara). Bendahara di ruang Pengelola menggabungkan, mengisi kode
//    rekening belanja lengkap, memeriksa batas juknis, lalu mengesahkan / mengembalikan.
//  • Penyusun di ruang: Admin, Admin Pendamping, Penyelenggara. Bendahara dipilih di Pengaturan Ruang.
//  Penyimpanan (tabel kuliah_pengaturan):
//    - per ruang  "bosp:kk:<tahun>"  → { baris: {id: baris}, _status: {status, t, oleh} }  (digabung, bukan ditimpa)
//    - bersama    "bosp:th:<tahun>"  (ruang_id "*") → { pagu: {total, A, Pa, Pi}, rek: {"A:id": kode}, keputusan: {A: {...}} }
//    - bersama    "bosp:bendahara"   (ruang_id "*") → { ids: [...] }
// ============================================================
const BSP = { cariBuka: false, th: null, kk: null, umum: null, bend: [], bulan: 1, cari: "", mode: "kerja", review: "tahap", simpan: null, gab: null, f: { ruang: "", bulan: 0 } };
const _bspE = (s) => escapeHtml(s == null ? "" : String(s));
const bspRp = (n) => "Rp " + Math.round(Number(n) || 0).toLocaleString("id-ID");
const _bspAngka = (s) => Number(String(s == null ? "" : s).replace(/[^\d]/g, "")) || 0;
const _bspId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const _bspTahunAwal = () => { const d = new Date(); return d.getMonth() >= 8 ? d.getFullYear() + 1 : d.getFullYear(); };
const _bspKunciKK = (th) => "bosp:kk:" + th;
const _bspKunciUmum = (th) => "bosp:th:" + th;
const _bspNamaRuang = (id) => (typeof rgNamaPendek === "function" ? rgNamaPendek(id) : id);
const BSP_RUANG = ["A", "Pa", "Pi"];

// ── Hak akses ──
// penyusun inti: Admin utama, Admin Pendamping, Penyelenggara ruang ini
const bspPenyusunInti = () => typeof STATE !== "undefined" && STATE.ruang && STATE.ruang !== "Pg" &&
  ((typeof isAdmin === "function" && isAdmin()) || (typeof rgPendamping === "function" && rgPendamping()) || ((typeof RG !== "undefined" && RG.penyelenggara) || []).includes(STATE.guruId));
const bspBolehSusun = () => !!(bspPenyusunInti() || bspAdminJenjang("bsp-kk") || bspBendaharaJenjang());
// Bendahara jenjang (jabatan "Bendahara" di Data Guru ruang ini, anggota ruang, bukan Mode Lihat) —
// ikut menyusun & melaporkan keuangan jenjangnya (Kertas Kerja BOSP & Draft RKAS).
function bspBendaharaJenjang() {
  try {
    if (STATE.modeLihat || !STATE.ruang || STATE.ruang === "Pg") return false;
    if (typeof rgAkses === "function" && rgAkses(STATE.ruang) !== "U") return false;
    return typeof isBendahara === "function" && isBendahara();
  } catch (e) { return false; }
}
// Admin jenjang (jabatan "Admin" / Admin Kedua) yang menjadi anggota ruang ini — boleh menyusun selama
// izinnya tidak dicabut di Pengaturan > Akses Admin Kedua.
function bspAdminJenjang(kunci) {
  try {
    if (STATE.modeLihat || !STATE.ruang || STATE.ruang === "Pg") return false;
    if (!(typeof isAdminKedua === "function" && isAdminKedua())) return false;
    if (typeof rgAkses === "function" && rgAkses(STATE.ruang) !== "U") return false;
    return typeof _menuDiizinkanAdminKedua === "function" ? _menuDiizinkanAdminKedua(kunci) : true;
  } catch (e) { return false; }
}
if (typeof daftarFiturAdminKedua === "function") daftarFiturAdminKedua("bsp-kk", "📒", "Kertas Kerja BOSP");
const bspBendahara = () => (typeof isAdmin === "function" && isAdmin()) || BSP.bend.includes(STATE.guruId);

// ── Penyimpanan data bersama (ruang "*"): RPC kv_gabung_umum bila ada, bila belum ada baca-gabung-simpan ──
async function _bspGabungUmum(kunci, potongan) {
  const r = await supa.rpc("kv_gabung_umum", { p_kunci: kunci, p_isi: potongan });
  if (!r.error) return r.data || {};
  if (!/kv_gabung_umum|PGRST202|schema cache|Could not find the function/i.test(r.error.message || "")) throw r.error;
  const a = await supaSemua.from("kuliah_pengaturan").select("nilai").eq("kunci", kunci).eq("ruang_id", "*").maybeSingle();
  if (a.error) throw new Error("Gagal membaca data terbaru, coba lagi: " + a.error.message);
  const nilai = { ...((a.data && a.data.nilai) || {}) };
  for (const [k, v] of Object.entries(potongan)) {
    if (v === null) delete nilai[k];
    else if (v && typeof v === "object" && !Array.isArray(v) && nilai[k] && typeof nilai[k] === "object") nilai[k] = { ...nilai[k], ...v };
    else nilai[k] = v;
  }
  const s = await supaSemua.from("kuliah_pengaturan").upsert({ ruang_id: "*", kunci, nilai }, { onConflict: "ruang_id,kunci" });
  if (s.error) throw s.error;
  return nilai;
}
async function _bspMuatUmum(th) {
  const [u, b] = await Promise.all([
    supaSemua.from("kuliah_pengaturan").select("nilai").eq("kunci", _bspKunciUmum(th)).eq("ruang_id", "*").maybeSingle(),
    supaSemua.from("kuliah_pengaturan").select("nilai").eq("kunci", "bosp:bendahara").eq("ruang_id", "*").maybeSingle(),
  ]);
  BSP.umum = (u.data && u.data.nilai) || {};
  BSP.bend = (b.data && b.data.nilai && b.data.nilai.ids) || [];
}
async function _bspMuatKK(th) {
  const r = await supa.from("kuliah_pengaturan").select("nilai").eq("kunci", _bspKunciKK(th)).maybeSingle();
  if (r.error) throw r.error;
  BSP.kk = (r.data && r.data.nilai) || { baris: {} };
  BSP.kk.baris = BSP.kk.baris || {};
}
const _bspBaris = (kk) => Object.entries((kk && kk.baris) || {}).filter(([, b]) => b && !b.dihapus).map(([id, b]) => ({ id, ...b })).sort((a, b) => (a.t || 0) - (b.t || 0));
const bspTotalBaris = (b) => Object.values(b.bulan || {}).reduce((a, x) => a + (Number(x.jml) || 0) * (Number(x.harga ?? b.harga) || 0), 0);
const bspTotalBulan = (b, m) => { const x = (b.bulan || {})[m]; return x ? (Number(x.jml) || 0) * (Number(x.harga ?? b.harga) || 0) : 0; };
// Status usulan ruang: diajukan oleh ruang ↔ keputusan Bendahara (yang paling baru berlaku)
function bspStatus(kk, ruang) {
  const s = (kk && kk._status) || {}, k = ((BSP.umum || {}).keputusan || {})[ruang];
  if (k && (k.t || 0) >= (s.t || 0)) return { status: k.status, catatan: k.catatan, oleh: k.oleh, t: k.t };
  return { status: s.status || "draf", oleh: s.oleh, t: s.t };
}
const BSP_LABEL_STATUS = { draf: ["Draf", "#64748b"], diajukan: ["Diajukan ke Bendahara", "#2563eb"], dikembalikan: ["Dikembalikan untuk Revisi", "#d97706"], disahkan: ["Disahkan Bendahara", "#16a34a"] };
const _bspBisaUbah = () => ["draf", "dikembalikan"].includes(bspStatus(BSP.kk, STATE.ruang).status);
const _bspPaguRuang = (r) => Number((((BSP.umum || {}).pagu) || {})[r || STATE.ruang]) || 0;

// ── Honor Pengelola PKBM: diisi Bendahara di ruang Pengelola, biayanya dibebankan ke tiap jenjang ──
//    Dibagi sebanding pagu tiap ruang (pagu = satuan biaya × jumlah murid → adil menurut jumlah murid) atau dibagi rata.
//    Bagian tiap ruang otomatis masuk Kertas Kerja ruang itu sebagai baris terkunci "Honor Pengelola PKBM".
const BSP_KODE_HONOR_PG = [["07.12.03", "Pembayaran Honor tenaga administrasi"], ["07.12.04", "Pembayaran honor Tenaga Penunjang atau pelaksana"], ["07.12.01", "Pembayaran honor Guru/Pendidik/Tutor"]];
const BSP_REK_HONOR_PG = [["Belanja Jasa Tenaga Administrasi", "barang"], ["Belanja Jasa Tenaga Pendidikan (Honorarium Guru/Tutor)", "pegawai"], ["Belanja Jasa Tenaga Kebersihan", "barang"], ["Belanja Jasa Tenaga Keamanan", "barang"]];
const BSP_JABATAN_PG = ["Kepala PKBM", "Sekretaris PKBM", "Bendahara BOSP", "Operator Dapodik", "Tata Usaha", "Admin ARKAS", "Penanggung Jawab Program", "Tenaga Kebersihan", "Tenaga Keamanan"];
const _bspPengelola = () => Object.entries((BSP.umum || {}).pengelola || {}).filter(([, p]) => p && !p.dihapus).map(([id, p]) => ({ id, ...p })).sort((a, b) => (a.t || 0) - (b.t || 0));
const bspPengelolaBulan = (m) => _bspPengelola().reduce((a, p) => a + ((p.bulan || []).includes(m) ? Number(p.honor) || 0 : 0), 0);
const bspTotalPengelola = () => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].reduce((a, m) => a + bspPengelolaBulan(m), 0);
function _bspRasio() {
  const pagu = (BSP.umum || {}).pagu || {}, s = BSP_RUANG.reduce((a, r) => a + (Number(pagu[r]) || 0), 0);
  const rata = (BSP.umum || {}).bagi_pengelola === "rata" || !s;
  return Object.fromEntries(BSP_RUANG.map((r) => [r, rata ? 1 / BSP_RUANG.length : (Number(pagu[r]) || 0) / s]));
}
// bagian tiap ruang pada bulan m — dibulatkan, jumlahnya tetap pas dengan total bulan itu
function bspBagiPengelola(m) { const t = bspPengelolaBulan(m), q = _bspRasio(), A = Math.round(t * q.A), Pa = Math.round(t * q.Pa); return { A, Pa, Pi: t - A - Pa }; }
const bspBagianTahun = (r) => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].reduce((a, m) => a + bspBagiPengelola(m)[r], 0);
function _bspBarisPengelolaRuang(r) {
  const bulan = {};
  for (let m = 1; m <= 12; m++) { const v = bspBagiPengelola(m)[r]; if (v) bulan[m] = { jml: v, sat: "Rupiah" }; }
  if (!Object.keys(bulan).length) return [];
  return [{ id: "pg-honor", otomatis: true, kode: "07.12.03", kegiatan: "Honor Pengelola PKBM (bagian ruang)", rek: "Honor Pengelola — rincian di ruang Pengelola", jenis: "pegawai", uraian: `Honor Pengelola PKBM, bagian ${_bspNamaRuang(r)} (${(BSP.umum || {}).bagi_pengelola === "rata" ? "dibagi rata" : "sebanding pagu"}) — otomatis dari Bendahara`, harga: 1, bulan, t: 0 }];
}
const _bspBarisRuang = (kk, r) => _bspPengelola().length ? _bspBarisPengelolaRuang(r).concat(_bspBaris(kk)) : _bspBaris(kk);

// ── Kelompok angka juknis ──
function bspHitung(baris, pagu) {
  const tot = baris.reduce((a, b) => a + bspTotalBaris(b), 0);
  const kel = (kode) => baris.filter((b) => kode.includes(b.kode)).reduce((a, b) => a + bspTotalBaris(b), 0);
  const jenis = { pegawai: 0, barang: 0, modal: 0 };
  baris.forEach((b) => { jenis[b.jenis || "barang"] = (jenis[b.jenis || "barang"] || 0) + bspTotalBaris(b); });
  const tahap1 = baris.reduce((a, b) => a + [1, 2, 3, 4, 5, 6].reduce((s, m) => s + bspTotalBulan(b, m), 0), 0);
  const pct = (x) => (pagu ? (x / pagu) * 100 : 0);
  return { tot, honor: kel(BSP_ATURAN.honor.kode), buku: kel(BSP_ATURAN.buku.kode), sarpras: kel(BSP_ATURAN.sarpras.kode), jenis, tahap1, tahap2: tot - tahap1, pct };
}

// ============================================================
//  HALAMAN KERTAS KERJA (ruang A / Pa / Pi)
// ============================================================
async function bspBukaKK(th) {
  if (!bspBolehSusun()) { toast("Kertas Kerja BOSP disusun oleh Admin, Admin Pendamping, Bendahara jenjang, dan Penyelenggara ruang ini.", "warn"); return; }
  BSP.th = th || BSP.th || _bspTahunAwal(); BSP.mode = "kerja";
  const sec = _rgBukaHal("bsp-kk", "Kertas Kerja BOSP", `<div class="card"><div class="rg-memuat">Memuat Kertas Kerja…</div></div>`);
  try { await Promise.all([_bspMuatKK(BSP.th), _bspMuatUmum(BSP.th)]); }
  catch (e) { sec.innerHTML = `<div class="card">Gagal memuat: ${_bspE(e.message)}</div>`; return; }
  _bspGambar();
  setTimeout(() => { if (STATE.currentPage === "bsp-kk" && typeof turMulai === "function") turMulai("bsp-kk"); }, 700);
}
function _bspGambar() {
  const sec = qs("page-rg"); if (!sec || STATE.currentPage !== "bsp-kk") return;
  if (BSP.mode === "review") { sec.innerHTML = _bspHtmlReview(_bspBarisRuang(BSP.kk, STATE.ruang), _bspPaguRuang(), `Usulan ${_bspNamaRuang(STATE.ruang)}`); return; }
  const baris = _bspBarisRuang(BSP.kk, STATE.ruang), pagu = _bspPaguRuang(), sudah = baris.reduce((a, b) => a + bspTotalBaris(b), 0), st = bspStatus(BSP.kk, STATE.ruang), ubah = _bspBisaUbah();
  const lbl = BSP_LABEL_STATUS[st.status] || BSP_LABEL_STATUS.draf;
  const cari = BSP.cari.trim().toLowerCase();
  const tampil = baris.filter((b) => (b.bulan || {})[BSP.bulan]).filter((b) => !cari || [b.kode, b.kegiatan, b.rek, b.uraian].join(" ").toLowerCase().includes(cari));
  const th = BSP.th;
  sec.innerHTML = `<div class="bsp">
    <div class="bsp-atas">
      <div><button class="bsp-kembali" onclick="showPage('dashboard','page-dashboard','dashboard')">← Kembali ke Beranda</button>
        <h2 class="bsp-judul">Menyusun Kertas Kerja</h2>
        <div class="bsp-sub">BOP KESETARAAN REGULER ${th} · USULAN ${_bspE(_bspNamaRuang(STATE.ruang).toUpperCase())}
          <select class="bsp-th" onchange="bspBukaKK(+this.value)">${[th - 1, th, th + 1].map((y) => `<option ${y === th ? "selected" : ""}>${y}</option>`).join("")}</select></div></div>
      <div class="bsp-kanan">
        <div class="bsp-panduan">❔ Butuh panduan mengisi? <a href="#" onclick="bspPanduan();return false">Baca Panduan Selengkapnya</a></div>
        <div class="bsp-tombol" data-tur="bsp-tombol">
          <button class="btn btn-outline" data-tur="bsp-tambah" ${ubah ? "" : "disabled"} onclick="bspTambah()">+ Tambah Kegiatan</button>
          <button class="btn btn-outline" data-tur="bsp-rutin" ${ubah ? "" : "disabled"} onclick="bspRutin()">⚡ Kegiatan Rutin</button>
          ${ubah && !_bspBaris(BSP.kk).length ? `<button class="btn btn-outline" onclick="bspSalinTahunLalu()">⧉ Salin dari ${th - 1}</button>` : ""}
          <button class="btn btn-outline" onclick="bspBukaKK(BSP.th)">↻ Perbarui Data Referensi</button>
          <button class="btn btn-outline" onclick="bspCari()">🔍 Cari</button>
          <button class="btn bsp-hitam" data-tur="bsp-review" onclick="BSP.mode='review';_bspGambar()">Review</button>
          <button class="btn btn-accent" data-tur="bsp-ajukan" ${ubah ? "" : "disabled"} onclick="bspAjukan()">Ajukan Pengesahan</button>
        </div>
        <small class="bsp-catatan">"Perbarui Data Referensi" dan "Ajukan Pengesahan" membutuhkan koneksi internet · <a href="#" onclick="bspBukaRek(1);return false">Data Rekening</a> · <a href="#" onclick="bspBukaJuknis(1);return false">Juknis</a></small>
      </div>
    </div>
    ${st.status !== "draf" ? `<div class="bsp-status" style="--st:${lbl[1]}"><b>${lbl[0]}</b><span>${st.oleh ? "oleh " + _bspE(st.oleh) + " · " : ""}${st.t ? new Date(st.t).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" }) : ""}</span>${st.catatan ? `<em>Catatan Bendahara: ${_bspE(st.catatan)}</em>` : ""}${!ubah ? "<small>Kertas Kerja terkunci — tidak bisa ditambah, diedit, atau disisip uraian.</small>" : ""}</div>` : ""}
    <div class="bsp-pagu" data-tur="bsp-pagu"><span>Pagu Usulan BOP Kesetaraan Reguler</span><b>${pagu ? bspRp(pagu) : "Belum diisi Bendahara"}</b>${_bspPengelola().length ? `<small>Sudah termasuk Honor Pengelola PKBM bagian ruang ini <b>${bspRp(bspBagianTahun(STATE.ruang))}</b> (otomatis)</small>` : ""}</div>
    <div class="bsp-periode">
      <h3>Periode Anggaran ${th}</h3>
      <div class="bsp-ringkas" data-tur="bsp-ringkas">
        <div class="bsp-kotak"><span>Sudah Dianggarkan</span><b>${bspRp(sudah)}</b></div>
        <div class="bsp-kotak ${pagu && pagu - sudah < 0 ? "lebih" : ""}"><span>Belum Dianggarkan</span><b>${bspRp(Math.max(0, pagu - sudah))}${pagu && pagu - sudah < 0 ? ` <em>(lebih ${bspRp(sudah - pagu)})</em>` : ""}</b></div>
      </div>
      <small class="bsp-simpan">✓ Tersimpan otomatis${BSP.simpan ? " pukul " + BSP.simpan : ""}</small>
    </div>
    ${BSP.cariBuka ? `<div class="bsp-cari"><input id="bsp-cari" class="input" placeholder="Cari kegiatan, rekening, atau uraian…" value="${_bspE(BSP.cari)}" oninput="BSP.cari=this.value;_bspGambar();setTimeout(()=>{const i=qs('bsp-cari');if(i){i.focus();i.setSelectionRange(i.value.length,i.value.length)}},0)"><button class="btn btn-ghost btn-sm" onclick="BSP.cari='';BSP.cariBuka=false;_bspGambar()">Tutup</button></div>` : ""}
    <div class="bsp-bulan" data-tur="bsp-bulan">${BSP_BULAN.map((n, i) => { const m = i + 1, ada = baris.some((b) => (b.bulan || {})[m]); return `<button class="${m === BSP.bulan ? "aktif" : ""} ${ada ? "ada" : ""}" onclick="BSP.bulan=${m};_bspGambar()">${n}</button>`; }).join("")}</div>
    <div class="table-wrap bsp-tabel-wrap" data-tur="bsp-tabel"><table class="bsp-tabel"><thead><tr><th>No</th><th>Program Kegiatan</th><th>Kegiatan</th><th>Rekening Belanja</th><th>Uraian</th><th>Jumlah</th><th>Satuan</th><th>Harga Satuan</th><th>Total</th><th>Aksi</th></tr></thead><tbody>
      ${tampil.map((b, i) => { const p = bspProgram(b.kode), x = b.bulan[BSP.bulan]; return `<tr class="${b.sisip ? "sisip" : ""} ${b.otomatis ? "otomatis" : ""}">
        <td>${i + 1}</td><td class="bsp-prog" style="--pw:${p[1]}" title="${_bspE(p[0])}">${_bspE(p[0])}</td>
        <td title="${_bspE(b.kode + " " + b.kegiatan)}"><small>${_bspE(b.kode)}</small> ${_bspE(b.kegiatan)}</td>
        <td title="${_bspE(b.rek)}"><i class="bsp-jenis" style="--jw:${(BSP_JENIS[b.jenis] || BSP_JENIS.barang)[1]}"></i>${_bspE(b.rek)}</td>
        <td class="bsp-uraian" title="${_bspE(b.uraian)}">${_bspE(b.uraian)}</td><td>${b.otomatis ? "—" : _bspE(x.jml)}</td><td>${b.otomatis ? "—" : _bspE(x.sat || "")}</td>
        <td>${b.otomatis ? "—" : bspRp(x.harga ?? b.harga)}</td><td><b>${bspRp(bspTotalBulan(b, BSP.bulan))}</b></td>
        <td>${b.otomatis ? '<small class="bsp-oto" title="Diisi Bendahara di ruang Pengelola">Otomatis</small>' : `<button class="bsp-titik" ${ubah ? "" : "disabled"} onclick="bspMenuAksi(event,'${b.id}')">···</button>`}</td></tr>`; }).join("") || `<tr><td colspan="10" class="bsp-kosong">${baris.length ? `Tidak ada kegiatan di bulan ${BSP_BULAN[BSP.bulan - 1]}${cari ? " yang cocok" : ""}.` : `Belum ada kegiatan. Klik <b>+ Tambah Kegiatan</b> untuk mulai menyusun.`}</td></tr>`}
    </tbody></table></div>
  </div>`;
}
function bspCari() { BSP.cariBuka = !BSP.cariBuka; BSP.cari = ""; _bspGambar(); setTimeout(() => qs("bsp-cari")?.focus(), 0); }
function bspMenuAksi(ev, id) {
  ev.stopPropagation();
  document.querySelector(".bsp-menu")?.remove();
  const m = document.createElement("div"); m.className = "bsp-menu";
  m.innerHTML = `<button onclick="bspIsiDetail('${id}')">Edit Detail Anggaran</button><button onclick="bspSisip('${id}')">Sisip Uraian</button><button class="bahaya" onclick="bspHapus('${id}')">Hapus Kegiatan</button>`;
  document.body.appendChild(m);
  const r = ev.target.getBoundingClientRect();
  m.style.top = (window.scrollY + r.bottom + 4) + "px"; m.style.left = Math.max(8, window.scrollX + r.right - 200) + "px";
  setTimeout(() => document.addEventListener("click", () => m.remove(), { once: true }), 0);
}

// ── Tambah Kegiatan: 1) cari kegiatan → 2) pilih rekening belanja → 3) isi detail anggaran ──
function bspTambah() {
  if (!_bspBisaUbah()) return;
  openModal(`<div class="bsp-modal"><h3>Tambah Kegiatan</h3>
    <div class="bsp-langkah"><span class="aktif">1. Kegiatan</span><span>2. Rekening Belanja</span><span>3. Detail Anggaran</span></div>
    <input id="bsp-q" class="input" placeholder="Cari kegiatan dengan kata kunci atau kode, mis. 'buku' atau '05.02'" oninput="_bspDaftarKeg(this.value)">
    <div id="bsp-keg" class="bsp-pilihan"></div></div>`, { lebar: true });
  _bspDaftarKeg(""); setTimeout(() => qs("bsp-q")?.focus(), 50);
}
function _bspTandaKode(kode) {
  const t = [];
  if (BSP_ATURAN.honor.kode.includes(kode)) t.push('<em class="t-honor">Honor ≤40%</em>');
  if (BSP_ATURAN.buku.kode.includes(kode)) t.push('<em class="t-buku">Buku ≥10%</em>');
  if (BSP_ATURAN.sarpras.kode.includes(kode)) t.push('<em class="t-sarpras">Sarpras ≤20%</em>');
  if (BSP_KODE_ASET.includes(kode)) t.push('<em class="t-aset">Aset · Belanja Modal</em>');
  return t.join("");
}
function _bspDaftarKeg(q) {
  const s = String(q || "").toLowerCase().trim();
  const daftar = BSP_KEG.filter((k) => !s || (k.kode + " " + k.uraian + " " + k.komponen).toLowerCase().includes(s));
  qs("bsp-keg").innerHTML = daftar.map((k) => { const p = bspProgram(k.kode); return `<button class="bsp-opsi" onclick="_bspPilihKeg('${k.kode}')"><span class="bsp-kode" style="--pw:${p[1]}">${k.kode}</span><span><b>${_bspE(k.uraian)}</b><small>${_bspE(k.komponen)} · ${_bspE(p[0])}</small>${_bspTandaKode(k.kode)}</span></button>`; }).join("") || `<div class="bsp-kosong">Kegiatan tidak ditemukan.</div>`;
}
function _bspPilihKeg(kode) {
  const k = BSP_KEG.find((x) => x.kode === kode); if (!k) return;
  BSP.draf = { kode, kegiatan: k.uraian };
  const aset = BSP_KODE_ASET.includes(kode), honor = BSP_ATURAN.honor.kode.includes(kode);
  const urut = [...BSP_REK].sort((a, b) => (aset ? (b.jenis === "modal") - (a.jenis === "modal") : honor ? (b.jenis === "pegawai") - (a.jenis === "pegawai") : 0));
  openModal(`<div class="bsp-modal"><h3>Tambah Kegiatan</h3>
    <div class="bsp-langkah"><span class="selesai">1. Kegiatan</span><span class="aktif">2. Rekening Belanja</span><span>3. Detail Anggaran</span></div>
    <div class="bsp-terpilih"><small>Kegiatan</small><b>${_bspE(kode)} — ${_bspE(k.uraian)}</b></div>
    ${aset ? `<div class="bsp-awas">⚠️ Kegiatan ini menghasilkan <b>aset</b> (mis. laptop, printer, proyektor, mebel). Pilih <b>Belanja Modal</b> dan catat barangnya di buku inventaris — jangan dimasukkan ke Belanja Barang/Jasa.</div>` : ""}
    ${honor ? `<div class="bsp-info">Honor memakai rekening <b>Belanja Jasa Tenaga Pendidikan</b> (5.1.02.02.01.0013). Total honor paling banyak 40% dari pagu.</div>` : ""}
    <input id="bsp-qr" class="input" placeholder="Cari rekening belanja…" oninput="_bspDaftarRek(this.value)">
    <div id="bsp-rek" class="bsp-pilihan" data-urut='${JSON.stringify(urut.map((r) => BSP_REK.indexOf(r)))}'></div>
    <div class="bsp-aksi-bawah"><button class="btn btn-ghost" onclick="bspTambah()">‹ Ganti Kegiatan</button></div></div>`, { lebar: true });
  _bspDaftarRek("");
}
function _bspDaftarRek(q) {
  const el = qs("bsp-rek"); if (!el) return;
  const urut = JSON.parse(el.dataset.urut || "[]"), s = String(q || "").toLowerCase().trim();
  el.innerHTML = urut.map((i) => BSP_REK[i]).filter((r) => !s || r.nama.toLowerCase().includes(s)).map((r) => { const j = BSP_JENIS[r.jenis]; return `<button class="bsp-opsi" onclick="_bspPilihRek(${BSP_REK.indexOf(r)})"><span class="bsp-jenis-chip" style="--jw:${j[1]}">${j[0]}</span><span><b>${_bspE(r.nama)}</b>${r.kode ? `<small>${r.kode}</small>` : ""}</span></button>`; }).join("")
    + `<button class="bsp-opsi" onclick="_bspRekLain()"><span class="bsp-jenis-chip" style="--jw:#94a3b8">Lainnya</span><span><b>Rekening lain (ketik sendiri)</b><small>Kode lengkapnya diisi Bendahara</small></span></button>`;
}
function _bspRekLain() {
  const nama = prompt("Nama rekening belanja (sesuai ARKAS):"); if (!nama) return;
  const jenis = /modal/i.test(nama) ? "modal" : /tenaga pendidik|honor/i.test(nama) ? "pegawai" : "barang";
  BSP.draf.rek = nama.trim(); BSP.draf.jenis = jenis; bspIsiDetail(null);
}
function _bspPilihRek(i) { const r = BSP_REK[i]; BSP.draf.rek = r.nama; BSP.draf.jenis = r.jenis; bspIsiDetail(null); }

// Isi Detail Anggaran Kegiatan (dipakai juga untuk Edit Detail Anggaran & Sisip Uraian)
function bspIsiDetail(id, sisip) {
  document.querySelector(".bsp-menu")?.remove();
  const asal = id ? BSP.kk.baris[id] : null;
  const dr = BSP.draf || {};
  const d = asal ? { ...asal, bulan: sisip ? {} : { ...asal.bulan }, uraian: sisip ? "" : asal.uraian, harga: sisip ? "" : asal.harga } : { ...dr, bulan: {}, uraian: dr.uraian || "", harga: dr.harga || "" };
  BSP.edit = { id: sisip ? null : id, sisip: !!sisip, dasar: d };
  const kartu = Object.keys(d.bulan).length ? Object.entries(d.bulan).map(([m, x]) => ({ m: +m, jml: x.jml, sat: x.sat, harga: x.harga || "" })) : [{ m: BSP.bulan || 1, jml: "", sat: dr.satuan || "", harga: "" }];
  BSP.edit.kartu = kartu;
  BSP.edit.beda = kartu.some((k) => k.harga);
  openModal(`<div class="bsp-modal bsp-detail"><div class="bsp-detail-h"><h3>${sisip ? "Sisip Uraian" : id ? "Edit Detail Anggaran" : "Isi Detail Anggaran Kegiatan"}</h3>${id && !sisip ? `<button class="bsp-hapus-semua" onclick="bspHapus('${id}')">🗑 Hapus Semua</button>` : ""}</div>
    ${!id ? `<div class="bsp-langkah"><span class="selesai">1. Kegiatan</span><span class="selesai">2. Rekening Belanja</span><span class="aktif">3. Detail Anggaran</span></div>` : ""}
    <label class="bsp-f"><span>Kegiatan</span><input class="input" disabled value="${_bspE(d.kode + " — " + d.kegiatan)}"></label>
    <label class="bsp-f"><span>Rekening Belanja</span><input class="input" disabled value="${_bspE(d.rek)}"></label>
    <div class="bsp-kotak-isi">
      <div class="bsp-baris2">
        <label class="bsp-f"><span>Uraian</span><textarea id="bsp-uraian" class="input" rows="2" maxlength="500" placeholder="Apa jenis barang atau jasanya? Mis. makan siang peserta pelatihan, kertas HVS A4 70 gram">${_bspE(d.uraian)}</textarea><small id="bsp-uraian-n">${String(d.uraian || "").length}/500</small></label>
        <label class="bsp-f"><span>Harga Satuan yang Dianggarkan</span><input id="bsp-harga" class="input" inputmode="numeric" placeholder="Berapa perkiraan harganya?" value="${d.harga ? Number(d.harga).toLocaleString("id-ID") : ""}"><small id="bsp-ssh">Harus dalam batas harga yang ditentukan Dinas (SSH).</small></label>
      </div>
      <div class="bsp-dianggarkan"><span>Dianggarkan untuk Bulan</span><label class="bsp-beda"><input type="checkbox" id="bsp-beda" ${BSP.edit.beda ? "checked" : ""} onchange="BSP.edit.beda=this.checked;_bspKartu()"> Nominal berbeda tiap bulan</label><b id="bsp-total">Total Anggaran : Rp 0</b></div>
      <div id="bsp-kartu" class="bsp-kartu-wrap"></div>
    </div>
    <div class="bsp-aksi-bawah"><button class="btn btn-outline" onclick="closeModal()">Batal</button><button class="btn bsp-hitam" onclick="bspMasukkan()">${id && !sisip ? "Perbarui" : "+ Masukkan ke Anggaran"}</button></div></div>`, { lebar: true });
  qs("bsp-harga").oninput = (e) => { const n = _bspAngka(e.target.value); e.target.value = n ? n.toLocaleString("id-ID") : ""; _bspKartu(); };
  qs("bsp-uraian").oninput = (e) => { qs("bsp-uraian-n").textContent = e.target.value.length + "/500"; clearTimeout(BSP._tSsh); BSP._tSsh = setTimeout(() => typeof _bspCekSSH === "function" && _bspCekSSH(), 250); };
  _bspKartu();
}
// harga yang berlaku untuk satu kartu bulan (nominal khusus bulan itu, atau harga satuan umum)
const _bspHargaKartu = (k) => (BSP.edit.beda && _bspAngka(k.harga)) || _bspAngka(qs("bsp-harga")?.value);
function _bspKartu() {
  const el = qs("bsp-kartu"); if (!el) return;
  const K = BSP.edit.kartu, beda = BSP.edit.beda;
  const dipakai = new Set(K.map((k) => k.m));
  el.innerHTML = K.map((k, i) => `<div class="bsp-kartu">
      <div class="bsp-kartu-h"><select onchange="BSP.edit.kartu[${i}].m=+this.value;_bspKartu()">${BSP_BULAN.map((n, j) => `<option value="${j + 1}" ${j + 1 === k.m ? "selected" : ""} ${dipakai.has(j + 1) && j + 1 !== k.m ? "disabled" : ""}>${n}</option>`).join("")}</select>
        <span id="bsp-sub-${i}">${bspRp((Number(String(k.jml).replace(",", ".")) || 0) * _bspHargaKartu(k))}</span>${K.length > 1 ? `<button class="bsp-kurang" title="Batalkan bulan ini" onclick="BSP.edit.kartu.splice(${i},1);_bspKartu()">−</button>` : ""}</div>
      <div class="bsp-kartu-isi"><input class="input" inputmode="numeric" placeholder="Jumlah" value="${_bspE(k.jml)}" oninput="BSP.edit.kartu[${i}].jml=this.value.replace(/[^\\d.,]/g,'');_bspTotal()">
        <input class="input" list="bsp-satuan" placeholder="🔍 Satuan" value="${_bspE(k.sat)}" oninput="BSP.edit.kartu[${i}].sat=this.value"></div>
      ${beda ? `<input class="input bsp-harga-bulan" inputmode="numeric" placeholder="Harga bulan ini (Rp)" value="${k.harga ? formatRibuan(k.harga) : ""}" oninput="this.value=formatRibuan(this.value);BSP.edit.kartu[${i}].harga=this.value;_bspTotal()">` : ""}</div>`).join("")
    + (K.length < 12 ? `<button class="bsp-tambah-bulan" onclick="_bspTambahBulan()">+ Tambah Bulan</button>` : "")
    + (K.length < 12 ? `<button class="bsp-tambah-bulan" onclick="_bspSemuaBulan()">+ Isi 12 Bulan Sekaligus</button>` : "")
    + `<datalist id="bsp-satuan">${BSP_SATUAN.map((s) => `<option value="${s}">`).join("")}</datalist>`;
  _bspTotal();
}
function _bspTambahBulan() { const ada = new Set(BSP.edit.kartu.map((k) => k.m)); const m = [...Array(12).keys()].map((x) => x + 1).find((x) => !ada.has(x)); if (m) { const k0 = BSP.edit.kartu[0] || {}; BSP.edit.kartu.push({ m, jml: k0.jml || "", sat: k0.sat || "", harga: "" }); _bspKartu(); } }
function _bspSemuaBulan() { const k0 = BSP.edit.kartu[0] || {}, ada = new Set(BSP.edit.kartu.map((k) => k.m)); for (let m = 1; m <= 12; m++) if (!ada.has(m)) BSP.edit.kartu.push({ m, jml: k0.jml || "", sat: k0.sat || "", harga: "" }); BSP.edit.kartu.sort((a, b) => a.m - b.m); _bspKartu(); }
function _bspTotal() {
  const t = BSP.edit.kartu.reduce((a, k, i) => { const s = (Number(String(k.jml).replace(",", ".")) || 0) * _bspHargaKartu(k); const el = qs("bsp-sub-" + i); if (el) el.textContent = bspRp(s); return a + s; }, 0);
  const el = qs("bsp-total"); if (el) el.textContent = "Total Anggaran : " + bspRp(t);
  if (typeof _bspCekSSH === "function") _bspCekSSH();
}
async function bspMasukkan() {
  const E = BSP.edit, uraian = qs("bsp-uraian").value.trim(), harga = _bspAngka(qs("bsp-harga").value);
  if (!uraian) { toast("Tulis uraian barang/jasa yang dianggarkan", "err"); qs("bsp-uraian").focus(); return; }
  if (!harga && !E.beda) { toast("Isi harga satuan", "err"); qs("bsp-harga").focus(); return; }
  const bulan = {};
  for (const k of E.kartu) {
    const j = Number(String(k.jml).replace(",", ".")) || 0, nm = BSP_BULAN[k.m - 1];
    if (!j) { toast(`Isi jumlah untuk bulan ${nm}`, "err"); return; }
    if (!String(k.sat || "").trim()) { toast(`Pilih satuan untuk bulan ${nm}`, "err"); return; }
    const hk = _bspHargaKartu(k);
    if (!hk) { toast(`Isi harga untuk bulan ${nm}`, "err"); return; }
    bulan[k.m] = { jml: j, sat: k.sat.trim(), ...(E.beda && _bspAngka(k.harga) && _bspAngka(k.harga) !== harga ? { harga: _bspAngka(k.harga) } : {}) };
  }
  const hargaUtama = harga || _bspHargaKartu(E.kartu[0]);
  // batas harga SSH (seperti ARKAS: harga harus di antara batas bawah & batas atas)
  if (typeof _bspValidasiSSH === "function") { const pesan = _bspValidasiSSH(uraian, [hargaUtama, ...Object.values(bulan).map((x) => x.harga).filter(Boolean)]); if (pesan) { toast(pesan, "err"); return; } }
  const baru = { kode: E.dasar.kode, kegiatan: E.dasar.kegiatan, rek: E.dasar.rek, jenis: E.dasar.jenis || "barang", uraian, harga: hargaUtama, bulan, oleh: STATE.guruNama || "", t: E.id ? (BSP.kk.baris[E.id].t || Date.now()) : Date.now(), ...(E.sisip ? { sisip: true } : E.id && BSP.kk.baris[E.id].sisip ? { sisip: true } : {}) };
  // tidak boleh melebihi pagu (seperti ARKAS: Belum Dianggarkan tidak boleh minus)
  const pagu = _bspPaguRuang(), lain = _bspBarisRuang(BSP.kk, STATE.ruang).filter((b) => b.id !== E.id).reduce((a, b) => a + bspTotalBaris(b), 0);
  if (pagu && lain + bspTotalBaris(baru) > pagu) { toast(`Melebihi pagu. Sisa yang belum dianggarkan ${bspRp(Math.max(0, pagu - lain))}.`, "err"); return; }
  if (BSP_KODE_ASET.includes(baru.kode) && baru.jenis !== "modal" && !(await konfirmasiTema("Kegiatan ini menghasilkan aset, tetapi rekeningnya bukan Belanja Modal. Aset (laptop, printer, proyektor, mebel, seragam inventaris) seharusnya Belanja Modal dan dicatat di buku inventaris. Tetap simpan?", { judul: "Periksa Jenis Belanja", ikon: "⚠️", teksYa: "Tetap Simpan" }))) return;
  const id = E.id || _bspId();
  try {
    const hasil = await _kvGabung(_bspKunciKK(BSP.th), { baris: { [id]: baru } });
    BSP.kk = hasil && hasil.baris ? hasil : { ...BSP.kk, baris: { ...BSP.kk.baris, [id]: baru } };
    BSP.simpan = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    BSP.draf = null;
    closeModal();
    BSP.bulan = Math.min(...Object.keys(bulan).map(Number));
    _bspGambar();
    toast(E.id ? "Anggaran kegiatan berhasil diperbarui!" : E.sisip ? "Sisip uraian berhasil ditambahkan!" : "Data kegiatan berhasil ditambahkan!", "ok");
    if (typeof _rgLog === "function") _rgLog("bosp-ubah", { kode: baru.kode, total: bspTotalBaris(baru) });
  } catch (e) { toast("Gagal menyimpan: " + (e.message || e), "err"); }
}
function bspSisip(id) { bspIsiDetail(id, true); }
async function bspHapus(id) {
  document.querySelector(".bsp-menu")?.remove();
  const b = BSP.kk.baris[id]; if (!b) return;
  if (!(await konfirmasiTema(`Hapus "${b.uraian}" (${bspRp(bspTotalBaris(b))}) dari Kertas Kerja?`, { judul: "Hapus Kegiatan", ikon: "🗑️", teksYa: "Ya, Hapus" }))) return;
  try {
    const hasil = await _kvGabung(_bspKunciKK(BSP.th), { baris: { [id]: { dihapus: true, t: Date.now(), oleh: STATE.guruNama || "" } } });
    BSP.kk = hasil && hasil.baris ? hasil : BSP.kk;
    closeModal(); _bspGambar(); toast("Kegiatan dihapus", "ok");
  } catch (e) { toast("Gagal: " + e.message, "err"); }
}
async function bspAjukan() {
  const baris = _bspBarisRuang(BSP.kk, STATE.ruang), pagu = _bspPaguRuang(), sudah = baris.reduce((a, b) => a + bspTotalBaris(b), 0);
  if (!pagu) { toast("Pagu ruang ini belum diisi Bendahara. Minta Bendahara mengisi pagu di ruang Pengelola.", "warn"); return; }
  if (sudah !== pagu) { toast(`Belum bisa diajukan: Belum Dianggarkan harus Rp 0 (sisa ${bspRp(pagu - sudah)}).`, "warn"); return; }
  const h = bspHitung(baris, pagu);
  const catatan = [h.pct(h.honor) > 40 ? `honor ${h.pct(h.honor).toFixed(1)}% (maks 40%)` : "", h.pct(h.sarpras) > 20 ? `sarpras ${h.pct(h.sarpras).toFixed(1)}% (maks 20%)` : "", h.pct(h.buku) < 10 ? `buku ${h.pct(h.buku).toFixed(1)}% (min 10%)` : ""].filter(Boolean);
  if (!(await konfirmasiTema(`Ajukan Kertas Kerja ${_bspNamaRuang(STATE.ruang)} ${BSP.th} (${bspRp(sudah)}) ke Bendahara? Setelah diajukan, Kertas Kerja terkunci sampai disahkan atau dikembalikan.${catatan.length ? " Perhatian: " + catatan.join(", ") + " — batas dihitung dari pagu PKBM oleh Bendahara." : ""}`, { judul: "Ajukan Pengesahan", ikon: "📤", teksYa: "Ya, Ajukan" }))) return;
  try {
    const hasil = await _kvGabung(_bspKunciKK(BSP.th), { _status: { status: "diajukan", t: Date.now(), oleh: STATE.guruNama || "", oleh_id: STATE.guruId || "" } });
    if (hasil && hasil.baris) BSP.kk = hasil; else BSP.kk._status = { status: "diajukan", t: Date.now(), oleh: STATE.guruNama };
    _bspGambar(); toast("Kertas Kerja diajukan ke Bendahara ✓", "ok");
    if (typeof _bspPushAjukan === "function") _bspPushAjukan(sudah);
    if (typeof _rgLog === "function") _rgLog("bosp-ajukan", { tahun: BSP.th, total: sudah });
  } catch (e) { toast("Gagal: " + e.message, "err"); }
}

// ── Review Kertas Kerja (per tahapan / per tahun / grafik proporsi) ──
function _bspHtmlReview(baris, pagu, judul, gabungan) {
  const h = bspHitung(baris, pagu), mode = BSP.review;
  const kelompok = (rows) => { const g = {}; rows.forEach((b) => { const p = bspProgram(b.kode)[0]; (g[p] = g[p] || []).push(b); }); return g; };
  const tabelProg = (rows, bulanList) => Object.entries(kelompok(rows)).map(([p, rs]) => {
    const w = bspProgram(rs[0].kode)[1], tot = rs.reduce((a, b) => a + bulanList.reduce((s, m) => s + bspTotalBulan(b, m), 0), 0);
    if (!tot) return "";
    return `<details class="bsp-rv-prog" style="--pw:${w}"><summary><b>${_bspE(p)}</b><span>${bspRp(tot)}</span></summary><table class="bsp-tabel kecil"><thead><tr>${gabungan ? "<th>Ruang</th>" : ""}<th>Kegiatan</th><th>Rekening Belanja</th><th>Uraian</th><th>Volume</th><th>Harga Satuan</th><th>Total</th></tr></thead><tbody>
      ${rs.map((b) => { const vol = bulanList.reduce((s, m) => s + ((b.bulan || {})[m] ? Number(b.bulan[m].jml) || 0 : 0), 0); const t = bulanList.reduce((s, m) => s + bspTotalBulan(b, m), 0); return t ? `<tr>${gabungan ? `<td>${_bspE(_bspNamaRuang(b.ruang))}</td>` : ""}<td><small>${_bspE(b.kode)}</small> ${_bspE(b.kegiatan)}</td><td>${_bspE(b.rek)}</td><td>${_bspE(b.uraian)}</td><td>${b.otomatis ? "—" : vol + " " + _bspE(Object.values(b.bulan || {})[0]?.sat || "")}</td><td>${b.otomatis ? "—" : bspRp(b.harga)}</td><td><b>${bspRp(t)}</b></td></tr>` : ""; }).join("")}</tbody></table></details>`;
  }).join("");
  const bar = (label, nilai, batas, jenis, ket) => { const p = h.pct(nilai), lolos = jenis === "maks" ? p <= batas : p >= batas; return `<div class="bsp-rv-bar ${lolos ? "ok" : "gagal"}"><div class="bsp-rv-bar-h"><b>${label}</b><span>${p.toFixed(1)}% · ${bspRp(nilai)}</span></div><div class="bsp-rv-track"><i style="width:${Math.min(100, p)}%"></i><u style="left:${batas}%" title="${jenis === "maks" ? "Batas maksimal" : "Batas minimal"} ${batas}%"></u></div><small>${lolos ? "✓ Sesuai juknis" : "✗ Belum sesuai"} — ${jenis === "maks" ? "paling banyak" : "paling sedikit"} ${batas}% dari pagu. ${ket || ""}</small></div>`; };
  const semua = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  let isi = "";
  if (mode === "tahap") isi = [["Tahap 1", [1, 2, 3, 4, 5, 6], h.tahap1], ["Tahap 2", [7, 8, 9, 10, 11, 12], h.tahap2]].map(([n, bl, t]) => `<div class="bsp-rv-tahap"><div class="bsp-rv-tahap-h"><b>${n}</b><small>${BSP_BULAN[bl[0] - 1]} – ${BSP_BULAN[bl[5] - 1]}</small><span>${bspRp(t)}${pagu ? ` · ${h.pct(t).toFixed(1)}%` : ""}</span></div>${tabelProg(baris, bl) || '<div class="bsp-kosong">Belum ada kegiatan.</div>'}</div>`).join("")
    + `<p class="bsp-ket">Panduan ARKAS: dana tersedia Tahap 1 dianggarkan sekitar 50%. Laporan realisasi Tahap 1 minimal 50% menjadi dasar penyaluran Tahap 2.</p>`;
  else if (mode === "tahun") isi = tabelProg(baris, semua) || '<div class="bsp-kosong">Belum ada kegiatan.</div>';
  else {
    const totJ = h.jenis.pegawai + h.jenis.barang + h.jenis.modal || 1;
    isi = `<div class="bsp-rv-grafik">
      <div class="card"><h4>Proporsi Belanja Honor dari Total Pagu</h4>${bar("Belanja Honor (07.12.xx)", h.honor, 40, "maks")}</div>
      <div class="card"><h4>Komponen Wajib & Batas Juknis</h4>${bar("Buku (05.02.03/04/05/06)", h.buku, 10, "min")}${bar("Pemeliharaan Sarpras", h.sarpras, 20, "maks")}</div>
      <div class="card"><h4>Proporsi Antar Jenis Belanja dari Total Pagu</h4><div class="bsp-rv-tumpuk">${Object.entries(BSP_JENIS).map(([k, [n, w]]) => `<i style="width:${(h.jenis[k] / totJ) * 100}%;background:${w}" title="${n}"></i>`).join("")}</div>
        <div class="bsp-rv-legenda">${Object.entries(BSP_JENIS).map(([k, [n, w]]) => `<span><i style="background:${w}"></i>${n}<b>${bspRp(h.jenis[k])}</b><small>${h.pct(h.jenis[k]).toFixed(1)}%</small></span>`).join("")}</div></div>
    </div>${!gabungan ? `<p class="bsp-ket">Persentase di atas dihitung dari pagu usulan ruang ini. Pemeriksaan resmi juknis memakai total pagu PKBM dan dilakukan Bendahara di ruang Pengelola.</p>` : ""}`;
  }
  return `<div class="bsp">
    <div class="bsp-atas"><div><button class="bsp-kembali" onclick="${gabungan ? "BSP.mode='kerja';bspBukaBendahara()" : "BSP.mode='kerja';_bspGambar()"}">← Kembali ke Halaman Menyusun</button><h2 class="bsp-judul">Review Kertas Kerja</h2><div class="bsp-sub">BOP KESETARAAN REGULER ${BSP.th} · ${_bspE(judul.toUpperCase())}</div></div>
      <div class="bsp-kanan"><div class="bsp-tombol"><button class="btn btn-outline" onclick="window.print()">🖨 Cetak</button></div></div></div>
    <div class="bsp-ringkas"><div class="bsp-kotak"><span>Pagu</span><b>${bspRp(pagu)}</b></div><div class="bsp-kotak"><span>Sudah Dianggarkan</span><b>${bspRp(h.tot)}</b></div><div class="bsp-kotak"><span>Belum Dianggarkan</span><b>${bspRp(Math.max(0, pagu - h.tot))}</b></div></div>
    <div class="bsp-rv-tab">${[["tahap", "Lihat per Tahapan"], ["tahun", "Lihat per Tahun"], ["grafik", "Lihat Grafik Proporsi"]].map(([k, n]) => `<button class="${mode === k ? "aktif" : ""}" onclick="BSP.review='${k}';${gabungan ? "_bspGambarGab()" : "_bspGambar()"}">${n}</button>`).join("")}</div>
    ${isi}</div>`;
}

// ── Panduan (video + langkah) & tur pertama kali ──
function bspPanduan() {
  openModal(`<div class="bsp-modal"><h3>Panduan Menyusun Kertas Kerja</h3>
    <div class="bsp-video"><iframe src="https://www.youtube-nocookie.com/embed/I8_uhG-CFgg" title="Tutorial Kertas Kerja ARKAS" allow="accelerometer; encrypted-media; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>
    <ol class="bsp-langkah-daftar">
      <li>Klik <b>+ Tambah Kegiatan</b>, cari kegiatan dengan kata kunci atau kode (mis. <i>buku</i>, <i>05.02</i>).</li>
      <li>Pilih <b>Rekening Belanja</b>. Barang yang menjadi aset (laptop, printer, proyektor, mebel) memakai <b>Belanja Modal</b>.</li>
      <li>Tulis <b>Uraian</b> (maks. 500 karakter), isi <b>Harga Satuan</b>, pilih <b>Bulan</b>, isi <b>Jumlah</b> dan <b>Satuan</b>. Klik <b>+ Tambah Bulan</b> bila kegiatan yang sama ada di bulan lain.</li>
      <li>Klik <b>+ Masukkan ke Anggaran</b>. Kolom <b>Sudah Dianggarkan</b> bertambah otomatis.</li>
      <li>Ubah lewat tombol <b>···</b> → <b>Edit Detail Anggaran</b>, atau tambah barang lain di kegiatan yang sama lewat <b>Sisip Uraian</b>.</li>
      <li>Klik <b>Review</b> untuk melihat per tahapan, per tahun, dan grafik proporsi (honor ≤40%, buku ≥10%, sarpras ≤20%).</li>
      <li>Bila <b>Belum Dianggarkan = Rp 0</b>, klik <b>Ajukan Pengesahan</b>. Bendahara di ruang Pengelola memeriksa, mengisi kode rekening lengkap, lalu mengesahkan atau mengembalikan.</li>
    </ol>
    <p class="bsp-ket">Kode rekening belanja lengkap & batas harga (SSH) mengikuti ARKAS di perangkat Bendahara. Setelah disahkan, Bendahara tinggal mengetik ulang ke ARKAS dengan urutan yang sama.</p>
    <div class="bsp-aksi-bawah"><button class="btn btn-outline" onclick="closeModal();turMulai('bsp-kk',true)">Ulangi Panduan Layar</button><button class="btn btn-accent" onclick="closeModal()">Mengerti</button></div></div>`, { lebar: true });
}
if (typeof TUR_DAFTAR !== "undefined") TUR_DAFTAR["bsp-kk"] = { id: "bspkk", versi: 1, langkah: [
  { sel: "[data-tur=bsp-pagu]", judul: "1️⃣ Pagu Usulan", teks: "Batas anggaran ruang ini untuk satu tahun, diisi <b>Bendahara</b> di ruang Pengelola. Seluruh pagu harus habis direncanakan sebelum diajukan." },
  { sel: "[data-tur=bsp-tambah]", judul: "2️⃣ Tambah Kegiatan", teks: "Sama seperti ARKAS: cari kegiatan → pilih rekening belanja → isi uraian, harga satuan, bulan, jumlah, dan satuan." },
  { sel: "[data-tur=bsp-ringkas]", judul: "3️⃣ Sudah & Belum Dianggarkan", teks: "Terhitung otomatis. <b>Belum Dianggarkan</b> harus Rp 0 sebelum Ajukan Pengesahan." },
  { sel: "[data-tur=bsp-bulan]", judul: "4️⃣ Menu 12 Bulan", teks: "Klik bulan untuk melihat rencana kegiatan pada bulan itu. Bulan yang sudah berisi diberi titik." },
  { sel: "[data-tur=bsp-tabel]", judul: "5️⃣ Tabel Kertas Kerja", teks: "Kolomnya sama dengan ARKAS. Tombol <b>···</b> di kolom Aksi untuk <b>Edit Detail Anggaran</b> atau <b>Sisip Uraian</b>." },
  { sel: "[data-tur=bsp-review]", judul: "6️⃣ Review", teks: "Lihat per tahapan, per tahun, dan grafik proporsi (honor ≤40%, buku ≥10%, sarpras ≤20%)." },
  { sel: "[data-tur=bsp-ajukan]", judul: "7️⃣ Ajukan Pengesahan", teks: "Dikirim ke Bendahara di ruang Pengelola. Kode rekening lengkap diisi Bendahara, lalu disahkan atau dikembalikan dengan catatan." },
] };

// ============================================================
//  RUANG PENGELOLA — Rancangan BOSP (Bendahara)
// ============================================================
async function bspBukaBendahara(th) {
  BSP.th = th || BSP.th || _bspTahunAwal(); BSP.mode = "kerja";
  const sec = _rgBukaHal("pg-bosp", "Rancangan BOSP (ARKAS)", `<div class="card"><div class="rg-memuat">Memuat Kertas Kerja seluruh ruang…</div></div>`);
  try {
    await _bspMuatUmum(BSP.th);
    const r = await supaSemua.from("kuliah_pengaturan").select("ruang_id,nilai").eq("kunci", _bspKunciKK(BSP.th));
    if (r.error) throw r.error;
    BSP.gab = Object.fromEntries((r.data || []).map((x) => [x.ruang_id, x.nilai || { baris: {} }]));
  } catch (e) { sec.innerHTML = `<div class="card">Gagal memuat: ${_bspE(e.message)}</div>`; return; }
  _bspGambarGab();
}
const _bspBarisPengelolaGab = () => _bspPengelola().map((p) => ({ id: p.id, ruang: "Pg", kode: p.kode, kegiatan: (BSP_KODE_HONOR_PG.find((k) => k[0] === p.kode) || [, ""])[1], rek: p.rek, jenis: p.jenis || "barang",
  uraian: `Honor ${p.jabatan} — ${p.nama}`, harga: Number(p.honor) || 0, bulan: Object.fromEntries((p.bulan || []).map((m) => [m, { jml: 1, sat: "Orang/Bulan" }])), oleh: p.oleh,
  kodeRek: ((BSP.umum.rek || {})["Pg:" + p.id]) || (BSP_REK.find((x) => x.nama === p.rek) || {}).kode || "" }));
function _bspBarisGab() {
  return BSP_RUANG.flatMap((r) => _bspBaris(BSP.gab[r]).map((b) => ({ ...b, ruang: r, kodeRek: ((BSP.umum.rek || {})[r + ":" + b.id]) || (BSP_REK.find((x) => x.nama === b.rek) || {}).kode || "" }))).concat(_bspBarisPengelolaGab());
}
function _bspGambarGab() {
  const sec = qs("page-rg"); if (!sec || STATE.currentPage !== "pg-bosp") return;
  const bend = bspBendahara(), pagu = (BSP.umum.pagu || {}), total = Number(pagu.total) || 0, semua = _bspBarisGab();
  if (BSP.mode === "review") { sec.innerHTML = _bspHtmlReview(semua, total, "Gabungan PKBM", true); return; }
  const f = BSP.f, tampil = semua.filter((b) => (!f.ruang || b.ruang === f.ruang) && (!f.bulan || (b.bulan || {})[f.bulan]));
  const h = bspHitung(semua, total), bagi = BSP_RUANG.reduce((a, r) => a + (Number(pagu[r]) || 0), 0);
  const kartuRuang = BSP_RUANG.map((r) => {
    const rr = typeof rgRuang === "function" ? rgRuang(r) : { warna: "#64748b" }, kk = BSP.gab[r], st = bspStatus(kk, r), lbl = BSP_LABEL_STATUS[st.status], rows = _bspBarisRuang(kk, r), sudah = rows.reduce((a, b) => a + bspTotalBaris(b), 0), pg = Number(pagu[r]) || 0;
    return `<div class="card bsp-ruang" style="--rw:${rr.warna}"><div class="bsp-ruang-h"><b>${_bspE(_bspNamaRuang(r))}</b><em style="--st:${lbl[1]}">${lbl[0]}</em></div>
      <div class="bsp-ruang-angka"><span>Pagu <b>${bspRp(pg)}</b></span><span>Dianggarkan <b>${bspRp(sudah)}</b></span><span>${rows.length} uraian</span></div>
      <div class="bsp-progres"><i style="width:${pg ? Math.min(100, (sudah / pg) * 100) : 0}%"></i></div>
      ${st.catatan ? `<small class="bsp-ruang-cat">Catatan: ${_bspE(st.catatan)}</small>` : ""}
      ${bend ? `<div class="bsp-ruang-aksi">${st.status === "diajukan" ? `<button class="btn btn-sm btn-accent" onclick="bspPutuskan('${r}','disahkan')">Sahkan</button><button class="btn btn-sm btn-outline" onclick="bspPutuskan('${r}','dikembalikan')">Kembalikan</button>` : st.status === "disahkan" ? `<button class="btn btn-sm btn-outline" onclick="bspPutuskan('${r}','dikembalikan')">Buka untuk Revisi</button>` : `<small>Menunggu ruang mengajukan</small>`}</div>` : ""}</div>`;
  }).join("");
  const cek = (nama, nilai, batas, jenis) => { const p = h.pct(nilai), ok = jenis === "maks" ? p <= batas : p >= batas; return `<span class="bsp-cek ${total ? (ok ? "ok" : "gagal") : ""}">${ok ? "✓" : "✗"} ${nama} ${p.toFixed(1)}% <small>(${jenis === "maks" ? "maks" : "min"} ${batas}%)</small></span>`; };
  sec.innerHTML = `<div class="bsp">
    <div class="bsp-atas"><div><h2 class="bsp-judul">Kertas Kerja PKBM (Gabungan)</h2><div class="bsp-sub">BOP KESETARAAN REGULER ${BSP.th} · SATU NPSN
      <select class="bsp-th" onchange="bspBukaBendahara(+this.value)">${[BSP.th - 1, BSP.th, BSP.th + 1].map((y) => `<option ${y === BSP.th ? "selected" : ""}>${y}</option>`).join("")}</select></div></div>
      <div class="bsp-kanan"><div class="bsp-tombol"><button class="btn btn-outline" onclick="bspBukaBendahara(BSP.th)">↻ Perbarui</button><button class="btn bsp-hitam" onclick="BSP.mode='review';_bspGambarGab()">Review</button><button class="btn btn-accent" onclick="bspUnduhGab()">⬇ Unduh Excel (Urutan ARKAS)</button></div>
      <small class="bsp-catatan"><a href="#" onclick="bspBukaRek();return false">Data Rekening</a> · <a href="#" onclick="bspBukaJuknis();return false">Juknis</a>${bend ? "" : " · Hanya Bendahara BOSP yang bisa mengubah"}</small></div></div>
    <div class="card bsp-pagu-atur"><h4>Pagu BOP Kesetaraan Reguler PKBM</h4>
      <div class="bsp-pagu-grid"><label>Total Pagu PKBM<input id="bsp-p-total" class="input" inputmode="numeric" oninput="this.value=formatRibuan(this.value);_bspCekPagu()" ${bend ? "" : "disabled"} value="${total ? total.toLocaleString("id-ID") : ""}" placeholder="Rp"></label>
        ${BSP_RUANG.map((r) => `<label>${_bspE(_bspNamaRuang(r))}<input id="bsp-p-${r}" class="input" inputmode="numeric" oninput="this.value=formatRibuan(this.value);_bspCekPagu()" ${bend ? "" : "disabled"} value="${pagu[r] ? Number(pagu[r]).toLocaleString("id-ID") : ""}" placeholder="Rp"></label>`).join("")}</div>
      <small class="${total && bagi !== total ? "bsp-merah" : ""}"><span id="bsp-p-cek">Jumlah pagu ruang ${bspRp(bagi)}${total ? (bagi === total ? " — sama dengan total ✓" : ` — selisih ${bspRp(total - bagi)} dari total`) : ""}.</span> Total pagu = satuan biaya daerah × jumlah murid usia 7–<25 tahun ber-NISN (Dapodik 31 Agustus tahun sebelumnya).</small>
      ${bend ? `<div><button class="btn btn-accent btn-sm" onclick="bspSimpanPagu()">Simpan Pagu</button></div>` : ""}</div>
    <div class="bsp-ruang-grid">${kartuRuang}${_bspKartuPengelola(bend)}</div>
    <div class="card"><h4 style="margin-top:0">Pemeriksaan Juknis (dari Total Pagu PKBM)</h4><div class="bsp-cek-baris">${cek("Honor", h.honor, 40, "maks")}${cek("Buku", h.buku, 10, "min")}${cek("Sarpras", h.sarpras, 20, "maks")}<span class="bsp-cek">Sudah dianggarkan ${bspRp(h.tot)} dari ${bspRp(total)}</span></div></div>
    <div class="bsp-saring"><select onchange="BSP.f.ruang=this.value;_bspGambarGab()"><option value="">Semua Ruang</option>${[...BSP_RUANG, "Pg"].map((r) => `<option value="${r}" ${f.ruang === r ? "selected" : ""}>${_bspE(_bspNamaRuang(r))}</option>`).join("")}</select>
      <select onchange="BSP.f.bulan=+this.value;_bspGambarGab()"><option value="0">Semua Bulan</option>${BSP_BULAN.map((n, i) => `<option value="${i + 1}" ${f.bulan === i + 1 ? "selected" : ""}>${n}</option>`).join("")}</select><span>${tampil.length} uraian</span></div>
    <div class="table-wrap bsp-tabel-wrap"><table class="bsp-tabel"><thead><tr><th>No</th><th>Ruang</th><th>Program Kegiatan</th><th>Kegiatan</th><th>Rekening Belanja</th><th>Kode Rekening</th><th>Uraian</th><th>Volume</th><th>Harga Satuan</th><th>Total</th></tr></thead><tbody>
      ${tampil.map((b, i) => { const p = bspProgram(b.kode), bl = f.bulan ? [f.bulan] : Object.keys(b.bulan || {}).map(Number), vol = bl.reduce((s, m) => s + ((b.bulan || {})[m] ? Number(b.bulan[m].jml) || 0 : 0), 0), tot = bl.reduce((s, m) => s + bspTotalBulan(b, m), 0);
        return `<tr><td>${i + 1}</td><td>${_bspE(_bspNamaRuang(b.ruang))}</td><td class="bsp-prog" style="--pw:${p[1]}">${_bspE(p[0])}</td><td><small>${_bspE(b.kode)}</small> ${_bspE(b.kegiatan)}</td><td><i class="bsp-jenis" style="--jw:${(BSP_JENIS[b.jenis] || BSP_JENIS.barang)[1]}"></i>${_bspE(b.rek)}</td>
          <td>${bend ? `<input class="bsp-kode-rek" value="${_bspE(b.kodeRek)}" placeholder="5.1.02.…" onchange="bspSimpanKodeRek('${b.ruang}','${b.id}',this.value)">` : _bspE(b.kodeRek || "—")}</td>
          <td class="bsp-uraian" title="${_bspE(b.uraian)}">${_bspE(b.uraian)}<small>${bl.map((m) => BSP_BULAN[m - 1].slice(0, 3)).join(", ")}</small></td><td>${vol} ${_bspE(Object.values(b.bulan || {})[0]?.sat || "")}</td><td>${bspRp(b.harga)}</td><td><b>${bspRp(tot)}</b></td></tr>`; }).join("") || `<tr><td colspan="10" class="bsp-kosong">Belum ada usulan dari ruang.</td></tr>`}
    </tbody></table></div></div>`;
}
function _bspCekPagu() {
  const v = (id) => _bspAngka(qs(id)?.value), total = v("bsp-p-total"), bagi = BSP_RUANG.reduce((a, r) => a + v("bsp-p-" + r), 0), el = qs("bsp-p-cek"); if (!el) return;
  el.parentElement.className = total && bagi !== total ? "bsp-merah" : "";
  el.textContent = `Jumlah pagu ruang ${bspRp(bagi)}${total ? (bagi === total ? " — sama dengan total ✓" : ` — selisih ${bspRp(total - bagi)} dari total`) : ""}. `;
}
function _bspKartuPengelola(bend) {
  const orang = _bspPengelola(), total = bspTotalPengelola(), mode = (BSP.umum || {}).bagi_pengelola === "rata" ? "rata" : "pagu";
  return `<div class="card bsp-ruang bsp-ruang-pg" style="--rw:#b45309"><div class="bsp-ruang-h"><b>Pengelola</b><em style="--st:#b45309">Honor Pengelola</em></div>
    <div class="bsp-ruang-angka"><span>Total setahun <b>${bspRp(total)}</b></span><span>${orang.length} orang</span></div>
    <div class="bsp-pg-bagi">${BSP_RUANG.map((r) => `<span><i style="background:${(typeof rgRuang === "function" ? rgRuang(r) : {}).warna || "#64748b"}"></i>${_bspE(_bspNamaRuang(r))}<b>${bspRp(bspBagianTahun(r))}</b></span>`).join("")}</div>
    ${bend ? `<div class="bsp-ruang-aksi"><select onchange="bspUbahBagi(this.value)"><option value="pagu" ${mode === "pagu" ? "selected" : ""}>Dibagi sebanding pagu</option><option value="rata" ${mode === "rata" ? "selected" : ""}>Dibagi rata 3 jenjang</option></select>
      <button class="btn btn-sm btn-accent" onclick="bspKelolaPengelola()">Kelola Honor Pengelola</button></div>` : `<small>${mode === "rata" ? "Dibagi rata 3 jenjang" : "Dibagi sebanding pagu tiap jenjang"}</small>`}</div>`;
}
async function bspUbahBagi(mode) {
  try { BSP.umum = await _bspGabungUmum(_bspKunciUmum(BSP.th), { bagi_pengelola: mode }); toast(mode === "rata" ? "Honor pengelola dibagi rata" : "Honor pengelola dibagi sebanding pagu", "ok"); _bspGambarGab(); }
  catch (e) { toast("Gagal: " + e.message, "err"); }
}
// Daftar & formulir honor pengelola (Bendahara)
async function bspKelolaPengelola(editId) {
  if (!bspBendahara()) return;
  if (!BSP.guruNama) { try { const r = await supaSemua.from("guru").select("id,nama,nip_nik").eq("status_aktif", true).order("nama"); BSP.guruNama = r.data || []; } catch (e) { BSP.guruNama = []; } }
  if (!BSP.dpk) { try { const r = await supaSemua.from("kuliah_pengaturan").select("nilai").eq("kunci", "dapodik:ptk").eq("ruang_id", "*").maybeSingle(); BSP.dpk = (r.data && r.data.nilai && r.data.nilai.ptk) || []; } catch (e) { BSP.dpk = []; } }
  const p = editId ? _bspPengelola().find((x) => x.id === editId) : null, d = p || { nama: "", jabatan: "", kode: "07.12.03", rek: BSP_REK_HONOR_PG[0][0], honor: "", bulan: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] };
  BSP.pgEdit = { id: editId || null, bulan: [...(d.bulan || [])] };
  const orang = _bspPengelola();
  openModal(`<div class="bsp-modal"><h3>Honor Pengelola PKBM ${BSP.th}</h3>
    <p class="bsp-ket">Honor bulanan pengelola PKBM. Totalnya otomatis dibebankan ke Paket A, Putra, dan Putri (${(BSP.umum || {}).bagi_pengelola === "rata" ? "dibagi rata" : "sebanding pagu"}) dan langsung mengurangi sisa pagu Kertas Kerja tiap jenjang.</p>
    ${orang.length ? `<div class="table-wrap"><table class="bsp-tabel kecil"><thead><tr><th>Nama</th><th>Jabatan</th><th>Kegiatan</th><th>Honor/Bulan</th><th>Bulan</th><th>Setahun</th><th></th></tr></thead><tbody>
      ${orang.map((x) => `<tr class="${x.id === editId ? "sisip" : ""}"><td>${_bspE(x.nama)}${_bspDpkPg(x.nama)}</td><td>${_bspE(x.jabatan)}</td><td>${_bspE(x.kode)}</td><td>${bspRp(x.honor)}</td><td>${(x.bulan || []).length} bln</td><td><b>${bspRp((Number(x.honor) || 0) * (x.bulan || []).length)}</b></td>
        <td style="white-space:nowrap"><button class="btn btn-sm btn-ghost" onclick="bspKelolaPengelola('${x.id}')">Ubah</button><button class="btn btn-sm btn-ghost" onclick="bspHapusPengelola('${x.id}')">Hapus</button></td></tr>`).join("")}
      <tr><td colspan="5"><b>Total</b></td><td colspan="2"><b>${bspRp(bspTotalPengelola())}</b></td></tr></tbody></table></div>` : ""}
    <h4 style="margin:12px 0 6px">${p ? "Ubah" : "Tambah"} Pengelola</h4>
    <div class="bsp-baris2"><label class="bsp-f"><span>Nama</span><input id="bpg-nama" class="input" list="bpg-guru" value="${_bspE(d.nama)}" placeholder="Pilih dari Data Guru atau ketik"><datalist id="bpg-guru">${BSP.guruNama.map((x) => `<option value="${_bspE(x.nama)}">`).join("")}</datalist></label>
      <label class="bsp-f"><span>Jabatan</span><input id="bpg-jabatan" class="input" list="bpg-jab" value="${_bspE(d.jabatan)}" placeholder="mis. Kepala PKBM, Operator Dapodik"><datalist id="bpg-jab">${BSP_JABATAN_PG.map((x) => `<option value="${x}">`).join("")}</datalist></label></div>
    <div class="bsp-baris2"><label class="bsp-f"><span>Kegiatan (Kode Referensi)</span><select id="bpg-kode" class="input">${BSP_KODE_HONOR_PG.map(([k, n]) => `<option value="${k}" ${d.kode === k ? "selected" : ""}>${k} — ${n}</option>`).join("")}</select></label>
      <label class="bsp-f"><span>Rekening Belanja</span><select id="bpg-rek" class="input">${BSP_REK_HONOR_PG.map(([n]) => `<option ${d.rek === n ? "selected" : ""}>${n}</option>`).join("")}</select></label></div>
    <div class="bsp-baris2"><label class="bsp-f"><span>Honor per Bulan</span><input id="bpg-honor" class="input" inputmode="numeric" value="${d.honor ? formatRibuan(d.honor) : ""}" placeholder="Rp" oninput="this.value=formatRibuan(this.value);_bspPgTotal()"></label>
      <div class="bsp-f"><span>Total Setahun</span><b id="bpg-total" class="bsp-pg-total">Rp 0</b></div></div>
    <div class="bsp-f"><span>Dibayar pada Bulan</span><div id="bpg-bulan" class="bsp-pg-bulan"></div></div>
    <p class="bsp-ket">Syarat honor (Pasal 48 ayat 5): tercatat di Dapodik, ditugaskan dengan surat penugasan/SK, aktif bertugas, dan belum memiliki gaji pokok dari PKBM.</p>
    <div class="bsp-aksi-bawah">${p ? `<button class="btn btn-outline" onclick="bspKelolaPengelola()">Batal Ubah</button>` : ""}<button class="btn btn-outline" onclick="closeModal()">Tutup</button><button class="btn bsp-hitam" onclick="bspSimpanPengelola()">${p ? "Perbarui" : "+ Masukkan ke Anggaran"}</button></div></div>`, { lebar: true });
  _bspPgBulan();
}
function _bspDpkPg(nama) {
  const n = String(nama || "").toLowerCase().split(",")[0].replace(/[^a-z ]/g, "").trim(); if (!n || !(BSP.dpk || []).length) return "";
  const ada = BSP.dpk.some((x) => String(x.nama || "").toLowerCase().replace(/[^a-z ]/g, "").trim() === n || (x.guru_id && (BSP.guruNama || []).some((gg) => gg.id === x.guru_id && String(gg.nama).toLowerCase().split(",")[0].replace(/[^a-z ]/g, "").trim() === n)));
  return ada ? '<small class="bsp-dpk-ok">✓ Terdaftar Dapodik</small>' : '<small class="bsp-dpk-no">Belum di Dapodik — honor mensyaratkan tercatat di Dapodik</small>';
}
function _bspPgBulan() {
  const el = qs("bpg-bulan"); if (!el) return;
  el.innerHTML = BSP_BULAN.map((n, i) => `<button class="${BSP.pgEdit.bulan.includes(i + 1) ? "aktif" : ""}" onclick="_bspPgTogBulan(${i + 1})">${n.slice(0, 3)}</button>`).join("") + `<button class="bsp-pg-semua" onclick="BSP.pgEdit.bulan=BSP.pgEdit.bulan.length===12?[]:[1,2,3,4,5,6,7,8,9,10,11,12];_bspPgBulan()">${BSP.pgEdit.bulan.length === 12 ? "Kosongkan" : "Semua"}</button>`;
  _bspPgTotal();
}
function _bspPgTogBulan(m) { const b = BSP.pgEdit.bulan; const i = b.indexOf(m); i >= 0 ? b.splice(i, 1) : b.push(m); b.sort((x, y) => x - y); _bspPgBulan(); }
function _bspPgTotal() { const el = qs("bpg-total"); if (el) el.textContent = bspRp(_bspAngka(qs("bpg-honor")?.value) * BSP.pgEdit.bulan.length); }
async function bspSimpanPengelola() {
  const nama = qs("bpg-nama").value.trim(), jabatan = qs("bpg-jabatan").value.trim(), honor = _bspAngka(qs("bpg-honor").value), kode = qs("bpg-kode").value, rek = qs("bpg-rek").value;
  if (!nama) { toast("Isi nama pengelola", "err"); return; }
  if (!jabatan) { toast("Isi jabatan", "err"); return; }
  if (!honor) { toast("Isi honor per bulan", "err"); return; }
  if (!BSP.pgEdit.bulan.length) { toast("Pilih minimal satu bulan", "err"); return; }
  const jenis = (BSP_REK_HONOR_PG.find((x) => x[0] === rek) || [, "barang"])[1], id = BSP.pgEdit.id || _bspId();
  const lama = BSP.pgEdit.id ? _bspPengelola().find((x) => x.id === id) : null;
  const baris = { nama, jabatan, kode, rek, jenis, honor, bulan: [...BSP.pgEdit.bulan], oleh: STATE.guruNama || "", t: lama ? lama.t : Date.now() };
  try {
    BSP.umum = await _bspGabungUmum(_bspKunciUmum(BSP.th), { pengelola: { [id]: baris } });
    toast(lama ? "Honor pengelola diperbarui" : "Honor pengelola ditambahkan", "ok");
    if (typeof _rgLog === "function") _rgLog("bosp-honor-pengelola", { nama, honor });
    bspKelolaPengelola(); _bspGambarGab();
  } catch (e) { toast("Gagal: " + e.message, "err"); }
}
async function bspHapusPengelola(id) {
  const p = _bspPengelola().find((x) => x.id === id); if (!p) return;
  if (!confirm(`Hapus honor ${p.jabatan} — ${p.nama}?`)) return;
  try { BSP.umum = await _bspGabungUmum(_bspKunciUmum(BSP.th), { pengelola: { [id]: { dihapus: true, t: Date.now(), oleh: STATE.guruNama || "" } } }); toast("Dihapus", "ok"); bspKelolaPengelola(); _bspGambarGab(); }
  catch (e) { toast("Gagal: " + e.message, "err"); }
}
async function bspSimpanPagu() {
  const v = (id) => _bspAngka(qs(id)?.value);
  const pagu = { total: v("bsp-p-total"), A: v("bsp-p-A"), Pa: v("bsp-p-Pa"), Pi: v("bsp-p-Pi") };
  if (pagu.total && pagu.A + pagu.Pa + pagu.Pi !== pagu.total && !(await konfirmasiTema(`Jumlah pagu ruang (${bspRp(pagu.A + pagu.Pa + pagu.Pi)}) belum sama dengan total pagu PKBM (${bspRp(pagu.total)}). Tetap simpan?`, { judul: "Periksa Pagu", ikon: "⚠️", teksYa: "Tetap Simpan" }))) return;
  try { BSP.umum = await _bspGabungUmum(_bspKunciUmum(BSP.th), { pagu: { ...pagu, oleh: STATE.guruNama || "", t: Date.now() } }); toast("Pagu tersimpan", "ok"); _bspGambarGab(); }
  catch (e) { toast("Gagal: " + e.message, "err"); }
}
async function bspSimpanKodeRek(ruang, id, kode) {
  try { BSP.umum = await _bspGabungUmum(_bspKunciUmum(BSP.th), { rek: { [ruang + ":" + id]: kode.trim() } }); toast("Kode rekening tersimpan", "ok"); }
  catch (e) { toast("Gagal: " + e.message, "err"); }
}
async function bspPutuskan(ruang, status) {
  let catatan = "";
  if (status === "dikembalikan") { catatan = prompt(`Catatan untuk ${_bspNamaRuang(ruang)} (apa yang perlu diperbaiki?):`) || ""; if (!catatan.trim()) { toast("Tulis catatan perbaikannya", "warn"); return; } }
  else if (!(await konfirmasiTema(`Sahkan Kertas Kerja ${_bspNamaRuang(ruang)} ${BSP.th}? Usulan ruang terkunci.`, { judul: "Sahkan Usulan", ikon: "✅", teksYa: "Ya, Sahkan" }))) return;
  try {
    BSP.umum = await _bspGabungUmum(_bspKunciUmum(BSP.th), { keputusan: { [ruang]: { status, catatan: catatan.trim(), oleh: STATE.guruNama || "", t: Date.now() } } });
    toast(status === "disahkan" ? "Usulan disahkan ✓" : "Usulan dikembalikan untuk revisi", "ok"); _bspGambarGab();
    if (typeof _bspPushKeputusan === "function") _bspPushKeputusan(ruang, status, catatan.trim());
    if (typeof _rgLog === "function") _rgLog("bosp-" + status, { ruang, tahun: BSP.th });
  } catch (e) { toast("Gagal: " + e.message, "err"); }
}
function bspUnduhGab() {
  const semua = _bspBarisGab();
  if (!semua.length) { toast("Belum ada usulan", "info"); return; }
  const baris = [];
  semua.sort((a, b) => a.kode.localeCompare(b.kode)).forEach((b) => Object.entries(b.bulan || {}).sort((x, y) => x[0] - y[0]).forEach(([m, x]) => baris.push({
    Bulan: BSP_BULAN[m - 1], "Program Kegiatan": bspProgram(b.kode)[0], "Kode Kegiatan": b.kode, Kegiatan: b.kegiatan, "Jenis Belanja": (BSP_JENIS[b.jenis] || BSP_JENIS.barang)[0],
    "Kode Rekening": b.kodeRek || "", "Rekening Belanja": b.rek, Uraian: b.uraian, Jumlah: x.jml, Satuan: x.sat, "Harga Satuan": x.harga ?? b.harga, Total: (Number(x.jml) || 0) * (Number(x.harga ?? b.harga) || 0), Ruang: _bspNamaRuang(b.ruang), Penyusun: b.oleh || "",
  })));
  baris.sort((a, b) => BSP_BULAN.indexOf(a.Bulan) - BSP_BULAN.indexOf(b.Bulan));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(baris), "Kertas Kerja " + BSP.th);
  XLSX.writeFile(wb, `Kertas Kerja BOP Kesetaraan ${BSP.th} - PKBM Al-Umm.xlsx`);
}

// ── Pengaturan Ruang → Bendahara BOSP ──
const _bspAturAsli = typeof rgBukaPengaturan === "function" ? rgBukaPengaturan : null;
if (_bspAturAsli) rgBukaPengaturan = async function (tab) {
  if (tab === "bosp" || (!tab && typeof RG_ATUR !== "undefined" && RG_ATUR.tab === "bosp")) {
    if (!rgBisaPengaturan()) { toast("Hanya Admin yang bisa mengakses ini", "err"); return; }
    RG_ATUR.tab = "bosp";
    const sec = _rgBukaHal("rg-atur", "Pengaturan Ruang", `<div class="card"><div class="rg-memuat">Memuat…</div></div>`);
    const tabs = [["fitur", "🧩 Fitur Per Ruang"], ["anggota", "👥 Guru Per Ruang"], ["santri", "🎒 Halaman Santri"], ["akun", "🔐 Akun Guru"], ["bosp", "💰 Bendahara BOSP"], ["log", "📜 Catatan Aktivitas"]];
    try {
      const [g] = await Promise.all([supaSemua.from("guru").select("id,nama,status_aktif").eq("status_aktif", true).order("nama"), _bspMuatUmum(_bspTahunAwal())]);
      sec.innerHTML = `<div class="card"><div class="rg-tab">${tabs.map(([k, n]) => `<button class="${k === "bosp" ? "aktif" : ""}" onclick="rgBukaPengaturan('${k}')">${n}</button>`).join("")}</div>
        <p class="rg-ket">Bendahara BOSP / Admin ARKAS menerima pengajuan Kertas Kerja dari ruang Paket A, B&C Putra, dan B&C Putri, mengisi pagu dan kode rekening, lalu mengesahkan atau mengembalikan. Admin utama selalu bisa.</p>
        <div class="rg-nonaktif">${(g.data || []).map((x) => `<label class="rg-cek"><input type="checkbox" ${BSP.bend.includes(x.id) ? "checked" : ""} onchange="bspUbahBendahara('${x.id}',this.checked)"> ${_bspE(x.nama)}</label>`).join("")}</div></div>`;
    } catch (e) { sec.innerHTML = `<div class="card">Gagal memuat: ${_bspE(e.message)}</div>`; }
    return;
  }
  await _bspAturAsli(tab);
  const bar = document.querySelector("#page-rg .rg-tab");
  if (bar && !bar.querySelector("[data-bosp]")) { const b = document.createElement("button"); b.dataset.bosp = "1"; b.textContent = "💰 Bendahara BOSP"; b.onclick = () => rgBukaPengaturan("bosp"); bar.insertBefore(b, bar.lastElementChild); }
};
async function bspUbahBendahara(id, nyala) {
  const ids = new Set(BSP.bend); nyala ? ids.add(id) : ids.delete(id);
  try { const h = await _bspGabungUmum("bosp:bendahara", { ids: [...ids], oleh: STATE.guruNama || "", t: Date.now() }); BSP.bend = h.ids || [...ids]; toast("Bendahara BOSP diperbarui", "ok"); }
  catch (e) { toast("Gagal: " + e.message, "err"); }
}

// ============================================================
//  DATA REKENING ARKAS & JUKNIS (ruang Pengelola; bisa dibuka dari Kertas Kerja)
// ============================================================
const BSP_REKV = { tab: "kesetaraan", cari: "" };
function bspBukaRek(dariKK) {
  const sec = _rgBukaHal("pg-rek", "Data Rekening ARKAS", "");
  BSP.dariKK = !!dariKK;
  _bspGambarRek(sec);
}
function _bspGambarRek(sec) {
  sec = sec || qs("page-rg"); if (!sec) return;
  const tab = BSP_REKV.tab, s = BSP_REKV.cari.toLowerCase().trim();
  const tabelKode = (data) => { const rows = bspUrai(data).filter((k) => !s || (k.kode + " " + k.uraian + " " + k.komponen + " " + k.snp).toLowerCase().includes(s)); return `<div class="table-wrap"><table class="bsp-tabel bsp-ref"><thead><tr><th>Kode</th><th>SNP</th><th>Komponen</th><th>Uraian Kegiatan</th></tr></thead><tbody>${rows.map((k) => `<tr><td><span class="bsp-kode" style="--pw:${bspProgram(k.kode)[1]}">${k.kode}</span></td><td>${_bspE(k.snp)}</td><td>${_bspE(k.komponen)}</td><td>${_bspE(k.uraian)}${_bspTandaKode(k.kode)}</td></tr>`).join("") || `<tr><td colspan="4" class="bsp-kosong">Tidak ditemukan.</td></tr>`}</tbody></table></div><small class="bsp-ket">${rows.length} kode</small>`; };
  let isi = "";
  if (tab === "kesetaraan") isi = `<p class="bsp-ket">Kode referensi kegiatan untuk <b>BOP Kesetaraan</b> (Paket A/B/C, PKBM, SKB) — yang dipakai PKBM Al-Umm. Istilah "Guru" menjadi "Guru/Tutor", "Peserta Didik" disandingkan dengan "warga belajar".</p>${tabelKode(BSP_REF.kesetaraan)}`;
  else if (tab === "bos") isi = `<p class="bsp-ket">Pembanding: kode untuk SD/SMP/SMA/SMK penerima <b>BOS Reguler</b>. Jangan dipakai untuk Kertas Kerja PKBM.</p>${tabelKode(BSP_REF.bos)}`;
  else if (tab === "paud") isi = `<p class="bsp-ket">Pembanding: kode untuk satuan PAUD penerima <b>BOP PAUD Reguler</b> (memakai istilah APE).</p>${tabelKode(BSP_REF.paud)}`;
  else if (tab === "rekening") isi = `<div class="bsp-tiga">${Object.entries(BSP_JENIS).map(([k, [n, w]]) => `<div class="card bsp-jenis-kartu" style="--jw:${w}"><b>${n}</b><small>${k === "pegawai" ? "Honor pendidik/tutor & tenaga kependidikan (5.1.01 / 5.1.02.02)" : k === "barang" ? "Bahan habis pakai, jasa, langganan, pemeliharaan, perjalanan dinas (5.1.02)" : "Barang yang menjadi aset tetap: komputer, laptop, printer, proyektor, mebel, buku koleksi (5.2)"}</small>
      <ul>${BSP_REK.filter((r) => r.jenis === k && (!s || r.nama.toLowerCase().includes(s))).map((r) => `<li>${_bspE(r.nama)}${r.kode ? ` <code>${r.kode}</code>` : ""}</li>`).join("")}</ul></div>`).join("")}</div>
    <p class="bsp-ket">Secara resmi rekening belanja ARKAS hanya terbagi 3 kategori di atas. Nama di daftar ini adalah rekening yang umum dipakai di ARKAS; <b>kode lengkapnya diisi Bendahara/Admin ARKAS</b> mengikuti daftar terbaru di aplikasi ARKAS (dimutakhirkan Dinas lewat "Perbarui Data Referensi"). Kode yang tercantum di laman resmi Kemendikdasmen: <code>5.1.02.02.01.0013</code> Belanja Jasa Tenaga Pendidikan (honor) dan <code>5.2.02.05.02.0001</code> Belanja Modal Mebel.</p>`;
  else isi = `<div class="bsp-penting">
      <div class="card bsp-p-merah"><h4>🚫 Belanja Modal dan Barang/Jasa Tidak Boleh Tertukar</h4><p>Salah mengategorikan belanja modal sebagai belanja barang/jasa (atau sebaliknya) membuat laporan pertanggungjawaban BOSP tidak sinkron dengan pencatatan aset, dan berpotensi menjadi <b>temuan audit</b> atau pemeriksaan Dinas Pendidikan.</p>
        <div class="table-wrap"><table class="bsp-tabel kecil"><thead><tr><th>Cenderung Belanja Modal (aset)</th><th>Cenderung Belanja Operasional (Pegawai/Barang-Jasa)</th></tr></thead><tbody>
        <tr><td>Pengadaan komputer desktop/laptop</td><td>ATK, tinta printer, kabel ekstensi</td></tr><tr><td>Printer, scanner, proyektor, layar LCD</td><td>Honor guru/tutor, tenaga administrasi, tenaga penunjang</td></tr>
        <tr><td>Perbaikan bangunan/ruang yang menambah nilai aset</td><td>Listrik, air, telepon, internet</td></tr><tr><td>Mebel (meja, kursi, lemari)</td><td>Konsumsi rapat kedinasan dan tamu</td></tr><tr><td>Buku teks & koleksi perpustakaan</td><td>Bea meterai & administrasi bank</td></tr></tbody></table></div>
        <p><b>Barang aset (laptop, proyektor, mebel, seragam inventaris) wajib dicatat di buku inventaris</b>, apa pun kode rekening yang dipilih saat input RKAS.</p></div>
      <div class="card"><h4>📏 Batas Persentase BOP Kesetaraan Reguler 2026</h4><ul>
        <li><b>Honor maks. 40%</b> dari 100% total pagu (tahun 2025 dihitung dari 50% pagu). Dihitung dari kegiatan 07.12.01/03/04 + rekening <code>5.1.02.02.01.0013</code>.</li>
        <li><b>Buku min. 10%</b> dari total pagu — kode Kesetaraan 05.02.03, 05.02.04, 05.02.05, 05.02.06.</li>
        <li><b>Pemeliharaan sarpras maks. 20%</b> — kode 05.08.01, 05.08.03, 05.08.05, 05.08.06, 05.08.08, 05.08.09, 05.08.10, 05.08.12 (rekening operasi 5.1 atau modal mebel 5.2.02.05.02.0001).</li></ul></div>
      <div class="card"><h4>🔄 Yang Berubah dari 2025 ke 2026</h4><ul>
        <li>Dasar hukum: <b>Permendikdasmen 8/2026</b> (ditetapkan 5 Feb, berlaku 6 Feb 2026) menggantikan Permendikdasmen 8/2025.</li>
        <li>Basis honor: dari 50% pagu menjadi <b>100% pagu</b>. Pembedaan 20% negeri/40% swasta hanya untuk BOS Reguler; BOP Kesetaraan flat maks. 40%.</li>
        <li>Buku: BOP PAUD min. 5%, BOS & BOP Kesetaraan tetap min. 10%. Sarpras flat maks. 20%.</li>
        <li>Ada <b>Dana Afirmasi</b> untuk satuan pendidikan di daerah khusus.</li>
        <li>Struktur kode kegiatan relatif tetap; ada penyesuaian redaksi uraian. Juknis 2026 efektif di aplikasi setelah <b>MARKAS 2.2.15 dan ARKAS 4.2.18</b>.</li></ul></div>
      <div class="card"><h4>🧭 Kode Kegiatan vs Kode Rekening</h4><p><b>Kode referensi kegiatan</b> menandai jenis kegiatan menurut Standar Nasional Pendidikan (mis. 05.09.02 Pengadaan Laptop). <b>Kode rekening belanja</b> menandai jenis belanjanya (Pegawai, Barang/Jasa, Modal). <b>Satu baris di RKAS membutuhkan keduanya.</b></p></div>
    </div>`;
  sec.innerHTML = `<div class="bsp">
    <div class="bsp-atas"><div>${BSP.dariKK ? `<button class="bsp-kembali" onclick="bspBukaKK(BSP.th)">← Kembali ke Kertas Kerja</button>` : ""}<h2 class="bsp-judul">Data Rekening ARKAS</h2><div class="bsp-sub">KODE REFERENSI KEGIATAN & REKENING BELANJA · TERAKHIR DIPERBARUI: ${_bspE(BSP_DIPERBARUI.toUpperCase())}</div></div></div>
    <div class="bsp-rv-tab">${[["kesetaraan", "BOP Kesetaraan"], ["rekening", "Rekening Belanja"], ["penting", "⚠️ Penting Dibaca"], ["bos", "BOS Reguler"], ["paud", "BOP PAUD"]].map(([k, n]) => `<button class="${tab === k ? "aktif" : ""}" onclick="BSP_REKV.tab='${k}';_bspGambarRek()">${n}</button>`).join("")}</div>
    ${tab !== "penting" ? `<input class="input bsp-cari-ref" placeholder="Cari kode atau uraian…" value="${_bspE(BSP_REKV.cari)}" oninput="BSP_REKV.cari=this.value;clearTimeout(window._bspT);window._bspT=setTimeout(()=>{_bspGambarRek();const i=document.querySelector('.bsp-cari-ref');if(i){i.focus();i.setSelectionRange(i.value.length,i.value.length)}},200)">` : ""}
    ${isi}
    <p class="bsp-sumber">Sumber: Pusat Informasi Rumah Pendidikan Kemendikdasmen — "Kode Referensi Pada ARKAS 4" (dimutakhirkan 10 Maret 2026) dan "Implementasi Permendikdasmen No 8/2026 dalam Penggunaan Dana BOSP Reguler"; rangkuman Kode Rekening ARKAS 2026 (16 Agustus 2026). Kode bersifat dokumen hidup — selalu bandingkan dengan ARKAS di perangkat Bendahara.</p></div>`;
}

function bspBukaJuknis(dariKK) {
  BSP.dariKK = !!dariKK;
  const sec = _rgBukaHal("pg-juknis", "Juknis BOSP 2026", "");
  const kartu = (ikon, judul, isi, kelas = "") => `<div class="card bsp-j ${kelas}"><div class="bsp-j-h"><span>${ikon}</span><h4>${judul}</h4></div>${isi}</div>`;
  const det = (judul, isi) => `<details class="bsp-j-det"><summary>${judul}</summary>${isi}</details>`;
  sec.innerHTML = `<div class="bsp bsp-juknis">
    ${BSP.dariKK ? `<button class="bsp-kembali" onclick="bspBukaKK(BSP.th)">← Kembali ke Kertas Kerja</button>` : ""}
    <div class="bsp-j-hero"><small>PERMENDIKDASMEN NOMOR 8 TAHUN 2026</small><h2>Juknis Dana BOSP — Rangkuman BOP Kesetaraan</h2>
      <p>Petunjuk Teknis Pengelolaan Dana Bantuan Operasional Satuan Pendidikan. Ditetapkan <b>5 Februari 2026</b>, berlaku sejak diundangkan <b>6 Februari 2026</b>, mencabut Permendikdasmen 8/2025.</p>
      <div class="bsp-j-angka"><span><b>≤40%</b>Honor</span><span><b>≥10%</b>Buku</span><span><b>≤20%</b>Sarpras</span><span><b>31 Jul</b>Lapor Tahap I</span><span><b>31 Jan</b>Lapor Tahunan</span></div></div>

    <div class="bsp-j-grid">
    ${kartu("🎯", "Prinsip Pengelolaan (Pasal 2)", `<div class="bsp-j-chip"><span>Fleksibel</span><span>Efektif</span><span>Efisien</span><span>Akuntabel</span><span>Transparan</span></div><p>Dana dikelola sesuai kebutuhan satuan pendidikan, memberi hasil nyata, hemat biaya dengan hasil optimal, bisa dipertanggungjawabkan, dan terbuka bagi pemangku kepentingan.</p>`)}
    ${kartu("🏫", "Penerima BOP Kesetaraan (Pasal 14–17)", `<p>Satuan pendidikan kesetaraan penyelenggara <b>Paket A, B, dan C</b>: SKB dan <b>PKBM</b>. Terdiri atas:</p><ul>
      <li><b>Reguler</b> — operasional rutin Paket A/B/C.</li><li><b>Kinerja</b> — 10% satuan pendidikan berkinerja terbaik (rapor pendidikan: kualitas pembelajaran & hasil belajar, plus indeks sosial-ekonomi).</li><li><b>Afirmasi</b> — satuan pendidikan di daerah khusus yang ditetapkan Menteri.</li></ul>`)}
    ${kartu("✅", "Syarat Penerima Reguler (Pasal 15)", `<ol><li>Memiliki <b>NPSN</b> yang terdata di Dapodik.</li><li>Mengisi & memutakhirkan Dapodik sesuai kondisi riil paling lambat <b>31 Agustus</b> tahun anggaran sebelumnya.</li><li>Memiliki izin penyelenggaraan yang terdata di Dapodik.</li><li>Memiliki <b>Rekening Satuan Pendidikan</b>.</li><li>Bukan satuan pendidikan kerja sama.</li></ol>`)}
    ${kartu("🧮", "Besaran Alokasi (Pasal 29–31)", `<p class="bsp-j-rumus">Alokasi = <b>Satuan Biaya Daerah</b> × <b>Jumlah Murid</b></p><ul><li>Murid dihitung: usia <b>7 tahun sampai sebelum 25 tahun</b>, memiliki <b>NISN</b>, menurut Dapodik <b>31 Agustus</b> tahun sebelumnya.</li><li>Satuan biaya tiap daerah ditetapkan Menteri.</li><li>Di daerah khusus dengan murid &lt;10, dihitung menjadi <b>10 murid</b>.</li><li>Besaran Kinerja & Afirmasi ditetapkan Menteri.</li></ul><p class="bsp-j-tip">💡 Pastikan usia dan NISN warga belajar di Dapodik benar sebelum 31 Agustus — langsung memengaruhi pagu tahun berikutnya.</p>`)}
    ${kartu("🏦", "Penyaluran & Rekening (Pasal 32–36)", `<ul><li>Disalurkan langsung ke <b>Rekening Satuan Pendidikan</b>.</li><li>Nama rekening <b>sesuai nama di Dapodik</b> dan <b>diawali NPSN</b>; ditetapkan Pemda dan dikirim Dinas ke Kementerian.</li><li>Dana bisa langsung dipakai setelah masuk rekening.</li><li>Menteri dapat menunda/menghentikan penyaluran bila melanggar NSPK.</li></ul>`)}
    </div>

    ${kartu("🧩", "10 Komponen BOP Kesetaraan Reguler (Pasal 48 & Lampiran I)", `<p>Pilih komponen sesuai kebutuhan, dituangkan dalam RKAS. Ketuk untuk contoh penggunaan.</p>
      ${det("a. Penerimaan Murid Baru", "<ul><li>Penggandaan formulir, publikasi/pengumuman, biaya layanan pendaftaran daring</li><li>Kegiatan pengenalan lingkungan</li><li>Tes bakat skolastik/potensi akademik (penyelenggara masyarakat)</li><li>Pendataan ulang murid lama; identifikasi murid berkebutuhan khusus</li></ul>")}
      ${det("b. Pengembangan Perpustakaan — <b>WAJIB min. 10% untuk buku</b>", "<ul><li><b>Buku teks utama</b>: sesuai kurikulum, sudah dinilai Kementerian (buku.kemendikdasmen.go.id), rasio <b>1 buku tiap murid</b> per tema/mapel, juga buku guru, dan harus dipakai sebagai pegangan belajar</li><li>Buku nonteks (penguatan baca tulis, 7 kebiasaan anak Indonesia hebat, pembelajaran mendalam) — yang sudah dinilai Kementerian & sesuai jenjang</li><li>Buku teks pendamping sesuai kurikulum, termasuk buku digital</li><li>Peningkatan minat baca; buku untuk murid berkebutuhan khusus</li></ul>")}
      ${det("c. Pelaksanaan Kegiatan Pembelajaran & Ekstrakurikuler", "<ul><li>Analisis konteks pendidikan kesetaraan</li><li>Pengembangan silabus & rencana program pembelajaran</li><li>Penyusunan & pencetakan/pengadaan <b>modul interaktif</b> dan media pembelajaran</li><li>Alat keterampilan & bahan praktik keterampilan</li><li>Pembelajaran luar kelas</li><li>Literasi & numerasi; berpikir komputasional berbasis STEAM</li><li>Konten pembelajaran; pendidikan karakter, pencegahan kekerasan, kebinekaan</li></ul>")}
      ${det("d. Evaluasi / Asesmen Pembelajaran", "<ul><li>Ujian modul/sumatif</li><li><b>Ujian pendidikan kesetaraan</b></li><li>Asesmen, survei karakter, survei lingkungan belajar</li><li>Refleksi pembelajaran; laporan hasil ujian/asesmen</li></ul>")}
      ${det("e. Administrasi Kegiatan Satuan Pendidikan", "<ul><li>Pendataan murid program kesetaraan</li><li>ATK & bahan habis pakai</li><li>Perencanaan, pengawasan, evaluasi, dan tata tertib (penguatan tata kelola)</li></ul>")}
      ${det("f. Pengembangan Profesi Pendidik & Tenaga Kependidikan", "<ul><li>Mengikuti/menyelenggarakan peningkatan kompetensi, termasuk yang menangani murid berkebutuhan khusus</li><li>Kegiatan relevan lain (komunitas belajar, forum tutor/PKBM)</li></ul>")}
      ${det("g. Langganan Daya & Jasa", "<ul><li>Listrik, internet, air, telepon</li><li>Pemasangan baru & penambahan kapasitas</li></ul>")}
      ${det("h. Pemeliharaan Sarana & Prasarana — <b>maks. 20%</b>", "<ul><li>Pemeliharaan alat pembelajaran & alat peraga</li><li>Obat-obatan, peralatan kebersihan & kesehatan</li><li>Sarana/aksesibilitas murid berkebutuhan khusus</li></ul><p>Rincian umum: perbaikan <b>kerusakan ringan nonstruktural</b> (atap, plafon, listrik, pintu/jendela, cat, lantai), meubelair, toilet & sanitasi, air bersih, perawatan komputer/printer/proyektor/AC.</p>")}
      ${det("i. Penyediaan Alat Multimedia Pembelajaran", "<ul><li>Komputer desktop/laptop untuk pembelajaran</li><li>Printer/scanner; LCD proyektor</li><li>Alat multimedia lain yang menunjang pembelajaran berbasis TIK</li></ul><p class='bsp-j-tip'>⚠️ Barang-barang ini menjadi <b>aset</b>: pakai Belanja Modal dan catat di buku inventaris.</p>")}
      ${det("j. Pembayaran Honor — <b>maks. 40%</b>", "<p>Honor bulanan pendidik/tenaga kependidikan yang:</p><ol><li>tercatat di <b>Dapodik</b>;</li><li>ditugaskan kepala/penyelenggara dengan <b>surat penugasan/SK</b>;</li><li><b>aktif</b> bertugas di satuan pendidikan kesetaraan;</li><li><b>belum memiliki gaji pokok</b> dari satuan pendidikan tersebut.</li></ol>")}`, "bsp-j-lebar")}

    <div class="bsp-j-grid">
    ${kartu("⭐", "Komponen Kinerja (Pasal 49)", `<ul><li><b>Penguatan literasi & numerasi</b> — pelatihan, perangkat & bahan ajar, lomba/kompetisi</li><li><b>Digitalisasi pembelajaran</b> — pelatihan, penyusunan konten, langganan konten</li><li><b>Tata kelola</b> — perencanaan berbasis data, penjaminan mutu internal, kemitraan</li></ul>`)}
    ${kartu("🏝️", "Komponen Afirmasi (Pasal 50)", `<ul><li><b>Penguatan akses</b> — langganan daya & jasa, transportasi murid & guru, sanitasi & air bersih</li><li><b>Penguatan mutu</b> — pelatihan, layanan pojok baca, pembelajaran & ekstrakurikuler</li></ul>`)}
    ${kartu("📝", "Tata Cara Penggunaan (Pasal 51–54)", `<ul><li>Komponen ditentukan sesuai kebutuhan dan dituangkan dalam <b>RKAS</b> beserta rinciannya.</li><li>Pengadaan barang/jasa mengikuti aturan pengadaan oleh satuan pendidikan.</li><li><b>Tidak boleh</b> membiayai belanja yang sudah dibiayai penuh sumber lain.</li><li><b>Sisa dana</b> tahun lalu baru dipakai setelah dicatat di RKAS; divalidasi Pemda dan diperhitungkan pada penyaluran berikutnya.</li></ul>`)}
    ${kartu("👤", "Pengelola & Tugas Kepala (Pasal 64–65)", `<p>Dana dikelola <b>kepala satuan pendidikan</b>; untuk BOP Kesetaraan <b>dapat membentuk tim</b>. Tugasnya:</p><ul><li>Memutakhirkan & memverifikasi Dapodik</li><li><b>Menyusun RKAS</b></li><li>Konfirmasi dana diterima di aplikasi Kementerian</li><li>Penatausahaan & pengadaan barang/jasa</li><li>Menggunakan dana sesuai RKAS</li><li>Menyampaikan laporan realisasi</li><li>Melayani pengaduan masyarakat</li></ul>`)}
    </div>

    ${kartu("⏰", "Pelaporan & Tenggat (Pasal 56–60)", `<div class="table-wrap"><table class="bsp-tabel kecil"><thead><tr><th>Laporan</th><th>Batas Waktu</th><th>Keterangan</th></tr></thead><tbody>
      <tr><td>Realisasi Tahap I</td><td><b>31 Juli</b> tahun berjalan</td><td>Realisasi minimal <b>50%</b> dana Tahap I menjadi dasar penyaluran Tahap II</td></tr>
      <tr><td>Realisasi tahunan</td><td><b>31 Januari</b> tahun berikutnya</td><td>Realisasi 1 tahun, sisa dana, dan hasil pengadaan barang/jasa; dasar penyaluran Tahap I tahun berikutnya</td></tr></tbody></table></div>
      <div class="bsp-j-denda"><div><b>Terlambat → penyaluran berikutnya dipotong</b></div>
        <div class="bsp-j-denda-grid"><span><em>Tahap I</em> Feb <b>2%</b> · Mar <b>3%</b> · 1 Apr–25 Jun <b>4%</b></span><span><em>Tahap II</em> Agu <b>2%</b> · Sep <b>3%</b> · 1–25 Okt <b>4%</b></span></div>
        <p>Tidak melapor Tahap I sampai <b>25 Oktober</b> → tidak menerima Tahap II. Tidak melapor tahun lalu sampai <b>25 Juni</b> → tidak menerima dana tahun berjalan.</p></div>`, "bsp-j-lebar")}

    ${kartu("⛔", "15 Larangan (Pasal 66)", `<div class="bsp-j-larang">${["Transfer dana ke rekening pribadi/lain di luar keperluan", "Membungakan untuk kepentingan pribadi", "Meminjamkan kepada pihak lain", "Membeli perangkat lunak laporan keuangan BOSP atau sejenisnya", "Menyewa aplikasi pendataan atau aplikasi daring penerimaan murid baru", "Membiayai kegiatan yang bukan prioritas", "Membiayai kegiatan dengan mekanisme iuran", "Membiayai kebutuhan pribadi pendidik, tenaga kependidikan, atau murid", "Memelihara prasarana dengan kerusakan sedang dan berat", "Membangun gedung atau ruangan baru", "Membeli instrumen investasi", "Ikut pelatihan/sosialisasi BOSP oleh pihak selain Dinas/Kementerian", "Membiayai kegiatan yang sudah dibiayai penuh sumber lain", "Memakai dana untuk kepentingan pribadi atau kelompok", "Menjadi distributor/pengecer buku, bahan ajar, APE, atau peralatan"].map((x, i) => `<span><b>${String.fromCharCode(97 + i)}</b>${x}</span>`).join("")}</div><p>Pelanggaran dikenai sanksi sesuai peraturan perundang-undangan.</p>`, "bsp-j-lebar bsp-p-merah")}

    <div class="bsp-j-grid">
    ${kartu("🗂️", "Tahapan RKAS (Lampiran II)", `<ol><li><b>Perencanaan & penganggaran</b> sebelum dana dipakai, untuk 1 tahun anggaran dalam bentuk RKAS.</li><li>Disusun berdasarkan <b>kebutuhan</b> dan <b>hasil evaluasi diri</b> pada profil satuan pendidikan.</li><li>Menentukan komponen, rincian pembiayaan, rincian barang/jasa, serta <b>satuan harga & volume</b>.</li><li>Disusun lewat <b>rapat</b> bersama warga satuan pendidikan dan Komite.</li><li>Diinput ke aplikasi Kementerian (<b>ARKAS</b>).</li><li>Setiap penggunaan dicatat lengkap dengan bukti, diinput kapan saja.</li><li>Laporan diverifikasi & dikirim lewat aplikasi; <b>bersedia diaudit</b>.</li></ol>`)}
    ${kartu("⚠️", "Kondisi Khusus (Pasal 55, 73, 74)", `<ul><li>Satuan pendidikan <b>ditutup</b>, menolak dana, atau menjadi kerja sama → <b>kembalikan dana</b> ke kas umum daerah dan lapor.</li><li>Ditutup karena <b>penggabungan</b> → sisa dana bisa dipakai satuan penerima penggabungan atas persetujuan Pemda.</li><li>Wilayah <b>bencana</b> → penggunaan dapat disesuaikan setelah persetujuan Menteri atas usulan Pemda.</li><li>Tidak menerima BOSP → biaya operasional ditanggung badan hukum penyelenggara.</li></ul>`)}
    </div>
    <p class="bsp-sumber">Rangkuman bagian yang berkaitan dengan BOP Kesetaraan dari Permendikdasmen Nomor 8 Tahun 2026 (Berita Negara 2026 Nomor 89). Untuk kepastian hukum, rujuk naskah resmi.</p>
  </div>`;
}

// ============================================================
//  PEMASANGAN MENU
// ============================================================
(function bspPasang() {
  if (typeof RG_IKON !== "undefined") {
    RG_IKON["pg-rek"] = '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 11h8M8 15h5"/>';
    RG_IKON["pg-juknis"] = '<path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H11v18H5.5A1.5 1.5 0 0 1 4 19.5z"/><path d="M20 4.5A1.5 1.5 0 0 0 18.5 3H13v18h5.5a1.5 1.5 0 0 0 1.5-1.5z"/>';
    RG_IKON["bsp-kk"] = '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M8 9v11M3 14.5h18"/>';
  }
  if (typeof RG_MENU_PENGELOLA !== "undefined") {
    const k = RG_MENU_PENGELOLA.find((g) => g.group === "Keuangan");
    if (k && !k.items.some((x) => x[0] === "pg-rek")) k.items.push(["pg-rek", "", "Data Rekening ARKAS"], ["pg-juknis", "", "Juknis BOSP"]);
  }
  if (typeof PG_MODUL_SIAP !== "undefined") ["pg-bosp", "pg-rek", "pg-juknis"].forEach((x) => { if (!PG_MODUL_SIAP.includes(x)) PG_MODUL_SIAP.push(x); });
  if (typeof rgBukaPengelola === "function") {
    const asli = rgBukaPengelola;
    rgBukaPengelola = async function (key) {
      if (key === "pg-bosp") return bspBukaBendahara();
      if (key === "pg-rek") return bspBukaRek();
      if (key === "pg-juknis") return bspBukaJuknis();
      return asli.apply(this, arguments);
    };
  }
  // Menu "Kertas Kerja BOSP" di ruang jenjang untuk penyusun
  if (typeof renderSidebar === "function") {
    const asli = renderSidebar;
    renderSidebar = function () {
      const h = asli.apply(this, arguments);
      try {
        if (typeof RG === "undefined" || !RG.siap || STATE.ruang === "Pg" || !bspBolehSusun()) return h;
        const nav = qs("nav-list"); if (!nav || nav.querySelector("[data-bsp]")) return h;
        const el = document.createElement("div"); el.className = "nav-item" + (STATE.currentPage === "bsp-kk" ? " active" : ""); el.dataset.bsp = "1";
        el.innerHTML = `${rgSvg("bsp-kk")}<span>Kertas Kerja BOSP</span>`; el.onclick = () => bspBukaKK();
        // masuk ke grup "Keuangan" yang sudah ada (paling bawah grup itu); bila ruang tidak punya grup Keuangan, buat grup baru
        const label = [...nav.querySelectorAll(".nav-group-label")];
        const keu = label.find((l) => /^(keuangan|finance)$/i.test(l.textContent.trim()));
        if (keu) {
          let akhir = keu; while (akhir.nextElementSibling && !akhir.nextElementSibling.classList.contains("nav-group-label")) akhir = akhir.nextElementSibling;
          akhir.after(el);
        } else {
          const lbl = label.find((l) => /Santri & Ruang/.test(l.textContent));
          const grup = document.createElement("div"); grup.className = "nav-group-label"; grup.textContent = "Keuangan";
          if (lbl) { nav.insertBefore(grup, lbl); nav.insertBefore(el, lbl); } else { nav.appendChild(grup); nav.appendChild(el); }
        }
      } catch (e) { console.warn("Menu BOSP:", e); }
      return h;
    };
  }
  // Bendahara: daftar dimuat sekali supaya hak akses Pengelola benar
  setTimeout(() => { if (typeof supaSemua !== "undefined") supaSemua.from("kuliah_pengaturan").select("nilai").eq("kunci", "bosp:bendahara").eq("ruang_id", "*").maybeSingle().then((b) => { BSP.bend = (b.data && b.data.nilai && b.data.nilai.ids) || []; }, () => {}); }, 2500);
})();

// ============================================================
//  COCOKKAN DATA SISWA DENGAN DAPODIK (Admin & Kepala Sekolah)
//  Unggah file "daftar_pd-….xlsx" hasil unduhan Dapodik → aplikasi membandingkan dengan Data Siswa:
//   ✅ Sesuai          — santri ada di keduanya & data utamanya sama
//   ⚠️ Beda data       — ada di keduanya tapi NISN/NIK/kelas/tanggal lahir/dll berbeda → bisa diperbarui dari Dapodik
//   🚫 Belum di Dapodik — ada di aplikasi tapi tidak ditemukan di Dapodik (belum terdaftar / salah data)
//   ➕ Belum di aplikasi — ada di Dapodik tapi belum ada di Data Siswa → bisa ditambahkan sekali klik
//  Ringkasan terakhir disimpan (kuliah_pengaturan "dapodik:cek") supaya tanda di Data Siswa tetap tampil.
//  Berkas Excel tidak diunggah ke server — dibaca di perangkat ini saja.
// ============================================================
const DPK = { hasil: null, snap: undefined, cakupan: "putra" };
const _dpkBoleh = () => (typeof isAdmin === "function" && isAdmin()) || (typeof isKepsekOrTU === "function" && isKepsekOrTU());
const _dpkAngka = (v) => String(v ?? "").replace(/^'/, "").replace(/\D/g, "");
const _dpkTanpaNol = (v) => _dpkAngka(v).replace(/^0+/, "");
const _dpkNama = (v) => String(v ?? "").replace(/^'/, "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z\s]/g, " ").replace(/\b(muhammad|muhamad|mohammad|moh|muh|m)\b/g, "muhammad").replace(/\s+/g, " ").trim();
const _dpkTeks = (v) => String(v ?? "").replace(/^'/, "").trim();
const _dpkKelasNo = (nama) => parseInt(String(nama || "").match(/(\d+)/)?.[1] || "0", 10);
function _dpkTgl(v) {
  if (!v) return "";
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  if (typeof v === "number") { const d = new Date(Math.round((v - 25569) * 86400000)); return d.toISOString().slice(0, 10); }
  const s = String(v).trim(); const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/); if (m) return m[0];
  const m2 = s.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/); return m2 ? `${m2[3]}-${m2[2].padStart(2, "0")}-${m2[1].padStart(2, "0")}` : s;
}

function dpkBuka() {
  if (!_dpkBoleh()) { toast("Fitur ini untuk Admin & Kepala Sekolah", "info"); return; }
  openModal(`<div class="dpk">
    <h3>🛡️ Cocokkan dengan Dapodik</h3>
    <div class="dpk-sub">Unggah file <b>daftar_pd-….xlsx</b> hasil unduhan Dapodik (menu Peserta Didik → Unduh). File hanya dibaca di perangkat ini, tidak dikirim ke mana pun.</div>
    <div class="dpk-cakupan">
      <label><input type="radio" name="dpk-cak" value="putra" ${DPK.cakupan === "putra" ? "checked" : ""} onchange="DPK.cakupan=this.value"> 👳 <b>Putra Paket B & C</b><small>rombel "Paket B/C … Putra" saja</small></label>
      <label><input type="radio" name="dpk-cak" value="bc" ${DPK.cakupan === "bc" ? "checked" : ""} onchange="DPK.cakupan=this.value"> 🏫 <b>Semua Paket B & C</b><small>putra & putri</small></label>
    </div>
    <label class="dpk-unggah"><span>📤</span><b>Pilih file Excel Dapodik</b><small>.xlsx dari Dapodik</small><input type="file" accept=".xlsx,.xls" hidden onchange="dpkBaca(this)"></label>
    ${DPK.snap?.t ? `<div class="dpk-sub" style="margin-top:10px">Pencocokan terakhir: <b>${new Date(DPK.snap.t).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</b> (data Dapodik ${escapeHtml(DPK.snap.unduh || "-")}).</div>` : ""}
  </div>`, { lebar: true });
}

// Baca tabel Dapodik: judul kolom di 2 baris (baris ke-2 merinci Data Ayah/Ibu/Wali)
function _dpkParse(rows) {
  const iH = rows.findIndex((r) => r.some((c) => String(c).trim() === "Rombel Saat Ini") && r.some((c) => String(c).trim() === "NISN"));
  if (iH < 0) throw new Error("Kolom 'NISN' / 'Rombel Saat Ini' tidak ditemukan. Pakai file unduhan Peserta Didik dari Dapodik.");
  const h1 = rows[iH].map((c) => String(c || "").trim()), h2 = (rows[iH + 1] || []).map((c) => String(c || "").trim());
  const subBaris = h2.some((c) => c === "Pekerjaan");
  const kol = {};
  h1.forEach((a, i) => { const b = subBaris ? h2[i] : ""; const k = /^Data (Ayah|Ibu|Wali)$/.test(a) ? `${a} ${b}` : a; if (k && kol[k] === undefined) kol[k] = i; });
  const ambil = (r, k) => (kol[k] === undefined ? "" : r[kol[k]]);
  const unduh = (rows.slice(0, iH).flat().find((c) => /Tanggal Unduh/i.test(String(c))) || "").toString().replace(/Tanggal Unduh:\s*/i, "");
  const data = rows.slice(iH + (subBaris ? 2 : 1)).filter((r) => _dpkTeks(ambil(r, "Nama"))).map((r) => ({
    nama: _dpkTeks(ambil(r, "Nama")), nis: _dpkTeks(ambil(r, "NIPD")), jk: _dpkTeks(ambil(r, "JK")), nisn: _dpkAngka(ambil(r, "NISN")),
    tempat_lahir: _dpkTeks(ambil(r, "Tempat Lahir")), tanggal_lahir: _dpkTgl(ambil(r, "Tanggal Lahir")), nik: _dpkAngka(ambil(r, "NIK")),
    alamat: [ambil(r, "Alamat"), ambil(r, "Kelurahan"), ambil(r, "Kecamatan")].map(_dpkTeks).filter(Boolean).join(", "),
    hp: _dpkAngka(ambil(r, "HP")), rombel: _dpkTeks(ambil(r, "Rombel Saat Ini")), no_kk: _dpkAngka(ambil(r, "No KK")),
    no_kip: _dpkTeks(ambil(r, "Nomor KIP")), sekolah_asal: _dpkTeks(ambil(r, "Sekolah Asal")),
    nama_ayah: _dpkTeks(ambil(r, "Data Ayah Nama")), pekerjaan_ayah: _dpkTeks(ambil(r, "Data Ayah Pekerjaan")),
    nama_ibu: _dpkTeks(ambil(r, "Data Ibu Nama")), pekerjaan_ibu: _dpkTeks(ambil(r, "Data Ibu Pekerjaan")),
  }));
  return { data, unduh };
}

async function dpkBaca(input) {
  const f = input.files && input.files[0]; input.value = ""; if (!f) return;
  if (!window.XLSX) { toast("Pustaka Excel belum termuat, muat ulang halaman", "err"); return; }
  setGlobalLoading(true, "Membaca data Dapodik…");
  try {
    const wb = XLSX.read(await f.arrayBuffer(), { type: "array", cellDates: true });
    const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1, defval: "", raw: true });
    const { data, unduh } = _dpkParse(rows);
    const cocokCakupan = (r) => DPK.cakupan === "bc" ? /Paket\s*[BC]/i.test(r.rombel) : /Paket\s*[BC]/i.test(r.rombel) && /Putra/i.test(r.rombel);
    const dapodik = data.filter(cocokCakupan);
    if (!dapodik.length) throw new Error("Tidak ada santri Paket B/C" + (DPK.cakupan === "putra" ? " Putra" : "") + " di file ini.");
    await ensureLookups();
    const [aktif, nonaktif] = await Promise.all([apiGetAllSiswa(null), apiGetSiswaNonaktif(null).catch(() => [])]);
    DPK.hasil = _dpkBandingkan(dapodik, aktif, nonaktif);
    DPK.hasil.unduh = unduh; DPK.hasil.namaFile = f.name;
    // simpan ringkasan (tanpa NIK/alamat) untuk tanda di Data Siswa
    const snap = { t: new Date().toISOString(), unduh, cakupan: DPK.cakupan, oleh: STATE.guruNama || "",
      cocok: DPK.hasil.sesuai.concat(DPK.hasil.beda).map((x) => x.app.id), belum: DPK.hasil.belumDapodik.map((s) => s.id), jumlahDapodik: dapodik.length };
    try { await _kvSimpan("dapodik:cek", snap); DPK.snap = snap; } catch (e) { DPK.snap = snap; }
    DPK.tab = DPK.hasil.beda.length ? "beda" : DPK.hasil.belumDapodik.length ? "belum" : DPK.hasil.baru.length ? "baru" : "sesuai";
    _dpkGambar();
    if (STATE.currentPage === "data-siswa") renderDataSiswa();
  } catch (e) { console.error(e); toast(e.message || String(e), "err"); }
  finally { setGlobalLoading(false); }
}

// Bidang yang dibandingkan: [kolom aplikasi, label, cara membandingkan]
const _DPK_BIDANG = [
  ["nama", "Nama", (a, b) => _dpkNama(a) === _dpkNama(b)],
  ["kelas_id", "Kelas", (a, b) => a === b],
  ["nisn", "NISN", (a, b) => _dpkAngka(a) === _dpkAngka(b)],
  ["nik", "NIK", (a, b) => _dpkAngka(a) === _dpkAngka(b)],
  ["nis", "NIS", (a, b) => _dpkTanpaNol(a) === _dpkTanpaNol(b)],
  ["tanggal_lahir", "Tanggal lahir", (a, b) => String(a || "").slice(0, 10) === b],
  ["tempat_lahir", "Tempat lahir", (a, b) => _dpkNama(a) === _dpkNama(b)],
  ["no_kk", "No KK", (a, b) => _dpkAngka(a) === _dpkAngka(b)],
  ["nama_ayah", "Nama ayah", (a, b) => _dpkNama(a) === _dpkNama(b)],
  ["nama_ibu", "Nama ibu", (a, b) => _dpkNama(a) === _dpkNama(b)],
];
function _dpkKelasId(rombel) {
  const no = _dpkKelasNo(rombel); if (!no) return null;
  return (LOOKUP.kelas || []).find((k) => _dpkKelasNo(k.nama_kelas) === no)?.id || null;
}
function _dpkBandingkan(dapodik, aktif, nonaktif) {
  const semua = aktif.map((s) => ({ ...s, _aktif: true })).concat(nonaktif.map((s) => ({ ...s, _aktif: false })));
  const dipakai = new Set(), pasangan = new Map();
  // nama mirip: separuh kata nama yang lebih pendek ada di nama lain (mengatasi salah ketik/singkatan)
  const mirip = (x, y) => { const a = _dpkNama(x).split(" ").filter((w) => w.length > 1), b = _dpkNama(y).split(" ").filter((w) => w.length > 1); if (!a.length || !b.length) return false;
    const [p, q] = a.length <= b.length ? [a, b] : [b, a]; return p.filter((w) => q.some((v) => v === w || (w.length > 3 && (v.startsWith(w) || w.startsWith(v))))).length >= Math.ceil(p.length / 2); };
  const samaId = (s, d) => (d.nisn && _dpkAngka(s.nisn) === d.nisn) || (d.nik && _dpkAngka(s.nik) === d.nik);
  const samaLahir = (s, d) => !s.tanggal_lahir || !d.tanggal_lahir || String(s.tanggal_lahir).slice(0, 10) === d.tanggal_lahir;
  // bertahap: (1) NISN/NIK sama & nama mirip, (2) nama sama & tgl lahir sama, (3) NISN/NIK saja, (4) nama mirip & tgl lahir sama
  const tahap = [
    (s, d) => samaId(s, d) && mirip(s.nama, d.nama),
    (s, d) => _dpkNama(s.nama) === _dpkNama(d.nama) && samaLahir(s, d),
    (s, d) => samaId(s, d),
    (s, d) => mirip(s.nama, d.nama) && s.tanggal_lahir && String(s.tanggal_lahir).slice(0, 10) === d.tanggal_lahir,
  ];
  tahap.forEach((uji) => dapodik.forEach((d) => {
    if (pasangan.has(d)) return;
    const s = semua.find((x) => !dipakai.has(x.id) && uji(x, d));
    if (s) { pasangan.set(d, s); dipakai.add(s.id); }
  }));
  const sesuai = [], beda = [], baru = [];
  dapodik.forEach((d) => {
    d.kelas_id = _dpkKelasId(d.rombel);
    const s = pasangan.get(d);
    if (!s) { baru.push(d); return; }
    const selisih = _DPK_BIDANG.filter(([k, , sama]) => d[k] && !sama(s[k], d[k])).map(([k, label]) => ({ k, label, app: s[k], dpk: d[k] }));
    (selisih.length || !s._aktif ? beda : sesuai).push({ app: s, dpk: d, selisih, nonaktif: !s._aktif });
  });
  // santri aktif di kelas yang tercakup tapi tidak ada di Dapodik
  const kelasCakup = new Set(dapodik.map((d) => d.kelas_id).filter(Boolean));
  const belumDapodik = aktif.filter((s) => !dipakai.has(s.id) && (!s.kelas_id || kelasCakup.has(s.kelas_id)));
  return { sesuai, beda, baru, belumDapodik, total: dapodik.length };
}

function _dpkGambar() {
  const h = DPK.hasil; if (!h) return;
  const tab = DPK.tab || "beda", e = escapeHtml;
  const nk = (id) => (LOOKUP.kelas || []).find((k) => k.id === id)?.nama_kelas || "-";
  const nilaiTampil = (k, v) => (k === "kelas_id" ? nk(v) : k === "tanggal_lahir" && v ? new Date(String(v).slice(0, 10) + "T00:00:00").toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : v) || "—";
  const isi = {
    beda: h.beda.length ? `<div class="dpk-ket">Centang data yang mau disamakan dengan Dapodik, lalu tekan <b>Perbarui</b>. Yang tidak dicentang tidak berubah.</div>
      ${h.beda.map((x, i) => `<div class="dpk-kartu"><div class="dpk-kartu-h"><b>${e(x.app.nama)}</b><span>${e(nk(x.app.kelas_id))}${x.nonaktif ? ` · <i class="dpk-nonaktif">nonaktif / mutasi di aplikasi</i>` : ""}</span></div>
        ${x.selisih.map((s, j) => `<label class="dpk-beda"><input type="checkbox" class="dpk-cek-beda" data-i="${i}" data-j="${j}" ${s.k === "nama" ? "" : "checked"}><span class="dpk-k">${e(s.label)}</span><span class="dpk-a" title="Di aplikasi">${e(nilaiTampil(s.k, s.app))}</span><span class="dpk-panah">→</span><span class="dpk-d" title="Di Dapodik">${e(nilaiTampil(s.k, s.dpk))}</span></label>`).join("")}
        ${x.nonaktif ? `<label class="dpk-beda"><input type="checkbox" class="dpk-cek-aktif" data-i="${i}"><span class="dpk-k">Status</span><span class="dpk-a">nonaktif</span><span class="dpk-panah">→</span><span class="dpk-d">aktifkan kembali</span></label><div class="dpk-catatan">Santri ini sudah dimutasi di aplikasi tapi masih tercatat di Dapodik. Bila memang sudah pindah, keluarkan juga di Dapodik.</div>` : ""}</div>`).join("")}
      <button class="btn btn-accent dpk-aksi" onclick="dpkPerbarui()">🔄 Perbarui data yang dicentang</button>` : `<div class="dpk-kosong">✅ Tidak ada perbedaan data.</div>`,
    belum: h.belumDapodik.length ? `<div class="dpk-ket">Santri berikut <b>ada di aplikasi tapi tidak ditemukan di Dapodik</b> — kemungkinan <b>belum didaftarkan</b> di Dapodik, atau NISN/nama di salah satu tempat berbeda. Perlu ditindaklanjuti operator Dapodik.</div>
      <div class="dpk-daftar">${h.belumDapodik.map((s, i) => `<div class="dpk-baris"><span class="dpk-no">${i + 1}</span><div><b>${e(s.nama)}</b><small>${e(nk(s.kelas_id))} · NISN ${e(s.nisn || "belum ada")} · Lahir ${e(s.tanggal_lahir ? nilaiTampil("tanggal_lahir", s.tanggal_lahir) : "-")}</small></div></div>`).join("")}</div>
      <div class="dpk-aksi-baris"><button class="btn btn-outline" onclick="dpkUnduhBelum()">⬇️ Excel daftar ini</button><button class="btn btn-wa" onclick="dpkWaBelum()">💬 Kirim ke operator (WA)</button></div>` : `<div class="dpk-kosong">✅ Semua santri di aplikasi sudah terdaftar di Dapodik.</div>`,
    baru: h.baru.length ? `<div class="dpk-ket">Santri berikut <b>ada di Dapodik tapi belum ada di Data Siswa</b>. Centang lalu tekan <b>Tambahkan</b> — data diambil dari Dapodik (nama, kelas, NISN, NIK, lahir, orang tua, dsb.).</div>
      <label class="dpk-semua"><input type="checkbox" checked onchange="qsa('.dpk-cek-baru').forEach(c=>c.checked=this.checked)"> Pilih semua</label>
      <div class="dpk-daftar">${h.baru.map((d, i) => `<label class="dpk-baris"><input type="checkbox" class="dpk-cek-baru" data-i="${i}" ${d.kelas_id ? "checked" : "disabled"}><div><b>${e(d.nama)}</b><small>${e(d.rombel)} → ${d.kelas_id ? e(nk(d.kelas_id)) : "<i>kelas tidak ditemukan di aplikasi</i>"} · NISN ${e(d.nisn || "-")}</small></div></label>`).join("")}</div>
      <button class="btn btn-accent dpk-aksi" onclick="dpkTambah()">➕ Tambahkan ke Data Siswa</button>` : `<div class="dpk-kosong">✅ Semua santri Dapodik sudah ada di aplikasi.</div>`,
    sesuai: `<div class="dpk-daftar">${h.sesuai.map((x, i) => `<div class="dpk-baris"><span class="dpk-no">${i + 1}</span><div><b>${e(x.app.nama)}</b><small>${e(nk(x.app.kelas_id))} · NISN ${e(x.app.nisn || "-")}</small></div><span class="dpk-ok">✓</span></div>`).join("") || `<div class="dpk-kosong">Belum ada yang sesuai penuh.</div>`}</div>`,
  };
  openModal(`<div class="dpk">
    <h3>🛡️ Hasil cocokkan Dapodik</h3>
    <div class="dpk-sub">${e(h.namaFile || "")} · data Dapodik ${e(h.unduh || "-")} · ${h.total} santri ${DPK.cakupan === "putra" ? "putra " : ""}Paket B & C</div>
    <div class="dpk-ubin">
      <button class="${tab === "sesuai" ? "on" : ""} ok" onclick="DPK.tab='sesuai';_dpkGambar()"><b>${h.sesuai.length}</b><span>✅ Sesuai</span></button>
      <button class="${tab === "beda" ? "on" : ""} beda" onclick="DPK.tab='beda';_dpkGambar()"><b>${h.beda.length}</b><span>⚠️ Beda data</span></button>
      <button class="${tab === "belum" ? "on" : ""} belum" onclick="DPK.tab='belum';_dpkGambar()"><b>${h.belumDapodik.length}</b><span>🚫 Belum di Dapodik</span></button>
      <button class="${tab === "baru" ? "on" : ""} baru" onclick="DPK.tab='baru';_dpkGambar()"><b>${h.baru.length}</b><span>➕ Belum di aplikasi</span></button>
    </div>
    <div class="dpk-isi">${isi[tab]}</div>
  </div>`, { lebar: true });
}

async function dpkPerbarui() {
  const h = DPK.hasil, ubah = new Map();
  qsa(".dpk-cek-beda:checked").forEach((c) => { const x = h.beda[c.dataset.i], s = x.selisih[c.dataset.j]; const o = ubah.get(x.app.id) || { id: x.app.id }; o[s.k] = s.dpk; ubah.set(x.app.id, o); });
  qsa(".dpk-cek-aktif:checked").forEach((c) => { const x = h.beda[c.dataset.i]; const o = ubah.get(x.app.id) || { id: x.app.id }; o.status_aktif = true; o.tanggal_mutasi = null; ubah.set(x.app.id, o); });
  if (!ubah.size) { toast("Belum ada yang dicentang", "info"); return; }
  if (!(await konfirmasiTema(`Perbarui data <b>${ubah.size} santri</b> sesuai Dapodik?`, { ikon: "🔄", judul: "Samakan dengan Dapodik", teksYa: "Perbarui" }))) { _dpkGambar(); return; }
  let n = 0;
  try { setGlobalLoading(true, "Memperbarui data santri…"); for (const row of ubah.values()) { await apiSimpanSiswa(row); n++; } toast(`🔄 ${n} santri diperbarui sesuai Dapodik`, "ok"); }
  catch (e) { toast(`Diperbarui ${n}, gagal: ${e.message}`, "err"); }
  finally { setGlobalLoading(false); }
  h.beda = h.beda.filter((x) => !ubah.has(x.app.id));
  _dpkGambar(); if (STATE.currentPage === "data-siswa") renderDataSiswa();
}
async function dpkTambah() {
  const h = DPK.hasil;
  const pilih = qsa(".dpk-cek-baru:checked").map((c) => h.baru[c.dataset.i]);
  if (!pilih.length) { toast("Belum ada yang dicentang", "info"); return; }
  if (!(await konfirmasiTema(`Tambahkan <b>${pilih.length} santri</b> dari Dapodik ke Data Siswa?`, { ikon: "➕", judul: "Tambah santri", teksYa: "Tambahkan" }))) { _dpkGambar(); return; }
  let n = 0;
  try {
    setGlobalLoading(true, "Menambahkan santri…");
    for (const d of pilih) {
      await apiSimpanSiswa({ nama: d.nama, kelas_id: d.kelas_id, nis: d.nis, nisn: d.nisn, nik: d.nik, no_kk: d.no_kk, no_kip: d.no_kip,
        tempat_lahir: d.tempat_lahir, tanggal_lahir: d.tanggal_lahir || null, sekolah_asal: d.sekolah_asal, alamat_asal: d.alamat,
        nama_ayah: d.nama_ayah, pekerjaan_ayah: d.pekerjaan_ayah, no_wa_ayah: d.hp, nama_ibu: d.nama_ibu, pekerjaan_ibu: d.pekerjaan_ibu, status_aktif: true });
      n++;
    }
    toast(`➕ ${n} santri ditambahkan ke Data Siswa`, "ok");
  } catch (e) { toast(`Ditambahkan ${n}, gagal: ${e.message}`, "err"); }
  finally { setGlobalLoading(false); }
  const sudah = new Set(pilih.slice(0, n)); h.baru = h.baru.filter((d) => !sudah.has(d));
  _dpkGambar(); if (STATE.currentPage === "data-siswa") renderDataSiswa();
}
function dpkUnduhBelum() {
  const nk = (id) => (LOOKUP.kelas || []).find((k) => k.id === id)?.nama_kelas || "-";
  eksporArraySebagaiExcel(DPK.hasil.belumDapodik.map((s, i) => ({ No: i + 1, Nama: s.nama, Kelas: nk(s.kelas_id), NIS: s.nis || "", NISN: s.nisn || "", NIK: s.nik || "", "Tempat Lahir": s.tempat_lahir || "", "Tanggal Lahir": s.tanggal_lahir || "", "Nama Ayah": s.nama_ayah || "", "Nama Ibu": s.nama_ibu || "" })), "Santri_belum_di_Dapodik", "Belum Dapodik");
}
function dpkWaBelum() {
  const nk = (id) => (LOOKUP.kelas || []).find((k) => k.id === id)?.nama_kelas || "-";
  const teks = `Assalamu'alaikum.\nBerikut santri yang *ada di aplikasi sekolah tetapi belum ditemukan di Dapodik* (cek ${DPK.hasil.unduh || ""}):\n\n${DPK.hasil.belumDapodik.map((s, i) => `${i + 1}. ${s.nama} — ${nk(s.kelas_id)}${s.nisn ? ` (NISN ${s.nisn})` : " (NISN belum ada)"}`).join("\n")}\n\nMohon dicek & didaftarkan. Jazakumullahu khairan.`;
  window.open("https://wa.me/?text=" + encodeURIComponent(teks), "_blank", "noopener");
}

// ── Tanda di Data Siswa (dari pencocokan terakhir) ──
async function dpkMuatSnap() {
  if (DPK.snap !== undefined) return DPK.snap;
  try { DPK.snap = await _kvAmbil("dapodik:cek", null); } catch (e) { DPK.snap = null; }
  return DPK.snap;
}
function dpkTanda(s) {
  const sn = DPK.snap; if (!sn || !s) return "";
  if ((sn.belum || []).includes(s.id)) return `<span class="dpk-tanda belum" title="Tidak ditemukan di Dapodik (cek ${escapeHtml(sn.unduh || "")})">⚠ belum Dapodik</span>`;
  if ((sn.cocok || []).includes(s.id)) return `<span class="dpk-tanda ok" title="Terdaftar di Dapodik">✓ Dapodik</span>`;
  return "";
}
function dpkRingkasHTML() {
  const sn = DPK.snap; if (!_dpkBoleh()) return "";
  if (!sn) return `<div class="card dpk-pita"><span>🛡️</span><div><b>Cocokkan dengan Dapodik</b><small>Unggah file Peserta Didik dari Dapodik untuk mendeteksi santri yang belum terdaftar atau datanya berbeda.</small></div><button class="btn btn-accent btn-sm" onclick="dpkBuka()">Mulai</button></div>`;
  const b = (sn.belum || []).length;
  return `<div class="card dpk-pita ${b ? "ada" : "ok"}"><span>🛡️</span><div><b>Dapodik: ${(sn.cocok || []).length} santri terdaftar${b ? ` · <span class="dpk-merah">${b} belum terdaftar</span>` : " · semua terdaftar ✓"}</b><small>Pencocokan ${new Date(sn.t).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })} · data Dapodik ${escapeHtml(sn.unduh || "-")}</small></div><button class="btn btn-outline btn-sm" onclick="dpkBuka()">🔄 Cocokkan lagi</button></div>`;
}

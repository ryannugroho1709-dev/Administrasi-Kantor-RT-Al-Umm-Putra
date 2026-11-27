// ============================================================
//  📥 IMPOR DATA SISWA & GURU (versi canggih) — menggantikan handleImportSiswa / handleImportGuru
//  • Membaca NIK / KK / NISN / No. WA walau diketik dengan tanda petik (') di Excel, atau berupa angka.
//  • Membaca tanggal (lahir, TMT) dalam format apa pun: tanggal Excel, 03/02/2018, 2018-02-03, "3 Februari 2018".
//  • Judul kolom dikenali luwes (mis. "Nama Lengkap", "No. KK", "Tgl Lahir", "Jenis Kelamin").
//  • SEBELUM disimpan tampil TINJAUAN: data baru, data lama yang diperbarui (kolom apa saja, nilai lama → baru,
//    termasuk yang menimpa isian lama), data yang sama persis, dan baris bermasalah.
//  • Sel kosong di file TIDAK menghapus data lama.
// ============================================================
const IMP = { jenis: "", baris: [], saring: "semua", evt: null, kelas: [] };
const _impE = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const _impKunci = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
const _impNama = (s) => String(s || "").toLowerCase().normalize("NFKD").replace(/[^a-z0-9]/g, "");
const IMP_BULAN = { jan: 1, feb: 2, peb: 2, mar: 3, apr: 4, mei: 5, may: 5, jun: 6, jul: 7, agu: 8, ags: 8, aug: 8, sep: 9, okt: 10, oct: 10, nov: 11, nop: 11, des: 12, dec: 12 };

// Teks bersih dari sel apa pun (angka panjang tidak berubah jadi 6.3E+15, tanda petik dibuang)
function _impTeks(v) {
  if (v == null) return "";
  if (v instanceof Date) return isNaN(v) ? "" : _impIsoDariDate(v);
  if (typeof v === "number") return Number.isInteger(v) ? v.toLocaleString("fullwide", { useGrouping: false }) : String(v);
  return String(v).replace(/[ ​]/g, " ").trim().replace(/^['‘’`"“”]+/, "").replace(/['‘’`"“”]+$/, "").trim();
}
// Nomor (NIK, KK, NISN, WA): hanya angka. Tandai rusak bila Excel sudah mengubahnya jadi notasi E+ / digit hilang.
function _impNomor(v) {
  const t = _impTeks(v); if (!t || t === "-") return { n: "" };
  if (/e\+?\d+$/i.test(t)) return { n: "", rusak: true, asli: t };
  const n = t.replace(/[^0-9]/g, "");
  return { n, ragu: typeof v === "number" && n.length >= 16 };
}
function _impIsoDariDate(d) { const p = (x) => String(x).padStart(2, "0"); return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`; }
// Tanggal apa pun → YYYY-MM-DD (null bila kosong, false bila tidak terbaca)
function _impTanggal(v) {
  if (v == null || v === "") return null;
  if (v instanceof Date) return isNaN(v) ? false : _impIsoDariDate(v);
  if (typeof v === "number") { if (v < 1 || v > 80000) return false; const d = new Date(Math.round((v - 25569) * 86400000)); return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`; }
  let t = _impTeks(v).toLowerCase().replace(/\s+/g, " "); if (!t || t === "-") return null;
  const ok = (y, m, d) => { y = Number(y); m = Number(m); d = Number(d); if (y < 100) y += y > 40 ? 1900 : 2000; const dt = new Date(y, m - 1, d); return dt.getMonth() === m - 1 && dt.getDate() === d && y > 1900 && y < 2100 ? `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}` : false; };
  let m = t.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/); if (m) return ok(m[1], m[2], m[3]);
  m = t.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})$/); if (m) return ok(m[3], m[2], m[1]);
  if (/^\d{5}$/.test(t)) return _impTanggal(Number(t));
  m = t.match(/^(\d{1,2})[ -]+([a-z]+)\.?[ -,]+(\d{2,4})$/); if (m) { const b = IMP_BULAN[m[2].slice(0, 3)]; return b ? ok(m[3], b, m[1]) : false; }
  m = t.match(/^([a-z]+)\.? (\d{1,2}),? (\d{4})$/); if (m) { const b = IMP_BULAN[m[1].slice(0, 3)]; return b ? ok(m[3], b, m[2]) : false; }
  return false;
}
// Ambil nilai kolom dari baris berdasarkan beberapa kemungkinan nama judul
function _impAmbil(r, nama) { for (const n of nama) if (r[n] !== undefined && r[n] !== "") return r[n]; return ""; }
function _impBaca(file) {
  return file.arrayBuffer().then((buf) => {
    const wb = XLSX.read(buf, { type: "array" });
    let rows = [];
    wb.SheetNames.forEach((sn) => {
      const json = XLSX.utils.sheet_to_json(wb.Sheets[sn], { defval: "", raw: true });
      rows = rows.concat(json.map((o) => { const h = { _sheet: sn }; for (const k in o) h[_impKunci(k)] = o[k]; return h; }));
    });
    return rows;
  });
}
const _impTTL = (s) => { const t = _impTeks(s); const i = t.indexOf(","); return i < 0 ? { tempat: t, tgl: null } : { tempat: t.slice(0, i).trim(), tgl: _impTanggal(t.slice(i + 1).trim()) }; };
const IMP_JK = (v) => { const t = _impKunci(_impTeks(v)); return /^(l|lk|laki|lakilaki|pria|ikhwan|putra)$/.test(t) ? "L" : /^(p|pr|perempuan|wanita|akhwat|putri)$/.test(t) ? "P" : ""; };

// ════════ SISWA ════════
const IMP_S = {
  nama: ["nama", "namalengkap", "namasiswa", "namasantri", "namapesertadidik"], kelas: ["kelas", "rombel", "rombelsaatini", "tingkat"], program: ["program", "paket"], angkatan: ["angkatan", "tahunmasuk"],
  tempat_lahir: ["tempatlahir", "tmplahir", "tempat"], tanggal_lahir: ["tanggallahir", "tgllahir", "tgllhr", "tanggallhr"], ttl: ["ttl", "tempattanggallahir", "tempattgllahir"],
  nis: ["nis", "noinduk", "nomorinduk", "nipd"], nisn: ["nisn"], nik: ["nik", "noktp", "nomorindukkependudukan", "niksiswa"], no_kk: ["kk", "nokk", "nomorkk", "nokartukeluarga", "nomorkartukeluarga"],
  no_bpjs: ["bpjs", "nobpjs"], no_kip: ["kip", "nokip"], sekolah_asal: ["sekolahasal", "asalsekolah"], alamat_asal: ["alamatasal", "alamat", "alamatrumah"],
  nama_ayah: ["namaayah", "ayah"], pekerjaan_ayah: ["pekerjaanayah"], no_wa_ayah: ["waayah", "nowaayah", "hpayah", "nohpayah"],
  nama_ibu: ["namaibu", "ibu", "namaibukandung"], pekerjaan_ibu: ["pekerjaanibu"], no_wa_ibu: ["waibu", "nowaibu", "hpibu", "nohpibu"],
  jk: ["jk", "jeniskelamin", "lp", "kelamin"],
};
const IMP_S_LABEL = { nama: "Nama", kelas_id: "Kelas", angkatan: "Angkatan", tempat_lahir: "Tempat Lahir", tanggal_lahir: "Tanggal Lahir", nis: "No. Induk", nisn: "NISN", nik: "NIK", no_kk: "No. KK", no_bpjs: "No. BPJS", no_kip: "No. KIP", sekolah_asal: "Sekolah Asal", alamat_asal: "Alamat", nama_ayah: "Nama Ayah", pekerjaan_ayah: "Pekerjaan Ayah", no_wa_ayah: "WA Ayah", nama_ibu: "Nama Ibu", pekerjaan_ibu: "Pekerjaan Ibu", no_wa_ibu: "WA Ibu", jk: "Jenis Kelamin" };
const IMP_NOMOR_S = ["nik", "no_kk", "nisn", "no_bpjs", "no_kip", "no_wa_ayah", "no_wa_ibu"];

async function handleImportSiswa(evt) {
  const file = evt.target.files[0]; if (!file) return; IMP.evt = evt;
  try {
    setGlobalLoading(true, "Membaca file…");
    const [rows, lama, kelas] = await Promise.all([_impBaca(file), supa.from("siswa").select("*").then(unwrap), supa.from("kelas").select("id,nama_kelas").then(unwrap)]);
    IMP.kelas = kelas;
    const kKelas = (n) => (typeof _normNamaKelasCocok === "function" ? _normNamaKelasCocok(n) : _impKunci(n));
    const cariKelas = (n) => kelas.find((k) => kKelas(k.nama_kelas) === kKelas(n));
    const hasil = [], sudah = new Map();
    rows.forEach((r, i) => {
      const nama = _impTeks(_impAmbil(r, IMP_S.nama)); if (!nama) return;
      const b = { no: i + 2, sheet: r._sheet, nama, data: {}, peringatan: [], salah: [] };
      ["angkatan", "nis", "tempat_lahir", "sekolah_asal", "alamat_asal", "nama_ayah", "pekerjaan_ayah", "nama_ibu", "pekerjaan_ibu"].forEach((f) => { const v = _impTeks(_impAmbil(r, IMP_S[f])); if (v && v !== "-") b.data[f] = v; });
      IMP_NOMOR_S.forEach((f) => { const x = _impNomor(_impAmbil(r, IMP_S[f])); if (x.rusak) b.salah.push(`${IMP_S_LABEL[f]} rusak di Excel (${x.asli}) — ketik ulang sebagai teks`); else if (x.n) { b.data[f] = x.n; if (x.ragu) b.peringatan.push(`${IMP_S_LABEL[f]} tersimpan sebagai ANGKA di Excel, digit terakhir bisa berubah jadi 0 — cek lagi`); } });
      const ttl = _impAmbil(r, IMP_S.ttl);
      if (ttl && !b.data.tempat_lahir) { const p = _impTTL(ttl); if (p.tempat) b.data.tempat_lahir = p.tempat; if (p.tgl) b.data.tanggal_lahir = p.tgl; }
      const tl = _impAmbil(r, IMP_S.tanggal_lahir);
      if (tl !== "") { const d = _impTanggal(tl); if (d) b.data.tanggal_lahir = d; else if (d === false) b.peringatan.push(`Tanggal lahir "${_impTeks(tl)}" tidak terbaca — dilewati`); }
      const jk = IMP_JK(_impAmbil(r, IMP_S.jk)); if (jk) b.jk = jk;
      const kn = _impTeks(_impAmbil(r, IMP_S.kelas));
      if (kn) { const nk = typeof normalisasiNamaKelas === "function" ? normalisasiNamaKelas(kn) : kn, k = cariKelas(nk); b.kelasNama = nk; if (k) b.data.kelas_id = k.id; else { b.kelasBaru = nk; b.peringatan.push(`Kelas "${nk}" belum ada — akan dibuat`); } b.program = _impTeks(_impAmbil(r, IMP_S.program)); }
      if (b.data.nik && b.data.nik.length !== 16) b.peringatan.push(`NIK ${b.data.nik.length} digit (seharusnya 16)`);
      if (b.data.no_kk && b.data.no_kk.length !== 16) b.peringatan.push(`No. KK ${b.data.no_kk.length} digit (seharusnya 16)`);
      if (b.data.nisn && b.data.nisn.length !== 10) b.peringatan.push(`NISN ${b.data.nisn.length} digit (seharusnya 10)`);
      // cocokkan dengan data lama: NIK → NISN → No. Induk → nama
      b.lama = (b.data.nik && b.data.nik.length >= 10 && lama.find((s) => String(s.nik || "").replace(/\D/g, "") === b.data.nik))
        || (b.data.nisn && lama.find((s) => String(s.nisn || "").replace(/\D/g, "") === b.data.nisn))
        || (b.data.nis && lama.find((s) => String(s.nis || "").trim() === b.data.nis && _impNama(s.nama).slice(0, 4) === _impNama(nama).slice(0, 4)))
        || lama.find((s) => _impNama(s.nama) === _impNama(nama)) || null;
      const kunciDup = b.data.nik || _impNama(nama);
      if (sudah.has(kunciDup)) { b.salah.push(`Ganda dengan baris ${sudah.get(kunciDup)} di file — dilewati`); } else sudah.set(kunciDup, b.no);
      if (!b.lama) b.data.nama = nama;
      _impBandingkan(b, IMP_S_LABEL, (f, v) => (f === "kelas_id" ? (kelas.find((k) => k.id === v) || {}).nama_kelas || "—" : v));
      if (b.kelasBaru && b.lama) b.ubah.push({ f: "kelas_id", l: "Kelas", lama: (kelas.find((k) => k.id === b.lama.kelas_id) || {}).nama_kelas || "", baru: b.kelasBaru + " (baru)" });
      hasil.push(b);
    });
    if (!hasil.length) { toast("Tidak ada baris bernama di file ini. Pastikan ada kolom Nama.", "err"); evt.target.value = ""; return; }
    IMP.jenis = "siswa"; IMP.baris = hasil; IMP.saring = "semua"; _impTinjau();
  } catch (e) { console.error(e); toast("Gagal membaca file: " + (e.message || e), "err"); evt.target.value = ""; }
  finally { setGlobalLoading(false); }
}

// ════════ GURU ════════
const IMP_G = {
  nama: ["nama", "namalengkap", "namaguru", "namaptk", "namagtk"], nip_nik: ["nipnik", "nik", "nip", "noktp", "niknip"], jabatan: ["jabatan", "jabatanptk", "tugas"],
  jenis: ["jenis", "jenisguru", "status", "statuskepegawaian", "jenisptk"], no_wa: ["nowa", "wa", "nohp", "hp", "telepon", "notelepon", "nowhatsapp", "nohpwa"], email: ["email", "surel", "alamatemail"],
  tempat_lahir: ["tempatlahir", "tmplahir"], tanggal_lahir: ["tanggallahir", "tgllahir"], ttl: ["ttl", "tempattanggallahir"], tmt: ["tmt", "tmttugas", "mulaibertugas", "tanggalmulaitugas", "tmtpengangkatan"],
  alamat_domisili: ["alamat", "alamatdomisili", "alamatrumah"], pendidikan: ["pendidikan", "jenjangpendidikan", "pendidikanterakhir"], sekolah: ["namasekolahkuliah", "namasekolah", "namakampus", "institusi", "namainstitusi"],
};
const IMP_G_LABEL = { nama: "Nama", nip_nik: "NIK / NIP", jabatan: "Jabatan", jenis_guru: "Jenis Guru", no_wa: "No. WA", email: "Email", tempat_lahir: "Tempat Lahir", tanggal_lahir: "Tanggal Lahir", tmt: "TMT", alamat_domisili: "Alamat" };
const _impJenisGuru = (s) => { const t = String(s || "").toLowerCase(); return !t ? "" : /sukarela/.test(t) ? "sukarelawan" : /afiliasi/.test(t) ? "afiliasi" : /ekskul|ekstra/.test(t) ? "ekskul" : /luar/.test(t) ? "luar" : "dalam"; };

async function handleImportGuru(evt) {
  const file = evt.target.files[0]; if (!file) return; IMP.evt = evt;
  try {
    setGlobalLoading(true, "Membaca file…");
    const [rows, lama] = await Promise.all([_impBaca(file), supa.from("guru").select("id,nama,nip_nik,jenis_guru,jabatan,no_wa,email,tempat_lahir,tanggal_lahir,tmt,alamat_domisili,status_aktif").then(unwrap)]);
    const kel = new Map(); // satu guru bisa muncul di beberapa baris (riwayat pendidikan)
    rows.forEach((r, i) => {
      const nama = _impTeks(_impAmbil(r, IMP_G.nama)); if (!nama) return;
      const kk = _impNama(nama);
      let b = kel.get(kk);
      if (!b) {
        b = { no: i + 2, sheet: r._sheet, nama, data: {}, peringatan: [], salah: [], pend: [] }; kel.set(kk, b);
        ["jabatan", "email", "tempat_lahir", "alamat_domisili"].forEach((f) => { const v = _impTeks(_impAmbil(r, IMP_G[f])); if (v && v !== "-") b.data[f] = v; });
        const nk = _impNomor(_impAmbil(r, IMP_G.nip_nik)); if (nk.rusak) b.salah.push(`NIK/NIP rusak di Excel (${nk.asli}) — ketik ulang sebagai teks`); else if (nk.n) { b.data.nip_nik = nk.n; if (nk.ragu) b.peringatan.push("NIK/NIP tersimpan sebagai ANGKA di Excel, digit terakhir bisa berubah jadi 0 — cek lagi"); }
        const wa = _impNomor(_impAmbil(r, IMP_G.no_wa)); if (wa.n) b.data.no_wa = wa.n.replace(/^0/, "62");
        const jn = _impJenisGuru(_impTeks(_impAmbil(r, IMP_G.jenis))); if (jn) b.data.jenis_guru = jn;
        const ttl = _impAmbil(r, IMP_G.ttl);
        if (ttl && !b.data.tempat_lahir) { const p = _impTTL(ttl); if (p.tempat) b.data.tempat_lahir = p.tempat; if (p.tgl) b.data.tanggal_lahir = p.tgl; else if (p.tgl === false) b.peringatan.push("Tanggal pada TTL tidak terbaca — dilewati"); }
        [["tanggal_lahir", "Tanggal lahir"], ["tmt", "TMT"]].forEach(([f, l]) => { const v = _impAmbil(r, IMP_G[f]); if (v === "") return; const d = _impTanggal(v); if (d) b.data[f] = d; else if (d === false) b.peringatan.push(`${l} "${_impTeks(v)}" tidak terbaca — dilewati`); });
        if (b.data.nip_nik && ![16, 18].includes(b.data.nip_nik.length)) b.peringatan.push(`NIK/NIP ${b.data.nip_nik.length} digit (NIK 16, NIP 18)`);
        b.lama = (b.data.nip_nik && b.data.nip_nik.length >= 10 && lama.find((g) => String(g.nip_nik || "").replace(/\D/g, "") === b.data.nip_nik)) || lama.find((g) => _impNama(g.nama) === kk) || null;
        if (!b.lama) b.data.nama = nama;
      }
      const pj = _impTeks(_impAmbil(r, IMP_G.pendidikan)), ps = _impTeks(_impAmbil(r, IMP_G.sekolah));
      if (pj || ps) b.pend.push({ jenjang: pj || "-", nama_institusi: ps || "-" });
    });
    const hasil = [...kel.values()];
    hasil.forEach((b) => { _impBandingkan(b, IMP_G_LABEL, (f, v) => (f === "jenis_guru" ? ({ dalam: "Guru Dalam", luar: "Guru Luar", afiliasi: "Afiliasi", sukarelawan: "Sukarelawan", ekskul: "Ekskul" })[v] || v : v));
      if (b.lama && b.lama.status_aktif === false) b.peringatan.push("Guru ini berstatus NONAKTIF di aplikasi"); if (b.pend.length) b.catatan = `Riwayat pendidikan: ${b.pend.length} baris${b.lama ? " (mengganti yang lama)" : ""}`; });
    if (!hasil.length) { toast("Tidak ada baris bernama di file ini. Pastikan ada kolom Nama.", "err"); evt.target.value = ""; return; }
    IMP.jenis = "guru"; IMP.baris = hasil; IMP.saring = "semua"; _impTinjau();
  } catch (e) { console.error(e); toast("Gagal membaca file: " + (e.message || e), "err"); evt.target.value = ""; }
  finally { setGlobalLoading(false); }
}

// ════════ Perbandingan & Tinjauan ════════
function _impBandingkan(b, label, tampil) {
  b.ubah = [];
  if (b.salah.length) { b.status = "salah"; return; }
  if (!b.lama) { b.status = "baru"; return; }
  Object.entries(b.data).forEach(([f, v]) => {
    const l = b.lama[f], ls = l == null ? "" : String(l).slice(0, f.includes("tanggal") || f === "tmt" ? 10 : 9999);
    const sama = IMP_NOMOR_S.includes(f) || f === "nip_nik" || f === "no_wa" ? ls.replace(/\D/g, "") === String(v) : ls.trim().toLowerCase() === String(v).trim().toLowerCase();
    if (!sama) b.ubah.push({ f, l: label[f] || f, lama: ls ? tampil(f, ls) : "", baru: tampil(f, v) });
  });
  b.status = b.ubah.length || (b.pend && b.pend.length) ? "ubah" : "sama";
}
function _impTinjau() {
  const B = IMP.baris, n = (s) => B.filter((b) => b.status === s).length, timpa = B.filter((b) => b.ubah && b.ubah.some((u) => u.lama)).length;
  const sg = IMP.saring, d = B.filter((b) => sg === "semua" || b.status === sg || (sg === "timpa" && b.ubah && b.ubah.some((u) => u.lama)) || (sg === "catat" && b.peringatan.length));
  const nmJ = IMP.jenis === "siswa" ? "Santri" : "Guru", st = { baru: ["Baru", "#16a34a"], ubah: ["Diperbarui", "#2563eb"], sama: ["Sama", "#64748b"], salah: ["Dilewati", "#dc2626"] };
  let el = document.getElementById("imp-lapis");
  if (!el) { el = document.createElement("div"); el.id = "imp-lapis"; document.body.appendChild(el); }
  el.innerHTML = `<div class="imp-kotak bk2" style="--bk:#8a5523">
    <div class="bk2-hero"><div><small>📥 TINJAUAN IMPOR DATA ${nmJ.toUpperCase()}</small><h2>Periksa Dulu Sebelum Disimpan</h2><p>Belum ada data yang tersimpan. Sel yang kosong di file tidak menghapus data lama.</p></div>
      ${typeof _biAngka === "function" ? _biAngka([["catat", "Baris", B.length], ["aktif", "Baru", n("baru")], ["l", "Diperbarui", n("ubah")], ["lulus", "Sama", n("sama")], ["keluar", "Dilewati", n("salah")]]) : ""}</div>
    ${timpa ? `<div class="imp-awas">⚠️ <b>${timpa} ${nmJ.toLowerCase()}</b> punya isian lama yang akan <b>ditimpa</b> nilai baru dari file (ditandai jingga). Cek dulu sebelum menyimpan.</div>` : ""}
    <div class="bk2-alat"><div class="bk2-chip">${[["semua", "Semua", "#475569"], ["baru", "Baru", "#16a34a"], ["ubah", "Diperbarui", "#2563eb"], ["timpa", "Menimpa Data Lama", "#ea580c"], ["catat", "Ada Catatan", "#d97706"], ["sama", "Sama", "#64748b"], ["salah", "Dilewati", "#dc2626"]].map(([k, l, w]) => `<button class="${sg === k ? "on" : ""}" style="--cw:${w}" onclick="IMP.saring='${k}';_impTinjau()">${l}</button>`).join("")}</div><span class="bk2-jml">${d.length} baris</span></div>
    <div class="imp-daftar">${d.map((b) => `<div class="imp-baris s-${b.status}"><div class="imp-kiri"><small>Baris ${b.no}${IMP.jenis === "siswa" && b.sheet ? " · " + _impE(b.sheet) : ""}</small><b>${_impE(b.nama)}</b>
        ${b.lama && _impNama(b.lama.nama) !== _impNama(b.nama) ? `<small>Cocok dengan: ${_impE(b.lama.nama)}</small>` : ""}<em class="bk2-st" style="background:${st[b.status][1]}1a;color:${st[b.status][1]}">${st[b.status][0]}</em></div>
      <div class="imp-kanan">${b.status === "baru" ? `<div class="imp-isi">${Object.entries(b.data).filter(([f]) => f !== "nama").map(([f, v]) => `<span><small>${_impE((IMP.jenis === "siswa" ? IMP_S_LABEL : IMP_G_LABEL)[f] || f)}</small>${_impE(f === "kelas_id" ? b.kelasNama : f === "jenis_guru" ? v : v)}</span>`).join("")}${b.kelasBaru ? `<span><small>Kelas</small>${_impE(b.kelasBaru)}</span>` : ""}</div>` : ""}
        ${b.ubah && b.ubah.length ? `<div class="imp-ubah">${b.ubah.map((u) => `<div class="${u.lama ? "timpa" : ""}"><small>${_impE(u.l)}</small><span>${u.lama ? `<s>${_impE(u.lama)}</s> → ` : `<i>kosong</i> → `}<b>${_impE(u.baru)}</b></span></div>`).join("")}</div>` : ""}
        ${b.status === "sama" ? `<span class="redup">Tidak ada perubahan</span>` : ""}
        ${b.catatan ? `<div class="imp-cat">📚 ${_impE(b.catatan)}</div>` : ""}${b.jk ? `<div class="imp-cat">Jenis kelamin: ${b.jk === "P" ? "Perempuan" : "Laki-laki"}</div>` : ""}
        ${[...b.salah.map((x) => `<div class="imp-salah">⛔ ${_impE(x)}</div>`), ...b.peringatan.map((x) => `<div class="imp-catat">⚠️ ${_impE(x)}</div>`)].join("")}</div></div>`).join("") || `<div class="bk2-kosong">Tidak ada baris.</div>`}</div>
    <div class="imp-aksi"><button class="bk2-btn" onclick="_impTutup()">Batal</button><button class="bk2-btn utama" onclick="_impSimpan()" ${n("baru") + n("ubah") ? "" : "disabled"}>💾 Simpan ${n("baru")} Baru & ${n("ubah")} Perubahan</button></div></div>`;
  if (typeof _biHitungNaik === "function" && !IMP._anim) { IMP._anim = 1; _biHitungNaik(el); }
}
function _impTutup() { const el = document.getElementById("imp-lapis"); if (el) el.remove(); IMP._anim = 0; if (IMP.evt) IMP.evt.target.value = ""; }
async function _impSimpan() {
  const B = IMP.baris.filter((b) => b.status === "baru" || b.status === "ubah"); if (!B.length) return;
  setGlobalLoading(true, "Menyimpan…");
  let baru = 0, ubah = 0; const gagal = [];
  try {
    if (IMP.jenis === "siswa") {
      for (const b of B) if (b.kelasBaru) { try { b.data.kelas_id = await cariAtauBuatKelas(b.kelasBaru); } catch (e) {} }
      for (const b of B) if (b.program && b.data.kelas_id) { try { await supa.from("kelas").update({ program: b.program }).eq("id", b.data.kelas_id).is("program", null); } catch (e) {} }
      const ins = B.filter((b) => b.status === "baru");
      for (let i = 0; i < ins.length; i += 100) {
        const part = ins.slice(i, i + 100), r = await supa.from("siswa").insert(part.map((b) => b.data)).select("id,nama");
        if (r.error) { part.forEach((b) => gagal.push(b.nama + ": " + r.error.message)); continue; }
        baru += r.data.length; r.data.forEach((s, j) => { if (part[j]) part[j].idBaru = s.id; });
      }
      for (const b of B.filter((x) => x.status === "ubah")) {
        const p = Object.fromEntries(b.ubah.filter((u) => u.f in b.data).map((u) => [u.f, b.data[u.f]]));
        if (!Object.keys(p).length) continue;
        const r = await supa.from("siswa").update(p).eq("id", b.lama.id); if (r.error) gagal.push(b.nama + ": " + r.error.message); else ubah++;
      }
      // Jenis kelamin disimpan di isian tambahan Buku Induk
      if (typeof _bspGabungUmum === "function") for (const b of B) { const id = b.lama ? b.lama.id : b.idBaru; if (b.jk && id) { try { await _bspGabungUmum(`bosp:induk:${STATE.ruang}:${id}`, { jk: b.jk }); } catch (e) {} } }
    } else {
      for (const b of B) {
        let id = b.lama && b.lama.id;
        if (!id) { const r = await supa.from("guru").insert(b.data).select("id"); if (r.error) { gagal.push(b.nama + ": " + r.error.message); continue; } id = r.data[0].id; baru++; }
        else { const p = Object.fromEntries(b.ubah.map((u) => [u.f, b.data[u.f]])); if (Object.keys(p).length) { const r = await supa.from("guru").update(p).eq("id", id); if (r.error) { gagal.push(b.nama + ": " + r.error.message); continue; } } ubah++; }
        if (b.pend.length) { await supa.from("guru_pendidikan").delete().eq("guru_id", id); await supa.from("guru_pendidikan").insert(b.pend.map((p, i) => ({ guru_id: id, ...p, urutan: i }))); }
      }
    }
  } catch (e) { gagal.push(e.message || String(e)); }
  finally { setGlobalLoading(false); }
  _impTutup();
  if (typeof _rgLog === "function") _rgLog("impor-" + IMP.jenis, { baru, ubah, gagal: gagal.length });
  if (gagal.length) openModal(`<h3>📥 Impor Selesai Sebagian</h3><p>${baru} baru, ${ubah} diperbarui. ${gagal.length} gagal:</p><ul style="font-size:12.5px;max-height:240px;overflow:auto">${gagal.map((g) => `<li>${_impE(g)}</li>`).join("")}</ul>`);
  else toast(`Impor berhasil: ${baru} ${IMP.jenis === "siswa" ? "santri" : "guru"} baru, ${ubah} diperbarui ✓`, "ok");
  LOOKUP_LOADED = false;
  if (IMP.jenis === "siswa") { if (typeof renderDataSiswa === "function") renderDataSiswa(); }
  else { try { STATE.daftarGuru = await apiGetDaftarGuru(); } catch (e) {} if (typeof renderDataGuru === "function") renderDataGuru(); }
}

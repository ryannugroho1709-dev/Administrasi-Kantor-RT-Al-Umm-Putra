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
const IMP_BULAN = { jan: 1, feb: 2, peb: 2, mar: 3, apr: 4, mei: 5, may: 5, jun: 6, jul: 7, agu: 8, ags: 8, agt: 8, aug: 8, sep: 9, okt: 10, oct: 10, nov: 11, nop: 11, des: 12, dec: 12 };

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
  if (typeof v === "number") { if (v < 1 || v > 80000 || (Number.isInteger(v) && v >= 1900 && v <= 2100)) return false; /* 1900–2100 = hanya tahun, bukan tanggal */ const d = new Date(Math.round((v - 25569) * 86400000)); return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`; }
  let t = _impTeks(v).toLowerCase().replace(/\s+/g, " "); if (!t || t === "-") return null;
  t = t.replace(/^(senin|selasa|rabu|kamis|jum'?at|sabtu|minggu|ahad)\W+/, "").replace(/(\d)[ t]\d{1,2}[:.]\d{2}([:.]\d{2})?.*$/, "$1").trim(); // buang nama hari & jam
  const ok = (y, m, d) => { y = Number(y); m = Number(m); d = Number(d); if (y < 100) y += y > 40 ? 1900 : 2000; const dt = new Date(y, m - 1, d); return dt.getMonth() === m - 1 && dt.getDate() === d && y > 1900 && y < 2100 ? `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}` : false; };
  let m = t.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/); if (m) return ok(m[1], m[2], m[3]);
  m = t.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})$/); if (m) return ok(m[3], m[2], m[1]) || ok(m[3], m[1], m[2]); // hari/bulan; kalau mustahil coba bulan/hari
  if (/^\d{5}$/.test(t)) return _impTanggal(Number(t));
  m = t.match(/^(\d{1,2})[ -]+([a-z]+)\.?[ -,]+(\d{2,4})$/); if (m) { const b = IMP_BULAN[m[2].slice(0, 3)]; return b ? ok(m[3], b, m[1]) : false; }
  m = t.match(/^([a-z]+)\.? (\d{1,2}),? (\d{4})$/); if (m) { const b = IMP_BULAN[m[1].slice(0, 3)]; return b ? ok(m[3], b, m[2]) : false; }
  return false;
}
// Ambil nilai kolom dari baris berdasarkan beberapa kemungkinan nama judul.
// Isi daftar: teks = judul persis (sesudah dirapikan), RegExp = pola judul (dicoba sesudah semua judul persis).
function _impAmbil(r, nama) {
  for (const n of nama) if (typeof n === "string" && r[n] !== undefined && r[n] !== "" && r[n] != null) return r[n];
  for (const n of nama) if (n instanceof RegExp) for (const k in r) if (k[0] !== "_" && n.test(k) && r[k] !== "" && r[k] != null) return r[k];
  return "";
}
const _impCocokJudul = (k, daftar) => !!k && daftar.some((n) => (typeof n === "string" ? n === k : n.test(k)));
const _impEkst = (f) => (String((f && f.name) || "").toLowerCase().match(/\.([a-z0-9]+)$/) || [])[1] || "";
function _impSkrip(url) {
  if (typeof _ujeMuatSkrip === "function") return _ujeMuatSkrip(url);
  return new Promise((ok, no) => { const s = document.createElement("script"); s.src = url; s.onload = ok; s.onerror = () => no(new Error("Gagal memuat alat pembaca (periksa internet)")); document.head.appendChild(s); });
}

// Berkas apa pun → daftar tabel [{ sheet, rows: [[sel, sel, …], …] }]
async function _impGrid(file, peta) {
  const ext = _impEkst(file), tipe = String(file.type || "");
  if (ext === "pdf" || tipe === "application/pdf") return _impGridPdf(file, peta);
  if (ext === "docx" || /wordprocessingml/.test(tipe)) return _impGridDocx(file);
  if (ext === "doc" || tipe === "application/msword") throw new Error("Format Word lama (.doc) belum bisa dibaca. Buka di Word lalu Simpan Sebagai .docx atau .pdf, kemudian unggah lagi.");
  if (/^(jpe?g|png|webp|heic|heif|gif|bmp)$/.test(ext) || /^image\//.test(tipe)) throw new Error("Foto/gambar tidak bisa dibaca sebagai tabel data (NIK dan tanggal bisa salah baca). Kirim file Excel, CSV, PDF hasil ekspor/unduhan, atau Word (.docx) berisi tabel.");
  if (!window.XLSX) throw new Error("Pembaca Excel belum termuat — periksa internet lalu muat ulang halaman.");
  const buf = await file.arrayBuffer();
  let wb;
  try {
    if (["csv", "txt", "tsv"].includes(ext) || /^text\//.test(tipe)) {
      let teks = new TextDecoder("utf-8").decode(buf);
      if (teks.includes("�")) teks = new TextDecoder("windows-1252").decode(buf);
      wb = XLSX.read(teks.replace(/^﻿/, ""), { type: "string", raw: true }); // raw: NIK tetap teks, tidak jadi angka
    } else wb = XLSX.read(buf, { type: "array" });
  } catch (e) {
    const p = String(e.message || e);
    if (/password|encrypt/i.test(p)) throw new Error("File Excel ini dikunci kata sandi. Buka di Excel, hapus kata sandinya, simpan, lalu unggah lagi.");
    throw new Error("File tidak dikenali sebagai Excel/CSV (" + p + "). Coba buka lalu Simpan Sebagai .xlsx.");
  }
  return wb.SheetNames.map((sn) => ({ sheet: sn, rows: XLSX.utils.sheet_to_json(wb.Sheets[sn], { header: 1, defval: "", raw: true, blankrows: true }) }));
}

// Tabel di dokumen Word (.docx)
async function _impGridDocx(file) {
  if (!window.JSZip) await _impSkrip("https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js");
  const zip = await JSZip.loadAsync(await file.arrayBuffer()), f = zip.file("word/document.xml");
  if (!f) throw new Error("Isi dokumen Word tidak terbaca.");
  const doc = new DOMParser().parseFromString(await f.async("string"), "application/xml"), W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main";
  const anak = (el, nm) => [...el.children].filter((e) => e.localName === nm);
  const tabel = [...doc.getElementsByTagNameNS(W, "tbl")].map((t, i) => ({
    sheet: "Tabel " + (i + 1),
    rows: anak(t, "tr").map((tr) => {
      const sel = [];
      anak(tr, "tc").forEach((tc) => {
        const teks = [...tc.getElementsByTagNameNS(W, "p")].map((p) => [...p.getElementsByTagNameNS(W, "t")].map((x) => x.textContent).join("")).filter(Boolean).join(" ");
        const gs = tc.getElementsByTagNameNS(W, "gridSpan")[0], span = Number((gs && gs.getAttributeNS(W, "val")) || (gs && gs.getAttribute("w:val")) || 1);
        sel.push(teks); for (let s = 1; s < span; s++) sel.push("");
      });
      return sel;
    }),
  }));
  if (!tabel.length) throw new Error("Dokumen Word ini tidak berisi tabel. Data harus dalam bentuk tabel (kolom Nama, NIK, dst.).");
  return tabel;
}

// Tabel di PDF (PDF hasil ekspor Excel/Dapodik/aplikasi — bukan hasil scan).
// Tulisan dikelompokkan per garis, lalu tiap potongan dimasukkan ke kolom berdasarkan posisi judul kolom.
async function _impGridPdf(file, peta) {
  if (!window.pdfjsLib) throw new Error("Pembaca PDF belum termuat — periksa internet lalu muat ulang halaman.");
  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
  const semuaAlias = Object.values(peta).flat();
  let kol = null, judul = null, huruf = 0; const hasil = [];
  for (let p = 1; p <= pdf.numPages; p++) {
    if (typeof setGlobalLoading === "function") setGlobalLoading(true, `Membaca PDF halaman ${p}/${pdf.numPages}…`);
    const tc = await (await pdf.getPage(p)).getTextContent();
    const it = tc.items.filter((x) => x.str && x.str.trim()).map((x) => ({ s: x.str.replace(/\s+/g, " ").trim(), x: x.transform[4], y: x.transform[5], w: x.width || 0, h: Math.abs(x.transform[3]) || 8 }));
    huruf += it.reduce((a, x) => a + x.s.length, 0);
    it.sort((a, b) => b.y - a.y || a.x - b.x);
    const garis = [];
    it.forEach((x) => { const g = garis[garis.length - 1]; if (g && Math.abs(g.y - x.y) <= Math.max(2, x.h * 0.45)) g.it.push(x); else garis.push({ y: x.y, h: x.h, it: [x] }); });
    garis.forEach((g) => g.it.sort((a, b) => a.x - b.x));
    // potongan berdekatan digabung (satu sel)
    const potong = (g) => { const out = []; g.it.forEach((x) => { const t = out[out.length - 1]; if (t && x.x - t.x1 < Math.max(1.5, x.h * 0.3)) { t.s += (x.x - t.x1 > 0.6 ? " " : "") + x.s; t.x1 = x.x + x.w; } else out.push({ s: x.s, x0: x.x, x1: x.x + x.w }); }); return out; };
    // cari garis judul di halaman ini (kalau tidak ada, pakai posisi kolom halaman sebelumnya)
    let iJ = -1, skor = 0;
    garis.forEach((g, i) => { const ks = potong(g).map((c) => _impKunci(c.s)); if (!ks.some((k) => _impCocokJudul(k, peta.nama))) return; const s = ks.filter((k) => _impCocokJudul(k, semuaAlias)).length; if (s > skor) { skor = s; iJ = i; } });
    if (iJ >= 0) { const ps = potong(garis[iJ]); kol = ps.map((c) => ({ x0: c.x0, x1: c.x1 })); judul = ps.map((c) => c.s); }
    if (!kol) continue;
    const batas = kol.slice(0, -1).map((c, j) => (c.x1 + kol[j + 1].x0) / 2);
    const keKol = (x) => { let j = 0; while (j < batas.length && x >= batas[j]) j++; return j; };
    const rows = [judul.slice()]; let prev = { sel: rows[0], y: iJ >= 0 ? garis[iJ].y : null, h: 8 };
    garis.slice(iJ + 1).forEach((g) => {
      const sel = judul.map(() => "");
      g.it.forEach((x) => { const j = keKol(x.x + x.w / 2); sel[j] = sel[j] ? sel[j] + (/\d$/.test(sel[j]) && /^\d/.test(x.s) ? "" : " ") + x.s : x.s; });
      const isi = sel.filter(Boolean).length, dekat = prev.y != null && prev.y - g.y <= Math.max(prev.h, g.h) * 1.7;
      // sambungan baris: isi sel yang terlipat jadi 2 baris (kolom pertama kosong, letaknya rapat dengan baris sebelumnya)
      if (!sel[0] && dekat && isi < Math.max(2, judul.length / 2)) { sel.forEach((v, j) => { if (v) prev.sel[j] = prev.sel[j] ? prev.sel[j] + " " + v : v; }); prev.y = g.y; return; }
      rows.push(sel); prev = { sel, y: g.y, h: g.h };
    });
    hasil.push({ sheet: "Halaman " + p, rows });
  }
  if (huruf < 30) throw new Error("PDF ini hasil scan/foto (tidak berisi tulisan yang bisa disalin), jadi tidak bisa dibaca otomatis. Kirim versi Excel-nya, atau PDF yang diekspor langsung dari Excel/Dapodik.");
  if (!hasil.length) throw new Error("Tabel di PDF ini tidak punya judul kolom 'Nama' yang terbaca. Pastikan PDF berisi tabel dengan baris judul (Nama, NIK, Tanggal Lahir, …).");
  return hasil;
}

// Cari baris judul (tidak harus baris pertama — file Dapodik punya beberapa baris judul laporan dulu),
// dukung judul 2 tingkat (mis. "Data Ayah" → "Nama | Pekerjaan"), lalu ubah tiap baris jadi objek { judulrapi: nilai }.
function _impKeObjek(grids, peta) {
  const semuaAlias = Object.values(peta).flat(), out = [], info = [];
  grids.forEach(({ sheet, rows }) => {
    let iH = -1, skor = 0;
    for (let i = 0; i < Math.min(rows.length, 40); i++) {
      const ks = (rows[i] || []).map((c) => _impKunci(_impTeks(c)));
      if (!ks.some((k) => _impCocokJudul(k, peta.nama))) continue;
      const s = new Set(ks.filter((k) => _impCocokJudul(k, semuaAlias))).size;
      if (s > skor) { skor = s; iH = i; }
    }
    if (iH < 0) { const awal = rows.find((r) => (r || []).some((c) => _impTeks(c))); if (awal) info.push(`${sheet}: ${awal.map(_impTeks).filter(Boolean).slice(0, 6).join(", ")}`); return; }
    const h1 = rows[iH].map((c) => _impTeks(c)), nx = rows[iH + 1] || [];
    const iNama = h1.findIndex((c) => _impCocokJudul(_impKunci(c), peta.nama));
    const sub = nx.filter((c) => _impTeks(c)).length >= 2 && !_impTeks(nx[iNama]) && h1.some((c, j) => !c && _impTeks(nx[j]));
    const lebar = Math.max(h1.length, sub ? nx.length : 0);
    let induk = "";
    const kunci = Array.from({ length: lebar }, (_, j) => { const c = h1[j] || ""; if (c) induk = c; const s = sub ? _impTeks(nx[j]) : ""; return _impKunci(s ? (c || induk) + " " + s : c); });
    const judulNama = _impKunci(h1[iNama]);
    for (let i = iH + (sub ? 2 : 1); i < rows.length; i++) {
      const r = rows[i] || [];
      if (_impKunci(_impTeks(r[iNama])) === judulNama) continue; // judul kolom yang diulang (tiap halaman)
      const o = { _sheet: sheet, _baris: i + 1 };
      kunci.forEach((k, j) => { if (k && (o[k] === undefined || o[k] === "")) o[k] = r[j] === undefined ? "" : r[j]; });
      out.push(o);
    }
  });
  out.info = info;
  return out;
}
async function _impBaca(file, peta) {
  const rows = _impKeObjek(await _impGrid(file, peta), peta);
  if (!rows.length) throw new Error("Judul kolom tidak dikenali. Tabel harus punya baris judul berisi kolom Nama (juga NIK, Tanggal Lahir, dst.)." + (rows.info.length ? " Isi awal file: " + rows.info.join(" · ") : ""));
  return rows;
}
// NIK 16 digit: digit ke-7–12 = tanggal lahir DDMMYY (perempuan: tanggal + 40). true/false = cocok/tidak, null = tidak bisa dicek
function _impNikTgl(nik, tgl) {
  const n = String(nik || "").replace(/\D/g, ""); if (n.length !== 16 || !tgl) return null;
  const d = +n.slice(6, 8), m = +n.slice(8, 10), y = +n.slice(10, 12), [Y, M, D] = String(tgl).slice(0, 10).split("-").map(Number);
  if (!Y || m < 1 || m > 12) return null;
  return Y % 100 === y && M === m && (D === d || D === d - 40);
}
const _impNikTglTeks = (nik) => { const n = String(nik).replace(/\D/g, ""), d = +n.slice(6, 8); if (d < 1 || d > 71 || (d > 31 && d < 41)) return `angka tanggal ${n.slice(6, 8)} tidak wajar`; return `${String(d > 40 ? d - 40 : d).padStart(2, "0")}-${n.slice(8, 10)}-${n.slice(10, 12)}`; };
const _impTglTampil = (t) => (t ? t.slice(8, 10) + "-" + t.slice(5, 7) + "-" + t.slice(0, 4) : "");
const _impTanpaGelar =(s) => String(s || "").split(",")[0].replace(/^(drs?|dr|hj?|ust(adz|adzah|adzah)?|ustd?z?)\.?\s+/i, "").trim();
const _impWa = (n) => (n.startsWith("0") ? "62" + n.slice(1) : n.startsWith("8") ? "62" + n : n);
// Rombel dari ruang lain (file Dapodik berisi semua rombel PKBM) — jangan ikut diimpor ke ruang ini
function _impRuangLain(kn) {
  const t = String(kn || "").toLowerCase(), R = typeof STATE !== "undefined" ? STATE.ruang : "";
  const a = /pake[tr]\s*a\b/.test(t), bc = /pake[tr]\s*[bc]\b/.test(t), pa = /\bputra\b/.test(t), pi = /\bputri\b/.test(t);
  if (R === "A") return bc || pa || pi;
  if (R === "Pa") return a || pi;
  if (R === "Pi") return a || pa;
  return false;
}
const _impTTL = (s) => { const t = _impTeks(s); const i = t.indexOf(","); return i < 0 ? { tempat: t, tgl: null } : { tempat: t.slice(0, i).trim(), tgl: _impTanggal(t.slice(i + 1).trim()) }; };
const IMP_JK = (v) => { const t = _impKunci(_impTeks(v)); return /^(l|lk|laki|lakilaki|pria|ikhwan|putra)$/.test(t) ? "L" : /^(p|pr|perempuan|wanita|akhwat|putri)$/.test(t) ? "P" : ""; };

// ════════ SISWA ════════
const IMP_S = {
  nama: ["nama", "namalengkap", "namasiswa", "namasantri", "namapesertadidik", "namapd", "namamurid", /^nama(lengkap)?(siswa|santri|pesertadidik|murid|pd)$/], kelas: ["kelas", "rombel", "rombelsaatini", "tingkat", "kelassaatini", /^(kelas|rombel)/], program: ["program", "paket"], angkatan: ["angkatan", "tahunmasuk"],
  tempat_lahir: ["tempatlahir", "tmplahir", "tempat", "tempatlhr"], tanggal_lahir: ["tanggallahir", "tgllahir", "tgllhr", "tanggallhr", /^(tanggal|tgl)(lahir|lhr)(siswa|santri|pd)?$/], ttl: ["ttl", "tempattanggallahir", "tempattgllahir", "tempatdantanggallahir", /^ttl/, /^tempat(dan)?(tanggal|tgl)lahir/],
  nis: ["nis", "noinduk", "nomorinduk", "nipd", "nomorindukpesertadidik", "nonis", /^(no|nomor)?(induk|nis)(siswa|santri)?$/], nisn: ["nisn", /^(no|nomor)?nisn/], nik: ["nik", "noktp", "nomorindukkependudukan", "niksiswa", "nonik", "nomornik", /^(no|nomor)?nik(siswa|santri|pd|pesertadidik|ktp)?$/, /^nik\d*digit$/], no_kk: ["kk", "nokk", "nomorkk", "nokartukeluarga", "nomorkartukeluarga", /^(no|nomor)?(kk|kartukeluarga)$/],
  no_bpjs: ["bpjs", "nobpjs", "nomorbpjs", "nokis"], no_kip: ["kip", "nokip", "nomorkip"], sekolah_asal: ["sekolahasal", "asalsekolah", /^(sekolah)?asalsekolah|^sekolahasal/], alamat_asal: ["alamatasal", "alamat", "alamatrumah", "alamatjalan", /^alamat/],
  nama_ayah: ["namaayah", "ayah", "dataayahnama", "namaayahkandung"], pekerjaan_ayah: ["pekerjaanayah", "dataayahpekerjaan"], no_wa_ayah: ["waayah", "nowaayah", "hpayah", "nohpayah", "dataayahhp"],
  nama_ibu: ["namaibu", "ibu", "namaibukandung", "dataibunama"], pekerjaan_ibu: ["pekerjaanibu", "dataibupekerjaan"], no_wa_ibu: ["waibu", "nowaibu", "hpibu", "nohpibu", "dataibuhp"],
  jk: ["jk", "jeniskelamin", "lp", "kelamin", "jeniskel"],
};
const IMP_S_LABEL = { nama: "Nama", kelas_id: "Kelas", angkatan: "Angkatan", tempat_lahir: "Tempat Lahir", tanggal_lahir: "Tanggal Lahir", nis: "No. Induk", nisn: "NISN", nik: "NIK", no_kk: "No. KK", no_bpjs: "No. BPJS", no_kip: "No. KIP", sekolah_asal: "Sekolah Asal", alamat_asal: "Alamat", nama_ayah: "Nama Ayah", pekerjaan_ayah: "Pekerjaan Ayah", no_wa_ayah: "WA Ayah", nama_ibu: "Nama Ibu", pekerjaan_ibu: "Pekerjaan Ibu", no_wa_ibu: "WA Ibu", jk: "Jenis Kelamin" };
const IMP_NOMOR_S = ["nik", "no_kk", "nisn", "no_bpjs", "no_kip", "no_wa_ayah", "no_wa_ibu"];

async function handleImportSiswa(evt) {
  const file = evt.target.files[0]; if (!file) return; IMP.evt = evt;
  try {
    setGlobalLoading(true, "Membaca file…");
    const [rows, lama, kelas] = await Promise.all([_impBaca(file, IMP_S), supa.from("siswa").select("*").then(unwrap), supa.from("kelas").select("id,nama_kelas").then(unwrap)]);
    IMP.kelas = kelas; IMP.lain = 0;
    const kKelas = (n) => (typeof _normNamaKelasCocok === "function" ? _normNamaKelasCocok(n) : _impKunci(n));
    // "Paket B Kelas 7 Putra" (Dapodik) → cocok dengan kelas "Kelas 7" di aplikasi
    const tanpaPaket = (n) => String(n || "").replace(/\bpake[tr]\s*[abc]\b/i, "").replace(/\b(putra|putri)\b/i, "").replace(/\s+/g, " ").trim();
    const cariKelas = (n) => kelas.find((k) => kKelas(k.nama_kelas) === kKelas(n)) || kelas.find((k) => kKelas(tanpaPaket(k.nama_kelas)) === kKelas(tanpaPaket(n)));
    const hasil = [], sudah = new Map();
    rows.forEach((r) => {
      const nama = _impTeks(_impAmbil(r, IMP_S.nama)); if (!nama) return;
      const knAwal = _impTeks(_impAmbil(r, IMP_S.kelas));
      if (knAwal && _impRuangLain(knAwal)) { IMP.lain++; return; }
      const b = { no: r._baris, sheet: r._sheet, nama, data: {}, peringatan: [], salah: [] };
      ["angkatan", "nis", "tempat_lahir", "sekolah_asal", "alamat_asal", "nama_ayah", "pekerjaan_ayah", "nama_ibu", "pekerjaan_ibu"].forEach((f) => { const v = _impTeks(_impAmbil(r, IMP_S[f])); if (v && v !== "-") b.data[f] = v; });
      IMP_NOMOR_S.forEach((f) => { const x = _impNomor(_impAmbil(r, IMP_S[f])); if (x.rusak) b.salah.push(`${IMP_S_LABEL[f]} rusak di Excel (${x.asli}) — ketik ulang sebagai teks`); else if (x.n) { b.data[f] = x.n; if (x.ragu) b.peringatan.push(`${IMP_S_LABEL[f]} tersimpan sebagai ANGKA di Excel, digit terakhir bisa berubah jadi 0 — cek lagi`); } });
      const ttl = _impAmbil(r, IMP_S.ttl);
      if (ttl && !b.data.tempat_lahir) { const p = _impTTL(ttl); if (p.tempat) b.data.tempat_lahir = p.tempat; if (p.tgl) b.data.tanggal_lahir = p.tgl; }
      const tl = _impAmbil(r, IMP_S.tanggal_lahir);
      if (tl !== "") { const d = _impTanggal(tl); if (d) b.data.tanggal_lahir = d; else if (d === false) b.peringatan.push(`Tanggal lahir "${_impTeks(tl)}" tidak terbaca — dilewati`); }
      const jk = IMP_JK(_impAmbil(r, IMP_S.jk)); if (jk) b.jk = jk;
      const kn = _impTeks(_impAmbil(r, IMP_S.kelas));
      if (kn) { const nk = typeof normalisasiNamaKelas === "function" ? normalisasiNamaKelas(kn) : kn, k = cariKelas(nk); b.kelasNama = k ? k.nama_kelas : nk; if (k) b.data.kelas_id = k.id; else { b.kelasBaru = nk; b.peringatan.push(`Kelas "${nk}" belum ada — akan dibuat`); } b.program = _impTeks(_impAmbil(r, IMP_S.program)); }
      if (b.data.nik && b.data.nik.length !== 16) b.peringatan.push(`NIK ${b.data.nik.length} digit (seharusnya 16)`);
      if (b.data.no_kk && b.data.no_kk.length !== 16) b.peringatan.push(`No. KK ${b.data.no_kk.length} digit (seharusnya 16)`);
      if (b.data.nisn && b.data.nisn.length !== 10) b.peringatan.push(`NISN ${b.data.nisn.length} digit (seharusnya 10)`);
      // Ganda di file: nama sama → dilewati. NIK sama tapi NAMA BEDA → kemungkinan salah salin NIK: santri tetap masuk, NIK-nya tidak dipakai.
      const kNama = _impNama(nama);
      if (sudah.has("n:" + kNama)) {
        const s0 = sudah.get("n:" + kNama);
        if (s0.sheet !== b.sheet) return; // santri yang sama di lembar lain (mis. lembar "Semua" + lembar per kelas) — cukup sekali
        b.salah.push(`Ganda dengan baris ${s0.no} di file — dilewati`);
      } else sudah.set("n:" + kNama, { no: b.no, sheet: b.sheet });
      if (b.data.nik && b.data.tanggal_lahir && _impNikTgl(b.data.nik, b.data.tanggal_lahir) === false) b.nikTakCocok = true;
      hasil.push(b);
    });
    // NIK yang sama untuk santri BERBEDA di file (biasanya kolom NIK tergeser saat menyalin):
    // NIK diberikan ke santri yang tanggal lahirnya cocok dengan NIK; santri lain tidak diisi NIK-nya + diberi catatan.
    const grupNik = new Map();
    hasil.forEach((b) => { if (b.data.nik && !b.salah.length) (grupNik.get(b.data.nik) || grupNik.set(b.data.nik, []).get(b.data.nik)).push(b); });
    grupNik.forEach((g, nik) => {
      if (new Set(g.map((b) => _impNama(b.nama))).size < 2) return;
      const cocok = g.filter((b) => !b.nikTakCocok && b.data.tanggal_lahir), pemilik = cocok.length === 1 ? cocok[0] : g[0];
      g.forEach((b) => { if (b === pemilik) return; b.peringatan.push(`NIK ${nik} sama dengan ${pemilik.nama} (baris ${pemilik.no}${pemilik.sheet !== b.sheet ? ", " + pemilik.sheet : ""})${cocok.length === 1 ? " yang tanggal lahirnya cocok dengan NIK" : ""} — NIK santri ini tidak diisi, cek lagi di file`); delete b.data.nik; b.nikTakCocok = false; });
    });
    hasil.forEach((b) => {
      const nama = b.nama, kNama = _impNama(nama);
      if (b.nikTakCocok && b.data.nik) b.peringatan.push(`NIK ${b.data.nik} tidak cocok dengan tanggal lahir ${_impTglTampil(b.data.tanggal_lahir)} (menurut NIK: ${_impNikTglTeks(b.data.nik)}) — cek salah satunya`);
      // cocokkan dengan data lama: NIK → NISN → No. Induk → nama. NIK/NISN hanya dipakai bila namanya mirip (cegah menimpa santri lain).
      const mirip = (s) => { const kata = (x) => new Set(String(x || "").toLowerCase().normalize("NFKD").replace(/[^a-z\s]/g, " ").replace(/\b(muhammad|muhamad|mohammad|moh|muh|m)\b/g, "").split(/\s+/).filter((w) => w.length >= 3)); const a = kata(s.nama), c = kata(nama); return [...c].some((w) => a.has(w)) || !a.size || !c.size; };
      b.lama = (b.data.nik && b.data.nik.length >= 10 && lama.find((s) => String(s.nik || "").replace(/\D/g, "") === b.data.nik && mirip(s)))
        || (b.data.nisn && lama.find((s) => String(s.nisn || "").replace(/\D/g, "") === b.data.nisn && mirip(s)))
        || (b.data.nis && lama.find((s) => String(s.nis || "").trim() === b.data.nis && _impNama(s.nama).slice(0, 4) === kNama.slice(0, 4)))
        || lama.find((s) => _impNama(s.nama) === kNama) || null;
      if (b.lama && b.data.nik) { const lain = lama.find((s) => s.id !== b.lama.id && String(s.nik || "").replace(/\D/g, "") === b.data.nik); if (lain) { b.peringatan.push(`NIK ${b.data.nik} sudah dipakai ${lain.nama} di aplikasi — NIK tidak diubah, cek lagi`); delete b.data.nik; } }
      else if (!b.lama && b.data.nik) { const lain = lama.find((s) => String(s.nik || "").replace(/\D/g, "") === b.data.nik); if (lain) { b.peringatan.push(`NIK ${b.data.nik} sudah dipakai ${lain.nama} di aplikasi — NIK tidak diisi, cek lagi`); delete b.data.nik; } }
      if (!b.lama) b.data.nama = nama;
      _impBandingkan(b, IMP_S_LABEL, (f, v) => (f === "kelas_id" ? (kelas.find((k) => k.id === v) || {}).nama_kelas || "—" : v));
      if (b.kelasBaru && b.lama) b.ubah.push({ f: "kelas_id", l: "Kelas", lama: (kelas.find((k) => k.id === b.lama.kelas_id) || {}).nama_kelas || "", baru: b.kelasBaru + " (baru)" });
    });
    if (!hasil.length) { toast(IMP.lain ? `Semua ${IMP.lain} santri di file ini milik ruang lain (lihat kolom rombel). Pindah ke ruangnya dulu lalu impor lagi.` : "Tidak ada baris bernama di file ini. Pastikan ada kolom Nama.", "err"); evt.target.value = ""; return; }
    IMP.jenis = "siswa"; IMP.baris = hasil; IMP.saring = "semua"; _impTinjau();
  } catch (e) { console.error(e); toast("Gagal membaca file: " + (e.message || e), "err"); evt.target.value = ""; }
  finally { setGlobalLoading(false); }
}

// ════════ GURU ════════
const IMP_G = {
  nama: ["nama", "namalengkap", "namaguru", "namaptk", "namagtk", "namatutor", "namapegawai", "namaustadz", "namaustadzah", /^nama(lengkap)?(guru|ptk|gtk|tutor|pegawai|pendidik|ustadz|ustadzah|asatidzah)$/],
  nip_nik: ["nipnik", "nik", "nip", "noktp", "niknip", "nonik", "nomornik", "nikktp", /^(no|nomor)?(nik|nip)(?!d)/, /^nomorindukkependudukan/],
  jabatan: ["jabatan", "jabatanptk", "tugas", "tugastambahan", /^jabatan/],
  jenis: ["jenis", "jenisguru", "status", "statuskepegawaian", "jenisptk", "statusguru"],
  no_wa: ["nowa", "wa", "nohp", "hp", "telepon", "notelepon", "nowhatsapp", "nohpwa", "whatsapp", "notelp", "telp", /^(no|nomor)?(hp|wa|telp|telepon|whatsapp|handphone)/],
  email: ["email", "surel", "alamatemail", /e?mail/],
  tempat_lahir: ["tempatlahir", "tmplahir", "tempatlhr"], tanggal_lahir: ["tanggallahir", "tgllahir", "tgllhr", "tanggallhr", /^(tanggal|tgl)(lahir|lhr)/],
  ttl: ["ttl", "tempattanggallahir", "tempattgllahir", "tempatdantanggallahir", /^ttl/, /^tempat(dan)?(tanggal|tgl)lahir/],
  tmt: ["tmt", "tmttugas", "mulaibertugas", "tanggalmulaitugas", "tmtpengangkatan", "tmtmengajar", /^tmt/, /mulai(mengajar|bertugas|tugas|bekerja|kerja|aktif)/, /^(tanggal|tgl)(masuk|mulai|bergabung|gabung|aktif)/],
  alamat_domisili: ["alamat", "alamatdomisili", "alamatrumah", "alamatjalan", /^alamat/], pendidikan: ["pendidikan", "jenjangpendidikan", "pendidikanterakhir", /^(jenjang)?pendidikan(terakhir)?$/],
  sekolah: ["namasekolahkuliah", "namasekolah", "namakampus", "institusi", "namainstitusi", "namalembagapendidikan", "lembagapendidikan", "perguruantinggi", /lembaga|institusi|kampus|perguruan|universitas/],
};
const IMP_G_LABEL = { nama: "Nama", nip_nik: "NIK / NIP", jabatan: "Jabatan", jenis_guru: "Jenis Guru", no_wa: "No. WA", email: "Email", tempat_lahir: "Tempat Lahir", tanggal_lahir: "Tanggal Lahir", tmt: "TMT", alamat_domisili: "Alamat" };
// Hanya kata yang jelas yang dipakai. Isian lain (mis. "PTY", "Guru Honor") TIDAK mengubah jenis guru di aplikasi.
const _impJenisGuru = (s) => { const t = String(s || "").toLowerCase(); return !t ? "" : /sukarela/.test(t) ? "sukarelawan" : /afiliasi/.test(t) ? "afiliasi" : /ekskul|ekstra/.test(t) ? "ekskul" : /\bluar\b/.test(t) ? "luar" : /\bdalam\b/.test(t) ? "dalam" : ""; };

async function handleImportGuru(evt) {
  const file = evt.target.files[0]; if (!file) return; IMP.evt = evt;
  try {
    setGlobalLoading(true, "Membaca file…");
    const [rows, lama] = await Promise.all([_impBaca(file, IMP_G), supa.from("guru").select("id,nama,nip_nik,jenis_guru,jabatan,no_wa,email,tempat_lahir,tanggal_lahir,tmt,alamat_domisili,status_aktif").then(unwrap)]);
    const kel = new Map(); // satu guru bisa muncul di beberapa baris (riwayat pendidikan)
    rows.forEach((r) => {
      const nama = _impTeks(_impAmbil(r, IMP_G.nama)); if (!nama) return;
      const kk = _impNama(nama);
      let b = kel.get(kk);
      if (!b) { b = { no: r._baris, sheet: r._sheet, nama, data: {}, peringatan: [], salah: [], pend: [] }; kel.set(kk, b); }
      // Isian diambil dari baris mana pun milik guru ini (baris pertama yang berisi), jadi NIK/TMT di baris ke-2 tetap terbaca
      const D = b.data;
      ["jabatan", "email", "tempat_lahir", "alamat_domisili"].forEach((f) => { const v = _impTeks(_impAmbil(r, IMP_G[f])); if (v && v !== "-" && !D[f]) D[f] = v; });
      if (!D.nip_nik) { const nk = _impNomor(_impAmbil(r, IMP_G.nip_nik)); if (nk.rusak) b.salah.push(`NIK/NIP rusak di Excel (${nk.asli}) — ketik ulang sebagai teks`); else if (nk.n) { D.nip_nik = nk.n; if (nk.ragu) b.peringatan.push("NIK/NIP tersimpan sebagai ANGKA di Excel, digit terakhir bisa berubah jadi 0 — cek lagi"); } }
      if (!D.no_wa) { const wa = _impNomor(_impAmbil(r, IMP_G.no_wa)); if (wa.n && wa.n.length >= 9) D.no_wa = _impWa(wa.n); }
      if (!D.jenis_guru) { const jn = _impJenisGuru(_impTeks(_impAmbil(r, IMP_G.jenis))); if (jn) D.jenis_guru = jn; }
      const ttl = _impAmbil(r, IMP_G.ttl);
      if (ttl && (!D.tempat_lahir || !D.tanggal_lahir)) { const p = _impTTL(ttl); if (p.tempat && !D.tempat_lahir) D.tempat_lahir = p.tempat; if (p.tgl && !D.tanggal_lahir) D.tanggal_lahir = p.tgl; else if (p.tgl === false) b.peringatan.push("Tanggal pada TTL tidak terbaca — dilewati"); }
      [["tanggal_lahir", "Tanggal lahir"], ["tmt", "TMT"]].forEach(([f, l]) => { if (D[f]) return; const v = _impAmbil(r, IMP_G[f]); if (v === "") return; const d = _impTanggal(v); if (d) D[f] = d; else if (d === false) b.peringatan.push(`${l} "${_impTeks(v)}" tidak terbaca${/^\d{4}$/.test(_impTeks(v)) ? " (hanya tahun — isi tanggal lengkapnya)" : ""} — dilewati`); });
      const pj = _impTeks(_impAmbil(r, IMP_G.pendidikan)), ps = _impTeks(_impAmbil(r, IMP_G.sekolah));
      if (pj || ps) b.pend.push({ jenjang: pj || "-", nama_institusi: ps || "-" });
    });
    const hasil = [...kel.values()];
    hasil.forEach((b) => {
      const kk = _impNama(b.nama);
      if (b.data.tmt) b.peringatan = b.peringatan.filter((x) => !x.startsWith("TMT "));
      if (b.data.tanggal_lahir) b.peringatan = b.peringatan.filter((x) => !x.startsWith("Tanggal lahir ") && !x.startsWith("Tanggal pada TTL"));
      if (b.data.nip_nik) b.salah = b.salah.filter((x) => !x.startsWith("NIK/NIP rusak"));
      b.peringatan = [...new Set(b.peringatan)]; b.salah = [...new Set(b.salah)];
      if (b.data.nip_nik && ![16, 18].includes(b.data.nip_nik.length)) b.peringatan.push(`NIK/NIP ${b.data.nip_nik.length} digit (NIK 16, NIP 18)`);
      if (_impNikTgl(b.data.nip_nik, b.data.tanggal_lahir) === false) b.peringatan.push(`NIK ${b.data.nip_nik} tidak cocok dengan tanggal lahir ${_impTglTampil(b.data.tanggal_lahir)} (menurut NIK: ${_impNikTglTeks(b.data.nip_nik)}) — cek salah satunya`);
      // nama tanpa gelar ("Alfian Widyananda, S.Pd" = "Alfian Widyananda, S.P") — dipakai hanya bila cocoknya tunggal
      const inti = _impNama(_impTanpaGelar(b.nama)), calon = lama.filter((g) => _impNama(_impTanpaGelar(g.nama)) === inti);
      // Catatan guru bisa GANDA (salinan lama berstatus kosong/nonaktif). Selalu utamakan catatan yang AKTIF —
      // dulu NIK dicocokkan lebih dulu sehingga data masuk ke salinan, dan catatan aktif tetap kosong.
      const viaNik = b.data.nip_nik && b.data.nip_nik.length >= 10 ? lama.filter((g) => String(g.nip_nik || "").replace(/\D/g, "") === b.data.nip_nik) : [];
      const viaNama = lama.filter((g) => _impNama(g.nama) === kk), satuInti = inti.length >= 4 && new Set(calon.map((g) => _impNama(g.nama))).size === 1 ? calon : [];
      const semuaCocok = [...new Set([...viaNik, ...viaNama, ...satuInti])], aktif = semuaCocok.filter((g) => g.status_aktif === true);
      b.lama = (aktif.length ? aktif.find((g) => viaNik.includes(g)) || aktif.find((g) => viaNama.includes(g)) || aktif[0] : null) || viaNik[0] || viaNama[0] || (satuInti.length === 1 ? satuInti[0] : null) || null;
      if (b.lama && semuaCocok.length > 1) b.peringatan.push(`Guru ini tercatat ${semuaCocok.length} kali di aplikasi (ada salinan ganda) — data dimasukkan ke catatan yang ${b.lama.status_aktif === true ? "aktif" : "pertama"}`);
      if (!b.lama) b.data.nama = b.nama;
    });
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
    ${IMP.jenis === "siswa" && IMP.lain ? `<div class="imp-awas" style="background:#eff6ff;border-color:#bfdbfe;color:#1e3a8a">ℹ️ <b>${IMP.lain} santri</b> di file ini milik rombel ruang lain, jadi tidak ikut diimpor ke ruang ini.</div>` : ""}
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

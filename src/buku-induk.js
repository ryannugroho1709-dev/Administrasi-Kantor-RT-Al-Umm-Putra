// ============================================================
//  BUKU INDUK, BUKU KLAPER & PENCARIAN CEPAT — Ruang Pengelola → Data
//  • Buku Induk: semua peserta didik (aktif, mutasi, lulus) per jenjang, urut No. Induk; Lembar Buku Induk
//    per santri (A. Keterangan diri, B. Tempat tinggal, C. Pendidikan sebelumnya, D. Orang tua, E. Wali,
//    F. Perkembangan/meninggalkan sekolah) + cek kelengkapan + cetak + unduh Excel.
//    Isian yang belum ada di Data Siswa (jenis kelamin, agama, anak ke-, wali, dll.) disimpan per santri di
//    kv "bosp:induk:<ruang>:<siswaId>" (satu baris per santri → hemat kuota).
//  • Buku Klaper: daftar abjad A–Z per jenjang (nama, No. Induk, NISN, JK, tahun masuk, keadaan), cetak & Excel.
//  • Pencarian Cepat: satu kotak cari nama / NIK / NISN / No. Induk / HP → santri, alumni, guru sekaligus.
// ============================================================
const BI = { siswa: null, kelas: [], tambah: {}, guru: null, t: 0, f: { rg: "Pa", status: "aktif", cari: "" }, k: { rg: "Pa", status: "semua" }, q: "" };
const _biE = (s) => escapeHtml(s == null ? "" : String(s));
const _biTgl = (d) => (d ? new Date(d + (String(d).length === 10 ? "T00:00:00" : "")).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "");
const BI_RG = ["A", "Pa", "Pi"];
const _biNamaRg = (r) => ({ A: "Paket A", Pa: "Paket B & C Putra", Pi: "Paket B & C Putri" }[r] || r);
const biBolehUbah = () => (typeof isAdmin === "function" && isAdmin()) || (typeof rgAkses === "function" && rgAkses("Pg") === "U");

async function biMuat(paksa) {
  if (BI.siswa && !paksa && Date.now() - BI.t < 120000) return;
  const [s, k, t] = await Promise.all([
    supaSemua.from("siswa").select("id,nama,nis,nisn,nik,no_kk,no_bpjs,no_kip,tempat_lahir,tanggal_lahir,angkatan,status_aktif,tanggal_mutasi,alasan_mutasi,nama_ayah,pekerjaan_ayah,nama_ibu,pekerjaan_ibu,no_wa_ayah,no_wa_ibu,alamat_asal,sekolah_asal,kelas_id,ruang_id,foto_url,created_at").order("nama"),
    supaSemua.from("kelas").select("id,nama_kelas,ruang_id"),
    supaSemua.from("kuliah_pengaturan").select("kunci,nilai").eq("ruang_id", "*").like("kunci", "bosp:induk:%"),
  ]);
  if (s.error) throw s.error;
  BI.kelas = k.data || [];
  const kl = Object.fromEntries(BI.kelas.map((x) => [x.id, x.nama_kelas]));
  BI.siswa = (s.data || []).filter((x) => BI_RG.includes(x.ruang_id)).map((x) => ({ ...x, kelas: kl[x.kelas_id] || "" }));
  BI.tambah = {}; (t.data || []).forEach((r) => { const id = r.kunci.split(":").pop(); BI.tambah[id] = r.nilai || {}; });
  BI.t = Date.now();
}
// Jenis kelamin: isian Buku Induk → NIK (tanggal +40 = perempuan) → jenjang (Putra/Putri)
function biJk(x) {
  const t = BI.tambah[x.id] || {}; if (t.jk) return t.jk;
  const nik = String(x.nik || "").replace(/\D/g, ""); if (nik.length === 16) return +nik.slice(6, 8) > 40 ? "P" : "L";
  return x.ruang_id === "Pa" ? "L" : x.ruang_id === "Pi" ? "P" : "";
}
function biKeadaan(x) {
  if (x.status_aktif !== false) return { kode: "aktif", teks: x.kelas ? (typeof formatKelasLabel === "function" ? formatKelasLabel(x.kelas) : x.kelas) : "Aktif (belum berkelas)" };
  if (/lulus|tamat/i.test(x.alasan_mutasi || "")) return { kode: "lulus", teks: `Lulus ${x.tanggal_mutasi ? new Date(x.tanggal_mutasi).getFullYear() : ""}`.trim() };
  return { kode: "mutasi", teks: `Keluar ${x.tanggal_mutasi ? _biTgl(String(x.tanggal_mutasi).slice(0, 10)) : ""}`.trim() };
}
const biTahunMasuk = (x) => { const t = BI.tambah[x.id] || {}; return (t.tgl_diterima || "").slice(0, 4) || String(x.angkatan || "").match(/\d{4}/)?.[0] || (x.created_at || "").slice(0, 4); };
// Isian wajib Buku Induk → hitung kelengkapan
const BI_WAJIB = [["nis", "No. Induk"], ["nisn", "NISN"], ["nik", "NIK"], ["tempat_lahir", "Tempat lahir"], ["tanggal_lahir", "Tanggal lahir"], ["t:jk", "Jenis kelamin"], ["t:agama", "Agama"], ["alamat_asal", "Alamat"], ["nama_ayah", "Nama ayah"], ["nama_ibu", "Nama ibu"], ["sekolah_asal", "Sekolah asal"], ["t:tgl_diterima", "Tanggal diterima"], ["t:diterima_kelas", "Diterima di kelas"]];
function biKurang(x) { const t = BI.tambah[x.id] || {}; return BI_WAJIB.filter(([k]) => { if (k === "t:jk") return !biJk(x); return k.startsWith("t:") ? !t[k.slice(2)] : !x[k]; }).map(([, n]) => n); }
function _biSaring(f) {
  const q = (f.cari || "").toLowerCase().trim();
  return (BI.siswa || []).filter((x) => x.ruang_id === f.rg && (f.status === "semua" || biKeadaan(x).kode === f.status || (f.status === "keluar" && biKeadaan(x).kode !== "aktif"))
    && (!q || [x.nama, x.nis, x.nisn, x.nik].some((v) => String(v || "").toLowerCase().includes(q))));
}
const _biUrutInduk = (a, b) => String(a.nis || "~").localeCompare(String(b.nis || "~"), "id", { numeric: true }) || a.nama.localeCompare(b.nama, "id");
const _biTabRg = (aktif, fn) => `<div class="rg-tab">${BI_RG.map((r) => `<button class="${aktif === r ? "aktif" : ""}" onclick="${fn}('${r}')">${_biE(_biNamaRg(r))}</button>`).join("")}</div>`;

// ── BUKU INDUK ──
async function biBukaInduk(muatUlang) {
  const sec = _rgBukaHal("pg-induk", "Buku Induk", `<div class="card"><div class="rg-memuat">Memuat Buku Induk…</div></div>`);
  try { await biMuat(muatUlang); sec.innerHTML = `<div id="bi-wrap">${_biHtmlInduk()}</div>`; }
  catch (e) { sec.innerHTML = `<div class="card">Gagal memuat: ${_biE(e.message)}</div>`; }
}
function biRgInduk(r) { BI.f.rg = r; _biSegar("bi-wrap", _biHtmlInduk); }
function _biSegar(id, fn, fokus) {
  const w = document.getElementById(id); if (!w) return;
  const pos = fokus ? w.querySelector(".bi-cari")?.selectionStart : null; w.innerHTML = fn();
  if (fokus) { const i = w.querySelector(".bi-cari"); if (i) { i.focus(); try { i.setSelectionRange(pos, pos); } catch (e) {} } }
}
function _biHtmlInduk() {
  const f = BI.f, d = _biSaring(f).sort(_biUrutInduk), semua = (BI.siswa || []).filter((x) => x.ruang_id === f.rg);
  const nisGanda = new Set(), lihat = {}; semua.forEach((x) => { if (!x.nis) return; if (lihat[x.nis]) nisGanda.add(x.nis); lihat[x.nis] = 1; });
  const lengkap = semua.filter((x) => !biKurang(x).length).length;
  return `${_biTabRg(f.rg, "biRgInduk")}
    <div class="pg-kartu-baris al-kartu">
      <div class="pg-angka total"><span>Tercatat di Buku Induk</span><b>${semua.length}</b><small>aktif ${semua.filter((x) => biKeadaan(x).kode === "aktif").length} · lulus ${semua.filter((x) => biKeadaan(x).kode === "lulus").length} · keluar ${semua.filter((x) => biKeadaan(x).kode === "mutasi").length}</small></div>
      <div class="pg-angka"><span>Data Lengkap</span><b>${lengkap}</b><small>${semua.length ? Math.round((lengkap / semua.length) * 100) : 0}% isian wajib terisi</small></div>
      <div class="pg-angka" ${semua.filter((x) => !x.nis).length ? 'style="--rw:#d97706"' : ""}><span>Belum Ada No. Induk</span><b>${semua.filter((x) => !x.nis).length}</b><small>isi NIS di Data Siswa</small></div>
      <div class="pg-angka" ${nisGanda.size ? 'style="--rw:#dc2626"' : ""}><span>No. Induk Ganda</span><b>${nisGanda.size}</b><small>satu nomor dipakai dua santri</small></div>
    </div>
    <div class="card pg-alat">
      <input class="input bi-cari" placeholder="Cari nama, No. Induk, NISN, NIK…" value="${_biE(f.cari)}" oninput="BI.f.cari=this.value;_biSegar('bi-wrap',_biHtmlInduk,true)">
      <div class="ua-saring">${[["aktif", "Aktif"], ["lulus", "Lulus"], ["mutasi", "Keluar/Mutasi"], ["semua", "Semua"]].map(([k, n]) => `<button class="ua-saring-b ${f.status === k ? "aktif" : ""}" onclick="BI.f.status='${k}';_biSegar('bi-wrap',_biHtmlInduk)">${n}</button>`).join("")}</div>
      <span class="pg-jml">${d.length} santri</span>
      <button class="btn btn-accent" onclick="biUnduhInduk()">Unduh Excel</button>
    </div>
    <div class="card" style="overflow-x:auto"><table class="table pg-tabel"><thead><tr><th>No. Induk</th><th>NISN</th><th>Nama</th><th>L/P</th><th>Tempat, Tgl Lahir</th><th>Masuk</th><th>Keadaan</th><th>Kelengkapan</th><th></th></tr></thead><tbody>
    ${d.map((x) => { const k = biKeadaan(x), kurang = biKurang(x), p = Math.round(((BI_WAJIB.length - kurang.length) / BI_WAJIB.length) * 100);
      return `<tr><td class="al-mono"><b>${_biE(x.nis || "—")}</b>${nisGanda.has(x.nis) ? '<div class="al-peringatan">ganda</div>' : ""}</td><td class="al-mono">${_biE(x.nisn || "—")}</td><td><b>${_biE(x.nama)}</b></td><td>${_biE(biJk(x) || "—")}</td>
        <td>${_biE([x.tempat_lahir, _biTgl(x.tanggal_lahir)].filter(Boolean).join(", ") || "—")}</td><td>${_biE(biTahunMasuk(x) || "—")}</td><td><span class="bi-keadaan bi-k-${k.kode}">${_biE(k.teks)}</span></td>
        <td><div class="bi-lengkap" title="${_biE(kurang.length ? "Belum: " + kurang.join(", ") : "Lengkap")}"><i style="width:${p}%;background:${p === 100 ? "#16a34a" : p >= 70 ? "#d97706" : "#dc2626"}"></i></div><small>${p}%</small></td>
        <td><button class="btn btn-sm btn-secondary" onclick="biLembar('${x.id}')">Buka</button></td></tr>`; }).join("") || `<tr><td colspan="9" class="empty-state">Tidak ada data.</td></tr>`}
    </tbody></table></div>`;
}
const BI_TAMBAH = [
  ["A", "jk", "Jenis Kelamin", "pilih:L=Laki-laki,P=Perempuan"], ["A", "agama", "Agama", "pilih:Islam,Kristen,Katolik,Hindu,Buddha,Konghucu"], ["A", "kewarganegaraan", "Kewarganegaraan", "pilih:WNI,WNA"],
  ["A", "anak_ke", "Anak ke-", "number"], ["A", "jml_saudara", "Jumlah Saudara Kandung", "number"], ["A", "status_anak", "Status dalam Keluarga", "pilih:Anak Kandung,Anak Tiri,Anak Angkat"],
  ["B", "tinggal_dengan", "Tinggal Dengan", "pilih:Orang Tua,Wali,Asrama/Pondok,Lainnya"], ["B", "no_telp", "No. Telepon Santri", "text"],
  ["C", "tgl_diterima", "Tanggal Diterima", "date"], ["C", "diterima_kelas", "Diterima di Kelas", "text"], ["C", "no_ijazah_asal", "No. Ijazah Sekolah Asal", "text"],
  ["D", "alamat_ortu", "Alamat Orang Tua", "text"], ["D", "pendidikan_ayah", "Pendidikan Ayah", "text"], ["D", "pendidikan_ibu", "Pendidikan Ibu", "text"],
  ["E", "nama_wali", "Nama Wali", "text"], ["E", "pekerjaan_wali", "Pekerjaan Wali", "text"], ["E", "hubungan_wali", "Hubungan dengan Santri", "text"],
  ["F", "no_ijazah", "No. Seri Ijazah / e-Ijazah", "text"], ["F", "url_ijazah", "Tautan e-Ijazah (Google Drive)", "url"], ["F", "catatan", "Catatan Perkembangan", "text"],
];
const BI_BAGIAN = { A: "A. Keterangan Diri", B: "B. Tempat Tinggal", C: "C. Pendidikan Sebelumnya & Penerimaan", D: "D. Orang Tua", E: "E. Wali", F: "F. Perkembangan & Meninggalkan Sekolah" };
function _biNilai(x, k) { return (BI.tambah[x.id] || {})[k] || ""; }
function _biBarisLembar(x) {
  const t = BI.tambah[x.id] || {}, k = biKeadaan(x);
  const isi = {
    A: [["Nama Lengkap", x.nama], ["No. Induk / NISN", `${x.nis || "—"} / ${x.nisn || "—"}`], ["NIK / No. KK", `${x.nik || "—"} / ${x.no_kk || "—"}`], ["Jenis Kelamin", biJk(x) === "P" ? "Perempuan" : biJk(x) === "L" ? "Laki-laki" : ""], ["Tempat, Tanggal Lahir", [x.tempat_lahir, _biTgl(x.tanggal_lahir)].filter(Boolean).join(", ")], ["Agama", t.agama], ["Kewarganegaraan", t.kewarganegaraan || "WNI"], ["Anak ke- / Jumlah Saudara", [t.anak_ke, t.jml_saudara].filter(Boolean).join(" dari ") || ""], ["Status dalam Keluarga", t.status_anak], ["No. BPJS / KIP", [x.no_bpjs, x.no_kip].filter(Boolean).join(" / ")]],
    B: [["Alamat", x.alamat_asal], ["Tinggal Dengan", t.tinggal_dengan], ["No. Telepon", t.no_telp]],
    C: [["Sekolah Asal", x.sekolah_asal], ["No. Ijazah Sekolah Asal", t.no_ijazah_asal], ["Diterima di Kelas", t.diterima_kelas], ["Tanggal Diterima", _biTgl(t.tgl_diterima)], ["Angkatan", x.angkatan]],
    D: [["Nama Ayah", x.nama_ayah], ["Pekerjaan / Pendidikan Ayah", [x.pekerjaan_ayah, t.pendidikan_ayah].filter(Boolean).join(" / ")], ["Nama Ibu", x.nama_ibu], ["Pekerjaan / Pendidikan Ibu", [x.pekerjaan_ibu, t.pendidikan_ibu].filter(Boolean).join(" / ")], ["Alamat Orang Tua", t.alamat_ortu || x.alamat_asal], ["No. WA Ayah / Ibu", [x.no_wa_ayah, x.no_wa_ibu].filter(Boolean).join(" / ")]],
    E: [["Nama Wali", t.nama_wali], ["Pekerjaan Wali", t.pekerjaan_wali], ["Hubungan", t.hubungan_wali]],
    F: [["Keadaan Sekarang", k.teks], ["Tanggal Keluar/Lulus", x.status_aktif === false ? _biTgl(String(x.tanggal_mutasi || "").slice(0, 10)) : ""], ["Alasan", x.status_aktif === false ? x.alasan_mutasi : ""], ["No. Seri Ijazah", t.no_ijazah], ["e-Ijazah", t.url_ijazah ? "Tersimpan (Google Drive)" : ""], ["Catatan", t.catatan]],
  };
  return isi;
}
function biLembar(id) {
  const x = (BI.siswa || []).find((s) => s.id === id); if (!x) return;
  const isi = _biBarisLembar(x), kurang = biKurang(x), t = BI.tambah[x.id] || {}, ubah = biBolehUbah();
  const sec = document.getElementById("page-rg");
  sec.innerHTML = `<div class="card bi-lembar">
    <div class="bi-lembar-alat"><button class="btn btn-secondary btn-sm" onclick="${BI.dariCari ? "biBukaCari()" : "biBukaInduk()"}">‹ Kembali</button>
      ${ubah ? `<button class="btn btn-primary btn-sm" onclick="biUbahLembar('${id}')">✏️ Lengkapi Isian</button>` : ""}<button class="btn btn-secondary btn-sm" onclick="biCetakLembar('${id}')">🖨️ Cetak</button>
      ${t.url_ijazah ? `<a class="btn btn-secondary btn-sm" href="${_biE(t.url_ijazah)}" target="_blank" rel="noopener">📄 e-Ijazah</a>` : ""}</div>
    <div class="bi-lembar-kepala">${x.foto_url ? `<img src="${_biE(x.foto_url)}" alt="">` : '<div class="bi-foto-kosong">FOTO<br>3×4</div>'}<div><small>LEMBAR BUKU INDUK PESERTA DIDIK · ${_biE(_biNamaRg(x.ruang_id).toUpperCase())}</small><h3>${_biE(x.nama)}</h3><span>No. Induk <b>${_biE(x.nis || "—")}</b> · NISN <b>${_biE(x.nisn || "—")}</b></span></div></div>
    ${kurang.length ? `<div class="sop-catatan">Belum diisi: ${_biE(kurang.join(", "))}</div>` : `<div class="sop-ok">✓ Isian wajib Buku Induk lengkap</div>`}
    ${Object.entries(isi).map(([b, rows]) => `<h4 class="bi-bagian">${BI_BAGIAN[b]}</h4><table class="table bi-tabel"><tbody>${rows.map(([k, v]) => `<tr><td>${k}</td><td>${v ? _biE(v) : '<span class="sop-redup">—</span>'}</td></tr>`).join("")}</tbody></table>`).join("")}
    <p class="rg-ket">Isian A–F yang berasal dari Data Siswa diubah lewat menu Data Siswa di jenjangnya; isian tambahan diubah lewat <b>Lengkapi Isian</b>.</p></div>`;
}
function biUbahLembar(id) {
  const x = (BI.siswa || []).find((s) => s.id === id); if (!x) return;
  const t = BI.tambah[x.id] || {};
  const kolom = ([, k, lbl, tipe]) => {
    const v = k === "jk" ? (t.jk || biJk(x)) : t[k] || "";
    if (tipe.startsWith("pilih:")) return `<label>${lbl}<select class="input" id="bi-${k}"><option value="">—</option>${tipe.slice(6).split(",").map((o) => { const [val, n] = o.split("="); return `<option value="${_biE(val)}" ${v === val ? "selected" : ""}>${_biE(n || val)}</option>`; }).join("")}</select></label>`;
    return `<label>${lbl}<input class="input" id="bi-${k}" type="${tipe}" value="${_biE(v)}"></label>`;
  };
  const sec = document.getElementById("page-rg");
  sec.innerHTML = `<div class="card al-form"><h3>Lengkapi Buku Induk — ${_biE(x.nama)}</h3>
    ${Object.keys(BI_BAGIAN).map((b) => { const f = BI_TAMBAH.filter((z) => z[0] === b); return f.length ? `<h4 class="bi-bagian">${BI_BAGIAN[b]}</h4><div class="al-grid">${f.map(kolom).join("")}</div>` : ""; }).join("")}
    <div class="sop-aksi"><button class="btn btn-primary" onclick="biSimpanLembar('${id}')">💾 Simpan</button><button class="btn btn-secondary" onclick="biLembar('${id}')">Batal</button></div></div>`;
}
async function biSimpanLembar(id) {
  if (!biBolehUbah()) return toast("Khusus pengelola PKBM", "err");
  const x = (BI.siswa || []).find((s) => s.id === id); if (!x) return;
  const v = {}; BI_TAMBAH.forEach(([, k]) => { v[k] = (document.getElementById("bi-" + k)?.value || "").trim(); });
  if (v.url_ijazah && !/^https:\/\//i.test(v.url_ijazah)) return toast("Tautan e-Ijazah harus diawali https://", "err");
  v.t = Date.now(); v.oleh = STATE.guruNama || "";
  try { await _bspGabungUmum(`bosp:induk:${x.ruang_id}:${id}`, v); BI.tambah[id] = { ...(BI.tambah[id] || {}), ...v }; toast("Buku Induk tersimpan", "ok"); if (typeof _rgLog === "function") _rgLog("ubah-buku-induk", { nama: x.nama }); biLembar(id); }
  catch (e) { toast("Gagal menyimpan: " + (e.message || e), "err"); }
}
function _biCetak(judul, isiHtml) {
  const w = window.open("", "_blank"); if (!w) return toast("Izinkan jendela baru (pop-up) untuk mencetak", "err");
  w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${_biE(judul)}</title><style>
    @page{size:A4;margin:14mm}body{font-family:Arial,sans-serif;font-size:11pt;color:#000}
    .kop{text-align:center;border-bottom:2px solid #000;padding-bottom:6px;margin-bottom:10px}.kop b{font-size:14pt;display:block}.kop small{font-size:9pt}
    h2{text-align:center;font-size:12pt;margin:6px 0 10px;text-decoration:underline}h4{margin:10px 0 4px;font-size:11pt}
    table{width:100%;border-collapse:collapse}td,th{border:1px solid #444;padding:3px 6px;font-size:10pt;text-align:left;vertical-align:top}
    .lembar td:first-child{width:38%}.huruf{background:#e5e7eb;font-weight:bold}.ttd{margin-top:24px;margin-left:60%;text-align:center}
  </style></head><body><div class="kop"><b>PKBM AL-UMM BARABAI</b><small>Hulu Sungai Tengah, Kalimantan Selatan</small></div>${isiHtml}
  <div class="ttd">Barabai, ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}<br>Kepala PKBM<br><br><br><br>(................................)</div>
  <script>window.onload=()=>setTimeout(()=>window.print(),300)<\/script></body></html>`);
  w.document.close();
}
function biCetakLembar(id) {
  const x = (BI.siswa || []).find((s) => s.id === id); if (!x) return;
  const isi = _biBarisLembar(x);
  _biCetak("Buku Induk " + x.nama, `<h2>LEMBAR BUKU INDUK PESERTA DIDIK</h2><p style="text-align:center;margin-top:-6px">${_biE(_biNamaRg(x.ruang_id))}</p>
    ${Object.entries(isi).map(([b, rows]) => `<h4>${BI_BAGIAN[b]}</h4><table class="lembar">${rows.map(([k, v]) => `<tr><td>${k}</td><td>${_biE(v || "")}</td></tr>`).join("")}</table>`).join("")}`);
}
function _biXlsx(baris, lembar, nama) {
  if (typeof XLSX === "undefined") return toast("Pustaka Excel belum termuat", "err");
  const ws = XLSX.utils.json_to_sheet(baris.length ? baris : [{ Keterangan: "(kosong)" }]);
  Object.keys(ws).forEach((a) => { if (a[0] !== "!" && ws[a].t === "n") { ws[a].t = "s"; ws[a].v = String(ws[a].v); } });
  const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, lembar); XLSX.writeFile(wb, nama);
}
function biUnduhInduk() {
  const d = _biSaring(BI.f).sort(_biUrutInduk);
  _biXlsx(d.map((x) => { const t = BI.tambah[x.id] || {}, k = biKeadaan(x); return { "No Induk": x.nis || "", NISN: x.nisn || "", NIK: x.nik || "", "No KK": x.no_kk || "", Nama: x.nama, "L/P": biJk(x), "Tempat Lahir": x.tempat_lahir || "", "Tanggal Lahir": x.tanggal_lahir || "", Agama: t.agama || "", Kewarganegaraan: t.kewarganegaraan || "WNI", "Anak Ke": t.anak_ke || "", "Jumlah Saudara": t.jml_saudara || "", "Status Anak": t.status_anak || "", Alamat: x.alamat_asal || "", "Tinggal Dengan": t.tinggal_dengan || "", "Sekolah Asal": x.sekolah_asal || "", "Diterima Kelas": t.diterima_kelas || "", "Tanggal Diterima": t.tgl_diterima || "", "Nama Ayah": x.nama_ayah || "", "Pekerjaan Ayah": x.pekerjaan_ayah || "", "Nama Ibu": x.nama_ibu || "", "Pekerjaan Ibu": x.pekerjaan_ibu || "", "Nama Wali": t.nama_wali || "", Keadaan: k.teks, "Alasan Keluar": x.status_aktif === false ? x.alasan_mutasi || "" : "", "No Seri Ijazah": t.no_ijazah || "", "Belum Diisi": biKurang(x).join("; ") }; }), "Buku Induk", `Buku Induk ${_biNamaRg(BI.f.rg)} ${tanggalISO()}.xlsx`);
  if (typeof _rgLog === "function") _rgLog("unduh-buku-induk", { ruang: BI.f.rg, jumlah: d.length });
}

// ── BUKU KLAPER (indeks abjad) ──
async function biBukaKlaper(muatUlang) {
  const sec = _rgBukaHal("pg-klaper", "Buku Klaper", `<div class="card"><div class="rg-memuat">Memuat Buku Klaper…</div></div>`);
  try { await biMuat(muatUlang); sec.innerHTML = `<div id="bk-wrap">${_biHtmlKlaper()}</div>`; }
  catch (e) { sec.innerHTML = `<div class="card">Gagal memuat: ${_biE(e.message)}</div>`; }
}
function biRgKlaper(r) { BI.k.rg = r; _biSegar("bk-wrap", _biHtmlKlaper); }
function _biDataKlaper() { return _biSaring({ rg: BI.k.rg, status: BI.k.status, cari: "" }).sort((a, b) => a.nama.localeCompare(b.nama, "id")); }
const _biHuruf = (n) => (String(n || "").trim()[0] || "#").toUpperCase().replace(/[^A-Z]/, "#");
function _biHtmlKlaper() {
  const d = _biDataKlaper(), kel = {}; d.forEach((x) => (kel[_biHuruf(x.nama)] = kel[_biHuruf(x.nama)] || []).push(x));
  const huruf = Object.keys(kel).sort();
  return `${_biTabRg(BI.k.rg, "biRgKlaper")}
    <div class="card pg-alat"><div class="ua-saring">${[["semua", "Semua"], ["aktif", "Aktif"], ["keluar", "Lulus & Keluar"]].map(([k, n]) => `<button class="ua-saring-b ${BI.k.status === k ? "aktif" : ""}" onclick="BI.k.status='${k}';_biSegar('bk-wrap',_biHtmlKlaper)">${n}</button>`).join("")}</div>
      <span class="pg-jml">${d.length} santri</span><button class="btn btn-secondary" onclick="biCetakKlaper()">🖨️ Cetak</button><button class="btn btn-accent" onclick="biUnduhKlaper()">Unduh Excel</button></div>
    <div class="card bk-huruf">${huruf.map((h) => `<a href="#bk-${h}" onclick="event.preventDefault();document.getElementById('bk-${h}').scrollIntoView({behavior:'smooth'})">${h}</a>`).join("")}</div>
    ${huruf.map((h) => `<div class="card bk-grup" id="bk-${h}"><div class="bk-h">${h}</div><div style="overflow-x:auto"><table class="table pg-tabel"><thead><tr><th>No</th><th>Nama</th><th>No. Induk</th><th>NISN</th><th>L/P</th><th>Masuk</th><th>Keadaan</th></tr></thead><tbody>
      ${kel[h].map((x, i) => { const k = biKeadaan(x); return `<tr><td>${i + 1}</td><td><a href="#" onclick="event.preventDefault();biLembar('${x.id}')"><b>${_biE(x.nama)}</b></a></td><td class="al-mono">${_biE(x.nis || "—")}</td><td class="al-mono">${_biE(x.nisn || "—")}</td><td>${_biE(biJk(x) || "—")}</td><td>${_biE(biTahunMasuk(x) || "—")}</td><td><span class="bi-keadaan bi-k-${k.kode}">${_biE(k.teks)}</span></td></tr>`; }).join("")}
    </tbody></table></div></div>`).join("") || `<div class="card empty-state">Tidak ada data.</div>`}`;
}
function biCetakKlaper() {
  const d = _biDataKlaper(), kel = {}; d.forEach((x) => (kel[_biHuruf(x.nama)] = kel[_biHuruf(x.nama)] || []).push(x));
  _biCetak("Buku Klaper " + _biNamaRg(BI.k.rg), `<h2>BUKU KLAPER PESERTA DIDIK</h2><p style="text-align:center;margin-top:-6px">${_biE(_biNamaRg(BI.k.rg))}</p>
    <table><tr><th>No</th><th>Nama</th><th>No. Induk</th><th>NISN</th><th>L/P</th><th>Masuk</th><th>Keadaan</th></tr>
    ${Object.keys(kel).sort().map((h) => `<tr><td class="huruf" colspan="7">${h}</td></tr>${kel[h].map((x, i) => `<tr><td>${i + 1}</td><td>${_biE(x.nama)}</td><td>${_biE(x.nis || "")}</td><td>${_biE(x.nisn || "")}</td><td>${_biE(biJk(x))}</td><td>${_biE(biTahunMasuk(x))}</td><td>${_biE(biKeadaan(x).teks)}</td></tr>`).join("")}`).join("")}</table>`);
}
function biUnduhKlaper() {
  const d = _biDataKlaper();
  _biXlsx(d.map((x, i) => ({ No: i + 1, Huruf: _biHuruf(x.nama), Nama: x.nama, "No Induk": x.nis || "", NISN: x.nisn || "", "L/P": biJk(x), "Tahun Masuk": biTahunMasuk(x) || "", Keadaan: biKeadaan(x).teks })), "Buku Klaper", `Buku Klaper ${_biNamaRg(BI.k.rg)} ${tanggalISO()}.xlsx`);
}

// ── PENCARIAN CEPAT ──
async function biBukaCari() {
  BI.dariCari = false;
  const sec = _rgBukaHal("pg-cari", "Pencarian Cepat", `<div class="card bc-kotak"><h3>🔎 Pencarian Cepat</h3><p class="rg-ket">Ketik nama, NIK, NISN, No. Induk, atau nomor HP. Mencari di santri (aktif, lulus, keluar) semua jenjang, alumni, dan guru sekaligus.</p>
    <input class="input bc-input" id="bc-input" placeholder="Contoh: Ahmad, 0071118652, 6307…" value="${_biE(BI.q)}" oninput="BI.q=this.value;clearTimeout(BI._t);BI._t=setTimeout(_biCariTampil,200)" autocomplete="off"></div><div id="bc-hasil"><div class="card"><div class="rg-memuat">Menyiapkan data…</div></div></div>`);
  try {
    await Promise.all([biMuat(), typeof alMuat === "function" ? alMuat().catch(() => {}) : null, BI.guru ? null : supaSemua.from("guru").select("id,nama,nip_nik,no_wa,email,jabatan,ruang,ruang_utama,status_aktif").then((r) => { BI.guru = r.data || []; })]);
  } catch (e) { document.getElementById("bc-hasil").innerHTML = `<div class="card">Gagal memuat: ${_biE(e.message)}</div>`; return; }
  _biCariTampil(); setTimeout(() => document.getElementById("bc-input")?.focus(), 50);
}
function _biCariTampil() {
  const w = document.getElementById("bc-hasil"); if (!w) return;
  const q = BI.q.toLowerCase().trim(), qd = q.replace(/\D/g, "");
  if (q.length < 2) { w.innerHTML = `<div class="card bc-kosong">Ketik minimal 2 huruf/angka.</div>`; return; }
  const cocok = (vals) => vals.some((v) => { const s = String(v || "").toLowerCase(); return s && (s.includes(q) || (qd.length >= 4 && s.replace(/\D/g, "").includes(qd))); });
  const siswa = (BI.siswa || []).filter((x) => cocok([x.nama, x.nis, x.nisn, x.nik, x.no_kk, x.no_wa_ayah, x.no_wa_ibu, x.nama_ayah, x.nama_ibu])).slice(0, 40);
  const alumni = (typeof _alDaftar === "function" && AL.data ? _alDaftar() : []).filter((x) => cocok([x.nama, x.nik, x.nisn, x.hp, x.no_ijazah])).slice(0, 20);
  const guru = (BI.guru || []).filter((x) => cocok([x.nama, x.nip_nik, x.no_wa, x.email])).slice(0, 20);
  const n = siswa.length + alumni.length + guru.length;
  const tanda = (s) => { const t = _biE(s || ""); if (!q) return t; const i = t.toLowerCase().indexOf(_biE(q)); return i < 0 ? t : t.slice(0, i) + "<mark>" + t.slice(i, i + _biE(q).length) + "</mark>" + t.slice(i + _biE(q).length); };
  w.innerHTML = !n ? `<div class="card bc-kosong">Tidak ditemukan untuk "<b>${_biE(BI.q)}</b>".</div>` : `
    ${siswa.length ? `<div class="card"><div class="bc-judul">🎓 Peserta Didik <small>${siswa.length}</small></div>${siswa.map((x) => { const k = biKeadaan(x); return `<button class="bc-baris" onclick="BI.dariCari=true;biLembar('${x.id}')"><div><b>${tanda(x.nama)}</b><small>${_biE(_biNamaRg(x.ruang_id))} · No. Induk ${tanda(x.nis || "—")} · NISN ${tanda(x.nisn || "—")}${x.nik && qd.length >= 4 && x.nik.includes(qd) ? ` · NIK ${tanda(x.nik)}` : ""}</small></div><span class="bi-keadaan bi-k-${k.kode}">${_biE(k.teks)}</span></button>`; }).join("")}</div>` : ""}
    ${alumni.length ? `<div class="card"><div class="bc-judul">🎖️ Alumni <small>${alumni.length}</small></div>${alumni.map((x) => `<button class="bc-baris" onclick="alDetail('${x.id}')"><div><b>${tanda(x.nama)}</b><small>Lulus ${_biE(x.lulus || "—")} · NISN ${tanda(x.nisn || "—")} · HP ${tanda(x.hp || "—")}</small></div><span class="bi-keadaan bi-k-lulus">Alumni</span></button>`).join("")}</div>` : ""}
    ${guru.length ? `<div class="card"><div class="bc-judul">👤 Guru & PTK <small>${guru.length}</small></div>${guru.map((x) => `<div class="bc-baris"><div><b>${tanda(x.nama)}</b><small>${_biE(x.jabatan || "Guru")} · ${_biE((x.ruang || []).map((r) => (typeof rgNamaPendek === "function" ? rgNamaPendek(r) : r)).join(", "))}${x.no_wa ? ` · WA ${tanda(x.no_wa)}` : ""}</small></div><span class="bi-keadaan bi-k-${x.status_aktif === false ? "mutasi" : "aktif"}">${x.status_aktif === false ? "Nonaktif" : "Aktif"}</span></div>`).join("")}</div>` : ""}`;
}

(function biPasang() {
  if (typeof RG_IKON !== "undefined") {
    RG_IKON["pg-induk"] = '<path d="M4 4h12a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3z"/><path d="M4 17a3 3 0 0 1 3-3h12"/><path d="M9 8h6"/>';
    RG_IKON["pg-klaper"] = '<path d="M5 4h14v16H5z"/><path d="M9 4v16"/><path d="M12 9h4M12 13h4"/>';
    RG_IKON["pg-cari"] = '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>';
  }
  if (typeof RG_MENU_PENGELOLA !== "undefined") {
    const g = RG_MENU_PENGELOLA.find((x) => x.group === "Data");
    if (g) {
      if (!g.items.some((x) => x[0] === "pg-cari")) g.items.unshift(["pg-cari", "", "Pencarian Cepat"]);
      [["pg-induk", "Buku Induk"], ["pg-klaper", "Buku Klaper"]].forEach(([k, n]) => { if (!g.items.some((x) => x[0] === k)) g.items.push([k, "", n]); });
    }
  }
  if (typeof PG_MODUL_SIAP !== "undefined") ["pg-cari", "pg-induk", "pg-klaper"].forEach((k) => { if (!PG_MODUL_SIAP.includes(k)) PG_MODUL_SIAP.push(k); });
  if (typeof rgBukaPengelola === "function") {
    const a = rgBukaPengelola;
    rgBukaPengelola = async function (key) { if (key === "pg-induk") return biBukaInduk(); if (key === "pg-klaper") return biBukaKlaper(); if (key === "pg-cari") return biBukaCari(); return a.apply(this, arguments); };
  }
})();

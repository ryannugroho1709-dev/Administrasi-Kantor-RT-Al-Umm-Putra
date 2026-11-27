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
const _biNamaRg = (r) => ({ A: "Paket A", Pa: "Paket B & C Putra", Pi: "Paket B & C Putri", semua: "Semua Jenjang" }[r] || r);
const biBolehUbah = () => (typeof isAdmin === "function" && isAdmin()) || (typeof rgAkses === "function" && rgAkses("Pg") === "U");

async function biMuat(paksa) {
  if (BI.siswa && !paksa && Date.now() - BI.t < 120000) return;
  const [s, k, t, al, gr, dk, jd] = await Promise.all([
    supaSemua.from("siswa").select("id,nama,nis,nisn,nik,no_kk,no_bpjs,no_kip,tempat_lahir,tanggal_lahir,angkatan,status_aktif,tanggal_mutasi,alasan_mutasi,nama_ayah,pekerjaan_ayah,nama_ibu,pekerjaan_ibu,no_wa_ayah,no_wa_ibu,alamat_asal,sekolah_asal,kelas_id,ruang_id,foto_url,created_at").order("nama"),
    supaSemua.from("kelas").select("id,nama_kelas,ruang_id"),
    supaSemua.from("kuliah_pengaturan").select("kunci,nilai").eq("ruang_id", "*").like("kunci", "bosp:induk:%"),
    supaSemua.from("kuliah_pengaturan").select("nilai").eq("kunci", "bosp:alumni").eq("ruang_id", "*").maybeSingle(),
    supaSemua.from("guru").select("id,nama,nip_nik,jenis_guru,jabatan,no_wa,email,tempat_lahir,tanggal_lahir,tmt,alamat_domisili,status_aktif,ruang,ruang_utama,ruang_nonaktif,foto_url,created_at,auth_user_id,akun_menunggu").order("nama"),
    supaSemua.from("kuliah_pengaturan").select("nilai").eq("kunci", "dapodik:ptk").eq("ruang_id", "*").maybeSingle(),
    supaSemua.from("jadwal_pelajaran").select("guru_id,ruang_id").eq("aktif", true),
  ]);
  if (s.error) throw s.error;
  BI.kelas = k.data || [];
  const kl = Object.fromEntries(BI.kelas.map((x) => [x.id, x.nama_kelas]));
  BI.siswa = (s.data || []).filter((x) => BI_RG.includes(x.ruang_id)).map((x) => ({ ...x, kelas: kl[x.kelas_id] || "" }));
  // Alumni (lulus Paket C) dari menu Alumni ikut tercatat di Buku Induk sebagai "Lulus" bila belum ada di Data Siswa
  const dg = (v) => String(v || "").replace(/\D/g, "");
  Object.entries((al.data && al.data.nilai) || {}).forEach(([id, a]) => {
    if (!a || typeof a !== "object" || !a.nama || id.startsWith("_")) return;
    const sama = BI.siswa.find((x) => (a.nisn && dg(x.nisn) && dg(x.nisn).padStart(10, "0") === dg(a.nisn).padStart(10, "0")) || (a.nik && dg(x.nik) === dg(a.nik)));
    if (sama) { if (sama.status_aktif === false && !sama.alasan_mutasi) { sama.alasan_mutasi = "Lulus Paket C"; sama.tanggal_mutasi = sama.tanggal_mutasi || (a.lulus ? a.lulus + "-06-30" : null); } return; }
    BI.siswa.push({ id: "alumni:" + id, alumni: true, nama: a.nama, nisn: a.nisn || "", nik: a.nik || "", tanggal_lahir: a.tgl_lahir || "", tempat_lahir: a.tempat_lahir || "", ruang_id: BI_RG.includes(a.rg) ? a.rg : "Pi", status_aktif: false, alasan_mutasi: "Lulus Paket C", tanggal_mutasi: a.lulus ? a.lulus + "-06-30" : null, kelas: "", angkatan: "", nis: a.nis || "", sekolah_asal: "", jk_alumni: a.jk || "" });
  });
  BI.siswa.sort((a, b) => a.nama.localeCompare(b.nama, "id"));
  BI.guru = (gr.data || []).filter((g) => g.nama);
  BI.dpk = (dk && dk.data && dk.data.nilai) || null; BI.jadwalGuru = {};
  ((jd && jd.data) || []).forEach((x) => { if (!x.guru_id) return; const o = (BI.jadwalGuru[x.guru_id] = BI.jadwalGuru[x.guru_id] || {}); o[x.ruang_id] = (o[x.ruang_id] || 0) + 1; });
  BI.tambah = {}; (t.data || []).forEach((r) => { const id = r.kunci.split(":").slice(3).join(":"); BI.tambah[id] = r.nilai || {}; });
  BI.t = Date.now();
}
// Jenis kelamin: isian Buku Induk → NIK (tanggal +40 = perempuan) → jenjang (Putra/Putri)
function biJk(x) {
  const t = BI.tambah[x.id] || {}; if (t.jk) return t.jk; if (x.jk_alumni) return x.jk_alumni;
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
const BI_WAJIB = [["nis", "No. Induk"], ["nisn", "NISN"], ["nik", "NIK"], ["tempat_lahir", "Tempat lahir"], ["tanggal_lahir", "Tanggal lahir"], ["t:jk", "Jenis kelamin"], ["alamat_asal", "Alamat"], ["nama_ayah", "Nama ayah"], ["nama_ibu", "Nama ibu"], ["sekolah_asal", "Sekolah asal"], ["t:tgl_diterima", "Tanggal diterima"], ["t:diterima_kelas", "Diterima di kelas"]];
function biKurang(x) { const t = BI.tambah[x.id] || {}; return BI_WAJIB.filter(([k]) => { if (k === "t:jk") return !biJk(x); return k.startsWith("t:") ? !t[k.slice(2)] : !x[k]; }).map(([, n]) => n); }
function _biSaring(f) {
  const q = (f.cari || "").toLowerCase().trim();
  return (BI.siswa || []).filter((x) => (f.rg === "semua" || x.ruang_id === f.rg) && (f.status === "semua" || biKeadaan(x).kode === f.status || (f.status === "keluar" && biKeadaan(x).kode !== "aktif"))
    && (!q || [x.nama, x.nis, x.nisn, x.nik].some((v) => String(v || "").toLowerCase().includes(q))));
}
const _biUrutInduk = (a, b) => (BI_RG.indexOf(a.ruang_id) - BI_RG.indexOf(b.ruang_id)) * (BI.f.rg === "semua" ? 1 : 0) || String(a.nis || "~").localeCompare(String(b.nis || "~"), "id", { numeric: true }) || a.nama.localeCompare(b.nama, "id");
const BI_WARNA_RG = { A: "#047857", Pa: "#1d4ed8", Pi: "#be185d", semua: "#8a5523" };
const _biTabRg = (aktif, fn) => `<div class="bk2-jenjang">${["semua", ...BI_RG].map((r) => `<button class="${aktif === r ? "on" : ""}" style="--rw:${BI_WARNA_RG[r]}" onclick="${fn}('${r}')">${r === "semua" ? "🏫 " : ""}${_biE(_biNamaRg(r))}<small>${(BI.siswa || []).filter((x) => r === "semua" || x.ruang_id === r).length} santri</small></button>`).join("")}</div>`;
const _biPillRg = (r) => `<em class="bi2-rg" style="--rw:${BI_WARNA_RG[r] || "#64748b"}">${_biE({ A: "Paket A", Pa: "Putra", Pi: "Putri" }[r] || r)}</em>`;

// warna bermakna untuk pilihan saringan: jenjang, status, tahun
const BI_CW = { semua: "#475569", "": "#475569", aktif: "#16a34a", sudah: "#16a34a", belum: "#d97706", lulus: "#7c3aed", mutasi: "#e11d48", keluar: "#e11d48", nonaktif: "#e11d48", A: "#047857", Pa: "#1d4ed8", Pi: "#be185d" };
const BI_CW_TAHUN = ["#0284c7", "#ea580c", "#0d9488", "#c026d3", "#65a30d", "#dc2626", "#4f46e5"];
function _biCw(k) { if (BI_CW[k]) return BI_CW[k]; const n = Number(String(k).replace(/D/g, "")); return n ? BI_CW_TAHUN[n % BI_CW_TAHUN.length] : "#475569"; }
// label kolom untuk tampilan kartu di HP (dari judul tabel), kolom terakhir tanpa judul = aksi
function _bi2Label(akar) { (akar || document).querySelectorAll(".bi2-tabel").forEach((t) => { const h = [...t.querySelectorAll("thead th")].map((x) => x.textContent.trim()); t.querySelectorAll("tbody tr").forEach((r) => [...r.children].forEach((td, i) => { if (td.colSpan > 1) return; if (h[i]) td.setAttribute("data-l", h[i]); else td.classList.add("aksi"); if (/^aksi$/i.test(h[i] || "")) td.classList.add("aksi"); })); }); }
// ── Kartu angka berwarna + animasi hitung naik (0 → angka tujuan) ──
const _biAngka = (daftar) => `<div class="bk2-angka">${daftar.map(([k, label, n]) => `<div class="bn-${k}"><b data-n="${n}">${n}</b><span>${label}</span></div>`).join("")}</div>`;
function _biHitungNaik(akar) {
  if (!akar) return;
  akar.querySelectorAll(".bk2-angka b[data-n]").forEach((el) => {
    const tuju = Number(el.dataset.n) || 0, mulai = performance.now(), lama = Math.min(1400, 500 + tuju * 6);
    if (!tuju) { el.textContent = "0"; return; }
    el.textContent = "0";
    const langkah = (k) => { const p = Math.min(1, (k - mulai) / lama), e = 1 - Math.pow(1 - p, 3); el.textContent = String(Math.round(tuju * e)); if (p < 1) requestAnimationFrame(langkah); };
    requestAnimationFrame(langkah);
  });
}
// pilihan isi Buku Induk: Peserta Didik / Guru & PTK
const _biModeTab = () => `<div class="bi3-mode">${[["pd", "🎓 Peserta Didik"], ["guru", "👳 Guru & PTK"]].map(([k, l]) => `<button class="${(BI.mode || "pd") === k ? "on" : ""}" onclick="biGantiMode('${k}')">${l}</button>`).join("")}</div>`;
function biGantiMode(m) { BI.mode = m; BI._kunciAnim = ""; _biSegar("bi-wrap", m === "guru" ? _biHtmlGuru : _biHtmlInduk); }
// ── Buku Induk Guru & PTK: aktif dan nonaktif, status Dapodik, jadwal per jenjang, akun ──
BI.g = { rg: "semua", status: "semua", tanda: "", jenis: "", cari: "" };
const BI_JENIS_GURU = { dalam: "Guru Dalam", luar: "Guru Luar", afiliasi: "Afiliasi", sukarelawan: "Sukarelawan", ekskul: "Ekskul" };
const _biRgGuru = (g) => { const r = new Set([...(Array.isArray(g.ruang) ? g.ruang : []), g.ruang_utama].filter((x) => BI_RG.includes(x))); return [...r]; };
const _biGuruAktif = (g) => g.status_aktif !== false;
const _biDpk = (g) => ((BI.dpk && BI.dpk.ptk) || []).find((d) => d.guru_id === g.id) || null;
const _biJadwal = (g) => (BI.jadwalGuru || {})[g.id] || {};
const _biJmlJadwal = (g) => Object.values(_biJadwal(g)).reduce((a, b) => a + b, 0);
function _biDataGuru() {
  const f = BI.g, q = (f.cari || "").toLowerCase().trim();
  return (BI.guru || []).filter((g) => (f.rg === "semua" || _biRgGuru(g).includes(f.rg)) && (f.status === "semua" || (f.status === "aktif") === _biGuruAktif(g))
    && (!f.jenis || g.jenis_guru === f.jenis)
    && (!f.tanda || (f.tanda === "dapodik" ? !!_biDpk(g) : f.tanda === "bukan" ? !_biDpk(g) : !_biJmlJadwal(g)))
    && (!q || [g.nama, g.nip_nik, g.jabatan, g.no_wa, g.email].some((v) => String(v || "").toLowerCase().includes(q))));
}
// PTK yang terdaftar di Dapodik tetapi belum ada / nonaktif di aplikasi
function _biHtmlDpkLuar() {
  const ptk = (BI.dpk && BI.dpk.ptk) || []; if (!ptk.length) return "";
  const belum = ptk.filter((d) => !d.guru_id), nonaktif = ptk.filter((d) => d.guru_id && (BI.guru || []).some((g) => g.id === d.guru_id && g.status_aktif === false));
  if (!belum.length && !nonaktif.length) return "";
  return `<details class="bi3-dpk"><summary>🗂️ Cek Dapodik — ${belum.length ? `${belum.length} belum ada di aplikasi` : ""}${belum.length && nonaktif.length ? " · " : ""}${nonaktif.length ? `${nonaktif.length} nonaktif di aplikasi` : ""}</summary>
    <small>Potret ${_biE(BI.dpk.sumber || "Dapodik")}${BI.dpk.diambil ? ", " + _biE(BI.dpk.diambil) : ""}.</small>
    ${belum.length ? `<p>Terdaftar di Dapodik, <b>belum ada di aplikasi</b>:</p><div class="bi3-dpk-nama">${belum.map((d) => `<em>${_biE(d.nama)}${d.jenis ? " · " + _biE(d.jenis) : ""}</em>`).join("")}</div>` : ""}
    ${nonaktif.length ? `<p>Terdaftar di Dapodik tetapi <b>nonaktif di aplikasi</b> — perbarui di Dapodik bila sudah tidak bertugas:</p><div class="bi3-dpk-nama">${nonaktif.map((d) => `<em>${_biE(d.nama)}</em>`).join("")}</div>` : ""}</details>`;
}
function _biHtmlGuru() {
  const f = BI.g, d = _biDataGuru(), semua = (BI.guru || []).filter((g) => f.rg === "semua" || _biRgGuru(g).includes(f.rg));
  const aktif = semua.filter(_biGuruAktif), dpk = aktif.filter((g) => _biDpk(g)).length, akun = aktif.filter((g) => g.auth_user_id).length;
  const chip = (nilai, pilihan, kunci) => pilihan.map(([k, l, w]) => `<button class="${nilai === k ? "on" : ""}" style="--cw:${w || _biCw(k)}" onclick="BI.g.${kunci}='${k}';_biSegar('bi-wrap',_biHtmlGuru)">${l}</button>`).join("");
  return `<div class="bk2" style="--bk:${BI_WARNA_RG[f.rg] || "#8a5523"}">
    <div class="bk2-hero"><div><small>👳 BUKU INDUK GURU & TENAGA KEPENDIDIKAN</small><h2>${_biE(_biNamaRg(f.rg))}</h2><p>Catatan seluruh guru dan PTK — yang aktif maupun yang sudah tidak bertugas — beserta status Dapodik, jadwal mengajar, dan akun aplikasi.</p></div>
      ${_biAngka([["catat", "Tercatat", semua.length], ["aktif", "Aktif", aktif.length], ["keluar", "Nonaktif", semua.length - aktif.length], ["lulus", "Di Dapodik", dpk], ["l", "Punya Akun", akun]])}</div>
    <div class="bk2-jenjang">${["semua", ...BI_RG].map((r) => `<button class="${f.rg === r ? "on" : ""}" style="--rw:${BI_WARNA_RG[r]}" onclick="BI.g.rg='${r}';BI._kunciAnim='';_biSegar('bi-wrap',_biHtmlGuru)">${r === "semua" ? "🏫 " : ""}${_biE(_biNamaRg(r))}<small>${(BI.guru || []).filter((g) => (r === "semua" || _biRgGuru(g).includes(r)) && _biGuruAktif(g)).length} aktif</small></button>`).join("")}</div>
    ${_biHtmlDpkLuar()}
    <div class="bk2-alat">
      <div class="bk2-cari">🔎<input class="bi-cari" placeholder="Cari nama, NIP/NIK, jabatan, no. WA, email…" value="${_biE(f.cari)}" oninput="BI.g.cari=this.value;_biSegar('bi-wrap',_biHtmlGuru,true)"></div>
      <div class="bk2-chip">${chip(f.status, [["semua", "Semua"], ["aktif", "Aktif"], ["nonaktif", "Nonaktif"]], "status")}</div>
      <div class="bk2-chip">${chip(f.tanda, [["", "Semua Tanda", "#475569"], ["dapodik", "Terdaftar Dapodik", "#16a34a"], ["bukan", "Belum di Dapodik", "#d97706"], ["jadwal", "Tanpa Jadwal", "#e11d48"]], "tanda")}</div>
      <div class="bk2-chip">${chip(f.jenis, [["", "Semua Jenis", "#475569"], ...Object.entries(BI_JENIS_GURU).map(([k, n], i) => [k, n, BI_CW_TAHUN[i]])], "jenis")}</div>
      <span class="bk2-jml">${d.length} orang</span>
      <button class="bk2-btn utama" onclick="biUnduhGuru()">⬇️ Unduh Excel</button></div>
    <div class="bi2-wadah"><table class="bi2-tabel" style="min-width:1240px"><colgroup><col style="width:44px"><col><col style="width:170px"><col style="width:150px"><col style="width:170px"><col style="width:150px"><col style="width:170px"><col style="width:90px"><col style="width:100px"></colgroup>
      <thead><tr><th class="c">No</th><th>Nama Lengkap</th><th>Jabatan</th><th>Jenis</th><th>Bertugas Di</th><th>Dapodik</th><th>Jadwal Mengajar</th><th class="c">Akun</th><th>Status</th></tr></thead><tbody>
      ${d.map((g, i) => { const on = _biGuruAktif(g), dp = _biDpk(g), jw = _biJadwal(g); return `<tr class="klik ${on ? "" : "k-mutasi"}" onclick="biLembarGuru('${g.id}')" title="Buka lembar Buku Induk"><td class="c redup">${i + 1}</td>
        <td class="nama"><span class="bi2-nm"><i class="bk2-av">${_biE(_biInisial(g.nama))}</i><span><b>${_biE(g.nama)}</b>${g.nip_nik ? `<small class="al2-sub">NIK/NIP ${_biE(g.nip_nik)}</small>` : ""}</span></span></td>
        <td>${_biE(g.jabatan || "—")}</td><td>${_biE(BI_JENIS_GURU[g.jenis_guru] || g.jenis_guru || "—")}</td>
        <td>${_biRgGuru(g).map(_biPillRg).join(" ") || "—"}</td>
        <td>${dp ? `<em class="bk2-st aktif" title="${_biE([dp.nuptk ? "NUPTK " + dp.nuptk : "", dp.nip ? "NIP " + dp.nip : "", dp.golongan, dp.tugas].filter(Boolean).join(" · "))}">✓ ${_biE(dp.status || "Terdaftar")}</em>` : `<em class="bk2-st belum">Belum</em>`}</td>
        <td>${Object.keys(jw).length ? Object.entries(jw).map(([r, n]) => `<em class="bi2-rg" style="--rw:${BI_WARNA_RG[r] || "#64748b"}">${_biE({ A: "Paket A", Pa: "Putra", Pi: "Putri" }[r] || r)} ${n}</em>`).join(" ") : `<span class="redup">Tanpa jadwal</span>`}</td>
        <td class="c">${g.auth_user_id ? (g.akun_menunggu ? `<em class="bk2-st belum">Menunggu</em>` : "✅") : `<span class="redup">Belum</span>`}</td>
        <td><em class="bk2-st ${on ? "aktif" : "mutasi"}">${on ? "Aktif" : "Nonaktif"}</em></td></tr>`; }).join("") || `<tr><td colspan="9" class="c redup" style="padding:28px">Tidak ada data.</td></tr>`}
      </tbody></table></div></div>`;
}
function biUnduhGuru() {
  const d = _biDataGuru();
  _biXlsx(d.map((g, i) => { const dp = _biDpk(g); return { No: i + 1, Nama: g.nama, "NIP/NIK": g.nip_nik || "", Jabatan: g.jabatan || "", "Jenis Guru": BI_JENIS_GURU[g.jenis_guru] || g.jenis_guru || "", "Bertugas Di": _biRgGuru(g).map(_biNamaRg).join(", "), "Tempat Lahir": g.tempat_lahir || "", "Tanggal Lahir": g.tanggal_lahir || "", Agama: "Islam", TMT: g.tmt || "", "No WA": g.no_wa || "", Email: g.email || "", Dapodik: dp ? "Terdaftar" : "Belum", "Status Kepegawaian": dp?.status || "", NUPTK: dp?.nuptk || "", NIP: dp?.nip || "", "Jumlah Jadwal": _biJmlJadwal(g), Akun: g.auth_user_id ? (g.akun_menunggu ? "Menunggu" : "Ada") : "Belum", Status: _biGuruAktif(g) ? "Aktif" : "Nonaktif" }; }), "Guru & PTK", `Buku Induk Guru & PTK ${_biNamaRg(BI.g.rg)} ${tanggalISO()}.xlsx`);
}

// ── BUKU INDUK ──
async function biBukaInduk(muatUlang) {
  const sec = _rgBukaHal(BI.mode === "guru" ? "pg-induk-guru" : "pg-induk", BI.mode === "guru" ? "Buku Induk Guru & PTK" : "Buku Induk Siswa", `<div class="card"><div class="rg-memuat">Memuat Buku Induk…</div></div>`);
  try { await biMuat(muatUlang); BI._kunciAnim = ""; sec.innerHTML = `<div id="bi-wrap"></div>`; _biSegar("bi-wrap", BI.mode === "guru" ? _biHtmlGuru : _biHtmlInduk); }
  catch (e) { sec.innerHTML = `<div class="card">Gagal memuat: ${_biE(e.message)}</div>`; }
}
function biRgInduk(r) { BI.f.rg = r; _biSegar("bi-wrap", _biHtmlInduk); }
function _biSegar(id, fn, fokus) {
  const w = document.getElementById(id); if (!w) return;
  const pos = fokus ? w.querySelector(".bi-cari")?.selectionStart : null; w.innerHTML = fn();
  const kunci = id + "|" + (fn === _biHtmlGuru ? "g" + BI.g.rg : fn === _biHtmlKlaper ? "k" + BI.k.rg : "i" + BI.f.rg); if (BI._kunciAnim !== kunci) { BI._kunciAnim = kunci; _biHitungNaik(w); } _bi2Label(w);
  if (fokus) { const i = w.querySelector(".bi-cari"); if (i) { i.focus(); try { i.setSelectionRange(pos, pos); } catch (e) {} } }
}
function _biHtmlInduk() {
  const f = BI.f, d = _biSaring(f).sort(_biUrutInduk), semua = (BI.siswa || []).filter((x) => f.rg === "semua" || x.ruang_id === f.rg), gabung = f.rg === "semua";
  const nisGanda = new Set(), lihat = {}; semua.forEach((x) => { if (!x.nis) return; const k = x.ruang_id + "|" + x.nis; if (lihat[k]) nisGanda.add(k); lihat[k] = 1; });
  const lengkap = semua.filter((x) => !biKurang(x).length).length, tanpaNis = semua.filter((x) => !x.nis).length;
  const hit = (kode) => semua.filter((x) => biKeadaan(x).kode === kode).length;
  return `<div class="bk2" style="--bk:${BI_WARNA_RG[f.rg] || "#8a5523"}">
    <div class="bk2-hero"><div><small>📘 BUKU INDUK PESERTA DIDIK</small><h2>${_biE(_biNamaRg(f.rg))}</h2><p>Catatan resmi seluruh peserta didik — aktif, lulus, dan keluar — beserta kelengkapan isian wajib Buku Induk.</p></div>
      ${_biAngka([["catat", "Tercatat", semua.length], ["aktif", "Aktif", hit("aktif")], ["lulus", "Lulus", hit("lulus")], ["keluar", "Keluar", hit("mutasi")]])}</div>
    ${_biTabRg(f.rg, "biRgInduk")}
    <div class="bi2-ringkas">
      <div class="bi2-kotak"><span>Data Lengkap</span><b>${lengkap}<small>/${semua.length}</small></b><i class="bi2-bar"><s style="width:${semua.length ? Math.round((lengkap / semua.length) * 100) : 0}%"></s></i><small>${semua.length ? Math.round((lengkap / semua.length) * 100) : 0}% isian wajib terisi</small></div>
      <div class="bi2-kotak ${tanpaNis ? "kuning" : ""}"><span>Belum Ada No. Induk</span><b>${tanpaNis}</b><small>isi NIS di Data Siswa jenjangnya</small></div>
      <div class="bi2-kotak ${nisGanda.size ? "merah" : ""}"><span>No. Induk Ganda</span><b>${nisGanda.size}</b><small>satu nomor dipakai dua santri</small></div>
    </div>
    <div class="bk2-alat">
      <div class="bk2-cari">🔎<input class="bi-cari" placeholder="Cari nama, No. Induk, NISN, NIK…" value="${_biE(f.cari)}" oninput="BI.f.cari=this.value;_biSegar('bi-wrap',_biHtmlInduk,true)"></div>
      <div class="bk2-chip">${[["aktif", "Aktif"], ["lulus", "Lulus"], ["mutasi", "Keluar/Mutasi"], ["semua", "Semua"]].map(([k, n]) => `<button class="${f.status === k ? "on" : ""}" style="--cw:${_biCw(k)}" onclick="BI.f.status='${k}';_biSegar('bi-wrap',_biHtmlInduk)">${n}</button>`).join("")}</div>
      <span class="bk2-jml">${d.length} santri</span>
      <button class="bk2-btn utama" onclick="biUnduhInduk()">⬇️ Unduh Excel${gabung ? " (Semua Jenjang)" : ""}</button></div>
    <div class="bi2-wadah"><table class="bi2-tabel" style="min-width:${gabung ? 1290 : 1200}px"><colgroup><col style="width:44px"><col style="width:92px"><col style="width:118px"><col>${gabung ? '<col style="width:92px">' : ""}<col style="width:52px"><col style="width:190px"><col style="width:70px"><col style="width:150px"><col style="width:128px"><col style="width:76px"></colgroup>
      <thead><tr><th class="c">No</th><th>No. Induk</th><th>NISN</th><th>Nama Lengkap</th>${gabung ? "<th>Jenjang</th>" : ""}<th class="c">L/P</th><th>Tempat, Tanggal Lahir</th><th class="c">Masuk</th><th>Keadaan</th><th>Kelengkapan</th><th></th></tr></thead><tbody>
    ${d.map((x, i) => { const k = biKeadaan(x), kurang = biKurang(x), p = Math.round(((BI_WAJIB.length - kurang.length) / BI_WAJIB.length) * 100), jk = biJk(x);
      return `<tr class="k-${k.kode}"><td class="c redup">${i + 1}</td><td class="mono"><b>${_biE(x.nis || "—")}</b>${nisGanda.has(x.ruang_id + "|" + x.nis) ? '<em class="bi2-ganda">ganda</em>' : ""}</td><td class="mono">${_biE(x.nisn || "—")}</td>
        <td class="nama"><b>${_biE(x.nama)}</b></td>${gabung ? `<td>${_biPillRg(x.ruang_id)}</td>` : ""}<td class="c"><em class="bk2-jk ${jk === "P" ? "p" : "l"}">${_biE(jk || "—")}</em></td>
        <td>${_biE([x.tempat_lahir, _biTgl(x.tanggal_lahir)].filter(Boolean).join(", ") || "—")}</td><td class="c">${_biE(biTahunMasuk(x) || "—")}</td><td><em class="bk2-st ${k.kode}">${_biE(k.teks)}</em></td>
        <td><div class="bi2-lengkap" title="${_biE(kurang.length ? "Belum diisi: " + kurang.join(", ") : "Lengkap")}"><i><s style="width:${p}%;background:${p === 100 ? "#16a34a" : p >= 70 ? "#d97706" : "#dc2626"}"></s></i><small>${p}%</small></div></td>
        <td class="c"><button class="bi2-buka" onclick="biLembar('${x.id}')">Buka</button></td></tr>`; }).join("") || `<tr><td colspan="${gabung ? 11 : 10}" class="c redup" style="padding:28px">Tidak ada data.</td></tr>`}
    </tbody></table></div></div>`;
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
    A: [["Nama Lengkap", x.nama], ["No. Induk / NISN", `${x.nis || "—"} / ${x.nisn || "—"}`], ["NIK / No. KK", `${x.nik || "—"} / ${x.no_kk || "—"}`], ["Jenis Kelamin", biJk(x) === "P" ? "Perempuan" : biJk(x) === "L" ? "Laki-laki" : ""], ["Tempat, Tanggal Lahir", [x.tempat_lahir, _biTgl(x.tanggal_lahir)].filter(Boolean).join(", ")], ["Agama", t.agama || "Islam"], ["Kewarganegaraan", t.kewarganegaraan || "WNI"], ["Anak ke- / Jumlah Saudara", [t.anak_ke, t.jml_saudara].filter(Boolean).join(" dari ") || ""], ["Status dalam Keluarga", t.status_anak], ["No. BPJS / KIP", [x.no_bpjs, x.no_kip].filter(Boolean).join(" / ")]],
    B: [["Alamat", x.alamat_asal], ["Tinggal Dengan", t.tinggal_dengan], ["No. Telepon", t.no_telp]],
    C: [["Sekolah Asal", x.sekolah_asal], ["No. Ijazah Sekolah Asal", t.no_ijazah_asal], ["Diterima di Kelas", t.diterima_kelas], ["Tanggal Diterima", _biTgl(t.tgl_diterima)], ["Angkatan", x.angkatan]],
    D: [["Nama Ayah", x.nama_ayah], ["Pekerjaan / Pendidikan Ayah", [x.pekerjaan_ayah, t.pendidikan_ayah].filter(Boolean).join(" / ")], ["Nama Ibu", x.nama_ibu], ["Pekerjaan / Pendidikan Ibu", [x.pekerjaan_ibu, t.pendidikan_ibu].filter(Boolean).join(" / ")], ["Alamat Orang Tua", t.alamat_ortu || x.alamat_asal], ["No. WA Ayah / Ibu", [x.no_wa_ayah, x.no_wa_ibu].filter(Boolean).join(" / ")]],
    E: [["Nama Wali", t.nama_wali], ["Pekerjaan Wali", t.pekerjaan_wali], ["Hubungan", t.hubungan_wali]],
    F: [["Keadaan Sekarang", k.teks], ["Tanggal Keluar/Lulus", x.status_aktif === false ? _biTgl(String(x.tanggal_mutasi || "").slice(0, 10)) : ""], ["Alasan", x.status_aktif === false ? x.alasan_mutasi : ""], ["No. Seri Ijazah", t.no_ijazah], ["e-Ijazah", t.url_ijazah ? "Tersimpan (Google Drive)" : ""], ["Catatan", t.catatan]],
  };
  return isi;
}
// ── Lembar Buku Induk (tampilan kartu modern; dipakai siswa & guru) ──
const BI_IKON_BAGIAN = { A: "🪪", B: "🏠", C: "🎒", D: "👨‍👩‍👧", E: "🤝", F: "🎓" };
function _bilKartu(ikon, judul, rows, lebar) {
  const terisi = rows.filter(([, v]) => v).length;
  return `<section class="bil-kartu ${lebar ? "lebar" : ""}"><header><i>${ikon}</i><h4>${_biE(judul)}</h4><small>${terisi}/${rows.length} terisi</small></header>
    <dl>${rows.map(([k, v]) => `<div class="${v ? "" : "kosong"}"><dt>${_biE(k)}</dt><dd>${v ? _biE(v) : '<span class="bil-kosong">Belum diisi</span>'}</dd></div>`).join("")}</dl></section>`;
}
function _bilKepala(o) {
  return `<div class="bil-hero" style="--bk:${o.warna}">
    <div class="bil-foto">${o.foto ? `<img src="${_biE(o.foto)}" alt="">` : `<span>${_biE(_biInisial(o.nama))}</span>`}</div>
    <div class="bil-id"><small>${_biE(o.label)}</small><h2>${_biE(o.nama)}</h2>
      <div class="bil-chip">${o.chip.map(([t, w]) => `<em style="--cw:${w}">${t}</em>`).join("")}</div>
      <div class="bil-nomor">${o.nomor.map(([k, v]) => `<span><small>${_biE(k)}</small><b>${_biE(v || "—")}</b></span>`).join("")}</div></div>
    ${o.persen != null ? `<div class="bil-lengkap" style="--p:${o.persen};--pw:${o.persen === 100 ? "#4ade80" : o.persen >= 70 ? "#fbbf24" : "#f87171"}"><b>${o.persen}%</b><small>Kelengkapan</small></div>` : ""}</div>`;
}
function biLembar(id) {
  const x = (BI.siswa || []).find((s) => s.id === id); if (!x) return;
  const isi = _biBarisLembar(x), kurang = biKurang(x), t = BI.tambah[x.id] || {}, ubah = biBolehUbah(), k = biKeadaan(x);
  const persen = Math.round(((BI_WAJIB.length - kurang.length) / Math.max(1, BI_WAJIB.length)) * 100);
  const wSt = { aktif: "#16a34a", lulus: "#7c3aed", mutasi: "#dc2626" }[k.kode] || "#64748b";
  const sec = document.getElementById("page-rg");
  sec.innerHTML = `<div class="bil">
    <div class="bil-alat"><button class="bk2-btn" onclick="${BI.dariCari ? "biBukaCari()" : "biBukaInduk()"}">‹ Kembali</button><span></span>
      ${ubah ? `<button class="bk2-btn utama" style="--bk:${BI_WARNA_RG[x.ruang_id] || "#8a5523"}" onclick="biUbahLembar('${id}')">✏️ Lengkapi Isian</button>` : ""}<button class="bk2-btn" onclick="biCetakLembar('${id}')">🖨️ Cetak</button>
      ${t.url_ijazah ? `<a class="bk2-btn" href="${_biE(t.url_ijazah)}" target="_blank" rel="noopener">📄 e-Ijazah</a>` : ""}</div>
    ${_bilKepala({ warna: BI_WARNA_RG[x.ruang_id] || "#8a5523", foto: x.foto_url, nama: x.nama, label: "LEMBAR BUKU INDUK PESERTA DIDIK", persen,
      chip: [[_biE(_biNamaRg(x.ruang_id)), BI_WARNA_RG[x.ruang_id] || "#64748b"], [_biE(k.teks), wSt], ...(biJk(x) ? [[biJk(x) === "P" ? "Perempuan" : "Laki-laki", biJk(x) === "P" ? "#be185d" : "#1d4ed8"]] : [])],
      nomor: [["No. Induk", x.nis], ["NISN", x.nisn], ["Angkatan", x.angkatan]] })}
    ${kurang.length ? `<div class="bil-catatan">⚠️ <span><b>Belum diisi:</b> ${kurang.map((n) => `<em>${_biE(n)}</em>`).join("")}</span></div>` : `<div class="bil-catatan ok">✅ Isian wajib Buku Induk sudah lengkap</div>`}
    <div class="bil-grid">${Object.entries(isi).map(([b, rows]) => _bilKartu(BI_IKON_BAGIAN[b], BI_BAGIAN[b], rows, b === "A" || b === "D")).join("")}</div>
    <p class="bil-ket">Isian yang berasal dari Data Siswa diubah lewat menu Data Siswa di jenjangnya. Isian tambahan diubah lewat <b>Lengkapi Isian</b>.</p></div>`;
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function biLembarGuru(id) {
  const g = (BI.guru || []).find((x) => x.id === id); if (!g) return;
  const on = _biGuruAktif(g), dp = _biDpk(g), jw = _biJadwal(g), w = BI_WARNA_RG[_biRgGuru(g)[0]] || "#8a5523";
  const sec = document.getElementById("page-rg");
  const nmRg = { A: "Paket A", Pa: "Putra", Pi: "Putri" };
  sec.innerHTML = `<div class="bil">
    <div class="bil-alat"><button class="bk2-btn" onclick="BI.mode='guru';biBukaInduk()">‹ Kembali</button><span></span></div>
    ${_bilKepala({ warna: w, foto: g.foto_url, nama: g.nama, label: "BUKU INDUK GURU & TENAGA KEPENDIDIKAN",
      chip: [..._biRgGuru(g).map((r) => [_biE(_biNamaRg(r)), BI_WARNA_RG[r]]), [on ? "Aktif" : "Nonaktif", on ? "#16a34a" : "#dc2626"], [dp ? "Terdaftar Dapodik" : "Belum di Dapodik", dp ? "#16a34a" : "#d97706"]],
      nomor: [["NIK / NIP", g.nip_nik], ["NUPTK", dp && dp.nuptk], ["TMT", _biTgl(g.tmt)]] })}
    <div class="bil-grid">
      ${_bilKartu("🪪", "A. Identitas", [["Nama Lengkap", g.nama], ["NIK / NIP", g.nip_nik], ["Tempat, Tanggal Lahir", [g.tempat_lahir, _biTgl(g.tanggal_lahir)].filter(Boolean).join(", ")], ["Agama", "Islam"], ["Alamat", g.alamat_domisili]], true)}
      ${_bilKartu("💼", "B. Tugas", [["Jabatan", g.jabatan], ["Jenis Guru", BI_JENIS_GURU[g.jenis_guru] || g.jenis_guru], ["Bertugas Di", _biRgGuru(g).map(_biNamaRg).join(", ")], ["Mulai Bertugas (TMT)", _biTgl(g.tmt)], ["Status", on ? "Aktif" : "Nonaktif"]])}
      ${_bilKartu("🗂️", "C. Dapodik", [["Status Dapodik", dp ? dp.status || "Terdaftar" : ""], ["NUPTK", dp && dp.nuptk], ["NIP", dp && dp.nip], ["Golongan", dp && dp.golongan], ["Tugas Tambahan", dp && dp.tugas]])}
      ${_bilKartu("📅", "D. Jadwal Mengajar", Object.keys(jw).length ? Object.entries(jw).map(([r, n]) => [nmRg[r] || r, n + " jam pelajaran per pekan"]) : [["Jadwal", ""]])}
      ${_bilKartu("📱", "E. Kontak & Akun", [["No. WA", g.no_wa], ["Email", g.email], ["Akun Aplikasi", g.auth_user_id ? (g.akun_menunggu ? "Menunggu persetujuan" : "Sudah ada") : ""]])}
    </div>
    <p class="bil-ket">Data guru diubah lewat menu Data Guru di jenjangnya atau Profil Guru, dan otomatis tampil di sini.</p></div>`;
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function biUbahLembar(id) {
  const x = (BI.siswa || []).find((s) => s.id === id); if (!x) return;
  const t = BI.tambah[x.id] || {};
  const kolom = ([, k, lbl, tipe]) => {
    const v = k === "jk" ? (t.jk || biJk(x)) : t[k] || (k === "agama" ? "Islam" : "");
    if (tipe.startsWith("pilih:")) return `<label>${lbl}<select class="input" id="bi-${k}"><option value="">—</option>${tipe.slice(6).split(",").map((o) => { const [val, n] = o.split("="); return `<option value="${_biE(val)}" ${v === val ? "selected" : ""}>${_biE(n || val)}</option>`; }).join("")}</select></label>`;
    return `<label>${lbl}<input class="input" id="bi-${k}" type="${tipe}" value="${_biE(v)}"></label>`;
  };
  const sec = document.getElementById("page-rg");
  sec.innerHTML = `<div class="bil al-form"><h3 class="bil-judul">✏️ Lengkapi Buku Induk — ${_biE(x.nama)}</h3>
    ${Object.keys(BI_BAGIAN).map((b) => { const f = BI_TAMBAH.filter((z) => z[0] === b); return f.length ? `<section class="bil-kartu lebar"><header><i>${BI_IKON_BAGIAN[b]}</i><h4>${BI_BAGIAN[b]}</h4></header><div class="al-grid">${f.map(kolom).join("")}</div></section>` : ""; }).join("")}
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
  _biXlsx(d.map((x) => { const t = BI.tambah[x.id] || {}, k = biKeadaan(x); return { Jenjang: _biNamaRg(x.ruang_id), "No Induk": x.nis || "", NISN: x.nisn || "", NIK: x.nik || "", "No KK": x.no_kk || "", Nama: x.nama, "L/P": biJk(x), "Tempat Lahir": x.tempat_lahir || "", "Tanggal Lahir": x.tanggal_lahir || "", Agama: t.agama || "Islam", Kewarganegaraan: t.kewarganegaraan || "WNI", "Anak Ke": t.anak_ke || "", "Jumlah Saudara": t.jml_saudara || "", "Status Anak": t.status_anak || "", Alamat: x.alamat_asal || "", "Tinggal Dengan": t.tinggal_dengan || "", "Sekolah Asal": x.sekolah_asal || "", "Diterima Kelas": t.diterima_kelas || "", "Tanggal Diterima": t.tgl_diterima || "", "Nama Ayah": x.nama_ayah || "", "Pekerjaan Ayah": x.pekerjaan_ayah || "", "Nama Ibu": x.nama_ibu || "", "Pekerjaan Ibu": x.pekerjaan_ibu || "", "Nama Wali": t.nama_wali || "", Keadaan: k.teks, "Alasan Keluar": x.status_aktif === false ? x.alasan_mutasi || "" : "", "No Seri Ijazah": t.no_ijazah || "", "Belum Diisi": biKurang(x).join("; ") }; }), "Buku Induk", `Buku Induk ${_biNamaRg(BI.f.rg)} ${tanggalISO()}.xlsx`);
  if (typeof _rgLog === "function") _rgLog("unduh-buku-induk", { ruang: BI.f.rg, jumlah: d.length });
}

// ── BUKU KLAPER (indeks abjad) ──
async function biBukaKlaper(muatUlang) {
  const sec = _rgBukaHal("pg-klaper", "Buku Klaper", `<div class="card"><div class="rg-memuat">Memuat Buku Klaper…</div></div>`);
  try { await biMuat(muatUlang); BI._kunciAnim = ""; sec.innerHTML = `<div id="bk-wrap"></div>`; _biSegar("bk-wrap", _biHtmlKlaper); }
  catch (e) { sec.innerHTML = `<div class="card">Gagal memuat: ${_biE(e.message)}</div>`; }
}
function biRgKlaper(r) { BI.k.rg = r; _biSegar("bk-wrap", _biHtmlKlaper); }
function _biDataKlaper() { return _biSaring({ rg: BI.k.rg, status: BI.k.status, cari: BI.k.cari || "" }).sort((a, b) => a.nama.localeCompare(b.nama, "id")); }
const _biHuruf = (n) => (String(n || "").trim()[0] || "#").toUpperCase().replace(/[^A-Z]/, "#");
const _biInisial = (n) => String(n || "?").trim().split(/\s+/).slice(0, 2).map((w) => w[0] || "").join("").toUpperCase();
function _biHtmlKlaper() {
  const d = _biDataKlaper(), kel = {}; d.forEach((x) => (kel[_biHuruf(x.nama)] = kel[_biHuruf(x.nama)] || []).push(x));
  const huruf = Object.keys(kel).sort(), gabung = BI.k.rg === "semua", semua = (BI.siswa || []).filter((x) => gabung || x.ruang_id === BI.k.rg);
  const hit = (kode) => semua.filter((x) => biKeadaan(x).kode === kode).length, L = semua.filter((x) => biJk(x) === "L").length, P = semua.filter((x) => biJk(x) === "P").length;
  return `<div class="bk2" style="--bk:${BI_WARNA_RG[BI.k.rg] || "#8a5523"}">
    <div class="bk2-hero"><div><small>📇 BUKU KLAPER · INDEKS ABJAD PESERTA DIDIK</small><h2>${_biE(_biNamaRg(BI.k.rg))}</h2><p>Daftar seluruh peserta didik menurut abjad — aktif, lulus, dan keluar — beserta No. Induk dan NISN.</p></div>
      ${_biAngka([["catat", "Tercatat", semua.length], ["aktif", "Aktif", hit("aktif")], ["lulus", "Lulus", hit("lulus")], ["keluar", "Keluar", hit("mutasi")], ["l", "Laki-laki", L], ["p", "Perempuan", P]])}</div>
    ${_biTabRg(BI.k.rg, "biRgKlaper")}
    <div class="bk2-alat">
      <div class="bk2-cari">🔎<input class="bi-cari" placeholder="Cari nama, No. Induk, NISN…" value="${_biE(BI.k.cari || "")}" oninput="BI.k.cari=this.value;_biSegar('bk-wrap',_biHtmlKlaper,true)"></div>
      <div class="bk2-chip">${[["semua", "Semua"], ["aktif", "Aktif"], ["keluar", "Lulus & Keluar"]].map(([k, n]) => `<button class="${BI.k.status === k ? "on" : ""}" style="--cw:${_biCw(k)}" onclick="BI.k.status='${k}';_biSegar('bk-wrap',_biHtmlKlaper)">${n}</button>`).join("")}</div>
      <span class="bk2-jml">${d.length} santri</span>
      <button class="bk2-btn" onclick="biCetakKlaper()">🖨️ Cetak</button><button class="bk2-btn utama" onclick="biUnduhKlaper()">⬇️ Unduh Excel${gabung ? " (Semua Jenjang)" : ""}</button></div>
    <div class="bk2-abjad">${"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((h) => kel[h] ? `<a href="#bk-${h}" onclick="event.preventDefault();document.getElementById('bk-${h}').scrollIntoView({behavior:'smooth',block:'start'})">${h}</a>` : `<span>${h}</span>`).join("")}</div>
    ${huruf.map((h) => `<section class="bk2-grup" id="bk-${h}"><header><span class="bk2-hrf">${h}</span><small>${kel[h].length} santri</small></header>
      <div class="bi2-wadah tipis"><table class="bi2-tabel" style="min-width:${gabung ? 920 : 830}px"><colgroup><col style="width:44px"><col><col style="width:96px"><col style="width:120px">${gabung ? '<col style="width:92px">' : ""}<col style="width:56px"><col style="width:70px"><col style="width:170px"></colgroup>
        <thead><tr><th class="c">No</th><th>Nama Lengkap</th><th>No. Induk</th><th>NISN</th>${gabung ? "<th>Jenjang</th>" : ""}<th class="c">L/P</th><th class="c">Masuk</th><th>Keadaan</th></tr></thead><tbody>
        ${kel[h].map((x, i) => { const k = biKeadaan(x), jk = biJk(x); return `<tr class="klik k-${k.kode}" onclick="biLembar('${x.id}')"><td class="c redup">${i + 1}</td>
          <td class="nama"><span class="bi2-nm"><i class="bk2-av">${_biE(_biInisial(x.nama))}</i><b>${_biE(x.nama)}</b></span></td><td class="mono">${_biE(x.nis || "—")}</td><td class="mono">${_biE(x.nisn || "—")}</td>
          ${gabung ? `<td>${_biPillRg(x.ruang_id)}</td>` : ""}<td class="c"><em class="bk2-jk ${jk === "P" ? "p" : "l"}">${_biE(jk || "—")}</em></td><td class="c">${_biE(biTahunMasuk(x) || "—")}</td><td><em class="bk2-st ${k.kode}">${_biE(k.teks)}</em></td></tr>`; }).join("")}
      </tbody></table></div></section>`).join("") || `<div class="bk2-kosong">Tidak ada santri yang cocok.</div>`}
  </div>`;
}
function biCetakKlaper() {
  const d = _biDataKlaper(), kel = {}, gabung = BI.k.rg === "semua"; d.forEach((x) => (kel[_biHuruf(x.nama)] = kel[_biHuruf(x.nama)] || []).push(x));
  _biCetak("Buku Klaper " + _biNamaRg(BI.k.rg), `<h2>BUKU KLAPER PESERTA DIDIK</h2><p style="text-align:center;margin-top:-6px">${_biE(_biNamaRg(BI.k.rg))}</p>
    <table><tr><th>No</th><th>Nama</th><th>No. Induk</th><th>NISN</th>${gabung ? "<th>Jenjang</th>" : ""}<th>L/P</th><th>Masuk</th><th>Keadaan</th></tr>
    ${Object.keys(kel).sort().map((h) => `<tr><td class="huruf" colspan="${gabung ? 8 : 7}">${h}</td></tr>${kel[h].map((x, i) => `<tr><td>${i + 1}</td><td>${_biE(x.nama)}</td><td>${_biE(x.nis || "")}</td><td>${_biE(x.nisn || "")}</td>${gabung ? `<td>${_biE(_biNamaRg(x.ruang_id))}</td>` : ""}<td>${_biE(biJk(x))}</td><td>${_biE(biTahunMasuk(x))}</td><td>${_biE(biKeadaan(x).teks)}</td></tr>`).join("")}`).join("")}</table>`);
}
function biUnduhKlaper() {
  const d = _biDataKlaper();
  _biXlsx(d.map((x, i) => ({ No: i + 1, Huruf: _biHuruf(x.nama), Nama: x.nama, Jenjang: _biNamaRg(x.ruang_id), "No Induk": x.nis || "", NISN: x.nisn || "", "L/P": biJk(x), "Tahun Masuk": biTahunMasuk(x) || "", Keadaan: biKeadaan(x).teks })), "Buku Klaper", `Buku Klaper ${_biNamaRg(BI.k.rg)} ${tanggalISO()}.xlsx`);
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
    RG_IKON["pg-induk-guru"] = '<circle cx="9" cy="7" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4h5M16 8h5M16 12h3"/>';
    RG_IKON["pg-klaper"] = '<path d="M5 4h14v16H5z"/><path d="M9 4v16"/><path d="M12 9h4M12 13h4"/>';
    RG_IKON["pg-cari"] = '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>';
  }
  if (typeof RG_MENU_PENGELOLA !== "undefined") {
    const g = RG_MENU_PENGELOLA.find((x) => x.group === "Data");
    if (g) {
      if (!g.items.some((x) => x[0] === "pg-cari")) g.items.unshift(["pg-cari", "", "Pencarian Cepat"]);
      g.items = g.items.filter((x) => x[0] !== "pg-pd" && x[0] !== "pg-ptk");
      [["pg-induk", "Buku Induk Siswa"], ["pg-induk-guru", "Buku Induk Guru & PTK"], ["pg-klaper", "Buku Klaper"]].forEach(([k, n]) => { if (!g.items.some((x) => x[0] === k)) g.items.push([k, "", n]); });
    }
  }
  if (typeof PG_MODUL_SIAP !== "undefined") ["pg-cari", "pg-induk", "pg-induk-guru", "pg-klaper"].forEach((k) => { if (!PG_MODUL_SIAP.includes(k)) PG_MODUL_SIAP.push(k); });
  if (typeof rgBukaPengelola === "function") {
    const a = rgBukaPengelola;
    rgBukaPengelola = async function (key) { if (key === "pg-induk" || key === "pg-pd") { BI.mode = "pd"; return biBukaInduk(); } if (key === "pg-induk-guru" || key === "pg-ptk") { BI.mode = "guru"; return biBukaInduk(); } if (key === "pg-klaper") return biBukaKlaper(); if (key === "pg-cari") return biBukaCari(); return a.apply(this, arguments); };
  }
})();

// ============================================================
//  RUANG PENGELOLA — modul data gabungan seluruh jenjang
//  • Peserta Didik: santri aktif/mutasi Paket A, Putra, Putri dalam satu daftar (saring jenjang, kelas,
//    paket, cari nama/NISN), ringkasan per jenjang & paket, unduh Excel.
//  • Guru & PTK: semua guru/tenaga kependidikan, ruang tempat bertugas, ruang utama, jenis, jabatan,
//    TMT, kontak, status akun; saring & unduh Excel.
//  Data dibaca lewat klien lintas ruang (supaSemua). Hanya Admin & anggota Pengelola yang bisa membuka.
// ============================================================
const PG_MODUL_SIAP = ["pg-pd", "pg-ptk"];
const PGL = { pd: null, ptk: null, kelas: [], f: { ruang: "semua", kelas: "", paket: "", cari: "", status: "aktif" }, g: { ruang: "semua", cari: "", jenis: "" } };
const _pglE = (s) => escapeHtml(s == null ? "" : String(s));
const _pglPaket = (k) => { const n = parseInt(String(k || "").replace(/\D/g, ""), 10); return !n ? "-" : n <= 6 ? "A" : n <= 9 ? "B" : "C"; };
const _pglTgl = (d) => (d ? new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) : "-");

const _pglBukaAsli = rgBukaPengelola;
rgBukaPengelola = async function (key = "pg-beranda") {
  if (key === "pg-pd") return pglBukaPesertaDidik();
  if (key === "pg-ptk") return pglBukaPtk();
  return _pglBukaAsli(key);
};

// ── Peserta Didik ──
async function pglBukaPesertaDidik(muatUlang) {
  const sec = _rgBukaHal("pg-pd", "Peserta Didik", `<div class="card"><div class="rg-memuat">Memuat peserta didik seluruh jenjang…</div></div>`);
  try {
    if (!PGL.pd || muatUlang) {
      const [s, k] = await Promise.all([
        supaSemua.from("siswa").select("id,nama,nis,nisn,nik,no_kk,tempat_lahir,tanggal_lahir,angkatan,status_aktif,tanggal_mutasi,alasan_mutasi,nama_ayah,nama_ibu,no_wa_ayah,no_wa_ibu,alamat_asal,sekolah_asal,kelas_id,ruang_id").order("nama"),
        supaSemua.from("kelas").select("id,nama_kelas,ruang_id"),
      ]);
      if (s.error) throw s.error;
      PGL.kelas = k.data || [];
      const kl = Object.fromEntries(PGL.kelas.map((x) => [x.id, x]));
      PGL.pd = (s.data || []).filter((x) => x.ruang_id !== "Pg").map((x) => ({ ...x, kelas: kl[x.kelas_id]?.nama_kelas || "", paket: _pglPaket(kl[x.kelas_id]?.nama_kelas) }));
    }
    sec.innerHTML = `<div id="pg-pd">${_pglHtmlPd()}</div>`;
  } catch (e) { sec.innerHTML = `<div class="card">Gagal memuat: ${_pglE(e.message)}</div>`; }
}
function _pglSaringPd() {
  const f = PGL.f, cari = f.cari.toLowerCase();
  return (PGL.pd || []).filter((x) => (f.status === "aktif" ? x.status_aktif !== false : x.status_aktif === false)
    && (f.ruang === "semua" || x.ruang_id === f.ruang) && (!f.kelas || x.kelas_id === f.kelas) && (!f.paket || x.paket === f.paket)
    && (!cari || [x.nama, x.nisn, x.nis].some((v) => String(v || "").toLowerCase().includes(cari))));
}
function _pglHtmlPd() {
  const f = PGL.f, aktif = (PGL.pd || []).filter((x) => x.status_aktif !== false), daftar = _pglSaringPd();
  const jenjang = (RG.daftar.length ? RG.daftar : RG.bawaan).filter((r) => r.jenjang);
  const per = (id) => aktif.filter((x) => x.ruang_id === id).length, perPaket = (p) => aktif.filter((x) => x.paket === p).length;
  const kelasRuang = PGL.kelas.filter((k) => f.ruang === "semua" || k.ruang_id === f.ruang).sort((a, b) => (a.ruang_id + dsUrutKelas(a.nama_kelas)).localeCompare(b.ruang_id + dsUrutKelas(b.nama_kelas), "id", { numeric: true }));
  return `<div class="pg-kartu-baris">
      ${jenjang.map((r) => `<button class="pg-angka ${f.ruang === r.id ? "aktif" : ""}" style="--rw:${r.warna}" onclick="PGL.f.ruang=PGL.f.ruang==='${r.id}'?'semua':'${r.id}';PGL.f.kelas='';_pglSegarPd()"><span>${rgIkonRuang(r.id)}${_pglE(rgNamaPendek(r.id))}</span><b>${per(r.id)}</b><small>peserta didik aktif</small></button>`).join("")}
      <div class="pg-angka total"><span>Seluruh PKBM</span><b>${aktif.length}</b><small>Paket A ${perPaket("A")} · Paket B ${perPaket("B")} · Paket C ${perPaket("C")}</small></div>
    </div>
    <div class="card pg-alat">
      <input class="input" placeholder="Cari nama, NIS, atau NISN…" value="${_pglE(f.cari)}" oninput="PGL.f.cari=this.value;_pglSegarPd(true)">
      <select class="input" onchange="PGL.f.kelas=this.value;_pglSegarPd()"><option value="">Semua Kelas</option>${kelasRuang.map((k) => `<option value="${k.id}" ${f.kelas === k.id ? "selected" : ""}>${_pglE(rgNamaPendek(k.ruang_id))} · ${_pglE(formatKelasLabel(k.nama_kelas))}</option>`).join("")}</select>
      <select class="input" onchange="PGL.f.paket=this.value;_pglSegarPd()"><option value="">Semua Paket</option>${["A", "B", "C"].map((p) => `<option ${f.paket === p ? "selected" : ""} value="${p}">Paket ${p}</option>`).join("")}</select>
      <div class="ua-saring">${[["aktif", "Aktif"], ["mutasi", "Mutasi / Lulus"]].map(([k, n]) => `<button class="ua-saring-b ${f.status === k ? "aktif" : ""}" onclick="PGL.f.status='${k}';_pglSegarPd()">${n}</button>`).join("")}</div>
      <span class="pg-jml">${daftar.length} santri</span>
      <button class="btn btn-accent" onclick="pglUnduhPd()">Unduh Excel</button>
    </div>
    <div class="card" style="overflow-x:auto"><table class="table pg-tabel"><thead><tr><th>No</th><th>Nama</th><th>Jenjang</th><th>Kelas</th><th>NISN</th><th>NIK</th><th>Tempat, Tgl Lahir</th><th>Orang Tua</th>${f.status === "mutasi" ? "<th>Mutasi</th>" : ""}</tr></thead><tbody>
      ${daftar.slice(0, 500).map((x, i) => `<tr><td>${i + 1}</td><td><b>${_pglE(x.nama)}</b></td><td><span class="pg-chip" style="--rw:${rgRuang(x.ruang_id).warna}">${_pglE(rgNamaPendek(x.ruang_id))}</span></td>
        <td>${x.kelas ? badgeKelas(x.kelas) : "-"}</td><td>${_pglE(x.nisn || "-")}</td><td>${_pglE(x.nik || "-")}</td><td>${_pglE([x.tempat_lahir, x.tanggal_lahir ? _pglTgl(x.tanggal_lahir) : ""].filter(Boolean).join(", ") || "-")}</td>
        <td>${_pglE(x.nama_ayah || x.nama_ibu || "-")}</td>${f.status === "mutasi" ? `<td>${_pglTgl(x.tanggal_mutasi)}<br><small>${_pglE(x.alasan_mutasi || "")}</small></td>` : ""}</tr>`).join("") || `<tr><td colspan="9" class="empty-state">Tidak ada data.</td></tr>`}
    </tbody></table>${daftar.length > 500 ? `<p class="rg-ket">Menampilkan 500 dari ${daftar.length}. Unduh Excel untuk data lengkap.</p>` : ""}</div>`;
}
function _pglSegarPd(fokus) {
  const w = qs("pg-pd"); if (!w) return;
  const pos = fokus ? w.querySelector(".pg-alat input")?.selectionStart : null;
  w.innerHTML = _pglHtmlPd();
  if (fokus) { const i = w.querySelector(".pg-alat input"); i.focus(); try { i.setSelectionRange(pos, pos); } catch (e) {} }
}
function pglUnduhPd() {
  const d = _pglSaringPd();
  const baris = d.map((x, i) => ({ No: i + 1, Nama: x.nama, Jenjang: rgRuang(x.ruang_id).nama, Paket: x.paket, Kelas: x.kelas, NIS: x.nis || "", NISN: x.nisn || "", NIK: x.nik || "", "No KK": x.no_kk || "",
    "Tempat Lahir": x.tempat_lahir || "", "Tanggal Lahir": x.tanggal_lahir || "", Angkatan: x.angkatan || "", "Nama Ayah": x.nama_ayah || "", "Nama Ibu": x.nama_ibu || "",
    "WA Ayah": x.no_wa_ayah || "", "WA Ibu": x.no_wa_ibu || "", "Sekolah Asal": x.sekolah_asal || "", Alamat: x.alamat_asal || "",
    Status: x.status_aktif === false ? "Mutasi/Lulus" : "Aktif", "Tanggal Mutasi": x.tanggal_mutasi || "", "Alasan Mutasi": x.alasan_mutasi || "" }));
  _pglUnduh(baris, "Peserta Didik", `Peserta Didik PKBM Al-Umm Barabai ${tanggalISO()}.xlsx`);
  _rgLog("unduh-peserta-didik", { jumlah: baris.length });
}

// ── Guru & PTK ──
async function pglBukaPtk(muatUlang) {
  const sec = _rgBukaHal("pg-ptk", "Guru & PTK", `<div class="card"><div class="rg-memuat">Memuat guru & tenaga kependidikan…</div></div>`);
  try {
    if (!PGL.ptk || muatUlang) {
      const r = await supaSemua.from("guru").select("*").order("nama");
      if (r.error) throw r.error;
      PGL.ptk = r.data || [];
    }
    sec.innerHTML = `<div id="pg-ptk">${_pglHtmlPtk()}</div>`;
  } catch (e) { sec.innerHTML = `<div class="card">Gagal memuat: ${_pglE(e.message)}</div>`; }
}
const _pglJenis = { dalam: "Guru Dalam", luar: "Guru Luar", afiliasi: "Afiliasi", sukarelawan: "Sukarelawan", ekskul: "Ekskul" };
function _pglSaringPtk() {
  const f = PGL.g, cari = f.cari.toLowerCase();
  return (PGL.ptk || []).filter((g) => g.status_aktif !== false && (f.ruang === "semua" || (g.ruang || []).includes(f.ruang)) && (!f.jenis || g.jenis_guru === f.jenis)
    && (!cari || [g.nama, g.jabatan, g.email].some((v) => String(v || "").toLowerCase().includes(cari))));
}
function _pglHtmlPtk() {
  const f = PGL.g, aktif = (PGL.ptk || []).filter((g) => g.status_aktif !== false), daftar = _pglSaringPtk();
  const jenjang = RG.daftar.length ? RG.daftar : RG.bawaan;
  const utama = (id) => aktif.filter((g) => rgRuangUtama(g) === id).length, anggota = (id) => aktif.filter((g) => (g.ruang || []).includes(id)).length;
  return `<div class="pg-kartu-baris">
      ${jenjang.map((r) => `<button class="pg-angka ${f.ruang === r.id ? "aktif" : ""}" style="--rw:${r.warna}" onclick="PGL.g.ruang=PGL.g.ruang==='${r.id}'?'semua':'${r.id}';_pglSegarPtk()"><span>${rgIkonRuang(r.id)}${_pglE(rgNamaPendek(r.id))}</span><b>${r.jenjang ? utama(r.id) : anggota(r.id)}</b><small>${r.jenjang ? `tutor utama · ${anggota(r.id)} bertugas` : "anggota"}</small></button>`).join("")}
      <div class="pg-angka total"><span>Seluruh PKBM</span><b>${aktif.length}</b><small>guru & PTK aktif · ${aktif.filter((g) => g.auth_user_id).length} punya akun</small></div>
    </div>
    <div class="card pg-alat">
      <input class="input" placeholder="Cari nama, jabatan, atau email…" value="${_pglE(f.cari)}" oninput="PGL.g.cari=this.value;_pglSegarPtk(true)">
      <select class="input" onchange="PGL.g.jenis=this.value;_pglSegarPtk()"><option value="">Semua Jenis</option>${Object.entries(_pglJenis).map(([k, n]) => `<option value="${k}" ${f.jenis === k ? "selected" : ""}>${n}</option>`).join("")}</select>
      <span class="pg-jml">${daftar.length} orang</span>
      <button class="btn btn-accent" onclick="pglUnduhPtk()">Unduh Excel</button>
    </div>
    <div class="card" style="overflow-x:auto"><table class="table pg-tabel"><thead><tr><th>No</th><th>Nama</th><th>Bertugas Di</th><th>Jenis</th><th>Jabatan</th><th>TMT</th><th>No. WA</th><th>Akun</th></tr></thead><tbody>
      ${daftar.map((g, i) => `<tr><td>${i + 1}</td><td><b>${_pglE(g.nama)}</b>${g.nip_nik ? `<br><small>NIK ${_pglE(g.nip_nik)}</small>` : ""}</td>
        <td>${(g.ruang || []).map((id) => `<span class="pg-chip ${rgRuangUtama(g) === id ? "utama" : ""}" style="--rw:${rgRuang(id).warna}" title="${rgRuangUtama(g) === id ? "Ruang utama" : ""}">${_pglE(rgNamaPendek(id))}</span>`).join(" ")}</td>
        <td>${_pglE(_pglJenis[g.jenis_guru] || g.jenis_guru || "-")}</td><td><small>${_pglE(g.jabatan || "-")}</small></td><td>${_pglTgl(g.tmt)}</td><td>${_pglE(g.no_wa || "-")}</td>
        <td>${g.auth_user_id ? (g.akun_menunggu ? '<span class="ak-tunggu">Menunggu</span>' : "✓") : '<span class="ak-belum">Belum</span>'}</td></tr>`).join("") || `<tr><td colspan="8" class="empty-state">Tidak ada data.</td></tr>`}
    </tbody></table></div>`;
}
function _pglSegarPtk(fokus) {
  const w = qs("pg-ptk"); if (!w) return;
  const pos = fokus ? w.querySelector(".pg-alat input")?.selectionStart : null;
  w.innerHTML = _pglHtmlPtk();
  if (fokus) { const i = w.querySelector(".pg-alat input"); i.focus(); try { i.setSelectionRange(pos, pos); } catch (e) {} }
}
function pglUnduhPtk() {
  const baris = _pglSaringPtk().map((g, i) => ({ No: i + 1, Nama: g.nama, NIK: g.nip_nik || "", "Bertugas Di": (g.ruang || []).map((id) => rgRuang(id).nama).join(", "),
    "Ruang Utama": rgRuangUtama(g) ? rgRuang(rgRuangUtama(g)).nama : "", Jenis: _pglJenis[g.jenis_guru] || g.jenis_guru || "", Jabatan: g.jabatan || "",
    "Tempat Lahir": g.tempat_lahir || "", "Tanggal Lahir": g.tanggal_lahir || "", TMT: g.tmt || "", "No WA": g.no_wa || "", Email: g.email || "",
    Akun: g.auth_user_id ? (g.akun_menunggu ? "Menunggu" : "Ada") : "Belum" }));
  _pglUnduh(baris, "Guru & PTK", `Guru dan PTK PKBM Al-Umm Barabai ${tanggalISO()}.xlsx`);
  _rgLog("unduh-guru-ptk", { jumlah: baris.length });
}
function _pglUnduh(baris, lembar, nama) {
  if (typeof XLSX === "undefined") { toast("Pustaka Excel belum termuat, coba lagi", "err"); return; }
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(baris.length ? baris : [{ Keterangan: "(kosong)" }]), lembar);
  XLSX.writeFile(wb, nama);
  toast(`⬇️ ${baris.length} baris diunduh`, "ok");
}

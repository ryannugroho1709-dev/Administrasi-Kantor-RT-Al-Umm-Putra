// ============================================================
//  DATA SISWA — tampilan atas yang rapi + naik kelas otomatis
//  • Tombol "Tambah Santri" menonjol; Impor/Ekspor/Upload Foto dalam satu menu "Data" (Cek Dapodik ada di kartu bawah).
//  • Kelas berupa chip berwarna khas (ketuk = saring santri kelas itu), urut 1, 2 A, 2 B, …
//  • Paket A cukup Total; Putra & Putri menampilkan Paket B / Paket C.
//  • Upload Foto: khusus Admin & Admin Pendamping, dengan petunjuk dulu.
//  • Naik kelas OTOMATIS saat tanggal "Pembagian Rapor Semester Genap" di Kalender Akademik Putra
//    sudah lewat (sekali per tahun per ruang).
// ============================================================

// Warna khas tiap kelas (sama di semua ruang); kelas paralel (A/B) beda kecerahan
const DS_WARNA_KELAS = { 1: "#e11d48", 2: "#ea580c", 3: "#ca8a04", 4: "#16a34a", 5: "#0d9488", 6: "#0284c7", 7: "#4f46e5", 8: "#7c3aed", 9: "#c026d3", 10: "#db2777", 11: "#0f766e", 12: "#b45309" };
function dsUrutKelas(nama) {
  const m = String(nama || "").match(/(\d+)\s*([A-Za-z])?/);
  return m ? parseInt(m[1], 10) * 10 + (m[2] ? m[2].toUpperCase().charCodeAt(0) - 64 : 0) : 9999;
}
// warna sama dengan lencana kelas di tabel & jadwal (warnaKelas); kelas paralel B sedikit lebih gelap
function dsWarnaKelas(nama) {
  const m = String(nama || "").match(/(\d+)\s*([A-Za-z])?/);
  const dasar = typeof warnaKelas === "function" ? warnaKelas(nama).text : (DS_WARNA_KELAS[m ? +m[1] : 0] || "#64748b");
  return m && m[2] && m[2].toUpperCase() === "B" ? `color-mix(in srgb, ${dasar} 72%, #000)` : dasar;
}
const _dsRuang = () => (typeof STATE !== "undefined" && STATE.ruang) || "Pa";

// ── Ringkasan kelas: chip berwarna yang bisa diketuk ──
renderRingkasanKelasSiswa = async function () {
  const target = qs("data-siswa-ringkasan");
  if (!target) return;
  try {
    const rows = (await apiGetJumlahSiswaPerKelas()).sort((a, b) => dsUrutKelas(a.nama_kelas) - dsUrutKelas(b.nama_kelas));
    const total = rows.reduce((s, r) => s + r.jumlah, 0);
    const pilih = qs("ds-filter-kelas")?.value || "";
    const no = (r) => parseInt(String(r.nama_kelas || "").match(/(\d+)/)?.[1] || "0", 10);
    const paket = _dsRuang() === "A" ? "" : (() => {
      const b = rows.filter((r) => no(r) >= 7 && no(r) <= 9).reduce((s, r) => s + r.jumlah, 0), c = rows.filter((r) => no(r) >= 10 && no(r) <= 12).reduce((s, r) => s + r.jumlah, 0);
      return `<span class="ds-paket2">Paket B <b>${b}</b></span><span class="ds-paket2">Paket C <b>${c}</b></span>`;
    })();
    target.innerHTML = `<div class="ds-kelas-baris">
      <button class="ds-kelas-chip semua ${pilih ? "" : "aktif"}" onclick="dsPilihKelas('')"><span>Semua</span><b>${total}</b></button>
      ${rows.map((r) => `<button class="ds-kelas-chip ${pilih === r.kelas_id ? "aktif" : ""}" style="--kw:${dsWarnaKelas(r.nama_kelas)}" onclick="dsPilihKelas('${r.kelas_id}')"><span>${escapeHtml(formatKelasLabel(r.nama_kelas))}</span><b>${r.jumlah}</b></button>`).join("")}
      ${paket ? `<span class="ds-pemisah2"></span>${paket}` : ""}
    </div>`;
  } catch (e) { console.error(e); }
};
function dsPilihKelas(id) {
  const sel = qs("ds-filter-kelas");
  if (!sel) return;
  if (![...sel.options].some((o) => o.value === id) && id) { const o = document.createElement("option"); o.value = id; sel.appendChild(o); }
  sel.value = sel.value === id ? "" : id;
  renderDataSiswa();
}

// ── Menu "Data" (Impor / Ekspor / Cek Dapodik / Upload Foto) ──
const dsBolehFoto = () => (typeof isAdmin === "function" && isAdmin()) || (typeof rgPendamping === "function" && rgPendamping());
function dsMenuData(btn) {
  const ada = qs("ds-menu-data");
  if (ada) { ada.remove(); return; }
  const el = document.createElement("div");
  el.id = "ds-menu-data"; el.className = "ds-menu";
  el.innerHTML = `<button onclick="qs('siswa-file-input').click()"><b>Impor Data</b><small>Tambah banyak santri dari Excel, CSV, PDF, atau Word</small></button>
    <button onclick="eksporDataSiswaAdministrasi()"><b>Ekspor Excel</b><small>Unduh data santri lengkap</small></button>
    ${dsBolehFoto() ? `<button onclick="dsPanduanFoto()"><b>Upload Foto Massal</b><small>Khusus Admin & Admin Pendamping</small></button>` : ""}`;
  btn.parentElement.appendChild(el);
  setTimeout(() => document.addEventListener("click", function tutup(e) { if (!el.contains(e.target) && e.target !== btn) { el.remove(); document.removeEventListener("click", tutup); } }), 0);
}
function dsPanduanFoto() {
  qs("ds-menu-data")?.remove();
  if (!dsBolehFoto()) { toast("Upload foto khusus Admin & Admin Pendamping", "warn"); return; }
  openModal(`<h3>Upload Foto Santri Sekaligus</h3>
    <div class="ds-panduan">
      <div><b>1</b><p><b>Ganti nama file foto</b> sesuai nama santri, persis seperti di Data Siswa. Contoh: <code>Ahmad Fauzi.jpg</code></p></div>
      <div><b>2</b><p>Gunakan foto <b>tegak (potret)</b>, setengah badan, wajah jelas, latar polos. Format JPG atau PNG.</p></div>
      <div><b>3</b><p>Tekan <b>Pilih Foto</b>, lalu pilih <b>banyak foto sekaligus</b> (tahan Ctrl di komputer, atau centang banyak di HP).</p></div>
      <div><b>4</b><p>Aplikasi mencocokkan nama file dengan nama santri dan menampilkan hasilnya. <b>Periksa dulu</b> sebelum menyimpan; yang tidak cocok bisa dilewati.</p></div>
    </div>
    <p class="ds-catatan">Foto santri Putri hanya bisa dilihat Pengelola dan guru Putri.</p>
    <button class="btn btn-accent" style="width:100%" onclick="closeModal();qs('siswa-foto-bulk-input').click()">Pilih Foto</button>`);
}

// ── Naik kelas otomatis (tanggal Pembagian Rapor Semester Genap di Kalender Akademik Putra) ──
async function _dsTanggalRaporGenap() {
  const k = typeof supaSemua !== "undefined" ? supaSemua : supa;
  const r = await k.from("kaldik_item").select("judul,tanggal_mulai").eq("ruang_id", "Pa").or("judul.ilike.*rapor*,judul.ilike.*raport*,judul.ilike.*rapot*").order("tanggal_mulai", { ascending: false }).limit(20);
  const daftar = (r.data || []).filter((x) => /genap|kenaikan/i.test(x.judul) || [5, 6].includes(new Date(x.tanggal_mulai).getMonth()));
  return daftar.length ? daftar[0] : null;
}
function _dsRencanaNaik(kelas) {
  const info = kelas.map((k) => { const m = String(k.nama_kelas).match(/(\d+)\s*([A-Za-z])?/); return m ? { ...k, angka: +m[1], huruf: (m[2] || "").toUpperCase() } : null; }).filter(Boolean);
  const maks = Math.max(...info.map((k) => k.angka));
  return info.map((k) => {
    if (k.angka === maks) return { asal: k, lulus: true };
    const calon = info.filter((x) => x.angka === k.angka + 1);
    const tujuan = calon.length === 1 ? calon[0] : calon.find((x) => x.huruf && x.huruf === k.huruf) || null;
    return { asal: k, tujuan, ragu: !tujuan && calon.length > 1 ? calon : null };
  });
}
async function dsNaikKelasOtomatis() {
  try {
    if (!(typeof isAdmin === "function" && isAdmin()) && !(typeof rgPendamping === "function" && rgPendamping())) return;
    if (_dsRuang() === "Pg" || (typeof STATE !== "undefined" && STATE.modeLihat)) return;
    const rapor = await _dsTanggalRaporGenap();
    if (!rapor || tanggalISO() < rapor.tanggal_mulai) return;
    const kunci = "naik_kelas:" + rapor.tanggal_mulai;
    if (await _kvAmbil(kunci, null)) return; // sudah diproses untuk ruang ini
    await ensureLookups();
    const rencana = _dsRencanaNaik(LOOKUP.kelas || []);
    const jumlah = new Map((await apiGetJumlahSiswaPerKelas()).map((r) => [r.kelas_id, r.jumlah]));
    const hasil = [], ditunda = [];
    // dari kelas tertinggi ke terendah supaya santri tidak naik dua kali
    for (const r of rencana.sort((a, b) => b.asal.angka - a.asal.angka || b.asal.huruf.localeCompare(a.asal.huruf))) {
      const n = jumlah.get(r.asal.id) || 0;
      if (!n) continue;
      if (r.lulus) { await apiLuluskanKelas(r.asal.id, rapor.tanggal_mulai); hasil.push(`${formatKelasLabel(r.asal.nama_kelas)}: ${n} santri lulus`); }
      else if (r.tujuan) { await apiNaikKelasSatuTingkat(r.asal.id, r.tujuan.id); hasil.push(`${formatKelasLabel(r.asal.nama_kelas)} → ${formatKelasLabel(r.tujuan.nama_kelas)}: ${n} santri`); }
      else ditunda.push(`${formatKelasLabel(r.asal.nama_kelas)} (${n} santri) → ${r.ragu ? r.ragu.map((x) => formatKelasLabel(x.nama_kelas)).join(" / ") : "kelas berikutnya belum ada"}`);
    }
    await _kvSimpan(kunci, { t: new Date().toISOString(), oleh: STATE.guruNama, hasil, ditunda });
    if (typeof _rgLog === "function") _rgLog("naik-kelas-otomatis", { tanggal: rapor.tanggal_mulai, hasil, ditunda });
    openModal(`<h3>Naik Kelas Otomatis</h3><p class="ds-catatan">Tanggal ${escapeHtml(rapor.judul)} (${new Date(rapor.tanggal_mulai).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}) sudah lewat, santri di ruang ini dinaikkan kelasnya.</p>
      <ul class="ds-hasil">${hasil.map((x) => `<li>${escapeHtml(x)}</li>`).join("") || "<li>Tidak ada santri yang perlu dinaikkan.</li>"}</ul>
      ${ditunda.length ? `<p class="ds-catatan"><b>Perlu dibagi manual</b> (kelas tujuan lebih dari satu) — pilih santri di Data Siswa lalu pakai <b>Pindahkan ke Kelas</b>:</p><ul class="ds-hasil">${ditunda.map((x) => `<li>${escapeHtml(x)}</li>`).join("")}</ul>` : ""}
      <button class="btn btn-accent" style="width:100%" onclick="closeModal()">Mengerti</button>`);
  } catch (e) { console.warn("Naik kelas otomatis gagal:", e); }
}
(function pasangNaikOtomatis() {
  const coba = () => { if (typeof STATE !== "undefined" && STATE.guruId && (typeof RG === "undefined" || RG.siap)) dsNaikKelasOtomatis(); };
  window.addEventListener("load", () => { setTimeout(coba, 8000); });
})();

// ============================================================
//  DATA SISWA YANG AMAN
//  • Tutor bisa membuka Data Siswa (lihat saja); NIK & No. KK disamarkan (6308••••••••0002).
//  • Data asli hanya untuk Admin, Admin Pendamping ruang itu, dan anggota Pengelola.
//  • Foto santri Putri hanya untuk guru Putri (ruang Putri sebagai "Ruang Saya") dan Admin/Pengelola.
//  • Membuka data asli santri oleh selain admin utama tercatat di Catatan Aktivitas ("lihat-nik").
// ============================================================
const dsBolehDataAsli = () => (typeof isAdmin === "function" && isAdmin()) || (typeof rgPendamping === "function" && rgPendamping())
  || (typeof RG !== "undefined" && RG.saya && (RG.saya.ruang || []).includes("Pg"));
const dsBolehFotoPutri = () => dsBolehDataAsli() || (typeof rgAkses === "function" && rgAkses("Pi") === "U" && !(typeof STATE !== "undefined" && STATE.modeLihat));
const _dsAksesAsli = adaAksesModul;
const dsBolehKelola = () => _dsAksesAsli("data-siswa") || (typeof isKepsekOrTU === "function" && isKepsekOrTU());
// semua guru jenjang boleh membuka Data Siswa (lihat saja)
adaAksesModul = function (k) {
  if (k === "data-siswa" && typeof RG !== "undefined" && RG.siap && STATE.ruang !== "Pg") return true;
  return _dsAksesAsli(k);
};
function dsSamarkan(v) {
  const s = String(v || "").replace(/\s/g, "");
  if (!s) return v;
  return s.length <= 8 ? "•".repeat(s.length) : s.slice(0, 4) + "•".repeat(s.length - 8) + s.slice(-4);
}
function _dsAmankan(rows) {
  const asli = dsBolehDataAsli(), foto = !(STATE.ruang === "Pi" && !dsBolehFotoPutri());
  if (asli && foto) return rows;
  return (rows || []).map((s) => ({ ...s, ...(asli ? {} : { nik: dsSamarkan(s.nik), no_kk: dsSamarkan(s.no_kk), _samar: true }), ...(foto ? {} : { foto_url: null }) }));
}
const _dsAllAsli = apiGetAllSiswa;
apiGetAllSiswa = async function (...a) { return _dsAmankan(await _dsAllAsli(...a)); };
const _dsNonAsli = apiGetSiswaNonaktif;
apiGetSiswaNonaktif = async function (...a) { return _dsAmankan(await _dsNonAsli(...a)); };

// Tutor: tombol kelola disembunyikan, ketuk santri = kartu detail (lihat saja)
const _dsRenderAsli = renderDataSiswa;
renderDataSiswa = async function (...a) {
  const kelola = dsBolehKelola();
  qsa("#page-data-siswa .ds-aksi > *").forEach((el) => { el.style.display = kelola ? "" : "none"; });
  const sub = qs("page-data-siswa")?.querySelector(".ds-judul small");
  if (sub) sub.textContent = kelola ? "Ketuk kelas untuk menyaring santri" : "Lihat saja · NIK dan No. KK disamarkan";
  return _dsRenderAsli(...a);
};
const _dsFormAsli = openFormSiswa;
openFormSiswa = async function (row) {
  if (row && dsBolehDataAsli() && typeof _rgLog === "function" && !(typeof isAdmin === "function" && isAdmin())) _rgLog("lihat-nik", { siswa: row.nama });
  if (dsBolehKelola() && !(row && row._samar)) return _dsFormAsli(row);
  if (!row) return;
  const e = escapeHtml, b = (l, v) => `<div class="ds-det-b"><small>${l}</small><b>${e(v || "-")}</b></div>`;
  openModal(`<div class="ds-det-kepala">${row.foto_url ? `<img src="${e(row.foto_url)}" alt="">` : `<span class="tj-avatar">${_inisial(row.nama)}</span>`}
      <div><h3>${e(row.nama)}</h3><small>${e(formatKelasLabel(row.kelas?.nama_kelas || ""))} · Angkatan ${e(row.angkatan || "-")}</small></div></div>
    <div class="ds-det-grid">${b("Tempat, Tanggal Lahir", [row.tempat_lahir, row.tanggal_lahir].filter(Boolean).join(", "))}${b("NIS", row.nis)}${b("NISN", row.nisn)}
      ${b("NIK", row.nik)}${b("No. KK", row.no_kk)}${b("Sekolah Asal", row.sekolah_asal)}${b("Nama Ayah", row.nama_ayah)}${b("Nama Ibu", row.nama_ibu)}</div>
    <p class="ds-catatan">NIK dan No. KK disamarkan. Data lengkap hanya untuk Admin dan Admin Pendamping.</p>`);
};

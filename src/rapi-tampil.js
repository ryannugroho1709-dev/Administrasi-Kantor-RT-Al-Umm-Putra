// ============================================================
//  PERAPIAN TAMPILAN & PENDAFTARAN AKUN
//  1. Jabatan di Data Guru diringkas ("Pengajar Mapel PJOK Paket B" → "Pengajar Mapel").
//     Rincian mapel yang diajar dilihat di Jadwal Pelajaran.
//  2. Layar Daftar Akun: nama guru SEMUA jenjang (dikelompokkan per jenjang) + kolom cari —
//     sebelumnya hanya ruang yang terakhir dibuka di perangkat itu.
//  3. Setelah mendaftar: kirim konfirmasi WA ke Kepala PKBM / Admin dengan template rinci.
// ============================================================

// ── 1. Jabatan ringkas ──
function rgJabatanRingkas(j) {
  const s = String(j || "").trim(); if (!s) return s;
  const bagian = s.split(/\s*(?:&|,|\/|\bdan\b)\s*/i).map((x) => x.trim()).filter(Boolean);
  const hasil = [];
  bagian.forEach((p) => {
    if (/^(\d|kelas\b|paket\b|kls\b)/i.test(p)) return; // potongan rincian kelas/paket
    let x = p;
    if (/^(pengajar|guru|tutor)\s+(mapel|mata pelajaran)/i.test(x)) x = "Pengajar Mapel";
    else if (/^(pengajar|guru|tutor)\b/i.test(x) && x.split(/\s+/).length > 2) x = x.split(/\s+/)[0].replace(/^./, (c) => c.toUpperCase()) + " Mapel";
    x = x.replace(/\s*\((?![^)]*tata usaha)[^)]*\)\s*$/i, "").trim(); // buang "(PJOK)" dsb, kecuali "(Tata Usaha)"
    if (x && !hasil.some((h) => h.toLowerCase() === x.toLowerCase())) hasil.push(x);
  });
  return hasil.join(" & ") || s;
}
(function () {
  if (typeof apiGetAllGuru !== "function") return;
  const asli = apiGetAllGuru;
  apiGetAllGuru = async function (...a) {
    const rows = await asli.apply(this, a);
    try { (rows || []).forEach((g) => { if (g && g.jabatan) { g.jabatan_rinci = g.jabatan; g.jabatan = rgJabatanRingkas(g.jabatan); } }); } catch (e) {}
    return rows;
  };
})();

// ── 2. Daftar akun: semua jenjang, dikelompokkan, bisa dicari ──
const AK_DAFTAR = { semua: [], cari: "" };
const _akNamaJenjang = (id) => ({ A: "Paket A", Pa: "Paket B & C Putra", Pi: "Paket B & C Putri", Pg: "Pengelola PKBM" }[id] || id);
if (typeof akTampilDaftar === "function") akTampilDaftar = async function () {
  qs("ak-masuk")?.remove();
  const el = document.createElement("div");
  el.id = "ak-masuk";
  el.innerHTML = `<div class="ak-cahaya"></div><div class="ak-panel"><div class="ak-kepala"><div class="ak-logo">${htmlLogoSekolah(56)}</div><small>PKBM AL-UMM BARABAI</small><b>Daftar Akun Guru</b>
      <span>Pilih nama Antum, lalu isi email pribadi dan sandi. Satu orang satu akun & satu email. Bila email sama dengan Data Guru, akun langsung aktif; bila belum, menunggu persetujuan Admin.</span></div>
    <label class="ak-isian"><span>Cari Nama</span><input id="ak-d-cari" placeholder="Ketik sebagian nama…" autocomplete="off"></label>
    <label class="ak-isian"><span>Nama</span><select id="ak-d-nama" class="ak-pilih"><option value="">Memuat nama…</option></select></label>
    <small class="ak-d-catatan">Nama tidak ada? Kemungkinan sudah punya akun (pakai <b>Masuk</b> atau <b>Lupa Sandi</b>), atau belum tercatat di Data Guru — hubungi Admin.</small>
    <label class="ak-isian"><span>Email Pribadi</span><input id="ak-d-email" type="email" inputmode="email" autocapitalize="none" placeholder="nama@gmail.com"></label>
    <label class="ak-isian"><span>Sandi</span><span class="ak-sandi"><input id="ak-d-sandi" type="password" autocomplete="new-password" placeholder="Minimal 8 karakter"><button type="button" class="ak-lihat" onclick="akLihatSandi(this)">Lihat</button></span></label>
    <label class="ak-isian"><span>Ulangi Sandi</span><span class="ak-sandi"><input id="ak-d-sandi2" type="password" autocomplete="new-password" placeholder="Ketik sekali lagi"><button type="button" class="ak-lihat" onclick="akLihatSandi(this)">Lihat</button></span></label>
    <div id="ak-pesan" class="ak-pesan"></div>
    <button class="ak-tombol" id="ak-d-btn" onclick="akKirimDaftar()">Daftar</button>
    <button class="ak-tautan" onclick="akTampilMasuk()">‹ Sudah Punya Akun? Masuk</button></div>`;
  document.body.appendChild(el);
  qs("ak-d-cari").oninput = (e) => { AK_DAFTAR.cari = e.target.value; _akIsiPilihanNama(); };
  try {
    const [r, tetap] = await Promise.all([
      supaSemua.from("guru").select("id,nama,auth_user_id,ruang,status_aktif,jabatan").is("auth_user_id", null).order("nama"),
      typeof _rgIdTetapMasuk === "function" ? _rgIdTetapMasuk().catch(() => []) : [],
    ]);
    if (r.error) throw r.error;
    AK_DAFTAR.semua = (r.data || []).filter((g) => g.status_aktif !== false || (tetap || []).includes(g.id));
    _akIsiPilihanNama();
  } catch (e) { qs("ak-d-nama").innerHTML = `<option value="">Gagal memuat nama — periksa internet</option>`; }
};
function _akIsiPilihanNama() {
  const sel = qs("ak-d-nama"); if (!sel) return;
  const q = AK_DAFTAR.cari.trim().toLowerCase(), pilih = sel.value;
  const grup = {};
  AK_DAFTAR.semua.filter((g) => !q || g.nama.toLowerCase().includes(q)).forEach((g) => {
    const r = (typeof rgRuangUtama === "function" && rgRuangUtama(g)) || (g.ruang || [])[0] || "lain";
    (grup[r] = grup[r] || []).push(g);
  });
  const urut = ["A", "Pa", "Pi", "Pg", "lain"].filter((k) => grup[k]);
  const n = urut.reduce((a, k) => a + grup[k].length, 0);
  sel.innerHTML = `<option value="">— pilih nama Antum (${n}) —</option>` + urut.map((k) => `<optgroup label="${k === "lain" ? "Lainnya" : _akNamaJenjang(k)}">${grup[k].map((g) => `<option value="${g.id}" ${g.id === pilih ? "selected" : ""}>${escapeHtml(g.nama)}</option>`).join("")}</optgroup>`).join("");
  if (q && n === 1) sel.value = urut.map((k) => grup[k][0].id)[0];
}

// ── 3. Konfirmasi WA ke Kepala PKBM / Admin setelah mendaftar ──
async function _akKontakAdmin() {
  try {
    const r = await supaSemua.from("guru").select("nama,no_wa").ilike("nama", "ryan nugroho%").limit(1);
    return (r.data || [])[0] || null;
  } catch (e) { return null; }
}
function _akTeksDaftarWa(o) {
  const waktu = new Date().toLocaleString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
  return `Assalamu'alaikum warahmatullahi wabarakatuh.

Yth. ${o.admin}
Kepala PKBM Al-Umm Barabai

Bismillahirrahmanirrahim. Dengan hormat, ana izin menyampaikan bahwa ana telah melakukan registrasi akun Aplikasi PKBM Al-Umm Barabai dengan rincian sebagai berikut:

Nama     : ${o.nama}
Jenjang  : ${o.jenjang}
Jabatan  : ${o.jabatan || "-"}
Email    : ${o.email}
Waktu    : ${waktu}
Status   : ${o.langsung ? "Akun sudah aktif (email sesuai Data Guru)" : "Menunggu persetujuan Admin"}

${o.langsung ? "Alhamdulillah akun ana sudah bisa dipakai. Mohon bimbingan Ustadz bila ada data yang perlu dilengkapi." : "Mohon kesediaan Ustadz untuk memeriksa dan menyetujui akun ana di menu Pengaturan Ruang - Akun Guru."}

Jazakallahu khairan katsiran atas perhatian dan bimbingannya. Barakallahu fiikum.

Wassalamu'alaikum warahmatullahi wabarakatuh.`;
}
async function _akTawarkanWa(g, email, langsung) {
  const admin = await _akKontakAdmin();
  const wa = admin && typeof normalisasiNomorWa === "function" ? normalisasiNomorWa(admin.no_wa) : { valid: false };
  if (!wa.valid) return;
  const jenjang = (g.ruang || []).filter((r) => r !== "*").map(_akNamaJenjang).join(", ") || "-";
  let teks = _akTeksDaftarWa({ admin: admin.nama, nama: g.nama, jenjang, jabatan: typeof rgJabatanRingkas === "function" ? rgJabatanRingkas(g.jabatan) : g.jabatan, email, langsung });
  if (typeof waAmanKomputer === "function") teks = waAmanKomputer(teks);
  const url = `https://wa.me/${wa.nomor}?text=${encodeURIComponent(teks)}`;
  const kotak = `<div class="ak-wa-konfirmasi"><b>Satu langkah lagi</b><span>Kirim konfirmasi pendaftaran ke Kepala PKBM lewat WhatsApp${langsung ? "" : " agar akun segera disetujui"}.</span>
    <a class="ak-tombol ak-tombol-wa" href="${url}" target="_blank" rel="noopener">Kirim Konfirmasi WA ke Kepala PKBM</a></div>`;
  const panel = document.querySelector("#ak-masuk .ak-panel");
  if (panel && !langsung) { panel.insertAdjacentHTML("beforeend", kotak); return; }
  openModal(`<h3>Akun Berhasil Dibuat</h3><p style="font-size:13px;color:var(--text-secondary)">Ahlan wa sahlan, ${escapeHtml(_namaSingkatTopbar ? _namaSingkatTopbar(g.nama) : g.nama)}. Akun Antum sudah aktif.</p>${kotak}`);
}
if (typeof akKirimDaftar === "function") akKirimDaftar = async function () {
  const guruId = qs("ak-d-nama").value, email = qs("ak-d-email").value.trim().toLowerCase(), a = qs("ak-d-sandi").value, b = qs("ak-d-sandi2").value;
  if (!guruId) return _akPesan("Pilih nama Antum dulu");
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return _akPesan("Tulis email dengan benar");
  if (a.length < 8) return _akPesan("Sandi minimal 8 karakter");
  if (a !== b) return _akPesan("Kedua sandi belum sama");
  const g = AK_DAFTAR.semua.find((x) => x.id === guruId) || { nama: qs("ak-d-nama").selectedOptions[0]?.textContent || "", ruang: [] };
  const t = qs("ak-d-btn"); t.disabled = true; t.textContent = "Mendaftarkan…"; _akPesan("");
  try {
    const r = await akPanggil("daftar", { guruId, email, sandi: a });
    if (!r.langsung) {
      t.textContent = "Terkirim";
      _akPesan("Pendaftaran terkirim. Akun Antum menunggu persetujuan Admin; setelah disetujui, masuk dengan email dan sandi tadi.", "ok");
      _akTawarkanWa(g, email, false);
      return;
    }
    const m = await akPanggil("masuk", { login: email, sandi: a, perangkat: akPerangkat() });
    const s = await AK.klien.auth.setSession(m.sesi); if (s.error) throw s.error;
    _akSimpanGuru(m.guru); _akLS.set("akunCek", String(Date.now()));
    qs("ak-masuk")?.remove();
    _akMasukkanGuru(m.guru);
    toast("Akun berhasil dibuat. Selamat datang!", "ok");
    setTimeout(() => _akTawarkanWa(g, email, true), 1200);
  } catch (e) { t.disabled = false; t.textContent = "Daftar"; _akPesan(e.message || "Gagal mendaftar"); }
};

// ── Modul Ajar: setelah unggah / edit / hapus buku, posisi gulir TETAP (tidak melompat ke atas) ──
// renderModulAjar() mengganti isi rak dengan kerangka "memuat" → tinggi halaman menyusut → browser
// memaksa gulir ke atas. Tahan tingginya selama memuat, lalu kembalikan posisi gulir semula.
(function () {
  if (typeof renderModulAjar !== "function") return;
  const asli = renderModulAjar;
  const penggulir = (el) => {
    const daftar = [document.scrollingElement || document.documentElement];
    for (let p = el && el.parentElement; p; p = p.parentElement) { const s = getComputedStyle(p).overflowY; if ((s === "auto" || s === "scroll") && p.scrollHeight > p.clientHeight) daftar.push(p); }
    return daftar.map((x) => [x, x.scrollTop]);
  };
  window.renderModulAjar = async function () {
    const rak = document.getElementById("modul-ajar-rak");
    const segarkan = rak && rak.children.length && rak.offsetHeight > 200;
    if (!segarkan) return asli.apply(this, arguments);
    const posisi = penggulir(rak), tinggiLama = rak.style.minHeight;
    rak.style.minHeight = rak.offsetHeight + "px";
    try { return await asli.apply(this, arguments); }
    finally {
      const pulih = () => posisi.forEach(([x, t]) => { x.scrollTop = t; });
      pulih(); setTimeout(() => { rak.style.minHeight = tinggiLama; pulih(); }, 80);
    }
  };
})();

// ============================================================
//  AKUN GURU — Tahap 2
//  • Masuk dengan email + sandi (diperiksa fungsi server "akun").
//  • Lupa sandi → tautan atur ulang dikirim ke email terdaftar.
//  • Maksimal 4 perangkat per akun (admin tidak dibatasi); perangkat bisa dikeluarkan.
//  • Admin (Ryan Nugroho) membuat akun tiap guru di Pengaturan Ruang → Akun Guru, lalu menyalakan
//    "Wajib Masuk Dengan Akun". Sebelum itu aplikasi tetap memakai cara lama (pilih nama).
//  • Setelah wajib: guru tidak bisa lagi memilih nama guru lain; "Ganti Akun" hanya untuk admin.
//  • Sidik jari menyusul setelah alamat aplikasi final.
//  Akun hanya dipakai sebagai tanda pengenal — permintaan data tetap lewat klien biasa (supa).
// ============================================================
const AK = {
  klien: window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY, {
    auth: { storageKey: "sb-akun", persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
  }),
  wajib: (() => { try { return localStorage.getItem("akunWajib") === "1"; } catch (e) { return false; } })(),
  guru: (() => { try { return JSON.parse(localStorage.getItem("akunGuru") || "null"); } catch (e) { return null; } })(),
  pinAdmin: null,
  BATAS: 4,
};
const _akLS = {
  set: (k, v) => { try { v === null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) {} },
  get: (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } },
};
function akPerangkat() {
  let id = _akLS.get("perangkatId");
  if (!id) { id = (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2)); _akLS.set("perangkatId", id); }
  const u = navigator.userAgent;
  const os = /Android/.test(u) ? "Android" : /iPhone|iPad/.test(u) ? "iPhone/iPad" : /Windows/.test(u) ? "Windows" : /Mac/.test(u) ? "Mac" : /Linux/.test(u) ? "Linux" : "Perangkat";
  const pb = /Edg\//.test(u) ? "Edge" : /OPR\//.test(u) ? "Opera" : /Chrome\//.test(u) ? "Chrome" : /Firefox\//.test(u) ? "Firefox" : /Safari\//.test(u) ? "Safari" : "Peramban";
  return { id, nama: os + " · " + pb };
}
async function akPanggil(aksi, isi = {}) {
  const { data, error } = await AK.klien.functions.invoke("akun", { body: { aksi, ...isi } });
  if (error) {
    let pesan = error.message || "Gagal menghubungi server";
    try { if (error.context && typeof error.context.json === "function") { const p = await error.context.json(); if (p && p.error) pesan = p.error; } } catch (e) {}
    if (/Failed to send|not found|404/i.test(pesan)) pesan = "Fungsi server \"akun\" belum dipasang. Hubungi admin.";
    throw new Error(pesan);
  }
  if (data && data.error) throw new Error(data.error);
  return data;
}
const akAdalahAdminAkun = () => !!(AK.guru && AK.guru.admin);
async function akPanggilAdmin(aksi, isi = {}) {
  return akPanggil(aksi, akAdalahAdminAkun() ? isi : { ...isi, pinAdmin: AK.pinAdmin || "" });
}
function _akSimpanGuru(g) { AK.guru = g; _akLS.set("akunGuru", g ? JSON.stringify(g) : null); }

// ── Layar Masuk ──
function akTampilMasuk(mode = "masuk") {
  qs("ak-masuk")?.remove();
  closeModal?.();
  const el = document.createElement("div");
  el.id = "ak-masuk";
  const kepala = `<div class="ak-kepala"><div class="ak-logo">${htmlLogoSekolah(56)}</div><small>PKBM AL-UMM BARABAI</small>`;
  if (mode === "lupa") {
    el.innerHTML = `<div class="ak-cahaya"></div><div class="ak-panel">${kepala}<b>Lupa Sandi</b><span>Masukkan email yang terdaftar. Tautan untuk membuat sandi baru akan dikirim ke email itu.</span></div>
      <label class="ak-isian"><span>Email Terdaftar</span><input id="ak-email" type="email" autocomplete="email" placeholder="nama@gmail.com"></label>
      <div id="ak-pesan" class="ak-pesan"></div>
      <button class="ak-tombol" id="ak-kirim" onclick="akKirimLupa()">Kirim Tautan</button>
      <button class="ak-tautan" onclick="akTampilMasuk()">‹ Kembali Ke Halaman Masuk</button></div>`;
  } else {
    el.innerHTML = `<div class="ak-cahaya"></div><div class="ak-panel">${kepala}<b>Masuk Akun Guru</b><span>Masuk dengan email dan sandi yang didaftarkan admin.</span></div>
      <label class="ak-isian"><span>Email</span><input id="ak-login" type="email" inputmode="email" autocomplete="username" autocapitalize="none" spellcheck="false" placeholder="nama@gmail.com"></label>
      <label class="ak-isian"><span>Sandi</span><span class="ak-sandi"><input id="ak-sandi" type="password" autocomplete="current-password" placeholder="Sandi"><button type="button" class="ak-lihat" onclick="akLihatSandi(this)" aria-label="Lihat sandi">Lihat</button></span></label>
      <div id="ak-pesan" class="ak-pesan"></div>
      <button class="ak-tombol" id="ak-tombol" onclick="akMasuk()">Masuk</button>
      <button class="ak-tautan" onclick="akTampilMasuk('lupa')">Lupa Sandi?</button>
      <div class="ak-atau"><i></i>atau<i></i></div>
      <button class="ak-tombol ak-garis" onclick="location.href='santri.html?ruang='+(STATE.ruang||'Pa')">Masuk Sebagai Santri</button></div>`;
  }
  document.body.appendChild(el);
  const pertama = el.querySelector("input");
  setTimeout(() => pertama && pertama.focus(), 50);
  el.querySelectorAll("input").forEach((i) => i.addEventListener("keydown", (e) => { if (e.key === "Enter") (mode === "lupa" ? akKirimLupa : akMasuk)(); }));
}
function akLihatSandi(b) { const i = b.previousElementSibling; i.type = i.type === "password" ? "text" : "password"; b.textContent = i.type === "password" ? "Lihat" : "Tutup"; }
function _akPesan(teks, jenis = "err") { const p = qs("ak-pesan"); if (p) { p.textContent = teks; p.className = "ak-pesan " + jenis; } }

async function akMasuk() {
  const login = (qs("ak-login")?.value || "").trim(), sandi = qs("ak-sandi")?.value || "";
  if (!login || !sandi) return _akPesan("Isi email dan sandi");
  const b = qs("ak-tombol"); b.disabled = true; b.textContent = "Memeriksa…"; _akPesan("");
  try {
    const r = await akPanggil("masuk", { login, sandi, perangkat: akPerangkat() });
    const { error } = await AK.klien.auth.setSession(r.sesi);
    if (error) throw error;
    _akSimpanGuru(r.guru);
    _akLS.set("akunCek", String(Date.now()));
    qs("ak-masuk")?.remove();
    _akMasukkanGuru(r.guru);
  } catch (e) {
    _akPesan(e.message || "Gagal masuk");
    b.disabled = false; b.textContent = "Masuk";
  }
}
// Jadikan guru dari akun sebagai pengguna aktif aplikasi
function _akMasukkanGuru(ga) {
  const g = (STATE.daftarGuru || []).find((x) => x.id === ga.id) || ga;
  if (ga.admin) _ADMIN_TERVERIFIKASI = true;
  _selesaikanPilihGuru(g);
  if (typeof _rgLog === "function") _rgLog("masuk-akun", { perangkat: akPerangkat().nama });
}
async function akKirimLupa() {
  const email = (qs("ak-email")?.value || "").trim();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return _akPesan("Tulis email dengan benar");
  const b = qs("ak-kirim"); b.disabled = true; b.textContent = "Mengirim…";
  try {
    const { error } = await AK.klien.auth.resetPasswordForEmail(email, { redirectTo: location.origin + location.pathname });
    if (error) throw error;
    _akPesan("Bila email itu terdaftar, tautan sudah dikirim. Periksa kotak masuk (dan folder Spam), lalu ketuk tautannya di perangkat ini.", "ok");
  } catch (e) {
    _akPesan(/rate|limit/i.test(e.message || "") ? "Terlalu sering. Coba lagi beberapa menit lagi." : "Gagal mengirim: " + e.message);
  } finally { b.disabled = false; b.textContent = "Kirim Tautan"; }
}

// ── Tautan dari email "Lupa Sandi" → buat sandi baru ──
// Tautan bisa berbentuk #access_token=…&type=recovery, ?code=… atau ?token_hash=…&type=recovery.
// Halaman "Buat Sandi Baru" tampil penuh di atas segalanya (tidak didahului PIN admin); setelah disimpan
// pengguna langsung masuk dengan sandi barunya.
async function akCekPulih() {
  let isi = null;
  try { isi = sessionStorage.getItem("pulihSandi"); sessionStorage.removeItem("pulihSandi"); } catch (e) {}
  if (!isi) return false;
  AK.pulih = true;
  akTampilSandiBaru("memuat");
  const p = new URLSearchParams(isi.replace(/^[#?]/, "").replace(/#/g, "&"));
  try {
    if (p.get("error") || p.get("error_code")) throw new Error("kedaluwarsa");
    let r;
    if (p.get("access_token")) r = await AK.klien.auth.setSession({ access_token: p.get("access_token"), refresh_token: p.get("refresh_token") || "" });
    else if (p.get("code")) r = await AK.klien.auth.exchangeCodeForSession(p.get("code"));
    else if (p.get("token_hash")) r = await AK.klien.auth.verifyOtp({ token_hash: p.get("token_hash"), type: "recovery" });
    else throw new Error("kedaluwarsa");
    if (r.error) throw r.error;
    const u = (await AK.klien.auth.getUser()).data.user;
    AK.emailPulih = u && u.email;
    akTampilSandiBaru("isi");
  } catch (e) {
    akTampilSandiBaru("gagal", /kedaluwarsa|expired|invalid/i.test(e.message || "") ? "Tautan sudah kedaluwarsa atau sudah pernah dipakai. Minta tautan baru lewat Lupa Sandi." : "Tautan tidak berlaku: " + (e.message || e));
  }
  return true;
}
function akTampilSandiBaru(tahap, pesan) {
  qs("ak-masuk")?.remove();
  const el = document.createElement("div");
  el.id = "ak-masuk"; el.className = "ak-pulih";
  const kepala = `<div class="ak-kepala"><div class="ak-logo">${htmlLogoSekolah(56)}</div><small>PKBM AL-UMM BARABAI</small>`;
  if (tahap === "memuat") el.innerHTML = `<div class="ak-cahaya"></div><div class="ak-panel">${kepala}<b>Memeriksa Tautan…</b><span>Sebentar, tautan dari email sedang diperiksa.</span></div></div>`;
  else if (tahap === "gagal") el.innerHTML = `<div class="ak-cahaya"></div><div class="ak-panel">${kepala}<b>Tautan Tidak Berlaku</b><span>${escapeHtml(pesan || "")}</span></div>
    <button class="ak-tombol" onclick="AK.pulih=false;akTampilMasuk('lupa')">Minta Tautan Baru</button><button class="ak-tautan" onclick="AK.pulih=false;akTampilMasuk()">Ke Halaman Masuk</button></div>`;
  else el.innerHTML = `<div class="ak-cahaya"></div><div class="ak-panel">${kepala}<b>Buat Sandi Baru</b><span>${AK.emailPulih ? `Untuk akun <strong class="ak-email">${escapeHtml(AK.emailPulih)}</strong>. ` : ""}Minimal 8 karakter, huruf besar/kecil dibedakan.</span></div>
    <label class="ak-isian"><span>Sandi Baru</span><span class="ak-sandi"><input id="ak-baru1" type="password" autocomplete="new-password" placeholder="Sandi baru"><button type="button" class="ak-lihat" onclick="akLihatSandi(this)">Lihat</button></span></label>
    <label class="ak-isian"><span>Ulangi Sandi Baru</span><span class="ak-sandi"><input id="ak-baru2" type="password" autocomplete="new-password" placeholder="Ketik sekali lagi"><button type="button" class="ak-lihat" onclick="akLihatSandi(this)">Lihat</button></span></label>
    <div id="ak-pesan" class="ak-pesan"></div>
    <button class="ak-tombol" id="ak-baru-btn" onclick="akSimpanSandiBaru()">Simpan & Masuk</button></div>`;
  document.body.appendChild(el);
  el.querySelectorAll("input").forEach((i) => i.addEventListener("keydown", (e) => { if (e.key === "Enter") akSimpanSandiBaru(); }));
  setTimeout(() => el.querySelector("input")?.focus(), 60);
}
async function akSimpanSandiBaru() {
  const a = qs("ak-baru1").value, b = qs("ak-baru2").value;
  if (a.length < 8) return _akPesan("Sandi minimal 8 karakter");
  if (a !== b) return _akPesan("Kedua sandi belum sama");
  const t = qs("ak-baru-btn"); t.disabled = true; t.textContent = "Menyimpan…"; _akPesan("");
  const { error } = await AK.klien.auth.updateUser({ password: a });
  if (error) { t.disabled = false; t.textContent = "Simpan & Masuk"; return _akPesan(/same|different/i.test(error.message) ? "Sandi baru tidak boleh sama dengan sandi lama" : "Gagal: " + error.message); }
  // langsung masuk dengan sandi baru (perangkat ini ikut terdaftar)
  try {
    await AK.klien.auth.signOut({ scope: "local" });
    const r = await akPanggil("masuk", { login: AK.emailPulih, sandi: a, perangkat: akPerangkat() });
    const s = await AK.klien.auth.setSession(r.sesi); if (s.error) throw s.error;
    _akSimpanGuru(r.guru); _akLS.set("akunCek", String(Date.now()));
    AK.pulih = false;
    qs("ak-masuk")?.remove(); closeModal();
    _akMasukkanGuru(r.guru);
    toast("Sandi baru tersimpan. Antum sudah masuk.", "ok");
  } catch (e) {
    AK.pulih = false;
    akTampilMasuk();
    _akPesan("Sandi baru tersimpan. Silakan masuk dengan email dan sandi baru." + (e.message ? " (" + e.message + ")" : ""), "ok");
    const i = qs("ak-login"); if (i && AK.emailPulih) i.value = AK.emailPulih;
  }
}
function akFormSandi(pulih) {
  openModal(`<h3>${pulih ? "Buat Sandi Baru" : "Ubah Sandi"}</h3>
    <div style="font-size:12px;color:var(--text-secondary);margin:-4px 0 12px;">Minimal 8 karakter. Gunakan campuran huruf dan angka.</div>
    <div class="field"><input type="password" id="ak-baru1" class="input" autocomplete="new-password" placeholder="Sandi baru"></div>
    <div class="field"><input type="password" id="ak-baru2" class="input" autocomplete="new-password" placeholder="Ulangi sandi baru"></div>
    <div id="ak-baru-err" style="color:var(--bad);font-size:11.5px;min-height:14px;margin:-4px 0 10px;"></div>
    <button class="btn btn-accent" style="width:100%" id="ak-baru-btn" onclick="akSimpanSandi(${pulih ? "true" : "false"})">Simpan Sandi</button>`);
}
async function akSimpanSandi(pulih) {
  const a = qs("ak-baru1").value, b = qs("ak-baru2").value, err = qs("ak-baru-err");
  if (a.length < 8) { err.textContent = "Sandi minimal 8 karakter"; return; }
  if (a !== b) { err.textContent = "Kedua sandi belum sama"; return; }
  const t = qs("ak-baru-btn"); t.disabled = true;
  const { error } = await AK.klien.auth.updateUser({ password: a });
  t.disabled = false;
  if (error) { err.textContent = "Gagal: " + error.message; return; }
  closeModal();
  if (pulih) {
    await AK.klien.auth.signOut({ scope: "local" });
    toast("Sandi baru tersimpan. Silakan masuk.", "ok");
    akTampilMasuk();
  } else toast("Sandi berhasil diubah", "ok");
}

// ── Menu akun di pojok kanan atas ──
const _akMenuAsli = bukaMenuAkun;
bukaMenuAkun = function () {
  if (!STATE.guruId) return openPilihGuru();
  const punyaSesi = !!AK.guru;
  const sedangLihatLain = punyaSesi && AK.guru.id !== STATE.guruId;
  const bolehGanti = !AK.wajib || isAdmin() || akAdalahAdminAkun();
  openModal(`<h3 style="margin-bottom:10px;">👤 ${escapeHtml(_namaSingkatTopbar(STATE.guruNama))}</h3>
    ${sedangLihatLain ? `<div class="ak-info">Sedang membuka akun ${escapeHtml(_namaSingkatTopbar(STATE.guruNama))} sebagai admin.</div>` : ""}
    <div style="display:grid;gap:8px;">
      <button class="btn btn-accent" onclick="bukaProfilGuru()">🪪 Profil Saya &amp; Kartu Pengajar</button>
      ${punyaSesi && !sedangLihatLain ? `<button class="btn btn-outline" onclick="akPerangkatSaya()">📱 Perangkat Saya</button>
        <button class="btn btn-outline" onclick="akFormSandi(false)">🔑 Ubah Sandi</button>` : ""}
      ${sedangLihatLain ? `<button class="btn btn-outline" onclick="akKembaliKeAkunSaya()">↩ Kembali Ke Akun Saya</button>` : ""}
      ${bolehGanti ? `<button class="btn btn-outline" onclick="akGantiAkun()">🔁 Ganti Akun</button>` : ""}
      ${punyaSesi ? `<button class="btn btn-outline ak-keluar" onclick="akKeluar()">Keluar</button>`
        : `<button class="btn btn-outline" onclick="akTampilMasuk()">🔐 Masuk Dengan Akun</button>`}
    </div>`);
};
function akGantiAkun() {
  if (akAdalahAdminAkun()) _ADMIN_TERVERIFIKASI = true; // admin membuka akun guru lain tanpa PIN guru
  openPilihGuru();
}
function akKembaliKeAkunSaya() {
  if (!AK.guru) return;
  closeModal();
  _akMasukkanGuru(AK.guru);
}
async function akKeluar() {
  if (!(await konfirmasiTema("Keluar dari akun di perangkat ini? Perangkat ini juga dihapus dari daftar perangkat akun.", { judul: "Keluar", ikon: "🚪", teksYa: "Ya, Keluar" }))) return;
  try {
    const r = await akPanggil("perangkat_daftar");
    const ini = (r.perangkat || []).find((p) => p.perangkat_id === akPerangkat().id);
    if (ini) await akPanggil("perangkat_hapus", { id: ini.id });
  } catch (e) { /* tetap keluar */ }
  await _akBersihkan();
  location.reload();
}
async function _akBersihkan() {
  try { await AK.klien.auth.signOut({ scope: "local" }); } catch (e) {}
  _akSimpanGuru(null);
  _ADMIN_TERVERIFIKASI = false;
  STATE.guruId = null; STATE.guruNama = null;
  _akLS.set("guruId", null); _akLS.set("guruNama", null);
  try { sessionStorage.removeItem("ruangDipilih"); } catch (e) {}
}
async function akPerangkatSaya() {
  openModal(`<h3>📱 Perangkat Saya</h3><div id="ak-alat">${loadingHTML("Memuat…")}</div>`);
  try {
    const r = await akPanggil("perangkat_daftar");
    const ini = akPerangkat().id, d = r.perangkat || [];
    qs("ak-alat").innerHTML = `<div style="font-size:12px;color:var(--text-secondary);margin:-4px 0 10px;">${d.length} dari ${AK.guru?.admin ? "tanpa batas" : AK.BATAS} perangkat. Keluarkan perangkat yang sudah tidak dipakai.</div>
      ${d.map((p) => `<div class="ak-alat-baris"><div><b>${escapeHtml(p.nama || "Perangkat")}${p.perangkat_id === ini ? ' <em class="ak-ini">Perangkat Ini</em>' : ""}</b>
        <small>Terakhir dipakai ${new Date(p.terakhir).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}</small></div>
        ${p.perangkat_id === ini ? "" : `<button class="btn btn-sm btn-outline" onclick="akHapusPerangkat('${p.id}')">Keluarkan</button>`}</div>`).join("") || "<p>Belum ada perangkat.</p>"}`;
  } catch (e) { qs("ak-alat").innerHTML = `<p>${escapeHtml(e.message)}</p>`; }
}
async function akHapusPerangkat(id, guruId) {
  try { await (guruId ? akPanggilAdmin : akPanggil)("perangkat_hapus", { id }); toast("Perangkat dikeluarkan", "ok"); guruId ? akPerangkatGuru(guruId) : akPerangkatSaya(); }
  catch (e) { toast(e.message, "err"); }
}

// ── Pengganti "pilih nama" saat akun sudah wajib ──
const _akPilihAsli = openPilihGuru;
openPilihGuru = function () {
  if (AK.pulih) return;
  if (AK.wajib && !isAdmin() && !akAdalahAdminAkun()) return akTampilMasuk();
  return _akPilihAsli();
};
// Admin yang sudah masuk dengan akun tidak perlu PIN admin lagi untuk akunnya sendiri
const _akPinAsli = mintaPinAdminUntukLogin;
mintaPinAdminUntukLogin = function (g) {
  if (AK.pulih) return; // sedang membuat sandi baru dari tautan email
  if (AK.guru && AK.guru.admin && AK.guru.id === g.id) { _ADMIN_TERVERIFIKASI = true; _selesaikanPilihGuru(g); return; }
  return _akPinAsli(g);
};

// ── Saat aplikasi dibuka ──
const _akBootAsli = boot;
boot = async function () {
  await akCekPulih();
  if (AK.wajib) {
    let sesi = null;
    try { sesi = (await AK.klien.auth.getSession()).data.session; } catch (e) {}
    if (!sesi || !AK.guru) {
      _akSimpanGuru(null);
      STATE.guruId = null; STATE.guruNama = null;
      _akLS.set("guruId", null); _akLS.set("guruNama", null);
    } else if (STATE.guruId !== AK.guru.id && !AK.guru.admin) {
      STATE.guruId = AK.guru.id; STATE.guruNama = AK.guru.nama;
      _akLS.set("guruId", AK.guru.id); _akLS.set("guruNama", AK.guru.nama);
    }
  }
  await _akBootAsli();
  akMuatPengaturan();
  akCekBerkala();
};
async function akMuatPengaturan() {
  try {
    const r = await supa.from("kuliah_pengaturan").select("nilai").eq("kunci", "akun:wajib").maybeSingle();
    if (r.error) return;
    const wajib = !!(r.data && r.data.nilai && r.data.nilai.aktif);
    if (wajib === AK.wajib) return;
    AK.wajib = wajib; _akLS.set("akunWajib", wajib ? "1" : "0");
    if (wajib && !AK.guru) { await _akBersihkan(); akTampilMasuk(); }
  } catch (e) {}
}
// Sekali tiap 12 jam: pastikan perangkat ini masih terdaftar dan akun masih aktif
async function akCekBerkala() {
  if (!AK.guru) return;
  const t = +(_akLS.get("akunCek") || 0);
  if (Date.now() - t < 12 * 3600 * 1000) return;
  try {
    const r = await akPanggil("cek", { perangkat: akPerangkat() });
    if (r.ok) { _akLS.set("akunCek", String(Date.now())); _akSimpanGuru(r.guru); return; }
    await _akBersihkan();
    toast(r.alasan === "perangkat" ? "Perangkat ini sudah dikeluarkan dari akun. Silakan masuk lagi." : "Sesi akun berakhir. Silakan masuk lagi.", "warn");
    if (AK.wajib) akTampilMasuk(); else location.reload();
  } catch (e) { /* jaringan putus — coba lagi nanti */ }
}

// ── Pengaturan Ruang → Akun Guru (khusus Admin) ──
const AK_ATUR = { guru: [], alat: [] };
async function akIsiTabAkun() {
  if (!akAdalahAdminAkun() && !AK.pinAdmin) {
    return `<p class="rg-ket">Untuk mengelola akun guru, masukkan PIN admin dulu (sekali saja selama aplikasi terbuka). Setelah Antum punya akun admin sendiri dan masuk dengannya, PIN tidak diminta lagi.</p>
      <div style="display:flex;gap:8px;max-width:360px"><input id="ak-pin" type="password" inputmode="numeric" class="input" placeholder="PIN admin">
      <button class="btn btn-accent" onclick="akPakaiPin()">Lanjut</button></div>`;
  }
  const tambahan = typeof _rgIdTetapMasuk === "function" ? (await _rgIdTetapMasuk()).filter((x) => /^[0-9a-f-]{36}$/i.test(x)) : [];
  let q0 = supaSemua.from("guru").select("id,nama,username,email,auth_user_id,no_wa,status_aktif").order("nama");
  q0 = tambahan.length ? q0.or(`status_aktif.eq.true,id.in.(${tambahan.join(",")})`) : q0.eq("status_aktif", true);
  const r = await q0;
  if (r.error) {
    if (/username|auth_user_id/.test(r.error.message)) return `<p class="rg-ket">Jalankan <b>SQL_PKBM_5_AKUN.sql</b> dulu di Supabase, lalu buka lagi tab ini.</p>`;
    throw r.error;
  }
  AK_ATUR.guru = r.data || [];
  try { AK_ATUR.alat = (await akPanggilAdmin("perangkat_daftar", { semua: true })).perangkat || []; }
  catch (e) {
    if (/PIN|Hanya Admin/i.test(e.message)) { AK.pinAdmin = null; return `<p class="rg-ket" style="color:var(--bad)">${escapeHtml(e.message)}</p>` + (await akIsiTabAkun()); }
    return `<p class="rg-ket" style="color:var(--bad)">${escapeHtml(e.message)}</p><p class="rg-ket">Pasang fungsi server <b>akun</b> (folder edge-functions/akun) di Supabase, lalu buka lagi tab ini.</p>`;
  }
  const jmlAlat = AK_ATUR.alat.reduce((a, p) => { a[p.guru_id] = (a[p.guru_id] || 0) + 1; return a; }, {});
  const punya = AK_ATUR.guru.filter((g) => g.auth_user_id).length;
  return `<div class="ak-wajib ${AK.wajib ? "on" : ""}">
      <div><b>Wajib Masuk Dengan Akun</b><small>${AK.wajib ? "Menyala — semua guru masuk dengan email & sandi. Pilihan nama guru hanya untuk admin." : "Mati — guru masih memilih nama seperti biasa. Nyalakan setelah semua guru punya akun."}</small>
      <small>${punya} dari ${AK_ATUR.guru.length} guru sudah punya akun.</small></div>
      <button class="rg-saklar ${AK.wajib ? "on" : ""}" onclick="akUbahWajib(${!AK.wajib})" aria-label="Nyalakan/matikan"></button></div>
    <p class="rg-ket">Akun memakai nama guru di Data Guru; guru masuk dengan <b>email + sandi</b>. ${_AK_ATURAN_SANDI}. Sandi awal dibagikan ke guru lewat WA; guru bisa menggantinya sendiri di menu akun. Lupa sandi dikirim ke email yang terdaftar. Maksimal ${AK.BATAS} perangkat per guru.</p>
    <div class="table-wrap"><table class="table"><thead><tr><th>Guru</th><th>Email</th><th style="text-align:center">Perangkat</th><th>Aksi</th></tr></thead><tbody>
    ${AK_ATUR.guru.map((g) => `<tr><td>${escapeHtml(g.nama)}</td>
      <td style="font-size:12px">${g.auth_user_id ? escapeHtml(g.email || "-") : '<span class="ak-belum">Belum Punya Akun</span>'}</td>
      <td style="text-align:center">${g.auth_user_id ? `<button class="btn btn-sm btn-ghost" onclick="akPerangkatGuru('${g.id}')">${jmlAlat[g.id] || 0}/${AK.BATAS}</button>` : "-"}</td>
      <td style="white-space:nowrap">${g.auth_user_id
        ? `<button class="btn btn-sm btn-outline" onclick="akFormAkun('${g.id}','ubah')">Ubah Email</button> <button class="btn btn-sm btn-outline" onclick="akResetSandi('${g.id}')">Reset Sandi</button> <button class="btn btn-sm btn-ghost" onclick="akHapusAkun('${g.id}')">Hapus</button>`
        : `<button class="btn btn-sm btn-accent" onclick="akFormAkun('${g.id}','buat')">Buat Akun</button>`}</td></tr>`).join("")}
    </tbody></table></div>`;
}
function akPakaiPin() { AK.pinAdmin = (qs("ak-pin")?.value || "").trim(); if (AK.pinAdmin) rgBukaPengaturan("akun"); }
async function akUbahWajib(nyala) {
  if (nyala && !akAdalahAdminAkun()) {
    toast("Buat akun untuk Antum sendiri dulu, lalu masuk dengan akun itu (menu akun → Masuk Dengan Akun) sebelum menyalakan ini.", "warn");
    return;
  }
  if (nyala && !(await konfirmasiTema("Setelah dinyalakan, semua guru wajib masuk dengan email & sandi. Guru yang belum punya akun tidak bisa masuk. Lanjutkan?", { judul: "Wajib Masuk Dengan Akun", ikon: "🔐", teksYa: "Ya, Nyalakan" }))) return;
  const { error } = await supa.from("kuliah_pengaturan").upsert({ kunci: "akun:wajib", nilai: { aktif: !!nyala, oleh: STATE.guruNama, waktu: new Date().toISOString() } });
  if (error) { toast("Gagal menyimpan: " + error.message, "err"); return; }
  AK.wajib = !!nyala; _akLS.set("akunWajib", nyala ? "1" : "0");
  _rgLog?.("akun-wajib", { aktif: !!nyala });
  toast(nyala ? "Wajib masuk dengan akun: menyala" : "Wajib masuk dengan akun: mati", "ok");
  rgBukaPengaturan("akun");
}
const _akSandiAcak = () => {
  const h = "abcdefghjkmnpqrstuvwxyz", a = "23456789";
  const ambil = (s, n) => Array.from(crypto.getRandomValues(new Uint32Array(n)), (x) => s[x % s.length]).join("");
  return ambil(h, 4) + "-" + ambil(a, 4);
};
const _akSaranNama = (nama) => String(nama || "").split(",")[0].toLowerCase().normalize("NFD").replace(/[^a-z\s]/g, "").trim().split(/\s+/).slice(0, 2).join(".");
// Nama pengguna dibuat otomatis di belakang layar (unik); guru masuk dengan EMAIL + sandi.
function _akNamaPenggunaUnik(g) {
  if (g.username) return g.username;
  const dasar = (_akSaranNama(g.nama) || "guru").slice(0, 26) || "guru";
  const dipakai = new Set(AK_ATUR.guru.filter((x) => x.id !== g.id).map((x) => String(x.username || "").toLowerCase()));
  let u = dasar, k = 2;
  while (dipakai.has(u)) u = dasar + k++;
  return u.length >= 3 ? u : u + "guru";
}
const _AK_ATURAN_SANDI = "Minimal 8 karakter · boleh huruf, angka, simbol · huruf besar/kecil dibedakan";
function akFormAkun(guruId, mode) {
  const g = AK_ATUR.guru.find((x) => x.id === guruId); if (!g) return;
  openModal(`<h3>${mode === "buat" ? "Buat Akun" : "Ubah Email"}</h3>
    <div class="ak-nama-guru"><small>Nama (dari Data Guru)</small><b>${escapeHtml(g.nama)}</b></div>
    <div class="field"><label class="form-label">Email (untuk masuk & lupa sandi)</label><input id="akf-email" type="email" inputmode="email" autocapitalize="none" class="input" value="${escapeHtml(g.email || "")}" placeholder="nama@gmail.com"></div>
    ${mode === "buat" ? `<div class="field"><label class="form-label">Sandi Awal</label><div style="display:flex;gap:6px"><input id="akf-sandi" class="input" autocomplete="new-password" value="${_akSandiAcak()}" placeholder="Minimal 8 karakter"><button class="btn btn-outline" onclick="qs('akf-sandi').value=_akSandiAcak()">Acak</button></div>
      <small class="ak-aturan">${_AK_ATURAN_SANDI}. Boleh diketik sendiri.</small></div>` : ""}
    <div id="akf-err" style="color:var(--bad);font-size:11.5px;min-height:14px;margin:-4px 0 10px;"></div>
    <button class="btn btn-accent" style="width:100%" id="akf-btn" onclick="akSimpanAkun('${guruId}','${mode}')">${mode === "buat" ? "Buat Akun" : "Simpan"}</button>`);
}
async function akSimpanAkun(guruId, mode) {
  const g = AK_ATUR.guru.find((x) => x.id === guruId);
  const email = qs("akf-email").value.trim().toLowerCase(), sandi = qs("akf-sandi") ? qs("akf-sandi").value : undefined, username = _akNamaPenggunaUnik(g);
  const err = qs("akf-err");
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { err.textContent = "Tulis email dengan benar, contoh: nama@gmail.com"; return; }
  if (mode === "buat" && (!sandi || sandi.length < 8)) { err.textContent = "Sandi minimal 8 karakter"; return; }
  if (mode === "buat" && /^\s|\s$/.test(sandi)) { err.textContent = "Sandi tidak boleh diawali atau diakhiri spasi"; return; }
  const b = qs("akf-btn"); b.disabled = true;
  try {
    await akPanggilAdmin(mode, mode === "buat" ? { guruId, email, username, sandi } : { guruId, email });
    _rgLog?.(mode === "buat" ? "buat-akun" : "ubah-akun", { guru: g.nama, email });
    if (mode === "buat") akInfoLogin({ ...g, email }, email, sandi); else { closeModal(); toast("Email akun diperbarui", "ok"); }
    rgBukaPengaturan("akun");
  } catch (e) { err.textContent = e.message; b.disabled = false; }
}
async function akResetSandi(guruId) {
  const g = AK_ATUR.guru.find((x) => x.id === guruId); if (!g) return;
  if (!(await konfirmasiTema(`Buat sandi baru untuk ${_namaSingkatTopbar(g.nama)}? Sandi lama tidak berlaku lagi.`, { judul: "Reset Sandi", ikon: "🔑", teksYa: "Ya, Reset" }))) return;
  const sandi = _akSandiAcak();
  try { await akPanggilAdmin("reset_sandi", { guruId, sandi }); _rgLog?.("reset-sandi", { guru: g.nama }); akInfoLogin(g, g.email, sandi); }
  catch (e) { toast(e.message, "err"); }
}
async function akHapusAkun(guruId) {
  const g = AK_ATUR.guru.find((x) => x.id === guruId); if (!g) return;
  if (!(await konfirmasiTema(`Hapus akun ${_namaSingkatTopbar(g.nama)}? Data guru tetap ada; hanya akun masuknya yang dihapus.`, { judul: "Hapus Akun", ikon: "🗑️", teksYa: "Ya, Hapus" }))) return;
  try { await akPanggilAdmin("hapus", { guruId }); _rgLog?.("hapus-akun", { guru: g.nama }); toast("Akun dihapus", "ok"); rgBukaPengaturan("akun"); }
  catch (e) { toast(e.message, "err"); }
}
// Info masuk untuk dibagikan ke guru
function akInfoLogin(g, email, sandi) {
  const alamat = location.origin + location.pathname;
  const teks = `Assalamu'alaikum ${_namaSingkatTopbar(g.nama)},\n\nBerikut akun aplikasi Guru PKBM Al-Umm Barabai:\nAlamat: ${alamat}\nEmail: ${email}\nSandi: ${sandi}\n\nSetelah masuk, silakan ganti sandi lewat menu akun (pojok kanan atas) → Ubah Sandi. Jangan bagikan sandi ke orang lain.`;
  const wa = typeof normalisasiNomorWa === "function" ? normalisasiNomorWa(g.no_wa) : { valid: false };
  openModal(`<h3>Akun Siap</h3><div style="font-size:12px;color:var(--text-secondary);margin:-4px 0 10px;">Bagikan info ini ke ${escapeHtml(_namaSingkatTopbar(g.nama))}. Sandi tidak bisa dilihat lagi setelah jendela ini ditutup.</div>
    <pre class="ak-info-login">${escapeHtml(teks)}</pre>
    <div style="display:flex;gap:8px"><button class="btn btn-outline" style="flex:1" id="ak-salin">Salin</button>
    ${wa.valid ? `<a class="btn btn-accent" style="flex:1;text-align:center" target="_blank" rel="noopener" href="https://wa.me/${wa.nomor}?text=${encodeURIComponent(teks)}">Kirim WA</a>` : ""}</div>`);
  qs("ak-salin").onclick = () => navigator.clipboard.writeText(teks).then(() => toast("Disalin", "ok"));
}
async function akPerangkatGuru(guruId) {
  const g = AK_ATUR.guru.find((x) => x.id === guruId);
  openModal(`<h3>Perangkat · ${escapeHtml(_namaSingkatTopbar(g?.nama || ""))}</h3><div id="ak-alat">${loadingHTML("Memuat…")}</div>`);
  try {
    AK_ATUR.alat = (await akPanggilAdmin("perangkat_daftar", { semua: true })).perangkat || [];
    const d = AK_ATUR.alat.filter((p) => p.guru_id === guruId);
    qs("ak-alat").innerHTML = d.map((p) => `<div class="ak-alat-baris"><div><b>${escapeHtml(p.nama || "Perangkat")}</b><small>Terakhir dipakai ${new Date(p.terakhir).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}</small></div>
      <button class="btn btn-sm btn-outline" onclick="akHapusPerangkat('${p.id}','${guruId}')">Keluarkan</button></div>`).join("") || "<p>Belum ada perangkat.</p>";
  } catch (e) { qs("ak-alat").innerHTML = `<p>${escapeHtml(e.message)}</p>`; }
}

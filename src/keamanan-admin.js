// ============================================================
//  KEAMANAN AKUN ADMIN
//  1) 🔒 KUNCI ADMIN — selama yang aktif adalah admin, aplikasi meminta PIN admin (dicek di server lewat
//     verify-admin-pin) setiap kali dibuka di jendela/tab baru, dan otomatis terkunci setelah 15 menit
//     tidak dipakai. Salah PIN 5 kali → keluar dari akun. Jadi sandi yang tersimpan di Chrome saja
//     tidak cukup untuk memakai aplikasi sebagai admin.
//  2) 🛡️ VERIFIKASI 2 LANGKAH (TOTP, Google Authenticator) — fitur bawaan Supabase Auth. Bila sudah
//     diaktifkan pada akun, setelah sandi benar tetap diminta kode 6 angka dari HP pemilik akun.
//     Diatur di Pengaturan Ruang → Akun Guru (bagian paling atas). PIN/kode tidak pernah disimpan aplikasi.
// ============================================================
const KA = { menitKunci: 15, salah: 0, terkunci: false, tAktif: 0 };
const _kaLS = { get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { v == null ? sessionStorage.removeItem(k) : sessionStorage.setItem(k, v); } catch (e) {} } };
const _kaAdminAktif = () => !!(STATE && STATE.guruId) && ((typeof AK !== "undefined" && AK.guru && AK.guru.admin && AK.guru.id === STATE.guruId) || (typeof isAdmin === "function" && isAdmin()));

// ── 1. Kunci Admin ──
function kaCek() {
  if (!KA.siap || KA.terkunci || document.getElementById("ka-kunci") || document.getElementById("ak-masuk") || document.getElementById("kh-kunci")) return;
  if (!_kaAdminAktif()) return;
  const terakhir = +(_kaLS.get("kaAktif") || 0);
  if (!terakhir || Date.now() - terakhir > KA.menitKunci * 60000) kaKunci(terakhir ? "diam" : "baru");
}
// ── Tampilan layar kunci: latar berwarna bergerak + panel kaca buram, gembok beranimasi, jam & sapaan ──
const KA_GEMBOK = `<svg class="ka-svg" viewBox="0 0 64 74" aria-hidden="true"><defs>
  <linearGradient id="kaEmas" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fde68a"/><stop offset=".55" stop-color="#fbbf24"/><stop offset="1" stop-color="#d97706"/></linearGradient>
  <linearGradient id="kaPerak" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f8fafc"/><stop offset="1" stop-color="#94a3b8"/></linearGradient></defs>
  <path class="ka-sengkang" d="M19 34V23a13 13 0 0 1 26 0v11" fill="none" stroke="url(#kaPerak)" stroke-width="7" stroke-linecap="round"/>
  <rect x="8" y="32" width="48" height="38" rx="11" fill="url(#kaEmas)"/><rect x="12" y="35" width="40" height="8" rx="4" fill="#fff" opacity=".35"/>
  <circle cx="32" cy="49" r="5" fill="#78350f"/><rect x="29.6" y="51" width="4.8" height="10" rx="2.4" fill="#78350f"/></svg>`;
const KA_PERISAI = `<svg class="ka-svg" viewBox="0 0 64 74" aria-hidden="true"><defs><linearGradient id="kaHijau" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6ee7b7"/><stop offset="1" stop-color="#059669"/></linearGradient></defs>
  <path d="M32 4 56 13v19c0 17-10.5 30-24 37C18.5 62 8 49 8 32V13z" fill="url(#kaHijau)"/><path d="M32 10 50 17v15c0 13-7.8 23.5-18 29.5z" fill="#fff" opacity=".18"/>
  <path class="ka-centang" d="M21 37l8 8 15-16" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
function _kaNama() {
  try { return (typeof AK !== "undefined" && AK.guru && AK.guru.nama) || localStorage.getItem("guruNama") || ""; } catch (e) { return ""; }
}
function _kaBingkai(isi) {
  const nama = _kaNama();
  return `<div class="ka-latar"><i class="ka-gumpal g1"></i><i class="ka-gumpal g2"></i><i class="ka-gumpal g3"></i><i class="ka-gumpal g4"></i><div class="ka-pola"></div></div>
    <div class="ka-tengah">
      <div class="ka-jam"><b data-ka-jam>--.--</b><small data-ka-tgl></small></div>
      <div class="ka-panel">${nama ? `<div class="ka-sapa">Assalamu'alaikum, <b>${escapeHtml(nama)}</b></div>` : ""}${isi}</div>
      <div class="ka-kaki">🕌 PKBM Al-Umm Barabai · Akun Terlindungi</div>
    </div>`;
}
function _kaJalankanJam(el) {
  const jalan = () => {
    if (!el.isConnected) return clearInterval(t);
    const d = new Date(), j = el.querySelector("[data-ka-jam]"), g = el.querySelector("[data-ka-tgl]");
    if (j) j.textContent = `${String(d.getHours()).padStart(2, "0")}.${String(d.getMinutes()).padStart(2, "0")}`;
    if (g) g.textContent = d.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  };
  const t = setInterval(jalan, 1000); jalan();
}
function _kaTitik(el) {
  // titik PIN muncul satu per satu (isi asli tersembunyi); tombol 👁 menampilkan angkanya
  const i = el.querySelector("#ka-pin"), lapis = el.querySelector(".ka-titik"), mata = el.querySelector(".ka-lihat");
  const gambar = () => {
    const v = i.value, lihat = mata.classList.contains("on");
    lapis.innerHTML = v ? [...v].map((c, k) => `<i style="animation-delay:${k === v.length - 1 ? 0 : -1}s">${lihat ? escapeHtml(c) : ""}</i>`).join("") : `<span>Ketik PIN Admin</span>`;
    lapis.classList.toggle("lihat", lihat);
  };
  i.addEventListener("input", () => { const d = i.value.replace(/\D/g, ""); if (d !== i.value) i.value = d; gambar(); }); // PIN angka saja
  mata.onclick = () => { mata.classList.toggle("on"); mata.textContent = mata.classList.contains("on") ? "🙈" : "👁️"; gambar(); i.focus(); };
  el.querySelector(".ka-isian").onclick = () => i.focus();
  gambar();
}
function _kaSisaCoba(el) {
  const c = el.querySelector(".ka-coba"); if (!c) return;
  c.innerHTML = Array.from({ length: 5 }, (_, k) => `<i class="${k < KA.salah ? "habis" : ""}"></i>`).join("") + `<small>${5 - KA.salah} kesempatan</small>`;
}
function kaKunci(sebab) {
  KA.terkunci = true;
  const el = document.createElement("div"); el.id = "ka-kunci"; el.className = "ka-lapis";
  el.innerHTML = _kaBingkai(`<div class="ka-ikon"><span class="ka-cincin"></span>${KA_GEMBOK}</div>
    <h2>Aplikasi Terkunci</h2>
    <p>${sebab === "diam" ? `Tidak dipakai lebih dari <b>${KA.menitKunci} menit</b>.` : sebab === "manual" ? "Aplikasi dikunci." : sebab === "harian" ? "Langkah terakhir khusus <b>admin</b>." : "Akun admin dibuka di <b>jendela baru</b>."}<br>Masukkan <b>PIN Admin</b> untuk melanjutkan.</p>
    <div class="ka-isian"><input id="ka-pin" type="text" name="ka-${Date.now()}" inputmode="numeric" pattern="[0-9]*" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" data-lpignore="true" data-1p-ignore readonly maxlength="12" aria-label="PIN Admin"><div class="ka-titik"></div><button type="button" class="ka-lihat" title="Lihat / sembunyikan PIN">👁️</button></div>
    ${kaSidikAda() && sebab !== "harian" ? `<button type="button" class="ka-sidik" onclick="kaBukaSidik()"><span>${KA_SIDIK_SVG}</span>Buka dengan Sidik Jari</button>` : ""}
    <div class="ka-coba"></div>
    <div id="ka-pesan" class="ka-pesan" role="alert"></div>
    <button class="ka-buka" onclick="kaBuka()"><span>🔓 Buka Kunci</span></button>
    <button class="ka-keluar" onclick="kaKeluarPaksa()">Bukan saya — Keluar Akun</button>`);
  document.body.appendChild(el);
  _kaJalankanJam(el); _kaTitik(el); _kaSisaCoba(el);
  const i = el.querySelector("#ka-pin");
  // readonly sampai disentuh: Chrome/Google tidak menawarkan sandi tersimpan ke kolom ini
  const aktifkan = () => { i.removeAttribute("readonly"); };
  i.addEventListener("pointerdown", aktifkan); i.addEventListener("focus", aktifkan);
  setTimeout(() => { aktifkan(); i.focus(); }, 120);
  if (kaSidikAda() && sebab !== "harian") setTimeout(() => { if (document.getElementById("ka-kunci") && !document.hidden) kaBukaSidik(true); }, 400);
  i.addEventListener("keydown", (e) => { if (e.key === "Enter") kaBuka(); });
}
function _kaGoyang(el) {
  const p = el && el.querySelector(".ka-panel"); if (!p) return;
  p.classList.remove("goyang"); void p.offsetWidth; p.classList.add("goyang");
  try { navigator.vibrate && navigator.vibrate([60, 40, 60]); } catch (e) {}
}
async function kaBuka() {
  const el = document.getElementById("ka-kunci"), i = document.getElementById("ka-pin"), p = document.getElementById("ka-pesan"), b = document.querySelector("#ka-kunci .ka-buka");
  const pin = (i && i.value || "").trim(); if (!pin) { p.textContent = "Isi PIN admin dulu"; _kaGoyang(el); return; }
  b.disabled = true; b.classList.add("muat"); b.innerHTML = `<span><i class="ka-putar"></i>Memeriksa…</span>`;
  try {
    const h = await apiVerifyAdminPin(pin);
    if (h && (h.ok || h.pinBelumDiatur)) {
      KA.salah = 0; KA.terkunci = false; _kaLS.set("kaAktif", String(Date.now()));
      p.textContent = ""; el.classList.add("terbuka"); b.innerHTML = `<span>✅ Terbuka</span>`;
      setTimeout(() => el.remove(), 900);
      setTimeout(kaTawarkanSidik, 1300);
      if (h.pinBelumDiatur) toast("PIN admin belum diatur — segera atur di Pengaturan supaya kunci ini berfungsi.", "warn");
      return;
    }
    KA.salah++; i.value = ""; i.dispatchEvent(new Event("input")); _kaSisaCoba(el); _kaGoyang(el);
    if (KA.salah >= 5) { p.textContent = "Salah 5 kali — keluar dari akun demi keamanan."; setTimeout(kaKeluarPaksa, 1400); return; }
    p.textContent = `PIN salah — sisa ${5 - KA.salah} kesempatan`;
  } catch (e) { p.textContent = "Gagal memeriksa PIN: " + (e.message || e); }
  finally { if (!el.classList.contains("terbuka")) { b.disabled = false; b.classList.remove("muat"); b.innerHTML = `<span>🔓 Buka Kunci</span>`; } }
}
async function kaKeluarPaksa() {
  try { if (typeof AK !== "undefined") { const r = await akPanggil("perangkat_daftar"); const ini = (r.perangkat || []).find((x) => x.perangkat_id === akPerangkat().id); if (ini) await akPanggil("perangkat_hapus", { id: ini.id }); } } catch (e) {}
  try { if (typeof _akBersihkan === "function") await _akBersihkan(); } catch (e) {}
  try { localStorage.removeItem("guruId"); localStorage.removeItem("guruNama"); } catch (e) {}
  _kaLS.set("kaAktif", null);
  location.reload();
}
// catat aktivitas (paling sering tiap 20 detik) supaya kunci 15 menit dihitung dari terakhir dipakai
(function () {
  const catat = () => { if (KA.terkunci || !_kaAdminAktif()) return; const n = Date.now(); if (n - KA.tAktif < 20000) return; KA.tAktif = n; _kaLS.set("kaAktif", String(n)); };
  ["pointerdown", "keydown", "touchstart"].forEach((ev) => document.addEventListener(ev, catat, { passive: true, capture: true }));
  document.addEventListener("visibilitychange", () => { if (!document.hidden) kaCek(); });
  setInterval(kaCek, 15000);
})();
// setelah aplikasi siap (boot) & setelah memilih guru/masuk akun → periksa
(function () {
  if (typeof boot === "function") { const asli = boot; boot = async function () { const h = await asli.apply(this, arguments); KA.siap = true; await kaCek2Langkah(); kaCek(); return h; }; }
  if (typeof _selesaikanPilihGuru === "function") {
    const asli = _selesaikanPilihGuru;
    _selesaikanPilihGuru = function () { const h = asli.apply(this, arguments); if (KA.siap) _kaLS.set("kaAktif", String(Date.now())); return h; }; // dipilih/diverifikasi setelah aplikasi siap (bukan pemulihan otomatis saat dibuka)
  }
})();

// ── 2. Verifikasi 2 Langkah (Google Authenticator) ──
async function _kaFaktor() {
  try { const { data } = await AK.klien.auth.mfa.listFactors(); return (data && data.totp || []).filter((f) => f.status === "verified"); } catch (e) { return []; }
}
async function _kaPerlu2Langkah() {
  try { const { data } = await AK.klien.auth.mfa.getAuthenticatorAssuranceLevel(); return data && data.nextLevel === "aal2" && data.currentLevel !== "aal2"; } catch (e) { return false; }
}
// Tampilkan isian kode; resolve true bila kode benar, false bila batal
function _kaMintaKode(judul) {
  return new Promise(async (selesai) => {
    const f = (await _kaFaktor())[0]; if (!f) return selesai(true);
    document.getElementById("ka-2l")?.remove();
    const el = document.createElement("div"); el.id = "ka-2l"; el.className = "ka-lapis";
    el.innerHTML = _kaBingkai(`<div class="ka-ikon"><span class="ka-cincin hijau"></span>${KA_PERISAI}</div><h2>${judul || "Verifikasi 2 Langkah"}</h2>
      <p>Buka aplikasi <b>Google Authenticator</b> di HP pemilik akun, lalu masukkan <b>kode 6 angka</b> untuk "Aplikasi PKBM".</p>
      <div class="ka-isian kode"><input id="ka-kode" type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="• • • • • •" aria-label="Kode 6 angka"></div>
      <div id="ka-pesan2" class="ka-pesan" role="alert"></div>
      <button class="ka-buka" id="ka-kode-ok">Verifikasi</button><button class="ka-keluar" id="ka-kode-batal">Batal & Keluar</button>`);
    document.body.appendChild(el); _kaJalankanJam(el);
    const i = el.querySelector("#ka-kode"), p = el.querySelector("#ka-pesan2"), ok = el.querySelector("#ka-kode-ok");
    setTimeout(() => i.focus(), 60);
    const cek = async () => {
      const kode = i.value.replace(/\D/g, ""); if (kode.length !== 6) { p.textContent = "Kode harus 6 angka"; return; }
      ok.disabled = true; ok.textContent = "Memeriksa…";
      const { error } = await AK.klien.auth.mfa.challengeAndVerify({ factorId: f.id, code: kode });
      ok.disabled = false; ok.textContent = "Verifikasi";
      if (error) { p.textContent = "Kode salah atau kedaluwarsa — coba kode yang baru"; i.value = ""; i.focus(); _kaGoyang(el); return; }
      el.remove(); selesai(true);
    };
    ok.onclick = cek; i.addEventListener("keydown", (e) => { if (e.key === "Enter") cek(); });
    el.querySelector("#ka-kode-batal").onclick = () => { el.remove(); selesai(false); };
  });
}
// Saat aplikasi dibuka: sesi akun ada tetapi belum lolos verifikasi 2 langkah → minta kode
async function kaCek2Langkah() {
  if (typeof AK === "undefined" || !AK.guru) return;
  if (!(await _kaPerlu2Langkah())) return;
  const ok = await _kaMintaKode("Verifikasi 2 Langkah");
  if (!ok) kaKeluarPaksa();
}
// Masuk akun: setelah sandi benar, minta kode bila akun memakai verifikasi 2 langkah
(function () {
  if (typeof akMasuk !== "function") return;
  akMasuk = async function () {
    const login = (qs("ak-login")?.value || "").trim().toLowerCase(), sandi = qs("ak-sandi")?.value || "";
    if (!login || !sandi) return _akPesan("Isi nama pengguna/email dan sandi");
    const b = qs("ak-tombol"); b.disabled = true; b.textContent = "Memeriksa…"; _akPesan("");
    try {
      const r = await akPanggil("masuk", { login, sandi, perangkat: akPerangkat() });
      const { error } = await AK.klien.auth.setSession(r.sesi);
      if (error) throw error;
      if (await _kaPerlu2Langkah()) {
        const ok = await _kaMintaKode("Verifikasi 2 Langkah");
        if (!ok) { await AK.klien.auth.signOut().catch(() => {}); throw new Error("Masuk dibatalkan — kode verifikasi diperlukan"); }
      }
      _akSimpanGuru(r.guru);
      _akLS.set("akunCek", String(Date.now()));
      qs("ak-masuk")?.remove();
      _akMasukkanGuru(r.guru);
      if (r.wajibGanti) { _akLS.set("akunWajibGanti", "1"); akTampilWajibGanti(); }
    } catch (e) {
      _akPesan(e.message || "Gagal masuk");
      b.disabled = false; b.textContent = "Masuk";
    }
  };
})();
// Pengaturan: aktifkan / matikan verifikasi 2 langkah untuk akun yang sedang masuk
async function kaHtml2Langkah() {
  if (typeof AK === "undefined" || !AK.guru) return `<div class="ka-atur"><b>🛡️ Verifikasi 2 Langkah</b><small>Masuk dengan akun admin (nama pengguna + sandi) dulu untuk mengaktifkannya.</small></div>`;
  const f = await _kaFaktor();
  return `<div class="ka-atur ${f.length ? "on" : ""}"><div><b>🛡️ Verifikasi 2 Langkah — akun ${escapeHtml(AK.guru.nama || "")}</b>
    <small>${f.length ? "AKTIF — setiap masuk dari perangkat baru, selain sandi wajib memasukkan kode 6 angka dari Google Authenticator di HP Antum." : "Belum aktif. Sangat disarankan untuk akun admin: walau sandi tersimpan di Chrome / diketahui orang lain, akun tetap tidak bisa dibuka tanpa HP Antum."}</small></div>
    ${f.length ? `<button class="btn btn-sm btn-outline" onclick="kaMatikan2Langkah()">Matikan</button>` : `<button class="btn btn-sm btn-accent" onclick="kaAktifkan2Langkah()">Aktifkan</button>`}</div>
    ${kaHtmlSidik()}
    <div class="ka-atur"><div><b>🔒 Kunci Admin</b><small>Aplikasi meminta PIN admin setiap dibuka di jendela baru & setelah ${KA.menitKunci} menit tidak dipakai.</small></div><button class="btn btn-sm btn-ghost" onclick="kaKunci('manual')">Kunci Sekarang</button></div>`;
}
async function kaAktifkan2Langkah() {
  try {
    // bersihkan pendaftaran lama yang belum selesai
    const { data: semua } = await AK.klien.auth.mfa.listFactors();
    for (const f of (semua && semua.all || []).filter((x) => x.factor_type === "totp" && x.status !== "verified")) await AK.klien.auth.mfa.unenroll({ factorId: f.id }).catch(() => {});
    const { data, error } = await AK.klien.auth.mfa.enroll({ factorType: "totp", friendlyName: "Aplikasi PKBM " + new Date().toISOString().slice(0, 10) });
    if (error) throw error;
    openModal(`<h3>🛡️ Aktifkan Verifikasi 2 Langkah</h3>
      <ol class="ka-langkah"><li>Pasang aplikasi <b>Google Authenticator</b> di HP Antum (Play Store / App Store).</li>
        <li>Di aplikasi itu tekan <b>＋ → Pindai kode QR</b>, lalu pindai kode di bawah.</li>
        <li>Ketik <b>kode 6 angka</b> yang muncul di aplikasi, lalu tekan Aktifkan.</li></ol>
      <div class="ka-qr"><img src="${data.totp.qr_code}" alt="Kode QR"></div>
      <details class="ka-rahasia"><summary>Tidak bisa memindai? Ketik kunci ini di aplikasi</summary><code>${escapeHtml(data.totp.secret)}</code></details>
      <div class="field"><input id="ka-kode-baru" class="input" inputmode="numeric" maxlength="6" placeholder="Kode 6 angka" autocomplete="one-time-code"></div>
      <div id="ka-pesan3" class="ka-pesan"></div>
      <button class="btn btn-accent" style="width:100%" id="ka-aktif-ok">Aktifkan</button>`);
    qs("ka-aktif-ok").onclick = async () => {
      const kode = (qs("ka-kode-baru").value || "").replace(/\D/g, "");
      if (kode.length !== 6) { qs("ka-pesan3").textContent = "Kode harus 6 angka"; return; }
      const { error: e2 } = await AK.klien.auth.mfa.challengeAndVerify({ factorId: data.id, code: kode });
      if (e2) { qs("ka-pesan3").textContent = "Kode salah — tunggu kode berikutnya lalu coba lagi"; return; }
      closeModal(); toast("🛡️ Verifikasi 2 langkah AKTIF. Simpan HP Antum baik-baik.", "ok");
      if (typeof rgBukaPengaturan === "function") rgBukaPengaturan("akun");
    };
  } catch (e) { toast("Belum bisa mengaktifkan: " + (e.message || e) + " — pastikan MFA (TOTP) menyala di Supabase → Authentication → Multi-Factor.", "err"); }
}
async function kaMatikan2Langkah() {
  if (!(await konfirmasiTema("Matikan verifikasi 2 langkah? Akun admin kembali hanya dilindungi sandi.", { judul: "Matikan", ikon: "⚠️", teksYa: "Matikan" }))) return;
  const f = (await _kaFaktor())[0]; if (!f) return;
  if (!(await _kaMintaKode("Konfirmasi dengan kode"))) return;
  const { error } = await AK.klien.auth.mfa.unenroll({ factorId: f.id });
  if (error) { toast("Gagal: " + error.message, "err"); return; }
  toast("Verifikasi 2 langkah dimatikan", "ok"); if (typeof rgBukaPengaturan === "function") rgBukaPengaturan("akun");
}
// sisipkan di bagian atas tab Pengaturan Ruang → Akun Guru
(function () {
  if (typeof akIsiTabAkun !== "function") return;
  const asli = akIsiTabAkun;
  akIsiTabAkun = async function () { const h = await asli.apply(this, arguments); return (await kaHtml2Langkah()) + h; };
})();
(function () {
  const st = document.createElement("style");
  st.textContent = `
  .ka-lapis{position:fixed;inset:0;z-index:2147483000;display:grid;place-items:center;padding:16px;overflow:auto;background:#06141c;font-family:inherit;color:#fff;animation:kaMasuk .5s ease both}
  .ka-latar{position:fixed;inset:0;overflow:hidden;pointer-events:none;background:radial-gradient(120% 90% at 50% 0%,#0d3b3a 0%,#071a24 55%,#050c16 100%)}
  .ka-gumpal{position:absolute;border-radius:50%;filter:blur(60px);opacity:.75;animation:kaMelayang 18s ease-in-out infinite alternate}
  .ka-gumpal.g1{width:46vmax;height:46vmax;left:-12vmax;top:-14vmax;background:#10b981}
  .ka-gumpal.g2{width:38vmax;height:38vmax;right:-10vmax;top:8vmax;background:#0ea5e9;animation-duration:22s;animation-delay:-6s}
  .ka-gumpal.g3{width:34vmax;height:34vmax;left:18vmax;bottom:-16vmax;background:#f59e0b;opacity:.55;animation-duration:26s;animation-delay:-10s}
  .ka-gumpal.g4{width:26vmax;height:26vmax;right:12vmax;bottom:-8vmax;background:#8b5cf6;opacity:.5;animation-duration:20s;animation-delay:-3s}
  .ka-pola{position:absolute;inset:0;opacity:.09;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Cg fill='none' stroke='%23fff' stroke-width='1.2'%3E%3Crect x='18' y='18' width='28' height='28'/%3E%3Crect x='18' y='18' width='28' height='28' transform='rotate(45 32 32)'/%3E%3Ccircle cx='32' cy='32' r='6'/%3E%3C/g%3E%3C/svg%3E");background-size:64px 64px;mask-image:radial-gradient(circle at 50% 45%,#000 0,transparent 75%);-webkit-mask-image:radial-gradient(circle at 50% 45%,#000 0,transparent 75%)}
  .ka-tengah{position:relative;width:min(400px,100%);display:flex;flex-direction:column;align-items:center;gap:16px}
  .ka-jam{text-align:center;text-shadow:0 4px 24px rgba(0,0,0,.35);animation:kaNaik .7s .05s cubic-bezier(.2,.9,.3,1.2) both}
  .ka-jam b{display:block;font-size:52px;font-weight:800;letter-spacing:1px;line-height:1;font-variant-numeric:tabular-nums}
  .ka-jam small{font-size:13.5px;opacity:.8;font-weight:600}
  .ka-panel{width:100%;box-sizing:border-box;padding:26px 22px 18px;border-radius:28px;display:flex;flex-direction:column;align-items:stretch;gap:12px;text-align:center;
    background:linear-gradient(160deg,rgba(255,255,255,.2),rgba(255,255,255,.07));border:1px solid rgba(255,255,255,.28);
    box-shadow:0 30px 80px rgba(0,0,0,.45),inset 0 1px 0 rgba(255,255,255,.35);backdrop-filter:blur(22px) saturate(160%);-webkit-backdrop-filter:blur(22px) saturate(160%);
    animation:kaNaik .7s .15s cubic-bezier(.2,.9,.3,1.2) both}
  .ka-panel.goyang{animation:kaGoyang .5s ease both}
  .ka-sapa{align-self:center;font-size:12.5px;padding:5px 12px;border-radius:999px;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.18);color:#e2e8f0}
  .ka-sapa b{color:#fde68a}
  .ka-ikon{position:relative;width:84px;height:84px;margin:2px auto 0;display:grid;place-items:center}
  .ka-cincin{position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle,rgba(251,191,36,.45),rgba(251,191,36,0) 70%);animation:kaDenyut 2.4s ease-in-out infinite}
  .ka-cincin.hijau{background:radial-gradient(circle,rgba(52,211,153,.45),rgba(52,211,153,0) 70%)}
  .ka-svg{position:relative;width:60px;height:70px;filter:drop-shadow(0 8px 14px rgba(0,0,0,.35));animation:kaAyun 3.2s ease-in-out infinite;transform-origin:50% 10%}
  .ka-sengkang{transform-origin:19px 34px;transition:transform .5s cubic-bezier(.3,1.6,.5,1)}
  .ka-centang{stroke-dasharray:40;stroke-dashoffset:40;animation:kaGaris .8s .6s ease forwards}
  .ka-panel h2{margin:0;font-size:22px;font-weight:800;letter-spacing:.2px;color:#fff}
  .ka-panel p{margin:-4px 0 2px;font-size:13.5px;line-height:1.6;color:rgba(226,232,240,.88)}.ka-panel p b{color:#fff}
  .ka-isian{position:relative;height:58px;border-radius:16px;background:rgba(2,6,23,.35);border:1.5px solid rgba(255,255,255,.22);transition:border-color .2s,box-shadow .2s;cursor:text}
  .ka-isian:focus-within{border-color:#34d399;box-shadow:0 0 0 4px rgba(52,211,153,.22)}
  .ka-isian input{position:absolute;inset:0;width:100%;height:100%;box-sizing:border-box;border:0;outline:none;background:transparent;color:transparent;caret-color:transparent;font-size:16px;padding:0 48px;text-align:center}
  .ka-isian.kode input{color:#fff;caret-color:#34d399;font-size:28px;font-weight:800;letter-spacing:12px;padding:0 12px 0 24px}.ka-isian.kode input::placeholder{color:rgba(255,255,255,.35);letter-spacing:6px}
  .ka-titik{position:absolute;inset:0 48px;display:flex;align-items:center;justify-content:center;gap:10px;pointer-events:none}
  .ka-titik span{color:rgba(255,255,255,.45);font-size:15px;letter-spacing:1px}
  .ka-titik i{width:14px;height:14px;border-radius:50%;background:linear-gradient(135deg,#fde68a,#34d399);box-shadow:0 0 12px rgba(52,211,153,.7);animation:kaTitik .25s cubic-bezier(.3,1.8,.5,1) both}
  .ka-titik.lihat i{width:auto;height:auto;background:none;box-shadow:none;font-style:normal;font-size:24px;font-weight:800;color:#fff}
  .ka-lihat{position:absolute;right:8px;top:50%;transform:translateY(-50%);width:38px;height:38px;border-radius:12px;border:0;background:rgba(255,255,255,.1);color:#fff;font-size:17px;cursor:pointer}
  .ka-lihat:hover{background:rgba(255,255,255,.2)}
  .ka-coba{display:flex;align-items:center;justify-content:center;gap:6px}
  .ka-coba i{width:22px;height:5px;border-radius:9px;background:#34d399;box-shadow:0 0 8px rgba(52,211,153,.6);transition:background .3s}
  .ka-coba i.habis{background:rgba(248,113,113,.9);box-shadow:0 0 8px rgba(248,113,113,.6)}
  .ka-coba small{margin-left:6px;font-size:11.5px;color:rgba(226,232,240,.7);font-weight:600}
  .ka-pesan{min-height:18px;color:#fca5a5;font-size:13px;font-weight:700}
  .ka-buka{position:relative;overflow:hidden;border:0;border-radius:16px;padding:15px;font-weight:800;font-size:16px;color:#052e2b;cursor:pointer;
    background:linear-gradient(135deg,#6ee7b7,#34d399 45%,#fbbf24);box-shadow:0 12px 28px rgba(16,185,129,.35);transition:transform .15s,box-shadow .2s}
  .ka-buka:hover{transform:translateY(-2px);box-shadow:0 16px 34px rgba(16,185,129,.45)}.ka-buka:active{transform:translateY(0) scale(.98)}
  .ka-buka::after{content:"";position:absolute;top:0;left:-60%;width:40%;height:100%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.55),transparent);transform:skewX(-20deg);animation:kaKilau 3.5s 1s ease-in-out infinite}
  .ka-buka:disabled{opacity:.85;cursor:wait}
  .ka-buka span{position:relative;display:inline-flex;align-items:center;gap:8px}
  .ka-putar{width:16px;height:16px;border-radius:50%;border:2.5px solid rgba(5,46,43,.25);border-top-color:#052e2b;animation:kaPutar .7s linear infinite}
  .ka-keluar{border:0;background:none;color:rgba(226,232,240,.7);font-weight:600;font-size:12.5px;cursor:pointer;padding:6px}
  .ka-keluar:hover{color:#fca5a5;text-decoration:underline}
  .ka-kaki{font-size:11.5px;color:rgba(226,232,240,.55);letter-spacing:.3px;animation:kaNaik .7s .3s both}
  .ka-lapis.terbuka .ka-sengkang{transform:translateY(-7px) rotate(-28deg)}
  .ka-lapis.terbuka .ka-panel{animation:kaKeluar .6s .3s ease forwards}.ka-lapis.terbuka .ka-jam,.ka-lapis.terbuka .ka-kaki{animation:kaKeluar .6s .3s ease forwards}
  .ka-lapis.terbuka{animation:kaPudar .5s .45s ease forwards}
  @keyframes kaMasuk{from{opacity:0}to{opacity:1}}
  @keyframes kaPudar{to{opacity:0;visibility:hidden}}
  @keyframes kaNaik{from{opacity:0;transform:translateY(24px) scale(.97)}to{opacity:1;transform:none}}
  @keyframes kaKeluar{to{opacity:0;transform:translateY(-18px) scale(1.04)}}
  @keyframes kaMelayang{0%{transform:translate(0,0) scale(1)}50%{transform:translate(6vmax,4vmax) scale(1.12)}100%{transform:translate(-4vmax,7vmax) scale(.92)}}
  @keyframes kaDenyut{0%,100%{transform:scale(.85);opacity:.7}50%{transform:scale(1.15);opacity:1}}
  @keyframes kaAyun{0%,100%{transform:rotate(-4deg)}50%{transform:rotate(4deg)}}
  @keyframes kaGoyang{0%,100%{transform:none}15%,55%{transform:translateX(-10px)}35%,75%{transform:translateX(10px)}90%{transform:translateX(-4px)}}
  @keyframes kaTitik{from{transform:scale(0);opacity:0}to{transform:scale(1);opacity:1}}
  @keyframes kaKilau{0%{left:-60%}35%,100%{left:130%}}
  @keyframes kaPutar{to{transform:rotate(360deg)}}
  @keyframes kaGaris{to{stroke-dashoffset:0}}
  @media (max-height:640px){.ka-jam b{font-size:38px}.ka-ikon{width:64px;height:64px}.ka-svg{width:46px;height:54px}.ka-panel{padding:20px 18px 14px;gap:10px}}
  @media (prefers-reduced-motion:reduce){.ka-lapis *,.ka-lapis{animation-duration:.01ms!important;animation-iteration-count:1!important}}
  .ka-atur{display:flex;align-items:center;gap:12px;justify-content:space-between;border:1.5px solid #e2e8f0;border-radius:14px;padding:12px 14px;margin-bottom:10px;background:#f8fafc}
  .ka-atur.on{border-color:#86efac;background:#f0fdf4}.ka-atur b{display:block;font-size:14px}.ka-atur small{color:var(--text-secondary);font-size:12px;line-height:1.5}
  .ka-langkah{font-size:13px;line-height:1.7;padding-left:20px}.ka-qr{display:grid;place-items:center;margin:8px 0}.ka-qr img{width:200px;height:200px;background:#fff;padding:8px;border-radius:12px;border:1px solid #e2e8f0}
  .ka-rahasia{font-size:12px;margin-bottom:8px}.ka-rahasia code{display:block;word-break:break-all;background:#f1f5f9;padding:6px 8px;border-radius:8px;margin-top:4px}`;
  document.head.appendChild(st);
})();

// ── 3. 👆 SIDIK JARI (WebAuthn, sensor bawaan HP/laptop) untuk membuka Kunci Admin ──
// Didaftarkan per perangkat. Sidik jari tidak pernah keluar dari HP — aplikasi hanya menyimpan "kunci
// pengenal" perangkat ini (localStorage). PIN tetap bisa dipakai sebagai cadangan.
const KA_SIDIK_SVG = `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 11v3a8 8 0 0 1-1.5 4.7"/><path d="M8.5 13.5A3.5 3.5 0 0 1 15.5 11v1.5c0 2.6-.6 5-1.7 7"/><path d="M5.2 15.5A7 7 0 0 1 5 13v-2a7 7 0 0 1 12.6-4.2"/><path d="M19 10.5v1.8c0 1.6-.2 3.2-.6 4.7"/><path d="M7 4.6A9.9 9.9 0 0 1 12 3.3"/></svg>`;
const _kaSidikKunci = () => "ka-sidik:" + ((typeof STATE !== "undefined" && STATE.guruId) || "");
const _kaB64 = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const _kaDariB64 = (s) => Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4)), (c) => c.charCodeAt(0));
const _kaAcak = (n) => crypto.getRandomValues(new Uint8Array(n));
function kaSidikAda() { try { return !!(window.PublicKeyCredential && localStorage.getItem(_kaSidikKunci())); } catch (e) { return false; } }
async function kaSidikDidukung() {
  try { return !!(window.PublicKeyCredential && window.isSecureContext && await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()); } catch (e) { return false; }
}
// Pendaftaran sidik jari perangkat ini. Bila fungsi server sudah diperbarui, kunci publiknya disimpan di
// server sehingga sidik jari bisa dipakai MASUK kapan saja (juga setelah Keluar Akun). Bila belum, sidik
// jari tetap bisa membuka Kunci Admin / Masuk Harian selama akun belum dikeluarkan.
const _sidikPerangkat = () => { try { return JSON.parse(localStorage.getItem("sidik:perangkat") || "null"); } catch (e) { return null; } };
async function kaDaftarSidik() {
  if (!(await kaSidikDidukung())) { toast("Perangkat/browser ini tidak punya sensor sidik jari (atau kunci layar belum diatur).", "warn"); return false; }
  try {
    let tantangan = null, server = typeof akPanggil === "function";
    if (server) { try { tantangan = (await akPanggil("sidik_tantangan")).tantangan; if (!tantangan) server = false; } catch (e) { server = false; } }
    const nama = (STATE.guruNama || _kaNama() || "Guru").split(",")[0];
    const k = await navigator.credentials.create({ publicKey: {
      challenge: tantangan ? _kaDariB64(tantangan) : _kaAcak(32), rp: { name: "PKBM Al-Umm Barabai" },
      user: { id: new TextEncoder().encode(String(STATE.guruId).slice(0, 64)), name: nama, displayName: nama },
      pubKeyCredParams: [{ type: "public-key", alg: -7 }, { type: "public-key", alg: -257 }],
      authenticatorSelection: { authenticatorAttachment: "platform", userVerification: "required", residentKey: "discouraged" },
      timeout: 60000, attestation: "none" } });
    if (!k) return false;
    const id = _kaB64(k.rawId);
    if (server) {
      try {
        const spki = k.response.getPublicKey && k.response.getPublicKey(), alg = k.response.getPublicKeyAlgorithm && k.response.getPublicKeyAlgorithm();
        if (!spki) throw new Error("Browser ini belum mendukung masuk dengan sidik jari");
        await akPanggil("sidik_daftar", { credId: id, spki: _kaB64(spki), alg, clientData: _kaB64(k.response.clientDataJSON), perangkat: akPerangkat() });
      } catch (e) { server = false; console.warn("Sidik jari belum tersimpan di server:", e.message || e); }
    }
    localStorage.setItem(_kaSidikKunci(), JSON.stringify({ id, t: Date.now() }));
    localStorage.setItem("sidik:perangkat", JSON.stringify({ id, guruId: STATE.guruId, nama, server, t: Date.now() }));
    toast(server ? "👆 Sidik jari aktif — bisa dipakai masuk kapan saja di perangkat ini" : "👆 Sidik jari aktif di perangkat ini", "ok");
    return true;
  } catch (e) { if (e && e.name !== "NotAllowedError") toast("Gagal mendaftarkan sidik jari: " + (e.message || e), "err"); return false; }
}
function kaHapusSidik() {
  const reg = _sidikPerangkat();
  try { localStorage.removeItem(_kaSidikKunci()); if (reg && reg.guruId === STATE.guruId) { localStorage.removeItem("sidik:perangkat"); if (reg.server && typeof akPanggil === "function") akPanggil("sidik_hapus", { credId: reg.id }).catch(() => {}); } } catch (e) {}
  toast("Sidik jari dimatikan di perangkat ini", "ok"); kaSegarSidik();
}
async function kaBukaSidik(diam) {
  const el = document.getElementById("ka-kunci"), p = document.getElementById("ka-pesan"); if (!el || el.classList.contains("terbuka")) return;
  let data; try { data = JSON.parse(localStorage.getItem(_kaSidikKunci()) || "null"); } catch (e) {}
  if (!data) return;
  try {
    const h = await navigator.credentials.get({ publicKey: { challenge: _kaAcak(32), allowCredentials: [{ type: "public-key", id: _kaDariB64(data.id), transports: ["internal"] }], userVerification: "required", timeout: 60000 } });
    const flag = h && new Uint8Array(h.response.authenticatorData)[32];
    if (!h || !(flag & 0x04)) throw new Error("Sidik jari tidak terverifikasi");
    KA.salah = 0; KA.terkunci = false; _kaLS.set("kaAktif", String(Date.now()));
    if (p) p.textContent = ""; el.classList.add("terbuka");
    const b = el.querySelector(".ka-buka"); if (b) b.innerHTML = `<span>✅ Terbuka</span>`;
    setTimeout(() => el.remove(), 900);
  } catch (e) {
    if (diam) return; // percobaan otomatis saat layar kunci muncul — diam saja bila dibatalkan
    if (p) p.textContent = e && e.name === "NotAllowedError" ? "Sidik jari dibatalkan — coba lagi atau pakai PIN." : "Sidik jari gagal — pakai PIN.";
  }
}
// Setelah berhasil membuka dengan PIN: tawarkan sidik jari sekali (bila perangkat mendukung)
async function kaTawarkanSidik() {
  try {
    const reg = _sidikPerangkat(), punya = reg && reg.guruId === STATE.guruId && (reg.server || Date.now() - (reg.t || 0) < 7 * 864e5);
    if ((punya && kaSidikAda()) || (localStorage.getItem("ka-sidik-tolak:" + STATE.guruId) && !(typeof KH !== "undefined" && KH.mintaDaftar)) || !(await kaSidikDidukung())) return;
    if (typeof KH !== "undefined") KH.mintaDaftar = false;
    const ya = typeof konfirmasiTema === "function" ? await konfirmasiTema("Lain kali masuk cukup dengan <b>sidik jari</b> di perangkat ini — tanpa mengetik sandi.<br><small>Sidik jari tetap tersimpan di HP Antum, tidak dikirim ke aplikasi.</small>", { ikon: "👆", judul: "Aktifkan Sidik Jari?", teksYa: "Aktifkan" }) : false;
    if (ya) await kaDaftarSidik(); else localStorage.setItem("ka-sidik-tolak:" + STATE.guruId, "1");
  } catch (e) {}
}
function kaHtmlSidik() {
  const ada = kaSidikAda();
  return `<div class="ka-atur ${ada ? "on" : ""}" id="ka-atur-sidik"><div><b>👆 Sidik Jari — perangkat ini</b><small>${ada ? "AKTIF — Masuk Harian & Kunci Admin di perangkat ini bisa dibuka dengan sidik jari. Sandi & PIN tetap bisa dipakai." : "Masuk Harian & Kunci Admin dibuka dengan sidik jari / kunci layar HP, tanpa mengetik. Diaktifkan per perangkat."}</small></div>
    ${ada ? `<button class="btn btn-sm btn-outline" onclick="kaHapusSidik()">Matikan</button>` : `<button class="btn btn-sm btn-accent" onclick="kaDaftarSidik().then(kaSegarSidik)">Aktifkan</button>`}</div>`;
}
function kaSegarSidik() { const w = document.getElementById("ka-atur-sidik"); if (w) w.outerHTML = kaHtmlSidik(); }

// ── 4. Jangan biarkan browser menyimpan / menawarkan sandi tersimpan (Google Password Manager) ──
// Semua kolom sandi & PIN diubah jadi kolom teks bertitik (bukan type=password), sehingga Chrome tidak
// mengenalinya sebagai form sandi: tidak muncul daftar sandi tersimpan & tidak menawarkan "Simpan sandi?".
// Kolom PIN (inputmode numeric / id berisi "pin") hanya menerima angka.
(function () {
  const ubah = (i) => {
    if (!i || i.dataset.kaAman) return;
    i.dataset.kaAman = "1";
    const pin = i.inputMode === "numeric" || /pin/i.test(i.id);
    if (i.type === "password") { i.type = "text"; i.classList.add("ka-tutup"); }
    i.setAttribute("autocomplete", "off"); i.setAttribute("autocorrect", "off"); i.setAttribute("autocapitalize", "off");
    i.setAttribute("spellcheck", "false"); i.setAttribute("data-lpignore", "true"); i.setAttribute("data-1p-ignore", "");
    if (!i.name) i.name = "f" + Math.random().toString(36).slice(2, 8);
    if (pin) { i.inputMode = "numeric"; i.setAttribute("pattern", "[0-9]*"); i.addEventListener("input", () => { const d = i.value.replace(/\D/g, ""); if (d !== i.value) i.value = d; }); }
  };
  const nama = (i) => { if (i && !i.dataset.kaAman && (i.id === "ak-login" || i.getAttribute("autocomplete") === "username")) { i.dataset.kaAman = "1"; i.setAttribute("autocomplete", "off"); i.setAttribute("data-lpignore", "true"); i.name = "u" + Math.random().toString(36).slice(2, 8); } };
  const sapu = (akar) => { akar.querySelectorAll("input[type=password]").forEach(ubah); akar.querySelectorAll("#ak-login,input[autocomplete=username]").forEach(nama); };
  sapu(document);
  new MutationObserver((ms) => ms.forEach((m) => m.addedNodes.forEach((n) => { if (n.nodeType !== 1) return; if (n.matches("input[type=password]")) ubah(n); if (n.matches("#ak-login")) nama(n); if (n.querySelectorAll) sapu(n); }))).observe(document.documentElement, { childList: true, subtree: true });
  // Bila browser tetap mengisi otomatis (latar biru muda = :-webkit-autofill), kosongkan lagi:
  // sandi & nama pengguna harus diketik sendiri oleh pemilik akun.
  document.addEventListener("animationstart", (e) => {
    if (e.animationName !== "kaIsiOtomatis") return;
    const i = e.target; if (!(i instanceof HTMLInputElement)) return;
    if (!(i.classList.contains("ka-tutup") || i.id === "ak-login" || i.id === "ka-pin" || /pin|sandi/i.test(i.id))) return;
    i.value = ""; i.dispatchEvent(new Event("input", { bubbles: true }));
  }, true);
  // tombol Lihat/Tutup sandi: ganti titik ↔ huruf (bukan mengganti type)
  window.akLihatSandi = function (b) { const i = b.previousElementSibling; const tutup = i.classList.toggle("ka-tutup"); b.textContent = tutup ? "Lihat" : "Tutup"; };
  const st = document.createElement("style");
  st.textContent = `.ka-tutup{-webkit-text-security:disc;text-security:disc}
  @keyframes kaIsiOtomatis{from{outline-color:transparent}to{outline-color:transparent}}input:-webkit-autofill{animation:kaIsiOtomatis .01s}
  .ka-sidik{display:flex;align-items:center;justify-content:center;gap:10px;border:1.5px solid rgba(110,231,183,.55);border-radius:16px;padding:12px;background:rgba(16,185,129,.14);color:#d1fae5;font-weight:800;font-size:14.5px;cursor:pointer;transition:background .2s,transform .15s}
  .ka-sidik:hover{background:rgba(16,185,129,.26)}.ka-sidik:active{transform:scale(.98)}.ka-sidik span{display:grid;place-items:center;color:#6ee7b7;animation:kaDenyut 2.4s ease-in-out infinite}`;
  document.head.appendChild(st);
})();

// ── 5. 🌙 MASUK HARIAN — setiap lewat pukul 00.00, semua pengguna akun wajib masuk lagi ──
// Pilihan: ketik sandi akun (diperiksa server, sesi diperbarui) ATAU sidik jari (bila sudah diaktifkan di
// perangkat ini). Khusus admin: setelah itu tetap diminta PIN Admin. Berlaku saat "Wajib Masuk Dengan Akun" aktif.
const KH = { kunci: (id) => "akunHarian:" + id };
const _khHariIni = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };
const _khAktif = () => typeof AK !== "undefined" && AK.wajib && AK.guru && AK.guru.id && typeof STATE !== "undefined" && STATE.guruId === AK.guru.id;
function khTandai() { try { if (typeof AK !== "undefined" && AK.guru) localStorage.setItem(KH.kunci(AK.guru.id), _khHariIni()); } catch (e) {} }
async function _kaVerifSidik() {
  let data; try { data = JSON.parse(localStorage.getItem(_kaSidikKunci()) || "null"); } catch (e) {}
  if (!data) return false;
  const h = await navigator.credentials.get({ publicKey: { challenge: _kaAcak(32), allowCredentials: [{ type: "public-key", id: _kaDariB64(data.id), transports: ["internal"] }], userVerification: "required", timeout: 60000 } });
  return !!(h && (new Uint8Array(h.response.authenticatorData)[32] & 0x04));
}
function khCek() {
  if (!KA.siap || !_khAktif() || document.getElementById("kh-kunci") || document.getElementById("ak-masuk")) return;
  let t = null; try { t = localStorage.getItem(KH.kunci(AK.guru.id)); } catch (e) {}
  if (!t) { khTandai(); return; } // pertama kali sejak fitur ini ada: mulai berlaku pukul 00.00 berikutnya
  if (t !== _khHariIni()) khKunci();
}
// Pukul 00.00 → tampilkan halaman Masuk Akun Guru (berlogo PKBM) seperti awal. Sesi lama disimpan dulu
// di perangkat supaya pemilik HP bisa memakai sidik jari; masuk dengan sandi tetap lewat server.
function khKunci() {
  document.getElementById("ka-kunci")?.remove(); KA.terkunci = false;
  KH.harian = true;
  akTampilMasuk();
}
const _khSidikKunci = () => "ka-sidik:" + ((typeof AK !== "undefined" && AK.guru && AK.guru.id) || "");
// Ikon sidik jari di halaman Masuk (selalu tampil). Siap dipakai bila perangkat ini sudah mendaftarkan
// sidik jari di server (kapan saja, juga setelah Keluar Akun) — atau, cara lama, akunnya masih tersimpan.
async function _khPasangSidik() {
  try {
    const el = document.getElementById("ak-masuk"); if (!el || !window.PublicKeyCredential) return;
    const reg = _sidikPerangkat();
    let mode = reg && reg.server ? "server" : null, nama = reg && reg.nama;
    if (!mode && typeof AK !== "undefined" && AK.guru && localStorage.getItem(_khSidikKunci())) {
      const { data } = await AK.klien.auth.getSession(); if (data && data.session) { mode = "lokal"; nama = (AK.guru.nama || "").split(",")[0]; }
    }
    if (!el.isConnected || el.querySelector(".kh-sidik-masuk")) return;
    KH.sidikMode = mode; KH.sidikSiap = !!mode;
    const kotak = document.createElement("div"); kotak.className = "kh-sidik-masuk";
    kotak.innerHTML = `<button type="button" class="kh-sidik-btn" onclick="khSidik()" aria-label="Masuk dengan sidik jari">${KA_SIDIK_SVG}</button>
      <b>Masuk dengan sidik jari</b><small>${escapeHtml(mode ? nama || "" : "Belum aktif di HP ini")}</small><div id="kh-pesan" class="kh-pesan"></div>`;
    const tombol = el.querySelector("#ak-tombol"); if (tombol) tombol.after(kotak); else el.querySelector(".ak-panel")?.appendChild(kotak);
    if (mode) setTimeout(() => { if (document.getElementById("ak-masuk") && !document.hidden) khSidik(true); }, 450);
  } catch (e) {}
}
async function khSidik(diam) {
  const p = document.getElementById("kh-pesan"), btn = document.querySelector(".kh-sidik-btn");
  if (!KH.sidikSiap) { if (p) p.textContent = "Sidik jari belum aktif di HP ini. Masuk dengan sandi sekali — setelah itu aplikasi menawarkan \"Aktifkan Sidik Jari\"."; KH.mintaDaftar = true; return; }
  if (KH.sidikJalan) return; KH.sidikJalan = true; if (btn) btn.classList.add("muat");
  try {
    if (KH.sidikMode === "server") {
      const reg = _sidikPerangkat();
      const { tantangan } = await akPanggil("sidik_tantangan");
      const h = await navigator.credentials.get({ publicKey: { challenge: _kaDariB64(tantangan), allowCredentials: [{ type: "public-key", id: _kaDariB64(reg.id), transports: ["internal"] }], userVerification: "required", timeout: 60000 } });
      if (!h) throw new Error("x");
      if (p) p.textContent = "";
      const r = await akPanggil("sidik_masuk", { credId: reg.id, clientData: _kaB64(h.response.clientDataJSON), authData: _kaB64(h.response.authenticatorData), signature: _kaB64(h.response.signature), perangkat: akPerangkat() });
      const { error } = await AK.klien.auth.setSession(r.sesi); if (error) throw error;
      _akSimpanGuru(r.guru); _akLS.set("akunCek", String(Date.now()));
      document.getElementById("ak-masuk")?.remove(); KH.harian = false;
      _akMasukkanGuru(r.guru); // admin → PIN Admin (lihat _khSesudahMasuk)
      return;
    }
    // cara lama: hanya bila akun masih tersimpan di perangkat ini
    let data; try { data = JSON.parse(localStorage.getItem(_khSidikKunci()) || "null"); } catch (e) {}
    if (!data) throw new Error("x");
    const h = await navigator.credentials.get({ publicKey: { challenge: _kaAcak(32), allowCredentials: [{ type: "public-key", id: _kaDariB64(data.id), transports: ["internal"] }], userVerification: "required", timeout: 60000 } });
    if (!h || !(new Uint8Array(h.response.authenticatorData)[32] & 0x04)) throw new Error("x");
    const { data: d } = await AK.klien.auth.getSession(); if (!d || !d.session) throw new Error("Sesi akun sudah habis — masuk dengan sandi.");
    document.getElementById("ak-masuk")?.remove(); KH.harian = false;
    if (STATE.guruId !== AK.guru.id) _akMasukkanGuru(AK.guru); else { khTandai(); _khSesudahMasuk(false); }
  } catch (e) {
    if (!diam && p) p.textContent = e && e.name === "NotAllowedError" ? "Sidik jari dibatalkan — ketuk ikon untuk mencoba lagi." : (e && e.message && e.message !== "x" ? e.message : "Sidik jari gagal — coba lagi atau masuk dengan sandi.");
    if (e && /belum terdaftar/i.test(e.message || "")) { try { localStorage.removeItem("sidik:perangkat"); } catch (x) {} }
  } finally { KH.sidikJalan = false; if (btn) btn.classList.remove("muat"); }
}
// Setelah masuk (sandi / sidik jari): admin wajib PIN Admin; guru lain ditawari sidik jari bila masuk dengan sandi
function _khSesudahMasuk(lewatSandi) {
  KH.harian = false;
  if (_kaAdminAktif()) { _kaLS.set("kaAktif", null); if (!document.getElementById("ka-kunci")) kaKunci("harian"); }
  else if (lewatSandi) setTimeout(kaTawarkanSidik, 400);
}
(function () {
  // masuk lewat layar Masuk biasa juga dihitung sudah masuk hari ini
  if (typeof _akMasukkanGuru === "function") { const asli = _akMasukkanGuru; _akMasukkanGuru = function () { khTandai(); const h = asli.apply(this, arguments); setTimeout(() => _khSesudahMasuk(true), 500); return h; }; }
  if (typeof akTampilMasuk === "function") { const asli = akTampilMasuk; akTampilMasuk = function (mode) { const h = asli.apply(this, arguments); if (mode !== "lupa") _khPasangSidik(); return h; }; }
  if (typeof boot === "function") { const asli = boot; boot = async function () { const h = await asli.apply(this, arguments); setTimeout(khCek, 300); return h; }; }
  document.addEventListener("visibilitychange", () => { if (!document.hidden) khCek(); });
  setInterval(khCek, 30000);
  // Kunci Admin jangan muncul di atas layar Masuk Hari Ini
  const ka = kaCek; kaCek = function () { if (_khAktif()) { let t = null; try { t = localStorage.getItem(KH.kunci(AK.guru.id)); } catch (e) {} if (t && t !== _khHariIni()) return khCek(); } return ka.apply(this, arguments); };
  const st = document.createElement("style");
  st.textContent = `.kh-sidik-masuk{display:flex;flex-direction:column;align-items:center;gap:3px;margin:18px 0 6px}
  .kh-sidik-btn{position:relative;width:78px;height:78px;border-radius:50%;border:2px solid rgba(52,211,153,.55);background:radial-gradient(circle at 50% 40%,rgba(16,185,129,.28),rgba(6,78,59,.55));color:#6ee7b7;display:grid;place-items:center;cursor:pointer;box-shadow:0 0 0 8px rgba(16,185,129,.1),0 10px 24px rgba(0,0,0,.3);transition:transform .15s,box-shadow .2s;margin-bottom:6px}
  .kh-sidik-btn::after{content:"";position:absolute;inset:-9px;border-radius:50%;border:2px solid rgba(52,211,153,.35);animation:kaDenyut 2.4s ease-in-out infinite}
  .kh-sidik-btn.muat{opacity:.6;pointer-events:none}.kh-sidik-btn:hover{box-shadow:0 0 0 10px rgba(16,185,129,.16),0 12px 28px rgba(0,0,0,.35)}.kh-sidik-btn:active{transform:scale(.94)}.kh-sidik-btn svg{width:40px;height:40px}
  .kh-sidik-masuk b{font-size:14px;font-weight:600;color:inherit;opacity:.92}.kh-sidik-masuk small{font-size:12.5px;opacity:.6}
  .kh-pesan{font-size:12.5px;font-weight:700;color:#f87171;text-align:center}.kh-pesan:empty{display:none}
  .kh-bulan{position:relative;font-size:46px;filter:drop-shadow(0 8px 14px rgba(0,0,0,.35));animation:kaAyun 3.2s ease-in-out infinite}
  .kh-atau{display:flex;align-items:center;gap:10px;color:rgba(226,232,240,.6);font-size:12px}.kh-atau i{flex:1;height:1px;background:rgba(255,255,255,.18)}
  .kh-sandi{position:relative;display:flex}.kh-sandi input{flex:1;height:54px;border-radius:16px;background:rgba(2,6,23,.35);border:1.5px solid rgba(255,255,255,.22);color:#fff;font-size:16px;padding:0 52px 0 16px;outline:none}
  .kh-sandi input:focus{border-color:#34d399;box-shadow:0 0 0 4px rgba(52,211,153,.22)}.kh-sandi input::placeholder{color:rgba(255,255,255,.45)}
  .kh-sandi button{position:absolute;right:8px;top:50%;transform:translateY(-50%);width:38px;height:38px;border-radius:12px;border:0;background:rgba(255,255,255,.1);color:#fff;font-size:17px;cursor:pointer}`;
  document.head.appendChild(st);
})();

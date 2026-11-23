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
  if (!KA.siap || KA.terkunci || document.getElementById("ka-kunci") || document.getElementById("ak-masuk")) return;
  if (!_kaAdminAktif()) return;
  const terakhir = +(_kaLS.get("kaAktif") || 0);
  if (!terakhir || Date.now() - terakhir > KA.menitKunci * 60000) kaKunci(terakhir ? "diam" : "baru");
}
function kaKunci(sebab) {
  KA.terkunci = true;
  const el = document.createElement("div"); el.id = "ka-kunci";
  el.innerHTML = `<div class="ka-panel"><div class="ka-ikon">🔒</div><b>Aplikasi Terkunci</b>
    <span>${sebab === "diam" ? `Tidak dipakai lebih dari ${KA.menitKunci} menit.` : "Akun admin dibuka di jendela baru."} Masukkan <b>PIN Admin</b> untuk melanjutkan.</span>
    <input id="ka-pin" type="password" inputmode="numeric" autocomplete="off" placeholder="PIN Admin" maxlength="12">
    <div id="ka-pesan" class="ka-pesan"></div>
    <button class="ka-buka" onclick="kaBuka()">Buka Kunci</button>
    <button class="ka-keluar" onclick="kaKeluarPaksa()">Bukan saya — Keluar Akun</button></div>`;
  document.body.appendChild(el);
  const i = el.querySelector("#ka-pin"); setTimeout(() => i.focus(), 60);
  i.addEventListener("keydown", (e) => { if (e.key === "Enter") kaBuka(); });
}
async function kaBuka() {
  const i = document.getElementById("ka-pin"), p = document.getElementById("ka-pesan"), b = document.querySelector("#ka-kunci .ka-buka");
  const pin = (i && i.value || "").trim(); if (!pin) { p.textContent = "Isi PIN admin"; return; }
  b.disabled = true; b.textContent = "Memeriksa…";
  try {
    const h = await apiVerifyAdminPin(pin);
    if (h && (h.ok || h.pinBelumDiatur)) {
      KA.salah = 0; KA.terkunci = false; _kaLS.set("kaAktif", String(Date.now()));
      document.getElementById("ka-kunci")?.remove();
      if (h.pinBelumDiatur) toast("PIN admin belum diatur — segera atur di Pengaturan supaya kunci ini berfungsi.", "warn");
      return;
    }
    KA.salah++; i.value = "";
    if (KA.salah >= 5) { p.textContent = "Salah 5 kali — keluar dari akun demi keamanan."; setTimeout(kaKeluarPaksa, 1200); return; }
    p.textContent = `PIN salah (${KA.salah}/5)`;
  } catch (e) { p.textContent = "Gagal memeriksa PIN: " + (e.message || e); }
  finally { b.disabled = false; b.textContent = "Buka Kunci"; }
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
    el.innerHTML = `<div class="ka-panel"><div class="ka-ikon">🛡️</div><b>${judul || "Verifikasi 2 Langkah"}</b>
      <span>Buka aplikasi <b>Google Authenticator</b> di HP pemilik akun, lalu masukkan <b>kode 6 angka</b> untuk "Aplikasi PKBM".</span>
      <input id="ka-kode" type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="••••••">
      <div id="ka-pesan2" class="ka-pesan"></div>
      <button class="ka-buka" id="ka-kode-ok">Verifikasi</button><button class="ka-keluar" id="ka-kode-batal">Batal & Keluar</button></div>`;
    document.body.appendChild(el);
    const i = el.querySelector("#ka-kode"), p = el.querySelector("#ka-pesan2"), ok = el.querySelector("#ka-kode-ok");
    setTimeout(() => i.focus(), 60);
    const cek = async () => {
      const kode = i.value.replace(/\D/g, ""); if (kode.length !== 6) { p.textContent = "Kode harus 6 angka"; return; }
      ok.disabled = true; ok.textContent = "Memeriksa…";
      const { error } = await AK.klien.auth.mfa.challengeAndVerify({ factorId: f.id, code: kode });
      ok.disabled = false; ok.textContent = "Verifikasi";
      if (error) { p.textContent = "Kode salah atau kedaluwarsa — coba kode yang baru"; i.value = ""; i.focus(); return; }
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
  st.textContent = `#ka-kunci,.ka-lapis{position:fixed;inset:0;z-index:2147483000;background:radial-gradient(ellipse at 50% 30%,#1e3a5f,#0b1220 70%);display:grid;place-items:center;padding:16px}
  .ka-panel{width:min(380px,100%);background:#fff;border-radius:22px;padding:22px 20px;display:flex;flex-direction:column;gap:10px;text-align:center;box-shadow:0 30px 80px rgba(0,0,0,.45)}
  .ka-ikon{font-size:46px}.ka-panel b{font-size:19px;color:#0f172a}.ka-panel span{font-size:13px;color:#475569;line-height:1.5}
  .ka-panel input{font-size:22px;letter-spacing:6px;text-align:center;padding:12px;border:2px solid #cbd5e1;border-radius:14px;outline:none}.ka-panel input:focus{border-color:#2563eb}
  .ka-pesan{min-height:16px;color:#dc2626;font-size:12.5px;font-weight:700}
  .ka-buka{border:0;border-radius:14px;padding:13px;font-weight:900;font-size:15px;color:#fff;background:linear-gradient(135deg,#1d4ed8,#0f766e);cursor:pointer}
  .ka-keluar{border:0;background:none;color:#64748b;font-weight:700;font-size:12.5px;text-decoration:underline;cursor:pointer}
  .ka-atur{display:flex;align-items:center;gap:12px;justify-content:space-between;border:1.5px solid #e2e8f0;border-radius:14px;padding:12px 14px;margin-bottom:10px;background:#f8fafc}
  .ka-atur.on{border-color:#86efac;background:#f0fdf4}.ka-atur b{display:block;font-size:14px}.ka-atur small{color:var(--text-secondary);font-size:12px;line-height:1.5}
  .ka-langkah{font-size:13px;line-height:1.7;padding-left:20px}.ka-qr{display:grid;place-items:center;margin:8px 0}.ka-qr img{width:200px;height:200px;background:#fff;padding:8px;border-radius:12px;border:1px solid #e2e8f0}
  .ka-rahasia{font-size:12px;margin-bottom:8px}.ka-rahasia code{display:block;word-break:break-all;background:#f1f5f9;padding:6px 8px;border-radius:8px;margin-top:4px}`;
  document.head.appendChild(st);
})();

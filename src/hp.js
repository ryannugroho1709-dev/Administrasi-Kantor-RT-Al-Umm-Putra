// ============================================================
//  TAMPILAN HP — fitur yang berlaku di semua halaman:
//  1. Tombol aksi cepat (＋) → panel pintasan Absen, Jurnal, Riwayat, Monitor, Kas, Cari
//  2. Tarik ke bawah untuk memuat ulang halaman yang sedang dibuka
//  3. Panel bawah (bottom sheet) bisa diseret turun untuk menutup
//  4. Badge angka di "Riwayat" navigasi bawah (sesi yang perlu ditindaklanjuti hari ini)
//  5. Mode hemat data & offline: gambar dimuat malas, data Monitor/Riwayat terakhir disimpan dan
//     ditampilkan saat sinyal hilang, plus banner "sedang offline"
//  Semua dibungkus try/catch — kalau ada yang gagal, fungsi utama aplikasi tetap jalan.
// ============================================================
(function () {
  const diHp = () => window.matchMedia("(max-width:860px)").matches;
  const halamanPunyaFabSendiri = ["kas"];

  // ── 1. Tombol aksi cepat ─────────────────────────────────
  function pasangFab() {
    if (document.getElementById("hp-fab")) return;
    const b = document.createElement("button");
    b.id = "hp-fab"; b.type = "button"; b.className = "hp-fab"; b.setAttribute("aria-label", "Aksi cepat");
    b.textContent = "＋";
    b.onclick = bukaAksiCepat;
    document.body.appendChild(b);
    perbaruiFab();
  }
  function perbaruiFab() {
    const sembunyi = halamanPunyaFabSendiri.includes(STATE.currentPage) || !STATE.guruId;
    document.body.classList.toggle("hp-fab-sembunyi", sembunyi);
  }
  window.bukaAksiCepat = function () {
    const aksi = [
      ["🕒", "Absen", "showPage('absensi-guru','page-absensi-guru','menuAbsensiGuru')"],
      ["📓", "Isi Jurnal", "showPage('jurnal-guru','page-jurnal-guru','menuJurnalGuru')"],
      ["📜", "Riwayat", "showPage('riwayat-absen','page-riwayat-absen','menuRiwayatAbsen')"],
      ["🗓️", "Jadwal", "showPage('jadwal','page-jadwal','menuJadwal')"],
    ];
    if (isAdmin()) aksi.push(["📡", "Monitor", "showPage('monitor','page-monitor','menuMonitor')"]);
    if (typeof bisaAksesKas === "function" && bisaAksesKas()) aksi.push(["💼", "Catat Kas", "showPage('kas','page-kas','menuKas');setTimeout(()=>{if(typeof bukaPilihJenisKas==='function'&&KAS.siap)bukaPilihJenisKas();},900)"]);
    aksi.push(["🔎", "Cari", "bukaPencarianCepat()"]);
    openModal(`<h3>⚡ Aksi Cepat</h3>
      <div class="hp-aksi-grid">${aksi.map(([i, l, f]) => `<button type="button" onclick="closeModal();${f.replace(/"/g, "&quot;")}"><span>${i}</span>${l}</button>`).join("")}</div>`);
  };

  // ── 2. Tarik ke bawah untuk memuat ulang ─────────────────
  function pasangTarikMuat() {
    const sc = document.getElementById("page-container");
    if (!sc || sc._hpTarik) return;
    sc._hpTarik = true;
    const ind = document.createElement("div");
    ind.className = "hp-tarik"; ind.innerHTML = "<span>↻</span>";
    document.body.appendChild(ind);
    let y0 = null, dy = 0, aktif = false;
    const AMBANG = 80;
    sc.addEventListener("touchstart", (e) => {
      if (!diHp() || sc.scrollTop > 0 || document.getElementById("modal-overlay")?.classList.contains("open")) { y0 = null; return; }
      if (e.target.closest("input,textarea,select,.chip-filter,[contenteditable]")) { y0 = null; return; }
      y0 = e.touches[0].clientY; dy = 0; aktif = false;
    }, { passive: true });
    sc.addEventListener("touchmove", (e) => {
      if (y0 === null) return;
      dy = e.touches[0].clientY - y0;
      if (dy <= 0 || sc.scrollTop > 0) { ind.style.opacity = 0; aktif = false; return; }
      aktif = true;
      const tarik = Math.min(dy, 130);
      ind.style.opacity = Math.min(1, tarik / AMBANG);
      ind.style.transform = `translateY(${tarik * 0.6 - 50}px) rotate(${tarik * 2.4}deg)`;
      ind.classList.toggle("siap", dy >= AMBANG);
    }, { passive: true });
    sc.addEventListener("touchend", async () => {
      if (y0 === null) return;
      y0 = null;
      if (!aktif || dy < AMBANG) { ind.style.transition = "opacity .2s,transform .2s"; ind.style.opacity = 0; ind.style.transform = "translateY(-50px)"; setTimeout(() => { ind.style.transition = ""; }, 220); return; }
      ind.classList.add("muat"); ind.style.transform = "translateY(10px)";
      try { if (navigator.vibrate) navigator.vibrate(10); } catch (e) {}
      try { await refreshCurrentPage(); } catch (e) { console.warn(e); }
      setTimeout(() => { ind.classList.remove("muat", "siap"); ind.style.opacity = 0; ind.style.transform = "translateY(-50px)"; }, 500);
      perbaruiBadge(true);
    });
  }

  // ── 3. Seret panel bawah untuk menutup ───────────────────
  function pasangSeretPanel() {
    const p = document.getElementById("modal-panel");
    if (!p || p._hpSeret) return;
    p._hpSeret = true;
    let y0 = null, dy = 0;
    p.addEventListener("touchstart", (e) => {
      if (!window.matchMedia("(max-width:620px)").matches) return;
      const atas = p.getBoundingClientRect().top;
      // Hanya bila disentuh di area pegangan (atas panel) & panel sedang di posisi gulir paling atas
      if (e.touches[0].clientY - atas > 44 || p.scrollTop > 0) { y0 = null; return; }
      y0 = e.touches[0].clientY; dy = 0; p.classList.add("hp-seret"); p.classList.remove("hp-lepas");
    }, { passive: true });
    p.addEventListener("touchmove", (e) => {
      if (y0 === null) return;
      dy = Math.max(0, e.touches[0].clientY - y0);
      p.style.transform = `translateY(${dy}px)`;
    }, { passive: true });
    p.addEventListener("touchend", () => {
      if (y0 === null) return;
      y0 = null; p.classList.remove("hp-seret"); p.classList.add("hp-lepas");
      if (dy > 110) { p.style.transform = "translateY(100%)"; setTimeout(() => { p.style.transform = ""; p.classList.remove("hp-lepas"); closeModal(); }, 190); }
      else { p.style.transform = ""; setTimeout(() => p.classList.remove("hp-lepas"), 220); }
    });
  }

  // ── 4. Badge di navigasi bawah ───────────────────────────
  let _badgeAngka = 0, _badgeWaktu = 0;
  async function perbaruiBadge(paksa) {
    try {
      if (!STATE.guruId || typeof apiGetMonitorHarian !== "function") return;
      if (!paksa && Date.now() - _badgeWaktu < 3 * 60 * 1000) { pasangBadge(); return; }
      _badgeWaktu = Date.now();
      const data = await apiGetMonitorHarian(tanggalISO(), hariIniIndo());
      const admin = isAdmin();
      _badgeAngka = (data || []).filter((r) => {
        if (!admin && r.jadwal?.guru_id !== STATE.guruId) return false;
        if (r.labelKhusus || !_sesiSudahLewat(tanggalISO(), r.jadwal?.jam_selesai)) return false;
        return (r.warna === "merah" && !r.sesi?.jam_masuk) || r.warna === "kuning";
      }).length;
      pasangBadge();
    } catch (e) { /* badge bersifat tambahan — abaikan kalau gagal */ }
  }
  window._hpPerbaruiBadge = perbaruiBadge;
  function pasangBadge() {
    const tombol = [...document.querySelectorAll("#bottom-nav .bn-item")].find((b) => /riwayat-absen/.test(b.getAttribute("onclick") || ""));
    if (!tombol) return;
    tombol.querySelector(".bn-badge")?.remove();
    if (_badgeAngka > 0) {
      tombol.insertAdjacentHTML("beforeend", `<span class="bn-badge" aria-label="${_badgeAngka} sesi perlu ditindaklanjuti">${_badgeAngka > 99 ? "99+" : _badgeAngka}</span>`);
      tombol.title = `${_badgeAngka} sesi hari ini perlu ditindaklanjuti (belum absen / lupa pulang-jurnal)`;
    }
  }

  // ── 5. Hemat data & offline ──────────────────────────────
  // Simpan hasil terakhir beberapa data penting supaya tetap bisa dilihat saat sinyal hilang.
  function bungkusCache(nama, maksByte) {
    const asli = window[nama];
    if (typeof asli !== "function" || asli._hpCache) return;
    const baru = async function (...args) {
      const kunci = "hpcache:" + nama + ":" + JSON.stringify(args);
      try {
        const hasil = await asli.apply(this, args);
        try { const teks = JSON.stringify(hasil); if (teks.length < maksByte) localStorage.setItem(kunci, JSON.stringify({ t: Date.now(), d: hasil })); } catch (e) {}
        return hasil;
      } catch (e) {
        if (!navigator.onLine) {
          try { const c = JSON.parse(localStorage.getItem(kunci) || "null"); if (c) { tampilOffline(true, c.t); return c.d; } } catch (e2) {}
        }
        throw e;
      }
    };
    baru._hpCache = true;
    window[nama] = baru;
  }
  function tampilOffline(on, sejak) {
    let el = document.getElementById("hp-offline");
    if (!el) { el = document.createElement("div"); el.id = "hp-offline"; el.className = "hp-offline"; document.body.appendChild(el); }
    if (on) {
      const jam = sejak ? new Date(sejak).toLocaleString("id-ID", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "";
      el.innerHTML = `📴 <span>Sedang offline${jam ? ` — menampilkan data tersimpan (${jam})` : " — data terakhir tetap bisa dilihat"}.</span>`;
    }
    el.classList.toggle("tampil", !!on);
  }
  function pasangGambarMalas(akar) {
    (akar.querySelectorAll ? akar.querySelectorAll("img:not([loading])") : []).forEach((img) => { img.loading = "lazy"; img.decoding = "async"; });
  }

  // ── 6. Kirim WA tanpa "terlempar" dari aplikasi ──────────
  // Dulu link wa.me membuka tab browser baru → di HP, aplikasi tertutup & saat kembali mulai lagi
  // dari Beranda. Sekarang: (a) di HP langsung membuka aplikasi WhatsApp (whatsapp://), (b) posisi
  // terakhir (halaman, filter, posisi gulir) disimpan, dan kalau aplikasi sempat dimulai ulang oleh
  // HP, otomatis kembali ke halaman yang sama, (c) sesi yang sudah dikirimi WA ditandai.
  const KUNCI_POSISI = "hpPosisiKembali";
  const _asliOpen = window.open.bind(window);
  const diPerangkatHp = () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  function simpanPosisi() {
    try {
      const sc = document.getElementById("page-container");
      const aktif = document.querySelector(".page.show");
      const m = (typeof MENU !== "undefined" ? MENU.flatMap((g) => g.items) : []).find((x) => x.key === STATE.currentPage);
      localStorage.setItem(KUNCI_POSISI, JSON.stringify({
        t: Date.now(), guruId: STATE.guruId, page: STATE.currentPage, pageId: m?.page || aktif?.id, i18n: m?.i18n || "",
        raFilter: typeof _RA_FILTER !== "undefined" ? _RA_FILTER : "", scroll: sc ? sc.scrollTop : 0,
      }));
    } catch (e) {}
  }
  // Kalau aplikasi TIDAK sempat ditutup HP (kembali dari WhatsApp dalam keadaan masih hidup), posisi
  // simpanan dibuang — supaya tidak "melompat" ke halaman lama saat nanti login ulang.
  function buangPosisiSaatKembali() {
    const h = () => { if (document.visibilityState !== "visible") return; document.removeEventListener("visibilitychange", h); try { localStorage.removeItem(KUNCI_POSISI); } catch (e) {} };
    setTimeout(() => document.addEventListener("visibilitychange", h), 300);
  }
  function pulihkanPosisi() {
    try {
      const p = JSON.parse(localStorage.getItem(KUNCI_POSISI) || "null");
      if (!p || Date.now() - p.t > 30 * 60 * 1000 || p.guruId !== STATE.guruId || !p.page || p.page === "dashboard") return false;
      if (STATE.currentPage === p.page) { localStorage.removeItem(KUNCI_POSISI); return true; }
      if (typeof _RA_FILTER !== "undefined" && p.raFilter) _RA_FILTER = p.raFilter;
      showPage(p.page, p.pageId, p.i18n);
      if (STATE.currentPage !== p.page) return false; // belum boleh (mis. admin belum terverifikasi) → coba lagi nanti
      localStorage.removeItem(KUNCI_POSISI);
      // Kembalikan posisi gulir setelah datanya selesai dimuat
      const sc = document.getElementById("page-container");
      let n = 0;
      const iv = setInterval(() => { n++; if (sc && sc.scrollHeight > p.scroll + 100) { sc.scrollTop = p.scroll; clearInterval(iv); } if (n > 25) clearInterval(iv); }, 200);
      toast("↩️ Kembali ke halaman sebelumnya", "ok");
      return true;
    } catch (e) { return false; }
  }
  function bukaWa(url) {
    let nomor = "", teks = "";
    try { const u = new URL(url); nomor = u.pathname.replace(/\D/g, ""); teks = u.searchParams.get("text") || ""; } catch (e) {}
    if (diPerangkatHp() && nomor) {
      // Langsung ke aplikasi WhatsApp; kalau WhatsApp tidak terpasang, jatuh ke wa.me
      let pergi = false;
      const tandai = () => { if (document.visibilityState === "hidden") pergi = true; };
      document.addEventListener("visibilitychange", tandai);
      location.href = `whatsapp://send?phone=${nomor}${teks ? "&text=" + encodeURIComponent(teks) : ""}`;
      setTimeout(() => { document.removeEventListener("visibilitychange", tandai); if (!pergi && document.visibilityState === "visible") _asliOpen(url, "_blank", "noopener"); }, 1600);
    } else {
      _asliOpen(url, "_blank", "noopener");
    }
  }
  function pasangPenangkapWa() {
    document.addEventListener("click", (e) => {
      const a = e.target.closest && e.target.closest('a[href^="https://wa.me/"],a[href^="https://api.whatsapp.com/"]');
      if (!a) return;
      e.preventDefault();
      simpanPosisi(); buangPosisiSaatKembali();
      if (a.dataset.waKunci && typeof _simpanKonfirmasiWa === "function") _simpanKonfirmasiWa(a.dataset.waKunci, { t: Date.now() });
      bukaWa(a.href);
      // Saat kembali dari WhatsApp: segarkan tampilan supaya tanda "✓ WA terkirim" muncul
      if (a.dataset.waKunci) {
        const balik = () => { if (document.visibilityState !== "visible") return; document.removeEventListener("visibilitychange", balik); setTimeout(() => { try { _tlSegarkan(); } catch (er) {} }, 300); };
        document.addEventListener("visibilitychange", balik);
        if (!diPerangkatHp()) setTimeout(() => { try { _tlSegarkan(); } catch (er) {} }, 500);
      }
    }, true);
    // window.open("https://wa.me/...") yang dipanggil langsung dari kode (slip gaji, dll) ikut diarahkan
    window.open = function (url, ...rest) {
      if (typeof url === "string" && /^https:\/\/(wa\.me|api\.whatsapp\.com)\//.test(url) && diPerangkatHp()) { simpanPosisi(); buangPosisiSaatKembali(); bukaWa(url); return null; }

      return _asliOpen(url, ...rest);
    };
  }

  // ── Kaitkan ke alur aplikasi ─────────────────────────────
  function mulai() {
    try {
      pasangFab(); pasangTarikMuat(); pasangSeretPanel(); pasangPenangkapWa();
      bungkusCache("apiGetMonitorHarian", 1500000);
      bungkusCache("apiGetRiwayatAbsenRange", 2500000);
      window.addEventListener("offline", () => tampilOffline(true));
      window.addEventListener("online", () => { tampilOffline(false); try { refreshCurrentPage(); } catch (e) {} });
      if (!navigator.onLine) tampilOffline(true);
      pasangGambarMalas(document);
      new MutationObserver((ms) => ms.forEach((m) => m.addedNodes.forEach((n) => { if (n.nodeType === 1) { if (n.tagName === "IMG" && !n.hasAttribute("loading")) { n.loading = "lazy"; n.decoding = "async"; } else pasangGambarMalas(n); } })))
        .observe(document.body, { childList: true, subtree: true });
      // Setelah pindah halaman: perbarui tombol aksi cepat & badge
      if (typeof showPage === "function" && !showPage._hp) {
        const asliShow = showPage;
        window.showPage = function (...a) { const r = asliShow.apply(this, a); try { perbaruiFab(); perbaruiBadge(); } catch (e) {} return r; };
        window.showPage._hp = true;
      }
      if (typeof renderBottomNav === "function" && !renderBottomNav._hp) {
        const asliNav = renderBottomNav;
        window.renderBottomNav = function (...a) { const r = asliNav.apply(this, a); try { pasangBadge(); } catch (e) {} return r; };
        window.renderBottomNav._hp = true;
      }
      perbaruiBadge(true);
      setInterval(() => { if (document.visibilityState === "visible") perbaruiBadge(true); }, 5 * 60 * 1000);
      // Guru baru login / berganti akun → segarkan badge & tombol aksi cepat
      // (kuncinya juga memuat status admin — admin baru terverifikasi sesudah halaman termuat)
      const kunciAkun = () => `${STATE.guruId || ""}|${isAdmin() ? 1 : 0}`;
      let guruTerakhir = kunciAkun();
      setInterval(() => {
        if (kunciAkun() === guruTerakhir) return;
        guruTerakhir = kunciAkun();

        perbaruiFab(); perbaruiBadge(true);
        if (STATE.guruId) setTimeout(pulihkanPosisi, 700);

      }, 2000);
    } catch (e) { console.warn("Fitur tampilan HP gagal dipasang:", e); }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mulai); else mulai();
})();

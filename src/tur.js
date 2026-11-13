// ============================================================
//  TUR PANDUAN (tutorial bersorot) — seperti aplikasi pada umumnya:
//  area yang dituju disorot, sisanya digelapkan, panah bergerak menunjuk, bisa dilewati.
//  • Muncul otomatis sekali saat guru pertama kali membuka halaman yang punya fitur baru.
//  • Bisa diulang kapan saja lewat tombol "❓ Panduan" (turUlang('<id>')).
//  Langkah yang elemennya tidak ada di layar (mis. tombol khusus admin) dilewati otomatis.
// ============================================================
const TUR = { aktif: null, i: 0, langkah: [], el: {} };

// Daftar tur per halaman. sel = CSS selector; boleh fungsi (return elemen). Versi dinaikkan bila ada fitur baru.
const TUR_DAFTAR = {
  "jadwal-ujian": { id: "ju", versi: 2, langkah: [
    { sel: ".ju2-aktif", judul: "🗓️ Jadwal ujian aktif", teks: "Jadwal ujian yang sedang/akan berlangsung langsung tampil di sini, lengkap dengan hitungan hari dan ringkasan tugas Antum." },
    { sel: "[data-tur=ju-papan] .ju2-sel:not([disabled])", judul: "✨ BARU: ketuk mapel di jadwal", teks: "Ketuk nama mapel di jadwal untuk <b>langsung mengumpulkan soalnya</b> — buat di Ujian Online, unggah Word/PDF, atau kabari admin lewat WA." },
    { sel: "[data-tur=ju-mapel]", judul: "📝 Mapel saya yang diujikan", teks: "Daftar mapel yang Antum ajar beserta status soalnya. Tekan <b>📤 Kumpulkan</b> bila belum. Soal yang dibuat di Ujian Online otomatis tercentang." },
    { sel: "[data-tur=ju-awas]", judul: "📋 Saya mengawas", teks: "Hari & sesi Antum mengawas. Tekan <b>✋ Absen Mengawas</b> saat bertugas — kehadiran mengawas <b>dihitung ke insentif bulanan</b> seperti JP mengajar." },
    { sel: ".ju2-saring", judul: "🔎 Saring jadwal", teks: "Centang untuk menampilkan hanya ujian yang terkait Antum (mengawas atau mapel Antum)." },
    { sel: ".ju2-tab", judul: "📅 Pilih hari", teks: "Pindah hari ujian di sini. Tanda ⭐ = hari Antum punya tugas. Saat hari ujian tiba, jadwal hari itu otomatis pindah ke paling atas." },
  ] },
  "ujian": { id: "uj", versi: 2, langkah: [
    { sel: ".uj3-hero", judul: "🧠 Pusat Ujian Online", teks: "Buat soal, buka sesi latihan/ujian, dan pantau hasil santri dari sini." },
    { sel: ".uj-item .uj-b-hijau", judul: "✨ BARU: 🧪 Uji coba", teks: "Kerjakan soal seperti santri untuk mengecek kunci & tingkat kesulitan. Nilainya <b>tidak disimpan ke mana pun</b>." },
    { sel: ".uj-item .btn-accent", judul: "▶ Buka sesi", teks: "Pilih kelas, latihan atau ujian, lalu bagikan token ke santri. Rekap nilai muncul otomatis." },
    { sel: ".uj3-cepat, .uj3-ubin", judul: "⚡ Akses cepat", teks: "Di <b>Rekap</b> sesi ujian ada tombol baru: <b>🔁 Remedial</b> (nilai terbaik yang dipakai) dan <b>📢 Tampilkan hasil</b> (santri melihat kunci & pembahasan)." },
  ] },
  "input-nilai": { id: "nl", versi: 2, langkah: [
    { sel: ".nl2-filter", judul: "🎯 Pilih mapel & kelas", teks: "Pilih mapel dan kelas yang mau diisi nilainya." },
    { sel: ".nl2-subtab", judul: "✨ BARU: mapel gabungan dipisah", teks: "Mapel gabungan (mis. Geografi/Sosiologi/Ekonomi) diisi <b>terpisah per mapel</b>. Nilai rapor otomatis = rata-rata ketiganya (lihat tab <b>📊 Rekap</b>)." },
    { sel: ".nl2-hero", judul: "🤖 Pola nilai otomatis", teks: "Isi saja nilai yang Antum punya. Ada UH/Tugas → bobot Standar; hanya UAS (+ kehadiran) → bobot UAS + Kehadiran. Dipilih otomatis per santri." },
    { sel: ".nl2-menu", judul: "📊 Excel", teks: "Lebih nyaman di Excel? Unduh leger, isi, lalu unggah kembali." },
    { sel: ".nl2-tombol-simpan", judul: "💾 Simpan", teks: "Jangan lupa simpan setelah mengisi. Nilai akhir di tabel = angka yang tercetak di rapor." },
  ] },
};

const _turKunci = (t) => `tur:${t.id}:v${t.versi}`;
const _turSudah = (t) => { try { return localStorage.getItem(_turKunci(t)) === "1"; } catch (e) { return true; } };
const _turTandai = (t) => { try { localStorage.setItem(_turKunci(t), "1"); } catch (e) {} };
function _turCari(sel) {
  if (typeof sel === "function") return sel();
  return [...document.querySelectorAll(sel)].find((el) => el.offsetParent !== null && el.getBoundingClientRect().height > 0) || null;
}

function turMulai(halaman, paksa) {
  const t = TUR_DAFTAR[halaman]; if (!t) return false;
  if (!paksa && _turSudah(t)) return false;
  const langkah = t.langkah.filter((l) => _turCari(l.sel));
  if (!langkah.length) return false;
  turTutup(true);
  TUR.aktif = t; TUR.langkah = langkah; TUR.i = 0;
  const lapis = document.createElement("div"); lapis.className = "tur-lapis"; lapis.innerHTML = `<div class="tur-sorot"></div><div class="tur-panah">👇</div><div class="tur-balon" role="dialog" aria-live="polite"></div>`;
  document.body.appendChild(lapis);
  TUR.el = { lapis, sorot: lapis.querySelector(".tur-sorot"), panah: lapis.querySelector(".tur-panah"), balon: lapis.querySelector(".tur-balon") };
  lapis.addEventListener("click", (e) => { if (e.target === lapis) turLanjut(); });
  _turTampil();
  return true;
}
function turUlang(halaman) { if (!turMulai(halaman || (typeof STATE !== "undefined" && STATE.currentPage), true)) toast("Panduan belum tersedia di layar ini", "info"); }
function turLanjut() { if (TUR.i < TUR.langkah.length - 1) { TUR.i++; _turTampil(); } else turTutup(); }
function turKembali() { if (TUR.i > 0) { TUR.i--; _turTampil(); } }
function turTutup(diam) {
  if (TUR.el.lapis) TUR.el.lapis.remove();
  if (TUR.aktif && !diam) _turTandai(TUR.aktif);
  TUR.aktif = null; TUR.el = {};
}
function _turTampil() {
  const l = TUR.langkah[TUR.i], el = _turCari(l.sel);
  if (!el) { turLanjut(); return; }
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  const n = TUR.langkah.length;
  TUR.el.balon.innerHTML = `<div class="tur-langkah">Langkah ${TUR.i + 1} dari ${n}</div><b>${l.judul}</b><p>${l.teks}</p>
    <div class="tur-titik">${TUR.langkah.map((_, k) => `<i class="${k === TUR.i ? "on" : ""}"></i>`).join("")}</div>
    <div class="tur-aksi"><button class="tur-lewati" onclick="turTutup()">Lewati</button><span></span>
      ${TUR.i ? `<button class="tur-btn garis" onclick="turKembali()">‹ Kembali</button>` : ""}<button class="tur-btn" onclick="turLanjut()">${TUR.i < n - 1 ? "Lanjut ›" : "Selesai ✓"}</button></div>`;
  TUR.el.balon.classList.remove("muncul"); void TUR.el.balon.offsetWidth; TUR.el.balon.classList.add("muncul");
  clearTimeout(TUR._t); TUR._t = setTimeout(_turPosisi, 350); _turPosisi();
}
function _turPosisi() {
  if (!TUR.aktif) return;
  const l = TUR.langkah[TUR.i], el = _turCari(l.sel); if (!el) return;
  const r = el.getBoundingClientRect(), pad = 8, vw = window.innerWidth, vh = window.innerHeight;
  const top = Math.max(4, r.top - pad), left = Math.max(4, r.left - pad), w = Math.min(vw - 8, r.width + pad * 2), h = Math.min(vh - 8, r.height + pad * 2);
  Object.assign(TUR.el.sorot.style, { top: top + "px", left: left + "px", width: w + "px", height: h + "px" });
  const b = TUR.el.balon, bw = Math.min(340, vw - 24), bh = b.offsetHeight || 180;
  const bawah = top + h + bh + 70 < vh || top < vh / 2;
  const bx = Math.min(Math.max(12, left + w / 2 - bw / 2), vw - bw - 12);
  const by = bawah ? Math.min(top + h + 58, vh - bh - 12) : Math.max(12, top - bh - 58);
  Object.assign(b.style, { width: bw + "px", left: bx + "px", top: by + "px" });
  const p = TUR.el.panah, px = Math.min(Math.max(16, left + w / 2), vw - 16);
  p.textContent = bawah ? "👆" : "👇";
  p.classList.toggle("atas", bawah);
  Object.assign(p.style, { left: px + "px", top: (bawah ? top + h + 6 : top - 50) + "px" });
}
window.addEventListener("resize", () => TUR.aktif && _turPosisi());
window.addEventListener("scroll", () => TUR.aktif && _turPosisi(), true);
document.addEventListener("keydown", (e) => { if (!TUR.aktif) return; if (e.key === "Escape") turTutup(); else if (e.key === "ArrowRight" || e.key === "Enter") { e.preventDefault(); turLanjut(); } else if (e.key === "ArrowLeft") turKembali(); });

// Otomatis: saat halaman dibuka, tunggu isinya muncul lalu jalankan tur yang belum pernah dilihat
function _turOtomatis(halaman) {
  const t = TUR_DAFTAR[halaman]; if (!t || _turSudah(t) || TUR.aktif) return;
  let coba = 0;
  const cek = () => {
    if (typeof STATE !== "undefined" && STATE.currentPage !== halaman) return;
    if (document.querySelector(".modal-overlay.show, .modal.show")) { if (coba++ < 40) setTimeout(cek, 500); return; }
    const ada = t.langkah.filter((l) => _turCari(l.sel)).length;
    if (ada >= Math.min(2, t.langkah.length)) turMulai(halaman); else if (coba++ < 24) setTimeout(cek, 500);
  };
  setTimeout(cek, 1200);
}
(function pasangTur() {
  const pasang = () => {
    if (typeof window.showPage !== "function" || window.showPage._tur) return;
    const asli = window.showPage;
    window.showPage = function (...a) { const r = asli.apply(this, a); try { turTutup(true); _turOtomatis(a[0]); } catch (e) {} return r; };
    window.showPage._tur = true;
  };
  if (document.readyState === "complete") setTimeout(pasang, 0); else window.addEventListener("load", () => setTimeout(pasang, 0));
})();

// ── Kartu "🆕 Fitur baru" di Dasbor: tiap fitur punya tombol "Lihat caranya" (buka halaman + tur) ──
const TUR_BARU = { versi: "2026-11-13", fitur: [
  { ikon: "🗓️", judul: "Jadwal Ujian: ketuk mapel untuk kumpulkan soal", teks: "Absen mengawas kini dihitung ke insentif bulanan.", halaman: ["jadwal-ujian", "page-jadwal-ujian", "menuJadwalUjian"] },
  { ikon: "🧪", judul: "Ujian Online: uji coba soal, remedial & kunci jawaban", teks: "Coba soal tanpa menyimpan nilai; santri bisa remedial, nilai terbaik dipakai.", halaman: ["ujian", "page-ujian", "menuUjian"] },
  { ikon: "🤖", judul: "Input Nilai: pola otomatis & mapel gabungan dipisah", teks: "Geografi/Sosiologi/Ekonomi diisi terpisah, rapor = rata-ratanya.", halaman: ["input-nilai", "page-input-nilai", "menuInputNilai"] },
] };
function turBuka(i) {
  const f = TUR_BARU.fitur[i]; if (!f) return;
  const t = TUR_DAFTAR[f.halaman[0]]; if (t) try { localStorage.removeItem(_turKunci(t)); } catch (e) {}
  showPage(...f.halaman);
}
function turTutupBaru() { try { localStorage.setItem("tur:baru", TUR_BARU.versi); } catch (e) {} document.getElementById("tur-baru")?.remove(); }
function _turKartuBaru() {
  try { if (localStorage.getItem("tur:baru") === TUR_BARU.versi) return; } catch (e) { return; }
  const page = document.getElementById("page-dashboard"); if (!page || document.getElementById("tur-baru")) return;
  const d = document.createElement("div"); d.id = "tur-baru"; d.className = "card tur-baru";
  d.innerHTML = `<div class="tur-baru-h"><span class="tur-baru-ikon">🆕</span><div><b>Fitur baru di aplikasi</b><small>Ketuk "Lihat caranya" — aplikasi akan menunjukkan langkahnya satu per satu.</small></div><button class="tur-baru-x" onclick="turTutupBaru()" title="Sembunyikan">✕</button></div>
    <div class="tur-baru-daftar">${TUR_BARU.fitur.map((f, i) => `<div class="tur-baru-item"><span>${f.ikon}</span><div><b>${f.judul}</b><small>${f.teks}</small></div><button class="btn btn-sm btn-accent" onclick="turBuka(${i})">Lihat caranya ›</button></div>`).join("")}</div>`;
  const hero = page.querySelector(".dash-hero");
  hero ? hero.insertAdjacentElement("afterend", d) : page.prepend(d);
}
(function pasangKartuBaru() {
  const cek = () => { if (typeof STATE !== "undefined" && STATE.currentPage === "dashboard") _turKartuBaru(); };
  window.addEventListener("load", () => { setTimeout(cek, 2500); setTimeout(cek, 6000); });
  document.addEventListener("click", (e) => { if (e.target.closest && e.target.closest("[data-page='dashboard'],[onclick*=\"'dashboard'\"],[onclick*='\"dashboard\"']")) setTimeout(cek, 900); }, true);
  const t = setInterval(() => { if (typeof window.showPage === "function" && window.showPage._tur && !window.showPage._baru) {
    const asli = window.showPage; window.showPage = function (...a) { const r = asli.apply(this, a); if (a[0] === "dashboard") setTimeout(cek, 900); return r; }; window.showPage._tur = true; window.showPage._baru = true; clearInterval(t); } }, 500);
})();

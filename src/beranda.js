// ============================================================
//  BERANDA — tampilan kartu sambutan tetap seperti semula, dengan perapian:
//  • hiasan gambar di pojok kanan atas dihapus (terlihat buram/tidak jelas);
//  • tulisan "Jadwal Mengajar Saya Hari Ini · <hari>" di atas jam dihapus;
//  • tombol lonceng (Pengaturan Notifikasi) dipindah ke samping jam & diberi label,
//    sedangkan di samping "Kelas Berikutnya" kini ikon jam pelajaran (bukan tombol).
// ============================================================
function _brRapikan() {
  const hero = document.querySelector("#page-dashboard .dash-hero"); if (!hero || hero.dataset.brRapi) return;
  hero.dataset.brRapi = "1";
  hero.querySelector(".dash-hero-deco")?.remove();
  const jam = hero.querySelector(".dash-hero-clockwrap");
  const label = jam && [...jam.children].find((x) => x.querySelector && x.querySelector("#dash-nama-hari-ini"));
  if (label) { label.style.display = "none"; }
  const lonceng = qs("dash-notif-btn");
  if (jam && lonceng) {
    const baris = document.createElement("div"); baris.className = "br-jam-baris";
    const jl = qs("dash-jam-live"); if (jl) baris.appendChild(jl);
    lonceng.className = "br-notif"; lonceng.removeAttribute("style"); lonceng.title = "Pengaturan Notifikasi";
    const dot = lonceng.querySelector("#dash-notif-dot");
    lonceng.innerHTML = `<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/></svg>`;
    if (dot) lonceng.appendChild(dot);
    baris.appendChild(lonceng); jam.appendChild(baris);
    const pill = hero.querySelector(".dash-hero-pill");
    if (pill) { const ik = document.createElement("span"); ik.className = "br-ikon-kelas"; ik.setAttribute("aria-hidden", "true");
      ik.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>`;
      pill.insertBefore(ik, pill.firstChild); }
  }
}
(function () {
  if (typeof renderDashboard !== "function") return;
  const asli = renderDashboard;
  window.renderDashboard = function () { try { _brRapikan(); } catch (e) { console.warn("Beranda:", e); } return asli.apply(this, arguments); };
  if (document.readyState !== "loading") _brRapikan(); else document.addEventListener("DOMContentLoaded", _brRapikan);
})();

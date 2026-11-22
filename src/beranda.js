// ============================================================
//  BERANDA — sambutan bergaya: foto lembaga (per ruang, diganti admin), salam sesuai waktu,
//  nama lembaga & jenjang, dan mutiara hikmah harian (ayat/hadits pendek, bergilir tiap hari).
//  Foto disimpan di kuliah_pengaturan kunci "beranda" per ruang → { foto, oleh, t }.
// ============================================================
const BR_HIKMAH = [
  ["Sebaik-baik kalian adalah orang yang mempelajari Al-Qur'an dan mengajarkannya.", "HR. Bukhari"],
  ["Barangsiapa menempuh jalan untuk mencari ilmu, Allah mudahkan baginya jalan menuju surga.", "HR. Muslim"],
  ["Allah akan mengangkat orang-orang yang beriman di antaramu dan orang-orang yang diberi ilmu beberapa derajat.", "QS. Al-Mujadilah: 11"],
  ["Bacalah dengan (menyebut) nama Tuhanmu yang menciptakan.", "QS. Al-'Alaq: 1"],
  ["Dan katakanlah: Ya Tuhanku, tambahkanlah kepadaku ilmu.", "QS. Thaha: 114"],
  ["Apabila manusia meninggal, terputuslah amalnya kecuali tiga: sedekah jariyah, ilmu yang bermanfaat, dan anak saleh yang mendoakannya.", "HR. Muslim"],
  ["Sesungguhnya bersama kesulitan ada kemudahan.", "QS. Al-Insyirah: 6"],
  ["Barangsiapa menunjukkan kepada kebaikan, maka ia mendapat pahala seperti pahala orang yang mengerjakannya.", "HR. Muslim"],
  ["Sesungguhnya Allah menyukai apabila salah seorang di antara kalian mengerjakan suatu pekerjaan, ia mengerjakannya dengan itqan (sungguh-sungguh).", "HR. Thabrani"],
  ["Maka apabila engkau telah selesai (dari suatu urusan), tetaplah bekerja keras (untuk urusan yang lain).", "QS. Al-Insyirah: 7"],
];
const BR = { data: null };

function _brSalamWaktu() {
  const j = Number(new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Makassar", hour: "2-digit", hour12: false }).format(typeof realNow === "function" ? realNow() : new Date()));
  if (j < 4) return "Selamat malam"; if (j < 11) return "Selamat pagi"; if (j < 15) return "Selamat siang"; if (j < 18) return "Selamat sore"; return "Selamat malam";
}
function _brHikmahHariIni() {
  const d = new Date(), n = Math.floor((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000));
  return BR_HIKMAH[n % BR_HIKMAH.length];
}

async function _brHias() {
  const hero = document.querySelector("#page-dashboard .dash-hero"); if (!hero) return;
  if (!BR.data) BR.data = await (typeof _kvAmbil === "function" ? _kvAmbil("beranda", {}) : Promise.resolve({})).catch(() => ({}));
  const foto = BR.data && BR.data.foto;
  hero.classList.add("br-hero"); hero.classList.toggle("br-ada-foto", !!foto);
  hero.style.setProperty("--br-foto", foto ? `url("${String(foto).replace(/"/g, "%22")}")` : "none");
  // baris lembaga (logo + nama + jenjang) di paling atas
  if (!hero.querySelector(".br-lembaga")) {
    const p = STATE.pengaturan || {}, logo = p.logo_kanan_url || p.logo_kiri_url || (typeof urlLogoSekolah === "function" ? urlLogoSekolah() : "");
    const ruang = typeof rgNamaPendek === "function" ? rgNamaPendek(STATE.ruang) : "";
    const ket = (typeof RG_INFO !== "undefined" && RG_INFO[STATE.ruang] && RG_INFO[STATE.ruang].setara) || "";
    const el = document.createElement("div"); el.className = "br-lembaga";
    el.innerHTML = `${logo ? `<img src="${escapeHtml(logo)}" alt="">` : ""}<div><b>PKBM Al-Umm Barabai</b><span>${escapeHtml([ruang, ket].filter(Boolean).join(" · "))}</span></div>
      ${typeof isAdmin === "function" && isAdmin() ? `<label class="br-ganti" title="Ganti foto lembaga di Beranda"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg><span>Foto Lembaga</span><input type="file" accept="image/*" hidden onchange="brGantiFoto(this)"></label>` : ""}`;
    hero.insertBefore(el, hero.querySelector(".dash-hero-top"));
  }
  // salam
  const nama = typeof _namaSingkatTopbar === "function" ? _namaSingkatTopbar(STATE.guruNama || "") : (STATE.guruNama || "");
  const g = qs("dash-greeting");
  if (g && (!STATE.lang || STATE.lang === "id")) g.innerHTML = `<small class="br-salam">Assalamu'alaikum · ${_brSalamWaktu()}</small>${escapeHtml(nama || "Bapak/Ibu Guru")}`;
  // mutiara hikmah
  let h = hero.querySelector(".br-hikmah");
  if (!h) { h = document.createElement("div"); h.className = "br-hikmah"; hero.appendChild(h); }
  const [teks, sumber] = _brHikmahHariIni();
  h.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6.5C10 5 7 4.5 3 5v13c4-.5 7 0 9 1.5 2-1.5 5-2 9-1.5V5c-4-.5-7 0-9 1.5z"/><path d="M12 6.5V19"/></svg><p>“${escapeHtml(teks)}” <cite>— ${escapeHtml(sumber)}</cite></p>`;
}

async function brGantiFoto(input) {
  const f = input.files && input.files[0]; input.value = ""; if (!f) return;
  if (!(typeof isAdmin === "function" && isAdmin())) { toast("Hanya admin yang bisa mengganti foto lembaga", "err"); return; }
  try {
    if (typeof setGlobalLoading === "function") setGlobalLoading(true, "Mengunggah foto lembaga…");
    const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = URL.createObjectURL(f); });
    const sk = Math.min(1, 1600 / Math.max(img.width, img.height)), c = document.createElement("canvas");
    c.width = Math.round(img.width * sk); c.height = Math.round(img.height * sk); c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
    const blob = await new Promise((r) => c.toBlob(r, "image/jpeg", 0.8));
    const url = await apiUploadFoto(new File([blob], "beranda.jpg", { type: "image/jpeg" }), "lembaga/beranda");
    BR.data = await _kvGabung("beranda", { foto: url, oleh: STATE.guruNama || "", t: Date.now() });
    toast("Foto lembaga di Beranda diperbarui ✓", "ok");
    _brHias();
  } catch (e) { toast("Gagal mengunggah foto: " + (e.message || e), "err"); }
  finally { if (typeof setGlobalLoading === "function") setGlobalLoading(false); }
}

(function () {
  if (typeof renderDashboard !== "function") return;
  const asli = renderDashboard;
  window.renderDashboard = async function () {
    const r = asli.apply(this, arguments);
    try { await _brHias(); } catch (e) { console.warn("Beranda:", e); }
    return r;
  };
})();

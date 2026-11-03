// ============================================================
//  STUDIO DESAIN KALDIK (Tahap 1) — tema siap pakai, font, warna & gaya, PER SEMESTER.
//  Disimpan di kuliah_pengaturan (kunci "kaldik:desain:ganjil" / "kaldik:desain:genap").
//  Diterapkan lewat CSS variable pada #page-kaldik → kalender di halaman sekaligus jadi
//  pratinjau langsung (panel studio menempel di kanan, halaman tetap terlihat).
// ============================================================
const KD_FONT = {
  "Plus Jakarta Sans": "'Plus Jakarta Sans',sans-serif", Poppins: "'Poppins',sans-serif", Montserrat: "'Montserrat',sans-serif",
  Oswald: "'Oswald',sans-serif", "Bebas Neue": "'Bebas Neue',sans-serif", Anton: "'Anton',Impact,sans-serif",
  "Playfair Display": "'Playfair Display',serif", Georgia: "Georgia,'Times New Roman',serif", Amiri: "'Amiri',serif",
  "Great Vibes": "'Great Vibes',cursive", "Dancing Script": "'Dancing Script',cursive", Pacifico: "'Pacifico',cursive",
  Satisfy: "'Satisfy',cursive", Lobster: "'Lobster',cursive",
};
const KD_FONT_URL = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&family=Montserrat:wght@500;700;800&family=Oswald:wght@500;700&family=Bebas+Neue&family=Anton&family=Great+Vibes&family=Dancing+Script:wght@600;700&family=Pacifico&family=Satisfy&family=Lobster&display=swap";
// Bawaan per semester (Ganjil = tampilan asli aplikasi; Genap = krem klasik)
const KD_BAWAAN = {
  ganjil: { tema: "asli", judulBulan: "ikon", sel: "polos", legenda: "titik", judulSmt: false },
  genap: { tema: "krem", judulBulan: "kapital", sel: "gradasi", legenda: "kotak", judulSmt: true },
};
const KD_TEMA = {
  asli: { nama: "Bawaan Aplikasi", ikon: "🌙", d: { judulBulan: "ikon", sel: "polos", legenda: "titik", judulSmt: false } },
  krem: { nama: "Krem Klasik", ikon: "📜", d: { judulBulan: "kapital", sel: "gradasi", legenda: "kotak", judulSmt: true, halBg: "#F6F1E6", kartuBg: "#FBF7EE", kartuBorder: "#E6D9C3", radius: 6, bulanWarna: "#2b2118", hariBg: "#E6D9C3", hariWarna: "#3b2f22", fontBulan: "Plus Jakarta Sans", fontAngka: "Georgia", fontLegenda: "Georgia", fontBesar: "Anton", fontSkrip: "Great Vibes", warnaBesar: "#4A3B2A", warnaSkrip: "#D4A24C", pitaBg: "#8B6B3E" } },
  hitam: { nama: "Modern Hitam", ikon: "🖤", d: { judulBulan: "pita", sel: "gradasi", legenda: "kotak", judulSmt: true, halBg: "#F3F4F6", kartuBg: "#FFFFFF", kartuBorder: "#E5E7EB", radius: 16, bulanWarna: "#111111", hariBg: "#ECEEF2", hariWarna: "#1F2937", fontBulan: "Poppins", fontAngka: "Poppins", fontLegenda: "Oswald", fontBesar: "Anton", fontSkrip: "Great Vibes", warnaBesar: "#2B2B2B", warnaSkrip: "#A3E635", pitaBg: "#111111" } },
  hijau: { nama: "Hijau Segar", ikon: "🌿", d: { judulBulan: "pita", sel: "gradasi", legenda: "kotak", judulSmt: true, halBg: "#DCFCE7", kartuBg: "#F0FDF4", kartuBorder: "#86EFAC", radius: 14, bulanWarna: "#166534", hariBg: "#4ADE80", hariWarna: "#14532D", fontBulan: "Bebas Neue", fontAngka: "Poppins", fontLegenda: "Poppins", fontBesar: "Bebas Neue", fontSkrip: "Pacifico", warnaBesar: "#14532D", warnaSkrip: "#65A30D", pitaBg: "#15803D" } },
  biru: { nama: "Biru Elegan", ikon: "💙", d: { judulBulan: "kapital", sel: "gradasi", legenda: "kotak", judulSmt: true, halBg: "#EFF6FF", kartuBg: "#FFFFFF", kartuBorder: "#BFDBFE", radius: 12, bulanWarna: "#1E3A8A", hariBg: "#1E3A8A", hariWarna: "#FFFFFF", fontBulan: "Montserrat", fontAngka: "Montserrat", fontLegenda: "Montserrat", fontBesar: "Playfair Display", fontSkrip: "Dancing Script", warnaBesar: "#1E3A8A", warnaSkrip: "#60A5FA", pitaBg: "#1E40AF" } },
  emas: { nama: "Emas Islami", ikon: "🕌", d: { judulBulan: "kapital", sel: "gradasi", legenda: "kotak", judulSmt: true, halBg: "#0F3D2E", kartuBg: "#FFFBEB", kartuBorder: "#D4AF37", radius: 10, bulanWarna: "#7C5A10", hariBg: "#0F3D2E", hariWarna: "#FDE68A", fontBulan: "Playfair Display", fontAngka: "Georgia", fontLegenda: "Georgia", fontBesar: "Playfair Display", fontSkrip: "Great Vibes", warnaBesar: "#0F3D2E", warnaSkrip: "#D4AF37", pitaBg: "#B8860B" } },
  pastel: { nama: "Pastel Lembut", ikon: "🌸", d: { judulBulan: "kapital", sel: "gradasi", legenda: "kotak", judulSmt: true, halBg: "#FDF2F8", kartuBg: "#FFFFFF", kartuBorder: "#FBCFE8", radius: 18, bulanWarna: "#9D174D", hariBg: "#FCE7F3", hariWarna: "#831843", fontBulan: "Poppins", fontAngka: "Poppins", fontLegenda: "Poppins", fontBesar: "Lobster", fontSkrip: "Satisfy", warnaBesar: "#9D174D", warnaSkrip: "#A78BFA", pitaBg: "#DB2777" } },
  ramadhan: { nama: "Ramadhan", ikon: "🌙", d: { judulBulan: "pita", sel: "gradasi", legenda: "kotak", judulSmt: true, halBg: "#1E1B4B", kartuBg: "#FFFFFF", kartuBorder: "#C4B5FD", radius: 14, bulanWarna: "#312E81", hariBg: "#4C1D95", hariWarna: "#FDE68A", fontBulan: "Oswald", fontAngka: "Poppins", fontLegenda: "Poppins", fontBesar: "Anton", fontSkrip: "Great Vibes", warnaBesar: "#312E81", warnaSkrip: "#F59E0B", pitaBg: "#6D28D9" } },
};
KD_BAWAAN.genap = Object.assign({ tema: "krem" }, KD_TEMA.krem.d);
const KD_DESAIN = { ganjil: null, genap: null };
let _KD_DRAFT = null, _KD_SIMPANAN = null;

function _kdSemester() { return typeof KALDIK_SEMESTER !== "undefined" ? KALDIK_SEMESTER : "ganjil"; }
function _kdAktif() { return _KD_DRAFT || KD_DESAIN[_kdSemester()] || KD_BAWAAN[_kdSemester()]; }
function _kdOpsi(k) { const d = _kdAktif(); return d[k] != null ? d[k] : KD_BAWAAN[_kdSemester()][k]; }
async function _kdMuat(smt) {
  if (KD_DESAIN[smt]) return KD_DESAIN[smt];
  try { const r = await supa.from("kuliah_pengaturan").select("nilai").eq("kunci", "kaldik:desain:" + smt).maybeSingle(); KD_DESAIN[smt] = Object.assign({}, KD_BAWAAN[smt], (r.data && r.data.nilai) || {}); }
  catch (e) { KD_DESAIN[smt] = Object.assign({}, KD_BAWAAN[smt]); }
  return KD_DESAIN[smt];
}
function _kdMuatFont() {
  if (document.getElementById("kd-font")) return;
  const l = document.createElement("link"); l.id = "kd-font"; l.rel = "stylesheet"; l.href = KD_FONT_URL; document.head.appendChild(l);
}
// Pasang variabel CSS desain ke halaman Kaldik (dipanggil setiap render & setiap perubahan di studio)
function _kdTerapkan() {
  const pg = document.getElementById("page-kaldik"); if (!pg) return;
  const d = _kdAktif(), set = (k, v) => v ? pg.style.setProperty(k, v) : pg.style.removeProperty(k);
  const custom = d.tema && d.tema !== "asli";
  pg.classList.toggle("kd-custom", !!custom);
  if (custom) _kdMuatFont();
  set("--kd-hal-bg", custom && d.halBg); set("--kd-kartu-bg", custom && d.kartuBg); set("--kd-kartu-border", custom && d.kartuBorder);
  set("--kd-radius", custom && d.radius != null ? d.radius + "px" : "");
  set("--kd-bulan-warna", custom && d.bulanWarna); set("--kd-hari-bg", custom && d.hariBg); set("--kd-hari-warna", custom && d.hariWarna);
  set("--kd-font-bulan", custom && KD_FONT[d.fontBulan]); set("--kd-font-angka", custom && KD_FONT[d.fontAngka]); set("--kd-font-legenda", custom && KD_FONT[d.fontLegenda]);
  set("--kd-font-besar", custom && KD_FONT[d.fontBesar]); set("--kd-font-skrip", custom && KD_FONT[d.fontSkrip]);
  set("--kd-warna-besar", custom && d.warnaBesar); set("--kd-warna-skrip", custom && d.warnaSkrip); set("--kd-pita-bg", custom && d.pitaBg);
  pg.dataset.kdBulan = _kdOpsi("judulBulan");
}

// ── Panel Studio ──
async function bukaStudioKaldik() {
  if (!isAdmin()) { toast(t("hanyaAdminHapus"), "err"); return; }
  const smt = _kdSemester();
  await _kdMuat(smt); _kdMuatFont();
  _KD_SIMPANAN = JSON.parse(JSON.stringify(KD_DESAIN[smt]));
  _KD_DRAFT = JSON.parse(JSON.stringify(KD_DESAIN[smt]));
  let p = document.getElementById("kd-studio");
  if (!p) { p = document.createElement("aside"); p.id = "kd-studio"; document.body.appendChild(p); }
  _kdGambarPanel();
}
function _kdGambarPanel() {
  const p = document.getElementById("kd-studio"); if (!p) return;
  const d = _KD_DRAFT, smt = _kdSemester();
  const pilihFont = (k, label, kelompok) => `<label class="kd-f"><span>${label}</span><select data-k="${k}">${Object.keys(KD_FONT).filter((f) => !kelompok || kelompok.includes(f)).map((f) => `<option value="${f}" style="font-family:${KD_FONT[f]}"${d[k] === f ? " selected" : ""}>${f}</option>`).join("")}</select></label>`;
  const warna = (k, label) => `<label class="kd-w"><input type="color" data-k="${k}" value="${d[k] || "#ffffff"}"/><span>${label}</span></label>`;
  const pilih = (k, label, opsi) => `<label class="kd-f"><span>${label}</span><select data-k="${k}">${opsi.map(([v, l]) => `<option value="${v}"${String(d[k]) === String(v) ? " selected" : ""}>${l}</option>`).join("")}</select></label>`;
  const skrip = ["Great Vibes", "Dancing Script", "Pacifico", "Satisfy", "Lobster"];
  const asli = !d.tema || d.tema === "asli";
  p.innerHTML = `<div class="kd-h"><b>🖌️ Studio Desain · Semester ${smt === "genap" ? "Genap" : "Ganjil"}</b><button type="button" onclick="tutupStudioKaldik(false)" title="Tutup tanpa menyimpan">✕</button></div>
    <div class="kd-isi">
      <div class="kd-sec">🎨 Tema siap pakai</div>
      <div class="kd-tema">${Object.entries(KD_TEMA).map(([k, tm]) => `<button type="button" class="${d.tema === k ? "on" : ""}" onclick="_kdPilihTema('${k}')" style="--a:${tm.d.halBg || "#e5e7eb"};--b:${tm.d.hariBg || "#2563eb"}"><i></i><span>${tm.ikon} ${tm.nama}</span></button>`).join("")}</div>
      ${asli ? `<p class="kd-ket">Tema "Bawaan Aplikasi" memakai tampilan asli. Pilih tema lain untuk mengatur font & warna.</p>` : `
      <div class="kd-sec">🔤 Huruf</div>
      ${pilihFont("fontBesar", "Judul besar \"Semester\"")}${pilihFont("fontSkrip", "Tulisan sambung (Ganjil/Genap)", skrip)}${pilihFont("fontBulan", "Nama bulan")}${pilihFont("fontAngka", "Angka tanggal")}${pilihFont("fontLegenda", "Keterangan kegiatan")}
      <div class="kd-sec">🌈 Warna</div>
      <div class="kd-wgrid">${warna("halBg", "Latar halaman")}${warna("kartuBg", "Kartu bulan")}${warna("kartuBorder", "Bingkai kartu")}${warna("bulanWarna", "Judul bulan")}${warna("hariBg", "Pita nama hari")}${warna("hariWarna", "Teks nama hari")}${warna("warnaBesar", "Tulisan \"Semester\"")}${warna("warnaSkrip", "Tulisan sambung")}${warna("pitaBg", "Pita periode")}</div>
      <div class="kd-sec">🧱 Gaya</div>
      ${pilih("judulBulan", "Judul bulan", [["ikon", "Ikon + nama (bawaan)"], ["pita", "Pita gelap, nama miring"], ["kapital", "KAPITAL di tengah"]])}
      ${pilih("sel", "Warna tanggal kegiatan", [["gradasi", "Gradasi lembut"], ["polos", "Polos"]])}
      ${pilih("legenda", "Keterangan", [["kotak", "Kotak berisi tanggal"], ["titik", "Titik warna"]])}
      <label class="kd-f"><span>Sudut kartu: <b>${d.radius ?? 12}px</b></span><input type="range" min="0" max="26" data-k="radius" value="${d.radius ?? 12}"/></label>
      <label class="kd-cek"><input type="checkbox" data-k="judulSmt"${d.judulSmt ? " checked" : ""}/> Tampilkan judul besar "Semester ${smt === "genap" ? "Genap" : "Ganjil"}" di kop</label>`}
    </div>
    <div class="kd-aksi"><button type="button" class="btn btn-ghost" onclick="_kdReset()">↺ Bawaan</button><button type="button" class="btn btn-outline" onclick="tutupStudioKaldik(false)">Batal</button><button type="button" class="btn btn-accent" onclick="simpanStudioKaldik()">💾 Simpan</button></div>`;
  p.querySelectorAll("[data-k]").forEach((el) => {
    const ev = el.type === "range" || el.type === "color" ? "input" : "change";
    el.addEventListener(ev, () => {
      const k = el.dataset.k;
      _KD_DRAFT[k] = el.type === "checkbox" ? el.checked : el.type === "range" ? +el.value : el.value;
      if (el.type === "range") { const b = el.previousElementSibling?.querySelector("b"); if (b) b.textContent = el.value + "px"; }
      _kdPratinjau(k);
    });
  });
}
// warna & font cukup ganti variabel; gaya struktur (judul bulan, sel, keterangan, judul semester) perlu render ulang
let _kdTRender = null;
function _kdPratinjau(k) {
  _kdTerapkan();
  if (!k || ["judulBulan", "sel", "legenda", "judulSmt"].includes(k)) { clearTimeout(_kdTRender); _kdTRender = setTimeout(() => renderKaldik(), 120); }
}
function _kdPilihTema(k) {
  const lama = _KD_DRAFT || {};
  _KD_DRAFT = Object.assign({}, KD_BAWAAN[_kdSemester()], KD_TEMA[k].d, { tema: k });
  if (k === "asli") _KD_DRAFT = Object.assign({}, KD_BAWAAN.ganjil, { tema: "asli" });
  _kdGambarPanel(); _kdPratinjau();
}
function _kdReset() { _KD_DRAFT = JSON.parse(JSON.stringify(KD_BAWAAN[_kdSemester()])); _kdGambarPanel(); _kdPratinjau(); }
function tutupStudioKaldik(simpan) {
  if (!simpan && _KD_SIMPANAN) KD_DESAIN[_kdSemester()] = _KD_SIMPANAN;
  _KD_DRAFT = null; _KD_SIMPANAN = null;
  document.getElementById("kd-studio")?.remove();
  _kdTerapkan(); renderKaldik();
}
async function simpanStudioKaldik() {
  const smt = _kdSemester(), nilai = JSON.parse(JSON.stringify(_KD_DRAFT));
  try {
    const { error } = await supa.from("kuliah_pengaturan").upsert({ kunci: "kaldik:desain:" + smt, nilai });
    if (error) throw error;
    KD_DESAIN[smt] = nilai; _KD_SIMPANAN = null;
    toast(`Desain Semester ${smt === "genap" ? "Genap" : "Ganjil"} tersimpan ✓`, "ok");
    tutupStudioKaldik(true);
  } catch (e) { toast("Gagal menyimpan desain: " + (e.message || e), "err"); }
}

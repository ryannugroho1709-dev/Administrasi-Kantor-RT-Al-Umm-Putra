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
let _KD_DRAFT = null, _KD_SIMPANAN = null, _KD_RIWAYAT = [], _KD_MAJU = [], _KD_TEMPLATE = [], _KD_VERSI = [], _KD_BINGKAI = "", _KD_PIPET = [];
const KD_WARNA_JENIS = { libur: "#EF4444", ujian: "#7C3AED", semester: "#F59E0B", agenda: "#10B981" };

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
  // Tahap 2: ornamen sudut, bentuk sel, jumlah kolom, posisi keterangan, filter foto kop
  set("--kd-ornamen", custom && d.ornamen && d.ornamen !== "none" ? JSON.stringify(d.ornamen) : "");
  set("--kd-sel-radius", custom && d.bentukSel ? ({ kotak: "2px", bulat: "8px", lingkaran: "50%" }[d.bentukSel]) : "");
  set("--kd-kolom", custom && d.kolom ? "repeat(" + d.kolom + ",1fr)" : "");
  pg.dataset.kdLegenda = _kdOpsi("posLegenda") || "bulan";
  const hd = document.getElementById("kaldik-header");
  if (hd) {
    const f = custom ? (d.filterFoto || "tanpa") : "tanpa";
    const mode = { tanpa: "", gelap: "multiply", terang: "screen", sepia: "multiply", hitamputih: "luminosity", duotone: "multiply" }[f] || "";
    const warna = { gelap: "#6b6b6b", terang: "#9a9a9a", sepia: "#e2c48f", hitamputih: "#808080", duotone: d.pitaBg || "#8B6B3E" }[f] || "";
    hd.style.backgroundBlendMode = mode && hd.style.backgroundImage ? "normal, " + mode : "";
    hd.style.backgroundColor = mode && hd.style.backgroundImage ? warna : "";
  }
}

// ── Panel Studio ──
async function bukaStudioKaldik() {
  if (!isAdmin()) { toast(t("hanyaAdminHapus"), "err"); return; }
  const smt = _kdSemester();
  await _kdMuat(smt); _kdMuatFont();
  _KD_SIMPANAN = JSON.parse(JSON.stringify(KD_DESAIN[smt]));
  _KD_DRAFT = JSON.parse(JSON.stringify(KD_DESAIN[smt]));
  _KD_RIWAYAT = []; _KD_MAJU = [];
  try { const r = await supa.from("kuliah_pengaturan").select("nilai").eq("kunci", "kaldik:template").maybeSingle(); _KD_TEMPLATE = (r.data && r.data.nilai) || []; } catch (e) { _KD_TEMPLATE = []; }
  let p = document.getElementById("kd-studio");
  if (!p) { p = document.createElement("aside"); p.id = "kd-studio"; document.body.appendChild(p); }
  document.body.classList.add("kd-studio-buka");
  try { const w = +localStorage.getItem("kdStudioW"); if (w >= 300) document.body.style.setProperty("--kd-studio-w", w + "px"); } catch (e) {}
  try { const r = await supa.from("kuliah_pengaturan").select("nilai").eq("kunci", "kaldik:versi:" + smt).maybeSingle(); _KD_VERSI = (r.data && r.data.nilai) || []; } catch (e) { _KD_VERSI = []; } // halaman menyempit di samping panel (seperti DevTools), tidak tertimpa
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
  p.innerHTML = `<div class="kd-geser" title="Tarik untuk mengubah lebar panel"></div><div class="kd-h"><b>🖌️ Studio Desain · ${smt === "genap" ? "Genap" : "Ganjil"}</b><span class="kd-ur"><button type="button" onclick="_kdPratinjauPenuh(true)" title="Pratinjau penuh (sembunyikan panel)">👁️</button><button type="button" onclick="_kdUrung()" title="Urungkan (Ctrl+Z)"${_KD_RIWAYAT.length ? "" : " disabled"}>↶</button><button type="button" onclick="_kdUlang()" title="Ulangi (Ctrl+Y)"${_KD_MAJU.length ? "" : " disabled"}>↷</button><button type="button" onclick="tutupStudioKaldik(false)" title="Tutup tanpa menyimpan">✕</button></span></div>
    <div class="kd-isi">
      <div class="kd-sec">🎨 Tema siap pakai</div>
      <div class="kd-tema">${Object.entries(KD_TEMA).map(([k, tm]) => `<button type="button" class="${d.tema === k ? "on" : ""}" onclick="_kdPilihTema('${k}')" style="--a:${tm.d.halBg || "#e5e7eb"};--b:${tm.d.hariBg || "#2563eb"}"><i></i><span>${tm.ikon} ${tm.nama}</span></button>`).join("")}</div>
      <div class="kd-sec">⭐ Template saya</div>
      <div class="kd-tpl">${_KD_TEMPLATE.length ? _KD_TEMPLATE.map((tp) => `<div class="kd-tpl-i"><button type="button" onclick="_kdPakaiTemplate('${tp.id}')" style="--a:${tp.d.halBg || "#e5e7eb"};--b:${tp.d.hariBg || "#2563eb"}"><i></i><span>${escapeHtml(tp.nama)}</span></button><button type="button" class="kd-tpl-x" title="Hapus template" onclick="_kdHapusTemplate('${tp.id}')">✕</button></div>`).join("") : `<p class="kd-ket">Belum ada. Simpan desain yang Anda suka supaya bisa dipakai lagi tahun depan.</p>`}</div>
      <div class="kd-baris"><button type="button" class="btn btn-ghost" onclick="_kdSimpanTemplate()">⭐ Simpan desain ini sebagai template</button><button type="button" class="btn btn-ghost" onclick="_kdSalinSemester()">📋 Salin dari Semester ${smt === "genap" ? "Ganjil" : "Genap"}</button></div>
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
      <label class="kd-cek"><input type="checkbox" data-k="judulSmt"${d.judulSmt ? " checked" : ""}/> Tampilkan judul besar "Semester ${smt === "genap" ? "Genap" : "Ganjil"}" di kop</label>
      <div class="kd-sec">✨ Hiasan & tata letak</div>
      ${pilih("ornamen", "Ornamen sudut kartu", [["none", "Tanpa ornamen"], ["✦", "✦ Bintang"], ["❀", "❀ Bunga"], ["۞", "۞ Bintang Islami"], ["✿", "✿ Bunga kecil"], ["☾", "☾ Bulan sabit"], ["❖", "❖ Wajik"]])}
      ${pilih("bentukSel", "Bentuk tanggal kegiatan", [["bulat", "Membulat"], ["kotak", "Kotak tegas"], ["lingkaran", "Lingkaran"]])}
      ${pilih("kolom", "Bulan per baris (layar lebar)", [["3", "3 bulan"], ["2", "2 bulan"], ["4", "4 bulan"]])}
      ${pilih("posLegenda", "Letak keterangan kegiatan", [["bulan", "Di bawah tiap bulan"], ["gabung", "Digabung di bawah kalender"]])}
      ${pilih("filterFoto", "Filter foto kop", [["tanpa", "Asli"], ["gelap", "Lebih gelap"], ["terang", "Lebih terang"], ["sepia", "Hangat (sepia)"], ["hitamputih", "Hitam-putih"], ["duotone", "Duotone warna pita"]])}
      <div class="kd-sec">✍️ Teks bebas</div>
      <label class="kd-f"><span>Motto / ayat / hadits (tampil di atas kalender)</span><textarea data-k="teksMotto" rows="2" placeholder="mis. وَقُلْ رَبِّ زِدْنِي عِلْمًا — Ya Rabb, tambahkanlah ilmu kepadaku">${escapeHtml(d.teksMotto || "")}</textarea></label>
      <label class="kd-cek"><input type="checkbox" data-k="ttdTampil"${d.ttdTampil ? " checked" : ""}/> Tampilkan tanda tangan di bawah kalender</label>
      ${d.ttdTampil ? `<label class="kd-f"><span>Tempat & tanggal</span><input data-k="ttdKota" value="${escapeHtml(d.ttdKota || "")}" placeholder="Barabai, 1 Januari 2027"/></label>
      <label class="kd-f"><span>Jabatan</span><input data-k="ttdJabatan" value="${escapeHtml(d.ttdJabatan || "Kepala Sekolah")}"/></label>
      <label class="kd-f"><span>Nama</span><input data-k="ttdNama" value="${escapeHtml(d.ttdNama || "")}" placeholder="Nama penandatangan"/></label>` : ""}`}
      ${asli ? "" : `
      <div class="kd-sec">🪄 Palet otomatis</div>
      <div class="kd-baris2"><input type="color" id="kd-utama" value="${d.hariBg || "#2563eb"}" title="Warna utama"/><button type="button" class="btn btn-ghost" onclick="_kdPaletDari('mono')">Monokrom</button><button type="button" class="btn btn-ghost" onclick="_kdPaletDari('kompl')">Komplementer</button><button type="button" class="btn btn-ghost" onclick="_kdPaletDari('analog')">Analog</button></div>
      <p class="kd-ket">Pilih satu warna utama, lalu satu klik — semua warna kartu, pita hari, judul & tulisan diselaraskan.</p>
      <button type="button" class="btn btn-ghost kd-lebar" onclick="_kdPipetFoto()">🎯 Ambil warna dari foto kop</button>
      <div id="kd-pipet">${_KD_PIPET.length ? `<div class="kd-pipet-w">${_KD_PIPET.map((c) => `<i style="background:${c}" title="${c}"></i>`).join("")}</div><button type="button" class="btn btn-accent kd-lebar" onclick="_kdTerapPipet()">Terapkan warna foto sebagai palet</button>` : ""}</div>
      <div class="kd-sec">🏷️ Warna per jenis kegiatan</div>
      <label class="kd-cek"><input type="checkbox" data-k="warnaJenisAktif"${d.warnaJenisAktif ? " checked" : ""}/> Warnai tanggal otomatis berdasarkan jenis kegiatan</label>
      ${d.warnaJenisAktif ? `<div class="kd-wgrid">${[["libur", "Libur"], ["ujian", "Ujian"], ["semester", "Semester"], ["agenda", "Agenda"]].map(([j, l]) => `<label class="kd-w"><input type="color" data-kj="${j}" value="${(d.warnaJenis || {})[j] || KD_WARNA_JENIS[j]}"/><span>${l}</span></label>`).join("")}</div>` : ""}
      <div class="kd-sec">📐 Bingkai pratinjau ekspor</div>
      <label class="kd-f"><span>Tampilkan batas kertas di halaman (tidak disimpan)</span><select id="kd-bingkai">${[["", "Tanpa bingkai"]].concat(Object.entries(KD_UKURAN).filter(([k]) => k !== "asli").map(([k, v]) => [k, v[0]])).map(([k, l]) => `<option value="${k}"${_KD_BINGKAI === k ? " selected" : ""}>${l}</option>`).join("")}</select></label>`}
      <div class="kd-sec">🔗 Bagikan desain</div>
      <div class="kd-baris2"><button type="button" class="btn btn-ghost" onclick="_kdSalinKode()">📋 Salin kode desain</button><button type="button" class="btn btn-ghost" onclick="_kdTempelKode()">📥 Tempel kode</button></div>
      <div class="kd-sec">🕘 Riwayat versi</div>
      <div class="kd-versi">${_KD_VERSI.length ? _KD_VERSI.map((v, i) => `<div><span>${new Date(v.t).toLocaleString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })} · ${escapeHtml((KD_TEMA[v.d.tema] || {}).nama || v.d.tema || "-")}</span><button type="button" class="btn btn-ghost" onclick="_kdPulihkanVersi(${i})">Pulihkan</button></div>`).join("") : `<p class="kd-ket">Setiap kali disimpan, versi sebelumnya tercatat di sini.</p>`}</div>
    </div>
    <div class="kd-aksi"><button type="button" class="btn btn-ghost" onclick="_kdReset()">↺ Bawaan</button><button type="button" class="btn btn-outline" onclick="tutupStudioKaldik(false)">Batal</button><button type="button" class="btn btn-accent" onclick="simpanStudioKaldik()">💾 Simpan</button></div>`;
  p.querySelectorAll("[data-kj]").forEach((el) => {
    el.addEventListener("focus", () => _kdCatatRiwayat());
    el.addEventListener("input", () => { _KD_DRAFT.warnaJenis = Object.assign({}, KD_WARNA_JENIS, _KD_DRAFT.warnaJenis || {}, { [el.dataset.kj]: el.value }); clearTimeout(_kdTRender); _kdTRender = setTimeout(() => renderKaldik(), 150); });
  });
  const bk = p.querySelector("#kd-bingkai"); if (bk) bk.onchange = () => { _KD_BINGKAI = bk.value; _kdGambarBingkai(); };
  _kdPasangGeser(p.querySelector(".kd-geser"));
  p.querySelectorAll("[data-k]").forEach((el) => {
    const ev = el.type === "range" || el.type === "color" || el.tagName === "TEXTAREA" || el.type === "text" || (el.tagName === "INPUT" && !el.type) ? "input" : "change";
    el.addEventListener("focus", () => _kdCatatRiwayat(), { once: false });
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
  if (k === "ttdTampil" || k === "warnaJenisAktif") _kdGambarPanel();
  if (k === "warnaJenisAktif") { clearTimeout(_kdTRender); _kdTRender = setTimeout(() => renderKaldik(), 120); return; }
  if (["posLegenda", "teksMotto", "ttdTampil", "ttdKota", "ttdJabatan", "ttdNama"].includes(k)) { _kdTambahan(document.getElementById("kaldik-grid")); return; }
  if (!k || ["judulBulan", "sel", "legenda", "judulSmt"].includes(k)) { clearTimeout(_kdTRender); _kdTRender = setTimeout(() => renderKaldik(), 120); }
}
function _kdPilihTema(k) {
  _kdCatatRiwayat();
  _KD_DRAFT = Object.assign({}, KD_BAWAAN[_kdSemester()], KD_TEMA[k].d, { tema: k });
  if (k === "asli") _KD_DRAFT = Object.assign({}, KD_BAWAAN.ganjil, { tema: "asli" });
  _kdGambarPanel(); _kdPratinjau();
}
function _kdReset() { _kdCatatRiwayat(); _KD_DRAFT = JSON.parse(JSON.stringify(KD_BAWAAN[_kdSemester()])); _kdGambarPanel(); _kdPratinjau(); }
function tutupStudioKaldik(simpan) {
  if (!simpan && _KD_SIMPANAN) KD_DESAIN[_kdSemester()] = _KD_SIMPANAN;
  _KD_DRAFT = null; _KD_SIMPANAN = null;
  document.getElementById("kd-studio")?.remove();
  document.body.classList.remove("kd-studio-buka", "kd-studio-sembunyi");
  document.getElementById("kd-balik")?.remove(); _KD_BINGKAI = ""; _KD_PIPET = []; document.querySelectorAll(".kd-bingkai").forEach((x) => x.remove());
  _kdTerapkan(); renderKaldik();
}
async function simpanStudioKaldik() {
  const smt = _kdSemester(), nilai = JSON.parse(JSON.stringify(_KD_DRAFT));
  try {
    const { error } = await supa.from("kuliah_pengaturan").upsert({ kunci: "kaldik:desain:" + smt, nilai });
    if (error) throw error;
    const lama = _KD_SIMPANAN;
    if (lama && lama.tema && JSON.stringify(lama) !== JSON.stringify(nilai)) {
      try { _KD_VERSI.unshift({ t: Date.now(), d: lama }); _KD_VERSI = _KD_VERSI.slice(0, 15); await supa.from("kuliah_pengaturan").upsert({ kunci: "kaldik:versi:" + smt, nilai: _KD_VERSI }); } catch (e) { console.warn("Gagal mencatat versi:", e); }
    }
    KD_DESAIN[smt] = nilai; _KD_SIMPANAN = null;
    toast(`Desain Semester ${smt === "genap" ? "Genap" : "Ganjil"} tersimpan ✓`, "ok");
    tutupStudioKaldik(true);
  } catch (e) { toast("Gagal menyimpan desain: " + (e.message || e), "err"); }
}

// ── Tahap 2: motto di atas kalender, keterangan gabungan, tanda tangan di bawah (ikut ekspor gambar) ──
function _kdTambahan(gridEl) {
  if (!gridEl) return;
  setTimeout(_kdGambarBingkai, 60);
  const d = _kdAktif(), custom = d.tema && d.tema !== "asli";
  gridEl.querySelectorAll(".kd-motto,.kd-legenda-gabung,.kd-ttd").forEach((x) => x.remove());
  if (!custom) return;
  if ((d.teksMotto || "").trim()) gridEl.insertAdjacentHTML("afterbegin", `<div class="kd-motto" dir="auto">${escapeHtml(d.teksMotto.trim()).replace(/\n/g, "<br/>")}</div>`);
  if (d.posLegenda === "gabung") {
    const blok = [...gridEl.querySelectorAll(".kaldik-bulan-card")].map((c) => { const lg = c.querySelector(".kaldik-legend"); return lg ? `<div class="kd-lg-bln"><b>${escapeHtml(c.querySelector(".kaldik-bulan-judul")?.textContent.replace(/\s+/g, " ").trim() || "")}</b>${lg.innerHTML}</div>` : ""; }).join("");
    if (blok) gridEl.insertAdjacentHTML("beforeend", `<div class="kd-legenda-gabung"><div class="kd-lg-judul">Keterangan Kegiatan</div><div class="kd-lg-isi">${blok}</div></div>`);
  }
  if (d.ttdTampil && (d.ttdNama || "").trim()) gridEl.insertAdjacentHTML("beforeend", `<div class="kd-ttd"><div>${escapeHtml(d.ttdKota || "")}</div><div>${escapeHtml(d.ttdJabatan || "Kepala Sekolah")}</div><div class="kd-ttd-ruang"></div><b>${escapeHtml(d.ttdNama)}</b></div>`);
}

// ── Tahap 3: urungkan/ulangi, template sendiri, salin antar semester ──
function _kdCatatRiwayat() {
  if (!_KD_DRAFT) return;
  const snap = JSON.stringify(_KD_DRAFT);
  if (_KD_RIWAYAT[_KD_RIWAYAT.length - 1] === snap) return;
  _KD_RIWAYAT.push(snap); if (_KD_RIWAYAT.length > 40) _KD_RIWAYAT.shift();
  _KD_MAJU = [];
  document.querySelectorAll("#kd-studio .kd-ur button").forEach((b, i) => { if (i === 0) b.disabled = false; if (i === 1) b.disabled = true; });
}
function _kdUrung() {
  if (!_KD_RIWAYAT.length) return;
  _KD_MAJU.push(JSON.stringify(_KD_DRAFT)); _KD_DRAFT = JSON.parse(_KD_RIWAYAT.pop());
  _kdGambarPanel(); _kdPratinjau();
}
function _kdUlang() {
  if (!_KD_MAJU.length) return;
  _KD_RIWAYAT.push(JSON.stringify(_KD_DRAFT)); _KD_DRAFT = JSON.parse(_KD_MAJU.pop());
  _kdGambarPanel(); _kdPratinjau();
}
document.addEventListener("keydown", (e) => {
  if (!document.getElementById("kd-studio") || !(e.ctrlKey || e.metaKey) || e.target.matches?.("input[type=text],textarea,input:not([type])")) return;
  const k = e.key.toLowerCase();
  if (k === "z" && !e.shiftKey) { e.preventDefault(); _kdUrung(); }
  else if (k === "y" || (k === "z" && e.shiftKey)) { e.preventDefault(); _kdUlang(); }
});
async function _kdSimpanDaftarTemplate() {
  const { error } = await supa.from("kuliah_pengaturan").upsert({ kunci: "kaldik:template", nilai: _KD_TEMPLATE });
  if (error) throw error;
}
async function _kdSimpanTemplate() {
  if (!_KD_DRAFT || !_KD_DRAFT.tema || _KD_DRAFT.tema === "asli") { toast("Pilih tema dulu (selain Bawaan Aplikasi) sebelum menyimpan template", "err"); return; }
  const nama = (prompt("Nama template:", "Desain " + (_kdSemester() === "genap" ? "Genap" : "Ganjil") + " " + new Date().getFullYear()) || "").trim();
  if (!nama) return;
  try {
    _KD_TEMPLATE.unshift({ id: Date.now().toString(36), nama, d: JSON.parse(JSON.stringify(_KD_DRAFT)), t: Date.now() });
    _KD_TEMPLATE = _KD_TEMPLATE.slice(0, 20);
    await _kdSimpanDaftarTemplate();
    toast("Template \"" + nama + "\" tersimpan ⭐", "ok"); _kdGambarPanel();
  } catch (e) { toast("Gagal menyimpan template: " + (e.message || e), "err"); }
}
function _kdPakaiTemplate(id) {
  const tp = _KD_TEMPLATE.find((x) => x.id === id); if (!tp) return;
  _kdCatatRiwayat(); _KD_DRAFT = JSON.parse(JSON.stringify(tp.d));
  _kdGambarPanel(); _kdPratinjau(); toast("Template \"" + tp.nama + "\" dipakai — tekan Simpan untuk menetapkan", "info");
}
async function _kdHapusTemplate(id) {
  if (!(await konfirmasiTema("Hapus template ini?", { ikon: "🗑️", judul: "Hapus template" }))) return;
  try { _KD_TEMPLATE = _KD_TEMPLATE.filter((x) => x.id !== id); await _kdSimpanDaftarTemplate(); _kdGambarPanel(); }
  catch (e) { toast("Gagal: " + (e.message || e), "err"); }
}
async function _kdSalinSemester() {
  const lain = _kdSemester() === "genap" ? "ganjil" : "genap";
  const d = await _kdMuat(lain);
  if (!d || !d.tema || d.tema === "asli") { toast("Semester " + (lain === "genap" ? "Genap" : "Ganjil") + " masih memakai tampilan bawaan", "info"); return; }
  _kdCatatRiwayat(); _KD_DRAFT = JSON.parse(JSON.stringify(d));
  _kdGambarPanel(); _kdPratinjau(); toast("Desain disalin — tekan Simpan untuk menetapkan", "info");
}
// ── Tahap 3: pilihan ukuran ekspor gambar ──
const KD_UKURAN = { asli: ["Asli (sesuai isi)", 0], a4: ["A4 tegak", 210 / 297], f4: ["F4 tegak", 215 / 330], a4l: ["A4 mendatar", 297 / 210], story: ["Story / status 9:16", 9 / 16], persegi: ["Persegi 1:1", 1] };
function pilihUkuranEksporKaldik() {
  openModal(`<h3>🖼️ Ekspor Gambar Kalender</h3><div style="font-size:11.5px;color:var(--text-secondary);margin:-6px 0 12px;">Pilih ukuran. Kalender diletakkan di tengah dengan latar sesuai desain.</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">${Object.entries(KD_UKURAN).map(([k, [nama, r]]) => `<button class="btn btn-outline" style="flex-direction:column;gap:6px;padding:12px 8px;" onclick="closeModal();eksporKaldikJPG('${k}')"><span style="display:block;width:${r ? Math.round(34 * Math.min(1, r)) : 34}px;height:${r ? Math.round(34 * Math.min(1, 1 / r)) : 26}px;border:2px solid currentColor;border-radius:3px;margin:0 auto;"></span>${nama}</button>`).join("")}</div>`);
}
// Bingkai gambar akhir ke rasio terpilih (isi diletakkan di tengah, tidak terpotong)
function _kdBingkaiUkuran(kanvas, ukuran, latar) {
  const r = (KD_UKURAN[ukuran] || [])[1];
  if (!r) return kanvas;
  const pad = Math.round(kanvas.width * 0.04);
  let W = kanvas.width + pad * 2, H = Math.round(W / r);
  if (H < kanvas.height + pad * 2) { H = kanvas.height + pad * 2; W = Math.round(H * r); }
  const c = document.createElement("canvas"); c.width = W; c.height = H;
  const x = c.getContext("2d"); x.fillStyle = latar || "#ffffff"; x.fillRect(0, 0, W, H);
  x.drawImage(kanvas, Math.round((W - kanvas.width) / 2), Math.round((H - kanvas.height) / 2));
  return c;
}

// ── Saran lanjutan: warna per jenis, geser lebar panel, pratinjau penuh, bingkai ekspor, palet, pipet, kode, versi ──
function _kdWarnaItem(it) {
  const d = _kdAktif();
  if (d && d.tema && d.tema !== "asli" && d.warnaJenisAktif) return (d.warnaJenis || {})[it.jenis] || KD_WARNA_JENIS[it.jenis] || it.warna || "#93C5FD";
  return it.warna || "#93C5FD";
}
function _kdPasangGeser(h) {
  if (!h) return;
  h.addEventListener("pointerdown", (e) => {
    e.preventDefault(); h.setPointerCapture(e.pointerId); document.body.classList.add("kd-menggeser");
    const gerak = (ev) => { const w = Math.max(300, Math.min(innerWidth * 0.7, innerWidth - ev.clientX)); document.body.style.setProperty("--kd-studio-w", Math.round(w) + "px"); };
    const lepas = () => { h.removeEventListener("pointermove", gerak); document.body.classList.remove("kd-menggeser"); try { localStorage.setItem("kdStudioW", parseInt(getComputedStyle(document.body).getPropertyValue("--kd-studio-w")) || 360); } catch (er) {} setTimeout(_kdGambarBingkai, 260); };
    h.addEventListener("pointermove", gerak); h.addEventListener("pointerup", lepas, { once: true });
  });
}
function _kdPratinjauPenuh(on) {
  document.body.classList.toggle("kd-studio-sembunyi", on);
  document.getElementById("kd-balik")?.remove();
  if (on) { const b = document.createElement("button"); b.id = "kd-balik"; b.className = "btn btn-accent"; b.textContent = "🖌️ Kembali ke Studio"; b.onclick = () => _kdPratinjauPenuh(false); document.body.appendChild(b); }
  setTimeout(_kdGambarBingkai, 300);
}
function _kdGambarBingkai() {
  document.querySelectorAll(".kd-bingkai").forEach((x) => x.remove());
  const pg = document.getElementById("page-kaldik"), hd = document.getElementById("kaldik-header"), gr = document.getElementById("kaldik-grid");
  if (!_KD_BINGKAI || !document.getElementById("kd-studio") || !pg || !hd || !gr) return;
  const r = (KD_UKURAN[_KD_BINGKAI] || [])[1]; if (!r) return;
  if (getComputedStyle(pg).position === "static") pg.style.position = "relative";
  const pr = pg.getBoundingClientRect(), a = hd.getBoundingClientRect(), b = gr.getBoundingClientRect();
  const kiri = Math.min(a.left, b.left) - pr.left, atas = a.top - pr.top, w = Math.max(a.right, b.right) - Math.min(a.left, b.left), h = b.bottom - a.top;
  const pad = w * 0.04; let W = w + pad * 2, H = W / r; if (H < h + pad * 2) { H = h + pad * 2; W = H * r; }
  const el = document.createElement("div"); el.className = "kd-bingkai";
  el.style.cssText = `left:${kiri + (w - W) / 2}px;top:${atas + (h - H) / 2}px;width:${W}px;height:${H}px;`;
  el.innerHTML = `<span>${KD_UKURAN[_KD_BINGKAI][0]} — area gambar ekspor</span>`;
  pg.appendChild(el);
}
// warna: hex ↔ hsl
function _kdHsl(hex) { let [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255); const mx = Math.max(r, g, b), mn = Math.min(r, g, b); let h = 0, s = 0; const l = (mx + mn) / 2; if (mx !== mn) { const d = mx - mn; s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn); h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; } return [h, s * 100, l * 100]; }
function _kdHex(h, s, l) { h = ((h % 360) + 360) % 360; s /= 100; l /= 100; const k = (n) => (n + h / 30) % 12, a = s * Math.min(l, 1 - l), f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1))); return "#" + [f(0), f(8), f(4)].map((x) => Math.round(x * 255).toString(16).padStart(2, "0")).join(""); }
function _kdKontras(hex) { const [, , l] = _kdHsl(hex); return l > 60 ? "#1F2937" : "#FFFFFF"; }
function _kdPaletDari(jenis) {
  const utama = document.getElementById("kd-utama")?.value || "#2563EB", [h, s] = _kdHsl(utama), sat = Math.max(40, s);
  const aksen = jenis === "kompl" ? h + 180 : jenis === "analog" ? h + 35 : h;
  _kdCatatRiwayat();
  Object.assign(_KD_DRAFT, {
    halBg: _kdHex(h, Math.min(sat, 45), 95), kartuBg: _kdHex(h, Math.min(sat, 40), 98.5), kartuBorder: _kdHex(h, Math.min(sat, 55), 82),
    bulanWarna: _kdHex(h, sat, 24), hariBg: utama, hariWarna: _kdKontras(utama), warnaBesar: _kdHex(h, sat, 22),
    warnaSkrip: _kdHex(aksen, jenis === "mono" ? sat : 75, jenis === "mono" ? 58 : 55), pitaBg: _kdHex(aksen, sat, 36),
  });
  _kdGambarPanel(); _kdPratinjau(); toast("Palet " + ({ mono: "monokrom", kompl: "komplementer", analog: "analog" }[jenis]) + " diterapkan", "ok");
}
async function _kdPipetFoto() {
  const url = (typeof _pKaldik === "function" ? _pKaldik() : STATE.pengaturan || {}).kaldik_latar_url;
  if (!url) { toast("Belum ada foto latar kop untuk semester ini", "err"); return; }
  try {
    const img = await new Promise((res, rej) => { const i = new Image(); i.crossOrigin = "anonymous"; i.onload = () => res(i); i.onerror = rej; i.src = url; });
    const c = document.createElement("canvas"); c.width = 80; c.height = 80; const x = c.getContext("2d"); x.drawImage(img, 0, 0, 80, 80);
    const px = x.getImageData(0, 0, 80, 80).data, ember = {};
    for (let i = 0; i < px.length; i += 4) { const k = (px[i] >> 4) + "," + (px[i + 1] >> 4) + "," + (px[i + 2] >> 4); const e = (ember[k] = ember[k] || { n: 0, r: 0, g: 0, b: 0 }); e.n++; e.r += px[i]; e.g += px[i + 1]; e.b += px[i + 2]; }
    const calon = Object.values(ember).sort((p, q) => q.n - p.n).map((e) => [e.r / e.n, e.g / e.n, e.b / e.n]), pilih = [];
    for (const c2 of calon) { if (pilih.every((p) => Math.hypot(p[0] - c2[0], p[1] - c2[1], p[2] - c2[2]) > 55)) pilih.push(c2); if (pilih.length === 5) break; }
    _KD_PIPET = pilih.map((p) => "#" + p.map((v) => Math.round(v).toString(16).padStart(2, "0")).join(""));
    _kdGambarPanel();
  } catch (e) { toast("Foto tidak bisa dibaca warnanya (izin akses gambar)", "err"); }
}
function _kdTerapPipet() {
  if (!_KD_PIPET.length) return;
  const urut = _KD_PIPET.slice().sort((a, b) => _kdHsl(a)[2] - _kdHsl(b)[2]), gelap = urut[0], terang = urut[urut.length - 1];
  const hidup = _KD_PIPET.slice().sort((a, b) => _kdHsl(b)[1] - _kdHsl(a)[1])[0], [ht, st] = _kdHsl(terang), [hh, sh] = _kdHsl(hidup);
  _kdCatatRiwayat();
  Object.assign(_KD_DRAFT, { bulanWarna: gelap, warnaBesar: gelap, hariBg: urut[Math.min(1, urut.length - 1)], hariWarna: _kdKontras(urut[Math.min(1, urut.length - 1)]), warnaSkrip: hidup, pitaBg: _kdHex(hh, sh, 36), halBg: _kdHex(ht, Math.min(st, 40), 95), kartuBg: _kdHex(ht, Math.min(st, 35), 98.5), kartuBorder: _kdHex(ht, Math.min(st, 45), 80) });
  _kdGambarPanel(); _kdPratinjau(); toast("Palet dari foto kop diterapkan", "ok");
}
function _kdSalinKode() {
  const kode = "KALDIK1:" + btoa(unescape(encodeURIComponent(JSON.stringify(_KD_DRAFT))));
  (navigator.clipboard ? navigator.clipboard.writeText(kode) : Promise.reject()).then(() => toast("Kode desain disalin — tempel di perangkat lain lewat 📥 Tempel kode", "ok")).catch(() => prompt("Salin kode desain berikut:", kode));
}
function _kdTempelKode() {
  const kode = (prompt("Tempel kode desain (diawali KALDIK1:)") || "").trim(); if (!kode) return;
  try {
    if (!kode.startsWith("KALDIK1:")) throw new Error("format");
    const d = JSON.parse(decodeURIComponent(escape(atob(kode.slice(8)))));
    if (!d || typeof d !== "object" || !d.tema) throw new Error("isi");
    _kdCatatRiwayat(); _KD_DRAFT = d; _kdGambarPanel(); _kdPratinjau(); toast("Desain dari kode diterapkan — tekan Simpan untuk menetapkan", "ok");
  } catch (e) { toast("Kode desain tidak valid", "err"); }
}
function _kdPulihkanVersi(i) {
  const v = _KD_VERSI[i]; if (!v) return;
  _kdCatatRiwayat(); _KD_DRAFT = JSON.parse(JSON.stringify(v.d)); _kdGambarPanel(); _kdPratinjau();
  toast("Versi " + new Date(v.t).toLocaleDateString("id-ID") + " dipulihkan — tekan Simpan untuk menetapkan", "info");
}
addEventListener("resize", () => { if (_KD_BINGKAI) { clearTimeout(window._kdTB); window._kdTB = setTimeout(_kdGambarBingkai, 200); } });

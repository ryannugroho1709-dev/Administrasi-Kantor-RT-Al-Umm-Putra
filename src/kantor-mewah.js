// ============================================================
//  AL-UMM VIRTUAL HEADQUARTERS — lapisan "kantor mewah" di atas Kantor Maya (three.js r128, tanpa build)
//  • Bahan PBR (MeshStandard) + tone mapping ACES + pantulan lingkungan; palet resmi Al-Umm
//    Emerald #123F32 · Deep Forest #0B3026 · Champagne Gold #C6A45C · Ivory #F5F1E8 · Beige #D8CBB7 · Walnut #725139 · Charcoal #252A28
//  • Lantai porselen 60×120 berurat marmer, dinding travertin, kayu walnut bertekstur
//  • Pembukaan sinematik, AUTO putar 360°, geser (klik kanan / Shift+seret), HOME, layar penuh, kualitas grafis
//  • Navigasi ruang (klik lantai ruang / tombol bawah) + panel info ruang; sorotan saat kursor di atas objek
//  • Monitor menampilkan dasbor bergerak, Dinding Informasi (jam, tanggal, status rapat), layar pintar & papan tulis
//    digital di Ruang Rapat; Direktori: struktur organisasi, direktori staf, info rapat, aktivitas, resepsionis (DEMO)
//  • Label petugas tidak saling menumpuk
// ============================================================
const KM = { kualitas: "tinggi", orbit: false, sudutIso: -0.32, hover: null, tHover: 0, cine: null, lampu: [] };
try { KM.kualitas = localStorage.getItem("kt:kualitas") || (window.innerWidth < 700 ? "sedang" : "tinggi"); } catch (e) {}
const KM_PALET = {
  0x0f3d2e: 0x123f32, 0x14532d: 0x123f32, 0x124a37: 0x123f32, 0x0b2f23: 0x0b3026, 0xc9a227: 0xc6a45c, 0xd4d4d8: 0xd8cbb7,
  0xf3ecdf: 0xf5f1e8, 0xf5efe2: 0xf5f1e8, 0xe8dcc4: 0xd8cbb7, 0xf8fafc: 0xf5f1e8,
  0x7a4a24: 0x725139, 0x6b3f1f: 0x725139, 0x3b2314: 0x5a3e2b, 0x2a180c: 0x4a3324, 0x8b5e34: 0x7d5a40, 0xa9774a: 0x8a6647, 0x5b3a1e: 0x5a3e2b, 0x6b4226: 0x6a4a35,
  0x111827: 0x252a28, 0x1f2937: 0x2b302e,
};
const KM_KAYU = new Set([0x725139, 0x5a3e2b, 0x4a3324, 0x7d5a40, 0x8a6647, 0x6a4a35]);
const KM_RUANG = {
  ustadz: { nama: "Ruang Ustadz", sorot: [-10, 0, 1.9], ket: "Ruang kerja para petugas ikhwan: administrasi jenjang, Tim IT, Desain & Konten.", fasilitas: ["Meja kerja individual & monitor", "Kursi ergonomis", "Lemari arsip built-in (ketuk untuk membuka berkas)", "Rak buku & berkas", "Tanaman indoor"] },
  kepala: { nama: "Ruang Kepala PKBM", sorot: [0, -4.4, 2.2], ket: "Ruang pimpinan: memantau seluruh jenjang, menerima tamu, dan memimpin rapat.", fasilitas: ["Meja eksekutif walnut & kursi direktur", "Dua kursi tamu & sofa tamu", "Logo Al-Umm di dinding utama", "TV dasbor PKBM", "Lemari piala & arsip lembaga"] },
  rapat: { nama: "Ruang Rapat", sorot: [-1.6, 3.8, 2.2], ket: "Rapat koordinasi Kepala PKBM bersama petugas. Ustadz dan ustadzah dipisah tabir.", fasilitas: ["Meja konferensi oval dengan tabir", "Kursi rapat ergonomis", "Layar rapat di depan sisi ustadz & sisi ustadzah, dengan kamera konferensi", "Papan tulis digital", "Panel akustik dinding", "Dinding Informasi (jam, tanggal, status rapat)"] },
  bendahara: { nama: "Ruang Bendahara", sorot: [3.4, 3, 2.6], ket: "Pengelolaan keuangan lembaga: BOSP, Kertas Kerja ARKAS, nota & realisasi.", fasilitas: ["Meja kerja & komputer", "Lemari dokumen", "Printer", "Penyimpanan digital (Arsip Drive)"] },
  ustadzah: { nama: "Ruang Ustadzah", sorot: [10, 0, 1.9], ket: "Ruang kerja petugas akhwat: Sekretaris, Admin Dapodik, Penyelenggara & Admin Putri.", fasilitas: ["Meja kerja modular & monitor", "Kursi ergonomis", "Rak arsip (ketuk untuk membuka berkas)", "Pencahayaan nyaman", "Privasi terjaga (terpisah dari ruang ikhwan)"] },
  depan: { nama: "Pintu Masuk & Halaman", sorot: [0, 10, 1.9], ket: "Gerbang utama PKBM Al-Umm Barabai, taman depan, dan halaman parkir.", fasilitas: ["Papan nama 3D & logo resmi", "Taman & tanaman hias", "Lampu arsitektural", "Halaman parkir"] },
};
const KM_URUT = ["semua", "ustadz", "kepala", "rapat", "bendahara", "ustadzah"];
function kmRuangDi(x, z) {
  if (z > 8.2) return "depan"; if (x < -5) return "ustadz"; if (x > 5) return "ustadzah";
  if (z < 0) return "kepala"; if (x > 1.8 && z < 5.6) return "bendahara"; return "rapat";
}

// ── tekstur prosedural ──
function _kmKanvas(w, h, gambar) { const c = document.createElement("canvas"); c.width = w; c.height = h; gambar(c.getContext("2d"), w, h); const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.encoding = THREE.sRGBEncoding; t.anisotropy = 8; return t; }
function _kmUrat(x, w, h, warna, n, alfa) { x.strokeStyle = warna; x.globalAlpha = alfa; for (let i = 0; i < n; i++) { x.lineWidth = 0.6 + Math.random() * 1.6; x.beginPath(); let px = Math.random() * w, py = Math.random() * h; x.moveTo(px, py); for (let k = 0; k < 7; k++) { px += (Math.random() - 0.35) * w * 0.18; py += (Math.random() - 0.5) * h * 0.18; x.lineTo(px, py); } x.stroke(); } x.globalAlpha = 1; }
const KM_TEKS = {};
function _kmTeksLantai() { // satu ubin porselen 120×60 cm, urat marmer halus, nat tipis
  return KM_TEKS.lantai || (KM_TEKS.lantai = _kmKanvas(1024, 512, (x, w, h) => {
    const g = x.createLinearGradient(0, 0, w, h); g.addColorStop(0, "#f7f3ea"); g.addColorStop(1, "#efe8db"); x.fillStyle = g; x.fillRect(0, 0, w, h);
    _kmUrat(x, w, h, "#b9ad9b", 18, 0.28); _kmUrat(x, w, h, "#d8cbb7", 26, 0.35);
    x.strokeStyle = "rgba(160,148,128,.55)"; x.lineWidth = 3; x.strokeRect(1.5, 1.5, w - 3, h - 3);
  }));
}
function _kmTeksTravertin() {
  return KM_TEKS.trav || (KM_TEKS.trav = _kmKanvas(512, 512, (x, w, h) => {
    x.fillStyle = "#f2ece0"; x.fillRect(0, 0, w, h);
    for (let i = 0; i < 90; i++) { x.fillStyle = `rgba(${150 + Math.random() * 40},${135 + Math.random() * 30},${110 + Math.random() * 30},${0.08 + Math.random() * 0.1})`; x.fillRect(0, Math.random() * h, w, 1 + Math.random() * 4); }
    for (let i = 0; i < 140; i++) { x.fillStyle = "rgba(120,100,80,.12)"; x.beginPath(); x.ellipse(Math.random() * w, Math.random() * h, 2 + Math.random() * 7, 0.6 + Math.random() * 1.5, 0, 0, Math.PI * 2); x.fill(); }
    x.strokeStyle = "rgba(170,155,130,.5)"; x.lineWidth = 2; for (let y = 0; y <= h; y += 128) { x.beginPath(); x.moveTo(0, y); x.lineTo(w, y); x.stroke(); }
  }));
}
function _kmTeksKayu() { // serat walnut (keabuan, dikalikan warna bahan)
  return KM_TEKS.kayu || (KM_TEKS.kayu = _kmKanvas(512, 512, (x, w, h) => {
    x.fillStyle = "#d9d2ca"; x.fillRect(0, 0, w, h);
    for (let i = 0; i < 120; i++) { const y = Math.random() * h; x.strokeStyle = `rgba(60,40,25,${0.08 + Math.random() * 0.2})`; x.lineWidth = 0.6 + Math.random() * 2.4; x.beginPath(); x.moveTo(0, y); for (let px = 0; px <= w; px += 32) x.lineTo(px, y + Math.sin(px / 60 + i) * (2 + Math.random() * 3)); x.stroke(); }
    for (let i = 0; i < 6; i++) { x.strokeStyle = "rgba(50,30,18,.22)"; x.lineWidth = 1.5; x.beginPath(); x.ellipse(Math.random() * w, Math.random() * h, 18 + Math.random() * 20, 5 + Math.random() * 5, 0, 0, Math.PI * 2); x.stroke(); }
  }));
}
function _kmLingkungan(r) { // pantulan hangat untuk emas, kaca & marmer
  const c = document.createElement("canvas"); c.width = 512; c.height = 256; const x = c.getContext("2d");
  const g = x.createLinearGradient(0, 0, 0, 256); g.addColorStop(0, "#fff7e6"); g.addColorStop(0.45, "#f1e4c8"); g.addColorStop(0.55, "#8b7a5e"); g.addColorStop(1, "#3b342a"); x.fillStyle = g; x.fillRect(0, 0, 512, 256);
  x.fillStyle = "rgba(255,240,200,.9)"; [80, 220, 360].forEach((px) => x.fillRect(px, 40, 60, 14));
  const t = new THREE.CanvasTexture(c); t.mapping = THREE.EquirectangularReflectionMapping; t.encoding = THREE.sRGBEncoding;
  const pm = new THREE.PMREMGenerator(r); const env = pm.fromEquirectangular(t).texture; pm.dispose(); t.dispose(); return env;
}

// ── ubah seluruh bahan ke PBR + palet resmi ──
function _kmUbahBahan() {
  const sc = KT.scene, r = KT.renderer, cache = new Map();
  const lantaiT = _kmTeksLantai(), kayuT = _kmTeksKayu(), travT = _kmTeksTravertin();
  const ubah = (m, mesh) => {
    if (!m) return m;
    if (m.isMeshBasicMaterial) { if (!cache.has(m)) { cache.set(m, m); if (m.map) { m.map.encoding = THREE.sRGBEncoding; m.map.needsUpdate = true; } else m.color.convertSRGBToLinear(); m.toneMapped = false; } return m; }
    if (!(m.isMeshPhongMaterial || m.isMeshLambertMaterial)) return m;
    const hexAsli = m.color.getHex(), hex = KM_PALET[hexAsli] ?? hexAsli, emas = hex === 0xc6a45c, kaca = m.transparent && m.opacity < 0.4;
    const kunci = hex + "|" + (m.map ? m.map.uuid : "") + "|" + m.transparent + m.opacity;
    const p = mesh && mesh.geometry && mesh.geometry.parameters;
    // dinding travertin & lantai: ulangan tekstur menurut ukuran benda
    if (hex === 0xf5f1e8 && p && p.height >= 2.4 && !m.map) {
      const n = new THREE.MeshStandardMaterial({ color: 0xffffff, map: travT.clone(), roughness: 0.72, metalness: 0 });
      n.map.needsUpdate = true; n.map.repeat.set(Math.max(p.width, p.depth) / 2, p.height / 2); return n;
    }
    if (p && Math.abs(p.width - 30) < 0.01 && Math.abs(p.depth - 16) < 0.01) { const t = lantaiT.clone(); t.needsUpdate = true; t.repeat.set(30 / 1.2, 16 / 0.6); return new THREE.MeshStandardMaterial({ map: t, roughness: 0.28, metalness: 0, envMapIntensity: 0.5 }); }
    if (cache.has(kunci)) return cache.get(kunci);
    const kilap = m.shininess ?? 8;
    const n = new THREE.MeshStandardMaterial({ color: new THREE.Color(hex).convertSRGBToLinear(), map: m.map || null, transparent: m.transparent, opacity: m.opacity,
      roughness: emas ? 0.32 : kaca ? 0.05 : Math.min(0.92, Math.max(0.25, 1 - kilap / 110)), metalness: emas ? 0.88 : kaca ? 0.1 : 0.02, envMapIntensity: emas ? 1.1 : 0.45 });
    if (n.map) { n.map.encoding = THREE.sRGBEncoding; n.map.needsUpdate = true; }
    if (KM_KAYU.has(hex)) { n.map = kayuT; n.color = new THREE.Color(hex).convertSRGBToLinear().multiplyScalar(1.25); n.roughness = 0.55; }
    if (kaca) { n.depthWrite = false; }
    cache.set(kunci, n); return n;
  };
  sc.traverse((o) => { if (!o.isMesh) return; if (Array.isArray(o.material)) o.material = o.material.map((m) => ubah(m, o)); else o.material = ubah(o.material, o); });
  sc.environment = _kmLingkungan(r);
}
function _kmTerapkanKualitas() {
  const r = KT.renderer; if (!r) return; const q = KM.kualitas;
  r.setPixelRatio(Math.min(q === "tinggi" ? 2 : q === "sedang" ? 1.5 : 1, window.devicePixelRatio || 1));
  r.shadowMap.enabled = q !== "rendah";
  KT.scene.traverse((o) => { if (o.isDirectionalLight && o.castShadow) { o.shadow.mapSize.set(q === "tinggi" ? 2048 : 1024, q === "tinggi" ? 2048 : 1024); if (o.shadow.map) { o.shadow.map.dispose(); o.shadow.map = null; } } if (o.isMesh && o.material) [].concat(o.material).forEach((m) => (m.needsUpdate = true)); });
  if (typeof _ktUkur === "function") _ktUkur();
}
function kmGantiKualitas() {
  KM.kualitas = { tinggi: "sedang", sedang: "rendah", rendah: "tinggi" }[KM.kualitas] || "tinggi";
  try { localStorage.setItem("kt:kualitas", KM.kualitas); } catch (e) {}
  _kmTerapkanKualitas(); const b = document.getElementById("km-kualitas"); if (b) b.textContent = "Grafis: " + { tinggi: "Tinggi", sedang: "Sedang", rendah: "Rendah" }[KM.kualitas];
  toast("Kualitas grafis: " + { tinggi: "Tinggi", sedang: "Sedang", rendah: "Rendah (lebih ringan)" }[KM.kualitas], "ok");
}

// ── perlengkapan pintar: dinding informasi, layar pintar, kamera konferensi, papan tulis digital, panel akustik, monitor dasbor ──
function _kmPerlengkapan() {
  const sc = KT.scene, emas = new THREE.MeshPhongMaterial({ color: 0xc9a227, shininess: 90 }), gelap = new THREE.MeshPhongMaterial({ color: 0x0b0f19, shininess: 80 });
  const balok = (w, h, d, mat, x, y, z) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; sc.add(m); return m; };
  // Layar rapat di depan MASING-MASING sisi (ustadz & ustadzah), menghadap peserta; kamera konferensi di atasnya
  const layarRapat = (x, lebar) => {
    const tinggi = lebar * 0.5625; balok(lebar + 0.1, tinggi + 0.1, 0.05, gelap, x, 1.7, 0.13); balok(lebar + 0.14, 0.03, 0.07, emas, x, 1.7 + tinggi / 2 + 0.06, 0.13);
    if (KT.tvTekstur) { const l = new THREE.Mesh(new THREE.PlaneGeometry(lebar, tinggi), new THREE.MeshBasicMaterial({ map: KT.tvTekstur })); l.position.set(x, 1.7, 0.165); sc.add(l); }
    balok(0.4, 0.06, 0.08, gelap, x, 1.7 + tinggi / 2 + 0.12, 0.16); const lensa = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.02, 12), new THREE.MeshBasicMaterial({ color: 0x38bdf8 })); lensa.rotation.x = Math.PI / 2; lensa.position.set(x, 1.7 + tinggi / 2 + 0.12, 0.21); sc.add(lensa);
  };
  layarRapat(-3.3, 1.8); layarRapat(-0.8, 1.2);
  // Dinding Informasi (jam, tanggal, status rapat) di dinding kiri ruang rapat + panel akustik
  KM.infoKanvas = document.createElement("canvas"); KM.infoKanvas.width = 640; KM.infoKanvas.height = 360; KM.infoTeks = new THREE.CanvasTexture(KM.infoKanvas);
  balok(0.06, 1.12, 1.9, gelap, -4.86, 1.75, 3.9); balok(0.08, 0.03, 1.95, emas, -4.86, 2.33, 3.9);
  const info = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1.01), new THREE.MeshBasicMaterial({ map: KM.infoTeks })); info.rotation.y = Math.PI / 2; info.position.set(-4.82, 1.75, 3.9); sc.add(info);
  _kmGambarInfo();
  const akustik = new THREE.MeshLambertMaterial({ color: 0xd8cbb7 });
  [2.3, 2.6, 5.2, 5.5].forEach((z) => balok(0.06, 2.3, 0.22, akustik, -4.86, 1.3, z));
  // Papan tulis digital (sekat kaca bendahara, menghadap ruang rapat)
  const pk = document.createElement("canvas"); pk.width = 512; pk.height = 320; const x = pk.getContext("2d");
  x.fillStyle = "#fbfaf6"; x.fillRect(0, 0, 512, 320); x.strokeStyle = "#c6a45c"; x.lineWidth = 6; x.strokeRect(3, 3, 506, 314);
  x.fillStyle = "#123f32"; x.font = "800 26px system-ui, sans-serif"; x.fillText("Papan Tulis Digital", 24, 44); x.fillStyle = "#94a3b8"; x.font = "700 16px system-ui"; x.fillText("DEMO — catatan rapat tampil di panel kanan", 24, 72);
  x.strokeStyle = "#123f32"; x.lineWidth = 3; x.beginPath(); x.moveTo(30, 260); x.bezierCurveTo(120, 140, 220, 240, 300, 150); x.bezierCurveTo(360, 90, 420, 170, 480, 110); x.stroke();
  const papan = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.0), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(pk) })); papan.rotation.y = -Math.PI / 2; papan.position.set(1.69, 1.55, 3.6); sc.add(papan);
  balok(0.04, 1.06, 1.66, gelap, 1.72, 1.55, 3.6);
  // monitor petugas: dasbor bergerak (satu kanvas dipakai bersama → ringan)
  KM.monKanvas = document.createElement("canvas"); KM.monKanvas.width = 256; KM.monKanvas.height = 160; KM.monTeks = new THREE.CanvasTexture(KM.monKanvas); _kmGambarMonitor(0);
  // lampu ruang: menyala bertahap saat pembukaan
  KM.lampu = []; sc.traverse((o) => { if (o.isPointLight) { o.userData.target = o.intensity; o.intensity = 0; KM.lampu.push(o); } });
}
function _kmGambarInfo() {
  const c = KM.infoKanvas; if (!c) return; const x = c.getContext("2d"), W = c.width, H = c.height, d = new Date();
  const g = x.createLinearGradient(0, 0, W, H); g.addColorStop(0, "#0b3026"); g.addColorStop(1, "#123f32"); x.fillStyle = g; x.fillRect(0, 0, W, H);
  x.strokeStyle = "#c6a45c"; x.lineWidth = 4; x.strokeRect(8, 8, W - 16, H - 16);
  x.fillStyle = "#e9d8a6"; x.font = "800 22px system-ui, sans-serif"; x.textAlign = "left"; x.fillText("DINDING INFORMASI · PKBM AL-UMM", 26, 44);
  x.fillStyle = "#f5f1e8"; x.font = "800 86px system-ui, sans-serif"; x.fillText(`${String(d.getHours()).padStart(2, "0")}.${String(d.getMinutes()).padStart(2, "0")}`, 26, 140);
  x.fillStyle = "#c6a45c"; x.font = "700 24px system-ui"; x.fillText(d.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" }), 26, 180);
  const rapat = KT.sesi && KT.sesi.aktif ? `Rapat berlangsung: ${KT.sesi.judul || "Rapat Koordinasi"}` : "Ruang rapat: tersedia";
  let online = 0; try { const st = KT_HADIR.kanal ? KT_HADIR.kanal.presenceState() : {}; online = Object.keys(st).length; } catch (e) {}
  x.fillStyle = "#f5f1e8"; x.font = "700 22px system-ui"; x.fillText("● " + rapat, 26, 236);
  x.fillText(`● Petugas daring sekarang: ${online}`, 26, 272);
  x.fillText(`● Petugas di kantor: ${(KT.staf || []).length} orang`, 26, 308);
  KM.infoTeks.needsUpdate = true;
}
function _kmGambarMonitor(kini) {
  const c = KM.monKanvas; if (!c) return; const x = c.getContext("2d"), W = c.width, H = c.height;
  x.fillStyle = "#0b1d2e"; x.fillRect(0, 0, W, H); x.fillStyle = "#123f32"; x.fillRect(0, 0, W, 22); x.fillStyle = "#e9d8a6"; x.font = "700 12px system-ui"; x.fillText("PKBM · Dasbor", 8, 15);
  for (let i = 0; i < 6; i++) { const t = 30 + 60 * (0.5 + 0.5 * Math.sin(kini / 900 + i * 1.3)); x.fillStyle = ["#34d399", "#60a5fa", "#fbbf24", "#f472b6", "#a78bfa", "#2dd4bf"][i]; x.fillRect(16 + i * 38, H - 18 - t, 24, t); }
  x.strokeStyle = "#e2e8f0"; x.lineWidth = 2; x.beginPath(); for (let px = 0; px <= W; px += 8) x.lineTo(px, 60 + Math.sin(kini / 500 + px / 30) * 10); x.stroke();
  KM.monTeks.needsUpdate = true;
}
// monitor: mati / menyala (dasbor redup) / bekerja (dasbor terang)
(function () {
  if (typeof kdLayar !== "function") return;
  kdLayar = function (id, status) {
    const l = KT.layar && KT.layar[id]; if (!l) return; l.userData.status = status;
    if (status === "mati" || !KM.monTeks) { l.material.map = null; l.material.color.setHex(0x0b1220).convertSRGBToLinear(); }
    else { l.material.map = KM.monTeks; l.material.color.setHex(status === "kerja" ? 0xffffff : 0x8fa3c2); }
    l.material.needsUpdate = true;
  };
})();

// ── pembukaan sinematik ──
function _kmPembukaan() {
  const lay = document.getElementById("kt-layar"); if (!lay) return;
  const logo = typeof urlLogoSekolah === "function" ? urlLogoSekolah() : "";
  const el = document.createElement("div"); el.className = "km-buka"; el.id = "km-buka";
  el.innerHTML = `${logo ? `<img src="${_ktE(logo)}" alt="">` : ""}<b>AL-UMM VIRTUAL HEADQUARTERS</b><small>PKBM Al-Umm Barabai</small>`;
  lay.appendChild(el); requestAnimationFrame(() => el.classList.add("tampil"));
  KM.cine = { t0: performance.now(), lama: 4200 }; KT.sudut = 0;
  setTimeout(() => el.classList.add("pudar"), 3300); setTimeout(() => el.remove(), 4300);
}
const _kmEase = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// ── setiap bingkai: pembukaan, putar otomatis, sorotan kursor, monitor, label tidak menumpuk ──
(function () {
  if (typeof _ktJalan !== "function") return;
  const a = _ktJalan;
  _ktJalan = function () {
    const kini = performance.now();
    if (KM.cine && KT.renderer) {
      const p = Math.min(1, (kini - KM.cine.t0) / KM.cine.lama), e = _kmEase(p);
      KT.tinggi = 5 + 16 * e; KT.jarak = 26 + 8 * e; KT.sudut = KM.sudutIso * e;
      const f = { x: 0, z: 13 - 10.5 * e, zoom: 2.4 - 1.4 * e }; KT.fokus = f; KT.pusat = { x: f.x, z: f.z }; KT.zoom = f.zoom; if (typeof _ktProyeksi === "function") _ktProyeksi();
      KM.lampu.forEach((l) => (l.intensity = (l.userData.target || 0) * Math.min(1, p * 1.4)));
      if (p >= 1) { KM.cine = null; KT.tinggi = 21; KT.jarak = 34; KM.lampu.forEach((l) => (l.intensity = l.userData.target || 0)); }
    } else if (KM.orbit) KT.sudut += 0.0035;
    if (KM.monKanvas && kini - (KM.tMon || 0) > 650) { KM.tMon = kini; _kmGambarMonitor(kini); }
    if (KT.rgbMat) KT.rgbMat.color.setHSL((kini / 6000) % 1, 0.85, 0.55); // lampu RGB komputer
    if (KM.infoKanvas && kini - (KM.tInfo || 0) > 20000) { KM.tInfo = kini; _kmGambarInfo(); }
    a.apply(this, arguments);
    if (!KT.buka || !KT.renderer) return;
    if (KM.hoverPos && kini - KM.tHover > 90) { KM.tHover = kini; _kmHover(); }
    _kmRapikanLabel();
  };
})();
// Label tidak menumpuk TANPA bergetar: susunan dihitung ulang tiap 0,35 detik dengan urutan tetap,
// lalu tiap label bergeser halus ke tempatnya; pergeseran paling jauh 2 tingkat supaya tetap dekat orangnya.
KM.lbl = { geser: {}, target: {}, ukuran: {}, t: 0 };
function _kmRapikanLabel() {
  const kini = performance.now(), L = KM.lbl;
  const data = Object.entries(KT.label || {}).filter(([, l]) => l && !l.hidden && l.style.transform).map(([id, l]) => {
    const m = l.style.transform.match(/translate\(([-\d.]+)px,\s*([-\d.]+)px\)/); return m ? { id, l, x: +m[1], y: +m[2] } : null;
  }).filter(Boolean);
  if (kini - L.t > 350) {
    L.t = kini; L.target = {};
    data.forEach((b) => { L.ukuran[b.id] = [b.l.offsetWidth || 120, b.l.offsetHeight || 32]; });
    const urut = data.slice().sort((p, q) => Math.round(q.y / 8) - Math.round(p.y / 8) || (p.id < q.id ? -1 : 1));
    const kotak = [];
    urut.forEach((b) => {
      const [w, h] = L.ukuran[b.id]; let tingkat = 0;
      const tabrak = (y) => kotak.some((k) => Math.abs(k.x - b.x) < (k.w + w) / 2 + 2 && Math.abs(k.y - y) < (k.h + h) / 2);
      // pertahankan tingkat sebelumnya selama masih tidak bertabrakan (label tidak melompat-lompat)
      const lalu = (L.tingkat || (L.tingkat = {}))[b.id] || 0;
      if (lalu && !tabrak(b.y - lalu * (h + 2)) && tabrak(b.y)) tingkat = lalu;
      else while (tingkat < 2 && tabrak(b.y - tingkat * (h + 2))) tingkat++;
      L.tingkat[b.id] = tingkat;
      L.target[b.id] = tingkat * (h + 2); kotak.push({ x: b.x, y: b.y - L.target[b.id], w, h });
    });
  }
  data.forEach((b) => {
    const tg = L.target[b.id] || 0, kini2 = L.geser[b.id] || 0, baru = Math.abs(tg - kini2) < 1 ? tg : kini2 + (tg - kini2) * 0.25;
    L.geser[b.id] = baru;
    if (baru) b.l.style.transform = `translate(${Math.round(b.x)}px,${Math.round(b.y - baru)}px) translate(-50%,-100%)`;
  });
}

// ── klik & sorotan ──
function _kmSinar(cx, cy) {
  const kan = KT.renderer.domElement, kot = kan.getBoundingClientRect();
  const m = new THREE.Vector2(((cx - kot.left) / kot.width) * 2 - 1, -((cy - kot.top) / kot.height) * 2 + 1);
  const ray = new THREE.Raycaster(); ray.setFromCamera(m, KT.kamera); return ray;
}
function _kmLantai(ray) { const p = new THREE.Vector3(); return ray.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), p) ? p : null; }
(function () {
  if (typeof _ktKetuk !== "function") return;
  const a = _ktKetuk;
  _ktKetuk = function (e) {
    const ray = _kmSinar(e.clientX, e.clientY);
    const kena = ray.intersectObjects([...Object.values(KT.tokoh), ...(KT.rak || [])], true)[0];
    if (kena) return a.apply(this, arguments);
    const p = _kmLantai(ray); if (p) kmRuang(kmRuangDi(p.x, p.z));
  };
})();
function _kmSorot(obj, nyala) {
  if (!obj) return;
  obj.traverse((o) => { if (!o.isMesh || !o.material || !o.material.emissive) return; if (nyala) { if (!o.userData.emAsli) o.userData.emAsli = o.material.emissive.getHex(); o.material = o.material.clone(); o.material.emissive.setHex(0x3a2c0a); } else if (o.userData.emAsli !== undefined) { o.material.emissive.setHex(o.userData.emAsli); } });
}
function _kmHover() {
  if (!KT.renderer || KM.cine) return;
  const { x: cx, y: cy } = KM.hoverPos, ray = _kmSinar(cx, cy);
  const kena = ray.intersectObjects([...Object.values(KT.tokoh), ...(KT.rak || [])], true)[0];
  let target = null, teks = "";
  if (kena) { let o = kena.object; while (o && !o.userData.staf && !(o.userData.npc) && !(o.userData.rak && o.parent && o.parent.type === "Scene")) o = o.parent; target = o || kena.object; const s = target && target.userData.staf; teks = s ? `${s.namaLengkap || s.nama} — ${s.peran.map((k) => _ktPeran(k).nama).join(", ")}` : target && target.userData.npc ? "Petugas kebersihan" : "Lemari arsip — ketuk untuk membuka berkas"; }
  else { const p = _kmLantai(ray); const r = p && kmRuangDi(p.x, p.z); if (r) teks = KM_RUANG[r].nama + " — ketuk untuk melihat info"; }
  if (target !== KM.hover) { _kmSorot(KM.hover, false); _kmSorot(target, true); KM.hover = target; }
  const tip = document.getElementById("km-tip"), lay = document.getElementById("kt-layar");
  if (tip && lay) { const k = lay.getBoundingClientRect(); tip.hidden = !teks; tip.textContent = teks; tip.style.transform = `translate(${cx - k.left + 14}px,${cy - k.top + 14}px)`; }
  if (KT.renderer) KT.renderer.domElement.style.cursor = target || teks ? "pointer" : "grab";
}

// ── navigasi ruang, panel info ──
function kmRuang(kode) {
  KM.orbit = false; document.getElementById("km-auto")?.classList.remove("on");
  document.querySelectorAll(".km-ruang button").forEach((b) => b.classList.toggle("on", b.dataset.r === kode));
  if (kode === "semua") { kmBeranda(); return; }
  const r = KM_RUANG[kode]; if (!r) return;
  KT.fokus = { x: r.sorot[0], z: r.sorot[1], zoom: r.sorot[2] };
  const nm = document.getElementById("kt-sorot-nama"); if (nm) nm.textContent = r.nama;
  const orang = _kmOrangRuang(kode);
  _ktPanel(`<div class="km-info"><small>INFORMASI RUANG</small><h3>${_ktE(r.nama)}</h3><p>${_ktE(r.ket)}</p>
    <h4>Penanggung Jawab</h4>${orang.length ? `<div class="km-orang">${orang.map((s) => `<button onclick="ktKartu('${s.id}')">${typeof _ktFoto === "function" ? _ktFoto(s, 30) : ""}<span><b>${_ktE(_ktGelar(s))} ${_ktE(s.namaLengkap || s.nama)}</b><small>${_ktE(s.peran.map((k) => _ktPeran(k).nama).join(" · "))}</small></span></button>`).join("")}</div>` : `<p class="kt-ket">${kode === "rapat" ? (KT.sesi && KT.sesi.aktif ? "Rapat sedang berlangsung: " + _ktE(KT.sesi.judul || "") : "Tidak ada rapat saat ini. Pimpin rapat lewat menu Kepala PKBM.") : "Belum ada petugas di ruang ini."}</p>`}
    <h4>Fasilitas</h4><ul class="kt-ul">${r.fasilitas.map((f) => `<li>${_ktE(f)}</li>`).join("")}</ul>
    <button class="kt-salin" onclick="kmRuang('semua')">⌂ Kembali ke Seluruh Kantor</button></div>`);
}
function _kmOrangRuang(kode) {
  const kid = (KT.peran.kepala || [])[0], yid = (KT.peran.yayasan || [])[0], bid = (KT.peran.bendahara || [])[0];
  return (KT.staf || []).filter((s) => { const t = KT.tokoh[s.id]; if (!t || !t.visible) return false; const m = t.userData.meja || {}; if (kode === "kepala") return s.id === kid; if (kode === "bendahara") return s.id === bid; if (kode === "rapat") return KT.sesi && KT.sesi.aktif && KT.sesi.ids && KT.sesi.ids.has(s.id); return s.id !== yid && kmRuangDi(m.x || 0, m.z || 0) === kode; });
}
function kmBeranda() {
  KM.orbit = false; document.getElementById("km-auto")?.classList.remove("on");
  KT.sudut = KM.sudutIso; if (typeof ktSorot === "function") ktSorot(0, 0);
  document.querySelectorAll(".km-ruang button").forEach((b) => b.classList.toggle("on", b.dataset.r === "semua"));
  const p = document.getElementById("kt-panel"); if (p && p.querySelector(".km-info")) { p.hidden = true; setTimeout(_ktUkur, 30); }
}
function kmAuto() { KM.orbit = !KM.orbit; document.getElementById("km-auto")?.classList.toggle("on", KM.orbit); if (KM.orbit) { clearInterval(KT.autoT); KT.autoAktif = false; document.getElementById("kt-auto")?.classList.remove("on"); } }
function kmLayarPenuh() { const el = document.getElementById("kantor-ai"); if (!el) return; if (document.fullscreenElement) document.exitFullscreen().catch(() => {}); else if (el.requestFullscreen) el.requestFullscreen().catch(() => toast("Layar penuh tidak didukung di perangkat ini", "warn")); setTimeout(_ktUkur, 300); }

// ── Direktori: struktur organisasi, staf, info rapat, aktivitas, resepsionis ──
function kmDirektori(tab = "struktur") {
  const tabs = [["struktur", "Struktur"], ["staf", "Direktori Staf"], ["rapat", "Ruang Rapat"], ["aktivitas", "Aktivitas"], ["tamu", "Resepsionis"]];
  const orang = (k) => (KT.peran[k] || []).map((id) => KT.staf.find((s) => s.id === id)).filter(Boolean);
  const kartu = (k) => { const p = _ktPeran(k), o = orang(k); return `<div class="km-org-k" style="--w:${p.warna}"><small>${p.ikon} ${_ktE(p.nama)}</small>${o.length ? o.map((s) => `<button onclick="ktKartu('${s.id}')">${_ktE(_ktGelar(s))} ${_ktE(s.nama)}</button>`).join("") : '<i>belum ditetapkan</i>'}</div>`; };
  let isi = "";
  if (tab === "struktur") isi = `<div class="km-org">${kartu("yayasan")}<div class="km-org-garis"></div>${kartu("kepala")}<div class="km-org-garis"></div>
      <div class="km-org-baris">${["sekretaris", "bendahara", "dapodik"].map(kartu).join("")}</div><div class="km-org-garis"></div>
      <div class="km-org-baris">${["A", "Pa", "Pi"].map((r) => `<div class="km-org-kol">${kartu("peny-" + r)}${kartu("admin-" + r)}</div>`).join("")}</div><div class="km-org-garis"></div>
      <div class="km-org-baris">${["it", "desain"].map(kartu).join("")}</div></div>`;
  if (tab === "staf") {
    let online = {}; try { const st = KT_HADIR.kanal ? KT_HADIR.kanal.presenceState() : {}; Object.keys(st).forEach((k) => (online[k] = 1)); } catch (e) {}
    isi = `<div class="km-orang">${KT.staf.slice().sort((a, b) => String(a.nama).localeCompare(String(b.nama))).map((s) => { const t = KT.tokoh[s.id], m = (t && t.userData.meja) || {}; return `<button onclick="ktKartu('${s.id}')">${typeof _ktFoto === "function" ? _ktFoto(s, 30) : ""}<span><b>${online[s.id] ? '<i class="km-on"></i>' : ""}${_ktE(_ktGelar(s))} ${_ktE(s.namaLengkap || s.nama)}</b><small>${_ktE(s.peran.map((k) => _ktPeran(k).nama).join(" · "))} · ${_ktE((KM_RUANG[kmRuangDi(m.x || 0, m.z || 0)] || {}).nama || "Kantor Yayasan")}</small></span></button>`; }).join("")}</div>`;
  }
  if (tab === "rapat") isi = KT.sesi && KT.sesi.aktif ? `<p><b>Sedang berlangsung:</b> ${_ktE(KT.sesi.judul || "Rapat Koordinasi")}</p><p>Peserta hadir: ${[...(KT.sesi.ids || [])].map((id) => { const s = KT.staf.find((x) => x.id === id); return s ? _ktE(_ktGelar(s) + " " + s.nama) : ""; }).filter(Boolean).join(", ") || "-"}</p><button class="kt-salin" onclick="kmRuang('rapat')">Lihat Ruang Rapat</button>` : `<p>Ruang rapat sedang kosong.</p><p class="kt-ket">Rapat dimulai lewat ketuk Kepala PKBM → pilih topik rapat.</p>`;
  if (tab === "aktivitas") {
    const r = Object.values(KT.riwayat || {}).filter((x) => x && x.t).sort((a, b) => b.t - a.t).slice(0, 12);
    isi = r.length ? `<ul class="kt-ul">${r.map((x) => `<li><b>${new Date(x.t).toLocaleString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</b> — ${_ktE(String(x.teks || "").slice(0, 120))}</li>`).join("")}</ul>` : `<p class="kt-ket">Belum ada catatan aktivitas kantor. Kabar terbaru tiap jenjang ada di tombol 📰 Kabar.</p>`;
  }
  if (tab === "tamu") isi = `<div class="km-demo">DEMO</div><p>Resepsionis digital untuk mencatat tamu (nama, keperluan, bertemu siapa, jam datang/pulang) <b>belum terhubung ke data</b>.</p><p class="kt-ket">Bila diperlukan, fitur Buku Tamu bisa dibangun dan dicatat di Arsip PKBM.</p>`;
  _ktPanel(`<div class="km-info"><small>DIREKTORI KANTOR</small><h3>AL-UMM Virtual Headquarters</h3><div class="kt-tab">${tabs.map(([k, n]) => `<button class="${k === tab ? "on" : ""}" onclick="kmDirektori('${k}')">${n}</button>`).join("")}</div>${isi}</div>`);
}

// ── performa: gabungkan semua benda diam yang bahannya sama menjadi satu objek (ribuan → puluhan panggilan gambar) ──
function _kmGabung() {
  const sc = KT.scene; sc.updateMatrixWorld(true);
  const kecuali = new Set();
  const tandai = (o) => o && o.traverse((c) => kecuali.add(c));
  Object.values(KT.tokoh || {}).forEach(tandai); (KT.rak || []).forEach(tandai); tandai(KT.pintu); tandai(KT.mobil); (KT.gelas || []).forEach(tandai);
  Object.values(KT.layar || {}).forEach((l) => kecuali.add(l));
  const kelompok = new Map(), buang = [];
  sc.traverse((o) => {
    if (!o.isMesh || kecuali.has(o) || Array.isArray(o.material) || o.userData.jangan_gabung) return;
    const m = o.material; if (m.isMeshBasicMaterial || (m.map && m.map.isCanvasTexture && !m.isMeshStandardMaterial)) return;
    if (!o.geometry || !o.geometry.attributes || !o.geometry.attributes.position) return;
    const k = m.uuid + (o.castShadow ? "s" : "") + (o.receiveShadow ? "r" : "");
    if (!kelompok.has(k)) kelompok.set(k, { m, cast: o.castShadow, recv: o.receiveShadow, g: [] });
    let g = o.geometry.index ? o.geometry.toNonIndexed() : o.geometry.clone(); g.applyMatrix4(o.matrixWorld);
    if (!g.attributes.uv) g.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(g.attributes.position.count * 2), 2));
    kelompok.get(k).g.push(g); buang.push(o);
  });
  let dibuat = 0;
  kelompok.forEach(({ m, cast, recv, g }) => {
    if (g.length < 2) { g.forEach((x) => x.dispose()); return; }
    const n = g.reduce((a, x) => a + x.attributes.position.count, 0);
    const pos = new Float32Array(n * 3), nor = new Float32Array(n * 3), uv = new Float32Array(n * 2); let o3 = 0, o2 = 0;
    g.forEach((x) => { pos.set(x.attributes.position.array, o3); if (x.attributes.normal) nor.set(x.attributes.normal.array, o3); uv.set(x.attributes.uv.array, o2); o3 += x.attributes.position.count * 3; o2 += x.attributes.position.count * 2; x.dispose(); });
    const geo = new THREE.BufferGeometry(); geo.setAttribute("position", new THREE.BufferAttribute(pos, 3)); geo.setAttribute("normal", new THREE.BufferAttribute(nor, 3)); geo.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
    const mesh = new THREE.Mesh(geo, m); mesh.castShadow = cast; mesh.receiveShadow = recv; mesh.userData.gabungan = true; sc.add(mesh); dibuat++;
    g.__dipakai = true;
  });
  // hanya hapus benda asli yang kelompoknya benar-benar digabung
  const digabung = new Set(); kelompok.forEach((v) => { if (v.g.length >= 2) v.g.forEach(() => {}); });
  buang.forEach((o) => { const k = o.material.uuid + (o.castShadow ? "s" : "") + (o.receiveShadow ? "r" : ""); if (kelompok.get(k).g.length >= 2 && o.parent) o.parent.remove(o); });
  return dibuat;
}

// isi lemari arsip (puluhan map) digabung per bahan di dalam kelompok lemarinya — lemari tetap bisa diketuk
function _kmGabungRak() {
  (KT.rak || []).forEach((grup) => {
    const per = new Map();
    grup.children.slice().forEach((c) => { if (!c.isMesh || Array.isArray(c.material)) return; c.updateMatrix(); const k = c.material.uuid; if (!per.has(k)) per.set(k, []); per.get(k).push(c); });
    per.forEach((daftar, k) => {
      if (daftar.length < 2) return;
      const gs = daftar.map((c) => { const g = c.geometry.index ? c.geometry.toNonIndexed() : c.geometry.clone(); g.applyMatrix4(c.matrix); if (!g.attributes.uv) g.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(g.attributes.position.count * 2), 2)); return g; });
      const n = gs.reduce((a, g) => a + g.attributes.position.count, 0), pos = new Float32Array(n * 3), nor = new Float32Array(n * 3), uv = new Float32Array(n * 2); let a3 = 0, a2 = 0;
      gs.forEach((g) => { pos.set(g.attributes.position.array, a3); if (g.attributes.normal) nor.set(g.attributes.normal.array, a3); uv.set(g.attributes.uv.array, a2); a3 += g.attributes.position.count * 3; a2 += g.attributes.position.count * 2; g.dispose(); });
      const geo = new THREE.BufferGeometry(); geo.setAttribute("position", new THREE.BufferAttribute(pos, 3)); geo.setAttribute("normal", new THREE.BufferAttribute(nor, 3)); geo.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
      const m = new THREE.Mesh(geo, daftar[0].material); m.castShadow = true; m.receiveShadow = true; m.userData.rak = grup.userData.rak; grup.add(m);
      daftar.forEach((c) => grup.remove(c));
    });
  });
}

// ── pasang setelah kantor dibangun ──
(function () {
  if (typeof _ktBangun !== "function") return;
  const a = _ktBangun;
  _ktBangun = async function () {
    await a.apply(this, arguments);
    try {
      const r = KT.renderer; r.outputEncoding = THREE.sRGBEncoding; r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = 1.05;
      KT.scene.traverse((o) => { if (o.isHemisphereLight) o.intensity = 0.55; if (o.isDirectionalLight) o.intensity = 1.05; if (o.isPointLight) { o.intensity = 0.45; o.distance = 12; } });
      _kmPerlengkapan(); _kmUbahBahan(); KM.digabung = _kmGabung(); _kmGabungRak(); _kmTerapkanKualitas();
      Object.keys(KT.layar || {}).forEach((id) => { const l = KT.layar[id]; if (l && l.userData.status) kdLayar(id, l.userData.status); });
      _kmUI(); _kmPembukaan();
    } catch (e) { console.warn("Kantor mewah:", e); }
  };
})();
function _kmUI() {
  const lay = document.getElementById("kt-layar"), atas = document.querySelector("#kantor-ai .kt-alat"), judul = document.querySelector("#kantor-ai .kt-judul");
  if (judul) { const logo = typeof urlLogoSekolah === "function" ? urlLogoSekolah() : ""; judul.innerHTML = `${logo ? `<img class="km-logo" src="${_ktE(logo)}" alt="">` : ""}<div><b>AL-UMM VIRTUAL HEADQUARTERS</b><small>PKBM Al-Umm Barabai · Kantor Maya</small></div>`; judul.classList.add("km-judul"); }
  if (atas && !atas.querySelector("#km-auto")) atas.insertAdjacentHTML("afterbegin", `<button onclick="kmBeranda()" title="Kembali ke tampilan seluruh kantor">⌂<span class="kt-sembunyi-hp"> Home</span></button><button id="km-auto" onclick="kmAuto()" title="Putar otomatis 360°">AUTO</button><button onclick="kmLayarPenuh()" title="Layar penuh">⛶</button><button onclick="kmDirektori()" title="Direktori & struktur organisasi">🏢<span class="kt-sembunyi-hp"> Direktori</span></button>`);
  if (lay && !lay.querySelector(".km-ruang")) {
    lay.insertAdjacentHTML("beforeend", `<div class="km-ruang">${KM_URUT.map((k) => `<button data-r="${k}" class="${k === "semua" ? "on" : ""}" onclick="kmRuang('${k}')">${k === "semua" ? "Overview" : _ktE(KM_RUANG[k].nama.replace("Ruang ", ""))}</button>`).join("")}</div>
      <button class="km-kualitas" id="km-kualitas" onclick="kmGantiKualitas()" title="Atur kualitas grafis">Grafis: ${{ tinggi: "Tinggi", sedang: "Sedang", rendah: "Rendah" }[KM.kualitas]}</button><div class="km-tip" id="km-tip" hidden></div>`);
    const kan = KT.renderer.domElement;
    kan.addEventListener("pointermove", (e) => { KM.hoverPos = { x: e.clientX, y: e.clientY }; });
    kan.addEventListener("pointerleave", () => { KM.hoverPos = null; _kmSorot(KM.hover, false); KM.hover = null; const t = document.getElementById("km-tip"); if (t) t.hidden = true; });
    // geser kamera: klik kanan / Shift + seret (sebelum pengendali putar)
    let geser = null;
    lay.addEventListener("pointerdown", (e) => { if (e.target !== kan || !(e.button === 2 || e.shiftKey)) return; e.stopPropagation(); geser = { x: e.clientX, y: e.clientY }; KM.orbit = false; }, true);
    window.addEventListener("pointermove", (e) => { if (!geser || !KT.buka) return; const dx = e.clientX - geser.x, dy = e.clientY - geser.y; geser = { x: e.clientX, y: e.clientY }; const s = KT.sudut, k = 0.035 / (KT.zoom || 1); const f = KT.fokus || { x: 0, z: 2.5, zoom: KT.zoom }; KT.fokus = { x: f.x - (Math.cos(s) * dx + Math.sin(s) * dy) * k, z: f.z - (-Math.sin(s) * dx + Math.cos(s) * dy) * k, zoom: f.zoom }; });
    window.addEventListener("pointerup", () => { geser = null; });
    kan.addEventListener("contextmenu", (e) => e.preventDefault());
  }
}

// ============================================================
//  🏢 KANTOR PKBM — dunia 3D: denah, perabot, tokoh, jalan pintar (A*), pintu, TV, minuman, keliling
//  Denah (x kiri→kanan, z belakang→depan):
//    Ruang Ustadz   x[-15,-5]        | Ruang Kepala PKBM x[-5,5] z[-8,-2] (dinding kaca, pintu)
//    Ruang Ustadzah x[5,15]          | Ruang Rapat       x[-5,5] z[-2,8]  (logo, TV, minuman)
//  Semua benda & dinding ditandai di peta jalan; tokoh berjalan memutari benda & saling memberi jalan.
// ============================================================
const KD = { X0: -15, X1: 15, Z0: -8, Z1: 8, S: 0.5 };
KD.NX = Math.round((KD.X1 - KD.X0) / KD.S); KD.NZ = Math.round((KD.Z1 - KD.Z0) / KD.S);
const KT_KULIT = 0xe9c6a0;

// ── peta jalan ──
function _kdPetaBaru() { KD.blok = new Uint8Array(KD.NX * KD.NZ); }
const _kdSel = (x, z) => [Math.floor((x - KD.X0) / KD.S), Math.floor((z - KD.Z0) / KD.S)];
const _kdPusat = (i, j) => ({ x: KD.X0 + (i + 0.5) * KD.S, z: KD.Z0 + (j + 0.5) * KD.S });
const _kdDalam = (i, j) => i >= 0 && j >= 0 && i < KD.NX && j < KD.NZ;
const _kdTerblok = (i, j) => !_kdDalam(i, j) || KD.blok[j * KD.NX + i] === 1;
function _kdBlokir(cx, cz, w, d, jarak = 0.22) {
  const [i0, j0] = _kdSel(cx - w / 2 - jarak, cz - d / 2 - jarak), [i1, j1] = _kdSel(cx + w / 2 + jarak - 1e-6, cz + d / 2 + jarak - 1e-6);
  for (let j = Math.max(0, j0); j <= Math.min(KD.NZ - 1, j1); j++) for (let i = Math.max(0, i0); i <= Math.min(KD.NX - 1, i1); i++) KD.blok[j * KD.NX + i] = 1;
}
function _kdCari(dari, ke) {
  const [si, sj] = _kdSel(dari.x, dari.z), [gi, gj] = _kdSel(ke.x, ke.z), N = KD.NX * KD.NZ;
  // petak di sekitar kursi asal & kursi tujuan boleh dilewati (untuk duduk / berdiri dari kursi)
  const dekat = (i, j, t) => { const c = _kdPusat(i, j); return Math.hypot(c.x - t.x, c.z - t.z) < 0.62; };
  const bebas = (i, j) => _kdDalam(i, j) && ((i === gi && j === gj) || (i === si && j === sj) || !_kdTerblok(i, j) || dekat(i, j, ke) || dekat(i, j, dari));
  const g = new Float32Array(N).fill(Infinity), asal = new Int32Array(N).fill(-1), tutup = new Uint8Array(N);
  const h = (i, j) => { const dx = Math.abs(i - gi), dz = Math.abs(j - gj); return Math.max(dx, dz) + 0.414 * Math.min(dx, dz); };
  // antrean prioritas (heap) supaya jalur jauh tetap ditemukan
  const heap = []; const dorong = (f, id) => { heap.push([f, id]); let k = heap.length - 1; while (k > 0) { const p = (k - 1) >> 1; if (heap[p][0] <= heap[k][0]) break; [heap[p], heap[k]] = [heap[k], heap[p]]; k = p; } };
  const ambil = () => { const top = heap[0], akhir = heap.pop(); if (heap.length) { heap[0] = akhir; let k = 0; for (;;) { const l = 2 * k + 1, r = l + 1; let m = k; if (l < heap.length && heap[l][0] < heap[m][0]) m = l; if (r < heap.length && heap[r][0] < heap[m][0]) m = r; if (m === k) break; [heap[m], heap[k]] = [heap[k], heap[m]]; k = m; } } return top; };
  g[sj * KD.NX + si] = 0; dorong(h(si, sj), sj * KD.NX + si);
  let ketemu = false, putaran = 0;
  while (heap.length && putaran++ < 60000) {
    const id = ambil()[1], i = id % KD.NX, j = Math.floor(id / KD.NX);
    if (tutup[id]) continue; tutup[id] = 1;
    if (i === gi && j === gj) { ketemu = true; break; }
    for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) {
      if (!di && !dj) continue; const ni = i + di, nj = j + dj;
      if (!_kdDalam(ni, nj) || !bebas(ni, nj)) continue;
      if (di && dj && (!bebas(i + di, j) || !bebas(i, j + dj))) continue; // jangan memotong sudut benda
      const nid = nj * KD.NX + ni, ng = g[id] + (di && dj ? 1.414 : 1);
      if (ng < g[nid]) { g[nid] = ng; asal[nid] = id; dorong(ng + h(ni, nj), nid); }
    }
  }
  if (!ketemu) return [ke];
  const sel = []; for (let id = gj * KD.NX + gi; id !== -1; id = asal[id]) sel.unshift([id % KD.NX, Math.floor(id / KD.NX)]);
  // rapikan jalur: lompati titik yang masih terlihat lurus tanpa terhalang
  const lihat = (a, b) => { const p = _kdPusat(...a), q = _kdPusat(...b), n = Math.ceil(Math.hypot(q.x - p.x, q.z - p.z) / 0.2); for (let k = 1; k < n; k++) { const [i, j] = _kdSel(p.x + ((q.x - p.x) * k) / n, p.z + ((q.z - p.z) * k) / n); if (!bebas(i, j)) return false; } return true; };
  const titik = []; let a = 0;
  while (a < sel.length - 1) { let b = sel.length - 1; while (b > a + 1 && !lihat(sel[a], sel[b])) b--; titik.push(_kdPusat(...sel[b])); a = b; }
  if (titik.length) titik[titik.length - 1] = { x: ke.x, z: ke.z }; else titik.push({ x: ke.x, z: ke.z });
  return titik;
}

// ── benda ──
function _ktKotak(w, h, d, warna, x = 0, y = 0, z = 0, opsi = {}) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshLambertMaterial({ color: warna, ...opsi }));
  m.position.set(x, y, z); m.castShadow = !opsi.transparent; m.receiveShadow = true; return m;
}
function _kdTaruh(m, blok) { KT.scene.add(m); if (blok) _kdBlokir(m.position.x, m.position.z, blok[0], blok[1]); return m; }
function _ktTeksKanvas(teks, { lebar = 512, tinggi = 128, latar = "#14532d", warna = "#fef3c7", ukuran = 54, sub = "", bingkai = true } = {}) {
  const c = document.createElement("canvas"); c.width = lebar; c.height = tinggi; const x = c.getContext("2d");
  if (latar) { x.fillStyle = latar; x.fillRect(0, 0, lebar, tinggi); }
  if (bingkai) { x.strokeStyle = "rgba(234,179,8,.8)"; x.lineWidth = 6; x.strokeRect(8, 8, lebar - 16, tinggi - 16); }
  x.fillStyle = warna; x.textAlign = "center"; x.textBaseline = "middle"; x.font = `800 ${ukuran}px Plus Jakarta Sans, system-ui, sans-serif`;
  x.fillText(teks, lebar / 2, sub ? tinggi * 0.4 : tinggi / 2);
  if (sub) { x.font = `600 ${Math.round(ukuran * 0.45)}px system-ui, sans-serif`; x.globalAlpha = 0.85; x.fillText(sub, lebar / 2, tinggi * 0.74); }
  const t = new THREE.CanvasTexture(c); t.anisotropy = 4; return t;
}
function _kdPapan(teks, sub, x, y, z, lebar, latar, rotY = 0) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(lebar, lebar / 4), new THREE.MeshBasicMaterial({ map: _ktTeksKanvas(teks, { latar, sub }) }));
  m.position.set(x, y, z); m.rotation.y = rotY; KT.scene.add(m); return m;
}
// logo PKBM (bisa gagal bila gambar tidak mengizinkan dibaca — kantor tetap jalan tanpa logo)
function _kdMuatLogo() {
  return new Promise((res) => {
    const url = typeof urlLogoSekolah === "function" ? urlLogoSekolah() : ""; if (!url) return res(null);
    const img = new Image(); img.crossOrigin = "anonymous"; img.onload = () => res(img); img.onerror = () => res(null); img.src = url;
    setTimeout(() => res(null), 6000);
  });
}
function _kdKanvasLogo(img, ukuran = 512, nama = true) {
  const c = document.createElement("canvas"); c.width = c.height = ukuran; const x = c.getContext("2d");
  x.fillStyle = "#fdf6e3"; x.beginPath(); x.arc(ukuran / 2, ukuran / 2, ukuran / 2 - 4, 0, Math.PI * 2); x.fill();
  x.strokeStyle = "#c9a227"; x.lineWidth = ukuran * 0.035; x.stroke();
  if (img) { const s = ukuran * (nama ? 0.5 : 0.7); try { x.drawImage(img, (ukuran - s) / 2, nama ? ukuran * 0.14 : (ukuran - s) / 2, s, s); } catch (e) {} }
  if (nama) { x.fillStyle = "#14532d"; x.textAlign = "center"; x.font = `800 ${ukuran * 0.075}px Plus Jakarta Sans, system-ui, sans-serif`; x.fillText("PKBM AL-UMM", ukuran / 2, ukuran * 0.76); x.font = `700 ${ukuran * 0.06}px system-ui, sans-serif`; x.fillText("BARABAI", ukuran / 2, ukuran * 0.85); }
  return c;
}

// ── tokoh tanpa wajah ──
function _ktTokohBaru(jk) {
  const g = new THREE.Group(), badan = new THREE.Group(); g.add(badan);
  const kaki = [];
  if (jk === "P") {
    const gamis = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.36, 1.05, 10), new THREE.MeshLambertMaterial({ color: 0x15151a }));
    gamis.position.y = 0.53; gamis.castShadow = true; badan.add(gamis);
    const jilbab = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.34, 0.42, 10), new THREE.MeshLambertMaterial({ color: 0x0d0d10 }));
    jilbab.position.y = 1.02; jilbab.castShadow = true; badan.add(jilbab);
    badan.add(_ktKotak(0.34, 0.36, 0.34, 0x0d0d10, 0, 1.32, 0)); // bercadar
    [-0.24, 0.24].forEach((x) => { const t = _ktKotak(0.12, 0.5, 0.14, 0x15151a, x, 0.82, 0.02); t.rotation.z = x < 0 ? 0.12 : -0.12; badan.add(t); });
  } else {
    [-0.1, 0.1].forEach((x) => { const k = new THREE.Group(); k.position.set(x, 0.5, 0); k.add(_ktKotak(0.16, 0.5, 0.18, 0x334155, 0, -0.25, 0)); badan.add(k); kaki.push(k); });
    badan.add(_ktKotak(0.5, 0.58, 0.3, 0xf8fafc, 0, 0.8, 0));
    [-0.31, 0.31].forEach((x) => badan.add(_ktKotak(0.12, 0.5, 0.16, 0xf1f5f9, x, 0.82, 0)));
    badan.add(_ktKotak(0.34, 0.36, 0.34, KT_KULIT, 0, 1.28, 0));
    badan.add(_ktKotak(0.36, 0.12, 0.36, 0x111827, 0, 1.5, 0)); // peci
  }
  g.userData = { kaki, badan, jk };
  g.scale.setScalar(1.25);
  return g;
}
function _ktDuduk(t, duduk) {
  const u = t.userData; u.duduk = duduk;
  if (u.jk === "P") u.badan.position.y = duduk ? -0.3 : 0;
  else { u.badan.position.y = duduk ? -0.28 : 0; u.kaki.forEach((k) => (k.rotation.x = duduk ? -Math.PI / 2 : 0)); }
}
function _kdKursi(x, z, warna = 0x334155, rotY = 0, tinggiSandaran = 0.5) {
  const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = rotY;
  g.add(_ktKotak(0.55, 0.12, 0.55, warna, 0, 0.42, 0)); g.add(_ktKotak(0.08, 0.4, 0.08, 0x1f2937, 0, 0.2, 0));
  g.add(_ktKotak(0.55, tinggiSandaran, 0.08, warna, 0, 0.42 + tinggiSandaran / 2, -0.26));
  KT.scene.add(g); _kdBlokir(x, z, 0.5, 0.5, 0.12); return g;
}

// ── bangun kantor ──
async function _ktBangun() {
  _kdPetaBaru();
  const layar = document.getElementById("kt-layar");
  const sc = (KT.scene = new THREE.Scene()); sc.background = new THREE.Color(0xdbe7f3);
  const r = (KT.renderer = new THREE.WebGLRenderer({ antialias: true })); r.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFSoftShadowMap; layar.prepend(r.domElement);
  KT.kamera = new THREE.OrthographicCamera(-10, 10, 10, -10, 0.1, 200);
  sc.add(new THREE.HemisphereLight(0xffffff, 0x8a9bb0, 0.6));
  const mt = new THREE.DirectionalLight(0xfff4e0, 0.6); mt.position.set(8, 18, 12); mt.castShadow = true; mt.shadow.mapSize.set(2048, 2048);
  Object.assign(mt.shadow.camera, { left: -18, right: 18, top: 14, bottom: -14 }); sc.add(mt);
  const lampuRapat = new THREE.PointLight(0xffe2a8, 0.35, 12); lampuRapat.position.set(0, 4, 3.2); sc.add(lampuRapat);
  const logo = await _kdMuatLogo(); KT.logoImg = logo;

  // lantai
  sc.add(_ktKotak(10, 0.2, 16, 0xc99a63, -10, -0.1, 0));   // Ruang Ustadz
  sc.add(_ktKotak(10, 0.2, 16, 0xdcb7c4, 10, -0.1, 0));    // Ruang Ustadzah
  sc.add(_ktKotak(10, 0.2, 6, 0x7a4a2e, 0, -0.1, -5));     // Ruang Kepala — parket
  sc.add(_ktKotak(10, 0.2, 10, 0x173b30, 0, -0.1, 3));     // Ruang Rapat — karpet hijau tua
  sc.add(_ktKotak(9.2, 0.02, 9.2, 0x1e4d3f, 0, 0.01, 3.1)); [[0, -1.4, 9.2, 0.08], [0, 7.6, 9.2, 0.08], [-4.6, 3.1, 0.08, 9.2], [4.6, 3.1, 0.08, 9.2]].forEach(([x, z, w, d]) => sc.add(_ktKotak(w, 0.03, d, 0xc9a227, x, 0.02, z))); // bingkai emas
  sc.add(_ktKotak(4.4, 0.02, 2.6, 0x7f1d1d, 0, 0.01, -4.6)); // karpet kepala

  // dinding luar & sekat
  const tembok = 0xe6dccb, kaca = { transparent: true, opacity: 0.22 };
  _kdTaruh(_ktKotak(30.4, 3, 0.25, tembok, 0, 1.5, -8.1), [30.4, 0.3]);
  _kdTaruh(_ktKotak(0.25, 3, 16.2, tembok, -15.1, 1.5, 0), [0.3, 16.2]);
  _kdTaruh(_ktKotak(0.25, 3, 16.2, tembok, 15.1, 1.5, 0), [0.3, 16.2]);
  // sekat x = ±5 : pintu di z 5.4..7.2 (dekat depan)
  [-5, 5].forEach((x) => {
    [[-8, 5.4], [7.2, 8]].forEach(([a, b]) => {
      const p = (a + b) / 2, l = b - a;
      _kdTaruh(_ktKotak(0.18, 1.1, l, 0xcdbfa8, x, 0.55, p), [0.25, l]);
      sc.add(_ktKotak(0.1, 1.3, l, 0xbfe3f2, x, 1.75, p, kaca)); sc.add(_ktKotak(0.22, 0.06, l, 0x8b6b43, x, 2.42, p));
    });
  });
  // Ruang Kepala: dinding kaca z = -2 dengan pintu x -0.9..0.9
  [[-5, -0.9], [0.9, 5]].forEach(([a, b]) => {
    const p = (a + b) / 2, l = b - a;
    _kdTaruh(_ktKotak(l, 1.1, 0.18, 0xcdbfa8, p, 0.55, -2), [l, 0.25]);
    sc.add(_ktKotak(l, 1.3, 0.1, 0xbfe3f2, p, 1.75, -2, kaca)); sc.add(_ktKotak(l, 0.06, 0.22, 0x8b6b43, p, 2.42, -2));
  });
  const engsel = new THREE.Group(); engsel.position.set(-0.9, 0, -2); const daun = _ktKotak(1.8, 2.3, 0.08, 0x5b3a1e, 0.9, 1.15, 0); engsel.add(daun);
  engsel.add(_ktKotak(0.1, 0.1, 0.12, 0xc9a227, 1.6, 1.1, 0.06)); sc.add(engsel); KT.pintu = engsel;

  // papan nama
  _kdPapan("Ruang Ustadz", "Petugas Ikhwan", -10, 2.25, -7.95, 4.2, "#1e3a8a");
  _kdPapan("Ruang Ustadzah", "Petugas Akhawat", 10, 2.25, -7.95, 4.2, "#831843");
  _kdPapan("Ruang Kepala PKBM", "", 0, 2.25, -7.95, 4.4, "#7c2d12");
  _kdPapan("Ruang Rapat", "PKBM Al-Umm Barabai", 3, 2.0, -1.88, 3.2, "#14532d");

  // ── Ruang Kepala PKBM ──
  _kdTaruh(_ktKotak(2.8, 0.12, 1.1, 0x3f2a1a, 0, 0.8, -5.6), [2.8, 1.1]); sc.add(_ktKotak(2.86, 0.04, 1.16, 0xc9a227, 0, 0.79, -5.6));
  sc.add(_ktKotak(2.6, 0.75, 0.1, 0x2d1d10, 0, 0.38, -6.1));
  sc.add(_ktKotak(0.6, 0.04, 0.4, 0x1f2937, -0.5, 0.9, -5.7)); sc.add(_ktKotak(0.56, 0.38, 0.04, 0x0f172a, -0.5, 1.1, -5.88));
  sc.add(_ktKotak(0.7, 0.14, 0.12, 0xc9a227, 0.7, 0.95, -5.2)); // papan nama meja
  KT.kursiKepala = { x: 0, z: -6.55, hadap: 0 }; _kdKursi(0, -6.55, 0x111827, 0, 0.85);
  KT.kursiTamu = [{ x: -0.8, z: -4.35, hadap: Math.PI }, { x: 0.8, z: -4.35, hadap: Math.PI }];
  KT.kursiTamu.forEach((k) => _kdKursi(k.x, k.z, 0x7f1d1d, Math.PI, 0.45));
  _kdTaruh(_ktKotak(2.2, 2, 0.45, 0x5b3a1e, -3.2, 1, -7.65), [2.2, 0.5]); for (let i = 0; i < 4; i++) sc.add(_ktKotak(2.0, 0.05, 0.4, 0x3f2a1a, -3.2, 0.35 + i * 0.5, -7.6));
  [[0xb91c1c, 2.05], [0xf8fafc, 1.75]].forEach(([w, y]) => sc.add(_ktKotak(0.02, 0.3, 0.55, w, 4.1, y, -7.15)));
  _kdTaruh(_ktKotak(0.06, 2.2, 0.06, 0xd4d4d8, 4.1, 1.1, -7.4), [0.4, 0.4]);
  _kdTaruh(_ktKotak(0.8, 0.45, 2.0, 0x7f1d1d, 4.3, 0.25, -4.3), [0.8, 2.0]); sc.add(_ktKotak(0.2, 0.5, 2.0, 0x7f1d1d, 4.6, 0.6, -4.3));
  if (logo) { const f = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 1.1), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(_kdKanvasLogo(logo, 256, false)), transparent: true })); f.position.set(0, 2.0, -7.95); sc.add(f); }

  // ── Ruang Rapat (elite) ──
  _kdTaruh(_ktKotak(5.6, 0.14, 2.0, 0x4a2c17, 0, 0.82, 3.2), [5.6, 2.0]); sc.add(_ktKotak(5.7, 0.05, 2.1, 0xc9a227, 0, 0.83, 3.2)); // tepi emas
  [[-2.5, 2.4], [2.5, 2.4], [-2.5, 4.0], [2.5, 4.0]].forEach(([x, z]) => sc.add(_ktKotak(0.14, 0.78, 0.14, 0x2d1a0d, x, 0.39, z)));
  const piring = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.72, 0.03, 40), new THREE.MeshLambertMaterial({ map: new THREE.CanvasTexture(_kdKanvasLogo(logo, 512, true)) }));
  piring.position.set(0, 0.93, 3.2); piring.rotation.y = -Math.PI / 2; sc.add(piring); // logo + nama PKBM di tengah meja
  const namaMeja = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 0.3), new THREE.MeshBasicMaterial({ map: _ktTeksKanvas("PKBM AL-UMM BARABAI", { latar: null, warna: "#fde68a", ukuran: 58, bingkai: false }), transparent: true }));
  namaMeja.rotation.x = -Math.PI / 2; namaMeja.position.set(0, 0.92, 4.05); sc.add(namaMeja);
  KT.kursiRapat = [{ x: -3.5, z: 3.2, hadap: Math.PI / 2, pimpinan: true }];
  [-2.2, -1.1, 0, 1.1, 2.2].forEach((x) => { KT.kursiRapat.push({ x, z: 1.6, hadap: 0 }); KT.kursiRapat.push({ x, z: 4.8, hadap: Math.PI }); });
  KT.kursiRapat.push({ x: 3.5, z: 3.2, hadap: -Math.PI / 2 });
  KT.kursiRapat.forEach((k) => _kdKursi(k.x, k.z, 0x1f2937, k.hadap, 0.8));
  // TV di dinding kaca (kiri pintu)
  KT.tvKanvas = document.createElement("canvas"); KT.tvKanvas.width = 640; KT.tvKanvas.height = 360;
  KT.tvTekstur = new THREE.CanvasTexture(KT.tvKanvas);
  sc.add(_ktKotak(2.9, 1.7, 0.1, 0x0b0b0f, -3, 1.75, -1.86));
  const layarTv = new THREE.Mesh(new THREE.PlaneGeometry(2.7, 1.52), new THREE.MeshBasicMaterial({ map: KT.tvTekstur })); layarTv.position.set(-3, 1.75, -1.8); sc.add(layarTv);
  KT.tv = { mode: "diam", judul: "", data: [], ticker: "", t0: 0 }; _kdTvGambar(0);
  // dispenser, tanaman, jam
  _kdTaruh(_ktKotak(0.5, 1.1, 0.5, 0xe2e8f0, 4.4, 0.55, 7.3), [0.5, 0.5]); sc.add(_ktKotak(0.4, 0.45, 0.4, 0x7dd3fc, 4.4, 1.32, 7.3, { transparent: true, opacity: 0.7 }));
  [[-4.4, 7.4], [-4.4, -1.4], [4.4, -1.4], [-14.4, -7.4], [14.4, -7.4], [-4.4, -7.4], [-14.4, 7.4], [14.4, 7.4]].forEach(([x, z]) => {
    _kdTaruh(_ktKotak(0.45, 0.45, 0.45, 0xa16207, x, 0.23, z), [0.45, 0.45]);
    const d = new THREE.Mesh(new THREE.SphereGeometry(0.42, 10, 8), new THREE.MeshLambertMaterial({ color: 0x16a34a })); d.position.set(x, 0.8, z); d.castShadow = true; sc.add(d);
  });
  // rak arsip di ruang ustadz & ustadzah
  [-10, 10].forEach((x) => { _kdTaruh(_ktKotak(2.6, 1.8, 0.45, 0x8b5a2b, x, 0.9, -7.65), [2.6, 0.5]); for (let i = 0; i < 3; i++) sc.add(_ktKotak(2.4, 0.06, 0.4, 0x6b4423, x, 0.4 + i * 0.5, -7.6)); });

  // ── meja kerja tiap petugas (kepala di ruangnya sendiri) ──
  const kepalaId = (KT.peran.kepala || [])[0];
  const posisi = (xPusat) => { const p = []; [-5.6, -2.4, 0.8, 4.0].forEach((z) => [-2.3, 2.3].forEach((dx) => p.push({ x: xPusat + dx, z }))); [6.7].forEach((z) => p.push({ x: xPusat - 2.3, z })); return p; };
  const pasang = (s, x, z) => {
    _kdTaruh(_ktKotak(1.9, 0.1, 0.9, 0xc08a4f, x, 0.76, z), [1.9, 0.9]); sc.add(_ktKotak(1.8, 0.7, 0.08, 0xa47148, x, 0.38, z - 0.38));
    sc.add(_ktKotak(0.55, 0.06, 0.38, 0x1f2937, x - 0.3, 0.83, z - 0.1)); sc.add(_ktKotak(0.5, 0.36, 0.04, 0x0f172a, x - 0.3, 1.05, z - 0.26));
    sc.add(_ktKotak(0.3, 0.04, 0.22, 0xfefce8, x + 0.45, 0.83, z));
    const kursi = { x, z: z + 0.85, hadap: Math.PI }; _kdKursi(kursi.x, kursi.z, 0x334155, Math.PI, 0.5);
    _kdTokohDiKursi(s, kursi);
  };
  const ikhwan = KT.staf.filter((s) => s.jk !== "P" && s.id !== kepalaId), akhawat = KT.staf.filter((s) => s.jk === "P" && s.id !== kepalaId);
  const pL = posisi(-10), pP = posisi(10);
  ikhwan.forEach((s, i) => pL[i] && pasang(s, pL[i].x, pL[i].z));
  akhawat.forEach((s, i) => pP[i] && pasang(s, pP[i].x, pP[i].z));
  const kp = KT.staf.find((s) => s.id === kepalaId); if (kp) _kdTokohDiKursi(kp, KT.kursiKepala);

  // label & gelembung
  const ham = document.getElementById("kt-hamparan"); ham.innerHTML = "";
  KT.staf.forEach((s) => {
    if (!KT.tokoh[s.id]) return;
    const p = _ktPeran(s.peran[0]);
    const d = document.createElement("button"); d.className = "kt-label"; d.style.setProperty("--w", p.warna);
    d.innerHTML = `<b>${_ktE(_ktPeranPendek(s.peran[0]))}${s.peran.length > 1 ? ` <i>+${s.peran.length - 1}</i>` : ""}</b><small>${_ktE(s.nama.split(" ").slice(0, 2).join(" "))}</small>`;
    d.title = (s.namaLengkap || s.nama) + " — " + s.peran.map((k) => _ktPeran(k).nama).join(", ");
    d.onclick = () => ktKartu(s.id); ham.appendChild(d); KT.label[s.id] = d;
    const b = document.createElement("div"); b.className = "kt-gelembung"; b.hidden = true; ham.appendChild(b); KT.gelembung[s.id] = b;
  });
  // kendali
  const kan = r.domElement; let tarik = null;
  kan.addEventListener("pointerdown", (e) => { tarik = { x: e.clientX, s: KT.sudut, gerak: 0 }; kan.setPointerCapture(e.pointerId); });
  kan.addEventListener("pointermove", (e) => { if (!tarik) return; const dx = e.clientX - tarik.x; tarik.gerak = Math.max(tarik.gerak, Math.abs(dx)); KT.sudut = tarik.s - dx * 0.008; });
  kan.addEventListener("pointerup", (e) => { if (tarik && tarik.gerak < 6) _ktKetuk(e); tarik = null; });
  kan.addEventListener("wheel", (e) => { e.preventDefault(); ktZoom(e.deltaY < 0 ? 1 : -1, 0.08); }, { passive: false });
  window.addEventListener("resize", _ktUkur); _ktUkur();
  KT.jam = performance.now(); _ktJalan();
}
function _kdTokohDiKursi(s, kursi) {
  const t = _ktTokohBaru(s.jk); t.position.set(kursi.x, 0, kursi.z); t.rotation.y = kursi.hadap;
  t.userData.meja = kursi; t.userData.staf = s; _ktDuduk(t, true); KT.scene.add(t); KT.tokoh[s.id] = t;
}
function _ktUkur() {
  const layar = document.getElementById("kt-layar"); if (!layar || !KT.renderer) return;
  const w = layar.clientWidth, h = layar.clientHeight, a = w / h, s = (a < 1 ? 13.5 / a : 11) / KT.zoom;
  Object.assign(KT.kamera, { left: -s * a, right: s * a, top: s, bottom: -s }); KT.kamera.updateProjectionMatrix();
  KT.renderer.setSize(w, h);
}
function ktPutar(arah) { KT.sudut += (arah * Math.PI) / 8; }
function ktZoom(arah, langkah = 0.15) { KT.zoom = Math.min(3, Math.max(0.6, KT.zoom * (1 + arah * langkah))); _ktUkur(); }
function _ktKetuk(e) {
  const kan = KT.renderer.domElement, kot = kan.getBoundingClientRect();
  const m = new THREE.Vector2(((e.clientX - kot.left) / kot.width) * 2 - 1, -((e.clientY - kot.top) / kot.height) * 2 + 1);
  const ray = new THREE.Raycaster(); ray.setFromCamera(m, KT.kamera);
  const kena = ray.intersectObjects(Object.values(KT.tokoh), true)[0];
  if (!kena) return; let o = kena.object; while (o && !o.userData.staf) o = o.parent; if (o) ktKartu(o.userData.staf.id);
}

// ── berjalan: jalur A* + saling memberi jalan ──
function _ktPergi(t, tujuan, opsi = {}) {
  return new Promise((res) => {
    const u = t.userData; _ktDuduk(t, false);
    u.jalur = _kdCari({ x: t.position.x, z: t.position.z }, tujuan); u.tujuan = tujuan; u.berdiri = !!opsi.berdiri; u.selesai = res; u.tunggu = 0;
  });
}
function _kdGerak(t, dt, kini) {
  const u = t.userData;
  if (!u.jalur) { if (u.bicara) u.badan.position.y = (u.duduk ? (u.jk === "P" ? -0.3 : -0.28) : 0) + Math.abs(Math.sin(kini / 140)) * 0.03; return; }
  const p = u.jalur[0];
  if (!p) { // tiba
    const tj = u.tujuan; t.position.x = tj.x; t.position.z = tj.z; if (tj.hadap != null) t.rotation.y = tj.hadap;
    u.jalur = null; u.kaki.forEach((k) => (k.rotation.x = 0)); _ktDuduk(t, !u.berdiri); const s = u.selesai; u.selesai = null; if (s) s(); return;
  }
  const dx = p.x - t.position.x, dz = p.z - t.position.z, d = Math.hypot(dx, dz), v = 2.6 * dt;
  if (d < 0.05) { u.jalur.shift(); return; }
  const nx = t.position.x + (dx / d) * Math.min(v, d), nz = t.position.z + (dz / d) * Math.min(v, d);
  // saling memberi jalan: bila berpapasan, yang "mengalah" berhenti & menepi; yang lain jalan terus
  // (urutan tetap menurut id) → tidak pernah saling menunggu selamanya
  const aku = (u.staf && u.staf.id) || "";
  const halang = Object.values(KT.tokoh).find((o) => {
    if (o === t) return false; const ou = o.userData;
    const dBaru = Math.hypot(o.position.x - nx, o.position.z - nz); if (dBaru >= 0.62 || dBaru >= Math.hypot(o.position.x - t.position.x, o.position.z - t.position.z)) return false;
    if (ou.jalur) return ((ou.staf && ou.staf.id) || "") > aku;       // sama-sama berjalan: yang id-nya lebih kecil mengalah
    return !ou.duduk && u.tunggu < 1.6;                                // orang berdiri diam: tunggu sebentar lalu lewat di sampingnya
  });
  if (halang) {
    u.tunggu += dt;
    if (u.tunggu > 0.5) { const kx = t.position.x - (dz / d) * v * 0.8, kz = t.position.z + (dx / d) * v * 0.8, [i, j] = _kdSel(kx, kz); if (!_kdTerblok(i, j)) { t.position.x = kx; t.position.z = kz; } }
  } else {
    if (u.tunggu > 0.5) u.jalur = _kdCari({ x: t.position.x, z: t.position.z }, u.tujuan); // setelah menepi, hitung ulang jalur
    u.tunggu = 0; t.position.x = nx; t.position.z = nz;
  }
  t.rotation.y = Math.atan2(dx, dz);
  u.langkah = (u.langkah || 0) + dt * 10; const ay = Math.sin(u.langkah);
  u.kaki.forEach((k, i) => (k.rotation.x = (i ? -1 : 1) * ay * 0.5)); u.badan.position.y = Math.abs(ay) * 0.04;
}
function _ktJalan() {
  if (!KT.buka || !KT.renderer) return;
  KT.raf = requestAnimationFrame(_ktJalan);
  const kini = performance.now(), dt = Math.min(0.05, (kini - KT.jam) / 1000); KT.jam = kini;
  const k = KT.kamera, jarak = 32; k.position.set(Math.sin(KT.sudut) * jarak, 20, Math.cos(KT.sudut) * jarak); k.lookAt(0, 0.5, 0);
  Object.values(KT.tokoh).forEach((t) => _kdGerak(t, dt, kini));
  // pintu ruang kepala terbuka bila ada yang mendekat
  if (KT.pintu) { const dekat = Object.values(KT.tokoh).some((t) => Math.hypot(t.position.x, t.position.z + 2) < 1.9 && t.userData.jalur); const tuju = dekat ? -Math.PI / 2 : 0; KT.pintu.rotation.y += (tuju - KT.pintu.rotation.y) * Math.min(1, dt * 6); }
  // TV
  if (kini - (KT.tvT || 0) > (KT.tv.mode === "rapat" ? 60 : 1000)) { KT.tvT = kini; _kdTvGambar(kini); }
  KT.renderer.render(KT.scene, k);
  const w = KT.renderer.domElement.clientWidth, h = KT.renderer.domElement.clientHeight, v = new THREE.Vector3();
  Object.entries(KT.tokoh).forEach(([id, t]) => {
    v.set(t.position.x, 2.1, t.position.z).project(k);
    const x = (v.x * 0.5 + 0.5) * w, y = (-v.y * 0.5 + 0.5) * h, lb = KT.label[id], gb = KT.gelembung[id];
    if (lb) lb.style.transform = `translate(${x}px,${y}px) translate(-50%,-100%)`;
    if (gb && !gb.hidden) gb.style.transform = `translate(${x}px,${y - 40}px) translate(-50%,-100%)`;
  });
}
const _ktTunggu = (ms) => new Promise((r) => setTimeout(r, ms));
function _ktBicara(id, teks, ms = 4200) {
  const gb = KT.gelembung[id], t = KT.tokoh[id]; if (!gb || !t) return _ktTunggu(0);
  gb.hidden = false; gb.textContent = teks.length > 160 ? teks.slice(0, 157) + "…" : teks; t.userData.bicara = true;
  return _ktTunggu(ms).then(() => { gb.hidden = true; t.userData.bicara = false; });
}

// ── TV ruang rapat: diam = logo & jam; rapat = judul, grafik bergerak, teks berjalan ──
function _kdTvGambar(kini) {
  const c = KT.tvKanvas; if (!c) return; const x = c.getContext("2d"), W = c.width, H = c.height, tv = KT.tv;
  if (tv.mode !== "rapat") {
    const g = x.createLinearGradient(0, 0, W, H); g.addColorStop(0, "#04130e"); g.addColorStop(1, "#0b2a21"); x.fillStyle = g; x.fillRect(0, 0, W, H);
    if (KT.logoImg) { try { x.globalAlpha = 0.9; x.drawImage(KT.logoImg, W / 2 - 70, 40, 140, 140); x.globalAlpha = 1; } catch (e) {} }
    x.fillStyle = "#fde68a"; x.textAlign = "center"; x.font = "800 30px system-ui, sans-serif"; x.fillText("PKBM AL-UMM BARABAI", W / 2, 230);
    const d = new Date(); x.fillStyle = "#a7f3d0"; x.font = "700 40px system-ui, sans-serif"; x.fillText(`${String(d.getHours()).padStart(2, "0")}.${String(d.getMinutes()).padStart(2, "0")}`, W / 2, 290);
  } else {
    const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#0b1d3a"); g.addColorStop(1, "#08111f"); x.fillStyle = g; x.fillRect(0, 0, W, H);
    x.fillStyle = "#fde68a"; x.textAlign = "left"; x.font = "800 26px system-ui, sans-serif"; x.fillText(tv.judul || "Rapat Koordinasi", 24, 42);
    x.fillStyle = "#ef4444"; x.beginPath(); x.arc(W - 40, 32, 8 + Math.sin(kini / 300) * 2, 0, Math.PI * 2); x.fill(); x.fillStyle = "#fecaca"; x.font = "700 14px system-ui"; x.textAlign = "right"; x.fillText("LANGSUNG", W - 56, 37);
    const data = tv.data.length ? tv.data : [{ label: "—", nilai: 1, warna: "#34d399" }], mx = Math.max(1, ...data.map((d) => d.nilai)), lebar = (W - 80) / data.length;
    data.forEach((d, i) => {
      const goyang = 1 + Math.sin(kini / 420 + i) * 0.03, tinggi = Math.max(6, (d.nilai / mx) * 190 * Math.min(1, (kini - tv.t0) / 900) * goyang);
      const bx = 40 + i * lebar + lebar * 0.18, bw = lebar * 0.64; x.fillStyle = d.warna || "#34d399"; x.fillRect(bx, 270 - tinggi, bw, tinggi);
      x.fillStyle = "#e2e8f0"; x.font = "700 15px system-ui"; x.textAlign = "center"; x.fillText(d.label, bx + bw / 2, 292); x.fillStyle = "#fef3c7"; x.font = "800 15px system-ui"; x.fillText(d.teks ?? String(d.nilai), bx + bw / 2, 262 - tinggi);
    });
    x.fillStyle = "#14532d"; x.fillRect(0, H - 44, W, 44); x.fillStyle = "#ecfdf5"; x.font = "700 18px system-ui"; x.textAlign = "left";
    const tk = (tv.ticker || "PKBM Al-Umm Barabai") + "   •   "; const lb = x.measureText(tk).width || 1, off = ((kini / 12) % lb);
    for (let p = -off; p < W; p += lb) x.fillText(tk, p, H - 16);
  }
  KT.tvTekstur.needsUpdate = true;
}
function kdTvRapat(judul, data, ticker) { KT.tv = { mode: "rapat", judul, data: data || [], ticker: ticker || "", t0: performance.now() }; }
function kdTvDiam() { KT.tv = { mode: "diam", judul: "", data: [], ticker: "" }; }
// gelas minum di depan peserta rapat
function kdMinuman(kursi) {
  kdMinumanHapus(); KT.gelas = [];
  kursi.forEach((k) => {
    const g = new THREE.Group(), dx = k.hadap === Math.PI / 2 ? 0.75 : k.hadap === -Math.PI / 2 ? -0.75 : 0, dz = k.hadap === 0 ? 0.75 : k.hadap === Math.PI ? -0.75 : 0;
    g.position.set(k.x + dx, 0.9, k.z + dz);
    g.add(_ktKotak(0.26, 0.02, 0.26, 0xf8fafc, 0, 0.01, 0));
    const gl = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.18, 12), new THREE.MeshLambertMaterial({ color: 0xffffff })); gl.position.y = 0.1; g.add(gl);
    const isi = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.01, 12), new THREE.MeshLambertMaterial({ color: 0x7c2d12 })); isi.position.y = 0.18; g.add(isi);
    g.scale.setScalar(0.01); KT.scene.add(g); KT.gelas.push(g);
    const mulai = performance.now(); const tumbuh = () => { const p = Math.min(1, (performance.now() - mulai) / 400); g.scale.setScalar(0.01 + p * 0.99); if (p < 1) requestAnimationFrame(tumbuh); }; tumbuh();
  });
}
function kdMinumanHapus() { (KT.gelas || []).forEach((g) => KT.scene && KT.scene.remove(g)); KT.gelas = []; }

// ── Kepala PKBM berkeliling ──
async function ktKeliling() {
  const kid = (KT.peran.kepala || [])[0], t = kid && KT.tokoh[kid]; if (!t || KT.sibuk || t.userData.jalur) return;
  KT.sibuk = true; KT.kelilingT = Date.now();
  try {
    await _ktBicara(kid, "Bismillah, ana keliling sebentar melihat kawan-kawan.", 1800);
    for (const [x, z, sisi] of [[0, 0.3, null], [-10, 2.4, "L"], [10, 2.4, "P"]]) {
      await _ktPergi(t, { x, z, hadap: Math.PI }, { berdiri: true });
      if (!sisi) continue;
      const tetangga = KT.staf.filter((s) => KT.tokoh[s.id] && s.id !== kid && (sisi === "L" ? s.jk !== "P" : s.jk === "P")).slice(0, 2);
      for (const s of tetangga) {
        await _ktBicara(kid, `Assalamu'alaikum ${s.jk === "P" ? "Ustadzah" : "Ustadz"} ${s.nama.split(" ")[0]}, bagaimana pekerjaannya?`, 2200);
        await _ktBicara(s.id, _ktJawabKeliling(s), 2600);
      }
    }
    await _ktPergi(t, KT.kursiKepala);
  } finally { KT.sibuk = false; }
}
function _ktJawabKeliling(s) {
  const k = s.peran[0], kb = KT.kabarCache || {};
  if (/^(peny|admin)-/.test(k)) { const r = k.split("-")[1], n = (kb[r] || []).length; return n ? `Alhamdulillah, ada ${n} kabar baru di ${KT_JENJANG[r]}, insya Allah ana laporkan.` : `Alhamdulillah lancar, ${KT_JENJANG[r]} aman terkendali.`; }
  return { sekretaris: "Alhamdulillah, sedang merapikan data guru & siswa.", bendahara: "Alhamdulillah, sedang memeriksa Kertas Kerja & realisasi BOSP.", dapodik: "Sedang mencocokkan NISN & NIK, Ustadz.", it: "Sedang memeriksa tiket aplikasi, Ustadz." }[k] || "Alhamdulillah, baik Ustadz.";
}

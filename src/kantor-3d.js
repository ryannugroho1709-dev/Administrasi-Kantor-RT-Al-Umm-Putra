// ============================================================
//  🏢 KANTOR PKBM — dunia 3D: denah, perabot, tokoh, jalan pintar (A*), pintu, TV, minuman, keliling
//  Denah (x kiri→kanan, z belakang→depan):
//    Ruang Ustadz   x[-15,-5]        | Ruang Kepala PKBM x[-5,5] z[-8,-2] (dinding kaca, pintu)
//    Ruang Ustadzah x[5,15]          | Ruang Rapat       x[-5,5] z[-2,8]  (logo, TV, minuman)
//  Semua benda & dinding ditandai di peta jalan; tokoh berjalan memutari benda & saling memberi jalan.
// ============================================================
const KD = { X0: -15, X1: 15, Z0: -8, Z1: 17.5, S: 0.5 };
KD.NX = Math.round((KD.X1 - KD.X0) / KD.S); KD.NZ = Math.round((KD.Z1 - KD.Z0) / KD.S);
const KT_KULIT = 0xe9c6a0;

// ── peta jalan ──
function _kdPetaBaru() { KD.blok = new Uint8Array(KD.NX * KD.NZ); }
const _kdSel = (x, z) => [Math.floor((x - KD.X0) / KD.S), Math.floor((z - KD.Z0) / KD.S)];
const _kdPusat = (i, j) => ({ x: KD.X0 + (i + 0.5) * KD.S, z: KD.Z0 + (j + 0.5) * KD.S });
const _kdDalam = (i, j) => i >= 0 && j >= 0 && i < KD.NX && j < KD.NZ;
const _kdTerblok = (i, j) => !_kdDalam(i, j) || KD.blok[j * KD.NX + i] > 0;
const _kdKeras = (i, j) => !_kdDalam(i, j) || KD.blok[j * KD.NX + i] === 1;
function _kdBlokir(cx, cz, w, d, jarak = 0.22, nilai = 1) {
  const [i0, j0] = _kdSel(cx - w / 2 - jarak, cz - d / 2 - jarak), [i1, j1] = _kdSel(cx + w / 2 + jarak - 1e-6, cz + d / 2 + jarak - 1e-6);
  for (let j = Math.max(0, j0); j <= Math.min(KD.NZ - 1, j1); j++) for (let i = Math.max(0, i0); i <= Math.min(KD.NX - 1, i1); i++) if (KD.blok[j * KD.NX + i] !== 1) KD.blok[j * KD.NX + i] = nilai;
}
function _kdCari(dari, ke) {
  const [si, sj] = _kdSel(dari.x, dari.z), [gi, gj] = _kdSel(ke.x, ke.z), N = KD.NX * KD.NZ;
  // petak di sekitar kursi asal & kursi tujuan boleh dilewati (untuk duduk / berdiri dari kursi)
  const dekat = (i, j, t) => { const c = _kdPusat(i, j); return Math.hypot(c.x - t.x, c.z - t.z) < 0.62; };
  // kursi (lunak) di sekitar asal/tujuan boleh dilewati; meja, dinding & benda keras TIDAK PERNAH
  const bebas = (i, j) => _kdDalam(i, j) && ((i === gi && j === gj) || (i === si && j === sj) || !_kdTerblok(i, j) || (!_kdKeras(i, j) && (dekat(i, j, ke) || dekat(i, j, dari))));
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

// ── bahan "kelas internasional": marmer, kayu walnut, kulit, kuningan ──
const KT_MAT = {};
function _kdMarmer(dasar, urat, ubin = 2) {
  const c = document.createElement("canvas"); c.width = c.height = 256; const x = c.getContext("2d");
  x.fillStyle = dasar; x.fillRect(0, 0, 256, 256);
  x.strokeStyle = urat; x.globalAlpha = 0.35; x.lineWidth = 1.4;
  for (let i = 0; i < 14; i++) { x.beginPath(); let px = Math.random() * 256, py = Math.random() * 256; x.moveTo(px, py); for (let k = 0; k < 6; k++) { px += (Math.random() - 0.4) * 60; py += (Math.random() - 0.5) * 60; x.lineTo(px, py); } x.stroke(); }
  x.globalAlpha = 0.55; x.strokeStyle = "rgba(201,162,39,.9)"; x.lineWidth = 2; x.strokeRect(0, 0, 256, 256); // nat emas
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(ubin, ubin); t.anisotropy = 4; return t;
}
function _kdLantai(w, d, x, z, dasar, urat) {
  const t = _kdMarmer(dasar, urat); t.repeat.set(w / 2, d / 2);
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, 0.2, d), new THREE.MeshPhongMaterial({ map: t, shininess: 70, specular: 0x666666 }));
  m.position.set(x, -0.1, z); m.receiveShadow = true; KT.scene.add(m); return m;
}
const _kdKilap = (warna, kilap = 40) => new THREE.MeshPhongMaterial({ color: warna, shininess: kilap, specular: 0x444444 });
function _kdBalok(w, h, d, mat, x, y, z) { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; return m; }
// meja eksekutif walnut + lis kuningan + alas kulit; laptop yang layarnya bisa menyala
function _kdMejaKerja(x, z, lebar = 1.9) {
  const g = new THREE.Group(); g.position.set(x, 0, z);
  g.add(_kdBalok(lebar, 0.08, 0.95, _kdKilap(0x3b2314, 60), 0, 0.78, 0));
  g.add(_kdBalok(lebar + 0.04, 0.03, 0.99, _kdKilap(0xc9a227, 90), 0, 0.73, 0));
  g.add(_kdBalok(lebar * 0.55, 0.01, 0.45, _kdKilap(0x111827, 20), 0.1, 0.83, 0.05));
  [[-1, 1], [1, 1]].forEach(([a]) => g.add(_kdBalok(0.08, 0.72, 0.85, _kdKilap(0x2a180c, 50), a * (lebar / 2 - 0.06), 0.37, 0)));
  g.add(_kdBalok(lebar - 0.2, 0.55, 0.05, _kdKilap(0x2a180c, 50), 0, 0.45, -0.42));
  // laptop
  g.add(_kdBalok(0.56, 0.03, 0.38, _kdKilap(0xc0c4cc, 80), -0.35, 0.84, 0.02));
  const lid = new THREE.Group(); lid.position.set(-0.35, 0.85, -0.17); lid.rotation.x = -0.25;
  lid.add(_kdBalok(0.56, 0.36, 0.02, _kdKilap(0xc0c4cc, 80), 0, 0.18, 0));
  const layar = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.31), new THREE.MeshBasicMaterial({ color: 0x0b1220 })); layar.position.set(0, 0.18, 0.012); lid.add(layar);
  g.add(lid);
  // lampu meja kuningan & berkas
  g.add(_kdBalok(0.05, 0.4, 0.05, _kdKilap(0xc9a227, 90), lebar / 2 - 0.2, 1.0, -0.25)); g.add(_kdBalok(0.22, 0.08, 0.22, _kdKilap(0x14532d, 30), lebar / 2 - 0.2, 1.22, -0.2));
  g.add(_kdBalok(0.3, 0.05, 0.22, new THREE.MeshLambertMaterial({ color: 0xfefce8 }), 0.45, 0.85, 0.1));
  KT.scene.add(g); _kdBlokir(x, z, lebar, 0.95);
  return { grup: g, layar };
}
// kursi kantor kulit (sandaran tinggi, kaki krom)
function _kdKursi(x, z, warna = 0x1f2937, rotY = 0, tinggiSandaran = 0.6, dinamis = false) {
  const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = rotY;
  const kulit = _kdKilap(warna, 35), krom = _kdKilap(0xd1d5db, 100);
  g.add(_kdBalok(0.56, 0.12, 0.54, kulit, 0, 0.44, 0)); g.add(_kdBalok(0.06, 0.36, 0.06, krom, 0, 0.22, 0));
  g.add(_kdBalok(0.5, 0.03, 0.06, krom, 0, 0.03, 0)); g.add(_kdBalok(0.06, 0.03, 0.5, krom, 0, 0.03, 0));
  g.add(_kdBalok(0.54, tinggiSandaran, 0.1, kulit, 0, 0.5 + tinggiSandaran / 2, -0.24));
  [-0.29, 0.29].forEach((a) => g.add(_kdBalok(0.05, 0.05, 0.4, krom, a, 0.62, -0.02)));
  KT.scene.add(g);
  if (dinamis) (KD.dinamis = KD.dinamis || []).push({ x, z, g }); else _kdBlokir(x, z, 0.5, 0.5, 0.12, 2);
  return g;
}
// rak arsip berisi map/berkas warna-warni (bisa diketuk)
function _kdRak(x, z, lebar, ruang, rotY = 0) {
  const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = rotY;
  g.add(_kdBalok(lebar, 2.0, 0.45, _kdKilap(0x2a180c, 50), 0, 1.0, 0));
  const warna = [0x1d4ed8, 0x15803d, 0xb91c1c, 0xca8a04, 0x7c3aed, 0x0e7490, 0xbe185d, 0x334155];
  for (let rak = 0; rak < 4; rak++) {
    g.add(_kdBalok(lebar - 0.06, 0.04, 0.42, _kdKilap(0xc9a227, 80), 0, 0.12 + rak * 0.48, 0.02));
    let px = -lebar / 2 + 0.12;
    while (px < lebar / 2 - 0.12) { const tb = 0.06 + Math.random() * 0.05; g.add(_kdBalok(tb, 0.34 + Math.random() * 0.06, 0.3, new THREE.MeshLambertMaterial({ color: warna[Math.floor(Math.random() * warna.length)] }), px + tb / 2, 0.32 + rak * 0.48, 0.06)); px += tb + 0.015; }
  }
  g.userData.rak = ruang; g.traverse((o) => (o.userData.rak = ruang));
  KT.scene.add(g); KT.rak = KT.rak || []; KT.rak.push(g);
  const lw = Math.abs(Math.sin(rotY)) > 0.5 ? 0.5 : lebar, ld = Math.abs(Math.sin(rotY)) > 0.5 ? lebar : 0.5; _kdBlokir(x, z, lw, ld);
  return g;
}
function _kdTanaman(x, z) {
  _kdTaruh(new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.18, 0.55, 14), _kdKilap(0xf8fafc, 90)), null).position.set(x, 0.28, z);
  [0.75, 1.05, 1.3].forEach((y, i) => { const d = new THREE.Mesh(new THREE.SphereGeometry(0.36 - i * 0.07, 12, 10), new THREE.MeshLambertMaterial({ color: i ? 0x22c55e : 0x15803d })); d.position.set(x, y, z); d.castShadow = true; KT.scene.add(d); });
  _kdBlokir(x, z, 0.5, 0.5);
}

// ── tokoh tanpa wajah (ustadzah bercadar: tampak area mata) ──
function _ktTokohBaru(jk) {
  const g = new THREE.Group(), badan = new THREE.Group(); g.add(badan);
  const kaki = [];
  if (jk === "P") {
    const gamis = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.36, 1.05, 12), new THREE.MeshLambertMaterial({ color: 0x15151a }));
    gamis.position.y = 0.53; gamis.castShadow = true; badan.add(gamis);
    const jilbab = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.36, 0.46, 12), new THREE.MeshLambertMaterial({ color: 0x0d0d10 }));
    jilbab.position.y = 1.02; jilbab.castShadow = true; badan.add(jilbab);
    badan.add(_ktKotak(0.34, 0.36, 0.34, 0x0d0d10, 0, 1.32, 0));
    badan.add(_ktKotak(0.26, 0.075, 0.02, KT_KULIT, 0, 1.38, 0.172)); // celah mata cadar (kulit)
    [-0.06, 0.06].forEach((x) => badan.add(_ktKotak(0.045, 0.03, 0.01, 0x1f1a17, x, 1.38, 0.184))); // mata
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

// ── bangun kantor ──
async function _ktBangun() {
  _kdPetaBaru(); KT.rak = []; KT.layar = {}; KD.dinamis = [];
  const layar = document.getElementById("kt-layar");
  const sc = (KT.scene = new THREE.Scene()); sc.background = new THREE.Color(0xcfe3f1);
  const r = (KT.renderer = new THREE.WebGLRenderer({ antialias: true })); r.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFSoftShadowMap; layar.prepend(r.domElement);
  KT.kamera = new THREE.OrthographicCamera(-10, 10, 10, -10, 0.1, 200);
  sc.add(new THREE.HemisphereLight(0xffffff, 0x8a9bb0, 0.62));
  const mt = new THREE.DirectionalLight(0xfff4e0, 0.62); mt.position.set(10, 20, 14); mt.castShadow = true; mt.shadow.mapSize.set(2048, 2048);
  Object.assign(mt.shadow.camera, { left: -20, right: 20, top: 18, bottom: -18 }); sc.add(mt);
  const lampuRapat = new THREE.PointLight(0xffe2a8, 0.4, 12); lampuRapat.position.set(0, 4, 3.2); sc.add(lampuRapat);
  const logo = await _kdMuatLogo(); KT.logoImg = logo;

  // ── lantai marmer ──
  _kdLantai(10, 16, -10, 0, "#f3ede3", "#8d8478");   // Ruang Ustadz — marmer krem
  _kdLantai(10, 16, 10, 0, "#f6e9ee", "#a7868f");    // Ruang Ustadzah — marmer rosé
  _kdLantai(10, 6, 0, -5, "#2b2622", "#c9a227");     // Ruang Kepala — marmer emperador gelap
  _kdLantai(10, 10, 0, 3, "#f8f6f1", "#9c9488");     // Ruang Rapat — marmer putih
  sc.add(_ktKotak(8.4, 0.02, 4.2, 0x14532d, 0, 0.01, 3.2)); sc.add(_ktKotak(8.6, 0.015, 4.4, 0xc9a227, 0, 0.005, 3.2)); // karpet rapat
  sc.add(_ktKotak(4.6, 0.02, 2.8, 0x7f1d1d, 0, 0.01, -4.6)); sc.add(_ktKotak(4.8, 0.015, 3.0, 0xc9a227, 0, 0.005, -4.6)); // karpet kepala

  // ── dinding: luar cat hijau lime, dalam krem dengan panel kayu & lis emas ──
  const lime = _kdKilap(0x84cc16, 20), krem = new THREE.MeshLambertMaterial({ color: 0xf5efe2 }), panel = _kdKilap(0x3b2314, 50), emas = _kdKilap(0xc9a227, 90);
  const dinding = (w, d, x, z, arah) => {
    _kdTaruh(_kdBalok(w, 3, d, krem, x, 1.5, z), [w, d]);
    const keX = arah[0] === "x", sgn = arah[1] === "-" ? -1 : 1, tebal = keX ? w : d, t2 = 0.06;
    const luar = keX ? [x + sgn * (tebal / 2 + t2 / 2), z] : [x, z + sgn * (tebal / 2 + t2 / 2)], dalam = keX ? [x - sgn * (tebal / 2 + 0.02), z] : [x, z - sgn * (tebal / 2 + 0.02)];
    const ukur = (tipis, h) => (keX ? [tipis, h, d] : [w, h, tipis]);
    KT.scene.add(_kdBalok(...ukur(t2, 3.02), lime, luar[0], 1.5, luar[1]));
    KT.scene.add(_kdBalok(...ukur(0.03, 1.0), panel, dalam[0], 0.5, dalam[1]));
    KT.scene.add(_kdBalok(...ukur(0.04, 0.05), emas, dalam[0], 1.02, dalam[1]));
    KT.scene.add(_kdBalok(...ukur(0.04, 0.08), emas, dalam[0], 2.95, dalam[1]));
  };
  dinding(30.4, 0.25, 0, -8.1, "z-"); dinding(0.25, 16.2, -15.1, 0, "x-"); dinding(0.25, 16.2, 15.1, 0, "x+");
  // tepi depan bangunan: lis lime rendah supaya tampak bangunan utuh
  [[-8.1, 13.8], [8.1, 13.8]].forEach(([x, w]) => { _kdTaruh(_kdBalok(w, 0.9, 0.25, lime, x, 0.45, 8.1), [w, 0.3]); KT.scene.add(_kdBalok(w, 0.05, 0.3, emas, x, 0.92, 8.1)); }); // dinding depan rendah, pintu masuk utama x -1.2..1.2
  [[-15.1, -8.1], [15.1, -8.1], [-15.1, 8.1], [15.1, 8.1]].forEach(([x, z]) => KT.scene.add(_kdBalok(0.5, 3.1, 0.5, lime, x, 1.55, z))); // pilar sudut
  [[0, -8.25, 30.7, 0.12], [-15.25, 0, 0.12, 16.6], [15.25, 0, 0.12, 16.6]].forEach(([x, z, w, d]) => KT.scene.add(_kdBalok(w, 0.14, d, emas, x, 3.05, z))); // lis atap
  // sekat kaca x = ±5 (pintu z 5.4..7.2)
  const kaca = new THREE.MeshPhongMaterial({ color: 0xbfe3f2, transparent: true, opacity: 0.22, shininess: 100 });
  [-5, 5].forEach((x) => {
    [[-8, 5.4], [7.2, 8]].forEach(([a, b]) => {
      const p = (a + b) / 2, l = b - a;
      _kdTaruh(_kdBalok(0.18, 1.1, l, panel, x, 0.55, p), [0.25, l]);
      sc.add(_kdBalok(0.08, 1.3, l, kaca, x, 1.75, p)); sc.add(_kdBalok(0.22, 0.06, l, emas, x, 2.42, p)); sc.add(_kdBalok(0.22, 0.05, l, emas, x, 1.1, p));
    });
  });
  // Ruang Kepala: dinding kaca z = -2 dengan pintu x -0.9..0.9
  [[-5, -0.9], [0.9, 5]].forEach(([a, b]) => {
    const p = (a + b) / 2, l = b - a;
    _kdTaruh(_kdBalok(l, 1.1, 0.18, panel, p, 0.55, -2), [l, 0.25]);
    sc.add(_kdBalok(l, 1.3, 0.08, kaca, p, 1.75, -2)); sc.add(_kdBalok(l, 0.06, 0.22, emas, p, 2.42, -2)); sc.add(_kdBalok(l, 0.05, 0.22, emas, p, 1.1, -2));
  });
  const engsel = new THREE.Group(); engsel.position.set(-0.9, 0, -2); engsel.add(_kdBalok(1.8, 2.3, 0.08, _kdKilap(0x3b2314, 60), 0.9, 1.15, 0));
  engsel.add(_kdBalok(0.08, 0.3, 0.1, emas, 1.6, 1.1, 0.06)); sc.add(engsel); KT.pintu = engsel;

  // papan nama
  _kdPapan("Ruang Ustadz", "Petugas Ikhwan", -10, 2.3, -7.95, 4.2, "#14532d");
  _kdPapan("Ruang Ustadzah", "Petugas Akhawat", 10, 2.3, -7.95, 4.2, "#831843");
  _kdPapan("Ruang Kepala PKBM", "", 0, 2.85, -1.9, 3.4, "#7c2d12");
  _kdPapan("Ruang Rapat", "PKBM Al-Umm Barabai", 3, 2.0, -1.88, 3.2, "#14532d");

  // ── Ruang Kepala PKBM ──
  const mk = _kdMejaKerja(0, -5.6, 2.8); mk.grup.rotation.y = Math.PI; KT.layar.__kepala = mk.layar; // menghadap kursi kepala
  sc.add(_ktKotak(0.7, 0.14, 0.12, 0xc9a227, 0.8, 0.92, -5.15));
  KT.kursiKepala = { x: 0, z: -6.55, hadap: 0 }; _kdKursi(0, -6.55, 0x111827, 0, 0.95);
  KT.kursiTamu = [{ x: -0.8, z: -4.35, hadap: Math.PI }, { x: 0.8, z: -4.35, hadap: Math.PI }];
  KT.kursiTamu.forEach((k) => _kdKursi(k.x, k.z, 0x7c2d12, Math.PI, 0.55));
  _kdRak(-3.3, -7.65, 2.4, "Pg");
  [[0xb91c1c, 2.05], [0xf8fafc, 1.75]].forEach(([w, y]) => sc.add(_ktKotak(0.02, 0.3, 0.55, w, 4.1, y, -7.15)));
  _kdTaruh(_kdBalok(0.06, 2.2, 0.06, _kdKilap(0xd4d4d8, 100), 4.1, 1.1, -7.4), [0.4, 0.4]);
  _kdTaruh(_kdBalok(0.85, 0.42, 2.1, _kdKilap(0xf5efe2, 30), 4.3, 0.25, -4.3), [0.85, 2.1]); sc.add(_kdBalok(0.22, 0.55, 2.1, _kdKilap(0xf5efe2, 30), 4.65, 0.62, -4.3)); // sofa kulit krem
  _kdTaruh(_kdBalok(0.6, 0.04, 1.0, kaca, 3.3, 0.42, -4.3), [0.6, 1.0]); sc.add(_kdBalok(0.05, 0.4, 0.05, emas, 3.3, 0.2, -4.3));
  if (logo) { const f = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.5), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(_kdKanvasLogo(logo, 256, false)), transparent: true })); f.position.set(0.6, 1.95, -7.95); sc.add(f); }
  _kdTanaman(-4.4, -2.6);

  // ── Ruang Rapat: meja pimpinan di barat; meja ustadz & meja ustadzah TERPISAH, semua menghadap pimpinan,
  //    dibatasi tabir — tidak ada ustadz & ustadzah yang saling berhadapan ──
  const kepalaId = (KT.peran.kepala || [])[0], yayasanId = (KT.peran.yayasan || [])[0];
  const peserta = KT.staf.filter((s) => s.id !== kepalaId && s.id !== yayasanId);
  const nL = Math.max(1, Math.min(6, peserta.filter((s) => s.jk !== "P").length)), nP = Math.max(1, Math.min(6, peserta.filter((s) => s.jk === "P").length));
  const zP = 3.4, jarakKursi = 0.95;
  const mejaBaris = (x, n) => {
    const pj = n * jarakKursi + 0.35;
    _kdTaruh(_kdBalok(0.8, 0.08, pj, _kdKilap(0x3b2314, 70), x, 0.8, zP), [0.8, pj]);
    sc.add(_kdBalok(0.84, 0.035, pj + 0.04, emas, x, 0.75, zP)); sc.add(_kdBalok(0.4, 0.012, pj - 0.3, kaca, x, 0.85, zP));
    sc.add(_kdBalok(0.08, 0.72, pj - 0.1, _kdKilap(0x2a180c, 50), x - 0.32, 0.37, zP)); // panel depan meja
    return pj;
  };
  mejaBaris(-0.6, nL);                                   // meja ustadz (depan)
  mejaBaris(2.6, nP);                                    // meja ustadzah (belakang, dekat pintu timur)
  const pjTabir = Math.max(nL, nP) * jarakKursi + 1.0;   // tabir / hijab pemisah
  _kdTaruh(_kdBalok(0.08, 1.35, pjTabir, new THREE.MeshPhongMaterial({ color: 0x14532d, transparent: true, opacity: 0.85, shininess: 30 }), 1.8, 0.68, zP), [0.08, pjTabir]);
  sc.add(_kdBalok(0.1, 0.05, pjTabir, emas, 1.8, 1.37, zP));
  // meja pimpinan + logo
  _kdTaruh(_kdBalok(0.8, 0.08, 2.0, _kdKilap(0x3b2314, 70), -3.0, 0.8, zP), [0.8, 2.0]); sc.add(_kdBalok(0.84, 0.035, 2.04, emas, -3.0, 0.75, zP));
  sc.add(_kdBalok(0.08, 0.72, 1.9, _kdKilap(0x2a180c, 50), -2.68, 0.37, zP));
  const piring = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.02, 32), new THREE.MeshLambertMaterial({ map: new THREE.CanvasTexture(_kdKanvasLogo(logo, 256, true)) }));
  piring.position.set(-3.0, 0.86, zP); piring.rotation.y = -Math.PI / 2; sc.add(piring);
  const lantaiLogo = new THREE.Mesh(new THREE.CircleGeometry(0.7, 40), new THREE.MeshLambertMaterial({ map: new THREE.CanvasTexture(_kdKanvasLogo(logo, 512, true)) }));
  lantaiLogo.rotation.x = -Math.PI / 2; lantaiLogo.rotation.z = Math.PI / 2; lantaiLogo.position.set(-1.8, 0.025, zP); sc.add(lantaiLogo);
  KT.kursiPimpinan = { x: -3.8, z: zP - 0.45, hadap: Math.PI / 2 };
  KT.kursiYayasan = { x: -3.8, z: zP + 0.45, hadap: Math.PI / 2 };
  [KT.kursiPimpinan, KT.kursiYayasan].forEach((k) => _kdKursi(k.x, k.z, 0x7c2d12, k.hadap, 0.95));
  const baris = (n, x) => Array.from({ length: n }, (_, i) => ({ x, z: zP - ((n - 1) * jarakKursi) / 2 + i * jarakKursi, hadap: -Math.PI / 2 }));
  KT.kursiIkhwan = baris(nL, 0.45); KT.kursiAkhawat = baris(nP, 3.45);
  KT.kursiIkhwan.forEach((k) => _kdKursi(k.x, k.z, 0x111827, k.hadap, 0.8));
  KT.kursiAkhawat.forEach((k) => _kdKursi(k.x, k.z, 0x3b1d2a, k.hadap, 0.8));
  KT.kursiRapat = [KT.kursiPimpinan, KT.kursiYayasan, ...KT.kursiAkhawat, ...KT.kursiIkhwan]; // kompatibel
  // TV
  KT.tvKanvas = document.createElement("canvas"); KT.tvKanvas.width = 640; KT.tvKanvas.height = 360;
  KT.tvTekstur = new THREE.CanvasTexture(KT.tvKanvas);
  sc.add(_kdBalok(2.95, 1.72, 0.1, _kdKilap(0x050507, 90), -3, 1.75, -1.86)); sc.add(_kdBalok(3.0, 0.04, 0.12, emas, -3, 0.88, -1.86));
  const layarTv = new THREE.Mesh(new THREE.PlaneGeometry(2.7, 1.52), new THREE.MeshBasicMaterial({ map: KT.tvTekstur })); layarTv.position.set(-3, 1.75, -1.8); sc.add(layarTv);
  KT.tv = { mode: "diam", judul: "", data: [], ticker: "", t0: 0 }; _kdTvGambar(0);
  _kdTaruh(_kdBalok(0.5, 1.1, 0.5, _kdKilap(0xe2e8f0, 60), -4.4, 0.55, -1.3), [0.5, 0.5]); sc.add(_ktKotak(0.4, 0.45, 0.4, 0x7dd3fc, -4.4, 1.32, -1.3, { transparent: true, opacity: 0.7 }));
  _kdTanaman(4.4, -1.4);
  _kdGapura(logo);

  // ── Ruang Ustadz & Ustadzah: meja eksekutif, rak arsip berisi berkas ──
  _kdRak(-10, -7.65, 3.0, "L"); _kdRak(10, -7.65, 3.0, "P");
  [[-14.4, -7.3], [14.4, -7.3], [-14.4, 7.3], [14.4, 7.3], [-5.6, -7.3], [5.6, -7.3]].forEach(([x, z]) => _kdTanaman(x, z));
  const posisi = (xPusat) => { const p = []; [-5.4, -2.2, 1.0, 4.2].forEach((z) => [-2.3, 2.3].forEach((dx) => p.push({ x: xPusat + dx, z }))); return p; };
  const pasang = (s, x, z) => {
    const m = _kdMejaKerja(x, z); KT.layar[s.id] = m.layar;
    const kursi = { x, z: z + 0.85, hadap: Math.PI }; _kdKursi(kursi.x, kursi.z, s.jk === "P" ? 0x4a1d2f : 0x1f2937, Math.PI, 0.6);
    _kdTokohDiKursi(s, kursi);
  };
  const ikhwan = peserta.filter((s) => s.jk !== "P"), akhawat = peserta.filter((s) => s.jk === "P");
  const pL = posisi(-10), pP = posisi(10);
  ikhwan.forEach((s, i) => pL[i] && pasang(s, pL[i].x, pL[i].z));
  akhawat.forEach((s, i) => pP[i] && pasang(s, pP[i].x, pP[i].z));
  // kursi rapat tetap per orang
  KT.kursiOrang = {}; ikhwan.forEach((s, i) => (KT.kursiOrang[s.id] = KT.kursiIkhwan[i % KT.kursiIkhwan.length]));
  akhawat.forEach((s, i) => (KT.kursiOrang[s.id] = KT.kursiAkhawat[i % KT.kursiAkhawat.length]));
  const kp = KT.staf.find((s) => s.id === kepalaId); if (kp) { _kdTokohDiKursi(kp, KT.kursiKepala); KT.kursiOrang[kp.id] = KT.kursiPimpinan; KT.layar[kp.id] = mk.layar; }
  const yy = KT.staf.find((s) => s.id === yayasanId); if (yy) { KT.kursiOrang[yy.id] = KT.kursiYayasan; _kdSiapkanYayasan(yy); }

  // label & gelembung
  const ham = document.getElementById("kt-hamparan"); ham.innerHTML = "";
  KT.staf.forEach((s) => {
    if (!KT.tokoh[s.id]) return;
    const p = _ktPeran(s.peran[0]);
    const d = document.createElement("button"); d.className = "kt-label"; d.style.setProperty("--w", p.warna);
    d.innerHTML = `<b>${_ktE(_ktPeranPendek(s.peran[0]))}${s.peran.length > 1 ? ` <i>+${s.peran.length - 1}</i>` : ""}</b><small>${_ktE(_ktGelar(s))} ${_ktE(s.nama.split(" ").slice(0, 2).join(" "))}</small>`;
    d.title = (s.namaLengkap || s.nama) + " — " + s.peran.map((k) => _ktPeran(k).nama).join(", ");
    d.onclick = () => ktKartu(s.id); ham.appendChild(d); KT.label[s.id] = d;
    const b = document.createElement("div"); b.className = "kt-gelembung"; b.hidden = true; ham.appendChild(b); KT.gelembung[s.id] = b;
  });
  if (yy && KT.label[yy.id]) KT.label[yy.id].hidden = true;
  // kendali
  const kan = r.domElement; let tarik = null;
  kan.addEventListener("pointerdown", (e) => { tarik = { x: e.clientX, s: KT.sudut, gerak: 0 }; kan.setPointerCapture(e.pointerId); });
  kan.addEventListener("pointermove", (e) => { if (!tarik) return; const dx = e.clientX - tarik.x; tarik.gerak = Math.max(tarik.gerak, Math.abs(dx)); KT.sudut = tarik.s - dx * 0.008; });
  kan.addEventListener("pointerup", (e) => { if (tarik && tarik.gerak < 6) _ktKetuk(e); tarik = null; });
  kan.addEventListener("wheel", (e) => { e.preventDefault(); ktZoom(e.deltaY < 0 ? 1 : -1, 0.08); }, { passive: false });
  window.addEventListener("resize", _ktUkur); _ktUkur();
  if (window.ResizeObserver) { KT.ro = new ResizeObserver(() => _ktUkur()); KT.ro.observe(layar); }
  KT.jam = performance.now(); _ktJalan();
}
function _kdTokohDiKursi(s, kursi) {
  const t = _ktTokohBaru(s.jk); t.position.set(kursi.x, 0, kursi.z); t.rotation.y = kursi.hadap;
  t.userData.meja = kursi; t.userData.staf = s; _ktDuduk(t, true); KT.scene.add(t); KT.tokoh[s.id] = t;
}
function _ktUkur() {
  const layar = document.getElementById("kt-layar"); if (!layar || !KT.renderer) return;
  const w = layar.clientWidth, h = layar.clientHeight; if (!w || !h) return;
  const a = w / h, s = (a < 1 ? 14.5 / a : 12) / KT.zoom;
  Object.assign(KT.kamera, { left: -s * a, right: s * a, top: s, bottom: -s }); KT.kamera.updateProjectionMatrix();
  KT.renderer.setSize(w, h);
}
function ktPutar(arah) { KT.sudut += (arah * Math.PI) / 8; }
function ktZoom(arah, langkah = 0.15) { KT.fokus = KT.fokus || { x: 0, z: 3, zoom: KT.zoom }; KT.fokus.zoom = Math.min(3.2, Math.max(0.6, KT.fokus.zoom * (1 + arah * langkah))); }
function _ktProyeksi() { const layar = document.getElementById("kt-layar"); if (!layar || !KT.kamera) return; const w = layar.clientWidth, h = layar.clientHeight; if (!w || !h) return; const a = w / h, s = (a < 1 ? 14.5 / a : 12) / KT.zoom; Object.assign(KT.kamera, { left: -s * a, right: s * a, top: s, bottom: -s }); KT.kamera.updateProjectionMatrix(); }
// ── sorot ruang: ‹ Seluruh Kantor › + AUTO (berpindah sendiri tiap 7 detik) ──
const KT_SOROT = [["Seluruh Kantor", 0, 3, 1], ["Ruang Kepala PKBM", 0, -5, 2.3], ["Ruang Rapat", 0, 3.2, 2.1], ["Ruang Ustadz", -10, -0.5, 1.9], ["Ruang Ustadzah", 10, -0.5, 1.9], ["Gapura & Halaman", 0, 12, 1.9]];
function ktSorot(arah, langsung) {
  KT.sorotI = langsung != null ? langsung : ((KT.sorotI || 0) + arah + KT_SOROT.length) % KT_SOROT.length;
  const [nama, x, z, zoom] = KT_SOROT[KT.sorotI]; KT.fokus = { x, z, zoom };
  const el = document.getElementById("kt-sorot-nama"); if (el) el.textContent = nama;
}
function ktAuto() {
  const b = document.getElementById("kt-auto"); clearInterval(KT.autoT);
  if (KT.autoT && KT.autoAktif) { KT.autoAktif = false; if (b) b.classList.remove("on"); return; }
  KT.autoAktif = true; if (b) b.classList.add("on"); ktSorot(1); KT.autoT = setInterval(() => { if (!KT.buka) return clearInterval(KT.autoT); ktSorot(1); }, 7000);
}
function _ktKetuk(e) {
  const kan = KT.renderer.domElement, kot = kan.getBoundingClientRect();
  const m = new THREE.Vector2(((e.clientX - kot.left) / kot.width) * 2 - 1, -((e.clientY - kot.top) / kot.height) * 2 + 1);
  const ray = new THREE.Raycaster(); ray.setFromCamera(m, KT.kamera);
  const kena = ray.intersectObjects([...Object.values(KT.tokoh), ...(KT.rak || [])], true)[0];
  if (!kena) return; let o = kena.object;
  if (o.userData.rak) { if (typeof ktArsip === "function") ktArsip(o.userData.rak); return; }
  while (o && !o.userData.staf) o = o.parent; if (o) ktKartu(o.userData.staf.id);
}

// ── Ketua Yayasan: kantor yayasan terpisah; datang dengan Fortuner putih lewat gapura saat rapat inti ──
function _kdSiapkanYayasan(s) {
  const t = _ktTokohBaru(s.jk); t.visible = false; t.userData.staf = s; t.userData.meja = { x: -6.2, z: 12.6, hadap: 0 }; t.position.set(-6.2, 0, 12.6);
  KT.scene.add(t); KT.tokoh[s.id] = t; t.userData.diLuar = true;
  // mobil
  const m = new THREE.Group(), putih = _kdKilap(0xf8fafc, 90), hitam = _kdKilap(0x0b0f19, 100);
  m.add(_kdBalok(1.9, 0.7, 4.4, putih, 0, 0.75, 0)); m.add(_kdBalok(1.8, 0.62, 2.6, putih, 0, 1.4, -0.3));
  m.add(_kdBalok(1.82, 0.5, 2.5, hitam, 0, 1.42, -0.3)); m.add(_kdBalok(1.7, 0.08, 0.05, _kdKilap(0xd1d5db, 100), 0, 0.85, 2.22));
  [[-0.85, 1.4], [0.85, 1.4], [-0.85, -1.4], [0.85, -1.4]].forEach(([x, z]) => { const r = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.3, 16), _kdKilap(0x111111, 20)); r.rotation.z = Math.PI / 2; r.position.set(x, 0.38, z); m.add(r); });
  [-0.6, 0.6].forEach((x) => m.add(_kdBalok(0.35, 0.12, 0.04, new THREE.MeshBasicMaterial({ color: 0xfef9c3 }), x, 0.9, 2.21)));
  m.position.set(-26, 0, 16); m.rotation.y = Math.PI / 2; KT.scene.add(m); KT.mobil = m; m.visible = false;
}
function _kdAnimasi(obj, titik, kecepatan = 5) {
  return new Promise((res) => {
    let i = 0;
    const jalan = () => {
      if (!KT.buka) return res();
      const p = titik[i]; if (!p) return res();
      const dx = p.x - obj.position.x, dz = p.z - obj.position.z, d = Math.hypot(dx, dz), v = (kecepatan * 16) / 1000;
      if (d < v) { obj.position.x = p.x; obj.position.z = p.z; i++; } else { obj.position.x += (dx / d) * v; obj.position.z += (dz / d) * v; obj.rotation.y = Math.atan2(dx, dz); }
      setTimeout(jalan, 16);
    };
    jalan();
  });
}
async function kdYayasanDatang() {
  const id = (KT.peran.yayasan || [])[0], t = id && KT.tokoh[id]; if (!t || !KT.mobil || !t.userData.diLuar) return;
  KT.mobil.visible = true; KT.mobil.position.set(-26, 0, 16);
  await _kdAnimasi(KT.mobil, [{ x: 0, z: 16 }, { x: 0, z: 12.4 }, { x: -6.2, z: 12.4 }], 7);
  KT.mobil.rotation.y = Math.PI / 2;
  t.position.set(-3.2, 0, 12.4); t.visible = true; if (KT.label[id]) KT.label[id].hidden = false;
  t.userData.diLuar = false; t.userData.meja = { x: -3.2, z: 12.4, hadap: 0 };
  await _ktBicara(id, "Assalamu'alaikum. Ana ikut menyimak rapatnya.", 1800);
}
async function kdYayasanPulang() {
  const id = (KT.peran.yayasan || [])[0], t = id && KT.tokoh[id]; if (!t || t.userData.diLuar) return;
  await _ktPergi(t, { x: -3.2, z: 12.4, hadap: 0 }, { berdiri: true });
  t.visible = false; if (KT.label[id]) KT.label[id].hidden = true; t.userData.diLuar = true;
  await _kdAnimasi(KT.mobil, [{ x: 0, z: 12.4 }, { x: 0, z: 16 }, { x: 26, z: 16 }], 7);
  KT.mobil.visible = false;
}

// ── layar laptop: mati / menyala (masuk akun) / bekerja (sedang mengerjakan sesuatu) ──
function kdLayar(id, status) {
  const l = KT.layar && KT.layar[id]; if (!l) return;
  l.userData.status = status; l.material.color.setHex(status === "kerja" ? 0x60a5fa : status === "nyala" ? 0x1e40af : 0x0b1220);
}

// ── berjalan: jalur A* + saling memberi jalan ──
function _ktPergi(t, tujuan, opsi = {}) {
  return new Promise((res) => {
    const u = t.userData; _ktDuduk(t, false);
    u.jalur = _kdCari({ x: t.position.x, z: t.position.z }, tujuan); u.tujuan = tujuan; u.berdiri = !!opsi.berdiri; u.selesai = res; u.tunggu = 0;
    if (typeof _ktSiar === "function" && u.staf) _ktSiar("pergi", { id: u.staf.id, tujuan, berdiri: !!opsi.berdiri });
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
  // saling memberi jalan (urutan tetap menurut id) → tidak pernah saling menunggu selamanya
  const aku = (u.staf && u.staf.id) || "";
  const halang = Object.values(KT.tokoh).find((o) => {
    if (o === t || !o.visible) return false; const ou = o.userData;
    const dBaru = Math.hypot(o.position.x - nx, o.position.z - nz); if (dBaru >= 0.62 || dBaru >= Math.hypot(o.position.x - t.position.x, o.position.z - t.position.z)) return false;
    if (ou.jalur) return ((ou.staf && ou.staf.id) || "") > aku;
    return !ou.duduk && u.tunggu < 1.6;
  });
  if (halang) {
    u.tunggu += dt;
    if (u.tunggu > 0.5) { const kx = t.position.x - (dz / d) * v * 0.8, kz = t.position.z + (dx / d) * v * 0.8, [i, j] = _kdSel(kx, kz); if (!_kdTerblok(i, j)) { t.position.x = kx; t.position.z = kz; } }
  } else {
    if (u.tunggu > 0.5) u.jalur = _kdCari({ x: t.position.x, z: t.position.z }, u.tujuan);
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
  // kamera mengikuti ruang yang disorot (‹ › / AUTO), bergeser halus
  const f = KT.fokus || (KT.fokus = { x: 0, z: 3, zoom: KT.zoom }), p = KT.pusat || (KT.pusat = { x: 0, z: 3 }), a = Math.min(1, dt * 3);
  p.x += (f.x - p.x) * a; p.z += (f.z - p.z) * a;
  if (Math.abs(KT.zoom - f.zoom) > 0.002) { KT.zoom += (f.zoom - KT.zoom) * a; _ktProyeksi(); }
  const k = KT.kamera, jarak = 34; k.position.set(p.x + Math.sin(KT.sudut) * jarak, 21, p.z + Math.cos(KT.sudut) * jarak); k.lookAt(p.x, 0.5, p.z);
  Object.values(KT.tokoh).forEach((t) => _kdGerak(t, dt, kini));
  if (KT.pintu) { const dekat = Object.values(KT.tokoh).some((t) => Math.hypot(t.position.x, t.position.z + 2) < 1.9 && t.userData.jalur); const tuju = dekat ? -Math.PI / 2 : 0; KT.pintu.rotation.y += (tuju - KT.pintu.rotation.y) * Math.min(1, dt * 6); }
  // layar laptop yang "bekerja" berkedip pelan
  Object.values(KT.layar || {}).forEach((l) => { if (l.userData.status === "kerja") l.material.color.setHSL(0.6, 0.9, 0.55 + Math.sin(kini / 300) * 0.08); });
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
  if (typeof _ktSiar === "function") _ktSiar("bicara", { id, teks, ms });
  const gb = KT.gelembung[id], t = KT.tokoh[id]; if (!gb || !t || !t.visible) return _ktTunggu(0);
  gb.hidden = false; gb.textContent = teks.length > 160 ? teks.slice(0, 157) + "…" : teks; t.userData.bicara = true;
  return _ktTunggu(ms).then(() => { gb.hidden = true; t.userData.bicara = false; });
}

// ── TV ruang rapat ──
function _kdTvGambar(kini) {
  const c = KT.tvKanvas; if (!c) return; const x = c.getContext("2d"), W = c.width, H = c.height, tv = KT.tv;
  if (tv.mode !== "rapat") {
    const g = x.createLinearGradient(0, 0, W, H); g.addColorStop(0, "#04130e"); g.addColorStop(1, "#0b2a21"); x.fillStyle = g; x.fillRect(0, 0, W, H);
    if (KT.logoImg) { try { x.globalAlpha = 0.9; x.drawImage(KT.logoImg, W / 2 - 70, 30, 140, 140); x.globalAlpha = 1; } catch (e) {} }
    x.fillStyle = "#fde68a"; x.textAlign = "center"; x.font = "800 30px system-ui, sans-serif"; x.fillText("PKBM AL-UMM BARABAI", W / 2, 210);
    x.fillStyle = "#86efac"; x.font = "700 20px system-ui, sans-serif"; x.fillText("Terakreditasi A", W / 2, 240);
    const d = new Date(); x.fillStyle = "#a7f3d0"; x.font = "700 40px system-ui, sans-serif"; x.fillText(`${String(d.getHours()).padStart(2, "0")}.${String(d.getMinutes()).padStart(2, "0")}`, W / 2, 300);
  } else {
    const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#0b1d3a"); g.addColorStop(1, "#08111f"); x.fillStyle = g; x.fillRect(0, 0, W, H);
    x.fillStyle = "#fde68a"; x.textAlign = "left"; x.font = "800 26px system-ui, sans-serif"; x.fillText(tv.judul || "Rapat Koordinasi", 24, 42);
    x.fillStyle = "#ef4444"; x.beginPath(); x.arc(W - 40, 32, 8 + Math.sin(kini / 300) * 2, 0, Math.PI * 2); x.fill(); x.fillStyle = "#fecaca"; x.font = "700 14px system-ui"; x.textAlign = "right"; x.fillText("LANGSUNG", W - 56, 37);
    const data = tv.data && tv.data.length ? tv.data : [{ label: "—", nilai: 1, warna: "#34d399" }], mx = Math.max(1, ...data.map((d) => d.nilai)), lebar = (W - 80) / data.length;
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
function kdTvRapat(judul, data, ticker) { KT.tv = { mode: "rapat", judul, data: data || [], ticker: ticker || "", t0: performance.now() }; if (typeof _ktSiar === "function") _ktSiar("tv", { judul, data, ticker }); }
function kdTvDiam() { KT.tv = { mode: "diam", judul: "", data: [], ticker: "" }; if (typeof _ktSiar === "function") _ktSiar("tv", null); }
// gelas minum di depan peserta rapat (ditambah satu per satu bila ada yang masuk)
function kdMinuman(kursi, tambah) {
  if (!tambah) kdMinumanHapus(); KT.gelas = KT.gelas || [];
  if (typeof _ktSiar === "function") _ktSiar("minum", { kursi, tambah: !!tambah });
  kursi.forEach((k) => {
    const g = new THREE.Group(), dx = Math.sin(k.hadap) * 0.72, dz = Math.cos(k.hadap) * 0.72;
    g.position.set(k.x + dx, 0.85, k.z + dz);
    g.add(_ktKotak(0.26, 0.02, 0.26, 0xf8fafc, 0, 0.01, 0));
    const gl = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.18, 12), new THREE.MeshPhongMaterial({ color: 0xffffff, shininess: 90 })); gl.position.y = 0.1; g.add(gl);
    const isi = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.01, 12), new THREE.MeshLambertMaterial({ color: 0x7c2d12 })); isi.position.y = 0.18; g.add(isi);
    g.scale.setScalar(0.01); KT.scene.add(g); KT.gelas.push(g);
    const mulai = performance.now(); const tumbuh = () => { const p = Math.min(1, (performance.now() - mulai) / 400); g.scale.setScalar(0.01 + p * 0.99); if (p < 1) requestAnimationFrame(tumbuh); }; tumbuh();
  });
}
function kdMinumanHapus() { (KT.gelas || []).forEach((g) => KT.scene && KT.scene.remove(g)); KT.gelas = []; if (typeof _ktSiar === "function") _ktSiar("minumHapus", {}); }

// ── Kepala PKBM berkeliling (Ruang Ustadzah cukup disapa dari depan pintu — menjaga batasan) ──
async function ktKeliling() {
  const kid = (KT.peran.kepala || [])[0], t = kid && KT.tokoh[kid]; if (!t || KT.sibuk || t.userData.jalur || (KT.sesi && KT.sesi.aktif)) return;
  KT.sibuk = true; KT.kelilingT = Date.now();
  try {
    await _ktBicara(kid, "Bismillah, ana keliling sebentar melihat kawan-kawan.", 1800);
    for (const [x, z, sisi, hadap] of [[0, 0.3, null, Math.PI], [-10, 2.6, "L", Math.PI], [4.2, 6.3, "P", Math.PI / 2]]) {
      await _ktPergi(t, { x, z, hadap }, { berdiri: true });
      if (!sisi) continue;
      const tetangga = KT.staf.filter((s) => KT.tokoh[s.id] && KT.tokoh[s.id].visible && s.id !== kid && !(KT.peran.yayasan || []).includes(s.id) && (sisi === "L" ? s.jk !== "P" : s.jk === "P")).slice(0, 2);
      if (sisi === "P") await _ktBicara(kid, "Assalamu'alaikum Ustadzah sekalian, bagaimana pekerjaannya hari ini?", 2400);
      for (const s of tetangga) {
        if (sisi === "L") await _ktBicara(kid, `Assalamu'alaikum Ustadz ${s.nama.split(" ")[0]}, bagaimana pekerjaannya?`, 2200);
        await _ktBicara(s.id, _ktJawabKeliling(s), 2600);
      }
    }
    await _ktPergi(t, KT.kursiKepala);
  } finally { KT.sibuk = false; }
}
function _ktJawabKeliling(s) {
  const k = s.peran[0], kb = KT.kabarCache || {};
  if (/^(peny|admin)-/.test(k)) { const r = k.split("-")[1], n = (kb[r] || []).length; return n ? `Alhamdulillah, ada ${n} kabar baru di ${KT_JENJANG[r]}, insya Allah ana laporkan.` : `Alhamdulillah lancar, ${KT_JENJANG[r]} aman terkendali.`; }
  return { sekretaris: "Alhamdulillah, sedang merapikan data guru & siswa.", bendahara: "Alhamdulillah, sedang memeriksa Kertas Kerja & realisasi BOSP.", dapodik: "Sedang mencocokkan NISN & NIK.", it: "Sedang memeriksa tiket aplikasi." }[k] || "Alhamdulillah, baik.";
}

const _ktGelar = (s) => (s && s.jk === "P" ? "Ustadzah" : "Ustadz");
// ── Teras, halaman parkir, gapura (palang) PKBM & jalan raya ──
function _kdGapura(logo) {
  const sc = KT.scene;
  sc.add(_ktKotak(30.5, 0.2, 1.6, 0xd6d3d1, 0, -0.1, 9.0)); // teras
  const paving = _kdMarmer("#cfcac4", "#a8a29e"); paving.repeat.set(10, 2);
  const hal = new THREE.Mesh(new THREE.BoxGeometry(30, 0.2, 4.6), new THREE.MeshLambertMaterial({ map: paving })); hal.position.set(0, -0.12, 11.9); hal.receiveShadow = true; sc.add(hal); // halaman parkir
  for (let x = -12; x <= -3; x += 2.6) sc.add(_ktKotak(0.08, 0.01, 3.2, 0xffffff, x, 0.0, 12.2)); // garis parkir
  [[-13, 10.6], [13, 10.6], [-13, 13.2], [13, 13.2]].forEach(([x, z]) => { const d = new THREE.Mesh(new THREE.SphereGeometry(0.6, 10, 8), new THREE.MeshLambertMaterial({ color: 0x15803d })); d.position.set(x, 0.6, z); sc.add(d); });
  sc.add(_ktKotak(60, 0.2, 3.6, 0x3f3f46, 0, -0.14, 16)); for (let x = -28; x < 30; x += 3) sc.add(_ktKotak(1.4, 0.01, 0.12, 0xfafafa, x, 0, 16)); // jalan raya
  // pagar depan + gapura
  [[-9.5, 6.2], [9.5, 6.2]].forEach(([x, w]) => _kdTaruh(_ktKotak(w * 2 - 0.4, 0.9, 0.18, 0x84cc16, x, 0.45, 14.2), [w * 2 - 0.4, 0.25]));
  [-3.4, 3.4].forEach((x) => { _kdTaruh(_ktKotak(0.6, 3.4, 0.6, 0x14532d, x, 1.7, 14.2), [0.6, 0.6]); sc.add(_ktKotak(0.76, 0.22, 0.76, 0xc9a227, x, 3.45, 14.2)); });
  sc.add(_ktKotak(7.5, 1.5, 0.25, 0x0f3d2e, 0, 3.05, 14.2)); sc.add(_ktKotak(7.6, 0.08, 0.3, 0xc9a227, 0, 3.82, 14.2)); sc.add(_ktKotak(7.6, 0.08, 0.3, 0xc9a227, 0, 2.28, 14.2));
  const c = document.createElement("canvas"); c.width = 1024; c.height = 200; const x = c.getContext("2d");
  x.fillStyle = "#0f3d2e"; x.fillRect(0, 0, 1024, 200);
  if (logo) { x.save(); x.beginPath(); x.arc(100, 100, 80, 0, Math.PI * 2); x.fillStyle = "#fdf6e3"; x.fill(); x.clip(); try { x.drawImage(logo, 30, 30, 140, 140); } catch (e) {} x.restore(); }
  x.fillStyle = "#fde68a"; x.textAlign = "center"; x.font = "800 64px Plus Jakarta Sans, system-ui, sans-serif"; x.fillText("PKBM AL-UMM BARABAI", 600, 82);
  x.fillStyle = "#a7f3d0"; x.font = "700 28px system-ui, sans-serif"; x.fillText("Paket A  ·  Paket B & C Putra  ·  Paket B & C Putri", 600, 128);
  x.fillStyle = "#c9a227"; x.beginPath(); x.roundRect ? x.roundRect(430, 145, 340, 44, 22) : x.rect(430, 145, 340, 44); x.fill();
  x.fillStyle = "#0f3d2e"; x.font = "800 28px system-ui, sans-serif"; x.fillText("★ TERAKREDITASI A ★", 600, 177);
  const papan = new THREE.Mesh(new THREE.PlaneGeometry(7.3, 1.43), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c) }));
  papan.position.set(0, 3.05, 14.34); sc.add(papan);
  _kdBlokir(-6.2, 12.4, 4.8, 2.2); // tempat parkir mobil yayasan
}

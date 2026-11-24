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
// meja kerja: kayu oak + laci putih + monitor (orang duduk di sisi +z meja). eksekutif = walnut, lis emas, alas kulit.
function _kdMejaKerja(x, z, lebar = 1.5, rotY = 0, eksekutif = false) {
  const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = rotY;
  const atas = eksekutif ? _kdKilap(0x3b2314, 70) : _kdKilap(0xa9774a, 45), kaki = eksekutif ? _kdKilap(0x2a180c, 50) : _kdKilap(0x8b5e34, 40);
  g.add(_kdBalok(lebar, 0.06, 0.8, atas, 0, 0.76, 0));
  if (eksekutif) {
    g.add(_kdBalok(lebar + 0.04, 0.03, 0.84, _kdKilap(0xc9a227, 90), 0, 0.72, 0));
    g.add(_kdBalok(lebar * 0.5, 0.01, 0.4, _kdKilap(0x111827, 20), 0.15, 0.795, 0.08));
    [-1, 1].forEach((a) => g.add(_kdBalok(0.5, 0.72, 0.74, kaki, a * (lebar / 2 - 0.26), 0.37, 0)));
  } else {
    g.add(_kdBalok(0.42, 0.7, 0.72, _kdKilap(0xf1f5f9, 50), lebar / 2 - 0.24, 0.36, 0)); // laci putih
    [0.18, 0.42, 0.62].forEach((y) => g.add(_kdBalok(0.36, 0.008, 0.01, _kdKilap(0x94a3b8, 60), lebar / 2 - 0.24, y, 0.365)));
    g.add(_kdBalok(0.05, 0.72, 0.72, kaki, -lebar / 2 + 0.04, 0.36, 0));
  }
  g.add(_kdBalok(lebar - 0.1, 0.45, 0.03, kaki, 0, 0.5, -0.37)); // panel depan
  // monitor menghadap orang (+z)
  g.add(_kdBalok(0.06, 0.22, 0.06, _kdKilap(0x1f2937, 60), -0.12, 0.9, -0.2)); g.add(_kdBalok(0.26, 0.02, 0.18, _kdKilap(0x1f2937, 60), -0.12, 0.8, -0.2));
  g.add(_kdBalok(0.66, 0.42, 0.04, _kdKilap(0x0b0f19, 80), -0.12, 1.2, -0.23));
  const layar = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.36), new THREE.MeshBasicMaterial({ color: 0x0b1220 })); layar.position.set(-0.12, 1.2, -0.205); g.add(layar);
  g.add(_kdBalok(0.42, 0.015, 0.14, _kdKilap(0xe5e7eb, 60), -0.12, 0.8, 0.12)); // papan ketik
  g.add(_kdBalok(0.1, 0.16, 0.1, _kdKilap(0xf8fafc, 80), lebar / 2 - 0.15, 0.87, -0.22)); // pot kecil
  const daun = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 6), new THREE.MeshLambertMaterial({ color: 0x16a34a })); daun.position.set(lebar / 2 - 0.15, 1.0, -0.22); g.add(daun);
  if (eksekutif) { g.add(_kdBalok(0.05, 0.36, 0.05, _kdKilap(0xc9a227, 90), -lebar / 2 + 0.2, 0.96, -0.25)); g.add(_kdBalok(0.22, 0.08, 0.22, _kdKilap(0x14532d, 30), -lebar / 2 + 0.2, 1.16, -0.2)); }
  KT.scene.add(g); _kdBlokir(x, z, lebar, 0.8);
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

// ── bangun kantor (denah mengikuti gambar rujukan Kepala PKBM) ──
//   Ruang Ustadz x[-15,-5] · Ruang Kepala x[-5,5] z[-8,0] · Ruang Rapat x[-5,1.8] z[0,8]
//   Bendahara x[1.8,5] z[0,5.6] + serambi z[5.6,8] · Ruang Ustadzah x[5,15] · fasad & pintu masuk di z = 8
async function _ktBangun() {
  _kdPetaBaru(); KT.rak = []; KT.layar = {}; KD.dinamis = [];
  const layar = document.getElementById("kt-layar");
  const sc = (KT.scene = new THREE.Scene()); sc.background = new THREE.Color(0xdde8f0);
  const r = (KT.renderer = new THREE.WebGLRenderer({ antialias: true })); r.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFSoftShadowMap; layar.prepend(r.domElement);
  KT.kamera = new THREE.OrthographicCamera(-10, 10, 10, -10, 0.1, 200);
  sc.add(new THREE.HemisphereLight(0xfffaf0, 0x9a8f80, 0.66));
  const mt = new THREE.DirectionalLight(0xfff1d6, 0.55); mt.position.set(10, 22, 14); mt.castShadow = true; mt.shadow.mapSize.set(2048, 2048);
  Object.assign(mt.shadow.camera, { left: -20, right: 20, top: 18, bottom: -18 }); sc.add(mt);
  [[-10, 0], [10, 0], [0, -4], [-1.6, 4], [3.4, 2.6]].forEach(([x, z]) => { const l = new THREE.PointLight(0xffd99a, 0.22, 11); l.position.set(x, 2.8, z); sc.add(l); }); // cahaya hangat tiap ruang
  const logo = await _kdMuatLogo(); KT.logoImg = logo;

  // ── lantai marmer krem satu bangunan + karpet ──
  _kdLantai(30, 16, 0, 0, "#f4eee4", "#b9ad9b");
  const karpet = (w, d, x, z, dasar, tepi) => { sc.add(_ktKotak(w, 0.02, d, dasar, x, 0.012, z)); sc.add(_ktKotak(w + 0.24, 0.015, d + 0.24, tepi, x, 0.006, z)); sc.add(_ktKotak(w - 0.5, 0.022, d - 0.5, tepi, x, 0.013, z, { transparent: true, opacity: 0.25 })); };
  karpet(6.6, 3.6, 0, -3.3, 0x3f4a3c, 0xc9a227);     // karpet ruang kepala (motif: bingkai emas)
  karpet(5.6, 6.6, -1.75, 3.9, 0x14532d, 0xc9a227);  // karpet hijau ruang rapat

  // ── dinding: krem marmer, bilah kayu, tutup hijau tua + lis emas + lampu sorot hangat ──
  const krem = new THREE.MeshPhongMaterial({ color: 0xf3ecdf, shininess: 25 }), kayu = _kdKilap(0x7a4a24, 40), emas = _kdKilap(0xc9a227, 90), hijau = _kdKilap(0x0f3d2e, 30);
  const led = new THREE.MeshBasicMaterial({ color: 0xffe3a3 });
  const dinding = (w, d, x, z, h = 3) => {
    _kdTaruh(_kdBalok(w, h, d, krem, x, h / 2, z), [w, d]);
    sc.add(_kdBalok(w + 0.04, 0.12, d + 0.04, hijau, x, h + 0.06, z));
    sc.add(_kdBalok(w + 0.06, 0.03, d + 0.06, emas, x, h - 0.02, z));
    sc.add(_kdBalok(w + 0.02, 0.03, d + 0.02, led, x, h - 0.12, z)); // pita lampu
    sc.add(_kdBalok(w + 0.02, 0.14, d + 0.02, kayu, x, 0.07, z)); // plint kayu
  };
  const bilah = (x0, x1, z, sisi = 1, h = 2.8) => { for (let x = x0; x <= x1 + 1e-6; x += 0.16) sc.add(_kdBalok(0.07, h, 0.05, kayu, x, h / 2 + 0.05, z + sisi * 0.15)); };
  const bilahZ = (z0, z1, x, sisi = 1, h = 2.8) => { for (let z = z0; z <= z1 + 1e-6; z += 0.16) sc.add(_kdBalok(0.05, h, 0.07, kayu, x + sisi * 0.15, h / 2 + 0.05, z)); };
  dinding(30.4, 0.25, 0, -8.1); dinding(0.25, 16.2, -15.1, 0); dinding(0.25, 16.2, 15.1, 0);
  // sekat Ruang Ustadz / Ustadzah (pintu z 5.8–7.6)
  [-5, 5].forEach((x) => { dinding(0.22, 13.8, x, -1.1); dinding(0.22, 0.5, x, 7.85); });
  // ruang kepala: dinding belakang marmer + bilah kayu kiri-kanan
  bilah(-4.6, -2.5, -8.1, 1); bilah(2.5, 4.6, -8.1, 1);
  sc.add(_kdBalok(4.6, 2.75, 0.06, new THREE.MeshPhongMaterial({ map: _kdMarmer("#f7f4ee", "#a8a29e", 1), shininess: 80 }), 0, 1.45, -7.93));
  bilah(-14.6, -13.2, -8.1, 1); bilah(13.2, 14.6, -8.1, 1); bilah(-6.6, -5.3, -8.1, 1); bilah(5.3, 6.6, -8.1, 1);
  bilahZ(-7.6, -6.4, -5, 1); bilahZ(-7.6, -6.4, 5, -1);

  // kaca (sekat kepala z=0 & ruang bendahara)
  const kaca = new THREE.MeshPhongMaterial({ color: 0xcfe9f5, transparent: true, opacity: 0.22, shininess: 100 });
  const sekatKaca = (x0, x1, z) => { const l = x1 - x0, p = (x0 + x1) / 2; _kdTaruh(_kdBalok(l, 0.9, 0.16, kayu, p, 0.45, z), [l, 0.22]); sc.add(_kdBalok(l, 1.9, 0.05, kaca, p, 1.85, z)); sc.add(_kdBalok(l, 0.05, 0.18, emas, p, 0.92, z)); sc.add(_kdBalok(l, 0.06, 0.18, emas, p, 2.82, z)); };
  const sekatKacaZ = (z0, z1, x) => { const l = z1 - z0, p = (z0 + z1) / 2; _kdTaruh(_kdBalok(0.16, 0.9, l, kayu, x, 0.45, p), [0.22, l]); sc.add(_kdBalok(0.05, 1.9, l, kaca, x, 1.85, p)); sc.add(_kdBalok(0.18, 0.05, l, emas, x, 0.92, p)); sc.add(_kdBalok(0.18, 0.06, l, emas, x, 2.82, p)); };
  sekatKaca(-4.89, -0.05, 0); sekatKaca(1.45, 4.89, 0);          // depan ruang kepala, pintu x -0.05..1.45
  sekatKacaZ(0.1, 5.6, 1.8);                                      // ruang rapat | bendahara
  sekatKaca(1.8, 2.6, 5.6); sekatKaca(3.9, 4.89, 5.6);           // depan bendahara, pintu x 2.6..3.9
  const engsel = new THREE.Group(); engsel.position.set(-0.05, 0, 0);
  engsel.add(_kdBalok(1.5, 2.6, 0.05, kaca, 0.75, 1.3, 0)); engsel.add(_kdBalok(1.5, 0.05, 0.07, emas, 0.75, 2.6, 0)); engsel.add(_kdBalok(0.05, 0.5, 0.08, emas, 1.35, 1.1, 0.05));
  sc.add(engsel); KT.pintu = engsel; KT.pintuPos = { x: 0.7, z: 0 };

  // papan nama ruang (hijau tua, bingkai emas)
  _kdPapan("Ruang Ustadz", "Petugas Ikhwan", -10, 2.35, -7.93, 4.2, "#0f3d2e");
  _kdPapan("Ruang Ustadzah", "Petugas Akhwat", 10, 2.35, -7.93, 4.2, "#0f3d2e");
  _kdPapan("Ruang Rapat", "", -1.75, 2.45, 0.12, 2.6, "#0f3d2e");
  _kdPapan("Bendahara", "", 3.35, 2.45, 5.68, 2.2, "#0f3d2e");

  // ── Ruang Kepala PKBM ──
  if (logo) { const f = new THREE.Mesh(new THREE.CircleGeometry(0.62, 48), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(_kdKanvasLogo(logo, 256, false)) })); f.position.set(0, 2.25, -7.88); sc.add(f); }
  sc.add(_kdBalok(1.5, 0.04, 0.04, led, 0, 2.98, -7.86));
  const mk = _kdMejaKerja(0, -5.8, 2.5, Math.PI, true); KT.layar.__kepala = mk.layar;
  KT.kursiKepala = { x: 0, z: -6.85, hadap: 0 }; _kdKursi(0, -6.85, 0x111827, 0, 0.95);
  const papanKepala = new THREE.Mesh(new THREE.PlaneGeometry(2.1, 0.36), new THREE.MeshBasicMaterial({ map: _ktTeksKanvas("Ruang Kepala PKBM", { latar: "#0f3d2e", ukuran: 58 }) }));
  papanKepala.position.set(0, 0.5, -5.37); sc.add(papanKepala);
  KT.kursiTamu = [{ x: -0.7, z: -4.85, hadap: Math.PI }, { x: 0.7, z: -4.85, hadap: Math.PI }];
  KT.kursiTamu.forEach((k) => _kdKursi(k.x, k.z, 0x6b4226, Math.PI, 0.5));
  const sofa = (x, hadap) => { const g = new THREE.Group(); g.position.set(x, 0, -2.9); g.rotation.y = hadap; const kain = _kdKilap(0xe8dcc4, 20);
    g.add(_kdBalok(1.9, 0.4, 0.85, kain, 0, 0.3, 0)); g.add(_kdBalok(1.9, 0.5, 0.2, kain, 0, 0.7, -0.33)); [-1, 1].forEach((a) => g.add(_kdBalok(0.18, 0.55, 0.85, kain, a * 0.95, 0.42, 0)));
    [-0.45, 0.45].forEach((a) => g.add(_kdBalok(0.8, 0.12, 0.6, _kdKilap(0xf5efe2, 15), a, 0.56, 0.05))); sc.add(g); _kdBlokir(x, -2.9, 0.9, 2.0); };
  sofa(-2.6, Math.PI / 2); sofa(2.6, -Math.PI / 2);
  _kdTaruh(_kdBalok(1.3, 0.06, 0.7, _kdKilap(0x3b2314, 70), 0, 0.42, -2.9), [1.3, 0.7]); sc.add(_kdBalok(1.0, 0.36, 0.5, _kdKilap(0x2a180c, 50), 0, 0.2, -2.9));
  sc.add(_kdBalok(0.3, 0.12, 0.3, _kdKilap(0x16a34a, 20), 0, 0.51, -2.9));
  // TV dasbor di dinding kiri ruang kepala (dipakai juga saat rapat)
  KT.tvKanvas = document.createElement("canvas"); KT.tvKanvas.width = 640; KT.tvKanvas.height = 360; KT.tvTekstur = new THREE.CanvasTexture(KT.tvKanvas);
  sc.add(_kdBalok(0.08, 1.5, 2.6, _kdKilap(0x050507, 90), -4.84, 1.75, -4.9));
  const layarTv = new THREE.Mesh(new THREE.PlaneGeometry(2.45, 1.38), new THREE.MeshBasicMaterial({ map: KT.tvTekstur })); layarTv.position.set(-4.79, 1.75, -4.9); layarTv.rotation.y = Math.PI / 2; sc.add(layarTv);
  _kdTaruh(_kdBalok(0.45, 0.5, 2.4, _kdKilap(0x3b2314, 60), -4.7, 0.25, -4.9), [0.45, 2.4]);
  KT.tv = { mode: "diam", judul: "", data: [], ticker: "", t0: 0 }; _kdTvGambar(0);
  // lemari piala & arsip (kanan) — bisa diketuk
  _kdRak(4.62, -4.9, 2.6, "Pg", -Math.PI / 2);
  [-5.8, -5.2, -4.6, -4.0].forEach((z, i) => { const p = new THREE.Group(); p.position.set(4.62, 2.05, z); p.add(_kdBalok(0.14, 0.05, 0.14, emas, 0, 0, 0)); const c = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.05, 0.22, 12), emas); c.position.y = 0.15; p.add(c); p.scale.setScalar(1 + (i % 2) * 0.25); sc.add(p); });
  [[-4.4, -7.4], [4.4, -7.4]].forEach(([x, z]) => _kdTanaman(x, z));

  // ── Ruang Rapat (seperti sebelumnya): meja pimpinan di depan; USTADZ (kiri) dan USTADZAH (kanan) masing-masing
  //    meja sendiri, semua menghadap pimpinan, dipisah TABIR — tidak ada yang saling berhadapan ──
  const kepalaId = (KT.peran.kepala || [])[0], yayasanId = (KT.peran.yayasan || [])[0], bendId = (KT.peran.bendahara || [])[0];
  const peserta = KT.staf.filter((s) => s.id !== kepalaId && s.id !== yayasanId);
  const kayuMeja = _kdKilap(0x6b3f1f, 70), kayuGelap = _kdKilap(0x2a180c, 50);
  // meja pimpinan (lebar, lis emas, plakat logo)
  _kdTaruh(_kdBalok(2.1, 0.07, 0.5, kayuMeja, -1.75, 0.78, 1.5), [2.1, 0.5]); sc.add(_kdBalok(2.14, 0.03, 0.54, emas, -1.75, 0.74, 1.5));
  sc.add(_kdBalok(2.0, 0.66, 0.05, kayuGelap, -1.75, 0.39, 1.72));
  const plakat = new THREE.Mesh(new THREE.CircleGeometry(0.2, 32), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(_kdKanvasLogo(logo, 256, false)) })); plakat.position.set(-1.75, 0.45, 1.75); sc.add(plakat);
  KT.kursiPimpinan = { x: -2.2, z: 0.8, hadap: 0 }; KT.kursiYayasan = { x: -1.3, z: 0.8, hadap: 0 };
  [KT.kursiPimpinan, KT.kursiYayasan].forEach((k) => _kdKursi(k.x, k.z, 0x6b4226, k.hadap, 0.95, true));
  // meja peserta tunggal (walnut, lis emas, panel depan) — 2 kolom × 3 baris tiap sisi
  const mejaPeserta = (x, z) => {
    sc.add(_kdBalok(0.82, 0.06, 0.46, kayuMeja, x, 0.76, z)); sc.add(_kdBalok(0.86, 0.025, 0.5, emas, x, 0.72, z));
    sc.add(_kdBalok(0.78, 0.6, 0.04, kayuGelap, x, 0.42, z - 0.2)); [-1, 1].forEach((a) => sc.add(_kdBalok(0.04, 0.72, 0.42, kayuGelap, x + a * 0.37, 0.36, z)));
    sc.add(_kdBalok(0.22, 0.07, 0.03, _kdKilap(0xf5efe2, 40), x + 0.2, 0.82, z - 0.12)); // papan nama kecil
    _kdBlokir(x, z, 0.8, 0.45);
  };
  const tempat = (kolom) => { const t = []; [2.5, 4.0, 5.5].forEach((zm) => kolom.forEach((x) => t.push({ meja: { x, z: zm }, kursi: { x, z: zm + 0.55, hadap: Math.PI } }))); return t; };
  const tL = tempat([-4.12, -2.38]), tP = tempat([-0.75, 1.15]);
  tL.forEach((t) => { mejaPeserta(t.meja.x, t.meja.z); _kdKursi(t.kursi.x, t.kursi.z, 0x111827, t.kursi.hadap, 0.8, true); });
  tP.forEach((t) => { mejaPeserta(t.meja.x, t.meja.z); _kdKursi(t.kursi.x, t.kursi.z, 0x3b1d2a, t.kursi.hadap, 0.8, true); });
  KT.kursiIkhwan = tL.map((t) => t.kursi); KT.kursiAkhawat = tP.map((t) => t.kursi);
  // tabir pemisah ustadz | ustadzah
  _kdTaruh(_kdBalok(0.06, 1.5, 4.4, new THREE.MeshPhongMaterial({ color: 0x14532d, transparent: true, opacity: 0.85, shininess: 30 }), -1.75, 0.75, 4.25), [0.08, 4.4]);
  sc.add(_kdBalok(0.09, 0.05, 4.4, emas, -1.75, 1.52, 4.25));
  KT.kursiRapat = [KT.kursiPimpinan, KT.kursiYayasan, ...KT.kursiAkhawat, ...KT.kursiIkhwan];
  // logo PKBM di lantai ruang rapat (depan, dekat pintu masuk)
  const lantaiLogo = new THREE.Mesh(new THREE.CircleGeometry(0.55, 40), new THREE.MeshLambertMaterial({ map: new THREE.CanvasTexture(_kdKanvasLogo(logo, 512, true)) }));
  lantaiLogo.rotation.x = -Math.PI / 2; lantaiLogo.position.set(-1.75, 0.03, 7.1); sc.add(lantaiLogo);
  // dispenser air & meja bundar kecil
  _kdTaruh(_kdBalok(0.45, 1.0, 0.45, _kdKilap(0xf1f5f9, 60), -4.5, 0.5, 0.7), [0.45, 0.45]); sc.add(_ktKotak(0.36, 0.42, 0.36, 0x7dd3fc, -4.5, 1.22, 0.7, { transparent: true, opacity: 0.7 }));
  const mb = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.05, 24), _kdKilap(0xa9774a, 50)); mb.position.set(-4.55, 0.7, 1.35); sc.add(mb); sc.add(_kdBalok(0.08, 0.68, 0.08, emas, -4.55, 0.34, 1.35)); _kdBlokir(-4.55, 1.35, 0.5, 0.5, 0.1);
  [[-4.5, 7.5], [4.55, 7.5]].forEach(([x, z]) => _kdTanaman(x, z));

  // ── Bendahara ──
  const mb2 = _kdMejaKerja(3.0, 2.3, 1.2, Math.PI);
  KT.kursiBendahara = { x: 3.0, z: 1.35, hadap: 0 }; _kdKursi(3.0, 1.35, 0x111827, 0, 0.7);
  _kdTaruh(_kdBalok(0.55, 0.75, 0.45, _kdKilap(0x8b5e34, 40), 2.2, 0.375, 0.45), [0.5, 0.45]); // lemari berkas
  sc.add(_kdBalok(0.48, 0.22, 0.4, _kdKilap(0x334155, 40), 2.2, 0.86, 0.45)); sc.add(_kdBalok(0.3, 0.02, 0.2, _kdKilap(0xf8fafc, 40), 2.2, 0.98, 0.5)); // printer di atas lemari
  _kdTanaman(4.55, 4.9);

  // ── Ruang Ustadz & Ustadzah: meja kerja TUNGGAL berjarak (sekat walnut kiri-kanan), 2 baris × 4 meja;
  //    bagian depan ruangan = Pojok Kopi (meja saji kopi/teh/kue + meja kecil & kursi sesuai jumlah petugas) ──
  _kdRak(-10, -7.62, 6.2, "L"); _kdRak(10, -7.62, 6.2, "P");
  _kdRak(-14.68, -3.5, 3.0, "L", Math.PI / 2); _kdRak(14.68, -3.5, 3.0, "P", -Math.PI / 2);
  [[-14.4, -7.4], [-5.6, -7.4], [14.4, -7.4], [5.6, -7.4], [-5.6, 4.9], [5.6, 4.9]].forEach(([x, z]) => _kdTanaman(x, z));
  const posisi = (sisi) => { const p = []; [-6.15, -4.15, -2.15, -0.15].forEach((z) => [12.0, 8.0].forEach((ax) => p.push({ x: sisi * ax, z, rot: 0, kursi: { x: sisi * ax, z: z + 0.85, hadap: Math.PI } }))); return p; };
  const sekat = (x, z) => { [-1, 1].forEach((a) => { sc.add(_kdBalok(0.05, 0.5, 0.82, _kdKilap(0x6b3f1f, 60), x + a * 0.74, 1.05, z)); sc.add(_kdBalok(0.06, 0.03, 0.84, emas, x + a * 0.74, 1.31, z)); }); sc.add(_kdBalok(1.5, 0.42, 0.04, new THREE.MeshPhongMaterial({ color: 0xd8cbb7, transparent: true, opacity: 0.55 }), x, 1.0, z - 0.41)); };
  const pasang = (s, p) => {
    const m = _kdMejaKerja(p.x, p.z, 1.4, p.rot); KT.layar[s.id] = m.layar; sekat(p.x, p.z);
    _kdKursi(p.kursi.x, p.kursi.z, s.jk === "P" ? 0x3b1d2a : 0x1f2937, p.kursi.hadap, 0.6);
    _kdTokohDiKursi(s, p.kursi);
  };
  const diRuang = peserta.filter((s) => s.id !== bendId);
  const ikhwan = peserta.filter((s) => s.jk !== "P"), akhawat = peserta.filter((s) => s.jk === "P");
  const pL = posisi(-1), pP = posisi(1);
  const rL = diRuang.filter((s) => s.jk !== "P"), rP = diRuang.filter((s) => s.jk === "P");
  rL.forEach((s, i) => pL[i] && pasang(s, pL[i])); rP.forEach((s, i) => pP[i] && pasang(s, pP[i]));
  // meja kosong tetap ada supaya ruangan terlihat penuh
  pL.slice(rL.length).forEach((p) => { _kdMejaKerja(p.x, p.z, 1.4, p.rot); sekat(p.x, p.z); _kdKursi(p.kursi.x, p.kursi.z, 0x1f2937, p.kursi.hadap, 0.6); });
  pP.slice(rP.length).forEach((p) => { _kdMejaKerja(p.x, p.z, 1.4, p.rot); sekat(p.x, p.z); _kdKursi(p.kursi.x, p.kursi.z, 0x3b1d2a, p.kursi.hadap, 0.6); });
  // Pojok Kopi tiap ruang
  KT.pantry = { L: _kdPojokKopi(-1, Math.max(2, rL.length + 1)), P: _kdPojokKopi(1, Math.max(2, rP.length + 1)) };
  const bs = KT.staf.find((s) => s.id === bendId && s.id !== kepalaId && s.id !== yayasanId);
  if (bs) { _kdTokohDiKursi(bs, KT.kursiBendahara); KT.layar[bs.id] = mb2.layar; }
  // kursi rapat tetap per orang
  KT.kursiOrang = {}; ikhwan.forEach((s, i) => (KT.kursiOrang[s.id] = KT.kursiIkhwan[i % KT.kursiIkhwan.length]));
  akhawat.forEach((s, i) => (KT.kursiOrang[s.id] = KT.kursiAkhawat[i % KT.kursiAkhawat.length]));
  const kp = KT.staf.find((s) => s.id === kepalaId); if (kp) { _kdTokohDiKursi(kp, KT.kursiKepala); KT.kursiOrang[kp.id] = KT.kursiPimpinan; KT.layar[kp.id] = mk.layar; }
  const yy = KT.staf.find((s) => s.id === yayasanId); if (yy) { KT.kursiOrang[yy.id] = KT.kursiYayasan; _kdSiapkanYayasan(yy); }
  // titik penting untuk berjalan
  KT.titikPintuP = { x: 4.1, z: 6.75, hadap: Math.PI / 2 };   // depan pintu Ruang Ustadzah (memanggil dari luar)
  KT.titikKeliling = [[0.6, 6.9, null, Math.PI], [-10, 2.2, "L", Math.PI], [KT.titikPintuP.x, KT.titikPintuP.z, "P", Math.PI / 2]];
  _kdFasad(logo);

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
const KT_SOROT = [["Seluruh Kantor", 0, 2.5, 1], ["Ruang Kepala PKBM", 0, -4.4, 2.2], ["Ruang Rapat", -1.6, 3.8, 2.2], ["Ruang Bendahara", 3.4, 3, 2.6], ["Ruang Ustadz", -10, 0, 1.9], ["Ruang Ustadzah", 10, 0, 1.9], ["Pintu Masuk & Halaman", 0, 10, 1.9]];
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
  const k = KT.kamera, jarak = KT.jarak ?? 34; k.position.set(p.x + Math.sin(KT.sudut) * jarak, KT.tinggi ?? 21, p.z + Math.cos(KT.sudut) * jarak); k.lookAt(p.x, 0.5, p.z);
  Object.values(KT.tokoh).forEach((t) => _kdGerak(t, dt, kini));
  if (KT.pintu) { const pp = KT.pintuPos || { x: 0, z: -2 }, dekat = Object.values(KT.tokoh).some((t) => Math.hypot(t.position.x - pp.x, t.position.z - pp.z) < 1.9 && t.userData.jalur); const tuju = dekat ? -Math.PI / 2 : 0; KT.pintu.rotation.y += (tuju - KT.pintu.rotation.y) * Math.min(1, dt * 6); }
  // layar laptop yang "bekerja" berkedip pelan
  Object.values(KT.layar || {}).forEach((l) => { if (l.userData.status === "kerja") l.material.color.setHSL(0.6, 0.9, 0.55 + Math.sin(kini / 300) * 0.08); });
  if (kini - (KT.tvT || 0) > (KT.tv.mode === "rapat" ? 60 : 1000)) { KT.tvT = kini; _kdTvGambar(kini); }
  KT.renderer.render(KT.scene, k);
  const w = KT.renderer.domElement.clientWidth, h = KT.renderer.domElement.clientHeight, v = new THREE.Vector3();
  Object.entries(KT.tokoh).forEach(([id, t]) => {
    v.set(t.position.x, 2.1, t.position.z).project(k);
    const x = (v.x * 0.5 + 0.5) * w, y = (-v.y * 0.5 + 0.5) * h, lb = KT.label[id], gb = KT.gelembung[id];
    if (lb) lb.style.transform = `translate(${Math.round(x)}px,${Math.round(y)}px) translate(-50%,-100%)`;
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
    for (const [x, z, sisi, hadap] of KT.titikKeliling || [[0, 0.3, null, Math.PI], [-10, 2.6, "L", Math.PI], [4.2, 6.3, "P", Math.PI / 2]]) {
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
// ── Pojok Kopi: meja saji di dinding samping (mesin kopi, teko teh, kue, toples camilan) +
//    meja bundar kecil berkursi dua; jumlah kursi menyesuaikan jumlah petugas di ruang itu ──
function _kdPojokKopi(sisi, nKursi) {
  const sc = KT.scene, kayu = _kdKilap(0x6b3f1f, 60), emas = _kdKilap(0xc9a227, 90), xd = sisi * 14.55;
  _kdTaruh(_kdBalok(0.62, 0.9, 3.4, kayu, xd, 0.45, 4.3), [0.62, 3.4]); sc.add(_kdBalok(0.66, 0.05, 3.44, _kdKilap(0xf5efe2, 70), xd, 0.92, 4.3)); sc.add(_kdBalok(0.66, 0.03, 3.44, emas, xd, 0.88, 4.3));
  const mesin = new THREE.Group(); mesin.position.set(xd, 0.95, 3.0);
  mesin.add(_kdBalok(0.4, 0.5, 0.36, _kdKilap(0x1f2937, 80), 0, 0.25, 0)); mesin.add(_kdBalok(0.3, 0.06, 0.2, _kdKilap(0xd1d5db, 100), 0, 0.06, sisi * 0)); mesin.add(_kdBalok(0.12, 0.08, 0.02, new THREE.MeshBasicMaterial({ color: 0x22c55e }), sisi * -0.21, 0.38, 0)); sc.add(mesin);
  const teko = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.13, 0.25, 16), _kdKilap(0xc9a227, 90)); teko.position.set(xd, 1.08, 3.7); sc.add(teko);
  [4.2, 4.5].forEach((z, i) => { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.04, 0.09, 12), _kdKilap(0xf8fafc, 90)); c.position.set(xd + sisi * -0.1, 1.0, z); sc.add(c); });
  const piring = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.02, 24), _kdKilap(0xf8fafc, 80)); piring.position.set(xd, 0.96, 5.0); sc.add(piring);
  [[-0.08, 0xb45309], [0.08, 0xf59e0b], [0, 0x7c2d12]].forEach(([dz, w], i) => sc.add(_kdBalok(0.1, 0.06, 0.1, _kdKilap(w, 30), xd + (i - 1) * 0.08, 1.0, 5.0 + dz))); // kue
  [5.55, 5.8].forEach((z, i) => { const t = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.22, 16), new THREE.MeshPhongMaterial({ color: 0xe0f2fe, transparent: true, opacity: 0.6 })); t.position.set(xd, 1.06, z); sc.add(t); sc.add(_kdBalok(0.13, 0.08, 0.13, _kdKilap(i ? 0xdc2626 : 0x16a34a, 30), xd, 1.0, z)); }); // toples camilan
  const papan = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 0.33), new THREE.MeshBasicMaterial({ map: _ktTeksKanvas("☕ Pojok Kopi", { latar: "#0f3d2e", ukuran: 54 }) }));
  papan.position.set(sisi * 14.95, 2.05, 4.3); papan.rotation.y = -sisi * Math.PI / 2; sc.add(papan);
  // meja kecil + kursi
  const kursi = [], nMeja = Math.min(6, Math.ceil(nKursi / 2));
  const pos = [[12.9, 3.4], [10.8, 3.4], [8.7, 3.4], [12.9, 5.6], [10.8, 5.6], [8.7, 5.6]].slice(0, nMeja);
  pos.forEach(([ax, z]) => {
    const x = sisi * ax, d = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.04, 28), _kdKilap(0xf5efe2, 70)); d.position.set(x, 0.74, z); d.castShadow = true; sc.add(d);
    sc.add(_kdBalok(0.06, 0.72, 0.06, emas, x, 0.36, z)); const kaki = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.03, 20), emas); kaki.position.set(x, 0.015, z); sc.add(kaki);
    const gelas = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.035, 0.08, 12), _kdKilap(0xf8fafc, 90)); gelas.position.set(x + 0.1, 0.8, z); sc.add(gelas);
    _kdBlokir(x, z, 0.72, 0.72, 0.1);
    [[-0.62, Math.PI / 2], [0.62, -Math.PI / 2]].forEach(([dx, h]) => { const k = { x: x + dx, z, hadap: h }; _kdKursi(k.x, k.z, 0x725139, h, 0.45, true); kursi.push(k); });
  });
  return kursi;
}
// ── Fasad depan (rujukan): dinding depan krem + pita hijau tua, panel kisi-kisi khas, lampu dinding,
//    pot tanaman memanjang, pintu masuk utama berbingkai hijau-emas dengan papan nama; halaman & jalan ──
function _kdKisi() {
  const c = document.createElement("canvas"); c.width = c.height = 256; const x = c.getContext("2d");
  x.fillStyle = "#e9d9b4"; x.fillRect(0, 0, 256, 256); x.strokeStyle = "#8a6a3a"; x.lineWidth = 3;
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
    const cx = 32 + i * 64, cy = 32 + j * 64;
    [0, Math.PI / 4].forEach((r) => { x.save(); x.translate(cx, cy); x.rotate(r); x.strokeRect(-18, -18, 36, 36); x.restore(); });
    x.beginPath(); x.arc(cx, cy, 7, 0, Math.PI * 2); x.stroke();
  }
  x.strokeStyle = "#c9a227"; x.lineWidth = 8; x.strokeRect(4, 4, 248, 248);
  return new THREE.CanvasTexture(c);
}
function _kdFasad(logo) {
  const sc = KT.scene, krem = new THREE.MeshPhongMaterial({ map: _kdMarmer("#f3ecdf", "#b8ad9c", 3), shininess: 50 });
  const hijau = _kdKilap(0x0f3d2e, 30), emas = _kdKilap(0xc9a227, 90), led = new THREE.MeshBasicMaterial({ color: 0xffe3a3 });
  // dinding depan rendah (pintu masuk x -1.3..1.3)
  [[-8.15, 13.7], [8.15, 13.7]].forEach(([x, w]) => {
    _kdTaruh(_kdBalok(w, 1.35, 0.3, krem, x, 0.675, 8.15), [w, 0.32]);
    sc.add(_kdBalok(w + 0.02, 0.36, 0.34, hijau, x, 0.18, 8.15)); sc.add(_kdBalok(w + 0.02, 0.03, 0.36, emas, x, 0.37, 8.15));
    sc.add(_kdBalok(w + 0.04, 0.1, 0.36, hijau, x, 1.4, 8.15)); sc.add(_kdBalok(w + 0.06, 0.03, 0.38, emas, x, 1.34, 8.15));
  });
  const kisi = _kdKisi();
  [-11.6, -5.4, 5.4, 11.6].forEach((x) => { const p = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.78), new THREE.MeshLambertMaterial({ map: kisi })); p.position.set(x, 0.82, 8.31); sc.add(p); sc.add(_kdBalok(1.58, 0.86, 0.02, emas, x, 0.82, 8.305)); });
  [-14.4, -8.5, -2.6, 2.6, 8.5, 14.4].forEach((x) => { sc.add(_kdBalok(0.12, 0.2, 0.08, emas, x, 1.05, 8.33)); sc.add(_kdBalok(0.08, 0.12, 0.02, led, x, 1.05, 8.375)); }); // lampu dinding
  // pot tanaman memanjang + semak + pohon kecil
  [[-8.3, 11.6], [8.3, 11.6]].forEach(([x, w]) => {
    _kdTaruh(_kdBalok(w, 0.42, 0.6, hijau, x, 0.21, 8.75), [w, 0.6]); sc.add(_kdBalok(w + 0.04, 0.03, 0.64, emas, x, 0.43, 8.75));
    for (let k = -w / 2 + 0.4; k < w / 2; k += 0.62) { const b = new THREE.Mesh(new THREE.SphereGeometry(0.27 + (Math.abs(k * 7) % 3) * 0.03, 10, 8), new THREE.MeshLambertMaterial({ color: (Math.round(k * 3) % 2) ? 0x15803d : 0x22c55e })); b.position.set(x + k, 0.62, 8.75); b.castShadow = true; sc.add(b); }
  });
  [-13.4, 13.4, -3.2, 3.2].forEach((x, i) => {
    const tinggi = i < 2 ? 1.6 : 0.9; sc.add(_kdBalok(0.1, tinggi, 0.1, _kdKilap(0x5b3a1e, 20), x, 0.42 + tinggi / 2, 8.75));
    [0, 1, 2].forEach((k) => { const d = new THREE.Mesh(new THREE.SphereGeometry((i < 2 ? 0.55 : 0.4) - k * 0.1, 12, 10), new THREE.MeshLambertMaterial({ color: k % 2 ? 0x16a34a : 0x15803d })); d.position.set(x + (k - 1) * 0.15, 0.42 + tinggi + k * 0.3, 8.75); d.castShadow = true; sc.add(d); });
  });
  // pintu masuk utama: bingkai hijau tua + lis & lampu emas + papan nama
  [-1.55, 1.55].forEach((x) => { _kdTaruh(_kdBalok(0.5, 3.5, 0.7, hijau, x, 1.75, 8.35), [0.5, 0.7]); sc.add(_kdBalok(0.06, 3.0, 0.04, led, x + (x < 0 ? 0.26 : -0.26), 1.6, 8.55)); sc.add(_kdBalok(0.54, 0.05, 0.74, emas, x, 3.5, 8.35)); });
  sc.add(_kdBalok(3.7, 1.0, 0.75, hijau, 0, 3.15, 8.35)); sc.add(_kdBalok(3.74, 0.05, 0.8, emas, 0, 3.66, 8.35)); sc.add(_kdBalok(3.74, 0.05, 0.8, emas, 0, 2.64, 8.35));
  [-1, 1].forEach((a) => sc.add(_kdBalok(1.1, 2.4, 0.04, new THREE.MeshPhongMaterial({ color: 0xbfe3f2, transparent: true, opacity: 0.25, shininess: 100 }), a * 1.95, 1.2, 7.98))); // pintu kaca terbuka
  const c = document.createElement("canvas"); c.width = 1024; c.height = 280; const x = c.getContext("2d");
  const gr = x.createLinearGradient(0, 0, 0, 280); gr.addColorStop(0, "#124a37"); gr.addColorStop(1, "#0b2f23"); x.fillStyle = gr; x.fillRect(0, 0, 1024, 280);
  x.strokeStyle = "#c9a227"; x.lineWidth = 8; x.strokeRect(10, 10, 1004, 260);
  x.beginPath(); x.arc(130, 140, 92, 0, Math.PI * 2); x.fillStyle = "#fdf6e3"; x.fill(); x.lineWidth = 6; x.stroke();
  if (logo) { x.save(); x.beginPath(); x.arc(130, 140, 86, 0, Math.PI * 2); x.clip(); try { x.drawImage(logo, 50, 60, 160, 160); } catch (e) {} x.restore(); }
  x.textAlign = "center"; x.fillStyle = "#f5d77a"; x.font = "800 70px Plus Jakarta Sans, system-ui, sans-serif"; x.fillText("PKBM AL-UMM BARABAI", 610, 92);
  x.fillStyle = "#fdf6e3"; x.font = "700 34px system-ui, sans-serif"; x.fillText("Pusat Pendidikan Kesetaraan Berkualitas", 610, 144);
  x.fillStyle = "#e9c46a"; x.font = "600 27px system-ui, sans-serif"; x.fillText("- Belajar  ·  Berkarya  ·  Berakhlak Mulia -", 610, 190);
  x.fillStyle = "#c9a227"; x.beginPath(); x.roundRect ? x.roundRect(455, 208, 310, 44, 22) : x.rect(455, 208, 310, 44); x.fill();
  x.fillStyle = "#0b2f23"; x.font = "800 25px system-ui, sans-serif"; x.fillText("★ TERAKREDITASI A ★", 610, 239);
  const papan = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 0.98), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c) })); papan.position.set(0, 3.15, 8.73); sc.add(papan);
  // anak tangga marmer, teras, halaman parkir, jalan raya
  sc.add(_kdBalok(4.2, 0.12, 0.6, krem, 0, 0.06, 8.75)); sc.add(_kdBalok(4.8, 0.06, 0.7, krem, 0, 0.03, 9.35));
  const paving = _kdMarmer("#d6d0c7", "#a8a29e"); paving.repeat.set(12, 3);
  const hal = new THREE.Mesh(new THREE.BoxGeometry(31, 0.2, 5.6), new THREE.MeshLambertMaterial({ map: paving })); hal.position.set(0, -0.12, 11.9); hal.receiveShadow = true; sc.add(hal);
  for (let gx = -12; gx <= -3; gx += 2.6) sc.add(_ktKotak(0.08, 0.01, 3.0, 0xffffff, gx, 0.0, 12.4));
  sc.add(_ktKotak(60, 0.2, 3.6, 0x3f3f46, 0, -0.14, 16)); for (let gx = -28; gx < 30; gx += 3) sc.add(_ktKotak(1.4, 0.01, 0.12, 0xfafafa, gx, 0, 16));
  [[-14, 13.8], [14, 13.8], [-8, 14.1], [8, 14.1]].forEach(([px, pz]) => { const d = new THREE.Mesh(new THREE.SphereGeometry(0.55, 10, 8), new THREE.MeshLambertMaterial({ color: 0x15803d })); d.position.set(px, 0.55, pz); sc.add(d); });
  _kdBlokir(-6.2, 12.4, 4.8, 2.2); // tempat parkir mobil yayasan
}

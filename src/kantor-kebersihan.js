// ============================================================
//  KANTOR MAYA — PETUGAS KEBERSIHAN (hiasan hidup, bukan data petugas)
//  • Ikhwan (seragam biru muda) di Ruang Ustadz, akhwat (gamis biru dongker, bercadar) di Ruang Ustadzah.
//  • Berkeliling ke titik-titik ruangan, mengepel sebentar, berpindah lagi. Saat stok Pojok Kopi kurang,
//    petugas kebersihan yang mengisi ulang. Tidak masuk ke Ruang Rapat ketika rapat berlangsung.
// ============================================================
const KBR = { aktif: false };
const KBR_TITIK = { L: [[-10, -5.1], [-10, -3.1], [-10, -1.1], [-10, 1.6], [-6.2, -5], [-6.2, -1], [-6.4, 2.6], [-13.8, -1], [-13.8, 1.6], [-9.2, 6.8], [-12.6, 6.9], [-7.3, 3.0]], P: [] };
KBR_TITIK.P = KBR_TITIK.L.map(([x, z]) => [-x, z]);
const KBR_UCAP = ["Bismillah, ana bersihkan dulu ya.", "Afwan, lantainya masih basah, hati-hati.", "Alhamdulillah, sudah bersih.", "Tempat sampah sudah ana kosongkan."];
function _kbBuat(sisi) {
  const jk = sisi === "L" ? "L" : "P", t = _ktTokohBaru(jk), id = "npc-kebersihan-" + sisi;
  t.traverse((o) => {
    if (!o.isMesh) return; const h = o.material.color.getHex();
    if (jk === "L" && (h === 0xf8fafc || h === 0xf1f5f9)) { o.material = o.material.clone(); o.material.color.setHex(0x7dd3fc); }
    if (jk === "P" && h === 0x15151a) { o.material = o.material.clone(); o.material.color.setHex(0x1e3a5f); }
    o.userData.npcRoot = true;
    // samakan bahan dengan petugas lain (PBR, warna sRGB)
    if (THREE.MeshStandardMaterial && (o.material.isMeshLambertMaterial || o.material.isMeshPhongMaterial)) o.material = new THREE.MeshStandardMaterial({ color: o.material.color.clone().convertSRGBToLinear(), roughness: 0.8, metalness: 0 });
  });
  // alat pel
  const pel = new THREE.Group(); pel.position.set(0.28, 0.75, 0.22);
  const gagang = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 1.2, 8), new THREE.MeshLambertMaterial({ color: 0xd1d5db })); gagang.position.y = 0; pel.add(gagang);
  const kepala = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.05, 0.1), new THREE.MeshLambertMaterial({ color: 0x60a5fa })); kepala.position.y = -0.6; pel.add(kepala);
  pel.rotation.x = 0.35; t.userData.badan.add(pel); t.userData.pel = pel;
  const awal = KBR_TITIK[sisi][3]; t.position.set(awal[0], 0, awal[1]);
  t.userData.npc = true; t.userData.npcRoot = true; t.userData.meja = { x: awal[0], z: awal[1], hadap: 0 }; t.userData.berdiri = true;
  KT.scene.add(t); KT.tokoh[id] = t;
  const ham = document.getElementById("kt-hamparan");
  if (ham) {
    const d = document.createElement("button"); d.className = "kt-label kb-label"; d.style.setProperty("--w", "#0369a1");
    d.innerHTML = `<b>Kebersihan</b><small>${jk === "L" ? "Petugas Ikhwan" : "Petugas Akhwat"}</small>`;
    d.onclick = () => _ktBicara(id, jk === "L" ? "Assalamu'alaikum, ana sedang bersih-bersih ruangan." : "Assalamu'alaikum, ana sedang membersihkan ruangan.", 2600);
    ham.appendChild(d); KT.label[id] = d;
    const b = document.createElement("div"); b.className = "kt-gelembung"; b.hidden = true; ham.appendChild(b); KT.gelembung[id] = b;
  }
  (KT.npc = KT.npc || {})[sisi] = { id, t };
  return id;
}
async function _kbPutar(sisi) {
  const n = KT.npc && KT.npc[sisi]; if (!n) return;
  let i = 3;
  while (KT.buka && KBR.aktif && KT.npc && KT.npc[sisi] === n) {
    if (n.isiStok) { const info = KT.pantryInfo && KT.pantryInfo[sisi]; if (info) { await _ktPergi(n.t, info.antre[0], { berdiri: true }); await _ktTunggu(1200); info.stok.cangkir.forEach((c) => (c.visible = true)); info.stok.kue.forEach((k) => (k.visible = true)); _ktBicara(n.id, "Stok kopi dan kue sudah ana isi lagi.", 2400); } n.isiStok = false; }
    i = (i + 1 + Math.floor(Math.random() * 3)) % KBR_TITIK[sisi].length;
    const [x, z] = KBR_TITIK[sisi][i];
    await _ktPergi(n.t, { x, z, hadap: Math.random() * Math.PI * 2 }, { berdiri: true });
    if (!KT.buka) return;
    if (Math.random() < 0.3) _ktBicara(n.id, KBR_UCAP[Math.floor(Math.random() * KBR_UCAP.length)], 2600);
    const pel = n.t.userData.pel, mulai = performance.now();
    await new Promise((r) => { const iv = setInterval(() => { if (!KT.buka || performance.now() - mulai > 5000) { clearInterval(iv); if (pel) pel.rotation.z = 0; return r(); } if (pel) pel.rotation.z = Math.sin((performance.now() - mulai) / 180) * 0.5; }, 60); });
    await _ktTunggu(1500 + Math.random() * 2500);
  }
}
function kbMintaIsiStok(sisi) { const n = KT.npc && KT.npc[sisi]; if (n) n.isiStok = true; return !!n; }
(function () {
  if (typeof _ktBangun === "function") {
    const a = _ktBangun;
    _ktBangun = async function () {
      await a.apply(this, arguments);
      try { KT.npc = {}; KBR.aktif = true; _kbBuat("L"); _kbBuat("P"); setTimeout(() => { _kbPutar("L"); _kbPutar("P"); }, 6000); } catch (e) { console.warn("Petugas kebersihan:", e); }
    };
  }
  if (typeof ktTutup === "function") { const a = ktTutup; ktTutup = function () { KBR.aktif = false; KT.npc = {}; return a.apply(this, arguments); }; }
})();

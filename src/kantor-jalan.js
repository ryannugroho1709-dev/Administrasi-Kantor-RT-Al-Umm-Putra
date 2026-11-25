// ============================================================
//  🕹️ MODE JALAN — menjelajah Kantor Maya seperti orang di dalam miniatur
//  • Kamera di belakang tokoh (atau pandangan mata), bisa diputar; joystick di HP, W/A/S/D/panah di komputer.
//  • Tokoh sendiri (bila petugas kantor) atau tokoh "Tamu" bila belum punya meja. Gerakan hanya di perangkat ini.
//  • Pintu bisa dibuka-tutup (tombol / tekan E): Ruang Kepala, Bendahara, Ruang Ustadz, Ruang Ustadzah.
//    Pintu tertutup tidak bisa ditembus; petugas lain tetap membuka pintu sendiri saat lewat.
//  • Adab: ikhwan tidak masuk Ruang Ustadzah & saf akhwat (cukup salam dari depan pintu), dan sebaliknya.
//  • Duduk di kursi kosong terdekat, menyapa orang di dekatnya (mereka menjawab salam).
//  Kait di kantor-3d.js: KT.kameraHook (kamera), userData.dikendalikan (gerak), KT.pintuPaksa (pintu Kepala).
// ============================================================
const KJL = { aktif: false, t: null, id: null, tamu: false, yaw: Math.PI, pitch: 0.38, jarak: 3.6, mata: false, kam: null, posKam: null,
  maju: 0, belok: 0, geser: 0, lari: false, tombol: {}, joy: null, lihat: null, aksiT: 0, aksi: [], pesanT: 0, langkah: 0 };
const KJL_RUANG = [
  ["Ruang Kepala PKBM", -5, 5, -8.2, 0], ["Ruang Rapat", -5, 1.8, 0, 8.1], ["Ruang Bendahara", 1.8, 5, 0, 5.6], ["Serambi", 1.8, 5, 5.6, 8.1],
  ["Ruang Ustadz", -15.2, -5, -8.2, 8.1], ["Ruang Ustadzah", 5, 15.2, -8.2, 8.1], ["Musholla Al-Umm", 6.3, 14.1, 9.9, 13.9], ["Halaman Depan", -15.2, 15.2, 8.1, 14.2], ["Jalan Raya", -16, 16, 14.2, 18],
];
const _kjlRuang = (x, z) => (KJL_RUANG.find(([, x0, x1, z0, z1]) => x >= x0 && x < x1 && z >= z0 && z < z1) || ["Kantor"])[0];
const _kjlJk = () => (KJL.t && KJL.t.userData.jk) || "L";
function _kjlLarang(x, z, jk) {
  if (jk !== "P") { if (x > 5.25 && x < 15.2 && z > -8.2 && z < 8.1) return "Ruang Ustadzah khusus akhwat — cukup ucapkan salam dari depan pintu"; if (x > 6.3 && x < 10.25 && z > 9.9 && z < 13.9) return "Saf ustadzah di balik tabir"; }
  else { if (x < -5.25 && x > -15.2 && z > -8.2 && z < 8.1) return "Ruang Ustadz khusus ikhwan — cukup ucapkan salam dari depan pintu"; if (x > 10.35 && x < 14.1 && z > 9.9 && z < 13.9) return "Saf ustadz di depan tabir"; }
  return null;
}

// ── PINTU ──
function _kjlBuatPintu() {
  const sc = KT.scene; if (!sc) return; KT.pintuJalan = [];
  const kayu = new THREE.MeshPhongMaterial({ color: 0x7a4a24, shininess: 40 }), emas = new THREE.MeshPhongMaterial({ color: 0xc9a227, shininess: 90 });
  const kaca = new THREE.MeshPhongMaterial({ color: 0xcfe9f5, transparent: true, opacity: 0.25, shininess: 100 });
  const daun = (bahan, panjang, sumbuZ) => {
    const g = new THREE.Group();
    const m = new THREE.Mesh(new THREE.BoxGeometry(sumbuZ ? 0.06 : panjang, 2.55, sumbuZ ? panjang : 0.06), bahan);
    m.position.set(sumbuZ ? 0 : panjang / 2, 1.3, sumbuZ ? panjang / 2 : 0); m.castShadow = bahan === kayu; g.add(m);
    const gg = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.18), emas); gg.position.set(sumbuZ ? 0 : panjang - 0.15, 1.05, sumbuZ ? panjang - 0.15 : 0); if (!sumbuZ) gg.rotation.y = Math.PI / 2; g.add(gg);
    return g;
  };
  // { nama, poros(x,z engsel), objek, buka(sudut), kotak tertutup [x0,x1,z0,z1], khusus (jk pemilik ruang) }
  const pasang = (nama, x, z, panjang, sumbuZ, bahan, sudutBuka, kotak, khusus) => {
    const g = daun(bahan, panjang, sumbuZ); g.position.set(x, 0, z); sc.add(g);
    KT.pintuJalan.push({ nama, obj: g, sudutBuka, kotak, khusus, buka: false, pusat: { x: (kotak[0] + kotak[1]) / 2, z: (kotak[2] + kotak[3]) / 2 }, tBuka: 0 });
  };
  pasang("Pintu Ruang Ustadz", -5, 5.8, 1.8, true, kayu, -Math.PI / 2, [-5.3, -4.7, 5.8, 7.6], "L");
  pasang("Pintu Ruang Ustadzah", 5, 5.8, 1.8, true, kayu, Math.PI / 2, [4.7, 5.3, 5.8, 7.6], "P");
  pasang("Pintu Ruang Bendahara", 2.6, 5.6, 1.3, false, kaca, -Math.PI / 2, [2.6, 3.9, 5.35, 5.85], null);
  // pintu kaca Ruang Kepala yang sudah ada (digerakkan kantor-3d.js lewat KT.pintuPaksa)
  if (KT.pintu) KT.pintuJalan.push({ nama: "Pintu Ruang Kepala", obj: KT.pintu, sudutBuka: -Math.PI / 2, kotak: [-0.05, 1.45, -0.25, 0.25], khusus: null, buka: false, pusat: { x: 0.7, z: 0 }, lama: true });
}
const _kjlTerbuka = (p) => Math.abs(p.obj.rotation.y) > 0.9;
function _kjlGerakPintu(dt) {
  const k = Math.min(1, dt * 5), aku = KJL.aktif ? KJL.t : null;
  (KT.pintuJalan || []).forEach((p) => {
    // petugas lain yang sedang berjalan melewati pintu membukanya sendiri
    const lewat = Object.values(KT.tokoh || {}).some((t) => t !== aku && t.visible && t.userData.jalur && Math.hypot(t.position.x - p.pusat.x, t.position.z - p.pusat.z) < 1.9);
    // pintu yang dibuka pengguna menutup sendiri bila sudah ditinggal jauh beberapa saat
    if (p.buka && aku && Math.hypot(aku.position.x - p.pusat.x, aku.position.z - p.pusat.z) > 4) { p.tBuka += dt; if (p.tBuka > 8) p.buka = false; } else p.tBuka = 0;
    if (p.lama) { KT.pintuPaksa = p.buka; return; }
    const tuju = p.buka || lewat ? p.sudutBuka : 0; p.obj.rotation.y += (tuju - p.obj.rotation.y) * k;
  });
}
function _kjlKenaPintu(x, z) { return (KT.pintuJalan || []).find((p) => !_kjlTerbuka(p) && x > p.kotak[0] - 0.18 && x < p.kotak[1] + 0.18 && z > p.kotak[2] - 0.18 && z < p.kotak[3] + 0.18); }
function _kjlBebas(x, z) {
  const [i, j] = _kdSel(x, z);
  if (!_kdDalam(i, j) || KD.blok[j * KD.NX + i] === 1) return { ok: false };
  const p = _kjlKenaPintu(x, z); if (p) return { ok: false, pintu: p };
  const l = _kjlLarang(x, z, _kjlJk()); if (l) return { ok: false, larang: l };
  return { ok: true };
}

// ── MULAI / SELESAI ──
function ktModeJalan(nyala) {
  if (nyala === undefined) nyala = !KJL.aktif;
  if (!nyala) return _kjlSelesai();
  if (!KT.buka || !KT.scene) return;
  if (!KT.pintuJalan) _kjlBuatPintu();
  let t = STATE.guruId && KT.tokoh[STATE.guruId], id = STATE.guruId;
  if (t && !t.visible) t = null;
  if (!t) { // tamu: tokoh sementara di depan pintu masuk
    const g = (typeof LOOKUP !== "undefined" && (LOOKUP.guruAll || []).find((x) => x.id === STATE.guruId)) || {};
    const jk = typeof _ktJk === "function" && g.id ? _ktJk(g) : "L";
    id = "kjl:tamu"; t = _ktTokohBaru(jk); t.position.set(0, 0, 10.2); t.userData.npc = true; KT.scene.add(t); KT.tokoh[id] = t;
    const ham = document.getElementById("kt-hamparan");
    if (ham) {
      const d = document.createElement("button"); d.className = "kt-label kjl-label"; d.style.setProperty("--w", "#0ea5e9");
      d.innerHTML = `<b>Anda</b><small>${_ktE(String(g.nama || STATE.guruNama || "Tamu").replace(/\s*,.*$/, ""))}</small>`; ham.appendChild(d); KT.label[id] = d;
      const b = document.createElement("div"); b.className = "kt-gelembung"; b.hidden = true; ham.appendChild(b); KT.gelembung[id] = b;
    }
    KJL.tamu = true; KJL.yaw = Math.PI;
  } else { KJL.tamu = false; KJL.yaw = t.rotation.y; }
  const u = t.userData; u.jalur = null; u.selesai && u.selesai(); u.selesai = null; u.dikendalikan = true; u.khSibuk = true;
  if (typeof _ktDuduk === "function") _ktDuduk(t, false);
  KJL.t = t; KJL.id = id; KJL.aktif = true; KJL.mata = false; KJL.posKam = null;
  KJL.kam = KJL.kam || new THREE.PerspectiveCamera(62, 1, 0.05, 160);
  KT.kameraHook = _kjlKamera;
  _kjlHud(true); document.getElementById("kantor-ai")?.classList.add("kjl-on");
  document.getElementById("kjl-btn")?.classList.add("on");
  toast(KJL.tamu ? "Mode Jalan — Anda masuk sebagai tamu dari pintu depan" : "Mode Jalan — Anda mengendalikan tokoh Anda sendiri", "ok");
}
function _kjlSelesai() {
  if (!KJL.aktif) return;
  const t = KJL.t, u = t && t.userData;
  KJL.aktif = false; KT.kameraHook = _kjlKamera; KT.pintuPaksa = false; // kait tetap ada untuk pintu (KT.pintuJalan || []).forEach((p) => { p.buka = false; });
  if (t) {
    t.traverse((o) => { if (o.isMesh) o.visible = true; });
    if (KJL.tamu) { KT.scene.remove(t); delete KT.tokoh[KJL.id]; KT.label[KJL.id]?.remove(); KT.gelembung[KJL.id]?.remove(); delete KT.label[KJL.id]; delete KT.gelembung[KJL.id]; }
    else { u.dikendalikan = false; u.khSibuk = false; u.kaki.forEach((k) => (k.rotation.x = 0)); if (u.meja && typeof _ktPergi === "function") _ktPergi(t, u.meja); }
  }
  KJL.t = null; _kjlHud(false); document.getElementById("kantor-ai")?.classList.remove("kjl-on"); document.getElementById("kjl-btn")?.classList.remove("on");
  if (typeof _ktUkur === "function") _ktUkur();
}

// ── KAMERA & GERAK (dipanggil tiap bingkai dari kantor-3d.js) ──
function _kjlKamera(dt) {
  _kjlGerakPintu(dt);
  if (!KJL.aktif || !KJL.t) return null;
  const t = KJL.t, u = t.userData, cam = KJL.kam, lay = document.getElementById("kt-layar");
  // masukan
  const kb = KJL.tombol, maju = KJL.joy ? KJL.joy.m : (kb.w || kb.arrowup ? 1 : 0) - (kb.s || kb.arrowdown ? 1 : 0);
  const belok = KJL.joy ? KJL.joy.b : (kb.d || kb.arrowright ? 1 : 0) - (kb.a || kb.arrowleft ? 1 : 0), geser = (kb.e_kanan ? 1 : 0) - (kb.e_kiri ? 1 : 0);
  KJL.yaw -= belok * (KJL.joy ? 2.0 : 2.4) * dt * (Math.abs(maju) > 0.2 || KJL.joy ? 1 : 1);
  const v = (kb.shift || (KJL.joy && KJL.joy.kuat > 0.95) ? 3.6 : 2.2) * dt * maju;
  if (u.duduk && Math.abs(maju) > 0.1) _ktDuduk(t, false);
  if (Math.abs(v) > 1e-4) {
    const fx = Math.sin(KJL.yaw), fz = Math.cos(KJL.yaw), nx = t.position.x + fx * v, nz = t.position.z + fz * v;
    let c = _kjlBebas(nx, nz);
    if (c.ok) { t.position.x = nx; t.position.z = nz; }
    else { // menyusur dinding
      const a = _kjlBebas(nx, t.position.z), b = _kjlBebas(t.position.x, nz);
      if (a.ok) t.position.x = nx; else if (b.ok) t.position.z = nz;
      const alasan = c.larang || (c.pintu ? `${c.pintu.nama} tertutup — tekan Buka Pintu (E)` : "");
      if (alasan && performance.now() - KJL.pesanT > 2500) { KJL.pesanT = performance.now(); toast(alasan, "info"); }
    }
    KJL.langkah += dt * (maju > 0 ? 10 : -10) * (Math.abs(v) / dt > 3 ? 1.4 : 1);
    const ay = Math.sin(KJL.langkah); u.kaki.forEach((k, i) => (k.rotation.x = (i ? -1 : 1) * ay * 0.5)); u.badan.position.y = Math.abs(ay) * 0.04;
  } else if (!u.duduk) { u.kaki.forEach((k) => (k.rotation.x *= 0.8)); u.badan.position.y *= 0.8; }
  if (!u.duduk) t.rotation.y = KJL.yaw;
  // kamera
  const w = lay ? lay.clientWidth : 1, h = lay ? lay.clientHeight : 1; if (Math.abs(cam.aspect - w / h) > 1e-3) { cam.aspect = w / h; cam.updateProjectionMatrix(); }
  const fx = Math.sin(KJL.yaw), fz = Math.cos(KJL.yaw), kx = t.position.x, kz = t.position.z;
  t.traverse((o) => { if (o.isMesh && o !== t) o.visible = !KJL.mata; });
  let tuju;
  if (KJL.mata) {
    tuju = { x: kx + fx * 0.2, y: u.duduk ? 1.35 : 1.85, z: kz + fz * 0.2 };
    cam.position.set(tuju.x, tuju.y, tuju.z); cam.lookAt(kx + fx * 4, tuju.y - Math.sin(KJL.pitch - 0.25) * 2.5, kz + fz * 4);
  } else {
    // mundurkan kamera, tapi berhenti sebelum menembus dinding
    let d = KJL.jarak; for (let s = 0.4; s <= KJL.jarak; s += 0.2) { const [i, j] = _kdSel(kx - fx * s, kz - fz * s); if (!_kdDalam(i, j) || (KD.blok[j * KD.NX + i] === 1 && _kjlDinding(kx - fx * s, kz - fz * s))) { d = Math.max(0.6, s - 0.35); break; } }
    tuju = { x: kx - fx * d * Math.cos(KJL.pitch), y: 1.6 + d * Math.sin(KJL.pitch), z: kz - fz * d * Math.cos(KJL.pitch) };
    const p = KJL.posKam || (KJL.posKam = { ...tuju }), a = Math.min(1, dt * 8);
    p.x += (tuju.x - p.x) * a; p.y += (tuju.y - p.y) * a; p.z += (tuju.z - p.z) * a;
    cam.position.set(p.x, p.y, p.z); cam.lookAt(kx, 1.35, kz);
  }
  // tombol aksi & nama ruang (tidak perlu tiap bingkai)
  if (performance.now() - KJL.aksiT > 180) { KJL.aksiT = performance.now(); _kjlPerbaruiAksi(); }
  return cam;
}
// dinding tinggi (bukan meja) — kamera hanya terhalang dinding, bukan perabot rendah
function _kjlDinding(x, z) {
  const tembok = [[-15.2, 15.2, -8.25, -7.95], [-15.25, -14.95, -8.2, 8.1], [14.95, 15.25, -8.2, 8.1], [-5.15, -4.85, -8.2, 5.8], [4.85, 5.15, -8.2, 5.8], [-5.15, -4.85, 7.6, 8.1], [4.85, 5.15, 7.6, 8.1]];
  return tembok.some(([x0, x1, z0, z1]) => x > x0 - 0.2 && x < x1 + 0.2 && z > z0 - 0.2 && z < z1 + 0.2);
}

// ── AKSI: pintu, duduk, sapa ──
function _kjlKursiKosong(x, z) {
  const daftar = [];
  const dari = (k) => { if (k && k.x != null) daftar.push(k); };
  (KT.kursiRapat || []).forEach(dari); (KT.kursiTamu || []).forEach(dari); dari(KT.kursiPimpinan); dari(KT.kursiKepala); if (KJL.t && KJL.t.userData.meja) dari(KJL.t.userData.meja);
  Object.values(KT.tokoh || {}).forEach((t) => { if (t !== KJL.t && t.userData.meja && t.userData.staf && !t.visible) dari(t.userData.meja); });
  return daftar.map((k) => ({ k, d: Math.hypot(k.x - x, k.z - z) })).filter((o) => o.d < 1.1 && !Object.values(KT.tokoh).some((t) => t !== KJL.t && t.visible && Math.hypot(t.position.x - o.k.x, t.position.z - o.k.z) < 0.4) && !_kjlLarang(o.k.x, o.k.z, _kjlJk())).sort((a, b) => a.d - b.d)[0];
}
function _kjlPerbaruiAksi() {
  const t = KJL.t; if (!t) return; const x = t.position.x, z = t.position.z, jk = _kjlJk(), aksi = [];
  const p = (KT.pintuJalan || []).map((q) => ({ q, d: Math.hypot(q.pusat.x - x, q.pusat.z - z) })).filter((o) => o.d < 1.9).sort((a, b) => a.d - b.d)[0];
  if (p) {
    const q = p.q, i = KT.pintuJalan.indexOf(q);
    if (q.khusus && q.khusus !== jk) aksi.push(["👋 Ucapkan Salam", `kjlSalamPintu(${i})`]);
    else aksi.push([_kjlTerbuka(q) ? "🚪 Tutup Pintu" : "🚪 Buka Pintu", `kjlPintu(${i})`, "e"]);
  }
  if (t.userData.duduk) aksi.push(["🧍 Berdiri", "kjlBerdiri()"]);
  else { const k = _kjlKursiKosong(x, z); if (k) aksi.push(["🪑 Duduk", "kjlDuduk()"]); }
  const o = Object.entries(KT.tokoh).filter(([id, s]) => s !== t && s.visible && !s.userData.santri).map(([id, s]) => ({ id, d: Math.hypot(s.position.x - x, s.position.z - z) })).filter((o) => o.d < 1.8).sort((a, b) => a.d - b.d)[0];
  if (o) { const s = KT.tokoh[o.id].userData.staf; aksi.push([`👋 Sapa ${s ? (s.jk === "P" ? "Ustadzah " : "Ustadz ") + String(s.nama).split(" ")[0] : ""}`.trim(), `kjlSapa('${o.id}')`]); }
  const kunci = JSON.stringify(aksi);
  if (kunci !== KJL.aksiKunci) { KJL.aksiKunci = kunci; KJL.aksi = aksi; const el = document.getElementById("kjl-aksi"); if (el) el.innerHTML = aksi.map(([l, f]) => `<button onclick="${f}">${l}</button>`).join(""); }
  const r = document.getElementById("kjl-ruang"); if (r) { const nm = _kjlRuang(x, z); if (r.textContent !== nm) r.textContent = nm; }
}
function kjlPintu(i) {
  const p = (KT.pintuJalan || [])[i]; if (!p) return;
  if (p.khusus && p.khusus !== _kjlJk()) return kjlSalamPintu(i);
  p.buka = !_kjlTerbuka(p); p.tBuka = 0;
  _kjlSuara(p.buka); toast(`${p.nama} ${p.buka ? "dibuka" : "ditutup"}`, "info");
}
function kjlSalamPintu(i) {
  const p = (KT.pintuJalan || [])[i]; if (!p) return;
  const aku = KJL.id; _ktBicara(aku, p.khusus === "P" ? "Assalamu'alaikum, permisi Ustadzah…" : "Assalamu'alaikum, permisi Ustadz…", 2400);
  const dalam = Object.entries(KT.tokoh).find(([, t]) => t.visible && t.userData.staf && t.userData.jk === p.khusus && _kjlRuang(t.position.x, t.position.z) === (p.khusus === "P" ? "Ruang Ustadzah" : "Ruang Ustadz"));
  setTimeout(() => { if (dalam) _ktBicara(dalam[0], "Wa'alaikumussalam warahmatullah. Ada yang bisa dibantu? Silakan sampaikan dari depan pintu.", 3200); else toast("Tidak ada jawaban — ruangan sedang kosong", "info"); }, 2200);
}
function kjlDuduk() {
  const t = KJL.t, k = _kjlKursiKosong(t.position.x, t.position.z); if (!k) return;
  t.position.set(k.k.x, 0, k.k.z); if (k.k.hadap != null) { t.rotation.y = k.k.hadap; KJL.yaw = k.k.hadap; } _ktDuduk(t, true); KJL.aksiKunci = null;
}
function kjlBerdiri() { const t = KJL.t; if (t) { _ktDuduk(t, false); KJL.aksiKunci = null; } }
function kjlSapa(id) {
  const s = KT.tokoh[id]; if (!s) return; const st = s.userData.staf, aku = KJL.id;
  const sebut = st ? `${st.jk === "P" ? "Ustadzah" : "Ustadz"} ${String(st.nama).split(" ")[0]}` : "";
  _ktBicara(aku, `Assalamu'alaikum${sebut ? ", " + sebut : ""}.`, 2200);
  if (s.userData.jalur == null) s.rotation.y = Math.atan2(KJL.t.position.x - s.position.x, KJL.t.position.z - s.position.z);
  const jawab = ["Wa'alaikumussalam warahmatullah wabarakatuh.", "Wa'alaikumussalam. Barakallahu fiik.", "Wa'alaikumussalam, ahlan wa sahlan."];
  setTimeout(() => _ktBicara(id, jawab[Math.floor(Math.random() * jawab.length)], 2600), 1600);
}
function kjlPandangan() { KJL.mata = !KJL.mata; KJL.posKam = null; toast(KJL.mata ? "Pandangan mata (orang pertama)" : "Pandangan dari belakang", "info"); }
function _kjlSuara(buka) {
  try { const a = (KJL.audio = KJL.audio || new (window.AudioContext || window.webkitAudioContext)()), o = a.createOscillator(), g = a.createGain(); o.type = "triangle"; o.frequency.value = buka ? 520 : 300; g.gain.setValueAtTime(0.06, a.currentTime); g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + 0.25); o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + 0.26); } catch (e) {}
}

// ── TAMPILAN KENDALI (HUD): joystick, seret untuk melihat, tombol aksi ──
function _kjlHud(tampil) {
  let h = document.getElementById("kjl-hud");
  if (!tampil) { h?.remove(); return; }
  const lay = document.getElementById("kt-layar"); if (!lay) return;
  if (!h) {
    lay.insertAdjacentHTML("beforeend", `<div id="kjl-hud" class="kjl-hud">
      <div id="kjl-lihat" class="kjl-lihat" title="Seret untuk melihat sekeliling"></div>
      <div class="kjl-atas"><span class="kjl-ruang-w">📍 <b id="kjl-ruang">—</b></span>
        <button onclick="kjlPandangan()" title="Ganti pandangan">👁️ <span>Pandangan</span></button>
        <button class="keluar" onclick="ktModeJalan(false)" title="Keluar Mode Jalan (Esc)">✕ <span>Keluar</span></button></div>
      <div id="kjl-joy" class="kjl-joy"><i></i></div>
      <div id="kjl-aksi" class="kjl-aksi"></div>
      <div class="kjl-bantu">⌨️ W A S D / panah = jalan · Shift = lari · E = pintu · seret layar = lihat sekeliling · roda = jarak · Esc = keluar</div>
    </div>`);
    h = document.getElementById("kjl-hud");
    _kjlPasangJoy(document.getElementById("kjl-joy")); _kjlPasangLihat(document.getElementById("kjl-lihat"));
  }
  KJL.aksiKunci = null;
}
function _kjlPasangJoy(el) {
  const bola = el.querySelector("i"); let pid = null, pusat = null;
  const gerak = (e) => {
    const r = 46, dx = e.clientX - pusat.x, dy = e.clientY - pusat.y, d = Math.min(r, Math.hypot(dx, dy)), a = Math.atan2(dy, dx), x = Math.cos(a) * d, y = Math.sin(a) * d;
    bola.style.transform = `translate(${x}px,${y}px)`; const kuat = d / r;
    KJL.joy = { m: -y / r, b: Math.abs(x / r) < 0.18 ? 0 : x / r, kuat };
  };
  el.addEventListener("pointerdown", (e) => { e.preventDefault(); e.stopPropagation(); pid = e.pointerId; el.setPointerCapture(pid); const r = el.getBoundingClientRect(); pusat = { x: r.left + r.width / 2, y: r.top + r.height / 2 }; gerak(e); });
  el.addEventListener("pointermove", (e) => { if (e.pointerId === pid) gerak(e); });
  const lepas = (e) => { if (e.pointerId !== pid) return; pid = null; KJL.joy = null; bola.style.transform = ""; };
  el.addEventListener("pointerup", lepas); el.addEventListener("pointercancel", lepas);
}
function _kjlPasangLihat(el) {
  let pid = null, awal = null;
  el.addEventListener("pointerdown", (e) => { pid = e.pointerId; el.setPointerCapture(pid); awal = { x: e.clientX, y: e.clientY, yaw: KJL.yaw, pitch: KJL.pitch }; });
  el.addEventListener("pointermove", (e) => {
    if (e.pointerId !== pid || !awal) return;
    KJL.yaw = awal.yaw - (e.clientX - awal.x) * 0.006;
    KJL.pitch = Math.max(0.05, Math.min(1.1, awal.pitch + (e.clientY - awal.y) * 0.004));
  });
  const lepas = (e) => { if (e.pointerId === pid) { pid = null; awal = null; } };
  el.addEventListener("pointerup", lepas); el.addEventListener("pointercancel", lepas);
  el.addEventListener("wheel", (e) => { e.preventDefault(); KJL.jarak = Math.max(1.4, Math.min(7, KJL.jarak * (e.deltaY > 0 ? 1.1 : 0.9))); }, { passive: false });
}
document.addEventListener("keydown", (e) => {
  if (!KJL.aktif) return; if (/input|textarea|select/i.test((e.target && e.target.tagName) || "") || e.target?.isContentEditable) return;
  const k = e.key.toLowerCase();
  if (k === "escape") { ktModeJalan(false); return; }
  if (k === "e") { const a = (KJL.aksi || []).find((x) => x[2] === "e") || (KJL.aksi || [])[0]; if (a) new Function(a[1])(); e.preventDefault(); return; }
  if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright", "shift"].includes(k)) { KJL.tombol[k] = true; e.preventDefault(); }
});
document.addEventListener("keyup", (e) => { KJL.tombol[e.key.toLowerCase()] = false; });
window.addEventListener("blur", () => { KJL.tombol = {}; KJL.joy = null; });

// ── pemasangan: tombol di bilah atas + pintu dibangun ulang tiap kantor dibuka ──
(function () {
  if (typeof _ktBangun === "function") {
    const a = _ktBangun;
    _ktBangun = async function () {
      KJL.aktif = false; KT.kameraHook = null; KT.pintuJalan = null;
      await a.apply(this, arguments);
      try {
        _kjlBuatPintu(); KT.kameraHook = _kjlKamera; // kait tetap terpasang untuk menggerakkan pintu (kamera hanya diambil alih saat Mode Jalan)
        const alat = document.querySelector("#kantor-ai .kt-alat, .kt-alat");
        if (alat && !document.getElementById("kjl-btn")) {
          const b = document.createElement("button"); b.id = "kjl-btn"; b.title = "Mode Jalan: jelajahi kantor seperti orang di dalam miniatur";
          b.innerHTML = `🕹️<span class="kt-sembunyi-hp"> Jalan</span>`; b.onclick = () => ktModeJalan();
          const tutup = [...alat.children].find((x) => x.getAttribute && x.getAttribute("onclick") === "ktTutup()"); alat.insertBefore(b, tutup || null);
        }
      } catch (e) { console.warn("Mode Jalan:", e); }
    };
  }
  if (typeof ktTutup === "function") { const a = ktTutup; ktTutup = function () { if (KJL.aktif) _kjlSelesai(); return a.apply(this, arguments); }; }
})();

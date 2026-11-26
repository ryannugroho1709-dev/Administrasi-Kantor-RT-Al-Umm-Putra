// ============================================================
//  KANTOR MAYA — SIARAN LENGKAP untuk yang diberi izin menyaksikan
//  Yang dikirim dari layar Admin/Kepala (pemilik) ke penonton, lewat kanal "kantor-pkbm":
//  • Mode Jalan: posisi, arah, duduk/berdiri tokoh yang dikendalikan (termasuk "tamu")
//  • Buka-tutup pintu (Ruang Kepala, Ustadz, Ustadzah, Bendahara)
//  • Gerakan sholat berjamaah (takbir, ruku', sujud, duduk, salam) & barisan saf
//  • Kehidupan harian: petugas datang/pulang berkendaraan, rombongan santri lewat
//  • Kamera: penonton bisa "📡 Ikuti Kamera Kepala" (bawaan menyala) atau melihat bebas
//  Bila pemilik tidak sedang membuka kantor (tidak ada siaran > 60 detik), penonton kembali
//  menjalankan kehidupan kantornya sendiri seperti biasa.
// ============================================================
const KSR = { ikut: true, kam: null, kamPos: null, kamLihat: null, cam: null, terakhir: 0, kirimT: 0, kunci: "", kunciT: 0, pose: {}, poseT: null, jalan: null, tamu: null };
try { KSR.ikut = localStorage.getItem("kantor:ikutKamera") !== "0"; } catch (e) {}
const _ksrHidup = () => Date.now() - KSR.terakhir < 60000; // penonton: pemilik sedang menyiarkan
const _ksrNonton = () => KT.penonton && _ksrHidup();
const _ksrId = (t) => (t && t.userData && t.userData.staf ? t.userData.staf.id : Object.keys(KT.tokoh || {}).find((k) => KT.tokoh[k] === t));
const _ksrB = (n) => Math.round(n * 100) / 100;

// ── PEMILIK: kirim keadaan tiap 250 ms (hanya bila berubah; denyut tiap 10 detik) ──
function _ksrKirimKeadaan() {
  const now = Date.now(); if (now - KSR.kirimT < 250) return; KSR.kirimT = now;
  const g = {};
  if (typeof KJL !== "undefined" && KJL.aktif && KJL.t) {
    const t = KJL.t, u = t.userData;
    g.j = { id: KJL.tamu ? "kjl:tamu" : KJL.id, x: _ksrB(t.position.x), z: _ksrB(t.position.z), r: _ksrB(t.rotation.y), d: u.duduk ? 1 : 0, tamu: KJL.tamu ? 1 : 0, jk: u.jk || "L", nm: String(STATE.guruNama || "").replace(/\s*,.*$/, "").slice(0, 40) };
    if (KJL.kam) { const c = KJL.kam, dir = new THREE.Vector3(); c.getWorldDirection(dir); g.k = { m: "j", p: [_ksrB(c.position.x), _ksrB(c.position.y), _ksrB(c.position.z)], l: [_ksrB(c.position.x + dir.x * 4), _ksrB(c.position.y + dir.y * 4), _ksrB(c.position.z + dir.z * 4)] }; }
  } else {
    const f = KT.fokus || { x: 0, z: 3, zoom: KT.zoom || 1 };
    g.k = { m: "a", f: [_ksrB(f.x), _ksrB(f.z), _ksrB(f.zoom)], s: _ksrB(KT.sudut || 0), jr: _ksrB(KT.jarak ?? 34), h: _ksrB(KT.tinggi ?? 21) };
  }
  g.p = (KT.pintuJalan || []).map((p) => (p.buka ? 1 : 0)).join("");
  const kunci = JSON.stringify(g);
  if (kunci === KSR.kunci && now - KSR.kunciT < 10000) return;
  KSR.kunci = kunci; KSR.kunciT = now;
  _ktSiar("gerak", g);
}

// ── PENONTON: terima & terapkan ──
function _ksrTokohTamu(d) {
  if (KSR.tamu && KT.tokoh["kjl:tamu:pemilik"]) return KSR.tamu;
  const t = _ktTokohBaru(d.jk === "P" ? "P" : "L"); t.position.set(d.x, 0, d.z); t.userData.npc = true; KT.scene.add(t);
  KT.tokoh["kjl:tamu:pemilik"] = t; KSR.tamu = t;
  const ham = document.getElementById("kt-hamparan");
  if (ham) {
    const lb = document.createElement("button"); lb.className = "kt-label kjl-label"; lb.style.setProperty("--w", "#0ea5e9");
    lb.innerHTML = `<b>${_ktE(d.nm || "Admin")}</b><small>sedang berjalan</small>`; ham.appendChild(lb); KT.label["kjl:tamu:pemilik"] = lb;
    const gb = document.createElement("div"); gb.className = "kt-gelembung"; gb.hidden = true; ham.appendChild(gb); KT.gelembung["kjl:tamu:pemilik"] = gb;
  }
  return t;
}
function _ksrHapusTamu() {
  const id = "kjl:tamu:pemilik"; if (!KSR.tamu) return;
  KT.scene && KT.scene.remove(KSR.tamu); delete KT.tokoh[id]; KT.label[id]?.remove(); KT.gelembung[id]?.remove(); delete KT.label[id]; delete KT.gelembung[id]; KSR.tamu = null;
}
function _ksrTerimaGerak(g) {
  // tokoh yang sedang dikendalikan pemilik (Mode Jalan)
  if (g.j) {
    const t = g.j.tamu ? _ksrTokohTamu(g.j) : KT.tokoh[g.j.id];
    if (t) {
      if (KSR.jalan && KSR.jalan.t !== t) _ksrLepasJalan();
      const u = t.userData; u.jalur = null; if (u.selesai) { const s = u.selesai; u.selesai = null; s(); }
      u.dikendalikan = true; t.visible = true; u.ksDiLuar = false; if (KT.label[g.j.id]) KT.label[g.j.id].hidden = false;
      KSR.jalan = { t, x: g.j.x, z: g.j.z, r: g.j.r, d: !!g.j.d };
    }
  } else if (KSR.jalan) _ksrLepasJalan();
  // pintu
  if (typeof g.p === "string") (KT.pintuJalan || []).forEach((p, i) => { if (g.p[i] != null) p.buka = g.p[i] === "1"; });
  // kamera
  if (g.k) KSR.kam = g.k;
}
function _ksrLepasJalan() {
  const j = KSR.jalan; KSR.jalan = null; if (!j) return;
  if (j.t === KSR.tamu) { _ksrHapusTamu(); return; }
  const u = j.t.userData; u.dikendalikan = false; (u.kaki || []).forEach((k) => (k.rotation.x = 0));
}
function _ksrBingkaiPenonton(dt) {
  // gerakkan tokoh yang dikendalikan pemilik dengan halus
  const j = KSR.jalan;
  if (j) {
    const t = j.t, u = t.userData, a = Math.min(1, dt * 8), dx = j.x - t.position.x, dz = j.z - t.position.z, jauh = Math.hypot(dx, dz);
    if (jauh > 6) { t.position.x = j.x; t.position.z = j.z; } else { t.position.x += dx * a; t.position.z += dz * a; }
    let dr = j.r - t.rotation.y; while (dr > Math.PI) dr -= 2 * Math.PI; while (dr < -Math.PI) dr += 2 * Math.PI; t.rotation.y += dr * a;
    if (!!u.duduk !== j.d) _ktDuduk(t, j.d);
    if (!j.d && jauh > 0.03) { u.langkah = (u.langkah || 0) + dt * 10; const ay = Math.sin(u.langkah); (u.kaki || []).forEach((k, i) => (k.rotation.x = (i ? -1 : 1) * ay * 0.5)); if (u.badan) u.badan.position.y = Math.abs(ay) * 0.04; }
    else if (!j.d) { (u.kaki || []).forEach((k) => (k.rotation.x *= 0.8)); if (u.badan) u.badan.position.y *= 0.8; }
  }
  // kamera mengikuti pemilik
  if (!KSR.ikut || !KSR.kam || !_ksrHidup() || (typeof KJL !== "undefined" && KJL.aktif)) { KSR.kamPos = null; return null; }
  const k = KSR.kam;
  if (k.m === "a") { KT.fokus = { x: k.f[0], z: k.f[1], zoom: k.f[2] }; KT.sudut = k.s; KT.jarak = k.jr; KT.tinggi = k.h; KSR.kamPos = null; return null; }
  const lay = document.getElementById("kt-layar"), w = lay ? lay.clientWidth : 1, h = lay ? lay.clientHeight : 1;
  const cam = KSR.cam || (KSR.cam = new THREE.PerspectiveCamera(62, 1, 0.05, 160));
  if (Math.abs(cam.aspect - w / h) > 1e-3) { cam.aspect = w / h; cam.updateProjectionMatrix(); }
  const a = Math.min(1, dt * 8), p = KSR.kamPos || (KSR.kamPos = { x: k.p[0], y: k.p[1], z: k.p[2] }), l = KSR.kamLihat || (KSR.kamLihat = { x: k.l[0], y: k.l[1], z: k.l[2] });
  p.x += (k.p[0] - p.x) * a; p.y += (k.p[1] - p.y) * a; p.z += (k.p[2] - p.z) * a;
  l.x += (k.l[0] - l.x) * a; l.y += (k.l[1] - l.y) * a; l.z += (k.l[2] - l.z) * a;
  cam.position.set(p.x, p.y, p.z); cam.lookAt(l.x, l.y, l.z);
  return cam;
}

// ── tombol penonton: 📡 Ikuti Kamera Kepala ──
function ksrIkutKamera() {
  KSR.ikut = !KSR.ikut; KSR.kamPos = null; KSR.kamLihat = null;
  try { localStorage.setItem("kantor:ikutKamera", KSR.ikut ? "1" : "0"); } catch (e) {}
  if (!KSR.ikut) { KT.jarak = 34; KT.tinggi = 21; }
  _ksrTombol(); toast(KSR.ikut ? "Kamera mengikuti layar Kepala PKBM" : "Kamera bebas — atur sendiri sudut pandangnya", "info");
}
function _ksrTombol() {
  const b = document.getElementById("ksr-ikut"); if (!b) return;
  b.classList.toggle("on", KSR.ikut); b.innerHTML = `📡<span class="kt-sembunyi-hp"> ${KSR.ikut ? "Ikuti Kepala" : "Kamera Bebas"}</span>`;
  b.title = KSR.ikut ? "Kamera mengikuti layar Kepala PKBM — ketuk untuk melihat bebas" : "Ketuk agar kamera mengikuti layar Kepala PKBM";
}

// ── pemasangan ──
(function () {
  // 1) kait tiap bingkai (dipanggil kantor-3d.js lewat KT.kameraHook → _kjlKamera)
  if (typeof _kjlKamera === "function") {
    const a = _kjlKamera;
    _kjlKamera = function (dt) {
      const c = a.apply(this, arguments);
      try {
        if (KT.pemilik && KT.kanal) _ksrKirimKeadaan();
        else if (KT.penonton) { const k = _ksrBingkaiPenonton(dt); if (k && !c) return k; }
      } catch (e) {}
      return c;
    };
  }
  // 2) putar ulang perintah baru di layar penonton
  if (typeof _ktPutar === "function") {
    const a = _ktPutar;
    _ktPutar = function (p) {
      if (!p || !KT.buka) return; KSR.terakhir = Date.now();
      const d = p.data || {};
      if (d && d.id === "kjl:tamu") d.id = "kjl:tamu:pemilik"; // tamu milik pemilik (bicara/salam)
      KT.memutar = true;
      try {
        if (p.cmd === "gerak") return _ksrTerimaGerak(d);
        if (p.cmd === "pose") return (d.l || []).forEach(([id, fase, toleh, x, z, r]) => { const t = KT.tokoh[id]; if (!t) return; const u = t.userData; u.jalur = null; if (u.selesai) { const s = u.selesai; u.selesai = null; s(); } t.visible = true; t.position.set(x, 0, z); t.rotation.y = r; if (typeof _ktDuduk === "function" && u.duduk) _ktDuduk(t, false); _ksrPoseAsli(t, fase, toleh); });
        if (p.cmd === "sholat") {
          if (typeof KS2 !== "undefined") KS2.sholat = !!d.on;
          Object.values(KT.tokoh).forEach((t) => { t.userData.antre = !!d.on; if (!d.on && !t.userData.santri) _ksrPoseAsli(t, 0, 0); });
          if (d.on && typeof _ksSuara === "function") { try { _ksSuara("azan"); } catch (e) {} }
          return;
        }
        if (p.cmd === "datang") { const t = KT.tokoh[d.id]; if (t && t.userData.ksDiLuar && !t.userData.khSibuk && typeof _khDatang === "function") _khDatang(d.id, t); return; }
        if (p.cmd === "pulang") { const t = KT.tokoh[d.id]; if (t && !t.userData.ksDiLuar && !t.userData.khSibuk && typeof _khPulang === "function") _khPulang(d.id, t); return; }
        if (p.cmd === "santri") {
          if (typeof KHD === "undefined" || typeof _khSantri !== "function") return;
          KHD.santri.forEach((t) => KT.scene.remove(t)); KHD.santri = [];
          (d.l || []).forEach(([jk, jj, x, z, r, arah, v]) => { const t = _khSantri(jk, jj); t.position.set(x, 0, z); t.rotation.y = r; t.userData.arah = arah; t.userData.v = v; t.userData.fase = Math.random() * 6; KHD.santri.push(t); });
          return;
        }
      } finally { KT.memutar = false; }
      return a.apply(this, arguments);
    };
  }
  // 3) gerakan sholat (pemilik → penonton), dikumpulkan tiap 150 ms
  const poseAsli = typeof _khPoseSholat === "function" ? _khPoseSholat : null;
  window._ksrPoseAsli = function (t, fase, toleh) { if (poseAsli) poseAsli(t, fase, toleh); };
  if (poseAsli) {
    _khPoseSholat = function (t, fase, toleh = 0) {
      poseAsli(t, fase, toleh);
      if (!KT.pemilik || !KT.kanal || KT.memutar) return;
      const id = _ksrId(t); if (!id) return;
      KSR.pose[id] = [id, fase, toleh, _ksrB(t.position.x), _ksrB(t.position.z), _ksrB(t.rotation.y)];
      if (!KSR.poseT) KSR.poseT = setTimeout(() => { const l = Object.values(KSR.pose); KSR.pose = {}; KSR.poseT = null; if (l.length) _ktSiar("pose", { l }); }, 150);
    };
  }
  if (typeof _khSholatTertib === "function") {
    const a = _khSholatTertib;
    _khSholatTertib = async function () {
      const kirim = KT.pemilik && typeof KS2 !== "undefined" && !KS2.sholat && !(KT.sesi && KT.sesi.aktif);
      if (kirim) _ktSiar("sholat", { on: true });
      try { return await a.apply(this, arguments); } finally { if (kirim) _ktSiar("sholat", { on: false }); }
    };
  }
  // 4) kehidupan harian: datang/pulang & santri dari layar pemilik; penonton tidak mengarang sendiri selama pemilik menyiarkan
  if (typeof _khDatang === "function") { const a = _khDatang; _khDatang = function (id) { if (KT.pemilik) _ktSiar("datang", { id }); return a.apply(this, arguments); }; }
  if (typeof _khPulang === "function") { const a = _khPulang; _khPulang = function (id) { if (KT.pemilik) _ktSiar("pulang", { id }); return a.apply(this, arguments); }; }
  if (typeof _khPerbarui === "function") { const a = _khPerbarui; _khPerbarui = function (awal) { if (!awal && _ksrNonton()) return Promise.resolve(); return a.apply(this, arguments); }; }
  if (typeof _khSantri === "function") { const a = _khSantri; _khSantri = function (jk, jenjang) { const t = a.apply(this, arguments); t.userData.jenjang = jenjang; return t; }; }
  if (typeof _khKirimRombongan === "function") {
    const a = _khKirimRombongan;
    _khKirimRombongan = function () {
      if (_ksrNonton()) return; // penonton menunggu rombongan dari layar pemilik
      const sebelum = KHD.santri.length, r = a.apply(this, arguments);
      if (KT.pemilik && !sebelum && KHD.santri.length) _ktSiar("santri", { l: KHD.santri.map((t) => [t.userData.jk || "L", t.userData.jenjang || "SMP", _ksrB(t.position.x), _ksrB(t.position.z), _ksrB(t.rotation.y), t.userData.arah, t.userData.v]) });
      return r;
    };
  }
  // 5) petugas kebersihan & tokoh tanpa data guru juga disiarkan saat berjalan
  if (typeof _ktPergi === "function") {
    const a = _ktPergi;
    _ktPergi = function (t, tujuan, opsi) {
      if (KT.pemilik && t && t.userData && !t.userData.staf && !t.userData.santri && t !== (typeof KJL !== "undefined" && KJL.t)) { const id = _ksrId(t); if (id && id.indexOf("kjl:") !== 0) _ktSiar("pergi", { id, tujuan, berdiri: !!(opsi && opsi.berdiri) }); }
      return a.apply(this, arguments);
    };
  }
  // 6) tombol penonton di bilah atas
  if (typeof _ktBangun === "function") {
    const a = _ktBangun;
    _ktBangun = async function () {
      KSR.jalan = null; KSR.tamu = null; KSR.kam = null; KSR.kamPos = null; KSR.kamLihat = null; KSR.terakhir = 0;
      await a.apply(this, arguments);
      try {
        const alat = document.querySelector("#kantor-ai .kt-alat");
        if (KT.penonton && alat && !document.getElementById("ksr-ikut")) {
          const b = document.createElement("button"); b.id = "ksr-ikut"; b.onclick = ksrIkutKamera;
          const tutup = [...alat.children].find((x) => x.getAttribute && x.getAttribute("onclick") === "ktTutup()"); alat.insertBefore(b, tutup || null); _ksrTombol();
        }
      } catch (e) {}
    };
  }
  if (typeof ktTutup === "function") { const a = ktTutup; ktTutup = function () { KSR.jalan = null; KSR.tamu = null; KSR.kam = null; return a.apply(this, arguments); }; }
})();

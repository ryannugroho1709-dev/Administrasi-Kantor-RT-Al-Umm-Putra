// ============================================================
//  KANTOR MAYA — KEHIDUPAN KANTOR
//  • Jam kerja diatur di 🌗 Suasana: Ustadz/Ustadzah, Kepala PKBM, Petugas Kebersihan (datang & pulang).
//    Yang sedang online di aplikasi selalu ada. Hari Ahad libur.
//  • Datang & pulang naik kendaraan (motor; Kepala PKBM mobil), diparkir di halaman depan.
//    Bila sudah pulang lalu Kepala memanggil rapat → datang naik kendaraan, selesai rapat pulang lagi.
//  • Santri berjalan di trotoar depan: rombongan putra & putri BERGANTIAN (tidak berbaur), berhenti saat malam.
//  • Papan "Hari Ini" & layar rapat bisa diketuk. Di HP, pesan/percakapan tersembunyi — buka lewat layar rapat / tombol 💬.
// ============================================================
const KHD = {
  jam: { guru: { d: "07:30", p: "16:30" }, kepala: { d: "07:15", p: "17:00" }, cs: { d: "06:30", p: "16:00" } },
  kendaraan: {}, slot: {}, santri: [], antrean: 0, tSantri: 0, iv: null, ivRapat: null, tAkhir: 0, petunjuk: false, target: [],
};
const KHD_KUNCI_JAM = "bosp:kantor:jam";
const _khMnt = (s) => { const [h, m] = String(s || "00:00").split(":").map(Number); return (h || 0) * 60 + (m || 0); };
const _khHP = () => window.innerWidth <= 900;
function _khId(t) { if (t.userData.staf) return t.userData.staf.id; return Object.keys(KT.tokoh).find((k) => KT.tokoh[k] === t); }
function _khJadwal(id, t) { if (t && t.userData.npc) return KHD.jam.cs; if ((KT.peran.kepala || [])[0] === id) return KHD.jam.kepala; return KHD.jam.guru; }
function _khHarusAda(id, t, online) {
  if (typeof KS2 !== "undefined" && !KS2.nyata) return true;
  if (id === STATE.guruId || online.has(id)) return true;
  if (t.userData.khRapat && KT.sesi && KT.sesi.aktif) return true;
  const k = new Date(), j = _khJadwal(id, t), m = k.getHours() * 60 + k.getMinutes();
  if (k.getDay() === 0) return false;
  return m >= _khMnt(j.d) && m < _khMnt(j.p);
}
function _khDaftarOrang() {
  const yid = (KT.peran.yayasan || [])[0], ids = (KT.staf || []).map((s) => s.id).filter((id) => id !== yid);
  Object.values(KT.npc || {}).forEach((n) => n && n.id && ids.push(n.id));
  return ids.filter((id) => KT.tokoh[id]);
}

// ── kendaraan ──
const KHD_WARNA_MOTOR = [0xdc2626, 0x1d4ed8, 0x111827, 0xf8fafc, 0x16a34a, 0x7c3aed, 0xea580c, 0x0891b2, 0x9ca3af];
function _khBahan(w, kilap = 0.35) { return new THREE.MeshStandardMaterial({ color: w, roughness: 1 - kilap, metalness: 0.1, envMapIntensity: 0.5 }); }
function _khBalok(g, w, h, d, warna, x, y, z, kilap) { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), _khBahan(warna, kilap)); m.position.set(x, y, z); m.castShadow = true; g.add(m); return m; }
function _khRoda(g, r, tebal, x, y, z) { const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, tebal, 16), _khBahan(0x111111, 0.1)); m.rotation.z = Math.PI / 2; m.position.set(x, y, z); g.add(m); return m; }
function _khMotor(warna) {
  const g = new THREE.Group();
  _khBalok(g, 0.26, 0.3, 1.0, warna, 0, 0.52, 0, 0.6); _khBalok(g, 0.28, 0.5, 0.14, warna, 0, 0.72, 0.42, 0.6);
  _khBalok(g, 0.24, 0.08, 0.52, 0x111827, 0, 0.72, -0.16, 0.2); _khBalok(g, 0.56, 0.04, 0.04, 0x374151, 0, 1.0, 0.46, 0.5);
  _khBalok(g, 0.1, 0.08, 0.04, 0xfef9c3, 0, 0.86, 0.5, 0.9);
  _khRoda(g, 0.24, 0.1, 0, 0.24, 0.48); _khRoda(g, 0.24, 0.1, 0, 0.24, -0.46);
  g.scale.setScalar(1.25); return g;
}
function _khMobil(warna) {
  const g = new THREE.Group();
  _khBalok(g, 1.7, 0.55, 3.8, warna, 0, 0.62, 0, 0.8); _khBalok(g, 1.55, 0.5, 2.0, warna, 0, 1.12, -0.25, 0.8);
  _khBalok(g, 1.57, 0.4, 1.9, 0x0b0f19, 0, 1.14, -0.25, 0.9);
  [-0.55, 0.55].forEach((x) => _khBalok(g, 0.3, 0.1, 0.04, 0xfef9c3, x, 0.72, 1.91, 0.9));
  [[-0.78, 1.25], [0.78, 1.25], [-0.78, -1.25], [0.78, -1.25]].forEach(([x, z]) => _khRoda(g, 0.34, 0.26, x, 0.34, z));
  return g;
}
function _khSiapkanSlot() {
  KHD.slot = {}; let iL = 0, iP = 0;
  const kid = (KT.peran.kepala || [])[0];
  _khDaftarOrang().forEach((id) => {
    const t = KT.tokoh[id], akhwat = t.userData.jk === "P";
    if (id === kid) { KHD.slot[id] = { x: -11.2, z: 12.7, mobil: true }; return; }
    if (akhwat) { const i = iP++; KHD.slot[id] = { x: 14.2 - (i % 6) * 0.95, z: 12.9 + Math.floor(i / 6) * 1.6 }; }
    else { const i = iL++; KHD.slot[id] = { x: 2.7 + (i % 6) * 0.95, z: 12.9 + Math.floor(i / 6) * 1.6 }; }
  });
}
function _khKendaraan(id) {
  if (KHD.kendaraan[id]) return KHD.kendaraan[id];
  const s = KHD.slot[id]; if (!s) return null;
  const v = s.mobil ? _khMobil(0x14532d) : _khMotor(KHD_WARNA_MOTOR[Math.abs([...id].reduce((a, c) => a + c.charCodeAt(0), 0)) % KHD_WARNA_MOTOR.length]);
  v.visible = false; v.position.set(s.x, 0, s.z); v.rotation.y = s.mobil ? Math.PI / 2 : Math.PI; KT.scene.add(v); KHD.kendaraan[id] = v; return v;
}
function _khParkir(id) { const v = _khKendaraan(id), s = KHD.slot[id]; if (!v) return; v.visible = true; v.position.set(s.x, 0, s.z); v.rotation.y = s.mobil ? Math.PI / 2 : Math.PI; }
function _khSembunyi(id, t) {
  t.visible = false; t.userData.ksDiLuar = true; t.userData.jalur = null;
  const s = KHD.slot[id]; if (s) t.position.set(s.x + 0.8, 0, s.z - 0.9);
  const lb = KT.label[id]; if (lb) lb.hidden = true; const v = KHD.kendaraan[id]; if (v) v.visible = false;
}
const _khTitikTurun = (s) => ({ x: s.mobil ? s.x + 1.6 : s.x + 0.6, z: s.mobil ? s.z : s.z - 1.1, hadap: Math.PI });
async function _khDatang(id, t) {
  const s = KHD.slot[id], v = _khKendaraan(id); if (!s || !v) { t.userData.ksDiLuar = false; t.visible = true; return; }
  t.userData.khSibuk = true;
  try {
    const kiri = s.x < 0; v.visible = true; v.position.set(kiri ? -30 : 30, 0, 16.6);
    await _kdAnimasi(v, [{ x: s.x, z: 16.6 }, { x: s.x, z: s.z }], s.mobil ? 7 : 6);
    v.rotation.y = s.mobil ? Math.PI / 2 : Math.PI;
    const p = _khTitikTurun(s); t.position.set(p.x, 0, p.z); t.visible = true; t.userData.ksDiLuar = false;
    if (typeof _ktDuduk === "function") _ktDuduk(t, false);
    const lb = KT.label[id]; if (lb) lb.hidden = false;
  } finally { t.userData.khSibuk = false; }
}
async function _khPulang(id, t) {
  const s = KHD.slot[id]; t.userData.khSibuk = true;
  try {
    if (!t.userData.npc) _ktBicara(id, "Ana pamit pulang dulu, assalamu'alaikum.", 2200);
    if (s) await Promise.race([KHD.pergiAsli(t, _khTitikTurun(s), { berdiri: true }), _ktTunggu(45000)]);
    t.visible = false; t.userData.ksDiLuar = true; const lb = KT.label[id]; if (lb) lb.hidden = true;
    const v = KHD.kendaraan[id];
    if (v && s) { v.visible = true; await _kdAnimasi(v, [{ x: s.x, z: 16.6 }, { x: s.x < 0 ? -30 : 30, z: 16.6 }], s.mobil ? 7 : 6); v.visible = false; }
  } finally { t.userData.khSibuk = false; }
}
async function _khPerbarui(awal) {
  if (!KT.buka) return;
  let online = new Set(); try { online = _ksOnline(); } catch (e) {}
  for (const id of _khDaftarOrang()) {
    const t = KT.tokoh[id]; if (!t) continue;
    const harus = _khHarusAda(id, t, online);
    if (awal) { if (harus) { t.userData.ksDiLuar = false; t.visible = true; const lb = KT.label[id]; if (lb) lb.hidden = false; _khParkir(id); } else _khSembunyi(id, t); continue; }
    if (t.userData.khSibuk) continue;
    if (t.userData.ksDiLuar && harus) {
      _khDatang(id, t).then(() => KHD.pergiAsli(t, t.userData.meja)).then(() => { if (!t.userData.npc) _ktBicara(id, "Assalamu'alaikum, bismillah mulai bekerja.", 2400); });
    } else if (!t.userData.ksDiLuar && !harus && !t.userData.jalur && !(KT.sesi && KT.sesi.aktif) && !(typeof KS2 !== "undefined" && KS2.sholat)) {
      _khPulang(id, t);
    }
  }
}

// ── santri berjalan bergantian (putra / putri tidak berbaur) ──
const KHD_ROMBONGAN = [{ jk: "L", sd: true }, { jk: "P", sd: true }, { jk: "L", sd: false }, { jk: "P", sd: false }];
function _khSantri(jk, sd) {
  const t = _ktTokohBaru(jk);
  t.traverse((o) => {
    if (!o.isMesh || !o.material || !o.material.color) return; const h = o.material.color.getHex();
    if (jk === "P" && (h === 0x15151a || h === 0x0d0d10)) { o.material = o.material.clone(); o.material.color.setHex(sd ? 0x1e40af : 0x1e293b); }
    if (jk === "L" && h === 0x334155) { o.material = o.material.clone(); o.material.color.setHex(sd ? 0x991b1b : 0x1f2937); } // celana SD merah, SMP/SMA gelap
  });
  const tas = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.4, 0.16), _khBahan([0xf59e0b, 0x0ea5e9, 0x16a34a, 0xe11d48][Math.floor(Math.random() * 4)])); tas.position.set(0, 0.86, -0.25); t.userData.badan.add(tas);
  t.scale.setScalar(sd ? 0.82 : 1.05); t.userData.santri = true; KT.scene.add(t); return t;
}
function _khMalam() { try { return typeof ksFaseSekarang === "function" ? ksFaseSekarang() === "malam" : new Date().getHours() >= 18 || new Date().getHours() < 6; } catch (e) { return false; } }
function _khKirimRombongan() {
  if (KHD.santri.length || _khMalam() || !KT.buka) return;
  const r = KHD_ROMBONGAN[KHD.antrean++ % KHD_ROMBONGAN.length], n = 3 + Math.floor(Math.random() * 2), arah = KHD.antrean % 2 ? 1 : -1;
  for (let i = 0; i < n; i++) {
    const t = _khSantri(r.jk, r.sd);
    t.position.set(-arah * (30 + i * 1.1), 0, 14.5 + (i % 2) * 0.35); t.rotation.y = arah > 0 ? Math.PI / 2 : -Math.PI / 2;
    t.userData.arah = arah; t.userData.v = r.sd ? 1.25 : 1.45; t.userData.fase = Math.random() * 6; KHD.santri.push(t);
  }
}
function _khGerakSantri(dt) {
  if (!KHD.santri.length) return;
  KHD.santri.forEach((t) => {
    t.position.x += t.userData.arah * t.userData.v * dt; t.userData.fase += dt * 9;
    const ay = Math.sin(t.userData.fase); (t.userData.kaki || []).forEach((k, i) => (k.rotation.x = (i ? -1 : 1) * ay * 0.5)); if (t.userData.badan) t.userData.badan.position.y = Math.abs(ay) * 0.03;
  });
  if (KHD.santri.every((t) => Math.abs(t.position.x) > 31 && Math.sign(t.position.x) === t.userData.arah)) {
    KHD.santri.forEach((t) => KT.scene.remove(t)); KHD.santri = []; KHD.tSantri = performance.now() + 2500 + Math.random() * 4000; // jeda antar-rombongan
  }
}

// ── klik: papan "Hari Ini" & layar rapat ──
function _khSasaran() {
  KHD.target = [];
  if (typeof KJ !== "undefined" && KJ.papan) { KJ.papan.userData.khAksi = "papan"; KHD.target.push(KJ.papan); }
  [[-3.3, 1.8], [-0.8, 1.2]].forEach(([x, w]) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w + 0.1, w * 0.5625 + 0.1, 0.25), new THREE.MeshBasicMaterial({ visible: false }));
    m.position.set(x, 1.7, 0.16); m.userData.khAksi = "rapat"; KT.scene.add(m); KHD.target.push(m);
  });
}
function khBukaPesan() {
  const p = document.getElementById("kt-panel"); KHD.paksa = true;
  if (KT.sesi && KT.sesi.aktif && (!p || !p.querySelector(".kt-obrolan"))) { if (typeof ktPanelRapat === "function") ktPanelRapat(); }
  else if (p && p.innerHTML.trim()) { p.hidden = false; setTimeout(_ktUkur, 30); }
  else toast("Belum ada rapat atau pesan saat ini", "info");
  KHD.paksa = false; _khTombolPesan(false);
}
function _khTombolPesan(tampil) {
  let b = document.getElementById("kh-pesan");
  if (!b) { const l = document.getElementById("kt-layar"); if (!l) return; l.insertAdjacentHTML("beforeend", `<button id="kh-pesan" class="kh-pesan" hidden onclick="khBukaPesan()">💬 <span>Lihat Pesan</span></button>`); b = document.getElementById("kh-pesan"); }
  b.hidden = !tampil; if (tampil) b.querySelector("span").textContent = KT.sesi && KT.sesi.aktif ? "Lihat Percakapan Rapat" : "Lihat Pesan";
}

// ── pengaturan jam kerja (🌗 Suasana) ──
async function _khMuatJam() {
  try { const j = await _ktAmbil(KHD_KUNCI_JAM); if (j && typeof j === "object") ["guru", "kepala", "cs"].forEach((k) => { if (j[k]) KHD.jam[k] = { ...KHD.jam[k], ...j[k] }; }); } catch (e) {}
  if (typeof KS2 !== "undefined") KS2.pulang = KHD.jam.guru.p;
}
async function khAturJam(k, x, v) {
  if (!/^\d{2}:\d{2}$/.test(v || "")) return;
  KHD.jam[k] = { ...KHD.jam[k], [x]: v }; if (k === "guru" && x === "p" && typeof KS2 !== "undefined") { KS2.pulang = v; if (typeof _ksSimpanAtur === "function") _ksSimpanAtur(); }
  try { await _ktSimpan(KHD_KUNCI_JAM, { [k]: KHD.jam[k] }); toast("Jam kerja disimpan", "ok"); } catch (e) { toast("Gagal menyimpan: " + (e.message || e), "err"); }
  _khPerbarui(false);
}
function _khHtmlJam() {
  const boleh = !!KT.pemilik, baris = [["guru", "👳 Ustadz & Ustadzah"], ["kepala", "🏛️ Kepala PKBM"], ["cs", "🧹 Petugas Kebersihan"]];
  return `<div class="kh-jam"><div class="kh-jam-kepala"><span></span><b>Datang</b><b>Pulang</b></div>${baris.map(([k, l]) => `<div class="kh-jam-baris"><span>${l}</span>${["d", "p"].map((x) => `<input type="time" value="${KHD.jam[k][x]}" ${boleh ? "" : "disabled"} onchange="khAturJam('${k}','${x}',this.value)">`).join("")}</div>`).join("")}</div>
    <p class="kt-ket">Datang & pulang naik motor (Kepala PKBM naik mobil), diparkir di halaman depan. Yang sedang online di aplikasi selalu ada. Ahad libur. Bila sudah pulang lalu ada rapat, mereka datang lagi dan pulang setelah rapat selesai.</p>`;
}

// ── "Yang Boleh Menyaksikan": yang dicentang tampil di atas + ringkasan ──
function _khRapikanNonton() {
  const daftar = document.querySelector(".kt-nonton-daftar"); if (!daftar || daftar.dataset.kh) return; daftar.dataset.kh = "1";
  const label = [...daftar.querySelectorAll("label[data-kt-nonton]")];
  label.sort((a, b) => (b.querySelector("input").checked - a.querySelector("input").checked) || a.textContent.localeCompare(b.textContent, "id")).forEach((l) => daftar.appendChild(l));
  const ring = document.createElement("div"); ring.className = "kh-terpilih"; daftar.before(ring);
  const gambar = () => {
    const on = label.filter((l) => l.querySelector("input").checked);
    label.forEach((l) => l.classList.toggle("dipilih", l.querySelector("input").checked));
    ring.innerHTML = `<b>✅ Sudah diizinkan (${on.length}):</b> ${on.length ? on.map((l) => `<span class="kh-chip">${_ktE(l.textContent.trim())}<button type="button" title="Cabut izin" data-id="${l.querySelector("input").value}">✕</button></span>`).join("") : `<i>belum ada</i>`}`;
    ring.querySelectorAll("button[data-id]").forEach((b) => (b.onclick = () => { const i = daftar.querySelector(`input[value="${b.dataset.id}"]`); if (i) { i.checked = false; gambar(); } }));
  };
  daftar.addEventListener("change", gambar); gambar();
  daftar.insertAdjacentHTML("afterend", `<p class="kt-ket">Centang = boleh menyaksikan. Nama yang dicentang selalu tampil paling atas. Nama tidak ada? Kemungkinan statusnya <b>nonaktif</b> di Data Guru.</p>`);
}

// ── pemasangan ──
(function () {
  // _ktPergi: orang yang sedang di luar kantor hanya datang bila dipanggil RAPAT (naik kendaraan); selain itu tetap di luar
  if (typeof _ktPergi === "function") {
    const a = _ktPergi; KHD.pergiAsli = a;
    _ktPergi = function (t, tujuan, opsi) {
      if (t && t.userData && t.userData.ksDiLuar && !t.userData.khSibuk && !t.userData.santri) {
        if (KT.sesi && KT.sesi.aktif && t.userData.staf) { const id = _khId(t); t.userData.khRapat = true; return _khDatang(id, t).then(() => a.call(this, t, tujuan, opsi)); }
        return Promise.resolve();
      }
      return a.apply(this, arguments);
    };
  }
  // kehadiran mengikuti jam kerja (menggantikan "masuk akun hari ini")
  _ksPerbaruiKehadiran = function (awal) { return _khPerbarui(awal); };
  if (typeof _ktBangun === "function") {
    const a = _ktBangun;
    _ktBangun = async function () {
      await a.apply(this, arguments);
      try {
        KHD.kendaraan = {}; KHD.santri = []; KHD.tSantri = performance.now() + 4000;
        await _khMuatJam(); _khSiapkanSlot(); await _khPerbarui(true); _khSasaran();
        clearInterval(KHD.iv); clearInterval(KHD.ivRapat);
        KHD.iv = setInterval(() => { if (!KT.buka) return clearInterval(KHD.iv); _khPerbarui(false); }, 30000);
        KHD.ivRapat = setInterval(() => {
          if (!KT.buka) return clearInterval(KHD.ivRapat);
          if (KT.sesi && KT.sesi.aktif) { if (_khHP() && !KHD.petunjuk) { KHD.petunjuk = true; toast("Rapat dimulai — ketuk layar rapat atau tombol 💬 untuk melihat percakapan", "info"); } return; }
          KHD.petunjuk = false; let online = new Set(); try { online = _ksOnline(); } catch (e) {}
          _khDaftarOrang().forEach((id) => { const t = KT.tokoh[id]; if (t && t.userData.khRapat && !t.userData.jalur && !t.userData.khSibuk) { t.userData.khRapat = false; if (!_khHarusAda(id, t, online)) _khPulang(id, t); } });
        }, 4000);
      } catch (e) { console.warn("Kehidupan kantor:", e); }
    };
  }
  if (typeof _ktJalan === "function") {
    const a = _ktJalan;
    _ktJalan = function () {
      const r = a.apply(this, arguments), k = performance.now(), dt = Math.min(0.1, (k - (KHD.tAkhir || k)) / 1000); KHD.tAkhir = k;
      try { if (KT.buka) { _khGerakSantri(dt); if (!KHD.santri.length && k > KHD.tSantri) _khKirimRombongan(); } } catch (e) {}
      return r;
    };
  }
  if (typeof _ktKetuk === "function") {
    const a = _ktKetuk;
    _ktKetuk = function (e) {
      try {
        if (KHD.target.length && typeof _kmSinar === "function") {
          const kena = _kmSinar(e.clientX, e.clientY).intersectObjects(KHD.target, false)[0];
          if (kena) { const aksi = kena.object.userData.khAksi; if (aksi === "papan") return ktHariIni(); if (aksi === "rapat") return khBukaPesan(); }
        }
      } catch (er) {}
      return a.apply(this, arguments);
    };
  }
  // HP: panel pesan yang muncul sendiri (bukan dari ketukan) disembunyikan → tombol 💬 / ketuk layar rapat
  if (typeof _ktPanel === "function") {
    const a = _ktPanel;
    _ktPanel = function () {
      const r = a.apply(this, arguments), p = document.getElementById("kt-panel");
      const ulah = navigator.userActivation ? navigator.userActivation.isActive : true;
      if (p && _khHP() && !ulah && !KHD.paksa) { p.hidden = true; setTimeout(_ktUkur, 30); _khTombolPesan(true); } else _khTombolPesan(false);
      return r;
    };
  }
  if (typeof ktHariIni === "function") { const h = ktHariIni; ktHariIni = async function () { KHD.paksa = true; try { return await h.apply(this, arguments); } finally { KHD.paksa = false; _khTombolPesan(false); } }; }
  if (typeof ksPanel === "function") {
    const a = ksPanel;
    ksPanel = function () {
      a.apply(this, arguments);
      const w = document.querySelector("#kt-panel .km-info"); if (!w) return;
      const jp = [...w.querySelectorAll("label.ks-cek")].find((l) => /Jam pulang/i.test(l.textContent)); if (jp) jp.remove();
      const cek = [...w.querySelectorAll("label.ks-cek")].find((l) => /kehadiran nyata/i.test(l.textContent));
      if (cek) { cek.lastChild.textContent = " Datang & pulang mengikuti jam kerja di bawah"; cek.insertAdjacentHTML("afterend", _khHtmlJam()); }
    };
  }
  if (typeof ktAturBuka === "function") { const a = ktAturBuka; ktAturBuka = function () { a.apply(this, arguments); try { _khRapikanNonton(); } catch (e) {} }; }
  if (typeof ktTutup === "function") { const a = ktTutup; ktTutup = function () { clearInterval(KHD.iv); clearInterval(KHD.ivRapat); KHD.santri = []; KHD.target = []; return a.apply(this, arguments); }; }
})();

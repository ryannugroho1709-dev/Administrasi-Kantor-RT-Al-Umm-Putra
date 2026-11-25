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
// Parkir terpisah: ustadz di ujung KIRI halaman, mobil Kepala di petak mobil, ustadzah di KANAN pintu masuk (sebelum Musholla).
// Musholla (x 6,3–14) khusus ibadah — tidak ada kendaraan di sana.
const KHD_PARKIR = { L: [], P: [] };
[10.3, 11.4, 12.5].forEach((z) => [-12.5, -13.3, -14.1, -14.9].forEach((x) => KHD_PARKIR.L.push({ x, z })));
[10.3, 11.4, 12.5].forEach((z) => [2.4, 3.2, 4.0, 4.8, 5.6].forEach((x) => KHD_PARKIR.P.push({ x, z })));
function _khSiapkanSlot() {
  KHD.slot = {}; let iL = 0, iP = 0;
  const kid = (KT.peran.kepala || [])[0];
  _khDaftarOrang().forEach((id) => {
    const t = KT.tokoh[id], akhwat = t.userData.jk === "P";
    if (id === kid) { KHD.slot[id] = { x: -10.7, z: 12.3, mobil: true }; return; }
    const daftar = akhwat ? KHD_PARKIR.P : KHD_PARKIR.L, i = akhwat ? iP++ : iL++;
    const p = daftar[i % daftar.length]; KHD.slot[id] = { x: p.x, z: p.z + (i >= daftar.length ? 0.45 : 0) };
  });
}
function _khKendaraan(id) {
  if (KHD.kendaraan[id]) return KHD.kendaraan[id];
  const s = KHD.slot[id]; if (!s) return null;
  const v = s.mobil ? _khMobil(0x14532d) : _khMotor(KHD_WARNA_MOTOR[Math.abs([...id].reduce((a, c) => a + c.charCodeAt(0), 0)) % KHD_WARNA_MOTOR.length]);
  v.visible = false; v.position.set(s.x, 0, s.z); v.rotation.y = Math.PI; KT.scene.add(v); KHD.kendaraan[id] = v; return v;
}
function _khParkir(id) { const v = _khKendaraan(id), s = KHD.slot[id]; if (!v) return; v.visible = true; v.position.set(s.x, 0, s.z); v.rotation.y = Math.PI; }
function _khSembunyi(id, t) {
  t.visible = false; t.userData.ksDiLuar = true; t.userData.jalur = null;
  const s = KHD.slot[id]; if (s) t.position.set(s.x + 0.8, 0, s.z - 0.9);
  const lb = KT.label[id]; if (lb) lb.hidden = true; const v = KHD.kendaraan[id]; if (v) v.visible = false;
}
const _khTitikTurun = (s) => (s.mobil ? { x: s.x + 1.3, z: s.z - 1.2, hadap: Math.PI } : { x: s.x + 0.4, z: s.z - 0.2, hadap: Math.PI });
// jalur kendaraan: ustadz & Kepala dari/ke arah KIRI jalan, ustadzah dari/ke arah KANAN — tidak pernah berpapasan
const _khUjung = (s) => (s.x < 0 ? -30 : 30);
async function _khDatang(id, t) {
  const s = KHD.slot[id], v = _khKendaraan(id); if (!s || !v) { t.userData.ksDiLuar = false; t.visible = true; return; }
  t.userData.khSibuk = true;
  try {
    await _khTungguSantri();
    v.visible = true; v.position.set(_khUjung(s), 0, 16.6);
    await _kdAnimasi(v, [{ x: s.x, z: 16.6 }, { x: s.x, z: s.z }], s.mobil ? 7 : 6);
    v.rotation.y = Math.PI;
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
    if (v && s) { await _khTungguSantri(); v.visible = true; await _kdAnimasi(v, [{ x: s.x, z: 16.6 }, { x: _khUjung(s), z: 16.6 }], s.mobil ? 7 : 6); v.visible = false; }
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

// ── santri berjalan: rombongan PUTRA (SD/SMP/SMA boleh bersama) lalu rombongan PUTRI — bergantian, tidak berbaur ──
// Seragam: SD putih-merah, SMP putih-biru, SMA putih-abu. Putri: SD jilbab putih + gamis merah, SMP jilbab & gamis biru, SMA jilbab & gamis abu-abu.
const KHD_SERAGAM = { SD: { celana: 0xb91c1c, jilbab: 0xf8fafc, gamis: 0xb91c1c, skala: 0.82 }, SMP: { celana: 0x1e40af, jilbab: 0x1e40af, gamis: 0x1e40af, skala: 0.95 }, SMA: { celana: 0x6b7280, jilbab: 0x9ca3af, gamis: 0x6b7280, skala: 1.05 } };
function _khSantri(jk, jenjang) {
  const sg = KHD_SERAGAM[jenjang] || KHD_SERAGAM.SMP, t = _ktTokohBaru(jk);
  t.traverse((o) => {
    if (!o.isMesh || !o.material || !o.material.color) return; const h = o.material.color.getHex();
    if (jk === "L" && h === 0x334155) { o.material = o.material.clone(); o.material.color.setHex(sg.celana); }
    if (jk === "P" && h === 0x15151a) { o.material = o.material.clone(); o.material.color.setHex(sg.gamis); }
    if (jk === "P" && h === 0x0d0d10) { o.material = o.material.clone(); o.material.color.setHex(sg.jilbab); }
  });
  if (jk === "P") { // santriwati berjilbab (wajah terlihat), bukan bercadar
    const b = t.userData.badan, kulit = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.22, 0.02), _khBahan(0xe9c6a0, 0.1)); kulit.position.set(0, 1.32, 0.172); b.add(kulit);
    [-0.06, 0.06].forEach((x) => { const m = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.03, 0.01), _khBahan(0x1f1a17, 0.1)); m.position.set(x, 1.36, 0.184); b.add(m); });
  }
  const tas = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.4, 0.16), _khBahan([0xf59e0b, 0x0ea5e9, 0x16a34a, 0xe11d48, 0x7c3aed][Math.floor(Math.random() * 5)])); tas.position.set(0, 0.86, -0.25); t.userData.badan.add(tas);
  t.scale.setScalar(sg.skala); t.userData.santri = true; KT.scene.add(t); return t;
}
function _khMalam() { try { return typeof ksFaseSekarang === "function" ? ksFaseSekarang() === "malam" : new Date().getHours() >= 18 || new Date().getHours() < 6; } catch (e) { return false; } }
const _khAdaKendaraanBergerak = () => _khDaftarOrang().some((id) => KT.tokoh[id] && KT.tokoh[id].userData.khSibuk);
function _khKirimRombongan() {
  if (KHD.santri.length || _khMalam() || !KT.buka || _khAdaKendaraanBergerak()) return;
  const jk = KHD.antrean++ % 2 ? "P" : "L", n = 4 + Math.floor(Math.random() * 2), arah = Math.floor(KHD.antrean / 2) % 2 ? -1 : 1;
  const jenjang = ["SD", "SMP", "SMA"];
  for (let i = 0; i < n; i++) {
    const t = _khSantri(jk, jenjang[Math.floor(Math.random() * 3)]);
    t.position.set(-arah * (30 + i * 1.15), 0, 14.75 + (i % 2) * 0.3); t.rotation.y = arah > 0 ? Math.PI / 2 : -Math.PI / 2;
    t.userData.arah = arah; t.userData.v = 1.35; t.userData.fase = Math.random() * 6; KHD.santri.push(t);
  }
}
// kendaraan menunggu rombongan santri lewat dulu (tidak menembus / berpapasan)
async function _khTungguSantri() { const t0 = Date.now(); while (KHD.santri.length && KT.buka && Date.now() - t0 < 70000) await _ktTunggu(700); }
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
  KHD.paksa = false; KHD.adaPesan = false; _khSegarPesan();
}
function _khTombolPesan(tampil) { KHD.adaPesan = !!tampil; _khSegarPesan(); }
// HP: tombol tetap untuk menampilkan / menyembunyikan pesan & percakapan rapat
function _khSegarPesan() {
  let b = document.getElementById("kh-pesan");
  if (!b) { const l = document.getElementById("kt-layar"); if (!l) return; l.insertAdjacentHTML("beforeend", `<button id="kh-pesan" class="kh-pesan" hidden onclick="khTogelPesan()">💬 <span>Lihat Pesan</span></button>`); b = document.getElementById("kh-pesan"); }
  const p = document.getElementById("kt-panel"), rapat = !!(KT.sesi && KT.sesi.aktif), terbuka = !!(p && !p.hidden && p.innerHTML.trim());
  const tampil = _khHP() && !rapat && (KHD.adaPesan || terbuka); // saat rapat: tombol ada di bilah rapat
  b.hidden = !tampil; if (!tampil) return;
  b.classList.toggle("buka", terbuka);
  b.innerHTML = terbuka ? `🙈 <span>Sembunyikan ${rapat ? "Percakapan" : "Pesan"}</span>` : `💬 <span>${rapat ? "Lihat Percakapan Rapat" : "Lihat Pesan"}</span>`;
}
// Bilah rapat tetap (PC & HP): judul rapat + 💬 Diskusi Rapat + 🔚 Akhiri Rapat — selalu terlihat selama rapat
function _khBarRapat() {
  const l = document.getElementById("kt-layar"); if (!l) return;
  let b = document.getElementById("kh-rapat-bar"); const aktif = !!(KT.sesi && KT.sesi.aktif);
  if (!aktif) { if (b) b.hidden = true; return; }
  if (!b) { l.insertAdjacentHTML("beforeend", `<div id="kh-rapat-bar" class="kh-rapat-bar"><span class="kh-rb-judul"></span><button class="kh-rb-diskusi" onclick="khDiskusiRapat()">💬 <span>Diskusi Rapat</span></button><button class="kh-rb-akhiri" onclick="khAkhiriRapat()">🔚 <span>Akhiri Rapat</span></button></div>`); b = document.getElementById("kh-rapat-bar"); }
  b.hidden = false; const j = "🪑 " + (KT.sesi.judul || "Rapat") + " · " + (KT.sesi.ids ? KT.sesi.ids.size : 0) + " hadir";
  const el = b.querySelector(".kh-rb-judul"); if (el.textContent !== j) el.textContent = j;
  b.querySelector(".kh-rb-akhiri").hidden = !!KT.penonton;
  const p = document.getElementById("kt-panel"), buka = !!(p && !p.hidden && p.querySelector(".kt-obrolan")), d = b.querySelector(".kh-rb-diskusi"), lbl = buka ? "🙈 <span>Tutup Diskusi</span>" : "💬 <span>Diskusi Rapat</span>";
  if (d.innerHTML !== lbl) d.innerHTML = lbl;
}
function khDiskusiRapat() {
  if (!(KT.sesi && KT.sesi.aktif)) return;
  const p0 = document.getElementById("kt-panel"); if (p0 && !p0.hidden && p0.querySelector(".kt-obrolan")) { p0.hidden = true; setTimeout(() => typeof _ktUkur === "function" && _ktUkur(), 30); _khBarRapat(); return; }
  KHD.paksa = true;
  try { if (typeof ktPanelRapat === "function") ktPanelRapat(); const p = document.getElementById("kt-panel"); if (p) { p.hidden = false; setTimeout(() => { if (typeof _ktUkur === "function") _ktUkur(); p.scrollTop = p.scrollHeight; }, 30); } }
  finally { KHD.paksa = false; KHD.adaPesan = false; _khSegarPesan(); _khBarRapat(); }
}
async function khAkhiriRapat() {
  if (!(KT.sesi && KT.sesi.aktif) || KT.penonton) return;
  const ok = typeof konfirmasiTema === "function" ? await konfirmasiTema("Akhiri rapat \"" + (KT.sesi.judul || "Rapat") + "\" sekarang? Semua peserta kembali ke ruangan masing-masing.", { judul: "Akhiri Rapat", teksOk: "Akhiri" }) : true;
  if (!ok) return;
  if (typeof ktAkhiriRapat === "function") await ktAkhiriRapat();
  _khBarRapat(); toast("Rapat diakhiri", "ok");
}
function khTogelPesan() {
  const p = document.getElementById("kt-panel");
  if (p && !p.hidden && p.innerHTML.trim()) { p.hidden = true; KHD.adaPesan = true; setTimeout(_ktUkur, 30); _khSegarPesan(); return; }
  khBukaPesan();
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

// ── SHOLAT BERJAMAAH yang tertib ──
// Saf diisi dari saf terdepan, dari tengah ke pinggir (rapat & lurus); ustadz di depan, ustadzah di belakang tabir.
// Imam memimpin: takbiratul ihram → (qiyam, ruku', i'tidal, sujud, duduk, sujud) tiap rakaat → tasyahud → salam kanan-kiri → istighfar 3x → kembali.
const KHD_RAKAAT = { Subuh: 2, Dzuhur: 4, Ashar: 4, Maghrib: 3, Isya: 4 };
function _khRapikanSaf() {
  if (typeof KS2 === "undefined" || !KS2.saf || KS2.saf._rapi) return;
  const urutZ = [12.1, 11.55, 12.65, 11.0, 13.2];
  ["L", "P"].forEach((k) => {
    const xs = [...new Set(KS2.saf[k].map((p) => p.x))].sort((a, b) => b - a); // saf terdepan = paling dekat kiblat (+x)
    KS2.saf[k] = xs.flatMap((x) => urutZ.map((z) => ({ x, z, hadap: Math.PI / 2 })));
  });
  KS2.saf._rapi = true;
}
function _khPoseSholat(t, fase, toleh = 0) { if (typeof _ksPose === "function") _ksPose(t, fase); const b = t.userData.badan; if (b) b.rotation.y = toleh; }
async function _khSholatTertib(nama = "Berjamaah") {
  if (!KT.buka || typeof KS2 === "undefined" || !KS2.saf || KS2.sholat) return;
  if (KT.sesi && KT.sesi.aktif) { toast("Rapat berlangsung — sholat setelah rapat", "info"); return; }
  _khRapikanSaf();
  KS2.sholat = true; if (typeof _ksSuara === "function") _ksSuara("azan");
  const peserta = [];
  try {
    const kid = (KT.peran.kepala || [])[0], yid = (KT.peran.yayasan || [])[0];
    const hadir = Object.entries(KT.tokoh).filter(([id, t]) => t.visible && id !== yid && (t.userData.staf || t.userData.npc) && !t.userData.diLuar && !t.userData.ksDiLuar && !t.userData.khSibuk && !t.userData.santri);
    const ikhwan = hadir.filter(([, t]) => t.userData.jk !== "P"), akhwat = hadir.filter(([, t]) => t.userData.jk === "P");
    let imam = ikhwan.find(([id]) => id === kid) || ikhwan.find(([, t]) => t.userData.staf) || ikhwan[0];
    if (!imam) { toast("Belum ada ustadz di kantor untuk menjadi imam", "info"); return; }
    const [imamId] = imam;
    toast(`🕌 Waktu ${nama} — sholat berjamaah di Musholla`, "ok");
    await _ktBicara(imamId, `Allahu akbar, sudah masuk waktu ${nama}. Mari sholat berjamaah.`, 2600);
    let iL = 0, iP = 0;
    hadir.forEach(([id, t]) => {
      const tempat = id === imamId ? KS2.saf.imam : t.userData.jk === "P" ? KS2.saf.P[iP++] : KS2.saf.L[iL++];
      if (!tempat) return;
      peserta.push({ id, t, tempat, p: t.userData.jk === "P", asal: { ...(t.userData.meja || { x: 0, z: 0, hadap: 0 }) } });
    });
    // berangkat BERGANTIAN supaya ustadz & ustadzah tidak berpapasan: ustadz dulu (beriringan satu-satu) sampai semua di saf, baru ustadzah
    const jalanKelompok = async (grup, ke, berdiri = true) => { await Promise.all(grup.map((p, i) => _ktTunggu(i * 700).then(() => KHD.pergiAsli(p.t, ke(p), { berdiri })))); };
    const tungguDiam = (grup, ms = 60000) => { const m = Date.now(); return new Promise((r) => { const iv = setInterval(() => { if (!KT.buka || Date.now() - m > ms || grup.every((p) => !p.t.userData.jalur)) { clearInterval(iv); r(); } }, 400); }); };
    const ikh = peserta.filter((p) => !p.p), akh = peserta.filter((p) => p.p);
    peserta.forEach((p) => { p.t.userData.antre = true; }); // barisan saf boleh rapat (tidak saling menunggu)
    await Promise.race([jalanKelompok(ikh, (p) => p.tempat), tungguDiam(ikh, 45000)]);
    if (!KT.buka) return;
    ikh.forEach((p) => { p.t.userData.jalur = null; p.t.position.set(p.tempat.x, 0, p.tempat.z); p.t.rotation.y = Math.PI / 2; _khPoseSholat(p.t, 3); }); // ustadz duduk menunggu di saf
    if (akh.length) { await _ktTunggu(600); await Promise.race([jalanKelompok(akh, (p) => p.tempat), tungguDiam(akh, 45000)]); }
    if (!KT.buka) return;
    // luruskan saf: tiap orang tepat di garis safnya & menghadap kiblat
    peserta.forEach((p) => { p.t.userData.jalur = null; p.t.position.set(p.tempat.x, 0, p.tempat.z); p.t.rotation.y = Math.PI / 2; if (typeof _ktDuduk === "function") _ktDuduk(p.t, false); _khPoseSholat(p.t, 0); });
    await _ktBicara(imamId, "Luruskan dan rapatkan saf, karena lurusnya saf termasuk kesempurnaan sholat.", 2600);
    const semua = (fase, toleh) => peserta.forEach((p) => _khPoseSholat(p.t, fase, toleh));
    const langkah = async (teks, fase, ms = 1700, toleh = 0) => { if (!KT.buka) return; if (teks) _ktBicara(imamId, teks, ms - 150); await _ktTunggu(250); semua(fase, toleh); await _ktTunggu(ms - 250); };
    const n = KHD_RAKAAT[nama] || 2;
    await langkah("Allahu akbar.", 0, 2200); // takbiratul ihram
    for (let r = 1; r <= n; r++) {
      if (r > 1) await langkah("Allahu akbar.", 0, 1500);
      await langkah(r <= 2 ? "(membaca Al-Fatihah & surat)" : "(membaca Al-Fatihah)", 0, 2200);
      await langkah("Allahu akbar.", 1); // ruku'
      await langkah("Sami'allahu liman hamidah.", 0); // i'tidal
      await langkah("Allahu akbar.", 2); // sujud
      await langkah("Allahu akbar.", 3, 1400); // duduk di antara dua sujud
      await langkah("Allahu akbar.", 2); // sujud kedua
      if (r === 2 || r === n) await langkah(r === n ? "Allahu akbar. (tasyahud akhir)" : "Allahu akbar. (tasyahud awal)", 3, 2400);
    }
    await langkah("Assalamu'alaikum warahmatullah.", 3, 1700, 0.7);   // salam ke kanan
    await langkah("Assalamu'alaikum warahmatullah.", 3, 1700, -0.7);  // salam ke kiri
    semua(3, 0);
    for (let i = 0; i < 3; i++) await langkah("Astaghfirullahal 'adzim.", 3, 1500);
    await _ktBicara(imamId, "Alhamdulillah. Ustadzah kembali lebih dulu, kami menyusul setelah dzikir.", 2400);
    // pulang BERGANTIAN: ustadzah kembali lebih dulu, ustadz tetap duduk berdzikir sampai ustadzah tiba di ruangannya
    akh.forEach((p) => _khPoseSholat(p.t, 0, 0));
    if (akh.length) { await Promise.race([jalanKelompok(akh, (p) => p.asal, false), _ktTunggu(60000)]); }
    if (!KT.buka) return;
    await _ktTunggu(500); ikh.forEach((p) => _khPoseSholat(p.t, 0, 0));
    await Promise.race([jalanKelompok(ikh, (p) => p.asal, false), _ktTunggu(60000)]);
  } finally { peserta.forEach((p) => { _khPoseSholat(p.t, 0, 0); p.t.userData.antre = false; }); KS2.sholat = false; }
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
  // sholat berjamaah tertib menggantikan versi lama
  ksSholat = function (nama) { return _khSholatTertib(nama); };
  // kehadiran mengikuti jam kerja (menggantikan "masuk akun hari ini")
  _ksPerbaruiKehadiran = function (awal) { return _khPerbarui(awal); };
  if (typeof _ktBangun === "function") {
    const a = _ktBangun;
    _ktBangun = async function () {
      await a.apply(this, arguments);
      try {
        KHD.kendaraan = {}; KHD.santri = []; KHD.tSantri = performance.now() + 4000;
        _khRapikanSaf(); await _khMuatJam(); _khSiapkanSlot(); await _khPerbarui(true); _khSasaran();
        clearInterval(KHD.iv); clearInterval(KHD.ivRapat);
        KHD.iv = setInterval(() => { if (!KT.buka) return clearInterval(KHD.iv); _khPerbarui(false); }, 30000);
        clearInterval(KHD.ivPesan); KHD.ivPesan = setInterval(() => { if (!KT.buka) return clearInterval(KHD.ivPesan); try { _khSegarPesan(); _khBarRapat(); } catch (e) {} }, 1000);
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
      const p0 = document.getElementById("kt-panel"), tadiTerbuka = !!(p0 && !p0.hidden && p0.innerHTML.trim()); // yang sedang dibaca jangan ditutup
      const r = a.apply(this, arguments), p = document.getElementById("kt-panel");
      const ulah = navigator.userActivation ? navigator.userActivation.isActive : true;
      if (p && _khHP() && !ulah && !KHD.paksa && !tadiTerbuka) { p.hidden = true; setTimeout(_ktUkur, 30); _khTombolPesan(true); } else _khTombolPesan(false);
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

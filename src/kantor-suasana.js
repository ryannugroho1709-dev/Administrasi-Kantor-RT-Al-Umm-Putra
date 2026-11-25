// ============================================================
//  KANTOR MAYA — SUASANA HIDUP
//  1. Siang–malam: OTOMATIS mengikuti jam (pagi/siang/sore/malam) atau DIATUR sendiri (🌗 Suasana).
//  2. Waktu sholat Barabai (hitungan astronomi, ihtiyat 2 menit): saat Dzuhur/Ashar/Maghrib petugas sholat
//     berjamaah di MUSHOLLA (halaman depan kanan): Kepala menjadi imam, ustadz di saf depan, ustadzah di belakang tabir.
//  3. Datang & pulang nyata: yang belum masuk akun hari ini belum ada di mejanya; begitu masuk, ia berjalan masuk
//     lewat pintu depan. Lewat jam pulang, yang sudah tidak daring berjalan pulang.
//  4. Tamu dari Kalender Akademik hari ini (kunjungan/Dinas/wali santri/visitasi…) datang & diterima Kepala.
//  5. Hiasan otomatis: Ramadhan (lampion), Wisuda (umbul-umbul) bila ada agenda wisuda ±3 hari.
//  6. Piala dari capaian nyata (Kertas Kerja BOSP disahkan, kehadiran santri ≥ 90%, capaian SOP ≥ 80%, Terakreditasi A).
//  7. Papan Prestasi Pekan Ini di Dinding Informasi (jurnal terbanyak, kehadiran santri terbaik) + waktu sholat.
//  8. Suara latar (bisa dimatikan): kicau burung pagi–siang, bunyi mesin kopi saat istirahat, nada pengingat sholat.
// ============================================================
const KS2 = { waktu: "otomatis", suara: false, nyata: true, sholatOto: true, pulang: "16:30", sholat: false, sholatHari: {}, hadir: new Set(), agenda: [], tamuSelesai: new Set(), prestasi: [], pekan: null, halInfo: 0 };
try { const s = JSON.parse(localStorage.getItem("kt:suasana") || "{}"); Object.assign(KS2, { waktu: s.waktu || "otomatis", suara: !!s.suara, nyata: s.nyata !== false, sholatOto: s.sholatOto !== false, pulang: s.pulang || "16:30" }); } catch (e) {}
const _ksSimpanAtur = () => { try { localStorage.setItem("kt:suasana", JSON.stringify({ waktu: KS2.waktu, suara: KS2.suara, nyata: KS2.nyata, sholatOto: KS2.sholatOto, pulang: KS2.pulang })); } catch (e) {} };
const _ksMat = (hex, rough = 0.6, metal = 0) => new THREE.MeshStandardMaterial({ color: new THREE.Color(hex).convertSRGBToLinear(), roughness: rough, metalness: metal });
const _ksBalok = (w, h, d, m, x, y, z) => { const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); b.position.set(x, y, z); b.castShadow = true; b.receiveShadow = true; KT.scene.add(b); return b; };

// ── 1. siang–malam ──
const KS_FASE = {
  pagi: { bg: 0xf3d9b8, hemi: 0.5, dir: 0.85, warnaDir: 0xffd6a0, exp: 1.0, lampu: 1.0, nama: "Pagi" },
  siang: { bg: 0xdde8f0, hemi: 0.55, dir: 1.05, warnaDir: 0xfff1d6, exp: 1.05, lampu: 0.8, nama: "Siang" },
  sore: { bg: 0xf0bf8c, hemi: 0.42, dir: 0.75, warnaDir: 0xffae63, exp: 1.0, lampu: 1.3, nama: "Sore" },
  malam: { bg: 0x0b1628, hemi: 0.16, dir: 0.1, warnaDir: 0x8fa8ff, exp: 1.2, lampu: 2.6, nama: "Malam" },
};
function ksFaseSekarang() { if (KS2.waktu !== "otomatis") return KS2.waktu; const j = new Date().getHours() + new Date().getMinutes() / 60; return j >= 5 && j < 7.5 ? "pagi" : j >= 7.5 && j < 15.5 ? "siang" : j >= 15.5 && j < 18.3 ? "sore" : "malam"; }
function _ksTerapkanCahaya(dt) {
  if (!KT.scene || !KT.renderer) return; const f = KS_FASE[ksFaseSekarang()], a = Math.min(1, dt * 1.5);
  if (!KT.scene.background || !KT.scene.background.isColor) return;
  const bg = new THREE.Color(f.bg); KT.scene.background.lerp(bg, a);
  KT.scene.traverse((o) => {
    if (o.isHemisphereLight) o.intensity += (f.hemi - o.intensity) * a;
    else if (o.isDirectionalLight) { o.intensity += (f.dir - o.intensity) * a; o.color.lerp(new THREE.Color(f.warnaDir), a); }
    else if (o.isPointLight && !(typeof KM !== "undefined" && KM.cine)) { const t = (o.userData.target ?? 0.45) * f.lampu; o.intensity += (t - o.intensity) * a; }
  });
  KT.renderer.toneMappingExposure += (f.exp - KT.renderer.toneMappingExposure) * a;
}

// ── 2. waktu sholat (Barabai: -2.585, 115.383, WITA) ──
function ksWaktuSholat(tgl = new Date(), lat = -2.585, lng = 115.383, tz = 8) {
  const rad = Math.PI / 180, y = tgl.getFullYear(), m = tgl.getMonth() + 1, d = tgl.getDate();
  const jd = 367 * y - Math.floor((7 * (y + Math.floor((m + 9) / 12))) / 4) + Math.floor((275 * m) / 9) + d + 1721013.5 - lng / 360;
  const n360 = (x) => ((x % 360) + 360) % 360, D = jd - 2451545.0, g = n360(357.529 + 0.98560028 * D) * rad, q = n360(280.459 + 0.98564736 * D);
  const L = n360(q + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g)) * rad, e = (23.439 - 0.00000036 * D) * rad;
  const RA = Math.atan2(Math.cos(e) * Math.sin(L), Math.cos(L)) / rad / 15, dek = Math.asin(Math.sin(e) * Math.sin(L));
  const fix = (h) => ((h % 24) + 24) % 24, EqT = q / 15 - fix(RA);
  const dzuhur = 12 + tz - lng / 15 - EqT, phi = lat * rad;
  const T = (sudut) => Math.acos((-Math.sin(sudut * rad) - Math.sin(dek) * Math.sin(phi)) / (Math.cos(dek) * Math.cos(phi))) / rad / 15;
  const A = (t) => { const s = Math.atan(1 / (t + Math.tan(Math.abs(phi - dek)))); return Math.acos((Math.sin(s) - Math.sin(dek) * Math.sin(phi)) / (Math.cos(dek) * Math.cos(phi))) / rad / 15; };
  const jam = (h) => { h += 2 / 60; const H = Math.floor(h), M = Math.floor((h - H) * 60); return `${String(H).padStart(2, "0")}:${String(M).padStart(2, "0")}`; };
  return { Subuh: jam(dzuhur - T(20)), Dzuhur: jam(dzuhur), Ashar: jam(dzuhur + A(1)), Maghrib: jam(dzuhur + T(0.833)), Isya: jam(dzuhur + T(18)) };
}
function _ksBangunMusholla() {
  const sc = KT.scene, putih = _ksMat(0xf5f1e8, 0.35), hijau = _ksMat(0x123f32, 0.6), emas = _ksMat(0xc6a45c, 0.3, 0.85), kayu = _ksMat(0x725139, 0.55);
  _ksBalok(7.8, 0.06, 4.0, putih, 10.2, 0.03, 11.9);                        // lantai marmer
  _ksBalok(7.4, 0.012, 3.6, hijau, 10.2, 0.066, 11.9);                        // karpet sajadah
  for (let x = 7.2; x <= 13.4; x += 0.75) _ksBalok(0.03, 0.01, 3.5, emas, x, 0.075, 11.9); // garis saf
  [[6.4, 10], [14, 10], [6.4, 13.8], [14, 13.8]].forEach(([x, z]) => { _ksBalok(0.3, 3.0, 0.3, putih, x, 1.5, z); _ksBalok(0.34, 0.06, 0.34, emas, x, 3.0, z); _kdBlokir(x, z, 0.3, 0.3); });
  _ksBalok(7.9, 0.16, 0.2, hijau, 10.2, 3.05, 10); _ksBalok(7.9, 0.16, 0.2, hijau, 10.2, 3.05, 13.8); _ksBalok(0.2, 0.16, 4.0, hijau, 6.4, 3.05, 11.9); _ksBalok(0.2, 0.16, 4.0, hijau, 14, 3.05, 11.9);
  _ksBalok(0.15, 1.3, 4.0, putih, 14.05, 0.75, 11.9); _kdBlokir(14.05, 11.9, 0.15, 4.0);  // dinding kiblat
  _ksBalok(7.9, 1.1, 0.12, putih, 10.2, 0.7, 13.85); _kdBlokir(10.2, 13.85, 7.9, 0.15); // dinding belakang
  const mihrab = _ksBalok(0.3, 2.2, 1.2, hijau, 13.9, 1.3, 11.9); _ksBalok(0.32, 0.08, 1.3, emas, 13.9, 2.42, 11.9); _kdBlokir(13.9, 11.9, 0.3, 1.2);
  const kubah = new THREE.Mesh(new THREE.SphereGeometry(0.75, 24, 14, 0, Math.PI * 2, 0, Math.PI / 2), _ksMat(0x123f32, 0.4)); kubah.position.set(13.4, 3.1, 11.9); kubah.castShadow = true; sc.add(kubah);
  const tiang = _ksBalok(0.05, 0.4, 0.05, emas, 13.4, 4.05, 11.9); const bulan = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.03, 8, 20, Math.PI * 1.4), emas); bulan.position.set(13.4, 4.35, 11.9); bulan.rotation.y = Math.PI / 2; sc.add(bulan);
  // tabir: ustadz (depan, dekat mihrab) | ustadzah (belakang)
  _ksBalok(0.06, 1.5, 3.3, new THREE.MeshStandardMaterial({ color: new THREE.Color(0x14532d).convertSRGBToLinear(), transparent: true, opacity: 0.85 }), 10.3, 0.95, 12.15); _kdBlokir(10.3, 12.15, 0.08, 3.3);
  const papan = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 0.55), new THREE.MeshBasicMaterial({ map: _ktTeksKanvas("Musholla Al-Umm", { latar: "#0f3d2e", ukuran: 54 }), toneMapped: false })); papan.position.set(10.2, 3.42, 10.0); sc.add(papan);
  papan.material.map.encoding = THREE.sRGBEncoding;
  _ksBalok(1.2, 0.08, 0.5, kayu, 6.9, 0.04, 10.6); // rak sandal
  // titik saf (menghadap kiblat = +x)
  KS2.saf = { imam: { x: 13.25, z: 11.9, hadap: Math.PI / 2 }, L: [], P: [] };
  [12.45, 11.7, 10.95].forEach((x) => [11.0, 11.55, 12.1, 12.65, 13.2].forEach((z) => KS2.saf.L.push({ x, z, hadap: Math.PI / 2 })));
  [9.5, 8.75, 8.0].forEach((x) => [11.0, 11.55, 12.1, 12.65, 13.2].forEach((z) => KS2.saf.P.push({ x, z, hadap: Math.PI / 2 })));
}
function _ksPose(t, fase) { // 0 qiyam, 1 ruku, 2 sujud, 3 duduk
  const b = t.userData.badan; if (!b) return;
  const tg = [[0, 0], [0, 0.65], [-0.55, 1.05], [-0.32, 0]][fase];
  b.position.y = tg[0]; b.rotation.x = tg[1];
}
async function ksSholat(nama = "Berjamaah", lamaDetik = 45) {
  if (!KT.buka || !KS2.saf || KS2.sholat) return;
  if (KT.sesi && KT.sesi.aktif) { toast("Rapat berlangsung — sholat setelah rapat", "info"); return; }
  KS2.sholat = true; _ksSuara("azan");
  const kid = (KT.peran.kepala || [])[0], yid = (KT.peran.yayasan || [])[0];
  toast(`🕌 Waktu ${nama} — sholat berjamaah di Musholla`, "ok");
  const semua = Object.entries(KT.tokoh).filter(([id, t]) => t.visible && id !== yid && t.userData.staf && !t.userData.npc && !t.userData.diLuar && !t.userData.ksDiLuar);
  const kp = kid && KT.tokoh[kid] && KT.tokoh[kid].visible ? KT.tokoh[kid] : null;
  if (kp) await _ktBicara(kid, `Allahu akbar, sudah masuk waktu ${nama}. Mari sholat berjamaah.`, 2600);
  const pakai = { L: 0, P: 0 }, peserta = [];
  semua.forEach(([id, t]) => {
    const jk = t.userData.jk || (t.userData.staf && t.userData.staf.jk) || "L"; let tempat;
    if (kp && t === kp) tempat = KS2.saf.imam; else { const s = jk === "P" ? "P" : "L"; tempat = KS2.saf[s][pakai[s]++]; }
    if (!tempat) return; peserta.push({ id, t, asal: { ...(t.userData.meja || { x: 0, z: 0, hadap: 0 }) } });
    _ktTunggu(Math.random() * 1500).then(() => _ktPergi(t, tempat, { berdiri: true }));
  });
  // tunggu semua tiba (maks 60 detik)
  const mulai = Date.now(); await new Promise((r) => { const iv = setInterval(() => { if (!KT.buka || Date.now() - mulai > 60000 || peserta.every((p) => !p.t.userData.jalur)) { clearInterval(iv); r(); } }, 500); });
  if (kp) _ktBicara(kid, "Luruskan dan rapatkan saf. Allahu akbar.", 2400);
  const urut = [0, 1, 0, 2, 3, 2, 0], t0 = Date.now();
  await new Promise((r) => { let i = 0; const iv = setInterval(() => { if (!KT.buka || Date.now() - t0 > lamaDetik * 1000) { clearInterval(iv); return r(); } peserta.forEach((p) => _ksPose(p.t, urut[i % urut.length])); i++; }, 2200); });
  peserta.forEach((p) => _ksPose(p.t, 0));
  if (kp) await _ktBicara(kid, "Alhamdulillah. Mari kembali bekerja.", 2000);
  await Promise.race([Promise.all(peserta.map((p, i) => _ktTunggu(i * 300).then(() => _ktPergi(p.t, p.asal)))), _ktTunggu(60000)]);
  KS2.sholat = false;
}
function _ksCekSholat() {
  if (!KT.buka || !KT.pemilik || !KS2.sholatOto || KS2.sholat) return;
  const w = ksWaktuSholat(), kini = new Date(), hhmm = `${String(kini.getHours()).padStart(2, "0")}:${String(kini.getMinutes()).padStart(2, "0")}`, hari = kini.toDateString();
  ["Dzuhur", "Ashar", "Maghrib"].forEach((n) => {
    const kunci = hari + n; if (KS2.sholatHari[kunci]) return;
    const [h, m] = w[n].split(":").map(Number), selisih = kini.getHours() * 60 + kini.getMinutes() - (h * 60 + m);
    if (selisih >= 0 && selisih <= 10) { KS2.sholatHari[kunci] = true; ksSholat(n); }
  });
  return hhmm;
}

// ── 3. datang & pulang nyata ──
const KS_PINTU = { x: 0, z: 9.7, hadap: 0 };
async function _ksMuatHadir() {
  const hari = new Date(); hari.setHours(0, 0, 0, 0);
  const s = new Set([STATE.guruId]);
  try { const r = await supaSemua.from("log_aktivitas").select("guru_id").eq("aksi", "masuk-akun").gte("waktu", hari.toISOString()); (r.data || []).forEach((x) => x.guru_id && s.add(x.guru_id)); } catch (e) {}
  try { const st = KT_HADIR.kanal ? KT_HADIR.kanal.presenceState() : {}; Object.keys(st).forEach((k) => s.add(k)); } catch (e) {}
  KS2.hadir = s; return s;
}
function _ksOnline() { try { return new Set(Object.keys(KT_HADIR.kanal ? KT_HADIR.kanal.presenceState() : {})); } catch (e) { return new Set(); } }
const _ksMenit = (s) => { const [h, m] = String(s || "16:30").split(":").map(Number); return h * 60 + (m || 0); };
function _ksKeluar(t, id) { t.visible = false; t.userData.ksDiLuar = true; t.position.set(KS_PINTU.x, 0, KS_PINTU.z); const lb = KT.label[id]; if (lb) lb.hidden = true; }
async function _ksPerbaruiKehadiran(awal) {
  if (!KT.buka || !KS2.nyata) return;
  const hadir = await _ksMuatHadir(), online = _ksOnline(), kini = new Date(), lewatPulang = kini.getHours() * 60 + kini.getMinutes() >= _ksMenit(KS2.pulang);
  const yid = (KT.peran.yayasan || [])[0];
  for (const s of KT.staf || []) {
    const t = KT.tokoh[s.id]; if (!t || s.id === yid || s.id === STATE.guruId) continue;
    // jam kerja: semua tetap di mejanya (yang belum masuk akun hari ini labelnya dibuat samar); setelah jam pulang baru yang tidak hadir tidak ada
    const lb0 = KT.label[s.id]; if (lb0) lb0.classList.toggle("ks-belum", !hadir.has(s.id) && !online.has(s.id));
    if (awal) { if (!hadir.has(s.id) && lewatPulang) _ksKeluar(t, s.id); continue; }
    if (t.userData.ksDiLuar && hadir.has(s.id) && !lewatPulang) { // datang
      t.userData.ksDiLuar = false; t.visible = true; t.position.set(KS_PINTU.x, 0, KS_PINTU.z); const lb = KT.label[s.id]; if (lb) lb.hidden = false;
      _ktPergi(t, t.userData.meja).then(() => _ktBicara(s.id, "Assalamu'alaikum, bismillah mulai bekerja.", 2400));
    } else if (!t.userData.ksDiLuar && lewatPulang && !online.has(s.id) && !t.userData.jalur && !(KT.sesi && KT.sesi.aktif) && !KS2.sholat) { // pulang
      _ktBicara(s.id, "Ana pamit pulang dulu, assalamu'alaikum.", 2200);
      _ktPergi(t, KS_PINTU, { berdiri: true }).then(() => _ksKeluar(t, s.id));
    }
  }
}

// ── 4 & 5. agenda: tamu, wisuda, Ramadhan ──
const KS_TAMU_RX = /kunjungan|tamu|dinas|orang ?tua|wali santri|pengawas|monev|akreditasi|asesor|visitasi|supervisi/i;
async function _ksMuatAgenda() {
  const t = new Date(), iso = (d) => d.toISOString().slice(0, 10), a = new Date(t.getTime() - 3 * 864e5), b = new Date(t.getTime() + 3 * 864e5);
  try { const r = await supaSemua.from("kaldik_item").select("judul,jenis,tanggal_mulai,tanggal_selesai,ruang_id").lte("tanggal_mulai", iso(b)).gte("tanggal_selesai", iso(a)); KS2.agenda = r.data || []; } catch (e) { KS2.agenda = []; }
  return KS2.agenda;
}
const ksAgendaHariIni = () => { const h = tanggalISO(); return (KS2.agenda || []).filter((x) => x.tanggal_mulai <= h && (x.tanggal_selesai || x.tanggal_mulai) >= h); };
const ksTamuHariIni = () => ksAgendaHariIni().filter((x) => KS_TAMU_RX.test(`${x.judul} ${x.jenis}`));
const ksRamadhan = () => { try { return new Intl.DateTimeFormat("en-u-ca-islamic", { month: "numeric" }).format(new Date()).replace(/\D/g, "") === "9"; } catch (e) { return false; } };
function _ksHiasan() {
  const sc = KT.scene;
  if (ksRamadhan()) { // lampion di pintu masuk
    [-1.55, -0.8, 0, 0.8, 1.55].forEach((x, i) => { const tali = _ksBalok(0.01, 0.4, 0.01, _ksMat(0xc6a45c, 0.3, 0.8), x, 3.0 - 0.2, 8.95); const l = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.13, 0.28, 8), new THREE.MeshBasicMaterial({ color: i % 2 ? 0xfbbf24 : 0xf97316 })); l.position.set(x, 2.45, 8.95); sc.add(l); });
  }
  if ((KS2.agenda || []).some((x) => /wisuda/i.test(x.judul || ""))) { // umbul-umbul wisuda
    const w = [0x123f32, 0xc6a45c, 0xf5f1e8];
    for (let x = -1.4; x <= 1.4; x += 0.35) { const f = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.26, 3), new THREE.MeshBasicMaterial({ color: w[Math.round((x + 1.4) / 0.35) % 3] })); f.rotation.x = Math.PI; f.position.set(x, 2.55, 8.75); sc.add(f); }
    const p = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 0.42), new THREE.MeshBasicMaterial({ map: _ktTeksKanvas("Selamat Wisuda", { latar: "#c6a45c", warna: "#0b3026", ukuran: 58 }), toneMapped: false })); p.position.set(0, 2.25, 8.76); sc.add(p);
  }
}
async function _ksTamu() {
  if (!KT.buka || !KT.pemilik) return;
  const daftar = ksTamuHariIni().filter((x) => !KS2.tamuSelesai.has(x.judul)); if (!daftar.length) return;
  const ag = daftar[0]; KS2.tamuSelesai.add(ag.judul);
  const t = _ktTokohBaru("L"); t.traverse((o) => { if (o.isMesh && o.material.color && o.material.color.getHex() === 0xf8fafc) { o.material = o.material.clone(); o.material.color.setHex(0x1e293b); } });
  t.userData.npc = true; t.userData.meja = { ...KS_PINTU }; t.position.set(0, 0, 15); KT.scene.add(t); const id = "npc-tamu"; KT.tokoh[id] = t;
  const ham = document.getElementById("kt-hamparan");
  if (ham) { const d = document.createElement("button"); d.className = "kt-label kb-label"; d.style.setProperty("--w", "#7c3aed"); d.innerHTML = `<b>Tamu</b><small>${_ktE(String(ag.judul).slice(0, 40))}</small>`; ham.appendChild(d); KT.label[id] = d; const b = document.createElement("div"); b.className = "kt-gelembung"; b.hidden = true; ham.appendChild(b); KT.gelembung[id] = b; }
  await _ktPergi(t, KS_PINTU, { berdiri: true }); await _ktBicara(id, "Assalamu'alaikum, ana datang untuk " + String(ag.judul).slice(0, 60) + ".", 2800);
  const kid = (KT.peran.kepala || [])[0], kp = kid && KT.tokoh[kid];
  if (kp && kp.visible) { await Promise.all([_ktPergi(kp, KT.kursiKepala), _ktPergi(t, KT.kursiTamu[0])]); await _ktBicara(kid, "Wa'alaikumussalam, ahlan wa sahlan. Silakan duduk.", 2600); }
  else await _ktPergi(t, KT.kursiTamu[0]);
  await _ktTunggu(180000);
  if (!KT.buka) return;
  await _ktBicara(id, "Jazakumullahu khairan, ana pamit.", 2000); await _ktPergi(t, { x: 0, z: 15, hadap: 0 }, { berdiri: true });
  KT.scene.remove(t); delete KT.tokoh[id]; KT.label[id]?.remove(); delete KT.label[id]; KT.gelembung[id]?.remove(); delete KT.gelembung[id];
}

// ── 6. piala dari capaian nyata ──
async function _ksPrestasi() {
  const daftar = [{ nama: "Terakreditasi A", ok: true }];
  try { if (typeof _ktDataBosp === "function") { const b = await _ktDataBosp(); ["A", "Pa", "Pi"].forEach((r) => daftar.push({ nama: `Kertas Kerja BOSP ${KT_PENDEK_RG[r]} disahkan`, ok: (b.jenjang[r].kk.status || "") === "disahkan" })); } } catch (e) {}
  try { if (typeof _ktDataFitur === "function") for (const r of ["A", "Pa", "Pi"]) { const f = await _ktDataFitur(r), p = _ktPersenHadir(f.hadir); daftar.push({ nama: `Kehadiran santri ${KT_PENDEK_RG[r]} ≥ 90%`, ok: p != null && p >= 90, ket: p != null ? p + "%" : "belum terekam" }); } } catch (e) {}
  try { if (typeof sopMuat === "function") { await sopMuat(); const ym = new Date().toISOString().slice(0, 7), nilai = []; sopKunciSemua().forEach((k) => { const kode = k.split("@")[0]; if (sopTahap(kode) === "kenal") return; (SOP.pj[k] || []).forEach((id) => { const c = sopCapaian(id, k, ym); if (c.persen != null) nilai.push(c.persen); }); }); if (nilai.length) { const p = Math.round(nilai.reduce((a, b) => a + b, 0) / nilai.length); daftar.push({ nama: "Capaian SOP PKBM ≥ 80%", ok: p >= 80, ket: p + "%" }); } } } catch (e) {}
  KS2.prestasi = daftar; _ksPiala(); return daftar;
}
function _ksPiala() {
  (KS2.pialaObj || []).forEach((o) => KT.scene && KT.scene.remove(o)); KS2.pialaObj = [];
  const emas = _ksMat(0xc6a45c, 0.25, 0.9), alas = _ksMat(0x252a28, 0.4);
  (KS2.prestasi || []).filter((x) => x.ok).slice(0, 8).forEach((x, i) => {
    const g = new THREE.Group(); g.position.set(-4.68, 0.5, -5.95 + i * 0.3);
    const a = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.06, 0.16), alas); a.position.y = 0.03; g.add(a);
    const k = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.08, 10), emas); k.position.y = 0.1; g.add(k);
    const c = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.035, 0.14, 14), emas); c.position.y = 0.21; g.add(c);
    KT.scene.add(g); KS2.pialaObj.push(g);
  });
}

// ── 7. papan prestasi pekan ini + halaman Dinding Informasi ──
async function _ksPekanIni() {
  const t7 = new Date(Date.now() - 7 * 864e5).toISOString().slice(0, 10), hasil = { jurnal: [], hadir: [] };
  try { const r = await supaSemua.from("jurnal_kelas").select("guru_id").gte("tanggal", t7); const n = {}; (r.data || []).forEach((x) => x.guru_id && (n[x.guru_id] = (n[x.guru_id] || 0) + 1)); const g = KT.guru || []; hasil.jurnal = Object.entries(n).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([id, c]) => ({ nama: ((g.find((x) => x.id === id) || {}).nama || "-").replace(/,.*$/, ""), c })); } catch (e) {}
  try { const r = await supaSemua.from("jurnal_kelas").select("ruang_id,jumlah_hadir,jumlah_izin,jumlah_sakit,jumlah_alpha").gte("tanggal", t7); const p = {}; (r.data || []).forEach((x) => { const o = (p[x.ruang_id] = p[x.ruang_id] || { h: 0, t: 0 }); o.h += x.jumlah_hadir || 0; o.t += (x.jumlah_hadir || 0) + (x.jumlah_izin || 0) + (x.jumlah_sakit || 0) + (x.jumlah_alpha || 0); }); hasil.hadir = Object.entries(p).filter(([r, o]) => o.t && KT_PENDEK_RG[r]).map(([r, o]) => ({ r, p: Math.round((o.h / o.t) * 100) })).sort((a, b) => b.p - a.p); } catch (e) {}
  KS2.pekan = hasil; return hasil;
}
(function () {
  if (typeof _kmGambarInfo !== "function") return;
  const asli = _kmGambarInfo;
  _kmGambarInfo = function () {
    const hal = KS2.halInfo % 3; if (hal === 0 || !KM.infoKanvas) return asli.apply(this, arguments);
    const c = KM.infoKanvas, x = c.getContext("2d"), W = c.width, H = c.height;
    const g = x.createLinearGradient(0, 0, W, H); g.addColorStop(0, "#0b3026"); g.addColorStop(1, "#123f32"); x.fillStyle = g; x.fillRect(0, 0, W, H);
    x.strokeStyle = "#c6a45c"; x.lineWidth = 4; x.strokeRect(8, 8, W - 16, H - 16); x.textAlign = "left";
    if (hal === 1) {
      const w = ksWaktuSholat(); x.fillStyle = "#e9d8a6"; x.font = "800 24px system-ui"; x.fillText(`WAKTU SHOLAT · BARABAI${ksRamadhan() ? " · RAMADHAN" : ""}`, 26, 46);
      Object.entries(w).forEach(([n, j], i) => { x.fillStyle = "#f5f1e8"; x.font = "700 30px system-ui"; x.fillText(n, 40, 100 + i * 52); x.fillStyle = "#c6a45c"; x.font = "800 34px system-ui"; x.fillText(j, 300, 100 + i * 52); });
    } else {
      const p = KS2.pekan || { jurnal: [], hadir: [] }; x.fillStyle = "#e9d8a6"; x.font = "800 24px system-ui"; x.fillText("🏆 PRESTASI PEKAN INI", 26, 46);
      x.fillStyle = "#c6a45c"; x.font = "700 20px system-ui"; x.fillText("Jurnal mengajar terbanyak (7 hari)", 26, 88);
      x.fillStyle = "#f5f1e8"; x.font = "700 24px system-ui"; (p.jurnal.length ? p.jurnal : [{ nama: "belum ada data", c: "" }]).forEach((j, i) => x.fillText(`${i + 1}. ${j.nama}${j.c ? "  —  " + j.c + " jurnal" : ""}`, 40, 124 + i * 32));
      x.fillStyle = "#c6a45c"; x.font = "700 20px system-ui"; x.fillText("Kehadiran santri terbaik (7 hari)", 26, 240);
      x.fillStyle = "#f5f1e8"; x.font = "700 24px system-ui"; x.fillText(p.hadir.length ? p.hadir.map((h) => `${KT_PENDEK_RG[h.r]} ${h.p}%`).join("   ·   ") : "belum ada data", 40, 278);
    }
    KM.infoTeks.needsUpdate = true;
  };
})();

// ── 8. suara latar (dibuat langsung, tanpa berkas suara) ──
let _ksAudio = null;
function _ksSuara(jenis) {
  if (!KS2.suara) return;
  try {
    _ksAudio = _ksAudio || new (window.AudioContext || window.webkitAudioContext)(); const ac = _ksAudio, t = ac.currentTime;
    const nada = (f, mulai, lama, vol = 0.05, tipe = "sine") => { const o = ac.createOscillator(), g = ac.createGain(); o.type = tipe; o.frequency.setValueAtTime(f, t + mulai); g.gain.setValueAtTime(0, t + mulai); g.gain.linearRampToValueAtTime(vol, t + mulai + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + mulai + lama); o.connect(g).connect(ac.destination); o.start(t + mulai); o.stop(t + mulai + lama + 0.05); return o; };
    if (jenis === "burung") { for (let i = 0; i < 3; i++) { const o = nada(2600 + Math.random() * 900, i * 0.18, 0.12, 0.02); o.frequency.exponentialRampToValueAtTime(3600, t + i * 0.18 + 0.1); } }
    if (jenis === "azan") { [523, 659, 784, 659].forEach((f, i) => nada(f, i * 0.5, 1.4, 0.06, "triangle")); }
    if (jenis === "kopi") { const n = ac.createBufferSource(), buf = ac.createBuffer(1, ac.sampleRate * 1.2, ac.sampleRate), d = buf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * 0.04 * (1 - i / d.length); n.buffer = buf; const fl = ac.createBiquadFilter(); fl.type = "bandpass"; fl.frequency.value = 1800; n.connect(fl).connect(ac.destination); n.start(); }
  } catch (e) {}
}

// ── pengaturan: 🌗 Suasana ──
function ksPanel() {
  const w = ksWaktuSholat(), f = ksFaseSekarang();
  _ktPanel(`<div class="km-info"><small>SUASANA KANTOR</small><h3>🌗 Suasana</h3>
    <h4>Waktu</h4><div class="kt-tab">${["otomatis", "pagi", "siang", "sore", "malam"].map((k) => `<button class="${KS2.waktu === k ? "on" : ""}" onclick="ksAtur('waktu','${k}')">${k === "otomatis" ? "Otomatis" : KS_FASE[k].nama}</button>`).join("")}</div>
    <p class="kt-ket">Sekarang: <b>${KS_FASE[f].nama}</b>${KS2.waktu === "otomatis" ? " (mengikuti jam)" : " (diatur manual)"}</p>
    <h4>Waktu Sholat Hari Ini (Barabai)</h4><div class="ks-sholat">${Object.entries(w).map(([n, j]) => `<span><small>${n}</small><b>${j}</b></span>`).join("")}</div>
    <label class="ks-cek"><input type="checkbox" ${KS2.sholatOto ? "checked" : ""} onchange="ksAtur('sholatOto',this.checked)"> Sholat berjamaah otomatis saat Dzuhur, Ashar & Maghrib</label>
    <button class="kt-salin" onclick="ksSholat('Berjamaah')">🕌 Sholat Berjamaah Sekarang</button>
    <h4>Kehadiran</h4><label class="ks-cek"><input type="checkbox" ${KS2.nyata ? "checked" : ""} onchange="ksAtur('nyata',this.checked)"> Datang & pulang mengikuti kehadiran nyata (masuk akun hari ini)</label>
    <label class="ks-cek">Jam pulang <input type="time" value="${KS2.pulang}" onchange="ksAtur('pulang',this.value)"></label>
    <h4>Suara</h4><label class="ks-cek"><input type="checkbox" ${KS2.suara ? "checked" : ""} onchange="ksAtur('suara',this.checked)"> Suara latar (kicau burung, mesin kopi, nada pengingat sholat)</label>
    <h4>Prestasi Lembaga (piala di Ruang Kepala)</h4><ul class="kt-ul">${(KS2.prestasi || []).map((p) => `<li>${p.ok ? "🏆" : "▫️"} ${_ktE(p.nama)}${p.ket ? ` <small>(${_ktE(p.ket)})</small>` : ""}</li>`).join("") || "<li>Memuat…</li>"}</ul></div>`);
}
function ksAtur(k, v) { KS2[k] = v; _ksSimpanAtur(); if (k === "suara" && v) _ksSuara("burung"); if (k === "nyata" && !v) (KT.staf || []).forEach((s) => { const t = KT.tokoh[s.id]; if (t && t.userData.ksDiLuar) { t.userData.ksDiLuar = false; t.visible = true; t.position.set(t.userData.meja.x, 0, t.userData.meja.z); if (KT.label[s.id]) KT.label[s.id].hidden = false; } }); if (k === "nyata" && v) _ksPerbaruiKehadiran(false); ksPanel(); }

// ── pemasangan ──
(function () {
  if (typeof _ktPergi === "function") { // orang yang "belum datang/sudah pulang" dipanggil → ia datang lewat pintu depan
    const a = _ktPergi;
    _ktPergi = function (t) { if (t && t.userData && t.userData.ksDiLuar) { t.userData.ksDiLuar = false; t.visible = true; t.position.set(KS_PINTU.x, 0, KS_PINTU.z); const id = t.userData.staf && t.userData.staf.id; if (id && KT.label[id]) KT.label[id].hidden = false; } return a.apply(this, arguments); };
  }
  if (typeof _ktJalan === "function") { const a = _ktJalan; let akhir = performance.now(); _ktJalan = function () { const k = performance.now(), dt = Math.min(0.1, (k - akhir) / 1000); akhir = k; try { _ksTerapkanCahaya(dt); } catch (e) {} return a.apply(this, arguments); }; }
  if (typeof kmIstirahat === "function") { const a = kmIstirahat; kmIstirahat = function () { _ksSuara("kopi"); return a.apply(this, arguments); }; }
  if (typeof KT_RAPAT_KEPALA !== "undefined" && !KT_RAPAT_KEPALA.some((x) => x[2] === "__sholat")) KT_RAPAT_KEPALA.splice(2, 0, ["🕌", "Sholat Berjamaah di Musholla", "__sholat"]);
  if (typeof ktPerintah === "function") { const a = ktPerintah; ktPerintah = function (teks) { if (teks === "__sholat") return ksSholat("Berjamaah"); return a.apply(this, arguments); }; }
  if (typeof kmDirektori === "function") { // Resepsionis: tamu terjadwal dari Kalender Akademik (bukan DEMO lagi)
    const a = kmDirektori;
    kmDirektori = function (tab = "struktur") {
      a.call(this, tab); if (tab !== "tamu") return; const p = document.getElementById("kt-panel"), w = p && p.querySelector(".km-info"); if (!w) return;
      const tamu = ksTamuHariIni(), sekitar = (KS2.agenda || []).filter((x) => KS_TAMU_RX.test(`${x.judul} ${x.jenis}`));
      w.querySelectorAll(".km-demo, .km-info > p").forEach((e) => e.remove());
      w.insertAdjacentHTML("beforeend", `<h4>Tamu Hari Ini</h4>${tamu.length ? `<ul class="kt-ul">${tamu.map((x) => `<li><b>${_ktE(x.judul)}</b> <small>${_ktE(KT_PENDEK_RG[x.ruang_id] || "PKBM")}</small></li>`).join("")}</ul>` : `<p class="kt-ket">Tidak ada tamu terjadwal hari ini.</p>`}
        <h4>Agenda Tamu ±3 Hari</h4>${sekitar.length ? `<ul class="kt-ul">${sekitar.map((x) => `<li>${_ktE(x.tanggal_mulai)} — ${_ktE(x.judul)}</li>`).join("")}</ul>` : `<p class="kt-ket">Belum ada.</p>`}
        <p class="kt-ket">Sumber: Kalender Akademik (kunjungan, Dinas, wali santri, visitasi, supervisi). Tamu yang terjadwal hari ini akan datang ke kantor & diterima Kepala PKBM.</p>`);
    };
  }
  if (typeof _ktBangun === "function") {
    const a = _ktBangun;
    _ktBangun = async function () {
      await a.apply(this, arguments);
      try {
        KS2.sholat = false; KS2.halInfo = 0; _ksBangunMusholla();
        const atas = document.querySelector("#kantor-ai .kt-alat");
        if (atas && !document.getElementById("ks-tombol")) atas.insertAdjacentHTML("afterbegin", `<button id="ks-tombol" onclick="ksPanel()" title="Siang–malam, waktu sholat, kehadiran, suara">🌗<span class="kt-sembunyi-hp"> Suasana</span></button>`);
        await Promise.all([_ksMuatAgenda(), KS2.nyata ? _ksPerbaruiKehadiran(true) : null]);
        _ksHiasan(); _ksPrestasi(); _ksPekanIni();
        clearInterval(KS2.iv); let n = 0;
        KS2.iv = setInterval(() => {
          if (!KT.buka) { clearInterval(KS2.iv); return; } n++;
          _ksCekSholat();
          if (n % 6 === 0) { _ksPerbaruiKehadiran(false); }
          if (n % 3 === 0 && KS2.suara && ["pagi", "siang"].includes(ksFaseSekarang()) && Math.random() < 0.5) _ksSuara("burung");
          if (n % 2 === 0) { KS2.halInfo++; if (typeof _kmGambarInfo === "function") _kmGambarInfo(); }
          if (n % 180 === 0) { _ksPrestasi(); _ksPekanIni(); }
        }, 20000);
        setTimeout(_ksTamu, 15000);
      } catch (e) { console.warn("Suasana kantor:", e); }
    };
  }
  if (typeof ktTutup === "function") { const a = ktTutup; ktTutup = function () { clearInterval(KS2.iv); KS2.sholat = false; return a.apply(this, arguments); }; }
})();

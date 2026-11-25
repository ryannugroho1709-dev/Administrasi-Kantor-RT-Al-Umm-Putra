// ============================================================
//  KANTOR MAYA — tampilan khusus jabatan + Dzikir Pagi + Lampu Meja + Papan "Hari Ini"
//  • Ketua Yayasan: gamis & jubah, sorban putih, selendang hijau, cincin cahaya emas, label emas
//  • Kepala PKBM : jas hitam, kemeja putih, dasi, pin emas, bendera Merah Putih & papan nama, cincin hijau
//  • Penyelenggara: selempang / pin warna jenjang, map warna jenjang di meja, cincin warna jenjang
//  • Admin        : rompi biru, kartu tanda pengenal, headset, layar kedua, cincin biru
//    (ustadzah tetap gamis hitam syar'i + cadar — pembeda hanya pin, kartu, headset & barang di meja)
//  • Lampu meja: menyala hijau = sedang online di aplikasi; padam = tidak online
//  • Dzikir Pagi & Tilawah 07.00 di Musholla (otomatis sekali sehari, bisa juga diperintah Kepala)
//  • Papan "Hari Ini" di depan pintu masuk: ujian hari ini + pengawas, agenda Kalender Akademik
// ============================================================
const KJ = { cincin: [], lampu: {}, papan: null, papanKanvas: null, dzikir: false, dzikirHari: "", iv: null, data: { ujian: [], agenda: [] } };
const KJ_RG = { A: 0x047857, Pa: 0x1d4ed8, Pi: 0xbe185d };
const KJ_RG_CSS = { A: "#047857", Pa: "#1d4ed8", Pi: "#be185d" };
const KJ_NAMA_RG = { A: "Paket A", Pa: "Paket B & C Putra", Pi: "Paket B & C Putri" };

function _kjJenis(s) {
  const p = (s && s.peran) || [];
  if (p.includes("yayasan")) return { j: "yayasan" };
  if (p.includes("kepala")) return { j: "kepala" };
  const py = p.find((k) => String(k).startsWith("peny-")); if (py) return { j: "peny", r: py.slice(5) };
  const ad = p.find((k) => String(k).startsWith("admin-")); if (ad) return { j: "admin", r: ad.slice(6) };
  return null;
}
const _kjBahan = (warna, opsi = {}) => new THREE.MeshStandardMaterial({ color: warna, roughness: 0.75, metalness: 0, envMapIntensity: 0.3, ...opsi });
function _kjKotak(induk, w, h, d, warna, x, y, z, opsi) { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), _kjBahan(warna, opsi)); m.position.set(x, y, z); m.castShadow = true; induk.add(m); return m; }
function _kjBulat(induk, r, warna, x, y, z, opsi) { const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.02, 20), _kjBahan(warna, opsi)); m.rotation.x = Math.PI / 2; m.position.set(x, y, z); induk.add(m); return m; }

// ── pakaian & tanda di tubuh ──
function _kjDandani(t, jn) {
  const b = t.userData.badan, akhwat = t.userData.jk === "P";
  if (!b || t.userData.kjSudah) return; t.userData.kjSudah = true;
  const emas = 0xc9a227;
  if (!akhwat) {
    if (jn.j === "yayasan") {
      _kjKotak(b, 0.53, 0.6, 0.31, 0xfafaf7, 0, 0.8, 0);                       // gamis putih
      [-1, 1].forEach((a) => _kjKotak(b, 0.13, 0.62, 0.33, 0xcbb994, a * 0.2, 0.79, 0)); // jubah krem terbuka
      _kjKotak(b, 0.42, 0.17, 0.42, 0xffffff, 0, 1.5, 0);                     // sorban
      _kjKotak(b, 0.32, 0.08, 0.32, 0xf5f5f0, 0, 1.6, 0);
      _kjKotak(b, 0.12, 0.32, 0.04, 0xffffff, 0, 1.3, -0.2);                  // ekor sorban
      const s = _kjKotak(b, 0.1, 0.7, 0.02, 0x0f766e, 0, 0.84, 0.17); s.rotation.z = 0.55; // selendang hijau
    } else if (jn.j === "kepala") {
      _kjKotak(b, 0.53, 0.6, 0.31, 0x15171c, 0, 0.8, 0);                       // jas hitam
      [-1, 1].forEach((a) => _kjKotak(b, 0.13, 0.52, 0.17, 0x15171c, a * 0.31, 0.82, 0));
      _kjKotak(b, 0.13, 0.48, 0.012, 0xf8fafc, 0, 0.86, 0.158);               // kemeja
      _kjKotak(b, 0.05, 0.34, 0.01, 0x7f1d1d, 0, 0.88, 0.166);                // dasi
      _kjBulat(b, 0.035, emas, 0.15, 0.98, 0.168, { metalness: 0.8, roughness: 0.25 }); // pin emas
    } else if (jn.j === "peny") {
      const s = _kjKotak(b, 0.1, 0.7, 0.02, KJ_RG[jn.r] || 0x1d4ed8, 0, 0.82, 0.165); s.rotation.z = -0.55; // selempang jenjang
      _kjBulat(b, 0.035, emas, -0.15, 0.98, 0.168, { metalness: 0.8, roughness: 0.25 });
    } else if (jn.j === "admin") {
      _kjKotak(b, 0.53, 0.5, 0.31, 0x1e40af, 0, 0.84, 0);                      // rompi biru
      _kjKotak(b, 0.11, 0.5, 0.012, 0xf8fafc, 0, 0.84, 0.158);
      [-1, 1].forEach((a) => { const l = _kjKotak(b, 0.025, 0.3, 0.01, 0x2563eb, a * 0.06, 0.9, 0.166); l.rotation.z = a * 0.25; }); // tali kartu
      _kjKotak(b, 0.11, 0.14, 0.012, 0xffffff, 0, 0.7, 0.168); _kjKotak(b, 0.11, 0.035, 0.014, 0x2563eb, 0, 0.755, 0.169);
      _kjKotak(b, 0.4, 0.04, 0.07, 0x111827, 0, 1.47, 0);                     // headset
      [-1, 1].forEach((a) => _kjKotak(b, 0.06, 0.12, 0.12, 0x111827, a * 0.195, 1.3, 0));
    }
  } else {
    // ustadzah: gamis hitam & cadar tidak diubah — hanya tanda di depan khimar
    if (jn.j === "peny" || jn.j === "kepala" || jn.j === "yayasan") {
      _kjBulat(b, 0.05, jn.j === "peny" ? KJ_RG[jn.r] || 0xbe185d : emas, 0, 0.98, 0.3, { metalness: 0.5, roughness: 0.3 });
      _kjBulat(b, 0.03, emas, 0, 0.98, 0.312, { metalness: 0.8, roughness: 0.25 });
    }
    if (jn.j === "admin") {
      _kjKotak(b, 0.11, 0.14, 0.012, 0xffffff, 0, 0.9, 0.345); _kjKotak(b, 0.11, 0.035, 0.014, 0x2563eb, 0, 0.955, 0.347);
      [-1, 1].forEach((a) => _kjKotak(b, 0.06, 0.12, 0.12, 0x1f2937, a * 0.185, 1.32, 0)); // headset di atas khimar
    }
  }
  // cincin cahaya di lantai
  const warna = { yayasan: 0xe0b021, kepala: 0x16a34a, admin: 0x2563eb }[jn.j] || KJ_RG[jn.r] || 0x16a34a;
  const c = new THREE.Mesh(new THREE.RingGeometry(0.42, 0.56, 40), new THREE.MeshBasicMaterial({ color: warna, transparent: true, opacity: 0.5, depthWrite: false, side: THREE.DoubleSide }));
  c.rotation.x = -Math.PI / 2; c.position.y = 0.03; c.renderOrder = 2; t.add(c); KJ.cincin.push(c);
}

// ── barang di sekitar meja ──
function _kjArah(k) { const h = k.hadap || 0; return { f: [Math.sin(h), Math.cos(h)], s: [Math.cos(h), -Math.sin(h)], h }; }
function _kjTitik(k, maju, samping) { const a = _kjArah(k); return [k.x + a.f[0] * maju + a.s[0] * samping, k.z + a.f[1] * maju + a.s[1] * samping]; }
function _kjBendera(k) {
  const g = new THREE.Group(), [x, z] = _kjTitik(k, -0.75, 0.95); g.position.set(x, 0, z); g.rotation.y = _kjArah(k).h;
  const tiang = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 2.1, 10), _kjBahan(0xd4af37, { metalness: 0.8, roughness: 0.3 })); tiang.position.y = 1.05; g.add(tiang);
  _kjKotak(g, 0.26, 0.06, 0.26, 0x3b2314, 0, 0.03, 0);
  _kjKotak(g, 0.62, 0.2, 0.02, 0xdc2626, 0.33, 1.9, 0); _kjKotak(g, 0.62, 0.2, 0.02, 0xffffff, 0.33, 1.7, 0);
  KT.scene.add(g);
}
function _kjPapanNama(k, teks, warna = "#0f3d2e") {
  const c = document.createElement("canvas"); c.width = 256; c.height = 64; const x = c.getContext("2d");
  x.fillStyle = warna; x.fillRect(0, 0, 256, 64); x.strokeStyle = "#c9a227"; x.lineWidth = 6; x.strokeRect(3, 3, 250, 58);
  x.fillStyle = "#fde68a"; x.font = "700 26px system-ui, sans-serif"; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText(teks, 128, 34);
  const tx = new THREE.CanvasTexture(c), [px, pz] = _kjTitik(k, 0.42, 0.25);
  const m = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.1, 0.05), [0, 0, 0, 0, 1, 1].map((i) => (i ? new THREE.MeshBasicMaterial({ map: tx }) : _kjBahan(0xc9a227, { metalness: 0.7 }))));
  m.position.set(px, 0.84, pz); m.rotation.y = _kjArah(k).h + Math.PI; KT.scene.add(m);
}
function _kjMap(k, warna) { [0, 1].forEach((i) => { const [x, z] = _kjTitik(k, 0.5, -0.42); const m = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.03, 0.34), _kjBahan(warna)); m.position.set(x, 0.81 + i * 0.035, z); m.rotation.y = _kjArah(k).h + i * 0.18; KT.scene.add(m); }); }
function _kjLayarKedua(k) {
  const g = new THREE.Group(), [x, z] = _kjTitik(k, 0.62, 0.42); g.position.set(x, 0, z); g.rotation.y = _kjArah(k).h + Math.PI - 0.35;
  _kjKotak(g, 0.46, 0.3, 0.03, 0x111827, 0, 1.02, 0); _kjKotak(g, 0.04, 0.2, 0.04, 0x374151, 0, 0.88, -0.02); _kjKotak(g, 0.18, 0.02, 0.12, 0x374151, 0, 0.79, 0);
  const l = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.26), new THREE.MeshBasicMaterial({ color: 0x60a5fa })); l.position.set(0, 1.02, 0.017); g.add(l);
  KT.scene.add(g);
}
function _kjLampu(id, k) {
  const g = new THREE.Group(), [x, z] = _kjTitik(k, 0.55, -0.55); g.position.set(x, 0, z);
  _kjKotak(g, 0.12, 0.02, 0.12, 0x374151, 0, 0.8, 0);
  const tiang = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.22, 8), _kjBahan(0x6b7280)); tiang.position.y = 0.92; g.add(tiang);
  const bola = new THREE.Mesh(new THREE.SphereGeometry(0.06, 14, 10), new THREE.MeshBasicMaterial({ color: 0xe5e7eb })); bola.position.y = 1.05; g.add(bola);
  const sinar = new THREE.Mesh(new THREE.SphereGeometry(0.13, 14, 10), new THREE.MeshBasicMaterial({ color: 0xe5e7eb, transparent: true, opacity: 0.18, depthWrite: false })); sinar.position.y = 1.05; g.add(sinar);
  KT.scene.add(g); KJ.lampu[id] = { bola, sinar, status: "" };
}
// lampu meja: hijau menyala = sedang online di aplikasi saat ini; selain itu padam
function _kjPerbaruiLampu() {
  if (!KT.buka) return;
  let online = new Set(); try { online = typeof _ksOnline === "function" ? _ksOnline() : new Set(Object.keys(KT_HADIR.kanal ? KT_HADIR.kanal.presenceState() : {})); } catch (e) {}
  if (STATE.guruId) online.add(STATE.guruId);
  Object.entries(KJ.lampu).forEach(([id, L]) => {
    const st = online.has(id) ? "online" : "mati", w = st === "online" ? 0x22c55e : 0x9ca3af; L.status = st;
    L.bola.material.color.setHex(w); L.sinar.material.color.setHex(w); L.sinar.material.opacity = st === "online" ? 0.35 : 0;
  });
}

// ── label ──
function _kjLabel(id, jn) {
  const lb = KT.label[id]; if (!lb || lb.dataset.kj) return; lb.dataset.kj = jn.j;
  lb.classList.add("jb-" + jn.j);
  if (jn.r) lb.style.setProperty("--jr", KJ_RG_CSS[jn.r] || "#1d4ed8");
  const ikon = { yayasan: "🕌", kepala: "🏛️", peny: "🎓", admin: "🖥️" }[jn.j];
  const b = lb.querySelector("b"); if (b && ikon) b.insertAdjacentHTML("afterbegin", `<span class="jb-ikon">${ikon}</span>`);
}

// ── Dzikir Pagi & Tilawah ──
const KJ_DZIKIR = ["Subhanallah wa bihamdih, subhanallahil 'azhim.", "Astaghfirullahal 'azhim wa atubu ilaih.", "Allahumma bika ashbahna wa bika amsaina.", "Laa ilaaha illallahu wahdahu laa syariika lah.", "Radhitu billahi rabba, wa bil islami diina.", "Hasbiyallahu laa ilaaha illa huw."];
async function ksDzikirPagi(lamaDetik = 70) {
  if (!KT.buka || KJ.dzikir || (typeof KS2 !== "undefined" && (KS2.sholat || !KS2.saf))) { if (typeof KS2 !== "undefined" && !KS2.saf) toast("Musholla belum siap", "info"); return; }
  if (KT.sesi && KT.sesi.aktif) { toast("Rapat berlangsung — dzikir pagi setelah rapat", "info"); return; }
  KJ.dzikir = true; KS2.sholat = true; // memakai Musholla yang sama, mencegah tumpang tindih dengan sholat
  try {
    const kid = (KT.peran.kepala || [])[0], yid = (KT.peran.yayasan || [])[0];
    toast("📿 Dzikir Pagi & Tilawah bersama di Musholla", "ok");
    const kp = kid && KT.tokoh[kid] && KT.tokoh[kid].visible ? KT.tokoh[kid] : null;
    if (kp) await _ktBicara(kid, "Bismillah, mari kita awali hari dengan dzikir pagi dan tilawah bersama.", 2800);
    const pakai = { L: 0, P: 0 }, peserta = [];
    Object.entries(KT.tokoh).filter(([id, t]) => t.visible && id !== yid && t.userData.staf && !t.userData.npc && !t.userData.diLuar && !t.userData.ksDiLuar).forEach(([id, t]) => {
      const jk = t.userData.jk === "P" ? "P" : "L"; const tempat = kp && t === kp ? KS2.saf.imam : KS2.saf[jk][pakai[jk]++]; if (!tempat) return;
      peserta.push({ id, t, asal: { ...(t.userData.meja || { x: 0, z: 0, hadap: 0 }) } });
      _ktTunggu(Math.random() * 1500).then(() => _ktPergi(t, tempat, { berdiri: true }));
    });
    const mulai = Date.now(); await new Promise((r) => { const iv = setInterval(() => { if (!KT.buka || Date.now() - mulai > 60000 || peserta.every((p) => !p.t.userData.jalur)) { clearInterval(iv); r(); } }, 500); });
    peserta.forEach((p) => _ktDuduk(p.t, true));
    const t0 = Date.now(); let i = 0;
    await new Promise((r) => { const iv = setInterval(() => {
      if (!KT.buka || Date.now() - t0 > lamaDetik * 1000) { clearInterval(iv); return r(); }
      const p = peserta[(i * 3) % Math.max(1, peserta.length)]; if (p) _ktBicara(p.id, i % 4 === 3 ? "📖 (membaca Al-Qur'an)" : KJ_DZIKIR[i % KJ_DZIKIR.length], 3200); i++;
    }, 3600); });
    if (kp) await _ktBicara(kid, "Alhamdulillah. Semoga Allah berkahi pekerjaan kita hari ini. Mari mulai bekerja.", 2800);
    await Promise.race([Promise.all(peserta.map((p, j) => _ktTunggu(j * 300).then(() => _ktPergi(p.t, p.asal)))), _ktTunggu(60000)]);
  } finally { KJ.dzikir = false; KS2.sholat = false; }
}
function _kjCekDzikir() {
  if (!KT.buka || !KT.pemilik || KJ.dzikir) return;
  const k = new Date(), hari = k.toDateString(), m = k.getHours() * 60 + k.getMinutes();
  if (KJ.dzikirHari === hari || m < 7 * 60 || m > 7 * 60 + 15 || k.getDay() === 0) return;
  KJ.dzikirHari = hari; try { localStorage.setItem("kt:dzikir", hari); } catch (e) {}
  ksDzikirPagi();
}

// ── Papan "Hari Ini" ──
async function _kjMuatHariIni() {
  const hari = tanggalISO(), hasil = { ujian: [], agenda: [] };
  try {
    const daftar = (typeof JU !== "undefined" && JU.daftar && JU.daftar.length ? JU.daftar : await _kvAmbil(typeof _JU_KUNCI !== "undefined" ? _JU_KUNCI : "ujian:jadwal", [])) || [];
    daftar.filter((j) => (j.hari || []).includes(hari)).forEach((j) => {
      (j.sesi || []).forEach((s, i) => {
        const isi = (j.kelas || []).map((k) => { const x = j.slot && j.slot[typeof _juKunci === "function" ? _juKunci(hari, s.id, k) : `${hari}|${s.id}|${k}`]; const l = typeof _juLabelSlot === "function" ? _juLabelSlot(x) : x && x.m; return l ? { kelas: typeof _juAngkaKelas === "function" ? _juAngkaKelas(k) : k, mapel: l, p: (x.p || []).map((g) => (typeof _juNamaGelar === "function" ? _juNamaGelar(g) : g)) } : null; }).filter(Boolean);
        if (isi.length) hasil.ujian.push({ judul: j.judul, sesi: i + 1, jam: `${s.mulai}–${s.selesai}`, isi });
      });
    });
  } catch (e) {}
  try { hasil.agenda = ((typeof KS2 !== "undefined" && KS2.agenda) || []).filter((a) => a.tanggal_mulai <= hari && (a.tanggal_selesai || a.tanggal_mulai) >= hari); } catch (e) {}
  KJ.data = hasil; return hasil;
}
function _kjGambarPapan() {
  const c = KJ.papanKanvas; if (!c) return; const x = c.getContext("2d"), W = c.width, H = c.height, d = KJ.data;
  x.fillStyle = "#0f3d2e"; x.fillRect(0, 0, W, H); x.strokeStyle = "#c9a227"; x.lineWidth = 10; x.strokeRect(5, 5, W - 10, H - 10);
  x.fillStyle = "#fde68a"; x.font = "800 60px system-ui, sans-serif"; x.fillText("HARI INI", 34, 80);
  const tgl = new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  x.fillStyle = "#ecfdf5"; x.font = "600 32px system-ui, sans-serif"; x.fillText(tgl, 34, 124);
  x.fillStyle = "#c9a227"; x.fillRect(34, 142, W - 68, 4);
  let y = 192; const baris = (t, f = "600 24px", w = "#ecfdf5") => { if (y > H - 24) return; x.font = f + " system-ui, sans-serif"; x.fillStyle = w; let s = String(t); while (x.measureText(s).width > W - 76 && s.length > 4) s = s.slice(0, -2); if (s !== String(t)) s = s.slice(0, -1) + "…"; x.fillText(s, 38, y); y += parseInt(f.split(" ")[1]) + 12; };
  if (d.ujian.length) {
    baris("📝 " + d.ujian[0].judul, "800 32px", "#fde68a");
    d.ujian.slice(0, 3).forEach((u) => { baris(`Sesi ${u.sesi} · ${u.jam}`, "700 29px", "#a7f3d0"); baris(u.isi.map((z) => `Kls ${z.kelas} ${z.mapel}`).join(" · "), "500 27px"); });
    const pw = new Set(); d.ujian.forEach((u) => u.isi.forEach((z) => z.p.forEach((n) => pw.add(n)))); baris(`👥 ${pw.size} pengawas bertugas hari ini`, "600 28px", "#fde68a");
  } else baris("Tidak ada ujian hari ini.", "500 29px", "#a7f3d0");
  y += 6; baris("📅 Agenda", "800 32px", "#fde68a");
  if (d.agenda.length) d.agenda.slice(0, 3).forEach((a) => baris("• " + a.judul, "500 28px")); else baris("Tidak ada agenda di Kalender Akademik.", "500 28px", "#a7f3d0");
  x.fillStyle = "rgba(236,253,245,.6)"; x.font = "500 22px system-ui, sans-serif"; x.fillText("Rincian lengkap: tombol 📋 Hari Ini", 34, H - 26);
  if (KJ.papan) KJ.papan.material.map.needsUpdate = true;
}
function _kjBangunPapan() {
  const c = (KJ.papanKanvas = document.createElement("canvas")); c.width = 900; c.height = 656;
  const g = new THREE.Group(); g.position.set(-3.1, 0, 9.35); g.rotation.y = 0.12;
  const tx = new THREE.CanvasTexture(c); tx.anisotropy = 4;
  const p = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 1.82), new THREE.MeshBasicMaterial({ map: tx })); p.position.set(0, 1.72, 0.035); g.add(p); KJ.papan = p;
  _kjKotak(g, 2.62, 1.94, 0.06, 0x3b2314, 0, 1.72, 0); _kjKotak(g, 2.66, 0.07, 0.1, 0xc9a227, 0, 2.7, 0, { metalness: 0.7, roughness: 0.3 });
  [-1.05, 1.05].forEach((a) => _kjKotak(g, 0.08, 0.8, 0.08, 0x3b2314, a, 0.4, 0));
  KT.scene.add(g); if (typeof _kdBlokir === "function") _kdBlokir(-3.1, 9.35, 2.7, 0.4);
  _kjGambarPapan();
}
async function ktHariIni() {
  await _kjMuatHariIni(); _kjGambarPapan();
  const d = KJ.data, e = typeof _ktE === "function" ? _ktE : (s) => String(s);
  const lampu = Object.entries(KJ.lampu).map(([id, L]) => ({ id, st: L.status, n: ((KT.staf || []).find((s) => s.id === id) || {}).namaLengkap || "" })).filter((x) => x.n);
  _ktPanel(`<div class="km-info"><small>PAPAN DEPAN</small><h3>📋 Hari Ini</h3><p class="kt-ket">${e(new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" }))}</p>
    <h4>📝 Ujian Hari Ini</h4>${d.ujian.length ? d.ujian.map((u) => `<div class="kj-ujian"><b>Sesi ${u.sesi} · ${e(u.jam)}</b>${u.isi.map((z) => `<div><span>Kelas ${e(z.kelas)}</span> ${e(z.mapel)}<small>${e(z.p.join(", ") || "Belum ada pengawas")}</small></div>`).join("")}</div>`).join("") : `<p class="kt-ket">Tidak ada ujian hari ini.</p>`}
    <h4>📅 Agenda Kalender Akademik</h4>${d.agenda.length ? `<ul class="kt-ul">${d.agenda.map((a) => `<li>${e(a.judul)}</li>`).join("")}</ul>` : `<p class="kt-ket">Tidak ada agenda hari ini.</p>`}
    <h4>💡 Lampu Meja</h4><p class="kt-ket">🟢 menyala = sedang online di aplikasi · ⚫ padam = tidak online</p>
    ${lampu.length ? `<ul class="kt-ul">${lampu.map((x) => `<li>${x.st === "online" ? "🟢" : "⚫"} ${e(x.n)}</li>`).join("")}</ul>` : ""}
    ${KT.pemilik ? `<button class="kt-salin" onclick="ksDzikirPagi()">📿 Dzikir Pagi & Tilawah Sekarang</button>` : ""}</div>`);
}

// ── pemasangan ──
function _kjPasang() {
  KJ.cincin = []; KJ.lampu = {};
  try { KJ.dzikirHari = localStorage.getItem("kt:dzikir") || ""; } catch (e) {}
  const kid = (KT.peran.kepala || [])[0];
  (KT.staf || []).forEach((s) => {
    const t = KT.tokoh[s.id]; const jn = _kjJenis(s);
    if (t && jn) { _kjDandani(t, jn); _kjLabel(s.id, jn); }
    const k = t && t.userData.meja; if (!t || !k || (jn && jn.j === "yayasan")) return;
    _kjLampu(s.id, k);
    if (!jn) return;
    if (jn.j === "kepala" && s.id === kid) { _kjBendera(k); _kjPapanNama(k, "KEPALA PKBM"); }
    else if (jn.j === "peny") { _kjMap(k, KJ_RG[jn.r] || 0x1d4ed8); _kjPapanNama(k, "PENYELENGGARA", KJ_RG_CSS[jn.r] || "#1d4ed8"); }
    else if (jn.j === "admin") _kjLayarKedua(k);
  });
  _kjBangunPapan();
  const atas = document.querySelector("#kantor-ai .kt-alat");
  if (atas && !document.getElementById("kj-tombol")) atas.insertAdjacentHTML("afterbegin", `<button id="kj-tombol" onclick="ktHariIni()" title="Ujian, agenda & lampu meja hari ini">📋<span class="kt-sembunyi-hp"> Hari Ini</span></button>`);
  _kjMuatHariIni().then(_kjGambarPapan); _kjPerbaruiLampu();
  clearInterval(KJ.iv); let n = 0;
  KJ.iv = setInterval(() => { if (!KT.buka) { clearInterval(KJ.iv); return; } n++; _kjCekDzikir(); _kjPerbaruiLampu(); if (n % 10 === 0) _kjMuatHariIni().then(_kjGambarPapan); }, 30000);
  setTimeout(_kjCekDzikir, 8000);
}
(function () {
  if (typeof _ktBangun === "function") {
    const a = _ktBangun;
    _ktBangun = async function () { await a.apply(this, arguments); try { _kjPasang(); } catch (e) { console.warn("Tampilan jabatan:", e); } };
  }
  if (typeof _ktJalan === "function") {
    const a = _ktJalan;
    _ktJalan = function () { const r = a.apply(this, arguments); const o = 0.38 + Math.sin(performance.now() / 650) * 0.18; KJ.cincin.forEach((c) => (c.material.opacity = o)); return r; };
  }
  if (typeof ktTutup === "function") { const a = ktTutup; ktTutup = function () { clearInterval(KJ.iv); KJ.dzikir = false; return a.apply(this, arguments); }; }
  if (typeof KT_RAPAT_KEPALA !== "undefined" && !KT_RAPAT_KEPALA.some((x) => x[2] === "__dzikir")) KT_RAPAT_KEPALA.splice(3, 0, ["📿", "Dzikir Pagi & Tilawah Bersama", "__dzikir"]);
  if (typeof ktPerintah === "function") { const a = ktPerintah; ktPerintah = function (teks) { if (teks === "__dzikir") return ksDzikirPagi(); return a.apply(this, arguments); }; }
  if (typeof ksPanel === "function") { const a = ksPanel; ksPanel = function () { a.apply(this, arguments); const w = document.querySelector("#kt-panel .km-info"); const tb = w && [...w.querySelectorAll(".kt-salin")].find((b) => /Sholat Berjamaah/.test(b.textContent)); if (tb) tb.insertAdjacentHTML("afterend", `<button class="kt-salin" onclick="ksDzikirPagi()">📿 Dzikir Pagi & Tilawah Sekarang</button><p class="kt-ket">Dzikir pagi otomatis tiap hari pukul 07.00 (Senin–Sabtu) saat Kantor dibuka.</p>`); }; }
})();

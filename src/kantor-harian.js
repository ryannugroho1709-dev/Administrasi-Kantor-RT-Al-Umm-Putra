// ============================================================
//  KANTOR MAYA — Laporan Harian · Cuaca Nyata Barabai · Papan Nama bisa disembunyikan
//  • 📊 Laporan Harian: 15 menit sebelum jam pulang Kepala PKBM, ringkasan hari ini otomatis masuk
//    (absen & jurnal tutor per jenjang, tutor yang belum absen, ujian, tiket IT, yang masuk aplikasi). Bisa dibuka kapan saja.
//  • 🌦️ Cuaca nyata Barabai (Open-Meteo, tanpa kunci): hujan turun di kantor, yang berjalan di luar memakai payung.
//  • 🏷️ Papan nama: tombol sembunyikan/tampilkan; saat rapat otomatis disembunyikan, selesai rapat kembali.
// ============================================================
const KHR = { iv: null, cuaca: null, tCuaca: 0, hujan: false, tetes: null, payung: [], tPayung: 0, lapHari: "", label: true, labelRapat: null, rapatLalu: false };
const KHR_LOKASI = { lat: -2.585, lon: 115.383 }; // Barabai, Hulu Sungai Tengah
const _khrLS = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };

// ── 🏷️ papan nama ──
function _khrTerapkanLabel() {
  const el = document.getElementById("kantor-ai"); if (el) el.classList.toggle("kt-tanpa-label", !KHR.label);
  const b = document.getElementById("khr-label"); if (b) { b.classList.toggle("mati", !KHR.label); b.title = KHR.label ? "Sembunyikan papan nama" : "Tampilkan papan nama"; }
}
function ktTogelLabel() { KHR.label = !KHR.label; if (KT.sesi && KT.sesi.aktif) KHR.labelRapat = KHR.label; else _khrLS.set("kt:label", KHR.label ? "1" : "0"); _khrTerapkanLabel(); toast(KHR.label ? "Papan nama ditampilkan" : "Papan nama disembunyikan", "info"); }
function _khrCekRapat() {
  const aktif = !!(KT.sesi && KT.sesi.aktif);
  if (aktif && !KHR.rapatLalu) { KHR.labelRapat = false; KHR.label = false; _khrTerapkanLabel(); }
  if (!aktif && KHR.rapatLalu) { KHR.label = _khrLS.get("kt:label") !== "0"; _khrTerapkanLabel(); }
  KHR.rapatLalu = aktif;
}

// ── 📊 laporan harian ──
const KHR_JENJANG = { A: "Paket A", Pa: "Paket B & C Putra", Pi: "Paket B & C Putri", Pg: "Pengelola" };
async function _khrKumpulkan() {
  const hari = tanggalISO(), db = typeof supaSemua !== "undefined" ? supaSemua : supa, h = { per: {}, belum: [], ujian: [], tiket: { baru: 0, proses: 0, selesaiHariIni: 0 }, masuk: 0, total: 0, hadir: 0, jurnal: 0 };
  const guru = KT.guru || [], ruangOf = (id) => { const g = guru.find((x) => x.id === id); return (g && (g.ruang_utama || (g.ruang || [])[0])) || "Pg"; }, namaOf = (id) => { const g = guru.find((x) => x.id === id); return g ? g.nama : "?"; };
  try {
    const r = await db.from("absensi_sesi").select("id,guru_id,jam_masuk,status_kehadiran,dihapus").eq("tanggal", hari);
    const sesi = (r.data || []).filter((x) => !x.dihapus), ids = sesi.map((x) => x.id), adaJurnal = new Set();
    for (let i = 0; i < ids.length; i += 80) { const j = await db.from("jurnal_kelas").select("sesi_id").in("sesi_id", ids.slice(i, i + 80)); (j.data || []).forEach((x) => adaJurnal.add(x.sesi_id)); }
    const belumPer = {};
    sesi.forEach((s) => {
      const rg = ruangOf(s.guru_id), p = (h.per[rg] = h.per[rg] || { total: 0, hadir: 0, jurnal: 0 }), hadir = !!(s.jam_masuk || /hadir|tepat|telat|terlambat/i.test(s.status_kehadiran || ""));
      p.total++; h.total++; if (hadir) { p.hadir++; h.hadir++; } else belumPer[s.guru_id] = (belumPer[s.guru_id] || 0) + 1;
      if (adaJurnal.has(s.id)) { p.jurnal++; h.jurnal++; }
    });
    h.belum = Object.entries(belumPer).map(([id, n]) => ({ nama: namaOf(id), n, rg: ruangOf(id) })).sort((a, b) => b.n - a.n);
  } catch (e) { h.galat = "Data absen tidak terbaca"; }
  try { if (typeof _kjMuatHariIni === "function") h.ujian = (await _kjMuatHariIni()).ujian || []; } catch (e) {}
  Object.values(KT.tiket || {}).forEach((t) => { if (!t) return; if (t.status === "baru") h.tiket.baru++; else if (t.status === "dikerjakan") h.tiket.proses++; else if (t.status === "selesai" && t.diubah && new Date(t.diubah).toDateString() === new Date().toDateString()) h.tiket.selesaiHariIni++; });
  try { if (typeof _ksMuatHadir === "function") h.masuk = (await _ksMuatHadir()).size; } catch (e) {}
  return h;
}
async function ktLaporanHarian(otomatis) {
  const h = await _khrKumpulkan(), e = typeof _ktE === "function" ? _ktE : (s) => String(s);
  const persen = (a, b) => (b ? Math.round((a / b) * 100) + "%" : "–");
  const baris = ["A", "Pa", "Pi", "Pg"].filter((k) => h.per[k]).map((k) => { const p = h.per[k]; return `<tr><td>${KHR_JENJANG[k]}</td><td>${p.hadir}/${p.total}</td><td>${p.jurnal}/${p.total}</td><td><b>${persen(p.hadir, p.total)}</b></td></tr>`; }).join("");
  const pw = new Set(); (h.ujian || []).forEach((u) => u.isi.forEach((z) => z.p.forEach((n) => pw.add(n))));
  _ktPanel(`<div class="km-info"><small>RINGKASAN UNTUK KEPALA PKBM</small><h3>📊 Laporan Harian</h3><p class="kt-ket">${e(new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" }))}${otomatis ? " · masuk otomatis sebelum jam pulang" : ""}</p>
    <div class="khr-angka"><span><b>${h.hadir}/${h.total}</b><small>Sesi Mengajar Diabsen</small></span><span><b>${h.jurnal}</b><small>Jurnal Terisi</small></span><span><b>${h.masuk}</b><small>Masuk Aplikasi</small></span><span><b>${h.tiket.baru + h.tiket.proses}</b><small>Tiket IT Terbuka</small></span></div>
    <h4>👳 Absen & Jurnal Tutor per Jenjang</h4>${h.galat ? `<p class="kt-ket">${e(h.galat)}</p>` : baris ? `<table class="khr-tabel"><tr><th>Jenjang</th><th>Absen</th><th>Jurnal</th><th>Hadir</th></tr>${baris}</table>` : `<p class="kt-ket">Tidak ada sesi mengajar hari ini.</p>`}
    ${h.belum.length ? `<h4>⏳ Belum Absen Mengajar</h4><ul class="kt-ul">${h.belum.slice(0, 12).map((x) => `<li>${e(x.nama)} <small>(${x.n} sesi · ${KHR_JENJANG[x.rg] || x.rg})</small></li>`).join("")}</ul>${h.belum.length > 12 ? `<p class="kt-ket">+${h.belum.length - 12} lainnya</p>` : ""}` : ""}
    <h4>📝 Ujian Hari Ini</h4>${h.ujian.length ? `<p class="kt-ket">${h.ujian.length} sesi ujian · ${pw.size} pengawas bertugas · ${e(h.ujian[0].judul)}</p>` : `<p class="kt-ket">Tidak ada ujian.</p>`}
    <h4>🎫 Tiket Tim IT</h4><p class="kt-ket">${h.tiket.baru} baru · ${h.tiket.proses} sedang dikerjakan${h.tiket.selesaiHariIni ? ` · ${h.tiket.selesaiHariIni} selesai hari ini` : ""}</p></div>`);
  return h;
}
function _khrCekLaporan() {
  if (!KT.buka || !KT.pemilik || typeof KHD === "undefined") return;
  const k = new Date(), hari = k.toDateString(); if (k.getDay() === 0 || KHR.lapHari === hari) return;
  const m = k.getHours() * 60 + k.getMinutes(), pulang = _khMnt(KHD.jam.kepala.p);
  if (m < pulang - 15 || m > pulang + 60) return;
  KHR.lapHari = hari; _khrLS.set("kt:lapHarian", hari);
  const kid = (KT.peran.kepala || [])[0];
  if (kid && KT.tokoh[kid] && KT.tokoh[kid].visible) _ktBicara(kid, "Laporan harian sudah masuk. Ana periksa dulu sebelum pulang.", 3000);
  ktLaporanHarian(true).then(() => toast("📊 Laporan harian siap" + (window.innerWidth <= 900 ? " — ketuk Lihat Pesan" : ""), "ok"));
}

// ── 🌦️ cuaca nyata Barabai ──
const KHR_KODE = (c) => (c === 0 ? ["☀️", "Cerah"] : c <= 2 ? ["🌤️", "Cerah berawan"] : c === 3 ? ["☁️", "Berawan"] : c <= 48 ? ["🌫️", "Berkabut"] : c <= 57 ? ["🌦️", "Gerimis"] : c <= 67 ? ["🌧️", "Hujan"] : c <= 77 ? ["🌨️", "Hujan es"] : c <= 82 ? ["🌧️", "Hujan lebat"] : ["⛈️", "Hujan petir"]);
const _khrKodeHujan = (c) => (c >= 51 && c <= 67) || (c >= 80 && c <= 99);
async function _khrMuatCuaca() {
  const mode = _khrLS.get("kt:cuaca") || "otomatis";
  if (mode === "otomatis" && Date.now() - KHR.tCuaca > 15 * 60000) {
    KHR.tCuaca = Date.now();
    try {
      const r = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${KHR_LOKASI.lat}&longitude=${KHR_LOKASI.lon}&current=temperature_2m,weather_code,precipitation&timezone=Asia%2FMakassar`);
      const j = await r.json(); if (j && j.current) KHR.cuaca = { suhu: Math.round(j.current.temperature_2m), kode: j.current.weather_code, hujan: (j.current.precipitation || 0) > 0 };
    } catch (e) {}
  }
  const hujan = mode === "hujan" ? true : mode === "cerah" ? false : !!(KHR.cuaca && (KHR.cuaca.hujan || _khrKodeHujan(KHR.cuaca.kode)));
  _khrSetHujan(hujan); _khrTombolCuaca();
}
function _khrTombolCuaca() {
  const b = document.getElementById("khr-cuaca"); if (!b) return; const mode = _khrLS.get("kt:cuaca") || "otomatis";
  const [ik] = KHR.hujan ? ["🌧️"] : KHR.cuaca ? KHR_KODE(KHR.cuaca.kode) : ["🌤️"];
  b.innerHTML = `${ik}<span>${KHR.cuaca && mode === "otomatis" ? ` ${KHR.cuaca.suhu}°` : ""}</span>`;
}
function ktCuaca() {
  const mode = _khrLS.get("kt:cuaca") || "otomatis", c = KHR.cuaca, [ik, nm] = c ? KHR_KODE(c.kode) : ["🌤️", "Belum terbaca"];
  _ktPanel(`<div class="km-info"><small>CUACA NYATA</small><h3>${ik} Cuaca Barabai</h3>
    <p class="kt-ket">${c ? `${_khrE(nm)} · ${c.suhu}°C` : "Data cuaca belum terbaca (periksa internet)."}<br>Sumber: Open-Meteo, diperbarui tiap 15 menit.</p>
    <h4>Tampilan Cuaca di Kantor</h4><div class="kt-tab">${[["otomatis", "Otomatis"], ["cerah", "Selalu Cerah"], ["hujan", "Hujan"]].map(([k, l]) => `<button class="${mode === k ? "on" : ""}" onclick="ktAturCuaca('${k}')">${l}</button>`).join("")}</div>
    <p class="kt-ket">Saat hujan, rintik hujan turun di kantor dan yang berjalan di luar (guru, petugas, santri) memakai payung.</p></div>`);
}
const _khrE = (s) => (typeof _ktE === "function" ? _ktE(s) : String(s));
function ktAturCuaca(m) { _khrLS.set("kt:cuaca", m); KHR.tCuaca = 0; _khrMuatCuaca().then(ktCuaca); }
function _khrBuatHujan() {
  const n = 1400, pos = new Float32Array(n * 6);
  for (let i = 0; i < n; i++) { const x = Math.random() * 64 - 32, y = Math.random() * 16, z = Math.random() * 34 - 14; pos.set([x, y, z, x - 0.04, y - 0.45, z + 0.02], i * 6); }
  const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const m = new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: 0xbfd4ea, transparent: true, opacity: 0.55, depthWrite: false }));
  m.frustumCulled = false; m.visible = false; KT.scene.add(m); KHR.tetes = m;
}
function _khrSetHujan(on) {
  KHR.hujan = !!on; if (KHR.tetes) KHR.tetes.visible = KHR.hujan;
  const el = document.getElementById("kantor-ai"); if (el) el.classList.toggle("kt-hujan", KHR.hujan);
}
function _khrGerakHujan(dt) {
  const m = KHR.tetes; if (!m || !m.visible) return; const p = m.geometry.attributes.position.array, v = 14 * dt;
  for (let i = 0; i < p.length; i += 6) { p[i + 1] -= v; p[i + 4] -= v; if (p[i + 4] < 0) { const y = 14 + Math.random() * 2; p[i + 1] = y; p[i + 4] = y - 0.45; } }
  m.geometry.attributes.position.needsUpdate = true;
}
function _khrPayung(t) {
  if (t.userData.payung) return t.userData.payung;
  const g = new THREE.Group(), w = [0x1d4ed8, 0x15803d, 0x7c3aed, 0xb91c1c, 0x0f766e][Math.floor(Math.random() * 5)];
  const atap = new THREE.Mesh(new THREE.ConeGeometry(0.62, 0.3, 10, 1, true), new THREE.MeshStandardMaterial({ color: w, roughness: 0.6, side: THREE.DoubleSide })); atap.position.y = 2.0; g.add(atap);
  const tg = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.95, 6), new THREE.MeshStandardMaterial({ color: 0x374151 })); tg.position.y = 1.5; g.add(tg);
  g.position.set(0.12, 0, 0.05); g.visible = false; t.add(g); t.userData.payung = g; return g;
}
function _khrPerbaruiPayung() {
  const daftar = [...Object.values(KT.tokoh || {}), ...((typeof KHD !== "undefined" && KHD.santri) || [])];
  daftar.forEach((t) => { if (!t || !t.visible) return; const luar = t.userData.santri || t.position.z > 8.5; if (KHR.hujan && luar) _khrPayung(t).visible = true; else if (t.userData.payung) t.userData.payung.visible = false; });
}

// ── pemasangan ──
(function () {
  if (typeof _ktBangun === "function") {
    const a = _ktBangun;
    _ktBangun = async function () {
      await a.apply(this, arguments);
      try {
        KHR.label = _khrLS.get("kt:label") !== "0"; KHR.rapatLalu = false; KHR.lapHari = _khrLS.get("kt:lapHarian") || "";
        _khrBuatHujan();
        const atas = document.querySelector("#kantor-ai .kt-alat");
        if (atas && !document.getElementById("khr-label")) atas.insertAdjacentHTML("afterbegin", `<button id="khr-label" onclick="ktTogelLabel()" title="Sembunyikan papan nama">🏷️<span class="kt-sembunyi-hp"> Nama</span></button><button id="khr-cuaca" onclick="ktCuaca()" title="Cuaca nyata Barabai">🌤️</button>${KT.pemilik ? `<button id="khr-lap" onclick="ktLaporanHarian()" title="Laporan harian untuk Kepala PKBM">📊<span class="kt-sembunyi-hp"> Laporan</span></button>` : ""}`);
        _khrTerapkanLabel(); _khrMuatCuaca();
        clearInterval(KHR.iv); let n = 0;
        KHR.iv = setInterval(() => { if (!KT.buka) return clearInterval(KHR.iv); n++; _khrCekRapat(); if (n % 30 === 0) { _khrCekLaporan(); _khrMuatCuaca(); } }, 1000);
        setTimeout(_khrCekLaporan, 9000);
      } catch (e) { console.warn("Laporan/cuaca kantor:", e); }
    };
  }
  if (typeof _ktJalan === "function") {
    const a = _ktJalan; let akhir = performance.now();
    _ktJalan = function () {
      const r = a.apply(this, arguments), k = performance.now(), dt = Math.min(0.1, (k - akhir) / 1000); akhir = k;
      try { if (KT.buka) { _khrGerakHujan(dt); if (k - KHR.tPayung > 400) { KHR.tPayung = k; _khrPerbaruiPayung(); } } } catch (e) {}
      return r;
    };
  }
  if (typeof ktTutup === "function") { const a = ktTutup; ktTutup = function () { clearInterval(KHR.iv); KHR.tetes = null; return a.apply(this, arguments); }; }
})();

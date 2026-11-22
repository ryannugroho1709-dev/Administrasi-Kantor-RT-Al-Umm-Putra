// ============================================================
//  🗺️ BERBURU PETI — game untuk soal URAIAN (gaya peta piksel)
//  • Semua soal uraian jadi PETI berwarna-warni yang tersebar di peta (rumput, pohon, kolam, pagar).
//  • Tokoh santri berjalan (tombol arah / geser layar / ketuk tujuan → jalan otomatis) mencari peti.
//  • Buka peti → soal muncul + kotak jawaban. Boleh ditinggal untuk mencari peti lain yang lebih mudah;
//    tulisan TETAP TERSIMPAN dan bisa diubah lagi saat kembali ke peti itu.
//  • Hati-hati JEBAKAN tersembunyi (lubang): tokoh terperosok sebentar lalu kembali — tidak mengurangi nilai.
//  • Semua gambar (tokoh, peti, pohon, jebakan) digambar langsung dengan kode bergaya piksel → ringan di HP.
// ============================================================
G2_NAMA.uraian.peti = ["🗺️", "Berburu Peti"];
const G4_PETI_WARNA = [["#ef4444", "#991b1b"], ["#3b82f6", "#1e3a8a"], ["#22c55e", "#14532d"], ["#a855f7", "#581c87"], ["#f59e0b", "#92400e"], ["#ec4899", "#831843"], ["#06b6d4", "#155e75"], ["#84cc16", "#3f6212"], ["#f97316", "#7c2d12"], ["#6366f1", "#312e81"]];
const G4 = {}; // keadaan per sesi: { pos, jebakanTerlihat:Set, buka:noSoal|null }

// Peti boleh dibuka walau game kelas sudah mengunci (tampil hanya-baca)
(function () {
  const asli = window.g2Untuk;
  window.g2Untuk = function (s) {
    if (s && s.jenis === "uraian" && !s.rek && !G2.mati.has(s.jenis + "-" + s.no) && g2Per().uraian === "peti") return "peti";
    return asli.apply(this, arguments);
  };
})();

function g4Peta(benih, n) {
  const acak = g2Acak(benih), W = 26, H = 18;
  // 0 rumput, 1 pohon, 2 air, 3 pagar, 4 tanah, 5 bunga
  const g = Array.from({ length: H }, (_, y) => Array.from({ length: W }, (_, x) => (x === 0 || y === 0 || x === W - 1 || y === H - 1 ? 1 : 0)));
  for (let x = 1; x < W - 1; x++) g[8][x] = 4; for (let y = 1; y < H - 1; y++) g[y][12] = 4;          // jalan tanah bersilang
  for (let y = 2; y < 6; y++) for (let x = 17; x < 23; x++) if (!((y === 2 || y === 5) && (x === 17 || x === 22))) g[y][x] = 2; // kolam
  for (let x = 3; x < 10; x++) { g[11][x] = 3; g[16][x] = 3; } for (let y = 11; y < 17; y++) { g[y][3] = 3; g[y][9] = 3; } g[11][6] = 4; // kandang berpagar + pintu
  for (let y = 12; y < 16; y++) for (let x = 4; x < 9; x++) g[y][x] = 4;
  for (let i = 0; i < 34; i++) { const x = 1 + Math.floor(acak() * (W - 2)), y = 1 + Math.floor(acak() * (H - 2)); if (g[y][x] === 0 && Math.abs(x - 12) > 1 && Math.abs(y - 8) > 1) g[y][x] = acak() < 0.7 ? 1 : 5; }
  const mulai = [12, 8];
  const bisa = (x, y) => g[y] && (g[y][x] === 0 || g[y][x] === 4 || g[y][x] === 5);
  // peti: tempat yang bisa dicapai & saling berjauhan
  const jar = (() => { const d = Array.from({ length: H }, () => Array(W).fill(-1)), q = [mulai]; d[mulai[1]][mulai[0]] = 0; for (let i = 0; i < q.length; i++) { const [x, y] = q[i]; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + dx, ny = y + dy; if (bisa(nx, ny) && d[ny][nx] < 0) { d[ny][nx] = d[y][x] + 1; q.push([nx, ny]); } } } return d; })();
  const kandidat = []; for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) if (jar[y][x] >= 4 && g[y][x] !== 4) kandidat.push([x, y]);
  const peti = [];
  while (peti.length < n && kandidat.length) {
    let pilih = 0, skor = -1;
    kandidat.forEach((c, i) => { const m = peti.length ? Math.min(...peti.map((p) => Math.abs(p[0] - c[0]) + Math.abs(p[1] - c[1]))) : 50; const sk = m * 4 + acak() * 6; if (sk > skor) { skor = sk; pilih = i; } });
    peti.push(kandidat.splice(pilih, 1)[0]);
  }
  // jebakan lubang tersembunyi di rumput (tidak di peti / jalan tanah / dekat titik mulai)
  const jebakan = []; let coba = 0;
  while (jebakan.length < 7 && coba++ < 400) {
    const x = 1 + Math.floor(acak() * (W - 2)), y = 1 + Math.floor(acak() * (H - 2));
    if (g[y][x] !== 0 || jar[y][x] < 3 || peti.some((p) => Math.abs(p[0] - x) + Math.abs(p[1] - y) < 2) || jebakan.some((j) => j[0] === x && j[1] === y)) continue;
    jebakan.push([x, y]);
  }
  return { g, W, H, mulai, peti, jebakan, bisa, acak };
}

// ── Gambar piksel (semua digambar di atas kotak 16×16 lalu diperbesar) ──
function g4Kotak(ctx, T, x, y, peta) { // peta: ["....", ...] dengan huruf warna
  const p = T / 16;
  peta.rows.forEach((baris, j) => [...baris].forEach((c, i) => { const w = peta.w[c]; if (!w) return; ctx.fillStyle = w; ctx.fillRect(Math.floor(x + i * p), Math.floor(y + j * p), Math.ceil(p), Math.ceil(p)); }));
}
function g4Tokoh(baju, rambut, kulit) {
  const umum = { k: kulit, r: rambut, b: baju, c: "#1e293b", h: "#111827", s: "#7c2d12" };
  const depan = ["................", ".....rrrrrr.....", "....rrrrrrrr....", "....rkkkkkkr....", "....kkhkkhkk....", "....kkkkkkkk....", ".....kkkkkk.....", "....bbbbbbbb....", "...kbbbbbbbbk...", "...kbbbbbbbbk...", "....bbbbbbbb....", "....cccccccc....", "....cc....cc....", "....cc....cc....", "....ss....ss....", "................"];
  const jalan = depan.slice(0, 12).concat(["....cc...cc.....", "...cc.....cc....", "...ss.....ss....", "................"]);
  const belakang = depan.map((b, j) => (j >= 3 && j <= 5 ? b.replace(/k/g, "r").replace(/h/g, "r") : b));
  return { depan: { rows: depan, w: umum }, jalan: { rows: jalan, w: umum }, belakang: { rows: belakang, w: umum } };
}
const G4_POHON = { rows: ["................", ".....gggggg.....", "...ggGGggggg....", "..gGGgggggGgg...", "..gggggGgggggg..", ".gggGgggggggGgg.", ".ggggggggGgggggg", ".gGgggggggggGgg.", "..gggggGgggggg..", "...ggggggggg....", ".....dtttd......", "......ttt.......", "......ttt.......", "......ttt.......", ".....ddddd......", "................"], w: { g: "#15803d", G: "#22c55e", t: "#78350f", d: "rgba(0,0,0,.18)" } };
function g4Peti(warna, gelap, terbuka) {
  const w = { a: warna, d: gelap, k: "#facc15", o: "#1f2937", i: "#422006", s: "rgba(0,0,0,.2)" };
  return terbuka
    ? { rows: ["................", "..oooooooooooo..", "..oaaaaaaaaaao..", "..oaaaaaaaaaao..", "..oddddddddddo..", "..oiiiiiiiiiio..", "..oiiiiiiiiiio..", "..oooooooooooo..", "..oaaaaaaaaaao..", "..oaaaaaaaaaao..", "..oddddddddddo..", "..oaaaaaaaaaao..", "..oaaaaaaaaaao..", "..oooooooooooo..", "...ssssssssss...", "................"], w }
    : { rows: ["................", "................", "................", "...oooooooooo...", "..oaaaaaaaaaao..", "..oaaaaaaaaaao..", "..oddddddddddo..", "..oooookkoooooo.", "..oaaaakkaaaao..", "..oaaaakkaaaao..", "..oddddddddddo..", "..oaaaaaaaaaao..", "..oaaaaaaaaaao..", "..oooooooooooo..", "...ssssssssss...", "................"], w };
}

const G2_MAIN_PETI = function (isi, s) {
  const kartu = isi.closest(".kartu-soal"); kartu.classList.add("g4-mode");
  kartu.querySelector("textarea#uraian")?.remove(); // kotak tulis pindah ke dalam peti
  const uraian = S.soal.map((x, i) => ({ s: x, i })).filter((x) => x.s.jenis === "uraian" && !x.s.rek);
  const sesiKey = (S.sesi && S.sesi.id) + ":" + ((S.murid && S.murid.id) || "");
  const st = (G4[sesiKey] = G4[sesiKey] || { jebakanTerlihat: new Set(), buka: null });
  const peta = g4Peta(sesiKey + ":peti", uraian.length), { g, W, H, peti, jebakan, bisa } = peta;
  const tokoh = g4Tokoh(["#2563eb", "#dc2626", "#16a34a", "#9333ea", "#ea580c", "#0891b2"][Math.abs([...sesiKey].reduce((a, c) => a + c.charCodeAt(0), 0)) % 6], "#3f2a14", "#f1c27d");
  const nama = String((S.murid && S.murid.nama) || "Kamu").split(/\s+/)[0];
  isi.innerHTML = `<div class="g4-hud"><span id="g4-skor"></span><span class="ket">Cari peti, buka, jawab. Boleh pindah peti kapan saja.</span></div>
    <div class="g4-layar"><canvas id="g4-cv"></canvas><div class="g4-pesan" id="g4-pesan"></div></div>
    <div class="g2-dpad g4-dpad"><button data-d="0,-1">▲</button><button data-d="-1,0">◀</button><button data-d="1,0">▶</button><button data-d="0,1">▼</button></div>
    <p class="g2-tip">Ketuk peti di peta → tokohmu berjalan sendiri ke sana. Atau pakai tombol arah / geser layar. Waspada lubang jebakan tersembunyi! 🕳️</p>`;
  const cv = isi.querySelector("#g4-cv"), ctx = cv.getContext("2d");
  const VW = 13, VH = 10;
  let T = 24, dpr = 1;
  const latar = document.createElement("canvas");
  function ukur() {
    T = Math.max(18, Math.floor(Math.min(isi.clientWidth, 560) / VW)); dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = VW * T * dpr; cv.height = VH * T * dpr; cv.style.width = VW * T + "px"; cv.style.height = VH * T + "px";
    // peta lengkap digambar sekali (rumput berbintik, tanah, air, pagar, pohon, bunga)
    latar.width = W * T * dpr; latar.height = H * T * dpr;
    const l = latar.getContext("2d"); l.setTransform(dpr, 0, 0, dpr, 0, 0); l.imageSmoothingEnabled = false;
    const a = g2Acak("rumput");
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const v = g[y][x], X = x * T, Y = y * T;
      l.fillStyle = v === 4 ? "#d6b47a" : v === 2 ? "#3b82f6" : (x + y) % 2 ? "#7cc957" : "#76c24f"; l.fillRect(X, Y, T, T);
      if (v === 0 || v === 5 || v === 1 || v === 3) for (let k = 0; k < 3; k++) { l.fillStyle = "rgba(21,128,61,.35)"; l.fillRect(X + Math.floor(a() * (T - 3)), Y + Math.floor(a() * (T - 3)), Math.max(2, T / 10), Math.max(2, T / 10)); }
      if (v === 4) { l.fillStyle = "rgba(120,53,15,.18)"; l.fillRect(X + Math.floor(a() * (T - 3)), Y + Math.floor(a() * (T - 3)), Math.max(2, T / 9), Math.max(2, T / 9)); }
      if (v === 2) { l.fillStyle = "rgba(255,255,255,.35)"; l.fillRect(X + T * 0.2, Y + T * 0.3, T * 0.35, Math.max(2, T / 12)); const tepi = (dx, dy) => g[y + dy] && g[y + dy][x + dx] !== 2; l.fillStyle = "#93c5fd"; if (tepi(0, -1)) l.fillRect(X, Y, T, T * 0.12); if (tepi(-1, 0)) l.fillRect(X, Y, T * 0.12, T); }
      if (v === 5) { const w = ["#f472b6", "#facc15", "#fff", "#c084fc"][(x * 7 + y) % 4]; l.fillStyle = w; l.fillRect(X + T * 0.3, Y + T * 0.4, T / 7, T / 7); l.fillRect(X + T * 0.6, Y + T * 0.6, T / 7, T / 7); }
      if (v === 3) { l.fillStyle = "#92400e"; l.fillRect(X, Y + T * 0.35, T, T * 0.12); l.fillRect(X, Y + T * 0.6, T, T * 0.12); l.fillRect(X + T * 0.42, Y + T * 0.15, T * 0.16, T * 0.75); }
    }
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (g[y][x] === 1) g4Kotak(l, T, x * T, y * T, G4_POHON);
  }
  ukur();
  // keadaan tokoh (tersimpan per sesi → posisi tetap saat pindah soal)
  const P = st.P || (st.P = { x: peta.mulai[0], y: peta.mulai[1], tx: peta.mulai[0], ty: peta.mulai[1], dir: [0, 0], mau: [0, 0], hadap: "depan", balik: 1, jalur: [], cepat: 4.6, diam: 0 });
  Object.assign(P, { tx: Math.round(P.x), ty: Math.round(P.y), x: Math.round(P.x), y: Math.round(P.y), dir: [0, 0], mau: [0, 0], jalur: [] });
  const kam = { x: P.x - VW / 2 + 0.5, y: P.y - VH / 2 + 0.5 };
  let lalu = performance.now(), terakhirPeti = null, jatuh = 0, langkahT = 0;
  // berdiri di atas peti saat digambar ulang → jangan langsung terbuka lagi
  terakhirPeti = peti.findIndex((p) => p[0] === P.x && p[1] === P.y); if (terakhirPeti < 0) terakhirPeti = null;
  const lantai = (x, y) => bisa(x, y) || peti.some((p) => p[0] === x && p[1] === y);
  const dijawab = (k) => String(S.jawab.uraian[uraian[k].s.no] || "").trim() !== "";
  const terkunci = (k) => typeof g3Terkunci === "function" && g3Terkunci(uraian[k].s);
  function skor() { const n = uraian.filter((_, k) => dijawab(k)).length; const el = isi.querySelector("#g4-skor"); if (el) el.innerHTML = `🗝️ <b>${n}</b>/${uraian.length} peti terjawab`; }
  function pesan(t, ms) { const el = isi.querySelector("#g4-pesan"); if (!el) return; el.innerHTML = t; el.classList.add("on"); clearTimeout(pesan.t); pesan.t = setTimeout(() => el.classList.remove("on"), ms || 1400); }
  // jalan otomatis (ketuk tujuan): cari jalur terpendek di petak yang bisa dilewati
  function cariJalur(tx, ty) {
    const asal = [Math.round(P.x), Math.round(P.y)], kunci = (x, y) => x + "," + y, dari = { [kunci(...asal)]: null }, q = [asal];
    for (let i = 0; i < q.length; i++) { const [x, y] = q[i]; if (x === tx && y === ty) break; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + dx, ny = y + dy; if (lantai(nx, ny) && !(kunci(nx, ny) in dari)) { dari[kunci(nx, ny)] = [x, y]; q.push([nx, ny]); } } }
    if (!(kunci(tx, ty) in dari)) return [];
    const j = []; let c = [tx, ty]; while (c && !(c[0] === asal[0] && c[1] === asal[1])) { j.unshift(c); c = dari[kunci(...c)]; }
    return j;
  }
  function langkah(dt) {
    if (jatuh > 0) { jatuh -= dt; return; }
    let sisa = P.cepat * dt;
    while (sisa > 0) {
      const dx = P.tx - P.x, dy = P.ty - P.y, jauh = Math.abs(dx) + Math.abs(dy);
      if (jauh < 1e-6) {
        P.x = P.tx; P.y = P.ty;
        if (tiba()) return;
        let [mx, my] = P.mau;
        if (P.jalur.length) { const [nx, ny] = P.jalur.shift(); mx = nx - P.x; my = ny - P.y; }
        if ((mx || my) && lantai(P.x + mx, P.y + my)) P.dir = [mx, my];
        else if (!(P.dir[0] || P.dir[1]) || !lantai(P.x + P.dir[0], P.y + P.dir[1]) || P.jalur.length === 0 && !(P.mau[0] || P.mau[1])) { P.dir = [0, 0]; return; }
        P.tx = P.x + P.dir[0]; P.ty = P.y + P.dir[1];
        P.hadap = P.dir[1] < 0 ? "belakang" : "depan"; if (P.dir[0]) P.balik = P.dir[0];
        continue;
      }
      const gerak = Math.min(sisa, jauh); P.x += Math.sign(dx) * gerak; P.y += Math.sign(dy) * gerak; sisa -= gerak; langkahT += gerak;
    }
  }
  // tiba di petak: jebakan? peti?
  function tiba() {
    const j = jebakan.findIndex((p) => p[0] === P.x && p[1] === P.y);
    if (j >= 0) {
      st.jebakanTerlihat.add(j); jatuh = 1.3; P.jalur = []; P.mau = [0, 0];
      const balik = [P.x - P.dir[0], P.y - P.dir[1]]; P.dir = [0, 0];
      setTimeout(() => { P.x = P.tx = balik[0]; P.y = P.ty = balik[1]; }, 1100);
      cv.classList.remove("goyang"); void cv.offsetWidth; cv.classList.add("goyang");
      pesan("🕳️ Aduh! Terperosok lubang jebakan!", 1500); try { navigator.vibrate && navigator.vibrate(120); } catch (e) {}
      return true;
    }
    const k = peti.findIndex((p) => p[0] === P.x && p[1] === P.y);
    if (k < 0) { terakhirPeti = null; return false; }
    if (terakhirPeti === k) return false;
    terakhirPeti = k; P.jalur = []; P.mau = [0, 0]; P.dir = [0, 0];
    bukaPeti(k); return true;
  }
  function bukaPeti(k) {
    const { s: sx, i } = uraian[k], [w1] = G4_PETI_WARNA[k % G4_PETI_WARNA.length];
    st.buka = sx.no; S.idx = i;
    document.getElementById("g4-panel")?.remove();
    const kunci = terkunci(k), stim = sx.stimulus || sx.stimulusBagian, stimTeks = typeof stim === "object" && stim ? stim.teks : stim;
    const el = document.createElement("div"); el.id = "g4-panel"; el.className = "g4-panel"; el.style.setProperty("--w", w1);
    el.innerHTML = `<div class="g4-kotak ${soalArab(sx) ? "arab" : ""}"><div class="g4-kepala"><span class="g4-ikon-peti">🧰</span><b>Peti ${k + 1}</b><small>Uraian · ${k + 1} dari ${uraian.length}</small><button class="g4-x" title="Tinggalkan peti">✕</button></div>
      ${stimTeks ? `<div class="stimulus" dir="auto"><span class="lbl">📖 Bacalah teks berikut</span>${fmt(stimTeks)}</div>` : ""}${sx.sg ? gambarHTML(sx.sg) : ""}
      <div class="teks-soal" dir="auto">${fmt(sx.t)}</div>${gambarHTML(sx.g)}
      <textarea id="uraian" dir="auto" ${kbAktif(sx) ? `inputmode="none"` : ""} ${kunci ? "readonly" : ""} placeholder="✍️ Tulis jawabanmu… (tersimpan otomatis, bisa diubah lagi nanti)">${esc(S.jawab.uraian[sx.no] || "")}</textarea>
      <div class="g4-bawah"><span class="g4-kata"></span>${kunci ? `<span class="g4-kunci">🔒 Sudah dikunci</span>` : ""}</div>
      ${soalArab(sx) || kbAktif(sx) ? kbSaklarHTML(sx) : ""}
      <div class="g4-aksi"><button class="g4-tinggal">🏃 Cari peti lain</button>${typeof g3Aktif === "function" && g3Aktif() && !kunci ? `<button class="g4-kunci-btn">🔒 Kunci jawaban peti</button>` : `<button class="g4-simpan">✅ Simpan & tutup</button>`}</div></div>`;
    document.body.appendChild(el); G2.bersih.push(() => el.remove());
    const ta = el.querySelector("textarea"), kata = el.querySelector(".g4-kata");
    const hitung = () => { kata.textContent = `✒️ ${g2HitungKata(ta.value)} kata`; };
    ta.addEventListener("input", () => { if (S.idx !== i) S.idx = i; ketikUraian(ta.value); hitung(); skor(); });
    hitung();
    const tutup = (pesanTeks) => { st.buka = null; el.classList.add("tutup"); setTimeout(() => el.remove(), 250); if (pesanTeks) pesan(pesanTeks, 1300); skor(); };
    el.querySelector(".g4-x").onclick = () => tutup("Peti ditinggal — jawabanmu tetap tersimpan 👍");
    el.querySelector(".g4-tinggal").onclick = () => tutup("Cari peti lain yang lebih mudah 🔎");
    el.querySelector(".g4-simpan")?.addEventListener("click", () => { tutup(dijawab(k) ? `✨ Peti ${k + 1} terisi!` : null); if (dijawab(k)) g2Konfeti(cv); if (uraian.every((_, x) => dijawab(x))) setTimeout(() => pesan("🎉 Semua peti sudah terjawab! Tekan Kirim bila sudah yakin.", 2600), 600); });
    el.querySelector(".g4-kunci-btn")?.addEventListener("click", () => { if (!dijawab(k)) { ta.focus(); return; } el.remove(); st.buka = null; g3Kunci(); });
    setTimeout(() => { if (!kunci) ta.focus({ preventScroll: true }); }, 350);
  }
  function gambar(now) {
    // kamera mengikuti tokoh dengan halus
    const tx = Math.max(0, Math.min(W - VW, P.x - VW / 2 + 0.5)), ty = Math.max(0, Math.min(H - VH, P.y - VH / 2 + 0.5));
    kam.x += (tx - kam.x) * 0.12; kam.y += (ty - kam.y) * 0.12;
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.imageSmoothingEnabled = false;
    ctx.drawImage(latar, kam.x * T * dpr, kam.y * T * dpr, VW * T * dpr, VH * T * dpr, 0, 0, cv.width, cv.height);
    ctx.setTransform(dpr, 0, 0, dpr, -kam.x * T * dpr, -kam.y * T * dpr); ctx.imageSmoothingEnabled = false;
    // jebakan yang sudah ketahuan
    jebakan.forEach(([x, y], j) => { if (!st.jebakanTerlihat.has(j)) return; ctx.fillStyle = "#1c1917"; ctx.beginPath(); ctx.ellipse(x * T + T / 2, y * T + T / 2 + 2, T * 0.38, T * 0.26, 0, 0, 7); ctx.fill(); ctx.fillStyle = "#57534e"; ctx.fillRect(x * T + T * 0.2, y * T + T * 0.62, T * 0.6, T * 0.08); });
    // peti (berkilau & melayang pelan; yang terjawab terbuka dengan tanda ✓)
    peti.forEach(([x, y], k) => {
      const [w1, w2] = G4_PETI_WARNA[k % G4_PETI_WARNA.length], ok = dijawab(k), naik = ok ? 0 : Math.sin(now / 350 + k) * T * 0.06;
      g4Kotak(ctx, T, x * T, y * T + naik, g4Peti(w1, w2, ok));
      ctx.fillStyle = "#fff"; ctx.font = `800 ${Math.round(T * 0.38)}px system-ui,Arial`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      const label = ok ? "✓" : String(k + 1); ctx.lineWidth = 3; ctx.strokeStyle = w2; ctx.strokeText(label, x * T + T / 2, y * T - T * 0.18 + naik); ctx.fillText(label, x * T + T / 2, y * T - T * 0.18 + naik);
      if (!ok && Math.floor(now / 260 + k) % 6 === 0) { ctx.fillStyle = "#fef08a"; ctx.fillRect(x * T + T * 0.75, y * T + T * 0.2 + naik, T / 8, T / 8); }
    });
    // tokoh santri
    const gerak = (P.dir[0] || P.dir[1]) && jatuh <= 0, bingkai = gerak && Math.floor(langkahT * 3) % 2 ? tokoh.jalan : P.hadap === "belakang" ? tokoh.belakang : tokoh.depan;
    const X = P.x * T, Y = P.y * T - (gerak ? Math.abs(Math.sin(langkahT * Math.PI)) * T * 0.08 : 0);
    ctx.fillStyle = "rgba(0,0,0,.22)"; ctx.beginPath(); ctx.ellipse(P.x * T + T / 2, P.y * T + T * 0.92, T * 0.3, T * 0.09, 0, 0, 7); ctx.fill();
    ctx.save();
    if (jatuh > 0) { const k = Math.max(0.1, jatuh / 1.3); ctx.translate(X + T / 2, Y + T); ctx.scale(k, k); ctx.rotate((1 - k) * 3); ctx.translate(-(X + T / 2), -(Y + T)); }
    if (P.balik < 0) { ctx.translate(X + T / 2, 0); ctx.scale(-1, 1); ctx.translate(-(X + T / 2), 0); }
    g4Kotak(ctx, T, X, Y, bingkai); ctx.restore();
    ctx.font = `800 ${Math.max(9, Math.round(T * 0.36))}px system-ui,Arial`; const lebar = ctx.measureText(nama).width + 8;
    ctx.fillStyle = "rgba(15,23,42,.75)"; ctx.fillRect(P.x * T + T / 2 - lebar / 2, Y - T * 0.42, lebar, T * 0.42); ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(nama, P.x * T + T / 2, Y - T * 0.21);
  }
  function putar(now) {
    if (!cv.isConnected) return;
    const dt = Math.min(0.05, (now - lalu) / 1000); lalu = now;
    if (!document.hidden && !document.getElementById("g4-panel")) langkah(dt);
    gambar(now);
    G2.raf = requestAnimationFrame(putar);
  }
  G2.raf = requestAnimationFrame((t) => { lalu = t; putar(t); });
  skor();
  // kendali: ketuk tujuan, tombol arah, geser layar, keyboard
  const keTujuan = (e) => {
    const r = cv.getBoundingClientRect(), x = Math.floor(kam.x + ((e.clientX - r.left) / r.width) * VW), y = Math.floor(kam.y + ((e.clientY - r.top) / r.height) * VH);
    const kePeti = peti.findIndex((p) => p[0] === x && p[1] === y);
    if (kePeti >= 0 && Math.round(P.x) === x && Math.round(P.y) === y) { bukaPeti(kePeti); return; }
    if (!lantai(x, y)) return;
    P.mau = [0, 0]; P.jalur = cariJalur(x, y); terakhirPeti = null;
  };
  let awal = null, geser = false;
  g2Dengar(cv, "pointerdown", (e) => { awal = [e.clientX, e.clientY]; geser = false; });
  g2Dengar(cv, "pointermove", (e) => { if (!awal) return; const dx = e.clientX - awal[0], dy = e.clientY - awal[1]; if (Math.max(Math.abs(dx), Math.abs(dy)) > 18) { geser = true; P.jalur = []; P.mau = Math.abs(dx) > Math.abs(dy) ? [Math.sign(dx), 0] : [0, Math.sign(dy)]; awal = [e.clientX, e.clientY]; terakhirPeti = null; } });
  g2Dengar(cv, "pointerup", (e) => { if (!geser) keTujuan(e); else P.mau = [0, 0]; awal = null; });
  isi.querySelectorAll(".g4-dpad button").forEach((b) => {
    const d = b.dataset.d.split(",").map(Number);
    g2Dengar(b, "pointerdown", (e) => { e.preventDefault(); P.jalur = []; P.mau = d; terakhirPeti = null; });
    ["pointerup", "pointerleave", "pointercancel"].forEach((ev) => g2Dengar(b, ev, () => { if (P.mau[0] === d[0] && P.mau[1] === d[1]) P.mau = [0, 0]; }));
  });
  const peta2 = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] };
  g2Dengar(document, "keydown", (e) => { const d = peta2[e.key]; if (!d || (e.target && e.target.matches && e.target.matches("input,textarea,select"))) return; e.preventDefault(); P.jalur = []; P.mau = d; terakhirPeti = null; }, true);
  g2Dengar(document, "keyup", (e) => { const d = peta2[e.key]; if (d && P.mau[0] === d[0] && P.mau[1] === d[1]) P.mau = [0, 0]; }, true);
  g2Dengar(window, "resize", ukur);
  // peti yang sedang dibuka sebelum digambar ulang (mis. setelah menyalakan keyboard Arab) dibuka lagi
  if (st.buka != null) { const k = uraian.findIndex((x) => x.s.no === st.buka); if (k >= 0) setTimeout(() => bukaPeti(k), 60); }
};
G2_MAIN.peti = G2_MAIN_PETI;

(function () {
  const css = `
  .g4-mode>:not(.g2-wadah){display:none!important}
  .g2w-peti .g2-judul{background:linear-gradient(135deg,#166534,#a16207)}
  .g4-hud{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:8px;font-size:12.5px}
  .g4-hud #g4-skor{background:#fef3c7;color:#92400e;border-radius:99px;padding:4px 10px;font-weight:700}.g4-hud .ket{color:#64748b;flex:1;min-width:160px}
  .g4-layar{position:relative;display:flex;justify-content:center}
  #g4-cv{border-radius:12px;box-shadow:0 8px 22px rgba(22,101,52,.35);image-rendering:pixelated;touch-action:none;display:block;border:3px solid #3f2a14}
  #g4-cv.goyang{animation:g2-goyang .45s}
  .g4-pesan{position:absolute;left:50%;top:14px;transform:translate(-50%,-10px);background:rgba(15,23,42,.85);color:#fff;font-weight:800;font-size:13px;padding:8px 14px;border-radius:12px;opacity:0;transition:.25s;pointer-events:none;white-space:nowrap;max-width:92%;text-overflow:ellipsis;overflow:hidden}
  .g4-pesan.on{opacity:1;transform:translate(-50%,0)}
  .g4-dpad button{background:linear-gradient(180deg,#a16207,#713f12);box-shadow:0 4px 0 #422006}
  .g4-panel{position:fixed;inset:0;z-index:70;background:rgba(15,23,42,.45);display:flex;align-items:flex-end;justify-content:center;animation:g4-masuk .25s ease}
  .g4-panel.tutup{animation:g4-keluar .25s ease forwards}
  @keyframes g4-masuk{from{background:rgba(15,23,42,0)}}@keyframes g4-keluar{to{opacity:0}}
  .g4-kotak{width:min(760px,100%);max-height:88vh;overflow:auto;background:#fffdf7;border-radius:22px 22px 0 0;border-top:8px solid var(--w);padding:14px 16px 18px;box-shadow:0 -12px 40px rgba(0,0,0,.3);animation:g4-naik .35s cubic-bezier(.3,1.3,.5,1)}
  @keyframes g4-naik{from{transform:translateY(60%)}}
  .g4-kepala{display:flex;align-items:center;gap:8px;margin-bottom:10px}.g4-kepala b{font-size:17px;color:var(--w)}.g4-kepala small{color:#64748b;flex:1}
  .g4-ikon-peti{font-size:26px;animation:g4-goyang 1.2s ease-in-out}@keyframes g4-goyang{20%{transform:rotate(-14deg) scale(1.2)}40%{transform:rotate(12deg)}60%{transform:rotate(-6deg)}}
  .g4-x{border:0;background:#f1f5f9;border-radius:50%;width:34px;height:34px;font-size:15px;cursor:pointer}
  .g4-kotak textarea{width:100%;min-height:150px;margin-top:10px;border:2px solid color-mix(in srgb,var(--w) 40%,#e2e8f0);border-radius:14px;padding:10px;font:inherit;font-size:15px;line-height:1.6;background:#fff}
  .g4-kotak.arab textarea{font-family:Amiri,"Traditional Arabic",serif;font-size:20px}
  .g4-bawah{display:flex;justify-content:space-between;margin-top:6px;font-size:12.5px;color:#64748b}.g4-kunci{font-weight:800;color:#2563eb}
  .g4-aksi{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px}
  .g4-aksi button{border:0;border-radius:14px;padding:12px;font-weight:900;font-size:14px;cursor:pointer}
  .g4-tinggal{background:#f1f5f9;color:#334155}.g4-simpan,.g4-kunci-btn{background:var(--w);color:#fff;box-shadow:0 4px 0 rgba(0,0,0,.2)}
  `;
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
})();
// uji coba: layar petunjuk sudah tergambar sebelum file ini termuat → gambar ulang supaya pilihan "Berburu Peti" muncul
if (typeof S !== "undefined" && S.coba && !document.querySelector(".kartu-soal") && document.querySelector(".g2-pilih-coba")) { document.querySelector(".g2-pilih-coba").remove(); window.tampilPetunjuk({}); }

// ============================================================
//  GAME PER JENIS SOAL — Ruang Santri (santri.html)
//  Guru memilih game untuk tiap jenis soal saat membuka sesi (kv "ujian:tampilan" →
//  { sesiId: { gaya: "roket"|null, per: { pg:"labirin", pgk:"kolam", isian:"balok", jodoh:"kartu"|"garis", urut:"kereta" } } }).
//    🏃 labirin : PG — lari di labirin menuju huruf jawaban, dikejar hewan (makin cepat bila waktu soal habis)
//    🐟 kolam   : PG Kompleks — ikan berisi pilihan berenang, tangkap semua yang benar dengan jaring
//    🔤 balok   : Isian — susun jawaban dari balok huruf bernilai (seperti permainan susun kata)
//    🃏 kartu   : Menjodohkan — buka kartu pernyataan & kartu jawaban untuk dipasangkan
//    🔗 garis   : Menjodohkan — tarik garis dari kiri ke kanan
//    🚂 kereta  : Mengurutkan — sambungkan gerbong ke lokomotif sesuai urutan
//  KUNCI JAWABAN TIDAK PERNAH ada di HP santri → game tidak tahu benar/salah; game hanya cara menjawab.
//  Format jawaban sama persis dengan tampilan biasa (S.jawab.pg / pgk / isian / jodoh / urut).
// ============================================================
const G2 = { raf: 0, bersih: [], mati: new Set() };
const G2_NAMA = {
  pg: { labirin: ["🏃", "Labirin Kejar"] },
  pgk: { kolam: ["🐟", "Kolam Ikan"] },
  isian: { balok: ["🔤", "Balok Huruf"] },
  jodoh: { kartu: ["🃏", "Kartu Pasangan"], garis: ["🔗", "Tarik Garis"] },
  urut: { kereta: ["🚂", "Gerbong Kereta"] },
  uraian: { pohon: ["🌳", "Pohon Ilmu"], perkamen: ["📜", "Surat Perkamen"] },
};
const G2_WARNA = ["#ef4444", "#2563eb", "#16a34a", "#f59e0b", "#9333ea", "#0891b2", "#db2777", "#65a30d", "#ea580c", "#4f46e5"];

// ── Pengaturan game: dari sesi (kv) atau dari pilihan guru saat uji coba ──
(function () {
  const asli = window.gameMuatGaya;
  if (typeof asli === "function") {
    window.gameMuatGaya = async function () {
      const peta = await asli.apply(this, arguments);
      S.gaya2Map = S.gaya2Map || {};
      Object.keys(peta || {}).forEach((k) => {
        const v = peta[k];
        if (v && typeof v === "object") { S.gaya2Map[k] = v.per || {}; (S.gameKelasMap = S.gameKelasMap || {})[k] = v.kelas || null; peta[k] = v.gaya || null; }
      });
      return peta;
    };
  }
})();
function g2Per() {
  if (S.coba) return S.gameCoba || {};
  return (S.gaya2Map || {})[S.sesi && S.sesi.id] || {};
}
function g2Untuk(s) {
  if (!s || G2.mati.has(s.jenis + "-" + s.no)) return null;
  if (typeof g3Terkunci === "function" && g3Terkunci(s)) return null;
  if (s.jenis === "pgk" && s.bs) return null; // Benar/Salah tetap tampilan biasa
  if (s.jenis === "uraian" && s.rek) return null; // uraian rekaman suara tetap biasa
  if (s.jenis === "isian" && typeof soalArab === "function" && soalArab(s)) return null; // isian bahasa Arab → keyboard Arab biasa
  const p = g2Per()[s.jenis];
  return p && G2_NAMA[s.jenis] && G2_NAMA[s.jenis][p] ? p : null;
}
function g2Bersih() {
  cancelAnimationFrame(G2.raf); G2.raf = 0;
  G2.bersih.splice(0).forEach((f) => { try { f(); } catch (e) {} });
}
// pasang pendengar yang otomatis dilepas saat soal berganti
function g2Dengar(el, ev, fn, opsi) { el.addEventListener(ev, fn, opsi); G2.bersih.push(() => el.removeEventListener(ev, fn, opsi)); }
function g2Sorak(teks, kelas) {
  const e = document.createElement("div"); e.className = "g2-sorak " + (kelas || ""); e.innerHTML = teks;
  document.body.appendChild(e); setTimeout(() => e.remove(), 1300);
}
function g2Konfeti(el) {
  const r = el.getBoundingClientRect();
  for (let i = 0; i < 26; i++) {
    const c = document.createElement("i"); c.className = "g2-konfeti";
    c.style.cssText = `left:${r.left + r.width / 2}px;top:${r.top + r.height / 2}px;background:${G2_WARNA[i % G2_WARNA.length]};--dx:${(Math.random() - 0.5) * 340}px;--dy:${-120 - Math.random() * 220}px;--r:${Math.random() * 720}deg`;
    document.body.appendChild(c); setTimeout(() => c.remove(), 1200);
  }
}
const g2Huruf = (s, k) => (soalArab(s) ? HURUF_AR : HURUF)[k];
// lanjut ke soal berikutnya setelah menjawab (bila ada)
function g2Lanjut(jeda) {
  const idx = S.idx;
  if (typeof g3Aktif === "function" && g3Aktif()) { setTimeout(() => { if (S.idx === idx) g3Kunci(); }, 700); return; }
  setTimeout(() => { if (S.idx !== idx || !document.querySelector(".g2-wadah")) return; if (S.idx < S.soal.length - 1) geser(1); else tampilSoal(); }, jeda || 900);
}

// ── Sambungan ke tampilan soal ──
(function () {
  const asli = window.tampilSoal; if (typeof asli !== "function") return;
  window.tampilSoal = function () {
    g2Bersih();
    const hasil = asli.apply(this, arguments);
    const s = S.soal[S.idx], g = g2Untuk(s);
    const kartu = document.querySelector(".kartu-soal");
    if (!kartu || !s) return hasil;
    if (!g) {
      if (g2Per()[s.jenis] && G2.mati.has(s.jenis + "-" + s.no)) kartu.insertAdjacentHTML("beforeend", `<button class="g2-saklar" onclick="G2.mati.delete('${s.jenis}-${s.no}');tampilSoal()">🎮 Kembali ke mode game</button>`);
      return hasil;
    }
    kartu.classList.add("g2-aktif", "g2-" + s.jenis);
    // isian dengan titik-titik di teks soal: kotak ketik diganti penanda nomor
    kartu.querySelectorAll(".teks-soal .isian-kotak").forEach((inp, x) => { const sp = document.createElement("span"); sp.className = "g2-rumpang"; sp.dataset.x = x; sp.textContent = inp.value || "(" + (x + 1) + ")"; inp.replaceWith(sp); });
    const [ikon, nama] = G2_NAMA[s.jenis][g];
    const wadah = document.createElement("div"); wadah.className = "g2-wadah g2w-" + g;
    wadah.innerHTML = `<div class="g2-judul"><span>${ikon} ${nama}</span><button class="g2-biasa" onclick="G2.mati.add('${s.jenis}-${s.no}');tampilSoal()" title="Jawab dengan tampilan biasa">⌨️ Tanpa game</button></div><div class="g2-isi"></div>`;
    kartu.appendChild(wadah);
    try { G2_MAIN[g](wadah.querySelector(".g2-isi"), s); } catch (e) { console.error(e); G2.mati.add(s.jenis + "-" + s.no); asli.apply(this, arguments); }
    return hasil;
  };
})();

// ============================================================
//  1. 🏃 LABIRIN KEJAR (Pilihan Ganda)
// ============================================================
const G2_HEWAN = ["🐺", "🐻", "🐊", "🦁", "🐯", "🐗", "🦊", "🐆"];
function g2Acak(benih) { let h = 2166136261; for (const c of String(benih)) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return () => { h += 0x6d2b79f5; let t = h; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
// Labirin petak: 1 = dinding, 0 = jalan. Ukuran ganjil. Dibuat acak tetap per santri & soal, lalu diberi jalan pintas (tidak buntu semua).
function g2BuatLabirin(cw, ch, acak) {
  const W = cw * 2 + 1, H = ch * 2 + 1, g = Array.from({ length: H }, () => Array(W).fill(1));
  const tumpuk = [[0, 0]], seen = new Set(["0,0"]); g[1][1] = 0;
  while (tumpuk.length) {
    const [x, y] = tumpuk[tumpuk.length - 1];
    const tetangga = [[1, 0], [-1, 0], [0, 1], [0, -1]].map(([dx, dy]) => [x + dx, y + dy, dx, dy]).filter(([nx, ny]) => nx >= 0 && ny >= 0 && nx < cw && ny < ch && !seen.has(nx + "," + ny));
    if (!tetangga.length) { tumpuk.pop(); continue; }
    const [nx, ny, dx, dy] = tetangga[Math.floor(acak() * tetangga.length)];
    g[y * 2 + 1 + dy][x * 2 + 1 + dx] = 0; g[ny * 2 + 1][nx * 2 + 1] = 0;
    seen.add(nx + "," + ny); tumpuk.push([nx, ny]);
  }
  // jalan pintas: buka sebagian dinding dalam supaya ada banyak jalur untuk menghindar
  for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
    if (g[y][x] !== 1) continue;
    const datar = x % 2 === 0 && y % 2 === 1 && g[y][x - 1] === 0 && g[y][x + 1] === 0;
    const tegak = y % 2 === 0 && x % 2 === 1 && g[y - 1][x] === 0 && g[y + 1][x] === 0;
    if ((datar || tegak) && acak() < 0.16) g[y][x] = 0;
  }
  return g;
}
function g2Jarak(g, sx, sy) {
  const H = g.length, W = g[0].length, d = Array.from({ length: H }, () => Array(W).fill(-1)), q = [[sx, sy]]; d[sy][sx] = 0;
  for (let i = 0; i < q.length; i++) { const [x, y] = q[i]; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + dx, ny = y + dy; if (g[ny] && g[ny][nx] === 0 && d[ny][nx] < 0) { d[ny][nx] = d[y][x] + 1; q.push([nx, ny]); } } }
  return d;
}
const G2_MAIN_LABIRIN = function (isi, s) {
  const acak = g2Acak((S.murid && S.murid.id) + "-lab-" + s.no);
  const n = s.urutanOpsi.length, cw = 7, ch = n > 5 ? 9 : 8;
  const g = g2BuatLabirin(cw, ch, acak), W = g[0].length, H = g.length;
  const mulai = [Math.floor(cw / 2) * 2 + 1, Math.floor(ch / 2) * 2 + 1];
  const jar = g2Jarak(g, mulai[0], mulai[1]);
  // titik jawaban: sel ruang (koordinat ganjil) yang saling berjauhan & jauh dari titik mulai
  const kandidat = [];
  for (let y = 1; y < H; y += 2) for (let x = 1; x < W; x += 2) if (jar[y][x] >= 5) kandidat.push([x, y]);
  const pos = [];
  kandidat.sort((a, b) => jar[b[1]][b[0]] - jar[a[1]][a[0]]);
  while (pos.length < n && kandidat.length) {
    let terbaik = 0, skor = -1;
    kandidat.forEach((c, i) => { const m = pos.length ? Math.min(...pos.map((p) => Math.abs(p[0] - c[0]) + Math.abs(p[1] - c[1]))) : 99; const sk = m * 3 + jar[c[1]][c[0]]; if (sk > skor) { skor = sk; terbaik = i; } });
    pos.push(kandidat.splice(terbaik, 1)[0]);
  }
  const hewan = G2_HEWAN[(s.no + (S.idx || 0)) % G2_HEWAN.length];
  const dipilih = S.jawab.pg[s.no];
  isi.innerHTML = `<div class="g2-lab-hud"><span id="g2-lab-waktu">⏳ 30</span><span id="g2-lab-ket">Lari ke huruf jawabanmu! Awas ${hewan}</span><span id="g2-lab-tangkap"></span></div>
    <div class="g2-lab-panggung"><canvas id="g2-lab"></canvas><div class="g2-lab-pesan" id="g2-lab-pesan"></div></div>
    <div class="g2-dpad"><button data-d="0,-1">▲</button><button data-d="-1,0">◀</button><button data-d="1,0">▶</button><button data-d="0,1">▼</button></div>
    <div class="g2-lab-opsi" ${soalArab(s) ? 'dir="rtl"' : ""}>${s.urutanOpsi.map((asli, k) => `<div class="${dipilih === asli ? "on" : ""}" style="--w:${G2_WARNA[k % G2_WARNA.length]}"><b>${g2Huruf(s, k)}</b><span dir="auto">${fmt(s.o[asli])}${s.og && s.og[asli] ? gambarHTML(s.og[asli]) : ""}</span></div>`).join("")}</div>
    <p class="g2-tip">Geser layar / tombol panah untuk berlari. Sampai di huruf = memilih jawaban itu. Tertangkap? Kembali ke tengah, jawaban tidak berkurang.</p>`;
  const cv = isi.querySelector("#g2-lab"), ctx = cv.getContext("2d");
  let T = 20, dpr = 1;
  const latar = document.createElement("canvas");
  function ukur() {
    const lebar = Math.min(isi.clientWidth, 520);
    T = Math.floor(lebar / W); dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = W * T * dpr; cv.height = H * T * dpr; cv.style.width = W * T + "px"; cv.style.height = H * T + "px";
    latar.width = cv.width; latar.height = cv.height;
    const l = latar.getContext("2d"); l.setTransform(dpr, 0, 0, dpr, 0, 0);
    const rumput = l.createLinearGradient(0, 0, 0, H * T); rumput.addColorStop(0, "#bbf7d0"); rumput.addColorStop(1, "#86efac"); l.fillStyle = rumput; l.fillRect(0, 0, W * T, H * T);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      if (g[y][x] === 0) { l.fillStyle = (x + y) % 2 ? "#fef3c7" : "#fde68a"; l.fillRect(x * T, y * T, T, T); continue; }
      l.fillStyle = "#15803d"; l.beginPath(); l.roundRect ? l.roundRect(x * T + 1, y * T + 1, T - 2, T - 2, T * 0.3) : l.rect(x * T + 1, y * T + 1, T - 2, T - 2); l.fill();
      l.fillStyle = "rgba(255,255,255,.18)"; l.beginPath(); l.arc(x * T + T * 0.35, y * T + T * 0.35, T * 0.14, 0, 7); l.fill();
    }
  }
  ukur();
  // keadaan permainan
  const P = { x: mulai[0], y: mulai[1], tx: mulai[0], ty: mulai[1], dir: [0, 0], mau: [0, 0], cepat: 4.3, hadap: 1 };
  const spawnHewan = () => { const d = g2Jarak(g, mulai[0], mulai[1]); let b = [1, 1], m = -1; for (let y = 1; y < H; y += 2) for (let x = 1; x < W; x += 2) if (d[y][x] > m && !pos.some((p) => p[0] === x && p[1] === y)) { m = d[y][x]; b = [x, y]; } return b; };
  const sp = spawnHewan();
  const A = { x: sp[0], y: sp[1], tx: sp[0], ty: sp[1], cepat: 2.1, hadap: -1 };
  let tSoal = 0, jeda = 1.2, tangkap = 0, selesai = false, last = performance.now(), batas = 30;
  G2.lab = { P, A, pos, mulai, g, info: () => ({ tSoal, jeda, tangkap, selesai, cepatHewan: A.cepat }) }; // untuk pemeriksaan
  const buka = (x, y) => g[y] && g[y][x] === 0;
  function pesan(t, ms) { const el = isi.querySelector("#g2-lab-pesan"); if (!el) return; el.innerHTML = t; el.classList.add("on"); clearTimeout(pesan.t); pesan.t = setTimeout(() => el.classList.remove("on"), ms || 1100); }
  pesan(`Siap… lari! ${hewan} mulai mengejar sebentar lagi`, 1300);
  function langkahPemain(dt) {
    let sisa = P.cepat * dt;
    while (sisa > 0) {
      const dx = P.tx - P.x, dy = P.ty - P.y, jauh = Math.abs(dx) + Math.abs(dy);
      if (jauh < 1e-6) {
        // di tengah petak: pilih arah (arah yang diinginkan dulu, kalau terhalang lanjut arah lama)
        P.x = P.tx; P.y = P.ty;
        cekSampai(); if (selesai) return;
        const [mx, my] = P.mau, [cx, cy] = P.dir;
        if ((mx || my) && buka(P.x + mx, P.y + my)) P.dir = [mx, my];
        else if (!((cx || cy) && buka(P.x + cx, P.y + cy))) { P.dir = [0, 0]; return; }
        P.tx = P.x + P.dir[0]; P.ty = P.y + P.dir[1]; if (P.dir[0]) P.hadap = P.dir[0];
        continue;
      }
      // balik arah di tengah jalan
      if (P.mau[0] === -P.dir[0] && P.mau[1] === -P.dir[1] && (P.mau[0] || P.mau[1])) { const ox = P.tx - P.dir[0], oy = P.ty - P.dir[1]; P.dir = P.mau.slice(); P.tx = ox; P.ty = oy; if (P.dir[0]) P.hadap = P.dir[0]; continue; }
      const gerak = Math.min(sisa, jauh); P.x += Math.sign(dx) * gerak; P.y += Math.sign(dy) * gerak; sisa -= gerak;
    }
  }
  function langkahHewan(dt) {
    let sisa = A.cepat * dt;
    while (sisa > 0) {
      const dx = A.tx - A.x, dy = A.ty - A.y, jauh = Math.abs(dx) + Math.abs(dy);
      if (jauh < 1e-6) {
        A.x = A.tx; A.y = A.ty;
        const target = [Math.round(P.x), Math.round(P.y)];
        const d = g2Jarak(g, target[0], target[1]);
        let pilih = null, m = 1e9;
        for (const [ax, ay] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = A.x + ax, ny = A.y + ay; if (buka(nx, ny) && d[ny][nx] >= 0 && d[ny][nx] < m) { m = d[ny][nx]; pilih = [nx, ny]; } }
        if (!pilih) return;
        A.tx = pilih[0]; A.ty = pilih[1]; if (pilih[0] !== A.x) A.hadap = pilih[0] > A.x ? 1 : -1;
        continue;
      }
      const gerak = Math.min(sisa, jauh); A.x += Math.sign(dx) * gerak; A.y += Math.sign(dy) * gerak; sisa -= gerak;
    }
  }
  function cekSampai() {
    const k = pos.findIndex((p) => p[0] === P.x && p[1] === P.y); if (k < 0) return;
    const asli = s.urutanOpsi[k];
    selesai = true; S.jawab.pg[s.no] = asli; berubah();
    isi.querySelectorAll(".g2-lab-opsi > div").forEach((el, i) => el.classList.toggle("on", i === k));
    pesan(`🎉 Kamu memilih <b>${g2Huruf(s, k)}</b>`, 1500); g2Konfeti(cv);
    g2Lanjut(1500);
  }
  function tertangkap() {
    tangkap++; jeda = 1.3; tSoal = Math.max(0, tSoal - 8);
    P.x = P.tx = mulai[0]; P.y = P.ty = mulai[1]; P.dir = [0, 0]; P.mau = [0, 0];
    const b = spawnHewan(); A.x = A.tx = b[0]; A.y = A.ty = b[1];
    cv.classList.remove("goyang"); void cv.offsetWidth; cv.classList.add("goyang");
    pesan(`Tertangkap ${hewan}! Kembali ke tengah…`, 1300);
    const el = isi.querySelector("#g2-lab-tangkap"); if (el) el.textContent = `${hewan} × ${tangkap}`;
  }
  function gambar(now) {
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(latar, 0, 0); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // titik jawaban (berdenyut)
    pos.forEach(([x, y], k) => {
      const r = T * (0.42 + Math.sin(now / 300 + k) * 0.04), cx = x * T + T / 2, cy = y * T + T / 2;
      ctx.fillStyle = G2_WARNA[k % G2_WARNA.length]; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.fill();
      ctx.lineWidth = 2; ctx.strokeStyle = dipilihSkrg() === k ? "#fde047" : "#fff"; ctx.stroke();
      ctx.fillStyle = "#fff"; ctx.font = `800 ${Math.round(T * 0.5)}px system-ui,Arial`; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(g2Huruf(s, k), cx, cy + 1);
    });
    const emoji = (e, x, y, hadap, lompat) => {
      ctx.save(); ctx.translate(x * T + T / 2, y * T + T / 2 - lompat); ctx.scale(-hadap, 1);
      ctx.globalAlpha = 1; ctx.fillStyle = "#000"; ctx.font = `${Math.round(T * 0.95)}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(e, 0, 0); ctx.restore();
    };
    const gerakP = P.dir[0] || P.dir[1] ? Math.abs(Math.sin(now / 90)) * T * 0.12 : 0;
    ctx.fillStyle = "rgba(0,0,0,.18)"; ctx.beginPath(); ctx.ellipse(A.x * T + T / 2, A.y * T + T * 0.85, T * 0.32, T * 0.1, 0, 0, 7); ctx.ellipse(P.x * T + T / 2, P.y * T + T * 0.85, T * 0.3, T * 0.1, 0, 0, 7); ctx.fill();
    if (jeda <= 0 || Math.floor(now / 200) % 2) emoji(hewan, A.x, A.y, A.hadap, Math.abs(Math.sin(now / 110)) * T * 0.1);
    // penanda pemain: lingkaran biru supaya jelas terlihat di lantai terang
    ctx.fillStyle = "#2563eb"; ctx.strokeStyle = "#fff"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(P.x * T + T / 2, P.y * T + T / 2 - gerakP, T * 0.48, 0, 7); ctx.fill(); ctx.stroke();
    emoji("🏃", P.x, P.y, P.hadap, gerakP);
  }
  const dipilihSkrg = () => s.urutanOpsi.indexOf(S.jawab.pg[s.no]);
  function putar(now) {
    if (!cv.isConnected) return;
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (!document.hidden && !selesai) {
      tSoal += dt;
      const sisaW = Math.max(0, Math.ceil(batas - tSoal)), lw = isi.querySelector("#g2-lab-waktu");
      if (lw) { lw.textContent = sisaW > 0 ? `⏳ ${sisaW}` : "🔥 Cepat!"; lw.classList.toggle("kritis", sisaW <= 5); }
      if (jeda > 0) jeda -= dt;
      else {
        // makin lama makin cepat; lewat batas waktu soal → lebih cepat dari pemain. Waktu ujian hampir habis → ikut cepat.
        const lewat = tSoal > batas, sesiKritis = S.sisa !== null && S.sisa < 120;
        A.cepat = Math.min(lewat ? 5.2 : 3.6, 2.1 + tSoal * 0.05 + (lewat ? 1.2 : 0) + (sesiKritis ? 0.5 : 0));
        langkahHewan(dt);
      }
      langkahPemain(dt);
      if (jeda <= 0 && Math.hypot(A.x - P.x, A.y - P.y) < 0.62) tertangkap();
    }
    gambar(now);
    G2.raf = requestAnimationFrame(putar);
  }
  G2.raf = requestAnimationFrame((t) => { last = t; putar(t); });
  // kendali: geser layar, tombol panah layar, keyboard
  const arah = (d) => { P.mau = d; };
  let awal = null;
  g2Dengar(cv, "touchstart", (e) => { const t = e.touches[0]; awal = [t.clientX, t.clientY]; }, { passive: true });
  g2Dengar(cv, "touchmove", (e) => {
    if (!awal) return; const t = e.touches[0], dx = t.clientX - awal[0], dy = t.clientY - awal[1];
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 16) return;
    e.preventDefault(); arah(Math.abs(dx) > Math.abs(dy) ? [Math.sign(dx), 0] : [0, Math.sign(dy)]); awal = [t.clientX, t.clientY];
  }, { passive: false });
  isi.querySelectorAll(".g2-dpad button").forEach((b) => { const d = b.dataset.d.split(",").map(Number); g2Dengar(b, "pointerdown", (e) => { e.preventDefault(); arah(d); }); });
  g2Dengar(document, "keydown", (e) => {
    const peta = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0], w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0] };
    const d = peta[e.key]; if (!d || (e.target && e.target.matches && e.target.matches("input,textarea,select"))) return; e.preventDefault(); e.stopPropagation(); arah(d);
  }, true);
  g2Dengar(window, "resize", () => { ukur(); });
};

// ============================================================
//  2. 🐟 KOLAM IKAN (PG Kompleks)
// ============================================================
const G2_MAIN_KOLAM = function (isi, s) {
  const ikan = ["🐟", "🐠", "🐡", "🦈", "🐬", "🐳", "🦑", "🐙", "🦐", "🦀"];
  const pilih = () => new Set(S.jawab.pgk[s.no] || []);
  isi.innerHTML = `<p class="g2-tip" style="margin-top:0">Ketuk ikan yang membawa jawaban benar — boleh <b>lebih dari satu</b>. Ketuk ikan di ember untuk melepasnya.</p>
    <div class="g2-kolam" style="--n:${s.urutanOpsi.length}">${s.urutanOpsi.map((asli, k) => `<button class="g2-ikan" data-a="${asli}" style="--lajur:${k};--n:${s.urutanOpsi.length};--dur:${11 + ((k * 7) % 6)}s;--tunda:-${(k * 2.7) % 9}s;--w:${G2_WARNA[k % G2_WARNA.length]}">
        <span class="badan"><span class="e">${ikan[k % ikan.length]}</span><b>${g2Huruf(s, k)}</b><span class="t" dir="auto">${fmt(s.o[asli])}</span></span></button>`).join("")}
      <div class="g2-gelembung">${Array.from({ length: 10 }, (_, i) => `<i style="left:${(i * 37) % 100}%;animation-delay:-${i * 0.9}s"></i>`).join("")}</div></div>
    <div class="g2-ember"><span class="lbl">🪣 Ember</span><div class="isi"></div></div>
    <div class="g2-lab-opsi" ${soalArab(s) ? 'dir="rtl"' : ""}>${s.urutanOpsi.map((asli, k) => `<div data-a="${asli}" style="--w:${G2_WARNA[k % G2_WARNA.length]}"><b>${g2Huruf(s, k)}</b><span dir="auto">${fmt(s.o[asli])}${s.og && s.og[asli] ? gambarHTML(s.og[asli]) : ""}</span></div>`).join("")}</div>`;
  const segarkan = () => {
    const p = pilih();
    isi.querySelectorAll(".g2-ikan").forEach((el) => el.classList.toggle("ditangkap", p.has(+el.dataset.a)));
    isi.querySelectorAll(".g2-lab-opsi > div").forEach((el) => el.classList.toggle("on", p.has(+el.dataset.a)));
    isi.querySelector(".g2-ember .isi").innerHTML = [...p].map((a) => { const k = s.urutanOpsi.indexOf(a); return `<button data-a="${a}" style="--w:${G2_WARNA[k % G2_WARNA.length]}">${ikan[k % ikan.length]} <b>${g2Huruf(s, k)}</b></button>`; }).join("") || `<small>Belum ada ikan</small>`;
  };
  const tukar = (a, el) => {
    const p = pilih(); const tangkap = !p.has(a); tangkap ? p.add(a) : p.delete(a);
    const arr = [...p].sort((x, y) => x - y); if (arr.length) S.jawab.pgk[s.no] = arr; else delete S.jawab.pgk[s.no];
    berubah();
    if (tangkap && el) { const j = document.createElement("span"); j.className = "g2-jaring"; j.textContent = "🥅"; el.appendChild(j); setTimeout(() => j.remove(), 600); }
    segarkan();
  };
  const kolam = isi.querySelector(".g2-kolam");
  const ukurKolam = () => { const lebarIkan = Math.max(...[...kolam.querySelectorAll(".g2-ikan .badan")].map((b) => b.offsetWidth), 120); kolam.style.setProperty("--jauh", Math.max(20, kolam.clientWidth - lebarIkan - 8) + "px"); };
  ukurKolam(); g2Dengar(window, "resize", ukurKolam);
  isi.querySelectorAll(".g2-ikan, .g2-lab-opsi > div").forEach((el) => g2Dengar(el, "click", () => tukar(+el.dataset.a, el.classList.contains("g2-ikan") ? el : null)));
  g2Dengar(isi.querySelector(".g2-ember"), "click", (e) => { const b = e.target.closest("button[data-a]"); if (b) tukar(+b.dataset.a); });
  segarkan();
};

// ============================================================
//  3. 🔤 BALOK HURUF (Isian Singkat)
// ============================================================
const G2_NILAI = { A: 1, B: 3, C: 3, D: 2, E: 1, F: 4, G: 2, H: 4, I: 1, J: 8, K: 5, L: 1, M: 3, N: 1, O: 1, P: 3, Q: 10, R: 1, S: 1, T: 1, U: 1, V: 4, W: 4, X: 8, Y: 4, Z: 10 };
const G2_BARIS = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"], G2_ANGKA = ["1234567890", "-.,/:'()", ""];
const G2_MAIN_BALOK = function (isi, s) {
  const n = Math.max(1, s.n || (String(s.t || "").match(/_{3,}/g) || []).length);
  let aktif = 0, modeAngka = false;
  const ambil = () => { const a = (S.jawab.isian[s.no] || []).slice(); while (a.length < n) a.push(""); return a; };
  const simpan = (a) => { S.jawab.isian[s.no] = a; if (!adaIsi(a)) delete S.jawab.isian[s.no]; berubah(); const sp = document.querySelector(`.g2-rumpang[data-x="${aktif}"]`); if (sp) sp.textContent = a[aktif] || "(" + (aktif + 1) + ")"; };
  const nilai = (c) => G2_NILAI[c.toUpperCase()] || (/\d/.test(c) ? 2 : 0);
  function gambar() {
    const a = ambil(), kata = String(a[aktif] || "");
    const skor = [...kata].reduce((t, c) => t + nilai(c), 0);
    isi.innerHTML = `${n > 1 ? `<div class="g2-tab">${a.map((v, x) => `<button class="${x === aktif ? "on" : ""}" data-x="${x}">Kotak ${x + 1}${v ? " ✓" : ""}</button>`).join("")}</div>` : ""}
      <div class="g2-rak-jawab">${kata ? [...kata].map((c) => c === " " ? `<span class="g2-balok spasi"></span>` : `<span class="g2-balok">${esc(c.toUpperCase())}<sub>${nilai(c) || ""}</sub></span>`).join("") : `<span class="g2-kosong">Ketuk balok huruf di bawah…</span>`}</div>
      <div class="g2-skor">⭐ Nilai balok: <b>${skor}</b> <small>(hanya hiasan — nilai ujian dari ustadz)</small></div>
      <div class="g2-rak">${(modeAngka ? G2_ANGKA : G2_BARIS).filter(Boolean).map((b) => `<div>${[...b].map((c) => `<button class="g2-balok" data-c="${esc(c)}">${esc(c)}<sub>${nilai(c) || ""}</sub></button>`).join("")}</div>`).join("")}
        <div><button class="g2-kunci" data-k="angka">${modeAngka ? "ABC" : "123"}</button><button class="g2-kunci lebar" data-k="spasi">spasi</button><button class="g2-kunci" data-k="hapus">⌫</button><button class="g2-kunci" data-k="bersih">✕</button></div></div>`;
  }
  function ketik(c, tombol) {
    const a = ambil(); a[aktif] = String(a[aktif] || "") + c; simpan(a);
    if (tombol) { const r = tombol.getBoundingClientRect(), t = document.createElement("span"); t.className = "g2-balok g2-terbang"; t.innerHTML = tombol.innerHTML; t.style.left = r.left + "px"; t.style.top = r.top + "px"; document.body.appendChild(t); requestAnimationFrame(() => { const tuju = isi.querySelector(".g2-rak-jawab").getBoundingClientRect(); t.style.transform = `translate(${tuju.left + tuju.width / 2 - r.left - 20}px,${tuju.top - r.top}px) scale(.8)`; t.style.opacity = "0"; }); setTimeout(() => t.remove(), 380); }
    gambar();
  }
  gambar();
  g2Dengar(isi, "click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    if (b.dataset.x) { aktif = +b.dataset.x; gambar(); return; }
    if (b.dataset.c) return ketik(b.dataset.c, b);
    const k = b.dataset.k, a = ambil();
    if (k === "angka") { modeAngka = !modeAngka; gambar(); }
    else if (k === "spasi") ketik(" ");
    else if (k === "hapus") { a[aktif] = String(a[aktif] || "").slice(0, -1); simpan(a); gambar(); }
    else if (k === "bersih") { a[aktif] = ""; simpan(a); gambar(); }
  });
  g2Dengar(document, "keydown", (e) => {
    if ((e.target && e.target.matches && e.target.matches("input,textarea,select")) || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === "Backspace") { e.preventDefault(); const a = ambil(); a[aktif] = String(a[aktif] || "").slice(0, -1); simpan(a); gambar(); }
    else if (e.key.length === 1 && /[\p{L}\p{N} .,'\-/:()]/u.test(e.key)) { e.preventDefault(); ketik(e.key); }
  }, true);
};

// ============================================================
//  4a. 🃏 KARTU PASANGAN (Menjodohkan)
// ============================================================
const G2_MAIN_KARTU = function (isi, s) {
  const ambil = () => { const a = (S.jawab.jodoh[s.no] || []).slice(); while (a.length < s.o.length) a.push(null); return a; };
  let kiri = null, kanan = null;
  function gambar() {
    const a = ambil();
    isi.innerHTML = `<p class="g2-tip" style="margin-top:0">Buka satu kartu <b style="color:#2563eb">pernyataan (biru)</b>, lalu satu kartu <b style="color:#ea580c">jawaban (jingga)</b> → keduanya jadi pasangan. Ketuk kartu biru yang sudah berpasangan untuk melepas.</p>
      <div class="g2-meja">
        <div class="g2-tumpuk">${s.urutanOpsi.map((asli, t) => { const p = a[asli]; return `<button class="g2-kartu biru ${p !== null || kiri === asli ? "buka" : ""} ${kiri === asli ? "pilih" : ""}" data-kiri="${asli}" style="${p !== null ? `--pw:${G2_WARNA[t % G2_WARNA.length]}` : ""}">
          <span class="depan">${t + 1}</span><span class="belakang"><i>${t + 1}</i><span dir="auto">${fmt(s.o[asli])}</span>${p !== null ? `<em>↔ ${HURUF[p]}</em>` : ""}</span></button>`; }).join("")}</div>
        <div class="g2-tumpuk">${(s.p || []).map((p, x) => { const dipakai = a.filter((v) => v === x).length; return `<button class="g2-kartu jingga ${dipakai || kanan === x || kiri !== null ? "buka" : ""}" data-kanan="${x}" style="${dipakai ? `--pw:${G2_WARNA[s.urutanOpsi.findIndex((asli) => a[asli] === x) % G2_WARNA.length]}` : ""}">
          <span class="depan">${HURUF[x]}</span><span class="belakang"><i>${HURUF[x]}</i><span dir="auto">${fmt(p)}</span>${dipakai ? `<em>✓ ${dipakai}×</em>` : ""}</span></button>`; }).join("")}</div>
      </div>`;
  }
  gambar();
  g2Dengar(isi, "click", (e) => {
    const b = e.target.closest(".g2-kartu"); if (!b) return;
    const a = ambil();
    if (b.dataset.kiri !== undefined) {
      const k = +b.dataset.kiri;
      if (a[k] !== null && kiri !== k) { a[k] = null; S.jawab.jodoh[s.no] = a; if (!adaIsi(a)) delete S.jawab.jodoh[s.no]; berubah(); kiri = null; gambar(); return; }
      kiri = kiri === k ? null : k; gambar(); return;
    }
    if (kiri === null) { b.classList.add("goyang"); setTimeout(() => b.classList.remove("goyang"), 400); return; }
    const x = +b.dataset.kanan; a[kiri] = x; S.jawab.jodoh[s.no] = a; berubah();
    const el = isi.querySelector(`[data-kiri="${kiri}"]`); kiri = null; gambar();
    const baru = isi.querySelector(`[data-kanan="${x}"]`); if (baru) g2Konfeti(baru);
    if (s.o.every((_, i) => ambil()[i] !== null)) g2Sorak("🃏 Semua kartu berpasangan!");
  });
};

// ============================================================
//  4b. 🔗 TARIK GARIS (Menjodohkan)
// ============================================================
const G2_MAIN_GARIS = function (isi, s) {
  const ambil = () => { const a = (S.jawab.jodoh[s.no] || []).slice(); while (a.length < s.o.length) a.push(null); return a; };
  isi.innerHTML = `<p class="g2-tip" style="margin-top:0">Tarik garis dari titik pernyataan ke titik jawaban (atau ketuk kiri lalu ketuk kanan). Ketuk pernyataan yang sudah tersambung untuk menghapus garisnya.</p>
    <div class="g2-garis-wadah"><svg class="g2-svg"></svg>
      <div class="kol kiri">${s.urutanOpsi.map((asli, t) => `<div class="g2-simpul" data-kiri="${asli}" style="--w:${G2_WARNA[t % G2_WARNA.length]}"><span class="no">${t + 1}</span><span dir="auto">${fmt(s.o[asli])}</span><i class="titik"></i></div>`).join("")}</div>
      <div class="kol kanan">${(s.p || []).map((p, x) => `<div class="g2-simpul" data-kanan="${x}"><i class="titik"></i><span class="no">${HURUF[x]}</span><span dir="auto">${fmt(p)}</span></div>`).join("")}</div></div>`;
  const wadah = isi.querySelector(".g2-garis-wadah"), svg = isi.querySelector(".g2-svg");
  let tarik = null, pilihKiri = null;
  const titik = (el) => { const r = el.querySelector(".titik").getBoundingClientRect(), w = wadah.getBoundingClientRect(); return [r.left + r.width / 2 - w.left, r.top + r.height / 2 - w.top]; };
  const lengkung = (a, b) => { const dx = Math.max(40, Math.abs(b[0] - a[0]) / 2); return `M${a[0]},${a[1]} C${a[0] + dx},${a[1]} ${b[0] - dx},${b[1]} ${b[0]},${b[1]}`; };
  function gambar() {
    const a = ambil(), w = wadah.getBoundingClientRect();
    svg.setAttribute("viewBox", `0 0 ${w.width} ${w.height}`); svg.setAttribute("width", w.width); svg.setAttribute("height", w.height);
    let h = "";
    s.urutanOpsi.forEach((asli, t) => {
      const el = wadah.querySelector(`[data-kiri="${asli}"]`); el.classList.toggle("tersambung", a[asli] !== null); el.classList.toggle("pilih", pilihKiri === asli);
      if (a[asli] === null) return;
      const k = wadah.querySelector(`[data-kanan="${a[asli]}"]`); if (!k) return;
      h += `<path d="${lengkung(titik(el), titik(k))}" stroke="${G2_WARNA[t % G2_WARNA.length]}" class="g2-tali"/>`;
    });
    wadah.querySelectorAll("[data-kanan]").forEach((el) => el.classList.toggle("tersambung", a.includes(+el.dataset.kanan)));
    if (tarik) h += `<path d="${lengkung(tarik.dari, tarik.ke)}" stroke="${tarik.warna}" class="g2-tali tarik"/>`;
    svg.innerHTML = h;
  }
  const sambung = (kiri, kanan) => { const a = ambil(); a[kiri] = kanan; S.jawab.jodoh[s.no] = a; berubah(); pilihKiri = null; gambar(); const el = wadah.querySelector(`[data-kanan="${kanan}"]`); if (el) { el.classList.add("denyut"); setTimeout(() => el.classList.remove("denyut"), 500); } };
  const lepas = (kiri) => { const a = ambil(); a[kiri] = null; S.jawab.jodoh[s.no] = a; if (!adaIsi(a)) delete S.jawab.jodoh[s.no]; berubah(); gambar(); };
  g2Dengar(wadah, "pointerdown", (e) => {
    const el = e.target.closest("[data-kiri]"); if (!el) return;
    const kiri = +el.dataset.kiri, t = s.urutanOpsi.indexOf(kiri);
    tarik = { kiri, dari: titik(el), ke: titik(el), warna: G2_WARNA[t % G2_WARNA.length], gerak: false, x0: e.clientX, y0: e.clientY };
    wadah.setPointerCapture(e.pointerId);
  });
  g2Dengar(wadah, "pointermove", (e) => {
    if (!tarik) return; const w = wadah.getBoundingClientRect();
    if (Math.hypot(e.clientX - tarik.x0, e.clientY - tarik.y0) > 8) tarik.gerak = true;
    tarik.ke = [e.clientX - w.left, e.clientY - w.top];
    if (tarik.gerak) { e.preventDefault(); cancelAnimationFrame(G2.raf); G2.raf = requestAnimationFrame(gambar); }
  });
  g2Dengar(wadah, "pointerup", (e) => {
    const t = tarik; tarik = null; if (!t) { const k = e.target.closest("[data-kanan]"); if (k && pilihKiri !== null) sambung(pilihKiri, +k.dataset.kanan); return; }
    if (t.gerak) {
      const target = document.elementFromPoint(e.clientX, e.clientY), k = target && target.closest("[data-kanan]");
      if (k) return sambung(t.kiri, +k.dataset.kanan);
      gambar(); return;
    }
    // ketukan (bukan tarikan)
    if (ambil()[t.kiri] !== null) { lepas(t.kiri); pilihKiri = null; return; }
    pilihKiri = pilihKiri === t.kiri ? null : t.kiri; gambar();
  });
  g2Dengar(window, "resize", gambar);
  requestAnimationFrame(gambar); setTimeout(gambar, 300);
};

// ============================================================
//  5. 🚂 GERBONG KERETA (Mengurutkan)
// ============================================================
const G2_MAIN_KERETA = function (isi, s) {
  const ambil = () => (S.jawab.urut[s.no] || []).slice();
  function gambar(gerakDari) {
    const a = ambil(), sisa = (s.o || []).map((_, x) => x).filter((x) => !a.includes(x)), penuh = !sisa.length && a.length;
    isi.innerHTML = `<p class="g2-tip" style="margin-top:0">Ketuk gerbong di stasiun untuk disambung ke kereta <b>sesuai urutan yang benar</b>. Ketuk gerbong di kereta untuk melepasnya.</p>
      <div class="g2-rel ${penuh ? "jalan" : ""}"><div class="g2-kereta"><span class="g2-lok">🚂${penuh ? '<i class="asap">💨</i>' : ""}</span>${a.map((x, pos) => `<button class="g2-gerbong" data-pos="${pos}" data-x="${x}" style="--w:${G2_WARNA[x % G2_WARNA.length]}"><i>${pos + 1}</i><span dir="auto">${fmt(s.o[x])}</span></button>`).join("")}${!penuh ? `<span class="g2-gerbong kosong">${a.length + 1}</span>` : ""}</div><div class="g2-lintasan"></div></div>
      ${penuh ? `<div class="g2-siap">🎉 Kereta siap berangkat! Periksa urutannya, lalu lanjut.</div>` : ""}
      <div class="g2-stasiun"><span class="lbl">🏠 Stasiun</span>${sisa.map((x) => `<button class="g2-gerbong" data-x="${x}" style="--w:${G2_WARNA[x % G2_WARNA.length]}"><span dir="auto">${fmt(s.o[x])}</span></button>`).join("") || `<small>Semua gerbong sudah tersambung 👍</small>`}</div>
      ${a.length ? `<button class="g2-ulang">↺ Lepas semua gerbong</button>` : ""}`;
    // animasi FLIP: gerbong meluncur dari posisi lamanya
    if (gerakDari) { const el = isi.querySelector(`.g2-gerbong[data-x="${gerakDari.x}"]`); if (el) { const r = el.getBoundingClientRect(); el.style.transform = `translate(${gerakDari.r.left - r.left}px,${gerakDari.r.top - r.top}px)`; el.style.transition = "none"; requestAnimationFrame(() => { el.style.transition = ""; el.style.transform = ""; }); } }
  }
  gambar();
  g2Dengar(isi, "click", (e) => {
    if (e.target.closest(".g2-ulang")) { delete S.jawab.urut[s.no]; berubah(); gambar(); return; }
    const b = e.target.closest(".g2-gerbong[data-x]"); if (!b) return;
    const x = +b.dataset.x, a = ambil(), r = b.getBoundingClientRect();
    if (b.dataset.pos !== undefined) { a.splice(+b.dataset.pos, 1); }
    else { a.push(x); }
    if (a.length) S.jawab.urut[s.no] = a; else delete S.jawab.urut[s.no];
    berubah(); gambar({ x, r });
    if (a.length === (s.o || []).length) g2Sorak("🚂 Tuut tuut!");
  });
};

// ============================================================
//  6. 🌳 POHON ILMU & 📜 SURAT PERKAMEN (Uraian)
//  Kotak tulis asli (#uraian) dipindah ke dalam adegan game → simpan otomatis & keyboard Arab tetap jalan.
//  Game tidak menilai isi: pohon tumbuh mengikuti panjang tulisan (semakin lengkap semakin rimbun).
// ============================================================
function g2AmbilTulis(isi) {
  const kartu = isi.closest(".kartu-soal"), ta = kartu && kartu.querySelector("textarea#uraian");
  const kb = kartu && kartu.querySelector(":scope > .kb-saklar");
  return { ta, kb };
}
const g2HitungKata = (t) => (String(t || "").trim() ? String(t).trim().split(/\s+/).length : 0);
const G2_MAIN_POHON = function (isi, s) {
  const { ta, kb } = g2AmbilTulis(isi); if (!ta) throw new Error("tanpa kotak uraian");
  const buah = Array.from({ length: 9 }, (_, i) => { const a = (i / 9) * Math.PI * 2, r = 30 + (i % 3) * 10; return [100 + Math.cos(a) * r, 78 + Math.sin(a) * r * 0.7]; });
  isi.innerHTML = `<div class="g2-pohon"><svg viewBox="0 0 200 170" class="g2-pohon-svg">
      <circle cx="172" cy="26" r="14" fill="#fde047"/><g class="awan"><ellipse cx="40" cy="28" rx="20" ry="8" fill="#fff"/><ellipse cx="52" cy="24" rx="12" ry="8" fill="#fff"/></g>
      <rect x="0" y="146" width="200" height="24" fill="#65a30d"/><ellipse cx="100" cy="148" rx="34" ry="6" fill="#4d7c0f"/>
      <text class="biji" x="100" y="146" font-size="16" text-anchor="middle">🌰</text>
      <g class="batang"><rect x="94" y="96" width="12" height="52" rx="4" fill="#92400e"/><path d="M100 118 L78 100 M100 110 L122 92" stroke="#92400e" stroke-width="5" stroke-linecap="round"/></g>
      <g class="daun"><circle cx="100" cy="74" r="40" fill="#16a34a"/><circle cx="70" cy="88" r="26" fill="#22c55e"/><circle cx="130" cy="88" r="26" fill="#22c55e"/><circle cx="100" cy="52" r="26" fill="#4ade80"/></g>
      <g class="buah">${buah.map(([x, y], i) => `<text x="${x}" y="${y}" font-size="11" text-anchor="middle" style="--i:${i}">🍎</text>`).join("")}</g>
      <text class="burung" x="150" y="60" font-size="14">🐦</text>
    </svg><div class="g2-pohon-tahap"></div></div>
    <div class="g2-pohon-tulis"></div>
    <p class="g2-tip">Tulis jawabanmu selengkap mungkin — setiap kata membuat pohonmu tumbuh. Jawaban tersimpan otomatis dan dinilai ustadz.</p>`;
  const tempat = isi.querySelector(".g2-pohon-tulis"); tempat.appendChild(ta); if (kb) tempat.appendChild(kb);
  ta.placeholder = "✍️ Tulis jawabanmu di sini… pohonmu akan tumbuh";
  const svg = isi.querySelector(".g2-pohon-svg"), tahap = isi.querySelector(".g2-pohon-tahap");
  let lalu = -1;
  const perbarui = () => {
    const n = g2HitungKata(ta.value), p = Math.min(1, n / 80);
    svg.style.setProperty("--tumbuh", p.toFixed(3));
    svg.classList.toggle("bertunas", n > 0); svg.classList.toggle("berbuah", n >= 50); svg.classList.toggle("burung-datang", n >= 80);
    const [ikon, teks] = n === 0 ? ["🌰", "Benih siap ditanam"] : n < 10 ? ["🌱", "Tunas mulai tumbuh"] : n < 25 ? ["🌿", "Tanaman muda"] : n < 50 ? ["🌳", "Pohon mulai rimbun"] : n < 80 ? ["🍎", "Pohonmu berbuah!"] : ["🐦", "Pohon ilmu yang rindang!"];
    tahap.innerHTML = `<b>${ikon} ${teks}</b><span>${n} kata</span>`;
    if (lalu >= 0 && Math.floor(n / 25) > Math.floor(lalu / 25)) { tahap.classList.remove("naik"); void tahap.offsetWidth; tahap.classList.add("naik"); }
    lalu = n;
  };
  g2Dengar(ta, "input", perbarui); perbarui();
};
const G2_MAIN_PERKAMEN = function (isi, s) {
  const { ta, kb } = g2AmbilTulis(isi); if (!ta) throw new Error("tanpa kotak uraian");
  isi.innerHTML = `<div class="g2-perkamen"><div class="gulung gul-a"></div><div class="kertas"><span class="pena">🪶</span><div class="g2-perkamen-tulis"></div><div class="tinta"></div></div><div class="gulung gul-b"></div></div>
    <div class="g2-segel-baris"><span class="g2-perkamen-hitung"></span><button class="g2-segel" type="button">🔴 Segel Surat</button></div>
    <p class="g2-tip">Tulis jawabanmu seperti menulis surat. Tekan <b>Segel Surat</b> bila sudah selesai (masih bisa dibuka & diubah sebelum dikirim).</p>`;
  const tempat = isi.querySelector(".g2-perkamen-tulis"); tempat.appendChild(ta); if (kb) isi.querySelector(".g2-segel-baris").after(kb);
  ta.placeholder = "Bismillah… tulis jawabanmu di sini";
  const kertas = isi.querySelector(".kertas"), hitung = isi.querySelector(".g2-perkamen-hitung"), segel = isi.querySelector(".g2-segel");
  let t = 0;
  const perbarui = () => {
    const n = g2HitungKata(ta.value); hitung.textContent = `✒️ ${n} kata`;
    kertas.classList.add("menulis"); clearTimeout(t); t = setTimeout(() => kertas.classList.remove("menulis"), 700);
    kertas.classList.remove("tersegel"); segel.textContent = "🔴 Segel Surat";
  };
  const kunciSegel = s.jenis + "-" + s.no; G2.segel = G2.segel || {};
  g2Dengar(ta, "input", perbarui); perbarui(); kertas.classList.remove("menulis");
  if (G2.segel[kunciSegel] === ta.value && ta.value) { kertas.classList.add("tersegel"); segel.textContent = "✅ Tersegel"; }
  g2Dengar(segel, "click", () => {
    if (!g2HitungKata(ta.value)) { ta.focus(); return; }
    kertas.classList.add("tersegel"); segel.textContent = "✅ Tersegel"; G2.segel[kunciSegel] = ta.value;
    const cap = document.createElement("span"); cap.className = "g2-cap"; cap.textContent = "🔴"; kertas.appendChild(cap); setTimeout(() => cap.remove(), 900);
    if (typeof g3Aktif === "function" && g3Aktif()) setTimeout(() => g3Kunci(), 700); else g2Lanjut(1100);
  });
};

const G2_MAIN = { pohon: G2_MAIN_POHON, perkamen: G2_MAIN_PERKAMEN, labirin: G2_MAIN_LABIRIN, kolam: G2_MAIN_KOLAM, balok: G2_MAIN_BALOK, kartu: G2_MAIN_KARTU, garis: G2_MAIN_GARIS, kereta: G2_MAIN_KERETA };

// ── Uji coba guru: pilih game di layar petunjuk untuk mencoba semuanya ──
(function () {
  const asli = window.tampilPetunjuk; if (typeof asli !== "function") return;
  window.tampilPetunjuk = function () {
    const h = asli.apply(this, arguments);
    const per = g2Per(), jenisAda = [...new Set((S.soal || []).map((x) => x.jenis))].filter((j) => G2_NAMA[j]);
    const kartu = document.querySelector("#akar .kartu"); if (!kartu || !jenisAda.length) return h;
    if (S.coba) {
      S.gameCoba = S.gameCoba || {};
      kartu.insertAdjacentHTML("beforeend", `<div class="g2-pilih-coba"><b>🎮 Coba game per jenis soal</b>${jenisAda.map((j) => `<label>${LABEL[j]}<select data-j="${j}"><option value="">Biasa</option>${Object.entries(G2_NAMA[j]).map(([k, [i, n]]) => `<option value="${k}" ${S.gameCoba[j] === k ? "selected" : ""}>${i} ${n}</option>`).join("")}</select></label>`).join("")}</div>`);
      kartu.querySelectorAll(".g2-pilih-coba select").forEach((el) => el.addEventListener("change", () => { S.gameCoba[el.dataset.j] = el.value || undefined; }));
    } else if (Object.keys(per).length) {
      kartu.insertAdjacentHTML("beforeend", `<div class="g2-pilih-coba"><b>🎮 Game di ujian ini</b>${jenisAda.filter((j) => per[j] && G2_NAMA[j][per[j]]).map((j) => `<span>${G2_NAMA[j][per[j]][0]} ${LABEL[j]}: <b>${G2_NAMA[j][per[j]][1]}</b></span>`).join("")}</div>`);
    }
    return h;
  };
  // uji coba dibuka sebelum skrip ini termuat → gambar ulang layar petunjuk supaya pilihan game muncul
  if (typeof S !== "undefined" && S.coba && !document.querySelector(".kartu-soal") && !document.querySelector(".g2-pilih-coba")) window.tampilPetunjuk({});
})();

// ── Gaya ──
(function () {
  const css = `
  .g2-aktif>.hitung-kata,.g2-aktif>.petunjuk,.g2-aktif>.pg,.g2-aktif>.pgk,.g2-aktif>.isian-satu,.g2-aktif>.kb-saklar,.g2-aktif>.jodoh-kanan,.g2-aktif>.jodoh-baris,.g2-aktif>.urut-hasil,.g2-aktif>.urut-pilih,.g2-aktif>.urut-ulang{display:none!important}
  .g2-wadah{margin-top:12px;border-radius:18px;overflow:hidden;border:1.5px solid rgba(0,0,0,.06);background:#fff}
  .g2-judul{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:8px 12px;font-weight:800;font-size:13.5px;color:#fff;background:linear-gradient(135deg,#0f766e,#2563eb)}
  .g2w-labirin .g2-judul{background:linear-gradient(135deg,#15803d,#65a30d)}.g2w-kolam .g2-judul{background:linear-gradient(135deg,#0369a1,#06b6d4)}
  .g2w-balok .g2-judul{background:linear-gradient(135deg,#92400e,#d97706)}.g2w-kartu .g2-judul{background:linear-gradient(135deg,#1d4ed8,#ea580c)}
  .g2w-garis .g2-judul{background:linear-gradient(135deg,#7c3aed,#db2777)}.g2w-kereta .g2-judul{background:linear-gradient(135deg,#b91c1c,#f59e0b)}
  .g2-biasa{border:0;background:rgba(255,255,255,.22);color:#fff;font-weight:700;font-size:11.5px;border-radius:99px;padding:4px 10px;cursor:pointer}
  .g2-isi{padding:10px}
  .g2-saklar{margin-top:12px;border:1.5px dashed #94a3b8;background:#f8fafc;border-radius:12px;padding:8px 12px;font-weight:700;width:100%;cursor:pointer}
  .g2-tip{font-size:12px;color:#64748b;line-height:1.5;margin:8px 0 0}
  .g2-rumpang{display:inline-block;min-width:44px;padding:0 8px;margin:0 3px;border-bottom:3px solid #d97706;font-weight:800;color:#92400e;text-align:center}
  .g2-sorak{position:fixed;left:50%;top:38%;transform:translate(-50%,-50%);z-index:80;background:#fff;border-radius:18px;padding:12px 18px;font-weight:800;font-size:18px;box-shadow:0 16px 40px rgba(0,0,0,.25);animation:g2-muncul 1.3s ease forwards;pointer-events:none;white-space:nowrap}
  @keyframes g2-muncul{0%{opacity:0;transform:translate(-50%,-30%) scale(.7)}15%{opacity:1;transform:translate(-50%,-50%) scale(1.05)}80%{opacity:1}100%{opacity:0;transform:translate(-50%,-70%)}}
  .g2-konfeti{position:fixed;width:8px;height:12px;border-radius:2px;z-index:90;pointer-events:none;animation:g2-konfeti 1.1s cubic-bezier(.2,.7,.4,1) forwards}
  @keyframes g2-konfeti{to{transform:translate(var(--dx),calc(var(--dy) + 260px)) rotate(var(--r));opacity:0}}
  /* labirin */
  .g2-lab-hud{display:flex;gap:8px;align-items:center;flex-wrap:wrap;font-size:12.5px;font-weight:700;margin-bottom:8px}
  .g2-lab-hud span{background:#f1f5f9;border-radius:99px;padding:4px 10px}
  #g2-lab-waktu{background:#dcfce7;color:#166534;font-variant-numeric:tabular-nums}#g2-lab-waktu.kritis{background:#fee2e2;color:#b91c1c;animation:g2-kedip .6s infinite}
  #g2-lab-tangkap:empty{display:none}
  #g2-lab-ket{flex:1;min-width:150px;background:none!important;color:#475569;font-weight:600}
  @keyframes g2-kedip{50%{opacity:.5}}
  .g2-lab-panggung{position:relative;display:flex;justify-content:center;touch-action:none}
  #g2-lab{border-radius:14px;box-shadow:0 8px 24px rgba(21,128,61,.3);touch-action:none;display:block}
  #g2-lab.goyang{animation:g2-goyang .45s}
  @keyframes g2-goyang{20%{transform:translateX(-8px)}40%{transform:translateX(7px)}60%{transform:translateX(-5px)}80%{transform:translateX(3px)}}
  .g2-lab-pesan{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) scale(.8);background:rgba(15,23,42,.82);color:#fff;font-weight:800;font-size:14px;padding:10px 16px;border-radius:14px;opacity:0;transition:.25s;pointer-events:none;text-align:center;max-width:85%}
  .g2-lab-pesan.on{opacity:1;transform:translate(-50%,-50%) scale(1)}
  .g2-dpad{display:grid;grid-template-columns:repeat(3,56px);grid-template-rows:repeat(2,46px);gap:6px;justify-content:center;margin:10px auto 4px}
  .g2-dpad button{border:0;border-radius:14px;background:linear-gradient(180deg,#22c55e,#15803d);color:#fff;font-size:18px;box-shadow:0 4px 0 #14532d;touch-action:none;user-select:none;-webkit-user-select:none}
  .g2-dpad button:active{transform:translateY(3px);box-shadow:0 1px 0 #14532d}
  .g2-dpad [data-d="0,-1"]{grid-column:2}.g2-dpad [data-d="-1,0"]{grid-column:1;grid-row:2}.g2-dpad [data-d="1,0"]{grid-column:3;grid-row:2}.g2-dpad [data-d="0,1"]{grid-column:2;grid-row:2}
  .g2-lab-opsi{display:grid;gap:6px;margin-top:10px}
  .g2-lab-opsi>div{display:flex;gap:10px;align-items:flex-start;border:2px solid #e2e8f0;border-radius:12px;padding:8px 10px;font-size:14px;cursor:pointer;transition:.15s}
  .g2-lab-opsi>div b{flex:none;width:28px;height:28px;border-radius:50%;background:var(--w);color:#fff;display:grid;place-items:center;font-size:13px}
  .g2-lab-opsi>div.on{border-color:var(--w);background:color-mix(in srgb,var(--w) 10%,#fff);box-shadow:0 0 0 3px color-mix(in srgb,var(--w) 25%,transparent)}
  /* kolam */
  .g2-kolam{position:relative;height:calc(var(--n,4) * 62px + 30px);min-height:260px;margin-top:8px;border-radius:16px;overflow:hidden;background:linear-gradient(180deg,#7dd3fc 0%,#0ea5e9 45%,#0369a1 100%);box-shadow:inset 0 8px 0 rgba(255,255,255,.25)}
  .g2-ikan{position:absolute;left:0;top:calc(14px + var(--lajur) * 62px);border:0;background:none;padding:0;cursor:pointer;animation:g2-renang calc(var(--dur) * 2) ease-in-out infinite;animation-delay:var(--tunda);will-change:transform}
  .g2-ikan .badan{display:flex;align-items:center;gap:6px;max-width:210px;background:rgba(255,255,255,.92);border:2.5px solid var(--w);border-radius:999px;padding:5px 12px 5px 6px;box-shadow:0 6px 14px rgba(0,0,0,.2);font-size:12.5px;font-weight:700;color:#0f172a;text-align:left}
  .g2-ikan .e{font-size:26px;display:inline-block;animation:g2-sirip calc(var(--dur) * 2) step-end infinite;animation-delay:var(--tunda)}
  .g2-ikan b{flex:none;width:22px;height:22px;border-radius:50%;background:var(--w);color:#fff;display:grid;place-items:center;font-size:11px}
  .g2-ikan .t{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;line-height:1.3}
  .g2-ikan.ditangkap .badan{opacity:.35;border-style:dashed}
  .g2-ikan:active .badan{transform:scale(.95)}
  @keyframes g2-renang{0%{transform:translateX(6px)}50%{transform:translateX(var(--jauh,200px))}100%{transform:translateX(6px)}}
  @keyframes g2-sirip{0%{transform:scaleX(-1)}50%{transform:scaleX(1)}100%{transform:scaleX(1)}}
  .g2-jaring{position:absolute;left:50%;top:-10px;font-size:34px;animation:g2-jaring .6s ease forwards;pointer-events:none}
  @keyframes g2-jaring{0%{transform:translate(-50%,-30px) scale(.4);opacity:0}50%{transform:translate(-50%,0) scale(1.2);opacity:1}100%{transform:translate(-50%,10px) scale(.6);opacity:0}}
  .g2-gelembung i{position:absolute;bottom:-12px;width:10px;height:10px;border-radius:50%;border:1.5px solid rgba(255,255,255,.7);animation:g2-gelembung 6s linear infinite}
  @keyframes g2-gelembung{to{transform:translateY(-480px);opacity:0}}
  .g2-ember{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:8px;padding:8px 10px;border-radius:14px;background:#f1f5f9;border:2px dashed #94a3b8}
  .g2-ember .lbl{font-weight:800;font-size:13px}.g2-ember .isi{display:flex;flex-wrap:wrap;gap:6px}
  .g2-ember button{border:2px solid var(--w);background:#fff;border-radius:99px;padding:3px 10px;font-size:13px;font-weight:700;animation:g2-masuk .35s ease}
  .g2-ember small{color:#94a3b8}
  @keyframes g2-masuk{from{transform:translateY(-14px) scale(.6);opacity:0}}
  /* balok huruf */
  .g2-tab{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px}.g2-tab button{border:1.5px solid #e2e8f0;background:#fff;border-radius:99px;padding:5px 12px;font-weight:700;font-size:12.5px}.g2-tab button.on{background:#92400e;color:#fff;border-color:#92400e}
  .g2-balok{position:relative;display:inline-grid;place-items:center;width:38px;height:42px;border:0;border-radius:8px;font:800 19px/1 system-ui,Arial;color:#422006;background:linear-gradient(180deg,#fde68a,#f59e0b);box-shadow:0 4px 0 #92400e,inset 0 2px 0 rgba(255,255,255,.6);margin:3px 2px;cursor:pointer;transition:transform .1s}
  .g2-balok sub{position:absolute;right:4px;bottom:3px;font-size:9.5px;font-weight:800;color:#78350f}
  .g2-balok:active{transform:translateY(3px);box-shadow:0 1px 0 #92400e}
  .g2-balok.spasi{background:transparent;box-shadow:none;width:16px}
  .g2-rak-jawab{min-height:58px;display:flex;flex-wrap:wrap;align-items:center;justify-content:center;padding:8px;border-radius:14px;background:repeating-linear-gradient(90deg,#78350f 0 2px,#92400e 2px 26px);box-shadow:inset 0 -6px 0 rgba(0,0,0,.25)}
  .g2-rak-jawab .g2-balok{animation:g2-taruh .25s ease}
  @keyframes g2-taruh{from{transform:translateY(-16px) scale(1.2)}}
  .g2-kosong{color:#fde68a;font-weight:700;font-size:13px}
  .g2-skor{text-align:center;font-size:12.5px;margin:6px 0;color:#92400e}.g2-skor small{color:#94a3b8}
  .g2-rak{background:#fff7ed;border-radius:14px;padding:6px 2px;text-align:center}.g2-rak>div{display:flex;justify-content:center;flex-wrap:nowrap}
  .g2-rak .g2-balok{width:min(9vw,40px);height:min(10.5vw,44px);font-size:min(4.6vw,19px)}
  .g2-kunci{border:0;border-radius:10px;background:#78350f;color:#fff;font-weight:800;padding:9px 12px;margin:6px 3px 2px;min-width:48px}
  .g2-kunci.lebar{flex:1;max-width:180px}
  .g2-terbang{position:fixed;z-index:90;margin:0;pointer-events:none;transition:transform .35s cubic-bezier(.3,.8,.4,1),opacity .35s}
  /* kartu pasangan */
  .g2-meja{display:grid;grid-template-columns:1fr 1fr;gap:10px}
  .g2-tumpuk{display:grid;gap:8px;align-content:start}
  .g2-kartu{position:relative;min-height:74px;border:0;padding:0;background:none;perspective:700px;cursor:pointer}
  .g2-kartu .depan,.g2-kartu .belakang{position:absolute;inset:0;border-radius:14px;backface-visibility:hidden;-webkit-backface-visibility:hidden;transition:transform .45s cubic-bezier(.3,.8,.3,1)}
  .g2-kartu .depan{display:grid;place-items:center;font-size:24px;font-weight:900;color:#fff;box-shadow:0 5px 0 rgba(0,0,0,.18)}
  .g2-kartu.biru .depan{background:repeating-linear-gradient(45deg,#2563eb 0 10px,#1d4ed8 10px 20px)}
  .g2-kartu.jingga .depan{background:repeating-linear-gradient(45deg,#f97316 0 10px,#ea580c 10px 20px)}
  .g2-kartu .belakang{transform:rotateY(180deg);background:#fff;border:2.5px solid #cbd5e1;padding:8px 10px;text-align:left;font-size:12.5px;line-height:1.35;overflow:auto;display:block;position:relative;min-height:74px}
  .g2-kartu .belakang i{font-style:normal;font-weight:900;margin-right:4px}
  .g2-kartu .belakang em{display:block;font-style:normal;font-weight:800;font-size:11px;margin-top:4px;color:var(--pw,#64748b)}
  .g2-kartu.buka .depan{transform:rotateY(-180deg)}.g2-kartu.buka .belakang{transform:rotateY(0)}
  .g2-kartu .belakang{position:relative;inset:auto}.g2-kartu .depan{z-index:1}
  .g2-kartu.buka[style*="--pw"] .belakang{border-color:var(--pw);box-shadow:0 0 0 3px color-mix(in srgb,var(--pw) 25%,transparent)}
  .g2-kartu.pilih .belakang{border-color:#2563eb;box-shadow:0 0 0 4px rgba(37,99,235,.3)}
  .g2-kartu.goyang{animation:g2-goyang .4s}
  /* tarik garis */
  .g2-garis-wadah{position:relative;display:grid;grid-template-columns:1fr 1fr;gap:12px 46px;margin-top:8px;touch-action:none;user-select:none;-webkit-user-select:none}
  .g2-svg{position:absolute;left:0;top:0;pointer-events:none;overflow:visible;z-index:2}
  .g2-tali{fill:none;stroke-width:4;stroke-linecap:round;filter:drop-shadow(0 2px 2px rgba(0,0,0,.2))}.g2-tali.tarik{stroke-dasharray:8 6;animation:g2-semut .5s linear infinite}
  @keyframes g2-semut{to{stroke-dashoffset:-14}}
  .g2-garis-wadah .kol{display:grid;gap:8px;align-content:start}
  .g2-simpul{position:relative;display:flex;align-items:center;gap:6px;border:2px solid #e2e8f0;background:#fff;border-radius:12px;padding:8px 10px;font-size:12.5px;line-height:1.35;cursor:pointer;transition:.15s}
  .g2-simpul .no{flex:none;width:22px;height:22px;border-radius:50%;background:#e2e8f0;display:grid;place-items:center;font-weight:800;font-size:11px}
  .kiri .g2-simpul .no{background:var(--w);color:#fff}
  .g2-simpul .titik{position:absolute;top:50%;width:14px;height:14px;border-radius:50%;background:#fff;border:3px solid #94a3b8;transform:translateY(-50%);z-index:3}
  .kiri .titik{right:-8px}.kanan .titik{left:-8px}
  .g2-simpul.tersambung{border-color:#a5b4fc;background:#eef2ff}.kiri .g2-simpul.tersambung .titik{border-color:var(--w);background:var(--w)}
  .kanan .g2-simpul.tersambung .titik{border-color:#6366f1;background:#6366f1}
  .g2-simpul.pilih{border-color:#7c3aed;box-shadow:0 0 0 3px rgba(124,58,237,.25)}
  .g2-simpul.denyut{animation:g2-denyut .5s}
  @keyframes g2-denyut{50%{transform:scale(1.05)}}
  /* kereta */
  .g2-rel{position:relative;margin-top:8px;padding:10px 6px 18px;border-radius:14px;background:linear-gradient(180deg,#e0f2fe,#f0f9ff);overflow:hidden}
  .g2-kereta{display:flex;flex-wrap:wrap;gap:12px 6px;align-items:flex-end}
  .g2-lok{font-size:44px;line-height:1;position:relative}
  .g2-lok .asap{position:absolute;left:-6px;top:-18px;font-size:22px;font-style:normal;animation:g2-asap 1s infinite}
  @keyframes g2-asap{to{transform:translate(-10px,-14px) scale(1.4);opacity:0}}
  .g2-gerbong{position:relative;display:flex;align-items:center;gap:6px;max-width:190px;min-height:44px;border:0;border-radius:10px 10px 6px 6px;padding:6px 10px 10px;background:var(--w);color:#fff;font-size:12px;font-weight:700;line-height:1.3;text-align:left;box-shadow:0 4px 0 rgba(0,0,0,.25);cursor:pointer;transition:transform .35s cubic-bezier(.3,.8,.3,1)}
  .g2-gerbong::before,.g2-gerbong::after{content:"";position:absolute;bottom:-7px;width:12px;height:12px;border-radius:50%;background:#334155;border:2px solid #94a3b8}
  .g2-gerbong::before{left:12px}.g2-gerbong::after{right:12px}
  .g2-gerbong i{flex:none;width:22px;height:22px;border-radius:50%;background:rgba(255,255,255,.3);display:grid;place-items:center;font-style:normal;font-size:11px}
  .g2-gerbong.kosong{background:transparent;border:2.5px dashed #94a3b8;color:#94a3b8;box-shadow:none;min-width:64px;justify-content:center;cursor:default}
  .g2-gerbong.kosong::before,.g2-gerbong.kosong::after{display:none}
  .g2-lintasan{position:absolute;left:0;right:0;bottom:6px;height:5px;background:repeating-linear-gradient(90deg,#78350f 0 6px,transparent 6px 16px),#64748b}
  .g2-rel.jalan .g2-kereta{animation:g2-jalan 1.6s ease-in-out}
  @keyframes g2-jalan{30%{transform:translateX(18px)}60%{transform:translateX(-4px)}}
  .g2-siap{margin-top:8px;text-align:center;font-weight:800;color:#15803d;background:#dcfce7;border-radius:12px;padding:8px}
  .g2-stasiun{display:flex;flex-wrap:wrap;gap:14px 8px;align-items:flex-start;margin-top:10px;padding:10px 10px 16px;border-radius:14px;background:#fef9c3;border:2px dashed #eab308}
  .g2-stasiun .lbl{width:100%;font-weight:800;font-size:12.5px;color:#854d0e}.g2-stasiun small{color:#a16207}
  .g2-ulang{margin-top:8px;border:0;background:none;color:#64748b;font-weight:700;text-decoration:underline;cursor:pointer}

  /* pohon ilmu */
  .g2w-pohon .g2-judul{background:linear-gradient(135deg,#15803d,#84cc16)}.g2w-perkamen .g2-judul{background:linear-gradient(135deg,#78350f,#b45309)}
  .g2-pohon{position:relative;border-radius:16px;overflow:hidden;background:linear-gradient(180deg,#bae6fd,#e0f2fe 70%)}
  .g2-pohon-svg{display:block;width:100%;max-height:230px;--tumbuh:0}
  .g2-pohon-svg .awan{animation:g2-awan2 18s linear infinite}@keyframes g2-awan2{from{transform:translateX(-60px)}to{transform:translateX(220px)}}
  .g2-pohon-svg .batang{transform-origin:100px 148px;transform:scaleY(calc(.05 + var(--tumbuh) * .95));transition:transform 1s cubic-bezier(.3,1.4,.5,1);opacity:0}
  .g2-pohon-svg .daun{transform-origin:100px 100px;transform:scale(var(--tumbuh));transition:transform 1s cubic-bezier(.3,1.4,.5,1);opacity:0}
  .g2-pohon-svg.bertunas .batang,.g2-pohon-svg.bertunas .daun{opacity:1}.g2-pohon-svg.bertunas .biji{opacity:0}
  .g2-pohon-svg .biji{transition:opacity .4s}
  .g2-pohon-svg .buah text{opacity:0;transform:scale(0);transform-box:fill-box;transform-origin:center;transition:.5s calc(var(--i) * 80ms) cubic-bezier(.3,1.6,.5,1)}
  .g2-pohon-svg.berbuah .buah text{opacity:1;transform:scale(1)}
  .g2-pohon-svg .burung{opacity:0;transition:1s}.g2-pohon-svg.burung-datang .burung{opacity:1;animation:g2-kepak 1.2s ease-in-out infinite}
  @keyframes g2-kepak{50%{transform:translateY(-4px)}}
  .g2-pohon-tahap{position:absolute;left:8px;top:8px;display:flex;gap:6px;align-items:center;background:rgba(255,255,255,.9);border-radius:99px;padding:4px 10px;font-size:12px;box-shadow:0 4px 10px rgba(0,0,0,.1)}
  .g2-pohon-tahap span{color:#15803d;font-weight:800}.g2-pohon-tahap.naik{animation:g2-denyut .6s 2}
  .g2-pohon-tulis textarea,.g2-perkamen-tulis textarea{width:100%;min-height:150px;margin-top:10px}
  /* surat perkamen */
  .g2-perkamen{position:relative;margin-top:4px}
  .g2-perkamen .gulung{height:18px;border-radius:9px;background:linear-gradient(180deg,#a16207,#713f12 60%,#a16207);box-shadow:0 4px 8px rgba(0,0,0,.25);margin:0 -4px;position:relative;z-index:2}
  .g2-perkamen .kertas{position:relative;margin:-6px 6px;padding:18px 14px 14px;background:radial-gradient(circle at 20% 10%,#fff7e6,#fde9c4 60%,#f5d49a);box-shadow:inset 0 0 30px rgba(146,64,14,.25)}
  .g2-perkamen .kertas textarea{background:repeating-linear-gradient(180deg,transparent 0 27px,rgba(146,64,14,.22) 27px 28px);border:0;box-shadow:none;font-family:Georgia,"Times New Roman",Amiri,serif;font-size:16px;line-height:28px;color:#3b2106;padding:0 4px;min-height:200px;resize:vertical}
  .g2-perkamen .kertas textarea:focus{outline:none}
  .g2-perkamen .pena{position:absolute;right:8px;top:-4px;font-size:30px;transform:rotate(20deg);transition:.3s}
  .g2-perkamen .kertas.menulis .pena{animation:g2-pena .35s ease-in-out infinite alternate}
  @keyframes g2-pena{from{transform:rotate(10deg) translate(0,0)}to{transform:rotate(30deg) translate(-6px,4px)}}
  .g2-perkamen .kertas.tersegel::after{content:"🔴";position:absolute;right:16px;bottom:10px;font-size:38px;filter:drop-shadow(0 3px 2px rgba(0,0,0,.3))}
  .g2-cap{position:absolute;right:16px;bottom:10px;font-size:38px;animation:g2-cap .9s ease}
  @keyframes g2-cap{0%{transform:translateY(-80px) scale(2);opacity:0}60%{transform:none;opacity:1}75%{transform:scale(1.15)}}
  .g2-segel-baris{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:12px}
  .g2-perkamen-hitung{font-weight:800;color:#92400e;font-size:13px}
  .g2-segel{border:0;border-radius:99px;padding:9px 16px;font-weight:900;color:#fff;background:linear-gradient(135deg,#b91c1c,#7f1d1d);box-shadow:0 4px 0 #450a0a;cursor:pointer}
  /* pilihan game saat uji coba */
  .g2-pilih-coba{margin-top:12px;display:grid;gap:6px;border:1.5px dashed #0891b2;background:#ecfeff;border-radius:14px;padding:10px 12px;font-size:13px}
  .g2-pilih-coba label{display:flex;justify-content:space-between;align-items:center;gap:8px}
  .g2-pilih-coba select{border:1.5px solid #a5f3fc;border-radius:10px;padding:5px 8px;font:inherit}
  @media (prefers-reduced-motion:reduce){.g2-ikan{animation-duration:40s}}
  `;
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
})();

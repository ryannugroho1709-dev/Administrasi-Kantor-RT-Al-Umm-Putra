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
// Ustadz penunggu: peci putih, berjenggot, gamis putih, memegang kitab hijau
const G4_USTADZ = { rows: ["................", ".....pppppp.....", "....pPppppPp....", "....kkkkkkkk....", "....kkhkkhkk....", "....kkkkkkkk....", "....jkkmmkkj....", ".....jjjjjj.....", "....wwwjjwww....", "...kwwwwwwwwk...", "...kwwwggwwwk...", "....wwwggwww....", "....wWwwwwWw....", "....wWwwwwWw....", ".....ss..ss.....", "................"],
  w: { p: "#ffffff", P: "#e2e8f0", k: "#e0ac69", h: "#111827", m: "#9a3412", j: "#3f3f46", w: "#f8fafc", W: "#cbd5e1", g: "#15803d", s: "#78350f" } };
// Kios Toko Al Umm (atap belang hijau-putih, rak barang)
const G4_TOKO = { rows: ["................", ".gwgwgwgwgwgwgw.", "gwgwgwgwgwgwgwgw", "gggggggggggggggg", ".p............p.", ".p..oo.yy.rr..p.", ".p..oo.yy.rr..p.", ".p............p.", ".bbbbbbbbbbbbbb.", ".bBBBBBBBBBBBBb.", ".bBBkkBBBBkkBBb.", ".bBBBBBBBBBBBBb.", ".bbbbbbbbbbbbbb.", ".d............d.", "................", "................"],
  w: { g: "#16a34a", w: "#f8fafc", p: "#78350f", o: "#f97316", y: "#facc15", r: "#ef4444", b: "#713f12", B: "#a16207", k: "#fde68a", d: "rgba(0,0,0,.2)" } };
// Burung Hudhud (jambul jingga berujung hitam, sayap belang)
const G4_HUDHUD = { rows: ["................", "....o.o.o.......", "...oKoKoKo......", "....ooooo.......", "....oooeo.......", "....oooooKKK....", "...oooooo.......", "..ooooooo.......", ".wKwKwKooo......", ".KwKwKwooo......", "..KwKwKoo.......", "....kk..........", "....k.k.........", "................", "................", "................"],
  w: { o: "#f59e0b", K: "#111827", e: "#111827", w: "#f8fafc", k: "#78350f" } };
// keyboard Arab ikut tertutup saat peti ditutup
function kbTutupG4() { try { if (typeof KB !== "undefined") { KB.target = null; KB.harakat = false; } if (typeof kbTampil === "function") kbTampil(); } catch (e) {} }
// Gulungan kisi-kisi (kertas tua berpita merah)
const G4_GULUNGAN = { rows: ["................", "................", "................", "...bbbbbbbbbb...", "..bccccccccccb..", "..bcyyyyyyyycb..", "...yyllllllyy...", "...yyyyyyyyyy...", "...yylllllyyy...", "...yyyyrryyyy...", "...yyllrrlyyy...", "..bcyyyyyyyycb..", "..bccccccccccb..", "...bbbbbbbbbb...", "................", "................"],
  w: { b: "#78350f", c: "#b45309", y: "#fde68a", l: "#a16207", r: "#dc2626" } };
function g4Peti(warna, gelap, terbuka) {
  const w = { a: warna, d: gelap, k: "#facc15", o: "#1f2937", i: "#422006", s: "rgba(0,0,0,.2)" };
  return terbuka
    ? { rows: ["................", "..oooooooooooo..", "..oaaaaaaaaaao..", "..oaaaaaaaaaao..", "..oddddddddddo..", "..oiiiiiiiiiio..", "..oiiiiiiiiiio..", "..oooooooooooo..", "..oaaaaaaaaaao..", "..oaaaaaaaaaao..", "..oddddddddddo..", "..oaaaaaaaaaao..", "..oaaaaaaaaaao..", "..oooooooooooo..", "...ssssssssss...", "................"], w }
    : { rows: ["................", "................", "................", "...oooooooooo...", "..oaaaaaaaaaao..", "..oaaaaaaaaaao..", "..oddddddddddo..", "..oooookkoooooo.", "..oaaaakkaaaao..", "..oaaaakkaaaao..", "..oddddddddddo..", "..oaaaaaaaaaao..", "..oaaaaaaaaaao..", "..oooooooooooo..", "...ssssssssss...", "................"], w };
}

// Hewan piksel (dua bingkai: diam & melangkah), menghadap kanan
const G4_HEWAN = (() => {
  const buat = (rows, w) => rows.map((r) => ({ rows: r, w }));
  const kaki2 = (r, a, b) => r.slice(0, 13).concat([a, b, "................"]);
  const sapi = ["................", "................", "................", ".............hh.", "..wwwwwwwwwwwhhh", ".wwkkwwwwkkwwwww", ".wwkkwwwwkkwwpne", ".wwwwwwkkwwwwppp", ".wwwwwwkkwwwww..", ".wwwwwwwwwwwww..", "..wwwwwwwwwww...", "..ww.ww..ww.ww..", "..kk.kk..kk.kk..", "..kk.kk..kk.kk..", "................", "................"];
  const kambing = ["................", "................", "............rr..", "...........r.r..", "..........gggg..", "..ggggggggggggg.", ".ggggggggggggeg.", ".gggggggggggggn.", ".ggggggggggggg..", "..gggggggggg.d..", "..gggggggggg....", "..gg.gg..gg.gg..", "..kk.kk..kk.kk..", "..kk.kk..kk.kk..", "................", "................"];
  const ayam = ["................", "................", "................", "..........rr....", ".........rwwr...", ".........wwew...", "........wwwwbb..", "..ww...wwwwwb...", ".wwwwwwwwwwww...", ".wwwwwwwwwwww...", "..wwwwwwwwww....", "...wwwwwwww.....", ".....y..y.......", ".....y..y.......", "....yy.yy.......", "................"];
  const bebek = ["................", "................", "................", "..........yyy...", ".........yyyyy..", ".........yyeyy..", ".........yyyyoo.", "..yy.....yyyy...", ".yyyyyyyyyyyy...", ".yyyyyyyyyyyy...", "..yyyyyyyyyy....", "...yyyyyyyy.....", ".....o..o.......", ".....o..o.......", "....oo.oo.......", "................"];
  const kucing = ["................", "................", "................", "...........o.o..", "...........oooo.", "..........ooeoe.", "..........ooopo.", ".o........oooo..", ".o.ooooooooooo..", "..oooooooooooo..", "..oooooooooooo..", "..oo.oo..oo.oo..", "..oo.oo..oo.oo..", "................", "................", "................"];
  const langkah = (r) => kaki2(r, r[13] ? r[13].replace(/^..(..).(..)..(..).(..)/, "...$1.$2.$3$4.") : r[13], r[14] || "................");
  const wSapi = { w: "#fafafa", k: "#1f2937", h: "#e5e7eb", p: "#f9a8d4", n: "#1f2937", e: "#111827" };
  const wKambing = { g: "#e7e5e4", r: "#78716c", e: "#111827", n: "#a8a29e", d: "#d6d3d1", k: "#57534e" };
  const wAyam = { w: "#ffffff", r: "#ef4444", e: "#111827", b: "#f59e0b", y: "#f59e0b" };
  const wBebek = { y: "#fde047", e: "#111827", o: "#f97316" };
  const wKucing = { o: "#fb923c", e: "#14532d", p: "#f9a8d4" };
  return {
    sapi: buat([sapi, langkah(sapi)], wSapi), kambing: buat([kambing, langkah(kambing)], wKambing),
    ayam: buat([ayam, ayam.slice(0, 12).concat(["....y....y......", "....y....y......", "...yy...yy......", "................"])], wAyam),
    bebek: buat([bebek, bebek.slice(0, 12).concat(["....o....o......", "....o....o......", "...oo...oo......", "................"])], wBebek),
    kucing: buat([kucing, langkah(kucing)], wKucing),
  };
})();

const G2_MAIN_PETI = function (isi, s) {
  const kartu = isi.closest(".kartu-soal"); kartu.classList.add("g4-mode");
  kartu.querySelector("textarea#uraian")?.remove(); // kotak tulis pindah ke dalam peti
  const uraian = S.soal.map((x, i) => ({ s: x, i })).filter((x) => x.s.jenis === "uraian" && !x.s.rek);
  const sesiKey = (S.sesi && S.sesi.id) + ":" + ((S.murid && S.murid.id) || "");
  const st = (G4[sesiKey] = G4[sesiKey] || { jebakanTerlihat: new Set(), buka: null });
  const peta = g4Peta(sesiKey + ":peti", uraian.length), { g, W, H, peti, jebakan, bisa } = peta;
  const tokoh = g4Tokoh(["#2563eb", "#dc2626", "#16a34a", "#9333ea", "#ea580c", "#0891b2"][Math.abs([...sesiKey].reduce((a, c) => a + c.charCodeAt(0), 0)) % 6], "#3f2a14", "#f1c27d");
  const nama = String((S.murid && S.murid.nama) || "Kamu").split(/\s+/)[0];
  // ── ingatan kecil di HP (tanpa server): peraturan sudah dibaca & kisi-kisi yang sudah ditemukan ──
  const LK = "g4:" + sesiKey, lokal = (() => { try { return JSON.parse(localStorage.getItem(LK) || "{}"); } catch (e) { return {}; } })();
  const simpanLokal = () => { try { localStorage.setItem(LK, JSON.stringify({ atur: !!st.aturanOk, kisi: [...(st.kisiDapat || [])], dapat: [...st.dapat], belanja: st.belanja, inv: st.inv, pintu: !!st.pintuTangga, qurban: [...st.qurban] })); } catch (e) {} };
  if (lokal.atur) st.aturanOk = true;
  st.kisiDapat = st.kisiDapat || new Set(lokal.kisi || []);
  // ── GOLD & barang Toko Al Umm (semua di HP, tanpa server) ──
  st.dapat = st.dapat || new Set(lokal.dapat || []);           // soal yang sudah pernah terjawab → masing-masing 500 gold
  st.belanja = st.belanja ?? (Number(lokal.belanja) || 0);
  st.inv = st.inv || Object.assign({ tangga: 0, pedang: 0, pancing: 0, umpan: 0 }, lokal.inv || {});
  st.pintuTangga = st.pintuTangga ?? !!lokal.pintu;
  st.qurban = st.qurban || new Set(lokal.qurban || []);
  const EMAS_PETI = 500, HARGA = { tangga: 1000, pedang: 1000, pancing: 500, umpan: 1000 };
  const emas = () => st.dapat.size * EMAS_PETI - st.belanja;
  // ── PETI TERTUTUP: 1–2 soal ditaruh di dalam kandang berpagar; pintunya berlubang → perlu 🪜 tangga ──
  const PINTU = [6, 11], diPintu = (x, y) => x === PINTU[0] && y === PINTU[1];
  const dalamKandang = (x, y) => x >= 4 && x <= 8 && y >= 12 && y <= 15;
  const tertutup = (() => {
    if (uraian.length < 3) return [];
    const pilihGuru = uraian.map((x, k) => (x.s.kandang ? k : -1)).filter((k) => k >= 0);
    if (pilihGuru.length) return pilihGuru.slice(0, 2);
    if (uraian.length < 4) return [];
    // tanpa pilihan guru: soal dengan kalimat paling pendek (biasanya paling mudah) dikunci di kandang
    return uraian.map((x, k) => ({ k, p: String(x.s.t || "").length })).sort((a, b) => a.p - b.p).slice(0, uraian.length >= 7 ? 2 : 1).map((x) => x.k);
  })();
  [[5, 13], [7, 14]].forEach((pos, i) => { if (tertutup[i] != null) peti[tertutup[i]] = pos; });
  // ── jarak jalan dari titik mulai (untuk menaruh ustadz & kisi-kisi) ──
  const jarM = (() => { const d = Array.from({ length: H }, () => Array(W).fill(-1)), q = [peta.mulai]; d[peta.mulai[1]][peta.mulai[0]] = 0; for (let i = 0; i < q.length; i++) { const [x, y] = q[i]; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + dx, ny = y + dy; if (bisa(nx, ny) && d[ny][nx] < 0) { d[ny][nx] = d[y][x] + 1; q.push([nx, ny]); } } } return d; })();
  const dipakaiPeta = (x, y) => peti.some((p) => p[0] === x && p[1] === y) || jebakan.some((p) => p[0] === x && p[1] === y);
  // ── USTADZ penunggu: berdiri di dekat titik mulai; datangi beliau untuk mengumpulkan jawaban ──
  const U = (() => { for (const jr of [2, 3, 1, 4]) for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) if (jarM[y][x] === jr && g[y][x] !== 4 && !dipakaiPeta(x, y)) return [x, y]; return [peta.mulai[0] + 1, peta.mulai[1] - 1]; })();
  const diUstadz = (x, y) => x === U[0] && y === U[1];
  // ── TOKO AL UMM: kios di dekat ustadz ──
  const TK = (() => { for (const jr of [2, 3, 4, 1, 5]) for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) if (jarM[y][x] === jr && g[y][x] !== 4 && !dipakaiPeta(x, y) && !diUstadz(x, y) && Math.abs(x - U[0]) + Math.abs(y - U[1]) >= 2) return [x, y]; return [peta.mulai[0] - 1, peta.mulai[1] - 1]; })();
  const diToko = (x, y) => x === TK[0] && y === TK[1];
  // ── KISI-KISI tersembunyi: tiap soal yang diberi kisi oleh guru → GULUNGAN di dekat pohon, atau dipancing di KOLAM ──
  const adaKisi = uraian.map((x, k) => ({ k, no: x.s.no, teks: String(x.s.kisi || "").trim() })).filter((x) => x.teks)
    .map((x, i, a) => ({ ...x, cara: a.length >= 2 && i % 2 === 1 ? "kolam" : "gulungan" }));
  const kisiKolam = adaKisi.filter((x) => x.cara === "kolam");
  const kisi = (() => {
    const gl = adaKisi.filter((x) => x.cara === "gulungan");
    if (!gl.length) return [];
    const a = g2Acak(sesiKey + ":kisi"), dekatPohon = (x, y) => [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => g[y + dy] && g[y + dy][x + dx] === 1);
    const calon = []; for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) if (jarM[y][x] >= 5 && (g[y][x] === 0 || g[y][x] === 5) && !dipakaiPeta(x, y) && !diUstadz(x, y) && !diToko(x, y)) calon.push({ x, y, n: (dekatPohon(x, y) ? 6 : 0) + jarM[y][x] * 0.15 + a() * 4 });
    const pilih = [];
    gl.forEach((it) => {
      calon.forEach((c) => { c.s = c.n + Math.min(8, ...pilih.map((p) => Math.abs(p.x - c.x) + Math.abs(p.y - c.y)).concat([8])) + Math.min(6, ...peti.map((p) => Math.abs(p[0] - c.x) + Math.abs(p[1] - c.y))); });
      calon.sort((p, q) => q.s - p.s); const c = calon.shift(); if (c) pilih.push({ ...it, x: c.x, y: c.y });
    });
    st.kisiLetak = pilih.map((x) => [x.no, x.x, x.y]);
    return pilih;
  })();
  isi.innerHTML = `<div class="g4-hud"><span id="g4-skor"></span><span class="ket">Cari peti, buka, jawab. Selesai? Datangi 👳 Ustadz untuk mengumpulkan.</span></div>
    <div class="g4-layar"><canvas id="g4-cv"></canvas><div class="g4-pesan" id="g4-pesan"></div></div>
    <div class="g4-aksibar" id="g4-aksibar"></div>
    <div class="g2-dpad g4-dpad"><button data-d="0,-1">▲</button><button data-d="-1,0">◀</button><button data-d="1,0">▶</button><button data-d="0,1">▼</button></div>
    <p class="g2-tip">Ketuk peti di peta → tokohmu berjalan sendiri ke sana. Tiap peti terjawab = 💰 ${EMAS_PETI} gold untuk belanja di 🏪 Toko Al Umm. Waspada lubang jebakan! 🕳️</p>`;
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
  const lantai = (x, y) => (bisa(x, y) && !diUstadz(x, y) && !diToko(x, y) && !(diPintu(x, y) && !st.pintuTangga)) || peti.some((p) => p[0] === x && p[1] === y);
  const dijawab = (k) => String(S.jawab.uraian[uraian[k].s.no] || "").trim() !== "";
  const terkunci = (k) => typeof g3Terkunci === "function" && g3Terkunci(uraian[k].s);
  uraian.forEach((x, k) => { if (dijawab(k)) st.dapat.add(x.s.no); });
  function skor() {
    const n = uraian.filter((_, k) => dijawab(k)).length, el = isi.querySelector("#g4-skor"); if (!el) return;
    const inv = st.inv, brg = [inv.tangga && !st.pintuTangga ? `🪜${inv.tangga}` : "", inv.pedang ? `⚔️${inv.pedang}` : "", inv.pancing ? "🎣" : "", inv.umpan ? `🪱${inv.umpan}` : ""].filter(Boolean).join(" ");
    el.innerHTML = `🗝️ <b>${n}</b>/${uraian.length} peti · <span class="g4-emas">💰 <b>${emas().toLocaleString("id-ID")}</b></span>${adaKisi.length ? ` · 📜 <b>${adaKisi.filter((x) => st.kisiDapat.has(x.no)).length}</b>/${adaKisi.length}` : ""}${brg ? ` · ${brg}` : ""}`;
  }
  // gold untuk peti yang baru pertama kali terjawab
  function beriEmas(k) {
    const no = uraian[k].s.no; if (!dijawab(k) || st.dapat.has(no)) return false;
    st.dapat.add(no); simpanLokal(); skor();
    setTimeout(() => pesan(`💰 +${EMAS_PETI} gold! Total ${emas().toLocaleString("id-ID")} — belanja di 🏪 Toko Al Umm`, 2200), 350);
    return true;
  }
  function pesan(t, ms) { const el = isi.querySelector("#g4-pesan"); if (!el) return; el.innerHTML = t; el.classList.add("on"); clearTimeout(pesan.t); pesan.t = setTimeout(() => el.classList.remove("on"), ms || 1400); }
  // ── HEWAN: berkeliaran, tidak bisa ditembus; bila terganggu (ditabrak) ada yang kabur, ada yang mengejar ──
  if (!st.hewan) {
    const jenis = ["sapi", "ayam", "kambing", "bebek", "kucing", "ayam", "sapi"], acakH = g2Acak(sesiKey + ":hewan"), hewan = [];
    let coba = 0;
    while (hewan.length < jenis.length && coba++ < 500) {
      const x = 2 + Math.floor(acakH() * (W - 4)), y = 2 + Math.floor(acakH() * (H - 4));
      if (!bisa(x, y) || g[y][x] === 4 || diUstadz(x, y) || diToko(x, y) || Math.abs(x - peta.mulai[0]) + Math.abs(y - peta.mulai[1]) < 4 || peti.some((p) => p[0] === x && p[1] === y) || jebakan.some((p) => p[0] === x && p[1] === y) || hewan.some((h) => h.x === x && h.y === y)) continue;
      const j = jenis[hewan.length];
      hewan.push({ idx: hewan.length, j, x, y, tx: x, ty: y, balik: 1, tunggu: 0.5 + acakH() * 2, marah: 0, kabur: 0, reda: 0, cepat: 1.5, kaki: 0 });
    }
    st.hewan = hewan.filter((h) => !st.qurban.has(h.idx));
  }
  const hewan = st.hewan;
  hewan.forEach((h) => { h.x = h.tx = Math.round(h.x); h.y = h.ty = Math.round(h.y); });
  const HEWAN_SIFAT = { sapi: { nama: "Sapi", galak: true, bunyi: "Mooo!" }, kambing: { nama: "Kambing", galak: true, bunyi: "Mbeee!" }, kucing: { nama: "Kucing", galak: true, bunyi: "Meong!" }, ayam: { nama: "Ayam", galak: false, bunyi: "Petok!" }, bebek: { nama: "Bebek", galak: false, bunyi: "Kwek!" } };
  const tanahHewan = (x, y) => bisa(x, y) && g[y][x] !== 4 || (g[y] && g[y][x] === 4);
  // petak yang sedang dipakai / dituju (tidak boleh saling tembus)
  const dipakaiHewan = (x, y, kecuali) => hewan.some((h) => h !== kecuali && ((h.x === x && h.y === y) || (h.tx === x && h.ty === y) || (Math.round(h.x) === x && Math.round(h.y) === y)));
  const dipakaiPemain = (x, y) => (Math.round(P.x) === x && Math.round(P.y) === y) || (P.tx === x && P.ty === y);
  const bisaHewan = (x, y, h) => tanahHewan(x, y) && !diUstadz(x, y) && !diToko(x, y) && !diPintu(x, y) && !peti.some((p) => p[0] === x && p[1] === y) && !jebakan.some((p) => p[0] === x && p[1] === y) && !dipakaiHewan(x, y, h) && !dipakaiPemain(x, y);
  let tabrakTerakhir = 0;
  function ganggu(h) {
    const now = performance.now(); if (now - tabrakTerakhir < 900 || h.reda > 0) return; tabrakTerakhir = now;
    const sifat = HEWAN_SIFAT[h.j];
    if (sifat.galak) { h.marah = 6; h.kabur = 0; h.ancang = 0.8; pesan(`😠 ${sifat.nama} terganggu dan mengejarmu! "${sifat.bunyi}" Lari!`, 1800); }
    else { h.kabur = 3; h.marah = 0; pesan(`💨 ${sifat.nama} kaget dan kabur! "${sifat.bunyi}"`, 1300); }
    try { navigator.vibrate && navigator.vibrate(60); } catch (e) {}
  }
  function seruduk(h) {
    const sifat = HEWAN_SIFAT[h.j];
    h.marah = 0; h.reda = 5;  // tenang dulu, tidak langsung marah lagi
    // tokoh terpental 2 petak menjauh dari hewan (ke petak kosong terdekat)
    const arah = [Math.sign(P.x - h.x), Math.sign(P.y - h.y)];
    let tuju = [Math.round(P.x), Math.round(P.y)];
    for (let i = 0; i < 2; i++) { const nx = tuju[0] + arah[0], ny = tuju[1] + arah[1]; if (lantai(nx, ny) && !dipakaiHewan(nx, ny)) tuju = [nx, ny]; else break; }
    P.jalur = []; P.mau = [0, 0]; P.dir = [0, 0]; P.x = P.tx = tuju[0]; P.y = P.ty = tuju[1];
    jatuh = 0.9; cv.classList.remove("goyang"); void cv.offsetWidth; cv.classList.add("goyang");
    pesan(`💥 Aduh! Diseruduk ${sifat.nama}! Hati-hati jangan mengganggu hewan.`, 1800); try { navigator.vibrate && navigator.vibrate([80, 40, 80]); } catch (e) {}
  }
  function jalurHewan(h, tujuanX, tujuanY, menjauh) {
    // satu langkah: mendekat (kejar) atau menjauh (kabur) dari tokoh, lewat petak yang boleh
    const pilihan = [[1, 0], [-1, 0], [0, 1], [0, -1]].map(([dx, dy]) => [h.x + dx, h.y + dy]).filter(([x, y]) => bisaHewan(x, y, h));
    if (!pilihan.length) return null;
    if (!menjauh) {
      // kejar: pakai jarak jalan (BFS dari tokoh) supaya tidak tersangkut pohon
      const d = Array.from({ length: H }, () => Array(W).fill(-1)), q = [[tujuanX, tujuanY]]; d[tujuanY][tujuanX] = 0;
      for (let i = 0; i < q.length; i++) { const [x, y] = q[i]; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + dx, ny = y + dy; if (tanahHewan(nx, ny) && d[ny][nx] < 0) { d[ny][nx] = d[y][x] + 1; q.push([nx, ny]); } } }
      pilihan.sort((a, b) => (d[a[1]][a[0]] < 0 ? 999 : d[a[1]][a[0]]) - (d[b[1]][b[0]] < 0 ? 999 : d[b[1]][b[0]]));
      return pilihan[0];
    }
    pilihan.sort((a, b) => Math.hypot(b[0] - tujuanX, b[1] - tujuanY) - Math.hypot(a[0] - tujuanX, a[1] - tujuanY));
    return pilihan[0];
  }
  function gerakHewan(dt) {
    hewan.forEach((h) => {
      if (h.reda > 0) h.reda -= dt;
      if (h.marah > 0) h.marah -= dt; if (h.kabur > 0) h.kabur -= dt;
      const dx = h.tx - h.x, dy = h.ty - h.y, jauh = Math.abs(dx) + Math.abs(dy);
      const cepat = h.marah > 0 ? 3.3 : h.kabur > 0 ? 3.6 : 1.4;
      if (jauh > 1e-6) { const g2 = Math.min(cepat * dt, jauh); h.x += Math.sign(dx) * g2; h.y += Math.sign(dy) * g2; h.kaki += g2; return; }
      h.x = h.tx; h.y = h.ty;
      const px = Math.round(P.x), py = Math.round(P.y);
      if (h.marah > 0 && jatuh <= 0) {
        if (h.ancang > 0) { h.ancang -= dt; return; } // ancang-ancang: santri sempat lari
        if (Math.abs(h.x - px) + Math.abs(h.y - py) <= 1) { seruduk(h); return; }
        const l = jalurHewan(h, px, py, false); if (l) { h.tx = l[0]; h.ty = l[1]; if (l[0] !== h.x) h.balik = l[0] > h.x ? 1 : -1; }
        return;
      }
      if (h.kabur > 0) { const l = jalurHewan(h, px, py, true); if (l) { h.tx = l[0]; h.ty = l[1]; if (l[0] !== h.x) h.balik = l[0] > h.x ? 1 : -1; } return; }
      h.tunggu -= dt; if (h.tunggu > 0) return;
      h.tunggu = 1 + Math.random() * 2.5;
      const arah = [[1, 0], [-1, 0], [0, 1], [0, -1]].filter(([ax, ay]) => bisaHewan(h.x + ax, h.y + ay, h));
      if (!arah.length) return;
      const [ax, ay] = arah[Math.floor(Math.random() * arah.length)]; h.tx = h.x + ax; h.ty = h.y + ay; if (ax) h.balik = ax;
    });
  }
  function gambarHewan(now) {
    hewan.forEach((h) => {
      const gerak = Math.abs(h.tx - h.x) + Math.abs(h.ty - h.y) > 1e-6, X = h.x * T, Y = h.y * T - (gerak ? Math.abs(Math.sin(h.kaki * Math.PI)) * T * 0.07 : 0);
      ctx.fillStyle = "rgba(0,0,0,.2)"; ctx.beginPath(); ctx.ellipse(X + T / 2, h.y * T + T * 0.9, T * 0.32, T * 0.09, 0, 0, 7); ctx.fill();
      ctx.save(); if (h.balik < 0) { ctx.translate(X + T / 2, 0); ctx.scale(-1, 1); ctx.translate(-(X + T / 2), 0); }
      g4Kotak(ctx, T, X, Y, G4_HEWAN[h.j][gerak && Math.floor(h.kaki * 3) % 2 ? 1 : 0]); ctx.restore();
      if (h.marah > 0 || h.kabur > 0) { ctx.font = `900 ${Math.round(T * 0.5)}px system-ui,Arial`; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillStyle = h.marah > 0 ? "#dc2626" : "#2563eb"; ctx.fillText(h.marah > 0 ? "!" : "?", X + T / 2, Y - T * 0.15 + Math.sin(now / 120) * 2); }
    });
  }

  // jalan otomatis (ketuk tujuan): cari jalur terpendek di petak yang bisa dilewati
  function cariJalur(tx, ty, hindariHewan) {
    const asal = [Math.round(P.x), Math.round(P.y)], kunci = (x, y) => x + "," + y, dari = { [kunci(...asal)]: null }, q = [asal];
    for (let i = 0; i < q.length; i++) { const [x, y] = q[i]; if (x === tx && y === ty) break; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + dx, ny = y + dy; if (lantai(nx, ny) && !(hindariHewan && dipakaiHewan(nx, ny)) && !(kunci(nx, ny) in dari)) { dari[kunci(nx, ny)] = [x, y]; q.push([nx, ny]); } } }
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
        let [mx, my] = P.mau, otomatis = false;
        if (P.jalur.length) { const [nx, ny] = P.jalur[0]; mx = nx - P.x; my = ny - P.y; otomatis = true; }
        // berjalan menabrak ustadz → menyapa beliau
        if (!otomatis && (mx || my) && diUstadz(P.x + mx, P.y + my)) { P.mau = [0, 0]; P.dir = [0, 0]; P.balik = mx || P.balik; bicaraUstadz(); return; }
        if (!otomatis && (mx || my) && diToko(P.x + mx, P.y + my)) { P.mau = [0, 0]; P.dir = [0, 0]; bukaToko(); return; }
        if ((mx || my) && diPintu(P.x + mx, P.y + my) && !st.pintuTangga) { P.mau = [0, 0]; P.dir = [0, 0]; P.jalur = []; pasangTangga(); return; }
        // hewan menghalangi: jalan otomatis menunggu; jalan sendiri = menabrak (hewan terganggu)
        const hDepan = (mx || my) ? hewan.find((h) => (Math.round(h.x) === P.x + mx && Math.round(h.y) === P.y + my) || (h.tx === P.x + mx && h.ty === P.y + my)) : null;
        if (hDepan) {
          P.dir = [0, 0];
          if (!otomatis) { ganggu(hDepan); return; }
          // jalan otomatis terhalang hewan → tunggu sebentar, lalu cari jalan memutar
          P.tungguH = (P.tungguH || 0) + dt;
          if (P.tungguH > 0.6 && P.tujuan) { P.tungguH = 0; P.jalur = cariJalur(P.tujuan[0], P.tujuan[1], true); if (!P.jalur.length) P.tujuan = null; }
          return;
        }
        P.tungguH = 0;
        if (otomatis) P.jalur.shift();
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
    // gulungan kisi-kisi
    const ks = kisi.find((x) => x.x === P.x && x.y === P.y && !st.kisiDapat.has(x.no));
    if (ks) { temukanKisi(ks); return true; }
    // sampai di sebelah ustadz (jalan otomatis)
    if (P.keUstadz && !P.jalur.length) { P.keUstadz = false; if (Math.abs(P.x - U[0]) + Math.abs(P.y - U[1]) === 1) { P.dir = [0, 0]; P.mau = [0, 0]; P.balik = Math.sign(U[0] - P.x) || P.balik; bicaraUstadz(); return true; } }
    if (P.keToko && !P.jalur.length) { P.keToko = false; if (Math.abs(P.x - TK[0]) + Math.abs(P.y - TK[1]) === 1) { P.dir = [0, 0]; P.mau = [0, 0]; bukaToko(); return true; } }
    if (P.kePintu && !P.jalur.length) { P.kePintu = false; if (Math.abs(P.x - PINTU[0]) + Math.abs(P.y - PINTU[1]) === 1) { P.dir = [0, 0]; P.mau = [0, 0]; pasangTangga(); return true; } }
    const k = peti.findIndex((p) => p[0] === P.x && p[1] === P.y);
    if (k < 0) { terakhirPeti = null; return false; }
    if (terakhirPeti === k) return false;
    // jalan otomatis melewati peti lain → tidak dibuka (hanya peti tujuan)
    if (P.jalur.length && P.tujuan && (P.tujuan[0] !== P.x || P.tujuan[1] !== P.y)) { terakhirPeti = k; return false; }
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
      ${String(sx.kisi || "").trim() ? (st.kisiDapat.has(sx.no) ? `<div class="g4-kisi"><b>📜 Kisi-kisi yang kamu temukan</b><span dir="auto">${esc(sx.kisi)}</span></div>` : `<div class="g4-kisi belum">🔎 Ada <b>gulungan kisi-kisi</b> untuk peti ini yang tersembunyi di peta… coba cari di dekat pepohonan.</div>`) : ""}
      <textarea id="uraian" dir="auto" ${kbAktif(sx) ? `inputmode="none"` : ""} ${kunci ? "readonly" : ""} placeholder="✍️ Tulis jawabanmu… (tersimpan otomatis, bisa diubah lagi nanti)">${esc(S.jawab.uraian[sx.no] || "")}</textarea>
      <div class="g4-bawah"><span class="g4-kata"></span>${kunci ? `<span class="g4-kunci">🔒 Sudah dikunci</span>` : ""}</div>
      ${soalArab(sx) || kbAktif(sx) ? kbSaklarHTML(sx) : ""}
      <div class="g4-aksi"><button class="g4-tinggal">🏃 Cari peti lain</button>${typeof g3Aktif === "function" && g3Aktif() && !kunci ? `<button class="g4-kunci-btn">🔒 Kunci jawaban peti</button>` : `<button class="g4-simpan">✅ Simpan & tutup</button>`}</div></div>`;
    document.body.appendChild(el);
    // ⏱️ waktu di peti ini (detik) — ikut tersimpan bersama jawaban, dilihat guru saat menilai
    const t0 = performance.now(); let tercatat = false;
    const catatWaktu = () => { if (tercatat) return; tercatat = true; const d = Math.round((performance.now() - t0) / 1000); if (d < 2) return; S.jawab.waktu = S.jawab.waktu || {}; S.jawab.waktu[sx.no] = (Number(S.jawab.waktu[sx.no]) || 0) + d; if (typeof berubah === "function") try { berubah(); } catch (e) {} };
    G2.bersih.push(() => { catatWaktu(); el.remove(); kbTutupG4(); });
    const ta = el.querySelector("textarea"), kata = el.querySelector(".g4-kata");
    const hitung = () => { kata.textContent = `✒️ ${g2HitungKata(ta.value)} kata`; };
    ta.addEventListener("input", () => { if (S.idx !== i) S.idx = i; ketikUraian(ta.value); hitung(); skor(); });
    hitung();
    const tutup = (pesanTeks) => { st.buka = null; catatWaktu(); el.classList.add("tutup"); if (document.activeElement && document.activeElement.blur) document.activeElement.blur(); setTimeout(() => { el.remove(); kbTutupG4(); }, 250); kbTutupG4(); if (pesanTeks) pesan(pesanTeks, 1300); beriEmas(k); skor(); };
    el.querySelector(".g4-x").onclick = () => tutup("Peti ditinggal — jawabanmu tetap tersimpan 👍");
    el.querySelector(".g4-tinggal").onclick = () => tutup("Cari peti lain yang lebih mudah 🔎");
    el.querySelector(".g4-simpan")?.addEventListener("click", () => { tutup(dijawab(k) ? `✨ Peti ${k + 1} terisi!` : null); if (dijawab(k)) g2Konfeti(cv); if (uraian.every((_, x) => dijawab(x))) setTimeout(() => pesan("🎉 Semua peti terjawab! Datangi 👳 Ustadz untuk mengumpulkan.", 2800), 600); });
    el.querySelector(".g4-kunci-btn")?.addEventListener("click", () => { if (!dijawab(k)) { ta.focus(); return; } catatWaktu(); el.remove(); kbTutupG4(); st.buka = null; beriEmas(k); g3Kunci(); });
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
    // gulungan kisi-kisi: tersembunyi — baru tampak bila tokoh sudah dekat (1 petak), sesekali berkilau samar
    kisi.forEach((x) => {
      if (st.kisiDapat.has(x.no)) return;
      const dekat = Math.max(Math.abs(P.x - x.x), Math.abs(P.y - x.y)) <= 1.2;
      if (dekat) { g4Kotak(ctx, T, x.x * T, x.y * T + Math.sin(now / 300) * T * 0.05, G4_GULUNGAN); }
      else if (Math.floor(now / 180 + x.no * 7) % 28 === 0) { ctx.fillStyle = "rgba(254,240,138,.9)"; ctx.fillRect(x.x * T + T * 0.45, x.y * T + T * 0.4, T / 9, T / 9); }
    });
    // ustadz di atas sajadah
    ctx.fillStyle = "#166534"; ctx.fillRect(U[0] * T + T * 0.08, U[1] * T + T * 0.55, T * 0.84, T * 0.42); ctx.fillStyle = "#facc15"; ctx.fillRect(U[0] * T + T * 0.12, U[1] * T + T * 0.6, T * 0.76, T * 0.04); ctx.fillRect(U[0] * T + T * 0.12, U[1] * T + T * 0.88, T * 0.76, T * 0.04);
    ctx.save(); if (P.x < U[0]) { ctx.translate(U[0] * T + T / 2, 0); ctx.scale(-1, 1); ctx.translate(-(U[0] * T + T / 2), 0); }
    g4Kotak(ctx, T, U[0] * T, U[1] * T - T * 0.12, G4_USTADZ); ctx.restore();
    const semua = uraian.every((_, k) => dijawab(k));
    if (semua || st.ustadzPanggil) { const by = U[1] * T - T * 0.75 + Math.sin(now / 260) * T * 0.08; ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.ellipse(U[0] * T + T / 2, by, T * 0.32, T * 0.24, 0, 0, 7); ctx.fill(); ctx.fillStyle = "#fff"; ctx.fillRect(U[0] * T + T * 0.42, by + T * 0.15, T * 0.12, T * 0.14); ctx.font = `${Math.round(T * 0.32)}px system-ui`; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(semua ? "📨" : "❗", U[0] * T + T / 2, by + 1); }
    // pintu kandang: lubang (perlu tangga) atau tangga terpasang
    { const X = PINTU[0] * T, Y = PINTU[1] * T;
      if (st.pintuTangga) { ctx.fillStyle = "#1c1917"; ctx.fillRect(X + T * 0.1, Y + T * 0.15, T * 0.8, T * 0.7); ctx.fillStyle = "#a16207"; ctx.fillRect(X + T * 0.18, Y, T * 0.12, T); ctx.fillRect(X + T * 0.7, Y, T * 0.12, T); for (let r = 0; r < 4; r++) ctx.fillRect(X + T * 0.18, Y + T * (0.12 + r * 0.24), T * 0.64, T * 0.08); }
      else { ctx.fillStyle = "#0c0a09"; ctx.beginPath(); ctx.ellipse(X + T / 2, Y + T / 2, T * 0.44, T * 0.32, 0, 0, 7); ctx.fill(); ctx.fillStyle = "#44403c"; ctx.fillRect(X + T * 0.12, Y + T * 0.78, T * 0.76, T * 0.06);
        ctx.font = `${Math.round(T * 0.42)}px system-ui`; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("🪜", X + T / 2, Y - T * 0.3 + Math.sin(now / 300) * T * 0.06); } }
    // kios Toko Al Umm
    g4Kotak(ctx, T, TK[0] * T, TK[1] * T - T * 0.1, G4_TOKO);
    // pelampung pancing
    if (pancingAktif) { const bx = pancingAktif.x * T + T / 2, by = pancingAktif.y * T + T / 2 + Math.sin(now / 160) * T * 0.08; ctx.strokeStyle = "rgba(255,255,255,.85)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(P.x * T + T * 0.7, P.y * T + T * 0.2); ctx.quadraticCurveTo((P.x * T + bx) / 2, Math.min(P.y * T, by) - T * 0.6, bx, by); ctx.stroke(); ctx.fillStyle = "#ef4444"; ctx.beginPath(); ctx.arc(bx, by, T * 0.12, Math.PI, 0); ctx.fill(); ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(bx, by, T * 0.12, 0, Math.PI); ctx.fill(); ctx.strokeStyle = "rgba(255,255,255,.5)"; ctx.beginPath(); ctx.ellipse(bx, by + T * 0.1, T * (0.2 + ((now / 600) % 1) * 0.25), T * 0.07, 0, 0, 7); ctx.stroke(); }
    gambarHewan(now);
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
    // 🐦 Hudhud terbang mengikuti tokoh
    { const tx = P.x - 0.55 * (P.balik || 1), ty = P.y - 0.75; HD.x += (tx - HD.x) * 0.06; HD.y += (ty - HD.y) * 0.06;
      const kepak = Math.sin(now / 90) * T * 0.04, S2 = T * 0.62; ctx.save(); if (P.x < HD.x) { ctx.translate(HD.x * T + S2 / 2, 0); ctx.scale(-1, 1); ctx.translate(-(HD.x * T + S2 / 2), 0); } g4Kotak(ctx, S2, HD.x * T + T * 0.2, HD.y * T + kepak, G4_HUDHUD); ctx.restore(); }
    { const lt = ctx.measureText("Toko").width + 8; ctx.fillStyle = "rgba(161,98,7,.9)"; ctx.fillRect(TK[0] * T + T / 2 - lt / 2, TK[1] * T - T * 0.5, lt, T * 0.4); ctx.fillStyle = "#fff"; ctx.fillText("Toko", TK[0] * T + T / 2, TK[1] * T - T * 0.3); }
    // papan nama ustadz
    const lu = ctx.measureText("Ustadz").width + 8; ctx.fillStyle = "rgba(22,101,52,.88)"; ctx.fillRect(U[0] * T + T / 2 - lu / 2, U[1] * T - T * 0.5, lu, T * 0.4); ctx.fillStyle = "#fef08a"; ctx.fillText("Ustadz", U[0] * T + T / 2, U[1] * T - T * 0.3);
  }
  // ============ DIALOG (ustadz, santri, gulungan) — permainan berhenti selama dialog terbuka ============
  const mapel = (S.sesi && S.sesi.bank && ((S.sesi.bank.mapel && S.sesi.bank.mapel.nama_mapel) || S.sesi.bank.judul)) || "ini";
  const potret = (spr) => { const c = document.createElement("canvas"); c.width = c.height = 64; const x = c.getContext("2d"); x.imageSmoothingEnabled = false; g4Kotak(x, 64, 0, 0, spr); return c.toDataURL(); };
  const FOTO = { ustadz: potret(G4_USTADZ), santri: potret(tokoh.depan), gulungan: potret(G4_GULUNGAN), toko: potret(G4_TOKO) };
  const NAMA_DLG = { ustadz: "Ustadz Pengawas", santri: nama, gulungan: "Gulungan Kisi-kisi" };
  function dialogG4(halaman, selesai) {
    document.getElementById("g4-dlg")?.remove();
    const el = document.createElement("div"); el.id = "g4-dlg"; el.className = "g4-dlg";
    document.body.appendChild(el); G2.bersih.push(() => el.remove());
    let i = 0, ketik = null;
    const tutup = () => { clearInterval(ketik); el.classList.add("tutup"); setTimeout(() => el.remove(), 220); };
    const gambarHal = () => {
      const h = halaman[i], kanan = h.siapa === "santri";
      el.innerHTML = `<div class="g4-dlg-kotak ${kanan ? "kanan" : ""} ${h.siapa}"><img class="g4-dlg-foto" src="${FOTO[h.siapa]}" alt=""><div class="g4-dlg-isi"><b>${esc(NAMA_DLG[h.siapa])}</b><div class="g4-dlg-teks"></div>
        <div class="g4-dlg-tombol">${(h.tombol || [{ teks: i < halaman.length - 1 ? "Lanjut ▸" : "Tutup" }]).map((t, k) => `<button data-k="${k}" class="${t.utama ? "utama" : ""}">${t.teks}</button>`).join("")}</div></div></div>`;
      const tk = el.querySelector(".g4-dlg-teks");
      // efek mengetik untuk teks biasa; teks berhias (dalil, daftar) langsung tampil
      if (h.html) tk.innerHTML = h.html;
      else { const s = String(h.teks || ""); let n = 0; clearInterval(ketik); ketik = setInterval(() => { n += 2; tk.textContent = s.slice(0, n); if (n >= s.length) clearInterval(ketik); }, 18); tk.onclick = () => { clearInterval(ketik); tk.textContent = s; }; }
      el.querySelectorAll(".g4-dlg-tombol button").forEach((b) => b.onclick = () => {
        const t = (h.tombol || [])[+b.dataset.k];
        if (t && t.aksi) { const lanjut = t.aksi(); if (lanjut === "lanjut" && i < halaman.length - 1) { i++; gambarHal(); return; } tutup(); if (selesai) selesai(); return; }
        if (i < halaman.length - 1) { i++; gambarHal(); } else { tutup(); if (selesai) selesai(); }
      });
    };
    gambarHal();
  }
  const ujianSungguhan = () => S.sesi && S.sesi.mode === "ujian" && !S.coba;
  // peraturan & dalil di awal permainan (sekali per santri per sesi)
  function aturanAwal() {
    dialogG4([
      { siapa: "ustadz", teks: `Assalamu'alaikum, ${nama}. Selamat datang di ujian ${mapel}. Sebelum mulai mencari peti, dengarkan dulu peraturannya ya.` },
      { siapa: "ustadz", html: `<ol class="g4-aturan"><li>Kerjakan <b>sendiri</b> dan <b>jujur</b>.</li><li><b>Dilarang</b> membuka Google, AI, atau aplikasi lain. Setiap kali keluar dari halaman ujian <b>tercatat</b> dan dilaporkan ke ustadz.</li><li>Salin &amp; tempel soal maupun jawaban <b>tidak bisa</b> dipakai.</li><li>Jawaban di peti <b>tersimpan otomatis</b> — boleh ditinggal dan diubah lagi.</li>${adaKisi.length ? `<li>Ada <b>${adaKisi.length} kisi-kisi</b> tersembunyi — ada yang berupa gulungan di peta, ada yang harus <b>dipancing di kolam</b>.</li>` : ""}<li>Tiap peti terjawab mendapat <b>💰 ${EMAS_PETI} gold</b> untuk belanja di <b>🏪 Toko Al Umm</b> (tangga, pedang qurban, pancing &amp; umpan). Gold tidak memengaruhi nilai.</li>${tertutup.length ? `<li>Ada peti yang <b>terkunci di kandang</b> — beli 🪜 tangga untuk menyeberangi lubang di pintunya.</li>` : ""}<li>Kalau sudah selesai dan yakin, <b>datangi ana</b> di sini untuk mengumpulkan.</li></ol>` },
      { siapa: "ustadz", html: `<div class="g4-dalil"><p class="ar">يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ وَكُونُوا مَعَ الصَّادِقِينَ</p><small>"Wahai orang-orang yang beriman, bertakwalah kepada Allah dan hendaklah kalian bersama orang-orang yang jujur." <i>(QS. At-Taubah: 119)</i></small>
        <p class="ar">مَنْ غَشَّنَا فَلَيْسَ مِنَّا</p><small>"Barang siapa berbuat curang kepada kami, maka ia bukan golongan kami." <i>(HR. Muslim)</i></small></div><p class="g4-janji">Nilai yang jujur lebih berkah daripada nilai tinggi hasil curang. Bismillah!</p>`,
        tombol: [{ teks: "🤝 Saya Berjanji Jujur — Mulai", utama: true, aksi: () => { st.aturanOk = true; simpanLokal(); } }] },
    ]);
  }
  // datang ke ustadz → percakapan mengumpulkan jawaban
  function bicaraUstadz() {
    if (document.getElementById("g4-dlg") || document.getElementById("g4-panel")) return;
    st.ustadzPanggil = false;
    const belumPeti = uraian.map((_, k) => k).filter((k) => !dijawab(k)).map((k) => k + 1);
    const lain = (S.soal || []).filter((s) => !(s.jenis === "uraian" && !s.rek) && typeof sudahDijawab === "function" && !sudahDijawab(s)).length;
    const waktu = typeof S.sisa === "number" && S.sisa > 0 ? `Masih ada waktu <b>${Math.max(1, Math.floor(S.sisa / 60))} menit</b> untuk memeriksa.` : "Waktunya masih ada untuk memeriksa.";
    const keluar = ujianSungguhan() && S.pindahTab ? `<br><small class="g4-catat">📋 Catatan ana: antum tadi keluar dari halaman ujian <b>${S.pindahTab} kali</b>.</small>` : "";
    const kumpul = { teks: "✅ Yakin, Kumpulkan", utama: true, aksi: () => { setTimeout(() => (typeof kirim === "function" ? kirim() : tanyaKirim()), 250); } };
    const periksa = { teks: "🔍 Saya Periksa Lagi" };
    const kurang = belumPeti.length || lain;
    dialogG4([
      { siapa: "santri", teks: `Ustadz, ana mau mengumpulkan jawaban ujian ${mapel}.` },
      kurang
        ? { siapa: "ustadz", html: `Sebentar, ${esc(nama)}… ${belumPeti.length ? `Masih ada <b>${belumPeti.length} peti</b> yang belum antum jawab (Peti ${belumPeti.join(", ")}).` : ""} ${lain ? `Ada juga <b>${lain} soal lain</b> yang belum dijawab.` : ""}<br>Yakin mau dikumpulkan sekarang? ${waktu}${keluar}`, tombol: [{ teks: "🔎 Cari Lagi" }, { teks: "📨 Tetap Kumpulkan", aksi: kumpul.aksi }] }
        : { siapa: "ustadz", html: `MasyaAllah, semua sudah antum jawab. Tapi… <b>apakah antum sudah yakin?</b> Sudah dikoreksi lagi belum? ${waktu}${keluar}<br><small>Setelah dikumpulkan, jawaban tidak bisa diubah.</small>`, tombol: [periksa, kumpul] },
    ]);
  }
  function temukanKisi(x, dari) {
    st.kisiDapat.add(x.no); simpanLokal(); skor(); P.jalur = []; P.mau = [0, 0]; P.dir = [0, 0];
    g2Konfeti(cv); try { navigator.vibrate && navigator.vibrate([40, 30, 40]); } catch (e) {}
    dialogG4([{ siapa: "gulungan", html: `<div class="g4-kisi-temu">✨ ${dari === "kolam" ? "Kailmu menarik sebuah botol berisi gulungan!" : ""} Kamu menemukan <b>kisi-kisi untuk Peti ${x.k + 1}</b>!<blockquote dir="auto">${esc(x.teks)}</blockquote><small>Kisi-kisi ini juga muncul saat Peti ${x.k + 1} dibuka.</small></div>` }]);
  }
  // ============ TOKO AL UMM, TANGGA, QURBAN, MEMANCING ============
  function pasangTangga() {
    if (st.pintuTangga) return;
    if (!st.inv.tangga) { pesan(`🕳️ Pintu kandang berlubang! Beli 🪜 Tangga di Toko Al Umm (${HARGA.tangga} gold)`, 2600); return; }
    st.inv.tangga--; st.pintuTangga = true; simpanLokal(); skor();
    pesan("🪜 Tangga dipasang di atas lubang — sekarang bisa masuk kandang!", 2400); try { navigator.vibrate && navigator.vibrate(40); } catch (e) {}
  }
  const BARANG = [
    { id: "tangga", ik: "🪜", nama: "Tangga", ket: "Menyeberangi lubang di pintu kandang untuk mengambil peti yang tertutup." },
    { id: "pedang", ik: "⚔️", nama: "Pedang Qurban", ket: "Mengqurbankan sapi / kambing yang mengamuk (sekali pakai)." },
    { id: "pancing", ik: "🎣", nama: "Pancing", ket: "Untuk memancing di kolam. Cukup beli sekali." },
    { id: "umpan", ik: "🪱", nama: "Umpan", ket: "1 umpan = 1 kali memancing. Di kolam tersembunyi kisi-kisi!" },
  ];
  function bukaToko() {
    if (document.getElementById("g4-toko")) return;
    P.jalur = []; P.mau = [0, 0]; P.dir = [0, 0];
    const el = document.createElement("div"); el.id = "g4-toko"; el.className = "g4-dlg"; document.body.appendChild(el); G2.bersih.push(() => el.remove());
    const gambarToko = () => {
      const e = emas(), sisaKolam = kisiKolam.filter((x) => !st.kisiDapat.has(x.no)).length;
      el.innerHTML = `<div class="g4-toko"><div class="g4-toko-atas"><img src="${FOTO.toko}" alt=""><div><b>🏪 Toko Al Umm</b><small>"Silakan, ${esc(nama)}… barang halal, harga bersahabat!"</small></div><span class="g4-toko-emas">💰 ${e.toLocaleString("id-ID")}</span></div>
        ${BARANG.map((b) => {
          let lbl = "", bisa2 = e >= HARGA[b.id];
          if (b.id === "tangga") { if (!tertutup.length) lbl = "Tidak perlu"; else if (st.pintuTangga) lbl = "Sudah dipasang"; else if (st.inv.tangga) lbl = "Sudah punya"; }
          if (b.id === "pancing" && st.inv.pancing) lbl = "Sudah punya";
          if (b.id === "umpan" && !sisaKolam) lbl = kisiKolam.length ? "Kolam kosong" : "Tidak perlu";
          if (!lbl && !bisa2) lbl = "Gold kurang";
          const boleh = !lbl;
          return `<div class="g4-barang ${boleh ? "" : "mati"}"><span class="ik">${b.ik}</span><div><b>${b.nama}${st.inv[b.id] && b.id !== "pancing" ? ` <em>×${st.inv[b.id]}</em>` : ""}</b><small>${b.ket}${b.id === "umpan" && kisiKolam.length ? ` (sisa ${sisaKolam} kisi di kolam)` : ""}</small></div><button data-b="${b.id}" ${boleh ? "" : "disabled"}>${boleh ? `💰 ${HARGA[b.id].toLocaleString("id-ID")}` : lbl}</button></div>`;
        }).join("")}
        <p class="g4-toko-ket">Tiap peti yang terjawab mendapat 💰 ${EMAS_PETI} gold. Gold hanya untuk permainan — tidak memengaruhi nilai.</p>
        <div class="g4-dlg-tombol"><button class="utama" data-tutup="1">Selesai Belanja</button></div></div>`;
      el.querySelectorAll("[data-b]").forEach((b) => b.onclick = () => {
        const id = b.dataset.b; if (emas() < HARGA[id]) return;
        st.belanja += HARGA[id]; st.inv[id] = (st.inv[id] || 0) + 1; simpanLokal(); skor(); gambarToko();
        pesan(`🛍️ ${BARANG.find((x) => x.id === id).nama} dibeli!`, 1400);
      });
      el.querySelector("[data-tutup]").onclick = () => { el.classList.add("tutup"); setTimeout(() => el.remove(), 200); };
    };
    gambarToko();
  }
  const dekatAir = () => [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => g[Math.round(P.y) + dy] && g[Math.round(P.y) + dy][Math.round(P.x) + dx] === 2);
  let pancingAktif = null; // pelampung di air { x, y, t }
  function mancing() {
    if (pancingAktif) return;
    if (!st.inv.pancing) { pesan(`🎣 Beli pancing di Toko Al Umm (${HARGA.pancing} gold)`, 2000); return; }
    if (!dekatAir()) { pesan("🎣 Berdirilah di tepi kolam", 1600); return; }
    const sisa = kisiKolam.filter((x) => !st.kisiDapat.has(x.no));
    if (!sisa.length) { pesan(kisiKolam.length ? "🐟 Kisi-kisi di kolam sudah kamu temukan semua" : "🐟 Kolam ini tidak menyimpan kisi-kisi", 2000); return; }
    if (!st.inv.umpan) { pesan(`🪱 Umpan habis — beli di Toko Al Umm (${HARGA.umpan} gold)`, 2000); return; }
    st.inv.umpan--; simpanLokal(); skor(); aksiSebelum = "";
    const air = [[1, 0], [-1, 0], [0, 1], [0, -1]].map(([dx, dy]) => [Math.round(P.x) + dx, Math.round(P.y) + dy]).find(([x, y]) => g[y] && g[y][x] === 2);
    pancingAktif = { x: air[0], y: air[1], t: performance.now() };
    pesan("🎣 Melempar kail… tunggu ikannya menyambar", 1800);
    setTimeout(() => {
      pancingAktif = null; if (!cv.isConnected) return;
      temukanKisi(sisa[0], "kolam");
    }, 2300);
  }
  function qurban(h) {
    if (!st.inv.pedang || !(h.j === "sapi" || h.j === "kambing")) return;
    st.inv.pedang--; st.qurban.add(h.idx);
    const i = hewan.indexOf(h); if (i >= 0) hewan.splice(i, 1);
    simpanLokal(); skor(); aksiSebelum = ""; g2Konfeti(cv); try { navigator.vibrate && navigator.vibrate([60, 40, 60]); } catch (e) {}
    pesan(`🔪 Bismillah, Allahu Akbar! ${h.j === "sapi" ? "Sapi" : "Kambing"} diqurbankan — dagingnya dibagikan untuk yang membutuhkan 🥩`, 3000);
  }
  // tombol aksi di bawah peta (muncul sesuai keadaan)
  let aksiSebelum = "";
  function perbaruiAksi() {
    const bar = isi.querySelector("#g4-aksibar"); if (!bar) return;
    const px = Math.round(P.x), py = Math.round(P.y);
    const hDekat = hewan.find((h) => (h.j === "sapi" || h.j === "kambing") && Math.abs(Math.round(h.x) - px) + Math.abs(Math.round(h.y) - py) <= 1);
    const air = st.inv.pancing && dekatAir();
    const kunci = [emas(), air ? 1 : 0, hDekat && st.inv.pedang ? hDekat.idx : -1, st.inv.umpan].join("|");
    if (kunci === aksiSebelum) return; aksiSebelum = kunci;
    bar.innerHTML = `<button data-a="toko">🏪 Toko Al Umm</button><button data-a="hudhud" class="hijau">🐦 Tanya Hudhud</button>${air ? `<button data-a="pancing" class="biru">🎣 Mancing${st.inv.umpan ? ` (🪱${st.inv.umpan})` : ""}</button>` : ""}${hDekat && st.inv.pedang ? `<button data-a="qurban" class="merah">⚔️ Qurbankan ${hDekat.j === "sapi" ? "Sapi" : "Kambing"}</button>` : ""}`;
    bar.querySelector('[data-a="toko"]').onclick = () => {
      const qx = Math.round(P.x), qy = Math.round(P.y);
      if (Math.abs(qx - TK[0]) + Math.abs(qy - TK[1]) <= 1) { bukaToko(); return; }
      const jl = [[1, 0], [-1, 0], [0, 1], [0, -1]].map(([dx, dy]) => [TK[0] + dx, TK[1] + dy]).filter(([a, b]) => lantai(a, b)).map(([a, b]) => cariJalur(a, b)).filter((j) => j.length).sort((p, q) => p.length - q.length)[0];
      if (jl) { pesan("🏪 Menuju Toko Al Umm…", 1200); P.mau = [0, 0]; P.jalur = jl; P.tujuan = jl[jl.length - 1]; P.keToko = true; } else bukaToko();
    };
    bar.querySelector('[data-a="hudhud"]').onclick = () => { aksiTerakhir = performance.now(); hudhudBicara(); };
    bar.querySelector('[data-a="pancing"]')?.addEventListener("click", mancing);
    bar.querySelector('[data-a="qurban"]')?.addEventListener("click", () => { const h = hewan.find((x) => x.idx === hDekat.idx); if (h) qurban(h); });
  }
  // ============ 🐦 HUDHUD — teman bicara: petunjuk arah peti & semangat (muncul bila santri lama diam) ============
  const HD = { x: P.x - 1, y: P.y, ke: 0 };
  let aksiTerakhir = performance.now(), hudhudT = performance.now();
  const arahNama = (dx, dy) => { const v = dy < -1 ? "utara" : dy > 1 ? "selatan" : "", h = dx > 1 ? "timur" : dx < -1 ? "barat" : ""; return v && h ? `${v}-${h}` : v || h || "dekat sini"; };
  function nasihatHudhud() {
    const px = Math.round(P.x), py = Math.round(P.y), belum = uraian.map((_, k) => k).filter((k) => !dijawab(k));
    const pilihan = [];
    if (!belum.length) pilihan.push("Semua peti sudah terjawab! MasyaAllah. Periksa lagi, lalu datangi Ustadz untuk mengumpulkan 📨");
    else {
      const k = belum.slice().sort((a, b) => (Math.abs(peti[a][0] - px) + Math.abs(peti[a][1] - py)) - (Math.abs(peti[b][0] - px) + Math.abs(peti[b][1] - py)))[0], [x, y] = peti[k];
      const tempat = dalamKandang(x, y) ? "di dalam kandang" : [[1, 0], [-1, 0], [0, 1], [0, -1], [2, 0], [-2, 0], [0, 2], [0, -2]].some(([dx, dy]) => g[y + dy] && g[y + dy][x + dx] === 2) ? "dekat kolam" : "";
      pilihan.push(`Peti ${k + 1} ada di arah ${arahNama(x - px, y - py)}${tempat ? ", " + tempat : ""}. Ayo ke sana!`);
      if (belum.length <= 2) pilihan.push(`Tinggal ${belum.length} peti lagi, semangat! 💪`);
    }
    if (tertutup.some((k) => !dijawab(k)) && !st.pintuTangga) pilihan.push(emas() >= HARGA.tangga && !st.inv.tangga ? "Gold-mu sudah cukup untuk beli 🪜 tangga! Peti di kandang menunggumu." : st.inv.tangga ? "Kamu punya 🪜 tangga — pasang di lubang pintu kandang!" : "Ada peti terkunci di kandang. Kumpulkan gold dari peti lain untuk beli 🪜 tangga.");
    const sisaKisi = adaKisi.filter((x) => !st.kisiDapat.has(x.no));
    if (sisaKisi.some((x) => x.cara === "gulungan")) pilihan.push("Psst… ada gulungan kisi-kisi tersembunyi di dekat pepohonan 🌳");
    if (sisaKisi.some((x) => x.cara === "kolam")) pilihan.push("Konon di kolam ada kisi-kisi. Bawa 🎣 pancing & 🪱 umpan!");
    pilihan.push("Bismillah, pelan-pelan saja. Baca soalnya dua kali ya 📖", "Jawaban yang jujur insyaAllah lebih berkah 🤲", "Kalau ragu, kerjakan peti yang lebih mudah dulu 🙂");
    return pilihan[HD.ke++ % pilihan.length];
  }
  function hudhudBicara() { hudhudT = performance.now(); pesan(`🐦 <b>Hudhud:</b> ${nasihatHudhud()}`, 4500); }
  // kembali dari aplikasi lain saat ujian → ustadz menegur (pindah halaman tetap tercatat oleh sistem ujian)
  let pindahTerakhir = S.pindahTab || 0;
  g2Dengar(document, "visibilitychange", () => {
    if (document.hidden || !ujianSungguhan()) return;
    setTimeout(() => {
      if ((S.pindahTab || 0) <= pindahTerakhir || !cv.isConnected) return; pindahTerakhir = S.pindahTab;
      document.getElementById("g4-panel")?.remove(); st.buka = null; kbTutupG4();
      dialogG4([{ siapa: "ustadz", html: `⚠️ <b>${esc(nama)}, antum tadi keluar dari halaman ujian.</b><br>Sudah tercatat <b>${S.pindahTab} kali</b> dan akan dilihat ustadz.<div class="g4-dalil kecil"><p class="ar">مَنْ غَشَّنَا فَلَيْسَ مِنَّا</p><small>"Barang siapa berbuat curang, ia bukan golongan kami." (HR. Muslim)</small></div>`, tombol: [{ teks: "Saya Mengerti", utama: true }] }]);
    }, 300);
  });
  // salin / tempel / tekan-lama dimatikan di dalam permainan (juga untuk latihan)
  ["copy", "cut", "paste", "contextmenu", "dragstart", "drop"].forEach((ev) => g2Dengar(document, ev, (e) => {
    if (!(e.target && e.target.closest && e.target.closest(".g4-panel,.g4-dlg,.g2-wadah"))) return;
    e.preventDefault(); if (ev === "paste" || ev === "copy" || ev === "drop") pesan("🚫 Salin / tempel tidak diizinkan", 1600);
  }, true));
  function putar(now) {
    if (!cv.isConnected) return;
    const dt = Math.min(0.05, (now - lalu) / 1000); lalu = now;
    const adaJendela = document.getElementById("g4-panel") || document.getElementById("g4-dlg") || document.getElementById("g4-toko");
    if (!document.hidden && !adaJendela) { langkah(dt); gerakHewan(dt); }
    if (!adaJendela) { perbaruiAksi(); if (st.aturanOk && now - aksiTerakhir > 22000 && now - hudhudT > 22000) hudhudBicara(); }
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
    // ketuk ustadz / toko → berjalan ke sebelahnya lalu berinteraksi
    const keSebelah = (x, y, tanda, aksi) => {
      if (Math.abs(Math.round(P.x) - x) + Math.abs(Math.round(P.y) - y) === 1) { aksi(); return; }
      const jl = [[1, 0], [-1, 0], [0, 1], [0, -1]].map(([dx, dy]) => [x + dx, y + dy]).filter(([a, b]) => lantai(a, b)).map(([a, b]) => cariJalur(a, b)).filter((j) => j.length).sort((p, q) => p.length - q.length)[0];
      if (jl) { P.mau = [0, 0]; P.jalur = jl; P.tujuan = jl[jl.length - 1]; P[tanda] = true; }
    };
    if (diUstadz(x, y)) { keSebelah(x, y, "keUstadz", bicaraUstadz); return; }
    if (diToko(x, y)) { keSebelah(x, y, "keToko", bukaToko); return; }
    // pintu kandang / peti di dalam kandang yang masih tertutup lubang
    if (!st.pintuTangga && (diPintu(x, y) || dalamKandang(x, y))) {
      if (!st.inv.tangga) { pesan(`🕳️ Pintu kandang berlubang! Beli 🪜 Tangga di Toko Al Umm (${HARGA.tangga} gold)`, 2600); return; }
      if (Math.round(P.y) === PINTU[1] - 1 && Math.round(P.x) === PINTU[0]) { pasangTangga(); return; }
      const jl = cariJalur(PINTU[0], PINTU[1] - 1); if (jl.length) { P.mau = [0, 0]; P.jalur = jl; P.tujuan = jl[jl.length - 1]; P.kePintu = true; }
      return;
    }
    // ketuk air → memancing bila punya pancing & berdiri di tepi kolam
    if (g[y] && g[y][x] === 2) { if (dekatAir()) mancing(); else pesan(st.inv.pancing ? "🎣 Berdirilah di tepi kolam untuk memancing" : `🎣 Beli pancing & umpan di Toko Al Umm untuk memancing kisi-kisi`, 2000); return; }
    // ketuk sapi/kambing di sebelah saat membawa pedang → qurban
    const hT = hewan.find((h) => Math.round(h.x) === x && Math.round(h.y) === y);
    if (hT && (hT.j === "sapi" || hT.j === "kambing") && st.inv.pedang && Math.abs(Math.round(P.x) - x) + Math.abs(Math.round(P.y) - y) === 1) { qurban(hT); return; }
    if (!lantai(x, y)) return;
    P.mau = [0, 0]; P.jalur = cariJalur(x, y); P.tujuan = P.jalur.length ? [x, y] : null;
  };
  let awal = null, geser = false;
  g2Dengar(isi, "pointerdown", () => { aksiTerakhir = performance.now(); }, true);
  g2Dengar(document, "keydown", () => { aksiTerakhir = performance.now(); }, true);
  g2Dengar(cv, "pointerdown", (e) => { awal = [e.clientX, e.clientY]; geser = false; });
  g2Dengar(cv, "pointermove", (e) => { if (!awal) return; const dx = e.clientX - awal[0], dy = e.clientY - awal[1]; if (Math.max(Math.abs(dx), Math.abs(dy)) > 18) { geser = true; P.jalur = []; P.mau = Math.abs(dx) > Math.abs(dy) ? [Math.sign(dx), 0] : [0, Math.sign(dy)]; awal = [e.clientX, e.clientY]; } });
  g2Dengar(cv, "pointerup", (e) => { if (!geser) keTujuan(e); else P.mau = [0, 0]; awal = null; });
  isi.querySelectorAll(".g4-dpad button").forEach((b) => {
    const d = b.dataset.d.split(",").map(Number);
    g2Dengar(b, "pointerdown", (e) => { e.preventDefault(); P.jalur = []; P.mau = d; });
    ["pointerup", "pointerleave", "pointercancel"].forEach((ev) => g2Dengar(b, ev, () => { if (P.mau[0] === d[0] && P.mau[1] === d[1]) P.mau = [0, 0]; }));
  });
  const peta2 = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] };
  g2Dengar(document, "keydown", (e) => { const d = peta2[e.key]; if (!d || (e.target && e.target.matches && e.target.matches("input,textarea,select"))) return; e.preventDefault(); P.jalur = []; P.mau = d; }, true);
  g2Dengar(document, "keyup", (e) => { const d = peta2[e.key]; if (d && P.mau[0] === d[0] && P.mau[1] === d[1]) P.mau = [0, 0]; }, true);
  g2Dengar(window, "resize", ukur);
  // peti yang sedang dibuka sebelum digambar ulang (mis. setelah menyalakan keyboard Arab) dibuka lagi
  if (st.buka != null) { const k = uraian.findIndex((x) => x.s.no === st.buka); if (k >= 0) setTimeout(() => bukaPeti(k), 60); }
  else if (!st.aturanOk) setTimeout(aturanAwal, 350);
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
  .g4-kotak .teks-soal,.g4-kotak .stimulus,.g4-dlg{-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}
  .g4-kisi{margin-top:10px;padding:10px 12px;border-radius:12px;background:linear-gradient(135deg,#fef9c3,#fde68a);border:2px dashed #b45309;color:#78350f;font-size:14px;display:flex;flex-direction:column;gap:4px}
  .g4-kisi.belum{background:#f8fafc;border-color:#cbd5e1;color:#64748b;font-size:12.5px}
  .g4-dlg{position:fixed;inset:0;z-index:80;display:flex;align-items:flex-end;justify-content:center;padding:12px;background:rgba(15,23,42,.4);animation:g4-masuk .2s ease}
  .g4-dlg.tutup{animation:g4-keluar .22s ease forwards}
  .g4-dlg-kotak{width:min(640px,100%);display:flex;gap:12px;align-items:flex-start;background:#fffdf5;border:4px solid #3f2a14;border-radius:18px;padding:12px;box-shadow:0 10px 0 rgba(63,42,20,.35),0 20px 50px rgba(0,0,0,.35);animation:g4-naik .3s cubic-bezier(.3,1.3,.5,1)}
  .g4-dlg-kotak.kanan{flex-direction:row-reverse;border-color:#1e3a8a;background:#f8fbff}
  .g4-dlg-kotak.gulungan{border-color:#b45309;background:#fffbeb}
  .g4-dlg-foto{flex:none;width:68px;height:68px;image-rendering:pixelated;background:radial-gradient(circle,#dcfce7,#bbf7d0);border:3px solid #3f2a14;border-radius:14px}
  .g4-dlg-kotak.kanan .g4-dlg-foto{background:radial-gradient(circle,#dbeafe,#bfdbfe);border-color:#1e3a8a}
  .g4-dlg-kotak.gulungan .g4-dlg-foto{background:radial-gradient(circle,#fef9c3,#fde68a);border-color:#b45309}
  .g4-dlg-isi{flex:1;min-width:0}.g4-dlg-isi>b{display:inline-block;font-size:12px;font-weight:900;letter-spacing:.4px;text-transform:uppercase;color:#166534;margin-bottom:4px}
  .g4-dlg-kotak.kanan .g4-dlg-isi>b{color:#1e3a8a}.g4-dlg-kotak.kanan .g4-dlg-isi{text-align:right}
  .g4-dlg-teks{font-size:15px;line-height:1.6;color:#1f2937;min-height:48px}
  .g4-dlg-tombol{display:flex;flex-wrap:wrap;gap:8px;justify-content:flex-end;margin-top:10px}
  .g4-dlg-tombol button{border:0;border-radius:12px;padding:10px 14px;font:inherit;font-weight:800;font-size:13.5px;cursor:pointer;background:#e2e8f0;color:#334155;box-shadow:0 3px 0 rgba(0,0,0,.15)}
  .g4-dlg-tombol button.utama{background:linear-gradient(135deg,#16a34a,#15803d);color:#fff}
  .g4-aturan{margin:0;padding-left:20px;font-size:14px;line-height:1.6}.g4-aturan li{margin-bottom:3px}
  .g4-dalil{background:#f0fdf4;border-radius:12px;padding:8px 12px;text-align:center}.g4-dalil .ar{font-family:Amiri,"Traditional Arabic",serif;font-size:22px;line-height:1.8;margin:2px 0;color:#14532d;direction:rtl}
  .g4-dalil small{display:block;font-size:12.5px;color:#334155;margin-bottom:6px}.g4-dalil.kecil{margin-top:8px}.g4-dalil.kecil .ar{font-size:19px}
  .g4-janji{margin:8px 0 0;font-size:13px;font-weight:700;color:#166534;text-align:center}
  .g4-catat{color:#b45309}
  .g4-kisi-temu blockquote{margin:8px 0;padding:10px 12px;border-radius:12px;background:#fef3c7;border-left:5px solid #b45309;font-size:15px;color:#78350f}
  .g4-kisi-temu small{color:#64748b}
  .g4-emas{background:linear-gradient(135deg,#fde68a,#f59e0b);color:#78350f;border-radius:99px;padding:1px 8px}
  .g4-aksibar{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin:8px 0 2px}
  .g4-aksibar button{border:0;border-radius:12px;padding:8px 12px;font:inherit;font-weight:800;font-size:13px;cursor:pointer;background:linear-gradient(180deg,#facc15,#d97706);color:#422006;box-shadow:0 3px 0 #92400e}
  .g4-aksibar button.hijau{background:linear-gradient(180deg,#86efac,#16a34a);color:#052e16;box-shadow:0 3px 0 #14532d}
  .g4-aksibar button.biru{background:linear-gradient(180deg,#7dd3fc,#0284c7);color:#fff;box-shadow:0 3px 0 #075985}
  .g4-aksibar button.merah{background:linear-gradient(180deg,#fca5a5,#dc2626);color:#fff;box-shadow:0 3px 0 #7f1d1d}
  .g4-aksibar button:active{transform:translateY(2px);box-shadow:none}
  .g4-toko{width:min(560px,100%);max-height:86vh;overflow:auto;background:#fffbeb;border:4px solid #92400e;border-radius:18px;padding:12px;box-shadow:0 10px 0 rgba(146,64,14,.35),0 20px 50px rgba(0,0,0,.35);animation:g4-naik .3s cubic-bezier(.3,1.3,.5,1)}
  .g4-toko-atas{display:flex;align-items:center;gap:10px;margin-bottom:10px}.g4-toko-atas img{width:56px;height:56px;image-rendering:pixelated;background:#dcfce7;border:3px solid #92400e;border-radius:12px}
  .g4-toko-atas>div{flex:1;min-width:0}.g4-toko-atas b{display:block;font-size:17px;color:#78350f}.g4-toko-atas small{color:#92400e;font-size:12.5px}
  .g4-toko-emas{flex:none;background:linear-gradient(135deg,#fde68a,#f59e0b);color:#78350f;font-weight:900;border-radius:99px;padding:6px 12px;font-size:14px}
  .g4-barang{display:flex;align-items:center;gap:10px;background:#fff;border:2px solid #fde68a;border-radius:14px;padding:9px 10px;margin-bottom:7px}
  .g4-barang .ik{font-size:28px;flex:none;width:40px;text-align:center}.g4-barang>div{flex:1;min-width:0}.g4-barang b{font-size:14.5px;color:#1f2937}.g4-barang b em{font-style:normal;color:#16a34a}.g4-barang small{display:block;font-size:12px;color:#64748b;line-height:1.4}
  .g4-barang button{flex:none;border:0;border-radius:11px;padding:9px 11px;font:inherit;font-weight:900;font-size:13px;cursor:pointer;background:linear-gradient(180deg,#facc15,#d97706);color:#422006;box-shadow:0 3px 0 #92400e;min-width:84px}
  .g4-barang.mati{opacity:.7}.g4-barang button:disabled{background:#e5e7eb;color:#6b7280;box-shadow:none;cursor:default;font-weight:700}
  .g4-toko-ket{font-size:12px;color:#92400e;margin:6px 2px}
  .g4-lencana{display:flex;align-items:center;gap:10px;margin:12px auto 0;width:fit-content;max-width:100%;padding:8px 14px 8px 8px;border-radius:16px;background:linear-gradient(135deg,rgba(253,230,138,.95),rgba(245,158,11,.95));color:#422006;box-shadow:0 6px 20px rgba(245,158,11,.35);animation:g4-lencana 1s cubic-bezier(.3,1.6,.5,1)}
  .g4-lencana .med{font-size:30px;filter:drop-shadow(0 2px 3px rgba(0,0,0,.25))}.g4-lencana b{display:block;font-size:14px}.g4-lencana small{font-size:11.5px}
  @keyframes g4-lencana{from{transform:scale(.4) rotate(-8deg);opacity:0}}
  `;
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
})();
// uji coba: layar petunjuk sudah tergambar sebelum file ini termuat → gambar ulang supaya pilihan "Berburu Peti" muncul
(function () {
  if (typeof window.tampilHasil !== "function") return;
  const asli = window.tampilHasil;
  window.tampilHasil = async function () {
    const pindah = S.pindahTab || 0, ujian = S.sesi && (S.sesi.mode === "ujian" || S.coba);
    const h = await asli.apply(this, arguments);
    try {
      if (ujian && !pindah && !document.querySelector(".g4-lencana")) {
        const kp = document.querySelector(".h4-hero .h4-kepala"); if (!kp) return h;
        const el = document.createElement("div"); el.className = "g4-lencana";
        el.innerHTML = `<span class="med">🏅</span><span><b>Lencana Jujur</b><small>Tidak sekali pun keluar dari halaman ujian. Barakallahu fiik!</small></span>`;
        kp.after(el);
      }
    } catch (e) {}
    return h;
  };
})();
if (typeof S !== "undefined" && S.coba && !document.querySelector(".kartu-soal") && document.querySelector(".g2-pilih-coba")) { document.querySelector(".g2-pilih-coba").remove(); window.tampilPetunjuk({}); }

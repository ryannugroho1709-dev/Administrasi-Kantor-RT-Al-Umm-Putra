// ============================================================
//  MODE GAME — Ruang Santri (santri.html)
//  Soal tetap dari guru (bank soal yang sama), hanya CARA MENJAWABNYA yang berupa permainan:
//    🚀 roket   : tiap soal dijawab roket melaju menuju planet
//    🎈 tangkap : pilihan jawaban melayang sebagai balon, ketuk balon yang benar
//    🏰 menara  : tiap soal dijawab naik satu lantai menara
//  Berlaku untuk Pilihan Ganda, PG Kompleks & Benar/Salah. Soal uraian tetap dengan tampilan biasa.
//  KUNCI JAWABAN TIDAK PERNAH dikirim ke HP santri: selama main, santri tidak tahu benar/salah.
//  Setelah dikirim & dinilai server, adegan akhir memperlihatkan hasilnya (bila guru membuka rincian).
//  Gaya dipilih guru saat membuka sesi → kuliah_pengaturan "ujian:tampilan" { sesiId: "roket" | ... }.
// ============================================================
const GAME = {
  roket: { ikon: "🚀", nama: "Balapan Roket", tujuan: "🪐", latar: "linear-gradient(180deg,#0b1030,#1b2a6b 60%,#3b4fb8)", jejak: "✨" },
  tangkap: { ikon: "🎈", nama: "Tangkap Jawaban", tujuan: "🧺", latar: "linear-gradient(180deg,#7dd3fc,#bae6fd 55%,#ecfccb)", jejak: "🎈" },
  menara: { ikon: "🏰", nama: "Panjat Menara", tujuan: "🚩", latar: "linear-gradient(180deg,#fde68a,#fdba74 55%,#f97316)", jejak: "🧱" },
};
const _G_WARNA_BALON = ["#ef4444", "#3b82f6", "#22c55e", "#f59e0b", "#a855f7", "#ec4899", "#14b8a6", "#f97316", "#6366f1", "#84cc16"];

(function pasangGayaGame() {
  const css = `
  .g-hud{position:sticky;top:0;z-index:20;color:#fff;padding:10px 14px 12px;box-shadow:0 6px 20px rgba(0,0,0,.18)}
  .g-hud-isi{max-width:760px;margin:0 auto;display:flex;align-items:center;gap:10px}
  .g-hud .nm{flex:1;min-width:0;font-size:12px;opacity:.9;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.g-hud .nm b{display:block;font-size:14.5px;opacity:1}
  .g-hud .waktu{background:rgba(255,255,255,.18);border-radius:99px;padding:5px 10px;font-weight:800;font-size:13px;font-variant-numeric:tabular-nums}
  .g-hud .waktu.kritis{background:#ef4444}
  .g-lintas{position:relative;max-width:760px;margin:10px auto 0;height:54px;border-radius:16px;background:rgba(255,255,255,.14);overflow:hidden}
  .g-lintas .garis{position:absolute;left:14px;right:46px;top:50%;border-top:3px dashed rgba(255,255,255,.45)}
  .g-lintas .tujuan{position:absolute;right:8px;top:50%;transform:translateY(-50%);font-size:30px}
  .g-lintas .pemain{position:absolute;top:50%;font-size:32px;transform:translate(-50%,-50%) rotate(var(--rot,0deg));transition:left .7s cubic-bezier(.3,1.4,.5,1);filter:drop-shadow(0 3px 4px rgba(0,0,0,.3))}
  .g-lintas .jejak{position:absolute;top:50%;transform:translate(-50%,-50%);font-size:12px;opacity:.75}
  .g-menara{position:relative;max-width:760px;margin:10px auto 0;height:118px;display:flex;align-items:flex-end;justify-content:center;gap:2px;border-radius:16px;background:rgba(255,255,255,.14);overflow:hidden;padding-bottom:6px;border-bottom:4px solid rgba(120,53,15,.45)}
  .g-menara .lantai{width:46px;height:8px;border-radius:3px;background:rgba(255,255,255,.35)}
  .g-menara .tumpuk{display:flex;flex-direction:column-reverse;align-items:center;gap:2px}
  .g-menara .bata{width:58px;height:7px;border-radius:2px;background:#9a3412;box-shadow:inset 0 -2px 0 rgba(0,0,0,.25),inset 0 1px 0 rgba(255,255,255,.3);animation:g-taruh .45s ease both}
  .g-menara .bata.kosong{background:rgba(255,255,255,.22);box-shadow:none}
  .g-menara .orang{font-size:24px;line-height:1;margin-bottom:1px;animation:g-lompat .6s ease}
  .g-menara .info{position:absolute;right:6px;top:4px;font-weight:800;font-size:12px;background:rgba(0,0,0,.18);padding:3px 9px;border-radius:99px}
  @keyframes g-taruh{from{transform:translateY(-30px);opacity:0}to{transform:none;opacity:1}}
  @keyframes g-lompat{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
  @keyframes g-ambang{0%{transform:translate(var(--x0),0)}100%{transform:translate(var(--x1),0)}}
  @keyframes g-goyang{0%,100%{transform:translateY(0) rotate(-3deg)}50%{transform:translateY(-12px) rotate(3deg)}}
  @keyframes g-pecah{0%{transform:scale(1)}50%{transform:scale(1.25)}100%{transform:scale(0);opacity:0}}
  .g-kartu{position:relative}
  .g-langit{position:relative;min-height:240px;border-radius:18px;overflow:hidden;margin-top:12px;padding:10px 6px 16px;display:flex;flex-wrap:wrap;justify-content:center;align-content:flex-start;gap:14px 10px}
  .g-balon{position:relative;width:min(46%,180px);min-height:104px;border:0;border-radius:50% 50% 46% 46%/55% 55% 45% 45%;color:#fff;font-weight:700;font-size:13.5px;line-height:1.35;padding:16px 12px 18px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;box-shadow:inset -10px -12px 0 rgba(0,0,0,.12),0 8px 16px rgba(0,0,0,.15);animation:g-goyang 3.2s ease-in-out infinite;cursor:pointer}
  .g-balon::after{content:"";position:absolute;bottom:-18px;left:50%;width:2px;height:20px;background:rgba(0,0,0,.25)}
  .g-balon .huruf{background:rgba(255,255,255,.28);border-radius:99px;padding:1px 9px;font-weight:800;font-size:12px}
  .g-balon.dipilih{outline:4px solid #fff;outline-offset:2px;box-shadow:0 0 0 8px rgba(255,255,255,.35),inset -10px -12px 0 rgba(0,0,0,.12)}
  .g-balon.pecah{animation:g-pecah .45s ease forwards}
  .g-balon img{max-width:100%;max-height:70px;border-radius:8px;background:#fff}
  .g-opsi{display:grid;gap:10px;margin-top:12px}
  .g-opsi button{display:flex;align-items:center;gap:12px;text-align:left;border:0;border-radius:16px;padding:14px;font-weight:700;font-size:15px;color:#fff;background:var(--gw);box-shadow:0 5px 0 rgba(0,0,0,.2);transition:transform .1s,box-shadow .1s}
  .g-opsi button:active{transform:translateY(4px);box-shadow:0 1px 0 rgba(0,0,0,.2)}
  .g-opsi button .huruf{flex:none;width:32px;height:32px;border-radius:10px;background:rgba(255,255,255,.25);display:grid;place-items:center;font-weight:800}
  .g-opsi button.dipilih{outline:4px solid #fde047;outline-offset:2px}
  .g-opsi button img{max-height:70px;border-radius:8px;background:#fff;display:block;margin-top:4px}
  .g-bs{display:grid;gap:10px;margin-top:12px}.g-bs-baris{background:#f8fafc;border-radius:14px;padding:10px 12px}
  .g-bs-baris .t{font-weight:600;margin-bottom:8px}.g-bs-baris .p{display:flex;gap:8px}
  .g-bs-baris .p button{flex:1;border:0;border-radius:12px;padding:10px;font-weight:800;color:#fff;box-shadow:0 4px 0 rgba(0,0,0,.18)}
  .g-bs-baris .p .ya{background:#16a34a}.g-bs-baris .p .tidak{background:#dc2626}.g-bs-baris .p button.redup{opacity:.35}
  .g-lanjut{margin-top:14px;width:100%}
  .g-sorak{position:fixed;left:50%;top:40%;transform:translate(-50%,-50%);font-size:68px;z-index:60;pointer-events:none;animation:g-pecah 1s ease forwards}
  .g-adegan{border-radius:18px;color:#fff;padding:16px;text-align:center;margin-bottom:14px;overflow:hidden;position:relative}
  .g-adegan h3{margin:0 0 4px;font-size:18px}.g-adegan p{margin:0;opacity:.92;font-size:13px}
  .g-adegan .baris{display:flex;flex-wrap:wrap;justify-content:center;gap:4px;margin-top:10px;font-size:22px}
  .g-intro{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:10px 0}
  .g-intro div{border-radius:14px;padding:10px 6px;text-align:center;font-size:12px;background:#f1f5f9}.g-intro b{display:block;font-size:24px}
  `;
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
})();

// ── Ambil gaya permainan untuk sesi (sekali per buka halaman) ──
async function gameMuatGaya() {
  if (S.gayaMap) return S.gayaMap;
  try {
    const { data } = await supa.from("kuliah_pengaturan").select("nilai").eq("kunci", "ujian:tampilan").maybeSingle();
    S.gayaMap = (data && data.nilai) || {};
  } catch (e) { S.gayaMap = {}; }
  return S.gayaMap;
}
const gameAktif = () => !!(S.gaya && GAME[S.gaya]);
const _gSoalGame = (s) => s && (s.jenis === "pg" || s.jenis === "pgk");
function gameDaftar() { return S.soal.map((s, i) => (_gSoalGame(s) ? i : -1)).filter((i) => i >= 0); }

// Dipanggil dari mulaiKerja(): mulai permainan dari soal game pertama yang belum dijawab
function gameMulai() {
  const d = gameDaftar();
  if (!d.length) { tampilSoal(); return; }
  const belum = d.find((i) => !sudahDijawab(S.soal[i]));
  if (belum === undefined) { gameSelesaiBagian(); return; }
  S.idx = belum; S.gPilih = null;
  gameTampil();
}

function _gHud() {
  const g = GAME[S.gaya], d = gameDaftar(), sudah = d.filter((i) => sudahDijawab(S.soal[i])).length, total = d.length;
  const persen = total ? sudah / total : 0;
  let arena;
  if (S.gaya === "menara") {
    const maks = Math.min(total, 9), naik = Math.round(persen * maks);
    arena = `<div class="g-menara"><div class="tumpuk">${Array.from({ length: naik }, (_, i) => `<div class="bata"></div>`).join("")}<div class="orang">${naik >= maks ? "🚩" : "🧗"}</div></div><span class="info">🏰 Lantai ${sudah}/${total}</span></div>`;
  } else {
    const kiri = 14 + persen * 72;
    const jejak = Array.from({ length: Math.floor(persen * 8) }, (_, i) => `<span class="jejak" style="left:${8 + (i + 0.5) * ((kiri - 8) / Math.max(1, Math.floor(persen * 8)))}%">${g.jejak}</span>`).join("");
    arena = `<div class="g-lintas"><div class="garis"></div>${jejak}<span class="tujuan">${g.tujuan}</span><span class="pemain" style="left:${kiri}%;--rot:${S.gaya === "roket" ? "45deg" : "0deg"}">${g.ikon}</span></div>`;
  }
  return `<div class="g-hud" style="background:${g.latar}"><div class="g-hud-isi">
      <div class="nm"><b>${g.ikon} ${esc(g.nama)}</b>${esc(S.murid.nama)} · soal ${sudah + 1 > total ? total : sudah + 1}/${total}</div>
      ${S.sisa !== null ? `<span class="waktu" id="waktu">⏱ --:--</span>` : ""}
      <span id="simpan-info" style="font-size:11px;opacity:.85">☁️</span></div>${arena}</div>`;
}

function gameTampil() {
  const s = S.soal[S.idx]; if (!s) return;
  const ar = soalArab(s), stimulus = s.stimulus || s.stimulusBagian, stimTeks = typeof stimulus === "object" && stimulus ? stimulus.teks : stimulus;
  const huruf = ar ? HURUF_AR : HURUF;
  let isi = "";
  if (s.bs) {
    const jw = S.gPilih || (S.jawab.pgk[s.no] || []).slice();
    S.gPilih = jw;
    isi = `<div class="petunjuk">🟢 Pilih <b>${esc(s.bs[0])}</b> atau <b>${esc(s.bs[1])}</b> untuk setiap pernyataan.</div>
      <div class="g-bs">${s.urutanOpsi.map((asli, k) => `<div class="g-bs-baris"><div class="t" dir="auto">${k + 1}. ${fmt(s.o[asli])}</div><div class="p">
        <button class="ya ${jw[asli] === false ? "redup" : ""}" onclick="gameBS(${asli},true)">✔ ${esc(s.bs[0])}</button><button class="tidak ${jw[asli] === true ? "redup" : ""}" onclick="gameBS(${asli},false)">✖ ${esc(s.bs[1])}</button></div></div>`).join("")}</div>
      <button class="tombol lebar g-lanjut" onclick="gameKunci()" ${s.o.every((_, i) => jw[i] === true || jw[i] === false) ? "" : "disabled"}>Kunci jawaban & lanjut ▶</button>`;
  } else if (S.gaya === "tangkap") {
    const multi = s.jenis === "pgk", dipilih = S.gPilih || (multi ? (S.jawab.pgk[s.no] || []).slice() : []);
    S.gPilih = dipilih;
    isi = `${multi ? `<div class="petunjuk">☑️ Tangkap <b>lebih dari satu</b> balon yang benar, lalu tekan Kunci.</div>` : `<div class="petunjuk">🎈 Ketuk balon jawaban yang benar!</div>`}
      <div class="g-langit" style="background:${GAME.tangkap.latar}" ${ar ? 'dir="rtl"' : ""}>${s.urutanOpsi.map((asli, k) => `<button class="g-balon ${dipilih.includes(asli) ? "dipilih" : ""}" id="gb-${asli}" style="background:${_G_WARNA_BALON[k % _G_WARNA_BALON.length]};animation-delay:${-k * 0.6}s;animation-duration:${2.6 + (k % 3) * 0.5}s" onclick="gamePilih(${asli})"><span class="huruf">${huruf[k]}</span><span dir="auto">${fmt(s.o[asli])}</span>${s.og && s.og[asli] ? `<img src="${esc(s.og[asli])}" alt="">` : ""}</button>`).join("")}</div>
      ${multi ? `<button class="tombol lebar g-lanjut" onclick="gameKunci()" ${dipilih.length ? "" : "disabled"}>Kunci jawaban & lanjut ▶</button>` : ""}`;
  } else {
    const multi = s.jenis === "pgk", dipilih = S.gPilih || (multi ? (S.jawab.pgk[s.no] || []).slice() : []);
    S.gPilih = dipilih;
    const warna = S.gaya === "roket" ? ["#2563eb", "#7c3aed", "#db2777", "#0891b2", "#4f46e5", "#9333ea"] : ["#ea580c", "#b45309", "#dc2626", "#ca8a04", "#c2410c", "#be123c"];
    isi = `${multi ? `<div class="petunjuk">☑️ Pilih <b>lebih dari satu</b> jawaban, lalu tekan Kunci.</div>` : ""}
      <div class="g-opsi" ${ar ? 'dir="rtl"' : ""}>${s.urutanOpsi.map((asli, k) => `<button style="--gw:${warna[k % warna.length]}" class="${dipilih.includes(asli) ? "dipilih" : ""}" onclick="gamePilih(${asli})"><span class="huruf">${huruf[k]}</span><span dir="auto">${fmt(s.o[asli])}${s.og && s.og[asli] ? `<img src="${esc(s.og[asli])}" alt="">` : ""}</span></button>`).join("")}</div>
      ${multi ? `<button class="tombol lebar g-lanjut" onclick="gameKunci()" ${dipilih.length ? "" : "disabled"}>Kunci jawaban & lanjut ▶</button>` : ""}`;
  }
  render(_gHud() + `<div class="wadah" style="margin-top:14px"><div class="kartu kartu-soal g-kartu ${ar ? "arab" : ""}" style="--warna:${WARNA[s.jenis]}">
      ${stimTeks ? `<div class="stimulus" dir="auto"><span class="lbl">📖 Bacalah teks berikut</span>${fmt(stimTeks)}</div>` : ""}
      ${s.sg ? gambarHTML(s.sg) : ""}
      <div class="teks-soal" dir="auto">${fmt(s.t)}</div>${gambarHTML(s.g)}
      ${isi}
    </div>
    <p class="catatan-kaki">Jawaban yang sudah dikunci tidak bisa diubah. Nilai keluar setelah semua dikirim.</p></div>`);
  perbaruiWaktu();
}

function gamePilih(asli) {
  const s = S.soal[S.idx];
  if (s.jenis === "pg") {
    S.jawab.pg[s.no] = asli; berubah();
    const el = $("gb-" + asli); if (el) el.classList.add("pecah");
    _gSorak(); setTimeout(gameLanjut, el ? 450 : 350);
    return;
  }
  const a = new Set(S.gPilih || []); a.has(asli) ? a.delete(asli) : a.add(asli);
  S.gPilih = [...a].sort((x, y) => x - y); gameTampil();
}
function gameBS(i, nilai) {
  const s = S.soal[S.idx], a = (S.gPilih || []).slice();
  while (a.length < s.o.length) a.push(null);
  a[i] = a[i] === nilai ? null : nilai; S.gPilih = a; gameTampil();
}
function gameKunci() {
  const s = S.soal[S.idx], a = S.gPilih || [];
  if (!adaIsi(a)) return;
  S.jawab.pgk[s.no] = a; berubah(); _gSorak(); setTimeout(gameLanjut, 350);
}
function _gSorak() {
  const e = document.createElement("div"); e.className = "g-sorak";
  e.textContent = S.gaya === "roket" ? "🚀" : S.gaya === "menara" ? "🧱" : "🎉";
  document.body.appendChild(e); setTimeout(() => e.remove(), 1000);
}
function gameLanjut() {
  S.gPilih = null;
  const d = gameDaftar(), sisa = d.filter((i) => !sudahDijawab(S.soal[i]));
  if (!sisa.length) { gameSelesaiBagian(); return; }
  S.idx = sisa.find((i) => i > S.idx) ?? sisa[0];
  gameTampil();
}
// Semua soal game sudah dijawab → ke soal uraian (tampilan biasa) atau kirim
function gameSelesaiBagian() {
  const g = GAME[S.gaya];
  const uraian = S.soal.findIndex((s) => !_gSoalGame(s));
  if (uraian >= 0) {
    S.gayaSelesai = true;
    dialog(`<div style="text-align:center;font-size:52px">${g.tujuan}</div><h3 style="text-align:center">Bagian permainan selesai!</h3><p style="text-align:center">Tinggal soal <b>uraian</b>. Tulis jawabanmu, lalu kirim.</p><div class="navi"><button class="tombol" onclick="tutupDialog();S.idx=${uraian};tampilSoal()">Lanjut ke uraian ▶</button></div>`);
    return;
  }
  render(_gHud() + `<div class="wadah" style="margin-top:14px"><div class="kartu" style="text-align:center"><div style="font-size:64px">${g.tujuan}</div><h2>${S.gaya === "roket" ? "Roketmu sampai di planet!" : S.gaya === "menara" ? "Kamu sampai di puncak menara!" : "Semua balon sudah ditangkap!"}</h2><p class="ket">Semua soal sudah dijawab. Kirim sekarang untuk melihat hasilnya.</p><div class="navi"><button class="tombol garis" onclick="S.idx=gameDaftar()[0];tampilSoal()">Periksa jawaban</button><button class="tombol emas" onclick="tanyaKirim()">Kirim ✓</button></div></div></div>`);
  perbaruiWaktu();
}

// Petunjuk singkat di layar mulai
function gameIntroHTML() {
  const g = GAME[S.gaya]; if (!g) return "";
  const n = gameDaftar().length;
  const cara = S.gaya === "roket" ? "Setiap soal yang kamu jawab membuat roketmu melaju ke planet 🪐." : S.gaya === "menara" ? "Setiap soal yang kamu jawab menambah satu lantai menaramu 🧱." : "Pilihan jawaban melayang sebagai balon 🎈 — ketuk balon yang benar.";
  return `<div class="g-adegan" style="background:${g.latar}"><div style="font-size:42px">${g.ikon}</div><h3>Mode game: ${esc(g.nama)}</h3><p>${cara}<br>${n} soal permainan · jawaban yang dikunci tidak bisa diubah · benar/salahnya terlihat setelah dikirim.</p></div>`;
}

// Adegan akhir setelah dinilai (pakai rincian server: benar/sebagian/salah, tanpa kunci)
function gameAdeganHasil(r, rinci) {
  const g = GAME[S.gaya]; if (!g || r.nilai_akhir == null) return "";
  const n = Math.round(Number(r.nilai_akhir));
  const soal = rinci && rinci.boleh ? (rinci.soal || []).filter((x) => x.jenis !== "uraian") : null;
  const benar = soal ? soal.filter((x) => x.status === "benar").length : null;
  const ikonSoal = (x) => (x.status === "benar" ? (S.gaya === "roket" ? "⭐" : S.gaya === "menara" ? "🧱" : "🎈") : x.status === "sebagian" ? "🌗" : "💨");
  const judul = S.gaya === "roket" ? (n >= 75 ? "Roketmu mendarat mulus di planet! 🪐" : n >= 50 ? "Roketmu sudah separuh jalan 🚀" : "Roketmu kehabisan bahan bakar ⛽") :
    S.gaya === "menara" ? (n >= 75 ? "Menaramu kokoh sampai puncak! 🚩" : n >= 50 ? "Menaramu sudah setengah jadi 🏗️" : "Menaramu masih perlu banyak bata 🧱") :
    (n >= 75 ? "Keranjangmu penuh balon! 🧺" : n >= 50 ? "Lumayan banyak balon tertangkap 🎈" : "Banyak balon yang lepas, ayo coba lagi 💨");
  return `<div class="g-adegan" style="background:${g.latar}"><div style="font-size:46px">${g.ikon}</div><h3>${judul}</h3>
    <p>${benar !== null ? `${benar} dari ${soal.length} soal permainan benar` : `Nilai ${n}`}</p>
    ${soal ? `<div class="baris">${soal.map(ikonSoal).join("")}</div>` : ""}</div>`;
}

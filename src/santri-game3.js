// ============================================================
//  GAME BERSAMA SATU KELAS — 🏰 Perang Menara Tim & 🌈 Balap Pelangi (tanpa dadu)
//  • Berlaku untuk semua jenis soal & semua sesi (latihan maupun ujian).
//  • HP santri: setiap soal dijawab lalu ditekan "🔒 Kunci Jawaban" → server menilai soal itu saja
//    (ujian_game_jawab) dan hanya memberi tahu benar / sebagian / belum tepat. Kunci tidak dikirim.
//    Jawaban yang sudah dikunci tidak bisa diganti (dipaksa juga di server saat kirim).
//  • Layar proyektor: santri.html?papan=<sesiId> — papan permainan langsung (diperbarui tiap 2 detik).
//  • Gerak di papan = nilai yang sudah diraih (tanpa dadu/undian): semua santri bisa sampai finis bila
//    jawabannya benar. Perang Menara: kekuatan serangan tim = rata-rata nilai anggota tim (adil walau
//    jumlah anggota berbeda).
//  Pilihan game disimpan guru di kv "ujian:tampilan" → { sesiId: { kelas: "menara"|"pelangi", … } }.
// ============================================================
const G3 = { x: {}, papan: null, tPoll: 0, versi: null, kar: null, siap: false, sesiId: null };
const G3_KAR = ["🦊", "🐼", "🐯", "🐸", "🐵", "🦁", "🐰", "🐨", "🐧", "🦄", "🐢", "🐙", "🐝", "🦉", "🐬", "🐘", "🦒", "🐿️", "🐞", "🦋"];
const G3_TIM = [{ nama: "Biru", warna: "#2563eb", muda: "#dbeafe", ikon: "🔵" }, { nama: "Merah", warna: "#dc2626", muda: "#fee2e2", ikon: "🔴" }];

const g3Mode = () => (S.sesi && !S.coba && (S.gameKelasMap || {})[S.sesi.id]) || null;
function g3Aktif() { return !!g3Mode() && G3.versi !== false; }
function g3Terkunci(s) { return g3Aktif() && !!G3.x[s.jenis + "-" + s.no]; }
// Urutan santri sama di HP & proyektor → pembagian tim selang-seling (Biru, Merah, Biru, …)
const g3Urut = (daftar) => daftar.slice().sort((a, b) => (parseInt(a.nis, 10) || 1e9) - (parseInt(b.nis, 10) || 1e9) || a.nama.localeCompare(b.nama, "id"));
function g3TimDari(daftar, id) { const i = g3Urut(daftar).findIndex((x) => x.id === id); return i < 0 ? 0 : i % 2; }
function g3Kemajuan(st, papan) { if (!st) return 0; const p = papan || {}; return p.maks > 0 ? Math.min(1, (st.sk || 0) / p.maks) : p.n ? Math.min(1, (st.n || 0) / p.n) : 0; }
function g3Tim(papan, daftar) {
  const hasil = [{ n: 0, jml: 0, b: 0, anggota: [] }, { n: 0, jml: 0, b: 0, anggota: [] }];
  g3Urut(daftar).forEach((s, i) => {
    const st = (papan.santri || {})[s.id], t = hasil[i % 2];
    if (!st) return; t.n++; t.jml += g3Kemajuan(st, papan); t.b += st.b || 0; t.anggota.push({ ...s, st });
  });
  hasil.forEach((t) => { t.rata = t.n ? t.jml / t.n : 0; });
  // nyawa menara = 100% − kekuatan serangan tim lawan
  hasil[0].nyawa = 1 - hasil[1].rata; hasil[1].nyawa = 1 - hasil[0].rata;
  return hasil;
}

async function g3Siapkan() {
  if (!g3Mode() || (G3.siap && G3.sesiId === S.sesi.id)) return;
  G3.sesiId = S.sesi.id; G3.x = {}; G3.kar = null;
  try { G3.versi = (await rpc("ujian_versi", {})) >= 6; } catch (e) { G3.versi = false; }
  if (!G3.versi) { console.warn("Game kelas butuh SQL_UJIAN_SANTRI_6_GAME_KELAS.sql"); G3.siap = true; return; }
  try { const r = await rpc("ujian_game_saya", { p_sesi: S.sesi.id, p_siswa: S.murid.id }); G3.x = (r && r.x) || {}; G3.kar = (r && r.kar) || null; } catch (e) {}
  G3.siap = true;
  g3Poll();
}
async function g3Poll() {
  clearTimeout(G3.tPoll);
  if (!g3Aktif() || S.terkirim) return;
  try { G3.papan = await rpc("ujian_game_papan", { p_sesi: S.sesi.id }); g3PerbaruiHud(); } catch (e) {}
  G3.tPoll = setTimeout(g3Poll, document.hidden ? 9000 : 4000);
}

// ── Layar petunjuk: pilih karakter (Pelangi) / lihat tim (Menara) ──
(function () {
  const asli = window.tampilPetunjuk; if (typeof asli !== "function") return;
  window.tampilPetunjuk = function () {
    const h = asli.apply(this, arguments);
    if (!g3Mode()) return h;
    g3Siapkan().then(() => {
      const kartu = document.querySelector("#akar .kartu"); if (!kartu || kartu.querySelector(".g3-intro")) return;
      if (!G3.versi) { kartu.insertAdjacentHTML("afterbegin", `<div class="g3-intro" style="background:#fef3c7;color:#92400e">⚠️ Game kelas belum aktif di server (minta admin menjalankan pembaruan database). Kerjakan seperti biasa.</div>`); return; }
      const mode = g3Mode();
      if (mode === "menara") {
        const t = G3_TIM[g3TimDari(S.siswa || [], S.murid.id)];
        kartu.insertAdjacentHTML("afterbegin", `<div class="g3-intro" style="background:linear-gradient(135deg,${t.warna},#0f172a)"><div style="font-size:44px">🏰</div><h3>Perang Menara Tim</h3><p>Kamu masuk <b>Tim ${t.nama} ${t.ikon}</b>. Setiap jawaban benar menembakkan meriam ke menara lawan! Tekan <b>🔒 Kunci Jawaban</b> di setiap soal.</p></div>`);
      } else {
        kartu.insertAdjacentHTML("afterbegin", `<div class="g3-intro" style="background:linear-gradient(135deg,#ec4899,#f59e0b,#22c55e,#3b82f6,#8b5cf6)"><div style="font-size:44px">🌈</div><h3>Balap Pelangi</h3><p>Pilih karaktermu! Setiap jawaban benar membuat karaktermu maju di jalur pelangi. Tanpa dadu — yang menentukan hanya ilmumu. 😊</p>
          <div class="g3-kar">${G3_KAR.map((k) => `<button class="${G3.kar === k ? "on" : ""}" data-k="${k}">${k}</button>`).join("")}</div></div>`);
        kartu.querySelectorAll(".g3-kar button").forEach((b) => b.addEventListener("click", async () => {
          G3.kar = b.dataset.k; kartu.querySelectorAll(".g3-kar button").forEach((x) => x.classList.toggle("on", x === b));
          try { await rpc("ujian_game_profil", { p_sesi: S.sesi.id, p_siswa: S.murid.id, p_kar: G3.kar }); } catch (e) {}
        }));
      }
    });
    return h;
  };
  const kerjaAsli = window.mulaiKerja;
  if (typeof kerjaAsli === "function") window.mulaiKerja = function () {
    if (g3Mode()) S.gayaSelesai = true; // game kelas aktif → mode Roket/Balon/Menara lama tidak dipakai
    if (g3Mode() && !G3.siap) { g3Siapkan().then(() => kerjaAsli.apply(this, arguments)); return; }
    if (g3Mode() && G3.versi && !G3.kar && g3Mode() === "pelangi") { G3.kar = G3_KAR[Math.abs([...S.murid.id].reduce((a, c) => a + c.charCodeAt(0), 0)) % G3_KAR.length]; rpc("ujian_game_profil", { p_sesi: S.sesi.id, p_siswa: S.murid.id, p_kar: G3.kar }).catch(() => {}); }
    return kerjaAsli.apply(this, arguments);
  };
})();

// ── Tampilan soal: papan mini di atas + tombol Kunci / hasil di bawah ──
function g3HudHTML() {
  const p = G3.papan || { santri: {}, maks: 0, n: 0 }, mode = g3Mode();
  if (mode === "menara") {
    const tim = g3Tim(p, S.siswa || []), saya = g3TimDari(S.siswa || [], S.murid.id);
    return `<div class="g3-hud menara"><span class="t" style="--w:${G3_TIM[0].warna}">🏰 Biru</span>
      <div class="bar"><i style="width:${Math.round(tim[0].nyawa * 100)}%;background:${G3_TIM[0].warna}"></i></div><b class="vs">VS</b>
      <div class="bar kanan"><i style="width:${Math.round(tim[1].nyawa * 100)}%;background:${G3_TIM[1].warna}"></i></div><span class="t" style="--w:${G3_TIM[1].warna}">Merah 🏰</span>
      <small>Timmu: <b style="color:${G3_TIM[saya].warna}">${G3_TIM[saya].nama}</b> · nyawa menara</small></div>`;
  }
  const semua = Object.entries(p.santri || {}).map(([id, st]) => ({ id, st, k: g3Kemajuan(st, p) })).sort((a, b) => b.k - a.k || String(a.st.t || "9").localeCompare(String(b.st.t || "9")));
  const ke = semua.findIndex((x) => x.id === S.murid.id) + 1, saya = semua.find((x) => x.id === S.murid.id);
  return `<div class="g3-hud pelangi"><div class="lintas">${semua.slice(0, 12).map((x) => `<span class="lain ${x.id === S.murid.id ? "saya" : ""}" style="left:${4 + x.k * 88}%">${esc((x.id === S.murid.id ? G3.kar : x.st.kar) || "🙂")}</span>`).join("")}<span class="finis">🏁</span></div>
    <small>${ke ? `Peringkat <b>${ke}</b> dari ${semua.length}` : "Belum ada yang maju"} · kemajuanmu <b>${Math.round((saya ? saya.k : 0) * 100)}%</b></small></div>`;
}
function g3PerbaruiHud() { const el = document.getElementById("g3-hud"); if (el) el.innerHTML = g3HudHTML(); }
(function () {
  const asli = window.tampilSoal; if (typeof asli !== "function") return;
  window.tampilSoal = function () {
    const h = asli.apply(this, arguments);
    if (!g3Aktif() || !G3.siap) return h;
    const s = S.soal[S.idx], kartu = document.querySelector(".kartu-soal"); if (!s || !kartu) return h;
    kartu.insertAdjacentHTML("beforebegin", `<div id="g3-hud">${g3HudHTML()}</div>`);
    const x = G3.x[s.jenis + "-" + s.no], mode = g3Mode();
    if (x) {
      kartu.classList.add("g3-kunci");
      const t = { benar: ["✅", "Benar!", "#16a34a"], sebagian: ["🌗", "Sebagian benar", "#d97706"], salah: ["❌", "Belum tepat", "#dc2626"], uraian: ["📝", "Terkirim — dinilai ustadz", "#2563eb"] }[x.st] || ["🔒", "Terkunci", "#64748b"];
      kartu.insertAdjacentHTML("beforeend", `<div class="g3-hasil" style="--w:${t[2]}"><span>${t[0]}</span><b>${t[1]}</b>${x.st !== "uraian" ? `<em>+${Number(x.d || 0)} poin</em>` : ""}<small>Jawaban sudah dikunci</small></div>`);
    } else {
      kartu.insertAdjacentHTML("beforeend", `<button class="g3-tombol ${mode}" onclick="g3Kunci()">🔒 Kunci Jawaban & ${mode === "menara" ? "Tembak Meriam! 💥" : "Maju! 🌈"}</button>`);
    }
    return h;
  };
})();
function g3NilaiJawab(s) {
  if (s.jenis === "pg") return S.jawab.pg[s.no];
  if (s.jenis === "uraian") return String(S.jawab.uraian[s.no] || "");
  return (S.jawab[s.jenis] || {})[s.no] || null;
}
async function g3Kunci() {
  const s = S.soal[S.idx]; if (!s || G3.x[s.jenis + "-" + s.no] || G3.sibuk) return;
  if (!sudahDijawab(s)) { dialog(`<h3>✍️ Jawab dulu</h3><p>Pilih / isi jawabanmu untuk soal ini, baru tekan <b>🔒 Kunci Jawaban</b>.</p><div class="navi"><button class="tombol" onclick="tutupDialog()">Oke</button></div>`); return; }
  const tombol = document.querySelector(".g3-tombol"); if (tombol) { tombol.disabled = true; tombol.textContent = "Memeriksa…"; }
  G3.sibuk = true;
  try {
    const r = await rpc("ujian_game_jawab", { p_sesi: S.sesi.id, p_siswa: S.murid.id, p_jenis: s.jenis, p_no: String(s.no), p_jawab: g3NilaiJawab(s) });
    G3.x[s.jenis + "-" + s.no] = r;
    g3Efek(r);
    tampilSoal(); g3Poll();
    setTimeout(() => g3Berikutnya(), 1400);
  } catch (e) {
    dialog(`<h3>Belum bisa dikunci</h3><p>${esc(pesanGalat(e))}</p><div class="navi"><button class="tombol" onclick="tutupDialog()">Tutup</button></div>`);
    if (tombol) { tombol.disabled = false; tombol.textContent = "🔒 Kunci Jawaban"; }
  } finally { G3.sibuk = false; }
}
function g3Berikutnya() {
  if (!g3Aktif() || S.terkirim) return;
  const belum = S.soal.map((s, i) => (G3.x[s.jenis + "-" + s.no] ? -1 : i)).filter((i) => i >= 0);
  if (!belum.length) {
    dialog(`<div style="text-align:center;font-size:52px">${g3Mode() === "menara" ? "🏰" : "🏁"}</div><h3 style="text-align:center">Semua soal sudah dikunci!</h3><p style="text-align:center">Tekan <b>Kirim</b> untuk menyelesaikan. Lihat papan di layar kelas untuk melihat hasil timmu / posisimu.</p><div class="navi"><button class="tombol garis" onclick="tutupDialog()">Nanti</button><button class="tombol emas" onclick="tutupDialog();tanyaKirim()">Kirim ✓</button></div>`);
    return;
  }
  S.idx = belum.find((i) => i > S.idx) ?? belum[0]; tampilSoal();
}
function g3Efek(r) {
  const mode = g3Mode(), e = document.createElement("div"); e.className = "g3-efek " + r.st;
  const besar = r.st === "benar" ? (mode === "menara" ? "💥" : "🌈") : r.st === "sebagian" ? "🌗" : r.st === "uraian" ? "📝" : "💨";
  const teks = r.st === "benar" ? (mode === "menara" ? "Meriam mengenai menara lawan!" : "Karaktermu melompat maju!") : r.st === "sebagian" ? "Sebagian benar — tetap maju sedikit" : r.st === "uraian" ? "Jawaban terkirim, dinilai ustadz" : "Belum tepat — semangat di soal berikutnya!";
  e.innerHTML = `<div class="b">${besar}</div><div class="t">${teks}</div>${r.st !== "uraian" ? `<div class="p">+${Number(r.d || 0)} poin</div>` : ""}`;
  document.body.appendChild(e); setTimeout(() => e.remove(), 1500);
  try { navigator.vibrate && navigator.vibrate(r.st === "benar" ? [40, 30, 40] : 60); } catch (er) {}
}
// berhenti memantau papan setelah kirim
(function () { const asli = window.tampilHasil; if (typeof asli === "function") window.tampilHasil = function () { clearTimeout(G3.tPoll); G3.siap = false; return asli.apply(this, arguments); }; })();

// ============================================================
//  LAYAR PROYEKTOR: santri.html?papan=<sesiId>
// ============================================================
const P3 = { sesi: null, siswa: [], mode: null, data: null, lama: {}, t: 0, selesai: false, juara: new Set() };
async function papanMulai(id) {
  document.body.classList.add("g3-layar");
  render(`<div class="p3-muat">Menyiapkan papan permainan…</div>`);
  try {
    const { data: se, error } = await supa.from("ujian_sesi").select("id,mode,kelas_id,bank_id,dibuka,kelas:kelas(nama_kelas),bank:ujian_bank(judul,mapel:mapel(nama_mapel))").eq("id", id).single();
    if (error) throw error;
    P3.sesi = se;
    const { data: sis } = await supa.from("siswa").select("id,nama,nis").eq("kelas_id", se.kelas_id).eq("status_aktif", true);
    P3.siswa = g3Urut(sis || []);
    S.gayaMap = null; await gameMuatGaya();
    P3.mode = (S.gameKelasMap || {})[id] || "pelangi";
  } catch (e) { render(`<div class="p3-muat">⚠️ ${esc(pesanGalat(e))}</div>`); return; }
  papanGambarKerangka();
  papanPoll();
}
async function papanPoll() {
  clearTimeout(P3.t);
  try { const d = await rpc("ujian_game_papan", { p_sesi: P3.sesi.id }); papanPerbarui(d); }
  catch (e) { const el = document.getElementById("p3-info"); if (el) el.textContent = /ujian_game_papan|function/.test(e.message || "") ? "⚠️ Jalankan SQL_UJIAN_SANTRI_6_GAME_KELAS.sql di server" : "⚠️ " + pesanGalat(e); }
  P3.t = setTimeout(papanPoll, 2000);
}
const p3Nama = (s) => String(s.nama || "").split(/\s+/)[0];
function papanGambarKerangka() {
  const se = P3.sesi, menara = P3.mode === "menara";
  render(`<div class="p3 ${menara ? "p3-menara" : "p3-pelangi"}">
    <div class="p3-atas"><div><b>${menara ? "🏰 Perang Menara Tim" : "🌈 Balap Pelangi"}</b><small>${esc(se.bank?.judul || "")} · ${esc(se.kelas?.nama_kelas || "")} · ${se.mode === "ujian" ? "Ujian" : "Latihan"}</small></div>
      <span id="p3-info" class="p3-info">Menunggu santri…</span>
      <button onclick="document.documentElement.requestFullscreen&&document.documentElement.requestFullscreen()">⛶ Layar Penuh</button>
      <button onclick="papanAkhiri()">🏁 Akhiri & Umumkan</button></div>
    <div class="p3-panggung" id="p3-panggung">${menara ? papanMenaraKerangka() : papanPelangiKerangka()}</div>
    <div class="p3-samping" id="p3-samping"></div>
  </div>`);
}

// ── 🌈 Balap Pelangi ──
const P3_PETAK = 30;
function p3PosPetak(i) {
  // jalur ular: 3 baris × 10 petak, berbelok bolak-balik (persen dari panggung)
  const per = 10, baris = Math.floor(i / per), kol = i % per, x = baris % 2 === 0 ? kol : per - 1 - kol;
  return [6 + x * 9.8, 80 - baris * 30];
}
function papanPelangiKerangka() {
  const warna = ["#ef4444", "#f97316", "#facc15", "#22c55e", "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899"];
  const tangga = [4, 13, 22], hias = { 0: "🚩", [P3_PETAK - 1]: "🏁" };
  return `<div class="p3-langit"><span class="matahari">☀️</span><span class="awan a1">☁️</span><span class="awan a2">☁️</span><span class="awan a3">☁️</span><div class="pelangi-besar"></div></div>
    ${Array.from({ length: P3_PETAK }, (_, i) => { const [x, y] = p3PosPetak(i); return `<div class="p3-petak" style="left:${x}%;top:${y}%;--w:${warna[i % warna.length]}"><i>${i + 1}</i>${hias[i] || (tangga.includes(i) ? "🪜" : "")}</div>`; }).join("")}
    <div id="p3-pion"></div>`;
}
function papanPelangi(d) {
  const wadah = document.getElementById("p3-pion"); if (!wadah) return;
  const ikut = P3.siswa.filter((s) => d.santri[s.id]).map((s) => ({ ...s, st: d.santri[s.id], k: g3Kemajuan(d.santri[s.id], d) }));
  const perPetak = {};
  ikut.forEach((s) => {
    const posF = s.k * (P3_PETAK - 1), i = Math.floor(posF), f = posF - i;
    const [x0, y0] = p3PosPetak(i), [x1, y1] = p3PosPetak(Math.min(P3_PETAK - 1, i + 1));
    // antar baris (belokan) tidak ditarik miring: pakai petak terdekat
    const lurus = y0 === y1, x = lurus ? x0 + (x1 - x0) * f : f < 0.5 ? x0 : x1, y = lurus ? y0 : f < 0.5 ? y0 : y1;
    const kunci = Math.round(x) + ":" + Math.round(y), ke = (perPetak[kunci] = (perPetak[kunci] || 0) + 1) - 1;
    let el = wadah.querySelector(`[data-id="${s.id}"]`);
    if (!el) { el = document.createElement("div"); el.className = "p3-pion"; el.dataset.id = s.id; wadah.appendChild(el); }
    el.innerHTML = `<span class="e">${esc(s.st.kar || "🙂")}</span><span class="n">${esc(p3Nama(s))}</span>`;
    const dx = (ke % 4) * 1.6 - 2.4, dy = -Math.floor(ke / 4) * 5 - (ke % 2) * 2;
    el.style.left = x + dx + "%"; el.style.top = y + dy - 7 + "%"; el.style.zIndex = 10 + Math.round(y);
    const lama = P3.lama[s.id];
    if (lama && (s.st.sk || 0) > (lama.sk || 0)) { el.classList.remove("lompat"); void el.offsetWidth; el.classList.add("lompat"); }
    if (s.k >= 0.999 && !P3.juara.has(s.id)) { P3.juara.add(s.id); papanSorak(`🏁 ${esc(s.nama)} sampai finis!`, el); }
  });
  const urut = ikut.sort((a, b) => b.k - a.k || String(a.st.t || "9").localeCompare(String(b.st.t || "9")));
  document.getElementById("p3-samping").innerHTML = `<h4>🏆 Klasemen</h4>${urut.slice(0, 12).map((s, i) => `<div class="p3-klas"><span class="no">${["🥇", "🥈", "🥉"][i] || i + 1}</span><span class="e">${esc(s.st.kar || "🙂")}</span><span class="nm">${esc(s.nama)}</span><span class="pr"><i style="width:${Math.round(s.k * 100)}%"></i></span><b>${Math.round(s.k * 100)}%</b></div>`).join("") || "<p>Belum ada santri yang bergabung.</p>"}`;
}

// ── 🏰 Perang Menara Tim ──
const P3_BATA = 60; // 6 kolom × 10 baris
function papanMenaraKerangka() {
  const menara = (t) => `<div class="p3-benteng t${t}" style="--w:${G3_TIM[t].warna}"><div class="bendera">🚩</div><div class="bata-wadah" id="p3-bata-${t}">${Array.from({ length: P3_BATA }, (_, i) => `<i data-i="${i}"></i>`).join("")}</div><div class="pintu"></div><div class="nama">Tim ${G3_TIM[t].nama}</div><div class="nyawa"><i id="p3-nyawa-${t}"></i><span id="p3-nyawa-t-${t}">100%</span></div></div>`;
  return `<div class="p3-langit malam"><span class="bulan">🌙</span><span class="awan a1">☁️</span><span class="awan a2">☁️</span></div><div class="p3-tanah"></div>
    ${menara(0)}${menara(1)}<div class="p3-meriam m0">💣</div><div class="p3-meriam m1">💣</div>
    <div class="p3-pasukan t0" id="p3-pasukan-0"></div><div class="p3-pasukan t1" id="p3-pasukan-1"></div><div id="p3-peluru"></div>`;
}
function papanMenara(d) {
  const tim = g3Tim(d, P3.siswa);
  [0, 1].forEach((t) => {
    const sisa = Math.round(tim[t].nyawa * P3_BATA);
    // bata dirobohkan dari atas, urutan tetap (tidak acak-acakan)
    document.querySelectorAll(`#p3-bata-${t} i`).forEach((b, i) => { const roboh = i < P3_BATA - sisa; if (roboh && !b.classList.contains("roboh")) b.classList.add("roboh"); else if (!roboh) b.classList.remove("roboh"); });
    const bar = document.getElementById("p3-nyawa-" + t); if (bar) bar.style.width = Math.round(tim[t].nyawa * 100) + "%";
    const tx = document.getElementById("p3-nyawa-t-" + t); if (tx) tx.textContent = Math.round(tim[t].nyawa * 100) + "%";
    const ps = document.getElementById("p3-pasukan-" + t);
    if (ps) ps.innerHTML = tim[t].anggota.map((a) => `<span class="${a.st.st !== "mengerjakan" ? "selesai" : ""}" title="${esc(a.nama)}">${esc(inisial(a.nama))}</span>`).join("");
  });
  // tembakan baru: santri yang poinnya bertambah sejak pembaruan lalu
  let urutTembak = 0;
  tim.forEach((t, ti) => t.anggota.forEach((a) => { const lama = P3.lama[a.id]; if (lama && (a.st.sk || 0) > (lama.sk || 0)) { const nm = p3Nama(a), poin = (a.st.sk || 0) - (lama.sk || 0); setTimeout(() => papanTembak(ti, nm, poin), urutTembak++ * 320); } }));
  document.getElementById("p3-samping").innerHTML = `<h4>⚔️ Kekuatan Tim</h4>${[0, 1].map((t) => `<div class="p3-tim" style="--w:${G3_TIM[t].warna};--m:${G3_TIM[t].muda}"><b>${G3_TIM[t].ikon} Tim ${G3_TIM[t].nama}</b><span>${tim[t].n} santri · ${tim[t].b} jawaban benar</span><div class="pr"><i style="width:${Math.round(tim[t].rata * 100)}%"></i></div><small>Serangan ${Math.round(tim[t].rata * 100)}%</small>
    <ol>${tim[t].anggota.slice().sort((a, b) => (b.st.sk || 0) - (a.st.sk || 0)).slice(0, 6).map((a) => `<li>${esc(a.nama)} <em>${Math.round(g3Kemajuan(a.st, d) * 100)}%</em></li>`).join("")}</ol></div>`).join("")}`;
}
function papanTembak(tim, nama, poin) {
  const wadah = document.getElementById("p3-peluru"), panggung = document.getElementById("p3-panggung"); if (!wadah || !panggung) return;
  const W = panggung.clientWidth, H = panggung.clientHeight, dari = tim === 0 ? [W * 0.24, H * 0.62] : [W * 0.76, H * 0.62], ke = tim === 0 ? [W * 0.86, H * 0.42] : [W * 0.14, H * 0.42];
  const bola = document.createElement("div"); bola.className = "p3-bola"; bola.style.background = G3_TIM[tim].warna; wadah.appendChild(bola);
  const label = document.createElement("div"); label.className = "p3-label"; label.textContent = `+${poin} ${nama}`; label.style.left = dari[0] + "px"; label.style.top = dari[1] - 40 + "px"; label.style.color = G3_TIM[tim].warna; wadah.appendChild(label);
  const langkah = 24, tinggi = H * 0.45, kf = Array.from({ length: langkah + 1 }, (_, i) => { const t = i / langkah; return { transform: `translate(${dari[0] + (ke[0] - dari[0]) * t}px,${dari[1] + (ke[1] - dari[1]) * t - Math.sin(Math.PI * t) * tinggi}px)` }; });
  const anim = bola.animate(kf, { duration: 1100, easing: "linear" });
  anim.onfinish = () => {
    bola.remove();
    const ledak = document.createElement("div"); ledak.className = "p3-ledak"; ledak.textContent = "💥"; ledak.style.left = ke[0] + "px"; ledak.style.top = ke[1] + "px"; wadah.appendChild(ledak);
    const target = document.querySelector(`.p3-benteng.t${1 - tim}`); if (target) { target.classList.remove("goyang"); void target.offsetWidth; target.classList.add("goyang"); }
    setTimeout(() => ledak.remove(), 800);
  };
  setTimeout(() => label.remove(), 1600);
}

function papanPerbarui(d) {
  P3.data = d;
  const ikut = Object.keys(d.santri || {}).length, kirim = Object.values(d.santri || {}).filter((x) => x.st !== "mengerjakan").length;
  const info = document.getElementById("p3-info"); if (info) info.textContent = `${ikut}/${P3.siswa.length} santri bergabung · ${kirim} sudah kirim`;
  if (P3.mode === "menara") papanMenara(d); else papanPelangi(d);
  P3.lama = JSON.parse(JSON.stringify(d.santri || {}));
}
function papanSorak(teks, el) {
  const e = document.createElement("div"); e.className = "p3-sorak"; e.innerHTML = teks; document.body.appendChild(e); setTimeout(() => e.remove(), 2600);
  if (el && typeof g2Konfeti === "function") g2Konfeti(el);
}
function papanAkhiri() {
  const d = P3.data; if (!d) return;
  if (P3.mode === "menara") {
    const tim = g3Tim(d, P3.siswa), m = tim[0].rata === tim[1].rata ? -1 : tim[0].rata > tim[1].rata ? 0 : 1;
    dialog(`<div class="p3-menang" style="--w:${m < 0 ? "#64748b" : G3_TIM[m].warna}"><div class="b">${m < 0 ? "🤝" : "🏆"}</div><h2>${m < 0 ? "SERI!" : `MENANG! Tim ${G3_TIM[m].nama}`}</h2>
      <div class="kotak">${[0, 1].map((t) => `<div><b>${G3_TIM[t].ikon} ${G3_TIM[t].nama}</b><span>Serangan ${Math.round(tim[t].rata * 100)}%</span><span>${tim[t].b} benar · ${tim[t].n} santri</span><span>Menara tersisa ${Math.round(tim[t].nyawa * 100)}%</span></div>`).join("")}</div>
      <p>Barakallahu fiikum — nilai resmi tetap dari ustadz.</p><div class="navi"><button class="tombol" onclick="tutupDialog()">Tutup</button></div></div>`);
  } else {
    const urut = P3.siswa.filter((s) => d.santri[s.id]).map((s) => ({ ...s, st: d.santri[s.id], k: g3Kemajuan(d.santri[s.id], d) })).sort((a, b) => b.k - a.k || String(a.st.t || "9").localeCompare(String(b.st.t || "9")));
    dialog(`<div class="p3-menang" style="--w:#8b5cf6"><div class="b">🌈</div><h2>Juara Balap Pelangi</h2>
      <div class="podium">${[1, 0, 2].map((i) => urut[i] ? `<div class="pd p${i + 1}"><span class="e">${esc(urut[i].st.kar || "🙂")}</span><b>${esc(urut[i].nama)}</b><em>${Math.round(urut[i].k * 100)}%</em><i>${i + 1}</i></div>` : "").join("")}</div>
      <p>Barakallahu fiikum — nilai resmi tetap dari ustadz.</p><div class="navi"><button class="tombol" onclick="tutupDialog()">Tutup</button></div></div>`);
  }
  const k = document.querySelector(".p3-menang"); if (k && typeof g2Konfeti === "function") { g2Konfeti(k); setTimeout(() => g2Konfeti(k), 500); }
}

// ── Gaya ──
(function () {
  const css = `
  .g3-intro{color:#fff;border-radius:16px;padding:14px;text-align:center;margin-bottom:12px}.g3-intro h3{margin:2px 0 4px}.g3-intro p{margin:0;font-size:13px;line-height:1.5}
  .g3-kar{display:flex;flex-wrap:wrap;justify-content:center;gap:6px;margin-top:10px}
  .g3-kar button{width:44px;height:44px;border-radius:12px;border:2px solid rgba(255,255,255,.5);background:rgba(255,255,255,.2);font-size:24px;cursor:pointer;transition:transform .15s}
  .g3-kar button.on{background:#fff;border-color:#fff;transform:scale(1.15);box-shadow:0 6px 16px rgba(0,0,0,.25)}
  #g3-hud{margin:0 0 12px}
  .g3-hud{background:#0f172a;color:#fff;border-radius:16px;padding:10px 12px;box-shadow:0 8px 22px rgba(15,23,42,.25)}
  .g3-hud.menara{display:grid;grid-template-columns:auto 1fr auto 1fr auto;gap:8px;align-items:center;font-weight:800;font-size:12.5px}
  .g3-hud .bar{height:12px;border-radius:99px;background:rgba(255,255,255,.15);overflow:hidden}.g3-hud .bar i{display:block;height:100%;border-radius:99px;transition:width 1s ease}
  .g3-hud .bar.kanan{direction:rtl}.g3-hud .vs{color:#fbbf24}
  .g3-hud small{grid-column:1/-1;text-align:center;font-weight:500;opacity:.85;font-size:11.5px}
  .g3-hud.pelangi .lintas{position:relative;height:38px;border-radius:99px;background:linear-gradient(90deg,#ef4444,#f97316,#facc15,#22c55e,#06b6d4,#3b82f6,#8b5cf6);box-shadow:inset 0 -4px 0 rgba(0,0,0,.2)}
  .g3-hud .lain{position:absolute;top:50%;transform:translate(-50%,-50%);font-size:18px;opacity:.6;transition:left 1s cubic-bezier(.3,1.3,.5,1)}
  .g3-hud .lain.saya{font-size:28px;opacity:1;z-index:2;filter:drop-shadow(0 0 6px #fff)}
  .g3-hud .finis{position:absolute;right:6px;top:50%;transform:translateY(-50%);font-size:20px}
  .g3-hud.pelangi small{display:block;text-align:center;margin-top:6px;font-size:11.5px;opacity:.9}
  .g3-tombol{width:100%;margin-top:14px;border:0;border-radius:16px;padding:14px;font-weight:900;font-size:15.5px;color:#fff;cursor:pointer;box-shadow:0 6px 0 rgba(0,0,0,.25);transition:transform .1s}
  .g3-tombol.menara{background:linear-gradient(135deg,#1d4ed8,#dc2626)}.g3-tombol.pelangi{background:linear-gradient(90deg,#ec4899,#f59e0b,#22c55e,#3b82f6)}
  .g3-tombol:active{transform:translateY(4px);box-shadow:0 2px 0 rgba(0,0,0,.25)}.g3-tombol:disabled{opacity:.7}
  .g3-kunci>*:not(.kepala-soal):not(.teks-soal):not(.stimulus):not(.g3-hasil):not(img){pointer-events:none;opacity:.8}
  .g3-hasil{display:grid;grid-template-columns:auto 1fr auto;gap:2px 10px;align-items:center;margin-top:14px;border:2.5px solid var(--w);border-radius:16px;padding:10px 14px;background:color-mix(in srgb,var(--w) 8%,#fff)}
  .g3-hasil span{grid-row:span 2;font-size:30px}.g3-hasil b{color:var(--w);font-size:16px}.g3-hasil em{font-style:normal;font-weight:900;color:var(--w)}.g3-hasil small{grid-column:2/-1;color:#64748b;font-size:11.5px}
  .g3-efek{position:fixed;left:50%;top:42%;transform:translate(-50%,-50%);z-index:90;text-align:center;pointer-events:none;animation:g3-efek 1.5s ease forwards}
  .g3-efek .b{font-size:84px;filter:drop-shadow(0 10px 20px rgba(0,0,0,.3))}.g3-efek .t{background:#0f172a;color:#fff;font-weight:800;border-radius:99px;padding:8px 16px;font-size:14px;white-space:nowrap}
  .g3-efek .p{margin-top:6px;font-weight:900;font-size:22px;color:#16a34a;text-shadow:0 2px 0 #fff}.g3-efek.salah .p{color:#64748b}
  @keyframes g3-efek{0%{opacity:0;transform:translate(-50%,-30%) scale(.5)}15%{opacity:1;transform:translate(-50%,-50%) scale(1.1)}25%{transform:translate(-50%,-50%) scale(1)}80%{opacity:1}100%{opacity:0;transform:translate(-50%,-70%)}}
  /* ===== layar proyektor ===== */
  body.g3-layar{background:#0b1020;overflow:hidden}
  body.g3-layar #akar{max-width:none}
  .p3-muat{color:#fff;font-size:22px;text-align:center;padding:80px 20px}
  .p3{position:fixed;inset:0;display:grid;grid-template-columns:1fr 300px;grid-template-rows:auto 1fr;color:#0f172a;font-family:inherit}
  .p3-atas{grid-column:1/-1;display:flex;align-items:center;gap:12px;padding:10px 16px;background:rgba(15,23,42,.92);color:#fff}
  .p3-atas>div{flex:1}.p3-atas b{font-size:20px;display:block}.p3-atas small{opacity:.8}
  .p3-atas button{border:0;border-radius:10px;padding:8px 12px;font-weight:800;background:rgba(255,255,255,.15);color:#fff;cursor:pointer}
  .p3-info{background:rgba(255,255,255,.12);border-radius:99px;padding:6px 12px;font-size:13px}
  .p3-panggung{position:relative;overflow:hidden}
  .p3-samping{background:#fff;overflow:auto;padding:12px}
  .p3-samping h4{margin:0 0 8px;font-size:16px}
  .p3-langit{position:absolute;inset:0;background:linear-gradient(180deg,#7dd3fc,#e0f2fe 60%,#bbf7d0)}
  .p3-langit.malam{background:linear-gradient(180deg,#1e1b4b,#4338ca 55%,#fb923c)}
  .p3-langit span{position:absolute;font-size:56px}.matahari{left:4%;top:4%;animation:p3-putar 20s linear infinite}.bulan{left:46%;top:6%}
  .awan{opacity:.9;animation:p3-awan 40s linear infinite}.a1{top:8%;left:-10%}.a2{top:20%;left:-30%;animation-duration:55s!important}.a3{top:3%;left:-50%;animation-duration:70s!important}
  @keyframes p3-awan{to{transform:translateX(160vw)}}@keyframes p3-putar{to{transform:rotate(360deg)}}
  .pelangi-besar{position:absolute;left:50%;bottom:-40%;width:110%;aspect-ratio:2/1;transform:translateX(-50%);border-radius:50% 50% 0 0/100% 100% 0 0;background:radial-gradient(circle at 50% 100%,transparent 58%,#8b5cf6 58% 61%,#3b82f6 61% 64%,#06b6d4 64% 67%,#22c55e 67% 70%,#facc15 70% 73%,#f97316 73% 76%,#ef4444 76% 79%,transparent 79%);opacity:.35}
  .p3-petak{position:absolute;width:8.6%;height:13%;transform:translate(-50%,-50%);border-radius:14px;background:var(--w);box-shadow:0 8px 0 rgba(0,0,0,.18),inset 0 3px 0 rgba(255,255,255,.4);display:grid;place-items:center;font-size:28px}
  .p3-petak i{position:absolute;left:6px;top:3px;font-style:normal;font-weight:900;font-size:12px;color:rgba(255,255,255,.9)}
  .p3-pion{position:absolute;transform:translate(-50%,-50%);display:flex;flex-direction:column;align-items:center;transition:left 1.2s cubic-bezier(.3,1.1,.4,1),top 1.2s cubic-bezier(.3,1.1,.4,1)}
  .p3-pion .e{font-size:40px;line-height:1;filter:drop-shadow(0 4px 3px rgba(0,0,0,.3))}
  .p3-pion .n{background:rgba(15,23,42,.8);color:#fff;font-size:11px;font-weight:800;border-radius:99px;padding:1px 7px;white-space:nowrap;margin-top:-2px}
  .p3-pion.lompat .e{animation:p3-lompat .6s ease 2}
  @keyframes p3-lompat{40%{transform:translateY(-26px) scale(1.15)}}
  .p3-klas{display:grid;grid-template-columns:28px 28px 1fr 60px 40px;gap:6px;align-items:center;padding:6px 4px;border-bottom:1px dashed #e2e8f0;font-size:13px}
  .p3-klas .no{font-weight:900;text-align:center}.p3-klas .e{font-size:22px}.p3-klas .nm{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-weight:700}
  .p3-klas .pr,.p3-tim .pr{height:8px;border-radius:99px;background:#e2e8f0;overflow:hidden}.p3-klas .pr i,.p3-tim .pr i{display:block;height:100%;background:linear-gradient(90deg,#ec4899,#f59e0b,#22c55e,#3b82f6);transition:width 1s}
  .p3-tanah{position:absolute;left:0;right:0;bottom:0;height:22%;background:linear-gradient(180deg,#65a30d,#3f6212)}
  .p3-benteng{position:absolute;bottom:20%;width:18%;display:flex;flex-direction:column;align-items:center}
  .p3-benteng.t0{left:6%}.p3-benteng.t1{right:6%}
  .p3-benteng .bendera{font-size:40px;filter:hue-rotate(var(--h,0deg))}.p3-benteng.t0 .bendera{--h:200deg}
  .bata-wadah{display:grid;grid-template-columns:repeat(6,1fr);gap:3px;width:100%;padding:4px;background:rgba(0,0,0,.2);border-radius:6px 6px 0 0}
  .bata-wadah i{display:block;height:min(3.2vh,26px);border-radius:3px;background:var(--w);box-shadow:inset 0 -3px 0 rgba(0,0,0,.25),inset 0 2px 0 rgba(255,255,255,.3);transition:transform .8s ease-in,opacity .8s}
  .bata-wadah i.roboh{transform:translateY(60px) rotate(40deg);opacity:0}
  .p3-benteng .pintu{width:30%;height:4vh;background:#422006;border-radius:30px 30px 0 0;margin-top:-4vh;position:relative}
  .p3-benteng .nama{margin-top:6px;background:var(--w);color:#fff;font-weight:900;border-radius:99px;padding:4px 14px}
  .p3-benteng .nyawa{position:relative;width:100%;height:16px;border-radius:99px;background:rgba(0,0,0,.35);overflow:hidden;margin-top:6px}
  .p3-benteng .nyawa i{display:block;height:100%;background:linear-gradient(90deg,#22c55e,#facc15);transition:width 1s}
  .p3-benteng .nyawa span{position:absolute;inset:0;display:grid;place-items:center;color:#fff;font-weight:900;font-size:11px}
  .p3-benteng.goyang{animation:p3-goyang .5s}
  @keyframes p3-goyang{20%{transform:translateX(-10px)}40%{transform:translateX(9px)}60%{transform:translateX(-6px)}80%{transform:translateX(3px)}}
  .p3-meriam{position:absolute;bottom:22%;font-size:46px}.p3-meriam.m0{left:25%}.p3-meriam.m1{right:25%;transform:scaleX(-1)}
  .p3-pasukan{position:absolute;bottom:3%;display:flex;flex-wrap:wrap;gap:4px;width:30%}
  .p3-pasukan.t0{left:3%}.p3-pasukan.t1{right:3%;justify-content:flex-end}
  .p3-pasukan span{width:30px;height:30px;border-radius:50%;display:grid;place-items:center;font-size:11px;font-weight:900;color:#fff;border:2px solid #fff}
  .p3-pasukan.t0 span{background:#2563eb}.p3-pasukan.t1 span{background:#dc2626}.p3-pasukan span.selesai{box-shadow:0 0 0 3px #facc15}
  .p3-bola{position:absolute;left:0;top:0;width:22px;height:22px;margin:-11px 0 0 -11px;border-radius:50%;box-shadow:0 0 0 3px #fff,0 0 18px 6px rgba(255,255,255,.6);z-index:30}
  .p3-ledak{position:absolute;font-size:80px;transform:translate(-50%,-50%);animation:p3-ledak .8s ease forwards;z-index:31}
  @keyframes p3-ledak{0%{transform:translate(-50%,-50%) scale(.2)}50%{transform:translate(-50%,-50%) scale(1.3)}100%{transform:translate(-50%,-50%) scale(1);opacity:0}}
  .p3-label{position:absolute;transform:translateX(-50%);font-weight:900;font-size:20px;background:#fff;border-radius:99px;padding:2px 10px;animation:p3-naik 1.6s ease forwards;z-index:32}
  @keyframes p3-naik{to{transform:translate(-50%,-50px);opacity:0}}
  .p3-tim{border-left:6px solid var(--w);background:var(--m);border-radius:12px;padding:10px;margin-bottom:10px}
  .p3-tim b{display:block;font-size:16px;color:var(--w)}.p3-tim span,.p3-tim small{font-size:12px;color:#334155}.p3-tim .pr{margin:6px 0 2px;background:#fff}.p3-tim .pr i{background:var(--w)}
  .p3-tim ol{margin:6px 0 0 18px;padding:0;font-size:12.5px}.p3-tim em{font-style:normal;font-weight:800;color:var(--w)}
  .p3-sorak{position:fixed;left:50%;top:18%;transform:translateX(-50%);z-index:95;background:#fff;border-radius:20px;padding:14px 26px;font-size:28px;font-weight:900;box-shadow:0 20px 50px rgba(0,0,0,.35);animation:g2-muncul 2.6s ease forwards}
  .p3-menang{text-align:center}.p3-menang .b{font-size:72px}.p3-menang h2{color:var(--w);margin:4px 0 10px;font-size:28px}
  .p3-menang .kotak{display:grid;grid-template-columns:1fr 1fr;gap:10px}.p3-menang .kotak div{display:grid;gap:2px;background:#f8fafc;border-radius:12px;padding:10px;font-size:13px}
  .podium{display:flex;align-items:flex-end;justify-content:center;gap:8px;margin:10px 0}
  .podium .pd{display:flex;flex-direction:column;align-items:center;width:110px}.podium .e{font-size:44px}.podium b{font-size:13px}.podium em{font-style:normal;font-weight:800;color:#7c3aed}
  .podium i{display:grid;place-items:center;width:100%;font-style:normal;font-weight:900;font-size:26px;color:#fff;border-radius:10px 10px 0 0;background:linear-gradient(180deg,#a78bfa,#7c3aed)}
  .podium .p1 i{height:110px;background:linear-gradient(180deg,#fde047,#ca8a04)}.podium .p2 i{height:80px;background:linear-gradient(180deg,#e2e8f0,#94a3b8)}.podium .p3 i{height:60px;background:linear-gradient(180deg,#fdba74,#c2410c)}
  @media (max-width:900px){.p3{grid-template-columns:1fr;grid-template-rows:auto 1fr 34%}.p3-pion .e{font-size:26px}.p3-petak{font-size:16px}}
  `;
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
})();

// ============================================================
//  TEMPEL NILAI (Input Nilai Rapor) — guru memilih kolom (UH / Tugas / UTS / UAS), lalu menempel
//  daftar "nama nilai" dari WA / catatan / Excel. Aplikasi mencocokkan nama otomatis:
//   • singkatan & salah ketik dikenali (M = Muhammad, Fadil ≈ Fadhil, Aiman ≈ Ayman, …)
//   • yang ragu / tidak ketemu ditandai — tinggal pilih santri yang benar dari daftar (tidak perlu
//     memperbaiki tulisan), satu santri tidak bisa terpakai dua kali
//   • pilihan guru diingat untuk kelas itu, jadi tempelan berikutnya langsung cocok
//  Nilai hanya DIISIKAN ke tabel (belum tersimpan) → guru memeriksa lalu menekan 💾 Simpan.
// ============================================================
const NT = { baris: [], target: "", santri: [] };
const _NT_SINONIM = { m: "muhammad", muh: "muhammad", moh: "muhammad", mhd: "muhammad", md: "muhammad", muhamad: "muhammad", muhammad: "muhammad", mohammad: "muhammad", mohamad: "muhammad", mochammad: "muhammad", muchammad: "muhammad", mohd: "muhammad",
  abd: "abdul", abdul: "abdul", ahmad: "ahmad", ahmd: "ahmad", achmad: "ahmad", akhmad: "ahmad" };
const _ntAngka = (s) => String(s).replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d)).replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));
const _ntToken = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/['`’]/g, "").replace(/[^a-z0-9]+/g, " ").trim().split(/\s+/).filter(Boolean).map((t) => _NT_SINONIM[t] || t);
const _ntNormal = (s) => _ntToken(s).join(" ");
// bentuk sederhana untuk ejaan nama Arab-Indonesia: dh→d, th→t, kh→h, sy→s, q→k, y→i, huruf ganda → tunggal
const _ntSederhana = (t) => t.replace(/dh/g, "d").replace(/th/g, "t").replace(/kh/g, "h").replace(/sy/g, "s").replace(/ts/g, "s").replace(/q/g, "k").replace(/ph/g, "f").replace(/oe/g, "u").replace(/y/g, "i").replace(/(.)\1+/g, "$1").replace(/h$/, "");
function _ntLev(a, b) {
  if (a === b) return 0;
  const m = a.length, n = b.length; if (!m || !n) return m || n;
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[n];
}
function _ntSkorToken(p, s) {
  if (p === s) return 1;
  if (p.length === 1) return s[0] === p ? 0.55 : 0;
  if (s.length === 1) return p[0] === s ? 0.4 : 0;
  const ps = _ntSederhana(p), ss = _ntSederhana(s);
  if (ps === ss) return 0.93;
  if (p.length >= 3 && s.startsWith(p)) return 0.85;
  if (s.length >= 3 && p.startsWith(s)) return 0.75;
  if (ps.length >= 4 && ss.startsWith(ps)) return 0.78; // Adhiya ≈ Adhyaksa (ejaan disederhanakan)
  const L = Math.max(ps.length, ss.length), d = _ntLev(ps, ss);
  if (L >= 4 && d === 1) return 0.8;
  if (L >= 6 && d === 2) return 0.6;
  return 0;
}
function _ntSkor(pt, st) {
  if (!pt.length || !st.length) return 0;
  const bobot = (t) => (t === "muhammad" || t === "ahmad" || t === "abdul" ? 0.35 : 1);
  const pakai = new Set(); let tot = 0, maks = 0, inti = 0;
  pt.forEach((p) => {
    let best = 0, bi = -1;
    st.forEach((s, i) => { if (pakai.has(i)) return; const v = _ntSkorToken(p, s); if (v > best) { best = v; bi = i; } });
    if (bi >= 0 && best > 0) pakai.add(bi);
    tot += best * bobot(p); maks += bobot(p);
    if (bobot(p) === 1 && best >= 0.6) inti++;
  });
  let skor = tot / maks;
  if (!inti) skor *= 0.45; // hanya "M" / "Muhammad" yang cocok → belum pasti
  const sisa = st.filter((s, i) => !pakai.has(i) && bobot(s) === 1).length;
  return skor * (1 - Math.min(0.15, sisa * 0.04));
}
// "1. M Fadhil 65" · "M Fadhil = 65" · "M Fadhil<TAB>65" · "Fadhil: 87,5"
function _ntUrai(teks) {
  return String(teks || "").replace(/\r/g, "").split("\n").map((b, i) => {
    let s = _ntAngka(b).replace(/[‎‏*_~]/g, "").trim();
    if (!s) return null;
    s = s.replace(/^[0-9]{1,3}\s*[.)\-:]\s*/, "");
    const m = s.match(/^(.*?)[\s:=|,;–\-]*([0-9]{1,3}(?:[.,][0-9]{1,2})?)\s*(?:\/\s*100)?\s*$/);
    if (!m || !m[1].trim()) return { no: i + 1, nama: s.replace(/[\s:=|,;–\-]+$/, ""), nilai: null, galat: "nilai tidak ditemukan di baris ini" };
    const nilai = Number(m[2].replace(",", "."));
    return { no: i + 1, nama: m[1].replace(/^[0-9]{1,3}\s+(?=\D)/, "").replace(/[\s:=|,;–\-]+$/, "").trim(), nilai, galat: nilai < 0 || nilai > 100 ? "nilai harus 0–100" : null };
  }).filter(Boolean);
}
const _ntKunciAlias = () => "nt:alias:" + (qs("nl-kelas")?.value || "");
function _ntAlias() { try { return JSON.parse(localStorage.getItem(_ntKunciAlias()) || "{}") || {}; } catch (e) { return {}; } }
function _ntSimpanAlias(peta) { try { localStorage.setItem(_ntKunciAlias(), JSON.stringify({ ..._ntAlias(), ...peta })); } catch (e) {} }

function _ntCocokkan(baris, santri) {
  const alias = _ntAlias();
  const tk = santri.map((s) => _ntToken(s.nama));
  const skor = baris.map((b) => { const pt = _ntToken(b.nama); return santri.map((s, i) => (b.nama ? _ntSkor(pt, tk[i]) : 0)); });
  const pakaiBaris = new Map(), pakaiSantri = new Set();
  // 1) diingat dari tempelan sebelumnya / nama persis sama
  baris.forEach((b, bi) => {
    if (b.nilai === null) return;
    const n = _ntNormal(b.nama), id = alias[n];
    let si = id ? santri.findIndex((s) => s.id === id) : -1;
    if (si < 0) si = santri.findIndex((s) => _ntNormal(s.nama) === n);
    if (si >= 0 && !pakaiSantri.has(si)) { pakaiBaris.set(bi, { si, pasti: true, ingat: !!id }); pakaiSantri.add(si); }
  });
  // 2) pasangan skor tertinggi lebih dulu (supaya "M Ridha Fajar" dan "M Ridha" tidak berebut)
  const pasang = [];
  skor.forEach((r, bi) => r.forEach((v, si) => { if (v >= 0.45) pasang.push([v, bi, si]); }));
  pasang.sort((a, b) => b[0] - a[0]);
  pasang.forEach(([v, bi, si]) => { if (pakaiBaris.has(bi) || pakaiSantri.has(si) || baris[bi].nilai === null) return; pakaiBaris.set(bi, { si, v }); pakaiSantri.add(si); });
  return baris.map((b, bi) => {
    const r = skor[bi], hit = pakaiBaris.get(bi);
    const saran = r.map((v, si) => [v, si]).filter(([v]) => v >= 0.3).sort((a, b) => b[0] - a[0]).slice(0, 5);
    let status = "tidak", siswaId = "";
    if (hit) {
      siswaId = santri[hit.si].id;
      // pesaing: santri lain yang skornya dekat & tidak dipakai baris lain yang lebih cocok
      const pesaing = r.map((v, si) => [v, si]).filter(([v, si]) => si !== hit.si && !(pakaiSantri.has(si) && [...pakaiBaris.values()].some((x) => x.si === si && (x.pasti || (x.v || 0) >= v)))).reduce((a, [v]) => Math.max(a, v), 0);
      status = hit.pasti || (hit.v >= 0.8 && pesaing < hit.v - 0.1) ? "pasti" : "periksa";
      if (hit.ingat) status = "pasti";
    }
    return { ...b, siswaId, status, saran, skorPilih: hit ? (hit.pasti ? 1 : hit.v) : 0 };
  });
}

// ── Jendela 1: pilih kolom + tempel ──
function nlTempelNilai() {
  if (NILAI_STATE.sub === "rekap") { toast("Pilih tab mapelnya dulu (bukan Rekap rata-rata)", "err"); return; }
  if (!qsa("#input-nilai-table tbody tr[data-siswa]").length) { toast("Tampilkan dulu daftar santri (pilih kelas & mapel)", "err"); return; }
  const P = NILAI_STATE.pola || polaNilai(qs("nl-mapel").value), pk = P.pakai, satu = P.pola === "satu", e = escapeHtml;
  const opsi = [];
  if (pk.uh) { NILAI_STATE.kolomUH.forEach((k) => opsi.push([`uh|${k}`, k])); opsi.push(["uh|+", `＋ Ulangan Harian baru (UH ${NILAI_STATE.kolomUH.length + 1})`]); }
  if (pk.tugas) { NILAI_STATE.kolomTugas.forEach((k) => opsi.push([`tugas|${k}`, k])); opsi.push(["tugas|+", `＋ Tugas baru (Tugas ${NILAI_STATE.kolomTugas.length + 1})`]); }
  if (pk.utsBisa) opsi.push(["uts|", "UTS"]);
  if (pk.uas) opsi.push(["uas|", satu ? "Nilai" : "UAS"]);
  // bawaan: kolom UH/Tugas pertama yang masih kosong, selain itu yang terakhir dipilih
  const kosong = (cls, k) => qsa(`#input-nilai-table .${cls}[data-kolom="${CSS.escape(k)}"]`).every((i) => i.value === "");
  const bawaan = NT.target && opsi.some((o) => o[0] === NT.target) ? NT.target : (opsi.find(([v]) => { const [j, k] = v.split("|"); return (j === "uh" || j === "tugas") && k !== "+" && kosong(j === "uh" ? "nilai-uh" : "nilai-tugas", k); }) || opsi[0])[0];
  openModal(`<div class="nt-modal"><h3>📋 Tempel Nilai</h3>
    <div class="nt-ket">${e(NILAI_STATE.sub || (LOOKUP.mapel || []).find((m) => m.id === qs("nl-mapel").value)?.nama_mapel || "")} · ${e((LOOKUP.kelas || []).find((k) => k.id === qs("nl-kelas").value)?.nama_kelas || "")}</div>
    <label class="field"><span class="form-label">1. Nilai ini untuk kolom</span><select id="nt-target" class="input">${opsi.map(([v, l]) => `<option value="${e(v)}" ${v === bawaan ? "selected" : ""}>${e(l)}</option>`).join("")}</select></label>
    <label class="field"><span class="form-label">2. Tempel nama & nilai (satu santri per baris)</span>
      <textarea id="nt-teks" class="input nt-teks" rows="10" placeholder="1. M Fadhil 65&#10;2. M Dafa 90&#10;3. Rayhan 50&#10;…">${e(NT.teksTerakhir || "")}</textarea></label>
    <div class="nt-kaki">Boleh dari WA, catatan HP, atau salin dari Excel (kolom nama & nilai). Nomor urut di depan diabaikan · "M" dibaca Muhammad · salah ketik nama dikenali.</div>
    <button class="btn btn-accent" style="width:100%;margin-top:10px" onclick="_ntLanjut()">🔎 Cocokkan Nama →</button></div>`);
  setTimeout(() => qs("nt-teks")?.focus(), 60);
}
function _ntLanjut() {
  const teks = qs("nt-teks").value;
  NT.target = qs("nt-target").value; NT.teksTerakhir = teks;
  const baris = _ntUrai(teks);
  if (!baris.length) { toast("Tempel daftar nama & nilainya dulu", "err"); return; }
  NT.santri = NILAI_STATE.rows.map((r) => r.siswa);
  NT.baris = _ntCocokkan(baris, NT.santri);
  _ntGambar();
}
// ── Jendela 2: hasil pencocokan ──
function _ntNilaiLama(siswaId) {
  const [jenis, kolom] = NT.target.split("|");
  if (kolom === "+") return "";
  const tr = document.querySelector(`#input-nilai-table tr[data-siswa="${siswaId}"]`); if (!tr) return "";
  const cls = { uh: "nilai-uh", tugas: "nilai-tugas", uts: "nilai-uts", uas: "nilai-uas" }[jenis];
  const inp = kolom ? tr.querySelector(`.${cls}[data-kolom="${CSS.escape(kolom)}"]`) : tr.querySelector(`.${cls}`);
  return inp ? inp.value : "";
}
function _ntGambar() {
  const e = escapeHtml, B = NT.baris;
  const dipakai = new Map(); B.forEach((b, i) => { if (b.siswaId && b.nilai !== null && !b.galat) dipakai.set(b.siswaId, (dipakai.get(b.siswaId) || []).concat(i)); });
  const ganda = new Set([...dipakai.values()].filter((x) => x.length > 1).flat());
  const n = { pasti: 0, periksa: 0, tidak: 0 };
  B.forEach((b) => { if (b.nilai !== null && !b.galat) n[b.siswaId ? (b.status === "pasti" ? "pasti" : "periksa") : "tidak"]++; });
  const urutNama = NT.santri.slice().sort((a, b) => a.nama.localeCompare(b.nama, "id"));
  const belum = NT.santri.filter((s) => !dipakai.has(s.id));
  const label = NT.target.split("|")[1] === "+" ? `${NT.target.startsWith("uh") ? "Ulangan Harian" : "Tugas"} baru` : NT.target.split("|")[1] || NT.target.split("|")[0].toUpperCase();
  openModal(`<div class="nt-modal nt-lebar"><h3>🔎 Cocokkan Nama</h3>
    <div class="nt-ket">Kolom: <b>${e(label)}</b> · ${B.length} baris ditempel</div>
    <div class="nt-ringkas"><span class="ok">✅ ${n.pasti} Cocok</span><span class="awas">⚠️ ${n.periksa} Periksa</span><span class="bahaya">❓ ${n.tidak} Belum Ketemu</span>${ganda.size ? `<span class="bahaya">⛔ ${ganda.size} baris memilih santri yang sama</span>` : ""}</div>
    <div class="nt-daftar">${B.map((b, i) => {
      const st = b.galat ? "galat" : ganda.has(i) ? "ganda" : !b.siswaId ? "tidak" : b.status;
      const lama = b.siswaId ? _ntNilaiLama(b.siswaId) : "";
      const saranId = new Set(b.saran.map(([, si]) => NT.santri[si].id));
      return `<div class="nt-b ${st}">
        <div class="nt-asal"><small>${b.no}.</small><b>${e(b.nama || "(tanpa nama)")}</b><em>${b.nilai ?? "–"}</em></div>
        ${b.galat ? `<div class="nt-pesan">⛔ ${e(b.galat)} — baris ini dilewati</div>` : `
        <select class="input nt-pilih" onchange="_ntPilih(${i},this.value)">
          <option value="">— Lewati Baris Ini —</option>
          ${b.saran.length ? `<optgroup label="Paling Mirip">${b.saran.map(([v, si]) => `<option value="${NT.santri[si].id}" ${NT.santri[si].id === b.siswaId ? "selected" : ""}>${e(NT.santri[si].nama)} · ${Math.round(v * 100)}%</option>`).join("")}</optgroup>` : ""}
          <optgroup label="Semua Santri">${urutNama.filter((s) => !saranId.has(s.id)).map((s) => `<option value="${s.id}" ${s.id === b.siswaId ? "selected" : ""}>${e(s.nama)}</option>`).join("")}</optgroup>
        </select>
        <div class="nt-pesan">${st === "pasti" ? "✅ cocok" : st === "ganda" ? "⛔ santri ini sudah dipilih di baris lain — pilih yang benar" : st === "periksa" ? "⚠️ nama mirip — pastikan santrinya benar" : "❓ nama tidak ditemukan — pilih santrinya atau lewati"}${lama !== "" && b.siswaId ? ` · nilai lama <b>${e(lama)}</b> → <b>${b.nilai}</b>` : ""}</div>`}
      </div>`; }).join("")}</div>
    ${belum.length ? `<details class="nt-belum"><summary>👥 ${belum.length} Santri Tidak Ada di Tempelan</summary><div>${belum.map((s) => e(s.nama)).join(" · ")}</div></details>` : ""}
    <label class="nt-timpa"><input type="checkbox" id="nt-timpa" checked> Timpa nilai yang sudah ada di kolom ini</label>
    <div class="nt-aksi"><button class="btn btn-outline" onclick="nlTempelNilai()">← Ubah Tempelan</button>
      <button class="btn btn-accent" ${ganda.size ? "disabled" : ""} onclick="_ntTerapkan()">✍️ Isi ${n.pasti + n.periksa} Nilai ke Tabel</button></div>
    <div class="nt-kaki">Nilai belum tersimpan sampai antum menekan 💾 Simpan di atas tabel.</div></div>`);
}
function _ntPilih(i, id) {
  const b = NT.baris[i]; if (!b) return;
  b.siswaId = id; b.status = id ? "pasti" : "tidak"; b.dipilihGuru = true;
  const scroll = document.querySelector(".nt-daftar")?.scrollTop || 0;
  _ntGambar();
  const d = document.querySelector(".nt-daftar"); if (d) d.scrollTop = scroll;
}
async function _ntTerapkan() {
  const B = NT.baris.filter((b) => b.siswaId && b.nilai !== null && !b.galat);
  const ids = B.map((b) => b.siswaId);
  if (new Set(ids).size !== ids.length) { toast("Masih ada santri yang dipilih dua kali", "err"); return; }
  if (!B.length) { toast("Belum ada nilai yang cocok dengan santri", "err"); return; }
  const timpa = qs("nt-timpa")?.checked !== false;
  let [jenis, kolom] = NT.target.split("|");
  closeModal();
  // siapkan kolom: UH/Tugas baru → tambah kolom; UTS belum aktif → aktifkan (isian lain tidak hilang)
  if (kolom === "+") {
    _simpanIsianTabelKeState();
    const daftar = jenis === "uh" ? NILAI_STATE.kolomUH : NILAI_STATE.kolomTugas, dasar = jenis === "uh" ? "Ulangan Harian" : "Tugas";
    let k = daftar.length + 1; while (daftar.includes(`${dasar} ${k}`)) k++;
    kolom = `${dasar} ${k}`; daftar.push(kolom);
    await gambarTabelNilai();
  } else if (jenis === "uts" && !NILAI_STATE.adaUTS) {
    _simpanIsianTabelKeState(); NILAI_STATE.adaUTS = true; await gambarTabelNilai();
  }
  const cls = { uh: "nilai-uh", tugas: "nilai-tugas", uts: "nilai-uts", uas: "nilai-uas" }[jenis];
  let isi = 0, lewat = 0; const alias = {};
  B.forEach((b) => {
    const tr = document.querySelector(`#input-nilai-table tr[data-siswa="${b.siswaId}"]`); if (!tr) return;
    const inp = kolom ? tr.querySelector(`.${cls}[data-kolom="${CSS.escape(kolom)}"]`) : tr.querySelector(`.${cls}`);
    if (!inp) return;
    if (!timpa && inp.value !== "" && Number(inp.value) !== b.nilai) { lewat++; return; }
    inp.value = b.nilai; inp.classList.remove("nl-salah"); inp.classList.add("nt-baru");
    setTimeout(() => inp.classList.remove("nt-baru"), 4000);
    _hitungUlangBarisNilai(tr); isi++;
    alias[_ntNormal(b.nama)] = b.siswaId;
  });
  _ntSimpanAlias(alias);
  NT.teksTerakhir = "";
  if (isi) _tandaiNilaiBelumDisimpan();
  _perbaruiProgresNilai();
  document.querySelector("#input-nilai-table .nt-baru")?.scrollIntoView({ block: "center", behavior: "smooth" });
  toast(`✍️ ${isi} nilai diisi ke kolom ${kolom || jenis.toUpperCase()}${lewat ? ` · ${lewat} dilewati (sudah ada nilai)` : ""}. Periksa lalu tekan 💾 Simpan.`, "ok");
}

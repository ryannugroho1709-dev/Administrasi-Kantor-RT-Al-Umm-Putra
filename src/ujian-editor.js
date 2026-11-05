// ============================================================
//  EDITOR SOAL (tanpa JSON) — guru membuat / mengubah bank soal langsung di aplikasi.
//  • Tiga bagian: Pilihan Ganda, PG Kompleks, Uraian; poin per soal diatur per bagian.
//  • Gambar per soal (diunggah ke Storage "foto/ujian-soal", dikecilkan dulu supaya hemat kuota).
//  • "Tempel dari Word": salin soal dari Word/PDF, sistem memecah nomor, pilihan a–e, dan kunci.
//  Disimpan lewat RPC ujian_bank_simpan (butuh PIN Kunci Ujian) → kunci tetap terpisah dari soal.
// ============================================================
const UJE = { m: null, tab: "pg" };
const UJE_JENIS = ["pg", "pgk", "uraian"];
const UJE_LABEL = { pg: "Pilihan Ganda", pgk: "PG Kompleks", uraian: "Uraian" };
const UJE_WARNA = { pg: "37,99,235", pgk: "124,58,237", uraian: "234,122,26" };
const UJE_POIN = { pg: 2, pgk: 3, uraian: 10 };
const _ujeSoalBaru = (jenis) => (jenis === "uraian" ? { t: "", g: "", stimulus: "", kunci: "", poin_kunci: [], penjelasan: "" } : { t: "", g: "", stimulus: "", o: ["", "", "", "", ""], k: jenis === "pg" ? null : [], bs: null, penjelasan: "" });
const UJE_BS = [["Benar", "Salah"], ["Tepat", "Tidak Tepat"], ["Setuju", "Tidak Setuju"]];

function _ujeModelKosong() {
  return { bankId: null, kode: "", judul: "", mapel_id: "", tingkat: "", bab: 1,
    bagian: Object.fromEntries(UJE_JENIS.map((j) => [j, { poin: UJE_POIN[j], stimulus: "", soal: [] }])) };
}
// Bank tersimpan (soal publik + kunci) → model editor
function _ujeDariBank(b, kunci) {
  const m = _ujeModelKosong();
  Object.assign(m, { bankId: b.id, kode: b.kode, judul: b.judul, mapel_id: b.mapel_id || "", tingkat: b.tingkat || "", bab: b.bab || 1 });
  (b.soal || []).forEach((bg) => {
    const kb = ((kunci && kunci.bagian) || []).find((x) => x.jenis === bg.jenis) || { soal: [] };
    const tujuan = m.bagian[bg.jenis]; if (!tujuan) return;
    tujuan.poin = Number(bg.poin) || UJE_POIN[bg.jenis];
    tujuan.stimulus = bg.stimulus || "";
    tujuan.soal = (bg.soal || []).map((s) => {
      const ks = kb.soal.find((x) => x.no === s.no) || {};
      return bg.jenis === "uraian"
        ? { t: s.t || "", g: s.g || "", stimulus: s.stimulus || "", kunci: ks.kunci || "", poin_kunci: ks.poin_kunci || [], penjelasan: ks.penjelasan || "" }
        : { t: s.t || "", g: s.g || "", stimulus: s.stimulus || "", o: [...(s.o || [])], k: bg.jenis === "pg" ? (ks.k ?? null) : [].concat(ks.k || []), bs: s.bs || null, penjelasan: ks.penjelasan || "" };
    });
  });
  return m;
}

async function ujEditorBuka(bankId) {
  const pin = await _ujPin("PIN untuk mengubah soal"); if (!pin) return;
  if (bankId) {
    const b = UJ.bank.find((x) => x.id === bankId); if (!b) return;
    try { UJE.m = _ujeDariBank(b, await _ujRpc("ujian_kunci_ambil", { p_pin: pin, p_bank: bankId })); }
    catch (e) { toast(_ujPesan(e), "err"); return; }
  } else {
    UJE.m = _ujeModelKosong();
    UJE.m.bagian.pg.soal.push(_ujeSoalBaru("pg"));
  }
  UJE.tab = UJE_JENIS.find((j) => UJE.m.bagian[j].soal.length) || "pg";
  _ujeGambar();
}

function _ujeGambar() {
  const m = UJE.m, tab = UJE.tab, bg = m.bagian[tab];
  // pertahankan posisi gulir saat menggambar ulang (mis. setelah menandai kunci di soal ke-20)
  const panel = qs("modal-panel"), tetap = panel && panel.querySelector(".uje") && UJE._tabTerakhir === tab, gulir = panel ? panel.scrollTop : 0;
  UJE._tabTerakhir = tab;
  const totalSoal = UJE_JENIS.reduce((a, j) => a + m.bagian[j].soal.length, 0);
  const totalPoin = UJE_JENIS.reduce((a, j) => a + m.bagian[j].soal.length * (Number(m.bagian[j].poin) || 0), 0);
  const tanpaKunci = UJE_JENIS.reduce((a, j) => a + m.bagian[j].soal.filter((s) => !_ujeAdaKunci(j, s)).length, 0);
  openModal(`<div class="uje">
    <h3 style="margin-bottom:4px">${m.bankId ? "✏️ Ubah soal" : "✨ Buat soal baru"}</h3>
    <div class="uj-sub" style="margin-bottom:12px">Tidak perlu file JSON. Ketik langsung, atau <b>tempel dari Word</b>. Kunci jawaban disimpan terpisah dan tidak pernah terlihat santri.</div>
    <div class="uje-meta">
      <div class="field" style="grid-column:1/-1"><label class="form-label">📝 Judul</label><input class="input" value="${escapeHtml(m.judul)}" placeholder="mis. Penilaian Bab 2 — Teks Eksposisi" oninput="UJE.m.judul=this.value"></div>
      <div class="field"><label class="form-label">📘 Mapel</label><select class="input" onchange="UJE.m.mapel_id=this.value"><option value="">— pilih —</option>${LOOKUP.mapel.map((x) => `<option value="${x.id}" ${x.id === m.mapel_id ? "selected" : ""}>${escapeHtml(x.nama_mapel)}</option>`).join("")}</select></div>
      <div class="field"><label class="form-label">🏫 Kelas (tingkat)</label><input class="input" value="${escapeHtml(m.tingkat)}" placeholder="mis. 10" oninput="UJE.m.tingkat=this.value"></div>
      <div class="field"><label class="form-label">🔖 Bab → UH ke-</label><input class="input" type="number" min="1" value="${m.bab}" oninput="UJE.m.bab=Number(this.value)||1"></div>
    </div>
    <div class="uje-tab">${UJE_JENIS.map((j) => `<button class="${j === tab ? "aktif" : ""}" style="--rgb:${UJE_WARNA[j]}" onclick="UJE.tab='${j}';_ujeGambar()">${UJE_LABEL[j]} <span>${m.bagian[j].soal.length}</span></button>`).join("")}</div>
    <div class="uje-bagian" style="--rgb:${UJE_WARNA[tab]}">
      <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:flex-end">
        <div class="field" style="margin:0"><label class="form-label">Poin per soal</label><input class="input" type="number" min="0" step="0.5" style="width:110px" value="${bg.poin}" oninput="UJE.m.bagian['${tab}'].poin=Number(this.value)||0;_ujeHitungFooter()"></div>
        <div class="uj-sub" style="flex:1;min-width:200px">${tab === "pg" ? "Ketuk huruf untuk menandai <b>satu</b> jawaban benar." : tab === "pgk" ? "Centang <b>semua</b> jawaban benar. Nilai sebagian diberikan kalau santri benar sebagian." : "Isi kunci & poin penilaian; uraian dinilai guru (ada saran skor otomatis)."}</div>
      </div>
      <details class="uje-stim" ${bg.stimulus ? "open" : ""}><summary>📖 Teks bacaan untuk semua soal di bagian ini (opsional)</summary>
        <textarea class="input" rows="4" placeholder="Tempel teks bacaan/cerita di sini" oninput="UJE.m.bagian['${tab}'].stimulus=this.value">${escapeHtml(bg.stimulus)}</textarea></details>
      <div id="uje-daftar">${bg.soal.map((s, i) => _ujeKartu(tab, s, i)).join("") || `<div class="uj-kosong">Belum ada soal ${UJE_LABEL[tab]}.</div>`}</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px">
        <button class="btn btn-sm uje-b-tambah" onclick="ujeTambah('${tab}')">➕ Tambah soal ${UJE_LABEL[tab]}</button>
        <button class="btn btn-sm uje-b-tempel" onclick="ujeTempelBuka()">📋 Tempel dari Word</button>
      </div>
    </div>
    <div class="uje-kaki">
      <div id="uje-ringkas" class="uj-sub">${totalSoal} soal · total ${totalPoin} poin (nilai otomatis diubah ke skala 100)${tanpaKunci ? ` · <b style="color:#c0392b">${tanpaKunci} soal belum ada kunci</b>` : ""}</div>
      <button class="btn btn-sm uje-b-json" onclick="ujeUnduhJson()" title="Unduh cadangan (berisi kunci)">⬇️ Cadangan</button>
      <button class="btn btn-accent" onclick="ujeSimpan()">💾 Simpan bank soal</button>
    </div></div>`, { lebar: true });
  if (tetap) { panel.querySelector(".uje")?.classList.add("tetap"); panel.scrollTop = gulir; }
}
function _ujeHitungFooter() {
  const m = UJE.m, el = qs("uje-ringkas"); if (!el) return;
  const totalSoal = UJE_JENIS.reduce((a, j) => a + m.bagian[j].soal.length, 0);
  const totalPoin = UJE_JENIS.reduce((a, j) => a + m.bagian[j].soal.length * (Number(m.bagian[j].poin) || 0), 0);
  const tanpaKunci = UJE_JENIS.reduce((a, j) => a + m.bagian[j].soal.filter((s) => !_ujeAdaKunci(j, s)).length, 0);
  el.innerHTML = `${totalSoal} soal · total ${totalPoin} poin (nilai otomatis diubah ke skala 100)${tanpaKunci ? ` · <b style="color:#c0392b">${tanpaKunci} soal belum ada kunci</b>` : ""}`;
}
function _ujeAdaKunci(j, s) {
  if (j === "pg") return s.k !== null && s.k !== undefined && [].concat(s.k).length > 0;
  if (j === "pgk") return s.bs ? (s.k || []).length === (s.o || []).length : (s.k || []).length > 0;
  return String(s.kunci || "").trim() !== "";
}
function _ujeKartu(j, s, i) {
  const H = "ABCDEFGHIJ", ada = _ujeAdaKunci(j, s);
  const kunciPG = [].concat(s.k ?? []);
  return `<div class="uje-kartu ${ada ? "" : "uje-tanpa-kunci"}" id="uje-k-${i}">
    <div class="uje-kartu-atas"><span class="uje-no">${i + 1}</span>
      ${ada ? "" : `<span class="uje-lencana">⚠️ belum ada kunci</span>`}
      <span style="flex:1"></span>
      <button class="uje-ik" title="Naik" onclick="ujeGeser('${j}',${i},-1)" ${i === 0 ? "disabled" : ""}>↑</button>
      <button class="uje-ik" title="Turun" onclick="ujeGeser('${j}',${i},1)">↓</button>
      <button class="uje-ik" title="Gandakan" onclick="ujeGanda('${j}',${i})">⧉</button>
      <button class="uje-ik merah" title="Hapus soal" onclick="ujeHapus('${j}',${i})">🗑</button></div>
    <details ${s.stimulus ? "open" : ""} class="uje-stim"><summary>📖 Teks bacaan khusus soal ini</summary><textarea class="input" rows="3" oninput="UJE.m.bagian['${j}'].soal[${i}].stimulus=this.value">${escapeHtml(s.stimulus || "")}</textarea></details>
    <textarea class="input uje-teks" rows="2" placeholder="Tulis pertanyaan… (pakai **kata** untuk huruf tebal)" oninput="UJE.m.bagian['${j}'].soal[${i}].t=this.value">${escapeHtml(s.t || "")}</textarea>
    <div class="uje-gambar">${s.g ? `<img src="${escapeHtml(s.g)}" alt=""><button class="uje-ik merah" onclick="UJE.m.bagian['${j}'].soal[${i}].g='';_ujeGambar()">✕ Hapus gambar</button>`
      : `<label class="btn btn-sm uje-b-gambar">🖼️ Tambah gambar<input type="file" accept="image/*" style="display:none" onchange="ujeUnggahGambar('${j}',${i},this)"></label>`}</div>
    ${j === "uraian" ? `
      <label class="form-label" style="margin-top:6px">🔑 Kunci / contoh jawaban</label>
      <textarea class="input" rows="2" oninput="UJE.m.bagian['${j}'].soal[${i}].kunci=this.value;_ujeTandaKunci('${j}',${i})">${escapeHtml(s.kunci || "")}</textarea>
      <label class="form-label" style="margin-top:6px">✅ Poin penilaian (pisahkan dengan titik koma) — dipakai untuk saran skor otomatis</label>
      <input class="input" value="${escapeHtml((s.poin_kunci || []).join("; "))}" placeholder="mis. menyebut 4 musim; menjelaskan ciri" oninput="UJE.m.bagian['${j}'].soal[${i}].poin_kunci=this.value.split(';').map(x=>x.trim()).filter(Boolean)">`
    : s.bs ? `<div class="uje-opsi">${(s.o || []).map((o, k) => `<div class="uje-opsi-baris">
        <input class="input" value="${escapeHtml(o)}" placeholder="Pernyataan ${k + 1}" oninput="UJE.m.bagian['${j}'].soal[${i}].o[${k}]=this.value">
        <button class="uje-bs ${s.k[k] ? "ya" : "tidak"}" title="Ketuk untuk mengganti kunci" onclick="ujeKunci('${j}',${i},${k})">${s.k[k] ? "✅ " + escapeHtml(s.bs[0]) : "❌ " + escapeHtml(s.bs[1])}</button>
        ${(s.o || []).length > 2 ? `<button class="uje-ik" title="Hapus pernyataan" onclick="ujeHapusOpsi('${j}',${i},${k})">✕</button>` : ""}</div>`).join("")}
        <button class="uje-ik" style="margin-top:4px" onclick="UJE.m.bagian['${j}'].soal[${i}].o.push('');UJE.m.bagian['${j}'].soal[${i}].k.push(true);_ujeGambar()">＋ pernyataan</button></div>`
    : `<div class="uje-opsi">${(s.o || []).map((o, k) => `<div class="uje-opsi-baris ${kunciPG.includes(k) ? "benar" : ""}">
        <button class="uje-huruf" title="${j === "pg" ? "Jadikan jawaban benar" : "Tandai benar/salah"}" onclick="ujeKunci('${j}',${i},${k})">${H[k]}</button>
        <input class="input" value="${escapeHtml(o)}" placeholder="Pilihan ${H[k]}" oninput="UJE.m.bagian['${j}'].soal[${i}].o[${k}]=this.value">
        ${(s.o || []).length > 2 ? `<button class="uje-ik" title="Hapus pilihan" onclick="ujeHapusOpsi('${j}',${i},${k})">✕</button>` : ""}</div>`).join("")}
        ${(s.o || []).length < 8 ? `<button class="uje-ik" style="margin-top:4px" onclick="UJE.m.bagian['${j}'].soal[${i}].o.push('');_ujeGambar()">＋ pilihan</button>` : ""}</div>`}
    ${j === "pgk" ? `<label class="uje-bs-pilih"><input type="checkbox" ${s.bs ? "checked" : ""} onchange="ujeUbahBS(${i},this.checked)"> 📋 Bentuk tabel ${s.bs ? `<select onchange="UJE.m.bagian.pgk.soal[${i}].bs=UJE_BS[this.value];_ujeGambar()">${UJE_BS.map((p, x) => `<option value="${x}" ${s.bs[0] === p[0] ? "selected" : ""}>${p[0]} / ${p[1]}</option>`).join("")}</select>` : "Benar/Salah (tiap pernyataan dinilai sendiri)"}</label>` : ""}
    <details class="uje-stim" ${s.penjelasan ? "open" : ""}><summary>💡 Penjelasan singkat (tampil di hasil santri setelah ustadz membukanya)</summary>
      <textarea class="input" rows="2" placeholder="mis. 🏭 Kata kuncinya nilai tambah… 📖 Modul hlm. 21" oninput="UJE.m.bagian['${j}'].soal[${i}].penjelasan=this.value">${escapeHtml(s.penjelasan || "")}</textarea></details>
  </div>`;
}
function _ujeTandaKunci(j, i) {
  const el = qs("uje-k-" + i); if (el) el.classList.toggle("uje-tanpa-kunci", !_ujeAdaKunci(j, UJE.m.bagian[j].soal[i]));
  _ujeHitungFooter();
}
function ujeTambah(j) {
  UJE.m.bagian[j].soal.push(_ujeSoalBaru(j)); _ujeGambar();
  setTimeout(() => { const n = UJE.m.bagian[j].soal.length - 1; qs("uje-k-" + n)?.scrollIntoView({ behavior: "smooth", block: "center" }); qs("uje-k-" + n)?.querySelector(".uje-teks")?.focus(); }, 50);
}
function ujeGeser(j, i, d) { const a = UJE.m.bagian[j].soal, t = i + d; if (t < 0 || t >= a.length) return; [a[i], a[t]] = [a[t], a[i]]; _ujeGambar(); }
function ujeGanda(j, i) { const a = UJE.m.bagian[j].soal; a.splice(i + 1, 0, JSON.parse(JSON.stringify(a[i]))); _ujeGambar(); }
async function ujeHapus(j, i) {
  const s = UJE.m.bagian[j].soal[i];
  if ((s.t || "").trim() && !confirm(`Hapus soal nomor ${i + 1}?`)) return;
  UJE.m.bagian[j].soal.splice(i, 1); _ujeGambar();
}
function ujeUbahBS(i, aktif) {
  const s = UJE.m.bagian.pgk.soal[i];
  if (aktif) { const lama = new Set(s.k || []); s.bs = UJE_BS[0]; s.o = s.o.filter((o) => String(o).trim()).concat(s.o.filter((o) => String(o).trim()).length ? [] : ["", "", ""]); s.k = s.o.map((_, x) => lama.has(x)); }
  else { s.k = (s.k || []).map((v, x) => (v ? x : -1)).filter((x) => x >= 0); s.bs = null; }
  _ujeGambar();
}
function ujeKunci(j, i, k) {
  const s = UJE.m.bagian[j].soal[i];
  if (s.bs) { s.k[k] = !s.k[k]; _ujeGambar(); return; }
  if (j === "pg") s.k = s.k === k ? null : k;
  else { const set = new Set(s.k || []); set.has(k) ? set.delete(k) : set.add(k); s.k = [...set].sort((a, b) => a - b); }
  _ujeGambar();
}
function ujeHapusOpsi(j, i, k) {
  const s = UJE.m.bagian[j].soal[i];
  s.o.splice(k, 1);
  if (s.bs) { s.k.splice(k, 1); _ujeGambar(); return; }
  const geser = (x) => (x > k ? x - 1 : x);
  if (j === "pg") s.k = s.k === k ? null : s.k == null ? null : geser(s.k);
  else s.k = (s.k || []).filter((x) => x !== k).map(geser);
  _ujeGambar();
}
// Gambar dikecilkan (maks 1400 px, JPEG 0,85) sebelum diunggah → hemat kuota & cepat di HP santri.
async function _ujeKecilkan(file) {
  if (!/^image\//.test(file.type) || /gif|svg/.test(file.type)) return file;
  const img = await new Promise((ok, no) => { const u = URL.createObjectURL(file), im = new Image(); im.onload = () => ok(im); im.onerror = no; im.src = u; });
  const skala = Math.min(1, 1400 / Math.max(img.width, img.height));
  if (skala === 1 && file.size < 400000) return file;
  const c = document.createElement("canvas"); c.width = Math.round(img.width * skala); c.height = Math.round(img.height * skala);
  const ctx = c.getContext("2d"); ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, c.width, c.height); ctx.drawImage(img, 0, 0, c.width, c.height);
  const blob = await new Promise((ok) => c.toBlob(ok, "image/jpeg", 0.85));
  return new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" });
}
async function ujeUnggahGambar(j, i, input) {
  const f = input.files && input.files[0]; if (!f) return;
  const lbl = input.closest("label"); if (lbl) lbl.firstChild.textContent = "⏳ Mengunggah… ";
  try {
    const url = await apiUploadFoto(await _ujeKecilkan(f), "ujian-soal");
    UJE.m.bagian[j].soal[i].g = url; _ujeGambar();
  } catch (e) { toast("Gagal mengunggah gambar: " + e.message, "err"); if (lbl) lbl.firstChild.textContent = "🖼️ Tambah gambar"; }
}

// ── Tempel dari Word / PDF ──
function ujeTempelBuka() {
  openModal(`<h3>📋 Tempel soal dari Word</h3>
    <div class="uj-sub" style="line-height:1.7;margin-bottom:8px">Salin soal dari Word/PDF lalu tempel di bawah. Format yang dikenali:</div>
    <pre class="uje-contoh">A. Pilihan Ganda
1. Teks laporan hasil observasi berisi ....
a. opini
b. fakta
c. khayalan
Kunci: b

B. Pilihan Ganda Kompleks
1. Kata penanda definisi adalah ....
a. adalah   b. misalnya   c. merupakan
Kunci: a, c

C. Uraian
1. Apa arti pancaroba?
Kunci: masa peralihan antarmusim</pre>
    <div class="uj-sub" style="margin:6px 0">Kunci juga boleh ditandai dengan bintang di depan pilihan (<b>*b. fakta</b>). Soal tanpa pilihan otomatis jadi uraian. Kunci yang belum ada bisa ditandai setelahnya.</div>
    <textarea id="uje-tempel" class="input" rows="12" placeholder="Tempel di sini…"></textarea>
    <div id="uje-tempel-info" class="uj-sub" style="margin-top:6px"></div>
    <div style="display:flex;gap:10px;margin-top:10px"><button class="btn btn-outline" style="flex:1" onclick="_ujeGambar()">‹ Kembali</button><button class="btn btn-accent" style="flex:1" onclick="ujeTempelProses()">✨ Masukkan soal</button></div>`, { lebar: true });
  const ta = qs("uje-tempel");
  ta.oninput = () => { const h = _ujeUraiTeks(ta.value); qs("uje-tempel-info").innerHTML = `Terbaca: <b>${h.pg.length}</b> PG · <b>${h.pgk.length}</b> PG kompleks · <b>${h.uraian.length}</b> uraian${h.tanpaKunci ? ` · ${h.tanpaKunci} tanpa kunci` : ""}`; };
  ta.focus();
}
function ujeTempelProses() {
  const h = _ujeUraiTeks(qs("uje-tempel").value);
  const n = h.pg.length + h.pgk.length + h.uraian.length;
  if (!n) { toast("Tidak ada soal bernomor yang terbaca", "err"); return; }
  UJE_JENIS.forEach((j) => {
    const bg = UJE.m.bagian[j];
    // buang kartu kosong bawaan sebelum menambah
    bg.soal = bg.soal.filter((s) => (s.t || "").trim() || (s.o || []).some((o) => o.trim()));
    bg.soal.push(...h[j]);
  });
  UJE.tab = UJE_JENIS.find((j) => h[j].length) || UJE.tab;
  toast(`${n} soal dimasukkan${h.tanpaKunci ? ` · ${h.tanpaKunci} belum ada kunci (ditandai ⚠️)` : ""}`, "ok");
  _ujeGambar();
}
// Pengurai teks bebas → { pg:[], pgk:[], uraian:[], tanpaKunci }
function _ujeUraiTeks(teks) {
  const hasil = { pg: [], pgk: [], uraian: [], tanpaKunci: 0 };
  const baris = String(teks || "").replace(/\r/g, "").replace(/\t/g, "  ").split("\n");
  let bagian = null, cur = null, bacaan = [];
  const RE_JUDUL = /^\s*(?:[A-H]|[IVX]{1,4})?\s*[.)]?\s*(soal\s+)?(pilihan\s+ganda\s+kompleks|pg\s*kompleks|pilihan\s+ganda|uraian|essay|esai|isian(\s+singkat)?)\b/i;
  const RE_NO = /^\s*(\d{1,3})\s*[.)]\s*(.*)$/;
  const RE_OPSI = /(^|\s{2,}|\t)(\*?)\(?([a-hA-H])\s*[.)]\s+(.+?)(?=(\s{2,}\*?\(?[a-hA-H]\s*[.)]\s)|$)/g;
  const RE_KUNCI = /^\s*(kunci(\s+jawaban)?|jawaban(\s+benar)?|jwb)\s*[:=]\s*(.*)$/i;
  const tutup = () => {
    if (!cur) return;
    let jenis = bagian || (cur.o.length ? "pg" : "uraian");
    const tanda = cur.o.map((o, i) => (o.benar ? i : -1)).filter((i) => i >= 0);
    let k = tanda;
    if (!k.length && cur.kunci != null && cur.o.length) k = (cur.kunci.match(/\b[a-hA-H]\b/g) || []).map((x) => x.toLowerCase().charCodeAt(0) - 97).filter((i) => i < cur.o.length);
    if (cur.o.length && jenis === "uraian") jenis = k.length > 1 ? "pgk" : "pg";
    if (!bagian && jenis === "pg" && k.length > 1) jenis = "pgk";
    const stim = cur.stimulus.trim();
    let s;
    if (jenis === "uraian") s = { t: cur.t.trim(), g: "", stimulus: stim, kunci: (cur.kunci || "").trim(), poin_kunci: [] };
    else s = { t: cur.t.trim(), g: "", stimulus: stim, o: cur.o.map((o) => o.teks.trim()), k: jenis === "pg" ? (k.length ? k[0] : null) : [...new Set(k)] };
    if (!_ujeAdaKunci(jenis, s)) hasil.tanpaKunci++;
    hasil[jenis].push(s); cur = null;
  };
  for (const raw of baris) {
    const l = raw.replace(/\s+$/, "");
    if (!l.trim() || /^\s*(pilihlah|jawablah|kerjakan|setiap soal|bernilai|=== halaman)/i.test(l)) continue;
    const jdl = l.trim().length < 60 && l.match(RE_JUDUL);
    if (jdl && !RE_NO.test(l)) {
      tutup();
      const x = jdl[2].toLowerCase();
      bagian = /kompleks/.test(x) ? "pgk" : /pilihan/.test(x) ? "pg" : "uraian";
      bacaan = []; continue;
    }
    const kn = l.match(RE_KUNCI);
    if (kn && cur) { cur.kunci = kn[4]; continue; }
    const no = l.match(RE_NO);
    if (no) {
      tutup();
      const panjang = bacaan.join("\n").trim();
      cur = { t: no[2], o: [], kunci: null, stimulus: panjang.length > 60 ? panjang : "" };
      bacaan = [];
      continue;
    }
    if (cur) {
      if (_ujeAmbilOpsi(cur, l, RE_OPSI)) continue;
      // kalimat pembuka bacaan ("Teks berikut…", "Bacalah…") = soal sebelumnya selesai, mulai teks bacaan baru
      if (cur.kunci != null || (cur.o.length && /^\s*(teks|bacalah|perhatikan|cermatilah|cermati|bacaan|wacana|paragraf)\b/i.test(l))) { tutup(); bacaan.push(l.trim()); continue; }
      if (cur.o.length) cur.o[cur.o.length - 1].teks += " " + l.trim(); else cur.t += "\n" + l.trim();
    } else bacaan.push(l.trim());
  }
  tutup();
  return hasil;
}
// Baris pilihan: "a. teks", "(b) teks", "*c. teks" (bintang = benar), atau beberapa pilihan dalam satu baris.
function _ujeAmbilOpsi(cur, l, re) {
  if (!re || !l) return false;
  const awal = l.match(/^\s*\*?\(?([a-hA-H])\s*[.)]\s+/);
  if (!awal) return false;
  const harap = cur.o.length; // huruf berikutnya yang diharapkan
  if (awal[1].toLowerCase().charCodeAt(0) - 97 !== harap) return false;
  re.lastIndex = 0; let m, ada = false;
  while ((m = re.exec(l))) {
    let teks = m[4].trim(), benar = !!m[2];
    if (/\s\*$|\(benar\)$|✓$/.test(teks)) { benar = true; teks = teks.replace(/\s*(\*|\(benar\)|✓)$/, ""); }
    cur.o.push({ teks, benar }); ada = true;
  }
  return ada;
}

// ── Simpan ──
function _ujeKeBank() {
  const m = UJE.m, bagian = [], galat = [];
  UJE_JENIS.forEach((j) => {
    const bg = m.bagian[j];
    const soal = bg.soal.filter((s) => (s.t || "").trim() || s.g);
    if (!soal.length) return;
    const out = soal.map((s, i) => {
      const no = i + 1;
      if (j === "uraian") {
        if (!String(s.kunci || "").trim()) galat.push(`${UJE_LABEL[j]} no ${no}: kunci kosong`);
        return { no, t: s.t.trim(), ...(s.g ? { g: s.g } : {}), ...(s.stimulus ? { stimulus: s.stimulus } : {}), kunci: (s.kunci || "").trim(), poin_kunci: s.poin_kunci || [], ...(s.penjelasan ? { penjelasan: s.penjelasan.trim() } : {}) };
      }
      // buang pilihan kosong & sesuaikan nomor kunci
      const peta = []; const o = [];
      (s.o || []).forEach((t, k) => { if (String(t).trim()) { peta[k] = o.length; o.push(String(t).trim()); } });
      if (s.bs) {
        const k = (s.o || []).map((t, x) => (String(t).trim() ? !!s.k[x] : null)).filter((v) => v !== null);
        if (o.length < 2) galat.push(`${UJE_LABEL[j]} no ${no}: minimal 2 pernyataan`);
        return { no, t: s.t.trim(), ...(s.g ? { g: s.g } : {}), ...(s.stimulus ? { stimulus: s.stimulus } : {}), o, k, bs: s.bs, ...(s.penjelasan ? { penjelasan: s.penjelasan.trim() } : {}) };
      }
      let k = [].concat(s.k ?? []).map((x) => peta[x]).filter((x) => x !== undefined);
      if (o.length < 2) galat.push(`${UJE_LABEL[j]} no ${no}: minimal 2 pilihan`);
      if (!k.length) galat.push(`${UJE_LABEL[j]} no ${no}: belum ada kunci`);
      return { no, t: s.t.trim(), ...(s.g ? { g: s.g } : {}), ...(s.stimulus ? { stimulus: s.stimulus } : {}), o, k: j === "pg" ? (k.length > 1 ? k : k[0]) : k, ...(s.penjelasan ? { penjelasan: s.penjelasan.trim() } : {}) };
    });
    bagian.push({ jenis: j, judul: UJE_LABEL[j], poin: Number(bg.poin) || 1, ...(bg.stimulus ? { stimulus: bg.stimulus } : {}), soal: out });
  });
  if (!bagian.length) galat.push("Belum ada soal.");
  if (!String(m.judul).trim()) galat.push("Judul belum diisi.");
  if (!m.mapel_id) galat.push("Mapel belum dipilih.");
  const skor = bagian.reduce((a, b) => a + b.poin * b.soal.length, 0);
  return { galat, bank: { id: m.kode, judul: m.judul.trim(), mapel_id: m.mapel_id, kelas: m.tingkat, bab: m.bab, skor_maksimal: skor, bagian } };
}
async function ujeSimpan() {
  const { galat, bank } = _ujeKeBank();
  if (galat.length) { toast(galat.slice(0, 3).join(" · ") + (galat.length > 3 ? ` (+${galat.length - 3} lagi)` : ""), "err"); return; }
  const m = UJE.m;
  if (!m.kode) {
    const slug = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 24);
    m.kode = `${slug(_ujNamaMapel(m.mapel_id))}-${slug(m.tingkat) || "x"}-bab${m.bab}-${Date.now().toString(36).slice(-4)}`;
  }
  try {
    const pin = await _ujPin("PIN untuk menyimpan soal"); if (!pin) return;
    const { publik, kunci } = _ujPisahKunci(bank);
    m.bankId = await _ujRpc("ujian_bank_simpan", { p_pin: pin, p_kode: m.kode, p_mapel_id: m.mapel_id, p_tingkat: m.tingkat, p_bab: m.bab, p_judul: bank.judul, p_soal: publik, p_kunci: kunci, p_skor_maksimal: bank.skor_maksimal, p_guru: STATE.guruId || null });
    toast("💾 Bank soal tersimpan", "ok"); closeModal(); ujMuat();
  } catch (e) { toast(_ujPesan(e), "err"); }
}
function ujeUnduhJson() {
  const { bank } = _ujeKeBank();
  bank.id = UJE.m.kode || "bank-soal"; bank.mapel = _ujNamaMapel(UJE.m.mapel_id);
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([JSON.stringify(bank, null, 2)], { type: "application/json" }));
  a.download = `${bank.id}.json`; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

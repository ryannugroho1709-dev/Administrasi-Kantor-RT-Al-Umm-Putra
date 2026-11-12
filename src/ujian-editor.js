// ============================================================
//  EDITOR SOAL (tanpa JSON) — guru membuat / mengubah bank soal langsung di aplikasi.
//  • Enam jenis: Pilihan Ganda, PG Kompleks (+ tabel Benar/Salah), Isian Singkat (titik kosong),
//    Menjodohkan, Mengurutkan (susun kata/kalimat/langkah), Uraian (+ jawab dengan rekaman suara).
//    Semua kecuali uraian dinilai otomatis di server (butuh SQL_UJIAN_SANTRI_4.sql untuk 3 jenis baru).
//  • Gambar per soal & per pilihan jawaban, audio per soal (listening) — diunggah ke Storage "foto".
//  • "Tempel dari Word": salin soal dari Word/PDF, ATAU unggah berkas .docx / .pdf / foto soal
//    (dibaca otomatis; foto & PDF hasil scan dibaca dengan pengenal huruf/OCR di HP/laptop guru).
//  Disimpan lewat RPC ujian_bank_simpan (butuh PIN Ujian) → kunci tetap terpisah dari soal.
// ============================================================
const UJE = { m: null, tab: "pg", impor: { gambar: [] } };
const UJE_JENIS = ["pg", "pgk", "isian", "jodoh", "urut", "uraian"];
const UJE_JENIS_BARU = ["isian", "jodoh", "urut"];
const UJE_LABEL = { pg: "Pilihan Ganda", pgk: "PG Kompleks", isian: "Isian Singkat", jodoh: "Menjodohkan", urut: "Mengurutkan", uraian: "Uraian" };
const UJE_IKON = { pg: "🔘", pgk: "☑️", isian: "✏️", jodoh: "🔗", urut: "🔢", uraian: "📝" };
const UJE_WARNA = { pg: "37,99,235", pgk: "124,58,237", isian: "13,148,136", jodoh: "219,39,119", urut: "79,70,229", uraian: "234,122,26" };
const UJE_POIN = { pg: 2, pgk: 3, isian: 2, jodoh: 4, urut: 3, uraian: 10 };
const UJE_PETUNJUK = {
  pg: "Ketuk huruf untuk menandai <b>satu</b> jawaban benar. Pilihan boleh bergambar (🖼️ di samping pilihan).",
  pgk: "Centang <b>semua</b> jawaban benar. Nilai sebagian diberikan kalau santri benar sebagian.",
  isian: "Tulis <b>___</b> (tiga garis bawah) di soal untuk titik kosong — boleh lebih dari satu. Cocok untuk melengkapi kalimat, sambung kata, ejaan, istilah. Dinilai otomatis.",
  jodoh: "Isi pasangan yang benar (kiri ↔ kanan). Di layar santri bagian kanan <b>diacak</b>, santri memasangkan. Nilai per pasangan.",
  urut: "Tulis bagian-bagiannya dalam <b>urutan yang benar</b> — kata, kalimat, atau langkah. Di layar santri diacak, santri menyusun ulang.",
  uraian: "Isi kunci & poin penilaian; uraian dinilai guru (ada saran skor otomatis). Bisa juga dijawab dengan <b>rekaman suara</b> (speaking).",
};
const UJE_TEKS_BAWAAN = { jodoh: "Jodohkan setiap pernyataan di kiri dengan pasangan yang tepat di kanan.", urut: "Susunlah menjadi urutan yang benar." };
const _ujeDasar = () => ({ t: "", g: "", au: "", stimulus: "", penjelasan: "" });
function _ujeSoalBaru(jenis) {
  if (jenis === "uraian") return { ..._ujeDasar(), kunci: "", poin_kunci: [], rek: false };
  if (jenis === "isian") return { ..._ujeDasar(), kt: [""] };
  if (jenis === "jodoh") return { ..._ujeDasar(), o: ["", "", ""], p: ["", "", ""], px: [] };
  if (jenis === "urut") return { ..._ujeDasar(), o: ["", "", ""] };
  return { ..._ujeDasar(), o: ["", "", "", "", ""], og: [], k: jenis === "pg" ? null : [], bs: null };
}
const UJE_BS = [["Benar", "Salah"], ["Tepat", "Tidak Tepat"], ["Setuju", "Tidak Setuju"]];
const _ujeJumlahTitik = (t) => Math.max(1, (String(t || "").match(/_{3,}/g) || []).length);
const _ujeS = (j, i) => `UJE.m.bagian['${j}'].soal[${i}]`;

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
      const dasar = { t: s.t || "", g: s.g || "", au: s.au || "", stimulus: s.stimulus || "", penjelasan: ks.penjelasan || "" };
      if (bg.jenis === "uraian") return { ...dasar, kunci: ks.kunci || "", poin_kunci: ks.poin_kunci || [], rek: !!s.rek };
      if (bg.jenis === "isian") { const kt = (ks.k || []).map((a) => [].concat(a).join(" / ")); return { ...dasar, kt: kt.length ? kt : Array(_ujeJumlahTitik(s.t)).fill("") }; }
      if (bg.jenis === "jodoh") {
        const k = ks.k || [], pakai = new Set(k);
        return { ...dasar, o: [...(s.o || [])], p: (s.o || []).map((_, x) => (s.p || [])[k[x]] ?? ""), px: (s.p || []).filter((_, x) => !pakai.has(x)) };
      }
      if (bg.jenis === "urut") return { ...dasar, o: (ks.k || []).length ? ks.k.map((x) => (s.o || [])[x] ?? "") : [...(s.o || [])] };
      return { ...dasar, o: [...(s.o || [])], og: [...(s.og || [])], k: bg.jenis === "pg" ? (ks.k ?? null) : [].concat(ks.k || []), bs: s.bs || null };
    });
  });
  return m;
}

// preset (opsional, dari Jadwal Ujian → Pengumpulan Soal): { mapel_id, tingkat, jenisNilai, judul }
async function ujEditorBuka(bankId, preset) {
  if (bankId) {
    const b = UJ.bank.find((x) => x.id === bankId); if (!b) return;
    if (typeof _ujBolehKelola === "function" && !_ujBolehKelola(b)) { _ujTolakBukanMilik(b); return; }
    const pin = await _ujPin("PIN Ujian"); if (!pin) return; // soal baru: PIN baru ditanya saat menyimpan (cukup sekali per HP)
    try { UJE.m = _ujeDariBank(b, await _ujRpc("ujian_kunci_ambil", { p_pin: pin, p_bank: bankId })); }
    catch (e) { toast(_ujPesan(e), "err"); return; }
  } else {
    // Soal baru: tanya dulu dihitung sebagai apa (UH / Tugas / UTS / UAS) → dipakai saat kirim nilai ke rapor
    const pilih = preset && preset.jenisNilai ? { jenisNilai: preset.jenisNilai, jenisKe: 1, bab: 1 } : await _ujeTanyaJenis(); if (!pilih) return;
    UJE.m = _ujeModelKosong();
    Object.assign(UJE.m, pilih);
    if (preset) { if (preset.mapel_id) UJE.m.mapel_id = preset.mapel_id; if (preset.tingkat) UJE.m.tingkat = String(preset.tingkat); if (preset.judul) UJE.m.judul = preset.judul; }
    UJE.m.bagian.pg.soal.push(_ujeSoalBaru("pg"));
  }
  if (bankId) { const jn = typeof _ujJenisNilai === "function" ? _ujJenisNilai(UJ.bank.find((x) => x.id === bankId)) : null; if (jn) { UJE.m.jenisNilai = jn.jenis; UJE.m.jenisKe = jn.ke; } }
  UJE.tab = UJE_JENIS.find((j) => UJE.m.bagian[j].soal.length) || "pg";
  _ujeGambar();
}

// Pertanyaan pertama saat membuat soal baru
function _ujeTanyaJenis() {
  return new Promise((res) => {
    window._ujeJenisJawab = (j) => { const ke = Number(qs("uje-jn-ke")?.value) || 1; window._ujeJenisJawab = null; res(j ? { jenisNilai: j, jenisKe: ke, bab: ke } : null); };
    openModal(`<h3>📊 Soal ini dihitung sebagai…</h3>
      <div class="uj-sub" style="margin:-4px 0 12px">Dipakai saat nilai santri dikirim ke <b>Input Nilai Rapor</b>, dan soal UTS/UAS otomatis tercentang di <b>Pengumpulan Soal</b> (menu Jadwal Ujian).</div>
      <div class="uje-jn">
        <button onclick="_ujeJenisJawab('uh')"><span>📝</span><b>Ulangan Harian</b><small>nilai harian per bab</small></button>
        <button onclick="_ujeJenisJawab('tugas')"><span>✍️</span><b>Tugas</b><small>tugas / PR</small></button>
        <button onclick="_ujeJenisJawab('uts')"><span>📘</span><b>UTS</b><small>tengah semester</small></button>
        <button onclick="_ujeJenisJawab('uas')"><span>🎓</span><b>UAS</b><small>akhir semester</small></button>
      </div>
      <label class="uje-jn-ke">Untuk Ulangan Harian / Tugas: ke- <input id="uje-jn-ke" type="number" min="1" value="1" class="input"></label>
      <button class="btn btn-ghost" style="width:100%;margin-top:8px" onclick="closeModal();_ujeJenisJawab&&_ujeJenisJawab(null)">Batal</button>`);
  });
}
function _ujeRingkas() {
  const m = UJE.m;
  const totalSoal = UJE_JENIS.reduce((a, j) => a + m.bagian[j].soal.length, 0);
  const totalPoin = UJE_JENIS.reduce((a, j) => a + m.bagian[j].soal.length * (Number(m.bagian[j].poin) || 0), 0);
  const tanpaKunci = UJE_JENIS.reduce((a, j) => a + m.bagian[j].soal.filter((s) => !_ujeAdaKunci(j, s)).length, 0);
  return `${totalSoal} soal · total ${totalPoin} poin (nilai otomatis diubah ke skala 100)${tanpaKunci ? ` · <b style="color:#c0392b">${tanpaKunci} soal belum ada kunci</b>` : ""}`;
}
function _ujeGambar() {
  const m = UJE.m, tab = UJE.tab, bg = m.bagian[tab];
  // pertahankan posisi gulir saat menggambar ulang (mis. setelah menandai kunci di soal ke-20)
  const panel = qs("modal-panel"), tetap = panel && panel.querySelector(".uje") && UJE._tabTerakhir === tab, gulir = panel ? panel.scrollTop : 0;
  UJE._tabTerakhir = tab;
  openModal(`<div class="uje">
    <h3 style="margin-bottom:4px">${m.bankId ? "✏️ Ubah soal" : "✨ Buat soal baru"}</h3>
    <div class="uj-sub" style="margin-bottom:12px">Tidak perlu file JSON. Ketik langsung, <b>tempel dari Word</b>, atau <b>unggah berkas Word/PDF/foto soal</b>. Kunci jawaban disimpan terpisah dan tidak pernah terlihat santri.</div>
    <div class="uje-meta">
      <div class="field" style="grid-column:1/-1"><label class="form-label">📝 Judul</label><input class="input" value="${escapeHtml(m.judul)}" placeholder="mis. Penilaian Bab 2 — Teks Eksposisi" oninput="UJE.m.judul=this.value"></div>
      <div class="field"><label class="form-label">📘 Mapel</label><select class="input" onchange="UJE.m.mapel_id=this.value"><option value="">— pilih —</option>${LOOKUP.mapel.map((x) => `<option value="${x.id}" ${x.id === m.mapel_id ? "selected" : ""}>${escapeHtml(x.nama_mapel)}</option>`).join("")}</select></div>
      <div class="field"><label class="form-label">🏫 Kelas (tingkat)</label><input class="input" value="${escapeHtml(m.tingkat)}" placeholder="mis. 10" oninput="UJE.m.tingkat=this.value"></div>
      <div class="field"><label class="form-label">📊 Dihitung sebagai</label><select class="input" onchange="UJE.m.jenisNilai=this.value">${[["uh", "Ulangan Harian"], ["tugas", "Tugas"], ["uts", "UTS"], ["uas", "UAS"]].map(([k, l]) => `<option value="${k}" ${(m.jenisNilai || "uh") === k ? "selected" : ""}>${l}</option>`).join("")}</select></div>
      <div class="field"><label class="form-label">🔖 Bab / ke-</label><input class="input" type="number" min="1" value="${m.bab}" oninput="UJE.m.bab=Number(this.value)||1;UJE.m.jenisKe=UJE.m.bab"></div>
    </div>
    <div class="uje-tab">${UJE_JENIS.map((j) => `<button class="${j === tab ? "aktif" : ""}" style="--rgb:${UJE_WARNA[j]}" onclick="UJE.tab='${j}';_ujeGambar()">${UJE_IKON[j]} ${UJE_LABEL[j]} <span>${m.bagian[j].soal.length}</span>${UJE_JENIS_BARU.includes(j) && !m.bagian[j].soal.length ? `<i class="uje-baru">baru</i>` : ""}</button>`).join("")}</div>
    <div class="uje-bagian" style="--rgb:${UJE_WARNA[tab]}">
      <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:flex-end">
        <div class="field" style="margin:0"><label class="form-label">Poin per soal</label><input class="input" type="number" min="0" step="0.5" style="width:110px" value="${bg.poin}" oninput="UJE.m.bagian['${tab}'].poin=Number(this.value)||0;_ujeHitungFooter()"></div>
        <div class="uj-sub" style="flex:1;min-width:200px">${UJE_PETUNJUK[tab]}</div>
      </div>
      ${UJE_JENIS_BARU.includes(tab) && UJ.versi !== undefined && UJ.versi < 4 ? `<div class="uj-peringatan">⚠️ Penilaian otomatis ${UJE_LABEL[tab]} butuh pembaruan database. Minta admin menjalankan <b>SQL_UJIAN_SANTRI_4.sql</b> di Supabase → SQL Editor sebelum soal ini dipakai ujian.</div>` : ""}
      <details class="uje-stim" ${bg.stimulus ? "open" : ""}><summary>📖 Teks bacaan untuk semua soal di bagian ini (opsional)</summary>
        <textarea dir="auto" class="input" rows="4" placeholder="Tempel teks bacaan/cerita di sini" oninput="UJE.m.bagian['${tab}'].stimulus=this.value">${escapeHtml(bg.stimulus)}</textarea></details>
      <div id="uje-daftar">${bg.soal.map((s, i) => _ujeKartu(tab, s, i)).join("") || `<div class="uj-kosong">Belum ada soal ${UJE_LABEL[tab]}.</div>`}</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px">
        <button class="btn btn-sm uje-b-tambah" onclick="ujeTambah('${tab}')">➕ Tambah soal ${UJE_LABEL[tab]}</button>
        <button class="btn btn-sm uje-b-tempel" onclick="ujeTempelBuka()">📋 Tempel / 📄 unggah Word·PDF·foto</button>
      </div>
    </div>
    <div class="uje-kaki">
      <div id="uje-ringkas" class="uj-sub">${_ujeRingkas()}</div>
      <button class="btn btn-sm uje-b-json" onclick="ujeUnduhJson()" title="Unduh cadangan (berisi kunci)">⬇️ Cadangan</button>
      <button class="btn btn-accent" onclick="ujeSimpan()">💾 Simpan bank soal</button>
    </div></div>`, { lebar: true });
  if (tetap) { panel.querySelector(".uje")?.classList.add("tetap"); panel.scrollTop = gulir; }
}
function _ujeHitungFooter() { const el = qs("uje-ringkas"); if (el) el.innerHTML = _ujeRingkas(); }
function _ujeAdaKunci(j, s) {
  if (j === "pg") return s.k !== null && s.k !== undefined && [].concat(s.k).length > 0;
  if (j === "pgk") return s.bs ? (s.k || []).length === (s.o || []).length : (s.k || []).length > 0;
  if (j === "isian") return (s.kt || []).length > 0 && s.kt.slice(0, _ujeJumlahTitik(s.t)).every((x) => String(x || "").trim());
  if (j === "jodoh") return (s.o || []).filter((o, x) => String(o).trim() && String((s.p || [])[x] || "").trim()).length >= 2;
  if (j === "urut") return (s.o || []).filter((o) => String(o).trim()).length >= 2;
  return String(s.kunci || "").trim() !== "";
}
// Baris media: gambar + audio (semua jenis soal)
function _ujeMedia(j, s, i) {
  const S = _ujeS(j, i);
  return `<div class="uje-gambar">
    ${s.g ? `<img src="${escapeHtml(s.g)}" alt=""><button class="uje-ik merah" onclick="${S}.g='';_ujeGambar()">✕ gambar</button>`
      : `<label class="btn btn-sm uje-b-gambar">🖼️ Gambar soal<input type="file" accept="image/*" style="display:none" onchange="ujeUnggahGambar('${j}',${i},this)"></label>`}
    ${s.au ? `<audio controls preload="none" src="${escapeHtml(s.au)}"></audio><button class="uje-ik merah" onclick="${S}.au='';_ujeGambar()">✕ audio</button>`
      : `<label class="btn btn-sm uje-b-audio" title="Untuk soal menyimak / listening: mp3, m4a, wav, ogg (maks 15 MB)">🔊 Audio<input type="file" accept="audio/*,.mp3,.m4a,.wav,.ogg,.aac" style="display:none" onchange="ujeUnggahAudio('${j}',${i},this)"></label>`}
  </div>`;
}
function _ujeKartu(j, s, i) {
  const H = "ABCDEFGHIJ", ada = _ujeAdaKunci(j, s), S = _ujeS(j, i);
  const kunciPG = [].concat(s.k ?? []);
  const placeholder = j === "isian" ? "Tulis soal… mis. Ibu kota Indonesia adalah ___." : j === "jodoh" ? UJE_TEKS_BAWAAN.jodoh : j === "urut" ? "mis. Susunlah kata-kata berikut menjadi kalimat yang benar!" : "Tulis pertanyaan… (pakai **kata** untuk huruf tebal)";
  let isi = "";
  if (j === "uraian") isi = `
      <label class="form-label" style="margin-top:6px">🔑 Kunci / contoh jawaban</label>
      <textarea dir="auto" class="input" rows="2" oninput="${S}.kunci=this.value;_ujeTandaKunci('${j}',${i})">${escapeHtml(s.kunci || "")}</textarea>
      <label class="form-label" style="margin-top:6px">✅ Poin penilaian (pisahkan dengan titik koma) — dipakai untuk saran skor otomatis</label>
      <input class="input" value="${escapeHtml((s.poin_kunci || []).join("; "))}" placeholder="mis. menyebut 4 musim; menjelaskan ciri" oninput="${S}.poin_kunci=this.value.split(';').map(x=>x.trim()).filter(Boolean)">
      <label class="uje-bs-pilih"><input type="checkbox" ${s.rek ? "checked" : ""} onchange="${S}.rek=this.checked"> 🎤 Santri menjawab dengan <b>rekaman suara</b> (ujian speaking / hafalan / membaca)</label>`;
  else if (j === "isian") {
    const n = _ujeJumlahTitik(s.t), kt = (s.kt || []).slice(0, n); while (kt.length < n) kt.push("");
    isi = `<div class="uje-isian">${kt.map((v, x) => `<div class="uje-opsi-baris"><span class="uje-titik">${n > 1 ? `Titik ${x + 1}` : "Jawaban"}</span><input dir="auto" class="input" value="${escapeHtml(v)}" placeholder="mis. Jakarta / DKI Jakarta" oninput="${S}.kt[${x}]=this.value;_ujeTandaKunci('${j}',${i})"></div>`).join("")}
      <div class="uj-sub">Beberapa jawaban yang sama-sama benar dipisah garis miring <b>/</b>. Huruf besar/kecil, spasi & tanda baca di ujung tidak dipersoalkan.</div></div>`;
  } else if (j === "jodoh") {
    isi = `<div class="uje-jodoh"><div class="uje-jodoh-h"><span>Kiri (pernyataan)</span><span>Kanan (pasangan benar)</span></div>
      ${(s.o || []).map((o, x) => `<div class="uje-jodoh-baris"><span class="uje-no-kecil">${x + 1}</span><input dir="auto" class="input" value="${escapeHtml(o)}" placeholder="mis. Ibu kota Jepang" oninput="${S}.o[${x}]=this.value;_ujeTandaKunci('${j}',${i})"><span class="uje-panah">↔</span><input dir="auto" class="input" value="${escapeHtml((s.p || [])[x] || "")}" placeholder="mis. Tokyo" oninput="${S}.p[${x}]=this.value;_ujeTandaKunci('${j}',${i})">${(s.o || []).length > 2 ? `<button class="uje-ik" title="Hapus pasangan" onclick="${S}.o.splice(${x},1);${S}.p.splice(${x},1);_ujeGambar()">✕</button>` : ""}</div>`).join("")}
      <button class="uje-ik" style="margin-top:4px" onclick="${S}.o.push('');${S}.p.push('');_ujeGambar()">＋ pasangan</button>
      <details class="uje-stim" ${(s.px || []).length ? "open" : ""}><summary>🎭 Pengecoh: jawaban kanan tambahan yang salah (opsional)</summary>
        ${(s.px || []).map((p, x) => `<div class="uje-opsi-baris"><input dir="auto" class="input" value="${escapeHtml(p)}" placeholder="mis. Seoul" oninput="${S}.px[${x}]=this.value"><button class="uje-ik" onclick="${S}.px.splice(${x},1);_ujeGambar()">✕</button></div>`).join("")}
        <button class="uje-ik" onclick="(${S}.px=${S}.px||[]).push('');_ujeGambar()">＋ pengecoh</button></details></div>`;
  } else if (j === "urut") {
    const n = (s.o || []).length;
    isi = `<div class="uje-urut">${(s.o || []).map((o, x) => `<div class="uje-opsi-baris"><span class="uje-no-kecil">${x + 1}</span><input dir="auto" class="input" value="${escapeHtml(o)}" placeholder="${x === 0 ? "bagian pertama (urutan benar)" : "bagian berikutnya"}" oninput="${S}.o[${x}]=this.value;_ujeTandaKunci('${j}',${i})">
        <button class="uje-ik" onclick="ujeGeserBaris('${j}',${i},${x},-1)" ${x === 0 ? "disabled" : ""}>↑</button><button class="uje-ik" onclick="ujeGeserBaris('${j}',${i},${x},1)" ${x === n - 1 ? "disabled" : ""}>↓</button>${n > 2 ? `<button class="uje-ik" onclick="${S}.o.splice(${x},1);_ujeGambar()">✕</button>` : ""}</div>`).join("")}
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px"><button class="uje-ik" onclick="${S}.o.push('');_ujeGambar()">＋ bagian</button><button class="uje-ik" onclick="ujePecahKalimat('${j}',${i})">✂️ Pecah kalimat jadi kata</button></div></div>`;
  } else if (s.bs) isi = `<div class="uje-opsi">${(s.o || []).map((o, k) => `<div class="uje-opsi-baris">
        <input dir="auto" class="input" value="${escapeHtml(o)}" placeholder="Pernyataan ${k + 1}" oninput="${S}.o[${k}]=this.value">
        <button class="uje-bs ${s.k[k] ? "ya" : "tidak"}" title="Ketuk untuk mengganti kunci" onclick="ujeKunci('${j}',${i},${k})">${s.k[k] ? "✅ " + escapeHtml(s.bs[0]) : "❌ " + escapeHtml(s.bs[1])}</button>
        ${(s.o || []).length > 2 ? `<button class="uje-ik" title="Hapus pernyataan" onclick="ujeHapusOpsi('${j}',${i},${k})">✕</button>` : ""}</div>`).join("")}
        <button class="uje-ik" style="margin-top:4px" onclick="${S}.o.push('');${S}.k.push(true);_ujeGambar()">＋ pernyataan</button></div>`;
  else isi = `<div class="uje-opsi">${(s.o || []).map((o, k) => { const og = (s.og || [])[k]; return `<div class="uje-opsi-baris ${kunciPG.includes(k) ? "benar" : ""}">
        <button class="uje-huruf" title="${j === "pg" ? "Jadikan jawaban benar" : "Tandai benar/salah"}" onclick="ujeKunci('${j}',${i},${k})">${H[k]}</button>
        <input dir="auto" class="input" value="${escapeHtml(o)}" placeholder="Pilihan ${H[k]}${og ? " (boleh kosong, ada gambar)" : ""}" oninput="${S}.o[${k}]=this.value">
        ${og ? `<span class="uje-og"><img src="${escapeHtml(og)}" alt=""><button onclick="${S}.og[${k}]='';_ujeGambar()" title="Hapus gambar pilihan">✕</button></span>`
          : `<label class="uje-ik" title="Pilihan berupa gambar">🖼️<input type="file" accept="image/*" style="display:none" onchange="ujeUnggahGambar('${j}',${i},this,${k})"></label>`}
        ${(s.o || []).length > 2 ? `<button class="uje-ik" title="Hapus pilihan" onclick="ujeHapusOpsi('${j}',${i},${k})">✕</button>` : ""}</div>`; }).join("")}
        ${(s.o || []).length < 8 ? `<button class="uje-ik" style="margin-top:4px" onclick="${S}.o.push('');_ujeGambar()">＋ pilihan</button>` : ""}</div>`;
  return `<div class="uje-kartu ${ada ? "" : "uje-tanpa-kunci"}" id="uje-k-${i}">
    <div class="uje-kartu-atas"><span class="uje-no">${i + 1}</span>
      ${ada ? "" : `<span class="uje-lencana">⚠️ belum ada kunci</span>`}
      <span style="flex:1"></span>
      <button class="uje-ik" title="Naik" onclick="ujeGeser('${j}',${i},-1)" ${i === 0 ? "disabled" : ""}>↑</button>
      <button class="uje-ik" title="Turun" onclick="ujeGeser('${j}',${i},1)">↓</button>
      <button class="uje-ik" title="Gandakan" onclick="ujeGanda('${j}',${i})">⧉</button>
      <button class="uje-ik merah" title="Hapus soal" onclick="ujeHapus('${j}',${i})">🗑</button></div>
    <details ${s.stimulus ? "open" : ""} class="uje-stim"><summary>📖 Teks bacaan khusus soal ini</summary><textarea dir="auto" class="input" rows="3" oninput="${S}.stimulus=this.value">${escapeHtml(s.stimulus || "")}</textarea></details>
    <textarea dir="auto" class="input uje-teks" rows="2" placeholder="${escapeHtml(placeholder)}" oninput="${S}.t=this.value" ${j === "isian" ? `onchange="_ujeSinkronTitik(${i})"` : ""}>${escapeHtml(s.t || "")}</textarea>
    ${_ujeMedia(j, s, i)}
    ${isi}
    ${j === "pgk" ? `<label class="uje-bs-pilih"><input type="checkbox" ${s.bs ? "checked" : ""} onchange="ujeUbahBS(${i},this.checked)"> 📋 Bentuk tabel ${s.bs ? `<select onchange="UJE.m.bagian.pgk.soal[${i}].bs=UJE_BS[this.value];_ujeGambar()">${UJE_BS.map((p, x) => `<option value="${x}" ${s.bs[0] === p[0] ? "selected" : ""}>${p[0]} / ${p[1]}</option>`).join("")}</select>` : "Benar/Salah (tiap pernyataan dinilai sendiri)"}</label>` : ""}
    <details class="uje-stim" ${s.penjelasan ? "open" : ""}><summary>💡 Penjelasan singkat (tampil di hasil santri setelah ustadz membukanya)</summary>
      <textarea dir="auto" class="input" rows="2" placeholder="mis. 🏭 Kata kuncinya nilai tambah… 📖 Modul hlm. 21" oninput="${S}.penjelasan=this.value">${escapeHtml(s.penjelasan || "")}</textarea></details>
  </div>`;
}
function _ujeTandaKunci(j, i) {
  const el = qs("uje-k-" + i); if (el) el.classList.toggle("uje-tanpa-kunci", !_ujeAdaKunci(j, UJE.m.bagian[j].soal[i]));
  _ujeHitungFooter();
}
// Isian: jumlah kotak kunci mengikuti jumlah ___ di teks soal
function _ujeSinkronTitik(i) {
  const s = UJE.m.bagian.isian.soal[i], n = _ujeJumlahTitik(s.t);
  if ((s.kt || []).length !== n) { s.kt = (s.kt || []).slice(0, n); while (s.kt.length < n) s.kt.push(""); _ujeGambar(); }
}
function ujeGeserBaris(j, i, x, d) { const a = UJE.m.bagian[j].soal[i].o, t = x + d; if (t < 0 || t >= a.length) return; [a[x], a[t]] = [a[t], a[x]]; _ujeGambar(); }
async function ujePecahKalimat(j, i) {
  const s = UJE.m.bagian[j].soal[i];
  const kal = await promptTema("Tulis kalimat yang BENAR. Akan dipecah per kata (atau pakai / untuk memisah bagian).", s.o.filter((x) => String(x).trim()).join(" "), { judul: "Pecah kalimat", ikon: "✂️", teksOk: "Pecah" });
  if (!kal || !kal.trim()) { _ujeGambar(); return; }
  s.o = (kal.includes("/") ? kal.split("/") : kal.trim().split(/\s+/)).map((x) => x.trim()).filter(Boolean);
  _ujeGambar();
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
  if (aktif) { const lama = new Set(s.k || []); s.bs = UJE_BS[0]; s.o = s.o.filter((o) => String(o).trim()).concat(s.o.filter((o) => String(o).trim()).length ? [] : ["", "", ""]); s.k = s.o.map((_, x) => lama.has(x)); s.og = []; }
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
  s.o.splice(k, 1); if (s.og) s.og.splice(k, 1);
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
  return new File([blob], (file.name || "gambar").replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" });
}
// k (opsional) = nomor pilihan → gambar untuk pilihan jawaban
async function ujeUnggahGambar(j, i, input, k) {
  const f = input.files && input.files[0]; if (!f) return;
  const lbl = input.closest("label"); if (lbl && lbl.firstChild) lbl.firstChild.textContent = "⏳ ";
  try {
    const url = await apiUploadFoto(await _ujeKecilkan(f), "ujian-soal");
    const s = UJE.m.bagian[j].soal[i];
    if (k === undefined) s.g = url; else { s.og = s.og || []; while (s.og.length < s.o.length) s.og.push(""); s.og[k] = url; }
    _ujeGambar();
  } catch (e) { toast("Gagal mengunggah gambar: " + (typeof _diagnosaErrorUploadFoto === "function" ? _diagnosaErrorUploadFoto(e.message) : e.message), "err"); _ujeGambar(); }
}
async function ujeUnggahAudio(j, i, input) {
  const f = input.files && input.files[0]; if (!f) return;
  if (f.size > 15 * 1024 * 1024) { toast("Audio maksimal 15 MB. Perkecil dulu (mis. mp3 64 kbps).", "err"); return; }
  const lbl = input.closest("label"); if (lbl && lbl.firstChild) lbl.firstChild.textContent = "⏳ Mengunggah… ";
  try {
    const nama = /\.\w{2,4}$/.test(f.name) ? f.name : f.name + ".mp3";
    const url = await apiUploadFoto(new File([f], nama, { type: f.type || "audio/mpeg" }), "ujian-audio");
    UJE.m.bagian[j].soal[i].au = url; _ujeGambar(); toast("🔊 Audio terpasang", "ok");
  } catch (e) { toast("Gagal mengunggah audio: " + (typeof _diagnosaErrorUploadFoto === "function" ? _diagnosaErrorUploadFoto(e.message) : e.message), "err"); _ujeGambar(); }
}

// ── Tempel dari Word / PDF / foto ──
function ujeTempelBuka() {
  openModal(`<h3>📋 Masukkan soal dari Word / PDF / foto</h3>
    <div class="uje-unggah">
      <label class="uje-unggah-kotak"><input type="file" accept=".docx,.pdf,.txt,image/*" style="display:none" onchange="ujeBacaBerkas(this)">
        <span class="uje-unggah-ikon">📄</span><b>Unggah berkas soal</b><small>Word (.docx), PDF, atau <b>foto kertas soal</b>. Teks & gambar dibaca otomatis, lalu tinggal diperiksa.</small></label>
      <label class="uje-bs-pilih" style="margin-top:6px"><input type="checkbox" id="uje-ocr-arab"> 🕌 Foto/scan berisi tulisan Arab</label>
    </div>
    <div class="uj-sub" style="line-height:1.7;margin:10px 0 6px">…atau salin soal dari Word/PDF lalu tempel di bawah. Format yang dikenali:</div>
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

C. Isian Singkat
1. Ibu kota Indonesia adalah ___.
Kunci: Jakarta / DKI Jakarta

D. Menjodohkan
1. Ibu kota Jepang = Tokyo
2. Ibu kota Korea Selatan = Seoul

E. Mengurutkan
1. Susunlah kata berikut!
Kunci: Saya / pergi / ke / sekolah

F. Uraian
1. Apa arti pancaroba?
Kunci: masa peralihan antarmusim</pre>
    <details class="je-atur" style="margin:6px 0"><summary>🕌 Soal bahasa Arab juga bisa</summary>
      <pre class="uje-contoh" dir="rtl" style="font-family:'Amiri',serif;font-size:15px">أ. اختر الإجابة الصحيحة
١. ما معنى الصلاة لغة؟
أ. الدعاء
ب. الصيام
الجواب: أ

ب. أجب عن الأسئلة التالية
١. اذكر شروط الصلاة!
الجواب: الإسلام والعقل</pre>
      <div class="uj-sub">Nomor ١ ٢ ٣, pilihan أ ب ج د هـ, dan "الجواب:" dikenali. Soal Arab tampil kanan-ke-kiri di layar santri; soal Indonesia/Inggris kiri-ke-kanan.</div></details>
    <div class="uj-sub" style="margin:6px 0">Kunci juga boleh ditandai dengan bintang di depan pilihan (<b>*b. fakta</b>). Soal tanpa pilihan otomatis jadi uraian. <b>Soal tanpa kunci tetap masuk</b> — kuncinya ditandai setelahnya (ditandai ⚠️).</div>
    <textarea id="uje-tempel" dir="auto" class="input" rows="12" placeholder="Tempel di sini…"></textarea>
    <div id="uje-tempel-info" class="uj-sub" style="margin-top:6px"></div>
    <div style="display:flex;gap:10px;margin-top:10px"><button class="btn btn-outline" style="flex:1" onclick="_ujeGambar()">‹ Kembali</button><button class="btn btn-accent" style="flex:1" onclick="ujeTempelProses()">✨ Masukkan soal</button></div>`, { lebar: true });
  const ta = qs("uje-tempel");
  ta.oninput = () => _ujeInfoTempel();
  if (UJE.impor.teks) { ta.value = UJE.impor.teks; _ujeInfoTempel(); }
  ta.focus();
}
function _ujeInfoTempel(tambahan) {
  const ta = qs("uje-tempel"), el = qs("uje-tempel-info"); if (!ta || !el) return;
  UJE.impor.teks = ta.value;
  const h = _ujeUraiTeks(ta.value);
  const n = UJE_JENIS.reduce((a, j) => a + h[j].length, 0);
  el.innerHTML = (tambahan ? tambahan + "<br>" : "") + (ta.value.trim() ? `Terbaca <b>${n}</b> soal: ${UJE_JENIS.filter((j) => h[j].length).map((j) => `${UJE_IKON[j]} ${h[j].length} ${UJE_LABEL[j]}`).join(" · ") || "-"}${h.tanpaKunci ? ` · <b style="color:#b45309">${h.tanpaKunci} tanpa kunci</b>` : ""}${h.gambar ? ` · 🖼️ ${h.gambar} gambar` : ""}` : "");
}
async function ujeTempelProses() {
  const h = _ujeUraiTeks(qs("uje-tempel").value);
  const n = UJE_JENIS.reduce((a, j) => a + h[j].length, 0);
  if (!n) { toast("Tidak ada soal bernomor yang terbaca", "err"); return; }
  // gambar dari berkas Word/PDF → unggah dulu (dikecilkan)
  const perlu = [];
  UJE_JENIS.forEach((j) => h[j].forEach((s) => { if (/^\[\[GAMBAR:\d+\]\]$/.test(s.g || "")) perlu.push([s, "g"]); (s.og || []).forEach((g, x) => { if (/^\[\[GAMBAR:\d+\]\]$/.test(g || "")) perlu.push([s, "og", x]); }); }));
  if (perlu.length) {
    setGlobalLoading(true, `Mengunggah ${perlu.length} gambar soal…`);
    let ok = 0;
    for (const [s, f, x] of perlu) {
      const tok = f === "g" ? s.g : s.og[x], data = UJE.impor.gambar[Number(tok.match(/\d+/)[0])];
      let url = "";
      try { if (data) { const blob = await (await fetch(data)).blob(); url = await apiUploadFoto(await _ujeKecilkan(new File([blob], "soal.png", { type: blob.type || "image/png" })), "ujian-soal"); ok++; } }
      catch (e) { console.warn("Gambar impor gagal:", e); }
      if (f === "g") s.g = url; else s.og[x] = url;
    }
    setGlobalLoading(false);
    if (ok < perlu.length) toast(`${perlu.length - ok} gambar gagal diunggah — tambahkan manual`, "err");
  }
  UJE_JENIS.forEach((j) => {
    const bg = UJE.m.bagian[j];
    // buang kartu kosong bawaan sebelum menambah
    bg.soal = bg.soal.filter((s) => (s.t || "").trim() || (s.o || []).some((o) => String(o).trim()));
    bg.soal.push(...h[j]);
  });
  UJE.tab = UJE_JENIS.find((j) => h[j].length) || UJE.tab;
  UJE.impor = { gambar: [] };
  toast(`${n} soal dimasukkan${h.tanpaKunci ? ` · ${h.tanpaKunci} belum ada kunci (ditandai ⚠️)` : ""}`, "ok");
  _ujeGambar();
}

// ── Membaca berkas: .docx (teks + penomoran otomatis + gambar), .pdf (teks; scan → OCR), foto (OCR) ──
const _UJE_CDN = {
  jszip: "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js",
  pdf: "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js",
  pdfWorker: "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js",
  ocr: "https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js",
};
const _ujeSkrip = {};
function _ujeMuatSkrip(url) {
  return (_ujeSkrip[url] = _ujeSkrip[url] || new Promise((ok, no) => { const s = document.createElement("script"); s.src = url; s.onload = ok; s.onerror = () => { delete _ujeSkrip[url]; no(new Error("Gagal memuat alat pembaca (periksa internet)")); }; document.head.appendChild(s); }));
}
function _ujeProgres(teks) { const el = qs("uje-tempel-info"); if (el) el.innerHTML = `<span class="uje-proses">⏳ ${teks}</span>`; }
async function ujeBacaBerkas(input) {
  const f = input.files && input.files[0]; input.value = ""; if (!f) return;
  const nama = f.name.toLowerCase();
  UJE.impor = { gambar: [] };
  try {
    let teks = "", catatan = "";
    if (/\.docx$/.test(nama)) { _ujeProgres("Membaca Word…"); teks = await _ujeTeksDocx(f); }
    else if (/\.pdf$/.test(nama) || f.type === "application/pdf") {
      _ujeProgres("Membaca PDF…"); const r = await _ujeTeksPdf(f); teks = r.teks;
      if (r.scan) catatan = "📷 PDF hasil scan dibaca dengan pengenal huruf (OCR) — periksa ejaannya.";
    } else if (/^image\//.test(f.type)) { teks = await _ujeOcr([f]); catatan = "📷 Foto dibaca dengan pengenal huruf (OCR) — periksa ejaan & kuncinya."; }
    else if (/\.txt$/.test(nama)) teks = await f.text();
    else if (/\.doc$/.test(nama)) { toast("Format .doc lama belum bisa dibaca. Di Word: File → Simpan Sebagai → .docx, lalu unggah lagi.", "err"); _ujeProgres(""); return; }
    else { toast("Format berkas belum dikenali", "err"); return; }
    teks = _ujeRapikanTeks(teks);
    if (!teks.trim()) { _ujeInfoTempel("⚠️ Tidak ada teks yang terbaca dari berkas ini."); return; }
    const ta = qs("uje-tempel"); if (!ta) return;
    ta.value = teks; ta.scrollTop = 0;
    _ujeInfoTempel(`✅ <b>${escapeHtml(f.name)}</b> terbaca. ${catatan} Periksa teks di bawah (boleh diedit), lalu tekan <b>✨ Masukkan soal</b>.`);
  } catch (e) { console.error(e); _ujeInfoTempel(`⚠️ Gagal membaca berkas: ${escapeHtml(e.message || String(e))}`); }
}
function _ujeRapikanTeks(t) {
  return String(t || "").replace(/\r/g, "").replace(/ /g, " ").replace(/[ \t]+$/gm, "")
    .replace(/^\s*(\d{1,3})\s*[.)]\s*(?=\S)/gm, "$1. ") // "1)" "1 ." → "1. "
    .replace(/^(\s*)([a-eA-E])\s*[.)]\s*(?=\S)/gm, "$1$2. ")
    .replace(/\n{3,}/g, "\n\n");
}
// .docx dibaca langsung dari isi XML-nya supaya penomoran otomatis Word (1. 2. / a. b.) & gambar ikut terbaca
async function _ujeTeksDocx(file) {
  await _ujeMuatSkrip(_UJE_CDN.jszip);
  const zip = await JSZip.loadAsync(await file.arrayBuffer());
  const xml = async (p) => { const f = zip.file(p); return f ? new DOMParser().parseFromString(await f.async("string"), "application/xml") : null; };
  const [doc, num, rels] = await Promise.all([xml("word/document.xml"), xml("word/numbering.xml"), xml("word/_rels/document.xml.rels")]);
  if (!doc) throw new Error("Isi Word tidak ditemukan");
  const at = (el, n) => el && (el.getAttribute("w:" + n) ?? el.getAttribute(n));
  const anak = (el, nama) => [...(el?.childNodes || [])].filter((x) => x.nodeName === nama);
  // penomoran: numId → abstractNumId → level → { fmt, teks, mulai }
  const abstrak = {}, numKe = {};
  if (num) {
    [...num.getElementsByTagName("w:abstractNum")].forEach((a) => {
      const lv = {};
      anak(a, "w:lvl").forEach((l) => { lv[at(l, "ilvl")] = { fmt: at(anak(l, "w:numFmt")[0], "val") || "decimal", teks: at(anak(l, "w:lvlText")[0], "val") ?? "%1.", mulai: Number(at(anak(l, "w:start")[0], "val") || 1) }; });
      abstrak[at(a, "abstractNumId")] = lv;
    });
    [...num.getElementsByTagName("w:num")].forEach((n) => { numKe[at(n, "numId")] = abstrak[at(anak(n, "w:abstractNumId")[0], "val")] || {}; });
  }
  const relasi = {};
  if (rels) [...rels.getElementsByTagName("Relationship")].forEach((r) => { relasi[r.getAttribute("Id")] = r.getAttribute("Target"); });
  const romawi = (n) => [["m", 1000], ["cm", 900], ["d", 500], ["cd", 400], ["c", 100], ["xc", 90], ["l", 50], ["xl", 40], ["x", 10], ["ix", 9], ["v", 5], ["iv", 4], ["i", 1]].reduce((s, [h, v]) => { while (n >= v) { s += h; n -= v; } return s; }, "");
  const format = (n, fmt) => fmt === "lowerLetter" ? String.fromCharCode(96 + ((n - 1) % 26) + 1) : fmt === "upperLetter" ? String.fromCharCode(64 + ((n - 1) % 26) + 1)
    : fmt === "lowerRoman" ? romawi(n) : fmt === "upperRoman" ? romawi(n).toUpperCase() : fmt === "bullet" || fmt === "none" ? "" : String(n);
  const hitung = {}; // numId → [counter per level]
  const gambarMedia = async (rid) => {
    const target = relasi[rid]; if (!target) return "";
    const path = "word/" + target.replace(/^\.?\//, "").replace(/^\.\.\//, "");
    const f = zip.file(path) || zip.file(target.replace(/^\//, ""));
    if (!f || !/\.(png|jpe?g|gif|bmp|webp)$/i.test(path)) return ""; // emf/wmf (rumus Word) tidak bisa ditampilkan
    const ext = path.split(".").pop().toLowerCase().replace("jpg", "jpeg");
    UJE.impor.gambar.push(`data:image/${ext};base64,${await f.async("base64")}`);
    return ` [[GAMBAR:${UJE.impor.gambar.length - 1}]] `;
  };
  const teksRun = async (p) => {
    let s = "";
    const jalan = async (el) => {
      for (const c of el.childNodes) {
        const n = c.nodeName;
        if (n === "w:t") s += c.textContent;
        else if (n === "w:tab") s += "   ";
        else if (n === "w:br" || n === "w:cr") s += "\n";
        else if (n === "a:blip") s += await gambarMedia(c.getAttribute("r:embed"));
        else if (n === "v:imagedata") s += await gambarMedia(c.getAttribute("r:id"));
        else if (n === "w:pPr" || n === "w:rPr" || n === "w:instrText" || n === "w:delText") continue;
        else if (c.childNodes && c.childNodes.length) await jalan(c);
      }
    };
    await jalan(p);
    return s;
  };
  const baris = [];
  const paragraf = async (p) => {
    const pr = anak(p, "w:pPr")[0], np = pr && anak(pr, "w:numPr")[0];
    let label = "";
    if (np) {
      const id = at(anak(np, "w:numId")[0], "val"), lvl = Number(at(anak(np, "w:ilvl")[0], "val") || 0), def = numKe[id] || {};
      if (id && id !== "0") {
        const c = (hitung[id] = hitung[id] || []);
        for (let x = 0; x <= lvl; x++) if (c[x] === undefined) c[x] = (def[x]?.mulai ?? 1) - (x === lvl ? 1 : 0);
        c[lvl]++; c.length = lvl + 1;
        const d = def[lvl] || { fmt: lvl ? "lowerLetter" : "decimal", teks: `%${lvl + 1}.` };
        label = d.fmt === "bullet" ? "" : String(d.teks).replace(/%(\d)/g, (m, k) => format(c[Number(k) - 1] ?? 1, (def[Number(k) - 1] || d).fmt)) + " ";
      }
    }
    const t = await teksRun(p);
    baris.push(label + t.trim());
  };
  const blok = async (el) => {
    for (const c of el.childNodes) {
      if (c.nodeName === "w:p") await paragraf(c);
      else if (c.nodeName === "w:tbl") {
        for (const tr of anak(c, "w:tr")) {
          const sel = [];
          for (const tc of anak(tr, "w:tc")) { const isi = []; for (const p of anak(tc, "w:p")) isi.push((await teksRun(p)).trim()); sel.push(isi.filter(Boolean).join(" ")); }
          baris.push(sel.filter(Boolean).join("   "));
        }
      } else if (c.nodeName === "w:sdt") { const isi = anak(c, "w:sdtContent")[0]; if (isi) await blok(isi); }
    }
  };
  await blok(doc.getElementsByTagName("w:body")[0]);
  return baris.join("\n");
}
// PDF: teks disusun per baris dari posisi huruf; halaman tanpa teks (hasil scan) dibaca dengan OCR
async function _ujeTeksPdf(file) {
  await _ujeMuatSkrip(_UJE_CDN.pdf);
  pdfjsLib.GlobalWorkerOptions.workerSrc = _UJE_CDN.pdfWorker;
  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
  const halaman = [], scan = [];
  for (let h = 1; h <= pdf.numPages; h++) {
    _ujeProgres(`Membaca PDF halaman ${h}/${pdf.numPages}…`);
    const pg = await pdf.getPage(h), isi = await pg.getTextContent();
    const item = isi.items.filter((x) => x.str && x.str.trim()).map((x) => ({ s: x.str, x: x.transform[4], y: x.transform[5], w: x.width, t: Math.abs(x.transform[3]) || 10 }));
    if (item.reduce((a, x) => a + x.s.length, 0) < 25) { scan.push(h); halaman.push(null); continue; }
    item.sort((a, b) => b.y - a.y || a.x - b.x);
    const brs = [];
    item.forEach((it) => { const b = brs[brs.length - 1]; if (b && Math.abs(b.y - it.y) < it.t * 0.55) b.i.push(it); else brs.push({ y: it.y, i: [it] }); });
    halaman.push(brs.map((b) => { b.i.sort((a, c) => a.x - c.x); let s = "", akhir = null; b.i.forEach((it) => { if (akhir !== null) { const jarak = it.x - akhir; s += jarak > it.t * 1.6 ? "   " : jarak > it.t * 0.15 && !/\s$/.test(s) && !/^\s/.test(it.s) ? " " : ""; } s += it.s; akhir = it.x + it.w; }); return s; }).join("\n"));
  }
  if (scan.length) {
    const kanvas = [];
    for (const h of scan) {
      _ujeProgres(`Menyiapkan halaman scan ${h}…`);
      const pg = await pdf.getPage(h), vp = pg.getViewport({ scale: 2 });
      const c = document.createElement("canvas"); c.width = vp.width; c.height = vp.height;
      await pg.render({ canvasContext: c.getContext("2d"), viewport: vp }).promise; kanvas.push([h, c]);
    }
    const hasil = await _ujeOcr(kanvas.map((x) => x[1]));
    const per = hasil.split("\n=== HALAMAN ===\n");
    kanvas.forEach(([h], x) => { halaman[h - 1] = per[x] || ""; });
  }
  return { teks: halaman.join("\n"), scan: scan.length > 0 };
}
// OCR (pengenal huruf) — berjalan di perangkat guru, tanpa biaya server. Bahasa Indonesia + Inggris (+ Arab bila dicentang).
async function _ujeOcr(sumber) {
  _ujeProgres("Memuat pengenal huruf (pertama kali ±10 MB, berikutnya lebih cepat)…");
  await _ujeMuatSkrip(_UJE_CDN.ocr);
  const bahasa = qs("uje-ocr-arab")?.checked ? "ara+ind" : "ind+eng";
  const pekerja = await Tesseract.createWorker(bahasa, 1, { logger: (m) => { if (m.status === "recognizing text") _ujeProgres(`Membaca tulisan… ${Math.round((m.progress || 0) * 100)}%`); } });
  const out = [];
  try {
    for (let x = 0; x < sumber.length; x++) {
      _ujeProgres(`Membaca tulisan ${x + 1}/${sumber.length}…`);
      const { data } = await pekerja.recognize(sumber[x]);
      out.push(data.text || "");
    }
  } finally { await pekerja.terminate(); }
  return out.join("\n=== HALAMAN ===\n");
}

// Soal berbahasa Arab dari Word: nomor ١. / ١- / (١), pilihan أ. ب. ج. د. هـ., judul bagian
// (اختر الإجابة الصحيحة / أجب عن الأسئلة) dan kunci (الجواب: ب) diubah ke bentuk yang dikenali pengurai.
// Teks soal & pilihannya sendiri tidak diubah; arah kanan-ke-kiri diatur saat ditampilkan.
const UJE_HURUF_AR = { "أ": "a", "ا": "a", "إ": "a", "ب": "b", "ج": "c", "د": "d", "هـ": "e", "ه": "e", "و": "f", "ز": "g", "ح": "h" };
const _ujeAngkaLatin = (s) => String(s).replace(/[٠-٩]/g, (d) => d.charCodeAt(0) - 0x660).replace(/[۰-۹]/g, (d) => d.charCodeAt(0) - 0x6f0);
function _ujeNormalArab(l) {
  if (!/[؀-ۿ]/.test(l) && !/^\s*\d{1,3}\s*[-–]\s/.test(l)) return l;
  const kunci = l.match(/^\s*(?:مفتاح الإجابة|الإجابة الصحيحة|الإجابة|الجواب|kunci(?:\s+jawaban)?|jawaban(?:\s+benar)?|jwb)\s*[:：=]\s*(.*)$/i);
  if (kunci) return "Kunci: " + _ujeKunciArab(kunci[1]);
  // nomor soal: ١. ١) ١- (١) 1-
  let x = l.replace(/^(\s*)\(?([0-9٠-٩۰-۹]{1,3})\s*[.)\-–/]\s*/, (m, sp, n) => `${sp}${_ujeAngkaLatin(n)}. `)
    .replace(/^(\s*)\(([0-9٠-٩۰-۹]{1,3})\)\s*/, (m, sp, n) => `${sp}${_ujeAngkaLatin(n)}. `);
  const bernomor = /^\s*\d{1,3}\.\s/.test(x);
  // judul bagian (baris pendek tanpa nomor soal)
  if (!bernomor && x.trim().length < 90) {
    const t = x.replace(/^\s*\(?(?:[أابجده]|هـ|[IVX]{1,4})\s*[.)\-–]\s*/, "");
    if (/أكثر من (إجابة|جواب)|الإجابات الصحيحة/.test(t)) return "Pilihan Ganda Kompleks";
    if (/^(اختر|اختاري|اختيار من متعدد|الاختيار من متعدد|ضع دائرة)/.test(t.trim())) return "Pilihan Ganda";
    if (/^(املأ|املئي|أكمل|أكملي|اكمل)/.test(t.trim())) return "Isian Singkat";
    if (/^(صل|صلي|وصل|زاوج)/.test(t.trim())) return "Menjodohkan";
    if (/^(رتب|رتبي)/.test(t.trim())) return "Mengurutkan";
    if (/^(أجب|أجيبي|الأسئلة المقالية|المقال|أسئلة المقال|اكتب الإجابة)/.test(t.trim())) return "Uraian";
  }
  // pilihan: أ. … ب. … (di awal baris, atau beberapa pilihan dipisah ≥2 spasi/tab dalam satu baris)
  x = x.replace(/(^|\s{2,}|\t)(\*?)\(?(هـ|[أاإبجدهوزح])\s*[.)\-–]\s*/g, (m, awal, bintang, h) => `${awal}${bintang}${UJE_HURUF_AR[h]}. `);
  return x;
}
const _ujeKunciArab = (v) => (/^[\s,،وهـأاإبجدزح.*]+$/.test(v) ? v.split(/[\s,،]+/).map((h) => UJE_HURUF_AR[h.replace(/[.*]/g, "")] || "").filter(Boolean).join(", ") || v : v);
// Pengurai teks bebas → { pg:[], pgk:[], isian:[], jodoh:[], urut:[], uraian:[], tanpaKunci, gambar }
function _ujeUraiTeks(teks, tanpaLewati) {
  const hasil = { pg: [], pgk: [], isian: [], jodoh: [], urut: [], uraian: [], tanpaKunci: 0, gambar: 0 };
  const baris = String(teks || "").replace(/\r/g, "").replace(/\t/g, "  ").split("\n");
  let bagian = null, cur = null, bacaan = [], jodohKini = null, gambarTunda = "";
  const RE_JUDUL = /^\s*(?:[A-H]|[IVX]{1,4})?\s*[.)]?\s*(soal\s+)?(pilihan\s+ganda\s+kompleks|pg\s*kompleks|pilihan\s+ganda|isian(\s+singkat)?|isilah|lengkapilah|melengkapi|menjodohkan|jodohkanlah|jodohkan|pasangkanlah|mengurutkan|urutkanlah|urutkan|menyusun|susunlah|uraian|essay|esai)\b/i;
  const RE_NO = /^\s*(\d{1,3})\s*[.)]\s*(.*)$/;
  const RE_OPSI = /(^|\s{2,}|\t)(\*?)\(?([a-hA-H])\s*[.)]\s+(.+?)(?=(\s{2,}\*?\(?[a-hA-H]\s*[.)]\s)|$)/g;
  const RE_KUNCI = /^\s*(kunci(\s+jawaban)?|jawaban(\s+benar)?|jwb)\s*[:=]\s*(.*)$/i;
  const RE_GBR = /\[\[GAMBAR:(\d+)\]\]/g;
  const tutup = () => {
    if (!cur) return;
    const stim = cur.stimulus.trim(), g = cur.g || "";
    if (cur.o.length) {
      let jenis = bagian === "pg" || bagian === "pgk" ? bagian : null;
      const tanda = cur.o.map((o, i) => (o.benar ? i : -1)).filter((i) => i >= 0);
      let k = tanda;
      if (!k.length && cur.kunci != null) k = (cur.kunci.match(/\b[a-hA-H]\b/g) || []).map((x) => x.toLowerCase().charCodeAt(0) - 97).filter((i) => i < cur.o.length);
      if (!jenis) jenis = k.length > 1 ? "pgk" : "pg";
      const og = cur.o.map((o) => o.g || "");
      const s = { t: cur.t.trim(), g, au: "", stimulus: stim, penjelasan: "", o: cur.o.map((o) => o.teks.trim()), og: og.some(Boolean) ? og : [], k: jenis === "pg" ? (k.length ? k[0] : null) : [...new Set(k)], bs: null };
      if (!_ujeAdaKunci(jenis, s)) hasil.tanpaKunci++;
      hasil[jenis].push(s); cur = null; return;
    }
    let s, jenis = bagian === "pg" || bagian === "pgk" || !bagian ? "uraian" : bagian;
    if (jenis === "jodoh") {
      const [kiri, kanan] = cur.t.split(/\s*(?:=|→|->|⇒|\||:)\s*/);
      if (!jodohKini) { jodohKini = { ..._ujeDasar(), t: cur.judulBagian || UJE_TEKS_BAWAAN.jodoh, stimulus: stim, o: [], p: [], px: [] }; hasil.jodoh.push(jodohKini); }
      jodohKini.o.push((kiri || "").trim()); jodohKini.p.push(String(kanan || cur.kunci || "").trim());
      if (g && !jodohKini.g) jodohKini.g = g;
      cur = null; return;
    }
    if (jenis === "urut") {
      const sumber = cur.kunci != null && cur.kunci.trim() ? cur.kunci : cur.t;
      const bag = (/\//.test(sumber) ? sumber.split("/") : /\s\|\s|;/.test(sumber) ? sumber.split(/\s\|\s|;/) : sumber.trim().split(/\s+/)).map((x) => x.trim()).filter(Boolean);
      s = { ..._ujeDasar(), t: cur.kunci != null && cur.t.trim() ? cur.t.trim() : UJE_TEKS_BAWAAN.urut, g, stimulus: stim, o: bag };
    } else if (jenis === "isian") {
      const n = _ujeJumlahTitik(cur.t);
      const kt = cur.kunci != null ? (n > 1 ? cur.kunci.split(/\s*[;|]\s*/) : [cur.kunci.trim()]) : [];
      while (kt.length < n) kt.push("");
      s = { ..._ujeDasar(), t: cur.t.trim(), g, stimulus: stim, kt: kt.slice(0, n) };
    } else s = { ..._ujeDasar(), t: cur.t.trim(), g, stimulus: stim, kunci: (cur.kunci || "").trim(), poin_kunci: [], rek: false };
    if (!_ujeAdaKunci(jenis, s)) hasil.tanpaKunci++;
    hasil[jenis].push(s); cur = null;
  };
  let judulBagian = "", lewatiPetunjuk = false, pernahLewati = false;
  for (const raw of baris) {
    let l = _ujeNormalArab(raw.replace(/\s+$/, ""));
    // gambar dari berkas: tempel ke soal/pilihan yang sedang dibaca
    const gbr = [...l.matchAll(RE_GBR)].map((m) => `[[GAMBAR:${m[1]}]]`);
    let gbrSebaris = null; // gambar sebaris dengan teks: ditempel setelah baris ini dibaca
    if (gbr.length) {
      hasil.gambar += gbr.length;
      l = l.replace(RE_GBR, " ").replace(/\s+$/, "");
      if (!l.trim()) {
        gbr.forEach((tok) => {
          if (cur && cur.o.length && !cur.o[cur.o.length - 1].g) cur.o[cur.o.length - 1].g = tok;
          else if (cur && !cur.o.length && !cur.g) cur.g = tok;
          else if (!cur) gambarTunda = gambarTunda || tok;
        });
        continue;
      }
      gbrSebaris = gbr;
    }
    if (!l.trim() || /^\s*(pilihlah|jawablah|kerjakan|setiap soal|bernilai|=== halaman)/i.test(l)) continue;
    // blok petunjuk pengerjaan ("Petunjuk:", "Langkah Pengerjaan", "Tata tertib") bukan soal → dilewati sampai judul bagian
    if (!tanpaLewati && l.trim().length < 50 && /^\s*(?:[A-H]\s*[.)]\s*)?(petunjuk|langkah(\s+-?\s*langkah)?(\s+pengerjaan)?|tata\s+tertib|perhatian|identitas)\b/i.test(l) && !RE_NO.test(l)) { tutup(); lewatiPetunjuk = pernahLewati = true; continue; }
    const jdl = l.trim().length < 70 && l.match(RE_JUDUL);
    if (lewatiPetunjuk && !(jdl && !RE_NO.test(l))) continue;
    if (jdl && !RE_NO.test(l)) {
      lewatiPetunjuk = false;
      tutup();
      const x = jdl[2].toLowerCase();
      bagian = /kompleks/.test(x) ? "pgk" : /pilihan/.test(x) ? "pg" : /isian|isilah|lengkap/.test(x) ? "isian" : /jodoh|pasang/.test(x) ? "jodoh" : /urut|susun/.test(x) ? "urut" : "uraian";
      judulBagian = /jodoh|pasang/.test(x) && l.trim().length > 25 ? l.trim().replace(/^\s*(?:[A-H]|[IVX]{1,4})\s*[.)]\s*/, "") : "";
      jodohKini = null; bacaan = []; continue;
    }
    const kn = l.match(RE_KUNCI);
    if (kn && cur) { cur.kunci = kn[4]; continue; }
    const no = l.match(RE_NO);
    if (no) {
      tutup();
      const panjang = bacaan.join("\n").trim();
      cur = { t: no[2], o: [], kunci: null, stimulus: panjang.length > 60 ? panjang : "", g: gambarTunda, judulBagian };
      gambarTunda = ""; bacaan = [];
      if (gbrSebaris) gbrSebaris.forEach((tok) => { if (!cur.g) cur.g = tok; });
      continue;
    }
    if (cur) {
      if (_ujeAmbilOpsi(cur, l, RE_OPSI)) { if (gbrSebaris) cur.o[cur.o.length - 1].g = gbrSebaris[0]; continue; }
      // kalimat pembuka bacaan ("Teks berikut…", "Bacalah…") = soal sebelumnya selesai, mulai teks bacaan baru
      if (cur.kunci != null || (cur.o.length && /^\s*(teks|bacalah|perhatikan|cermatilah|cermati|bacaan|wacana|paragraf)\b/i.test(l))) { tutup(); bacaan.push(l.trim()); continue; }
      if (cur.o.length) cur.o[cur.o.length - 1].teks += " " + l.trim(); else cur.t += "\n" + l.trim();
      if (gbrSebaris && !cur.g) cur.g = gbrSebaris[0];
    } else bacaan.push(l.trim());
  }
  tutup();
  // petunjuk tidak diikuti judul bagian sehingga semua terlewati → baca ulang tanpa melewati
  if (pernahLewati && !UJE_JENIS.some((j) => hasil[j].length)) return _ujeUraiTeks(teks, true);
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
// Acak tetap (benih sama → urutan sama) supaya soal yang tidak diubah tidak berganti urutan saat disimpan ulang
function _ujeAcakIndeks(n, benih) {
  let seed = [...String(benih)].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
  const r = () => ((seed = (seed * 1103515245 + 12345) >>> 0) / 4294967296);
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  if (n > 1 && a.every((v, i) => v === i)) a.push(a.shift()); // jangan sampai sama dengan urutan benar
  return a;
}
function _ujeKeBank() {
  const m = UJE.m, bagian = [], galat = [];
  UJE_JENIS.forEach((j) => {
    const bg = m.bagian[j];
    const soal = bg.soal.filter((s) => (s.t || "").trim() || s.g || s.au || ((j === "jodoh" || j === "urut") && (s.o || []).some((o) => String(o).trim())));
    if (!soal.length) return;
    const out = soal.map((s, i) => {
      const no = i + 1, L = `${UJE_LABEL[j]} no ${no}`;
      const t = String(s.t || "").trim() || UJE_TEKS_BAWAAN[j] || "";
      const media = { ...(s.g ? { g: s.g } : {}), ...(s.au ? { au: s.au } : {}), ...(s.stimulus ? { stimulus: s.stimulus } : {}) };
      const pj = s.penjelasan ? { penjelasan: s.penjelasan.trim() } : {};
      if (j === "uraian") {
        if (!String(s.kunci || "").trim()) galat.push(`${L}: kunci kosong`);
        return { no, t, ...media, ...(s.rek ? { rek: true } : {}), kunci: (s.kunci || "").trim(), poin_kunci: s.poin_kunci || [], ...pj };
      }
      if (j === "isian") {
        const n = _ujeJumlahTitik(s.t);
        const k = Array.from({ length: n }, (_, x) => String((s.kt || [])[x] || "").split("/").map((v) => v.trim()).filter(Boolean));
        if (k.some((a) => !a.length)) galat.push(`${L}: jawaban titik kosong belum diisi`);
        return { no, t, n, ...media, k, ...pj };
      }
      if (j === "jodoh") {
        const pas = (s.o || []).map((o, x) => [String(o).trim(), String((s.p || [])[x] || "").trim()]).filter(([a, b]) => a && b);
        if (pas.length < 2) galat.push(`${L}: minimal 2 pasangan`);
        const kanan = pas.map((x) => x[1]).concat((s.px || []).map((x) => String(x).trim()).filter(Boolean));
        const acak = _ujeAcakIndeks(kanan.length, (m.kode || m.judul) + "|j" + no + "|" + kanan.join("|"));
        const p = acak.map((x) => kanan[x]);
        return { no, t, ...media, o: pas.map((x) => x[0]), p, k: pas.map((_, x) => acak.indexOf(x)), ...pj };
      }
      if (j === "urut") {
        const isi = (s.o || []).map((x) => String(x).trim()).filter(Boolean);
        if (isi.length < 2) galat.push(`${L}: minimal 2 bagian`);
        const acak = _ujeAcakIndeks(isi.length, (m.kode || m.judul) + "|u" + no + "|" + isi.join("|"));
        return { no, t, ...media, o: acak.map((x) => isi[x]), k: isi.map((_, x) => acak.indexOf(x)), ...pj };
      }
      // buang pilihan kosong (tanpa teks & tanpa gambar) & sesuaikan nomor kunci
      const peta = [], o = [], og = [];
      (s.o || []).forEach((tx, k) => { const g = (s.og || [])[k] || ""; if (String(tx).trim() || g) { peta[k] = o.length; o.push(String(tx).trim()); og.push(g); } });
      if (s.bs) {
        const k = (s.o || []).map((tx, x) => (String(tx).trim() ? !!s.k[x] : null)).filter((v) => v !== null);
        if (o.length < 2) galat.push(`${L}: minimal 2 pernyataan`);
        return { no, t, ...media, o, k, bs: s.bs, ...pj };
      }
      let k = [].concat(s.k ?? []).map((x) => peta[x]).filter((x) => x !== undefined);
      if (o.length < 2) galat.push(`${L}: minimal 2 pilihan`);
      if (!k.length) galat.push(`${L}: belum ada kunci`);
      return { no, t, ...media, o, ...(og.some(Boolean) ? { og } : {}), k: j === "pg" ? (k.length > 1 ? k : k[0]) : k, ...pj };
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
  if (bank.bagian.some((b) => UJE_JENIS_BARU.includes(b.jenis)) && typeof _ujVersi === "function" && (await _ujVersi()) < 4) {
    const lanjut = await konfirmasiTema("Bank soal ini memakai jenis soal baru (Isian / Menjodohkan / Mengurutkan). Penilaian otomatisnya butuh admin menjalankan SQL_UJIAN_SANTRI_4.sql di Supabase.\n\nSimpan sekarang? (Soal tersimpan aman; nilainya baru benar setelah SQL dijalankan.)", { ikon: "⚠️", judul: "Butuh pembaruan database", teksYa: "Simpan saja", teksTidak: "Batal" });
    if (!lanjut) { _ujeGambar(); return; }
  }
  if (!m.kode) {
    const slug = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 24);
    m.kode = `${slug(_ujNamaMapel(m.mapel_id))}-${slug(m.tingkat) || "x"}-bab${m.bab}-${Date.now().toString(36).slice(-4)}`;
  }
  try {
    const pin = await _ujPin("PIN untuk menyimpan soal"); if (!pin) return;
    const { publik, kunci } = _ujPisahKunci(bank);
    m.bankId = await _ujRpc("ujian_bank_simpan", { p_pin: pin, p_kode: m.kode, p_mapel_id: m.mapel_id, p_tingkat: m.tingkat, p_bab: m.bab, p_judul: bank.judul, p_soal: publik, p_kunci: kunci, p_skor_maksimal: bank.skor_maksimal, p_guru: STATE.guruId || null });
    if (typeof _ujSimpanJenis === "function") await _ujSimpanJenis(m.bankId, m.jenisNilai || "uh", m.jenisKe || m.bab, { mapel_id: m.mapel_id, tingkat: m.tingkat, guru_id: STATE.guruId || null });
    toast("💾 Bank soal tersimpan", "ok"); closeModal();
    if (typeof ujMuat === "function" && qs("ujian-root")) ujMuat();
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

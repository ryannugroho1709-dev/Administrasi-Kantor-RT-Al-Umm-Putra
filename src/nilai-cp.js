// ============================================================
//  INPUT NILAI — CP OTOMATIS 3 KATEGORI · HAK AKSES PER JADWAL · CEK SEMESTER
//  1) CP per kelas × mapel (× bagian mapel gabungan) × semester, 3 kategori menurut nilai akhir:
//     Sangat Baik / Baik / Cukup. Usulan disusun dari MATERI JURNAL MENGAJAR semester itu (tema yang benar-benar
//     diajarkan), jadi tiap kelas & semester berbeda. Guru boleh mengubah teksnya (CP Otomatis) atau mengganti
//     CP satu santri. Hukum asalnya otomatis: CP santri yang kosong / masih teks otomatis ikut berubah sesuai nilai.
//     Data: kuliah_pengaturan "cp:nilai:<tahun>:<semester>" (per ruang) → { "<kelasId>|<mapelId>|<bagian>": {sb,b,c,batas,riwayat} }
//  2) Hak akses: guru hanya mapel & kelas di jadwalnya; Admin utama semua; Kepala Sekolah/Penyelenggara &
//     wali kelas boleh MELIHAT (tidak bisa mengubah). Admin Kedua ikut Mode Lihat.
//  3) Nilai yang tersimpan di semester lain padahal diisi di semester ini → pita peringatan + pindahkan.
// ============================================================
const NC = { tpl: null, kunci: null, draf: false, tema: [], jadwal: {}, hak: "ubah" };
const NC_KAT = {
  sb: { label: "Sangat Baik", ikon: "🌟", warna: "#059669", latar: "#ecfdf5" },
  b: { label: "Baik", ikon: "👍", warna: "#2563eb", latar: "#eff6ff" },
  c: { label: "Cukup", ikon: "🌱", warna: "#d97706", latar: "#fffbeb" },
};
const _ncE = (s) => (typeof escapeHtml === "function" ? escapeHtml(s) : String(s ?? ""));
const _ncKv = (sem, ta) => `cp:nilai:${ta}:${sem}`;
const _ncSub = () => (NILAI_STATE.sub && NILAI_STATE.sub !== "rekap" ? NILAI_STATE.sub : "");

// ── Hak akses ──
const _ncKepsek = () => (typeof isKepsek === "function" && isKepsek()) || (typeof isAdminKedua === "function" && isAdminKedua());
const _ncWaliKelas = () => ((LOOKUP.guruAll || []).find((g) => g.id === STATE.guruId) || {}).wali_kelas_id || null;
async function _ncJadwalGuru(guruId) {
  if (!guruId) return [];
  if (NC.jadwal[guruId]) return NC.jadwal[guruId];
  try { const r = await supa.from("jadwal_pelajaran").select("mapel_id,kelas_id").eq("guru_id", guruId).eq("aktif", true); return (NC.jadwal[guruId] = r.data || []); }
  catch (e) { return []; }
}
async function _ncHak(mapelId, kelasId) {
  if (isAdmin()) return "ubah";
  const saya = await _ncJadwalGuru(STATE.guruId);
  if (saya.some((j) => j.mapel_id === mapelId && j.kelas_id === kelasId)) return "ubah";
  const m = (LOOKUP.mapel || []).find((x) => x.id === mapelId);
  if (m?.tanpa_guru && _ncWaliKelas() === kelasId) return "ubah";
  if (_ncKepsek() || _ncWaliKelas() === kelasId) return "lihat";
  return "tidak";
}

// Pilihan guru / mapel / kelas: selain Admin utama hanya dari JADWAL
(function () {
  const asliInit = renderInputNilaiInit, asliGuru = onGantiGuruNilai, asliMapel = onGantiMapelNilai;
  renderInputNilaiInit = async function () {
    if (isAdmin()) return asliInit.apply(this, arguments);
    await ensureLookups();
    const sel = qs("nl-guru"), wali = _ncWaliKelas();
    let daftar = [];
    if (_ncKepsek()) daftar = (LOOKUP.guruAll || []).slice();
    else if (wali) {
      const r = await supa.from("jadwal_pelajaran").select("guru_id").eq("kelas_id", wali).eq("aktif", true).then((x) => x.data || []).catch(() => []);
      const ids = new Set([STATE.guruId, ...r.map((x) => x.guru_id)]);
      daftar = (LOOKUP.guruAll || []).filter((g) => ids.has(g.id));
    } else daftar = (LOOKUP.guruAll || []).filter((g) => g.id === STATE.guruId);
    daftar.sort((a, b) => (a.id === STATE.guruId ? -1 : b.id === STATE.guruId ? 1 : a.nama.localeCompare(b.nama, "id")));
    sel.innerHTML = daftar.map((g) => `<option value="${g.id}">${_ncE(g.nama)}${g.id === STATE.guruId ? " (Saya)" : ""}</option>`).join("") || `<option value="">-</option>`;
    sel.disabled = daftar.length <= 1; sel.value = STATE.guruId || "";
    if (typeof _rwkAturDefaultSemester === "function") _rwkAturDefaultSemester("nl");
    await onGantiGuruNilai();
  };
  onGantiGuruNilai = async function () {
    if (isAdmin()) return asliGuru.apply(this, arguments);
    const guruId = qs("nl-guru").value;
    let j = await _ncJadwalGuru(guruId);
    if (guruId !== STATE.guruId && !_ncKepsek()) j = j.filter((x) => x.kelas_id === _ncWaliKelas());
    const ids = [...new Set(j.map((x) => x.mapel_id))];
    const mapel = (LOOKUP.mapel || []).filter((m) => ids.includes(m.id)).sort((a, b) => a.nama_mapel.localeCompare(b.nama_mapel, "id"));
    const el = qs("nl-mapel"), lama = el.value;
    el.innerHTML = mapel.length ? mapel.map((m) => `<option value="${m.id}">${_ncE(m.nama_mapel)}</option>`).join("") : `<option value="">Belum ada mapel di jadwal</option>`;
    if (mapel.some((m) => m.id === lama)) el.value = lama;
    await onGantiMapelNilai();
  };
  onGantiMapelNilai = async function () {
    if (isAdmin()) return asliMapel.apply(this, arguments);
    const guruId = qs("nl-guru").value, mapelId = qs("nl-mapel").value;
    let j = (await _ncJadwalGuru(guruId)).filter((x) => x.mapel_id === mapelId);
    if (guruId !== STATE.guruId && !_ncKepsek()) j = j.filter((x) => x.kelas_id === _ncWaliKelas());
    const ids = [...new Set(j.map((x) => x.kelas_id))];
    const kelas = (LOOKUP.kelas || []).filter((k) => ids.includes(k.id));
    const el = qs("nl-kelas"), lama = el.value;
    el.innerHTML = kelas.length ? kelas.map((k) => `<option value="${k.id}">${_ncE(k.nama_kelas)}</option>`).join("") : `<option value="">-</option>`;
    if (kelas.some((k) => k.id === lama)) el.value = lama;
    renderInputNilai();
  };
})();

// ── Tema dari jurnal mengajar semester ini ──
const _NC_BISING = /tata tertib|perkenalan|bincang|nasi[h]?at|organisasi kelas|penyampaian target|kontrak belajar|^review|pengulangan|libur|\bujian\b|^\(?hal\b|ulangan harian|^ulang[a]?n\b|evaluasi|sumatif|remedial|^kosong|^-+$|pembahasan soal|^latihan soal$|^muraja'?ah$|tugas mandiri|^absen|^tidak ada|^izin/i;
async function _ncTema(kelasId, mapelId, sem, ta, sub) {
  const { dari, sampai } = _rentangSemesterTahunAjaran(sem, ta);
  let rows = [];
  try { const r = await supa.from("jurnal_kelas").select("tanggal,materi_pokok").eq("kelas_id", kelasId).eq("mapel_id", mapelId).gte("tanggal", dari).lte("tanggal", sampai).order("tanggal"); rows = r.data || []; } catch (e) {}
  let teks = rows.map((r) => String(r.materi_pokok || "").replace(/\s+/g, " ").trim()).filter(Boolean);
  if (sub) { const s = sub.toLowerCase(), cocok = teks.filter((t) => t.toLowerCase().includes(s)); if (cocok.length) teks = cocok.map((t) => t.replace(new RegExp("^\\s*" + sub + "\\s*[:\\-–]\\s*", "i"), "")); }
  const lihat = new Map();
  teks.forEach((t) => t.split(/\s*;\s*|\n/).forEach((x) => {
    let b = x.replace(/^[\d.\-)\s]+/, "").replace(/[.\s]+$/, "").trim();
    if (_NC_BISING.test(b)) return;
    // buang awalan penanda pertemuan: "Dars 6 : Al-Ma'un" → "Al-Ma'un", "Bab 2 - Fungsi" → "Fungsi"
    const inti = b.replace(/^(darsul\s+\w+|dars(\s+ke)?\s+[\w-]+|bab\s+[\w-]+|pertemuan(\s+ke)?\s+[\w-]+|pertemuan\s+terakhir|materi|lanjutan|melanjutkan)\s*[:\-–.]?\s*/i, "").trim();
    const huruf = (s) => /[a-z؀-ۿ]{3}/i.test(s.replace(/\b(dars|bab|pertemuan)\b/gi, ""));
    if (inti.length >= 4 && huruf(inti)) b = inti;
    if (b.length < 4 || _NC_BISING.test(b) || !huruf(b)) return;
    const k = b.toLowerCase().replace(/^(surah|surat)\s+/, "").replace(/[^a-z0-9؀-ۿ]/g, "");
    if (!lihat.has(k)) lihat.set(k, { t: b, n: 0 }); lihat.get(k).n++;
  }));
  return [...lihat.values()].map((x) => x.t);
}
const _ncDaftar = (a) => (a.length <= 1 ? a[0] || "" : a.slice(0, -1).join(", ") + ", dan " + a[a.length - 1]);
function _ncSusun(tema) {
  let t = tema.slice();
  if (t.length > 5) { const step = (t.length - 1) / 4; t = [0, 1, 2, 3, 4].map((i) => tema[Math.round(i * step)]); }
  if (!t.length) return { sb: "", b: "", c: "" };
  const kecil = (s) => (/^[A-Z][a-z]/.test(s) && !/^(Al|Bab|Dars|Surah|Surat|Pancasila|Indonesia)/.test(s) ? s[0].toLowerCase() + s.slice(1) : s);
  t = t.map(kecil);
  const separo = Math.ceil(t.length / 2);
  return {
    sb: `Menunjukkan penguasaan yang sangat baik dalam memahami ${_ncDaftar(t)}, serta mampu menjelaskan dan menerapkannya dengan tepat.`,
    b: t.length > 1 ? `Menunjukkan penguasaan yang baik dalam memahami ${_ncDaftar(t.slice(0, -1))}; perlu meningkatkan pemahaman pada ${t[t.length - 1]}.` : `Menunjukkan penguasaan yang baik dalam memahami ${t[0]}; perlu lebih banyak berlatih agar semakin mahir.`,
    c: t.length > 1 ? `Cukup memahami ${_ncDaftar(t.slice(0, separo))}; perlu bimbingan lebih lanjut dalam ${_ncDaftar(t.slice(separo))}.` : `Cukup memahami ${t[0]}; perlu bimbingan lebih lanjut agar dapat menguasainya dengan baik.`,
  };
}

// ── Templat CP konteks yang sedang dibuka ──
async function _ncMuatTpl() {
  const kelasId = qs("nl-kelas").value, mapelId = qs("nl-mapel").value, sem = qs("nl-semester").value, ta = qs("nl-tahun").value, sub = _ncSub();
  const kunci = `${kelasId}|${mapelId}|${sub}`, kv = _ncKv(sem, ta);
  if (NC.kunci === kv + "#" + kunci && NC.tpl) return NC.tpl;
  const semua = (await _kvAmbil(kv, {}).catch(() => ({}))) || {};
  NC.kunci = kv + "#" + kunci; NC.tema = await _ncTema(kelasId, mapelId, sem, ta, sub);
  const ada = semua[kunci];
  if (ada && (ada.sb || ada.b || ada.c)) { NC.tpl = { batas: [90, 80], riwayat: [], ...ada }; NC.draf = false; }
  else { NC.tpl = { ..._ncSusun(NC.tema), batas: [90, 80], riwayat: [] }; NC.draf = true; }
  return NC.tpl;
}
const _ncKat = (n) => { const b = NC.tpl?.batas || [90, 80]; return !(n > 0) ? null : n >= b[0] ? "sb" : n >= b[1] ? "b" : "c"; };
const _ncTeksOtomatis = () => new Set([NC.tpl?.sb, NC.tpl?.b, NC.tpl?.c, ...(NC.tpl?.riwayat || [])].filter(Boolean).map((s) => s.trim()));
function _ncTerapkanBaris(tr) {
  if (!NC.tpl || tr.dataset.cpAuto !== "1") return false;
  const ta = tr.querySelector(".nilai-cp"); if (!ta) return false;
  const k = _ncKat(Number(tr.dataset.akhir)), baru = k ? NC.tpl[k] || "" : "";
  if (!baru || ta.value === baru) return false;
  ta.value = baru; return true;
}

// Setelah tabel digambar: hak akses, CP otomatis, cek semester
(function () {
  const asliGambar = gambarTabelNilai, asliHitung = _hitungUlangBarisNilai;
  _hitungUlangBarisNilai = function (tr) {
    const r = asliHitung.apply(this, arguments);
    if (tr && _ncTerapkanBaris(tr)) _perbaruiTombolCP(tr); else if (tr) _perbaruiTombolCP(tr);
    return r;
  };
  gambarTabelNilai = async function () {
    const r = await asliGambar.apply(this, arguments);
    try { await _ncSetelahGambar(); } catch (e) { console.warn("CP otomatis:", e); }
    return r;
  };
})();
async function _ncSetelahGambar() {
  const mapelId = qs("nl-mapel").value, kelasId = qs("nl-kelas").value, target = qs("input-nilai-table");
  if (!mapelId || !kelasId || !target) return;
  NC.hak = await _ncHak(mapelId, kelasId);
  if (NC.hak === "tidak") { target.innerHTML = `<div class="card empty-state">🔒 Mapel ini bukan jadwal Antum. Nilai hanya bisa diisi guru pengampunya.</div>`; return; }
  _ncPitaSemester();
  if (NILAI_STATE.sub === "rekap") return;
  await _ncMuatTpl();
  const otomatis = _ncTeksOtomatis(); let diisi = 0;
  qsa("#input-nilai-table tbody tr").forEach((tr) => {
    const isi = (tr.querySelector(".nilai-cp")?.value || "").trim();
    tr.dataset.cpAuto = !isi || otomatis.has(isi) ? "1" : "0";
    if (_ncTerapkanBaris(tr)) diisi++;
    _perbaruiTombolCP(tr);
  });
  // tombol CP Otomatis di bilah alat
  const alat = target.querySelector(".nl2-alat");
  if (alat && !alat.querySelector(".nc-tombol")) alat.insertAdjacentHTML("afterbegin", `<button class="nl2-btn nc-tombol" onclick="bukaCPOtomatis()"><span>🎯</span>CP Otomatis</button>`);
  if (NC.hak === "lihat") _ncModeLihat(target);
  else if (diisi) { _tandaiNilaiBelumDisimpan(); toast(`🎯 CP otomatis terisi untuk ${diisi} santri sesuai nilainya — tekan 💾 Simpan`, "info"); }
}
function _ncModeLihat(target) {
  target.querySelectorAll(".nl-in").forEach((i) => { i.disabled = true; });
  target.querySelectorAll(".nl2-alat > button:not(.nc-tombol):not(.tur-tanya), .nl2-alat label, .nl2-menu, .nl2-tombol-simpan, .nl2-lama button").forEach((el) => (el.style.display = "none"));
  if (!target.querySelector(".nc-lihat")) target.insertAdjacentHTML("afterbegin", `<div class="nc-lihat">👁️ <b>Mode Lihat</b> — Antum bisa melihat nilai kelas ini, tetapi hanya guru pengampu (dan Admin) yang bisa mengubahnya.</div>`);
}

// ── Tombol CP di tiap baris: kategori + otomatis/diubah ──
_perbaruiTombolCP = function (tr) {
  const isi = (tr.querySelector(".nilai-cp")?.value || "").trim(), btn = tr.querySelector(".nl-cp-btn"); if (!btn) return;
  const k = _ncKat(Number(tr.dataset.akhir)), auto = tr.dataset.cpAuto === "1";
  const kat = k && auto && NC.tpl?.[k] ? NC_KAT[k] : null;
  btn.innerHTML = !isi ? "＋ Isi" : kat ? `<i style="--w:${kat.warna}">${kat.ikon} ${kat.label}</i>` : `<i style="--w:#7c3aed">✏️ Diubah</i>`;
  btn.classList.toggle("nl-cp-ada", !!isi);
  btn.title = isi || "Capaian Pembelajaran belum diisi";
};

// ── Editor CP satu santri ──
bukaEditorCP = function (siswaId) {
  const tr = document.querySelector(`#input-nilai-table tr[data-siswa="${siswaId}"]`); if (!tr) return;
  const nama = tr.querySelector(".nl-col-nama")?.textContent.replace(/^\d+/, "").replace(/^\d+/, "").trim() || "";
  const isi = tr.querySelector(".nilai-cp").value, n = Number(tr.dataset.akhir), k = _ncKat(n), lihat = NC.hak === "lihat";
  const kartu = Object.entries(NC_KAT).map(([kk, v]) => `<button type="button" class="nc-pil ${kk === k ? "saran" : ""}" style="--w:${v.warna};--l:${v.latar}" ${lihat || !NC.tpl?.[kk] ? "disabled" : ""} onclick="qs('cp-editor').value=NC.tpl['${kk}'];qs('cp-editor').dataset.auto='${kk === k ? 1 : 0}'">
      <b>${v.ikon} ${v.label}${kk === k ? " <em>sesuai nilai</em>" : ""}</b><span>${_ncE(NC.tpl?.[kk] || "Belum ada teks — atur di 🎯 CP Otomatis")}</span></button>`).join("");
  openModal(`<div class="nc-ed">
    <div class="nc-ed-kepala"><div><h3>📝 Capaian Pembelajaran</h3><small>${_ncE(nama)}</small></div>
      <div class="nc-ed-nilai">${n > 0 ? `<b>${n}</b><span>${k ? NC_KAT[k].label : ""}</span>` : `<b>-</b><span>belum ada nilai</span>`}</div></div>
    <div class="nc-pil-grid">${kartu}</div>
    <label class="form-label" style="margin-top:10px">Teks CP santri ini <small>(boleh diubah sendiri)</small></label>
    <textarea id="cp-editor" class="input" rows="4" ${lihat ? "readonly" : ""} oninput="this.dataset.auto='0'" placeholder="Tulis capaian pembelajaran santri ini">${_ncE(isi)}</textarea>
    ${lihat ? "" : `<div class="nc-ed-aksi">
      <button class="btn btn-outline" onclick="_ncKembaliOtomatis('${siswaId}')">↺ Kembali Otomatis</button>
      <button class="btn btn-accent" onclick="_ncSimpanSatu('${siswaId}')">✓ Selesai</button></div>
    <div class="nc-ket">Teks yang diubah sendiri tidak ikut berubah otomatis. Tekan 💾 Simpan di atas tabel setelah selesai.</div>`}
  </div>`);
};
function _ncSimpanSatu(siswaId) {
  const tr = document.querySelector(`#input-nilai-table tr[data-siswa="${siswaId}"]`), ed = qs("cp-editor");
  if (tr && ed) {
    const v = ed.value.trim(); tr.querySelector(".nilai-cp").value = v;
    tr.dataset.cpAuto = !v || ed.dataset.auto === "1" || (_ncTeksOtomatis().has(v) && NC.tpl[_ncKat(Number(tr.dataset.akhir))] === v) ? "1" : "0";
    _perbaruiTombolCP(tr); _tandaiNilaiBelumDisimpan();
  }
  closeModal();
}
function _ncKembaliOtomatis(siswaId) {
  const tr = document.querySelector(`#input-nilai-table tr[data-siswa="${siswaId}"]`); if (!tr) return;
  tr.dataset.cpAuto = "1"; tr.querySelector(".nilai-cp").value = ""; _ncTerapkanBaris(tr); _perbaruiTombolCP(tr); _tandaiNilaiBelumDisimpan(); closeModal();
}

// ── 🎯 CP Otomatis: atur 3 teks kategori untuk kelas × mapel × semester ini ──
async function bukaCPOtomatis() {
  await _ncMuatTpl();
  const m = (LOOKUP.mapel || []).find((x) => x.id === qs("nl-mapel").value), kl = (LOOKUP.kelas || []).find((x) => x.id === qs("nl-kelas").value);
  const sub = _ncSub(), lihat = NC.hak === "lihat", T = NC.tpl, b = T.batas || [90, 80];
  const jumlah = { sb: 0, b: 0, c: 0 }; qsa("#input-nilai-table tbody tr").forEach((tr) => { const k = _ncKat(Number(tr.dataset.akhir)); if (k) jumlah[k]++; });
  const rentang = { sb: `≥ ${b[0]}`, b: `${b[1]} – ${b[0] - 0.1}`, c: `< ${b[1]}` };
  const kartu = Object.entries(NC_KAT).map(([k, v]) => `<div class="nc-kartu" style="--w:${v.warna};--l:${v.latar}">
      <div class="nc-kartu-h"><span class="nc-ikon">${v.ikon}</span><div><b>${v.label}</b><small>Nilai ${rentang[k]} · ${jumlah[k]} santri</small></div></div>
      <textarea id="nc-${k}" class="input" rows="4" ${lihat ? "readonly" : ""} placeholder="${NC.tema.length ? "" : "Belum ada materi jurnal semester ini — tulis sendiri"}">${_ncE(T[k] || "")}</textarea></div>`).join("");
  openModal(`<div class="nc">
    <div class="nc-hero"><div><span class="nc-pil-kecil">🎯 CP Otomatis</span><h3>${_ncE(sub || m?.nama_mapel || "")}${sub ? `<small> bagian ${_ncE(m?.nama_mapel || "")}</small>` : ""}</h3>
      <p>${_ncE(kl?.nama_kelas || "")} · ${_ncE(qs("nl-semester").value)} ${_ncE(qs("nl-tahun").value)} · ${NC.draf ? "usulan otomatis (belum disimpan)" : "tersimpan"}</p></div></div>
    <div class="nc-tema"><b>📚 Materi dari jurnal semester ini</b>${NC.tema.length ? `<div class="nc-chip-baris">${NC.tema.slice(0, 24).map((t) => `<span class="nc-chip">${_ncE(t)}</span>`).join("")}${NC.tema.length > 24 ? `<span class="nc-chip">+${NC.tema.length - 24} lagi</span>` : ""}</div>` : `<div class="nc-kosong">Belum ada jurnal mengajar mapel ini di kelas ini pada semester ini. CP tidak dikarang — isi sendiri, atau isi jurnal dulu lalu tekan Susun Ulang.</div>`}</div>
    <div class="nc-batas">Batas kategori: Sangat Baik ≥ <input id="nc-b0" type="number" class="input" value="${b[0]}" ${lihat ? "disabled" : ""}> · Baik ≥ <input id="nc-b1" type="number" class="input" value="${b[1]}" ${lihat ? "disabled" : ""}> · di bawahnya Cukup</div>
    <div class="nc-grid">${kartu}</div>
    ${lihat ? `<div class="nc-ket">👁️ Mode Lihat — hanya guru pengampu yang bisa mengubah.</div>` : `<div class="nc-aksi">
      <button class="btn btn-outline" onclick="_ncSusunUlang()">✨ Susun Ulang dari Jurnal</button>
      <button class="btn btn-accent" onclick="_ncSimpanTpl()">💾 Simpan & Terapkan ke Santri</button></div>
    <div class="nc-ket">Diterapkan ke santri yang CP-nya masih otomatis/kosong. CP yang sudah diubah sendiri oleh guru tidak disentuh.</div>`}
  </div>`, { lebar: true });
}
function _ncSusunUlang() {
  const s = _ncSusun(NC.tema);
  if (!NC.tema.length) { toast("Belum ada materi jurnal semester ini untuk disusun", "err"); return; }
  ["sb", "b", "c"].forEach((k) => { qs("nc-" + k).value = s[k]; });
  toast("✨ Disusun ulang dari materi jurnal — periksa lalu Simpan", "info");
}
async function _ncSimpanTpl() {
  const isi = { sb: qs("nc-sb").value.trim(), b: qs("nc-b").value.trim(), c: qs("nc-c").value.trim() };
  const b0 = Number(qs("nc-b0").value) || 90, b1 = Number(qs("nc-b1").value) || 80;
  if (b1 >= b0) { toast("Batas Baik harus lebih kecil dari Sangat Baik", "err"); return; }
  const lama = NC.tpl || {}, riwayat = [...new Set([...(lama.riwayat || []), lama.sb, lama.b, lama.c].filter((x) => x && !Object.values(isi).includes(x)))].slice(-15);
  const [kv, kunci] = NC.kunci.split("#");
  try {
    setGlobalLoading(true, "Menyimpan CP…");
    await _kvGabung(kv, { [kunci]: { ...isi, batas: [b0, b1], riwayat, oleh: STATE.guruNama || "", t: Date.now() } });
    NC.tpl = { ...isi, batas: [b0, b1], riwayat }; NC.draf = false;
    let n = 0; qsa("#input-nilai-table tbody tr").forEach((tr) => { const v = (tr.querySelector(".nilai-cp")?.value || "").trim(); if (!v || riwayat.includes(v) || Object.values(isi).includes(v)) tr.dataset.cpAuto = "1"; if (_ncTerapkanBaris(tr)) n++; _perbaruiTombolCP(tr); });
    closeModal(); if (n) _tandaiNilaiBelumDisimpan();
    toast(`🎯 CP tersimpan${n ? ` · ${n} santri diperbarui — tekan 💾 Simpan nilai` : ""}`, "ok");
  } catch (e) { toast("Gagal menyimpan CP: " + (e.message || e), "err"); }
  finally { setGlobalLoading(false); }
}

// ── Nilai tersimpan di semester lain padahal diisi di semester ini ──
async function _ncPitaSemester() {
  const kelasId = qs("nl-kelas").value, mapelId = qs("nl-mapel").value, sem = qs("nl-semester").value, ta = qs("nl-tahun").value;
  const target = qs("input-nilai-table"); if (!target) return;
  const token = (NC.pitaToken = (NC.pitaToken || 0) + 1);
  const ids = new Set((NILAI_STATE.asli || []).map((r) => r.siswa.id));
  let r = [];
  try { r = (await supa.from("nilai_rapor").select("id,siswa_id,semester,tahun_ajaran,updated_at").eq("kelas_id", kelasId).eq("mapel_id", mapelId)).data || []; } catch (e) { return; }
  const lain = r.filter((x) => (x.semester !== sem || x.tahun_ajaran !== ta) && ids.has(x.siswa_id));
  // hanya yang DISIMPAN saat semester lain itu sudah lewat (salah pilih semester), bukan nilai semester lalu yang sah
  const salah = lain.filter((x) => { if (!x.updated_at) return false; const { sampai } = _rentangSemesterTahunAjaran(x.semester, x.tahun_ajaran); const batas = new Date(new Date(sampai + "T00:00:00").getTime() + 30 * 86400000).toISOString(); return x.updated_at > batas; });
  if (token !== NC.pitaToken) return; // sudah ada gambar ulang yang lebih baru
  qs("input-nilai-table")?.querySelectorAll(".nc-pita-sem").forEach((x) => x.remove());
  if (!salah.length || qs("nl-kelas").value !== kelasId) return;
  const grup = {}; salah.forEach((x) => { const k = x.semester + " " + x.tahun_ajaran; (grup[k] = grup[k] || []).push(x); });
  const html = Object.entries(grup).map(([k, a]) => { const [s, t] = k.split(" "), tgl = a.map((x) => x.updated_at).sort().pop();
    return `<div class="nc-pita-sem">📅 <div><b>${a.length} nilai mapel ini tersimpan di ${_ncE(k)}</b>, padahal disimpan tanggal ${new Date(tgl).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })} (sudah lewat semester itu). Kemungkinan salah pilih semester saat menyimpan.
      <span><button class="btn btn-sm btn-outline" onclick="qs('nl-semester').value='${s}';qs('nl-tahun').value='${t}';renderInputNilai()">👁️ Lihat</button>${NC.hak === "ubah" ? ` <button class="btn btn-sm btn-accent" onclick="_ncPindahSemester('${s}','${t}')">📥 Pindahkan ke ${_ncE(sem)} ${_ncE(ta)}</button>` : ""}</span></div></div>`; }).join("");
  target.insertAdjacentHTML("afterbegin", html);
}
async function _ncPindahSemester(s, t) {
  const kelasId = qs("nl-kelas").value, mapelId = qs("nl-mapel").value, sem = qs("nl-semester").value, ta = qs("nl-tahun").value;
  const r = (await supa.from("nilai_rapor").select("id,siswa_id,semester,tahun_ajaran").eq("kelas_id", kelasId).eq("mapel_id", mapelId)).data || [];
  const sumber = r.filter((x) => x.semester === s && x.tahun_ajaran === t), sudah = new Set(r.filter((x) => x.semester === sem && x.tahun_ajaran === ta).map((x) => x.siswa_id));
  const pindah = sumber.filter((x) => !sudah.has(x.siswa_id)), bentrok = sumber.length - pindah.length;
  if (!pindah.length) { toast(`Semua ${bentrok} santri sudah punya nilai di ${sem} ${ta} — buka 👁️ Lihat lalu bandingkan dulu, tidak dipindah otomatis`, "info"); return; }
  if (!(await konfirmasiTema(`Pindahkan nilai <b>${pindah.length} santri</b> dari ${_ncE(s)} ${_ncE(t)} ke <b>${_ncE(sem)} ${_ncE(ta)}</b>?${bentrok ? `\n\n${bentrok} santri dilewati karena sudah punya nilai di ${_ncE(sem)} ${_ncE(ta)}.` : ""}\n\nIsi nilainya tidak berubah, hanya label semesternya.`, { ikon: "📥", judul: "Pindahkan semester", teksYa: "Pindahkan" }))) return;
  try {
    setGlobalLoading(true, "Memindahkan…"); let n = 0;
    for (const x of pindah) { const u = await supa.from("nilai_rapor").update({ semester: sem, tahun_ajaran: ta }).eq("id", x.id); if (!u.error) n++; }
    toast(`📥 ${n} nilai dipindah ke ${sem} ${ta}`, "ok"); renderInputNilai();
  } catch (e) { toast("Gagal: " + (e.message || e), "err"); }
  finally { setGlobalLoading(false); }
}

// ── Penjaga: Mode Lihat tidak bisa menyimpan; peringatan bila menyimpan ke semester yang bukan semester berjalan ──
(function () {
  const jaga = (nama) => { const asli = window[nama]; if (typeof asli !== "function") return;
    window[nama] = async function () { if (STATE.currentPage === "input-nilai" && NC.hak !== "ubah") { toast("👁️ Mode Lihat — hanya guru pengampu yang bisa mengubah nilai ini", "err"); return; } return asli.apply(this, arguments); }; };
  ["tambahKolomNilai", "nlTempelNilai", "unggahLegerNilai", "nlPindahLama", "toggleUTSNilai"].forEach(jaga);
  const asliSimpan = simpanSemuaNilai;
  simpanSemuaNilai = async function () {
    if (NC.hak !== "ubah") { toast("👁️ Mode Lihat — hanya guru pengampu yang bisa mengubah nilai ini", "err"); return; }
    const kini = typeof semesterAktifSekarang === "function" ? semesterAktifSekarang() : null, sem = qs("nl-semester").value, ta = qs("nl-tahun").value;
    if (kini && (kini.semester !== sem || kini.ta !== ta) && !(await konfirmasiTema(`Antum akan menyimpan nilai ke <b>${_ncE(sem)} ${_ncE(ta)}</b>, padahal semester berjalan sekarang <b>${_ncE(kini.semester)} ${_ncE(kini.ta)}</b>.\n\nYakin semesternya sudah benar?`, { ikon: "📅", judul: "Cek semester", teksYa: "Ya, simpan", teksTidak: "Batal" }))) return;
    return asliSimpan.apply(this, arguments);
  };
})();

(function () {
  const css = `.nc-tombol{background:linear-gradient(135deg,#0f766e,#0d9488)!important;color:#fff!important}
  .nl-cp-btn i{font-style:normal;display:inline-block;padding:3px 9px;border-radius:999px;font-size:11px;font-weight:800;color:var(--w);background:color-mix(in srgb,var(--w) 12%,transparent);white-space:nowrap}
  .nc-lihat,.nc-pita-sem{display:flex;gap:10px;align-items:flex-start;padding:10px 14px;border-radius:14px;margin:0 0 10px;font-size:12.5px;line-height:1.5}
  .nc-lihat{background:#eef2ff;color:#3730a3;border:1px solid #c7d2fe}.nc-pita-sem{background:#fff7ed;color:#9a3412;border:1px solid #fed7aa}.nc-pita-sem span{display:flex;gap:6px;flex-wrap:wrap;margin-top:6px}
  .nc-hero{border-radius:18px;padding:16px 18px;margin:-4px 0 12px;color:#fff;background:radial-gradient(120% 140% at 0% 0%,#14b8a6 0%,#0f766e 45%,#134e4a 100%);box-shadow:0 10px 30px rgba(15,118,110,.25)}
  .nc-hero h3{margin:6px 0 2px;color:#fff;font-size:20px}.nc-hero h3 small{font-size:12px;opacity:.8;font-weight:600}.nc-hero p{margin:0;font-size:12px;opacity:.85}
  .nc-pil-kecil{display:inline-block;background:rgba(255,255,255,.18);border:1px solid rgba(255,255,255,.3);border-radius:999px;padding:2px 10px;font-size:11px;font-weight:700}
  .nc-tema{background:var(--surface-2,#f1f5f9);border-radius:14px;padding:10px 12px;margin-bottom:10px;font-size:12.5px}.nc-chip-baris{display:flex;flex-wrap:wrap;gap:5px;margin-top:6px}
  .nc-chip{background:var(--card-bg,#fff);border:1px solid var(--border-soft,#e2e8f0);border-radius:999px;padding:3px 10px;font-size:11.5px}.nc-kosong{margin-top:6px;padding:8px 10px;border-radius:10px;background:#fef9c3;color:#854d0e;border:1px solid #fde047}
  .nc-batas{display:flex;flex-wrap:wrap;align-items:center;gap:6px;font-size:12px;margin-bottom:10px}.nc-batas input{width:64px;padding:4px 6px;text-align:center}
  .nc-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.nc-kartu{border-radius:16px;padding:10px;background:var(--l);border:1px solid color-mix(in srgb,var(--w) 30%,transparent);border-top:4px solid var(--w)}
  .nc-kartu-h{display:flex;gap:8px;align-items:center;margin-bottom:6px}.nc-kartu-h b{color:var(--w);font-size:14px}.nc-kartu-h small{display:block;color:#475569;font-size:11px}.nc-ikon{font-size:22px}
  .nc-kartu textarea{background:#fff;color:#0f172a;font-size:12.5px;line-height:1.5;min-height:120px}
  .nc-aksi,.nc-ed-aksi{display:flex;gap:8px;justify-content:flex-end;margin-top:12px;flex-wrap:wrap}.nc-ket{font-size:11px;color:var(--text-secondary);margin-top:6px}
  .nc-ed-kepala{display:flex;justify-content:space-between;align-items:flex-start;gap:10px;margin-bottom:10px}.nc-ed-kepala h3{margin:0}.nc-ed-kepala small{color:var(--text-secondary)}
  .nc-ed-nilai{text-align:center;background:var(--surface-2,#f1f5f9);border-radius:14px;padding:6px 14px}.nc-ed-nilai b{display:block;font-size:22px}.nc-ed-nilai span{font-size:11px;color:var(--text-secondary)}
  .nc-pil-grid{display:grid;gap:8px}.nc-pil{text-align:left;border:1px solid color-mix(in srgb,var(--w) 25%,transparent);background:var(--l);border-left:4px solid var(--w);border-radius:12px;padding:8px 10px;cursor:pointer;color:#0f172a}
  .nc-pil b{display:block;color:var(--w);font-size:12.5px;margin-bottom:2px}.nc-pil b em{font-style:normal;font-size:10.5px;background:var(--w);color:#fff;border-radius:999px;padding:1px 7px;margin-left:4px}
  .nc-pil span{font-size:12px;line-height:1.45}.nc-pil.saran{box-shadow:0 0 0 2px var(--w)}.nc-pil:disabled{opacity:.6;cursor:default}
  @media (max-width:760px){.nc-grid{grid-template-columns:1fr}.nc-kartu textarea{min-height:90px}.nc-aksi .btn,.nc-ed-aksi .btn{flex:1}}`;
  const s = document.createElement("style"); s.textContent = css; document.head.appendChild(s);
})();

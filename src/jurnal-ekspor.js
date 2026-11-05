// ============================================================
//  EKSPOR JURNAL (Word) — satu bulan atau beberapa bulan sekaligus, dengan/tanpa SAMPUL.
//  • Pilih "Dari bulan" & "Sampai bulan". Tiap bulan tetap punya judul, tabel, dan tanda tangan
//    di akhir bulannya sendiri — semuanya digabung dalam satu file, dipisah ganti halaman.
//  • Sampul (opsional) hanya di halaman pertama: logo, JURNAL PEMBELAJARAN, nama lembaga,
//    "BULAN SEPTEMBER – OKTOBER 2026", nama guru, semester, tahun ajaran, yayasan & alamat.
//  • File berformat .docx asli (pustaka docx) supaya logo & tabel tampil benar di MS Word, WPS & Google Docs.
// ============================================================
const JE_BAWAAN = {
  lembaga: "PKBM AL UMM BARABAI", unit: "Rumah Tahfizh Putra",
  yayasan: "YAYASAN AL UMM HULU SUNGAI TENGAH",
  alamat: "Jl. Masjid Al Umm Komp. Bulau Indah Baru RT.09 Kec. Barabai Kab. Hulu Sungai Tengah",
  provinsi: "KALIMANTAN SELATAN",
};
function _jeTeks() { try { return { ...JE_BAWAAN, ...JSON.parse(localStorage.getItem("jeSampulTeks") || "{}") }; } catch (e) { return { ...JE_BAWAAN }; } }
const _jeBulanNama = (ym) => new Date(ym + "-01T00:00:00").toLocaleDateString("id-ID", { month: "long" }).toUpperCase();
// "BULAN NOVEMBER 2026" · "BULAN SEPTEMBER – OKTOBER 2026" · "BULAN DESEMBER 2026 – JANUARI 2027"
function _jeLabelBulan(dari, sampai) {
  const [y1] = dari.split("-"), [y2] = sampai.split("-");
  if (dari === sampai) return `BULAN ${_jeBulanNama(dari)} ${y1}`;
  return y1 === y2 ? `BULAN ${_jeBulanNama(dari)} – ${_jeBulanNama(sampai)} ${y2}` : `BULAN ${_jeBulanNama(dari)} ${y1} – ${_jeBulanNama(sampai)} ${y2}`;
}
function _jeDaftarBulan(dari, sampai) {
  const out = []; let [y, m] = dari.split("-").map(Number); const [y2, m2] = sampai.split("-").map(Number);
  while ((y < y2 || (y === y2 && m <= m2)) && out.length < 12) { out.push(`${y}-${String(m).padStart(2, "0")}`); m++; if (m > 12) { m = 1; y++; } }
  return out;
}
function _jeSemesterTA(daftar) {
  const ta = daftar.map((b) => (typeof _kbTahunAjaran === "function" ? _kbTahunAjaran(b) : { semester: "-", ta: "-" }));
  const uniq = (k) => [...new Set(ta.map((x) => x[k]))].join(" – ");
  return { semester: uniq("semester"), ta: uniq("ta") };
}

function bukaEksporJurnal() {
  const bulanIni = qs("jg-bulan")?.value || bulanIniISO();
  const tk = _jeTeks();
  openModal(`<h3>📤 Ekspor Jurnal ke Word</h3>
    <div style="font-size:12px;color:var(--text-secondary);margin:-4px 0 12px;line-height:1.55">Pilih satu bulan atau beberapa bulan. Tiap bulan tetap memiliki <b>tanda tangan di akhir bulannya</b>; semua digabung dalam satu file.</div>
    <div style="display:flex;gap:10px;flex-wrap:wrap">
      <div class="field" style="flex:1;min-width:140px"><label class="form-label">📅 Dari bulan</label><input type="month" id="je-dari" class="input" value="${bulanIni}" oninput="_jePratinjau()"></div>
      <div class="field" style="flex:1;min-width:140px"><label class="form-label">📅 Sampai bulan</label><input type="month" id="je-sampai" class="input" value="${bulanIni}" oninput="_jePratinjau()"></div>
    </div>
    <div class="je-cepat">${[["Bulan ini", 0], ["2 bulan", 1], ["3 bulan", 2], ["1 semester", 5]].map(([l, n]) => `<button type="button" onclick="_jeRentang(${n})">${l}</button>`).join("")}</div>
    <label class="je-opsi"><input type="checkbox" id="je-sampul" checked onchange="_jePratinjau()"> <span>📘 <b>Tambahkan sampul</b> di halaman pertama</span></label>
    <div id="je-pratinjau"></div>
    <details class="je-atur"><summary>⚙️ Atur teks sampul (lembaga, yayasan, alamat)</summary>
      ${["lembaga", "unit", "yayasan", "alamat", "provinsi"].map((k) => `<div class="field" style="margin:6px 0 0"><label class="form-label" style="text-transform:capitalize">${k}</label><input class="input je-teks" data-k="${k}" value="${escapeHtml(tk[k])}" oninput="_jePratinjau()"></div>`).join("")}
    </details>
    <button class="btn btn-accent" style="width:100%;margin-top:12px" id="je-ok" onclick="eksporJurnalGabungan()">📤 Ekspor Word</button>`);
  _jePratinjau();
}
function _jeRentang(n) {
  const sampai = qs("je-sampai").value || bulanIniISO();
  let [y, m] = sampai.split("-").map(Number); m -= n; while (m < 1) { m += 12; y--; }
  qs("je-dari").value = `${y}-${String(m).padStart(2, "0")}`; _jePratinjau();
}
function _jeIsianTeks() {
  const tk = _jeTeks();
  qsa(".je-teks").forEach((i) => { tk[i.dataset.k] = i.value; });
  try { localStorage.setItem("jeSampulTeks", JSON.stringify(tk)); } catch (e) {}
  return tk;
}
function _jeNamaGuru() {
  const id = qs("jg-guru")?.value;
  return id ? (LOOKUP.guruAll.find((g) => g.id === id)?.nama || STATE.guruNama || "-") : (isAdmin() ? "Semua Guru" : STATE.guruNama || "-");
}
function _jePratinjau() {
  const el = qs("je-pratinjau"); if (!el) return;
  let dari = qs("je-dari").value, sampai = qs("je-sampai").value;
  if (!dari || !sampai) return;
  if (sampai < dari) [dari, sampai] = [sampai, dari];
  const daftar = _jeDaftarBulan(dari, sampai), st = _jeSemesterTA(daftar), tk = _jeIsianTeks();
  const sampul = qs("je-sampul").checked;
  el.innerHTML = `<div class="je-ringkas"><b>${daftar.length} bulan</b> · ${daftar.length} halaman tanda tangan${sampul ? " · 1 sampul" : ""}${daftar.length >= 12 ? " (maksimal 12 bulan)" : ""}</div>
    ${sampul ? `<div class="je-sampul-mini">
      <img src="${escapeHtml(urlLogoSekolah())}" alt="" onerror="this.style.display='none'">
      <b class="j1">JURNAL PEMBELAJARAN</b><b>${escapeHtml(tk.lembaga)}</b><span>${escapeHtml(tk.unit)}</span>
      <b class="j2">${_jeLabelBulan(dari, sampai)}</b>
      <div class="id">Nama Guru: ${escapeHtml(_jeNamaGuru())}<br>Semester: ${escapeHtml(st.semester)}<br>Tahun Ajaran: ${escapeHtml(st.ta)}</div>
      <small>${escapeHtml(tk.yayasan)}<br>${escapeHtml(tk.alamat)}<br>${escapeHtml(tk.provinsi)}</small></div>` : ""}`;
}

// Logo → PNG base64 (lewat kanvas; SVG/JPG pun jadi PNG agar pasti tampil di Word)
async function _jeLogoPng() {
  const url = urlLogoSekolah(); if (!url) return null;
  try {
    const img = await new Promise((ok, no) => { const im = new Image(); im.crossOrigin = "anonymous"; im.onload = () => ok(im); im.onerror = no; im.src = url; });
    const c = document.createElement("canvas"), sisi = 480, r = Math.min(sisi / img.width, sisi / img.height);
    c.width = Math.round(img.width * r); c.height = Math.round(img.height * r);
    c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
    return c.toDataURL("image/png").split(",")[1];
  } catch (e) { console.warn("Logo tidak bisa dimuat:", e); return null; }
}
// ── Dokumen Word asli (.docx) lewat pustaka "docx" — terbaca benar di MS Word, WPS, Google Docs & LibreOffice,
//    termasuk logo (format .doc lama/web-archive membuat logo hilang di WPS). Pustaka dimuat hanya saat ekspor.
let _jeDocxJanji = null;
function _jeMuatDocx() {
  if (window.docx) return Promise.resolve(window.docx);
  return (_jeDocxJanji = _jeDocxJanji || new Promise((ok, no) => {
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/docx@8.5.0/build/index.umd.js";
    s.onload = () => (window.docx ? ok(window.docx) : no(new Error("Pustaka Word gagal dimuat")));
    s.onerror = () => { _jeDocxJanji = null; no(new Error("Pustaka Word gagal dimuat — periksa internet")); };
    document.head.appendChild(s);
  }));
}
const JE_LEBAR = 14570; // lebar isi A4 mendatar dengan margin 2 cm (twip)
// Semua paragraf & tabel ditegaskan kiri-ke-kanan: di Office yang bahasa defaultnya Arab, dokumen tanpa
// penegasan ini dibaca kanan-ke-kiri sehingga teks "rata kiri" malah tampil rata kanan.

function _jeDocxBagian(D, data, bulanVal) {
  const { Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle, ShadingType, VerticalAlign } = D;
  const semuaGuru = !qs("jg-guru")?.value && isAdmin();
  const guruNama = _jeNamaGuru();
  const ta = typeof _kbTahunAjaran === "function" ? _kbTahunAjaran(bulanVal) : { semester: "-", ta: "-" };
  const namaSekolah = STATE.pengaturan?.nama_pkbm || "PKBM Al Umm Barabai";
  const namaKepala = STATE.pengaturan?.kepala_pkbm || "Ahmad Rizqi Zaidi, S.Pd";
  const [yy, mm] = bulanVal.split("-").map(Number);
  const tanggalTtd = new Date(yy, mm, 0).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  const program = data.find((j) => j.kelas?.program)?.kelas?.program || "-";
  const tanpa = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
  const tanpaGaris = { top: tanpa, bottom: tanpa, left: tanpa, right: tanpa, insideHorizontal: tanpa, insideVertical: tanpa };
  const garis = { style: BorderStyle.SINGLE, size: 4, color: "555555" };
  const p = (teks, o = {}) => new Paragraph({ bidirectional: false, alignment: o.align || AlignmentType.LEFT, spacing: { before: o.sebelum || 0, after: o.sesudah || 0 },
    children: [].concat(teks).map((t) => new TextRun({ text: String(t ?? ""), bold: o.tebal, size: o.size || 21, font: "Times New Roman", break: o.baris ? 1 : 0 })) });
  const sel = (isi, lebar, o = {}) => new TableCell({ width: { size: lebar, type: WidthType.DXA }, verticalAlign: o.tengahV ? VerticalAlign.CENTER : VerticalAlign.TOP,
    shading: o.isi ? { fill: o.isi, type: ShadingType.CLEAR, color: "auto" } : undefined, borders: o.tanpaGaris ? { top: tanpa, bottom: tanpa, left: tanpa, right: tanpa } : undefined,
    margins: { top: 60, bottom: 60, left: 90, right: 90 },
    children: [].concat(isi).map((x) => (typeof x === "string" ? p(x, { align: o.align, tebal: o.tebal, size: o.size }) : x)) });

  // judul & identitas
  const atas = [
    p("JURNAL KEGIATAN PEMBELAJARAN", { align: AlignmentType.CENTER, tebal: true, size: 28 }),
    p(`Bulan ${namaBulanIndo(bulanVal)}`, { align: AlignmentType.CENTER, tebal: true, size: 24, sesudah: 240 }),
    new Table({ visuallyRightToLeft: false, width: { size: JE_LEBAR, type: WidthType.DXA }, columnWidths: [2400, 300, 4585, 2400, 300, 4585], borders: tanpaGaris,
      rows: [[["Satuan Pendidikan", namaSekolah], ["Nama Pengajar", guruNama]], [["Program", program], ["Semester/ Tahun Ajaran", `${ta.semester} – ${ta.ta}`]]].map((baris) =>
        new TableRow({ children: baris.flatMap(([k, v]) => [sel(k, 2400, { tanpaGaris: true, size: 22 }), sel(":", 300, { tanpaGaris: true, size: 22 }), sel(v, 4585, { tanpaGaris: true, tebal: true, size: 22 })]) })) }),
    p("", { sesudah: 160 }),
  ];
  // tabel jurnal (lebar kolom sama dengan ekspor lama)
  const persen = semuaGuru ? [4, 9, 10, 8, 8, 11, 7, 16, 19, 8] : [5, 12, 10, 10, 13, 8, 18, 16, 8];
  const lebar = persen.map((x) => Math.round((JE_LEBAR * x) / 100));
  const judulKolom = ["No", ...(semuaGuru ? ["Guru"] : []), "Hari/Tanggal", "Waktu", "Mapel", "Kelas", "Jumlah Serdik", "Materi Pokok", "Kegiatan Pembelajaran", "Kehadiran"];
  const kepala = new TableRow({ tableHeader: true, children: judulKolom.map((h, i) => sel(h, lebar[i], { isi: "D9E1F2", tebal: true, align: AlignmentType.CENTER, tengahV: true })) });
  const baris = data.map((j, i) => {
    const tgl = new Date(j.tanggal);
    const kegiatan = [j.deskripsi_otomatis, j.catatan].filter(Boolean).map((x) => `- ${x}`);
    const isi = [
      [String(i + 1), { align: AlignmentType.CENTER }],
      ...(semuaGuru ? [[j.guru?.nama || "-", {}]] : []),
      [[`${hariIniIndo(tgl)},`, tgl.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })], { align: AlignmentType.CENTER }],
      [`${j.jadwal_pelajaran?.jam_mulai?.slice(0, 5) || ""}–${j.jadwal_pelajaran?.jam_selesai?.slice(0, 5) || ""}`, { align: AlignmentType.CENTER }],
      [j.mapel?.nama_mapel || "-", {}], [j.kelas?.nama_kelas || "-", {}],
      [`${j.jumlah_siswa || 0} org`, { align: AlignmentType.CENTER }],
      [j.materi_pokok || "", {}], [kegiatan.length ? kegiatan : [""], {}],
      [_kehadiranRingkasJurnal(j), { align: AlignmentType.CENTER }],
    ];
    return new TableRow({ cantSplit: true, children: isi.map(([t, o], k) => sel([].concat(t).map((x) => p(x, { align: o.align })), lebar[k])) });
  });
  const tabel = new Table({ visuallyRightToLeft: false, width: { size: JE_LEBAR, type: WidthType.DXA }, columnWidths: lebar, rows: [kepala, ...baris],
    borders: { top: garis, bottom: garis, left: garis, right: garis, insideHorizontal: garis, insideVertical: garis } });
  // tanda tangan akhir bulan
  const ttd = new Table({ visuallyRightToLeft: false, width: { size: JE_LEBAR, type: WidthType.DXA }, columnWidths: [JE_LEBAR / 2, JE_LEBAR / 2], borders: tanpaGaris,
    rows: [new TableRow({ cantSplit: true, children: [
      sel([p("Mengetahui,", { size: 22 }), p("Kepala PKBM,", { size: 22, sesudah: 1200 }), p(namaKepala, { size: 22, tebal: true })], JE_LEBAR / 2, { tanpaGaris: true }),
      sel([p(`Barabai, ${tanggalTtd}`, { size: 22 }), p("Tutor,", { size: 22, sesudah: 1200 }), p(guruNama, { size: 22, tebal: true })], JE_LEBAR / 2, { tanpaGaris: true }),
    ] })] });
  return [...atas, tabel, p("", { sesudah: 360 }), ttd];
}
function _jeDocxSampul(D, dari, sampai, daftar, tk, logo) {
  const { Paragraph, TextRun, ImageRun, Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle } = D;
  const st = _jeSemesterTA(daftar);
  const tanpa = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
  const tengah = (teks, size, o = {}) => new Paragraph({ bidirectional: false, alignment: AlignmentType.CENTER, spacing: { before: o.sebelum || 0, after: o.sesudah || 0 },
    children: [new TextRun({ text: teks, bold: o.tebal, size: size * 2, font: "Times New Roman" })] });
  const isi = [
    tengah("JURNAL PEMBELAJARAN", 22, { tebal: true, sebelum: 240 }),
    tengah(tk.lembaga, 16, { tebal: true }),
    tengah(tk.unit, 16),
  ];
  if (logo) isi.push(new Paragraph({ bidirectional: false, alignment: AlignmentType.CENTER, spacing: { before: 400, after: 400 }, children: [new ImageRun({ data: logo.data, transformation: { width: 159, height: Math.round(159 * logo.rasio) } })] }));
  else isi.push(tengah("", 18, { sebelum: 400, sesudah: 400 }));
  isi.push(tengah(_jeLabelBulan(dari, sampai), 18, { tebal: true, sesudah: 300 }));
  const sel = (teks, w) => new TableCell({ width: { size: w, type: WidthType.DXA }, borders: { top: tanpa, bottom: tanpa, left: tanpa, right: tanpa },
    margins: { top: 30, bottom: 30, left: 90, right: 90 }, children: [new Paragraph({ bidirectional: false, alignment: AlignmentType.LEFT, children: [new TextRun({ text: teks, size: 28, font: "Times New Roman" })] })] });
  isi.push(new Table({ visuallyRightToLeft: false, alignment: AlignmentType.CENTER, width: { size: 6400, type: WidthType.DXA }, columnWidths: [2200, 300, 3900],
    borders: { top: tanpa, bottom: tanpa, left: tanpa, right: tanpa, insideHorizontal: tanpa, insideVertical: tanpa },
    rows: [["Nama Guru", _jeNamaGuru()], ["Semester", st.semester], ["Tahun Ajaran", st.ta]].map(([k, v]) => new TableRow({ children: [sel(k, 2200), sel(":", 300), sel(v, 3900)] })) }));
  isi.push(tengah(tk.yayasan, 18, { sebelum: 900 }), tengah(tk.alamat, 10), tengah(tk.provinsi, 9));
  return isi;
}

async function eksporJurnalGabungan() {
  let dari = qs("je-dari").value, sampai = qs("je-sampai").value;
  if (!dari || !sampai) { toast("Pilih bulan dulu", "err"); return; }
  if (sampai < dari) [dari, sampai] = [sampai, dari];
  const daftar = _jeDaftarBulan(dari, sampai), tk = _jeIsianTeks(), sampul = qs("je-sampul").checked;
  const tb = qs("je-ok"); tb.disabled = true; tb.textContent = "⏳ Menyiapkan…";
  try {
    const D = await _jeMuatDocx();
    const guruId = isAdmin() ? (qs("jg-guru").value || null) : (STATE.guruId || null);
    const mapelId = qs("jg-mapel")?.value || "";
    const bulanAda = [];
    for (const b of daftar) {
      tb.textContent = `⏳ Mengambil jurnal ${namaBulanIndo(b)}…`;
      let data = await apiGetJurnalBulanan(guruId, b);
      if (mapelId) data = data.filter((j) => j.mapel_id === mapelId);
      if (data.length) bulanAda.push([b, data]);
    }
    if (!bulanAda.length) { toast("Tidak ada jurnal pada bulan yang dipilih", "err"); tb.disabled = false; tb.textContent = "📤 Ekspor Word"; return; }
    let logo = null;
    if (sampul) { const b64 = await _jeLogoPng(); if (b64) { const bin = atob(b64), u8 = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i); logo = { data: u8, rasio: (u8[22] << 8 | u8[23]) / (u8[18] << 8 | u8[19]) || 1 }; } }
    const halaman = { page: { size: { width: 11906, height: 16838, orientation: D.PageOrientation.LANDSCAPE }, margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 } } };
    const sections = [];
    if (sampul) sections.push({ properties: halaman, children: _jeDocxSampul(D, dari, sampai, daftar, tk, logo) });
    bulanAda.forEach(([b, data]) => sections.push({ properties: halaman, children: _jeDocxBagian(D, data, b) }));
    const doc = new D.Document({ creator: STATE.guruNama || "", title: "Jurnal Kegiatan Pembelajaran",
      styles: { default: { document: { run: { font: "Times New Roman", size: 21 } } } }, sections });
    const blob = await D.Packer.toBlob(doc);
    const nama = `Jurnal_${_jeNamaGuru().split(",")[0].replace(/\s+/g, "_")}_${dari}${sampai !== dari ? "_sd_" + sampai : ""}.docx`;
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = nama;
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 3000);
    toast(`📤 Jurnal ${daftar.length > 1 ? daftar.length + " bulan " : ""}diekspor${bulanAda.length < daftar.length ? ` (${daftar.length - bulanAda.length} bulan tanpa jurnal dilewati)` : ""}`, "ok");
    closeModal();
  } catch (e) { console.error(e); toast("Gagal mengekspor: " + e.message, "err"); tb.disabled = false; tb.textContent = "📤 Ekspor Word"; }
}

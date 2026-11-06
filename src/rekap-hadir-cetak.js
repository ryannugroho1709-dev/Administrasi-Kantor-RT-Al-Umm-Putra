// ============================================================
//  CETAK REKAP DAFTAR HADIR PESERTA DIDIK (Word .docx) — admin & kepala sekolah
//  • Data = absensi santri yang diisi guru di JURNAL (view rekap_kehadiran_harian_siswa: satu status per hari).
//  • Per bulan: tabel harian (tanggal × santri, H/S/I/A) + jumlah. Per semester: hadir per bulan + jumlah S/I/A & %.
//  • Satu kelas atau semua kelas sekaligus (tiap kelas halaman sendiri dengan tanda tangan).
//  • Sampul mengikuti contoh sekolah: judul, PKBM, Rumah Tahfizh, paket, logo, pita kelas, periode,
//    tahun pelajaran Hijriah/Masehi, alamat & email, bingkai hijau.
// ============================================================
const RH_HIJAU = "1E7B3C";
const _rhHijri = (y) => { try { return parseInt(new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", { year: "numeric" }).format(new Date(y, 0, 1)), 10); } catch (e) { return Math.round((y - 622) * 1.0307); } };
// "Tahun Pelajaran 1447-1448 H / 2026-2027 M" (penulisan Hijriah mengikuti sampul sekolah: tahun Hijriah pada awal tiap tahun Masehi)
function _rhTahunPelajaran(ta) { const [a, b] = String(ta).split("/").map(Number); return `Tahun Pelajaran ${_rhHijri(a)}-${_rhHijri(b || a + 1)} H / ${a}-${b || a + 1} M`; }
function _rhBulanSemester(semester, ta) {
  const awal = (STATE.pengaturan || {}).bulan_awal_tahun_ajaran || 7, y = parseInt(ta, 10) || new Date().getFullYear();
  let m = awal + (semester === "Genap" ? 6 : 0), th = y; if (m > 12) { m -= 12; th++; }
  const dari = `${th}-${String(m).padStart(2, "0")}`; let m2 = m + 5, th2 = th; if (m2 > 12) { m2 -= 12; th2++; }
  return _jeDaftarBulan(dari, `${th2}-${String(m2).padStart(2, "0")}`);
}
const _rhNamaBulan = (ym) => new Date(ym + "-01T00:00:00").toLocaleDateString("id-ID", { month: "long" });
function _rhPeriode(o) {
  if (o.jenis === "bulan") { const [y] = o.bulan.split("-"); return { judul: `BULAN ${_rhNamaBulan(o.bulan).toUpperCase()} ${y}`, sub: "", teks: `Bulan ${_rhNamaBulan(o.bulan)} ${y}` }; }
  const d = o.daftar, [y1] = d[0].split("-"), [y2] = d[d.length - 1].split("-");
  const rentang = `${_rhNamaBulan(d[0])}${y1 !== y2 ? " " + y1 : ""} – ${_rhNamaBulan(d[d.length - 1])} ${y2}`;
  return { judul: `SEMESTER ${o.semester.toUpperCase()}`, sub: rentang.toUpperCase(), teks: `Semester ${o.semester} (${rentang})` };
}
function _rhPaket(kelasArr) {
  const p = [...new Set(kelasArr.map((k) => paketDariNamaKelas(k.nama_kelas)).filter(Boolean))].sort();
  if (p.length > 1) return "(Paket B dan C Setara SMP dan SMA)";
  return p[0] === "C" ? "(Paket C Setara SMA)" : p[0] === "B" ? "(Paket B Setara SMP)" : "";
}
function _rhPitaKelas(kelasArr) {
  if (kelasArr.length === 1) { const n = _rcAngkaKelas(kelasArr[0].nama_kelas), k = RC_KELAS[n]; return k ? `KELAS ${k[0]} (${k[1].toLowerCase()})` : `KELAS ${formatKelasLabel(kelasArr[0].nama_kelas)}`; }
  const r = kelasArr.map((k) => _rcAngkaKelas(k.nama_kelas)).filter(Boolean).sort((a, b) => a - b);
  return r.length ? `KELAS ${RC_KELAS[r[0]]?.[0] || r[0]} – ${RC_KELAS[r[r.length - 1]]?.[0] || r[r.length - 1]}` : "SEMUA KELAS";
}

// ── Jendela pilihan ──
async function bukaCetakRekapHadir() {
  if (!(isAdmin() || isKepsek())) { toast("Fitur ini untuk admin & kepala sekolah", "err"); return; }
  await ensureLookups();
  const a = semesterAktifSekarang(), kelasNow = qs("rk-kelas")?.value || "";
  openModal(`<h3>🖨️ Cetak Rekap Daftar Hadir</h3>
    <div style="font-size:12px;color:var(--text-secondary);margin:-4px 0 12px;line-height:1.55">Diambil dari absensi santri di <b>jurnal</b> guru. File Word dengan sampul, siap cetak.</div>
    <div class="field"><label class="form-label">🏫 Kelas</label><select id="rh-kelas" class="input" onchange="_rhPratinjau()">
      <option value="">👥 Semua kelas (tiap kelas halaman sendiri)</option>${LOOKUP.kelas.map((k) => `<option value="${k.id}" ${k.id === kelasNow ? "selected" : ""}>${escapeHtml(_rcKelasPanjang(k.nama_kelas))}</option>`).join("")}</select></div>
    <div class="rc-pilih" style="margin-top:6px">
      <label><input type="radio" name="rh-jenis" value="bulan" checked onchange="_rhPratinjau()"> 📅 <b>Per bulan</b><span>tabel harian H/S/I/A</span></label>
      <label><input type="radio" name="rh-jenis" value="semester" onchange="_rhPratinjau()"> 🗓️ <b>Satu semester</b><span>6 bulan, ringkasan per bulan</span></label>
    </div>
    <div id="rh-bulan-wrap" class="field" style="margin-top:8px"><label class="form-label">Bulan</label><input type="month" id="rh-bulan" class="input" value="${qs("rk-bulan")?.value || bulanIniISO()}" oninput="_rhPratinjau()"></div>
    <div id="rh-sem-wrap" style="display:none;gap:8px;margin-top:8px">
      <div class="field" style="flex:1"><label class="form-label">Semester</label><select id="rh-semester" class="input" onchange="_rhPratinjau()"><option ${a.semester === "Ganjil" ? "selected" : ""}>Ganjil</option><option ${a.semester === "Genap" ? "selected" : ""}>Genap</option></select></div>
      <div class="field" style="flex:1"><label class="form-label">Tahun Ajaran</label><input id="rh-ta" class="input" value="${escapeHtml(a.ta)}" oninput="_rhPratinjau()"></div></div>
    <div id="rh-pratinjau"></div>
    <button class="btn btn-accent" style="width:100%;margin-top:12px" id="rh-ok" onclick="cetakRekapHadir()">🖨️ Buat file Word</button>`);
  _rhPratinjau();
}
function _rhOpsi() {
  const jenis = document.querySelector('input[name="rh-jenis"]:checked')?.value || "bulan";
  const kelasId = qs("rh-kelas").value, kelas = kelasId ? LOOKUP.kelas.filter((k) => k.id === kelasId) : LOOKUP.kelas.slice();
  kelas.sort((a, b) => (_rcAngkaKelas(a.nama_kelas) || 99) - (_rcAngkaKelas(b.nama_kelas) || 99) || a.nama_kelas.localeCompare(b.nama_kelas, "id"));
  if (jenis === "bulan") { const bulan = qs("rh-bulan").value || bulanIniISO(); return { jenis, kelas, bulan, daftar: [bulan], ta: _kbTahunAjaran(bulan).ta, semester: _kbTahunAjaran(bulan).semester }; }
  const semester = qs("rh-semester").value, ta = qs("rh-ta").value.trim();
  return { jenis, kelas, semester, ta, daftar: _rhBulanSemester(semester, ta) };
}
function _rhPratinjau() {
  const el = qs("rh-pratinjau"); if (!el) return;
  const sem = document.querySelector('input[name="rh-jenis"]:checked')?.value === "semester";
  qs("rh-bulan-wrap").style.display = sem ? "none" : ""; qs("rh-sem-wrap").style.display = sem ? "flex" : "none";
  const o = _rhOpsi(), per = _rhPeriode(o), tk = _jeTeks();
  el.innerHTML = `<div class="je-sampul-mini rh-sampul-mini">
    <b class="j1">REKAP DAFTAR HADIR PESERTA DIDIK</b><b>${escapeHtml(tk.lembaga)}</b><span>RUMAH TAHFIZH PUTRA AL UMM BARABAI</span><span>${escapeHtml(_rhPaket(o.kelas))}</span>
    <img src="${escapeHtml(urlLogoSekolah())}" alt="" onerror="this.style.display='none'">
    <b class="rh-pita">${escapeHtml(_rhPitaKelas(o.kelas))}</b>
    <b class="j2">${escapeHtml(per.judul)}${per.sub ? `<br><small>${escapeHtml(per.sub)}</small>` : ""}</b>
    <span>${escapeHtml(_rhTahunPelajaran(o.ta))}</span></div>
    <div class="je-ringkas">${o.kelas.length} kelas · ${o.daftar.length} bulan · 1 sampul</div>`;
}

// ── Ambil data (berhalaman 1000 baris supaya rekap semester semua kelas tidak terpotong) ──
async function _rhAmbilHarian(ids, dari, sampai) {
  const out = [];
  for (let i = 0; i < ids.length; i += 150) {
    const potong = ids.slice(i, i + 150);
    for (let mulai = 0; ; mulai += 1000) {
      const rows = unwrap(await supa.from("rekap_kehadiran_harian_siswa").select("siswa_id,tanggal,status_harian").in("siswa_id", potong).gte("tanggal", dari).lte("tanggal", sampai).order("tanggal").range(mulai, mulai + 999));
      out.push(...rows); if (rows.length < 1000) break;
    }
  }
  return out;
}
const RH_KODE = { hadir: "H", hadir_bersyarat: "H", sakit: "S", izin: "I", alpha: "A" };

async function cetakRekapHadir() {
  const o = _rhOpsi();
  if (!o.kelas.length) { toast("Belum ada kelas", "err"); return; }
  if (o.jenis === "semester" && !/^\d{4}\/\d{4}$/.test(o.ta)) { toast("Tahun ajaran ditulis seperti 2026/2027", "err"); return; }
  const tb = qs("rh-ok"); tb.disabled = true; tb.textContent = "⏳ Mengambil data…";
  try {
    const D = await _jeMuatDocx();
    const dari = o.daftar[0] + "-01", sampai = rentangBulan(o.daftar[o.daftar.length - 1]).sampai;
    const perKelas = [];
    for (const k of o.kelas) {
      tb.textContent = `⏳ ${_rcKelasPanjang(k.nama_kelas)}…`;
      const siswa = await apiGetSiswaByKelas(k.id);
      if (!siswa.length) continue;
      perKelas.push({ kelas: k, siswa, harian: await _rhAmbilHarian(siswa.map((s) => s.id), dari, sampai) });
    }
    if (!perKelas.length) throw new Error("Kelas yang dipilih belum punya santri");
    tb.textContent = "⏳ Menyusun Word…";
    const b64 = await _jeLogoPng(); let logo = null;
    if (b64) { const bin = atob(b64), u8 = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i); logo = { data: u8, rasio: (u8[22] << 8 | u8[23]) / (u8[18] << 8 | u8[19]) || 1 }; }
    const doc = _rhDokumen(D, o, perKelas, logo, sampai);
    const blob = await D.Packer.toBlob(doc);
    const nama = `Rekap_Hadir_${o.kelas.length === 1 ? _rcKelasRomawi(o.kelas[0].nama_kelas) : "Semua_Kelas"}_${o.jenis === "bulan" ? o.bulan : `${o.semester}_${o.ta.replace("/", "-")}`}.docx`;
    _rcUnduh(blob, nama);
    toast(`🖨️ Rekap hadir ${perKelas.length} kelas siap dicetak`, "ok"); closeModal();
  } catch (e) { console.error(e); toast("Gagal membuat rekap: " + e.message, "err"); tb.disabled = false; tb.textContent = "🖨️ Buat file Word"; }
}

// ── Susun dokumen ──
function _rhDokumen(D, o, perKelas, logo, tglAkhir) {
  const { Document, Paragraph, TextRun, ImageRun, Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle, ShadingType, VerticalAlign, PageOrientation } = D;
  const tk = _jeTeks(), per = _rhPeriode(o), F = "Times New Roman";
  const tanpa = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
  const tanpaGaris = { top: tanpa, bottom: tanpa, left: tanpa, right: tanpa, insideHorizontal: tanpa, insideVertical: tanpa };
  const garis = { style: BorderStyle.SINGLE, size: 4, color: "444444" };
  const p = (teks, o2 = {}) => new Paragraph({ bidirectional: false, alignment: o2.align ?? AlignmentType.LEFT, spacing: { before: o2.sebelum || 0, after: o2.sesudah || 0 },
    children: [new TextRun({ text: String(teks ?? ""), bold: o2.tebal, size: o2.size || 20, font: F, color: o2.warna, italics: o2.miring })] });
  const tengah = (t, pt, o2 = {}) => p(t, { ...o2, size: pt * 2, align: AlignmentType.CENTER });

  // SAMPUL (A4 tegak, bingkai hijau ganda)
  const sampul = [
    tengah("REKAP DAFTAR HADIR PESERTA DIDIK", 22, { tebal: true, sebelum: 600, sesudah: 200, warna: RH_HIJAU }),
    tengah(tk.lembaga, 18, { tebal: true }),
    tengah("RUMAH TAHFIZH PUTRA AL UMM BARABAI", 14, { tebal: true, sebelum: 60 }),
    tengah(_rhPaket(o.kelas), 13, { sebelum: 40 }),
  ];
  sampul.push(logo ? new Paragraph({ bidirectional: false, alignment: AlignmentType.CENTER, spacing: { before: 700, after: 700 }, children: [new ImageRun({ data: logo.data, transformation: { width: 230, height: Math.round(230 * logo.rasio) } })] }) : tengah("", 12, { sebelum: 1800, sesudah: 1800 }));
  sampul.push(new Table({ visuallyRightToLeft: false, alignment: AlignmentType.CENTER, width: { size: 5600, type: WidthType.DXA }, columnWidths: [5600], borders: tanpaGaris,
    rows: [new TableRow({ children: [new TableCell({ width: { size: 5600, type: WidthType.DXA }, shading: { fill: RH_HIJAU, type: ShadingType.CLEAR, color: "auto" }, margins: { top: 120, bottom: 120, left: 120, right: 120 },
      borders: { top: tanpa, bottom: tanpa, left: tanpa, right: tanpa }, children: [tengah(_rhPitaKelas(o.kelas), 18, { tebal: true, warna: "FFFFFF" })] })] })] }));
  sampul.push(tengah(per.judul, 18, { tebal: true, sebelum: 500 }));
  if (per.sub) sampul.push(tengah(per.sub, 14, { tebal: true, sebelum: 60 }));
  sampul.push(tengah(_rhTahunPelajaran(o.ta), 14, { sebelum: 160 }));
  sampul.push(tengah(tk.lembaga, 14, { tebal: true, sebelum: per.sub ? 2900 : 3300, warna: RH_HIJAU }), tengah(tk.alamat, 11, { sebelum: 40 }), tengah("Email: pkbm.alumm@gmail.com", 11, { sebelum: 40 }));
  const bingkai = { style: BorderStyle.DOUBLE, size: 18, color: RH_HIJAU, space: 24 };
  const sections = [{ properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 },
    borders: { pageBorderTop: bingkai, pageBorderBottom: bingkai, pageBorderLeft: bingkai, pageBorderRight: bingkai } } }, children: sampul }];

  // HALAMAN PER KELAS (A4 mendatar)
  const LEBAR = 14570, kepsek = STATE.pengaturan?.kepala_pkbm || _namaPejabat({}) || "";
  const tglTtd = new Date(tglAkhir).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  const sel = (isi, w, o2 = {}) => new TableCell({ width: { size: w, type: WidthType.DXA }, verticalAlign: VerticalAlign.CENTER,
    shading: o2.isi ? { fill: o2.isi, type: ShadingType.CLEAR, color: "auto" } : undefined, margins: { top: 30, bottom: 30, left: o2.rapat ? 10 : 70, right: o2.rapat ? 10 : 70 },
    columnSpan: o2.span, rowSpan: o2.rowSpan, children: [p(isi, { align: o2.align ?? AlignmentType.CENTER, tebal: o2.tebal, size: o2.size || 18, warna: o2.warna })] });
  perKelas.forEach(({ kelas, siswa, harian }) => {
    const wali = guruWaliKelasDari(kelas.id);
    const peta = {}; harian.forEach((r) => { (peta[r.siswa_id] = peta[r.siswa_id] || {})[r.tanggal] = RH_KODE[r.status_harian] || ""; });
    const hitung = (sid, kode, awal) => Object.entries(peta[sid] || {}).filter(([t, v]) => v === kode && (!awal || t.startsWith(awal))).length;
    let kepala, baris, lebar;
    if (o.jenis === "bulan") {
      const tgl = [...new Set(harian.map((r) => r.tanggal))].sort();
      const sisa = LEBAR - 450 - 3300 - 4 * 430 - 600, wT = tgl.length ? Math.max(250, Math.floor(sisa / tgl.length)) : sisa;
      lebar = [450, 3300, ...tgl.map(() => wT), 430, 430, 430, 430, 600];
      kepala = [new TableRow({ tableHeader: true, children: [sel("No", 450, { tebal: true, isi: "DDEBDD" }), sel("Nama Peserta Didik", 3300, { tebal: true, isi: "DDEBDD" }),
        ...tgl.map((t) => sel(String(Number(t.slice(8))), wT, { tebal: true, isi: "DDEBDD", rapat: true, size: 15 })),
        ...["H", "S", "I", "A", "%"].map((h, i) => sel(h, i < 4 ? 430 : 600, { tebal: true, isi: "C8E6C9" }))] })];
      baris = siswa.map((s, i) => { const h = hitung(s.id, "H"), tot = Object.keys(peta[s.id] || {}).length;
        return new TableRow({ cantSplit: true, children: [sel(String(i + 1), 450), sel(s.nama, 3300, { align: AlignmentType.LEFT }),
          ...tgl.map((t) => { const v = (peta[s.id] || {})[t] || ""; return sel(v, wT, { rapat: true, size: 15, tebal: v !== "H" && !!v, warna: v === "A" ? "C62828" : v === "S" || v === "I" ? "8A5A00" : undefined }); }),
          sel(String(h), 430), sel(String(hitung(s.id, "S")), 430), sel(String(hitung(s.id, "I")), 430), sel(String(hitung(s.id, "A")), 430), sel(tot ? Math.round((h * 100) / tot) + "%" : "-", 600)] }); });
      if (!tgl.length) baris.push(new TableRow({ children: [sel("Belum ada absensi santri di jurnal bulan ini.", LEBAR, { span: lebar.length, miring: true })] }));
    } else {
      const wB = 1150; lebar = [450, 3600, ...o.daftar.map(() => wB), 600, 600, 600, 750, 920];
      const sisa = LEBAR - lebar.reduce((a, b) => a + b, 0); lebar[1] += sisa;
      kepala = [new TableRow({ tableHeader: true, children: [sel("No", lebar[0], { tebal: true, isi: "DDEBDD", rowSpan: 2 }), sel("Nama Peserta Didik", lebar[1], { tebal: true, isi: "DDEBDD", rowSpan: 2 }),
          sel("Jumlah hari hadir per bulan", wB * o.daftar.length, { tebal: true, isi: "DDEBDD", span: o.daftar.length }), sel("Jumlah satu semester", 600 * 3 + 750 + 920, { tebal: true, isi: "C8E6C9", span: 5 })] }),
        new TableRow({ tableHeader: true, children: [...o.daftar.map((b) => sel(_rhNamaBulan(b), wB, { tebal: true, isi: "DDEBDD", size: 16 })), ...["S", "I", "A", "Hadir", "% Hadir"].map((h, i) => sel(h, [600, 600, 600, 750, 920][i], { tebal: true, isi: "C8E6C9", size: 16 }))] })];
      baris = siswa.map((s, i) => { const h = hitung(s.id, "H"), tot = Object.keys(peta[s.id] || {}).length;
        return new TableRow({ cantSplit: true, children: [sel(String(i + 1), lebar[0]), sel(s.nama, lebar[1], { align: AlignmentType.LEFT }),
          ...o.daftar.map((b) => { const hari = Object.keys(peta[s.id] || {}).filter((t) => t.startsWith(b)).length; return sel(hari ? `${hitung(s.id, "H", b)}/${hari}` : "-", wB); }),
          sel(String(hitung(s.id, "S")), 600), sel(String(hitung(s.id, "I")), 600), sel(String(hitung(s.id, "A")), 600, { warna: hitung(s.id, "A") ? "C62828" : undefined }), sel(String(h), 750, { tebal: true }), sel(tot ? Math.round((h * 100) / tot) + "%" : "-", 920, { tebal: true })] }); });
    }
    const tabel = new Table({ visuallyRightToLeft: false, width: { size: LEBAR, type: WidthType.DXA }, columnWidths: lebar, rows: [...kepala, ...baris],
      borders: { top: garis, bottom: garis, left: garis, right: garis, insideHorizontal: garis, insideVertical: garis } });
    const isi = [
      tengah("REKAP DAFTAR HADIR PESERTA DIDIK", 14, { tebal: true }),
      tengah(`${tk.lembaga} · Kelas ${_rcKelasPanjang(kelas.nama_kelas)} ${_rhPaket([kelas])}`, 11, { tebal: true, sebelum: 40 }),
      tengah(`${per.teks} · Tahun Ajaran ${o.ta}`, 11, { sebelum: 40, sesudah: 200 }),
      tabel,
      p(o.jenis === "bulan" ? "Keterangan: H = Hadir, S = Sakit, I = Izin, A = Alpa (tanpa keterangan). Kolom tanggal = hari yang ada jurnal pembelajarannya." : "Keterangan: angka per bulan = hari hadir / hari belajar (hari yang ada jurnal). S = Sakit, I = Izin, A = Alpa.", { size: 16, miring: true, sebelum: 80 }),
      p("Sumber: absensi peserta didik pada jurnal pembelajaran guru.", { size: 16, miring: true, sesudah: 240 }),
      new Table({ visuallyRightToLeft: false, width: { size: LEBAR, type: WidthType.DXA }, columnWidths: [LEBAR / 2, LEBAR / 2], borders: tanpaGaris,
        rows: [new TableRow({ cantSplit: true, children: [
          new TableCell({ width: { size: LEBAR / 2, type: WidthType.DXA }, borders: { top: tanpa, bottom: tanpa, left: tanpa, right: tanpa }, children: [tengah("Mengetahui,", 11), tengah("Kepala PKBM,", 11, { sesudah: 1000 }), tengah(kepsek, 11, { tebal: true })] }),
          new TableCell({ width: { size: LEBAR / 2, type: WidthType.DXA }, borders: { top: tanpa, bottom: tanpa, left: tanpa, right: tanpa }, children: [tengah(`Barabai, ${tglTtd}`, 11), tengah(`Wali Kelas ${_rcKelasRomawi(kelas.nama_kelas)},`, 11, { sesudah: 1000 }), tengah(wali ? wali.nama : "(...............................)", 11, { tebal: true })] }),
        ] })] }),
    ];
    sections.push({ properties: { page: { size: { width: 11906, height: 16838, orientation: PageOrientation.LANDSCAPE }, margin: { top: 1000, bottom: 1000, left: 1134, right: 1134 } } }, children: isi });
  });
  return new Document({ creator: STATE.guruNama || "", title: "Rekap Daftar Hadir Peserta Didik", styles: { default: { document: { run: { font: F, size: 20 } } } }, sections });
}

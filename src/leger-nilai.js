// ============================================================
//  LEGER NILAI EXCEL — untuk guru yang lebih nyaman mengisi di Excel
//  1) Unduh: satu file per MAPEL, satu lembar (sheet) per KELAS yang diajar. Kolom ID siswa &
//     info kelas/mapel tersembunyi supaya saat diunggah kembali nilai masuk ke siswa yang tepat.
//  2) Isi di Excel / Google Sheets / WPS (boleh menambah kolom "Ulangan Harian 3", "Tugas 4", …).
//  3) Unggah: aplikasi membaca semua lembar, menampilkan pratinjau (berapa nilai baru/berubah,
//     angka yang salah), lalu menyimpan otomatis ke Input Nilai Rapor.
//  Sel kosong di Excel = nilai lama di aplikasi TIDAK diubah (bukan dihapus).
// ============================================================
const LEGER = { rencana: null };
const _LG_MAKS = 100;

function _lgPilihan() {
  return {
    guruId: qs("nl-guru")?.value || "", mapelId: qs("nl-mapel")?.value || "", kelasId: qs("nl-kelas")?.value || "",
    semester: qs("nl-semester")?.value || "", tahun: qs("nl-tahun")?.value || "",
  };
}
const _lgNamaMapel = (id) => (LOOKUP.mapel || []).find((m) => m.id === id)?.nama_mapel || "-";
const _lgNamaKelas = (id) => (LOOKUP.kelas || []).find((k) => k.id === id)?.nama_kelas || "-";
const _lgNamaGuru = (id) => (LOOKUP.guruAll || []).find((g) => g.id === id)?.nama || STATE.guruNama || "-";
const _lgAman = (s) => String(s || "").replace(/[\\/?*[\]:]/g, " ").replace(/\s+/g, " ").trim();

// Kelas yang diajar guru ini untuk mapel terpilih (dari jadwal aktif); bila tidak ada → kelas terpilih saja
async function _lgDaftarKelas(p) {
  let kelas = [];
  if (p.guruId) {
    try {
      const j = unwrap(await supa.from("jadwal_pelajaran").select("kelas_id").eq("guru_id", p.guruId).eq("mapel_id", p.mapelId).eq("aktif", true));
      kelas = [...new Set(j.map((x) => x.kelas_id))];
    } catch (e) { console.warn(e); }
  }
  if (!kelas.length && p.kelasId) kelas = [p.kelasId];
  const urut = (id) => parseInt(String(_lgNamaKelas(id)).match(/\d+/)?.[0] || "999", 10);
  return kelas.sort((a, b) => urut(a) - urut(b));
}

// ── 1. UNDUH (versi 2) ───────────────────────────────────────
// Satu lembar per kelas. Mapel gabungan (Geografi/Sosiologi/Ekonomi): semua mapel BERDAMPINGAN di lembar yang sama,
// tiap mapel punya kolom "Nilai Akhir", lalu kolom NILAI RAPOR = rata-rata nilai akhir mapel yang sudah terisi.
// Nilai akhir memakai RUMUS EXCEL yang sama dengan aplikasi (bobot & pola penilaian, kotak kosong tidak dihitung),
// jadi langsung berubah saat guru mengisi angka. Baris 5 (tersembunyi) berisi peta kolom untuk pengunggahan.
const _lgHuruf = (n) => { let s = ""; while (n > 0) { const m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = Math.floor((n - 1) / 26); } return s; };
function _lgRumusAkhir(P, utsWajib, ref) {
  // ref: { uh:[kolomAwal,kolomAkhir]|null, tg:[..]|null, uts, uas, hadir } (huruf kolom) + baris r
  // Sama dengan hitungNilaiAkhir di aplikasi: kotak kosong tidak dihitung; UTS terisi → bobot "dengan UTS",
  // UTS kosong → bobot "tanpa UTS"; belum ada nilai sama sekali (hanya kehadiran) → kosong.
  const r = ref.r, rata = (x) => (x ? `IFERROR(AVERAGEIF(${x[0]}${r}:${x[1]}${r},">0"),0)` : "0"), sel = (c) => (c ? `N(${c}${r})` : "0");
  const nilai = { uh: rata(ref.uh), tugas: rata(ref.tg), uts: sel(ref.uts), uas: sel(ref.uas), kehadiran: sel(ref.hadir) };
  if (P.pola === "satu") return `IF(${nilai.uas}>0,${nilai.uas},"")`;
  const bagi = (w) => {
    const k = Object.keys(nilai).filter((x) => Number(w[x]) > 0);
    if (!k.length) return `""`;
    const atas = k.map((x) => `IF(${nilai[x]}>0,${nilai[x]}*${Number(w[x])},0)`).join("+"), bawah = k.map((x) => `IF(${nilai[x]}>0,${Number(w[x])},0)`).join("+");
    return `IF((${bawah})=0,"",ROUND((${atas})/(${bawah}),1))`;
  };
  const denganUts = (fn) => (utsWajib ? fn(true) : ref.uts ? `IF(${nilai.uts}>0,${fn(true)},${fn(false)})` : fn(false));
  const isi = P.pola === "otomatis"
    ? `IF(OR(${nilai.uh}>0,${nilai.tugas}>0),${denganUts((u) => bagi(P.bobot(u, "standar")))},${denganUts((u) => bagi(P.bobot(u, "ujian")))})`
    : denganUts((u) => bagi(P.bobot(u) || {}));
  return `IF(OR(${nilai.uh}>0,${nilai.tugas}>0,${nilai.uts}>0,${nilai.uas}>0),${isi},"")`;
}
async function unduhLegerNilai() {
  const p = _lgPilihan();
  if (!p.mapelId) { toast("Pilih mapel dulu", "err"); return; }
  if (!window.ExcelJS) { toast("Pustaka Excel belum termuat, coba muat ulang halaman", "err"); return; }
  setGlobalLoading(true, "Menyiapkan leger Excel…");
  try {
    const kelasIds = await _lgDaftarKelas(p);
    if (!kelasIds.length) { toast("Pilih kelas dulu", "err"); return; }
    const wb = new ExcelJS.Workbook(); wb.creator = "Aplikasi PKBM Al Umm Barabai";
    const warna = typeof _warnaDok === "function" ? _warnaDok() : { tua: "#0b3b33", utama: "#0d5c4b" };
    const argb = (hex) => "FF" + String(hex || "#0d5c4b").replace("#", "").toUpperCase();
    const p2 = STATE.pengaturan || {}, P = polaNilai(p.mapelId), subs = typeof subMapel === "function" ? subMapel(p.mapelId) : [];
    const grupList = subs.length ? subs : [null], namaMapel = _lgNamaMapel(p.mapelId);
    const garis = { top: { style: "thin", color: { argb: "FFCCCCCC" } }, bottom: { style: "thin", color: { argb: "FFCCCCCC" } }, left: { style: "thin", color: { argb: "FFCCCCCC" } }, right: { style: "thin", color: { argb: "FFCCCCCC" } } };
    const thn = new Date().getFullYear();
    for (const kelasId of kelasIds) {
      const data = await apiGetNilaiRaporByKelasMapel(kelasId, p.mapelId, p.semester, p.tahun);
      // kehadiran: nilai tersimpan, atau dihitung seperti di Input Nilai
      const hadir = {};
      if (P.pakai.kehadiran !== false) await Promise.all(data.map(async ({ siswa, nilai }) => { hadir[siswa.id] = typeof nilai?.nilai_kehadiran === "number" ? nilai.nilai_kehadiran : await apiHitungNilaiKehadiran(siswa.id, `${thn}-01-01`, tanggalISO()).catch(() => null); }));
      // kolom per grup (mapel / sub-mapel)
      const lens = (n, sub) => (n ? (sub ? lensaSub(n, sub) : n) : null);
      const kolom = [["ID", 1, null], ["No", 5, null], ["NIS", 12, null], ["Nama Siswa", 30, null]];
      if (P.pakai.kehadiran !== false) kolom.push(["Hadir", 8, { jenis: "hadir" }]);
      const peta = []; // {c, sub, jenis, nama}
      const grupInfo = [];
      grupList.forEach((sub) => {
        const uh = new Set(), tg = new Set(); let adaUts = !!P.pakai.utsWajib;
        data.forEach(({ nilai }) => { const n = lens(nilai, sub); (n?.ulangan_harian || []).forEach((x) => uh.add(x.nama)); (n?.tugas || []).forEach((x) => tg.add(x.nama)); if (n?.ada_uts || (n?.uts || []).some((x) => Number(x.nilai) > 0)) adaUts = true; });
        if (P.pakai.uh !== false) for (let i = 1; uh.size < 3; i++) uh.add(`Ulangan Harian ${i}`);
        if (P.pakai.tugas !== false) for (let i = 1; tg.size < 2; i++) tg.add(`Tugas ${i}`);
        const awal = kolom.length + 1, g = { sub, awal, adaUts, uh: [], tg: [] };
        if (P.pakai.uh !== false) [...uh].forEach((k) => { g.uh.push(kolom.length + 1); kolom.push([k, 10, { sub, jenis: "uh", nama: k }]); });
        if (P.pakai.tugas !== false) [...tg].forEach((k) => { g.tg.push(kolom.length + 1); kolom.push([k, 9, { sub, jenis: "tugas", nama: k }]); });
        if (P.pakai.utsBisa !== false) { g.uts = kolom.length + 1; kolom.push(["UTS", 8, { sub, jenis: "uts", nama: "UTS" }]); }
        g.uas = kolom.length + 1; kolom.push([P.pola === "satu" ? "Nilai" : "UAS", 8, { sub, jenis: "uas", nama: "UAS" }]);
        g.akhir = kolom.length + 1; kolom.push([subs.length ? `Akhir ${sub}` : "Nilai Akhir", 10, { sub, jenis: "akhir" }]);
        g.akhirKol = kolom.length; grupInfo.push(g);
      });
      const kolRapor = subs.length ? (kolom.push(["NILAI RAPOR", 11, { jenis: "rapor" }]), kolom.length) : null;
      kolom.push(["Capaian Pembelajaran", 42, { jenis: "cp" }]);
      kolom.forEach(([, , info], i) => { if (info && info.jenis && ["uh", "tugas", "uts", "uas"].includes(info.jenis)) peta.push({ c: i + 1, sub: info.sub || null, jenis: info.jenis, nama: info.nama }); });
      const namaLembar = "Kelas " + String(_lgNamaKelas(kelasId)).replace(/^\s*kelas\s+/i, "");
      const ws = wb.addWorksheet(_lgAman(namaLembar).slice(0, 31) || "Kelas", { views: [{ state: "frozen", xSplit: 4, ySplit: 7 }], pageSetup: { paperSize: 9, orientation: "landscape", fitToPage: true, fitToWidth: 1, fitToHeight: 0 } });
      ws.columns = kolom.map(([, w]) => ({ width: w }));
      ws.getColumn(1).hidden = true;
      const akhirKol = kolom.length;
      const judul = (r, teks, ukuran, tebal) => { ws.mergeCells(r, 2, r, akhirKol); const c = ws.getCell(r, 2); c.value = teks; c.font = { bold: !!tebal, size: ukuran, color: { argb: tebal ? argb(warna.tua) : "FF444444" } }; };
      judul(1, `LEGER NILAI ${String(namaMapel).toUpperCase()}`, 14, true);
      judul(2, `${p2.nama_lembaga_kop || "PKBM Al Umm Barabai"} · ${namaLembar} · Semester ${p.semester} ${p.tahun}${subs.length ? ` · nilai rapor = rata-rata ${subs.join(", ")}` : ""}`, 11, false);
      judul(3, `Guru: ${_lgNamaGuru(p.guruId)} · Pola: ${P.info.label}${P.pola === "otomatis" ? " (ada UH/Tugas → bobot Standar, hanya ujian → UAS + Kehadiran)" : ""}`, 10, false);
      judul(4, "Isi angka 0–100 di kolom putih. Kolom abu-abu (Nilai Akhir / Nilai Rapor) terhitung otomatis — jangan diketik. Kotak kosong tidak ikut dihitung & tidak mengubah nilai di aplikasi. Jangan mengubah judul kolom / baris 5.", 9, false);
      ws.getRow(4).height = 28; ws.getCell(4, 2).alignment = { wrapText: true, vertical: "top" };
      ws.getCell(5, 1).value = "LEGER-NILAI";
      ws.getCell(5, 2).value = JSON.stringify({ v: 2, kelas: kelasId, mapel: p.mapelId, semester: p.semester, tahun: p.tahun, peta, cp: kolom.length });
      ws.getRow(5).hidden = true;
      // baris 6: judul grup (nama mapel / sub-mapel)
      const warnaGrup = ["#1d4ed8", "#7c3aed", "#0f766e", "#b45309"];
      grupInfo.forEach((g, gi) => { ws.mergeCells(6, g.awal, 6, g.akhirKol); const c = ws.getCell(6, g.awal); c.value = g.sub || namaMapel; c.font = { bold: true, color: { argb: "FFFFFFFF" } }; c.alignment = { horizontal: "center" }; c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: argb(warnaGrup[gi % 4]) } }; });
      if (kolRapor) { const c = ws.getCell(6, kolRapor); c.value = "RAPOR"; c.font = { bold: true, color: { argb: "FFFFFFFF" } }; c.alignment = { horizontal: "center" }; c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: argb(warna.tua) } }; }
      const head = ws.getRow(7);
      kolom.forEach(([k, , info], i) => {
        const c = head.getCell(i + 1); c.value = k;
        const gi = grupInfo.findIndex((g) => i + 1 >= g.awal && i + 1 <= g.akhirKol);
        const hitung = info && (info.jenis === "akhir" || info.jenis === "rapor");
        c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: hitung ? "FF475569" : gi >= 0 ? argb(warnaGrup[gi % 4]) : argb(warna.tua) } };
        c.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 10 }; c.alignment = { horizontal: "center", vertical: "middle", wrapText: true }; c.border = garis;
      });
      head.height = 32;
      data.forEach(({ siswa, nilai }, idx) => {
        const rr = 8 + idx, r = ws.getRow(rr);
        const isi = { 1: siswa.id, 2: idx + 1, 3: siswa.nis || "", 4: siswa.nama };
        const kH = kolom.findIndex(([, , x]) => x && x.jenis === "hadir") + 1;
        if (kH) isi[kH] = hadir[siswa.id] ?? null;
        grupInfo.forEach((g) => {
          const n = lens(nilai, g.sub) || {};
          const ambil = (arr, k) => { const x = (arr || []).find((y) => y.nama === k); return x && Number(x.nilai) > 0 ? Number(x.nilai) : null; };
          g.uh.forEach((c) => { isi[c] = ambil(n.ulangan_harian, kolom[c - 1][0]); });
          g.tg.forEach((c) => { isi[c] = ambil(n.tugas, kolom[c - 1][0]); });
          if (g.uts) isi[g.uts] = ambil(n.uts, "UTS");
          isi[g.uas] = ambil(n.uas, "UAS") ?? (P.pola === "satu" ? (Number(n.uas?.[0]?.nilai) > 0 ? Number(n.uas[0].nilai) : null) : null);
          const L = _lgHuruf;
          isi[g.akhir] = { formula: _lgRumusAkhir(P, !!P.pakai.utsWajib, { r: rr, uh: g.uh.length ? [L(g.uh[0]), L(g.uh[g.uh.length - 1])] : null, tg: g.tg.length ? [L(g.tg[0]), L(g.tg[g.tg.length - 1])] : null, uts: g.uts ? L(g.uts) : null, uas: L(g.uas), hadir: kH ? L(kH) : null }) };
        });
        if (kolRapor) { const sel = grupInfo.map((g) => `N(${_lgHuruf(g.akhir)}${rr})`); isi[kolRapor] = { formula: `IFERROR(ROUND((${sel.join("+")})/(${sel.map((s) => `(${s}>0)`).join("+")}),1),"")` }; }
        isi[kolom.length] = nilai?.capaian_pembelajaran || "";
        for (let c = 1; c <= kolom.length; c++) {
          const cell = r.getCell(c); cell.value = isi[c] === undefined ? null : isi[c]; cell.border = garis; cell.font = { size: 10 };
          const info = kolom[c - 1][2];
          if (info && (info.jenis === "akhir" || info.jenis === "rapor")) { cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: info.jenis === "rapor" ? "FFDCE7E1" : "FFEEF1F4" } }; cell.font = { size: 10, bold: true }; cell.alignment = { horizontal: "center" }; }
          else if (info && ["uh", "tugas", "uts", "uas", "hadir"].includes(info.jenis)) {
            cell.alignment = { horizontal: "center" };
            if (info.jenis !== "hadir") cell.dataValidation = { type: "decimal", operator: "between", allowBlank: true, formulae: [0, _LG_MAKS], showErrorMessage: true, errorTitle: "Nilai tidak valid", error: "Isi angka 0 sampai 100" };
            else cell.font = { size: 10, color: { argb: "FF64748B" } };
          } else if (c === kolom.length) cell.alignment = { wrapText: true, vertical: "top" };
        }
      });
    }
    const buf = await wb.xlsx.writeBuffer();
    const blob = new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = `Leger_${_lgAman(namaMapel).replace(/[ /]/g, "_")}_${p.semester}_${String(p.tahun).replace("/", "-")}.xlsx`;
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    toast(`⬇️ Leger diunduh (${kelasIds.length} kelas${subs.length ? `, ${subs.join(" + ")} berdampingan` : ""}). Nilai akhir terhitung otomatis di Excel.`, "ok");
  } catch (e) { console.error(e); toast("Gagal membuat leger: " + (e.message || e), "err"); }
  finally { setGlobalLoading(false); }
}

// ── 2. UNGGAH: baca → pratinjau → simpan ─────────────────────
// Format versi 2: kolom dibaca dari peta di baris 5 (mapel gabungan berdampingan dalam satu lembar).
function _lgUraiV2(rows, nama, meta, p, rencana, cacheData, entri) {
  if (meta.mapel !== p.mapelId) { rencana.push({ lembar: nama, galat: [`Leger ini untuk mapel ${_lgNamaMapel(meta.mapel)}, sedangkan yang terpilih di layar ${_lgNamaMapel(p.mapelId)}. Pilih mapel yang sesuai dulu.`] }); return; }
  const { kelas: kelasId, mapel: mapelId, semester, tahun } = meta;
  const iHead = rows.findIndex((r) => r.some((c) => _lgNorm(c) === "nama siswa"));
  const kunciData = `${kelasId}|${mapelId}|${semester}|${tahun}`;
  const plan = { lembar: nama, kelasId, mapelId, semester, tahun, siswa: [], galat: [], baru: 0, ubah: 0, tidakCocok: 0, _tunda: true };
  plan._jalan = (data) => {
    const subs = [...new Set(meta.peta.map((x) => x.sub || null))];
    const KUNCI = { uh: "ulangan_harian", tugas: "tugas", uts: "uts", uas: "uas" };
    rows.slice(iHead + 1).forEach((r, k) => {
      const id = String(r[0] || "").trim(), namaSiswa = String(r[3] || "").trim();
      if (!id && !namaSiswa) return;
      const cocok = data.find((d) => d.siswa.id === id) || data.find((d) => _lgNorm(d.siswa.nama) === _lgNorm(namaSiswa));
      if (!cocok) { plan.tidakCocok++; plan.galat.push(`Baris ${iHead + k + 2}: "${namaSiswa || id}" tidak ditemukan di kelas ini`); return; }
      const sebelum = plan.baru + plan.ubah;
      const hasil = { ...(cocok.nilai || {}) };
      subs.forEach((sub) => {
        const lama = sub ? lensaSub(hasil, sub) : hasil;
        Object.entries(KUNCI).forEach(([jenis, kunci]) => {
          const kol = meta.peta.filter((x) => (x.sub || null) === sub && x.jenis === jenis);
          if (!kol.length) return;
          const petaN = new Map((lama[kunci] || []).map((x) => [x.nama, Number(x.nilai)]));
          kol.forEach((x) => {
            const v = _lgAngka(r[x.c - 1]);
            if (v === null) return;
            if (Number.isNaN(v) || v < 0 || v > _LG_MAKS) { plan.galat.push(`${cocok.siswa.nama} · ${sub ? sub + " " : ""}${x.nama}: "${r[x.c - 1]}" bukan angka 0–100 (dilewati)`); return; }
            if (!petaN.has(x.nama)) plan.baru++; else if (petaN.get(x.nama) !== v) plan.ubah++;
            petaN.set(x.nama, v);
          });
          const arr = [...petaN].map(([nm, nilai]) => ({ nama: nm, nilai }));
          hasil[kunci] = sub ? [...(hasil[kunci] || []).filter((x) => x && x.sub !== sub), ...arr.map((x) => ({ ...x, sub }))] : arr;
        });
      });
      let cp = hasil.capaian_pembelajaran || "";
      const sCP = String(r[(meta.cp || 0) - 1] || "").trim();
      if (sCP && sCP !== cp) { cp = sCP; plan.ubah++; }
      if (plan.baru + plan.ubah === sebelum) return;
      const row = { siswa_id: cocok.siswa.id, mapel_id: mapelId, kelas_id: kelasId, guru_id: p.guruId || hasil.guru_id || null, semester, tahun_ajaran: tahun,
        ulangan_harian: hasil.ulangan_harian || [], tugas: hasil.tugas || [], uts: hasil.uts || [], uas: hasil.uas || [], ada_uts: !!(hasil.ada_uts || (hasil.uts || []).some((x) => Number(x.nilai) > 0)),
        nilai_kehadiran: hasil.nilai_kehadiran ?? null, capaian_pembelajaran: cp, diisi_oleh: "guru (leger Excel)" };
      cocok.nilai = { ...hasil, ...row };
      const kunci = `${kunciData}|${cocok.siswa.id}`;
      if (entri.has(kunci)) entri.get(kunci).row = row;
      else { const e = { siswa_id: cocok.siswa.id, nama: cocok.siswa.nama, row }; entri.set(kunci, e); plan.siswa.push(e); }
    });
  };
  plan._kunciData = kunciData;
  rencana.push(plan);
}
const _lgAngka = (v) => {
  if (v === null || v === undefined || v === "") return null;
  if (typeof v === "object" && v && "result" in v) v = v.result; // sel rumus
  const n = typeof v === "number" ? v : Number(String(v).replace(",", ".").trim());
  return Number.isFinite(n) ? Math.round(n * 100) / 100 : NaN;
};
const _lgNorm = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

async function unggahLegerNilai(input) {
  const f = input.files && input.files[0]; input.value = "";
  if (!f) return;
  if (!window.XLSX) { toast("Pustaka Excel belum termuat", "err"); return; }
  setGlobalLoading(true, "Membaca leger…");
  try {
    const wb = XLSX.read(await f.arrayBuffer(), { type: "array" });
    const p = _lgPilihan();
    const rencana = [];
    const cacheData = {}, entri = new Map(); // data per kelas dibaca sekali; satu entri simpan per siswa walau ada beberapa lembar mapel
    const subsMapel = typeof subMapel === "function" ? subMapel(p.mapelId) : [];
    for (const nama of wb.SheetNames) {
      const rows = XLSX.utils.sheet_to_json(wb.Sheets[nama], { header: 1, defval: "", raw: true });
      // penanda kelas/mapel (baris 5) — bila tidak ada, pakai pilihan di layar
      let meta = null;
      const baris5 = rows.find((r) => String(r[0]).trim() === "LEGER-NILAI");
      if (baris5) try { meta = JSON.parse(baris5[1]); } catch (e) {}
      if (meta && meta.v === 2 && Array.isArray(meta.peta)) { _lgUraiV2(rows, nama, meta, p, rencana, cacheData, entri); continue; }
      const iHead = rows.findIndex((r) => r.some((c) => _lgNorm(c) === "nama siswa" || _lgNorm(c) === "nama"));
      if (iHead < 0) continue;
      const head = rows[iHead].map((c) => String(c || "").trim());
      const ix = (re) => head.findIndex((h) => re.test(_lgNorm(h)));
      const cId = head.findIndex((h) => _lgNorm(h) === "id"), cNama = ix(/^nama( siswa)?$/), cNis = ix(/^nis$/);
      const kolUH = head.map((h, i) => ({ h, i })).filter((x) => /^(ulangan harian|uh)\b/.test(_lgNorm(x.h)));
      const kolTG = head.map((h, i) => ({ h, i })).filter((x) => /^tugas\b/.test(_lgNorm(x.h)));
      const cUTS = ix(/^(uts|pts)$/), cUAS = ix(/^(uas|pas|sas)$/), cCP = ix(/^capaian/);
      const kelasId = meta?.kelas || (wb.SheetNames.length === 1 ? p.kelasId : (LOOKUP.kelas || []).find((k) => _lgNorm(nama).endsWith(_lgNorm(String(k.nama_kelas).replace(/^\s*kelas\s+/i, ""))))?.id);
      const mapelId = meta?.mapel || p.mapelId, semester = meta?.semester || p.semester, tahun = meta?.tahun || p.tahun;
      if (!kelasId || !mapelId) { rencana.push({ lembar: nama, galat: ["Kelas/mapel lembar ini tidak dikenali — gunakan file hasil tombol Unduh Leger"] }); continue; }
      if (meta && meta.mapel !== p.mapelId) { rencana.push({ lembar: nama, galat: [`Leger ini untuk mapel ${_lgNamaMapel(meta.mapel)}, sedangkan yang terpilih di layar ${_lgNamaMapel(p.mapelId)}. Pilih mapel yang sesuai dulu.`] }); continue; }
      // mapel gabungan: tentukan mapel (sub) lembar ini dari penanda, atau dari nama lembar
      const sub = meta?.sub || (subsMapel.length ? subsMapel.find((s) => _lgNorm(nama).includes(_lgNorm(s))) : null) || null;
      if (subsMapel.length && !sub) { rencana.push({ lembar: nama, galat: [`Mapel gabungan: lembar ini harus bernama/bertanda salah satu dari ${subsMapel.join(", ")} — gunakan file hasil tombol Unduh Leger`] }); continue; }
      const kunciData = `${kelasId}|${mapelId}|${semester}|${tahun}`;
      const data = cacheData[kunciData] || (cacheData[kunciData] = await apiGetNilaiRaporByKelasMapel(kelasId, mapelId, semester, tahun));
      const plan = { lembar: nama, kelasId, mapelId, semester, tahun, siswa: [], galat: [], baru: 0, ubah: 0, tidakCocok: 0 };
      rows.slice(iHead + 1).forEach((r, k) => {
        const id = cId >= 0 ? String(r[cId] || "").trim() : "";
        const namaSiswa = cNama >= 0 ? String(r[cNama] || "").trim() : "";
        if (!id && !namaSiswa) return;
        const cocok = data.find((d) => d.siswa.id === id) || data.find((d) => _lgNorm(d.siswa.nama) === _lgNorm(namaSiswa)) || (cNis >= 0 && r[cNis] ? data.find((d) => String(d.siswa.nis || "") === String(r[cNis]).trim()) : null);
        if (!cocok) { plan.tidakCocok++; plan.galat.push(`Baris ${iHead + k + 2}: "${namaSiswa || id}" tidak ditemukan di kelas ini`); return; }
        const nilaiPenuh = cocok.nilai || {};
        const lama = sub ? lensaSub(nilaiPenuh, sub) : nilaiPenuh;
        const sebelum = plan.baru + plan.ubah; // untuk tahu apakah siswa ini ada perubahan
        const gabung = (arrLama, kolom) => {
          const peta = new Map((arrLama || []).map((x) => [x.nama, Number(x.nilai)]));
          kolom.forEach(({ h, i }) => {
            const v = _lgAngka(r[i]);
            if (v === null) return;
            if (Number.isNaN(v) || v < 0 || v > _LG_MAKS) { plan.galat.push(`${cocok.siswa.nama} · ${h}: "${r[i]}" bukan angka 0–100 (dilewati)`); return; }
            if (!peta.has(h)) plan.baru++; else if (peta.get(h) !== v) plan.ubah++;
            peta.set(h, v);
          });
          return [...peta].map(([nama, nilai]) => ({ nama, nilai }));
        };
        const uh = gabung(lama.ulangan_harian, kolUH), tugas = gabung(lama.tugas, kolTG);
        const uts = cUTS >= 0 ? gabung(lama.uts, [{ h: "UTS", i: cUTS }]) : (lama.uts || []);
        const uas = cUAS >= 0 ? gabung(lama.uas, [{ h: "UAS", i: cUAS }]) : (lama.uas || []);
        let cp = lama.capaian_pembelajaran || "";
        if (cCP >= 0 && String(r[cCP] || "").trim() && String(r[cCP]).trim() !== cp) { cp = String(r[cCP]).trim(); plan.ubah++; }
        if (plan.baru + plan.ubah === sebelum) return; // tidak ada yang berubah → tidak perlu disimpan (hemat kuota)
        // mapel gabungan: isian mapel lain di baris yang sama tetap utuh, isian mapel ini diberi penanda sub
        const satukan = (k, arr) => (sub ? [...(nilaiPenuh[k] || []).filter((x) => x && x.sub !== sub), ...arr.map((x) => ({ ...x, sub }))] : arr);
        const row = {
          siswa_id: cocok.siswa.id, mapel_id: mapelId, kelas_id: kelasId, guru_id: p.guruId || nilaiPenuh.guru_id || null,
          semester, tahun_ajaran: tahun, ulangan_harian: satukan("ulangan_harian", uh), tugas: satukan("tugas", tugas), uts: satukan("uts", uts), uas: satukan("uas", uas),
          nilai_kehadiran: nilaiPenuh.nilai_kehadiran ?? null, capaian_pembelajaran: sub && typeof cpPasangSub === "function" ? cpPasangSub(nilaiPenuh.capaian_pembelajaran, sub, cp) : cp, diisi_oleh: "guru (leger Excel)",
        };
        row.ada_uts = !!(nilaiPenuh.ada_uts || row.uts.length);
        cocok.nilai = { ...nilaiPenuh, ...row }; // lembar mapel berikutnya membangun dari hasil ini
        const kunci = `${kunciData}|${cocok.siswa.id}`;
        if (entri.has(kunci)) entri.get(kunci).row = row; // siswa sama di lembar mapel lain → satu kali simpan, isi terbaru
        else { const e = { siswa_id: cocok.siswa.id, nama: cocok.siswa.nama, row }; entri.set(kunci, e); plan.siswa.push(e); }
      });
      rencana.push(plan);
    }
    for (const pl of rencana.filter((x) => x._tunda)) {
      const [kl, mp, sm, th] = pl._kunciData.split("|");
      const data = cacheData[pl._kunciData] || (cacheData[pl._kunciData] = await apiGetNilaiRaporByKelasMapel(kl, mp, sm, th));
      pl._jalan(data); delete pl._jalan; delete pl._tunda;
    }
    if (!rencana.length) { toast("Tidak ditemukan tabel nilai di file ini. Gunakan file dari tombol Unduh Leger.", "err"); return; }
    LEGER.rencana = rencana;
    _lgTampilPratinjau(rencana, f.name);
  } catch (e) { console.error(e); toast("Gagal membaca file: " + (e.message || e), "err"); }
  finally { setGlobalLoading(false); }
}

function _lgTampilPratinjau(rencana, namaFile) {
  const ok = rencana.filter((r) => r.siswa?.length);
  const tot = ok.reduce((a, r) => ({ s: a.s + r.siswa.length, b: a.b + r.baru, u: a.u + r.ubah }), { s: 0, b: 0, u: 0 });
  const galat = rencana.flatMap((r) => (r.galat || []).map((g) => `${r.lembar}: ${g}`));
  openModal(`
    <h3>📊 Pratinjau Leger</h3>
    <div style="font-size:11.5px;color:var(--text-secondary);margin:-8px 0 12px;">${escapeHtml(namaFile)}</div>
    <div class="lg-ringkas">
      <div><b>${ok.length}</b><small>kelas</small></div><div><b>${tot.s}</b><small>siswa</small></div>
      <div><b>${tot.b}</b><small>nilai baru</small></div><div><b>${tot.u}</b><small>nilai berubah</small></div>
    </div>
    <div style="max-height:34vh;overflow:auto;margin-top:10px;">
      ${rencana.map((r) => `<div class="lg-baris"><b>${escapeHtml(r.lembar)}</b><span>${r.siswa ? `${r.siswa.length} siswa berubah · ${r.baru} baru · ${r.ubah} diperbarui` : ""}${r.tidakCocok ? ` · <span style="color:var(--bad)">${r.tidakCocok} nama tidak cocok</span>` : ""}</span></div>`).join("")}
    </div>
    ${galat.length ? `<details style="margin-top:8px;" ${galat.length < 6 ? "open" : ""}><summary style="cursor:pointer;color:var(--bad);font-size:12px;font-weight:700;">⚠️ ${galat.length} catatan (dilewati, tidak disimpan)</summary><div style="font-size:11.5px;max-height:22vh;overflow:auto;margin-top:6px;">${galat.slice(0, 80).map((g) => `<div>• ${escapeHtml(g)}</div>`).join("")}</div></details>` : ""}
    <div style="font-size:11px;color:var(--text-secondary);margin-top:10px;">Sel kosong di Excel tidak menghapus nilai yang sudah ada di aplikasi.</div>
    <div style="display:flex;gap:8px;margin-top:12px;">
      <button class="btn btn-outline" style="flex:1;" onclick="closeModal()">Batal</button>
      <button class="btn btn-accent" style="flex:2;" ${tot.b + tot.u ? "" : "disabled"} onclick="simpanLegerNilai()">💾 Simpan ${tot.b + tot.u} nilai</button>
    </div>`);
}

async function simpanLegerNilai() {
  const rencana = (LEGER.rencana || []).filter((r) => r.siswa?.length);
  if (!rencana.length) return;
  closeModal();
  const total = rencana.reduce((a, r) => a + r.siswa.length, 0);
  let n = 0;
  setGlobalLoading(true, `Menyimpan nilai… 0/${total}`);
  try {
    for (const r of rencana) for (const s of r.siswa) {
      await apiSimpanNilaiRapor(s.row);
      n++; const lbl = document.getElementById("gl-label-text"); if (lbl) lbl.textContent = `Menyimpan nilai… ${n}/${total}`; // hanya ganti teks (setGlobalLoading memakai penghitung)
    }
    toast(`✅ Leger tersimpan: ${n} siswa di ${rencana.length} kelas`, "ok");
    LEGER.rencana = null;
    if (typeof NILAI_STATE !== "undefined") NILAI_STATE.dirty = false;
    // tampilkan kelas pertama yang diunggah di tabel
    const k = qs("nl-kelas"); if (k && [...k.options].some((o) => o.value === rencana[0].kelasId)) k.value = rencana[0].kelasId;
    await renderInputNilai();
  } catch (e) { console.error(e); toast(`Berhenti di ${n}/${total}: ${e.message || e}`, "err"); }
  finally { setGlobalLoading(false); }
}

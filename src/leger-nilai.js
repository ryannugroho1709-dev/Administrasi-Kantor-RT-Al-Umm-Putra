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

// ── 1. UNDUH ─────────────────────────────────────────────────
async function unduhLegerNilai() {
  const p = _lgPilihan();
  if (!p.mapelId) { toast("Pilih mapel dulu", "err"); return; }
  if (!window.ExcelJS) { toast("Pustaka Excel belum termuat, coba muat ulang halaman", "err"); return; }
  setGlobalLoading(true, "Menyiapkan leger Excel…");
  try {
    const kelasIds = await _lgDaftarKelas(p);
    if (!kelasIds.length) { toast("Pilih kelas dulu", "err"); return; }
    const wb = new ExcelJS.Workbook();
    wb.creator = "Aplikasi PKBM Al Umm Barabai";
    const warna = typeof _warnaDok === "function" ? _warnaDok() : { tua: "#0b3b33", utama: "#0d5c4b" };
    const argb = (hex) => "FF" + String(hex || "#0d5c4b").replace("#", "").toUpperCase();
    const p2 = STATE.pengaturan || {};
    for (const kelasId of kelasIds) {
      const data = await apiGetNilaiRaporByKelasMapel(kelasId, p.mapelId, p.semester, p.tahun);
      // kolom yang sudah dipakai + kolom kosong cadangan supaya guru tinggal mengisi
      const uh = new Set(), tg = new Set(); let adaUts = false;
      data.forEach(({ nilai }) => { (nilai?.ulangan_harian || []).forEach((x) => uh.add(x.nama)); (nilai?.tugas || []).forEach((x) => tg.add(x.nama)); if (nilai?.ada_uts) adaUts = true; });
      for (let i = 1; uh.size < 4; i++) uh.add(`Ulangan Harian ${i}`);
      for (let i = 1; tg.size < 3; i++) tg.add(`Tugas ${i}`);
      const kolomUH = [...uh], kolomTG = [...tg];
      const kolom = [["ID", 1], ["No", 5], ["NIS", 12], ["Nama Siswa", 32], ...kolomUH.map((k) => [k, 11]), ...kolomTG.map((k) => [k, 10]), ["UTS", 9], ["UAS", 9], ["Capaian Pembelajaran", 46]];
      const ws = wb.addWorksheet(_lgAman("Kelas " + String(_lgNamaKelas(kelasId)).replace(/^\s*kelas\s+/i, "")).slice(0, 31) || "Kelas", {
        views: [{ state: "frozen", xSplit: 4, ySplit: 7 }], pageSetup: { paperSize: 9, orientation: "landscape", fitToPage: true, fitToWidth: 1, fitToHeight: 0 },
      });
      ws.columns = kolom.map(([, w]) => ({ width: w }));
      ws.getColumn(1).hidden = true; // ID siswa — jangan diubah
      const akhir = kolom.length;
      const judul = (r, teks, ukuran, tebal) => { ws.mergeCells(r, 2, r, akhir); const c = ws.getCell(r, 2); c.value = teks; c.font = { bold: !!tebal, size: ukuran, color: { argb: tebal ? argb(warna.tua) : "FF444444" } }; };
      judul(1, `LEGER NILAI ${String(_lgNamaMapel(p.mapelId)).toUpperCase()}`, 14, true);
      judul(2, `${p2.nama_lembaga_kop || "PKBM Al Umm Barabai"} · Kelas ${String(_lgNamaKelas(kelasId)).replace(/^\s*kelas\s+/i, "")} · Semester ${p.semester} ${p.tahun}`, 11, false);
      judul(3, `Guru: ${_lgNamaGuru(p.guruId)}`, 11, false);
      judul(4, "Petunjuk: isi angka 0–100. Kolom kosong = tidak mengubah nilai di aplikasi. Boleh menambah kolom (judul diawali \"Ulangan Harian\" atau \"Tugas\"). Jangan mengubah urutan baris nama, judul kolom, atau isi baris 5.", 9, false);
      ws.getRow(4).height = 28; ws.getCell(4, 2).alignment = { wrapText: true, vertical: "top" };
      // baris 5: penanda (tersembunyi) untuk pencocokan saat diunggah
      ws.getCell(5, 1).value = "LEGER-NILAI";
      ws.getCell(5, 2).value = JSON.stringify({ v: 1, kelas: kelasId, mapel: p.mapelId, semester: p.semester, tahun: p.tahun });
      ws.getRow(5).hidden = true;
      const head = ws.getRow(7);
      kolom.forEach(([k], i) => {
        const c = head.getCell(i + 1); c.value = k;
        const grup = i < 4 ? warna.tua : kolomUH.includes(k) ? "#1d4ed8" : kolomTG.includes(k) ? "#7c3aed" : k === "UTS" || k === "UAS" ? "#b45309" : warna.utama;
        c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: argb(grup) } };
        c.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 10 };
        c.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
        c.border = { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } };
      });
      head.height = 30;
      ws.getRow(6).getCell(2).value = "";
      data.forEach(({ siswa, nilai }, idx) => {
        const r = ws.getRow(8 + idx);
        const ambil = (arr, k) => { const x = (arr || []).find((y) => y.nama === k); return x && x.nilai !== "" && x.nilai != null ? Number(x.nilai) : null; };
        const nilaiBaris = [siswa.id, idx + 1, siswa.nis || "", siswa.nama,
          ...kolomUH.map((k) => ambil(nilai?.ulangan_harian, k)), ...kolomTG.map((k) => ambil(nilai?.tugas, k)),
          adaUts ? ambil(nilai?.uts, "UTS") : null, ambil(nilai?.uas, "UAS"), nilai?.capaian_pembelajaran || ""];
        nilaiBaris.forEach((v, i) => {
          const c = r.getCell(i + 1); c.value = v === null ? null : v;
          c.border = { top: { style: "thin", color: { argb: "FFCCCCCC" } }, bottom: { style: "thin", color: { argb: "FFCCCCCC" } }, left: { style: "thin", color: { argb: "FFCCCCCC" } }, right: { style: "thin", color: { argb: "FFCCCCCC" } } };
          c.font = { size: 10 };
          if (i >= 4 && i < akhir - 1) {
            c.alignment = { horizontal: "center" };
            c.dataValidation = { type: "decimal", operator: "between", allowBlank: true, formulae: [0, _LG_MAKS], showErrorMessage: true, errorTitle: "Nilai tidak valid", error: "Isi angka 0 sampai 100" };
          } else if (i === akhir - 1) c.alignment = { wrapText: true, vertical: "top" };
        });
        if (idx % 2) for (let i = 2; i <= akhir; i++) r.getCell(i).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF6F8F7" } };
      });
    }
    const buf = await wb.xlsx.writeBuffer();
    const blob = new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `Leger_${_lgAman(_lgNamaMapel(p.mapelId)).replace(/ /g, "_")}_${p.semester}_${String(p.tahun).replace("/", "-")}.xlsx`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    toast(`⬇️ Leger diunduh (${kelasIds.length} kelas). Isi di Excel lalu tekan "Unggah Leger".`, "ok");
  } catch (e) { console.error(e); toast("Gagal membuat leger: " + (e.message || e), "err"); }
  finally { setGlobalLoading(false); }
}

// ── 2. UNGGAH: baca → pratinjau → simpan ─────────────────────
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
    for (const nama of wb.SheetNames) {
      const rows = XLSX.utils.sheet_to_json(wb.Sheets[nama], { header: 1, defval: "", raw: true });
      // penanda kelas/mapel (baris 5) — bila tidak ada, pakai pilihan di layar
      let meta = null;
      const baris5 = rows.find((r) => String(r[0]).trim() === "LEGER-NILAI");
      if (baris5) try { meta = JSON.parse(baris5[1]); } catch (e) {}
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
      const data = await apiGetNilaiRaporByKelasMapel(kelasId, mapelId, semester, tahun);
      const plan = { lembar: nama, kelasId, mapelId, semester, tahun, siswa: [], galat: [], baru: 0, ubah: 0, tidakCocok: 0 };
      rows.slice(iHead + 1).forEach((r, k) => {
        const id = cId >= 0 ? String(r[cId] || "").trim() : "";
        const namaSiswa = cNama >= 0 ? String(r[cNama] || "").trim() : "";
        if (!id && !namaSiswa) return;
        const cocok = data.find((d) => d.siswa.id === id) || data.find((d) => _lgNorm(d.siswa.nama) === _lgNorm(namaSiswa)) || (cNis >= 0 && r[cNis] ? data.find((d) => String(d.siswa.nis || "") === String(r[cNis]).trim()) : null);
        if (!cocok) { plan.tidakCocok++; plan.galat.push(`Baris ${iHead + k + 2}: "${namaSiswa || id}" tidak ditemukan di kelas ini`); return; }
        const lama = cocok.nilai || {};
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
        plan.siswa.push({
          siswa_id: cocok.siswa.id, nama: cocok.siswa.nama,
          row: {
            siswa_id: cocok.siswa.id, mapel_id: mapelId, kelas_id: kelasId, guru_id: p.guruId || lama.guru_id || null,
            semester, tahun_ajaran: tahun, ulangan_harian: uh, tugas, ada_uts: !!(lama.ada_uts || uts.length), uts, uas,
            nilai_kehadiran: lama.nilai_kehadiran ?? null, capaian_pembelajaran: cp, diisi_oleh: "guru (leger Excel)",
          },
        });
      });
      rencana.push(plan);
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

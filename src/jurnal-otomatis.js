// ============================================================
//  ⚡ JURNAL OTOMATIS — satu klik mengisi form Jurnal Kelas (guru tetap memeriksa lalu Simpan)
//  Materi  : ujian/latihan hari ini + presentasi Modul Ajar hari ini → penanda pertemuan berikutnya
//            di buku Modul Ajar → "Lanjutan: <materi jurnal terakhir>".
//  Metode  : kebiasaan guru di kelas & mapel ini (10 jurnal terakhir), + Ulangan/Penugasan kalau
//            hari ini ada ujian/latihan.
//  Absensi : semua Hadir, kecuali santri yang sudah tercatat izin/sakit di jurnal jam sebelumnya
//            pada kelas yang sama hari ini.
// ============================================================
function _pasangTombolJurnalOtomatis(ctx) {
  const info = qs("modal-panel")?.querySelector("h3")?.nextElementSibling;
  if (!info || qs("btn-jurnal-otomatis")) return;
  const btn = document.createElement("button");
  btn.type = "button"; btn.id = "btn-jurnal-otomatis"; btn.className = "btn btn-accent";
  btn.style.cssText = "width:100%;margin:-4px 0 6px;";
  btn.textContent = "⚡ Isi jurnal otomatis";
  btn.onclick = () => isiJurnalOtomatis(ctx, btn);
  const ket = document.createElement("div");
  ket.id = "jurnal-otomatis-ket";
  ket.style.cssText = "font-size:11px;color:var(--text-secondary);line-height:1.6;margin-bottom:12px;";
  ket.textContent = "Mengisi materi, metode, dan absensi dari presentasi, modul, ujian, dan kebiasaan Anda.";
  info.insertAdjacentElement("afterend", btn);
  btn.insertAdjacentElement("afterend", ket);
  // absen santri yang sudah diisi saat presentasi → langsung dipasang ke tabel absensi
  const cepat = typeof _paStatusAbsenCepat === "function" ? _paStatusAbsenCepat(ctx.jadwalId, ctx.tanggal || tanggalISO()) : null;
  if (cepat) {
    let tdk = 0;
    Object.entries(cepat).forEach(([id, st]) => { const r = document.querySelector(`input[name="st-${id}"][value="${st}"]`); if (r) { r.checked = true; if (st !== "hadir") tdk++; } });
    ket.innerHTML = `📋 <b>Absen dari presentasi sudah dipasang</b>${tdk ? ` (${tdk} tidak hadir)` : " (semua hadir)"}. Tekan ⚡ untuk melengkapi materi & metode.`;
  }
}

const _joAman = (p) => Promise.resolve(p).then((r) => (r && !r.error ? r.data || [] : []), () => []);
const _joNorm = (s) => String(s || "").toLowerCase().replace(/\s+/g, " ").trim();

async function isiJurnalOtomatis(ctx, btn) {
  const { sesiId, kelasId, mapelId } = ctx;
  const tgl = ctx.tanggal || tanggalISO();
  btn.disabled = true; btn.textContent = "⏳ Menyusun jurnal…";
  const [riwayat, hariIni, ujianHariIni, modul] = await Promise.all([
    _joAman(supa.from("jurnal_kelas").select("materi_pokok,metode_mengajar,tanggal,kelas_id,mapel_id,sesi_id").eq("guru_id", STATE.guruId).lte("tanggal", tgl).order("tanggal", { ascending: false }).limit(40)),
    _joAman(supa.from("jurnal_kelas").select("sesi_id,absensi_siswa(siswa_id,status)").eq("kelas_id", kelasId).eq("tanggal", tgl)),
    _joAman(supa.from("ujian_sesi").select("mode,bank:ujian_bank(judul,bab,mapel_id)").eq("kelas_id", kelasId).gte("created_at", `${tgl}T00:00:00+08:00`).lte("created_at", `${tgl}T23:59:59+08:00`)),
    _joAman(supa.from("modul_ajar").select("judul,file_url").eq("kelas_id", kelasId).eq("mapel_id", mapelId)),
  ]);
  if (!qs("jurnal-materi")) return; // form sudah ditutup
  const lalu = riwayat.filter((j) => j.kelas_id === kelasId && j.mapel_id === mapelId && j.sesi_id !== sesiId);
  const sumber = [];

  // ── Materi ──
  const bagian = [];
  const ujian = ujianHariIni.filter((u) => u.bank && u.bank.mapel_id === mapelId);
  // satu baris per bank soal; kalau hari ini ada ujian & latihan dari bank yang sama, cukup "Ujian"
  [...new Set(ujian.map((u) => u.bank.judul))].forEach((judul) => bagian.push(`${ujian.some((u) => u.bank.judul === judul && u.mode === "ujian") ? "Ujian" : "Latihan soal"} ${judul}`));
  if (ujian.length) sumber.push("ujian/latihan hari ini");

  let inti = "";
  try {
    const log = JSON.parse(localStorage.getItem("maPresentasi") || "[]");
    const p = log.find((x) => x.kelas_id === kelasId && x.mapel_id === mapelId && tanggalISO(new Date(x.t)) === tgl);
    if (p) { inti = `${p.judul}${p.sampai > 1 ? ` (hal. ${p.dari}${p.sampai !== p.dari ? "–" + p.sampai : ""})` : ""}`; sumber.push("presentasi Modul Ajar"); }
  } catch (e) {}
  if (!inti && modul.length && typeof _maMuatMeta === "function") {
    // penanda pertemuan pertama di buku yang belum pernah muncul di jurnal kelas & mapel ini
    for (const m of modul) {
      const meta = await _maMuatMeta(m.file_url);
      const tanda = (meta && meta.tanda) || [];
      const belum = tanda.find((t) => t.judul && !lalu.some((j) => _joNorm(j.materi_pokok).includes(_joNorm(t.judul))));
      if (belum) { inti = belum.judul; sumber.push(`penanda berikutnya di buku "${m.judul}"`); break; }
    }
  }
  // lanjutan dari jurnal terakhir yang berisi materi (jurnal ujian/ulangan dilewati)
  const materiLalu = lalu.find((j) => j.materi_pokok && !/^(ujian|ulangan|latihan soal|uh|uts|uas|pts|pas)\b/i.test(j.materi_pokok.replace(/^lanjutan:\s*/i, "")));
  if (!inti && !ujian.length && materiLalu) {
    inti = (/^lanjutan/i.test(materiLalu.materi_pokok) ? "" : "Lanjutan: ") + materiLalu.materi_pokok;
    sumber.push(`lanjutan jurnal ${typeof _tglPendek === "function" ? _tglPendek(materiLalu.tanggal) : materiLalu.tanggal}`);
  }
  if (inti) bagian.push(inti);
  const ta = qs("jurnal-materi");
  let materiDiisi = false;
  if (bagian.length && !ta.value.trim()) { ta.value = bagian.join("; "); materiDiisi = true; }

  // ── Metode ──
  const contoh = (lalu.length >= 2 ? lalu : riwayat).slice(0, 10);
  const hitung = {};
  contoh.forEach((j) => [...new Set((j.metode_mengajar || []).map(_bersihkanLabelMetode))].forEach((m) => { hitung[m] = (hitung[m] || 0) + 1; }));
  let metode = Object.entries(hitung).filter(([m]) => DAFTAR_METODE.includes(m)).sort((a, b) => b[1] - a[1])
    .filter(([, n], i) => i === 0 || n >= Math.max(2, contoh.length * 0.4)).slice(0, 3).map(([m]) => m);
  if (metode.length) sumber.push("metode kebiasaan Anda");
  else metode = ["Ceramah", "Tanya Jawab"].filter((m) => DAFTAR_METODE.includes(m));
  if (ujian.some((u) => u.mode === "ujian") && DAFTAR_METODE.includes("Ulangan")) metode.push("Ulangan");
  if (ujian.some((u) => u.mode === "latihan") && DAFTAR_METODE.includes("Penugasan")) metode.push("Penugasan");
  let metodeBaru = 0;
  [...new Set(metode)].forEach((m) => {
    const cb = qsa("#metode-panel input").find((x) => x.value === m);
    if (cb && !cb.checked) { cb.checked = true; onToggleMetode(m, true); metodeBaru++; }
  });

  // ── Absensi ──
  const status = {};
  const cepat = typeof _paStatusAbsenCepat === "function" ? _paStatusAbsenCepat(ctx.jadwalId, tgl) : null;
  hariIni.filter((j) => j.sesi_id !== sesiId).forEach((j) => (j.absensi_siswa || []).forEach((a) => {
    if (a.status === "izin" || a.status === "sakit") status[a.siswa_id] = a.status;
  }));
  let ditandai = 0;
  (JURNAL_CTX?.siswa || []).forEach((s) => {
    const st = (cepat && cepat[s.id]) || status[s.id] || "hadir";
    const r = document.querySelector(`input[name="st-${s.id}"][value="${st}"]`);
    if (r) { r.checked = true; if (st !== "hadir") ditandai++; }
  });
  if (cepat) sumber.push(`absen santri dari presentasi${ditandai ? ` (${ditandai} tidak hadir)` : ""}`);
  else if (ditandai) sumber.push(`${ditandai} santri izin/sakit dari jam sebelumnya`);

  btn.disabled = false; btn.textContent = "✅ Terisi otomatis — periksa, lalu Simpan";
  const ket = qs("jurnal-otomatis-ket");
  if (ket) ket.innerHTML = `Diambil dari: ${sumber.length ? sumber.map(escapeHtml).join(", ") : "pengaturan bawaan"}.${!materiDiisi && ta.value.trim() ? " Materi yang sudah Anda ketik tidak diubah." : ""}${!bagian.length ? " <b>Materi belum ditemukan — silakan ketik.</b>" : ""}`;
  qsa(".btn.btn-ghost", qs("modal-panel")).filter((b) => /^(↺ Lanjutan|🖥️ Dari presentasi)/.test(b.textContent)).forEach((b) => { if (materiDiisi) b.remove(); });
  if (!bagian.length) ta.focus();
}

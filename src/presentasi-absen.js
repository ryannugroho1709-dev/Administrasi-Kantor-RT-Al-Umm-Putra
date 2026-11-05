// ============================================================
//  ABSEN SANTRI ➜ PRESENTASI ➜ JURNAL (alur satu kelas)
//  1) Tekan 🖥️ Presentasi → kalau hari ini ada jadwal mapel itu & jurnalnya belum diisi,
//     muncul absen cepat (semua Hadir; ketuk santri yang izin/sakit/alpa). Disimpan di perangkat.
//  2) Presentasi seperti biasa.
//  3) Tutup presentasi → tawaran "Isi jurnal sekarang": form jurnal terbuka dan ⚡ isi otomatis
//     (absensi dari langkah 1, materi dari halaman/penanda yang dipresentasikan, metode kebiasaan).
//  Absen cepat baru tersimpan ke database saat jurnal disimpan (alur & data jurnal tidak berubah).
// ============================================================
const PA_ST = [["hadir", "H", "Hadir"], ["izin", "I", "Izin"], ["sakit", "S", "Sakit"], ["alpha", "A", "Alpa"]];
const _paKunci = (jadwalId, tgl) => `absenCepat:${jadwalId}:${tgl || tanggalISO()}`;
function _paBaca(jadwalId, tgl) { try { return JSON.parse(localStorage.getItem(_paKunci(jadwalId, tgl)) || "null"); } catch (e) { return null; } }

// Jadwal hari ini yang cocok dengan buku (mapel sama; kelas sama bila buku punya kelas). Paling dekat jamnya.
function _paJadwalUntukBuku(m) {
  const daftar = (STATE.jadwalHariIni || []).filter((j) => j.mapel_id === m.mapel_id && (!m.kelas_id || j.kelas_id === m.kelas_id));
  if (!daftar.length) return null;
  const now = new Date(), menit = now.getHours() * 60 + now.getMinutes();
  const jarak = (j) => { const [h, mm] = String(j.jam_mulai || "00:00").split(":").map(Number); return Math.abs(h * 60 + mm - menit); };
  return daftar.sort((a, b) => jarak(a) - jarak(b))[0];
}
const _paSesi = (j) => (typeof sesiUntukJadwal === "function" ? sesiUntukJadwal(j.id) : null);

// ── 1) Bungkus pembuka presentasi ──
const _paBukaAsli = bukaModulAjar;
bukaModulAjar = function (id, mode, lewatiAbsen) {
  const m = (MODUL_AJAR_BUKU_CACHE || []).find((x) => x.id === id);
  const j = m && mode === "presentasi" && !lewatiAbsen ? _paJadwalUntukBuku(m) : null;
  const sesi = j ? _paSesi(j) : null;
  if (!j || (sesi && sesi.jurnal_id)) return _paBukaAsli(id, mode); // tidak ada jadwal / jurnal sudah diisi
  _paAbsenModal(m, j);
};

async function _paAbsenModal(m, j) {
  openModal(`<div id="pa-absen">${loadingHTML("Memuat daftar santri…")}</div>`);
  let siswa = [], dariTadi = {};
  try {
    siswa = await apiGetSiswaByKelas(j.kelas_id);
    // santri yang sudah tercatat izin/sakit di jam sebelumnya (kelas sama, hari ini) ikut ditandai
    const r = await supa.from("jurnal_kelas").select("absensi_siswa(siswa_id,status)").eq("kelas_id", j.kelas_id).eq("tanggal", tanggalISO());
    (r.data || []).forEach((x) => (x.absensi_siswa || []).forEach((a) => { if (a.status === "izin" || a.status === "sakit") dariTadi[a.siswa_id] = a.status; }));
  } catch (e) { console.error(e); }
  if (!siswa.length) { closeModal(); _paBukaAsli(m.id, "presentasi"); return; }
  const lama = _paBaca(j.id), status = { ...(lama && lama.status) };
  siswa.forEach((s) => { status[s.id] = status[s.id] || dariTadi[s.id] || "hadir"; });
  const el = qs("pa-absen"); if (!el) return;
  const gambar = () => {
    const hit = (st) => siswa.filter((s) => status[s.id] === st).length;
    el.innerHTML = `
      <h3 style="margin-bottom:2px">📋 Absen santri dulu</h3>
      <div style="font-size:12px;color:var(--text-secondary);margin-bottom:10px">${escapeHtml(j.mapel?.nama_mapel || m.mapel?.nama_mapel || "")} · ${escapeHtml(j.kelas?.nama_kelas || "")} · ${String(j.jam_mulai || "").slice(0, 5)}–${String(j.jam_selesai || "").slice(0, 5)}<br>Semua sudah <b>Hadir</b>; ketuk huruf untuk santri yang izin, sakit, atau alpa.</div>
      <div class="pa-ringkas">${PA_ST.map(([k, h, n]) => `<span class="pa-${k}"><b>${hit(k)}</b> ${n}</span>`).join("")}</div>
      <div class="pa-daftar">${siswa.map((s, i) => `<div class="pa-baris ${status[s.id] !== "hadir" ? "beda" : ""}"><span class="pa-nama">${i + 1}. ${escapeHtml(s.nama)}${dariTadi[s.id] ? ` <i>· jam sebelumnya ${dariTadi[s.id]}</i>` : ""}</span>
        <span class="pa-pilih">${PA_ST.map(([k, h, n]) => `<button type="button" title="${n}" class="pa-${k} ${status[s.id] === k ? "on" : ""}" data-s="${s.id}" data-k="${k}">${h}</button>`).join("")}</span></div>`).join("")}</div>
      <div style="display:flex;gap:8px;margin-top:12px">
        <button class="btn btn-outline" style="flex:1" id="pa-lewati">Lewati</button>
        <button class="btn btn-accent" style="flex:2" id="pa-mulai">✅ Simpan & mulai presentasi</button></div>`;
    el.querySelectorAll(".pa-pilih button").forEach((b) => b.onclick = () => { status[b.dataset.s] = b.dataset.k; gambar(); });
    qs("pa-lewati").onclick = () => { closeModal(); _paBukaAsli(m.id, "presentasi"); };
    qs("pa-mulai").onclick = () => {
      try { localStorage.setItem(_paKunci(j.id), JSON.stringify({ kelas_id: j.kelas_id, mapel_id: j.mapel_id, status, t: Date.now() })); } catch (e) {}
      const tdk = siswa.length - hit("hadir");
      toast(`📋 Absen tersimpan: ${hit("hadir")} hadir${tdk ? `, ${tdk} tidak hadir` : ""}`, "ok");
      closeModal(); _paBukaAsli(m.id, "presentasi");
    };
  };
  gambar();
}

// ── 3) Setelah presentasi: tawarkan isi jurnal ──
const _paTutupAsli = _mvTutup;
_mvTutup = function () {
  const ada = document.getElementById("mv"), m = MV.m, pres = MV.pernahPresentasi, lama = Date.now() - (MV.mulai || Date.now());
  _paTutupAsli();
  if (!ada || !m || !pres || lama < 120000) return;
  const j = _paJadwalUntukBuku(m); if (!j) return;
  const sesi = _paSesi(j); if (sesi && sesi.jurnal_id) return;
  setTimeout(() => _paTawarJurnal(m, j, sesi), 300);
};
function _paTawarJurnal(m, j, sesi) {
  const absen = _paBaca(j.id), log = (() => { try { return JSON.parse(localStorage.getItem("maPresentasi") || "[]")[0]; } catch (e) { return null; } })();
  const hadir = absen ? Object.values(absen.status).filter((s) => s === "hadir").length : null, total = absen ? Object.keys(absen.status).length : null;
  const bisa = sesi && sesi.jam_masuk;
  openModal(`<h3>📝 Isi jurnal sekarang?</h3>
    <div style="font-size:12.5px;color:var(--text-secondary);margin-bottom:12px">${escapeHtml(j.mapel?.nama_mapel || "")} · ${escapeHtml(j.kelas?.nama_kelas || "")}</div>
    <div class="pa-ringkas-jurnal">
      <div>📖 <b>Materi</b><span>${escapeHtml(log ? `${log.judul}${log.sampai > 1 ? ` (hal. ${log.dari}–${log.sampai})` : ""}` : m.judul || "-")}</span></div>
      <div>📋 <b>Absensi</b><span>${absen ? `${hadir} dari ${total} hadir` : "belum diabsen — semua dianggap hadir"}</span></div>
      <div>🎯 <b>Metode</b><span>mengikuti kebiasaan Anda</span></div>
    </div>
    ${bisa ? `<button class="btn btn-accent" style="width:100%;margin-top:12px" id="pa-isi">⚡ Buka jurnal & isi otomatis</button>`
      : `<div style="font-size:12px;background:rgba(234,122,26,.1);color:#9a4a00;border-radius:10px;padding:9px 11px;margin-top:12px;line-height:1.55">⏰ Anda belum <b>absen masuk</b> untuk jam ini. Absensi santri & materi sudah tersimpan — setelah absen masuk, buka Jurnal lalu tekan <b>⚡ Isi jurnal otomatis</b>.</div>
         <button class="btn btn-accent" style="width:100%;margin-top:10px" onclick="closeModal();showPage('absensi-guru','page-absensi-guru','menuAbsensiGuru')">🕒 Ke Absensi Guru</button>`}
    <button class="btn btn-outline" style="width:100%;margin-top:8px" onclick="closeModal()">Nanti saja</button>`);
  const b = qs("pa-isi");
  if (b) b.onclick = async () => {
    closeModal();
    await openJurnalForm(j.id);
    for (let i = 0; i < 20 && !qs("btn-jurnal-otomatis"); i++) await new Promise((r) => setTimeout(r, 100));
    qs("btn-jurnal-otomatis")?.click();
  };
}

// Draf absen cepat lebih dari 3 hari dibuang (yang sudah masuk jurnal tidak diperlukan lagi)
(function _paBersihkan() {
  try {
    const batas = Date.now() - 3 * 864e5;
    Object.keys(localStorage).filter((k) => k.startsWith("absenCepat:")).forEach((k) => {
      const v = JSON.parse(localStorage.getItem(k) || "null"); if (!v || !v.t || v.t < batas) localStorage.removeItem(k);
    });
  } catch (e) {}
})();

// Dipakai form jurnal: status absen cepat untuk jadwal ini (atau null)
function _paStatusAbsenCepat(jadwalId, tanggal) { const r = jadwalId ? _paBaca(jadwalId, tanggal) : null; return r ? r.status : null; }

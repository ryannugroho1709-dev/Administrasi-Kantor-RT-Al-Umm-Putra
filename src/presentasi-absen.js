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
const _paJam = (j) => `${String(j.jam_mulai || "").slice(0, 5)}–${String(j.jam_selesai || "").slice(0, 5)}`;
// Keadaan absen masuk guru: "sudah" | "bisa" (jendela absen masuk masih buka) | "awal" | "lewat"
function _paKeadaanMasuk(j) {
  const sesi = _paSesi(j);
  if (sesi && sesi.jam_masuk) return { k: "sudah" };
  const cek = typeof cekJendelaAbsenMasuk === "function" ? cekJendelaAbsenMasuk(j) : { ok: true };
  if (cek.ok) return { k: "bisa" };
  return { k: /baru bisa/i.test(cek.pesan || "") ? "awal" : "lewat", pesan: cek.pesan };
}
const _paSesiSelesai = (j) => (typeof _sesiSudahLewat === "function" ? _sesiSudahLewat(tanggalISO(), j.jam_selesai) : false);
// Ajukan Hadir langsung dari sini (sesi yang sudah lewat & lupa absen masuk) → form ⚡ terisi otomatis
async function _paAjukanHadir(j) {
  const sesi = _paSesi(j);
  closeModal();
  await ajukanHadirGuru(sesi ? sesi.id : "", STATE.guruId, j.id, j.kelas_id, j.mapel_id, tanggalISO(), `${j.mapel?.nama_mapel || ""} ${j.kelas?.nama_kelas || ""}`);
  for (let i = 0; i < 20 && !qs("btn-jurnal-otomatis"); i++) await new Promise((r) => setTimeout(r, 100));
  qs("btn-jurnal-otomatis")?.click();
}
async function _paAbsenMasukLaluJurnal(j) {
  closeModal();
  await handleAbsenMasuk(j.id);
  const sesi = _paSesi(j);
  if (!sesi || !sesi.jam_masuk) return; // gagal (di luar radius / GPS) — pesan sudah tampil dari handleAbsenMasuk
  if (typeof cekJendelaAbsenPulang === "function" && cekJendelaAbsenPulang(j).awal) {
    toast("✅ Absen masuk tercatat. Jurnal bisa diisi menjelang jam pelajaran selesai — absen santri & materi sudah tersimpan.", "ok");
    return;
  }
  await openJurnalForm(j.id);
  for (let i = 0; i < 20 && !qs("btn-jurnal-otomatis"); i++) await new Promise((r) => setTimeout(r, 100));
  qs("btn-jurnal-otomatis")?.click();
}

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
      ${(() => {
        const km = _paKeadaanMasuk(j);
        if (km.k === "sudah") return "";
        if (km.k === "bisa") return `<div class="pa-peringatan">⏰ <span>Anda <b>belum absen masuk</b> untuk jam ini.</span><button type="button" id="pa-masuk">✅ Absen masuk sekarang</button></div>`;
        if (km.k === "awal") return `<div class="pa-peringatan biru">🕒 <span>${escapeHtml(km.pesan)} Absen santri tetap bisa diisi sekarang.</span></div>`;
        return `<div class="pa-peringatan">⏰ <span>Batas absen masuk jam ini sudah lewat. Tidak apa-apa — lanjutkan absen santri & presentasi. Setelah jam pelajaran selesai, gunakan <b>📝 Ajukan Hadir</b>: jurnal, absen santri & bukti presentasi terisi otomatis.</span></div>`;
      })()}
      <div class="pa-ringkas">${PA_ST.map(([k, h, n]) => `<span class="pa-${k}"><b>${hit(k)}</b> ${n}</span>`).join("")}</div>
      <div class="pa-daftar">${siswa.map((s, i) => `<div class="pa-baris ${status[s.id] !== "hadir" ? "beda" : ""}"><span class="pa-nama">${i + 1}. ${escapeHtml(s.nama)}${dariTadi[s.id] ? ` <i>· jam sebelumnya ${dariTadi[s.id]}</i>` : ""}</span>
        <span class="pa-pilih">${PA_ST.map(([k, h, n]) => `<button type="button" title="${n}" class="pa-${k} ${status[s.id] === k ? "on" : ""}" data-s="${s.id}" data-k="${k}">${h}</button>`).join("")}</span></div>`).join("")}</div>
      <div style="display:flex;gap:8px;margin-top:12px">
        <button class="btn btn-outline" style="flex:1" id="pa-lewati">Lewati</button>
        <button class="btn btn-accent" style="flex:2" id="pa-mulai">✅ Simpan & mulai presentasi</button></div>`;
    el.querySelectorAll(".pa-pilih button").forEach((b) => b.onclick = () => { status[b.dataset.s] = b.dataset.k; gambar(); });
    qs("pa-lewati").onclick = () => { closeModal(); _paBukaAsli(m.id, "presentasi"); };
    const tm = qs("pa-masuk");
    if (tm) tm.onclick = async () => {
      try { localStorage.setItem(_paKunci(j.id), JSON.stringify({ kelas_id: j.kelas_id, mapel_id: j.mapel_id, status, t: Date.now() })); } catch (e) {}
      closeModal();
      await handleAbsenMasuk(j.id);
      _paAbsenModal(m, j); // kembali ke daftar santri (status absen sudah tersimpan)
    };
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
async function _paTawarJurnal(m, j, sesi) {
  // judul bab & poin dibaca dari halaman buku (bisa lewat OCR) — tunggu sebentar sambil memberi tahu guru
  openModal(`<div style="text-align:center;padding:18px 6px"><div style="font-size:30px">📖</div><b>Membaca bab & poin yang tadi diajarkan…</b><div style="font-size:12px;color:var(--text-secondary);margin-top:6px">Sebentar saja — untuk mengisi jurnal otomatis.</div>${loadingHTML("")}</div>`);
  try { await Promise.race([window._mvJanjiJudul, new Promise((r) => setTimeout(r, 15000))]); } catch (e) {}
  let thumbs = [];
  try { thumbs = (await Promise.race([window._mvJanjiThumb, new Promise((r) => setTimeout(() => r([]), 4000))])) || []; } catch (e) {}
  const absen = _paBaca(j.id), log = (() => { try { return JSON.parse(localStorage.getItem("maPresentasi") || "[]")[0]; } catch (e) { return null; } })();
  const usul = log && typeof _joTeksPresentasi === "function" ? _joTeksPresentasi(log) : (m.judul || "");
  const pilihan = log ? [...new Set([
    log.materiOtomatis || null,
    ...(log.judulHal || []).filter((x) => x !== log.materiOtomatis).map((x) => `${log.buku || m.judul}: ${x}`),
    log.tanda ? `${log.buku || m.judul}: ${log.tanda}` : null,
    ...(window._mvTandaBuku || []).map((x) => `${log.buku || m.judul}: ${x}`),
    `${log.buku || m.judul} (hal. ${log.dari}${log.sampai !== log.dari ? "–" + log.sampai : ""})`,
  ].filter(Boolean))].filter((x) => x !== usul).slice(0, 6) : [];
  const hadir = absen ? Object.values(absen.status).filter((s) => s === "hadir").length : null, total = absen ? Object.keys(absen.status).length : null;
  const bisa = sesi && sesi.jam_masuk;
  openModal(`<h3>📝 Isi jurnal sekarang?</h3>
    <div style="font-size:12.5px;color:var(--text-secondary);margin-bottom:12px">${escapeHtml(j.mapel?.nama_mapel || "")} · ${escapeHtml(j.kelas?.nama_kelas || "")}</div>
    <div class="pa-ringkas-jurnal">
      <div>📖 <b>Materi yang diajarkan</b> <small style="color:var(--text-secondary)">— periksa & ubah bila perlu</small>
        <textarea id="pa-materi" class="input" rows="2" style="margin-top:4px;font-size:13px">${escapeHtml(usul)}</textarea>
        ${pilihan.length ? `<div class="pa-chips">${pilihan.map((x) => `<button type="button" onclick="qs('pa-materi').value=this.textContent;_paSimpanMateri()">${escapeHtml(x)}</button>`).join("")}</div>` : ""}
        ${thumbs.length ? `<small style="color:var(--text-secondary);margin-top:6px">⏱ Halaman yang paling lama Anda buka — tulis judul materinya di atas:</small>
          <div class="pa-thumbs">${thumbs.map((x) => `<figure><img src="${x.src}" alt=""><figcaption>hal. ${x.h} · ${x.mnt} mnt</figcaption></figure>`).join("")}</div>`
          : log && (log.terlama || []).length ? `<small style="color:var(--text-secondary);margin-top:4px">⏱ Paling lama dibuka: ${log.terlama.slice(0, 4).map((x) => `hal. ${x.h} (${x.mnt} mnt)`).join(", ")}</small>` : ""}</div>
      <div>📋 <b>Absensi</b><span>${absen ? `${hadir} dari ${total} hadir` : "belum diabsen — semua dianggap hadir"}</span></div>
      <div>🎯 <b>Metode</b><span>mengikuti kebiasaan Anda</span></div>
    </div>
    ${bisa ? `<button class="btn btn-accent" style="width:100%;margin-top:12px" id="pa-isi">⚡ Buka jurnal & isi otomatis</button>`
      : (() => {
          const km = _paKeadaanMasuk(j), selesai = _paSesiSelesai(j);
          const kotak = (isi) => `<div class="pa-peringatan" style="margin-top:12px">⏰ <span>${isi}</span></div>`;
          if (km.k === "bisa") return kotak("Anda <b>belum absen masuk</b> untuk jam ini — masih sempat. Absen santri & materi sudah tersimpan.")
            + `<button class="btn btn-accent" style="width:100%;margin-top:10px" id="pa-masuk-jurnal">✅ Absen masuk & isi jurnal</button>`;
          if (selesai) return kotak("Anda lupa <b>absen masuk</b> dan batasnya sudah lewat. Ajukan hadir ke admin — jurnal, absen santri & <b>bukti jam presentasi</b> terisi otomatis. Setelah di-ACC, sesi tercatat <b>Hadir Bersyarat</b>.")
            + `<button class="btn btn-accent" style="width:100%;margin-top:10px" id="pa-ajukan">📝 Ajukan Hadir sekarang</button>`;
          return kotak(`Anda lupa <b>absen masuk</b> dan batasnya sudah lewat. Absen santri & materi presentasi <b>sudah tersimpan</b>. Setelah jam pelajaran selesai (${String(j.jam_selesai || "").slice(0, 5)}), buka <b>Riwayat Absen → 📝 Ajukan Hadir</b> — semuanya terisi otomatis sebagai bukti untuk admin.`)
            + `<button class="btn btn-accent" style="width:100%;margin-top:10px" onclick="closeModal();showPage('riwayat-absen','page-riwayat-absen','menuRiwayatAbsen')">📜 Ke Riwayat Absen</button>`;
        })()}
    <button class="btn btn-outline" style="width:100%;margin-top:8px" onclick="closeModal()">Nanti saja</button>`);
  qs("pa-materi")?.addEventListener("input", _paSimpanMateri);
  _paSimpanMateri();
  const bm = qs("pa-masuk-jurnal"); if (bm) bm.onclick = () => _paAbsenMasukLaluJurnal(j);
  const ba = qs("pa-ajukan"); if (ba) ba.onclick = () => _paAjukanHadir(j);
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

// Materi yang dikonfirmasi guru disimpan ke catatan presentasi terakhir → dipakai ⚡ isi jurnal
function _paSimpanMateri() {
  const v = (qs("pa-materi")?.value || "").trim(); if (!v) return;
  try { const l = JSON.parse(localStorage.getItem("maPresentasi") || "[]"); if (l[0]) { l[0].materi = v; localStorage.setItem("maPresentasi", JSON.stringify(l)); } } catch (e) {}
}

// Dipakai form jurnal: status absen cepat untuk jadwal ini (atau null)
function _paStatusAbsenCepat(jadwalId, tanggal) { const r = jadwalId ? _paBaca(jadwalId, tanggal) : null; return r ? r.status : null; }

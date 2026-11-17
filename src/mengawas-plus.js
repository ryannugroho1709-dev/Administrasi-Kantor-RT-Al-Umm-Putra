// ============================================================
//  MENGAWAS UJIAN — PELENGKAP
//  1) Pengingat: absen mengawas saat sesi mulai, dan jurnal + absen pulang ±20 menit sebelum batas.
//  2) Monitor Harian saat ujian: papan pengawas hari ini (masuk / jurnal / pulang) + WA ke yang belum.
//  3) Ajukan Hadir mengawas (lupa absen masuk/pulang) → admin/kepala sekolah menyetujui (Hadir Bersyarat).
//  4) Berita Acara Pelaksanaan Ujian per sesi, otomatis dari jurnal mengawas, siap cetak.
//  Data: kuliah_pengaturan "ujian:pengajuan:<idJadwal>" (pengajuan), selebihnya data yang sudah ada.
// ============================================================
const MPW = { notif: new Set(), muat: 0, siswa: {} };
const _mpKv = (id) => "ujian:pengajuan:" + id;
const _mpJamTeks = (menit) => `${String(Math.floor(menit / 60)).padStart(2, "0")}.${String(menit % 60).padStart(2, "0")}`;
const _mpBolehPutus = () => (typeof isAdmin === "function" && isAdmin()) || (typeof isKepsekOrTU === "function" && isKepsekOrTU());
const _mpIso = (t, jam) => new Date(`${t}T${String(jam || "00:00").replace(".", ":")}:00+08:00`).toISOString();

// muat pengajuan bersama data kehadiran mengawas
(function () {
  const asli = _juMuatHadir;
  _juMuatHadir = async function (ids) {
    await asli.apply(this, arguments);
    JU._aju = JU._aju || {};
    await Promise.all(ids.map(async (id) => { JU._aju[id] = (await _kvAmbil(_mpKv(id), {}).catch(() => ({}))) || {}; }));
  };
})();

// ── 1. PENGINGAT ────────────────────────────────────────────
async function _mpCekPengingat() {
  try {
    if (typeof STATE === "undefined" || !STATE.guruId || typeof JU === "undefined") return;
    const hariIni = tanggalISO();
    if (!JU.daftar.length) { if (MPW.daftarDicek) return; MPW.daftarDicek = true; JU.daftar = (await _kvAmbil(_JU_KUNCI, []).catch(() => [])) || []; }
    const tugas = _juTugasGuru(STATE.guruId, hariIni, hariIni); if (!tugas.length) return;
    if (Date.now() - MPW.muat > 5 * 60000) { await _juMuatHadir([...new Set(tugas.map((x) => x.j.id))]); MPW.muat = Date.now(); }
    const jam = _juMenit(_juJamWita()), batas = _jmBatasPulang();
    tugas.forEach((x) => {
      const k = `${x.kunci}|${STATE.guruId}`, h = JU._hadir?.[x.j.id]?.[k], jr = _jmData(x.j.id, x.kunci);
      const mulai = _juMenit(x.sesi.mulai), akhir = _juMenit(x.sesi.selesai) + batas, nama = `${_juLabelSlot(x.s)} Kelas ${_juAngkaKelas(x.kelasId)}`;
      let jenis = null, pesan = "";
      if (!h && jam >= mulai - 10 && jam <= mulai + 20) { jenis = "masuk"; pesan = `Waktunya ✋ Absen Mengawas: ${nama}, Sesi ${x.ke} (${x.sesi.mulai}).`; }
      else if (h && !h.pulang && jam >= akhir - 20 && jam <= akhir) { jenis = "pulang"; pesan = `${jr ? "🏁 Absen pulang" : "📝 Isi jurnal lalu 🏁 absen pulang"} mengawas ${nama} sebelum pukul ${_mpJamTeks(akhir)} supaya dihitung insentif.`; }
      if (!jenis) return;
      const kunci = `mp:${k}:${jenis}`;
      try { if (MPW.notif.has(kunci) || sessionStorage.getItem(kunci)) return; sessionStorage.setItem(kunci, "1"); } catch (e) { if (MPW.notif.has(kunci)) return; }
      MPW.notif.add(kunci);
      toast(pesan, "info");
      try { if ("Notification" in window && Notification.permission === "granted") new Notification("Pengingat Mengawas Ujian", { body: pesan.replace(/[^\p{L}\p{N}\s.,:()\-]/gu, "").trim(), icon: typeof urlLogoSekolah === "function" ? urlLogoSekolah() : undefined }); } catch (e) {}
    });
  } catch (e) { console.warn("Pengingat mengawas:", e); }
}
setTimeout(_mpCekPengingat, 9000);
setInterval(_mpCekPengingat, 60000);

// ── 3. AJUKAN HADIR MENGAWAS ────────────────────────────────
async function juAjukanMengawas(jadwalId, kunci) {
  if (!JU._jurnal?.[jadwalId]) await _jmMuat([jadwalId]);
  if (!_jmData(jadwalId, kunci)) {
    toast("Isi jurnal mengawasnya dulu, lalu tulis alasannya", "info");
    await juJurnalMengawas(jadwalId, kunci);
    if (JURNAL_CTX?.mengawas) JURNAL_CTX.mengawas.lanjutAjukan = true;
    return;
  }
  _mpFormAjukan(jadwalId, kunci);
}
function _mpFormAjukan(jadwalId, kunci) {
  const j = JU.daftar.find((x) => x.id === jadwalId); if (!j) return;
  const [t, sid, kelasId] = kunci.split("|"), s = _juSesiPada(j, t, j.sesi.find((x) => x.id === sid)), ke = j.sesi.findIndex((x) => x.id === sid) + 1;
  const h = JU._hadir?.[jadwalId]?.[`${kunci}|${STATE.guruId}`];
  const saran = h ? ["Lupa absen pulang", "HP / sinyal bermasalah saat absen pulang", "Aplikasi error saat absen pulang"] : ["Lupa absen mengawas (masuk)", "HP / sinyal bermasalah saat absen", "Aplikasi error saat absen"];
  openModal(`<h3>✍️ Ajukan Hadir Mengawas</h3>
    <div class="ju-pindah-asal" style="--kw:${_juWarnaKelas(kelasId)}"><span class="ju-kls">${_juEsc(_juAngkaKelas(kelasId))}</span><div><b>${_juEsc(_juLabelSlot(j.slot[kunci] || {}))} · Kelas ${_juEsc(_juAngkaKelas(kelasId))}</b><small>${_juHariPanjang(t)} · Sesi ${ke} (${s.mulai}–${s.selesai})</small></div></div>
    <div class="field"><label class="form-label">Alasan</label><div class="aju-alasan-chip">${saran.map((a) => `<button type="button" onclick="qs('mp-alasan').value=this.textContent">${_juEsc(a)}</button>`).join("")}</div>
      <textarea id="mp-alasan" class="input" rows="2" placeholder="Pilih di atas atau tulis sendiri"></textarea></div>
    <div class="ju-ket">Jurnal mengawas sudah terisi ✓. Setelah disetujui admin/kepala sekolah, sesi ini tercatat <b>Hadir Bersyarat</b> dan dihitung insentif.</div>
    <button class="btn btn-accent" style="width:100%;margin-top:10px" onclick="_mpKirimAjukan('${jadwalId}','${kunci}')">📤 Kirim Pengajuan</button>`);
}
async function _mpKirimAjukan(jadwalId, kunci) {
  const alasan = (qs("mp-alasan")?.value || "").trim();
  if (alasan.replace(/[^a-z0-9]/gi, "").length < 5) { toast("Tulis alasan yang jelas", "err"); qs("mp-alasan")?.focus(); return; }
  try {
    setGlobalLoading(true, "Mengirim pengajuan…");
    const data = (await _kvAmbil(_mpKv(jadwalId), {})) || {};
    data[`${kunci}|${STATE.guruId}`] = { alasan, status: "menunggu", guru: STATE.guruNama || "", t: new Date().toISOString() };
    await _kvSimpan(_mpKv(jadwalId), data);
    (JU._aju = JU._aju || {})[jadwalId] = data;
    closeModal(); toast("📤 Pengajuan hadir mengawas terkirim — menunggu persetujuan admin", "ok");
    _mpSegarkan();
  } catch (e) { toast("Gagal: " + (e.message || e), "err"); }
  finally { setGlobalLoading(false); }
}
async function mpPutuskan(jadwalId, kunciLengkap, setuju) {
  if (!_mpBolehPutus()) { toast("Hanya admin / kepala sekolah", "err"); return; }
  const j = JU.daftar.find((x) => x.id === jadwalId); if (!j) return;
  const [t, sid, kelasId] = kunciLengkap.split("|"), s = _juSesiPada(j, t, j.sesi.find((x) => x.id === sid));
  try {
    setGlobalLoading(true, "Menyimpan keputusan…");
    const aju = (await _kvAmbil(_mpKv(jadwalId), {})) || {};
    if (!aju[kunciLengkap]) return;
    aju[kunciLengkap] = { ...aju[kunciLengkap], status: setuju ? "disetujui" : "ditolak", oleh: STATE.guruNama || "Admin", diputus: new Date().toISOString() };
    if (setuju) {
      const hadir = (await _kvAmbil("ujian:hadir:" + jadwalId, {})) || {}, lama = hadir[kunciLengkap] || {};
      hadir[kunciLengkap] = { ...lama, t: lama.t || _mpIso(t, s.mulai), pulang: lama.pulang || _mpIso(t, s.selesai), bersyarat: true, oleh: lama.oleh || aju[kunciLengkap].guru, disetujui: STATE.guruNama || "Admin" };
      await _kvSimpan("ujian:hadir:" + jadwalId, hadir);
      (JU._hadir = JU._hadir || {})[jadwalId] = hadir;
    }
    await _kvSimpan(_mpKv(jadwalId), aju);
    (JU._aju = JU._aju || {})[jadwalId] = aju;
    toast(setuju ? "✅ Disetujui — tercatat Hadir Bersyarat" : "Pengajuan ditolak", setuju ? "ok" : "info");
    _mpSegarkan();
    document.querySelector(`[data-aju="${CSS.escape(kunciLengkap)}"]`)?.remove();
  } catch (e) { toast("Gagal: " + (e.message || e), "err"); }
  finally { setGlobalLoading(false); }
}
function _mpSegarkan() {
  if (STATE.currentPage === "dashboard" && typeof _juSisipkanKartuDasbor === "function") _juSisipkanKartuDasbor();
  else if (STATE.currentPage === "monitor" && typeof renderMonitorHarian === "function") renderMonitorHarian();
  else if (qs("ju-wadah") && !JU.edit && typeof _juGambarDaftar === "function") _juGambarDaftar();
}
function _mpHtmlPengajuan(jadwalId, daftar) {
  const e = _juEsc, j = JU.daftar.find((x) => x.id === jadwalId);
  return daftar.map(([k, a]) => { const [t, sid, kelasId, g] = k.split("|"), ke = j.sesi.findIndex((x) => x.id === sid) + 1;
    return `<div class="mp-aju" data-aju="${e(k)}"><div><b>${e(_juNamaGuru(g))}</b> · ${e(_juLabelSlot(j.slot[`${t}|${sid}|${kelasId}`] || {}))} Kelas ${e(_juAngkaKelas(kelasId))}<small>${_juHariPendek(t)} Sesi ${ke} · "${e(a.alasan)}"</small></div>
      <span><button class="btn btn-sm btn-accent" onclick="mpPutuskan('${jadwalId}','${k}',true)">✓ Setujui</button><button class="btn btn-sm btn-ghost" onclick="mpPutuskan('${jadwalId}','${k}',false)">✕ Tolak</button></span></div>`; }).join("");
}

// tombol per baris tugas mengawas: Ajukan Hadir (sesi lewat & belum lengkap) + Berita Acara (setelah jurnal)
(function () {
  const asli = _juHtmlTugas;
  _juHtmlTugas = function (tugas, denganTombol) {
    const html = asli.apply(this, arguments);
    if (!denganTombol) return html;
    const w = document.createElement("div"); w.innerHTML = html;
    const baris = w.querySelectorAll(".ju-tugas-baris");
    tugas.forEach((x, i) => {
      const el = baris[i]; if (!el) return;
      const k = `${x.kunci}|${STATE.guruId}`, h = JU._hadir?.[x.j.id]?.[k], jr = _jmData(x.j.id, x.kunci), aju = JU._aju?.[x.j.id]?.[k];
      const lewat = _jmJendelaPulang(x) === "lewat" && (x.t < tanggalISO() || h || _juMenit(_juJamWita()) > _juMenit(x.sesi.selesai));
      let tambah = "";
      if (!_jmLengkap(x.j.id, x.kunci) && lewat) {
        tambah += aju ? `<span class="badge ${aju.status === "disetujui" ? "badge-green" : aju.status === "ditolak" ? "badge-red" : "badge-gray"} jm-tombol">${aju.status === "disetujui" ? "✓ Hadir Bersyarat" : aju.status === "ditolak" ? "✕ Pengajuan Ditolak" : "⏳ Pengajuan Menunggu"}</span>`
          : `<button class="btn btn-sm btn-outline jm-tombol" onclick="juAjukanMengawas('${x.j.id}','${x.kunci}')">✍️ Ajukan Hadir</button>`;
      }
      if (jr) tambah += `<button class="btn btn-sm btn-ghost jm-tombol" onclick="juBeritaAcara('${x.j.id}','${x.t}','${x.kunci}')" title="Cetak Berita Acara sesi ini">📄 Berita Acara</button>`;
      if (!tambah) return;
      const aksi = el.querySelector(".jm-aksi");
      if (aksi) aksi.insertAdjacentHTML("beforeend", tambah); else el.insertAdjacentHTML("beforeend", `<div class="jm-aksi">${tambah}</div>`);
    });
    return w.innerHTML;
  };
})();

// Rekap Kehadiran Pengawas: daftar pengajuan + cetak Berita Acara per hari
(function () {
  const asli = juRekapHadir;
  juRekapHadir = async function (id) {
    await asli.apply(this, arguments);
    const j = JU.daftar.find((x) => x.id === id), panel = qs("modal-panel"); if (!j || !panel) return;
    const menunggu = Object.entries(JU._aju?.[id] || {}).filter(([, a]) => a.status === "menunggu");
    const hariIni = tanggalISO(), pilih = j.hari.includes(hariIni) ? hariIni : j.hari.filter((t) => t <= hariIni).pop() || j.hari[0];
    panel.insertAdjacentHTML("beforeend", `${menunggu.length && _mpBolehPutus() ? `<div class="ju-sub" style="margin-top:14px">✍️ Pengajuan Hadir Mengawas (${menunggu.length})</div>${_mpHtmlPengajuan(id, menunggu)}` : ""}
      <div class="mp-ba-baris"><select id="mp-ba-tgl" class="input">${j.hari.map((t) => `<option value="${t}" ${t === pilih ? "selected" : ""}>${_juHariPendek(t)}</option>`).join("")}</select><button class="btn btn-outline" onclick="juBeritaAcara('${id}',qs('mp-ba-tgl').value)">🖨️ Cetak Berita Acara</button></div>`);
  };
})();

// ── 2. MONITOR HARIAN SAAT UJIAN: papan pengawas hari ini ──
async function mpPapanMonitor(wadah) {
  try {
    const hariIni = tanggalISO();
    if (!JU.daftar.length || !(JU.ajar || []).length) await _juMuat();
    const jadwal = JU.daftar.filter((j) => (j.hari || []).includes(hariIni) && Object.keys(j.slot || {}).some((k) => k.startsWith(hariIni + "|")));
    if (!jadwal.length) return;
    await _juMuatHadir(jadwal.map((j) => j.id));
    const e = _juEsc, jam = _juMenit(_juJamWita()), batas = _jmBatasPulang();
    let total = 0, lengkap = 0;
    const blok = jadwal.map((j) => {
      const menunggu = Object.entries(JU._aju?.[j.id] || {}).filter(([, a]) => a.status === "menunggu");
      const sesiHtml = j.sesi.map((s0, i) => {
        const s = _juSesiPada(j, hariIni, s0);
        const baris = (j.kelas || []).flatMap((kl) => {
          const kunci = _juKunci(hariIni, s0.id, kl), x = j.slot?.[kunci]; if (!_juLabelSlot(x)) return [];
          return (x.p || []).map((g) => {
            total++;
            const h = JU._hadir?.[j.id]?.[`${kunci}|${g}`], jr = JU._jurnal?.[j.id]?.[`${kunci}|${g}`], ok = !!(h && h.pulang && jr); if (ok) lengkap++;
            const telat = !h && jam > _juMenit(s.mulai) + 10, lewat = jam > _juMenit(s.selesai) + batas;
            const st = (v, label) => `<span class="mp-st ${v ? "ok" : ""}">${v ? "✓" : "–"} ${label}</span>`;
            const n = typeof normalisasiNomorWa === "function" ? normalisasiNomorWa(_juGuru(g)?.no_wa) : null;
            const kurang = !h ? "absen mengawas (masuk)" : !jr ? "jurnal mengawas" : !h.pulang ? "absen pulang mengawas" : "";
            const teks = `Assalamu'alaikum Ustadz ${_juNamaGuru(g)}.\nMengingatkan ${kurang} untuk ujian *${_juLabelSlot(x)} Kelas ${_juAngkaKelas(kl)}*, Sesi ${i + 1} (${s.mulai}–${s.selesai}) hari ini, lewat menu Jadwal Ujian di aplikasi.\nJazakumullahu khairan.`;
            return `<tr class="${ok ? "mp-lengkap" : telat || lewat ? "mp-telat" : ""}"><td><b>${e(_juNamaGuru(g))}</b></td><td>Kelas ${e(_juAngkaKelas(kl))} · ${e(_juLabelSlot(x))}</td>
              <td>${st(h, "Masuk")}${st(jr, "Jurnal")}${st(h?.pulang, "Pulang")}${h?.bersyarat ? ' <span class="badge badge-gray">Bersyarat</span>' : ""}</td>
              <td>${!ok && n?.valid ? `<a class="btn btn-sm btn-wa" href="https://wa.me/${n.nomor}?text=${encodeURIComponent(teks)}" target="_blank" rel="noopener">💬 Ingatkan</a>` : ""}</td></tr>`;
          });
        });
        return baris.length ? `<div class="mp-sesi"><div class="ju2-sesi-h"><b>Sesi ${i + 1}</b><span class="ju2-jam">🕒 ${e(s.mulai)}–${e(s.selesai)}</span></div><div style="overflow-x:auto"><table class="simple-table mp-tabel"><tbody>${baris.join("")}</tbody></table></div></div>` : "";
      }).join("");
      return `<div class="mp-jadwal"><div class="mp-jadwal-h"><b>${e(j.judul)}</b><span><button class="btn btn-sm btn-outline" onclick="juBeritaAcara('${j.id}','${hariIni}')">🖨️ Berita Acara Hari Ini</button></span></div>
        ${menunggu.length && _mpBolehPutus() ? `<div class="ju-sub">✍️ Pengajuan Hadir Mengawas (${menunggu.length})</div>${_mpHtmlPengajuan(j.id, menunggu)}` : ""}${sesiHtml}</div>`;
    }).join("");
    wadah.insertAdjacentHTML("beforeend", `<div class="card mp-papan"><div class="jm-h"><span>📋</span><div><b>Papan Pengawas Hari Ini</b><small>${lengkap}/${total} sesi lengkap (masuk + jurnal + pulang) · yang belum lengkap tidak dihitung insentif</small></div></div>
      <div class="ju-bar mp-bar"><i style="width:${total ? Math.round((lengkap / total) * 100) : 0}%"></i></div>${blok}</div>`);
  } catch (err) { console.warn("Papan pengawas:", err); }
}

// ── 4. BERITA ACARA PELAKSANAAN UJIAN ───────────────────────
async function juBeritaAcara(jadwalId, tanggal, kunciSatu) {
  const w = window.open("", "_blank");
  if (!w) { toast("Izinkan pop-up untuk mencetak", "err"); return; }
  w.document.write("<p style='font-family:sans-serif;padding:20px'>Menyiapkan berita acara…</p>");
  try {
    const j = JU.daftar.find((x) => x.id === jadwalId); if (!j) { w.close(); return; }
    await _juMuatHadir([jadwalId]);
    const p = STATE.pengaturan || {}, e = _juEsc;
    const logo = p.logo_kiri_url || p.logo_kanan_url || (typeof urlLogoSekolah === "function" ? urlLogoSekolah() : "");
    const lembaga = (p.nama_lembaga_kop || p.nama_pkbm || "PKBM Al Umm Barabai").toUpperCase(), kepala = p.kepala_pkbm || "Ahmad Rizqi Zaidi, S.Pd";
    const slot = [];
    j.sesi.forEach((s0, i) => (j.kelas || []).forEach((kl) => { const k = _juKunci(tanggal, s0.id, kl), x = j.slot?.[k]; if (_juLabelSlot(x) && (!kunciSatu || kunciSatu === k)) slot.push({ k, x, kl, i, s: _juSesiPada(j, tanggal, s0) }); }));
    if (!slot.length) { w.document.body.innerHTML = "<p style='font-family:sans-serif;padding:20px'>Tidak ada ujian pada tanggal ini.</p>"; return; }
    for (const kl of new Set(slot.map((o) => o.kl))) if (!MPW.siswa[kl]) MPW.siswa[kl] = await apiGetSiswaByKelas(kl).catch(() => []);
    const lembar = slot.map((o) => {
      const siswa = MPW.siswa[o.kl] || [], jr = Object.entries(JU._jurnal?.[jadwalId] || {}).filter(([k]) => k.startsWith(o.k + "|")).map(([, d]) => d)[0];
      const status = {}; (jr?.absensi || []).forEach((a) => (status[a.siswa_id] = a.status));
      const tdk = siswa.filter((s) => status[s.id] && status[s.id] !== "hadir");
      const n = jr?.jumlah || {}, hadir = jr ? n.hadir || 0 : "……", label = { izin: "Izin", sakit: "Sakit", alpha: "Tanpa Keterangan" };
      const pengawas = (o.x.p || []).map(_juNamaGuru);
      return `<section class="ba">
        <div class="kop">${logo ? `<img src="${e(logo)}" alt="">` : ""}<div><div class="lem">${e(lembaga)}</div><div class="jdl">BERITA ACARA PELAKSANAAN UJIAN</div><div class="sub">${e(j.judul)}</div></div></div>
        <p>Pada hari ini <b>${e(_juHariPanjang(tanggal))}</b>, pukul <b>${e(o.s.mulai)}</b> sampai <b>${e(o.s.selesai)}</b> WITA, telah dilaksanakan ujian dengan keterangan sebagai berikut:</p>
        <table class="isi"><tr><td>Mata Pelajaran</td><td>:</td><td><b>${e(_juLabelSlot(o.x))}</b></td></tr><tr><td>Kelas</td><td>:</td><td>${e(_juAngkaKelas(o.kl))}</td></tr>
          <tr><td>Sesi</td><td>:</td><td>Sesi ${o.i + 1} (${e(o.s.mulai)}–${e(o.s.selesai)})</td></tr>${o.x.ruang ? `<tr><td>Ruang</td><td>:</td><td>${e(o.x.ruang)}</td></tr>` : ""}
          <tr><td>Jumlah peserta seharusnya</td><td>:</td><td>${siswa.length} santri</td></tr><tr><td>Jumlah peserta hadir</td><td>:</td><td>${hadir} santri</td></tr>
          <tr><td>Jumlah peserta tidak hadir</td><td>:</td><td>${jr ? (n.izin || 0) + (n.sakit || 0) + (n.alpha || 0) : "……"} santri</td></tr></table>
        ${tdk.length ? `<div class="sub2">Peserta yang tidak hadir:</div><table class="garis"><tr><th>No</th><th>Nama Santri</th><th>Keterangan</th></tr>${tdk.map((s, i) => `<tr><td>${i + 1}</td><td>${e(s.nama)}</td><td>${label[status[s.id]] || status[s.id]}</td></tr>`).join("")}</table>` : ""}
        <div class="sub2">Catatan selama pelaksanaan ujian:</div><div class="catatan">${jr ? e(jr.catatan || "Ujian berjalan dengan tertib dan lancar.") : "…………………………………………………………………………………………<br>…………………………………………………………………………………………"}</div>
        <p>Demikian berita acara ini dibuat dengan sebenarnya.</p>
        <div class="ttd"><div>Mengetahui,<br>Kepala PKBM<br><br><br><br><b>${e(kepala)}</b></div><div>Barabai, ${e(new Date(tanggal + "T12:00:00").toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }))}<br>Pengawas,<br><br><br><br>${pengawas.length ? pengawas.map((n, i) => `<b>${i + 1}. ${e(n)}</b>`).join("<br>") : "<b>……………………</b>"}</div></div>
      </section>`;
    }).join("");
    w.document.open();
    w.document.write(`<!doctype html><html lang="id"><head><meta charset="utf-8"><title>Berita Acara ${e(_juHariPendek(tanggal))}</title><style>
      @page{size:A4;margin:16mm 18mm}*{box-sizing:border-box}body{font-family:"Times New Roman",serif;font-size:12pt;color:#000;margin:0;line-height:1.5}
      .ba{page-break-after:always}.ba:last-child{page-break-after:auto}
      .kop{display:flex;align-items:center;gap:14px;border-bottom:3px double #000;padding-bottom:8px;margin-bottom:14px}.kop img{width:20mm;height:20mm;object-fit:contain}.kop>div{flex:1;text-align:center}
      .lem{font-weight:700;letter-spacing:1px}.jdl{font-weight:800;font-size:14pt;margin-top:2px}.sub{font-size:11pt}
      table.isi{margin:6px 0 10px 12px;border-collapse:collapse}table.isi td{padding:2px 6px;vertical-align:top}table.isi td:first-child{width:62mm}
      .sub2{font-weight:700;margin-top:8px}table.garis{width:100%;border-collapse:collapse;margin:4px 0 8px}table.garis th,table.garis td{border:.6pt solid #000;padding:3px 6px;font-size:11pt}table.garis th{background:#eee}
      .catatan{border:.6pt solid #000;min-height:22mm;padding:6px 8px;margin:4px 0 10px}
      .ttd{display:flex;justify-content:space-between;margin-top:18px}.ttd>div{width:45%}
    </style></head><body>${lembar}<script>window.onload=function(){setTimeout(function(){window.print()},500)}<\/script></body></html>`);
    w.document.close();
  } catch (err) { console.error(err); try { w.document.body.innerHTML = "<p style='font-family:sans-serif;padding:20px'>Gagal menyiapkan berita acara: " + _juEsc(err.message || err) + "</p>"; } catch (e) {} }
}

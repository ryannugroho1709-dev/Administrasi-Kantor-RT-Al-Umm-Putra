// ============================================================
//  JURNAL MENGAWAS UJIAN — pengawas tetap mengisi jurnal seperti biasa (absensi santri + materi),
//  bedanya METODE otomatis "Ujian" (terkunci). Alurnya sama dengan mengajar: setelah ✋ Absen Mengawas,
//  formulir jurnal langsung terbuka; bisa juga diisi/diubah lewat tombol 📝 Jurnal di daftar tugas mengawas.
//  Data: kuliah_pengaturan "ujian:jurnal:<idJadwal>" → { "<tgl|sesi|kelas>|<guruId>": {...} } (tanpa tabel baru,
//  tidak mengubah hitungan JP / insentif yang sudah ada).
// ============================================================
const _JM_METODE = "Ujian";
const _jmKunciKv = (jadwalId) => "ujian:jurnal:" + jadwalId;

async function _jmMuat(ids) {
  JU._jurnal = JU._jurnal || {};
  await Promise.all(ids.map(async (id) => { JU._jurnal[id] = (await _kvAmbil(_jmKunciKv(id), {}).catch(() => ({}))) || {}; }));
}
const _jmData = (jadwalId, kunciSlot, guruId) => JU._jurnal?.[jadwalId]?.[`${kunciSlot}|${guruId || STATE.guruId}`] || null;

// Buka formulir jurnal (formulir yang sama dengan jurnal mengajar)
async function juJurnalMengawas(jadwalId, kunciSlot) {
  const j = JU.daftar.find((x) => x.id === jadwalId); if (!j) return;
  const [t, sesiId, kelasId] = kunciSlot.split("|"), slot = j.slot?.[kunciSlot] || {};
  if (!JU._jurnal?.[jadwalId]) await _jmMuat([jadwalId]);
  const lama = _jmData(jadwalId, kunciSlot);
  const sesi = _juSesiPada(j, t, j.sesi.find((x) => x.id === sesiId)), ke = j.sesi.findIndex((x) => x.id === sesiId) + 1;
  await bukaFormJurnalUnified({
    sesiId: null, kelasId, mapelId: slot.m || null, jadwalId: null, tanggal: t, sudahJurnal: false,
    judulInfo: `📋 Mengawas ${_juLabelSlot(slot)} · Kelas ${_juAngkaKelas(kelasId)} · ${_juHariPendek(t)} Sesi ${ke} (${sesi?.mulai}–${sesi?.selesai})<br><small>${_juEsc(j.judul)}</small>`,
  });
  JURNAL_CTX.mengawas = { jadwalId, kunciSlot, kelasId, mapel: _juLabelSlot(slot) };
  JURNAL_CTX.metodeTerpilih = [_JM_METODE];
  // judul & metode terkunci "Ujian"
  const h3 = qs("modal-panel")?.querySelector("h3"); if (h3) h3.innerHTML = `${lama ? "✏️ " : ""}Jurnal Mengawas Ujian`;
  qs("btn-jurnal-otomatis")?.remove(); qs("jurnal-otomatis-ket")?.remove();
  // saran "Lanjutan materi" / materi presentasi (milik jurnal mengajar) tidak dipakai saat mengawas
  const buangSaran = () => qs("jurnal-materi")?.closest(".field")?.querySelectorAll("button").forEach((b) => b.remove());
  [0, 400, 1200, 2500].forEach((ms) => setTimeout(() => { if (JURNAL_CTX?.mengawas) buangSaran(); }, ms));
  const tampil = qs("metode-display");
  if (tampil) { tampil.onclick = null; tampil.style.cursor = "default"; tampil.innerHTML = `<span class="chip">🔒 ${_JM_METODE}</span><small class="jm-ket">Metode otomatis saat mengawas ujian</small>`; }
  qs("metode-panel")?.remove();
  const ta = qs("jurnal-materi");
  if (ta) { ta.placeholder = `Mis. Ujian ${_juLabelSlot(slot)}: Bab 1–4 (pilihan ganda & uraian), santri tertib`; if (lama) ta.value = lama.materi || ""; }
  if (lama) (lama.absensi || []).forEach((a) => { const r = document.querySelector(`input[name="st-${a.siswa_id}"][value="${a.status}"]`); if (r) r.checked = true; });
  const tombol = qs("modal-panel")?.querySelector('button[onclick="submitJurnal()"]');
  if (tombol && /Simpan/.test(tombol.textContent)) tombol.textContent = "💾 Simpan Jurnal Mengawas";
}

// Simpan: lewat submitJurnal yang sama (validasi sama), tetapi tersimpan ke data ujian
(function () {
  const asli = window.submitJurnal;
  if (typeof asli !== "function") return;
  window.submitJurnal = async function () {
    const m = JURNAL_CTX && JURNAL_CTX.mengawas;
    if (!m) return asli.apply(this, arguments);
    const materi = (qs("jurnal-materi")?.value || "").trim();
    if (!materi) { toast("Materi wajib diisi", "err"); qs("jurnal-materi")?.focus(); return; }
    if (materi.replace(/[^a-z0-9]/gi, "").length < 4) { toast("Materi terlalu singkat — tulis materi/bab yang diujikan", "err"); qs("jurnal-materi")?.focus(); return; }
    const absensi = JURNAL_CTX.siswa.map((s) => ({ siswa_id: s.id, status: document.querySelector(`input[name="st-${s.id}"]:checked`)?.value || "hadir" }));
    const jumlah = { hadir: 0, izin: 0, sakit: 0, alpha: 0 }; absensi.forEach((a) => (jumlah[a.status] = (jumlah[a.status] || 0) + 1));
    try {
      setGlobalLoading(true, "Menyimpan jurnal mengawas…");
      const data = (await _kvAmbil(_jmKunciKv(m.jadwalId), {})) || {}; // ambil terbaru (pengawas lain bisa menyimpan bersamaan)
      data[`${m.kunciSlot}|${STATE.guruId}`] = { materi, metode: [_JM_METODE], absensi, jumlah, mapel: m.mapel, kelasId: m.kelasId, guru: STATE.guruNama || "", t: new Date().toISOString() };
      await _kvSimpan(_jmKunciKv(m.jadwalId), data);
      (JU._jurnal = JU._jurnal || {})[m.jadwalId] = data;
      closeModal();
      toast("📋 Jurnal mengawas tersimpan. Barakallahu fiik", "ok");
      if (STATE.currentPage === "dashboard" && typeof _juSisipkanKartuDasbor === "function") _juSisipkanKartuDasbor();
      else if (qs("ju-wadah") && typeof _juGambarDaftar === "function" && !JU.edit) _juGambarDaftar();
    } catch (e) { toast("Gagal menyimpan: " + (e.message || e), "err"); }
    finally { setGlobalLoading(false); }
  };
})();

// Muat jurnal bersama data kehadiran mengawas (dipakai Dasbor & halaman Jadwal Ujian)
(function () {
  const asli = _juMuatHadir;
  _juMuatHadir = async function (ids) { await Promise.all([asli.apply(this, arguments), _jmMuat(ids)]); };
})();

// Setelah ✋ Absen Mengawas → formulir jurnal langsung terbuka (seperti jurnal setelah absen masuk)
(function () {
  const asli = juAbsenMengawas;
  juAbsenMengawas = async function (jadwalId, kunci) {
    await asli.apply(this, arguments);
    const sudahHadir = JU._hadir?.[jadwalId]?.[`${kunci}|${STATE.guruId}`];
    if (sudahHadir && !_jmData(jadwalId, kunci)) setTimeout(() => juJurnalMengawas(jadwalId, kunci), 400);
  };
})();

// Tombol 📝 Jurnal di tiap baris tugas mengawas (setelah hadir)
(function () {
  const asli = _juHtmlTugas;
  _juHtmlTugas = function (tugas, denganTombol) {
    const html = asli.apply(this, arguments);
    if (!denganTombol) return html;
    const wadah = document.createElement("div"); wadah.innerHTML = html;
    const baris = wadah.querySelectorAll(".ju-tugas-baris");
    tugas.forEach((x, i) => {
      const el = baris[i]; if (!el) return;
      const hadir = JU._hadir?.[x.j.id]?.[`${x.kunci}|${STATE.guruId}`]; if (!hadir) return;
      const jr = _jmData(x.j.id, x.kunci);
      el.insertAdjacentHTML("beforeend", `<button class="btn btn-sm ${jr ? "btn-ghost" : "btn-accent"} jm-tombol" onclick="juJurnalMengawas('${x.j.id}','${x.kunci}')" title="${jr ? "Ubah jurnal mengawas" : "Isi jurnal mengawas"}">${jr ? "✓ Jurnal" : "📝 Isi Jurnal"}</button>`);
    });
    return wadah.innerHTML;
  };
})();

// ── Halaman Jurnal Guru: bagian "Jurnal Mengawas Ujian" pada bulan terpilih ──
(function () {
  const pasang = () => {
    if (typeof window.renderJurnalGuru !== "function" || window.renderJurnalGuru._jm) return;
    const asli = window.renderJurnalGuru;
    window.renderJurnalGuru = async function () { const r = await asli.apply(this, arguments); try { await _jmBagianJurnalGuru(); } catch (e) { console.warn(e); } return r; };
    window.renderJurnalGuru._jm = true;
  };
  setTimeout(pasang, 1000); setTimeout(pasang, 3000);
})();
async function _jmBagianJurnalGuru() {
  const target = qs("jurnal-guru-table"); if (!target) return;
  const guruId = isAdmin() ? (qs("jg-guru")?.value || null) : STATE.guruId;
  const bulan = qs("jg-bulan")?.value || bulanIniISO();
  if (!JU.daftar.length) JU.daftar = (await _kvAmbil(_JU_KUNCI, []).catch(() => [])) || [];
  const jadwal = JU.daftar.filter((j) => (j.hari || []).some((t) => t.startsWith(bulan)));
  if (!jadwal.length) return;
  await _jmMuat(jadwal.map((j) => j.id));
  const baris = [];
  jadwal.forEach((j) => Object.entries(JU._jurnal[j.id] || {}).forEach(([k, d]) => {
    const [t, sid, kelasId, gId] = k.split("|");
    if (!t.startsWith(bulan) || (guruId && gId !== guruId)) return;
    const ke = j.sesi.findIndex((x) => x.id === sid) + 1, s = _juSesiPada(j, t, j.sesi.find((x) => x.id === sid));
    baris.push({ t, ke, s, kelasId, gId, d, j, kunci: `${t}|${sid}|${kelasId}` });
  }));
  if (!baris.length) return;
  baris.sort((a, b) => a.t.localeCompare(b.t) || a.ke - b.ke);
  const e = _juEsc, bolehUbah = (b) => b.gId === STATE.guruId;
  const div = document.createElement("div");
  div.className = "card jm-bagian";
  div.innerHTML = `<div class="jm-h"><span>📋</span><div><b>Jurnal Mengawas Ujian</b><small>${baris.length} jurnal · metode otomatis Ujian</small></div></div>
    <div style="overflow-x:auto"><table class="simple-table jm-tabel"><thead><tr><th>No</th>${guruId ? "" : "<th>Guru</th>"}<th>Hari, Tanggal</th><th>Sesi</th><th>Mapel Diujikan</th><th>Kelas</th><th>Materi</th><th>Metode</th><th>Kehadiran</th></tr></thead>
    <tbody>${baris.map((b, i) => `<tr ${bolehUbah(b) ? `style="cursor:pointer" title="Klik untuk mengubah" onclick="juJurnalMengawas('${b.j.id}','${b.kunci}')"` : ""}>
      <td>${i + 1}</td>${guruId ? "" : `<td><b>${e(_juNamaGuru(b.gId))}</b></td>`}<td>${e(_juHariPanjang(b.t))}</td><td>Sesi ${b.ke}<br><small>${e(b.s?.mulai || "")}–${e(b.s?.selesai || "")}</small></td>
      <td>${e(b.d.mapel || "-")}</td><td>${e(_juAngkaKelas(b.kelasId))}</td><td>✏️ ${e(b.d.materi)}</td><td><span class="chip">${_JM_METODE}</span></td>
      <td><small>H ${b.d.jumlah?.hadir || 0} · I ${b.d.jumlah?.izin || 0} · S ${b.d.jumlah?.sakit || 0} · A ${b.d.jumlah?.alpha || 0}</small></td></tr>`).join("")}</tbody></table></div>`;
  target.querySelector(".jm-bagian")?.remove();
  const kosong = target.querySelector(".empty-state");
  if (kosong && /Belum ada jurnal/.test(kosong.textContent)) kosong.textContent = "Belum ada jurnal mengajar pada bulan ini.";
  target.appendChild(div);
}

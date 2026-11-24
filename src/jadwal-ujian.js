// ============================================================
//  JADWAL UJIAN (UAS / UTS / Ujian Tahfizh) + ABSENSI PENGAWAS
//  • Admin/kepala sekolah menyusun jadwal per HARI × SESI × KELAS (mapel tiap kelas boleh beda),
//    memilih PENGAWAS dari guru pengampu atau guru lain, cek bentrok & beban mengawas,
//    lalu mencetak / menyimpan PDF dan membagikannya ke grup WA.
//  • Guru melihat jadwal mengawasnya di Dasbor dan menekan "Absen Mengawas".
//  • Selama tanggal UJIAN di Kalender Akademik (UAS/UTS/ujian tahfizh), KBM kelas dianggap LIBUR:
//    tidak ada kewajiban absen mengajar & tidak ada Alpha (lihat _kaldikTanpaKbm, dipakai index.html).
//  Data disimpan di kuliah_pengaturan (kunci "ujian:jadwal" & "ujian:hadir:<id>") — tanpa tabel baru.
// ============================================================
const JU = { daftar: [], kaldik: [], ajar: [], edit: null, hari: null, dirty: false };
const _JU_KUNCI = "ujian:jadwal";
const _JU_WARNA_KELAS = { 7: "#0EA5E9", 8: "#16A34A", 9: "#D97706", 10: "#9333EA", 11: "#DC2626", 12: "#334155" };
const _JU_JENIS = { uas: "Ujian Akhir Semester", uts: "Ujian Tengah Semester", tahfizh: "Ujian Tahfizh", lain: "Ujian Lainnya" };

// ── KBM libur di hari ujian (dipakai modul absensi di index.html) ──
// Item kaldik yang menghentikan KBM: libur + UJIAN (UAS/UTS/ujian/ujian tahfizh). Rapat, rihlah, dsb. tidak.
function _kaldikTanpaKbm(items) {
  return (items || []).filter((k) => {
    if (k.jenis === "libur") return true;
    const kat = typeof _pgKategori === "function" ? _pgKategori(k) : (k.jenis === "ujian" ? "ujian" : "");
    return ["uas", "uts", "ujian", "tahfizh"].includes(kat);
  });
}
window._kaldikTanpaKbm = _kaldikTanpaKbm;

// ── Jam sesi per hari: hari biasa = jam di Pengaturan sesi; Jumat & Sabtu boleh punya jam sendiri (j.jamHari) ──
const _JU_HARI_KHUSUS = { 5: "jumat", 6: "sabtu" };
function _juSesiPada(j, t, s) {
  if (!s) return s;
  const kat = t ? _JU_HARI_KHUSUS[new Date(t + "T00:00:00").getDay()] : null;
  const o = kat ? j.jamHari?.[kat]?.[s.id] : null;
  return o && (o.mulai || o.selesai) ? { ...s, mulai: o.mulai || s.mulai, selesai: o.selesai || s.selesai } : s;
}
const _juJamTeks = (j, t, s) => { const x = _juSesiPada(j, t, s); return `${x.mulai}–${x.selesai}`; };
// Jam selalu 24 jam: "1620" / "16.20" / "16" → "16:20" / "16:00"
function _juJamRapi(el) { let v = String(el.value || "").replace(/\D/g, ""); if (!v) { el.value = ""; return ""; } if (v.length <= 2) v = v.padStart(2, "0") + "00"; else if (v.length === 3) v = "0" + v; v = v.slice(0, 4); const h = Math.min(23, +v.slice(0, 2)), m = Math.min(59, +v.slice(2)); el.value = String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0"); return el.value; }
function _juAturJamHari(hari, sesiId, k, v) {
  const jh = (JU.edit.jamHari = JU.edit.jamHari || {}), d = (jh[hari] = jh[hari] || {}), o = (d[sesiId] = d[sesiId] || {});
  if (v) o[k] = v; else delete o[k];
  if (!o.mulai && !o.selesai) delete d[sesiId];
  _juTandai();
}

// ── util ──
const _juIso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const _juTgl = (iso) => new Date(iso + "T00:00:00");
const _juId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const _juAngkaKelas = (id) => { const k = (LOOKUP.kelas || []).find((x) => x.id === id); return String(k?.nama_kelas || "").replace(/^\s*kelas\s+/i, "").trim() || "-"; };
const _juWarnaKelas = (id) => _JU_WARNA_KELAS[parseInt(_juAngkaKelas(id), 10)] || "#475569";
// Mapel gabungan (Geografi/Sosiologi/Ekonomi) diujikan terpisah: slot menyimpan {m: idMapel, sub: "Ekonomi"},
// dan di daftar/pengumpulan soal dipakai kode "idMapel::Ekonomi".
const _juNamaMapel = (id) => { const [b, sub] = String(id || "").split("::"); return sub || (LOOKUP.mapel || []).find((m) => m.id === b)?.nama_mapel || ""; };
const _juKode = (s) => (s?.m ? (s.sub ? s.m + "::" + s.sub : s.m) : "");
const _juSubs = (id) => (typeof subMapel === "function" ? subMapel(id) : []);
const _juGuru = (id) => (LOOKUP.guruAll || []).find((g) => g.id === id);
const _juNamaGuru = (id) => { const g = _juGuru(id); return g ? (typeof _namaSingkatTopbar === "function" ? _namaSingkatTopbar(g.nama) : g.nama) : "?"; };
const _juHariPanjang = (iso) => _juTgl(iso).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
const _juHariPendek = (iso) => _juTgl(iso).toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short" });
// Isi tombol tab hari: nama hari, tanggal besar, bulan, keterangan
const _juTabIsi = (iso, ket) => { const d = _juTgl(iso); return `<span class="ju-tb-hari">${d.toLocaleDateString("id-ID", { weekday: "long" })}</span><b class="ju-tb-tgl">${d.getDate()}</b><span class="ju-tb-bln">${d.toLocaleDateString("id-ID", { month: "short", year: "numeric" })}</span><small>${ket}</small>`; };
const _juKunci = (tgl, sesiId, kelasId) => `${tgl}|${sesiId}|${kelasId}`;
const _juBolehAtur = () => (typeof isAdmin === "function" && isAdmin()) || (typeof isKepsekOrTU === "function" && isKepsekOrTU());
const _juLabelSlot = (s) => (s?.m ? s.sub || _juNamaMapel(s.m) : "") || s?.teks || "";
const _juEsc = (s) => (typeof escapeHtml === "function" ? escapeHtml(s) : String(s ?? ""));

async function _juMuat() {
  await ensureLookups();
  const [daftar, kaldik, ajar] = await Promise.all([
    _kvAmbil(_JU_KUNCI, []),
    apiGetKaldikSemua().catch(() => []),
    supa.from("jadwal_pelajaran").select("guru_id,kelas_id,mapel_id").eq("aktif", true).then(unwrap).catch(() => []),
  ]);
  JU.daftar = Array.isArray(daftar) ? daftar : [];
  JU.kaldik = kaldik || [];
  JU.ajar = ajar || [];
}
async function _juSimpanSemua() { await _kvSimpan(_JU_KUNCI, JU.daftar); }

// ── HALAMAN ─────────────────────────────────────────────────
async function renderJadwalUjianInit() {
  const wadah = qs("ju-wadah"); if (!wadah) return;
  wadah.innerHTML = loadingHTML();
  try { await _juMuat(); JU.edit = null; JU._pribadi = null; _juGambarDaftar(); }
  catch (e) { console.error(e); wadah.innerHTML = `<div class="card empty-state">Gagal memuat jadwal ujian: ${_juEsc(e.message || e)}</div>`; }
}

function _juKaldikUjian() {
  const hariIni = tanggalISO();
  return JU.kaldik.filter((k) => {
    const kat = typeof _pgKategori === "function" ? _pgKategori(k) : "";
    return ["uas", "uts", "ujian", "tahfizh"].includes(kat) && (k.tanggal_selesai || k.tanggal_mulai) >= _juIso(new Date(Date.now() - 60 * 86400000)) && !JU.daftar.some((j) => j.kaldik_id === k.id);
  }).map((k) => ({ ...k, _kat: _pgKategori(k), _lewat: (k.tanggal_selesai || k.tanggal_mulai) < hariIni }));
}

// Jadwal yang sedang / akan berlangsung (paling dekat); kalau semua sudah lewat → yang terakhir
function _juJadwalAktif() {
  const hariIni = tanggalISO();
  const urut = JU.daftar.slice().sort((a, b) => (a.mulai || "").localeCompare(b.mulai || ""));
  return urut.find((j) => (j.selesai || j.mulai) >= hariIni) || urut[urut.length - 1] || null;
}
// Mapel yang diampu guru ini dan diujikan di jadwal j (+ kapan diujikan)
function _juMapelSaya(j, guruId) {
  if (!j || !guruId) return [];
  const per = new Map();
  (JU.ajar || []).filter((a) => a.guru_id === guruId && (j.kelas || []).includes(a.kelas_id)).forEach((a) => {
    const kode = _juSubs(a.mapel_id).length ? _juSubs(a.mapel_id).map((s) => a.mapel_id + "::" + s) : [a.mapel_id];
    kode.forEach((km) => { const k = `${km}|${a.kelas_id}`; if (!per.has(k)) per.set(k, { mapelId: km, kelasId: a.kelas_id, kapan: [] }); });
  });
  Object.entries(j.slot || {}).forEach(([k, s]) => {
    const [t, sesiId, kelasId] = k.split("|"); if (!s?.m || !j.hari.includes(t)) return;
    const x = per.get(`${_juKode(s)}|${kelasId}`) || per.get(`${s.m}|${kelasId}`); if (!x) return;
    const sesi = j.sesi.find((y) => y.id === sesiId); if (sesi) x.kapan.push({ t, sesi: _juSesiPada(j, t, sesi), ke: j.sesi.indexOf(sesi) + 1 });
  });
  // mapel yang belum masuk jadwal tetap tampil (soalnya tetap perlu dikumpulkan), kecuali kegiatan non-ujian
  return [...per.values()].filter((x) => x.kapan.length || _juDiujikan(j, x.mapelId))
    .filter((x) => !((LOOKUP.mapel || []).find((m) => m.id === x.mapelId.split("::")[0]) || {}).tanpa_guru)
    .map((x) => ({ ...x, kapan: x.kapan.sort((a, b) => a.t.localeCompare(b.t) || a.ke - b.ke) }))
    .sort((a, b) => (a.kapan[0]?.t || "9").localeCompare(b.kapan[0]?.t || "9") || _juNamaMapel(a.mapelId).localeCompare(_juNamaMapel(b.mapelId), "id"));
}
// Data pengumpulan soal & kehadiran untuk jadwal aktif (dimuat sekali, lalu halaman digambar ulang)
async function _juMuatPribadi(j) {
  if (!j || JU._pribadi === j.id) return;
  JU._pribadi = j.id;
  try {
    await Promise.all([
      typeof _uaMuatBank === "function" ? _uaMuatBank() : null,
      _kvAmbil("ujian:soal:" + j.id, {}).then((d) => { if (typeof UA !== "undefined") { UA.data = d || {}; UA.jadwal = j; } }),
      _juMuatHadir([j.id]),
    ]);
  } catch (e) { console.warn("Data pribadi jadwal ujian gagal:", e); }
  if (qs("ju-wadah") && !JU.edit && STATE.currentPage === "jadwal-ujian") _juGambarDaftar();
}
function _juGambarDaftar() {
  const wadah = qs("ju-wadah");
  const atur = _juBolehAtur(), saya = STATE.guruId;
  const usul = atur ? _juKaldikUjian() : [];
  const aktif = _juJadwalAktif();
  const lain = JU.daftar.filter((j) => j !== aktif).sort((a, b) => (b.mulai || "").localeCompare(a.mulai || ""));
  if (aktif && JU._pribadi !== aktif.id) _juMuatPribadi(aktif);
  if (typeof UA !== "undefined" && aktif) UA.segarkan = () => { closeModal(); _juGambarDaftar(); };
  wadah.innerHTML = `
    <div class="card ju-hero">
      <div><b>🗓️ Jadwal Ujian & Pengawas</b><small>${atur ? "Susun jadwal per hari, sesi & kelas, pilih pengawas, lalu cetak PDF / bagikan ke grup WA. Selama tanggal ujian di Kalender Akademik, KBM kelas otomatis libur (tidak ada Alpha)." : "Jadwal ujian yang sedang berjalan, kapan Antum mengawas, dan soal mapel Antum yang perlu dikumpulkan — semuanya di sini."}</small></div>
      <div style="display:flex;gap:6px;flex-wrap:wrap"><button class="tur-tanya" onclick="turUlang('jadwal-ujian')">❓ Panduan</button>${atur ? `<button class="btn btn-accent" onclick="juBuatBaru()">＋ Buat Jadwal</button>` : ""}</div>
    </div>
    ${usul.length ? `<div class="card ju-usul"><div class="ju-sub">💡 Ujian di Kalender Akademik yang belum dibuat jadwalnya</div>${usul.map((k) => `<div class="ju-usul-baris"><span><b>${_juEsc(k.judul)}</b><small>${_tglPendek(k.tanggal_mulai)}${k.tanggal_selesai && k.tanggal_selesai !== k.tanggal_mulai ? " – " + _tglPendek(k.tanggal_selesai) : ""}${k._lewat ? " · sudah lewat" : ""}</small></span><button class="btn btn-outline btn-sm" onclick="juBuatDariKaldik('${k.id}')">Susun Jadwal →</button></div>`).join("")}</div>` : ""}
    ${aktif ? _juHtmlAktif(aktif, saya, atur) : `<div class="card empty-state">Belum ada jadwal ujian.${atur ? " Tekan <b>＋ Buat Jadwal</b> atau pilih ujian dari Kalender Akademik di atas." : ""}</div>`}
    ${lain.length ? `<div class="ju-sub" style="margin:18px 2px 8px">📁 Jadwal ujian lainnya</div><div class="ju-grid">${lain.map(_juHtmlKartuJadwal).join("")}</div>` : ""}`;
}
// Tampilan utama: jadwal aktif + "Ujian saya" (mengawas & mapel yang diujikan) + papan jadwal lengkap
function _juHtmlAktif(j, saya, atur) {
  const hariIni = tanggalISO(), e = _juEsc;
  const tugas = _juTugasGuru(saya).filter((x) => x.j.id === j.id);
  const mapel = _juMapelSaya(j, saya);
  const siapUA = typeof UA !== "undefined" && UA.jadwal && UA.jadwal.id === j.id && UA.bank;
  const stMapel = mapel.map((x) => ({ ...x, st: siapUA ? _uaStatus(j, x) : null }));
  const terkumpul = stMapel.filter((x) => x.st && x.st.length).length;
  const sisaHari = Math.round((_juTgl(j.mulai) - _juTgl(hariIni)) / 86400000);
  const keHari = j.hari.indexOf(hariIni);
  const waktu = sisaHari > 0 ? `⏳ dimulai ${sisaHari === 1 ? "besok" : `${sisaHari} hari lagi`}` : keHari >= 0 ? `🔴 sedang berlangsung · hari ke-${keHari + 1} dari ${j.hari.length}` : (j.selesai || j.mulai) < hariIni ? "✔️ sudah selesai" : "🔴 sedang berlangsung";
  // kelompok tugas mengawas per hari
  const perHari = new Map(); tugas.forEach((x) => { if (!perHari.has(x.t)) perHari.set(x.t, []); perHari.get(x.t).push(x); });
  const pilihHari = JU.papanHari && j.hari.includes(JU.papanHari) ? JU.papanHari : (j.hari.includes(hariIni) ? hariIni : j.hari.find((t) => t >= hariIni) || j.hari[0]);
  // Hari H ujian: jadwal lengkap naik ke atas, pengumpulan soal turun ke bawah
  const batasSoal = j.jenis === "tahfizh" ? null : (typeof UA !== "undefined" && UA.jadwal && UA.jadwal.id === j.id && UA.data && UA.data._batas) || (() => { const d = _juTgl(j.mulai); d.setDate(d.getDate() - 7); return _juIso(d); })();
  const hariH = keHari >= 0 || (hariIni >= j.mulai && hariIni <= (j.selesai || j.mulai)) || (batasSoal && hariIni > batasSoal && hariIni <= (j.selesai || j.mulai));
  const atas = `
  <div class="card ju2-aktif">
    <div class="ju2-aktif-h">
      <div><span class="ju-jenis ju-j-${j.jenis}">${e(_JU_JENIS[j.jenis] || "Ujian")}</span> <span class="ju2-waktu">${waktu}</span>
        <b class="ju2-judul">${e(j.judul)}</b><small class="ju-ket">${_juHariPanjang(j.mulai)}${j.selesai !== j.mulai ? " – " + _juHariPanjang(j.selesai) : ""} · ${j.hari.length} hari ujian</small></div>
      <div class="ju2-aksi">
        <button class="btn btn-outline btn-sm" onclick="juLayarPenuh('${j.id}')" title="Lihat seluruh jadwal satu layar penuh (mendatar)">⛶ Layar Penuh</button><button class="btn btn-outline btn-sm" onclick="juCetakPdf('${j.id}')">🖨️ PDF</button>
        ${j.jenis !== "tahfizh" ? `<button class="btn btn-outline btn-sm" onclick="juPengumpulanSoal('${j.id}')">📥 ${atur ? "Pengumpulan soal" : "Rekap soal"}</button>` : ""}
        ${atur ? `<button class="btn btn-accent btn-sm" onclick="juBukaEditor('${j.id}')">✏️ Susun</button><button class="btn btn-wa btn-sm" onclick="juBagikanWa('${j.id}')">💬 WA</button><button class="btn btn-outline btn-sm" onclick="juRekapHadir('${j.id}')">✅ Kehadiran</button>` : ""}
      </div>
    </div>
    <div class="ju2-ringkas">
      <div style="--c:37,99,235"><b>${tugas.length}</b><span>📋 Tugas Mengawas Saya</span></div>
      <div style="--c:124,58,237"><b>${mapel.length}</b><span>📝 Mapel Saya Diujikan</span></div>
      <div style="--c:${mapel.length && terkumpul === mapel.length ? "22,163,74" : "217,119,6"}"><b>${siapUA ? `${terkumpul}/${mapel.length}` : "…"}</b><span>📥 soal terkumpul${siapUA && typeof _uaBatas === "function" && j.jenis !== "tahfizh" ? ` · batas <b>${_uaLabelH(_uaBatas(j))}</b>` : ""}</span></div>
    </div>
  </div>`;
  const dua = `
  <div class="ju2-dua">
    <div class="card ju2-kolom" data-tur="ju-awas">
      <div class="ju2-kolom-h"><span class="ju2-ikon" style="--c:37,99,235">📋</span><div><b>Saya Mengawas</b><small>Tekan <b>✋ Absen Mengawas</b> saat bertugas (buka 30 menit sebelum sesi)</small></div></div>
      ${tugas.length ? [...perHari.entries()].map(([t, xs]) => `<div class="ju2-hari ${t === hariIni ? "kini" : t < hariIni ? "lewat" : ""}"><div class="ju2-hari-h">${t === hariIni ? "📍 Hari ini · " : ""}${_juHariPanjang(t)}</div>${_juHtmlTugas(xs, true)}</div>`).join("")
        : `<div class="ju2-kosong">🙌 Antum tidak dijadwalkan mengawas di ujian ini.</div>`}
    </div>
    <div class="card ju2-kolom" data-tur="ju-mapel">
      <div class="ju2-kolom-h"><span class="ju2-ikon" style="--c:124,58,237">📝</span><div><b>Mapel Saya yang Diujikan</b><small>Kumpulkan soal ke admin: buat di Ujian Online, unggah Word/PDF, atau serahkan kertasnya</small></div></div>
      ${stMapel.length ? stMapel.map((x) => {
        const sudah = x.st && x.st.length;
        return `<div class="ju2-mapel ${sudah ? "ok" : ""}" style="--kw:${_juWarnaKelas(x.kelasId)}">
          <span class="ju-kls">${e(_juAngkaKelas(x.kelasId))}</span>
          <div class="ju2-mapel-isi"><b>${e(_juNamaMapel(x.mapelId))} · Kelas ${e(_juAngkaKelas(x.kelasId))}</b>
            <small>${x.kapan.length ? x.kapan.map((k) => `📅 ${_juHariPendek(k.t)} · Sesi ${k.ke} (${k.sesi.mulai}–${k.sesi.selesai})`).join("<br>") : "📅 belum masuk jadwal ujian (tanya admin)"}</small>
            <div class="ua-st">${x.st == null ? `<span class="ua-chip belum">Memuat…</span>` : x.st.map((s) => `<span class="ua-chip on">${s.label}</span>`).join("") || `<span class="ua-chip belum">⏳ Soal Belum Dikumpulkan</span>`}</div></div>
          ${j.jenis !== "tahfizh" ? `<button class="btn btn-sm ${sudah ? "btn-ghost" : "btn-accent"}" onclick="uaKumpulkan('${j.id}','${x.mapelId}','${x.kelasId}')">${sudah ? "✓ Kelola" : "📤 Kumpulkan"}</button>` : ""}
        </div>`; }).join("") : `<div class="ju2-kosong">Tidak ada mapel Antum yang diujikan di jadwal ini.</div>`}
    </div>
  </div>`;
  const papan = `
  <div class="card ju2-papan ${hariH ? "hari-h" : ""}" data-tur="ju-papan">
    <div class="ju2-kolom-h"><span class="ju2-ikon" style="--c:13,148,136">🗓️</span><div><b>${hariH ? "📍 Jadwal Ujian Hari Ini" : "Jadwal Lengkap"}</b><small>Ketuk mapel untuk mengumpulkan soalnya. <span class="ju2-tanda saya-awas">📋 Saya Mengawas</span> <span class="ju2-tanda saya-mapel">📝 Mapel Saya</span></small></div>
      <label class="ju2-saring"><input type="checkbox" ${JU.papanSaya ? "checked" : ""} onchange="JU.papanSaya=this.checked;_juGambarDaftar()"> Hanya yang Terkait Saya</label></div>
    <div class="ju-tab ju-tab-hari ju2-tab">${j.hari.map((t) => { const n = (j.kelas || []).reduce((a, k) => a + j.sesi.filter((s) => { const x = j.slot?.[_juKunci(t, s.id, k)]; return _juLabelSlot(x) && (!JU.papanSaya || _juTerkait(x, k, saya)); }).length, 0); const aku = tugas.some((x) => x.t === t) || mapel.some((m) => m.kapan.some((k) => k.t === t));
      return `<button class="${t === pilihHari ? "on" : ""} ${t === hariIni ? "kini" : ""}" onclick="juPilihHariPapan('${t}')">${_juTabIsi(t, (aku ? "⭐ " : "") + n + " ujian")}</button>`; }).join("")}</div>
    ${_juHtmlPapanHari(j, pilihHari, saya, atur)}
  </div>`;
  const gab = atur ? _juGabunganBelumPisah(j) : [];
  const pita = gab.length ? `<div class="card ju-gab-pita"><span>🔀</span><div><b>${gab.length} ujian mapel gabungan masih jadi satu</b><small>${[...new Set(gab.map(([, s]) => _juNamaMapel(s.m)))].map(e).join(", ")} — pisahkan supaya Geografi, Sosiologi, Ekonomi, dll. diujikan terpisah</small></div><button class="btn btn-accent btn-sm" onclick="juPisahGabungan('${j.id}')">Pisahkan Otomatis</button></div>` : "";
  return hariH ? atas + pita + papan + dua : atas + pita + dua + papan;
}
function juPilihHariPapan(t) {
  JU.papanHari = t; _juGambarDaftar();
  requestAnimationFrame(() => setTimeout(() => {
    const p = document.querySelector("[data-tur=ju-papan]"); if (!p) return;
    const r = p.getBoundingClientRect(), vh = window.innerHeight;
    // papan muat di layar → tampilkan utuh sampai bawah; kalau lebih tinggi dari layar → mulai dari atas papan
    if (r.height <= vh - 80) p.scrollIntoView({ behavior: "smooth", block: "end" });
    else p.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 60));
}
const _juTerkait = (x, kelasId, saya) => (x?.p || []).includes(saya) || (x?.m && (JU.ajar || []).some((a) => a.guru_id === saya && a.mapel_id === x.m && a.kelas_id === kelasId));
// Ujian ONLINE (pakai LAB): mapel-kelas yang soalnya sudah dibuat di Ujian Online (UTS/UAS sesuai jadwal)
function _juOnline(j, x, kelasId) {
  if (!x || !x.m || typeof _uaBankCocok !== "function" || typeof UA === "undefined" || !UA.bank) return false;
  try { return _uaBankCocok(j, _juKode(x), kelasId).length > 0; } catch (e) { return false; }
}
function _juJumlahOnline(j, t, s) { return (j.kelas || []).filter((k) => _juOnline(j, j.slot?.[_juKunci(t, s.id, k)], k)).length; }
function _juPastikanBank(ulang) {
  if (typeof UA === "undefined" || UA.bank || typeof _uaMuatBank !== "function" || JU._muatBank) return;
  JU._muatBank = true; _uaMuatBank().then(() => { if (typeof ulang === "function") ulang(); }).catch(() => {});
}
function _juHtmlPapanHari(j, t, saya, atur) {
  _juPastikanBank(() => { if (typeof _juGambarDaftar === "function" && qs("ju-wadah")?.querySelector(".ju2-tab, .ju2-sesi") && !qs("ju-wadah").querySelector(".ju-tab")) _juGambarDaftar(); });
  if (!t) return `<div class="ju2-kosong">Belum ada hari ujian.</div>`;
  const e = _juEsc;
  const blok = j.sesi.map((s, i) => {
    const sel = (j.kelas || []).map((k) => {
      const x = j.slot?.[_juKunci(t, s.id, k)], label = _juLabelSlot(x);
      const kosong = `<div class="ju2-sel ju2-kosong-sel" style="--kw:${_juWarnaKelas(k)}"><span class="ju2-sel-kls">Kelas ${e(_juAngkaKelas(k))}</span><small>—</small></div>`;
      if (!label) return kosong;
      const awas = (x.p || []).includes(saya), milik = x.m && (JU.ajar || []).some((a) => a.guru_id === saya && a.mapel_id === x.m && a.kelas_id === k);
      if (JU.papanSaya && !awas && !milik) return kosong;
      const bisa = x.m && j.jenis !== "tahfizh" && (milik || atur);
      const online = _juOnline(j, x, k);
      return `<button class="ju2-sel ${awas ? "awas" : ""} ${milik ? "milik" : ""} ${online ? "online" : ""}" style="--kw:${_juWarnaKelas(k)}" ${bisa ? `onclick="uaKumpulkan('${j.id}','${_juKode(x)}','${k}')"` : "disabled"}>
        <span class="ju2-sel-kls">Kelas ${e(_juAngkaKelas(k))}${online ? '<em class="ju-online" title="Soal dibuat di Ujian Online — memakai LAB">💻 Online</em>' : ""}</span><b>${e(label)}</b>
        <small>📋 ${(x.p || []).map(_juNamaGuru).map(e).join(", ") || "Pengawas Belum Ada"}</small>
        ${awas || milik ? `<span class="ju2-sel-tanda">${awas ? "📋 Saya mengawas" : ""}${awas && milik ? " · " : ""}${milik ? "📝 Mapel saya" : ""}</span>` : ""}</button>`;
    }).join("");
    const adaIsi = (j.kelas || []).some((k) => { const x = j.slot?.[_juKunci(t, s.id, k)]; return _juLabelSlot(x) && (!JU.papanSaya || _juTerkait(x, k, saya)); });
    return adaIsi ? `<div class="ju2-sesi"><div class="ju2-sesi-h"><b>Sesi ${i + 1}</b><span class="ju2-jam">🕒 ${_juJamTeks(j, t, s)}</span>${(() => { const n = _juJumlahOnline(j, t, s); return n ? `<span class="ju-online-sesi ${n > 1 ? "padat" : ""}" title="Jumlah kelas yang ujian online (LAB) di sesi ini">💻 ${n} kelas online${n > 1 ? " · cek kapasitas LAB" : ""}</span>` : ""; })()}</div><div class="ju2-gulir"><div class="ju2-sel-grid ju2-kolom-kelas" style="grid-template-columns:repeat(${(j.kelas || []).length},minmax(140px,1fr))">${sel}</div></div></div>` : "";
  }).join("");
  return blok || `<div class="ju2-kosong">${JU.papanSaya ? "Tidak ada ujian yang terkait Antum di hari ini." : "Belum ada mapel di hari ini."}</div>`;
}

function _juStatistik(j) {
  const hari = j.hari || [], sesi = j.sesi || [], kelas = j.kelas || [];
  let total = 0, isi = 0, adaPengawas = 0;
  hari.forEach((t) => sesi.forEach((s) => kelas.forEach((k) => { const x = j.slot?.[_juKunci(t, s.id, k)]; if (_juLabelSlot(x)) { total++; isi++; if (x.p?.length) adaPengawas++; } })));
  return { hari: hari.length, sesi: sesi.length, kelas: kelas.length, slot: isi, pengawas: adaPengawas };
}
function _juHtmlKartuJadwal(j) {
  const st = _juStatistik(j), atur = _juBolehAtur();
  const persen = st.slot ? Math.round((st.pengawas / st.slot) * 100) : 0;
  return `<div class="card ju-kartu">
    <div class="ju-kartu-h"><span class="ju-jenis ju-j-${j.jenis}">${_juEsc(_JU_JENIS[j.jenis] || "Ujian")}</span><span class="ju-tgl">${_juHariPendek(j.mulai)}${j.selesai !== j.mulai ? " – " + _juHariPendek(j.selesai) : ""}</span></div>
    <b class="ju-judul">${_juEsc(j.judul)}</b>
    <div class="ju-meta"><span>📅 ${st.hari} hari</span><span>⏰ ${st.sesi} sesi</span><span>🏫 ${st.kelas} kelas</span><span>✏️ ${st.slot} mapel</span></div>
    <div class="ju-bar" title="Slot yang sudah ada pengawasnya"><i style="width:${persen}%"></i></div><small class="ju-ket">${st.pengawas}/${st.slot} slot sudah ada pengawas</small>
    <div class="ju-aksi">
      ${atur ? `<button class="btn btn-accent btn-sm" onclick="juBukaEditor('${j.id}')">✏️ Susun</button>` : `<button class="btn btn-outline btn-sm" onclick="juBukaEditor('${j.id}')">📋 Lihat</button>`}
      <button class="btn btn-outline btn-sm" onclick="juCetakPdf('${j.id}')">🖨️ PDF</button>
      ${j.jenis !== "tahfizh" ? `<button class="btn btn-outline btn-sm" onclick="juPengumpulanSoal('${j.id}')">📥 Soal</button>` : ""}
      ${atur ? `<button class="btn btn-wa btn-sm" onclick="juBagikanWa('${j.id}')">💬 WA</button><button class="btn btn-outline btn-sm" onclick="juRekapHadir('${j.id}')">✅ Kehadiran</button><button class="btn btn-ghost btn-sm" onclick="juHapus('${j.id}')">🗑️</button>` : ""}
    </div>
  </div>`;
}

// ── Membuat jadwal ──
function _juHariDalamRentang(mulai, selesai) {
  const out = [], liburKbm = new Set();
  JU.kaldik.filter((k) => k.jenis === "libur").forEach((k) => { for (let d = _juTgl(k.tanggal_mulai); d <= _juTgl(k.tanggal_selesai || k.tanggal_mulai); d.setDate(d.getDate() + 1)) liburKbm.add(_juIso(d)); });
  const blokirMinggu = (STATE.pengaturan || {}).blokir_hari_minggu !== false;
  for (let d = _juTgl(mulai); d <= _juTgl(selesai || mulai); d.setDate(d.getDate() + 1)) {
    const iso = _juIso(d);
    if (blokirMinggu && d.getDay() === 0) continue;
    if (liburKbm.has(iso)) continue;
    out.push(iso);
  }
  return out;
}
function _juKelasBawaan() {
  const angka = (k) => parseInt(String(k.nama_kelas || "").match(/\d+/)?.[0] || "999", 10);
  return (LOOKUP.kelas || []).slice().sort((a, b) => angka(a) - angka(b)).map((k) => k.id);
}
function _juJadwalBaru(o) {
  return {
    id: _juId(), judul: o.judul || "Ujian Akhir Semester", jenis: o.jenis || "uas", kaldik_id: o.kaldik_id || null,
    mulai: o.mulai, selesai: o.selesai || o.mulai, hari: _juHariDalamRentang(o.mulai, o.selesai || o.mulai),
    sesi: o.jenis === "tahfizh" ? [{ id: "s1", mulai: "07:30", selesai: "11:30" }] : [{ id: "s1", mulai: "07:30", selesai: "09:00" }, { id: "s2", mulai: "09:30", selesai: "11:00" }],
    kelas: _juKelasBawaan(), slot: {}, ruang: {}, catatan: "", dibuat: new Date().toISOString(),
    ..._juPolaJamTerakhir(o.jenis || "uas"),
  };
}
function _juPolaJamTerakhir(jenis) {
  const lama = (JU.daftar || []).filter((x) => x.jenis === jenis && x.sesi?.length).sort((a, b) => String(b.dibuat || b.mulai).localeCompare(String(a.dibuat || a.mulai)))[0];
  return lama ? { sesi: lama.sesi.map((s) => ({ ...s })), ...(lama.jamHari ? { jamHari: JSON.parse(JSON.stringify(lama.jamHari)) } : {}) } : {};
}
async function juBuatBaru() {
  const hariIni = tanggalISO();
  openModal(`<h3>＋ Jadwal ujian baru</h3>
    <div class="field"><label class="form-label">Nama Ujian</label><input id="jub-judul" class="input" value="Sumatif Akhir Semester Ganjil"/></div>
    <div class="field"><label class="form-label">Jenis</label><select id="jub-jenis" class="input">${Object.entries(_JU_JENIS).map(([k, v]) => `<option value="${k}">${v}</option>`).join("")}</select></div>
    <div style="display:flex;gap:8px;"><div class="field" style="flex:1;"><label class="form-label">Mulai</label><input id="jub-mulai" type="date" class="input" value="${hariIni}"/></div><div class="field" style="flex:1;"><label class="form-label">Selesai</label><input id="jub-selesai" type="date" class="input" value="${hariIni}"/></div></div>
    <div style="font-size:11px;color:var(--text-secondary);">Hari Minggu & hari libur di Kalender Akademik otomatis dilewati. Agar KBM otomatis libur, pastikan ujian ini juga tercatat di Kalender Akademik.</div>
    <button class="btn btn-accent" style="width:100%;margin-top:12px;" onclick="_juBuatDariForm()">Lanjut Susun Jadwal →</button>`);
}
async function _juBuatDariForm() {
  const mulai = qs("jub-mulai").value, selesai = qs("jub-selesai").value || mulai;
  if (!mulai || selesai < mulai) { toast("Periksa tanggal mulai & selesai", "err"); return; }
  const j = _juJadwalBaru({ judul: qs("jub-judul").value.trim(), jenis: qs("jub-jenis").value, mulai, selesai });
  closeModal();
  JU.daftar.push(j); await _juSimpanSemua();
  juBukaEditor(j.id);
}
async function juBuatDariKaldik(kaldikId) {
  const k = JU.kaldik.find((x) => x.id === kaldikId); if (!k) return;
  const kat = _pgKategori(k);
  const j = _juJadwalBaru({ judul: k.judul, jenis: kat === "ujian" ? "lain" : kat, kaldik_id: k.id, mulai: k.tanggal_mulai, selesai: k.tanggal_selesai || k.tanggal_mulai });
  JU.daftar.push(j); await _juSimpanSemua();
  juBukaEditor(j.id);
}
async function juHapus(id) {
  const j = JU.daftar.find((x) => x.id === id); if (!j) return;
  if (!(await konfirmasiTema(`Hapus jadwal "${j.judul}"? Data absen pengawasnya juga tidak akan tampil lagi.`, { ikon: "🗑️", judul: "Hapus jadwal ujian" }))) return;
  JU.daftar = JU.daftar.filter((x) => x.id !== id); await _juSimpanSemua(); _juGambarDaftar(); toast("Jadwal dihapus", "ok");
}

// ── EDITOR ──────────────────────────────────────────────────
function juBukaEditor(id) {
  const j = JU.daftar.find((x) => x.id === id); if (!j) return;
  JU.edit = JSON.parse(JSON.stringify(j));
  JU.hari = JU.edit.hari[0] || null; JU.dirty = false;
  _juGambarEditor();
}
function _juMapelDiKelas(kelasId) {
  // mapel yang diajarkan di kelas ini (dari jadwal pelajaran aktif) + pengampunya
  const per = {};
  JU.ajar.filter((a) => a.kelas_id === kelasId).forEach((a) => { (per[a.mapel_id] = per[a.mapel_id] || new Set()).add(a.guru_id); });
  return per;
}
function _juBeban(j) {
  const b = {};
  Object.entries(j.slot || {}).forEach(([k, s]) => { const [t] = k.split("|"); if (!j.hari.includes(t) || !_juLabelSlot(s)) return; (s.p || []).forEach((g) => { b[g] = (b[g] || 0) + 1; }); });
  return b;
}
function _juBentrok(j, tgl, sesiId, kelasId, guruId) {
  return (j.kelas || []).filter((k) => k !== kelasId && (j.slot?.[_juKunci(tgl, sesiId, k)]?.p || []).includes(guruId));
}
function _juGambarEditor() {
  _juPastikanBank(() => { if (qs("ju-wadah")?.querySelector(".ju-tab")) _juGambarEditor(); });
  const j = JU.edit, atur = _juBolehAtur(), wadah = qs("ju-wadah");
  if (!JU.hari || !j.hari.includes(JU.hari)) JU.hari = j.hari[0] || null;
  const beban = _juBeban(j);
  const semuaHari = _juHariDalamRentang(j.mulai, j.selesai);
  const tgl = JU.hari;
  const hp = _juLayarSempit();
  wadah.innerHTML = `
    <div class="ju-eh">
      <div class="ju-eh-atas"><button class="btn btn-ghost btn-sm" onclick="_juTutupEditor()">← Daftar</button><span id="ju-status" class="nl-status"></span></div>
      <div class="ju-eh-judul">${atur ? `<input id="ju-judul" class="input ju-judul-in" value="${_juEsc(j.judul)}" oninput="JU.edit.judul=this.value;_juTandai()"/>` : `<b class="ju-judul">${_juEsc(j.judul)}</b>`}<small class="ju-ket">${_juHariPendek(j.mulai)}${j.selesai !== j.mulai ? " – " + _juHariPendek(j.selesai) : ""} · ${j.hari.length} hari ujian</small></div>
      <div class="ju-eh-aksi">
        ${atur ? `<button class="btn btn-accent btn-sm" onclick="juSimpanEditor()">💾 Simpan</button><button class="btn btn-outline btn-sm" onclick="juPisahGabungan()" title="Pisahkan ujian mapel gabungan (Geografi/Sosiologi/Ekonomi, dll.) menjadi ujian per mapel">🔀 Pisah Gabungan</button><button class="btn btn-outline btn-sm" onclick="juSusunDariJadwal()" title="Susun otomatis dari jadwal pelajaran">🪄 Susun dari Jadwal</button>` : ""}
        <button class="btn btn-outline btn-sm" onclick="juLayarPenuh()" title="Lihat seluruh jadwal satu layar penuh (mendatar)">⛶ Layar Penuh</button><button class="btn btn-outline btn-sm" onclick="juCetakPdf('${j.id}', true)">🖨️ PDF</button>
        ${atur ? `<button class="btn btn-ghost btn-sm" onclick="juTandaTangan()">✍️ Tanda Tangan</button>` : ""}
      </div>
    </div>
    ${atur ? `<details class="card ju-atur" ${JU.aturBuka ? "open" : ""} ontoggle="JU.aturBuka=this.open"><summary><span>⚙️ Pengaturan Ujian</span><small>${_juEsc(_JU_JENIS[j.jenis] || "Ujian")} · ${j.hari.length} hari · ${j.sesi.length} sesi · ${j.kelas.length} kelas · ${_juJmlMapelUji(j)}</small></summary>
      <div class="ju-at">
        <section class="ju-at-kartu"><h4>📝 Jenis Ujian</h4><select class="input" onchange="JU.edit.jenis=this.value;_juTandai()">${Object.entries(_JU_JENIS).map(([k, v]) => `<option value="${k}" ${k === j.jenis ? "selected" : ""}>${v}</option>`).join("")}</select></section>
        <section class="ju-at-kartu"><h4>🏫 Kelas Peserta <small>${j.kelas.length} kelas</small></h4><div class="ju-at-pil">${_juKelasBawaan().map((k) => `<label class="ju-at-kls ${j.kelas.includes(k) ? "on" : ""}" style="--kw:${_juWarnaKelas(k)}"><input type="checkbox" ${j.kelas.includes(k) ? "checked" : ""} onchange="_juToggleKelas('${k}',this.checked)"/>Kelas ${_juEsc(_juAngkaKelas(k))}</label>`).join("")}</div></section>
        <section class="ju-at-kartu lebar"><h4>📅 Hari Ujian <small>${j.hari.length} dari ${semuaHari.length} hari dipilih · ketuk untuk memilih/melepas</small></h4>
          ${(() => { const pekan = []; semuaHari.forEach((t) => { const d = _juTgl(t), s = new Date(d); s.setDate(d.getDate() - ((d.getDay() + 6) % 7)); const kunci = _juIso(s); let p = pekan.find((x) => x.k === kunci); if (!p) pekan.push((p = { k: kunci, h: [] })); p.h.push(t); });
            return pekan.map((p, i) => `<div class="ju-at-pekan"><span class="ju-at-pekan-l">Pekan ${i + 1}</span><div class="ju-at-pil">${p.h.map((t) => { const d = _juTgl(t), on = j.hari.includes(t); return `<label class="ju-at-hari ${on ? "on" : ""} ${d.getDay() === 0 ? "ahad" : ""}"><input type="checkbox" ${on ? "checked" : ""} onchange="_juToggleHari('${t}',this.checked)"/><span>${d.toLocaleDateString("id-ID", { weekday: "short" })}</span><b>${d.getDate()}</b><small>${d.toLocaleDateString("id-ID", { month: "short" })}</small></label>`; }).join("")}</div></div>`).join(""); })()}</section>
        <section class="ju-at-kartu lebar"><h4>🕒 Sesi & Jam <small>format 24 jam, mis. 16:20 · kolom Jumat/Sabtu kosong = sama dengan hari biasa</small></h4>
          <div class="ju-at-jam-wadah"><table class="ju-at-jam"><thead><tr><th>Sesi</th><th>Hari Biasa<small>Sen–Kam, Ahad</small></th><th>🕌 Jumat</th><th>📅 Sabtu</th><th></th></tr></thead><tbody>
          ${j.sesi.map((s, i) => { const jm = (hr) => j.jamHari?.[hr]?.[s.id] || {};
            const pas = (hr) => `<div class="ju-at-jj"><input class="input ju-jam" inputmode="numeric" maxlength="5" placeholder="${s.mulai}" value="${jm(hr).mulai || ""}" onchange="_juAturJamHari('${hr}','${s.id}','mulai',_juJamRapi(this))"/><i>–</i><input class="input ju-jam" inputmode="numeric" maxlength="5" placeholder="${s.selesai}" value="${jm(hr).selesai || ""}" onchange="_juAturJamHari('${hr}','${s.id}','selesai',_juJamRapi(this))"/></div>`;
            return `<tr><th><span class="ju-at-sesi">${i + 1}</span></th><td><div class="ju-at-jj"><input class="input ju-jam" inputmode="numeric" maxlength="5" value="${s.mulai}" onchange="JU.edit.sesi[${i}].mulai=_juJamRapi(this)||JU.edit.sesi[${i}].mulai;_juTandai()"/><i>–</i><input class="input ju-jam" inputmode="numeric" maxlength="5" value="${s.selesai}" onchange="JU.edit.sesi[${i}].selesai=_juJamRapi(this)||JU.edit.sesi[${i}].selesai;_juTandai()"/></div></td><td>${pas("jumat")}</td><td>${pas("sabtu")}</td><td>${j.sesi.length > 1 ? `<button class="ju-at-hapus" onclick="_juHapusSesi(${i})" title="Hapus sesi ${i + 1}">✕</button>` : ""}</td></tr>`; }).join("")}
          </tbody></table></div>
          <button class="btn btn-ghost btn-sm" onclick="_juTambahSesi()">＋ Tambah Sesi</button></section>
        <section class="ju-at-kartu lebar"><h4>📚 Mapel yang Diujikan <small id="ju-uji-jml">${_juJmlMapelUji(j)}</small></h4>
          <div class="ju-at-pil ju-cek-mapel">${_juMapelSemuaKelas(j).map((m) => { const on = _juDiujikan(j, m); return `<label class="${on ? "" : "tidak"}"><input type="checkbox" ${on ? "checked" : ""} onchange="_juToggleMapelUji('${m}',this.checked,this)"/> ${_juEsc(_juNamaMapel(m))}</label>`; }).join("") || `<span class="ju-ket">Belum ada jadwal pelajaran untuk kelas peserta.</span>`}</div>
          <div class="ju-uji-alat"><button class="btn btn-ghost btn-sm" onclick="_juSemuaMapelUji(true)">Centang Semua</button><button class="btn btn-ghost btn-sm" onclick="_juSemuaMapelUji(false)">Kosongkan Semua</button><small class="ju-ket">Yang dicoret tidak ikut Susun dari Jadwal / Susun Merata, dan gurunya tidak diminta mengumpulkan soal.</small></div></section>
      </div></details>` : ""}
    <div class="ju-tab ju-tab-hari">${j.hari.map((t) => `<button class="${t === tgl ? "on" : ""} ${t === tanggalISO() ? "kini" : ""}" data-hari="${t}" onclick="JU.hari='${t}';_juGambarEditor()">${_juTabIsi(t, Object.keys(j.slot || {}).filter((k) => k.startsWith(t + "|") && _juLabelSlot(j.slot[k])).length + " mapel")}</button>`).join("")}</div>
    ${tgl ? `<div class="card ju-papan">
      <div class="ju-papan-h"><b>${_juHariPanjang(tgl)}</b>${atur ? `<small class="ju-ket ju-seret-ket">✋ Tekan lama mapel lalu geser: ke sel kosong = pindah, ke mapel lain = tukar, ke tab hari = pindah hari</small>` : ""}${atur ? `<span class="ju-papan-aksi"><button class="btn btn-ghost btn-sm" onclick="_juSalinHari()">📋 Salin Hari</button><button class="btn btn-outline btn-sm" onclick="juIsiPengawasOtomatis()">⚡ Pengawas Otomatis</button></span>` : ""}</div>
      ${hp
        // HP: satu kartu per sesi, kelas berbaris ke bawah (tidak perlu geser ke samping)
        ? j.sesi.map((s, i) => `<div class="ju-hp-sesi"><div class="ju-hp-sesi-h"><b>Sesi ${i + 1}</b><span>${_juJamTeks(j, tgl, s)}</span></div>
            ${j.kelas.map((k) => `<div class="ju-hp-sel ${_juLabelSlot(j.slot?.[_juKunci(tgl, s.id, k)]) ? "" : "kosong"}" ${atur ? `data-kunci="${_juKunci(tgl, s.id, k)}"` : ""} style="--kw:${_juWarnaKelas(k)}"><div class="ju-hp-kls">Kelas ${_juEsc(_juAngkaKelas(k))}</div><div class="ju-hp-isi">${_juIsiSel(j, tgl, s, k, atur)}</div></div>`).join("")}</div>`).join("")
        : `<div class="ju-tabel-wadah"><table class="ju-tabel">
        <thead><tr><th class="ju-th-sesi">Sesi</th>${j.kelas.map((k) => `<th class="ju-th-kls" style="--kw:${_juWarnaKelas(k)}">Kelas ${_juEsc(_juAngkaKelas(k))}</th>`).join("")}</tr></thead>
        <tbody>${j.sesi.map((s, i) => `<tr><th class="ju-th-sesi"><b>Sesi ${i + 1}</b><small>${_juJamTeks(j, tgl, s)}</small></th>${j.kelas.map((k) => _juHtmlSel(j, tgl, s, k, atur)).join("")}</tr>`).join("")}</tbody>
      </table></div>`}
    </div>` : `<div class="card empty-state">Belum ada hari ujian. Centang hari di ⚙️ Pengaturan.</div>`}
    <div class="card"><div class="ju-sub">👥 Beban mengawas (seluruh hari)</div><div class="ju-beban">${Object.entries(beban).sort((a, b) => b[1] - a[1]).map(([g, n]) => `<span>${_juEsc(_juNamaGuru(g))} <b>${n}</b></span>`).join("") || `<span class="ju-ket">Belum ada pengawas.</span>`}</div></div>`;
  _juTandai(true);
}
const _juLayarSempit = () => window.matchMedia && window.matchMedia("(max-width: 760px)").matches;
function _juHtmlSel(j, tgl, s, kelasId, atur) {
  const label = _juLabelSlot(j.slot?.[_juKunci(tgl, s.id, kelasId)]);
  return `<td class="ju-sel ${label ? "" : "kosong"}" ${atur ? `data-kunci="${_juKunci(tgl, s.id, kelasId)}"` : ""} style="--kw:${_juWarnaKelas(kelasId)}">${_juIsiSel(j, tgl, s, kelasId, atur)}</td>`;
}
// Isi satu sel (dipakai tabel di layar lebar dan kartu di HP)
function _juIsiSel(j, tgl, s, kelasId, atur) {
  const kunci = _juKunci(tgl, s.id, kelasId), x = j.slot?.[kunci] || {};
  const mapelKelas = _juMapelDiKelas(kelasId);
  const pengampu = x.m ? [...(mapelKelas[x.m] || [])] : [];
  const label = _juLabelSlot(x);
  const tandaOnline = _juOnline(j, x, kelasId) ? '<span class="ju-online" title="Soal dibuat di Ujian Online — memakai LAB">💻 Online</span>' : "";
  const chips = (x.p || []).map((g) => { const bentrok = _juBentrok(j, tgl, s.id, kelasId, g); return `<span class="ju-chip ${bentrok.length ? "bentrok" : ""}" title="${bentrok.length ? "Bentrok: juga mengawas Kelas " + bentrok.map(_juAngkaKelas).join(", ") + " di sesi ini" : ""}">${_juEsc(_juNamaGuru(g))}${atur ? `<button onclick="_juLepasPengawas('${kunci}','${g}')" aria-label="lepas">×</button>` : ""}</span>`; }).join("");
  if (!atur) return label ? `${tandaOnline}<b>${_juEsc(label)}</b>${x.ruang ? `<small>Ruang ${_juEsc(x.ruang)}</small>` : ""}<div class="ju-chips">${chips || '<span class="ju-ket">Pengawas Belum Ada</span>'}</div>` : "–";
  const dipakai = _juMapelTerpakai(j, kelasId, kunci);
  const opsiUtama = Object.keys(mapelKelas).map((m) => [m, _juNamaMapel(m)]).filter(([, n]) => n).sort((a, b) => a[1].localeCompare(b[1], "id"));
  const opsiLain = (LOOKUP.mapel || []).filter((m) => !mapelKelas[m.id]).map((m) => [m.id, m.nama_mapel]).sort((a, b) => a[1].localeCompare(b[1], "id"));
  return `
    ${label ? '<span class="ju-grip" title="Tekan lama lalu geser untuk memindah / menukar">⠿</span>' : ""}${tandaOnline}<select class="input ju-mapel" onchange="_juSetMapel('${kunci}',this.value)">
      <option value="">— Kosong —</option>
      ${opsiUtama.length ? `<optgroup label="Mapel Kelas Ini">${opsiUtama.map(([id, n0]) => { const n = n0 + (_juDiujikan(j, id) ? "" : " · Tidak Diujikan"); return _juSubs(id).length ? _juSubs(id).map((sb) => _juOpsiMapel(`${id}::${sb}`, `${sb} (${n})`, id === x.m && x.sub === sb, dipakai)).join("") + _juOpsiMapel(id, `${n} — Digabung`, id === x.m && !x.sub, dipakai) : _juOpsiMapel(id, n, id === x.m, dipakai); }).join("")}</optgroup>` : ""}
      <optgroup label="Mapel Lain">${opsiLain.map(([id, n]) => _juOpsiMapel(id, n, id === x.m, dipakai)).join("")}</optgroup>
      <option value="__teks" ${!x.m && x.teks ? "selected" : ""}>✏️ Tulis Sendiri…</option>
    </select>
    ${x.m && !_juDiujikan(j, x.m) ? `<small class="ju-ket ju-tidak-uji">⚠️ Ditandai Tidak Diujikan di ⚙️ Pengaturan</small>` : ""}
    ${!x.m && x.teks ? `<div class="ju-teks">${_juEsc(x.teks)}</div>` : ""}
    ${label ? `<div class="ju-chips">${chips}<button class="ju-tambah" onclick="juPilihPengawas('${kunci}')">＋ Pengawas</button><button class="ju-tambah ju-pindah" onclick="juPindahSlot('${kunci}')" title="Pindahkan ke sesi kosong atau tukar dengan mapel lain">↔️ Pindah/Tukar</button></div>${pengampu.length ? `<small class="ju-ket">Pengampu: ${pengampu.map(_juNamaGuru).map(_juEsc).join(", ")}</small>` : ""}` : ""}`;
}
function _juTandai(diam) {
  if (!diam) JU.dirty = true;
  const el = qs("ju-status"); if (el) { el.textContent = JU.dirty ? "● Belum disimpan" : ""; el.classList.toggle("nl-dirty", JU.dirty); }
}
async function _juSetMapel(kunci, nilai) {
  const s = (JU.edit.slot[kunci] = JU.edit.slot[kunci] || {});
  if (nilai === "__teks") {
    const teks = await promptTema("Nama ujian di slot ini (mis. Ujian Praktik Tilawah)", s.teks || "", { judul: "Tulis sendiri", ikon: "✏️" });
    if (teks && teks.trim()) { s.m = ""; delete s.sub; s.teks = teks.trim(); }
  } else {
    const lain = nilai ? _juMapelTerpakai(JU.edit, kunci.split("|")[2], kunci).get(nilai) : null;
    if (lain) {
      const [t2, sid2] = lain.split("|"), ke = JU.edit.sesi.findIndex((x) => x.id === sid2) + 1;
      const ok = await konfirmasiTema(`<b>${_juEsc(_juNamaMapelKode(nilai))}</b> sudah terjadwal di <b>${_juHariPendek(t2)} · Sesi ${ke}</b> untuk kelas ini.<br>Tukar posisinya dengan mapel di sel ini?`, { ikon: "🔁", judul: "Mapel Sudah Terjadwal", teksYa: "Tukar Posisi", teksTidak: "Batal" });
      if (ok) { _juTukarSlot(kunci, lain); _juTandai(); }
      _juGambarEditor(); return;
    }
    const [m, sub] = String(nilai || "").split("::"); s.m = m; s.teks = ""; if (sub) s.sub = sub; else delete s.sub;
  }
  if (!_juLabelSlot(s)) delete JU.edit.slot[kunci];
  _juTandai(); _juGambarEditor();
}
// ── ANTI DOBEL: satu mapel hanya sekali per kelas dalam satu jadwal ujian ──
const _juNamaMapelKode = (kode) => { const [m, sub] = String(kode).split("::"); return sub ? `${sub} (${_juNamaMapel(m)})` : _juNamaMapel(m); };
// Map kode → kunci slot lain (kelas sama, hari aktif). Mapel gabungan utuh bentrok dengan bagiannya.
function _juMapelTerpakai(j, kelasId, kecuali) {
  const m = new Map();
  Object.entries(j.slot || {}).forEach(([k, s]) => {
    const [t, , kl] = k.split("|");
    if (k === kecuali || kl !== kelasId || !s?.m || !j.hari.includes(t)) return;
    const kode = s.sub ? `${s.m}::${s.sub}` : s.m;
    m.set(kode, k);
    if (s.sub) { if (!m.has(s.m)) m.set(s.m, k); } else _juSubs(s.m).forEach((sb) => { if (!m.has(`${s.m}::${sb}`)) m.set(`${s.m}::${sb}`, k); });
  });
  return m;
}
function _juOpsiMapel(kode, nama, terpilih, dipakai) {
  const k = !terpilih && dipakai.get(kode);
  if (!k) return `<option value="${_juEsc(kode)}" ${terpilih ? "selected" : ""}>${_juEsc(nama)}</option>`;
  const [t, sid] = k.split("|"), ke = (JU.edit || {}).sesi ? JU.edit.sesi.findIndex((x) => x.id === sid) + 1 : "";
  return `<option value="${_juEsc(kode)}" class="ju-opsi-dipakai">${_juEsc(nama)} · Sudah ${_juHariPendek(t)}${ke ? " S" + ke : ""}</option>`;
}
// Tukar isi mapel dua slot (pengawas tetap di jam/sesinya masing-masing)
function _juTukarSlot(a, b) {
  const sl = JU.edit.slot, A = sl[a] || {}, B = sl[b] || {};
  const isi = (x) => ({ m: x.m || "", ...(x.sub ? { sub: x.sub } : {}), teks: x.teks || "", ...(x.ruang ? { ruang: x.ruang } : {}) });
  const ia = isi(A), ib = isi(B);
  const pasang = (k, isiBaru, lama) => { const o = { ...isiBaru, p: (lama.p || []).slice() }; if (_juLabelSlot(o)) sl[k] = o; else delete sl[k]; };
  pasang(a, ib, A); pasang(b, ia, B);
}
// Jendela Pindah/Tukar: sesi kosong kelas ini (disarankan: hari yang paling longgar, dekat hari asal) + tukar dengan mapel lain
function juPindahSlot(kunci) {
  const j = JU.edit, [t0, sid0, kelasId] = kunci.split("|"), x = j.slot[kunci]; if (!x) return;
  const e = _juEsc, nama = _juLabelSlot(x);
  const beban = (t) => j.sesi.filter((s) => _juLabelSlot(j.slot[_juKunci(t, s.id, kelasId)])).length;
  const kosong = [];
  j.hari.forEach((t) => j.sesi.forEach((s, i) => { const k = _juKunci(t, s.id, kelasId); if (k !== kunci && !_juLabelSlot(j.slot[k])) kosong.push({ k, t, s, i, beban: beban(t), jarak: Math.abs(_juTgl(t) - _juTgl(t0)) / 86400000 }); }));
  kosong.sort((a, b) => a.beban - b.beban || a.jarak - b.jarak || a.i - b.i);
  const saran = new Set(), hariSaran = new Set(); // 3 saran di hari yang berbeda-beda
  kosong.forEach((o) => { if (saran.size < 3 && !hariSaran.has(o.t)) { saran.add(o.k); hariSaran.add(o.t); } });
  const urutHari = (a, b) => a.t.localeCompare(b.t) || a.i - b.i;
  const pengawasAman = (o) => (x.p || []).filter((g) => !_juBentrok(j, o.t, o.s.id, kelasId, g).length).length;
  const terisi = [];
  j.hari.forEach((t) => j.sesi.forEach((s, i) => { const k = _juKunci(t, s.id, kelasId); if (k !== kunci && _juLabelSlot(j.slot[k])) terisi.push({ k, t, s, i, label: _juLabelSlot(j.slot[k]) }); }));
  const sid0i = j.sesi.findIndex((s) => s.id === sid0);
  const sel = (t, s, i) => {
    const k = _juKunci(t, s.id, kelasId), isi = j.slot[k], lbl = _juLabelSlot(isi);
    if (k === kunci) return `<td><div class="ju-pt-sel asal"><b>${e(nama)}</b><small>📍 Sekarang</small></div></td>`;
    if (!lbl) { const o = kosong.find((z) => z.k === k), n = (x.p || []).length, aman = o ? pengawasAman(o) : 0;
      return `<td><button class="ju-pt-sel kosong ${saran.has(k) ? "saran" : ""}" onclick="juPindahKe('${kunci}','${k}')"><b>${saran.has(k) ? "⭐ " : ""}Kosong</b><small>Pindah ke sini${n ? ` · pengawas ${aman}/${n}` : ""}</small></button></td>`; }
    return `<td><button class="ju-pt-sel isi" onclick="juTukarTanya('${kunci}','${k}')"><b>${e(lbl)}</b><small>🔁 Tukar</small></button></td>`;
  };
  openModal(`<h3>↔️ Pindah / Tukar Jadwal</h3>
    <div class="ju-pindah-asal" style="--kw:${_juWarnaKelas(kelasId)}"><span class="ju-kls">${e(_juAngkaKelas(kelasId))}</span><div><b>${e(nama)} · Kelas ${e(_juAngkaKelas(kelasId))}</b><small>Sekarang: ${_juHariPanjang(t0)} · Sesi ${sid0i + 1} (${_juJamTeks(j, t0, j.sesi[sid0i])})</small></div></div>
    <p class="ju-ket" style="margin:8px 2px">Pilih sel <b>Kosong</b> untuk memindah, atau mapel lain untuk <b>menukar</b> (pengawas tetap di sesinya). ⭐ = disarankan: hari paling longgar & dekat.</p>
    <div class="ju-pt-wadah"><table class="ju-pt"><thead><tr><th>Hari</th>${j.sesi.map((s, i) => `<th>Sesi ${i + 1}<small>${s.mulai}–${s.selesai}</small></th>`).join("")}</tr></thead>
    <tbody>${j.hari.map((t) => `<tr class="${t === t0 ? "asal" : ""}"><th><div class="ju-pt-hari"><span>${_juTgl(t).toLocaleDateString("id-ID", { weekday: "long" })}</span><b>${_juTgl(t).getDate()}</b><small>${_juTgl(t).toLocaleDateString("id-ID", { month: "short" })} · ${beban(t)} ujian</small></div></th>${j.sesi.map((s, i) => sel(t, s, i)).join("")}</tr>`).join("")}</tbody></table></div>`, { lebar: true });
}
// Tukar selalu dikonfirmasi dulu
async function juTukarTanya(a, b) {
  const j = JU.edit, A = _juLabelSlot(j.slot[a]), B = _juLabelSlot(j.slot[b]);
  const posisi = (k) => { const [t, sid] = k.split("|"); return `${_juHariPendek(t)} · Sesi ${j.sesi.findIndex((s) => s.id === sid) + 1}`; };
  const ok = await konfirmasiTema(`Yakin tukar jam <b>${_juEsc(A)}</b> (${posisi(a)}) dengan <b>${_juEsc(B)}</b> (${posisi(b)})?<br><small>Pengawas tetap di sesinya masing-masing.</small>`, { ikon: "🔁", judul: "Tukar Jadwal Ujian", teksYa: "Ya, Tukar", teksTidak: "Batal" });
  if (ok) juTukarKe(a, b);
}
function juPindahKe(asal, tujuan) {
  const j = JU.edit, x = j.slot[asal]; if (!x) return;
  const [t, sid, kelasId] = tujuan.split("|");
  const ikut = (x.p || []).filter((g) => !_juBentrok(j, t, sid, kelasId, g).length), lepas = (x.p || []).filter((g) => !ikut.includes(g));
  j.slot[tujuan] = { ...x, p: ikut };
  delete j.slot[asal];
  closeModal(); _juTandai(); JU.hari = t; _juGambarEditor();
  toast(`↔️ ${_juLabelSlot(j.slot[tujuan])} dipindah ke ${_juHariPendek(t)}${lepas.length ? ` · ${lepas.length} pengawas dilepas karena bentrok (${lepas.map(_juNamaGuru).join(", ")})` : ""}. Tekan 💾 Simpan.`, lepas.length ? "info" : "ok");
}
function juTukarKe(a, b) {
  _juTukarSlot(a, b); closeModal(); _juTandai(); _juGambarEditor();
  toast("🔁 Posisi mapel ditukar. Tekan 💾 Simpan.", "ok");
}
function _juLepasPengawas(kunci, guruId) { const s = JU.edit.slot[kunci]; if (!s) return; s.p = (s.p || []).filter((g) => g !== guruId); _juTandai(); _juGambarEditor(); }
function _juToggleHari(t, on) { const h = new Set(JU.edit.hari); on ? h.add(t) : h.delete(t); JU.edit.hari = [...h].sort(); _juTandai(); _juGambarEditor(); }
function _juToggleKelas(k, on) { const urut = _juKelasBawaan(); const s = new Set(JU.edit.kelas); on ? s.add(k) : s.delete(k); JU.edit.kelas = urut.filter((x) => s.has(x)); _juTandai(); _juGambarEditor(); }
function _juTambahSesi() { const n = JU.edit.sesi.length + 1, akhir = JU.edit.sesi[n - 2]?.selesai || "09:00"; JU.edit.sesi.push({ id: "s" + _juId(), mulai: akhir, selesai: akhir }); _juTandai(); _juGambarEditor(); }
function _juHapusSesi(i) { const id = JU.edit.sesi[i].id; JU.edit.sesi.splice(i, 1); Object.keys(JU.edit.slot).forEach((k) => { if (k.split("|")[1] === id) delete JU.edit.slot[k]; }); _juTandai(); _juGambarEditor(); }
async function _juTutupEditor() {
  if (JU.dirty && !(await konfirmasiTema("Ada perubahan yang belum disimpan. Tinggalkan tanpa menyimpan?", { ikon: "⚠️", judul: "Belum disimpan" }))) return;
  JU.edit = null; JU.dirty = false; _juGambarDaftar();
}

// ── PISAHKAN MAPEL GABUNGAN di jadwal yang sudah disusun ──
// Slot "Geografi/Sosiologi/Ek" (belum dipisah) → mapel pertama tetap di slotnya, mapel lain ditaruh di sesi
// kosong kelas yang sama: hari dengan ujian paling sedikit, paling dekat dengan hari aslinya. Pengawas ikut.
function _juGabunganBelumPisah(j) {
  return Object.entries(j.slot || {}).filter(([k, s]) => { const [t] = k.split("|"); return s?.m && !s.sub && j.hari.includes(t) && _juSubs(s.m).length; });
}
function _juPisahkan(j) {
  const hasil = { dipisah: 0, sisa: [], tanpaPengawas: [] };
  _juGabunganBelumPisah(j).forEach(([kunci, s]) => {
    const [t0, , kelasId] = kunci.split("|"), subs = _juSubs(s.m);
    s.sub = subs[0];
    subs.slice(1).forEach((sub) => {
      const jumlahHari = (t) => j.sesi.filter((x) => _juLabelSlot(j.slot[_juKunci(t, x.id, kelasId)])).length;
      const jarak = (t) => Math.abs(_juTgl(t) - _juTgl(t0)) / 86400000 + (t < t0 ? 0.5 : 0); // seri → pilih sesudahnya
      const hari = j.hari.slice().sort((a, b) => jumlahHari(a) - jumlahHari(b) || jarak(a) - jarak(b));
      let taruh = null;
      for (const t of hari) { const sesi = j.sesi.find((x) => !_juLabelSlot(j.slot[_juKunci(t, x.id, kelasId)])); if (sesi) { taruh = _juKunci(t, sesi.id, kelasId); break; } }
      if (!taruh) { hasil.sisa.push(`Kelas ${_juAngkaKelas(kelasId)}: ${sub}`); return; }
      // pengawas disalin, kecuali yang di sesi itu sudah mengawas kelas lain (bentrok)
      const [tt, ss] = taruh.split("|");
      const p = (s.p || []).filter((gid) => !_juBentrok(j, tt, ss, kelasId, gid).length);
      if ((s.p || []).length && !p.length) hasil.tanpaPengawas.push(`Kelas ${_juAngkaKelas(kelasId)}: ${sub} (${_juHariPendek(tt)})`);
      j.slot[taruh] = { m: s.m, sub, teks: "", p, ...(s.ruang ? { ruang: s.ruang } : {}) };
      hasil.dipisah++;
    });
  });
  return hasil;
}
async function juPisahGabungan(jadwalId) {
  const diEditor = JU.edit && (!jadwalId || JU.edit.id === jadwalId);
  const j = diEditor ? JU.edit : JU.daftar.find((x) => x.id === jadwalId); if (!j) return;
  const daftar = _juGabunganBelumPisah(j);
  if (!daftar.length) { toast("Semua mapel gabungan sudah dipisah ✓", "ok"); return; }
  const contoh = [...new Set(daftar.map(([k, s]) => `${_juNamaMapel(s.m)} (Kelas ${_juAngkaKelas(k.split("|")[2])})`))];
  if (!(await konfirmasiTema(`Pisahkan <b>${daftar.length} ujian mapel gabungan</b> menjadi ujian per mapel?<br><small>${contoh.map(_juEsc).join(", ")}</small><br><br>Mapel pertama tetap di jadwalnya; mapel lain ditaruh di sesi kosong kelas yang sama (hari yang paling longgar). Pengawas ikut disalin.`, { ikon: "🔀", judul: "Pisahkan mapel gabungan", teksYa: "Pisahkan" }))) return;
  const salinan = JSON.parse(JSON.stringify(j));
  const hasil = _juPisahkan(salinan);
  if (diEditor) { JU.edit = salinan; _juTandai(); _juGambarEditor(); }
  else {
    try {
      setGlobalLoading(true, "Memisahkan & menyimpan…");
      const terbaru = await _kvAmbil(_JU_KUNCI, []);
      JU.daftar = (Array.isArray(terbaru) ? terbaru : []).filter((x) => x.id !== salinan.id).concat([salinan]);
      await _juSimpanSemua();
    } catch (e) { toast("Gagal menyimpan: " + (e.message || e), "err"); return; }
    finally { setGlobalLoading(false); }
    JU._pribadi = null; _juGambarDaftar();
  }
  openModal(`<h3>🔀 Mapel gabungan dipisah</h3><p>${hasil.dipisah} ujian mapel baru ditempatkan${diEditor ? " — tekan <b>💾 Simpan</b> di editor" : " dan tersimpan"}.</p>
    ${hasil.sisa.length ? `<div class="ju-susun-sisa"><b>⚠️ ${hasil.sisa.length} mapel belum dapat tempat</b> (sesi kelasnya penuh). Tambah sesi/hari di ⚙️ Pengaturan jadwal lalu tekan Pisahkan lagi:<ul>${hasil.sisa.map((x) => `<li>${_juEsc(x)}</li>`).join("")}</ul></div>` : `<p class="ju-ket">Semua mapel sudah dapat jadwal. Periksa lagi di papan jadwal.</p>`}
    ${hasil.tanpaPengawas.length ? `<div class="ju-susun-sisa"><b>👤 ${hasil.tanpaPengawas.length} ujian perlu pengawas</b> (pengawas aslinya sudah bertugas di kelas lain pada sesi itu). Pilih pengawasnya di editor:<ul>${hasil.tanpaPengawas.map((x) => `<li>${_juEsc(x)}</li>`).join("")}</ul></div>` : ""}
    <button class="btn btn-accent" style="width:100%" onclick="closeModal()">Oke</button>`);
}
async function juSimpanEditor() {
  const j = JU.edit; if (!j) return;
  // buang slot yang tidak lagi dipakai (hari/kelas/sesi dicabut)
  Object.keys(j.slot).forEach((k) => { const [t, s, kl] = k.split("|"); if (!j.hari.includes(t) || !j.kelas.includes(kl) || !j.sesi.some((x) => x.id === s)) delete j.slot[k]; });
  if (j.hari.length) { j.mulai = j.hari[0]; j.selesai = j.hari[j.hari.length - 1]; }
  try {
    setGlobalLoading(true, "Menyimpan jadwal ujian…");
    const terbaru = await _kvAmbil(_JU_KUNCI, []); // gabung dengan versi server (admin lain mungkin menyimpan jadwal lain)
    JU.daftar = (Array.isArray(terbaru) ? terbaru : []).filter((x) => x.id !== j.id).concat([JSON.parse(JSON.stringify(j))]);
    await _juSimpanSemua();
    JU.dirty = false; _juTandai(true);
    toast("Jadwal ujian tersimpan ✓", "ok");
  } catch (e) { toast("Gagal menyimpan: " + (e.message || e), "err"); }
  finally { setGlobalLoading(false); }
}
async function _juSalinHari() {
  const j = JU.edit, dari = JU.hari, tujuan = j.hari.filter((t) => t !== dari);
  if (!tujuan.length) { toast("Hanya ada satu hari ujian", "info"); return; }
  openModal(`<h3>📋 Salin ${_juHariPendek(dari)} ke…</h3><div class="ju-cek" style="flex-direction:column;">${tujuan.map((t) => `<label><input type="checkbox" class="ju-salin" value="${t}"/> ${_juHariPanjang(t)}</label>`).join("")}</div>
    <label class="je-opsi" style="margin-top:8px;"><input type="checkbox" id="ju-salin-p"/> <span>Ikut Salin Pengawas</span></label>
    <button class="btn btn-accent" style="width:100%;margin-top:10px;" onclick="_juSalinHariJalankan('${dari}')">Salin (Menimpa Hari Tujuan)</button>`);
}
function _juSalinHariJalankan(dari) {
  const j = JU.edit, ikutP = qs("ju-salin-p").checked;
  qsa(".ju-salin").filter((c) => c.checked).forEach((c) => {
    Object.keys(j.slot).filter((k) => k.startsWith(c.value + "|")).forEach((k) => delete j.slot[k]);
    Object.entries(j.slot).filter(([k]) => k.startsWith(dari + "|")).forEach(([k, s]) => { j.slot[c.value + k.slice(dari.length)] = { ...s, p: ikutP ? [...(s.p || [])] : [] }; });
  });
  closeModal(); _juTandai(); _juGambarEditor(); toast("Disalin ✓ — jangan lupa Simpan", "ok");
}

// ── Memilih pengawas ──
function juPilihPengawas(kunci) {
  const j = JU.edit, [tgl, sesiId, kelasId] = kunci.split("|"), x = j.slot[kunci] || {};
  const beban = _juBeban(j), pengampu = new Set(x.m ? (_juMapelDiKelas(kelasId)[x.m] || []) : []);
  const pengajarKelas = new Set(JU.ajar.filter((a) => a.kelas_id === kelasId).map((a) => a.guru_id));
  const guru = (LOOKUP.guruAll || []).filter((g) => g.status_aktif !== false);
  const baris = (g) => {
    const bentrok = _juBentrok(j, tgl, sesiId, kelasId, g.id), dipilih = (x.p || []).includes(g.id);
    return `<label class="ju-pg ${bentrok.length ? "bentrok" : ""}"><input type="checkbox" class="ju-pg-cek" value="${g.id}" ${dipilih ? "checked" : ""}/><span class="ju-pg-nama">${_juEsc(g.nama)}${pengampu.has(g.id) ? ' <em class="ju-tag">Pengampu Mapel</em>' : pengajarKelas.has(g.id) ? ' <em class="ju-tag abu">Mengajar Kelas Ini</em>' : ""}</span><span class="ju-pg-info">${bentrok.length ? `⚠️ mengawas Kelas ${bentrok.map(_juAngkaKelas).join(", ")}` : ""} ${beban[g.id] || 0}×</span></label>`;
  };
  const urut = (a, b) => (beban[a.id] || 0) - (beban[b.id] || 0) || a.nama.localeCompare(b.nama, "id");
  const kel1 = guru.filter((g) => pengampu.has(g.id) || pengajarKelas.has(g.id)).sort(urut), kel2 = guru.filter((g) => !pengampu.has(g.id) && !pengajarKelas.has(g.id)).sort(urut);
  openModal(`<h3>📋 Pengawas · Kelas ${_juEsc(_juAngkaKelas(kelasId))}</h3>
    <div style="font-size:11.5px;color:var(--text-secondary);margin:-8px 0 8px;">${_juHariPanjang(tgl)} · ${_juEsc(_juLabelSlot(x))} · angka = jumlah mengawas</div>
    <input class="input" placeholder="Cari nama…" oninput="qsa('.ju-pg').forEach(l=>l.style.display=l.textContent.toLowerCase().includes(this.value.toLowerCase())?'':'none')"/>
    <div class="ju-pg-daftar">${kel1.length ? `<div class="ju-sub">Guru di kelas ini</div>${kel1.map(baris).join("")}` : ""}<div class="ju-sub">Guru lain</div>${kel2.map(baris).join("")}</div>
    <div class="field" style="margin-top:8px;"><label class="form-label">Ruang (Opsional)</label><input id="ju-ruang" class="input" value="${_juEsc(x.ruang || "")}" placeholder="mis. Ruang 2 / Aula"/></div>
    <button class="btn btn-accent" style="width:100%;margin-top:10px;" onclick="_juSimpanPengawas('${kunci}')">Pilih</button>`, { lebar: true });
}
function _juSimpanPengawas(kunci) {
  const s = (JU.edit.slot[kunci] = JU.edit.slot[kunci] || {});
  s.p = qsa(".ju-pg-cek").filter((c) => c.checked).map((c) => c.value);
  s.ruang = qs("ju-ruang")?.value.trim() || "";
  closeModal(); _juTandai(); _juGambarEditor();
}
// Isi otomatis: slot berisi mapel tanpa pengawas → guru dengan beban paling sedikit, tidak bentrok di sesi yang
// sama; diutamakan BUKAN pengampu mapel tsb (lebih objektif), kemudian guru yang mengajar di kelas itu.
async function juIsiPengawasOtomatis() {
  const j = JU.edit;
  const pakaiSemuaHari = await konfirmasiTema("Isi pengawas otomatis untuk SEMUA hari? (Pilih Batal untuk hari ini saja.)", { ikon: "⚡", judul: "Isi pengawas otomatis", teksYa: "Semua hari", teksTidak: "Hari ini saja" });
  const hari = pakaiSemuaHari ? j.hari : [JU.hari];
  const guru = (LOOKUP.guruAll || []).filter((g) => g.status_aktif !== false).map((g) => g.id);
  const beban = _juBeban(j);
  let n = 0;
  hari.forEach((t) => j.sesi.forEach((s) => j.kelas.forEach((k) => {
    const kunci = _juKunci(t, s.id, k), x = j.slot[kunci];
    if (!_juLabelSlot(x) || (x.p || []).length) return;
    const pengampu = new Set(x.m ? (_juMapelDiKelas(k)[x.m] || []) : []);
    const diKelas = new Set(JU.ajar.filter((a) => a.kelas_id === k).map((a) => a.guru_id));
    const calon = guru.filter((g) => !_juBentrok(j, t, s.id, k, g).length).sort((a, b) =>
      (beban[a] || 0) - (beban[b] || 0) || (pengampu.has(a) - pengampu.has(b)) || (diKelas.has(b) - diKelas.has(a)));
    if (!calon.length) return;
    x.p = [calon[0]]; beban[calon[0]] = (beban[calon[0]] || 0) + 1; n++;
  })));
  _juTandai(); _juGambarEditor();
  toast(n ? `⚡ ${n} slot diisi pengawas — periksa lalu Simpan` : "Semua slot sudah ada pengawasnya", n ? "ok" : "info");
}

// ── Tugas mengawas per guru (Dasbor & halaman) ──
function _juTugasGuru(guruId, dari, sampai) {
  if (!guruId) return [];
  const out = [];
  JU.daftar.forEach((j) => Object.entries(j.slot || {}).forEach(([k, s]) => {
    const [t, sesiId, kelasId] = k.split("|");
    if (!(s.p || []).includes(guruId) || !j.hari.includes(t) || !_juLabelSlot(s)) return;
    if ((dari && t < dari) || (sampai && t > sampai)) return;
    const sesi = j.sesi.find((x) => x.id === sesiId); if (!sesi) return;
    out.push({ j, t, sesi: _juSesiPada(j, t, sesi), ke: j.sesi.indexOf(sesi) + 1, kelasId, s, kunci: k });
  }));
  return out.sort((a, b) => a.t.localeCompare(b.t) || a.sesi.mulai.localeCompare(b.sesi.mulai));
}
const _juJamWita = () => new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Makassar", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date());
const _juMenit = (hhmm) => { const [h, m] = String(hhmm || "0:0").split(":").map(Number); return h * 60 + (m || 0); };
function _juHtmlTugas(tugas, denganTombol) {
  const hariIni = tanggalISO(), jam = _juMenit(_juJamWita());
  return `<div class="ju-tugas">${tugas.map((x) => {
    const hadir = JU._hadir?.[x.j.id]?.[`${x.kunci}|${STATE.guruId}`];
    const bisa = x.t === hariIni && jam >= _juMenit(x.sesi.mulai) - 30 && jam <= _juMenit(x.sesi.selesai);
    const status = hadir ? `<span class="badge badge-green">✓ Hadir ${new Date(hadir.t).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</span>`
      : x.t < hariIni || (x.t === hariIni && jam > _juMenit(x.sesi.selesai)) ? `<span class="badge badge-red">Tidak Tercatat</span>`
      : denganTombol && bisa ? `<button class="btn btn-accent btn-sm" onclick="juAbsenMengawas('${x.j.id}','${x.kunci}')">✋ Absen Mengawas</button>`
      : `<span class="badge badge-gray">${x.t === hariIni ? "Buka 30 Menit Sebelum Mulai" : "Akan Datang"}</span>`;
    return `<div class="ju-tugas-baris" style="--kw:${_juWarnaKelas(x.kelasId)}"><span class="ju-kls">${_juEsc(_juAngkaKelas(x.kelasId))}</span><div><b>${_juEsc(_juLabelSlot(x.s))} · Kelas ${_juEsc(_juAngkaKelas(x.kelasId))}</b><small>${_juHariPendek(x.t)} · Sesi ${x.ke} (${x.sesi.mulai}–${x.sesi.selesai})${x.s.ruang ? " · Ruang " + _juEsc(x.s.ruang) : ""} · ${_juEsc(x.j.judul)}</small></div>${status}</div>`;
  }).join("")}</div>`;
}
async function _juMuatHadir(ids) {
  JU._hadir = JU._hadir || {};
  await Promise.all(ids.map(async (id) => { JU._hadir[id] = await _kvAmbil("ujian:hadir:" + id, {}); }));
}
async function juAbsenMengawas(jadwalId, kunci) {
  try {
    setGlobalLoading(true, "Mencatat kehadiran mengawas…");
    const k = `${kunci}|${STATE.guruId}`;
    const data = await _kvAmbil("ujian:hadir:" + jadwalId, {});
    if (!data[k]) { data[k] = { t: new Date().toISOString(), oleh: STATE.guruNama || "" }; await _kvSimpan("ujian:hadir:" + jadwalId, data); }
    (JU._hadir = JU._hadir || {})[jadwalId] = data;
    toast("✓ Kehadiran mengawas tercatat. Barakallahu fiik", "ok");
    if (STATE.currentPage === "dashboard") _juSisipkanKartuDasbor(); else if (qs("ju-wadah")) _juGambarDaftar();
  } catch (e) { toast("Gagal mencatat: " + (e.message || e), "err"); }
  finally { setGlobalLoading(false); }
}

// ── Kartu Dasbor: tugas mengawas hari ini & 7 hari ke depan ──
async function _juSisipkanKartuDasbor() {
  try {
    const page = qs("page-dashboard"); if (!page || !STATE.guruId) return;
    if (!JU.daftar.length) { JU.daftar = await _kvAmbil(_JU_KUNCI, []); await ensureLookups(); }
    const hariIni = tanggalISO(), sampai = _juIso(new Date(Date.now() + 7 * 86400000));
    const tugas = _juTugasGuru(STATE.guruId, hariIni, sampai);
    page.querySelector("#ju-dasbor")?.remove();
    if (!tugas.length) return;
    await _juMuatHadir([...new Set(tugas.map((x) => x.j.id))]);
    const div = document.createElement("div");
    div.id = "ju-dasbor"; div.className = "card ju-dasbor";
    const adaHariIni = tugas.some((x) => x.t === hariIni);
    div.innerHTML = `<div class="ju-sub">📋 ${adaHariIni ? "Jadwal mengawas hari ini" : "Jadwal mengawas pekan ini"}</div>${_juHtmlTugas(tugas.slice(0, 6), true)}<a class="ju-link" href="#" onclick="event.preventDefault();showPage('jadwal-ujian','page-jadwal-ujian','menuJadwalUjian')">Lihat Jadwal Ujian Lengkap →</a>`;
    const sesudah = page.querySelector("#pg-ingat") || page.querySelector(".dash-hero");
    if (sesudah) sesudah.after(div); else page.appendChild(div);
  } catch (e) { console.warn("Kartu mengawas gagal:", e); }
}
(function pasangKartuDasbor() {
  const coba = () => {
    if (typeof window.renderDashboard !== "function" || window.renderDashboard._ju) return;
    const asli = window.renderDashboard;
    window.renderDashboard = async function (...a) { const r = await asli.apply(this, a); setTimeout(_juSisipkanKartuDasbor, 300); return r; };
    window.renderDashboard._ju = true;
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", coba); else coba();
  setTimeout(coba, 1500);
})();

// ── Rekap kehadiran pengawas ──
async function juRekapHadir(id) {
  const j = JU.daftar.find((x) => x.id === id); if (!j) return;
  await _juMuatHadir([id]);
  const hadir = JU._hadir[id] || {}, hariIni = tanggalISO();
  const per = {};
  Object.entries(j.slot).forEach(([k, s]) => {
    const [t] = k.split("|"); if (!j.hari.includes(t) || !_juLabelSlot(s)) return;
    (s.p || []).forEach((g) => { const x = (per[g] = per[g] || { tugas: 0, lewat: 0, hadir: 0 }); x.tugas++; if (t <= hariIni) x.lewat++; if (typeof _jmLengkap === "function" ? _jmLengkap(id, k, g) : hadir[`${k}|${g}`]) x.hadir++; });
  });
  const baris = Object.entries(per).sort((a, b) => _juNamaGuru(a[0]).localeCompare(_juNamaGuru(b[0]), "id"));
  openModal(`<h3>✅ Kehadiran Pengawas</h3><div style="font-size:11.5px;color:var(--text-secondary);margin:-8px 0 10px;">${_juEsc(j.judul)} · dihitung dari tugas yang tanggalnya sudah tiba · lengkap = absen masuk + jurnal + absen pulang (yang dihitung insentif)</div>
    <table class="simple-table" style="width:100%;font-size:12px;"><thead><tr><th>Guru</th><th>Tugas</th><th>Sudah tiba</th><th title="Absen masuk + jurnal + absen pulang">Lengkap</th><th>%</th></tr></thead><tbody>
    ${baris.map(([g, x]) => `<tr><td>${_juEsc(_juNamaGuru(g))}</td><td>${x.tugas}</td><td>${x.lewat}</td><td>${x.hadir}</td><td><b>${x.lewat ? Math.round((x.hadir / x.lewat) * 100) : "-"}${x.lewat ? "%" : ""}</b></td></tr>`).join("") || `<tr><td colspan="5">Belum ada pengawas.</td></tr>`}
    </tbody></table>`, { lebar: true });
}

// ── Bagikan ke WA ──
function juBagikanWa(id) {
  const j = JU.daftar.find((x) => x.id === id); if (!j) return;
  const per = {};
  Object.entries(j.slot).forEach(([k, s]) => { const [t, sesiId, kelasId] = k.split("|"); if (!j.hari.includes(t) || !_juLabelSlot(s)) return; (s.p || []).forEach((g) => (per[g] = per[g] || []).push({ t, sesi: _juSesiPada(j, t, j.sesi.find((x) => x.id === sesiId)), ke: j.sesi.findIndex((x) => x.id === sesiId) + 1, kelasId, s })); });
  const tag = (g) => { const n = typeof normalisasiNomorWa === "function" ? normalisasiNomorWa(_juGuru(g)?.no_wa) : null; return n?.valid ? ` @${n.nomor}` : ""; };
  const daftar = Object.entries(per).sort((a, b) => _juNamaGuru(a[0]).localeCompare(_juNamaGuru(b[0]), "id")).map(([g, xs], i) =>
    `${i + 1}. *${_juNamaGuru(g)}*${tag(g)}\n` + xs.sort((a, b) => a.t.localeCompare(b.t) || a.ke - b.ke).map((x) => `     ▪️ ${_juHariPendek(x.t)}, sesi ${x.ke} (${x.sesi?.mulai}–${x.sesi?.selesai}) — Kelas ${_juAngkaKelas(x.kelasId)}, ${_juLabelSlot(x.s)}`).join("\n")).join("\n\n");
  const tautan = `${location.origin}${location.pathname}?buka=jadwalujian`;
  const teks = `✳️ *JADWAL PENGAWAS ${String(j.judul).toUpperCase()}*\n\nAssalamu'alaikum warahmatullahi wabarakatuh.\nBerikut jadwal mengawas ${_juHariPanjang(j.mulai)}${j.selesai !== j.mulai ? " s.d. " + _juHariPanjang(j.selesai) : ""}:\n\n${daftar || "(belum ada pengawas)"}\n\nSelama ujian, KBM kelas libur. Mohon hadir 15 menit sebelum sesi dan tekan *Absen Mengawas* di aplikasi.\nJadwal lengkap & PDF: ${tautan}\n\nJazakumullahu khairan.`;
  window.open("https://wa.me/?text=" + encodeURIComponent(teks), "_blank", "noopener");
}

// ── CETAK / PDF (pedoman: Minimalist Islamic Academic, A4 lanskap) ──
async function juCetakPdf(id, dariEditor) {
  const wJendela = window.open("", "_blank"); // dibuka segera (sebelum menunggu data) supaya tidak diblokir browser
  if (wJendela) wJendela.document.write("<p style='font-family:sans-serif;padding:20px'>Menyiapkan jadwal…</p>");
  const j = dariEditor && JU.edit?.id === id ? JU.edit : JU.daftar.find((x) => x.id === id); if (!j) { wJendela?.close(); return; }
  const ttd = await _kvAmbil(_JU_TTD, null).catch(() => null);
  const p = STATE.pengaturan || {};
  const logo = p.logo_kiri_url || p.logo_kanan_url || (typeof urlLogoSekolah === "function" ? urlLogoSekolah() : "");
  const lembaga = (p.nama_lembaga_kop || "Rumah Tahfizh Al Umm Putra Barabai").toUpperCase();
  const e = _juEsc;
  const hijri = (t) => (typeof tanggalHijriahHariIni === "function" ? tanggalHijriahHariIni(new Date(t + "T12:00:00")) : "");
  // hanya hari yang sudah berisi mapel (hari kosong tidak ikut dicetak)
  const hariTerisi = j.hari.filter((t) => j.sesi.some((s) => j.kelas.some((k) => _juLabelSlot(j.slot[_juKunci(t, s.id, k)]))));
  const blokHari = (hariTerisi.length ? hariTerisi : j.hari).map((t) => `<section class="hari">
      <h3><span class="garis"></span>${e(_juHariPanjang(t))}${hijri(t) ? `<small> · ${e(hijri(t))}</small>` : ""}</h3>
      <table><thead><tr><th class="sesi">Sesi / Waktu</th>${j.kelas.map((k) => `<th class="thk" style="background:${_juWarnaKelas(k)}">Kelas ${e(_juAngkaKelas(k))}</th>`).join("")}</tr></thead>
      <tbody>${j.sesi.map((s, i) => (j.kelas.some((k) => _juLabelSlot(j.slot[_juKunci(t, s.id, k)])) || !hariTerisi.length) ? `<tr><td class="sesi"><b>Sesi ${i + 1}</b><br/>${_juJamTeks(j, t, s)}</td>${j.kelas.map((k) => { const x = j.slot[_juKunci(t, s.id, k)]; const l = _juLabelSlot(x); return `<td style="background:${_juWarnaKelas(k)}12">${l ? `<div class="mp">${e(l)}</div>${x.ruang ? `<div class="kc">Ruang ${e(x.ruang)}</div>` : ""}<div class="pw">${(x.p || []).map((g) => e(_juNamaGuru(g))).join(", ") || "—"}</div>` : "–"}</td>`; }).join("")}</tr>` : "").join("")}</tbody></table>
    </section>`).join("");
  const per = {};
  Object.entries(j.slot).forEach(([k, s]) => { const [t, sesiId, kelasId] = k.split("|"); if (!j.hari.includes(t) || !_juLabelSlot(s)) return; (s.p || []).forEach((g) => (per[g] = per[g] || []).push(`${_juHariPendek(t)} S${j.sesi.findIndex((x) => x.id === sesiId) + 1} K${_juAngkaKelas(kelasId)}`)); });
  const rekap = Object.entries(per).sort((a, b) => _juNamaGuru(a[0]).localeCompare(_juNamaGuru(b[0]), "id"));
  const html = `<!doctype html><html lang="id"><head><meta charset="utf-8"><title>${e(j.judul)}</title><style>
    @page{size:A4 landscape;margin:12mm}
    *{box-sizing:border-box}body{font-family:"Segoe UI","Source Sans 3",Arial,sans-serif;color:#1F2328;margin:0;font-size:10pt}
    .kop{display:flex;align-items:center;gap:14px;padding-bottom:8px;border-bottom:3px double #1F5A3D;margin-bottom:10px}
    .kop img{width:16mm;height:16mm;object-fit:contain}
    .lem{color:#1F5A3D;font-weight:700;letter-spacing:2px;font-size:11pt}
    .jdl{color:#1B2A41;font-weight:800;font-size:15pt;margin-top:2px}
    .ket{color:#5B6470;font-size:9.5pt}
    .hari{break-inside:avoid;margin:0 0 10px}
    h3{font-size:11pt;color:#1B2A41;margin:8px 0 5px;display:flex;align-items:center;gap:6px}h3 small{color:#5B6470;font-weight:400}
    .garis{display:inline-block;width:4px;height:14px;background:#1F5A3D;border-radius:2px}
    table{width:100%;border-collapse:collapse;table-layout:fixed}
    th,td{border:.6pt solid #8C9792;padding:5px 6px;vertical-align:top;font-variant-numeric:tabular-nums}
    thead th{background:#E3EAE6;color:#1B2A41;font-size:9.5pt;text-align:center}
    thead th.thk{color:#fff;font-weight:800;letter-spacing:.3px;-webkit-print-color-adjust:exact;print-color-adjust:exact}
    td{text-align:center;vertical-align:middle}td{-webkit-print-color-adjust:exact;print-color-adjust:exact}

    td.sesi,th.sesi{width:26mm;text-align:center;color:#1B2A41}
    .mp{font-weight:700;color:#1B2A41}.kc{font-size:8.5pt;color:#5B6470}.pw{font-size:9pt;margin-top:3px}
    .rekap{break-inside:avoid;margin-top:12px}.rekap table td{font-size:9.5pt}
    .catatan{font-size:9pt;color:#5B6470;margin-top:8px}
    .ttd{display:flex;justify-content:flex-end;margin-top:14px;font-size:10pt}.ttd div{text-align:center;width:65mm}.ttd small{display:block;color:#5B6470;font-size:7.5pt;margin-top:2px}
    footer{position:fixed;bottom:0;left:0;right:0;font-size:7.5pt;color:#5B6470;border-top:.4pt solid #8C9792;padding-top:3px;display:flex;justify-content:space-between}
  </style></head><body>
    <div class="kop">${logo ? `<img src="${e(logo)}" alt=""/>` : ""}<div><div class="lem">${e(lembaga)}</div><div class="jdl">JADWAL ${e(String(j.judul).toUpperCase())}</div><div class="ket">${e(_juHariPanjang(j.mulai))}${j.selesai !== j.mulai ? " – " + e(_juHariPanjang(j.selesai)) : ""} · Tahun Ajaran ${e(typeof hitungTahunAjaranOtomatis === "function" ? hitungTahunAjaranOtomatis() : "")}</div></div></div>
    ${blokHari}
    <section class="rekap"><h3><span class="garis"></span>Daftar Tugas Pengawas</h3><table><thead><tr><th style="width:8mm">No</th><th style="width:60mm">Nama</th><th style="width:16mm">Jumlah</th><th>Hari · Sesi · Kelas</th></tr></thead><tbody>
      ${rekap.map(([g, xs], i) => `<tr><td style="text-align:center">${i + 1}</td><td>${e(_juGuru(g)?.nama || "-")}</td><td style="text-align:center">${xs.length}</td><td>${e(xs.join(" · "))}</td></tr>`).join("") || `<tr><td colspan="4">Belum ada pengawas.</td></tr>`}
    </tbody></table>
    <div class="catatan">Catatan: selama hari ujian, KBM kelas diliburkan. Pengawas hadir 15 menit sebelum sesi dan mengisi Absen Mengawas di aplikasi.${j.catatan ? " " + e(j.catatan) : ""}</div>
    <div class="ttd"><div>Barabai, ${e(new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }))}<br/>Kepala Sekolah<br/>${ttd?.img ? `<img src="${ttd.img}" alt="tanda tangan" style="height:22mm;max-width:60mm;object-fit:contain;display:block;margin:2px auto"/>` : "<br/><br/><br/>"}<b>${e(ttd?.nama || p.kepala_pkbm || (typeof _namaPejabat === "function" ? _namaPejabat(p) : "") || "")}</b>${ttd?.img ? `<small>Ditandatangani elektronik · ${e(new Date(ttd.t).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }))}</small>` : ""}</div></div></section>
    <footer><span>${e(j.judul)} · ${e(lembaga)}</span><span>Dicetak ${e(new Date().toLocaleString("id-ID"))}</span></footer>
    <script>window.onload=function(){setTimeout(function(){window.print()},400)}<\/script>
  </body></html>`;
  const w = wJendela;
  if (!w) { toast("Izinkan pop-up untuk mencetak / simpan PDF", "err"); return; }
  w.document.open(); w.document.write(html); w.document.close();
  toast("Pilih \"Simpan sebagai PDF\" di jendela cetak untuk membuat file PDF", "ok");
}

// ── SUSUN OTOMATIS DARI JADWAL PELAJARAN ────────────────────
// Aturan: tiap mapel diujikan di HARI PERTAMA mapel itu muncul di jadwal pelajaran kelasnya
// (mapel dobel / lebih dari sekali sepekan cukup sekali). Maksimal N mapel sehari; kelas yang punya
// pelajaran SORE boleh 1 mapel lagi (sesi sore). Kelebihan dialihkan ke hari yang sama pekan berikutnya,
// kalau masih penuh ke hari ujian lain yang masih longgar (pekan kedua didahulukan).
const _JU_NAMA_HARI = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const _JU_LEWATI_MAPEL = /muhadh|muhad[oa]r|tahfi|ekskul|ekstra|pramuka|upacara|apel|halaqah|kultum/i;
// Mapel diujikan? Diatur per jadwal di ⚙️ Pengaturan (j.mapelTidak = daftar mapel yang TIDAK diujikan).
// Bila belum pernah diatur, bawaan: kegiatan non-ujian (tahfizh, muhadhoroh, ekskul, dll.) tidak diujikan.
function _juDiujikan(j, m) { const b = String(m || "").split("::")[0]; if (j && Array.isArray(j.mapelTidak)) return !j.mapelTidak.includes(b); return !_JU_LEWATI_MAPEL.test(_juNamaMapel(b)); }
function _juMapelSemuaKelas(j) { const s = new Set(); (j.kelas || []).forEach((k) => Object.keys(_juMapelDiKelas(k)).forEach((m) => s.add(m))); return [...s].filter((m) => _juNamaMapel(m)).sort((a, b) => _juNamaMapel(a).localeCompare(_juNamaMapel(b), "id")); }
function _juJmlMapelUji(j) { const a = _juMapelSemuaKelas(j); return `${a.filter((x) => _juDiujikan(j, x)).length} diujikan · ${a.filter((x) => !_juDiujikan(j, x)).length} tidak diujikan`; }
function _juToggleMapelUji(m, on, el) {
  const j = JU.edit; if (!Array.isArray(j.mapelTidak)) j.mapelTidak = _juMapelSemuaKelas(j).filter((x) => !_juDiujikan(j, x));
  const s = new Set(j.mapelTidak); if (on) s.delete(m); else s.add(m); j.mapelTidak = [...s];
  if (el) el.closest("label").classList.toggle("tidak", !on);
  const n = qs("ju-uji-jml"); if (n) n.textContent = _juJmlMapelUji(j);
  _juTandai();
}
function _juSemuaMapelUji(on) { const j = JU.edit; j.mapelTidak = on ? [] : _juMapelSemuaKelas(j); _juTandai(); _juGambarEditor(); const d = document.querySelector(".ju-atur"); if (d) d.open = true; }
const _juJamSore = (jam) => String(jam || "") >= "13:00";
async function juSusunDariJadwal() {
  const j = JU.edit; if (!j) return;
  let rows;
  try {
    setGlobalLoading(true, "Membaca jadwal pelajaran…");
    rows = await supa.from("jadwal_pelajaran").select("kelas_id,mapel_id,guru_id,hari,jam_mulai").eq("aktif", true).then(unwrap);
  } catch (e) { toast("Gagal membaca jadwal pelajaran: " + (e.message || e), "err"); return; }
  finally { setGlobalLoading(false); }
  JU.susunRows = (rows || []).filter((r) => j.kelas.includes(r.kelas_id) && r.mapel_id);
  if (!JU.susunRows.length) { toast("Jadwal pelajaran kelas peserta masih kosong", "info"); return; }
  const mapelIds = [...new Set(JU.susunRows.map((r) => r.mapel_id))].sort((a, b) => _juNamaMapel(a).localeCompare(_juNamaMapel(b), "id"));
  const adaIsi = Object.values(j.slot || {}).some(_juLabelSlot);
  openModal(`<h3>🪄 Susun dari jadwal pelajaran</h3>
    <div class="ju-susun-ket">Mapel diujikan pada <b>hari pertama</b> mapel itu ada di jadwal pelajaran kelasnya. Mapel dobel cukup sekali. Mapel gabungan (mis. Geografi/Sosiologi/Ekonomi) otomatis dipecah jadi ujian terpisah.</div>
    <div class="ju-susun-baris"><label class="form-label">Maksimal Mapel Sehari</label><select id="jus-maks" class="input"><option>1</option><option selected>2</option><option>3</option></select></div>
    <label class="je-opsi"><input type="checkbox" id="jus-sore" checked/> <span>Kelas yang punya pelajaran sore boleh <b>+1 mapel</b> (sesi sore)</span></label>
    <label class="je-opsi"><input type="checkbox" id="jus-pengampu" checked/> <span>Pengampu Mapel Langsung Jadi Pengawas</span></label>
    ${adaIsi ? `<label class="je-opsi"><input type="checkbox" id="jus-kosongkan" checked/> <span>Kosongkan Dulu Jadwal yang Sudah Terisi</span></label>` : ""}
    <details class="ju-susun-mapel"><summary>Mapel yang diujikan (${mapelIds.length})</summary>
      <div class="ju-cek">${mapelIds.map((m) => `<label><input type="checkbox" class="jus-m" value="${m}" ${_juDiujikan(JU.edit, m) ? "checked" : ""}/> ${_juEsc(_juNamaMapel(m) || "?")}</label>`).join("")}</div>
    </details>
    <div class="ju-susun-ket">Kalau sehari melebihi batas, mapel dipindah ke <b>hari yang sama di pekan kedua</b>, supaya urutannya tetap mirip jadwal pelajaran.</div>
    <button class="btn btn-accent" style="width:100%;margin-top:10px;" onclick="_juSusunJalankan()">Susun Sekarang</button>`);
}
function _juSusunJalankan() {
  const j = JU.edit, rows = JU.susunRows || [];
  const maks = Number(qs("jus-maks").value) || 2, pakaiSore = qs("jus-sore").checked, pakaiPengampu = qs("jus-pengampu").checked;
  const kosongkan = qs("jus-kosongkan") ? qs("jus-kosongkan").checked : false;
  const dipilih = new Set(qsa(".jus-m").filter((c) => c.checked).map((c) => c.value));
  closeModal();
  if (kosongkan) j.slot = {};
  const kelasSore = new Set(rows.filter((r) => _juJamSore(r.jam_mulai)).map((r) => r.kelas_id));
  const batasMaks = maks + (pakaiSore && kelasSore.size ? 1 : 0);
  // pastikan jumlah sesi cukup; sesi tambahan setelah batas = sesi sore
  while (j.sesi.length < batasMaks) {
    const sore = pakaiSore && j.sesi.length === maks;
    const akhir = j.sesi[j.sesi.length - 1]?.selesai || "09:00";
    j.sesi.push(sore ? { id: "s" + _juId(), mulai: "16:00", selesai: "17:00" } : { id: "s" + _juId(), mulai: akhir, selesai: akhir });
  }
  const urutHari = (h) => (_JU_NAMA_HARI.indexOf(h) + 6) % 7; // Senin = 0
  const hariUjian = j.hari.slice().sort();
  const senin0 = (() => { const d = _juTgl(hariUjian[0]); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return d; })();
  const pekanKe = (iso) => Math.floor((_juTgl(iso) - senin0) / 86400000 / 7);
  const sisa = [];
  let terisi = 0;
  j.kelas.forEach((k) => {
    const cap = Math.min(j.sesi.length, maks + (pakaiSore && kelasSore.has(k) ? 1 : 0));
    const pertama = {};
    rows.filter((r) => r.kelas_id === k && dipilih.has(r.mapel_id)).forEach((r) => {
      const key = urutHari(r.hari) * 10000 + _juMenit(r.jam_mulai);
      if (!pertama[r.mapel_id] || key < pertama[r.mapel_id].key) pertama[r.mapel_id] = { key, hari: r.hari, guru: [] };
    });
    rows.filter((r) => r.kelas_id === k && pertama[r.mapel_id]).forEach((r) => { const g = pertama[r.mapel_id].guru; if (r.guru_id && !g.includes(r.guru_id)) g.push(r.guru_id); });
    const isiHari = (t) => j.sesi.slice(0, cap).filter((s) => _juLabelSlot(j.slot[_juKunci(t, s.id, k)])).length;
    const sudahAda = new Set(Object.entries(j.slot).filter(([kk, x]) => kk.endsWith("|" + k) && x && x.m).map(([, x]) => _juKode(x)));
    const taruh = (t, m, info, sub) => {
      const s = j.sesi.slice(0, cap).find((x) => !_juLabelSlot(j.slot[_juKunci(t, x.id, k)])); if (!s) return false;
      j.slot[_juKunci(t, s.id, k)] = { m, ...(sub ? { sub } : {}), teks: "", p: pakaiPengampu ? info.guru.slice(0, 1) : [] };
      terisi++; return true;
    };
    Object.entries(pertama).sort((a, b) => a[1].key - b[1].key).forEach(([m, info]) => {
      (_juSubs(m).length ? _juSubs(m) : [null]).forEach((sub) => {
        if (sudahAda.has(sub ? m + "::" + sub : m)) return;
        const samaHari = hariUjian.filter((t) => _JU_NAMA_HARI[_juTgl(t).getDay()] === info.hari);
        const lain = hariUjian.filter((t) => !samaHari.includes(t)).sort((a, b) => pekanKe(b) - pekanKe(a) || a.localeCompare(b));
        const t = [...samaHari, ...lain].find((x) => isiHari(x) < cap);
        if (!t || !taruh(t, m, info, sub)) sisa.push(`Kelas ${_juAngkaKelas(k)}: ${sub || _juNamaMapel(m)}`);
      });
    });
  });
  _juTandai(); _juGambarEditor();
  const soreIkut = [...kelasSore].filter((k) => j.kelas.includes(k));
  openModal(`<h3>✅ Jadwal tersusun</h3>
    <p>${terisi} mapel ditempatkan di ${hariUjian.length} hari ujian (maks ${maks} sehari${pakaiSore && soreIkut.length ? `, +1 sesi sore untuk Kelas ${soreIkut.map(_juAngkaKelas).join(", ")}` : ""}).</p>
    ${sisa.length ? `<div class="ju-susun-sisa"><b>⚠️ ${sisa.length} mapel belum dapat tempat</b> (hari ujian penuh). Tambah hari/sesi di ⚙️ Pengaturan atau naikkan batas mapel sehari:<ul>${sisa.map((x) => `<li>${_juEsc(x)}</li>`).join("")}</ul></div>` : `<p class="ju-ket">Semua mapel sudah dapat tempat.</p>`}
    <p class="ju-ket">Periksa lagi, ubah bila perlu, lalu tekan <b>💾 Simpan</b>.</p>
    <button class="btn btn-accent" style="width:100%" onclick="closeModal()">Oke, Periksa</button>`);
}

// ── TANDA TANGAN ONLINE KEPALA SEKOLAH ──────────────────────
// Digambar sekali (jari / mouse), disimpan sebagai gambar di kuliah_pengaturan "ttd:kepala_sekolah",
// lalu otomatis muncul di PDF jadwal ujian.
const _JU_TTD = "ttd:kepala_sekolah";
async function juTandaTangan() {
  const lama = await _kvAmbil(_JU_TTD, null).catch(() => null);
  const p = STATE.pengaturan || {};
  const namaBawaan = lama?.nama || p.kepala_pkbm || (typeof _namaPejabat === "function" ? _namaPejabat(p) : "") || "";
  openModal(`<h3>✍️ Tanda tangan Kepala Sekolah</h3>
    ${lama?.img ? `<div class="ju-ttd-lama"><img src="${lama.img}" alt="tanda tangan tersimpan"/><small>Tersimpan ${_juEsc(new Date(lama.t).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }))}</small></div>` : ""}
    <div class="field"><label class="form-label">Nama di Bawah Tanda Tangan</label><input id="ttd-nama" class="input" value="${_juEsc(namaBawaan)}"/></div>
    <div class="ju-ttd-ket">Tanda tangan di kotak ini dengan jari atau mouse:</div>
    <canvas id="ttd-kanvas" class="ju-ttd-kanvas" width="600" height="240"></canvas>
    <div class="ju-ttd-aksi"><button class="btn btn-ghost btn-sm" onclick="_juTtdBersih()">🧽 Ulangi</button>${lama?.img ? `<button class="btn btn-ghost btn-sm" onclick="_juTtdHapus()">🗑️ Hapus Tanda Tangan</button>` : ""}</div>
    <button class="btn btn-accent" style="width:100%;margin-top:10px;" onclick="_juTtdSimpan()">💾 Simpan Tanda Tangan</button>`);
  const c = qs("ttd-kanvas"), x = c.getContext("2d");
  x.lineWidth = 3.2; x.lineCap = "round"; x.lineJoin = "round"; x.strokeStyle = "#1B2A41";
  let gambar = false, akhir = null; JU.ttdTergores = false;
  const titik = (ev) => { const r = c.getBoundingClientRect(); return [((ev.clientX - r.left) * c.width) / r.width, ((ev.clientY - r.top) * c.height) / r.height]; };
  c.addEventListener("pointerdown", (ev) => { ev.preventDefault(); gambar = true; akhir = titik(ev); c.setPointerCapture?.(ev.pointerId); });
  c.addEventListener("pointermove", (ev) => { if (!gambar) return; ev.preventDefault(); const p2 = titik(ev); x.beginPath(); x.moveTo(akhir[0], akhir[1]); x.lineTo(p2[0], p2[1]); x.stroke(); akhir = p2; JU.ttdTergores = true; });
  ["pointerup", "pointercancel", "pointerleave"].forEach((n) => c.addEventListener(n, () => { gambar = false; }));
}
function _juTtdBersih() { const c = qs("ttd-kanvas"); c.getContext("2d").clearRect(0, 0, c.width, c.height); JU.ttdTergores = false; }
async function _juTtdSimpan() {
  const nama = qs("ttd-nama").value.trim();
  if (!JU.ttdTergores) { toast("Tanda tangan dulu di kotak", "info"); return; }
  // potong ruang kosong supaya gambarnya ringkas
  const c = qs("ttd-kanvas"), d = c.getContext("2d").getImageData(0, 0, c.width, c.height).data;
  let x0 = c.width, y0 = c.height, x1 = 0, y1 = 0;
  for (let y = 0; y < c.height; y++) for (let xx = 0; xx < c.width; xx++) if (d[(y * c.width + xx) * 4 + 3] > 10) { if (xx < x0) x0 = xx; if (xx > x1) x1 = xx; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  const pad = 8, sx = Math.max(0, x0 - pad), sy = Math.max(0, y0 - pad), w = Math.min(c.width - sx, x1 - x0 + pad * 2), h = Math.min(c.height - sy, y1 - y0 + pad * 2);
  const o = document.createElement("canvas"); o.width = w; o.height = h;
  o.getContext("2d").drawImage(c, sx, sy, w, h, 0, 0, w, h);
  try {
    setGlobalLoading(true, "Menyimpan tanda tangan…");
    await _kvSimpan(_JU_TTD, { img: o.toDataURL("image/png"), nama, t: new Date().toISOString(), oleh: STATE.guruId || null });
    closeModal(); toast("Tanda tangan tersimpan ✓ — otomatis muncul di PDF", "ok");
  } catch (e) { toast("Gagal menyimpan: " + (e.message || e), "err"); }
  finally { setGlobalLoading(false); }
}
async function _juTtdHapus() {
  if (!(await konfirmasiTema("Hapus tanda tangan tersimpan? PDF berikutnya kembali memakai ruang tanda tangan kosong.", { ikon: "🗑️", judul: "Hapus tanda tangan" }))) return;
  try { await _kvSimpan(_JU_TTD, null); closeModal(); toast("Tanda tangan dihapus", "ok"); } catch (e) { toast("Gagal: " + (e.message || e), "err"); }
}

// ============================================================
//  RAPOR WALI KELAS (sederhana) · EKSKUL · PENGATURAN PENILAIAN (bobot & KKM)
//  • Satu santri per layar: pilih nama / ‹ › ; tiap santri punya tanda kelengkapan (nilai, catatan, ekskul).
//  • Ekskul cukup DIPILIH dari katalog (menu Kurikulum) + predikat; bisa diisikan ke banyak santri sekaligus.
//    (Data "Kelola Ekskul" lama tidak pernah terbaca rapor — rapor memakai rapor_ekstrakurikuler.)
//  • Bobot nilai & KKM per mapel di satu tempat, bisa diubah Admin & Kepala Sekolah.
//  Fungsi simpan yang lama (simpanNilaiTanpaGuru, simpanCatatanWK, simpanKeputusanWK, hapusEkstrakurikulerWK)
//  tetap dipakai — tampilan ini hanya menggambar satu santri dengan id elemen yang sama.
// ============================================================
const RWK = { idx: 0 };
const _rwkBolehAtur = () => isAdmin() || (typeof isKepsek === "function" && isKepsek());

// Semester & tahun ajaran yang sedang berjalan (ikut pengaturan bulan awal tahun ajaran)
function semesterAktifSekarang() {
  const x = typeof _kbTahunAjaran === "function" ? _kbTahunAjaran(bulanIniISO()) : null;
  return { semester: x ? x.semester : hitungSemesterOtomatis(), ta: x ? x.ta : hitungTahunAjaranOtomatis() };
}
// Isi semester/tahun ajaran halaman rapor/nilai sekali saat halaman pertama dibuka (pilihan guru tetap dihormati)
function _rwkAturDefaultSemester(prefix) {
  const sem = qs(prefix + "-semester"), th = qs(prefix + "-tahun");
  if (!sem || !th || sem.dataset.diatur) return;
  const a = semesterAktifSekarang();
  sem.value = a.semester; th.value = a.ta; sem.dataset.diatur = th.dataset.diatur = "1";
}

renderRaporWaliKelasInit = async function () {
  await ensureLookups();
  populateSelect("rw-kelas", LOOKUP.kelas, "id", "nama_kelas");
  _rwkAturDefaultSemester("rw");
  RWK.idx = 0;
  renderRaporWaliKelas();
};

renderRaporWaliKelas = async function () {
  const kelasId = qs("rw-kelas").value;
  const target = qs("rapor-walikelas-content");
  if (!kelasId) { target.innerHTML = `<div class="card empty-state">Pilih kelas.</div>`; return; }
  if (!RAPOR_WK_CACHE || RAPOR_WK_CACHE.kelasId !== kelasId || RAPOR_WK_CACHE.semester !== qs("rw-semester").value || RAPOR_WK_CACHE.tahun !== qs("rw-tahun").value) RWK.idx = 0;
  if (!target.querySelector(".rwk")) target.innerHTML = loadingHTML();
  try {
    const semester = qs("rw-semester").value, tahun = qs("rw-tahun").value;
    const kelasObj = LOOKUP.kelas.find((k) => k.id === kelasId);
    const siswaList = await apiGetSiswaByKelas(kelasId);
    const siswaIds = siswaList.map((s) => s.id);
    const [nilaiSemua, ekskulSemua, catatanSemua] = await Promise.all([
      supa.from("nilai_rapor").select("*,mapel(nama_mapel,kategori,kkm,tanpa_guru,masuk_umum,masuk_diniyyah)").eq("kelas_id", kelasId).eq("semester", semester).eq("tahun_ajaran", tahun).then(unwrap),
      apiGetEkstrakurikulerKelas(siswaIds, semester, tahun),
      apiGetCatatanKelas(siswaIds, semester, tahun),
    ]);
    RAPOR_WK_CACHE = { kelasId, semester, tahun, siswaList, nilaiSemua, ekskulSemua, catatanSemua, kelasObj };
    _rwkGambar();
  } catch (e) { console.error(e); target.innerHTML = `<div class="card empty-state">Gagal memuat data rapor kelas.</div>`; }
};

// Kelengkapan rapor satu santri → dipakai di daftar nama & ringkasan
function _rwkStatus(s) {
  const c = RAPOR_WK_CACHE;
  const nilai = c.nilaiSemua.filter((n) => n.siswa_id === s.id);
  const cat = c.catatanSemua.find((x) => x.siswa_id === s.id) || {};
  const ekskul = c.ekskulSemua.filter((e) => e.siswa_id === s.id);
  const cek = { nilai: nilai.length > 0, catatan: !!(cat.catatan_wali_kelas || "").trim(), catatanAr: !!(cat.catatan_wali_kelas_ar || "").trim(), ekskul: ekskul.length > 0 };
  return { nilai, cat, ekskul, cek, lengkap: Object.values(cek).filter(Boolean).length };
}

function _rwkGambar() {
  const c = RAPOR_WK_CACHE, target = qs("rapor-walikelas-content"); if (!c || !target) return;
  const { siswaList, semester, tahun, kelasId, kelasObj } = c;
  const wali = guruWaliKelasDari(kelasId);
  if (!siswaList.length) { target.innerHTML = `<div class="card empty-state">Belum ada santri di kelas ini.</div>`; return; }
  RWK.idx = Math.max(0, Math.min(siswaList.length - 1, RWK.idx));
  const s = siswaList[RWK.idx], st = _rwkStatus(s);
  const semuaLengkap = siswaList.filter((x) => _rwkStatus(x).lengkap === 4).length;
  const mapelTanpaGuru = (LOOKUP.mapel || []).filter((m) => m.tanpa_guru);
  const nilaiBerGuru = st.nilai.filter((n) => !n.mapel?.tanpa_guru);
  const centang = (ok, label) => `<span class="rwk-cek ${ok ? "ok" : ""}">${ok ? "✅" : "⬜"} ${label}</span>`;
  const catatan = st.cat.catatan_wali_kelas !== undefined ? st.cat : { catatan_wali_kelas: "", catatan_wali_kelas_ar: "", keputusan: "Naik", kelas_tujuan: "" };

  target.innerHTML = `<div class="rwk">
    <div class="card rwk-atas">
      <div class="rwk-identitas">${htmlLogoSekolahEditable(34)}
        <div><b>${escapeHtml(kelasObj?.nama_kelas || "")} · Semester ${semester} ${tahun}</b>
          <small>Wali kelas: <b>${wali ? escapeHtml(wali.nama) : `<span style="color:var(--bad)">${t("belumAdaWaliKelas")}</span>`}</b> · ${semuaLengkap}/${siswaList.length} rapor lengkap
          ${isAdmin() ? ` · <a href="#" onclick="bukaGantiWaliKelas('${kelasId}');return false;">ganti</a>` : ""}</small></div></div>
      <div class="rwk-aksi">
        <button class="btn btn-sm rwk-b-ungu" onclick="bukaEkskulMassal('rw')">👥 Ekskul banyak santri</button>
        ${_rwkBolehAtur() ? `<button class="btn btn-sm rwk-b-emas" onclick="bukaPengaturanPenilaian()">⚖️ Bobot & KKM</button>` : ""}
        <button class="btn btn-sm rwk-b-hijau" onclick="eksporRaporKelas()">📄 Ekspor Word</button>
      </div>
    </div>

    <div class="card rwk-pilih">
      <button class="btn btn-outline btn-sm" onclick="RWK.idx--;_rwkGambar()" ${RWK.idx === 0 ? "disabled" : ""}>‹</button>
      <select class="input" onchange="RWK.idx=Number(this.value);_rwkGambar()">${siswaList.map((x, i) => { const l = _rwkStatus(x).lengkap; return `<option value="${i}" ${i === RWK.idx ? "selected" : ""}>${i + 1}. ${escapeHtml(x.nama)} ${l === 4 ? "✅" : `(${l}/4)`}</option>`; }).join("")}</select>
      <button class="btn btn-outline btn-sm" onclick="RWK.idx++;_rwkGambar()" ${RWK.idx >= siswaList.length - 1 ? "disabled" : ""}>›</button>
    </div>

    <div class="card">
      <div class="rwk-nama"><span class="avatar-huruf">${escapeHtml(String(s.nama).trim()[0] || "?")}</span><div><b>${escapeHtml(s.nama)}</b><small>NIS ${escapeHtml(s.nis || "-")}</small></div></div>
      <div class="rwk-ceklis">${centang(st.cek.nilai, "Nilai")}${centang(st.cek.catatan, "Catatan umum")}${centang(st.cek.catatanAr, "Catatan Arab")}${centang(st.cek.ekskul, "Ekskul")}</div>

      <div class="rwk-judul">📚 Nilai mapel <small>(diisi guru mapel di menu Input Nilai)</small></div>
      <table class="simple-table"><thead><tr><th>Mapel</th><th style="width:60px">KKM</th><th style="width:70px">Nilai</th><th>Capaian</th></tr></thead>
        <tbody>${nilaiBerGuru.map((n) => { const na = hitungNilaiAkhir(n); const kkm = typeof kkmMapel === "function" ? kkmMapel({ ...(n.mapel || {}), id: n.mapel_id }, n.kelas_id) : (n.mapel?.kkm ?? 70), v = na ? na.nilaiAkhir : null;
          return `<tr><td>${escapeHtml(n.mapel?.nama_mapel)}</td><td style="text-align:center">${kkm}</td><td style="text-align:center"><b class="${v == null ? "" : v >= kkm ? "rwk-tuntas" : "rwk-belum"}">${v ?? "-"}</b></td><td>${escapeHtml(n.capaian_pembelajaran || "-")}</td></tr>`; }).join("")
          || `<tr><td colspan="4" style="text-align:center;color:var(--text-secondary)">Belum ada nilai untuk semester ini.</td></tr>`}</tbody></table>

      ${mapelTanpaGuru.length ? `<div class="rwk-judul">✍️ Mapel yang diisi wali kelas</div>
      <table class="simple-table"><thead><tr><th>Mapel</th><th style="width:80px">Nilai</th><th>Capaian</th><th style="width:44px"></th></tr></thead>
        <tbody>${mapelTanpaGuru.map((m) => { const ex = st.nilai.find((n) => n.mapel_id === m.id); const awal = ex ? (hitungNilaiAkhir(ex)?.nilaiAkhir ?? "") : "";
          return `<tr><td>${escapeHtml(m.nama_mapel)}</td><td><input type="number" class="input" id="wk-nilai-${m.id}-${s.id}" value="${awal}" style="width:70px;padding:4px"></td>
            <td><input class="input" id="wk-cp-${m.id}-${s.id}" value="${escapeHtml(ex?.capaian_pembelajaran || "")}" style="padding:4px"></td>
            <td><button class="btn btn-ghost btn-sm" onclick="simpanNilaiTanpaGuru('${s.id}','${m.id}')" title="${t("simpan")}">💾</button></td></tr>`; }).join("")}</tbody></table>` : ""}

      <div class="rwk-judul">🏃 Ekstrakurikuler</div>
      <div class="rwk-ekskul">${st.ekskul.map((e) => `<span class="rwk-ekskul-chip"><b>${escapeHtml(e.nama_ekstrakurikuler)}</b>${e.keterangan ? ` · ${escapeHtml(e.keterangan)}` : ""}
        <button title="Ubah" onclick='bukaFormEkstrakurikulerWK(${JSON.stringify(e).replace(/'/g, "&#39;")},"${s.id}")'>✏️</button><button title="Hapus" onclick="hapusEkstrakurikulerWK('${e.id}')">✕</button></span>`).join("")
        || `<span style="font-size:12px;color:var(--text-secondary)">Belum ada.</span>`}
        <button class="btn btn-ghost btn-sm" onclick="bukaFormEkstrakurikulerWK(null,'${s.id}')">＋ Tambah</button></div>

      <div class="rwk-catatan">
        <div><div class="rwk-judul">📝 Catatan wali kelas (rapor umum)</div>
          <textarea class="input" id="wk-catatan-id-${s.id}" rows="3" placeholder="mis. Ananda rajin dan aktif bertanya; tingkatkan ketelitian dalam menghitung.">${escapeHtml(catatan.catatan_wali_kelas || "")}</textarea>
          <button class="btn btn-ghost btn-sm" onclick="simpanCatatanWK('${s.id}','id')">💾 ${t("simpan")}</button></div>
        <div dir="rtl"><div class="rwk-judul">📝 ملاحظة مربي الفصل <small>(رابور الدينية)</small></div>
          <textarea class="input" id="wk-catatan-ar-${s.id}" rows="3" dir="rtl" style="font-family:'Amiri',serif;font-size:15px">${escapeHtml(catatan.catatan_wali_kelas_ar || "")}</textarea>
          <button class="btn btn-ghost btn-sm" onclick="simpanCatatanWK('${s.id}','ar')">💾 ${t("simpan")}</button></div>
      </div>

      ${semester === "Genap" ? `<div class="rwk-judul">🎓 Keputusan akhir tahun</div>
      <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:flex-end">
        <select class="input" id="wk-keputusan-${s.id}" style="width:auto"><option value="Naik" ${catatan.keputusan !== "Tinggal" ? "selected" : ""}>Naik</option><option value="Tinggal" ${catatan.keputusan === "Tinggal" ? "selected" : ""}>Tinggal</option></select>
        <input class="input" id="wk-kelas-tujuan-${s.id}" style="width:160px" value="${escapeHtml(catatan.kelas_tujuan || formatKelasLabel(_tebakKelasBerikutnya(kelasObj?.nama_kelas)))}">
        <button class="btn btn-ghost btn-sm" onclick="simpanKeputusanWK('${s.id}')">💾 ${t("simpan")}</button></div>` : ""}

      <div class="rwk-bawah">
        <button class="btn btn-outline" onclick="RWK.idx--;_rwkGambar();scrollTo(0,0)" ${RWK.idx === 0 ? "disabled" : ""}>‹ Santri sebelumnya</button>
        <button class="btn btn-accent" onclick="RWK.idx++;_rwkGambar();scrollTo(0,0)" ${RWK.idx >= siswaList.length - 1 ? "disabled" : ""}>Santri berikutnya ›</button>
      </div>
    </div></div>`;
}

// ── Ekskul: pilih dari katalog + predikat (satu santri) ──
const RWK_PREDIKAT = ["Sangat Baik", "Baik", "Cukup", "Perlu Bimbingan"];
let _RWK_MASTER = null;
async function _rwkMaster() { if (!_RWK_MASTER) { try { _RWK_MASTER = await apiGetEkskulMaster(); } catch (e) { _RWK_MASTER = []; } } return _RWK_MASTER; }
bukaFormEkstrakurikulerWK = async function (row, siswaId) {
  if (!RAPOR_WK_CACHE) return;
  _EKSKUL_WK_CTX = { siswaId, semester: RAPOR_WK_CACHE.semester, tahun: RAPOR_WK_CACHE.tahun };
  const master = await _rwkMaster();
  const nama = row?.nama_ekstrakurikuler || "", ket = row?.keterangan || "";
  const adaDiKatalog = master.some((m) => m.nama_ekskul === nama);
  openModal(`<h3>🏃 Ekstrakurikuler</h3>
    <div class="field"><label class="form-label">Kegiatan</label>
      <select id="ek-pilih" class="input" onchange="qs('ek-nama-wrap').style.display=this.value==='__lain'?'':'none'">
        ${master.map((m) => `<option ${m.nama_ekskul === nama ? "selected" : ""}>${escapeHtml(m.nama_ekskul)}</option>`).join("")}
        <option value="__lain" ${nama && !adaDiKatalog ? "selected" : ""}>Lainnya (ketik sendiri)…</option></select>
      <div id="ek-nama-wrap" style="margin-top:6px;${(nama && !adaDiKatalog) || !master.length ? "" : "display:none"}"><input id="ek-nama" class="input" value="${escapeHtml(nama)}" placeholder="Nama kegiatan"></div>
      ${!master.length ? `<div style="font-size:11px;color:var(--text-secondary);margin-top:4px">Katalog ekskul masih kosong — isi di menu Kurikulum supaya cukup memilih.</div>` : ""}</div>
    <div class="field"><label class="form-label">Predikat / keterangan</label>
      <div class="rwk-predikat">${RWK_PREDIKAT.map((p) => `<button type="button" onclick="qs('ek-ket').value=this.textContent">${p}</button>`).join("")}</div>
      <textarea id="ek-ket" class="input" rows="2" placeholder="mis. Baik — aktif mengikuti latihan">${escapeHtml(ket)}</textarea></div>
    <button class="btn btn-accent" style="width:100%" onclick="simpanEkstrakurikulerWK('${row?.id || ""}')">💾 Simpan</button>`);
  if (!master.length) { const sel = qs("ek-pilih"); sel.value = "__lain"; }
};
// nama dari katalog dipakai bila guru memilih dari daftar (simpanEkstrakurikulerWK membaca #ek-nama)
const _rwkSimpanEkskulAsli = simpanEkstrakurikulerWK;
simpanEkstrakurikulerWK = async function (id) {
  const sel = qs("ek-pilih");
  if (sel && sel.value !== "__lain") { let inp = qs("ek-nama"); if (inp) inp.value = sel.value; }
  return _rwkSimpanEkskulAsli(id);
};

// ── Ekskul untuk banyak santri sekaligus ──
async function bukaEkskulMassal(prefix) {
  const kelasId = qs(prefix + "-kelas")?.value; if (!kelasId) { toast("Pilih kelas dulu", "err"); return; }
  const semester = qs(prefix + "-semester").value, tahun = qs(prefix + "-tahun").value;
  const [siswa, master] = await Promise.all([apiGetSiswaByKelas(kelasId), _rwkMaster()]);
  openModal(`<h3>👥 Isi ekskul untuk banyak santri</h3>
    <div style="font-size:12px;color:var(--text-secondary);margin:-4px 0 10px">Semester ${escapeHtml(semester)} ${escapeHtml(tahun)} · pilih kegiatan, centang santri, simpan sekali.</div>
    <div class="field"><label class="form-label">Kegiatan</label>${master.length
      ? `<select id="ekm-nama" class="input">${master.map((m) => `<option>${escapeHtml(m.nama_ekskul)}</option>`).join("")}</select>`
      : `<input id="ekm-nama" class="input" placeholder="Nama kegiatan (katalog di menu Kurikulum masih kosong)">`}</div>
    <div class="field"><label class="form-label">Predikat</label><div class="rwk-predikat">${RWK_PREDIKAT.map((p, i) => `<button type="button" class="${i === 1 ? "on" : ""}" onclick="qsa('.rwk-predikat button').forEach(b=>b.classList.remove('on'));this.classList.add('on');qs('ekm-ket').value=this.textContent">${p}</button>`).join("")}</div>
      <input id="ekm-ket" class="input" value="Baik"></div>
    <div class="field"><label class="form-label" style="display:flex;justify-content:space-between">Santri <a href="#" onclick="qsa('.ekm-s').forEach(c=>c.checked=!qsa('.ekm-s').every(x=>x.checked));return false;">centang/lepas semua</a></label>
      <div class="rwk-santri-cek">${siswa.map((s) => `<label><input type="checkbox" class="ekm-s" value="${s.id}" checked> ${escapeHtml(s.nama)}</label>`).join("")}</div></div>
    <button class="btn btn-accent" style="width:100%" id="ekm-ok">💾 Simpan untuk santri tercentang</button>`);
  qs("ekm-ok").onclick = async () => {
    const nama = qs("ekm-nama").value.trim(), ket = qs("ekm-ket").value.trim() || null;
    const ids = qsa(".ekm-s").filter((c) => c.checked).map((c) => c.value);
    if (!nama || !ids.length) { toast("Pilih kegiatan dan minimal satu santri", "err"); return; }
    const tb = qs("ekm-ok"); tb.disabled = true; tb.textContent = "Menyimpan…";
    try {
      const ada = await apiGetEkstrakurikulerKelas(ids, semester, tahun);
      let n = 0;
      for (const id of ids) {
        const lama = ada.find((e) => e.siswa_id === id && e.nama_ekstrakurikuler === nama);
        await apiSimpanEkstrakurikuler({ id: lama?.id || undefined, siswa_id: id, semester, tahun_ajaran: tahun, nama_ekstrakurikuler: nama, keterangan: ket }); n++;
      }
      toast(`🏃 ${nama} diisikan ke ${n} santri`, "ok"); closeModal();
      if (prefix === "rw") renderRaporWaliKelas(); else if (typeof onGantiKelasRapor === "function") onGantiKelasRapor(prefix);
    } catch (e) { toast("Gagal: " + e.message, "err"); tb.disabled = false; tb.textContent = "💾 Simpan untuk santri tercentang"; }
  };
}

// ── Pengaturan penilaian: bobot nilai akhir + KKM tiap mapel (Admin & Kepala Sekolah) ──
async function bukaPengaturanPenilaian() {
  if (!_rwkBolehAtur()) { toast("Hanya Admin atau Kepala Sekolah", "err"); return; }
  await ensureLookups();
  const def = { tanpa_uts: { uh: 30, tugas: 20, uas: 40, kehadiran: 10 }, dengan_uts: { uh: 25, tugas: 15, uts: 20, uas: 30, kehadiran: 10 } };
  const b = STATE.pengaturan?.bobot_nilai || def, tu = b.tanpa_uts || def.tanpa_uts, du = b.dengan_uts || def.dengan_uts;
  const isian = (id, v) => `<input id="${id}" type="number" min="0" max="100" class="input pp-bobot" value="${v ?? 0}" oninput="_ppTotal()">`;
  const grup = (judul, pre, o, kunci) => `<div class="pp-grup"><b>${judul}</b><div class="pp-baris">${kunci.map(([k, l]) => `<label>${l}${isian(`pp-${pre}-${k}`, o[k])}</label>`).join("")}</div><div class="pp-total" id="pp-${pre}-total"></div></div>`;
  const kkmKelas = STATE.pengaturan?.bobot_nilai?.kkm_kelas || {};
  const kelasUrut = (LOOKUP.kelas || []).slice().sort((a, c) => (parseInt(String(a.nama_kelas).match(/d+/)?.[0] || "99", 10)) - (parseInt(String(c.nama_kelas).match(/d+/)?.[0] || "99", 10)));
  const mapel = (LOOKUP.mapel || []).slice().sort((a, b2) => (a.masuk_diniyyah - b2.masuk_diniyyah) || a.nama_mapel.localeCompare(b2.nama_mapel, "id"));
  openModal(`<h3>⚖️ Pengaturan Penilaian</h3>
    <div style="font-size:12px;color:var(--text-secondary);margin:-4px 0 12px">Berlaku untuk semua guru, Input Nilai, dan rapor. Bisa diubah Admin & Kepala Sekolah.</div>
    <div class="rwk-judul">1️⃣ Bobot nilai akhir</div>
    ${grup("Tanpa UTS", "tu", tu, [["uh", "Ulangan Harian"], ["tugas", "Tugas"], ["uas", "UAS"], ["kehadiran", "Kehadiran"]])}
    ${grup("Dengan UTS", "du", du, [["uh", "Ulangan Harian"], ["tugas", "Tugas"], ["uts", "UTS"], ["uas", "UAS"], ["kehadiran", "Kehadiran"]])}
    <div class="rwk-judul" style="display:flex;justify-content:space-between;align-items:center">2️⃣ KKM tiap mapel
      <span style="font-size:11.5px;font-weight:600">Semua jadi <input id="pp-kkm-semua" type="number" class="input" style="width:64px;padding:3px 6px;display:inline-block" value="70"> <button class="btn btn-ghost btn-sm" onclick="qsa('.pp-kkm').forEach(i=>i.value=qs('pp-kkm-semua').value)">Terapkan</button></span></div>
    <div style="font-size:11px;color:var(--text-secondary);margin:-4px 0 8px">Angka di kanan = KKM semua kelas. Ketuk <b>Per kelas</b> bila KKM kelas tertentu berbeda (kosong = ikut KKM umum).</div>
    <div class="pp-kkm-daftar">${mapel.map((m) => { const kk = kkmKelas[m.id] || {}, adaKhusus = Object.keys(kk).length; return `<div class="pp-kkm-item"><div class="pp-kkm-baris"><span class="pp-kkm-nama">${escapeHtml(m.nama_mapel)} <small>${m.masuk_diniyyah ? "diniyyah" : "umum"}</small></span><button type="button" class="btn btn-ghost btn-sm pp-kkm-tgl ${adaKhusus ? "on" : ""}" onclick="this.closest('.pp-kkm-item').classList.toggle('buka')">Per kelas${adaKhusus ? " (" + adaKhusus + ")" : ""} ▾</button><input type="number" min="0" max="100" class="input pp-kkm" data-id="${m.id}" data-awal="${m.kkm ?? 70}" value="${m.kkm ?? 70}"></div>
      <div class="pp-kkm-kelas">${kelasUrut.map((k) => `<label><span>Kls ${escapeHtml(String(k.nama_kelas).replace(/^s*kelass+/i, ""))}</span><input type="number" min="0" max="100" class="input pp-kkm-k" data-mapel="${m.id}" data-kelas="${k.id}" value="${kk[k.id] ?? ""}" placeholder="${m.kkm ?? 70}"></label>`).join("")}</div></div>`; }).join("")}</div>
    <button class="btn btn-accent" style="width:100%;margin-top:12px" id="pp-ok">💾 Simpan pengaturan penilaian</button>`, { lebar: true });
  _ppTotal();
  qs("pp-ok").onclick = async () => {
    const g = (id) => Number(qs(id)?.value) || 0;
    const tuB = { uh: g("pp-tu-uh"), tugas: g("pp-tu-tugas"), uas: g("pp-tu-uas"), kehadiran: g("pp-tu-kehadiran") };
    const duB = { uh: g("pp-du-uh"), tugas: g("pp-du-tugas"), uts: g("pp-du-uts"), uas: g("pp-du-uas"), kehadiran: g("pp-du-kehadiran") };
    const jml = (o) => Object.values(o).reduce((a, x) => a + x, 0);
    if (jml(tuB) !== 100 || jml(duB) !== 100) { toast("Tiap kelompok bobot harus berjumlah tepat 100%", "err"); return; }
    const tb = qs("pp-ok"); tb.disabled = true; tb.textContent = "Menyimpan…";
    try {
      // KKM khusus per kelas (hanya yang diisi & berbeda dari KKM umum mapelnya)
      const kkmBaru = {};
      qsa(".pp-kkm-k").forEach((i) => { const v = i.value === "" ? null : Number(i.value); const umum = Number(qs(`.pp-kkm[data-id="${i.dataset.mapel}"]`)?.value);
        if (v != null && v >= 0 && v <= 100 && v !== umum) (kkmBaru[i.dataset.mapel] = kkmBaru[i.dataset.mapel] || {})[i.dataset.kelas] = v; });
      const bobotBaru = { tanpa_uts: tuB, dengan_uts: duB, kkm_kelas: kkmBaru };
      const upd = await apiSimpanPengaturanSekolah({ bobot_nilai: bobotBaru });
      STATE.pengaturan = { ...STATE.pengaturan, bobot_nilai: upd?.bobot_nilai || bobotBaru };
      let n = 0;
      for (const i of qsa(".pp-kkm")) {
        const v = Number(i.value); if (!(v >= 0 && v <= 100) || String(v) === i.dataset.awal) continue;
        unwrap(await supa.from("mapel").update({ kkm: v }).eq("id", i.dataset.id));
        const m = LOOKUP.mapel.find((x) => x.id === i.dataset.id); if (m) m.kkm = v; n++;
      }
      toast(`⚖️ Bobot tersimpan${n ? ` · KKM ${n} mapel diperbarui` : ""}`, "ok"); closeModal();
      if (STATE.currentPage === "input-nilai" && typeof renderInputNilai === "function") renderInputNilai();
      if (STATE.currentPage === "rapor") renderRaporWaliKelas();
    } catch (e) { toast("Gagal menyimpan: " + e.message, "err"); tb.disabled = false; tb.textContent = "💾 Simpan pengaturan penilaian"; }
  };
}
function _ppTotal() {
  [["tu", ["uh", "tugas", "uas", "kehadiran"]], ["du", ["uh", "tugas", "uts", "uas", "kehadiran"]]].forEach(([p, k]) => {
    const t = k.reduce((a, x) => a + (Number(qs(`pp-${p}-${x}`)?.value) || 0), 0), el = qs(`pp-${p}-total`);
    if (el) { el.textContent = `Total ${t}%${t === 100 ? " ✓" : " — harus 100%"}`; el.style.color = t === 100 ? "#047857" : "#b91c1c"; }
  });
}
// tombol lama "⚖️ Bobot" di Input Nilai diarahkan ke pengaturan gabungan ini
bukaModalBobotNilai = bukaPengaturanPenilaian;

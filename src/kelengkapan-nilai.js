// ============================================================
//  PANTAU KELENGKAPAN NILAI RAPOR — admin & kepala sekolah
//  Per guru: tiap kelas·mapel yang diajarnya (dari jadwal aktif) → berapa santri sudah punya nilai akhir
//  & nilai UAS. Wali kelas: catatan rapor (Indonesia & Arab). Tombol WA berisi daftar yang belum lengkap.
// ============================================================
const PK = { data: null, hanyaBelum: true };

async function bukaKelengkapanNilai(prefix) {
  if (!(isAdmin() || isKepsek())) { toast("Fitur ini untuk admin & kepala sekolah", "err"); return; }
  await ensureLookups();
  const a = semesterAktifSekarang();
  const semester = (prefix && qs(prefix + "-semester")?.value) || a.semester, tahun = (prefix && qs(prefix + "-tahun")?.value) || a.ta;
  openModal(`<h3>📋 Pantau Kelengkapan Nilai</h3>
    <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:flex-end;margin-bottom:8px">
      <div class="field" style="margin:0"><label class="form-label">Semester</label><select id="pk-semester" class="input" onchange="_pkMuat()"><option ${semester === "Ganjil" ? "selected" : ""}>Ganjil</option><option ${semester === "Genap" ? "selected" : ""}>Genap</option></select></div>
      <div class="field" style="margin:0"><label class="form-label">Tahun Ajaran</label><input id="pk-tahun" class="input" style="width:110px" value="${escapeHtml(tahun)}" onchange="_pkMuat()"></div>
      <label class="je-opsi" style="margin:0 0 6px"><input type="checkbox" id="pk-belum" ${PK.hanyaBelum ? "checked" : ""} onchange="PK.hanyaBelum=this.checked;_pkGambar()"> <span>Hanya yang belum lengkap</span></label>
    </div>
    <div id="pk-isi">${loadingHTML()}</div>`, { lebar: true });
  _pkMuat();
}

async function _pkMuat() {
  const el = qs("pk-isi"); if (!el) return;
  el.innerHTML = loadingHTML();
  const semester = qs("pk-semester").value, tahun = qs("pk-tahun").value.trim();
  try {
    const [jadwal, nilai] = await Promise.all([
      supa.from("jadwal_pelajaran").select("guru_id,kelas_id,mapel_id").eq("aktif", true).then(unwrap),
      _pkAmbilSemua(() => supa.from("nilai_rapor").select("*").eq("semester", semester).eq("tahun_ajaran", tahun)),
    ]);
    const kelasIds = [...new Set([...jadwal.map((j) => j.kelas_id), ...(LOOKUP.guruAll || []).map((g) => g.wali_kelas_id)].filter(Boolean))];
    const siswaPer = {};
    await Promise.all(kelasIds.map(async (id) => { siswaPer[id] = await apiGetSiswaByKelas(id).catch(() => []); }));
    const semuaSiswa = Object.values(siswaPer).flat().map((s) => s.id);
    const catatan = semuaSiswa.length ? await apiGetCatatanKelas(semuaSiswa, semester, tahun).catch(() => []) : [];
    const peta = {}; nilai.forEach((n) => { peta[n.siswa_id + "|" + n.mapel_id] = n; });
    const terisi = (n) => { if (!n) return false; const x = hitungNilaiAkhir(n); return !!(x && x.nilaiAkhir > 0); };
    const adaUas = (n) => !!n && (n.uas || []).some((u) => Number(u.nilai) > 0);
    // tugas mengajar unik per guru
    const perGuru = {};
    const unik = new Set();
    jadwal.forEach((j) => {
      const m = LOOKUP.mapel.find((x) => x.id === j.mapel_id), k = LOOKUP.kelas.find((x) => x.id === j.kelas_id);
      if (!m || !k || !j.guru_id || !(m.masuk_umum || m.masuk_diniyyah)) return;
      const kunci = `${j.guru_id}|${j.kelas_id}|${j.mapel_id}`; if (unik.has(kunci)) return; unik.add(kunci);
      const siswa = siswaPer[j.kelas_id] || [];
      const rows = siswa.map((s) => peta[s.id + "|" + j.mapel_id]);
      const item = { jenis: "nilai", kelas: k, mapel: m, total: siswa.length, isi: rows.filter(terisi).length, uas: rows.filter(adaUas).length, belumNama: siswa.filter((s, i) => !terisi(rows[i]) || !adaUas(rows[i])).map((s) => s.nama) };
      (perGuru[j.guru_id] = perGuru[j.guru_id] || []).push(item);
    });
    // wali kelas: catatan rapor
    (LOOKUP.guruAll || []).filter((g) => g.wali_kelas_id).forEach((g) => {
      const k = LOOKUP.kelas.find((x) => x.id === g.wali_kelas_id); if (!k) return;
      const siswa = siswaPer[k.id] || [];
      const c = (s) => catatan.find((x) => x.siswa_id === s.id) || {};
      (perGuru[g.id] = perGuru[g.id] || []).push({ jenis: "wali", kelas: k, total: siswa.length,
        isi: siswa.filter((s) => (c(s).catatan_wali_kelas || "").trim()).length, ar: siswa.filter((s) => (c(s).catatan_wali_kelas_ar || "").trim()).length });
    });
    PK.data = { semester, tahun, perGuru };
    _pkGambar();
  } catch (e) { console.error(e); el.innerHTML = `<div class="card empty-state">Gagal memuat: ${escapeHtml(e.message)}</div>`; }
}
async function _pkAmbilSemua(buatKueri) {
  const out = [];
  for (let a = 0; ; a += 1000) { const r = unwrap(await buatKueri().range(a, a + 999)); out.push(...r); if (r.length < 1000) break; }
  return out;
}
const _pkLengkap = (it) => (it.jenis === "nilai" ? it.total > 0 && it.isi >= it.total && it.uas >= it.total : it.total > 0 && it.isi >= it.total && it.ar >= it.total);
const _pkKelas = (k) => (typeof _rcKelasPanjang === "function" ? _rcKelasPanjang(k.nama_kelas) : k.nama_kelas);

function _pkGambar() {
  const el = qs("pk-isi"); if (!el || !PK.data) return;
  const { perGuru, semester, tahun } = PK.data;
  const guru = Object.keys(perGuru).map((id) => ({ g: (LOOKUP.guruAll || []).find((x) => x.id === id) || { id, nama: "(guru tidak dikenal)" }, items: perGuru[id] }))
    .map((x) => ({ ...x, belum: x.items.filter((i) => !_pkLengkap(i)) }))
    .sort((a, b) => b.belum.length - a.belum.length || a.g.nama.localeCompare(b.g.nama, "id"));
  const semuaItem = guru.flatMap((x) => x.items), lengkap = semuaItem.filter(_pkLengkap).length;
  const tampil = PK.hanyaBelum ? guru.filter((x) => x.belum.length) : guru;
  const bar = (isi, total) => { const p = total ? Math.round((isi * 100) / total) : 0; return `<div class="pk-bar"><i style="width:${p}%;background:${p >= 100 ? "var(--ok,#1F8A5F)" : p >= 50 ? "#d4a72c" : "#d64545"}"></i></div>`; };
  el.innerHTML = `<div class="pk-ringkas"><b>${lengkap}/${semuaItem.length}</b> tugas penilaian lengkap · Semester ${escapeHtml(semester)} ${escapeHtml(tahun)} · <b>${guru.filter((x) => x.belum.length).length}</b> guru belum lengkap</div>
    ${tampil.length ? tampil.map(({ g, items, belum }) => `<div class="pk-guru">
      <div class="pk-guru-kepala"><div><b>${escapeHtml(g.nama)}</b><span>${belum.length ? `${belum.length} belum lengkap` : "✅ semua lengkap"}</span></div>
        ${belum.length ? `<button class="btn btn-wa btn-sm" onclick="_pkWa('${g.id}')">💬 WA</button>` : ""}</div>
      ${(PK.hanyaBelum ? belum : items).map((it) => it.jenis === "nilai"
        ? `<div class="pk-item"><div class="pk-nama">${escapeHtml(it.mapel.nama_mapel)} · ${escapeHtml(_pkKelas(it.kelas))}</div>${bar(Math.min(it.isi, it.uas), it.total)}
            <div class="pk-angka">nilai ${it.isi}/${it.total} · UAS ${it.uas}/${it.total}</div></div>`
        : `<div class="pk-item"><div class="pk-nama">🏠 Wali kelas · ${escapeHtml(_pkKelas(it.kelas))}</div>${bar(Math.min(it.isi, it.ar), it.total)}
            <div class="pk-angka">catatan ${it.isi}/${it.total} · Arab ${it.ar}/${it.total}</div></div>`).join("")}
    </div>`).join("") : `<div class="card empty-state">🎉 Semua nilai sudah lengkap.</div>`}
    <div class="uj-sub" style="margin-top:8px">Dihitung dari jadwal aktif. "Nilai" = santri yang sudah punya nilai akhir; "UAS" = nilai UAS sudah terisi (manual atau dari ujian aplikasi).</div>`;
}

function _pkWa(guruId) {
  const g = (LOOKUP.guruAll || []).find((x) => x.id === guruId); if (!g) return;
  const belum = (PK.data.perGuru[guruId] || []).filter((i) => !_pkLengkap(i));
  const baris = belum.map((it) => it.jenis === "nilai"
    ? `• ${it.mapel.nama_mapel} ${_pkKelas(it.kelas)}: nilai ${it.isi}/${it.total}, UAS ${it.uas}/${it.total}${it.belumNama.length && it.belumNama.length <= 5 ? ` (belum: ${it.belumNama.map((n) => n.split(" ")[0]).join(", ")})` : ""}`
    : `• Catatan wali kelas ${_pkKelas(it.kelas)}: ${it.isi}/${it.total}, catatan Arab ${it.ar}/${it.total}`);
  const pesan = `Assalamu'alaikum warahmatullahi wabarakatuh, ${typeof _namaSingkatTopbar === "function" ? _namaSingkatTopbar(g.nama) : g.nama}.\n\nMengingatkan, data rapor *Semester ${PK.data.semester} ${PK.data.tahun}* yang belum lengkap:\n${baris.join("\n")}\n\nMohon dilengkapi di aplikasi (menu Input Nilai / Rapor Wali Kelas). Jazakallahu khairan.`;
  const { nomor, valid } = normalisasiNomorWa(g.no_wa);
  openModal(`<h3>💬 Ingatkan ${escapeHtml(g.nama)}</h3>
    <textarea id="pk-pesan" class="input" rows="10">${escapeHtml(pesan)}</textarea>
    ${valid ? `<a class="btn btn-wa" id="pk-kirim" style="width:100%;margin-top:10px;text-decoration:none" target="_blank" rel="noopener" href="#" onclick="this.href='https://wa.me/${nomor}?text='+encodeURIComponent(qs('pk-pesan').value)">💬 Kirim lewat WhatsApp</a>`
      : `<div class="rc-catatan" style="margin-top:10px">No. WA guru ini belum valid. Salin pesan di atas lalu kirim manual.</div>`}
    <button class="btn btn-outline" style="width:100%;margin-top:8px" onclick="bukaKelengkapanNilai()">‹ Kembali ke daftar</button>`);
}

// Tombol hanya tampil untuk admin & kepala sekolah
function _pkAturTombol() { qsa(".pk-tombol").forEach((b) => (b.style.display = isAdmin() || isKepsek() ? "" : "none")); }
["renderRaporUmumInit", "renderRaporDiniyyahInit", "renderRaporWaliKelasInit"].forEach((nama) => {
  const asli = window[nama]; if (typeof asli !== "function") return;
  window[nama] = async function (...a) { _pkAturTombol(); return asli.apply(this, a); };
});

// ============================================================
//  KESIMPULAN BULANAN — bahan rapat Kepala Sekolah (dibuka dari Laporan Kinerja)
//  Menggabungkan: kehadiran & kedisiplinan guru (absensi_sesi), tukar jam (tukar_jadwal),
//  proses mengajar per kelas-mapel (jurnal_kelas), kehadiran santri (jurnal_kelas),
//  capaian nilai tugas/ulangan (nilai_rapor), plus kesimpulan & rekomendasi otomatis.
//  Semua query hanya BACA dan dibatasi satu bulan → ringan untuk kuota Supabase.
// ============================================================
let _KB = null; // hasil hitung terakhir (dipakai Salin/Cetak)

function _kbTahunAjaran(bulanYM) {
  const [y, m] = bulanYM.split("-").map(Number), awal = (STATE.pengaturan || {}).bulan_awal_tahun_ajaran || 7;
  const mulai = m >= awal ? y : y - 1, offset = (m - awal + 12) % 12;
  return { ta: `${mulai}/${mulai + 1}`, semester: offset < 6 ? "Ganjil" : "Genap" };
}
const _kbRata = (arr) => { const v = (arr || []).map((x) => Number(x && x.nilai)).filter((x) => !isNaN(x) && x > 0); return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null; };
const _kbBulat = (x) => (x == null ? "–" : Math.round(x * 10) / 10);

async function bukaKesimpulanBulanan(bulanYM) {
  bulanYM = bulanYM || qs("lk-bulan")?.value || bulanIniISO();
  const { dari, sampai } = rentangBulan(bulanYM), { ta, semester } = _kbTahunAjaran(bulanYM);
  openModal(`<div id="kb-wrap"><h3>🧭 Kesimpulan Bulanan · ${namaBulanIndo(bulanYM)}</h3><div id="kb-isi">${loadingHTML("Menyusun kesimpulan…")}</div></div>`);
  qs("modal-panel")?.classList.add("modal-lebar");
  try {
    const [sesi, tukarAll, jurnal, nilai] = await Promise.all([
      apiGetRekapKedisiplinan(dari, sampai),
      apiGetRiwayatTukarJadwalSemua(dari, sampai).catch(() => []),
      supa.from("jurnal_kelas").select("guru_id,kelas_id,mapel_id,tanggal,materi_pokok,jumlah_hadir,jumlah_izin,jumlah_sakit,jumlah_alpha,jumlah_siswa,kelas(nama_kelas),mapel(nama_mapel),guru(nama)")
        .gte("tanggal", dari).lte("tanggal", sampai).order("tanggal").then((r) => { if (r.error) throw r.error; return r.data || []; }),
      supa.from("nilai_rapor").select("kelas_id,mapel_id,tugas,ulangan_harian,kelas(nama_kelas),mapel(nama_mapel)").eq("tahun_ajaran", ta).eq("semester", semester)
        .then((r) => (r.error ? [] : r.data || [])),
    ]);
    _KB = _kbHitung(bulanYM, sesi, tukarAll.filter((x) => x.status === "disetujui"), jurnal, nilai, { ta, semester });
    const el = qs("kb-isi"); if (el) el.innerHTML = _kbHtml(_KB);
  } catch (e) {
    console.error(e);
    const el = qs("kb-isi"); if (el) el.innerHTML = `<div style="color:var(--bad,#c0392b);font-size:12px;">Gagal menyusun: ${escapeHtml(e.message || String(e))}</div>`;
  }
}

function _kbHitung(bulanYM, sesi, tukar, jurnal, nilai, info) {
  const hariIni = tanggalISO(), G = {};
  const g = (id, nama) => (G[id] = G[id] || { id, nama: nama || "-", total: 0, hadir: 0, mandiri: 0, bersyarat: 0, tertunda: 0, izin: 0, sakit: 0, alpha: 0, jurnal: 0, tukar: 0, nilai: 0 });
  sesi.forEach((x) => {
    if (x.tanggal === hariIni && !x.jam_pulang && x.status_kehadiran !== "alpha") return;
    const r = g(x.guru_id, x.guru?.nama);
    if (x.status_kehadiran === "izin") { r.izin++; return; }
    if (x.status_kehadiran === "sakit") { r.sakit++; return; }
    r.total++; if (x.jurnal_id) r.jurnal++;
    const tertunda = x.hadir_bersyarat && x.jam_masuk && !x.jurnal_id;
    if (tertunda) { r.tertunda++; r.hadir++; r.nilai += 0.25; }
    else if (x.hadir_bersyarat) { r.bersyarat++; r.hadir++; r.nilai += 0.5; }
    else if (x.jam_masuk && x.jam_pulang && x.jurnal_id) { r.mandiri++; r.hadir++; r.nilai += 1; }
    else if (!x.jam_masuk) r.alpha++;
    else { r.hadir++; r.nilai += 0.25; }
  });
  tukar.forEach((x) => { g(x.guru_pengaju_id, x.guru_pengaju?.nama).tukar++; });
  const guru = Object.values(G).map((r) => ({ ...r, persen: r.total ? Math.round(r.hadir / r.total * 100) : 0, persenJurnal: r.total ? Math.round(r.jurnal / r.total * 100) : 0, skor: r.total ? Math.round(r.nilai / r.total * 100) : 0 }))
    .filter((r) => r.total || r.izin || r.sakit || r.tukar).sort((a, b) => b.skor - a.skor || b.total - a.total);
  const T = guru.reduce((a, r) => { ["total", "hadir", "mandiri", "bersyarat", "tertunda", "izin", "sakit", "alpha", "jurnal", "tukar"].forEach((k) => a[k] = (a[k] || 0) + r[k]); return a; }, {});

  // Proses mengajar per kelas → per mapel (jumlah pertemuan & materi terakhir)
  const K = {};
  jurnal.forEach((j) => {
    const kn = j.kelas?.nama_kelas || "-", k = (K[j.kelas_id] = K[j.kelas_id] || { nama: kn, mapel: {}, hadir: 0, izin: 0, sakit: 0, alpha: 0 });
    k.hadir += j.jumlah_hadir || 0; k.izin += j.jumlah_izin || 0; k.sakit += j.jumlah_sakit || 0; k.alpha += j.jumlah_alpha || 0;
    const m = (k.mapel[j.mapel_id] = k.mapel[j.mapel_id] || { nama: j.mapel?.nama_mapel || "-", guru: j.guru?.nama || "-", pertemuan: 0, materi: [] });
    m.pertemuan++; if (j.materi_pokok) m.materi.push({ t: j.tanggal, isi: j.materi_pokok }); m.guru = j.guru?.nama || m.guru;
  });
  // Capaian nilai per kelas → per mapel
  nilai.forEach((n) => {
    const k = (K[n.kelas_id] = K[n.kelas_id] || { nama: n.kelas?.nama_kelas || "-", mapel: {}, hadir: 0, izin: 0, sakit: 0, alpha: 0 });
    const m = (k.mapel[n.mapel_id] = k.mapel[n.mapel_id] || { nama: n.mapel?.nama_mapel || "-", guru: "-", pertemuan: 0, materi: [] });
    (m.tugas = m.tugas || []).push(_kbRata(n.tugas)); (m.uh = m.uh || []).push(_kbRata(n.ulangan_harian));
  });
  const rataArr = (a) => { const v = (a || []).filter((x) => x != null); return v.length ? v.reduce((p, c) => p + c, 0) / v.length : null; };
  const kelas = Object.values(K).map((k) => {
    const totSantri = k.hadir + k.izin + k.sakit + k.alpha;
    const mapel = Object.values(k.mapel).map((m) => ({ ...m, rTugas: rataArr(m.tugas), rUH: rataArr(m.uh), terakhir: m.materi.slice(-1)[0] || null })).sort((a, b) => a.nama.localeCompare(b.nama, "id"));
    return { ...k, mapel, persenSantri: totSantri ? Math.round(k.hadir / totSantri * 100) : null, rTugas: rataArr(mapel.map((m) => m.rTugas)), rUH: rataArr(mapel.map((m) => m.rUH)), pertemuan: mapel.reduce((a, m) => a + m.pertemuan, 0) };
  }).sort((a, b) => (typeof _kelasAngkaUrut === "function" ? _kelasAngkaUrut(a.nama) - _kelasAngkaUrut(b.nama) : a.nama.localeCompare(b.nama)));
  const santriTot = kelas.reduce((a, k) => { a.h += k.hadir; a.t += k.hadir + k.izin + k.sakit + k.alpha; return a; }, { h: 0, t: 0 });

  // Kesimpulan & rekomendasi otomatis
  const persenGuru = T.total ? Math.round(T.hadir / T.total * 100) : 0, persenJurnal = T.total ? Math.round(T.jurnal / T.total * 100) : 0;
  const persenSantri = santriTot.t ? Math.round(santriTot.h / santriTot.t * 100) : null;
  const rTugas = rataArr(kelas.map((k) => k.rTugas)), rUH = rataArr(kelas.map((k) => k.rUH));
  const poin = [], rek = [];
  poin.push(`Kehadiran guru ${persenGuru}% dari ${T.total} sesi mengajar${persenGuru >= 95 ? " — sangat baik" : persenGuru >= 85 ? " — cukup, masih bisa ditingkatkan" : " — perlu perhatian serius"}.`);
  poin.push(`Kelengkapan jurnal ${persenJurnal}%${T.tertunda ? `; ${T.tertunda} jurnal masih tertunda` : ""}.`);
  if (T.tukar) poin.push(`Ada ${T.tukar} kali tukar/pindah jam mengajar yang disetujui.`);
  if (persenSantri != null) poin.push(`Kehadiran santri rata-rata ${persenSantri}% (dari jurnal kelas).`);
  if (rTugas != null || rUH != null) poin.push(`Rata-rata nilai tugas ${_kbBulat(rTugas)} dan ulangan harian ${_kbBulat(rUH)} (semester ${info.semester} ${info.ta}).`);
  const top = guru.filter((r) => r.total >= 4 && r.skor >= 90).slice(0, 3);
  if (top.length) poin.push(`Guru paling disiplin: ${top.map((r) => r.nama).join(", ")} — layak diapresiasi.`);
  const pembinaan = guru.filter((r) => r.alpha >= 3 || (r.total >= 4 && r.persen < 80));
  if (pembinaan.length) rek.push(`Pembinaan kedisiplinan untuk: ${pembinaan.map((r) => `${r.nama} (alpha ${r.alpha}, hadir ${r.persen}%)`).join("; ")}.`);
  const jurnalRendah = guru.filter((r) => r.total >= 4 && r.persenJurnal < 85);
  if (jurnalRendah.length) rek.push(`Ingatkan pengisian jurnal: ${jurnalRendah.map((r) => `${r.nama} (${r.persenJurnal}%)`).join(", ")}.`);
  const tukarSering = guru.filter((r) => r.tukar >= 4);
  if (tukarSering.length) rek.push(`Evaluasi jadwal — sering tukar jam: ${tukarSering.map((r) => `${r.nama} (${r.tukar}x)`).join(", ")}.`);
  const kelasAbsen = kelas.filter((k) => k.persenSantri != null && k.persenSantri < 85);
  if (kelasAbsen.length) rek.push(`Kehadiran santri rendah di ${kelasAbsen.map((k) => `${formatKelasLabel(k.nama)} (${k.persenSantri}%)`).join(", ")} — koordinasi wali kelas/musyrif.`);
  const mapelRendah = []; kelas.forEach((k) => k.mapel.forEach((m) => { const v = m.rUH ?? m.rTugas; if (v != null && v < 70) mapelRendah.push(`${m.nama} ${formatKelasLabel(k.nama)} (${_kbBulat(v)})`); }));
  if (mapelRendah.length) rek.push(`Program remedial/pengayaan untuk: ${mapelRendah.slice(0, 8).join(", ")}${mapelRendah.length > 8 ? ` dan ${mapelRendah.length - 8} lainnya` : ""}.`);
  const tanpaJurnal = []; kelas.forEach((k) => k.mapel.forEach((m) => { if (!m.pertemuan && (m.rTugas != null || m.rUH != null)) tanpaJurnal.push(`${m.nama} ${formatKelasLabel(k.nama)}`); }));
  if (tanpaJurnal.length) rek.push(`Belum ada jurnal bulan ini (padahal ada nilai): ${tanpaJurnal.slice(0, 6).join(", ")}.`);
  if (!rek.length) rek.push("Tidak ada catatan khusus — pertahankan kedisiplinan dan kualitas pembelajaran.");
  return { bulanYM, info, guru, T, kelas, persenGuru, persenJurnal, persenSantri, rTugas, rUH, poin, rek };
}

function _kbHtml(K) {
  const tile = (ikon, label, nilai, warna) => `<div class="kb-tile"><span>${ikon}</span><b style="${warna ? "color:" + warna : ""}">${nilai}</b><small>${label}</small></div>`;
  const warnaPersen = (v) => (v == null ? "" : v >= 90 ? "var(--ok,#16a34a)" : v >= 75 ? "#d97706" : "var(--bad,#c0392b)");
  const catKey = "kbCatatan_" + K.bulanYM; let cat = ""; try { cat = localStorage.getItem(catKey) || ""; } catch (e) {}
  return `<style>
    .modal-lebar{max-width:min(980px,96vw)!important;width:96vw}
    .kb-tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(118px,1fr));gap:8px;margin:4px 0 14px}
    .kb-tile{border:1px solid var(--border-soft);border-radius:14px;padding:10px;display:flex;flex-direction:column;gap:2px;background:var(--surface,#fff)}
    .kb-tile span{font-size:18px}.kb-tile b{font-size:20px;line-height:1.1}.kb-tile small{font-size:11px;color:var(--text-secondary)}
    .kb-sec{font-weight:800;font-size:13px;margin:14px 0 8px;display:flex;align-items:center;gap:6px}
    .kb-box{border:1px solid var(--border-soft);border-radius:14px;padding:12px 14px;background:var(--surface,#fff)}
    .kb-box ul{margin:0;padding-left:18px;display:grid;gap:4px;font-size:12.5px;line-height:1.5}
    .kb-rek{background:rgba(217,119,6,.07);border-color:rgba(217,119,6,.35)}
    .kb-guru{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:8px}
    .kb-g{border:1px solid var(--border-soft);border-radius:12px;padding:9px 11px;font-size:11.5px;background:var(--surface,#fff)}
    .kb-g-h{display:flex;justify-content:space-between;gap:6px;align-items:center;margin-bottom:5px}.kb-g-h b{font-size:12.5px}
    .kb-g-s{display:grid;grid-template-columns:repeat(4,1fr);gap:4px;text-align:center}.kb-g-s div{background:var(--bg-soft,rgba(0,0,0,.03));border-radius:8px;padding:4px 2px}.kb-g-s b{display:block;font-size:13px}.kb-g-s small{font-size:9.5px;color:var(--text-secondary)}
    .kb-skor{font-weight:800;padding:2px 8px;border-radius:999px;color:#fff;font-size:11px}
    .kb-kelas{border:1px solid var(--border-soft);border-radius:12px;margin-bottom:8px;background:var(--surface,#fff)}
    .kb-kelas summary{cursor:pointer;padding:10px 12px;display:flex;flex-wrap:wrap;gap:6px 12px;align-items:center;font-size:12px}
    .kb-kelas summary b{font-size:13px;margin-right:auto}
    .kb-mp{border-top:1px dashed var(--border-soft);padding:8px 12px;font-size:11.5px;display:grid;gap:2px}
    .kb-mp-h{display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap}.kb-mp-h b{font-size:12px}
    .kb-chip{display:inline-block;padding:1px 7px;border-radius:999px;background:var(--bg-soft,rgba(0,0,0,.05));font-size:10.5px;margin-right:4px}
    .kb-aksi{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px;position:sticky;bottom:0;background:var(--surface,#fff);padding:8px 0}
    .kb-aksi .btn{flex:1;min-width:130px}
  </style>
  <div style="font-size:11.5px;color:var(--text-secondary);margin:-6px 0 10px;">Bahan rapat bulanan · nilai: semester ${K.info.semester} ${K.info.ta} · data otomatis dari absensi, jurnal, tukar jam & nilai.</div>
  <div class="kb-tiles">
    ${tile("👨‍🏫", "Kehadiran guru", K.persenGuru + "%", warnaPersen(K.persenGuru))}
    ${tile("📝", "Jurnal lengkap", K.persenJurnal + "%", warnaPersen(K.persenJurnal))}
    ${tile("🗓️", "Sesi mengajar", K.T.total || 0)}
    ${tile("🔴", "Alpha guru", K.T.alpha || 0, K.T.alpha ? "var(--bad,#c0392b)" : "")}
    ${tile("✉️", "Izin / Sakit", (K.T.izin || 0) + " / " + (K.T.sakit || 0))}
    ${tile("🔄", "Tukar jam", (K.T.tukar || 0) + "x")}
    ${tile("🧑‍🎓", "Kehadiran santri", K.persenSantri == null ? "–" : K.persenSantri + "%", warnaPersen(K.persenSantri))}
    ${tile("📚", "Rata tugas / UH", _kbBulat(K.rTugas) + " / " + _kbBulat(K.rUH))}
  </div>
  <div class="kb-sec">✅ Kesimpulan</div><div class="kb-box"><ul>${K.poin.map((p) => `<li>${escapeHtml(p)}</li>`).join("")}</ul></div>
  <div class="kb-sec">🎯 Rekomendasi untuk rapat</div><div class="kb-box kb-rek"><ul>${K.rek.map((p) => `<li>${escapeHtml(p)}</li>`).join("")}</ul></div>
  <div class="kb-sec">👨‍🏫 Kinerja per guru <span style="font-weight:400;font-size:11px;color:var(--text-secondary);">(urut skor kedisiplinan)</span></div>
  <div class="kb-guru">${K.guru.map((r) => `<div class="kb-g"><div class="kb-g-h"><b>${escapeHtml(r.nama)}</b><span class="kb-skor" style="background:${warnaPersen(r.skor) || "#6b7280"}">${r.skor}</span></div>
    <div class="kb-g-s"><div><b>${r.persen}%</b><small>hadir</small></div><div><b>${r.persenJurnal}%</b><small>jurnal</small></div><div><b style="${r.alpha ? "color:var(--bad,#c0392b)" : ""}">${r.alpha}</b><small>alpha</small></div><div><b>${r.tukar ? r.tukar + "x" : "–"}</b><small>tukar</small></div></div>
    <div style="margin-top:5px;color:var(--text-secondary);">${r.total} sesi · izin ${r.izin} · sakit ${r.sakit}${r.bersyarat ? ` · bersyarat ${r.bersyarat}` : ""}${r.tertunda ? ` · jurnal tertunda ${r.tertunda}` : ""}</div></div>`).join("") || `<div style="font-size:12px;color:var(--text-secondary);">Belum ada data.</div>`}</div>
  <div class="kb-sec">🏫 Progres mengajar & capaian santri per kelas <span style="font-weight:400;font-size:11px;color:var(--text-secondary);">(ketuk kelas untuk rincian)</span></div>
  ${K.kelas.map((k) => `<details class="kb-kelas"><summary><b>${escapeHtml(formatKelasLabel(k.nama))}</b><span class="kb-chip">${k.pertemuan} pertemuan</span><span class="kb-chip">santri hadir ${k.persenSantri == null ? "–" : k.persenSantri + "%"}</span><span class="kb-chip">tugas ${_kbBulat(k.rTugas)}</span><span class="kb-chip">UH ${_kbBulat(k.rUH)}</span></summary>
    ${k.mapel.map((m) => `<div class="kb-mp"><div class="kb-mp-h"><b>${escapeHtml(m.nama)}</b><span style="color:var(--text-secondary);">${escapeHtml(m.guru)} · ${m.pertemuan}x</span></div>
      <div>📍 <b>Sampai:</b> ${m.terakhir ? `${escapeHtml(m.terakhir.isi)} <span style="color:var(--text-secondary);">(${_tglPendek(m.terakhir.t)})</span>` : `<span style="color:var(--text-secondary);">belum ada jurnal bulan ini</span>`}</div>
      ${m.rTugas != null || m.rUH != null ? `<div>📊 Tugas ${_kbBulat(m.rTugas)} · UH ${_kbBulat(m.rUH)}${(m.rUH ?? m.rTugas) < 70 ? ` <span style="color:var(--bad,#c0392b);font-weight:700;">perlu remedial</span>` : ""}</div>` : ""}</div>`).join("")}
  </details>`).join("") || `<div style="font-size:12px;color:var(--text-secondary);">Belum ada jurnal atau nilai bulan ini.</div>`}
  <div class="kb-sec">🗒️ Catatan & keputusan rapat</div>
  <textarea class="input" rows="4" placeholder="Tulis keputusan rapat, tindak lanjut, penanggung jawab…" oninput="try{localStorage.setItem('${catKey}',this.value)}catch(e){}">${escapeHtml(cat)}</textarea>
  <div class="kb-aksi"><button class="btn btn-outline" onclick="_kbSalin()">📋 Salin (WA)</button><button class="btn btn-accent" onclick="_kbCetak()">🖨️ Cetak / PDF</button></div>`;
}

function _kbTeks() {
  const K = _KB; if (!K) return "";
  let catatan = ""; try { catatan = localStorage.getItem("kbCatatan_" + K.bulanYM) || ""; } catch (e) {}
  return `🧭 *KESIMPULAN BULANAN — ${namaBulanIndo(K.bulanYM).toUpperCase()}*\n\n` +
    `👨‍🏫 Kehadiran guru: *${K.persenGuru}%* (${K.T.total || 0} sesi)\n📝 Jurnal lengkap: *${K.persenJurnal}%*\n🔴 Alpha: ${K.T.alpha || 0} · ✉️ Izin ${K.T.izin || 0} · 🤒 Sakit ${K.T.sakit || 0} · 🔄 Tukar jam ${K.T.tukar || 0}x\n` +
    `🧑‍🎓 Kehadiran santri: ${K.persenSantri == null ? "-" : K.persenSantri + "%"} · 📚 Rata tugas ${_kbBulat(K.rTugas)} / UH ${_kbBulat(K.rUH)}\n\n` +
    `*Kesimpulan*\n${K.poin.map((p) => "• " + p).join("\n")}\n\n*Rekomendasi*\n${K.rek.map((p) => "• " + p).join("\n")}` +
    (catatan.trim() ? `\n\n*Catatan rapat*\n${catatan.trim()}` : "");
}
function _kbSalin() {
  const t = _kbTeks();
  (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(() => toast("Kesimpulan disalin — tempel di grup WA", "ok")).catch(() => prompt("Salin teks berikut:", t));
}
function _kbCetak() {
  const isi = qs("kb-wrap"); if (!isi) return;
  const w = window.open("", "_blank"); if (!w) { toast("Izinkan pop-up untuk mencetak", "warn"); return; }
  const klon = isi.cloneNode(true);
  klon.querySelectorAll("details").forEach((d) => d.setAttribute("open", ""));
  klon.querySelectorAll(".kb-aksi").forEach((x) => x.remove());
  const ta = klon.querySelector("textarea"); if (ta) { const p = document.createElement("div"); p.className = "kb-box"; p.style.whiteSpace = "pre-wrap"; p.textContent = isi.querySelector("textarea")?.value || "-"; ta.replaceWith(p); }
  w.document.write(`<!doctype html><html lang="id"><head><meta charset="utf-8"><title>Kesimpulan Bulanan ${namaBulanIndo(_KB.bulanYM)}</title><style>body{font:12px/1.45 system-ui,'Segoe UI',sans-serif;color:#111;margin:16px}h3{margin:0 0 6px}@page{size:A4;margin:12mm}:root{--border-soft:#ddd;--text-secondary:#666;--surface:#fff;--bg-soft:#f3f4f6}</style></head><body>${klon.innerHTML}<script>onload=function(){setTimeout(function(){print()},300)}<\/script></body></html>`);
  w.document.close();
}

// ============================================================
//  INSENTIF TAMBAHAN — baris di luar JP mengajar & musyrif (mis. Tahsin Musyrif 8x @50.000).
//  slip_gaji dihitung ulang server (Edge Function) sehingga tidak bisa ditambah kolom dari sini;
//  tambahan disimpan per bulan di kuliah_pengaturan (kunci "insentif:tambahan:YYYY-MM") lalu
//  dijumlahkan ke Total Gabungan Laporan Kinerja, Slip Gaji, dan nomor slip.
// ============================================================
async function _ambilInsentifTambahan(bulanYM) {
  try {
    const r = await supa.from("kuliah_pengaturan").select("nilai").eq("kunci", "insentif:tambahan:" + bulanYM).maybeSingle();
    return Array.isArray(r.data && r.data.nilai) ? r.data.nilai : [];
  } catch (e) { console.warn("Gagal ambil insentif tambahan:", e); return []; }
}
async function _simpanInsentifTambahan(bulanYM, daftar) {
  const { error } = await supa.from("kuliah_pengaturan").upsert({ kunci: "insentif:tambahan:" + bulanYM, nilai: daftar });
  if (error) throw error;
}
async function bukaInsentifTambahan() {
  if (!isAdmin()) { toast(t("hanyaAdminHapus"), "err"); return; }
  const bulanYM = qs("lk-bulan")?.value || bulanIniISO();
  const daftar = await _ambilInsentifTambahan(bulanYM);
  const guru = (LOOKUP.guruAll || []).filter((g) => g.status_aktif !== false).sort((a, b) => a.nama.localeCompare(b.nama));
  const nama = (id) => (LOOKUP.guruAll || []).find((g) => g.id === id)?.nama || "-";
  const total = daftar.reduce((a, x) => a + Number(x.jumlah || 0), 0);
  openModal(`<h3>➕ Insentif Tambahan · ${namaBulanIndo(bulanYM)}</h3>
    <div style="font-size:11.5px;color:var(--text-secondary);margin:-8px 0 10px;line-height:1.45;">Untuk honor di luar jam mengajar & musyrif (tahsin musyrif, ekskul, panitia, dll.). Otomatis masuk <b>Total Gabungan</b> dan tercetak di <b>Slip Gaji</b> bulan ini.</div>
    <div style="max-height:34vh;overflow-y:auto;border:1px solid var(--border-soft);border-radius:12px;padding:0 10px;margin-bottom:12px;">
      ${daftar.length ? daftar.map((x) => `<div style="display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px dashed var(--border-soft);font-size:12px;">
        <div style="flex:1;min-width:0;"><b>${escapeHtml(nama(x.guru_id))}</b><br/><span style="color:var(--text-secondary);">${escapeHtml(x.ket)}</span></div>
        <b style="white-space:nowrap;">${formatRupiah(Number(x.jumlah || 0))}</b>
        <button class="btn btn-ghost" style="padding:4px 8px;font-size:11px;" onclick="_hapusInsentifTambahan('${bulanYM}','${x.id}')">🗑️</button></div>`).join("") + `<div style="display:flex;justify-content:space-between;padding:8px 0;font-weight:800;font-size:12.5px;"><span>Total</span><span>${formatRupiah(total)}</span></div>`
      : `<div style="font-size:12px;color:var(--text-secondary);padding:12px 0;">Belum ada insentif tambahan bulan ini.</div>`}
    </div>
    <div class="field"><label class="form-label">Guru</label><select id="it-guru" class="input">${guru.map((g) => `<option value="${g.id}">${escapeHtml(g.nama)}</option>`).join("")}</select></div>
    <div class="field"><label class="form-label">Keterangan</label><input id="it-ket" class="input" placeholder="mis. Tahsin Musyrif Senin malam (Sep–Okt)"/></div>
    <div style="display:grid;grid-template-columns:1fr 1.4fr;gap:8px;">
      <div class="field"><label class="form-label">Jumlah kali</label><input id="it-qty" type="number" min="1" value="1" class="input" oninput="_itHitung()"/></div>
      <div class="field"><label class="form-label">Tarif per kali (Rp)</label><input id="it-tarif" type="number" min="0" step="1000" class="input" placeholder="50000" oninput="_itHitung()"/></div>
    </div>
    <div id="it-total" style="font-size:12.5px;font-weight:800;margin:-4px 0 10px;">Total: Rp0</div>
    <button class="btn btn-accent" style="width:100%;" onclick="_tambahInsentifTambahan('${bulanYM}')">💾 Tambahkan ke ${namaBulanIndo(bulanYM)}</button>`);
}
function _itHitung() { const el = qs("it-total"); if (el) el.textContent = "Total: " + formatRupiah((+qs("it-qty").value || 0) * (+qs("it-tarif").value || 0)); }
async function _tambahInsentifTambahan(bulanYM) {
  const guruId = qs("it-guru").value, qty = +qs("it-qty").value || 0, tarif = +qs("it-tarif").value || 0, ket0 = qs("it-ket").value.trim();
  if (!ket0) { toast("Isi keterangannya dulu", "err"); qs("it-ket").focus(); return; }
  if (qty <= 0 || tarif <= 0) { toast("Isi jumlah kali dan tarif", "err"); return; }
  const ket = qty > 1 ? `${ket0} — ${qty}x @ ${formatRupiah(tarif)}` : ket0;
  try {
    const daftar = await _ambilInsentifTambahan(bulanYM);
    daftar.push({ id: Date.now().toString(36), guru_id: guruId, ket, qty, tarif, jumlah: qty * tarif, oleh: STATE.guruNama || null, t: Date.now() });
    await _simpanInsentifTambahan(bulanYM, daftar);
    toast("Insentif tambahan disimpan ✓", "ok");
    await bukaInsentifTambahan();
    if (typeof renderLaporanKinerja === "function") renderLaporanKinerja();
  } catch (e) { console.error(e); toast("Gagal menyimpan: " + (e.message || e), "err"); }
}
async function _hapusInsentifTambahan(bulanYM, id) {
  if (!(await konfirmasiTema("Hapus baris insentif tambahan ini?", { ikon: "🗑️", judul: "Hapus Tambahan" }))) return;
  try {
    const daftar = (await _ambilInsentifTambahan(bulanYM)).filter((x) => x.id !== id);
    await _simpanInsentifTambahan(bulanYM, daftar);
    toast("Dihapus", "ok"); await bukaInsentifTambahan();
    if (typeof renderLaporanKinerja === "function") renderLaporanKinerja();
  } catch (e) { toast("Gagal menghapus: " + (e.message || e), "err"); }
}

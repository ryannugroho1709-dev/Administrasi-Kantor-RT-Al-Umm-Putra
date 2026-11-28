// ============================================================
//  SUSUNAN RAPOR UMUM — baris "Kelompok Mata Pelajaran Umum" & "Muatan Pemberdayaan dan Keterampilan"
//  mengikuti FORMAT RAPOR SEKOLAH, bukan sekadar daftar mapel di Kurikulum.
//  • Satu baris rapor bisa bersumber dari: satu mapel, satu BAGIAN mapel gabungan (PPKN dari "PPKN/Seni Budaya"),
//    atau beberapa mapel sekaligus (Biologi + Fisika + Kimia → "Ilmu Pengetahuan Alam") — nilainya dirata-rata.
//  • Baris yang sumbernya belum ditentukan → tanda kuning di pengaturan, tercetak "-" (tidak dikarang).
//  • Mapel yang dipakai kelas (jadwal / ada nilai) tapi belum masuk baris mana pun ikut ditambahkan di akhir,
//    supaya tidak ada nilai yang hilang dari rapor.
//  • Capaian per bagian mapel gabungan disimpan di capaian_pembelajaran dengan penanda [[Nama Bagian]].
//  Data: kuliah_pengaturan "rapor:susunan" (per ruang) → { A|B|C: [{ g:"u"|"p", nama, src:["<mapelId>"|"<mapelId>::<Bagian>"] }] }
// ============================================================
const RS = { data: null, dipakai: {} };
const _RS_KV = "rapor:susunan";
const _rsPaket = (namaKelas) => (typeof paketDariNamaKelas === "function" && paketDariNamaKelas(namaKelas)) || "A";
const _rsNorm = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9]/g, "");

// ── Capaian per bagian mapel gabungan ──
// "[[PPKN]] teks…\n[[Seni Budaya]] teks…"  (teks tanpa penanda = capaian lama bersama)
function _cpPecah(teks) {
  const s = String(teks || ""), out = { _: "" };
  const re = /\[\[([^\]]+)\]\]/g; let m, akhir = 0, kunci = "_";
  while ((m = re.exec(s))) { out[kunci] = ((out[kunci] || "") + s.slice(akhir, m.index)).trim(); kunci = m[1].trim(); akhir = re.lastIndex; }
  out[kunci] = ((out[kunci] || "") + s.slice(akhir)).trim();
  return out;
}
function cpSub(teks, sub) { const p = _cpPecah(teks); return sub ? (p[sub] != null && p[sub] !== "" ? p[sub] : p._) : teks || ""; }
function cpPasangSub(teks, sub, isi) {
  const p = _cpPecah(teks); p[sub] = String(isi || "").trim();
  return [p._, ...Object.keys(p).filter((k) => k !== "_" && p[k]).map((k) => `[[${k}]] ${p[k]}`)].filter(Boolean).join("\n");
}
function cpTampil(teks) {
  const p = _cpPecah(teks), bagian = Object.keys(p).filter((k) => k !== "_" && p[k]);
  if (!bagian.length) return p._ || "";
  return [p._, ...bagian.map((k) => `${k}: ${p[k]}`)].filter(Boolean).join("\n");
}

// ── Data ──
async function _rsMuat(paksa) {
  if (!RS.data || paksa) RS.data = (await _kvAmbil(_RS_KV, {}).catch(() => ({}))) || {};
  return RS.data;
}
// mapel yang dipakai kelas: dari jadwal pelajaran kelas itu + mapel yang sudah punya nilai
async function _rsDipakai(kelasId) {
  if (RS.dipakai[kelasId]) return RS.dipakai[kelasId];
  const set = new Set();
  try { const r = await supa.from("jadwal_pelajaran").select("mapel_id").eq("kelas_id", kelasId); (r.data || []).forEach((x) => x.mapel_id && set.add(x.mapel_id)); } catch (e) {}
  return (RS.dipakai[kelasId] = set);
}
const _rsMapel = (id) => (LOOKUP.mapel || []).find((m) => m.id === id);
const _rsCocokPaket = (m, paket) => paket === "A" || (paket === "B" ? m.paket_b : paket === "C" ? m.paket_c : true);
function _rsLabelSrc(src) {
  const [id, sub] = String(src).split("::"), m = _rsMapel(id);
  if (!m) return "(mapel terhapus)";
  return sub ? `${sub} (bagian ${m.nama_mapel})` : m.nama_mapel;
}

// Susunan otomatis lama: alias diniyyah (Aqidah → PAI) + mapel umum + pemberdayaan — kini hanya mapel yang dipakai kelas
function _rsOtomatis(paket, dipakai) {
  const pakai = (m) => _rsCocokPaket(m, paket) && (!dipakai.size || dipakai.has(m.id));
  const alias = (LOOKUP.mapel || []).filter((m) => m.masuk_diniyyah && m.alias_rapor_umum && pakai(m));
  const idAlias = new Set(alias.map((m) => m.id)), urut = (a, b) => a.nama_mapel.localeCompare(b.nama_mapel, "id");
  const umum = (LOOKUP.mapel || []).filter((m) => m.masuk_umum && m.kategori !== "pemberdayaan" && pakai(m) && !idAlias.has(m.id)).sort(urut);
  const daya = (LOOKUP.mapel || []).filter((m) => m.masuk_umum && m.kategori === "pemberdayaan" && pakai(m) && !idAlias.has(m.id)).sort(urut);
  return [...alias.map((m) => ({ g: "u", nama: m.alias_rapor_umum, src: [m.id] })), ...umum.map((m) => ({ g: "u", nama: m.nama_mapel, src: [m.id] })), ...daya.map((m) => ({ g: "p", nama: m.nama_mapel, src: [m.id] }))];
}

// Susunan FORMAT RAPOR SEKOLAH (Lembar Isi Mata Pelajaran) — sumber ditebak dari nama mapel; yang tidak ketemu dibiarkan kosong (kuning)
const RS_FORMAT = [
  ["u", "Pendidikan Agama Islam dan Budi Pekerti", /^(pai|pendidikanagama|agamaislam)/, "alias"],
  ["u", "Pendidikan Pancasila", /^(ppkn|pkn|pancasila|pendidikanpancasila)/],
  ["u", "Bahasa Indonesia", /^bahasaindonesia$/],
  ["u", "Matematika", /^matematika$/],
  ["u", "Ilmu Pengetahuan Alam", /^(ipa|ipas|biologi|fisika|kimia|ilmupengetahuanalam)/, "ipa"],
  ["u", "Ilmu Pengetahuan Sosial", /^(ips|ekonomi|geografi|sosiologi|ilmupengetahuansosial)/, "ips"],
  ["u", "Pendidikan Jasmani Olahraga dan Kesehatan", /^(pjok|penjas|pendidikanjasmani|olahraga)/],
  ["u", "Seni Budaya", /^(senibudaya|sbdp|seni)/],
  ["u", "Bahasa Inggris", /^bahasainggris$/],
  ["u", "Muatan Lokal", /^(muatanlokal|mulok)/],
  ["p", "Pemberdayaan", /^pemberdayaan/],
  ["p", "Keterampilan", /^(keterampilan|tik|informatika|prakarya|mediakreatif)/, "daya"],
];
function _rsKandidat(paket, dipakai) {
  // semua sumber yang mungkin: mapel utuh + tiap bagian mapel gabungan
  const out = [];
  (LOOKUP.mapel || []).filter((m) => _rsCocokPaket(m, paket) && (m.masuk_umum || m.alias_rapor_umum)).forEach((m) => {
    const dp = !dipakai.size || dipakai.has(m.id);
    out.push({ src: m.id, nama: m.nama_mapel, m, dp });
    (typeof subMapel === "function" ? subMapel(m.id) : []).forEach((s) => out.push({ src: `${m.id}::${s}`, nama: s, m, dp, sub: s }));
  });
  return out;
}
function _rsFormatSekolah(paket, dipakai) {
  const kand = _rsKandidat(paket, dipakai), dp = kand.filter((k) => k.dp);
  const nama = (k) => _rsNorm(k.nama);
  const panjang = (x) => (typeof _SINGKATAN_SUB !== "undefined" && _SINGKATAN_SUB[x.trim().toLowerCase()]) || x.trim(); // "Ek" → "Ekonomi"
  const bagianSains = (re) => dp.filter((k) => !k.sub && k.m.nama_mapel.includes("/") && k.m.nama_mapel.split("/").every((x) => re.test(_rsNorm(panjang(x)))));
  return RS_FORMAT.map(([g, label, re, jenis]) => {
    let src = [];
    if (jenis === "alias") {
      const a = dp.filter((k) => !k.sub && k.m.masuk_diniyyah && k.m.alias_rapor_umum && re.test(_rsNorm(k.m.alias_rapor_umum)));
      src = (a.length ? a : dp.filter((k) => !k.sub && re.test(nama(k)))).slice(0, 1).map((k) => k.src);
    } else if (jenis === "ipa" || jenis === "ips") {
      // mapel gabungan sains/sosial utuh ("Biologi/Kimia/Fisika") → satu baris; kalau tidak ada, mapel-mapel tunggalnya dirata-rata
      const gab = bagianSains(re);
      src = gab.length ? [gab[0].src] : dp.filter((k) => !k.sub && !k.m.nama_mapel.includes("/") && re.test(nama(k))).map((k) => k.src);
    } else if (jenis === "daya") {
      const d = dp.filter((k) => !k.sub && k.m.kategori === "pemberdayaan");
      src = (d.length ? d : dp.filter((k) => !k.sub && re.test(nama(k)))).slice(0, 1).map((k) => k.src);
    } else {
      const tunggal = dp.filter((k) => !k.sub && !k.m.nama_mapel.includes("/") && re.test(nama(k)));
      const bagian = dp.filter((k) => k.sub && re.test(nama(k)));
      src = (tunggal.length ? tunggal : bagian).slice(0, 1).map((k) => k.src);
    }
    if (jenis === "ipa" || jenis === "ips") label += src.length === 1 && _rsMapel(src[0])?.nama_mapel.includes("/") ? ` (${_rsMapel(src[0]).nama_mapel.split("/").map(panjang).sort().join(", ")})` : "";
    return { g, nama: label, src };
  });
}
function _rsBawaan(paket, dipakai) {
  return STATE.ruang === "Pa" && (paket === "B" || paket === "C") ? _rsFormatSekolah(paket, dipakai) : _rsOtomatis(paket, dipakai);
}

// Mapel/bagian yang dipakai kelas tapi tidak tercakup baris mana pun → ditambahkan (supaya nilai tidak hilang)
function _rsTambahSisa(baris, paket, dipakai, nilaiMapelIds) {
  const tercakup = new Set(baris.flatMap((b) => b.src || []));
  const tercakupUtuh = new Set([...tercakup].filter((s) => !s.includes("::")));
  const sisa = [];
  (LOOKUP.mapel || []).filter((m) => m.masuk_umum && _rsCocokPaket(m, paket) && (dipakai.has(m.id) || nilaiMapelIds.has(m.id))).forEach((m) => {
    if (tercakupUtuh.has(m.id)) return;
    const subs = typeof subMapel === "function" ? subMapel(m.id) : [];
    const subTercakup = subs.filter((s) => tercakup.has(`${m.id}::${s}`));
    if (!subTercakup.length) { sisa.push({ g: m.kategori === "pemberdayaan" ? "p" : "u", nama: m.nama_mapel, src: [m.id], tambahan: true }); return; }
    subs.filter((s) => !subTercakup.includes(s)).forEach((s) => sisa.push({ g: m.kategori === "pemberdayaan" ? "p" : "u", nama: s, src: [`${m.id}::${s}`], tambahan: true }));
  });
  return [...baris, ...sisa];
}

// Siapkan susunan untuk satu kelas (dipanggil sekali per kelas sebelum menggambar/cetak)
async function rsSiapkan(kelas, nilaiKelas) {
  await _rsMuat();
  const paket = _rsPaket(kelas?.nama_kelas), dipakai = kelas?.id ? await _rsDipakai(kelas.id) : new Set();
  const atur = RS.data?.[paket];
  const baris = Array.isArray(atur) && atur.length ? atur : _rsBawaan(paket, dipakai);
  const nilaiIds = new Set((nilaiKelas || []).map((n) => n.mapel_id));
  return { paket, dipakai, diatur: Array.isArray(atur) && atur.length > 0, baris: _rsTambahSisa(baris, paket, dipakai, nilaiIds) };
}
// Baris rapor satu santri → { u:[{nama, na, cp, belum}], p:[…] }   na = nilai akhir (angka) atau null
function rsBaris(ctx, nilaiSiswa) {
  const cari = (id) => (nilaiSiswa || []).find((n) => n.mapel_id === id);
  const isi = (b) => {
    const nilai = [], cp = [];
    (b.src || []).forEach((src) => {
      const [id, sub] = String(src).split("::"), row = cari(id); if (!row) return;
      const na = hitungNilaiAkhir(sub ? lensaSub(row, sub) : row)?.nilaiAkhir;
      if (na > 0) nilai.push(na);
      const c = sub ? cpSub(row.capaian_pembelajaran, sub) : cpTampil(row.capaian_pembelajaran);
      if (c && !cp.includes(c)) cp.push(c);
    });
    const na = nilai.length ? Math.round((nilai.reduce((a, v) => a + v, 0) / nilai.length) * 10) / 10 : null;
    return { nama: b.nama, na, cp: cp.join("\n"), belum: !(b.src || []).length, tambahan: !!b.tambahan };
  };
  const semua = ctx.baris.map(isi);
  return { u: semua.filter((_, i) => ctx.baris[i].g !== "p"), p: semua.filter((_, i) => ctx.baris[i].g === "p") };
}

// ── Pengaturan: ⚙️ Susunan Rapor (Admin & Kepala Sekolah) ──
const RSE = { paket: null, baris: [], kelas: null };
async function bukaSusunanRapor(paketAwal) {
  if (typeof _rwkBolehAtur === "function" && !_rwkBolehAtur()) { toast("Hanya Admin atau Kepala Sekolah", "err"); return; }
  await ensureLookups(); await _rsMuat(true);
  const paketAda = [...new Set((LOOKUP.kelas || []).map((k) => _rsPaket(k.nama_kelas)))].sort();
  RSE.paket = paketAwal && paketAda.includes(paketAwal) ? paketAwal : paketAda[0] || "A";
  await _rseMuatPaket();
}
async function _rseMuatPaket() {
  const kelasPaket = (LOOKUP.kelas || []).filter((k) => _rsPaket(k.nama_kelas) === RSE.paket);
  const dipakai = new Set();
  for (const k of kelasPaket) (await _rsDipakai(k.id)).forEach((id) => dipakai.add(id));
  RSE.dipakai = dipakai;
  const atur = RS.data?.[RSE.paket];
  RSE.diatur = Array.isArray(atur) && atur.length > 0;
  RSE.baris = _rsTambahSisa(JSON.parse(JSON.stringify(RSE.diatur ? atur : _rsBawaan(RSE.paket, dipakai))), RSE.paket, dipakai, new Set());
  _rseGambar();
}
function _rseGambar() {
  const e = escapeHtml, paketAda = [...new Set((LOOKUP.kelas || []).map((k) => _rsPaket(k.nama_kelas)))].sort();
  const kelasPaket = (LOOKUP.kelas || []).filter((k) => _rsPaket(k.nama_kelas) === RSE.paket).map((k) => k.nama_kelas).join(", ");
  const kand = _rsKandidat(RSE.paket, RSE.dipakai);
  const belum = RSE.baris.filter((b) => !(b.src || []).length).length;
  const grup = (g, judul) => {
    const idx = RSE.baris.map((b, i) => [b, i]).filter(([b]) => (b.g === "p") === (g === "p"));
    return `<div class="rse-grup"><div class="rse-grup-h">${judul}</div>${idx.map(([b, i], n) => `
      <div class="rse-baris ${(b.src || []).length ? "" : "kuning"}">
        <span class="rse-no">${n + 1}</span>
        <div class="rse-isi"><input class="input rse-nama" value="${e(b.nama)}" onchange="RSE.baris[${i}].nama=this.value.trim()" placeholder="Nama di rapor">
          <div class="rse-src">${(b.src || []).map((s) => `<span class="rse-chip">${e(_rsLabelSrc(s))}<button onclick="_rseHapusSrc(${i},'${e(s)}')" title="Lepas">×</button></span>`).join("") || `<span class="rse-kosong">⚠️ Sumber nilai belum ditentukan — tercetak "-"</span>`}
            <select class="input rse-tambah" onchange="if(this.value){_rseTambahSrc(${i},this.value)}"><option value="">＋ Ambil Nilai Dari</option>${kand.map((k) => `<option value="${e(k.src)}">${e(k.sub ? `   ↳ ${k.nama} (bagian ${k.m.nama_mapel})` : k.nama)}${k.dp ? "" : " — tidak ada di jadwal"}</option>`).join("")}</select></div>
          ${b.tambahan ? `<small class="rse-ket">Ditambahkan otomatis: mapel ini dipakai kelas tetapi belum masuk baris mana pun.</small>` : ""}</div>
        <div class="rse-aksi"><button onclick="_rseGeser(${i},-1)" title="Naik">▲</button><button onclick="_rseGeser(${i},1)" title="Turun">▼</button><button onclick="_rsePindahGrup(${i})" title="Pindah kelompok">⇄</button><button onclick="_rseHapus(${i})" title="Hapus baris">🗑</button></div>
      </div>`).join("")}
      <button class="btn btn-sm btn-ghost" onclick="_rseTambahBaris('${g}')">＋ Tambah Baris</button></div>`;
  };
  openModal(`<div class="rse">
    <h3>🧾 Susunan Rapor</h3>
    <div class="rse-sub">Baris rapor umum (cetak Word & Rapor Umum) mengikuti format rapor sekolah. Satu baris bisa mengambil nilai dari satu mapel, satu bagian mapel gabungan, atau beberapa mapel (dirata-rata).</div>
    <div class="rse-tab">${paketAda.map((p) => `<button class="${p === RSE.paket ? "on" : ""}" onclick="RSE.paket='${p}';_rseMuatPaket()">Paket ${p}</button>`).join("")}</div>
    <div class="rse-info">Kelas: <b>${e(kelasPaket || "-")}</b> · ${RSE.diatur ? "✓ Susunan tersimpan" : "Belum disimpan — yang tampil adalah usulan otomatis"}${belum ? ` · <b class="rse-kuning-teks">${belum} baris belum ada sumber nilainya</b>` : ""}</div>
    <div class="rse-alat"><button class="btn btn-sm btn-outline" onclick="RSE.baris=_rsTambahSisa(_rsFormatSekolah(RSE.paket,RSE.dipakai),RSE.paket,RSE.dipakai,new Set());_rseGambar()">📄 Pakai Format Rapor Sekolah</button>
      <button class="btn btn-sm btn-outline" onclick="RSE.baris=_rsOtomatis(RSE.paket,RSE.dipakai);_rseGambar()">🤖 Otomatis dari Daftar Mapel</button></div>
    ${grup("u", "Kelompok Mata Pelajaran Umum")}
    ${grup("p", "Muatan Pemberdayaan dan Keterampilan")}
    <div class="rse-kaki"><button class="btn btn-outline" onclick="closeModal()">Tutup</button><button class="btn btn-accent" onclick="_rseSimpan()">💾 Simpan Susunan Paket ${RSE.paket}</button></div>
  </div>`, { lebar: true });
}
function _rseTambahSrc(i, src) { const b = RSE.baris[i]; b.src = [...new Set([...(b.src || []), src])]; delete b.tambahan; if (!b.nama) b.nama = _rsLabelSrc(src).replace(/ \(bagian.*$/, ""); _rseGambar(); }
function _rseHapusSrc(i, src) { RSE.baris[i].src = (RSE.baris[i].src || []).filter((s) => s !== src); _rseGambar(); }
function _rseGeser(i, d) {
  const g = RSE.baris[i].g === "p", idx = RSE.baris.map((b, k) => [b, k]).filter(([b]) => (b.g === "p") === g).map(([, k]) => k), pos = idx.indexOf(i), j = idx[pos + d];
  if (j == null) return; [RSE.baris[i], RSE.baris[j]] = [RSE.baris[j], RSE.baris[i]]; _rseGambar();
}
function _rsePindahGrup(i) { RSE.baris[i].g = RSE.baris[i].g === "p" ? "u" : "p"; _rseGambar(); }
function _rseHapus(i) { RSE.baris.splice(i, 1); _rseGambar(); }
function _rseTambahBaris(g) { RSE.baris.push({ g, nama: "", src: [] }); _rseGambar(); }
async function _rseSimpan() {
  const baris = RSE.baris.filter((b) => (b.nama || "").trim()).map((b) => ({ g: b.g === "p" ? "p" : "u", nama: b.nama.trim(), src: b.src || [] }));
  if (!baris.length) { toast("Susunan masih kosong", "err"); return; }
  try {
    setGlobalLoading(true, "Menyimpan susunan rapor…");
    RS.data = await _kvGabung(_RS_KV, { [RSE.paket]: baris });
    RSE.diatur = true; toast(`🧾 Susunan rapor Paket ${RSE.paket} tersimpan`, "ok"); _rseMuatPaket();
  } catch (e) { toast("Gagal menyimpan: " + (e.message || e), "err"); }
  finally { setGlobalLoading(false); }
}

(function () {
  const css = `.rse h3{margin:0 0 4px}.rse-sub{font-size:12px;color:var(--text-secondary);margin-bottom:10px}
  .rse-tab{display:flex;gap:6px;margin-bottom:8px;flex-wrap:wrap}.rse-tab button{border:1px solid var(--border,#ddd);background:var(--surface,#fff);border-radius:999px;padding:5px 14px;font-weight:600;cursor:pointer;color:inherit}.rse-tab button.on{background:var(--accent,#2f6b3f);color:#fff;border-color:transparent}
  .rse-info{font-size:12px;margin-bottom:8px}.rse-kuning-teks{color:#a16207}.rse-alat{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px}
  .rse-grup{border:1px solid var(--border,#e5e7eb);border-radius:12px;padding:8px;margin-bottom:10px}.rse-grup-h{font-weight:700;text-align:center;background:#dfe9e1;color:#1f3d27;border-radius:8px;padding:5px;margin-bottom:6px;font-size:12.5px}
  .rse-baris{display:flex;gap:8px;align-items:flex-start;padding:7px;border-radius:10px;border:1px solid transparent;margin-bottom:4px}.rse-baris.kuning{background:#fef9c3;border-color:#facc15;color:#1f2937}
  .rse-no{width:22px;text-align:center;font-weight:700;padding-top:8px}.rse-isi{flex:1;min-width:0}.rse-nama{font-weight:600;margin-bottom:4px}
  .rse-src{display:flex;flex-wrap:wrap;gap:4px;align-items:center}.rse-chip{background:#e0f2fe;color:#075985;border-radius:999px;padding:2px 4px 2px 10px;font-size:11.5px;display:inline-flex;align-items:center;gap:2px}.rse-chip button{border:0;background:none;cursor:pointer;color:inherit;font-size:14px;line-height:1}
  .rse-kosong{font-size:11.5px;color:#a16207;font-weight:600}.rse-tambah{width:auto;max-width:100%;padding:3px 6px;font-size:11.5px}.rse-ket{display:block;color:var(--text-secondary);font-size:11px;margin-top:3px}
  .rse-aksi{display:flex;flex-direction:column;gap:2px}.rse-aksi button{border:1px solid var(--border,#ddd);background:var(--surface,#fff);color:inherit;border-radius:6px;cursor:pointer;font-size:11px;padding:2px 6px}
  .rse-kaki{display:flex;gap:8px;justify-content:flex-end;position:sticky;bottom:0;background:var(--surface,#fff);padding-top:8px}
  @media (max-width:600px){.rse-baris{flex-wrap:wrap}.rse-aksi{flex-direction:row;width:100%;justify-content:flex-end}}`;
  const s = document.createElement("style"); s.textContent = css; document.head.appendChild(s);
})();

// ============================================================
//  ARSIP SOAL & PENGUMPULAN SOAL UJIAN
//  • ujCetakSoal(bankId): naskah soal dari Ujian Online (berkop, siap cetak / simpan PDF) — untuk arsip.
//    Lembar kunci jawaban ikut dicetak bila guru memasukkan PIN.
//  • Pengumpulan Soal (per jadwal ujian, menu Jadwal Ujian): daftar guru × mapel × kelas yang wajib
//    mengumpulkan soal, dengan status:
//      💻 Ujian Online — OTOMATIS tercentang bila sudah ada bank soal UTS/UAS untuk mapel & kelas itu
//      📄 Berkas      — guru mengunggah Word/PDF (arsip)
//      📦 Fisik       — admin/kepala sekolah menandai soal kertas sudah diterima
//    + kirim daftar SUDAH / BELUM ke grup WA.
//  Data: kuliah_pengaturan "ujian:soal:<jadwalId>" (tanpa tabel baru).
// ============================================================
const UA = { bank: null, jenis: null, data: {}, jadwal: null };
const _uaEsc = (s) => (typeof escapeHtml === "function" ? escapeHtml(s) : String(s ?? ""));

// ── Naskah soal (arsip) ─────────────────────────────────────
async function ujCetakSoal(bankId, denganKunci) {
  let b = (typeof UJ !== "undefined" && UJ.bank || []).find((x) => x.id === bankId);
  if (!b) { const r = await supa.from("ujian_bank").select("id,mapel_id,tingkat,bab,judul,soal,skor_maksimal,dibuat_oleh,updated_at").eq("id", bankId).maybeSingle(); b = r.data; }
  if (!b) { toast("Bank soal tidak ditemukan", "err"); return; }
  let kunci = null;
  if (denganKunci === undefined) denganKunci = await konfirmasiTema("Sertakan lembar KUNCI JAWABAN di halaman terakhir? (perlu PIN)", { ikon: "🖨️", judul: "Cetak naskah soal", teksYa: "Ya, dengan kunci", teksTidak: "Soal saja" });
  if (denganKunci) {
    try { const pin = await _ujPin("PIN untuk mencetak kunci"); if (pin) kunci = await _ujRpc("ujian_kunci_ambil", { p_pin: pin, p_bank: bankId }); }
    catch (e) { toast((typeof _ujPesan === "function" ? _ujPesan(e) : e.message) + " — dicetak tanpa kunci", "err"); }
  }
  const p = STATE.pengaturan || {}, H = "ABCDEFGHIJ", e = _uaEsc;
  const logo = p.logo_kiri_url || p.logo_kanan_url || (typeof urlLogoSekolah === "function" ? urlLogoSekolah() : "");
  const mapel = (typeof _ujNamaMapelTampil === "function" ? _ujNamaMapelTampil(b) : (LOOKUP.mapel || []).find((m) => m.id === b.mapel_id)?.nama_mapel) || "-";
  const guru = (LOOKUP.guruAll || []).find((g) => g.id === b.dibuat_oleh)?.nama || "";
  const jenis = typeof _ujLabelJenis === "function" ? _ujLabelJenis(b) : "";
  const fmt = (t) => e(String(t || "")).replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>").replace(/\n/g, "<br>");
  const arab = (t) => /[؀-ۿ]/.test(t || "") ? ' dir="auto"' : "";
  const bagian = (b.soal || []).map((bg) => `<section class="bg"><h3>${e(bg.judul || bg.jenis)} <small>(${bg.soal?.length || 0} soal · ${bg.poin} poin/soal)</small></h3>
    ${bg.stimulus ? `<div class="stim"${arab(bg.stimulus)}>${fmt(bg.stimulus)}</div>` : ""}
    <ol class="soal">${(bg.soal || []).map((s) => `<li value="${s.no}"${arab(s.t)}>${s.stimulus ? `<div class="stim"${arab(s.stimulus)}>${fmt(s.stimulus)}</div>` : ""}<div>${fmt(s.t)}</div>${s.g ? `<img src="${e(s.g)}" alt="">` : ""}
      ${bg.jenis === "uraian" ? `<div class="garis"></div><div class="garis"></div><div class="garis"></div>`
        : s.bs ? `<table class="bs"><tr><th>Pernyataan</th><th>${e(s.bs[0])}</th><th>${e(s.bs[1])}</th></tr>${(s.o || []).map((o) => `<tr><td${arab(o)}>${fmt(o)}</td><td></td><td></td></tr>`).join("")}</table>`
        : `<ol class="opsi" type="A">${(s.o || []).map((o) => `<li${arab(o)}>${fmt(o)}</li>`).join("")}</ol>`}</li>`).join("")}</ol></section>`).join("");
  const lembarKunci = kunci ? `<section class="kunci"><h2>KUNCI JAWABAN — ${e(b.judul)}</h2>${(b.soal || []).map((bg) => {
      const kb = ((kunci.bagian) || []).find((x) => x.jenis === bg.jenis) || { soal: [] };
      return `<h3>${e(bg.judul || bg.jenis)}</h3><table><tr><th style="width:12mm">No</th><th>Jawaban</th></tr>${(bg.soal || []).map((s) => { const ks = kb.soal.find((x) => x.no === s.no) || {};
        const jw = bg.jenis === "uraian" ? fmt(ks.kunci || "-") : s.bs ? (s.o || []).map((o, i) => `${ks.k && ks.k[i] ? e(s.bs[0]) : e(s.bs[1])}`).join(", ") : [].concat(ks.k).map((i) => H[i]).join(", ");
        return `<tr><td style="text-align:center">${s.no}</td><td>${jw}</td></tr>`; }).join("")}</table>`; }).join("")}</section>` : "";
  const html = `<!doctype html><html lang="id"><head><meta charset="utf-8"><title>${e(b.judul)}</title><style>
    @page{size:A4;margin:14mm}*{box-sizing:border-box}body{font-family:"Segoe UI",Arial,sans-serif;color:#1F2328;font-size:11pt;margin:0}
    .kop{display:flex;gap:14px;align-items:center;border-bottom:3px double #1F5A3D;padding-bottom:8px}.kop img{width:17mm;height:17mm;object-fit:contain}
    .lem{color:#1F5A3D;font-weight:700;letter-spacing:2px;font-size:11pt}.jdl{color:#1B2A41;font-weight:800;font-size:14pt}
    .info{display:grid;grid-template-columns:auto 1fr auto 1fr;gap:3px 10px;margin:10px 0 6px;font-size:10.5pt}.info b{font-weight:600}
    .nama{border:.6pt solid #8C9792;padding:6px 8px;margin:6px 0 10px;font-size:10.5pt}
    h3{font-size:11.5pt;color:#1B2A41;border-left:4px solid #1F5A3D;padding-left:6px;margin:14px 0 6px}h3 small{color:#5B6470;font-weight:400}
    .stim{border:.6pt solid #8C9792;background:#EEF1EF;padding:6px 8px;margin:4px 0 8px;line-height:1.6}
    ol.soal>li{margin:0 0 10px;break-inside:avoid;line-height:1.55}ol.opsi{margin:4px 0 0 0;padding-left:22px}
    img{max-width:70mm;max-height:55mm;display:block;margin:4px 0}.garis{border-bottom:.6pt dotted #8C9792;height:9mm}
    table{border-collapse:collapse;width:100%;margin-top:4px}th,td{border:.6pt solid #8C9792;padding:4px 6px;font-size:10pt}th{background:#E3EAE6}
    table.bs td:nth-child(n+2){width:16mm}.kunci{break-before:page}.kunci h2{font-size:13pt;color:#1B2A41}
    footer{position:fixed;bottom:0;left:0;right:0;font-size:7.5pt;color:#5B6470;border-top:.4pt solid #8C9792;padding-top:3px;display:flex;justify-content:space-between}
    [dir=auto]{font-family:"Amiri","Traditional Arabic","Segoe UI",serif}
  </style></head><body>
    <div class="kop">${logo ? `<img src="${e(logo)}" alt="">` : ""}<div><div class="lem">${e((p.nama_lembaga_kop || "Rumah Tahfizh Al Umm Putra Barabai").toUpperCase())}</div><div class="jdl">${e(String(b.judul).toUpperCase())}</div></div></div>
    <div class="info"><span>Mata pelajaran</span><b>: ${e(mapel)}</b><span>Kelas</span><b>: ${e(b.tingkat || "-")}</b><span>Jenis</span><b>: ${e(jenis)}</b><span>Guru</span><b>: ${e(guru)}</b></div>
    <div class="nama">Nama: ........................................................ &nbsp; No. Absen: ........ &nbsp; Tanggal: ....................</div>
    ${bagian}${lembarKunci}
    <footer><span>${e(b.judul)} · ${e(mapel)} · Kelas ${e(b.tingkat || "-")}</span><span>Arsip soal · dicetak ${e(new Date().toLocaleDateString("id-ID"))}</span></footer>
    <script>window.onload=function(){setTimeout(function(){window.print()},500)}<\/script></body></html>`;
  const w = window.open("", "_blank");
  if (!w) { toast("Izinkan pop-up untuk mencetak / simpan PDF", "err"); return; }
  w.document.open(); w.document.write(html); w.document.close();
}

// ── Pengumpulan soal per jadwal ujian ───────────────────────
const _uaKunci = (mapelId, kelasId) => `${mapelId}|${kelasId}`;
const _uaBolehAtur = () => (typeof isAdmin === "function" && isAdmin()) || (typeof isKepsekOrTU === "function" && isKepsekOrTU());
async function _uaMuatBank() {
  const [bank, jenis] = await Promise.all([
    supa.from("ujian_bank").select("id,mapel_id,tingkat,bab,judul,updated_at,dibuat_oleh").then((r) => r.data || []).catch(() => []),
    _kvAmbil("ujian:jenis", {}).catch(() => ({})),
  ]);
  UA.bank = bank; UA.jenis = jenis;
  if (typeof UJ !== "undefined") UJ.jenisNilai = jenis;
}
// Daftar wajib: mapel × kelas yang ada di jadwal ujian (bila sudah disusun), selain itu semua dari jadwal pelajaran
function _uaDaftarWajib(j) {
  const dariSlot = new Set();
  Object.entries(j.slot || {}).forEach(([k, s]) => { const [t, , kelasId] = k.split("|"); if (j.hari.includes(t) && s?.m) dariSlot.add(_uaKunci(s.m, kelasId)); });
  const per = new Map();
  (JU.ajar || []).forEach((a) => {
    if (!j.kelas.includes(a.kelas_id)) return;
    const k = _uaKunci(a.mapel_id, a.kelas_id);
    if (dariSlot.size && !dariSlot.has(k)) return;
    const m = (LOOKUP.mapel || []).find((x) => x.id === a.mapel_id); if (!m || m.tanpa_guru) return;
    if (!per.has(k)) per.set(k, { mapelId: a.mapel_id, kelasId: a.kelas_id, guru: new Set() });
    per.get(k).guru.add(a.guru_id);
  });
  dariSlot.forEach((k) => { if (!per.has(k)) { const [m, kl] = k.split("|"); per.set(k, { mapelId: m, kelasId: kl, guru: new Set() }); } });
  return [...per.values()];
}
// Bank soal Ujian Online yang cocok (mapel + tingkat kelas + jenis UTS/UAS sesuai jadwal)
function _uaBankCocok(j, mapelId, kelasId) {
  const angka = String(_juAngkaKelas(kelasId)).replace(/\D/g, "");
  const jenisPerlu = j.jenis === "uts" ? ["uts"] : j.jenis === "uas" ? ["uas"] : ["uts", "uas"];
  const batas = new Date(_juTgl(j.mulai).getTime() - 150 * 86400000).toISOString();
  return (UA.bank || []).filter((b) => b.mapel_id === mapelId && String(b.tingkat || "").replace(/\D/g, "") === angka && (b.updated_at || "") >= batas)
    .filter((b) => { const x = UA.jenis?.[b.id]; const jn = x?.jenis || (typeof _ujJenisNilai === "function" ? _ujJenisNilai(b).jenis : "uh"); return jenisPerlu.includes(jn); });
}
function _uaStatus(j, item) {
  const d = UA.data[_uaKunci(item.mapelId, item.kelasId)] || {};
  const bank = _uaBankCocok(j, item.mapelId, item.kelasId);
  const st = [];
  if (bank.length) st.push({ k: "online", label: "💻 Ujian Online", bank });
  if (d.file_url) st.push({ k: "file", label: "📄 Berkas", url: d.file_url, nama: d.nama_file });
  if (d.fisik) st.push({ k: "fisik", label: "📦 Fisik", oleh: d.fisik_oleh });
  return st;
}
async function juPengumpulanSoal(id) {
  const j = JU.daftar.find((x) => x.id === id); if (!j) return;
  UA.jadwal = j; UA.segarkan = null;
  const wadah = qs("ju-wadah");
  wadah.innerHTML = loadingHTML();
  try {
    await Promise.all([_uaMuatBank(), _kvAmbil("ujian:soal:" + id, {}).then((d) => { UA.data = d || {}; })]);
    _uaGambar();
  } catch (e) { console.error(e); wadah.innerHTML = `<div class="card empty-state">Gagal memuat: ${_uaEsc(e.message || e)}</div>`; }
}
function _uaGambar() {
  const j = UA.jadwal, atur = _uaBolehAtur(), saya = STATE.guruId, e = _uaEsc;
  const daftar = _uaDaftarWajib(j);
  const baris = daftar.map((it) => ({ ...it, st: _uaStatus(j, it) }));
  const sudah = baris.filter((x) => x.st.length).length;
  const perGuru = new Map();
  baris.forEach((x) => { const gs = x.guru.size ? [...x.guru] : ["-"]; gs.forEach((g) => { if (!perGuru.has(g)) perGuru.set(g, []); perGuru.get(g).push(x); }); });
  const urut = [...perGuru.entries()].sort((a, b) => (a[0] === saya ? -1 : b[0] === saya ? 1 : 0) || _juNamaGuru(a[0]).localeCompare(_juNamaGuru(b[0]), "id"));
  const tampil = atur ? urut : urut.filter(([g]) => g === saya);
  qs("ju-wadah").innerHTML = `
    <div class="ju-editor-h"><button class="btn btn-ghost" onclick="_juGambarDaftar()">← Daftar</button><div class="ju-eh-judul"><b class="ju-judul">📥 Pengumpulan Soal</b><small class="ju-ket">${e(j.judul)}</small></div></div>
    <div class="card ua-ringkas"><div class="ua-angka"><b>${sudah}</b>/<span>${baris.length}</span><small>mapel-kelas sudah</small></div><div class="ju-bar" style="flex:1"><i style="width:${baris.length ? Math.round((sudah / baris.length) * 100) : 0}%"></i></div>
      ${atur ? `<button class="btn btn-wa btn-sm" onclick="uaKirimWa()">💬 WA sudah & belum</button>` : ""}</div>
    <div class="card ua-ket">💻 <b>Ujian Online</b> otomatis tercentang bila guru sudah membuat soal ${j.jenis === "uas" ? "UAS" : j.jenis === "uts" ? "UTS" : "UTS/UAS"} di menu Ujian Online untuk mapel & kelas itu. 📄 Guru juga bisa mengunggah berkas Word/PDF. 📦 Admin/kepala sekolah menandai soal kertas yang sudah diterima.</div>
    ${tampil.map(([g, xs]) => `<div class="card ua-guru"><div class="ua-guru-h"><b>${e(g === "-" ? "Belum ada pengampu" : _juGuru(g)?.nama || "?")}</b><span class="ua-ke">${xs.filter((x) => x.st.length).length}/${xs.length}</span></div>
      ${xs.sort((a, b) => _juNamaMapel(a.mapelId).localeCompare(_juNamaMapel(b.mapelId), "id") || String(_juAngkaKelas(a.kelasId)).localeCompare(String(_juAngkaKelas(b.kelasId)), "id", { numeric: true })).map((x) => {
        const kunci = _uaKunci(x.mapelId, x.kelasId), boleh = atur || x.guru.has(saya);
        return `<div class="ua-baris ${x.st.length ? "ok" : ""}" style="--kw:${_juWarnaKelas(x.kelasId)}">
          <div class="ua-mapel"><b>${e(_juNamaMapel(x.mapelId))}</b><small>Kelas ${e(_juAngkaKelas(x.kelasId))}</small></div>
          <div class="ua-st">${x.st.map((s) => s.k === "online" ? `<button class="ua-chip on" onclick="ujCetakSoal('${s.bank[0].id}')" title="${e(s.bank.map((b) => b.judul).join(" · "))}">${s.label}</button>`
            : s.k === "file" ? `<a class="ua-chip on" href="${e(s.url)}" target="_blank" rel="noopener">${s.label}</a>` : `<span class="ua-chip on" title="${e(s.oleh || "")}">${s.label}</span>`).join("") || `<span class="ua-chip belum">⏳ Belum</span>`}</div>
          <div class="ua-aksi">${boleh ? `<label class="btn btn-ghost btn-sm" title="Unggah berkas soal (Word/PDF)">⬆️<input type="file" hidden accept=".doc,.docx,.pdf,image/*" onchange="uaUnggah('${kunci}',this)"></label>` : ""}
            ${atur ? `<button class="btn btn-ghost btn-sm" onclick="uaToggleFisik('${kunci}')" title="Tandai soal kertas sudah diterima">${UA.data[kunci]?.fisik ? "↩️" : "📦"}</button>` : ""}</div>
        </div>`; }).join("")}</div>`).join("") || `<div class="card empty-state">${atur ? "Belum ada mapel di jadwal ini." : "Antum tidak punya mapel yang wajib mengumpulkan soal di ujian ini."}</div>`}`;
}
async function _uaSimpan() { await _kvSimpan("ujian:soal:" + UA.jadwal.id, UA.data); }
async function uaUnggah(kunci, input) {
  const f = input.files && input.files[0]; input.value = ""; if (!f) return;
  if (f.size > 10 * 1024 * 1024) { toast("Berkas maksimal 10 MB", "err"); return; }
  try {
    setGlobalLoading(true, "Mengunggah soal…");
    const url = await apiUploadFoto(f, "soal-ujian");
    UA.data = await _kvAmbil("ujian:soal:" + UA.jadwal.id, {}); // ambil terbaru (guru lain mungkin baru mengunggah)
    UA.data[kunci] = { ...(UA.data[kunci] || {}), file_url: url, nama_file: f.name, oleh: STATE.guruNama || "", t: new Date().toISOString() };
    await _uaSimpan(); toast("📄 Soal terunggah ✓ — admin bisa langsung melihatnya", "ok"); UA.terakhir = { kunci, url, nama: f.name }; UA.segarkan ? UA.segarkan() : _uaGambar();
  } catch (e) { toast("Gagal mengunggah: " + (typeof _diagnosaErrorUploadFoto === "function" ? _diagnosaErrorUploadFoto(e.message) : e.message), "err"); }
  finally { setGlobalLoading(false); }
}
async function uaToggleFisik(kunci) {
  try {
    UA.data = await _kvAmbil("ujian:soal:" + UA.jadwal.id, {});
    const d = (UA.data[kunci] = UA.data[kunci] || {});
    d.fisik = !d.fisik; d.fisik_oleh = d.fisik ? `${STATE.guruNama || "Admin"} · ${new Date().toLocaleDateString("id-ID")}` : "";
    await _uaSimpan(); UA.segarkan ? UA.segarkan() : _uaGambar();
  } catch (e) { toast("Gagal: " + (e.message || e), "err"); }
}
function uaKirimWa() {
  const j = UA.jadwal;
  const baris = _uaDaftarWajib(j).map((it) => ({ ...it, st: _uaStatus(j, it) }));
  const tag = (g) => { const n = typeof normalisasiNomorWa === "function" ? normalisasiNomorWa(_juGuru(g)?.no_wa) : null; return n?.valid ? ` @${n.nomor}` : ""; };
  const kelompok = (filter) => { const per = new Map(); baris.filter(filter).forEach((x) => [...(x.guru.size ? x.guru : ["-"])].forEach((g) => { if (!per.has(g)) per.set(g, []); per.get(g).push(x); }));
    return [...per.entries()].sort((a, b) => _juNamaGuru(a[0]).localeCompare(_juNamaGuru(b[0]), "id")); };
  const belum = kelompok((x) => !x.st.length), sudah = kelompok((x) => x.st.length);
  const daftarBelum = belum.map(([g, xs], i) => `${i + 1}. *${g === "-" ? "Belum ada pengampu" : _juNamaGuru(g)}*${g === "-" ? "" : tag(g)}\n${xs.map((x) => `     ▪️ ${_juNamaMapel(x.mapelId)} — Kelas ${_juAngkaKelas(x.kelasId)}`).join("\n")}`).join("\n\n");
  const daftarSudah = sudah.map(([g, xs]) => `✅ ${g === "-" ? "-" : _juNamaGuru(g)}: ${xs.map((x) => `${_juNamaMapel(x.mapelId)} ${_juAngkaKelas(x.kelasId)}`).join(", ")}`).join("\n");
  const total = baris.length, n = baris.filter((x) => x.st.length).length;
  const teks = `✳️ *PENGUMPULAN SOAL ${String(j.judul).toUpperCase()}*\n\nAssalamu'alaikum warahmatullahi wabarakatuh.\nRekap pengumpulan soal: *${n}/${total}* mapel-kelas sudah terkumpul.\n\n⏰ *Belum mengumpulkan:*\n\n${daftarBelum || "Alhamdulillah, semua sudah ✅"}\n\n${daftarSudah ? `*Sudah:*\n${daftarSudah}\n\n` : ""}Soal bisa dibuat langsung di menu *Ujian Online* (otomatis tercatat), diunggah (Word/PDF) di menu *Jadwal Ujian → Pengumpulan Soal*, atau diserahkan kertasnya ke admin.\n${location.origin}${location.pathname}?buka=jadwalujian\n\nJazakumullahu khairan.`;
  window.open("https://wa.me/?text=" + encodeURIComponent(teks), "_blank", "noopener");
}

// ── Kumpulkan soal untuk satu mapel-kelas (dari halaman Jadwal Ujian: tombol 📤 atau ketuk mapel di jadwal) ──
async function uaKumpulkan(jadwalId, mapelId, kelasId) {
  const j = JU.daftar.find((x) => x.id === jadwalId); if (!j) return;
  const e = _uaEsc, atur = _uaBolehAtur(), kunci = _uaKunci(mapelId, kelasId);
  const pengampu = (JU.ajar || []).filter((a) => a.mapel_id === mapelId && a.kelas_id === kelasId).map((a) => a.guru_id);
  if (!atur && !pengampu.includes(STATE.guruId)) { toast(`Soal ${_juNamaMapel(mapelId)} dikumpulkan oleh pengampunya: ${pengampu.map(_juNamaGuru).join(", ") || "-"}`, "info"); return; }
  if (!UA.bank || !UA.jadwal || UA.jadwal.id !== j.id) {
    setGlobalLoading(true, "Memuat…");
    try { await Promise.all([_uaMuatBank(), _kvAmbil("ujian:soal:" + j.id, {}).then((d) => { UA.data = d || {}; })]); UA.jadwal = j; }
    finally { setGlobalLoading(false); }
  }
  UA.jadwal = j;
  const st = _uaStatus(j, { mapelId, kelasId }), d = UA.data[kunci] || {};
  const kapan = Object.entries(j.slot || {}).filter(([k, s]) => s?.m === mapelId && k.split("|")[2] === kelasId && j.hari.includes(k.split("|")[0]))
    .map(([k]) => { const [t, sid] = k.split("|"), i = j.sesi.findIndex((x) => x.id === sid); return `${_juHariPendek(t)} · Sesi ${i + 1} (${j.sesi[i]?.mulai}–${j.sesi[i]?.selesai})`; });
  const jenisSoal = j.jenis === "uts" ? "UTS" : "UAS";
  openModal(`<h3>📤 Kumpulkan soal</h3>
    <div class="ua-m-info" style="--kw:${_juWarnaKelas(kelasId)}"><span class="ju-kls">${e(_juAngkaKelas(kelasId))}</span><div><b>${e(_juNamaMapel(mapelId))} · Kelas ${e(_juAngkaKelas(kelasId))}</b><small>${e(j.judul)}${kapan.length ? "<br>📅 " + kapan.map(e).join("<br>📅 ") : ""}</small></div></div>
    <div class="ua-m-status">${st.length ? st.map((s) => s.k === "online" ? `<button class="ua-chip on" onclick="ujCetakSoal('${s.bank[0].id}')" title="Lihat / cetak naskah">${s.label} · ${e(s.bank[0].judul)}</button>`
      : s.k === "file" ? `<a class="ua-chip on" href="${e(s.url)}" target="_blank" rel="noopener">${s.label} · ${e(s.nama || "berkas")}</a>` : `<span class="ua-chip on">${s.label} ${s.oleh ? "· " + e(s.oleh) : ""}</span>`).join("") : `<span class="ua-chip belum">⏳ Belum ada soal yang terkumpul</span>`}</div>
    <div class="ua-m-pilih">
      <button onclick="uaBuatOnline('${mapelId}','${kelasId}','${j.jenis}')"><span>💻</span><b>Buat di Ujian Online</b><small>Ketik / tempel / unggah Word·PDF. Otomatis tercatat terkumpul & bisa dikerjakan santri di HP.</small></button>
      <label><span>📄</span><b>${d.file_url ? "Ganti berkas" : "Unggah berkas soal"}</b><small>Word / PDF / foto (maks 10 MB) — untuk dicetak admin.</small><input type="file" hidden accept=".doc,.docx,.pdf,image/*" onchange="uaUnggah('${kunci}',this)"></label>
      <button onclick="uaKabariAdmin('${mapelId}','${kelasId}')"><span>💬</span><b>Kabari admin lewat WA</b><small>Kirim pemberitahuan${d.file_url ? " beserta tautan berkas" : ""} ke admin / grup.</small></button>
      ${atur ? `<button onclick="uaToggleFisik('${kunci}')"><span>📦</span><b>${d.fisik ? "Batalkan tanda kertas" : "Tandai soal kertas diterima"}</b><small>Untuk soal yang diserahkan dalam bentuk kertas.</small></button>` : ""}
    </div>
    <div class="uj-sub" style="margin-top:8px">Soal ${jenisSoal} yang dibuat di <b>Ujian Online</b> untuk mapel & kelas ini otomatis dianggap sudah terkumpul.</div>`);
}
async function uaBuatOnline(mapelId, kelasId, jenisJadwal) {
  closeModal();
  const jenisNilai = jenisJadwal === "uts" ? "uts" : "uas";
  const tingkat = String(_juAngkaKelas(kelasId)).replace(/\D/g, "") || _juAngkaKelas(kelasId);
  showPage("ujian", "page-ujian", "menuUjian");
  for (let i = 0; i < 30 && !qs("uj-bank"); i++) await new Promise((r) => setTimeout(r, 120));
  ujEditorBuka(null, { mapel_id: mapelId, tingkat, jenisNilai, judul: `${jenisNilai === "uts" ? "UTS" : "UAS"} ${_juNamaMapel(mapelId)} Kelas ${tingkat}` });
}
function uaKabariAdmin(mapelId, kelasId) {
  const j = UA.jadwal, d = UA.data[_uaKunci(mapelId, kelasId)] || {}, st = _uaStatus(j, { mapelId, kelasId });
  const cara = st.some((s) => s.k === "online") ? "sudah saya buat di *Ujian Online* (tercatat otomatis di aplikasi)" : d.file_url ? `sudah saya unggah: ${d.file_url}` : "akan saya serahkan dalam bentuk kertas";
  const teks = `Assalamu'alaikum, Ustadz/Ustadzah.\nSoal *${j.jenis === "uts" ? "UTS" : "UAS"} ${_juNamaMapel(mapelId)} Kelas ${_juAngkaKelas(kelasId)}* (${j.judul}) ${cara}.\n\nJazakumullahu khairan.\n— ${STATE.guruNama || ""}`;
  window.open("https://wa.me/?text=" + encodeURIComponent(teks), "_blank", "noopener");
}

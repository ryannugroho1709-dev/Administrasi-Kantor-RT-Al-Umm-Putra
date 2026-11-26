// ============================================================
//  🗓️ SUSUN JADWAL SEMESTER (menu Jadwal Pelajaran → tombol "Susun Jadwal Semester")
//  Empat langkah: ⏰ Jam Belajar → 👥 Penugasan Mengajar → 🗓️ Susun → ✅ Periksa & Terapkan.
//  • Jam belajar disimpan PER PAKET (Paket A 30 mnt, Paket B 40/45 mnt, Paket C 45 mnt, dst.).
//  • Penugasan = kelas × mapel → guru + JP per pekan. Ganti guru SEKALI di penugasan →
//    semua jam mapel itu di kelas itu ikut berganti (kecuali sel yang sengaja diberi guru lain).
//  • Draf tersimpan otomatis di kv "jadwal:susun" (per ruang, DIGABUNG — tidak menimpa).
//  • Saat diterapkan, jadwal lama TIDAK dihapus: hanya dinonaktifkan & dicadangkan sebagai
//    template, sehingga riwayat absensi/jurnal tetap aman dan jadwal lama bisa diaktifkan lagi.
// ============================================================
const JS_KUNCI = "jadwal:susun";
const JS_HARI = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const JS_MINGGU = { setiap_minggu: "Setiap Pekan", ganjil: "Pekan Ganjil", genap: "Pekan Genap" };
const JSU = { d: null, tab: "tugas", kelas: "", pilih: null, mode: "kelas", guruLihat: "", lain: [], kls: [], guru: new Map(), antre: null, t: 0, status: "", tmpl: [], ubah: null };
const _jsuE = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const _jsuBoleh = () => (typeof isAdmin === "function" && isAdmin()) || (typeof isKepsek === "function" && isKepsek()) || (typeof isAdminKedua === "function" && isAdminKedua());
const _jsuMnt = (t) => { const [h, m] = String(t || "0:0").split(":").map(Number); return h * 60 + (m || 0); };
const _jsuJam = (n) => `${String(Math.floor(n / 60)).padStart(2, "0")}:${String(n % 60).padStart(2, "0")}`;
const _jsuId = () => "s" + Math.random().toString(36).slice(2, 8);
const _jsuNoKelas = (n) => { const m = String(n || "").match(/\d+/); return m ? Number(m[0]) : 99; };
const _jsuMapel = (id) => ((LOOKUP.mapel || []).find((m) => m.id === id) || {}).nama_mapel || "Mapel ?";
const _jsuNamaGuru = (id) => (id ? JSU.guru.get(id) || "Guru ?" : "Belum Ada Guru");
const _jsuNamaKelas = (id) => ((JSU.kls.find((k) => k.id === id) || {}).nama_kelas) || "Kelas ?";
const _jsuProg = (k) => ((JSU.kls.find((x) => x.id === k) || {}).program) || "Umum";
const _jsuPola = (k) => ((JSU.d && JSU.d.pola) || {})[_jsuProg(k)] || {};
const _jsuIsi = (k, sid) => ((JSU.d.isi || {})[k + "|" + sid] || []).filter(Boolean);
const _jsuTugas = (k) => Object.entries(JSU.d.tugas || {}).filter(([kk, v]) => v && kk.startsWith(k + "|")).map(([kk, v]) => ({ k, m: kk.split("|")[1], g: v.g || null, jp: Number(v.jp) || 0 }));
const _jsuGuru = (k, e) => e.g || ((JSU.d.tugas || {})[k + "|" + e.m] || {}).g || null;
const _jsuBobot = (e) => (e.tm === "ganjil" || e.tm === "genap" ? 0.5 : 1);
const _jsuAngka = (n) => (Math.round(n * 2) / 2).toString().replace(".", ",");
const _jsuWarna = (id) => { let h = 0; for (const c of String(id)) h = (h * 31 + c.charCodeAt(0)) % 360; return `hsl(${h} 62% 38%)`; };
const _jsuKelasUrut = () => JSU.kls.slice().sort((a, b) => _jsuNoKelas(a.nama_kelas) - _jsuNoKelas(b.nama_kelas) || a.nama_kelas.localeCompare(b.nama_kelas, "id"));

// ── Penyimpanan draf: digabung ke server (tidak menimpa), dikirim berkelompok ──
function _jsuGabungObj(a, b) {
  const n = { ...(a || {}) };
  for (const [k, v] of Object.entries(b)) n[k] = v && typeof v === "object" && !Array.isArray(v) && n[k] && typeof n[k] === "object" && !Array.isArray(n[k]) ? { ...n[k], ...v } : v;
  return n;
}
function _jsuSimpan(potongan, segera) {
  if (!_jsuBoleh()) { toast("Khusus Admin / Kepala", "err"); return; }
  potongan = { ...potongan, diubah: new Date().toISOString(), oleh: STATE.guruNama || "" };
  JSU.d = _jsuGabungObj(JSU.d, potongan);
  JSU.antre = _jsuGabungObj(JSU.antre, potongan);
  _jsuStatus("Menyimpan…");
  clearTimeout(JSU.t);
  JSU.t = setTimeout(_jsuKirim, segera ? 0 : 700);
}
async function _jsuKirim() {
  const p = JSU.antre; if (!p) return; JSU.antre = null;
  try { await _kvGabung(JS_KUNCI, p); _jsuStatus("Tersimpan ✓"); }
  catch (e) { JSU.antre = _jsuGabungObj(p, JSU.antre || {}); _jsuStatus("Gagal Menyimpan — Coba Lagi"); toast("Draf gagal tersimpan: " + (e.message || e), "err"); }
}
function _jsuStatus(s) { JSU.status = s; const el = document.getElementById("jsu-status"); if (el) el.textContent = s; }

// ── Buka / tutup ──
async function jsuBuka() {
  const wadah = document.getElementById("jadwal-susun"); if (!wadah) return;
  const page = document.getElementById("page-jadwal");
  [...page.children].forEach((el) => { if (el !== wadah) { el.dataset.jsuSembunyi = el.style.display || "-"; el.style.display = "none"; } });
  wadah.style.display = "";
  wadah.innerHTML = typeof loadingHTML === "function" ? loadingHTML("Memuat penyusun jadwal…") : "Memuat…";
  try {
    await ensureLookups();
    const [kls, draf, lain, tmpl] = await Promise.all([
      supa.from("kelas").select("id,nama_kelas,program").order("nama_kelas").then(unwrap),
      _kvAmbil(JS_KUNCI, null),
      supaSemua.from("jadwal_pelajaran").select("guru_id,hari,jam_mulai,jam_selesai,tipe_minggu,pekan_bulan,ruang_id,kelas(nama_kelas)").eq("aktif", true).neq("ruang_id", STATE.ruang).not("guru_id", "is", null).then((r) => r.data || []),
      supa.from("jadwal_template").select("*").order("created_at", { ascending: false }).then((r) => r.data || []),
    ]);
    JSU.kls = kls; JSU.d = draf && draf.pola ? draf : null; JSU.lain = lain; JSU.tmpl = tmpl;
    (STATE.daftarGuru || []).forEach((g) => JSU.guru.set(g.id, g.nama));
    await _jsuMuatNamaGuru();
    if (!JSU.kelas || !kls.some((k) => k.id === JSU.kelas)) JSU.kelas = (_jsuKelasUrut()[0] || {}).id || "";
    jsuGambar();
  } catch (e) { wadah.innerHTML = `<div class="bk2-kosong">Gagal memuat: ${_jsuE(e.message || e)}</div>`; }
}
async function _jsuMuatNamaGuru() {
  const ids = new Set(); Object.values((JSU.d && JSU.d.tugas) || {}).forEach((t) => t && t.g && ids.add(t.g));
  Object.values((JSU.d && JSU.d.isi) || {}).forEach((l) => (l || []).forEach((e) => e && e.g && ids.add(e.g)));
  JSU.lain.forEach((r) => ids.add(r.guru_id));
  const belum = [...ids].filter((id) => !JSU.guru.has(id)); if (!belum.length) return;
  try { const r = await supaSemua.from("guru").select("id,nama").in("id", belum); (r.data || []).forEach((g) => JSU.guru.set(g.id, g.nama)); } catch (e) {}
}
function jsuTutup() {
  const wadah = document.getElementById("jadwal-susun"); if (!wadah) return;
  wadah.style.display = "none"; wadah.innerHTML = "";
  [...document.getElementById("page-jadwal").children].forEach((el) => { if (el.dataset.jsuSembunyi != null) { el.style.display = el.dataset.jsuSembunyi === "-" ? "" : el.dataset.jsuSembunyi; delete el.dataset.jsuSembunyi; } });
  if (typeof renderJadwalPage === "function") renderJadwalPage();
}

// ── Mulai draf dari jadwal yang sedang berlaku ──
async function jsuMulai(salinIsi) {
  if (!_jsuBoleh()) return toast("Khusus Admin / Kepala", "err");
  if (JSU.d && !(await konfirmasiTema("Draf yang sedang disusun akan diganti dengan salinan baru dari jadwal yang berlaku sekarang. Lanjutkan?", { judul: "Mulai Ulang Draf", teksYa: "Mulai Ulang", bahaya: true }))) return;
  let rows;
  try { rows = await supa.from("jadwal_pelajaran").select("hari,jam_mulai,jam_selesai,kelas_id,mapel_id,guru_id,tipe_minggu,pekan_bulan").eq("aktif", true).eq("ruang_id", STATE.ruang).then(unwrap); }
  catch (e) { return toast("Gagal membaca jadwal: " + (e.message || e), "err"); }
  const prog = (k) => _jsuProg(k);
  // 1. Lama satu JP tiap paket = durasi yang paling sering muncul
  const dur = {}, batas = {}, batasHari = {};
  rows.forEach((r) => {
    const p = prog(r.kelas_id), a = _jsuMnt(r.jam_mulai), b = _jsuMnt(r.jam_selesai);
    (dur[p] = dur[p] || {})[b - a] = (dur[p][b - a] || 0) + 1;
    (batas[p] = batas[p] || new Set()).add(a).add(b);
    const kh = p + "|" + r.hari; (batasHari[kh] = batasHari[kh] || new Set()).add(a).add(b);
  });
  const lama = Object.fromEntries(Object.entries(dur).map(([p, d]) => [p, Number(Object.entries(d).sort((x, y) => y[1] - x[1])[0][0])]));
  // 2. Pecah blok panjang (mis. 10:30–12:00) menjadi potongan satu JP
  const pecah = (r) => {
    const p = prog(r.kelas_id), a = _jsuMnt(r.jam_mulai), b = _jsuMnt(r.jam_selesai), L = lama[p] || 45;
    if (b - a <= L * 1.4) return [[a, b]];
    let titik = [...(batasHari[p + "|" + r.hari] || [])].filter((t) => t > a && t < b);
    if (!titik.length) titik = [...(batas[p] || [])].filter((t) => t > a && t < b);
    if (!titik.length) { const n = Math.max(1, Math.round((b - a) / L)); titik = Array.from({ length: n - 1 }, (_, i) => a + Math.round(((b - a) * (i + 1)) / n)); }
    const t = [a, ...titik.sort((x, y) => x - y), b]; return t.slice(1).map((v, i) => [t[i], v]);
  };
  const pola = {}, potong = rows.map((r) => ({ r, p: pecah(r) }));
  potong.forEach(({ r, p }) => {
    const pg = (pola[prog(r.kelas_id)] = pola[prog(r.kelas_id)] || {}), hr = (pg[r.hari] = pg[r.hari] || []);
    p.forEach(([a, b]) => { if (!hr.some((s) => s.m === _jsuJam(a) && s.s === _jsuJam(b))) hr.push({ id: _jsuId(), m: _jsuJam(a), s: _jsuJam(b) }); });
  });
  Object.values(pola).forEach((pg) => Object.values(pg).forEach((hr) => hr.sort((x, y) => (x.m < y.m ? -1 : x.m > y.m ? 1 : x.s < y.s ? -1 : 1))));
  // Paket yang belum punya jadwal: salin pola paket lain supaya tidak kosong
  JSU.kls.forEach((k) => { const p = k.program || "Umum"; if (!pola[p]) pola[p] = JSON.parse(JSON.stringify(Object.values(pola)[0] || {})); });
  // 3. Penugasan: JP = jumlah potongan; guru = yang paling sering mengajar mapel itu di kelas itu
  const hit = {};
  potong.forEach(({ r, p }) => { if (!r.mapel_id) return; const kk = r.kelas_id + "|" + r.mapel_id, h = (hit[kk] = hit[kk] || { jp: 0, g: {} }); h.jp += p.length * _jsuBobot({ tm: r.tipe_minggu }); if (r.guru_id) h.g[r.guru_id] = (h.g[r.guru_id] || 0) + p.length; });
  const tugas = Object.fromEntries(Object.entries(hit).map(([kk, h]) => [kk, { g: (Object.entries(h.g).sort((a, b) => b[1] - a[1])[0] || [null])[0], jp: Math.max(1, Math.round(h.jp * 2) / 2) }]));
  // 4. Isi sel (bila diminta)
  const isi = {};
  if (salinIsi) potong.forEach(({ r, p }) => {
    if (!r.mapel_id) return;
    const hr = ((pola[prog(r.kelas_id)] || {})[r.hari]) || [], gt = (tugas[r.kelas_id + "|" + r.mapel_id] || {}).g;
    p.forEach(([a, b]) => {
      const s = hr.find((x) => x.m === _jsuJam(a) && x.s === _jsuJam(b)); if (!s) return;
      const e = { m: r.mapel_id }; if (r.guru_id && r.guru_id !== gt) e.g = r.guru_id;
      if (r.tipe_minggu && r.tipe_minggu !== "setiap_minggu") e.tm = r.tipe_minggu; if (r.pekan_bulan) e.pb = String(r.pekan_bulan);
      const key = r.kelas_id + "|" + s.id; (isi[key] = isi[key] || []).push(e);
    });
  });
  const ta = typeof hitungTahunAjaranOtomatis === "function" ? hitungTahunAjaranOtomatis() : "", semNow = typeof hitungSemesterOtomatis === "function" ? hitungSemesterOtomatis() : "Ganjil";
  const sem = semNow === "Ganjil" ? "Genap" : "Ganjil";
  const baru = { nama: `Jadwal Semester ${sem} ${ta}`, ta, sem, pola, tugas, isi, dibuat: new Date().toISOString(), dariJadwal: rows.length };
  // Kirim penuh sekali: kunci lama yang tidak ada di draf baru dikosongkan (null) agar tidak tertinggal
  const lamaD = JSU.d || {};
  const kosong = (o, n) => Object.fromEntries(Object.keys(o || {}).filter((k) => !(k in n)).map((k) => [k, null]));
  JSU.d = null;
  _jsuSimpan({ ...baru, tugas: { ...kosong(lamaD.tugas, tugas), ...tugas }, isi: { ...kosong(lamaD.isi, isi), ...isi }, pola: { ...kosong(lamaD.pola, pola), ...pola }, templateId: null, diterapkan: null }, true);
  JSU.tab = salinIsi ? "tugas" : "jam";
  await _jsuMuatNamaGuru();
  toast(`Draf dibuat dari ${rows.length} baris jadwal sekarang`, "ok");
  jsuGambar();
}

// ── Bentrok guru: di draf sendiri & dengan jadwal aktif jenjang lain ──
function _jsuPekanBentrok(a, b) {
  if ((a.tm === "ganjil" && b.tm === "genap") || (a.tm === "genap" && b.tm === "ganjil")) return false;
  if (a.pb && b.pb) { const x = String(a.pb).split(","); return String(b.pb).split(",").some((p) => x.includes(p)); }
  return true;
}
function _jsuIndeks() {
  const idx = {};
  JSU.kls.forEach((k) => { const pl = _jsuPola(k.id); JS_HARI.forEach((h) => (pl[h] || []).forEach((s) => _jsuIsi(k.id, s.id).forEach((e, i) => {
    const g = _jsuGuru(k.id, e); if (!g) return; (idx[g] = idx[g] || []).push({ hari: h, m: s.m, s: s.s, k: k.id, sid: s.id, i, tm: e.tm, pb: e.pb, mp: e.m });
  }))); });
  JSU.lain.forEach((r) => (idx[r.guru_id] = idx[r.guru_id] || []).push({ hari: r.hari, m: r.jam_mulai.slice(0, 5), s: r.jam_selesai.slice(0, 5), luar: r.ruang_id, kn: r.kelas?.nama_kelas, tm: r.tipe_minggu, pb: r.pekan_bulan }));
  return idx;
}
function _jsuBentrok(idx = _jsuIndeks()) {
  const hasil = {}, gabung = {}; let n = 0;
  // Guru yang sama, mapel sama, jam persis sama di dua kelas = KELAS GABUNGAN (bukan bentrok)
  const sekelas = (a, b) => !b.luar && b.mp === a.mp && b.m === a.m && b.s === a.s;
  Object.values(idx).forEach((l) => l.forEach((a) => { if (a.luar) return;
    const tumpuk = l.filter((b) => b !== a && b.hari === a.hari && b.m < a.s && b.s > a.m && !(b.k === a.k && b.sid === a.sid) && _jsuPekanBentrok(a, b));
    const gb = tumpuk.filter((b) => sekelas(a, b)), lawan = tumpuk.filter((b) => !sekelas(a, b));
    if (gb.length) gabung[a.k + "|" + a.sid + "|" + a.i] = gb.map((b) => _jsuNamaKelas(b.k));
    if (lawan.length) { hasil[a.k + "|" + a.sid + "|" + a.i] = lawan.map((b) => b.luar ? `${({ A: "Paket A", Pa: "Putra", Pi: "Putri" })[b.luar] || b.luar} ${b.kn || ""} ${b.m}–${b.s}` : `${_jsuNamaKelas(b.k)} ${b.m}–${b.s}`); n++; }
  }));
  return { peta: hasil, n, gabung };
}
function _jsuGuruBebas(idx, g, hari, s, e, abaikan) {
  if (!g) return true;
  return !(idx[g] || []).some((b) => b !== abaikan && b.hari === hari && b.m < s.s && b.s > s.m && _jsuPekanBentrok(e || {}, b));
}
function _jsuTerpasang(k, m) {
  let n = 0; const pl = _jsuPola(k); JS_HARI.forEach((h) => (pl[h] || []).forEach((s) => _jsuIsi(k, s.id).forEach((e) => { if (e.m === m) n += _jsuBobot(e); }))); return n;
}

// ── Tampilan utama ──
function jsuGambar() {
  const wadah = document.getElementById("jadwal-susun"); if (!wadah) return;
  const warna = (typeof rgRuang === "function" && rgRuang().warna) || "#1546a8";
  const boleh = _jsuBoleh();
  if (!JSU.d) {
    wadah.innerHTML = `<div class="bk2 jsu2" style="--bk:${warna}">${_jsuHero(null)}
      <div class="jsu-mulai"><div><h3>Mulai Menyusun Jadwal Semester Baru</h3>
        <p>Jadwal yang berlaku sekarang <b>tidak berubah</b> selama Anda menyusun. Jadwal baru baru dipakai setelah Anda menekan <b>Aktifkan</b> di langkah terakhir, dan jadwal lama tetap tersimpan sehingga bisa diaktifkan lagi.</p>
        <ol><li><b>⏰ Jam Belajar</b>: atur jam ke-1, ke-2, dan seterusnya untuk tiap paket.</li><li><b>👥 Penugasan</b>: tentukan guru dan jumlah JP per pekan untuk setiap mapel di tiap kelas.</li><li><b>🗓️ Susun</b>: letakkan mapel ke jam secara otomatis atau satu per satu, dengan bentrok guru ditandai merah.</li><li><b>✅ Terapkan</b>: periksa, lalu aktifkan pada hari pertama semester.</li></ol></div>
        ${boleh ? `<div class="jsu-mulai-tombol"><button class="bk2-btn utama" onclick="jsuMulai(true)">📥 Salin dari Jadwal Sekarang<small>Jam, penugasan, dan isi jadwal disalin, lalu tinggal diubah yang perlu</small></button>
          <button class="bk2-btn" onclick="jsuMulai(false)">🧩 Salin Jam & Penugasan Saja<small>Isi jadwal kosong, lalu disusun ulang (bisa otomatis)</small></button></div>` : `<p class="redup">Hanya Admin / Kepala yang dapat menyusun jadwal.</p>`}
      </div></div>`;
    return;
  }
  const tabs = [["jam", "⏰ Jam Belajar"], ["tugas", "👥 Penugasan"], ["susun", "🗓️ Susun"], ["terap", "✅ Terapkan"]];
  const isi = { jam: _jsuHtmlJam, tugas: _jsuHtmlTugas, susun: _jsuHtmlSusun, terap: _jsuHtmlTerap }[JSU.tab] || _jsuHtmlTugas;
  wadah.innerHTML = `<div class="bk2 jsu2" style="--bk:${warna}">${_jsuHero(_jsuBentrok())}
    <div class="jsu-langkah">${tabs.map(([k, l], i) => `<button class="${JSU.tab === k ? "on" : ""}" onclick="JSU.tab='${k}';jsuGambar()"><i>${i + 1}</i>${l}</button>`).join("")}</div>
    <div id="jsu-isi">${isi()}</div></div>`;
  if (typeof _biHitungNaik === "function" && JSU._anim !== JSU.tab) { JSU._anim = JSU.tab; _biHitungNaik(wadah); }
}
function _jsuHero(b) {
  const d = JSU.d;
  let jp = 0, tg = 0; const guru = new Set();
  if (d) { Object.entries(d.tugas || {}).forEach(([kk, t]) => { if (!t) return; tg++; if (t.g) guru.add(t.g); }); JSU.kls.forEach((k) => _jsuTugas(k.id).forEach((t) => (jp += _jsuTerpasang(k.id, t.m)))); }
  const angka = d && typeof _biAngka === "function" ? _biAngka([["catat", "Kelas", JSU.kls.length], ["l", "Penugasan", tg], ["aktif", "Guru", guru.size], ["lulus", "JP Terpasang", Math.round(jp)], ["keluar", "Bentrok", b ? b.n : 0]]) : "";
  return `<div class="bk2-hero"><div><small>🗓️ SUSUN JADWAL SEMESTER · ${_jsuE((typeof rgRuang === "function" && rgRuang().nama) || "")}</small><h2>${_jsuE(d ? d.nama : "Jadwal Semester Baru")}</h2>
    <p>${d ? `Draf · <span id="jsu-status">${_jsuE(JSU.status || "Tersimpan ✓")}</span>${d.diterapkan ? ` · Sudah diaktifkan ${_jsuE(new Date(d.diterapkan).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }))}` : ""}` : "Susun jadwal baru tanpa mengganggu jadwal yang sedang berjalan."}</p>
    <button class="bk2-btn jsu-kembali" onclick="jsuTutup()">← Kembali ke Jadwal</button></div>${angka}</div>`;
}

// ═════ 1. JAM BELAJAR ═════
function _jsuHtmlJam() {
  const pola = JSU.d.pola || {}, boleh = _jsuBoleh();
  const prog = [...new Set([...JSU.kls.map((k) => k.program || "Umum"), ...Object.keys(pola)])].filter((p) => JSU.kls.some((k) => (k.program || "Umum") === p));
  return `<div class="jsu-ket">Atur jam pelajaran tiap paket. Kelas di paket yang sama memakai jam yang sama. Mengubah jam tidak menghapus isi jadwal, karena isi mengikuti urutan jamnya.</div>
    ${prog.map((p) => { const pg = pola[p] || {}, kel = _jsuKelasUrut().filter((k) => (k.program || "Umum") === p).map((k) => formatKelasLabel ? formatKelasLabel(k.nama_kelas) : k.nama_kelas);
      const tot = JS_HARI.reduce((a, h) => a + (pg[h] || []).length, 0);
      return `<div class="jsu-kartu"><div class="jsu-kartu-h"><div><b>${_jsuE(p)}</b><small>${_jsuE(kel.join(", "))} · ${tot} jam per pekan</small></div>
        ${boleh ? `<div class="jsu-alat"><button class="bk2-btn utama" onclick="jsuPolaCepat('${_jsuE(p)}')">⚡ Buat Pola Cepat</button><button class="bk2-btn" onclick="jsuSalinHari('${_jsuE(p)}')">📋 Salin Satu Hari ke Hari Lain</button></div>` : ""}</div>
        <div class="jsu-jam-hari">${JS_HARI.map((h) => `<div class="jsu-jam-baris"><b>${h}</b><div>${(pg[h] || []).map((s, i) => `<button class="jsu-jam" ${boleh ? `onclick="jsuUbahJam('${_jsuE(p)}','${h}','${s.id}')"` : ""}><i>${i + 1}</i>${s.m}–${s.s}</button>`).join("") || `<span class="redup">Libur / Belum Ada Jam</span>`}
          ${boleh ? `<button class="jsu-jam tambah" onclick="jsuUbahJam('${_jsuE(p)}','${h}','')">＋ Jam</button>` : ""}</div></div>`).join("")}</div></div>`; }).join("")}`;
}
function jsuUbahJam(p, h, sid) {
  const l = ((JSU.d.pola || {})[p] || {})[h] || [], s = l.find((x) => x.id === sid), akhir = l[l.length - 1];
  const lama = akhir ? _jsuMnt(akhir.s) - _jsuMnt(akhir.m) : 45, m0 = s ? s.m : akhir ? akhir.s : "07:30", s0 = s ? s.s : _jsuJam(_jsuMnt(m0) + lama);
  const terpakai = sid ? JSU.kls.filter((k) => (k.program || "Umum") === p && _jsuIsi(k.id, sid).length).length : 0;
  openModal(`<h3>${s ? "✏️ Ubah Jam" : "＋ Tambah Jam"} · ${_jsuE(h)}</h3><p class="jsu-ket">${_jsuE(p)}</p>
    <div class="jsu-dua"><div class="field"><label class="form-label">Mulai</label><input type="time" class="input" id="jsj-m" value="${m0}"></div><div class="field"><label class="form-label">Selesai</label><input type="time" class="input" id="jsj-s" value="${s0}"></div></div>
    ${terpakai ? `<p class="jsu-ket">Jam ini sudah terisi di ${terpakai} kelas. Isinya tetap ikut bila jamnya diubah.</p>` : ""}
    <div class="jsu-dua"><button class="btn btn-accent" onclick="jsuSimpanJam('${_jsuE(p)}','${h}','${sid}')">💾 Simpan</button>${s ? `<button class="btn jsu-btn-hapus" onclick="jsuHapusJam('${_jsuE(p)}','${h}','${sid}')">🗑️ Hapus Jam</button>` : ""}</div>`);
}
function jsuSimpanJam(p, h, sid) {
  const m = document.getElementById("jsj-m").value, s = document.getElementById("jsj-s").value;
  if (!m || !s || m >= s) return toast("Jam selesai harus sesudah jam mulai", "err");
  const pg = JSON.parse(JSON.stringify((JSU.d.pola || {})[p] || {})), l = (pg[h] = pg[h] || []);
  const lain = l.filter((x) => x.id !== sid);
  if (lain.some((x) => x.m < s && x.s > m)) return toast("Jam ini bertumpuk dengan jam lain di hari yang sama", "err");
  if (sid) Object.assign(l.find((x) => x.id === sid), { m, s }); else l.push({ id: _jsuId(), m, s });
  l.sort((a, b) => (a.m < b.m ? -1 : 1));
  closeModal(); _jsuSimpan({ pola: { [p]: pg } }); jsuGambar();
}
async function jsuHapusJam(p, h, sid) {
  const kena = JSU.kls.filter((k) => (k.program || "Umum") === p && _jsuIsi(k.id, sid).length);
  if (kena.length && !(await konfirmasiTema(`Jam ini sudah terisi di ${kena.length} kelas. Isinya ikut terhapus dari draf. Lanjutkan?`, { judul: "Hapus Jam", teksYa: "Hapus", bahaya: true }))) return;
  const pg = JSON.parse(JSON.stringify((JSU.d.pola || {})[p] || {})); pg[h] = (pg[h] || []).filter((x) => x.id !== sid);
  closeModal(); _jsuSimpan({ pola: { [p]: pg }, isi: Object.fromEntries(kena.map((k) => [k.id + "|" + sid, null])) }); jsuGambar();
}
function jsuPolaCepat(p) {
  const pg = (JSU.d.pola || {})[p] || {}, contoh = (pg.Senin || [])[0], L = contoh ? _jsuMnt(contoh.s) - _jsuMnt(contoh.m) : 45;
  openModal(`<h3>⚡ Buat Pola Jam Cepat</h3><p class="jsu-ket">${_jsuE(p)}: jam di hari yang dipilih dibuat ulang. Isi jadwal tetap mengikuti urutan jam ke-1, ke-2, dan seterusnya.</p>
    <label class="form-label">Hari</label><div class="jsu-cek">${JS_HARI.map((h) => `<label><input type="checkbox" class="jsp-h" value="${h}" ${(pg[h] || []).length || h !== "Sabtu" ? "checked" : ""}> ${h}</label>`).join("")}</div>
    <div class="jsu-dua"><div class="field"><label class="form-label">Mulai Jam Ke-1</label><input type="time" class="input" id="jsp-m" value="${contoh ? contoh.m : "07:30"}"></div>
      <div class="field"><label class="form-label">Menit per JP</label><input type="number" class="input" id="jsp-l" value="${L}" min="20" max="120"></div></div>
    <div class="jsu-dua"><div class="field"><label class="form-label">Jumlah JP Pagi</label><input type="number" class="input" id="jsp-n" value="4" min="1" max="12"></div>
      <div class="field"><label class="form-label">Istirahat Sesudah JP Ke-</label><input type="number" class="input" id="jsp-i" value="2" min="0" max="12"><small class="redup">Isi 0 bila tanpa istirahat</small></div></div>
    <div class="jsu-dua"><div class="field"><label class="form-label">Lama Istirahat (Menit)</label><input type="number" class="input" id="jsp-il" value="15" min="0" max="120"></div><div></div></div>
    <details class="jsu-sore"><summary>＋ Sesi Kedua (Sore / Malam)</summary><div class="jsu-dua"><div class="field"><label class="form-label">Mulai</label><input type="time" class="input" id="jsp-m2" value=""></div>
      <div class="field"><label class="form-label">Jumlah JP</label><input type="number" class="input" id="jsp-n2" value="1" min="1" max="6"></div></div></details>
    <button class="btn btn-accent" style="width:100%" onclick="jsuTerapPolaCepat('${_jsuE(p)}')">⚡ Terapkan Pola</button>`);
}
function jsuTerapPolaCepat(p) {
  const v = (id) => document.getElementById(id).value, hari = [...document.querySelectorAll(".jsp-h:checked")].map((x) => x.value);
  const L = Number(v("jsp-l")) || 45, n = Number(v("jsp-n")) || 0, ist = Number(v("jsp-i")) || 0, il = Number(v("jsp-il")) || 0;
  if (!hari.length || !v("jsp-m") || !n) return toast("Lengkapi hari, jam mulai, dan jumlah JP", "err");
  const jam = []; let t = _jsuMnt(v("jsp-m"));
  for (let i = 1; i <= n; i++) { jam.push([t, t + L]); t += L; if (i === ist) t += il; }
  if (v("jsp-m2")) { let t2 = _jsuMnt(v("jsp-m2")); if (t2 < t) return toast("Sesi kedua harus sesudah sesi pagi selesai", "err"); for (let i = 0; i < (Number(v("jsp-n2")) || 0); i++) { jam.push([t2, t2 + L]); t2 += L; } }
  const pg = JSON.parse(JSON.stringify((JSU.d.pola || {})[p] || {})), hapus = {};
  hari.forEach((h) => {
    const lama = pg[h] || [];
    pg[h] = jam.map(([a, b], i) => ({ id: (lama[i] || {}).id || _jsuId(), m: _jsuJam(a), s: _jsuJam(b) }));
    lama.slice(jam.length).forEach((s) => JSU.kls.forEach((k) => { if (_jsuIsi(k.id, s.id).length) hapus[k.id + "|" + s.id] = null; }));
  });
  closeModal(); _jsuSimpan({ pola: { [p]: pg }, ...(Object.keys(hapus).length ? { isi: hapus } : {}) }); jsuGambar();
  toast(`Pola jam diterapkan ke ${hari.length} hari${Object.keys(hapus).length ? ` · ${Object.keys(hapus).length} isi di jam yang hilang ikut dihapus` : ""}`, "ok");
}
function jsuSalinHari(p) {
  openModal(`<h3>📋 Salin Jam Satu Hari</h3><p class="jsu-ket">${_jsuE(p)}: jam di hari tujuan diganti sama persis dengan hari sumber.</p>
    <div class="field"><label class="form-label">Hari Sumber</label><select class="input" id="jss-d">${JS_HARI.map((h) => `<option>${h}</option>`).join("")}</select></div>
    <label class="form-label">Hari Tujuan</label><div class="jsu-cek">${JS_HARI.map((h) => `<label><input type="checkbox" class="jss-h" value="${h}" ${h !== "Senin" && h !== "Sabtu" ? "checked" : ""}> ${h}</label>`).join("")}</div>
    <button class="btn btn-accent" style="width:100%;margin-top:10px" onclick="jsuTerapSalinHari('${_jsuE(p)}')">📋 Salin</button>`);
}
function jsuTerapSalinHari(p) {
  const src = document.getElementById("jss-d").value, tuju = [...document.querySelectorAll(".jss-h:checked")].map((x) => x.value).filter((h) => h !== src);
  const pg = JSON.parse(JSON.stringify((JSU.d.pola || {})[p] || {})), sumber = pg[src] || [], hapus = {};
  tuju.forEach((h) => { const lama = pg[h] || []; pg[h] = sumber.map((s, i) => ({ id: (lama[i] || {}).id || _jsuId(), m: s.m, s: s.s }));
    lama.slice(sumber.length).forEach((s) => JSU.kls.forEach((k) => { if (_jsuIsi(k.id, s.id).length) hapus[k.id + "|" + s.id] = null; })); });
  closeModal(); _jsuSimpan({ pola: { [p]: pg }, ...(Object.keys(hapus).length ? { isi: hapus } : {}) }); jsuGambar();
}

// ═════ 2. PENUGASAN MENGAJAR ═════
function _jsuOpsiGuru(pilih, kosong = "— Pilih Guru —") {
  const ids = new Set((STATE.daftarGuru || []).map((g) => g.id)); if (pilih) ids.add(pilih);
  return `<option value="">${kosong}</option>` + [...ids].map((id) => [id, _jsuNamaGuru(id)]).sort((a, b) => a[1].localeCompare(b[1], "id")).map(([id, n]) => `<option value="${id}" ${id === pilih ? "selected" : ""}>${_jsuE(n)}</option>`).join("");
}
function _jsuSaranCp(k) {
  if (typeof CP_PETA === "undefined") return [];
  const ada = new Set(_jsuTugas(k).map((t) => t.m)), r = STATE.ruang, nama = new Set();
  Object.values(CP_PETA).forEach((p) => ((p[2] || {})[r] || []).forEach((n) => nama.add(n.toLowerCase())));
  return (LOOKUP.mapel || []).filter((m) => nama.has(String(m.nama_mapel || "").toLowerCase()) && !ada.has(m.id));
}
function _jsuHtmlTugas() {
  const boleh = _jsuBoleh(), kls = _jsuKelasUrut(), pilih = JSU.kelas === "semua" ? kls : kls.filter((k) => k.id === JSU.kelas);
  const chip = `<div class="bk2-jenjang jsu-kls">${[{ id: "semua", nama_kelas: "Semua Kelas" }, ...kls].map((k) => `<button class="${JSU.kelas === k.id ? "on" : ""}" style="--rw:var(--bk)" onclick="JSU.kelas='${k.id}';jsuGambar()">${_jsuE(k.id === "semua" ? "🏫 Semua Kelas" : (formatKelasLabel ? formatKelasLabel(k.nama_kelas) : k.nama_kelas))}<small>${k.id === "semua" ? `${Object.values(JSU.d.tugas || {}).filter(Boolean).length} penugasan` : `${_jsuTugas(k.id).length} mapel · ${_jsuAngka(_jsuTugas(k.id).reduce((a, t) => a + t.jp, 0))} JP`}</small></button>`).join("")}</div>`;
  return `<div class="jsu-ket">Di sini Anda menentukan <b>siapa mengajar apa</b>. Ganti guru di sini, maka semua jam mapel itu di kelas itu ikut berganti. JP adalah jumlah jam pelajaran per pekan.</div>
    <div class="bk2-alat">${boleh ? `<button class="bk2-btn utama" onclick="jsuGantiPengajar()">🔁 Ganti Pengajar Sekaligus</button>` : ""}<button class="bk2-btn" onclick="jsuBebanGuru()">📊 Beban Mengajar Guru</button><span class="bk2-jml">Klik nama kelas untuk menyaring</span></div>
    ${chip}
    ${pilih.map((k) => { const tg = _jsuTugas(k.id).sort((a, b) => _jsuMapel(a.m).localeCompare(_jsuMapel(b.m), "id")), saran = _jsuSaranCp(k.id);
      const sudah = new Set(tg.map((t) => t.m)), opsMapel = (LOOKUP.mapel || []).filter((m) => !sudah.has(m.id)).map((m) => `<option value="${m.id}">${_jsuE(m.nama_mapel)}</option>`).join("");
      const tot = tg.reduce((a, t) => a + t.jp, 0), pas = tg.reduce((a, t) => a + _jsuTerpasang(k.id, t.m), 0);
      return `<div class="jsu-kartu"><div class="jsu-kartu-h"><div><b>${badgeKelas(k.nama_kelas)} ${_jsuE(k.program || "")}</b><small>${tg.length} mapel · target ${_jsuAngka(tot)} JP · terpasang ${_jsuAngka(pas)} JP</small></div></div>
        <div class="bi2-wadah"><table class="bi2-tabel jsu-tabel"><colgroup><col><col style="width:34%"><col style="width:118px"><col style="width:150px"><col style="width:44px"></colgroup>
        <thead><tr><th>Mata Pelajaran</th><th>Guru Pengajar</th><th class="c">JP / Pekan</th><th>Terpasang</th><th></th></tr></thead><tbody>
        ${tg.map((t) => { const p = _jsuTerpasang(k.id, t.m), cls = p > t.jp ? "lebih" : p < t.jp ? "kurang" : "pas";
          return `<tr><td class="nama"><span class="jsu-mp" style="--mw:${_jsuWarna(t.m)}">${_jsuE(_jsuMapel(t.m))}</span></td>
            <td>${boleh ? `<select class="input jsu-sel ${t.g ? "" : "kosong"}" onchange="jsuAturGuru('${k.id}','${t.m}',this.value)">${_jsuOpsiGuru(t.g)}</select>` : _jsuE(_jsuNamaGuru(t.g))}</td>
            <td class="c">${boleh ? `<span class="jsu-jp"><button onclick="jsuAturJp('${k.id}','${t.m}',-1)">−</button><b>${_jsuAngka(t.jp)}</b><button onclick="jsuAturJp('${k.id}','${t.m}',1)">＋</button></span>` : _jsuAngka(t.jp)}</td>
            <td><span class="jsu-pas ${cls}"><i style="width:${Math.min(100, t.jp ? (p / t.jp) * 100 : 0)}%"></i></span><small class="jsu-pas-t ${cls}">${_jsuAngka(p)} / ${_jsuAngka(t.jp)} JP${cls === "lebih" ? " · lebih" : cls === "kurang" ? ` · kurang ${_jsuAngka(t.jp - p)}` : " ✓"}</small></td>
            <td class="c">${boleh ? `<button class="jsu-x" title="Hapus mapel dari kelas ini" onclick="jsuHapusTugas('${k.id}','${t.m}')">✕</button>` : ""}</td></tr>`; }).join("") || `<tr><td colspan="5" class="c redup" style="padding:18px">Belum ada mapel di kelas ini.</td></tr>`}
        </tbody></table></div>
        ${boleh ? `<div class="jsu-tambah"><select class="input" id="jst-m-${k.id}"><option value="">＋ Tambah Mapel ke Kelas Ini…</option>${opsMapel}</select><select class="input" id="jst-g-${k.id}">${_jsuOpsiGuru("")}</select><button class="bk2-btn utama" onclick="jsuTambahTugas('${k.id}')">Tambah</button></div>
          ${saran.length ? `<div class="jsu-saran"><b>💡 Mapel CP 2025 di jenjang ini yang belum ada di kelas ini:</b> ${saran.map((m) => `<button onclick="jsuTambahTugas('${k.id}','${m.id}')">＋ ${_jsuE(m.nama_mapel)}</button>`).join("")}</div>` : ""}` : ""}</div>`; }).join("")}`;
}
function jsuAturGuru(k, m, g) {
  const kk = k + "|" + m, t = { ...((JSU.d.tugas || {})[kk] || { jp: 2 }), g: g || null };
  const isi = {};
  Object.entries(JSU.d.isi || {}).forEach(([key, l]) => { if (!key.startsWith(k + "|") || !l) return;
    if (l.some((e) => e && e.m === m && e.g && e.g === g)) isi[key] = l.map((e) => (e && e.m === m && e.g === g ? (({ g: _, ...r }) => r)(e) : e)); });
  _jsuSimpan({ tugas: { [kk]: t }, ...(Object.keys(isi).length ? { isi } : {}) }); jsuGambar();
  toast(`${_jsuMapel(m)} ${_jsuNamaKelas(k)} → ${_jsuNamaGuru(g)}`, "ok");
}
function jsuAturJp(k, m, d) {
  const kk = k + "|" + m, t = (JSU.d.tugas || {})[kk]; if (!t) return;
  _jsuSimpan({ tugas: { [kk]: { ...t, jp: Math.max(0.5, (Number(t.jp) || 0) + d) } } }); jsuGambar();
}
function jsuTambahTugas(k, m) {
  m = m || document.getElementById("jst-m-" + k)?.value; const g = m && !arguments[1] ? document.getElementById("jst-g-" + k)?.value : "";
  if (!m) return toast("Pilih mapel dulu", "err");
  _jsuSimpan({ tugas: { [k + "|" + m]: { g: g || null, jp: 2 } } }); jsuGambar();
}
async function jsuHapusTugas(k, m) {
  const pas = _jsuTerpasang(k, m);
  if (!(await konfirmasiTema(`Hapus ${_jsuE(_jsuMapel(m))} dari ${_jsuE(_jsuNamaKelas(k))}?${pas ? ` ${_jsuAngka(pas)} JP yang sudah terpasang di jadwal ikut dikosongkan.` : ""}`, { judul: "Hapus Mapel", teksYa: "Hapus", bahaya: true }))) return;
  const isi = {};
  Object.entries(JSU.d.isi || {}).forEach(([key, l]) => { if (key.startsWith(k + "|") && l && l.some((e) => e && e.m === m)) { const n = l.filter((e) => e && e.m !== m); isi[key] = n.length ? n : null; } });
  _jsuSimpan({ tugas: { [k + "|" + m]: null }, ...(Object.keys(isi).length ? { isi } : {}) }); jsuGambar();
}
function jsuGantiPengajar() {
  const g = new Set(Object.values(JSU.d.tugas || {}).filter((t) => t && t.g).map((t) => t.g));
  openModal(`<h3>🔁 Ganti Pengajar Sekaligus</h3><p class="jsu-ket">Pilih guru lama, centang mapel/kelas yang dipindahkan, lalu pilih guru penggantinya.</p>
    <div class="field"><label class="form-label">Guru Lama</label><select class="input" id="jsg-a" onchange="_jsuGantiDaftar()"><option value="">— Pilih —</option>${[...g].map((id) => [id, _jsuNamaGuru(id)]).sort((a, b) => a[1].localeCompare(b[1], "id")).map(([id, n]) => `<option value="${id}">${_jsuE(n)}</option>`).join("")}</select></div>
    <div id="jsg-daftar" class="jsu-cek tegak"></div>
    <div class="field"><label class="form-label">Guru Pengganti</label><select class="input" id="jsg-b">${_jsuOpsiGuru("")}</select></div>
    <button class="btn btn-accent" style="width:100%" onclick="jsuTerapGanti()">🔁 Ganti</button>`);
}
function _jsuGantiDaftar() {
  const a = document.getElementById("jsg-a").value, el = document.getElementById("jsg-daftar");
  const l = Object.entries(JSU.d.tugas || {}).filter(([, t]) => t && t.g === a).map(([kk, t]) => ({ kk, k: kk.split("|")[0], m: kk.split("|")[1], jp: t.jp })).sort((x, y) => _jsuNoKelas(_jsuNamaKelas(x.k)) - _jsuNoKelas(_jsuNamaKelas(y.k)));
  el.innerHTML = l.map((t) => `<label><input type="checkbox" class="jsg-c" value="${t.kk}" checked> ${_jsuE(_jsuMapel(t.m))} · ${_jsuE(_jsuNamaKelas(t.k))} <small class="redup">${_jsuAngka(t.jp)} JP</small></label>`).join("") || `<span class="redup">Tidak ada penugasan.</span>`;
}
function jsuTerapGanti() {
  const a = document.getElementById("jsg-a").value, b = document.getElementById("jsg-b").value, kk = [...document.querySelectorAll(".jsg-c:checked")].map((x) => x.value);
  if (!a || !b || !kk.length) return toast("Pilih guru lama, mapel, dan guru pengganti", "err");
  if (a === b) return toast("Guru pengganti sama dengan guru lama", "err");
  const tugas = Object.fromEntries(kk.map((x) => [x, { ...JSU.d.tugas[x], g: b }])), isi = {};
  // Sel yang sengaja diberi guru lama (bukan dari penugasan) pada mapel yang dipindah juga ikut diganti
  Object.entries(JSU.d.isi || {}).forEach(([key, l]) => { const k = key.split("|")[0]; if (!l) return;
    if (l.some((e) => e && e.g === a && kk.includes(k + "|" + e.m))) isi[key] = l.map((e) => (e && e.g === a && kk.includes(k + "|" + e.m) ? (({ g: _, ...r }) => r)(e) : e)); });
  closeModal(); _jsuSimpan({ tugas, ...(Object.keys(isi).length ? { isi } : {}) }); jsuGambar();
  toast(`${kk.length} penugasan dipindahkan ke ${_jsuNamaGuru(b)}`, "ok");
}
function jsuBebanGuru() {
  const b = {};
  Object.entries(JSU.d.tugas || {}).forEach(([kk, t]) => { if (!t) return; const [k, m] = kk.split("|"), g = t.g || "_"; const x = (b[g] = b[g] || { jp: 0, pas: 0, l: [] }); x.jp += Number(t.jp) || 0; x.pas += _jsuTerpasang(k, m); x.l.push(`${_jsuMapel(m)} ${(formatKelasLabel ? formatKelasLabel(_jsuNamaKelas(k)) : _jsuNamaKelas(k))}`); });
  const luar = {}; JSU.lain.forEach((r) => (luar[r.guru_id] = (luar[r.guru_id] || 0) + 1));
  const d = Object.entries(b).sort((x, y) => y[1].jp - x[1].jp);
  openModal(`<h3>📊 Beban Mengajar Guru</h3><p class="jsu-ket">Jumlah JP per pekan dari penugasan di ${_jsuE((typeof rgRuang === "function" && rgRuang().nama) || "ruang ini")}. Kolom "Jenjang Lain" menunjukkan jumlah jadwal aktif guru tersebut di jenjang lain.</p>
    <div class="bi2-wadah"><table class="bi2-tabel"><thead><tr><th>Guru</th><th class="c">JP</th><th class="c">Terpasang</th><th class="c">Jenjang Lain</th><th>Mengajar</th></tr></thead><tbody>
    ${d.map(([g, x]) => `<tr><td class="nama"><b>${_jsuE(g === "_" ? "Belum Ada Guru" : _jsuNamaGuru(g))}</b></td><td class="c"><b>${_jsuAngka(x.jp)}</b></td><td class="c">${_jsuAngka(x.pas)}</td><td class="c">${luar[g] ? `${luar[g]} jadwal` : "—"}</td><td><small>${_jsuE(x.l.join(", "))}</small></td></tr>`).join("")}
    </tbody></table></div>`);
}

// ═════ 3. SUSUN ═════
function _jsuHtmlSusun() {
  const kls = _jsuKelasUrut();
  if (JSU.kelas === "semua" || !kls.some((k) => k.id === JSU.kelas)) JSU.kelas = (kls[0] || {}).id || "";
  const b = _jsuBentrok(), boleh = _jsuBoleh();
  const mode = `<div class="bi3-mode"><button class="${JSU.mode === "kelas" ? "on" : ""}" onclick="JSU.mode='kelas';jsuGambar()">🏫 Per Kelas</button><button class="${JSU.mode === "guru" ? "on" : ""}" onclick="JSU.mode='guru';jsuGambar()">👳 Per Guru</button></div>`;
  if (JSU.mode === "guru") return mode + _jsuHtmlPerGuru();
  const k = JSU.kelas, pl = _jsuPola(k), tg = _jsuTugas(k).sort((a, x) => _jsuMapel(a.m).localeCompare(_jsuMapel(x.m), "id"));
  const chip = `<div class="bk2-jenjang jsu-kls">${kls.map((x) => { const nb = Object.keys(b.peta).filter((p) => p.startsWith(x.id + "|")).length, kur = _jsuTugas(x.id).reduce((a, t) => a + Math.max(0, t.jp - _jsuTerpasang(x.id, t.m)), 0);
    return `<button class="${k === x.id ? "on" : ""}" style="--rw:${nb ? "#dc2626" : kur ? "#d97706" : "#16a34a"}" onclick="JSU.kelas='${x.id}';JSU.pilih=null;jsuGambar()">${_jsuE(formatKelasLabel ? formatKelasLabel(x.nama_kelas) : x.nama_kelas)}<small>${nb ? `${nb} bentrok` : kur ? `kurang ${_jsuAngka(kur)} JP` : "lengkap ✓"}</small></button>`; }).join("")}</div>`;
  const palet = boleh ? `<div class="jsu-palet"><span>${JSU.pilih ? "Ketuk jam untuk meletakkan:" : "Pilih mapel, lalu ketuk jam:"}</span>${tg.map((t) => { const p = _jsuTerpasang(k, t.m), sisa = t.jp - p;
      return `<button class="${JSU.pilih === t.m ? "on" : ""} ${sisa <= 0 ? "habis" : ""}" style="--mw:${_jsuWarna(t.m)}" onclick="JSU.pilih=JSU.pilih==='${t.m}'?null:'${t.m}';jsuGambar()"><b>${_jsuE(_jsuMapel(t.m))}</b><small>${_jsuE(_jsuNamaGuru(t.g))} · ${sisa > 0 ? `sisa ${_jsuAngka(sisa)}` : sisa < 0 ? `lebih ${_jsuAngka(-sisa)}` : "✓"}</small></button>`; }).join("")}
      <button class="hapus ${JSU.pilih === "_hapus" ? "on" : ""}" onclick="JSU.pilih=JSU.pilih==='_hapus'?null:'_hapus';jsuGambar()"><b>🧹 Kosongkan</b><small>ketuk jam yang mau dikosongkan</small></button></div>` : "";
  const idx = _jsuIndeks();
  const kolom = JS_HARI.filter((h) => (pl[h] || []).length).map((h) => `<div class="jsu-hari"><h4>${h}</h4>${(pl[h] || []).map((s, i) => {
    const l = _jsuIsi(k, s.id); let bebas = true;
    if (JSU.pilih && JSU.pilih !== "_hapus") { const g = ((JSU.d.tugas || {})[k + "|" + JSU.pilih] || {}).g; bebas = _jsuGuruBebas(idx, g, h, s, {}, null) || l.some((e) => _jsuGuru(k, e) === g); }
    const isi = l.map((e, j) => { const br = b.peta[k + "|" + s.id + "|" + j], gb = b.gabung[k + "|" + s.id + "|" + j];
      return `<div class="jsu-sel-isi ${br ? "bentrok" : ""}" style="--mw:${_jsuWarna(e.m)}" ${br ? `title="Guru bentrok: ${_jsuE(br.join("; "))}"` : ""}><b>${_jsuE(_jsuMapel(e.m))}</b><small>${_jsuE(_jsuNamaGuru(_jsuGuru(k, e)))}${e.g ? " ✱" : ""}</small>${e.tm ? `<em>${_jsuE(JS_MINGGU[e.tm] || e.tm)}</em>` : ""}${e.pb ? `<em>Pekan ke-${_jsuE(e.pb)}</em>` : ""}${gb ? `<em class="biru">🔗 Gabung ${_jsuE(gb.join(", "))}</em>` : ""}${br ? `<em class="merah">⚠️ Bentrok: ${_jsuE(br[0])}</em>` : ""}</div>`; }).join("");
    return `<button class="jsu-sesi ${l.length ? "" : "kosong"} ${JSU.pilih && JSU.pilih !== "_hapus" && !bebas ? "sibuk" : ""}" ${boleh ? `onclick="jsuKetukSesi('${s.id}','${h}')"` : ""}><span class="jsu-sesi-jam"><i>${i + 1}</i>${s.m}–${s.s}</span>${isi || `<span class="jsu-sesi-kosong">${JSU.pilih && JSU.pilih !== "_hapus" ? (bebas ? "＋ Letakkan di sini" : "Guru sedang mengajar di kelas lain") : "Kosong"}</span>`}</button>`; }).join("")}</div>`).join("");
  return `${mode}${chip}
    <div class="bk2-alat">${boleh ? `<button class="bk2-btn utama" onclick="jsuIsiOtomatis(['${k}'])">⚡ Isi Otomatis Kelas Ini</button><button class="bk2-btn" onclick="jsuIsiOtomatis(null)">⚡ Isi Otomatis Semua Kelas</button><button class="bk2-btn" onclick="jsuKosongkanKelas('${k}')">🧹 Kosongkan Kelas Ini</button>` : ""}
      <span class="bk2-jml">${b.n ? `<b class="jsu-merah">⚠️ ${b.n} jam bentrok</b>` : "✅ Tidak ada bentrok guru"} · ✱ = guru khusus di jam itu</span></div>
    ${palet}<div class="jsu-minggu">${kolom || `<div class="bk2-kosong">Paket ini belum punya jam belajar. Atur dulu di langkah ⏰ Jam Belajar.</div>`}</div>`;
}
function jsuKetukSesi(sid, hari) {
  const k = JSU.kelas, key = k + "|" + sid;
  if (JSU.pilih === "_hapus") { _jsuSimpan({ isi: { [key]: null } }); return jsuGambar(); }
  if (JSU.pilih) {
    const t = (JSU.d.tugas || {})[k + "|" + JSU.pilih];
    _jsuSimpan({ isi: { [key]: [{ m: JSU.pilih }] } });
    if (t && t.jp - _jsuTerpasang(k, JSU.pilih) <= 0) JSU.pilih = null;
    return jsuGambar();
  }
  JSU.ubah = { key, hari, sid, l: JSON.parse(JSON.stringify(_jsuIsi(k, sid))) };
  if (!JSU.ubah.l.length) JSU.ubah.l.push({ m: "" });
  _jsuModalSel();
}
function _jsuModalSel() {
  const u = JSU.ubah, k = JSU.kelas, s = (_jsuPola(k)[u.hari] || []).find((x) => x.id === u.sid) || {};
  const tg = _jsuTugas(k);
  openModal(`<h3>🗓️ ${_jsuE(_jsuNamaKelas(k))} · ${_jsuE(u.hari)} ${_jsuE(s.m || "")}–${_jsuE(s.s || "")}</h3>
    <p class="jsu-ket">Biasanya satu mapel. Tambahkan baris kedua hanya bila mapel <b>bergantian</b> (pekan ganjil/genap atau pekan ke-n). Guru mengikuti penugasan, kecuali dipilih guru khusus.</p>
    ${u.l.map((e, i) => `<div class="jsu-sel-ubah"><div class="field"><label class="form-label">Mapel</label><select class="input" onchange="JSU.ubah.l[${i}].m=this.value"><option value="">— Pilih —</option>${tg.map((t) => `<option value="${t.m}" ${t.m === e.m ? "selected" : ""}>${_jsuE(_jsuMapel(t.m))} (${_jsuE(_jsuNamaGuru(t.g))})</option>`).join("")}</select></div>
      <div class="field"><label class="form-label">Guru di Jam Ini</label><select class="input" onchange="JSU.ubah.l[${i}].g=this.value||undefined">${_jsuOpsiGuru(e.g || "", "Ikuti Penugasan")}</select></div>
      <div class="jsu-dua"><div class="field"><label class="form-label">Pekan</label><select class="input" onchange="JSU.ubah.l[${i}].tm=this.value==='setiap_minggu'?undefined:this.value">${Object.entries(JS_MINGGU).map(([v, n]) => `<option value="${v}" ${(e.tm || "setiap_minggu") === v ? "selected" : ""}>${n}</option>`).join("")}</select></div>
        <div class="field"><label class="form-label">Pekan Ke- (Opsional)</label><input class="input" placeholder="mis. 1,3" value="${_jsuE(e.pb || "")}" oninput="JSU.ubah.l[${i}].pb=this.value.replace(/[^0-9,]/g,'')||undefined"></div></div>
      ${u.l.length > 1 ? `<button class="bk2-btn" onclick="JSU.ubah.l.splice(${i},1);_jsuModalSel()">✕ Hapus Baris Ini</button>` : ""}</div>`).join("")}
    <button class="bk2-btn" style="width:100%;margin:6px 0 12px" onclick="JSU.ubah.l.push({m:'',tm:'genap'});if(JSU.ubah.l[0]&&!JSU.ubah.l[0].tm)JSU.ubah.l[0].tm='ganjil';_jsuModalSel()">＋ Mapel Bergantian di Jam Ini</button>
    <div class="jsu-dua"><button class="btn btn-accent" onclick="jsuSimpanSel()">💾 Simpan</button><button class="btn jsu-btn-hapus" onclick="JSU.ubah.l=[];jsuSimpanSel()">🧹 Kosongkan</button></div>`);
}
function jsuSimpanSel() {
  const u = JSU.ubah; if (!u) return;
  const l = u.l.filter((e) => e.m).map((e) => Object.fromEntries(Object.entries(e).filter(([, v]) => v !== undefined && v !== "")));
  closeModal(); _jsuSimpan({ isi: { [u.key]: l.length ? l : null } }); JSU.ubah = null; jsuGambar();
}
async function jsuKosongkanKelas(k) {
  if (!(await konfirmasiTema(`Kosongkan semua isi jadwal ${_jsuE(_jsuNamaKelas(k))} di draf? Penugasan guru tidak ikut terhapus.`, { judul: "Kosongkan Kelas", teksYa: "Kosongkan", bahaya: true }))) return;
  const isi = {}; Object.keys(JSU.d.isi || {}).forEach((key) => { if (key.startsWith(k + "|") && JSU.d.isi[key]) isi[key] = null; });
  if (Object.keys(isi).length) _jsuSimpan({ isi }); jsuGambar();
}
// Isi otomatis: mapel diletakkan di jam kosong, guru tidak boleh bentrok (termasuk jenjang lain),
// diutamakan 2 JP berurutan dan disebar ke hari yang berbeda.
async function jsuIsiOtomatis(kelasIds) {
  const semua = !kelasIds; kelasIds = kelasIds || _jsuKelasUrut().map((k) => k.id);
  if (semua && !(await konfirmasiTema("Isi jam yang masih kosong di SEMUA kelas sesuai sisa JP penugasan? Isi yang sudah ada tidak diubah.", { judul: "Isi Otomatis", teksYa: "Isi Sekarang", ikon: "⚡" }))) return;
  const idx = _jsuIndeks(), isi = {}, sementara = (k, sid) => (isi[k + "|" + sid] !== undefined ? isi[k + "|" + sid] || [] : _jsuIsi(k, sid));
  let dipasang = 0, gagal = [];
  // guru tersibuk didahulukan (paling sedikit pilihan jam)
  const beban = {}; Object.values(JSU.d.tugas || {}).forEach((t) => { if (t && t.g) beban[t.g] = (beban[t.g] || 0) + (Number(t.jp) || 0); });
  const antre = kelasIds.flatMap((k) => _jsuTugas(k).map((t) => ({ ...t, sisa: t.jp - _jsuTerpasang(k, t.m) }))).filter((t) => t.sisa >= 1)
    .sort((a, b) => (beban[b.g] || 0) - (beban[a.g] || 0) || b.sisa - a.sisa);
  for (const t of antre) {
    const pl = _jsuPola(t.k);
    const hariAda = (h) => (pl[h] || []).some((s) => sementara(t.k, s.id).some((e) => e.m === t.m));
    const bisa = (h, s) => !sementara(t.k, s.id).length && _jsuGuruBebas(idx, t.g, h, s, {}, null);
    const pasang = (h, s) => { isi[t.k + "|" + s.id] = [{ m: t.m }]; if (t.g) (idx[t.g] = idx[t.g] || []).push({ hari: h, m: s.m, s: s.s, k: t.k, sid: s.id, i: 0 }); t.sisa -= 1; dipasang++; };
    let putar = 0;
    while (t.sisa >= 1 && putar++ < 20) {
      const hariUrut = JS_HARI.filter((h) => (pl[h] || []).length).sort((a, b) => (hariAda(a) ? 1 : 0) - (hariAda(b) ? 1 : 0));
      let ok = false;
      if (t.sisa >= 2) for (const h of hariUrut) { if (hariAda(h)) break; const l = pl[h] || [];
        for (let i = 0; i + 1 < l.length; i++) if (l[i].s === l[i + 1].m && bisa(h, l[i]) && bisa(h, l[i + 1])) { pasang(h, l[i]); pasang(h, l[i + 1]); ok = true; break; }
        if (ok) break; }
      if (!ok) for (const h of hariUrut) { const s = (pl[h] || []).find((x) => bisa(h, x)); if (s) { pasang(h, s); ok = true; break; } }
      if (!ok) break;
    }
    if (t.sisa >= 1) gagal.push(`${_jsuMapel(t.m)} ${_jsuNamaKelas(t.k)} (sisa ${_jsuAngka(t.sisa)})`);
  }
  if (dipasang) _jsuSimpan({ isi }, true);
  jsuGambar();
  if (gagal.length) openModal(`<h3>⚡ Isi Otomatis</h3><p>${dipasang} JP berhasil diletakkan. Yang belum mendapat jam karena jam kosong habis atau gurunya sedang mengajar di kelas lain:</p><ul class="jsu-gagal">${gagal.map((x) => `<li>${_jsuE(x)}</li>`).join("")}</ul><p class="jsu-ket">Tambah jam di ⏰ Jam Belajar, kurangi JP, atau ganti guru, lalu jalankan lagi.</p>`);
  else toast(dipasang ? `${dipasang} JP diletakkan otomatis ✓` : "Semua JP sudah terpasang", "ok");
}
function _jsuHtmlPerGuru() {
  const ids = new Set(Object.values(JSU.d.tugas || {}).filter((t) => t && t.g).map((t) => t.g));
  if (!JSU.guruLihat || !ids.has(JSU.guruLihat)) JSU.guruLihat = [...ids].sort((a, b) => _jsuNamaGuru(a).localeCompare(_jsuNamaGuru(b), "id"))[0] || "";
  const g = JSU.guruLihat, idx = _jsuIndeks(), b = _jsuBentrok(idx), l = (idx[g] || []);
  const jp = l.filter((x) => !x.luar).reduce((a, x) => a + _jsuBobot(x), 0);
  return `<div class="bk2-alat"><select class="input" style="max-width:320px" onchange="JSU.guruLihat=this.value;jsuGambar()">${[...ids].sort((a, x) => _jsuNamaGuru(a).localeCompare(_jsuNamaGuru(x), "id")).map((id) => `<option value="${id}" ${id === g ? "selected" : ""}>${_jsuE(_jsuNamaGuru(id))}</option>`).join("")}</select>
      <span class="bk2-jml">${_jsuAngka(jp)} JP di sini${l.some((x) => x.luar) ? ` · ${l.filter((x) => x.luar).length} jadwal di jenjang lain` : ""}</span></div>
    <div class="jsu-minggu">${JS_HARI.map((h) => { const x = l.filter((y) => y.hari === h).sort((p, q) => (p.m < q.m ? -1 : 1)); if (!x.length) return "";
      return `<div class="jsu-hari"><h4>${h}</h4>${x.map((y) => { const br = !y.luar && b.peta[y.k + "|" + y.sid + "|" + y.i];
        return `<div class="jsu-sesi"><span class="jsu-sesi-jam">${y.m}–${y.s}</span><div class="jsu-sel-isi ${br ? "bentrok" : ""} ${y.luar ? "luar" : ""}" style="--mw:${y.luar ? "#64748b" : _jsuWarna(y.mp)}"><b>${y.luar ? `${_jsuE(({ A: "Paket A", Pa: "Putra", Pi: "Putri" })[y.luar] || y.luar)} (Jadwal Aktif)` : _jsuE(_jsuMapel(y.mp))}</b><small>${_jsuE(y.luar ? y.kn || "" : _jsuNamaKelas(y.k))}</small>${br ? `<em class="merah">⚠️ Bentrok</em>` : ""}</div></div>`; }).join("")}</div>`; }).join("") || `<div class="bk2-kosong">Guru ini belum punya jam di draf.</div>`}</div>`;
}

// ═════ 4. PERIKSA & TERAPKAN ═════
function _jsuBarisDB() {
  const out = [], sig = (k, l) => JSON.stringify(l.map((e) => [e.m, _jsuGuru(k, e), e.tm || "", e.pb || ""]));
  JSU.kls.forEach((k) => { const pl = _jsuPola(k.id); JS_HARI.forEach((h) => {
    const ss = (pl[h] || []).slice().sort((a, b) => (a.m < b.m ? -1 : 1)); let i = 0;
    while (i < ss.length) {
      const l = _jsuIsi(k.id, ss[i].id); if (!l.length) { i++; continue; }
      const t = sig(k.id, l); let j = i;
      while (j + 1 < ss.length && ss[j + 1].m === ss[j].s && sig(k.id, _jsuIsi(k.id, ss[j + 1].id)) === t) j++;
      l.forEach((e) => out.push({ hari: h, jam_mulai: ss[i].m + ":00", jam_selesai: ss[j].s + ":00", kelas_id: k.id, mapel_id: e.m, guru_id: _jsuGuru(k.id, e), tipe_minggu: e.tm || "setiap_minggu", pekan_bulan: e.pb || null }));
      i = j + 1;
    }
  }); });
  return out;
}
function _jsuHtmlTerap() {
  const d = JSU.d, b = _jsuBentrok(), rows = _jsuBarisDB(), boleh = _jsuBoleh();
  const per = _jsuKelasUrut().map((k) => { const tg = _jsuTugas(k.id), tot = tg.reduce((a, t) => a + t.jp, 0), pas = tg.reduce((a, t) => a + _jsuTerpasang(k.id, t.m), 0);
    const kurang = tg.filter((t) => _jsuTerpasang(k.id, t.m) < t.jp).map((t) => `${_jsuMapel(t.m)} −${_jsuAngka(t.jp - _jsuTerpasang(k.id, t.m))}`);
    const tanpaGuru = tg.filter((t) => !t.g).map((t) => _jsuMapel(t.m)), nb = Object.keys(b.peta).filter((p) => p.startsWith(k.id + "|")).length;
    return { k, tot, pas, kurang, tanpaGuru, nb }; });
  const masalah = per.reduce((a, x) => a + x.nb + x.tanpaGuru.length + (x.kurang.length ? 1 : 0), 0);
  const riwayat = JSU.tmpl.slice(0, 8);
  return `<div class="jsu-kartu"><div class="jsu-kartu-h"><div><b>📝 Identitas Jadwal</b><small>Tersimpan otomatis</small></div></div>
      <div class="jsu-tiga"><div class="field"><label class="form-label">Nama Jadwal</label><input class="input" value="${_jsuE(d.nama)}" ${boleh ? "" : "disabled"} onchange="_jsuSimpan({nama:this.value.trim()||'Jadwal Baru'});jsuGambar()"></div>
      <div class="field"><label class="form-label">Tahun Pelajaran</label><input class="input" value="${_jsuE(d.ta || "")}" ${boleh ? "" : "disabled"} onchange="_jsuSimpan({ta:this.value.trim()})"></div>
      <div class="field"><label class="form-label">Semester</label><select class="input" ${boleh ? "" : "disabled"} onchange="_jsuSimpan({sem:this.value})">${["Ganjil", "Genap"].map((s) => `<option ${d.sem === s ? "selected" : ""}>${s}</option>`).join("")}</select></div></div></div>
    <div class="jsu-kartu"><div class="jsu-kartu-h"><div><b>🔍 Pemeriksaan</b><small>${masalah ? `${masalah} hal perlu dicek` : "Semua kelas lengkap dan tanpa bentrok ✓"}</small></div></div>
      <div class="bi2-wadah"><table class="bi2-tabel"><colgroup><col style="width:120px"><col style="width:130px"><col><col style="width:150px"></colgroup><thead><tr><th>Kelas</th><th class="c">JP Terpasang</th><th>Catatan</th><th>Status</th></tr></thead><tbody>
      ${per.map((x) => `<tr><td class="nama">${badgeKelas(x.k.nama_kelas)}</td><td class="c"><b>${_jsuAngka(x.pas)}</b> / ${_jsuAngka(x.tot)}</td>
        <td><small>${[x.nb ? `<span class="jsu-merah">⚠️ ${x.nb} jam guru bentrok</span>` : "", x.tanpaGuru.length ? `Belum ada guru: ${_jsuE(x.tanpaGuru.join(", "))}` : "", x.kurang.length ? `JP kurang: ${_jsuE(x.kurang.join(", "))}` : ""].filter(Boolean).join("<br>") || "—"}</small></td>
        <td><em class="bk2-st ${x.nb ? "mutasi" : x.kurang.length || x.tanpaGuru.length ? "belum" : "aktif"}">${x.nb ? "Ada Bentrok" : x.kurang.length || x.tanpaGuru.length ? "Belum Lengkap" : "Siap ✓"}</em></td></tr>`).join("")}
      </tbody></table></div></div>
    <div class="jsu-kartu jsu-aktifkan"><div><b>✅ Aktifkan Jadwal Ini</b>
      <p>${rows.length} baris jadwal akan dibuat. Jadwal yang berlaku sekarang <b>dinonaktifkan, tidak dihapus</b>, dan dicadangkan di Riwayat di bawah, sehingga riwayat absensi dan jurnal tetap aman. Tekan pada <b>hari pertama semester</b>, karena mulai saat itu absensi dan jurnal guru memakai jadwal ini.</p></div>
      <div class="jsu-alat">${boleh ? `<button class="bk2-btn utama" onclick="jsuAktifkan()">✅ Aktifkan Sekarang</button>` : ""}<button class="bk2-btn" onclick="jsuUnduh()">⬇️ Unduh Excel</button>${boleh ? `<button class="bk2-btn" onclick="jsuMulai(true)">↺ Mulai Ulang Draf</button>` : ""}</div></div>
    ${riwayat.length ? `<div class="jsu-kartu"><div class="jsu-kartu-h"><div><b>🕘 Riwayat Jadwal</b><small>Jadwal yang pernah dipakai. Bisa diaktifkan kembali.</small></div></div>
      <div class="bi2-wadah"><table class="bi2-tabel"><thead><tr><th>Nama</th><th>Tahun / Semester</th><th>Status</th><th></th></tr></thead><tbody>
      ${riwayat.map((t) => `<tr><td class="nama"><b>${_jsuE(t.nama)}</b></td><td>${_jsuE(t.tahun_ajaran || "—")} · ${_jsuE(t.semester || "—")}</td><td><em class="bk2-st ${t.aktif ? "aktif" : "belum"}">${t.aktif ? `Aktif${t.aktif_sejak ? " sejak " + _jsuE(t.aktif_sejak) : ""}` : "Tidak Aktif"}</em></td>
        <td>${boleh && !t.aktif ? `<button class="bk2-btn" onclick="jsuAktifkanLagi('${t.id}')">Aktifkan Lagi</button>` : ""}</td></tr>`).join("")}</tbody></table></div></div>` : ""}`;
}
function jsuUnduh() {
  if (typeof XLSX === "undefined") return toast("Pustaka Excel belum termuat", "err");
  const rows = _jsuBarisDB().sort((a, b) => _jsuNoKelas(_jsuNamaKelas(a.kelas_id)) - _jsuNoKelas(_jsuNamaKelas(b.kelas_id)) || JS_HARI.indexOf(a.hari) - JS_HARI.indexOf(b.hari) || (a.jam_mulai < b.jam_mulai ? -1 : 1));
  const ws = XLSX.utils.json_to_sheet(rows.map((r) => ({ Kelas: _jsuNamaKelas(r.kelas_id), Hari: r.hari, Mulai: r.jam_mulai.slice(0, 5), Selesai: r.jam_selesai.slice(0, 5), Mapel: _jsuMapel(r.mapel_id), Guru: _jsuNamaGuru(r.guru_id), Pekan: JS_MINGGU[r.tipe_minggu] || r.tipe_minggu, "Pekan Ke-": r.pekan_bulan || "" })));
  const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, "Jadwal"); XLSX.writeFile(wb, `${JSU.d.nama}.xlsx`);
}
// Cadangkan jadwal aktif yang belum bertemplate, lalu aktifkan template tujuan (yang baru dulu, baru yang lama dimatikan)
async function _jsuGantiAktif(tid) {
  const r = STATE.ruang, hari = typeof tanggalISO === "function" ? tanggalISO() : new Date().toISOString().slice(0, 10);
  const tanpa = await supa.from("jadwal_pelajaran").select("id").eq("ruang_id", r).eq("aktif", true).is("template_id", null).then(unwrap);
  if (tanpa.length) {
    const [cad] = await supa.from("jadwal_template").insert({ nama: `Jadwal Sebelumnya (dipakai s.d. ${hari})`, tahun_ajaran: typeof hitungTahunAjaranOtomatis === "function" ? hitungTahunAjaranOtomatis() : null, semester: typeof hitungSemesterOtomatis === "function" ? hitungSemesterOtomatis() : null, aktif: true, ruang_id: r }).select().then(unwrap);
    await supa.from("jadwal_pelajaran").update({ template_id: cad.id }).eq("ruang_id", r).eq("aktif", true).is("template_id", null).then(unwrap);
  }
  await supa.from("jadwal_pelajaran").update({ aktif: true }).eq("ruang_id", r).eq("template_id", tid).then(unwrap);
  await supa.from("jadwal_pelajaran").update({ aktif: false }).eq("ruang_id", r).eq("aktif", true).neq("template_id", tid).then(unwrap);
  await supa.from("jadwal_template").update({ aktif: false }).eq("ruang_id", r).neq("id", tid).then(unwrap);
  await supa.from("jadwal_template").update({ aktif: true, aktif_sejak: hari }).eq("id", tid).then(unwrap);
}
async function jsuAktifkan() {
  if (!_jsuBoleh()) return toast("Khusus Admin / Kepala", "err");
  const rows = _jsuBarisDB(), b = _jsuBentrok();
  if (!rows.length) return toast("Draf masih kosong. Susun dulu di langkah 🗓️ Susun.", "err");
  if (b.n && !(await konfirmasiTema(`Masih ada ${b.n} jam yang gurunya bentrok. Tetap aktifkan?`, { judul: "Masih Ada Bentrok", teksYa: "Tetap Aktifkan", bahaya: true }))) return;
  if (!(await konfirmasiTema(`Aktifkan "${_jsuE(JSU.d.nama)}" sekarang?\n\n${rows.length} baris jadwal baru akan dipakai mulai hari ini untuk absensi dan jurnal. Jadwal lama dinonaktifkan dan tetap tersimpan di Riwayat.`, { judul: "Aktifkan Jadwal", teksYa: "Aktifkan", ikon: "✅" }))) return;
  if (JSU.antre) { clearTimeout(JSU.t); await _jsuKirim(); }
  setGlobalLoading(true, "Menerapkan jadwal baru…");
  try {
    const [t] = await supa.from("jadwal_template").insert({ nama: JSU.d.nama, tahun_ajaran: JSU.d.ta || null, semester: JSU.d.sem || null, aktif: false, ruang_id: STATE.ruang }).select().then(unwrap);
    const isi = rows.map((x) => ({ ...x, template_id: t.id, aktif: false, ruang_id: STATE.ruang }));
    for (let i = 0; i < isi.length; i += 200) await supa.from("jadwal_pelajaran").insert(isi.slice(i, i + 200)).then(unwrap);
    await _jsuGantiAktif(t.id);
    _jsuSimpan({ templateId: t.id, diterapkan: new Date().toISOString() }, true);
    if (typeof _rgLog === "function") _rgLog("aktifkan-jadwal", { nama: JSU.d.nama, baris: rows.length });
    JSU.tmpl = await supa.from("jadwal_template").select("*").order("created_at", { ascending: false }).then((r) => r.data || []);
    toast(`Jadwal "${JSU.d.nama}" aktif ✓ (${rows.length} baris)`, "ok");
  } catch (e) { toast("Gagal menerapkan: " + (e.message || e), "err"); console.error(e); }
  finally { setGlobalLoading(false); jsuGambar(); }
}
async function jsuAktifkanLagi(tid) {
  const t = JSU.tmpl.find((x) => x.id === tid); if (!t) return;
  if (!(await konfirmasiTema(`Aktifkan kembali "${_jsuE(t.nama)}"? Jadwal yang berlaku sekarang dinonaktifkan dan tetap tersimpan di Riwayat.`, { judul: "Aktifkan Lagi", teksYa: "Aktifkan" }))) return;
  setGlobalLoading(true, "Mengaktifkan jadwal…");
  try { await _jsuGantiAktif(tid); JSU.tmpl = await supa.from("jadwal_template").select("*").order("created_at", { ascending: false }).then((r) => r.data || []); toast("Jadwal diaktifkan kembali ✓", "ok"); }
  catch (e) { toast("Gagal: " + (e.message || e), "err"); }
  finally { setGlobalLoading(false); jsuGambar(); }
}

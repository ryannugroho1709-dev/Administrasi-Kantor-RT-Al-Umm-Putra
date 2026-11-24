// ============================================================
//  SOP PKBM AL-UMM — SOP Induk (Pengelola), SOP & Tugas tiap jenjang, Baca & Paham,
//  Ceklis Tugas PJ per periode, Pengingat bertahap (Kenal → Pengingat → Berjalan), Capaian SOP,
//  dan sambungan ke Kantor Maya PKBM (kartu petugas + rapat "SOP & Capaian Tugas").
//  Penyimpanan (ruang "*", lewat kv_gabung_umum — digabung, tidak menimpa):
//    bosp:sop:induk          { kode: {ringkas, bagian, rutin, diubah, oleh} }   (perubahan atas SOP bawaan)
//    bosp:sop:baca           { "guruId|kode": {t} }
//    bosp:sop:atur           { tahap:{kode}, mulai:{kode}, libur:[0..6], pj:{"kode@R": [ids]} }
//    bosp:sop:ceklis:YYYY-MM:<guruId> { "guruId|kode@R|periode|butir": {t, cat} }  + bosp:sop:ceklis:panjang:<guruId>
//      (satu baris per orang per bulan → tiap centang hanya mengirim/menerima data milik orang itu, hemat kuota)
// ============================================================
const SOP = { siap: false, t: 0, induk: {}, baca: {}, atur: {}, ceklis: {}, pj: {}, guru: [], tab: "saya", ember: {} };
const SOP_RG = ["A", "Pa", "Pi"];
const SOP_FREK = { harian: "Harian", pekanan: "Pekanan", bulanan: "Bulanan", semesteran: "Semesteran", tahunan: "Tahunan", jadwal: "Sesuai Jadwal" };
const SOP_TAHAP = {
  kenal: ["Kenal", "Baca & pahami SOP. Ceklis boleh dicoba, belum ada pengingat dan belum dihitung."],
  pengingat: ["Pengingat", "Aplikasi mengingatkan tugas tiap hari. Capaian dicatat, tanpa tanda peringatan."],
  berjalan: ["Berjalan", "SOP berlaku penuh: capaian dihitung dan dibahas di rapat."],
};
const SOP_HARI = ["Ahad", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const SOP_BLN = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
// gabung lokal persis seperti kv_gabung_umum (null = hapus, objek digabung satu tingkat)
function _sopGabung(lama, pot) { const h = { ...(lama || {}) }; Object.entries(pot).forEach(([k, v]) => { if (v === null) delete h[k]; else if (v && typeof v === "object" && !Array.isArray(v) && h[k] && typeof h[k] === "object" && !Array.isArray(h[k])) h[k] = { ...h[k], ...v }; else h[k] = v; }); return h; }
async function _sopTulis(kunci, pot) { await _bspGabungUmum(kunci, pot); return pot; }
const _sopE = (s) => escapeHtml(String(s == null ? "" : s));
const _sopTgl = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const _sopNamaRg = (r) => ({ A: "Paket A", Pa: "Paket B & C Putra", Pi: "Paket B & C Putri" }[r] || r);
const _sopPendekRg = (r) => ({ A: "Paket A", Pa: "Putra", Pi: "Putri" }[r] || r);

// ── Periode ──
function _sopSenin(d) { const x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return x; }
function sopPeriode(frek, d = new Date()) {
  if (frek === "harian") return _sopTgl(d);
  if (frek === "pekanan") return "P" + _sopTgl(_sopSenin(d));
  if (frek === "bulanan" || frek === "jadwal") return _sopTgl(d).slice(0, 7);
  const tp = d.getMonth() >= 6 ? d.getFullYear() : d.getFullYear() - 1;
  if (frek === "semesteran") return `TP${tp}-S${d.getMonth() >= 6 ? 1 : 2}`;
  return `TP${tp}`;
}
function _sopEmber(per) { if (/^\d{4}-\d{2}/.test(per)) return per.slice(0, 7); if (/^P\d{4}-\d{2}/.test(per)) return per.slice(1, 8); return "panjang"; }
function sopLabelPeriode(frek, d = new Date()) {
  if (frek === "harian") return `Hari ini, ${SOP_HARI[d.getDay()]} ${d.getDate()} ${SOP_BLN[d.getMonth()].slice(0, 3)}`;
  if (frek === "pekanan") { const s = _sopSenin(d), a = new Date(s); a.setDate(s.getDate() + 6); return `Pekan ${s.getDate()} ${SOP_BLN[s.getMonth()].slice(0, 3)} – ${a.getDate()} ${SOP_BLN[a.getMonth()].slice(0, 3)}`; }
  if (frek === "bulanan" || frek === "jadwal") return `${SOP_BLN[d.getMonth()]} ${d.getFullYear()}`;
  const tp = d.getMonth() >= 6 ? d.getFullYear() : d.getFullYear() - 1;
  if (frek === "semesteran") return `Semester ${d.getMonth() >= 6 ? "Ganjil" : "Genap"} ${tp}/${tp + 1}`;
  return `Tahun Pelajaran ${tp}/${tp + 1}`;
}
const sopLibur = (d = new Date()) => ((SOP.atur.libur || [0]).includes(d.getDay()));

// ── Isi SOP (bawaan + perubahan) ──
function sopJab(kode) { const b = SOP_BAWAAN.jabatan[kode] || {}; const u = SOP.induk[kode] || {}; return { ...b, ...u, kode, nama: b.nama || kode, tingkat: b.tingkat, ikon: b.ikon || "📘", bagian: u.bagian || b.bagian || [], rutin: u.rutin || b.rutin || [] }; }
const sopTahap = (kode) => ((SOP.atur.tahap || {})[kode] || "kenal");
const sopKunciSemua = () => SOP_BAWAAN.urut.flatMap((k) => (SOP_BAWAAN.jabatan[k].tingkat === "jenjang" ? SOP_RG.map((r) => k + "@" + r) : [k]));
const sopNamaTugas = (key) => { const [k, r] = key.split("@"); const j = sopJab(k); return r ? `${k === "peny" ? "Penyelenggara" : k === "admin" ? "Admin" : k === "bendjenjang" ? "Bendahara" : j.nama} ${_sopNamaRg(r)}` : j.nama; };
const sopNamaGuru = (id) => { const g = SOP.guru.find((x) => x.id === id); return g ? g.nama : "—"; };

// ── Muat data ──
async function _sopKv(kunci) { const r = await supaSemua.from("kuliah_pengaturan").select("kunci,nilai").eq("ruang_id", "*").in("kunci", kunci); const m = {}; (r.data || []).forEach((x) => { m[x.kunci] = x.nilai || {}; }); return m; }
async function sopMuat(paksa) {
  if (!paksa && SOP.siap && Date.now() - SOP.t < 60000) return SOP;
  const now = new Date(), b1 = _sopTgl(now).slice(0, 7), b0 = _sopTgl(new Date(now.getFullYear(), now.getMonth() - 1, 1)).slice(0, 7);
  const g = STATE.guruId || "-", k = ["bosp:sop:induk", "bosp:sop:baca", "bosp:sop:atur", `bosp:sop:ceklis:${b1}:${g}`, `bosp:sop:ceklis:${b0}:${g}`, `bosp:sop:ceklis:panjang:${g}`];
  const [m] = await Promise.all([_sopKv(k), _sopMuatPj()]);
  SOP.induk = m[k[0]] || {}; SOP.baca = m[k[1]] || {}; SOP.atur = m[k[2]] || {};
  const lain = Object.fromEntries(Object.entries(SOP.ceklis).filter(([x]) => !x.startsWith(g + "|")));
  SOP.ceklis = { ...lain, ...(m[k[4]] || {}), ...(m[k[3]] || {}), ...(m[k[5]] || {}) };
  _sopHitungPj(); SOP.siap = true; SOP.t = Date.now(); return SOP;
}
// ceklis semua orang (hanya untuk Capaian, Kantor Maya, dan rapat) — disimpan sementara 2 menit
async function _sopMuatEmber(ym) {
  const c = SOP.ember[ym]; if (c && Date.now() - c.t < 120000) return c.d;
  const [a, p] = await Promise.all([ym, "panjang"].map((x) => supaSemua.from("kuliah_pengaturan").select("nilai").eq("ruang_id", "*").like("kunci", `bosp:sop:ceklis:${x}:%`)));
  const d = {}; [a, p].forEach((r) => (r.data || []).forEach((x) => Object.assign(d, x.nilai || {})));
  SOP.ember[ym] = { t: Date.now(), d }; Object.assign(SOP.ceklis, d); return d;
}
async function _sopMuatEmberKini() { const now = new Date(); await Promise.all([_sopTgl(now).slice(0, 7), _sopTgl(new Date(now.getFullYear(), now.getMonth() - 1, 1)).slice(0, 7)].map(_sopMuatEmber)); }
async function _sopMuatPj() {
  const aman = (p) => p.then((r) => r, () => ({ data: null }));
  const [g, jm, gj, bend, peny, kt, mus] = await Promise.all([
    supaSemua.from("guru").select("id,nama,foto_url,ruang,ruang_utama,ruang_pendamping,status_aktif,wali_kelas_id").eq("status_aktif", true),
    aman(supaSemua.from("jabatan_master").select("id,kode,nama")),
    aman(supaSemua.from("guru_jabatan").select("guru_id,jabatan_id,ruang_id")),
    aman(supaSemua.from("kuliah_pengaturan").select("nilai").eq("kunci", "bosp:bendahara").eq("ruang_id", "*").maybeSingle()),
    aman(supaSemua.from("kuliah_pengaturan").select("ruang_id,nilai").eq("kunci", "penyelenggara")),
    aman(supaSemua.from("kuliah_pengaturan").select("nilai").eq("kunci", "bosp:kantor:atur").eq("ruang_id", "*").maybeSingle()),
    aman(supaSemua.from("musyrif_penugasan").select("guru_id").eq("aktif", true)),
  ]);
  SOP._mentah = { guru: g.data || [], jab: jm.data || [], pegang: gj.data || [], bend: (bend.data && bend.data.nilai && bend.data.nilai.ids) || [], peny: peny.data || [], ktPeran: ((kt.data && kt.data.nilai) || {}).peran || {}, mus: (mus.data || []).map((x) => x.guru_id) };
  SOP.guru = SOP._mentah.guru;
}
function _sopHitungPj() {
  const M = SOP._mentah || { guru: [], jab: [], pegang: [], bend: [], peny: [], ktPeran: {}, mus: [] };
  const guru = M.guru, ada = (id) => guru.some((x) => x.id === id), uniq = (a) => [...new Set(a)].filter(ada);
  const olehJ = (rx, ruang) => uniq(M.pegang.filter((p) => { const j = M.jab.find((x) => x.id === p.jabatan_id); return j && rx.test(j.kode + " " + j.nama) && (ruang === undefined || (ruang === null ? !p.ruang_id || p.ruang_id === "Pg" || p.ruang_id === "*" : p.ruang_id === ruang)); }).map((p) => p.guru_id));
  const adminUtama = (id) => { const x = guru.find((g) => g.id === id); const n = (s) => String(s || "").replace(/^(ustadzah?|ust\.?)\s+/i, "").trim().toLowerCase(); return !!(x && (window.ADMIN_NAMES || ["Ryan Nugroho"]).some((a) => n(a) === n(x.nama))); };
  const milikRg = (x, r) => x.ruang_utama === r || ((x.ruang || []).length === 1 && x.ruang[0] === r) || (!x.ruang_utama && (x.ruang || []).includes(r));
  const p = {};
  p.kepala = olehJ(/kepala_pkbm|kepala pkbm/i).slice(0, 1);
  p.sekretaris = olehJ(/sekretaris|tata usaha/i).slice(0, 1);
  p.dapodik = olehJ(/dapodik|operator/i).slice(0, 1);
  p.bendahara = uniq(M.bend); if (!p.bendahara.length) p.bendahara = olehJ(/bendahara/i, null).slice(0, 1);
  SOP_RG.forEach((r) => {
    const ids = uniq(((M.peny.find((x) => x.ruang_id === r) || {}).nilai || {}).ids || []);
    p["peny@" + r] = (ids.length ? ids : olehJ(/kepala_sekolah|kepala sekolah|penyelenggara/i, r)).slice(0, 1);
    p["admin@" + r] = uniq(olehJ(/^admin\b|\badmin$/i, r).concat(guru.filter((x) => (x.ruang_pendamping || []).includes(r)).map((x) => x.id))).filter((id) => !adminUtama(id));
    p["bendjenjang@" + r] = olehJ(/bendahara/i, r);
    p["walikelas@" + r] = uniq(guru.filter((x) => x.wali_kelas_id && milikRg(x, r)).map((x) => x.id));
    p["musyrif@" + r] = uniq(M.mus.concat(olehJ(/musyrif/i, r)).filter((id) => { const x = guru.find((g) => g.id === id); return x && milikRg(x, r); }));
    p["tutor@" + r] = uniq(guru.filter((x) => (x.ruang || []).includes(r)).map((x) => x.id));
  });
  // pengaturan Kantor Maya (⚙️ peran) ikut dipakai, lalu pengaturan PJ di SOP menimpa semuanya
  const petaKt = { kepala: "kepala", sekretaris: "sekretaris", dapodik: "dapodik", bendahara: "bendahara", "peny-A": "peny@A", "peny-Pa": "peny@Pa", "peny-Pi": "peny@Pi", "admin-A": "admin@A", "admin-Pa": "admin@Pa", "admin-Pi": "admin@Pi" };
  Object.entries(M.ktPeran || {}).forEach(([k, ids]) => { if (petaKt[k] && Array.isArray(ids) && ids.length) p[petaKt[k]] = uniq(ids); });
  p.arkas = p.bendahara.slice();
  Object.entries(SOP.atur.pj || {}).forEach(([k, ids]) => { if (Array.isArray(ids)) p[k] = uniq(ids); });
  SOP.pj = p;
}
const sopTugasDari = (gid) => sopKunciSemua().filter((k) => (SOP.pj[k] || []).includes(gid));
function sopBolehAtur() { if (typeof isAdmin === "function" && isAdmin() && !(typeof isAdminKedua === "function" && isAdminKedua())) return true; return (SOP.pj.kepala || []).includes(STATE.guruId); }
function sopBolehCapaian(r) {
  if (sopBolehAtur() || (SOP.pj.sekretaris || []).includes(STATE.guruId)) return true;
  if (!r) return false;
  return (SOP.pj["peny@" + r] || []).includes(STATE.guruId) || (SOP.pj["admin@" + r] || []).includes(STATE.guruId);
}

// ── Status & capaian ──
const _sopKunciCek = (gid, key, per, i) => `${gid}|${key}|${per}|${i}`;
function sopButirKini(gid, key, d = new Date()) {
  const j = sopJab(key.split("@")[0]);
  return j.rutin.map(([f, teks], i) => { const per = sopPeriode(f, d); const c = SOP.ceklis[_sopKunciCek(gid, key, per, i)]; return { i, f, teks, per, cek: c || null, libur: f === "harian" && sopLibur(d) }; });
}
function sopCapaian(gid, key, ym, data) {
  const kode = key.split("@")[0], j = sopJab(kode), now = new Date();
  const [y, m] = ym.split("-").map(Number), awal = new Date(y, m - 1, 1), akhirBln = new Date(y, m, 0);
  const mulaiStr = (SOP.atur.mulai || {})[kode]; const mulai = mulaiStr ? new Date(mulaiStr + "T00:00:00") : awal;
  const dari = mulai > awal ? mulai : awal, sampai = akhirBln < now ? akhirBln : now;
  let harap = 0, sudah = 0; if (dari > sampai) return { harap: 0, sudah: 0, persen: null };
  const isi = data || SOP.ceklis;
  j.rutin.forEach(([f], i) => {
    if (f === "harian") { for (let d = new Date(dari); d <= sampai; d.setDate(d.getDate() + 1)) { if (sopLibur(d)) continue; harap++; if (isi[_sopKunciCek(gid, key, _sopTgl(d), i)]) sudah++; } }
    else if (f === "pekanan") { const lihat = new Set(); for (let d = new Date(dari); d <= sampai; d.setDate(d.getDate() + 1)) { const s = _sopSenin(d); if (s.getMonth() !== m - 1) continue; const per = "P" + _sopTgl(s); if (lihat.has(per)) continue; lihat.add(per); harap++; if (isi[_sopKunciCek(gid, key, per, i)]) sudah++; } }
    else if (f === "bulanan") { harap++; if (isi[_sopKunciCek(gid, key, ym, i)]) sudah++; }
  });
  return { harap, sudah, persen: harap ? Math.round((sudah / harap) * 100) : null };
}
const sopSudahBaca = (gid, kode) => { const b = SOP.baca[gid + "|" + kode]; if (!b) return false; const u = SOP.induk[kode]; return !(u && u.diubah && new Date(u.diubah).getTime() > b.t); };
const _sopWarnaPersen = (p) => (p == null ? "#94a3b8" : p >= 80 ? "#16a34a" : p >= 50 ? "#d97706" : "#dc2626");

// ── Halaman ──
const _sopKeyHal = () => (STATE.ruang === "Pg" ? "pg-sop" : "sop");
async function sopBuka(tab) {
  if (tab) SOP.tab = tab;
  const sec = _rgBukaHal(_sopKeyHal(), "SOP & Tugas", `<div class="card"><div class="rg-memuat">Memuat SOP…</div></div>`);
  try { await sopMuat(); } catch (e) { sec.innerHTML = `<div class="card">Gagal memuat SOP: ${_sopE(e.message)}</div>`; return; }
  _sopRender(sec);
}
function _sopRender(sec) {
  sec = sec || document.getElementById("page-rg"); if (!sec) return;
  const r = STATE.ruang !== "Pg" ? STATE.ruang : null;
  const tabs = [["saya", "Tugas Saya"], ["sop", r ? "SOP Jenjang" : "SOP Semua Jabatan"], ["pj", "Penanggung Jawab"]];
  if (sopBolehCapaian(r)) tabs.push(["capaian", "Capaian SOP"]);
  if (sopBolehAtur()) tabs.push(["atur", "Pengaturan"]);
  if (!tabs.some((x) => x[0] === SOP.tab)) SOP.tab = "saya";
  const isi = { saya: _sopHtmlSaya, sop: () => _sopHtmlDaftar(r), pj: () => _sopHtmlPj(r), capaian: () => _sopHtmlCapaian(r), atur: _sopHtmlAtur }[SOP.tab]();
  sec.innerHTML = `<div class="sop-wrap"><div class="rg-tab sop-tab">${tabs.map(([k, n]) => `<button class="${SOP.tab === k ? "aktif" : ""}" onclick="sopBuka('${k}')">${n}</button>`).join("")}</div>${isi}</div>`;
}
function _sopBadgeTahap(kode) { const t = sopTahap(kode); return `<span class="sop-tahap sop-t-${t}" title="${_sopE(SOP_TAHAP[t][1])}">${SOP_TAHAP[t][0]}</span>`; }

// Tugas Saya: Baca & Paham + ceklis periode berjalan
function _sopHtmlSaya() {
  const gid = STATE.guruId, tugas = sopTugasDari(gid), now = new Date();
  if (!tugas.length) return `<div class="card sop-kosong"><div class="sop-ikon-besar">📘</div><h3>Belum ada tugas SOP untuk Anda</h3><p>Penanggung jawab ditentukan dari jabatan di Data Guru. Bila keliru, sampaikan ke Kepala PKBM atau Admin utama.</p></div>`;
  const kodeUnik = [...new Set(tugas.map((k) => k.split("@")[0]))];
  const belumBaca = kodeUnik.filter((k) => !sopSudahBaca(gid, k));
  let h = `<div class="card sop-intro"><b>Assalamu'alaikum, ${_sopE(STATE.guruNama || "")}</b><p>Anda penanggung jawab: ${tugas.map((k) => `<span class="sop-chip">${_sopE(sopNamaTugas(k))}</span>`).join(" ")}</p>
    ${belumBaca.length ? `<p class="sop-catatan">📖 Mohon baca & pahami SOP: <b>${belumBaca.map((k) => _sopE(sopJab(k).nama)).join(", ")}</b>, lalu tekan <b>Saya Sudah Membaca & Memahami</b>.</p>` : `<p class="sop-ok">✓ Semua SOP Anda sudah dibaca. Jazakumullahu khairan.</p>`}
    ${sopLibur(now) ? `<p class="sop-catatan">Hari ini hari libur — tugas harian tidak dihitung.</p>` : ""}</div>`;
  tugas.forEach((key) => {
    const kode = key.split("@")[0], j = sopJab(kode), t = sopTahap(kode), butir = sopButirKini(gid, key, now);
    const per = {}; butir.forEach((b) => (per[b.f] = per[b.f] || []).push(b));
    const cap = t === "kenal" ? null : sopCapaian(gid, key, _sopTgl(now).slice(0, 7));
    h += `<div class="card sop-kartu"><div class="sop-kartu-kepala"><span class="sop-ikon">${j.ikon}</span><div><b>${_sopE(sopNamaTugas(key))}</b><small>${_sopE(j.ringkas || "")}</small></div>${_sopBadgeTahap(kode)}</div>
      ${cap && cap.persen != null ? `<div class="sop-bar"><i style="width:${cap.persen}%;background:${_sopWarnaPersen(t === "berjalan" ? cap.persen : 90)}"></i><span>Capaian bulan ini ${cap.persen}% (${cap.sudah}/${cap.harap})</span></div>` : ""}
      ${Object.keys(SOP_FREK).filter((f) => per[f]).map((f) => `<div class="sop-frek"><div class="sop-frek-judul">${SOP_FREK[f]} <small>${_sopE(sopLabelPeriode(f, now))}</small></div>
        ${per[f].map((b) => `<label class="sop-butir ${b.cek ? "sudah" : ""} ${b.libur ? "libur" : ""}"><input type="checkbox" ${b.cek ? "checked" : ""} ${b.libur ? "disabled" : ""} onchange="sopCentang('${key}',${b.i},this)"><span>${_sopE(b.teks)}${b.cek && b.cek.cat ? `<em>📝 ${_sopE(b.cek.cat)}</em>` : ""}</span>${b.cek ? `<button class="sop-cat" title="Tambah catatan" onclick="event.preventDefault();sopCatatan('${key}',${b.i})">📝</button>` : ""}</label>`).join("")}</div>`).join("")}
      <details class="sop-detail"><summary>📖 Baca SOP ${_sopE(j.nama)}</summary>${_sopHtmlIsi(j)}</details>
      <div class="sop-baca">${sopSudahBaca(gid, kode) ? `<span class="sop-ok">✓ Sudah dibaca & dipahami (${new Date(SOP.baca[gid + "|" + kode].t).toLocaleDateString("id-ID")})</span>` : `<button class="btn btn-primary btn-sm" onclick="sopTandaiBaca('${kode}')">✓ Saya Sudah Membaca & Memahami</button>${SOP.baca[gid + "|" + kode] ? `<small class="sop-catatan">SOP ini diperbarui, mohon dibaca ulang.</small>` : ""}`}</div></div>`;
  });
  return h;
}
function _sopHtmlIsi(j) {
  return `<div class="sop-isi">${(j.bagian || []).map(([jd, butir], n) => `<h4>${n + 1}. ${_sopE(jd)}</h4><ul>${(butir || []).map((x) => `<li>${_sopE(x)}</li>`).join("")}</ul>`).join("")}
    <h4>Tugas Rutin</h4><table class="sop-tabel"><tbody>${(j.rutin || []).map(([f, t]) => `<tr><td>${SOP_FREK[f] || f}</td><td>${_sopE(t)}</td></tr>`).join("")}</tbody></table></div>`;
}
async function sopCentang(key, i, el) {
  const gid = STATE.guruId, f = (sopJab(key.split("@")[0]).rutin[i] || [])[0]; if (!f) return;
  const per = sopPeriode(f), k = _sopKunciCek(gid, key, per, i), lama = SOP.ceklis[k] || null, baru = lama ? null : { t: Date.now() };
  if (baru) SOP.ceklis[k] = baru; else delete SOP.ceklis[k];
  const lbl = el && el.closest("label"); if (lbl) lbl.classList.toggle("sudah", !!baru);
  try { await _bspGabungUmum(`bosp:sop:ceklis:${_sopEmber(per)}:${gid}`, { [k]: baru }); const e = SOP.ember[_sopEmber(per)]; if (e) { if (baru) e.d[k] = baru; else delete e.d[k]; } if (typeof _sopSegarBadge === "function") _sopSegarBadge(); }
  catch (e) { if (lama) SOP.ceklis[k] = lama; else delete SOP.ceklis[k]; if (el) el.checked = !!lama; if (lbl) lbl.classList.toggle("sudah", !!lama); toast("Gagal menyimpan ceklis: " + (e.message || e), "err"); }
}
async function sopCatatan(key, i) {
  const f = (sopJab(key.split("@")[0]).rutin[i] || [])[0], per = sopPeriode(f), k = _sopKunciCek(STATE.guruId, key, per, i), c = SOP.ceklis[k]; if (!c) return;
  const cat = prompt("Catatan singkat (misal: laporan sudah dikirim ke grup WA):", c.cat || ""); if (cat === null) return;
  const baru = { ...c, cat: cat.trim().slice(0, 200) };
  try { await _bspGabungUmum(`bosp:sop:ceklis:${_sopEmber(per)}:${STATE.guruId}`, { [k]: baru }); SOP.ceklis[k] = baru; _sopRender(); } catch (e) { toast("Gagal menyimpan catatan: " + (e.message || e), "err"); }
}
async function sopTandaiBaca(kode) {
  const k = STATE.guruId + "|" + kode, v = { t: Date.now(), n: STATE.guruNama || "" };
  try { await _bspGabungUmum("bosp:sop:baca", { [k]: v }); SOP.baca[k] = v; toast("Jazakallahu khairan, tercatat sudah dibaca", "ok"); _sopRender(); }
  catch (e) { toast("Gagal menyimpan: " + (e.message || e), "err"); }
}

// SOP Jenjang / Semua Jabatan (baca) + ubah (Kepala/Admin utama)
function _sopHtmlDaftar(r) {
  const boleh = sopBolehAtur();
  const kode = SOP_BAWAAN.urut.filter((k) => !r || SOP_BAWAAN.jabatan[k].tingkat === "jenjang");
  let h = `<div class="card sop-intro"><b>${r ? `SOP ${_sopE(_sopNamaRg(r))}` : "SOP Induk PKBM Al-Umm Barabai"}</b><p>${r ? "SOP jabatan di jenjang ini. SOP tingkat PKBM ada di Ruang Pengelola → SOP Induk." : "Isi SOP berlaku untuk semua jenjang."}${boleh ? " Anda dapat mengubah isi SOP." : ""}</p></div>`;
  kode.forEach((k) => {
    const j = sopJab(k), keys = j.tingkat === "jenjang" ? (r ? [k + "@" + r] : SOP_RG.map((x) => k + "@" + x)) : [k];
    const pj = keys.map((key) => `${r || j.tingkat !== "jenjang" ? "" : `<small>${_sopPendekRg(key.split("@")[1])}:</small> `}${(SOP.pj[key] || []).length ? (SOP.pj[key] || []).slice(0, k === "tutor" ? 3 : 9).map(sopNamaGuru).map(_sopE).join(", ") + (k === "tutor" && SOP.pj[key].length > 3 ? ` +${SOP.pj[key].length - 3}` : "") : "<i>belum ada</i>"}`).join(" · ");
    h += `<details class="card sop-jab"><summary><span class="sop-ikon">${j.ikon}</span><div><b>${_sopE(j.nama)}</b><small>PJ: ${pj}</small></div>${_sopBadgeTahap(k)}</summary>
      <p class="sop-ringkas">${_sopE(j.ringkas || "")}</p>${_sopHtmlIsi(j)}
      ${boleh ? `<div class="sop-aksi"><button class="btn btn-secondary btn-sm" onclick="sopUbah('${k}')">✏️ Ubah SOP Ini</button>${SOP.induk[k] ? `<small>Diubah ${new Date(SOP.induk[k].diubah).toLocaleDateString("id-ID")}${SOP.induk[k].oleh ? " oleh " + _sopE(SOP.induk[k].oleh) : ""}</small>` : ""}</div>` : ""}</details>`;
  });
  return h;
}
function sopUbah(kode) {
  const j = sopJab(kode), sec = document.getElementById("page-rg");
  const baris = (f, t) => `<div class="sop-rt"><select>${Object.entries(SOP_FREK).map(([k, n]) => `<option value="${k}" ${k === f ? "selected" : ""}>${n}</option>`).join("")}</select><input value="${_sopE(t)}" placeholder="Tugas rutin"><button class="btn btn-sm" onclick="this.parentElement.remove()">✕</button></div>`;
  const bagian = (jd, b) => `<div class="sop-bg"><div class="sop-bg-kepala"><input value="${_sopE(jd)}" placeholder="Judul bagian"><button class="btn btn-sm" onclick="this.closest('.sop-bg').remove()">✕</button></div><textarea rows="4" placeholder="Satu butir per baris">${_sopE((b || []).join("\n"))}</textarea></div>`;
  window._sopTplRt = baris("harian", ""); window._sopTplBg = bagian("", []);
  sec.innerHTML = `<div class="sop-wrap"><div class="card sop-edit"><h3>${j.ikon} Ubah SOP ${_sopE(j.nama)}</h3>
    <label>Ringkasan tugas</label><textarea id="sop-e-ringkas" rows="2">${_sopE(j.ringkas || "")}</textarea>
    <label>Uraian tugas (per bagian)</label><div id="sop-e-bagian">${j.bagian.map(([jd, b]) => bagian(jd, b)).join("")}</div>
    <button class="btn btn-secondary btn-sm" onclick="document.getElementById('sop-e-bagian').insertAdjacentHTML('beforeend',window._sopTplBg)">+ Tambah Bagian</button>
    <label>Tugas rutin (menjadi Ceklis Tugas PJ)</label><div id="sop-e-rutin">${j.rutin.map(([f, t]) => baris(f, t)).join("")}</div>
    <button class="btn btn-secondary btn-sm" onclick="document.getElementById('sop-e-rutin').insertAdjacentHTML('beforeend',window._sopTplRt)">+ Tambah Tugas Rutin</button>
    <p class="sop-catatan">Mengubah urutan tugas rutin dapat menggeser ceklis periode yang sedang berjalan. Setelah disimpan, para PJ diminta membaca ulang.</p>
    <div class="sop-aksi"><button class="btn btn-primary" onclick="sopSimpanUbah('${kode}')">💾 Simpan SOP</button><button class="btn btn-secondary" onclick="sopBuka('sop')">Batal</button>${SOP.induk[kode] ? `<button class="btn btn-secondary" onclick="sopKembalikan('${kode}')">↺ Kembalikan ke Bawaan</button>` : ""}</div></div></div>`;
  window.scrollTo(0, 0);
}
async function sopSimpanUbah(kode) {
  if (!sopBolehAtur()) return toast("Khusus Kepala PKBM / Admin utama", "err");
  const bagian = [...document.querySelectorAll("#sop-e-bagian .sop-bg")].map((d) => [d.querySelector("input").value.trim(), d.querySelector("textarea").value.split("\n").map((x) => x.trim()).filter(Boolean)]).filter(([jd, b]) => jd || b.length);
  const rutin = [...document.querySelectorAll("#sop-e-rutin .sop-rt")].map((d) => [d.querySelector("select").value, d.querySelector("input").value.trim()]).filter(([, t]) => t);
  const v = { ringkas: document.getElementById("sop-e-ringkas").value.trim(), bagian, rutin, diubah: new Date().toISOString(), oleh: STATE.guruNama || "" };
  try { await _sopTulis("bosp:sop:induk", { [kode]: v }); SOP.induk = _sopGabung(SOP.induk, { [kode]: v }); toast("SOP tersimpan", "ok"); if (typeof _rgLog === "function") _rgLog("ubah-sop", { kode }); sopBuka("sop"); }
  catch (e) { toast("Gagal menyimpan: " + (e.message || e), "err"); }
}
async function sopKembalikan(kode) {
  if (!confirm("Kembalikan SOP ini ke isi bawaan?")) return;
  try { await _bspGabungUmum("bosp:sop:induk", { [kode]: null }); delete SOP.induk[kode]; toast("Dikembalikan ke bawaan", "ok"); sopBuka("sop"); } catch (e) { toast("Gagal: " + (e.message || e), "err"); }
}

// Penanggung Jawab
function _sopHtmlPj(r) {
  const boleh = sopBolehAtur(), keys = sopKunciSemua().filter((k) => !r || !k.includes("@") || k.endsWith("@" + r));
  return `<div class="card"><h3 style="margin-top:0">Penanggung Jawab (PJ) SOP</h3><p class="rg-ket">Otomatis dari jabatan di Data Guru, pengaturan Bendahara BOSP, Penyelenggara, dan ⚙️ Kantor Maya.${boleh ? " Tekan Ubah untuk menetapkan sendiri (misal Bendahara Putri menyusul)." : ""}</p>
    <table class="sop-tabel sop-pj"><thead><tr><th>Jabatan</th><th>Penanggung Jawab</th><th>Sudah Baca</th>${boleh ? "<th></th>" : ""}</tr></thead><tbody>
    ${keys.map((k) => { const ids = SOP.pj[k] || [], kode = k.split("@")[0], baca = ids.filter((id) => sopSudahBaca(id, kode)).length, man = !!(SOP.atur.pj || {})[k];
      return `<tr><td>${sopJab(kode).ikon} ${_sopE(sopNamaTugas(k))}</td><td>${ids.length ? ids.map(sopNamaGuru).map(_sopE).join(", ") : `<i class="sop-redup">belum ada${kode === "bendjenjang" && k.endsWith("@Pi") ? " (menyusul)" : ""}</i>`}${man ? ` <small class="sop-chip">diatur</small>` : ""}</td><td>${ids.length ? `${baca}/${ids.length}` : "—"}</td>${boleh ? `<td><button class="btn btn-sm btn-secondary" onclick="sopUbahPj('${k}')">Ubah</button></td>` : ""}</tr>`; }).join("")}</tbody></table></div>`;
}
function sopUbahPj(key) {
  const ids = SOP.pj[key] || [], r = key.split("@")[1];
  const daftar = SOP.guru.filter((g) => !r || (g.ruang || []).includes(r) || ids.includes(g.id)).sort((a, b) => String(a.nama).localeCompare(String(b.nama)));
  const sec = document.getElementById("page-rg");
  sec.innerHTML = `<div class="sop-wrap"><div class="card sop-edit"><h3>PJ ${_sopE(sopNamaTugas(key))}</h3><p class="rg-ket">Centang penanggung jawab. Simpan kosong + "Pakai Otomatis" untuk kembali mengikuti jabatan.</p>
    <div class="sop-pilih">${daftar.map((g) => `<label><input type="checkbox" value="${g.id}" ${ids.includes(g.id) ? "checked" : ""}> ${_sopE(g.nama)}</label>`).join("")}</div>
    <div class="sop-aksi"><button class="btn btn-primary" onclick="sopSimpanPj('${key}')">💾 Simpan</button><button class="btn btn-secondary" onclick="sopSimpanPj('${key}',true)">Pakai Otomatis</button><button class="btn btn-secondary" onclick="sopBuka('pj')">Batal</button></div></div></div>`;
}
async function sopSimpanPj(key, otomatis) {
  if (!sopBolehAtur()) return toast("Khusus Kepala PKBM / Admin utama", "err");
  const ids = otomatis ? null : [...document.querySelectorAll(".sop-pilih input:checked")].map((x) => x.value);
  try { const pot = { pj: { [key]: ids } }; await _sopTulis("bosp:sop:atur", pot); SOP.atur = _sopGabung(SOP.atur, pot); _sopHitungPj(); toast("PJ tersimpan", "ok"); sopBuka("pj"); }
  catch (e) { toast("Gagal: " + (e.message || e), "err"); }
}

// Capaian SOP
function _sopHtmlCapaian(r) {
  const ym = SOP.capBulan || _sopTgl(new Date()).slice(0, 7), data = SOP.ember[ym] && SOP.ember[ym].d;
  if (!data) { _sopMuatEmber(ym).then(() => _sopRender(), (e) => toast("Gagal memuat capaian: " + (e.message || e), "err")); return `<div class="card"><div class="rg-memuat">Memuat capaian…</div></div>`; }
  const isi = data, opsi = [];
  for (let n = 0; n < 6; n++) { const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() - n); const v = _sopTgl(d).slice(0, 7); opsi.push(`<option value="${v}" ${v === ym ? "selected" : ""}>${SOP_BLN[d.getMonth()]} ${d.getFullYear()}</option>`); }
  const keys = sopKunciSemua().filter((k) => !r || !k.includes("@") || k.endsWith("@" + r));
  const semuaKenal = keys.every((k) => sopTahap(k.split("@")[0]) === "kenal");
  const baris = keys.map((k) => {
    const kode = k.split("@")[0], t = sopTahap(kode), ids = SOP.pj[k] || [];
    if (!ids.length) return "";
    const org = ids.map((id) => ({ id, c: sopCapaian(id, k, ym, isi), baca: sopSudahBaca(id, kode) }));
    const rata = org.filter((o) => o.c.persen != null); const p = rata.length ? Math.round(rata.reduce((a, o) => a + o.c.persen, 0) / rata.length) : null;
    return `<details class="sop-cap"><summary><span>${sopJab(kode).ikon} ${_sopE(sopNamaTugas(k))}</span>${_sopBadgeTahap(kode)}<span class="sop-cap-p" style="color:${t === "berjalan" ? _sopWarnaPersen(p) : "#64748b"}">${t === "kenal" ? "Tahap Kenal" : p == null ? "—" : p + "%"}</span></summary>
      <table class="sop-tabel"><tbody>${org.map((o) => `<tr><td>${_sopE(sopNamaGuru(o.id))}</td><td>${o.baca ? "✓ baca" : "<span class='sop-redup'>belum baca</span>"}</td><td>${o.c.persen == null ? "—" : `${o.c.persen}% <small>(${o.c.sudah}/${o.c.harap})</small>`}</td></tr>`).join("")}</tbody></table></details>`;
  }).join("");
  return `<div class="card"><div class="sop-cap-kepala"><h3 style="margin:0">Capaian SOP</h3><select onchange="SOP.capBulan=this.value;_sopRender()">${opsi.join("")}</select></div>
    <p class="rg-ket">Capaian = ceklis tugas harian (hari kerja), pekanan, dan bulanan yang sudah diisi PJ. Semesteran, tahunan, dan sesuai jadwal tidak dihitung persennya.${semuaKenal ? " <b>Semua SOP masih Tahap Kenal</b> — fokus pada membaca & memahami dulu." : ""}</p>${baris || "<p>Belum ada PJ.</p>"}</div>`;
}

// Pengaturan: tahap per jabatan, hari libur, rekap baca
function _sopHtmlAtur() {
  const libur = SOP.atur.libur || [0];
  return `<div class="card"><h3 style="margin-top:0">Tahap Penerapan SOP</h3><p class="rg-ket">Diterapkan bertahap: <b>Kenal</b> (baca & pahami) → <b>Pengingat</b> (diingatkan tiap hari, tanpa tanda peringatan) → <b>Berjalan</b> (dihitung & dibahas di rapat). Capaian dihitung sejak tanggal tahap diubah.</p>
    <div class="sop-aksi"><span>Ubah semua:</span>${Object.keys(SOP_TAHAP).map((t) => `<button class="btn btn-sm btn-secondary" onclick="sopSetTahap('*','${t}')">${SOP_TAHAP[t][0]}</button>`).join("")}</div>
    <table class="sop-tabel"><tbody>${SOP_BAWAAN.urut.map((k) => { const j = sopJab(k), t = sopTahap(k); return `<tr><td>${j.ikon} ${_sopE(j.nama)}</td><td><div class="sop-seg">${Object.keys(SOP_TAHAP).map((x) => `<button class="${x === t ? "aktif sop-t-" + x : ""}" onclick="sopSetTahap('${k}','${x}')">${SOP_TAHAP[x][0]}</button>`).join("")}</div>${(SOP.atur.mulai || {})[k] && t !== "kenal" ? `<small>sejak ${_sopE(SOP.atur.mulai[k])}</small>` : ""}</td></tr>`; }).join("")}</tbody></table></div>
    <div class="card"><h3 style="margin-top:0">Hari Libur Pekanan</h3><p class="rg-ket">Tugas harian tidak dihitung pada hari libur.</p><div class="sop-aksi">${SOP_HARI.map((n, i) => `<label class="sop-hari"><input type="checkbox" ${libur.includes(i) ? "checked" : ""} onchange="sopSetLibur(${i},this.checked)"> ${n}</label>`).join("")}</div></div>`;
}
async function sopSetTahap(kode, tahap) {
  if (!sopBolehAtur()) return toast("Khusus Kepala PKBM / Admin utama", "err");
  const kodes = kode === "*" ? SOP_BAWAAN.urut : [kode], tahapBaru = {}, mulai = {}, hari = _sopTgl(new Date());
  kodes.forEach((k) => { if (sopTahap(k) === tahap) return; tahapBaru[k] = tahap; if (tahap !== "kenal" && sopTahap(k) === "kenal") mulai[k] = hari; });
  if (!Object.keys(tahapBaru).length) return;
  try { const pot = Object.keys(mulai).length ? { tahap: tahapBaru, mulai } : { tahap: tahapBaru }; await _sopTulis("bosp:sop:atur", pot); SOP.atur = _sopGabung(SOP.atur, pot); toast("Tahap SOP diperbarui", "ok"); _sopRender(); }
  catch (e) { toast("Gagal: " + (e.message || e), "err"); }
}
async function sopSetLibur(i, on) {
  const s = new Set(SOP.atur.libur || [0]); if (on) s.add(i); else s.delete(i);
  try { const pot = { libur: [...s].sort() }; await _sopTulis("bosp:sop:atur", pot); SOP.atur = _sopGabung(SOP.atur, pot); } catch (e) { toast("Gagal: " + (e.message || e), "err"); }
}

// ── Pengingat harian (hanya tahap Pengingat/Berjalan; tahap Kenal cukup ajakan membaca) ──
function _sopBelumKini(gid) {
  const now = new Date(), hasil = [];
  sopTugasDari(gid).forEach((key) => { const kode = key.split("@")[0]; if (sopTahap(kode) === "kenal") return;
    sopButirKini(gid, key, now).forEach((b) => { if (!b.cek && !b.libur && ["harian", "pekanan", "bulanan"].includes(b.f)) hasil.push({ key, ...b }); }); });
  return hasil;
}
async function sopCekPengingat(malam) {
  try {
    if (!STATE.guruId || typeof RG === "undefined" || !RG.siap || document.getElementById("sop-ingat")) return;
    const gid = STATE.guruId, hari = _sopTgl(new Date()), lk = `sop:ingat${malam ? "2" : ""}:${gid}`;
    let sudah = ""; try { sudah = localStorage.getItem(lk) || ""; } catch (e) {}
    if (sudah === hari) return;
    await sopMuat(); _sopSegarBadge();
    const tugas = sopTugasDari(gid); if (!tugas.length) return;
    const kodeKenal = [...new Set(tugas.map((k) => k.split("@")[0]))].filter((k) => sopTahap(k) === "kenal" && !sopSudahBaca(gid, k));
    let belum = _sopBelumKini(gid); if (malam) belum = belum.filter((b) => b.f === "harian");
    if (malam && !belum.length) { try { localStorage.setItem(lk, hari); } catch (e) {} return; }
    if (!belum.length && !kodeKenal.length) { try { localStorage.setItem(lk, hari); } catch (e) {} return; }
    try { localStorage.setItem(lk, hari); } catch (e) {}
    const kelompok = {}; belum.forEach((b) => (kelompok[b.key] = kelompok[b.key] || []).push(b));
    const el = document.createElement("div"); el.id = "sop-ingat"; el.className = "sop-ingat";
    el.innerHTML = `<div class="sop-ingat-kotak"><div class="sop-ingat-kepala">📘 ${malam ? "Pengingat Malam" : "Pengingat Tugas SOP"}</div>
      ${kodeKenal.length ? `<p>Kenali SOP Anda: <b>${kodeKenal.map((k) => _sopE(sopJab(k).nama)).join(", ")}</b>. Mohon dibaca & dipahami.</p>` : ""}
      ${Object.entries(kelompok).map(([key, a]) => `<div class="sop-ingat-grup"><b>${_sopE(sopNamaTugas(key))}</b><ul>${a.slice(0, 6).map((b) => `<li><small>${SOP_FREK[b.f]}</small> ${_sopE(b.teks)}</li>`).join("")}${a.length > 6 ? `<li>+${a.length - 6} lagi</li>` : ""}</ul></div>`).join("")}
      ${malam ? `<p class="sop-catatan">Laporan harian paling lambat pukul 22.00.</p>` : ""}
      <div class="sop-aksi"><button class="btn btn-primary" onclick="document.getElementById('sop-ingat').remove();sopBuka('saya')">Buka Tugas Saya</button><button class="btn btn-secondary" onclick="document.getElementById('sop-ingat').remove()">Nanti</button></div></div>`;
    document.body.appendChild(el);
  } catch (e) { console.warn("Pengingat SOP:", e); }
}
function _sopSegarBadge() {
  try {
    const el = document.querySelector("#nav-list [data-sop]"); if (!el || !SOP.siap) return;
    const n = _sopBelumKini(STATE.guruId).filter((b) => b.f === "harian").length;
    let b = el.querySelector(".nav-badge-count"); if (!n) { if (b) b.remove(); return; }
    if (!b) { b = document.createElement("span"); b.className = "nav-badge-count"; el.appendChild(b); } b.textContent = n;
  } catch (e) {}
}

// ── Menu ──
(function sopPasang() {
  if (typeof RG_IKON !== "undefined") { RG_IKON["sop"] = '<path d="M4 4h11l5 5v11H4z"/><path d="M15 4v5h5"/><path d="m8 14 2.5 2.5L16 11"/>'; RG_IKON["pg-sop"] = RG_IKON["sop"]; }
  if (typeof RG_MENU_PENGELOLA !== "undefined") { const g = RG_MENU_PENGELOLA.find((x) => x.group === "Pengelolaan"); if (g && !g.items.some((x) => x[0] === "pg-sop")) g.items.unshift(["pg-sop", "", "SOP Induk"]); }
  if (typeof PG_MODUL_SIAP !== "undefined" && !PG_MODUL_SIAP.includes("pg-sop")) PG_MODUL_SIAP.push("pg-sop");
  if (typeof rgBukaPengelola === "function") { const a = rgBukaPengelola; rgBukaPengelola = async function (key) { if (key === "pg-sop") return sopBuka(); return a.apply(this, arguments); }; }
  if (typeof renderSidebar === "function") {
    const a = renderSidebar;
    renderSidebar = function () {
      const h = a.apply(this, arguments);
      try {
        if (typeof RG === "undefined" || !RG.siap || STATE.ruang === "Pg") return h;
        const nav = qs("nav-list"); if (!nav || nav.querySelector("[data-sop]")) return h;
        const el = document.createElement("div"); el.className = "nav-item" + (STATE.currentPage === "sop" ? " active" : ""); el.dataset.sop = "1";
        el.innerHTML = `${rgSvg("sop")}<span>SOP & Tugas</span>`; el.onclick = () => sopBuka("saya");
        const pertama = nav.querySelector(".nav-item"); if (pertama) pertama.after(el); else nav.appendChild(el);
        _sopSegarBadge();
      } catch (e) { console.warn("Menu SOP:", e); }
      return h;
    };
  }
  // pengingat: pagi (sekali sehari saat membuka aplikasi) dan malam (≥ 20.00, bila tugas harian belum diceklis)
  setTimeout(() => sopCekPengingat(false), 9000);
  setInterval(() => { sopCekPengingat(false); if (new Date().getHours() >= 20) sopCekPengingat(true); }, 10 * 60 * 1000);
})();

// ── Kantor Maya PKBM ──
const SOP_PETA_KT = { kepala: ["kepala"], sekretaris: ["sekretaris"], dapodik: ["dapodik"], bendahara: ["bendahara", "arkas"], "peny-A": ["peny@A"], "peny-Pa": ["peny@Pa"], "peny-Pi": ["peny@Pi"], "admin-A": ["admin@A"], "admin-Pa": ["admin@Pa"], "admin-Pi": ["admin@Pi"] };
function _sopHtmlKantor(gid, ktKode) {
  const keys = (SOP_PETA_KT[ktKode] || []).filter((k) => (SOP.pj[k] || []).includes(gid) || ktKode === "bendahara" || /^(kepala|sekretaris|dapodik)$/.test(k));
  if (!keys.length) return "";
  const ym = _sopTgl(new Date()).slice(0, 7);
  return keys.map((key) => {
    const kode = key.split("@")[0], j = sopJab(kode), t = sopTahap(kode), butir = sopButirKini(gid, key), cap = t === "kenal" ? null : sopCapaian(gid, key, ym);
    return `<div class="kt-tugas kt-sop"><b>📘 SOP ${_sopE(sopNamaTugas(key))} ${_sopBadgeTahap(kode)}</b>
      <div class="kt-sop-baca">${sopSudahBaca(gid, kode) ? "✓ SOP sudah dibaca & dipahami" : "📖 SOP belum ditandai dibaca"}${cap && cap.persen != null ? ` · capaian bulan ini <b>${cap.persen}%</b>` : ""}</div>
      <ul class="kt-sop-ul">${butir.filter((b) => b.f !== "jadwal").map((b) => `<li class="${b.cek ? "ok" : ""}">${b.libur ? "—" : b.cek ? "✓" : "○"} <small>${SOP_FREK[b.f]}</small> ${_sopE(b.teks)}</li>`).join("")}</ul></div>`;
  }).join("");
}
(function sopKantor() {
  if (typeof ktKartu === "function") {
    const a = ktKartu;
    ktKartu = function (id, kode) {
      const h = a.apply(this, arguments);
      try {
        const s = (KT.staf || []).find((x) => x.id === id); if (!s) return h;
        if (!kode && (KT.peran.kepala || [])[0] === id && !KT.penonton) return h; // menu perintah Kepala
        const daftar = kode ? [kode] : s.peran;
        sopMuat().then(_sopMuatEmberKini).then(() => { const p = document.getElementById("kt-panel"); if (!p || p.hidden || p.querySelector(".kt-sop")) return; const html = daftar.map((k) => _sopHtmlKantor(id, k)).join(""); if (html) { p.insertAdjacentHTML("beforeend", html); if (typeof _ktUkur === "function") setTimeout(_ktUkur, 30); } }).catch(() => {});
      } catch (e) {}
      return h;
    };
  }
  if (typeof KT_RAPAT_KEPALA !== "undefined" && !KT_RAPAT_KEPALA.some((x) => x[2] === "rapat capaian sop")) KT_RAPAT_KEPALA.splice(KT_RAPAT_KEPALA.length - 1, 0, ["📋", "SOP & Capaian Tugas", "rapat capaian sop", "sekretaris"]);
  if (typeof _ktTopik === "function") { const a = _ktTopik; _ktTopik = function (teks) { if (/\bsop\b|capaian tugas|ceklis tugas|tupoksi/i.test(teks)) return "sop"; return a.apply(this, arguments); }; }
  if (typeof _ktSkrip === "function") {
    const a = _ktSkrip;
    _ktSkrip = async function (topik, teks) {
      if (topik !== "sop") return a.apply(this, arguments);
      await sopMuat(true); await _sopMuatEmberKini();
      const ada = (k) => (KT.peran[k] || []).length > 0, sos = typeof _ktSosialisasi === "function" && _ktSosialisasi();
      const ym = _sopTgl(new Date()).slice(0, 7), baris = [], arahan = [], catatan = [], tv = [];
      const rekap = (key) => { const ids = SOP.pj[key] || [], kode = key.split("@")[0]; const t = sopTahap(kode), c = t === "kenal" ? [] : ids.map((id) => sopCapaian(id, key, ym)).filter((x) => x.persen != null); return { n: ids.length, baca: ids.filter((id) => sopSudahBaca(id, kode)).length, p: c.length ? Math.round(c.reduce((s, x) => s + x.persen, 0) / c.length) : null, t }; };
      const teksRekap = (key) => { const x = rekap(key); if (!x.n) return `${_sopE(sopNamaTugas(key))}: <i>PJ belum ditetapkan</i>`; return `${_sopE(sopNamaTugas(key))}: baca ${x.baca}/${x.n}${x.t === "kenal" ? " · Tahap Kenal" : x.p == null ? "" : ` · capaian <b>${x.p}%</b>`}`; };
      baris.push({ kode: "kepala", html: "Bismillah. Ana minta laporan pelaksanaan <b>SOP</b>: siapa yang sudah membaca SOP-nya, dan capaian ceklis tugas bulan ini.", singkat: "Ana minta laporan pelaksanaan SOP." });
      const pkbm = ["kepala", "sekretaris", "dapodik", "bendahara", "arkas"];
      const pelapor = ada("sekretaris") ? "sekretaris" : ada("bendahara") ? "bendahara" : "kepala";
      baris.push({ kode: pelapor, html: "SOP tingkat PKBM:" + _ktLi(pkbm.map(teksRekap)), singkat: "Rekap SOP tingkat PKBM sudah ana sampaikan." });
      const jenjang = ["peny", "admin", "bendjenjang", "tutor", "walikelas", "musyrif"];
      SOP_RG.forEach((r) => {
        const wakil = ada("peny-" + r) ? "peny-" + r : ada("admin-" + r) ? "admin-" + r : pelapor;
        const ks = jenjang.map((k) => k + "@" + r).filter((k) => (SOP.pj[k] || []).length || k.startsWith("peny") || k.startsWith("admin") || k.startsWith("bendjenjang"));
        baris.push({ kode: wakil, html: `<b>${_sopNamaRg(r)}</b>:` + _ktLi(ks.map(teksRekap)), singkat: `${_sopPendekRg(r)}: rekap SOP jenjang sudah ana sampaikan.` });
        const ps = ks.map(rekap).filter((x) => x.p != null), pr = ps.length ? Math.round(ps.reduce((s, x) => s + x.p, 0) / ps.length) : 0;
        tv.push({ label: _sopPendekRg(r), nilai: pr || 0.001, teks: ps.length ? pr + "%" : "Kenal", warna: { A: "#10b981", Pa: "#3b82f6", Pi: "#ec4899" }[r] });
      });
      sopKunciSemua().forEach((key) => {
        const x = rekap(key), nm = sopNamaTugas(key);
        if (!x.n) { if (!/^(tutor|walikelas|musyrif)/.test(key)) catatan.push(`${nm}: PJ belum ditetapkan`); return; }
        if (x.baca < x.n) catatan.push(`${nm}: ${x.n - x.baca} dari ${x.n} PJ belum membaca SOP`);
        if (x.t === "berjalan" && x.p != null && x.p < 60) arahan.push(`${nm}: capaian ${x.p}% — mohon ceklis tugas rutin diisi`);
      });
      const semuaKenal = SOP_BAWAAN.urut.every((k) => sopTahap(k) === "kenal");
      if (sos || semuaKenal) baris.push({ kode: "kepala", html: "Jazakumullahu khairan. Catatan ana (masa sosialisasi SOP — belum ditagih):" + _ktLi(catatan.length ? catatan.slice(0, 10) : ["Alhamdulillah, semua PJ sudah membaca SOP-nya."]), singkat: "Ana catat dulu, nanti kita sosialisasikan bersama." });
      else baris.push({ kode: "kepala", html: "Jazakumullahu khairan. Arahan ana:" + _ktLi(arahan.concat(catatan).length ? arahan.concat(catatan).slice(0, 12) : ["Alhamdulillah SOP berjalan baik. Pertahankan."]), singkat: arahan.length ? `Ada ${arahan.length} capaian yang perlu ditingkatkan.` : "Alhamdulillah, pertahankan." });
      return { baris, judul: "Rapat SOP & Capaian Tugas", tv, ticker: sos || semuaKenal ? "Masa sosialisasi SOP" : arahan.join("  •  ") || "SOP & Capaian Tugas", lanjut: [["Kabar Baru", "__kabar"], ["Evaluasi KBM", "evaluasi kegiatan semua jenjang"], ["Laporan BOSP", "laporan bosp"]] };
    };
  }
  // lemari arsip: berkas SOP & Capaian
  if (typeof KT_BERKAS !== "undefined") { if (!KT_BERKAS.some((x) => x[2] === "fn:sopBuka")) KT_BERKAS.push(["📋", "SOP & Capaian", "fn:sopBuka"]); if (typeof KT_BERKAS_PG !== "undefined" && !KT_BERKAS_PG.some((x) => x[2] === "fn:sopBuka")) KT_BERKAS_PG.push(["📋", "SOP & Capaian", "fn:sopBuka"]); }
  if (typeof ktBerkas === "function") {
    const a = ktBerkas;
    ktBerkas = async function (rg, i) {
      const it = (rg === "Pg" ? KT_BERKAS_PG : KT_BERKAS)[i] || [], w = document.getElementById("kt-berkas");
      if (it[2] !== "fn:sopBuka" || !w) return a.apply(this, arguments);
      w.innerHTML = '<div class="kt-info">⏳ Membuka berkas SOP…</div>';
      let isi = [];
      try {
        await sopMuat(); await _sopMuatEmberKini(); const ym = _sopTgl(new Date()).slice(0, 7);
        const keys = sopKunciSemua().filter((k) => (rg === "Pg" ? !k.includes("@") : k.endsWith("@" + rg)));
        isi = keys.map((k) => { const ids = SOP.pj[k] || [], kode = k.split("@")[0], t = sopTahap(kode); if (!ids.length) return `${_sopE(sopNamaTugas(k))}: PJ belum ada`; const c = ids.map((id) => sopCapaian(id, k, ym)).filter((x) => x.persen != null); return `${_sopE(sopNamaTugas(k))}: baca ${ids.filter((id) => sopSudahBaca(id, kode)).length}/${ids.length} · ${t === "kenal" ? "Tahap Kenal" : c.length ? "capaian " + Math.round(c.reduce((s, x) => s + x.persen, 0) / c.length) + "%" : SOP_TAHAP[t][0]}`; });
      } catch (e) { isi = ["Ringkasan belum bisa dibaca: " + (e.message || e)]; }
      w.innerHTML = `<div class="kt-tugas" style="--w:#14532d"><b>📋 SOP & Capaian — ${rg === "Pg" ? "Tingkat PKBM" : _sopNamaRg(rg)}</b>${_ktLi(isi)}${KT.penonton ? "" : `<button class="kt-salin" onclick="ktBukaHalaman('${rg}','fn:sopBuka')">📂 Buka di Aplikasi</button>`}</div>`;
    };
  }
})();

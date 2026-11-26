// ============================================================
//  ALUMNI PKBM AL-UMM — hanya lulusan Paket C (kelas 12) yang resmi lulus.
//  Ruang Pengelola → Data → Alumni. Data bersama (ruang "*") di kv "bosp:alumni" { id: {...} } lewat kv_gabung_umum.
//  • Impor Excel/CSV dari pendataan alumni Dinas ("Unduh daftar" / "Unduh jawaban"): kolom dikenali otomatis,
//    kolom lain disimpan apa adanya sebagai "Isian Pendataan" supaya tidak ada yang hilang.
//  • Cek otomatis: NIK 16 digit, NISN 10 digit, tanggal lahir & jenis kelamin dicocokkan dengan NIK, NIK/NISN ganda.
// ============================================================
const AL = { data: null, f: { th: "", isi: "", rg: "", cari: "" }, t: 0 };
const AL_KUNCI = "bosp:alumni";
const _alE = (s) => escapeHtml(s == null ? "" : String(s));
const _alDigit = (s) => String(s == null ? "" : s).replace(/\D/g, "");
function _alNisn(s) { const d = _alDigit(s); return d && d.length < 10 ? d.padStart(10, "0") : d; }
function _alHp(s) { let d = _alDigit(s); if (d.startsWith("62")) d = "0" + d.slice(2); else if (d.startsWith("8")) d = "0" + d; return d; }
function _alTgl(v) {
  if (v == null || v === "") return "";
  if (typeof v === "number") { const d = new Date(Math.round((v - 25569) * 864e5)); return d.toISOString().slice(0, 10); }
  const s = String(v).trim(); let m;
  if ((m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/))) return `${m[1]}-${m[2].padStart(2, "0")}-${m[3].padStart(2, "0")}`;
  if ((m = s.match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})/))) return `${m[3]}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}`;
  return s;
}
const _alJk = (v) => { const s = String(v || "").trim().toUpperCase(); return /^(P|PEREMPUAN|WANITA|F)/.test(s) ? "P" : /^(L|LAKI|PRIA|M)/.test(s) ? "L" : ""; };
// NIK: digit 7–12 = tanggal (+40 untuk perempuan), bulan, tahun lahir
function alCekNik(x) {
  const c = [], nik = _alDigit(x.nik), nisn = _alDigit(x.nisn);
  if (nik && nik.length !== 16) c.push("NIK harus 16 digit");
  if (nisn && nisn.length !== 10) c.push("NISN harus 10 digit");
  if (nik.length === 16 && x.tgl_lahir && /^\d{4}-\d{2}-\d{2}$/.test(x.tgl_lahir)) {
    let dd = +nik.slice(6, 8); const mm = nik.slice(8, 10), yy = nik.slice(10, 12), jkNik = dd > 40 ? "P" : "L"; if (dd > 40) dd -= 40;
    const [y, m, d] = x.tgl_lahir.split("-");
    if (String(dd).padStart(2, "0") !== d || mm !== m || yy !== y.slice(2)) c.push(`Tanggal lahir di NIK (${String(dd).padStart(2, "0")}-${mm}-${yy}) beda dengan tanggal lahir (${d}-${m}-${y.slice(2)})`);
    if (x.jk && x.jk !== jkNik) c.push(`Jenis kelamin di NIK (${jkNik}) beda dengan data (${x.jk})`);
  }
  return c;
}
const alBolehUbah = () => (typeof isAdmin === "function" && isAdmin()) || (typeof rgAkses === "function" && rgAkses("Pg") === "U");

async function alMuat(paksa) {
  if (AL.data && !paksa && Date.now() - AL.t < 60000) return AL.data;
  const r = await supaSemua.from("kuliah_pengaturan").select("nilai").eq("kunci", AL_KUNCI).eq("ruang_id", "*").maybeSingle();
  if (r.error) throw r.error;
  AL.data = (r.data && r.data.nilai) || {}; AL.t = Date.now(); return AL.data;
}
// Arsip e-Ijazah per angkatan (PDF gabungan dari Dinas): AL.data._ijazah = { id: {tp:"2024/2025", paket:"C", rg:"Pi", url, judul} }
const alArsipIjazah = () => Object.entries((AL.data || {})._ijazah || {}).filter(([, v]) => v && v.url).map(([id, v]) => ({ id, ...v })).sort((a, b) => String(b.tp).localeCompare(String(a.tp)) || String(a.paket).localeCompare(String(b.paket)) || String(a.rg).localeCompare(String(b.rg)));
function alUrlIjazah(x) {
  if (x.url_ijazah) return { url: x.url_ijazah, gabung: false };
  const th = String(x.lulus || ""), a = alArsipIjazah().find((z) => z.paket === "C" && (!z.rg || !x.rg || z.rg === x.rg) && String(z.tp).slice(-4) === th);
  return a ? { url: a.url, gabung: true, tp: a.tp } : null;
}
const _alDaftar = () => Object.entries(AL.data || {}).filter(([, v]) => v && typeof v === "object" && v.nama).map(([id, v]) => ({ id, ...v }));
function _alSaring() {
  const f = AL.f, q = f.cari.toLowerCase().trim();
  return _alDaftar().filter((x) => (!f.th || String(x.lulus) === f.th) && (!f.isi || (f.isi === "sudah" ? x.isi === "sudah" : x.isi !== "sudah")) && (!f.rg || x.rg === f.rg)
    && (!q || [x.nama, x.nik, x.nisn, x.hp, x.no_ijazah].some((v) => String(v || "").toLowerCase().includes(q)))).sort((a, b) => String(a.nama).localeCompare(String(b.nama), "id"));
}

async function alBuka(muatUlang) {
  const sec = _rgBukaHal("pg-alumni", "Alumni", `<div class="card"><div class="rg-memuat">Memuat data alumni…</div></div>`);
  try { await alMuat(muatUlang); sec.innerHTML = `<div id="al-wrap">${_alHtml()}</div>`; }
  catch (e) { sec.innerHTML = `<div class="card">Gagal memuat alumni: ${_alE(e.message)}</div>`; }
}
function _alSegar(fokus) {
  const w = document.getElementById("al-wrap"); if (!w) return;
  const pos = fokus ? w.querySelector(".al-cari")?.selectionStart : null;
  w.innerHTML = _alHtml();
  if (fokus) { const i = w.querySelector(".al-cari"); if (i) { i.focus(); try { i.setSelectionRange(pos, pos); } catch (e) {} } }
}
function _alHtml() {
  const semua = _alDaftar(), d = _alSaring(), f = AL.f, ubah = alBolehUbah();
  const sudah = semua.filter((x) => x.isi === "sudah").length, tahun = [...new Set(semua.map((x) => String(x.lulus || "")).filter(Boolean))].sort().reverse();
  const masalah = semua.filter((x) => alCekNik(x).length).length;
  const nikGanda = new Set(), lihat = {}; semua.forEach((x) => { const k = _alDigit(x.nik); if (!k) return; if (lihat[k]) nikGanda.add(k); lihat[k] = 1; });
  const per = (r) => semua.filter((x) => x.rg === r).length;
  return `<div class="pg-kartu-baris al-kartu">
      <div class="pg-angka total"><span>Alumni Paket C</span><b>${semua.length}</b><small>Putra ${per("Pa")} · Putri ${per("Pi")}</small></div>
      <button class="pg-angka" onclick="AL.f.isi=AL.f.isi==='sudah'?'':'sudah';_alSegar()"><span>Sudah Mengisi Pendataan</span><b>${sudah}</b><small>${semua.length ? Math.round((sudah / semua.length) * 100) : 0}% dari seluruh alumni</small></button>
      <button class="pg-angka" onclick="AL.f.isi=AL.f.isi==='belum'?'':'belum';_alSegar()"><span>Belum Mengisi</span><b>${semua.length - sudah}</b><small>perlu dihubungi</small></button>
      ${masalah || nikGanda.size ? `<div class="pg-angka" style="--rw:#dc2626"><span>Perlu Dicek</span><b>${masalah + nikGanda.size}</b><small>NIK/NISN/tanggal lahir tidak cocok atau ganda</small></div>` : ""}
    </div>
    <div class="card pg-alat">
      <input class="input al-cari" placeholder="Cari nama, NIK, NISN, HP, no. ijazah…" value="${_alE(f.cari)}" oninput="AL.f.cari=this.value;_alSegar(true)">
      <select class="input" onchange="AL.f.th=this.value;_alSegar()"><option value="">Semua Tahun Lulus</option>${tahun.map((t) => `<option ${f.th === t ? "selected" : ""}>${t}</option>`).join("")}</select>
      <select class="input" onchange="AL.f.rg=this.value;_alSegar()"><option value="">Putra & Putri</option><option value="Pa" ${f.rg === "Pa" ? "selected" : ""}>Paket C Putra</option><option value="Pi" ${f.rg === "Pi" ? "selected" : ""}>Paket C Putri</option></select>
      <select class="input" onchange="AL.f.isi=this.value;_alSegar()"><option value="">Semua Status</option><option value="sudah" ${f.isi === "sudah" ? "selected" : ""}>Sudah Mengisi</option><option value="belum" ${f.isi === "belum" ? "selected" : ""}>Belum Mengisi</option></select>
      <span class="pg-jml">${d.length} alumni</span>
      ${ubah ? `<button class="btn btn-primary" onclick="alForm()">+ Tambah Alumni</button><button class="btn btn-secondary" onclick="document.getElementById('al-berkas').click()">📥 Impor Excel</button><input type="file" id="al-berkas" accept=".xlsx,.xls,.csv" hidden onchange="alImpor(this)">` : ""}
      ${(AL.data || {})._folder && AL.data._folder.url ? `<a class="btn btn-secondary" href="${_alE(AL.data._folder.url)}" target="_blank" rel="noopener">📂 Folder e-Ijazah</a>` : ""}${ubah ? `<button class="btn btn-secondary" onclick="alAturFolder()" title="Tautan folder Google Drive berisi e-Ijazah">⚙️ Folder e-Ijazah</button>` : ""}
      <button class="btn btn-accent" onclick="alUnduh()">Unduh Excel</button>
    </div>
    <div class="card" style="overflow-x:auto"><table class="table pg-tabel al-tabel"><thead><tr><th>No</th><th>Nama</th><th>NIK / NISN</th><th>Lulus</th><th>HP</th><th>Pendataan</th><th></th></tr></thead><tbody>
    ${d.map((x, i) => { const c = alCekNik(x), ganda = nikGanda.has(_alDigit(x.nik)); return `<tr class="${c.length || ganda ? "al-cek" : ""}"><td>${i + 1}</td>
      <td><b>${_alE(x.nama)}</b><br><small>${_alE(x.jk || "-")} · ${_alE(x.tgl_lahir || "-")} · ${x.rg === "Pa" ? "Putra" : x.rg === "Pi" ? "Putri" : "-"}</small>${c.length || ganda ? `<div class="al-peringatan">⚠️ ${_alE([...c, ganda ? "NIK ganda" : ""].filter(Boolean).join(" · "))}</div>` : ""}</td>
      <td class="al-mono">${_alE(x.nik || "-")}<br><small>${_alE(x.nisn || "-")}</small></td><td>${_alE(x.lulus || "-")}</td>
      <td class="al-mono">${x.hp ? `<a href="https://wa.me/62${_alE(_alHp(x.hp).slice(1))}" target="_blank" rel="noopener">${_alE(x.hp)}</a>` : "-"}</td>
      <td>${x.isi === "sudah" ? '<span class="al-ok">✓ Sudah</span>' : '<span class="al-belum">Belum</span>'}${(() => { const u = alUrlIjazah(x); return u ? ` <a href="${_alE(u.url)}" target="_blank" rel="noopener" title="${u.gabung ? "e-Ijazah angkatan (PDF gabungan)" : "Buka e-Ijazah"}">📄</a>` : ""; })()}</td>
      <td style="white-space:nowrap"><button class="btn btn-sm btn-secondary" onclick="alDetail('${x.id}')">Lihat</button>${ubah ? ` <button class="btn btn-sm btn-secondary" onclick="alForm('${x.id}')">Ubah</button>` : ""}</td></tr>`; }).join("") || `<tr><td colspan="7" class="empty-state">${semua.length ? "Tidak ada yang cocok." : "Belum ada data alumni. Tekan Impor Excel atau + Tambah Alumni."}</td></tr>`}
    </tbody></table></div>
    ${_alHtmlArsipIjazah(ubah)}
    <p class="rg-ket">Alumni = santri yang resmi <b>lulus Paket C (kelas 12)</b> dari PKBM Al-Umm Barabai. Lulusan Paket A dan B tidak dicatat di sini.</p>`;
}
function alDetail(id) {
  const x = (AL.data || {})[id]; if (!x) return;
  const baris = [["Nama", x.nama], ["Jenis Kelamin", x.jk === "P" ? "Perempuan" : x.jk === "L" ? "Laki-laki" : "-"], ["Tanggal Lahir", x.tgl_lahir], ["NIK", x.nik], ["NISN", x.nisn], ["Jenjang", x.rg === "Pa" ? "Paket C Putra" : x.rg === "Pi" ? "Paket C Putri" : "-"], ["Tahun Lulus", x.lulus], ["No. HP / WA", x.hp], ["No. Seri e-Ijazah", x.no_ijazah], ["Pendataan Dinas", x.isi === "sudah" ? "Sudah mengisi" : "Belum mengisi"], ["Catatan", x.catatan]];
  const jaw = Object.entries(x.jawaban || {});
  const c = alCekNik(x);
  const sec = document.getElementById("page-rg");
  sec.innerHTML = `<div class="card al-detail"><button class="btn btn-secondary btn-sm" onclick="alBuka()">‹ Kembali</button>${(() => { const u = alUrlIjazah(x); return u ? ` <a class="btn btn-primary btn-sm" href="${_alE(u.url)}" target="_blank" rel="noopener">📄 ${u.gabung ? `e-Ijazah Angkatan TP ${_alE(u.tp)}` : "Buka e-Ijazah"}</a>` : ""; })()}<h3>${_alE(x.nama)}</h3>
    ${c.length ? `<div class="al-peringatan">⚠️ ${_alE(c.join(" · "))}</div>` : ""}
    <table class="table"><tbody>${baris.map(([k, v]) => `<tr><td style="width:38%"><b>${k}</b></td><td>${_alE(v || "-")}</td></tr>`).join("")}</tbody></table>
    ${jaw.length ? `<h4>Isian Pendataan Alumni (dari berkas Dinas)</h4><table class="table"><tbody>${jaw.map(([k, v]) => `<tr><td style="width:38%">${_alE(k)}</td><td>${_alE(v)}</td></tr>`).join("")}</tbody></table>` : ""}
    <p class="rg-ket">Diperbarui ${x.t ? new Date(x.t).toLocaleString("id-ID") : "-"}${x.oleh ? " oleh " + _alE(x.oleh) : ""}${x.sumber ? " · sumber: " + _alE(x.sumber) : ""}</p></div>`;
}
function alForm(id) {
  const x = id ? (AL.data || {})[id] || {} : { rg: "", isi: "belum", lulus: new Date().getFullYear() };
  const sec = document.getElementById("page-rg");
  const inp = (k, lbl, ph = "", tipe = "text") => `<label>${lbl}<input class="input" id="al-${k}" type="${tipe}" value="${_alE(x[k] || "")}" placeholder="${ph}"></label>`;
  sec.innerHTML = `<div class="card al-form"><h3>${id ? "Ubah" : "Tambah"} Alumni</h3><div class="al-grid">
    ${inp("nama", "Nama Lengkap (sesuai ijazah)")}
    <label>Jenis Kelamin<select class="input" id="al-jk"><option value="">-</option><option value="L" ${x.jk === "L" ? "selected" : ""}>Laki-laki</option><option value="P" ${x.jk === "P" ? "selected" : ""}>Perempuan</option></select></label>
    ${inp("tgl_lahir", "Tanggal Lahir", "", "date")}${inp("nik", "NIK (16 digit)", "63…")}${inp("nisn", "NISN (10 digit)", "00…")}
    <label>Jenjang<select class="input" id="al-rg"><option value="">-</option><option value="Pa" ${x.rg === "Pa" ? "selected" : ""}>Paket C Putra</option><option value="Pi" ${x.rg === "Pi" ? "selected" : ""}>Paket C Putri</option></select></label>
    ${inp("lulus", "Tahun Lulus", "2026", "number")}${inp("hp", "No. HP / WA", "08…")}${inp("no_ijazah", "No. Seri e-Ijazah (opsional)")}${inp("url_ijazah", "Tautan e-Ijazah (Google Drive)", "https://drive.google.com/…", "url")}
    <label>Pendataan Alumni Dinas<select class="input" id="al-isi"><option value="belum">Belum mengisi</option><option value="sudah" ${x.isi === "sudah" ? "selected" : ""}>Sudah mengisi</option></select></label>
    <label class="al-penuh">Catatan<textarea class="input" id="al-catatan" rows="2">${_alE(x.catatan || "")}</textarea></label></div>
    <div id="al-cek" class="al-peringatan" hidden></div>
    <div class="sop-aksi"><button class="btn btn-primary" onclick="alSimpan(${id ? `'${id}'` : ""})">💾 Simpan</button><button class="btn btn-secondary" onclick="alBuka()">Batal</button>${id ? `<button class="btn btn-secondary" style="margin-left:auto;color:#dc2626" onclick="alHapus('${id}')">Hapus</button>` : ""}</div></div>`;
}
async function alSimpan(id) {
  if (!alBolehUbah()) return toast("Khusus pengelola PKBM", "err");
  const v = (k) => (document.getElementById("al-" + k)?.value || "").trim();
  const x = { ...(id ? AL.data[id] : {}), nama: v("nama"), jk: v("jk"), tgl_lahir: v("tgl_lahir"), nik: _alDigit(v("nik")), nisn: _alNisn(v("nisn")), rg: v("rg") || (v("jk") === "P" ? "Pi" : v("jk") === "L" ? "Pa" : ""), lulus: v("lulus"), hp: _alHp(v("hp")), no_ijazah: v("no_ijazah"), url_ijazah: v("url_ijazah"), isi: v("isi"), catatan: v("catatan"), t: Date.now(), oleh: STATE.guruNama || "" };
  if (!x.nama) return toast("Nama wajib diisi", "err");
  if (x.url_ijazah && !/^https:\/\//i.test(x.url_ijazah)) return toast("Tautan e-Ijazah harus diawali https://", "err");
  const ganda = _alDaftar().find((y) => y.id !== id && ((x.nik && _alDigit(y.nik) === x.nik) || (x.nisn && _alDigit(y.nisn) === x.nisn)));
  if (ganda && !(await konfirmasiTema(`NIK/NISN ini sudah dipakai oleh ${ganda.nama}. Tetap simpan?`))) return;
  const c = alCekNik(x); if (c.length && !(await konfirmasiTema("Perlu dicek:\n• " + c.join("\n• ") + "\n\nTetap simpan?"))) return;
  const kunci = id || "al" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  try { await _bspGabungUmum(AL_KUNCI, { [kunci]: x }); AL.data[kunci] = x; toast("Data alumni tersimpan", "ok"); if (typeof _rgLog === "function") _rgLog("simpan-alumni", { nama: x.nama }); alBuka(); }
  catch (e) { toast("Gagal menyimpan: " + (e.message || e), "err"); }
}
async function alHapus(id) {
  const x = AL.data[id]; if (!x || !(await konfirmasiTema(`Hapus ${x.nama} dari daftar alumni?`))) return;
  try { await _bspGabungUmum(AL_KUNCI, { [id]: null }); delete AL.data[id]; toast("Dihapus", "ok"); if (typeof _rgLog === "function") _rgLog("hapus-alumni", { nama: x.nama, nik: x.nik }); alBuka(); }
  catch (e) { toast("Gagal: " + (e.message || e), "err"); }
}

async function alAturFolder() {
  const lama = ((AL.data || {})._folder || {}).url || "";
  const url = (await promptTema("Tempel tautan folder Google Drive berisi e-Ijazah dari Dinas:", lama)); if (url === null) return;
  const v = url.trim(); if (v && !/^https:\/\//i.test(v)) return toast("Tautan harus diawali https://", "err");
  try { const isi = v ? { url: v, t: Date.now(), oleh: STATE.guruNama || "" } : null; await _bspGabungUmum(AL_KUNCI, { _folder: isi }); if (isi) AL.data._folder = isi; else delete AL.data._folder; toast(v ? "Folder e-Ijazah tersimpan" : "Tautan folder dihapus", "ok"); _alSegar(); }
  catch (e) { toast("Gagal: " + (e.message || e), "err"); }
}
// ── Impor dari berkas Dinas (Unduh daftar / Unduh jawaban) ──
const AL_KOLOM = [["nama", /^nama(\s*(lengkap|alumni|peserta didik|siswa|pd))?$/i], ["nik", /^nik\b/i], ["nisn", /^nisn\b/i], ["tgl_lahir", /tanggal\s*lahir|tgl\.?\s*lahir/i], ["jk", /^(jk|l\/p|jenis\s*kelamin|gender)$/i], ["lulus", /tahun\s*lulus|^lulus$|tahun\s*kelulusan/i], ["hp", /^(hp|no\.?\s*hp|nomor\s*hp|telepon|no\.?\s*telp|whatsapp|wa|no\.?\s*wa)/i], ["isi", /^status(\s*pengisian)?$|sudah\s*mengisi/i], ["no_ijazah", /seri\s*ijazah|nomor\s*ijazah|no\.?\s*ijazah/i], ["url_ijazah", /tautan|link|url/i], ["rg", /^(jenjang|rombel|unit)$/i]];
async function alImpor(el) {
  const f = el.files && el.files[0]; el.value = ""; if (!f) return;
  if (typeof XLSX === "undefined") return toast("Pustaka Excel belum termuat, coba lagi", "err");
  try {
    const wb = XLSX.read(await f.arrayBuffer(), { type: "array", raw: true, cellDates: false });
    const baris = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: "", raw: true });
    if (!baris.length) return toast("Berkas kosong", "err");
    const kepala = Object.keys(baris[0]), peta = {};
    kepala.forEach((h) => { const k = AL_KOLOM.find(([, rx]) => rx.test(String(h).trim())); if (k && !Object.values(peta).includes(k[0])) peta[h] = k[0]; });
    if (!Object.values(peta).includes("nama")) return toast("Kolom Nama tidak ditemukan di berkas", "err");
    const ada = _alDaftar(), potong = {}; let baru = 0, ubah = 0, lewat = 0;
    baris.forEach((r, i) => {
      const x = { jawaban: {} };
      Object.entries(r).forEach(([h, v]) => { const k = peta[h]; if (k) x[k] = v; else if (String(v).trim() !== "" && !/^(no|no\.|nomor urut)$/i.test(String(h).trim())) x.jawaban[String(h).trim()] = String(v).trim(); });
      x.nama = String(x.nama || "").trim(); if (!x.nama) { lewat++; return; }
      x.nik = _alDigit(x.nik); x.nisn = _alNisn(x.nisn); x.hp = _alHp(x.hp); x.tgl_lahir = _alTgl(x.tgl_lahir); x.jk = _alJk(x.jk);
      x.lulus = String(x.lulus || "").replace(/\D/g, "").slice(0, 4);
      x.isi = /sudah|✓|^ya$|terisi/i.test(String(x.isi || "")) || (x.isi === undefined && /jawaban/i.test(f.name)) ? "sudah" : "belum";
      x.rg = /pi|putri/i.test(String(x.rg || "")) ? "Pi" : /pa|putra/i.test(String(x.rg || "")) ? "Pa" : x.jk === "P" ? "Pi" : x.jk === "L" ? "Pa" : "";
      const lama = ada.find((y) => (x.nik && _alDigit(y.nik) === x.nik) || (x.nisn && _alDigit(y.nisn) === x.nisn) || (!x.nik && !x.nisn && String(y.nama).toLowerCase() === x.nama.toLowerCase()));
      const id = lama ? lama.id : "al" + Date.now().toString(36) + i.toString(36) + Math.random().toString(36).slice(2, 5);
      const gabung = { ...(lama || {}) }; delete gabung.id;
      Object.entries(x).forEach(([k, v]) => { if (k === "jawaban") gabung.jawaban = { ...(gabung.jawaban || {}), ...v }; else if (v !== "" && v != null) gabung[k] = v; });
      if (lama && lama.isi === "sudah") gabung.isi = "sudah";
      gabung.t = Date.now(); gabung.oleh = STATE.guruNama || ""; gabung.sumber = "impor " + f.name;
      potong[id] = gabung; if (lama) ubah++; else baru++;
    });
    const n = Object.keys(potong).length;
    if (!n) return toast("Tidak ada baris yang bisa dibaca", "err");
    if (!(await konfirmasiTema(`Impor ${f.name}:\n• ${baru} alumni baru\n• ${ubah} alumni diperbarui (cocok NIK/NISN)\n${lewat ? `• ${lewat} baris dilewati (tanpa nama)\n` : ""}\nKolom dikenali: ${Object.entries(peta).map(([h, k]) => `${h}→${k}`).join(", ")}\n\nLanjutkan?`))) return;
    await _bspGabungUmum(AL_KUNCI, potong); Object.assign(AL.data, potong);
    if (typeof _rgLog === "function") _rgLog("impor-alumni", { berkas: f.name, baru, ubah });
    toast(`${baru} alumni baru, ${ubah} diperbarui`, "ok"); _alSegar();
  } catch (e) { toast("Gagal membaca berkas: " + (e.message || e), "err"); }
}
function alUnduh() {
  const d = _alSaring(), kolomJaw = [...new Set(d.flatMap((x) => Object.keys(x.jawaban || {})))];
  const baris = d.map((x, i) => ({ No: i + 1, Nama: x.nama, "Jenis Kelamin": x.jk || "", "Tanggal Lahir": x.tgl_lahir || "", NIK: x.nik || "", NISN: x.nisn || "", Jenjang: x.rg === "Pa" ? "Paket C Putra" : x.rg === "Pi" ? "Paket C Putri" : "", "Tahun Lulus": x.lulus || "", "No HP": x.hp || "", "No Seri Ijazah": x.no_ijazah || "", "Tautan e-Ijazah": x.url_ijazah || "", "Pendataan Dinas": x.isi === "sudah" ? "Sudah" : "Belum", Catatan: x.catatan || "", "Perlu Dicek": alCekNik(x).join("; "), ...Object.fromEntries(kolomJaw.map((k) => [k, (x.jawaban || {})[k] || ""])) }));
  if (typeof XLSX === "undefined") return toast("Pustaka Excel belum termuat", "err");
  const ws = XLSX.utils.json_to_sheet(baris.length ? baris : [{ Keterangan: "(kosong)" }]);
  // NIK/NISN/HP tetap teks (nol di depan tidak hilang)
  Object.keys(ws).forEach((a) => { if (a[0] !== "!" && ws[a].t === "n") { ws[a].t = "s"; ws[a].v = String(ws[a].v); } });
  const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, "Alumni");
  XLSX.writeFile(wb, `Alumni PKBM Al-Umm Barabai ${new Date().toISOString().slice(0, 10)}.xlsx`);
  if (typeof _rgLog === "function") _rgLog("unduh-alumni", { jumlah: baris.length });
}

(function alPasang() {
  if (typeof RG_IKON !== "undefined") RG_IKON["pg-alumni"] = '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2.5 9 2.5 12 0v-5"/><path d="M22 9v6"/>';
  if (typeof RG_MENU_PENGELOLA !== "undefined") { const g = RG_MENU_PENGELOLA.find((x) => x.group === "Data"); if (g && !g.items.some((x) => x[0] === "pg-alumni")) g.items.push(["pg-alumni", "", "Alumni"]); }
  if (typeof PG_MODUL_SIAP !== "undefined" && !PG_MODUL_SIAP.includes("pg-alumni")) PG_MODUL_SIAP.push("pg-alumni");
  if (typeof rgBukaPengelola === "function") { const a = rgBukaPengelola; rgBukaPengelola = async function (key) { if (key === "pg-alumni") return alBuka(); return a.apply(this, arguments); }; }
})();

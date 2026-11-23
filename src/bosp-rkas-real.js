// ============================================================
//  REALISASI DRAFT RKAS — dilaporkan tiap jenjang, dipantau Kepala PKBM & Bendahara
//  • Jenjang (Admin, Admin Pendamping, Penyelenggara): Draft RKAS → tab ✅ Realisasi → tiap kegiatan
//    yang dijadwalkan di bulan itu dilaporkan: Sudah dilaksanakan / Ditunda / Tidak jadi, nominal,
//    tanggal, keterangan, + bukti (nota/kwitansi, foto kegiatan, lainnya) → Arsip Google Drive.
//  • Pengelola (Kepala PKBM, Bendahara, Admin): menu "Pantau Realisasi Jenjang" — papan per bulan
//    per jenjang, peta setahun, kirim WA pengingat ke Admin Pendamping / Penyelenggara jenjang,
//    tandai "Diperiksa" / "Perlu Perbaikan", dan cetak "Bahan Kunjungan".
//  Penyimpanan (kuliah_pengaturan):
//    - per ruang  "bosp:rkas-real:<th>" → { "<itemId>:<bulan>": {status, rp, tgl, ket, bukti:{nota,foto,lain}, oleh, t} }
//    - bersama    "bosp:rkas-cek:<th>"  (ruang "*") → { "<ruang>:<itemId>:<bulan>": {status:"ok"|"perbaiki", catatan, oleh, t} }
//  Berkas tidak disimpan di Supabase — hanya tautannya.
// ============================================================
const RKR = { bln: null, pantau: null };
const _rkrKunci = (th) => "bosp:rkas-real:" + th;
const _rkrKunciCek = (th) => "bosp:rkas-cek:" + th;
const RKR_BUKTI = { nota: { label: "Nota / Kwitansi", ikon: "🧾", folder: "02 Nota & Bukti Belanja" }, foto: { label: "Foto Kegiatan", ikon: "📷", folder: "03 Dokumentasi Kegiatan" }, lain: { label: "Lainnya", ikon: "📎", folder: "05 Laporan Lainnya" } };
const RKR_STATUS = { sudah: ["✅", "Sudah Dilaksanakan", "#16a34a"], tunda: ["⏸️", "Ditunda", "#d97706"], batal: ["🚫", "Tidak Jadi", "#64748b"], telat: ["⏰", "Belum Dilaporkan", "#dc2626"], belum: ["⏳", "Belum Waktunya", "#94a3b8"] };
const _rkrBulanIni = (th) => { const d = new Date(); return th < d.getFullYear() ? 13 : th > d.getFullYear() ? 0 : d.getMonth() + 1; };

async function _rkMuatReal() {
  const [a, b] = await Promise.all([
    RK.ruang === STATE.ruang ? supa.from("kuliah_pengaturan").select("nilai").eq("kunci", _rkrKunci(RK.th)).maybeSingle()
      : supaSemua.from("kuliah_pengaturan").select("nilai").eq("kunci", _rkrKunci(RK.th)).eq("ruang_id", RK.ruang).maybeSingle(),
    supaSemua.from("kuliah_pengaturan").select("nilai").eq("kunci", _rkrKunciCek(RK.th)).eq("ruang_id", "*").maybeSingle(),
  ]);
  RK.real = (a.data && a.data.nilai) || {};
  RK.cek = (b.data && b.data.nilai) || {};
}
// status satu kegiatan pada bulan m
function rkrStatus(r, m, th) {
  if (r && RKR_STATUS[r.status] && r.status !== "telat" && r.status !== "belum") return r.status;
  return m <= _rkrBulanIni(th) ? (m < _rkrBulanIni(th) || _rkrBulanIni(th) === 13 ? "telat" : "belum") : "belum";
}
// kegiatan terjadwal pada bulan m (dari data Draft RKAS mana pun)
function rkrKegiatanBulan(data, m) {
  const kel = (data && data.kel) || {};
  return Object.entries((data && data.item) || {}).filter(([, x]) => x && !x.dihapus && !x.coret && !(kel[x.kel] || {}).dihapus)
    .map(([id, x]) => ({ id, ...x, kelNama: (kel[x.kel] || {}).nama || "", rencana: rkBulan(x)[m] || 0 })).filter((x) => x.rencana > 0)
    .sort((a, b) => ((kel[a.kel] || {}).u || 0) - ((kel[b.kel] || {}).u || 0) || (a.u || 0) - (b.u || 0));
}
function rkrRingkasBulan(data, real, m, th) {
  const keg = rkrKegiatanBulan(data, m), o = { keg, n: keg.length, sudah: 0, tunda: 0, batal: 0, telat: 0, belum: 0, rencana: 0, real: 0, tanpaNota: 0 };
  keg.forEach((x) => { const r = (real || {})[x.id + ":" + m], st = rkrStatus(r, m, th); o[st]++; o.rencana += x.rencana; if (st === "sudah") { o.real += Number(r.rp) || 0; if (!((r.bukti || {}).nota || []).length) o.tanpaNota++; } });
  o.selesai = o.sudah + o.batal; return o;
}

// ── Tab ✅ Realisasi di halaman Draft RKAS ──
function _rkHtmlReal() {
  const th = RK.th, sekarang = _rkrBulanIni(th);
  if (RKR.bln == null || RKR.thBln !== th) { RKR.bln = sekarang >= 1 && sekarang <= 12 ? sekarang : 1; RKR.thBln = th; }
  const m = RKR.bln, o = rkrRingkasBulan(RK.data, RK.real, m, th), pemantau = RK.baca && _rkBolehLihatSemua(), lapor = !RK.baca && _rkBoleh();
  const chip = (b) => { const x = rkrRingkasBulan(RK.data, RK.real, b, th), w = !x.n ? "kosong" : x.selesai === x.n ? (x.tanpaNota ? "kurang" : "ok") : x.telat ? "telat" : x.sudah ? "sebagian" : "nanti"; return `<button class="rkr-bln ${w} ${b === m ? "aktif" : ""}" onclick="RKR.bln=${b};_rkGambar()"><b>${RK_BLN[b - 1]}</b><small>${x.n ? `${x.selesai}/${x.n}` : "—"}</small></button>`; };
  return `<div class="rkr">${pemantau && RKR.pantau ? `<button class="rkr-kembali" onclick="rkrBukaPantau(RK.th)">← Kembali ke Pantau Realisasi</button>` : ""}
    <div class="rkr-blns">${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(chip).join("")}</div>
    <div class="rkr-legenda"><span><i class="ok"></i>Lengkap</span><span><i class="sebagian"></i>Sebagian</span><span><i class="telat"></i>Ada yang terlambat</span><span><i class="kurang"></i>Nota belum lengkap</span></div>
    <div class="rkr-ringkas">
      <div><span>Kegiatan ${RK_BLN_PANJANG[m - 1]}</span><b>${o.selesai}/${o.n}</b><small>selesai dilaporkan</small></div>
      <div><span>Rencana</span><b>Rp ${_rkRp(o.rencana)}</b></div>
      <div class="${o.real > o.rencana ? "lebih" : ""}"><span>Realisasi</span><b>Rp ${_rkRp(o.real)}</b><small>${o.rencana ? Math.round((o.real / o.rencana) * 100) : 0}% dari rencana</small></div>
      <div class="${o.telat ? "merah" : ""}"><span>Belum Dilaporkan</span><b>${o.telat}</b><small>${o.tanpaNota ? `${o.tanpaNota} belum ada nota` : "kegiatan"}</small></div>
    </div>
    ${o.keg.length ? o.keg.map((x) => _rkrKartu(x, m, lapor, pemantau)).join("") : `<div class="rkx-kosong"><div>📭</div><b>Tidak ada kegiatan di bulan ${RK_BLN_PANJANG[m - 1]}</b><p>Kegiatan muncul di sini sesuai jadwal di tab <b>📅 Jadwal Bulanan</b>.</p></div>`}
    ${lapor ? `<p class="rkr-ket">💡 Laporkan setiap kegiatan yang sudah dilaksanakan beserta <b>nota/kwitansi</b> (wajib) dan <b>foto kegiatan</b> bila ada. Laporan langsung terlihat oleh Kepala PKBM &amp; Bendahara. Berkas disimpan di Arsip Google Drive PKBM.</p>` : ""}
  </div>`;
}
function _rkrKartu(x, m, lapor, pemantau) {
  const k = x.id + ":" + m, r = RK.real[k] || {}, st = rkrStatus(r, m, RK.th), [ik, lbl, w] = RKR_STATUS[st], c = RK.cek[RK.ruang + ":" + k];
  const bukti = r.bukti || {}, adaBukti = Object.keys(RKR_BUKTI).some((j) => (bukti[j] || []).length);
  return `<div class="rkr-kartu st-${st}" style="--st:${w}">
    <div class="rkr-atas"><div class="rkr-nama"><small>${_rkE(x.kelNama)}</small><b>${_rkE(x.uraian || x.kelNama || "—")}</b></div><span class="rkr-st">${ik} ${lbl}</span></div>
    <div class="rkr-angka"><span>Rencana <b>Rp ${_rkRp(x.rencana)}</b></span>${st === "sudah" ? `<span>Realisasi <b class="${(Number(r.rp) || 0) > x.rencana ? "rkx-merah" : ""}">Rp ${_rkRp(r.rp)}</b></span>${r.tgl ? `<span>📅 ${_rkE(new Date(r.tgl + "T00:00").toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }))}</span>` : ""}` : ""}</div>
    ${r.ket ? `<div class="rkr-ketx">📝 ${_rkE(r.ket)}</div>` : ""}
    ${adaBukti || st === "sudah" ? `<div class="rkr-bukti">${Object.entries(RKR_BUKTI).map(([j, d]) => { const n = (bukti[j] || []).length; return n ? `<button class="ada" onclick="rkrLihatDaftar('${k}','${j}')">${d.ikon} ${d.label}${n > 1 ? " ×" + n : ""}</button>` : j === "nota" && st === "sudah" ? `<span class="kurang">🧾 Nota belum diunggah</span>` : ""; }).join("")}</div>` : ""}
    ${c ? `<div class="rkr-cek ${c.status}">${c.status === "ok" ? "✔️ Sudah diperiksa" : "⚠️ Perlu perbaikan"} oleh ${_rkE(c.oleh || "Pengelola")}${c.catatan ? `: <i>${_rkE(c.catatan)}</i>` : ""}</div>` : ""}
    ${r.oleh ? `<div class="rkr-oleh">Dilaporkan ${_rkE(r.oleh)}${r.t ? " · " + new Date(r.t).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" }) : ""}</div>` : ""}
    <div class="rkr-aksi">${lapor ? `<button class="btn btn-sm ${st === "sudah" || st === "tunda" || st === "batal" ? "btn-outline" : "btn-accent"}" onclick="rkrLapor('${x.id}',${m})">${st === "telat" || st === "belum" ? "📝 Laporkan" : "✏️ Ubah Laporan"}</button>` : ""}
      ${pemantau && (st === "sudah" || st === "tunda" || st === "batal") ? `<button class="btn btn-sm btn-outline" onclick="rkrCek('${k}','ok')">✔️ Diperiksa</button><button class="btn btn-sm btn-ghost" onclick="rkrCek('${k}','perbaiki')">⚠️ Perlu Perbaikan</button>` : ""}</div>
  </div>`;
}
// ── Lapor realisasi satu kegiatan ──
function rkrLapor(id, m) {
  const x = rkrKegiatanBulan(RK.data, m).find((y) => y.id === id); if (!x) return;
  const k = id + ":" + m, r = RK.real[k] || {};
  RKR.edit = { k, id, m, x, status: r.status && r.status !== "telat" ? r.status : "sudah", bukti: JSON.parse(JSON.stringify(r.bukti || {})) };
  const tgl = r.tgl || (() => { const d = new Date(); return d.getFullYear() === RK.th && d.getMonth() + 1 === m ? d.toISOString().slice(0, 10) : `${RK.th}-${String(m).padStart(2, "0")}-01`; })();
  openModal(`<div class="rkr-modal"><h3>📝 Laporan Realisasi</h3>
    <div class="rkx-jd-info"><b>${_rkE(x.uraian || x.kelNama)}</b><span>${_rkE(x.kelNama)} · ${RK_BLN_PANJANG[m - 1]} ${RK.th} · rencana <b>Rp ${_rkRp(x.rencana)}</b></span></div>
    <div class="rkr-pilih">${["sudah", "tunda", "batal"].map((s) => `<label class="${RKR.edit.status === s ? "on" : ""}" style="--st:${RKR_STATUS[s][2]}"><input type="radio" name="rkr-st" value="${s}" ${RKR.edit.status === s ? "checked" : ""} onchange="RKR.edit.status=this.value;document.querySelectorAll('.rkr-pilih label').forEach(l=>l.classList.toggle('on',l.querySelector('input').checked));document.getElementById('rkr-sudah').style.display=this.value==='sudah'?'':'none'">${RKR_STATUS[s][0]} ${RKR_STATUS[s][1]}</label>`).join("")}</div>
    <div id="rkr-sudah" style="${RKR.edit.status === "sudah" ? "" : "display:none"}">
      <div class="rkr-dua"><div class="field"><label>Nominal Realisasi (Rp)</label><input id="rkr-rp" class="input" inputmode="numeric" oninput="_rkFormatKetik(this)" value="${_rkTampil(Math.round(Number(r.rp) || x.rencana))}" onblur="this.value=_rkTampil(_rkAngka(this.value))"></div>
        <div class="field"><label>Tanggal</label><input id="rkr-tgl" class="input" type="date" value="${_rkE(tgl)}"></div></div>
    </div>
    <div class="field"><label>Keterangan <small>(toko, no. nota, alasan ditunda, dll.)</small></label><input id="rkr-ket" class="input" value="${_rkE(r.ket || "")}" placeholder="mis. Toko Barokah, nota no. 123 / ditunda ke bulan depan"></div>
    <div class="rkr-unggah" id="rkr-unggah">${_rkrHtmlUnggah()}</div>
    <div id="rkr-awas" class="rkr-awas" style="display:none">⚠️ <b>Nota / kwitansi belum diunggah.</b> Tekan <b>Simpan Laporan</b> sekali lagi untuk tetap menyimpan — kegiatan akan ditandai "nota belum lengkap".</div>
    <div style="display:flex;gap:10px;margin-top:14px"><button class="btn btn-outline" style="flex:1" onclick="closeModal()">Batal</button><button class="btn btn-accent" style="flex:1" onclick="rkrSimpan()">💾 Simpan Laporan</button></div></div>`);
}
function _rkrHtmlUnggah() {
  const b = RKR.edit.bukti;
  return Object.entries(RKR_BUKTI).map(([j, d]) => `<div class="rkr-u"><div><b>${d.ikon} ${d.label}</b>${j === "nota" ? '<small class="wajib">wajib bila sudah dilaksanakan</small>' : "<small>opsional</small>"}</div>
    <div class="rkr-u-daftar">${(b[j] || []).map((f, i) => `<span><a href="#" onclick="event.preventDefault();rkrLihat(RKR.edit.bukti['${j}'][${i}])">${_rkE(f.nama.length > 28 ? f.nama.slice(0, 26) + "…" : f.nama)}</a><button title="Lepas" onclick="RKR.edit.bukti['${j}'].splice(${i},1);document.getElementById('rkr-unggah').innerHTML=_rkrHtmlUnggah()">✕</button></span>`).join("")}
      <button class="rkr-tambah" onclick="rkrUnggah('${j}')">＋ ${j === "foto" ? "Foto" : "Berkas"}</button></div></div>`).join("");
}
async function rkrUnggah(jenis) {
  const d = RKR_BUKTI[jenis], E = RKR.edit; if (!E) return;
  const f = await arsipPilihBerkas(jenis === "foto" ? "image/*" : "image/*,application/pdf"); if (!f) return;
  const nm = typeof _bspNamaRuang === "function" ? _bspNamaRuang(RK.ruang) : RK.ruang;
  try {
    if (typeof setGlobalLoading === "function") setGlobalLoading(true, `Mengunggah ${d.label.toLowerCase()} ke Arsip Drive…`);
    const h = await arsipUnggah(f, {
      jalur: ["03 BOSP", String(RK.th), d.folder, String(E.m).padStart(2, "0") + " " + RK_BLN_PANJANG[E.m - 1], nm],
      nama: arsipNamaBerkas([d.label.split(" ")[0], nm, E.x.uraian || E.x.kelNama]),
      ket: `Draft RKAS ${RK.th} · ${nm} · ${E.x.kelNama} · ${E.x.uraian || ""}`,
    });
    (E.bukti[jenis] = E.bukti[jenis] || []).push({ id: h.id, url: h.url, nama: h.nama, t: Date.now() });
    const el = document.getElementById("rkr-unggah"); if (el) el.innerHTML = _rkrHtmlUnggah();
    toast(`${d.label} terunggah ✓ — jangan lupa tekan Simpan Laporan`, "ok");
  } catch (e) { toast("Gagal mengunggah: " + (e.message || e), "err"); }
  finally { if (typeof setGlobalLoading === "function") setGlobalLoading(false); }
}
async function rkrSimpan() {
  const E = RKR.edit; if (!E) return;
  const isi = { status: E.status, ket: (qs("rkr-ket").value || "").trim(), bukti: E.bukti, oleh: STATE.guruNama || "", t: Date.now() };
  if (E.status === "sudah") {
    isi.rp = _rkAngka(qs("rkr-rp").value); isi.tgl = qs("rkr-tgl").value || null;
    if (!isi.rp) { toast("Isi nominal realisasi", "warn"); return; }
    // tanpa nota: peringatan di dalam jendela; tekan Simpan sekali lagi untuk tetap menyimpan
    if (!(E.bukti.nota || []).length && !E.tanpaNotaOk) { E.tanpaNotaOk = true; const w = document.getElementById("rkr-awas"); if (w) { w.style.display = ""; w.scrollIntoView({ block: "nearest", behavior: "smooth" }); } return; }
  }
  try {
    await _kvGabung(_rkrKunci(RK.th), { [E.k]: isi });
    RK.real[E.k] = isi; closeModal(); _rkGambar(); toast("✅ Laporan realisasi tersimpan — langsung terlihat di Pengelola", "ok");
  } catch (e) { toast("Gagal menyimpan: " + (e.message || e), "err"); }
}
// ── Lihat bukti (pengunggah lewat skrip; Pengelola/Admin dibuka di Google Drive) ──
async function rkrLihat(b) {
  if (!b) return;
  const w = window.open("", "_blank");
  try {
    const j = await _arsipKirim({ aksi: "lihat", id: b.id });
    const bin = atob(j.data), u8 = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
    const url = URL.createObjectURL(new Blob([u8], { type: j.mime })); if (w) w.location = url; else window.open(url, "_blank");
  } catch (e) { if (w && b.url) { w.location = b.url; return; } if (w) w.close(); toast(e.message || String(e), "err"); }
}
function rkrLihatDaftar(k, jenis) {
  const daftar = ((RK.real[k] || {}).bukti || {})[jenis] || [];
  if (daftar.length === 1) return rkrLihat(daftar[0]);
  RKR.lihat = daftar;
  openModal(`<h3>${RKR_BUKTI[jenis].ikon} ${RKR_BUKTI[jenis].label}</h3>${daftar.map((x, i) => `<div style="padding:8px 0;border-bottom:1px dashed var(--border-soft)"><a href="#" onclick="event.preventDefault();rkrLihat(RKR.lihat[${i}])">${_rkE(x.nama)}</a></div>`).join("")}`);
}
// ── Pengelola: tandai diperiksa / perlu perbaikan ──
async function rkrCek(k, status) {
  if (!_rkBolehLihatSemua()) return;
  let catatan = "";
  if (status === "perbaiki") { catatan = (await promptTema("Apa yang perlu diperbaiki? (mis. nota buram, nominal tidak sesuai)", "", { judul: "Perlu Perbaikan", ikon: "⚠️", teksOk: "Kirim Catatan" })) || ""; if (!catatan.trim()) return; }
  const kunci = RK.ruang + ":" + k, isi = { status, catatan: catatan.trim(), oleh: STATE.guruNama || "", t: Date.now() };
  try { await _bspGabungUmum(_rkrKunciCek(RK.th), { [kunci]: isi }); RK.cek[kunci] = isi; _rkGambar(); toast(status === "ok" ? "Ditandai sudah diperiksa ✔️" : "Catatan perbaikan dikirim ⚠️", "ok"); }
  catch (e) { toast("Gagal: " + (e.message || e), "err"); }
}

// ============================================================
//  PENGELOLA → 📋 PANTAU REALISASI JENJANG
// ============================================================
const RKR_RUANG = ["A", "Pa", "Pi"];
async function rkrBukaPantau(th) {
  if (!_rkBolehLihatSemua()) { toast("Halaman ini untuk Kepala PKBM, Bendahara, dan Admin.", "warn"); return; }
  const P = (RKR.pantau = RKR.pantau || {}); P.th = th || P.th || new Date().getFullYear();
  if (P.bln == null || P.thBln !== P.th) { const b = _rkrBulanIni(P.th); P.bln = b >= 1 && b <= 12 ? b : 1; P.thBln = P.th; }
  const sec = _rgBukaHal("pg-rkas-real", "Pantau Realisasi Jenjang", `<div class="card"><div class="rg-memuat">Memuat laporan realisasi tiap jenjang…</div></div>`);
  try {
    const [r, c, g, p] = await Promise.all([
      supaSemua.from("kuliah_pengaturan").select("ruang_id,kunci,nilai").in("kunci", [_rkKunci(P.th), _rkrKunci(P.th)]).in("ruang_id", RKR_RUANG),
      supaSemua.from("kuliah_pengaturan").select("nilai").eq("kunci", _rkrKunciCek(P.th)).eq("ruang_id", "*").maybeSingle(),
      supaSemua.from("guru").select("id,nama,no_wa,ruang_pendamping,status_aktif"),
      supaSemua.from("kuliah_pengaturan").select("ruang_id,nilai").eq("kunci", "penyelenggara").in("ruang_id", RKR_RUANG),
    ]);
    if (r.error) throw r.error;
    P.d = Object.fromEntries(RKR_RUANG.map((x) => [x, { data: { kel: {}, item: {} }, real: {} }]));
    (r.data || []).forEach((x) => { if (!P.d[x.ruang_id]) return; if (x.kunci === _rkKunci(P.th)) P.d[x.ruang_id].data = x.nilai || { kel: {}, item: {} }; else P.d[x.ruang_id].real = x.nilai || {}; });
    P.cek = (c.data && c.data.nilai) || {};
    const peny = Object.fromEntries((p.data || []).map((x) => [x.ruang_id, (x.nilai && x.nilai.ids) || []]));
    const guru = (g.data || []).filter((x) => x.status_aktif !== false);
    P.kontak = Object.fromEntries(RKR_RUANG.map((rg) => [rg, guru.filter((x) => (x.ruang_pendamping || []).includes(rg) || (peny[rg] || []).includes(x.id)).map((x) => ({ ...x, peran: (peny[rg] || []).includes(x.id) ? "Penyelenggara" : "Admin Pendamping" }))]));
  } catch (e) { sec.innerHTML = `<div class="card">Gagal memuat: ${_rkE(e.message || e)}</div>`; return; }
  _rkrGambarPantau();
}
function _rkrGambarPantau() {
  const sec = qs("page-rg"); if (!sec || STATE.currentPage !== "pg-rkas-real") return;
  const P = RKR.pantau, th = P.th, m = P.bln, nm = (r) => (typeof _bspNamaRuang === "function" ? _bspNamaRuang(r) : r), sek = _rkrBulanIni(th);
  const kartu = (rg) => {
    const D = P.d[rg], o = rkrRingkasBulan(D.data, D.real, m, th), pct = o.n ? Math.round((o.selesai / o.n) * 100) : 0;
    const warna = !o.n ? "#94a3b8" : pct === 100 && !o.tanpaNota ? "#16a34a" : o.telat ? "#dc2626" : "#d97706";
    return `<div class="rkr-pk" style="--w:${warna}">
      <div class="rkr-pk-atas"><b>${_rkE(nm(rg))}</b><span class="rkr-cincin" style="--p:${pct}"><i>${o.n ? pct + "%" : "—"}</i></span></div>
      ${o.n ? `<div class="rkr-pk-angka"><span>✅ ${o.sudah} sudah</span>${o.tunda ? `<span>⏸️ ${o.tunda} ditunda</span>` : ""}${o.batal ? `<span>🚫 ${o.batal} batal</span>` : ""}${o.telat ? `<span class="merah">⏰ ${o.telat} belum lapor</span>` : ""}${o.belum ? `<span>⏳ ${o.belum} belum waktunya</span>` : ""}${o.tanpaNota ? `<span class="merah">🧾 ${o.tanpaNota} tanpa nota</span>` : ""}</div>
        <div class="rkr-pk-rp"><span>Rencana <b>Rp ${_rkRp(o.rencana)}</b></span><span>Realisasi <b>Rp ${_rkRp(o.real)}</b></span></div>` : `<p class="rkr-pk-kosong">Tidak ada kegiatan terjadwal${Object.keys(D.data.item || {}).length ? "" : " — Draft RKAS belum disusun"}.</p>`}
      <div class="rkr-pk-aksi"><button class="btn btn-sm btn-outline" onclick="RKR.bln=${m};RKR.thBln=${th};RK.tab='real';rkBuka(${th},'${rg}')">🔍 Lihat Rincian</button>${o.telat || o.tanpaNota ? `<button class="btn btn-sm btn-wa" onclick="rkrWa('${rg}')">💬 WA Pengingat</button>` : ""}</div>
    </div>`;
  };
  const peta = RKR_RUANG.map((rg) => `<tr><th>${_rkE(nm(rg))}</th>${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((b) => { const D = P.d[rg], o = rkrRingkasBulan(D.data, D.real, b, th); const w = !o.n ? "kosong" : o.selesai === o.n ? (o.tanpaNota ? "kurang" : "ok") : o.telat ? "telat" : o.sudah ? "sebagian" : "nanti"; return `<td class="${w} ${b === m ? "aktif" : ""}" onclick="RKR.pantau.bln=${b};_rkrGambarPantau()" title="${RK_BLN_PANJANG[b - 1]}: ${o.n ? `${o.selesai}/${o.n} selesai` : "tidak ada kegiatan"}">${o.n ? `${o.selesai}/${o.n}` : ""}</td>`; }).join("")}</tr>`).join("");
  sec.innerHTML = `<div class="rkx rkr-pantau">
    <div class="rkx-hero"><div class="rkx-hero-ikon">${_rkIk('<path d="M9 11l3 3 8-8"/><path d="M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9"/>')}</div>
      <div class="rkx-hero-teks"><span class="rkx-hero-label">BOSP Kesetaraan · Kepala PKBM &amp; Bendahara</span><h3>Pantau Realisasi Jenjang</h3>
        <p>Laporan pelaksanaan anggaran Draft RKAS dari tiap jenjang, lengkap dengan nota &amp; foto kegiatan. Jenjang yang belum melapor bisa langsung diingatkan lewat WA.</p>
        <div class="rkx-hero-chip"><span>${_rkIk('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>')} Tahun <select onchange="rkrBukaPantau(+this.value)">${[th - 1, th, th + 1].map((y) => `<option ${y === th ? "selected" : ""}>${y}</option>`).join("")}</select></span>
          <span>${_rkIk('<path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>')} <a href="#" style="color:#fff" onclick="event.preventDefault();rkrCetakKunjungan()">Bahan Kunjungan</a></span></div></div></div>
    <div class="card rkr-peta-kartu"><h4>Peta Realisasi Setahun <small>(ketuk bulan)</small></h4>
      <div class="rkr-peta-wrap"><table class="rkr-peta"><thead><tr><th></th>${RK_BLN.map((b, i) => `<th class="${i + 1 === sek ? "kini" : ""}">${b}</th>`).join("")}</tr></thead><tbody>${peta}</tbody></table></div>
      <div class="rkr-legenda"><span><i class="ok"></i>Lengkap</span><span><i class="sebagian"></i>Sebagian</span><span><i class="telat"></i>Ada yang belum lapor</span><span><i class="kurang"></i>Nota belum lengkap</span><span><i class="nanti"></i>Belum waktunya</span></div></div>
    <h3 class="rkr-judul-bln">${RK_BLN_PANJANG[m - 1]} ${th}</h3>
    <div class="rkr-pk-grid">${RKR_RUANG.map(kartu).join("")}</div>
  </div>`;
}
// ── WA pengingat ke Admin Pendamping / Penyelenggara jenjang ──
function rkrWa(rg) {
  const P = RKR.pantau, m = P.bln, D = P.d[rg], nm = typeof _bspNamaRuang === "function" ? _bspNamaRuang(rg) : rg;
  const o = rkrRingkasBulan(D.data, D.real, m, P.th);
  const telat = o.keg.filter((x) => rkrStatus(D.real[x.id + ":" + m], m, P.th) === "telat");
  const tanpa = o.keg.filter((x) => { const r = D.real[x.id + ":" + m]; return r && r.status === "sudah" && !((r.bukti || {}).nota || []).length; });
  const kontak = P.kontak[rg] || [], jab = rkKepalaPkbm() ? "Kepala PKBM" : "Bendahara BOSP";
  const sapa = (nama) => (!nama ? "" : /^(ustadz|ustadzah|ust\.?|ustz\.?|bapak|ibu|pak|bu)\b/i.test(nama) ? nama : "Ustadz/Ustadzah " + nama);
  const teks = (nama) => [`Assalamu'alaikum${nama ? " " + sapa(nama) : ""},`, "",
    `Mengingatkan laporan realisasi anggaran *${nm}* bulan *${RK_BLN_PANJANG[m - 1]} ${P.th}* di aplikasi PKBM:`,
    ...(telat.length ? ["", "Belum dilaporkan:", ...telat.map((x, i) => `${i + 1}. ${x.uraian || x.kelNama} (rencana Rp ${_rkRp(x.rencana)})`)] : []),
    ...(tanpa.length ? ["", "Sudah dilaporkan, tetapi nota/kwitansi belum diunggah:", ...tanpa.map((x, i) => `${i + 1}. ${x.uraian || x.kelNama}`)] : []),
    "", "Mohon segera dilaksanakan atau dilaporkan beserta bukti (nota & foto kegiatan) lewat menu Draft RKAS > Realisasi.", "", "Jazakumullahu khairan.", `${STATE.guruNama || ""} — ${jab}`].join("\n");
  RKR.waTeks = teks;
  openModal(`<h3>💬 WA Pengingat · ${_rkE(nm)}</h3>
    <div class="uj-sub" style="margin-bottom:8px">${telat.length} kegiatan belum dilaporkan${tanpa.length ? `, ${tanpa.length} tanpa nota` : ""} di bulan ${RK_BLN_PANJANG[m - 1]}.</div>
    <div class="rkr-wa-daftar">${kontak.map((g, i) => { const w = typeof normalisasiNomorWa === "function" ? normalisasiNomorWa(g.no_wa) : { valid: false }; return `<div class="rkr-wa"><div><b>${_rkE(g.nama)}</b><small>${g.peran}${w.valid ? "" : " · nomor WA belum diisi"}</small></div>${w.valid ? `<a class="btn btn-sm btn-wa" target="_blank" rel="noopener" href="https://wa.me/${w.nomor}?text=${encodeURIComponent(teks(String(g.nama).split(",")[0]))}">Kirim WA</a>` : `<button class="btn btn-sm btn-outline" disabled>Tanpa nomor</button>`}</div>`; }).join("") || `<p class="uj-sub">Belum ada Admin Pendamping / Penyelenggara di jenjang ini (atur di Pengaturan Ruang → Guru Per Ruang).</p>`}</div>
    <details class="je-atur" style="margin-top:10px"><summary>Lihat isi pesan</summary><pre class="rkr-wa-teks">${_rkE(teks(""))}</pre></details>
    <button class="btn btn-outline" style="width:100%;margin-top:10px" onclick="window.open('https://wa.me/?text='+encodeURIComponent(RKR.waTeks('')),'_blank','noopener')">Kirim ke Grup / Nomor Lain</button>`);
}
// ── Bahan kunjungan: ringkasan per jenjang sampai bulan berjalan, siap cetak ──
function rkrCetakKunjungan() {
  const P = RKR.pantau, th = P.th, sampai = Math.min(12, Math.max(1, _rkrBulanIni(th))), nm = (r) => (typeof _bspNamaRuang === "function" ? _bspNamaRuang(r) : r);
  const bagian = RKR_RUANG.map((rg) => {
    const D = P.d[rg]; let tot = { n: 0, selesai: 0, rencana: 0, real: 0 }; const masalah = [];
    for (let b = 1; b <= sampai; b++) {
      const o = rkrRingkasBulan(D.data, D.real, b, th); tot.n += o.n; tot.selesai += o.selesai; tot.rencana += o.rencana; tot.real += o.real;
      o.keg.forEach((x) => { const r = D.real[x.id + ":" + b], st = rkrStatus(r, b, th), c = P.cek[rg + ":" + x.id + ":" + b];
        if (st === "telat") masalah.push([RK_BLN[b - 1], x.uraian || x.kelNama, "Belum dilaporkan", x.rencana]);
        else if (st === "sudah" && !((r.bukti || {}).nota || []).length) masalah.push([RK_BLN[b - 1], x.uraian || x.kelNama, "Nota belum diunggah", r.rp]);
        else if (st === "tunda") masalah.push([RK_BLN[b - 1], x.uraian || x.kelNama, "Ditunda" + (r.ket ? ": " + r.ket : ""), x.rencana]);
        else if (c && c.status === "perbaiki") masalah.push([RK_BLN[b - 1], x.uraian || x.kelNama, "Perlu perbaikan: " + (c.catatan || ""), r && r.rp]); });
    }
    const kontak = (P.kontak[rg] || []).map((g) => `${g.nama} (${g.peran})`).join(", ") || "—";
    return `<section><h2>${_rkE(nm(rg))}</h2><p class="k">Penanggung jawab: ${_rkE(kontak)}</p>
      <table class="r"><tr><td>Kegiatan s.d. ${RK_BLN_PANJANG[sampai - 1]}</td><td><b>${tot.selesai}/${tot.n}</b> selesai dilaporkan</td><td>Rencana</td><td><b>Rp ${_rkRp(tot.rencana)}</b></td><td>Realisasi</td><td><b>Rp ${_rkRp(tot.real)}</b> (${tot.rencana ? Math.round((tot.real / tot.rencana) * 100) : 0}%)</td></tr></table>
      ${masalah.length ? `<table class="m"><thead><tr><th>Bulan</th><th>Kegiatan</th><th>Catatan</th><th>Nominal</th><th>Hasil Kunjungan</th></tr></thead><tbody>${masalah.map((x) => `<tr><td>${x[0]}</td><td>${_rkE(x[1])}</td><td>${_rkE(x[2])}</td><td style="text-align:right">${x[3] ? _rkRp(x[3]) : "—"}</td><td></td></tr>`).join("")}</tbody></table>` : `<p class="ok">✔ Semua kegiatan sudah dilaporkan lengkap dengan nota.</p>`}</section>`;
  }).join("");
  const w = window.open("", "_blank"); if (!w) { toast("Izinkan jendela baru untuk mencetak", "warn"); return; }
  w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Bahan Kunjungan Realisasi ${th}</title><style>
    body{font-family:Arial,sans-serif;font-size:11pt;color:#111;margin:18mm}h1{font-size:15pt;margin:0}h2{font-size:12.5pt;margin:16px 0 2px;border-bottom:2px solid #0f5f57;padding-bottom:3px}
    .sub{color:#444;margin:2px 0 10px}.k{margin:2px 0 6px;font-size:10pt;color:#333}table{border-collapse:collapse;width:100%;margin:4px 0}td,th{border:1px solid #999;padding:4px 6px;font-size:10pt;vertical-align:top}
    th{background:#eef2f1}table.r td{border-color:#ccc}table.m td:last-child{width:28%}.ok{color:#166534}section{page-break-inside:avoid}
    .ttd{margin-top:28px;display:flex;justify-content:flex-end}.ttd div{text-align:center;width:220px}@media print{body{margin:12mm}}</style></head><body>
    <h1>Bahan Kunjungan — Realisasi Anggaran Jenjang</h1><div class="sub">PKBM Al-Umm Barabai · Draft RKAS ${th} · data s.d. ${RK_BLN_PANJANG[sampai - 1]} ${th} · dicetak ${new Date().toLocaleDateString("id-ID", { dateStyle: "long" })}</div>
    ${bagian}<div class="ttd"><div>Barabai, ${new Date().toLocaleDateString("id-ID", { dateStyle: "long" })}<br>${rkKepalaPkbm() ? "Kepala PKBM" : "Bendahara BOSP"}<br><br><br><br><b>${_rkE(STATE.guruNama || "")}</b></div></div>
    <script>setTimeout(()=>print(),400)<\/script></body></html>`);
  w.document.close();
}

// ── Menu Pengelola ──
(function rkrPasang() {
  if (typeof RG_IKON !== "undefined") RG_IKON["pg-rkas-real"] = '<path d="M9 11l3 3 8-8"/><path d="M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9"/>';
  if (typeof RG_MENU_PENGELOLA !== "undefined") {
    const k = RG_MENU_PENGELOLA.find((g) => g.group === "Keuangan");
    if (k && !k.items.some((x) => x[0] === "pg-rkas-real")) { const i = k.items.findIndex((x) => x[0] === "pg-rkas"); k.items.splice(i >= 0 ? i + 1 : k.items.length, 0, ["pg-rkas-real", "", "Pantau Realisasi Jenjang"]); }
  }
  if (typeof PG_MODUL_SIAP !== "undefined" && !PG_MODUL_SIAP.includes("pg-rkas-real")) PG_MODUL_SIAP.push("pg-rkas-real");
  if (typeof rgBukaPengelola === "function") {
    const asli = rgBukaPengelola;
    rgBukaPengelola = async function (key) { if (key === "pg-rkas-real") return rkrBukaPantau(); return asli.apply(this, arguments); };
  }
})();

// ============================================================
//  ✉️ KOP AMPLOP SOAL — label yang ditempel di depan amplop cokelat soal ujian
//  • Diambil otomatis dari Jadwal Ujian: tiap slot (hari × sesi × kelas) berisi mapel = satu kop
//    (mata pelajaran, kelas & paket, hari/tanggal, jam & lama ujian, pengawas).
//  • Kepala kop (judul, ruang, semester, tahun ajaran, izin operasional, NPSN, alamat) terisi bawaan,
//    bisa diubah & disimpan (kv "kop:amplop" per ruang).
//  • Cetak A4 / F4, 4 atau 5 kop per lembar dengan garis potong — hemat kertas.
// ============================================================
const KOPAM = { j: null, opsi: null };
const KOPAM_BAWAAN = {
  judul: "ASESMEN SUMATIF", lembaga: "PKBM AL UMM BARABAI",
  izin: "Izin Operasional PKBM Nomor: 421.9/ 182 /PD.2/DIK/2019", npsn: "P9970482",
  alamat: "Jl. Masjid Al Umm Komp. Bulau Indah Baru Ds. Banua Binjai RT.09 Kec. Barabai Kab. Hulu Sungai Tengah",
  alamat2: "Provinsi Kalimantan Selatan, Kode Pos 71315 · Email: pkbm.alumm@gmail.com",
};
const KOPAM_JUDUL_JENIS = { uas: "ASESMEN SUMATIF AKHIR SEMESTER", uts: "ASESMEN SUMATIF TENGAH SEMESTER", tahfizh: "UJIAN TAHFIZH", lain: "ASESMEN SUMATIF" };
const _kopamE = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const _kopamNoKelas = (kelasId) => parseInt(String(((LOOKUP.kelas || []).find((k) => k.id === kelasId) || {}).nama_kelas || "").match(/\d+/)?.[0] || "0", 10);
const _kopamNamaKelas = (kelasId) => ((LOOKUP.kelas || []).find((k) => k.id === kelasId) || {}).nama_kelas || "";
const _kopamPaket = (n) => (n >= 10 ? "Paket C" : n >= 7 ? "Paket B" : n >= 1 ? "Paket A" : "");
const _kopamSetara = (n) => (n >= 10 ? "SETARA SMA" : n >= 7 ? "SETARA SMP" : "SETARA SD");
const _kopamRuang = () => ({ Pa: "RUMAH TAHFIZH PUTRA", Pi: "RUMAH TAHFIZH PUTRI", A: "" }[STATE.ruang] || "");
const _kopamMenit = (a, b) => { const m = (s) => { const [h, mm] = String(s || "0:0").split(":").map(Number); return h * 60 + (mm || 0); }; return Math.max(0, m(b) - m(a)); };
function _kopamSemesterTa(tgl) {
  const d = new Date((tgl || "") + "T00:00:00"), y = d.getFullYear(), bln = d.getMonth();
  return { semester: bln >= 6 ? "GANJIL" : "GENAP", ta: bln >= 6 ? `${y}/${y + 1}` : `${y - 1}/${y}` };
}

async function kopamBuka(jadwalId) {
  const j = (typeof JU !== "undefined" && (JU.edit?.id === jadwalId ? JU.edit : JU.daftar.find((x) => x.id === jadwalId))) || null;
  if (!j) { toast("Jadwal ujian tidak ditemukan", "err"); return; }
  KOPAM.j = j;
  const simpan = (await _kvAmbil("kop:amplop", {}).catch(() => ({}))) || {};
  const st = _kopamSemesterTa(j.mulai);
  KOPAM.opsi = { ...KOPAM_BAWAAN, ...simpan, judul: simpan.judulTetap ? simpan.judul : KOPAM_JUDUL_JENIS[j.jenis] || KOPAM_BAWAAN.judul, semester: st.semester, ta: st.ta,
    kertas: simpan.kertas || "F4", per: Number(simpan.per) || 5, hari: j.hari.filter((t) => _kopamSlot(j, [t]).length), kelas: [...j.kelas], paketKompetensi: simpan.paketKompetensi ?? "" };
  _kopamGambar();
}
// semua slot berisi mapel pada hari terpilih → daftar kop
function _kopamSlot(j, hari, kelas) {
  const out = [];
  (hari || j.hari).forEach((t) => (j.sesi || []).forEach((s0) => (kelas || j.kelas).forEach((k) => {
    const x = (j.slot || {})[_juKunci(t, s0.id, k)]; const label = typeof _juLabelSlot === "function" ? _juLabelSlot(x) : ""; if (!label) return;
    const s = typeof _juSesiPada === "function" ? _juSesiPada(j, t, s0) : s0;
    out.push({ t, s, k, mapel: label, pengawas: (x.p || []).map((g) => (typeof _juNamaGelar === "function" ? _juNamaGelar(g) : g)), ruang: x.ruang || "" });
  })));
  return out;
}
function _kopamGambar() {
  const j = KOPAM.j, o = KOPAM.opsi, daftar = _kopamSlot(j, o.hari, o.kelas), lembar = Math.ceil(daftar.length / o.per);
  const hariNama = (t) => new Date(t + "T00:00:00").toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short" });
  openModal(`<div class="ka-modal"><h3>✉️ Kop Amplop Soal — ${_kopamE(j.judul)}</h3>
    <p class="bsp-ket">Satu kop untuk tiap mapel per kelas di jadwal ujian. Tempel di depan amplop soal. Isian di bawah tersimpan untuk ujian berikutnya.</p>
    <div class="ka-grid">
      <label>Judul<input class="input" value="${_kopamE(o.judul)}" oninput="KOPAM.opsi.judul=this.value"></label>
      <label>Semester<select class="input" onchange="KOPAM.opsi.semester=this.value">${["GANJIL", "GENAP"].map((x) => `<option ${o.semester === x ? "selected" : ""}>${x}</option>`).join("")}</select></label>
      <label>Tahun Ajaran<input class="input" value="${_kopamE(o.ta)}" oninput="KOPAM.opsi.ta=this.value"></label>
      <label>Paket Kompetensi <small>(kosongkan bila ditulis tangan)</small><input class="input" value="${_kopamE(o.paketKompetensi)}" oninput="KOPAM.opsi.paketKompetensi=this.value" placeholder="mis. Paket 1"></label>
    </div>
    <details class="ka-identitas"><summary>🏫 Identitas Lembaga di Kop</summary><div class="ka-grid">
      <label>Nama Lembaga<input class="input" value="${_kopamE(o.lembaga)}" oninput="KOPAM.opsi.lembaga=this.value"></label>
      <label>NPSN<input class="input" value="${_kopamE(o.npsn)}" oninput="KOPAM.opsi.npsn=this.value"></label>
      <label class="lebar">Izin Operasional<input class="input" value="${_kopamE(o.izin)}" oninput="KOPAM.opsi.izin=this.value"></label>
      <label class="lebar">Alamat (baris 1)<input class="input" value="${_kopamE(o.alamat)}" oninput="KOPAM.opsi.alamat=this.value"></label>
      <label class="lebar">Alamat (baris 2)<input class="input" value="${_kopamE(o.alamat2)}" oninput="KOPAM.opsi.alamat2=this.value"></label></div></details>
    <div class="ka-baris"><span>Hari</span><div class="bk2-chip">${j.hari.filter((t) => _kopamSlot(j, [t]).length).map((t) => `<button class="${o.hari.includes(t) ? "on" : ""}" style="--cw:#0284c7" onclick="KOPAM.opsi.hari=KOPAM.opsi.hari.includes('${t}')?KOPAM.opsi.hari.filter(x=>x!=='${t}'):[...KOPAM.opsi.hari,'${t}'].sort();_kopamGambar()">${hariNama(t)}</button>`).join("")}</div></div>
    <div class="ka-baris"><span>Kelas</span><div class="bk2-chip">${j.kelas.map((k) => `<button class="${o.kelas.includes(k) ? "on" : ""}" style="--cw:${(typeof _JU_WARNA_KELAS !== "undefined" && _JU_WARNA_KELAS[_kopamNoKelas(k)]) || "#475569"}" onclick="KOPAM.opsi.kelas=KOPAM.opsi.kelas.includes('${k}')?KOPAM.opsi.kelas.filter(x=>x!=='${k}'):[...KOPAM.opsi.kelas,'${k}'];_kopamGambar()">${_kopamE(_kopamNamaKelas(k))}</button>`).join("")}</div></div>
    <div class="ka-baris"><span>Kertas</span><div class="bk2-chip">${[["A4", 4], ["A4", 5], ["F4", 4], ["F4", 5]].map(([kt, n]) => `<button class="${o.kertas === kt && o.per === n ? "on" : ""}" style="--cw:#8a5523" onclick="KOPAM.opsi.kertas='${kt}';KOPAM.opsi.per=${n};_kopamGambar()">${kt} · ${n} per lembar</button>`).join("")}</div></div>
    <div class="ka-ringkas">📄 <b>${daftar.length}</b> kop → <b>${lembar}</b> lembar ${o.kertas} (${o.per} kop per lembar)${daftar.some((d) => !d.pengawas.length) ? ` · <span class="ka-peringatan">⚠️ ${daftar.filter((d) => !d.pengawas.length).length} kop belum ada pengawasnya</span>` : ""}</div>
    <div class="ka-pratinjau">${daftar.slice(0, 1).map((d) => _kopamHtmlKop(d, o, true)).join("") || '<p class="cpk-redup">Tidak ada slot ujian pada pilihan ini.</p>'}<small>Pratinjau kop pertama</small></div>
    <div class="bsp-aksi-bawah"><button class="btn btn-outline" onclick="closeModal()">Tutup</button><button class="btn btn-accent" onclick="kopamCetak()" ${daftar.length ? "" : "disabled"}>🖨️ Cetak ${daftar.length} Kop</button></div></div>`, { lebar: true });
}
function _kopamHtmlKop(d, o, pratinjau) {
  const n = _kopamNoKelas(d.k), p = STATE.pengaturan || {}, logo = p.logo_kiri_url || p.logo_kanan_url || (typeof urlLogoSekolah === "function" ? urlLogoSekolah() : "");
  const tgl = new Date(d.t + "T00:00:00"), hari = tgl.toLocaleDateString("id-ID", { weekday: "long" }), tanggal = tgl.toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit", year: "numeric" });
  const baris2 = [_kopamRuang(), `${_kopamPaket(n).toUpperCase()} ${_kopamSetara(n)}`].filter(Boolean).join(" – ");
  const menit = _kopamMenit(d.s.mulai, d.s.selesai);
  const isi = [["Pengawas", d.pengawas.join(", ") || ""], ["Mata Pelajaran", d.mapel], ["Kelas", `${n || _kopamNamaKelas(d.k)} (${_kopamPaket(n)})${d.ruang ? " · Ruang " + d.ruang : ""}`]];
  const isi2 = [["Hari/Tanggal", `${hari}, ${tanggal}`], ["Waktu", `${d.s.mulai}–${d.s.selesai}${menit ? ` (${menit} menit)` : ""}`], ["Paket Kompetensi", o.paketKompetensi || ""]];
  const sel = (arr) => arr.map(([l, v]) => `<tr><td class="l">${l}</td><td class="t">:</td><td class="v">${_kopamE(v) || "&nbsp;"}</td></tr>`).join("");
  return `<div class="ka-kop ${pratinjau ? "pratinjau" : ""}">
    <div class="ka-kepala">${logo ? `<img src="${_kopamE(logo)}" alt="">` : "<div></div>"}<div class="ka-teks">
      <div class="ka-j1">${_kopamE(o.judul)}</div><div class="ka-j2">${_kopamE(o.lembaga)}</div>${baris2 ? `<div class="ka-j3">${_kopamE(baris2)}</div>` : ""}
      <div class="ka-j3">SEMESTER ${_kopamE(o.semester)} TAHUN AJARAN ${_kopamE(o.ta)}</div>
      <div class="ka-j4">${_kopamE(o.izin)}${o.npsn ? ` &nbsp;·&nbsp; NPSN : ${_kopamE(o.npsn)}` : ""}</div><div class="ka-j5">${_kopamE(o.alamat)}</div>${o.alamat2 ? `<div class="ka-j5">${_kopamE(o.alamat2)}</div>` : ""}</div></div>
    <div class="ka-garis"></div>
    <div class="ka-isi"><table>${sel(isi)}</table><table>${sel(isi2)}</table></div></div>`;
}
async function kopamCetak() {
  const j = KOPAM.j, o = KOPAM.opsi, daftar = _kopamSlot(j, o.hari, o.kelas); if (!daftar.length) return;
  try { await _kvGabung("kop:amplop", { judul: o.judul, judulTetap: o.judul !== (KOPAM_JUDUL_JENIS[j.jenis] || KOPAM_BAWAAN.judul), lembaga: o.lembaga, izin: o.izin, npsn: o.npsn, alamat: o.alamat, alamat2: o.alamat2, kertas: o.kertas, per: o.per, paketKompetensi: o.paketKompetensi }); } catch (e) {}
  daftar.sort((a, b) => a.t.localeCompare(b.t) || String(a.s.mulai).localeCompare(String(b.s.mulai)) || _kopamNoKelas(a.k) - _kopamNoKelas(b.k));
  const tinggiKertas = o.kertas === "F4" ? 330 : 297, margin = 8, tinggiKop = (tinggiKertas - margin * 2) / o.per;
  const skala = o.per === 5 ? (o.kertas === "F4" ? 0.92 : 0.82) : 1;
  const lembar = []; for (let i = 0; i < daftar.length; i += o.per) lembar.push(daftar.slice(i, i + o.per));
  const w = window.open("", "_blank"); if (!w) { toast("Izinkan jendela baru (pop-up) untuk mencetak", "err"); return; }
  w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Kop Amplop Soal - ${_kopamE(j.judul)}</title><style>
    @page { size: 210mm ${tinggiKertas}mm; margin: ${margin}mm 10mm; }
    * { box-sizing: border-box; } body { margin: 0; font-family: "Times New Roman", Times, serif; color: #000; }
    .lembar { height: ${tinggiKertas - margin * 2}mm; display: flex; flex-direction: column; page-break-after: always; }
    .lembar:last-child { page-break-after: auto; }
    .slot { height: ${tinggiKop}mm; border-bottom: 1px dashed #777; position: relative; display: flex; align-items: center; padding: 1.5mm 2mm; }
    .slot:last-child { border-bottom: 0; }
    .slot::after { content: "✂"; position: absolute; left: -2mm; bottom: -2.4mm; font-size: 9pt; color: #777; background: #fff; }
    .slot:last-child::after { display: none; }
    .ka-kop { width: 100%; border: 1.2pt solid #000; padding: 2.2mm 3mm 2mm; font-size: ${11 * skala}pt; }
    .ka-kepala { display: grid; grid-template-columns: ${22 * skala}mm 1fr; align-items: center; gap: 2mm; }
    .ka-kepala img { width: ${21 * skala}mm; height: ${21 * skala}mm; object-fit: contain; }
    .ka-teks { text-align: center; line-height: 1.15; padding-right: ${22 * skala}mm; }
    .ka-j1 { font-size: ${15 * skala}pt; font-weight: bold; letter-spacing: .5pt; } .ka-j2 { font-size: ${13 * skala}pt; font-weight: bold; }
    .ka-j3 { font-size: ${11 * skala}pt; font-weight: bold; } .ka-j4 { font-size: ${8.5 * skala}pt; } .ka-j5 { font-size: ${7.5 * skala}pt; }
    .ka-garis { border-top: 2.2pt solid #000; border-bottom: .8pt solid #000; height: 2.2pt; margin: 1.2mm 0 1.6mm; }
    .ka-isi { display: grid; grid-template-columns: 1.15fr 1fr; gap: 3mm; }
    .ka-isi table { border-collapse: collapse; width: 100%; } .ka-isi td { padding: .4mm 0; vertical-align: top; font-size: ${11.5 * skala}pt; }
    .ka-isi td.l { width: ${o.per === 5 ? 30 : 33}mm; } .ka-isi td.t { width: 3mm; } .ka-isi td.v { font-weight: bold; border-bottom: .5pt dotted #999; }
  </style></head><body>
  ${lembar.map((l) => `<div class="lembar">${l.map((d) => `<div class="slot">${_kopamHtmlKop(d, o)}</div>`).join("")}</div>`).join("")}
  <script>window.onload = () => setTimeout(() => window.print(), 400);<\/script></body></html>`);
  w.document.close();
  toast(`${daftar.length} kop siap dicetak di ${lembar.length} lembar ${o.kertas}`, "ok");
}

// ── pemasangan: pilihan "Kop Amplop Soal" di menu cetak Jadwal Ujian ──
(function () {
  if (typeof juPilihCetak === "function") {
    const a = juPilihCetak;
    juPilihCetak = function (id) {
      const r = a.apply(this, arguments);
      try {
        const g = document.querySelector("#modal-panel .ju-versi-grid");
        if (g && !g.querySelector(".ka-versi")) g.insertAdjacentHTML("beforeend", `<button class="ju-versi ka-versi" onclick="closeModal();kopamBuka('${id}')"><div class="ju-versi-cth ka-cth"><span>✉️</span><i>Kop amplop<br>4–5 per lembar</i></div><b>Kop Amplop Soal</b><small>Label depan amplop soal: mapel, kelas, waktu, pengawas</small></button>`);
      } catch (e) {}
      return r;
    };
  }
})();

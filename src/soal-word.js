// ============================================================
//  SOAL WORD BERKOP — guru cukup menempel (copas) teks soal, aplikasi membuat file Word
//  memakai KOP SOAL semester ini (menu Kop Soal) sesuai kategori mapel (Diniyyah / Umum),
//  paket kelas (B: kelas 7–9, C: kelas 10–12) dan jenis ujian (UTS / PAS).
//  • Penulisan rapi seperti karya ilmiah: Times New Roman 12 pt spasi 1,5 rata kiri-kanan,
//    teks Arab Traditional Arabic 16 pt kanan-ke-kiri, nomor soal menggantung, judul di tengah.
//  • Nama mapel, kelas, hari/tanggal & waktu (dari Jadwal Ujian) terisi otomatis di kop.
//  • "Buat & kumpulkan": file Word langsung masuk Pengumpulan Soal (arsip) → admin bisa
//    mengunduh & mencetak; teks aslinya ikut disimpan sehingga bisa diedit lagi.
// ============================================================
const SW = { kop: {}, teks: "", jadwalId: null };
const _SW_AR = /[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿]/;
const _SW_AR_HURUF = /[ء-يٱ-ۓ]/;
const _swEsc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const _swAngkaArab = (s) => String(s).replace(/[0-9]/g, (d) => "٠١٢٣٤٥٦٧٨٩"[d]);
const _swAngkaKelas = (kelasId) => parseInt(String(_juAngkaKelas(kelasId)).replace(/\D/g, ""), 10) || 0;
const _swPaket = (kelasId) => (_swAngkaKelas(kelasId) >= 10 ? "c" : "b");
function _swKategori(mapelId) {
  const m = (LOOKUP.mapel || []).find((x) => x.id === _uaBase(mapelId));
  return m && m.masuk_diniyyah && !m.masuk_umum ? "diniyyah" : "umum";
}
const _swKatAktif = (mapelId) => SW.katPilih?.[mapelId] || _swKategori(mapelId);
function swPilihKat(kat) { const m = qs("sw-mapel")?.value; if (!m) return; SW.katPilih = { ...(SW.katPilih || {}), [m]: kat }; _swSegarkanInfo(); }
const _swSemester = (j) => (_juTgl(j.mulai).getMonth() >= 6 ? "ganjil" : "genap"); // Juli–Desember = ganjil
const _swJenisUts = (j) => j.jenis === "uts";

function _swMuatJSZip() {
  if (window.JSZip) return Promise.resolve();
  return new Promise((ok, gagal) => {
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
    s.onload = () => (window.JSZip ? ok() : gagal(new Error("Pustaka Word tidak termuat")));
    s.onerror = () => gagal(new Error("Pustaka Word gagal dimuat — periksa internet lalu coba lagi"));
    document.head.appendChild(s);
  });
}

// ── Kop: unggahan admin (menu Kop Soal) → kop bawaan situs; UTS belum ada → pakai kop PAS ──
async function _swCariKop(kat, uts, sem, paket) {
  let rows = [];
  try { rows = (typeof KOP_SOAL_CACHE !== "undefined" && KOP_SOAL_CACHE.length) ? KOP_SOAL_CACHE : await apiGetKopSoalSemua(); } catch (e) { rows = []; }
  try { if (rows.length) KOP_SOAL_CACHE = rows; } catch (e) {}
  const url = (k) => {
    const r = rows.find((x) => x.kategori === k);
    const lama = r?.file_url && /supabase\.co/.test(r.file_url) && !String(r.file_url).startsWith(window.SUPABASE_URL || "https://izvsypocfpaerahfpgrk.supabase.co");
    if (r?.file_url && !lama && /\.docx(\?|$)/i.test(r.file_url)) return r.file_url;
    return typeof KOP_SOAL_BAWAAN !== "undefined" && KOP_SOAL_BAWAAN[k] ? `kop-soal/${k}.docx` : null;
  };
  const kode = `${kat}_${uts ? "uts_" : ""}${sem}_${paket}`, kodePas = `${kat}_${sem}_${paket}`;
  const u = url(kode); if (u) return { url: u, kode, cadangan: false };
  const p = uts ? url(kodePas) : null; if (p) return { url: p, kode: kodePas, cadangan: true };
  return null;
}
function _swLabelKop(kode) {
  const [kat, ...r] = kode.split("_"), uts = r[0] === "uts", sem = uts ? r[1] : r[0], pk = r[r.length - 1];
  return `${uts ? "UTS" : "PAS"} · ${sem === "ganjil" ? "Ganjil" : "Genap"} · ${kat === "diniyyah" ? "Diniyyah" : "Umum"} · Paket ${pk.toUpperCase()}`;
}

// ── Urai teks tempelan → judul / soal bernomor / pilihan & butir / paragraf ──
function _swUrai(teks) {
  const hasil = [];
  String(teks || "").replace(/\r/g, "").split("\n").forEach((b) => {
    const s = b.replace(/[‎‏]/g, "").trim();
    if (!s) return;
    let m;
    if ((m = s.match(/^([0-9٠-٩]{1,3})\s*[.)\-–:]\s*(.*)$/))) return hasil.push({ jenis: "soal", label: m[1] + ".", teks: m[2] });
    if ((m = s.match(/^([-–•*·▪●])\s*(.+)$/))) return hasil.push({ jenis: "butir", label: m[1] === "*" || m[1] === "▪" || m[1] === "●" ? "•" : m[1] === "–" ? "-" : m[1], teks: m[2] });
    if ((m = s.match(/^([a-eA-E]|[أابجدهـ])\s*[.)]\s+(.+)$/))) return hasil.push({ jenis: "butir", label: m[1] + ".", teks: m[2] });
    if (!hasil.length) return hasil.push({ jenis: s.length <= 90 && !/^(petunjuk|perhatian|keterangan)\b/i.test(s) ? "judul" : "paragraf", teks: s });
    const akhir = hasil[hasil.length - 1];
    hasil.push({ jenis: akhir.jenis === "judul" && !hasil.some((x) => x.jenis !== "judul") ? "judul" : akhir.jenis === "soal" || akhir.jenis === "lanjut" ? "lanjut" : akhir.jenis === "butir" || akhir.jenis === "lanjutButir" ? "lanjutButir" : "paragraf", teks: s });
  });
  // baris ke-2 "judul" hanya bila pendek (mis. nama kitab + sub judul); selain itu paragraf petunjuk
  return hasil.map((x, i) => (x.jenis === "judul" && i > 1 ? { ...x, jenis: "paragraf" } : x));
}
const _swArab = (t) => { const a = (String(t).match(new RegExp(_SW_AR_HURUF.source, "g")) || []).length, l = (String(t).match(/[A-Za-z]/g) || []).length; return a > 0 && a >= l; };

// ── Penulis XML Word ──
function _swRuns(teks, o) {
  const seg = [];
  let cur = null;
  for (const ch of String(teks)) {
    const t = _SW_AR.test(ch) ? "a" : /[A-Za-zÀ-ɏ]/.test(ch) ? "l" : null;
    if (!cur) cur = { t: t || (o.ar ? "a" : "l"), s: "" };
    else if (t && t !== cur.t) { seg.push(cur); cur = { t, s: "" }; }
    cur.s += ch;
  }
  if (cur) seg.push(cur);
  const sz = o.sz || 24, szAr = o.szAr || 32;
  return seg.map((x) => {
    const rPr = `<w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:eastAsia="Times New Roman" w:cs="Traditional Arabic"/>${o.tebal ? "<w:b/><w:bCs/>" : ""}<w:sz w:val="${sz}"/><w:szCs w:val="${szAr}"/>${x.t === "a" ? "<w:rtl/>" : ""}</w:rPr>`;
    return x.s.split("\t").map((p, i) => (i ? `<w:r>${rPr}<w:tab/></w:r>` : "") + (p ? `<w:r>${rPr}<w:t xml:space="preserve">${_swEsc(p)}</w:t></w:r>` : "")).join("");
  }).join("");
}
function _swPara(teks, o = {}) {
  const ar = !!o.ar;
  const ind = o.kiri || o.gantung ? `<w:ind w:left="${o.kiri || 0}"${o.gantung ? ` w:hanging="${o.gantung}"` : ""}/>` : "";
  const pPr = `<w:pPr>${o.simpan ? "<w:keepNext/>" : ""}${ar ? "<w:bidi/>" : ""}<w:spacing w:before="${o.sebelum || 0}" w:after="${o.sesudah ?? 100}" w:line="${o.spasi || (ar ? 300 : 360)}" w:lineRule="auto"/>${ind}<w:jc w:val="${o.rata || "both"}"/></w:pPr>`;
  return `<w:p>${pPr}${o.label ? _swRuns(o.label + "\t", { ...o, tebal: o.tebalLabel ?? o.tebal }) : ""}${_swRuns(teks, o)}</w:p>`;
}
function _swParagrafSoal(urai) {
  const NOMOR = 567, BUTIR = 851; // 1 cm, 1,5 cm
  return urai.map((x, i) => {
    const ar = _swArab(x.teks);
    if (x.jenis === "judul") return _swPara(x.teks, { ar, rata: "center", tebal: true, sz: 28, szAr: 40, sesudah: i === urai.length - 1 || urai[i + 1]?.jenis !== "judul" ? 240 : 40, spasi: ar ? 276 : 300 });
    if (x.jenis === "soal") return _swPara(x.teks, { ar, label: x.label, kiri: NOMOR, gantung: NOMOR, sebelum: 80 });
    if (x.jenis === "lanjut") return _swPara(x.teks, { ar, kiri: NOMOR });
    if (x.jenis === "butir") return _swPara(x.teks, { ar, label: x.label, kiri: BUTIR + 284, gantung: 284, sesudah: 40 });
    if (x.jenis === "lanjutButir") return _swPara(x.teks, { ar, kiri: BUTIR + 284, sesudah: 40 });
    return _swPara(x.teks, { ar, sesudah: 120 });
  }).join("");
}

// ── Rakit dokumen dari kop ──
function _swBuangKosongAkhir(isi) {
  for (let n = 0; n < 200; n++) {
    const i = Math.max(isi.lastIndexOf("<w:p "), isi.lastIndexOf("<w:p>"));
    if (i < 0) break;
    const p = isi.slice(i);
    if (!/<\/w:p>\s*$/.test(p) || (p.match(/<\/w:p>/g) || []).length !== 1) break;
    const adaTeks = /<w:t[^>]*>[^<]*\S[^<]*<\/w:t>/.test(p);
    if (adaTeks || /<w:drawing|<mc:AlternateContent|<w:pict|<w:object|<w:sectPr/.test(p)) break;
    isi = isi.slice(0, i);
  }
  return isi;
}
function _swSisipSetelah(xml, label, nilai, rPrAr) {
  const i = xml.indexOf(">" + label);
  if (i < 0 || !nilai) return xml;
  const re = /:\s*<\/w:t><\/w:r>/g; re.lastIndex = i;
  const m = re.exec(xml);
  if (!m || m.index - i > 2500) return xml;
  const pos = m.index + m[0].length;
  let sisa = xml.slice(pos);
  // kurangi tab sesudahnya supaya baris tidak meluber
  sisa = sisa.replace(/^(<w:r(?:\s[^>]*)?>(?:<w:rPr>[\s\S]*?<\/w:rPr>)?)((?:<w:tab\/>){4,})/, (a, b, tabs) => b + tabs.slice(0, tabs.length - "<w:tab/>".length * 2));
  return xml.slice(0, pos) + `<w:r>${rPrAr}<w:t xml:space="preserve"> ${_swEsc(nilai)}</w:t></w:r>` + sisa;
}
function _swIsiKop(xml, info) {
  if (info.kat === "diniyyah") {
    const rPr = `<w:rPr><w:rFonts w:ascii="Traditional Arabic" w:hAnsi="Traditional Arabic" w:cs="Traditional Arabic"/><w:sz w:val="32"/><w:szCs w:val="36"/><w:rtl/></w:rPr>`;
    xml = _swSisipSetelah(xml, "المادة", info.mapelAr || info.mapel, rPr);
    xml = _swSisipSetelah(xml, "الفصل", _swAngkaArab(info.kelas), rPr);
    xml = _swSisipSetelah(xml, "التاريخ", info.tanggalAr, rPr);
    return xml;
  }
  // Umum: tabel identitas → ": " ke-2 Mapel, ke-3 Kelas, ke-4 Hari/Tanggal, ke-5 Waktu
  const t0 = xml.indexOf("<w:tbl>"), t1 = xml.indexOf("</w:tbl>", t0);
  if (t0 < 0 || t1 < 0) return xml;
  let k = -1;
  const isi = [null, info.mapel, info.kelasTeks, info.hariTanggal, info.waktu];
  const tabel = xml.slice(t0, t1).replace(/(<w:t(?:\s[^>]*)?>):\s*(<\/w:t>)/g, (a, b, c) => { k++; return isi[k] ? `${b.includes("xml:space") ? b : b.replace("<w:t", '<w:t xml:space="preserve"')}: ${_swEsc(isi[k])}${c}` : a; });
  return xml.slice(0, t0) + tabel + xml.slice(t1);
}
function _swTeksKop(xml) {
  const batas = Math.min(...[xml.indexOf("<w:tbl>"), xml.indexOf(">الإسم")].filter((x) => x > 0).concat([xml.length]));
  return [...xml.slice(0, batas).matchAll(/<w:p[ >][\s\S]*?<\/w:p>/g)].map((m) => [...m[0].matchAll(/<w:t[^>]*>([^<]*)<\/w:t>/g)].map((x) => x[1]).join("").trim()).filter(Boolean)
    .map((s) => s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">"));
}
async function _swBuatDocx(o) {
  await _swMuatJSZip();
  const kop = await _swCariKop(o.kat, o.uts, o.sem, o.paket);
  let zip, xml;
  if (kop) {
    const r = await fetch(kop.url, { cache: "force-cache" });
    if (!r.ok) throw new Error("Kop soal tidak bisa diunduh (" + r.status + ")");
    zip = await JSZip.loadAsync(await r.arrayBuffer());
    xml = await zip.file("word/document.xml")?.async("string");
    if (!xml) throw new Error("Berkas kop bukan Word (.docx) yang valid");
  } else throw new Error("Kop soal untuk kategori ini belum ada. Admin bisa mengunggahnya di menu Kop Soal.");
  const iSect = xml.lastIndexOf("<w:sectPr"), iBody = xml.lastIndexOf("</w:body>");
  if (iSect < 0 || iBody < 0) throw new Error("Susunan berkas kop tidak dikenali");
  const kepala = _swBuangKosongAkhir(xml.slice(0, iSect));
  const urai = _swUrai(o.teks);
  const badan = `<w:p><w:pPr><w:spacing w:before="0" w:after="0"/></w:pPr></w:p>` + _swParagrafSoal(urai);
  let baru = _swIsiKop(kepala, o.info) + badan + xml.slice(iSect);
  zip.file("word/document.xml", baru);
  const blob = await zip.generateAsync({ type: "blob", mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", compression: "DEFLATE" });
  return { blob, kop, urai, teksKop: _swTeksKop(xml) };
}

// ── Info ujian dari Jadwal Ujian ──
function _swInfoUjian(j, mapelId, kelasId, urai) {
  const slot = Object.entries(j.slot || {}).filter(([k, s]) => (_juKode(s) === mapelId || (!_uaSub(mapelId) && s?.m === mapelId)) && k.split("|")[2] === kelasId && j.hari.includes(k.split("|")[0])).sort((a, b) => a[0].localeCompare(b[0]))[0];
  let hariTanggal = "", waktu = "", tanggalAr = "";
  if (slot) {
    const [t, sid] = slot[0].split("|"), s = j.sesi.find((x) => x.id === sid);
    const HR = ["Ahad", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"], dd = _juTgl(t); hariTanggal = `${HR[dd.getDay()]}, ${String(dd.getDate()).padStart(2, "0")}/${String(dd.getMonth() + 1).padStart(2, "0")}/${dd.getFullYear()}`;
    const d = _juTgl(t); tanggalAr = _swAngkaArab(`${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`);
    if (s) { const mnt = (x) => { const [h, m] = String(x).split(/[.:]/).map(Number); return h * 60 + (m || 0); }; const dur = mnt(s.selesai) - mnt(s.mulai); waktu = dur > 0 ? `${dur} menit` : `${s.mulai}–${s.selesai}`; }
  }
  const judulAr = (urai || []).find((x) => x.jenis === "judul" && _swArab(x.teks));
  const kelas = _swAngkaKelas(kelasId) || _juAngkaKelas(kelasId);
  return { kat: _swKategori(mapelId), mapel: _juNamaMapel(mapelId), mapelAr: judulAr ? judulAr.teks : "", kelas, kelasTeks: `${kelas} (Paket ${_swPaket(kelasId).toUpperCase()})`, hariTanggal, waktu, tanggalAr };
}

// ── Jendela "Tempel teks soal → Word" ──
function _swBoleh(j, mapelId, kelasId) {
  return _uaBolehAtur() || (JU.ajar || []).some((a) => a.mapel_id === _uaBase(mapelId) && a.kelas_id === kelasId && a.guru_id === STATE.guruId);
}
function _swDaftarMapel(j, kelasId) {
  return _uaDaftarWajib(j).filter((x) => x.kelasId === kelasId && _swBoleh(j, x.mapelId, kelasId)).sort((a, b) => _juNamaMapel(a.mapelId).localeCompare(_juNamaMapel(b.mapelId), "id"));
}
async function uaBuatWord(jadwalId, mapelId, kelasId) {
  const j = JU.daftar.find((x) => x.id === jadwalId); if (!j) return;
  if (!UA.jadwal || UA.jadwal.id !== j.id) {
    setGlobalLoading(true, "Memuat…");
    try { await Promise.all([_uaMuatBank(), _kvAmbil("ujian:soal:" + j.id, {}).then((d) => { UA.data = d || {}; })]); UA.jadwal = j; }
    catch (e) { toast("Gagal memuat: " + (e.message || e), "err"); return; }
    finally { setGlobalLoading(false); }
  }
  const kelasBoleh = j.kelas.filter((k) => _swDaftarMapel(j, k).length).sort((a, b) => _swAngkaKelas(a) - _swAngkaKelas(b));
  if (!kelasBoleh.length) { toast("Antum tidak punya mapel yang wajib mengumpulkan soal di ujian ini", "info"); return; }
  SW.jadwalId = j.id;
  kelasId = kelasBoleh.includes(kelasId) ? kelasId : kelasBoleh[0];
  const e = _uaEsc;
  openModal(`<div class="sw-modal"><h3>📝 Tempel teks soal → Word berkop</h3>
    <div class="sw-ket">Pilih kelas & mapel, lalu tempel (copas) teks soalnya. Kop soal ${e(j.jenis === "uts" ? "UTS" : "PAS")} semester ini, paket, dan kategori mapel terpilih otomatis.</div>
    <div class="sw-pilih">
      <label class="field"><span class="form-label">Kelas</span><select id="sw-kelas" class="input" onchange="_swGantiKelas()">${kelasBoleh.map((k) => `<option value="${k}" ${k === kelasId ? "selected" : ""}>Kelas ${e(_juAngkaKelas(k))}</option>`).join("")}</select></label>
      <label class="field"><span class="form-label">Mapel</span><select id="sw-mapel" class="input" onchange="_swSegarkanInfo()"></select></label>
    </div>
    <div class="sw-chip" id="sw-info"></div>
    <textarea id="sw-teks" class="input sw-teks" dir="auto" rows="9" placeholder="Tempel teks soal di sini, contoh:&#10;Judul / nama kitab&#10;1. Soal pertama …&#10;2. Soal kedua …&#10;   a. pilihan …&#10;- butir …" oninput="_swPratinjau()"></textarea>
    <div class="sw-prat-h"><b>Pratinjau susunan</b><small id="sw-hitung"></small></div>
    <div class="sw-prat" id="sw-prat"><div class="sw-kosong">Belum ada teks.</div></div>
    <div class="sw-aksi">
      <button class="btn btn-outline" onclick="swProses('unduh')" title="Hanya mengunduh file Word">⬇️ Unduh Word</button>
      <button class="btn btn-outline" onclick="swProses('cetak')" title="Buka tampilan cetak">🖨️ Cetak</button>
      <button class="btn btn-accent" onclick="swProses('kumpul')">📤 Buat Word & kumpulkan</button>
    </div>
    <div class="sw-kaki">Tulisan: Times New Roman 12 pt, spasi 1,5, rata kiri-kanan · Arab: Traditional Arabic 16 pt, kanan ke kiri · nomor soal menggantung.</div></div>`);
  _swGantiKelas(mapelId);
}
function _swGantiKelas(mapelPilih) {
  const j = JU.daftar.find((x) => x.id === SW.jadwalId), kelasId = qs("sw-kelas").value;
  const daftar = _swDaftarMapel(j, kelasId);
  const pilih = daftar.some((x) => x.mapelId === mapelPilih) ? mapelPilih : qs("sw-mapel").value && daftar.some((x) => x.mapelId === qs("sw-mapel").value) ? qs("sw-mapel").value : daftar[0]?.mapelId;
  qs("sw-mapel").innerHTML = daftar.map((x) => `<option value="${_uaEsc(x.mapelId)}" ${x.mapelId === pilih ? "selected" : ""}>${_uaEsc(_juNamaMapel(x.mapelId))}</option>`).join("");
  _swSegarkanInfo();
}
const _swKunciDraf = () => `sw:draf:${SW.jadwalId}:${qs("sw-mapel")?.value}|${qs("sw-kelas")?.value}`;
async function _swSegarkanInfo() {
  const j = JU.daftar.find((x) => x.id === SW.jadwalId), kelasId = qs("sw-kelas").value, mapelId = qs("sw-mapel").value;
  if (!mapelId) return;
  const kat = _swKatAktif(mapelId), paket = _swPaket(kelasId), uts = _swJenisUts(j), sem = _swSemester(j);
  const d = UA.data[_uaKunci(mapelId, kelasId)] || {};
  // isi teks: draf yang belum dikirim → teks yang pernah dikumpulkan
  let draf = ""; try { draf = localStorage.getItem(_swKunciDraf()) || ""; } catch (e) {}
  const ta = qs("sw-teks");
  if (ta && (!ta.value.trim() || ta.dataset.dari !== mapelId + kelasId)) { ta.value = draf || d.teks || ""; ta.dataset.dari = mapelId + kelasId; }
  qs("sw-info").innerHTML = `<span>🏫 Paket ${paket.toUpperCase()} <small>(${paket === "b" ? "setara SMP" : "setara SMA"})</small></span><span class="sw-kat"><button class="${kat === "diniyyah" ? "on" : ""}" onclick="swPilihKat('diniyyah')">🕌 Diniyyah</button><button class="${kat === "umum" ? "on" : ""}" onclick="swPilihKat('umum')">📘 Umum</button></span><span>📋 ${uts ? "UTS" : "PAS"} · Semester ${sem === "ganjil" ? "Ganjil" : "Genap"}</span><span id="sw-kop-ket">⏳ memeriksa kop…</span>${d.file_url ? `<span class="ok">✅ sudah terkumpul${d.sumber === "tempel" ? " (bisa diperbarui)" : ""}</span>` : ""}`;
  _swPratinjau();
  const kop = await _swCariKop(kat, uts, sem, paket);
  const el = qs("sw-kop-ket"); if (!el) return;
  el.className = kop ? (kop.cadangan ? "awas" : "ok") : "bahaya";
  el.textContent = kop ? (kop.cadangan ? `⚠️ Kop UTS belum diunggah — dipakai kop ${_swLabelKop(kop.kode)}` : `🧾 Kop ${_swLabelKop(kop.kode)}`) : "❌ Kop belum ada — minta admin mengunggah di menu Kop Soal";
}
function _swPratinjau() {
  const ta = qs("sw-teks"); if (!ta) return;
  try { localStorage.setItem(_swKunciDraf(), ta.value); } catch (e) {}
  const urai = _swUrai(ta.value), e = _uaEsc;
  const nSoal = urai.filter((x) => x.jenis === "soal").length;
  qs("sw-hitung").textContent = urai.length ? `${nSoal} soal bernomor · ${urai.filter((x) => x.jenis === "butir").length} pilihan/butir` : "";
  qs("sw-prat").innerHTML = urai.length ? urai.map((x) => {
    const ar = _swArab(x.teks) ? ' dir="rtl" class="ar"' : "";
    return `<div class="sw-b ${x.jenis}"${ar}>${x.label ? `<i>${e(x.label)}</i>` : ""}<span>${e(x.teks)}</span></div>`;
  }).join("") + (_swKatAktif(qs("sw-mapel")?.value) === "umum" && _swArab(ta.value) ? `<div class="sw-awas">💡 Teks soal berbahasa Arab, tetapi kop yang dipakai <b>Umum</b>. <button class="btn btn-sm btn-outline" onclick="swPilihKat('diniyyah')">Pakai kop Diniyyah</button></div>` : "") + (nSoal ? "" : `<div class="sw-awas">⚠️ Belum ada soal bernomor. Awali tiap soal dengan nomor, mis. "1." atau "١."</div>`) : `<div class="sw-kosong">Belum ada teks.</div>`;
}
async function swProses(aksi) {
  const j = JU.daftar.find((x) => x.id === SW.jadwalId), kelasId = qs("sw-kelas").value, mapelId = qs("sw-mapel").value, teks = qs("sw-teks").value;
  if (!mapelId) { toast("Pilih mapel dulu", "err"); return; }
  if (!teks.trim()) { toast("Tempel teks soalnya dulu", "err"); qs("sw-teks").focus(); return; }
  const urai = _swUrai(teks);
  if (!urai.some((x) => x.jenis === "soal") && !(await konfirmasiTema("Tidak ada soal bernomor (1., 2., …). Tetap buat?", { ikon: "⚠️", judul: "Periksa teks", teksYa: "Tetap buat" }))) return;
  const info = _swInfoUjian(j, mapelId, kelasId, urai); info.kat = _swKatAktif(mapelId);
  const namaFile = `Soal ${j.jenis === "uts" ? "UTS" : "PAS"} ${_juNamaMapel(mapelId)} Kelas ${_juAngkaKelas(kelasId)}`.replace(/[\\/:*?"<>|]+/g, " ").replace(/\s+/g, " ").trim() + ".docx";
  if (aksi === "cetak") return _swCetak(j, mapelId, kelasId, urai, info);
  setGlobalLoading(true, "Membuat file Word…");
  try {
    const o = { kat: info.kat, uts: _swJenisUts(j), sem: _swSemester(j), paket: _swPaket(kelasId), teks, info };
    const hasil = await _swBuatDocx(o);
    SW.terakhir = { ...hasil, j, mapelId, kelasId, info };
    // salinan untuk perangkat ini
    const a = document.createElement("a"); a.href = URL.createObjectURL(hasil.blob); a.download = namaFile;
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 5000);
    if (aksi === "kumpul") {
      const kunci = _uaKunci(mapelId, kelasId);
      const berkas = new File([hasil.blob], namaFile, { type: hasil.blob.type });
      setGlobalLoading(true, "Mengumpulkan soal ke arsip…");
      const url = await apiUploadFoto(berkas, "soal-ujian");
      UA.data = await _kvAmbil("ujian:soal:" + j.id, {});
      UA.data[kunci] = { ...(UA.data[kunci] || {}), file_url: url, nama_file: namaFile, oleh: STATE.guruNama || "", t: new Date().toISOString(), teks, sumber: "tempel" };
      await _kvSimpan("ujian:soal:" + j.id, UA.data);
      try { localStorage.removeItem(_swKunciDraf()); } catch (e) {}
      closeModal();
      toast(`📤 Soal ${_juNamaMapel(mapelId)} Kelas ${_juAngkaKelas(kelasId)} terkumpul di arsip ✓ (file Word juga terunduh)`, "ok");
      if (UA.segarkan) UA.segarkan(); else if (qs("ju-wadah")?.querySelector(".ua-ringkas")) _uaGambar();
    } else toast("⬇️ File Word terunduh" + (hasil.kop.cadangan ? " (memakai kop PAS karena kop UTS belum diunggah)" : ""), "ok");
  } catch (err) { console.error(err); toast("Gagal: " + (typeof _diagnosaErrorUploadFoto === "function" && /storage|bucket|upload/i.test(err.message) ? _diagnosaErrorUploadFoto(err.message) : err.message || err), "err"); }
  finally { setGlobalLoading(false); }
}
// Cetak langsung dari peramban (tata letak sama: kop, identitas, soal)
async function _swCetak(j, mapelId, kelasId, urai, info) {
  const w = window.open("", "_blank");
  if (!w) { toast("Izinkan pop-up untuk mencetak", "err"); return; }
  let kopTeks = [];
  try {
    await _swMuatJSZip();
    const kop = await _swCariKop(info.kat, _swJenisUts(j), _swSemester(j), _swPaket(kelasId));
    if (kop) { const z = await JSZip.loadAsync(await (await fetch(kop.url, { cache: "force-cache" })).arrayBuffer()); kopTeks = _swTeksKop(await z.file("word/document.xml").async("string")); }
  } catch (e) { console.warn(e); }
  const p = STATE.pengaturan || {}, e = _uaEsc, logo = p.logo_kiri_url || (typeof urlLogoSekolah === "function" ? urlLogoSekolah() : "");
  if (!kopTeks.length) kopTeks = [j.jenis === "uts" ? "UJIAN TENGAH SEMESTER" : "ASESMEN SUMATIF", p.nama_lembaga_kop || "PKBM AL UMM BARABAI"];
  const isi = urai.map((x) => { const ar = _swArab(x.teks); return `<div class="b ${x.jenis}" dir="${ar ? "rtl" : "ltr"}">${x.label ? `<i>${e(x.label)}</i>` : ""}<span>${e(x.teks)}</span></div>`; }).join("");
  const identitas = info.kat === "diniyyah"
    ? `<div class="idn ar" dir="rtl"><span>الإسم :</span><span>المادة : ${e(info.mapelAr || info.mapel)}</span><span>الفصل : ${e(_swAngkaArab(info.kelas))}</span><span>التاريخ : ${e(info.tanggalAr)}</span></div>`
    : `<table class="idn"><tr><td>Nama</td><td>:</td><td></td><td>Hari/Tanggal</td><td>: ${e(info.hariTanggal)}</td></tr><tr><td>Mata Pelajaran</td><td>:</td><td>${e(info.mapel)}</td><td>Waktu</td><td>: ${e(info.waktu)}</td></tr><tr><td>Kelas</td><td>:</td><td>${e(info.kelasTeks)}</td><td></td><td></td></tr></table>`;
  w.document.write(`<!doctype html><html lang="id"><head><meta charset="utf-8"><title>${e(_juNamaMapel(mapelId))} Kelas ${e(_juAngkaKelas(kelasId))}</title><style>
    @page{size:215mm 330mm;margin:12mm 15mm 15mm 20mm}body{font-family:"Times New Roman",serif;font-size:12pt;color:#000;margin:0}
    .kop{display:flex;align-items:center;gap:12px;border-bottom:3px double #000;padding-bottom:6px;margin-bottom:8px}.kop img{width:22mm;height:22mm;object-fit:contain}.kop div{flex:1;text-align:center;line-height:1.25}
    .kop p{margin:0}.kop p:nth-child(-n+2){font-weight:700;font-size:13pt}.kop p:nth-child(n+5){font-size:9pt}
    .idn{width:100%;border-collapse:collapse;margin:4px 0 12px}.idn td{padding:1px 4px}div.idn{display:grid;grid-template-columns:1fr 1fr;gap:2px 20px;font-size:16pt}
    .ar,[dir=rtl]{font-family:"Traditional Arabic","Amiri",serif;font-size:16pt}
    .b{display:flex;gap:8px;text-align:justify;line-height:1.5;margin:0 0 4px}.b i{font-style:normal;min-width:1cm}.b span{flex:1}
    .b.judul{justify-content:center;font-weight:700;font-size:14pt;margin-bottom:10px}.b.judul[dir=rtl]{font-size:20pt}
    .b.soal{margin-top:6px}.b.lanjut{padding-inline-start:1cm}.b.butir{padding-inline-start:1.5cm}.b.butir i{min-width:.5cm}.b.lanjutButir{padding-inline-start:2cm}
  </style></head><body><div class="kop">${logo ? `<img src="${e(logo)}">` : ""}<div>${kopTeks.map((t) => `<p>${e(t)}</p>`).join("")}</div></div>${identitas}${isi}
  <script>window.onload=function(){setTimeout(function(){window.print()},400)}<\/script></body></html>`);
  w.document.close();
}

// ============================================================
//  CETAK RAPOR FORMAT SEKOLAH (Word .docx) — PKBM & DINIYYAH
//  Cetakan = file Word asli sekolah (assets/rapor/cetakan-*.docx) yang data contohnya sudah diganti
//  penanda {{...}}. Aplikasi hanya mengisi penanda & menggandakan baris mapel/ekskul, jadi kertas F4,
//  margin, logo latar, huruf, dan kaki halaman (nama santri + nomor halaman) sama persis dengan aslinya.
//  Banyak santri → satu file; tiap santri satu "section" (halaman baru, nomor halaman mulai 1).
//  Diniyyah full Arab: nama Arab santri/guru/mudir & nama mapel Arab disimpan di kunci-nilai
//  "rapor:arab" (tabel kuliah_pengaturan, tanpa SQL baru).
// ============================================================
const RC_W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main";
const RC_R = "http://schemas.openxmlformats.org/officeDocument/2006/relationships";
const _rcArr = (l) => Array.prototype.slice.call(l || []);
const _rcAnak = (el, nama) => _rcArr(el.childNodes).filter((n) => n.nodeType === 1 && n.localName === nama);
const _rcT = (el) => _rcArr(el.getElementsByTagNameNS(RC_W, "t"));
const _rcTeks = (el) => _rcT(el).map((t) => t.textContent).join("");

let _rcZipJanji = null;
function _rcMuatJSZip() {
  if (window.JSZip) return Promise.resolve(window.JSZip);
  return (_rcZipJanji = _rcZipJanji || new Promise((ok, no) => {
    const s = document.createElement("script"); s.src = "https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js";
    s.onload = () => ok(window.JSZip); s.onerror = () => { _rcZipJanji = null; no(new Error("Pustaka ZIP gagal dimuat — periksa internet")); };
    document.head.appendChild(s);
  }));
}

// ── Pengisi cetakan ──
// Ganti {{kunci}} di semua <w:t> dalam el. Nilai berisi baris baru → <w:br/> di run yang sama.
function _rcIsi(el, peta) {
  _rcT(el).forEach((t) => {
    const asli = t.textContent;
    if (!asli.includes("{{")) return;
    const baru = asli.replace(/\{\{([\w.]+)\}\}/g, (m, k) => (k in peta ? String(peta[k] ?? "") : m));
    const baris = baru.split("\n");
    t.textContent = baris[0]; t.setAttribute("xml:space", "preserve");
    let sesudah = t;
    baris.slice(1).forEach((b) => {
      const br = t.ownerDocument.createElementNS(RC_W, "w:br");
      const t2 = t.ownerDocument.createElementNS(RC_W, "w:t"); t2.setAttribute("xml:space", "preserve"); t2.textContent = b;
      sesudah.parentNode.insertBefore(br, sesudah.nextSibling); br.parentNode.insertBefore(t2, br.nextSibling); sesudah = t2;
    });
  });
}
// Baris tabel yang memuat penanda "{{awalan.…}}" digandakan untuk tiap item
function _rcBarisUlang(el, awalan, daftar) {
  const tr = _rcArr(el.getElementsByTagNameNS(RC_W, "tr")).find((x) => _rcTeks(x).includes(`{{${awalan}.`));
  if (!tr) return;
  const isi = daftar.length ? daftar : [{}];
  isi.forEach((item) => {
    const salin = tr.cloneNode(true);
    const peta = {}; Object.keys(item).forEach((k) => (peta[`${awalan}.${k}`] = item[k]));
    if (!daftar.length) _rcT(salin).forEach((t) => (t.textContent = t.textContent.replace(/\{\{[\w.]+\}\}/g, "-")));
    else _rcIsi(salin, peta);
    tr.parentNode.insertBefore(salin, tr);
  });
  tr.parentNode.removeChild(tr);
}
function _rcCoret(run, coret) {
  let rpr = _rcAnak(run, "rPr")[0];
  if (!rpr) { rpr = run.ownerDocument.createElementNS(RC_W, "w:rPr"); run.insertBefore(rpr, run.firstChild); }
  let s = _rcAnak(rpr, "strike")[0];
  if (!s) { s = run.ownerDocument.createElementNS(RC_W, "w:strike"); rpr.appendChild(s); }
  s.setAttribute("w:val", coret ? "1" : "0");
}

// Gabungkan banyak santri jadi satu dokumen. isiSantri(wadah, data) mengisi salinan isi cetakan.
async function _rcBuatDocx(urlCetakan, daftar, isiSantri, opsi = {}) {
  const JSZip = await _rcMuatJSZip();
  const zip = await JSZip.loadAsync(await (await fetch(urlCetakan, { cache: "no-store" })).arrayBuffer());
  const doc = new DOMParser().parseFromString(await zip.file("word/document.xml").async("string"), "application/xml");
  const body = doc.getElementsByTagNameNS(RC_W, "body")[0];
  const pola = _rcArr(body.childNodes).filter((n) => n.nodeType === 1);
  const sectAkhir = pola.find((n) => n.localName === "sectPr");
  const isiPola = pola.filter((n) => n !== sectAkhir);
  isiPola.forEach((n) => body.removeChild(n));
  const footerPola = opsi.footerNama && zip.file("word/footer1.xml") ? await zip.file("word/footer1.xml").async("string") : null;
  let rels = await zip.file("word/_rels/document.xml.rels").async("string");
  let tipe = await zip.file("[Content_Types].xml").async("string");
  const refFooterAsli = sectAkhir ? _rcAnak(sectAkhir, "footerReference").find((f) => f.getAttribute("w:type") === "default") : null;
  // penomoran otomatis (A. Lembar Isi …) dimulai lagi dari A untuk tiap santri
  let numXml = zip.file("word/numbering.xml") ? await zip.file("word/numbering.xml").async("string") : null;
  const numAbs = {}; let numBaru = 9000;
  if (numXml) numXml.replace(/<w:num w:numId="(\d+)"[^>]*>\s*<w:abstractNumId w:val="(\d+)"/g, (m, n, a) => (numAbs[n] = a));

  daftar.forEach((data, i) => {
    const wadah = doc.createElementNS(RC_W, "w:body");
    isiPola.forEach((n) => wadah.appendChild(n.cloneNode(true)));
    isiSantri(wadah, data);
    if (i > 0 && numXml) {
      const ganti = {};
      _rcArr(wadah.getElementsByTagNameNS(RC_W, "numId")).forEach((el) => {
        const lama = el.getAttribute("w:val");
        if (!(lama in numAbs)) return;
        if (!ganti[lama]) {
          ganti[lama] = String(++numBaru);
          const ulang = Array.from({ length: 9 }, (_, l) => `<w:lvlOverride w:ilvl="${l}"><w:startOverride w:val="1"/></w:lvlOverride>`).join("");
          numXml = numXml.replace("</w:numbering>", `<w:num w:numId="${ganti[lama]}"><w:abstractNumId w:val="${numAbs[lama]}"/>${ulang}</w:num></w:numbering>`);
        }
        el.setAttribute("w:val", ganti[lama]);
      });
    }
    // kaki halaman per santri (nama santri + nomor halaman yang mulai lagi dari 1)
    let sect = sectAkhir.cloneNode(true);
    if (footerPola && refFooterAsli) {
      const nama = `footer_rc${i + 1}.xml`, rid = `rIdRcF${i + 1}`;
      zip.file(`word/${nama}`, footerPola.replace(/\{\{nama\}\}/g, _rcEscXml(data.namaKaki || "")));
      rels = rels.replace("</Relationships>", `<Relationship Id="${rid}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="${nama}"/></Relationships>`);
      tipe = tipe.replace("</Types>", `<Override PartName="/word/${nama}" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/></Types>`);
      _rcAnak(sect, "footerReference").filter((f) => f.getAttribute("w:type") === "default").forEach((f) => f.setAttributeNS(RC_R, "r:id", rid));
    }
    _rcArr(wadah.childNodes).forEach((n) => body.insertBefore(n, sectAkhir));
    if (i < daftar.length - 1) {
      const p = doc.createElementNS(RC_W, "w:p"), ppr = doc.createElementNS(RC_W, "w:pPr");
      ppr.appendChild(sect); p.appendChild(ppr); body.insertBefore(p, sectAkhir);
    } else {
      body.replaceChild(sect, sectAkhir);
    }
  });
  let xml = new XMLSerializer().serializeToString(doc);
  xml = xml.replace(/ w14:(paraId|textId)="[^"]*"/g, ""); // id paragraf ganda dari penggandaan → dibuang
  zip.file("word/document.xml", xml);
  zip.file("word/_rels/document.xml.rels", rels);
  zip.file("[Content_Types].xml", tipe);
  if (numXml) zip.file("word/numbering.xml", numXml);
  return zip.generateAsync({ type: "blob", mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", compression: "DEFLATE" });
}
const _rcEscXml = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
function _rcUnduh(blob, nama) {
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = nama;
  document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}

// ── Label kelas / angka ──
const RC_KELAS = { 7: ["VII", "Tujuh", "السابع"], 8: ["VIII", "Delapan", "الثامن"], 9: ["IX", "Sembilan", "التاسع"], 10: ["X", "Sepuluh", "العاشر"], 11: ["XI", "Sebelas", "الحادي عشر"], 12: ["XII", "Dua Belas", "الثاني عشر"] };
const _rcAngkaKelas = (nama) => { const m = String(nama || "").match(/\d+/); return m ? parseInt(m[0], 10) : null; };
const _rcKelasPanjang = (nama) => { const k = RC_KELAS[_rcAngkaKelas(nama)]; return k ? `${k[0]} (${k[1]})` : formatKelasLabel(nama) || "-"; };
const _rcKelasRomawi = (nama) => (RC_KELAS[_rcAngkaKelas(nama)] || [formatKelasLabel(nama) || ""])[0];
const _rcAngkaArab = (s) => String(s).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[d]);
const RC_BULAN_AR = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
const _rcTanggalAr = (iso) => { const d = new Date(iso); return isNaN(d) ? "" : `${_rcAngkaArab(d.getDate())} ${RC_BULAN_AR[d.getMonth()]} ${_rcAngkaArab(d.getFullYear())}`; };
const _rcTanggalId = (iso) => { const d = new Date(iso); return isNaN(d) ? "" : d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }); };
function _rcPecahAlamat(a) {
  // kolom alamat di cetakan muat ±28 huruf per baris; sisanya ke baris kedua (yang di cetakan memang kosong)
  a = String(a || "-").replace(/\s+/g, " ").trim(); if (a.length <= 28) return [a, ""];
  const i = a.lastIndexOf(" ", 28); return i > 8 ? [a.slice(0, i), a.slice(i + 1)] : [a, ""];
}

// ── Nama Arab (santri, guru, mapel) ──
const RC_MAPEL_AR = { aqidah: "العقيدة", akidah: "العقيدة", fiqih: "الفقه", fikih: "الفقه", hadis: "الحديث", hadits: "الحديث", "bahasa arab": "اللغة العربية", shorof: "الصرف", sharaf: "الصرف", tajwid: "التجويد", nahwu: "النحو", tahsin: "تحسين القرآن", tafsir: "التفسير", siroh: "السيرة النبوية", sirah: "السيرة النبوية", "ushul fiqih": "أصول الفقه", muhadhoroh: "المحاضرة", tauhid: "التوحيد", akhlak: "الأخلاق", "tahfizh": "تحفيظ القرآن", tahfidz: "تحفيظ القرآن", imla: "الإملاء", "khat": "الخط", mutholaah: "المطالعة", "balaghah": "البلاغة", "mantiq": "المنطق", faraidh: "الفرائض", "musthalah hadis": "مصطلح الحديث" };
let RC_ARAB = null;
async function _rcAmbilArab(segar) {
  if (!RC_ARAB || segar) RC_ARAB = { siswa: {}, guru: {}, mapel: {}, mudir: "", tempat: "بارابي", ...(await _kvAmbil("rapor:arab", {})) };
  return RC_ARAB;
}
const _rcMapelAr = (m) => (RC_ARAB && RC_ARAB.mapel[m.id]) || RC_MAPEL_AR[String(m.nama_mapel || "").toLowerCase().trim()] || m.nama_mapel;
// Usulan penulisan Arab nama Indonesia: kamus nama umum + ejaan bunyi untuk sisanya (wajib dicek guru).
const RC_KAMUS = { muhammad: "محمد", muhamad: "محمد", mohammad: "محمد", moh: "محمد", m: "محمد", ahmad: "أحمد", achmad: "أحمد", abdullah: "عبد الله", abdul: "عبد", abdurrahman: "عبد الرحمن", abdurrahim: "عبد الرحيم", abdillah: "عبد الله", ali: "علي", umar: "عمر", usman: "عثمان", utsman: "عثمان", abu: "أبو", bakar: "بكر", hasan: "حسن", hassan: "حسن", husain: "حسين", husein: "حسين", ibrahim: "إبراهيم", ismail: "إسماعيل", ishaq: "إسحاق", yusuf: "يوسف", yahya: "يحيى", zakaria: "زكريا", zakariya: "زكريا", musa: "موسى", isa: "عيسى", harun: "هارون", sulaiman: "سليمان", daud: "داود", dawud: "داود", nuh: "نوح", idris: "إدريس", yunus: "يونس", ilyas: "إلياس", luqman: "لقمان", lukman: "لقمان", hamzah: "حمزة", khalid: "خالد", kholid: "خالد", zaid: "زيد", zaidi: "زيدي", said: "سعيد", saad: "سعد", salman: "سلمان", bilal: "بلال", anas: "أنس", fahri: "فخري", fikri: "فكري", fajar: "فجر", fadhil: "فاضل", fadil: "فاضل", faiz: "فائز", faishal: "فيصل", faisal: "فيصل", farhan: "فرحان", firas: "فراس", fathir: "فاطر", fathan: "فتحان", ghaniy: "غني", ghani: "غني", ghazi: "غازي", habib: "حبيب", hafiz: "حافظ", hafizh: "حافظ", haikal: "هيكل", hakim: "حكيم", hamid: "حميد", hanif: "حنيف", haris: "حارث", harits: "حارث", hilmi: "حلمي", ikhsan: "إحسان", ihsan: "إحسان", ilham: "إلهام", irfan: "عرفان", iqbal: "إقبال", jabir: "جابر", jamal: "جمال", kamil: "كامل", karim: "كريم", luthfi: "لطفي", lutfi: "لطفي", mahmud: "محمود", mahmood: "محمود", malik: "مالك", mansur: "منصور", mubarak: "مبارك", mukhtar: "مختار", munir: "منير", mustafa: "مصطفى", musthofa: "مصطفى", nabil: "نبيل", nafi: "نافع", naufal: "نوفل", nur: "نور", nuri: "نوري", rafi: "رافع", rahman: "رحمن", rasyid: "رشيد", rashid: "رشيد", ridha: "رضا", rizki: "رزقي", rizqi: "رزقي", rizky: "رزقي", ruslan: "رسلان", sabri: "صبري", shalih: "صالح", saleh: "صالح", salim: "سالم", sami: "سامي", syafiq: "شفيق", syahid: "شهيد", syakir: "شاكر", taufiq: "توفيق", taufik: "توفيق", thariq: "طارق", tariq: "طارق", umair: "عمير", wafi: "وافي", yasir: "ياسر", yassar: "يسار", zahi: "زاهي", zahwan: "زهوان", zaki: "زكي", zidan: "زيدان", zuhair: "زهير", azzam: "عزام", akbar: "أكبر", alif: "أليف", amin: "أمين", amir: "أمير", arif: "عارف", asyraf: "أشرف", ashraf: "أشرف", aziz: "عزيز", badr: "بدر", dzaki: "ذكي", dzikri: "ذكري", rayhan: "ريحان", raihan: "ريحان", ryan: "ريان", rian: "ريان", nugroho: "نوغروهو", al: "ال", an: "ال", ar: "ال", as: "ال", az: "ال", ad: "ال", at: "ال", bana: "البنا", fairus: "فيروز", kenzo: "كنزو", zavier: "زافير", aiman: "أيمن", ayman: "أيمن", fardika: "فرديكا", restu: "رستو", ramadhana: "رمضانا", ramadhan: "رمضان", ramadan: "رمضان", arya: "آريا", putra: "فوترا", rifqi: "رفقي", nabhan: "نبهان", rizani: "رزاني", abdurrozzaq: "عبد الرزاق", muzakki: "مزكي", ustadz: "الأستاذ" };
function _rcUsulArab(nama) {
  const kata = String(nama || "").split(",")[0].replace(/[^A-Za-z\s'-]/g, " ").trim().split(/\s+/).filter(Boolean);
  const hasil = [];
  for (let i = 0; i < kata.length; i++) {
    const w = kata[i].toLowerCase().replace(/'/g, "");
    if (/^(al|an|ar|as|az|ad|at)-?$/.test(w) && kata[i + 1]) { const b = _rcUsulArab(kata[i + 1]); hasil.push("ال" + b.replace(/^ال/, "")); i++; continue; }
    const pecah = w.split("-");
    if (pecah.length > 1) {
      const bag = []; let pakaiAl = false;
      pecah.filter(Boolean).forEach((x) => {
        if (/^(al|an|ar|as|az|ad|at)$/.test(x)) { pakaiAl = true; return; }
        const a = RC_KAMUS[x] || _rcBunyi(x); bag.push(pakaiAl ? "ال" + a.replace(/^ال/, "") : a); pakaiAl = false;
      });
      hasil.push(bag.join(" ")); continue;
    }
    hasil.push(RC_KAMUS[w] || _rcBunyi(w));
  }
  return hasil.join(" ").replace(/عبد (?!ال)(\S+)/g, "عبد ال$1"); // Abdul Aziz → عبد العزيز
}
// ejaan bunyi sederhana Latin → Arab (untuk nama yang tidak ada di kamus)
function _rcBunyi(w) {
  const ganda = [["kh", "خ"], ["sy", "ش"], ["sh", "ش"], ["ts", "ث"], ["th", "ث"], ["dz", "ذ"], ["dh", "ض"], ["gh", "غ"], ["ng", "نغ"], ["ny", "ني"], ["ch", "ش"], ["aa", "ا"], ["ii", "ي"], ["uu", "و"]];
  const tunggal = { b: "ب", c: "تش", d: "د", f: "ف", g: "غ", h: "ه", j: "ج", k: "ك", l: "ل", m: "م", n: "ن", p: "ف", q: "ق", r: "ر", s: "س", t: "ت", v: "ف", w: "و", x: "كس", y: "ي", z: "ز" };
  let o = "", i = 0;
  while (i < w.length) {
    const dua = w.slice(i, i + 2), g = ganda.find(([a]) => a === dua);
    if (g) { o += g[1]; i += 2; continue; }
    const c = w[i];
    if ("aiueo".includes(c)) {
      if (i === 0) o += c === "u" || c === "o" ? "أو" : c === "i" || c === "e" ? "إي" : "أ";
      else if (i === w.length - 1) o += c === "a" ? "ا" : c === "i" || c === "e" ? "ي" : "و";
      else if (c === "a" && !"aiueo".includes(w[i + 1] || "")) { /* fathah pendek: tidak ditulis */ }
      else if (c === "i" || c === "e") o += "ي";
      else if (c === "u" || c === "o") o += "و";
      i++; continue;
    }
    o += tunggal[c] || ""; i++;
  }
  return o;
}

// ── Data rapor ──
async function _rcKonteks(kelasId, semester, tahun) {
  await ensureLookups(); await _rcAmbilArab(true);
  const kelas = LOOKUP.kelas.find((k) => k.id === kelasId) || {};
  const siswa = await apiGetSiswaByKelas(kelasId), ids = siswa.map((s) => s.id);
  const { dari, sampai } = _rentangSemesterTahunAjaran(semester, tahun);
  const [pengaturan, nilai, ekskul, catatan, hadir] = await Promise.all([
    apiGetPengaturanRapor(),
    ids.length ? supa.from("nilai_rapor").select("*").in("siswa_id", ids).eq("semester", semester).eq("tahun_ajaran", tahun).then(unwrap) : [],
    apiGetEkstrakurikulerKelas(ids, semester, tahun),
    apiGetCatatanKelas(ids, semester, tahun),
    apiGetRekapKehadiranSiswa(kelasId, dari, sampai).catch(() => []),
  ]);
  const urut = {}; // urutan mapel = abjad, sama seperti rapor di aplikasi
  return { kelas, siswa, semester, tahun, pengaturan, nilai, ekskul, catatan, hadir, urut };
}
const _rcNA = (row) => { if (!row) return null; const n = hitungNilaiAkhir(row); return n && n.nilaiAkhir > 0 ? Math.round(n.nilaiAkhir) : null; };

function _rcDataPkbm(k, s) {
  const paket = paketDariNamaKelas(k.kelas.nama_kelas);
  const cocok = (m) => !paket || (paket === "B" ? m.paket_b : m.paket_c);
  const nilaiS = k.nilai.filter((n) => n.siswa_id === s.id), cari = (id) => nilaiS.find((n) => n.mapel_id === id);
  const alias = (LOOKUP.mapel || []).filter((m) => m.masuk_diniyyah && m.alias_rapor_umum && cocok(m));
  const idAlias = new Set(alias.map((m) => m.id));
  const urutM = (a, b) => (k.urut[a.id] ?? 999) - (k.urut[b.id] ?? 999) || a.nama_mapel.localeCompare(b.nama_mapel, "id");
  const umum = (LOOKUP.mapel || []).filter((m) => m.masuk_umum && m.kategori !== "pemberdayaan" && cocok(m) && !idAlias.has(m.id)).sort(urutM);
  const daya = (LOOKUP.mapel || []).filter((m) => m.masuk_umum && m.kategori === "pemberdayaan" && cocok(m) && !idAlias.has(m.id)).sort(urutM);
  const baris = (arr, nama) => arr.map((m, i) => { const r = cari(m.id); return { no: i + 1, mapel: nama(m), nilai: _rcNA(r) ?? "-", cp: r?.capaian_pembelajaran || "-" }; });
  const cat = k.catatan.find((c) => c.siswa_id === s.id) || {};
  const h = k.hadir.find((r) => r.siswa?.id === s.id) || {};
  const [al1, al2] = _rcPecahAlamat(s.alamat_asal);
  const wali = guruWaliKelasDari(k.kelas.id);
  return {
    namaKaki: s.nama, tinggal: cat.keputusan === "Tinggal",
    u: [...baris(alias, (m) => m.alias_rapor_umum), ...baris(umum, (m) => m.nama_mapel)].map((x, i) => ({ ...x, no: i + 1 })),
    p: baris(daya, (m) => m.nama_mapel),
    e: k.ekskul.filter((e) => e.siswa_id === s.id).map((e, i) => ({ no: i + 1, nama: e.nama_ekstrakurikuler, ket: e.keterangan || "-" })),
    peta: {
      nama: s.nama, kelas: _rcKelasPanjang(k.kelas.nama_kelas), nis: `${s.nis || "-"}/ ${s.nisn || "-"}`, fase: faseDariKelas(k.kelas.nama_kelas),
      sekolah: STATE.pengaturan?.nama_pkbm || "PKBM Al Umm Barabai", semester: k.semester === "Genap" ? "II (Dua)" : "I (Satu)",
      alamat1: al1, alamat2: al2, tahun: k.tahun,
      sakit: h.sakit || "-", izin: h.izin || "-", alpha: h.alpha || "-",
      catatan: cat.catatan_wali_kelas || "", tujuan: _rcKelasPanjang(cat.kelas_tujuan || _tebakKelasBerikutnya(k.kelas.nama_kelas)),
      tempat: k.pengaturan.tempat_terbit || "Hulu Sungai Tengah", tanggal: _rcTanggalId(k.pengaturan.tanggal_terbit),
      kelas_romawi: _rcKelasRomawi(k.kelas.nama_kelas), kepala: _namaPejabat(k.pengaturan), wali: wali ? wali.nama : "",
    },
  };
}
function _rcIsiPkbm(semester) {
  return (wadah, d) => {
    _rcBarisUlang(wadah, "u", d.u); _rcBarisUlang(wadah, "p", d.p); _rcBarisUlang(wadah, "e", d.e);
    // keputusan naik/tinggal hanya di rapor semester Genap
    const tbl = _rcArr(wadah.getElementsByTagNameNS(RC_W, "tbl")).find((t) => _rcTeks(t).includes("{{K_NAIK}}"));
    if (tbl && semester !== "Genap") tbl.parentNode.removeChild(tbl);
    else if (tbl) _rcArr(tbl.getElementsByTagNameNS(RC_W, "r")).forEach((r) => {
      const t = _rcTeks(r);
      if (t === "{{K_NAIK}}") { _rcT(r)[0].textContent = "Naik"; _rcCoret(r, d.tinggal); }
      if (t === "{{K_TINGGAL}}") { _rcT(r)[0].textContent = "Tinggal"; _rcCoret(r, !d.tinggal); }
    });
    _rcIsi(wadah, d.peta);
  };
}

function _rcDataDiniyyah(k, s, peringkat) {
  const mapel = (LOOKUP.mapel || []).filter((m) => m.masuk_diniyyah).sort((a, b) => (k.urut[a.id] ?? 999) - (k.urut[b.id] ?? 999) || a.nama_mapel.localeCompare(b.nama_mapel, "id"));
  const nilaiS = k.nilai.filter((n) => n.siswa_id === s.id);
  const baris = mapel.map((m, i) => { const v = _rcNA(nilaiS.find((n) => n.mapel_id === m.id)); return { no: i + 1, mapel: _rcMapelAr(m), kkm: typeof kkmMapel === "function" ? kkmMapel(m, k.kelas?.id || k.kelasId) : (m.kkm ?? 70), nilai: v ?? "-", huruf: v != null ? angkaKeHurufArab(v) : "-", v }; });
  const terisi = baris.filter((b) => b.v != null), jumlah = terisi.reduce((a, b) => a + b.v, 0);
  const cat = k.catatan.find((c) => c.siswa_id === s.id) || {};
  const h = k.hadir.find((r) => r.siswa?.id === s.id) || {};
  const wali = guruWaliKelasDari(k.kelas.id);
  const angkaKelas = _rcAngkaKelas(k.kelas.nama_kelas);
  const [t1, t2] = String(k.tahun).split("/");
  return {
    d: baris,
    peta: {
      nama_ar: RC_ARAB.siswa[s.id] || s.nama, kelas_ar: (RC_KELAS[angkaKelas] || [])[2] || _rcAngkaArab(k.kelas.nama_kelas || ""),
      semester_ar: k.semester === "Genap" ? "الثاني" : "الأول", tahun_ar: _rcAngkaArab(`${t1} - ${t2 || ""}`),
      jumlah: terisi.length ? jumlah : "-", rata: terisi.length ? Math.round(jumlah / terisi.length) : "-",
      rank: peringkat[s.id] || "-", jml_siswa: k.siswa.length,
      sakit: h.sakit || "-", izin: h.izin || "-", alpha: h.alpha || "-",
      catatan_ar: cat.catatan_wali_kelas_ar || "-", tempat_ar: RC_ARAB.tempat || "بارابي", tanggal_ar: _rcTanggalAr(k.pengaturan.tanggal_terbit),
      wali_ar: (wali && RC_ARAB.guru[wali.id]) || (wali ? wali.nama : ""), mudir_ar: RC_ARAB.mudir || "",
    },
  };
}
// Peringkat kelas berdasarkan jumlah nilai diniyyah (nilai sama → peringkat sama)
function _rcPeringkat(k) {
  const ids = new Set((LOOKUP.mapel || []).filter((m) => m.masuk_diniyyah).map((m) => m.id));
  const total = k.siswa.map((s) => ({ id: s.id, j: k.nilai.filter((n) => n.siswa_id === s.id && ids.has(n.mapel_id)).reduce((a, n) => a + (_rcNA(n) || 0), 0) }));
  const urut = total.filter((x) => x.j > 0).sort((a, b) => b.j - a.j), out = {};
  urut.forEach((x, i) => { out[x.id] = i > 0 && urut[i - 1].j === x.j ? out[urut[i - 1].id] : i + 1; });
  return out;
}

// ── Jendela cetak ──
async function bukaCetakRapor(prefix) {
  const kelasId = qs(prefix + "-kelas")?.value; if (!kelasId) { toast("Pilih kelas dulu", "err"); return; }
  const semester = qs(prefix + "-semester").value, tahun = qs(prefix + "-tahun").value;
  const siswaPilih = qs(prefix + "-siswa")?.value || (prefix === "rw" && RAPOR_WK_CACHE ? RAPOR_WK_CACHE.siswaList[RWK.idx]?.id : "");
  const siswa = await apiGetSiswaByKelas(kelasId);
  await _rcAmbilArab(true);
  const tanpaArab = siswa.filter((s) => !RC_ARAB.siswa[s.id]).length;
  openModal(`<h3>🖨️ Cetak Rapor — format sekolah</h3>
    <div style="font-size:12px;color:var(--text-secondary);margin:-4px 0 12px">${escapeHtml(_rcKelasPanjang(LOOKUP.kelas.find((k) => k.id === kelasId)?.nama_kelas))} · Semester ${escapeHtml(semester)} ${escapeHtml(tahun)} · kertas F4, siap cetak tanpa mengatur ulang.</div>
    <div class="rc-pilih">
      <label><input type="radio" name="rc-jenis" value="pkbm" ${prefix !== "rd" ? "checked" : ""}> 📘 <b>Rapor PKBM</b><span>Laporan Hasil Belajar</span></label>
      <label><input type="radio" name="rc-jenis" value="diniyyah" ${prefix === "rd" ? "checked" : ""}> 📗 <b>Rapor Diniyyah</b><span>كشف الدرجات — full Arab</span></label>
    </div>
    <div class="field" style="margin-top:10px"><label class="form-label">Santri</label>
      <select id="rc-siswa" class="input"><option value="">👥 Semua santri (${siswa.length}) — satu file</option>${siswa.map((s) => `<option value="${s.id}" ${s.id === siswaPilih ? "selected" : ""}>${escapeHtml(s.nama)}</option>`).join("")}</select></div>
    ${tanpaArab ? `<div class="rc-catatan">🔤 ${tanpaArab} santri belum punya <b>nama Arab</b> — di rapor Diniyyah akan tertulis huruf Latin. <a href="#" onclick="bukaNamaArab('${kelasId}');return false;">Lengkapi nama Arab</a></div>` : ""}
    <div style="display:flex;gap:8px;margin-top:12px">
      <button class="btn btn-outline" style="flex:1" onclick="bukaNamaArab('${kelasId}')">🔤 Nama Arab</button>
      <button class="btn btn-accent" style="flex:2" id="rc-ok">🖨️ Buat file Word</button></div>`);
  qs("rc-ok").onclick = async () => {
    const jenis = document.querySelector('input[name="rc-jenis"]:checked').value, satu = qs("rc-siswa").value;
    const tb = qs("rc-ok"); tb.disabled = true; tb.textContent = "⏳ Menyusun rapor…";
    try {
      const k = await _rcKonteks(kelasId, semester, tahun);
      const daftar = satu ? k.siswa.filter((s) => s.id === satu) : k.siswa;
      let blob;
      if (jenis === "pkbm") blob = await _rcBuatDocx("assets/rapor/cetakan-pkbm.docx", daftar.map((s) => _rcDataPkbm(k, s)), _rcIsiPkbm(semester), { footerNama: true });
      else {
        const pr = _rcPeringkat(k);
        blob = await _rcBuatDocx("assets/rapor/cetakan-diniyyah.docx", daftar.map((s) => _rcDataDiniyyah(k, s, pr)), (w, d) => { _rcBarisUlang(w, "d", d.d.map(({ v, ...x }) => x)); _rcIsi(w, d.peta); });
      }
      const nama = `Rapor_${jenis === "pkbm" ? "PKBM" : "Diniyyah"}_${(satu ? daftar[0].nama : _rcKelasRomawi(k.kelas.nama_kelas) + "_semua").replace(/\s+/g, "_")}_${semester}_${tahun.replace("/", "-")}.docx`;
      _rcUnduh(blob, nama);
      toast(`🖨️ Rapor ${daftar.length > 1 ? daftar.length + " santri " : ""}siap dicetak`, "ok"); closeModal();
    } catch (e) { console.error(e); toast("Gagal membuat rapor: " + e.message, "err"); tb.disabled = false; tb.textContent = "🖨️ Buat file Word"; }
  };
}

// ── Penyunting nama Arab (santri sekelas + wali kelas + mudir + mapel diniyyah) ──
async function bukaNamaArab(kelasId) {
  await ensureLookups(); await _rcAmbilArab(true);
  const siswa = await apiGetSiswaByKelas(kelasId), wali = guruWaliKelasDari(kelasId);
  const mapelD = (LOOKUP.mapel || []).filter((m) => m.masuk_diniyyah);
  const baris = (id, label, nilai, latin, jenis) => `<div class="rc-arab-baris"><span>${escapeHtml(label)}</span>
    <input class="input rc-arab" dir="rtl" data-jenis="${jenis}" data-id="${id}" data-latin="${escapeHtml(latin)}" value="${escapeHtml(nilai || "")}" placeholder="اكتب بالعربية">
    <button type="button" title="Usulkan dari nama Latin" onclick="const i=this.previousElementSibling;i.value=_rcUsulArab(i.dataset.latin)">✨</button></div>`;
  openModal(`<h3>🔤 Nama Arab untuk Rapor Diniyyah</h3>
    <div style="font-size:12px;color:var(--text-secondary);margin:-4px 0 10px;line-height:1.6">Tekan ✨ untuk usulan otomatis dari nama Latin, lalu <b>periksa</b> — ejaan nama orang perlu dicek wali kelas.</div>
    <button class="btn btn-sm rwk-b-ungu" onclick="qsa('.rc-arab').forEach(i=>{if(!i.value.trim()&&i.dataset.latin)i.value=_rcUsulArab(i.dataset.latin)})">✨ Isi usulan untuk yang masih kosong</button>
    <div class="rwk-judul">👥 Santri</div>${siswa.map((s) => baris(s.id, s.nama, RC_ARAB.siswa[s.id], s.nama, "siswa")).join("")}
    <div class="rwk-judul">👤 Penanda tangan</div>
    ${wali ? baris(wali.id, `Wali kelas — ${wali.nama}`, RC_ARAB.guru[wali.id], wali.nama, "guru") : `<div style="font-size:12px;color:var(--bad)">Kelas ini belum punya wali kelas.</div>`}
    ${baris("mudir", "Mudir (مدير المدرسة)", RC_ARAB.mudir, "", "mudir")}
    ${baris("tempat", "Tempat terbit", RC_ARAB.tempat, "Barabai", "tempat")}
    <details class="je-atur"><summary>📚 Nama Arab mapel diniyyah</summary>${mapelD.map((m) => baris(m.id, m.nama_mapel, RC_ARAB.mapel[m.id] || RC_MAPEL_AR[m.nama_mapel.toLowerCase()] || "", "", "mapel")).join("")}</details>
    <button class="btn btn-accent" style="width:100%;margin-top:12px" id="rc-arab-ok">💾 Simpan</button>`, { lebar: true });
  qs("rc-arab-ok").onclick = async () => {
    const data = await _rcAmbilArab(true);
    qsa(".rc-arab").forEach((i) => {
      const v = i.value.trim(), j = i.dataset.jenis;
      if (j === "mudir") data.mudir = v; else if (j === "tempat") data.tempat = v || "بارابي";
      else if (v) data[j][i.dataset.id] = v; else delete data[j][i.dataset.id];
    });
    try { await _kvSimpan("rapor:arab", data); RC_ARAB = data; toast("🔤 Nama Arab tersimpan", "ok"); closeModal(); }
    catch (e) { toast("Gagal menyimpan: " + e.message, "err"); }
  };
}

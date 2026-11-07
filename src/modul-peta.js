// ============================================================
//  PETA ISI BUKU — supaya jurnal dari presentasi berisi BAB & POIN BAHASAN, bukan "Nama buku (hal. 1–17)".
//  Buku sekolah kebanyakan berupa GAMBAR (hasil pindai / salindia), jadi judul halaman dibaca dengan
//  pengenalan huruf (OCR, tesseract.js — berjalan di perangkat sendiri, tanpa biaya).
//  • Saat buku dibuka, judul tiap halaman dibaca pelan-pelan di latar belakang (tidak mengganggu presentasi).
//  • Hasilnya disimpan BERSAMA per buku (kuliah_pengaturan "ma:buku:…" → peta) → cukup sekali untuk semua guru.
//  • Dikenali: "A. …" (topik), "1. …" / "a. …" (subtopik), "1) …" (poin), "Bab 1 …"; kitab Arab:
//    "سورة …", "الدرس …", dan bagian seperti "الكلمات الجديدة" / "التفسير".
//  • Setelah presentasi: materi = bab/topik + subtopik + poin dari halaman yang LAMA dibuka.
// ============================================================
const MP = { worker: null, bahasa: null, janjiSkrip: null, jalan: null };
const MP_VERSI = 1;

// ── Nama surah: Arab (tanpa harakat) → Latin ──
const MP_SURAH = "الفاتحة:Al-Fatihah|البقرة:Al-Baqarah|آل عمران:Ali 'Imran|النساء:An-Nisa'|المائدة:Al-Ma'idah|الأنعام:Al-An'am|الأعراف:Al-A'raf|الأنفال:Al-Anfal|التوبة:At-Taubah|يونس:Yunus|هود:Hud|يوسف:Yusuf|الرعد:Ar-Ra'd|إبراهيم:Ibrahim|الحجر:Al-Hijr|النحل:An-Nahl|الإسراء:Al-Isra'|الكهف:Al-Kahf|مريم:Maryam|طه:Taha|الأنبياء:Al-Anbiya'|الحج:Al-Hajj|المؤمنون:Al-Mu'minun|النور:An-Nur|الفرقان:Al-Furqan|الشعراء:Asy-Syu'ara'|النمل:An-Naml|القصص:Al-Qasas|العنكبوت:Al-'Ankabut|الروم:Ar-Rum|لقمان:Luqman|السجدة:As-Sajdah|الأحزاب:Al-Ahzab|سبأ:Saba'|فاطر:Fatir|يس:Yasin|الصافات:As-Saffat|ص:Sad|الزمر:Az-Zumar|غافر:Gafir|فصلت:Fussilat|الشورى:Asy-Syura|الزخرف:Az-Zukhruf|الدخان:Ad-Dukhan|الجاثية:Al-Jasiyah|الأحقاف:Al-Ahqaf|محمد:Muhammad|الفتح:Al-Fath|الحجرات:Al-Hujurat|ق:Qaf|الذاريات:Az-Zariyat|الطور:At-Tur|النجم:An-Najm|القمر:Al-Qamar|الرحمن:Ar-Rahman|الواقعة:Al-Waqi'ah|الحديد:Al-Hadid|المجادلة:Al-Mujadalah|الحشر:Al-Hasyr|الممتحنة:Al-Mumtahanah|الصف:As-Saff|الجمعة:Al-Jumu'ah|المنافقون:Al-Munafiqun|التغابن:At-Tagabun|الطلاق:At-Talaq|التحريم:At-Tahrim|الملك:Al-Mulk|القلم:Al-Qalam|الحاقة:Al-Haqqah|المعارج:Al-Ma'arij|نوح:Nuh|الجن:Al-Jinn|المزمل:Al-Muzzammil|المدثر:Al-Muddassir|القيامة:Al-Qiyamah|الإنسان:Al-Insan|المرسلات:Al-Mursalat|النبأ:An-Naba'|النازعات:An-Nazi'at|عبس:'Abasa|التكوير:At-Takwir|الانفطار:Al-Infitar|المطففين:Al-Mutaffifin|الانشقاق:Al-Insyiqaq|البروج:Al-Buruj|الطارق:At-Tariq|الأعلى:Al-A'la|الغاشية:Al-Gasyiyah|الفجر:Al-Fajr|البلد:Al-Balad|الشمس:Asy-Syams|الليل:Al-Lail|الضحى:Ad-Duha|الشرح:Asy-Syarh|التين:At-Tin|العلق:Al-'Alaq|القدر:Al-Qadr|البينة:Al-Bayyinah|الزلزلة:Az-Zalzalah|العاديات:Al-'Adiyat|القارعة:Al-Qari'ah|التكاثر:At-Takasur|العصر:Al-'Asr|الهمزة:Al-Humazah|الفيل:Al-Fil|قريش:Quraisy|الماعون:Al-Ma'un|الكوثر:Al-Kausar|الكافرون:Al-Kafirun|النصر:An-Nasr|المسد:Al-Masad|الإخلاص:Al-Ikhlas|الفلق:Al-Falaq|الناس:An-Nas";
const _mpNormAr = (s) => String(s || "").replace(/[ً-ْٰـ]/g, "").replace(/[أإآٱ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه").trim();
const MP_SURAH_PETA = Object.fromEntries(MP_SURAH.split("|").map((x) => { const [a, l] = x.split(":"); return [_mpNormAr(a), l]; }));
// Bagian pelajaran di kitab Arab → kata Indonesia untuk jurnal
const MP_BAGIAN_AR = [[/الكلمات الجديده|المفردات/, "kosakata baru"], [/معاني الكلمات|معني الكلمات|معاني المفردات/, "makna kosakata"], [/المعني الاجمالي|المعني العام|المعني الاجمالى/, "makna umum ayat"], [/سبب النزول/, "sebab turunnya ayat"],
  [/ما ترشد اليه|ما يرشد اليه|الدروس المستفاده|ما يستفاد/, "pelajaran dari ayat"], [/فضل السوره/, "keutamaan surah"], [/^التفسير|تفسير الايات/, "tafsir ayat"],
  [/الت.ريبات|الت.ريب|التمرينات|الاسئله|المناقشه/, "latihan"], [/الفوائد/, "faedah"], [/الاعراب/, "i'rab"], [/القواعد|القاعده/, "kaidah"]];

// ── Judul dari satu baris teks ──
const _MP_LEVEL = [[/^[A-H]\.$/, 1], [/^\d{1,2}\.$/, 2], [/^[a-h]\.$/, 3], [/^\d{1,2}\)$/, 4]];
const _MP_BUKAN = /^(ringkasan materi|apersepsi|tujuan pembelajaran|daftar isi|kata pengantar|evaluasi|refleksi|rangkuman|uji kompetensi|latihan|tugas|aktivitas|kegiatan|sumber)/i;
function _mpJudulLatin(t) {
  t = String(t || "").replace(/[|‘’`“”"_]/g, " ").replace(/\s+/g, " ").trim();
  // "BAB 1 Pendapatan Nasional" / "Bab II: …" — paling banyak 2 potongan sampah di depannya
  const bab = t.match(/\b(?:BAB|Bab)\s+([IVXLC]+|\d{1,2})\b\s*[:.\-–]?\s*(.{0,70})$/);
  if (bab && t.slice(0, bab.index).trim().split(" ").filter(Boolean).length <= 2 && !/[.;!?]\s/.test(bab[2]))
    return [0, `Bab ${bab[1]}${bab[2] ? " " + _mpBuangEkor(bab[2]) : ""}`.trim()];
  const tok = t.split(" ");
  for (let i = 0; i < Math.min(tok.length - 1, 4); i++) {
    const lvl = (_MP_LEVEL.find(([re]) => re.test(tok[i])) || [])[1];
    if (!lvl || !/^[A-Z]/.test(tok[i + 1])) continue;
    let judul = _mpBuangEkor(tok.slice(i + 1).join(" "));
    if (/[.;:!?]$/.test(judul) || /[.;!?]\s/.test(judul)) return null;          // kalimat, bukan judul
    const kata = judul.split(" ").length;
    if (kata < 1 || kata > 11 || judul.length < 4 || _MP_BUKAN.test(judul)) return null;
    return [lvl, judul];
  }
  return null;
}
// sisa bingkai/garis yang ikut terbaca di ujung baris ("LI", "|", "—", "Dl", angka nyasar)
function _mpBuangEkor(s) {
  const tok = String(s || "").trim().split(" ");
  while (tok.length > 1 && /^([A-Za-z]{1,2}|[\W\d_]{1,3})$/.test(tok[tok.length - 1]) && !/\)$/.test(tok[tok.length - 1])) tok.pop();
  return tok.join(" ").replace(/[\s—–\-]+$/, "").trim();
}
function _mpJudulArab(t) {
  const asli = String(t || "").replace(/[‎‏‪-‮⁦-⁩]/g, "").replace(/\s+/g, " ").trim(), n = _mpNormAr(asli);
  const s = n.match(/(?:^|\s)سوره\s+(ال\S+|\S+)/);
  if (s && n.split(" ").length <= 5) { const latin = MP_SURAH_PETA[_mpNormAr(s[1])]; return [1, latin ? `Surah ${latin}` : `سورة ${s[1]}`]; }
  const d = n.match(/^(الدرس|الباب|الفصل|الوحده)\s+(\S+(?:\s+\S+){0,5})$/);
  if (d) return [1, asli];
  const b = MP_BAGIAN_AR.find(([re]) => re.test(n));
  if (b && n.split(" ").length <= 6) return [3, b[1]];
  return null;
}

// ── Baca judul satu halaman: lapisan teks dulu (cepat), kalau halaman berupa gambar → OCR ──
async function _mpBacaHalaman(doc, p, bahasa) {
  const page = await doc.getPage(p);
  const tc = await page.getTextContent();
  const teks = tc.items.map((x) => x.str).join("").replace(/\s/g, "");
  const arab = bahasa === "ara";
  const ambil = (baris) => {
    const out = [];
    baris.forEach((b) => {
      const t = typeof b === "string" ? b : b.t, yakin = typeof b === "string" ? 100 : b.c;
      // Latin: OCR harus yakin (≥65). Arab: judul bagian berpola tetap boleh ≥35, nama surah yang tak dikenal harus ≥70
      let j = arab ? _mpJudulArab(t) : null;
      if (j && /[؀-ۿ]/.test(j[1]) && yakin < 70) j = null;
      if (!j && yakin >= 65) j = _mpJudulLatin(t);
      if (j && !out.some((x) => x[1] === j[1])) out.push(j);
    });
    return out;
  };
  if (teks.length > 60) {
    const baris = [];
    tc.items.forEach((it) => {
      const s = String(it.str || "").normalize("NFKC").trim(); if (!s) return;
      const y = Math.round(it.transform[5]), b = baris.find((x) => Math.abs(x.y - y) <= 3);
      if (b) b.p.push([it.transform[4], s]); else baris.push({ y, p: [[it.transform[4], s]] });
    });
    baris.sort((a, b) => b.y - a.y);
    return ambil(baris.map((b) => b.p.sort((x, y) => (arab ? y[0] - x[0] : x[0] - y[0])).map((x) => x[1]).join(" ")));
  }
  const w = await _mpWorker(bahasa); if (!w) return null;
  const v1 = page.getViewport({ scale: 1 }), skala = Math.min(1400 / v1.width, 2000 / v1.height), v = page.getViewport({ scale: skala });
  const c = document.createElement("canvas"); c.width = Math.round(v.width); c.height = Math.round(v.height);
  const ctx = c.getContext("2d"); ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, c.width, c.height);
  await page.render({ canvasContext: ctx, viewport: v }).promise;
  const { data } = await w.recognize(c);
  return ambil((data.lines || []).filter((l) => l.confidence >= (arab ? 35 : 65)).map((l) => ({ t: l.text, c: l.confidence })));
}
function _mpMuatSkrip() {
  if (window.Tesseract) return Promise.resolve(window.Tesseract);
  return (MP.janjiSkrip = MP.janjiSkrip || new Promise((ok, no) => {
    const s = document.createElement("script"); s.src = "https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js";
    s.onload = () => ok(window.Tesseract); s.onerror = () => { MP.janjiSkrip = null; no(new Error("OCR gagal dimuat")); };
    document.head.appendChild(s);
  }));
}
async function _mpWorker(bahasa) {
  try {
    if (MP.worker && MP.bahasa === bahasa) return MP.worker;
    const T = await _mpMuatSkrip();
    if (MP.worker) { try { await MP.worker.terminate(); } catch (e) {} }
    MP.worker = await T.createWorker(bahasa, 1); MP.bahasa = bahasa;
    return MP.worker;
  } catch (e) { console.warn("[peta isi] OCR tidak tersedia:", e.message); return null; }
}
// Perangkat lemah / mode hemat data → tidak memindai (jurnal tetap memakai cara lama: konfirmasi guru)
const _mpBoleh = () => !(navigator.connection && navigator.connection.saveData) && !(navigator.deviceMemory && navigator.deviceMemory < 3);
function _mpBahasaBuku(m) {
  const mp = (typeof LOOKUP !== "undefined" && (LOOKUP.mapel || []).find((x) => x.id === m.mapel_id)) || m.mapel || {};
  return (mp.masuk_diniyyah && !mp.masuk_umum) || /[؀-ۿ]/.test(m.judul || "") ? "ara" : "ind";
}

// ── Simpan peta (bersama, per buku) ──
async function _mpSimpan(url, peta) {
  try {
    const k = _maKunciBuku(url);
    const meta = { ...(MA_META[k] || (await _maMuatMeta(url)) || {}), peta };
    MA_META[k] = meta;
    if (MV.m && MV.m.file_url === url) MV.meta = meta;
    await supa.from("kuliah_pengaturan").upsert({ kunci: k, nilai: meta });
  } catch (e) { console.warn("[peta isi] gagal menyimpan:", e); }
}
// Pindai halaman-halaman tertentu (dipakai saat buku ditutup: halaman yang diajarkan + halaman sebelumnya)
async function _mpPindai(doc, url, peta, halaman, batasMs) {
  const mulai = Date.now(); let baru = 0;
  for (const p of halaman) {
    if (batasMs && Date.now() - mulai > batasMs) break;
    if (p < 1 || p > doc.numPages || peta.hal[p]) continue;
    try { const j = await _mpBacaHalaman(doc, p, peta.bahasa); if (j) { peta.hal[p] = j; baru++; } } catch (e) { peta.hal[p] = []; }
  }
  if (baru) await _mpSimpan(url, peta);
  return peta;
}
// Pemindaian latar belakang selama buku terbuka: halaman yang sedang dibuka & sekitarnya dulu, lalu seluruh buku
async function _mpLatar(doc, m) {
  if (!_mpBoleh() || !doc || !m || !m.file_url) return;
  const meta = await _maMuatMeta(m.file_url);
  const peta = meta.peta && meta.peta.v === MP_VERSI ? meta.peta : { v: MP_VERSI, bahasa: _mpBahasaBuku(m), hal: {} };
  MP.jalan = { doc, peta };
  await new Promise((r) => setTimeout(r, 6000)); // beri waktu buku tampil dulu
  let sejakSimpan = 0;
  while (MP.jalan && MP.jalan.doc === doc && MV.doc === doc) {
    const h = MV.hal || 1, total = doc.numPages;
    const urut = [h, ...Array.from({ length: 12 }, (_, i) => h - 1 - i), ...Array.from({ length: 6 }, (_, i) => h + 1 + i), ...Array.from({ length: total }, (_, i) => i + 1)];
    const p = urut.find((x) => x >= 1 && x <= total && !peta.hal[x]);
    if (!p) break;
    try { const j = await _mpBacaHalaman(doc, p, peta.bahasa); peta.hal[p] = j || []; } catch (e) { peta.hal[p] = []; }
    if (++sejakSimpan >= 8) { sejakSimpan = 0; _mpSimpan(m.file_url, peta); }
    await new Promise((r) => setTimeout(r, 500));
  }
  if (sejakSimpan) _mpSimpan(m.file_url, peta);
}

// ── Susun materi dari peta & halaman yang diajarkan ──
function _mpMateri(peta, diajar, judulBuku) {
  if (!peta || !diajar || !diajar.length) return "";
  const set = new Set(diajar), a = Math.min(...diajar);
  const H = [];
  Object.keys(peta.hal).map(Number).sort((x, y) => x - y).forEach((p) => (peta.hal[p] || []).forEach(([l, t]) => H.push({ p, l, t })));
  const konteks = (lvl) => H.filter((h) => h.l === lvl && h.p <= a && h.p >= a - 60).pop();
  const dalam = (lvl) => H.filter((h) => h.l === lvl && set.has(h.p)).map((h) => h.t);
  const unik = (arr) => [...new Set(arr)];
  const bab = (konteks(0) || {}).t || ((String(judulBuku || "").match(/\bbab\s*\d+/i) || [])[0] || "").replace(/^b/, "B");
  const topik = dalam(1)[0] || (konteks(1) || {}).t || "";
  let sub = unik([...dalam(2), ...dalam(3)]);
  // poin dipersingkat: "Produk Domestik Bruto (PDB) atau Gross Domestic Product (GDP)" → "Produk Domestik Bruto (PDB)"
  const poin = unik(dalam(4).map((t) => t.split(/\s+atau\s+/i)[0].split("/")[0].trim())).slice(0, 5);
  if (!sub.length) {
    const k2 = konteks(2), k3 = konteks(3);
    const k = k3 && (!k2 || k3.p >= k2.p) ? k3 : k2;
    if (k && (poin.length || !topik || k.p > ((konteks(1) || {}).p || 0))) sub = [k.t];
  }
  if (!topik && !sub.length && !poin.length) return "";
  const kepala = [bab, topik].filter(Boolean).join(" ");
  let s = kepala;
  if (sub.length) s += (s ? ": " : "") + sub.slice(0, 4).join(", ");
  if (poin.length) s += (s ? " " : "") + `(${poin.join(", ")})`;
  return s.replace(/\s+/g, " ").trim();
}

// ── Kaitkan ke pembaca modul ──
const _mpMuatPdfAsli = _mvMuatPdf;
_mvMuatPdf = function (el) {
  const hasil = _mpMuatPdfAsli(el), m = MV.m;
  // mulai begitu file PDF siap (tidak menunggu halaman pertama selesai digambar)
  const t = setInterval(() => {
    if (MV.m !== m || !document.getElementById("mv")) return clearInterval(t);
    if (MV.doc) { clearInterval(t); _mpLatar(MV.doc, m); }
  }, 500);
  return hasil;
};
const _mpTutupAsli = _mvTutup;
_mvTutup = function () {
  const doc = MV.doc, m = MV.m, ada = !!document.getElementById("mv");
  _mpTutupAsli.apply(this, arguments);
  MP.jalan = null;
  if (!ada || !doc || !m || !m.file_url) return;
  let log; try { log = JSON.parse(localStorage.getItem("maPresentasi") || "[]")[0]; } catch (e) {}
  if (!log || Date.now() - log.t > 60000) return; // presentasi terlalu singkat → tidak dicatat
  const lama = Object.entries(MV.lamaHal || {}).filter(([, ms]) => ms >= 20000).map(([h]) => +h).sort((x, y) => x - y);
  const diajar = lama.length ? lama : [log.dari, log.sampai].filter(Boolean);
  const judulLama = window._mvJanjiJudul;
  // halaman diajarkan + 10 halaman sebelumnya (untuk tahu bab/topik yang sedang berlaku), maks ±12 detik
  window._mvJanjiJudul = (async () => {
    try {
      const meta = await _maMuatMeta(m.file_url);
      let peta = meta.peta && meta.peta.v === MP_VERSI ? meta.peta : { v: MP_VERSI, bahasa: _mpBahasaBuku(m), hal: {} };
      const a = Math.min(...diajar);
      if (_mpBoleh()) peta = await _mpPindai(doc, m.file_url, peta, [...diajar, ...Array.from({ length: 10 }, (_, i) => a - 1 - i)], 12000);
      const materi = _mpMateri(peta, diajar, m.judul);
      if (materi) {
        const l = JSON.parse(localStorage.getItem("maPresentasi") || "[]"), x = l.find((y) => y.t === log.t);
        if (x) { x.materiOtomatis = materi; localStorage.setItem("maPresentasi", JSON.stringify(l)); }
      }
      const lain = await Promise.race([judulLama, new Promise((r) => setTimeout(() => r([]), 1500))]).catch(() => []);
      return materi ? [materi, ...(lain || [])] : lain || [];
    } catch (e) { console.warn("[peta isi]", e); return []; }
  })();
};

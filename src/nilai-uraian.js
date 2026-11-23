// ============================================================
//  PENILAIAN URAIAN OTOMATIS (saran skor) — dipakai layar guru (rekap) & uji coba santri
//  • Poin penilaian: dari kolom "Poin penilaian" (pisah ;) — atau OTOMATIS dari kunci yang ditulis
//    berbaris/bernomor ("- …", "1. …", "١. …", "a. …"). Baris pengantar yang berakhiran ":" dilewati.
//    Kunci satu paragraf → dipecah per kalimat / koma; bila tetap satu, dinilai dari kelengkapan kata pentingnya.
//  • Isi dalam kurung "( … )" dan "atau / أو" dihitung sebagai JAWABAN LAIN yang juga benar.
//  • Huruf Arab: harakat diabaikan, أ إ آ ٱ → ا, ة → ه, ى → ي, awalan ال/و/ف/ب/ل & akhiran umum dilepas.
//    Huruf Latin: huruf besar/kecil, tanda baca & imbuhan umum (me-, ber-, di-, -kan, -nya…) dilepas.
//  • Salah ketik ringan tetap dihitung (jarak 1–2 huruf), lalu dicatat sebagai catatan penulisan.
//  • Urutan jawaban bebas: santri boleh menjawab bernomor, berbaris, atau satu paragraf.
//  Hasil hanya SARAN — guru tetap memeriksa & menyesuaikan.
// ============================================================
const NU = (() => {
  const HARAKAT = /[ؐ-ًؚ-ٰٟۖ-ۭـ]/g;
  const arab = (s) => /[؀-ۿ]/.test(s);
  const normal = (s) => String(s || "").toLowerCase()
    .replace(HARAKAT, "").replace(/[أإآٱ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه").replace(/ؤ/g, "و").replace(/ئ/g, "ي")
    .replace(/[٠-٩]/g, (d) => d.charCodeAt(0) - 0x660)
    .replace(/[«»"“”'‘’()\[\]{}﴿﴾.,،؛;:!?؟\/\\\-–—_*•…|]+/g, " ").replace(/\s+/g, " ").trim();
  const HENTI = new Set(("yang dan di ke dari untuk dengan pada adalah ini itu atau juga karena oleh akan sebagai dalam tidak ada bisa harus para kita kami " +
    "mereka ia dia suatu sebuah agar maka jadi saat secara seperti yaitu yakni tersebut lalu kemudian setelah sebelum bahwa jika kalau hal cara sangat lebih " +
    "dapat telah sudah masih banyak beberapa semua setiap antara tetapi namun serta hingga sampai pun the of and to in is are " +
    "في من على الى عن ان او و ما هو هي هم هما الذي التي الذين كان كانت قد لا لم لن ثم مع هذا هذه ذلك تلك كل اي بعد قبل حتي اذا عند ايضا " +
    "انه انها به بها له لها فيه فيها منه منها عليه عليها اليه وهو وهي او اي اما").split(/\s+/));
  // akar sederhana: lepas awalan/akhiran yang paling sering
  function akar(w) {
    if (arab(w)) {
      let x = w;
      for (const a of ["وال", "فال", "بال", "كال", "لل", "ال"]) if (x.startsWith(a) && x.length - a.length >= 2) { x = x.slice(a.length); break; }
      if (x.length > 3 && /^[وف]/.test(x)) x = x.slice(1);
      if (x.length > 4) for (const b of ["ات", "ون", "ين", "ان", "ها", "هم", "كم", "نا"]) if (x.endsWith(b)) { x = x.slice(0, -b.length); break; }
      if (x.length > 3 && /[هي]$/.test(x)) x = x.slice(0, -1);
      return x;
    }
    let x = w;
    if (x.length > 5) x = x.replace(/(nya|lah|kah|pun)$/, "");
    if (x.length > 5) x = x.replace(/(kan|an|i)$/, "");
    if (x.length > 5) x = x.replace(/^(meng|meny|mem|men|me|peng|peny|pem|pen|per|pe|ber|be|ter|di|ke|se)/, "");
    return x;
  }
  // kata sambung berawalan و ف ب ل (mis. "ومن", "فهو") juga dilewati
  const henti = (w) => HENTI.has(w) || (/^[وفبل]/.test(w) && w.length > 2 && HENTI.has(w.slice(1)));
  const kata = (s) => normal(s).split(" ").filter((w) => w && (w.length >= 2 || /\d/.test(w)) && !henti(w));
  function jarak(a, b, batas) { // Levenshtein dengan batas
    if (Math.abs(a.length - b.length) > batas) return batas + 1;
    let p = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 1; i <= a.length; i++) {
      const q = [i]; let m = i;
      for (let j = 1; j <= b.length; j++) { q[j] = Math.min(p[j] + 1, q[j - 1] + 1, p[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); m = Math.min(m, q[j]); }
      if (m > batas) return batas + 1; p = q;
    }
    return p[b.length];
  }
  // cari kata kunci di jawaban → { ada, mirip: kata santri yang salah ketik }
  function temukan(w, jw) {
    const a = akar(w);
    for (const x of jw) if (x.w === w || x.a === a) return { ada: true };
    const batas = a.length >= 7 ? 2 : a.length >= 4 ? 1 : 0; if (!batas) return { ada: false };
    for (const x of jw) if (jarak(x.a, a, batas) <= batas || jarak(x.w, w, batas) <= batas) return { ada: true, mirip: x.w };
    return { ada: false };
  }
  // pecah satu poin: teks utama + jawaban lain (dalam kurung / "atau" / "أو" / garis miring)
  function varian(teks) {
    const alt = [], utama = String(teks).replace(/[(（]([^)）]+)[)）]/g, (m, isi) => { alt.push(isi); return " "; });
    const bagi = (s) => s.split(/\s+\/\s+|\s(?:atau|أو|او)\s/).map((x) => x.trim()).filter(Boolean);
    return [...bagi(utama), ...alt.flatMap(bagi)].filter((x) => kata(x).length);
  }
  // poin penilaian: kolom poin_kunci, atau dari kunci berbaris/bernomor
  function poin(ks) {
    const pk = (ks && ks.poin_kunci || []).map((x) => String(x).trim()).filter(Boolean);
    if (pk.length) return { daftar: pk, sumber: "kolom" };
    const k = String((ks && ks.kunci) || "").trim(); if (!k) return { daftar: [], sumber: "kosong" };
    const TANDA = /^\s*(?:[-–•*▪●◦]|\(?[0-9٠-٩]{1,2}\s*[.)\-]|\(?[a-hأ-ي]\s*[.)])\s*/;
    let baris = k.split(/\n+/).map((x) => x.trim()).filter(Boolean);
    if (baris.length >= 2) {
      const bertanda = baris.filter((b) => TANDA.test(b));
      if (bertanda.length >= 2) baris = bertanda; else baris = baris.filter((b, i) => !(i === 0 && /[:：]\s*$/.test(b)));
      baris = baris.map((b) => b.replace(TANDA, "").trim()).filter((b) => kata(b).length);
      if (baris.length >= 2) return { daftar: baris, sumber: "baris" };
    }
    // satu paragraf: per kalimat, lalu per koma bila kalimatnya cuma satu
    let bag = k.replace(/\([^)]*\)/g, (m) => m.replace(/[.;؛،,]/g, " ")).split(/[.;؛]\s+|\n+/).map((x) => x.trim()).filter((x) => kata(x).length >= 2);
    if (bag.length < 2) bag = k.split(/[،,]\s*(?:و|dan\s)?/).map((x) => x.trim()).filter((x) => kata(x).length >= 2);
    if (bag.length >= 2 && bag.length <= 8) return { daftar: bag, sumber: "kalimat" };
    return { daftar: [k], sumber: "paragraf" };
  }
  const bulat = (x) => Math.round(x * 2) / 2;
  // nilai satu jawaban → { skor, maks, rinci:[{teks, status, cakup}], catatan:[], sumber } | null (tanpa kunci)
  function nilai(jawab, ks, maks, soalTeks) {
    maks = Number(maks) || 1;
    const P = poin(ks); if (!P.daftar.length) return null;
    const teks = String(jawab || "");
    if (!teks.trim()) return { skor: 0, maks, rinci: P.daftar.map((t) => ({ teks: t, status: "tidak", cakup: 0 })), catatan: ["Tidak dijawab"], sumber: P.sumber };
    const jw = kata(teks).map((w) => ({ w, a: akar(w) }));
    const mirip = new Map(), dariSoal = new Set(soalTeks ? kata(soalTeks).map(akar) : []);
    const nilaiPoin = (t) => {
      let terbaik = { cakup: 0, mirip: [] };
      for (const v of varian(t)) {
        // kata yang sudah ada di kalimat soal tidak dihitung (menyalin soal bukan menjawab)
        let kk = [...new Set(kata(v))]; const kk2 = kk.filter((w) => !dariSoal.has(akar(w))); if (kk2.length) kk = kk2; if (!kk.length) continue;
        let kena = 0; const mr = [];
        kk.forEach((w) => { const h = temukan(w, jw); if (h.ada) { kena++; if (h.mirip) mr.push([h.mirip, w]); } });
        const cakup = kena / kk.length;
        if (cakup > terbaik.cakup) terbaik = { cakup, mirip: mr };
      }
      return terbaik;
    };
    let rinci, skor;
    if (P.sumber === "paragraf") {
      const h = nilaiPoin(P.daftar[0]); h.mirip.forEach(([a, b]) => mirip.set(a, b));
      skor = bulat(maks * Math.max(0, Math.min(1, (h.cakup - 0.1) / 0.6)));
      rinci = [{ teks: "Kelengkapan kata penting kunci", status: h.cakup >= 0.6 ? "ya" : h.cakup >= 0.3 ? "sebagian" : "tidak", cakup: h.cakup }];
    } else {
      rinci = P.daftar.map((t) => {
        const h = nilaiPoin(t); h.mirip.forEach(([a, b]) => mirip.set(a, b));
        const n = kata(t).length, ya = n <= 2 ? h.cakup >= 0.99 : h.cakup >= 0.6, seb = !ya && h.cakup >= (n <= 2 ? 0.5 : 0.34);
        return { teks: t, status: ya ? "ya" : seb ? "sebagian" : "tidak", cakup: h.cakup };
      });
      const dapat = rinci.reduce((a, r) => a + (r.status === "ya" ? 1 : r.status === "sebagian" ? 0.5 : 0), 0);
      skor = bulat((maks * dapat) / rinci.length);
    }
    // catatan penulisan
    const catatan = [];
    const kunciArab = arab(P.daftar.join(" ")), jawabArab = arab(teks);
    if (kunciArab && !jawabArab) catatan.push("Jawaban ditulis huruf Latin, sedangkan kunci berbahasa Arab");
    if (soalTeks) {
      const ks2 = new Set(kata(soalTeks).map(akar)), baru = jw.filter((x) => !ks2.has(x.a));
      if (jw.length && baru.length <= Math.max(1, jw.length * 0.2)) { catatan.push("Jawaban hanya mengulang kalimat soal"); skor = Math.min(skor, bulat(maks * 0.25)); }
    }
    const isiKunci = kata(P.daftar.join(" ")).length;
    if (jw.length < 3 && isiKunci >= 8) catatan.push("Jawaban terlalu singkat dibanding kunci");
    if (mirip.size) catatan.push("Ejaan perlu dicek: " + [...mirip].slice(0, 4).map(([a, b]) => `“${a}” → “${b}”`).join(", "));
    return { skor: Math.min(maks, Math.max(0, skor)), maks, rinci, catatan, sumber: P.sumber };
  }
  // ringkasan HTML kecil untuk layar guru
  function html(h, esc) {
    if (!h) return "";
    esc = esc || ((s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])));
    const ik = { ya: "✅", sebagian: "🟡", tidak: "❌" };
    const sumber = { kolom: "poin penilaian", baris: "baris-baris kunci", kalimat: "kalimat-kalimat kunci", paragraf: "kata penting kunci" }[h.sumber] || "";
    return `<div class="nu-rinci"><div class="nu-judul">🤖 Saran otomatis <b>${h.skor}</b>/${h.maks} <small>· dari ${sumber}</small></div>
      <ul>${h.rinci.map((r) => `<li class="nu-${r.status}">${ik[r.status]} <span dir="auto">${esc(r.teks.length > 90 ? r.teks.slice(0, 88) + "…" : r.teks)}</span></li>`).join("")}</ul>
      ${h.catatan.length ? `<div class="nu-catatan">${h.catatan.map((c) => `<span>✍️ ${esc(c)}</span>`).join("")}</div>` : ""}</div>`;
  }
  return { normal, kata, akar, poin, nilai, html };
})();
if (typeof document !== "undefined" && !document.getElementById("nu-gaya")) {
  const st = document.createElement("style"); st.id = "nu-gaya";
  st.textContent = `.nu-rinci{margin-top:6px;padding:8px 10px;border-radius:10px;background:#f8fafc;border:1px dashed #cbd5e1;font-size:12.5px}
  .nu-judul{font-weight:700;color:#0f172a;margin-bottom:4px}.nu-judul small{font-weight:500;color:#64748b}
  .nu-rinci ul{list-style:none;margin:0;padding:0}.nu-rinci li{padding:2px 0;line-height:1.5}.nu-rinci li.nu-tidak{color:#94a3b8}
  .nu-catatan{display:flex;flex-wrap:wrap;gap:4px;margin-top:6px}.nu-catatan span{background:#fff7ed;color:#9a3412;border-radius:999px;padding:2px 8px;font-size:11.5px}`;
  (document.head || document.documentElement).appendChild(st);
}

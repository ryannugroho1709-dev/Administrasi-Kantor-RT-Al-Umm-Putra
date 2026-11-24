// ============================================================
//  KANTOR MAYA — merapikan catatan rapat agar mudah dibaca
//  Setiap butir "Label: a, b · c" → label tebal + kapsul angka; daftar agenda "Judul (16 Nov), …"
//  → daftar bertingkat dengan tanggal di kanan; judul jenjang ("Paket A:") jadi kepala kecil.
// ============================================================
const KT_BULAN_PENDEK = /\b\d{1,2}\s(Jan|Feb|Mar|Apr|Mei|Jun|Jul|Agu|Ags|Sep|Okt|Nov|Des)\b/;
function _ktRapikan(html) {
  if (!html || typeof html !== "string" || html.indexOf("<li") < 0) return html;
  const w = document.createElement("div"); w.innerHTML = html;
  // judul jenjang di depan daftar: "<b>Paket A</b>:" → kepala kecil
  [...w.childNodes].forEach((n) => {
    if (n.nodeType === 1 && n.tagName === "B" && n.nextSibling && n.nextSibling.nodeType === 3 && /^\s*:\s*$/.test(n.nextSibling.textContent)) {
      const h = document.createElement("div"); h.className = "kt-r-judul"; h.textContent = n.textContent; n.nextSibling.remove(); n.replaceWith(h);
    }
  });
  w.querySelectorAll("ul.kt-ul > li").forEach((li) => {
    if (li.querySelector("ul,.kt-r-label")) return;
    const isi = li.innerHTML.trim();
    const m = isi.match(/^(?:<b>)?([^:<>]{2,42}?)(?:<\/b>)?\s*:\s*([\s\S]+)$/);
    if (!m) return;
    const label = m[1].trim(), sisa = m[2].trim();
    // daftar agenda bertanggal
    if (KT_BULAN_PENDEK.test(sisa) && (sisa.match(/\(/g) || []).length >= 2) {
      const item = sisa.split(/\),\s*/).map((s, i, a) => (i < a.length - 1 ? s + ")" : s)).filter((s) => s.trim());
      li.className = "kt-r-li"; li.innerHTML = `<div class="kt-r-label">${label}</div><ul class="kt-r-agenda">${item.map((s) => {
        const mm = s.match(/^([\s\S]*?)\s*\(([^()]*)\)\s*$/);
        return mm ? `<li><span>${mm[1]}</span><em>${mm[2]}</em></li>` : `<li><span>${s}</span></li>`;
      }).join("")}</ul>`;
      return;
    }
    // angka-angka pendek → kapsul
    const bagian = sisa.split(/,\s+|\s+·\s+/).map((s) => s.trim()).filter(Boolean);
    const teksBagian = bagian.map((s) => s.replace(/<[^>]+>/g, ""));
    if (bagian.length >= 2 && bagian.length <= 9 && teksBagian.every((t) => t.length <= 48) && teksBagian.some((t) => /\d/.test(t))) {
      li.className = "kt-r-li"; li.innerHTML = `<div class="kt-r-label">${label}</div><div class="kt-r-kapsul">${bagian.map((s) => {
        const t = /<b>/.test(s) ? s : s.replace(/^(Rp\s?[\d.,]+|\d[\d.,]*%?)/, "<b>$1</b>");
        return `<span>${t}</span>`;
      }).join("")}</div>`;
      return;
    }
    // kalimat panjang biasa: label tetap ditebalkan, isinya di baris sendiri
    if (sisa.replace(/<[^>]+>/g, "").length > 60) { li.className = "kt-r-li"; li.innerHTML = `<div class="kt-r-label">${label}</div><div class="kt-r-teks">${sisa}</div>`; }
  });
  return w.innerHTML;
}
(function () {
  if (typeof _ktTampilBaris !== "function") return;
  const a = _ktTampilBaris;
  _ktTampilBaris = function (b) { try { if (b && b.html) b = { ...b, html: _ktRapikan(b.html) }; } catch (e) {} return a.call(this, b); };
})();

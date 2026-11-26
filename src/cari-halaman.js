// ============================================================
//  🔎 CARI DI HALAMAN — kotak pencarian untuk halaman bacaan (Juknis BOSP, dll.)
//  • Semua kata harus ada (urutan bebas, huruf besar/kecil & tanda baca diabaikan).
//  • Kartu/bagian yang tidak cocok disembunyikan, bagian lipat (<details>) yang cocok dibuka,
//    kata yang cocok disorot kuning; tombol ↑ ↓ (atau Enter / Shift+Enter) lompat antarhasil.
//  Pemakaian: cariHalamanPasang(wadah, { item: ".card", sub: "details", placeholder })
// ============================================================
const _chNorm = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
function cariHalamanPasang(wadah, opsi = {}) {
  if (!wadah || wadah.querySelector(":scope > .ch-bar")) return;
  const bar = document.createElement("div"); bar.className = "ch-bar";
  bar.innerHTML = `<span class="ch-ikon">🔎</span><input type="search" class="ch-input" placeholder="${opsi.placeholder || "Cari di halaman ini…"}" autocomplete="off">
    <span class="ch-info"></span><button type="button" class="ch-nav" data-arah="-1" title="Sebelumnya (Shift+Enter)">↑</button><button type="button" class="ch-nav" data-arah="1" title="Berikutnya (Enter)">↓</button>`;
  wadah.insertBefore(bar, wadah.firstChild);
  const st = { kini: -1, sorot: [], t: 0 }, inp = bar.querySelector("input"), info = bar.querySelector(".ch-info");
  const bersih = () => {
    wadah.querySelectorAll("mark.ch-sorot").forEach((m) => { const p = m.parentNode; p.replaceChild(document.createTextNode(m.textContent), m); p.normalize(); });
    wadah.querySelectorAll(".ch-sembunyi").forEach((x) => x.classList.remove("ch-sembunyi"));
    wadah.querySelectorAll("details[data-ch-buka]").forEach((d) => { d.open = false; d.removeAttribute("data-ch-buka"); });
  };
  const sorotDi = (akar, kata) => {
    const jalan = document.createTreeWalker(akar, NodeFilter.SHOW_TEXT, { acceptNode: (n) => (n.parentElement.closest(".ch-bar,script,style") || !n.nodeValue.trim() ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT) });
    const simpul = []; while (jalan.nextNode()) simpul.push(jalan.currentNode);
    simpul.forEach((n) => {
      const t = n.nodeValue, low = _chNorm(t), pos = [];
      kata.forEach((k) => { let i = low.indexOf(k); while (i >= 0) { pos.push([i, i + k.length]); i = low.indexOf(k, i + k.length); } });
      if (!pos.length) return;
      pos.sort((a, b) => a[0] - b[0]); const gabung = [];
      pos.forEach((p) => { const g = gabung[gabung.length - 1]; if (g && p[0] <= g[1]) g[1] = Math.max(g[1], p[1]); else gabung.push([...p]); });
      const frag = document.createDocumentFragment(); let akhir = 0;
      gabung.forEach(([a, b]) => { frag.appendChild(document.createTextNode(t.slice(akhir, a))); const m = document.createElement("mark"); m.className = "ch-sorot"; m.textContent = t.slice(a, b); frag.appendChild(m); akhir = b; });
      frag.appendChild(document.createTextNode(t.slice(akhir))); n.parentNode.replaceChild(frag, n);
    });
  };
  const lompat = (arah) => {
    if (!st.sorot.length) return;
    st.kini = (st.kini + arah + st.sorot.length) % st.sorot.length;
    st.sorot.forEach((m, i) => m.classList.toggle("kini", i === st.kini));
    const m = st.sorot[st.kini], d = m.closest("details"); if (d && !d.open) { d.open = true; d.setAttribute("data-ch-buka", "1"); }
    m.scrollIntoView({ behavior: "smooth", block: "center" });
    info.textContent = `${st.kini + 1}/${st.sorot.length}`;
  };
  const cari = () => {
    bersih(); st.sorot = []; st.kini = -1;
    const kata = _chNorm(inp.value).split(/[^a-z0-9%]+/).filter((k) => k.length >= 2 || /\d/.test(k));
    if (!kata.length) { info.textContent = ""; bar.classList.remove("kosong"); return; }
    const item = [...wadah.querySelectorAll(opsi.item || ".card")].filter((x) => !x.closest(".ch-bar"));
    let cocok = 0;
    item.forEach((it) => {
      const teks = _chNorm(it.textContent), ada = kata.every((k) => teks.includes(k));
      // kartu bersarang: yang luar tidak disembunyikan bila ada kartu dalam yang cocok
      if (!ada) { it.classList.add("ch-sembunyi"); return; }
      cocok++;
      if (opsi.sub) it.querySelectorAll(opsi.sub).forEach((s) => { const t2 = _chNorm(s.textContent); if (kata.some((k) => t2.includes(k))) { if (s.tagName === "DETAILS" && !s.open) { s.open = true; s.setAttribute("data-ch-buka", "1"); } } else if (s.tagName === "DETAILS") s.classList.add("ch-sembunyi"); });
    });
    item.filter((it) => !it.classList.contains("ch-sembunyi")).forEach((it) => { if (!it.parentElement.closest(".ch-sembunyi")) sorotDi(it, kata); });
    st.sorot = [...wadah.querySelectorAll("mark.ch-sorot")].filter((m) => !m.closest(".ch-sembunyi"));
    bar.classList.toggle("kosong", !cocok);
    info.textContent = cocok ? `${st.sorot.length} hasil` : "Tidak ditemukan";
    if (st.sorot.length) lompat(1);
  };
  inp.addEventListener("input", () => { clearTimeout(st.t); st.t = setTimeout(cari, 220); });
  inp.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); if (st.sorot.length) lompat(e.shiftKey ? -1 : 1); else cari(); } if (e.key === "Escape") { inp.value = ""; cari(); } });
  bar.querySelectorAll(".ch-nav").forEach((b) => b.addEventListener("click", () => lompat(Number(b.dataset.arah))));
  return { cari: (t) => { inp.value = t; cari(); }, bar };
}

// ── Juknis BOSP & Data Rekening ARKAS bagian "Penting Dibaca" ──
(function () {
  if (typeof bspBukaJuknis === "function") {
    const a = bspBukaJuknis;
    bspBukaJuknis = function () {
      const r = a.apply(this, arguments);
      try { const w = document.querySelector(".bsp-juknis"); if (w) cariHalamanPasang(w, { item: ".bsp-j", sub: "details, li, tr", placeholder: "Cari di Juknis BOSP… mis. honor 40%, laptop aset, batas lapor" }); } catch (e) { console.warn(e); }
      return r;
    };
  }
})();

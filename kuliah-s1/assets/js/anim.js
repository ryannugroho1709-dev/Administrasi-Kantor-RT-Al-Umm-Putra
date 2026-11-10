/* =====================================================================
   ANIMASI MATERI (blok { t: "anim", jenis: "…" }) — dipakai terutama oleh
   PPTA 301 Tes & Asesmen Psikologis. Semua SVG/HTML, tanpa pustaka luar,
   mengikuti warna tema (terang/gelap) & pengaturan "gerak" pengguna.
   Jenis: kurva · target · korelasi · sem · alur · siklus · garis-waktu ·
          profil · dua-kurva · tinta · otak · spektrum
   ===================================================================== */
window.Anim = (function () {
  const esc = s => U.esc(String(s == null ? "" : s));
  const one = x => (x == null ? "" : typeof x === "object" ? U.one(x) : U.fmt(String(x)));
  const gerak = () => !(window.Store && Store.s && Store.s.set && Store.s.set.gerak === false) && !matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fix = (n, d) => Number(n).toFixed(d == null ? 1 : d);
  // CDF normal baku (Abramowitz–Stegun)
  function cdf(z) { const t = 1 / (1 + 0.2316419 * Math.abs(z)), d = 0.3989423 * Math.exp(-z * z / 2); const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274)))); return z > 0 ? 1 - p : p; }
  const pdf = z => Math.exp(-z * z / 2) / Math.sqrt(2 * Math.PI);
  let uid = 0;

  /* ── kerangka blok ── */
  function html(b) {
    const id = "an" + (++uid), f = J[b.jenis];
    if (!f) return "";
    return '<figure class="blk rv anim an-' + esc(b.jenis) + '" data-anim="' + esc(b.jenis) + '" data-id="' + id + '">' +
      '<div class="an-h">' + Icon("play") + (b.judul ? one(b.judul) : "Animasi") + '<button type="button" class="an-ulang" title="Putar ulang">' + Icon("refresh") + "</button></div>" +
      '<div class="an-stage">' + f.html(b, id) + "</div>" + (b.ket ? '<figcaption class="an-ket">' + one(b.ket) + "</figcaption>" : "") + "</figure>";
  }
  const DATA = {};
  function simpan(id, b) { DATA[id] = b; }
  function init(root) {
    root.querySelectorAll(".anim:not(.an-siap)").forEach(el => {
      el.classList.add("an-siap");
      const j = J[el.dataset.anim]; if (!j || !j.init) return;
      const b = DATA[el.dataset.id] || {};
      const jalan = () => { try { j.init(el, b); } catch (e) { console.warn("[anim]", e); } };
      // mulai saat terlihat
      if ("IntersectionObserver" in window) {
        const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { io.disconnect(); jalan(); } }), { threshold: 0.2 });
        io.observe(el);
      } else jalan();
      el.querySelector(".an-ulang").addEventListener("click", () => { if (window.Audio2) Audio2.sfx("tap"); el.querySelector(".an-stage").innerHTML = j.html(b, el.dataset.id); jalan(); });
    });
  }
  // urutkan kemunculan elemen ber-kelas .an-in (pakai --i untuk jeda)
  function tampilkan(el, jeda) {
    const xs = el.querySelectorAll(".an-in");
    if (!gerak()) { xs.forEach(x => x.classList.add("on")); return; }
    xs.forEach(x => { x.classList.remove("on"); const i = +(x.style.getPropertyValue("--i") || 0); setTimeout(() => x.classList.add("on"), 120 + i * (jeda || 260)); });
  }
  const svg = (w, h, isi, cls) => '<svg class="an-svg ' + (cls || "") + '" viewBox="0 0 ' + w + " " + h + '" role="img">' + isi + "</svg>";

  const J = {};

  /* ════════ 1. KURVA NORMAL — geser skor → z, T, IQ, persentil ════════ */
  J.kurva = {
    html(b, id) {
      simpan(id, b);
      const W = 600, H = 250, x = z => 300 + z * 80, y = v => 205 - v * 420;
      let d = ""; for (let z = -3.6; z <= 3.61; z += 0.1) d += (d ? "L" : "M") + fix(x(z)) + " " + fix(y(pdf(z)));
      const pita = [[-3, -2, "2,1%", "c3"], [-2, -1, "13,6%", "c2"], [-1, 0, "34,1%", "c1"], [0, 1, "34,1%", "c1"], [1, 2, "13,6%", "c2"], [2, 3, "2,1%", "c3"]];
      const area = (a, c) => { let p = "M" + fix(x(a)) + " " + y(0); for (let z = a; z <= c + 1e-9; z += 0.05) p += "L" + fix(x(z)) + " " + fix(y(pdf(z))); return p + "L" + fix(x(c)) + " " + y(0) + "Z"; };
      const skala = b.skala || "semua";
      const lab = z => (skala === "iq" ? 100 + 15 * z : skala === "t" ? 50 + 10 * z : skala === "z" ? z : null);
      return svg(W, H,
        pita.map((p, i) => '<path class="an-in pita ' + p[3] + '" style="--i:' + (i + 2) + '" d="' + area(p[0], p[1]) + '"/><text class="an-in kecil" style="--i:' + (i + 2) + '" x="' + x(p[3] === "c3" ? Math.sign(p[0]) * 2.75 : (p[0] + p[1]) / 2) + '" y="' + (p[3] === "c1" ? 160 : p[3] === "c2" ? 188 : 172) + '" text-anchor="middle">' + p[2] + "</text>").join("") +
        '<path class="garis-kurva" pathLength="1" d="' + d + '"/>' +
        '<line x1="20" x2="580" y1="205" y2="205" class="sumbu"/>' +
        [-3, -2, -1, 0, 1, 2, 3].map(z => '<line class="tik" x1="' + x(z) + '" x2="' + x(z) + '" y1="205" y2="211"/><text class="kecil" x="' + x(z) + '" y="224" text-anchor="middle">' + (lab(z) == null ? (z > 0 ? "+" : "") + z + "SD" : lab(z)) + "</text>" +
          (skala === "semua" ? '<text class="mini" x="' + x(z) + '" y="238" text-anchor="middle">IQ ' + (100 + 15 * z) + " · T " + (50 + 10 * z) + "</text>" : "")).join("") +
        '<g class="penanda"><line class="pn-garis" x1="300" x2="300" y1="30" y2="205"/><circle class="pn-titik" cx="300" cy="' + fix(y(pdf(0))) + '" r="7"/></g>') +
        '<div class="an-kendali"><input type="range" class="an-geser" min="-3" max="3" step="0.05" value="' + (b.awal || 1) + '" aria-label="Skor z"><div class="an-baca"></div></div>';
    },
    init(el, b) {
      const s = el.querySelector(".an-svg"), g = el.querySelector(".an-geser"), baca = el.querySelector(".an-baca");
      const x = z => 300 + z * 80, y = v => 205 - v * 420;
      const atur = () => {
        const z = +g.value, p = cdf(z) * 100;
        s.querySelector(".pn-garis").setAttribute("x1", x(z)); s.querySelector(".pn-garis").setAttribute("x2", x(z));
        const t = s.querySelector(".pn-titik"); t.setAttribute("cx", x(z)); t.setAttribute("cy", fix(y(pdf(z))));
        baca.innerHTML = "<span><b>z</b> " + (z > 0 ? "+" : "") + fix(z, 2) + "</span><span><b>T</b> " + Math.round(50 + 10 * z) + "</span><span><b>IQ</b> " + Math.round(100 + 15 * z) + "</span><span><b>Persentil</b> " + (p < 1 ? "<1" : p > 99 ? ">99" : Math.round(p)) + "</span>" +
          '<small>' + (z >= 2 ? "Sangat tinggi — kurang dari 2,3% populasi di atas skor ini" : z >= 1 ? "Di atas rata-rata" : z > -1 ? "Rentang rata-rata (±1 SD ≈ 68% populasi)" : z > -2 ? "Di bawah rata-rata" : "Sangat rendah — sekitar 2,3% populasi di bawah skor ini") + "</small>";
      };
      g.addEventListener("input", atur); atur();
      el.classList.remove("jalan"); void el.offsetWidth; el.classList.add("jalan");
      tampilkan(el, 220);
    }
  };

  /* ════════ 2. TARGET — reliabel vs valid ════════ */
  J.target = {
    html(b, id) {
      simpan(id, b);
      const panel = b.panel || [
        { judul: "Reliabel & valid", cx: 0, cy: 0, sebar: 6 },
        { judul: "Reliabel, TIDAK valid", cx: 34, cy: -26, sebar: 6 },
        { judul: "Tidak reliabel → tidak valid", cx: 0, cy: 0, sebar: 40, acak: true }
      ];
      return '<div class="tg-grid">' + panel.map((p, i) => '<div class="tg-kartu" data-i="' + i + '">' +
        svg(140, 140, [60, 45, 30, 15].map((r, k) => '<circle cx="70" cy="70" r="' + r + '" class="tg-c' + (k % 2) + '"/>').join("") + '<circle cx="70" cy="70" r="4" class="tg-pusat"/><g class="tg-panah"></g>') +
        '<b>' + one(p.judul) + "</b>" + (p.ket ? "<small>" + one(p.ket) + "</small>" : "") + "</div>").join("") + "</div>";
    },
    init(el, b) {
      const panel = b.panel || [{ cx: 0, cy: 0, sebar: 6 }, { cx: 34, cy: -26, sebar: 6 }, { cx: 0, cy: 0, sebar: 40, acak: true }];
      let seed = 7; const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
      el.querySelectorAll(".tg-kartu").forEach((k, i) => {
        const p = panel[i] || {}, g = k.querySelector(".tg-panah"); g.innerHTML = "";
        for (let n = 0; n < 7; n++) {
          const a = rnd() * Math.PI * 2, r = (p.acak ? 0.25 + rnd() * 0.75 : rnd()) * p.sebar;
          const cx = 70 + p.cx + Math.cos(a) * r, cy = 70 + p.cy + Math.sin(a) * r;
          const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
          c.setAttribute("cx", fix(cx)); c.setAttribute("cy", fix(cy)); c.setAttribute("r", 4.5); c.setAttribute("class", "tg-dart an-in"); c.style.setProperty("--i", i * 7 + n);
          g.appendChild(c);
        }
      });
      tampilkan(el, 110);
    }
  };

  /* ════════ 3. KORELASI — geser r ════════ */
  J.korelasi = {
    html(b, id) {
      simpan(id, b);
      return svg(320, 240, '<line x1="30" y1="210" x2="305" y2="210" class="sumbu"/><line x1="30" y1="210" x2="30" y2="15" class="sumbu"/>' +
        '<text class="kecil" x="168" y="232" text-anchor="middle">' + esc(b.x || "Variabel X") + '</text><text class="kecil" x="12" y="112" text-anchor="middle" transform="rotate(-90 12 112)">' + esc(b.y || "Variabel Y") + "</text>" +
        '<g class="kr-titik"></g><line class="kr-garis" x1="40" y1="200" x2="295" y2="25"/>') +
        '<div class="an-kendali"><input type="range" class="an-geser" min="-1" max="1" step="0.05" value="' + (b.awal != null ? b.awal : 0.8) + '" aria-label="Korelasi r"><div class="an-baca"></div></div>';
    },
    init(el) {
      let seed = 3; const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
      const gauss = () => { let u = 0, v = 0; while (!u) u = rnd(); while (!v) v = rnd(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
      const pas = Array.from({ length: 46 }, () => [gauss(), gauss()]);
      const g = el.querySelector(".kr-titik"), geser = el.querySelector(".an-geser"), baca = el.querySelector(".an-baca"), garis = el.querySelector(".kr-garis");
      g.innerHTML = pas.map((_, i) => '<circle r="4" class="kr-t an-in" style="--i:' + i + '"/>').join("");
      const titik = g.querySelectorAll("circle");
      const atur = () => {
        const r = +geser.value, k = Math.sqrt(Math.max(0, 1 - r * r));
        pas.forEach(([a, c], i) => { const yy = r * a + k * c; titik[i].setAttribute("cx", fix(168 + a * 42)); titik[i].setAttribute("cy", fix(112 - yy * 42)); });
        garis.setAttribute("y1", fix(112 + r * 2.2 * 42)); garis.setAttribute("y2", fix(112 - r * 2.2 * 42)); garis.setAttribute("x1", fix(168 - 2.2 * 42)); garis.setAttribute("x2", fix(168 + 2.2 * 42));
        garis.style.opacity = Math.abs(r) < 0.1 ? 0.15 : 0.8;
        const a = Math.abs(r), kuat = a >= 0.7 ? "kuat" : a >= 0.4 ? "sedang" : a >= 0.1 ? "lemah" : "hampir tidak ada";
        baca.innerHTML = "<span><b>r</b> = " + (r > 0 ? "+" : "") + fix(r, 2) + "</span><span><b>r²</b> = " + Math.round(r * r * 100) + "% varians bersama</span><small>Hubungan " + kuat + (a >= 0.1 ? (r > 0 ? ", positif (X naik → Y naik)" : ", negatif (X naik → Y turun)") : "") + ". Korelasi ≠ sebab-akibat.</small>";
      };
      geser.addEventListener("input", atur); atur(); tampilkan(el, 25);
    }
  };

  /* ════════ 4. SEM — skor amatan berayun di sekitar skor sejati ════════ */
  J.sem = {
    html(b, id) {
      simpan(id, b);
      const x = v => 40 + (v - 55) * 5.2;
      return svg(600, 170, '<line x1="30" x2="575" y1="120" y2="120" class="sumbu"/>' +
        [60, 70, 80, 90, 100, 110, 120, 130, 140].map(v => '<line class="tik" x1="' + x(v) + '" x2="' + x(v) + '" y1="120" y2="126"/><text class="kecil" x="' + x(v) + '" y="142" text-anchor="middle">' + v + "</text>").join("") +
        '<rect class="sem-95" y="58" height="58"/><rect class="sem-68" y="58" height="58"/>' +
        '<line class="sem-sejati" y1="40" y2="120"/><text class="sem-lbl kecil" y="34" text-anchor="middle">skor sejati ' + (b.sejati || 100) + '</text><g class="sem-amatan"></g>') +
        '<div class="an-kendali"><label class="kecil-l">Reliabilitas tes (r<sub>xx</sub>)</label><input type="range" class="an-geser" min="0.5" max="0.99" step="0.01" value="' + (b.r || 0.9) + '" aria-label="Reliabilitas"><div class="an-baca"></div></div>';
    },
    init(el, b) {
      const sejati = b.sejati || 100, SD = b.sd || 15, x = v => 40 + (v - 55) * 5.2;
      const s = el.querySelector(".an-svg"), geser = el.querySelector(".an-geser"), baca = el.querySelector(".an-baca"), g = s.querySelector(".sem-amatan");
      s.querySelector(".sem-sejati").setAttribute("x1", x(sejati)); s.querySelector(".sem-sejati").setAttribute("x2", x(sejati)); s.querySelector(".sem-lbl").setAttribute("x", x(sejati));
      let seed = 11; const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
      const gauss = () => { let u = 0, v = 0; while (!u) u = rnd(); while (!v) v = rnd(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
      const acak = Array.from({ length: 14 }, gauss);
      const atur = () => {
        const r = +geser.value, sem = SD * Math.sqrt(1 - r);
        const b68 = s.querySelector(".sem-68"), b95 = s.querySelector(".sem-95");
        b68.setAttribute("x", x(sejati - sem)); b68.setAttribute("width", Math.max(1, x(sejati + sem) - x(sejati - sem)));
        b95.setAttribute("x", x(sejati - 1.96 * sem)); b95.setAttribute("width", Math.max(1, x(sejati + 1.96 * sem) - x(sejati - 1.96 * sem)));
        g.innerHTML = acak.map((z, i) => '<circle class="sem-o an-in on" r="5" cx="' + fix(x(sejati + z * sem)) + '" cy="' + (66 + (i % 5) * 11) + '" style="--i:' + i + '"/>').join("");
        baca.innerHTML = "<span><b>SEM</b> = SD×√(1−r) = " + SD + "×√(1−" + fix(r, 2) + ") = <b>" + fix(sem, 1) + "</b></span><span><b>CI 95%</b> = " + Math.round(sejati - 1.96 * sem) + "–" + Math.round(sejati + 1.96 * sem) + "</span><small>Makin tinggi reliabilitas, makin sempit rentang kesalahan — skor amatan makin dekat dengan skor sejati.</small>";
      };
      geser.addEventListener("input", atur); atur();
      if (gerak()) { g.querySelectorAll("circle").forEach(c => c.classList.remove("on")); tampilkan(el, 120); }
    }
  };

  /* ════════ 5. ALUR — langkah menyala bergantian, titik berjalan ════════ */
  J.alur = {
    html(b, id) {
      simpan(id, b);
      return '<div class="al-baris">' + b.item.map((it, i) => '<div class="al-node an-in" style="--i:' + i + '"><span class="al-no">' + (it.ikon ? Icon(it.ikon) : i + 1) + '</span><b>' + one(it.judul || it) + "</b>" + (it.ket ? "<small>" + one(it.ket) + "</small>" : "") + "</div>" + (i < b.item.length - 1 ? '<div class="al-panah an-in" style="--i:' + i + '"><i></i></div>' : "")).join("") + "</div>" +
        (b.balik ? '<div class="al-balik">' + Icon("refresh") + one(b.balik) + "</div>" : "");
    },
    init(el) {
      tampilkan(el, 380);
      if (!gerak()) return;
      const n = el.querySelectorAll(".al-node"); let k = 0;
      clearInterval(el._t); el._t = setInterval(() => { if (!document.body.contains(el)) return clearInterval(el._t); n.forEach((x, i) => x.classList.toggle("aktif", i === k)); k = (k + 1) % n.length; }, 1400);
    }
  };

  /* ════════ 6. SIKLUS — node melingkar, sorotan berputar ════════ */
  J.siklus = {
    html(b, id) {
      simpan(id, b);
      const n = b.item.length, R = 92;
      return '<div class="sk-wadah">' + svg(300, 260, '<circle cx="150" cy="130" r="' + R + '" class="sk-orbit"/><circle r="7" class="sk-bola"><animateMotion dur="' + (n * 1.6) + 's" repeatCount="indefinite" path="M150 ' + (130 - R) + ' a' + R + " " + R + " 0 1 1 -0.1 0" + '"/></circle>' +
        (b.pusat ? '<text x="150" y="134" text-anchor="middle" class="sk-pusat">' + esc(U.pickId ? U.pickId(b.pusat) : b.pusat) + "</text>" : "")) +
        b.item.map((it, i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / n; return '<div class="sk-node an-in" style="--i:' + i + ";left:" + fix(50 + Math.cos(a) * 31) + "%;top:" + fix(50 + Math.sin(a) * 36) + '%"><b>' + one(it.judul || it) + "</b>" + (it.ket ? "<small>" + one(it.ket) + "</small>" : "") + "</div>"; }).join("") + "</div>";
    },
    init(el) {
      tampilkan(el, 300);
      if (!gerak()) { el.querySelectorAll("animateMotion").forEach(a => a.remove()); return; }
      const n = el.querySelectorAll(".sk-node"); let k = 0;
      clearInterval(el._t); el._t = setInterval(() => { if (!document.body.contains(el)) return clearInterval(el._t); n.forEach((x, i) => x.classList.toggle("aktif", i === k)); k = (k + 1) % n.length; }, 1600);
    }
  };

  /* ════════ 7. GARIS WAKTU — titik berjalan, peristiwa muncul; ketuk untuk rincian ════════ */
  J["garis-waktu"] = {
    html(b, id) {
      simpan(id, b);
      return '<div class="gw"><div class="gw-garis"><i></i></div>' + b.item.map((it, i) => '<button type="button" class="gw-item an-in" style="--i:' + i + '"><span class="gw-th">' + esc(it.th) + '</span><span class="gw-dot"></span><b>' + one(it.judul) + "</b>" + (it.ket ? '<small class="gw-ket">' + one(it.ket) + "</small>" : "") + "</button>").join("") + "</div>";
    },
    init(el) {
      tampilkan(el, 420);
      el.querySelectorAll(".gw-item").forEach(x => x.addEventListener("click", () => { x.classList.toggle("buka"); if (window.Audio2) Audio2.sfx("tap"); }));
    }
  };

  /* ════════ 8. PROFIL — profil MMPI / indeks WAIS digambar bertahap ════════ */
  J.profil = {
    html(b, id) {
      simpan(id, b);
      const sk = b.skala, n = sk.length, min = b.min != null ? b.min : 30, max = b.max != null ? b.max : 110, W = 600, H = 240;
      const x = i => 50 + i * (520 / Math.max(1, n - 1)), y = v => 200 - (v - min) / (max - min) * 175;
      const batang = b.mode === "batang";
      const pita = b.rata != null ? '<rect class="pf-rata" x="30" width="560" y="' + y((b.rata || 0) + (b.sd || 0)) + '" height="' + (y((b.rata || 0) - (b.sd || 0)) - y((b.rata || 0) + (b.sd || 0))) + '"/><text class="mini" x="586" y="' + (y(b.rata) + 4) + '" text-anchor="end">rata-rata ±1 SD</text>' : "";
      const batas = b.batas != null ? '<line class="pf-batas" x1="30" x2="590" y1="' + y(b.batas) + '" y2="' + y(b.batas) + '"/><text class="kecil pf-batas-t" x="588" text-anchor="end" y="' + (y(b.batas) - 6) + '">' + esc(b.batasLabel || "batas klinis T " + b.batas) + "</text>" : "";
      let d = ""; sk.forEach((s, i) => d += (i ? "L" : "M") + x(i) + " " + fix(y(s.v)));
      return svg(W, H, pita + batas + '<line x1="30" x2="590" y1="200" y2="200" class="sumbu"/>' +
        (batang ? sk.map((s, i) => '<rect class="pf-bar an-in' + (b.batas != null && s.v >= b.batas ? " tinggi" : "") + '" style="--i:' + i + '" x="' + (x(i) - 18) + '" width="36" y="' + fix(y(s.v)) + '" height="' + fix(200 - y(s.v)) + '"/>').join("")
          : '<path class="pf-garis" pathLength="1" d="' + d + '"/>' + sk.map((s, i) => '<circle class="pf-titik an-in' + (b.batas != null && s.v >= b.batas ? " tinggi" : "") + '" style="--i:' + i + '" cx="' + x(i) + '" cy="' + fix(y(s.v)) + '" r="6"/>').join("")) +
        sk.map((s, i) => '<text class="kecil an-in" style="--i:' + i + '" x="' + x(i) + '" y="' + fix(y(s.v) - 11) + '" text-anchor="middle">' + s.v + '</text><text class="kecil pf-k" x="' + x(i) + '" y="218" text-anchor="middle">' + esc(s.k) + "</text>" + (s.n ? '<text class="mini" x="' + x(i) + '" y="232" text-anchor="middle">' + esc(s.n) + "</text>" : "")).join(""));
    },
    init(el) { el.classList.remove("jalan"); void el.offsetWidth; el.classList.add("jalan"); tampilkan(el, 170); }
  };

  /* ════════ 9. DUA KURVA — titik potong: sensitivitas, spesifisitas, positif/negatif palsu ════════ */
  J["dua-kurva"] = {
    html(b, id) {
      simpan(id, b);
      return svg(600, 230, '<path class="dk-a"/><path class="dk-b"/><path class="dk-fp"/><path class="dk-fn"/>' +
        '<line x1="20" x2="580" y1="190" y2="190" class="sumbu"/><line class="dk-cut" y1="20" y2="190"/><text class="kecil dk-cut-t" y="16" text-anchor="middle"></text>' +
        '<text class="kecil dk-la" y="50" text-anchor="middle"></text><text class="kecil dk-lb" y="50" text-anchor="middle"></text><g class="dk-tik"></g>') +
        '<div class="an-kendali"><label class="kecil-l">' + esc(b.geserLabel || "Geser titik potong (cut-off)") + '</label><input type="range" class="an-geser" min="0" max="100" step="1" value="50" aria-label="Titik potong"><div class="an-baca"></div></div>';
    },
    init(el, b) {
      const A = b.a || { label: "Tidak ada gangguan", m: 35, sd: 10 }, B = b.b || { label: "Ada gangguan", m: 62, sd: 11 };
      const lo = b.min != null ? b.min : 0, hi = b.max != null ? b.max : 100;
      const x = v => 30 + (v - lo) / (hi - lo) * 540, y = v => 190 - v * 150;
      const den = (v, D) => Math.exp(-((v - D.m) ** 2) / (2 * D.sd * D.sd));
      const s = el.querySelector(".an-svg"), geser = el.querySelector(".an-geser"), baca = el.querySelector(".an-baca");
      geser.min = lo; geser.max = hi; geser.value = b.cut != null ? b.cut : Math.round((A.m + B.m) / 2);
      const jalur = (D, a, c) => { let p = "M" + fix(x(a)) + " 190"; for (let v = a; v <= c + 1e-9; v += (hi - lo) / 200) p += "L" + fix(x(v)) + " " + fix(y(den(v, D))); return p + "L" + fix(x(c)) + " 190Z"; };
      s.querySelector(".dk-a").setAttribute("d", jalur(A, lo, hi)); s.querySelector(".dk-b").setAttribute("d", jalur(B, lo, hi));
      const la = s.querySelector(".dk-la"), lb = s.querySelector(".dk-lb");
      la.setAttribute("x", x(A.m)); la.setAttribute("y", y(1) - 8); la.textContent = A.label;
      lb.setAttribute("x", x(B.m)); lb.setAttribute("y", y(1) - 8); lb.textContent = B.label;
      s.querySelector(".dk-tik").innerHTML = Array.from({ length: 6 }, (_, i) => { const v = lo + (hi - lo) * i / 5; return '<text class="kecil" x="' + x(v) + '" y="208" text-anchor="middle">' + Math.round(v) + "</text>"; }).join("") +
        '<text class="mini" x="300" y="224" text-anchor="middle">' + esc(b.sumbu || "skor tes") + "</text>";
      const atur = () => {
        const c = +geser.value, z = v => (v) / 1;
        const sens = 1 - cdf((c - B.m) / B.sd), spes = cdf((c - A.m) / A.sd);
        const cut = s.querySelector(".dk-cut"); cut.setAttribute("x1", x(c)); cut.setAttribute("x2", x(c));
        const ct = s.querySelector(".dk-cut-t"); ct.setAttribute("x", x(c)); ct.textContent = "cut-off " + c;
        s.querySelector(".dk-fp").setAttribute("d", jalur(A, c, hi)); s.querySelector(".dk-fn").setAttribute("d", jalur(B, lo, c));
        const lb = b.labelBaca || ["Sensitivitas", "Spesifisitas", "Positif palsu", "Negatif palsu"];
        baca.innerHTML = '<span class="ok"><b>' + esc(lb[0]) + "</b> " + Math.round(sens * 100) + '%</span><span class="ok"><b>' + esc(lb[1]) + "</b> " + Math.round(spes * 100) + '%</span><span class="no"><b>' + esc(lb[2]) + "</b> " + Math.round((1 - spes) * 100) + '%</span><span class="no"><b>' + esc(lb[3]) + "</b> " + Math.round((1 - sens) * 100) + "%</span>" +
          "<small>" + esc(b.catatan || "Menurunkan cut-off menangkap lebih banyak kasus (sensitivitas ↑) tetapi menambah positif palsu (spesifisitas ↓) — selalu ada tarik-ulur.") + "</small>";
      };
      geser.addEventListener("input", atur); atur();
      el.classList.remove("jalan"); void el.offsetWidth; el.classList.add("jalan");
    }
  };

  /* ════════ 10. TINTA — bercak tinta simetris (ilustrasi tes proyektif) ════════ */
  J.tinta = {
    html(b, id) {
      simpan(id, b);
      return '<div class="tn-wadah">' + svg(300, 220, '<g class="tn-bercak"></g><line x1="150" x2="150" y1="10" y2="210" class="tn-lipat"/>') +
        '<div class="tn-sisi"><p class="tn-tanya">' + one(b.tanya || "Apa yang Anda lihat? Bisa jadi apa?") + '</p><button type="button" class="btn ghost sm tn-baru">' + Icon("refresh") + 'Bercak baru</button><small>' + one(b.catatan || "Bercak ini acak (bukan kartu Rorschach asli). Tes proyektif memakai stimulus yang ambigu: jawaban mencerminkan cara seseorang memaknai pengalaman.") + "</small></div></div>";
    },
    init(el) {
      const g = el.querySelector(".tn-bercak");
      const buat = () => {
        let seed = Math.floor(Math.random() * 1e6); const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
        // gumpalan halus (kurva Catmull-Rom tertutup) yang banyak menempel di garis lipatan, + cipratan kecil
        const halus = (pts) => {
          const n = pts.length; let d = "M" + fix(pts[0][0]) + " " + fix(pts[0][1]);
          for (let k = 0; k < n; k++) {
            const p0 = pts[(k - 1 + n) % n], p1 = pts[k], p2 = pts[(k + 1) % n], p3 = pts[(k + 2) % n];
            d += "C" + fix(p1[0] + (p2[0] - p0[0]) / 6) + " " + fix(p1[1] + (p2[1] - p0[1]) / 6) + " " + fix(p2[0] - (p3[0] - p1[0]) / 6) + " " + fix(p2[1] - (p3[1] - p1[1]) / 6) + " " + fix(p2[0]) + " " + fix(p2[1]);
          }
          return d + "Z";
        };
        let isi = "";
        for (let i = 0; i < 7; i++) {
          const nempel = i < 4, R = 14 + rnd() * 26, cx = nempel ? 152 - R * 0.6 : 150 - 25 - rnd() * 80, cy = 28 + rnd() * 160, n = 8;
          const pts = Array.from({ length: n }, (_, k) => { const a = k / n * Math.PI * 2, r = R * (0.55 + rnd() * 0.75); return [cx + Math.cos(a) * r * 1.1, cy + Math.sin(a) * r]; });
          isi += '<path class="tn-b an-in" style="--i:' + i + '" d="' + halus(pts) + '"/>';
        }
        for (let i = 0; i < 6; i++) isi += '<circle class="tn-b an-in" style="--i:' + (7 + i) + '" cx="' + fix(150 - 20 - rnd() * 110) + '" cy="' + fix(20 + rnd() * 180) + '" r="' + fix(1.5 + rnd() * 4) + '"/>';
        g.innerHTML = '<g class="tn-kiri">' + isi + '</g><g transform="translate(300 0) scale(-1 1)" class="tn-kanan">' + isi + "</g>";
        tampilkan(el, 140);
      };
      el.querySelector(".tn-baru").addEventListener("click", () => { if (window.Audio2) Audio2.sfx("pop"); buat(); });
      buat();
    }
  };

  /* ════════ 11. OTAK — lobus menyala; ketuk untuk fungsi & tes yang mengukurnya ════════ */
  J.otak = {
    html(b, id) {
      simpan(id, b);
      const L = b.lobus || J.otak.bawaan;
      const P = {
        frontal: "M150 62 C112 64 78 92 74 132 C72 150 82 160 98 158 L150 150 C156 120 160 90 150 62Z",
        parietal: "M150 62 C196 56 232 76 246 104 L196 128 L150 150 C160 120 160 90 150 62Z",
        temporal: "M98 158 L150 150 L196 128 C206 150 200 176 176 186 C150 196 118 190 104 176 C96 170 94 164 98 158Z",
        oksipital: "M246 104 C262 126 262 152 246 170 C232 182 212 184 196 176 C204 160 206 144 196 128Z",
        serebelum: "M196 176 C212 184 236 182 248 172 C252 192 236 208 214 206 C198 204 190 194 196 176Z",
        hipokampus: "M130 170 C140 160 160 160 168 168 C160 172 146 176 134 176Z"
      };
      return '<div class="ot-wadah">' + svg(320, 230, Object.keys(P).filter(k => L[k]).map((k, i) => '<path class="ot-l ot-' + k + ' an-in" style="--i:' + i + '" data-k="' + k + '" d="' + P[k] + '"/>').join("") +
        '<path class="ot-batang" d="M182 186 C184 200 186 212 190 224"/>') +
        '<div class="ot-info"><b class="ot-nama">Ketuk bagian otak</b><p class="ot-fungsi">' + one(b.petunjuk || "Setiap lobus punya fungsi berbeda — tes neuropsikologis memeriksa apakah fungsi itu masih utuh.") + "</p></div></div>";
    },
    bawaan: {
      frontal: { nama: "Lobus frontal", fungsi: "Fungsi eksekutif: perencanaan, inhibisi, fleksibilitas berpikir, kepribadian, bicara (area Broca).", tes: "Wisconsin Card Sorting Test, Trail Making B, Stroop, kelancaran verbal" },
      parietal: { nama: "Lobus parietal", fungsi: "Integrasi sensorik & spasial, perhatian, orientasi tubuh, berhitung.", tes: "Block Design, menyalin gambar kompleks (Rey), tugas perhatian spasial" },
      temporal: { nama: "Lobus temporal", fungsi: "Pendengaran, memahami bahasa (area Wernicke), memori verbal.", tes: "Daftar kata (CVLT/RAVLT), Logical Memory (WMS)" },
      oksipital: { nama: "Lobus oksipital", fungsi: "Pusat penglihatan: mengenali bentuk, warna, gerak.", tes: "Tes persepsi visual, pengenalan objek" },
      serebelum: { nama: "Serebelum", fungsi: "Koordinasi motorik halus, keseimbangan, kelancaran gerak.", tes: "Finger tapping, Grooved Pegboard" },
      hipokampus: { nama: "Hipokampus", fungsi: "Membentuk memori baru — biasanya terdampak paling awal pada Alzheimer.", tes: "Recall tertunda (delayed recall), MoCA/MMSE bagian memori" }
    },
    init(el, b) {
      const L = b.lobus || J.otak.bawaan, nm = el.querySelector(".ot-nama"), fs = el.querySelector(".ot-fungsi");
      const pilih = k => { el.querySelectorAll(".ot-l").forEach(p => p.classList.toggle("aktif", p.dataset.k === k)); const x = L[k]; nm.textContent = x.nama; fs.innerHTML = one(x.fungsi) + (x.tes ? '<span class="ot-tes">' + Icon("target") + one(x.tes) + "</span>" : ""); };
      el.querySelectorAll(".ot-l").forEach(p => p.addEventListener("click", () => { clearInterval(el._t); pilih(p.dataset.k); if (window.Audio2) Audio2.sfx("pop"); }));
      tampilkan(el, 200);
      if (!gerak()) return;
      const ks = Object.keys(L); let i = 0; clearInterval(el._t);
      el._t = setInterval(() => { if (!document.body.contains(el)) return clearInterval(el._t); pilih(ks[i % ks.length]); i++; }, 2600);
    }
  };

  /* ════════ 12. SPEKTRUM — rentang skor / tingkat keparahan, penanda bergerak ════════ */
  J.spektrum = {
    html(b, id) {
      simpan(id, b);
      const min = b.min || 0, max = b.max || 100, p = v => ((v - min) / (max - min)) * 100;
      return '<div class="sp"><div class="sp-bar">' + b.rentang.map((r, i) => '<div class="sp-seg an-in sp' + (i % 5) + '" style="--i:' + i + ";left:" + fix(p(r.dari)) + "%;width:" + fix(p(Math.min(b.rentang[i + 1] ? b.rentang[i + 1].dari : r.sampai, max)) - p(r.dari)) + '%"><b>' + one(r.label) + "</b><small>" + r.dari + "–" + r.sampai + "</small></div>").join("") +
        '<div class="sp-jarum"></div></div>' + (b.geser !== false ? '<div class="an-kendali"><input type="range" class="an-geser" min="' + min + '" max="' + max + '" step="1" value="' + (b.awal != null ? b.awal : Math.round((min + max) / 3)) + '" aria-label="Skor"><div class="an-baca"></div></div>' : "") + "</div>";
    },
    init(el, b) {
      const min = b.min || 0, max = b.max || 100, j = el.querySelector(".sp-jarum"), g = el.querySelector(".an-geser"), baca = el.querySelector(".an-baca");
      tampilkan(el, 260);
      if (!g) return;
      const atur = () => { const v = +g.value; j.style.left = ((v - min) / (max - min)) * 100 + "%"; const r = b.rentang.find(x => v >= x.dari && v <= x.sampai) || b.rentang[b.rentang.length - 1]; baca.innerHTML = "<span><b>" + esc(b.satuan || "Skor") + "</b> " + v + "</span><span><b>" + one(r.label) + "</b></span>" + (r.ket ? "<small>" + one(r.ket) + "</small>" : ""); };
      g.addEventListener("input", atur); atur();
    }
  };

  return { html, init };
})();

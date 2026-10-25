/* =====================================================================
   MOTIF SAMPUL KHUSUS S1 — dibuat sesuai isi materi (bukan motif tafsir S2)
   Psikologi Adiktif: otak, sinapsis, gelas, rokok, poppy, siklus, …
   Bahasa Inggris  : abc, catatan, kalimat, tanda baca, proses menulis, …
   Setiap motif: (op, {T, D, C}) → isi SVG di kanvas 400×240 (y 215–240 untuk label).
   ===================================================================== */
(function () {
  const A = Art.tambah;
  const lat = (x, y, t, cls, d) => '<text x="' + x + '" y="' + y + '" class="lbl lat ' + (cls || "") + '" style="--d:' + (d || 0) + 's">' + t + "</text>";
  const R = (x, y, w, h, rx, cls, d, extra) => '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (rx || 0) + '" class="' + (cls || "") + '" style="--d:' + (d || 0) + 's" ' + (extra || "") + "/>";

  /* ───────── PSIKOLOGI ADIKTIF ───────── */
  A("otak", (op, { D, C }) =>
    C(200, 105, 70, "glow pulse", 0) +
    D("M200 48 C170 36 132 48 126 78 C104 84 98 112 112 128 C104 146 118 168 142 166 C150 184 178 188 196 174 L200 56", "dr thick", 0) +
    D("M200 48 C230 36 268 48 274 78 C296 84 302 112 288 128 C296 146 282 168 258 166 C250 184 222 188 204 174 L200 56", "dr thick", 0.3) +
    D("M150 92 C164 86 172 100 186 94", "dr", 1) + D("M140 128 C156 118 170 136 186 126", "dr", 1.15) + D("M214 94 C228 100 236 86 250 92", "dr", 1.3) + D("M214 126 C230 136 244 118 260 128", "dr", 1.45) +
    [[156, 76], [244, 80], [132, 140], [270, 144], [200, 112]].map((p, i) => C(p[0], p[1], 5, "fruit pop", 1.6 + i * 0.2)).join("") +
    '<path class="flow" style="--d:0s" pathLength="1" d="M156 76 L200 112 L244 80 M132 140 L200 112 L270 144"/>');

  A("tirai", (op, { D, C }) =>
    D("M60 30 H340", "dr thick", 0) +
    D("M70 30 C90 90 80 150 110 200", "dr", 0.3) + D("M100 30 C112 90 106 150 128 200", "dr", 0.45) +
    D("M330 30 C310 90 320 150 290 200", "dr", 0.3) + D("M300 30 C288 90 294 150 272 200", "dr", 0.45) +
    '<g class="pop" style="--d:1s"><ellipse cx="200" cy="112" rx="46" ry="56" class="node"/></g>' +
    C(184, 102, 6, "fruit pop", 1.4) + C(216, 102, 6, "fruit pop", 1.5) + D("M184 134 C194 126 206 126 216 134", "dr", 1.7) +
    D("M154 112 C130 112 130 150 158 150", "dr root", 1.9) + D("M246 112 C270 112 270 150 242 150", "dr root", 2));

  A("sejarah", (op, { D, C }) => {
    let o = D("M40 120 H360", "dr thick", 0);
    ["7000 SM", "4200 SM", "1822", "1898", "kini"].forEach((t, i) => { const x = 60 + i * 70; o += C(x, 120, 9, "node pop", 0.5 + i * 0.25) + lat(x, i % 2 ? 150 : 100, t, "sm fade", 0.7 + i * 0.25); });
    return o + R(170, 34, 60, 40, 6, "lant pop", 1.8) + D("M180 48 H220 M180 58 H212", "dr", 2.1);
  });

  A("masyarakat", (op, { D, C }) => {
    const P = [[200, 70], [120, 100], [280, 100], [90, 170], [170, 170], [240, 170], [315, 168]];
    let o = "";
    [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6], [4, 5], [0, 4]].forEach(([a, b], i) => o += D("M" + P[a][0] + " " + P[a][1] + " L" + P[b][0] + " " + P[b][1], "dr link", 0.2 + i * 0.1));
    P.forEach((p, i) => { o += C(p[0], p[1] - 8, 8, "node pop", 0.8 + i * 0.12) + D("M" + (p[0] - 12) + " " + (p[1] + 12) + " C" + (p[0] - 10) + " " + (p[1] - 2) + " " + (p[0] + 10) + " " + (p[1] - 2) + " " + (p[0] + 12) + " " + (p[1] + 12), "dr", 1 + i * 0.12); });
    return o;
  });

  A("hilal", (op, { D, C, star8 }) =>
    C(200, 100, 64, "glow pulse", 0) +
    '<path class="crown pop" style="--d:.2s" d="M228 44 A62 62 0 1 0 228 164 A50 50 0 1 1 228 44Z"/>' +
    star8(262, 78, 12, "st8 pop", 'style="--d:1s"') +
    D("M150 182 C170 172 190 172 200 182 C210 172 230 172 250 182 V200 C230 190 210 190 200 200 C190 190 170 190 150 200Z", "dr root", 1.3));

  A("sinapsis", (op, { D, C }) => {
    let o = D("M30 70 C80 60 110 90 150 100", "dr thick", 0) + D("M30 150 C80 160 110 130 150 120", "dr thick", 0.1) +
      '<path class="node pop" style="--d:.5s" d="M150 88 C172 88 178 132 150 132Z"/>' +
      D("M370 70 C320 60 290 90 250 100", "dr thick", 0.2) + D("M370 150 C320 160 290 130 250 120", "dr thick", 0.3) +
      '<path class="node pop" style="--d:.7s" d="M252 86 C232 92 232 128 252 134"/>';
    for (let i = 0; i < 7; i++) o += C(170 + (i % 3) * 22, 96 + (i % 4) * 9, 3.5, "fall-x", (i * 0.35).toFixed(2));
    return o + [[244, 94], [244, 110], [244, 126]].map((p, i) => C(p[0], p[1], 4, "fruit pop", 1.2 + i * 0.2)).join("");
  });

  A("roda", (op, { D, C }) => {
    const gear = (cx, cy, r, cls, d) => { let p = ""; for (let i = 0; i < 10; i++) { const a = (i / 10) * Math.PI * 2; p += "M" + (cx + Math.cos(a) * r).toFixed(1) + " " + (cy + Math.sin(a) * r).toFixed(1) + " L" + (cx + Math.cos(a) * (r + 10)).toFixed(1) + " " + (cy + Math.sin(a) * (r + 10)).toFixed(1) + " "; } return '<g class="' + cls + '" style="--d:' + d + 's">' + C(cx, cy, r, "node", 0) + C(cx, cy, r * 0.35, "", 0) + '<path d="' + p + '"/></g>'; };
    return gear(160, 110, 46, "spin-a pop", 0.2) + gear(252, 86, 30, "spin-b pop", 0.5) + gear(256, 160, 24, "spin-a pop", 0.8);
  });

  A("tangga-nafs", (op, { D, C }) => {
    let o = "";
    for (let i = 0; i < 7; i++) o += R(70 + i * 38, 186 - i * 22, 34, 8, 3, "lant pop", 0.2 + i * 0.18);
    return o + '<path class="crown pop" style="--d:1.6s" d="M330 30 C350 10 378 40 330 70 C282 40 310 10 330 30Z"/>' + C(330, 46, 40, "glow pulse", 0);
  });

  A("siklus", (op, { D, C }) => {
    const P = [[200, 40, "pemicu"], [300, 115, "hasrat"], [200, 190, "memakai"], [100, 115, "menyesal"]];
    let o = D("M220 44 C270 52 296 80 300 98", "dr root", 0.2) + D("M298 134 C290 164 252 186 222 190", "dr root", 0.5) + D("M180 190 C140 184 108 160 100 134", "dr root", 0.8) + D("M102 96 C112 66 150 46 180 42", "dr root", 1.1);
    P.forEach((p, i) => { o += C(p[0], p[1], 14, "node pop", 0.3 + i * 0.3) + lat(p[0], p[1] + (i === 2 ? -22 : 32), p[2], "xs fade", 0.6 + i * 0.3); });
    return o + '<g class="spin-a"><path class="flow" pathLength="1" d="M200 60 A55 55 0 1 1 199 60"/></g>';
  });

  A("gelas", (op, { D, C }) =>
    D("M150 40 H250 C250 100 230 122 200 124 C170 122 150 100 150 40Z", "dr thick", 0) + D("M200 124 V184 M166 190 H234", "dr thick", 0.4) +
    '<path class="drop pop" style="--d:.9s" d="M156 62 H244 C240 100 226 114 200 116 C174 114 160 100 156 62Z" opacity=".55"/>' +
    C(232, 140, 4, "drip", 0.6) + C(210, 140, 3, "drip", 1.6) +
    '<g class="stamp pop" style="--d:1.8s"><circle cx="296" cy="70" r="26" class="no"/></g>' + D("M282 56 L310 84 M310 56 L282 84", "dr mk", 2.1));

  A("botol", (op, { D, C }) =>
    D("M186 26 H214 V60 C238 72 244 90 244 110 V196 C244 204 238 208 230 208 H170 C162 208 156 204 156 196 V110 C156 90 162 72 186 60Z", "dr thick", 0) +
    R(166, 120, 68, 50, 4, "paper pop", 0.8) + D("M176 136 H224 M176 150 H214", "dr ink", 1.2) +
    D("M96 120 C120 90 140 150 156 128 M244 128 C262 150 282 90 304 120", "dr chain", 1.4) + C(96, 120, 9, "node pop", 1.8) + C(304, 120, 9, "node pop", 1.9));

  A("rokok", (op, { D, C }) =>
    R(80, 150, 210, 22, 6, "paper pop", 0) + R(270, 150, 40, 22, 4, "roll pop", 0.2) + '<rect x="72" y="150" width="14" height="22" rx="4" class="ember"/>' +
    [0, 1, 2].map(i => '<path class="rise" style="--d:' + i * 0.9 + 's" d="M80 140 C60 120 100 106 80 84 C64 66 96 54 84 34"/>').join(""));

  A("rokok-patah", (op, { D, C }) =>
    '<g class="pop" style="--d:.1s" transform="rotate(-18 150 140)">' + R(60, 130, 110, 20, 5, "paper") + R(150, 130, 26, 20, 3, "roll") + "</g>" +
    '<g class="pop" style="--d:.4s" transform="rotate(14 270 140)">' + R(210, 136, 120, 20, 5, "paper") + "</g>" +
    D("M184 118 l10 14 l-12 6 l12 10", "dr mk", 0.9) +
    D("M200 40 C176 40 170 70 172 92 M200 40 C224 40 230 70 228 92 M200 40 V96", "dr root", 1.2) + C(200, 70, 34, "glow pulse", 0));

  A("poppy", (op, { D, C }) =>
    D("M200 210 C196 170 206 140 200 112", "dr thick", 0) + D("M200 170 C180 160 166 166 158 176 C176 182 190 178 200 170", "dr root", 0.5) +
    [0, 72, 144, 216, 288].map((a, i) => '<ellipse class="petal pop" style="--d:' + (0.7 + i * 0.15) + 's" cx="200" cy="72" rx="20" ry="34" transform="rotate(' + a + ' 200 96)"/>').join("") +
    C(200, 96, 14, "fruit pop", 1.6) + D("M192 96 H208 M200 88 V104", "dr", 1.9));

  A("kilat", (op, { D, C }) =>
    '<path class="drop pop" style="--d:.2s" d="M214 24 L160 120 H198 L176 206 L248 94 H208 L232 24Z"/>' +
    D("M30 150 H110 L124 120 L138 178 L152 132 L162 150 H230", "dr root", 0.8) + D("M250 150 H370", "dr", 1.6) +
    C(110, 64, 5, "fruit pop", 1.2) + C(290, 60, 4, "fruit pop", 1.4) + C(310, 104, 3, "fruit pop", 1.6));

  A("spiral", (op, { D, C }) => C(200, 112, 70, "glow pulse", 0) +
    D("M200 112 m0 -8 a8 8 0 1 1 -8 8 a16 16 0 1 1 16 16 a26 26 0 1 1 -26 -26 a38 38 0 1 1 38 38 a52 52 0 1 1 -52 -52", "dr root", 0) +
    [[110, 50], [300, 60], [96, 180], [312, 176]].map((p, i) => C(p[0], p[1], 6, "node pop", 1 + i * 0.2)).join(""));

  A("daun", (op, { D, C }) => D("M200 206 V60", "dr thick", 0) +
    [[-60, 60], [-35, 40], [0, 30], [35, 40], [60, 60]].map(([a, y], i) => '<ellipse class="petal pop" style="--d:' + (0.4 + i * 0.15) + 's" cx="200" cy="' + (110 - y * 0.2) + '" rx="11" ry="' + (50 - Math.abs(a) * 0.2) + '" transform="rotate(' + a + ' 200 160)"/>').join(""));

  A("pil", (op, { D, C }) =>
    [[120, 70, -25], [210, 110, 20], [290, 70, -10], [160, 160, 35], [260, 170, -30]].map(([x, y, a], i) => '<g class="pop" style="--d:' + (0.2 + i * 0.2) + 's" transform="rotate(' + a + " " + x + " " + y + ')"><rect x="' + (x - 34) + '" y="' + (y - 14) + '" width="68" height="28" rx="14" class="node"/><path d="M' + x + " " + (y - 14) + " V" + (y + 14) + '" class="mk"/></g>').join(""));

  A("timbangan", (op, { D, C }) => D("M200 40 V196 M150 200 H250", "dr thick", 0) + D("M110 70 H290", "dr thick", 0.4) +
    '<g class="swing-sm">' + D("M120 70 L96 130 H144 Z", "dr root", 0.8) + D("M280 70 L256 130 H304 Z", "dr root", 0.9) + "</g>" + C(200, 40, 8, "fruit pop", 1.2));

  A("dadu", (op, { D, C }) => {
    const dadu = (x, y, a, titik, d) => '<g class="pop" style="--d:' + d + 's" transform="rotate(' + a + " " + (x + 32) + " " + (y + 32) + ')"><rect x="' + x + '" y="' + y + '" width="64" height="64" rx="12" class="paper"/>' + titik.map(([px, py]) => '<circle cx="' + (x + px) + '" cy="' + (y + py) + '" r="6" class="pip"/>').join("") + "</g>";
    return dadu(110, 70, -14, [[16, 16], [32, 32], [48, 48]], 0.2) + dadu(220, 90, 18, [[16, 16], [48, 16], [16, 48], [48, 48], [32, 32]], 0.6) + C(200, 190, 6, "drip", 0.4);
  });

  A("layar", (op, { D, C }) => R(110, 40, 180, 120, 12, "node pop", 0) + D("M180 182 H220 M200 160 V182", "dr thick", 0.4) +
    '<rect x="170" y="80" width="4" height="40" class="ember blink"/>' + [0, 1, 2].map(i => C(220 + i * 18, 100, 5, "fruit pop", 0.8 + i * 0.2)).join(""));

  A("hati-retak", (op, { D, C }) => '<path class="crown pop" style="--d:.1s" d="M200 190 C120 130 110 70 150 56 C176 46 196 66 200 82 C204 66 224 46 250 56 C290 70 280 130 200 190Z"/>' +
    D("M200 82 L190 112 L210 128 L194 160", "dr mk", 0.9) + C(200, 120, 60, "glow pulse", 0));

  A("dua-wajah", (op, { D, C }) => '<g class="pop" style="--d:.1s"><circle cx="160" cy="104" r="48" class="node"/></g><g class="pop" style="--d:.4s"><circle cx="240" cy="104" r="48" class="crown"/></g>' +
    C(146, 96, 5, "fruit pop", 0.8) + D("M140 124 C150 118 166 118 176 124", "dr", 1) + C(256, 96, 5, "fruit pop", 1.1) + D("M226 128 C236 120 250 120 262 128", "dr", 1.3));

  A("tangan", (op, { D, C }) => D("M70 170 C110 150 150 150 190 160 L230 150", "dr thick", 0) + D("M330 170 C290 150 250 150 210 160", "dr thick", 0.3) +
    '<path class="crown pop" style="--d:1s" d="M200 140 C176 116 172 92 188 84 C196 80 200 88 200 94 C200 88 204 80 212 84 C228 92 224 116 200 140Z"/>' + C(200, 110, 50, "glow pulse", 0));

  A("perisai", (op, { D, C }) => '<path class="crown pop" style="--d:.1s" d="M200 30 L276 58 V112 C276 156 244 186 200 204 C156 186 124 156 124 112 V58Z"/>' +
    D("M168 116 L192 140 L236 92", "dr mk", 0.9) + C(200, 116, 70, "glow pulse", 0));

  A("cermin", (op, { D, C }) => '<ellipse class="node pop" style="--d:.1s" cx="200" cy="100" rx="64" ry="80"/>' +
    D("M168 60 C160 80 160 100 166 116", "dr", 0.8) + D("M200 180 V206 M170 208 H230", "dr thick", 0.5) + C(200, 100, 80, "glow pulse", 0));

  /* ───────── BAHASA INGGRIS ───────── */
  A("abc", (op) => ["A", "b", "C", "d", "E"].map((h, i) => '<g class="pop" style="--d:' + (0.2 + i * 0.2) + 's"><rect x="' + (58 + i * 60) + '" y="' + (70 + (i % 2) * 30) + '" width="52" height="52" rx="10" class="tile-l"/>' + lat(84 + i * 60, 106 + (i % 2) * 30, h, "big dark") + "</g>").join(""));

  A("catatan", (op, { D }) => R(110, 30, 180, 176, 10, "paper pop", 0) + R(110, 30, 26, 176, 0, "roll pop", 0.1) +
    [0, 1, 2, 3, 4].map(i => D("M150 " + (66 + i * 28) + " H" + (270 - (i % 3) * 30), "dr ink", 0.5 + i * 0.3)).join("") +
    '<g class="pen-move"><path class="qalam" d="M300 70 L250 150 L244 166 L258 156 L308 76Z"/></g>');

  A("ringkas", (op, { D }) => [0, 1, 2, 3, 4, 5].map(i => D("M70 " + (40 + i * 12) + " H" + (330 - (i % 2) * 40), "dr ink2", 0.1 + i * 0.12)).join("") +
    '<path class="funnel pop" style="--d:.9s" d="M110 120 H290 L220 170 V196 H180 V170Z"/>' + D("M170 214 H230", "dr root", 1.6));

  A("kalimat", (op) => [["Subject", "S"], ["Verb", "V"], ["Object", "O"]].map(([w, s], i) => '<g class="pop" style="--d:' + (0.2 + i * 0.35) + 's"><rect x="' + (52 + i * 104) + '" y="80" width="92" height="56" rx="12" class="tile-l"/>' + lat(98 + i * 104, 106, s, "big dark") + lat(98 + i * 104, 126, w, "xs dark") + "</g>").join("") +
    '<path class="flow" pathLength="1" d="M146 108 H154 M250 108 H258"/>');

  A("tanda-baca", (op) => [[".", 80, 70], [",", 150, 110], ["?", 220, 64], ["!", 290, 112], [";", 120, 160], ["“ ”", 250, 170]].map(([t, x, y], i) => '<g class="bob" style="--d:' + (i * 0.3) + 's">' + lat(x, y, t, "huge gold pop", (0.2 + i * 0.2).toFixed(1)) + "</g>").join(""));

  A("proses-tulis", (op, { C, D }) => {
    const L = ["Plan", "Draft", "Revise", "Edit", "Publish"];
    let o = D("M50 120 C110 60 150 180 200 120 C250 60 290 180 350 120", "dr root", 0);
    L.forEach((t, i) => { const x = 50 + i * 75, y = 120; o += C(x, y, 13, "node pop", 0.6 + i * 0.25) + lat(x, i % 2 ? 160 : 92, t, "sm fade", 0.8 + i * 0.25); });
    return o;
  });

  A("buku-baca", (op, { D, C }) => '<path class="book pop" style="--d:.1s" d="M200 66 C170 54 130 52 96 60 V176 C130 168 170 170 200 182Z"/><path class="book pop" style="--d:.2s" d="M200 66 C230 54 270 52 304 60 V176 C270 168 230 170 200 182Z"/>' +
    [0, 1, 2].map(i => D("M116 " + (88 + i * 22) + " C140 " + (84 + i * 22) + " 166 " + (86 + i * 22) + " 186 " + (92 + i * 22), "dr book-l", 0.6 + i * 0.2)).join("") +
    '<g class="swing-sm">' + C(262, 112, 26, "node pop", 1.2) + D("M282 132 L314 164", "dr thick", 1.4) + "</g>");

  A("percakapan", (op, { D }) => '<path class="node pop" style="--d:.1s" d="M70 50 H220 C232 50 240 58 240 70 V120 C240 132 232 140 220 140 H120 L92 166 V140 H70 C58 140 50 132 50 120 V70 C50 58 58 50 70 50Z"/>' +
    '<path class="crown pop" style="--d:.6s" d="M200 104 H330 C342 104 350 112 350 124 V168 C350 180 342 188 330 188 H310 V212 L284 188 H200 C188 188 180 180 180 168 V124 C180 112 188 104 200 104Z"/>' +
    lat(145, 102, "Hello!", "fade", 0.9) + lat(265, 152, "Hi, how are you?", "sm fade", 1.3));

  A("lampu", (op, { D, C }) => C(200, 96, 70, "glow pulse", 0) + '<path class="crown pop" style="--d:.1s" d="M200 40 C166 40 146 66 146 92 C146 118 166 128 172 150 H228 C234 128 254 118 254 92 C254 66 234 40 200 40Z"/>' +
    D("M176 164 H224 M182 178 H218", "dr thick", 0.6) + [0, 1, 2, 3, 4].map(i => { const a = -Math.PI / 2 + (i - 2) * 0.55; return '<path class="ray" style="--d:' + (i * 0.3) + 's" d="M' + (200 + Math.cos(a) * 82).toFixed(0) + " " + (96 + Math.sin(a) * 82).toFixed(0) + " L" + (200 + Math.cos(a) * 104).toFixed(0) + " " + (96 + Math.sin(a) * 104).toFixed(0) + '"/>'; }).join(""));

  A("paragraf", (op, { D }) => R(90, 34, 220, 172, 10, "paper pop", 0) + R(108, 52, 184, 16, 4, "hl pop", 0.4) +
    [0, 1, 2, 3, 4].map(i => D("M110 " + (92 + i * 20) + " H" + (288 - (i === 4 ? 70 : 0)), "dr ink", 0.6 + i * 0.2)).join(""));

  A("kamus", (op) => R(120, 34, 160, 176, 10, "roll pop", 0) + R(132, 44, 140, 156, 6, "paper pop", 0.2) +
    lat(202, 96, "word", "big dark fade", 0.6) + lat(202, 124, "/wɜːd/ · n.", "xs dark fade", 0.9) + lat(202, 152, "kata", "sm dark fade", 1.2));

  A("jam", (op, { D, C }) => C(200, 110, 78, "node pop", 0) + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => { const a = i / 12 * Math.PI * 2; return '<path class="fade" style="--d:' + (0.3 + i * 0.05) + 's" d="M' + (200 + Math.cos(a) * 64).toFixed(0) + " " + (110 + Math.sin(a) * 64).toFixed(0) + " L" + (200 + Math.cos(a) * 72).toFixed(0) + " " + (110 + Math.sin(a) * 72).toFixed(0) + '"/>'; }).join("") +
    '<g class="spin-a"><path d="M200 110 L200 52" class="mk"/></g><path d="M200 110 L240 110" class="root"/>' + C(200, 110, 5, "fruit pop", 0.8));

  A("target", (op, { D, C }) => C(200, 110, 80, "node pop", 0) + C(200, 110, 54, "node pop", 0.2) + C(200, 110, 28, "crown pop", 0.4) + C(200, 110, 8, "fruit pop", 0.6) +
    '<g class="pop" style="--d:1.2s"><path class="mk" d="M330 30 L208 104"/><path class="root" d="M330 30 l-16 -4 M330 30 l-4 16"/></g>');

  A("puzzle", (op) => [[120, 70, 0], [200, 70, 0.3], [120, 140, 0.6], [200, 140, 0.9]].map(([x, y, d], i) => '<g class="pop" style="--d:' + d + 's"><rect x="' + x + '" y="' + y + '" width="76" height="66" rx="8" class="' + (i === 3 ? "crown" : "tile-l") + '"/>' + lat(x + 38, y + 40, ["noun", "verb", "adj", "adv"][i], "sm dark") + "</g>").join(""));
  /* ───────── BAHASA INGGRIS · MODUL 16–30 (UAS) ───────── */
  // M16 transisi: jembatan kata penghubung antara dua "pulau" kalimat
  A("jembatan", (op, { D, C }) => R(30, 120, 96, 70, 10, "paper pop", 0) + R(274, 120, 96, 70, 10, "paper pop", 0.15) +
    D("M126 150 C170 90 230 90 274 150", "dr thick", 0.4) + D("M126 150 H274", "dr root", 0.6) +
    [150, 175, 200, 225, 250].map((x, i) => D("M" + x + " " + (150 - Math.round(Math.sin((x - 126) / 148 * Math.PI) * 44)) + " V150", "dr", 0.8 + i * 0.1)).join("") +
    [["however", 200, 70], ["therefore", 120, 104], ["moreover", 282, 104]].map(([t, x, y], i) => '<g class="bob" style="--d:' + (i * 0.4) + 's">' + lat(x, y, t, "sm gold fade", (1.2 + i * 0.25).toFixed(2)) + "</g>").join(""));

  // M17 editing: kertas dengan tanda koreksi (lingkaran, sisipan, kapital)
  A("koreksi", (op, { D, C }) => R(100, 30, 200, 180, 10, "paper pop", 0) +
    [0, 1, 2, 3, 4].map(i => D("M124 " + (64 + i * 30) + " H" + (276 - (i % 2) * 40), "dr ink", 0.3 + i * 0.2)).join("") +
    '<ellipse cx="236" cy="64" rx="26" ry="12" class="mk pop" style="--d:1.4s"/>' + D("M150 104 l8 -14 l8 14", "dr thick", 1.7) +
    D("M126 138 H146 M126 142 H146 M126 146 H146", "dr root", 2) + lat(272, 156, "?", "big gold pop", 2.2));

  // M18 apostrof, titik dua, koma
  A("apostrof", (op) => [["'s", 110, 96], [":", 200, 80], [",", 290, 96], ["it's", 150, 166], ["s'", 250, 166]].map(([t, x, y], i) => '<g class="bob" style="--d:' + (i * 0.35) + 's">' + lat(x, y, t, (i < 3 ? "huge" : "big") + " gold pop", (0.2 + i * 0.22).toFixed(2)) + "</g>").join(""));

  // M19 tanda hubung, kutip, titik koma, kurung
  A("kurung", (op, { D }) => lat(108, 140, "(", "huge gold pop", 0.1) + lat(292, 140, ")", "huge gold pop", 0.25) +
    lat(200, 92, "“ ”", "huge pop", 0.5) + lat(170, 150, ";", "big gold pop", 0.8) + D("M210 140 H246", "dr thick", 1) + lat(200, 186, "well-known", "sm fade", 1.3));

  // M20 kesesuaian subjek–kata kerja: timbangan S ⇄ V yang seimbang
  A("sva", (op, { D, C }) => D("M200 52 V190 M156 194 H244", "dr thick", 0) + D("M100 70 H300", "dr thick", 0.3) +
    '<g class="swing-sm">' + D("M112 70 L88 124 H136 Z", "dr root", 0.6) + D("M288 70 L264 124 H312 Z", "dr root", 0.7) +
    lat(112, 116, "She", "sm dark pop", 1) + lat(288, 116, "walks", "sm dark pop", 1.1) + "</g>" + C(200, 52, 8, "fruit pop", 1.3) + lat(200, 210, "S + V ✓", "sm gold fade", 1.5));

  // M21 koordinasi & subordinasi: rantai FANBOYS
  A("rantai", (op) => "FANBOYS".split("").map((h, i) => { const x = 62 + i * 46, y = i % 2 ? 128 : 100;
    return '<g class="pop" style="--d:' + (0.15 + i * 0.15).toFixed(2) + 's"><rect x="' + (x - 24) + '" y="' + (y - 22) + '" width="48" height="44" rx="22" class="' + (i === 3 ? "crown" : "tile-l") + '"/>' + lat(x, y + 8, h, "big dark") + "</g>"; }).join("") +
    lat(200, 186, "for · and · nor · but · or · yet · so", "xs gold fade", 1.3));

  // M22 struktur paralel: tiga rel sejajar dengan bentuk kata yang sama
  A("paralel", (op, { D, C }) => [0, 1, 2].map(i => { const y = 68 + i * 44;
    return D("M70 " + y + " H330", "dr root", i * 0.2) + C(70, y, 7, "fruit pop", 0.3 + i * 0.2) + lat(200, y - 8, ["swimming", "biking", "rowing"][i], "sm dark fade", 0.6 + i * 0.25); }).join("") +
    lat(200, 206, "= = =", "big gold pop", 1.4));

  // M23 pendahuluan: corong umum → tesis
  A("corong", (op, { D }) => '<path class="funnel pop" style="--d:.1s" d="M80 40 H320 L220 150 V196 H180 V150Z"/>' +
    lat(200, 64, "hook", "sm dark fade", 0.5) + lat(200, 96, "background", "xs dark fade", 0.75) + lat(200, 124, "roadmap", "xs dark fade", 1) +
    '<g class="drip" style="--d:1.3s">' + lat(200, 216, "THESIS", "sm gold") + "</g>");

  // M24 kesimpulan: corong terbalik tesis → kebenaran umum + bintang penendang
  A("corong-balik", (op, { D, star8 }) => '<path class="funnel pop" style="--d:.1s" d="M180 40 H220 V86 L320 196 H80 L180 86Z"/>' +
    lat(200, 66, "thesis", "xs dark fade", 0.5) + lat(200, 132, "so what?", "sm dark fade", 0.8) + lat(200, 176, "clincher", "sm dark fade", 1.1) +
    star8(316, 54, 14, "st8 pop", 'style="--d:1.4s"'));

  // M26 laporan: dokumen dengan judul, grafik batang, dan sitasi
  A("laporan", (op, { D }) => R(100, 26, 200, 188, 10, "paper pop", 0) + R(120, 44, 160, 18, 4, "hl pop", 0.3) +
    [[136, 40], [168, 64], [200, 50], [232, 82]].map(([x, h], i) => '<rect x="' + x + '" y="' + (170 - h) + '" width="22" height="' + h + '" rx="3" class="' + (i === 3 ? "crown" : "tile-l") + ' rise" style="--d:' + (0.6 + i * 0.2).toFixed(1) + 's"/>').join("") +
    D("M126 172 H276", "dr root", 0.5) + lat(200, 196, "(Brown, 2009, p. 17)", "xs dark fade", 1.5));

  // M27 contoh tulisan & petunjuk tugas: kaca pembesar di atas kata kerja perintah
  A("kaca-pembesar", (op, { D, C }) => R(70, 40, 190, 160, 10, "paper pop", 0) +
    [0, 1, 2, 3].map(i => D("M92 " + (76 + i * 30) + " H" + (238 - (i % 2) * 36), "dr ink", 0.3 + i * 0.2)).join("") +
    '<g class="bob" style="--d:.6s">' + C(262, 104, 42, "node pop", 0.8) + D("M292 134 L330 172", "dr thick", 1) + lat(262, 112, "analyze", "sm gold fade", 1.2) + "</g>");

  // M28 keterampilan belajar: meja, lampu, buku, kartu indeks
  A("meja-belajar", (op, { D, C }) => D("M60 170 H340 M90 170 V206 M310 170 V206", "dr thick", 0) +
    '<path class="book pop" style="--d:.3s" d="M120 168 V136 H186 V168Z"/><path class="book pop" style="--d:.4s" d="M190 168 V128 H226 V168Z"/>' +
    D("M280 168 V98 L252 74", "dr root", 0.5) + '<path class="crown pop" style="--d:.8s" d="M236 60 L272 52 L262 84Z"/>' + C(256, 96, 22, "glow pulse", 1) +
    [[96, 52, -6], [140, 44, 4], [184, 54, -3]].map(([x, y, a], i) => '<g class="pop" style="--d:' + (1.2 + i * 0.2).toFixed(1) + 's" transform="rotate(' + a + " " + (x + 18) + " " + (y + 12) + ')"><rect x="' + x + '" y="' + y + '" width="36" height="24" rx="3" class="paper"/></g>').join(""));

  // M29 stres, gizi, olahraga & shalat: sajadah dengan mihrab + hati tenang
  A("sajadah", (op, { D, C, star8 }) => R(120, 30, 160, 186, 12, "roll pop", 0) + R(134, 44, 132, 158, 8, "paper pop", 0.15) +
    D("M150 120 V72 C150 56 166 48 200 40 C234 48 250 56 250 72 V120", "dr thick", 0.5) + D("M150 188 H250", "dr root", 0.8) +
    star8(200, 86, 12, "st8 pop", 'style="--d:1.1s"') + C(200, 150, 14, "glow pulse", 1.3) + lat(200, 156, "♡", "sm gold fade", 1.4));

  // M30 ujian & portofolio: toga kelulusan + lembar jawaban dicentang
  A("toga", (op, { D, C }) => '<path class="crown pop" style="--d:.1s" d="M200 40 L320 84 L200 128 L80 84Z"/>' + D("M140 106 V146 C170 166 230 166 260 146 V106", "dr thick", 0.4) +
    D("M300 92 V140", "dr root", 0.7) + C(300, 146, 7, "fruit pop", 0.9) +
    ["A", "B", "C", "D"].map((h, i) => '<g class="pop" style="--d:' + (1.1 + i * 0.15).toFixed(2) + 's">' + C(140 + i * 40, 196, 13, i === 2 ? "fruit" : "node") + lat(140 + i * 40, 201, h, "xs dark") + "</g>").join(""));


  /* ───────── PMAD 301 · MODEL & PENDEKATAN DISABILITAS ───────── */
  // M1 definisi & jenis: payung yang menaungi ragam disabilitas
  A("payung", (op, { D, C }) => D("M80 110 C100 50 300 50 320 110 C300 96 280 96 266 110 C252 96 228 96 214 110 C200 96 176 96 160 110 C146 96 122 96 108 110 C98 100 88 102 80 110Z", "dr thick", 0) +
    D("M200 60 V176 C200 192 176 192 176 178", "dr root", 0.6) +
    [[110, 150], [150, 162], [250, 162], [290, 150], [130, 196], [270, 196]].map(([x, y], i) => C(x, y, 9, i % 2 ? "fruit pop" : "node pop", 1 + i * 0.15)).join("") + lat(200, 40, "WHO", "sm gold fade", 1.8));

  // M2 disabilitas fisik: kursi roda
  A("kursi-roda", (op, { D, C }) => C(186, 150, 46, "node pop", 0) + C(186, 150, 8, "fruit pop", 0.3) + C(272, 186, 12, "node pop", 0.4) +
    D("M150 60 V120 H250 L272 174", "dr thick", 0.5) + D("M150 120 C150 90 160 70 150 60", "dr root", 0.9) + D("M186 104 L186 196 M140 150 H232", "dr", 1.1) +
    C(196, 44, 14, "glow pulse", 1.3) + D("M196 58 L200 100 L240 104", "dr root", 1.5));

  // M3 disabilitas psikiatris: kepala dengan awan pikiran
  A("awan-pikiran", (op, { D, C }) => D("M150 200 V160 C110 150 104 90 130 70 C150 44 214 40 236 80 C246 98 242 120 230 132 V200", "dr thick", 0) +
    D("M240 60 C232 36 262 26 276 40 C290 22 324 32 318 56 C340 62 334 92 312 92 C306 110 278 108 272 96 C254 104 236 88 240 60Z", "dr", 0.5) +
    C(232, 108, 6, "node pop", 0.9) + C(246, 100, 4, "node pop", 1.0) + lat(286, 74, "~", "big gold fade", 1.3) + C(178, 96, 18, "glow pulse", 1.5));

  // M4 disabilitas intelektual & belajar: kepingan otak
  A("keping-otak", (op, { D, C }) => [[120, 50], [200, 50], [120, 120], [200, 120]].map(([x, y], i) =>
    R(x, y, 76, 66, 10, (i === 3 ? "hl" : "tile-l") + " pop", i * 0.25)).join("") +
    D("M196 70 C206 74 206 90 196 94 M158 116 C162 106 178 106 182 116 M238 116 C242 126 258 126 262 116", "dr", 1.1) +
    lat(158, 92, "A", "big dark fade", 1.4) + lat(238, 92, "1", "big dark fade", 1.5) + lat(158, 162, "♫", "big dark fade", 1.6) + lat(238, 162, "★", "big dark fade", 1.7));

  // M5 Al-Qur'an & Sunnah: mushaf terbuka bercahaya
  A("mushaf-terbuka", (op, { D, C, star8 }) => C(200, 92, 52, "glow pulse", 0) + D("M200 170 C170 150 120 150 80 164 V80 C120 66 170 66 200 86Z", "dr thick", 0.3) +
    D("M200 170 C230 150 280 150 320 164 V80 C280 66 230 66 200 86Z", "dr thick", 0.5) + D("M200 86 V170", "dr root", 0.8) +
    star8(200, 52, 14, "st8 pop", 'style="--d:1.1s"') + D("M100 104 H180 M100 122 H180 M220 104 H300 M220 122 H300", "dr", 1.3));

  // M6 keluarga, komunitas, ibadah: masjid ramah dengan ramp
  A("masjid-ramah", (op, { D, C }) => D("M140 120 C140 70 260 70 260 120", "dr thick", 0) + R(130, 120, 140, 70, 4, "paper pop", 0.3) +
    D("M200 64 V44 M194 50 C200 40 206 46 200 50", "dr root", 0.6) + D("M300 190 V80 M292 80 H308", "dr", 0.8) + R(184, 140, 32, 50, 16, "hl pop", 1) +
    D("M60 190 L130 160", "dr thick", 1.2) + C(84, 168, 10, "fruit pop", 1.5) + C(84, 152, 6, "node pop", 1.6));

  // M7 tokoh Islam: lentera di atas garis waktu
  A("lentera-tokoh", (op, { D, C }) => D("M40 170 H360", "dr thick", 0) + [70, 140, 210, 280, 340].map((x, i) => C(x, 170, 8, "node pop", 0.3 + i * 0.2)).join("") +
    D("M200 30 V44 M184 44 H216 L222 60 V112 L216 124 H184 L178 112 V60Z", "dr thick", 0.6) + C(200, 86, 14, "glow pulse", 1.2) + C(200, 86, 6, "fruit pop", 1.3) +
    D("M200 124 V150", "dr root", 1.5));

  // M8 pengantar model: lensa di atas tiga model
  A("lensa-model", (op, { D, C }) => ["M", "S", "B"].map((h, i) => R(70 + i * 90, 120, 70, 60, 8, "tile-l pop", i * 0.2) + lat(105 + i * 90, 158, h, "big dark", 0.3 + i * 0.2)).join("") +
    C(200, 80, 42, "node pop", 0.9) + C(200, 80, 30, "glow pulse", 1.1) + D("M230 110 L270 150", "dr thick", 1.3));

  // M9 model medis: stetoskop + panah linier ke "normal"
  A("stetoskop", (op, { D, C }) => D("M120 40 V90 C120 130 200 130 200 90 V40", "dr thick", 0) + C(120, 36, 6, "node pop", 0.2) + C(200, 36, 6, "node pop", 0.3) +
    D("M160 124 V160 C160 190 250 190 260 150", "dr root", 0.6) + C(270, 140, 18, "fruit pop", 1) + C(270, 140, 8, "glow pulse", 1.2) +
    D("M60 206 H340", "dr", 1.4) + D("M330 200 L342 206 L330 212", "dr", 1.6));

  // M10 kritik model medis: neraca kekuatan vs kelemahan
  A("neraca", (op, { D, C }) => D("M200 40 V190 M150 190 H250", "dr thick", 0) + D("M90 70 H310", "dr thick", 0.3) + C(200, 40, 8, "fruit pop", 0.5) +
    D("M90 70 L60 130 H120 Z", "dr", 0.7) + D("M310 70 L280 140 H340 Z", "dr", 0.8) + lat(90, 124, "+", "big gold fade", 1.1) + lat(310, 134, "−", "big fade", 1.2));

  // M11 model sosial: tangga vs ramp
  A("tangga-ramp", (op, { D, C }) => D("M40 190 H100 V160 H130 V130 H160 V100 H190", "dr thick", 0) + D("M210 100 L360 190", "dr thick", 0.6) +
    D("M40 196 H360", "dr root", 0.3) + C(300, 140, 16, "node pop", 1.1) + C(300, 140, 6, "fruit pop", 1.2) + C(282, 118, 8, "glow pulse", 1.3) + lat(110, 80, "✗", "big fade", 1.5) + lat(300, 90, "✓", "big gold fade", 1.6));

  // M12 kritik model sosial: rantai yang putus
  A("rantai-putus", (op, { D, C }) => [[70, 100], [130, 120]].map(([x, y], i) => '<ellipse cx="' + x + '" cy="' + y + '" rx="34" ry="20" class="node pop" style="--d:' + (i * 0.2) + 's"/>').join("") +
    [[270, 120], [330, 100]].map(([x, y], i) => '<ellipse cx="' + x + '" cy="' + y + '" rx="34" ry="20" class="node pop" style="--d:' + (0.5 + i * 0.2) + 's"/>').join("") +
    D("M168 112 C178 98 186 110 192 96 M208 132 C214 118 222 130 232 116", "dr thick", 1) + C(200, 116, 22, "glow pulse", 1.3));

  // M13 konstruksionis sosial: kacamata budaya
  A("kacamata-budaya", (op, { D, C, star8 }) => C(140, 110, 46, "node pop", 0) + C(260, 110, 46, "node pop", 0.2) + D("M186 106 C196 96 204 96 214 106 M94 104 L60 90 M306 104 L340 90", "dr thick", 0.4) +
    star8(140, 110, 18, "st8 pop", 'style="--d:.9s"') + lat(260, 122, "?", "huge gold fade", 1.1) + D("M60 180 C140 160 260 200 340 180", "dr root", 1.3));

  // M14 teori kritis: prisma memecah cahaya
  A("prisma-kritis", (op, { D, C }) => D("M40 116 H150", "dr thick", 0) + '<path class="crown pop" style="--d:.3s" d="M200 40 L270 170 H130Z"/>' +
    D("M236 100 L360 60", "dr", 0.9) + D("M240 112 L360 112", "dr root", 1.05) + D("M236 124 L360 166", "dr thick", 1.2) + C(150, 116, 8, "glow pulse", 1.4));

  // M15 normalisasi: jam ritme hidup
  A("jam-ritme", (op, { D, C }) => C(200, 110, 78, "node pop", 0) + C(200, 110, 60, "glow pulse", 0.2) +
    Array.from({ length: 12 }, (_, i) => { const a = i * Math.PI / 6, x1 = 200 + Math.cos(a) * 66, y1 = 110 + Math.sin(a) * 66, x2 = 200 + Math.cos(a) * 74, y2 = 110 + Math.sin(a) * 74; return D("M" + x1.toFixed(1) + " " + y1.toFixed(1) + " L" + x2.toFixed(1) + " " + y2.toFixed(1), "dr", 0.3 + i * 0.05); }).join("") +
    '<g class="spin-a" style="transform-origin:200px 110px">' + D("M200 110 L200 58", "dr thick", 0.9) + "</g>" + D("M200 110 L238 128", "dr root", 1.1) + C(200, 110, 6, "fruit pop", 1.3));

  // M16 kapabilitas: keranjang komoditas & panah pilihan
  A("keranjang", (op, { D, C }) => D("M100 110 H300 L276 196 H124Z", "dr thick", 0) + D("M130 110 C130 50 270 50 270 110", "dr root", 0.4) +
    [[150, 100], [186, 92], [222, 98], [256, 94]].map(([x, y], i) => C(x, y, 14, (i === 2 ? "fruit" : "node") + " pop", 0.7 + i * 0.15)).join("") +
    D("M300 150 H360 M348 140 L360 150 L348 160", "dr", 1.4) + D("M140 140 H260 M140 166 H260", "dr", 1.2));

  // M17 berbasis kekuatan: tunas tumbuh dari retakan batu
  A("tunas-kuat", (op, { D, C }) => R(60, 160, 280, 40, 8, "paper pop", 0) + D("M200 160 L188 176 L206 186 L196 200", "dr", 0.3) +
    D("M200 160 C200 120 196 96 200 60", "dr thick", 0.6) + D("M200 110 C170 100 156 80 160 64 C182 70 196 88 200 110Z", "dr", 0.9) +
    D("M200 92 C228 84 244 62 238 46 C216 52 202 70 200 92Z", "dr", 1.05) + C(200, 56, 10, "fruit pop", 1.3) + C(200, 100, 46, "glow pulse", 1.5));

  // M18 keterbatasan fungsional: papan klip daftar periksa
  A("papan-klip", (op, { D, C }) => R(120, 34, 160, 176, 12, "paper pop", 0) + R(170, 24, 60, 22, 6, "hl pop", 0.2) +
    [0, 1, 2, 3].map(i => R(140, 66 + i * 34, 20, 20, 4, "tile-l pop", 0.4 + i * 0.15) + D("M172 " + (76 + i * 34) + " H260", "dr", 0.5 + i * 0.15)).join("") +
    D("M144 76 L150 82 L158 70 M144 110 L150 116 L158 104", "dr thick", 1.3) + lat(150, 186, "✗", "sm fade", 1.6));

  // M19 model Nagi: rantai empat tahap, dua arah
  A("rantai-nagi", (op, { D, C }) => [60, 147, 233, 320].map((x, i) => C(x, 96, 26, (i === 3 ? "fruit" : "node") + " pop", i * 0.25) + lat(x, 102, String(i + 1), "big dark", 0.2 + i * 0.25)).join("") +
    [86, 173, 259].map((x, i) => D("M" + x + " 96 H" + (x + 34), "dr thick", 1 + i * 0.15)).join("") +
    D("M60 160 H320 M308 150 L320 160 L308 170 M72 150 L60 160 L72 170", "dr root", 1.6));

  // M20 biopsikososial: tiga lingkaran beririsan
  A("venn-bps", (op, { D, C }) => C(166, 90, 52, "node pop", 0) + C(234, 90, 52, "node pop", 0.2) + C(200, 146, 52, "node pop", 0.4) +
    C(200, 110, 16, "glow pulse", 0.8) + lat(146, 84, "Bio", "sm dark fade", 1) + lat(254, 84, "Psi", "sm dark fade", 1.1) + lat(200, 178, "Sos", "sm dark fade", 1.2) + C(200, 110, 6, "fruit pop", 1.4));

  // M21 ringkasan model: pohon dua cabang besar
  A("pohon-model", (op, { D, C }) => D("M200 200 V120", "dr thick", 0) + D("M200 150 C170 130 130 120 100 90 M200 140 C230 120 270 112 300 86", "dr thick", 0.4) +
    D("M200 120 V70", "dr root", 0.7) + C(100, 80, 30, "node pop", 1) + C(300, 76, 30, "node pop", 1.1) + C(200, 56, 24, "fruit pop", 1.2) +
    lat(100, 86, "M", "big dark", 1.3) + lat(300, 82, "S", "big dark", 1.4) + lat(200, 62, "B", "sm dark", 1.5));

  // M22 tim multidisipliner: lingkar tim mengelilingi klien
  A("lingkar-tim", (op, { D, C }) => C(200, 110, 70, "glow pulse", 0) + C(200, 110, 24, "fruit pop", 0.3) +
    Array.from({ length: 6 }, (_, i) => { const a = -Math.PI / 2 + i * Math.PI / 3, x = 200 + Math.cos(a) * 80, y = 110 + Math.sin(a) * 80; return D("M200 110 L" + x.toFixed(1) + " " + y.toFixed(1), "dr", 0.5 + i * 0.1) + C(x.toFixed(1), y.toFixed(1), 14, "node pop", 0.8 + i * 0.12); }).join(""));

  // M23 peran psikolog: kompas penunjuk arah
  A("kompas", (op, { D, C }) => C(200, 112, 80, "node pop", 0) + C(200, 112, 64, "glow pulse", 0.2) + D("M200 40 V56 M200 168 V184 M128 112 H144 M256 112 H272", "dr", 0.4) +
    '<g class="swing-sm" style="transform-origin:200px 112px"><path class="crown pop" style="--d:.8s" d="M200 52 L214 112 L200 172 L186 112Z"/></g>' + C(200, 112, 7, "fruit pop", 1.1) + lat(200, 34, "U", "sm gold fade", 1.3));

  // M24 representasi budaya: jembatan antarbudaya
  A("jembatan-budaya", (op, { D, C }) => R(40, 100, 50, 100, 6, "tile-l pop", 0) + R(310, 100, 50, 100, 6, "hl pop", 0.2) +
    D("M90 120 C150 40 250 40 310 120", "dr thick", 0.5) + D("M90 120 H310", "dr root", 0.8) + [130, 165, 200, 235, 270].map((x, i) => D("M" + x + " 120 V" + (x === 200 ? 64 : x === 165 || x === 235 ? 72 : 90), "dr", 1 + i * 0.1)).join("") +
    C(200, 150, 12, "fruit pop", 1.6));

  // M25 penyesuaian: tangga empat tahap menuju penerimaan
  A("tangga-penyesuaian", (op, { D, C }) => [0, 1, 2, 3].map(i => R(60 + i * 72, 170 - i * 34, 72, 30 + i * 34, 4, (i === 3 ? "hl" : "tile-l") + " pop", i * 0.25)).join("") +
    C(312, 50, 14, "fruit pop", 1.2) + C(312, 50, 30, "glow pulse", 1.4) + D("M80 150 C160 120 240 80 300 56", "dr root", 1.6));

  // M26 pengalaman: cermin — cara dilihat vs cara melihat diri
  A("cermin-dua", (op, { D, C }) => '<ellipse cx="250" cy="104" rx="64" ry="84" class="paper pop" style="--d:0s"/>' + '<ellipse cx="250" cy="104" rx="52" ry="72" class="glow pulse" style="--d:.2s"/>' +
    C(120, 90, 26, "node pop", 0.4) + D("M86 190 C86 140 154 140 154 190", "dr thick", 0.6) + C(250, 90, 20, "fruit pop", 0.9) + D("M222 160 C222 124 278 124 278 160", "dr", 1.1) +
    D("M156 90 H214", "dr root", 1.3));

  // M27 asesmen: kaca pembesar di atas grafik batang
  A("lup-asesmen", (op, { D, C }) => D("M60 196 H300 M60 196 V60", "dr thick", 0) + [40, 70, 100, 60].map((h, i) => R(84 + i * 52, 196 - h, 32, h, 4, (i === 2 ? "hl" : "tile-l") + " pop", 0.3 + i * 0.15)).join("") +
    C(262, 86, 40, "node pop", 1) + C(262, 86, 28, "glow pulse", 1.2) + D("M290 114 L340 164", "dr thick", 1.3));

  // M28 rehabilitasi: kasur dukungan lingkungan
  A("kasur-dukungan", (op, { D, C }) => D("M40 130 C120 130 160 180 200 180 C240 180 280 130 360 130", "dr thick", 0) + D("M40 150 C120 150 160 196 200 196 C240 196 280 150 360 150", "dr root", 0.3) +
    D("M40 170 C120 170 160 210 200 210 C240 210 280 170 360 170", "dr", 0.5) + C(200, 150, 22, "fruit pop", 0.9) + C(200, 112, 12, "node pop", 1.1) +
    D("M200 90 V60 M188 72 L200 60 L212 72", "dr", 1.4));

  // M29 masa depan: fajar model afirmasi
  A("fajar-afirmasi", (op, { D, C }) => D("M40 170 H360", "dr thick", 0) + D("M120 170 C120 80 280 80 280 170", "dr thick", 0.3) +
    Array.from({ length: 7 }, (_, i) => { const a = Math.PI + i * Math.PI / 6, x1 = 200 + Math.cos(a) * 100, y1 = 170 + Math.sin(a) * 100, x2 = 200 + Math.cos(a) * 130, y2 = 170 + Math.sin(a) * 130; return D("M" + x1.toFixed(1) + " " + y1.toFixed(1) + " L" + x2.toFixed(1) + " " + y2.toFixed(1), "dr root", 0.6 + i * 0.1); }).join("") +
    C(200, 170, 40, "glow pulse", 1.2) + lat(200, 160, "♡", "big gold fade", 1.5));

  // M30 penutup: buku khatam + toga
  A("toga-khatam", (op, { D, C, star8 }) => R(110, 130, 180, 40, 6, "book pop", 0) + R(122, 170, 156, 30, 6, "paper pop", 0.2) +
    '<path class="crown pop" style="--d:.5s" d="M200 40 L300 76 L200 112 L100 76Z"/>' + D("M140 92 V118 C170 132 230 132 260 118 V92", "dr thick", 0.8) +
    D("M286 82 V120", "dr root", 1) + C(286, 126, 6, "fruit pop", 1.1) + star8(200, 150, 10, "st8 pop", 'style="--d:1.3s"'));


})();

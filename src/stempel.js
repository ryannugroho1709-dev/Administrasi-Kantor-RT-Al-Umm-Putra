// ============================================================
//  CAP STEMPEL PKBM AL UMM BARABAI (digambar ulang sebagai SVG, tampak seperti bekas cap tinta biru)
//  Sengaja TIDAK memakai foto stempel asli supaya berkas aplikasi tidak memuat gambar cap resmi yang bisa disalin.
//  Pakai: stempelSvg({ ukuran: "34mm", miring: -9 }) → string <svg> untuk disisipkan di surat/cetakan.
// ============================================================
function stempelSvg(opsi = {}) {
  const ukuran = opsi.ukuran || "34mm", miring = opsi.miring ?? -9, tinta = opsi.warna || "#2530b4", id = "stp" + Math.random().toString(36).slice(2, 7);
  // tepi bergelombang 8 lengkung
  const tepi = (r, a) => { let d = ""; for (let i = 0; i <= 360; i += 2) { const t = (i * Math.PI) / 180, rr = r + a * Math.cos(8 * t); d += `${i ? "L" : "M"}${(150 + rr * Math.sin(t)).toFixed(1)},${(150 - rr * Math.cos(t)).toFixed(1)}`; } return d + "Z"; };
  const bintang8 = (cx, cy, r) => { let d = ""; for (let i = 0; i < 16; i++) { const t = (i * Math.PI) / 8 - Math.PI / 8, rr = i % 2 ? r * 0.8 : r; d += `${i ? "L" : "M"}${(cx + rr * Math.cos(t)).toFixed(1)},${(cy + rr * Math.sin(t)).toFixed(1)}`; } return d + "Z"; };
  return `<svg class="stempel" viewBox="0 0 300 300" style="width:${ukuran};height:${ukuran};transform:rotate(${miring}deg)" xmlns="http://www.w3.org/2000/svg" aria-label="Cap stempel PKBM Al Umm Barabai">
  <defs>
    <filter id="${id}f" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="${Math.floor(Math.random() * 99)}" result="n"/>
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.3 1.25" result="bercak"/>
      <feComposite in="SourceGraphic" in2="bercak" operator="in" result="tinta"/>
      <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7" result="g"/>
      <feDisplacementMap in="tinta" in2="g" scale="2.2" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
    <path id="${id}a" d="M 59.4,192.3 A 100,100 0 1 1 240.6,192.3"/>
    <path id="${id}b" d="M 38,150 A 112,112 0 0 0 262,150"/>
  </defs>
  <g filter="url(#${id}f)" fill="none" stroke="${tinta}" opacity="0.92">
    <path d="${tepi(136, 7)}" stroke-width="6"/>
    <path d="${tepi(126, 6.5)}" stroke-width="2.5"/>
    <circle cx="150" cy="150" r="79" stroke-width="3.5"/>
    <g fill="${tinta}" stroke="none" font-family="Arial, Helvetica, sans-serif" font-weight="800">
      <text font-size="16.5" letter-spacing="0.3"><textPath href="#${id}a" startOffset="50%" text-anchor="middle">PUSAT KEGIATAN BELAJAR MASYARAKAT</textPath></text>
      <text font-size="24" letter-spacing="1"><textPath href="#${id}b" startOffset="50%" text-anchor="middle">AL UMM BARABAI</textPath></text>
      <text x="52" y="216" font-size="17" text-anchor="middle">★</text><text x="248" y="216" font-size="17" text-anchor="middle">★</text>
      <text x="150" y="104" font-size="15" text-anchor="middle" font-family="'Traditional Arabic', 'Amiri', 'Segoe UI', Arial, sans-serif" direction="rtl">المؤسسة الإسلامية</text>
      <path d="${bintang8(150, 148, 34)}"/>
      <text x="150" y="152" font-size="20" fill="#fff" text-anchor="middle" font-family="'Traditional Arabic', 'Amiri', 'Segoe UI', Arial, sans-serif" direction="rtl">الأم</text>
      <path d="M128,162 q22,-8 22,6 q0,-14 22,-6 l0,10 q-22,-8 -22,6 q0,-14 -22,-6 z" fill="#fff" stroke="${tinta}" stroke-width="1.5"/>
    </g>
    <path d="M86,186 Q150,214 214,186 L208,204 Q150,232 92,204 Z" stroke-width="2.2"/>
    <text x="150" y="214" font-size="13.5" fill="${tinta}" stroke="none" font-weight="700" text-anchor="middle" font-family="'Traditional Arabic', 'Amiri', 'Segoe UI', Arial, sans-serif" direction="rtl">على منهج السلف الصالح</text>
  </g></svg>`;
}
// nama jabatan penandatangan sesuai ruang: di PKBM, "Kepala Sekolah" jenjang = Penyelenggara jenjang
function jabatanPenandatangan(ruang) {
  const r = ruang || (typeof STATE !== "undefined" ? STATE.ruang : "");
  return { A: "Penyelenggara Paket A", Pa: "Penyelenggara Paket B & C Putra", Pi: "Penyelenggara Paket B & C Putri", Pg: "Kepala PKBM" }[r] || "Kepala PKBM";
}

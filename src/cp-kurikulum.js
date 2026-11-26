// ============================================================
//  🎯 CAPAIAN PEMBELAJARAN (CP) — dari Keputusan Kepala BSKAP No. 046/H/KR/2025
//  • Data per mapel: src/cp-data/<versi>/<id>.json (diambil dari PDF: rasional, tujuan, elemen, CP per fase).
//  • Per ruang: Paket A = Fase A–C; Paket B & C Putra/Putri = Fase D–F. Ruang Pengelola melihat semua jenjang.
//  • Status per ruang: "Dipakai" / "Tersedia" — Penyelenggara/Admin dapat mengaktifkan CP pilihan (kv "cp:aktif").
//  • Versi: tiap terbitan CP baru ditambah di CP_VERSI; perbedaan antarversi ditampilkan per fase & elemen.
// ============================================================
const CP_VERSI = [{ id: "2025", judul: "CP 2025", dasar: "Keputusan Kepala BSKAP Nomor 046/H/KR/2025", tgl: "16 Juli 2025", folder: "src/cp-data/2025" }];
const CP_RUANG = { A: { nama: "Paket A", fase: ["A", "B", "C"], warna: "#10b981" }, Pa: { nama: "Paket B & C Putra", fase: ["D", "E", "F"], warna: "#2563eb" }, Pi: { nama: "Paket B & C Putri", fase: ["D", "E", "F"], warna: "#db2777" } };
const CP_FASE = { A: ["Kelas 1–2", "#f59e0b"], B: ["Kelas 3–4", "#84cc16"], C: ["Kelas 5–6", "#10b981"], D: ["Kelas 7–9", "#0ea5e9"], E: ["Kelas 10", "#6366f1"], F: ["Kelas 11–12", "#a855f7"] };
const CP_KEL = { umum: ["📚", "Kelompok Umum"], pilihan: ["🧩", "Pilihan"], seni: ["🎨", "Seni (pilih cabang)"], prakarya: ["🛠️", "Prakarya (pilih jenis)"], pemberdayaan: ["🌱", "Muatan Pemberdayaan"], keterampilan: ["🧰", "Muatan Keterampilan"] };
// [ikon, kelompok, {ruang: [nama mapel di aplikasi] | null}, catatan]
const CP_PETA = {
  "pendidikan-agama-islam-dan-budi-pekerti": ["🕌", "umum", { A: ["PAI"] }, "Putra & Putri: diwakili mapel diniyah (menyusul)"],
  "pendidikan-pancasila": ["🦅", "umum", { A: ["Pendidikan Pancasila", "Pendidikan Pancasila/SBdP"], Pa: ["PPKN/Seni Budaya", "PPKN/Sejarah"], Pi: ["PPKn"] }],
  "bahasa-indonesia": ["📖", "umum", { A: ["Bahasa Indonesia", "Bahasa Indonesia/Abaca"], Pa: ["Bahasa Indonesia"], Pi: ["Bahasa Indonesia"] }],
  "matematika": ["➗", "umum", { A: ["Matematika", "IPAS/Matematika"], Pa: ["Matematika"], Pi: ["Matematika"] }],
  "bahasa-inggris": ["🔤", "umum", { A: ["Bahasa Inggris"], Pa: ["Bahasa Inggris"], Pi: ["Bahasa Inggris"] }],
  "ilmu-pengetahuan-alam-dan-sosial": ["🌍", "umum", { A: ["IPAS", "IPA", "IPS", "IPAS/Matematika"] }],
  "ilmu-pengetahuan-alam": ["🔬", "umum", { Pa: ["IPA"], Pi: ["IPA"] }],
  "ilmu-pengetahuan-sosial": ["🏘️", "umum", { Pa: ["IPS"], Pi: ["IPS"] }],
  "informatika": ["💻", "umum", { Pa: ["TIK"], Pi: ["TIK"] }],
  "sejarah": ["📜", "umum", { Pa: ["PPKN/Sejarah"], Pi: ["Sejarah"] }],
  "pendidikan-jasmani-olahraga-dan-kesehatan": ["⚽", "umum", { A: ["PJOK"], Pa: ["PJOK"], Pi: ["PJOK"] }],
  "seni-rupa": ["🎨", "seni", { A: ["SBdP", "Pendidikan Pancasila/SBdP"], Pa: ["PPKN/Seni Budaya"], Pi: ["Seni Budaya"] }],
  "seni-musik": ["🎵", "seni", {}], "seni-tari": ["🪭", "seni", {}], "seni-teater": ["🎭", "seni", {}],
  "prakarya-kerajinan": ["🧵", "prakarya", { Pi: ["Prakarya"] }, "Putri: kerajinan tekstil (menjahit, sulam)"],
  "prakarya-dan-kewirausahaan-kerajinan": ["🧵", "prakarya", { Pi: ["Prakarya"] }, "Putri kelas 11–12: kerajinan tekstil & kewirausahaan"],
  "prakarya-budi-daya": ["🌿", "prakarya", {}], "prakarya-pengolahan": ["🥘", "prakarya", {}], "prakarya-rekayasa": ["⚙️", "prakarya", {}],
  "prakarya-dan-kewirausahaan-budi-daya": ["🌿", "prakarya", {}], "prakarya-dan-kewirausahaan-pengolahan": ["🥘", "prakarya", {}], "prakarya-dan-kewirausahaan-rekayasa": ["⚙️", "prakarya", {}],
  "fisika": ["🧲", "pilihan", { Pa: ["Biologi/Kimia/Fisika"], Pi: ["Fisika"] }], "kimia": ["⚗️", "pilihan", { Pa: ["Biologi/Kimia/Fisika"], Pi: ["Kimia"] }], "biologi": ["🧬", "pilihan", { Pa: ["Biologi/Kimia/Fisika"], Pi: ["Biologi"] }],
  "geografi": ["🗺️", "pilihan", { Pa: ["Geografi/Sosiologi/Ek"], Pi: ["Geografi"] }], "ekonomi": ["💹", "pilihan", { Pa: ["Geografi/Sosiologi/Ek"], Pi: ["Ekonomi"] }], "sosiologi": ["👥", "pilihan", { Pa: ["Geografi/Sosiologi/Ek"], Pi: ["Sosiologi"] }],
  "antropologi": ["🏺", "pilihan", {}], "bahasa-indonesia-tingkat-lanjut": ["📕", "pilihan", {}], "matematika-tingkat-lanjut": ["📐", "pilihan", {}], "bahasa-inggris-tingkat-lanjut": ["📘", "pilihan", {}], "sejarah-tingkat-lanjut": ["🏛️", "pilihan", {}],
  "bahasa-jepang": ["🗣️", "pilihan", {}], "bahasa-jerman": ["🗣️", "pilihan", {}], "bahasa-korea": ["🗣️", "pilihan", {}], "bahasa-mandarin": ["🗣️", "pilihan", {}],
  "koding-dan-kecerdasan-artifisial": ["🤖", "pilihan", {}],
  "iv-pemberdayaan": ["🌱", "pemberdayaan", {}, "Wajib di pendidikan kesetaraan — belum ada mapelnya di aplikasi"],
  "iv-komputer-aplikasi-perkantoran": ["🖨️", "keterampilan", { Pa: ["TIK"], Pi: ["TIK"] }], "iv-kreator-konten": ["🎬", "keterampilan", { Pi: ["Media Kreatif"] }],
  "iv-tata-busana": ["✂️", "keterampilan", {}, "Putri: bisa ditambahkan bila keterampilan menjahit ditingkatkan"], "iv-tata-boga": ["🍳", "keterampilan", {}], "iv-robotika": ["🦾", "keterampilan", {}], "iv-pengelolaan-sampah": ["♻️", "keterampilan", {}],
  "iv-pertanian-terpadu": ["🌾", "keterampilan", {}], "iv-barista": ["☕", "keterampilan", {}], "iv-perikanan-tangkap": ["🎣", "keterampilan", {}], "iv-koding-dan-kecerdasan-artifisial": ["🤖", "keterampilan", {}],
};
const CP_EL_WARNA = ["#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316", "#6366f1", "#84cc16"];
const CPK = { versi: CP_VERSI[CP_VERSI.length - 1].id, indeks: null, data: {}, aktif: {}, ruang: "", kel: "", status: "", cari: "", buka: null, fase: "", tab: "fase", el: 0, wadah: null, pengelola: false };
const _cpE = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const _cpVer = (id) => CP_VERSI.find((v) => v.id === id) || CP_VERSI[CP_VERSI.length - 1];
const _cpBoleh = () => (typeof isAdmin === "function" && isAdmin()) || (typeof isKepsek === "function" && isKepsek()) || (typeof isAdminKedua === "function" && isAdminKedua());
const _cpJudulRapi = (s) => String(s || "").toLowerCase().replace(/\b(\p{L})/gu, (m) => m.toUpperCase()).replace(/\b(Dan|Dalam|Dengan|Atau|Yang)\b/g, (m) => m.toLowerCase()).replace(/\(ipas\)|\(ipa\)/gi, (m) => m.toUpperCase());

async function _cpMuatIndeks(versi = CPK.versi) {
  const v = _cpVer(versi); if (CPK.indeks && CPK.indeks._v === v.id) return CPK.indeks;
  const r = await fetch(`${v.folder}/_indeks.json?v=2`); const d = await r.json(); d._v = v.id; CPK.indeks = d; return d;
}
async function _cpMuatMapel(id, versi = CPK.versi) {
  const k = versi + "/" + id; if (CPK.data[k]) return CPK.data[k];
  const r = await fetch(`${_cpVer(versi).folder}/${id}.json?v=2`); if (!r.ok) return null; return (CPK.data[k] = await r.json());
}
async function _cpMuatAktif() {
  const ruang = CPK.pengelola ? ["A", "Pa", "Pi"] : [CPK.ruang];
  try {
    const r = await supaSemua.from("kuliah_pengaturan").select("ruang_id,nilai").eq("kunci", "cp:aktif").in("ruang_id", ruang);
    (r.data || []).forEach((x) => (CPK.aktif[x.ruang_id] = x.nilai || {}));
  } catch (e) {}
}
// dipakai di ruang ini? (setelan Penyelenggara menimpa bawaan)
function _cpDipakai(id, r) {
  const s = (CPK.aktif[r] || {})[id]; if (s === true || s === false) return s;
  const p = CP_PETA[id]; return !!(p && p[2] && p[2][r] && p[2][r].length);
}
const _cpRelevan = (m, r) => (m.fase || []).some((f) => CP_RUANG[r].fase.includes(f));

// ── Tampilan utama ──
async function cpBuka(wadah, opsi = {}) {
  CPK.wadah = wadah; CPK.pengelola = !!opsi.pengelola;
  CPK.ruang = CPK.pengelola ? CPK.ruang || "" : STATE.ruang;
  wadah.innerHTML = `<div class="cpk"><div class="cpk-muat">⏳ Memuat Capaian Pembelajaran…</div></div>`;
  try { await _cpMuatIndeks(); await _cpMuatAktif(); } catch (e) { wadah.innerHTML = `<div class="card empty-state">Gagal memuat CP: ${_cpE(e.message || e)}</div>`; return; }
  _cpGambar();
}
function _cpDaftarRuang() { return CPK.pengelola ? (CPK.ruang ? [CPK.ruang] : ["A", "Pa", "Pi"]) : [CPK.ruang]; }
function _cpGambar() {
  const w = CPK.wadah; if (!w) return;
  const v = _cpVer(CPK.versi), ruangs = _cpDaftarRuang(), kata = CPK.cari.toLowerCase().split(/\s+/).filter(Boolean);
  const daftar = CPK.indeks.filter((m) => ruangs.some((r) => _cpRelevan(m, r)))
    .filter((m) => !CPK.kel || (CP_PETA[m.id] || [])[1] === CPK.kel)
    .filter((m) => !CPK.status || ruangs.some((r) => _cpRelevan(m, r) && (_cpDipakai(m.id, r) ? "pakai" : "tersedia") === CPK.status))
    .filter((m) => !kata.length || kata.every((k) => (m.nama + " " + m.elemen.join(" ") + " " + ((CP_PETA[m.id] || [])[3] || "")).toLowerCase().includes(k)));
  const urut = ["umum", "seni", "prakarya", "pemberdayaan", "keterampilan", "pilihan"];
  daftar.sort((a, b) => urut.indexOf((CP_PETA[a.id] || [])[1]) - urut.indexOf((CP_PETA[b.id] || [])[1]));
  const faseRuang = [...new Set(ruangs.flatMap((r) => CP_RUANG[r].fase))];
  const nPakai = (r) => CPK.indeks.filter((m) => _cpRelevan(m, r) && _cpDipakai(m.id, r)).length;
  const kelompok = {}; daftar.forEach((m) => (kelompok[(CP_PETA[m.id] || [])[1] || "pilihan"] = kelompok[(CP_PETA[m.id] || [])[1] || "pilihan"] || []).push(m));
  w.innerHTML = `<div class="cpk">
    <div class="cpk-hero"><div><small>🎯 KURIKULUM · ${_cpE(v.dasar)}</small><h2>Capaian Pembelajaran</h2>
      <p>${CPK.pengelola ? "Semua jenjang PKBM Al-Umm Barabai" : _cpE(CP_RUANG[CPK.ruang].nama)} · Fase ${faseRuang.join(", ")}. CP mapel umum Paket A/B/C mengacu pada CP SD/SMP/SMA; muatan Pemberdayaan & Keterampilan khusus kesetaraan.</p></div>
      <div class="cpk-versi"><select onchange="cpGantiVersi(this.value)">${CP_VERSI.map((x) => `<option value="${x.id}" ${x.id === CPK.versi ? "selected" : ""}>${_cpE(x.judul)} · ${_cpE(x.tgl)}</option>`).join("")}</select>
      <button onclick="cpBandingkan()" ${CP_VERSI.length < 2 ? "title='Baru ada satu versi CP'" : ""}>⇄ Bandingkan Versi</button></div></div>
    ${CPK.pengelola ? `<div class="cpk-ruang">${[["", "🏫 Semua Jenjang"], ["A", "Paket A"], ["Pa", "Paket B & C Putra"], ["Pi", "Paket B & C Putri"]].map(([k, l]) => `<button class="${k === CPK.ruang ? "on" : ""}" style="--rw:${k ? CP_RUANG[k].warna : "#0f5132"}" onclick="CPK.ruang='${k}';_cpGambar()">${l}${k ? `<small>${nPakai(k)} dipakai</small>` : ""}</button>`).join("")}</div>` : ""}
    <div class="cpk-alat"><div class="cpk-cari">🔎<input type="search" placeholder="Cari mapel atau elemen… mis. bilangan, menulis, kerajinan" value="${_cpE(CPK.cari)}" oninput="CPK.cari=this.value;clearTimeout(CPK.t);CPK.t=setTimeout(()=>{_cpGambar();const i=document.querySelector('.cpk-cari input');if(i){i.focus();i.setSelectionRange(i.value.length,i.value.length);}},250)"></div>
      <div class="cpk-chip">${[["", "Semua"], ...Object.entries(CP_KEL).map(([k, [ik, l]]) => [k, ik + " " + l])].map(([k, l]) => `<button class="${k === CPK.kel ? "on" : ""}" onclick="CPK.kel='${k}';_cpGambar()">${l}</button>`).join("")}</div>
      <div class="cpk-chip">${[["", "Semua Status"], ["pakai", "✅ Dipakai"], ["tersedia", "➕ Tersedia"]].map(([k, l]) => `<button class="${k === CPK.status ? "on" : ""}" onclick="CPK.status='${k}';_cpGambar()">${l}</button>`).join("")}</div></div>
    ${Object.entries(kelompok).map(([k, isi]) => `<div class="cpk-kel"><h3>${(CP_KEL[k] || ["", k])[0]} ${(CP_KEL[k] || ["", k])[1]} <small>${isi.length}</small></h3><div class="cpk-grid">${isi.map(_cpKartu).join("")}</div></div>`).join("") || `<div class="card empty-state">Tidak ada CP yang cocok.</div>`}
    <p class="cpk-sumber">Sumber: ${_cpE(v.dasar)} tentang Capaian Pembelajaran pada PAUD, Jenjang Pendidikan Dasar, dan Jenjang Pendidikan Menengah (ditetapkan ${_cpE(v.tgl)}). Mapel agama selain Islam, bahasa asing yang tidak relevan, dan Bahasa Arab (diniyah, menyusul) tidak ditampilkan.</p>
  </div>`;
}
function _cpKartu(m) {
  const p = CP_PETA[m.id] || ["📘", "pilihan", {}], ruangs = _cpDaftarRuang().filter((r) => _cpRelevan(m, r)), boleh = _cpBoleh() && !CPK.pengelola;
  const status = ruangs.map((r) => { const on = _cpDipakai(m.id, r); return `<span class="cpk-st ${on ? "on" : ""}" style="--rw:${CP_RUANG[r].warna}" title="${CP_RUANG[r].nama}">${CPK.pengelola ? CP_RUANG[r].nama.replace("Paket B & C ", "") + " · " : ""}${on ? "✅ Dipakai" : "➕ Tersedia"}</span>`; }).join("");
  const fase = m.fase.filter((f) => ruangs.some((r) => CP_RUANG[r].fase.includes(f)));
  const mapelApp = [...new Set(ruangs.flatMap((r) => (p[2] || {})[r] || []))];
  return `<div class="cpk-kartu" onclick="cpBukaMapel('${m.id}')">
    <div class="cpk-k-ikon">${p[0]}</div><div class="cpk-k-isi"><b>${_cpE(_cpJudulRapi(m.nama))}</b>
      <div class="cpk-fase">${fase.map((f) => `<i style="--fw:${CP_FASE[f][1]}">${f}</i>`).join("")}<small>${m.elemen.length} elemen</small></div>
      ${mapelApp.length ? `<small class="cpk-app">Mapel kita: ${_cpE(mapelApp.join(", "))}</small>` : ""}${p[3] ? `<small class="cpk-cat">ℹ️ ${_cpE(p[3])}</small>` : ""}
      <div class="cpk-stbar">${status}${boleh ? `<button onclick="event.stopPropagation();cpAturAktif('${m.id}',${!_cpDipakai(m.id, CPK.ruang)})">${_cpDipakai(m.id, CPK.ruang) ? "Nonaktifkan" : "Aktifkan"}</button>` : ""}</div></div></div>`;
}
async function cpAturAktif(id, nyala) {
  if (!_cpBoleh()) return;
  try {
    const hasil = await _kvGabung("cp:aktif", { [id]: nyala });
    CPK.aktif[CPK.ruang] = hasil || { ...(CPK.aktif[CPK.ruang] || {}), [id]: nyala };
    if (typeof _rgLog === "function") _rgLog("cp-aktif", { cp: id, aktif: nyala });
    toast(nyala ? "CP diaktifkan untuk jenjang ini" : "CP dinonaktifkan", "ok"); _cpGambar();
  } catch (e) { toast("Gagal: " + (e.message || e), "err"); }
}
function cpGantiVersi(id) { CPK.versi = id; CPK.indeks = null; cpBuka(CPK.wadah, { pengelola: CPK.pengelola }); }

// ── Rincian satu mapel ──
async function cpBukaMapel(id, fase) {
  const m = await _cpMuatMapel(id); if (!m) { toast("Data CP tidak ditemukan", "err"); return; }
  const ruangs = _cpDaftarRuang(), faseAda = Object.keys(m.fase), faseRuang = faseAda.filter((f) => ruangs.some((r) => CP_RUANG[r].fase.includes(f)));
  CPK.buka = id; CPK.fase = fase || (faseRuang[0] || faseAda[0]); CPK.tab = CPK.tab || "fase"; CPK.el = 0;
  _cpGambarMapel();
}
function _cpGambarMapel() {
  const m = CPK.data[CPK.versi + "/" + CPK.buka]; if (!m) return;
  const p = CP_PETA[m.id] || ["📘"], ruangs = _cpDaftarRuang(), faseAda = Object.keys(m.fase);
  const elNama = (m.fase[faseAda[0]] || { elemen: [] }).elemen.map((e) => e.nama);
  const tab = [["fase", "🌳 CP per Fase"], ["alur", "📈 Alur Elemen"], ["elemen", "🧩 Elemen"], ["rasional", "🎯 Rasional & Tujuan"]];
  let isi = "";
  if (CPK.tab === "fase") {
    const f = m.fase[CPK.fase] || {};
    isi = `<div class="cpk-pohon" style="--fw:${CP_FASE[CPK.fase][1]}">
      <div class="cpk-akar"><span>${p[0]}</span><div><b>Fase ${CPK.fase}</b><small>${_cpE(f.judul || CP_FASE[CPK.fase][0])}</small></div></div>
      ${(f.pengantar || []).length ? `<div class="cpk-pengantar">${f.pengantar.map((x) => `<p>${_cpE(x)}</p>`).join("")}</div>` : ""}
      <div class="cpk-cabang">${(f.elemen || []).map((e, i) => `<div class="cpk-ranting" style="--ew:${CP_EL_WARNA[i % CP_EL_WARNA.length]}">
        <div class="cpk-r-judul"><i>${i + 1}</i><b>${_cpE(e.nama)}</b></div>
        <div class="cpk-r-isi">${e.cp.map((x) => `<p>${_cpE(x)}</p>`).join("")}</div></div>`).join("") || `<p class="cpk-redup">Tidak ada rincian elemen pada fase ini.</p>`}</div></div>`;
  } else if (CPK.tab === "alur") {
    const nm = elNama[CPK.el] || "";
    isi = `<div class="cpk-pilih-el">${elNama.map((n, i) => `<button class="${i === CPK.el ? "on" : ""}" style="--ew:${CP_EL_WARNA[i % CP_EL_WARNA.length]}" onclick="CPK.el=${i};_cpGambarMapel()">${_cpE(n)}</button>`).join("")}</div>
      <div class="cpk-alur">${faseAda.map((fk) => { const e = (m.fase[fk].elemen || []).find((x) => x.nama.toLowerCase() === nm.toLowerCase()) || (m.fase[fk].elemen || [])[CPK.el]; const milik = ruangs.some((r) => CP_RUANG[r].fase.includes(fk));
        return `<div class="cpk-alur-titik ${milik ? "" : "redup"}" style="--fw:${CP_FASE[fk][1]}"><div class="cpk-alur-fase"><b>Fase ${fk}</b><small>${CP_FASE[fk][0]}</small></div><div class="cpk-alur-isi">${e ? e.cp.map((x) => `<p>${_cpE(x)}</p>`).join("") : "<p class='cpk-redup'>—</p>"}</div></div>`; }).join("")}</div>`;
  } else if (CPK.tab === "elemen") {
    isi = `<div class="cpk-elemen">${(m.elemen || []).map((e, i) => `<div class="cpk-el-kartu" style="--ew:${CP_EL_WARNA[i % CP_EL_WARNA.length]}"><b>${_cpE(e.nama)}</b><p>${_cpE(e.desk)}</p></div>`).join("") || `<p class="cpk-redup">Deskripsi elemen tidak tersedia.</p>`}</div>`;
  } else {
    isi = `<div class="cpk-teks"><h4>Rasional</h4>${m.rasional.map((x) => `<p>${_cpE(x)}</p>`).join("")}<h4>Tujuan</h4><ol class="cpk-tujuan">${m.tujuan.map((x) => `<li>${_cpE(x.replace(/^\d+\.\s*/, ""))}</li>`).join("")}</ol>${m.karakteristik.length ? `<h4>Karakteristik</h4>${m.karakteristik.map((x) => `<p>${_cpE(x)}</p>`).join("")}` : ""}</div>`;
  }
  openModal(`<div class="cpk-modal">
    <div class="cpk-m-kepala"><span class="cpk-m-ikon">${p[0]}</span><div><small>${_cpE(_cpVer(CPK.versi).judul)} · ${m.lampiran === "IV" ? "Lampiran IV (Kesetaraan)" : "Lampiran II"} · hal. ${m.hal.join("–")}</small><h3>${_cpE(_cpJudulRapi(m.nama))}</h3></div></div>
    <div class="cpk-tab">${tab.map(([k, l]) => `<button class="${k === CPK.tab ? "on" : ""}" onclick="CPK.tab='${k}';_cpGambarMapel()">${l}</button>`).join("")}</div>
    ${CPK.tab === "fase" ? `<div class="cpk-fase-tab">${faseAda.map((f) => { const milik = ruangs.some((r) => CP_RUANG[r].fase.includes(f)); return `<button class="${f === CPK.fase ? "on" : ""} ${milik ? "" : "redup"}" style="--fw:${CP_FASE[f][1]}" onclick="CPK.fase='${f}';_cpGambarMapel()"><b>Fase ${f}</b><small>${CP_FASE[f][0]}</small></button>`; }).join("")}</div>` : ""}
    <div class="cpk-m-isi">${isi}</div>
    <div class="bsp-aksi-bawah"><button class="btn btn-outline" onclick="closeModal()">Tutup</button></div></div>`, { lebar: true });
}

// ── Bandingkan dua versi CP (per mapel → fase → elemen, kata demi kata) ──
function _cpBeda(a, b) {
  const x = String(a || "").split(/\s+/).filter(Boolean), y = String(b || "").split(/\s+/).filter(Boolean);
  if (x.length * y.length > 400000) return a === b ? _cpE(b) : `<del>${_cpE(a)}</del> <ins>${_cpE(b)}</ins>`;
  const t = Array.from({ length: x.length + 1 }, () => new Uint16Array(y.length + 1));
  for (let i = x.length - 1; i >= 0; i--) for (let j = y.length - 1; j >= 0; j--) t[i][j] = x[i] === y[j] ? t[i + 1][j + 1] + 1 : Math.max(t[i + 1][j], t[i][j + 1]);
  const o = []; let i = 0, j = 0;
  while (i < x.length && j < y.length) { if (x[i] === y[j]) { o.push(_cpE(x[i])); i++; j++; } else if (t[i + 1][j] >= t[i][j + 1]) o.push(`<del>${_cpE(x[i++])}</del>`); else o.push(`<ins>${_cpE(y[j++])}</ins>`); }
  while (i < x.length) o.push(`<del>${_cpE(x[i++])}</del>`); while (j < y.length) o.push(`<ins>${_cpE(y[j++])}</ins>`);
  return o.join(" ");
}
async function cpBandingkan() {
  if (CP_VERSI.length < 2) { toast("Baru ada satu versi CP (2025). Saat CP terbaru diunggah, perbedaannya tampil di sini.", "info"); return; }
  const lama = CP_VERSI[CP_VERSI.length - 2], baru = CP_VERSI[CP_VERSI.length - 1], id = CPK.buka || "matematika";
  const [a, b] = await Promise.all([_cpMuatMapel(id, lama.id), _cpMuatMapel(id, baru.id)]);
  if (!a || !b) { toast("Mapel ini tidak ada di salah satu versi", "info"); return; }
  const fase = [...new Set([...Object.keys(a.fase), ...Object.keys(b.fase)])];
  openModal(`<div class="cpk-modal"><h3>⇄ ${_cpE(_cpJudulRapi(b.nama))}: ${_cpE(lama.judul)} → ${_cpE(baru.judul)}</h3><p class="bsp-ket"><ins>hijau</ins> = tambahan, <del>merah</del> = dihapus.</p>
    ${fase.map((f) => { const ea = (a.fase[f] || { elemen: [] }).elemen, eb = (b.fase[f] || { elemen: [] }).elemen, nama = [...new Set([...ea, ...eb].map((e) => e.nama))];
      return `<h4>Fase ${f}</h4>${nama.map((n) => { const x = ea.find((e) => e.nama === n), y = eb.find((e) => e.nama === n), ta = x ? x.cp.join(" ") : "", tb = y ? y.cp.join(" ") : ""; return `<div class="cpk-beda ${ta === tb ? "sama" : ""}"><b>${_cpE(n)}</b>${ta === tb ? " <small>tidak berubah</small>" : `<p>${_cpBeda(ta, tb)}</p>`}</div>`; }).join("")}`; }).join("")}
    <div class="bsp-aksi-bawah"><button class="btn btn-outline" onclick="closeModal()">Tutup</button></div></div>`, { lebar: true });
}

// ── Pemasangan: tab di halaman Silabus (ruang jenjang) & menu Pengelola ──
(function () {
  const pasangTab = () => {
    const pg = document.getElementById("page-silabus"); if (!pg || document.getElementById("sl-tab-cp")) return;
    const bar = pg.querySelector("div"); if (!bar) return;
    const btnP = document.getElementById("sl-tabbtn-prosem");
    const b = document.createElement("button"); b.id = "sl-tabbtn-cp"; b.className = "btn btn-outline"; b.textContent = "🎯 Capaian Pembelajaran"; b.onclick = () => gantiTabSilabus("cp");
    if (btnP) btnP.insertAdjacentElement("afterend", b); else bar.insertAdjacentElement("afterbegin", b);
    const t = document.createElement("div"); t.id = "sl-tab-cp"; t.style.display = "none"; bar.insertAdjacentElement("afterend", t);
  };
  if (typeof gantiTabSilabus === "function") {
    const a = gantiTabSilabus;
    gantiTabSilabus = function (tab) {
      pasangTab();
      const t = document.getElementById("sl-tab-cp"), b = document.getElementById("sl-tabbtn-cp");
      if (tab === "cp") {
        ["materi", "cpatp", "prosem"].forEach((x) => { const el = document.getElementById("sl-tab-" + x), bt = document.getElementById("sl-tabbtn-" + x); if (el) el.style.display = "none"; if (bt) bt.className = "btn btn-outline"; });
        if (t) { t.style.display = ""; cpBuka(t); } if (b) b.className = "btn btn-accent";
        return;
      }
      if (t) t.style.display = "none"; if (b) b.className = "btn btn-outline";
      return a.apply(this, arguments);
    };
  }
  if (typeof RG_IKON !== "undefined") RG_IKON["pg-cp"] = '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>';
  if (typeof RG_MENU_PENGELOLA !== "undefined" && !RG_MENU_PENGELOLA.some((g) => g.group === "Kurikulum")) {
    const i = RG_MENU_PENGELOLA.findIndex((g) => g.group === "Keuangan");
    RG_MENU_PENGELOLA.splice(i < 0 ? 2 : i, 0, { group: "Kurikulum", items: [["pg-cp", "", "Capaian Pembelajaran"]] });
  }
  if (typeof PG_MODUL_SIAP !== "undefined" && !PG_MODUL_SIAP.includes("pg-cp")) PG_MODUL_SIAP.push("pg-cp");
  if (typeof rgBukaPengelola === "function") {
    const a = rgBukaPengelola;
    rgBukaPengelola = async function (key) {
      if (key === "pg-cp") { const sec = _rgBukaHal("pg-cp", "Capaian Pembelajaran", ""); return cpBuka(sec, { pengelola: true }); }
      return a.apply(this, arguments);
    };
  }
})();

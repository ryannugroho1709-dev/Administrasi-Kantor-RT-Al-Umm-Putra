// ============================================================
//  📜 DAFTAR NAMA ARAB — semua santri & guru ruang ini, dicek satu per satu
//  Tersimpan di "rapor:arab" (digabung per nama, tidak menimpa yang lain). Kosong = memakai usulan otomatis.
//  Dipakai Rapor Diniyyah (layar & Word). Butuh rapor-cetak.js & rapor-diniyyah-ar.js.
// ============================================================
const DNA = { tab: "santri", kelas: "", cari: "", saring: "semua", siswa: [], guru: [] };
// Kamus tambahan nama umum (usulan lebih tepat daripada ejaan bunyi)
Object.assign(RC_KAMUS, {
  abbas: "عباس", akhmad: "أحمد", ahmed: "أحمد", fauzi: "فوزي", fauzan: "فوزان", hasbi: "حسبي", ridhani: "رضاني", rahmani: "رحماني", adli: "عدلي", alimul: "عليم", subki: "سبكي", zahidi: "زاهدي",
  majidi: "مجيدي", gani: "غني", arief: "عارف", arif: "عارف", hidayat: "هداية", hidayatullah: "هداية الله", noor: "نور", maulana: "مولانا", syarifuddin: "شريف الدين", nasrullah: "نصر الله",
  aminah: "آمنة", fatimah: "فاطمة", fatmah: "فاطمة", khadijah: "خديجة", aisyah: "عائشة", aisya: "عائشة", aishah: "عائشة", zainab: "زينب", maryam: "مريم", ruqayyah: "رقية", safiyyah: "صفية", shafiyyah: "صفية", hafshah: "حفصة", hafsah: "حفصة",
  khairunnisa: "خير النساء", khairinnisa: "خير النساء", zahratunnisa: "زهرة النساء", nabila: "نبيلة", nabilah: "نبيلة", najwa: "نجوى", nur: "نور", nurul: "نور", azizah: "عزيزة",
  rahmah: "رحمة", rahma: "رحمة", rahmi: "رحمي", hasanah: "حسنة", husna: "حسنى", salsabila: "سلسبيلا", shalihah: "صالحة", jannah: "جنة", sakinah: "سكينة", latifah: "لطيفة", lathifah: "لطيفة", syifa: "شفاء",
  qonita: "قانتة", humaira: "حميراء", humairoh: "حميراء", amira: "أميرة", amirah: "أميرة", hafizah: "حافظة", hafidzah: "حافظة", zahra: "زهراء", zahrah: "زهراء", syahidah: "شهيدة", ulfa: "ألفة",
  abdurrozaq: "عبد الرزاق", abdurrazaq: "عبد الرزاق", abdulloh: "عبد الله", habibi: "حبيبي", habibie: "حبيبي", azhar: "أزهر", luqmanul: "لقمان", hakim: "حكيم", dzakwan: "ذكوان", firdaus: "فردوس", mufid: "مفيد", mufti: "مفتي",
  syuraih: "شريح", syurayh: "شريح", rasyid: "رشيد", mishary: "مشاري", rabbani: "رباني", unais: "أنيس", uwais: "أويس", fatih: "فاتح", hafizy: "حافظي", azky: "أزكى", nawal: "نوال", rifqy: "رفقي", zakaria: "زكريا", "ar'razi": "الرازي",
  muzakki: "مزكي", ridho: "رضا", ridha: "رضا", ramadhan: "رمضان", firos: "فراس", farros: "فراس", sayyid: "سيد", althaf: "ألطاف", ilham: "إلهام", mahendra: "مهندرا", adhyaksa: "أدهياكسا", fadhil: "فاضل", faqih: "فقيه",
  salahuddin: "صلاح الدين", shalahuddin: "صلاح الدين", nashrullah: "نصر الله", ihsani: "إحساني", darma: "درما", khalif: "خليف", assudais: "السديس", sudais: "السديس", aidan: "عيدان",
});
async function bukaDaftarNamaArab(tab) {
  await ensureLookups(); await _rcAmbilArab(true);
  RC_ARAB.jk = RC_ARAB.jk || {}; RC_ARAB.gelar = RC_ARAB.gelar || {};
  const X = STATE.ruang;
  const [sw, gr] = await Promise.all([
    supa.from("siswa").select("id,nama,kelas_id,status_aktif").order("nama").then((r) => (r.data || []).filter((s) => s.status_aktif !== false)).catch(() => []),
    supaSemua.from("guru").select("id,nama,ruang,ruang_utama,status_aktif").eq("status_aktif", true).order("nama").then((r) => (r.data || []).filter((g) => X === "Pg" || String(g.ruang || "").split(",").includes(X))).catch(() => []),
  ]);
  const urutK = (id) => { const k = (LOOKUP.kelas || []).find((x) => x.id === id); return parseInt(String(k?.nama_kelas || "").match(/\d+/)?.[0] || "99", 10); };
  DNA.siswa = sw.sort((a, b) => urutK(a.kelas_id) - urutK(b.kelas_id) || a.nama.localeCompare(b.nama, "id"));
  DNA.guru = gr; DNA.tab = tab || DNA.tab;
  _dnaGambar(true);
}
const _dnaKelas = (id) => (LOOKUP.kelas || []).find((k) => k.id === id)?.nama_kelas || "-";
function _dnaBaris() {
  const q = DNA.cari.toLowerCase();
  if (DNA.tab === "santri") return DNA.siswa.filter((s) => (!DNA.kelas || s.kelas_id === DNA.kelas) && (!q || s.nama.toLowerCase().includes(q) || String(RC_ARAB.siswa[s.id] || "").includes(DNA.cari)))
    .map((s) => ({ id: s.id, latin: s.nama, info: _dnaKelas(s.kelas_id), simpan: RC_ARAB.siswa[s.id] || "", usul: _rcUsulArab(s.nama) }));
  return DNA.guru.filter((g) => !q || g.nama.toLowerCase().includes(q) || String(RC_ARAB.guru[g.id] || "").includes(DNA.cari))
    .map((g) => ({ id: g.id, latin: g.nama, info: "", simpan: RC_ARAB.guru[g.id] ? _rcIntiGuruAr(g) : "", usul: _rcUsulArab(g.nama), g }));
}
function _dnaGambar(baru) {
  const e = escapeHtml, semua = _dnaBaris(), cek = semua.filter((b) => b.simpan).length, jenis = DNA.tab === "santri" ? "siswa" : "guru";
  const baris = semua.filter((b) => DNA.saring === "semua" || (DNA.saring === "usul" ? !b.simpan : !!b.simpan));
  const isiBaris = (b, i) => {
    const pr = b.g ? _rcPerempuan(b.g) : false;
    const gTambahan = b.g ? `<div class="dna-guru"><span class="dna-hasil">Tertulis di rapor: ${e(_rcSusunGuruAr(b.g))}</span>
        <label>Gelar <input class="input" dir="rtl" value="${e(RC_ARAB.gelar[b.id] ?? "")}" placeholder="${e(_rcGelarAr(b.latin).join("، ") || "tanpa gelar")}" onchange="_dnaSimpan('gelar','${b.id}',this.value)"></label>
        <span class="dna-jk"><button class="${pr ? "" : "on"}" onclick="_dnaSimpan('jk','${b.id}','L')">الأستاذ</button><button class="${pr ? "on" : ""}" onclick="_dnaSimpan('jk','${b.id}','P')">الأستاذة</button></span></div>` : "";
    return `<div class="dna-baris ${b.simpan ? "ok" : "usul"}"><span class="dna-no">${i + 1}</span>
      <div class="dna-latin"><b>${e(b.latin)}</b>${b.info ? `<small>${e(b.info)}</small>` : ""}</div>
      <div class="dna-arab"><input class="input" dir="rtl" value="${e(b.simpan || b.usul)}" onchange="_dnaSimpan('${jenis}','${b.id}',this.value)">${gTambahan}</div>
      <div class="dna-st">${b.simpan ? `<span class="dna-chip ok">✓ Dicek</span>` : `<button class="dna-chip usul" onclick="_dnaSimpan('${jenis}','${b.id}',this.closest('.dna-baris').querySelector('.dna-arab input').value)" title="Usulan sudah benar">Usulan · ✓ Benar</button>`}</div></div>`;
  };
  const persen = semua.length ? Math.round((cek / semua.length) * 100) : 0;
  const html = `<div class="dna">
    <div class="dna-hero"><span>📜 Daftar Nama Arab</span><h3>${DNA.tab === "santri" ? "Nama Santri" : "Nama Ustadz/Ustadzah"} dalam Bahasa Arab</h3><p>${cek} dari ${semua.length} sudah dicek · yang kuning masih usulan otomatis dari huruf Latin</p>
      <div class="dna-bar"><i style="width:${persen}%"></i></div></div>
    <div class="dna-tab"><button class="${DNA.tab === "santri" ? "on" : ""}" onclick="DNA.tab='santri';_dnaGambar()">👥 Santri (${DNA.siswa.length})</button><button class="${DNA.tab === "guru" ? "on" : ""}" onclick="DNA.tab='guru';_dnaGambar()">🧑‍🏫 Guru (${DNA.guru.length})</button></div>
    <div class="dna-alat">${DNA.tab === "santri" ? `<select class="input" onchange="DNA.kelas=this.value;_dnaGambar()"><option value="">Semua Kelas</option>${(LOOKUP.kelas || []).map((k) => `<option value="${k.id}" ${k.id === DNA.kelas ? "selected" : ""}>${e(k.nama_kelas)}</option>`).join("")}</select>` : ""}
      <input class="input dna-cari" placeholder="🔍 Cari nama" value="${e(DNA.cari)}" oninput="_dnaCari(this.value)">
      <select class="input" onchange="DNA.saring=this.value;_dnaGambar()"><option value="semua" ${DNA.saring === "semua" ? "selected" : ""}>Semua</option><option value="usul" ${DNA.saring === "usul" ? "selected" : ""}>Belum Dicek</option><option value="ok" ${DNA.saring === "ok" ? "selected" : ""}>Sudah Dicek</option></select>
      <button class="btn btn-sm btn-outline" onclick="_dnaUnduh()">⬇️ Unduh Excel</button></div>
    ${DNA.tab === "guru" ? `<div class="dna-format"><b>Format nama ustadz di rapor</b>${Object.entries(RC_FORMAT_GURU).map(([k, l]) => `<button class="${(RC_ARAB.format_guru || "gelar") === k ? "on" : ""}" onclick="_dnaSimpanFormat('${k}')">${e(l)}</button>`).join("")}</div>` : ""}
    <div class="dna-daftar">${baris.map(isiBaris).join("") || `<div class="dna-kosong">Tidak ada nama.</div>`}</div>
    <div class="dna-ket">Ketik ejaan yang benar lalu klik di luar kotak, tersimpan otomatis. <b>✓ Benar</b> = usulan sudah tepat. Kotak dikosongkan = kembali ke usulan otomatis.</div>
  </div>`;
  const lama = document.querySelector(".dna");
  if (lama && !baru) { const w = lama.closest(".modal-panel, #modal-panel") || lama.parentElement, y = w.scrollTop; lama.outerHTML = html; w.scrollTop = y; }
  else openModal(html, { lebar: true });
}
function _dnaCari(v) {
  DNA.cari = v; clearTimeout(DNA.t);
  DNA.t = setTimeout(() => { _dnaGambar(); const c = document.querySelector(".dna-cari"); if (c) { c.focus(); c.setSelectionRange(c.value.length, c.value.length); } }, 350);
}
async function _dnaSimpan(jenis, id, nilai) {
  const v = String(nilai || "").trim();
  try {
    const hasil = await _kvGabung("rapor:arab", { [jenis]: { [id]: v || null } });
    RC_ARAB = { siswa: {}, guru: {}, mapel: {}, mudir: "", tempat: "بارابي", jk: {}, gelar: {}, ...hasil };
    ["siswa", "guru", "gelar", "jk"].forEach((k) => { RC_ARAB[k] = RC_ARAB[k] || {}; Object.keys(RC_ARAB[k]).forEach((x) => { if (RC_ARAB[k][x] == null || RC_ARAB[k][x] === "") delete RC_ARAB[k][x]; }); });
    _dnaGambar(); toast(v ? "✓ Tersimpan" : "Dikembalikan ke usulan otomatis", "ok");
  } catch (e) { toast("Gagal menyimpan: " + (e.message || e), "err"); }
}
async function _dnaSimpanFormat(f) {
  try { const h = await _kvGabung("rapor:arab", { format_guru: f }); RC_ARAB.format_guru = h.format_guru; _dnaGambar(); toast("Format nama ustadz diperbarui", "ok"); }
  catch (e) { toast("Gagal: " + (e.message || e), "err"); }
}
function _dnaUnduh() {
  if (!window.XLSX) { toast("Pustaka Excel belum termuat", "err"); return; }
  const wb = XLSX.utils.book_new();
  const s = DNA.siswa.map((x, i) => ({ No: i + 1, Kelas: _dnaKelas(x.kelas_id), "Nama Latin": x.nama, "Nama Arab": RC_ARAB.siswa[x.id] || _rcUsulArab(x.nama), Status: RC_ARAB.siswa[x.id] ? "Sudah dicek" : "Usulan otomatis", "Perbaikan (bila salah)": "" }));
  const g = DNA.guru.map((x, i) => ({ No: i + 1, "Nama Latin": x.nama, "Nama Arab": _rcIntiGuruAr(x), "Gelar Arab": _rcGelarGuruAr(x), "Tertulis di Rapor": _rcSusunGuruAr(x), Status: RC_ARAB.guru[x.id] ? "Sudah dicek" : "Usulan otomatis", "Perbaikan (bila salah)": "" }));
  const a = XLSX.utils.json_to_sheet(s), b = XLSX.utils.json_to_sheet(g);
  a["!cols"] = [{ wch: 4 }, { wch: 10 }, { wch: 32 }, { wch: 32 }, { wch: 16 }, { wch: 30 }];
  b["!cols"] = [{ wch: 4 }, { wch: 32 }, { wch: 28 }, { wch: 34 }, { wch: 50 }, { wch: 16 }, { wch: 30 }];
  XLSX.utils.book_append_sheet(wb, a, "Santri"); XLSX.utils.book_append_sheet(wb, b, "Guru");
  XLSX.writeFile(wb, `Daftar Nama Arab - ${STATE.ruang}.xlsx`);
}
(function () {
  const s = document.createElement("style");
  s.textContent = `.dna-hero{border-radius:18px;padding:16px 18px;margin:-4px 0 12px;color:#fff;background:radial-gradient(120% 140% at 100% 0%,#34d399 0%,#047857 50%,#064e3b 100%);box-shadow:0 10px 30px rgba(4,120,87,.25)}
  .dna-hero span{display:inline-block;background:rgba(255,255,255,.18);border:1px solid rgba(255,255,255,.3);border-radius:999px;padding:2px 10px;font-size:11px;font-weight:700}.dna-hero h3{margin:6px 0 2px;color:#fff}.dna-hero p{margin:0;font-size:12px;opacity:.9}
  .dna-bar{height:6px;border-radius:999px;background:rgba(255,255,255,.25);margin-top:8px;overflow:hidden}.dna-bar i{display:block;height:100%;background:#fde68a;border-radius:999px}
  .dna-tab{display:flex;gap:6px;margin-bottom:8px}.dna-tab button,.dna-format button,.dna-jk button{border:1px solid var(--border-soft,#e2e8f0);background:var(--card-bg,#fff);color:inherit;border-radius:999px;padding:6px 14px;font-weight:700;font-size:12.5px;cursor:pointer}
  .dna-tab button.on,.dna-format button.on,.dna-jk button.on{background:#047857;color:#fff;border-color:transparent}
  .dna-alat{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px}.dna-alat .input{width:auto;flex:1;min-width:130px}
  .dna-format{display:flex;flex-wrap:wrap;align-items:center;gap:6px;font-size:12px;margin-bottom:8px;padding:8px 10px;border-radius:12px;background:var(--surface-2,#f1f5f9)}
  .dna-daftar{display:grid;gap:6px;max-height:56vh;overflow:auto;padding-right:2px}
  .dna-baris{display:grid;grid-template-columns:28px minmax(150px,1fr) minmax(200px,1.3fr) 130px;gap:8px;align-items:center;padding:8px 10px;border-radius:12px;border:1px solid var(--border-soft,#e2e8f0);background:var(--card-bg,#fff)}
  .dna-baris.usul{background:#fefce8;border-color:#fde68a;color:#1f2937}.dna-no{font-weight:700;color:var(--text-secondary);text-align:center}.dna-latin small{display:block;color:var(--text-secondary);font-size:11px}
  .dna-arab input{font-family:'Amiri','Traditional Arabic',serif;font-size:17px;padding:4px 10px;background:#fff;color:#111827}
  .dna-guru{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-top:5px;font-size:11.5px}.dna-guru label{display:flex;align-items:center;gap:4px;flex:1;min-width:150px}.dna-guru label input{font-size:14px;padding:2px 8px}
  .dna-hasil{flex-basis:100%;font-family:'Amiri',serif;font-size:15px;color:#065f46}.dna-jk button{padding:2px 10px;font-family:'Amiri',serif;font-size:13px}
  .dna-chip{border-radius:999px;padding:4px 10px;font-size:11.5px;font-weight:700;border:0;white-space:nowrap}.dna-chip.ok{background:#d1fae5;color:#065f46}.dna-chip.usul{background:#fde68a;color:#854d0e;cursor:pointer}
  .dna-ket{font-size:11px;color:var(--text-secondary);margin-top:8px}.dna-kosong{padding:14px;text-align:center;color:var(--text-secondary)}
  @media (max-width:700px){.dna-baris{grid-template-columns:24px 1fr}.dna-arab,.dna-st{grid-column:1/-1}}`;
  document.head.appendChild(s);
})();

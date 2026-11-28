// ============================================================
//  RAPOR DINIYYAH — SEMUA BERBAHASA ARAB (tampilan layar & cetak Word)
//  • Nama santri, kelas, mapel, angka (٠١٢…), wali kelas & mudir lengkap dengan الأستاذ/الأستاذة + gelar berbahasa Arab.
//  • Sumber: nama Arab tersimpan (🔤 Nama Arab, kunci "rapor:arab"); bila belum ada → USULAN otomatis dari nama
//    Latin (ditandai "usulan, periksa" di layar, tidak ikut tercetak).
//  • Mapel diniyyah hanya yang sesuai paket & memang diajarkan di kelas itu (jadwal / ada nilai).
// ============================================================
Object.assign(RC_MAPEL_AR, { khath: "الخط", "musthalah hadits": "مصطلح الحديث", "mustalah hadis": "مصطلح الحديث", sharf: "الصرف", "ushul fiqh": "أصول الفقه", "ushul tafsir": "أصول التفسير", adab: "الآداب", hadits: "الحديث", "bahasa arab": "اللغة العربية", abaca: "القراءة", qiroah: "القراءة" });
const RC_URUT_AR = ["العقيدة", "التوحيد", "الفقه", "أصول الفقه", "الحديث", "مصطلح الحديث", "التفسير", "أصول التفسير", "اللغة العربية", "الصرف", "النحو", "التجويد", "تحسين القرآن", "تحفيظ القرآن", "السيرة النبوية", "الآداب", "الإملاء", "الخط", "المحاضرة"];
const RC_GELAR_AR = [
  [/^lc$/, "ليسانس"], [/^s\.?pd\.?i$/, "بكالوريوس التربية الإسلامية"], [/^s\.?pd$/, "بكالوريوس التربية"], [/^s\.?ag$/, "بكالوريوس الدراسات الإسلامية"],
  [/^s\.?h\.?i$/, "بكالوريوس الشريعة"], [/^s\.?h$/, "بكالوريوس القانون"], [/^s\.?si$/, "بكالوريوس العلوم"], [/^s\.?e$|^se$/, "بكالوريوس الاقتصاد"], [/^s\.?kom$/, "بكالوريوس علوم الحاسوب"],
  [/^s\.?sos$/, "بكالوريوس العلوم الاجتماعية"], [/^s\.?p$/, "بكالوريوس الزراعة"], [/^s\.?t$/, "بكالوريوس الهندسة"], [/^s\.?ip$/, "بكالوريوس العلوم السياسية"],
  [/^a\.?md\.?ak$/, "دبلوم المحاسبة"], [/^a\.?md\.?kep$/, "دبلوم التمريض"], [/^a\.?md$/, "دبلوم"],
  [/^m\.?pd\.?i$/, "ماجستير التربية الإسلامية"], [/^m\.?pd$/, "ماجستير التربية"], [/^m\.?ag$/, "ماجستير الدراسات الإسلامية"], [/^m\.?h$/, "ماجستير القانون"], [/^m\.?si$/, "ماجستير العلوم"], [/^m\.?a$|^ma$/, "ماجستير"],
  [/^dr$/, "دكتوراه"], [/^gr$/, "معلم محترف"], [/^c\.?bqt$/, "شهادة تعليم القرآن"], [/^al-?hafizh?$|^hafizh?$/, "الحافظ"],
];
function _rcGelarAr(nama) {
  const bag = String(nama || "").split(",").slice(1).map((x) => x.trim()).filter(Boolean);
  return bag.map((g) => { const k = g.toLowerCase().replace(/\s+/g, "").replace(/\.+$/, ""); const h = RC_GELAR_AR.find(([re]) => re.test(k)); return h ? h[1] : g; });
}
// Jenis kelamin guru untuk الأستاذ/الأستاذة: pilihan tersimpan (rapor:arab.jk) → ruang Putri → ustadz
const _rcPerempuan = (g) => { const jk = g && RC_ARAB?.jk?.[g.id]; if (jk) return jk === "P"; return (g && (String(g.ruang || "").split(",")[0] === "Pi" || g.ruang_utama === "Pi")) || (!g && STATE.ruang === "Pi"); };
// Format nama guru di rapor (rapor:arab.format_guru): "gelar" = الأستاذ + nama + gelar Arab · "ustadz" = الأستاذ + nama · "nama" = nama saja
const RC_FORMAT_GURU = { ustadz: "الأستاذ + Nama (lazim di Arab)", gelar: "الأستاذ + Nama + Gelar", nama: "Nama Saja" };
const _rcIntiGuruAr = (g, nama) => { const v = g && RC_ARAB?.guru?.[g.id]; return v ? String(v).replace(/^(الأستاذة|الأستاذ)\s+/, "").split("،")[0].trim() : _rcUsulArab(nama || g?.nama || ""); };
const _rcGelarGuruAr = (g, nama) => { const v = g && RC_ARAB?.gelar?.[g.id]; return v != null && v !== "" ? String(v) : _rcGelarAr(nama || g?.nama || "").join("، "); };
function _rcSusunGuruAr(g, nama) {
  nama = nama || g?.nama || ""; if (!String(nama).trim()) return "";
  const f = RC_ARAB?.format_guru || "gelar", inti = _rcIntiGuruAr(g, nama), awal = _rcPerempuan(g) ? "الأستاذة" : "الأستاذ", gelar = _rcGelarGuruAr(g, nama);
  return f === "nama" ? inti : f === "ustadz" || !gelar ? `${awal} ${inti}` : `${awal} ${inti}، ${gelar}`;
}
function _rcGuruUsulAr(nama, g) { return _rcSusunGuruAr(g, nama); }
const _rcSiswaAr = (s) => ({ teks: RC_ARAB.siswa[s.id] || _rcUsulArab(s.nama), usul: !RC_ARAB.siswa[s.id] });
const _rcWaliAr = (w) => (w ? { teks: _rcSusunGuruAr(w), usul: !RC_ARAB.guru[w.id] } : { teks: "", usul: false });
function _rcMudirAr(p) { if (RC_ARAB.mudir) return { teks: RC_ARAB.mudir, usul: false }; const n = typeof _namaPejabat === "function" ? _namaPejabat(p) : ""; const g = (LOOKUP.guruAll || []).find((x) => x.nama === n); return { teks: _rcSusunGuruAr(g, n), usul: !!n && !(g && RC_ARAB.guru[g.id]) }; }
function _rcMapelDiniyyah(kelas, dipakai, nilaiKelas) {
  const paket = paketDariNamaKelas(kelas?.nama_kelas);
  const cocok = (m) => !paket || (!m.paket_b && !m.paket_c) || (paket === "B" ? m.paket_b : m.paket_c);
  const adaNilai = new Set((nilaiKelas || []).filter((n) => !kelas?.id || n.kelas_id === kelas.id).map((n) => n.mapel_id));
  const pos = (m) => { const i = RC_URUT_AR.indexOf(_rcMapelAr(m)); return i < 0 ? 99 : i; };
  return (LOOKUP.mapel || []).filter((m) => (m.masuk_diniyyah || m.kategori === "diniyyah") && cocok(m) && (!dipakai || !dipakai.size || dipakai.has(m.id) || adaNilai.has(m.id)))
    .sort((a, b) => pos(a) - pos(b) || a.nama_mapel.localeCompare(b.nama_mapel, "id"));
}
const _rcAr = (v) => (v === "-" || v == null ? "-" : _rcAngkaArab(v));

// Peringkat kelas: jumlah nilai mapel diniyyah kelas itu (nilai sama → peringkat sama)
_rcPeringkat = function (k) {
  const ids = new Set(_rcMapelDiniyyah(k.kelas, k.susunan?.dipakai, k.nilai).map((m) => m.id));
  const total = k.siswa.map((s) => ({ id: s.id, j: k.nilai.filter((n) => n.siswa_id === s.id && ids.has(n.mapel_id)).reduce((a, n) => a + (_rcNA(n) || 0), 0) }));
  const urut = total.filter((x) => x.j > 0).sort((a, b) => b.j - a.j), out = {};
  urut.forEach((x, i) => { out[x.id] = i > 0 && urut[i - 1].j === x.j ? out[urut[i - 1].id] : i + 1; });
  return out;
};
_rcDataDiniyyah = function (k, s, peringkat) {
  const mapel = _rcMapelDiniyyah(k.kelas, k.susunan?.dipakai, k.nilai);
  const nilaiS = k.nilai.filter((n) => n.siswa_id === s.id);
  const baris = mapel.map((m, i) => { const v = _rcNA(nilaiS.find((n) => n.mapel_id === m.id)); const kkm = typeof kkmMapel === "function" ? kkmMapel(m, k.kelas?.id) : (m.kkm ?? 70);
    return { no: _rcAr(i + 1), mapel: _rcMapelAr(m), kkm: _rcAr(kkm), nilai: v != null ? _rcAr(v) : "-", huruf: v != null ? angkaKeHurufArab(v) : "-", v, latin: m.nama_mapel, arabAda: _rcMapelAr(m) !== m.nama_mapel }; });
  const terisi = baris.filter((b) => b.v != null), jumlah = terisi.reduce((a, b) => a + b.v, 0);
  const cat = k.catatan.find((c) => c.siswa_id === s.id) || {}, h = k.hadir.find((r) => r.siswa?.id === s.id) || {};
  const wali = guruWaliKelasDari(k.kelas.id), angkaKelas = _rcAngkaKelas(k.kelas.nama_kelas), [t1, t2] = String(k.tahun).split("/");
  const nm = _rcSiswaAr(s), wl = _rcWaliAr(wali), md = _rcMudirAr(k.pengaturan);
  return {
    d: baris, usul: { santri: nm.usul, wali: wl.usul, mudir: md.usul, mapel: baris.filter((b) => !b.arabAda).map((b) => b.latin) },
    peta: {
      nama_ar: nm.teks, kelas_ar: (RC_KELAS[angkaKelas] || [])[2] || _rcAngkaArab(k.kelas.nama_kelas || ""),
      semester_ar: k.semester === "Genap" ? "الثاني" : "الأول", tahun_ar: _rcAngkaArab(`${t1} - ${t2 || ""}`),
      jumlah: terisi.length ? _rcAr(jumlah) : "-", rata: terisi.length ? _rcAr(Math.round(jumlah / terisi.length)) : "-",
      rank: peringkat[s.id] ? _rcAr(peringkat[s.id]) : "-", jml_siswa: _rcAr(k.siswa.length),
      sakit: h.sakit ? _rcAr(h.sakit) : "-", izin: h.izin ? _rcAr(h.izin) : "-", alpha: h.alpha ? _rcAr(h.alpha) : "-",
      catatan_ar: cat.catatan_wali_kelas_ar || "-", tempat_ar: RC_ARAB.tempat || "بارابي", tanggal_ar: _rcTanggalAr(k.pengaturan.tanggal_terbit),
      wali_ar: wl.teks, mudir_ar: md.teks,
    },
  };
};

// ── Tampilan layar Rapor Diniyyah (sama isinya dengan cetakan Word) ──
renderRaporDiniyyah = async function () {
  const siswaId = qs("rd-siswa").value, target = qs("rapor-diniyyah-content");
  if (!siswaId) { target.innerHTML = `<div class="card empty-state">Pilih siswa.</div>`; return; }
  target.innerHTML = loadingHTML();
  try {
    const semester = qs("rd-semester").value, tahun = qs("rd-tahun").value;
    const { siswa } = await apiGetRaporLengkapSiswa(siswaId, semester, tahun);
    const k = await _rcKonteks(siswa.kelas_id, semester, tahun);
    const s = k.siswa.find((x) => x.id === siswaId) || siswa;
    const d = _rcDataDiniyyah(k, s, _rcPeringkat(k)), p = d.peta, e = escapeHtml;
    const usul = [d.usul.santri && "nama santri", d.usul.wali && "nama wali kelas", d.usul.mudir && "nama mudir"].filter(Boolean);
    const pita = usul.length || d.usul.mapel.length ? `<div class="rda-pita no-print">🔤 ${usul.length ? `<b>${usul.join(", ")}</b> masih <b>usulan otomatis</b> dari huruf Latin — periksa ejaannya.` : ""}${d.usul.mapel.length ? ` Mapel belum punya nama Arab: <b>${d.usul.mapel.map(e).join(", ")}</b>.` : ""} <button class="btn btn-sm rwk-b-ungu" onclick="bukaNamaArab('${s.kelas_id || siswa.kelas_id}')">🔤 Periksa Nama Arab</button></div>` : "";
    const u = (teks, ada) => `<span class="${ada ? "rda-usul" : ""}" title="${ada ? "Usulan otomatis — periksa di 🔤 Nama Arab" : ""}">${e(teks || "-")}</span>`;
    target.innerHTML = `${pita}<div class="card rda" dir="rtl">
      <div class="rda-kop">${htmlLogoSekolahEditable(46)}<div><b>كشف الدرجات</b><span>دار تحفيظ القرآن الأم ${STATE.ruang === "Pi" ? "للبنات" : "للبنين"}</span></div></div>
      <div class="rda-id"><div><i>اسم الطالب${STATE.ruang === "Pi" ? "ة" : ""}</i>: <b>${u(p.nama_ar, d.usul.santri)}</b></div><div><i>الفصل</i>: <b>${e(p.kelas_ar)}</b></div>
        <div><i>الفصل الدراسي</i>: <b>${e(p.semester_ar)}</b></div><div><i>العام الدراسي</i>: <b>${e(p.tahun_ar)}</b></div></div>
      <div class="rda-tabel"><table><thead><tr><th rowspan="2">الرقم</th><th rowspan="2">المواد الدراسية</th><th rowspan="2">الدرجة الصغرى</th><th colspan="2">الدرجة</th></tr><tr><th>بالرقم</th><th>بالحرف</th></tr></thead>
        <tbody>${d.d.map((b) => `<tr><td>${e(b.no)}</td><td class="rda-m">${e(b.mapel)}</td><td>${e(b.kkm)}</td><td><b>${e(b.nilai)}</b></td><td>${e(b.huruf)}</td></tr>`).join("") || `<tr><td colspan="5">لم تُدخل الدرجات بعد</td></tr>`}</tbody>
        <tfoot><tr><td colspan="3">مجموع الدرجات</td><td colspan="2"><b>${e(p.jumlah)}</b></td></tr><tr><td colspan="3">المعدل التراكمي</td><td colspan="2"><b>${e(p.rata)}</b></td></tr>
          <tr><td colspan="3">الترتيب</td><td colspan="2"><b>${e(p.rank)}</b> من ${e(p.jml_siswa)}</td></tr></tfoot></table></div>
      <div class="rda-bawah"><div class="rda-hadir"><b>الغياب</b><span>المرض: ${e(p.sakit)}</span><span>بإذن: ${e(p.izin)}</span><span>بلا إذن: ${e(p.alpha)}</span></div>
        <div class="rda-cat"><b>الملحوظات</b><p>${e(p.catatan_ar)}</p></div></div>
      <div class="rda-tgl">سلم الكشف في: ${e(p.tempat_ar)} — التاريخ: ${e(p.tanggal_ar)}</div>
      <div class="rda-ttd"><div><i>ولي الفصل</i><b>${u(p.wali_ar, d.usul.wali)}</b></div><div><i>مدير المدرسة</i><b>${u(p.mudir_ar, d.usul.mudir)}</b></div><div><i>ولي الطالب</i><b>(............................)</b></div></div>
    </div>
    <div class="no-print" style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px"><button class="btn btn-accent" onclick="bukaCetakRapor('rd')">🖨️ Cetak Word (F4)</button><button class="btn btn-outline" onclick="eksporRaporDiniyyah()">Ekspor PDF</button><button class="btn btn-outline" onclick="bukaNamaArab('${s.kelas_id || siswa.kelas_id}')">🔤 Nama Arab</button><button class="btn btn-outline" onclick="bukaDaftarNamaArab()">📜 Daftar Nama Arab</button></div>`;
  } catch (e) { console.error(e); target.innerHTML = `<div class="card empty-state">Gagal memuat rapor.</div>`; }
};
eksporRaporDiniyyah = function () {
  const el = qs("rapor-diniyyah-content"); if (!el) return;
  const c = el.cloneNode(true); c.querySelectorAll(".no-print,button").forEach((x) => x.remove()); c.querySelectorAll(".rda-usul").forEach((x) => x.classList.remove("rda-usul"));
  eksporHtmlSebagaiPDF("كشف الدرجات", `<style>${RDA_CSS}</style>` + c.innerHTML);
};

// 🔤 Nama Arab: usulan wali kelas & mudir lengkap dengan الأستاذ + gelar Arab; mudir diambil dari pejabat rapor
(function () {
  const asli = bukaNamaArab;
  bukaNamaArab = async function (kelasId) {
    await asli.apply(this, arguments);
    const p = await apiGetPengaturanRapor().catch(() => ({})), mudir = typeof _namaPejabat === "function" ? _namaPejabat(p) : "";
    const wali = guruWaliKelasDari(kelasId);
    qsa(".rc-arab").forEach((i) => {
      const j = i.dataset.jenis; if (j !== "guru" && j !== "mudir") return;
      if (j === "mudir" && !i.dataset.latin) i.dataset.latin = mudir;
      const g = j === "guru" ? wali : (LOOKUP.guruAll || []).find((x) => x.nama === mudir);
      const usul = () => (j === "guru" ? _rcUsulArab(i.dataset.latin) : _rcSusunGuruAr(g, i.dataset.latin)); // wali: nama inti saja (awalan & gelar disusun otomatis)
      const b = i.nextElementSibling; if (b) b.onclick = () => { i.value = usul(); };
      if (j === "mudir") { const lab = i.previousElementSibling; if (lab && mudir) lab.textContent = `Mudir (مدير المدرسة) — ${mudir}`; }
      i.dataset.usulGuru = "1";
    });
    const massal = document.querySelector(".rwk-b-ungu");
    if (massal) massal.onclick = () => qsa(".rc-arab").forEach((i) => { if (i.value.trim() || !i.dataset.latin) return; const j = i.dataset.jenis;
      i.value = j === "mudir" ? _rcSusunGuruAr((LOOKUP.guruAll || []).find((x) => x.nama === mudir), i.dataset.latin) : _rcUsulArab(i.dataset.latin); });
  };
})();

const RDA_CSS = `.rda{font-family:'Amiri','Traditional Arabic',serif;font-size:16px;line-height:1.7;color:#111827;background:#fff;padding:18px 22px}
  .rda-kop{display:flex;flex-direction:column;align-items:center;gap:4px;text-align:center;margin-bottom:10px}.rda-kop b{display:block;font-size:22px}.rda-kop span{font-size:17px}
  .rda-id{display:grid;grid-template-columns:1fr 1fr;gap:2px 24px;margin:6px 0 12px;font-size:16px}.rda-id i{font-style:normal;color:#374151}
  .rda-tabel table{width:100%;border-collapse:collapse;text-align:center}.rda-tabel th,.rda-tabel td{border:1px solid #9ca3af;padding:5px 8px}
  .rda-tabel thead th{background:#ecfdf5;color:#065f46;font-weight:700}.rda-tabel td.rda-m{text-align:right;font-weight:700}.rda-tabel tfoot td{background:#f9fafb}
  .rda-bawah{display:grid;grid-template-columns:1fr 2fr;gap:12px;margin-top:12px}.rda-hadir,.rda-cat{border:1px solid #9ca3af;border-radius:8px;padding:8px 12px}
  .rda-hadir{display:flex;flex-direction:column}.rda-cat p{margin:4px 0 0}.rda-tgl{margin-top:12px}
  .rda-ttd{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;text-align:center;margin-top:16px}.rda-ttd i{font-style:normal;display:block;margin-bottom:46px}.rda-ttd b{font-size:15px}`;
(function () {
  const s = document.createElement("style");
  s.textContent = RDA_CSS + `.rda-usul{background:#fef9c3;border-bottom:2px dotted #ca8a04;border-radius:4px;padding:0 3px}
    .rda-pita{background:#fefce8;border:1px solid #fde047;color:#854d0e;border-radius:14px;padding:10px 14px;margin-bottom:10px;font-size:12.5px;line-height:1.6}
    @media (max-width:640px){.rda{padding:14px 10px;font-size:15px}.rda-id{grid-template-columns:1fr}.rda-bawah{grid-template-columns:1fr}.rda-ttd{grid-template-columns:1fr 1fr}.rda-tabel{overflow-x:auto}}`;
  document.head.appendChild(s);
})();

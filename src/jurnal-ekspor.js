// ============================================================
//  EKSPOR JURNAL (Word) — satu bulan atau beberapa bulan sekaligus, dengan/tanpa SAMPUL.
//  • Pilih "Dari bulan" & "Sampai bulan". Tiap bulan tetap punya judul, tabel, dan tanda tangan
//    di akhir bulannya sendiri — semuanya digabung dalam satu file, dipisah ganti halaman.
//  • Sampul (opsional) hanya di halaman pertama: logo, JURNAL PEMBELAJARAN, nama lembaga,
//    "BULAN SEPTEMBER – OKTOBER 2026", nama guru, semester, tahun ajaran, yayasan & alamat.
//  • File Word dibuat sebagai MHT (.doc) supaya logo ikut tertanam (HTML biasa tidak bisa memuat gambar).
// ============================================================
const JE_BAWAAN = {
  lembaga: "PKBM AL UMM BARABAI", unit: "Rumah Tahfizh Putra",
  yayasan: "YAYASAN AL UMM HULU SUNGAI TENGAH",
  alamat: "Jl. Masjid Al Umm Komp. Bulau Indah Baru RT.09 Kec. Barabai Kab. Hulu Sungai Tengah",
  provinsi: "KALIMANTAN SELATAN",
};
function _jeTeks() { try { return { ...JE_BAWAAN, ...JSON.parse(localStorage.getItem("jeSampulTeks") || "{}") }; } catch (e) { return { ...JE_BAWAAN }; } }
const _jeBulanNama = (ym) => new Date(ym + "-01T00:00:00").toLocaleDateString("id-ID", { month: "long" }).toUpperCase();
// "BULAN NOVEMBER 2026" · "BULAN SEPTEMBER – OKTOBER 2026" · "BULAN DESEMBER 2026 – JANUARI 2027"
function _jeLabelBulan(dari, sampai) {
  const [y1] = dari.split("-"), [y2] = sampai.split("-");
  if (dari === sampai) return `BULAN ${_jeBulanNama(dari)} ${y1}`;
  return y1 === y2 ? `BULAN ${_jeBulanNama(dari)} – ${_jeBulanNama(sampai)} ${y2}` : `BULAN ${_jeBulanNama(dari)} ${y1} – ${_jeBulanNama(sampai)} ${y2}`;
}
function _jeDaftarBulan(dari, sampai) {
  const out = []; let [y, m] = dari.split("-").map(Number); const [y2, m2] = sampai.split("-").map(Number);
  while ((y < y2 || (y === y2 && m <= m2)) && out.length < 12) { out.push(`${y}-${String(m).padStart(2, "0")}`); m++; if (m > 12) { m = 1; y++; } }
  return out;
}
function _jeSemesterTA(daftar) {
  const ta = daftar.map((b) => (typeof _kbTahunAjaran === "function" ? _kbTahunAjaran(b) : { semester: "-", ta: "-" }));
  const uniq = (k) => [...new Set(ta.map((x) => x[k]))].join(" – ");
  return { semester: uniq("semester"), ta: uniq("ta") };
}

function bukaEksporJurnal() {
  const bulanIni = qs("jg-bulan")?.value || bulanIniISO();
  const tk = _jeTeks();
  openModal(`<h3>📤 Ekspor Jurnal ke Word</h3>
    <div style="font-size:12px;color:var(--text-secondary);margin:-4px 0 12px;line-height:1.55">Pilih satu bulan atau beberapa bulan. Tiap bulan tetap memiliki <b>tanda tangan di akhir bulannya</b>; semua digabung dalam satu file.</div>
    <div style="display:flex;gap:10px;flex-wrap:wrap">
      <div class="field" style="flex:1;min-width:140px"><label class="form-label">📅 Dari bulan</label><input type="month" id="je-dari" class="input" value="${bulanIni}" oninput="_jePratinjau()"></div>
      <div class="field" style="flex:1;min-width:140px"><label class="form-label">📅 Sampai bulan</label><input type="month" id="je-sampai" class="input" value="${bulanIni}" oninput="_jePratinjau()"></div>
    </div>
    <div class="je-cepat">${[["Bulan ini", 0], ["2 bulan", 1], ["3 bulan", 2], ["1 semester", 5]].map(([l, n]) => `<button type="button" onclick="_jeRentang(${n})">${l}</button>`).join("")}</div>
    <label class="je-opsi"><input type="checkbox" id="je-sampul" checked onchange="_jePratinjau()"> <span>📘 <b>Tambahkan sampul</b> di halaman pertama</span></label>
    <div id="je-pratinjau"></div>
    <details class="je-atur"><summary>⚙️ Atur teks sampul (lembaga, yayasan, alamat)</summary>
      ${["lembaga", "unit", "yayasan", "alamat", "provinsi"].map((k) => `<div class="field" style="margin:6px 0 0"><label class="form-label" style="text-transform:capitalize">${k}</label><input class="input je-teks" data-k="${k}" value="${escapeHtml(tk[k])}" oninput="_jePratinjau()"></div>`).join("")}
    </details>
    <button class="btn btn-accent" style="width:100%;margin-top:12px" id="je-ok" onclick="eksporJurnalGabungan()">📤 Ekspor Word</button>`);
  _jePratinjau();
}
function _jeRentang(n) {
  const sampai = qs("je-sampai").value || bulanIniISO();
  let [y, m] = sampai.split("-").map(Number); m -= n; while (m < 1) { m += 12; y--; }
  qs("je-dari").value = `${y}-${String(m).padStart(2, "0")}`; _jePratinjau();
}
function _jeIsianTeks() {
  const tk = _jeTeks();
  qsa(".je-teks").forEach((i) => { tk[i.dataset.k] = i.value; });
  try { localStorage.setItem("jeSampulTeks", JSON.stringify(tk)); } catch (e) {}
  return tk;
}
function _jeNamaGuru() {
  const id = qs("jg-guru")?.value;
  return id ? (LOOKUP.guruAll.find((g) => g.id === id)?.nama || STATE.guruNama || "-") : (isAdmin() ? "Semua Guru" : STATE.guruNama || "-");
}
function _jePratinjau() {
  const el = qs("je-pratinjau"); if (!el) return;
  let dari = qs("je-dari").value, sampai = qs("je-sampai").value;
  if (!dari || !sampai) return;
  if (sampai < dari) [dari, sampai] = [sampai, dari];
  const daftar = _jeDaftarBulan(dari, sampai), st = _jeSemesterTA(daftar), tk = _jeIsianTeks();
  const sampul = qs("je-sampul").checked;
  el.innerHTML = `<div class="je-ringkas"><b>${daftar.length} bulan</b> · ${daftar.length} halaman tanda tangan${sampul ? " · 1 sampul" : ""}${daftar.length >= 12 ? " (maksimal 12 bulan)" : ""}</div>
    ${sampul ? `<div class="je-sampul-mini">
      <img src="${escapeHtml(urlLogoSekolah())}" alt="" onerror="this.style.display='none'">
      <b class="j1">JURNAL PEMBELAJARAN</b><b>${escapeHtml(tk.lembaga)}</b><span>${escapeHtml(tk.unit)}</span>
      <b class="j2">${_jeLabelBulan(dari, sampai)}</b>
      <div class="id">Nama Guru: ${escapeHtml(_jeNamaGuru())}<br>Semester: ${escapeHtml(st.semester)}<br>Tahun Ajaran: ${escapeHtml(st.ta)}</div>
      <small>${escapeHtml(tk.yayasan)}<br>${escapeHtml(tk.alamat)}<br>${escapeHtml(tk.provinsi)}</small></div>` : ""}`;
}

// Logo → PNG base64 (lewat kanvas; SVG/JPG pun jadi PNG agar pasti tampil di Word)
async function _jeLogoPng() {
  const url = urlLogoSekolah(); if (!url) return null;
  try {
    const img = await new Promise((ok, no) => { const im = new Image(); im.crossOrigin = "anonymous"; im.onload = () => ok(im); im.onerror = no; im.src = url; });
    const c = document.createElement("canvas"), sisi = 480, r = Math.min(sisi / img.width, sisi / img.height);
    c.width = Math.round(img.width * r); c.height = Math.round(img.height * r);
    c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
    return c.toDataURL("image/png").split(",")[1];
  } catch (e) { console.warn("Logo tidak bisa dimuat:", e); return null; }
}
function _jeSampulHtml(dari, sampai, daftar, tk, adaLogo) {
  const st = _jeSemesterTA(daftar), P = (sz, extra = "") => `margin:0;text-align:center;font-family:'Times New Roman',serif;font-size:${sz}pt;${extra}`;
  return `
    <p style="${P(22, "font-weight:bold;margin-top:24pt;")}">JURNAL PEMBELAJARAN</p>
    <p style="${P(16, "font-weight:bold;")}">${escapeHtml(tk.lembaga)}</p>
    <p style="${P(16)}">${escapeHtml(tk.unit)}</p>
    <p style="${P(18, "margin:22pt 0;")}">${adaLogo ? `<img src="file:///C:/je-logo.png" width="159" height="159" style="width:4.2cm;height:4.2cm;">` : ""}</p>
    <p style="${P(18, "font-weight:bold;margin-bottom:22pt;")}">${_jeLabelBulan(dari, sampai)}</p>
    <table style="border:none;margin:0 auto;width:auto;" cellpadding="0" cellspacing="0" align="center">
      ${[["Nama Guru", _jeNamaGuru()], ["Semester", st.semester], ["Tahun Ajaran", st.ta]].map(([k, v]) => `<tr><td style="border:none;padding:2pt 6pt;font-size:14pt;font-family:'Times New Roman',serif;">${k}</td><td style="border:none;padding:2pt 4pt;font-size:14pt;">:</td><td style="border:none;padding:2pt 6pt;font-size:14pt;font-family:'Times New Roman',serif;">${escapeHtml(v)}</td></tr>`).join("")}
    </table>
    <p style="${P(18, "margin-top:48pt;")}">${escapeHtml(tk.yayasan)}</p>
    <p style="${P(10)}">${escapeHtml(tk.alamat)}</p>
    <p style="${P(9)}">${escapeHtml(tk.provinsi)}</p>`;
}
const JE_GANTI_HALAMAN = `<br clear="all" style="mso-special-character:line-break;page-break-before:always">`;

async function eksporJurnalGabungan() {
  let dari = qs("je-dari").value, sampai = qs("je-sampai").value;
  if (!dari || !sampai) { toast("Pilih bulan dulu", "err"); return; }
  if (sampai < dari) [dari, sampai] = [sampai, dari];
  const daftar = _jeDaftarBulan(dari, sampai), tk = _jeIsianTeks(), sampul = qs("je-sampul").checked;
  const tb = qs("je-ok"); tb.disabled = true; tb.textContent = "⏳ Menyusun jurnal…";
  try {
    const guruId = isAdmin() ? (qs("jg-guru").value || null) : (STATE.guruId || null);
    const mapelId = qs("jg-mapel")?.value || "";
    const bagian = [];
    for (const b of daftar) {
      tb.textContent = `⏳ Mengambil jurnal ${namaBulanIndo(b)}…`;
      let data = await apiGetJurnalBulanan(guruId, b);
      if (mapelId) data = data.filter((j) => j.mapel_id === mapelId);
      if (data.length) bagian.push(_htmlJurnalBulan(data, b));
    }
    if (!bagian.length) { toast("Tidak ada jurnal pada bulan yang dipilih", "err"); tb.disabled = false; tb.textContent = "📤 Ekspor Word"; return; }
    const logo = sampul ? await _jeLogoPng() : null;
    const isi = (sampul ? _jeSampulHtml(dari, sampai, daftar, tk, !!logo) + JE_GANTI_HALAMAN : "") + bagian.join(JE_GANTI_HALAMAN);
    const nama = `Jurnal_${_jeNamaGuru().split(",")[0].replace(/\s+/g, "_")}_${dari}${sampai !== dari ? "_sd_" + sampai : ""}`;
    _jeSimpanWordMht("Jurnal Kegiatan Pembelajaran", isi, nama, logo);
    toast(`📤 Jurnal ${daftar.length > 1 ? daftar.length + " bulan " : ""}diekspor${bagian.length < daftar.length ? ` (${daftar.length - bagian.length} bulan tanpa jurnal dilewati)` : ""}`, "ok");
    closeModal();
  } catch (e) { console.error(e); toast("Gagal mengekspor: " + e.message, "err"); tb.disabled = false; tb.textContent = "📤 Ekspor Word"; }
}

// Word "Web Archive" (MHT) berekstensi .doc — dibuka Word seperti dokumen biasa, gambar ikut tertanam.
function _jeSimpanWordMht(judul, isiHtml, namaFile, logoBase64) {
  const batas = "----=_BatasJurnal_" + Date.now().toString(36);
  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><title>${escapeHtml(judul)}</title>
<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom><w:DoNotOptimizeForBrowser/></w:WordDocument></xml><![endif]-->
<style>
  @page Section1{size:29.7cm 21cm;mso-page-orientation:landscape;margin:2cm;}
  div.Section1{page:Section1;}
  body{font-family:'Times New Roman',serif;font-size:12pt;}
  table{border-collapse:collapse;width:100%;mso-table-lspace:0pt;mso-table-rspace:0pt;}
  td,th{border:1px solid #555;padding:5px;font-size:10.5pt;vertical-align:middle;}
  th{background:#D9E1F2;font-weight:bold;text-align:center;}
</style></head><body><div class="Section1">${isiHtml}</div></body></html>`;
  const b64 = (str) => { const bytes = new TextEncoder().encode(str); let bin = ""; for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000)); return btoa(bin).replace(/.{76}/g, "$&\r\n"); };
  let mht = `MIME-Version: 1.0\r\nContent-Type: multipart/related; boundary="${batas}"; type="text/html"\r\n\r\n`
    + `--${batas}\r\nContent-Location: file:///C:/jurnal.htm\r\nContent-Transfer-Encoding: base64\r\nContent-Type: text/html; charset="utf-8"\r\n\r\n${b64(html)}\r\n\r\n`;
  if (logoBase64) mht += `--${batas}\r\nContent-Location: file:///C:/je-logo.png\r\nContent-Transfer-Encoding: base64\r\nContent-Type: image/png\r\n\r\n${logoBase64.replace(/.{76}/g, "$&\r\n")}\r\n\r\n`;
  mht += `--${batas}--\r\n`;
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([mht], { type: "application/msword" }));
  a.download = namaFile.endsWith(".doc") ? namaFile : namaFile + ".doc";
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 3000);
}

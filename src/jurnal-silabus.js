// ============================================================
//  📓 JURNAL ↔ SILABUS — isian jurnal terarah dari Silabus & Prosem
//  • Jenis pertemuan: Materi Baru · Mengulang · Penugasan · Ulangan Harian · UTS · UAS · Lainnya
//  • Pilih Bab (dari silabus kelas & mapel itu) lalu Sub-bab → kolom Materi Pokok terisi otomatis dengan format baku:
//      "Bab 2 Bilangan Rasional: B. Penjumlahan Pecahan; C. Pengurangan Pecahan"
//      "Mengulang Bab 2 Bilangan Rasional: B. Penjumlahan Pecahan"      (otomatis bila sama dengan jurnal sebelumnya)
//      "Penugasan Bab 2 Bilangan Rasional: B. …"   ·   "Ulangan Harian Bab 2 Bilangan Rasional"   ·   "UTS Bab 1–3"
//  • Metode mengajar: minimal 1, maksimal 2.
//  • Keterangan (Kegiatan Pembelajaran) diringkas: satu kalimat padat sesuai jenis pertemuan → hemat kertas saat dicetak.
// ============================================================
const JS = { bab: [], sem: "", tp: "", jenis: "materi", babId: "", babAkhir: "", sub: [], lalu: null, aktif: false, otomatisUlang: false };
const JS_JENIS = [["materi", "📖 Materi Baru"], ["ulang", "🔁 Mengulang"], ["tugas", "📝 Penugasan"], ["uh", "✅ Ulangan Harian"], ["uts", "🗂️ UTS"], ["uas", "🏁 UAS"], ["lain", "✏️ Lainnya"]];
const _jsE = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const _jsTP = (t) => { const d = new Date((t || "") + "T00:00:00"), y = isNaN(d) ? new Date().getFullYear() : d.getFullYear(), m = isNaN(d) ? new Date().getMonth() : d.getMonth(); return m >= 6 ? `${y}/${y + 1}` : `${y - 1}/${y}`; };
const _jsSem = (t) => { const d = new Date((t || "") + "T00:00:00"); return (isNaN(d) ? new Date() : d).getMonth() >= 6 ? "ganjil" : "genap"; };
const _jsNamaBab = (b) => `Bab ${b.no}${b.judul ? " " + b.judul : ""}`;

async function _jsMuatBab(kelasId, mapelId, tanggal) {
  JS.tp = _jsTP(tanggal); JS.sem = _jsSem(tanggal);
  let d = null;
  try { const v = await _kvAmbil(`silabus:${JS.tp}:${kelasId}`, {}); d = v && v[mapelId]; } catch (e) {}
  if (!d || !d.bab || !Object.keys(d.bab).length) {
    const kls = ((LOOKUP.kelas || []).find((k) => k.id === kelasId) || {}).nama_kelas, mp = ((LOOKUP.mapel || []).find((m) => m.id === mapelId) || {}).nama_mapel;
    d = typeof _spDariBawaan === "function" ? _spDariBawaan(kls, mp) : null;
  }
  JS.bab = Object.entries((d && d.bab) || {}).filter(([, b]) => b && !b.dihapus && (b.judul || "").trim()).map(([id, b]) => ({ id, ...b, sub: b.sub || [] }))
    .sort((a, b) => (a.sem === b.sem ? 0 : a.sem === "ganjil" ? -1 : 1) || (a.u ?? 0) - (b.u ?? 0) || a.no - b.no);
}
// baca materi jurnal berformat baku → {jenis, bab, babAkhir, sub[]}
function _jsUrai(materi) {
  const m = String(materi || "").trim(); if (!m) return null;
  let x;
  if ((x = m.match(/^(UTS|UAS)\s+Bab\s+(\d+)\s*[–-]\s*(\d+)/i))) return { jenis: x[1].toLowerCase(), no: +x[2], noAkhir: +x[3], sub: [] };
  if ((x = m.match(/^Ulangan Harian\s+Bab\s+(\d+)/i))) return { jenis: "uh", no: +x[1], sub: [] };
  if ((x = m.match(/^(?:(Mengulang|Penugasan|Lanjutan:?)\s+)?Bab\s+(\d+)[^:]*(?::\s*(.+))?$/i))) {
    const j = /^mengulang/i.test(x[1] || "") ? "ulang" : /^penugasan/i.test(x[1] || "") ? "tugas" : "materi";
    return { jenis: j, no: +x[2], sub: (x[3] || "").split(/\s*;\s*/).map((s) => s.trim()).filter(Boolean) };
  }
  return null;
}
function _jsBabDariNo(no) { const s = JS.bab.filter((b) => b.sem === JS.sem && Number(b.no) === Number(no)); return (s[0] || JS.bab.find((b) => Number(b.no) === Number(no)) || {}).id || ""; }
// susun teks materi pokok
function _jsTeks() {
  const b = JS.bab.find((x) => x.id === JS.babId);
  if (JS.jenis === "lain") return null;
  if (JS.jenis === "uts" || JS.jenis === "uas") {
    const a = JS.bab.find((x) => x.id === JS.babId), z = JS.bab.find((x) => x.id === JS.babAkhir) || a;
    return a ? `${JS.jenis.toUpperCase()} Bab ${a.no}–${z.no}` : "";
  }
  if (!b) return "";
  if (JS.jenis === "uh") return `Ulangan Harian ${_jsNamaBab(b)}`;
  const awal = JS.jenis === "ulang" ? "Mengulang " : JS.jenis === "tugas" ? "Penugasan " : "";
  return `${awal}${_jsNamaBab(b)}${JS.sub.length ? ": " + JS.sub.join("; ") : ""}`;
}
function _jsTulis() {
  const t = _jsTeks(), ta = qs("jurnal-materi"); if (t == null || !ta || !JS.bab.length) return;
  ta.value = t; ta.dispatchEvent(new Event("input"));
  const pv = qs("js-pratinjau"); if (pv) pv.innerHTML = t ? `Tercatat di jurnal: <b>${_jsE(t)}</b>` : "";
}
// sama persis dengan jurnal sebelumnya → otomatis "Mengulang"
function _jsCekUlang() {
  if (!JS.lalu || !["materi", "ulang"].includes(JS.jenis)) return;
  const u = _jsUrai(JS.lalu.materi_pokok), b = JS.bab.find((x) => x.id === JS.babId);
  const sama = u && b && ["materi", "ulang"].includes(u.jenis) && Number(u.no) === Number(b.no) && JS.sub.length && JS.sub.length === u.sub.length && JS.sub.every((s) => u.sub.includes(s));
  if (sama && JS.jenis === "materi") { JS.jenis = "ulang"; JS.otomatisUlang = true; }
  else if (!sama && JS.jenis === "ulang" && JS.otomatisUlang) { JS.jenis = "materi"; JS.otomatisUlang = false; }
}
function _jsGambar() {
  const w = qs("js-panel"); if (!w) return;
  const butuhBab = JS.jenis !== "lain", rentang = JS.jenis === "uts" || JS.jenis === "uas", pakaiSub = ["materi", "ulang", "tugas"].includes(JS.jenis);
  const opsi = (pilih) => ["ganjil", "genap"].map((s) => { const d = JS.bab.filter((b) => b.sem === s); return d.length ? `<optgroup label="Semester ${s === "ganjil" ? "Ganjil" : "Genap"}${s === JS.sem ? " (sekarang)" : ""}">${d.map((b) => `<option value="${b.id}" ${b.id === pilih ? "selected" : ""}>${_jsE((b.buku ? b.buku + " · " : "") + _jsNamaBab(b))}</option>`).join("")}</optgroup>` : ""; }).join("");
  const b = JS.bab.find((x) => x.id === JS.babId);
  w.innerHTML = `<div class="js-jenis">${JS_JENIS.map(([k, l]) => `<button type="button" class="${k === JS.jenis ? "on" : ""}" onclick="jsJenis('${k}')">${l}</button>`).join("")}</div>
    ${!JS.bab.length && butuhBab ? `<div class="js-catat">Silabus mapel ini belum diisi — tulis materi langsung di kolom Materi Pokok. (Penyelenggara/Admin dapat mengisinya di menu Silabus & Prosem.)</div>` : ""}
    ${butuhBab && JS.bab.length ? `<div class="js-baris"><label>${rentang ? "Dari Bab" : "Bab"}<select class="input" onchange="jsBab(this.value)"><option value="">— Pilih Bab —</option>${opsi(JS.babId)}</select></label>
      ${rentang ? `<label>Sampai Bab<select class="input" onchange="JS.babAkhir=this.value;_jsTulis()"><option value="">— Pilih Bab —</option>${opsi(JS.babAkhir)}</select></label>` : ""}</div>` : ""}
    ${pakaiSub && b ? (b.sub.length ? `<div class="js-sub"><span>Sub-bab yang dibahas${JS.jenis === "tugas" ? " / ditugaskan" : ""}:</span>${b.sub.map((s, i) => `<label class="${JS.sub.includes(s) ? "on" : ""}"><input type="checkbox" ${JS.sub.includes(s) ? "checked" : ""} onchange="jsSub(${i},this.checked)">${_jsE(s)}</label>`).join("")}</div>` : `<div class="js-catat">Sub-bab untuk bab ini belum diisi di Silabus — boleh tambahkan rinciannya di kolom Materi Pokok setelah tanda titik dua.</div>`) : ""}
    ${JS.jenis === "ulang" && JS.otomatisUlang ? `<div class="js-catat biru">🔁 Sama dengan jurnal sebelumnya (${_jsE(String(JS.lalu.materi_pokok).slice(0, 90))}) — dicatat sebagai <b>Mengulang</b>.</div>` : ""}
    <div id="js-pratinjau" class="js-pratinjau"></div>`;
  _jsTulis();
}
function jsJenis(k) { JS.jenis = k; JS.otomatisUlang = false; if (k === "uh" || k === "uts" || k === "uas") JS.sub = []; if (k === "lain") { const ta = qs("jurnal-materi"); if (ta && _jsUrai(ta.value)) ta.value = ""; } _jsGambar(); if (k === "lain") qs("jurnal-materi")?.focus(); }
function jsBab(id) { JS.babId = id; JS.sub = []; if (!JS.babAkhir) JS.babAkhir = id; _jsGambar(); }
function jsSub(i, on) { const b = JS.bab.find((x) => x.id === JS.babId); if (!b) return; const s = b.sub[i]; JS.sub = on ? [...new Set([...JS.sub, s])] : JS.sub.filter((x) => x !== s); JS.sub.sort((a, c) => b.sub.indexOf(a) - b.sub.indexOf(c)); _jsCekUlang(); _jsGambar(); }

async function _jsPasang(opts) {
  const ta = qs("jurnal-materi"); if (!ta || qs("js-panel")) return;
  Object.assign(JS, { bab: [], jenis: "materi", babId: "", babAkhir: "", sub: [], lalu: null, otomatisUlang: false, aktif: true });
  ta.closest(".field").insertAdjacentHTML("beforebegin", `<div class="field js-kotak"><label class="form-label">📘 Materi dari Silabus</label><div id="js-panel"><small class="js-catat">Memuat silabus…</small></div></div>`);
  const lbl = ta.closest(".field").querySelector(".form-label"); if (lbl) lbl.textContent = "Materi Pokok (terisi otomatis, boleh ditambah)";
  const lm = document.querySelector(".methods-dropdown .form-label"); if (lm) lm.textContent = "Metode Mengajar (pilih 1–2)";
  try {
    await _jsMuatBab(opts.kelasId, opts.mapelId, opts.tanggal);
    try { JS.lalu = typeof apiGetJurnalTerakhir === "function" ? await apiGetJurnalTerakhir(STATE.guruId, opts.kelasId, opts.mapelId, opts.tanggal) : null; } catch (e) {}
    // jurnal lama (diedit) → pilihan mengikuti isinya
    const u = _jsUrai(ta.value);
    if (u) { JS.jenis = u.jenis; JS.babId = _jsBabDariNo(u.no); JS.babAkhir = u.noAkhir ? _jsBabDariNo(u.noAkhir) : JS.babId; const b = JS.bab.find((x) => x.id === JS.babId); JS.sub = b ? u.sub.filter((s) => b.sub.includes(s)) : []; }
    else if (ta.value.trim()) JS.jenis = "lain";
    else if (JS.lalu) { const l = _jsUrai(JS.lalu.materi_pokok); if (l && l.no) JS.babId = _jsBabDariNo(l.no); } // lanjut dari bab terakhir
  } catch (e) { console.warn("Jurnal-silabus:", e); }
  if (!qs("js-panel")) return;
  if (JS.jenis !== "lain" && !_jsUrai(ta.value) && !JS.babId) { qs("js-pratinjau") && (qs("js-pratinjau").innerHTML = ""); }
  const simpan = ta.value; _jsGambar(); if (!JS.babId && JS.jenis !== "lain") ta.value = simpan; // jangan kosongkan isian yang sudah ada
}

// ── Keterangan ringkas (Kegiatan Pembelajaran) ──
const _jsDaftar = (a) => (a.length <= 1 ? a.join("") : `${a.slice(0, -1).join(", ")} dan ${a[a.length - 1]}`);
const _jsTanpaHuruf = (s) => String(s).replace(/^([A-Za-z]|\d{1,2})[.)]\s+/, "").trim();
function _jsKeterangan(materi, metode) {
  const u = _jsUrai(materi); if (!u) return null;
  const keg = [...new Set((metode || []).map((m) => (typeof _KEGIATAN_METODE !== "undefined" && _KEGIATAN_METODE[String(m).toLowerCase().trim()]) || String(m).toLowerCase().trim()))];
  const lewat = keg.length ? ` melalui ${_jsDaftar(keg)}` : "";
  const sub = u.sub.map(_jsTanpaHuruf);
  const objek = sub.length ? (sub.length <= 3 ? _jsDaftar(sub) : `${sub.length} sub-bab`) : "materi bab ini";
  if (u.jenis === "uts" || u.jenis === "uas") return `Santri mengerjakan ${u.jenis.toUpperCase()} Bab ${u.no}–${u.noAkhir} secara tertib.`;
  if (u.jenis === "uh") return `Santri mengerjakan ulangan harian Bab ${u.no} untuk mengukur ketuntasan.`;
  if (u.jenis === "tugas") return `Santri mengerjakan tugas tentang ${objek}.`;
  if (u.jenis === "ulang") return `Mengulang ${objek} agar santri lebih paham${lewat}.`;
  return `Membahas ${objek}${lewat}.`;
}

// ── pemasangan ──
(function () {
  if (typeof bukaFormJurnalUnified === "function") {
    const a = bukaFormJurnalUnified;
    bukaFormJurnalUnified = async function (opts) { const r = await a.apply(this, arguments); try { await _jsPasang(opts || {}); } catch (e) { console.warn(e); } return r; };
  }
  if (typeof onToggleMetode === "function") {
    const a = onToggleMetode;
    onToggleMetode = function (nama, checked) {
      if (checked && JURNAL_CTX && (JURNAL_CTX.metodeTerpilih || []).length >= 2 && !JURNAL_CTX.metodeTerpilih.includes(nama)) {
        const cb = [...document.querySelectorAll("#metode-panel input")].find((x) => x.value === nama); if (cb) cb.checked = false;
        toast("Metode mengajar maksimal 2 — hapus salah satu dulu", "warn"); return;
      }
      return a.apply(this, arguments);
    };
  }
  if (typeof submitJurnal === "function") {
    const a = submitJurnal;
    submitJurnal = async function () {
      if (JURNAL_CTX && (JURNAL_CTX.metodeTerpilih || []).length > 2) { toast("Metode mengajar maksimal 2", "err"); return; }
      if (qs("js-panel") && JS.bab.length && JS.jenis !== "lain") {
        if (!JS.babId) { toast("Pilih Bab dulu (atau pilih ✏️ Lainnya bila di luar silabus)", "err"); return; }
        if ((JS.jenis === "uts" || JS.jenis === "uas") && !JS.babAkhir) { toast("Pilih sampai bab berapa", "err"); return; }
        const b = JS.bab.find((x) => x.id === JS.babId);
        if (["materi", "ulang", "tugas"].includes(JS.jenis) && b && b.sub.length && !JS.sub.length) { toast("Pilih sub-bab yang dibahas", "err"); return; }
      }
      return a.apply(this, arguments);
    };
  }
  if (typeof buatDeskripsiOtomatis === "function") {
    const a = buatDeskripsiOtomatis;
    buatDeskripsiOtomatis = function (materi, metode) { try { const k = _jsKeterangan(materi, metode); if (k) return k; } catch (e) {} return a.apply(this, arguments); };
  }
})();

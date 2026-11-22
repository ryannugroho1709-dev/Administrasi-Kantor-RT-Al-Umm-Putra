// ============================================================
//  UJIAN ONLINE — SALIN BANK SOAL KE KELAS LAIN
//  Contoh: UAS Sosiologi Kelas 10 sudah ada → salin menjadi UAS Sosiologi Kelas 11 (soal & kunci sama).
//  Salinan berdiri sendiri: kalau soal kelas 11 diubah, soal kelas 10 tidak ikut berubah.
//  Kunci jawaban diambil & disimpan lewat RPC berpin (ujian_kunci_ambil → ujian_bank_simpan),
//  jenis nilai (UAS/UTS/UH ke-…) & "Untuk Mapel" (mis. Sosiologi) ikut disalin.
// ============================================================
function _ujsTingkatAda() {
  const ada = new Set();
  (LOOKUP.kelas || []).forEach((k) => { const n = parseInt(String(k.nama_kelas || "").replace(/\D/g, ""), 10); if (n) ada.add(n); });
  return [...ada].sort((a, b) => a - b).map(String);
}
function ujSalinKeKelas(bankId) {
  const b = (UJ.bank || []).find((x) => x.id === bankId); if (!b) return;
  if (!_ujBolehKelola(b)) { _ujTolakBukanMilik(b); return; }
  const asal = String(b.tingkat || "");
  const sudah = new Set((UJ.bank || []).filter((x) => x.id !== b.id && x.mapel_id === b.mapel_id && _ujNamaMapelTampil(x) === _ujNamaMapelTampil(b) && _ujLabelJenis(x) === _ujLabelJenis(b)).map((x) => String(x.tingkat)));
  const pilihan = _ujsTingkatAda().filter((t) => t !== asal);
  openModal(`<h3>📑 Salin Soal ke Kelas Lain</h3>
    <div class="uj-sub" style="margin:-4px 0 12px"><b>${escapeHtml(b.judul)}</b> · Kelas ${escapeHtml(asal)} · ${_ujJumlahSoal(b.soal)} soal · ${escapeHtml(_ujLabelJenis(b))}</div>
    <div class="field"><label class="form-label">Salin untuk Kelas</label>
      <div class="ujs-kelas">${pilihan.map((t) => `<label class="ujs-pil ${sudah.has(t) ? "ada" : ""}"><input type="checkbox" value="${t}" ${String(+asal + 1) === t && !sudah.has(t) ? "checked" : ""}><span>Kelas ${t}</span>${sudah.has(t) ? `<small>sudah ada</small>` : ""}</label>`).join("")}</div></div>
    <div class="ujs-catatan">✔️ Soal, pilihan jawaban, gambar & <b>kunci jawaban</b> disalin sama persis.<br>✔️ Jenis nilai (${escapeHtml(_ujLabelJenis(b))}) & mapelnya ikut.<br>✔️ Judul otomatis berganti kelas, misalnya "Kelas ${escapeHtml(asal)}" → "Kelas 11".<br>ℹ️ Salinan berdiri sendiri — mengubah soal di satu kelas tidak mengubah kelas lainnya.</div>
    <button class="btn btn-accent" style="width:100%;margin-top:12px" id="ujs-ok">📑 Salin Sekarang</button>`);
  qs("ujs-ok").onclick = () => _ujsJalankan(b);
}
async function _ujsJalankan(b) {
  const tujuan = [...document.querySelectorAll(".ujs-kelas input:checked")].map((i) => i.value);
  if (!tujuan.length) { toast("Pilih minimal satu kelas tujuan", "err"); return; }
  const tombol = qs("ujs-ok"); tombol.disabled = true; tombol.textContent = "Menyalin…";
  try {
    const pin = await _ujPin("PIN untuk menyalin soal & kunci"); if (!pin) { tombol.disabled = false; tombol.textContent = "📑 Salin Sekarang"; return; }
    const kunci = await _ujRpc("ujian_kunci_ambil", { p_pin: pin, p_bank: b.id });
    const info = (UJ.jenisNilai || {})[b.id] || _ujJenisNilai(b);
    const asal = String(b.tingkat || "");
    for (const t of tujuan) {
      const judul = /kelas\s*\d+/i.test(b.judul) ? b.judul.replace(/kelas\s*\d+/i, (m) => m.replace(/\d+/, t)) : `${b.judul} (Kelas ${t})`;
      const kode = (String(b.kode || "soal").replace(new RegExp("-" + asal + "(?=-|$)"), "-" + t) + "-" + Math.random().toString(36).slice(2, 6)).slice(0, 80);
      const idBaru = await _ujRpc("ujian_bank_simpan", { p_pin: pin, p_kode: kode, p_mapel_id: b.mapel_id, p_tingkat: t, p_bab: b.bab || 1, p_judul: judul, p_soal: b.soal, p_kunci: kunci, p_skor_maksimal: b.skor_maksimal || 100, p_guru: STATE.guruId || null });
      if (idBaru && info && info.jenis) await _ujSimpanJenis(idBaru, info.jenis, info.ke || b.bab || 1, { mapel_id: b.mapel_id, tingkat: t, guru_id: STATE.guruId || null, ...(info.sub ? { sub: info.sub } : {}) });
    }
    closeModal();
    toast(`Soal disalin ke Kelas ${tujuan.join(", ")} ✓${info && info.jenis === "uas" ? " — otomatis tercatat di Pengumpulan Soal" : ""}`, "ok");
    ujMuat();
  } catch (e) { toast(_ujPesan(e), "err"); tombol.disabled = false; tombol.textContent = "📑 Salin Sekarang"; }
}
// Tombol "📑 Salin" di setiap kartu bank soal (hanya bila boleh mengelola)
(function () {
  const asli = window._ujGambarBank; if (typeof asli !== "function") return;
  window._ujGambarBank = function () {
    const h = asli.apply(this, arguments);
    document.querySelectorAll("#uj-bank .uj-item").forEach((it) => {
      if (it.querySelector(".uj-b-salin")) return;
      const m = /ujBukaSesiModal\('([^']+)'\)/.exec(it.innerHTML); if (!m) return;
      const b = (UJ.bank || []).find((x) => x.id === m[1]); if (!b || !_ujBolehKelola(b)) return;
      const uji = it.querySelector(".uj-b-hijau");
      const tb = document.createElement("button");
      tb.className = "btn btn-sm uj-b-salin"; tb.title = "Salin soal ini (beserta kunci) untuk kelas lain"; tb.innerHTML = "📑 Salin";
      tb.onclick = () => ujSalinKeKelas(b.id);
      if (uji) uji.after(tb); else it.querySelector(".uj-aksi")?.appendChild(tb);
    });
    return h;
  };
})();

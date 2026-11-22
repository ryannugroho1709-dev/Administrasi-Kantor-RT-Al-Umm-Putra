// ============================================================
//  UJIAN ONLINE — SATU BANK SOAL UNTUK BANYAK KELAS
//  Contoh: UAS Sosiologi dibuat untuk Kelas 10 → centang juga Kelas 11. Soalnya TETAP SATU (tidak
//  digandakan): diubah sekali, berlaku untuk semua kelas. Saat ujian, guru membuka sesi untuk tiap kelas
//  (nilai tercatat per kelas seperti biasa), dan Pengumpulan Soal kelas 11 otomatis tercentang.
//  Kelas tambahan disimpan di kv "ujian:jenis" → { [bankId]: { kelasLain: ["11"] } } (digabung, tidak menimpa).
// ============================================================
function _ujkTingkatAda() {
  const ada = new Set();
  (LOOKUP.kelas || []).forEach((k) => { const n = parseInt(String(k.nama_kelas || "").replace(/\D/g, ""), 10); if (n) ada.add(String(n)); });
  return [...ada].sort((a, b) => +a - +b);
}
function ujAturKelasBank(bankId) {
  const b = (UJ.bank || []).find((x) => x.id === bankId); if (!b) return;
  if (!_ujBolehKelola(b)) { _ujTolakBukanMilik(b); return; }
  const utama = String(b.tingkat || "").replace(/\D/g, ""), dipakai = _ujTingkatBank(b);
  openModal(`<h3>🏫 Kelas yang Memakai Soal Ini</h3>
    <div class="ujk-soal"><span>📘</span><div><small>Soal yang diatur</small><b>${escapeHtml(b.judul)}</b><em>${escapeHtml(_ujNamaMapelTampil(b))} · ${_ujJumlahSoal(b.soal)} soal · ${escapeHtml(_ujLabelJenis(b))}</em></div></div>
    <div class="form-label" style="margin:2px 0 6px">Centang kelas lain yang juga mengerjakan soal ini:</div>
    <div class="ujs-kelas">${_ujkTingkatAda().map((t) => `<label class="ujs-pil ${t === utama ? "utama" : ""}"><input type="checkbox" value="${t}" ${dipakai.includes(t) ? "checked" : ""} ${t === utama ? "disabled" : ""}><span>Kelas ${t}</span>${t === utama ? "<small>kelas utama</small>" : ""}</label>`).join("")}</div>
    <div class="ujs-catatan" style="margin-top:12px">✔️ Soalnya <b>tetap satu</b> — tidak digandakan. Ubah soal/kunci sekali, berlaku untuk semua kelas yang dicentang.<br>✔️ Saat ujian, tekan <b>▶ Buka sesi</b> lalu pilih kelasnya (buka satu sesi untuk tiap kelas). Nilai tetap tercatat per kelas.<br>✔️ Pengumpulan Soal di Jadwal Ujian otomatis tercentang untuk kelas yang dicentang.</div>
    <button class="btn btn-accent" style="width:100%;margin-top:12px" id="ujk-ok">💾 Simpan</button>`);
  qs("ujk-ok").onclick = async () => {
    const kelasLain = [...document.querySelectorAll(".ujs-kelas input:checked:not(:disabled)")].map((i) => i.value);
    const tombol = qs("ujk-ok"); tombol.disabled = true; tombol.textContent = "Menyimpan…";
    try {
      UJ.jenisNilai = await _kvGabung("ujian:jenis", { [b.id]: { kelasLain, t: new Date().toISOString() } });
      if (typeof UA !== "undefined") UA.jenis = UJ.jenisNilai;
      if (typeof _SW_DASBOR !== "undefined") _SW_DASBOR.t = 0; // kartu "Kumpulkan Soal" di Dashboard langsung diperbarui
      closeModal();
      toast(kelasLain.length ? `Soal ini sekarang dipakai Kelas ${[utama, ...kelasLain].join(" & ")} ✓` : `Soal ini hanya untuk Kelas ${utama}`, "ok");
      _ujGambarBank();
    } catch (e) { toast(_ujPesan(e), "err"); tombol.disabled = false; tombol.textContent = "💾 Simpan"; }
  };
}
// Tombol "🏫 Kelas" di setiap kartu bank soal (hanya bila boleh mengelola)
(function () {
  const asli = window._ujGambarBank; if (typeof asli !== "function") return;
  window._ujGambarBank = function () {
    const h = asli.apply(this, arguments);
    document.querySelectorAll("#uj-bank .uj-item").forEach((it) => {
      if (it.querySelector(".uj-b-kelas")) return;
      const m = /ujBukaSesiModal\('([^']+)'\)/.exec(it.innerHTML); if (!m) return;
      const b = (UJ.bank || []).find((x) => x.id === m[1]); if (!b || !_ujBolehKelola(b)) return;
      const n = _ujTingkatBank(b).length;
      const tb = document.createElement("button");
      tb.className = "btn btn-sm uj-b-kelas"; tb.title = "Pakai soal ini untuk beberapa kelas sekaligus (soal tetap satu)";
      tb.innerHTML = n > 1 ? `🏫 ${n} Kelas` : "🏫 Kelas";
      tb.onclick = () => ujAturKelasBank(b.id);
      const uji = it.querySelector(".uj-b-hijau");
      if (uji) uji.after(tb); else it.querySelector(".uj-aksi")?.appendChild(tb);
    });
    return h;
  };
})();

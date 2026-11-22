// ============================================================
//  KARTU BISA DILIPAT (buka/tutup) — terutama untuk HP agar tidak banyak menggulir
//  Jadwal Ujian: "Saya Mengawas", "Mapel Saya yang Diujikan", "Jadwal Lengkap".
//  Ketuk judul kartu → isi disembunyikan/ditampilkan. Di HP awalnya tertutup (kecuali Jadwal Lengkap),
//  di laptop awalnya terbuka. Pilihan terakhir diingat di perangkat. Saat tertutup, judul menampilkan
//  ringkasan jumlah (mis. "5 tugas · terdekat Rab, 2 Des") supaya tetap tahu isinya tanpa membuka.
// ============================================================
const LIPAT_KARTU = [
  { kartu: ".ju2-kolom[data-tur=ju-awas]", kunci: "awas", hitung: ".ju-tugas-baris", satuan: "tugas mengawas", hpTutup: true },
  { kartu: ".ju2-kolom[data-tur=ju-mapel]", kunci: "mapel", hitung: ".ju2-mapel", satuan: "mapel", hpTutup: true, belum: ".ju2-mapel:not(.ok)" },
  { kartu: ".ju2-papan", kunci: "papan", hitung: null, satuan: "", hpTutup: false },
];
const _lipatHp = () => window.matchMedia("(max-width:760px)").matches;
function _lipatLS(k, v) { try { if (v === undefined) return localStorage.getItem("lipat:" + k); localStorage.setItem("lipat:" + k, v ? "1" : "0"); } catch (e) { return null; } }

function _lipatPasang() {
  LIPAT_KARTU.forEach((c) => document.querySelectorAll(c.kartu).forEach((el) => {
    const kepala = el.querySelector(":scope > .ju2-kolom-h"); if (!kepala) return;
    if (!el.classList.contains("lipat-siap")) {
      el.classList.add("lipat-siap");
      const simpan = _lipatLS(c.kunci);
      const tutup = simpan == null ? _lipatHp() && c.hpTutup : simpan === "1";
      el.classList.toggle("terlipat", tutup);
      kepala.insertAdjacentHTML("beforeend", `<span class="lipat-ringkas"></span><button type="button" class="lipat-panah" aria-label="Buka/tutup">⌄</button>`);
      kepala.addEventListener("click", (e) => {
        if (e.target.closest("input,label,a,select,.btn") && !e.target.closest(".lipat-panah")) return;
        const t = !el.classList.contains("terlipat");
        el.classList.toggle("terlipat", t); _lipatLS(c.kunci, t);
      });
    }
    // ringkasan isi saat tertutup
    const r = el.querySelector(".lipat-ringkas");
    if (r && c.hitung) {
      const n = el.querySelectorAll(c.hitung).length, belum = c.belum ? el.querySelectorAll(c.belum).length : 0;
      const hari = el.querySelector(".ju2-hari:not(.lewat) .ju2-hari-h")?.textContent.replace("📍 ", "") || "";
      const teks = n ? `${n} ${c.satuan}${belum ? ` · ${belum} belum dikumpulkan` : ""}${hari && c.kunci === "awas" ? ` · terdekat ${hari}` : ""}` : "Kosong";
      if (r.textContent !== teks) r.textContent = teks; // hanya bila berubah (hindari putaran pengamat)
    }
  }));
}
(function () {
  let t = null;
  new MutationObserver(() => { clearTimeout(t); t = setTimeout(_lipatPasang, 60); }).observe(document.body, { childList: true, subtree: true });
})();

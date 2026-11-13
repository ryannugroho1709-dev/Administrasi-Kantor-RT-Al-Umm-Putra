// ============================================================
//  MODUL AJAR — URUTAN BUKU & SEMESTER
//  • Urutan bawaan di tiap rak: Semester Ganjil → Genap → lainnya, lalu nomor Bab (Bab 1, 2, 3 …).
//  • Admin bisa MENEKAN LAMA sampul buku (±0,5 detik) lalu menggesernya untuk mengubah urutan
//    (tersimpan di kolom modul_ajar.urutan, berlaku untuk semua guru).
//  • Semester buku: dibaca otomatis dari judul ("Semester 1"/"Ganjil" → Ganjil, "Semester 2"/"Genap" → Genap)
//    atau dipilih di form Unggah/Ubah. Disimpan per file di kuliah_pengaturan "modul:semester"
//    (satu file yang dipakai beberapa kelas cukup diatur sekali).
// ============================================================
const MAU = { sem: null, filter: (() => { try { return localStorage.getItem("maSemester") || ""; } catch (e) { return ""; } })() };

async function _maMuatSemester() {
  if (MAU.sem) return MAU.sem;
  try { MAU.sem = (await _kvAmbil("modul:semester", {})) || {}; } catch (e) { MAU.sem = {}; }
  return MAU.sem;
}
function _maSemester(m) {
  const atur = (MAU.sem || {})[m.file_url];
  if (atur) return atur;
  const j = String(m.judul || "").toLowerCase();
  if (/ganjil|semester\s*(1|i)\b|smt\s*1\b/.test(j)) return "Ganjil";
  if (/genap|semester\s*(2|ii)\b|smt\s*2\b/.test(j)) return "Genap";
  return "";
}
const _maBab = (m) => { const x = String(m.judul || "").match(/bab\s*(\d+)/i); return x ? parseInt(x[1], 10) : 999; };
function _maBandingBuku(a, b) {
  const ua = a.urutan, ub = b.urutan;
  if (ua != null && ub != null && ua !== ub) return ua - ub;
  if ((ua == null) !== (ub == null)) return ua == null ? 1 : -1;
  const rs = (m) => ({ Ganjil: 0, Genap: 1 }[_maSemester(m)] ?? 2);
  return rs(a) - rs(b) || _maBab(a) - _maBab(b) || String(a.judul || "").localeCompare(String(b.judul || ""), "id", { numeric: true });
}
function _maLolosFilterSemester(m) { const s = _maSemester(m); return !MAU.filter || !s || s === MAU.filter; }
function _maLabelSemester(m) { const s = _maSemester(m); return s ? `<span class="ma-sem ${s === "Ganjil" ? "ganjil" : "genap"}">${s}</span>` : ""; }
function ubahFilterSemesterModul(v) { MAU.filter = v; try { localStorage.setItem("maSemester", v); } catch (e) {} renderModulAjar(); }
function _maPilihSemesterHtml(prefix, nilai) {
  return `<div class="field"><label class="form-label">📅 Semester buku <span style="font-size:10.5px;color:var(--text-secondary);">(untuk buku umum yang dibagi Ganjil/Genap)</span></label>
    <select id="${prefix}-semester" class="input"><option value="">— Tidak dibagi semester —</option><option ${nilai === "Ganjil" ? "selected" : ""}>Ganjil</option><option ${nilai === "Genap" ? "selected" : ""}>Genap</option></select></div>`;
}
async function _maSimpanSemester(fileUrl, nilai) {
  if (!fileUrl) return;
  await _maMuatSemester();
  const lama = MAU.sem[fileUrl] || "";
  if (lama === (nilai || "")) return;
  const terbaru = (await _kvAmbil("modul:semester", {}).catch(() => ({}))) || {};
  if (nilai) terbaru[fileUrl] = nilai; else delete terbaru[fileUrl];
  await _kvSimpan("modul:semester", terbaru);
  MAU.sem = terbaru;
}

// ── Tekan lama lalu geser untuk mengubah urutan (khusus admin) ──
(function pasangGeserBuku() {
  let tekan = null, seret = null, telanKlik = false;
  const bolehAtur = () => typeof isAdmin === "function" && isAdmin();
  const akhiri = () => { clearTimeout(tekan?.t); tekan = null; };
  document.addEventListener("pointerdown", (e) => {
    const buku = e.target.closest && e.target.closest("#modul-ajar-rak .ma-book[data-id]");
    if (!buku || !bolehAtur() || e.button > 0 || e.target.closest("button")) return;
    tekan = { buku, x: e.clientX, y: e.clientY, id: e.pointerId, t: setTimeout(() => mulai(e), 450) };
  });
  document.addEventListener("pointermove", (e) => {
    if (tekan && !seret && Math.hypot(e.clientX - tekan.x, e.clientY - tekan.y) > 10) akhiri(); // bergeser sebelum waktunya = menggulir
    if (!seret) return;
    e.preventDefault();
    seret.bayang.style.transform = `translate(${e.clientX - seret.dx}px, ${e.clientY - seret.dy}px) rotate(3deg) scale(1.06)`;
    const bawah = document.elementFromPoint(e.clientX, e.clientY)?.closest(".ma-book[data-id]");
    if (bawah && bawah !== seret.buku && bawah.parentElement === seret.rak) {
      const r = bawah.getBoundingClientRect(), sebelum = e.clientX < r.left + r.width / 2;
      seret.rak.insertBefore(seret.buku, sebelum ? bawah : bawah.nextSibling);
    }
    // gulir otomatis bila mendekati tepi layar
    if (e.clientY < 80) window.scrollBy(0, -12); else if (e.clientY > innerHeight - 80) window.scrollBy(0, 12);
  }, { passive: false });
  document.addEventListener("touchmove", (e) => { if (seret) e.preventDefault(); }, { passive: false });
  const lepas = async () => {
    akhiri();
    if (!seret) return;
    const { buku, rak, bayang, awal } = seret; seret = null;
    telanKlik = true; setTimeout(() => { telanKlik = false; }, 400);
    bayang.remove(); buku.classList.remove("ma-diseret"); document.body.classList.remove("ma-sedang-geser");
    const urut = [...rak.querySelectorAll(".ma-book[data-id]")].map((x) => x.dataset.id);
    if (urut.join() === awal.join()) return;
    try {
      for (let i = 0; i < urut.length; i++) {
        const m = MODUL_AJAR_BUKU_CACHE.find((x) => x.id === urut[i]);
        if (m && m.urutan !== (i + 1) * 10) { await apiSimpanModulAjar({ id: urut[i], urutan: (i + 1) * 10 }); m.urutan = (i + 1) * 10; }
      }
      toast("📚 Urutan buku tersimpan", "ok");
    } catch (err) { toast("Gagal menyimpan urutan: " + (err.message || err), "err"); renderModulAjar(); }
  };
  document.addEventListener("pointerup", lepas);
  document.addEventListener("pointercancel", lepas);
  document.addEventListener("click", (e) => { if (telanKlik) { e.stopPropagation(); e.preventDefault(); telanKlik = false; } }, true);
  document.addEventListener("contextmenu", (e) => { if (e.target.closest && e.target.closest("#modul-ajar-rak .ma-book[data-id]") && bolehAtur()) e.preventDefault(); });
  function mulai(e) {
    if (!tekan) return;
    const buku = tekan.buku, rak = buku.parentElement, r = buku.getBoundingClientRect();
    const bayang = buku.cloneNode(true); bayang.classList.add("ma-bayang");
    Object.assign(bayang.style, { left: r.left + "px", top: r.top + "px", width: r.width + "px" });
    document.body.appendChild(bayang);
    seret = { buku, rak, bayang, dx: tekan.x - r.left, dy: tekan.y - r.top, awal: [...rak.querySelectorAll(".ma-book[data-id]")].map((x) => x.dataset.id) };
    bayang.style.transform = `translate(${tekan.x - seret.dx}px, ${tekan.y - seret.dy}px) rotate(3deg) scale(1.06)`;
    Object.assign(bayang.style, { left: "0", top: "0" });
    buku.classList.add("ma-diseret"); document.body.classList.add("ma-sedang-geser");
    try { navigator.vibrate?.(30); } catch (er) {}
    tekan = null;
  }
})();

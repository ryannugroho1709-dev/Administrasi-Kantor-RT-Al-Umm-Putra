// ============================================================
//  EKSKUL RAPOR — tampilan baru (satu santri & banyak santri)
//  • Pilihan kegiatan: katalog ekskul ruang ini (tabel ekskul_master) + pilihan awal
//    (Kelistrikan, Perkebunan, Canva, Khot, Teknisi Komputer dan Jaringan). Ekskul baru bisa ditambah
//    dan langsung tersimpan di katalog; pilihan awal masuk katalog saat pertama kali dipakai.
//  • Predikat → kalimat keterangan otomatis (bisa diubah). Santri yang sudah ikut ditandai & diperbarui.
// ============================================================
const EKW = { master: [], pilih: "", predikat: "Baik", ketManual: false, siswa: [], ada: [], ctx: null };
const EKW_AWAL = ["Kelistrikan", "Perkebunan", "Canva", "Khot", "Teknisi Komputer dan Jaringan"];
const EKW_PREDIKAT = {
  "Sangat Baik": { w: "#059669", t: (e) => `Sangat aktif dan bersemangat mengikuti kegiatan ${e}; menguasai keterampilan yang dilatihkan dengan sangat baik.` },
  "Baik": { w: "#2563eb", t: (e) => `Aktif mengikuti kegiatan ${e} dan menguasai keterampilan dasarnya dengan baik.` },
  "Cukup": { w: "#d97706", t: (e) => `Cukup aktif mengikuti kegiatan ${e}; perlu meningkatkan kehadiran dan keterampilan.` },
  "Perlu Bimbingan": { w: "#dc2626", t: (e) => `Perlu bimbingan dan motivasi agar lebih aktif mengikuti kegiatan ${e}.` },
};
const _ekwE = (s) => escapeHtml(String(s ?? ""));
function _ekwIkon(n) {
  const s = String(n).toLowerCase();
  return /listrik/.test(s) ? "⚡" : /kebun|tani|tanam/.test(s) ? "🌱" : /canva|desain|design|media kreatif/.test(s) ? "🎨" : /khot|khat|kaligrafi/.test(s) ? "✒️" : /komputer|jaringan|tkj|tik/.test(s) ? "🖥️"
    : /pramuka/.test(s) ? "⛺" : /panah|memanah/.test(s) ? "🏹" : /karate|silat|bela/.test(s) ? "🥋" : /boga|masak/.test(s) ? "🍳" : /jahit/.test(s) ? "🧵" : /olahraga|futsal|bola/.test(s) ? "⚽"
    : /kerajinan|prakarya/.test(s) ? "🧶" : /tahfi|quran|tilawah/.test(s) ? "📖" : /pidato|muhadhoroh|bahasa/.test(s) ? "🎤" : "🏅";
}
const _ekwSemua = () => { const ada = new Set(EKW.master.map((m) => m.nama_ekskul.toLowerCase())); return [...EKW.master.map((m) => ({ nama: m.nama_ekskul, id: m.id })), ...EKW_AWAL.filter((n) => !ada.has(n.toLowerCase())).map((nama) => ({ nama, awal: true }))]; };
async function _ekwMuatMaster() { try { EKW.master = await apiGetEkskulMaster(); } catch (e) { EKW.master = []; } if (typeof _RWK_MASTER !== "undefined") _RWK_MASTER = EKW.master; }

// ── Banyak santri ──
bukaEkskulMassal = async function (prefix) {
  document.querySelector(".ekw")?.remove();
  const kelasId = qs(prefix + "-kelas")?.value; if (!kelasId) { toast("Pilih kelas dulu", "err"); return; }
  const semester = qs(prefix + "-semester").value, tahun = qs(prefix + "-tahun").value;
  const [siswa] = await Promise.all([apiGetSiswaByKelas(kelasId), _ekwMuatMaster()]);
  EKW.ctx = { mode: "massal", prefix, kelasId, semester, tahun, kelas: (LOOKUP.kelas || []).find((k) => k.id === kelasId)?.nama_kelas || "" };
  EKW.siswa = siswa; EKW.ada = await apiGetEkstrakurikulerKelas(siswa.map((s) => s.id), semester, tahun).catch(() => []);
  EKW.pilih = ""; EKW.predikat = "Baik"; EKW.ketManual = false; EKW.cek = new Set(siswa.map((s) => s.id)); EKW.cari = "";
  _ekwGambar();
};
// ── Satu santri (dari Rapor Wali Kelas) ──
bukaFormEkstrakurikulerWK = async function (row, siswaId) {
  if (!RAPOR_WK_CACHE) return;
  document.querySelector(".ekw")?.remove();
  _EKSKUL_WK_CTX = { siswaId, semester: RAPOR_WK_CACHE.semester, tahun: RAPOR_WK_CACHE.tahun };
  await _ekwMuatMaster();
  const s = (RAPOR_WK_CACHE.siswaList || []).find((x) => x.id === siswaId);
  EKW.ctx = { mode: "satu", rowId: row?.id || "", siswaId, nama: s?.nama || "", semester: RAPOR_WK_CACHE.semester, tahun: RAPOR_WK_CACHE.tahun, kelas: RAPOR_WK_CACHE.kelasObj?.nama_kelas || "" };
  EKW.pilih = row?.nama_ekstrakurikuler || ""; EKW.ketAwal = row?.keterangan || "";
  EKW.predikat = Object.keys(EKW_PREDIKAT).find((p) => (row?.keterangan || "").startsWith(EKW_PREDIKAT[p].t(EKW.pilih).slice(0, 20))) || "Baik";
  EKW.ketManual = !!row?.keterangan;
  _ekwGambar();
};

function _ekwKetOtomatis() { return EKW.pilih ? EKW_PREDIKAT[EKW.predikat].t(EKW.pilih) : ""; }
function _ekwGambar() {
  const c = EKW.ctx, e = _ekwE, massal = c.mode === "massal";
  const ketLama = qs("ekw-ket")?.value; const ket = EKW.ketManual ? (ketLama ?? EKW.ketAwal ?? "") : _ekwKetOtomatis();
  const kartu = _ekwSemua().map((x) => `<button type="button" class="ekw-kartu ${x.nama === EKW.pilih ? "on" : ""}" onclick="_ekwPilih(this.dataset.n)" data-n="${e(x.nama)}">
      <span class="ekw-ik">${_ekwIkon(x.nama)}</span><b>${e(x.nama)}</b>${x.awal ? `<small>pilihan awal</small>` : `<i class="ekw-hapus" title="Hapus dari katalog" onclick="event.stopPropagation();_ekwHapusMaster('${x.id}')">×</i>`}</button>`).join("");
  const sudah = (id) => EKW.ada.find((a) => a.siswa_id === id && a.nama_ekstrakurikuler === EKW.pilih);
  const daftar = massal ? EKW.siswa.filter((s) => !EKW.cari || s.nama.toLowerCase().includes(EKW.cari.toLowerCase())) : [];
  const nCek = massal ? EKW.siswa.filter((s) => EKW.cek.has(s.id)).length : 1;
  const html = `<div class="ekw">
    <div class="ekw-hero"><span class="ekw-pil">🏃 Ekstrakurikuler</span><h3>${massal ? "Isi Ekskul untuk Banyak Santri" : e(c.nama)}</h3><p>${e(c.kelas)} · Semester ${e(c.semester)} ${e(c.tahun)}</p></div>
    <div class="ekw-langkah"><span>1</span><b>Pilih Kegiatan</b></div>
    <div class="ekw-grid">${kartu}</div>
    <div class="ekw-tambah"><input id="ekw-baru" class="input" placeholder="Ekskul lain? Ketik namanya, mis. Pramuka" onkeydown="if(event.key==='Enter'){event.preventDefault();_ekwTambah()}"><button class="btn btn-sm btn-accent" onclick="_ekwTambah()">＋ Tambah ke Katalog</button></div>
    <div class="ekw-langkah"><span>2</span><b>Predikat & Keterangan</b></div>
    <div class="ekw-pred">${Object.entries(EKW_PREDIKAT).map(([p, v]) => `<button type="button" class="${p === EKW.predikat ? "on" : ""}" style="--w:${v.w}" onclick="_ekwPredikat('${p}')">${e(p)}</button>`).join("")}</div>
    <textarea id="ekw-ket" class="input ekw-ket" rows="3" placeholder="${EKW.pilih ? "" : "Pilih kegiatan dulu — keterangan terisi otomatis"}" oninput="EKW.ketManual=true">${e(ket)}</textarea>
    <small class="ekw-kecil">Keterangan terisi otomatis sesuai predikat dan boleh diubah. Teks ini yang tercetak di rapor.</small>
    ${massal ? `<div class="ekw-langkah"><span>3</span><b>Santri</b><em>${nCek} dari ${EKW.siswa.length} dipilih</em></div>
    <div class="ekw-alat"><input class="input" placeholder="🔍 Cari nama" value="${e(EKW.cari)}" oninput="EKW.cari=this.value;_ekwGambarSantri()"><button class="btn btn-sm btn-outline" onclick="_ekwSemuaCek(true)">Pilih Semua</button><button class="btn btn-sm btn-outline" onclick="_ekwSemuaCek(false)">Kosongkan</button></div>
    <div class="ekw-santri" id="ekw-santri">${_ekwHtmlSantri(daftar, sudah)}</div>` : ""}
    <div class="ekw-kaki"><button class="btn btn-outline" onclick="closeModal()">Batal</button>
      <button class="btn btn-accent ekw-simpan" onclick="_ekwSimpan()" ${EKW.pilih ? "" : "disabled"}>💾 ${massal ? `Simpan untuk ${nCek} Santri` : "Simpan"}</button></div>
  </div>`;
  const lama = document.querySelector(".ekw");
  if (lama) { const wadah = lama.closest(".modal-panel, #modal-panel") || lama.parentElement, gulir = wadah.scrollTop; lama.outerHTML = html; wadah.scrollTop = gulir; }
  else openModal(html, { lebar: true });
}
function _ekwHtmlSantri(daftar, sudah) {
  return daftar.map((s) => { const on = EKW.cek.has(s.id), ad = EKW.pilih && sudah(s.id);
    return `<label class="ekw-s ${on ? "on" : ""}"><input type="checkbox" ${on ? "checked" : ""} onchange="_ekwCek('${s.id}',this.checked)"><span class="ekw-av">${_ekwE(String(s.nama).trim()[0] || "?")}</span><span class="ekw-nm">${_ekwE(s.nama)}</span>${ad ? `<em title="Sudah tercatat ikut — akan diperbarui">✓ sudah</em>` : ""}</label>`; }).join("") || `<div class="ekw-kecil">Tidak ada nama yang cocok.</div>`;
}
function _ekwGambarSantri() {
  const w = qs("ekw-santri"); if (!w) return;
  const sudah = (id) => EKW.ada.find((a) => a.siswa_id === id && a.nama_ekstrakurikuler === EKW.pilih);
  w.innerHTML = _ekwHtmlSantri(EKW.siswa.filter((s) => !EKW.cari || s.nama.toLowerCase().includes(EKW.cari.toLowerCase())), sudah);
  const n = EKW.siswa.filter((s) => EKW.cek.has(s.id)).length;
  const em = document.querySelector(".ekw-langkah em"); if (em) em.textContent = `${n} dari ${EKW.siswa.length} dipilih`;
  const b = document.querySelector(".ekw-simpan"); if (b) b.textContent = `💾 Simpan untuk ${n} Santri`;
}
function _ekwCek(id, v) { v ? EKW.cek.add(id) : EKW.cek.delete(id); _ekwGambarSantri(); }
function _ekwSemuaCek(v) { EKW.siswa.filter((s) => !EKW.cari || s.nama.toLowerCase().includes(EKW.cari.toLowerCase())).forEach((s) => (v ? EKW.cek.add(s.id) : EKW.cek.delete(s.id))); _ekwGambarSantri(); }
function _ekwPilih(n) { EKW.pilih = n; if (!EKW.ketManual) EKW.ketAwal = ""; _ekwGambar(); }
function _ekwPredikat(p) { EKW.predikat = p; EKW.ketManual = false; _ekwGambar(); }
async function _ekwTambah() {
  const n = (qs("ekw-baru")?.value || "").trim().replace(/\s+/g, " ");
  if (n.length < 3) { toast("Tulis nama ekskulnya dulu", "err"); return; }
  if (EKW.master.some((m) => m.nama_ekskul.toLowerCase() === n.toLowerCase())) { EKW.pilih = EKW.master.find((m) => m.nama_ekskul.toLowerCase() === n.toLowerCase()).nama_ekskul; _ekwGambar(); return; }
  try { await apiSimpanEkskulMaster({ nama_ekskul: n }); await _ekwMuatMaster(); EKW.pilih = n; toast(`${_ekwIkon(n)} ${n} tersimpan di katalog ekskul`, "ok"); _ekwGambar(); }
  catch (e) { toast("Gagal menambah: " + e.message, "err"); }
}
async function _ekwHapusMaster(id) {
  const m = EKW.master.find((x) => x.id === id); if (!m) return;
  if (!(await konfirmasiTema(`Hapus <b>${_ekwE(m.nama_ekskul)}</b> dari katalog?\n\nEkskul yang sudah tercatat di rapor santri tidak ikut terhapus.`, { ikon: "🗑️", judul: "Hapus dari katalog", teksYa: "Hapus" }))) { _ekwGambar(); return; }
  try { await apiHapusEkskulMaster(id); await _ekwMuatMaster(); if (EKW.pilih === m.nama_ekskul) EKW.pilih = ""; _ekwGambar(); }
  catch (e) { toast("Gagal: " + e.message, "err"); _ekwGambar(); }
}
async function _ekwSimpan() {
  const c = EKW.ctx, nama = EKW.pilih, ket = (qs("ekw-ket")?.value || "").trim() || null;
  if (!nama) { toast("Pilih kegiatan dulu", "err"); return; }
  const tombol = document.querySelector(".ekw-simpan"); if (tombol) { tombol.disabled = true; tombol.textContent = "Menyimpan…"; }
  try {
    if (!EKW.master.some((m) => m.nama_ekskul.toLowerCase() === nama.toLowerCase())) { try { await apiSimpanEkskulMaster({ nama_ekskul: nama }); } catch (e) {} }
    if (c.mode === "satu") {
      await apiSimpanEkstrakurikuler({ id: c.rowId || undefined, siswa_id: c.siswaId, semester: c.semester, tahun_ajaran: c.tahun, nama_ekstrakurikuler: nama, keterangan: ket });
      closeModal(); toast(`${_ekwIkon(nama)} Ekskul tersimpan`, "ok"); renderRaporWaliKelas(); return;
    }
    const ids = EKW.siswa.filter((s) => EKW.cek.has(s.id)).map((s) => s.id);
    if (!ids.length) { toast("Pilih minimal satu santri", "err"); if (tombol) { tombol.disabled = false; tombol.textContent = "💾 Simpan"; } return; }
    let n = 0;
    for (const id of ids) {
      const lama = EKW.ada.find((a) => a.siswa_id === id && a.nama_ekstrakurikuler === nama);
      await apiSimpanEkstrakurikuler({ id: lama?.id || undefined, siswa_id: id, semester: c.semester, tahun_ajaran: c.tahun, nama_ekstrakurikuler: nama, keterangan: ket }); n++;
    }
    closeModal(); toast(`${_ekwIkon(nama)} ${nama} diisikan ke ${n} santri`, "ok");
    if (c.prefix === "rw") renderRaporWaliKelas(); else if (typeof onGantiKelasRapor === "function") onGantiKelasRapor(c.prefix);
  } catch (e) { toast("Gagal menyimpan: " + e.message, "err"); if (tombol) { tombol.disabled = false; tombol.textContent = "💾 Simpan"; } }
}

(function () {
  const css = `.ekw-hero{border-radius:18px;padding:16px 18px;margin:-4px 0 14px;color:#fff;background:radial-gradient(120% 140% at 0% 0%,#a78bfa 0%,#7c3aed 45%,#4c1d95 100%);box-shadow:0 10px 30px rgba(124,58,237,.25)}
  .ekw-hero h3{margin:6px 0 2px;color:#fff;font-size:19px}.ekw-hero p{margin:0;font-size:12px;opacity:.85}.ekw-pil{display:inline-block;background:rgba(255,255,255,.18);border:1px solid rgba(255,255,255,.3);border-radius:999px;padding:2px 10px;font-size:11px;font-weight:700}
  .ekw-langkah{display:flex;align-items:center;gap:8px;margin:12px 0 8px;font-size:13.5px}.ekw-langkah span{width:22px;height:22px;border-radius:50%;background:#7c3aed;color:#fff;display:grid;place-items:center;font-size:12px;font-weight:800}.ekw-langkah em{margin-left:auto;font-style:normal;font-size:11.5px;color:var(--text-secondary)}
  .ekw-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:8px}
  .ekw-kartu{position:relative;display:flex;flex-direction:column;align-items:center;gap:3px;padding:12px 8px;border-radius:16px;border:1.5px solid var(--border-soft,#e2e8f0);background:var(--card-bg,#fff);color:inherit;cursor:pointer;transition:.15s;text-align:center}
  .ekw-kartu:hover{transform:translateY(-2px);box-shadow:0 6px 16px rgba(15,23,42,.08)}.ekw-kartu.on{border-color:#7c3aed;background:#f5f3ff;box-shadow:0 0 0 3px rgba(124,58,237,.18)}
  .ekw-ik{font-size:26px;line-height:1}.ekw-kartu b{font-size:12.5px;line-height:1.25}.ekw-kartu small{font-size:10px;color:var(--text-secondary)}
  .ekw-hapus{position:absolute;top:4px;right:8px;font-style:normal;color:#94a3b8;font-size:15px;opacity:0;transition:.15s}.ekw-kartu:hover .ekw-hapus{opacity:1}.ekw-hapus:hover{color:#dc2626}
  .ekw-tambah{display:flex;gap:6px;margin-top:8px}.ekw-tambah input{flex:1}
  .ekw-pred{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px}.ekw-pred button{border:1.5px solid color-mix(in srgb,var(--w) 40%,transparent);background:transparent;color:var(--w);border-radius:999px;padding:6px 14px;font-weight:800;font-size:12.5px;cursor:pointer}
  .ekw-pred button.on{background:var(--w);color:#fff;box-shadow:0 4px 12px color-mix(in srgb,var(--w) 35%,transparent)}
  .ekw-ket{font-size:13px;line-height:1.5}.ekw-kecil{display:block;color:var(--text-secondary);font-size:11px;margin-top:4px}
  .ekw-alat{display:flex;gap:6px;margin-bottom:8px;flex-wrap:wrap}.ekw-alat input{flex:1;min-width:160px}
  .ekw-santri{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:6px;max-height:300px;overflow:auto;padding:2px}
  .ekw-s{display:flex;align-items:center;gap:8px;padding:7px 10px;border-radius:12px;border:1px solid var(--border-soft,#e2e8f0);cursor:pointer;background:var(--card-bg,#fff);font-size:12.5px}
  .ekw-s.on{border-color:#a78bfa;background:#f5f3ff}.ekw-s input{accent-color:#7c3aed}.ekw-av{width:26px;height:26px;border-radius:50%;background:linear-gradient(135deg,#a78bfa,#7c3aed);color:#fff;display:grid;place-items:center;font-weight:800;font-size:12px;flex:none}
  .ekw-nm{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.ekw-s em{font-style:normal;font-size:10.5px;color:#059669;font-weight:700}
  .ekw-kaki{display:flex;gap:8px;justify-content:flex-end;position:sticky;bottom:0;background:var(--surface,#fff);padding-top:12px;margin-top:12px}.ekw-kaki .btn-accent{min-width:200px}
  @media (max-width:600px){.ekw-grid{grid-template-columns:repeat(2,1fr)}.ekw-santri{grid-template-columns:1fr}.ekw-kaki .btn{flex:1}.ekw-kaki .btn-accent{min-width:0}}`;
  const s = document.createElement("style"); s.textContent = css; document.head.appendChild(s);
})();

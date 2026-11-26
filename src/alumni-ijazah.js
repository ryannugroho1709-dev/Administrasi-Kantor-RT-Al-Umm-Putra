// ============================================================
//  ARSIP e-IJAZAH PER ANGKATAN (menu Alumni)
//  e-Ijazah dari Dinas berupa SATU PDF gabungan per tahun pelajaran & paket. Tautannya disimpan di
//  kv "bosp:alumni" → _ijazah { id: {tp, paket, rg, url, judul} }. Alumni Paket C otomatis tersambung
//  ke PDF angkatannya (lihat alUrlIjazah di alumni.js) bila belum punya tautan pribadi.
// ============================================================
const _AL_NM_RG = { Pa: "Putra", Pi: "Putri", A: "Paket A" };
function _alHtmlArsipIjazah(ubah) {
  const d = alArsipIjazah();
  const baris = d.map((z) => `<tr><td>${_alE(z.tp)}</td><td>Paket ${_alE(z.paket)}</td><td>${_alE(_AL_NM_RG[z.rg] || "-")}</td>
    <td><a href="${_alE(z.url)}" target="_blank" rel="noopener">📄 ${_alE(z.judul || "Buka PDF")}</a></td>
    <td>${ubah ? `<button class="btn btn-sm btn-secondary" onclick="alArsipHapus('${z.id}')">Hapus</button>` : ""}</td></tr>`).join("");
  return `<div class="card"><div class="al-arsip-h"><b>📄 Arsip e-Ijazah per Angkatan</b>${ubah ? `<button class="btn btn-sm btn-secondary" onclick="alArsipForm()">+ Tambah Berkas</button>` : ""}</div>
    <p class="rg-ket">PDF e-Ijazah gabungan dari Dinas (satu berkas per tahun pelajaran & paket). Alumni Paket C otomatis tersambung ke berkas angkatannya bila belum punya tautan sendiri.</p>
    ${d.length ? `<div class="bi2-wadah" style="--bk:#6d28d9"><table class="bi2-tabel" style="min-width:560px"><thead><tr><th>Tahun Pelajaran</th><th>Paket</th><th>Jenjang</th><th>Berkas</th><th></th></tr></thead><tbody>${baris}</tbody></table></div>` : `<div class="empty-state">Belum ada berkas e-Ijazah.</div>`}</div>`;
}
function alArsipForm() {
  const th = new Date().getFullYear(), tp = [];
  for (let y = th; y >= th - 8; y--) tp.push(`${y - 1}/${y}`);
  openModal(`<h3>📄 Tambah Berkas e-Ijazah</h3>
    <div class="field"><label class="form-label">Tahun Pelajaran</label><select class="input" id="ali-tp">${tp.map((t) => `<option>${t}</option>`).join("")}</select></div>
    <div class="field"><label class="form-label">Paket</label><select class="input" id="ali-paket"><option value="C">Paket C</option><option value="B">Paket B</option><option value="A">Paket A</option></select></div>
    <div class="field"><label class="form-label">Jenjang</label><select class="input" id="ali-rg"><option value="Pi">Putri</option><option value="Pa">Putra</option><option value="A">Paket A</option></select></div>
    <div class="field"><label class="form-label">Tautan PDF (Google Drive)</label><input class="input" id="ali-url" placeholder="https://drive.google.com/file/d/…"></div>
    <div class="field"><label class="form-label">Nama Berkas (opsional)</label><input class="input" id="ali-judul" placeholder="Ijazah Paket C TP 2024/2025"></div>
    <button class="btn btn-accent" style="width:100%" onclick="alArsipSimpan()">💾 Simpan</button>`);
}
async function alArsipSimpan() {
  if (!alBolehUbah()) return toast("Khusus pengelola PKBM", "err");
  const v = (k) => (document.getElementById("ali-" + k)?.value || "").trim();
  const z = { tp: v("tp"), paket: v("paket"), rg: v("rg"), url: v("url"), judul: v("judul"), t: Date.now(), oleh: STATE.guruNama || "" };
  if (!/^https:\/\//i.test(z.url)) return toast("Tautan harus diawali https://", "err");
  if (alArsipIjazah().some((a) => a.tp === z.tp && a.paket === z.paket && a.rg === z.rg) && !(await konfirmasiTema(`Sudah ada berkas Paket ${z.paket} ${_AL_NM_RG[z.rg]} TP ${z.tp}. Tetap tambahkan?`, { judul: "Berkas Sudah Ada", teksYa: "Tetap Tambahkan" }))) return;
  const id = "ij" + Date.now().toString(36);
  try {
    await _bspGabungUmum(AL_KUNCI, { _ijazah: { [id]: z } });
    AL.data._ijazah = { ...(AL.data._ijazah || {}), [id]: z };
    closeModal(); toast("Berkas e-Ijazah tersimpan", "ok"); if (typeof _rgLog === "function") _rgLog("tambah-e-ijazah", { tp: z.tp, paket: z.paket, rg: z.rg }); _alSegar();
  } catch (e) { toast("Gagal: " + (e.message || e), "err"); }
}
async function alArsipHapus(id) {
  if (!alBolehUbah() || !(await konfirmasiTema("Hapus tautan berkas ini dari arsip? Berkas di Google Drive tidak ikut terhapus."))) return;
  try { await _bspGabungUmum(AL_KUNCI, { _ijazah: { [id]: null } }); if (AL.data._ijazah) delete AL.data._ijazah[id]; _alSegar(); }
  catch (e) { toast("Gagal: " + (e.message || e), "err"); }
}

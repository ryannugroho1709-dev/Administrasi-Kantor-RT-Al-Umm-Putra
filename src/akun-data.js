// ============================================================
//  Akun baru tetap memakai DATA GURU YANG SUDAH ADA (foto, NIK, WA, dll.)
//  - Daftar Akun: foto lama ditampilkan → "Pakai Foto Ini" (bawaan) atau "Ganti Foto"
//  - Setelah masuk pertama kali: jendela "Periksa Data Diri" berisi data lama;
//    yang disimpan HANYA kolom yang diubah & tidak kosong (data lama tidak pernah terhapus)
// ============================================================
const AKD = { foto: null, guruId: null };
const _AKD_FOTO = (id) => "akd:foto:" + id;
const _AKD_CEK = (id) => "profil:cek:" + id;
const _akdLS = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) {} } };

// foto dikecilkan (sisi terpanjang 480 px, JPEG) → dataURL
async function _akdKecilkan(file) {
  const img = await new Promise((r, j) => { const i = new Image(); i.onload = () => r(i); i.onerror = j; i.src = URL.createObjectURL(file); });
  const s = Math.min(1, 480 / Math.max(img.width, img.height)), c = document.createElement("canvas");
  c.width = Math.round(img.width * s); c.height = Math.round(img.height * s); c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
  return c.toDataURL("image/jpeg", 0.82);
}
async function _akdUnggahDataUrl(guruId, dataUrl) {
  const blob = await (await fetch(dataUrl)).blob();
  const url = await apiUploadFoto(new File([blob], "foto.jpg", { type: "image/jpeg" }), "guru/foto");
  await apiSimpanGuru({ id: guruId, foto_url: url });
  [LOOKUP?.guruAll, STATE?.daftarGuru].forEach((d) => { const x = (d || []).find((y) => y.id === guruId); if (x) x.foto_url = url; });
  if (guruId === STATE.guruId && typeof _perbaruiFotoGuruPill === "function") _perbaruiFotoGuruPill(url);
  return url;
}
const _akdInisial = (n) => String(n || "?").split(",")[0].trim().split(/\s+/).slice(0, 2).map((x) => x[0] || "").join("").toUpperCase();

// ── 1. Formulir Daftar Akun: tampilkan foto yang sudah ada ──
(function () {
  if (typeof akTampilDaftar !== "function") return;
  const asli = akTampilDaftar;
  akTampilDaftar = async function () {
    AKD.foto = null; AKD.guruId = null;
    const r = await asli.apply(this, arguments);
    const pilih = qs("ak-d-nama"); if (!pilih) return r;
    const kotak = document.createElement("div"); kotak.id = "akd-foto"; kotak.className = "akd-foto"; kotak.hidden = true;
    pilih.closest("label").after(kotak);
    pilih.addEventListener("change", () => _akdTampilFoto(pilih.value, pilih.selectedOptions[0]?.textContent));
    return r;
  };
})();
async function _akdTampilFoto(guruId, nama) {
  const k = qs("akd-foto"); if (!k) return;
  AKD.foto = null; AKD.guruId = guruId || null;
  if (!guruId) { k.hidden = true; return; }
  let foto = "";
  try { const r = await supaSemua.from("guru").select("foto_url").eq("id", guruId).maybeSingle(); foto = r.data?.foto_url || ""; } catch (e) {}
  if (AKD.guruId !== guruId) return;
  k.hidden = false;
  k.dataset.lama = foto;
  _akdGambarFoto(nama);
}
function _akdGambarFoto(nama) {
  const k = qs("akd-foto"); if (!k) return;
  const lama = k.dataset.lama || "", src = AKD.foto || lama;
  k.innerHTML = `<div class="akd-bulat">${src ? `<img src="${escapeHtml(src)}" alt="foto"/>` : `<span>${escapeHtml(_akdInisial(nama))}</span>`}</div>
    <div class="akd-ket"><b>${AKD.foto ? "Foto Baru Dipilih" : lama ? "Foto Profil Antum Saat Ini" : "Belum Ada Foto Profil"}</b>
      <small>${AKD.foto ? "Foto ini dipasang setelah akun aktif." : lama ? "Data guru yang sudah ada tetap dipakai. Ganti hanya bila mau." : "Boleh tambahkan sekarang atau nanti di Profil."}</small>
      <span class="akd-tombol"><label class="akd-ganti">${lama || AKD.foto ? "Ganti Foto" : "Tambah Foto"}<input type="file" accept="image/*" hidden onchange="_akdPilihFoto(this)"/></label>${AKD.foto ? `<button type="button" class="akd-batal" onclick="AKD.foto=null;_akdGambarFoto()">${lama ? "Pakai Foto Lama" : "Batal"}</button>` : ""}</span></div>`;
}
async function _akdPilihFoto(el) {
  const f = el.files && el.files[0]; el.value = ""; if (!f) return;
  try { AKD.foto = await _akdKecilkan(f); _akdGambarFoto(qs("ak-d-nama")?.selectedOptions[0]?.textContent); }
  catch (e) { _akPesan?.("Foto tidak bisa dibaca, coba foto lain"); }
}
// simpan foto pilihan (bila ada) sampai akun bisa masuk — termasuk bila masih menunggu persetujuan Admin
(function () {
  if (typeof akKirimDaftar !== "function") return;
  const asli = akKirimDaftar;
  akKirimDaftar = async function () {
    const id = qs("ak-d-nama")?.value;
    if (id && AKD.foto) _akdLS.set(_AKD_FOTO(id), AKD.foto);
    return asli.apply(this, arguments);
  };
})();

// ── 2. Setelah masuk: pasang foto tertunda + Periksa Data Diri (sekali) ──
(function () {
  if (typeof _akMasukkanGuru !== "function") return;
  const asli = _akMasukkanGuru;
  _akMasukkanGuru = function (ga) {
    const r = asli.apply(this, arguments);
    if (ga && ga.id) setTimeout(() => _akdSetelahMasuk(ga.id), 1800);
    return r;
  };
})();
async function _akdSetelahMasuk(guruId) {
  try {
    const foto = _akdLS.get(_AKD_FOTO(guruId));
    if (foto) { await _akdUnggahDataUrl(guruId, foto); _akdLS.set(_AKD_FOTO(guruId), null); toast("Foto profil baru terpasang ✓", "ok"); }
  } catch (e) { console.warn("Foto tertunda gagal dipasang:", e); }
  // tunggu sampai jendela wajib ganti sandi / wajib lengkapi data diri selesai
  await new Promise((r) => setTimeout(r, 3000));
  for (let i = 0; i < 300 && (qs("ak-masuk") || qs("wp-layar") || _akdLS.get("akunWajibGanti") === "1"); i++) await new Promise((r) => setTimeout(r, 2000));
  if (qs("ak-masuk") || STATE.guruId !== guruId) return;
  const sudah = await _kvAmbil(_AKD_CEK(guruId), null).catch(() => "gagal");
  if (sudah) return;
  akdPeriksaData(guruId, true);
}
const _AKD_KOLOM = [["nama", "Nama Lengkap & Gelar", "text", "mis. Ahmad Fauzi, S.Pd"], ["nip_nik", "NIK / NIP", "text", ""], ["no_wa", "No. WA", "tel", "08…"], ["tempat_lahir", "Tempat Lahir", "text", ""], ["tanggal_lahir", "Tanggal Lahir", "date", ""], ["alamat_domisili", "Alamat", "text", ""]];
async function akdPeriksaData(guruId, pertama) {
  let g;
  try { g = await apiGetGuruDetail(guruId); } catch (e) { return; }
  if (!g) return;
  AKD.cekFoto = null;
  openModal(`<h3>🪪 Periksa Data Diri</h3>
    <p class="akd-pengantar">${pertama ? "Akun Antum sudah aktif. " : ""}Ini data yang <b>sudah tercatat</b> di aplikasi. Bila sudah benar, cukup tekan <b>Sudah Benar</b>. Bila ada yang salah, perbaiki saja — kolom yang dikosongkan <b>tidak</b> menghapus data lama.</p>
    <div class="akd-foto akd-foto-modal"><div class="akd-bulat" id="akd-m-foto">${g.foto_url ? `<img src="${escapeHtml(g.foto_url)}" alt="foto"/>` : `<span>${escapeHtml(_akdInisial(g.nama))}</span>`}</div>
      <div class="akd-ket"><b id="akd-m-fket">${g.foto_url ? "Foto Profil Saat Ini" : "Belum Ada Foto"}</b><small>Tetap pakai foto ini, atau ganti bila mau.</small>
      <span class="akd-tombol"><label class="akd-ganti">${g.foto_url ? "Ganti Foto" : "Tambah Foto"}<input type="file" accept="image/*" hidden onchange="_akdModalFoto(this)"/></label></span></div></div>
    <div class="akd-isian">${_AKD_KOLOM.map(([k, l, t, ph]) => `<label><span>${l}</span><input id="akd-${k}" type="${t}" class="input" value="${escapeHtml(g[k] == null ? "" : String(g[k]).slice(0, t === "date" ? 10 : 300))}" placeholder="${escapeHtml(g[k] ? "" : ph || "Belum diisi")}"/></label>`).join("")}</div>
    <div class="akd-aksi"><button class="btn btn-accent" onclick="_akdSimpanData('${guruId}')">✓ Sudah Benar, Simpan</button>${pertama ? `<button class="btn btn-ghost" onclick="_akdLewati('${guruId}')">Nanti Saja</button>` : ""}</div>`);
}
async function _akdModalFoto(el) {
  const f = el.files && el.files[0]; el.value = ""; if (!f) return;
  try { AKD.cekFoto = await _akdKecilkan(f); const b = qs("akd-m-foto"); if (b) b.innerHTML = `<img src="${AKD.cekFoto}" alt="foto baru"/>`; const t = qs("akd-m-fket"); if (t) t.textContent = "Foto Baru (Disimpan Saat Tekan Simpan)"; }
  catch (e) { toast("Foto tidak bisa dibaca", "err"); }
}
async function _akdSimpanData(guruId) {
  try {
    setGlobalLoading(true, "Menyimpan…");
    const lama = await apiGetGuruDetail(guruId);
    const baru = {}, ubah = [];
    _AKD_KOLOM.forEach(([k]) => {
      const v = (qs("akd-" + k)?.value || "").trim();
      const l = lama?.[k] == null ? "" : String(lama[k]).slice(0, k === "tanggal_lahir" ? 10 : undefined);
      if (v && v !== l) { baru[k] = v; ubah.push({ k, lama: l, baru: v }); } // kosong = biarkan data lama
    });
    if (Object.keys(baru).length) {
      await apiSimpanGuru({ id: guruId, ...baru });
      [LOOKUP?.guruAll, STATE?.daftarGuru].forEach((d) => { const x = (d || []).find((y) => y.id === guruId); if (x) Object.assign(x, baru); });
    }
    if (AKD.cekFoto) { await _akdUnggahDataUrl(guruId, AKD.cekFoto); ubah.push({ k: "foto_url", lama: "", baru: "foto baru" }); AKD.cekFoto = null; }
    if (ubah.length && typeof _catatPerubahanProfil === "function") await _catatPerubahanProfil(guruId, baru.nama || lama?.nama, ubah);
    await _kvSimpan(_AKD_CEK(guruId), { t: new Date().toISOString(), ubah: ubah.map((x) => x.k) }).catch(() => {});
    closeModal();
    toast(ubah.length ? `Data diperbarui ✓ (${ubah.length} perubahan)` : "Data sudah benar ✓", "ok");
  } catch (e) { toast("Gagal menyimpan: " + (e.message || e), "err"); }
  finally { setGlobalLoading(false); }
}
async function _akdLewati(guruId) {
  closeModal();
  await _kvSimpan(_AKD_CEK(guruId), { t: new Date().toISOString(), lewat: true }).catch(() => {});
  toast("Data bisa diperiksa kapan saja di menu Profil", "info");
}

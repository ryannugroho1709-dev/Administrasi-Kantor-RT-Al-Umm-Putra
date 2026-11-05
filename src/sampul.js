// ============================================================
//  SAMPUL BERSAMA (Modul Ajar) — satu gambar sampul dipakai banyak buku/bab supaya hemat Storage.
//  • "♻️ Pakai sampul yang sudah ada" saat unggah/edit: cukup menyalin URL, tidak ada file baru.
//  • Sampul baru (otomatis dari PDF / unggahan) dicek dulu: kalau gambarnya sama dengan sampul
//    yang sudah ada (sidik gambar 16×16), sampul lama yang dipakai → file baru tidak diunggah.
//  • Admin: "🧹 Rapikan sampul kembar" menyatukan sampul yang terlanjur dobel lalu menghapus
//    file yatimnya dari Storage (lewat apiHapusFileModulJikaYatim, aman untuk buku bersama).
// ============================================================
const MA_SIDIK = {}; // url → sidik (cache sesi)

// Daftar sampul unik yang sudah ada; mapel yang sama ditaruh paling depan.
function _maSampulDaftar(mapelId, judulAwal) {
  const kata = String(judulAwal || "").trim().split(/[\s\-–]+/)[0].toLowerCase();
  const peta = new Map();
  (MODUL_AJAR_BUKU_CACHE || []).forEach((m) => {
    if (!m.cover_url) return;
    const x = peta.get(m.cover_url) || { url: m.cover_url, judul: [], mapelSama: false };
    if (!x.judul.includes(m.judul)) x.judul.push(m.judul);
    if (m.mapel_id === mapelId) x.mapelSama = true;
    if (kata.length >= 3 && String(m.judul || "").toLowerCase().startsWith(kata)) x.cocok = true;
    peta.set(m.cover_url, x);
  });
  return [...peta.values()].sort((a, b) => !!b.cocok - !!a.cocok || b.mapelSama - a.mapelSama || b.judul.length - a.judul.length);
}
function _maSampulOpsiHtml(prefix) {
  return `<label style="display:flex;align-items:center;gap:8px;cursor:pointer;">
      <input type="radio" name="${prefix}-sampul-mode" value="pakai" onchange="_maTampilGaleriSampul('${prefix}')"/>
      <span>♻️ Pakai sampul yang sudah ada <b style="color:#059669;font-size:11px;">hemat memori</b></span>
    </label>`;
}
function _maTampilGaleriSampul(prefix) {
  const mode = document.querySelector(`input[name="${prefix}-sampul-mode"]:checked`)?.value;
  let box = qs(`${prefix}-sampul-galeri`);
  if (!box) {
    box = document.createElement("div"); box.id = `${prefix}-sampul-galeri`; box.className = "ma-galeri-sampul";
    qs(`${prefix}-cover-file`)?.insertAdjacentElement("afterend", box);
  }
  box.style.display = mode === "pakai" ? "" : "none";
  if (mode !== "pakai") return;
  const mapelId = qs(`${prefix}-mapel`)?.value || (MODUL_AJAR_BUKU_CACHE.find((x) => x.id === box.dataset.modul) || {}).mapel_id;
  const daftar = _maSampulDaftar(mapelId, qs(`${prefix}-judul`)?.value);
  if (!daftar.length) { box.innerHTML = `<div style="font-size:11.5px;color:var(--text-secondary);padding:8px;">Belum ada sampul yang bisa dipakai bersama.</div>`; return; }
  const pilih = box.dataset.pilih || daftar[0].url;
  box.dataset.pilih = pilih;
  box.innerHTML = daftar.map((x) => `<button type="button" class="${x.url === pilih ? "on" : ""}" title="${escapeHtml(x.judul.join("\n"))}" onclick="_maPilihSampul('${prefix}',this,'${x.url}')">
      <img src="${x.url}" alt="" loading="lazy"><span>${escapeHtml(x.judul[0] || "")}</span><small>${x.judul.length > 1 ? `dipakai ${x.judul.length} buku` : x.mapelSama ? "mapel sama" : ""}</small></button>`).join("");
}
function _maPilihSampul(prefix, btn, url) {
  const box = qs(`${prefix}-sampul-galeri`); box.dataset.pilih = url;
  box.querySelectorAll("button").forEach((b) => b.classList.toggle("on", b === btn));
}
const _maSampulTerpilih = (prefix) => qs(`${prefix}-sampul-galeri`)?.dataset.pilih || null;

// ── Sidik gambar: 16×16 abu-abu dibanding rata-rata (average hash, 256 bit) ──
async function _maSidik(sumber) {
  if (typeof sumber === "string" && MA_SIDIK[sumber]) return MA_SIDIK[sumber];
  const img = await new Promise((ok, no) => {
    const im = new Image(); im.crossOrigin = "anonymous";
    im.onload = () => ok(im); im.onerror = () => no(new Error("gambar tidak terbaca"));
    im.src = typeof sumber === "string" ? sumber : URL.createObjectURL(sumber);
  });
  const c = document.createElement("canvas"); c.width = 16; c.height = 16;
  const ctx = c.getContext("2d", { willReadFrequently: true }); ctx.drawImage(img, 0, 0, 16, 16);
  const d = ctx.getImageData(0, 0, 16, 16).data, abu = [];
  for (let i = 0; i < d.length; i += 4) abu.push(d[i] * 0.3 + d[i + 1] * 0.59 + d[i + 2] * 0.11);
  const rata = abu.reduce((a, b) => a + b, 0) / abu.length;
  const sidik = abu.map((v) => (v > rata ? 1 : 0)).join("") + "|" + (img.width / img.height).toFixed(2);
  if (typeof sumber === "string") MA_SIDIK[sumber] = sidik;
  return sidik;
}
function _maSidikMirip(a, b) {
  const [ha, ra] = a.split("|"), [hb, rb] = b.split("|");
  if (Math.abs(Number(ra) - Number(rb)) > 0.04) return false; // perbandingan sisi beda → bukan sampul sama
  let beda = 0; for (let i = 0; i < ha.length; i++) if (ha[i] !== hb[i]) beda++;
  return beda <= 8;
}
// Kembalikan URL sampul lama yang gambarnya sama dengan file baru (atau null).
async function _maCariSampulKembar(file) {
  try {
    const baru = await _maSidik(file);
    for (const x of _maSampulDaftar(null)) {
      try { if (_maSidikMirip(baru, await _maSidik(x.url))) return x.url; } catch (e) {}
    }
  } catch (e) { console.warn("Cek sampul kembar dilewati:", e); }
  return null;
}
// Sampul cukup selebar 600 px JPEG (± 40–80 KB) — gambar PNG dari Canva bisa 1–2 MB.
async function _maKecilkanSampul(blob) {
  const img = await new Promise((ok, no) => { const im = new Image(); im.onload = () => ok(im); im.onerror = no; im.src = URL.createObjectURL(blob); });
  const r = Math.min(1, 600 / img.width), c = document.createElement("canvas");
  c.width = Math.round(img.width * r); c.height = Math.round(img.height * r);
  const ctx = c.getContext("2d"); ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, c.width, c.height); ctx.drawImage(img, 0, 0, c.width, c.height);
  const hasil = await new Promise((ok) => c.toBlob(ok, "image/jpeg", 0.82));
  return hasil && hasil.size < blob.size ? new File([hasil], "sampul.jpg", { type: "image/jpeg" }) : blob;
}
// Unggah sampul baru, KECUALI ada sampul lama yang sama → pakai yang lama. Yang diunggah selalu dikecilkan dulu.
async function _maUnggahSampulHemat(file) {
  const kembar = await _maCariSampulKembar(file);
  if (kembar) { toast("♻️ Sampul sama dengan buku lain — dipakai bersama, tidak diunggah ulang", "ok"); return kembar; }
  let kecil = file; try { kecil = await _maKecilkanSampul(file); } catch (e) {}
  return apiUploadFoto(kecil.name ? kecil : new File([kecil], "sampul.jpg", { type: kecil.type || "image/jpeg" }), "modul-ajar/cover");
}

// ── Admin: rapikan sampul kembar yang sudah terlanjur tersimpan ──
async function rapikanSampulKembar() {
  if (!isAdmin()) { toast(t("hanyaAdminHapus"), "err"); return; }
  const daftar = _maSampulDaftar(null);
  if (daftar.length < 2) { toast("Tidak ada sampul kembar", "ok"); return; }
  openModal(`<h3>🧹 Rapikan sampul kembar</h3><div id="ma-rapikan">${loadingHTML("Membandingkan " + daftar.length + " sampul…")}</div>`);
  const sidik = [];
  for (const x of daftar) {
    try {
      const blob = await (await fetch(x.url)).blob();
      sidik.push({ ...x, blob, kb: Math.round(blob.size / 1024), s: await _maSidik(x.url), pakai: MODUL_AJAR_BUKU_CACHE.filter((m) => m.cover_url === x.url).length });
    } catch (e) {}
  }
  const kelompok = [], terpakai = new Set();
  sidik.forEach((a, i) => {
    if (terpakai.has(i)) return;
    const g = [a]; terpakai.add(i);
    sidik.forEach((b, j) => { if (!terpakai.has(j) && _maSidikMirip(a.s, b.s)) { g.push(b); terpakai.add(j); } });
    if (g.length > 1) kelompok.push(g.sort((p, q) => q.pakai - p.pakai));
  });
  const el = qs("ma-rapikan"); if (!el) return;
  const dobel = new Set(kelompok.flatMap((g) => g.slice(1).map((x) => x.url)));
  const besar = sidik.filter((x) => x.kb > 200 && !dobel.has(x.url));
  const kbHemat = kelompok.reduce((a, g) => a + g.slice(1).reduce((b, x) => b + x.kb, 0), 0) + besar.reduce((a, x) => a + x.kb - 100, 0);
  if (!kelompok.length && !besar.length) { el.innerHTML = `<p style="font-size:13px;">✅ Semua ${sidik.length} sampul sudah unik & ringan — tidak ada yang perlu dirapikan.</p>`; return; }
  const dihapus = kelompok.reduce((a, g) => a + g.length - 1, 0);
  el.innerHTML = `<div class="uj-statistik" style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:8px;">
      <div style="background:rgba(5,150,105,.1);border-radius:12px;padding:8px;text-align:center"><b style="font-size:18px;display:block">${sidik.length}</b><span style="font-size:11px">sampul</span></div>
      <div style="background:rgba(124,58,237,.1);border-radius:12px;padding:8px;text-align:center"><b style="font-size:18px;display:block">${dihapus + besar.length}</b><span style="font-size:11px">dirapikan</span></div>
      <div style="background:rgba(212,167,44,.14);border-radius:12px;padding:8px;text-align:center"><b style="font-size:18px;display:block">± ${kbHemat >= 1024 ? (kbHemat / 1024).toFixed(1) + " MB" : kbHemat + " KB"}</b><span style="font-size:11px">hemat</span></div></div>
    ${kelompok.length ? `<p style="font-size:12.5px;color:var(--text-secondary);line-height:1.6;">♻️ <b>${kelompok.length} kelompok</b> sampul bergambar sama → semua buku memakai <b>satu</b> gambar, <b>${dihapus} file</b> dobel dihapus.</p>
    ${kelompok.map((g) => `<div class="ma-kembar">${g.map((x, i) => `<div class="${i ? "" : "utama"}"><img src="${x.url}" alt=""><span>${i ? "🗑️ dihapus" : "✅ dipakai"} · ${x.kb} KB</span><small>${escapeHtml(x.judul.join(", "))}</small></div>`).join("")}</div>`).join("")}` : ""}
    ${besar.length ? `<p style="font-size:12.5px;color:var(--text-secondary);line-height:1.6;margin-top:10px;">🗜️ <b>${besar.length} sampul berukuran besar</b> dikecilkan jadi ± 100 KB (tampilan di rak tetap sama).</p>
      <div class="ma-kembar">${besar.map((x) => `<div class="utama"><img src="${x.url}" alt=""><span>${x.kb} KB → ± 100 KB</span><small>${escapeHtml(x.judul.join(", "))}</small></div>`).join("")}</div>` : ""}
    <button class="btn btn-accent" style="width:100%;margin-top:10px;" id="ma-rapikan-ok">🧹 Rapikan sekarang</button>`;
  qs("ma-rapikan-ok").onclick = async () => {
    const tb = qs("ma-rapikan-ok"); tb.disabled = true; tb.textContent = "Merapikan…";
    let n = 0;
    try {
      for (const g of kelompok) {
        const utama = g[0].url;
        for (const x of g.slice(1)) {
          for (const m of MODUL_AJAR_BUKU_CACHE.filter((b) => b.cover_url === x.url)) { await apiSimpanModulAjar({ id: m.id, cover_url: utama, cover_sumber: "bersama" }); m.cover_url = utama; }
          await apiHapusFileModulJikaYatim(x.url); n++;
        }
      }
      for (const x of besar) {
        const kecil = await _maKecilkanSampul(x.blob);
        if (kecil === x.blob) continue;
        const baru = await apiUploadFoto(kecil, "modul-ajar/cover");
        for (const m of MODUL_AJAR_BUKU_CACHE.filter((b) => b.cover_url === x.url)) { await apiSimpanModulAjar({ id: m.id, cover_url: baru }); m.cover_url = baru; }
        await apiHapusFileModulJikaYatim(x.url); n++;
      }
      toast(`🧹 ${n} sampul dirapikan — storage lebih hemat`, "ok");
      closeModal(); renderModulAjar();
    } catch (e) { toast("Gagal merapikan: " + e.message, "err"); tb.disabled = false; tb.textContent = "Coba lagi"; }
  };
}

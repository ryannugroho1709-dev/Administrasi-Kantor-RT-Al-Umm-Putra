// ============================================================
//  ARSIP GOOGLE DRIVE — berkas berat (nota, foto kegiatan, KTP/KK/ijazah, surat) disimpan di
//  Drive akun arsippkbmalummbarabai@gmail.com lewat skrip Google (apps-script/arsip-drive/Kode.gs).
//  Supabase hanya menyimpan tautan & keterangannya. Foto dikecilkan otomatis (±300 KB).
//  Alamat skrip disimpan di kuliah_pengaturan ruang "*" kunci "bosp:arsip-drive" → { url }.
//  (Awalan "bosp:" dipakai karena RPC kv_gabung_umum hanya menerima kunci berawalan itu.)
// ============================================================
const ARSIP = { url: null, dimuat: false };
const ARSIP_BULAN = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
const ARSIP_DRIVE_ROOT = "https://drive.google.com/drive/folders/1gLgxtTDbG0Pj5-vFwXuBz3w38V4VhyVF";

async function arsipMuat() {
  if (ARSIP.dimuat) return ARSIP.url;
  try { const r = await supaSemua.from("kuliah_pengaturan").select("nilai").eq("kunci", "bosp:arsip-drive").eq("ruang_id", "*").maybeSingle(); ARSIP.url = (r.data && r.data.nilai && r.data.nilai.url) || null; }
  catch (e) { ARSIP.url = null; }
  ARSIP.dimuat = true; return ARSIP.url;
}
const _arsipE = (s) => (typeof escapeHtml === "function" ? escapeHtml(String(s ?? "")) : String(s ?? ""));
function arsipNamaBerkas(bagian, ext) {
  const tgl = new Date(Date.now() + 8 * 3600e3).toISOString().slice(0, 10); // WITA
  const isi = [tgl, ...bagian].filter(Boolean).map((x) => String(x).replace(/[\\/:*?"<>|#%]+/g, "-").replace(/\s+/g, " ").trim()).filter(Boolean).join("_");
  return isi.slice(0, 150) + (ext ? "." + ext.replace(/^\./, "") : "");
}
async function _arsipToken() {
  const k = typeof AK !== "undefined" && AK.klien;
  if (!k) return null;
  const { data } = await k.auth.getSession();
  return data && data.session && data.session.access_token;
}
// Foto → JPEG ±300 KB (sisi terpanjang maks 1600 px). PDF/berkas lain dikirim apa adanya.
async function arsipKecilkan(file) {
  if (!/^image\//.test(file.type) || /gif|svg/.test(file.type)) return file;
  const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = URL.createObjectURL(file); });
  let sisi = 1600, mutu = 0.78, blob = null;
  for (let n = 0; n < 6; n++) {
    const sk = Math.min(1, sisi / Math.max(img.width, img.height)), c = document.createElement("canvas");
    c.width = Math.round(img.width * sk); c.height = Math.round(img.height * sk);
    const x = c.getContext("2d"); x.fillStyle = "#fff"; x.fillRect(0, 0, c.width, c.height); x.drawImage(img, 0, 0, c.width, c.height);
    blob = await new Promise((r) => c.toBlob(r, "image/jpeg", mutu));
    if (blob.size <= 350 * 1024) break;
    mutu = Math.max(0.5, mutu - 0.1); if (mutu <= 0.55) sisi = Math.round(sisi * 0.8);
  }
  return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", { type: "image/jpeg" });
}
async function _arsipKirim(isi) {
  const url = await arsipMuat();
  if (!url) throw new Error("Arsip Google Drive belum disambungkan. Admin: Pengaturan Ruang → ☁️ Arsip Drive.");
  const token = await _arsipToken();
  if (!token) throw new Error("Masuk akun dulu untuk mengunggah ke Arsip.");
  // text/plain → tanpa preflight CORS (Apps Script tidak mendukung OPTIONS)
  const r = await fetch(url, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify({ ...isi, token }) });
  const j = await r.json().catch(() => ({ ok: false, galat: "Balasan server arsip tidak terbaca" }));
  if (!j.ok) throw new Error(j.galat || "Gagal");
  return j;
}
// Unggah satu berkas → { id, url, nama, folder, ukuran }
async function arsipUnggah(file, { jalur, nama, ket } = {}) {
  if (!file) throw new Error("Tidak ada berkas");
  if (file.size > 25 * 1024 * 1024) throw new Error("Berkas lebih dari 25 MB");
  const f = await arsipKecilkan(file);
  const data = await new Promise((res, rej) => { const fr = new FileReader(); fr.onload = () => res(String(fr.result).split(",")[1]); fr.onerror = rej; fr.readAsDataURL(f); });
  const ext = (f.name.match(/\.([a-z0-9]+)$/i) || [, f.type === "application/pdf" ? "pdf" : "bin"])[1];
  return _arsipKirim({ aksi: "unggah", jalur, nama: nama ? (/\.(jpe?g|png|webp|gif|pdf|docx?|xlsx?|pptx?|txt|zip)$/i.test(nama) ? nama : nama + "." + ext) : f.name, mime: f.type || "application/octet-stream", data, ket, oleh: STATE.guruNama || "" });
}
// Pratinjau berkas milik sendiri (folder tetap tertutup); admin bisa buka langsung di Drive.
async function arsipLihat(b) {
  if (!b) return;
  const w = window.open("", "_blank");
  try {
    const j = await _arsipKirim({ aksi: "lihat", id: b.id });
    const bin = atob(j.data), u8 = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
    const url = URL.createObjectURL(new Blob([u8], { type: j.mime }));
    if (w) w.location = url; else window.open(url, "_blank");
  } catch (e) {
    if (w && typeof isAdmin === "function" && isAdmin() && b.url) { w.location = b.url; return; }
    if (w) w.close(); toast(e.message, "err");
  }
}
// Pilih berkas lewat jendela pilih file → Promise<File|null>
function arsipPilihBerkas(accept) {
  return new Promise((res) => { const i = document.createElement("input"); i.type = "file"; i.accept = accept || "image/*,application/pdf"; i.onchange = () => res(i.files && i.files[0] || null); i.click(); });
}

// ── Pengaturan Ruang → ☁️ Arsip Drive (admin) ──
(function () {
  if (typeof rgBukaPengaturan !== "function") return;
  const sebelum = rgBukaPengaturan;
  rgBukaPengaturan = async function (tab) {
    if (tab === "arsip") {
      if (!(typeof rgBisaPengaturan === "function" && rgBisaPengaturan())) { toast("Hanya Admin yang bisa mengakses ini", "err"); return; }
      if (typeof RG_ATUR !== "undefined") RG_ATUR.tab = "arsip";
      ARSIP.dimuat = false; await arsipMuat();
      const sec = _rgBukaHal("rg-atur", "Pengaturan Ruang", "");
      const tabs = [["fitur", "🧩 Fitur Per Ruang"], ["anggota", "👥 Guru Per Ruang"], ["santri", "🎒 Halaman Santri"], ["akun", "🔐 Akun Guru"], ["bosp", "💰 Bendahara BOSP"], ["arsip", "☁️ Arsip Drive"], ["log", "📜 Catatan Aktivitas"]];
      sec.innerHTML = `<div class="card"><div class="rg-tab">${tabs.map(([k, n]) => `<button class="${k === "arsip" ? "aktif" : ""}" onclick="rgBukaPengaturan('${k}')">${n}</button>`).join("")}</div>
        <p class="rg-ket">Berkas berat (nota & bukti belanja BOSP, foto kegiatan, daftar hadir, dokumen guru) disimpan di Google Drive <b>arsippkbmalummbarabai@gmail.com</b>, folder <a href="${ARSIP_DRIVE_ROOT}" target="_blank" rel="noopener">Arsip PKBM</a>. Aplikasi hanya menyimpan tautannya, jadi Supabase tetap ringan.</p>
        <div class="field"><label class="form-label">Alamat Skrip Google (Web App, berakhiran /exec)</label>
          <input id="ar-url" class="input" placeholder="https://script.google.com/macros/s/…/exec" value="${_arsipE(ARSIP.url || "")}"></div>
        <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn btn-accent" onclick="arsipSimpanUrl()">Simpan</button><button class="btn btn-outline" onclick="arsipUji()">Uji Koneksi</button><a class="btn btn-ghost" href="${ARSIP_DRIVE_ROOT}" target="_blank" rel="noopener">Buka Folder Arsip</a></div>
        <div id="ar-hasil" class="rg-ket" style="margin-top:10px"></div>
        <p class="rg-ket">Status: ${ARSIP.url ? "✅ Tersambung (tekan Uji Koneksi untuk memastikan)" : "⚠️ Belum disambungkan — ikuti PANDUAN.md di folder apps-script/arsip-drive."}</p></div>`;
      return;
    }
    await sebelum(tab);
    document.querySelectorAll(".rg-tab").forEach((bar) => {
      if (bar.querySelector("[data-arsip]")) return;
      const b = document.createElement("button"); b.dataset.arsip = "1"; b.textContent = "☁️ Arsip Drive"; b.onclick = () => rgBukaPengaturan("arsip");
      bar.insertBefore(b, bar.lastElementChild);
    });
  };
})();
async function arsipSimpanUrl() {
  const url = (qs("ar-url").value || "").trim();
  if (url && !/^https:\/\/script\.google(usercontent)?\.com\/.+\/exec$/.test(url)) { toast("Alamat harus dari script.google.com dan berakhiran /exec", "err"); return; }
  try { await _bspGabungUmum("bosp:arsip-drive", { url: url || null, oleh: STATE.guruNama || "", t: Date.now() }); ARSIP.url = url || null; toast("Tersimpan", "ok"); if (url) arsipUji(); }
  catch (e) { toast("Gagal menyimpan: " + e.message, "err"); }
}
async function arsipUji() {
  const h = qs("ar-hasil"); if (h) h.textContent = "Menguji…";
  try { const j = await _arsipKirim({ aksi: "cek" }); if (h) h.innerHTML = `✅ Tersambung ke folder <b>${_arsipE(j.folder)}</b> milik <b>${_arsipE(j.akun)}</b>. Unggahan siap dipakai.`; }
  catch (e) { if (h) h.innerHTML = `❌ ${_arsipE(e.message)}`; }
}

// ============================================================
//  REALISASI BOSP → kolom "Bukti (Drive)": Nota, Foto Kegiatan, Daftar Hadir per baris
//  + daftar periksa: baris yang sudah ada realisasi tapi belum ada nota ditandai merah.
// ============================================================
const ARSIP_BUKTI = {
  nota: { label: "Nota", folder: "02 Nota & Bukti Belanja", wajib: true },
  foto: { label: "Foto", folder: "03 Dokumentasi Kegiatan" },
  hadir: { label: "Hadir", folder: "04 Honor & Daftar Hadir" },
};
(function () {
  if (typeof _bspGambarReal !== "function") return;
  const asli = _bspGambarReal;
  _bspGambarReal = function () {
    asli.apply(this, arguments);
    const sec = qs("page-rg"); if (!sec || STATE.currentPage !== "pg-real") return;
    const tabel = sec.querySelector(".bsp-tabel"); if (!tabel) return;
    const bln = BSP_REAL.bulan, bend = bspBendahara();
    const tampil = _bspBarisGab().filter((b) => (b.bulan || {})[bln] && (!BSP_REAL.ruang || b.ruang === BSP_REAL.ruang));
    const th = document.createElement("th"); th.textContent = "Bukti (Drive)"; tabel.querySelector("thead tr").appendChild(th);
    let kurang = 0;
    tabel.querySelectorAll("tbody tr").forEach((tr, i) => {
      const b = tampil[i]; const td = document.createElement("td");
      if (!b) { const c = tr.querySelector("td[colspan]"); if (c) c.colSpan = 9; return; }
      const k = _bspKunciBaris(b, bln), r = BSP_REAL.d[k] || {}, bukti = r.bukti || {};
      td.className = "ar-bukti";
      td.innerHTML = Object.entries(ARSIP_BUKTI).map(([j, d]) => {
        const ada = (bukti[j] || []).length, merah = d.wajib && r.n && !ada; if (merah) kurang++;
        return `<span class="ar-chip ${ada ? "ada" : merah ? "kurang" : ""}">${ada ? `<a href="#" onclick="event.preventDefault();arsipLihatBukti('${k}','${j}')">${d.label} ${ada > 1 ? ada : "✓"}</a>` : d.label}${bend ? `<button title="Unggah ${d.label}" onclick="arsipUnggahBukti('${k}','${j}')">＋</button>` : ""}</span>`;
      }).join("");
      tr.appendChild(td);
    });
    if (kurang) { const p = document.createElement("div"); p.className = "ar-peringatan"; p.textContent = `⚠️ ${kurang} kegiatan di bulan ini sudah ada realisasi tetapi belum ada nota/bukti belanja. Wajib dilengkapi sebelum laporan Tahap.`; tabel.closest(".table-wrap").before(p); }
  };
})();
async function arsipUnggahBukti(k, jenis) {
  if (!bspBendahara()) return;
  const d = ARSIP_BUKTI[jenis], f = await arsipPilihBerkas(); if (!f) return;
  const [ruang, id, m] = k.split(":"), b = _bspBarisGab().find((x) => x.ruang === ruang && String(x.id) === id) || {};
  const r = BSP_REAL.d[k] || {};
  try {
    if (typeof setGlobalLoading === "function") setGlobalLoading(true, `Mengunggah ${d.label.toLowerCase()} ke Arsip Drive…`);
    const h = await arsipUnggah(f, {
      jalur: ["03 BOSP", String(BSP.th), d.folder, String(m).padStart(2, "0") + " " + ARSIP_BULAN[m - 1], _bspNamaRuang(ruang)],
      nama: arsipNamaBerkas([d.label, _bspNamaRuang(ruang), b.uraian || b.kegiatan, r.n ? "Rp" + Number(r.n).toLocaleString("id-ID") : ""]),
      ket: `${b.kode || ""} ${b.kegiatan || ""} · ${b.uraian || ""}`,
    });
    const bukti = { ...(r.bukti || {}) }; bukti[jenis] = [...(bukti[jenis] || []), { id: h.id, url: h.url, nama: h.nama, t: Date.now() }];
    await bspSimpanReal(k, { bukti });
    toast(`${d.label} tersimpan di Arsip Drive ✓`, "ok");
  } catch (e) { toast("Gagal mengunggah: " + e.message, "err"); }
  finally { if (typeof setGlobalLoading === "function") setGlobalLoading(false); }
}
function arsipLihatBukti(k, jenis) {
  const daftar = ((BSP_REAL.d[k] || {}).bukti || {})[jenis] || [];
  if (daftar.length === 1) return arsipLihat(daftar[0]);
  openModal(`<h3>${_arsipE(ARSIP_BUKTI[jenis].label)}</h3>${daftar.map((x, i) => `<div style="padding:6px 0;border-bottom:1px dashed var(--border-soft)"><a href="#" onclick="event.preventDefault();arsipLihat(((BSP_REAL.d['${k}']||{}).bukti||{})['${jenis}'][${i}])">${_arsipE(x.nama)}</a></div>`).join("")}`);
}

// ============================================================
//  PROFIL GURU → Dokumen Pribadi (KTP, KK, Ijazah, Sertifikat, SK) → Drive "01 Data Guru & PTK/<nama>"
//  Daftar tautan disimpan di kv "profil:dokumen:<guruId>".
// ============================================================
const ARSIP_DOK = [["ktp", "KTP"], ["kk", "Kartu Keluarga"], ["ijazah", "Ijazah Terakhir"], ["sertifikat", "Sertifikat"], ["sk", "SK Mengajar"]];
(function () {
  if (typeof bukaProfilGuru !== "function") return;
  const asli = bukaProfilGuru;
  bukaProfilGuru = async function (guruId) {
    await asli.apply(this, arguments);
    guruId = guruId || STATE.guruId;
    const wrap = qs("pf-wrap"); if (!wrap || wrap.querySelector(".ar-dok")) return;
    const bolehUbah = guruId === STATE.guruId || (typeof isAdmin === "function" && isAdmin());
    if (!bolehUbah) return;
    const dok = await _kvAmbil("profil:dokumen:" + guruId, {}).catch(() => ({}));
    const el = document.createElement("div"); el.className = "ar-dok";
    el.innerHTML = `<div class="pf-sec">📁 Dokumen Pribadi</div>
      <div style="font-size:11.5px;color:var(--text-secondary);margin:-4px 0 10px">Disimpan di Arsip Google Drive PKBM (tertutup — hanya pemilik dokumen & admin). Foto otomatis dikecilkan.</div>
      <div class="ar-dok-grid">${ARSIP_DOK.map(([k, l]) => { const x = dok[k]; return `<div class="ar-dok-item ${x ? "ada" : ""}"><b>${l}</b>${x ? `<a href="#" onclick="event.preventDefault();arsipLihat(${_arsipE(JSON.stringify(x)).replace(/"/g, "&quot;")})">Lihat</a>` : `<span>Belum ada</span>`}<button class="btn btn-sm btn-outline" onclick="arsipUnggahDok('${guruId}','${k}')">${x ? "Ganti" : "Unggah"}</button></div>`; }).join("")}</div>`;
    const kartu = [...wrap.querySelectorAll(".pf-sec")].find((s) => /Kartu Pengajar/.test(s.textContent));
    kartu ? kartu.before(el) : wrap.appendChild(el);
  };
})();
async function arsipUnggahDok(guruId, jenis) {
  const f = await arsipPilihBerkas(); if (!f) return;
  const g = (LOOKUP.guruAll || []).find((x) => x.id === guruId) || { nama: STATE.guruNama };
  const label = (ARSIP_DOK.find((x) => x[0] === jenis) || [, jenis])[1];
  try {
    if (typeof setGlobalLoading === "function") setGlobalLoading(true, `Mengunggah ${label}…`);
    const h = await arsipUnggah(f, { jalur: ["01 Data Guru & PTK", g.nama || guruId], nama: arsipNamaBerkas([label, g.nama]) });
    await _kvGabung("profil:dokumen:" + guruId, { [jenis]: { id: h.id, url: h.url, nama: h.nama, t: Date.now() } });
    toast(`${label} tersimpan di Arsip Drive ✓`, "ok");
    bukaProfilGuru(guruId);
  } catch (e) { toast("Gagal mengunggah: " + e.message, "err"); }
  finally { if (typeof setGlobalLoading === "function") setGlobalLoading(false); }
}

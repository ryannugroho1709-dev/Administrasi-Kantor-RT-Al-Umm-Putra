// ============================================================
//  WAJIB LENGKAPI DATA DIRI — setiap guru yang masuk dengan data diri belum lengkap
//  diminta mengisinya dulu (foto, NIK, No. WA, tempat & tanggal lahir, alamat, pendidikan terakhir).
//  Data langsung dipakai di Profil Saya & Kartu Pengajar. Admin boleh menunda ("Nanti Saja").
//  Admin yang sedang membuka akun guru lain tidak diminta mengisi.
// ============================================================
const _WP_ISIAN = [["foto_url", "Foto"], ["nip_nik", "NIK"], ["no_wa", "No. WhatsApp"], ["tempat_lahir", "Tempat Lahir"], ["tanggal_lahir", "Tanggal Lahir"], ["alamat_domisili", "Alamat"]];
const _WP_JENJANG = ["SMA/SMK/MA", "Pondok Pesantren", "D3", "S1", "S2", "S3"];
let _WP_FOTO = null, _WP_TUNDA = false;

async function _wpCek() {
  try {
    if (!STATE.guruId || _WP_TUNDA || document.getElementById("wp-layar")) return;
    const adminLain = typeof _ADMIN_TERVERIFIKASI !== "undefined" && _ADMIN_TERVERIFIKASI && typeof _namaTermasukAdmin === "function" && !_namaTermasukAdmin(STATE.guruNama);
    if (adminLain) return;
    const [g, pend] = await Promise.all([apiGetGuruDetail(STATE.guruId), apiGetPendidikanGuru(STATE.guruId).catch(() => null)]);
    if (!g || pend === null) return; // gagal memuat → jangan menghalangi
    const kurang = _WP_ISIAN.filter(([k]) => !String(g[k] || "").trim()).map(([, l]) => l);
    let lewat = false; try { lewat = localStorage.getItem("wpPendLewat:" + STATE.guruId) === "1"; } catch (e) {}
    if (!pend.length && !lewat) kurang.push("Pendidikan Terakhir");
    if (kurang.length) _wpTampil(g, pend, kurang);
  } catch (e) { console.warn("Cek data diri:", e); }
}

function _wpTampil(g, pend, kurang) {
  _WP_FOTO = null;
  const e = (v) => escapeHtml(v || ""), p = pend[pend.length - 1] || {};
  const bolehTunda = typeof isAdmin === "function" && isAdmin();
  const el = document.createElement("div"); el.id = "wp-layar";
  el.innerHTML = `<div class="wp-kotak" role="dialog" aria-modal="true" aria-labelledby="wp-judul">
    <div class="wp-kepala">
      <div class="wp-ikon"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="11" r="2.5"/><path d="M5.5 17c.8-1.8 2-2.6 3.5-2.6s2.7.8 3.5 2.6M14.5 9.5h4M14.5 13h4"/></svg></div>
      <div><h3 id="wp-judul">Lengkapi Data Diri</h3>
      <p>Assalamu'alaikum, <b>${e(String(g.nama || "").split(",")[0])}</b>. Sebelum memakai aplikasi, mohon lengkapi data berikut. Data ini tampil di <b>Profil Saya</b> dan <b>Kartu Pengajar</b>.</p></div>
    </div>
    <div class="wp-kurang">Belum diisi: ${kurang.map((k) => `<span>${e(k)}</span>`).join("")}</div>
    <div class="wp-isi">
      <div class="wp-foto-baris">
        <div class="wp-foto" id="wp-foto">${g.foto_url ? `<img src="${e(g.foto_url)}" alt="">` : `<svg viewBox="0 0 24 24" width="38" height="38" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="9" r="3.5"/><path d="M5 20c1.2-3.3 3.8-5 7-5s5.8 1.7 7 5"/></svg>`}</div>
        <div><label class="btn btn-outline wp-tombol-foto">${g.foto_url ? "Ganti Foto" : "Pilih Foto"}<input type="file" accept="image/*" hidden onchange="_wpPilihFoto(this)"></label>
        <small>Foto resmi, wajah terlihat jelas (untuk Kartu Pengajar).</small></div>
      </div>
      <div class="wp-grid">
        <label class="wp-f"><span>NIK (16 Angka) *</span><input id="wp-nik" class="input" inputmode="numeric" maxlength="16" value="${e(g.nip_nik)}" placeholder="63xxxxxxxxxxxxxx"></label>
        <label class="wp-f"><span>No. WhatsApp *</span><input id="wp-wa" class="input" type="tel" inputmode="tel" value="${e(g.no_wa)}" placeholder="08xxxxxxxxxx"></label>
        <label class="wp-f"><span>Tempat Lahir *</span><input id="wp-tempat" class="input" value="${e(g.tempat_lahir)}" placeholder="mis. Barabai"></label>
        <label class="wp-f"><span>Tanggal Lahir *</span><input id="wp-tgl" class="input" type="date" value="${e(g.tanggal_lahir)}"></label>
        <label class="wp-f wp-penuh"><span>Alamat Domisili *</span><input id="wp-alamat" class="input" value="${e(g.alamat_domisili)}" placeholder="Jalan, RT/RW, desa/kelurahan, kecamatan"></label>
        <label class="wp-f wp-penuh"><span>Email (Opsional)</span><input id="wp-email" class="input" type="email" value="${e(g.email && !/\.local$/.test(g.email) ? g.email : "")}" placeholder="nama@gmail.com"></label>
      </div>
      <div class="wp-sub">Pendidikan Terakhir *</div>
      <div class="wp-grid">
        <label class="wp-f"><span>Jenjang</span><select id="wp-jenjang" class="input">${_WP_JENJANG.map((j) => `<option ${p.jenjang === j ? "selected" : ""}>${j}</option>`).join("")}${p.jenjang && !_WP_JENJANG.includes(p.jenjang) ? `<option selected>${e(p.jenjang)}</option>` : ""}</select></label>
        <label class="wp-f"><span>Tahun Lulus</span><input id="wp-tahun" class="input" type="number" inputmode="numeric" min="1960" max="${new Date().getFullYear()}" value="${e(p.tahun_lulus)}" placeholder="mis. 2019"></label>
        <label class="wp-f wp-penuh"><span>Nama Sekolah / Kampus / Pondok</span><input id="wp-inst" class="input" value="${e(p.nama_institusi)}" placeholder="mis. UIN Antasari Banjarmasin"></label>
        <label class="wp-f wp-penuh"><span>Jurusan / Program Studi</span><input id="wp-jurusan" class="input" value="${e(p.jurusan)}" placeholder="mis. Pendidikan Agama Islam (boleh dikosongkan bila tidak ada)"></label>
      </div>
      <div id="wp-pesan" class="wp-pesan"></div>
    </div>
    <div class="wp-kaki">
      ${bolehTunda ? `<button class="btn btn-ghost" onclick="_wpTunda()">Nanti Saja</button>` : `<button class="btn btn-ghost" onclick="_wpKeluar()">Keluar Akun</button>`}
      <button class="btn btn-accent" id="wp-simpan" onclick="_wpSimpan('${g.id}', ${pend.length ? `'${p.id}'` : "null"})">Simpan Data Diri</button>
    </div>
  </div>`;
  document.body.appendChild(el);
  el.dataset.pendIsi = pend.length ? "1" : "";
}

async function _wpPilihFoto(input) {
  const f = input.files && input.files[0]; if (!f) return;
  try {
    const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = URL.createObjectURL(f); });
    const sk = Math.min(1, 480 / Math.max(img.width, img.height)), c = document.createElement("canvas");
    c.width = Math.round(img.width * sk); c.height = Math.round(img.height * sk); c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
    _WP_FOTO = await new Promise((r) => c.toBlob(r, "image/jpeg", 0.82));
    qs("wp-foto").innerHTML = `<img src="${c.toDataURL("image/jpeg", 0.8)}" alt="">`;
  } catch (e) { toast("Foto tidak bisa dibaca, coba foto lain", "err"); }
}

async function _wpSimpan(guruId, pendId) {
  const v = (id) => (qs(id)?.value || "").trim();
  const pesan = (t) => { const p = qs("wp-pesan"); p.textContent = t; p.style.display = t ? "block" : "none"; };
  const adaFoto = !!_WP_FOTO || !!qs("wp-foto").querySelector("img");
  const nik = v("wp-nik").replace(/\D/g, ""), wa = v("wp-wa").replace(/[^\d+]/g, "");
  const salah = [];
  if (!adaFoto) salah.push("foto");
  if (nik.length !== 16) salah.push("NIK harus 16 angka");
  if (wa.replace(/\D/g, "").length < 10) salah.push("No. WhatsApp");
  if (!v("wp-tempat")) salah.push("tempat lahir");
  if (!v("wp-tgl")) salah.push("tanggal lahir");
  if (v("wp-alamat").length < 8) salah.push("alamat lengkap");
  if (!v("wp-inst")) salah.push("nama sekolah/kampus");
  const th = Number(v("wp-tahun"));
  if (!th || th < 1960 || th > new Date().getFullYear()) salah.push("tahun lulus");
  if (v("wp-email") && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v("wp-email"))) salah.push("format email");
  if (salah.length) { pesan("Mohon periksa: " + salah.join(", ") + "."); return; }
  pesan("");
  const tb = qs("wp-simpan"); tb.disabled = true; tb.textContent = "Menyimpan…";
  try {
    const lama = await apiGetGuruDetail(guruId);
    const baru = { nip_nik: nik, no_wa: wa, tempat_lahir: v("wp-tempat"), tanggal_lahir: v("wp-tgl"), alamat_domisili: v("wp-alamat") };
    if (v("wp-email")) baru.email = v("wp-email");
    if (_WP_FOTO) baru.foto_url = await apiUploadFoto(new File([_WP_FOTO], "foto.jpg", { type: "image/jpeg" }), "guru/foto");
    await apiSimpanGuru({ id: guruId, ...baru });
    const pend = { guru_id: guruId, jenjang: v("wp-jenjang"), nama_institusi: v("wp-inst"), jurusan: v("wp-jurusan") || null, tahun_lulus: th };
    try { await apiSimpanPendidikan(pendId ? { id: pendId, ...pend } : { ...pend, urutan: 1 }); }
    catch (e) { console.warn("Pendidikan tidak tersimpan:", e); try { localStorage.setItem("wpPendLewat:" + guruId, "1"); } catch (x) {} toast("Data pendidikan belum tersimpan — admin akan melengkapinya", "warn"); }
    const lk = (LOOKUP.guruAll || []).find((x) => x.id === guruId); if (lk) Object.assign(lk, baru);
    const dg = (STATE.daftarGuru || []).find((x) => x.id === guruId); if (dg) Object.assign(dg, baru);
    if (baru.foto_url && typeof _perbaruiFotoGuruPill === "function") _perbaruiFotoGuruPill(baru.foto_url);
    if (typeof _catatPerubahanProfil === "function") {
      const ubah = Object.keys(baru).filter((k) => (lama?.[k] || "") !== baru[k]).map((k) => ({ k, lama: k === "foto_url" ? "" : lama?.[k] || "", baru: k === "foto_url" ? "foto baru" : baru[k] }));
      ubah.push({ k: "pendidikan", lama: "", baru: `${pend.jenjang} ${pend.nama_institusi} (${th})` });
      try { await _catatPerubahanProfil(guruId, lama?.nama, ubah); } catch (e) {}
    }
    document.getElementById("wp-layar")?.remove();
    toast("Jazakumullahu khairan, data diri tersimpan ✓", "ok");
  } catch (e) { tb.disabled = false; tb.textContent = "Simpan Data Diri"; pesan("Gagal menyimpan: " + (e.message || e)); }
}
function _wpTunda() { _WP_TUNDA = true; document.getElementById("wp-layar")?.remove(); toast("Jangan lupa lengkapi data diri lewat Profil Saya", "info"); }
function _wpKeluar() {
  document.getElementById("wp-layar")?.remove();
  if (typeof akKeluar === "function") return akKeluar();
  if (typeof openPilihGuru === "function") openPilihGuru();
}

// Jalankan setiap kali guru selesai masuk (bootDataGuru dipanggil sesudah login / pindah akun)
(function () {
  if (typeof bootDataGuru !== "function") return;
  const asli = bootDataGuru;
  window.bootDataGuru = async function () {
    const r = await asli.apply(this, arguments);
    setTimeout(_wpCek, 600);
    return r;
  };
  if (STATE.guruId) setTimeout(_wpCek, 2500);
})();

// ============================================================
//  PROFIL GURU — dibuka dari chip nama di pojok kanan atas (menu akun).
//  Isi: foto (bisa diganti), data diri, jabatan, pendidikan, jadwal mengajar, statistik bulan ini,
//  PIN pribadi (opsional) dan Kartu Pengajar (unduh PNG / cetak).
//  PIN guru disimpan sebagai hash SHA-256 di kuliah_pengaturan (kunci "pin:guru:<id>").
//  Admin yang sudah terverifikasi tetap bisa masuk ke akun guru mana pun (cek isi / bantu absen).
// ============================================================
function bukaMenuAkun() {
  if (!STATE.guruId) return openPilihGuru();
  openModal(`<h3 style="margin-bottom:10px;">👤 ${escapeHtml(_namaSingkatTopbar(STATE.guruNama))}</h3>
    <div style="display:grid;gap:8px;">
      <button class="btn btn-accent" onclick="bukaProfilGuru()">🪪 Profil Saya &amp; Kartu Pengajar</button>
      <button class="btn btn-outline" onclick="openPilihGuru()">🔁 Ganti Akun</button>
    </div>`);
}

// ── PIN guru ──
async function _pinHash(guruId, pin) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`rt-putra:${guruId}:${pin}`));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
async function _ambilPinGuru(guruId) {
  try { const r = await supa.from("kuliah_pengaturan").select("nilai").eq("kunci", "pin:guru:" + guruId).maybeSingle(); return (r.data && r.data.nilai && r.data.nilai.h) ? r.data.nilai : null; }
  catch (e) { return null; }
}
async function _simpanPinGuru(guruId, pin) {
  const nilai = pin ? { h: await _pinHash(guruId, pin), t: Date.now() } : null;
  const q = nilai ? supa.from("kuliah_pengaturan").upsert({ kunci: "pin:guru:" + guruId, nilai }) : supa.from("kuliah_pengaturan").delete().eq("kunci", "pin:guru:" + guruId);
  const { error } = await q; if (error) throw error;
}
// Dipanggil dari konfirmasiPilihGuru untuk guru non-admin: minta PIN kalau guru itu sudah memasangnya.
async function _loginGuruDenganPin(g) {
  if (_ADMIN_TERVERIFIKASI) return _selesaikanPilihGuruAdminLihat(g); // admin boleh masuk tanpa PIN guru
  const pin = await _ambilPinGuru(g.id);
  if (!pin) return _selesaikanPilihGuru(g);
  openModal(`<h3>🔒 PIN ${escapeHtml(_namaSingkatTopbar(g.nama))}</h3>
    <div style="font-size:12px;color:var(--text-secondary);margin:4px 0 12px;">Akun ini dikunci PIN oleh pemiliknya. Lupa PIN? Minta admin menghapusnya lewat Profil guru.</div>
    <div class="field"><input type="password" id="pin-guru-input" class="input" inputmode="numeric" autocomplete="off" placeholder="Masukkan PIN"/></div>
    <div id="pin-guru-err" style="color:var(--bad);font-size:11.5px;margin:-6px 0 10px;min-height:14px;"></div>
    <button class="btn btn-accent" style="width:100%" id="pin-guru-btn">Masuk</button>`);
  const inp = qs("pin-guru-input"), cek = async () => {
    if ((await _pinHash(g.id, (inp.value || "").trim())) === pin.h) _selesaikanPilihGuru(g);
    else { qs("pin-guru-err").textContent = "PIN salah"; inp.select(); }
  };
  qs("pin-guru-btn").onclick = cek; inp.focus(); inp.addEventListener("keydown", (e) => { if (e.key === "Enter") cek(); });
}
// Admin masuk ke akun guru untuk mengecek/membantu — status admin tetap diingat di perangkat ini
function _selesaikanPilihGuruAdminLihat(g) {
  _selesaikanPilihGuru(g);
  toast(`Masuk sebagai ${_namaSingkatTopbar(g.nama)} tanpa PIN (dibuka admin). Untuk kembali ke akun admin, pilih nama admin + PIN admin.`, "info");
}

// ── Halaman profil ──
let _PROFIL_GURU_ID = null;
async function bukaProfilGuru(guruId) {
  guruId = guruId || STATE.guruId; _PROFIL_GURU_ID = guruId;
  const milikSendiri = guruId === STATE.guruId, bolehUbah = milikSendiri || isAdmin();
  openModal(`<div id="pf-wrap">${loadingHTML("Memuat profil…")}</div>`, { lebar: true });
  try {
    await ensureLookups();
    const bln = bulanIniISO(), { dari, sampai } = rentangBulan(bln);
    const [g, pend, jadwal, sesi, pin, prestasi, jurnalBln, statMa] = await Promise.all([
      apiGetGuruDetail(guruId),
      apiGetPendidikanGuru(guruId).catch(() => []),
      supa.from("jadwal_pelajaran").select("hari,jam_mulai,jam_selesai,kelas(nama_kelas),mapel(nama_mapel)").eq("guru_id", guruId).eq("aktif", true).then((r) => r.data || []),
      apiGetRiwayatAbsenGuru(guruId, dari, sampai).catch(() => []),
      _ambilPinGuru(guruId),
      _kvAmbil("profil:prestasi:" + guruId, []),
      supa.from("jurnal_kelas").select("tanggal,materi_pokok,kelas(nama_kelas),mapel(nama_mapel)").eq("guru_id", guruId).gte("tanggal", dari).lte("tanggal", sampai).order("tanggal", { ascending: false }).then((x) => x.data || []),
      _kvAmbil(`ma:stat:${bln}:${guruId}`, null),
    ]);
    if (!g) throw new Error("Data guru tidak ditemukan");
    const jab = typeof _jabatanGuru === "function" ? _jabatanGuru(guruId) : [];
    const jabTeks = jab.length ? jab.map((j) => j.nama).join(", ") : (g.jabatan || "Guru");
    const wali = g.wali_kelas_id ? ((LOOKUP.kelas || []).find((k) => k.id === g.wali_kelas_id)?.nama_kelas || "") : "";
    // statistik bulan ini
    // sama dengan Laporan Kinerja & Riwayat Absen (termasuk sesi Alpha yang tidak pernah dibuka)
    const ring = _ringkasKehadiranSesi(sesi), tot = ring.total, alpha = ring.alpha, izin = ring.izin + ring.sakit;
    const jur = sesi.filter((x) => x.jurnal_id).length, pHadir = Math.round(ring.persenHadir), pJurnal = ring.hadir ? Math.min(100, Math.round(jur / ring.hadir * 100)) : 0;
    // jadwal ringkas
    const URUT = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
    const jadwalUrut = jadwal.slice().sort((a, b) => URUT.indexOf(a.hari) - URUT.indexOf(b.hari) || String(a.jam_mulai).localeCompare(String(b.jam_mulai)));
    const mapelUnik = [...new Set(jadwal.map((j) => j.mapel?.nama_mapel).filter(Boolean))];
    const kelasUnik = [...new Set(jadwal.map((j) => j.kelas?.nama_kelas).filter(Boolean))];
    const masaKerja = g.tmt ? (() => { const d = new Date(g.tmt + "T12:00:00"), n = new Date(); let th = n.getFullYear() - d.getFullYear(), bl = n.getMonth() - d.getMonth(); if (bl < 0) { th--; bl += 12; } return `${th} th ${bl} bln`; })() : "-";
    const tgl = (d) => d ? new Date(d + "T12:00:00").toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "-";
    const baris = (k, v) => `<div class="pf-row"><span>${k}</span><b>${v || "-"}</b></div>`;
    const inp = (id, label, nilai, type) => `<label class="pf-f"><span>${label}</span><input id="${id}" class="input" type="${type || "text"}" value="${escapeHtml(nilai || "")}" ${bolehUbah ? "" : "disabled"}/></label>`;
    const pilihGuru = isAdmin() ? `<select class="input" style="max-width:260px;margin:-4px 0 12px;" onchange="bukaProfilGuru(this.value)">${(LOOKUP.guruAll || []).filter((x) => x.status_aktif !== false).sort((a, b) => a.nama.localeCompare(b.nama)).map((x) => `<option value="${x.id}"${x.id === guruId ? " selected" : ""}>${escapeHtml(x.nama)}</option>`).join("")}</select>` : "";
    qs("pf-wrap").innerHTML = `<style>
      .pf-head{display:flex;gap:16px;align-items:center;flex-wrap:wrap;padding:16px;border-radius:18px;background:linear-gradient(135deg,var(--accent),color-mix(in srgb,var(--accent) 60%,#000));color:#fff;margin-bottom:14px}
      .pf-foto{position:relative;width:92px;height:92px;border-radius:50%;background:#fff3;flex:none;overflow:hidden;border:3px solid #fff8}
      .pf-foto img{width:100%;height:100%;object-fit:cover}.pf-foto span{display:grid;place-items:center;width:100%;height:100%;font-size:36px}
      .pf-foto label{position:absolute;inset:auto 0 0 0;background:#0008;font-size:10.5px;text-align:center;padding:3px 0;cursor:pointer}
      .pf-head h2{margin:0;font-size:18px}.pf-head p{margin:2px 0 0;opacity:.9;font-size:12px}
      .pf-chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}.pf-chips span{background:#ffffff26;padding:2px 9px;border-radius:999px;font-size:11px}
      .pf-stat{display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:8px;margin-bottom:14px}
      .pf-stat div{border:1px solid var(--border-soft);border-radius:12px;padding:9px;text-align:center}.pf-stat b{display:block;font-size:19px}.pf-stat small{font-size:10.5px;color:var(--text-secondary)}
      .pf-sec{font-weight:800;font-size:13px;margin:14px 0 8px}
      .pf-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:8px 14px}
      .pf-row{display:flex;justify-content:space-between;gap:10px;font-size:12px;padding:6px 0;border-bottom:1px dashed var(--border-soft)}.pf-row span{color:var(--text-secondary)}.pf-row b{text-align:right}
      .pf-f{display:flex;flex-direction:column;gap:3px;font-size:11px;color:var(--text-secondary)}
      .pf-jd{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:6px}.pf-jd div{font-size:11.5px;border:1px solid var(--border-soft);border-radius:10px;padding:6px 9px}
      .pf-kartu-wrap{overflow-x:auto;padding:4px 0}
      .pf-lengkap{display:flex;flex-wrap:wrap;align-items:center;gap:6px 12px;font-size:12px;margin-bottom:12px}.pf-lengkap>div{flex:1;min-width:200px}.pf-lengkap span{color:var(--text-secondary)}
      .pf-lengkap i{display:block;flex-basis:100%;height:8px;border-radius:999px;background:var(--border-soft);overflow:hidden;order:3}.pf-lengkap em{display:block;height:100%;background:linear-gradient(90deg,var(--accent),var(--ok,#16a34a))}
    </style>
    ${pilihGuru}
    <div class="pf-head">
      <div class="pf-foto">${g.foto_url ? `<img src="${g.foto_url}" alt=""/>` : `<span>👤</span>`}${bolehUbah ? `<label>📷 Ganti<input type="file" accept="image/*" hidden onchange="_gantiFotoProfil(this,'${guruId}')"/></label>` : ""}</div>
      <div style="flex:1;min-width:200px;"><h2>${escapeHtml(g.nama)}</h2><p>${escapeHtml(jabTeks)}${wali ? " · Wali " + escapeHtml(formatKelasLabel(wali)) : ""}</p>
        <div class="pf-chips"><span>${g.jenis_guru === "luar" ? "Guru Luar" : "Guru Dalam"}</span>${g.nip_nik ? `<span>NIP/NIK ${escapeHtml(g.nip_nik)}</span>` : ""}<span>Masa kerja ${masaKerja}</span>${pin ? "<span>🔒 PIN aktif</span>" : ""}</div></div>
    </div>
    ${(() => { const k = _kelengkapanProfil(g, pend.length); return `<div class="pf-lengkap"><div><b>Kelengkapan profil ${k.persen}%</b>${k.kurang.length ? ` <span>— lengkapi: ${k.kurang.join(", ")}</span>` : " ✓"}</div><i><em style="width:${k.persen}%"></em></i>${isAdmin() ? `<button class="btn btn-ghost" style="padding:4px 10px;font-size:11px;" onclick="bukaKelengkapanSemua()">📊 Semua guru</button>` : ""}</div>`; })()}
    <div class="pf-stat"><div><b>${pHadir}%</b><small>Hadir bulan ini</small></div><div><b>${pJurnal}%</b><small>Jurnal lengkap</small></div><div><b>${tot}</b><small>Sesi mengajar</small></div><div><b style="${alpha ? "color:var(--bad)" : ""}">${alpha}</b><small>Alpha</small></div><div><b>${izin}</b><small>Izin/Sakit</small></div><div><b>${jadwal.length}</b><small>Jam/pekan</small></div></div>
    <div class="pf-sec">📋 Data diri</div>
    <div class="pf-grid">
      ${baris("Nama lengkap", escapeHtml(g.nama))}${baris("Jabatan", escapeHtml(jabTeks))}${baris("TMT", tgl(g.tmt))}${baris("Status", g.jenis_guru === "luar" ? "Guru Luar" : "Guru Dalam")}
    </div>
    <div class="pf-grid" style="margin-top:8px;">
      ${inp("pf-nik", "NIP / NIK", g.nip_nik, "text")}${inp("pf-wa", "No. WhatsApp", g.no_wa, "tel")}${inp("pf-email", "Email", g.email, "email")}${inp("pf-tempat", "Tempat lahir", g.tempat_lahir)}${inp("pf-tgl", "Tanggal lahir", g.tanggal_lahir, "date")}
      <label class="pf-f" style="grid-column:1/-1;"><span>Alamat domisili</span><input id="pf-alamat" class="input" value="${escapeHtml(g.alamat_domisili || "")}" ${bolehUbah ? "" : "disabled"}/></label>
    </div>
    ${bolehUbah ? `<button class="btn btn-accent" style="margin-top:10px;" onclick="_simpanDataProfil('${guruId}')">💾 Simpan data diri</button>` : ""}
    <div style="font-size:10.5px;color:var(--text-secondary);margin-top:4px;">${milikSendiri && !isAdmin() ? "Setiap perubahan dilaporkan ke admin. " : ""}Nama, jabatan & TMT diubah admin lewat menu Data Guru.</div>
    ${pend.length ? `<div class="pf-sec">🎓 Pendidikan</div><div class="pf-grid">${pend.map((p) => baris(escapeHtml(p.jenjang), escapeHtml(p.nama_institusi + (p.jurusan ? " · " + p.jurusan : "") + (p.tahun_lulus ? " (" + p.tahun_lulus + ")" : "")))).join("")}</div>` : ""}
    <div class="pf-sec">🗓️ Jadwal mengajar (${jadwal.length} jam/pekan · ${mapelUnik.length} mapel · ${kelasUnik.length} kelas)</div>
    <div class="pf-jd">${jadwalUrut.map((j) => `<div><b>${j.hari}</b> ${String(j.jam_mulai).slice(0, 5)}–${String(j.jam_selesai).slice(0, 5)}<br/><span style="color:var(--text-secondary);">${escapeHtml(j.mapel?.nama_mapel || "-")} · ${escapeHtml(formatKelasLabel(j.kelas?.nama_kelas) || "-")}</span></div>`).join("") || `<div style="color:var(--text-secondary);">Belum ada jadwal aktif.</div>`}</div>
    <div class="pf-sec">📈 Portofolio mengajar · bulan ini</div>
    <div class="pf-stat"><div><b>${jurnalBln.length}</b><small>Jurnal ditulis</small></div><div><b>${statMa ? Object.values(statMa.buku || {}).reduce((a, b) => a + (b.presentasi || 0), 0) : 0}</b><small>Presentasi modul</small></div><div><b>${statMa ? Object.keys(statMa.buku || {}).length : 0}</b><small>Buku dipakai</small></div><div><b>${statMa ? Math.round(Object.values(statMa.buku || {}).reduce((a, b) => a + (b.menit || 0), 0)) : 0}</b><small>Menit di Modul Ajar</small></div></div>
    ${jurnalBln.length ? `<div class="pf-jd">${jurnalBln.slice(0, 6).map((j) => `<div><b>${_tglPendek(j.tanggal)}</b> · ${escapeHtml(j.mapel?.nama_mapel || "-")} ${escapeHtml(formatKelasLabel(j.kelas?.nama_kelas) || "")}<br/><span style="color:var(--text-secondary);">${escapeHtml((j.materi_pokok || "-").slice(0, 80))}</span></div>`).join("")}</div>` : ""}
    <div class="pf-sec">🏅 Prestasi, pelatihan & sertifikat</div>
    <div class="pf-jd">${prestasi.length ? prestasi.map((p) => `<div><b>${{ pelatihan: "📚", prestasi: "🏆", sertifikat: "📜" }[p.jenis] || "📌"} ${escapeHtml(p.judul)}</b>${p.tahun ? " · " + escapeHtml(String(p.tahun)) : ""}<br/>${p.file ? `<a href="${p.file}" target="_blank" rel="noopener">Lihat berkas</a>` : `<span style="color:var(--text-secondary);">tanpa berkas</span>`}${bolehUbah ? ` · <a href="#" onclick="event.preventDefault();_hapusPrestasi('${guruId}','${p.id}')">hapus</a>` : ""}</div>`).join("") : `<div style="color:var(--text-secondary);">Belum ada.</div>`}</div>
    ${bolehUbah ? `<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px;"><select id="pr-jenis" class="input" style="max-width:140px;"><option value="pelatihan">📚 Pelatihan</option><option value="prestasi">🏆 Prestasi</option><option value="sertifikat">📜 Sertifikat</option></select><input id="pr-judul" class="input" placeholder="mis. Diklat Kurikulum Merdeka" style="flex:1;min-width:180px;"/><input id="pr-tahun" class="input" type="number" placeholder="Tahun" style="max-width:90px;"/><label class="btn btn-ghost" style="cursor:pointer;">📎 Berkas<input id="pr-file" type="file" accept="image/*,application/pdf" hidden/></label><button class="btn btn-outline" onclick="_tambahPrestasi('${guruId}')">＋ Tambah</button></div>` : ""}
    <div class="pf-sec">🔒 Keamanan akun</div>
    <div style="font-size:12px;color:var(--text-secondary);margin-bottom:8px;">${pin ? "Akun ini dikunci PIN. Orang lain tidak bisa masuk dengan memilih nama ini." : "Belum ada PIN — siapa pun yang memilih nama ini di perangkat bisa masuk."} Admin tetap bisa membuka akun untuk membantu absen.</div>
    ${milikSendiri ? `<div style="display:flex;gap:8px;flex-wrap:wrap;"><input id="pf-pin1" class="input" type="password" inputmode="numeric" maxlength="8" placeholder="PIN baru (4–8 angka)" style="max-width:180px;"/><input id="pf-pin2" class="input" type="password" inputmode="numeric" maxlength="8" placeholder="Ulangi PIN" style="max-width:180px;"/><button class="btn btn-outline" onclick="_aturPinProfil('${guruId}')">${pin ? "Ganti PIN" : "Pasang PIN"}</button>${pin ? `<button class="btn btn-ghost" onclick="_hapusPinProfil('${guruId}')">Lepas PIN</button>` : ""}</div>`
      : isAdmin() && pin ? `<button class="btn btn-outline" onclick="_hapusPinProfil('${guruId}')">🔓 Hapus PIN guru ini (lupa PIN)</button>` : ""}
    <div class="pf-sec">🪪 Kartu Pengajar</div>
    <div class="pf-kartu-wrap"><div id="pf-kartu">${_htmlKartuPengajar(g, jabTeks, mapelUnik, wali)}</div></div>
    ${(setTimeout(_gambarQrKartu, 50), "")}
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px;"><button class="btn btn-accent" onclick="_unduhKartuPengajar('${escapeHtml(_namaSingkatTopbar(g.nama)).replace(/'/g, "")}')">⬇️ Unduh kartu (PNG)</button></div>`;
  } catch (e) { console.error(e); qs("pf-wrap").innerHTML = `<div style="color:var(--bad);font-size:12px;">Gagal memuat profil: ${escapeHtml(e.message || String(e))}</div>`; }
}
function _htmlKartuPengajar(g, jabatan, mapel, wali) {
  const p = STATE.pengaturan || {}, logo = p.logo_kanan_url || p.logo_kiri_url || (typeof urlLogoSekolah === "function" ? urlLogoSekolah() : "");
  const ta = (() => { const n = new Date(), awal = p.bulan_awal_tahun_ajaran || 7, y = n.getMonth() + 1 >= awal ? n.getFullYear() : n.getFullYear() - 1; return `${y}/${y + 1}`; })();
  const warna = typeof _warnaDok === "function" ? _warnaDok() : { tua: "#0b3b33", utama: "#0d5c4b" };
  return `<div style="width:640px;height:404px;border-radius:22px;overflow:hidden;position:relative;font-family:'Plus Jakarta Sans',Arial,sans-serif;background:linear-gradient(135deg,${warna.tua},${warna.utama});color:#fff;box-shadow:0 10px 30px rgba(0,0,0,.25);">
    <div style="position:absolute;right:-70px;top:-70px;width:260px;height:260px;border-radius:50%;background:rgba(255,255,255,.07);"></div>
    <div style="position:absolute;left:-50px;bottom:-90px;width:240px;height:240px;border-radius:50%;background:rgba(255,255,255,.05);"></div>
    <div style="display:flex;align-items:center;gap:12px;padding:20px 24px 0;">
      ${logo ? `<img src="${logo}" crossorigin="anonymous" style="width:46px;height:46px;object-fit:contain;background:#fff;border-radius:12px;padding:4px;"/>` : ""}
      <div><div style="font-size:11px;letter-spacing:1.5px;opacity:.85;text-transform:uppercase;">${escapeHtml(p.nama_lembaga_kop || "Rumah Tahfizh Al-Umm Putra Barabai")}</div><div style="font-size:19px;font-weight:800;">KARTU PENGAJAR</div></div>
      <div style="margin-left:auto;font-size:11px;opacity:.85;text-align:right;">Tahun Ajaran<br/><b style="font-size:13px;">${ta}</b></div>
    </div>
    <div style="display:flex;gap:22px;padding:22px 24px;">
      <div style="width:120px;height:150px;border-radius:14px;background:#fff;overflow:hidden;flex:none;border:3px solid rgba(255,255,255,.7);">${g.foto_url ? `<img src="${g.foto_url}" crossorigin="anonymous" style="width:100%;height:100%;object-fit:cover;"/>` : `<div style="display:grid;place-items:center;height:100%;font-size:54px;color:#999;">👤</div>`}</div>
      <div style="flex:1;min-width:0;">
        <div style="font-size:22px;font-weight:800;line-height:1.2;">${escapeHtml(g.nama)}</div>
        <div style="font-size:13px;opacity:.9;margin-top:4px;">${escapeHtml(jabatan)}${wali ? " · Wali " + escapeHtml(formatKelasLabel(wali)) : ""}</div>
        <div style="margin-top:14px;display:grid;grid-template-columns:auto 1fr;gap:4px 12px;font-size:12px;">
          <span style="opacity:.75;">NIP/NIK</span><b>${escapeHtml(g.nip_nik || "-")}</b>
          <span style="opacity:.75;">Status</span><b>${g.jenis_guru === "luar" ? "Guru Luar" : "Guru Dalam"}</b>
          <span style="opacity:.75;">Mengampu</span><b style="line-height:1.35;">${escapeHtml(mapel.slice(0, 4).join(", ") || "-")}${mapel.length > 4 ? ` +${mapel.length - 4}` : ""}</b>
          <span style="opacity:.75;">No. WA</span><b>${escapeHtml(g.no_wa || "-")}</b>
        </div>
      </div>
    </div>
    <div class="pf-qr" data-qr="${escapeHtml(`KARTU PENGAJAR\n${g.nama}\n${jabatan}\nNIP/NIK: ${g.nip_nik || "-"}\n${p.nama_lembaga_kop || "Rumah Tahfizh Al-Umm Putra Barabai"}\nTA ${ta}\nID ${String(g.id).slice(0, 8).toUpperCase()}`)}" style="position:absolute;right:24px;bottom:46px;width:84px;height:84px;background:#fff;border-radius:10px;padding:5px;box-sizing:border-box;"></div>
    <div style="position:absolute;left:0;right:0;bottom:0;padding:10px 24px;background:rgba(0,0,0,.18);font-size:10.5px;display:flex;justify-content:space-between;"><span>${escapeHtml(p.alamat || "Barabai, Hulu Sungai Tengah")}</span><span>ID ${String(g.id).slice(0, 8).toUpperCase()}</span></div>
  </div>`;
}
async function _unduhKartuPengajar(nama) {
  const el = qs("pf-kartu")?.firstElementChild; if (!el || !window.html2canvas) { toast("Fitur unduh belum siap", "err"); return; }
  try {
    const c = await html2canvas(el, { backgroundColor: null, scale: 2, useCORS: true, imageTimeout: 15000 });
    const a = document.createElement("a"); a.href = c.toDataURL("image/png"); a.download = `Kartu Pengajar - ${nama}.png`; a.click();
  } catch (e) { toast("Gagal membuat gambar kartu: " + e.message, "err"); }
}
// Foto dikecilkan dulu (sisi terpanjang 480px, JPEG) supaya hemat storage
async function _gantiFotoProfil(input, guruId) {
  const f = input.files && input.files[0]; if (!f) return;
  try {
    setGlobalLoading(true, "Mengunggah foto…");
    const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = URL.createObjectURL(f); });
    const sk = Math.min(1, 480 / Math.max(img.width, img.height)), c = document.createElement("canvas");
    c.width = Math.round(img.width * sk); c.height = Math.round(img.height * sk); c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
    const blob = await new Promise((r) => c.toBlob(r, "image/jpeg", 0.82));
    const url = await apiUploadFoto(new File([blob], "foto.jpg", { type: "image/jpeg" }), "guru/foto");
    await apiSimpanGuru({ id: guruId, foto_url: url });
    const lk = (LOOKUP.guruAll || []).find((x) => x.id === guruId); if (lk) lk.foto_url = url;
    const dg = (STATE.daftarGuru || []).find((x) => x.id === guruId); if (dg) dg.foto_url = url;
    if (guruId === STATE.guruId) _perbaruiFotoGuruPill(url);
    await _catatPerubahanProfil(guruId, (LOOKUP.guruAll || []).find((x) => x.id === guruId)?.nama, [{ k: "foto_url", lama: "", baru: "foto baru" }]);
    toast("Foto profil diperbarui ✓", "ok");
    bukaProfilGuru(guruId);
  } catch (e) { console.error(e); toast("Gagal mengganti foto: " + (e.message || e), "err"); }
  finally { setGlobalLoading(false); }
}
async function _simpanDataProfil(guruId) {
  const v = (id) => (qs(id)?.value || "").trim() || null;
  try {
    const baru = { nip_nik: v("pf-nik"), no_wa: v("pf-wa"), email: v("pf-email"), tempat_lahir: v("pf-tempat"), tanggal_lahir: v("pf-tgl"), alamat_domisili: v("pf-alamat") };
    const lama = await apiGetGuruDetail(guruId);
    const ubah = Object.keys(baru).filter((k) => (lama?.[k] || null) !== baru[k]);
    if (!ubah.length) { toast("Tidak ada perubahan", "info"); return; }
    await apiSimpanGuru({ id: guruId, ...baru });
    const lk = (LOOKUP.guruAll || []).find((x) => x.id === guruId); if (lk) Object.assign(lk, baru);
    await _catatPerubahanProfil(guruId, lama?.nama, ubah.map((k) => ({ k, lama: lama?.[k] || "", baru: baru[k] || "" })));
    toast(`Data diri tersimpan ✓${isAdmin() && guruId === STATE.guruId ? "" : " — admin sudah diberi tahu"}`, "ok");
    bukaProfilGuru(guruId);
  } catch (e) { toast("Gagal menyimpan: " + (e.message || e), "err"); }
}
async function _aturPinProfil(guruId) {
  const a = (qs("pf-pin1")?.value || "").trim(), b = (qs("pf-pin2")?.value || "").trim();
  if (!/^\d{4,8}$/.test(a)) { toast("PIN harus 4–8 angka", "err"); return; }
  if (a !== b) { toast("Ulangi PIN belum sama", "err"); return; }
  try { await _simpanPinGuru(guruId, a); toast("PIN terpasang ✓ — dipakai saat memilih nama ini di perangkat lain", "ok"); bukaProfilGuru(guruId); }
  catch (e) { toast("Gagal memasang PIN: " + (e.message || e), "err"); }
}
async function _hapusPinProfil(guruId) {
  if (!(await konfirmasiTema("Lepas PIN dari akun ini?", { ikon: "🔓", judul: "Lepas PIN" }))) return;
  try { await _simpanPinGuru(guruId, null); toast("PIN dilepas", "ok"); bukaProfilGuru(guruId); }
  catch (e) { toast("Gagal: " + (e.message || e), "err"); }
}

// ── Penyimpanan kunci-nilai umum (kuliah_pengaturan) ──
async function _kvAmbil(kunci, bawaan) {
  try { const r = await supa.from("kuliah_pengaturan").select("nilai").eq("kunci", kunci).maybeSingle(); return r.data && r.data.nilai != null ? r.data.nilai : bawaan; }
  catch (e) { return bawaan; }
}
async function _kvSimpan(kunci, nilai) { const { error } = await supa.from("kuliah_pengaturan").upsert({ kunci, nilai }); if (error) throw error; }

// ── Kelengkapan profil ──
const _PF_WAJIB = [["foto_url", "foto"], ["nip_nik", "NIK"], ["no_wa", "No. WA"], ["email", "email"], ["tempat_lahir", "tempat lahir"], ["tanggal_lahir", "tanggal lahir"], ["alamat_domisili", "alamat"], ["tmt", "TMT"]];
function _kelengkapanProfil(g, jmlPendidikan) {
  const kurang = _PF_WAJIB.filter(([k]) => !g[k]).map(([, l]) => l);
  if (jmlPendidikan === 0) kurang.push("pendidikan");
  const total = _PF_WAJIB.length + (jmlPendidikan == null ? 0 : 1);
  return { persen: Math.round((total - kurang.length) / total * 100), kurang };
}
async function bukaKelengkapanSemua() {
  openModal(`<h3>📊 Kelengkapan Profil Guru</h3><div id="kl-isi">${loadingHTML()}</div>`, { lebar: true });
  const r = await supa.from("guru").select("*").neq("status_aktif", false).order("nama");
  const daftar = (r.data || []).map((g) => ({ g, ...(_kelengkapanProfil(g, null)) })).sort((a, b) => a.persen - b.persen);
  qs("kl-isi").innerHTML = `<div style="font-size:11.5px;color:var(--text-secondary);margin:-6px 0 10px;">Diurutkan dari yang paling belum lengkap. Klik nama untuk membuka profilnya.</div>` + daftar.map((x) => `<div style="display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:1px dashed var(--border-soft);font-size:12px;">
    <a href="#" style="flex:1;font-weight:700;" onclick="event.preventDefault();bukaProfilGuru('${x.g.id}')">${escapeHtml(x.g.nama)}</a>
    <span style="flex:2;color:var(--text-secondary);font-size:11px;">${x.kurang.length ? "kurang: " + x.kurang.join(", ") : "lengkap ✓"}</span>
    <b style="width:42px;text-align:right;color:${x.persen >= 90 ? "var(--ok)" : x.persen >= 60 ? "#d97706" : "var(--bad)"};">${x.persen}%</b></div>`).join("");
}

// ── Perubahan data guru → dilaporkan ke admin ──
const _PF_LABEL = { nip_nik: "NIP/NIK", no_wa: "No. WA", email: "Email", tempat_lahir: "Tempat lahir", tanggal_lahir: "Tanggal lahir", alamat_domisili: "Alamat", foto_url: "Foto profil" };
async function _catatPerubahanProfil(guruId, nama, perubahan) {
  if (isAdmin() && guruId !== STATE.guruId) return; // admin mengubah data guru lain — tidak perlu lapor ke diri sendiri
  if (isAdmin()) return;
  try {
    const log = await _kvAmbil("profil:perubahan", []);
    log.unshift({ id: Date.now().toString(36), guru_id: guruId, nama: nama || STATE.guruNama, perubahan, t: Date.now(), dilihat: false });
    await _kvSimpan("profil:perubahan", log.slice(0, 150));
  } catch (e) { console.warn("Gagal mencatat perubahan profil:", e); }
}
async function jumlahPerubahanProfilBaru() { return (await _kvAmbil("profil:perubahan", [])).filter((x) => !x.dilihat).length; }
async function bukaPerubahanProfil() {
  const log = await _kvAmbil("profil:perubahan", []);
  const fmt = (k, v) => k === "foto_url" ? "foto baru" : escapeHtml(String(v || "–"));
  openModal(`<h3>✏️ Perubahan Data Guru</h3>
    <div style="font-size:11.5px;color:var(--text-secondary);margin:-6px 0 10px;">Diubah sendiri oleh guru lewat Profil. Yang belum dilihat ditandai kuning.</div>
    <div style="max-height:56vh;overflow-y:auto;">${log.length ? log.map((x) => `<div style="padding:9px 10px;border-radius:10px;margin-bottom:6px;border:1px solid var(--border-soft);${x.dilihat ? "" : "background:rgba(245,158,11,.08);border-color:rgba(245,158,11,.4);"}font-size:12px;">
      <div style="display:flex;justify-content:space-between;gap:8px;"><a href="#" style="font-weight:800;" onclick="event.preventDefault();bukaProfilGuru('${x.guru_id}')">${escapeHtml(x.nama || "-")}</a><span style="color:var(--text-secondary);font-size:11px;">${new Date(x.t).toLocaleString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span></div>
      ${(x.perubahan || []).map((p) => `<div style="margin-top:3px;"><b>${_PF_LABEL[p.k] || p.k}:</b> <s style="color:var(--text-secondary);">${fmt(p.k, p.lama)}</s> → <b>${fmt(p.k, p.baru)}</b></div>`).join("")}</div>`).join("") : `<div style="color:var(--text-secondary);font-size:12px;">Belum ada perubahan.</div>`}</div>
    ${log.some((x) => !x.dilihat) ? `<button class="btn btn-accent" style="width:100%;margin-top:10px;" onclick="_tandaiPerubahanDilihat()">✓ Tandai semua sudah dilihat</button>` : ""}`);
}
async function _tandaiPerubahanDilihat() {
  const log = (await _kvAmbil("profil:perubahan", [])).map((x) => ({ ...x, dilihat: true }));
  try { await _kvSimpan("profil:perubahan", log); toast("Ditandai sudah dilihat", "ok"); closeModal(); if (typeof renderDashPeran === "function") renderDashPeran(); }
  catch (e) { toast("Gagal: " + (e.message || e), "err"); }
}

// ── Prestasi & pelatihan ──
async function _tambahPrestasi(guruId) {
  const judul = (qs("pr-judul")?.value || "").trim(); if (!judul) { toast("Isi judul prestasi/pelatihan", "err"); return; }
  try {
    setGlobalLoading(true, "Menyimpan…");
    const f = qs("pr-file")?.files?.[0]; let file = null;
    if (f) { if (f.size > 5 * 1024 * 1024) throw new Error("Berkas maksimal 5 MB"); file = await apiUploadFoto(f, "guru/prestasi"); }
    const daftar = await _kvAmbil("profil:prestasi:" + guruId, []);
    daftar.unshift({ id: Date.now().toString(36), jenis: qs("pr-jenis").value, judul, tahun: +qs("pr-tahun").value || null, file });
    await _kvSimpan("profil:prestasi:" + guruId, daftar);
    toast("Tersimpan ✓", "ok"); bukaProfilGuru(guruId);
  } catch (e) { toast("Gagal: " + (e.message || e), "err"); }
  finally { setGlobalLoading(false); }
}
async function _hapusPrestasi(guruId, id) {
  if (!(await konfirmasiTema("Hapus item ini?", { ikon: "🗑️", judul: "Hapus" }))) return;
  try { await _kvSimpan("profil:prestasi:" + guruId, (await _kvAmbil("profil:prestasi:" + guruId, [])).filter((x) => x.id !== id)); bukaProfilGuru(guruId); }
  catch (e) { toast("Gagal: " + (e.message || e), "err"); }
}

// ── QR di Kartu Pengajar (qrcode-generator, dimuat saat dibutuhkan) ──
async function _gambarQrKartu() {
  const box = document.querySelector(".pf-qr"); if (!box) return;
  try {
    if (!window.qrcode) await new Promise((res, rej) => { const sc = document.createElement("script"); sc.src = "https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.min.js"; sc.onload = res; sc.onerror = rej; document.head.appendChild(sc); });
    const q = qrcode(0, "M"); q.addData(unescape(encodeURIComponent(box.dataset.qr))); q.make();
    box.innerHTML = q.createSvgTag({ cellSize: 2, margin: 0 }).replace("<svg ", '<svg style="width:100%;height:100%;display:block" ');
  } catch (e) { box.remove(); }
}

// ── Ulang tahun guru hari ini (untuk Dashboard) ──
function htmlUlangTahunGuru() {
  const n = new Date(), md = String(n.getMonth() + 1).padStart(2, "0") + "-" + String(n.getDate()).padStart(2, "0");
  const ultah = (LOOKUP.guruAll || []).filter((g) => g.status_aktif !== false && g.tanggal_lahir && String(g.tanggal_lahir).slice(5, 10) === md);
  if (!ultah.length) return "";
  return `<div class="pengingat-jurnal" role="status" style="border-color:rgba(236,72,153,.4);background:rgba(236,72,153,.06);"><span style="font-size:22px;line-height:1;">🎂</span><div style="flex:1;min-width:0;"><b>Hari ini milad ${ultah.map((g) => escapeHtml(_namaSingkatTopbar(g.nama))).join(", ")}</b><div style="margin-top:3px;font-size:11.5px;">Barakallahu fii umrik — semoga Allah berkahi usia, ilmu, dan amalnya.</div></div>
    ${ultah.filter((g) => g.no_wa).slice(0, 1).map((g) => `<a class="btn btn-accent" style="padding:7px 12px;font-size:11.5px;flex-shrink:0;align-self:center;" target="_blank" rel="noopener" href="https://wa.me/${String(g.no_wa).replace(/\D/g, "").replace(/^0/, "62")}?text=${encodeURIComponent("Barakallahu fii umrik, " + _namaSingkatTopbar(g.nama) + " 🎉 Semoga Allah memberkahi usia, ilmu, dan amal antum. Aamiin.")}">💬 Ucapkan</a>`).join("")}</div>`;
}

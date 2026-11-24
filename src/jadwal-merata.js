// ============================================================
//  JADWAL UJIAN — 🧠 SUSUN MERATA (cerdas)
//  Admin menentukan, untuk setiap hari ujian: berapa mapel & sesi (jam) mana yang dipakai.
//  Lalu aturan komposisi per hari, mis. "1 Diniyyah + 1 Umum". Mapel tiap kelas disebar
//  SERATA mungkin ke semua hari (sesi pertama semua hari diisi dulu, baru sesi kedua, dst.),
//  sehingga tidak ada hari yang menumpuk sementara hari lain kosong.
//  Mapel diambil dari jadwal pelajaran kelas (mapel gabungan otomatis dipecah per mapel).
// ============================================================
const JM = { rows: null };
const _jmKat = (mapelId) => {
  const id = String(mapelId || "").split("::")[0], m = (LOOKUP.mapel || []).find((x) => x.id === id);
  if (!m) return "umum";
  if (m.kategori === "diniyyah" || m.kategori === "umum") return m.kategori;
  return m.masuk_diniyyah && !m.masuk_umum ? "diniyyah" : "umum";
};

async function juSusunMerata() {
  const j = JU.edit; if (!j) return;
  try {
    setGlobalLoading(true, "Membaca jadwal pelajaran…");
    JM.rows = (await supa.from("jadwal_pelajaran").select("kelas_id,mapel_id,guru_id,hari,jam_mulai").eq("aktif", true).then(unwrap)).filter((r) => j.kelas.includes(r.kelas_id) && r.mapel_id);
  } catch (e) { toast("Gagal membaca jadwal pelajaran: " + (e.message || e), "err"); return; }
  finally { setGlobalLoading(false); }
  if (!JM.rows.length) { toast("Jadwal pelajaran kelas peserta masih kosong", "info"); return; }
  if (!j.hari.length || !j.sesi.length) { toast("Atur dulu hari & sesi ujian di ⚙️ Pengaturan jadwal", "err"); return; }
  const mapelIds = [...new Set(JM.rows.map((r) => r.mapel_id))].sort((a, b) => _juNamaMapel(a).localeCompare(_juNamaMapel(b), "id"));
  const adaIsi = Object.values(j.slot || {}).some(_juLabelSlot);
  const sesiCek = (t, n) => j.sesi.map((s, i) => `<label class="jm-sesi"><input type="checkbox" class="jm-s" data-t="${t}" value="${s.id}" ${i < n ? "checked" : ""}><span>Sesi ${i + 1}<small>${s.mulai}–${s.selesai}</small></span></label>`).join("");
  openModal(`<h3>🧠 Susun Merata</h3>
    <div class="ju-susun-ket">Tentukan <b>berapa mapel</b> & <b>jam mana</b> yang dipakai tiap hari. Mapel tiap kelas disebar <b>rata</b> ke semua hari, mengikuti aturan Diniyyah/Umum di bawah.</div>
    <div class="jm-cepat"><span>Atur semua hari:</span>${[1, 2, 3].filter((n) => n <= j.sesi.length).map((n) => `<button class="btn btn-sm btn-outline" onclick="_jmSemua(${n})">${n} Mapel Sehari</button>`).join("")}</div>
    <div class="jm-hari">${j.hari.map((t) => `<div class="jm-baris"><b>${_juHariPanjang(t)}</b><div class="jm-sesi-wadah">${sesiCek(t, Math.min(2, j.sesi.length))}</div></div>`).join("")}</div>
    <label class="form-label" style="margin-top:10px">Aturan Mapel Tiap Hari</label>
    <select id="jm-pola" class="input">
      <option value="campur">Seimbang: tiap hari ada Diniyyah & Umum (sesi pertama Umum)</option>
      <option value="campur-d">Seimbang: tiap hari ada Diniyyah & Umum (sesi pertama Diniyyah)</option>
      <option value="pisah">Hari Diniyyah & hari Umum dipisah (berselang-seling)</option>
      <option value="bebas">Bebas — yang penting rata</option>
    </select>
    <label class="je-opsi"><input type="checkbox" id="jm-urut" checked/> <span>Urutan mengikuti jadwal pelajaran (mapel yang lebih awal di pekan diujikan lebih dulu)</span></label>
    <label class="je-opsi"><input type="checkbox" id="jm-pengampu" checked/> <span>Pengampu Mapel Langsung Jadi Pengawas</span></label>
    ${adaIsi ? `<label class="je-opsi"><input type="checkbox" id="jm-kosongkan" checked/> <span>Kosongkan Dulu Jadwal yang Sudah Terisi</span></label>` : ""}
    <details class="ju-susun-mapel"><summary>Mapel yang diujikan (${mapelIds.length})</summary>
      <div class="ju-cek">${mapelIds.map((m) => `<label><input type="checkbox" class="jm-m" value="${m}" ${_juDiujikan(JU.edit, m) ? "checked" : ""}/> ${_juEsc(_juNamaMapel(m) || "?")} <small>${_jmKat(m) === "diniyyah" ? "· Diniyyah" : "· Umum"}</small></label>`).join("")}</div>
    </details>
    <div id="jm-hitung" class="ju-susun-ket"></div>
    <button class="btn btn-accent" style="width:100%;margin-top:10px;" onclick="_jmJalankan()">Susun Sekarang</button>`, { lebar: true });
  qsa(".jm-s, .jm-m").forEach((c) => c.addEventListener("change", _jmHitung));
  _jmHitung();
}
function _jmSemua(n) {
  JU.edit.hari.forEach((t) => qsa(`.jm-s[data-t="${t}"]`).forEach((c, i) => { c.checked = i < n; }));
  _jmHitung();
}
// Ringkasan kapasitas vs jumlah mapel per kelas
function _jmHitung() {
  const j = JU.edit, el = qs("jm-hitung"); if (!el) return;
  const kap = j.hari.reduce((a, t) => a + qsa(`.jm-s[data-t="${t}"]`).filter((c) => c.checked).length, 0);
  const dipilih = new Set(qsa(".jm-m").filter((c) => c.checked).map((c) => c.value));
  const per = j.kelas.map((k) => { const n = _jmDaftarMapel(k, dipilih).length; return { k, n }; });
  const kurang = per.filter((x) => x.n > kap);
  el.innerHTML = `Tempat tersedia: <b>${kap} sesi</b> per kelas. Jumlah mapel: ${per.map((x) => `Kelas ${_juAngkaKelas(x.k)} <b>${x.n}</b>`).join(" · ")}.${kurang.length ? ` <span style="color:#b91c1c">⚠️ Kurang tempat untuk ${kurang.map((x) => "Kelas " + _juAngkaKelas(x.k)).join(", ")} — tambah sesi/hari.</span>` : " ✅ Cukup."}`;
}
// Daftar mapel ujian satu kelas (mapel gabungan → per mapel), diurutkan menurut kemunculan pertama di jadwal pelajaran
function _jmDaftarMapel(kelasId, dipilih) {
  const urutHari = (h) => (_JU_NAMA_HARI.indexOf(h) + 6) % 7;
  const pertama = {};
  JM.rows.filter((r) => r.kelas_id === kelasId && dipilih.has(r.mapel_id)).forEach((r) => {
    const key = urutHari(r.hari) * 10000 + _juMenit(r.jam_mulai);
    if (!pertama[r.mapel_id] || key < pertama[r.mapel_id].key) pertama[r.mapel_id] = { key, guru: [] };
    if (r.guru_id && !pertama[r.mapel_id].guru.includes(r.guru_id)) pertama[r.mapel_id].guru.push(r.guru_id);
  });
  const out = [];
  Object.entries(pertama).sort((a, b) => a[1].key - b[1].key).forEach(([m, info]) => {
    (_juSubs(m).length ? _juSubs(m) : [null]).forEach((sub) => out.push({ m, sub, guru: info.guru, key: info.key, kat: _jmKat(m) }));
  });
  return out;
}
function _jmJalankan() {
  const j = JU.edit;
  const pola = qs("jm-pola").value, ikutUrut = qs("jm-urut").checked, pengampu = qs("jm-pengampu").checked;
  const kosongkan = qs("jm-kosongkan") ? qs("jm-kosongkan").checked : false;
  const dipilih = new Set(qsa(".jm-m").filter((c) => c.checked).map((c) => c.value));
  // sesi terpakai per hari (urut sesuai urutan sesi)
  const sesiHari = {}; j.hari.forEach((t) => { sesiHari[t] = j.sesi.filter((s) => qsa(`.jm-s[data-t="${t}"]`).some((c) => c.checked && c.value === s.id)); });
  closeModal();
  if (kosongkan) j.slot = {};
  const hari = j.hari.slice().sort();
  let terisi = 0; const sisa = [];
  j.kelas.forEach((k, ki) => {
    const sudahAda = new Set(Object.entries(j.slot).filter(([kk, x]) => kk.endsWith("|" + k) && x && x.m).map(([, x]) => _juKode(x)));
    let daftar = _jmDaftarMapel(k, dipilih).filter((x) => !sudahAda.has(x.sub ? x.m + "::" + x.sub : x.m));
    if (!ikutUrut) daftar = daftar.sort((a, b) => (a.sub || _juNamaMapel(a.m)).localeCompare(b.sub || _juNamaMapel(b.m), "id"));
    const antre = { diniyyah: daftar.filter((x) => x.kat === "diniyyah"), umum: daftar.filter((x) => x.kat !== "diniyyah") };
    // tempat kosong kelas ini, diurutkan: sesi ke-1 semua hari dulu, lalu sesi ke-2, dst. → tersebar rata
    const tempat = [];
    hari.forEach((t, hi) => sesiHari[t].forEach((s, si) => { if (!_juLabelSlot(j.slot[_juKunci(t, s.id, k)])) tempat.push({ t, s, si, hi }); }));
    tempat.sort((a, b) => a.si - b.si || a.hi - b.hi);
    // kategori yang diinginkan untuk tiap tempat
    const mau = (x) => {
      if (pola === "campur") return x.si % 2 === 0 ? "umum" : "diniyyah";
      if (pola === "campur-d") return x.si % 2 === 0 ? "diniyyah" : "umum";
      if (pola === "pisah") return (x.hi + ki) % 2 === 0 ? "diniyyah" : "umum";
      return null;
    };
    const ambil = (kat) => {
      if (kat && antre[kat].length) return antre[kat].shift();
      const lain = kat === "diniyyah" ? "umum" : "diniyyah";
      if (kat && antre[lain].length) return antre[lain].shift();
      // bebas: ambil yang paling awal di jadwal pelajaran dari kedua antrean
      const a = antre.diniyyah[0], b = antre.umum[0];
      if (!a && !b) return null;
      return !b || (a && a.key <= b.key) ? antre.diniyyah.shift() : antre.umum.shift();
    };
    const total = daftar.length;
    // pakai tempat secukupnya saja: jumlah mapel dibagi rata ke hari (sesi akhir hari tidak dipaksa terisi)
    const dipakai = tempat.slice(0, total).sort((a, b) => a.hi - b.hi || a.si - b.si);
    // pola "seimbang": Diniyyah & Umum diselang-seling merata sepanjang hari ujian (sebanding jumlahnya),
    // lalu di tiap hari urutannya mengikuti pilihan (Umum dulu / Diniyyah dulu)
    if (pola === "campur" || pola === "campur-d") {
      const nD = antre.diniyyah.length, nU = antre.umum.length, urutan = [];
      let d = 0, u = 0;
      for (let i = 0; i < dipakai.length; i++) {
        const pilihD = u >= nU || (d < nD && (d + 0.5) / nD <= (u + 0.5) / nU);
        urutan.push(pilihD ? "diniyyah" : "umum"); pilihD ? d++ : u++;
      }
      const duluan = pola === "campur" ? "umum" : "diniyyah";
      let i0 = 0;
      while (i0 < dipakai.length) {
        let i1 = i0; while (i1 < dipakai.length && dipakai[i1].hi === dipakai[i0].hi) i1++;
        const hariIni = urutan.slice(i0, i1).sort((a, b) => (a === duluan ? -1 : 0) - (b === duluan ? -1 : 0));
        for (let i = i0; i < i1; i++) dipakai[i].kat = hariIni[i - i0];
        i0 = i1;
      }
    }
    dipakai.forEach((x) => {
      const it = ambil(x.kat || mau(x)); if (!it) return;
      j.slot[_juKunci(x.t, x.s.id, k)] = { m: it.m, ...(it.sub ? { sub: it.sub } : {}), teks: "", p: pengampu ? it.guru.slice(0, 1) : [] };
      terisi++;
    });
    [...antre.diniyyah, ...antre.umum].forEach((x) => sisa.push(`Kelas ${_juAngkaKelas(k)}: ${x.sub || _juNamaMapel(x.m)}`));
  });
  _juTandai(); _juGambarEditor();
  const namaPola = { campur: "tiap hari Diniyyah & Umum", "campur-d": "tiap hari Diniyyah & Umum", pisah: "hari Diniyyah & Umum berselang", bebas: "bebas" }[pola];
  openModal(`<h3>✅ Jadwal tersusun merata</h3>
    <p>${terisi} mapel ditempatkan di ${hari.length} hari ujian (${namaPola}).</p>
    ${sisa.length ? `<div class="ju-susun-sisa"><b>⚠️ ${sisa.length} mapel belum dapat tempat</b>. Tambah sesi/hari atau naikkan jumlah mapel sehari:<ul>${sisa.map((x) => `<li>${_juEsc(x)}</li>`).join("")}</ul></div>` : `<p class="ju-ket">Semua mapel sudah dapat tempat.</p>`}
    <p class="ju-ket">Periksa lagi (bisa pindah/tukar slot), lalu tekan <b>💾 Simpan</b>.</p>
    <button class="btn btn-accent" style="width:100%" onclick="closeModal()">Oke, Periksa</button>`);
}
// Tombol di bilah editor jadwal
(function () {
  const asli = window._juGambarEditor; if (typeof asli !== "function") return;
  window._juGambarEditor = function () {
    const h = asli.apply(this, arguments);
    const b = qsa("#ju-wadah button").find((x) => /Susun dari Jadwal/.test(x.textContent));
    if (b && !qs("jm-tombol")) b.insertAdjacentHTML("afterend", `<button id="jm-tombol" class="btn btn-accent btn-sm" onclick="juSusunMerata()" title="Susun cerdas: jumlah mapel & jam per hari, rata, Diniyyah/Umum">🧠 Susun Merata</button>`);
    return h;
  };
})();
(function () {
  const st = document.createElement("style");
  st.textContent = `.jm-cepat{display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin:8px 0;font-size:12.5px}
  .jm-hari{display:grid;gap:6px;max-height:42vh;overflow:auto;border:1px solid var(--border-soft,#e3e8ef);border-radius:12px;padding:8px}
  .jm-baris{display:flex;align-items:center;gap:10px;flex-wrap:wrap;font-size:13px}.jm-baris>b{min-width:170px}
  .jm-sesi-wadah{display:flex;gap:6px;flex-wrap:wrap}
  .jm-sesi{display:flex;align-items:center;gap:6px;border:1.5px solid var(--border-soft,#e3e8ef);border-radius:10px;padding:4px 10px;cursor:pointer;font-size:12px}
  .jm-sesi:has(input:checked){border-color:var(--accent,#2563eb);background:color-mix(in srgb,var(--accent,#2563eb) 8%,#fff)}
  .jm-sesi span{display:flex;flex-direction:column;line-height:1.2;font-weight:700}.jm-sesi small{font-weight:500;color:var(--text-secondary)}
  @media(max-width:640px){.jm-baris>b{min-width:0;width:100%}}`;
  document.head.appendChild(st);
})();

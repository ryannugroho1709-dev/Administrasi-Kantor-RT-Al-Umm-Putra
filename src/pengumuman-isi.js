// ============================================================
//  PENGUMUMAN — ISI CEPAT WAKTU, TEMPAT & AGENDA
//  Template undangan (rapat tutor, pengambilan rapor, agenda wali santri) punya baris 🕗 Waktu / 📍 Tempat /
//  📝 Agenda. Admin tidak perlu mengetik di dalam [kurung siku]: pilih jam, pilih tempat (daftar tempat
//  diingat & dipakai bersama), agenda terisi otomatis dari nama kegiatan — teks langsung ikut berubah.
// ============================================================
const PGI = { tempatBawaan: ["Aula PKBM Al Umm", "Masjid Al Umm", "Ruang Guru", "Ruang Kelas", "Kantor PKBM"], tempat: [] };

// Agenda otomatis dari judul kegiatan kalender akademik
function _pgiAgenda(judul, tipe) {
  const j = String(judul || "").toLowerCase();
  if (tipe === "w_rapor" || /rapor/.test(j)) return ["Penyerahan rapor semester", "Diskusi perkembangan ananda bersama wali kelas", "Informasi kegiatan semester berikutnya"];
  if (/pas|pat|uas|sumatif akhir|akhir semester|ujian|asesmen/.test(j)) return ["Jadwal ujian & pembagian pengawas", "Pengumpulan soal dan kunci jawaban", "Teknis pelaksanaan ujian (online & kertas)", "Pengolahan nilai dan batas pengisian rapor"];
  if (/uts|tengah semester/.test(j)) return ["Jadwal UTS & pengawas", "Pengumpulan soal", "Evaluasi pembelajaran setengah semester"];
  if (/awal|semester baru|tahun ajaran|mpls|masa orientasi/.test(j)) return ["Pembagian tugas mengajar & jadwal pelajaran", "Program kerja semester", "Administrasi pembelajaran (modul ajar, jurnal)"];
  if (/evaluasi/.test(j)) return ["Evaluasi kegiatan pembelajaran", "Kendala & solusi", "Rencana tindak lanjut"];
  if (/wali|orang ?tua|parenting/.test(j)) return ["Informasi program sekolah", "Perkembangan santri", "Tanya jawab"];
  return ["Evaluasi kegiatan pembelajaran", "Program sekolah ke depan", "Lain-lain"];
}
const _pgiJam = (v) => String(v || "").replace(":", ".");

async function _pgiMuatTempat() {
  let simpan = {};
  try { simpan = (await _kvAmbil("pengumuman:tempat", {})) || {}; } catch (e) {}
  const pakai = Object.entries(simpan).sort((a, b) => b[1] - a[1]).map(([n]) => n);
  PGI.tempat = [...new Set([...pakai, ...PGI.tempatBawaan])];
  return pakai[0] || "";
}

function _pgiTerapkan() {
  const ta = qs("pg-teks"); if (!ta) return;
  let t = ta.value;
  const jam = qs("pgi-jam")?.value, selesai = qs("pgi-selesai")?.value;
  const tempat = qs("pgi-tempat")?.value === "__lain" ? (qs("pgi-tempat-lain")?.value || "").trim() : qs("pgi-tempat")?.value;
  const agenda = (qs("pgi-agenda")?.value || "").trim();
  if (jam) {
    const w = `${_pgiJam(jam)}${selesai ? "–" + _pgiJam(selesai) : " – selesai"} WITA`;
    t = t.replace(/^(🕗 Waktu: ).*$/m, `$1${w}`).replace(/^(🕗 Pukul ).*$/m, `$1${w}`);
  }
  if (tempat) t = t.replace(/^(📍 Tempat: ).*$/m, `$1${tempat}`).replace(/^📍 (?!Tempat: ).*$/m, `📍 ${tempat}`);
  if (agenda) {
    const baris = agenda.split("\n").map((x) => x.replace(/^\s*\d+[.)]\s*/, "").trim()).filter(Boolean);
    const isi = baris.length > 1 ? "\n" + baris.map((x, i) => `   ${i + 1}. ${x}`).join("\n") : baris[0] || "";
    // ganti baris agenda (beserta daftar bernomor di bawahnya bila sudah pernah diisi)
    if (/^📝 Agenda:/m.test(t)) t = t.replace(/^📝 Agenda:.*(\n {3}\d+\. .*)*/m, `📝 Agenda: ${isi}`);
  }
  ta.value = t;
}

(function () {
  const asli = window._pgBuka; if (typeof asli !== "function") return;
  window._pgBuka = async function (id) {
    await asli.apply(this, arguments);
    const ta = qs("pg-teks"); if (!ta) return;
    const teks = ta.value;
    const adaWaktu = /^🕗 /m.test(teks), adaTempat = /^📍 /m.test(teks), adaAgenda = /^📝 Agenda:/m.test(teks);
    if (!adaWaktu && !adaTempat) return;
    const s = (PG.saran || []).find((x) => x.id === id), k = (s && s.k) || {};
    const terakhir = await _pgiMuatTempat();
    let jamAwal = "08:00";
    const dariKet = /(\d{1,2})[.:](\d{2})/.exec(k.keterangan || "");
    if (dariKet) jamAwal = dariKet[1].padStart(2, "0") + ":" + dariKet[2];
    else try { jamAwal = localStorage.getItem("pgiJam:" + (s ? s.tipe : id)) || jamAwal; } catch (e) {}
    const agendaKosong = adaAgenda && /\[agenda/i.test(teks);
    const agenda = agendaKosong ? _pgiAgenda(k.judul, s && s.tipe) : k.keterangan ? [k.keterangan] : [];
    ta.insertAdjacentHTML("beforebegin", `<div class="pgi">
      <div class="pgi-judul">⚡ Isi Cepat <small>— pilih saja, teks di bawah langsung terisi</small></div>
      <div class="pgi-grid">
        ${adaWaktu ? `<label><span>🕗 Jam Mulai</span><input type="time" id="pgi-jam" class="input" value="${jamAwal}" step="300"></label>
        <label><span>Selesai <small>(boleh kosong)</small></span><input type="time" id="pgi-selesai" class="input" step="300"></label>` : ""}
        ${adaTempat ? `<label class="pgi-lebar"><span>📍 Tempat</span><select id="pgi-tempat" class="input">${PGI.tempat.map((n) => `<option ${n === terakhir ? "selected" : ""}>${escapeHtml(n)}</option>`).join("")}<option value="__lain">✏️ Tempat lain…</option></select>
          <input id="pgi-tempat-lain" class="input" placeholder="Tulis nama tempat" style="display:none;margin-top:6px"></label>` : ""}
        ${adaAgenda ? `<label class="pgi-penuh"><span>📝 Agenda <small>${agendaKosong ? "(terisi otomatis dari nama kegiatan — boleh diubah, satu baris satu agenda)" : ""}</small></span><textarea id="pgi-agenda" class="input" rows="${Math.max(2, agenda.length)}">${escapeHtml(agenda.join("\n"))}</textarea></label>` : ""}
      </div></div>`);
    const ubah = () => _pgiTerapkan();
    ["pgi-jam", "pgi-selesai", "pgi-agenda", "pgi-tempat-lain"].forEach((n) => qs(n)?.addEventListener("input", ubah));
    qs("pgi-tempat")?.addEventListener("change", (e) => { const lain = e.target.value === "__lain"; qs("pgi-tempat-lain").style.display = lain ? "" : "none"; if (lain) qs("pgi-tempat-lain").focus(); ubah(); });
    qs("pgi-jam")?.addEventListener("change", (e) => { try { localStorage.setItem("pgiJam:" + (s ? s.tipe : id), e.target.value); } catch (er) {} });
    _pgiTerapkan();
  };
})();
// Tempat yang dipakai saat menyalin/mengirim diingat (bersama, digabung — tidak menimpa)
(function () {
  const ingat = () => {
    const sel = qs("pgi-tempat"); if (!sel) return;
    const n = sel.value === "__lain" ? (qs("pgi-tempat-lain")?.value || "").trim() : sel.value;
    if (n && typeof _kvGabung === "function") _kvGabung("pengumuman:tempat", { [n]: Date.now() }).catch(() => {});
  };
  for (const nama of ["_pgSalin", "_pgKirim"]) {
    const asli = window[nama]; if (typeof asli !== "function") continue;
    window[nama] = function () { ingat(); return asli.apply(this, arguments); };
  }
})();

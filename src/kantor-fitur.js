// ============================================================
//  🏢 KANTOR PKBM — pembahasan semua fitur jenjang (data hanya dibaca):
//  Ujian & bank soal, Modul Ajar & kop soal, Jadwal & Kalender Akademik, Kehadiran Siswa,
//  Kas / Insentif / Slip Gaji, dan Laporan Lengkap Semua Fitur.
// ============================================================
const _ktTgl = (ms) => new Date(ms + 7 * 3600e3).toISOString().slice(0, 10);
const _ktHitung = (q) => q.then((x) => x.count || 0, () => 0);
const _ktBaris = (q) => q.then((x) => x.data || [], () => []);
const KT_WARNA_RG = { A: "#10b981", Pa: "#3b82f6", Pi: "#ec4899" }, KT_PENDEK_RG = { A: "Paket A", Pa: "Putra", Pi: "Putri" };

async function _ktDataFitur(r) {
  const kini = Date.now(), s30 = new Date(kini - 30 * 864e5).toISOString(), t30 = _ktTgl(kini - 30 * 864e5), hari = _ktTgl(kini), dpn = _ktTgl(kini + 30 * 864e5);
  const [bank, bankBaru, sesi, buka, modul, modulBaru, kop, jadwal, kaldik, jurnal, kas, insentif, slip, ekskul] = await Promise.all([
    _ktHitung(supaSemua.from("ujian_bank").select("id", { count: "exact", head: true }).eq("ruang_id", r)),
    _ktHitung(supaSemua.from("ujian_bank").select("id", { count: "exact", head: true }).eq("ruang_id", r).gte("created_at", s30)),
    _ktBaris(supaSemua.from("ujian_sesi").select("mode,dikirim_rapor_at").eq("ruang_id", r).gte("created_at", s30)),
    _ktHitung(supaSemua.from("ujian_sesi").select("id", { count: "exact", head: true }).eq("ruang_id", r).eq("dibuka", true).is("ditutup_at", null)),
    _ktBaris(supaSemua.from("modul_ajar").select("mapel_id,kelas_id,created_at").eq("ruang_id", r)),
    _ktHitung(supaSemua.from("modul_ajar").select("id", { count: "exact", head: true }).eq("ruang_id", r).gte("created_at", s30)),
    _ktHitung(supaSemua.from("kop_soal").select("id", { count: "exact", head: true }).eq("ruang_id", r)),
    _ktBaris(supaSemua.from("jadwal_pelajaran").select("guru_id,kelas_id,mapel_id").eq("ruang_id", r).neq("aktif", false)),
    _ktBaris(supaSemua.from("kaldik_item").select("judul,jenis,tanggal_mulai,tanggal_selesai").eq("ruang_id", r).gte("tanggal_selesai", hari).lte("tanggal_mulai", dpn).order("tanggal_mulai")),
    _ktBaris(supaSemua.from("jurnal_kelas").select("jumlah_hadir,jumlah_izin,jumlah_sakit,jumlah_alpha,jumlah_siswa").eq("ruang_id", r).gte("tanggal", t30).lte("tanggal", hari)),
    _ktBaris(supaSemua.from("kas_transaksi").select("jenis,nominal").eq("ruang_id", r).gte("tanggal", t30).not("dihapus", "is", true)),
    _ktBaris(supaSemua.from("insentif_musyrif").select("bulan,tahun,jumlah").eq("ruang_id", r).order("tahun", { ascending: false }).order("bulan", { ascending: false }).limit(60)),
    _ktBaris(supaSemua.from("slip_gaji_arsip").select("bulan,tahun,nominal").eq("ruang_id", r).order("tahun", { ascending: false }).order("bulan", { ascending: false }).limit(120)),
    _ktHitung(supaSemua.from("ekskul_master").select("id", { count: "exact", head: true }).eq("ruang_id", r)),
  ]);
  const mapelJadwal = new Set(jadwal.map((x) => x.mapel_id).filter(Boolean)), mapelModul = new Set(modul.map((x) => x.mapel_id).filter(Boolean));
  const sum = (a, k) => a.reduce((s, x) => s + (Number(x[k]) || 0), 0);
  const akhir = (a) => { if (!a.length) return null; const { bulan, tahun } = a[0]; const b = a.filter((x) => x.bulan === bulan && x.tahun === tahun); return { bulan, tahun, n: b.length, total: sum(b, b[0] && "jumlah" in b[0] ? "jumlah" : "nominal") }; };
  const masuk = kas.filter((x) => /masuk|terima|pemasukan/i.test(x.jenis || "")), keluar = kas.filter((x) => /keluar|bayar|pengeluaran/i.test(x.jenis || ""));
  return {
    ujian: { bank, bankBaru, sesi: sesi.length, ujian: sesi.filter((x) => x.mode !== "latihan").length, latihan: sesi.filter((x) => x.mode === "latihan").length, buka, rapor: sesi.filter((x) => x.dikirim_rapor_at).length },
    modul: { n: modul.length, baru: modulBaru, mapel: mapelModul.size, mapelJadwal: mapelJadwal.size, tanpaModul: [...mapelJadwal].filter((m) => !mapelModul.has(m)).length, kop },
    jadwal: { sesi: jadwal.length, guru: new Set(jadwal.map((x) => x.guru_id)).size, kelas: new Set(jadwal.map((x) => x.kelas_id)).size, agenda: kaldik.slice(0, 5), ekskul },
    hadir: { h: sum(jurnal, "jumlah_hadir"), i: sum(jurnal, "jumlah_izin"), s: sum(jurnal, "jumlah_sakit"), a: sum(jurnal, "jumlah_alpha"), pertemuan: jurnal.length },
    kas: { masuk: sum(masuk, "nominal"), keluar: sum(keluar, "nominal"), n: kas.length },
    insentif: akhir(insentif), slip: akhir(slip),
  };
}
const _ktPersenHadir = (x) => { const t = x.h + x.i + x.s + x.a; return t ? Math.round((x.h / t) * 100) : null; };
const _ktFmtTgl = (t) => (t ? new Date(t + "T00:00:00").toLocaleDateString("id-ID", { day: "numeric", month: "short" }) : "");

// pengenal topik tambahan
const _ktTopikAsli = _ktTopik;
_ktTopik = function (teks) {
  const t = " " + teks.toLowerCase() + " ";
  if (/lengkap semua|semua fitur|laporan lengkap|menyeluruh/.test(t)) return "lengkap";
  if (/ujian|bank soal|\bsoal\b|ulangan|\buts\b|\buas\b|latihan soal/.test(t)) return "ujian";
  if (/modul|kop soal|perangkat ajar|bahan ajar/.test(t)) return "modul";
  if (/jadwal|kalender|kaldik|agenda|libur|ekskul/.test(t)) return "jadwal";
  if (/kehadiran siswa|absen siswa|absensi siswa|kehadiran santri|siswa hadir|bolos/.test(t)) return "hadir";
  if (/\bkas\b|insentif|slip|gaji|honor guru|pemasukan|pengeluaran/.test(t)) return "kas";
  return _ktTopikAsli(teks);
};

const _ktSkripAsli = _ktSkrip;
_ktSkrip = async function (topik, teks) {
  if (!["ujian", "modul", "jadwal", "hadir", "kas", "lengkap"].includes(topik)) return _ktSkripAsli(topik, teks);
  const jj = _ktJenjangDari(" " + teks.toLowerCase() + " "), daftar = jj ? [jj] : KT_RG;
  const wakil = (r, pilih) => ((KT.peran[pilih + "-" + r] || []).length ? pilih + "-" + r : (KT.peran["admin-" + r] || []).length ? "admin-" + r : "peny-" + r);
  const data = {}; await Promise.all(daftar.map(async (r) => { data[r] = await _ktDataFitur(r); }));
  const baris = [], arahan = [], tv = [], judul = { ujian: "Rapat Ujian & Bank Soal", modul: "Rapat Modul Ajar", jadwal: "Rapat Jadwal & Kalender", hadir: "Rapat Kehadiran Siswa", kas: "Rapat Kas, Insentif & Gaji", lengkap: "Laporan Lengkap Semua Fitur" }[topik];
  const buka = { ujian: "Ana minta laporan ujian, latihan & bank soal tiap jenjang.", modul: "Bagaimana kelengkapan modul ajar & kop soal tiap jenjang?", jadwal: "Laporkan jadwal pelajaran & agenda kalender akademik 30 hari ke depan.", hadir: "Bagaimana kehadiran santri 30 hari terakhir?", kas: "Bendahara, laporkan kas, insentif & slip gaji.", lengkap: "Bismillah. Ana minta laporan lengkap semua fitur dari tiap jenjang." }[topik];
  baris.push({ kode: "kepala", html: buka, singkat: buka });
  if (topik === "kas") {
    baris.push({ kode: "bendahara", html: "Laporan keuangan harian:" + _ktLi(daftar.map((r) => { const d = data[r]; return `<b>${KT_JENJANG[r]}</b>: kas 30 hari masuk ${_ktRp(d.kas.masuk)}, keluar ${_ktRp(d.kas.keluar)} (${d.kas.n} transaksi)` + (d.insentif ? ` · insentif musyrif ${KT_BLN[d.insentif.bulan] || d.insentif.bulan} ${d.insentif.tahun}: ${_ktRp(d.insentif.total)} (${d.insentif.n} orang)` : "") + (d.slip ? ` · slip gaji ${KT_BLN[d.slip.bulan] || d.slip.bulan} ${d.slip.tahun}: ${d.slip.n} slip, ${_ktRp(d.slip.total)}` : " · belum ada arsip slip gaji"); })), singkat: "Laporan kas, insentif & slip sudah ana sampaikan." });
    daftar.forEach((r) => { const d = data[r]; tv.push({ label: KT_PENDEK_RG[r], nilai: d.kas.keluar || 0.001, teks: (d.kas.keluar / 1e6).toFixed(1) + " jt", warna: KT_WARNA_RG[r] }); if (!d.slip) arahan.push(`${KT_JENJANG[r]}: arsipkan slip gaji bulan ini`); if (d.kas.keluar > d.kas.masuk && d.kas.masuk) arahan.push(`${KT_JENJANG[r]}: pengeluaran kas melebihi pemasukan 30 hari terakhir`); });
  } else {
    for (const r of daftar) {
      const d = data[r], u = d.ujian, m = d.modul, j = d.jadwal, h = d.hadir, ph = _ktPersenHadir(h);
      const isi = {
        ujian: [`Bank soal: <b>${u.bank}</b> paket (${u.bankBaru} baru 30 hari)`, `Sesi 30 hari: ${u.sesi} (ujian ${u.ujian}, latihan ${u.latihan})${u.buka ? ` · <b>${u.buka} sedang dibuka</b>` : ""}`, `${u.rapor} sesi sudah dikirim ke rapor`],
        modul: [`Modul ajar: <b>${m.n}</b> (${m.baru} baru 30 hari), mencakup ${m.mapel} mapel`, m.mapelJadwal ? `${m.tanpaModul ? `<b>${m.tanpaModul} mapel di jadwal belum punya modul</b>` : "Semua mapel di jadwal sudah punya modul ✓"}` : "", `Kop soal tersimpan: ${m.kop}`],
        jadwal: [`Jadwal aktif: <b>${j.sesi}</b> sesi/pekan, ${j.guru} tutor, ${j.kelas} kelas · ekskul ${j.ekskul}`, j.agenda.length ? `Agenda 30 hari: ${j.agenda.map((a) => `${_ktE(a.judul)} (${_ktFmtTgl(a.tanggal_mulai)})`).join(", ")}` : "Tidak ada agenda kalender 30 hari ke depan"],
        hadir: [h.pertemuan ? `Kehadiran santri 30 hari: <b>${ph}%</b> — hadir ${h.h}, izin ${h.i}, sakit ${h.s}, alpha ${h.a} (${h.pertemuan} pertemuan berjurnal)` : "Belum ada jurnal kelas 30 hari terakhir, kehadiran santri belum terekam"],
        lengkap: [`📚 Jadwal ${j.sesi} sesi/pekan · ${j.guru} tutor · ${j.kelas} kelas`, `🧒 Kehadiran santri: ${ph != null ? ph + "%" : "belum terekam"}`, `🧪 Ujian: bank ${u.bank}, sesi 30 hari ${u.sesi}${u.buka ? `, ${u.buka} dibuka` : ""}`, `📘 Modul ${m.n}${m.tanpaModul ? ` (${m.tanpaModul} mapel belum ada)` : ""} · kop soal ${m.kop}`, `🗓️ Agenda: ${j.agenda.length ? j.agenda.slice(0, 3).map((a) => _ktE(a.judul)).join(", ") : "—"}`, `💼 Kas 30 hari: masuk ${_ktRp(d.kas.masuk)}, keluar ${_ktRp(d.kas.keluar)}`],
      }[topik].filter(Boolean);
      const kode = topik === "jadwal" || topik === "lengkap" ? wakil(r, "peny") : wakil(r, "admin");
      baris.push({ kode, html: `<b>${KT_JENJANG[r]}</b>:` + _ktLi(isi), singkat: `${KT_JENJANG[r]}: ${String(isi[0]).replace(/<[^>]+>/g, "")}` });
      const nilaiTv = { ujian: u.sesi, modul: m.n, jadwal: j.sesi, hadir: ph || 0, lengkap: j.sesi }[topik];
      tv.push({ label: KT_PENDEK_RG[r], nilai: nilaiTv || 0.001, teks: topik === "hadir" ? (ph != null ? ph + "%" : "—") : String(nilaiTv), warna: KT_WARNA_RG[r] });
      if ((topik === "ujian" || topik === "lengkap") && !u.bank) arahan.push(`${KT_JENJANG[r]}: belum ada bank soal — tutor mulai menyusun soal`);
      if ((topik === "modul" || topik === "lengkap") && m.tanpaModul) arahan.push(`${KT_JENJANG[r]}: ${m.tanpaModul} mapel belum punya modul ajar`);
      if ((topik === "hadir" || topik === "lengkap") && ph != null && ph < 85) arahan.push(`${KT_JENJANG[r]}: kehadiran santri ${ph}% — Penyelenggara & wali kelas menindaklanjuti`);
      if ((topik === "hadir" || topik === "lengkap") && !h.pertemuan) arahan.push(`${KT_JENJANG[r]}: tutor belum mengisi jurnal (kehadiran santri tidak terekam)`);
      if ((topik === "jadwal" || topik === "lengkap") && !j.sesi) arahan.push(`${KT_JENJANG[r]}: jadwal pelajaran belum disusun`);
    }
    if (topik === "lengkap") {
      try { const b = await _ktSkripAsli("bosp", "bosp"); const bend = b && b.baris.find((x) => x.kode === "bendahara"); if (bend) baris.push(bend); } catch (e) {}
      try { const j = await _ktJawab("sekretaris", "cek data guru"); baris.push({ kode: "sekretaris", html: _ktE(j.teks.split("\n").slice(0, 3).join("\n")).replace(/\n/g, "<br>"), singkat: "Data guru sudah ana rangkum." }); } catch (e) {}
      const tiket = Object.values(KT.tiket || {}).filter((x) => x && (x.status === "baru" || x.status === "dikerjakan")).length;
      if ((KT.peran.it || []).length) baris.push({ kode: "it", html: `Aplikasi: ${tiket} tiket belum selesai.${tiket ? " Ana kerjakan sesuai prioritas." : " Alhamdulillah tidak ada kendala terbuka."}`, singkat: `${tiket} tiket aplikasi belum selesai.` });
    }
  }
  baris.push({ kode: "kepala", html: "Jazakumullahu khairan. Arahan ana:" + _ktLi(arahan.length ? arahan : ["Alhamdulillah berjalan baik. Pertahankan dan laporkan bila ada kendala."]), singkat: arahan.length ? `Ada ${arahan.length} hal untuk ditindaklanjuti.` : "Alhamdulillah, pertahankan." });
  const lanjut = [["Laporan BOSP", "laporan bosp"], ["Evaluasi KBM", "evaluasi kegiatan semua jenjang"], ["Ujian", "laporan ujian"], ["Modul Ajar", "laporan modul ajar"], ["Kehadiran Siswa", "laporan kehadiran siswa"]].filter(([, q]) => _ktTopik(q) !== topik);
  return { baris, judul, tv, ticker: arahan.join("  •  ") || judul, lanjut };
};

// ============================================================
//  🎯 ALUR TUJUAN PEMBELAJARAN (ATP) per kelas & mapel
//  • Draf awal kelas 7 disusun dari CP 2025 Fase D (Kepka BSKAP 046/H/KR/2025) dan bab/sub-bab buku di Modul Ajar.
//  • Alur seperti KOSP: Draf Awal → tutor/Penyelenggara mengusulkan perubahan → Penyelenggara memeriksa →
//    Kepala PKBM (atau Admin) mengesahkan. Data per ruang: kv "atp:<TP>:<kelasId>" → { [mapelId]: {tp, status, …} }.
//  • TP tampil di rincian mapel Silabus & Prosem (dikelompokkan per bab) dan bisa dicetak.
// ============================================================
// [no, teks TP, elemen CP, bab (nomor), buku ("" bila satu buku), perluCek]
const ATP_BAWAAN = {
  "Kelas 7": {
    "Matematika": { cp: "matematika", tp: [
      ["7.1", "Membaca, menulis, membandingkan, dan mengurutkan bilangan bulat menggunakan garis bilangan.", "Bilangan", 1],
      ["7.2", "Melakukan operasi hitung bilangan bulat (penjumlahan, pengurangan, perkalian, pembagian, dan campuran) serta menerapkannya dalam masalah sehari-hari.", "Bilangan", 1],
      ["7.3", "Menentukan faktor, faktorisasi prima, FPB, dan KPK, lalu menggunakannya untuk menyelesaikan masalah.", "Bilangan", 1],
      ["7.4", "Menjelaskan pengertian bilangan rasional dan menyatakannya dalam bentuk pecahan dan desimal.", "Bilangan", 2],
      ["7.5", "Membandingkan dan mengurutkan bilangan rasional.", "Bilangan", 2],
      ["7.6", "Melakukan operasi hitung bilangan rasional (termasuk campuran) dan menerapkannya untuk menyelesaikan masalah, termasuk literasi finansial sederhana.", "Bilangan", 2],
      ["7.7", "Menyatakan perbandingan dua besaran sebagai rasio, menyederhanakan rasio, dan menentukan rasio ekuivalen.", "Bilangan", 3],
      ["7.8", "Menggunakan skala pada peta atau denah untuk menghitung jarak/ukuran sebenarnya.", "Bilangan", 3],
      ["7.9", "Usulan dari CP (menunggu buku semester genap): menyatakan situasi ke dalam bentuk aljabar dan menyederhanakan bentuk aljabar menggunakan sifat komutatif, asosiatif, dan distributif.", "Aljabar", 4, "", true],
      ["7.10", "Usulan dari CP (menunggu buku semester genap): menyajikan data dalam diagram batang/lingkaran serta menentukan rerata, median, modus, dan jangkauan.", "Analisis Data dan Peluang", 4, "", true],
    ] },
    "IPA": { cp: "ilmu-pengetahuan-alam", tp: [
      ["7.1", "Menjelaskan hakikat sains, cabang-cabang ilmu sains, dan perannya dalam kehidupan sehari-hari.", "Pemahaman IPA", 1],
      ["7.2", "Mengenal alat-alat laboratorium IPA beserta fungsinya dan menerapkan aturan keselamatan kerja di laboratorium.", "Keterampilan Proses", 1],
      ["7.3", "Melakukan pengamatan dan merancang percobaan sederhana dengan langkah metode ilmiah (tujuan, hipotesis, variabel, prosedur).", "Keterampilan Proses", 1],
      ["7.4", "Menerapkan pengukuran besaran (panjang, massa, waktu, suhu) dengan alat ukur dan teknik yang benar.", "Pemahaman IPA", 1],
      ["7.5", "Menyajikan data percobaan dalam tabel/grafik, menarik kesimpulan, dan melaporkan hasil percobaan.", "Keterampilan Proses", 1],
      ["7.6", "Menganalisis wujud zat dan sifatnya berdasarkan model partikel serta klasifikasi materi.", "Pemahaman IPA", 2],
      ["7.7", "Menganalisis perubahan wujud zat serta membedakan perubahan fisika dan perubahan kimia.", "Pemahaman IPA", 2],
      ["7.8", "Menentukan massa jenis benda dan menjelaskan peristiwa mengapung, melayang, dan tenggelam.", "Pemahaman IPA", 2],
      ["7.9", "Mengukur suhu dan membandingkan/mengonversi skala suhu.", "Pemahaman IPA", 3],
      ["7.10", "Menganalisis pengaruh kalor dan perpindahannya (konduksi, konveksi, radiasi) terhadap perubahan suhu dan wujud zat.", "Pemahaman IPA", 3],
      ["7.11", "Menjelaskan pemuaian zat padat, cair, dan gas serta pemanfaatan energi kalor dalam kehidupan.", "Pemahaman IPA", 3],
      ["7.12", "Menganalisis ragam gerak dan gaya serta penerapannya dalam teknologi.", "Pemahaman IPA", 4, "", true],
      ["7.13", "Menelaah ciri-ciri makhluk hidup dan mengklasifikasikannya menggunakan kunci determinasi dan sistem lima kingdom.", "Pemahaman IPA", 5],
      ["7.14", "Menganalisis interaksi makhluk hidup dengan lingkungannya (ekosistem, aliran energi, daur biogeokimia) serta merancang upaya pelestarian dan mitigasi perubahan iklim.", "Pemahaman IPA", 6],
      ["7.15", "Menjelaskan sistem tata surya serta pengaruh pergerakan bumi, bulan, dan matahari terhadap kehidupan.", "Pemahaman IPA", 7],
    ] },
    "Bahasa Indonesia": { cp: "bahasa-indonesia", tp: [
      ["7.1", "Menganalisis gagasan utama serta informasi tersurat dan tersirat dalam teks deskripsi yang dibaca atau dipirsa.", "Membaca dan Memirsa", 1],
      ["7.2", "Mengidentifikasi unsur kebahasaan teks deskripsi (ragam bahasa, kata bermakna khusus) dengan bantuan kamus.", "Membaca dan Memirsa", 1],
      ["7.3", "Menganalisis informasi dari teks deskripsi yang didengarkan (informasi lisan).", "Menyimak", 1],
      ["7.4", "Menyunting teks deskripsi sesuai kaidah ejaan (huruf kapital, kata depan, tanda koma).", "Menulis", 1],
      ["7.5", "Menyajikan teks deskripsi sederhana secara tulis dan lisan (mis. vlog) dengan struktur dan rincian yang jelas.", "Berbicara dan Mempresentasikan", 1],
      ["7.6", "Mengidentifikasi jenis, unsur, dan makna puisi rakyat (pantun, syair, gurindam).", "Membaca dan Memirsa", 2],
      ["7.7", "Mengkreasikan puisi rakyat dan menampilkannya (membaca/musikalisasi puisi).", "Berbicara dan Mempresentasikan", 2],
      ["7.8", "Menganalisis unsur intrinsik teks naratif/cerita fantasi (alur, penokohan, majas, kalimat langsung dan tidak langsung).", "Menyimak", 2],
      ["7.9", "Menulis cerita fantasi sederhana dengan alur dan penokohan yang menarik.", "Menulis", 2],
      ["7.10", "Menganalisis gagasan dan informasi teks bertema \"Hal yang Baik bagi Tubuh\" (perlu disesuaikan setelah sub-bab Bab 3 terisi).", "Membaca dan Memirsa", 3, "", true],
    ] },
    "Bahasa Inggris": { cp: "bahasa-inggris", tp: [
      ["7.1", "Memperkenalkan diri dan orang lain serta saling menyapa secara lisan dengan ungkapan sederhana (introducing oneself and others).", "Menyimak - Berbicara (Listening - Speaking)", 1, "", true],
      ["7.2", "Memahami informasi pribadi (nama, asal, tanggal lahir, hobi) dalam teks profil tertulis.", "Membaca - Memirsa (Reading - Viewing)", 1, "", true],
      ["7.3", "Menulis profil diri singkat dengan kalimat sederhana.", "Menulis-Mempresentasikan (Writing - Presenting)", 1, "", true],
      ["7.4", "Membicarakan makanan kesukaan, menyatakan suka dan tidak suka (likes and dislikes).", "Menyimak - Berbicara (Listening - Speaking)", 2, "", true],
      ["7.5", "Memahami informasi dalam teks tentang makanan (menu, deskripsi, atau resep sederhana).", "Membaca - Memirsa (Reading - Viewing)", 2, "", true],
      ["7.6", "Menulis deskripsi singkat tentang makanan kesukaan.", "Menulis-Mempresentasikan (Writing - Presenting)", 2, "", true],
      ["7.7", "Mendeskripsikan ruangan dan benda di rumah menggunakan preposisi tempat (in, on, under, next to).", "Menyimak - Berbicara (Listening - Speaking)", 3, "", true],
      ["7.8", "Memahami teks deskripsi tentang rumah dan ruangannya.", "Membaca - Memirsa (Reading - Viewing)", 3, "", true],
      ["7.9", "Menulis dan mempresentasikan deskripsi rumah sendiri.", "Menulis-Mempresentasikan (Writing - Presenting)", 3, "", true],
    ] },
    "IPS": { cp: "ilmu-pengetahuan-sosial", tp: [
      ["7.1", "Menjelaskan lokasi tempat tinggal (absolut dan relatif) serta kondisi geografisnya menggunakan peta.", "Pemahaman Konsep", 1],
      ["7.2", "Menganalisis konektivitas antarruang dan pengaruhnya terhadap kehidupan masyarakat.", "Pemahaman Konsep", 1],
      ["7.3", "Menjelaskan perubahan iklim, penyebab dan dampaknya, serta pola adaptasi masyarakat.", "Pemahaman Konsep", 1],
      ["7.4", "Mengidentifikasi potensi bencana alam di Indonesia dan upaya mitigasinya.", "Pemahaman Konsep", 1],
      ["7.5", "Menjelaskan bentuk-bentuk interaksi sosial di lingkungan sekitar.", "Pemahaman Konsep", 1],
      ["7.6", "Menjelaskan konsep dasar ilmu sejarah (ruang, waktu, perubahan, dan keberlanjutan).", "Pemahaman Konsep", 1],
      ["7.7", "Mengidentifikasi keberagaman lingkungan alam dan masyarakat di sekitar.", "Pemahaman Konsep", 2],
      ["7.8", "Mempraktikkan pembiasaan diri melestarikan sumber daya udara, air, dan tanah.", "Keterampilan Proses", 2],
      ["7.9", "Menjelaskan pembangunan berkelanjutan dan tujuan-tujuannya (SDGs) dalam konteks lokal.", "Pemahaman Konsep", 2],
      ["7.10", "Mengidentifikasi masalah pokok ekonomi dan upaya masyarakat memenuhi kebutuhannya.", "Pemahaman Konsep", 2],
    ] },
    "PJOK": { cp: "pendidikan-jasmani-olahraga-dan-kesehatan", tp: [
      ["7.1", "Mempraktikkan variasi dan kombinasi gerak dasar bola basket (melempar, menangkap, pivot, menembak, rebound).", "Terampil Bergerak", 1],
      ["7.2", "Bermain bola basket dengan peraturan yang dimodifikasi secara sportif dan bekerja sama.", "Belajar Melalui Gerak", 1],
      ["7.3", "Mempraktikkan teknik dasar bola voli (passing, servis, smash, bendungan).", "Terampil Bergerak", 2],
      ["7.4", "Bermain bola voli dengan peraturan sederhana/dimodifikasi.", "Belajar Melalui Gerak", 2],
      ["7.5", "Mempraktikkan gerak dasar permainan kasti (lempar-tangkap, memukul, berlari ke tiang hinggap) dan memainkannya.", "Terampil Bergerak", 3],
      ["7.6", "Mempraktikkan teknik dasar pencak silat (pukulan, tendangan, tangkisan, elakan).", "Terampil Bergerak", 4],
      ["7.7", "Mempraktikkan teknik lari jarak pendek (start, gerakan lari, finis).", "Terampil Bergerak", 5, "", true],
      ["7.8", "Mempraktikkan gerakan senam lantai (rol depan dan rol belakang) dengan aman.", "Terampil Bergerak", 6],
      ["7.9", "Mempraktikkan aktivitas gerak berirama (langkah kaki dan ayunan lengan).", "Terampil Bergerak", 7],
      ["7.10", "Mengukur komponen kebugaran terkait kesehatan (IMT, kekuatan dan daya tahan otot, kelenturan) dan menjelaskan reaksi tubuh.", "Bergaya Hidup Aktif", 8],
      ["7.11", "Merancang pola makan sehat, bergizi, dan seimbang sesuai kebutuhan aktivitas jasmani.", "Memilih Hidup yang Menyehatkan", 9],
    ] },
    "PPKN/Seni Budaya": { cp: "pendidikan-pancasila", tp: [
      ["7.1", "Menjelaskan sejarah kelahiran Pancasila dalam sidang BPUPK.", "Pancasila", 1, "PPKn"],
      ["7.2", "Menjelaskan perumusan Pancasila oleh Panitia Sembilan serta penetapannya sebagai dasar negara oleh PPKI.", "Pancasila", 1, "PPKn"],
      ["7.3", "Menjelaskan makna sila-sila Pancasila.", "Pancasila", 2, "PPKn"],
      ["7.4", "Menerapkan nilai-nilai Pancasila dalam kehidupan bermasyarakat.", "Pancasila", 2, "PPKn"],
      ["7.5", "Menjelaskan hakikat manusia sebagai makhluk Tuhan, makhluk individu, dan makhluk sosial.", "Undang-Undang Dasar Negara Republik Indonesia Tahun 1945", 3, "PPKn"],
      ["7.6", "Menjelaskan pengertian dan macam-macam norma serta menerapkan perilaku sesuai norma.", "Undang-Undang Dasar Negara Republik Indonesia Tahun 1945", 3, "PPKn"],
      ["7.7", "Usulan dari CP (menunggu buku semester genap): mengidentifikasi keberagaman dalam bingkai Bhinneka Tunggal Ika dan memahami wilayah NKRI.", "Bhinneka Tunggal Ika", 4, "PPKn", true],
      ["SR.1", "Menganalisis unsur rupa dan prinsip desain pada komposisi bentuk geometris.", "Mengalami (Experiencing)", 1, "Seni Rupa"],
      ["SR.2", "Menggambar komposisi bentuk geometris dengan teknik arsir.", "Berpikir dan Bekerja Artistik (Thinking and Working Artistically)", 1, "Seni Rupa"],
      ["SR.3", "Membuat karya gambar alam benda berdasarkan pengamatan.", "Menciptakan (Making/Creating)", 1, "Seni Rupa"],
      ["SR.4", "Mendesain ragam hias organis dan geometris.", "Menciptakan (Making/Creating)", 2, "Seni Rupa"],
      ["SR.5", "Menerapkan desain pola ragam hias pada benda.", "Berdampak (Impacting)", 2, "Seni Rupa"],
      ["SR.6", "Menjelaskan sejarah dan dasar tipografi, lalu membuat logo sederhana.", "Menciptakan (Making/Creating)", 3, "Seni Rupa"],
      ["SR.7", "Merefleksikan dan mengapresiasi karya sendiri serta karya teman.", "Merefleksikan (Reflecting)", 3, "Seni Rupa"],
      ["SR.8", "Berkarya seni rupa untuk menyuarakan perubahan di lingkungan sekitar.", "Berdampak (Impacting)", 4, "Seni Rupa"],
    ] },
  },
};
const ATP_STATUS = { bawaan: ["Draf Awal", "#64748b"], usulan: ["Usulan Tutor", "#2563eb"], diperiksa: ["Diperiksa Penyelenggara", "#d97706"], disahkan: ["Disahkan Kepala PKBM", "#16a34a"] };
const ATP = { data: {}, kunci: "" };
const _atpKunci = () => `atp:${SP.th}:${SP.kelasId}`;
const _atpE = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const _atpPeny = () => typeof RG !== "undefined" && (RG.penyelenggara || []).includes(STATE.guruId);
const _atpKepala = () => (typeof isAdmin === "function" && isAdmin()) || (typeof isKepsek === "function" && isKepsek() && !_atpPeny());
const _atpBolehUsul = (mapelId) => _spBoleh() || SP.jadwal.some((j) => j.mapel_id === mapelId && j.guru_id === STATE.guruId);

async function _atpMuat() { const k = _atpKunci(); if (ATP.kunci === k) return; ATP.kunci = k; try { ATP.data = (await _kvAmbil(k, {})) || {}; } catch (e) { ATP.data = {}; } }
function atpMapel(mapelId) {
  const d = ATP.data[mapelId]; if (d && (d.tp || []).length) return { ...d };
  const kls = _spKelas(SP.kelasId).nama_kelas, nm = _spMapel(mapelId).nama_mapel, b = ((ATP_BAWAAN[kls] || {})[nm]) || null;
  if (!b) return null;
  return { cp: b.cp, status: "bawaan", tp: b.tp.map(([no, teks, el, bab, buku, cek], i) => ({ id: "w" + i, no, teks, el, bab, buku: buku || "", cek: !!cek })) };
}
// TP milik bab tertentu (nomor bab & buku sama)
const atpUntukBab = (a, b) => (a ? a.tp.filter((t) => Number(t.bab) === Number(b.no) && (t.buku || "") === (b.buku || "")) : []);

function _atpHtmlBlok(mapelId) {
  const a = atpMapel(mapelId); if (!a) return `<div class="atp-blok"><h4>🎯 Alur Tujuan Pembelajaran</h4><p class="cpk-redup">Belum ada ATP untuk mapel ini.${_spBoleh() ? " Tekan Susun ATP untuk membuatnya." : ""}</p>${_spBoleh() ? `<button class="btn btn-sm btn-ghost" onclick="atpUbah('${mapelId}')">✏️ Susun ATP</button>` : ""}</div>`;
  const st = ATP_STATUS[a.status] || ATP_STATUS.bawaan, d = _spMapelData(mapelId), bab = ["ganjil", "genap"].flatMap((s) => _spBabSem(d, s));
  const lain = a.tp.filter((t) => !bab.some((b) => Number(b.no) === Number(t.bab) && (b.buku || "") === (t.buku || "")));
  const kartuTp = (t) => `<li class="${t.cek ? "cek" : ""}"><b>${_atpE(t.no)}</b><span>${_atpE(t.teks)}<small>Elemen: ${_atpE(t.el)}</small></span></li>`;
  const peny = _atpPeny() || (typeof isAdmin === "function" && isAdmin()), kepala = _atpKepala();
  return `<div class="atp-blok" style="--as:${st[1]}">
    <div class="atp-kepala"><h4>🎯 Alur Tujuan Pembelajaran (ATP)</h4><em>${st[0]}</em>
      ${a.oleh ? `<small>${a.status === "disahkan" ? "Disahkan" : a.status === "diperiksa" ? "Diperiksa" : "Diusulkan"} oleh ${_atpE(String(a.oleh).split(",")[0])} · ${new Date(a.t || Date.now()).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</small>` : ""}</div>
    ${a.status === "bawaan" ? `<div class="atp-info">📝 <b>Draf awal</b> disusun dari CP 2025 Fase D dan bab/sub-bab buku. TP bertanda <span class="atp-tanda">perlu dicek</span> belum bisa dipastikan dari buku. Tutor dan Penyelenggara silakan merevisi, lalu Kepala PKBM mengesahkan.</div>` : ""}
    ${bab.map((b) => { const t = atpUntukBab(a, b); return t.length ? `<div class="atp-bab"><div class="atp-bab-j">${b.buku ? _atpE(b.buku) + " · " : ""}Bab ${b.no} ${_atpE(b.judul || "")} <small>Semester ${b.sem === "ganjil" ? "Ganjil" : "Genap"}</small></div><ol>${t.map(kartuTp).join("")}</ol></div>` : ""; }).join("")}
    ${lain.length ? `<div class="atp-bab"><div class="atp-bab-j">TP yang belum terhubung ke bab</div><ol>${lain.map(kartuTp).join("")}</ol></div>` : ""}
    <div class="atp-aksi">${_atpBolehUsul(mapelId) ? `<button class="btn btn-sm btn-ghost" onclick="atpUbah('${mapelId}')">✏️ ${a.status === "bawaan" ? "Revisi & Usulkan" : "Ubah ATP"}</button>` : ""}
      ${peny && a.status === "usulan" ? `<button class="btn btn-sm btn-ghost" onclick="atpStatus('${mapelId}','diperiksa')">✓ Tandai Sudah Diperiksa</button>` : ""}
      ${kepala && ["usulan", "diperiksa", "bawaan"].includes(a.status) ? `<button class="btn btn-sm btn-accent" onclick="atpStatus('${mapelId}','disahkan')">🖋️ Sahkan ATP</button>` : ""}
      <button class="btn btn-sm btn-ghost" onclick="atpCetak('${mapelId}')">🖨️ Cetak ATP</button></div></div>`;
}
function atpUbah(mapelId) {
  if (!_atpBolehUsul(mapelId)) return;
  const a = atpMapel(mapelId) || { cp: "", tp: [] }, mp = _spMapel(mapelId), d = _spMapelData(mapelId), bab = ["ganjil", "genap"].flatMap((s) => _spBabSem(d, s));
  ATP.edit = { mapelId, cp: a.cp, tp: a.tp.map((t) => ({ ...t })) };
  const opsiBab = (t) => bab.map((b) => `<option value="${b.no}|${_atpE(b.buku || "")}" ${Number(t.bab) === Number(b.no) && (t.buku || "") === (b.buku || "") ? "selected" : ""}>${_atpE((b.buku ? b.buku + " · " : "") + "Bab " + b.no)}</option>`).join("");
  const gambar = () => {
    openModal(`<div class="sp-modal"><h3>ATP — ${_atpE(mp.nama_mapel)} · ${_atpE(_spKelas(SP.kelasId).nama_kelas)}</h3>
      <p class="bsp-ket">Tulis tiap Tujuan Pembelajaran dengan kata kerja yang terukur. Perubahan disimpan sebagai <b>usulan</b>, lalu diperiksa Penyelenggara dan disahkan Kepala PKBM.</p>
      <div class="atp-ed">${ATP.edit.tp.map((t, i) => `<div class="atp-ed-b"><input class="input" style="width:64px" value="${_atpE(t.no)}" oninput="ATP.edit.tp[${i}].no=this.value">
        <textarea class="input" rows="2" oninput="ATP.edit.tp[${i}].teks=this.value;ATP.edit.tp[${i}].cek=false">${_atpE(t.teks)}</textarea>
        <div class="atp-ed-k"><select class="input" onchange="const [n,b]=this.value.split('|');ATP.edit.tp[${i}].bab=Number(n);ATP.edit.tp[${i}].buku=b">${opsiBab(t)}</select>
        <input class="input" value="${_atpE(t.el)}" placeholder="Elemen CP" oninput="ATP.edit.tp[${i}].el=this.value"><button class="btn btn-sm btn-ghost" onclick="ATP.edit.tp.splice(${i},1);ATP.gambar()">🗑️</button></div></div>`).join("")}</div>
      <button class="btn btn-ghost" onclick="const b=ATP.edit.tp[ATP.edit.tp.length-1]||{};ATP.edit.tp.push({id:'t'+Date.now(),no:'',teks:'',el:b.el||'',bab:b.bab||1,buku:b.buku||''});ATP.gambar()">+ Tambah TP</button>
      <div class="bsp-aksi-bawah"><button class="btn btn-outline" onclick="closeModal()">Batal</button><button class="btn btn-accent" onclick="atpSimpan()">Simpan sebagai Usulan</button></div></div>`, { lebar: true });
  };
  ATP.gambar = gambar; gambar();
}
async function atpSimpan() {
  const E = ATP.edit; if (!E) return;
  const tp = E.tp.filter((t) => String(t.teks || "").trim()).map((t) => ({ id: t.id, no: String(t.no || "").trim(), teks: String(t.teks).trim(), el: t.el || "", bab: Number(t.bab) || 1, buku: t.buku || "", cek: !!t.cek }));
  if (!tp.length) { toast("Isi minimal satu TP", "err"); return; }
  try {
    await _kvGabung(_atpKunci(), { [E.mapelId]: null });
    ATP.data = await _kvGabung(_atpKunci(), { [E.mapelId]: { cp: E.cp, tp, status: "usulan", oleh: STATE.guruNama || "", t: Date.now() } });
    if (typeof _rgLog === "function") _rgLog("atp-usul", { kelas: _spKelas(SP.kelasId).nama_kelas, mapel: _spMapel(E.mapelId).nama_mapel, tp: tp.length });
    closeModal(); toast("ATP disimpan sebagai usulan", "ok"); _spGambar();
  } catch (e) { toast("Gagal: " + (e.message || e), "err"); }
}
async function atpStatus(mapelId, status) {
  const a = atpMapel(mapelId); if (!a) return;
  if (status === "disahkan" && !_atpKepala()) return; if (status === "diperiksa" && !(_atpPeny() || isAdmin())) return;
  if (status === "disahkan" && !(await konfirmasiTema(`Sahkan ATP ${_spMapel(mapelId).nama_mapel} ${_spKelas(SP.kelasId).nama_kelas}${a.status === "bawaan" ? " (masih draf awal, belum direvisi tutor)" : ""}?`, { judul: "Sahkan ATP", teksOk: "Sahkan" }))) return;
  try {
    await _kvGabung(_atpKunci(), { [mapelId]: null });
    ATP.data = await _kvGabung(_atpKunci(), { [mapelId]: { cp: a.cp, tp: a.tp, status, oleh: STATE.guruNama || "", t: Date.now() } });
    if (typeof _rgLog === "function") _rgLog("atp-" + status, { kelas: _spKelas(SP.kelasId).nama_kelas, mapel: _spMapel(mapelId).nama_mapel });
    toast(status === "disahkan" ? "ATP disahkan" : "ATP ditandai sudah diperiksa", "ok"); _spGambar();
  } catch (e) { toast("Gagal: " + (e.message || e), "err"); }
}
function atpCetak(mapelId) {
  const a = atpMapel(mapelId); if (!a) return; const d = _spMapelData(mapelId), bab = ["ganjil", "genap"].flatMap((s) => _spBabSem(d, s)), st = ATP_STATUS[a.status] || ATP_STATUS.bawaan;
  const w = window.open("", "_blank"); if (!w) { toast("Izinkan jendela baru untuk mencetak", "err"); return; }
  w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>ATP ${_atpE(_spMapel(mapelId).nama_mapel)}</title><style>body{font-family:Arial,sans-serif;font-size:11px;margin:16mm}h1{font-size:15px;text-align:center;margin:0}p.s{text-align:center;margin:3px 0 12px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #555;padding:4px;vertical-align:top}th{background:#eee}@page{size:A4;margin:12mm}</style></head><body>
    <h1>ALUR TUJUAN PEMBELAJARAN (ATP)</h1><p class="s">${_atpE(_spMapel(mapelId).nama_mapel)} · ${_atpE(_spKelas(SP.kelasId).nama_kelas)} · Fase D · Tahun Pelajaran ${_atpE(SP.th)} · Status: ${st[0]}<br>Acuan: CP 2025 (Kepka BSKAP 046/H/KR/2025)</p>
    <table><thead><tr><th style="width:9%">Kode</th><th>Tujuan Pembelajaran</th><th style="width:22%">Elemen CP</th><th style="width:20%">Bab</th><th style="width:9%">Semester</th></tr></thead><tbody>
    ${a.tp.map((t) => { const b = bab.find((x) => Number(x.no) === Number(t.bab) && (x.buku || "") === (t.buku || "")); return `<tr><td>${_atpE(t.no)}</td><td>${_atpE(t.teks)}</td><td>${_atpE(t.el)}</td><td>${b ? _atpE((b.buku ? b.buku + " · " : "") + "Bab " + b.no + " " + (b.judul || "")) : "Bab " + t.bab}</td><td>${b ? (b.sem === "ganjil" ? "Ganjil" : "Genap") : ""}</td></tr>`; }).join("")}</tbody></table>
    <script>setTimeout(()=>print(),400)<\/script></body></html>`);
  w.document.close();
}

// ── pemasangan: ATP tampil di rincian mapel Silabus & Prosem ──
(function () {
  if (typeof _spMuat === "function") { const a = _spMuat; _spMuat = async function () { ATP.kunci = ""; const r = a.apply(this, arguments); try { await _atpMuat(); } catch (e) {} await r; if (typeof _spGambar === "function") _spGambar(); return r; }; }
  if (typeof _spHtmlRinci === "function") {
    const a = _spHtmlRinci;
    _spHtmlRinci = function (id) {
      let h = a.apply(this, arguments);
      try { const blok = _atpHtmlBlok(id); const i = h.lastIndexOf('<div class="sp-r-aksi">'); h = i > 0 ? h.slice(0, i) + blok + h.slice(i) : h + blok; } catch (e) { console.warn("ATP:", e); }
      return h;
    };
  }
})();

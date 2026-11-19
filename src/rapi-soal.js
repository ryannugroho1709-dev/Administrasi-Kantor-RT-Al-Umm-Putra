// ============================================================
//  PEMERIKSA KERAPIAN TEKS SOAL + RAPIKAN DENGAN AI
//  • rapiCek(teks): mencari bagian yang kurang rapi (pilihan menyatu dengan soal, pilihan menempel,
//    beberapa soal dalam satu baris, soal belum bernomor, nomor melompat/ganda, teks kop ikut tertempel).
//  • rapiPasang(textarea, opsi): menandai baris itu dengan sorotan KUNING langsung di kotak teks,
//    menampilkan daftar pengingat, dan tombol "Rapikan Dengan AI" (fungsi server "rapikan-soal").
//  Dipakai di: Tempel Teks Soal → Word (soal-word.js) dan Masukkan Soal (ujian-editor.js).
// ============================================================
const _RAPI_OPSI = /^\s*\*?\(?([a-eA-E]|[أبجده])\s*[.)]\s*\S/;
const _RAPI_NO = /^\s*\(?([0-9٠-٩]{1,3})\s*[.)\-]\s*\S/;
const _RAPI_JUDUL = /^\s*(?:[A-H]|[IVX]{1,4})\s*[.)]\s+\S|^\s*(pilihan\s+ganda|isian|uraian|essay|esai|menjodohkan|benar\s*[-/]?\s*salah)\b/i;
const _RAPI_KOP = /(asesmen\s+sumatif|izin\s+operasional|tahun\s+ajaran|penilaian\s+(akhir|tengah)\s+semester|ujian\s+tengah\s+semester|^\s*(nama|kelas|no\.?\s*absen)\s*:?\s*$|\bjl\.\s|\btelp\b|\bkode\s*pos\b)/i;
const _rapiAngka = (s) => Number(String(s).replace(/[٠-٩]/g, (d) => d.charCodeAt(0) - 0x660));
const _RAPI_UJUNG = /(\.{3,}|…|_{3,}|\?)\s*$/;

function rapiCek(teks) {
  const baris = String(teks || "").replace(/\r/g, "").split("\n");
  const hasil = [];
  const tanda = (i, alasan) => { const ada = hasil.find((h) => h.i === i); if (!ada) hasil.push({ i, alasan }); else if (!ada.alasan.includes(alasan)) ada.alasan += " · " + alasan; };
  let noAkhir = 0, subAkhir = 0, sebelum = { jenis: "awal" };
  baris.forEach((raw, i) => {
    const l = raw.trim();
    if (!l) return;
    const no = l.match(_RAPI_NO), opsi = !no && _RAPI_OPSI.test(l), judul = !no && !opsi && l.length < 120 && _RAPI_JUDUL.test(l);
    // 1. teks kop / identitas yang ikut tertempel
    if (!no && !opsi && _RAPI_KOP.test(l) && l.length < 200) tanda(i, "Teks kop/identitas ikut tertempel — hapus, kop dipasang otomatis");
    // 2. pilihan menyatu dengan soal: "…. a. Perintah"
    if (/(\.{3,}|…|\?)\s*\(?[aA][.)]\s*\S/.test(l)) tanda(i, "Pilihan jawaban menyatu dengan soal — pindahkan tiap pilihan ke baris baru");
    // 3. pilihan menempel tanpa spasi: "Perintahb. Larangan"
    // (harus berurutan b. lalu c. yang sama-sama menempel, supaya kalimat biasa "…one. The" tidak ikut tertandai)
    else if (/[a-zà-ÿ'’)\]]b[.)]\s?\S[^\n]{0,160}?[a-zà-ÿ'’)\]]c[.)]\s?\S/.test(l)) tanda(i, "Pilihan menempel tanpa spasi (mis. \"Perintahb.\") — tiap pilihan di baris sendiri");
    // 4. beberapa soal dalam satu baris
    if ((l.match(/\.{4,}|…{1,}\s*[A-Za-z]/g) || []).length >= 2 && l.length > 120) tanda(i, "Beberapa soal dalam satu baris — pisahkan dan beri nomor");
    // 5. nomor soal melompat / ganda
    //    daftar bernomor di dalam soal (mulai lagi dari 1) dianggap anak-daftar, bukan nomor soal
    if (judul) { noAkhir = 0; subAkhir = 0; }
    if (no) {
      const n = _rapiAngka(no[1]);
      if (subAkhir && n === subAkhir + 1) subAkhir = n;
      else if (noAkhir > 1 && n === 1) subAkhir = 1;
      else {
        if (noAkhir && n === noAkhir) tanda(i, `Nomor ${n} dipakai dua kali`);
        else if (noAkhir && n > noAkhir + 1) tanda(i, `Nomor melompat dari ${noAkhir} ke ${n} — ada soal yang belum bernomor?`);
        noAkhir = n; subAkhir = 0;
      }
    }
    // 6. soal belum bernomor: baris pertanyaan sesudah pilihan/judul/soal tanpa nomor
    if (!no && !opsi && !judul && _RAPI_UJUNG.test(l) && (sebelum.jenis === "opsi" || sebelum.jenis === "judul" || sebelum.jenis === "tanpaNo")) {
      tanda(i, "Soal belum bernomor — awali dengan nomor urut");
      sebelum = { jenis: "tanpaNo" }; return;
    }
    sebelum = { jenis: no ? "soal" : opsi ? "opsi" : judul ? "judul" : "teks" };
  });
  return hasil.sort((a, b) => a.i - b.i);
}

// ── Sorotan kuning di kotak teks (lapisan di belakang textarea yang ikut menggulir) ──
function rapiPasang(ta, opsi = {}) {
  if (!ta || ta._rapi) return;
  const wadah = document.createElement("div"); wadah.className = "rapi-wadah";
  const sorot = document.createElement("div"); sorot.className = "rapi-sorot"; sorot.setAttribute("aria-hidden", "true");
  ta.parentNode.insertBefore(wadah, ta); wadah.appendChild(sorot); wadah.appendChild(ta);
  const info = document.createElement("div"); info.className = "rapi-info";
  wadah.after(info);
  const gayaAwal = getComputedStyle(ta);
  wadah.style.setProperty("--rapi-bg", gayaAwal.backgroundColor === "rgba(0, 0, 0, 0)" ? "var(--card-bg, #fff)" : gayaAwal.backgroundColor);
  wadah.style.borderRadius = gayaAwal.borderRadius;
  ta.classList.add("rapi-ta");
  const salinGaya = () => {
    const s = getComputedStyle(ta);
    ["fontFamily", "fontSize", "fontWeight", "lineHeight", "letterSpacing", "paddingTop", "paddingRight", "paddingBottom", "paddingLeft",
      "borderTopWidth", "borderRightWidth", "borderBottomWidth", "borderLeftWidth", "textAlign", "direction", "tabSize", "wordSpacing"].forEach((k) => { sorot.style[k] = s[k]; });
    sorot.style.borderStyle = "solid"; sorot.style.borderColor = "transparent";
  };
  const e = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  let tunda = null;
  const segar = () => {
    salinGaya();
    const temuan = rapiCek(ta.value), set = new Map(temuan.map((t) => [t.i, t.alasan]));
    sorot.innerHTML = ta.value.split("\n").map((b, i) => set.has(i) ? `<mark title="${e(set.get(i))}">${e(b) || " "}</mark>` : e(b)).join("\n") + "\n ";
    sorot.scrollTop = ta.scrollTop;
    const bolehAI = !ta.readOnly && opsi.ai !== false;
    info.innerHTML = !ta.value.trim() ? "" : (temuan.length
      ? `<div class="rapi-awas"><div class="rapi-awas-h"><b>⚠️ ${temuan.length} bagian kurang rapi</b><small>Ditandai kuning di kotak teks. Ketuk untuk menuju barisnya.</small>
          ${bolehAI ? `<button type="button" class="btn btn-sm btn-accent rapi-ai-btn">✨ Rapikan Dengan AI</button>` : ""}</div>
          <ol>${temuan.slice(0, 8).map((t) => `<li data-i="${t.i}"><span>Baris ${t.i + 1}</span> ${e(t.alasan)}</li>`).join("")}${temuan.length > 8 ? `<li class="lagi">… dan ${temuan.length - 8} lagi</li>` : ""}</ol></div>`
      : `<div class="rapi-ok">✅ Susunan teks sudah rapi</div>`) + (ta._rapiAsli != null ? `<div class="rapi-sesudah">✨ Teks sudah dirapikan AI — periksa lagi isinya sebelum disimpan. <button type="button" class="btn btn-sm btn-ghost rapi-urung">Urungkan</button></div>` : "");
    info.querySelectorAll("li[data-i]").forEach((li) => li.onclick = () => rapiKeBaris(ta, Number(li.dataset.i)));
    const b = info.querySelector(".rapi-ai-btn"); if (b) b.onclick = () => rapiDenganAI(ta, b, opsi);
    const u = info.querySelector(".rapi-urung"); if (u) u.onclick = () => { ta.value = ta._rapiAsli; ta._rapiAsli = null; ta.dispatchEvent(new Event("input", { bubbles: true })); segar(); };
    if (opsi.sesudah) opsi.sesudah(temuan);
  };
  ta.addEventListener("input", () => { clearTimeout(tunda); tunda = setTimeout(segar, 150); });
  ta.addEventListener("scroll", () => { sorot.scrollTop = ta.scrollTop; sorot.scrollLeft = ta.scrollLeft; });
  if (window.ResizeObserver) new ResizeObserver(() => { sorot.style.height = ta.offsetHeight + "px"; }).observe(ta);
  ta._rapi = { segar };
  segar();
}
function rapiSegar(ta) { if (ta && ta._rapi) ta._rapi.segar(); }
function rapiKeBaris(ta, i) {
  const b = ta.value.split("\n");
  const awal = b.slice(0, i).reduce((a, x) => a + x.length + 1, 0);
  ta.focus(); ta.setSelectionRange(awal, awal + (b[i] || "").length);
  const tinggi = parseFloat(getComputedStyle(ta).lineHeight) || 20;
  ta.scrollTop = Math.max(0, i * tinggi - ta.clientHeight / 3);
}
async function rapiDenganAI(ta, tombol, opsi = {}) {
  if (typeof AK === "undefined" || !AK.guru) { toast("Masuk dengan akun dulu untuk memakai Rapikan Dengan AI", "warn"); return; }
  const teks = ta.value;
  if (!teks.trim()) return;
  tombol.disabled = true; tombol.textContent = "⏳ AI sedang merapikan…";
  try {
    const { data, error } = await AK.klien.functions.invoke("rapikan-soal", { body: { teks } });
    if (error) {
      let pesan = error.message || "Gagal menghubungi server";
      try { if (error.context && typeof error.context.json === "function") { const p = await error.context.json(); if (p && p.error) pesan = p.error; } } catch (e) {}
      if (/Failed to send|not found|404/i.test(pesan)) pesan = "Fungsi server \"rapikan-soal\" belum dipasang. Hubungi admin.";
      throw new Error(pesan);
    }
    if (!data || !data.teks) throw new Error((data && data.error) || "AI tidak mengembalikan teks");
    ta._rapiAsli = teks;
    ta.value = data.teks;
    ta.dispatchEvent(new Event("input", { bubbles: true }));
    rapiSegar(ta);
    toast(`✨ Teks dirapikan AI${data.sisa != null ? ` · sisa ${data.sisa}× hari ini` : ""}`, "ok");
    if (typeof _rgLog === "function") _rgLog("rapikan-ai", { huruf: teks.length });
  } catch (e) { toast(e.message || String(e), "err"); tombol.disabled = false; tombol.textContent = "✨ Rapikan Dengan AI"; }
}
// Pengingat sebelum membuat / mengumpulkan (tanpa menutup jendela): true = lanjut.
// Tekan pertama → diingatkan & daftar kuning disorot; tekan kedua dengan teks yang sama → tetap lanjut.
function rapiPengingat(ta) {
  if (!ta) return true;
  const n = rapiCek(ta.value).length;
  if (!n || ta._rapiIngat === ta.value) return true;
  ta._rapiIngat = ta.value;
  const info = ta.closest(".rapi-wadah")?.nextElementSibling;
  if (info) { info.scrollIntoView({ block: "center", behavior: "smooth" }); info.classList.add("rapi-kedip"); setTimeout(() => info.classList.remove("rapi-kedip"), 1800); }
  toast(`Masih ada ${n} bagian kurang rapi (ditandai kuning). Rapikan dulu, atau tekan tombolnya sekali lagi untuk tetap lanjut.`, "warn");
  return false;
}

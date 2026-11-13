// ============================================================
//  PERANTARA MEDIA UJIAN (Cloudflare Pages Function)
//  GET /media/<folder>/<berkas>  →  gambar/audio soal dari Supabase Storage (bucket "foto").
//  Berkas diambil dari Supabase SEKALI, lalu disimpan di cache Cloudflare (bandwidth Cloudflare gratis &
//  tanpa batas). Santri berikutnya memuat dari cache → kuota unduhan Supabase (5 GB/bulan) tidak habis
//  walaupun ratusan santri membuka soal bergambar/beraudio bersamaan.
//  Nama berkas selalu unik (ada stempel waktu), jadi aman disimpan lama (1 tahun).
// ============================================================
const SUPABASE = "https://izvsypocfpaerahfpgrk.supabase.co/storage/v1/object/public/foto/";
const BOLEH = /^(ujian-soal|ujian-audio|ujian-jawab|siswa|guru|logo)\/[\w\-./%]+$/;
const SETAHUN = 31536000;

export async function onRequestGet({ params, request, waitUntil }) {
  const bagian = Array.isArray(params.path) ? params.path : [params.path];
  const path = bagian.map((p) => encodeURIComponent(decodeURIComponent(p))).join("/");
  if (!BOLEH.test(path) || path.includes("..")) return new Response("Tidak diizinkan", { status: 403 });

  const cache = caches.default;
  const kunci = new Request(new URL(request.url).origin + "/media/" + path); // tanpa Range → satu salinan utuh
  let r = await cache.match(request); // Cache API otomatis melayani Range (audio) dari salinan utuh
  if (r) return r;

  const asal = await fetch(SUPABASE + path, { cf: { cacheTtl: SETAHUN, cacheEverything: true } });
  if (!asal.ok) return new Response("Berkas tidak ditemukan", { status: asal.status });
  const kepala = new Headers(asal.headers);
  kepala.set("Cache-Control", `public, max-age=${SETAHUN}, immutable`);
  kepala.set("Access-Control-Allow-Origin", "*");
  kepala.delete("set-cookie");
  const simpan = new Response(asal.body, { status: 200, headers: kepala });
  await cache.put(kunci, simpan.clone());
  // permintaan Range (mis. audio di HP) → layani dari cache yang baru tersimpan
  if (request.headers.has("Range")) { const dariCache = await cache.match(request); if (dariCache) return dariCache; }
  return simpan;
}

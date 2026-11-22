// ============================================================
//  PERANTARA BUKU MODUL AJAR DARI GOOGLE DRIVE (Cloudflare Pages Function)
//  GET /buku/<idBerkasDrive>[/<nama.pdf>]  →  PDF dari folder Drive "Arsip PKBM/11 Modul Ajar"
//  (folder itu diatur "Siapa saja yang memiliki link: Pelihat"; folder arsip lain tetap tertutup).
//  Diambil dari Drive SEKALI lalu disimpan di cache Cloudflare (gratis, tanpa batas) → buku dibuka
//  dari alamat aplikasi sendiri, jadi pembaca PDF (pdf.js) bisa memuatnya tanpa masalah CORS, dan
//  penyimpanan Supabase (1 GB) tidak terpakai untuk buku.
// ============================================================
const SETAHUN = 31536000;

export async function onRequestGet({ params, request }) {
  const bagian = Array.isArray(params.path) ? params.path : [params.path];
  const id = String(bagian[0] || "");
  if (!/^[\w-]{20,80}$/.test(id)) return new Response("Tidak diizinkan", { status: 403 });

  const cache = caches.default;
  const kunci = new Request(new URL(request.url).origin + "/buku/" + id);
  const ada = await cache.match(kunci);
  if (ada) return ada;

  const asal = await fetch(`https://drive.usercontent.google.com/download?id=${id}&export=download&confirm=t`, { redirect: "follow" });
  const jenis = asal.headers.get("content-type") || "";
  if (!asal.ok || /text\/html/.test(jenis)) {
    return new Response("Buku tidak bisa diambil dari Google Drive. Pastikan folder '11 Modul Ajar' dibagikan: Siapa saja yang memiliki link → Pelihat.", { status: asal.ok ? 403 : asal.status });
  }
  const kepala = new Headers();
  kepala.set("Content-Type", /pdf/.test(jenis) ? "application/pdf" : jenis || "application/octet-stream");
  kepala.set("Cache-Control", `public, max-age=${SETAHUN}, immutable`);
  kepala.set("Access-Control-Allow-Origin", "*");
  const panjang = asal.headers.get("content-length"); if (panjang) kepala.set("Content-Length", panjang);
  const simpan = new Response(asal.body, { status: 200, headers: kepala });
  await cache.put(kunci, simpan.clone());
  return simpan;
}

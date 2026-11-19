// Fungsi dan data bantu untuk produk.
// Dipisah ke file sendiri karena sekarang dipakai di dua tempat:
// kartu di etalase (ProductCard.vue) dan halaman detail (ProductView.vue).

// Ganti dengan nomor WhatsApp penjual, format internasional tanpa tanda + (contoh: 62812...).
export const WA_NUMBER = '6285767457752'

// Ikon sederhana per kategori (dipakai di kotak gambar produk).
export const ICONS = {
  'Kopi & Teh':
    '<path d="M14 26h30v12a12 12 0 0 1-12 12h-6a12 12 0 0 1-12-12z"/><path d="M44 30h3a6 6 0 0 1 0 12h-4"/><path d="M24 18c0-4 4-4 4-8M34 18c0-4 4-4 4-8"/>',
  Fashion: '<path d="M22 10 8 18l6 10 6-4v30h24V24l6 4 6-10-14-8c-2 4-6 6-10 6s-8-2-10-6z"/>',
  Kerajinan:
    '<path d="M18 24h28l-4 26a4 4 0 0 1-4 4H26a4 4 0 0 1-4-4z"/><path d="M14 24h36M20 34h24M22 44h20"/>',
  Camilan:
    '<path d="M18 12h28l4 8v32a4 4 0 0 1-4 4H18a4 4 0 0 1-4-4V20z"/><path d="M14 20h36M26 34h12M26 43h12"/>',
}

export const rupiah = (n) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(n)

export const discount = (p) => Math.round((1 - p.price / p.oldPrice) * 100)

export const waLink = (p) =>
  'https://wa.me/' +
  WA_NUMBER +
  '?text=' +
  encodeURIComponent(
    'Halo, saya mau pesan ' + p.name + ' (' + rupiah(p.price) + '). Apakah masih tersedia?',
  )

// Alamat dasar situs. Penting kalau nanti dipublikasikan di subfolder (misalnya GitHub Pages).
const BASE = import.meta.env.BASE_URL

// Mengubah nama file di data menjadi alamat foto lengkap.
export const productImages = (p) => (p.images ?? []).map((f) => BASE + 'images/products/' + f)

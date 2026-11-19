// Animasi "terbang ke keranjang": salinan gambar produk mengecil dan meluncur
// ke tombol keranjang, lalu tombol keranjang berdenyut sebentar.
//
// source : elemen gambar produk yang disalin (misalnya kotak gambar di kartu)
// Tujuan : elemen yang punya atribut data-cart-target (tombol keranjang di App.vue)
export function flyToCart(source) {
  const target = document.querySelector('[data-cart-target]')
  if (!source || !target) return

  // Pengguna yang meminta gerakan dikurangi tidak diberi animasi.
  // Mereka tetap tahu lewat angka di tombol keranjang dan pengumuman untuk pembaca layar.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const from = source.getBoundingClientRect()
  const to = target.getBoundingClientRect()
  if (from.width === 0 || from.height === 0) return

  // Salin elemen, letakkan tepat di atas aslinya, lalu animasikan salinannya.
  const clone = source.cloneNode(true)
  clone.setAttribute('aria-hidden', 'true')
  clone.inert = true
  Object.assign(clone.style, {
    position: 'fixed',
    left: from.left + 'px',
    top: from.top + 'px',
    width: from.width + 'px',
    height: from.height + 'px',
    margin: '0',
    zIndex: '1000',
    pointerEvents: 'none',
    overflow: 'hidden',
    borderRadius: '12px',
    transformOrigin: 'center center',
  })
  document.body.appendChild(clone)

  // Jarak dari titik tengah gambar ke titik tengah tombol keranjang.
  const dx = to.left + to.width / 2 - (from.left + from.width / 2)
  const dy = to.top + to.height / 2 - (from.top + from.height / 2)

  const flight = clone.animate(
    [
      { transform: 'translate(0, 0) scale(1)', opacity: 1 },
      { transform: `translate(${dx}px, ${dy}px) scale(0.12)`, opacity: 0.4 },
    ],
    { duration: 650, easing: 'cubic-bezier(0.5, 0, 0.75, 0.4)', fill: 'forwards' },
  )

  const finish = () => {
    clone.remove()
    // Tombol keranjang membesar sebentar sebagai tanda barang sudah masuk.
    target.animate(
      [{ transform: 'scale(1)' }, { transform: 'scale(1.18)' }, { transform: 'scale(1)' }],
      { duration: 350, easing: 'ease-out' },
    )
  }
  flight.onfinish = finish
  flight.oncancel = () => clone.remove()
}

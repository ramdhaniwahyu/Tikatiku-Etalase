<script setup>
import { useRoute } from 'vue-router'
import { useCartStore } from './stores/cart'

// Store keranjang dipakai di sini untuk menampilkan jumlah barang pada tombol keranjang.
const cart = useCartStore()
const route = useRoute()
</script>

<template>
  <div class="wrap">
    <!-- RouterView: tempat halaman yang cocok dengan URL ditampilkan. -->
    <RouterView />

    <!-- Tombol keranjang melayang: selalu terlihat walau halaman sudah digulir jauh.
         Disembunyikan di halaman keranjang itu sendiri. -->
    <nav v-if="route.name !== 'keranjang'" class="cart-fab" aria-label="Navigasi utama">
      <!-- data-cart-target: tujuan animasi "terbang ke keranjang" (lihat utils/flyToCart.js) -->
      <RouterLink
        to="/keranjang"
        class="cart-link"
        data-cart-target
        :aria-label="cart.count ? 'Keranjang, ' + cart.count + ' barang' : 'Keranjang'"
      >
        <i class="bi bi-cart4" aria-hidden="true"></i>
        Keranjang
        <span v-if="cart.count" class="card-count">{{ cart.count }}</span>
      </RouterLink>
    </nav>

    <!-- Pengumuman untuk pembaca layar setiap ada barang yang ditambahkan. -->
    <p class="sr" role="status">{{ cart.lastAdded }}</p>
  </div>
</template>

<style scoped>
/* Ruang di bawah halaman agar tombol melayang tidak menutupi konten paling bawah. */
.wrap {
  padding-bottom: 88px;
}

.cart-fab {
  position: fixed;
  right: max(16px, env(safe-area-inset-right, 0px));
  bottom: max(16px, env(safe-area-inset-bottom, 0px));
  z-index: 20;
}

.cart-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 18px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: var(--surface);
  color: var(--ink);
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
  box-shadow: var(--shadow);
}

.cart-link:hover {
  border-color: var(--accent);
}

.card-count {
  min-width: 22px;
  padding: 0 7px;
  border-radius: 999px;
  background: #ef4444;
  color: var(--accent-ink);
  font-size: 12px;
  line-height: 22px;
  text-align: center;
  font-variant-numeric: tabular-nums;
}
</style>
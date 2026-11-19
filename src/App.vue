<script setup>
import { useCartStore } from './stores/cart'

// Store keranjang dipakai di sini hanya untuk menampilkan jumlah barang di pojok atas.
const cart = useCartStore()
</script>

<template>
  <div class="wrap">
    <nav class="topbar" aria-label="Navigasi utama">
      <RouterLink to="/keranjang" class="cart-link">
        <i class="bi bi-cart4" aria-hidden="true"></i>
        Keranjang
        <span v-if="cart.count" class="card-count">{{ cart.count }}</span>
      </RouterLink>
    </nav>
    <!-- RouterView: tempat halaman yang cocok dengan URL ditampilkan (Dashboard atau ProductView). -->
    <RouterView />
  </div>
</template>

<style scoped>
.topbar {
  display: flex;
  justify-content: flex-end;
  padding-top: 12px;
}

.cart-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: var(--surface);
  color: var(--ink);
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
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

<script setup>
import { computed } from 'vue'
import { useCartStore } from '../stores/cart'
import { ICONS, rupiah, WA_NUMBER, productImages } from '../utils/helper'

const cart = useCartStore()

// Pesan WhatsApp berisi seluruh isi keranjang, dibuat otomatis.
const checkoutLink = computed(() => {
  const baris = cart.lines.map(
    (l, i) =>
      i + 1 + '. ' + l.product.name + ' x' + l.qty + ' = ' + rupiah(l.product.price * l.qty),
  )
  const pesan = 'Halo, saya mau pesan:\n' + baris.join('\n') + '\n\nTotal: ' + rupiah(cart.total)
  return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(pesan)
})

// Foto pertama sebuah produk, atau undefined kalau belum punya foto.
const photoOf = (product) => productImages(product)[0]
</script>

<template>
  <main class="cart">
    <RouterLink to="/" class="back">← Lanjut belanja</RouterLink>
    <h1>Keranjang</h1>

    <div v-if="cart.lines.length" class="layout">
      <ul class="lines">
        <li v-for="l in cart.lines" :key="l.product.id" class="line">
          <div class="thumb" :style="{ background: 'var(--t' + l.product.tone + ')' }">
            <img
              v-if="photoOf(l.product)"
              class="photo"
              :src="photoOf(l.product)"
              alt=""
              loading="lazy"
            />
            <svg v-else viewBox="0 0 64 64" aria-hidden="true" v-html="ICONS[l.product.cat]"></svg>
          </div>

          <div class="main">
            <RouterLink :to="'/produk/' + l.product.id" class="name">{{
              l.product.name
            }}</RouterLink>
            <span class="each">{{ rupiah(l.product.price) }} / item</span>

            <div class="controls">
              <div class="qty">
                <button
                  type="button"
                  :aria-label="'Kurangi jumlah ' + l.product.name"
                  :disabled="l.qty <= 1"
                  @click="cart.setQty(l.product.id, l.qty - 1)"
                >
                  −
                </button>
                <span aria-live="polite">{{ l.qty }}</span>
                <button
                  type="button"
                  :aria-label="'Tambah jumlah ' + l.product.name"
                  :disabled="l.qty >= l.product.stock"
                  @click="cart.setQty(l.product.id, l.qty + 1)"
                >
                  +
                </button>
              </div>
              <button
                type="button"
                class="remove"
                @click="cart.remove(l.product.id)"
                :aria-label="'Hapus ' + l.product.name"
              >
                <i class="bi bi-trash3-fill" aria-hidden="true"></i>
              </button>
            </div>
          </div>

          <strong class="sub">{{ rupiah(l.product.price * l.qty) }}</strong>
        </li>
      </ul>

      <aside class="summary">
        <h2>Ringkasan</h2>
        <div class="sum-row">
          <span>{{ cart.count }} barang</span>
          <strong class="total">{{ rupiah(cart.total) }}</strong>
        </div>
        <a class="btn" :href="checkoutLink" target="_blank" rel="noopener"
          ><i class="bi bi-whatsapp" aria-hidden="true"></i>Pesan via WhatsApp</a
        >
        <button type="button" class="btn secondary" @click="cart.clear()">
          <i class="bi bi-trash" aria-hidden="true"></i>
          Kosongkan keranjang
        </button>
        <p class="note">Ongkos kirim dan pembayaran dibicarakan langsung dengan penjual.</p>
      </aside>
    </div>

    <div v-else class="empty">
      <p>Keranjangmu masih kosong.</p>
      <RouterLink to="/" class="back">Lihat produk</RouterLink>
    </div>
  </main>
</template>

<style scoped>
.cart {
  padding-block: 20px 0;
}

.back {
  display: inline-block;
  margin-bottom: 12px;
  color: var(--accent);
  font-weight: 600;
  text-decoration: none;
}

.back:hover {
  text-decoration: underline;
}

.cart h1 {
  font-size: clamp(26px, 5vw, 36px);
  margin-bottom: 20px;
}

.layout {
  display: grid;
  gap: 24px;
  grid-template-columns: minmax(0, 1fr);
  align-items: start;
}

@media (min-width: 860px) {
  .layout {
    grid-template-columns: minmax(0, 1fr) 320px;
    gap: 32px;
  }
}

.lines {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 12px;
}

.line {
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr) auto;
  gap: 14px;
  align-items: start;
  padding: 14px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 12px;
}

.thumb {
  position: relative;
  overflow: hidden;
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  border-radius: 8px;
  color: var(--tile-ink);
}

.thumb svg {
  width: 55%;
  height: auto;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.4;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.photo {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.main {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.name {
  font-family: var(--font-display);
  font-weight: 700;
  color: inherit;
  text-decoration: none;
}

.name:hover {
  color: var(--accent);
  text-decoration: underline;
}

.each {
  color: var(--muted);
  font-size: 13px;
  font-variant-numeric: tabular-nums;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
}

.qty {
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--line);
  border-radius: 8px;
  overflow: hidden;
}

.qty button {
  width: 36px;
  height: 36px;
  border: 0;
  background: var(--t1);
  color: var(--ink);
  font: inherit;
  font-size: 18px;
  cursor: pointer;
}

.qty button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.qty span {
  min-width: 36px;
  text-align: center;
  font-variant-numeric: tabular-nums;
}

.remove {
  display: inline-grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: none;
  color: var(--muted);
  font-size: 16px;
  cursor: pointer;
}

.remove:hover {
  color: var(--sale);
  border-color: var(--sale);
}

.sub {
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.summary {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 18px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 12px;
}

@media (min-width: 860px) {
  .summary {
    position: sticky;
    top: 16px;
  }
}

.summary h2 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 18px;
}

.sum-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
}

.total {
  font-size: 22px;
  font-variant-numeric: tabular-nums;
}

.note {
  margin: 0;
  color: var(--muted);
  font-size: 13px;
}

.btn {
  background: var(--bw);
}

.btn.secondary {
  border: 1px solid var(--accent);
  background: var(--accent);
  color: var(--accent-ink);
}
</style>

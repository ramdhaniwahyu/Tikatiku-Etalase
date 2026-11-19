<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { PRODUCTS } from '../data/products'
import { ICONS, rupiah, discount, waLink, productImages } from '../utils/helper'
import { useCartStore } from '../stores/cart'
import ImageSlider from '../components/ImageSlider.vue'
import { flyToCart } from '../utils/flyToCart'

// useRoute() memberi akses ke URL yang sedang dibuka.
// Untuk /produk/5, route.params.id bernilai "5" (selalu berupa teks), jadi diubah ke angka.
const route = useRoute()
const cart = useCartStore()

// computed: dihitung ulang otomatis kalau URL berubah.
const product = computed(() => PRODUCTS.find((p) => p.id === Number(route.params.id)))

// Jumlah produk ini yang sudah ada di keranjang.
const inCart = computed(() => (product.value ? cart.qtyOf(product.value.id) : 0))

const photos = computed(() => (product.value ? productImages(product.value) : []))

const stockText = computed(() => {
  const s = product.value.stock
  if (s === 0) return 'Stok habis'
  if (s <= 5) return 'Sisa ' + s + ' lagi'
  return 'Stok tersedia (' + s + ')'
})

const media = ref(null)

const addToCart = () => {
  cart.add(product.value)
  flyToCart(media.value)
}
</script>

<template>
  <main class="detail">
    <RouterLink to="/" class="back">← Kembali ke etalase</RouterLink>

    <div v-if="product" class="layout">
      <div class="media" ref="media">
        <ImageSlider v-if="photos.length" :images="photos" :alt="product.name" />
        <div v-else class="tile" :style="{ background: 'var(--t' + product.tone + ')' }">
          <svg viewBox="0 0 64 64" aria-hidden="true" v-html="ICONS[product.cat]"></svg>
        </div>
      </div>
      <div class="info">
        <span class="cat">{{ product.cat }}</span>
        <h1>{{ product.name }}</h1>

        <div class="price">
          <strong>{{ rupiah(product.price) }}</strong>
          <s v-if="product.oldPrice">{{ rupiah(product.oldPrice) }}</s>
          <span class="sale" v-if="product.oldPrice">-{{ discount(product) }}%</span>
        </div>

        <p class="stock" :class="{ low: product.stock <= 5 }">{{ stockText }}</p>
        <p class="desc">{{ product.desc }}</p>

        <div class="actions">
          <span v-if="product.stock === 0" class="btn" aria-disabled="true">Stok habis</span>
          <template v-else>
            <button
              type="button"
              class="btn"
              :disabled="inCart >= product.stock"
              @click="addToCart"
            >
              <i class="bi bi-plus-circle" aria-hidden="true"></i>
              {{ inCart ? 'Tambah lagi (' + inCart + ' di keranjang)' : 'Tambah ke keranjang' }}
            </button>
            <a class="btn secondary" :href="waLink(product)" target="_blank" rel="noopener">
              <i class="bi bi-whatsapp" aria-hidden="true"></i>
              Pesan langsung via WhatsApp
            </a>
          </template>
        </div>
      </div>
    </div>

    <div v-else class="empty">
      <p>Produk tidak ditemukan.</p>
      <RouterLink to="/" class="back">Kembali ke etalase</RouterLink>
    </div>
  </main>
</template>

<style scoped>
.detail {
  padding-block: 20px 0;
}

.back {
  display: inline-block;
  margin-bottom: 20px;
  color: var(--accent);
  font-weight: 600;
  text-decoration: none;
}

.back:hover {
  text-decoration: underline;
}

.layout {
  display: grid;
  gap: 24px;
  grid-template-columns: minmax(0, 1fr);
}

@media (min-width: 768px) {
  .layout {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    align-items: start;
    gap: 40px;
  }
}

.tile {
  aspect-ratio: 4 / 3;
  display: grid;
  place-items: center;
  border-radius: 12px;
  color: var(--tile-ink);
}

.tile svg {
  width: 30%;
  max-width: 140px;
  height: auto;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.4;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.cat {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
}

.info h1 {
  font-size: clamp(24px, 4vw, 34px);
  margin: 0;
}

.price {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px 10px;
}

.price strong {
  font-size: 26px;
  font-variant-numeric: tabular-nums;
}

.price s {
  color: var(--muted);
  font-variant-numeric: tabular-nums;
}

.price .sale {
  color: var(--sale);
  font-weight: 600;
}

.stock {
  margin: 0;
  color: var(--muted);
}

.stock.low {
  color: var(--warn);
  font-weight: 600;
}

.desc {
  margin: 0;
  max-width: 60ch;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 12px;
  max-width: 320px;
}

.actions .btn {
  margin-top: 0;
}

.btn.secondary {
  border: 1px solid var(--accent-ink);
  background: var(--bw);
  color: var(--accent-ink);
}
</style>

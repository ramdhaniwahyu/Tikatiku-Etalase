<script setup>
import { computed, ref } from 'vue'
import { ICONS, rupiah, discount, productImages } from '../utils/helper'
import { useCartStore } from '../stores/cart'
import { flyToCart } from '../utils/flyToCart'

// Props: data yang diterima komponen ini dari induknya (Dashboard.vue).
const props = defineProps({
  product: { type: Object, required: true },
})

// Store keranjang: dipakai untuk tombol "Tambah ke keranjang".
const cart = useCartStore()

const photo = computed(() => productImages(props.product)[0])

const tile = ref(null)

const addToCart = () => {
  cart.add(props.product)
  flyToCart(tile.value)
}
</script>

<template>
  <article class="card" :class="{ out: product.stock === 0 }">
    <RouterLink class="tile-link" :to="'/produk/' + product.id" tabindex="-1" aria-hidden="true">
      <!-- <div class="tile" :class="'t' + product.tone" v-on:click="$router.push('/produk/' + product.id)"> -->
      <div class="tile" :class="'t' + product.tone" ref="tile">
        <img v-if="photo" class="photo" :src="photo" alt="" loading="lazy" />
        <svg v-else viewBox="0 0 64 64" aria-hidden="true" v-html="ICONS[product.cat]"></svg>
        <div class="badges" v-if="product.oldPrice || product.stock <= 5">
          <span class="badge sale" v-if="product.oldPrice"
            ><i class="bi bi-tag-fill" aria-hidden="true"></i>-{{ discount(product) }}%</span
          >
          <span class="badge out" v-if="product.stock === 0">Habis</span>
          <span class="badge low" v-else-if="product.stock <= 5">Sisa {{ product.stock }}</span>
        </div>
      </div>
    </RouterLink>
    <div class="body">
      <span class="cat">{{ product.cat }}</span>
      <h2 class="name">
        <!-- RouterLink: link antar halaman tanpa memuat ulang browser. -->
        <RouterLink :to="'/produk/' + product.id">{{ product.name }}</RouterLink>
      </h2>
      <p class="desc">{{ product.desc }}</p>
      <div class="price">
        <strong>{{ rupiah(product.price) }}</strong>
        <s v-if="product.oldPrice">{{ rupiah(product.oldPrice) }}</s>
      </div>
      <span v-if="product.stock === 0" class="btn" aria-disabled="true">Stok habis</span>
      <button
        v-else
        type="button"
        class="btn"
        :disabled="cart.qtyOf(product.id) >= product.stock"
        @click="addToCart"
      >
        <i class="bi bi-plus-circle" aria-hidden="true"></i>
        {{
          cart.qtyOf(product.id)
            ? 'Tambah lagi (' + cart.qtyOf(product.id) + ' di keranjang)'
            : 'Tambah ke keranjang'
        }}
      </button>
    </div>
  </article>
</template>

<!--
  "scoped": gaya di bawah hanya berlaku untuk komponen ini.
  Variabel warna seperti var(--surface) tetap dibaca dari :root di main.css.
  Gaya .btn tidak ada di sini karena tombol dipakai juga di halaman lain (ada di main.css).
-->
<style scoped>
.card {
  min-width: 0;
  display: flex;
  flex-direction: column;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 12px;
  overflow: hidden;
  transition:
    border-color 0.15s,
    box-shadow 0.15s,
    transform 0.15s;
}

.tile {
  position: relative;
  aspect-ratio: 4 / 3;
  display: grid;
  place-items: center;
  color: var(--tile-ink);
}

.tile svg {
  width: 38%;
  max-width: 96px;
  height: auto;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.4;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: transform 0.2s;
}

.t1 {
  background: var(--t1);
}
.t2 {
  background: var(--t2);
}
.t3 {
  background: var(--t3);
}
.t4 {
  background: var(--t4);
}

.card.out .tile svg {
  opacity: 0.4;
}

.badges {
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 6px;
  background: var(--surface);
  border: 1px solid var(--line);
}

.badge.sale {
  color: var(--sale);
}
.badge.low {
  color: var(--warn);
}
.badge.out {
  color: var(--muted);
}

.body {
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}

.cat {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
}

.name {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 17px;
  line-height: 1.25;
  margin: 0;
  text-wrap: balance;
}

.name a {
  color: inherit;
  text-decoration: none;
}

.name a:hover {
  color: var(--accent);
  text-decoration: underline;
}

.desc {
  margin: 0;
  color: var(--muted);
  font-size: 14px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.price {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px 8px;
  margin-top: 4px;
}

.price strong {
  font-size: 17px;
  font-variant-numeric: tabular-nums;
}

.price s {
  color: var(--muted);
  font-size: 13px;
  font-variant-numeric: tabular-nums;
}

.tile-link {
  display: block;
  color: inherit;
  text-decoration: none;
}

.body > .price + .btn {
  margin-top: 10px;
}

.card:hover,
.card:focus-within {
  border-color: var(--accent);
  box-shadow: var(--shadow);
}

.card:hover {
  transform: translateY(-2px);
}

.card:hover .tile svg {
  transform: scale(1.08);
}

@media (prefers-reduced-motion: reduce) {
  .card:hover,
  .card:hover .tile svg {
    transform: none;
  }
}

.tile {
  overflow: hidden;
}

.photo {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.card:hover .photo {
  transform: scale(1.05);
}

.card.out .photo {
  opacity: 0.5;
  filter: grayscale(1);
}
</style>

<script setup>
import { ref, computed } from 'vue'
import { PRODUCTS, CATEGORIES, CATEGORY_ICONS } from '../data/products'
import ProductCard from '../components/ProductCard.vue'

// State: berubah saat pengunjung mengetik, memilih kategori, atau mengurutkan.
const cat = ref('Semua')
const q = ref('')
const sort = ref('rekomendasi')

// Daftar yang tampil dihitung ulang otomatis setiap state di atas berubah.
const filtered = computed(() => {
  const kw = q.value.trim().toLowerCase()
  const list = PRODUCTS.filter(
    (p) =>
      (cat.value === 'Semua' || p.cat === cat.value) &&
      (!kw || (p.name + ' ' + p.desc + ' ' + p.cat).toLowerCase().includes(kw)),
  )
  if (sort.value === 'murah') list.sort((a, b) => a.price - b.price)
  else if (sort.value === 'mahal') list.sort((a, b) => b.price - a.price)
  else if (sort.value === 'nama') list.sort((a, b) => a.name.localeCompare(b.name, 'id'))
  return list
})

const countOf = (c) =>
  c === 'Semua' ? PRODUCTS.length : PRODUCTS.filter((p) => p.cat === c).length
const reset = () => {
  cat.value = 'Semua'
  q.value = ''
}
</script>

<template>
  <main>
    <header class="top">
      <!-- <p class="eyebrow">Toko contoh · {{ PRODUCTS.length }} produk</p> -->
      <h1>Tikatiku Handmade</h1>
      <p class="lead">
        Menyediakan berbagai produk kerajinan tangan (handicraft) dengan layanan custom sesuai
        keinginan Anda. Kami menghadirkan bucket bunga, bucket uang, bucket custom, amplop
        dekoratif, kartu ucapan, dan berbagai hadiah kreatif lainnya yang dibuat dengan detail dan
        penuh ketelitian. Cocok untuk berbagai momen spesial seperti wisuda, ulang tahun,
        anniversary, dan lainnya.
      </p>
    </header>

    <div class="toolbar">
      <div class="row">
        <div class="search">
          <label class="sr" for="q">Cari produk</label>
          <input
            class="field"
            id="q"
            type="search"
            v-model="q"
            placeholder="Cari produk..."
            autocomplete="off"
          />
          <i class="bi bi-search" aria-hidden="true"></i>
        </div>

        <label class="sr" for="sort">Urutkan</label>
        <select class="field" id="sort" v-model="sort">
          <option value="rekomendasi">Rekomendasi</option>
          <option value="murah">Harga terendah</option>
          <option value="mahal">Harga tertinggi</option>
          <option value="nama">Nama A–Z</option>
        </select>
      </div>
      <div class="chips" role="group" aria-label="Kategori">
        <button
          v-for="c in CATEGORIES"
          :key="c"
          type="button"
          class="chip"
          :aria-pressed="String(cat === c)"
          @click="cat = c"
        >
          <i :class="['bi', CATEGORY_ICONS[c]]" aria-hidden="true"></i>
          {{ c }}<span class="n">{{ countOf(c) }}</span>
        </button>
      </div>
    </div>

    <p class="count" aria-live="polite">
      {{ filtered.length }} produk<template v-if="cat !== 'Semua'"> di {{ cat }}</template>
    </p>

    <div class="grid">
      <ProductCard v-for="p in filtered" :key="p.id" :product="p" />

      <div class="empty" v-if="filtered.length === 0">
        <p>Tidak ada produk yang cocok dengan pencarianmu.</p>
        <button type="button" @click="reset">Tampilkan semua produk</button>
      </div>
    </div>

    <section class="how">
      <h2>Cara pesan</h2>
      <p>
        Tekan Pesan via WhatsApp pada produk yang kamu mau, lalu kirim pesan yang sudah terisi
        otomatis. Pembayaran dan ongkos kirim dibicarakan langsung dengan penjual.
      </p>
      <p>Selamat Berbelanja! Semoga kamu menemukan produk yang sesuai dengan keinginanmu.</p>
    </section>
  </main>
</template>

import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { PRODUCTS } from '../data/products'

// Kunci penyimpanan di browser (localStorage), supaya keranjang tidak hilang saat halaman di-refresh.
const STORAGE_KEY = 'etalase-keranjang'

function load() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    return Array.isArray(data) ? data : []
  } catch {
    // Data rusak atau penyimpanan tidak tersedia: mulai dengan keranjang kosong.
    return []
  }
}

// Store Pinia: tempat data bersama yang bisa dipakai komponen mana pun.
// Pola "setup store" sama seperti <script setup>: ref = state, computed = getter, function = action.
export const useCartStore = defineStore('cart', () => {
  // State: hanya menyimpan id dan jumlah, misalnya [{ id: 3, qty: 2 }].
  // Nama, harga, dan stok selalu diambil dari PRODUCTS, jadi tidak ada data ganda.
  const items = ref(load())

  // Getter: dihitung ulang otomatis saat items berubah.
  const lines = computed(() =>
    items.value
      .map((i) => ({ product: PRODUCTS.find((p) => p.id === i.id), qty: i.qty }))
      .filter((l) => l.product),
  )
  const count = computed(() => lines.value.reduce((sum, l) => sum + l.qty, 0))
  const total = computed(() => lines.value.reduce((sum, l) => sum + l.product.price * l.qty, 0))

  // Action: fungsi yang mengubah state.
  const qtyOf = (id) => items.value.find((i) => i.id === id)?.qty ?? 0

  function add(product) {
    const line = items.value.find((i) => i.id === product.id)
    if (qtyOf(product.id) >= product.stock) return // tidak boleh melebihi stok
    if (line) line.qty++
    else items.value.push({ id: product.id, qty: 1 })
  }

  function setQty(id, qty) {
    const line = items.value.find((i) => i.id === id)
    const product = PRODUCTS.find((p) => p.id === id)
    if (!line || !product) return
    line.qty = Math.min(Math.max(1, qty), product.stock)
  }

  function remove(id) {
    items.value = items.value.filter((i) => i.id !== id)
  }

  function clear() {
    items.value = []
  }

  // Simpan ke localStorage setiap kali isi keranjang berubah.
  watch(
    items,
    () => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items.value))
      } catch {
        // Penyimpanan penuh atau diblokir: keranjang tetap jalan, hanya tidak tersimpan.
      }
    },
    { deep: true },
  )

  return { items, lines, count, total, qtyOf, add, setQty, remove, clear }
})

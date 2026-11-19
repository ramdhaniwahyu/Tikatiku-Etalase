<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'

// Props: daftar alamat foto, teks alternatif, dan jeda slideshow otomatis.
const props = defineProps({
  images: { type: Array, required: true },
  alt: { type: String, default: '' },
  // Jeda pindah otomatis dalam milidetik. 0 = mati (hanya manual).
  autoplay: { type: Number, default: 0 },
})

// index: nomor foto yang sedang tampil (0 = foto pertama).
const index = ref(0)

// Pindah ke foto ke-i. Operator % membuat urutan berputar: setelah foto terakhir kembali ke pertama.
const go = (i) => {
  const n = props.images.length
  index.value = (i + n) % n
}
const next = () => go(index.value + 1)
const prev = () => go(index.value - 1)

// Kalau daftar foto berganti (pindah ke produk lain), mulai lagi dari foto pertama.
watch(
  () => props.images,
  () => {
    index.value = 0
  },
)

// Geser dengan jari atau mouse: bandingkan posisi saat ditekan dan saat dilepas.
let startX = null
const onPointerDown = (e) => {
  startX = e.clientX
}
const onPointerUp = (e) => {
  if (startX === null) return
  const dx = e.clientX - startX
  startX = null
  if (Math.abs(dx) > 40) {
    if (dx < 0) next()
    else prev()
  }
}
const onPointerCancel = () => {
  startX = null
}

// Slideshow otomatis (opsional). Berhenti saat kursor atau fokus ada di slider,
// dan tidak jalan sama sekali bagi pengguna yang meminta gerakan dikurangi.
let timer = null
const stop = () => {
  clearInterval(timer)
  timer = null
}
const start = () => {
  stop()
  if (!props.autoplay || props.images.length < 2) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  timer = setInterval(next, props.autoplay)
}
onMounted(start)
onBeforeUnmount(stop)
</script>

<template>
  <div
    class="slider"
    role="region"
    aria-roledescription="carousel"
    :aria-label="'Foto ' + alt"
    tabindex="0"
    @keydown.left.prevent="prev"
    @keydown.right.prevent="next"
    @mouseenter="stop"
    @mouseleave="start"
    @focusin="stop"
    @focusout="start"
    @pointerdown="onPointerDown"
    @pointerup="onPointerUp"
    @pointercancel="onPointerCancel"
  >
    <!-- Semua foto berjajar ke samping. Yang tampil diatur dengan menggeser jajaran ini. -->
    <div class="track" :style="{ transform: 'translateX(' + -index * 100 + '%)' }">
      <div v-for="(src, i) in images" :key="src" class="slide">
        <img class="bg" :src="src" alt="" aria-hidden="true" draggable="false" />
        <img
          class="fg"
          :src="src"
          :alt="alt + ', foto ' + (i + 1)"
          :loading="i === 0 ? 'eager' : 'lazy'"
          draggable="false"
        />
      </div>
    </div>

    <template v-if="images.length > 1">
      <button type="button" class="nav prev" aria-label="Foto sebelumnya" @click="prev">
        <i class="bi bi-chevron-left" aria-hidden="true"></i>
      </button>
      <button type="button" class="nav next" aria-label="Foto berikutnya" @click="next">
        <i class="bi bi-chevron-right" aria-hidden="true"></i>
      </button>

      <span class="counter" aria-live="polite">{{ index + 1 }} / {{ images.length }}</span>

      <div class="dots">
        <button
          v-for="(src, i) in images"
          :key="src"
          type="button"
          class="dot"
          :class="{ active: i === index }"
          :aria-label="'Foto ' + (i + 1)"
          :aria-current="i === index ? 'true' : undefined"
          @click="go(i)"
        ></button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.slider {
  position: relative;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: 12px;
  background: var(--surface);
  border: 1px solid var(--line);
  /* Geser ke samping ditangani slider, geser ke atas-bawah tetap menggulir halaman. */
  touch-action: pan-y;
}

.slider:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.track {
  display: flex;
  height: 100%;
  transition: transform 0.35s ease;
}

.track img {
  flex: 0 0 100%;
  width: 100%;
  height: 100%;
  object-fit: contain; /* sebelumnya: cover */
  user-select: none;
}

/* Kontrol berada di atas foto, jadi memakai warna tetap (bukan token tema) agar selalu terbaca. */
.nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border: 0;
  border-radius: 999px;
  background: rgb(0 0 0 / 0.5);
  color: #fff;
  font-size: 18px;
  cursor: pointer;
}

.nav:hover {
  background: rgb(0 0 0 / 0.7);
}

.prev {
  left: 10px;
}

.next {
  right: 10px;
}

.counter {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 2px 10px;
  border-radius: 999px;
  background: rgb(0 0 0 / 0.5);
  color: #fff;
  font-size: 12px;
  font-variant-numeric: tabular-nums;
}

.dots {
  position: absolute;
  bottom: 12px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 8px;
}

.dot {
  width: 8px;
  height: 8px;
  padding: 0;
  border: 0;
  border-radius: 999px;
  background: rgb(255 255 255 / 0.6);
  cursor: pointer;
  transition:
    width 0.2s,
    background 0.2s;
}

.dot.active {
  width: 22px;
  background: #fff;
}

@media (prefers-reduced-motion: reduce) {
  .track,
  .dot {
    transition: none;
  }
}

.slide {
  position: relative;
  flex: 0 0 100%;
  height: 100%;
  overflow: hidden;
}

.bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(24px) brightness(0.85);
  transform: scale(1.15); /* menutup tepi yang ikut kabur */
}

.fg {
  position: relative;
  width: 100%;
  height: 100%;
  object-fit: contain;
  user-select: none;
}
</style>

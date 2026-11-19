import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'

// Router: tabel yang menghubungkan alamat URL dengan halaman (komponen di folder views).
const router = createRouter({
  // Mode hash: alamat berbentuk /#/produk/5. Aman untuk hosting statis
  // (GitHub Pages, Cloudflare Pages) karena refresh halaman tidak menghasilkan error 404.
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Dashboard,
    },
    {
      // ":id" adalah bagian yang berubah. /produk/5 membuat route.params.id bernilai "5".
      path: '/produk/:id',
      name: 'produk',
      // Dimuat hanya saat halaman ini dibuka (lazy loading).
      component: () => import('../views/ProductView.vue'),
    },
    {
      path: '/keranjang',
      name: 'keranjang',
      component: () => import('../views/CartView.vue'),
    },
    // Alamat yang tidak dikenal dikembalikan ke etalase.
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
  // Setiap pindah halaman, gulir kembali ke atas.
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router

<script setup lang="ts">
import { ref, computed } from 'vue'
import { products, categories } from '@/data/products'
import { useCart } from '@/composables/useCart'
import ProductCard from '@/components/ProductCard.vue'
import CartPanel from '@/components/CartPanel.vue'

type SortOrder = 'none' | 'asc' | 'desc'

const {
  promoInput,
  isPromoActive,
  lines,
  count,
  subtotal,
  total,
  saved,
  priceOf,
  qtyOf,
  add,
  decrement,
  remove,
  clear,
} = useCart()

const search = ref<string>('')
const category = ref<string>('all')
const sortOrder = ref<SortOrder>('none')

const visibleProducts = computed(() => {
  const query = search.value.trim().toLowerCase()

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(query) &&
      (category.value === 'all' || p.category === category.value),
  )

  // filter уже вернул новый массив, поэтому sort не портит исходный products
  if (sortOrder.value === 'asc') filtered.sort((a, b) => a.price - b.price)
  if (sortOrder.value === 'desc') filtered.sort((a, b) => b.price - a.price)

  return filtered
})
</script>

<template>
  <header class="header">
    <h1>🛒 DevShop</h1>
    <span class="badge">Товаров в корзине: {{ count }}</span>
  </header>

  <main class="layout">
    <section>
      <div class="controls">
        <input v-model="search" type="search" placeholder="Поиск товаров..." />
        <select v-model="category">
          <option value="all">Все категории</option>
          <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
        </select>
        <select v-model="sortOrder">
          <option value="none">Без сортировки</option>
          <option value="asc">Сначала дешёвые</option>
          <option value="desc">Сначала дорогие</option>
        </select>
      </div>

      <div v-if="visibleProducts.length" class="grid">
        <ProductCard
          v-for="product in visibleProducts"
          :key="product.id"
          :product="product"
          :price="priceOf(product)"
          :in-cart="qtyOf(product.id)"
          @add="add"
        />
      </div>
      <p v-else class="not-found">Ничего не найдено по запросу «{{ search }}»</p>
    </section>

    <CartPanel
      v-model:promo="promoInput"
      :lines="lines"
      :count="count"
      :subtotal="subtotal"
      :total="total"
      :saved="saved"
      :is-promo-active="isPromoActive"
      @add="add"
      @decrement="decrement"
      @remove="remove"
      @clear="clear"
    />
  </main>
</template>

<style>
* {
  box-sizing: border-box;
}
body {
  margin: 0;
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  background: #f3f4f6;
  color: #111827;
}
</style>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: #2c3e50;
  color: #fff;
}
.header h1 {
  margin: 0;
  font-size: 22px;
}
.badge {
  font-size: 14px;
  opacity: 0.9;
}
.layout {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 24px;
  align-items: start;
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}
.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 16px;
}
.controls input,
.controls select {
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  background: #fff;
}
.controls input {
  flex: 1;
  min-width: 200px;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}
.not-found {
  color: #6b7280;
}
@media (max-width: 860px) {
  .layout {
    grid-template-columns: 1fr;
    padding: 16px;
  }
}
</style>

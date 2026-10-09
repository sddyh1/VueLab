<script setup lang="ts">
import { formatPrice } from '@/data/products'
import type { CartLine } from '@/composables/useCart'

defineProps<{
  lines: CartLine[]
  count: number
  subtotal: number
  total: number
  saved: number
  isPromoActive: boolean
}>()

defineEmits<{
  add: [id: number]
  decrement: [id: number]
  remove: [id: number]
  clear: []
}>()

// Промокод приходит из App.vue через v-model:promo
const promo = defineModel<string>('promo', { required: true })
</script>

<template>
  <aside class="cart">
    <h2>Корзина <span v-if="count">({{ count }})</span></h2>

    <p v-if="!lines.length" class="empty">Корзина пуста</p>

    <ul v-else>
      <li v-for="line in lines" :key="line.product.id">
        <span class="icon">{{ line.product.image }}</span>
        <div class="info">
          <div class="name">{{ line.product.name }}</div>
          <div class="unit">
            {{ formatPrice(line.price) }}
            <s v-if="line.price !== line.product.price">{{ formatPrice(line.product.price) }}</s>
          </div>
        </div>
        <div class="qty">
          <button @click="$emit('decrement', line.product.id)">−</button>
          <span>{{ line.qty }}</span>
          <button @click="$emit('add', line.product.id)">+</button>
        </div>
        <div class="sum">{{ formatPrice(line.sum) }}</div>
        <button class="remove" title="Удалить" @click="$emit('remove', line.product.id)">✕</button>
      </li>
    </ul>

    <label class="promo">
      Промокод
      <input v-model="promo" placeholder="Например, WEB" />
    </label>
    <p v-if="isPromoActive" class="promo-ok">Промокод применён: −10% на все товары</p>
    <p v-else-if="promo.trim()" class="promo-bad">Промокод не найден</p>

    <div class="totals">
      <div v-if="saved > 0" class="row">
        <span>Без скидки</span><s>{{ formatPrice(subtotal) }}</s>
      </div>
      <div v-if="saved > 0" class="row discount">
        <span>Скидка</span><span>−{{ formatPrice(saved) }}</span>
      </div>
      <div class="row total">
        <span>Итого</span><span>{{ formatPrice(total) }}</span>
      </div>
    </div>

    <button class="clear" :disabled="!lines.length" @click="$emit('clear')">
      Очистить корзину
    </button>
  </aside>
</template>

<style scoped>
.cart {
  position: sticky;
  top: 16px;
  padding: 20px;
  background: #fff;
  border: 1px solid #e3e6ea;
  border-radius: 12px;
}
h2 {
  margin: 0 0 12px;
}
.empty {
  color: #6b7280;
}
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
li {
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-template-areas:
    'icon info remove'
    'icon qty sum';
  gap: 4px 10px;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f0f2f4;
}
.icon {
  grid-area: icon;
  font-size: 28px;
}
.info {
  grid-area: info;
}
.name {
  font-weight: 600;
  font-size: 14px;
}
.unit {
  font-size: 13px;
  color: #6b7280;
}
.unit s {
  margin-left: 4px;
  color: #9ca3af;
}
.qty {
  grid-area: qty;
  display: flex;
  align-items: center;
  gap: 8px;
}
.qty button {
  width: 28px;
  height: 28px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
}
.sum {
  grid-area: sum;
  font-weight: 600;
  text-align: right;
}
.remove {
  grid-area: remove;
  border: none;
  background: none;
  color: #9ca3af;
  cursor: pointer;
  font-size: 14px;
}
.remove:hover {
  color: #ef4444;
}
.promo {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 16px;
  font-size: 14px;
}
.promo input {
  padding: 8px 10px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
}
.promo-ok {
  color: #16a34a;
  font-size: 13px;
  margin: 6px 0 0;
}
.promo-bad {
  color: #ef4444;
  font-size: 13px;
  margin: 6px 0 0;
}
.totals {
  margin-top: 16px;
}
.row {
  display: flex;
  justify-content: space-between;
  padding: 2px 0;
  color: #6b7280;
}
.discount {
  color: #16a34a;
}
.total {
  margin-top: 6px;
  font-size: 20px;
  font-weight: 700;
  color: #111827;
}
.clear {
  width: 100%;
  margin-top: 14px;
  padding: 10px;
  border: 1px solid #ef4444;
  border-radius: 8px;
  background: #fff;
  color: #ef4444;
  font-weight: 600;
  cursor: pointer;
}
.clear:disabled {
  opacity: 0.4;
  cursor: default;
}
</style>

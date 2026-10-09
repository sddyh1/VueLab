<script setup lang="ts">
import { formatPrice, type Product } from '@/data/products'

defineProps<{
  product: Product
  price: number
  inCart: number
}>()

defineEmits<{
  add: [id: number]
}>()
</script>

<template>
  <article class="card">
    <div class="image">{{ product.image }}</div>
    <span class="category">{{ product.category }}</span>
    <h3>{{ product.name }}</h3>
    <div class="price">
      <span class="current">{{ formatPrice(price) }}</span>
      <s v-if="price !== product.price" class="old">{{ formatPrice(product.price) }}</s>
    </div>
    <button @click="$emit('add', product.id)">
      {{ inCart ? `В корзине: ${inCart} · ещё` : 'В корзину' }}
    </button>
  </article>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 16px;
  background: #fff;
  border: 1px solid #e3e6ea;
  border-radius: 12px;
}
.image {
  font-size: 56px;
  text-align: center;
  padding: 12px 0;
  background: #f5f7f9;
  border-radius: 8px;
}
.category {
  font-size: 12px;
  color: #6b7280;
}
h3 {
  margin: 0;
  font-size: 16px;
  flex: 1;
}
.price {
  display: flex;
  align-items: baseline;
  gap: 8px;
}
.current {
  font-size: 18px;
  font-weight: 700;
}
.old {
  color: #9ca3af;
  font-size: 14px;
}
button {
  margin-top: 6px;
  padding: 10px;
  border: none;
  border-radius: 8px;
  background: #42b883;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
}
button:hover {
  background: #33a06f;
}
</style>

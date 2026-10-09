import { ref, computed, watch } from 'vue'
import { products, type Product } from '@/data/products'

export interface CartItem {
  id: number
  qty: number
}

export interface CartLine {
  product: Product
  qty: number
  price: number
  sum: number
}

const CART_KEY = 'cart'
const PROMO_KEY = 'promo'
const PROMO_CODE = 'WEB'
const DISCOUNT = 0.1

// Читаем корзину из localStorage. Если там пусто или мусор — начинаем с пустой.
function loadCart(): CartItem[] {
  try {
    const data: unknown = JSON.parse(localStorage.getItem(CART_KEY) ?? '[]')
    if (!Array.isArray(data)) return []
    return data.filter(
      (i): i is CartItem =>
        products.some((p) => p.id === i?.id) && Number.isInteger(i.qty) && i.qty > 0,
    )
  } catch {
    return []
  }
}

// Вся логика корзины. Вызывается один раз в App.vue.
export function useCart() {
  // В корзине храним только id и количество, цену всегда берём из каталога
  const items = ref<CartItem[]>(loadCart())
  const promoInput = ref<string>(localStorage.getItem(PROMO_KEY) ?? '')

  const isPromoActive = computed(() => promoInput.value.trim().toUpperCase() === PROMO_CODE)

  // Цена товара с учётом промокода (округляем каждую позицию до рубля)
  function priceOf(product: Product): number {
    return isPromoActive.value ? Math.round(product.price * (1 - DISCOUNT)) : product.price
  }

  function qtyOf(id: number): number {
    return items.value.find((i) => i.id === id)?.qty ?? 0
  }

  // Строки корзины с подставленными данными товара
  const lines = computed<CartLine[]>(() =>
    items.value.flatMap((item) => {
      const product = products.find((p) => p.id === item.id)
      if (!product) return []
      const price = priceOf(product)
      return [{ product, qty: item.qty, price, sum: price * item.qty }]
    }),
  )

  const count = computed(() => items.value.reduce((acc, i) => acc + i.qty, 0))
  const subtotal = computed(() => lines.value.reduce((acc, l) => acc + l.product.price * l.qty, 0))
  const total = computed(() => lines.value.reduce((acc, l) => acc + l.sum, 0))
  const saved = computed(() => subtotal.value - total.value)

  function add(id: number) {
    const item = items.value.find((i) => i.id === id)
    if (item) item.qty++
    else items.value.push({ id, qty: 1 })
  }

  function decrement(id: number) {
    const item = items.value.find((i) => i.id === id)
    if (!item) return
    if (item.qty > 1) item.qty--
    else remove(id)
  }

  function remove(id: number) {
    items.value = items.value.filter((i) => i.id !== id)
  }

  function clear() {
    items.value = []
  }

  // deep: true — чтобы ловить push и qty++, а не только замену массива
  watch(items, (value) => localStorage.setItem(CART_KEY, JSON.stringify(value)), { deep: true })
  watch(promoInput, (value) => localStorage.setItem(PROMO_KEY, value))

  return {
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
  }
}

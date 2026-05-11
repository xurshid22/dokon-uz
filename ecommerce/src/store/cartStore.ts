// ============================================================
// Zustand Cart Store — persisted to localStorage
// ============================================================

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { LocalizedProduct } from '@/types'

export interface CartLineItem {
  id: string          // unique: productId + variantId
  productId: string
  variantId?: string
  title: string
  image: string
  price: number       // discountPrice or price
  originalPrice: number
  slug: string
  quantity: number
  savedForLater: boolean
  variant?: { type: string; valueUz: string; valueRu: string }
}

interface CartStore {
  items: CartLineItem[]
  promoCode: string | null
  promoDiscount: number  // amount off in UZS
  promoType: 'PERCENTAGE' | 'FIXED' | null

  // Actions
  addItem: (product: LocalizedProduct, quantity?: number, variantId?: string) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  toggleSaveLater: (id: string) => void
  clearCart: () => void
  applyPromo: (code: string, discount: number, type: 'PERCENTAGE' | 'FIXED') => void
  removePromo: () => void

  // Computed (used inline, not reactive)
  getActiveItems: () => CartLineItem[]
  getSavedItems: () => CartLineItem[]
  getSubtotal: () => number
  getShipping: () => number
  getTax: () => number
  getDiscountAmount: () => number
  getTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      promoCode: null,
      promoDiscount: 0,
      promoType: null,

      addItem: (product, quantity = 1, variantId) => {
        const lineId = variantId ? `${product.id}-${variantId}` : product.id
        set((state) => {
          const existing = state.items.find((i) => i.id === lineId)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === lineId
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            }
          }
          const variant = product.variants?.find((v) => v.id === variantId)
          const newItem: CartLineItem = {
            id: lineId,
            productId: product.id,
            variantId,
            title: product.title,
            image: product.images?.[0]?.url || '',
            price: product.discountPrice ?? product.price,
            originalPrice: product.price,
            slug: product.slug,
            quantity,
            savedForLater: false,
            variant: variant
              ? { type: variant.type, valueUz: variant.valueUz, valueRu: variant.valueRu }
              : undefined,
          }
          return { items: [...state.items, newItem] }
        })
      },

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      updateQuantity: (id, quantity) => {
        if (quantity < 1) {
          get().removeItem(id)
          return
        }
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        }))
      },

      toggleSaveLater: (id) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, savedForLater: !i.savedForLater } : i
          ),
        })),

      clearCart: () => set({ items: [], promoCode: null, promoDiscount: 0, promoType: null }),

      applyPromo: (code, discount, type) =>
        set({ promoCode: code, promoDiscount: discount, promoType: type }),

      removePromo: () => set({ promoCode: null, promoDiscount: 0, promoType: null }),

      getActiveItems: () => get().items.filter((i) => !i.savedForLater),
      getSavedItems: () => get().items.filter((i) => i.savedForLater),

      getSubtotal: () =>
        get()
          .getActiveItems()
          .reduce((sum, i) => sum + i.price * i.quantity, 0),

      getShipping: () => {
        const subtotal = get().getSubtotal()
        return subtotal > 0 && subtotal < 500000 ? 30000 : 0
      },

      getTax: () => 0,

      getDiscountAmount: () => {
        const { promoDiscount, promoType } = get()
        if (!promoDiscount) return 0
        if (promoType === 'PERCENTAGE') {
          return Math.round((get().getSubtotal() * promoDiscount) / 100)
        }
        return promoDiscount
      },

      getTotal: () => {
        const subtotal = get().getSubtotal()
        const shipping = get().getShipping()
        const discount = get().getDiscountAmount()
        return Math.max(0, subtotal + shipping - discount)
      },

      getItemCount: () =>
        get()
          .getActiveItems()
          .reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

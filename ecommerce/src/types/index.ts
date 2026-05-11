// ============================================================
// Global TypeScript Types
// ============================================================

import type { Locale } from '@/i18n/config'

// ── Re-exports ─────────────────────────────────────────────
export type { Locale }

// ── Utility ────────────────────────────────────────────────
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

// ── Enums (mirroring Prisma) ────────────────────────────────
export type Role = 'USER' | 'ADMIN' | 'SUPER_ADMIN'

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED'

export type PaymentMethod =
  | 'CLICK'
  | 'PAYME'
  | 'CASH_ON_DELIVERY'
  | 'CARD'

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'

export type DiscountType = 'PERCENTAGE' | 'FIXED'

// ── User ───────────────────────────────────────────────────
export interface User {
  id: string
  name: string
  email: string
  phone?: string
  role: Role
  avatar?: string
  isVerified: boolean
  createdAt: Date
  updatedAt: Date
}

// ── Address ─────────────────────────────────────────────────
export interface Address {
  id: string
  userId: string
  fullName: string
  phone: string
  region: string
  city: string
  street: string
  apartment?: string
  postalCode?: string
  isDefault: boolean
  createdAt: Date
}

// ── Category ────────────────────────────────────────────────
export interface Category {
  id: string
  nameUz: string
  nameRu: string
  slug: string
  image?: string
  description?: string
  parentId?: string
  children?: Category[]
  productCount?: number
  sortOrder: number
}

// ── Brand ───────────────────────────────────────────────────
export interface Brand {
  id: string
  name: string
  slug: string
  logo?: string
}

// ── Product Image ────────────────────────────────────────────
export interface ProductImage {
  id: string
  productId: string
  url: string
  alt?: string
  sortOrder: number
}

// ── Product Variant ──────────────────────────────────────────
export interface ProductVariant {
  id: string
  productId: string
  type: 'size' | 'color' | 'material'
  valueUz: string
  valueRu: string
  stock: number
  price?: number
  sku?: string
}

// ── Product ─────────────────────────────────────────────────
export interface Product {
  id: string
  titleUz: string
  titleRu: string
  descriptionUz: string
  descriptionRu: string
  specsUz?: Record<string, string>
  specsRu?: Record<string, string>
  slug: string
  price: number
  discountPrice?: number
  stock: number
  sku: string
  weight?: number
  isActive: boolean
  isFeatured: boolean
  isBestSeller: boolean
  viewCount: number
  soldCount: number
  rating: number
  reviewCount: number
  categoryId: string
  brandId?: string
  category?: Category
  brand?: Brand
  images: ProductImage[]
  variants?: ProductVariant[]
  reviews?: Review[]
  createdAt: Date
  updatedAt: Date
}

// Localized product helper (used in UI)
export interface LocalizedProduct extends Omit<Product, 'titleUz' | 'titleRu' | 'descriptionUz' | 'descriptionRu' | 'specsUz' | 'specsRu'> {
  title: string
  description: string
  specs?: Record<string, string>
  category?: LocalizedCategory
}

export interface LocalizedCategory extends Omit<Category, 'nameUz' | 'nameRu'> {
  name: string
}

// ── Review ──────────────────────────────────────────────────
export interface Review {
  id: string
  userId: string
  productId: string
  rating: number
  comment: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  helpful: number
  createdAt: Date
  user?: Pick<User, 'id' | 'name' | 'avatar'>
}

// ── Cart ────────────────────────────────────────────────────
export interface CartItem {
  id: string
  cartId: string
  productId: string
  variantId?: string
  quantity: number
  savedForLater: boolean
  product: LocalizedProduct
  variant?: ProductVariant
}

export interface Cart {
  id: string
  userId: string
  items: CartItem[]
}

// Client-side cart state (Zustand)
export interface CartState {
  items: CartItem[]
  promoCode?: string
  promoDiscount?: number
  addItem: (product: LocalizedProduct, quantity?: number, variantId?: string) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  applyPromo: (code: string, discount: number) => void
  removePromo: () => void
  getSubtotal: () => number
  getTotal: () => number
  getItemCount: () => number
}

// ── Order ───────────────────────────────────────────────────
export interface OrderItem {
  id: string
  orderId: string
  productId: string
  title: string
  image?: string
  price: number
  quantity: number
  total: number
  product?: LocalizedProduct
}

export interface OrderTracking {
  id: string
  orderId: string
  status: OrderStatus
  messageUz?: string
  messageRu?: string
  createdAt: Date
}

export interface Order {
  id: string
  orderNumber: string
  userId?: string
  shippingAddress: Address
  total: number
  subtotal: number
  shippingCost: number
  tax: number
  discount: number
  promoCode?: string
  status: OrderStatus
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  notes?: string
  items: OrderItem[]
  tracking: OrderTracking[]
  createdAt: Date
  updatedAt: Date
}

// ── Checkout ─────────────────────────────────────────────────
export interface CheckoutFormData {
  // Step 1: Shipping
  fullName: string
  email: string
  phone: string
  region: string
  city: string
  street: string
  apartment?: string
  postalCode?: string
  saveAddress?: boolean
  // Step 2: Payment
  paymentMethod: PaymentMethod
  notes?: string
}

// ── Promo Code ───────────────────────────────────────────────
export interface PromoCode {
  id: string
  code: string
  discountType: DiscountType
  value: number
  minOrderAmt?: number
  maxDiscount?: number
  expiresAt?: Date
  usageLimit?: number
  usedCount: number
  isActive: boolean
}

// ── Banner ───────────────────────────────────────────────────
export interface Banner {
  id: string
  titleUz: string
  titleRu: string
  subtitleUz?: string
  subtitleRu?: string
  image: string
  link?: string
  buttonTextUz?: string
  buttonTextRu?: string
  sortOrder: number
}

export interface LocalizedBanner extends Omit<Banner, 'titleUz' | 'titleRu' | 'subtitleUz' | 'subtitleRu' | 'buttonTextUz' | 'buttonTextRu'> {
  title: string
  subtitle?: string
  buttonText?: string
}

// ── API Responses ─────────────────────────────────────────────
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  perPage: number
  totalPages: number
}

// ── Product Filters ──────────────────────────────────────────
export interface ProductFilters {
  categorySlug?: string
  brandSlug?: string
  minPrice?: number
  maxPrice?: number
  minRating?: number
  inStock?: boolean
  onSale?: boolean
  search?: string
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'popular' | 'rating'
  page?: number
  perPage?: number
}

// ── Admin Stats ───────────────────────────────────────────────
export interface AdminStats {
  totalRevenue: number
  totalOrders: number
  totalUsers: number
  totalProducts: number
  revenueByMonth: { month: string; revenue: number }[]
  ordersByStatus: { status: OrderStatus; count: number }[]
  topProducts: { product: LocalizedProduct; soldCount: number }[]
}

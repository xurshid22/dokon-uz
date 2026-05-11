import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Locale } from '@/i18n/config'

// ── Tailwind class merger ────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ── Currency formatter (UZS) ─────────────────────────────────
export function formatPrice(
  amount: number | string,
  locale: Locale = 'uz',
  currency: string = 'UZS'
): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  if (locale === 'ru') {
    return new Intl.NumberFormat('ru-UZ', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(num)
  }
  return new Intl.NumberFormat('uz-UZ', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(num)
}

// ── Discount percentage ──────────────────────────────────────
export function getDiscountPercent(price: number, discountPrice: number): number {
  return Math.round(((price - discountPrice) / price) * 100)
}

// ── Slug generator ────────────────────────────────────────────
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

// ── Date formatter ─────────────────────────────────────────────
export function formatDate(date: Date | string, locale: Locale = 'uz'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat(locale === 'ru' ? 'ru-RU' : 'uz-UZ', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(d)
}

// ── Truncate text ──────────────────────────────────────────────
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

// ── Generate order number ──────────────────────────────────────
export function generateOrderNumber(): string {
  const date = new Date()
  const year = date.getFullYear().toString().slice(-2)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `ORD-${year}${month}${day}-${random}`
}

// ── Product localization ─────────────────────────────────────────
export function localizeProduct<T extends {
  titleUz: string
  titleRu: string
  descriptionUz: string
  descriptionRu: string
  specsUz?: Record<string, string> | null
  specsRu?: Record<string, string> | null
}>(product: T, locale: Locale) {
  return {
    ...product,
    title: locale === 'ru' ? product.titleRu : product.titleUz,
    description: locale === 'ru' ? product.descriptionRu : product.descriptionUz,
    specs: locale === 'ru' ? product.specsRu : product.specsUz,
  }
}

// ── Category localization ────────────────────────────────────────
export function localizeCategory<T extends { nameUz: string; nameRu: string }>(
  category: T,
  locale: Locale
) {
  return {
    ...category,
    name: locale === 'ru' ? category.nameRu : category.nameUz,
  }
}

// ── Star rating array ─────────────────────────────────────────
export function getRatingStars(rating: number): ('full' | 'half' | 'empty')[] {
  const stars: ('full' | 'half' | 'empty')[] = []
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) stars.push('full')
    else if (rating >= i - 0.5) stars.push('half')
    else stars.push('empty')
  }
  return stars
}

// ── Debounce ────────────────────────────────────────────────────
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

// ── Cart total helpers ──────────────────────────────────────────
export function calculateCartTotals(
  items: Array<{ price: number; quantity: number; discountPrice?: number }>,
  shippingThreshold = 500000
) {
  const subtotal = items.reduce((sum, item) => {
    const price = item.discountPrice ?? item.price
    return sum + price * item.quantity
  }, 0)
  const shipping = subtotal >= shippingThreshold ? 0 : 30000
  const tax = 0 // Uzbekistan: no VAT for consumers
  const total = subtotal + shipping + tax
  return { subtotal, shipping, tax, total }
}

// ── Image URL helpers ─────────────────────────────────────────
export function getProductImageUrl(url: string, size: 'sm' | 'md' | 'lg' = 'md'): string {
  // If Cloudinary URL, transform
  if (url.includes('res.cloudinary.com')) {
    const sizes = { sm: 'w_300,h_300', md: 'w_600,h_600', lg: 'w_1200,h_1200' }
    return url.replace('/upload/', `/upload/${sizes[size]},c_fill,f_auto,q_auto/`)
  }
  return url
}

// ── Shipping regions ──────────────────────────────────────────
export const UZBEKISTAN_REGIONS = {
  uz: [
    "Toshkent shahri", "Toshkent viloyati", "Samarqand viloyati",
    "Farg'ona viloyati", "Andijon viloyati", "Namangan viloyati",
    "Buxoro viloyati", "Xorazm viloyati", "Qashqadaryo viloyati",
    "Surxondaryo viloyati", "Jizzax viloyati", "Sirdaryo viloyati",
    "Navoiy viloyati", "Qoraqalpog'iston Respublikasi"
  ],
  ru: [
    "г. Ташкент", "Ташкентская область", "Самаркандская область",
    "Ферганская область", "Андижанская область", "Наманганская область",
    "Бухарская область", "Хорезмская область", "Кашкадарьинская область",
    "Сурхандарьинская область", "Джизакская область", "Сырдарьинская область",
    "Навоийская область", "Республика Каракалпакстан"
  ]
}

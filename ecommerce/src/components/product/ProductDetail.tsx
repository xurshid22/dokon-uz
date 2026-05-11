'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingCart, Heart, Share2, Star, Truck, Shield,
  RotateCcw, ChevronRight, Minus, Plus, ZoomIn, CheckCircle
} from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { useUIStore } from '@/store/uiStore'
import { getTranslations } from '@/i18n'
import { formatPrice, cn } from '@/lib/utils'
import { toast } from '@/hooks/useToast'
import type { LocalizedProduct } from '@/types'

interface Props {
  product: LocalizedProduct & {
    images: { id: string; url: string; alt?: string }[]
    variants: { id: string; type: string; valueUz: string; valueRu: string; price?: number; stock: number }[]
    reviews: {
      id: string
      rating: number
      comment: string
      createdAt: string
      user: { id: string; name: string; avatar?: string }
    }[]
    category: { id: string; name: string; slug: string } | null
    brand: { id: string; name: string; slug: string } | null
    sku: string
    stock: number
    rating: number
    reviewCount: number
    soldCount: number
    descriptionUz: string
    descriptionRu: string
    specificationsUz?: string
    specificationsRu?: string
    deliveryDays?: number
  }
  rawProduct: any
}

export function ProductDetail({ product, rawProduct }: Props) {
  const { locale } = useUIStore()
  const t = getTranslations(locale)
  const { addItem } = useCartStore()
  const { toggleItem, isInWishlist } = useWishlistStore()

  const [activeImage, setActiveImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({})
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description')
  const [zoom, setZoom] = useState(false)
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 })
  const [addedToCart, setAddedToCart] = useState(false)

  const inWishlist = isInWishlist(product.id)
  const isOutOfStock = product.stock <= 0
  const discount = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0

  // Group variants by type
  const variantGroups = product.variants.reduce((acc, v) => {
    if (!acc[v.type]) acc[v.type] = []
    acc[v.type].push(v)
    return acc
  }, {} as Record<string, typeof product.variants>)

  const handleAddToCart = () => {
    const variantId = Object.values(selectedVariants)[0]
    addItem({
      id: product.id + (variantId || ''),
      productId: product.id,
      title: product.title,
      slug: product.slug,
      price: product.discountPrice || product.price,
      image: product.images[0]?.url,
      quantity,
      variantId,
      variant: variantId
        ? product.variants.find(v => v.id === variantId)
        : undefined,
    })
    setAddedToCart(true)
    toast({ title: t.cart.added, variant: 'success' })
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setZoomPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    })
  }

  const description = locale === 'ru' ? rawProduct.descriptionRu : rawProduct.descriptionUz
  const specifications = locale === 'ru' ? rawProduct.specificationsRu : rawProduct.specificationsUz

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-primary transition-colors">{t.nav.home}</Link>
        <ChevronRight className="w-4 h-4" />
        <Link href="/products" className="hover:text-primary transition-colors">{t.nav.products}</Link>
        {product.category && (
          <>
            <ChevronRight className="w-4 h-4" />
            <Link href={`/products?category=${product.category.slug}`} className="hover:text-primary transition-colors">
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-600 dark:text-gray-300 truncate max-w-[200px]">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">
        {/* ── Image Gallery ───────────────────────────── */}
        <div className="space-y-4">
          {/* Main image */}
          <div
            className="relative aspect-square rounded-3xl overflow-hidden bg-gray-100 dark:bg-gray-800 cursor-zoom-in"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setZoom(true)}
            onMouseLeave={() => setZoom(false)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeImage}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="w-full h-full"
              >
                <Image
                  src={product.images[activeImage]?.url || '/placeholder.jpg'}
                  alt={product.images[activeImage]?.alt || product.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                  style={zoom ? {
                    transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                    transform: 'scale(2)',
                    transition: 'transform 0.1s',
                  } : {}}
                />
              </motion.div>
            </AnimatePresence>

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {discount > 0 && (
                <span className="badge-discount">-{discount}%</span>
              )}
              {product.stock > 0 && product.stock <= 5 && (
                <span className="bg-orange-100 text-orange-600 text-xs font-bold px-3 py-1.5 rounded-full">
                  {locale === 'ru' ? `Осталось ${product.stock}` : `Faqat ${product.stock} ta`}
                </span>
              )}
            </div>

            <ZoomIn className="absolute bottom-4 right-4 w-5 h-5 text-white/70" />
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {product.images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    'relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 transition-all',
                    activeImage === i
                      ? 'ring-2 ring-primary ring-offset-2'
                      : 'ring-1 ring-gray-200 dark:ring-gray-700 hover:ring-primary'
                  )}
                >
                  <Image src={img.url} alt={img.alt || ''} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Product Info ─────────────────────────────── */}
        <div className="space-y-6">
          {/* Brand + SKU */}
          <div className="flex items-center justify-between">
            {product.brand && (
              <Link href={`/products?brand=${product.brand.slug}`}
                className="text-sm font-semibold text-primary hover:underline">
                {product.brand.name}
              </Link>
            )}
            <span className="text-xs text-gray-400">SKU: {product.sku}</span>
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white leading-tight">
            {product.title}
          </h1>

          {/* Rating row */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map(s => (
                <Star key={s} className={cn('w-5 h-5', s <= Math.round(product.rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-200'
                )} />
              ))}
              <span className="ml-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                {product.rating.toFixed(1)}
              </span>
            </div>
            <span className="text-sm text-gray-400">
              ({product.reviewCount} {t.product.reviews})
            </span>
            <span className="text-sm text-gray-400">
              {product.soldCount}+ {t.product.sold}
            </span>
          </div>

          {/* Price */}
          <div className="flex items-end gap-4">
            <span className="text-3xl font-bold text-primary">
              {formatPrice(product.discountPrice || product.price, locale)}
            </span>
            {product.discountPrice && (
              <span className="text-xl text-gray-400 line-through">
                {formatPrice(product.price, locale)}
              </span>
            )}
            {discount > 0 && (
              <span className="text-sm font-bold text-green-600 bg-green-50 dark:bg-green-950 px-2 py-1 rounded-lg">
                {formatPrice(product.price - product.discountPrice!, locale)} {t.product.saving}
              </span>
            )}
          </div>

          {/* Variants */}
          {Object.entries(variantGroups).map(([type, variants]) => (
            <div key={type}>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 capitalize">
                {type}:
                {selectedVariants[type] && (
                  <span className="font-normal text-primary ml-2">
                    {locale === 'ru'
                      ? variants.find(v => v.id === selectedVariants[type])?.valueRu
                      : variants.find(v => v.id === selectedVariants[type])?.valueUz}
                  </span>
                )}
              </p>
              <div className="flex gap-2 flex-wrap">
                {variants.map(v => {
                  const isSelected = selectedVariants[type] === v.id
                  const isColor = type.toLowerCase() === 'color' || type.toLowerCase() === 'rang'
                  return (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariants(prev => ({ ...prev, [type]: v.id }))}
                      disabled={v.stock === 0}
                      className={cn(
                        'px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all',
                        isSelected
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-gray-200 dark:border-gray-700 hover:border-primary',
                        v.stock === 0 && 'opacity-40 cursor-not-allowed line-through'
                      )}
                    >
                      {locale === 'ru' ? v.valueRu : v.valueUz}
                      {v.price && v.price !== product.price && (
                        <span className="ml-1 text-xs text-gray-400">
                          +{formatPrice(v.price - product.price, locale)}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}

          {/* Quantity + Add to Cart */}
          <div className="flex items-center gap-4">
            {/* Quantity */}
            <div className="flex items-center border-2 border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center font-bold text-lg">{quantity}</span>
              <button
                onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Add to cart */}
            <motion.button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              whileTap={{ scale: 0.97 }}
              className={cn(
                'flex-1 h-12 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all',
                isOutOfStock
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : addedToCart
                    ? 'bg-green-500 text-white'
                    : 'btn-primary'
              )}
            >
              {addedToCart
                ? <><CheckCircle className="w-5 h-5" /> {t.cart.added}</>
                : isOutOfStock
                  ? (locale === 'ru' ? 'Нет в наличии' : 'Mavjud emas')
                  : <><ShoppingCart className="w-5 h-5" /> {t.product.add_to_cart}</>
              }
            </motion.button>

            {/* Wishlist */}
            <motion.button
              onClick={() => toggleItem({ id: product.id, title: product.title, price: product.price, slug: product.slug, image: product.images[0]?.url })}
              whileTap={{ scale: 0.9 }}
              className={cn(
                'w-12 h-12 rounded-2xl border-2 flex items-center justify-center transition-all',
                inWishlist
                  ? 'border-red-400 bg-red-50 text-red-500'
                  : 'border-gray-200 dark:border-gray-700 hover:border-red-400 hover:text-red-500'
              )}
            >
              <Heart className={cn('w-5 h-5', inWishlist && 'fill-red-500')} />
            </motion.button>
          </div>

          {/* Stock status */}
          <div className={cn(
            'flex items-center gap-2 text-sm font-medium',
            product.stock > 0 ? 'text-green-600' : 'text-red-500'
          )}>
            <div className={cn('w-2 h-2 rounded-full', product.stock > 0 ? 'bg-green-500' : 'bg-red-500')} />
            {product.stock > 0
              ? `${t.product.in_stock} (${product.stock} ${locale === 'ru' ? 'шт.' : 'dona'})`
              : t.product.out_of_stock}
          </div>

          {/* Delivery info */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Truck, label: locale === 'ru' ? 'Бесплатная\nдоставка' : "Bepul\nyetkazib berish", sub: locale === 'ru' ? 'от 500 000 сум' : '500 000 sumdan' },
              { icon: Shield, label: locale === 'ru' ? 'Гарантия\nкачества' : "Sifat\nkafolati", sub: locale === 'ru' ? '30 дней' : '30 kun' },
              { icon: RotateCcw, label: locale === 'ru' ? 'Возврат\nтовара' : "Mahsulot\nqaytarish", sub: locale === 'ru' ? 'Бесплатно' : 'Bepul' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex flex-col items-center text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-2xl gap-1.5">
                <Icon className="w-5 h-5 text-primary" />
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-200 whitespace-pre-line leading-tight">{label}</p>
                <p className="text-xs text-gray-400">{sub}</p>
              </div>
            ))}
          </div>

          {/* Share */}
          <button
            onClick={() => navigator.share?.({ title: product.title, url: window.location.href })}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-primary transition-colors"
          >
            <Share2 className="w-4 h-4" />
            {locale === 'ru' ? 'Поделиться' : 'Ulashish'}
          </button>
        </div>
      </div>

      {/* ── Tabs ─────────────────────────────────────── */}
      <div className="mt-14">
        <div className="flex border-b border-gray-200 dark:border-gray-700 gap-1">
          {(['description', 'specs', 'reviews'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-6 py-3 text-sm font-semibold transition-all relative',
                activeTab === tab
                  ? 'text-primary'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              )}
            >
              {tab === 'description' && (locale === 'ru' ? 'Описание' : 'Tavsif')}
              {tab === 'specs' && (locale === 'ru' ? 'Характеристики' : 'Xususiyatlar')}
              {tab === 'reviews' && `${locale === 'ru' ? 'Отзывы' : 'Sharhlar'} (${product.reviews.length})`}
              {activeTab === tab && (
                <motion.div
                  layoutId="tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                />
              )}
            </button>
          ))}
        </div>

        <div className="py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'description' && (
                <div
                  className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: description || (locale === 'ru' ? 'Описание недоступно' : 'Tavsif mavjud emas') }}
                />
              )}

              {activeTab === 'specs' && (
                <div className="max-w-2xl">
                  {specifications
                    ? <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: specifications }} />
                    : (
                      <p className="text-gray-400">
                        {locale === 'ru' ? 'Характеристики не указаны' : 'Xususiyatlar ko\'rsatilmagan'}
                      </p>
                    )}
                </div>
              )}

              {activeTab === 'reviews' && (
                <ReviewsSection reviews={product.reviews} rating={product.rating} reviewCount={product.reviewCount} locale={locale} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

// ── Reviews Section ────────────────────────────────────────
function ReviewsSection({ reviews, rating, reviewCount, locale }: {
  reviews: Props['product']['reviews']
  rating: number
  reviewCount: number
  locale: string
}) {
  const ratingBuckets = [5, 4, 3, 2, 1].map(n => ({
    n,
    count: reviews.filter(r => r.rating === n).length,
    pct: reviewCount ? (reviews.filter(r => r.rating === n).length / reviewCount) * 100 : 0,
  }))

  return (
    <div className="space-y-8">
      {/* Summary */}
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800/50 rounded-3xl p-8 min-w-[140px]">
          <span className="text-5xl font-black text-gray-900 dark:text-white">{rating.toFixed(1)}</span>
          <div className="flex gap-0.5 my-2">
            {[1,2,3,4,5].map(s => (
              <Star key={s} className={cn('w-5 h-5', s <= Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200')} />
            ))}
          </div>
          <span className="text-sm text-gray-400">{reviewCount} {locale === 'ru' ? 'отзывов' : 'sharh'}</span>
        </div>

        <div className="flex-1 space-y-2">
          {ratingBuckets.map(({ n, count, pct }) => (
            <div key={n} className="flex items-center gap-3">
              <span className="text-sm font-medium w-4 text-gray-600 dark:text-gray-400">{n}</span>
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.5, delay: n * 0.05 }}
                  className="h-full bg-yellow-400 rounded-full"
                />
              </div>
              <span className="text-sm text-gray-400 w-6">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Individual reviews */}
      {reviews.length === 0 ? (
        <p className="text-gray-400 text-center py-8">
          {locale === 'ru' ? 'Пока нет отзывов' : 'Hozircha sharhlar yo\'q'}
        </p>
      ) : (
        <div className="space-y-5">
          {reviews.map(review => (
            <div key={review.id} className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary flex-shrink-0">
                  {review.user.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900 dark:text-white text-sm">{review.user.name}</span>
                    <span className="text-xs text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'uz-UZ')}
                    </span>
                  </div>
                  <div className="flex gap-0.5 my-1">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} className={cn('w-3.5 h-3.5', s <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200')} />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{review.comment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

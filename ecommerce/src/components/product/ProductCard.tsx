'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Heart, ShoppingCart, Star, Eye, Zap } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { useUIStore } from '@/store/uiStore'
import { formatPrice, getDiscountPercent, cn } from '@/lib/utils'
import { getTranslations } from '@/i18n'
import { toast } from '@/hooks/useToast'
import type { LocalizedProduct } from '@/types'

interface ProductCardProps {
  product: LocalizedProduct
  className?: string
  layout?: 'grid' | 'list'
}

export function ProductCard({ product, className, layout = 'grid' }: ProductCardProps) {
  const { locale } = useUIStore()
  const t = getTranslations(locale)
  const addItem = useCartStore((s) => s.addItem)
  const { toggleItem, isInWishlist } = useWishlistStore()
  const [imgLoaded, setImgLoaded] = useState(false)
  const [adding, setAdding] = useState(false)

  const inWishlist = isInWishlist(product.id)
  const mainImage = product.images?.[0]?.url || 'https://placehold.co/400x400/f3f4f6/9ca3af?text=No+Image'
  const discount = product.discountPrice
    ? getDiscountPercent(product.price, product.discountPrice)
    : 0

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setAdding(true)
    addItem(product)
    toast({
      title: locale === 'ru' ? '✅ Добавлено в корзину' : "✅ Savatga qo'shildi",
      variant: 'success',
    })
    setTimeout(() => setAdding(false), 600)
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleItem({
      id: product.id,
      productId: product.id,
      title: product.title,
      image: mainImage,
      price: product.price,
      discountPrice: product.discountPrice,
      slug: product.slug,
      rating: product.rating,
    })
    toast({
      title: inWishlist
        ? (locale === 'ru' ? 'Удалено из избранного' : "Sevimlilardan olib tashlandi")
        : (locale === 'ru' ? '❤️ Добавлено в избранное' : "❤️ Sevimliga qo'shildi"),
    })
  }

  if (layout === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className={cn(
          'product-card flex gap-4 p-4',
          className
        )}
      >
        <Link href={`/products/${product.slug}`} className="relative w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden">
          <Image src={mainImage} alt={product.title} fill className="object-cover" />
        </Link>
        <div className="flex-1 min-w-0">
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-semibold text-gray-900 dark:text-white hover:text-primary transition-colors line-clamp-2">
              {product.title}
            </h3>
          </Link>
          <div className="flex items-center gap-1 mt-1">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-sm text-gray-600">{product.rating.toFixed(1)}</span>
            <span className="text-xs text-gray-400">({product.reviewCount})</span>
          </div>
          <div className="flex items-center gap-3 mt-2">
            {product.discountPrice ? (
              <>
                <span className="text-lg font-bold text-primary">
                  {formatPrice(product.discountPrice, locale)}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(product.price, locale)}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {formatPrice(product.price, locale)}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <button onClick={handleWishlist}
            className={cn('p-2 rounded-xl border transition-colors',
              inWishlist ? 'bg-red-50 border-red-200 text-red-500' : 'border-gray-200 text-gray-400 hover:text-red-500')}>
            <Heart className={cn('w-4 h-4', inWishlist && 'fill-current')} />
          </button>
          <button onClick={handleAddToCart}
            className="p-2 rounded-xl bg-primary text-white hover:bg-primary-600 transition-colors">
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className={cn('product-card group', className)}
    >
      {/* Image */}
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
          {!imgLoaded && <div className="skeleton absolute inset-0 rounded-none" />}
          <Image
            src={mainImage}
            alt={product.title}
            fill
            className={cn(
              'object-cover group-hover:scale-105 transition-transform duration-500',
              imgLoaded ? 'opacity-100' : 'opacity-0'
            )}
            onLoad={() => setImgLoaded(true)}
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {discount > 0 && (
              <span className="badge-sale">-{discount}%</span>
            )}
            {product.stock === 0 && (
              <span className="bg-gray-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                {t.product.out_of_stock}
              </span>
            )}
            {product.isFeatured && (
              <span className="badge-new">
                {locale === 'ru' ? 'Топ' : 'Top'}
              </span>
            )}
          </div>

          {/* Actions overlay */}
          <div className="absolute top-3 right-3 flex flex-col gap-2
                           opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {/* Wishlist */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleWishlist}
              className={cn(
                'w-9 h-9 rounded-xl shadow-md flex items-center justify-center transition-colors',
                inWishlist
                  ? 'bg-red-500 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:text-red-500'
              )}
              aria-label="Add to wishlist"
            >
              <Heart className={cn('w-4 h-4', inWishlist && 'fill-current')} />
            </motion.button>

            {/* Quick view */}
            <Link
              href={`/products/${product.slug}`}
              className="w-9 h-9 rounded-xl bg-white dark:bg-gray-800 shadow-md
                         flex items-center justify-center text-gray-700 dark:text-gray-200
                         hover:text-primary transition-colors"
              aria-label="Quick view"
            >
              <Eye className="w-4 h-4" />
            </Link>
          </div>

          {/* Add to cart — bottom overlay */}
          <motion.button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || adding}
            className="absolute bottom-0 inset-x-0 bg-primary hover:bg-primary-600
                       text-white font-semibold py-3 text-sm
                       translate-y-full group-hover:translate-y-0
                       transition-transform duration-300
                       disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center justify-center gap-2"
          >
            {adding ? (
              <motion.div
                key="check"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                ✓ {locale === 'ru' ? 'Добавлено' : "Qo'shildi"}
              </motion.div>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                {t.product.add_to_cart}
              </>
            )}
          </motion.button>
        </div>
      </Link>

      {/* Info */}
      <div className="p-4">
        {product.category && (
          <Link
            href={`/categories/${product.category.slug}`}
            className="text-xs text-primary font-medium hover:underline"
          >
            {product.category.name}
          </Link>
        )}

        <Link href={`/products/${product.slug}`}>
          <h3 className="mt-1 text-sm font-semibold text-gray-900 dark:text-white
                          hover:text-primary transition-colors line-clamp-2">
            {product.title}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-1.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={cn(
                'w-3 h-3',
                star <= Math.round(product.rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              )}
            />
          ))}
          <span className="text-xs text-gray-500 ml-1">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mt-2.5">
          <div className="flex items-center gap-2">
            {product.discountPrice ? (
              <>
                <span className="text-base font-bold text-primary">
                  {formatPrice(product.discountPrice, locale)}
                </span>
                <span className="text-xs text-gray-400 line-through">
                  {formatPrice(product.price, locale)}
                </span>
              </>
            ) : (
              <span className="text-base font-bold text-gray-900 dark:text-white">
                {formatPrice(product.price, locale)}
              </span>
            )}
          </div>

          {product.isBestSeller && (
            <span className="flex items-center gap-0.5 text-xs text-orange-500 font-medium">
              <Zap className="w-3 h-3 fill-orange-500" />
              {locale === 'ru' ? 'Хит' : 'Hit'}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

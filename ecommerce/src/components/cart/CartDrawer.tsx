'use client'

import { Fragment } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useUIStore } from '@/store/uiStore'
import { formatPrice } from '@/lib/utils'
import { getTranslations } from '@/i18n'

export function CartDrawer() {
  const { cartOpen, setCartOpen, locale } = useUIStore()
  const t = getTranslations(locale)
  const { getActiveItems, removeItem, updateQuantity, getSubtotal, getShipping, getTotal, getItemCount } = useCartStore()

  const items = getActiveItems()
  const subtotal = getSubtotal()
  const shipping = getShipping()
  const total = getTotal()

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-gray-900
                       shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b dark:border-gray-700">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-primary" />
                <h2 className="font-bold text-lg text-gray-900 dark:text-white">
                  {t.cart.title}
                </h2>
                {getItemCount() > 0 && (
                  <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {getItemCount()}
                  </span>
                )}
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-16">
                  <ShoppingBag className="w-16 h-16 text-gray-200 dark:text-gray-700 mb-4" />
                  <p className="text-gray-500 font-medium">{t.cart.empty}</p>
                  <p className="text-gray-400 text-sm mt-1">{t.cart.empty_subtitle}</p>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="btn-primary mt-6 text-sm"
                  >
                    {t.cart.continue_shopping}
                  </button>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 40, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.25 }}
                      className="flex gap-4"
                    >
                      {/* Image */}
                      <Link href={`/products/${item.slug}`} onClick={() => setCartOpen(false)}>
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                          <Image src={item.image || '/placeholder.jpg'} alt={item.title} fill className="object-cover" />
                        </div>
                      </Link>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <Link href={`/products/${item.slug}`} onClick={() => setCartOpen(false)}>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 hover:text-primary transition-colors">
                            {item.title}
                          </p>
                        </Link>
                        {item.variant && (
                          <p className="text-xs text-gray-400 mt-0.5">
                            {locale === 'ru' ? item.variant.valueRu : item.variant.valueUz}
                          </p>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          {/* Quantity */}
                          <div className="flex items-center gap-1 border dark:border-gray-700 rounded-xl overflow-hidden">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <p className="font-bold text-primary">
                              {formatPrice(item.price * item.quantity, locale)}
                            </p>
                            {item.quantity > 1 && (
                              <p className="text-xs text-gray-400">{formatPrice(item.price, locale)} × {item.quantity}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="self-start p-1.5 text-gray-400 hover:text-red-500 transition-colors mt-0.5"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                {/* Free shipping progress */}
                {shipping > 0 && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                      <span>{t.cart.free_shipping_msg} {formatPrice(500000 - subtotal, locale)} {t.cart.free_shipping_threshold}</span>
                    </div>
                    <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((subtotal / 500000) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Totals */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                    <span>{t.cart.subtotal}</span>
                    <span>{formatPrice(subtotal, locale)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                    <span>{t.cart.shipping}</span>
                    <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                      {shipping === 0
                        ? (locale === 'ru' ? 'Бесплатно' : 'Bepul')
                        : formatPrice(shipping, locale)}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-base text-gray-900 dark:text-white pt-2 border-t dark:border-gray-700">
                    <span>{t.cart.total}</span>
                    <span className="text-primary">{formatPrice(total, locale)}</span>
                  </div>
                </div>

                {/* Buttons */}
                <Link
                  href="/checkout"
                  onClick={() => setCartOpen(false)}
                  className="btn-primary w-full flex items-center justify-center gap-2 mb-3"
                >
                  {t.cart.checkout}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => setCartOpen(false)}
                  className="w-full text-center text-sm text-gray-500 hover:text-primary transition-colors"
                >
                  {t.cart.continue_shopping}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

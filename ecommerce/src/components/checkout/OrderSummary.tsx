'use client'

import Image from 'next/image'
import { Tag } from 'lucide-react'
import { useState } from 'react'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'

interface Props {
  items: any[]
  subtotal: number
  shippingCost: number
  total: number
  locale: string
  appliedPromo: any
}

export function OrderSummary({ items, subtotal, shippingCost, total, locale, appliedPromo }: Props) {
  const { applyPromo, removePromo } = useCartStore()
  const [promoInput, setPromoInput] = useState('')
  const [promoLoading, setPromoLoading] = useState(false)
  const lbl = (uz: string, ru: string) => locale === 'ru' ? ru : uz

  const handlePromo = async () => {
    if (!promoInput.trim()) return
    setPromoLoading(true)
    try {
      const res = await fetch(`/api/promo?code=${promoInput.trim()}`)
      const data = await res.json()
      if (data.valid) {
        applyPromo({ code: promoInput.trim(), discount: data.discount, type: data.type })
      }
    } finally {
      setPromoLoading(false)
    }
  }

  const discount = appliedPromo?.discount || 0

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 sticky top-24">
      <h3 className="font-bold text-gray-900 dark:text-white mb-4">
        {lbl('Buyurtma', 'Заказ')} ({items.length})
      </h3>

      {/* Items */}
      <div className="space-y-3 mb-4 max-h-64 overflow-y-auto pr-1">
        {items.map(item => (
          <div key={item.id} className="flex gap-3">
            <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
              <Image src={item.image || '/placeholder.jpg'} alt={item.title} fill className="object-cover" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center font-bold">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-2">{item.title}</p>
              <p className="text-sm font-bold text-primary">{formatPrice(item.price * item.quantity, locale)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Promo code */}
      <div className="mb-4">
        {appliedPromo ? (
          <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl px-4 py-2.5">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-green-600" />
              <span className="text-sm font-semibold text-green-700 dark:text-green-400">{appliedPromo.code}</span>
            </div>
            <button onClick={removePromo} className="text-xs text-red-500 hover:underline">
              {lbl('Olib tashlash', 'Убрать')}
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              value={promoInput}
              onChange={e => setPromoInput(e.target.value.toUpperCase())}
              placeholder={lbl('Promo kod', 'Промо код')}
              className="form-input flex-1 text-sm"
              onKeyDown={e => e.key === 'Enter' && handlePromo()}
            />
            <button
              onClick={handlePromo}
              disabled={promoLoading || !promoInput}
              className="btn-primary text-sm px-4 whitespace-nowrap"
            >
              {lbl("Qo'llash", 'Применить')}
            </button>
          </div>
        )}
      </div>

      {/* Totals */}
      <div className="space-y-2 pt-4 border-t border-gray-100 dark:border-gray-800">
        <div className="flex justify-between text-sm text-gray-500">
          <span>{lbl('Mahsulotlar', 'Товары')}</span>
          <span>{formatPrice(subtotal, locale)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>{lbl('Chegirma', 'Скидка')}</span>
            <span>-{formatPrice(discount, locale)}</span>
          </div>
        )}
        <div className="flex justify-between text-sm text-gray-500">
          <span>{lbl('Yetkazib berish', 'Доставка')}</span>
          <span className={shippingCost === 0 ? 'text-green-600 font-medium' : ''}>
            {shippingCost === 0 ? lbl('Bepul', 'Бесплатно') : formatPrice(shippingCost, locale)}
          </span>
        </div>
        <div className="flex justify-between font-bold text-base text-gray-900 dark:text-white pt-2 border-t border-gray-100 dark:border-gray-800">
          <span>{lbl('Jami', 'Итого')}</span>
          <span className="text-primary text-lg">{formatPrice(total - discount, locale)}</span>
        </div>
      </div>
    </div>
  )
}

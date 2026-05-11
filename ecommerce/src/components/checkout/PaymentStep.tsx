'use client'

import { motion } from 'framer-motion'
import { CheckCircle, Banknote } from 'lucide-react'
import type { PaymentMethod } from './CheckoutFlow'
import { cn } from '@/lib/utils'

interface Props {
  locale: string
  value: PaymentMethod
  onChange: (v: PaymentMethod) => void
  onNext: () => void
  onBack: () => void
}

const PAYMENT_OPTIONS: { id: PaymentMethod; nameUz: string; nameRu: string; descUz: string; descRu: string; color: string }[] = [
  {
    id: 'CLICK',
    nameUz: 'Click',
    nameRu: 'Click',
    descUz: 'Click ilovasi orqali to\'lang',
    descRu: 'Оплата через приложение Click',
    color: 'bg-blue-500',
  },
  {
    id: 'PAYME',
    nameUz: 'Payme',
    nameRu: 'Payme',
    descUz: 'Payme ilovasi orqali to\'lang',
    descRu: 'Оплата через приложение Payme',
    color: 'bg-teal-500',
  },
  {
    id: 'CASH',
    nameUz: 'Naqd pul',
    nameRu: 'Наличные',
    descUz: 'Yetkazib berishda to\'lang',
    descRu: 'Оплата при получении',
    color: 'bg-green-500',
  },
]

export function PaymentStep({ locale, value, onChange, onNext, onBack }: Props) {
  const lbl = (uz: string, ru: string) => locale === 'ru' ? ru : uz

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        {lbl("To'lov usulini tanlang", 'Выберите способ оплаты')}
      </h2>

      <div className="space-y-3">
        {PAYMENT_OPTIONS.map(opt => (
          <motion.button
            key={opt.id}
            whileTap={{ scale: 0.99 }}
            onClick={() => onChange(opt.id)}
            className={cn(
              'w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left',
              value === opt.id
                ? 'border-primary bg-primary/5'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
            )}
          >
            {/* Icon */}
            <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg', opt.color)}>
              {opt.id === 'CASH' ? <Banknote className="w-6 h-6" /> : opt.nameUz[0]}
            </div>

            {/* Text */}
            <div className="flex-1">
              <p className="font-semibold text-gray-900 dark:text-white">
                {locale === 'ru' ? opt.nameRu : opt.nameUz}
              </p>
              <p className="text-sm text-gray-400">
                {locale === 'ru' ? opt.descRu : opt.descUz}
              </p>
            </div>

            {/* Check */}
            {value === opt.id && (
              <CheckCircle className="w-6 h-6 text-primary flex-shrink-0" />
            )}
          </motion.button>
        ))}
      </div>

      <div className="flex gap-3 pt-2">
        <button onClick={onBack} className="btn-secondary flex-1">
          ← {lbl('Orqaga', 'Назад')}
        </button>
        <button onClick={onNext} className="btn-primary flex-1">
          {lbl('Tasdiqlash', 'Подтвердить')} →
        </button>
      </div>
    </div>
  )
}

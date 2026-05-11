'use client'

import { Loader2, MapPin, CreditCard, CheckCircle } from 'lucide-react'
import type { ShippingAddress, PaymentMethod } from './CheckoutFlow'

interface Props {
  locale: string
  shipping: ShippingAddress
  payment: PaymentMethod
  onBack: () => void
  onConfirm: () => void
  loading: boolean
}

export function ConfirmStep({ locale, shipping, payment, onBack, onConfirm, loading }: Props) {
  const lbl = (uz: string, ru: string) => locale === 'ru' ? ru : uz
  const paymentLabel = {
    CLICK: 'Click', PAYME: 'Payme',
    CASH: lbl('Naqd pul (yetkazishda)', 'Наличные (при получении)')
  }[payment]

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white">
        {lbl('Buyurtmani tasdiqlash', 'Подтверждение заказа')}
      </h2>

      {/* Shipping summary */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 space-y-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          <MapPin className="w-4 h-4 text-primary" />
          {lbl('Yetkazib berish', 'Доставка')}
        </div>
        <Row label={lbl('Ism', 'Имя')} value={shipping.fullName} />
        <Row label={lbl('Telefon', 'Телефон')} value={shipping.phone} />
        <Row label="Email" value={shipping.email} />
        <Row label={lbl('Manzil', 'Адрес')} value={`${shipping.region}, ${shipping.city}, ${shipping.address}`} />
        {shipping.notes && <Row label={lbl('Izoh', 'Примечание')} value={shipping.notes} />}
      </div>

      {/* Payment summary */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          <CreditCard className="w-4 h-4 text-primary" />
          {lbl("To'lov", 'Оплата')}
        </div>
        <Row label={lbl("To'lov usuli", 'Способ оплаты')} value={paymentLabel} />
      </div>

      {/* Agreement */}
      <p className="text-xs text-gray-400 text-center leading-relaxed">
        {lbl(
          "Buyurtma berish orqali siz foydalanish shartlarimizga rozilik bildirasiz",
          "Оформляя заказ, вы соглашаетесь с нашими условиями использования"
        )}
      </p>

      <div className="flex gap-3">
        <button onClick={onBack} disabled={loading} className="btn-secondary flex-1">
          ← {lbl('Orqaga', 'Назад')}
        </button>
        <button onClick={onConfirm} disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> {lbl('Yuklanmoqda...', 'Загрузка...')}</>
          ) : (
            <><CheckCircle className="w-4 h-4" /> {lbl('Buyurtma berish', 'Оформить заказ')}</>
          )}
        </button>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-400">{label}</span>
      <span className="text-gray-700 dark:text-gray-200 font-medium text-right max-w-[60%]">{value}</span>
    </div>
  )
}

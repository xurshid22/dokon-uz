'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, CreditCard, CheckCircle, ChevronRight, Loader2 } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useUIStore } from '@/store/uiStore'
import { getTranslations } from '@/i18n'
import { formatPrice } from '@/lib/utils'
import { toast } from '@/hooks/useToast'
import { ShippingStep } from './ShippingStep'
import { PaymentStep } from './PaymentStep'
import { ConfirmStep } from './ConfirmStep'
import { OrderSummary } from './OrderSummary'

export type ShippingAddress = {
  fullName: string
  phone: string
  email: string
  region: string
  city: string
  address: string
  zipCode: string
  notes: string
}

export type PaymentMethod = 'CLICK' | 'PAYME' | 'CASH'

const STEPS = ['shipping', 'payment', 'confirm'] as const
type Step = typeof STEPS[number]

export function CheckoutFlow() {
  const router = useRouter()
  const { locale } = useUIStore()
  const t = getTranslations(locale)
  const { getActiveItems, getTotal, getSubtotal, getShipping, clearCart, appliedPromo } = useCartStore()

  const [step, setStep] = useState<Step>('shipping')
  const [loading, setLoading] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)

  const [shipping, setShipping] = useState<ShippingAddress>({
    fullName: '', phone: '', email: '', region: '',
    city: '', address: '', zipCode: '', notes: '',
  })
  const [payment, setPayment] = useState<PaymentMethod>('CASH')

  const items = getActiveItems()
  const subtotal = getSubtotal()
  const shippingCost = getShipping()
  const total = getTotal()

  const stepIndex = STEPS.indexOf(step)

  const stepLabels = {
    shipping: { icon: MapPin, label: locale === 'ru' ? 'Доставка' : 'Yetkazib berish' },
    payment: { icon: CreditCard, label: locale === 'ru' ? 'Оплата' : "To'lov" },
    confirm: { icon: CheckCircle, label: locale === 'ru' ? 'Подтверждение' : 'Tasdiqlash' },
  }

  const placeOrder = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({
            productId: i.productId || i.id,
            variantId: i.variantId,
            quantity: i.quantity,
          })),
          shippingAddress: shipping,
          paymentMethod: payment,
          promoCode: appliedPromo?.code,
          guestEmail: shipping.email,
          guestName: shipping.fullName,
          guestPhone: shipping.phone,
        }),
      })

      if (!res.ok) throw new Error('Order failed')
      const data = await res.json()
      setOrderId(data.data.id)
      clearCart()

      // Redirect to payment gateway if online payment
      if (payment === 'CLICK') {
        window.location.href = `https://my.click.uz/services/pay?service_id=${process.env.NEXT_PUBLIC_CLICK_SERVICE_ID}&merchant_id=${process.env.NEXT_PUBLIC_CLICK_MERCHANT_ID}&amount=${total}&transaction_param=${data.data.orderNumber}`
      } else if (payment === 'PAYME') {
        const encoded = btoa(JSON.stringify({ id: data.data.orderNumber, a: total }))
        window.location.href = `https://checkout.paycom.uz/${encoded}`
      } else {
        router.push(`/orders/${data.data.id}/success`)
      }
    } catch (e) {
      toast({ title: locale === 'ru' ? 'Ошибка при оформлении' : 'Buyurtmada xatolik', variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0 && !orderId) {
    router.replace('/products')
    return null
  }

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {locale === 'ru' ? 'Оформление заказа' : 'Buyurtma berish'}
        </h1>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2">
          {STEPS.map((s, i) => {
            const { icon: Icon, label } = stepLabels[s]
            const done = i < stepIndex
            const active = s === step
            return (
              <div key={s} className="flex items-center gap-2">
                <button
                  onClick={() => done && setStep(s)}
                  className="flex items-center gap-2"
                  disabled={!done}
                >
                  <div className={`
                    w-9 h-9 rounded-full flex items-center justify-center transition-all font-bold text-sm
                    ${active ? 'bg-primary text-white shadow-lg shadow-primary/30' :
                      done ? 'bg-green-500 text-white' :
                      'bg-gray-200 dark:bg-gray-700 text-gray-400'}
                  `}>
                    {done ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <span className={`hidden sm:block text-sm font-medium ${active ? 'text-primary' : done ? 'text-green-600' : 'text-gray-400'}`}>
                    {label}
                  </span>
                </button>
                {i < STEPS.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 mx-1" />
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Step content */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-6"
            >
              {step === 'shipping' && (
                <ShippingStep
                  locale={locale}
                  values={shipping}
                  onChange={setShipping}
                  onNext={() => setStep('payment')}
                />
              )}
              {step === 'payment' && (
                <PaymentStep
                  locale={locale}
                  value={payment}
                  onChange={setPayment}
                  onNext={() => setStep('confirm')}
                  onBack={() => setStep('shipping')}
                />
              )}
              {step === 'confirm' && (
                <ConfirmStep
                  locale={locale}
                  shipping={shipping}
                  payment={payment}
                  onBack={() => setStep('payment')}
                  onConfirm={placeOrder}
                  loading={loading}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Order summary sidebar */}
        <div className="lg:col-span-1">
          <OrderSummary
            items={items}
            subtotal={subtotal}
            shippingCost={shippingCost}
            total={total}
            locale={locale}
            appliedPromo={appliedPromo}
          />
        </div>
      </div>
    </div>
  )
}

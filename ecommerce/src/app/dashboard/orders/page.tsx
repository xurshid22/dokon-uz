import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import { Package, ChevronRight } from 'lucide-react'

const STATUS_CONFIG: Record<string, { uz: string; color: string; step: number }> = {
  PENDING:    { uz: 'Kutilmoqda',     color: 'bg-yellow-100 text-yellow-700 border-yellow-200', step: 1 },
  CONFIRMED:  { uz: 'Tasdiqlandi',    color: 'bg-blue-100 text-blue-700 border-blue-200',       step: 2 },
  PROCESSING: { uz: 'Tayyorlanmoqda', color: 'bg-purple-100 text-purple-700 border-purple-200', step: 3 },
  SHIPPED:    { uz: 'Yo\'lda',        color: 'bg-orange-100 text-orange-700 border-orange-200', step: 4 },
  DELIVERED:  { uz: 'Yetkazildi',     color: 'bg-green-100 text-green-700 border-green-200',    step: 5 },
  CANCELLED:  { uz: 'Bekor qilindi',  color: 'bg-red-100 text-red-600 border-red-200',          step: 0 },
}

const TRACKING_STEPS = ['Qabul qilindi', 'Tasdiqlandi', 'Tayyorlanmoqda', 'Jo\'natildi', 'Yetkazildi']

export default async function OrdersPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      items: true,
      tracking: { orderBy: { createdAt: 'asc' } },
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="section-title">Buyurtmalarim</h1>
        <span className="text-sm text-gray-400">{orders.length} ta buyurtma</span>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-16 text-center">
          <Package className="w-16 h-16 text-gray-200 dark:text-gray-700 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Hali buyurtma yo'q</p>
          <Link href="/products" className="btn-primary text-sm mt-4 inline-block">Xarid qilish</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const st = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING
            return (
              <div key={order.id} className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">#{order.orderNumber}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${st.color}`}>
                      {st.uz}
                    </span>
                    <p className="font-bold text-primary mt-1.5">{formatPrice(Number(order.total), 'uz')}</p>
                  </div>
                </div>

                {/* Tracking timeline */}
                {order.status !== 'CANCELLED' && (
                  <div className="flex items-center gap-1 mb-4">
                    {TRACKING_STEPS.map((step, i) => {
                      const done = i < st.step
                      const active = i === st.step - 1
                      return (
                        <div key={step} className="flex items-center flex-1">
                          <div className="flex flex-col items-center gap-1 flex-shrink-0">
                            <div className={`w-3 h-3 rounded-full border-2 transition-all ${
                              done || active ? 'bg-primary border-primary' : 'border-gray-300 dark:border-gray-600'
                            }`} />
                            <span className="text-[9px] text-gray-400 text-center leading-tight hidden sm:block whitespace-nowrap">
                              {step}
                            </span>
                          </div>
                          {i < TRACKING_STEPS.length - 1 && (
                            <div className={`h-0.5 flex-1 mx-1 rounded-full ${
                              i < st.step - 1 ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
                            }`} />
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* Items preview */}
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>{order.items.length} ta mahsulot</span>
                  <span>·</span>
                  <span>{order.paymentMethod === 'CASH' ? 'Naqd' : order.paymentMethod}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

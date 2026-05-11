import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'

const STATUS_OPTIONS = ['ALL', 'PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']
const STATUS_UZ: Record<string, string> = {
  ALL: 'Barchasi', PENDING: 'Kutilmoqda', CONFIRMED: 'Tasdiqlandi',
  PROCESSING: 'Tayyorlanmoqda', SHIPPED: "Yo'lda",
  DELIVERED: 'Yetkazildi', CANCELLED: 'Bekor qilindi',
}
const STATUS_COLOR: Record<string, string> = {
  PENDING: 'bg-yellow-500/20 text-yellow-400', CONFIRMED: 'bg-blue-500/20 text-blue-400',
  PROCESSING: 'bg-purple-500/20 text-purple-400', SHIPPED: 'bg-orange-500/20 text-orange-400',
  DELIVERED: 'bg-green-500/20 text-green-400', CANCELLED: 'bg-red-500/20 text-red-400',
}

export default async function AdminOrdersPage({
  searchParams
}: { searchParams: { status?: string; page?: string } }) {
  const status = searchParams.status && searchParams.status !== 'ALL' ? searchParams.status : undefined
  const page = parseInt(searchParams.page || '1')
  const limit = 20

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where: { ...(status && { status }) },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: { items: true },
    }),
    prisma.order.count({ where: { ...(status && { status }) } }),
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Buyurtmalar</h1>
        <span className="text-gray-400 text-sm">{total} ta</span>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {STATUS_OPTIONS.map(s => (
          <Link
            key={s}
            href={`/admin/orders${s !== 'ALL' ? `?status=${s}` : ''}`}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              (s === 'ALL' && !status) || s === status
                ? 'bg-primary text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {STATUS_UZ[s]}
          </Link>
        ))}
      </div>

      {/* Table */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              {['#', 'Mijoz', 'Telefon', "To'lov", 'Usul', 'Sana', 'Status', ''].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                <td className="px-4 py-3 text-sm font-mono text-gray-300">#{order.orderNumber}</td>
                <td className="px-4 py-3 text-sm text-gray-300">{order.guestName || '—'}</td>
                <td className="px-4 py-3 text-xs text-gray-400">{order.guestPhone || '—'}</td>
                <td className="px-4 py-3 text-sm font-bold text-primary">{formatPrice(Number(order.total), 'uz')}</td>
                <td className="px-4 py-3 text-xs text-gray-400">{order.paymentMethod}</td>
                <td className="px-4 py-3 text-xs text-gray-400">
                  {new Date(order.createdAt).toLocaleDateString('uz-UZ')}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${STATUS_COLOR[order.status] || ''}`}>
                    {STATUS_UZ[order.status]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/orders/${order.id}`} className="text-xs text-primary hover:underline">
                    Boshqarish
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

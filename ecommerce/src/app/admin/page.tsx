import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import { ShoppingBag, Users, Package, TrendingUp, ArrowUp, Clock } from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboard() {
  const now = new Date()
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

  const [
    totalOrders, monthOrders, totalRevenue, monthRevenue,
    totalUsers, totalProducts, pendingOrders, recentOrders
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { createdAt: { gte: thisMonth } } }),
    prisma.order.aggregate({ _sum: { total: true }, where: { status: { not: 'CANCELLED' } } }),
    prisma.order.aggregate({ _sum: { total: true }, where: { status: { not: 'CANCELLED' }, createdAt: { gte: thisMonth } } }),
    prisma.user.count(),
    prisma.product.count({ where: { isActive: true } }),
    prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 8,
      include: { items: true },
    }),
  ])

  const stats = [
    { icon: TrendingUp, label: "Jami daromad", value: formatPrice(Number(totalRevenue._sum.total || 0), 'uz'), sub: `Bu oy: ${formatPrice(Number(monthRevenue._sum.total || 0), 'uz')}`, color: 'text-green-400', bg: 'bg-green-500/10' },
    { icon: ShoppingBag, label: "Buyurtmalar", value: totalOrders, sub: `Bu oy: ${monthOrders}`, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { icon: Users, label: "Foydalanuvchilar", value: totalUsers, sub: 'Ro\'yxatdan o\'tgan', color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { icon: Package, label: "Mahsulotlar", value: totalProducts, sub: `${pendingOrders} ta kutilmoqda`, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  ]

  const statusColor: Record<string, string> = {
    PENDING:    'bg-yellow-500/20 text-yellow-400',
    CONFIRMED:  'bg-blue-500/20 text-blue-400',
    PROCESSING: 'bg-purple-500/20 text-purple-400',
    SHIPPED:    'bg-orange-500/20 text-orange-400',
    DELIVERED:  'bg-green-500/20 text-green-400',
    CANCELLED:  'bg-red-500/20 text-red-400',
  }

  const statusUz: Record<string, string> = {
    PENDING: 'Kutilmoqda', CONFIRMED: 'Tasdiqlandi',
    PROCESSING: 'Tayyorlanmoqda', SHIPPED: "Yo'lda",
    DELIVERED: 'Yetkazildi', CANCELLED: 'Bekor qilindi',
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">
          {now.toLocaleDateString('uz-UZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ icon: Icon, label, value, sub, color, bg }) => (
          <div key={label} className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${bg}`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-xs text-gray-400 mt-1">{label}</p>
            <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Pending orders alert */}
      {pendingOrders > 0 && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-yellow-400" />
            <p className="text-yellow-300 font-medium text-sm">
              {pendingOrders} ta yangi buyurtma tasdiqlashni kutmoqda
            </p>
          </div>
          <Link href="/admin/orders?status=PENDING" className="text-sm text-yellow-400 hover:underline font-medium">
            Ko'rish →
          </Link>
        </div>
      )}

      {/* Recent orders table */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <h2 className="font-bold text-white">So'nggi buyurtmalar</h2>
          <Link href="/admin/orders" className="text-sm text-primary hover:underline">Barchasi →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                {['#', 'Mijoz', 'Mahsulotlar', "To'lov", 'Sana', 'Status', 'Amal'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                  <td className="px-5 py-4 text-sm font-mono text-gray-300">#{order.orderNumber}</td>
                  <td className="px-5 py-4 text-sm text-gray-300">{order.guestName || '—'}</td>
                  <td className="px-5 py-4 text-sm text-gray-400">{order.items.length} ta</td>
                  <td className="px-5 py-4 text-sm font-bold text-primary">{formatPrice(Number(order.total), 'uz')}</td>
                  <td className="px-5 py-4 text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString('uz-UZ')}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusColor[order.status]}`}>
                      {statusUz[order.status]}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <Link href={`/admin/orders/${order.id}`} className="text-xs text-primary hover:underline">
                      Ko'rish
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

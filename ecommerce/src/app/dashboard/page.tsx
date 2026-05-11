import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ShoppingBag, Heart, Star, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const [ordersCount, wishlistCount, reviewsCount, recentOrders] = await Promise.all([
    prisma.order.count({ where: { userId: session.user.id } }),
    prisma.wishlist.count({ where: { userId: session.user.id } }),
    prisma.review.count({ where: { userId: session.user.id } }),
    prisma.order.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { items: true },
    }),
  ])

  const totalSpent = await prisma.order.aggregate({
    where: { userId: session.user.id, status: { not: 'CANCELLED' } },
    _sum: { total: true },
  })

  const stats = [
    { icon: ShoppingBag, label: "Buyurtmalar", value: ordersCount, color: 'bg-blue-50 text-blue-600', href: '/dashboard/orders' },
    { icon: Heart, label: "Sevimlilar", value: wishlistCount, color: 'bg-red-50 text-red-500', href: '/dashboard/wishlist' },
    { icon: Star, label: "Sharhlar", value: reviewsCount, color: 'bg-yellow-50 text-yellow-500', href: '#' },
    { icon: TrendingUp, label: "Jami xarid", value: formatPrice(Number(totalSpent._sum.total || 0), 'uz'), color: 'bg-green-50 text-green-600', href: '#' },
  ]

  const statusLabel: Record<string, { uz: string; color: string }> = {
    PENDING:    { uz: 'Kutilmoqda',     color: 'bg-yellow-100 text-yellow-700' },
    CONFIRMED:  { uz: 'Tasdiqlandi',    color: 'bg-blue-100 text-blue-700' },
    PROCESSING: { uz: 'Tayyorlanmoqda', color: 'bg-purple-100 text-purple-700' },
    SHIPPED:    { uz: 'Yo\'lda',        color: 'bg-orange-100 text-orange-700' },
    DELIVERED:  { uz: 'Yetkazildi',     color: 'bg-green-100 text-green-700' },
    CANCELLED:  { uz: 'Bekor qilindi',  color: 'bg-red-100 text-red-600' },
  }

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-primary to-orange-400 rounded-3xl p-6 text-white">
        <p className="text-sm opacity-80 mb-1">Xush kelibsiz 👋</p>
        <h1 className="text-2xl font-bold">{session.user.name}</h1>
        <p className="text-sm opacity-70 mt-1">{session.user.email}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ icon: Icon, label, value, color, href }) => (
          <Link key={label} href={href}
            className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800
                       hover:shadow-md transition-all group">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{label}</p>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-gray-900 dark:text-white">So'nggi buyurtmalar</h2>
          <Link href="/dashboard/orders" className="text-sm text-primary hover:underline">Barchasi →</Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-10">
            <ShoppingBag className="w-12 h-12 text-gray-200 dark:text-gray-700 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">Hali buyurtma yo'q</p>
            <Link href="/products" className="btn-primary text-sm mt-4 inline-block">Xarid qilish</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentOrders.map(order => {
              const status = statusLabel[order.status] || statusLabel.PENDING
              return (
                <Link key={order.id} href={`/dashboard/orders/${order.id}`}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
                  <div>
                    <p className="font-semibold text-sm text-gray-900 dark:text-white">#{order.orderNumber}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {order.items.length} ta mahsulot · {new Date(order.createdAt).toLocaleDateString('uz-UZ')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary text-sm">{formatPrice(Number(order.total), 'uz')}</p>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${status.color}`}>
                      {status.uz}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

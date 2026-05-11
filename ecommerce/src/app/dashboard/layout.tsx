'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, ShoppingBag, Heart, MapPin,
  User, Bell, LogOut, Menu, X, ChevronRight
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import { Navbar } from '@/components/layout/Navbar'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, labelUz: 'Bosh sahifa', labelRu: 'Главная' },
  { href: '/dashboard/orders', icon: ShoppingBag, labelUz: 'Buyurtmalar', labelRu: 'Заказы' },
  { href: '/dashboard/wishlist', icon: Heart, labelUz: 'Sevimlilar', labelRu: 'Избранное' },
  { href: '/dashboard/addresses', icon: MapPin, labelUz: 'Manzillar', labelRu: 'Адреса' },
  { href: '/dashboard/profile', icon: User, labelUz: 'Profil', labelRu: 'Профиль' },
  { href: '/dashboard/notifications', icon: Bell, labelUz: 'Bildirishnomalar', labelRu: 'Уведомления' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const locale = 'uz'

  const label = (uz: string, ru: string) => locale === 'ru' ? ru : uz

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="container-shop py-8">
          <div className="flex gap-6">

            {/* Sidebar */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-4 sticky top-24">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 mb-3">
                  {label('Mening kabinetim', 'Мой кабинет')}
                </p>
                <nav className="space-y-1">
                  {navItems.map(item => {
                    const active = pathname === item.href
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-all',
                          active
                            ? 'bg-primary/10 text-primary'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                        )}
                      >
                        <item.icon className="w-4 h-4 flex-shrink-0" />
                        {label(item.labelUz, item.labelRu)}
                        {active && <ChevronRight className="w-4 h-4 ml-auto" />}
                      </Link>
                    )
                  })}
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium
                               text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-all mt-2"
                  >
                    <LogOut className="w-4 h-4" />
                    {label('Chiqish', 'Выйти')}
                  </button>
                </nav>
              </div>
            </aside>

            {/* Main */}
            <main className="flex-1 min-w-0">
              {children}
            </main>
          </div>
        </div>
      </div>
    </>
  )
}

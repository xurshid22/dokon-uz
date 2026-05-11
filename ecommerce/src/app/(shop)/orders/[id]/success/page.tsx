import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export default function OrderSuccessPage({ params }: { params: { id: string } }) {
  return (
    <>
      <Navbar minimal />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center py-16">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Buyurtma qabul qilindi!
          </h1>
          <p className="text-gray-500 mb-2">
            Sizning buyurtmangiz muvaffaqiyatli qabul qilindi.
          </p>
          <p className="text-sm text-gray-400 mb-8">
            Tez orada sizga telefon orqali bog'lanamiz.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/dashboard/orders" className="btn-primary">
              Buyurtmalarni ko'rish
            </Link>
            <Link href="/products" className="btn-secondary">
              Xarid davom ettirish
            </Link>
          </div>
        </div>
      </main>
      <Footer locale="uz" />
    </>
  )
}

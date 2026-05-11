import { Metadata } from 'next'
import { Navbar } from '@/components/layout/Navbar'
import { CheckoutFlow } from '@/components/checkout/CheckoutFlow'

export const metadata: Metadata = {
  title: "Buyurtma berish | Do'kon",
  robots: { index: false },
}

export default function CheckoutPage() {
  return (
    <>
      <Navbar minimal />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
        <div className="container-shop max-w-5xl">
          <CheckoutFlow />
        </div>
      </main>
    </>
  )
}

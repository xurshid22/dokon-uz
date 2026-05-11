// ============================================================
// Product Listing Page — Server Component (with client filters)
// ============================================================

import { Metadata } from 'next'
import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import { localizeCategory } from '@/lib/utils'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ProductsClient } from './ProductsClient'

export const metadata: Metadata = {
  title: "Barcha mahsulotlar | Do'kon",
  description: "Do'konimizning barcha mahsulotlari. Eng yaxshi narxlarda kiyim, elektronika, kosmetika va boshqalar.",
}

export default async function ProductsPage() {
  // Fetch categories + brands server-side for filters
  const [categories, brands] = await Promise.all([
    prisma.category.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.brand.findMany({ orderBy: { name: 'asc' } }),
  ])

  const localizedCategories = categories.map((c) => localizeCategory(c, 'uz'))

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
        <div className="container-shop">
          <Suspense fallback={null}>
            <ProductsClient
              categories={localizedCategories}
              brands={brands}
            />
          </Suspense>
        </div>
      </main>
      <Footer locale="uz" />
    </>
  )
}

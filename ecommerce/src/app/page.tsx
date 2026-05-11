// ============================================================
// Homepage — Server Component
// Fetches data server-side with ISR caching
// ============================================================

import { Metadata } from 'next'
import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import { localizeProduct, localizeCategory } from '@/lib/utils'

import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { HeroSection } from '@/components/home/HeroSection'
import { CategoriesGrid } from '@/components/home/CategoriesGrid'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { BestSellersCarousel } from '@/components/home/BestSellersCarousel'
import { PromoBanners } from '@/components/home/PromoBanners'
import { TrendingProducts } from '@/components/home/TrendingProducts'
import { Testimonials } from '@/components/home/Testimonials'
import { Newsletter } from '@/components/home/Newsletter'
import { ProductCardSkeleton } from '@/components/product/ProductCardSkeleton'

// Revalidate every 60 seconds (ISR)
export const revalidate = 60

export const metadata: Metadata = {
  title: "Do'kon — Uzbekiston Online Do'koni",
  description: "Uzbekistondagi eng yaxshi mahsulotlar. Kiyim, elektronika, kosmetika va ko'proq.",
}

async function getHomeData() {
  const [categories, featuredProducts, bestSellers, banners] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true, parentId: null },
      orderBy: { sortOrder: 'asc' },
      take: 6,
    }),
    prisma.product.findMany({
      where: { isFeatured: true, isActive: true },
      include: { images: { orderBy: { sortOrder: 'asc' } }, category: true },
      orderBy: { createdAt: 'desc' },
      take: 8,
    }),
    prisma.product.findMany({
      where: { isBestSeller: true, isActive: true },
      include: { images: { orderBy: { sortOrder: 'asc' } }, category: true },
      orderBy: { soldCount: 'desc' },
      take: 10,
    }),
    prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    }),
  ])

  return { categories, featuredProducts, bestSellers, banners }
}

export default async function HomePage() {
  const { categories, featuredProducts, bestSellers, banners } = await getHomeData()

  // Default locale is uz; client-side switching via Zustand
  const locale = 'uz' as const

  const localizedCategories = categories.map((c) => localizeCategory(c, locale))
  const localizedFeatured = featuredProducts.map((p) => ({
    ...localizeProduct(p, locale),
    price: Number(p.price),
    discountPrice: p.discountPrice ? Number(p.discountPrice) : undefined,
    category: localizeCategory(p.category, locale),
  }))
  const localizedBestSellers = bestSellers.map((p) => ({
    ...localizeProduct(p, locale),
    price: Number(p.price),
    discountPrice: p.discountPrice ? Number(p.discountPrice) : undefined,
    category: localizeCategory(p.category, locale),
  }))

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero + Banners */}
        <HeroSection banners={banners} locale={locale} />

        {/* Categories */}
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="container-shop">
            <CategoriesGrid categories={localizedCategories} locale={locale} />
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16">
          <div className="container-shop">
            <Suspense fallback={<ProductGridSkeleton count={8} />}>
              <FeaturedProducts products={localizedFeatured} locale={locale} />
            </Suspense>
          </div>
        </section>

        {/* Promo Banner */}
        <PromoBanners locale={locale} />

        {/* Best Sellers */}
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="container-shop">
            <Suspense fallback={<ProductGridSkeleton count={5} />}>
              <BestSellersCarousel products={localizedBestSellers} locale={locale} />
            </Suspense>
          </div>
        </section>

        {/* Trending */}
        <section className="py-16">
          <div className="container-shop">
            <TrendingProducts locale={locale} />
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="container-shop">
            <Testimonials locale={locale} />
          </div>
        </section>

        {/* Newsletter */}
        <Newsletter locale={locale} />
      </main>
      <Footer locale={locale} />
    </>
  )
}

function ProductGridSkeleton({ count }: { count: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}

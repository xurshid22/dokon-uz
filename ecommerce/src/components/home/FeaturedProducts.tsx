'use client'

import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { ProductCard } from '@/components/product/ProductCard'
import { getTranslations } from '@/i18n'
import type { Locale } from '@/i18n/config'
import type { LocalizedProduct } from '@/types'

interface FeaturedProductsProps {
  products: LocalizedProduct[]
  locale: Locale
}

export function FeaturedProducts({ products, locale }: FeaturedProductsProps) {
  const t = getTranslations(locale)

  return (
    <div>
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="section-title">{t.home.featured_title}</h2>
          <p className="section-subtitle">{t.home.featured_subtitle}</p>
        </div>
        <Link href="/products" className="hidden md:flex items-center gap-2 text-primary font-medium hover:underline">
          {locale === 'ru' ? 'Все товары' : 'Barcha mahsulotlar'}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="mt-8 text-center md:hidden">
        <Link href="/products" className="btn-outline inline-flex items-center gap-2">
          {locale === 'ru' ? 'Показать все' : 'Barchasini ko\'rish'}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}

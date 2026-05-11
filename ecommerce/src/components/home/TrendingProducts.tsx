'use client'

import { useQuery } from '@tanstack/react-query'
import { TrendingUp } from 'lucide-react'
import { ProductCard } from '@/components/product/ProductCard'
import { ProductCardSkeleton } from '@/components/product/ProductCardSkeleton'
import { getTranslations } from '@/i18n'
import { useUIStore } from '@/store/uiStore'
import type { Locale } from '@/i18n/config'

export function TrendingProducts({ locale }: { locale: Locale }) {
  const t = getTranslations(locale)

  const { data, isLoading } = useQuery({
    queryKey: ['trending', locale],
    queryFn: async () => {
      const res = await fetch(`/api/products?sort=popular&locale=${locale}&limit=8`)
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json()
    },
    staleTime: 5 * 60 * 1000,
  })

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <TrendingUp className="w-6 h-6 text-primary" />
        <div>
          <h2 className="section-title">{t.home.trending_title}</h2>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
          : data?.data?.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))
        }
      </div>
    </div>
  )
}

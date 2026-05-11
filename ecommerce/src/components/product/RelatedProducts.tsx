'use client'

import { useQuery } from '@tanstack/react-query'
import { ProductCard } from './ProductCard'
import { ProductCardSkeleton } from './ProductCardSkeleton'
import { useUIStore } from '@/store/uiStore'
import { getTranslations } from '@/i18n'

interface Props {
  categoryId: string | null
  currentProductId: string
}

export function RelatedProducts({ categoryId, currentProductId }: Props) {
  const { locale } = useUIStore()
  const t = getTranslations(locale)

  const { data, isLoading } = useQuery({
    queryKey: ['related-products', categoryId, currentProductId],
    queryFn: async () => {
      const params = new URLSearchParams({ locale, limit: '8' })
      if (categoryId) params.set('category', categoryId)
      const res = await fetch(`/api/products?${params}`)
      const json = await res.json()
      return json.data?.filter((p: any) => p.id !== currentProductId).slice(0, 6) || []
    },
    enabled: !!categoryId,
    staleTime: 60 * 1000,
  })

  if (!categoryId) return null

  return (
    <section className="mt-16 pt-10 border-t border-gray-100 dark:border-gray-800">
      <h2 className="section-title mb-6">{t.product.related_products}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)
          : data?.map((p: any) => <ProductCard key={p.id} product={p} />)
        }
      </div>
    </section>
  )
}

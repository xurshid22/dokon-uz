'use client'

import { useRef } from 'react'
import { ChevronLeft, ChevronRight, ArrowRight, Zap } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ProductCard } from '@/components/product/ProductCard'
import { getTranslations } from '@/i18n'
import type { Locale } from '@/i18n/config'
import type { LocalizedProduct } from '@/types'

interface BestSellersCarouselProps {
  products: LocalizedProduct[]
  locale: Locale
}

export function BestSellersCarousel({ products, locale }: BestSellersCarouselProps) {
  const t = getTranslations(locale)
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return
    const amount = 320
    scrollRef.current.scrollBy({ left: dir === 'right' ? amount : -amount, behavior: 'smooth' })
  }

  return (
    <div>
      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-5 h-5 text-primary fill-primary" />
            <span className="text-primary font-semibold text-sm uppercase tracking-wide">
              {locale === 'ru' ? 'Популярное' : 'Mashhur'}
            </span>
          </div>
          <h2 className="section-title">{t.home.bestsellers_title}</h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700
                       flex items-center justify-center
                       hover:bg-primary hover:border-primary hover:text-white
                       text-gray-600 dark:text-gray-300 transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700
                       flex items-center justify-center
                       hover:bg-primary hover:border-primary hover:text-white
                       text-gray-600 dark:text-gray-300 transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Scroll container */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product) => (
          <div key={product.id} className="flex-shrink-0 w-56 snap-start">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  )
}

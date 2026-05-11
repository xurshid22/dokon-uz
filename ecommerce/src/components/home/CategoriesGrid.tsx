'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import type { Locale } from '@/i18n/config'
import { getTranslations } from '@/i18n'

interface LocalizedCategory {
  id: string
  name: string
  slug: string
  image?: string | null
}

interface CategoriesGridProps {
  categories: LocalizedCategory[]
  locale: Locale
}

const CATEGORY_ICONS: Record<string, string> = {
  kiyim: '👗',
  elektronika: '📱',
  kosmetika: '💄',
  sport: '⚽',
  'oziq-ovqat': '🥗',
  'uy-jihozlari': '🏠',
}

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export function CategoriesGrid({ categories, locale }: CategoriesGridProps) {
  const t = getTranslations(locale)

  return (
    <div>
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="section-title">{t.home.categories_title}</h2>
          <p className="section-subtitle">{t.home.categories_subtitle}</p>
        </div>
        <Link
          href="/categories"
          className="hidden md:flex items-center gap-2 text-primary font-medium hover:underline"
        >
          {locale === 'ru' ? 'Все категории' : 'Barcha kategoriyalar'}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
      >
        {categories.map((cat) => (
          <motion.div key={cat.id} variants={item}>
            <Link href={`/categories/${cat.slug}`} className="group block">
              <div className="relative aspect-square rounded-2xl overflow-hidden
                              bg-gradient-to-br from-orange-50 to-orange-100
                              dark:from-gray-800 dark:to-gray-700
                              hover:shadow-xl transition-all duration-300
                              hover:-translate-y-1">
                {cat.image ? (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center
                                  text-5xl select-none">
                    {CATEGORY_ICONS[cat.slug] || '📦'}
                  </div>
                )}

                {/* Dark overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20
                                transition-colors duration-300" />
              </div>

              <p className="text-center mt-2.5 text-sm font-semibold
                             text-gray-700 dark:text-gray-200
                             group-hover:text-primary transition-colors">
                {cat.name}
              </p>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

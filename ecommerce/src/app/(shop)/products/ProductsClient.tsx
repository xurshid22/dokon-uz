'use client'

import { useState, useCallback } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  SlidersHorizontal, LayoutGrid, List, Search, X,
  ChevronDown, Star, Filter
} from 'lucide-react'
import { ProductCard } from '@/components/product/ProductCard'
import { ProductCardSkeleton } from '@/components/product/ProductCardSkeleton'
import { useUIStore } from '@/store/uiStore'
import { getTranslations } from '@/i18n'
import { formatPrice } from '@/lib/utils'
import type { LocalizedProduct } from '@/types'

interface Brand { id: string; name: string; slug: string }
interface LocalizedCategory { id: string; name: string; slug: string }

interface Props {
  categories: LocalizedCategory[]
  brands: Brand[]
}

type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'popular' | 'rating'
type Layout = 'grid' | 'list'

export function ProductsClient({ categories, brands }: Props) {
  const { locale } = useUIStore()
  const t = getTranslations(locale)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Filter state (synced to URL)
  const [layout, setLayout] = useState<Layout>('grid')
  const [filtersOpen, setFiltersOpen] = useState(false)

  const category = searchParams.get('category') || ''
  const brand = searchParams.get('brand') || ''
  const sort = (searchParams.get('sort') || 'newest') as SortOption
  const page = parseInt(searchParams.get('page') || '1')
  const search = searchParams.get('q') || ''
  const minPrice = searchParams.get('minPrice') || ''
  const maxPrice = searchParams.get('maxPrice') || ''
  const minRating = searchParams.get('minRating') || ''
  const inStock = searchParams.get('inStock') === 'true'
  const onSale = searchParams.get('onSale') === 'true'

  // Build query string helper
  const setParam = useCallback((key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    if (key !== 'page') params.delete('page')
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }, [searchParams, pathname, router])

  const clearFilters = () => {
    router.push(pathname, { scroll: false })
  }

  // Active filter count
  const activeFilters = [category, brand, minPrice, maxPrice, minRating, inStock && 'inStock', onSale && 'onSale'].filter(Boolean).length

  // Fetch products
  const queryParams = new URLSearchParams({
    locale,
    page: String(page),
    limit: '24',
    sort,
    ...(category && { category }),
    ...(brand && { brand }),
    ...(minPrice && { minPrice }),
    ...(maxPrice && { maxPrice }),
    ...(minRating && { minRating }),
    ...(inStock && { inStock: 'true' }),
    ...(onSale && { onSale: 'true' }),
    ...(search && { q: search }),
  })

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['products', queryParams.toString()],
    queryFn: async () => {
      const res = await fetch(`/api/products?${queryParams}`)
      if (!res.ok) throw new Error('Failed to fetch products')
      return res.json()
    },
    staleTime: 30 * 1000,
    placeholderData: (prev) => prev,
  })

  const products: LocalizedProduct[] = data?.data || []
  const total: number = data?.total || 0
  const totalPages: number = data?.totalPages || 1

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'newest', label: t.filter.sort_newest },
    { value: 'price_asc', label: t.filter.sort_price_low },
    { value: 'price_desc', label: t.filter.sort_price_high },
    { value: 'popular', label: t.filter.sort_popular },
    { value: 'rating', label: t.filter.sort_rating },
  ]

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="section-title">{t.nav.products}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {t.filter.showing} {total} {t.filter.products}
          </p>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Filters — desktop */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <FilterPanel
            categories={categories}
            brands={brands}
            locale={locale}
            t={t}
            values={{ category, brand, minPrice, maxPrice, minRating, inStock, onSale }}
            setParam={setParam}
            clearFilters={clearFilters}
            activeFilters={activeFilters}
          />
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center gap-3 mb-5 flex-wrap">
            {/* Mobile filter button */}
            <button
              onClick={() => setFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm font-medium hover:border-primary hover:text-primary transition-colors relative"
            >
              <Filter className="w-4 h-4" />
              {t.common.filter}
              {activeFilters > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {activeFilters}
                </span>
              )}
            </button>

            {/* Sort */}
            <div className="relative ml-auto">
              <select
                value={sort}
                onChange={(e) => setParam('sort', e.target.value)}
                className="appearance-none bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                           rounded-2xl px-4 py-2.5 pr-8 text-sm font-medium
                           focus:outline-none focus:border-primary cursor-pointer"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Layout toggle */}
            <div className="flex border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">
              <button
                onClick={() => setLayout('grid')}
                className={`p-2.5 transition-colors ${layout === 'grid' ? 'bg-primary text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLayout('list')}
                className={`p-2.5 transition-colors ${layout === 'list' ? 'bg-primary text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active filter chips */}
          {activeFilters > 0 && (
            <div className="flex items-center gap-2 flex-wrap mb-4">
              {category && (
                <FilterChip label={categories.find(c => c.slug === category)?.name || category} onRemove={() => setParam('category', null)} />
              )}
              {brand && (
                <FilterChip label={brands.find(b => b.slug === brand)?.name || brand} onRemove={() => setParam('brand', null)} />
              )}
              {(minPrice || maxPrice) && (
                <FilterChip label={`${formatPrice(Number(minPrice || 0), locale)} — ${maxPrice ? formatPrice(Number(maxPrice), locale) : '∞'}`} onRemove={() => { setParam('minPrice', null); setParam('maxPrice', null) }} />
              )}
              {inStock && <FilterChip label={t.filter.in_stock} onRemove={() => setParam('inStock', null)} />}
              {onSale && <FilterChip label={t.filter.on_sale} onRemove={() => setParam('onSale', null)} />}
              <button onClick={clearFilters} className="text-xs text-red-500 hover:underline ml-1">
                {t.filter.clear} {t.common.all}
              </button>
            </div>
          )}

          {/* Products grid/list */}
          <div className={`relative ${isFetching ? 'opacity-60' : ''} transition-opacity`}>
            {isLoading ? (
              <div className={layout === 'grid'
                ? 'grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4'
                : 'space-y-4'
              }>
                {Array.from({ length: 12 }).map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-24">
                <Search className="w-16 h-16 text-gray-200 dark:text-gray-700 mx-auto mb-4" />
                <p className="text-gray-500 font-medium text-lg">
                  {locale === 'ru' ? 'Товары не найдены' : 'Mahsulotlar topilmadi'}
                </p>
                <button onClick={clearFilters} className="btn-primary mt-4 text-sm">
                  {t.filter.clear}
                </button>
              </div>
            ) : (
              <div className={layout === 'grid'
                ? 'grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4'
                : 'space-y-4'
              }>
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} layout={layout} />
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <button
                onClick={() => setParam('page', String(page - 1))}
                disabled={page <= 1}
                className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium
                           hover:border-primary hover:text-primary transition-colors
                           disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ← {t.common.previous}
              </button>

              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                const pageNum = i + 1
                return (
                  <button
                    key={pageNum}
                    onClick={() => setParam('page', String(pageNum))}
                    className={`w-10 h-10 rounded-xl text-sm font-medium transition-colors ${
                      page === pageNum
                        ? 'bg-primary text-white'
                        : 'border border-gray-200 dark:border-gray-700 hover:border-primary hover:text-primary'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}

              <button
                onClick={() => setParam('page', String(page + 1))}
                disabled={page >= totalPages}
                className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium
                           hover:border-primary hover:text-primary transition-colors
                           disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {t.common.next} →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Sheet */}
      <AnimatePresence>
        {filtersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setFiltersOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-white dark:bg-gray-900 z-50 overflow-y-auto p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-lg text-gray-900 dark:text-white">{t.common.filter}</h2>
                <button onClick={() => setFiltersOpen(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <FilterPanel
                categories={categories}
                brands={brands}
                locale={locale}
                t={t}
                values={{ category, brand, minPrice, maxPrice, minRating, inStock, onSale }}
                setParam={setParam}
                clearFilters={clearFilters}
                activeFilters={activeFilters}
                onApply={() => setFiltersOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── FilterChip ───────────────────────────────────────────────
function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-medium
                     px-3 py-1.5 rounded-full">
      {label}
      <button onClick={onRemove} className="hover:text-primary-700">
        <X className="w-3 h-3" />
      </button>
    </span>
  )
}

// ── Filter Panel ─────────────────────────────────────────────
function FilterPanel({
  categories, brands, locale, t,
  values, setParam, clearFilters, activeFilters, onApply
}: any) {
  return (
    <div className="space-y-6">
      {activeFilters > 0 && (
        <button onClick={clearFilters} className="text-sm text-red-500 hover:underline">
          {t.filter.clear} ({activeFilters})
        </button>
      )}

      {/* Categories */}
      <FilterSection title={t.filter.categories}>
        <div className="space-y-1.5">
          <button
            onClick={() => setParam('category', null)}
            className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
              !values.category ? 'bg-primary text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            {t.common.all}
          </button>
          {categories.map((cat: any) => (
            <button
              key={cat.id}
              onClick={() => setParam('category', cat.slug)}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
                values.category === cat.slug ? 'bg-primary text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Price */}
      <FilterSection title={t.filter.price_range}>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder={t.filter.min_price}
            value={values.minPrice}
            onChange={(e) => setParam('minPrice', e.target.value || null)}
            className="w-1/2 bg-gray-100 dark:bg-gray-800 rounded-xl px-3 py-2 text-sm outline-none focus:ring-1 ring-primary"
          />
          <input
            type="number"
            placeholder={t.filter.max_price}
            value={values.maxPrice}
            onChange={(e) => setParam('maxPrice', e.target.value || null)}
            className="w-1/2 bg-gray-100 dark:bg-gray-800 rounded-xl px-3 py-2 text-sm outline-none focus:ring-1 ring-primary"
          />
        </div>
      </FilterSection>

      {/* Rating */}
      <FilterSection title={t.filter.rating}>
        <div className="space-y-1.5">
          {[4, 3, 2, 1].map((r) => (
            <button
              key={r}
              onClick={() => setParam('minRating', values.minRating === String(r) ? null : String(r))}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-colors ${
                values.minRating === String(r) ? 'bg-primary text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} className={`w-3.5 h-3.5 ${s <= r ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                ))}
              </div>
              <span>& {locale === 'ru' ? 'выше' : 'yuqori'}</span>
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Availability */}
      <FilterSection title={t.filter.availability}>
        <div className="space-y-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={values.inStock}
              onChange={(e) => setParam('inStock', e.target.checked ? 'true' : null)}
              className="w-4 h-4 accent-primary rounded"
            />
            <span className="text-sm">{t.filter.in_stock}</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={values.onSale}
              onChange={(e) => setParam('onSale', e.target.checked ? 'true' : null)}
              className="w-4 h-4 accent-primary rounded"
            />
            <span className="text-sm">{t.filter.on_sale}</span>
          </label>
        </div>
      </FilterSection>

      {/* Brands */}
      {brands.length > 0 && (
        <FilterSection title={t.filter.brands}>
          <div className="space-y-1.5">
            {brands.map((b: any) => (
              <button
                key={b.id}
                onClick={() => setParam('brand', values.brand === b.slug ? null : b.slug)}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
                  values.brand === b.slug ? 'bg-primary text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {b.name}
              </button>
            ))}
          </div>
        </FilterSection>
      )}

      {onApply && (
        <button onClick={onApply} className="btn-primary w-full mt-4">
          {t.filter.apply}
        </button>
      )}
    </div>
  )
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true)
  return (
    <div className="border-b border-gray-100 dark:border-gray-800 pb-5">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full mb-3"
      >
        <span className="font-semibold text-gray-900 dark:text-white text-sm">{title}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

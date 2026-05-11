// ============================================================
// GET /api/products — Product listing with filters, sort, pagination
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { localizeProduct, localizeCategory } from '@/lib/utils'
import type { Locale } from '@/i18n/config'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const locale = (searchParams.get('locale') || 'uz') as Locale
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '24'), 100)
    const skip = (page - 1) * limit

    const sort = searchParams.get('sort') || 'newest'
    const category = searchParams.get('category')
    const brand = searchParams.get('brand')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const minRating = searchParams.get('minRating')
    const inStock = searchParams.get('inStock') === 'true'
    const onSale = searchParams.get('onSale') === 'true'
    const search = searchParams.get('q')
    const featured = searchParams.get('featured') === 'true'

    // Build where clause
    const where: any = { isActive: true }

    if (category) {
      where.category = { slug: category }
    }
    if (brand) {
      where.brand = { slug: brand }
    }
    if (minPrice || maxPrice) {
      where.price = {
        ...(minPrice ? { gte: parseFloat(minPrice) } : {}),
        ...(maxPrice ? { lte: parseFloat(maxPrice) } : {}),
      }
    }
    if (minRating) {
      where.rating = { gte: parseFloat(minRating) }
    }
    if (inStock) {
      where.stock = { gt: 0 }
    }
    if (onSale) {
      where.discountPrice = { not: null }
    }
    if (featured) {
      where.isFeatured = true
    }
    if (search) {
      where.OR = [
        { titleUz: { contains: search, mode: 'insensitive' } },
        { titleRu: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Build orderBy
    const orderBy: any = (() => {
      switch (sort) {
        case 'price_asc':  return { price: 'asc' }
        case 'price_desc': return { price: 'desc' }
        case 'popular':    return { soldCount: 'desc' }
        case 'rating':     return { rating: 'desc' }
        case 'newest':
        default:           return { createdAt: 'desc' }
      }
    })()

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          images: { orderBy: { sortOrder: 'asc' }, take: 2 },
          category: true,
          brand: true,
        },
      }),
      prisma.product.count({ where }),
    ])

    // Localize
    const data = products.map((p) => ({
      ...localizeProduct(p, locale),
      price: Number(p.price),
      discountPrice: p.discountPrice ? Number(p.discountPrice) : undefined,
      category: p.category ? localizeCategory(p.category, locale) : null,
    }))

    return NextResponse.json({
      data,
      total,
      page,
      perPage: limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('[GET /api/products]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

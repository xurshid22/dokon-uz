import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { localizeProduct, localizeCategory } from '@/lib/utils'
import type { Locale } from '@/i18n/config'

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const locale = (req.nextUrl.searchParams.get('locale') || 'uz') as Locale

    const product = await prisma.product.findUnique({
      where: { slug: params.slug, isActive: true },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        category: true,
        brand: true,
        variants: true,
        reviews: {
          where: { status: 'APPROVED' },
          include: { user: { select: { id: true, name: true, avatar: true } } },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Increment view count (fire and forget)
    prisma.product.update({
      where: { id: product.id },
      data: { viewCount: { increment: 1 } },
    }).catch(console.error)

    const data = {
      ...localizeProduct(product, locale),
      price: Number(product.price),
      discountPrice: product.discountPrice ? Number(product.discountPrice) : undefined,
      category: product.category ? localizeCategory(product.category, locale) : null,
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('[GET /api/products/:slug]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

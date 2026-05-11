// ============================================================
// Product Detail Page — SSR + ISR
// ============================================================

import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { localizeProduct, localizeCategory } from '@/lib/utils'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ProductDetail } from '@/components/product/ProductDetail'
import { RelatedProducts } from '@/components/product/RelatedProducts'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug, isActive: true },
    include: { images: { take: 1 } },
  })
  if (!product) return { title: 'Not Found' }

  return {
    title: `${product.titleUz} | Do'kon`,
    description: product.descriptionUz?.slice(0, 160),
    openGraph: {
      title: product.titleUz,
      description: product.descriptionUz?.slice(0, 160) || '',
      images: product.images[0] ? [{ url: product.images[0].url }] : [],
    },
  }
}

export const revalidate = 60

export default async function ProductDetailPage({ params }: Props) {
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

  if (!product) notFound()

  const localizedProduct = {
    ...localizeProduct(product, 'uz'),
    price: Number(product.price),
    discountPrice: product.discountPrice ? Number(product.discountPrice) : undefined,
    category: product.category ? localizeCategory(product.category, 'uz') : null,
  }

  // Increment view count
  prisma.product.update({
    where: { id: product.id },
    data: { viewCount: { increment: 1 } },
  }).catch(() => {})

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white dark:bg-gray-950 py-8">
        <div className="container-shop">
          <ProductDetail product={localizedProduct} rawProduct={product} />
          <RelatedProducts
            categoryId={product.categoryId}
            currentProductId={product.id}
          />
        </div>
      </main>
      <Footer locale="uz" />
    </>
  )
}

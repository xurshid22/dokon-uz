import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateOrderNumber } from '@/lib/utils'

// POST /api/orders — create order
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body = await req.json()

    const {
      items,           // [{ productId, variantId, quantity }]
      shippingAddress,
      paymentMethod,
      promoCode,
      notes,
      guestEmail,
      guestName,
      guestPhone,
    } = body

    if (!items?.length) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 })
    }

    // Fetch products to get current prices
    const productIds = items.map((i: any) => i.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { images: { take: 1, orderBy: { sortOrder: 'asc' } } },
    })

    const productMap = Object.fromEntries(products.map((p) => [p.id, p]))

    // Calculate totals
    let subtotal = 0
    const orderItems = items.map((item: any) => {
      const product = productMap[item.productId]
      if (!product) throw new Error(`Product ${item.productId} not found`)

      const price = Number(product.discountPrice ?? product.price)
      const total = price * item.quantity
      subtotal += total

      return {
        productId: item.productId,
        variantId: item.variantId,
        title: product.titleUz,
        image: product.images[0]?.url,
        price,
        quantity: item.quantity,
        total,
      }
    })

    // Validate promo code
    let discount = 0
    if (promoCode) {
      const promo = await prisma.promoCode.findUnique({ where: { code: promoCode, isActive: true } })
      if (promo) {
        if (!promo.expiresAt || promo.expiresAt > new Date()) {
          if (!promo.minOrderAmt || subtotal >= Number(promo.minOrderAmt)) {
            if (!promo.usageLimit || promo.usedCount < promo.usageLimit) {
              discount = promo.discountType === 'PERCENTAGE'
                ? (subtotal * Number(promo.value)) / 100
                : Number(promo.value)
              if (promo.maxDiscount && discount > Number(promo.maxDiscount)) {
                discount = Number(promo.maxDiscount)
              }
              // Increment usage
              await prisma.promoCode.update({
                where: { id: promo.id },
                data: { usedCount: { increment: 1 } },
              })
            }
          }
        }
      }
    }

    const shippingCost = subtotal - discount >= 500000 ? 0 : 30000
    const total = subtotal + shippingCost - discount

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: session?.user?.id,
        guestEmail,
        guestName,
        guestPhone,
        shippingAddress,
        total,
        subtotal,
        shippingCost,
        discount,
        promoCode,
        paymentMethod,
        notes,
        items: { create: orderItems },
        tracking: {
          create: {
            status: 'PENDING',
            messageUz: "Buyurtmangiz qabul qilindi",
            messageRu: "Ваш заказ принят",
          },
        },
      },
      include: { items: true, tracking: true },
    })

    // Update sold counts
    for (const item of orderItems) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { soldCount: { increment: item.quantity }, stock: { decrement: item.quantity } },
      }).catch(console.error)
    }

    // Clear DB cart for authenticated users
    if (session?.user?.id) {
      const cart = await prisma.cart.findUnique({ where: { userId: session.user.id } })
      if (cart) {
        await prisma.cartItem.deleteMany({ where: { cartId: cart.id } })
      }
    }

    return NextResponse.json({ data: order }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/orders]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET /api/orders — get user's orders
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const page = parseInt(req.nextUrl.searchParams.get('page') || '1')
    const limit = 10

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId: session.user.id },
        include: {
          items: true,
          tracking: { orderBy: { createdAt: 'desc' } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.order.count({ where: { userId: session.user.id } }),
    ])

    return NextResponse.json({ data: orders, total, page, totalPages: Math.ceil(total / limit) })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

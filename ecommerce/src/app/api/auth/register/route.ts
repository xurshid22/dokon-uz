import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = schema.parse(body)

    const existing = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } })
    if (existing) {
      return NextResponse.json({ error: 'Bu email allaqachon ro\'yxatdan o\'tgan' }, { status: 400 })
    }

    const passwordHash = await bcrypt.hash(data.password, 12)

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        phone: data.phone,
        passwordHash,
        role: 'USER',
        cart: { create: {} },
      },
    })

    return NextResponse.json({ success: true, userId: user.id }, { status: 201 })
  } catch (e: any) {
    if (e.name === 'ZodError') {
      return NextResponse.json({ error: 'Noto\'g\'ri ma\'lumotlar' }, { status: 422 })
    }
    return NextResponse.json({ error: 'Server xatoligi' }, { status: 500 })
  }
}

import { PrismaClient, Role, OrderStatus, PaymentMethod, PaymentStatus, DiscountType } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // ── CATEGORIES ──────────────────────────────────────────────────
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'kiyim' },
      update: {},
      create: {
        nameUz: "Kiyim-kechak",
        nameRu: "Одежда",
        slug: 'kiyim',
        image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400',
        sortOrder: 1,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'elektronika' },
      update: {},
      create: {
        nameUz: "Elektronika",
        nameRu: "Электроника",
        slug: 'elektronika',
        image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400',
        sortOrder: 2,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'kosmetika' },
      update: {},
      create: {
        nameUz: "Kosmetika",
        nameRu: "Косметика",
        slug: 'kosmetika',
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400',
        sortOrder: 3,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'sport' },
      update: {},
      create: {
        nameUz: "Sport va dam olish",
        nameRu: "Спорт и отдых",
        slug: 'sport',
        image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400',
        sortOrder: 4,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'oziq-ovqat' },
      update: {},
      create: {
        nameUz: "Oziq-ovqat",
        nameRu: "Продукты питания",
        slug: 'oziq-ovqat',
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400',
        sortOrder: 5,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'uy-jihozlari' },
      update: {},
      create: {
        nameUz: "Uy jihozlari",
        nameRu: "Товары для дома",
        slug: 'uy-jihozlari',
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
        sortOrder: 6,
      },
    }),
  ])

  console.log('✅ Categories seeded')

  // ── BRANDS ──────────────────────────────────────────────────────
  const brand1 = await prisma.brand.upsert({
    where: { slug: 'samsung' },
    update: {},
    create: { name: 'Samsung', slug: 'samsung', logo: '/brands/samsung.svg' },
  })
  const brand2 = await prisma.brand.upsert({
    where: { slug: 'apple' },
    update: {},
    create: { name: 'Apple', slug: 'apple', logo: '/brands/apple.svg' },
  })
  const brand3 = await prisma.brand.upsert({
    where: { slug: 'nike' },
    update: {},
    create: { name: 'Nike', slug: 'nike', logo: '/brands/nike.svg' },
  })

  console.log('✅ Brands seeded')

  // ── ADMIN USER ────────────────────────────────────────────────── 
  const hashedPassword = await bcrypt.hash('Admin@12345', 12)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@shop.uz' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@shop.uz',
      phone: '+998901234567',
      passwordHash: hashedPassword,
      role: Role.ADMIN,
      isVerified: true,
    },
  })

  const testUser = await prisma.user.upsert({
    where: { email: 'user@test.uz' },
    update: {},
    create: {
      name: 'Test User',
      email: 'user@test.uz',
      phone: '+998907654321',
      passwordHash: await bcrypt.hash('User@12345', 12),
      role: Role.USER,
      isVerified: true,
    },
  })

  console.log('✅ Users seeded')

  // ── PRODUCTS ─────────────────────────────────────────────────────
  const products = [
    {
      titleUz: "Samsung Galaxy S24 Ultra",
      titleRu: "Samsung Galaxy S24 Ultra",
      descriptionUz: "Samsung Galaxy S24 Ultra — eng zamonaviy smartfon. 200MP kamera, 5000mAh batareya va AI funksiyalari bilan jihozlangan.",
      descriptionRu: "Samsung Galaxy S24 Ultra — самый современный смартфон с камерой 200MP, аккумулятором 5000mAh и функциями AI.",
      slug: 'samsung-galaxy-s24-ultra',
      price: 14999000,
      discountPrice: 12999000,
      stock: 50,
      sku: 'SAM-S24U-001',
      isFeatured: true,
      isBestSeller: true,
      rating: 4.8,
      reviewCount: 124,
      categoryId: categories[1].id,
      brandId: brand1.id,
      specsUz: { "Ekran": "6.8 dyuym", "RAM": "12GB", "Xotira": "256GB", "Batareya": "5000mAh" },
      specsRu: { "Экран": "6.8 дюйм", "RAM": "12GB", "Память": "256GB", "Аккумулятор": "5000mAh" },
      images: [
        { url: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600', sortOrder: 0 },
      ],
    },
    {
      titleUz: "iPhone 15 Pro Max",
      titleRu: "iPhone 15 Pro Max",
      descriptionUz: "Apple iPhone 15 Pro Max titanium korpusli, 48MP kamera tizimi va A17 Pro chip bilan.",
      descriptionRu: "Apple iPhone 15 Pro Max с корпусом из титана, системой камер 48MP и чипом A17 Pro.",
      slug: 'iphone-15-pro-max',
      price: 17999000,
      discountPrice: null,
      stock: 30,
      sku: 'APL-I15PM-001',
      isFeatured: true,
      isBestSeller: false,
      rating: 4.9,
      reviewCount: 89,
      categoryId: categories[1].id,
      brandId: brand2.id,
      specsUz: { "Ekran": "6.7 dyuym", "RAM": "8GB", "Xotira": "256GB", "Chip": "A17 Pro" },
      specsRu: { "Экран": "6.7 дюйм", "RAM": "8GB", "Память": "256GB", "Чип": "A17 Pro" },
      images: [
        { url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600', sortOrder: 0 },
      ],
    },
    {
      titleUz: "Nike Air Max 270",
      titleRu: "Nike Air Max 270",
      descriptionUz: "Nike Air Max 270 — yumshoq va engil sport poyabzal. Har kunlik foydalanish uchun ideal.",
      descriptionRu: "Nike Air Max 270 — мягкая и лёгкая спортивная обувь, идеальная для повседневного использования.",
      slug: 'nike-air-max-270',
      price: 1299000,
      discountPrice: 999000,
      stock: 150,
      sku: 'NIKE-AM270-001',
      isFeatured: true,
      isBestSeller: true,
      rating: 4.6,
      reviewCount: 234,
      categoryId: categories[3].id,
      brandId: brand3.id,
      specsUz: { "Material": "To'r va ko'n", "Podoshva": "Rezina", "Ustki qism": "Mesh" },
      specsRu: { "Материал": "Сетка и кожа", "Подошва": "Резина", "Верх": "Mesh" },
      images: [
        { url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600', sortOrder: 0 },
      ],
    },
    {
      titleUz: "Erkaklar klassik ko'ylagi",
      titleRu: "Мужская классическая рубашка",
      descriptionUz: "Sifatli paxta matosidan tikilgan klassik erkaklar ko'ylagi. Ish va dam olish uchun mos.",
      descriptionRu: "Классическая мужская рубашка из качественного хлопка. Подходит для работы и отдыха.",
      slug: 'erkaklar-klassik-koylagi',
      price: 189000,
      discountPrice: 149000,
      stock: 200,
      sku: 'CLT-SHT-001',
      isFeatured: false,
      isBestSeller: true,
      rating: 4.4,
      reviewCount: 56,
      categoryId: categories[0].id,
      brandId: null,
      specsUz: { "Material": "100% Paxta", "Rang": "Ko'k, Oq, Qora" },
      specsRu: { "Материал": "100% Хлопок", "Цвет": "Синий, Белый, Чёрный" },
      images: [
        { url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600', sortOrder: 0 },
      ],
    },
    {
      titleUz: "La Roche-Posay Tonal kremi",
      titleRu: "Тональный крем La Roche-Posay",
      descriptionUz: "SPF 50 himoyali dermatologik tonal krem. Sezgir terini himoya qiladi.",
      descriptionRu: "Дерматологический тональный крем с защитой SPF 50 для чувствительной кожи.",
      slug: 'la-roche-posay-tonal',
      price: 299000,
      discountPrice: null,
      stock: 80,
      sku: 'COS-LRP-001',
      isFeatured: true,
      isBestSeller: false,
      rating: 4.7,
      reviewCount: 112,
      categoryId: categories[2].id,
      brandId: null,
      specsUz: { "Himoya": "SPF 50+", "Teri turi": "Sezgir", "Hajm": "30ml" },
      specsRu: { "Защита": "SPF 50+", "Тип кожи": "Чувствительная", "Объём": "30мл" },
      images: [
        { url: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600', sortOrder: 0 },
      ],
    },
    {
      titleUz: "Sport daraja shimlar",
      titleRu: "Спортивные штаны",
      descriptionUz: "Qulay va nafas oluvchi sport shimlar. Yugurish va gym mashqlari uchun ideal.",
      descriptionRu: "Удобные и дышащие спортивные брюки. Идеально подходят для бега и тренировок.",
      slug: 'sport-daraja-shimlar',
      price: 249000,
      discountPrice: 199000,
      stock: 120,
      sku: 'SPT-PNT-001',
      isFeatured: false,
      isBestSeller: true,
      rating: 4.5,
      reviewCount: 78,
      categoryId: categories[3].id,
      brandId: null,
      specsUz: { "Material": "Polyester", "Fit": "Regular" },
      specsRu: { "Материал": "Полиэстер", "Посадка": "Стандартная" },
      images: [
        { url: 'https://images.unsplash.com/photo-1556906781-9a412961a28b?w=600', sortOrder: 0 },
      ],
    },
  ]

  for (const productData of products) {
    const { images, ...data } = productData
    await prisma.product.upsert({
      where: { slug: data.slug },
      update: {},
      create: {
        ...data,
        price: data.price,
        discountPrice: data.discountPrice ?? undefined,
        images: { create: images },
      },
    })
  }

  console.log('✅ Products seeded')

  // ── BANNERS ──────────────────────────────────────────────────────
  await prisma.banner.upsert({
    where: { id: 'banner-1' },
    update: {},
    create: {
      id: 'banner-1',
      titleUz: "Yangi Kolleksiya",
      titleRu: "Новая Коллекция",
      subtitleUz: "2024 yilning eng trendy mahsulotlari",
      subtitleRu: "Самые трендовые товары 2024 года",
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1400',
      link: '/products',
      buttonTextUz: "Hozir xarid qiling",
      buttonTextRu: "Купить сейчас",
      sortOrder: 1,
    },
  })

  await prisma.banner.upsert({
    where: { id: 'banner-2' },
    update: {},
    create: {
      id: 'banner-2',
      titleUz: "Elektronika chegirmalari",
      titleRu: "Скидки на электронику",
      subtitleUz: "30% gacha chegirma",
      subtitleRu: "Скидки до 30%",
      image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=1400',
      link: '/categories/elektronika',
      buttonTextUz: "Ko'rish",
      buttonTextRu: "Смотреть",
      sortOrder: 2,
    },
  })

  console.log('✅ Banners seeded')

  // ── PROMO CODES ──────────────────────────────────────────────────
  await prisma.promoCode.upsert({
    where: { code: 'WELCOME10' },
    update: {},
    create: {
      code: 'WELCOME10',
      discountType: DiscountType.PERCENTAGE,
      value: 10,
      minOrderAmt: 200000,
      usageLimit: 1000,
      isActive: true,
    },
  })

  await prisma.promoCode.upsert({
    where: { code: 'SAVE50K' },
    update: {},
    create: {
      code: 'SAVE50K',
      discountType: DiscountType.FIXED,
      value: 50000,
      minOrderAmt: 500000,
      usageLimit: 500,
      isActive: true,
    },
  })

  console.log('✅ Promo codes seeded')
  console.log('🎉 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

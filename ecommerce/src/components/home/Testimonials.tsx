'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import type { Locale } from '@/i18n/config'
import { getTranslations } from '@/i18n'

const testimonials = {
  uz: [
    { name: "Aziz Karimov", city: "Toshkent", rating: 5, text: "Ajoyib xizmat! Mahsulotlar sifati yuqori, yetkazib berish tez. Albatta qayta buyurtma beraman.", avatar: "AK" },
    { name: "Malika Yusupova", city: "Samarqand", rating: 5, text: "Narxlar juda qulay, assortiment katta. Buyurtma berish jarayoni oddiy va qulay.", avatar: "MY" },
    { name: "Bobur Toshmatov", city: "Farg'ona", rating: 4, text: "Yaxshi do'kon. Bir necha marta xarid qildim, har doim mamnun qolaman.", avatar: "BT" },
    { name: "Gulnora Rashidova", city: "Buxoro", rating: 5, text: "Kosmetika mahsulotlari original ekan. Sifatdan 100% qoniqaman!", avatar: "GR" },
  ],
  ru: [
    { name: "Азиз Каримов", city: "Ташкент", rating: 5, text: "Отличный сервис! Качество товаров высокое, доставка быстрая. Обязательно закажу снова.", avatar: "AK" },
    { name: "Малика Юсупова", city: "Самарканд", rating: 5, text: "Цены очень выгодные, большой ассортимент. Процесс заказа простой и удобный.", avatar: "MY" },
    { name: "Бобур Ташматов", city: "Фергана", rating: 4, text: "Хороший магазин. Делал покупки несколько раз, всегда доволен.", avatar: "BT" },
    { name: "Гульнора Рашидова", city: "Бухара", rating: 5, text: "Косметика оказалась оригинальной. На 100% доволен качеством!", avatar: "GR" },
  ],
}

const COLORS = ['bg-primary', 'bg-blue-500', 'bg-green-500', 'bg-purple-500']

export function Testimonials({ locale }: { locale: Locale }) {
  const t = getTranslations(locale)
  const list = testimonials[locale]

  return (
    <div>
      <div className="text-center mb-10">
        <h2 className="section-title">{t.home.testimonials_title}</h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {list.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm
                       border border-gray-100 dark:border-gray-700 relative"
          >
            <Quote className="w-8 h-8 text-primary/20 absolute top-4 right-4" />

            {/* Stars */}
            <div className="flex gap-0.5 mb-4">
              {[1,2,3,4,5].map((s) => (
                <Star key={s} className={`w-4 h-4 ${s <= item.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
              ))}
            </div>

            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-5">
              "{item.text}"
            </p>

            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full ${COLORS[i % COLORS.length]}
                              flex items-center justify-center text-white font-bold text-sm`}>
                {item.avatar}
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">{item.name}</p>
                <p className="text-xs text-gray-400">{item.city}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

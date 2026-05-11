'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import type { Locale } from '@/i18n/config'

export function PromoBanners({ locale }: { locale: Locale }) {
  const banners = [
    {
      title: locale === 'ru' ? '30% скидка на электронику' : "Elektronikada 30% chegirma",
      subtitle: locale === 'ru' ? 'Ограниченное время' : 'Cheklangan vaqt',
      image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=700&h=300&fit=crop',
      link: '/categories/elektronika',
      color: 'from-blue-900/80',
      cta: locale === 'ru' ? 'Смотреть' : "Ko'rish",
    },
    {
      title: locale === 'ru' ? 'Новая коллекция одежды' : "Yangi kiyim kolleksiyasi",
      subtitle: locale === 'ru' ? 'Стиль и качество' : 'Uslub va sifat',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=700&h=300&fit=crop',
      link: '/categories/kiyim',
      color: 'from-pink-900/80',
      cta: locale === 'ru' ? 'Смотреть' : "Ko'rish",
    },
  ]

  return (
    <section className="py-16">
      <div className="container-shop">
        <div className="grid md:grid-cols-2 gap-6">
          {banners.map((banner, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <Link href={banner.link} className="group block relative rounded-3xl overflow-hidden h-52">
                <Image
                  src={banner.image}
                  alt={banner.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className={`absolute inset-0 bg-gradient-to-r ${banner.color} to-transparent`} />
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <p className="text-white/70 text-sm mb-1">{banner.subtitle}</p>
                  <h3 className="text-white text-xl font-bold mb-4">{banner.title}</h3>
                  <span className="inline-flex items-center gap-2 text-white font-medium text-sm
                                   group-hover:gap-3 transition-all">
                    {banner.cta}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

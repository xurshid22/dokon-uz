'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, ArrowRight, ShoppingBag, Tag } from 'lucide-react'
import type { Locale } from '@/i18n/config'
import { getTranslations } from '@/i18n'

interface Banner {
  id: string
  titleUz: string
  titleRu: string
  subtitleUz?: string | null
  subtitleRu?: string | null
  image: string
  link?: string | null
  buttonTextUz?: string | null
  buttonTextRu?: string | null
}

interface HeroSectionProps {
  banners: Banner[]
  locale: Locale
}

const SLIDE_INTERVAL = 5000

export function HeroSection({ banners, locale }: HeroSectionProps) {
  const t = getTranslations(locale)
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState<'left' | 'right'>('right')

  const slides = banners.length > 0 ? banners : [
    {
      id: 'default',
      titleUz: "Yangi Kolleksiya 2024",
      titleRu: "Новая Коллекция 2024",
      subtitleUz: "Eng trendy mahsulotlar endi Do'konda",
      subtitleRu: "Самые трендовые товары теперь в Do'kon",
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1400&h=600&fit=crop',
      link: '/products',
      buttonTextUz: "Hozir xarid qiling",
      buttonTextRu: "Купить сейчас",
    }
  ]

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection('right')
      setCurrent((c) => (c + 1) % slides.length)
    }, SLIDE_INTERVAL)
    return () => clearInterval(timer)
  }, [slides.length])

  const go = (idx: number, dir: 'left' | 'right') => {
    setDirection(dir)
    setCurrent(idx)
  }

  const prev = () => go((current - 1 + slides.length) % slides.length, 'left')
  const next = () => go((current + 1) % slides.length, 'right')

  const slide = slides[current]
  const title = locale === 'ru' ? slide.titleRu : slide.titleUz
  const subtitle = locale === 'ru' ? slide.subtitleRu : slide.subtitleUz
  const buttonText = locale === 'ru' ? slide.buttonTextRu : slide.buttonTextUz

  const variants = {
    enter: (dir: 'left' | 'right') => ({
      x: dir === 'right' ? '100%' : '-100%',
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir: 'left' | 'right') => ({
      x: dir === 'right' ? '-100%' : '100%',
      opacity: 0,
    }),
  }

  return (
    <section className="relative overflow-hidden bg-gray-900 h-[480px] md:h-[600px]">
      {/* Slides */}
      <AnimatePresence custom={direction} initial={false}>
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={slide.image}
            alt={title}
            fill
            className="object-cover"
            priority={current === 0}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 container-shop h-full flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${current}`}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-xl"
          >
            {/* Badge */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm
                         border border-primary/30 text-primary-200 px-4 py-1.5 rounded-full text-sm mb-6"
            >
              <Tag className="w-3.5 h-3.5" />
              <span>{locale === 'ru' ? 'Новинка' : 'Yangilik'}</span>
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4">
              {title}
            </h1>

            {subtitle && (
              <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed">
                {subtitle}
              </p>
            )}

            <div className="flex items-center gap-4">
              <Link
                href={slide.link || '/products'}
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-600
                           text-white font-semibold px-7 py-3.5 rounded-2xl
                           transition-all duration-200 hover:shadow-lg hover:shadow-primary/30
                           hover:-translate-y-0.5"
              >
                <ShoppingBag className="w-5 h-5" />
                {buttonText || t.home.hero_cta}
              </Link>

              <Link
                href="/categories"
                className="inline-flex items-center gap-2 text-white/90 hover:text-white
                           font-medium transition-colors"
              >
                {t.home.hero_cta2}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 mt-10">
              {[
                { label: locale === 'ru' ? 'Товаров' : 'Mahsulotlar', value: '10K+' },
                { label: locale === 'ru' ? 'Клиентов' : 'Mijozlar', value: '50K+' },
                { label: locale === 'ru' ? 'Брендов' : 'Brendlar', value: '200+' },
              ].map((stat) => (
                <div key={stat.label} className="text-white/80">
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20
                       w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full
                       flex items-center justify-center text-white
                       hover:bg-white/30 transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20
                       w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full
                       flex items-center justify-center text-white
                       hover:bg-white/30 transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i, i > current ? 'right' : 'left')}
                className={`rounded-full transition-all duration-300 ${
                  i === current ? 'w-8 h-2.5 bg-primary' : 'w-2.5 h-2.5 bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}

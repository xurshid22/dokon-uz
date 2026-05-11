'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, ArrowRight, CheckCircle } from 'lucide-react'
import { getTranslations } from '@/i18n'
import type { Locale } from '@/i18n/config'

export function Newsletter({ locale }: { locale: Locale }) {
  const t = getTranslations(locale)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setStatus('success')
        setEmail('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="py-20 bg-gradient-to-r from-secondary to-gray-800 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-primary rounded-full blur-3xl" />
      </div>

      <div className="container-shop relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Mail className="w-7 h-7 text-primary" />
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            {t.home.newsletter_title}
          </h2>
          <p className="text-gray-300 mb-8 text-lg">
            {t.home.newsletter_subtitle}
          </p>

          {status === 'success' ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center justify-center gap-3 text-green-400 text-lg font-medium"
            >
              <CheckCircle className="w-6 h-6" />
              {locale === 'ru' ? 'Вы подписались! Спасибо.' : "Obuna bo'ldingiz! Rahmat."}
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.home.newsletter_placeholder}
                required
                className="flex-1 bg-white/10 border border-white/20 rounded-2xl
                           px-5 py-3.5 text-white placeholder-gray-400
                           focus:outline-none focus:border-primary focus:bg-white/15
                           transition-colors"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="btn-primary flex items-center gap-2 whitespace-nowrap"
              >
                {status === 'loading'
                  ? <span className="animate-spin">⟳</span>
                  : <>
                      {t.home.newsletter_btn}
                      <ArrowRight className="w-4 h-4" />
                    </>
                }
              </button>
            </form>
          )}

          <p className="text-gray-500 text-xs mt-4">
            {locale === 'ru'
              ? 'Мы не рассылаем спам. Отписаться можно в любое время.'
              : "Spam yubormаymiz. Istalgan vaqtda bekor qilish mumkin."
            }
          </p>
        </motion.div>
      </div>
    </section>
  )
}

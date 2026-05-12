'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Loader2, Mail, Lock, User, Phone } from 'lucide-react'
import { toast } from '@/hooks/useToast'

interface RegisterForm {
  name: string
  phone: string
  email: string
  password: string
  confirmPassword: string
  agree: boolean
}

export default function RegisterPage() {
  const router = useRouter()
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterForm>()
  const password = watch('password')

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: data.name, email: data.email, password: data.password, phone: data.phone }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Xatolik')

      // Auto login
      await signIn('credentials', { email: data.email, password: data.password, redirect: false })
      toast({ title: 'Muvaffaqiyatli ro\'yxatdan o\'tdingiz!', variant: 'success' })
      router.push('/dashboard')
    } catch (e: any) {
      toast({ title: e.message || 'Xatolik yuz berdi', variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center font-black text-white text-lg">D</div>
            <span className="text-xl font-black text-gray-900 dark:text-white">Do'kon</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-6 mb-1">Ro'yxatdan o'tish</h1>
          <p className="text-gray-400 text-sm">Yangi hisob yarating</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-8 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">To'liq ism</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input {...register('name', { required: 'Ism majburiy' })}
                  placeholder="Ism Familiya" className="form-input pl-10" />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Telefon</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input {...register('phone', {
                  required: 'Telefon majburiy',
                  pattern: { value: /^\+?[0-9]{9,13}$/, message: "Noto'g'ri raqam" }
                })}
                  placeholder="+998 90 000 00 00" className="form-input pl-10" />
              </div>
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input {...register('email', {
                  required: 'Email majburiy',
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Noto'g'ri email" }
                })}
                  type="email" placeholder="email@example.com" className="form-input pl-10" />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Parol</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input {...register('password', {
                  required: 'Parol majburiy',
                  minLength: { value: 8, message: 'Kamida 8 ta belgi' }
                })}
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••" className="form-input pl-10 pr-10" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Parolni tasdiqlash</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input {...register('confirmPassword', {
                  required: 'Majburiy',
                  validate: v => v === password || 'Parollar mos emas'
                })}
                  type="password" placeholder="••••••••" className="form-input pl-10" />
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input {...register('agree', { required: true })} type="checkbox" className="mt-0.5 w-4 h-4 accent-primary" />
              <span className="text-xs text-gray-500">
                <Link href="/terms" className="text-primary hover:underline">Foydalanish shartlari</Link> va{' '}
                <Link href="/privacy" className="text-primary hover:underline">maxfiylik siyosati</Link>ga roziman
              </span>
            </label>
            {errors.agree && <p className="text-red-500 text-xs">Shartlarga rozilik bildirish majburiy</p>}

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Yuklanmoqda...' : "Ro'yxatdan o'tish"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-5">
            Hisob bormi?{' '}
            <Link href="/login" className="text-primary font-semibold hover:underline">Kirish</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

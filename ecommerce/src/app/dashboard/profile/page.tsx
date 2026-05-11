'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { User, Lock, Camera, Loader2 } from 'lucide-react'
import { toast } from '@/hooks/useToast'

interface ProfileForm {
  name: string
  phone: string
  email: string
}

interface PasswordForm {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export default function ProfilePage() {
  const { data: session, update } = useSession()
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile')
  const [loading, setLoading] = useState(false)

  const profileForm = useForm<ProfileForm>({
    defaultValues: {
      name: session?.user?.name || '',
      email: session?.user?.email || '',
      phone: '',
    },
  })

  const passwordForm = useForm<PasswordForm>()

  const onProfileSubmit = async (data: ProfileForm) => {
    setLoading(true)
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      await update({ name: data.name })
      toast({ title: 'Profil yangilandi', variant: 'success' })
    } catch {
      toast({ title: 'Xatolik yuz berdi', variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const onPasswordSubmit = async (data: PasswordForm) => {
    if (data.newPassword !== data.confirmPassword) {
      toast({ title: 'Parollar mos emas', variant: 'error' })
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/user/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: data.currentPassword, newPassword: data.newPassword }),
      })
      if (!res.ok) throw new Error()
      toast({ title: 'Parol o\'zgartirildi', variant: 'success' })
      passwordForm.reset()
    } catch {
      toast({ title: 'Parol noto\'g\'ri', variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="section-title">Profil sozlamalari</h1>

      {/* Avatar */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-6">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
              {session?.user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <button className="absolute bottom-0 right-0 w-7 h-7 bg-primary rounded-full flex items-center justify-center shadow-md">
              <Camera className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
          <div>
            <p className="font-bold text-gray-900 dark:text-white text-lg">{session?.user?.name}</p>
            <p className="text-sm text-gray-400">{session?.user?.email}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="flex border-b border-gray-100 dark:border-gray-800">
          {[
            { key: 'profile', icon: User, label: 'Shaxsiy ma\'lumotlar' },
            { key: 'password', icon: Lock, label: 'Parol' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'profile' && (
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">To'liq ism</label>
                <input {...profileForm.register('name', { required: true })} className="form-input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Telefon</label>
                <input {...profileForm.register('phone')} className="form-input" placeholder="+998 90 000 00 00" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
                <input {...profileForm.register('email')} className="form-input" type="email" disabled />
              </div>
              <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Saqlash
              </button>
            </form>
          )}

          {activeTab === 'password' && (
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Joriy parol</label>
                <input {...passwordForm.register('currentPassword', { required: true })} className="form-input" type="password" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Yangi parol</label>
                <input {...passwordForm.register('newPassword', { required: true, minLength: 8 })} className="form-input" type="password" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Parolni tasdiqlash</label>
                <input {...passwordForm.register('confirmPassword', { required: true })} className="form-input" type="password" />
              </div>
              <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Parolni o'zgartirish
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

'use client'

import { useForm } from 'react-hook-form'
import type { ShippingAddress } from './CheckoutFlow'

const REGIONS_UZ = ['Toshkent', 'Samarqand', 'Buxoro', 'Namangan', 'Andijon', 'Farg\'ona', 'Qashqadaryo', 'Surxondaryo', 'Xorazm', 'Navoiy', 'Jizzax', 'Sirdaryo', 'Qoraqalpog\'iston']
const REGIONS_RU = ['Ташкент', 'Самарканд', 'Бухара', 'Наманган', 'Андижан', 'Фергана', 'Кашкадарья', 'Сурхандарья', 'Хорезм', 'Навои', 'Джизак', 'Сырдарья', 'Каракалпакстан']

interface Props {
  locale: string
  values: ShippingAddress
  onChange: (v: ShippingAddress) => void
  onNext: () => void
}

export function ShippingStep({ locale, values, onChange, onNext }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<ShippingAddress>({ defaultValues: values })

  const onSubmit = (data: ShippingAddress) => {
    onChange(data)
    onNext()
  }

  const regions = locale === 'ru' ? REGIONS_RU : REGIONS_UZ
  const lbl = (uz: string, ru: string) => locale === 'ru' ? ru : uz
  const req = lbl("To'ldirish majburiy", 'Обязательное поле')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        {lbl('Yetkazib berish manzili', 'Адрес доставки')}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label={lbl('To\'liq ism', 'Полное имя')} error={errors.fullName?.message}>
          <input {...register('fullName', { required: req })}
            className="form-input" placeholder={lbl('Ism Familiya', 'Имя Фамилия')} />
        </Field>

        <Field label={lbl('Telefon', 'Телефон')} error={errors.phone?.message}>
          <input {...register('phone', {
            required: req,
            pattern: { value: /^\+?[0-9]{9,13}$/, message: lbl("Noto'g'ri telefon", 'Неверный номер') }
          })}
            className="form-input" placeholder="+998 90 123 45 67" />
        </Field>
      </div>

      <Field label="Email" error={errors.email?.message}>
        <input {...register('email', {
          required: req,
          pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: lbl("Noto'g'ri email", 'Неверный email') }
        })}
          className="form-input" type="email" placeholder="email@example.com" />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label={lbl('Viloyat', 'Область')} error={errors.region?.message}>
          <select {...register('region', { required: req })} className="form-input">
            <option value="">{lbl('Tanlang...', 'Выберите...')}</option>
            {regions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </Field>

        <Field label={lbl('Shahar / Tuman', 'Город / Район')} error={errors.city?.message}>
          <input {...register('city', { required: req })} className="form-input"
            placeholder={lbl('Shahar nomi', 'Название города')} />
        </Field>
      </div>

      <Field label={lbl('Ko\'cha, uy, xonadon', 'Улица, дом, квартира')} error={errors.address?.message}>
        <input {...register('address', { required: req })} className="form-input"
          placeholder={lbl('Navoiy ko\'chasi 5-uy, 12-xonadon', 'ул. Навои 5, кв. 12')} />
      </Field>

      <Field label={lbl('Izoh (ixtiyoriy)', 'Примечание (необязательно)')}>
        <textarea {...register('notes')} className="form-input resize-none" rows={2}
          placeholder={lbl('Qo\'shimcha ma\'lumot...', 'Дополнительная информация...')} />
      </Field>

      <button type="submit" className="btn-primary w-full">
        {lbl("Keyingi: To'lov", 'Далее: Оплата')} →
      </button>
    </form>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}

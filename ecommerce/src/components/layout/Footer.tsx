import Link from 'next/link'
import { Mail, Phone, MapPin, Instagram, Send } from 'lucide-react'
import type { Locale } from '@/i18n/config'
import { getTranslations } from '@/i18n'

export function Footer({ locale }: { locale: Locale }) {
  const t = getTranslations(locale)
  const year = new Date().getFullYear()

  const links = {
    shop: [
      { label: locale === 'ru' ? 'Все товары' : 'Barcha mahsulotlar', href: '/products' },
      { label: locale === 'ru' ? 'Категории' : 'Kategoriyalar', href: '/categories' },
      { label: locale === 'ru' ? 'Распродажа' : 'Chegirmalar', href: '/sale' },
      { label: locale === 'ru' ? 'Новинки' : 'Yangiliklar', href: '/new' },
    ],
    info: [
      { label: t.footer.about, href: '/about' },
      { label: t.footer.contact, href: '/contact' },
      { label: t.footer.faq, href: '/faq' },
      { label: t.footer.shipping_policy, href: '/shipping' },
    ],
    account: [
      { label: t.nav.dashboard, href: '/dashboard' },
      { label: t.orders.title, href: '/dashboard/orders' },
      { label: t.dashboard.my_wishlist, href: '/wishlist' },
      { label: locale === 'ru' ? 'Мои адреса' : 'Manzillarim', href: '/dashboard/addresses' },
    ],
  }

  return (
    <footer className="bg-secondary text-gray-300 pt-16 pb-8">
      <div className="container-shop">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">D</span>
              </div>
              <span className="text-white font-bold text-xl">Do&apos;kon</span>
            </Link>
            <p className="text-sm leading-relaxed mb-6 max-w-sm">
              {locale === 'ru'
                ? 'Крупнейший онлайн-магазин Узбекистана. Тысячи товаров по выгодным ценам с быстрой доставкой по всей стране.'
                : "O'zbekistonning eng yirik online do'koni. Minglab mahsulotlar qulay narxlarda, tez yetkazib berish bilan."
              }
            </p>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <a href="tel:+998712345678" className="hover:text-white transition-colors">+998 71 234 56 78</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <a href="mailto:info@shop.uz" className="hover:text-white transition-colors">info@shop.uz</a>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span>{locale === 'ru' ? 'г. Ташкент, Узбекистан' : 'Toshkent, O\'zbekiston'}</span>
              </div>
            </div>
          </div>

          {/* Shop links */}
          <div>
            <h4 className="text-white font-semibold mb-4">
              {locale === 'ru' ? 'Магазин' : 'Do\'kon'}
            </h4>
            <ul className="space-y-2">
              {links.shop.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}
                    className="text-sm hover:text-primary hover:translate-x-1 transition-all inline-block">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info links */}
          <div>
            <h4 className="text-white font-semibold mb-4">
              {locale === 'ru' ? 'Информация' : 'Ma\'lumot'}
            </h4>
            <ul className="space-y-2">
              {links.info.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}
                    className="text-sm hover:text-primary hover:translate-x-1 transition-all inline-block">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-white font-semibold mb-4">
              {locale === 'ru' ? 'Аккаунт' : 'Profil'}
            </h4>
            <ul className="space-y-2">
              {links.account.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}
                    className="text-sm hover:text-primary hover:translate-x-1 transition-all inline-block">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Payment methods */}
        <div className="border-t border-gray-700 pt-8 pb-6">
          <h4 className="text-white text-sm font-semibold mb-3">{t.footer.payment_methods}</h4>
          <div className="flex items-center gap-3">
            {['Click', 'Payme', 'Uzcard', 'Humo'].map((method) => (
              <div key={method}
                className="bg-white/10 rounded-lg px-3 py-1.5 text-xs font-semibold text-white">
                {method}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-700 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            © {year} Do&apos;kon. {t.footer.rights}.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-xs text-gray-500 hover:text-primary transition-colors">
              {t.footer.privacy_policy}
            </Link>
            <Link href="/terms" className="text-xs text-gray-500 hover:text-primary transition-colors">
              {t.footer.terms}
            </Link>
          </div>
          {/* Social */}
          <div className="flex items-center gap-3">
            <a href="https://t.me/shop_uz" target="_blank" rel="noopener noreferrer"
              className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center
                         hover:bg-primary transition-colors" aria-label="Telegram">
              <Send className="w-4 h-4" />
            </a>
            <a href="https://instagram.com/shop_uz" target="_blank" rel="noopener noreferrer"
              className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center
                         hover:bg-primary transition-colors" aria-label="Instagram">
              <Instagram className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

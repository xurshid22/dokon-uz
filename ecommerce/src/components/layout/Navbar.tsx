'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingCart, Heart, Search, User, Menu, X,
  Sun, Moon, Globe, ChevronDown, Bell
} from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { useUIStore } from '@/store/uiStore'
import { getTranslations } from '@/i18n'
import { cn } from '@/lib/utils'

// ── Search Bar Component ─────────────────────────────────────
function SearchBar({ onClose, t }: { onClose: () => void; t: ReturnType<typeof getTranslations> }) {
  const [query, setQuery] = useState('')
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      onClose()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute inset-x-0 top-full bg-white dark:bg-gray-900 shadow-xl border-t z-50 p-4"
    >
      <form onSubmit={handleSearch} className="container-shop flex gap-3">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.nav.search_placeholder}
          className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-2xl px-5 py-3
                     text-gray-900 dark:text-white placeholder-gray-400
                     border border-transparent focus:border-primary outline-none
                     transition-colors"
        />
        <button type="submit" className="btn-primary">
          <Search className="w-5 h-5" />
        </button>
        <button type="button" onClick={onClose}
          className="p-3 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </form>
    </motion.div>
  )
}

// ── Nav Link ─────────────────────────────────────────────────
function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        'relative text-sm font-medium transition-colors duration-200 py-1',
        active
          ? 'text-primary'
          : 'text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary'
      )}
    >
      {label}
      {active && (
        <motion.div
          layoutId="nav-indicator"
          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
        />
      )}
    </Link>
  )
}

// ── Cart Drawer Trigger ──────────────────────────────────────
function CartIcon() {
  const itemCount = useCartStore((s) => s.getItemCount())
  const setCartOpen = useUIStore((s) => s.setCartOpen)

  return (
    <button
      onClick={() => setCartOpen(true)}
      className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label="Open cart"
    >
      <ShoppingCart className="w-5 h-5 text-gray-700 dark:text-gray-200" />
      <AnimatePresence>
        {itemCount > 0 && (
          <motion.span
            key={itemCount}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white
                       text-xs font-bold rounded-full flex items-center justify-center"
          >
            {itemCount > 99 ? '99+' : itemCount}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}

// ── Main Navbar ──────────────────────────────────────────────
export function Navbar() {
  const pathname = usePathname()
  const { locale, setLocale, theme, toggleTheme, searchOpen, setSearchOpen } = useUIStore()
  const wishlistCount = useWishlistStore((s) => s.items.length)
  const t = getTranslations(locale)

  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false) }, [pathname])

  const navLinks = [
    { href: '/', label: t.nav.home },
    { href: '/products', label: t.nav.products },
    { href: '/categories', label: t.nav.categories },
  ]

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'glass shadow-md'
          : 'bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800'
      )}
    >
      {/* Top bar */}
      <div className="bg-secondary text-white text-xs py-2 hidden md:block">
        <div className="container-shop flex items-center justify-between">
          <p>🚚 500,000 so'mdan yuqori buyurtmalarda bepul yetkazib berish</p>
          <div className="flex items-center gap-4">
            <Link href="/faq" className="hover:text-primary-300 transition-colors">Yordam</Link>
            <Link href="/contact" className="hover:text-primary-300 transition-colors">Aloqa</Link>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <nav className="container-shop">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">D</span>
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-white hidden sm:block">
              Do&apos;kon
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                label={link.label}
                active={pathname === link.href}
              />
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-gray-700 dark:text-gray-200" />
            </button>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Heart className="w-5 h-5 text-gray-700 dark:text-gray-200" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white
                                 text-xs font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <CartIcon />

            {/* Language switcher */}
            <button
              onClick={() => setLocale(locale === 'uz' ? 'ru' : 'uz')}
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl
                         hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors
                         text-sm font-medium text-gray-700 dark:text-gray-200"
              aria-label="Switch language"
            >
              <Globe className="w-4 h-4" />
              <span className="uppercase">{locale === 'uz' ? 'RU' : 'UZ'}</span>
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="hidden sm:flex p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light'
                ? <Moon className="w-5 h-5 text-gray-700" />
                : <Sun className="w-5 h-5 text-yellow-400" />
              }
            </button>

            {/* User */}
            <Link
              href="/dashboard"
              className="hidden sm:flex p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <User className="w-5 h-5 text-gray-700 dark:text-gray-200" />
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen
                ? <X className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                : <Menu className="w-5 h-5 text-gray-700 dark:text-gray-200" />
              }
            </button>
          </div>
        </div>
      </nav>

      {/* Search Bar */}
      <AnimatePresence>
        {searchOpen && <SearchBar onClose={() => setSearchOpen(false)} t={t} />}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-white dark:bg-gray-900 border-t dark:border-gray-800 overflow-hidden"
          >
            <div className="container-shop py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                    pathname === link.href
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 border-t dark:border-gray-800 flex items-center gap-3">
                <button
                  onClick={() => setLocale(locale === 'uz' ? 'ru' : 'uz')}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl
                             text-sm text-gray-700 dark:text-gray-200
                             hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  {locale === 'uz' ? "Русский" : "O'zbek"}
                </button>
                <button onClick={toggleTheme}
                  className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-yellow-400" />}
                </button>
                <Link href="/login"
                  className="ml-auto btn-primary text-sm py-2 px-5">
                  {t.nav.login}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

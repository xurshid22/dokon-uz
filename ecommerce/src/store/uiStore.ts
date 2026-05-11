import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Locale } from '@/i18n/config'

interface UIStore {
  locale: Locale
  theme: 'light' | 'dark'
  cartOpen: boolean
  mobileMenuOpen: boolean
  searchOpen: boolean

  setLocale: (locale: Locale) => void
  toggleTheme: () => void
  setTheme: (theme: 'light' | 'dark') => void
  setCartOpen: (open: boolean) => void
  setMobileMenuOpen: (open: boolean) => void
  setSearchOpen: (open: boolean) => void
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      locale: 'uz',
      theme: 'light',
      cartOpen: false,
      mobileMenuOpen: false,
      searchOpen: false,

      setLocale: (locale) => set({ locale }),
      toggleTheme: () => set((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),
      setTheme: (theme) => set({ theme }),
      setCartOpen: (open) => set({ cartOpen: open }),
      setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
      setSearchOpen: (open) => set({ searchOpen: open }),
    }),
    {
      name: 'ui-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ locale: state.locale, theme: state.theme }),
    }
  )
)

import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/shared/Providers'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: "Do'kon — Uzbekiston Online Do'koni",
    template: "%s | Do'kon",
  },
  description: "Uzbekistondagi eng yaxshi online do'kon. Sifatli mahsulotlar arzon narxlarda.",
  keywords: ["online dokon", "internet magazin", "uzbekistan", "xarid", "покупки"],
  authors: [{ name: "Do'kon" }],
  creator: "Do'kon",
  openGraph: {
    type: 'website',
    locale: 'uz_UZ',
    alternateLocale: 'ru_RU',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "Do'kon",
    title: "Do'kon — Uzbekiston Online Do'koni",
    description: "Uzbekistondagi eng yaxshi online do'kon.",
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Do'kon",
    description: "Uzbekistondagi eng yaxshi online do'kon.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FF6B35' },
    { media: '(prefers-color-scheme: dark)', color: '#111827' },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}

# E-Commerce Platform — Architecture Documentation

## Stack
- **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS, ShadCN UI, Framer Motion
- **State:** Zustand + TanStack Query
- **Backend:** Next.js Server Actions + Route Handlers
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** NextAuth.js v5
- **Storage:** Cloudinary
- **Payments:** Click, Payme, Cash on Delivery

## Folder Structure

```
ecommerce/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── migrations/            # DB migrations
│   └── seed/
│       └── seed.ts            # Seed data
│
├── public/
│   ├── images/                # Static images
│   └── icons/                 # SVG icons
│
├── src/
│   ├── app/
│   │   ├── (auth)/            # Auth route group
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── forgot-password/
│   │   │   ├── reset-password/
│   │   │   └── verify-email/
│   │   │
│   │   ├── (shop)/            # Shop route group
│   │   │   ├── products/
│   │   │   │   └── [slug]/
│   │   │   ├── cart/
│   │   │   ├── checkout/
│   │   │   ├── categories/[slug]/
│   │   │   ├── wishlist/
│   │   │   └── search/
│   │   │
│   │   ├── dashboard/         # User dashboard
│   │   │   ├── orders/
│   │   │   ├── wishlist/
│   │   │   ├── addresses/
│   │   │   └── settings/
│   │   │
│   │   ├── admin/             # Admin panel
│   │   │   ├── dashboard/
│   │   │   ├── products/
│   │   │   ├── categories/
│   │   │   ├── orders/
│   │   │   ├── users/
│   │   │   └── promo-codes/
│   │   │
│   │   ├── api/               # API routes
│   │   │   ├── auth/[...nextauth]/
│   │   │   ├── products/
│   │   │   ├── categories/
│   │   │   ├── orders/
│   │   │   ├── cart/
│   │   │   ├── wishlist/
│   │   │   ├── reviews/
│   │   │   ├── upload/
│   │   │   └── promo/
│   │   │
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Homepage
│   │   ├── loading.tsx
│   │   ├── not-found.tsx
│   │   ├── error.tsx
│   │   ├── robots.ts
│   │   └── sitemap.ts
│   │
│   ├── components/
│   │   ├── ui/                # ShadCN + custom primitives
│   │   ├── layout/            # Header, Footer, Sidebar
│   │   ├── home/              # Homepage sections
│   │   ├── product/           # Product components
│   │   ├── cart/              # Cart components
│   │   ├── checkout/          # Checkout steps
│   │   ├── dashboard/         # User dashboard
│   │   ├── admin/             # Admin components
│   │   └── shared/            # Shared/utility components
│   │
│   ├── lib/
│   │   ├── prisma.ts          # Prisma client singleton
│   │   ├── auth.ts            # NextAuth config
│   │   ├── cloudinary.ts      # Cloudinary config
│   │   ├── validations.ts     # Zod schemas
│   │   └── utils.ts           # Utility functions
│   │
│   ├── hooks/                 # Custom React hooks
│   ├── store/                 # Zustand stores
│   ├── types/                 # TypeScript types
│   ├── i18n/                  # i18n config + translations
│   └── utils/                 # Helper utilities
│
├── .env.example
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

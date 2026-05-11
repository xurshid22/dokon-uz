# Do'kon — Bilingual E-Commerce Platform (UZ/RU)

> Production-ready Next.js 15 e-commerce platform for Uzbekistan with full Uzbek and Russian localization.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 (App Router), TypeScript |
| Styling | Tailwind CSS, ShadCN UI, Framer Motion |
| State | Zustand + TanStack Query |
| Database | PostgreSQL + Prisma ORM |
| Auth | NextAuth.js v5 |
| Storage | Cloudinary |
| Payments | Click, Payme, Cash on Delivery |
| Deployment | Vercel + Railway/Supabase |

---

## 📁 Project Structure

```
ecommerce/
├── prisma/
│   ├── schema.prisma          # Full database schema
│   └── seed/seed.ts           # Sample data seeder
│
├── src/
│   ├── app/
│   │   ├── (auth)/            # Login, Register, Reset Password
│   │   ├── (shop)/
│   │   │   ├── products/      # Product listing with filters
│   │   │   ├── products/[slug]/  # Product detail page
│   │   │   ├── cart/          # Shopping cart page
│   │   │   ├── checkout/      # Multi-step checkout
│   │   │   └── wishlist/      # Wishlist
│   │   ├── dashboard/         # User dashboard
│   │   ├── admin/             # Admin panel
│   │   └── api/               # REST API routes
│   │
│   ├── components/
│   │   ├── layout/            # Navbar, Footer
│   │   ├── home/              # All homepage sections
│   │   ├── product/           # ProductCard, ProductDetail
│   │   ├── cart/              # CartDrawer, CartPage
│   │   ├── checkout/          # Multi-step checkout
│   │   ├── dashboard/         # User dashboard
│   │   ├── admin/             # Admin components
│   │   └── shared/            # Providers, utilities
│   │
│   ├── i18n/                  # UZ + RU translations
│   ├── lib/                   # Prisma, Auth, Utils
│   ├── store/                 # Zustand stores (cart, wishlist, ui)
│   └── types/                 # TypeScript types
```

---

## ⚡ Quick Start

### 1. Prerequisites

```bash
node >= 18.0.0
pnpm >= 8 (or npm/yarn)
PostgreSQL running locally or on Supabase/Railway
```

### 2. Clone & Install

```bash
git clone <repo-url>
cd ecommerce
pnpm install
```

### 3. Environment Variables

```bash
cp .env.example .env.local
# Fill in all required values
```

Required variables:
```
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
NEXTAUTH_URL=http://localhost:3000
```

### 4. Database Setup

```bash
# Push schema to DB
pnpm prisma db push

# OR run migrations
pnpm prisma migrate dev --name init

# Seed sample data
pnpm prisma db seed
```

### 5. Start Development

```bash
pnpm dev
# Open http://localhost:3000
```

---

## 🗄️ Database Schema

### Core Tables

| Table | Description |
|-------|-------------|
| `users` | Customers and admins |
| `products` | Bilingual products (UZ/RU fields) |
| `categories` | Bilingual categories with hierarchy |
| `orders` | Orders with status tracking |
| `order_items` | Line items snapshot |
| `cart` / `cart_items` | Server-side cart |
| `reviews` | Approved product reviews |
| `wishlists` | User wishlists |
| `promo_codes` | Discount codes (% or fixed) |
| `banners` | Homepage hero banners |

---

## 🌐 API Endpoints

### Products
```
GET  /api/products              # List with filters
GET  /api/products/:slug        # Product detail
POST /api/products              # Create (admin)
PUT  /api/products/:id          # Update (admin)
DEL  /api/products/:id          # Delete (admin)
```

### Orders
```
POST /api/orders                # Create order
GET  /api/orders                # User's orders
GET  /api/orders/:id            # Order detail
PATCH /api/orders/:id/status    # Update status (admin)
```

### Cart
```
GET    /api/cart                # Get cart
POST   /api/cart                # Add item
PATCH  /api/cart                # Update quantity
DELETE /api/cart                # Remove item
```

### Auth
```
POST /api/auth/register         # Register
POST /api/auth/[...nextauth]    # NextAuth handler
POST /api/auth/forgot-password  # Forgot password
POST /api/auth/reset-password   # Reset password
```

---

## 🎨 Design System

- **Primary Color:** `#FF6B35` (Orange)
- **Secondary:** `#1F2937` (Dark Gray)
- **Font:** Inter (Google Fonts, cyrillic support)
- **Border Radius:** 16px (`rounded-2xl`)
- **Animations:** Framer Motion page transitions + hover effects

---

## 💳 Payment Integration

### Click
```typescript
// POST to Click API with merchant credentials
// CLICK_MERCHANT_ID + CLICK_SERVICE_ID in .env
```

### Payme
```typescript
// Payme merchant API
// PAYME_MERCHANT_ID + PAYME_SECRET_KEY in .env
// Set PAYME_TEST_MODE=true for testing
```

### Cash on Delivery
No integration needed — order is created with PENDING status.

---

## 🔐 Authentication

- JWT-based sessions via NextAuth
- Credentials (email + bcrypt password)
- Google OAuth (optional)
- Role-based access: `USER | ADMIN | SUPER_ADMIN`
- Password reset via email token

---

## 🌍 i18n Localization

- Default locale: **Uzbek (uz)**
- Second locale: **Russian (ru)**
- Switching: Zustand `useUIStore().setLocale()`
- All product text stored as `titleUz/titleRu`, `descriptionUz/descriptionRu`

---

## 📊 Admin Panel

Access: `/admin` (requires ADMIN or SUPER_ADMIN role)

Features:
- Dashboard with revenue charts
- Product CRUD with image uploads
- Category management
- Order management + status updates
- User management
- Promo code management
- Inventory tracking

---

## 🚀 Deployment

### Vercel (Frontend)

```bash
vercel --prod
```

Environment variables: Set all `.env.local` values in Vercel dashboard.

### Railway (Database)

1. Create PostgreSQL service on Railway
2. Copy `DATABASE_URL` to Vercel env vars
3. Run `prisma migrate deploy` in deploy hook

### Supabase Alternative

```bash
# Use Supabase connection string
DATABASE_URL=postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres
```

---

## 🧪 Test Credentials

After running seed:

```
Admin:  admin@shop.uz  / Admin@12345
User:   user@test.uz   / User@12345
```

---

## 📦 Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm type-check   # TypeScript check
pnpm prisma studio  # Open Prisma Studio
pnpm prisma db seed  # Seed the database
```

---

## 🛡️ Security

- Passwords hashed with bcrypt (12 rounds)
- JWT tokens with 30-day expiry
- CSRF protection via NextAuth
- SQL injection protection via Prisma
- Input validation with Zod
- Admin routes protected by middleware
- Rate limiting (implement via Upstash Redis)

---

## 📝 License

MIT — free for personal and commercial use.

# 🚀 Deployment Qo'llanmasi

## 1. Ma'lumotlar bazasi — Railway (tavsiya etiladi)

### Railway orqali PostgreSQL
1. https://railway.app ga kiring
2. "New Project" → "PostgreSQL" tanlang
3. Connect → `DATABASE_URL` ni nusxalab oling
4. Vercel ga qo'shing

```bash
# Migrations ishga tushirish
npx prisma migrate deploy

# Seed data
npx prisma db seed
```

---

## 2. Rasm yuklash — Cloudinary

1. https://cloudinary.com ga ro'yxatdan o'ting (bepul)
2. Dashboard → API Keys
3. `.env.local` ga qo'shing:
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 3. Frontend — Vercel

```bash
# Vercel CLI o'rnatish
npm i -g vercel

# Deploy qilish
vercel --prod
```

### Vercel Dashboard'da env o'zgaruvchilarni qo'shing:
- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` = `https://your-domain.vercel.app`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

---

## 4. To'lov tizimlari

### Click
1. https://my.click.uz ga kiring (merchant)
2. Xizmat yarating, Callback URL qo'shing:
   `https://your-domain.vercel.app/api/payments/click`
3. Merchant ID va Service ID ni `.env` ga qo'shing

### Payme
1. https://merchant.payme.uz ga kiring
2. Do'kon yarating
3. Secret Key va Merchant ID ni `.env` ga qo'shing
4. Callback: `https://your-domain.vercel.app/api/payments/payme`

---

## 5. Domain ulash

```bash
# Vercel CLI orqali
vercel domains add your-domain.uz
```

DNS sozlamalari:
```
A     @    76.76.19.61
CNAME www  cname.vercel-dns.com
```

---

## 6. SSL

Vercel avtomatik SSL sertifikat beradi ✅

---

## Test ma'lumotlari (seed dan keyin)

| Rol | Email | Parol |
|-----|-------|-------|
| Admin | admin@shop.uz | Admin@12345 |
| User | user@test.uz | User@12345 |

---

## Nazorat ro'yxati (Checklist)

- [ ] `DATABASE_URL` sozlandi
- [ ] `NEXTAUTH_SECRET` yaratildi (`openssl rand -base64 32`)
- [ ] `NEXTAUTH_URL` production URL
- [ ] Cloudinary sozlandi
- [ ] `prisma migrate deploy` bajarildi
- [ ] `prisma db seed` bajarildi
- [ ] Click/Payme credentials sozlandi
- [ ] Domain ulandi
- [ ] SSL faol

import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'
import { Plus, Edit, Trash2, Star } from 'lucide-react'

export default async function AdminProductsPage({
  searchParams
}: { searchParams: { page?: string; q?: string } }) {
  const page = parseInt(searchParams.page || '1')
  const limit = 20
  const search = searchParams.q

  const where = search ? {
    OR: [
      { titleUz: { contains: search, mode: 'insensitive' as any } },
      { titleRu: { contains: search, mode: 'insensitive' as any } },
      { sku: { contains: search, mode: 'insensitive' as any } },
    ]
  } : {}

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        images: { take: 1, orderBy: { sortOrder: 'asc' } },
        category: true,
      },
    }),
    prisma.product.count({ where }),
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Mahsulotlar</h1>
        <Link href="/admin/products/new"
          className="flex items-center gap-2 bg-primary hover:bg-orange-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
          <Plus className="w-4 h-4" />
          Yangi mahsulot
        </Link>
      </div>

      {/* Search */}
      <form className="flex gap-3">
        <input
          name="q"
          defaultValue={search}
          placeholder="Mahsulot nomi yoki SKU..."
          className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 flex-1 outline-none focus:border-primary"
        />
        <button type="submit" className="bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-semibold">
          Qidirish
        </button>
      </form>

      {/* Products table */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
        <div className="flex justify-between items-center px-5 py-3 border-b border-gray-800">
          <span className="text-sm text-gray-400">{total} ta mahsulot</span>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              {['Rasm', 'Mahsulot', 'Kategoriya', 'Narx', 'Ombor', 'Reyting', 'Status', ''].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-800">
                    {product.images[0] && (
                      <Image src={product.images[0].url} alt={product.titleUz} width={40} height={40} className="object-cover w-full h-full" />
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm font-medium text-white">{product.titleUz}</p>
                  <p className="text-xs text-gray-500 font-mono">{product.sku}</p>
                </td>
                <td className="px-4 py-3 text-xs text-gray-400">{product.category?.nameUz || '—'}</td>
                <td className="px-4 py-3">
                  <p className="text-sm font-bold text-primary">{formatPrice(Number(product.price), 'uz')}</p>
                  {product.discountPrice && (
                    <p className="text-xs text-gray-500 line-through">{formatPrice(Number(product.discountPrice), 'uz')}</p>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-bold ${product.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {product.stock} dona
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-gray-300">{Number(product.rating).toFixed(1)}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    product.isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'
                  }`}>
                    {product.isActive ? 'Aktiv' : 'Yashirin'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/products/${product.id}/edit`}
                      className="p-1.5 text-gray-400 hover:text-primary transition-colors">
                      <Edit className="w-4 h-4" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

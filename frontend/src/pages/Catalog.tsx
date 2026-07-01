import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { Product, Category } from '../types';

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Category[]>('/categories').then((res) => setCategories(res.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string | number> = {};
    if (categoryId) params.categoryId = categoryId;
    if (search) params.search = search;

    api.get<Product[]>('/products', { params })
      .then((res) => setProducts(res.data))
      .finally(() => setLoading(false));
  }, [categoryId, search]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="text-4xl mb-2">The Catalog</h1>
        <p className="text-ink/60">Browse everything in stock. No account needed to look around.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <input
          placeholder="Search products…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-lg border border-ink/20 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent/40"
        />
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : '')}
          className="rounded-lg border border-ink/20 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent/40"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-ink/50">Loading…</p>
      ) : products.length === 0 ? (
        <p className="text-ink/50">No products match your search.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <div key={p.id} className="rounded-xl border border-ink/10 bg-white overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-[4/3] bg-ink/5 flex items-center justify-center overflow-hidden">
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-ink/30 text-sm">No image</span>
                )}
              </div>
              <div className="p-4">
                <p className="text-xs uppercase tracking-wide text-accent font-medium mb-1">{p.categoryName}</p>
                <h3 className="font-display text-lg leading-snug mb-1">{p.name}</h3>
                <p className="text-sm text-ink/60 mb-3 line-clamp-2">{p.description}</p>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">${p.price.toFixed(2)}</span>
                  <span className={`text-xs ${p.stockQuantity > 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                    {p.stockQuantity > 0 ? `${p.stockQuantity} in stock` : 'Out of stock'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

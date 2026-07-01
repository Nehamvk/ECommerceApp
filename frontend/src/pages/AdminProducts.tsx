import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '../api/client';
import { Product, Category } from '../types';
import { productSchema, ProductFormValues } from '../schemas';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
  });

  const loadProducts = () => api.get<Product[]>('/products').then((res) => setProducts(res.data));

  useEffect(() => {
    loadProducts();
    api.get<Category[]>('/categories').then((res) => setCategories(res.data));
  }, []);

  const onSubmit = async (values: ProductFormValues) => {
    setServerError(null);
    const payload = { ...values, imageUrl: values.imageUrl || null };
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
      } else {
        await api.post('/products', payload);
      }
      reset({ name: '', description: '', price: 0, stockQuantity: 0, imageUrl: '', categoryId: undefined as any });
      setEditingId(null);
      loadProducts();
    } catch (err: any) {
      setServerError(err.response?.data?.message ?? 'Could not save the product.');
    }
  };

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    reset({
      name: p.name,
      description: p.description,
      price: p.price,
      stockQuantity: p.stockQuantity,
      imageUrl: p.imageUrl ?? '',
      categoryId: p.categoryId,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    reset({ name: '', description: '', price: 0, stockQuantity: 0, imageUrl: '', categoryId: undefined as any });
  };

  const remove = async (id: number) => {
    if (!confirm('Delete this product?')) return;
    await api.delete(`/products/${id}`);
    loadProducts();
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-10">
      <div>
        <h2 className="text-2xl mb-4">{editingId ? 'Edit product' : 'Add a product'}</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white border border-ink/10 rounded-xl p-5">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input {...register('name')} className="w-full rounded-lg border border-ink/20 px-3 py-2" />
            {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea {...register('description')} rows={3} className="w-full rounded-lg border border-ink/20 px-3 py-2" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Price</label>
              <input type="number" step="0.01" {...register('price')} className="w-full rounded-lg border border-ink/20 px-3 py-2" />
              {errors.price && <p className="text-sm text-red-600 mt-1">{errors.price.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Stock</label>
              <input type="number" {...register('stockQuantity')} className="w-full rounded-lg border border-ink/20 px-3 py-2" />
              {errors.stockQuantity && <p className="text-sm text-red-600 mt-1">{errors.stockQuantity.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Image URL</label>
            <input {...register('imageUrl')} className="w-full rounded-lg border border-ink/20 px-3 py-2" />
            {errors.imageUrl && <p className="text-sm text-red-600 mt-1">{errors.imageUrl.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select {...register('categoryId')} className="w-full rounded-lg border border-ink/20 px-3 py-2">
              <option value="">Select a category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            {errors.categoryId && <p className="text-sm text-red-600 mt-1">{errors.categoryId.message}</p>}
          </div>

          {serverError && <p className="text-sm text-red-600">{serverError}</p>}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-lg bg-ink text-white py-2.5 font-medium hover:bg-accent transition-colors disabled:opacity-50"
            >
              {editingId ? 'Save changes' : 'Add product'}
            </button>
            {editingId && (
              <button type="button" onClick={cancelEdit} className="rounded-lg border border-ink/20 px-4 py-2.5">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div>
        <h2 className="text-2xl mb-4">Products ({products.length})</h2>
        <div className="space-y-3">
          {products.map((p) => (
            <div key={p.id} className="flex items-center justify-between bg-white border border-ink/10 rounded-xl p-4">
              <div>
                <p className="font-medium">{p.name}</p>
                <p className="text-sm text-ink/60">{p.categoryName} · ${p.price.toFixed(2)} · {p.stockQuantity} in stock</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(p)} className="text-sm px-3 py-1.5 rounded-full border border-ink/15 hover:border-accent hover:text-accent">
                  Edit
                </button>
                <button onClick={() => remove(p.id)} className="text-sm px-3 py-1.5 rounded-full border border-red-200 text-red-600 hover:bg-red-50">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

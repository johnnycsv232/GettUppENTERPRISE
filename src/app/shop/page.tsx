/**
 * @file page.tsx
 * @description Shop page for GettUpp Girls merchandise
 * @module app/shop/page
 */

import { PageHeader } from '@/components/ui/PageHeader';
import { MagneticButton } from '@/components/ui/MagneticButton';

export default function ShopPage() {
  const products = [
    { name: 'Fitted Crop Top', price: 38, bestseller: true },
    { name: 'Relaxed Crop Top', price: 36 },
    { name: 'Oversized Hoodie', price: 65 },
    { name: 'Logo Bodysuit', price: 48 },
  ];

  return (
    <main className="min-h-screen bg-brand-ink">
      <PageHeader
        badge="GETTUPP GIRLS"
        title={
          <>
            THE <span className="text-brand-pink">UNIFORM</span>
          </>
        }
        subtitle="The unofficial uniform for the nightlife elite."
      />

      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <div
                key={index}
                className="bg-gray-900 p-6 rounded-lg border border-white/10"
              >
                <div className="relative aspect-square bg-gray-800 rounded-lg mb-4">
                  {/* Placeholder for product image */}
                </div>
                <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                <p className="text-lg text-brand-gold font-bold mb-4">${product.price}</p>
                {/* Size Selector Placeholder */}
                <div className="mb-4">
                  <p className="text-sm text-gray-400">Size Selector Placeholder</p>
                </div>
                <MagneticButton variant="gold" className="w-full">
                  Add to Cart
                </MagneticButton>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PRODUCTS } from '@/data/products';
import { Product } from '@/types';
import ProductCard from '@/components/product/ProductCard';
import QuickViewModal from '@/components/ui/QuickViewModal';
import RevealText from '@/components/animations/RevealText';

export default function FeaturedMasterpieces() {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const featured = PRODUCTS.filter((p) => p.featured).slice(0, 6);

  return (
    <section className="py-24 sm:py-32 bg-white text-black border-t border-neutral-200 relative overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="text-xs font-mono text-neutral-400 lowercase tracking-widest block mb-2">
              engineering catalog
            </span>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-[-0.04em] lowercase text-black leading-none">
              precision 3d components.
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 font-normal lowercase mt-3 max-w-lg">
              print-in-place mechanisms, generative aerospace lattices, and high-temperature additive assemblies.
            </p>
          </div>

          <Link
            href="/shop"
            className="text-xs sm:text-sm font-semibold text-neutral-700 hover:text-black flex items-center gap-1.5 transition-colors lowercase tracking-normal border-b border-black pb-0.5 whitespace-nowrap"
          >
            <span>view all components ({PRODUCTS.length}) &rarr;</span>
          </Link>
        </div>

        {/* Product Cards Grid (Light Mode) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featured.map((product, idx) => (
            <RevealText key={product.id} delay={idx * 0.08}>
              <ProductCard
                product={product}
                theme="light"
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            </RevealText>
          ))}
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </section>
  );
}

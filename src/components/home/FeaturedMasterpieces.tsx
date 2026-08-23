'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PRODUCTS } from '@/data/products';
import { Product } from '@/types';
import ProductCard from '@/components/product/ProductCard';
import QuickViewModal from '@/components/ui/QuickViewModal';
import RevealText from '@/components/animations/RevealText';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function FeaturedMasterpieces() {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const featured = PRODUCTS.filter((p) => p.featured).slice(0, 6);

  return (
    <section className="py-20 bg-obsidian-900/40 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <RevealText>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-mono mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>LIMITED RUNS</span>
              </div>
            </RevealText>

            <RevealText delay={0.1}>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground">
                Featured Masterpieces
              </h2>
            </RevealText>
          </div>

          <RevealText delay={0.2}>
            <Link
              href="/shop"
              className="text-xs font-mono text-gold-400 hover:text-gold-300 flex items-center gap-1.5 transition-colors uppercase tracking-wider group"
            >
              <span>View Entire Gallery ({PRODUCTS.length})</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </RevealText>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featured.map((product, idx) => (
            <RevealText key={product.id} delay={idx * 0.1}>
              <ProductCard
                product={product}
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

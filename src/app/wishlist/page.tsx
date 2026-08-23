'use client';

import React from 'react';
import Link from 'next/link';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { PRODUCTS } from '@/data/products';
import ProductCard from '@/components/product/ProductCard';
import { Heart, ShoppingBag, ArrowRight, Box } from 'lucide-react';

export default function WishlistPage() {
  const { wishlistIds } = useWishlist();
  const { addItem } = useCart();

  const savedProducts = PRODUCTS.filter((p) => wishlistIds.includes(p.id));

  const handleMoveAllToCart = () => {
    savedProducts.forEach((p) => {
      addItem({
        productId: p.id,
        name: p.name,
        image: p.image,
        category: p.category,
        selectedMaterial: '24K Gilded Gold Leaf',
        selectedScale: '1/6 Scale',
        unitPrice: p.basePrice,
        quantity: 1,
      });
    });
  };

  return (
    <div className="min-h-screen bg-obsidian-950 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-mono mb-2">
              <Heart className="w-3.5 h-3.5" />
              <span>COLLECTOR SAVED VAULT</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-bold text-foreground">
              Saved Masterworks
            </h1>
            <p className="text-xs sm:text-sm text-titanium-400 mt-1 font-mono">
              {savedProducts.length} {savedProducts.length === 1 ? 'Sculpture' : 'Sculptures'} Pinned to Your Collector Registry
            </p>
          </div>

          {savedProducts.length > 0 && (
            <button
              onClick={handleMoveAllToCart}
              className="px-6 py-3 rounded-full bg-gold-500 text-obsidian-950 font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-gold-glow flex items-center gap-2 self-start sm:self-auto"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Move All to Cart</span>
            </button>
          )}
        </div>

        {savedProducts.length === 0 ? (
          /* Empty State */
          <div className="p-16 rounded-3xl bg-obsidian-900/60 border border-obsidian-800 text-center max-w-xl mx-auto space-y-6">
            <div className="w-16 h-16 rounded-full bg-obsidian-950 border border-obsidian-700 flex items-center justify-center mx-auto text-gold-400">
              <Heart className="w-8 h-8 opacity-50" />
            </div>
            <h2 className="text-2xl font-display font-bold text-foreground">
              Your Saved Vault is Empty
            </h2>
            <p className="text-xs sm:text-sm text-titanium-400 max-w-sm mx-auto leading-relaxed">
              Tap the heart emblem on any 3D sculpture in our catalog to save it for private inspection.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-gold-500 to-amber-500 text-obsidian-950 font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-gold-glow transition-all"
            >
              <span>Explore Masterpiece Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {savedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

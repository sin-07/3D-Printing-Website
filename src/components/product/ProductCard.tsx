'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Product, MaterialFinish } from '@/types';
import { useCurrency } from '@/context/CurrencyContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { Heart, Eye, ShoppingBag, Star, Sparkles, Box } from 'lucide-react';
import MagneticButton from '@/components/animations/MagneticButton';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { formatPrice } = useCurrency();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addItem } = useCart();
  const [selectedMat, setSelectedMat] = useState<MaterialFinish>('24K Gilded Gold Leaf');

  const isSaved = isInWishlist(product.id);

  const matObj = product.materials.find((m) => m.name === selectedMat) || product.materials[0];
  const calculatedPrice = Math.round(product.basePrice * (matObj?.priceMultiplier || 1));

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      name: product.name,
      image: product.image,
      category: product.category,
      selectedMaterial: selectedMat,
      selectedScale: '1/6 Scale',
      unitPrice: calculatedPrice,
      quantity: 1,
      editionNumber: Math.floor(Math.random() * product.editionSize) + 1,
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id, product.name);
  };

  return (
    <div className="group relative rounded-2xl bg-obsidian-900/70 border border-obsidian-700/80 hover:border-gold-500/40 p-4 transition-all duration-300 hover:shadow-2xl hover:shadow-gold-500/10 flex flex-col justify-between">
      {/* Top Media / Preview Container */}
      <div className="relative w-full aspect-[4/4.5] rounded-xl overflow-hidden bg-obsidian-950 border border-obsidian-800">
        {/* Rarity & Stock Tag */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5 items-start">
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider backdrop-blur-md border ${
              product.rarity === 'Mythic'
                ? 'bg-gold-500/20 text-gold-300 border-gold-500/40 shadow-gold-glow/40'
                : product.rarity === 'Legendary'
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-purple-glow/40'
                : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
            }`}
          >
            {product.rarity}
          </span>
          {product.stockLeft <= 5 && (
            <span className="px-2 py-0.5 rounded-full bg-rose-950/80 text-rose-300 border border-rose-500/40 text-[9px] font-mono font-bold animate-pulse">
              ONLY {product.stockLeft} LEFT
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-obsidian-950/80 backdrop-blur-md border border-obsidian-700 text-titanium-400 hover:text-gold-400 hover:border-gold-500/40 transition-all duration-200"
          title={isSaved ? 'Remove from Saved' : 'Save to Vault'}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-gold-400 text-gold-400' : ''}`} />
        </button>

        {/* Product Image */}
        <Link href={`/shop/${product.id}`} className="block w-full h-full relative">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
          />
        </Link>

        {/* Hover Quick View Overlay Bar */}
        <div className="absolute inset-x-3 bottom-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
          {onQuickView && (
            <button
              onClick={() => onQuickView(product)}
              className="flex-1 py-2 rounded-lg bg-obsidian-950/90 backdrop-blur-md border border-obsidian-700 hover:border-gold-500/50 text-titanium-200 hover:text-gold-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Quick 360</span>
            </button>
          )}

          <button
            onClick={handleQuickAdd}
            className="p-2 rounded-lg bg-gold-500 text-obsidian-950 font-bold hover:brightness-110 shadow-gold-glow flex items-center justify-center transition-all"
            title="Instant Add"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom Content Area */}
      <div className="pt-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-[11px] font-mono text-gold-400/90 uppercase tracking-wider">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-gold-400 font-mono text-xs">
              <Star className="w-3 h-3 fill-gold-400 text-gold-400" />
              <span>{product.rating}</span>
            </div>
          </div>

          {/* Title */}
          <Link href={`/shop/${product.id}`} className="block group-hover:text-gold-300 transition-colors">
            <h3 className="font-display font-bold text-sm sm:text-base text-foreground leading-snug">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-titanium-400 line-clamp-1 mt-0.5">{product.tagline}</p>
        </div>

        {/* Material Swatches & Pricing */}
        <div className="mt-4 pt-3 border-t border-obsidian-800 flex items-center justify-between">
          {/* Material Swatch Dots */}
          <div className="flex items-center gap-1">
            {product.materials.slice(0, 4).map((m) => (
              <button
                key={m.name}
                onClick={() => setSelectedMat(m.name)}
                title={m.name}
                className={`w-3.5 h-3.5 rounded-full border transition-transform ${
                  selectedMat === m.name
                    ? 'border-gold-400 scale-125 shadow-gold-glow'
                    : 'border-obsidian-700 opacity-60 hover:opacity-100'
                }`}
                style={{ backgroundColor: m.color }}
              />
            ))}
          </div>

          {/* Price */}
          <div className="text-right">
            <span className="text-xs font-mono text-titanium-400 block -mb-0.5">From</span>
            <span className="text-sm sm:text-base font-bold font-mono text-gold-400">
              {formatPrice(calculatedPrice)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

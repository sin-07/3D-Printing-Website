'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Product, MaterialFinish } from '@/types';
import { useCurrency } from '@/context/CurrencyContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { Heart, Eye, ShoppingBag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  theme?: 'light' | 'dark';
}

export default function ProductCard({
  product,
  onQuickView,
  theme = 'light',
}: ProductCardProps) {
  const { formatPrice } = useCurrency();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addItem } = useCart();
  const [selectedMat, setSelectedMat] = useState<MaterialFinish>(
    product.materials[0]?.name || 'Carbon Fiber PA-CF'
  );

  const isSaved = isInWishlist(product.id);
  const isLight = theme === 'light';

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
    <div
      className={`group relative rounded-2xl p-4 transition-all duration-300 flex flex-col justify-between select-none ${
        isLight
          ? 'bg-neutral-50/70 border border-neutral-200 hover:border-black shadow-sm hover:shadow-lg'
          : 'bg-neutral-900/30 border border-neutral-800 hover:border-neutral-600'
      }`}
    >
      {/* Media / Preview Container */}
      <div
        className={`relative w-full aspect-[4/4.5] rounded-xl overflow-hidden border ${
          isLight
            ? 'bg-neutral-100 border-neutral-200'
            : 'bg-neutral-950 border-neutral-850'
        }`}
      >
        {/* Minimal Technical Tag */}
        <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5">
          <span
            className={`px-2.5 py-1 rounded-full text-[10px] font-mono lowercase backdrop-blur-md border ${
              isLight
                ? 'bg-white/90 text-neutral-700 border-neutral-200 shadow-xs'
                : 'bg-black/60 text-neutral-300 border-white/10'
            }`}
          >
            {product.specs.layerHeight}
          </span>
          {product.specs.infillDensity && (
            <span
              className={`hidden sm:inline-block px-2.5 py-1 rounded-full text-[10px] font-mono lowercase backdrop-blur-md border ${
                isLight
                  ? 'bg-white/90 text-neutral-700 border-neutral-200 shadow-xs'
                  : 'bg-black/60 text-neutral-300 border-white/10'
              }`}
            >
              {product.specs.infillDensity.split(' ')[0]}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 z-20 p-2 rounded-full backdrop-blur-md border transition-colors ${
            isLight
              ? 'bg-white/90 text-neutral-500 hover:text-black border-neutral-200 shadow-xs'
              : 'bg-black/60 text-neutral-400 hover:text-white border-white/10'
          }`}
          title={isSaved ? 'Remove from Saved' : 'Save to Vault'}
        >
          <Heart
            className={`w-3.5 h-3.5 ${
              isSaved
                ? isLight
                  ? 'fill-black text-black'
                  : 'fill-white text-white'
                : ''
            }`}
          />
        </button>

        {/* Product Image */}
        <Link href={`/shop/${product.id}`} className="block w-full h-full relative">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        </Link>

        {/* Hover Quick Actions */}
        <div className="absolute inset-x-3 bottom-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
          {onQuickView && (
            <button
              onClick={() => onQuickView(product)}
              className={`flex-1 py-2 rounded-lg backdrop-blur-md border text-xs font-medium lowercase flex items-center justify-center gap-1.5 transition-colors ${
                isLight
                  ? 'bg-white/95 text-neutral-900 border-neutral-300 hover:bg-black hover:text-white'
                  : 'bg-black/85 text-white border-white/15 hover:bg-black'
              }`}
            >
              <Eye className="w-3.5 h-3.5 opacity-70" />
              <span>inspect 360</span>
            </button>
          )}

          <button
            onClick={handleQuickAdd}
            className={`px-3 py-2 rounded-lg transition-colors flex items-center justify-center ${
              isLight
                ? 'bg-black text-white hover:bg-neutral-800'
                : 'bg-white text-neutral-950 hover:bg-neutral-200'
            }`}
            title="Add to cart"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="pt-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Category */}
          <span
            className={`text-[11px] font-mono lowercase block mb-1 ${
              isLight ? 'text-neutral-500' : 'text-neutral-500'
            }`}
          >
            {product.category}
          </span>

          {/* Title */}
          <Link href={`/shop/${product.id}`} className="block">
            <h3
              className={`text-base sm:text-lg font-bold tracking-tight lowercase transition-colors ${
                isLight
                  ? 'text-black group-hover:text-neutral-600'
                  : 'text-white group-hover:text-neutral-300'
              }`}
            >
              {product.name}
            </h3>
          </Link>

          {/* Subtitle / Tagline */}
          <p
            className={`text-xs lowercase line-clamp-1 mt-0.5 ${
              isLight ? 'text-neutral-600' : 'text-neutral-400'
            }`}
          >
            {product.tagline}
          </p>
        </div>

        {/* Finish Swatches & Price */}
        <div
          className={`mt-4 pt-3 border-t flex items-center justify-between ${
            isLight ? 'border-neutral-200' : 'border-neutral-800/80'
          }`}
        >
          {/* Material Swatch Dots */}
          <div className="flex items-center gap-1.5">
            {product.materials.slice(0, 4).map((m) => (
              <button
                key={m.name}
                onClick={() => setSelectedMat(m.name)}
                title={m.name}
                className={`w-3.5 h-3.5 rounded-full border transition-transform ${
                  selectedMat === m.name
                    ? isLight
                      ? 'border-black scale-110 shadow-xs'
                      : 'border-white scale-110'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
                style={{ backgroundColor: m.color }}
              />
            ))}
          </div>

          {/* Price */}
          <div className="text-right">
            <span
              className={`text-sm sm:text-base font-bold font-mono ${
                isLight ? 'text-black' : 'text-white'
              }`}
            >
              {formatPrice(calculatedPrice)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

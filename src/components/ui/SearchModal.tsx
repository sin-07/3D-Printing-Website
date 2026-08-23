'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PRODUCTS } from '@/data/products';
import { useCurrency } from '@/context/CurrencyContext';
import { Search, X, Sparkles, ArrowRight, Layers } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const { formatPrice } = useCurrency();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // toggle handled by parent
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredProducts = PRODUCTS.filter((p) => {
    const q = query.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.tagline.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  });

  const popularTags = ['Mythology', 'Cyberpunk', '16K SLA', 'Titanium', 'Busts', 'Limited Run'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20 flex items-start justify-center">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-obsidian-950/85 backdrop-blur-md transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-obsidian-900 border border-gold-500/30 rounded-2xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-obsidian-700 flex items-center gap-3 bg-obsidian-950/80">
          <Search className="w-5 h-5 text-gold-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search by statue name, category, or lore..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent text-foreground placeholder-titanium-500 text-sm md:text-base focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-titanium-400 hover:text-white p-1">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline px-2 py-0.5 text-[10px] font-mono text-titanium-400 bg-obsidian-800 rounded border border-obsidian-700">
            ESC
          </kbd>
        </div>

        {/* Quick Tag Recommendations */}
        <div className="px-4 py-2.5 bg-obsidian-850 border-b border-obsidian-800 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-titanium-400 text-[11px] font-mono whitespace-nowrap">TOP FILTERS:</span>
          {popularTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              className="px-2.5 py-1 rounded-full bg-obsidian-800 text-titanium-300 hover:text-gold-300 hover:bg-obsidian-700 transition-colors whitespace-nowrap text-[11px]"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-2">
          {filteredProducts.length === 0 ? (
            <div className="py-12 text-center text-titanium-400">
              <Layers className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No sculptures matching &quot;{query}&quot;</p>
              <p className="text-xs text-titanium-500 mt-1">
                Try searching for &quot;Seraphim&quot;, &quot;Ares&quot;, or &quot;Cyberpunk&quot;
              </p>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/shop/${product.id}`}
                onClick={onClose}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-obsidian-800/80 border border-transparent hover:border-gold-500/20 transition-all group"
              >
                <div className="w-14 h-14 rounded-lg bg-obsidian-950 overflow-hidden border border-obsidian-700 flex-shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs sm:text-sm font-bold text-foreground truncate group-hover:text-gold-300 transition-colors">
                      {product.name}
                    </h4>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold-500/10 text-gold-400 border border-gold-500/20 font-mono">
                      {product.rarity}
                    </span>
                  </div>
                  <p className="text-xs text-titanium-400 truncate mt-0.5">{product.tagline}</p>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="text-xs sm:text-sm font-mono font-bold text-gold-400 block">
                    {formatPrice(product.basePrice)}
                  </span>
                  <span className="text-[10px] text-titanium-500 font-mono flex items-center justify-end gap-1 group-hover:text-gold-400 transition-colors">
                    <span>Inspect</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-obsidian-950 border-t border-obsidian-800 text-center text-[11px] text-titanium-400 font-mono flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-gold-400" />
          <span>All sculptures printed in ultra-precision 16K SLA Photopolymer with Certificate</span>
        </div>
      </div>
    </div>
  );
}

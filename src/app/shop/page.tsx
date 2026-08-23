'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PRODUCTS, CATEGORIES, STANDARD_MATERIALS, STANDARD_SCALES } from '@/data/products';
import { Product, Category, MaterialFinish, Scale } from '@/types';
import ProductCard from '@/components/product/ProductCard';
import QuickViewModal from '@/components/ui/QuickViewModal';
import RevealText from '@/components/animations/RevealText';
import {
  Filter,
  SlidersHorizontal,
  Grid3X3,
  LayoutGrid,
  Search,
  RotateCcw,
  Sparkles,
  X,
  ChevronDown,
} from 'lucide-react';

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get('category') as Category | null;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCat || 'All');
  const [selectedScale, setSelectedScale] = useState<string>('All');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('All');
  const [selectedRarity, setSelectedRarity] = useState<string>('All');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'stock'>('featured');
  const [viewMode, setViewMode] = useState<'grid3' | 'grid4'>('grid3');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter logic
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // Category filter
      if (selectedCategory !== 'All' && product.category !== selectedCategory) {
        return false;
      }
      // Scale filter
      if (selectedScale !== 'All' && !product.scales.some((s) => s.scale === selectedScale)) {
        return false;
      }
      // Material filter
      if (selectedMaterial !== 'All' && !product.materials.some((m) => m.name === selectedMaterial)) {
        return false;
      }
      // Rarity filter
      if (selectedRarity !== 'All' && product.rarity !== selectedRarity) {
        return false;
      }
      // In Stock filter
      if (inStockOnly && product.stockLeft <= 0) {
        return false;
      }
      // Max price
      if (product.basePrice > maxPrice) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesLore = product.lore.toLowerCase().includes(q);
        const matchesTagline = product.tagline.toLowerCase().includes(q);
        if (!matchesName && !matchesLore && !matchesTagline) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.basePrice - b.basePrice;
      if (sortBy === 'price-desc') return b.basePrice - a.basePrice;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'stock') return a.stockLeft - b.stockLeft;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [
    selectedCategory,
    selectedScale,
    selectedMaterial,
    selectedRarity,
    inStockOnly,
    maxPrice,
    searchQuery,
    sortBy,
  ]);

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedScale('All');
    setSelectedMaterial('All');
    setSelectedRarity('All');
    setInStockOnly(false);
    setMaxPrice(1000);
    setSearchQuery('');
    setSortBy('featured');
  };

  const hasActiveFilters =
    selectedCategory !== 'All' ||
    selectedScale !== 'All' ||
    selectedMaterial !== 'All' ||
    selectedRarity !== 'All' ||
    inStockOnly ||
    maxPrice < 1000 ||
    searchQuery !== '';

  return (
    <div className="min-h-screen bg-obsidian-950 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-10 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-mono mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>THE COMPLETE VAULT</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-bold text-foreground">
            Masterwork Collectibles
          </h1>
          <p className="text-xs sm:text-sm text-titanium-400 mt-2 max-w-2xl">
            Browse our limited-edition 16K SLA resin sculptures, each serialized with NFC authenticity and hand-finished with gold leaf and cold-cast metals.
          </p>
        </div>

        {/* Controls Bar */}
        <div className="p-4 rounded-2xl bg-obsidian-900/80 border border-obsidian-800 backdrop-blur-xl mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-titanium-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search sculptures & lore..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-obsidian-950 border border-obsidian-700 rounded-xl text-foreground placeholder-titanium-500 focus:outline-none focus:border-gold-500/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-titanium-400 hover:text-white p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Center Category Pills */}
          <div className="hidden lg:flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                selectedCategory === 'All'
                  ? 'bg-gold-500 text-obsidian-950 font-bold'
                  : 'bg-obsidian-800 text-titanium-300 hover:text-white'
              }`}
            >
              All Universes
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-gold-500 text-obsidian-950 font-bold'
                    : 'bg-obsidian-800 text-titanium-300 hover:text-white'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Right Actions: Sort, Layout, Mobile Filter Trigger */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="md:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl bg-obsidian-950 border border-obsidian-700 text-xs text-gold-400 font-semibold"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>

            {/* Sort Select */}
            <div className="relative flex-1 sm:flex-initial">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full sm:w-44 px-3 py-2 text-xs bg-obsidian-950 border border-obsidian-700 rounded-xl text-foreground focus:outline-none focus:border-gold-500/50 appearance-none font-mono cursor-pointer"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Collector Rating</option>
                <option value="stock">Low Stock First</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-titanium-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Grid Toggle */}
            <div className="hidden sm:flex items-center gap-1 p-1 rounded-xl bg-obsidian-950 border border-obsidian-700">
              <button
                onClick={() => setViewMode('grid3')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  viewMode === 'grid3' ? 'bg-gold-500 text-obsidian-950' : 'text-titanium-400 hover:text-white'
                }`}
                title="3-Column Detailed Grid"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid4')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  viewMode === 'grid4' ? 'bg-gold-500 text-obsidian-950' : 'text-titanium-400 hover:text-white'
                }`}
                title="4-Column Compact Grid"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Shop Layout (Sidebar Filters + Products Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className={`md:col-span-3 space-y-6 ${mobileFilterOpen ? 'block' : 'hidden md:block'}`}>
            <div className="p-6 rounded-2xl bg-obsidian-900/70 border border-obsidian-800 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-obsidian-800">
                <span className="text-xs font-mono font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 text-gold-400" />
                  FILTER ARCHIVE
                </span>
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="text-[11px] font-mono text-gold-400 hover:text-gold-300 flex items-center gap-1 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                )}
              </div>

              {/* Universe Category */}
              <div>
                <label className="text-xs font-mono font-bold text-titanium-300 block mb-2.5 uppercase">
                  UNIVERSE
                </label>
                <div className="space-y-1.5">
                  <button
                    onClick={() => setSelectedCategory('All')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-mono flex items-center justify-between transition-colors ${
                      selectedCategory === 'All'
                        ? 'bg-gold-500/20 text-gold-300 font-bold border border-gold-500/40'
                        : 'text-titanium-400 hover:bg-obsidian-800 hover:text-white'
                    }`}
                  >
                    <span>All Universes</span>
                    <span className="text-[10px]">{PRODUCTS.length}</span>
                  </button>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-mono flex items-center justify-between transition-colors ${
                        selectedCategory === cat.id
                          ? 'bg-gold-500/20 text-gold-300 font-bold border border-gold-500/40'
                          : 'text-titanium-400 hover:bg-obsidian-800 hover:text-white'
                      }`}
                    >
                      <span className="truncate">{cat.name}</span>
                      <span className="text-[10px]">
                        {PRODUCTS.filter((p) => p.category === cat.id).length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sculpture Scale */}
              <div className="pt-4 border-t border-obsidian-800">
                <label className="text-xs font-mono font-bold text-titanium-300 block mb-2.5 uppercase">
                  SCALE RATIO
                </label>
                <div className="space-y-1.5">
                  <button
                    onClick={() => setSelectedScale('All')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                      selectedScale === 'All'
                        ? 'bg-gold-500/20 text-gold-300 font-bold border border-gold-500/40'
                        : 'text-titanium-400 hover:bg-obsidian-800 hover:text-white'
                    }`}
                  >
                    All Scales
                  </button>
                  {STANDARD_SCALES.map((s) => (
                    <button
                      key={s.scale}
                      onClick={() => setSelectedScale(s.scale)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-mono flex items-center justify-between transition-colors ${
                        selectedScale === s.scale
                          ? 'bg-gold-500/20 text-gold-300 font-bold border border-gold-500/40'
                          : 'text-titanium-400 hover:bg-obsidian-800 hover:text-white'
                      }`}
                    >
                      <span>{s.scale}</span>
                      <span className="text-[10px] text-titanium-500">{s.heightMm}mm</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Rarity Tier */}
              <div className="pt-4 border-t border-obsidian-800">
                <label className="text-xs font-mono font-bold text-titanium-300 block mb-2.5 uppercase">
                  RARITY TIER
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {['All', 'Mythic', 'Legendary', 'Atelier Exclusive'].map((r) => (
                    <button
                      key={r}
                      onClick={() => setSelectedRarity(r)}
                      className={`px-2 py-1.5 rounded-lg text-[11px] font-mono text-center transition-colors ${
                        selectedRarity === r
                          ? 'bg-gold-500/20 text-gold-300 font-bold border border-gold-500/40'
                          : 'bg-obsidian-950 text-titanium-400 hover:text-white border border-obsidian-800'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Slider */}
              <div className="pt-4 border-t border-obsidian-800">
                <div className="flex justify-between items-center text-xs font-mono mb-2">
                  <span className="font-bold text-titanium-300 uppercase">MAX BUDGET</span>
                  <span className="text-gold-400 font-bold">${maxPrice} USD</span>
                </div>
                <input
                  type="range"
                  min="400"
                  max="1000"
                  step="20"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-gold-500 cursor-pointer"
                />
              </div>

              {/* In-Stock Toggle */}
              <div className="pt-4 border-t border-obsidian-800">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="rounded border-obsidian-700 text-gold-500 focus:ring-gold-500/20"
                  />
                  <span className="text-xs font-mono text-titanium-300">Ready to Ship Only</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Products Grid Area */}
          <main className="md:col-span-9">
            {filteredProducts.length === 0 ? (
              <div className="p-12 rounded-2xl bg-obsidian-900/60 border border-obsidian-800 text-center space-y-4">
                <Sparkles className="w-10 h-10 text-gold-400 mx-auto opacity-40" />
                <h3 className="text-lg font-bold text-foreground">No Masterpieces Match Your Filter</h3>
                <p className="text-xs text-titanium-400 max-w-sm mx-auto">
                  Try broadening your price range or resetting category filters to view all available serialized pieces.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2.5 rounded-full bg-gold-500 text-obsidian-950 font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-gold-glow"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div
                className={`grid gap-6 ${
                  viewMode === 'grid3'
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                }`}
              >
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={(p) => setQuickViewProduct(p)}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-obsidian-950 pt-32 text-center text-gold-400">Loading Atelier Vault...</div>}>
      <ShopContent />
    </Suspense>
  );
}

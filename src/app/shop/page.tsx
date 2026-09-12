'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PRODUCTS, CATEGORIES, STANDARD_MATERIALS, STANDARD_SCALES } from '@/data/products';
import { Product, Category, MaterialFinish, Scale } from '@/types';
import ProductCard from '@/components/product/ProductCard';
import QuickViewModal from '@/components/ui/QuickViewModal';
import {
  Filter,
  SlidersHorizontal,
  Grid3X3,
  LayoutGrid,
  Search,
  RotateCcw,
  X,
  ChevronDown,
  Cpu,
  Layers,
  Wrench,
  CheckCircle2,
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
  const [maxPrice, setMaxPrice] = useState<number>(200);
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
        const matchesMaterial = product.specs.baseMaterial.toLowerCase().includes(q);
        if (!matchesName && !matchesLore && !matchesTagline && !matchesMaterial) return false;
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
    setMaxPrice(200);
    setSearchQuery('');
    setSortBy('featured');
  };

  const hasActiveFilters =
    selectedCategory !== 'All' ||
    selectedScale !== 'All' ||
    selectedMaterial !== 'All' ||
    selectedRarity !== 'All' ||
    inStockOnly ||
    maxPrice < 200 ||
    searchQuery !== '';

  return (
    <div className="min-h-screen bg-neutral-950 text-white pt-28 pb-24 select-none">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Page Header (makewithloop.com style) */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-mono lowercase text-neutral-300 mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>additive engineering catalog</span>
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-[-0.04em] lowercase text-white leading-none">
            precision 3d components.
          </h1>
          <p className="mt-4 text-base sm:text-lg text-neutral-400 font-normal lowercase leading-relaxed max-w-2xl">
            browse 3d printed functional mechanisms, generative aerospace airframes, rapid tooling soft jaws, and high-performance composite thermoplastics.
          </p>
        </div>

        {/* Controls Bar */}
        <div className="p-3 sm:p-4 rounded-3xl bg-neutral-900/60 border border-neutral-800 backdrop-blur-xl mb-8 flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="search 3d components, filaments & specs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-8 py-2 rounded-full text-xs bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors lowercase"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Center Category Pills */}
          <div className="hidden lg:flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap lowercase ${
                selectedCategory === 'All'
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              all domains
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap lowercase ${
                  selectedCategory === cat.id
                    ? 'bg-white text-black font-semibold shadow-sm'
                    : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
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
              className="md:hidden flex items-center gap-1.5 px-3 py-2 rounded-full bg-neutral-950 border border-neutral-800 text-xs text-white font-medium lowercase"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>filters</span>
            </button>

            {/* Sort Select */}
            <div className="relative flex-1 sm:flex-initial">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full sm:w-44 px-3.5 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-full text-white focus:outline-none focus:border-white appearance-none font-mono lowercase cursor-pointer"
              >
                <option value="featured">featured first</option>
                <option value="price-asc">price: low to high</option>
                <option value="price-desc">price: high to low</option>
                <option value="rating">highest rated</option>
                <option value="stock">low stock first</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Grid Toggle */}
            <div className="hidden sm:flex items-center gap-1 p-1 rounded-full bg-neutral-950 border border-neutral-800">
              <button
                onClick={() => setViewMode('grid3')}
                className={`p-1.5 rounded-full text-xs transition-colors ${
                  viewMode === 'grid3' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
                }`}
                title="3-Column Grid"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('grid4')}
                className={`p-1.5 rounded-full text-xs transition-colors ${
                  viewMode === 'grid4' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
                }`}
                title="4-Column Grid"
              >
                <Grid3X3 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Shop Layout (Sidebar Filters + Products Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <aside className={`md:col-span-3 space-y-6 ${mobileFilterOpen ? 'block' : 'hidden md:block'}`}>
            <div className="p-6 rounded-3xl bg-neutral-900/50 border border-neutral-800 space-y-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                <span className="text-xs font-mono text-neutral-400 lowercase tracking-widest flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 text-emerald-400" />
                  filter specs
                </span>
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="text-[11px] font-mono text-neutral-400 hover:text-white flex items-center gap-1 transition-colors lowercase"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>reset</span>
                  </button>
                )}
              </div>

              {/* Engineering Domain */}
              <div>
                <label className="text-xs font-mono text-neutral-400 block mb-2.5 lowercase">
                  engineering domain
                </label>
                <div className="space-y-1.5">
                  <button
                    onClick={() => setSelectedCategory('All')}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-mono flex items-center justify-between transition-colors lowercase ${
                      selectedCategory === 'All'
                        ? 'bg-white text-black font-semibold'
                        : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                    }`}
                  >
                    <span>all domains</span>
                    <span className="text-[10px]">{PRODUCTS.length}</span>
                  </button>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-mono flex items-center justify-between transition-colors lowercase ${
                        selectedCategory === cat.id
                          ? 'bg-white text-black font-semibold'
                          : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
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

              {/* Engineering Filament Material */}
              <div className="pt-4 border-t border-neutral-800">
                <label className="text-xs font-mono text-neutral-400 block mb-2.5 lowercase">
                  engineering filament
                </label>
                <div className="space-y-1.5">
                  <button
                    onClick={() => setSelectedMaterial('All')}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-mono transition-colors lowercase ${
                      selectedMaterial === 'All'
                        ? 'bg-white text-black font-semibold'
                        : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                    }`}
                  >
                    all materials
                  </button>
                  {STANDARD_MATERIALS.map((mat) => (
                    <button
                      key={mat.name}
                      onClick={() => setSelectedMaterial(mat.name)}
                      className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-2 transition-colors lowercase ${
                        selectedMaterial === mat.name
                          ? 'bg-white text-black font-semibold'
                          : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                      }`}
                    >
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: mat.color }}
                      />
                      <span className="truncate">{mat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Fabrication Scale */}
              <div className="pt-4 border-t border-neutral-800">
                <label className="text-xs font-mono text-neutral-400 block mb-2.5 lowercase">
                  fabrication scale
                </label>
                <div className="space-y-1.5">
                  <button
                    onClick={() => setSelectedScale('All')}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-mono transition-colors lowercase ${
                      selectedScale === 'All'
                        ? 'bg-white text-black font-semibold'
                        : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                    }`}
                  >
                    all scales
                  </button>
                  {STANDARD_SCALES.map((s) => (
                    <button
                      key={s.scale}
                      onClick={() => setSelectedScale(s.scale)}
                      className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-mono flex items-center justify-between transition-colors lowercase ${
                        selectedScale === s.scale
                          ? 'bg-white text-black font-semibold'
                          : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                      }`}
                    >
                      <span>{s.scale}</span>
                      <span className="text-[10px] text-neutral-500">{s.heightMm}mm</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Slider */}
              <div className="pt-4 border-t border-neutral-800">
                <div className="flex justify-between items-center text-xs font-mono mb-2 lowercase">
                  <span className="text-neutral-400">max component price</span>
                  <span className="text-white font-bold">${maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="200"
                  step="5"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-white cursor-pointer h-2 bg-neutral-800 rounded-lg"
                />
              </div>

              {/* In-Stock Toggle */}
              <div className="pt-4 border-t border-neutral-800">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="rounded border-neutral-700 bg-neutral-950 accent-white"
                  />
                  <span className="text-xs font-mono text-neutral-400 lowercase">
                    in-stock / ready to ship
                  </span>
                </label>
              </div>
            </div>
          </aside>

          {/* Products Grid Area */}
          <main className="md:col-span-9">
            {filteredProducts.length === 0 ? (
              <div className="p-12 sm:p-16 rounded-3xl bg-neutral-900/40 border border-neutral-800 text-center space-y-4">
                <Cpu className="w-10 h-10 text-neutral-500 mx-auto opacity-50" />
                <h3 className="text-lg font-bold text-white lowercase">
                  no components match your active filter
                </h3>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto lowercase leading-relaxed">
                  try broadening your maximum price limit or resetting the domain filters to see all available functional parts.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2.5 rounded-full bg-white text-black font-semibold text-xs lowercase tracking-tight hover:bg-neutral-200 transition-colors"
                >
                  reset all filters
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
    <Suspense
      fallback={
        <div className="min-h-screen bg-neutral-950 pt-32 text-center text-xs font-mono text-neutral-400">
          loading engineering catalog...
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}

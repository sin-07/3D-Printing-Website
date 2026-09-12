'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PRODUCTS, CATEGORIES, STANDARD_MATERIALS, STANDARD_SCALES } from '@/data/products';
import { Product, Category, MaterialFinish, Scale } from '@/types';
import ProductCard from '@/components/product/ProductCard';
import QuickViewModal from '@/components/ui/QuickViewModal';
import { useCurrency } from '@/context/CurrencyContext';
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
  Truck,
  ShieldCheck,
  FileText,
} from 'lucide-react';

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get('category') as Category | null;
  const { formatPrice } = useCurrency();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCat || 'All');
  const [selectedScale, setSelectedScale] = useState<string>('All');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('All');
  const [selectedRarity, setSelectedRarity] = useState<string>('All');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(250);
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
    setMaxPrice(250);
    setSearchQuery('');
    setSortBy('featured');
  };

  const hasActiveFilters =
    selectedCategory !== 'All' ||
    selectedScale !== 'All' ||
    selectedMaterial !== 'All' ||
    selectedRarity !== 'All' ||
    inStockOnly ||
    maxPrice < 250 ||
    searchQuery !== '';

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-neutral-900 pt-28 pb-24 relative overflow-hidden select-none">
      {/* 1. Subtle CAD Blueprint Grid Overlay (Prevents plain "sada" look) */}
      <div className="absolute inset-0 bg-blueprint-grid opacity-60 pointer-events-none [mask-image:radial-gradient(ellipse_85%_65%_at_50%_15%,#000_50%,transparent_100%)] -z-10" />

      {/* 2. Subtle Ambient Engineering Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-96 bg-gradient-to-b from-amber-500/[0.04] via-emerald-500/[0.02] to-transparent pointer-events-none blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        {/* Technical Coordinate & Hub Banner */}
        <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 border-b border-neutral-200/80 pb-3 mb-10 lowercase select-none">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>[inventory: aetheris precision components // 8 specifications listed]</span>
          </div>
          <span className="hidden sm:inline-block">
            [logistics: pan-india express courier air network active]
          </span>
        </div>

        {/* Page Header (makewithloop.com white style with Pan-India context) */}
        <div className="max-w-3xl mb-12">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-neutral-200 text-xs font-mono lowercase text-neutral-800 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>pan-india additive manufacturing catalog</span>
            </div>
            <span className="px-2.5 py-1.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200 text-[11px] font-mono lowercase shadow-2xs">
              🇮🇳 made in india
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-[-0.04em] lowercase text-neutral-950 leading-none">
            precision 3d components.
          </h1>

          <p className="mt-4 text-base sm:text-lg text-neutral-600 font-normal lowercase leading-relaxed max-w-2xl">
            high-speed corexy &amp; 16k stereolithography precision. functional mechanisms, aerospace lattices, and rapid tooling soft jaws dispatched across india.
          </p>

          {/* India Trust Badges */}
          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-mono text-neutral-700 lowercase pt-2">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-neutral-200 shadow-2xs">
              <Truck className="w-3.5 h-3.5 text-neutral-900" />
              pan-india express shipping (bluedart / delhivery)
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-neutral-200 shadow-2xs">
              <FileText className="w-3.5 h-3.5 text-neutral-900" />
              gst b2b tax invoice compliant
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-neutral-200 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-neutral-900" />
              upi &amp; netbanking accepted
            </span>
          </div>
        </div>

        {/* Controls Bar (Clean Elevated Surface with Blueprint Aesthetic) */}
        <div className="p-3 sm:p-4 rounded-3xl bg-white border border-neutral-200 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] backdrop-blur-xl mb-8 flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="search 3d components, filaments & specs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-8 py-2 rounded-full text-xs bg-white border border-neutral-200 text-black placeholder-neutral-400 focus:outline-none focus:border-black transition-colors lowercase"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black p-1"
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
                  ? 'bg-black text-white font-semibold shadow-xs'
                  : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
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
                    ? 'bg-black text-white font-semibold shadow-xs'
                    : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
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
              className="md:hidden flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white border border-neutral-200 text-xs text-black font-medium lowercase shadow-xs"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>filters</span>
            </button>

            {/* Sort Select */}
            <div className="relative flex-1 sm:flex-initial">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full sm:w-44 px-3.5 py-2 text-xs bg-white border border-neutral-200 rounded-full text-black focus:outline-none focus:border-black appearance-none font-mono lowercase cursor-pointer shadow-xs"
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
            <div className="hidden sm:flex items-center gap-1 p-1 rounded-full bg-white border border-neutral-200 shadow-xs">
              <button
                onClick={() => setViewMode('grid3')}
                className={`p-1.5 rounded-full text-xs transition-colors ${
                  viewMode === 'grid3' ? 'bg-black text-white' : 'text-neutral-500 hover:text-black'
                }`}
                title="3-Column Grid"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('grid4')}
                className={`p-1.5 rounded-full text-xs transition-colors ${
                  viewMode === 'grid4' ? 'bg-black text-white' : 'text-neutral-500 hover:text-black'
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
            <div className="p-6 rounded-3xl bg-white border border-neutral-200 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
                <span className="text-xs font-mono text-neutral-500 lowercase tracking-widest flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 text-black" />
                  filter specs
                </span>
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="text-[11px] font-mono text-neutral-600 hover:text-black flex items-center gap-1 transition-colors lowercase"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>reset</span>
                  </button>
                )}
              </div>

              {/* Engineering Domain */}
              <div>
                <label className="text-xs font-mono text-neutral-500 block mb-2.5 lowercase">
                  engineering domain
                </label>
                <div className="space-y-1.5">
                  <button
                    onClick={() => setSelectedCategory('All')}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-mono flex items-center justify-between transition-colors lowercase ${
                      selectedCategory === 'All'
                        ? 'bg-black text-white font-semibold'
                        : 'text-neutral-700 hover:bg-neutral-100 hover:text-black'
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
                          ? 'bg-black text-white font-semibold'
                          : 'text-neutral-700 hover:bg-neutral-100 hover:text-black'
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
              <div className="pt-4 border-t border-neutral-200">
                <label className="text-xs font-mono text-neutral-500 block mb-2.5 lowercase">
                  engineering filament
                </label>
                <div className="space-y-1.5">
                  <button
                    onClick={() => setSelectedMaterial('All')}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-mono transition-colors lowercase ${
                      selectedMaterial === 'All'
                        ? 'bg-black text-white font-semibold'
                        : 'text-neutral-700 hover:bg-neutral-100 hover:text-black'
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
                          ? 'bg-black text-white font-semibold'
                          : 'text-neutral-700 hover:bg-neutral-100 hover:text-black'
                      }`}
                    >
                      <span
                        className="w-2 h-2 rounded-full shrink-0 border border-neutral-300"
                        style={{ backgroundColor: mat.color }}
                      />
                      <span className="truncate">{mat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Fabrication Scale */}
              <div className="pt-4 border-t border-neutral-200">
                <label className="text-xs font-mono text-neutral-500 block mb-2.5 lowercase">
                  fabrication scale
                </label>
                <div className="space-y-1.5">
                  <button
                    onClick={() => setSelectedScale('All')}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-mono transition-colors lowercase ${
                      selectedScale === 'All'
                        ? 'bg-black text-white font-semibold'
                        : 'text-neutral-700 hover:bg-neutral-100 hover:text-black'
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
                          ? 'bg-black text-white font-semibold'
                          : 'text-neutral-700 hover:bg-neutral-100 hover:text-black'
                      }`}
                    >
                      <span>{s.scale}</span>
                      <span className="text-[10px] text-neutral-400">{s.heightMm}mm H</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Slider */}
              <div className="pt-4 border-t border-neutral-200">
                <div className="flex justify-between items-center text-xs font-mono mb-2 lowercase">
                  <span className="text-neutral-500">max price</span>
                  <span className="text-black font-bold">{formatPrice(maxPrice)}</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="250"
                  step="5"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-black cursor-pointer h-2 bg-neutral-200 rounded-lg"
                />
              </div>

              {/* Pan-India Ready to Ship Toggle */}
              <div className="pt-4 border-t border-neutral-200">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="rounded border-neutral-300 bg-white accent-black"
                  />
                  <span className="text-xs font-mono text-neutral-700 lowercase">
                    ready to dispatch (24-48h pan-india)
                  </span>
                </label>
              </div>
            </div>
          </aside>

          {/* Products Grid Area */}
          <main className="md:col-span-9">
            {filteredProducts.length === 0 ? (
              <div className="p-12 sm:p-16 rounded-3xl bg-neutral-50 border border-neutral-200 text-center space-y-4">
                <Cpu className="w-10 h-10 text-neutral-400 mx-auto" />
                <h3 className="text-lg font-bold text-black lowercase">
                  no components match your active filter
                </h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto lowercase leading-relaxed">
                  try broadening your maximum price limit or resetting the domain filters to see all available functional parts.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2.5 rounded-full bg-black text-white font-semibold text-xs lowercase tracking-tight hover:bg-neutral-800 transition-colors"
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
                    theme="light"
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
        <div className="min-h-screen bg-white text-black pt-32 text-center text-xs font-mono text-neutral-500">
          loading engineering catalog...
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}

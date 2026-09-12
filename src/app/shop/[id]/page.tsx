'use client';

import React, { useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import Link from 'next/link';
import { PRODUCTS } from '@/data/products';
import { MaterialFinish, Scale } from '@/types';
import ProductGallery from '@/components/product/ProductGallery';
import Configurator from '@/components/product/Configurator';
import ProductCard from '@/components/product/ProductCard';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';
import {
  ShieldCheck,
  Box,
  Sparkles,
  Layers,
  Award,
  Cpu,
  Star,
  CheckCircle2,
  ChevronRight,
  RotateCcw,
  Plane,
  Truck,
  FileText,
  Clock,
  Zap,
  ShoppingBag,
  Sliders,
} from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params?.id as string;
  const { addItem, openCartDrawer } = useCart();
  const { formatPrice } = useCurrency();

  const product = PRODUCTS.find((p) => p.id === productId);

  const [selectedMaterial, setSelectedMaterial] = useState<MaterialFinish>(
    (product?.materials[0]?.name as MaterialFinish) || 'Carbon Fiber PA-CF'
  );
  const [selectedScale, setSelectedScale] = useState<Scale>(
    (product?.scales[0]?.scale as Scale) || '1:1 True Scale'
  );
  const [activeTab, setActiveTab] = useState<'slicing' | 'metrology' | 'package' | 'reviews'>('slicing');

  if (!product) {
    return notFound();
  }

  const matObj =
    product.materials.find((m) => m.name === selectedMaterial) || product.materials[0];
  const scaleObj =
    product.scales.find((s) => s.scale === selectedScale) || product.scales[0];

  const calculatedUnitPrice = Math.round(
    product.basePrice * (matObj?.priceMultiplier || 1) * (scaleObj?.priceMultiplier || 1)
  );

  const relatedProducts = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 3);

  const handleMobileAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      image: product.image,
      category: product.category,
      selectedMaterial,
      selectedScale,
      unitPrice: calculatedUnitPrice,
      quantity: 1,
      editionNumber: Math.floor(Math.random() * product.editionSize) + 1,
    });
    openCartDrawer();
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-neutral-900 pt-24 sm:pt-28 pb-32 relative overflow-hidden select-none">
      {/* 1. Subtle CAD Blueprint Grid Overlay */}
      <div className="absolute inset-0 bg-blueprint-grid opacity-60 pointer-events-none [mask-image:radial-gradient(ellipse_85%_65%_at_50%_15%,#000_50%,transparent_100%)] -z-10" />

      {/* 2. Subtle Ambient Engineering Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-96 bg-gradient-to-b from-amber-500/[0.04] via-emerald-500/[0.02] to-transparent pointer-events-none blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Technical Coordinate & Hub Banner */}
        <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 border-b border-neutral-200/80 pb-3 mb-6 lowercase select-none">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              [part telemetry: {product.id} // cmm certified batch: BLR-01 // iso 2768-m]
            </span>
          </div>
          <span className="hidden sm:inline-block">
            [pan-india express air network active // bluedart 24-48h]
          </span>
        </div>

        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-mono text-neutral-500 mb-8 overflow-x-auto whitespace-nowrap scrollbar-none">
          <Link href="/" className="hover:text-neutral-900 transition-colors">
            home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-300" />
          <Link href="/shop" className="hover:text-neutral-900 transition-colors">
            catalog
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-300" />
          <Link
            href={`/shop?category=${encodeURIComponent(product.category)}`}
            className="hover:text-neutral-900 transition-colors"
          >
            {product.category.toLowerCase()}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-900" />
          <span className="text-neutral-950 font-bold truncate max-w-[200px] sm:max-w-none">
            {product.name.toLowerCase()}
          </span>
        </nav>

        {/* Top Product Section: Gallery + Configurator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-16">
          {/* Left: High-Performance CAD Product Gallery */}
          <div className="lg:col-span-7">
            <ProductGallery
              images={product.galleryImages}
              productName={product.name}
              selectedMaterial={selectedMaterial}
            />
          </div>

          {/* Right: Precision Engineering Configurator */}
          <div className="lg:col-span-5">
            <Configurator
              product={product}
              selectedMaterial={selectedMaterial}
              setSelectedMaterial={setSelectedMaterial}
              selectedScale={selectedScale}
              setSelectedScale={setSelectedScale}
            />
          </div>
        </div>

        {/* Middle Section: Engineering Deep-Dive Tabs */}
        <div className="p-6 sm:p-10 rounded-3xl bg-white border border-neutral-200/90 shadow-sm mb-16">
          {/* Tab Selection Header */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 border-b border-neutral-200/80 mb-8 scrollbar-none">
            <button
              onClick={() => setActiveTab('slicing')}
              className={`px-4 py-2 rounded-2xl text-xs font-mono lowercase transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'slicing'
                  ? 'bg-neutral-950 text-white font-bold shadow-xs'
                  : 'bg-neutral-100 text-neutral-600 hover:text-neutral-950 hover:bg-neutral-200/60'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>1. slicing &amp; toolpath profile</span>
            </button>

            <button
              onClick={() => setActiveTab('metrology')}
              className={`px-4 py-2 rounded-2xl text-xs font-mono lowercase transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'metrology'
                  ? 'bg-neutral-950 text-white font-bold shadow-xs'
                  : 'bg-neutral-100 text-neutral-600 hover:text-neutral-950 hover:bg-neutral-200/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>2. mechanical metrology &amp; gd&amp;t</span>
            </button>

            <button
              onClick={() => setActiveTab('package')}
              className={`px-4 py-2 rounded-2xl text-xs font-mono lowercase transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'package'
                  ? 'bg-neutral-950 text-white font-bold shadow-xs'
                  : 'bg-neutral-100 text-neutral-600 hover:text-neutral-950 hover:bg-neutral-200/60'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>3. industrial packaging kit</span>
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-4 py-2 rounded-2xl text-xs font-mono lowercase transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'reviews'
                  ? 'bg-neutral-950 text-white font-bold shadow-xs'
                  : 'bg-neutral-100 text-neutral-600 hover:text-neutral-950 hover:bg-neutral-200/60'
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>4. verified engineering reviews ({product.reviews.length})</span>
            </button>
          </div>

          {/* Tab 1: Slicing & Toolpath Profile */}
          {activeTab === 'slicing' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <div>
                <span className="text-xs font-mono lowercase text-neutral-400 block mb-1">
                  [kinematic parameters // calibrated 0.12mm corexy]
                </span>
                <h3 className="text-2xl font-bold tracking-tight text-neutral-950">
                  Toolpath Optimization &amp; Extrusion Dynamics
                </h3>
                <p className="text-sm text-neutral-600 mt-2 max-w-3xl leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Grid of Slicing Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
                    Nozzle Diameter &amp; Temp
                  </span>
                  <span className="text-sm font-bold font-mono text-neutral-900 mt-1 block">
                    {product.specs.nozzleTemp || '285°C Hardened CHT'}
                  </span>
                  <span className="text-[11px] text-neutral-500 font-mono mt-0.5 block">
                    0.4 mm Hardened Steel
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
                    Bed Temperature
                  </span>
                  <span className="text-sm font-bold font-mono text-neutral-900 mt-1 block">
                    {product.specs.bedTemp || '100°C PEI Magnetic'}
                  </span>
                  <span className="text-[11px] text-neutral-500 font-mono mt-0.5 block">
                    Enclosed Heated Chamber
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
                    Infill Architecture
                  </span>
                  <span className="text-sm font-bold font-mono text-neutral-900 mt-1 block">
                    {product.specs.infillDensity || '45% Isotropic'}
                  </span>
                  <span className="text-[11px] text-neutral-500 font-mono mt-0.5 block">
                    {product.specs.infillPattern || 'Gyroid Load-Bearing'}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
                    Extrusion Velocity
                  </span>
                  <span className="text-sm font-bold font-mono text-neutral-900 mt-1 block">
                    {product.specs.printSpeed || '320 mm/s'}
                  </span>
                  <span className="text-[11px] text-neutral-500 font-mono mt-0.5 block">
                    Direct Drive Extruder
                  </span>
                </div>
              </div>

              {/* Kinematic Narrative */}
              <div className="p-5 rounded-2xl bg-neutral-50/70 border border-neutral-200 flex items-start gap-4">
                <Zap className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed text-neutral-600">
                  <span className="font-semibold text-neutral-900 block mb-1">
                    Kinematic Engineering Note:
                  </span>
                  {product.lore}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Mechanical Metrology & GD&T */}
          {activeTab === 'metrology' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <div>
                <span className="text-xs font-mono lowercase text-neutral-400 block mb-1">
                  [coordinate measurement machine // iso 2768-m standard]
                </span>
                <h3 className="text-2xl font-bold tracking-tight text-neutral-950">
                  Physical Tolerances &amp; Material Stress Thresholds
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left: Spec Table */}
                <div className="space-y-3 font-mono text-xs">
                  <div className="flex justify-between py-2.5 border-b border-neutral-200">
                    <span className="text-neutral-500">Print Matrix &amp; Resolution</span>
                    <span className="font-bold text-neutral-900">{product.specs.printResolution}</span>
                  </div>
                  <div className="flex justify-between py-2.5 border-b border-neutral-200">
                    <span className="text-neutral-500">Z-Layer Pitch</span>
                    <span className="font-bold text-neutral-900">{product.specs.layerHeight}</span>
                  </div>
                  <div className="flex justify-between py-2.5 border-b border-neutral-200">
                    <span className="text-neutral-500">Tensile Strength</span>
                    <span className="font-bold text-emerald-600">
                      {product.specs.tensileStrength || '115 MPa (Carbon Fiber PA-CF)'}
                    </span>
                  </div>
                  <div className="flex justify-between py-2.5 border-b border-neutral-200">
                    <span className="text-neutral-500">Heat Deflection Temp (HDT)</span>
                    <span className="font-bold text-neutral-900">
                      {product.specs.heatDeflection || '180°C HDT'}
                    </span>
                  </div>
                  <div className="flex justify-between py-2.5 border-b border-neutral-200">
                    <span className="text-neutral-500">Dimensional Tolerance</span>
                    <span className="font-bold text-neutral-900">
                      {product.specs.dimensionalTolerance || '±0.02 mm'}
                    </span>
                  </div>
                  <div className="flex justify-between py-2.5 border-b border-neutral-200">
                    <span className="text-neutral-500">Assembly Mechanism</span>
                    <span className="font-bold text-neutral-900">{product.specs.assemblyType}</span>
                  </div>
                </div>

                {/* Right: Physical Dimensions & Metrology Card */}
                <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-neutral-900 mb-3 uppercase">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Physical Envelope Dimensions (1:1 True Scale)</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs font-mono text-neutral-600">
                      <div className="p-3 bg-white rounded-xl border border-neutral-200">
                        <span className="text-neutral-400 block text-[10px]">HEIGHT</span>
                        <span className="font-bold text-neutral-950 text-sm">
                          {product.dimensions.height}
                        </span>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-neutral-200">
                        <span className="text-neutral-400 block text-[10px]">WIDTH</span>
                        <span className="font-bold text-neutral-950 text-sm">
                          {product.dimensions.width}
                        </span>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-neutral-200">
                        <span className="text-neutral-400 block text-[10px]">DEPTH</span>
                        <span className="font-bold text-neutral-950 text-sm">
                          {product.dimensions.depth}
                        </span>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-neutral-200">
                        <span className="text-neutral-400 block text-[10px]">WEIGHT</span>
                        <span className="font-bold text-neutral-950 text-sm">
                          {product.dimensions.weight}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-neutral-200 flex items-center justify-between text-[11px] font-mono text-neutral-500">
                    <span>QC Protocol: ISO 2768-m</span>
                    <span className="text-emerald-700 font-bold">100% CMM Inspected</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Industrial Packaging Kit */}
          {activeTab === 'package' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <span className="text-xs font-mono lowercase text-neutral-400 block mb-1">
                  [dispatch packaging // esd moisture-sealed enclosure]
                </span>
                <h3 className="text-2xl font-bold tracking-tight text-neutral-950">
                  What&apos;s In The Industrial Dispatch Box
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {product.includedInBox.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs sm:text-sm text-neutral-800"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-center justify-between text-xs font-mono text-neutral-500">
                <span className="flex items-center gap-2">
                  <Box className="w-4 h-4 text-neutral-700" />
                  Sealed with active silica moisture scavenger for humidity protection
                </span>
                <span className="text-neutral-800 font-semibold hidden sm:inline-block">
                  Aero-Grade Foam Protection
                </span>
              </div>
            </div>
          )}

          {/* Tab 4: Verified Engineering Field Reviews */}
          {activeTab === 'reviews' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200/80">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="w-5 h-5 fill-amber-500" />
                      <span className="text-xl font-bold font-mono text-neutral-950">
                        {product.rating}
                      </span>
                    </div>
                    <span className="text-neutral-500 text-xs font-mono">
                      ({product.reviewCount} Verified Production Reviews)
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-neutral-950">
                    Engineering Testimonials &amp; Field Reports
                  </h3>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 border border-neutral-200 text-xs font-mono text-neutral-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Verified Indian R&amp;D Procurements</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-amber-500">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                        ))}
                      </div>
                      <span className="text-[10px] font-mono text-neutral-400">{rev.date}</span>
                    </div>

                    <h4 className="text-sm font-bold text-neutral-950">{rev.title}</h4>
                    <p className="text-xs text-neutral-600 leading-relaxed italic">
                      &quot;{rev.comment}&quot;
                    </p>

                    <div className="pt-3 border-t border-neutral-200 flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-1.5 text-neutral-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="font-bold">{rev.author}</span>
                        <span className="text-neutral-500">({rev.location})</span>
                      </div>
                      <span className="text-neutral-500 text-[11px]">{rev.editionOwned}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Section: Related Precision Components */}
        {relatedProducts.length > 0 && (
          <div className="mb-12">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
                  catalog recommendations
                </span>
                <h3 className="text-2xl font-bold tracking-tight text-neutral-950 mt-0.5">
                  Complementary {product.category}
                </h3>
              </div>
              <Link
                href={`/shop?category=${encodeURIComponent(product.category)}`}
                className="text-xs font-mono lowercase text-neutral-700 hover:text-black flex items-center gap-1"
              >
                <span>view all</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} theme="light" />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MOBILE STICKY BOTTOM PURCHASE BAR */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200 p-3.5 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] lg:hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Left: Thumbnail & Title */}
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={product.image}
              alt={product.name}
              className="w-11 h-11 rounded-xl object-cover border border-neutral-200 flex-shrink-0"
            />
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-neutral-950 truncate max-w-[150px]">
                {product.name}
              </h4>
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-neutral-500">
                <span className="text-emerald-700 font-semibold">{selectedMaterial}</span>
              </div>
            </div>
          </div>

          {/* Right: Live Price & Add To Cart Button */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="text-right">
              <span className="text-sm font-bold font-mono text-neutral-950 block leading-tight">
                {formatPrice(calculatedUnitPrice)}
              </span>
              <span className="text-[9px] text-neutral-400 font-mono block">
                +18% GST incl.
              </span>
            </div>

            <button
              onClick={handleMobileAddToCart}
              className="px-4 py-2.5 rounded-xl bg-neutral-950 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm active:scale-95 transition-transform"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

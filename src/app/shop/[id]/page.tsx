'use client';

import React, { useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import Link from 'next/link';
import { PRODUCTS } from '@/data/products';
import { MaterialFinish, Scale } from '@/types';
import ProductGallery from '@/components/product/ProductGallery';
import Configurator from '@/components/product/Configurator';
import ProductCard from '@/components/product/ProductCard';
import RevealText from '@/components/animations/RevealText';
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
} from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params?.id as string;

  const product = PRODUCTS.find((p) => p.id === productId);

  const [selectedMaterial, setSelectedMaterial] = useState<MaterialFinish>(
    '24K Gilded Gold Leaf'
  );
  const [selectedScale, setSelectedScale] = useState<Scale>('1/6 Scale');

  if (!product) {
    return notFound();
  }

  const relatedProducts = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 3);

  return (
    <div className="min-h-screen bg-obsidian-950 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-mono text-titanium-400 mb-8 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-gold-300 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/shop" className="hover:text-gold-300 transition-colors">
            Vault
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link
            href={`/shop?category=${encodeURIComponent(product.category)}`}
            className="hover:text-gold-300 transition-colors"
          >
            {product.category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gold-500" />
          <span className="text-gold-400 font-bold truncate">{product.name}</span>
        </nav>

        {/* Top Product Section: Gallery + Configurator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-20">
          {/* Left: Interactive Multi-angle Gallery & 360 Turntable */}
          <div className="lg:col-span-7">
            <ProductGallery
              images={product.galleryImages}
              productName={product.name}
              selectedMaterial={selectedMaterial}
            />

            {/* Micro Highlights below gallery */}
            <div className="grid grid-cols-3 gap-3 mt-4 text-center">
              <div className="p-3 rounded-xl bg-obsidian-900/60 border border-obsidian-800">
                <span className="text-[10px] font-mono text-titanium-400 block">PRECISION</span>
                <span className="text-xs font-bold font-mono text-gold-400">16K 15-Micron</span>
              </div>
              <div className="p-3 rounded-xl bg-obsidian-900/60 border border-obsidian-800">
                <span className="text-[10px] font-mono text-titanium-400 block">CERTIFICATION</span>
                <span className="text-xs font-bold font-mono text-gold-400">NFC Smart Key</span>
              </div>
              <div className="p-3 rounded-xl bg-obsidian-900/60 border border-obsidian-800">
                <span className="text-[10px] font-mono text-titanium-400 block">DELIVERY</span>
                <span className="text-xs font-bold font-mono text-gold-400">Insured Flight Case</span>
              </div>
            </div>
          </div>

          {/* Right: Live Configurator */}
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

        {/* Detailed Lore & Technical Specs Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
          {/* Left: Lore & Artisan Narrative */}
          <div className="lg:col-span-7 space-y-8">
            <div className="p-8 rounded-2xl bg-obsidian-900/60 border border-obsidian-800 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-gold-400">
                <Sparkles className="w-4 h-4" />
                <span>SCULPTURAL NARRATIVE &amp; LORE</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
                {product.tagline}
              </h2>
              <p className="text-sm text-titanium-300 leading-relaxed">
                {product.description}
              </p>
              <p className="text-sm text-titanium-300 leading-relaxed pt-2 border-t border-obsidian-800">
                {product.lore}
              </p>
            </div>

            {/* What's In The Box Breakdown */}
            <div className="p-8 rounded-2xl bg-obsidian-900/60 border border-obsidian-800 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-gold-400">
                <Box className="w-4 h-4" />
                <span>WHAT&apos;S IN THE LUXURY FLIGHT CASE</span>
              </div>
              <h3 className="text-xl font-display font-bold text-foreground">
                Complete Collector Package
              </h3>
              <ul className="space-y-2.5 pt-2">
                {product.includedInBox.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-xs sm:text-sm text-titanium-300">
                    <CheckCircle2 className="w-4 h-4 text-gold-400 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: Technical Specifications */}
          <div className="lg:col-span-5">
            <div className="p-8 rounded-2xl bg-obsidian-900/60 border border-obsidian-800 space-y-6">
              <div className="flex items-center gap-2 text-xs font-mono text-gold-400">
                <Cpu className="w-4 h-4" />
                <span>TECHNICAL SPECIFICATIONS</span>
              </div>
              <h3 className="text-xl font-display font-bold text-foreground">
                Precision Metrics
              </h3>

              <div className="space-y-3 text-xs font-mono">
                <div className="flex justify-between py-2 border-b border-obsidian-800">
                  <span className="text-titanium-400">Print Matrix</span>
                  <span className="text-foreground font-semibold text-right">{product.specs.printResolution}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-obsidian-800">
                  <span className="text-titanium-400">Layer Height</span>
                  <span className="text-gold-400 font-bold text-right">{product.specs.layerHeight}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-obsidian-800">
                  <span className="text-titanium-400">Resin Formulation</span>
                  <span className="text-foreground font-semibold text-right">{product.specs.resinType}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-obsidian-800">
                  <span className="text-titanium-400">Curing Process</span>
                  <span className="text-foreground font-semibold text-right">{product.specs.curingProcess}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-obsidian-800">
                  <span className="text-titanium-400">Joint Assembly</span>
                  <span className="text-foreground font-semibold text-right">{product.specs.assemblyType}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-obsidian-800">
                  <span className="text-titanium-400">Base Pedestal</span>
                  <span className="text-foreground font-semibold text-right">{product.specs.baseMaterial}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-obsidian-800">
                  <span className="text-titanium-400">NFC Smart Chip</span>
                  <span className="text-emerald-400 font-bold text-right">Encrypted Serial # Embedded</span>
                </div>
              </div>

              {/* Physical Dimensions */}
              <div className="p-4 rounded-xl bg-obsidian-950 border border-obsidian-800 text-xs space-y-1.5 font-mono">
                <span className="text-[10px] text-titanium-400 block mb-1">PHYSICAL MEASUREMENTS (1/6 SCALE)</span>
                <div className="flex justify-between text-titanium-300">
                  <span>Height: {product.dimensions.height}</span>
                  <span>Width: {product.dimensions.width}</span>
                </div>
                <div className="flex justify-between text-titanium-300">
                  <span>Depth: {product.dimensions.depth}</span>
                  <span>Weight: {product.dimensions.weight}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Collector Reviews Section */}
        <div className="p-8 sm:p-12 rounded-3xl bg-obsidian-900/60 border border-obsidian-800 mb-20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="flex items-center gap-1 text-gold-400">
                  <Star className="w-5 h-5 fill-gold-400" />
                  <span className="text-xl font-bold font-mono">{product.rating}</span>
                </div>
                <span className="text-titanium-400 text-sm">
                  ({product.reviewCount} Verified Collector Reviews)
                </span>
              </div>
              <h3 className="text-2xl font-display font-bold text-foreground">
                Collector Impressions
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {product.reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-6 rounded-2xl bg-obsidian-950/80 border border-obsidian-800 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-gold-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-gold-400" />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono text-titanium-400">{rev.date}</span>
                </div>

                <h4 className="text-sm font-bold text-foreground">{rev.title}</h4>
                <p className="text-xs text-titanium-300 leading-relaxed italic">
                  &quot;{rev.comment}&quot;
                </p>

                <div className="pt-3 border-t border-obsidian-800 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-1.5 text-titanium-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
                    <span className="font-bold">{rev.author}</span>
                    <span className="text-titanium-500">({rev.location})</span>
                  </div>
                  <span className="text-gold-400 text-[11px]">{rev.editionOwned}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Related Masterworks Carousel */}
        {relatedProducts.length > 0 && (
          <div>
            <div className="mb-8">
              <span className="text-xs font-mono text-gold-400 uppercase tracking-wider">
                COMPLEMENTARY SCULPTURES
              </span>
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-foreground mt-1">
                More from {product.category}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { CATEGORIES } from '@/data/products';
import RevealText from '@/components/animations/RevealText';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function CollectionGrid() {
  return (
    <section className="py-20 bg-obsidian-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <RevealText>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-mono mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>CURATED THEMES</span>
              </div>
            </RevealText>

            <RevealText delay={0.1}>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground">
                Sculptural Universes
              </h2>
            </RevealText>
          </div>

          <RevealText delay={0.2}>
            <Link
              href="/shop"
              className="text-xs font-mono text-gold-400 hover:text-gold-300 flex items-center gap-1.5 transition-colors uppercase tracking-wider group"
            >
              <span>Explore All Universes</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </RevealText>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((category, idx) => (
            <RevealText key={category.id} delay={idx * 0.1}>
              <Link
                href={`/shop?category=${encodeURIComponent(category.id)}`}
                className="group relative h-96 rounded-2xl overflow-hidden bg-obsidian-900 border border-obsidian-700/80 hover:border-gold-500/40 transition-all duration-500 flex flex-col justify-end p-6 shadow-xl hover:shadow-gold-glow/20 block"
              >
                {/* Background Image with Zoom & Dark Gradient */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/60 to-transparent" />
                </div>

                {/* Content Overlay */}
                <div className="relative z-10 space-y-2">
                  <span className="text-[10px] font-mono font-bold text-gold-400 px-2.5 py-0.5 rounded-full bg-obsidian-900/80 border border-gold-500/30 inline-block">
                    {category.count} SCULPTURES
                  </span>

                  <h3 className="text-xl font-display font-bold text-foreground group-hover:text-gold-300 transition-colors">
                    {category.name}
                  </h3>

                  <p className="text-xs text-titanium-300 line-clamp-2 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                    {category.description}
                  </p>

                  <div className="pt-2 flex items-center gap-1.5 text-xs text-gold-400 font-mono group-hover:translate-x-1 transition-transform">
                    <span>Enter Universe</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            </RevealText>
          ))}
        </div>
      </div>
    </section>
  );
}

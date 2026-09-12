'use client';

import React from 'react';
import Link from 'next/link';
import { CATEGORIES } from '@/data/products';
import { ArrowRight } from 'lucide-react';

export default function CollectionGrid() {
  return (
    <section className="py-24 sm:py-32 bg-white text-black border-t border-neutral-200 relative overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="text-xs font-mono text-neutral-400 lowercase tracking-widest block mb-2">
              additive applications
            </span>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-[-0.04em] lowercase text-black leading-none">
              engineering domains.
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 font-normal lowercase mt-3 max-w-lg">
              tailored toolpaths and material formulations for functional mechanisms, aerospace frames, and rapid tooling.
            </p>
          </div>

          <Link
            href="/shop"
            className="text-xs sm:text-sm font-semibold text-neutral-700 hover:text-black flex items-center gap-1.5 transition-colors lowercase tracking-normal border-b border-black pb-0.5 whitespace-nowrap"
          >
            <span>explore all domains &rarr;</span>
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((category) => (
            <Link
              key={category.id}
              href={`/shop?category=${encodeURIComponent(category.id)}`}
              className="group relative h-[440px] rounded-3xl overflow-hidden bg-neutral-100 border border-neutral-200 hover:border-black transition-all duration-500 flex flex-col justify-end p-7 shadow-sm hover:shadow-xl"
            >
              {/* Background Image with Zoom & Dark Gradient */}
              <div className="absolute inset-0 z-0">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/10" />
              </div>

              {/* Content Overlay */}
              <div className="relative z-10 space-y-2">
                <span className="text-[11px] font-mono text-emerald-400 lowercase block font-semibold">
                  {category.count} components
                </span>

                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight lowercase">
                  {category.name}
                </h3>

                <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed lowercase font-normal">
                  {category.description}
                </p>

                <div className="pt-2 flex items-center gap-1.5 text-xs text-white font-medium lowercase">
                  <span>view engineering catalog</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

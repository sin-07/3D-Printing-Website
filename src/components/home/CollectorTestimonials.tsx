'use client';

import React from 'react';
import { Star, ShieldCheck, Sparkles, Quote } from 'lucide-react';
import RevealText from '@/components/animations/RevealText';

export default function CollectorTestimonials() {
  const testimonials = [
    {
      author: 'Lord Henrik Von Berg',
      location: 'Zurich, Switzerland',
      statue: 'Seraphim Archlyte (Edition #003 of 250)',
      image: '/images/hero_sculpture.jpg',
      quote:
        'I have collected bronze and marble fine art for over twenty years. Aetheris Atelier is the first studio that has elevated 3D printing into legitimate museum-tier sculpture. The magnetic tolerances and gold leafing are extraordinary.',
      rating: 5,
    },
    {
      author: 'Kenji Takahashi',
      location: 'Tokyo, Japan',
      statue: 'Ronin 2099: Neon Shadow',
      image: '/images/statue_cyber_ronin.jpg',
      quote:
        'The carbon fiber texture printed into the armor weave and the illuminated neon katanas look like they stepped straight out of Neo-Tokyo. Packaging in the custom flight case was bulletproof.',
      rating: 5,
    },
    {
      author: 'Dr. Evelyn Sterling',
      location: 'London, UK',
      statue: 'David: Metallic Kintsugi',
      image: '/images/statue_celestial_david.jpg',
      quote:
        'The mirror chrome electroplating with real gold kintsugi relief is a masterclass in modern classical art. The NFC authenticity card immediately validated with my smartphone.',
      rating: 5,
    },
  ];

  return (
    <section className="py-20 bg-obsidian-900/50 relative overflow-hidden border-t border-obsidian-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <RevealText>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-mono mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>COLLECTOR DISPATCHES</span>
            </div>
          </RevealText>

          <RevealText delay={0.1}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground">
              Endorsed by Master Collectors
            </h2>
          </RevealText>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <RevealText key={idx} delay={idx * 0.1}>
              <div className="h-full p-6 rounded-2xl bg-obsidian-900/80 border border-obsidian-700/80 flex flex-col justify-between space-y-4 hover:border-gold-500/40 transition-colors">
                <div className="space-y-3">
                  {/* Rating Stars */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-gold-400">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-gold-400 text-gold-400" />
                      ))}
                    </div>
                    <Quote className="w-6 h-6 text-gold-500/20" />
                  </div>

                  <p className="text-xs sm:text-sm text-titanium-300 leading-relaxed italic">
                    &quot;{t.quote}&quot;
                  </p>
                </div>

                <div className="pt-4 border-t border-obsidian-800 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-obsidian-950 overflow-hidden border border-obsidian-700 flex-shrink-0">
                    <img src={t.image} alt={t.statue} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-foreground">{t.author}</h4>
                      <span title="Verified Collector">
                        <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
                      </span>
                    </div>
                    <p className="text-[11px] text-titanium-400 font-mono">{t.location}</p>
                    <p className="text-[10px] text-gold-400 font-mono mt-0.5">{t.statue}</p>
                  </div>
                </div>
              </div>
            </RevealText>
          ))}
        </div>
      </div>
    </section>
  );
}

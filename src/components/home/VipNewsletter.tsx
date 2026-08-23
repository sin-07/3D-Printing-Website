'use client';

import React, { useState } from 'react';
import { useToast } from '@/context/ToastContext';
import RevealText from '@/components/animations/RevealText';
import { Sparkles, ArrowRight, ShieldCheck, Check } from 'lucide-react';

export default function VipNewsletter() {
  const [email, setEmail] = useState('');
  const [isDone, setIsDone] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsDone(true);
      showToast('VIP Collector Access Granted', 'Your priority allocation has been reserved for the next drop.', 'gold');
    }
  };

  return (
    <section className="py-20 bg-obsidian-950 relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gold-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-obsidian-900 via-obsidian-850 to-obsidian-900 border border-gold-500/30 shadow-2xl space-y-6">
          <RevealText>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>THE INNER SANCTUM</span>
            </div>
          </RevealText>

          <RevealText delay={0.1}>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
              Join the VIP Collector Registry
            </h2>
          </RevealText>

          <RevealText delay={0.2}>
            <p className="text-xs sm:text-sm text-titanium-400 max-w-lg mx-auto leading-relaxed">
              Gain 2-hour early access keys to all numbered masterwork drops, private artisan commissions, and invitational vault archive releases.
            </p>
          </RevealText>

          <RevealText delay={0.3}>
            {isDone ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-semibold flex items-center justify-center gap-2 max-w-md mx-auto">
                <Check className="w-4 h-4" />
                <span>You are registered in the Atelier VIP Registry.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  required
                  placeholder="Enter your collector email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-3 text-xs bg-obsidian-950 border border-obsidian-700 rounded-xl text-foreground placeholder-titanium-500 focus:outline-none focus:border-gold-500/50"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-gold-500 to-amber-500 text-obsidian-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:brightness-110 shadow-gold-glow transition-all whitespace-nowrap"
                >
                  <span>Request Key</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </RevealText>

          <div className="flex items-center justify-center gap-4 text-[11px] text-titanium-500 font-mono pt-2">
            <span>STRICT CONFIDENTIALITY</span>
            <span>•</span>
            <span>NO MARKETING SPAM</span>
          </div>
        </div>
      </div>
    </section>
  );
}

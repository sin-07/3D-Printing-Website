'use client';

import React, { useState } from 'react';
import { useToast } from '@/context/ToastContext';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function LaunchReservationPill() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    showToast(
      'Print Cell Reserved',
      'You are confirmed for the 2026 high-speed additive production queue with priority quoting.',
      'gold'
    );
  };

  return (
    <section
      id="inside-atelier"
      className="relative w-full min-h-[90vh] sm:min-h-screen flex items-center justify-center overflow-hidden bg-black text-white select-none py-20 border-t border-neutral-900"
    >
      {/* Background Image: Vertical Machine Profile & Spool in Dark Studio */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/loop_machine_profile.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/45 backdrop-brightness-[0.85]" />
      </div>

      {/* Centered Floating White Pill Card */}
      <div className="gsap-appear-left relative z-10 w-full max-w-md mx-6">
        <div className="bg-white text-black rounded-[28px] sm:rounded-[36px] p-8 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.6)] text-center transition-all duration-300 hover:shadow-[0_25px_70px_rgba(0,0,0,0.8)] border border-neutral-100">
          {/* Bold Header */}
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight lowercase text-neutral-950">
            production batch 2026
          </h3>

          {/* Subtext */}
          <p className="mt-2 text-xs sm:text-sm text-neutral-600 font-normal lowercase max-w-xs mx-auto leading-relaxed">
            reserve machine capacity or get 20% off your first custom engineering batch
          </p>

          {/* Interactive Input Form */}
          {submitted ? (
            <div className="mt-6 p-4 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-center justify-center gap-2 text-xs font-medium text-neutral-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>spot #0482 confirmed for 2026 production</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-2.5">
              <div className="flex items-center rounded-full border border-neutral-300 bg-neutral-50 px-3.5 py-1.5 focus-within:border-black focus-within:bg-white transition-all shadow-inner">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="enter your email"
                  required
                  className="w-full bg-transparent text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none lowercase px-2"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-full bg-black text-white text-xs font-semibold lowercase tracking-tight hover:bg-neutral-800 transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <span>reserve</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <span className="text-[10px] text-neutral-400 font-mono lowercase">
                limited to 50 commercial print cell allocations
              </span>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

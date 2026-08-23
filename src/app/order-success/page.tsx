'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Cpu,
  Layers,
  Box,
  Printer,
  ArrowRight,
  Clock,
  ExternalLink,
} from 'lucide-react';

export default function OrderSuccessPage() {
  const [orderNumber] = useState(`ATH-2026-${Math.floor(100000 + Math.random() * 900000)}`);
  const [serialNumber] = useState(`ATH-SER-00${Math.floor(10 + Math.random() * 89)}/250`);

  useEffect(() => {
    // Confetti effect
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#d4af37', '#f4dc93', '#00f0ff', '#ffffff'],
      });
    } catch (e) {
      console.error(e);
    }
  }, []);

  const stages = [
    { title: '1. Slicing & Support Matrix', desc: '0.015mm layer generation completed', status: 'completed' },
    { title: '2. 16K SLA Photopolymer Curing', desc: 'Active in 405nm nitrogen chamber (Layer 1,840/3,520)', status: 'active' },
    { title: '3. Ultrasonic IPA Wash', desc: 'Dual-tank micro-cleaning queued', status: 'pending' },
    { title: '4. Thermal UV Anneal', desc: 'Vacuum post-cure for structural rigidity', status: 'pending' },
    { title: '5. Hand-Sanding & Polishing', desc: '3000-grit micro-abrasive artisan finish', status: 'pending' },
    { title: '6. Florentine 24K Gold Gilding', desc: 'Hand-laid metal leaf & protective satin seal', status: 'pending' },
    { title: '7. Flight Case Nesting & Dispatch', desc: 'Laser-cut foam crate with insured air freight', status: 'pending' },
  ];

  return (
    <div className="min-h-screen bg-obsidian-950 pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center space-y-4 mb-12">
          <div className="w-16 h-16 rounded-full bg-gold-500/10 border border-gold-500/40 text-gold-400 flex items-center justify-center mx-auto shadow-gold-glow">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="text-xs font-mono text-gold-400 font-bold uppercase tracking-widest block">
            ACQUISITION PROTOCOL CONFIRMED
          </span>

          <h1 className="text-3xl sm:text-5xl font-display font-bold text-foreground">
            Sculpture In Production
          </h1>

          <p className="text-xs sm:text-sm text-titanium-400 max-w-lg mx-auto font-mono">
            Order Reference: <span className="text-foreground font-bold">{orderNumber}</span> • Tracking updates dispatched to your registered collector email.
          </p>
        </div>

        {/* Certificate of Authenticity Holographic Card Preview */}
        <div className="p-8 rounded-3xl bg-gradient-to-br from-obsidian-850 via-obsidian-900 to-obsidian-950 border border-gold-500/50 shadow-2xl relative overflow-hidden mb-12">
          {/* Shimmer aura */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-obsidian-800">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gold-500/10 border border-gold-500/30 text-gold-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-display font-bold text-foreground">
                  Holographic NFC Authenticity Key
                </h3>
                <p className="text-xs font-mono text-titanium-400">Decentralized Provenance Record</p>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full bg-gold-500/20 text-gold-300 border border-gold-500/40 text-xs font-mono font-bold self-start sm:self-auto">
              {serialNumber}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 text-xs font-mono border-b border-obsidian-800">
            <div>
              <span className="text-titanium-500 block text-[10px]">EDITION TIER</span>
              <span className="text-foreground font-bold mt-0.5 block">Mythic Limited</span>
            </div>
            <div>
              <span className="text-titanium-500 block text-[10px]">SLICING HEIGHT</span>
              <span className="text-gold-400 font-bold mt-0.5 block">0.015 mm / Layer</span>
            </div>
            <div>
              <span className="text-titanium-500 block text-[10px]">AUTHENTICITY NFC</span>
              <span className="text-emerald-400 font-bold mt-0.5 block">Hardware Active</span>
            </div>
            <div>
              <span className="text-titanium-500 block text-[10px]">FLIGHT CASE</span>
              <span className="text-foreground font-bold mt-0.5 block">Custom Foam Nested</span>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-titanium-400 font-mono">
            <span>Scan physical NFC metal card upon unboxing to verify cryptographic blockchain proof.</span>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 text-gold-400 hover:text-white transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Archive Receipt</span>
            </button>
          </div>
        </div>

        {/* 7-Stage SLA Print Production Timeline */}
        <div className="p-8 rounded-3xl bg-obsidian-900/70 border border-obsidian-800 space-y-6 mb-12">
          <div className="flex items-center justify-between pb-4 border-b border-obsidian-800">
            <h3 className="text-lg font-display font-bold text-foreground flex items-center gap-2">
              <Layers className="w-5 h-5 text-gold-400" />
              <span>7-Stage Atelier Fabrication Live Telemetry</span>
            </h3>
            <span className="flex items-center gap-1 text-cyan-400 font-mono text-xs">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>STAGE 2 IN PROGRESS</span>
            </span>
          </div>

          <div className="space-y-4">
            {stages.map((stage, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border flex items-center gap-4 transition-colors ${
                  stage.status === 'completed'
                    ? 'bg-obsidian-950 border-emerald-500/30'
                    : stage.status === 'active'
                    ? 'bg-obsidian-950 border-cyan-400/50 shadow-cyan-glow/20'
                    : 'bg-obsidian-950/40 border-obsidian-800 opacity-50'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-bold flex-shrink-0 ${
                    stage.status === 'completed'
                      ? 'bg-emerald-500 text-obsidian-950'
                      : stage.status === 'active'
                      ? 'bg-cyan-400 text-obsidian-950 animate-pulse'
                      : 'bg-obsidian-800 text-titanium-500'
                  }`}
                >
                  {idx + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-foreground">{stage.title}</h4>
                  <p className="text-[11px] text-titanium-400 font-mono mt-0.5">{stage.desc}</p>
                </div>

                <span
                  className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                    stage.status === 'completed'
                      ? 'text-emerald-400 bg-emerald-500/10'
                      : stage.status === 'active'
                      ? 'text-cyan-300 bg-cyan-500/10'
                      : 'text-titanium-500 bg-obsidian-900'
                  }`}
                >
                  {stage.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/shop"
            className="px-8 py-3.5 rounded-full bg-gold-500 text-obsidian-950 font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-gold-glow flex items-center gap-2"
          >
            <span>Return to Masterpiece Vault</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/custom-print"
            className="px-8 py-3.5 rounded-full bg-obsidian-900 border border-obsidian-700 text-titanium-300 hover:text-white text-xs font-semibold uppercase tracking-wider"
          >
            <span>Commission Another Piece</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

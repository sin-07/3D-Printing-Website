import React from 'react';
import type { Metadata } from 'next';
import PricingConfigForm from '@/components/admin/PricingConfigForm';
import AuditLogsTable from '@/components/admin/AuditLogsTable';
import RevealText from '@/components/animations/RevealText';
import { ShieldCheck, Cpu, Sliders, Activity } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Admin AI Pricing Console & Audit Trail | Aetheris 3D Atelier',
  description: 'Manage pricing formula parameters, material costs, AI confidence thresholds, and review quotes.',
};

export default function AdminAiPricingPage() {
  return (
    <div className="min-h-screen bg-obsidian-950 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Admin Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <RevealText>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ATELIER MASTER COMMAND CONSOLE</span>
            </div>
          </RevealText>

          <RevealText delay={0.1}>
            <h1 className="text-3xl sm:text-5xl font-display font-bold text-foreground">
              AI Pricing &amp; Metrology Admin
            </h1>
          </RevealText>

          <RevealText delay={0.2}>
            <p className="text-xs sm:text-sm text-titanium-400 leading-relaxed">
              Configure production cost variables, machine rates, photopolymer densities, AI verification thresholds, and inspect live customer quote audit records.
            </p>
          </RevealText>
        </div>

        {/* Section 1: Pricing Engine Parameters Form */}
        <PricingConfigForm />

        {/* Section 2: Audit Logs & Quote Queue */}
        <AuditLogsTable />
      </div>
    </div>
  );
}

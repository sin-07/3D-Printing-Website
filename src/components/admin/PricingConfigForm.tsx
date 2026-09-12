'use client';

import React, { useState, useEffect } from 'react';
import { PricingConfig } from '@/types';
import { DEFAULT_PRICING_CONFIG } from '@/lib/pricing/pricing-config';
import { useToast } from '@/context/ToastContext';
import { Sliders, Save, RotateCcw, DollarSign, Zap, Clock, ShieldAlert, Cpu } from 'lucide-react';

interface PricingConfigFormProps {
  initialConfig?: PricingConfig;
  onConfigSaved?: (newConfig: PricingConfig) => void;
}

export default function PricingConfigForm({
  initialConfig,
  onConfigSaved,
}: PricingConfigFormProps) {
  const { showToast } = useToast();
  const [config, setConfig] = useState<PricingConfig>(initialConfig || DEFAULT_PRICING_CONFIG);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Fetch live config from server
    fetch('/api/pricing/config')
      .then((res) => res.json())
      .then((data) => {
        if (data.config) setConfig(data.config);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/pricing/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Pricing Configuration Saved', 'All dynamic formulas updated live.', 'success');
        if (onConfigSaved) onConfigSaved(data.config);
      }
    } catch (e: any) {
      showToast('Save Error', e.message || 'Failed to save configuration', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (confirm('Reset all pricing parameters to Atelier factory defaults?')) {
      const res = await fetch('/api/pricing/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset' }),
      });
      const data = await res.json();
      if (data.config) {
        setConfig(data.config);
        showToast('Reset to Atelier Defaults', undefined, 'info');
      }
    }
  };

  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-obsidian-900/90 border border-obsidian-700/80 backdrop-blur-xl shadow-2xl space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-obsidian-800 pb-6">
        <div>
          <span className="text-xs font-mono font-bold text-gold-400 uppercase tracking-wider block">
            ADMINISTRATION CONSOLE
          </span>
          <h2 className="text-2xl font-display font-bold text-foreground">
            Pricing Engine &amp; AI Threshold Parameters
          </h2>
          <p className="text-xs text-titanium-400 font-mono mt-1">
            Version {config.version} • Last updated: {new Date(config.updatedAt).toLocaleString()}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl border border-obsidian-700 bg-obsidian-950 text-titanium-400 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-amber-500 text-obsidian-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 hover:brightness-110 shadow-gold-glow transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving...' : 'Save Parameters'}</span>
          </button>
        </div>
      </div>

      {/* Grid: Global Rates & Economics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Machine Hourly Rate */}
        <div className="p-5 rounded-xl bg-obsidian-950 border border-obsidian-800 space-y-2">
          <label className="text-xs font-mono text-titanium-300 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-gold-400" />
            Machine Rate ($ / hour)
          </label>
          <input
            type="number"
            step="0.25"
            value={config.machineHourlyRate}
            onChange={(e) => setConfig({ ...config, machineHourlyRate: Number(e.target.value) })}
            className="w-full px-3 py-2 rounded-lg bg-obsidian-900 border border-obsidian-700 text-foreground font-mono text-sm focus:border-gold-500 focus:outline-none"
          />
          <p className="text-[10px] font-mono text-titanium-500">16K SLA depreciation &amp; laser wear</p>
        </div>

        {/* Electricity Rate */}
        <div className="p-5 rounded-xl bg-obsidian-950 border border-obsidian-800 space-y-2">
          <label className="text-xs font-mono text-titanium-300 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-gold-400" />
            Electricity ($ / kWh)
          </label>
          <input
            type="number"
            step="0.01"
            value={config.electricityRatePerKwh}
            onChange={(e) => setConfig({ ...config, electricityRatePerKwh: Number(e.target.value) })}
            className="w-full px-3 py-2 rounded-lg bg-obsidian-900 border border-obsidian-700 text-foreground font-mono text-sm focus:border-gold-500 focus:outline-none"
          />
          <p className="text-[10px] font-mono text-titanium-500">Machine draw: {config.machinePowerWatts} Watts</p>
        </div>

        {/* Labor Hourly Rate */}
        <div className="p-5 rounded-xl bg-obsidian-950 border border-obsidian-800 space-y-2">
          <label className="text-xs font-mono text-titanium-300 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-gold-400" />
            Technician Labor ($ / hour)
          </label>
          <input
            type="number"
            step="1.0"
            value={config.laborHourlyRate}
            onChange={(e) => setConfig({ ...config, laborHourlyRate: Number(e.target.value) })}
            className="w-full px-3 py-2 rounded-lg bg-obsidian-900 border border-obsidian-700 text-foreground font-mono text-sm focus:border-gold-500 focus:outline-none"
          />
          <p className="text-[10px] font-mono text-titanium-500">Slicing, cleaning, UV cure &amp; support removal</p>
        </div>

        {/* Target Profit Margin */}
        <div className="p-5 rounded-xl bg-obsidian-950 border border-obsidian-800 space-y-2">
          <label className="text-xs font-mono text-titanium-300 flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-gold-400" />
            Target Profit Margin (%)
          </label>
          <input
            type="number"
            min="5"
            max="150"
            value={config.targetProfitMarginPercent}
            onChange={(e) => setConfig({ ...config, targetProfitMarginPercent: Number(e.target.value) })}
            className="w-full px-3 py-2 rounded-lg bg-obsidian-900 border border-obsidian-700 text-gold-400 font-mono text-sm font-bold focus:border-gold-500 focus:outline-none"
          />
          <p className="text-[10px] font-mono text-titanium-500">Applied on top of total manufacturing cost</p>
        </div>

        {/* Base Support & Waste Factor */}
        <div className="p-5 rounded-xl bg-obsidian-950 border border-obsidian-800 space-y-2">
          <label className="text-xs font-mono text-titanium-300 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-gold-400" />
            Base Waste &amp; Support (%)
          </label>
          <input
            type="number"
            min="5"
            max="50"
            value={config.baseWastePercentage}
            onChange={(e) => setConfig({ ...config, baseWastePercentage: Number(e.target.value) })}
            className="w-full px-3 py-2 rounded-lg bg-obsidian-900 border border-obsidian-700 text-foreground font-mono text-sm focus:border-gold-500 focus:outline-none"
          />
          <p className="text-[10px] font-mono text-titanium-500">Rafts, support lattice, &amp; IPA vat losses</p>
        </div>

        {/* Minimum Selling Floor Price */}
        <div className="p-5 rounded-xl bg-obsidian-950 border border-obsidian-800 space-y-2">
          <label className="text-xs font-mono text-titanium-300 flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-gold-400" />
            Minimum Order Floor ($)
          </label>
          <input
            type="number"
            min="10"
            value={config.minimumSellingPrice}
            onChange={(e) => setConfig({ ...config, minimumSellingPrice: Number(e.target.value) })}
            className="w-full px-3 py-2 rounded-lg bg-obsidian-900 border border-obsidian-700 text-foreground font-mono text-sm focus:border-gold-500 focus:outline-none"
          />
          <p className="text-[10px] font-mono text-titanium-500">Enforced base floor price</p>
        </div>

        {/* AI Confidence Verification Threshold */}
        <div className="p-5 rounded-xl bg-obsidian-950 border border-obsidian-800 space-y-2">
          <label className="text-xs font-mono text-titanium-300 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            AI Review Threshold (%)
          </label>
          <input
            type="number"
            min="40"
            max="95"
            value={config.confidenceThresholdForVerification}
            onChange={(e) => setConfig({ ...config, confidenceThresholdForVerification: Number(e.target.value) })}
            className="w-full px-3 py-2 rounded-lg bg-obsidian-900 border border-obsidian-700 text-amber-400 font-mono text-sm font-bold focus:border-gold-500 focus:outline-none"
          />
          <p className="text-[10px] font-mono text-titanium-500">Flags scans with confidence below this score</p>
        </div>
      </div>

      {/* Materials Formulation Cost Matrix */}
      <div className="space-y-4 pt-4 border-t border-obsidian-800">
        <h3 className="text-sm font-mono font-bold text-foreground uppercase tracking-wider">
          MATERIAL FORMULATIONS &amp; DENSITY LIBRARY
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {config.materials.map((mat, idx) => (
            <div key={mat.id} className="p-4 rounded-xl bg-obsidian-950 border border-obsidian-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-gold-300">{mat.name}</span>
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: mat.colorHex }} />
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div>
                  <label className="text-[10px] text-titanium-400 block">Cost ($/kg)</label>
                  <input
                    type="number"
                    value={mat.costPerKg}
                    onChange={(e) => {
                      const updated = [...config.materials];
                      updated[idx].costPerKg = Number(e.target.value);
                      setConfig({ ...config, materials: updated });
                    }}
                    className="w-full px-2 py-1 rounded bg-obsidian-900 border border-obsidian-700 text-foreground font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-titanium-400 block">Density (g/cm³)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={mat.densityGPerCm3}
                    onChange={(e) => {
                      const updated = [...config.materials];
                      updated[idx].densityGPerCm3 = Number(e.target.value);
                      setConfig({ ...config, materials: updated });
                    }}
                    className="w-full px-2 py-1 rounded bg-obsidian-900 border border-obsidian-700 text-foreground font-mono text-xs"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

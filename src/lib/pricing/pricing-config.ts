import { PricingConfig } from '@/types';

export const DEFAULT_PRICING_CONFIG: PricingConfig = {
  id: 'atelier-default-v1',
  version: '2026.1',
  updatedAt: new Date().toISOString(),
  materials: [
    {
      id: 'sla-16k-standard',
      name: '16K Ultra-HD SLA Resin',
      densityGPerCm3: 1.15,
      costPerKg: 65.0, // $65/kg
      description: 'Ultra-crisp 15-micron photopolymer for hyper-detailed miniatures, figurines, and sculptures.',
      colorHex: '#d4af37',
      wasteFactorMultiplier: 1.15,
    },
    {
      id: 'titanium-infused',
      name: 'Titanium-Infused Ceramic Resin',
      densityGPerCm3: 1.65,
      costPerKg: 110.0, // $110/kg
      description: 'Heavyweight rigid composite with metallic ring and superior impact resistance.',
      colorHex: '#8d8d9f',
      wasteFactorMultiplier: 1.20,
    },
    {
      id: 'translucent-smoke',
      name: 'Translucent Smoked Optical Resin',
      densityGPerCm3: 1.18,
      costPerKg: 85.0, // $85/kg
      description: 'Crystal-clear glass-like clarity with tinted smoke finish displaying internal supports.',
      colorHex: '#494957',
      wasteFactorMultiplier: 1.18,
    },
    {
      id: 'tough-engineering',
      name: 'Flexible Tough Impact Polymer',
      densityGPerCm3: 1.20,
      costPerKg: 95.0, // $95/kg
      description: 'High tensile strength with slight elasticity for functional prototypes and articulated joints.',
      colorHex: '#00f0ff',
      wasteFactorMultiplier: 1.12,
    },
    {
      id: 'obsidian-cast',
      name: 'Obsidian High-Density Composite',
      densityGPerCm3: 1.45,
      costPerKg: 125.0, // $125/kg
      description: 'Deep onyx resin with mineral filler for authentic stone-weight museum bust replicas.',
      colorHex: '#121217',
      wasteFactorMultiplier: 1.22,
    }
  ],
  finishes: [
    {
      id: 'raw-cleaned',
      name: 'Raw Ultrasonic Cleaned & UV Cured',
      baseCost: 0,
      hourlyLaborRequired: 0.25,
      description: 'Supports removed, ultrasonic IPA wash, dual UV post-bake. Ready for collector painting.',
    },
    {
      id: 'matte-primer',
      name: 'Artisan Micro-Sanded & Primed',
      baseCost: 35,
      hourlyLaborRequired: 0.75,
      description: 'Hand-buffed with 3000-grit micro-abrasives and coated with neutral grey automotive primer.',
    },
    {
      id: 'hand-painted',
      name: 'Master Artisan Hand-Painted Finish',
      baseCost: 165,
      hourlyLaborRequired: 3.5,
      description: 'Full airbrush shading, wash weathering, and micro-detailed eye/armor highlights by senior artists.',
    },
    {
      id: 'gilded-gold',
      name: '24K Florentine Gold Leaf Gilded',
      baseCost: 240,
      hourlyLaborRequired: 4.5,
      description: 'Genuine hand-laid 24-karat Florentine gold leaf accents over obsidian or alabaster resin.',
    },
  ],
  packagingOptions: [
    {
      id: 'standard-box',
      name: 'Atelier Vault Secure Packaging',
      cost: 18,
      description: 'Dual-wall shockproof box with custom fitted high-density closed-cell EPE foam inserts.',
    },
    {
      id: 'velvet-flight-crate',
      name: 'Collector Velvet Flight Crate',
      cost: 55,
      description: 'Reinforced aluminum flight case with embroidered velvet interior lining and serialized seal.',
    },
    {
      id: 'archival-wooden-chest',
      name: 'Handcrafted Walnut Archival Chest',
      cost: 110,
      description: 'Solid oiled walnut chest with brass hinges, NFC authenticity plaque, and linen gloves.',
    }
  ],
  machineHourlyRate: 4.50,       // $4.50 / hour for high-precision 16K SLA machine depreciation + maintenance
  electricityRatePerKwh: 0.18,   // $0.18 / kWh
  machinePowerWatts: 180,        // 180 Watts operational draw
  laborHourlyRate: 38.00,        // $38.00 / hour technician rate
  baseWastePercentage: 15,       // 15% base waste for supports, rafts and IPA residue
  targetProfitMarginPercent: 35, // 35% target margin
  minimumSellingPrice: 45.00,    // $45 minimum floor price for custom statue jobs
  confidenceThresholdForVerification: 75, // Scores below 75% require manual review warning
  sizeCategoryPriceFloors: {
    'Miniature (1:12 Scale)': 35,
    'Tabletop (1:8 Scale)': 75,
    'Standard Display (1:6 Scale)': 160,
    'Large Collector (1:4 Scale)': 320,
    'Museum Bust (1:2 Scale)': 550,
    'Monumental (Life-Size)': 1250,
  }
};

// In-memory runtime store (can be updated via Admin API)
let activeConfig: PricingConfig = { ...DEFAULT_PRICING_CONFIG };

export function getPricingConfig(): PricingConfig {
  return activeConfig;
}

export function updatePricingConfig(newConfig: Partial<PricingConfig>): PricingConfig {
  activeConfig = {
    ...activeConfig,
    ...newConfig,
    updatedAt: new Date().toISOString(),
  };
  return activeConfig;
}

export function resetPricingConfigToDefault(): PricingConfig {
  activeConfig = { ...DEFAULT_PRICING_CONFIG, updatedAt: new Date().toISOString() };
  return activeConfig;
}

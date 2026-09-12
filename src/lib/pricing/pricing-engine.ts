import { PricingBreakdown, PricingConfig, Currency } from '@/types';
import { getPricingConfig } from './pricing-config';

export interface PricingCalculationInput {
  heightMm: number;
  widthMm: number;
  depthMm: number;
  volumeCm3: number;
  surfaceAreaCm2?: number;
  complexityScore: number; // 1 - 100
  materialId: string;
  finishId: string;
  packagingId: string;
  infillDensityPercent?: number; // default 30%
  layerHeightMm?: number; // default 0.015mm
  currency?: Currency;
  customConfig?: PricingConfig;
}

export function calculateDynamicPrice(input: PricingCalculationInput): PricingBreakdown {
  const config = input.customConfig || getPricingConfig();
  const currency = input.currency || 'USD';

  // 1. Sanitize & Normalize Inputs
  const heightMm = Math.max(10, input.heightMm || 150);
  const widthMm = Math.max(10, input.widthMm || 80);
  const depthMm = Math.max(10, input.depthMm || 60);
  
  // If volume is missing, approximate via bounding volume box * sculpt fill factor
  const boundingVolumeCm3 = (heightMm * widthMm * depthMm) / 1000;
  const sculptFillFactor = 0.38; // typical statue volume occupancy of bounding box
  const volumeCm3 = Math.max(5, input.volumeCm3 || Math.round(boundingVolumeCm3 * sculptFillFactor));
  
  const complexity = Math.min(100, Math.max(1, input.complexityScore || 50));
  const infillPercent = Math.min(100, Math.max(10, input.infillDensityPercent ?? 30));
  const layerHeightMm = input.layerHeightMm || 0.015;

  // 2. Lookup Material, Finish, Packaging
  const material = config.materials.find((m) => m.id === input.materialId) || config.materials[0];
  const finish = config.finishes.find((f) => f.id === input.finishId) || config.finishes[0];
  const packaging = config.packagingOptions.find((p) => p.id === input.packagingId) || config.packagingOptions[0];

  // 3. Print Time Estimation (Layer based)
  const totalLayers = Math.ceil(heightMm / layerHeightMm);
  // Resin print time: base exposure ~2.5s per layer + mechanical peel and tilt cycle ~3.2s
  const cycleSecondsPerLayer = layerHeightMm <= 0.015 ? 5.8 : layerHeightMm <= 0.03 ? 4.5 : 3.8;
  const printHours = Math.max(1.5, Number(((totalLayers * cycleSecondsPerLayer) / 3600).toFixed(2)));

  // 4. Infill & Weight Calculation
  // Resin infill formula: 30% shell structure + gyroid infill
  const effectiveInfillFactor = 0.30 + (infillPercent / 100) * 0.70;
  const printedPartVolumeCm3 = volumeCm3 * effectiveInfillFactor;
  const partWeightGrams = printedPartVolumeCm3 * material.densityGPerCm3;

  // 5. Support & Waste Calculation
  // Higher complexity increases support requirement (from 12% to 38%)
  const complexitySupportFactor = 0.12 + (complexity / 100) * 0.26;
  const wasteMultiplier = (config.baseWastePercentage / 100) * material.wasteFactorMultiplier * (1 + complexity / 150);
  const supportVolumeCm3 = volumeCm3 * complexitySupportFactor;
  const supportWeightGrams = supportVolumeCm3 * material.densityGPerCm3;
  const totalResinConsumedGrams = (partWeightGrams + supportWeightGrams) * (1 + wasteMultiplier);

  // Term 1: Material Cost
  const materialCost = Number(((partWeightGrams / 1000) * material.costPerKg).toFixed(2));

  // Term 2: Support / Waste Cost
  const supportWasteCost = Number((((totalResinConsumedGrams - partWeightGrams) / 1000) * material.costPerKg).toFixed(2));

  // Term 3: Printing Operations (Laser & Vat Consumables)
  const vatAndLaserConsumablesHourly = 0.85;
  const printingCost = Number((printHours * vatAndLaserConsumablesHourly).toFixed(2));

  // Term 4: Electricity Cost
  // Power draw in kW * hours * electricity rate ($/kWh)
  const electricityKwh = (config.machinePowerWatts / 1000) * printHours;
  const electricityCost = Number((electricityKwh * config.electricityRatePerKwh).toFixed(2));

  // Term 5: Machine Cost (Depreciation + Maintenance)
  const machineDepreciation = Number((printHours * config.machineHourlyRate).toFixed(2));

  // Term 6: Labor Cost
  // Technician Slicing + Machine Setup + Ultrasonic IPA Wash + UV Post-Cure + Support De-rafting
  const prepLaborHours = 0.25 + (complexity / 100) * 0.25;
  const postWashLaborHours = 0.30;
  const supportRemovalLaborHours = 0.25 + (complexity / 100) * 0.50;
  const finishLaborHours = finish.hourlyLaborRequired;
  const totalLaborHours = prepLaborHours + postWashLaborHours + supportRemovalLaborHours + finishLaborHours;
  const laborCost = Number((totalLaborHours * config.laborHourlyRate).toFixed(2));

  // Term 7: Finishing Cost (Artisan Materials & Surface Priming/Gilding)
  // Scale finishing cost if statue is large (height > 250mm)
  const scaleMultiplier = Math.max(1.0, heightMm / 200);
  const finishingCost = Number((finish.baseCost * scaleMultiplier).toFixed(2));

  // Term 8: Packaging Cost
  const packagingCost = Number(packaging.cost.toFixed(2));

  // Subtotal (Sum of all 8 production terms)
  const subtotalCost = Number(
    (
      materialCost +
      supportWasteCost +
      printingCost +
      electricityCost +
      machineDepreciation +
      laborCost +
      finishingCost +
      packagingCost
    ).toFixed(2)
  );

  // Term 9: Profit Margin
  const profitMarginPercent = config.targetProfitMarginPercent;
  const profitAmount = Number(((subtotalCost * profitMarginPercent) / 100).toFixed(2));

  // Final Price Calculation with Floor Enforcements
  let recommendedSellingPrice = Number((subtotalCost + profitAmount).toFixed(2));

  // Enforce Size Category Floors
  let sizeFloor = config.minimumSellingPrice;
  if (heightMm < 120) {
    sizeFloor = Math.max(sizeFloor, config.sizeCategoryPriceFloors['Miniature (1:12 Scale)'] || 35);
  } else if (heightMm < 190) {
    sizeFloor = Math.max(sizeFloor, config.sizeCategoryPriceFloors['Tabletop (1:8 Scale)'] || 75);
  } else if (heightMm < 290) {
    sizeFloor = Math.max(sizeFloor, config.sizeCategoryPriceFloors['Standard Display (1:6 Scale)'] || 160);
  } else if (heightMm < 450) {
    sizeFloor = Math.max(sizeFloor, config.sizeCategoryPriceFloors['Large Collector (1:4 Scale)'] || 320);
  } else if (heightMm < 750) {
    sizeFloor = Math.max(sizeFloor, config.sizeCategoryPriceFloors['Museum Bust (1:2 Scale)'] || 550);
  } else {
    sizeFloor = Math.max(sizeFloor, config.sizeCategoryPriceFloors['Monumental (Life-Size)'] || 1250);
  }

  if (recommendedSellingPrice < sizeFloor) {
    recommendedSellingPrice = sizeFloor;
  }

  return {
    materialCost,
    supportWasteCost,
    printingCost,
    electricityCost,
    machineDepreciation,
    laborCost,
    finishingCost,
    packagingCost,
    subtotalCost,
    profitMarginPercent,
    profitAmount,
    recommendedSellingPrice: Math.round(recommendedSellingPrice),
    effectivePrice: Math.round(recommendedSellingPrice),
    currency,
  };
}

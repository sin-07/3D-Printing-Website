export type Category = 
  | 'Functional Mechanisms'
  | 'Aerospace & Drones'
  | 'Industrial Tooling'
  | 'Filaments & Resins'
  | 'Robotics & Automation'
  | 'Rapid Prototyping'
  | 'Mythology' 
  | 'Cyberpunk' 
  | 'Dark Fantasy' 
  | 'Museum Busts' 
  | 'Limited Editions';

export type MaterialFinish = 
  | 'Carbon Fiber PA-CF'
  | 'PLA+ Biopolymer'
  | 'Industrial PETG'
  | 'ABS-ESD Heat Resistant'
  | 'TPU 95A Flexible'
  | '16K Tough Resin'
  | 'Obsidian Onyx'
  | 'Antique Bronze Patina'
  | 'Iridescent Cyber Chrome'
  | 'Alabaster White SLA'
  | '24K Gilded Gold Leaf'
  | 'Raw Translucent Resin';

export type Scale = '1/12 Scale' | '1/8 Scale' | '1/6 Scale' | '1/4 Scale' | 'Life-Size Bust' | '1:1 True Scale' | 'Custom Scale';

export interface MaterialOption {
  name: MaterialFinish;
  color: string;
  priceMultiplier: number;
  description: string;
}

export interface ScaleOption {
  scale: Scale;
  heightMm: number;
  widthMm: number;
  depthMm: number;
  weightKg: number;
  priceMultiplier: number;
}

export interface ProductReview {
  id: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  editionOwned: string;
  verifiedCollector: boolean;
  avatar?: string;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  category: Category;
  basePrice: number;
  image: string;
  galleryImages: string[];
  rarity: 'Mythic' | 'Legendary' | 'Limited Run' | 'Atelier Exclusive';
  editionSize: number;
  stockLeft: number;
  featured?: boolean;
  isVaultDrop?: boolean;
  dropTime?: string; // ISO date for countdown
  rating: number;
  reviewCount: number;
  description: string;
  lore: string;
  specs: {
    printResolution: string;
    layerHeight: string;
    infillDensity?: string;
    infillPattern?: string;
    printSpeed?: string;
    tensileStrength?: string;
    heatDeflection?: string;
    dimensionalTolerance?: string;
    nozzleTemp?: string;
    bedTemp?: string;
    resinType?: string;
    curingProcess?: string;
    assemblyType: string;
    baseMaterial: string;
    paintFinish?: string;
    certificateNFC?: boolean;
  };
  dimensions: {
    height: string;
    width: string;
    depth: string;
    weight: string;
  };
  materials: MaterialOption[];
  scales: ScaleOption[];
  includedInBox: string[];
  reviews: ProductReview[];
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  category: Category;
  selectedMaterial: MaterialFinish;
  selectedScale: Scale;
  customEngraving?: string;
  includeDisplayLighting?: boolean;
  unitPrice: number;
  quantity: number;
  editionNumber?: number;
}

export interface CustomCommissionOrder {
  fileName: string;
  fileSizeMb: number;
  volumeCm3: number;
  scalePercentage: number;
  material: string;
  infillDensity: number;
  finishType: string;
  estimatedPrintHours: number;
  estimatedPrice: number;
  layerHeight: string;
  notes?: string;
}

export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'AUD';

// ==========================================
// AI STATUE MEASUREMENT & PRICING TYPES
// ==========================================

export type MeasurementSource = 
  | '3d-model-derived'
  | 'measured-multiview'
  | 'measured-reference'
  | 'measured-user'
  | 'ai-estimated';

export type SizeCategory = 
  | 'Miniature (1:12 Scale)'
  | 'Tabletop (1:8 Scale)'
  | 'Standard Display (1:6 Scale)'
  | 'Large Collector (1:4 Scale)'
  | 'Museum Bust (1:2 Scale)'
  | 'Monumental (Life-Size)';

export type ManufacturingDifficulty = 'Low' | 'Moderate' | 'High' | 'Extreme';

export interface ConfidenceMetric<T = number> {
  value: T;
  unit?: string;
  confidence: number; // 0 to 100
  source: MeasurementSource;
  label?: string;
}

export interface StatueSegmentationBox {
  x: number;      // Bounding box X percentage (0-100)
  y: number;      // Bounding box Y percentage (0-100)
  width: number;  // Bounding box Width percentage (0-100)
  height: number; // Bounding box Height percentage (0-100)
  contourPoints?: Array<{ x: number; y: number }>;
}

export interface ReferenceScaleDetection {
  detected: boolean;
  type?: 'credit-card' | 'ruler' | 'coin' | 'custom-marker' | 'user-known-height' | 'none';
  realDimensionMm?: number;
  pixelLength?: number;
  pixelsPerMm?: number;
}

export interface StatueAnalysisResult {
  id: string;
  timestamp: string;
  imageUrls: {
    front?: string;
    side?: string;
    top?: string;
    back?: string;
    previewUrl?: string;
  };
  file3dName?: string;
  file3dSizeMb?: number;
  
  // Dimensions & Scale
  dimensions: {
    heightMm: ConfidenceMetric<number>;
    widthMm: ConfidenceMetric<number>;
    depthMm: ConfidenceMetric<number>;
  };
  sizeCategory: ConfidenceMetric<SizeCategory>;
  
  // Geometric properties
  volumeCm3: ConfidenceMetric<number>;
  surfaceAreaCm2: ConfidenceMetric<number>;
  infillDensityPercent: number;
  
  // Material & Weight
  detectedMaterial: ConfidenceMetric<string>;
  recommendedResinId: string;
  estimatedWeightGrams: ConfidenceMetric<number>;
  
  // Complexity & Slicing
  complexityScore: ConfidenceMetric<number>; // 1 - 100
  manufacturingDifficulty: ConfidenceMetric<ManufacturingDifficulty>;
  estimatedSupportVolumeCm3: number;
  estimatedMaterialConsumptionGrams: number;
  estimatedPrintHours: ConfidenceMetric<number>;
  totalLayerCount: number;
  layerHeightMm: number;
  
  // Segmentation visual data
  segmentation: StatueSegmentationBox;
  referenceScale?: ReferenceScaleDetection;
  
  // Quality & Verification
  overallConfidenceScore: number;
  manualVerificationRequired: boolean;
  warnings: string[];
  notes?: string;
}

export interface PricingBreakdown {
  materialCost: number;       // Raw resin/photopolymer cost
  supportWasteCost: number;   // Support structures & post-wash scrap
  printingCost: number;       // Layer laser exposure & peel cycle operations
  electricityCost: number;    // Machine power consumption (kWh)
  machineDepreciation: number;// Machine hourly depreciation & maintenance
  laborCost: number;          // Technician slicing, cleaning, UV cure & hand-prep
  finishingCost: number;      // Artisan surface sanding, priming, gilding or painting
  packagingCost: number;      // Foam crate, flight box, archival certification
  subtotalCost: number;       // Total production cost before margin
  profitMarginPercent: number;// Target atelier margin %
  profitAmount: number;       // Margin monetary value
  recommendedSellingPrice: number; // Final recommended price
  effectivePrice: number;     // Final price with any active discount
  currency: Currency;
}

export interface MaterialPricingDef {
  id: string;
  name: string;
  densityGPerCm3: number;
  costPerKg: number;
  description: string;
  colorHex: string;
  wasteFactorMultiplier: number;
}

export interface FinishPricingDef {
  id: string;
  name: string;
  baseCost: number;
  hourlyLaborRequired: number;
  description: string;
}

export interface PackagingPricingDef {
  id: string;
  name: string;
  cost: number;
  description: string;
}

export interface PricingConfig {
  id: string;
  version: string;
  updatedAt: string;
  materials: MaterialPricingDef[];
  finishes: FinishPricingDef[];
  packagingOptions: PackagingPricingDef[];
  machineHourlyRate: number;      // $ per hour
  electricityRatePerKwh: number;  // $ per kWh
  machinePowerWatts: number;      // Machine power rating in Watts (e.g. 150W)
  laborHourlyRate: number;        // $ per technician hour
  baseWastePercentage: number;    // % base support & purge waste
  targetProfitMarginPercent: number; // % profit margin
  minimumSellingPrice: number;    // Minimum order price threshold
  confidenceThresholdForVerification: number; // < 75% flags for manual review
  sizeCategoryPriceFloors: Record<string, number>;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  statueName: string;
  dimensionsMm: { width: number; height: number; depth: number };
  volumeCm3: number;
  materialUsed: string;
  source: MeasurementSource;
  confidenceScore: number;
  productionCost: number;
  quotedPrice: number;
  status: 'Auto-Approved' | 'Flagged for Review' | 'Admin-Approved' | 'User-Ordered';
  reviewedBy?: string;
  userModified: boolean;
  notes?: string;
}

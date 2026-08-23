export type Category = 'Mythology' | 'Cyberpunk' | 'Dark Fantasy' | 'Museum Busts' | 'Limited Editions';

export type MaterialFinish = 
  | 'Obsidian Onyx'
  | 'Antique Bronze Patina'
  | 'Iridescent Cyber Chrome'
  | 'Alabaster White SLA'
  | '24K Gilded Gold Leaf'
  | 'Raw Translucent Resin';

export type Scale = '1/12 Scale' | '1/8 Scale' | '1/6 Scale' | '1/4 Scale' | 'Life-Size Bust';

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
    resinType: string;
    curingProcess: string;
    assemblyType: string;
    baseMaterial: string;
    paintFinish: string;
    certificateNFC: boolean;
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

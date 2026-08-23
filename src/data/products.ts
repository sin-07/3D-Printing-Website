import { Product, MaterialOption, ScaleOption } from '@/types';

export const STANDARD_MATERIALS: MaterialOption[] = [
  {
    name: 'Obsidian Onyx',
    color: '#121217',
    priceMultiplier: 1.0,
    description: 'Deep matte obsidian black photopolymer with satin hand-buffed protective coating.'
  },
  {
    name: 'Antique Bronze Patina',
    color: '#6b5839',
    priceMultiplier: 1.15,
    description: 'Cold-cast bronze infusion treated with authentic verdigris oxidation and wax finish.'
  },
  {
    name: 'Iridescent Cyber Chrome',
    color: '#00d2ff',
    priceMultiplier: 1.25,
    description: 'Vacuum-deposited metallic titanium with dichroic chameleon refraction shift.'
  },
  {
    name: 'Alabaster White SLA',
    color: '#e8e8ed',
    priceMultiplier: 1.05,
    description: 'Ultra-pure white resin with translucent subsurface scattering and museum satin coat.'
  },
  {
    name: '24K Gilded Gold Leaf',
    color: '#d4af37',
    priceMultiplier: 1.45,
    description: 'Hand-laid 24-karat Florentine gold leaf accents sealed in scratch-resistant crystal clear coat.'
  },
  {
    name: 'Raw Translucent Resin',
    color: '#8b5cf6',
    priceMultiplier: 1.10,
    description: 'Optical-grade tinted smoked resin displaying internal support architecture and refraction.'
  },
];

export const STANDARD_SCALES: ScaleOption[] = [
  {
    scale: '1/8 Scale',
    heightMm: 245,
    widthMm: 160,
    depthMm: 140,
    weightKg: 1.4,
    priceMultiplier: 0.85,
  },
  {
    scale: '1/6 Scale',
    heightMm: 330,
    widthMm: 220,
    depthMm: 190,
    weightKg: 2.8,
    priceMultiplier: 1.0,
  },
  {
    scale: '1/4 Scale',
    heightMm: 510,
    widthMm: 340,
    depthMm: 300,
    weightKg: 6.2,
    priceMultiplier: 1.65,
  },
  {
    scale: 'Life-Size Bust',
    heightMm: 680,
    widthMm: 450,
    depthMm: 380,
    weightKg: 12.5,
    priceMultiplier: 2.9,
  },
];

export const PRODUCTS: Product[] = [
  {
    id: 'seraphim-archlyte',
    name: 'Seraphim Archlyte',
    tagline: 'Cybernetic Guardian of the Celestial Sphere',
    category: 'Mythology',
    basePrice: 580,
    image: '/images/hero_sculpture.jpg',
    galleryImages: [
      '/images/hero_sculpture.jpg',
      '/images/statue_valkyrie.jpg',
      '/images/statue_cyber_ronin.jpg'
    ],
    rarity: 'Mythic',
    editionSize: 250,
    stockLeft: 4,
    featured: true,
    rating: 4.98,
    reviewCount: 38,
    description: 'A monument to futuristic divinity. The Seraphim Archlyte features six articulated mechanical wings with gold hydraulic inlays, a dual-phase plasma blade, and an intricate runic pedestal incorporating internal LED conduits.',
    lore: 'Forged in the orbital spires of Neo-Eden, the Archlyte stood as the final warden against cosmic entropy. Each unit is individually serialized with quantum laser etching.',
    specs: {
      printResolution: '16K Ultra-HD Photopolymer (15 Micron)',
      layerHeight: '0.015 mm per slice',
      resinType: 'Aerospace-Grade High-Impact SLA Resin',
      curingProcess: '4-Stage 405nm Vacuum Nitrogen UV Polymerization',
      assemblyType: 'Neodymium N52 Magnetic Keying System',
      baseMaterial: 'Cast Obsidian Stone with Brushed Brass Nameplate',
      paintFinish: 'Multi-layer automotive matte coat with 24K gold accents',
      certificateNFC: true,
    },
    dimensions: {
      height: '330 mm (13.0 in)',
      width: '280 mm (11.0 in)',
      depth: '220 mm (8.7 in)',
      weight: '3.2 kg (7.0 lbs)',
    },
    materials: STANDARD_MATERIALS,
    scales: STANDARD_SCALES,
    includedInBox: [
      'Numbered Masterwork Statue',
      'Dual Interchangeable Helmets (Standard Visor & Open Face)',
      'Detachable Plasma Sword & Energy Shield',
      'Solid Cast Obsidian Base with Magnetic Mounts',
      'Solid Metal Certificate of Authenticity with Embedded NFC Chip',
      'Microfiber Precision Polishing Glove & Cleaning Brush',
      'Custom Laser-Cut High-Density Foam Flight Case'
    ],
    reviews: [
      {
        id: 'rev-1',
        author: 'Alexander Vance',
        location: 'Geneva, Switzerland',
        rating: 5,
        date: '2 weeks ago',
        title: 'Breathtaking layer precision and weight',
        comment: 'The 0.015mm layer resolution is literally imperceptible under a magnifying glass. The magnetic joints snap with an ultra-satisfying tactile click.',
        editionOwned: '#014 of 250',
        verifiedCollector: true
      },
      {
        id: 'rev-2',
        author: 'Evelyn Sterling',
        location: 'Tokyo, Japan',
        rating: 5,
        date: '1 month ago',
        title: 'Museum-grade centerpiece',
        comment: 'The 24K gold foil trim against the matte obsidian resin creates a chiaroscuro effect that elevates our gallery room. Outstanding packaging as well.',
        editionOwned: '#038 of 250',
        verifiedCollector: true
      }
    ]
  },
  {
    id: 'ares-god-of-war',
    name: 'Ares: The Undying Flame',
    tagline: 'Titan of the Spartan Crucible',
    category: 'Mythology',
    basePrice: 520,
    image: '/images/statue_ares.jpg',
    galleryImages: [
      '/images/statue_ares.jpg',
      '/images/hero_sculpture.jpg',
      '/images/statue_valkyrie.jpg'
    ],
    rarity: 'Legendary',
    editionSize: 500,
    stockLeft: 12,
    featured: true,
    rating: 4.95,
    reviewCount: 52,
    description: 'An aggressive, muscular masterpiece capturing the God of War mid-advance. Crafted with hand-oxidized cold-cast bronze and internal translucent resin conduits simulating a pulsating molten core.',
    lore: 'From the battlements of Mount Olympus to the ashes of Troy, Ares embodies unrelenting power. Cast with high-density ceramic resin infill for authentic bronze heft.',
    specs: {
      printResolution: '16K Ultra-HD Photopolymer (15 Micron)',
      layerHeight: '0.018 mm per slice',
      resinType: 'Ceramic-Infused Tough Resin',
      curingProcess: 'Thermal Post-Bake & Dual-Wavelength UV',
      assemblyType: 'Titanium Rod Reinforced Magnetic Keying',
      baseMaterial: 'Volcanic Basalt Stone Base',
      paintFinish: 'Authentic Cold-Cast Bronze Patina with Embers',
      certificateNFC: true,
    },
    dimensions: {
      height: '350 mm (13.8 in)',
      width: '240 mm (9.4 in)',
      depth: '210 mm (8.3 in)',
      weight: '3.6 kg (7.9 lbs)',
    },
    materials: STANDARD_MATERIALS,
    scales: STANDARD_SCALES,
    includedInBox: [
      'Ares Sculpted Figurine',
      'Forged Spartan Spear & Lion Crest Round Shield',
      'Textured Volcanic Rock Display Base',
      'NFC Encrypted Metal Certificate of Authenticity',
      'Collector Registration Card',
      'Reinforced Luxury Flight Case'
    ],
    reviews: [
      {
        id: 'rev-3',
        author: 'Marcus Aurelius K.',
        location: 'Rome, Italy',
        rating: 5,
        date: '3 weeks ago',
        title: 'The bronze finish looks 2,000 years old yet brand new',
        comment: 'Unbelievable anatomy details. The subtle red glow from the chest cavity under ambient lighting is mesmerizing.',
        editionOwned: '#112 of 500',
        verifiedCollector: true
      }
    ]
  },
  {
    id: 'cyber-ronin-2099',
    name: 'Ronin 2099: Neon Shadow',
    tagline: 'Last Samurai of the Megacity Underbelly',
    category: 'Cyberpunk',
    basePrice: 620,
    image: '/images/statue_cyber_ronin.jpg',
    galleryImages: [
      '/images/statue_cyber_ronin.jpg',
      '/images/hero_sculpture.jpg',
      '/images/statue_anubis.jpg'
    ],
    rarity: 'Legendary',
    editionSize: 300,
    stockLeft: 7,
    featured: true,
    rating: 4.99,
    reviewCount: 64,
    description: 'Merging feudal Japanese warrior armor with futuristic cybernetics. Features twin high-frequency neon cyan katanas with fiber-optic micro-illumination and a carbon fiber textured armor weave.',
    lore: 'In the smog-choked neon alleys of Neo-Shinjuku, the code of Bushido was rewritten in binary. Every tube, piston, and kanji etching is rendered in crisp 16K resin precision.',
    specs: {
      printResolution: '16K SLA Matrix',
      layerHeight: '0.015 mm per slice',
      resinType: 'Carbon-Polymer SLA Blend',
      curingProcess: 'Nitrogen-Purged UV Chamber',
      assemblyType: 'Precision Slide-Lock Magnetic Pins',
      baseMaterial: 'Shattered Asphalt & Neon Sign Base with Light-Up LEDs',
      paintFinish: 'Carbon Weave Texture + Dual Fluorescent Cyan Highlights',
      certificateNFC: true,
    },
    dimensions: {
      height: '340 mm (13.4 in)',
      width: '260 mm (10.2 in)',
      depth: '230 mm (9.1 in)',
      weight: '3.1 kg (6.8 lbs)',
    },
    materials: STANDARD_MATERIALS,
    scales: STANDARD_SCALES,
    includedInBox: [
      'Ronin 2099 Masterwork Statue',
      'Dual Illuminating Energy Katanas',
      'Swap-out Oni Combat Respirator Helmet',
      'Neo-Tokyo Neon Sign Display Base with USB-C Power',
      'Metal Collector Card & NFC Key',
      'Custom Fitted Hard Shell Atelier Case'
    ],
    reviews: [
      {
        id: 'rev-4',
        author: 'Kenji Takahashi',
        location: 'Osaka, Japan',
        rating: 5,
        date: '1 week ago',
        title: 'Peak cyberpunk art sculpture',
        comment: 'The carbon fiber weave pattern printed into the armor plates is astounding. The LED light-up base completes the entire atmosphere.',
        editionOwned: '#042 of 300',
        verifiedCollector: true
      }
    ]
  },
  {
    id: 'cyber-anubis',
    name: 'Cyber Anubis: Embalmer of Stars',
    tagline: 'Neo-Egyptian Deity of the Stellar Necropolis',
    category: 'Mythology',
    basePrice: 650,
    image: '/images/statue_anubis.jpg',
    galleryImages: [
      '/images/statue_anubis.jpg',
      '/images/statue_nefertiti.jpg',
      '/images/statue_ares.jpg'
    ],
    rarity: 'Mythic',
    editionSize: 150,
    stockLeft: 2,
    featured: true,
    isVaultDrop: true,
    dropTime: '2026-09-01T00:00:00Z',
    rating: 5.0,
    reviewCount: 29,
    description: 'An imposing 1/6 scale rendition of Anubis reimagined with futuristic bionic exo-armor, hieroglyphic micro-inscriptions, and a 24K gold plated Was-scepter.',
    lore: 'Guardian of the digital afterlife and keeper of cosmic equilibrium. The armor incorporates genuine 24-karat gold leaf gilded by master artisans.',
    specs: {
      printResolution: '16K Ultra-HD Photopolymer',
      layerHeight: '0.012 mm per slice',
      resinType: 'Optical & Ceramic Photopolymer',
      curingProcess: 'Tri-Phase UV Curing with Thermal Annealing',
      assemblyType: 'High-Strength Rare-Earth Magnetic Mounts',
      baseMaterial: 'Polished Black Marquina Marble Plinth with Underglow',
      paintFinish: 'Florentine 24K Gold Leaf over Satin Obsidian',
      certificateNFC: true,
    },
    dimensions: {
      height: '380 mm (15.0 in)',
      width: '210 mm (8.3 in)',
      depth: '210 mm (8.3 in)',
      weight: '4.2 kg (9.3 lbs)',
    },
    materials: STANDARD_MATERIALS,
    scales: STANDARD_SCALES,
    includedInBox: [
      'Cyber Anubis Statue with Gold Accents',
      'Ornate Gilded Was-Scepter with Blue Crystal Core',
      'Illuminated Marble Plinth Base',
      'Gold-Plated Solid Brass Certificate of Authenticity',
      'White Velvet Handling Gloves',
      'Reinforced Flight Crate'
    ],
    reviews: [
      {
        id: 'rev-5',
        author: 'Julian Croft',
        location: 'London, UK',
        rating: 5,
        date: '5 days ago',
        title: 'The gold leaf and deep obsidian contrast is unbelievable',
        comment: 'Worth every single penny. It feels like an artifact recovered from a futuristic pyramid. Outstanding craft.',
        editionOwned: '#007 of 150',
        verifiedCollector: true
      }
    ]
  },
  {
    id: 'valkyrie-ascendant',
    name: 'Valkyrie Ascendant',
    tagline: 'Winged Chooser of the Slain',
    category: 'Mythology',
    basePrice: 590,
    image: '/images/statue_valkyrie.jpg',
    galleryImages: [
      '/images/statue_valkyrie.jpg',
      '/images/hero_sculpture.jpg',
      '/images/statue_ares.jpg'
    ],
    rarity: 'Legendary',
    editionSize: 350,
    stockLeft: 9,
    featured: true,
    rating: 4.97,
    reviewCount: 44,
    description: 'Dynamic soaring composition featuring individual feathered wings with iridescent micro-pigment finish, flowing translucent SLA drapery, and a runic spear tip.',
    lore: 'Bearing the fallen warriors to the golden halls of Valhalla, the Valkyrie balances grace with lethal martial prowess.',
    specs: {
      printResolution: '16K SLA Matrix',
      layerHeight: '0.015 mm per slice',
      resinType: 'Optical Translucent & Rigid High-Modulus Resin',
      curingProcess: 'Dual UV Vacuum Polymerization',
      assemblyType: 'Internal Steel Core Magnetic Jointing',
      baseMaterial: 'Runic Yggdrasil Black Granite Base',
      paintFinish: 'Prismatic Silver Leaf & Translucent Silk Shading',
      certificateNFC: true,
    },
    dimensions: {
      height: '360 mm (14.2 in)',
      width: '310 mm (12.2 in)',
      depth: '240 mm (9.4 in)',
      weight: '3.4 kg (7.5 lbs)',
    },
    materials: STANDARD_MATERIALS,
    scales: STANDARD_SCALES,
    includedInBox: [
      'Valkyrie Ascendant Figurine',
      'Dual Feathered Wing Assemblies (Magnetic Quick-Attach)',
      'Translucent Runic Crystalline Spear',
      'Yggdrasil Granite Display Base',
      'Laser-Etched Metal Certificate with NFC',
      'Custom Luxury Atelier Case'
    ],
    reviews: [
      {
        id: 'rev-6',
        author: 'Freja Lindqvist',
        location: 'Stockholm, Sweden',
        rating: 5,
        date: '2 weeks ago',
        title: 'The wings and translucent gown are pure magic',
        comment: 'How they managed to 3D print and finish the cloth translucency while keeping the feather edges razor sharp is beyond comprehension.',
        editionOwned: '#089 of 350',
        verifiedCollector: true
      }
    ]
  },
  {
    id: 'void-harbinger',
    name: 'Void Harbinger: Eldritch Gaze',
    tagline: 'Abyssal Entity from Beyond the Veil',
    category: 'Dark Fantasy',
    basePrice: 680,
    image: '/images/statue_void_harbinger.jpg',
    galleryImages: [
      '/images/statue_void_harbinger.jpg',
      '/images/statue_mecha_dragon.jpg',
      '/images/hero_sculpture.jpg'
    ],
    rarity: 'Atelier Exclusive',
    editionSize: 100,
    stockLeft: 3,
    featured: true,
    rating: 5.0,
    reviewCount: 21,
    description: 'A deeply detailed eldritch skull fused with cosmic writhing tentacles and glowing UV purple bio-resins. Each tentacle features suction cups and eldritch runes illuminated by blacklight-reactive pigments.',
    lore: 'Whispered in forbidden tomes, the Void Harbinger watches across dimensions. An uncompromising piece for lovers of dark gothic and cosmic horror art.',
    specs: {
      printResolution: '16K Ultra-HD SLA',
      layerHeight: '0.015 mm per slice',
      resinType: 'Fluorescent Photo-Reactive UV Resin',
      curingProcess: 'Multi-Frequency UV Chamber',
      assemblyType: 'Multi-Branch Magnetic Modular Keys',
      baseMaterial: 'Ancient Ruin Altar Pedestal with Glyphs',
      paintFinish: 'Blackened Bone Patina & UV Reactive Purple Core',
      certificateNFC: true,
    },
    dimensions: {
      height: '320 mm (12.6 in)',
      width: '270 mm (10.6 in)',
      depth: '250 mm (9.8 in)',
      weight: '3.8 kg (8.4 lbs)',
    },
    materials: STANDARD_MATERIALS,
    scales: STANDARD_SCALES,
    includedInBox: [
      'Void Harbinger Skull & Tentacle Assembly',
      'UV Illumination Micro-Spotlight (USB-C)',
      'Ancient Runic Altar Stone Base',
      'Solid Black Titanium Authenticity Card with NFC',
      'Atelier Protective Polishing Kit',
      'Hardened Flight Travel Case'
    ],
    reviews: [
      {
        id: 'rev-7',
        author: 'Dorian Graves',
        location: 'Boston, USA',
        rating: 5,
        date: '3 weeks ago',
        title: 'Dark art perfection',
        comment: 'When the blacklight hits the purple resin channels, the entire room transforms. Incredible tactile texture.',
        editionOwned: '#019 of 100',
        verifiedCollector: true
      }
    ]
  },
  {
    id: 'david-metallic-kintsugi',
    name: 'David: Metallic Kintsugi',
    tagline: 'Classical Perfection Rebuilt in Gold & Titanium',
    category: 'Museum Busts',
    basePrice: 720,
    image: '/images/statue_celestial_david.jpg',
    galleryImages: [
      '/images/statue_celestial_david.jpg',
      '/images/statue_nefertiti.jpg',
      '/images/hero_sculpture.jpg'
    ],
    rarity: 'Mythic',
    editionSize: 200,
    stockLeft: 5,
    featured: true,
    rating: 4.98,
    reviewCount: 37,
    description: 'A museum-grade 1/3 scale bust of Michelangelo’s David, rendered in liquid mirror chrome with 3D-sculpted fracture lines filled with 24-karat gold kintsugi texture.',
    lore: 'Honoring the Japanese philosophy of Wabi-Sabi—finding beauty in imperfection and resilience. A breathtaking centerpiece for modern luxury spaces.',
    specs: {
      printResolution: '16K SLA Photopolymer Matrix',
      layerHeight: '0.010 mm per slice',
      resinType: 'Optical Density High-Definition SLA Resin',
      curingProcess: 'Vacuum UV Annealing',
      assemblyType: 'Single-Piece Monolithic Sculpture',
      baseMaterial: 'Nero Marquina Solid Black Marble Plinth',
      paintFinish: 'Mirror Electroplated Chrome with 24K Gold Kintsugi Infill',
      certificateNFC: true,
    },
    dimensions: {
      height: '420 mm (16.5 in)',
      width: '280 mm (11.0 in)',
      depth: '240 mm (9.4 in)',
      weight: '5.6 kg (12.3 lbs)',
    },
    materials: STANDARD_MATERIALS,
    scales: STANDARD_SCALES,
    includedInBox: [
      'David Kintsugi Life-Scale Bust',
      'Solid Black Nero Marquina Marble Base with Engraved Gold Plate',
      'NFC Smart Certificate of Authenticity',
      'Jeweler-Grade Microfiber Buffing Cloth',
      'Handmade Wooden Collector Box with Velvet Lining'
    ],
    reviews: [
      {
        id: 'rev-8',
        author: 'Victoria Laurent',
        location: 'Paris, France',
        rating: 5,
        date: '1 month ago',
        title: 'Belongs in a contemporary art museum',
        comment: 'The mirror chrome reflection is flawless and the gold kintsugi inlays have stunning tactile relief. Everyone who visits stops and stares.',
        editionOwned: '#054 of 200',
        verifiedCollector: true
      }
    ]
  },
  {
    id: 'nefertiti-cybernetic-reign',
    name: 'Nefertiti: Cybernetic Reign',
    tagline: 'The Pharaoh of the Solar Grid',
    category: 'Museum Busts',
    basePrice: 690,
    image: '/images/statue_nefertiti.jpg',
    galleryImages: [
      '/images/statue_nefertiti.jpg',
      '/images/statue_anubis.jpg',
      '/images/statue_celestial_david.jpg'
    ],
    rarity: 'Legendary',
    editionSize: 250,
    stockLeft: 8,
    featured: false,
    rating: 4.96,
    reviewCount: 31,
    description: 'An ethereal portrait bust of Queen Nefertiti in pure matte alabaster resin, adorned with illuminated 24K gold cybernetic traces across her headdress, neck, and collar.',
    lore: 'Bridging the ancient 18th Dynasty of Egypt with advanced technological elegance. Features micro-LED backlit conduits embedded beneath the resin skin.',
    specs: {
      printResolution: '16K SLA Photopolymer',
      layerHeight: '0.012 mm per slice',
      resinType: 'Alabaster-Infused Translucent Resin',
      curingProcess: 'UV Nitrogen Bath Polymerization',
      assemblyType: 'Monolithic Bust with Integrated Power Base',
      baseMaterial: 'Brushed Bronze Pedestal with Dimmer Dial',
      paintFinish: 'Matte Alabaster with 24K Florentine Gold Circuitry',
      certificateNFC: true,
    },
    dimensions: {
      height: '440 mm (17.3 in)',
      width: '220 mm (8.7 in)',
      depth: '240 mm (9.4 in)',
      weight: '4.8 kg (10.6 lbs)',
    },
    materials: STANDARD_MATERIALS,
    scales: STANDARD_SCALES,
    includedInBox: [
      'Nefertiti Cybernetic Bust',
      'Brushed Bronze Pedestal Base with Touch Dimmer',
      'USB-C Braided Gold Power Cable',
      'NFC Encrypted Metal Certificate of Authenticity',
      'Collector Velvet Dust Bag & Polishing Cloth',
      'Laser-Fitted Flight Case'
    ],
    reviews: [
      {
        id: 'rev-9',
        author: 'Soraya Mansoor',
        location: 'Dubai, UAE',
        rating: 5,
        date: '2 weeks ago',
        title: 'Sublime regal beauty',
        comment: 'The gentle warm illumination coming from within the alabaster is extraordinary. A true masterwork.',
        editionOwned: '#031 of 250',
        verifiedCollector: true
      }
    ]
  },
  {
    id: 'serpentus-mechanica',
    name: 'Serpentus Mechanica: Iron Wyrm',
    tagline: 'Apex Predator of the Geared Abyss',
    category: 'Cyberpunk',
    basePrice: 740,
    image: '/images/statue_mecha_dragon.jpg',
    galleryImages: [
      '/images/statue_mecha_dragon.jpg',
      '/images/statue_cyber_ronin.jpg',
      '/images/hero_sculpture.jpg'
    ],
    rarity: 'Mythic',
    editionSize: 100,
    stockLeft: 1,
    featured: true,
    isVaultDrop: true,
    dropTime: '2026-08-30T18:00:00Z',
    rating: 5.0,
    reviewCount: 18,
    description: 'An immense mecha dragon coiling around an obsidian monolith. Features hundreds of individually articulated 3D printed mechanical scales, hydraulic wing struts, and glowing amber optics.',
    lore: 'The ultimate apex predator created in clandestine robotics laboratories. A complex feat of SLA 3D printing engineering featuring over 60 interlocking printed components.',
    specs: {
      printResolution: '16K SLA Matrix',
      layerHeight: '0.015 mm per slice',
      resinType: 'Titanium-Powder SLA Composite Resin',
      curingProcess: 'Thermal Stabilization & 405nm UV Wash',
      assemblyType: 'Multi-Component Magnet & Steel Pin Locking',
      baseMaterial: 'Cast Obsidian Monolith Base with Halo Underlight',
      paintFinish: 'Gunmetal Titanium with Heat-Treated Bronze Accents',
      certificateNFC: true,
    },
    dimensions: {
      height: '460 mm (18.1 in)',
      width: '380 mm (15.0 in)',
      depth: '320 mm (12.6 in)',
      weight: '5.8 kg (12.8 lbs)',
    },
    materials: STANDARD_MATERIALS,
    scales: STANDARD_SCALES,
    includedInBox: [
      'Serpentus Mechanica Multi-Part Sculpture',
      'Dual Extended Mechanical Wings with Hydraulic Hinges',
      'Illuminated Obsidian Monolith Base',
      'Numbered Metal Certificate of Authenticity with NFC',
      'Artisan Assembly Manual & Tool Key',
      'Heavy-Duty Crated Flight Case'
    ],
    reviews: [
      {
        id: 'rev-10',
        author: 'Maximilian Vance',
        location: 'Berlin, Germany',
        rating: 5,
        date: '4 days ago',
        title: 'The engineering complexity is unbelievable',
        comment: 'Every hydraulic piston and scale edge is flawless. The weight and stability are incredible. Best collectible in my 15-year collection.',
        editionOwned: '#008 of 100',
        verifiedCollector: true
      }
    ]
  }
];

export const CATEGORIES: { id: string; name: string; description: string; count: number; image: string }[] = [
  {
    id: 'Mythology',
    name: 'Mythology & Gods',
    description: 'Ancient pantheons, celestial seraphs, and legendary deities reborn in high-detail 16K resin.',
    count: 14,
    image: '/images/hero_sculpture.jpg',
  },
  {
    id: 'Cyberpunk',
    name: 'Cyberpunk & Dystopia',
    description: 'Cybernetic ronins, mecha beasts, and neon warriors from the far future.',
    count: 18,
    image: '/images/statue_cyber_ronin.jpg',
  },
  {
    id: 'Dark Fantasy',
    name: 'Dark Fantasy & Eldritch',
    description: 'Cosmic horrors, abyssal wyrms, and gothic guardians forged in shadow and UV photopolymers.',
    count: 9,
    image: '/images/statue_void_harbinger.jpg',
  },
  {
    id: 'Museum Busts',
    name: 'Museum Art & Busts',
    description: 'Classical art masterpieces reimagined with gold kintsugi, cybernetic conduits, and marble finishes.',
    count: 11,
    image: '/images/statue_celestial_david.jpg',
  },
];

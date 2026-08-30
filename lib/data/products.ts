export interface Product {
  id: string;
  title: string;
  category: "Electronics" | "Deals" | "Home" | "Fashion" | "Beauty" | "Baby Registry" | "Wedding Registry" | "Customer Service";
  subCategory?: string;
  price: number; // Base price in INR
  originalPrice?: number;
  currencyPrices: Record<"INR" | "USD" | "EUR" | "GBP" | "JPY", number>;
  rating: number;
  reviewCount: number;
  isPrime: boolean;
  isBestSeller?: boolean;
  inStock: boolean;
  stockCount: number;
  image: string;
  galleryImages: string[];
  description: string;
  features: string[];
  specifications: Record<string, string>;
  isService?: boolean;
}

export const CATEGORIES = [
  "All",
  "Today's Deals",
  "Electronics",
  "Home",
  "Fashion",
  "Baby Registry",
  "Wedding Registry",
  "Customer Service",
] as const;

export const COUNTRIES = [
  { name: "India", code: "IN", currency: "INR", symbol: "₹", rate: 1 },
  { name: "United States", code: "US", currency: "USD", symbol: "$", rate: 0.012 },
  { name: "United Kingdom", code: "GB", currency: "GBP", symbol: "£", rate: 0.0094 },
  { name: "Germany", code: "DE", currency: "EUR", symbol: "€", rate: 0.011 },
  { name: "Japan", code: "JP", currency: "JPY", symbol: "¥", rate: 1.82 },
  { name: "Canada", code: "CA", currency: "USD", symbol: "$", rate: 0.016 },
  { name: "Australia", code: "AU", currency: "USD", symbol: "$", rate: 0.018 },
  { name: "United Arab Emirates", code: "AE", currency: "USD", symbol: "AED ", rate: 0.044 },
] as const;

export const PRODUCTS: Product[] = [
  {
    id: "amzn-elec-01",
    title: "Sony WH-1000XM5 Wireless Industry Leading Noise Canceling Headphones",
    category: "Electronics",
    subCategory: "Audio",
    price: 26990,
    originalPrice: 34990,
    currencyPrices: { INR: 26990, USD: 329.99, EUR: 309.99, GBP: 269.99, JPY: 49500 },
    rating: 4.8,
    reviewCount: 14280,
    isPrime: true,
    isBestSeller: true,
    inStock: true,
    stockCount: 42,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80",
    ],
    description: "Two processors control 8 microphones for unprecedented noise cancellation. With Auto NC Optimizer, noise canceling is automatically optimized based on your wearing conditions and environment.",
    features: [
      "Industry Leading Noise Cancellation with 8 microphones & Auto NC Optimizer",
      "Magnificent Sound engineered with the new Integrated Processor V1",
      "Crystal clear hands-free calling with 4 beamforming microphones",
      "Up to 30-hour battery life with quick charging (3 min charge for 3 hours of playback)",
      "Ultra-comfortable, lightweight design with soft fit leather",
    ],
    specifications: {
      Brand: "Sony",
      Model: "WH-1000XM5",
      Color: "Black",
      Connectivity: "Bluetooth 5.2 / 3.5mm AUX",
      BatteryLife: "30 Hours",
      Weight: "250g",
    },
  },
  {
    id: "amzn-elec-02",
    title: "Apple MacBook Air 15-inch M3 Chip (16GB Unified Memory, 512GB SSD)",
    category: "Electronics",
    subCategory: "Laptops",
    price: 134900,
    originalPrice: 144900,
    currencyPrices: { INR: 134900, USD: 1499.00, EUR: 1419.00, GBP: 1249.00, JPY: 228000 },
    rating: 4.9,
    reviewCount: 3820,
    isPrime: true,
    isBestSeller: true,
    inStock: true,
    stockCount: 18,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80",
    ],
    description: "Supercharged by the next-generation M3 chip, the redesigned MacBook Air combines incredible performance and up to 18 hours of battery life into a strikingly thin aluminum enclosure.",
    features: [
      "Apple M3 8-core CPU with 10-core GPU",
      "15.3-inch Liquid Retina Display with True Tone (500 nits)",
      "1080p FaceTime HD camera with three-mic array",
      "Six-speaker sound system with Spatial Audio",
      "MagSafe 3 charging port with two Thunderbolt ports",
    ],
    specifications: {
      Brand: "Apple",
      Model: "MacBook Air 15 (M3)",
      RAM: "16GB Unified",
      Storage: "512GB PCIe SSD",
      Display: "15.3-inch Liquid Retina",
      Weight: "1.51 kg",
    },
  },
  {
    id: "amzn-deal-01",
    title: "Echo Dot (5th Gen, 2024 release) Smart Speaker with Alexa & Deep Bass",
    category: "Deals",
    subCategory: "Smart Home",
    price: 3499,
    originalPrice: 5499,
    currencyPrices: { INR: 3499, USD: 39.99, EUR: 37.99, GBP: 34.99, JPY: 6200 },
    rating: 4.7,
    reviewCount: 58940,
    isPrime: true,
    inStock: true,
    stockCount: 120,
    image: "https://images.unsplash.com/photo-1543512214-318c7553f230?w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1543512214-318c7553f230?w=800&q=80",
    ],
    description: "Our best-sounding Echo Dot yet: Enjoy an improved audio experience compared to any previous Echo Dot with Alexa for clearer vocals, deeper bass, and vibrant sound in any room.",
    features: [
      "Deeper bass and clearer vocals across all genres",
      "Built-in temperature sensor for smart home automation",
      "Voice control smart appliances, lights, and ACs",
      "Privacy-focused with microphone off button",
    ],
    specifications: {
      Brand: "Amazon",
      Generation: "5th Generation",
      Audio: "1.73” front-firing speaker",
      Connectivity: "Dual-band Wi-Fi & Bluetooth",
    },
  },
  {
    id: "amzn-home-01",
    title: "Dyson V15 Detect Cordless Vacuum Cleaner with Laser Dust Illumination",
    category: "Home",
    subCategory: "Appliances",
    price: 52900,
    originalPrice: 65900,
    currencyPrices: { INR: 52900, USD: 649.99, EUR: 599.99, GBP: 529.99, JPY: 96000 },
    rating: 4.8,
    reviewCount: 4520,
    isPrime: true,
    inStock: true,
    stockCount: 15,
    image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&q=80",
    ],
    description: "Most powerful, intelligent cordless vacuum. Laser reveals microscopic dust. Intelligently adapts power and run time. Scientific proof of a deep clean.",
    features: [
      "Piezo sensor continuously sizes and counts dust particles",
      "Laser Slim Fluffy cleaner head reveals invisible dust on hard floors",
      "Up to 60 minutes of fade-free runtime with whole-machine filtration",
      "Digital Motorbar cleaner head detangles hair automatically",
    ],
    specifications: {
      Brand: "Dyson",
      SuctionPower: "230 AW",
      Runtime: "60 minutes",
      BinVolume: "0.77 Liters",
      Weight: "3.0 kg",
    },
  },
  {
    id: "amzn-fash-01",
    title: "Men's Waterproof Breathable Windbreaker Mountain Parka Jacket",
    category: "Fashion",
    subCategory: "Outerwear",
    price: 4299,
    originalPrice: 7999,
    currencyPrices: { INR: 4299, USD: 52.99, EUR: 48.99, GBP: 42.99, JPY: 7800 },
    rating: 4.6,
    reviewCount: 6810,
    isPrime: true,
    inStock: true,
    stockCount: 85,
    image: "https://images.unsplash.com/photo-1548883354-7622d03aca27?w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1548883354-7622d03aca27?w=800&q=80",
    ],
    description: "Engineered for extreme performance and all-weather comfort. Features fully taped seams, YKK water-guard zippers, and an adjustable storm hood.",
    features: [
      "Waterproof Rating: 15,000mm H2O",
      "Breathable membrane prevents sweat accumulation",
      "Fleece-lined collar and handwarmer pockets",
      "Interior storm flap with chin guard",
    ],
    specifications: {
      Material: "100% Ripstop Nylon",
      Fit: "Standard Athletic",
      Care: "Machine Wash Cold",
    },
  },
  {
    id: "amzn-baby-01",
    title: "Infant Optics DXR-8 PRO 5-inch HD Video Baby Monitor with Active Noise Reduction",
    category: "Baby Registry",
    subCategory: "Nursery",
    price: 14500,
    originalPrice: 18900,
    currencyPrices: { INR: 14500, USD: 179.99, EUR: 165.00, GBP: 145.00, JPY: 26500 },
    rating: 4.9,
    reviewCount: 19500,
    isPrime: true,
    inStock: true,
    stockCount: 30,
    image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80",
    ],
    description: "Next-generation video baby monitor with Active Noise Reduction (ANR) that filters out background noise from fans, purifiers, and ACs so you only hear your baby.",
    features: [
      "5.0-inch 720p HD Display with vibrant colors",
      "Active Noise Reduction technology filters ambient sounds",
      "Interchangeable optical lens for zoom and wide-angle views",
      "Hacks-proof closed-loop 2.4GHz FHSS security (No Wi-Fi needed)",
    ],
    specifications: {
      Brand: "Infant Optics",
      Screen: "5.0-inch LCD",
      WirelessRange: "1000 ft",
      NightVision: "Infrared HD",
    },
  },
  {
    id: "amzn-wed-01",
    title: "Le Creuset Enameled Cast Iron Signature Round Dutch Oven (5.5 Qt, Cerise)",
    category: "Wedding Registry",
    subCategory: "Cookware",
    price: 29900,
    originalPrice: 38000,
    currencyPrices: { INR: 29900, USD: 399.95, EUR: 360.00, GBP: 315.00, JPY: 54000 },
    rating: 5.0,
    reviewCount: 11400,
    isPrime: true,
    isBestSeller: true,
    inStock: true,
    stockCount: 22,
    image: "https://images.unsplash.com/photo-1584990347449-397cf1e50529?w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1584990347449-397cf1e50529?w=800&q=80",
    ],
    description: "The iconic Le Creuset Dutch oven is indispensable in the kitchens of home cooks and professional chefs alike. Expertly crafted from enameled cast iron for supreme heat retention and even heat distribution.",
    features: [
      "Enameled cast iron delivers superior heat distribution and retention",
      "Ready to use, requires no seasoning",
      "Easy-to-clean and durable enamel resists dulling, staining, and cracking",
      "Oven-safe up to 500°F with stainless steel knob",
    ],
    specifications: {
      Brand: "Le Creuset",
      Capacity: "5.5 Quarts",
      Material: "Enameled Cast Iron",
      Origin: "France",
      Warranty: "Lifetime",
    },
  },
  {
    id: "amzn-serv-01",
    title: "Amazon Prime Protection & Extended 3-Year Damage Care Warranty",
    category: "Customer Service",
    subCategory: "Protection Plans",
    price: 1999,
    originalPrice: 2999,
    currencyPrices: { INR: 1999, USD: 24.99, EUR: 22.99, GBP: 19.99, JPY: 3600 },
    rating: 4.8,
    reviewCount: 38900,
    isPrime: true,
    inStock: true,
    stockCount: 9999,
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80",
    ],
    description: "Complete hassle-free coverage including drops, spills, mechanical failure, and battery degradation with free doorstep pickup and 48-hour repair turnaround.",
    features: [
      "100% Parts & Labor coverage with Zero Deductible",
      "Accidental damage from drops and liquid spills covered",
      "24/7 dedicated priority concierge customer support",
      "Full refund or immediate replacement if unrepairable",
    ],
    specifications: {
      Provider: "Amazon Care",
      Duration: "3 Years",
      Deductible: "$0 / ₹0",
      Coverage: "Global",
    },
    isService: true,
  },
];

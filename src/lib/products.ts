import { db, isFirebaseConfigured } from "@/lib/firebase";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  setDoc,
  deleteDoc
} from "firebase/firestore";

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  price?: number;
  priceOnRequest?: boolean;
  stock: "In stock" | "Limited stock" | "Available on order" | "Coming soon";
  rating: number;
  reviewsCount: number;
  src: string; // Your image path here (e.g. "/steel.jpeg", "/jay-e.jpeg", or "/images/products/item.jpg")
  image?: string; // Kept for backward compatibility
  featured: boolean;
  specifications: Record<string, string>;
  features: string[];
}

export const products: Product[] = [
  {
    id: "submersible-borehole-pump-4sp",
    sku: "JAX-PMP-001",
    name: "4\" Deep Well Submersible Borehole Pump (4SP Series)",
    category: "Water Pumps",
    tagline: "High-head stainless steel multi-stage borehole pumping system",
    description: "Engineered specifically for deep groundwater extraction in Kenyan terrain. Built with corrosion-resistant AISI 304 stainless steel stages, floating impellers for sand tolerance up to 150g/m³, and high-torque water-filled rewindable motor.",
    price: 48500,
    stock: "In stock",
    rating: 4.9,
    reviewsCount: 38,
    src: "/all pumps.webp",
    image: "/all pumps.webp",
    featured: true,
    specifications: {
      "Motor Rating": "2.2 kW / 3.0 HP (Single/Three Phase)",
      "Max Head": "180 Meters",
      "Optimal Flow Rate": "6.0 – 12.0 m³/h",
      "Discharge Outlet": "2.0 Inch Female BSP",
      "Casing Diameter": "Minimum 4 Inch (100mm)",
      "Material": "AISI 304 Stainless Steel Housing & Shaft",
      "Warranty": "2 Years Manufacturer Warranty"
    },
    features: [
      "Floating impeller design maximizes sand and silt tolerance",
      "Integrated non-return check valve prevents water hammer shock",
      "Food-grade fluid-filled submersible motor for continuous duty",
      "Supplied with splice kit and 30m submersible drop cable"
    ]
  },
  {
    id: "solar-submersible-pump-system",
    sku: "JAX-SOL-002",
    name: "Solar DC Brushless Submersible Pump System (72V/110V)",
    category: "Solar Water Equipment",
    tagline: "Zero electricity bill groundwater pumping powered by the sun",
    description: "Permanent magnet brushless DC motor pump designed for off-grid farms, rural water schemes, and eco-lodges. Includes intelligent MPPT solar pump controller with water level sensor inputs and dry-run safety cut-off.",
    price: 72000,
    stock: "In stock",
    rating: 5.0,
    reviewsCount: 42,
    src: "/pv.webp",
    image: "/pv.webp",
    featured: true,
    specifications: {
      "Operating Voltage": "72V – 110V DC (MPPT Range 90V–180V)",
      "Motor Power": "1500 Watts (Brushless Permanent Magnet)",
      "Max Head": "120 Meters",
      "Max Flow": "4,500 Litres/Hour",
      "Controller": "Smart digital MPPT Controller with LED diagnostic display",
      "Recommended Solar Panels": "4 x 450W Monocrystalline PV panels",
      "Warranty": "3 Years Warranty"
    },
    features: [
      "Maximum Power Point Tracking (MPPT) efficiency up to 99%",
      "Automatic start at sunrise and shutdown at dusk",
      "Low water level borehole sensor to prevent dry running",
      "High storage tank overflow sensor for automated stopping"
    ]
  },
  {
    id: "elevated-steel-water-tank-tower",
    sku: "JAX-STR-003",
    name: "Elevated Structural Steel Water Tank & Tower (10,000L – 50,000L)",
    category: "Water Storage & Tanks",
    tagline: "Heavy-duty fabricated tower and pressed steel sectional water reservoir",
    description: "Turnkey elevated water storage infrastructure fabricated in accordance with BS 5950 engineering standards. Features hot-dip galvanized sectional steel panels, internal anti-algae lining, braced structural tower, access ladder, and safety cage.",
    price: 365000,
    priceOnRequest: true,
    stock: "Available on order",
    rating: 4.9,
    reviewsCount: 27,
    src: "/fit.webp",
    image: "/fit.webp",
    featured: true,
    specifications: {
      "Capacity Range": "10,000 Litres to 50,000 Litres (Modular)",
      "Tower Heights": "6m, 9m, 12m, 15m or Custom Ground Clearances",
      "Panel Type": "Hot-Dip Galvanized Pressed Steel 1.22m x 1.22m",
      "Structural Sections": "Heavy Universal Columns (UC) & Angle Bracings",
      "Coating": "Hot-dip galvanized (min 85 microns) / Marine Epoxy",
      "Compliance": "Kenyan Building Code & KEBS Water Tank Standards",
      "Warranty": "10 Years Structural Guarantee"
    },
    features: [
      "Modular design allows future capacity expansion without rebuilding tower",
      "Complete with perimeter roof handrails, lockable manhole, and level gauge",
      "Internal baffles and corrosion-free stainless steel tie rods",
      "Includes foundation bolt templates and certified structural engineering drawings"
    ]
  },
  {
    id: "solar-pump-inverter-vfd",
    sku: "JAX-SOL-004",
    name: "Solar Pump Inverter VFD Drive (3-Phase AC 3.7kW – 15kW)",
    category: "Solar Water Equipment",
    tagline: "Directly powers standard 3-phase AC water pumps with solar panels",
    description: "High-efficiency variable frequency drive engineered for converting standard 380V three-phase grid/generator pumps to solar operation. Features dual-input hybrid capability (PV + Generator backup), water level monitoring, and auto restart.",
    price: 68500,
    stock: "In stock",
    rating: 4.8,
    reviewsCount: 19,
    src: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80",
    featured: true,
    specifications: {
      "Input PV Voltage": "Max 800V DC (MPPT: 450V – 750V)",
      "Output Voltage": "3-Phase 380V/415V AC Pure Sine Wave",
      "Rated Power": "5.5 kW / 7.5 HP (3.7kW & 11kW models available)",
      "Efficiency": "98.5% with dynamic MPPT algorithm",
      "Protection Rating": "IP65 Weatherproof Enclosure",
      "Warranty": "2 Years Replacement Warranty"
    },
    features: [
      "Seamlessly operates standard AC borehole and booster pumps on solar",
      "Hybrid input supports automatic generator startup on cloudy days",
      "Built-in protection against lightning surges, phase loss, and over-current",
      "Remote monitoring port via RS485 / GPRS"
    ]
  },
  {
    id: "digital-pump-control-panel",
    sku: "JAX-ACC-006",
    name: "Digital Intelligent Pump Control Panel (Borehole Automation)",
    category: "Pump Accessories & Automation",
    tagline: "Comprehensive automated motor protection and level management",
    description: "Microprocessor-based control panel protecting single-phase and three-phase borehole motors against overcurrent, phase failure, rapid cycling, undervoltage, and dry running without requiring probe cables.",
    price: 18500,
    stock: "In stock",
    rating: 4.9,
    reviewsCount: 31,
    src: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=1000&q=80",
    image: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=1000&q=80",
    featured: false,
    specifications: {
      "Voltage Rating": "220V Single-Phase or 380V/415V Three-Phase",
      "Motor Range": "0.75 kW to 7.5 kW",
      "Dry-Run Detection": "Current-sensing without downhole sensor wires",
      "Display": "Digital LCD screen showing real-time Amps, Volts & Fault logs",
      "Enclosure": "IP54 Flame Retardant ABS Box with key lock"
    },
    features: [
      "Automatically attempts recovery restart after dry-run pause",
      "Float switch inputs for top storage tank full & bottom sump empty",
      "Calibrated push-button current calibration",
      "Lightning and surge protection built-in"
    ]
  },
  {
    id: "hdpe-water-pipe-pe100-pn16",
    sku: "JAX-PIP-007",
    name: "HDPE PE100 High-Pressure Water Pipe (PN16 Certified)",
    category: "Pipes, Cables & Fittings",
    tagline: "Long-lasting underground water transmission and borehole drop pipe",
    description: "Virgin high-density polyethylene PE100 piping manufactured to KEBS KS-06-149 specifications. UV-stabilized, chemical-resistant, and flexible enough to withstand soil subsidence without joint failure.",
    price: 8900,
    stock: "In stock",
    rating: 5.0,
    reviewsCount: 54,
    src: "/jay-e.jpeg",
    image: "/jay-e.jpeg",
    featured: false,
    specifications: {
      "Pressure Class": "PN16 (16 Bar working pressure)",
      "Sizes Available": "32mm, 40mm, 50mm, 63mm, 90mm, 110mm OD",
      "Standard Coil Length": "100m or 150m continuous rolls",
      "Material Grade": "Virgin PE100 Resin with Carbon Black UV stabilizer",
      "Life Expectancy": "50+ Years underground"
    },
    features: [
      "Smooth internal bore ensures minimal friction loss and lower pumping costs",
      "Immune to rust, electrolytic corrosion, and mineral encrustation",
      "Compatible with compression fittings and electrofusion butt welding",
      "Food-grade certification for potable drinking water"
    ]
  },
  {
    id: "commercial-reverse-osmosis-plant",
    sku: "JAX-TRT-008",
    name: "Commercial Reverse Osmosis (RO) Water Purification Plant",
    category: "Water Treatment & Filtration",
    tagline: "Desalination and pure drinking water treatment system (500 – 2000 LPH)",
    description: "Engineered skid-mounted RO water treatment plant to purify brackish borehole water, remove high fluorides, total dissolved solids (TDS), salinity, heavy metals, and bacterial contaminants.",
    price: 320000,
    priceOnRequest: true,
    stock: "Available on order",
    rating: 4.9,
    reviewsCount: 16,
    src: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=80",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=80",
    featured: true,
    specifications: {
      "Capacity": "500 LPH, 1,000 LPH, or 2,000 LPH Output",
      "Membranes": "Dow Filmtec / Hydranautics 8040 Polyamide TFC",
      "Pre-filtration": "Quartz Sand Filter, Activated Carbon & 5μm Cartridge",
      "High Pressure Pump": "Stainless Steel 316 Vertical Multistage",
      "Frame": "Food Grade Stainless Steel Skid Frame",
      "Disinfection": "Post-RO Ultraviolet (UV) Sterilizer included"
    },
    features: [
      "Removes up to 99.2% of dissolved salts, fluoride, and hardness",
      "Digital conductivity meter monitors treated water purity in real time",
      "Automatic membrane flushing cycle extends element operating lifespan",
      "Complies with KEBS Bottled & Potable Water Standards KS-EAS-12"
    ]
  },
  {
    id: "structural-steel-beams-columns",
    sku: "JAX-STR-009",
    name: "Structural Steel Sections, Beams & Framing Materials",
    category: "Structural & Civil Materials",
    tagline: "Certified Grade S275/S355 universal beams, columns, and hollow sections",
    description: "High-strength structural steel profiles cut, drilled, and fabricated for water tower legs, warehouse portal frames, mezzanine floors, and equipment foundations across Kenya.",
    price: 24500,
    stock: "In stock",
    rating: 4.8,
    reviewsCount: 11,
    src: "/steel.jpeg",
    image: "/steel.jpeg",
    featured: false,
    specifications: {
      "Profiles": "Universal Beams (UB), Universal Columns (UC), SHS & RHS",
      "Steel Grade": "S275JR / S355JR Structural Carbon Steel",
      "Length Options": "Standard 6m, 12m or cut-to-length custom orders",
      "Surface Treatment": "Red Oxide Primed, Hot-Dip Galvanized, or Raw Mill Finish"
    },
    features: [
      "Certified mill test certificates provided with every batch",
      "Pre-drilled connection plates and custom gussets available",
      "High tensile strength for demanding load-bearing engineering structures",
      "Bulk quantity discounts for project contractors"
    ]
  },
  {
    id: "heavy-duty-site-safety-ppe-kit",
    sku: "JAX-PPE-010",
    name: "Industrial Site Safety PPE Comprehensive Kit",
    category: "Personal Protective Equipment (PPE)",
    tagline: "EN/OSHA compliant safety gear for engineering & construction teams",
    description: "Complete professional personal protective equipment package designed for drilling crews, structural steel erectors, and site engineers. Built for durability, maximum comfort, and certified impact resistance.",
    price: 6500,
    stock: "In stock",
    rating: 5.0,
    reviewsCount: 63,
    src: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1000&q=80",
    image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1000&q=80",
    featured: false,
    specifications: {
      "Kit Inclusions": "Safety Helmet, High-Vis Vest, Steel-Toe Boots, Safety Goggles & Gloves",
      "Safety Helmet": "EN397 ABS Impact Shell with 6-point harness and chin strap",
      "Footwear": "S3 Water-resistant leather boots with 200J steel toe & puncture plate",
      "High-Vis Vest": "Class 2 Reflective Oxford fabric with utility phone pockets",
      "Sizes": "Boots size 39 to 46, Vests M to XXL"
    },
    features: [
      "Certified for Ministry of Labour and DOSHS site safety compliance",
      "Breathable, lightweight materials engineered for tropical climates",
      "Heavy-duty chemical and oil-resistant boot soles",
      "Custom company logo printing available on bulk orders"
    ]
  },
  {
    id: "solar-tier1-monocrystalline-panels",
    sku: "JAX-SOL-011",
    name: "Tier-1 550W High-Efficiency Monocrystalline Solar Panels",
    category: "Solar Water Equipment",
    tagline: "Half-cut cell technology delivering maximum power even in low light",
    description: "Premium A-grade 550W solar photovoltaic modules with multi-busbar (MBB) half-cell technology. Engineered for high ambient Kenyan temperatures, providing superior output for borehole pumping stations.",
    price: 18500,
    stock: "In stock",
    rating: 4.9,
    reviewsCount: 48,
    src: "/jay-e.jpeg",
    image: "/jay-e.jpeg",
    featured: false,
    specifications: {
      "Maximum Power (Pmax)": "550 Watts",
      "Cell Type": "Monocrystalline PERC 144 Half-Cells",
      "Module Efficiency": "21.3%",
      "Open Circuit Voltage (Voc)": "49.8V",
      "Short Circuit Current (Isc)": "13.98A",
      "Frame": "Anodized Aluminum Alloy (35mm)",
      "Warranty": "12-Year Product Warranty, 25-Year Linear Power Warranty"
    },
    features: [
      "Anti-reflective 3.2mm tempered high-transmission glass",
      "Certified to withstand heavy wind loads (2400 Pa) and hail impact",
      "IP68 waterproof junction box with pre-installed MC4 connectors",
      "Superior low-irradiance performance on cloudy mornings"
    ]
  }
];

export const categories = [
  "All",
  "Water Pumps",
  "Solar PV Systems",
  "Pump Accessories & Automation",
  "Pipes, Cables & Fittings",
  "Water Treatment & Filtration",
  
];

export const formatKES = (amount?: number) => {
  if (amount == null) return "Request a quote";
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0
  }).format(amount);
};

export const price = formatKES;

// Helper to fetch all products from Firestore, falling back to default products if empty or offline
export async function getProducts(): Promise<Product[]> {
  if (!isFirebaseConfigured || !db) {
    return products;
  }

  try {
    const snap = await getDocs(collection(db, "products"));
    if (snap.empty) {
      return products;
    }

    const firestoreProducts: Product[] = [];
    snap.forEach(docSnap => {
      const data = docSnap.data() as Product;
      firestoreProducts.push({
        ...data,
        id: docSnap.id
      });
    });

    return firestoreProducts;
  } catch (err) {
    console.warn("Could not load products from Firestore, using defaults:", err);
    return products;
  }
}

// Helper to fetch a single product by ID
export async function getProductById(id: string): Promise<Product | undefined> {
  if (!isFirebaseConfigured || !db) {
    return products.find(p => p.id === id);
  }

  try {
    const docSnap = await getDoc(doc(db, "products", id));
    if (docSnap.exists()) {
      return { ...(docSnap.data() as Product), id: docSnap.id };
    }
    // Document does not exist in Firestore (deleted or not found)
    return undefined;
  } catch (err) {
    console.warn("Error fetching product by ID from Firestore, using fallback:", err);
    return products.find(p => p.id === id);
  }
}

// Helper for admin to save or update a product in Firestore
export async function saveProduct(product: Product): Promise<boolean> {
  if (!isFirebaseConfigured || !db) {
    throw new Error("Firebase Firestore is not configured in .env.local.");
  }

  const productId = product.id || `product-${Date.now()}`;
  const docRef = doc(db, "products", productId);

  await setDoc(docRef, {
    ...product,
    id: productId
  });

  return true;
}

// Helper for admin to delete a product from Firestore
export async function deleteProduct(productId: string): Promise<boolean> {
  if (!isFirebaseConfigured || !db) {
    throw new Error("Firebase Firestore is not configured in .env.local.");
  }

  await deleteDoc(doc(db, "products", productId));
  return true;
}


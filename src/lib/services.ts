export interface Service {
  id: string;
  number: string;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  category: "Water & Borehole" | "Pumps and Pump services" | "Solar Energy solutions" | "Structural & Construction";
  deliverables: string[];
  typicalScope: string;
}

export const services: Service[] = [
  {
    id: "borehole-drilling",
    number: "01",
    name: "Borehole Drilling",
    tagline: "End-to-End Groundwater Exploration & Drilling",
    description: "We offer professional borehole drilling services for homes, farms, schools, commercial facilities, and communities, providing dependable groundwater access tailored to site conditions and water demand.",
    icon: "◉",
    category: "Water & Borehole",
    deliverables: [
      "Geological strata sampling & logging",
      "Steel / uPVC borehole casing installation",
      "Gravel packing & sanitary surface seal",
      "Yield estimation & development"
    ],
    typicalScope: "Residential estates, commercial facilities, agricultural irrigation schemes, and community water points."
  },
  {
    id: "borehole-equipping",
    number: "02",
    name: "Borehole Equipping",
    tagline: "Precision Submersible Pumping & Water Delivery",
    description: "Complete mechanical and electrical equipping of drilled boreholes. We supply, configure, and install high-performance submersible pumps, motor controllers, riser pipes, and surface wellheads.",
    icon: "⌁",
    category: "Water & Borehole",
    deliverables: [
      "Stainless steel submersible pump selection & sizing",
      "HDPE / uPVC / Galvanized steel riser pipes",
      "Submersible 4-core power drop cable",
      "Wellhead completion & flow meter integration"
    ],
    typicalScope: "Newly drilled boreholes or retrofitting existing installations for improved discharge and energy efficiency."
  },
  {
    id: "steel and concrete towers",
    number: "03",
    name: "Steel and Concrete Towers",
    tagline: "Engineered Elevated Water Storage Towers",
    description: "Jay Axis Company designs and constructs steel and reinforced concrete water towers for elevated steel and plastic water storage tanks. Our structures are designed to meet project requirements, with consideration for tank capacity, foundation conditions, durability, and structural safety.",
    icon: "△",
    category: "Structural & Construction",
    deliverables: [
      "Structural engineering design & load calculations",
      "Hot-dip galvanized / anti-rust primed steel frames",
      "Internal access ladders, safety cages & service platforms",
      "Foundation bolt anchoring & lightning protection"
    ],
    typicalScope: "Elevations ranging from 6m to 24m supporting storage capacities from 5,000L to 100,000L."
  },
  {
    id: "hydrological-surveys",
    number: "05",
    name: "Hydrological & Hydrogeological Surveys",
    tagline: "Groundwater Exploration & Regulatory Permitting",
    description: "Jay Axis Company provides hydrological and hydrogeological survey services to assess water resources, identify suitable borehole drilling locations, and support sustainable water development.",
    icon: "⌖",
    category: "Water & Borehole",
    deliverables: [
      "Geophysical field survey & resistivity soundings",
      "Comprehensive hydrogeological survey report",
      "Aquifer depth, thickness, and water quality appraisal",
      "WRMA (Water Resources Authority) permit facilitation"
    ],
    typicalScope: "Mandatory pre-drilling requirement for all private, commercial, and communal borehole projects."
  },
  {
    id: "solar-works",
    number: "06",
    name: "Solar Works",
    tagline: "Solar Pumping & Clean Energy System Integration",
    description: "We supply and install solar-powered and electric water pumping systems, including submersible pumps, control panels, cables, and accessories, delivering reliable water pumping solutions for different applications.",
    icon: "☀",
    category: "Solar Energy solutions",
    deliverables: [
      "Solar irradiance & pumping requirement sizing",
      "Tier-1 monocrystalline solar PV array arrays",
      "Solar variable frequency drives (VFDs) with MPPT",
      "Automatic solar-to-grid/generator hybrid controllers"
    ],
    typicalScope: "Off-grid farms, remote boreholes, agricultural drip irrigation, and institutional cost-reduction schemes."
  },
  {
    id: "test-pumping",
    number: "08",
    name: "Test Pumping",
    tagline: "Rigorous 24-Hour Yield Testing & Aquifer Verification",
    description: "Calibrated 24-hour step-drawdown and constant discharge test pumping to determine maximum safe yield, dynamic water level, and recovery rate according to Kenyan water standards.",
    icon: "↟",
    category: "Water & Borehole",
    deliverables: [
      "High-capacity test pump mobilization & installation",
      "Step-drawdown testing & continuous discharge monitoring",
      "Aquifer recovery rate recording",
      "Certified test pumping report for pump sizing & WRA compliance"
    ],
    typicalScope: "Required prior to permanent pump selection to prevent dry-running, over-pumping, or borehole collapse."
  },
  {
    id: "pump-service",
    number: "09",
    name: "Pump Service",
    tagline: "Preventive Maintenance, Diagnostics & Pump Overhaul",
    description: "Rapid-response inspection, electrical diagnostics, motor rewinding, mechanical seal replacement, and preventative servicing for submersible, booster, and surface pumps.",
    icon: "⚙",
    category: "Water & Borehole",
    deliverables: [
      "Pump extraction, inspection & ultrasonic cleaning",
      "Insulation resistance (megger) & winding diagnostics",
      "Impeller, bearing, and mechanical seal replacement",
      "Pressure testing, re-installation & flow commissioning"
    ],
    typicalScope: "Routine scheduled maintenance contracts and emergency breakdown recovery for industrial and residential systems."
  },
  {
    id: "civil-works",
    number: "10",
    name: "Civil Works",
    tagline: "Pipelines, Pump Houses & Water Infrastructure",
    description: "Site development and civil construction including underground water reticulation networks, reinforced concrete valve chambers, pump stations, masonry sumps, and drainage channels.",
    icon: "▰",
    category: "Structural & Construction",
    deliverables: [
      "Trenching, bedding, and HDPE/PPR water distribution lines",
      "Secure concrete pump houses and control rooms",
      "Underground and surface reinforced water sumps",
      "Inspection chambers, manholes & perimeter fencing"
    ],
    typicalScope: "Complete civil infrastructure supporting residential developments, factories, and agricultural estates."
  },

];

export const serviceCategories = [
  "All Services",
  "Water & Borehole",
  "Structural & Construction",
  "Energy & Safety"
] as const;

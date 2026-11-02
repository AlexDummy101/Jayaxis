import { db, isFirebaseConfigured } from "@/lib/firebase";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  setDoc,
  deleteDoc
} from "firebase/firestore";

export interface Project {
  id: string;
  title: string;
  category: "Borehole Services" | "Water Tanks & Towers" | "Solar Solutions" | "Water Treatment" | "Civil & Structural";
  location: string;
  county: string;
  year: string;
  scope: string;
  deliverables: string[];
  equipment: string[];
  src: string; // Your image path here (e.g. "/steel.jpeg", "/jay-e.jpeg", or any file in public folder)
  image?: string; // Kept for backward compatibility
  featured: boolean;
}

export const projects: Project[] = [
  {
    id: "jkia-borehole-equipping-storage",
    title: "Borehole Equipping & 32m³ Steel Water Tower Project",
    category: "Borehole Services",
    location: "Embakasi Logistics Zone, Nairobi",
    county: "Nairobi",
    year: "2024",
    scope: "Complete borehole equipping, 180m depth pump installation, test pumping verification, and erection of a 12-meter elevated steel water tower with a 32,000L pressed steel sectional tank.",
    deliverables: [
      "24-Hour continuous test pumping and recovery monitoring",
      "Supply and installation of 7.5kW submersible pump & control panel",
      "Fabrication and crane erection of 12m structural steel tower",
      "32m³ hot-dip galvanized sectional water tank with food-grade lining"
    ],
    equipment: ["Stainless 4SP Pump", "7.5kW Smart Control Panel", "12m Heavy Universal Column Tower", "HDPE PN16 Riser Pipe"],
    src: "/jay-e.jpeg",
    image: "/jay-e.jpeg",
    featured: true
  },
  {
    id: "karen-solar-borehole-pumping",
    title: "Solar Water Pumping Hybrid Scheme & Storage Installation",
    category: "Solar Solutions",
    location: "Karen Estate, Nairobi",
    county: "Nairobi",
    year: "2024",
    scope: "Conversion of existing diesel generator-dependent borehole to an automated solar hybrid system, reducing monthly energy running costs by 92%.",
    deliverables: [
      "12kW Monocrystalline solar PV array installation with ground mounting",
      "Supply of IP65 Solar Pump Inverter (VFD) with automatic generator backup switch",
      "24m³ Elevated water storage tank connection and automated float level cut-off",
      "Civil works for dedicated solar control kiosk"
    ],
    equipment: ["12kW Solar Array", "Solar VFD Inverter", "Automatic Level Sensors", "Galvanized Mounting Racks"],
    src: "/jay-e.jpeg",
    image: "/jay-e.jpeg",
    featured: true
  },
  {
    id: "tatu-galvanized-steel-tank-tower",
    title: "50,000L Modular Pressed Steel Water Tank & 15m Tower",
    category: "Water Tanks & Towers",
    location: "Tatu City Light Industrial Park, Kiambu",
    county: "Kiambu",
    year: "2025",
    scope: "Design, structural engineering calculation, precision shop fabrication, and site assembly of a 50m³ sectional steel tank elevated on a 15-meter heavy-duty structural steel tower.",
    deliverables: [
      "Engineered foundation pad design & anchor bolt casting",
      "15m Structural steel lattice tower with safety ladder & rest platform",
      "50m³ Pressed galvanized panel reservoir conforming to BS 1564",
      "Internal anti-algae epoxy membrane & exterior high-durability finish"
    ],
    equipment: ["Modular Pressed Steel Panels", "Heavy Universal Beams & Columns", "Internal Stainless Tie-rods", "Electronic Level Indicator"],
    src: "/steel.jpeg",
    image: "/steel.jpeg",
    featured: true
  },
  {
    id: "athi-river-ro-purification-plant",
    title: "Industrial Reverse Osmosis Water Treatment Plant (1,500 LPH)",
    category: "Water Treatment",
    location: "EPZ Industrial Zone, Athi River",
    county: "Machakos",
    year: "2024",
    scope: "Turnkey design and commissioning of an industrial water purification and desalination plant treating highly mineralized saline borehole water for manufacturing processing.",
    deliverables: [
      "Multi-media quartz sand filtration and activated carbon adsorption units",
      "Dual skid-mounted 1,500 LPH Reverse Osmosis membrane array",
      "Automated anti-scalant chemical dosing system",
      "Online digital TDS, pH, and conductivity telemetry"
    ],
    equipment: ["Dow Filmtec 8040 RO Membranes", "316SS Multistage Pump", "Fleck Automatic Backwash Valves", "Inline UV Sterilizer"],
    src: "/steel.jpeg",
    image: "/steel.jpeg",
    featured: true
  },
  {
    id: "naivasha-agricultural-drip-solar-pumping",
    title: "Commercial Horticultural Solar Water Reticulation Project",
    category: "Solar Solutions",
    location: "Moi South Lake Road, Naivasha",
    county: "Nakuru",
    year: "2025",
    scope: "Turnkey borehole equipping, 18kW solar power farm, and underground civil pipe reticulation for a 45-acre commercial greenhouse vegetable farm.",
    deliverables: [
      "Test pumping and deep water aquifer yield certification",
      "High-flow 15kW stainless submersible pump installation at 140m",
      "18kW High-yield solar tracking array with VFD pumping automation",
      "3.2km of underground PN16 HDPE distribution piping and isolation valve chambers"
    ],
    equipment: ["15kW High-Volume Pump", "18kW Solar Array", "HDPE 90mm PN16 Mainlines", "Air Release & Check Valves"],
    src: "/jay-e.jpeg",
    image: "/jay-e.jpeg",
    featured: false
  },
  {
    id: "eldoret-reinforced-concrete-tower",
    title: "Municipal Reinforced Concrete Water Tower & Reservoir",
    category: "Civil & Structural",
    location: "Annex Area, Eldoret",
    county: "Uasin Gishu",
    year: "2024",
    scope: "Civil engineering and structural concrete construction of an elevated 80m³ reinforced concrete water tower and 200m³ ground-level balancing reservoir.",
    deliverables: [
      "Deep foundation piling & structural rebar cage fabrication",
      "Continuous slipform concrete pouring for 18m cylindrical tower column",
      "Reinforced concrete elevated tank bowl casting with crystalline waterproofing",
      "Heavy-duty ductile iron riser, overflow, and wash-out piping"
    ],
    equipment: ["Grade 35 Concrete", "TMT High-Yield Rebar", "Ductile Iron Flanged Pipework", "Lightning Protection Network"],
    src: "/steel.jpeg",
    image: "/steel.jpeg",
    featured: false
  }
];

export const projectCategories = [
  "All Projects",
  "Borehole Services",
  "Water Tanks & Towers",
  "Solar Solutions",
  "Water Treatment",
  "Civil & Structural"
] as const;

// Helper to fetch all projects from Firestore, falling back to default projects if empty or offline
export async function getProjects(): Promise<Project[]> {
  if (!isFirebaseConfigured || !db) {
    return projects;
  }

  try {
    const snap = await getDocs(collection(db, "projects"));
    if (snap.empty) {
      return projects;
    }

    const firestoreProjects: Project[] = [];
    snap.forEach(docSnap => {
      const data = docSnap.data() as Project;
      firestoreProjects.push({
        ...data,
        id: docSnap.id
      });
    });

    return firestoreProjects.length > 0 ? firestoreProjects : projects;
  } catch (err) {
    console.warn("Could not load projects from Firestore, using defaults:", err);
    return projects;
  }
}

// Helper to fetch a single project by ID
export async function getProjectById(id: string): Promise<Project | undefined> {
  if (!isFirebaseConfigured || !db) {
    return projects.find(p => p.id === id);
  }

  try {
    const docSnap = await getDoc(doc(db, "projects", id));
    if (docSnap.exists()) {
      return { ...(docSnap.data() as Project), id: docSnap.id };
    }
  } catch (err) {
    console.warn("Error fetching project by ID from Firestore:", err);
  }

  return projects.find(p => p.id === id);
}

// Helper for admin to save or update a project in Firestore
export async function saveProject(project: Project): Promise<boolean> {
  if (!isFirebaseConfigured || !db) {
    throw new Error("Firebase Firestore is not configured in .env.local.");
  }

  const projectId = project.id || `project-${Date.now()}`;
  const docRef = doc(db, "projects", projectId);

  await setDoc(docRef, {
    ...project,
    id: projectId
  });

  return true;
}

// Helper for admin to delete a project from Firestore
export async function deleteProject(projectId: string): Promise<boolean> {
  if (!isFirebaseConfigured || !db) {
    throw new Error("Firebase Firestore is not configured in .env.local.");
  }

  await deleteDoc(doc(db, "projects", projectId));
  return true;
}


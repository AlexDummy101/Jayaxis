import { db, isFirebaseConfigured } from "@/lib/firebase";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  query,
  orderBy
} from "firebase/firestore";

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  category: "Regulations & Compliance" | "Project Milestones" | "Technology & Innovation" | "Company Announcements";
  summary: string;
  content: string;
  author: string;
  date: string;
  src: string; // Image path e.g. "/jay-e.jpeg", "/steel.jpeg"
  readTime: string;
  tags: string[];
  featured?: boolean;
  createdAt?: number;
}

export const newsCategories = [
  "All Articles",
  "Regulations & Compliance",
  "Project Milestones",
  "Technology & Innovation",
  "Company Announcements"
] as const;

export const defaultNews: NewsArticle[] = [
  {
    id: "kenya-borehole-drilling-permits-guide-2026",
    title: "Kenya Borehole Drilling Permits & Approvals: The Complete Statutory Guide",
    slug: "kenya-borehole-drilling-permits-guide",
    category: "Regulations & Compliance",
    summary:
      "A comprehensive guide on obtaining Water Resources Authority (WRA) authorizations, NEMA environmental clearances, and post-drilling groundwater abstraction permits across Kenya.",
    content: `In Kenya, drilling a borehole is an engineering endeavor governed by stringent regulatory frameworks to protect groundwater aquifers and ensure sustainable water abstraction.

Before any drilling rig mobilizes to your site, Jay Axis Company assists clients in securing the requisite permits and statutory clearances:

1. Water Resources Authority (WRA) Authorization:
The initial and most critical approval. It requires a comprehensive Hydrogeological Assessment Report conducted by a certified hydrogeologist. This report maps aquifer yield potential, water quality expectations, and safe drilling depths.

2. NEMA Environmental Impact Approval:
Under Kenyan environmental laws, groundwater drilling requires screening by the National Environment Management Authority (NEMA) to assess ecological impact and prevent groundwater contamination.

3. Drilling Contractor Licensing:
Drilling must strictly be executed by a registered and licensed water-resource contractor. Jay Axis Company ensures full compliance and equipment certification.

4. Water-Use & Abstraction Permit:
After drilling, a Borehole Completion Record (BCR) and 24-hour test pumping report are submitted to WRA for the formal abstraction permit. An authorization to drill is not a substitute for the final abstraction permit.

5. County Government Clearances:
Local county authorities (Nairobi, Kiambu, Machakos, Kajiado, etc.) require site entry clearances and local ground disturbance notifications.

Jay Axis Company coordinates the end-to-end statutory process, ensuring your borehole investment is 100% legal, certified, and compliant.`,
    author: "Jay Axis Engineering Desk",
    date: "October 2026",
    src: "/jay-e.jpeg",
    readTime: "5 min read",
    tags: ["WRA", "NEMA", "Borehole Drilling", "Kenya Regulations", "Groundwater"],
    featured: true,
    createdAt: Date.now() - 86400000 * 3
  },
  {
    id: "transitioning-to-solar-hybrid-pumping",
    title: "Cutting Borehole Operational Costs by 90%: The Solar Hybrid Revolution",
    slug: "transitioning-to-solar-hybrid-pumping",
    category: "Technology & Innovation",
    summary:
      "How commercial agricultural farms and residential communities across Kenya are eliminating costly diesel generator bills by adopting intelligent MPPT solar VFD pump drives.",
    content: `Escalating electricity tariffs and volatile diesel fuel costs have made conventional generator-powered borehole pumping economically unsustainable for large irrigation and residential schemes.

Jay Axis Company's Solar Pumping Engineering Division has rolled out solar-hybrid submersible conversions nationwide:

Why Solar Pumping is Transforming Kenyan Water Security:
• Zero Fuel Costs: Sunlight provides clean, reliable energy throughout peak irrigation hours.
• Smart MPPT Inverters: Variable Frequency Drives (VFDs) dynamically track solar irradiation, ensuring optimal motor speed even during light cloud cover.
• Generator Hybrid Automation: Dual-input controllers seamlessly blend solar power with backup grid or generator power only when required.
• Motor Longevity: Soft-start VFD ramps up pump motor rotation gently, eliminating current spikes and reducing mechanical pump wear.

From Karen and Naivasha to Machakos and Uasin Gishu, our installations demonstrate full capital payback within 14 to 18 months.`,
    author: "Solar Systems Specialist",
    date: "October 2026",
    src: "/steel.jpeg",
    readTime: "4 min read",
    tags: ["Solar Pumping", "VFD Inverters", "Renewable Energy", "Cost Savings", "Agriculture"],
    featured: true,
    createdAt: Date.now() - 86400000 * 7
  },
  {
    id: "elevated-steel-water-tower-engineering",
    title: "Engineering Elevated Sectional Steel Storage: BS 1564 & BS 5950 Standards",
    slug: "elevated-steel-water-tower-engineering",
    category: "Project Milestones",
    summary:
      "Why precision structural calculations and hot-dip galvanizing are crucial when constructing elevated steel reservoirs between 10,000L and 100,000L capacity.",
    content: `Elevated water storage tanks hold immense kinetic and potential weight. A 50,000-litre tank exerts over 50 metric tonnes of vertical load, in addition to horizontal wind shear and seismic forces.

At Jay Axis Company, our structural steel fabrication and erection adhere to BS 5950 structural code and BS 1564 tank specifications:

Key Structural Safeguards:
1. Universal Column (UC) Tower Legs: High-tensile steel sections with cross-bracing to prevent wind deflection and foundation settling.
2. Hot-Dip Galvanizing: Minimum 85-micron zinc coating provides over 30 years of corrosion immunity against harsh tropical rain and weathering.
3. Modular Pressed Steel Panels: Standard 1.22m x 1.22m sectional panels with food-grade internal sealant and stainless steel internal tie rods.
4. Integrated Safety Ladders & Rest Platforms: OSHA-compliant perimeter cages and roof handrails for safe routine inspection.

Elevated gravity-fed pressure eliminates the need for continuous booster pump operation, guaranteeing constant household and facility water pressure.`,
    author: "Structural Engineering Team",
    date: "September 2026",
    src: "/steel.jpeg",
    readTime: "4 min read",
    tags: ["Steel Towers", "Water Storage", "BS 5950", "Fabrication", "Infrastructure"],
    featured: false,
    createdAt: Date.now() - 86400000 * 14
  }
];

// Helper to fetch all news from Firestore, falling back to defaultNews if offline or empty
export async function getNewsArticles(): Promise<NewsArticle[]> {
  if (!isFirebaseConfigured || !db) {
    return defaultNews;
  }

  try {
    const q = query(collection(db, "news"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);

    if (snap.empty) {
      return defaultNews;
    }

    const firestoreArticles: NewsArticle[] = [];
    snap.forEach(docSnap => {
      const data = docSnap.data() as NewsArticle;
      firestoreArticles.push({
        ...data,
        id: docSnap.id
      });
    });

    return firestoreArticles.length > 0 ? firestoreArticles : defaultNews;
  } catch (err) {
    console.warn("Could not load news from Firestore, using default articles:", err);
    return defaultNews;
  }
}

// Helper for admin to save or update an article in Firestore
export async function saveNewsArticle(article: NewsArticle): Promise<boolean> {
  if (!isFirebaseConfigured || !db) {
    throw new Error("Firebase Firestore is not configured in .env.local.");
  }

  const articleId = article.id || `news-${Date.now()}`;
  const docRef = doc(db, "news", articleId);

  await setDoc(docRef, {
    ...article,
    id: articleId,
    createdAt: article.createdAt || Date.now()
  });

  return true;
}

// Helper for admin to delete an article from Firestore
export async function deleteNewsArticle(articleId: string): Promise<boolean> {
  if (!isFirebaseConfigured || !db) {
    throw new Error("Firebase Firestore is not configured in .env.local.");
  }

  await deleteDoc(doc(db, "news", articleId));
  return true;
}

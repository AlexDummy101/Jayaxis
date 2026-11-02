import type { Metadata } from "next";
import { ShopBrowser } from "@/components/ShopBrowser";
import { ShieldCheck, Truck, FileText } from "lucide-react";

import { getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Product Catalogue | Water Pumps, Solar & Infrastructure Equipment",
  description: "Browse Jayaxis Company Ltd's image-rich product catalogue. Water pumps, solar pump inverters, elevated sectional steel tanks, HDPE pipes, and PPE site gear."
};

export default async function ShopPage({
  searchParams
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const initialProducts = await getProducts();

  return (
    <div className="py-12 space-y-12">
      {/* Header */}
      <section className="wrap space-y-4 text-center max-w-3xl mx-auto">
        <span className="text-xs font-black uppercase tracking-widest text-sky-600 bg-sky-50 px-3.5 py-1.5 rounded-full inline-block">
          Official Equipment Catalogue
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Pumps, Solar & Infrastructure Supplies
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          High-performance submersible borehole pumps, solar VFD controllers, elevated pressed steel tanks, and certified engineering accessories available for delivery throughout Kenya.
        </p>

        {/* Feature Badges */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
          <span className="inline-flex items-center gap-1.5 text-slate-700 font-semibold">
            <ShieldCheck size={16} className="text-sky-500" /> Factory Warranties
          </span>
          <span className="inline-flex items-center gap-1.5 text-slate-700 font-semibold">
            <Truck size={16} className="text-sky-500" /> Nationwide Kenyan Delivery
          </span>
          <span className="inline-flex items-center gap-1.5 text-slate-700 font-semibold">
            <FileText size={16} className="text-sky-500" /> Quotations on Request
          </span>
        </div>
      </section>

      {/* Main Catalog Browser with Live Search, Categories & Filters */}
      <section className="wrap">
        <ShopBrowser
          initialCategory={params.category || "All"}
          initialProducts={initialProducts}
        />
      </section>
    </div>
  );
}
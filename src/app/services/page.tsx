import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Phone, MessageCircle, FileText, ArrowRight } from "lucide-react";
import { services } from "@/lib/services";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our 8 Services | Water solutions,pump works and solar works",
  description: "Explore Jayaxis Company Ltd's 11 confirmed engineering services: Borehole Drilling, Equipping, Steel Towers, Concrete Towers, Surveys, Solar Works, Steel Structures, Test Pumping, Pump Service, Civil Works, and PPE."
};

const serviceGroups = [
  {
    groupTitle: "Water & Borehole Engineering",
    groupTag: "Groundwater Solutions",
    serviceIds: ["borehole-drilling", "borehole-equipping", "hydrological-surveys", "test-pumping", "pump-service"]
  },
  {
    groupTitle: "Structural & Construction Engineering",
    groupTag: "Storage & Infrastructure",
    serviceIds: ["steel-towers", "concrete-tower", "steel-structures", "civil-works"]
  },
  {
    groupTitle: "Energy & Site Safety Solutions",
    groupTag: "Sustainable Power & Protection",
    serviceIds: ["solar-works", "ppe"]
  }
];

export default function ServicesPage() {
  return (
    <div className="py-16 space-y-16">
      {/* Page Header */}
      <section className="wrap text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-black uppercase tracking-widest text-sky-600 bg-sky-50 px-3.5 py-1.5 rounded-full inline-block">
          Comprehensive Capabilities
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Our 8 Engineering Services
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          From groundwater hydrogeological surveys and deep borehole drilling to elevated structural steel water towers, solar pumping, and civil works, Jayaxis Company Ltd provides turnkey solutions across Kenya.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/quote"
            className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md shadow-sky-500/20"
          >
            <FileText size={15} /> Request Service Quotation
          </Link>
          <a
            href="tel:+254185224887"
            className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-5 py-3 rounded-xl"
          >
            <Phone size={15} /> Speak to an Engineer
          </a>
        </div>
      </section>

      {/* Services Breakdown by Groups */}
      <div className="wrap space-y-20">
        {serviceGroups.map(group => {
          const groupServices = services.filter(s => group.serviceIds.includes(s.id));
          return (
            <div key={group.groupTitle} className="space-y-8">
              <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-600 block">
                    {group.groupTag}
                  </span>
                  <h2 className="text-2xl font-black text-slate-900">{group.groupTitle}</h2>
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  {groupServices.length} Specialized Services
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {groupServices.map(s => (
                  <article
                    key={s.id}
                    id={s.id}
                    className="scroll-mt-28 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-xl hover:border-sky-300 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center text-xl font-bold">
                          {s.icon}
                        </span>
                        <span className="text-sm font-mono font-black text-sky-600">
                          SERVICE {s.number}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                          {s.category}
                        </span>
                        <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">
                          {s.name}
                        </h3>
                        <p className="text-xs font-semibold text-sky-600 mt-0.5 mb-3">
                          {s.tagline}
                        </p>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {s.description}
                        </p>
                      </div>

                      {/* Deliverables Checklist */}
                      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2">
                        <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider block">
                          Key Deliverables & Specifications
                        </span>
                        <ul className="space-y-1.5 text-xs text-slate-700">
                          {s.deliverables.map((del, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle2 size={14} className="text-sky-500 mt-0.5 flex-shrink-0" />
                              <span>{del}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="text-[11px] text-slate-500">
                        <strong className="text-slate-700">Typical Scope:</strong> {s.typicalScope}
                      </div>
                    </div>

                    <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between gap-3">
                      <Link
                        href={`/quote?service=${encodeURIComponent(s.name)}`}
                        className="inline-flex items-center gap-1.5 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-colors"
                      >
                        Request Quote for Service <ArrowUpRight size={14} />
                      </Link>

                      <a
                        href={`https://wa.me/254185224887?text=Hello%20Jayaxis,%20I%20would%20like%20to%20inquire%20about%20${encodeURIComponent(s.name)}.`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-emerald-600 hover:text-emerald-700 font-bold inline-flex items-center gap-1"
                      >
                        <MessageCircle size={14} /> Inquire on WhatsApp
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <section className="wrap">
        <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-[#002766] to-[#0284c7] text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-200">
              Need A Site Assessment?
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Speak with a Jayaxis Project Engineer
            </h2>
            <p className="text-xs text-sky-100 max-w-lg">
              Share your location, intended daily water volume, or structural requirements. We arrange mobilization and competitive quotations.
            </p>
          </div>

          <Link
            href="/quote"
            className="inline-flex items-center gap-2 bg-white hover:bg-sky-50 text-slate-900 font-black text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-md transition-all flex-shrink-0"
          >
            Start Your Request <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </div>
  );
}

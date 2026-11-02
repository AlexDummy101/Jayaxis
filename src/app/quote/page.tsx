"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { QuoteForm } from "@/components/QuoteForm";
import { ShieldCheck, Truck, FileText } from "lucide-react";

function QuoteContent() {
  const p = useSearchParams();
  const initialItem = p.get("items") || p.get("item") || "";

  return (
    <div className="py-12 space-y-12">
      <div className="wrap max-w-5xl space-y-8">
        <header className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-black uppercase tracking-widest text-sky-600 bg-sky-50 px-3.5 py-1.5 rounded-full inline-block">
            Direct Engineering Proposal
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Request a Formal Quotation
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Specify your water infrastructure scope, borehole depth, tank requirements, or equipment items. We calculate site-specific pricing and logistics across Kenya.
          </p>
        </header>

        {/* Form Container */}
        <QuoteForm initialItem={initialItem} />

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 text-xs text-slate-600">
          <div className="bg-white border border-slate-200/80 p-5 rounded-2xl flex items-start gap-3 shadow-sm">
            <ShieldCheck size={20} className="text-sky-500 mt-0.5 flex-shrink-0" />
            <div>
              <b className="text-slate-900 block font-bold">Itemized & Transparent</b>
              <span className="text-slate-500">Clear breakdown of equipment, pipework, and installation.</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 p-5 rounded-2xl flex items-start gap-3 shadow-sm">
            <Truck size={20} className="text-sky-500 mt-0.5 flex-shrink-0" />
            <div>
              <b className="text-slate-900 block font-bold">Nationwide Mobilization</b>
              <span className="text-slate-500">Direct logistics and delivery throughout all 47 counties.</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 p-5 rounded-2xl flex items-start gap-3 shadow-sm">
            <FileText size={20} className="text-sky-500 mt-0.5 flex-shrink-0" />
            <div>
              <b className="text-slate-900 block font-bold">Official Proforma PDF</b>
              <span className="text-slate-500">Compliant with institutional, commercial, and farm procurement.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function QuotePage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center text-slate-400">
          <p>Loading quotation portal...</p>
        </div>
      }
    >
      <QuoteContent />
    </Suspense>
  );
}

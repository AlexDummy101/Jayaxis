import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Droplets,
  Target,
  Eye,
  Users,
  Award,
  FileCheck2,
  Building2,
  SunMedium,
  AlertCircle,
  Landmark,
  Sparkles,
  HardHat,
  BadgeCheck
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Jay Axis Company | Water, Infrastructure & Solar Energy Solutions",
  description: "Learn about Jay Axis Company, our mission, vision, commitment to quality, reliability and safety, and statutory borehole drilling permits and approvals in Kenya (WRA, NEMA, County)."
};

const stats = [
  { value: "High Quality", label: "Confirmed Engineering Services" },
  { value: "47", label: "Counties Mobilized Nationwide" },
  { value: "100%", label: "Factory-Warranted Equipment" },
  { value: "24h", label: "Rapid Quotation Response" }
];

const values = [
  {
    icon: ShieldCheck,
    title: "Engineering Excellence & Integrity",
    desc: "We prioritize rigorous structural design, certified material quality, and compliance with Kenyan engineering and Water Resources Authority standards."
  },
  {
    icon: Target,
    title: "Tailored Client Solutions",
    desc: "No two sites or aquifers are identical. We size and configure equipment around your exact geographical yield, daily capacity requirements, and budget."
  },
  {
    icon: Droplets,
    title: "Water Security & Sustainability",
    desc: "We promote eco-friendly solar water pumping systems and durable sectional storage solutions that secure water access for generations."
  },
  {
    icon: Users,
    title: "Long-Term Partnership",
    desc: "From initial hydrogeological exploration to post-commissioning maintenance and rapid pump repair, we stand firmly behind our installations."
  }
];

const commitmentPillars = [
  {
    title: "Quality",
    subtitle: "Certified Standards",
    desc: "Precision engineering, genuine factory-warranted equipment, and structural materials compliant with Kenyan and BS standards."
  },
  {
    title: "Reliability",
    subtitle: "Dependable Performance",
    desc: "Uninterrupted groundwater flow, durable pump configurations, and robust elevated steel towers engineered to endure harsh elements."
  },
  {
    title: "Safety",
    subtitle: "Zero-Compromise Protocols",
    desc: "Our commitment is to deliver our services through zero-compromise operations, placing the health, safety, and environmental protection of our team and communities above all else."
  },
  {
    title: "Customer Satisfaction",
    subtitle: "End-to-End Care",
    desc: "Transparent quotations, clear technical milestone updates, fast turnarounds, and long-term post-installation support."
  }
];

const commitmentFocusAreas = [
  {
    icon: Droplets,
    title: "Top quality borehole drilling services.",
    desc: "Delivering perennial clean water to households, farms, and institutions through scientific aquifer targeting."
  },
  {
    icon: Building2,
    title: "Pump System",
    desc: "Equipping and engineering heavy-duty submersible pumping and distribution systems to ensure optimal, continuous water flow and pressure across your network."
  },
  {
    icon: SunMedium,
    title: "Solar Energy Systems",
    desc: "Powering sustainable operations with high-efficiency solar PV arrays and hybrid inverter drives for zero-fuel, energy-independent water security."
  }
];

const boreholePermits = [
  {
    number: "01",
    title: "Water Resources Authority (WRA) Authorization",
    stage: "Pre-Drilling Stage",
    authority: "Water Resources Authority (WRA)",
    icon: FileCheck2,
    badgeColor: "bg-sky-100 text-sky-800 border-sky-200",
    description:
      "This is the key approval before drilling begins. The application generally includes a hydrogeological assessment report identifying the proposed drilling site and groundwater potential. After drilling and compliance inspections, the process proceeds toward issuance of a water-use permit.",
    keyRequirement: "Hydrogeological assessment report & proposed site groundwater potential mapping"
  },
  {
    number: "02",
    title: "NEMA Environmental Approval",
    stage: "Environmental Safeguards",
    authority: "National Environment Management Authority (NEMA)",
    icon: ShieldCheck,
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
    description:
      "Environmental assessment and approval must be obtained where required under Kenya's environmental assessment framework. The applicable assessment depends on the project's nature, scale and environmental sensitivity. Confirm the required assessment category with NEMA before commencing work.",
    keyRequirement: "EIA project assessment / screening confirmation with NEMA"
  },
  {
    number: "03",
    title: "Drilling Contractor Registration and License",
    stage: "Contractor Compliance",
    authority: "WRA & Water-Sector Regulators",
    icon: Award,
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
    description:
      "If Jay Axis Company undertakes drilling directly, it should hold the applicable registration and valid licence for water-resource drilling contractors. Verify the current classification and requirements with WRA and the relevant water-sector regulator. If using a subcontractor, verify their credentials.",
    keyRequirement: "Valid water-resource drilling contractor license & verified regulatory classification"
  },
  {
    number: "04",
    title: "Water-Use or Abstraction Permit",
    stage: "Post-Drilling Legalization",
    authority: "Water Resources Authority (WRA)",
    icon: Droplets,
    badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
    description:
      "After the borehole is constructed, the owner must complete the WRA requirements for permission to abstract groundwater. This typically includes the borehole completion record, completion certificate, water-quality analysis and inspection, as applicable. An authorization to construct is not a substitute for the final water permit.",
    keyRequirement: "Borehole completion record (BCR), water-quality analysis lab test & final abstraction permit",
    criticalNote: "An authorization to construct is not a substitute for the final water permit."
  },
  {
    number: "05",
    title: "County Government Approvals",
    stage: "Local Jurisdiction",
    authority: "Relevant County Government",
    icon: Landmark,
    badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
    description:
      "Check with the relevant county government for any applicable local permits, site requirements or charges. Requirements may differ depending on the county and project location.",
    keyRequirement: "County-specific ground clearance, site development permits and regional water levies"
  }
];

export default function AboutPage() {
  return (
    <div className="py-16 space-y-24">
      {/* Hero Header */}
      <section className="wrap max-w-4xl mx-auto text-center space-y-5">
        <span className="text-xs font-black uppercase tracking-widest text-sky-600 bg-sky-50 px-4 py-1.5 rounded-full inline-block border border-sky-100">
          About Jay Axis Company
        </span>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
          Engineered for Water Security & Structural Durability
        </h1>
        <p className="text-sm sm:text-base text-sky-700 font-bold max-w-2xl mx-auto">
          Jay Axis Company — Your Trusted Partner in Water, Infrastructure and Solar Energy Solutions.
        </p>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto">
          
        </p>
      </section>

      {/* Stats Bar */}
      <section className="wrap">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-gradient-to-r from-[#002766] to-[#0284c7] text-white p-8 sm:p-10 rounded-3xl shadow-xl">
          {stats.map((s, idx) => (
            <div key={idx} className="text-center space-y-1">
              <div className="text-3xl sm:text-5xl font-black text-white">{s.value}</div>
              <div className="text-[11px] sm:text-xs text-sky-100 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="wrap grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-sky-50/70 border border-sky-100 rounded-3xl p-8 sm:p-10 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-500 text-white flex items-center justify-center font-bold shadow-sm">
            <Target size={24} />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">Our Mission</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            To provide dependable, cost-effective water infrastructure and civil engineering services across Kenya by combining verified technical expertise, genuine equipment, and solar innovation.
          </p>
        </div>

        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-sky-400 text-slate-950 flex items-center justify-center font-bold shadow-sm">
            <Eye size={24} />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">Our Vision</h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            To be East Africa&apos;s foremost benchmark for integrated water development, elevated steel tower fabrication, and sustainable groundwater delivery systems.
          </p>
        </div>
      </section>

      {/* Our Commitment Section */}
      <section className="wrap">
        <div className="bg-gradient-to-b from-slate-900 via-[#00224f] to-slate-900 text-white rounded-3xl p-8 sm:p-12 lg:p-14 shadow-2xl relative overflow-hidden border border-slate-800 space-y-12">
          {/* Subtle decorative glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Commitment Header */}
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 bg-sky-500/20 text-sky-300 border border-sky-400/30 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <Sparkles size={14} className="text-sky-400" />
              Pledge of Excellence
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Our Commitment
            </h2>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
              At <strong className="text-white font-semibold">Jay Axis Company</strong>, we are committed to quality, reliability, safety, and customer satisfaction. We strive to deliver practical and cost-effective solutions that support sustainable water access, infrastructure development, and clean energy adoption.
            </p>
            <div className="pt-1">
              <span className="inline-block bg-white/10 backdrop-blur-md border border-white/15 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-sky-200">
                Jay Axis Company — Your Trusted Partner in Water, Infrastructure and Solar Energy Solutions.
              </span>
            </div>
          </div>

          {/* 4 Pillars of Commitment */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {commitmentPillars.map((pillar, idx) => (
              <div
                key={idx}
                className="bg-white/5 border border-white/10 hover:border-sky-400/40 rounded-2xl p-6 transition-all duration-300 hover:bg-white/[0.08] space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-300 flex items-center justify-center text-xs font-mono font-bold">
                    0{idx + 1}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-300 bg-sky-950/60 px-2 py-0.5 rounded-md border border-sky-800/50">
                    {pillar.subtitle}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">{pillar.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>

          {/* 3 Core Impact Areas */}
          <div className="relative z-10 pt-4 border-t border-white/10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-sky-400">
                  Strategic Solutions
                </span>
                <h3 className="text-xl font-extrabold text-white">Supporting Sustainable Growth</h3>
              </div>
              <p className="text-xs text-slate-400 max-w-md">
                Every project we deliver is aligned with national development, community resilience, and clean technology.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {commitmentFocusAreas.map((area, idx) => {
                const IconComponent = area.icon;
                return (
                  <div
                    key={idx}
                    className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3 hover:bg-white/[0.07] transition-all"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-sky-600 text-slate-950 flex items-center justify-center font-bold shadow-md">
                      <IconComponent size={20} />
                    </div>
                    <h4 className="text-base font-bold text-white">{area.title}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{area.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Story & Technical Excellence Split */}
      <section className="wrap grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 relative rounded-3xl overflow-hidden aspect-[4/3] bg-slate-100 shadow-xl">
          <Image
            src="/jay-e.jpeg"
            alt="Jay Axis Company engineering on-site operations"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-sky-600 bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
              Technical Excellence
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Bridging Natural Water Resources & Long-Lasting Infrastructure
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Groundwater extraction and elevated storage demand accurate engineering calculations. An improperly sized borehole pump leads to premature motor burnout, while an undersized tower frame poses severe safety risks.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              At Jay Axis Company, our multidisciplinary team brings together hydrogeologists, structural steel fabricators, electrical technicians, and civil contractors. We handle your project from geophysical survey to final tap commissioning.
            </p>
          </div>

          <div className="space-y-2.5 text-xs text-slate-700">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 size={16} className="text-sky-500 flex-shrink-0" />
              <span>Full compliance with Water Resources Authority (WRA) regulations</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 size={16} className="text-sky-500 flex-shrink-0" />
              <span>Modular pressed steel tank panels conforming to BS 1564</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 size={16} className="text-sky-500 flex-shrink-0" />
              <span>Structural steel designs verified against BS 5950 structural code</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Permits & Approvals for Borehole Drilling in Kenya Section */}
      <section className="wrap space-y-12">
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-black uppercase tracking-widest text-sky-600 bg-sky-50 px-3.5 py-1.5 rounded-full inline-block border border-sky-100">
            Kenya Regulatory & Compliance Framework
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Main Permits and Approvals for Borehole Drilling in Kenya
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            In Kenya, borehole drilling requires several permits and approvals before drilling can begin. For Jay Axis Company, the main requirements generally fall under water-resource authorization, environmental approval, and drilling contractor licensing.
          </p>
        </div>

        {/* Permits Grid / Sequence */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {boreholePermits.map((permit, idx) => {
            const Icon = permit.icon;
            const isFullSpan = idx === 4; // County approvals card spans nicely or centers
            return (
              <div
                key={idx}
                className={`bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-xl hover:border-sky-300 transition-all flex flex-col justify-between space-y-6 ${isFullSpan ? "md:col-span-2 lg:col-span-1" : ""
                  }`}
              >
                <div className="space-y-4">
                  {/* Top Badge & Number */}
                  <div className="flex items-center justify-between">
                    <span className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                      <Icon size={20} />
                    </span>
                    <span className="text-xs font-mono font-black text-slate-400">
                      STEP {permit.number}
                    </span>
                  </div>

                  {/* Title & Stage */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-600">
                      {permit.stage}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 leading-snug">
                      {permit.number}. {permit.title.replace(/^\d+\.\s*/, "")}
                    </h3>
                  </div>

                  {/* Body description */}
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {permit.description}
                  </p>

                  {/* Critical note if applicable */}
                  {permit.criticalNote && (
                    <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3 flex items-start gap-2 text-[11px] text-amber-900">
                      <AlertCircle size={15} className="text-amber-600 flex-shrink-0 mt-0.5" />
                      <span>
                        <strong>Important:</strong> {permit.criticalNote}
                      </span>
                    </div>
                  )}
                </div>

                {/* Footer with Authority Badge */}
                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Statutory Authority
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-700">
                    <BadgeCheck size={14} className="text-sky-500" />
                    <span>{permit.authority}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Regulatory Assistance Banner */}
        <div className="bg-gradient-to-r from-sky-50 via-sky-50/70 to-slate-50 border border-sky-100 rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-sky-700 text-xs font-extrabold uppercase tracking-wider">
              <HardHat size={16} />
              Full Compliance Assistance
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">
              Need Help Securing Borehole Drilling Permits?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Jay Axis Company coordinates hydrogeological assessment reports, guides environmental screenings, verifies drilling contractor licensing, and assists borehole owners with WRA borehole completion records and abstraction permits across all 47 counties.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto flex-shrink-0">
            <Link
              href="/quote"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs px-6 py-3.5 rounded-xl shadow-md shadow-sky-500/20 transition-all text-center"
            >
              Request Borehole Survey & Permit Quote <ArrowRight size={14} />
            </Link>
            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 font-bold text-xs px-5 py-3.5 rounded-xl transition-all text-center"
            >
              Consult Compliance Team
            </Link>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="wrap space-y-10">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-sky-600">
            What Drives Us
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Our Core Principles</h2>
          <p className="text-xs text-slate-500">
            Every borehole drilled, tower erected, and solar drive configured reflects our foundational commitment to client satisfaction and engineering rigor.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <div
                key={i}
                className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm hover:shadow-lg hover:border-sky-300 transition-all space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                  <Icon size={20} />
                </div>
                <h3 className="text-sm font-extrabold text-slate-900">{v.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{v.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="wrap">
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 sm:p-12 text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-2xl font-black text-slate-900">Ready to discuss your project?</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Contact our engineering team in Nairobi or submit a quotation request for your community, commercial, or agricultural project.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/quote"
              className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md"
            >
              Request a Quotation <ArrowRight size={14} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 font-bold text-xs px-6 py-3 rounded-xl"
            >
              Contact Our Desk
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

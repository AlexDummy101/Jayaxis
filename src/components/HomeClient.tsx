"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ShieldCheck,
  Award,
  Truck,
  Wrench,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useState, useEffect } from "react";
import { Product, products, categories, getProducts } from "@/lib/products";
import { services } from "@/lib/services";
import { Project, projects, getProjects } from "@/lib/projects";
import { ProductCard } from "@/components/ProductCard";
import { QuoteForm } from "@/components/QuoteForm";

const heroSlides = [
  {
    kicker: "WATER • PUMPS • SOLAR SOLUTIONS",
    title: "Steel and  Concrete towers.",
    highlight: "Stronger and Durable Structures.",
    text: "We build long-lasting steel and concrete structures to serve generations.",
    image: "https://images.unsplash.com/photo-1645107867243-532b2fb01f51?auto=format&fit=crop&w=1600&q=85",
    badge: " Engineering Services",
    productHighlight: {
      name: "4\" Submersible Borehole Pump",
      tag: "Best Seller",
      priceText: "KSh 48,500",
      image: "https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=600&q=80"
    }
  },
  {
    kicker: "GROUNDWATER TO DELIVERY",
    title: "Borehole Drilling & ",
    highlight: "Deep Well Automation.",
    text: "Drilling and Pump installation at affordable rates.",
    image: "jay-e.jpeg",
    badge: "Certified WRMA Standards",
    productHighlight: {
      name: "Solar DC Pump System 110V",
      tag: "Zero Electric Bill",
      priceText: "KSh 72,000",
      image: "https://images.unsplash.com/photo-1508873696983-2df5293cb395?auto=format&fit=crop&w=600&q=80"
    }
  },
  {
    kicker: " Pumps • SOLAR PV Systems ",
    title: "Shop for Pumps, Solar PV Systems & all equipment.",
    highlight: "",
    text: "We bring the best and quality and industrial grade equipment just a click away.",
    image: "/comb.jpg",
    badge: "10-Year Structural Guarantee",
    productHighlight: {
      name: "Elevated Pressed Steel Tank",
      tag: "Modular Capacity",
      priceText: "On Quotation",
      image: "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=600&q=80"
    }
  },
  {
    kicker: "SOLAR WORKS",
    title: "Solar Solutions.",
    highlight: "Solar systems & Hybrid Inverters.",
    text: "Deliverying Quality Solar Solutions countrywide.",
    image: "/Solar.webp",
    badge: "99% MPPT Efficiency",
    productHighlight: {
      name: "Solar Pump Inverter VFD 7.5HP",
      tag: "Dual Hybrid AC/DC",
      priceText: "KSh 68,500",
      image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80"
    }
  }
];

interface HomeClientProps {
  initialProducts?: Product[];
  initialProjects?: Project[];
}

export function HomeClient({ initialProducts, initialProjects }: HomeClientProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedServiceCat, setSelectedServiceCat] = useState("All");
  const [selectedProductCat, setSelectedProductCat] = useState("All");
  const [liveProducts, setLiveProducts] = useState(initialProducts && initialProducts.length > 0 ? initialProducts : products);
  const [liveProjects, setLiveProjects] = useState(initialProjects && initialProjects.length > 0 ? initialProjects : projects);

  useEffect(() => {
    async function loadDynamicContent() {
      try {
        const p = await getProducts();
        if (p && p.length > 0) setLiveProducts(p);
        const pr = await getProjects();
        if (pr && pr.length > 0) setLiveProjects(pr);
      } catch (err) {
        console.warn("Could not fetch live products/projects:", err);
      }
    }
    loadDynamicContent();
  }, []);

  // Slide autoplay
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [isPaused]);

  const slide = heroSlides[currentSlide];

  const filteredServices = services.filter(
    s => selectedServiceCat === "All" || s.category === selectedServiceCat
  );

  const filteredProducts = liveProducts.filter(
    p => selectedProductCat === "All" || p.category === selectedProductCat
  );

  return (
    <div className="space-y-0">
      {/* ========================================================================= */}
      {/* 1. ANIMATED HERO SECTION (Clykay-inspired with floating elements) */}
      {/* ========================================================================= */}
      <section
        className="relative min-h-[660px] lg:min-h-[720px] flex items-center bg-[#002766] overflow-hidden text-white"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {heroSlides.map((s, index) => (
          <div
            key={s.image}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}`}
          >
            <Image
              src={s.image}
              alt={s.title}
              fill
              priority={index === 0}
              className="object-cover object-center scale-105 transition-transform duration-7000 ease-out"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#001f4d]/95 via-[#002b69]/85 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#001738] via-transparent to-transparent opacity-80" />
          </div>
        ))}

        <div className="absolute inset-0 z-20 pointer-events-none opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:32px_32px]" />
        <div className="absolute -right-20 -bottom-20 w-[600px] h-[300px] z-20 pointer-events-none opacity-40">
          <svg viewBox="0 0 500 200" fill="none" className="w-full h-full">
            <path d="M-50,100 C150,20 300,180 550,80" stroke="#38bdf8" strokeWidth="3" strokeDasharray="12 12" className="animate-pulse" />
            <path d="M-50,140 C120,40 320,190 550,110" stroke="#0ea5e9" strokeWidth="2" opacity="0.6" />
          </svg>
        </div>

        <div className="wrap relative z-30 py-20 lg:py-28 w-full">
          <div className="max-w-3xl space-y-6">
            <AnimatePresence mode="wait">
              <motion.div key={currentSlide} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.4 }} className="space-y-4">
                <div className="inline-flex items-center gap-2 bg-sky-500/20 border border-sky-400/40 text-sky-300 text-[11px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full backdrop-blur-sm">
                  <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
                  {slide.kicker}
                </div>
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.08] tracking-tight">
                  {slide.title.replace(slide.highlight, "")}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-sky-300 to-white">{slide.highlight}</span>
                </h1>
                <p className="text-sm sm:text-base text-sky-100/90 leading-relaxed max-w-xl font-normal">{slide.text}</p>
              </motion.div>
            </AnimatePresence>
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link href="/shop" className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-white font-black text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-sky-500/30 transition-all hover:-translate-y-0.5">Shop <ArrowRight size={16} /></Link>
              <Link href="/services" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl backdrop-blur-md transition-all hover:-translate-y-0.5">Our Services</Link>
              <Link href="/quote" className="inline-flex items-center gap-1.5 text-sky-300 hover:text-white font-bold text-xs sm:text-sm px-4 py-3.5 transition-colors underline-offset-4 hover:underline">Request a Quote →</Link>
            </div>
            <div className="pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div className="flex items-center gap-2.5"><div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400"><ShieldCheck size={18} /></div><div><span className="block font-bold text-white">47 Counties</span><span className="text-[10px] text-sky-200">Nationwide Delivery</span></div></div>
              <div className="flex items-center gap-2.5"><div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400"><Wrench size={18} /></div><div><span className="block font-bold text-white">Our Services</span><span className="text-[10px] text-sky-200">Best rates guaranteed</span></div></div>
              <div className="hidden sm:flex items-center gap-2.5"><div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400"><Award size={18} /></div><div><span className="block font-bold text-white">Top Quality Genuine Equipment</span><span className="text-[10px] text-sky-200">With Factory Warranty</span></div></div>
            </div>
          </div>
          <div className="mt-12 flex items-center justify-between">
            <div className="flex items-center gap-2">{heroSlides.map((_, idx) => <button key={idx} onClick={() => setCurrentSlide(idx)} className={`h-2.5 rounded-full transition-all duration-300 ${idx === currentSlide ? "w-8 bg-sky-400" : "w-2.5 bg-white/40 hover:bg-white/70"}`} aria-label={`Go to slide ${idx + 1}`} />)}</div>
            <div className="flex items-center gap-3 text-xs text-sky-200 font-mono"><span>0{currentSlide + 1} / 0{heroSlides.length}</span><div className="flex items-center gap-1"><button onClick={() => setCurrentSlide(prev => (prev - 1 + heroSlides.length) % heroSlides.length)} className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-colors" aria-label="Previous slide"><ChevronLeft size={16} /></button><button onClick={() => setCurrentSlide(prev => (prev + 1) % heroSlides.length)} className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-colors" aria-label="Next slide"><ChevronRight size={16} /></button></div></div>
          </div>
        </div>
      </section>

      <div className="bg-sky-50 border-y border-sky-100 py-4 overflow-hidden"><div className="wrap flex items-center gap-4 text-xs font-bold text-slate-700"><span className="text-[11px] font-black uppercase tracking-wider text-sky-700 bg-sky-200/80 px-2.5 py-1 rounded-md flex-shrink-0">We Deliver:</span><div className="flex items-center gap-6 overflow-x-auto whitespace-nowrap scrollbar-none text-slate-600"><span>● Borehole Drilling & Equipping</span><span>● Elevated Steel & concrete Towers</span><span>● Solar Power Systems</span><span>● Top Quality Pumps, Solar & Equipment</span></div></div></div>

      <section className="py-16 bg-white"><div className="wrap"><div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="relative group rounded-3xl p-8 bg-gradient-to-br from-slate-900 to-[#002766] text-white shadow-xl overflow-hidden flex flex-col justify-between min-h-[320px]"><div className="space-y-3 relative z-10"><span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-400 bg-sky-900/60 px-3 py-1 rounded-full">About Jayaxis</span><h3 className="text-2xl font-black text-white">Who We Are</h3><p className="text-xs text-sky-100/80 leading-relaxed">At Jay Axis Company, we provide reliable water, civil, structural, and solar energy solutions for domestic, commercial, agricultural, institutional, and industrial clients.</p></div><div className="pt-6 relative z-10"><Link href="/about" className="inline-flex items-center gap-2 text-xs font-bold text-sky-300 hover:text-white transition-colors">Learn About Jayaxis <ArrowRight size={14} /></Link></div></div>
        <div className="relative group rounded-3xl p-8 bg-gradient-to-br from-sky-600 to-[#0284c7] text-white shadow-xl overflow-hidden flex flex-col justify-between min-h-[320px]"><div className="space-y-3 relative z-10"><span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-100 bg-sky-700/60 px-3 py-1 rounded-full">Verified Capabilities</span><h3 className="text-2xl font-black text-white">What We Do</h3><p className="text-xs text-sky-50 leading-relaxed">We specialize in water works, steel and concrete towers, and solar technology solutions.</p></div><div className="pt-6 relative z-10"><Link href="/services" className="inline-flex items-center gap-2 text-xs font-bold text-white hover:text-sky-100 transition-colors">Explore All our Services <ArrowRight size={14} /></Link></div></div>
        <div className="relative group rounded-3xl p-8 bg-gradient-to-br from-[#0f2747] to-slate-900 text-white shadow-xl overflow-hidden flex flex-col justify-between min-h-[320px]"><div className="space-y-3 relative z-10"><span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full">Equipment Catalogue</span><h3 className="text-2xl font-black text-white">Product Catalogue</h3><p className="text-xs text-slate-300 leading-relaxed">Welcome to our comprehensive product catalogue for verified water pumps & solar systems.</p></div><div className="pt-6 relative z-10"><Link href="/shop" className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-white transition-colors">Browse Full Catalogue <ArrowRight size={14} /></Link></div></div>
      </div></div></section>

      <section className="py-20 bg-slate-50 border-t border-slate-200/60" id="services"><div className="wrap space-y-12"><div className="flex flex-col md:flex-row md:items-end justify-between gap-6"><div className="space-y-2 max-w-xl"><span className="text-xs font-extrabold uppercase tracking-widest text-sky-600">Water • Pumps • Solar works</span><h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Our Verified Services</h2><p className="text-xs sm:text-sm text-slate-500 leading-relaxed">Jayaxis provides certified end-to-end water & solar solutions.</p></div><div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">{["All", "Water & Borehole", "Pumps", "Solar  Energy  Solutions"].map(cat => <button key={cat} onClick={() => setSelectedServiceCat(cat)} className={`text-xs font-extrabold px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${selectedServiceCat === cat ? "bg-sky-500 text-white shadow-sm" : "bg-white text-slate-600 hover:bg-sky-50 border border-slate-200"}`}>{cat}</button>)}</div></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{filteredServices.map((service, index) => <motion.article key={service.id} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }} className="group relative bg-white border border-slate-200/80 hover:border-sky-300 rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-xl hover:shadow-sky-500/10 transition-all duration-300"><div><div className="flex items-center justify-between mb-5"><span className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 group-hover:bg-sky-500 group-hover:text-white transition-colors flex items-center justify-center text-xl font-bold">{service.icon}</span><span className="text-xs font-mono font-black text-slate-300 group-hover:text-sky-500 transition-colors">{service.number}</span></div><span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-600 block mb-1">{service.category}</span><h3 className="text-lg font-extrabold text-slate-900 group-hover:text-sky-600 transition-colors mb-2">{service.name}</h3><p className="text-xs text-slate-500 leading-relaxed mb-6">{service.description}</p></div><div className="pt-4 border-t border-slate-100 flex items-center justify-between"><Link href={`/services#${service.id}`} className="text-xs font-bold text-slate-700 group-hover:text-sky-600 transition-colors inline-flex items-center gap-1">View Details <ArrowUpRight size={14} /></Link><Link href={`/quote?service=${encodeURIComponent(service.name)}`} className="text-xs font-bold text-sky-600 hover:text-sky-800 bg-sky-50 hover:bg-sky-100 px-3 py-1.5 rounded-lg transition-colors">Request Quote</Link></div></motion.article>)}</div>
        <div className="text-center pt-4"><Link href="/services" className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm px-7 py-3.5 rounded-xl shadow-md transition-all">Explore In-Depth Service Specifications <ArrowRight size={16} /></Link></div>
      </div></section>

      <section className="py-20 bg-white" id="products"><div className="wrap space-y-10"><div className="flex flex-col md:flex-row md:items-end justify-between gap-6"><div className="space-y-2 max-w-xl"><span className="text-xs font-extrabold uppercase tracking-widest text-sky-600">Equipment & Certified Supplies</span><h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Featured Product Catalogue</h2><p className="text-xs sm:text-sm text-slate-500 leading-relaxed">Coming soon!</p></div><Link href="/shop" className="inline-flex items-center gap-2 text-xs font-bold text-sky-600 hover:text-sky-800">View All Catalogue Items <ArrowRight size={15} /></Link></div><div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">{categories.slice(0, 6).map(cat => <button key={cat} onClick={() => setSelectedProductCat(cat)} className={`text-xs font-extrabold px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${selectedProductCat === cat ? "bg-sky-500 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-sky-50"}`}>{cat}</button>)}</div><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">{filteredProducts.slice(0, 8).map(p => <ProductCard key={p.id} p={p} />)}</div></div></section>

      <section className="py-20 bg-slate-900 text-white" id="projects"><div className="wrap space-y-12"><div className="flex flex-col md:flex-row md:items-end justify-between gap-6"><div className="space-y-2 max-w-xl"><span className="text-xs font-extrabold uppercase tracking-widest text-sky-400">Proven Infrastructure Across Kenya</span><h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Featured Projects & Case Studies</h2><p className="text-xs sm:text-sm text-slate-400 leading-relaxed">Take a look at recently executed borehole equipping schemes, elevated steel water storage towers, and solar pumping installations.</p></div><Link href="/projects" className="inline-flex items-center gap-2 text-xs font-bold text-sky-400 hover:text-sky-300">View All Projects & Gallery <ArrowRight size={15} /></Link></div><div className="grid grid-cols-1 md:grid-cols-3 gap-8">{liveProjects.slice(0, 3).map((proj, idx) => <motion.article key={proj.id} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="group relative bg-slate-800/80 rounded-3xl overflow-hidden border border-slate-700/60 hover:border-sky-500 transition-all flex flex-col justify-between"><div className="relative aspect-[16/10] bg-slate-800 overflow-hidden"><Image src={proj.src || proj.image || "/steel.jpeg"} alt={proj.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 33vw" /><div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" /><span className="absolute bottom-3 left-3 bg-sky-500 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-md">{proj.category}</span><span className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded">{proj.county} County</span></div><div className="p-6 flex-1 flex flex-col justify-between space-y-4"><div><h3 className="text-base font-extrabold text-white group-hover:text-sky-400 transition-colors">{proj.title}</h3><p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">{proj.scope}</p></div><div className="pt-4 border-t border-slate-700/60 flex items-center justify-between text-xs"><span className="text-slate-400">Completed in {proj.year}</span><Link href="/projects" className="text-sky-400 hover:text-sky-300 font-bold inline-flex items-center gap-1">Project Specs <ArrowUpRight size={14} /></Link></div></div></motion.article>)}</div></div></section>

      <section className="py-20 bg-white"><div className="wrap grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"><div className="lg:col-span-6 relative rounded-3xl overflow-hidden aspect-[4/3] bg-slate-100 shadow-2xl"><Image src="/jay-e.jpeg" alt="Engineering site commissioning" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" /><div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" /><div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-white text-slate-800"><span className="text-[10px] font-black uppercase text-sky-600 block">Engineering Integrity</span><p className="text-xs font-bold text-slate-900 mt-0.5">Every project is supervised by qualified engineers and built with genuine certified equipment.</p></div></div><div className="lg:col-span-6 space-y-6"><div className="space-y-2"><span className="text-xs font-extrabold uppercase tracking-widest text-sky-600">Why Jayaxis Company Ltd</span><h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">One Trusted Partner from Groundwater to Structure.</h2><p className="text-xs sm:text-sm text-slate-500 leading-relaxed">We combine deep technical expertise in groundwater exploration with heavy structural fabrication and solar engineering, delivering durable, cost-effective infrastructure.</p></div><div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-100"><CheckCircle2 size={20} className="text-sky-600 mb-2" /><h4 className="text-xs font-extrabold text-slate-900">Professional Services</h4><p className="text-[11px] text-slate-500 mt-1">From drilling, borehole equiping to solar system installation under one roof.</p></div><div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-100"><Truck size={20} className="text-sky-600 mb-2" /><h4 className="text-xs font-extrabold text-slate-900">47 Counties Delivery</h4><p className="text-[11px] text-slate-500 mt-1">On-site logistics and equipment mobilization throughout Kenya.</p></div><div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-100"><Award size={20} className="text-sky-600 mb-2" /><h4 className="text-xs font-extrabold text-slate-900">Guaranteed Quality</h4><p className="text-[11px] text-slate-500 mt-1">Factory warranties, material mill certs, and test pumping reports.</p></div><div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-100"><Wrench size={20} className="text-sky-600 mb-2" /><h4 className="text-xs font-extrabold text-slate-900">Dedicated Support</h4><p className="text-[11px] text-slate-500 mt-1">Preventive maintenance, diagnostics, and pump repair services.</p></div></div><div><Link href="/about" className="inline-flex items-center gap-2 text-xs font-bold text-sky-600 hover:text-sky-800">Read More About Our Company & Values <ArrowRight size={15} /></Link></div></div></div></section>

      <section className="py-20 bg-slate-50 border-t border-slate-200/60" id="quote-section"><div className="wrap max-w-4xl space-y-10"><div className="text-center space-y-3 max-w-xl mx-auto"><span className="text-xs font-extrabold uppercase tracking-widest text-sky-600">Start Your Inquiry</span><h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Request a Project Quotation</h2><p className="text-xs sm:text-sm text-slate-500 leading-relaxed">Tell us what you need. Our team will review your service requirements, borehole specifications, or product list and generate a clear quotation.</p></div><QuoteForm /></div></section>
    </div>
  );
}

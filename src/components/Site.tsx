"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Menu,
  X,
  ShoppingBag,
  ArrowUpRight,
  Phone,
  Mail,
  Clock,
  Search,
  Heart,
  ChevronDown,
  MessageCircle,
  ArrowUp,
  MapPin,
  ShieldCheck
} from "lucide-react";
import { useCart } from "@/components/Providers";
import { Logo } from "@/components/Logo";
import { services } from "@/lib/services";
import { CartDrawer } from "@/components/CartDrawer";
import { QuickViewModal } from "@/components/QuickViewModal";
import { motion, AnimatePresence } from "framer-motion";
import { SiFacebook, SiInstagram, SiTiktok, SiX } from "react-icons/si";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { count, toggleCart, wishlist } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Top Announcement Bar (Clykay-inspired) */}
      <div className="bg-[#002b69] text-sky-100 text-[11px] font-medium border-b border-sky-900/40">
        <div className="wrap flex flex-wrap items-center justify-between py-2 gap-2">
          {/* Contact Details */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <a
              href="tel:+254185224887"
              className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone size={13} className="text-sky-400" />
              <span>Hotline: <strong className="text-white">(+254) 185 224 887</strong></span>
            </a>
            <a
              href="mailto:jayaxiscompany@gmail.com"
              className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Mail size={13} className="text-sky-400" />
              <span>Email: <strong className="text-white">jayaxiscompany@gmail.com</strong></span>
            </a>
            <div className="hidden lg:flex items-center gap-1.5 text-sky-200">
              <Clock size={13} className="text-sky-400" />
              <span>Mon - Fri: <strong>8:00am - 5:00pm</strong> · Sat: <strong>8:30am - 1:00pm</strong></span>
            </div>
          </div>

          {/* Right Highlights & Social Links */}
          <div className="flex items-center gap-4 ml-auto">
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-sky-300 bg-sky-900/50 px-2.5 py-0.5 rounded-full">
              <MapPin size={11} /> Serving All 47 Counties
            </span>
            <div className="flex items-center gap-2 text-sky-300">
              <a
                href="https://wa.me/+254185224887"
                target="_blank"
                rel="noreferrer"
                className="hover:text-emerald-400 transition-colors p-1"
                aria-label="WhatsApp Jayaxis"
              >
                <MessageCircle size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-md py-2.5 border-b border-slate-200/60" : "bg-white py-3.5 border-b border-slate-100"
          }`}
      >
        <div className="wrap flex items-center justify-between gap-6">
          {/* Brand Logo */}
          <Logo />

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8" aria-label="Main Navigation">
            <Link
              href="/"
              className="text-xs font-bold text-slate-700 hover:text-sky-600 transition-colors py-2"
            >
              Home
            </Link>

            <Link
              href="/about"
              className="text-xs font-bold text-slate-700 hover:text-sky-600 transition-colors py-2"
            >
              About Us
            </Link>

            {/* Services with 11-Item Mega Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setServicesDropdownOpen(true)}
              onMouseLeave={() => setServicesDropdownOpen(false)}
            >
              <button
                className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-sky-600 transition-colors py-2"
                onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                aria-expanded={servicesDropdownOpen}
              >
                Our Services <ChevronDown size={14} className={`transition-transform duration-200 ${servicesDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {servicesDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.18 }}
                    className="absolute top-full -left-20 w-[640px] bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 grid grid-cols-2 gap-3 z-50"
                  >
                    <div className="col-span-2 pb-2 mb-1 border-b border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-sky-600">
                        Complete Engineering & Water Solutions
                      </span>
                      <Link
                        href="/services"
                        onClick={() => setServicesDropdownOpen(false)}
                        className="text-xs font-bold text-slate-500 hover:text-sky-600 inline-flex items-center gap-1"
                      >
                        View all our services <ArrowUpRight size={13} />
                      </Link>
                    </div>

                    {services.map(s => (
                      <Link
                        key={s.id}
                        href={`/services#${s.id}`}
                        onClick={() => setServicesDropdownOpen(false)}
                        className="group/item flex items-start gap-3 p-2.5 rounded-xl hover:bg-sky-50/70 transition-colors"
                      >
                        <span className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-sm flex-shrink-0 group-hover/item:bg-sky-500 group-hover/item:text-white transition-colors">
                          {s.icon}
                        </span>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 group-hover/item:text-sky-600 transition-colors">
                            {s.name}
                          </h4>
                          <p className="text-[11px] text-slate-500 line-clamp-1">
                            {s.tagline}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              href="/shop"
              className="text-xs font-bold text-slate-700 hover:text-sky-600 transition-colors py-2"
            >
              Shop
            </Link>

            <Link
              href="/projects"
              className="text-xs font-bold text-slate-700 hover:text-sky-600 transition-colors py-2"
            >
              Projects
            </Link>

            <Link
              href="/news"
              className="text-xs font-bold text-slate-700 hover:text-sky-600 transition-colors py-2"
            >
              News
            </Link>

            <Link
              href="/contact"
              className="text-xs font-bold text-slate-700 hover:text-sky-600 transition-colors py-2"
            >
              Contact
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Quick Search Link */}
            <Link
              href="/shop"
              className="w-9 h-9 rounded-full bg-slate-100/80 hover:bg-sky-50 hover:text-sky-600 text-slate-600 flex items-center justify-center transition-colors"
              aria-label="Search product catalogue"
            >
              <Search size={16} />
            </Link>

            {/* Wishlist Link with counter */}
            <Link
              href="/shop"
              className="relative w-9 h-9 rounded-full bg-slate-100/80 hover:bg-red-50 hover:text-red-500 text-slate-600 flex items-center justify-center transition-colors hidden sm:flex"
              aria-label={`Wishlist items: ${wishlist.length}`}
            >
              <Heart size={16} fill={wishlist.length > 0 ? "currentColor" : "none"} className={wishlist.length > 0 ? "text-red-500" : ""} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Trigger with Clykay-style live badge */}
            <button
              onClick={toggleCart}
              className="relative inline-flex items-center gap-2 bg-slate-100/80 hover:bg-sky-50 text-slate-700 hover:text-sky-600 font-bold text-xs px-3 py-2 rounded-xl transition-all border border-slate-200/60"
              aria-label={`Open shopping cart with ${count} items`}
            >
              <ShoppingBag size={17} className="text-sky-600" />
              <span className="hidden md:inline font-bold">Cart</span>
              <span className="bg-sky-500 text-white text-[10px] font-black rounded-full min-w-5 h-5 px-1 flex items-center justify-center shadow-sm">
                {count}
              </span>
            </button>

            {/* Request a Quote CTA button */}
            <Link
              href="/quote"
              className="hidden sm:inline-flex items-center gap-1.5 bg-sky-500 hover:bg-sky-600 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md shadow-sky-500/20"
            >
              Request a Quote <ArrowUpRight size={14} />
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-9 h-9 rounded-xl lg:hidden flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-slate-100 bg-white overflow-hidden shadow-lg"
            >
              <div className="wrap py-4 space-y-3">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between text-xs font-bold text-slate-800 p-2.5 rounded-lg hover:bg-sky-50"
                >
                  Home <ArrowUpRight size={14} className="text-slate-400" />
                </Link>
                <Link
                  href="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between text-xs font-bold text-slate-800 p-2.5 rounded-lg hover:bg-sky-50"
                >
                  About Us <ArrowUpRight size={14} className="text-slate-400" />
                </Link>
                <Link
                  href="/services"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between text-xs font-bold text-slate-800 p-2.5 rounded-lg hover:bg-sky-50"
                >
                  Our Services <ArrowUpRight size={14} className="text-slate-400" />
                </Link>
                <Link
                  href="/shop"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between text-xs font-bold text-slate-800 p-2.5 rounded-lg hover:bg-sky-50"
                >
                  Product Catalogue <ArrowUpRight size={14} className="text-slate-400" />
                </Link>
                <Link
                  href="/projects"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between text-xs font-bold text-slate-800 p-2.5 rounded-lg hover:bg-sky-50"
                >
                  Projects & Portfolio <ArrowUpRight size={14} className="text-slate-400" />
                </Link>
                <Link
                  href="/news"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between text-xs font-bold text-slate-800 p-2.5 rounded-lg hover:bg-sky-50"
                >
                  News & Insights <ArrowUpRight size={14} className="text-slate-400" />
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between text-xs font-bold text-slate-800 p-2.5 rounded-lg hover:bg-sky-50"
                >
                  Contact Us <ArrowUpRight size={14} className="text-slate-400" />
                </Link>

                <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                  <Link
                    href="/quote"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 rounded-xl text-xs shadow-md"
                  >
                    Request a Quote
                  </Link>
                  <a
                    href="tel:+254185224887"
                    className="w-full text-center bg-slate-900 text-white font-bold py-2.5 rounded-xl text-xs"
                  >
                    Call (+254) 185 224 887
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Global Interactive Elements */}
      <CartDrawer />
      <QuickViewModal />
      <FloatingActions />
    </>
  );
}

function FloatingActions() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
      {/* WhatsApp Quick Chat Floating Button */}
      <a
        href="https://wa.me/+254185224887?text=Hello%20Jayaxis,%20I%20would%20like%20to%20inquire%20about%20your%20services%20and%20products."
        target="_blank"
        rel="noreferrer"
        className="w-12 h-12 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 hover:scale-105 transition-all"
        aria-label="Chat on WhatsApp"
        title="Chat with Jayaxis on WhatsApp"
      >
        <MessageCircle size={24} />
      </a>

      {/* Back to Top */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="w-10 h-10 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur flex items-center justify-center shadow-md transition-all self-end"
            aria-label="Scroll back to top"
          >
            <ArrowUp size={18} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#0b172a] text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="wrap">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800/80">
          {/* Column 1: Brand & Overview */}
          <div className="space-y-4">
            <Logo variant="light" />
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Jayaxis Company Ltd is a premier Kenyan engineering and water solutions provider. We specialize in borehole drilling, equipping, steel water towers, solar systems, civil infrastructure, and certified project equipment.
            </p>
            <div className="pt-2 flex flex-col gap-2 text-xs text-sky-400 font-bold">
              <span className="inline-flex items-center gap-2 text-slate-300">
                <ShieldCheck size={16} className="text-sky-400" />
                Licensed Engineering Contractors
              </span>
              <span className="inline-flex items-center gap-2 text-slate-300">
                <MapPin size={16} className="text-sky-400" />
                Nationwide Project Delivery across 47 Counties
              </span>
            </div>
          </div>

          {/* Column 2: The 11 Confirmed Services */}
          <div>
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider mb-4 border-l-2 border-sky-500 pl-2.5">
              Our Services
            </h3>
            <ul className="space-y-2 text-xs">
              {services.map(s => (
                <li key={s.id}>
                  <Link
                    href={`/services#${s.id}`}
                    className="hover:text-sky-400 transition-colors flex items-center gap-1.5"
                  >
                    <span className="text-[10px] text-sky-500 font-mono">0{s.number.replace("0", "")}</span>
                    <span>{s.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Quick Links & Catalogue Categories */}
          <div>
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider mb-4 border-l-2 border-sky-500 pl-2.5">
              Quick Links & Catalogue
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/shop" className="hover:text-sky-400 transition-colors">
                  
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Water%20Pumps" className="hover:text-sky-400 transition-colors">
                  
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Solar%20Water%20Equipment" className="hover:text-sky-400 transition-colors">
                  
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Water%20Storage%20%26%20Tanks" className="hover:text-sky-400 transition-colors">
                 
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-sky-400 transition-colors">
                  Completed Projects & Case Studies
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-sky-400 transition-colors">
                  News & Engineering Insights
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-sky-400 transition-colors">
                  About Jayaxis Company Ltd
                </Link>
              </li>
              <li>
                <Link href="/quote" className="hover:text-sky-400 transition-colors">
                  Request a Formal Quotation
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-sky-400 transition-colors">
                  
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Location */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider mb-4 border-l-2 border-sky-500 pl-2.5">
              Contact Information
            </h3>
            <address className="not-italic space-y-3 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin size={16} className="text-sky-400 mt-0.5 flex-shrink-0" />
                <span>Kakamega Commercial District, Kakamega, Kenya</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={16} className="text-sky-400 flex-shrink-0" />
                <a href="tel:+254185224887" className="hover:text-white">
                  (+254) 185 224 887
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <MessageCircle size={16} className="text-emerald-400 flex-shrink-0" />
                <a href="https://wa.me/+254185224887    
                
                
                
                
                " target="_blank" rel="noreferrer" className="hover:text-white">
                  WhatsApp Support Desk
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={16} className="text-sky-400 flex-shrink-0" />
                <a href="mailto:jayaxiscompany@gmail.com" className="hover:text-white">
                  jayaxiscompany@gmail.com
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock size={16} className="text-sky-400 mt-0.5 flex-shrink-0" />
                <span>
                  Mon - Fri: 8:00 AM - 5:00 PM<br />
                  Sat: 8:30 AM - 1:00 PM
                </span>
              </div>
            </address>

            <div className="pt-2">
              <Link
                href="/quote"
                className="w-full inline-flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md transition-colors"
              >
                Start an Inquiry <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        {/* Subfooter */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} Jayaxis Company Ltd. All rights reserved. Engineering, water, and structural solutions.
          </p>
          <nav aria-label="Social media" className="flex items-center gap-4 text-slate-400">
            <a
              href="https://www.instagram.com/jayaxis/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Jayaxis on Instagram"
              title="Instagram"
              className="hover:text-white transition-colors"
            >
              <SiInstagram size={17} />
            </a>
            <a
              href="https://www.facebook.com/jayaxis"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Jayaxis on Facebook"
              title="Facebook"
              className="hover:text-white transition-colors"
            >
              <SiFacebook size={17} />
            </a>
            <a
              href="https://www.tiktok.com/@jayaxis"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Jayaxis on TikTok"
              title="TikTok"
              className="hover:text-white transition-colors"
            >
              <SiTiktok size={17} />
            </a>
            <a
              href="https://x.com/jayaxis"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Jayaxis on X"
              title="X"
              className="hover:text-white transition-colors"
            >
              <SiX size={17} />
            </a>
          </nav>
          <div className="flex items-center gap-4 text-slate-400">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span>·</span>
            <Link href="/contact" className="hover:text-white transition-colors">
              Support
            </Link>
            <span>·</span>
            <Link href="/quote" className="hover:text-white transition-colors">
              Quotations
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

"use client";

import { useCart } from "@/components/Providers";
import { price } from "@/lib/products";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Star, CheckCircle2, ArrowRight, Heart, MessageCircle } from "lucide-react";
import { useState } from "react";

export function QuickViewModal() {
  const { quickViewProduct, setQuickViewProduct, add, wishlist, toggleWishlist } = useCart();
  const [qtyCount, setQtyCount] = useState(1);
  const [added, setAdded] = useState(false);

  if (!quickViewProduct) return null;

  const isLiked = wishlist.includes(quickViewProduct.id);

  const handleAddToCart = () => {
    add(quickViewProduct.id, qtyCount, quickViewProduct);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      setQuickViewProduct(null);
    }, 800);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setQuickViewProduct(null)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          aria-label="Close modal backdrop"
        />

        <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-3xl"
          >
            {/* Top Actions: Wishlist and Close button */}
            <div className="absolute right-4 top-4 z-10 flex items-center gap-2">
              <button
                onClick={() => toggleWishlist(quickViewProduct.id)}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors shadow-sm ${
                  isLiked
                    ? "bg-red-50 text-red-500 border border-red-200"
                    : "bg-white/90 hover:bg-white text-slate-400 hover:text-red-500 border border-slate-200"
                }`}
                aria-label={isLiked ? "Remove from wishlist" : "Save to wishlist"}
                title={isLiked ? "Saved to wishlist" : "Save to wishlist"}
              >
                <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
              </button>
              <button
                onClick={() => setQuickViewProduct(null)}
                className="w-9 h-9 rounded-full bg-slate-100/90 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors shadow-sm"
                aria-label="Close quick view"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Product Visual */}
              <div className="relative aspect-square md:aspect-auto md:h-full bg-slate-100 min-h-[300px]">
                <Image
                  src={quickViewProduct.src || quickViewProduct.image || "/steel.jpeg"}
                  alt={quickViewProduct.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                  <span className="bg-sky-500 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md shadow-sm">
                    {quickViewProduct.category}
                  </span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded shadow-sm ${
                    quickViewProduct.stock === "Coming soon"
                      ? "bg-purple-600 text-white"
                      : quickViewProduct.stock === "In stock"
                      ? "bg-emerald-600 text-white"
                      : quickViewProduct.stock === "Limited stock"
                      ? "bg-amber-600 text-white"
                      : "bg-slate-700 text-white"
                  }`}>
                    {quickViewProduct.stock}
                  </span>
                </div>
              </div>

              {/* Product Info & Specifications */}
              <div className="p-6 md:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill="currentColor" />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-slate-600">
                      {quickViewProduct.rating} ({quickViewProduct.reviewsCount} inquiries)
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-slate-900 leading-snug">
                    {quickViewProduct.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 mb-4 leading-relaxed">
                    {quickViewProduct.description}
                  </p>

                  {quickViewProduct.stock === "Coming soon" ? (
                    <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-xl">
                      <span className="text-xs font-black uppercase tracking-wider text-purple-700 block">
                        Coming Soon
                      </span>
                      <span className="text-[11px] text-purple-700">Official pricing will be published upon release.</span>
                    </div>
                  ) : (
                    <div className="text-2xl font-black text-sky-600 mb-4">
                      {price(quickViewProduct.price)}
                      <span className="text-xs font-normal text-slate-400 ml-2">VAT inclusive / quote estimate</span>
                    </div>
                  )}

                  {/* Specifications Snapshot */}
                  <div className="bg-slate-50 rounded-xl p-3.5 mb-5 border border-slate-100">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-2">
                      Key Technical Specifications
                    </span>
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px]">
                      {Object.entries(quickViewProduct.specifications).slice(0, 4).map(([k, v]) => (
                        <div key={k}>
                          <span className="text-slate-500 font-medium">{k}:</span>{" "}
                          <span className="text-slate-800 font-bold">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Features highlights */}
                  <ul className="space-y-1.5 mb-6 text-xs text-slate-600">
                    {quickViewProduct.features.slice(0, 3).map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 size={14} className="text-sky-500 mt-0.5 flex-shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actions */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  {quickViewProduct.stock === "Coming soon" ? (
                    <a
                      href={`https://wa.me/254185224887?text=${encodeURIComponent(`Hello Jayaxis Company Ltd, I am inquiring about *${quickViewProduct.name}* (${quickViewProduct.sku}) which is coming soon.`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-10 px-4 rounded-xl text-xs transition-all shadow-md shadow-emerald-600/20"
                    >
                      <MessageCircle size={16} /> Inquire Availability via WhatsApp
                    </a>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-slate-200 rounded-xl bg-white overflow-hidden">
                        <button
                          onClick={() => setQtyCount(Math.max(1, qtyCount - 1))}
                          className="w-9 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-100 font-bold"
                        >
                          -
                        </button>
                        <span className="w-10 text-center font-bold text-slate-800 text-sm">
                          {qtyCount}
                        </span>
                        <button
                          onClick={() => setQtyCount(qtyCount + 1)}
                          className="w-9 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-100 font-bold"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={handleAddToCart}
                        className="flex-1 flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-bold h-10 px-4 rounded-xl text-xs transition-all shadow-md shadow-sky-500/20"
                      >
                        <ShoppingBag size={16} />
                        {added ? "Added to Cart!" : "Add to Cart"}
                      </button>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/quote?item=${encodeURIComponent(quickViewProduct.name)}`}
                      onClick={() => setQuickViewProduct(null)}
                      className="flex-1 text-center bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-3 rounded-xl text-xs transition-colors"
                    >
                      Request a Custom Quote
                    </Link>
                    <Link
                      href={`/shop/${quickViewProduct.id}`}
                      onClick={() => setQuickViewProduct(null)}
                      className="text-xs text-sky-600 hover:text-sky-700 font-bold px-3 py-2.5 inline-flex items-center gap-1"
                    >
                      Full Details <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}

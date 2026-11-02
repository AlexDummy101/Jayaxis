"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ShoppingBag, Eye, Heart, Star, Check } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/lib/products";
import { price } from "@/lib/products";
import { useCart } from "@/components/Providers";

interface ProductCardProps {
  p: Product;
  compact?: boolean;
}

export function ProductCard({ p, compact = false }: ProductCardProps) {
  const { add, wishlist, toggleWishlist, setQuickViewProduct } = useCart();
  const [added, setAdded] = useState(false);
  const reduce = useReducedMotion();
  const isLiked = wishlist.includes(p.id);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    add(p.id, 1, p);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewProduct(p);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(p.id);
  };

  return (
    <motion.article
      className="group relative bg-white border border-slate-200/80 hover:border-sky-300 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-sky-500/10 flex flex-col justify-between"
      whileHover={reduce ? undefined : { y: -5 }}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4 }}
    >
      {/* Top Media Container */}
      <div className="relative aspect-[4/3] bg-slate-50 overflow-hidden">
        <Link href={`/shop/${p.id}`} className="block w-full h-full">
          <Image
            src={p.src || p.image || "/steel.jpeg"}
            alt={p.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </Link>

        {/* Category Pill */}
        <span className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md text-[#0284c7] text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md shadow-sm border border-slate-100">
          {p.category}
        </span>

        {/* Stock Badge */}
        <span
          className={`absolute top-3 left-3 text-[9px] font-bold px-2 py-0.5 rounded shadow-sm ${
            p.stock === "Coming soon"
              ? "bg-purple-600 text-white"
              : p.stock === "In stock"
              ? "bg-emerald-500 text-white"
              : p.stock === "Limited stock"
              ? "bg-amber-500 text-white"
              : "bg-slate-700 text-white"
          }`}
        >
          {p.stock}
        </span>

        {/* Floating Quick Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleLike}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm ${
              isLiked
                ? "bg-red-50 text-red-500 border border-red-200"
                : "bg-white/90 text-slate-500 hover:text-red-500 hover:bg-white border border-slate-200/60"
            }`}
            aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart size={14} fill={isLiked ? "currentColor" : "none"} />
          </button>

          <button
            onClick={handleQuickView}
            className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-500 hover:text-sky-600 border border-slate-200/60 flex items-center justify-center transition-all shadow-sm"
            aria-label="Quick view product"
          >
            <Eye size={14} />
          </button>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Rating Snapshot */}
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="flex text-amber-400">
              <Star size={12} fill="currentColor" />
            </div>
            <span className="text-[11px] font-bold text-slate-600">
              {p.rating} <span className="text-slate-400 font-normal">({p.reviewsCount})</span>
            </span>
            <span className="text-[10px] text-slate-400 ml-auto font-mono">
              {p.sku}
            </span>
          </div>

          <Link href={`/shop/${p.id}`} className="block">
            <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-sky-600 transition-colors line-clamp-1">
              {p.name}
            </h3>
          </Link>

          {!compact && (
            <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 mb-4 leading-relaxed min-h-[32px]">
              {p.tagline || p.description}
            </p>
          )}
        </div>

        {/* Pricing and Action Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
          {p.stock === "Coming soon" ? (
            <div>
              <span className="text-[10px] text-purple-600 block font-bold uppercase tracking-wider">
                Availability
              </span>
              <b className="text-xs sm:text-sm font-extrabold text-purple-700">
                Coming Soon
              </b>
            </div>
          ) : (
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">
                {p.price ? "Estimated Price" : "Enquiry Only"}
              </span>
              <b className="text-sm font-black text-slate-900 text-sky-700">
                {price(p.price)}
              </b>
            </div>
          )}

          <div className="flex items-center gap-1.5">
            {p.stock === "Coming soon" ? (
              <Link
                href={`/shop/${p.id}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl transition-all bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200"
              >
                <Eye size={14} /> Preview
              </Link>
            ) : (
              <button
                onClick={handleAdd}
                className={`inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-sm ${
                  added
                    ? "bg-emerald-600 text-white"
                    : "bg-sky-500 hover:bg-sky-600 text-white shadow-sky-500/20"
                }`}
                aria-label={`Add ${p.name} to cart`}
              >
                {added ? (
                  <>
                    <Check size={14} /> Added
                  </>
                ) : (
                  <>
                    <ShoppingBag size={14} /> Add
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

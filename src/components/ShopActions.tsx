"use client";

import { useState } from "react";
import { ShoppingBag, Check, Heart, MessageCircle } from "lucide-react";
import { useCart } from "@/components/Providers";

import type { Product } from "@/lib/products";

export function AddToCart({ id, productName, product }: { id: string; productName?: string; product?: Product }) {
  const { add, wishlist, toggleWishlist } = useCart();
  const [done, setDone] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const isLiked = wishlist.includes(id);

  const handleAdd = () => {
    add(id, quantity, product);
    setDone(true);
    setTimeout(() => setDone(false), 1800);
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      {/* Quantity incrementor */}
      <div className="flex items-center border border-slate-200 rounded-xl bg-white overflow-hidden self-start">
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="w-10 h-11 flex items-center justify-center text-slate-600 hover:bg-slate-100 font-bold"
          aria-label="Decrease quantity"
        >
          -
        </button>
        <span className="w-12 text-center font-bold text-slate-800 text-sm">
          {quantity}
        </span>
        <button
          onClick={() => setQuantity(quantity + 1)}
          className="w-10 h-11 flex items-center justify-center text-slate-600 hover:bg-slate-100 font-bold"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      {/* Add To Cart */}
      <button
        onClick={handleAdd}
        className={`flex-1 inline-flex items-center justify-center gap-2 font-extrabold text-xs sm:text-sm h-11 px-6 rounded-xl transition-all shadow-md ${
          done
            ? "bg-emerald-600 text-white shadow-emerald-500/20"
            : "bg-sky-500 hover:bg-sky-600 text-white shadow-sky-500/25"
        }`}
      >
        {done ? <Check size={17} /> : <ShoppingBag size={17} />}
        {done ? "Added to Your Cart!" : "Add to Cart"}
      </button>

      {/* Wishlist Button */}
      <button
        onClick={() => toggleWishlist(id)}
        className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-colors flex-shrink-0 ${
          isLiked
            ? "border-red-200 bg-red-50 text-red-500"
            : "border-slate-200 hover:border-slate-300 text-slate-400 hover:text-red-500"
        }`}
        aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
      </button>

      {/* Direct WhatsApp Quick Inquire */}
      {productName && (
        <a
          href={`https://wa.me/254185224887?text=${encodeURIComponent(`Hello Jayaxis Company Ltd, I am inquiring about *${productName}* (Qty: ${quantity}). Please provide quotation and availability details.`)}`}
          target="_blank"
          rel="noreferrer"
          className="h-11 px-4 rounded-xl border border-emerald-500/30 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 flex items-center justify-center gap-1.5 font-bold text-xs transition-colors whitespace-nowrap"
          title="Direct WhatsApp Inquiry"
        >
          <MessageCircle size={16} />
          <span>Inquire</span>
        </a>
      )}
    </div>
  );
}

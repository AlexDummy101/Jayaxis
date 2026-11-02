"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/Providers";
import { products, price } from "@/lib/products";
import { ArrowRight, Trash2, ShoppingBag, FileText, ArrowLeft, ShieldCheck, Truck } from "lucide-react";

export default function CartPage() {
  const { items, qty, remove, clearCart, count, getProduct } = useCart();

  const lines = items
    .map(i => ({ ...i, p: i.product || getProduct(i.id) || products.find(p => p.id === i.id) }))
    .filter((x): x is { id: string; qty: number; p: NonNullable<typeof x.p> } => Boolean(x.p));

  const subtotal = lines.reduce((acc, line) => acc + (line.p.price || 0) * line.qty, 0);

  const formatSubtotal = new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0
  }).format(subtotal);

  return (
    <div className="py-12 space-y-12">
      <div className="wrap max-w-5xl space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-sky-600 block mb-1">
              Order Review & Selection
            </span>
            <h1 className="text-3xl font-black text-slate-900">Your Shopping Cart</h1>
            <p className="text-xs text-slate-500 mt-1">
              Review selected items. You can proceed to simulated checkout or request an official formal quotation.
            </p>
          </div>
          <Link
            href="/shop"
            className="text-xs font-bold text-sky-600 hover:text-sky-800 inline-flex items-center gap-1 self-start sm:self-auto"
          >
            <ArrowLeft size={14} /> Continue Shopping
          </Link>
        </div>

        {!lines.length ? (
          <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-16 text-center max-w-md mx-auto space-y-4">
            <div className="w-20 h-20 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center mx-auto">
              <ShoppingBag size={36} />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Your cart is empty</h2>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Browse our water pumps, solar drives, elevated tanks, and engineering supplies to add items.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md shadow-sky-500/20"
            >
              Browse Catalogue <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Items Column */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500 px-2">
                <span>{count} items in your order</span>
                <button
                  onClick={clearCart}
                  className="text-red-500 hover:text-red-700 font-semibold"
                >
                  Empty Entire Cart
                </button>
              </div>

              <div className="space-y-3">
                {lines.map(({ id, qty: itemQty, p }) => (
                  <article
                    key={id}
                    className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-sm hover:border-sky-300 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200/60">
                        <Image
                          src={p.src || p.image || "/steel.jpeg"}
                          alt={p.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-extrabold text-sky-600 uppercase tracking-wider">
                          {p.category}
                        </span>
                        <Link href={`/shop/${p.id}`}>
                          <h3 className="text-sm font-extrabold text-slate-900 hover:text-sky-600 transition-colors">
                            {p.name}
                          </h3>
                        </Link>
                        <p className="text-xs font-bold text-slate-900 mt-1">
                          {price(p.price)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full sm:w-auto gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <div className="inline-flex items-center border border-slate-200 rounded-xl bg-white overflow-hidden">
                        <button
                          onClick={() => qty(id, itemQty - 1)}
                          className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 font-bold"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="w-10 text-center text-xs font-bold text-slate-800">
                          {itemQty}
                        </span>
                        <button
                          onClick={() => qty(id, itemQty + 1)}
                          className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 font-bold"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right min-w-[90px]">
                        <span className="text-[10px] text-slate-400 block font-medium">Subtotal</span>
                        <span className="text-xs font-extrabold text-slate-900">
                          {new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 }).format((p.price || 0) * itemQty)}
                        </span>
                      </div>

                      <button
                        onClick={() => remove(id)}
                        className="text-slate-400 hover:text-red-500 p-1.5 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-2 gap-4 pt-4 text-xs text-slate-600">
                <div className="flex items-center gap-2 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <ShieldCheck size={18} className="text-sky-500" />
                  <span>Equipment backed by manufacturer warranties</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <Truck size={18} className="text-sky-500" />
                  <span>On-site delivery available to all 47 counties</span>
                </div>
              </div>
            </div>

            {/* Summary Column */}
            <aside className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-lg space-y-5">
              <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">
                Order Summary
              </h2>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Selected items:</span>
                  <span className="font-bold text-slate-800">{count}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Estimated Total:</span>
                  <span className="text-base font-black text-slate-900">{formatSubtotal}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Site Delivery:</span>
                  <span className="text-sky-600 font-semibold">Confirmed on Quotation</span>
                </div>
              </div>

              <div className="pt-2 space-y-3">
                {/* Quotation CTA */}
                <Link
                  href={`/quote?items=${encodeURIComponent(lines.map(c => `${c.p.name} (Qty: ${c.qty})`).join(", "))}`}
                  className="w-full flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-bold py-3.5 px-4 rounded-xl text-xs transition-all shadow-md shadow-sky-500/20"
                >
                  <FileText size={16} /> Request Formal PDF Quotation
                </Link>

                {/* Checkout CTA */}
                <Link
                  href="/checkout"
                  className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl text-xs transition-colors"
                >
                  Proceed to Order Review <ArrowRight size={15} />
                </Link>
              </div>

              <p className="text-[11px] text-slate-400 text-center leading-relaxed">
                Prices shown are standard estimates. Final project pricing and delivery charges are confirmed by quotation.
              </p>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

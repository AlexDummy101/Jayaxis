"use client";

import { useCart } from "@/components/Providers";
import { products, price } from "@/lib/products";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, ShoppingBag, ArrowRight, FileText } from "lucide-react";

export function CartDrawer() {
  const { items, isCartOpen, closeCart, qty, remove, clearCart, count, getProduct } = useCart();

  const cartLines = items
    .map(item => ({
      ...item,
      product: item.product || getProduct(item.id) || products.find(p => p.id === item.id)
    }))
    .filter((line): line is { id: string; qty: number; product: NonNullable<typeof line.product> } => Boolean(line.product));

  const subtotal = cartLines.reduce((sum, line) => {
    return sum + (line.product.price || 0) * line.qty;
  }, 0);

  const formatSubtotal = new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0
  }).format(subtotal);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeCart}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            aria-label="Close cart backdrop"
          />

          {/* Slide-over panel */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="w-screen max-w-md bg-white shadow-2xl flex flex-col"
              aria-label="Shopping Cart Drawer"
            >
              {/* Header */}
              <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-sky-50 to-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-md shadow-sky-500/20">
                    <ShoppingBag size={20} />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900">Your Cart</h2>
                    <p className="text-xs text-slate-500 font-medium">
                      {count} {count === 1 ? "item" : "items"} selected
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeCart}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  aria-label="Close cart drawer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Items List / Empty State */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {cartLines.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
                    <div className="w-20 h-20 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center mb-4">
                      <ShoppingBag size={36} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-1">Your cart is empty</h3>
                    <p className="text-xs text-slate-500 max-w-xs mb-6 leading-relaxed">
                      Explore our high-performance water pumps, solar equipment, and water storage solutions to get started.
                    </p>
                    <Link
                      href="/shop"
                      onClick={closeCart}
                      className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold px-5 py-3 rounded-xl transition-all shadow-md shadow-sky-500/20"
                    >
                      Browse Catalogue <ArrowRight size={15} />
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-100">
                      <span>Products selected</span>
                      <button
                        onClick={clearCart}
                        className="text-xs text-red-500 hover:text-red-700 font-semibold"
                      >
                        Clear cart
                      </button>
                    </div>

                    {cartLines.map(({ id, qty: itemQty, product }) => (
                      <div
                        key={id}
                        className="flex gap-3.5 p-3.5 rounded-xl border border-slate-100 hover:border-sky-200 bg-white hover:bg-sky-50/20 transition-all shadow-sm"
                      >
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200/60">
                          <Image
                            src={product.src || product.image || "/steel.jpeg"}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider">
                              {product.category}
                            </span>
                            <h4 className="text-xs font-bold text-slate-900 truncate" title={product.name}>
                              {product.name}
                            </h4>
                            <p className="text-xs font-bold text-slate-900 mt-0.5">
                              {price(product.price)}
                            </p>
                          </div>

                          <div className="flex items-center justify-between mt-2">
                            <div className="inline-flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
                              <button
                                onClick={() => qty(id, itemQty - 1)}
                                className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-100 text-xs font-bold"
                                aria-label="Decrease quantity"
                              >
                                -
                              </button>
                              <span className="w-8 text-center text-xs font-bold text-slate-800">
                                {itemQty}
                              </span>
                              <button
                                onClick={() => qty(id, itemQty + 1)}
                                className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-100 text-xs font-bold"
                                aria-label="Increase quantity"
                              >
                                +
                              </button>
                            </div>

                            <button
                              onClick={() => remove(id)}
                              className="text-slate-400 hover:text-red-500 p-1 transition-colors"
                              aria-label="Remove item"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>

              {/* Drawer Footer with Actions */}
              {cartLines.length > 0 && (
                <div className="p-5 border-t border-slate-100 bg-slate-50 space-y-3">
                  <div className="space-y-1.5 pb-2">
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Subtotal</span>
                      <span className="font-bold text-slate-900">{formatSubtotal}</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Delivery & Setup</span>
                      <span className="text-sky-600 font-semibold">Confirmed on Quotation</span>
                    </div>
                    <p className="text-[11px] text-slate-400 italic">
                      Tax and site-specific delivery calculated in your quotation.
                    </p>
                  </div>

                  {/* Primary CTA 1: Request Quote for these items */}
                  <Link
                    href={`/quote?items=${encodeURIComponent(cartLines.map(c => `${c.product.name} (Qty: ${c.qty})`).join(", "))}`}
                    onClick={closeCart}
                    className="w-full flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-bold py-3.5 px-4 rounded-xl text-xs transition-all shadow-md shadow-sky-500/20"
                  >
                    <FileText size={16} />
                    Request Quotation for Cart Items
                  </Link>

                  {/* Secondary CTA 2: Proceed to Checkout Preview */}
                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl text-xs transition-colors"
                  >
                    Proceed to Order Review <ArrowRight size={15} />
                  </Link>

                  <div className="text-center pt-1">
                    <button
                      onClick={closeCart}
                      className="text-xs text-slate-500 hover:text-sky-600 font-semibold"
                    >
                      Continue Browsing Catalogue
                    </button>
                  </div>
                </div>
              )}
            </motion.aside>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

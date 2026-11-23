"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  MessageCircle,
  ShieldCheck,
  Star,
  Truck,
  Wrench
} from "lucide-react";
import { AddToCart } from "@/components/ShopActions";
import { ProductCard } from "@/components/ProductCard";
import {
  getProductById,
  getProducts,
  productPriceText,
  productQuotationWhatsAppHref,
  type Product
} from "@/lib/products";

type LoadState = "loading" | "ready" | "not-found" | "error";

export function ProductLookup() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let active = true;

    if (!id) {
      setProduct(null);
      setAllProducts([]);
      setLoadState("not-found");
      return () => {
        active = false;
      };
    }

    setLoadState("loading");
    Promise.all([getProductById(id), getProducts()])
      .then(([foundProduct, products]) => {
        if (!active) return;
        if (!foundProduct) {
          setProduct(null);
          setAllProducts(products);
          setLoadState("not-found");
          return;
        }
        setProduct(foundProduct);
        setAllProducts(products);
        setLoadState("ready");
        document.title = `${foundProduct.name} | Jayaxis Company Ltd`;
      })
      .catch(error => {
        console.error("Could not load product details:", error);
        if (active) setLoadState("error");
      });

    return () => {
      active = false;
    };
  }, [id, retryCount]);

  if (loadState === "loading") {
    return (
      <div className="wrap py-16 text-center text-sm font-semibold text-slate-500">
        Loading product...
      </div>
    );
  }

  if (loadState === "error") {
    return (
      <section className="wrap py-16 text-center space-y-4">
        <h1 className="text-2xl font-black text-slate-900">Product details couldn&apos;t be loaded</h1>
        <p className="text-sm text-slate-500">Please check your connection and try again.</p>
        <button
          type="button"
          onClick={() => setRetryCount(count => count + 1)}
          className="inline-flex items-center rounded-xl bg-sky-500 px-5 py-3 text-sm font-bold text-white hover:bg-sky-600"
        >
          Try again
        </button>
      </section>
    );
  }

  if (loadState === "not-found" || !product) {
    return (
      <section className="wrap py-16 text-center space-y-4">
        <h1 className="text-2xl font-black text-slate-900">Product not found</h1>
        <p className="text-sm text-slate-500">This product may have been removed or the link may be incorrect.</p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-3 text-sm font-bold text-white hover:bg-sky-600"
        >
          <ArrowLeft size={16} /> Browse the catalogue
        </Link>
      </section>
    );
  }

  const relatedProducts = allProducts
    .filter(item => item.category === product.category && item.id !== product.id)
    .slice(0, 4);

  return (
    <div className="py-12">
      <div className="wrap space-y-10">
        <nav className="flex items-center gap-2 text-xs text-slate-400">
          <Link href="/" className="hover:text-slate-700">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-slate-700">Catalogue</Link>
          <span>/</span>
          <Link
            href={`/shop?category=${encodeURIComponent(product.category)}`}
            className="hover:text-slate-700"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="truncate font-bold text-slate-800">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-6">
            <div className="relative aspect-square overflow-hidden rounded-3xl border border-slate-200/80 bg-slate-100 shadow-md">
              <Image
                src={product.src || product.image || "/steel.jpeg"}
                alt={product.name}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute left-4 top-4 flex flex-col gap-2">
                <span className="rounded-md bg-sky-500 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-white">
                  {product.category}
                </span>
                <span className="w-fit rounded bg-slate-800 px-2.5 py-0.5 text-[10px] font-bold text-white">
                  {product.stock}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <TrustBadge icon={<ShieldCheck size={18} />} title="Warranty Backed" detail="Official Guarantee" />
              <TrustBadge icon={<Truck size={18} />} title="Kenya Delivery" detail="All 47 Counties" />
              <TrustBadge icon={<Wrench size={18} />} title="Technical Support" detail="Engineering Setup" />
            </div>
          </div>

          <div className="space-y-6 lg:col-span-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="flex text-amber-400" aria-label={`${product.rating} out of 5 stars`}>
                  {[...Array(5)].map((_, index) => (
                    <Star key={index} size={15} fill="currentColor" />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-600">
                  {product.rating} ({product.reviewsCount} customer reviews)
                </span>
                <span className="ml-auto font-mono text-xs text-slate-400">SKU: {product.sku}</span>
              </div>
              <h1 className="text-2xl font-black leading-snug text-slate-900 sm:text-3xl">{product.name}</h1>
              <p className="text-sm font-semibold text-sky-600">{product.tagline}</p>
            </div>

            <div className="flex flex-wrap items-baseline justify-between gap-2 rounded-2xl border border-sky-100 bg-sky-50/60 p-5">
              <div>
                {!product.priceOnRequest && (
                  <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    {product.price ? "Price" : "Custom Project Sizing"}
                  </span>
                )}
                <div className={`text-3xl font-black ${product.priceOnRequest ? "text-slate-900" : "text-sky-700"}`}>
                  {productPriceText(product)}
                </div>
              </div>
              {!product.priceOnRequest && (
                <span className="rounded-full border border-sky-200 bg-white px-3 py-1 text-xs font-bold text-sky-700">
                  VAT Inclusive Estimate
                </span>
              )}
            </div>

            <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">{product.description}</p>

            {product.features?.length > 0 && (
              <section className="space-y-2 pt-2">
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">Product Advantages</h2>
                <ul className="space-y-2 text-xs text-slate-600">
                  {product.features.map((feature, index) => (
                    <li key={`${index}-${feature}`} className="flex items-start gap-2.5">
                      <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-sky-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {product.stock === "Coming soon" ? (
              <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row">
                <a
                  href={`https://wa.me/254183947157?text=${encodeURIComponent(`Hello Jayaxis Company Ltd, I am inquiring about ${product.name} (${product.sku}). Please notify me when available.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-xs font-extrabold text-white hover:bg-emerald-700"
                >
                  <MessageCircle size={17} /> Inquire on WhatsApp
                </a>
                <Link
                  href={`/quote?items=${encodeURIComponent(`${product.name} (${product.sku}) - Coming Soon`)}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-xs font-bold text-white hover:bg-slate-800"
                >
                  <FileText size={16} /> Pre-Order Inquiry
                </Link>
              </div>
            ) : (
              product.priceOnRequest ? (
                <div className="border-t border-slate-100 pt-4">
                  <a
                    href={productQuotationWhatsAppHref(product)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-extrabold text-white hover:bg-emerald-700"
                  >
                    <MessageCircle size={17} /> Request Quotation on WhatsApp
                  </a>
                </div>
              ) : (
              <div className="space-y-3 border-t border-slate-100 pt-4">
                <AddToCart id={product.id} productName={product.name} product={product} />
                <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                  <Link
                    href={`/quote?items=${encodeURIComponent(`${product.name} (${product.sku})`)}`}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-bold text-white hover:bg-slate-800"
                  >
                    <FileText size={15} /> Request Formal Quotation
                  </Link>
                  <a
                    href={`https://wa.me/254183947157?text=${encodeURIComponent(`Hello Jayaxis, I would like to inquire about ${product.name} (${product.sku}).`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-xs font-bold text-white hover:bg-emerald-600"
                  >
                    <MessageCircle size={15} /> Inquire on WhatsApp
                  </a>
                </div>
              </div>
              )
            )}
          </div>
        </div>

        {Object.keys(product.specifications ?? {}).length > 0 && (
          <section className="space-y-4 rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8">
            <h2 className="border-b border-slate-100 pb-3 text-lg font-black text-slate-900">
              Technical Specifications &amp; Operating Parameters
            </h2>
            <div className="grid grid-cols-1 gap-x-8 gap-y-3 text-xs md:grid-cols-2">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between border-b border-slate-100/80 py-2">
                  <span className="font-medium text-slate-500">{key}</span>
                  <span className="font-bold text-slate-900">{value}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {relatedProducts.length > 0 && (
          <section className="space-y-6 border-t border-slate-200/60 pt-8">
            <div className="flex items-center justify-between">
              <div>
                <span className="block text-xs font-extrabold uppercase tracking-widest text-sky-600">
                  Complementary Supplies
                </span>
                <h2 className="text-xl font-black text-slate-900">Related Equipment in {product.category}</h2>
              </div>
              <Link
                href={`/shop?category=${encodeURIComponent(product.category)}`}
                className="text-xs font-bold text-sky-600 hover:text-sky-800"
              >
                View Category →
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map(related => <ProductCard key={related.id} p={related} compact />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function TrustBadge({ icon, title, detail }: { icon: React.ReactNode; title: string; detail: string }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
      <span className="mx-auto mb-1 block w-fit text-sky-500">{icon}</span>
      <span className="block text-[11px] font-bold text-slate-800">{title}</span>
      <span className="text-[10px] text-slate-400">{detail}</span>
    </div>
  );
}

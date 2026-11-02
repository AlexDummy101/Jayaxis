import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Star,
  CheckCircle2,
  ShieldCheck,
  Truck,
  Wrench,
  FileText,
  MessageCircle
} from "lucide-react";
import { price, getProductById, getProducts } from "@/lib/products";
import { AddToCart } from "@/components/ShopActions";
import { ProductCard } from "@/components/ProductCard";

export async function generateStaticParams() {
  const all = await getProducts();
  return all.map(p => ({ id: p.id }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const p = await getProductById(id);
  if (!p) return { title: "Product Not Found" };
  return {
    title: `${p.name} | Jayaxis Company Ltd`,
    description: p.description
  };
}

export default async function ProductDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) notFound();

  const allProducts = await getProducts();
  const relatedProducts = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="py-12 space-y-16">
      <div className="wrap space-y-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-400">
          <Link href="/" className="hover:text-slate-700 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-slate-700 transition-colors">
            Catalogue
          </Link>
          <span>/</span>
          <Link
            href={`/shop?category=${encodeURIComponent(product.category)}`}
            className="hover:text-slate-700 transition-colors"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-bold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Media Column */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-md">
              <Image
                src={product.src || product.image || "/steel.jpeg"}
                alt={product.name}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <span className="bg-sky-500 text-white text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-md shadow-sm">
                  {product.category}
                </span>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded shadow-sm ${
                  product.stock === "Coming soon"
                    ? "bg-purple-600 text-white"
                    : product.stock === "In stock"
                    ? "bg-emerald-600 text-white"
                    : product.stock === "Limited stock"
                    ? "bg-amber-600 text-white"
                    : "bg-slate-700 text-white"
                }`}>
                  {product.stock}
                </span>
              </div>
            </div>

            {/* Quality & Trust Badges */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl">
                <ShieldCheck size={18} className="text-sky-500 mx-auto mb-1" />
                <span className="text-[11px] font-bold text-slate-800 block">Warranty Backed</span>
                <span className="text-[10px] text-slate-400">Official Guarantee</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl">
                <Truck size={18} className="text-sky-500 mx-auto mb-1" />
                <span className="text-[11px] font-bold text-slate-800 block">Kenya Delivery</span>
                <span className="text-[10px] text-slate-400">All 47 Counties</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl">
                <Wrench size={18} className="text-sky-500 mx-auto mb-1" />
                <span className="text-[11px] font-bold text-slate-800 block">Technical Support</span>
                <span className="text-[10px] text-slate-400">Engineering Setup</span>
              </div>
            </div>
          </div>

          {/* Right Info Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} fill="currentColor" />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-600">
                  {product.rating} ({product.reviewsCount} customer reviews)
                </span>
                <span className="text-xs font-mono text-slate-400 ml-auto">
                  SKU: {product.sku}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug">
                {product.name}
              </h1>

              <p className="text-sm font-semibold text-sky-600">
                {product.tagline}
              </p>
            </div>

            {/* Price Box */}
            {product.stock === "Coming soon" ? (
              <div className="p-5 rounded-2xl bg-purple-50 border border-purple-200 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] text-purple-700 font-bold block uppercase tracking-wider">
                    Stock Status
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-purple-900">
                    Coming Soon
                  </div>
                  <p className="text-xs text-purple-700/80 mt-1">
                    This item is arriving soon. Pricing will be published upon official release.
                  </p>
                </div>
                <span className="text-xs text-purple-800 bg-white px-3 py-1 rounded-full font-bold border border-purple-200">
                  Pre-Release
                </span>
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-sky-50/60 border border-sky-100 flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <span className="text-[11px] text-slate-500 font-semibold block uppercase tracking-wider">
                    {product.price ? "Published Unit Estimate" : "Custom Project Sizing"}
                  </span>
                  <div className="text-3xl font-black text-slate-900 text-sky-700">
                    {price(product.price)}
                  </div>
                </div>
                <span className="text-xs text-sky-700 bg-white px-3 py-1 rounded-full font-bold border border-sky-200">
                  VAT Inclusive Estimate
                </span>
              </div>
            )}

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {product.description}
            </p>

            {/* Key Features */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                Product Advantages
              </h4>
              <ul className="space-y-2 text-xs text-slate-600">
                {product.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-sky-500 mt-0.5 flex-shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Add to Cart / Inquire Component */}
            {product.stock === "Coming soon" ? (
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={`https://wa.me/254710747090?text=${encodeURIComponent(`Hello Jayaxis Company Ltd, I am inquiring about the upcoming product *${product.name}* (${product.sku}). Please notify me when available.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm py-3.5 px-6 rounded-xl transition-all shadow-md shadow-emerald-600/20"
                  >
                    <MessageCircle size={17} /> Inquire Availability via WhatsApp
                  </a>
                  <Link
                    href={`/quote?items=${encodeURIComponent(`${product.name} (${product.sku}) - Coming Soon`)}`}
                    className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3.5 px-6 rounded-xl transition-colors"
                  >
                    <FileText size={16} /> Pre-Order Inquiry
                  </Link>
                </div>
              </div>
            ) : (
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <AddToCart id={product.id} productName={product.name} product={product} />

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Link
                    href={`/quote?items=${encodeURIComponent(`${product.name} (${product.sku})`)}`}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 px-4 rounded-xl transition-colors"
                  >
                    <FileText size={15} /> Request Formal Quotation for this Item
                  </Link>

                  <a
                    href={`https://wa.me/254710747090?text=Hello%20Jayaxis,%20I%20would%20like%20to%20inquire%20about%20the%20${encodeURIComponent(product.name)}%20(${product.sku}).`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs py-3 px-4 rounded-xl transition-colors"
                  >
                    <MessageCircle size={15} /> Inquire on WhatsApp
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Technical Specifications Table */}
        <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-4">
          <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">
            Technical Specifications & Operating Parameters
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-xs">
            {Object.entries(product.specifications).map(([key, val]) => (
              <div
                key={key}
                className="flex items-center justify-between py-2 border-b border-slate-100/80"
              >
                <span className="text-slate-500 font-medium">{key}</span>
                <span className="text-slate-900 font-bold">{val}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Related Products Carousel / Grid */}
        {relatedProducts.length > 0 && (
          <section className="space-y-6 pt-8 border-t border-slate-200/60">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-sky-600 block">
                  Complementary Supplies
                </span>
                <h3 className="text-xl font-black text-slate-900">
                  Related Equipment in {product.category}
                </h3>
              </div>
              <Link
                href={`/shop?category=${encodeURIComponent(product.category)}`}
                className="text-xs font-bold text-sky-600 hover:text-sky-800"
              >
                View Category →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(rel => (
                <ProductCard key={rel.id} p={rel} compact />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

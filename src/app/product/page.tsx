import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductLookup } from "./ProductLookup";

export const metadata: Metadata = {
  title: "Product Details | Jayaxis Company Ltd",
  description: "Product details from Jayaxis Company Ltd's equipment catalogue."
};

export default function ProductPage() {
  return (
    <Suspense
      fallback={
        <div className="wrap py-16 text-center text-sm font-semibold text-slate-500">
          Loading product...
        </div>
      }
    >
      <ProductLookup />
    </Suspense>
  );
}

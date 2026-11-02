"use client";

import { useMemo, useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, X, RefreshCw } from "lucide-react";
import { products as defaultProducts, categories, getProducts, Product } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

interface ShopBrowserProps {
  initialCategory?: string;
  initialProducts?: Product[];
}

function ShopBrowserContent({ initialCategory = "All", initialProducts }: ShopBrowserProps) {
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get("category") || initialCategory;
  const [productList, setProductList] = useState<Product[]>(initialProducts || defaultProducts);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(urlCategory);
  const [stockFilter, setStockFilter] = useState("All");
  const [sort, setSort] = useState("featured");

  useEffect(() => {
    async function load() {
      try {
        const liveProducts = await getProducts();
        if (liveProducts) {
          setProductList(liveProducts);
        }
      } catch (err) {
        console.warn("Could not load dynamic products, using current list:", err);
      }
    }
    load();
  }, []);

  const filteredProducts = useMemo(() => {
    return productList
      .filter(p => {
        const matchesCategory = category === "All" || p.category === category;
        const matchesSearch =
          search.trim() === "" ||
          `${p.name} ${p.description} ${p.category} ${p.sku}`.toLowerCase().includes(search.toLowerCase());
        const matchesStock = stockFilter === "All" || p.stock === stockFilter;
        return matchesCategory && matchesSearch && matchesStock;
      })
      .sort((a, b) => {
        if (sort === "price-low") return (a.price || 0) - (b.price || 0);
        if (sort === "price-high") return (b.price || 0) - (a.price || 0);
        if (sort === "name") return a.name.localeCompare(b.name);
        return Number(b.featured) - Number(a.featured);
      });
  }, [search, category, stockFilter, sort, productList]);

  const resetFilters = () => {
    setSearch("");
    setCategory("All");
    setStockFilter("All");
    setSort("featured");
  };

  const hasActiveFilters = search !== "" || category !== "All" || stockFilter !== "All" || sort !== "featured";

  return (
    <div className="space-y-6">
      {/* Search Bar & Sort Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search pumps, solar equipment, tanks, pipes, accessories, PPE..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition-all"
            aria-label="Search product catalogue"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              aria-label="Clear search query"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filters & Sorting Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Stock filter */}
          <select
            value={stockFilter}
            onChange={e => setStockFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold py-2.5 px-3 rounded-xl focus:outline-none focus:border-sky-500 cursor-pointer"
            aria-label="Filter by stock availability"
          >
            <option value="All">All Availability</option>
            <option value="In stock">In Stock Only</option>
            <option value="Limited stock">Limited Stock</option>
            <option value="Available on order">Fabricated on Order</option>
            <option value="Coming soon">Coming Soon</option>
          </select>

          {/* Sort By */}
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold py-2.5 px-3 rounded-xl focus:outline-none focus:border-sky-500 cursor-pointer"
            aria-label="Sort product listings"
          >
            <option value="featured">Featured First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 text-xs text-sky-600 hover:text-sky-800 font-bold px-3 py-2 rounded-xl hover:bg-sky-50 transition-colors"
              title="Reset all search filters"
            >
              <RefreshCw size={13} /> Reset
            </button>
          )}
        </div>
      </div>

      {/* Horizontal Category Badges (Pills) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map(cat => {
          const isSelected = category === cat;
          const count = cat === "All" ? productList.length : productList.filter((p: Product) => p.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`whitespace-nowrap inline-flex items-center gap-2 text-xs font-extrabold px-3.5 py-2 rounded-xl transition-all flex-shrink-0 ${
                isSelected
                  ? "bg-sky-500 text-white shadow-md shadow-sky-500/25 scale-[1.02]"
                  : "bg-white border border-slate-200/80 text-slate-600 hover:border-sky-300 hover:bg-sky-50/50"
              }`}
            >
              <span>{cat}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected ? "bg-white/25 text-white" : "bg-slate-100 text-slate-500"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Results Header Count */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Showing <strong className="text-slate-900 font-bold">{filteredProducts.length}</strong> verified products
          {category !== "All" && <span> in <strong className="text-sky-600 font-bold">{category}</strong></span>}
        </span>
        {hasActiveFilters && (
          <span className="text-[11px] text-slate-400">
            Active filters applied
          </span>
        )}
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(p => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center max-w-md mx-auto my-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Search size={28} />
          </div>
          <h3 className="text-base font-bold text-slate-800">No matching products found</h3>
          <p className="text-xs text-slate-500">
            We couldn&apos;t find any products matching &ldquo;{search}&rdquo; in the selected category.
          </p>
          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-sky-500/20"
          >
            Clear Filters & View All
          </button>
        </div>
      )}
    </div>
  );
}

export function ShopBrowser(props: ShopBrowserProps) {
  return (
    <Suspense fallback={<div className="py-12 text-center text-sm text-slate-400">Loading catalog...</div>}>
      <ShopBrowserContent {...props} />
    </Suspense>
  );
}


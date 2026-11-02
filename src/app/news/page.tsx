"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { defaultNews, getNewsArticles, NewsArticle, newsCategories } from "@/lib/news";
import {
  Calendar,
  Clock,
  User,
  ArrowRight,
  Search,
  Tag,
  X,
  FileText,
  Sparkles,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>(defaultNews);
  const [activeCategory, setActiveCategory] = useState<string>("All Articles");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getNewsArticles();
        setArticles(data);
      } catch (err) {
        console.warn("Could not load news, using defaults:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Filter articles based on active category & search query
  const filteredArticles = articles.filter(item => {
    const matchesCategory =
      activeCategory === "All Articles" || item.category === activeCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredArticle = articles.find(a => a.featured) || articles[0];

  return (
    <div className="py-16 space-y-16">
      {/* Page Header */}
      <section className="wrap text-center max-w-3xl mx-auto space-y-4">
        <div className="flex items-center justify-center gap-2">
          <span className="text-xs font-black uppercase tracking-widest text-sky-600 bg-sky-50 px-3.5 py-1.5 rounded-full inline-block border border-sky-100">
            News & Engineering Insights
          </span>
          <Link
            href=""
            className="text-[11px] font-bold text-slate-500 hover:text-sky-600 bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-full transition-colors inline-flex items-center gap-1"
            title="Publish or update articles"
          >
           <ExternalLink size={11} />
          </Link>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Updates, Engineering & Water Sector News
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Stay informed on Kenyan borehole regulations (WRA & NEMA), solar water pumping breakthroughs, sectional steel tower engineering, and project milestones across Kenya.
        </p>

        {/* Search Bar */}
        <div className="pt-2 max-w-md mx-auto">
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search news, topics (e.g. WRA, solar, permits)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-sky-500 bg-white shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pt-2 pb-2 scrollbar-none">
          {newsCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-xs font-extrabold px-4 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === cat
                  ? "bg-sky-500 text-white shadow-md shadow-sky-500/20"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-sky-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Featured Article Banner (Only on "All Articles" with no search query) */}
      {activeCategory === "All Articles" && !searchQuery && featuredArticle && (
        <section className="wrap">
          <div
            onClick={() => setSelectedArticle(featuredArticle)}
            className="group cursor-pointer bg-gradient-to-br from-slate-900 via-[#002766] to-slate-900 text-white rounded-3xl overflow-hidden shadow-2xl border border-slate-800 grid grid-cols-1 lg:grid-cols-12 transition-all hover:border-sky-400/50"
          >
            <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 bg-sky-500/20 text-sky-300 border border-sky-400/30 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                    <Sparkles size={12} className="text-sky-400" />
                    Featured Story
                  </span>
                  <span className="text-xs text-sky-200 font-medium">
                    {featuredArticle.category}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white group-hover:text-sky-300 transition-colors tracking-tight leading-tight">
                  {featuredArticle.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3">
                  {featuredArticle.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                    <User size={13} className="text-sky-400" /> {featuredArticle.author}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1.5">
                    <Calendar size={13} /> {featuredArticle.date}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={13} /> {featuredArticle.readTime}
                  </span>
                </div>

                <span className="inline-flex items-center gap-1 text-sky-300 font-bold group-hover:translate-x-1 transition-transform">
                  Read Full Story <ArrowRight size={14} />
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 relative aspect-[16/10] lg:aspect-auto min-h-[260px] bg-slate-800 overflow-hidden">
              <Image
                src={featuredArticle.src || "/steel.jpeg"}
                alt={featuredArticle.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent lg:hidden" />
            </div>
          </div>
        </section>
      )}

      {/* Articles Grid */}
      <section className="wrap space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
          <h3 className="text-lg font-black text-slate-900">
            {activeCategory} ({filteredArticles.length})
          </h3>
          <span className="text-xs text-slate-400">
            {loading ? "Refreshing news..." : "Verified Engineering Publications"}
          </span>
        </div>

        {filteredArticles.length === 0 ? (
          <div className="text-center py-16 bg-white border border-slate-200 rounded-3xl p-8 space-y-3">
            <FileText size={36} className="text-slate-300 mx-auto" />
            <h4 className="text-base font-bold text-slate-800">No articles match your search</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search keywords or select &quot;All Articles&quot; to see all published updates.
            </p>
            <button
              onClick={() => {
                setActiveCategory("All Articles");
                setSearchQuery("");
              }}
              className="mt-2 text-xs font-bold text-sky-600 hover:text-sky-800"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map(article => (
              <motion.article
                key={article.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 hover:border-sky-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div
                    className="relative aspect-[16/10] bg-slate-100 overflow-hidden cursor-pointer"
                    onClick={() => setSelectedArticle(article)}
                  >
                    <Image
                      src={article.src || "/steel.jpeg"}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                    <span className="absolute bottom-3 left-3 bg-sky-500 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-md shadow-sm">
                      {article.category}
                    </span>
                    <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
                      <Clock size={11} className="text-sky-600" /> {article.readTime}
                    </span>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <Calendar size={12} />
                      <span>{article.date}</span>
                      <span>·</span>
                      <span className="truncate">{article.author}</span>
                    </div>

                    <h3
                      onClick={() => setSelectedArticle(article)}
                      className="text-base font-extrabold text-slate-900 group-hover:text-sky-600 transition-colors cursor-pointer leading-snug line-clamp-2"
                    >
                      {article.title}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                      {article.summary}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-slate-100 mt-4 flex items-center justify-between text-xs">
                  <button
                    onClick={() => setSelectedArticle(article)}
                    className="font-bold text-sky-600 hover:text-sky-800 inline-flex items-center gap-1 cursor-pointer pt-3"
                  >
                    Read Article <ChevronRight size={14} />
                  </button>

                  <span className="text-[11px] text-slate-400 pt-3">
                    {article.tags[0] ? `#${article.tags[0]}` : ""}
                  </span>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </section>

      {/* Interactive Article Reading Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedArticle(null)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
              aria-label="Close article modal"
            />

            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="relative bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-10 shadow-2xl overflow-hidden space-y-6 z-10 max-h-[90vh] overflow-y-auto"
              >
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="absolute right-5 top-5 w-9 h-9 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer z-10"
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>

                {/* Article Header */}
                <div className="space-y-3 pt-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-sky-500 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-md">
                      {selectedArticle.category}
                    </span>
                    <span className="text-xs text-slate-400">
                      Published {selectedArticle.date}
                    </span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs text-slate-400">
                      {selectedArticle.readTime}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                    {selectedArticle.title}
                  </h2>

                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <User size={14} className="text-sky-600" />
                    <span>By <strong>{selectedArticle.author}</strong></span>
                  </div>
                </div>

                {/* Article Cover Image */}
                <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-slate-100 shadow-md">
                  <Image
                    src={selectedArticle.src || "/steel.jpeg"}
                    alt={selectedArticle.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Article Full Content */}
                <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line border-b border-slate-100 pb-6">
                  {selectedArticle.content}
                </div>

                {/* Tags & Action */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Tag size={13} className="text-slate-400" />
                    {selectedArticle.tags.map((t, i) => (
                      <span
                        key={i}
                        className="bg-slate-100 text-slate-700 text-[10px] font-semibold px-2.5 py-1 rounded-md"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <Link
                      href={`/quote?service=${encodeURIComponent(selectedArticle.title)}`}
                      className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all"
                    >
                      Inquire on this Topic <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Bottom CTA Banner */}
      <section className="wrap">
        <div className="bg-gradient-to-r from-[#002766] to-[#0284c7] text-white rounded-3xl p-8 sm:p-12 text-center max-w-3xl mx-auto space-y-4 shadow-xl">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-200 bg-white/10 px-3 py-1 rounded-full">
            Engineering Inquiry
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Have a Water or Infrastructure Question?
          </h2>
          <p className="text-xs sm:text-sm text-sky-100 max-w-md mx-auto leading-relaxed">
            Our team assists with hydrogeological surveys, WRA permit applications, steel tower calculations, and solar pump sizing nationwide.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/quote"
              className="inline-flex items-center gap-2 bg-white text-slate-900 hover:bg-sky-50 font-extrabold text-xs px-6 py-3 rounded-xl shadow-md transition-all"
            >
              Request a Quotation <ArrowRight size={14} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-sky-950/60 hover:bg-sky-950 text-white font-bold text-xs px-6 py-3 rounded-xl border border-white/20 transition-all"
            >
              Contact Our Desk
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

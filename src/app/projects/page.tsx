"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { projects as defaultProjects, projectCategories, Project, getProjects } from "@/lib/projects";
import { ArrowRight, MapPin, Calendar, CheckCircle2, Wrench, X, ArrowUpRight, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProjectsPage() {
  const [projectList, setProjectList] = useState<Project[]>(defaultProjects);
  const [activeCategory, setActiveCategory] = useState<string>("All Projects");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const liveProjects = await getProjects();
        if (liveProjects && liveProjects.length > 0) {
          setProjectList(liveProjects);
        }
      } catch (err) {
        console.warn("Could not load dynamic projects, using defaults:", err);
      }
    }
    load();
  }, []);

  const filteredProjects = projectList.filter(
    p => activeCategory === "All Projects" || p.category === activeCategory
  );

  return (
    <div className="py-16 space-y-14">
      {/* Page Header */}
      <section className="wrap text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-black uppercase tracking-widest text-sky-600 bg-sky-50 px-3.5 py-1.5 rounded-full inline-block">
          Portfolio & Case Studies
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Proven Engineering Across Kenya
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Explore our completed water infrastructure projects, commercial solar pumping schemes, elevated steel tank towers, and civil water treatment systems.
        </p>

        {/* Category Filters */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pt-4 pb-2 scrollbar-none">
          {projectCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-xs font-extrabold px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeCategory === cat
                  ? "bg-sky-500 text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-sky-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Projects Grid */}
      <section className="wrap">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map(proj => (
            <motion.article
              key={proj.id}
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 hover:border-sky-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden cursor-pointer" onClick={() => setSelectedProject(proj)}>
                <Image
                  src={proj.src || proj.image || "/steel.jpeg"}
                  alt={proj.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 bg-sky-500 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-md shadow-sm">
                  {proj.category}
                </span>
                <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
                  <MapPin size={11} className="text-sky-600" /> {proj.county} County
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-1.5">
                    <Calendar size={12} />
                    <span>Completed {proj.year}</span>
                    <span>·</span>
                    <span className="truncate">{proj.location}</span>
                  </div>

                  <h3
                    className="text-base font-extrabold text-slate-900 group-hover:text-sky-600 transition-colors cursor-pointer"
                    onClick={() => setSelectedProject(proj)}
                  >
                    {proj.title}
                  </h3>

                  <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                    {proj.scope}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedProject(proj)}
                    className="text-xs font-bold text-sky-600 hover:text-sky-800 inline-flex items-center gap-1"
                  >
                    Full Case Study <ArrowUpRight size={14} />
                  </button>

                  <Link
                    href={`/quote?service=${encodeURIComponent(proj.title)}`}
                    className="text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Quote Similar
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="relative bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl overflow-hidden space-y-6 z-10"
              >
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute right-4 top-4 w-9 h-9 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center"
                  aria-label="Close project modal"
                >
                  <X size={18} />
                </button>

                <div className="relative h-60 rounded-2xl overflow-hidden bg-slate-100">
                  <Image
                    src={selectedProject.src || selectedProject.image || "/steel.jpeg"}
                    alt={selectedProject.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-4 left-4 bg-sky-500 text-white text-xs font-black uppercase px-3 py-1 rounded-md">
                    {selectedProject.category}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-semibold text-sky-600">
                      <MapPin size={13} /> {selectedProject.location}
                    </span>
                    <span>·</span>
                    <span>Commissioned {selectedProject.year}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    {selectedProject.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {selectedProject.scope}
                  </p>
                </div>

                {/* Scope Deliverables */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2">
                  <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider block">
                    Execution Deliverables
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {selectedProject.deliverables.map((del, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 size={14} className="text-sky-500 mt-0.5 flex-shrink-0" />
                        <span>{del}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Equipment Installed */}
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider block">
                    Equipment Installed & Commissioned
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.equipment.map((eq, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 bg-sky-50 text-sky-800 text-xs font-bold px-3 py-1.5 rounded-lg border border-sky-100"
                      >
                        <Wrench size={12} className="text-sky-500" /> {eq}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Modal CTA Footer */}
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <span className="text-xs text-slate-500">
                    Have a project requiring similar engineering?
                  </span>
                  <Link
                    href={`/quote?service=${encodeURIComponent(selectedProject.title)}`}
                    onClick={() => setSelectedProject(null)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md"
                  >
                    Request Project Quotation <ArrowRight size={14} />
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

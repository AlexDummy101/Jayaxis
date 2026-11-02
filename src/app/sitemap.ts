import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://jayaxis.co.ke";
  return ["", "/shop", "/services", "/about", "/projects", "/news", "/contact", "/quote", "/privacy"].map(path => ({
    url: base + path,
    lastModified: new Date()
  }));
}

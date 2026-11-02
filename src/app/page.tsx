import { getProducts } from "@/lib/products";
import { getProjects } from "@/lib/projects";
import { HomeClient } from "@/components/HomeClient";

export default async function Home() {
  const [initialProducts, initialProjects] = await Promise.all([
    getProducts(),
    getProjects()
  ]);

  return <HomeClient initialProducts={initialProducts} initialProjects={initialProjects} />;
}

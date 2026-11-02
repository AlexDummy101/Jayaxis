"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import {
  products as defaultProducts,
  categories as productCategories,
  Product,
  getProducts,
  saveProduct,
  deleteProduct,
  formatKES
} from "@/lib/products";
import {
  projects as defaultProjects,
  projectCategories,
  Project,
  getProjects,
  saveProject,
  deleteProject
} from "@/lib/projects";
import {
  defaultNews,
  getNewsArticles,
  NewsArticle,
  newsCategories,
  saveNewsArticle,
  deleteNewsArticle
} from "@/lib/news";
import {
  collection,
  getDocs,
  query,
  orderBy
} from "firebase/firestore";
import {
  getOrders,
  updateOrderStatus,
  deleteOrder,
  OrderDoc,
  getCustomerUsers,
  deleteCustomerUser,
  CustomerUser
} from "@/lib/orders";
import {
  Database,
  Key,
  Users,
  FileText,
  Trash2,
  Edit3,
  Sparkles,
  RefreshCw,
  Eye,
  Check,
  Package,
  Layers,
  MapPin,
  Search,
  ShoppingCart,
  UserCheck,
  Phone,
  Mail,
  Clock,
  MessageSquare
} from "lucide-react";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"products" | "projects" | "news" | "quotes" | "orders" | "users" | "config">("products");
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);

  // ==========================================
  // PRODUCTS STATE
  // ==========================================
  const [productList, setProductList] = useState<Product[]>(defaultProducts);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productSearch, setProductSearch] = useState("");
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: "",
    sku: "",
    category: "Water Pumps",
    price: 45000,
    priceOnRequest: false,
    stock: "In stock",
    rating: 5.0,
    reviewsCount: 15,
    src: "/steel.jpeg",
    tagline: "",
    description: "",
    featured: false
  });
  const [specsInput, setSpecsInput] = useState("Motor Rating: 2.2 kW, Max Head: 180m");
  const [featuresInput, setFeaturesInput] = useState("Stainless steel AISI 304, Integrated check valve");

  // ==========================================
  // PROJECTS STATE
  // ==========================================
  const [projectList, setProjectList] = useState<Project[]>(defaultProjects);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectSearch, setProjectSearch] = useState("");
  const [projectForm, setProjectForm] = useState<Partial<Project>>({
    title: "",
    category: "Borehole Services",
    location: "Nairobi",
    county: "Nairobi",
    year: "2025",
    scope: "",
    src: "/steel.jpeg",
    featured: false
  });
  const [deliverablesInput, setDeliverablesInput] = useState("Geological strata sampling, Casing installation, 24hr test pumping");
  const [equipmentInput, setEquipmentInput] = useState("Stainless 4SP Pump, Heavy Column Tower, HDPE PN16 Pipe");

  // ==========================================
  // NEWS STATE
  // ==========================================
  const [articles, setArticles] = useState<NewsArticle[]>(defaultNews);
  const [loadingNews, setLoadingNews] = useState(false);
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const [articleForm, setArticleForm] = useState<Partial<NewsArticle>>({
    title: "",
    category: "Regulations & Compliance",
    summary: "",
    content: "",
    author: "Jay Axis Engineering Desk",
    src: "/jay-e.jpeg",
    readTime: "4 min read",
    tags: ["Borehole", "Engineering"],
    featured: false
  });
  const [newsTagsInput, setNewsTagsInput] = useState("Borehole, Engineering");

  // ==========================================
  // QUOTES STATE
  // ==========================================
  interface QuoteDoc {
    id: string;
    customer_name?: string;
    phone?: string;
    email?: string;
    item_requested?: string;
    county?: string;
    town?: string;
    scope?: string;
    status?: string;
    created_at?: { toDate?: () => Date };
  }
  const [quotes, setQuotes] = useState<QuoteDoc[]>([]);
  const [loadingQuotes, setLoadingQuotes] = useState(false);

  // ==========================================
  // ORDERS STATE
  // ==========================================
  const [orders, setOrders] = useState<OrderDoc[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");

  // ==========================================
  // CUSTOMERS / USERS STATE
  // ==========================================
  const [customers, setCustomers] = useState<CustomerUser[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [customerSearch, setCustomerSearch] = useState("");

  // ==========================================
  // LOAD DATA HANDLERS
  // ==========================================
  async function refreshProducts() {
    setLoadingProducts(true);
    try {
      const data = await getProducts();
      setProductList(data);
    } catch {
      setProductList(defaultProducts);
    } finally {
      setLoadingProducts(false);
    }
  }

  async function refreshProjects() {
    setLoadingProjects(true);
    try {
      const data = await getProjects();
      setProjectList(data);
    } catch {
      setProjectList(defaultProjects);
    } finally {
      setLoadingProjects(false);
    }
  }

  async function refreshNews() {
    setLoadingNews(true);
    try {
      const data = await getNewsArticles();
      setArticles(data);
    } catch {
      setArticles(defaultNews);
    } finally {
      setLoadingNews(false);
    }
  }

  async function refreshQuotes() {
    if (!isFirebaseConfigured || !db) return;
    setLoadingQuotes(true);
    try {
      const q = query(collection(db, "quotation_requests"), orderBy("created_at", "desc"));
      const snap = await getDocs(q);
      const list: QuoteDoc[] = [];
      snap.forEach(d => {
        list.push({ id: d.id, ...d.data() });
      });
      setQuotes(list);
    } catch (err) {
      console.warn("Could not load quotes from Firestore:", err);
    } finally {
      setLoadingQuotes(false);
    }
  }

  async function refreshOrders() {
    setLoadingOrders(true);
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (err) {
      console.warn("Could not load orders from Firestore:", err);
    } finally {
      setLoadingOrders(false);
    }
  }

  async function refreshCustomers() {
    setLoadingCustomers(true);
    try {
      const data = await getCustomerUsers();
      setCustomers(data);
    } catch (err) {
      console.warn("Could not load customer users:", err);
    } finally {
      setLoadingCustomers(false);
    }
  }

  async function handleUpdateOrderStatus(orderId: string, newStatus: OrderDoc["status"]) {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o)));
      setStatusMsg({ text: `Order status updated to "${newStatus}".`, type: "success" });
    } catch (err: unknown) {
      console.error(err);
      setStatusMsg({ text: "Failed to update order status.", type: "error" });
    }
  }

  async function handleDeleteOrder(orderId: string, orderRef: string) {
    if (!window.confirm(`Are you sure you want to delete order "${orderRef}"?`)) return;
    try {
      await deleteOrder(orderId);
      setOrders(prev => prev.filter(o => o.id !== orderId));
      setStatusMsg({ text: `Order ${orderRef} was deleted successfully.`, type: "success" });
    } catch {
      setStatusMsg({ text: `Failed to delete order ${orderRef}.`, type: "error" });
    }
  }

  async function handleDeleteCustomer(userId: string, name: string) {
    if (!window.confirm(`Are you sure you want to delete customer account for "${name}"?`)) return;
    try {
      await deleteCustomerUser(userId);
      setCustomers(prev => prev.filter(c => c.id !== userId));
      setStatusMsg({ text: `Customer account for "${name}" deleted.`, type: "success" });
    } catch {
      setStatusMsg({ text: "Failed to delete customer account.", type: "error" });
    }
  }

  useEffect(() => {
    refreshProducts();
    refreshProjects();
    refreshNews();
    refreshOrders();
    refreshCustomers();
    if (isFirebaseConfigured) {
      refreshQuotes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ==========================================
  // PRODUCT ACTION HANDLERS
  // ==========================================
  function handleEditProduct(product: Product) {
    setEditingProductId(product.id);
    setProductForm(product);

    // Convert specs object to string
    const specsStr = Object.entries(product.specifications || {})
      .map(([k, v]) => `${k}: ${v}`)
      .join(", ");
    setSpecsInput(specsStr);

    // Convert features array to string
    setFeaturesInput((product.features || []).join(", "));
    window.scrollTo({ top: 250, behavior: "smooth" });
  }

  function handleCancelProductEdit() {
    setEditingProductId(null);
    setProductForm({
      name: "",
      sku: "",
      category: "Water Pumps",
      price: 45000,
      priceOnRequest: false,
      stock: "In stock",
      rating: 5.0,
      reviewsCount: 15,
      src: "/steel.jpeg",
      tagline: "",
      description: "",
      featured: false
    });
    setSpecsInput("Motor Rating: 2.2 kW, Max Head: 180m");
    setFeaturesInput("Stainless steel AISI 304, Integrated check valve");
  }

  async function handleSaveProduct(e: React.FormEvent) {
    e.preventDefault();
    setStatusMsg(null);

    if (!productForm.name || !productForm.sku || !productForm.description) {
      setStatusMsg({ text: "Please fill in the product name, SKU, and description.", type: "error" });
      return;
    }

    // Parse specifications from string to object
    const specsObj: Record<string, string> = {};
    specsInput.split(",").forEach(part => {
      const [key, ...val] = part.split(":");
      if (key && val.length > 0) {
        specsObj[key.trim()] = val.join(":").trim();
      }
    });

    // Parse features from string to array
    const featuresArr = featuresInput
      .split(",")
      .map(f => f.trim())
      .filter(Boolean);

    const generatedId =
      editingProductId ||
      productForm.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

    const newProduct: Product = {
      id: generatedId,
      sku: productForm.sku || `JAX-${Date.now()}`,
      name: productForm.name!,
      category: productForm.category || "Water Pumps",
      tagline: productForm.tagline || "",
      description: productForm.description!,
      price: Number(productForm.price) || 0,
      priceOnRequest: Boolean(productForm.priceOnRequest),
      stock: (productForm.stock as Product["stock"]) || "In stock",
      rating: Number(productForm.rating) || 5.0,
      reviewsCount: Number(productForm.reviewsCount) || 12,
      src: productForm.src || "/steel.jpeg",
      image: productForm.src || "/steel.jpeg",
      featured: Boolean(productForm.featured),
      specifications: Object.keys(specsObj).length > 0 ? specsObj : { Standard: "Factory Certified" },
      features: featuresArr.length > 0 ? featuresArr : ["Factory Warranted"]
    };

    try {
      if (isFirebaseConfigured && db) {
        await saveProduct(newProduct);
        setStatusMsg({ text: `Product "${newProduct.name}" saved to Cloud Firestore!`, type: "success" });
      } else {
        setProductList(prev => {
          const idx = prev.findIndex(p => p.id === newProduct.id);
          if (idx >= 0) {
            const updated = [...prev];
            updated[idx] = newProduct;
            return updated;
          }
          return [newProduct, ...prev];
        });
        setStatusMsg({ text: `Product updated locally! Add Firebase keys in .env.local to persist permanently.`, type: "info" });
      }

      handleCancelProductEdit();
      refreshProducts();
    } catch (err: unknown) {
      setStatusMsg({ text: (err as Error)?.message || "Failed to save product.", type: "error" });
    }
  }

  async function handleDeleteProduct(productId: string) {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      if (isFirebaseConfigured && db) {
        await deleteProduct(productId);
        setStatusMsg({ text: "Product deleted from Cloud Firestore.", type: "success" });
      } else {
        setProductList(prev => prev.filter(p => p.id !== productId));
        setStatusMsg({ text: "Product removed locally.", type: "info" });
      }
      refreshProducts();
    } catch (err: unknown) {
      setStatusMsg({ text: (err as Error)?.message || "Failed to delete product.", type: "error" });
    }
  }

  async function handleSeedDefaultProducts() {
    if (!isFirebaseConfigured || !db) {
      alert("Firebase is not configured in .env.local yet.");
      return;
    }

    try {
      setLoadingProducts(true);
      for (const prod of defaultProducts) {
        await saveProduct(prod);
      }
      setStatusMsg({ text: "All 12 default products seeded to Cloud Firestore successfully!", type: "success" });
      refreshProducts();
    } catch (err: unknown) {
      setStatusMsg({ text: (err as Error)?.message || "Failed to seed default products.", type: "error" });
    } finally {
      setLoadingProducts(false);
    }
  }

  // ==========================================
  // PROJECT ACTION HANDLERS
  // ==========================================
  function handleEditProject(project: Project) {
    setEditingProjectId(project.id);
    setProjectForm(project);
    setDeliverablesInput((project.deliverables || []).join(", "));
    setEquipmentInput((project.equipment || []).join(", "));
    window.scrollTo({ top: 250, behavior: "smooth" });
  }

  function handleCancelProjectEdit() {
    setEditingProjectId(null);
    setProjectForm({
      title: "",
      category: "Borehole Services",
      location: "Nairobi",
      county: "Nairobi",
      year: "2025",
      scope: "",
      src: "/steel.jpeg",
      featured: false
    });
    setDeliverablesInput("Geological strata sampling, Casing installation, 24hr test pumping");
    setEquipmentInput("Stainless 4SP Pump, Heavy Column Tower, HDPE PN16 Pipe");
  }

  async function handleSaveProject(e: React.FormEvent) {
    e.preventDefault();
    setStatusMsg(null);

    if (!projectForm.title || !projectForm.location || !projectForm.scope) {
      setStatusMsg({ text: "Please fill in project title, location, and scope.", type: "error" });
      return;
    }

    const deliverablesArr = deliverablesInput
      .split(",")
      .map(d => d.trim())
      .filter(Boolean);

    const equipmentArr = equipmentInput
      .split(",")
      .map(eq => eq.trim())
      .filter(Boolean);

    const generatedId =
      editingProjectId ||
      projectForm.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

    const newProject: Project = {
      id: generatedId,
      title: projectForm.title!,
      category: (projectForm.category as Project["category"]) || "Borehole Services",
      location: projectForm.location!,
      county: projectForm.county || "Nairobi",
      year: projectForm.year || "2025",
      scope: projectForm.scope!,
      deliverables: deliverablesArr.length > 0 ? deliverablesArr : ["Site completion"],
      equipment: equipmentArr.length > 0 ? equipmentArr : ["Certified equipment"],
      src: projectForm.src || "/steel.jpeg",
      image: projectForm.src || "/steel.jpeg",
      featured: Boolean(projectForm.featured)
    };

    try {
      if (isFirebaseConfigured && db) {
        await saveProject(newProject);
        setStatusMsg({ text: `Project "${newProject.title}" saved to Cloud Firestore!`, type: "success" });
      } else {
        setProjectList(prev => {
          const idx = prev.findIndex(p => p.id === newProject.id);
          if (idx >= 0) {
            const updated = [...prev];
            updated[idx] = newProject;
            return updated;
          }
          return [newProject, ...prev];
        });
        setStatusMsg({ text: `Project updated locally! Add Firebase keys in .env.local to persist permanently.`, type: "info" });
      }

      handleCancelProjectEdit();
      refreshProjects();
    } catch (err: unknown) {
      setStatusMsg({ text: (err as Error)?.message || "Failed to save project.", type: "error" });
    }
  }

  async function handleDeleteProject(projectId: string) {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      if (isFirebaseConfigured && db) {
        await deleteProject(projectId);
        setStatusMsg({ text: "Project deleted from Cloud Firestore.", type: "success" });
      } else {
        setProjectList(prev => prev.filter(p => p.id !== projectId));
        setStatusMsg({ text: "Project removed locally.", type: "info" });
      }
      refreshProjects();
    } catch (err: unknown) {
      setStatusMsg({ text: (err as Error)?.message || "Failed to delete project.", type: "error" });
    }
  }

  async function handleSeedDefaultProjects() {
    if (!isFirebaseConfigured || !db) {
      alert("Firebase is not configured in .env.local yet.");
      return;
    }

    try {
      setLoadingProjects(true);
      for (const proj of defaultProjects) {
        await saveProject(proj);
      }
      setStatusMsg({ text: "All 6 default projects seeded to Cloud Firestore successfully!", type: "success" });
      refreshProjects();
    } catch (err: unknown) {
      setStatusMsg({ text: (err as Error)?.message || "Failed to seed default projects.", type: "error" });
    } finally {
      setLoadingProjects(false);
    }
  }

  // ==========================================
  // NEWS ACTION HANDLERS
  // ==========================================
  function handleEditNews(article: NewsArticle) {
    setEditingNewsId(article.id);
    setArticleForm(article);
    setNewsTagsInput(article.tags.join(", "));
    window.scrollTo({ top: 250, behavior: "smooth" });
  }

  function handleCancelNewsEdit() {
    setEditingNewsId(null);
    setArticleForm({
      title: "",
      category: "Regulations & Compliance",
      summary: "",
      content: "",
      author: "Jay Axis Engineering Desk",
      src: "/jay-e.jpeg",
      readTime: "4 min read",
      tags: ["Borehole", "Engineering"],
      featured: false
    });
    setNewsTagsInput("Borehole, Engineering");
  }

  async function handleSaveNews(e: React.FormEvent) {
    e.preventDefault();
    setStatusMsg(null);

    if (!articleForm.title || !articleForm.summary || !articleForm.content) {
      setStatusMsg({ text: "Please fill in the title, summary, and content fields.", type: "error" });
      return;
    }

    const tagsArray = newsTagsInput
      .split(",")
      .map(t => t.trim())
      .filter(Boolean);

    const slug = articleForm.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const newArticle: NewsArticle = {
      id: editingNewsId || `news-${Date.now()}`,
      title: articleForm.title!,
      slug,
      category: (articleForm.category as NewsArticle["category"]) || "Regulations & Compliance",
      summary: articleForm.summary!,
      content: articleForm.content!,
      author: articleForm.author || "Jay Axis Engineering Desk",
      date: articleForm.date || new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      src: articleForm.src || "/steel.jpeg",
      readTime: articleForm.readTime || "4 min read",
      tags: tagsArray.length > 0 ? tagsArray : ["Water"],
      featured: Boolean(articleForm.featured),
      createdAt: articleForm.createdAt || Date.now()
    };

    try {
      if (isFirebaseConfigured && db) {
        await saveNewsArticle(newArticle);
        setStatusMsg({ text: `Article "${newArticle.title}" saved to Cloud Firestore!`, type: "success" });
      } else {
        setArticles(prev => {
          const idx = prev.findIndex(a => a.id === newArticle.id);
          if (idx >= 0) {
            const updated = [...prev];
            updated[idx] = newArticle;
            return updated;
          }
          return [newArticle, ...prev];
        });
        setStatusMsg({ text: `Article updated locally! Add Firebase keys in .env.local to persist permanently.`, type: "info" });
      }

      handleCancelNewsEdit();
      refreshNews();
    } catch (err: unknown) {
      setStatusMsg({ text: (err as Error)?.message || "Failed to save article.", type: "error" });
    }
  }

  async function handleDeleteNews(articleId: string) {
    if (!confirm("Are you sure you want to delete this article?")) return;

    try {
      if (isFirebaseConfigured && db) {
        await deleteNewsArticle(articleId);
        setStatusMsg({ text: "Article deleted from Firestore.", type: "success" });
      } else {
        setArticles(prev => prev.filter(a => a.id !== articleId));
        setStatusMsg({ text: "Article removed from view.", type: "info" });
      }
      refreshNews();
    } catch (err: unknown) {
      setStatusMsg({ text: (err as Error)?.message || "Failed to delete article.", type: "error" });
    }
  }

  // Filtered lists for admin overview
  const filteredProductList = productList.filter(p =>
    `${p.name} ${p.sku} ${p.category}`.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredProjectList = projectList.filter(pr =>
    `${pr.title} ${pr.category} ${pr.county} ${pr.location}`.toLowerCase().includes(projectSearch.toLowerCase())
  );

  return (
    <div className="py-16 wrap max-w-6xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-widest text-sky-600 bg-sky-50 px-3.5 py-1.5 rounded-full inline-block border border-sky-100">
              Admin Console
            </span>
            <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
              Firebase Online
            </span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Jay Axis Operations & Catalogue Management
          </h1>
          <p className="text-xs text-slate-500">
            Edit products in the shop, update completed projects, publish news, and monitor client quotation requests.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/shop"
            target="_blank"
            className="inline-flex items-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs px-3.5 py-2 rounded-xl shadow-sm transition-colors"
          >
            <Eye size={13} /> View Shop
          </Link>
          <Link
            href="/projects"
            target="_blank"
            className="inline-flex items-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs px-3.5 py-2 rounded-xl shadow-sm transition-colors"
          >
            <Eye size={13} /> View Projects
          </Link>
          <Link
            href="/news"
            target="_blank"
            className="inline-flex items-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs px-3.5 py-2 rounded-xl shadow-sm transition-colors"
          >
            <Eye size={13} /> View News
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab("products")}
          className={`flex items-center gap-2 text-xs font-extrabold px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "products"
              ? "bg-sky-500 text-white shadow-md shadow-sky-500/20"
              : "bg-white text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Package size={15} /> Products in Shop ({productList.length})
        </button>

        <button
          onClick={() => setActiveTab("projects")}
          className={`flex items-center gap-2 text-xs font-extrabold px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "projects"
              ? "bg-sky-500 text-white shadow-md shadow-sky-500/20"
              : "bg-white text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Layers size={15} /> Projects Portfolio ({projectList.length})
        </button>

        <button
          onClick={() => setActiveTab("news")}
          className={`flex items-center gap-2 text-xs font-extrabold px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "news"
              ? "bg-sky-500 text-white shadow-md shadow-sky-500/20"
              : "bg-white text-slate-600 hover:bg-slate-100"
          }`}
        >
          <FileText size={15} /> News & Articles ({articles.length})
        </button>

        <button
          onClick={() => setActiveTab("orders")}
          className={`flex items-center gap-2 text-xs font-extrabold px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "orders"
              ? "bg-sky-500 text-white shadow-md shadow-sky-500/20"
              : "bg-white text-slate-600 hover:bg-slate-100"
          }`}
        >
          <ShoppingCart size={15} /> Customer Orders ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab("users")}
          className={`flex items-center gap-2 text-xs font-extrabold px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "users"
              ? "bg-sky-500 text-white shadow-md shadow-sky-500/20"
              : "bg-white text-slate-600 hover:bg-slate-100"
          }`}
        >
          <UserCheck size={15} /> Registered Users ({customers.length})
        </button>

        <button
          onClick={() => setActiveTab("quotes")}
          className={`flex items-center gap-2 text-xs font-extrabold px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "quotes"
              ? "bg-sky-500 text-white shadow-md shadow-sky-500/20"
              : "bg-white text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Users size={15} /> Quotations ({quotes.length})
        </button>

        <button
          onClick={() => setActiveTab("config")}
          className={`flex items-center gap-2 text-xs font-extrabold px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "config"
              ? "bg-sky-500 text-white shadow-md shadow-sky-500/20"
              : "bg-white text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Key size={15} /> Firebase Settings
        </button>
      </div>

      {/* Status Alert */}
      {statusMsg && (
        <div
          className={`p-4 rounded-2xl text-xs flex items-center justify-between border ${
            statusMsg.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : statusMsg.type === "error"
              ? "bg-red-50 border-red-200 text-red-800"
              : "bg-sky-50 border-sky-200 text-sky-800"
          }`}
        >
          <span>{statusMsg.text}</span>
          <button onClick={() => setStatusMsg(null)} className="font-bold underline text-[11px] ml-4 cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: PRODUCTS MANAGER */}
      {/* ========================================================================= */}
      {activeTab === "products" && (
        <div className="space-y-10">
          {/* Product Editor Form */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {editingProductId ? `Edit Product: ${productForm.name}` : "Add New Catalogue Product"}
                </h3>
                <p className="text-xs text-slate-500">
                  Products saved here update immediately in the Shop, Product Detail pages, and Cloud Firestore.
                </p>
              </div>

              {editingProductId && (
                <button
                  type="button"
                  onClick={handleCancelProductEdit}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-100 px-3 py-1.5 rounded-lg cursor-pointer"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Product Name</label>
                  <input
                    type="text"
                    required
                    value={productForm.name || ""}
                    onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="e.g. 4-inch Deep Well Submersible Borehole Pump"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">SKU Code</label>
                  <input
                    type="text"
                    required
                    value={productForm.sku || ""}
                    onChange={e => setProductForm({ ...productForm, sku: e.target.value })}
                    placeholder="JAX-PMP-001"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Category</label>
                  <select
                    value={productForm.category || "Water Pumps"}
                    onChange={e => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-sky-500 bg-white"
                  >
                    {productCategories
                      .filter(c => c !== "All")
                      .map(cat => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Price (KSh)</label>
                  <input
                    type="number"
                    value={productForm.price ?? 0}
                    onChange={e => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    placeholder="48500"
                    disabled={Boolean(productForm.priceOnRequest)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-sky-500 disabled:bg-slate-100"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Stock Availability</label>
                  <select
                    value={productForm.stock || "In stock"}
                    onChange={e => setProductForm({ ...productForm, stock: e.target.value as Product["stock"] })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-sky-500 bg-white"
                  >
                    <option value="In stock">In stock</option>
                    <option value="Limited stock">Limited stock</option>
                    <option value="Available on order">Available on order</option>
                    <option value="Coming soon">Coming soon (Shows description, hides price)</option>
                  </select>
                  {productForm.stock === "Coming soon" && (
                    <p className="text-[11px] text-purple-700 font-semibold bg-purple-50 border border-purple-200 p-2 rounded-lg mt-1">
                      ℹ️ Products with &quot;Coming soon&quot; will display full descriptions, specs, and photos on the shop &amp; featured pages, but the price will be hidden.
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Image Source Path (e.g. /steel.jpeg or /jay-e.jpeg)
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.src || ""}
                    onChange={e => setProductForm({ ...productForm, src: e.target.value })}
                    placeholder="/steel.jpeg"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Pricing Mode</label>
                  <div className="pt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                      <input
                        type="checkbox"
                        checked={Boolean(productForm.priceOnRequest)}
                        onChange={e => setProductForm({ ...productForm, priceOnRequest: e.target.checked })}
                        className="rounded border-slate-300 text-sky-500 focus:ring-sky-400"
                      />
                      <span>Quotation on Request</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Tagline / Key Headline</label>
                <input
                  type="text"
                  value={productForm.tagline || ""}
                  onChange={e => setProductForm({ ...productForm, tagline: e.target.value })}
                  placeholder="e.g. High-head stainless steel multi-stage borehole pumping system"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Product Description</label>
                <textarea
                  required
                  rows={3}
                  value={productForm.description || ""}
                  onChange={e => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Full engineering description and field suitability..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Specifications (Comma-separated Key: Value pairs)
                  </label>
                  <textarea
                    rows={2}
                    value={specsInput}
                    onChange={e => setSpecsInput(e.target.value)}
                    placeholder="Motor Rating: 2.2 kW, Max Head: 180m, Casing: 4 Inch"
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Features (Comma-separated list)
                  </label>
                  <textarea
                    rows={2}
                    value={featuresInput}
                    onChange={e => setFeaturesInput(e.target.value)}
                    placeholder="Floating impellers, Non-return valve, Drop cable included"
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={Boolean(productForm.featured)}
                    onChange={e => setProductForm({ ...productForm, featured: e.target.checked })}
                    className="rounded border-slate-300 text-sky-500 focus:ring-sky-400"
                  />
                  <span>Feature on Homepage Product Grid</span>
                </label>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer"
                >
                  <Check size={14} /> {editingProductId ? "Update Product" : "Save Product to Live Shop"}
                </button>
              </div>
            </form>
          </div>

          {/* Product Listings Table */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-slate-900">Current Shop Inventory</h3>
                <p className="text-xs text-slate-400">Total catalogue items: {productList.length}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={e => setProductSearch(e.target.value)}
                    placeholder="Search products/SKU..."
                    className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-sky-500 w-44"
                  />
                </div>

                <button
                  onClick={refreshProducts}
                  disabled={loadingProducts}
                  className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  <RefreshCw size={12} className={loadingProducts ? "animate-spin" : ""} /> Refresh
                </button>

                <button
                  onClick={handleSeedDefaultProducts}
                  className="inline-flex items-center gap-1 bg-sky-50 text-sky-700 hover:bg-sky-100 font-bold text-xs px-3 py-1.5 rounded-lg border border-sky-200 transition-colors cursor-pointer"
                  title="Upload all default products to Firestore"
                >
                  <Sparkles size={12} /> Seed Default Products to Firestore
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {filteredProductList.map(prod => (
                <div
                  key={prod.id}
                  className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-sky-200 transition-colors shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200/60">
                      <Image
                        src={prod.src || prod.image || "/steel.jpeg"}
                        alt={prod.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded">
                          {prod.sku}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">
                          {prod.category}
                        </span>
                        {prod.featured && (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            Featured
                          </span>
                        )}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          prod.stock === "Coming soon"
                            ? "text-purple-700 bg-purple-50 border border-purple-200"
                            : "text-emerald-700 bg-emerald-50"
                        }`}>
                          {prod.stock}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 leading-snug">{prod.name}</h4>
                      <div className="text-xs font-bold text-slate-900">
                        {prod.stock === "Coming soon" ? (
                          <span className="text-purple-600 font-extrabold">Price Hidden (Coming Soon)</span>
                        ) : prod.priceOnRequest ? (
                          "Quotation on Request"
                        ) : (
                          formatKES(prod.price)
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                    <button
                      onClick={() => handleEditProduct(prod)}
                      className="inline-flex items-center gap-1 bg-slate-100 hover:bg-sky-50 hover:text-sky-600 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      <Edit3 size={13} /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(prod.id)}
                      className="inline-flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: PROJECTS MANAGER */}
      {/* ========================================================================= */}
      {activeTab === "projects" && (
        <div className="space-y-10">
          {/* Project Editor Form */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {editingProjectId ? `Edit Project: ${projectForm.title}` : "Add New Completed Project"}
                </h3>
                <p className="text-xs text-slate-500">
                  Projects saved here update immediately on the Projects page, Homepage portfolio, and Cloud Firestore.
                </p>
              </div>

              {editingProjectId && (
                <button
                  type="button"
                  onClick={handleCancelProjectEdit}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-100 px-3 py-1.5 rounded-lg cursor-pointer"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Project Title</label>
                  <input
                    type="text"
                    required
                    value={projectForm.title || ""}
                    onChange={e => setProjectForm({ ...projectForm, title: e.target.value })}
                    placeholder="e.g. 50,000L Modular Pressed Steel Water Tank & 15m Tower"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Category</label>
                  <select
                    value={projectForm.category || "Water Tanks & Towers"}
                    onChange={e =>
                      setProjectForm({
                        ...projectForm,
                        category: e.target.value as Project["category"]
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-sky-500 bg-white"
                  >
                    {projectCategories
                      .filter(c => c !== "All Projects")
                      .map(cat => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Location</label>
                  <input
                    type="text"
                    required
                    value={projectForm.location || ""}
                    onChange={e => setProjectForm({ ...projectForm, location: e.target.value })}
                    placeholder="Tatu City Industrial Park"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">County</label>
                  <input
                    type="text"
                    required
                    value={projectForm.county || ""}
                    onChange={e => setProjectForm({ ...projectForm, county: e.target.value })}
                    placeholder="Kiambu"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Year Completed</label>
                  <input
                    type="text"
                    value={projectForm.year || "2025"}
                    onChange={e => setProjectForm({ ...projectForm, year: e.target.value })}
                    placeholder="2025"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Image Source Path (e.g. /steel.jpeg or /jay-e.jpeg)
                </label>
                <input
                  type="text"
                  required
                  value={projectForm.src || ""}
                  onChange={e => setProjectForm({ ...projectForm, src: e.target.value })}
                  placeholder="/steel.jpeg"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Project Scope & Engineering Summary</label>
                <textarea
                  required
                  rows={3}
                  value={projectForm.scope || ""}
                  onChange={e => setProjectForm({ ...projectForm, scope: e.target.value })}
                  placeholder="Design, structural calculation, shop fabrication and site assembly of..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Execution Deliverables (Comma-separated)
                  </label>
                  <textarea
                    rows={2}
                    value={deliverablesInput}
                    onChange={e => setDeliverablesInput(e.target.value)}
                    placeholder="Foundation pad casting, 15m structural lattice tower, 50m³ pressed steel tank"
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Equipment Installed (Comma-separated)
                  </label>
                  <textarea
                    rows={2}
                    value={equipmentInput}
                    onChange={e => setEquipmentInput(e.target.value)}
                    placeholder="Modular Pressed Panels, Universal Columns, Stainless Tie-rods"
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={Boolean(projectForm.featured)}
                    onChange={e => setProjectForm({ ...projectForm, featured: e.target.checked })}
                    className="rounded border-slate-300 text-sky-500 focus:ring-sky-400"
                  />
                  <span>Feature on Homepage Portfolio Carousel</span>
                </label>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer"
                >
                  <Check size={14} /> {editingProjectId ? "Update Project" : "Save Project to Portfolio"}
                </button>
              </div>
            </form>
          </div>

          {/* Project Listings Table */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-slate-900">Completed Projects Portfolio</h3>
                <p className="text-xs text-slate-400">Total verified projects: {projectList.length}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={projectSearch}
                    onChange={e => setProjectSearch(e.target.value)}
                    placeholder="Search projects/county..."
                    className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-sky-500 w-44"
                  />
                </div>

                <button
                  onClick={refreshProjects}
                  disabled={loadingProjects}
                  className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  <RefreshCw size={12} className={loadingProjects ? "animate-spin" : ""} /> Refresh
                </button>

                <button
                  onClick={handleSeedDefaultProjects}
                  className="inline-flex items-center gap-1 bg-sky-50 text-sky-700 hover:bg-sky-100 font-bold text-xs px-3 py-1.5 rounded-lg border border-sky-200 transition-colors cursor-pointer"
                  title="Upload all default projects to Firestore"
                >
                  <Sparkles size={12} /> Seed Default Projects to Firestore
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {filteredProjectList.map(proj => (
                <div
                  key={proj.id}
                  className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-sky-200 transition-colors shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200/60">
                      <Image
                        src={proj.src || proj.image || "/steel.jpeg"}
                        alt={proj.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="space-y-1 max-w-xl">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded uppercase">
                          {proj.category}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold">
                          {proj.county} County · {proj.year}
                        </span>
                        {proj.featured && (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            Featured
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 leading-snug">{proj.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-1">{proj.scope}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                    <button
                      onClick={() => handleEditProject(proj)}
                      className="inline-flex items-center gap-1 bg-slate-100 hover:bg-sky-50 hover:text-sky-600 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      <Edit3 size={13} /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProject(proj.id)}
                      className="inline-flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: NEWS MANAGER */}
      {/* ========================================================================= */}
      {activeTab === "news" && (
        <div className="space-y-10">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {editingNewsId ? "Edit News Article" : "Publish New Article"}
                </h3>
                <p className="text-xs text-slate-500">
                  Content published here updates immediately on the public News page and in Cloud Firestore.
                </p>
              </div>

              {editingNewsId && (
                <button
                  type="button"
                  onClick={handleCancelNewsEdit}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-100 px-3 py-1.5 rounded-lg cursor-pointer"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <form onSubmit={handleSaveNews} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Article Title</label>
                  <input
                    type="text"
                    required
                    value={articleForm.title || ""}
                    onChange={e => setArticleForm({ ...articleForm, title: e.target.value })}
                    placeholder="e.g. WRA Water Authorization Requirements 2026"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Category</label>
                  <select
                    value={articleForm.category || "Regulations & Compliance"}
                    onChange={e =>
                      setArticleForm({
                        ...articleForm,
                        category: e.target.value as NewsArticle["category"]
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-sky-500 bg-white"
                  >
                    {newsCategories
                      .filter(c => c !== "All Articles")
                      .map(cat => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Image Source Path (e.g. /jay-e.jpeg or /steel.jpeg)
                  </label>
                  <input
                    type="text"
                    value={articleForm.src || ""}
                    onChange={e => setArticleForm({ ...articleForm, src: e.target.value })}
                    placeholder="/jay-e.jpeg"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Author</label>
                  <input
                    type="text"
                    value={articleForm.author || ""}
                    onChange={e => setArticleForm({ ...articleForm, author: e.target.value })}
                    placeholder="Jay Axis Engineering Desk"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={newsTagsInput}
                    onChange={e => setNewsTagsInput(e.target.value)}
                    placeholder="WRA, Boreholes, Solar"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Summary (Short abstract)</label>
                <textarea
                  required
                  rows={2}
                  value={articleForm.summary || ""}
                  onChange={e => setArticleForm({ ...articleForm, summary: e.target.value })}
                  placeholder="A concise overview of the article shown in news cards..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Full Article Content</label>
                <textarea
                  required
                  rows={6}
                  value={articleForm.content || ""}
                  onChange={e => setArticleForm({ ...articleForm, content: e.target.value })}
                  placeholder="Write the full news story, technical details, and statutory guidelines..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-sky-500 font-sans"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={Boolean(articleForm.featured)}
                    onChange={e => setArticleForm({ ...articleForm, featured: e.target.checked })}
                    className="rounded border-slate-300 text-sky-500 focus:ring-sky-400"
                  />
                  <span>Mark as Featured Story (Hero Banner)</span>
                </label>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer"
                >
                  <Check size={14} /> {editingNewsId ? "Update Article" : "Publish Article to Live Site"}
                </button>
              </div>
            </form>
          </div>

          {/* Published Articles List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900">Published News Articles</h3>
                <p className="text-xs text-slate-400">Total articles active: {articles.length}</p>
              </div>

              <button
                onClick={refreshNews}
                disabled={loadingNews}
                className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <RefreshCw size={12} className={loadingNews ? "animate-spin" : ""} /> Refresh
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {articles.map(art => (
                <div
                  key={art.id}
                  className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-sky-200 transition-colors shadow-sm"
                >
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase text-sky-600 bg-sky-50 px-2 py-0.5 rounded">
                        {art.category}
                      </span>
                      {art.featured && (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          Featured
                        </span>
                      )}
                      <span className="text-xs text-slate-400">{art.date}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 leading-snug">{art.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-1">{art.summary}</p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                    <button
                      onClick={() => handleEditNews(art)}
                      className="inline-flex items-center gap-1 bg-slate-100 hover:bg-sky-50 hover:text-sky-600 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      <Edit3 size={13} /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteNews(art.id)}
                      className="inline-flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: QUOTATION REQUESTS */}
      {/* ========================================================================= */}
      {activeTab === "quotes" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900">Client Quotation Submissions</h3>
              <p className="text-xs text-slate-500">Live requests submitted through the quote form to Cloud Firestore.</p>
            </div>
            <button
              onClick={refreshQuotes}
              disabled={loadingQuotes}
              className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
            >
              <RefreshCw size={13} className={loadingQuotes ? "animate-spin" : ""} /> Refresh Requests
            </button>
          </div>

          {quotes.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-3">
              <Users size={36} className="text-slate-300 mx-auto" />
              <h4 className="text-base font-bold text-slate-800">No quotation requests yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                When clients fill in the Request a Quote form, their details, county, and requirements will appear here in real time.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {quotes.map(q => (
                <div
                  key={q.id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2 hover:border-sky-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900">{q.customer_name}</span>
                    <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 uppercase text-[10px]">
                      {q.status || "NEW"}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 flex flex-wrap gap-4">
                    <span>Phone: <strong className="text-slate-800">{q.phone}</strong></span>
                    {q.email && <span>Email: <strong className="text-slate-800">{q.email}</strong></span>}
                    <span>County: <strong className="text-slate-800">{q.county}</strong></span>
                    {q.town && <span>Town: <strong className="text-slate-800">{q.town}</strong></span>}
                  </div>
                  <div className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 mt-2">
                    <span className="font-bold text-sky-700 block mb-0.5">Item / Service: {q.item_requested}</span>
                    {q.scope && <p className="text-slate-600 mt-1">{q.scope}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: ORDERS */}
      {/* ========================================================================= */}
      {activeTab === "orders" && (
        <div className="space-y-6">
          {/* Header & Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <ShoppingCart className="text-sky-500" size={18} /> Customer Orders & Dispatch
              </h3>
              <p className="text-xs text-slate-500">
                Live customer purchases placed via checkout, stored in Cloud Firestore under <code className="font-mono text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded">orders</code>.
              </p>
            </div>
            <button
              onClick={refreshOrders}
              disabled={loadingOrders}
              className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3.5 py-2 rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
            >
              <RefreshCw size={13} className={loadingOrders ? "animate-spin" : ""} /> Refresh Orders
            </button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Total Orders</span>
              <p className="text-2xl font-black text-slate-900 mt-1">{orders.length}</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Total Gross Value</span>
              <p className="text-2xl font-black text-emerald-600 mt-1">
                {new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 }).format(
                  orders.reduce((sum, o) => sum + (o.subtotal || 0), 0)
                )}
              </p>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Pending Delivery</span>
              <p className="text-2xl font-black text-amber-600 mt-1">
                {orders.filter(o => o.status === "Pending Delivery").length}
              </p>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Delivered & Complete</span>
              <p className="text-2xl font-black text-sky-600 mt-1">
                {orders.filter(o => o.status === "Delivered / Completed").length}
              </p>
            </div>
          </div>

          {/* Search & Status Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search orders by Ref, Customer Name, Phone, Email, Town, County..."
                value={orderSearch}
                onChange={e => setOrderSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-sky-500"
              />
            </div>
            <select
              value={orderStatusFilter}
              onChange={e => setOrderStatusFilter(e.target.value)}
              className="px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 font-bold focus:outline-none focus:border-sky-500"
            >
              <option value="all">All Statuses ({orders.length})</option>
              <option value="Pending Delivery">Pending Delivery</option>
              <option value="Processing">Processing</option>
              <option value="Delivered / Completed">Delivered / Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Orders List */}
          {(() => {
            const filteredOrders = orders.filter(o => {
              const term = orderSearch.toLowerCase().trim();
              const matchesSearch =
                !term ||
                o.order_ref.toLowerCase().includes(term) ||
                o.customer_name.toLowerCase().includes(term) ||
                o.customer_phone.includes(term) ||
                (o.customer_email && o.customer_email.toLowerCase().includes(term)) ||
                o.town.toLowerCase().includes(term) ||
                o.county.toLowerCase().includes(term);
              const matchesStatus = orderStatusFilter === "all" || o.status === orderStatusFilter;
              return matchesSearch && matchesStatus;
            });

            if (filteredOrders.length === 0) {
              return (
                <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-3">
                  <ShoppingCart size={36} className="text-slate-300 mx-auto" />
                  <h4 className="text-base font-bold text-slate-800">
                    {orderSearch || orderStatusFilter !== "all" ? "No matching orders found" : "No customer orders yet"}
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    When customers proceed through checkout and click Confirm & Place Order, their orders will appear here automatically.
                  </p>
                </div>
              );
            }

            return (
              <div className="grid grid-cols-1 gap-5">
                {filteredOrders.map(order => {
                  const whatsappLink = `https://wa.me/${order.customer_phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                    `Hello ${order.customer_name}, this is Jay Axis Engineering regarding your order ${order.order_ref} to ${order.town}, ${order.county} County.`
                  )}`;

                  return (
                    <div
                      key={order.id}
                      className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4 hover:border-sky-300 transition-all"
                    >
                      {/* Top Bar */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="font-mono font-bold text-xs bg-slate-900 text-white px-3 py-1 rounded-lg">
                            {order.order_ref}
                          </span>
                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Clock size={12} /> {order.created_at ? new Date(order.created_at).toLocaleString() : "Recent"}
                          </span>
                        </div>

                        {/* Status selector */}
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-[11px] font-extrabold uppercase border ${
                              order.status === "Pending Delivery"
                                ? "bg-amber-50 text-amber-800 border-amber-200"
                                : order.status === "Processing"
                                ? "bg-sky-50 text-sky-800 border-sky-200"
                                : order.status === "Delivered / Completed"
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                : "bg-red-50 text-red-800 border-red-200"
                            }`}
                          >
                            {order.status}
                          </span>

                          <select
                            value={order.status}
                            onChange={e =>
                              handleUpdateOrderStatus(order.id, e.target.value as OrderDoc["status"])
                            }
                            className="text-[11px] font-bold bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700 cursor-pointer focus:outline-none"
                          >
                            <option value="Pending Delivery">Pending Delivery</option>
                            <option value="Processing">Processing</option>
                            <option value="Delivered / Completed">Delivered / Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>

                      {/* Content Grid */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                        {/* Customer & Delivery details */}
                        <div className="lg:col-span-6 space-y-3 text-xs">
                          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                              Customer & Contact
                            </span>
                            <div className="space-y-1">
                              <p className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                                <UserCheck size={14} className="text-sky-600" /> {order.customer_name}
                                {order.customer_company && (
                                  <span className="text-[11px] font-normal text-slate-500">
                                    ({order.customer_company})
                                  </span>
                                )}
                              </p>
                              <div className="flex flex-wrap gap-x-4 gap-y-1 text-slate-600 text-xs pt-1">
                                <a
                                  href={`tel:${order.customer_phone}`}
                                  className="inline-flex items-center gap-1 text-sky-600 hover:underline font-bold"
                                >
                                  <Phone size={12} /> {order.customer_phone}
                                </a>
                                {order.customer_email && (
                                  <a
                                    href={`mailto:${order.customer_email}`}
                                    className="inline-flex items-center gap-1 text-slate-600 hover:text-sky-600"
                                  >
                                    <Mail size={12} /> {order.customer_email}
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                              Delivery Location
                            </span>
                            <p className="font-bold text-slate-800">
                              {order.town}, {order.county} County
                            </p>
                            {order.address && (
                              <p className="text-slate-600 text-[11px]">{order.address}</p>
                            )}
                            {order.delivery_notes && (
                              <div className="mt-2 p-2.5 bg-amber-50/80 border border-amber-200/80 rounded-xl text-amber-900 text-[11px]">
                                <strong>Delivery Notes:</strong> {order.delivery_notes}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Order Items & Totals */}
                        <div className="lg:col-span-6 bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 space-y-3 text-xs">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                            Order Items ({order.items.length})
                          </span>

                          <div className="divide-y divide-slate-200/60 max-h-48 overflow-y-auto pr-1">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="py-2 flex items-center justify-between text-xs">
                                <div className="space-y-0.5">
                                  <p className="font-bold text-slate-800 line-clamp-1 max-w-[240px]">
                                    {item.name}
                                  </p>
                                  <span className="text-[11px] text-slate-400">
                                    Qty: {item.qty} ×{" "}
                                    {new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 }).format(item.price)}
                                  </span>
                                </div>
                                <span className="font-bold text-slate-900">
                                  {new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 }).format(item.price * item.qty)}
                                </span>
                              </div>
                            ))}
                          </div>

                          <div className="pt-2 border-t border-slate-200 flex justify-between items-center font-bold">
                            <span className="text-slate-700">Subtotal Amount</span>
                            <span className="text-sm text-sky-600 font-black">
                              {new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 }).format(order.subtotal)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-colors shadow-sm"
                          >
                            <MessageSquare size={13} /> Chat on WhatsApp
                          </a>
                          <span className="text-[11px] text-slate-400">
                            Pay Method: <strong>{order.payment_method}</strong>
                          </span>
                        </div>

                        <button
                          onClick={() => handleDeleteOrder(order.id, order.order_ref)}
                          className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-bold px-2 py-1 rounded cursor-pointer"
                        >
                          <Trash2 size={13} /> Delete Order
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: REGISTERED USERS */}
      {/* ========================================================================= */}
      {activeTab === "users" && (
        <div className="space-y-6">
          {/* Header & Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <UserCheck className="text-sky-500" size={18} /> Registered Customer Accounts
              </h3>
              <p className="text-xs text-slate-500">
                Customer profiles created during checkout and saved in Cloud Firestore under <code className="font-mono text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded">users</code>.
              </p>
            </div>
            <button
              onClick={refreshCustomers}
              disabled={loadingCustomers}
              className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3.5 py-2 rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
            >
              <RefreshCw size={13} className={loadingCustomers ? "animate-spin" : ""} /> Refresh Users
            </button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Registered Customers</span>
              <p className="text-2xl font-black text-slate-900 mt-1">{customers.length}</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Total Orders Placed</span>
              <p className="text-2xl font-black text-sky-600 mt-1">
                {customers.reduce((sum, c) => sum + (c.total_orders || 0), 0)}
              </p>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Total Customer Spend</span>
              <p className="text-2xl font-black text-emerald-600 mt-1">
                {new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 }).format(
                  customers.reduce((sum, c) => sum + (c.total_spent || 0), 0)
                )}
              </p>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search customers by Name, Email, Phone, Company, County..."
              value={customerSearch}
              onChange={e => setCustomerSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Customer list */}
          {(() => {
            const filteredCustomers = customers.filter(c => {
              if (!customerSearch.trim()) return true;
              const term = customerSearch.toLowerCase();
              return (
                c.name.toLowerCase().includes(term) ||
                c.email.toLowerCase().includes(term) ||
                c.phone.includes(term) ||
                (c.company && c.company.toLowerCase().includes(term)) ||
                (c.county && c.county.toLowerCase().includes(term)) ||
                (c.town && c.town.toLowerCase().includes(term))
              );
            });

            if (filteredCustomers.length === 0) {
              return (
                <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-3">
                  <UserCheck size={36} className="text-slate-300 mx-auto" />
                  <h4 className="text-base font-bold text-slate-800">
                    {customerSearch ? "No matching customers found" : "No registered customers yet"}
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    When customers start the checkout process, their profile details are registered in the database and will appear here.
                  </p>
                </div>
              );
            }

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredCustomers.map(customer => {
                  const initials = customer.name
                    ? customer.name
                        .split(" ")
                        .map(n => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)
                    : "CU";

                  const whatsappLink = `https://wa.me/${customer.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                    `Hello ${customer.name}, greetings from Jay Axis Engineering.`
                  )}`;

                  return (
                    <div
                      key={customer.id}
                      className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3 hover:border-sky-300 transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-2xl bg-sky-50 border border-sky-100 text-sky-600 font-extrabold flex items-center justify-center text-sm shadow-inner">
                              {initials}
                            </div>
                            <div>
                              <h4 className="text-sm font-extrabold text-slate-900">{customer.name}</h4>
                              {customer.company && (
                                <p className="text-[11px] text-slate-500 font-medium">{customer.company}</p>
                              )}
                            </div>
                          </div>

                          <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                            {customer.id.length > 16 ? `${customer.id.slice(0, 14)}...` : customer.id}
                          </span>
                        </div>

                        <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                          <div className="flex items-center gap-2">
                            <Mail size={12} className="text-slate-400" />
                            <a href={`mailto:${customer.email}`} className="text-sky-600 hover:underline">
                              {customer.email}
                            </a>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone size={12} className="text-slate-400" />
                            <a href={`tel:${customer.phone}`} className="font-bold text-slate-800 hover:text-sky-600">
                              {customer.phone}
                            </a>
                          </div>
                          {(customer.county || customer.town) && (
                            <div className="flex items-center gap-2 text-[11px] text-slate-500">
                              <MapPin size={12} className="text-slate-400" />
                              <span>
                                {customer.town ? `${customer.town}, ` : ""}
                                {customer.county ? `${customer.county} County` : "Kenya"}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Customer Stats */}
                        <div className="flex items-center justify-between text-xs pt-1 px-1">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Orders</span>
                            <span className="font-extrabold text-slate-900">{customer.total_orders || 0} placed</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Spend</span>
                            <span className="font-extrabold text-emerald-600">
                              {new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 }).format(customer.total_spent || 0)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <a
                          href={whatsappLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[11px] px-3 py-1.5 rounded-xl transition-colors"
                        >
                          <MessageSquare size={12} /> WhatsApp
                        </a>

                        <button
                          onClick={() => handleDeleteCustomer(customer.id, customer.name)}
                          className="inline-flex items-center gap-1 text-[11px] text-red-500 hover:text-red-700 font-bold px-2 py-1 rounded cursor-pointer"
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: FIREBASE SETTINGS */}
      {/* ========================================================================= */}
      {activeTab === "config" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
              <Database size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Firebase Backend Connection</h3>
              <p className="text-xs text-slate-500">Project ID: jay-axis</p>
            </div>
          </div>

          <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
            <p>
              Your Firebase project <strong>jay-axis</strong> is initialized in <code className="bg-slate-100 px-2 py-0.5 rounded font-mono text-[11px]">.env.local</code>.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="font-bold text-slate-900 block">Collection: `products`</span>
                <p className="text-slate-500">Stores equipment catalogue items, prices, stock, specs, and photos.</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="font-bold text-slate-900 block">Collection: `projects`</span>
                <p className="text-slate-500">Stores completed engineering infrastructure, towers, and case studies.</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="font-bold text-slate-900 block">Collection: `news`</span>
                <p className="text-slate-500">Stores statutory updates, borehole permitting articles, and news.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

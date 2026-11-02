"use client";

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { products as fallbackProducts, getProducts, Product } from "@/lib/products";

export interface CartItem {
  id: string;
  qty: number;
  product?: Product;
}

interface CartContextType {
  items: CartItem[];
  count: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  add: (id: string, quantity?: number, product?: Product) => void;
  qty: (id: string, n: number) => void;
  remove: (id: string) => void;
  clearCart: () => void;
  wishlist: string[];
  toggleWishlist: (id: string) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (p: Product | null) => void;
  getProduct: (id: string) => Product | undefined;
  liveProducts: Product[];
}

const CartContext = createContext<CartContextType | null>(null);

export function Providers({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [liveProducts, setLiveProducts] = useState<Product[]>(fallbackProducts);

  useEffect(() => {
    getProducts()
      .then(prods => {
        if (prods && prods.length > 0) {
          setLiveProducts(prods);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("jayaxis-cart");
      if (savedCart) setItems(JSON.parse(savedCart));
      const savedWishlist = localStorage.getItem("jayaxis-wishlist");
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    } catch {
      setItems([]);
      setWishlist([]);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("jayaxis-cart", JSON.stringify(items));
    } catch {
      // Storage error fallback
    }
  }, [items]);

  useEffect(() => {
    try {
      localStorage.setItem("jayaxis-wishlist", JSON.stringify(wishlist));
    } catch {
      // Storage error fallback
    }
  }, [wishlist]);

  const getProduct = (id: string) => {
    return liveProducts.find(p => p.id === id) || fallbackProducts.find(p => p.id === id);
  };

  const value = useMemo(
    () => ({
      items,
      count: items.reduce((total, item) => total + item.qty, 0),
      isCartOpen,
      openCart: () => setIsCartOpen(true),
      closeCart: () => setIsCartOpen(false),
      toggleCart: () => setIsCartOpen(prev => !prev),
      add: (id: string, quantity: number = 1, product?: Product) => {
        const prod = product || liveProducts.find(p => p.id === id) || fallbackProducts.find(p => p.id === id);
        setItems(current => {
          const existing = current.find(x => x.id === id);
          if (existing) {
            return current.map(x => (x.id === id ? { ...x, qty: x.qty + quantity, product: x.product || prod } : x));
          }
          return [...current, { id, qty: quantity, product: prod }];
        });
        setIsCartOpen(true);
      },
      qty: (id: string, n: number) => {
        setItems(current => (n < 1 ? current.filter(x => x.id !== id) : current.map(x => (x.id === id ? { ...x, qty: n } : x))));
      },
      remove: (id: string) => {
        setItems(current => current.filter(x => x.id !== id));
      },
      clearCart: () => {
        setItems([]);
      },
      wishlist,
      toggleWishlist: (id: string) => {
        setWishlist(current => (current.includes(id) ? current.filter(x => x !== id) : [...current, id]));
      },
      quickViewProduct,
      setQuickViewProduct,
      getProduct,
      liveProducts
    }),
    [items, isCartOpen, wishlist, quickViewProduct, liveProducts]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a Providers component");
  return context;
}

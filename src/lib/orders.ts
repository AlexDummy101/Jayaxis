import { db, isFirebaseConfigured } from "@/lib/firebase";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy
} from "firebase/firestore";

export interface CustomerUser {
  id: string;
  uid?: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  county?: string;
  town?: string;
  address?: string;
  created_at: string;
  total_orders?: number;
  total_spent?: number;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  src?: string;
  sku?: string;
  category?: string;
}

export interface OrderDoc {
  id: string;
  order_ref: string;
  user_id?: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  customer_company?: string;
  county: string;
  town: string;
  address?: string;
  delivery_notes?: string;
  items: OrderItem[];
  subtotal: number;
  payment_method: string;
  payment_phone?: string;
  status: "Pending Delivery" | "Processing" | "Delivered / Completed" | "Cancelled";
  created_at: string;
}

// ==========================================
// USER DATABASE FUNCTIONS
// ==========================================

// Save or create a customer user account in Firestore under the "users" collection
export async function saveCustomerUser(
  userData: Omit<CustomerUser, "id" | "created_at"> & { id?: string; created_at?: string }
): Promise<CustomerUser> {
  if (!isFirebaseConfigured || !db) {
    const localUser: CustomerUser = {
      ...userData,
      id: userData.id || `user-${Date.now()}`,
      created_at: userData.created_at || new Date().toISOString(),
      total_orders: userData.total_orders || 0,
      total_spent: userData.total_spent || 0
    };
    return localUser;
  }

  try {
    const userId =
      userData.id ||
      userData.uid ||
      userData.email.toLowerCase().replace(/[^a-z0-9]+/g, "-") ||
      `user-${Date.now()}`;

    const userRef = doc(db, "users", userId);
    const existingSnap = await getDoc(userRef);

    const fullUser: CustomerUser = {
      id: userId,
      uid: userData.uid || userId,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      company: userData.company || "",
      county: userData.county || "",
      town: userData.town || "",
      address: userData.address || "",
      created_at: existingSnap.exists() && existingSnap.data()?.created_at ? existingSnap.data().created_at : (userData.created_at || new Date().toISOString()),
      total_orders: existingSnap.exists() && existingSnap.data()?.total_orders ? existingSnap.data().total_orders : (userData.total_orders || 0),
      total_spent: existingSnap.exists() && existingSnap.data()?.total_spent ? existingSnap.data().total_spent : (userData.total_spent || 0)
    };

    await setDoc(userRef, fullUser, { merge: true });
    return fullUser;
  } catch (err) {
    console.warn("Could not save user to Firestore, falling back to local object:", err);
    return {
      ...userData,
      id: userData.id || `user-${Date.now()}`,
      created_at: userData.created_at || new Date().toISOString()
    };
  }
}

// Fetch all registered customers from Firestore
export async function getCustomerUsers(): Promise<CustomerUser[]> {
  if (!isFirebaseConfigured || !db) {
    return [];
  }

  try {
    const q = query(collection(db, "users"), orderBy("created_at", "desc"));
    const snap = await getDocs(q);
    const list: CustomerUser[] = [];
    snap.forEach(d => {
      list.push({ id: d.id, ...(d.data() as Omit<CustomerUser, "id">) });
    });
    return list;
  } catch (err) {
    console.warn("Error fetching users from Firestore:", err);
    // Fallback: fetch without orderBy if index is still building
    try {
      const snap = await getDocs(collection(db, "users"));
      const list: CustomerUser[] = [];
      snap.forEach(d => {
        list.push({ id: d.id, ...(d.data() as Omit<CustomerUser, "id">) });
      });
      return list;
    } catch {
      return [];
    }
  }
}

// Delete a customer user from Firestore
export async function deleteCustomerUser(userId: string): Promise<boolean> {
  if (!isFirebaseConfigured || !db) return true;
  await deleteDoc(doc(db, "users", userId));
  return true;
}

// ==========================================
// ORDER DATABASE FUNCTIONS
// ==========================================

// Save a new order to Firestore under the "orders" collection and update the customer's stats
export async function saveOrder(
  orderData: Omit<OrderDoc, "id" | "created_at"> & { id?: string; created_at?: string }
): Promise<OrderDoc> {
  const orderRefId = orderData.order_ref || `JAX-ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  const newOrder: OrderDoc = {
    ...orderData,
    id: orderData.id || `order-${Date.now()}`,
    order_ref: orderRefId,
    status: orderData.status || "Pending Delivery",
    created_at: orderData.created_at || new Date().toISOString()
  };

  if (!isFirebaseConfigured || !db) {
    return newOrder;
  }

  try {
    const orderDocRef = doc(db, "orders", newOrder.id);
    await setDoc(orderDocRef, newOrder);

    // Update user stats if user_id is provided
    if (newOrder.user_id) {
      try {
        const userRef = doc(db, "users", newOrder.user_id);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const currentOrders = userSnap.data()?.total_orders || 0;
          const currentSpent = userSnap.data()?.total_spent || 0;
          await updateDoc(userRef, {
            total_orders: currentOrders + 1,
            total_spent: currentSpent + newOrder.subtotal,
            county: newOrder.county || userSnap.data()?.county,
            town: newOrder.town || userSnap.data()?.town,
            address: newOrder.address || userSnap.data()?.address
          });
        }
      } catch (userUpdateErr) {
        console.warn("Could not update customer user order summary:", userUpdateErr);
      }
    }

    return newOrder;
  } catch (err) {
    console.warn("Could not save order to Firestore:", err);
    return newOrder;
  }
}

// Fetch all orders from Firestore
export async function getOrders(): Promise<OrderDoc[]> {
  if (!isFirebaseConfigured || !db) {
    return [];
  }

  try {
    const q = query(collection(db, "orders"), orderBy("created_at", "desc"));
    const snap = await getDocs(q);
    const list: OrderDoc[] = [];
    snap.forEach(d => {
      list.push({ id: d.id, ...(d.data() as Omit<OrderDoc, "id">) });
    });
    return list;
  } catch (err) {
    console.warn("Error fetching orders from Firestore with orderBy:", err);
    try {
      const snap = await getDocs(collection(db, "orders"));
      const list: OrderDoc[] = [];
      snap.forEach(d => {
        list.push({ id: d.id, ...(d.data() as Omit<OrderDoc, "id">) });
      });
      // Sort manually by date desc
      return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } catch {
      return [];
    }
  }
}

// Update order status in Firestore (e.g. Pending Delivery -> Processing -> Delivered)
export async function updateOrderStatus(
  orderId: string,
  status: OrderDoc["status"]
): Promise<boolean> {
  if (!isFirebaseConfigured || !db) return true;
  const orderRef = doc(db, "orders", orderId);
  await updateDoc(orderRef, { status });
  return true;
}

// Delete an order from Firestore
export async function deleteOrder(orderId: string): Promise<boolean> {
  if (!isFirebaseConfigured || !db) return true;
  await deleteDoc(doc(db, "orders", orderId));
  return true;
}

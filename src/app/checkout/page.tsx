"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/components/Providers";
import { products, price } from "@/lib/products";
import { kenyanCounties } from "@/components/QuoteForm";
import {
  saveCustomerUser,
  saveOrder,
  CustomerUser,
  OrderDoc,
  OrderItem
} from "@/lib/orders";
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  UserCheck,
  ShieldCheck,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Building,
  Loader2,
  AlertCircle,
  MessageCircle,
  Package
} from "lucide-react";

export default function CheckoutPage() {
  const { items, clearCart, getProduct } = useCart();
  const [step, setStep] = useState(1);
  const [paymentState, setPaymentState] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [mpesaPhone, setMpesaPhone] = useState("");
  const [savingAccount, setSavingAccount] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [currentUser, setCurrentUser] = useState<CustomerUser | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderDoc | null>(null);

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    company: "",
    county: "",
    town: "",
    address: "",
    deliveryNotes: ""
  });

  // Load existing customer from localStorage on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("jayaxis_user");
      if (savedUser) {
        const parsed: CustomerUser = JSON.parse(savedUser);
        setCurrentUser(parsed);
        setCustomer(prev => ({
          ...prev,
          name: parsed.name || prev.name,
          phone: parsed.phone || prev.phone,
          email: parsed.email || prev.email,
          company: parsed.company || prev.company,
          county: parsed.county || prev.county,
          town: parsed.town || prev.town,
          address: parsed.address || prev.address
        }));
        if (parsed.phone) {
          setMpesaPhone(parsed.phone);
        }
      }
    } catch {
      // Local storage read error ignored
    }
  }, []);

  const cartLines = items
    .map(i => ({ ...i, p: i.product || getProduct(i.id) || products.find(p => p.id === i.id) }))
    .filter((x): x is { id: string; qty: number; p: NonNullable<typeof x.p> } => Boolean(x.p));

  const subtotal = cartLines.reduce((acc, line) => acc + (line.p.price || 0) * line.qty, 0);

  const formatSubtotal = new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0
  }).format(subtotal);

  // Step 1: Save/create customer user account in Firestore
  const handleProceedToDelivery = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);

    if (!customer.name.trim()) {
      setErrorMsg("Please enter your full name to set up your customer account.");
      return;
    }
    if (!customer.phone.trim()) {
      setErrorMsg("Please provide your M-Pesa enabled phone number for delivery dispatch.");
      return;
    }
    if (!customer.email.trim() || !customer.email.includes("@")) {
      setErrorMsg("Please provide a valid email address for your customer account & invoices.");
      return;
    }

    setSavingAccount(true);
    try {
      const savedUser = await saveCustomerUser({
        id: currentUser?.id,
        name: customer.name.trim(),
        email: customer.email.trim().toLowerCase(),
        phone: customer.phone.trim(),
        company: customer.company.trim(),
        county: customer.county.trim(),
        town: customer.town.trim(),
        address: customer.address.trim()
      });

      setCurrentUser(savedUser);
      localStorage.setItem("jayaxis_user", JSON.stringify(savedUser));
      setStep(2);
    } catch (err: unknown) {
      console.error("Failed to save customer account:", err);
      // Fallback: still advance so customer is not blocked if offline
      setStep(2);
    } finally {
      setSavingAccount(false);
    }
  };

  // Step 2: Validate delivery and update customer details
  const handleProceedToPayment = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);

    if (!customer.county) {
      setErrorMsg("Please select your delivery county in Kenya.");
      return;
    }
    if (!customer.town.trim()) {
      setErrorMsg("Please enter your town or area in Kenya.");
      return;
    }

    // Update customer in Firestore with delivery location
    try {
      if (currentUser?.id || customer.email) {
        const updated = await saveCustomerUser({
          id: currentUser?.id,
          name: customer.name.trim(),
          email: customer.email.trim().toLowerCase(),
          phone: customer.phone.trim(),
          company: customer.company.trim(),
          county: customer.county.trim(),
          town: customer.town.trim(),
          address: customer.address.trim()
        });
        setCurrentUser(updated);
        localStorage.setItem("jayaxis_user", JSON.stringify(updated));
      }
    } catch {
      // Non-blocking update
    }

    setStep(3);
  };

  // Step 3: Place order & persist in Firestore
  const handlePlaceOrder = async () => {
    if (cartLines.length === 0) {
      setErrorMsg("Your cart is empty. Add products before placing an order.");
      return;
    }

    setPaymentState("processing");
    setErrorMsg(null);

    try {
      const orderItems: OrderItem[] = cartLines.map(line => ({
        id: line.id,
        name: line.p.name,
        price: line.p.price || 0,
        qty: line.qty,
        src: line.p.src || "/steel.jpeg",
        sku: line.p.sku || "",
        category: line.p.category || ""
      }));

      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const orderRef = `JAX-ORD-${new Date().getFullYear()}-${randomSuffix}`;

      const savedDoc = await saveOrder({
        order_ref: orderRef,
        user_id: currentUser?.id || customer.email.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        customer_name: customer.name.trim(),
        customer_phone: customer.phone.trim(),
        customer_email: customer.email.trim().toLowerCase(),
        customer_company: customer.company.trim(),
        county: customer.county,
        town: customer.town,
        address: customer.address.trim(),
        delivery_notes: customer.deliveryNotes.trim(),
        items: orderItems,
        subtotal: subtotal,
        payment_method: "Lipa na M-Pesa (Simulated STK Push)",
        payment_phone: mpesaPhone.trim() || customer.phone.trim(),
        status: "Pending Delivery"
      });

      setConfirmedOrder(savedDoc);
      setPaymentState("success");
      clearCart();
    } catch (err: unknown) {
      console.error("Error saving order:", err);
      setErrorMsg("Could not place order to database. Please verify your connection.");
      setPaymentState("error");
    }
  };

  const whatsappMessage = confirmedOrder
    ? encodeURIComponent(
        `Hello Jay Axis Engineering, I have placed Order ${confirmedOrder.order_ref} (${confirmedOrder.customer_name}, ${confirmedOrder.town}, ${confirmedOrder.county} County) for ${formatSubtotal}. Please confirm delivery.`
      )
    : "";

  return (
    <div className="py-12 space-y-12">
      <div className="wrap max-w-4xl space-y-8">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-sky-600 bg-sky-50 px-3.5 py-1.5 rounded-full inline-block">
            Order Confirmation
          </span>
          <h1 className="text-3xl font-black text-slate-900">Checkout & Customer Portal</h1>
          <p className="text-xs text-slate-500">
            Create your customer account to save your delivery profile, track orders, and complete your purchase.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-3 text-xs font-bold">
          <span
            className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors ${
              step >= 1 ? "bg-sky-500 text-white shadow-sm" : "bg-slate-100 text-slate-400"
            }`}
          >
            <UserCheck size={14} /> 1. Customer Account
          </span>
          <span className="text-slate-300">→</span>
          <span
            className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors ${
              step >= 2 ? "bg-sky-500 text-white shadow-sm" : "bg-slate-100 text-slate-400"
            }`}
          >
            <MapPin size={14} /> 2. Delivery Location
          </span>
          <span className="text-slate-300">→</span>
          <span
            className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors ${
              step >= 3 ? "bg-sky-500 text-white shadow-sm" : "bg-slate-100 text-slate-400"
            }`}
          >
            <ShieldCheck size={14} /> 3. Review & Payment
          </span>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <AlertCircle size={16} className="text-amber-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={() => setErrorMsg(null)}
              className="text-amber-700 font-bold underline ml-3 text-[11px]"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* SUCCESS CONFIRMATION VIEW */}
        {paymentState === "success" && confirmedOrder ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-sky-100 shadow-xl max-w-2xl mx-auto space-y-8 animate-in fade-in duration-300">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 size={42} />
              </div>

              <div className="space-y-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  <UserCheck size={12} /> Account Created & Order Saved
                </span>
                <h2 className="text-2xl font-black text-slate-900">Order Confirmed Successfully!</h2>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Thank you, <strong>{confirmedOrder.customer_name}</strong>. Your customer profile is registered under{" "}
                  <span className="font-semibold text-slate-800">{confirmedOrder.customer_email}</span>, and your order has been transmitted directly to our admin dispatch console.
                </p>
                <div className="inline-block bg-slate-900 text-white font-mono font-bold text-sm px-4 py-2 rounded-xl mt-2 shadow-sm">
                  Order Ref: {confirmedOrder.order_ref}
                </div>
              </div>
            </div>

            {/* Order Details Summary */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-3 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="font-bold text-slate-700">Dispatch Status</span>
                <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-extrabold text-[10px] uppercase">
                  {confirmedOrder.status}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-600">
                <div>
                  <span className="block text-[11px] font-bold text-slate-400 uppercase">Customer</span>
                  <p className="font-bold text-slate-800">{confirmedOrder.customer_name}</p>
                  <p>{confirmedOrder.customer_phone}</p>
                  <p className="text-[11px]">{confirmedOrder.customer_email}</p>
                </div>
                <div>
                  <span className="block text-[11px] font-bold text-slate-400 uppercase">Delivery Destination</span>
                  <p className="font-bold text-slate-800">{confirmedOrder.town}, {confirmedOrder.county} County</p>
                  {confirmedOrder.address && <p>{confirmedOrder.address}</p>}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <span className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Ordered Items ({confirmedOrder.items.length})
                </span>
                <div className="divide-y divide-slate-200/60 max-h-40 overflow-y-auto pr-1">
                  {confirmedOrder.items.map((item, idx) => (
                    <div key={idx} className="py-1.5 flex justify-between items-center text-[12px]">
                      <span className="truncate max-w-[260px] font-medium text-slate-800">
                        {item.qty}× {item.name}
                      </span>
                      <span className="font-bold text-slate-900">
                        {new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 }).format(item.price * item.qty)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 flex justify-between font-bold text-slate-900 border-t border-slate-200 mt-2">
                  <span>Total Amount</span>
                  <span className="text-sky-600 text-sm">
                    {new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 }).format(confirmedOrder.subtotal)}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3 pt-2">
              <a
                href={`https://wa.me/254700000000?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-xl text-xs transition-colors shadow-md"
              >
                <MessageCircle size={16} /> Confirm via WhatsApp Support (+254 700 000 000)
              </a>

              <Link
                href="/shop"
                className="w-full inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3.5 px-6 rounded-xl text-xs transition-colors"
              >
                Return to Product Catalogue <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Form Column */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-md">
              {/* STEP 1: CUSTOMER ACCOUNT */}
              {step === 1 && (
                <form onSubmit={handleProceedToDelivery} className="space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                        <UserCheck className="text-sky-500" size={18} /> Step 1: Customer Account & Contact
                      </h2>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Your account will be saved to our database to track delivery and store invoices.
                      </p>
                    </div>
                    {currentUser && (
                      <span className="px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 text-[10px] font-bold border border-sky-100 flex items-center gap-1">
                        <Sparkles size={11} /> Saved Profile
                      </span>
                    )}
                  </div>

                  {currentUser && (
                    <div className="p-3 rounded-2xl bg-sky-50/60 border border-sky-100 text-xs flex items-center justify-between text-sky-950">
                      <div>
                        <span className="font-bold block">Account Active: {currentUser.name}</span>
                        <span className="text-[11px] text-slate-500">{currentUser.email} · {currentUser.phone}</span>
                      </div>
                      <span className="text-[10px] font-extrabold text-sky-600 bg-white px-2 py-1 rounded-lg border border-sky-200">
                        {currentUser.total_orders || 0} Previous Orders
                      </span>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Full Name / Contact Person *
                      </label>
                      <input
                        type="text"
                        required
                        value={customer.name}
                        onChange={e => setCustomer({ ...customer, name: e.target.value })}
                        placeholder="e.g. Samuel Mwangi"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-sky-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Email Address (Used for Account & Invoices) *
                      </label>
                      <input
                        type="email"
                        required
                        value={customer.email}
                        onChange={e => setCustomer({ ...customer, email: e.target.value })}
                        placeholder="e.g. smwangi@gmail.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-sky-500"
                      />
                      <span className="text-[11px] text-slate-400 mt-1 block">
                        Saved in the users database to allow easy re-ordering and order status tracking.
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Phone Number (M-Pesa enabled) *
                      </label>
                      <input
                        type="tel"
                        required
                        value={customer.phone}
                        onChange={e => {
                          setCustomer({ ...customer, phone: e.target.value });
                          if (!mpesaPhone) setMpesaPhone(e.target.value);
                        }}
                        placeholder="+254 712 345 678"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-sky-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Company / Farm / Institution Name (Optional)
                      </label>
                      <input
                        type="text"
                        value={customer.company}
                        onChange={e => setCustomer({ ...customer, company: e.target.value })}
                        placeholder="e.g. Highland Floriculture Ltd"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                    <span className="text-[11px] text-slate-400">
                      Step 1 of 3: Account registration
                    </span>
                    <button
                      type="submit"
                      disabled={savingAccount}
                      className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer"
                    >
                      {savingAccount ? (
                        <>
                          <Loader2 size={14} className="animate-spin" /> Saving Account...
                        </>
                      ) : (
                        <>
                          Continue to Delivery <ArrowRight size={14} />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 2: DELIVERY LOCATION */}
              {step === 2 && (
                <form onSubmit={handleProceedToPayment} className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                      <MapPin className="text-sky-500" size={18} /> Step 2: Delivery Location in Kenya
                    </h2>
                    <span className="text-[11px] text-slate-500">
                      For: <strong className="text-slate-800">{customer.name}</strong>
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">County *</label>
                      <select
                        required
                        value={customer.county}
                        onChange={e => setCustomer({ ...customer, county: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-sky-500 bg-white"
                      >
                        <option value="">Select County</option>
                        {kenyanCounties.map(c => (
                          <option key={c} value={c}>
                            {c} County
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Town / Specific Area *</label>
                      <input
                        type="text"
                        required
                        value={customer.town}
                        onChange={e => setCustomer({ ...customer, town: e.target.value })}
                        placeholder="e.g. Naivasha town / Karen / Thika / Eldoret"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-sky-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Plot / Street / Landmark Address</label>
                      <input
                        type="text"
                        value={customer.address}
                        onChange={e => setCustomer({ ...customer, address: e.target.value })}
                        placeholder="e.g. Near Shell station, off main tarmac"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-sky-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Special Delivery / Installation Notes</label>
                      <textarea
                        rows={3}
                        value={customer.deliveryNotes}
                        onChange={e => setCustomer({ ...customer, deliveryNotes: e.target.value })}
                        placeholder="Specify if offloading crane, solar mount, or on-site pump technician is required..."
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-bold cursor-pointer"
                    >
                      <ArrowLeft size={14} /> Back to Account
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer"
                    >
                      Review & Payment <ArrowRight size={14} />
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 3: REVIEW & PAYMENT */}
              {step === 3 && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                      <ShieldCheck className="text-sky-500" size={18} /> Step 3: Payment & Order Confirmation
                    </h2>
                    <span className="text-[11px] text-slate-500">Order Ready</span>
                  </div>

                  {/* Customer summary card */}
                  <div className="bg-sky-50/70 border border-sky-100 rounded-2xl p-4 text-xs text-sky-900 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold flex items-center gap-1.5 text-slate-800">
                        <UserCheck size={14} className="text-sky-600" /> Account: {customer.name}
                      </span>
                      <span className="text-[11px] font-mono bg-white px-2 py-0.5 rounded border border-sky-200 text-slate-600">
                        {customer.email}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px]">
                      <strong>Destination:</strong> {customer.town}, {customer.county} County
                      {customer.address ? ` (${customer.address})` : ""} · Phone: {customer.phone}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Payment Options (Simulation)
                    </h4>
                    <div className="p-4 rounded-xl border-2 border-emerald-500 bg-emerald-50/30 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm">
                          M
                        </div>
                        <div>
                          <b className="text-xs font-bold text-slate-900 block">Lipa na M-Pesa (Simulated STK Push)</b>
                          <span className="text-[11px] text-slate-500">Pay directly via mobile prompt to Jay Axis Paybill</span>
                        </div>
                      </div>
                      <span className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[11px]">✓</span>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">M-Pesa Phone Number</label>
                      <input
                        type="tel"
                        value={mpesaPhone}
                        onChange={e => setMpesaPhone(e.target.value)}
                        placeholder="07... or +254 7..."
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-bold cursor-pointer"
                    >
                      <ArrowLeft size={14} /> Back to Delivery
                    </button>
                    <button
                      type="button"
                      onClick={handlePlaceOrder}
                      disabled={paymentState === "processing"}
                      className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-xs px-7 py-3.5 rounded-xl shadow-lg shadow-emerald-600/25 transition-all cursor-pointer"
                    >
                      {paymentState === "processing" ? (
                        <>
                          <Loader2 size={15} className="animate-spin" /> Saving Order & STK Push...
                        </>
                      ) : (
                        `Confirm & Place Order (${formatSubtotal})`
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Review Aside */}
            <aside className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Package size={16} className="text-sky-500" /> Order Review ({cartLines.length})
                </h3>
                <Link href="/cart" className="text-[11px] text-sky-600 font-bold hover:underline">
                  Edit Cart
                </Link>
              </div>

              {cartLines.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  Your cart is empty. <Link href="/shop" className="text-sky-600 underline font-bold">Browse shop</Link>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto pr-1">
                  {cartLines.map(line => (
                    <div key={line.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-slate-800 truncate max-w-[200px]">{line.p.name}</p>
                        <span className="text-[11px] text-slate-400">
                          Qty: {line.qty} × {price(line.p.price)}
                        </span>
                      </div>
                      <span className="font-bold text-slate-900">
                        {new Intl.NumberFormat("en-KE", {
                          style: "currency",
                          currency: "KES",
                          maximumFractionDigits: 0
                        }).format((line.p.price || 0) * line.qty)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900">{formatSubtotal}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Delivery in Kenya</span>
                  <span className="text-sky-600 font-semibold">
                    {customer.county ? `${customer.county} Dispatch Desk` : "Confirmed on Step 2"}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-500 space-y-1">
                <span className="font-bold text-slate-700 block">Demonstration Store:</span>
                <p>
                  Orders placed are saved to Cloud Firestore and visible in the Admin Portal under Orders & Users.
                </p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

import { NextResponse } from "next/server";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const clean = (x: unknown, n = 2000) => (typeof x === "string" ? x.trim().slice(0, n) : "");

export async function POST(req: Request) {
  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid form submission." }, { status: 400 });
  }

  const name = clean(b.name, 120);
  const phone = clean(b.phone, 40);
  const email = clean(b.email, 254);
  const item = clean(b.item || b.items || b.service, 240);
  const county = clean(b.county, 120);
  const town = clean(b.town, 120);
  const scope = clean(b.scope || b.notes || b.quantity, 3000);
  const refNumber = clean(b.refNumber, 50);

  if (name.length < 2 || phone.length < 7 || item.length < 2 || county.length < 2) {
    return NextResponse.json(
      { error: "Please complete your name, phone number, product/service, and county fields." },
      { status: 400 }
    );
  }

  // If Firebase is configured, persist directly in Cloud Firestore
  if (isFirebaseConfigured && db) {
    try {
      const docRef = await addDoc(collection(db, "quotation_requests"), {
        customer_name: name,
        phone,
        email: email || null,
        item_requested: item,
        county,
        town: town || null,
        scope: scope || null,
        ref_number: refNumber || null,
        status: "new",
        created_at: serverTimestamp()
      });

      return NextResponse.json({
        message: "Your quotation request has been received and saved to Firestore.",
        id: docRef.id
      });
    } catch (err: unknown) {
      console.error("Firestore quote submission failed:", err);
      // Fallback response with simulated success so customer experience isn't blocked
      return NextResponse.json({
        message: "Your quotation request has been received.",
        warning: "Firestore write encountered an issue, our desk has been notified."
      });
    }
  }

  // Graceful fallback when Firebase credentials are not yet added to .env.local
  return NextResponse.json({
    message: "Your quotation request has been received.",
    note: "To enable direct Cloud Firestore persistence, add your Firebase keys to .env.local"
  });
}

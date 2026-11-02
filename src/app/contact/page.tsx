"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone, Mail, MessageCircle, MapPin, Clock, Send, CheckCircle2, ArrowRight } from "lucide-react";

const faqs = [
  {
    q: "Do you supply and install equipment across all 47 counties in Kenya?",
    a: "Yes. Jayaxis mobilizes technical teams, drilling rigs, and delivery trucks throughout Kenya—from Nairobi, Kiambu, and Nakuru to Turkana, Garissa, and Kilifi."
  },
  {
    q: "Can my existing electric or diesel pump be converted to solar?",
    a: "In most cases, yes. We install high-efficiency Solar Pump Inverters (VFDs) that power your existing 3-phase AC submersible or booster pump directly from solar PV panels, with automatic generator or grid backup options."
  },
  {
    q: "What is required before drilling a borehole in Kenya?",
    a: "Under Water Resources Authority (WRA) regulations, a hydrogeological survey conducted by a registered hydrogeologist is required first, followed by a WRA drilling permit and NEMA environmental authorization."
  },
  {
    q: "What sizes of elevated steel water towers and tanks do you fabricate?",
    a: "We fabricate modular elevated steel water towers from 6m to 24m high, supporting pressed steel sectional tanks ranging from 10,000 litres to over 100,000 litres capacity, complete with internal ladders and safety cages."
  }
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="py-16 space-y-20">
      {/* Header */}
      <section className="wrap max-w-3xl mx-auto text-center space-y-4">
        <span className="text-xs font-black uppercase tracking-widest text-sky-600 bg-sky-50 px-3.5 py-1.5 rounded-full inline-block">
          Direct Contact Desk
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Let&apos;s Start a Conversation
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Have questions about equipment specifications, borehole equipping, solar works, or structural steel towers? Our engineering team is ready to assist.
        </p>
      </section>

      {/* Contact Cards Grid */}
      <section className="wrap">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
              <Phone size={20} />
            </div>
            <h3 className="text-sm font-extrabold text-slate-900">Phone Support</h3>
            <p className="text-xs text-slate-500">Direct engineering line</p>
            <a href="tel:+254710747090" className="text-xs font-bold text-sky-600 hover:text-sky-800 block">
              (+254) 710 747 090
            </a>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <MessageCircle size={20} />
            </div>
            <h3 className="text-sm font-extrabold text-slate-900">WhatsApp Desk</h3>
            <p className="text-xs text-slate-500">Fast response & PDF quotes</p>
            <a
              href="https://wa.me/254710747090"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-emerald-600 hover:text-emerald-800 block"
            >
              Chat on WhatsApp
            </a>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
              <Mail size={20} />
            </div>
            <h3 className="text-sm font-extrabold text-slate-900">Official Email</h3>
            <p className="text-xs text-slate-500">Tenders & project scopes</p>
            <a href="mailto:jayaxiscompany@gmail.com" className="text-xs font-bold text-sky-600 hover:text-sky-800 block">
              jayaxiscompany@gmail.com
            </a>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
              <Clock size={20} />
            </div>
            <h3 className="text-sm font-extrabold text-slate-900">Business Hours</h3>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Mon - Fri: 8:00 AM – 5:00 PM<br />
              Saturday: 8:30 AM – 1:00 PM
            </p>
          </div>
        </div>
      </section>

      {/* Main Interactive Form & Location Section */}
      <section className="wrap grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-10 shadow-lg">
          <div className="mb-6">
            <h2 className="text-xl font-extrabold text-slate-900">Send an Inquiry to Our Desk</h2>
            <p className="text-xs text-slate-500 mt-1">
              Leave your contact details and message below. We typically respond within 2 to 4 business hours.
            </p>
          </div>

          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Message Sent Successfully</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Thank you for contacting Jayaxis Company Ltd. A representative will get in touch with you shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs text-sky-600 hover:text-sky-800 font-bold"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+254..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Project County / Town</label>
                  <input
                    type="text"
                    placeholder="e.g. Nairobi, Kiambu, Machakos"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Message or Requirements *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe your equipment question, borehole specifications, or project location..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-sky-500"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all"
              >
                Send Message <Send size={14} />
              </button>
            </form>
          )}
        </div>

        {/* Right: Office Location & Coverage Area */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 text-white rounded-3xl p-8 space-y-4">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-400">
              Operations Center
            </span>
            <h3 className="text-xl font-black text-white">Kakamega Headquarters</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Our central engineering offices and fabrication yard coordinate borehole exploration rigs, equipment distribution, and technical teams across Kenya.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-sky-300">
              <MapPin size={16} />
              <span>Commercial District, Kakamega, Kenya</span>
            </div>
          </div>

          {/* Quick Quote Prompt Card */}
          <div className="bg-sky-50 border border-sky-100 rounded-3xl p-6 space-y-3">
            <h4 className="text-sm font-extrabold text-slate-900">Have a formal bill of quantities or equipment list?</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Use our interactive quotation portal to submit equipment lists and receive a comprehensive price proposal.
            </p>
            <Link
              href="/quote"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-800"
            >
              Open Quotation Portal <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="wrap max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-sky-600">
            Frequently Asked Questions
          </span>
          <h2 className="text-2xl font-black text-slate-900">Common Inquiries</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-2 cursor-pointer"
              onClick={() => setActiveFaq(activeFaq === i ? null : i)}
            >
              <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center justify-between">
                <span>{faq.q}</span>
                <span className="text-sky-500 font-bold ml-2">{activeFaq === i ? "−" : "+"}</span>
              </h4>
              {activeFaq === i && (
                <p className="text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

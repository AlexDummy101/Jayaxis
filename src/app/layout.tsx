import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Navbar, Footer } from "@/components/Site";
import { WaterTapBackground } from "@/components/WaterTapBackground";

export const metadata: Metadata = {
  title: {
    default: "Jayaxis Company Ltd | Water Infrastructure, Steel Towers & Engineering Supplies",
    template: "%s | Jayaxis Company Ltd"
  },
  description:
    "Jayaxis Company Ltd delivers borehole drilling, equipping, elevated steel water storage towers, solar pumping systems, civil infrastructure, and certified equipment throughout Kenya.",
  keywords: [
    "Jayaxis Company Ltd",
    "Borehole drilling Kenya",
    "Borehole equipping Nairobi",
    "Steel water towers",
    "Solar PV Systems",
    "Civil engineering contractors Kenya"
  ],
  authors: [{ name: "Jayaxis Company Ltd" }],
  icons: {
    icon: [
      { url: "/logo.jpeg" },
      { url: "/logo.jpeg", type: "image/jpeg" }
    ],
    shortcut: "/logo.jpeg",
    apple: "/logo.jpeg"
  },
  openGraph: {
    title: "Jayaxis Company Ltd | Water Infrastructure & Engineering Equipment",
    description: "Certified engineering services, borehole equipping, steel water towers, and solar pumping across Kenya.",
    url: "https://jayaxis.co.ke",
    siteName: "Jayaxis Company Ltd",
    locale: "en_KE",
    type: "website"
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col bg-white text-slate-800 relative overflow-x-hidden">
        <Providers>
          <WaterTapBackground />
          <Navbar />
          <main className="flex-1 relative z-10">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter, Playfair_Display, Source_Serif_4 } from "next/font/google";
import "./globals.css";

/* ----------------------------------------------------------------------------
   EDITORIAL TYPOGRAPHY SYSTEM
   - Playfair Display: Elegant serif for headlines and display text
   - Source Serif 4: Refined serif for body copy and long-form reading
   - Inter: Clean sans-serif for UI elements and navigation
   ---------------------------------------------------------------------------- */

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Longview | Context is Everything",
  description: "Long-form interviews with scientists, technologists, and thinkers shaping our future. The Last Invention, Reflector, and more. Listen on Spotify, Apple Podcasts, and YouTube.",
  keywords: ["podcast", "interviews", "science", "technology", "The Last Invention", "Reflector", "long-form"],
  openGraph: {
    title: "Longview | Context is Everything",
    description: "Long-form interviews with scientists, technologists, and thinkers shaping our future.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${sourceSerif.variable}`}>
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}

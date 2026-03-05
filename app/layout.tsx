import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Primordial Soup -- Computational Life Simulator",
  description:
    "Watch self-replicating programs emerge from random noise. A web-based simulation of the Computational Life paper where random BFF programs interact in a primordial soup and spontaneously give rise to digital organisms.",
  keywords: [
    "primordial soup",
    "computational life",
    "artificial life",
    "alife",
    "self-replication",
    "BFF",
    "brainfuck",
    "cellular automata",
    "emergence",
    "simulation",
    "digital evolution",
    "artificial chemistry",
  ],
  authors: [{ name: "Primordial Soup Simulator" }],
  openGraph: {
    title: "Primordial Soup -- Computational Life Simulator",
    description:
      "Watch self-replicating programs emerge from random noise. 131,072 random BFF programs interact, mutate, and evolve in a digital primordial soup.",
    type: "website",
    siteName: "Primordial Soup",
  },
  twitter: {
    card: "summary_large_image",
    title: "Primordial Soup -- Computational Life Simulator",
    description:
      "Watch self-replicating programs emerge from random noise. A live simulation of digital evolution.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

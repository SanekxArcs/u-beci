import type { Metadata } from "next";
import {  Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner';
import { SanityLive } from '@/sanity/lib/live'
import { ThemeProvider } from './../components/theme-provider';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Bar u Beci - Home Food Cafe",
  description: "Tasty home-cooked meals at Bar u Beci",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={`${inter.variable} ${playfair.variable} font-sans min-h-screen h-screen`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          // disableTransitionOnChange
        >
          <Header />
          {children}
          <Footer />
          <SanityLive />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

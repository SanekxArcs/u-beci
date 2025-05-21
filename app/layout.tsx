import type { Metadata } from "next";
import {  Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner';
import { SanityLive } from '@/sanity/lib/live'
import { ThemeProvider } from './../components/theme-provider';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { sanityFetch } from '../sanity/lib/live'
import { INFO_QUERY } from '../sanity/lib/queries'
import { INFO_QUERYResult } from '@/sanity/types'

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Bar u Beci - Home Food Cafe",
  description: "Tasty home-cooked meals at Bar u Beci",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const infoResult = await sanityFetch({ query: INFO_QUERY });
  const info: INFO_QUERYResult =
    infoResult && "data" in infoResult ? infoResult.data : infoResult;
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
          <Header info={info} />
          {children}
          <Footer info={info} />
          <SanityLive />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

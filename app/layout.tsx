
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from '@/components/Footer';

import Navbar from "@/components/Navbar"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Portfolio 101",
  description: "A portfolio showcasing my skills and projects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* 🚀 Apply the new custom gradient-bg class here */}
      <body className={`gradient-bg text-gray-100 ${inter.className}`}>
        <Navbar />
        <main>{children}</main>
        
      </body>
      <Footer />
      
    </html>
  );
}
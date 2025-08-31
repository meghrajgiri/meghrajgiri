import Footer from "@/components/Layout/Footer";
import Navbar from "@/components/Layout/Navbar";
import ThemeProvider from "@/providers/ThemeProvider";
import type { Metadata } from "next";
import { Onest } from "next/font/google";
import "./globals.css";

const onestFont = Onest({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Meghraj Giri - Full Stack Developer",
  description: "Full Stack Developer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${onestFont.className} bg-background antialiased`}>
        <div className="bg-white absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <ThemeProvider>
          <Navbar />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

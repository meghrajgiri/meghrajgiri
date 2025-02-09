import type { Metadata } from "next";
import { Onest } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Layout/Navbar";
import ThemeProvider from "@/providers/ThemeProvider";
import Footer from "@/components/Layout/Footer";

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
        <ThemeProvider>
          <Navbar />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

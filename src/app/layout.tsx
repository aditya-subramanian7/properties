import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PropertiesProvider } from "@/contexts/PropertiesContext";
import { SearchProvider } from "@/contexts/SearchContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KendalAIssignment",
  description: "Kendal AI's assignment submission.",
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
        <PropertiesProvider>
          <SearchProvider>{children}</SearchProvider>
        </PropertiesProvider>
      </body>
    </html>
  );
}

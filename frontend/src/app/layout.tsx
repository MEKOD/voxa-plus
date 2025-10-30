import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // 🔥 Bu satır en önemlisi!

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VOXA",
  description: "Anında Görüntülü Görüşme Odaları",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
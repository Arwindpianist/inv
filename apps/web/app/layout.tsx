import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@mycelium-inv/styles/src/globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "INV.MyceliumLink - Inventory Management",
  description: "Multi-tenant inventory management system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}


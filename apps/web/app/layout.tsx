import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@mycelium-inv/styles/src/globals.css";
import { Providers } from "./providers";
import { cn } from "@mycelium-inv/ui";

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
      <body className={cn(inter.className, "bg-background text-foreground min-h-screen antialiased")}>
        <Providers>
          <div className="min-h-screen">{children}</div>
        </Providers>
      </body>
    </html>
  );
}


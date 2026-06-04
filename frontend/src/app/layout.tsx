import type { Metadata } from "next";
import { StoreShell } from "@/components/StoreShell";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "ElectroFit — Electrical Accessories",
  description: "Professional electrical accessories catalog",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthProvider>
          <CartProvider>
            <StoreShell>{children}</StoreShell>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

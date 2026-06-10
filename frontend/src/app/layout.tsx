import type { Metadata } from "next";
import { AppToaster } from "@/components/ui/AppToaster";
import { StoreShell } from "@/components/StoreShell";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "ElectroFit — Електроаксесуари",
  description: "Каталог професійних електроаксесуарів",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk" className="font-sans antialiased" suppressHydrationWarning>
      <body className="min-h-screen bg-surface text-ink" suppressHydrationWarning>
        <AuthProvider>
          <CartProvider>
            <StoreShell>{children}</StoreShell>
            <AppToaster />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

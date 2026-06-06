import { ApiStatusBanner } from "@/components/ApiStatusBanner";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <ApiStatusBanner />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

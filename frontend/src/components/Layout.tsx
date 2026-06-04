import { Navbar } from "@/components/Navbar";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-muted sm:px-6 lg:px-8">
          ElectroFit — professional-grade electrical accessories
        </div>
      </footer>
    </div>
  );
}

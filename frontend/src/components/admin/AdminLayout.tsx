"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/admin", label: "Панель управління", exact: true },
  { href: "/admin/products", label: "Керування товарами" },
  { href: "/admin/inquiries", label: "Звернення клієнтів" },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      {mobileMenuOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm md:hidden"
          aria-label="Закрити меню"
          onClick={closeMobileMenu}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col border-r border-slate-800 bg-slate-900 transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full pointer-events-none md:pointer-events-auto"
        }`}
      >
        <div className="flex items-start justify-between border-b border-slate-800 px-5 py-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-400">
              ElectroFit
            </p>
            <h1 className="mt-1 text-lg font-bold text-white">Панель адміністратора</h1>
          </div>
          <button
            type="button"
            onClick={closeMobileMenu}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-white md:hidden"
            aria-label="Закрити меню"
          >
            ✕
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {navItems.map((item) => {
            const active =
              item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobileMenu}
                className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-amber-500/20 text-amber-300"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-800 p-4">
          <Link
            href="/"
            onClick={closeMobileMenu}
            className="inline-flex w-full items-center justify-center rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:border-slate-600 hover:bg-slate-800 hover:text-white"
          >
            ← Назад до магазину
          </Link>
        </div>
      </aside>

      <div className="flex w-full min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-800 bg-slate-900/95 px-4 py-3 backdrop-blur md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="rounded-lg p-2 text-slate-300 transition hover:bg-slate-800 hover:text-white"
            aria-label="Відкрити меню"
            aria-expanded={mobileMenuOpen}
          >
            <span className="text-xl leading-none" aria-hidden>
              ☰
            </span>
          </button>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold uppercase tracking-widest text-amber-400">
              ElectroFit
            </p>
            <p className="truncate text-sm font-bold text-white">Панель адміністратора</p>
          </div>
        </header>

        <header className="hidden border-b border-slate-800 bg-slate-900/80 px-8 py-4 backdrop-blur md:block">
          <p className="text-sm text-slate-400">Адміністрування магазину</p>
        </header>

        <main className="w-full flex-1 overflow-auto p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}

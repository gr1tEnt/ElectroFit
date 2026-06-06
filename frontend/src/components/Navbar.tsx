"use client";

import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

const navLinks = [
  { href: "/catalog", label: "Professionals" },
  { href: "/configurator", label: "Configurator" },
  { href: "/smart-select", label: "Smart Select" },
  { href: "/support", label: "Support" },
];

export function Navbar() {
  const { itemCount, subtotal } = useCart();
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
            EF
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-tight text-ink">ElectroFit</p>
            <p className="text-xs text-muted">Electrical accessories</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-brand-50 hover:text-brand-700"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {isAuthenticated ? (
            <>
              <Link
                href="/profile"
                className="hidden rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-brand-50 hover:text-brand-700 sm:inline-flex"
              >
                {user?.fullName.split(" ")[0] ?? "Profile"}
              </Link>
              <button
                type="button"
                onClick={logout}
                className="hidden rounded-lg border border-border px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 sm:inline-flex"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-brand-50 hover:text-brand-700"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="hidden rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-ink hover:bg-slate-200 sm:inline-flex"
              >
                Register
              </Link>
            </>
          )}
          <Link
            href="/cart"
            className="relative rounded-lg border border-border px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cart
            {itemCount > 0 && (
              <span className="ml-1.5 inline-flex min-w-[1.25rem] justify-center rounded-full bg-brand-600 px-1.5 py-0.5 text-xs font-bold text-white">
                {itemCount}
              </span>
            )}
          </Link>
          {itemCount > 0 && (
            <Link
              href="/checkout"
              className="hidden rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 sm:inline-flex"
            >
              Checkout · €{subtotal.toFixed(2)}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

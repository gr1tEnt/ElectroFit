"use client";

import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useCompare } from "@/context/CompareContext";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const navLinks = [
  { href: "/catalog", label: "Професіоналам" },
  { href: "/configurator", label: "Конфігуратор рамок" },
  { href: "/smart-select", label: "Розумний підбір" },
  { href: "/support", label: "Підтримка" },
];

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M6 6l12 12" />
      <path d="M18 6L6 18" />
    </svg>
  );
}

function CompareIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M7 16l-4-4 4-4" />
      <path d="M3 12h11" />
      <path d="M17 8l4 4-4 4" />
      <path d="M21 12H10" />
    </svg>
  );
}

function CartIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function CountBadge({ count }: { count: number }) {
  if (count <= 0) return null;

  return (
    <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold leading-none text-white">
      {count > 99 ? "99+" : count}
    </span>
  );
}

function ProfileMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const firstName = user?.fullName.split(" ")[0] ?? "Профіль";

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="relative inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-slate-100 hover:text-brand-600"
        aria-label="Профіль"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <UserIcon className="h-6 w-6" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-lg border border-border bg-white py-1 shadow-lg"
        >
          <div className="border-b border-border px-4 py-2.5">
            <p className="truncate text-sm font-semibold text-ink">{user?.fullName}</p>
            <p className="truncate text-xs text-muted">{user?.email}</p>
          </div>
          <Link
            href="/profile"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:text-brand-600"
          >
            {firstName} · Профіль
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              logout();
            }}
            className="block w-full px-4 py-2.5 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:text-red-600"
          >
            Вийти
          </button>
        </div>
      )}
    </div>
  );
}

export function Navbar() {
  const { itemCount } = useCart();
  const { count: compareCount } = useCompare();
  const { isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setMobileMenuOpen(false);
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:h-16 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 hover:text-brand-600 md:hidden"
            aria-label={mobileMenuOpen ? "Закрити меню" : "Відкрити меню"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>

          <Link href="/" className="flex min-w-0 shrink-0 items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
              EF
            </span>
            <div className="min-w-0 leading-tight">
              <p className="truncate text-sm font-semibold tracking-tight text-ink sm:text-base">ElectroFit</p>
              <p className="hidden text-xs text-muted sm:block">Електроаксесуари</p>
            </div>
          </Link>
        </div>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-4 lg:gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 underline-offset-4 transition-colors hover:text-brand-600 hover:underline"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-0.5 sm:gap-2">
          {!isAuthenticated && (
            <>
              <Link
                href="/login"
                className="hidden min-h-11 items-center text-sm font-medium text-slate-600 underline-offset-4 transition-colors hover:text-brand-600 hover:underline sm:inline-flex"
              >
                Увійти
              </Link>
              <Link
                href="/register"
                className="hidden min-h-11 items-center text-sm font-medium text-slate-600 underline-offset-4 transition-colors hover:text-brand-600 hover:underline md:inline-flex"
              >
                Реєстрація
              </Link>
            </>
          )}

          <Link
            href="/compare"
            className="relative inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-slate-100 hover:text-brand-600"
            aria-label={`Порівняння${compareCount > 0 ? `, ${compareCount} товарів` : ""}`}
          >
            <CompareIcon className="h-6 w-6" />
            <CountBadge count={compareCount} />
          </Link>

          <Link
            href="/cart"
            className="relative inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-slate-100 hover:text-brand-600"
            aria-label={`Кошик${itemCount > 0 ? `, ${itemCount} товарів` : ""}`}
          >
            <CartIcon className="h-6 w-6" />
            <CountBadge count={itemCount} />
          </Link>

          {isAuthenticated ? (
            <ProfileMenu />
          ) : (
            <Link
              href="/login"
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-slate-100 hover:text-brand-600 md:hidden"
              aria-label="Увійти"
            >
              <UserIcon className="h-6 w-6" />
            </Link>
          )}
        </div>
      </div>

      {mobileMenuOpen && (
        <nav className="border-t border-border bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-slate-700 transition-colors hover:bg-brand-50 hover:text-brand-700"
              >
                {link.label}
              </Link>
            ))}
            {!isAuthenticated && (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-slate-700 transition-colors hover:bg-brand-50 hover:text-brand-700 sm:hidden"
                >
                  Увійти
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-slate-700 transition-colors hover:bg-brand-50 hover:text-brand-700"
                >
                  Реєстрація
                </Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}

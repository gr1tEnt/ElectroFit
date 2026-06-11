import Link from "next/link";
import type { ReactNode } from "react";
import { CONTACT_EMAIL } from "@/lib/siteConfig";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/catalog", label: "Catalog" },
  { href: "/smart-select", label: "Smart Selector" },
  { href: "/configurator", label: "Configurator" },
];

const safetyZoneLinks = [
  { href: "/catalog?search=IP20", label: "Sockets IP20 (Dry Rooms)" },
  { href: "/catalog?search=IP44", label: "Sockets IP44 (Bathrooms)" },
  { href: "/catalog?search=IP55", label: "Outdoor Gear IP55/IP65" },
  { href: "/catalog?search=child", label: "Child-safe Solutions" },
];

const socialLinks = [
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://youtube.com",
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
];

function PaymentIcon({ label, children }: { label: string; children: ReactNode }) {
  return (
    <span
      title={label}
      aria-label={label}
      className="flex h-7 items-center rounded border border-slate-700 bg-slate-900 px-2 text-slate-500"
    >
      {children}
    </span>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Column 1 — Brand */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white shadow-lg shadow-brand-600/20">
                EF
              </span>
              <span className="text-lg font-bold tracking-tight text-white">ElectroFit</span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed">
              Smart web resource for selecting electrical wiring accessories based on specific
              operating and environmental conditions.
            </p>
            <div className="flex items-center gap-3 pt-1">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-900 hover:text-blue-400"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 — Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Quick Links</h3>
            <ul className="mt-4 space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-blue-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Safety Zones */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
              Safety Zones
            </h3>
            <ul className="mt-4 space-y-2.5">
              {safetyZoneLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-blue-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Contacts & Payments */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Contacts</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="transition-colors hover:text-blue-400"
                >
                  Email: {CONTACT_EMAIL}
                </a>
              </li>
              <li>
                <a href="tel:+380441234567" className="transition-colors hover:text-blue-400">
                  Phone: +380 44 123 4567
                </a>
              </li>
            </ul>
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <PaymentIcon label="Visa">
                <svg className="h-3.5 w-auto" viewBox="0 0 48 16" fill="currentColor" aria-hidden>
                  <path d="M19.5 1.5h-3.8l-2.4 13h3.8l2.4-13zm9.2 8.4c0-3.2-4.4-3.4-4.4-4.8 0-.4.4-1 1.4-1.1.5-.1 1.8-.1 3.3.5l.6-2.7c-.8-.3-1.8-.5-3.1-.5-3.3 0-5.6 1.7-5.6 4.2 0 1.8 1.6 2.8 2.8 3.4 1.3.6 1.7 1 1.7 1.6 0 .9-1 1.3-2 1.3-1.7 0-2.6-.5-3.4-.8l-.6 2.8c.8.4 2.2.7 3.7.7 3.5 0 5.8-1.7 5.8-4.3zm9.8 4.6h3.5l-3-13h-3.2c-.7 0-1.3.4-1.6 1l-4.5 12h3.8l.6-1.7h4.7l.4 1.7zm-4.1-4.2 1.9-5.3.5 5.3h-2.4zM15.1 1.5l-3.7 13h3.6l3.7-13h-3.6z" />
                </svg>
              </PaymentIcon>
              <PaymentIcon label="Mastercard">
                <svg className="h-4 w-auto" viewBox="0 0 32 20" aria-hidden>
                  <circle cx="12" cy="10" r="7" fill="currentColor" opacity="0.7" />
                  <circle cx="20" cy="10" r="7" fill="currentColor" opacity="0.45" />
                </svg>
              </PaymentIcon>
              <PaymentIcon label="Google Pay">
                <svg className="h-3.5 w-auto" viewBox="0 0 48 20" fill="currentColor" aria-hidden>
                  <path d="M4 10.2c0-.7.1-1.3.3-1.9H4v-2.3h3.6c.1.5.2 1 .2 1.6 0 2-1.1 3.5-2.8 4.4l1.8 1.4C8.5 14.2 9.8 12.3 9.8 10.2H4zm8.2 0c0 .8-.1 1.5-.4 2.2l3 2.3c1.4-2.5 1.4-5.7 0-8.2l-3 2.3c.3.7.4 1.4.4 2.2zm-1.2 5.2-3-2.3c-.9.6-2 1-3.2 1-2.8 0-5.1-2.3-5.1-5.1S3.2 5 6 5c1.2 0 2.3.4 3.2 1l3-2.3C10.5 2.5 8.4 1.8 6 1.8 2.7 1.8 0 4.5 0 7.8s2.7 6 6 6c2.4 0 4.5-.7 6-1.6z" />
                  <path d="M22 6.5h10v1.6H22V6.5zm0 3.2h7.5v1.6H22V9.7zm0 3.2h9v1.6H22v-1.6z" opacity="0.85" />
                </svg>
              </PaymentIcon>
              <PaymentIcon label="Apple Pay">
                <svg className="h-3.5 w-auto" viewBox="0 0 44 18" fill="currentColor" aria-hidden>
                  <path d="M7.6 2.4c.8-1 1.9-1.7 3-1.8-.1 1.2-.5 2.3-1.3 3.2-.8.9-1.9 1.6-3 1.5.1-1.1.5-2.1 1.3-2.9zm1.2 3.1c1.7-.1 3.1 1 3.9 1-1.1 1.6-2.8 2.8-4.5 2.7-.2-1.5.5-3 1.4-4.2 1.1-1.4 2.5-2.4 3.9-2.5-.3 1.6-1.2 2.9-2.7 3zm8.2 9.2h-2.1l1.3-7.6h2.1l-1.3 7.6zm9.8-7.4c-.4-1.5-1.6-2.5-3.3-2.5-2.5 0-4.4 1.9-4.4 4.6 0 2.7 1.9 4.4 4.5 4.4 1.9 0 3.3-1 3.9-2.5l-1.8-.9c-.4.9-1.2 1.5-2.2 1.5-1.3 0-2.2-.8-2.5-2.1h6.7c0-.2.1-.7.1-1.5zm-6.4 1c.2-1.3 1.1-2.2 2.4-2.2 1.2 0 2 .7 2.2 2.2h-4.6zm11.1 6.2c.7 0 1.7-.3 2.3-.8l1 1.5c-.8.7-2 1.1-3.3 1.1-2.5 0-4-1.6-4-4.2 0-2.5 1.6-4.3 3.9-4.3 2.4 0 3.7 1.7 3.7 4.1 0 .4 0 .8-.1 1.2h-5.9c.2 1.2 1 1.8 2.1 1.8zm-.1-3.4c0-1-.6-1.7-1.7-1.7-1 0-1.7.7-1.9 1.7h3.6z" />
                </svg>
              </PaymentIcon>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-xs leading-relaxed sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p>Copyright &copy; 2026 ElectroFit. All Rights Reserved.</p>
          <p className="max-w-xl text-slate-500 lg:text-right">
            <span className="font-medium text-slate-400">Warning:</span> All electrical
            installations must be performed in compliance with national safety standards (IEC
            60364) by a licensed electrician.
          </p>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";

import { CONTACT_EMAIL } from "@/lib/siteConfig";

const paymentMethods = ["Visa", "Mastercard", "Google Pay", "Apple Pay"];

const quickLinks = [
  { href: "/", label: "Головна" },
  { href: "/catalog", label: "Каталог" },
  { href: "/smart-select", label: "Розумний підбір" },
  { href: "/configurator", label: "Конфігуратор рамок" },
];

const safetyZoneLinks = [
  { href: "/catalog?search=IP20", label: "Розетки IP20 (сухі приміщення)" },
  { href: "/catalog?search=IP44", label: "Розетки IP44 (ванні кімнати)" },
  { href: "/catalog?search=IP55", label: "Обладнання IP55/IP65 (вулиця)" },
  { href: "/catalog?search=child", label: "Рішення з захистом від дітей" },
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

function PaymentBadge({ label }: { label: string }) {
  return (
    <span
      title={label}
      aria-label={label}
      className="flex items-center justify-center rounded-md border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300"
    >
      {label}
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
              Розумний веб-ресурс для підбору електроаксесуарів з урахуванням конкретних умов
              експлуатації та навколишнього середовища.
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
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Швидкі посилання</h3>
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
              Зони безпеки
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
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Контакти</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="transition-colors hover:text-blue-400"
                >
                  Ел. пошта: {CONTACT_EMAIL}
                </a>
              </li>
              <li>
                <a href="tel:+380441234567" className="transition-colors hover:text-blue-400">
                  Телефон: +380 44 123 4567
                </a>
              </li>
            </ul>
            <div className="mt-6 flex flex-wrap items-center gap-2">
              {paymentMethods.map((method) => (
                <PaymentBadge key={method} label={method} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-xs leading-relaxed sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p>Авторські права &copy; 2026 ElectroFit. Усі права захищено.</p>
          <p className="max-w-xl text-slate-500 lg:text-right">
            <span className="font-medium text-slate-400">Попередження:</span> усі електромонтажні
            роботи мають виконуватися відповідно до національних стандартів безпеки (IEC 60364)
            ліцензованим електриком.
          </p>
        </div>
      </div>
    </footer>
  );
}

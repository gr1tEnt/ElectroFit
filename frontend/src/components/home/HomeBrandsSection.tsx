import Link from "next/link";

const brands = [
  {
    name: "Legrand",
    series: "Valena Life",
    description: "Французький стиль і преміальні матеріали. Ідеально для розумного дому.",
    href: "/catalog?brand=Legrand",
    accent: "from-brand-600/10 to-brand-600/5",
    badge: "bg-brand-100 text-brand-800",
  },
  {
    name: "Schneider Electric",
    series: "Asfora",
    description: "Німецька інженерія. Надійні, довговічні та економічні рішення.",
    href: "/catalog?brand=Schneider%20Electric",
    accent: "from-emerald-600/10 to-emerald-600/5",
    badge: "bg-emerald-100 text-emerald-800",
  },
];

export function HomeBrandsSection() {
  return (
    <section className="border-t border-border bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-ink">Підтримувані виробники</h2>
          <p className="mt-3 text-muted">Ми працюємо лише з сертифікованими лідерами безпеки</p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {brands.map((brand) => (
            <Link
              key={brand.name}
              href={brand.href}
              className={`group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br ${brand.accent} p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg`}
            >
              <div className="relative z-10">
                <p className="text-2xl font-bold text-ink">{brand.name}</p>
                <span
                  className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${brand.badge}`}
                >
                  серія {brand.series}
                </span>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">{brand.description}</p>
                <span className="mt-6 inline-flex text-sm font-semibold text-brand-600 transition-colors group-hover:text-brand-700">
                  Переглянути каталог {brand.name} →
                </span>
              </div>
              <div
                className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/40 blur-2xl transition group-hover:bg-white/60"
                aria-hidden
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

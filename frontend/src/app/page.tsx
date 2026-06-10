import { HomeAdvantagesSection } from "@/components/home/HomeAdvantagesSection";
import { HomeBrandsSection } from "@/components/home/HomeBrandsSection";
import { HomeEnvironmentsSection } from "@/components/home/HomeEnvironmentsSection";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-ink sm:text-5xl">
            Електроаксесуари для професіоналів
          </h1>
          <p className="mt-4 text-lg text-muted">
            Розетки, вимикачі, рамки та механізми — фільтруйте за IP, струмом і параметрами
            безпеки.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/configurator"
              className="inline-flex rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-brand-700"
            >
              Конфігуратор рамок
            </Link>
            <Link
              href="/smart-select"
              className="inline-flex rounded-xl border border-border bg-white px-6 py-3 text-sm font-semibold text-ink shadow-sm transition hover:bg-slate-50"
            >
              Розумний підбір
            </Link>
            <Link
              href="/catalog"
              className="inline-flex rounded-xl border border-border bg-white px-6 py-3 text-sm font-semibold text-ink shadow-sm transition hover:bg-slate-50"
            >
              Професійний каталог
            </Link>
          </div>
        </div>
      </section>

      <HomeAdvantagesSection />
      <HomeEnvironmentsSection />
      <HomeBrandsSection />
    </>
  );
}

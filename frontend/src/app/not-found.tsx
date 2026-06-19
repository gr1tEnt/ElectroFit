import Link from "next/link";

function NotFoundIcon() {
  return (
    <span
      className="flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-100 text-3xl font-bold text-brand-600 shadow-sm"
      aria-hidden
    >
      404
    </span>
  );
}

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <NotFoundIcon />
      <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-brand-600">ElectroFit</p>
      <h1 className="mt-2 text-2xl font-bold text-ink md:text-3xl">Сторінку не знайдено</h1>
      <p className="mt-4 text-sm leading-relaxed text-muted">
        Можливо, посилання застаріло або сторінку було переміщено. Перевірте адресу або поверніться на
        головну.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
      >
        Повернутися на головну
      </Link>
    </div>
  );
}

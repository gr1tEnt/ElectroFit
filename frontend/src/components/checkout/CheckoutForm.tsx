"use client";

import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { getErrorMessage } from "@/lib/apiError";
import { submitOrder } from "@/lib/api";
import { lineUnitPrice } from "@/lib/cartUtils";
import {
  INPUT_LIMITS,
  isValidEmail,
  sanitizeText,
  validatePersonName,
} from "@/lib/inputValidation";
import { loadSavedShippingAddress } from "@/lib/shippingAddressStorage";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckoutOrderSummary } from "@/components/checkout/CheckoutOrderSummary";

interface CheckoutFormState {
  customerName: string;
  email: string;
  streetAddress: string;
  city: string;
  phone: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
}

const initialForm: CheckoutFormState = {
  customerName: "",
  email: "",
  streetAddress: "",
  city: "",
  phone: "",
  cardNumber: "",
  cardExpiry: "",
  cardCvv: "",
};

function formatCardNumber(value: string): string {
  return value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, "$1 ")
    .trim();
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function validateForm(form: CheckoutFormState): string | null {
  const nameError = validatePersonName(form.customerName);
  if (nameError) return nameError;
  if (!isValidEmail(form.email)) return "Введіть дійсну електронну адресу.";
  if (!sanitizeText(form.streetAddress, 200)) return "Введіть адресу.";
  if (!sanitizeText(form.city, 100)) return "Введіть місто.";
  if (!sanitizeText(form.phone, 30)) return "Введіть номер телефону.";
  const cardDigits = form.cardNumber.replace(/\D/g, "");
  if (cardDigits.length < 16) return "Введіть дійсний 16-значний номер картки.";
  if (!/^\d{2}\/\d{2}$/.test(form.cardExpiry.trim())) {
    return "Термін дії має бути у форматі ММ/РР.";
  }
  if (!/^\d{3,4}$/.test(form.cardCvv.trim())) return "Введіть дійсний CVV.";
  return null;
}

export function CheckoutForm() {
  const router = useRouter();
  const { items, subtotal, itemCount, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [form, setForm] = useState<CheckoutFormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const saved = loadSavedShippingAddress(user.email);
    setForm((prev) => ({
      ...prev,
      customerName: user.fullName,
      email: user.email,
      streetAddress: saved?.streetAddress ?? prev.streetAddress,
      city: saved?.city ?? prev.city,
      phone: saved?.phone ?? prev.phone,
    }));
  }, [isAuthenticated, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (itemCount === 0) return;

    const validationError = validateForm(form);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      const result = await submitOrder({
        customerName: sanitizeText(form.customerName, INPUT_LIMITS.personName),
        email: sanitizeText(form.email, INPUT_LIMITS.email),
        items: items.map((line) => ({
          productId: line.product.id,
          sku: line.product.sku,
          name: line.product.name,
          quantity: line.quantity,
          unitPrice: lineUnitPrice(line.product),
        })),
      });
      clearCart();
      router.push(`/success?orderId=${encodeURIComponent(result.orderId)}`);
    } catch (err) {
      setError(getErrorMessage(err, "Не вдалося оформити замовлення. Спробуйте ще раз."));
    } finally {
      setSubmitting(false);
    }
  };

  if (itemCount === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-white p-12 text-center">
        <p className="text-lg font-semibold text-ink">Ваш кошик порожній</p>
        <p className="mt-2 text-sm text-muted">Додайте товари перед оформленням замовлення.</p>
        <Link href="/catalog" className="mt-6 inline-block text-brand-600 hover:underline">
          Переглянути каталог
        </Link>
      </div>
    );
  }

  const inputClass =
    "mt-1 w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100";

  return (
    <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-5">
      <div className="space-y-6 lg:col-span-3">
        <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-ink">Дані для доставки</h2>
          <p className="mt-1 text-sm text-muted">Куди доставити ваше замовлення?</p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="checkout-name" className="block text-sm font-medium text-ink">
                Повне ім&apos;я
              </label>
              <input
                id="checkout-name"
                required
                value={form.customerName}
                onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                className={inputClass}
                placeholder="Іван Петренко"
              />
            </div>
            <div>
              <label htmlFor="checkout-email" className="block text-sm font-medium text-ink">
                Електронна пошта
              </label>
              <input
                id="checkout-email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={inputClass}
                placeholder="vi@example.com"
              />
            </div>
            <div>
              <label htmlFor="checkout-phone" className="block text-sm font-medium text-ink">
                Телефон
              </label>
              <input
                id="checkout-phone"
                type="tel"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className={inputClass}
                placeholder="+380 67 123 4567"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="checkout-street" className="block text-sm font-medium text-ink">
                Адреса
              </label>
              <input
                id="checkout-street"
                required
                value={form.streetAddress}
                onChange={(e) => setForm({ ...form, streetAddress: e.target.value })}
                className={inputClass}
                placeholder="вул. Хрещатик, 1, кв. 4"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="checkout-city" className="block text-sm font-medium text-ink">
                Місто
              </label>
              <input
                id="checkout-city"
                required
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className={inputClass}
                placeholder="Київ"
              />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-ink">Оплата</h2>
              <p className="mt-1 text-sm text-muted">
                Імітоване оформлення — реальна оплата не проводиться.
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              Лише демо
            </span>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="checkout-card" className="block text-sm font-medium text-ink">
                Номер картки
              </label>
              <input
                id="checkout-card"
                inputMode="numeric"
                autoComplete="cc-number"
                required
                value={form.cardNumber}
                onChange={(e) =>
                  setForm({ ...form, cardNumber: formatCardNumber(e.target.value) })
                }
                className={`${inputClass} font-mono tracking-wider`}
                placeholder="4242 4242 4242 4242"
              />
            </div>
            <div>
              <label htmlFor="checkout-expiry" className="block text-sm font-medium text-ink">
                Термін дії
              </label>
              <input
                id="checkout-expiry"
                inputMode="numeric"
                autoComplete="cc-exp"
                required
                value={form.cardExpiry}
                onChange={(e) =>
                  setForm({ ...form, cardExpiry: formatExpiry(e.target.value) })
                }
                className={`${inputClass} font-mono`}
                placeholder="ММ/РР"
              />
            </div>
            <div>
              <label htmlFor="checkout-cvv" className="block text-sm font-medium text-ink">
                CVV
              </label>
              <input
                id="checkout-cvv"
                inputMode="numeric"
                autoComplete="cc-csc"
                required
                value={form.cardCvv}
                onChange={(e) =>
                  setForm({
                    ...form,
                    cardCvv: e.target.value.replace(/\D/g, "").slice(0, 4),
                  })
                }
                className={`${inputClass} font-mono`}
                placeholder="123"
              />
            </div>
          </div>
        </section>

        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting || itemCount === 0}
          className="w-full rounded-xl bg-brand-600 py-4 text-base font-semibold text-white shadow-md transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50 lg:hidden"
        >
          {submitting ? "Оформлення замовлення…" : `Оформити замовлення — €${subtotal.toFixed(2)}`}
        </button>
      </div>

      <aside className="lg:col-span-2">
        <CheckoutOrderSummary items={items} subtotal={subtotal} />
        <button
          type="submit"
          disabled={submitting || itemCount === 0}
          className="mt-4 hidden w-full rounded-xl bg-brand-600 py-4 text-base font-semibold text-white shadow-md transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50 lg:block"
        >
          {submitting ? "Оформлення замовлення…" : "Оформити замовлення"}
        </button>
        <Link
          href="/cart"
          className="mt-3 block text-center text-sm text-muted hover:text-brand-600"
        >
          Назад до кошика
        </Link>
      </aside>
    </form>
  );
}

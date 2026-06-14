import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-ink">Оформлення замовлення</h1>
      <p className="mt-2 text-muted">
        Введіть дані доставки та оплати, потім безпечно оформіть замовлення.
      </p>
      <div className="mt-8">
        <CheckoutForm />
      </div>
    </div>
  );
}

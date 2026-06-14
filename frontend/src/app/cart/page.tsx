import { CartView } from "@/components/cart/CartView";

export default function CartPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-ink">Кошик</h1>
      <p className="mt-2 text-muted">Окремі товари та модульні комплекти з конфігуратора.</p>
      <div className="mt-8">
        <CartView />
      </div>
    </div>
  );
}

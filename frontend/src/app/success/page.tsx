import { CheckoutSuccessContent } from "@/components/checkout/CheckoutSuccessContent";
import { Suspense } from "react";

export default function CheckoutSuccessPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <Suspense
        fallback={
          <div className="mx-auto max-w-lg rounded-3xl border border-border bg-white p-10 text-center text-muted">
            Loading confirmation…
          </div>
        }
      >
        <CheckoutSuccessContent />
      </Suspense>
    </div>
  );
}

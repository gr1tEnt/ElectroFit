import { SmartSelectWizard } from "@/components/smart-select/SmartSelectWizard";
import { Suspense } from "react";

function SmartSelectFallback() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-20 text-center text-muted sm:px-6 lg:px-8">
      Loading Smart Selector…
    </div>
  );
}

export default function SmartSelectPage() {
  return (
    <Suspense fallback={<SmartSelectFallback />}>
      <SmartSelectWizard />
    </Suspense>
  );
}

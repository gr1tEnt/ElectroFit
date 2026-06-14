interface WizardProgressProps {
  currentStep: number;
  totalSteps?: number;
}

const STEP_LABELS = ["Кімната", "Деталі", "Аналіз", "Результати"];

export function WizardProgress({ currentStep, totalSteps = 4 }: WizardProgressProps) {
  return (
    <div className="mb-6 md:mb-10">
      <div className="flex items-center justify-between gap-1 sm:gap-2">
        {Array.from({ length: totalSteps }, (_, i) => {
          const step = i + 1;
          const active = step === currentStep;
          const done = step < currentStep;

          return (
            <div key={step} className="flex flex-1 flex-col items-center gap-1 sm:gap-2">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold transition sm:h-10 sm:w-10 sm:text-sm ${
                  done
                    ? "bg-brand-600 text-white"
                    : active
                      ? "bg-brand-600 text-white ring-4 ring-brand-100"
                      : "bg-slate-200 text-slate-500"
                }`}
              >
                {done ? "✓" : step}
              </div>
              <span
                className={`hidden text-xs font-medium sm:block ${
                  active ? "text-brand-700" : "text-muted"
                }`}
              >
                {STEP_LABELS[i]}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-brand-600 transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        />
      </div>
    </div>
  );
}

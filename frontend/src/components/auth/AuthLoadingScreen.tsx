export function AuthLoadingScreen({ message = "Завантаження…" }: { message?: string }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4">
      <div
        className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-brand-600"
        role="status"
        aria-label={message}
      />
      <p className="text-sm text-muted">{message}</p>
    </div>
  );
}

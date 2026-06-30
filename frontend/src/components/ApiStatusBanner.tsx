"use client";

import { checkApiHealth } from "@/lib/httpClient";
import { useEffect, useState } from "react";

export function ApiStatusBanner() {
  const [online, setOnline] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;

    const probe = async () => {
      const ok = await checkApiHealth();
      if (!cancelled) {
        setOnline(ok);
      }
    };

    void probe();
    const interval = setInterval(() => void probe(), 30_000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  if (online !== false) {
    return null;
  }

  return (
    <div
      role="alert"
      className="border-b border-amber-300 bg-amber-50 px-4 py-2.5 text-center text-sm text-amber-950"
    >
      <strong>Упс! Сервер тимчасово недоступний.</strong> Ми користуємось безкоштовним
      хостингом, тому після простою бекенд може запускатися до хвилини. Зачекайте трохи
      і оновіть сторінку.
    </div>
  );
}

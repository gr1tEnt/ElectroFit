"use client";

import { getErrorMessage } from "@/lib/apiError";
import { fetchAdminStats } from "@/lib/adminApi";
import type { AdminStats } from "@/types/admin";
import { useEffect, useState } from "react";

export function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminStats()
      .then(setStats)
      .catch((err) => setError(getErrorMessage(err, "Failed to load stats")))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-white">Dashboard</h2>
      <p className="mt-1 text-slate-400">Overview metrics for your electrical store.</p>

      {error && (
        <p className="mt-4 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p>
      )}

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <KpiCard
          label="Total Products"
          value={loading ? "…" : String(stats?.totalProducts ?? 0)}
          hint="Items in catalog"
          accent="amber"
          loading={loading}
        />
        <KpiCard
          label="Unresolved Inquiries"
          value={loading ? "…" : String(stats?.unresolvedInquiries ?? 0)}
          hint="Support messages in queue"
          accent="sky"
          loading={loading}
        />
        <KpiCard
          label="Total Brands"
          value={loading ? "…" : String(stats?.totalBrands ?? 0)}
          hint="Active brand series"
          accent="emerald"
          loading={loading}
        />
      </div>
    </div>
  );
}

function KpiCard({
  label,
  value,
  hint,
  accent,
  loading,
}: {
  label: string;
  value: string;
  hint: string;
  accent: "amber" | "sky" | "emerald";
  loading: boolean;
}) {
  const accentStyles = {
    amber: "from-amber-500/10 to-slate-900 border-amber-500/20",
    sky: "from-sky-500/10 to-slate-900 border-sky-500/20",
    emerald: "from-emerald-500/10 to-slate-900 border-emerald-500/20",
  }[accent];

  const valueStyles = {
    amber: "text-amber-300",
    sky: "text-sky-300",
    emerald: "text-emerald-300",
  }[accent];

  return (
    <div
      className={`rounded-2xl border bg-gradient-to-br p-6 ${accentStyles} ${loading ? "animate-pulse" : ""}`}
    >
      <p className="text-sm font-medium text-slate-400">{label}</p>
      <p className={`mt-2 text-4xl font-bold tracking-tight ${valueStyles}`}>{value}</p>
      <p className="mt-2 text-xs text-slate-500">{hint}</p>
    </div>
  );
}

"use client";

import { fetchAdminStats } from "@/lib/adminApi";
import type { AdminStats } from "@/types/admin";
import Link from "next/link";
import { useEffect, useState } from "react";

export function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminStats()
      .then(setStats)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load stats"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-white">Dashboard</h2>
      <p className="mt-1 text-slate-400">Overview of your electrical store.</p>

      {error && (
        <p className="mt-4 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p>
      )}

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Total products"
          value={loading ? "…" : String(stats?.totalProducts ?? 0)}
          loading={loading}
        />
        <StatCard
          label="Total orders"
          value={loading ? "…" : String(stats?.totalOrders ?? 0)}
          loading={loading}
        />
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-sm font-medium text-slate-400">Quick actions</p>
          <Link
            href="/admin/products"
            className="mt-4 inline-flex rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-amber-400"
          >
            Manage products
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  loading,
}: {
  label: string;
  value: string;
  loading: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border border-slate-800 bg-slate-900 p-6 ${loading ? "animate-pulse" : ""}`}
    >
      <p className="text-sm font-medium text-slate-400">{label}</p>
      <p className="mt-2 text-4xl font-bold text-white">{value}</p>
    </div>
  );
}

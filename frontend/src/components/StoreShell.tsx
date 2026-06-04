"use client";

import { Layout } from "@/components/Layout";
import { usePathname } from "next/navigation";

export function StoreShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return <Layout>{children}</Layout>;
}

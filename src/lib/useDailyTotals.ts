"use client";
import { useQuery } from "@tanstack/react-query";

export type DailyTotalRow = {
  date: string;
  spent: number;
  conversions: number;
  cpa: number | null;
};

export type DailyTotalsFilters = {
  startDate?: string;
  endDate?: string;
  platform?: string;
  accountName?: string;
};

async function fetchDailyTotals(f: DailyTotalsFilters): Promise<DailyTotalRow[]> {
  const qs = new URLSearchParams();
  if (f.startDate) qs.set("start_date", f.startDate);
  if (f.endDate) qs.set("end_date", f.endDate);
  if (f.platform) qs.set("platform", f.platform);
  if (f.accountName) qs.set("account_name", f.accountName);

  const res = await fetch(`/api/daily-totals?${qs.toString()}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load daily totals (${res.status})`);
  const json = await res.json();
  return (json?.data ?? []) as DailyTotalRow[];
}

export function useDailyTotals(filters: DailyTotalsFilters) {
  return useQuery({
    queryKey: ["daily-totals", filters],
    queryFn: () => fetchDailyTotals(filters),
    staleTime: 60 * 1000,
  });
}

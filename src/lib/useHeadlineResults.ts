"use client";
import { useQuery } from "@tanstack/react-query";

export type HeadlineRow = {
  headline: string;
  account_name: string | null;
  spent: number;
  conversions: number;
  cpa: number | null;
};

export type HeadlineResultsFilters = {
  startDate?: string;
  endDate?: string;
  platform?: string;
  accountNames?: string[];
};

async function fetchHeadlineResults(f: HeadlineResultsFilters): Promise<HeadlineRow[]> {
  const qs = new URLSearchParams();
  if (f.startDate) qs.set("start_date", f.startDate);
  if (f.endDate) qs.set("end_date", f.endDate);
  if (f.platform) qs.set("platform", f.platform);
  for (const name of f.accountNames ?? []) qs.append("account_name", name);

  const res = await fetch(`/api/headline-results?${qs.toString()}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load headline results (${res.status})`);
  const json = await res.json();
  return (json?.data ?? []) as HeadlineRow[];
}

export function useHeadlineResults(filters: HeadlineResultsFilters) {
  return useQuery({
    queryKey: ["headline-results", filters],
    queryFn: () => fetchHeadlineResults(filters),
    staleTime: 60 * 1000,
  });
}

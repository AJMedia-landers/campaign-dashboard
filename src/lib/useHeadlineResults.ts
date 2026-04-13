"use client";
import { useQuery } from "@tanstack/react-query";

export type HeadlineRow = {
  headline: string;
  spent: number;
  conversions: number;
  cpa: number | null;
};

export type HeadlineResultsFilters = {
  startDate?: string;
  endDate?: string;
  platform?: string;
  accountName?: string;
};

async function fetchHeadlineResults(f: HeadlineResultsFilters): Promise<HeadlineRow[]> {
  const qs = new URLSearchParams();
  if (f.startDate) qs.set("start_date", f.startDate);
  if (f.endDate) qs.set("end_date", f.endDate);
  if (f.platform) qs.set("platform", f.platform);
  if (f.accountName) qs.set("account_name", f.accountName);

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

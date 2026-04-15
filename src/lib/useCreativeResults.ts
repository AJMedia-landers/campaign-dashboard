"use client";
import { useQuery } from "@tanstack/react-query";

export type CreativeRow = {
  file_url: string | null;
  account_name: string | null;
  spent: number;
  conversions: number;
  cpa: number | null;
};

export type CreativeResultsFilters = {
  startDate?: string;
  endDate?: string;
  platform?: string;
  accountName?: string;
};

async function fetchCreativeResults(f: CreativeResultsFilters): Promise<CreativeRow[]> {
  const qs = new URLSearchParams();
  if (f.startDate) qs.set("start_date", f.startDate);
  if (f.endDate) qs.set("end_date", f.endDate);
  if (f.platform) qs.set("platform", f.platform);
  if (f.accountName) qs.set("account_name", f.accountName);

  const res = await fetch(`/api/creative-results?${qs.toString()}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load creative results (${res.status})`);
  const json = await res.json();
  return (json?.data ?? []) as CreativeRow[];
}

export function useCreativeResults(filters: CreativeResultsFilters) {
  return useQuery({
    queryKey: ["creative-results", filters],
    queryFn: () => fetchCreativeResults(filters),
    staleTime: 60 * 1000,
  });
}

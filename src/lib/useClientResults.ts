"use client";
import { useQuery } from "@tanstack/react-query";

export type ClientRow = {
  account_name: string;
  total_spent: number;
  total_conversions: number;
  cpa: number | null;
};

export type ClientResultsFilters = {
  startDate?: string;
  endDate?: string;
  platform?: string;
  accountNames?: string[];
};

async function fetchClientResults(f: ClientResultsFilters): Promise<ClientRow[]> {
  const qs = new URLSearchParams();
  if (f.startDate) qs.set("start_date", f.startDate);
  if (f.endDate) qs.set("end_date", f.endDate);
  if (f.platform) qs.set("platform", f.platform);
  for (const name of f.accountNames ?? []) qs.append("account_name", name);

  const res = await fetch(`/api/client-results?${qs.toString()}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load client results (${res.status})`);
  const json = await res.json();
  return (json?.data ?? []) as ClientRow[];
}

export function useClientResults(filters: ClientResultsFilters) {
  return useQuery({
    queryKey: ["client-results", filters],
    queryFn: () => fetchClientResults(filters),
    staleTime: 60 * 1000,
  });
}

"use client";
import { useQuery } from "@tanstack/react-query";

export type Account = {
  id: string;
  name: string;
  platform: string;
  timezone: string | null;
};

async function fetchAccounts(): Promise<Account[]> {
  const res = await fetch("/api/accounts", { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load accounts (${res.status})`);
  const json = await res.json();
  return (json?.data ?? []) as Account[];
}

export function useAccounts() {
  return useQuery({
    queryKey: ["accounts"],
    queryFn: fetchAccounts,
    staleTime: 5 * 60 * 1000,
  });
}

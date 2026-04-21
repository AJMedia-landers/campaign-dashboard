"use client";
import { useQuery } from "@tanstack/react-query";

type LastSyncResponse = { success: boolean; data?: { last_sync: string | null } };

async function fetchLastSync(): Promise<string | null> {
  const res = await fetch("/api/last-sync", { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load last sync (${res.status})`);
  const json = (await res.json()) as LastSyncResponse;
  return json?.data?.last_sync ?? null;
}

export function useLastSync() {
  return useQuery({
    queryKey: ["last-sync"],
    queryFn: fetchLastSync,
    // Refresh every minute so the indicator stays fresh without being chatty.
    refetchInterval: 60 * 1000,
    staleTime: 30 * 1000,
  });
}

"use client";
import * as React from "react";
import dayjs, { Dayjs } from "dayjs";
import type { DateRange } from "@/components/DateRangePicker";

export const ALL_PLATFORM = "All";
export const ALL_ACCOUNT_ID = "__all__";
export const NAME_ID_PREFIX = "name::";

export const accountIdFromName = (name: string) => `${NAME_ID_PREFIX}${name}`;

export type SelectionSource = "client" | "headlines" | "creatives" | null;

export type DashboardFilters = {
  platform: string;
  accountId: string;
  accountName: string | null;
  selectionSource: SelectionSource;
  range: DateRange;
};

type Ctx = DashboardFilters & {
  setPlatform: (v: string) => void;
  setAccount: (id: string, name: string | null) => void;
  selectAccountByName: (name: string, source?: SelectionSource) => void;
  setRange: (r: DateRange) => void;
  /**
   * Helper for tables: returns the account filter to send to the API.
   * Returns null if the current selection was made *from this table* —
   * so the source table keeps showing all rows.
   */
  effectiveAccountFor: (source: Exclude<SelectionSource, null>) => string | null;
};

const DashboardFiltersCtx = React.createContext<Ctx | null>(null);

export function DashboardFiltersProvider({ children }: { children: React.ReactNode }) {
  const [platform, setPlatform] = React.useState<string>(ALL_PLATFORM);
  const [accountId, setAccountId] = React.useState<string>(ALL_ACCOUNT_ID);
  const [accountName, setAccountName] = React.useState<string | null>(null);
  const [selectionSource, setSelectionSource] = React.useState<SelectionSource>(null);
  const [range, setRange] = React.useState<DateRange>({
    start: dayjs().subtract(30, "day").startOf("day"),
    end: dayjs().startOf("day"),
  });

  const setAccount = React.useCallback((id: string, name: string | null) => {
    setAccountId(id);
    setAccountName(id === ALL_ACCOUNT_ID ? null : name);
    setSelectionSource(null);
  }, []);

  const selectAccountByName = React.useCallback((name: string, source: SelectionSource = null) => {
    if (!name) return;
    setAccountId(accountIdFromName(name));
    setAccountName(name);
    setSelectionSource(source);
  }, []);

  const changePlatform = React.useCallback((v: string) => {
    setPlatform(v);
    setAccountId(ALL_ACCOUNT_ID);
    setAccountName(null);
    setSelectionSource(null);
  }, []);

  const effectiveAccountFor = React.useCallback(
    (source: Exclude<SelectionSource, null>) => (selectionSource === source ? null : accountName),
    [selectionSource, accountName]
  );

  const value: Ctx = {
    platform,
    accountId,
    accountName,
    selectionSource,
    range,
    setPlatform: changePlatform,
    setAccount,
    selectAccountByName,
    setRange,
    effectiveAccountFor,
  };

  return <DashboardFiltersCtx.Provider value={value}>{children}</DashboardFiltersCtx.Provider>;
}

export function useDashboardFilters() {
  const ctx = React.useContext(DashboardFiltersCtx);
  if (!ctx) throw new Error("useDashboardFilters must be used inside DashboardFiltersProvider");
  return ctx;
}

export const fmtDate = (d: Dayjs) => d.format("YYYY-MM-DD");

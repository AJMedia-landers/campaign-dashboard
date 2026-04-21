"use client";
import * as React from "react";
import dayjs, { Dayjs } from "dayjs";
import type { DateRange } from "@/components/DateRangePicker";

export const ALL_PLATFORM = "All";

export type SelectionSource = "client" | "headlines" | "creatives" | null;

export type DashboardFilters = {
  platform: string;
  accountNames: string[];
  selectionSource: SelectionSource;
  range: DateRange;
};

type Ctx = DashboardFilters & {
  setPlatform: (v: string) => void;
  setAccountNames: (names: string[], source?: SelectionSource) => void;
  toggleAccountName: (name: string, source?: SelectionSource) => void;
  clearAccounts: () => void;
  setRange: (r: DateRange) => void;
  /**
   * Helper for tables: returns the account filter to send to the API.
   * Returns [] if the current selection was made *from this table* —
   * so the source table keeps showing all rows.
   */
  effectiveAccountsFor: (source: Exclude<SelectionSource, null>) => string[];
};

const DashboardFiltersCtx = React.createContext<Ctx | null>(null);

export function DashboardFiltersProvider({ children }: { children: React.ReactNode }) {
  const [platform, setPlatform] = React.useState<string>(ALL_PLATFORM);
  const [accountNames, setAccountNamesState] = React.useState<string[]>([]);
  const [selectionSource, setSelectionSource] = React.useState<SelectionSource>(null);
  const [range, setRange] = React.useState<DateRange>({
    start: dayjs().subtract(30, "day").startOf("day"),
    end: dayjs().startOf("day"),
  });

  const setAccountNames = React.useCallback(
    (names: string[], source: SelectionSource = null) => {
      setAccountNamesState(names);
      setSelectionSource(source);
    },
    []
  );

  const toggleAccountName = React.useCallback(
    (name: string, source: SelectionSource = null) => {
      if (!name) return;
      setAccountNamesState((prev) =>
        prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
      );
      setSelectionSource(source);
    },
    []
  );

  const clearAccounts = React.useCallback(() => {
    setAccountNamesState([]);
    setSelectionSource(null);
  }, []);

  const changePlatform = React.useCallback((v: string) => {
    setPlatform(v);
    setAccountNamesState([]);
    setSelectionSource(null);
  }, []);

  const effectiveAccountsFor = React.useCallback(
    (source: Exclude<SelectionSource, null>) =>
      selectionSource === source ? [] : accountNames,
    [selectionSource, accountNames]
  );

  const value: Ctx = {
    platform,
    accountNames,
    selectionSource,
    range,
    setPlatform: changePlatform,
    setAccountNames,
    toggleAccountName,
    clearAccounts,
    setRange,
    effectiveAccountsFor,
  };

  return <DashboardFiltersCtx.Provider value={value}>{children}</DashboardFiltersCtx.Provider>;
}

export function useDashboardFilters() {
  const ctx = React.useContext(DashboardFiltersCtx);
  if (!ctx) throw new Error("useDashboardFilters must be used inside DashboardFiltersProvider");
  return ctx;
}

export const fmtDate = (d: Dayjs) => d.format("YYYY-MM-DD");

"use client";
import * as React from "react";
import dayjs, { Dayjs } from "dayjs";
import type { DateRange } from "@/components/DateRangePicker";

export const ALL_PLATFORM = "All";
export const ALL_ACCOUNT_ID = "__all__";

export type DashboardFilters = {
  platform: string;
  accountId: string;
  accountName: string | null;
  range: DateRange;
};

type Ctx = DashboardFilters & {
  setPlatform: (v: string) => void;
  setAccount: (id: string, name: string | null) => void;
  setRange: (r: DateRange) => void;
};

const DashboardFiltersCtx = React.createContext<Ctx | null>(null);

export function DashboardFiltersProvider({ children }: { children: React.ReactNode }) {
  const [platform, setPlatform] = React.useState<string>(ALL_PLATFORM);
  const [accountId, setAccountId] = React.useState<string>(ALL_ACCOUNT_ID);
  const [accountName, setAccountName] = React.useState<string | null>(null);
  const [range, setRange] = React.useState<DateRange>({
    start: dayjs().subtract(30, "day").startOf("day"),
    end: dayjs().startOf("day"),
  });

  const setAccount = React.useCallback((id: string, name: string | null) => {
    setAccountId(id);
    setAccountName(id === ALL_ACCOUNT_ID ? null : name);
  }, []);

  const changePlatform = React.useCallback((v: string) => {
    setPlatform(v);
    setAccountId(ALL_ACCOUNT_ID);
    setAccountName(null);
  }, []);

  const value: Ctx = {
    platform,
    accountId,
    accountName,
    range,
    setPlatform: changePlatform,
    setAccount,
    setRange,
  };

  return <DashboardFiltersCtx.Provider value={value}>{children}</DashboardFiltersCtx.Provider>;
}

export function useDashboardFilters() {
  const ctx = React.useContext(DashboardFiltersCtx);
  if (!ctx) throw new Error("useDashboardFilters must be used inside DashboardFiltersProvider");
  return ctx;
}

export const fmtDate = (d: Dayjs) => d.format("YYYY-MM-DD");

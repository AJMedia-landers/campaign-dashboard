"use client";
import type { Dayjs } from "dayjs";
import { useClientResults, type ClientRow } from "@/lib/useClientResults";
import { fmtDate, useDashboardFilters } from "@/lib/DashboardFiltersContext";

export type Totals = {
  spent: number;
  conversions: number;
  cpa: number | null;
};

function computeTotals(rows: ClientRow[]): Totals {
  const spent = rows.reduce((s, r) => s + (r.total_spent ?? 0), 0);
  const conversions = rows.reduce((s, r) => s + (r.total_conversions ?? 0), 0);
  const cpa = conversions > 0 ? spent / conversions : null;
  return { spent, conversions, cpa };
}

function pctChange(curr: number | null, prev: number | null): number | null {
  if (curr == null || prev == null || prev === 0) return null;
  return ((curr - prev) / prev) * 100;
}

// Matches Looker Studio's "previous period" semantics:
// full calendar month → previous calendar month; otherwise same length immediately preceding.
function previousPeriod(start: Dayjs, end: Dayjs) {
  const isFullCalendarMonth =
    start.isSame(start.startOf("month"), "day") &&
    end.isSame(end.endOf("month"), "day") &&
    start.isSame(end, "month");

  if (isFullCalendarMonth) {
    const prev = start.subtract(1, "month");
    return { start: prev.startOf("month"), end: prev.endOf("month").startOf("day") };
  }

  const spanDays = end.diff(start, "day");
  const prevEnd = start.subtract(1, "day");
  const prevStart = prevEnd.subtract(spanDays, "day");
  return { start: prevStart, end: prevEnd };
}

export function useSummary() {
  const { range, platform, accountNames } = useDashboardFilters();

  const { start: prevStart, end: prevEnd } = previousPeriod(range.start, range.end);

  const platformParam = platform === "All" ? undefined : platform.toLowerCase();

  const current = useClientResults({
    startDate: fmtDate(range.start),
    endDate: fmtDate(range.end),
    platform: platformParam,
    accountNames,
  });

  const previous = useClientResults({
    startDate: fmtDate(prevStart),
    endDate: fmtDate(prevEnd),
    platform: platformParam,
    accountNames,
  });

  const currTotals = computeTotals(current.data ?? []);
  const prevTotals = computeTotals(previous.data ?? []);

  return {
    current: currTotals,
    previous: prevTotals,
    changePct: {
      spent: pctChange(currTotals.spent, prevTotals.spent),
      conversions: pctChange(currTotals.conversions, prevTotals.conversions),
      cpa: pctChange(currTotals.cpa, prevTotals.cpa),
    },
    isLoading: current.isLoading || previous.isLoading,
    isError: current.isError || previous.isError,
  };
}

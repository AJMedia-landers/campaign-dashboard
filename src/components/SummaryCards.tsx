"use client";
import { Box } from "@mui/material";
import { useMemo } from "react";
import StatCard from "./StatCard";
import { useSummary } from "@/lib/useSummary";
import { useDailyTotals } from "@/lib/useDailyTotals";
import { fmtDate, useDashboardFilters } from "@/lib/DashboardFiltersContext";

export default function SummaryCards() {
  const { current, changePct, isLoading } = useSummary();
  const { range, platform, accountName } = useDashboardFilters();

  const { data: daily = [] } = useDailyTotals({
    startDate: fmtDate(range.start),
    endDate: fmtDate(range.end),
    platform: platform === "All" ? undefined : platform.toLowerCase(),
    accountName: accountName ?? undefined,
  });

  const trends = useMemo(
    () => ({
      spent: daily.map((d) => d.spent),
      conversions: daily.map((d) => d.conversions),
      cpa: daily.filter((d) => d.cpa != null).map((d) => d.cpa as number),
    }),
    [daily]
  );

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
        gap: 2,
        mb: 3,
      }}
    >
      <StatCard
        label="Spent"
        value={current.spent}
        changePct={changePct.spent}
        format="currency"
        trend={trends.spent}
        loading={isLoading}
      />
      <StatCard
        label="Conversions"
        value={current.conversions}
        changePct={changePct.conversions}
        format="number"
        trend={trends.conversions}
        loading={isLoading}
      />
      <StatCard
        label="CPA"
        value={current.cpa}
        changePct={changePct.cpa}
        format="decimal"
        trend={trends.cpa}
        loading={isLoading}
      />
    </Box>
  );
}

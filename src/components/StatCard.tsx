"use client";
import { Box, Paper, Typography } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import Sparkline from "./Sparkline";
import { fmtCurrency, fmtDecimal, fmtNumber, fmtPct } from "@/lib/format";
import type { SummaryStat } from "@/data/mockDashboard";

function formatValue(stat: SummaryStat) {
  if (stat.format === "currency") return fmtCurrency(stat.value);
  if (stat.format === "decimal") return fmtDecimal(stat.value);
  return fmtNumber(stat.value);
}

export default function StatCard({ stat }: { stat: SummaryStat }) {
  const negative = stat.changePct < 0;
  const color = negative ? "#C62828" : "#2E7D32";
  const Arrow = negative ? ArrowDropDownIcon : ArrowDropUpIcon;

  return (
    <Paper sx={{ p: 2.5, borderRadius: 2, overflow: "hidden" }}>
      <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", mb: 1 }}>
        {stat.label}
      </Typography>
      <Typography variant="h4" sx={{ textAlign: "center", fontWeight: 700, color: "secondary.main" }}>
        {formatValue(stat)}
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", color, mt: 0.5, mb: 1 }}>
        <Arrow fontSize="small" />
        <Typography variant="caption" sx={{ fontWeight: 600 }}>
          {fmtPct(stat.changePct)} vs prev period
        </Typography>
      </Box>
      <Box sx={{ mx: -2.5, mb: -2.5 }}>
        <Sparkline data={stat.trend} />
      </Box>
    </Paper>
  );
}

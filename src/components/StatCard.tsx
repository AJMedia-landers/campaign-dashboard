"use client";
import { Box, CircularProgress, Paper, Typography } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import Sparkline from "./Sparkline";
import { fmtCurrency, fmtDecimal, fmtNumber, fmtPct } from "@/lib/format";

export type StatCardProps = {
  label: string;
  value: number | null;
  changePct: number | null;
  format: "currency" | "number" | "decimal";
  trend?: number[];
  loading?: boolean;
};

function formatValue(value: number | null, format: StatCardProps["format"]) {
  if (value == null) return "—";
  if (format === "currency") return fmtCurrency(value);
  if (format === "decimal") return fmtDecimal(value);
  return fmtNumber(value);
}

export default function StatCard({ label, value, changePct, format, trend, loading }: StatCardProps) {
  const hasChange = changePct != null && Number.isFinite(changePct);
  const negative = hasChange && changePct! < 0;
  const color = !hasChange ? "text.secondary" : negative ? "#C62828" : "#2E7D32";
  const Arrow = negative ? ArrowDropDownIcon : ArrowDropUpIcon;

  return (
    <Paper sx={{ p: 2.5, borderRadius: 2, overflow: "hidden", minHeight: 180 }}>
      <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", mb: 1 }}>
        {label}
      </Typography>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress size={24} />
        </Box>
      ) : (
        <>
          <Typography variant="h4" sx={{ textAlign: "center", fontWeight: 700, color: "secondary.main" }}>
            {formatValue(value, format)}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", color, mt: 0.5, mb: 1 }}>
            {hasChange ? (
              <>
                <Arrow fontSize="small" />
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  {fmtPct(changePct!)} vs prev period
                </Typography>
              </>
            ) : (
              <Typography variant="caption" color="text.secondary">
                No previous period data
              </Typography>
            )}
          </Box>
          {trend && trend.length > 1 && (
            <Box sx={{ mx: -2.5, mb: -2.5 }}>
              <Sparkline data={trend} />
            </Box>
          )}
        </>
      )}
    </Paper>
  );
}

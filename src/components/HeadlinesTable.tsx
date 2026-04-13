"use client";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel } from "@mui/material";
import { fmtCurrency, fmtCpa, fmtNumber } from "@/lib/format";
import { headlines, type HeadlineRow } from "@/data/mockDashboard";
import { useSortable } from "@/lib/useSortable";

const headSx = { bgcolor: "primary.main", color: "#fff", fontWeight: 700 };
const sortSx = {
  "& .MuiTableSortLabel-root": { color: "#fff" },
  "& .MuiTableSortLabel-root:hover": { color: "#fff" },
  "& .MuiTableSortLabel-root.Mui-active": { color: "#fff" },
  "& .MuiTableSortLabel-icon": { color: "#fff !important" },
};

type SortKey = keyof HeadlineRow;

export default function HeadlinesTable() {
  const { sorted, sort, toggle } = useSortable<HeadlineRow, SortKey>(headlines, "spent", "desc");

  const header = (key: SortKey, label: string, align: "left" | "right" = "left") => (
    <TableCell sx={{ ...headSx, ...sortSx }} align={align} sortDirection={sort?.key === key ? sort.dir : false}>
      <TableSortLabel active={sort?.key === key} direction={sort?.key === key ? sort.dir : "desc"} onClick={() => toggle(key)}>
        {label}
      </TableSortLabel>
    </TableCell>
  );

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ ...headSx, width: 32 }} />
            {header("headline", "Headlines")}
            {header("spent", "Spent", "right")}
            {header("conversions", "Conversions", "right")}
            {header("cpa", "CPA", "right")}
          </TableRow>
        </TableHead>
        <TableBody>
          {sorted.map((r, idx) => (
            <TableRow key={r.rank} hover>
              <TableCell sx={{ color: "text.secondary" }}>{idx + 1}.</TableCell>
              <TableCell>{r.headline}</TableCell>
              <TableCell align="right">{fmtCurrency(r.spent)}</TableCell>
              <TableCell align="right">{fmtNumber(r.conversions)}</TableCell>
              <TableCell align="right">{fmtCpa(r.cpa)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

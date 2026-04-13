"use client";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel } from "@mui/material";
import { fmtCurrency, fmtCpa, fmtNumber } from "@/lib/format";
import { clientResults, type ClientRow } from "@/data/mockDashboard";
import { useSortable } from "@/lib/useSortable";

const headSx = { bgcolor: "primary.main", color: "#fff", fontWeight: 700 };
const sortSx = {
  "& .MuiTableSortLabel-root": { color: "#fff" },
  "& .MuiTableSortLabel-root:hover": { color: "#fff" },
  "& .MuiTableSortLabel-root.Mui-active": { color: "#fff" },
  "& .MuiTableSortLabel-icon": { color: "#fff !important" },
};

type SortKey = keyof ClientRow;

export default function ClientResultsTable() {
  const { sorted, sort, toggle } = useSortable<ClientRow, SortKey>(clientResults, "total_spent", "desc");

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
            {header("account_name", "account_name")}
            {header("total_spent", "total_spent", "right")}
            {header("total_conversions", "total_conversions", "right")}
            {header("cpa", "CPA", "right")}
          </TableRow>
        </TableHead>
        <TableBody>
          {sorted.map((r, i) => (
            <TableRow key={i} hover>
              <TableCell>{r.account_name}</TableCell>
              <TableCell align="right">{fmtCurrency(r.total_spent)}</TableCell>
              <TableCell align="right">{fmtNumber(r.total_conversions)}</TableCell>
              <TableCell align="right">{fmtCpa(r.cpa)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

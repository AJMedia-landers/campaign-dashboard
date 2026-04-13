"use client";
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel } from "@mui/material";
import { fmtCurrency, fmtCpa, fmtNumber } from "@/lib/format";
import { creatives, type CreativeRow } from "@/data/mockDashboard";
import { useSortable } from "@/lib/useSortable";

const headSx = { bgcolor: "primary.main", color: "#fff", fontWeight: 700 };
const sortSx = {
  "& .MuiTableSortLabel-root": { color: "#fff" },
  "& .MuiTableSortLabel-root:hover": { color: "#fff" },
  "& .MuiTableSortLabel-root.Mui-active": { color: "#fff" },
  "& .MuiTableSortLabel-icon": { color: "#fff !important" },
};

type SortKey = Exclude<keyof CreativeRow, "image">;

export default function CreativesTable() {
  const { sorted, sort, toggle } = useSortable<CreativeRow, SortKey>(creatives, "spent", "desc");

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
            <TableCell sx={headSx} align="center">Image</TableCell>
            {header("account_name", "account_name")}
            {header("spent", "Spent", "right")}
            {header("conversions", "Conversions", "right")}
            {header("cpa", "CPA", "right")}
          </TableRow>
        </TableHead>
        <TableBody>
          {sorted.map((r, idx) => (
            <TableRow key={r.rank} hover>
              <TableCell sx={{ color: "text.secondary" }}>{idx + 1}.</TableCell>
              <TableCell align="center">
                <Box
                  component="img"
                  src={r.image}
                  alt=""
                  sx={{ width: 64, height: 64, borderRadius: 1, objectFit: "cover", display: "block", mx: "auto" }}
                />
              </TableCell>
              <TableCell>{r.account_name}</TableCell>
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

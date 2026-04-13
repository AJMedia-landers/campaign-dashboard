"use client";
import { useEffect, useState } from "react";
import {
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";
import { fmtCurrency, fmtCpa, fmtNumber } from "@/lib/format";
import { useSortable } from "@/lib/useSortable";
import { useHeadlineResults, type HeadlineRow } from "@/lib/useHeadlineResults";
import { fmtDate, useDashboardFilters } from "@/lib/DashboardFiltersContext";
import { useTablePagination } from "@/lib/useTablePagination";

const selectedRowSx = {
  bgcolor: "rgba(191, 142, 113, 0.28) !important",
  borderLeft: "4px solid",
  borderLeftColor: "primary.dark",
  "& td": { fontWeight: 700 },
  "&:hover": { bgcolor: "rgba(191, 142, 113, 0.36) !important" },
};

const headSx = { bgcolor: "primary.main", color: "#fff", fontWeight: 700 };
const sortSx = {
  "& .MuiTableSortLabel-root": { color: "#fff" },
  "& .MuiTableSortLabel-root:hover": { color: "#fff" },
  "& .MuiTableSortLabel-root.Mui-active": { color: "#fff" },
  "& .MuiTableSortLabel-icon": { color: "#fff !important" },
};

type SortKey = keyof HeadlineRow;

export default function HeadlinesTable() {
  const { platform, accountName, range, selectAccountByName, selectionSource, effectiveAccountFor } = useDashboardFilters();
  const effective = effectiveAccountFor("headlines");

  // Track the *specific* clicked row (by headline string), not just the account,
  // so duplicates of the same top-account don't all light up.
  const [selectedHeadline, setSelectedHeadline] = useState<string | null>(null);
  useEffect(() => {
    if (selectionSource !== "headlines") setSelectedHeadline(null);
  }, [selectionSource, accountName]);
  const { data = [], isLoading, isError, error } = useHeadlineResults({
    startDate: fmtDate(range.start),
    endDate: fmtDate(range.end),
    platform: platform === "All" ? undefined : platform.toLowerCase(),
    accountName: effective ?? undefined,
  });

  const { sorted, sort, toggle } = useSortable<HeadlineRow, SortKey>(data, "spent", "desc");
  const {
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    paginate,
    rowsPerPageOptions,
  } = useTablePagination(sorted.length);
  const visible = paginate(sorted);
  const startIndex = rowsPerPage === -1 ? 0 : page * rowsPerPage;

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
          {isLoading && (
            <TableRow>
              <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                <CircularProgress size={20} />
              </TableCell>
            </TableRow>
          )}
          {!isLoading && isError && (
            <TableRow>
              <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                <Typography variant="body2" color="error">
                  {(error as Error)?.message ?? "Failed to load data"}
                </Typography>
              </TableCell>
            </TableRow>
          )}
          {!isLoading && !isError && sorted.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  No headlines for the selected filters
                </Typography>
              </TableCell>
            </TableRow>
          )}
          {!isLoading && !isError &&
            visible.map((r, idx) => {
              const clickable = !!r.account_name;
              const isSelected = r.headline === selectedHeadline;
              return (
                <TableRow
                  key={`${startIndex + idx}-${r.headline}`}
                  hover
                  onClick={() => {
                    if (!clickable) return;
                    setSelectedHeadline(r.headline);
                    selectAccountByName(r.account_name!, "headlines");
                  }}
                  sx={{
                    cursor: clickable ? "pointer" : "default",
                    ...(isSelected ? selectedRowSx : {}),
                  }}
                >
                  <TableCell sx={{ color: "text.secondary" }}>{startIndex + idx + 1}.</TableCell>
                  <TableCell>{r.headline}</TableCell>
                  <TableCell align="right">{fmtCurrency(r.spent)}</TableCell>
                  <TableCell align="right">{fmtNumber(r.conversions)}</TableCell>
                  <TableCell align="right">{fmtCpa(r.cpa)}</TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={sorted.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={rowsPerPageOptions}
      />
    </TableContainer>
  );
}

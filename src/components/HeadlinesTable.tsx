"use client";
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

const headSx = { bgcolor: "primary.main", color: "#fff", fontWeight: 700 };
const sortSx = {
  "& .MuiTableSortLabel-root": { color: "#fff" },
  "& .MuiTableSortLabel-root:hover": { color: "#fff" },
  "& .MuiTableSortLabel-root.Mui-active": { color: "#fff" },
  "& .MuiTableSortLabel-icon": { color: "#fff !important" },
};

type SortKey = keyof HeadlineRow;

export default function HeadlinesTable() {
  const { platform, accountName, range } = useDashboardFilters();
  const { data = [], isLoading, isError, error } = useHeadlineResults({
    startDate: fmtDate(range.start),
    endDate: fmtDate(range.end),
    platform: platform === "All" ? undefined : platform.toLowerCase(),
    accountName: accountName ?? undefined,
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
            visible.map((r, idx) => (
              <TableRow key={`${startIndex + idx}-${r.headline}`} hover>
                <TableCell sx={{ color: "text.secondary" }}>{startIndex + idx + 1}.</TableCell>
                <TableCell>{r.headline}</TableCell>
                <TableCell align="right">{fmtCurrency(r.spent)}</TableCell>
                <TableCell align="right">{fmtNumber(r.conversions)}</TableCell>
                <TableCell align="right">{fmtCpa(r.cpa)}</TableCell>
              </TableRow>
            ))}
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

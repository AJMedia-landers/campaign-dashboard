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
import { useClientResults, type ClientRow } from "@/lib/useClientResults";
import { ALL_ACCOUNT_ID, fmtDate, useDashboardFilters } from "@/lib/DashboardFiltersContext";
import { useTablePagination } from "@/lib/useTablePagination";
import { useResizableColumns } from "@/lib/useResizableColumns";
import ResizeHandle from "./ResizeHandle";

const headSx = { bgcolor: "primary.main", color: "#fff", fontWeight: 700 };
const sortSx = {
  "& .MuiTableSortLabel-root": { color: "#fff" },
  "& .MuiTableSortLabel-root:hover": { color: "#fff" },
  "& .MuiTableSortLabel-root.Mui-active": { color: "#fff" },
  "& .MuiTableSortLabel-icon": { color: "#fff !important" },
};
const selectedRowSx = {
  bgcolor: "rgba(191, 142, 113, 0.28) !important",
  borderLeft: "4px solid",
  borderLeftColor: "primary.dark",
  "& td": { fontWeight: 700 },
  "&:hover": { bgcolor: "rgba(191, 142, 113, 0.36) !important" },
};

type SortKey = keyof ClientRow;

export default function ClientResultsTable() {
  const { platform, accountName, range, selectAccountByName, setAccount, selectionSource, effectiveAccountFor } = useDashboardFilters();
  const effective = effectiveAccountFor("client");
  const { data = [], isLoading, isError, error } = useClientResults({
    startDate: fmtDate(range.start),
    endDate: fmtDate(range.end),
    platform: platform === "All" ? undefined : platform.toLowerCase(),
    accountName: effective ?? undefined,
  });

  const { sorted, sort, toggle } = useSortable<ClientRow, SortKey>(data, "total_spent", "desc");
  const {
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    paginate,
    rowsPerPageOptions,
  } = useTablePagination(sorted.length);
  const visible = paginate(sorted);
  const { widths, startResize } = useResizableColumns([320, 160, 180, 120]);

  const header = (index: number, key: SortKey, label: string, align: "left" | "right" = "left") => (
    <TableCell
      sx={{ ...headSx, ...sortSx, position: "relative" }}
      align={align}
      sortDirection={sort?.key === key ? sort.dir : false}
    >
      <TableSortLabel active={sort?.key === key} direction={sort?.key === key ? sort.dir : "desc"} onClick={() => toggle(key)}>
        {label}
      </TableSortLabel>
      <ResizeHandle onMouseDown={startResize(index)} />
    </TableCell>
  );

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
      <Table size="small" sx={{ tableLayout: "fixed" }}>
        <colgroup>
          {widths.map((w, i) => (
            <col key={i} style={{ width: `${w}px` }} />
          ))}
        </colgroup>
        <TableHead>
          <TableRow>
            {header(0, "account_name", "Account Name")}
            {header(1, "total_spent", "Total Spent", "right")}
            {header(2, "total_conversions", "Total Conversions", "right")}
            {header(3, "cpa", "CPA", "right")}
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading && (
            <TableRow>
              <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                <CircularProgress size={20} />
              </TableCell>
            </TableRow>
          )}
          {!isLoading && isError && (
            <TableRow>
              <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                <Typography variant="body2" color="error">
                  {(error as Error)?.message ?? "Failed to load data"}
                </Typography>
              </TableCell>
            </TableRow>
          )}
          {!isLoading && !isError && sorted.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  No data for the selected filters
                </Typography>
              </TableCell>
            </TableRow>
          )}
          {!isLoading && !isError &&
            visible.map((r) => {
              const isSelected = selectionSource === "client" && accountName === r.account_name;
              return (
                <TableRow
                  key={r.account_name}
                  hover
                  onClick={() =>
                    isSelected
                      ? setAccount(ALL_ACCOUNT_ID, null)
                      : selectAccountByName(r.account_name, "client")
                  }
                  sx={{
                    cursor: "pointer",
                    ...(isSelected ? selectedRowSx : {}),
                  }}
                >
                  <TableCell>{r.account_name}</TableCell>
                  <TableCell align="right">{fmtCurrency(r.total_spent)}</TableCell>
                  <TableCell align="right">{fmtNumber(r.total_conversions)}</TableCell>
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

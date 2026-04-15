"use client";
import { useEffect, useState } from "react";
import {
  Box,
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
import BrokenImageIcon from "@mui/icons-material/BrokenImage";
import { fmtCurrency, fmtCpa, fmtNumber } from "@/lib/format";
import { useSortable } from "@/lib/useSortable";
import { useCreativeResults, type CreativeRow } from "@/lib/useCreativeResults";
import { ALL_ACCOUNT_ID, fmtDate, useDashboardFilters } from "@/lib/DashboardFiltersContext";
import { useTablePagination } from "@/lib/useTablePagination";
import { toDriveThumbnail } from "@/lib/driveThumbnail";
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

type SortKey = Exclude<keyof CreativeRow, "file_url">;

export default function CreativesTable() {
  const { platform, accountName, range, selectAccountByName, setAccount, selectionSource, effectiveAccountFor } =
    useDashboardFilters();
  const effective = effectiveAccountFor("creatives");

  const { data = [], isLoading, isError, error } = useCreativeResults({
    startDate: fmtDate(range.start),
    endDate: fmtDate(range.end),
    platform: platform === "All" ? undefined : platform.toLowerCase(),
    accountName: effective ?? undefined,
  });

  const { sorted, sort, toggle } = useSortable<CreativeRow, SortKey>(data, "spent", "desc");
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
  const { widths, startResize } = useResizableColumns([48, 160, 320, 140, 140, 120]);

  // Track the specific clicked creative (by file_url) so duplicates don't all light up.
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  useEffect(() => {
    if (selectionSource !== "creatives") setSelectedImage(null);
  }, [selectionSource, accountName]);

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
            <TableCell sx={{ ...headSx, position: "relative" }}>
              <ResizeHandle onMouseDown={startResize(0)} />
            </TableCell>
            <TableCell sx={{ ...headSx, position: "relative" }} align="center">
              Image
              <ResizeHandle onMouseDown={startResize(1)} />
            </TableCell>
            {header(2, "account_name", "Account Name")}
            {header(3, "spent", "Spent", "right")}
            {header(4, "conversions", "Conversions", "right")}
            {header(5, "cpa", "CPA", "right")}
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading && (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                <CircularProgress size={20} />
              </TableCell>
            </TableRow>
          )}
          {!isLoading && isError && (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                <Typography variant="body2" color="error">
                  {(error as Error)?.message ?? "Failed to load data"}
                </Typography>
              </TableCell>
            </TableRow>
          )}
          {!isLoading && !isError && sorted.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  No creatives for the selected filters
                </Typography>
              </TableCell>
            </TableRow>
          )}
          {!isLoading && !isError &&
            visible.map((r, idx) => {
              const rowKey = `${r.file_url ?? "no-img"}::${r.account_name ?? "no-acc"}::${startIndex + idx}`;
              const clickable = !!r.account_name;
              const isSelected = !!r.file_url && r.file_url === selectedImage;
              return (
                <TableRow
                  key={rowKey}
                  hover
                  onClick={() => {
                    if (!clickable) return;
                    if (isSelected) {
                      setSelectedImage(null);
                      setAccount(ALL_ACCOUNT_ID, null);
                    } else {
                      if (r.file_url) setSelectedImage(r.file_url);
                      selectAccountByName(r.account_name!, "creatives");
                    }
                  }}
                  sx={{
                    cursor: clickable ? "pointer" : "default",
                    ...(isSelected ? selectedRowSx : {}),
                  }}
                >
                  <TableCell sx={{ color: "text.secondary" }}>{startIndex + idx + 1}.</TableCell>
                  <TableCell align="center" sx={{ p: 1 }}>
                    {r.file_url ? (
                      <Box
                        component="img"
                        src={toDriveThumbnail(r.file_url, Math.max(120, widths[1] * 2)) ?? undefined}
                        referrerPolicy="no-referrer"
                        alt=""
                        onError={(e) => {
                          const img = e.currentTarget as HTMLImageElement;
                          img.style.display = "none";
                          const fallback = img.nextElementSibling as HTMLElement | null;
                          if (fallback) fallback.style.display = "flex";
                        }}
                        sx={{
                          width: "100%",
                          aspectRatio: "1 / 1",
                          borderRadius: 1,
                          objectFit: "cover",
                          display: "block",
                          mx: "auto",
                        }}
                      />
                    ) : null}
                    <Box
                      sx={{
                        width: "100%",
                        aspectRatio: "1 / 1",
                        borderRadius: 1,
                        bgcolor: "action.hover",
                        display: r.file_url ? "none" : "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mx: "auto",
                      }}
                    >
                      <BrokenImageIcon color="disabled" />
                    </Box>
                  </TableCell>
                  <TableCell>{r.account_name ?? "—"}</TableCell>
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

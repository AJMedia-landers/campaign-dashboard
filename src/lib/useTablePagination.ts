"use client";
import * as React from "react";

export const DEFAULT_ROWS_PER_PAGE = 10;
export const ROWS_PER_PAGE_OPTIONS = [5, 10, 15, 50, { label: "All", value: -1 }];

export function useTablePagination(totalRows: number, initialRowsPerPage = DEFAULT_ROWS_PER_PAGE) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(initialRowsPerPage);

  React.useEffect(() => {
    const maxPage =
      rowsPerPage === -1 || totalRows === 0
        ? 0
        : Math.max(0, Math.ceil(totalRows / rowsPerPage) - 1);
    if (page > maxPage) setPage(maxPage);
  }, [totalRows, rowsPerPage, page]);

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);

  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const paginate = <T,>(rows: T[]): T[] => {
    if (rowsPerPage === -1) return rows;
    const start = page * rowsPerPage;
    return rows.slice(start, start + rowsPerPage);
  };

  return {
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    paginate,
    rowsPerPageOptions: ROWS_PER_PAGE_OPTIONS,
  };
}

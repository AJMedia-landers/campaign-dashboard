"use client";
import { useMemo, useState } from "react";

export type SortDir = "asc" | "desc";
export type Sort<K> = { key: K; dir: SortDir } | null;

export function useSortable<T, K extends keyof T>(rows: T[], initialKey: K | null = null, initialDir: SortDir = "desc") {
  const [sort, setSort] = useState<Sort<K>>(initialKey ? { key: initialKey, dir: initialDir } : null);

  const sorted = useMemo(() => {
    if (!sort) return rows;
    const { key, dir } = sort;
    const sign = dir === "asc" ? 1 : -1;
    return [...rows].sort((a, b) => {
      const va = a[key] as unknown;
      const vb = b[key] as unknown;
      if (va == null && vb == null) return 0;
      if (va == null) return 1;
      if (vb == null) return -1;
      if (typeof va === "number" && typeof vb === "number") return (va - vb) * sign;
      return String(va).localeCompare(String(vb), undefined, { numeric: true, sensitivity: "base" }) * sign;
    });
  }, [rows, sort]);

  const toggle = (key: K) => {
    setSort((s) => (!s || s.key !== key ? { key, dir: "desc" } : { key, dir: s.dir === "desc" ? "asc" : "desc" }));
  };

  return { sorted, sort, toggle };
}

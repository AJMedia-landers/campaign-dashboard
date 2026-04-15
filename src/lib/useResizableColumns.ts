"use client";
import { useCallback, useState } from "react";

/**
 * Tracks column widths (in px) and returns a mousedown handler that lets the
 * caller make a resize grip on each header cell. Never let a column collapse
 * below 48px.
 */
export function useResizableColumns(initial: number[]) {
  const [widths, setWidths] = useState<number[]>(initial);

  const startResize = useCallback(
    (index: number) => (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const startX = e.clientX;
      const startW = widths[index] ?? 100;

      const onMove = (ev: MouseEvent) => {
        const delta = ev.clientX - startX;
        setWidths((prev) => {
          const next = prev.slice();
          next[index] = Math.max(48, startW + delta);
          return next;
        });
      };
      const onUp = () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };

      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    },
    [widths]
  );

  return { widths, startResize };
}

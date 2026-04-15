"use client";
import { Box } from "@mui/material";

type Props = { onMouseDown: (e: React.MouseEvent) => void };

export default function ResizeHandle({ onMouseDown }: Props) {
  return (
    <Box
      onMouseDown={onMouseDown}
      onClick={(e) => e.stopPropagation()}
      sx={{
        position: "absolute",
        right: 0,
        top: 0,
        bottom: 0,
        width: 6,
        cursor: "col-resize",
        userSelect: "none",
        zIndex: 1,
        "&:hover": { bgcolor: "rgba(255,255,255,0.35)" },
        "&:active": { bgcolor: "rgba(255,255,255,0.55)" },
      }}
    />
  );
}

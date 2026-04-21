"use client";
import { Box, Skeleton, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useLastSync } from "@/lib/useLastSync";

export default function LastSyncIndicator() {
  const { data, isLoading, isError } = useLastSync();

  let display: string;
  if (isLoading) display = "";
  else if (isError) display = "—";
  else if (!data) display = "Never";
  else display = dayjs(data).format("D MMM YYYY, HH:mm:ss");

  return (
    <Box sx={{ textAlign: "right" }}>
      <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
        Last Sync
      </Typography>
      {isLoading ? (
        <Skeleton width={140} height={20} sx={{ ml: "auto" }} />
      ) : (
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {display}
        </Typography>
      )}
    </Box>
  );
}

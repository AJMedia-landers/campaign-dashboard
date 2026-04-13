"use client";
import { Box, MenuItem, Select, Button } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { useState } from "react";
import { accountOptions, defaultDateRange, platformOptions } from "@/data/mockDashboard";

export default function FiltersBar() {
  const [platform, setPlatform] = useState(platformOptions[0]);
  const [account, setAccount] = useState(accountOptions[0]);

  return (
    <Box sx={{ display: "flex", gap: 1.5, justifyContent: "flex-end", flexWrap: "wrap", mb: 2 }}>
      <Select
        size="small"
        value={platform}
        onChange={(e) => setPlatform(e.target.value)}
        sx={{ minWidth: 170, bgcolor: "background.paper" }}
        displayEmpty
        renderValue={(v) => <span style={{ color: "rgba(0,0,0,0.6)" }}>Platform Type: <b style={{ color: "#2D2A28" }}>{v}</b></span>}
      >
        {platformOptions.map((o) => (
          <MenuItem key={o} value={o}>{o}</MenuItem>
        ))}
      </Select>
      <Select
        size="small"
        value={account}
        onChange={(e) => setAccount(e.target.value)}
        sx={{ minWidth: 200, bgcolor: "background.paper" }}
        renderValue={(v) => <span style={{ color: "rgba(0,0,0,0.6)" }}>Accounts: <b style={{ color: "#2D2A28" }}>{v}</b></span>}
      >
        {accountOptions.map((o) => (
          <MenuItem key={o} value={o}>{o}</MenuItem>
        ))}
      </Select>
      <Button
        variant="outlined"
        startIcon={<CalendarTodayIcon fontSize="small" />}
        sx={{
          bgcolor: "background.paper",
          color: "text.primary",
          borderColor: "divider",
          textTransform: "none",
          fontWeight: 500,
          px: 2,
        }}
      >
        {defaultDateRange}
      </Button>
    </Box>
  );
}

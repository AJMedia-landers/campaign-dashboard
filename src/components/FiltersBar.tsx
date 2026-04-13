"use client";
import { Box, MenuItem, Select, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import dayjs from "dayjs";
import DateRangePicker, { DateRange } from "./DateRangePicker";
import SearchableSelect, { SelectOption } from "./SearchableSelect";
import { useAccounts } from "@/lib/useAccounts";

const ALL_PLATFORM = "All";
const ALL_ACCOUNT_ID = "__all__";

export default function FiltersBar() {
  const { data: accounts = [], isLoading, isError } = useAccounts();

  const platformOptions = useMemo(() => {
    const set = new Set<string>();
    for (const a of accounts) {
      if (a.platform) set.add(a.platform.charAt(0).toUpperCase() + a.platform.slice(1));
    }
    return [ALL_PLATFORM, ...Array.from(set).sort()];
  }, [accounts]);

  const [platform, setPlatform] = useState<string>(ALL_PLATFORM);
  const [accountId, setAccountId] = useState<string>(ALL_ACCOUNT_ID);
  const [range, setRange] = useState<DateRange>({
    start: dayjs("2026-03-14"),
    end: dayjs("2026-04-12"),
  });

  const accountOptions = useMemo<SelectOption[]>(() => {
    const filtered =
      platform === ALL_PLATFORM
        ? accounts
        : accounts.filter((a) => a.platform.toLowerCase() === platform.toLowerCase());
    return [
      { id: ALL_ACCOUNT_ID, label: "All Accounts" },
      ...filtered.map((a) => ({ id: a.id, label: a.name, hint: a.platform })),
    ];
  }, [accounts, platform]);

  const onPlatformChange = (v: string) => {
    setPlatform(v);
    setAccountId(ALL_ACCOUNT_ID);
  };

  return (
    <Box sx={{ display: "flex", gap: 1.5, justifyContent: "flex-end", alignItems: "center", flexWrap: "wrap", mb: 2 }}>
      {isError && (
        <Typography variant="caption" color="error" sx={{ mr: 1 }}>
          Couldn't load accounts
        </Typography>
      )}

      <Select
        size="small"
        value={platform}
        onChange={(e) => onPlatformChange(e.target.value)}
        disabled={isLoading}
        sx={{ minWidth: 180, bgcolor: "background.paper" }}
        renderValue={(v) => (
          <span style={{ color: "rgba(0,0,0,0.6)" }}>
            Platform Type: <b style={{ color: "#2D2A28" }}>{v}</b>
          </span>
        )}
      >
        {platformOptions.map((o) => (
          <MenuItem key={o} value={o}>
            {o}
          </MenuItem>
        ))}
      </Select>

      <SearchableSelect
        label="Accounts"
        value={accountId}
        options={accountOptions}
        onChange={setAccountId}
        disabled={isLoading}
        placeholder="Search accounts…"
        minWidth={260}
        listWidth={340}
      />

      <DateRangePicker value={range} onChange={setRange} />
    </Box>
  );
}

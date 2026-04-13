"use client";
import { Box, MenuItem, Select, Typography } from "@mui/material";
import { useMemo } from "react";
import DateRangePicker from "./DateRangePicker";
import SearchableSelect, { SelectOption } from "./SearchableSelect";
import { useAccounts } from "@/lib/useAccounts";
import {
  ALL_ACCOUNT_ID,
  ALL_PLATFORM,
  NAME_ID_PREFIX,
  useDashboardFilters,
} from "@/lib/DashboardFiltersContext";

export default function FiltersBar() {
  const { platform, accountId, accountName, range, setPlatform, setAccount, setRange } = useDashboardFilters();
  const { data: accounts = [], isLoading, isError } = useAccounts();

  const platformOptions = useMemo(() => {
    const set = new Set<string>();
    for (const a of accounts) {
      if (a.platform) set.add(a.platform.charAt(0).toUpperCase() + a.platform.slice(1));
    }
    return [ALL_PLATFORM, ...Array.from(set).sort()];
  }, [accounts]);

  const accountOptions = useMemo<SelectOption[]>(() => {
    const filtered =
      platform === ALL_PLATFORM
        ? accounts
        : accounts.filter((a) => a.platform.toLowerCase() === platform.toLowerCase());
    const opts: SelectOption[] = [
      { id: ALL_ACCOUNT_ID, label: "All Accounts" },
      ...filtered.map((a) => ({ id: a.id, label: a.name, hint: a.platform })),
    ];
    // If the current selection came from a row click and isn't already represented,
    // prepend it so the SearchableSelect can display it.
    if (
      accountId !== ALL_ACCOUNT_ID &&
      accountName &&
      !opts.some((o) => o.id === accountId)
    ) {
      opts.splice(1, 0, {
        id: accountId,
        label: accountName,
        hint: accountId.startsWith(NAME_ID_PREFIX) ? "from selection" : undefined,
      });
    }
    return opts;
  }, [accounts, platform, accountId, accountName]);

  const onAccountChange = (id: string) => {
    const picked = accountOptions.find((o) => o.id === id);
    setAccount(id, picked?.label ?? null);
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
        onChange={(e) => setPlatform(e.target.value)}
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
        onChange={onAccountChange}
        disabled={isLoading}
        placeholder="Search accounts…"
        minWidth={260}
        listWidth={340}
      />

      <DateRangePicker value={range} onChange={setRange} />
    </Box>
  );
}

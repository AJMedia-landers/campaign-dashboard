"use client";
import { Box, MenuItem, Select, Typography } from "@mui/material";
import { useMemo } from "react";
import DateRangePicker from "./DateRangePicker";
import SearchableSelect, { SelectOption } from "./SearchableSelect";
import { useAccounts } from "@/lib/useAccounts";
import { ALL_PLATFORM, useDashboardFilters } from "@/lib/DashboardFiltersContext";

export default function FiltersBar() {
  const { platform, accountNames, range, setPlatform, setAccountNames, clearAccounts, setRange } =
    useDashboardFilters();
  const { data: accounts = [], isLoading, isError } = useAccounts();

  const platformOptions = useMemo(() => {
    const set = new Set<string>();
    for (const a of accounts) {
      if (a.platform) set.add(a.platform.charAt(0).toUpperCase() + a.platform.slice(1));
    }
    return [ALL_PLATFORM, ...Array.from(set).sort()];
  }, [accounts]);

  // Options are keyed by account *name* so multi-select values line up with
  // the `account_name` filter the API expects.
  const accountOptions = useMemo<SelectOption[]>(() => {
    const filtered =
      platform === ALL_PLATFORM
        ? accounts
        : accounts.filter((a) => a.platform.toLowerCase() === platform.toLowerCase());
    const opts: SelectOption[] = filtered.map((a) => ({
      id: a.name,
      label: a.name,
      hint: a.platform,
    }));
    // If a row-click added an account that isn't in the loaded list
    // (e.g., filtered out by platform), surface it so the select can show/toggle it.
    for (const name of accountNames) {
      if (!opts.some((o) => o.id === name)) {
        opts.unshift({ id: name, label: name, hint: "from selection" });
      }
    }
    return opts;
  }, [accounts, platform, accountNames]);

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
        multiple
        label="Accounts"
        value={accountNames}
        options={accountOptions}
        onChange={(ids) => setAccountNames(ids)}
        onClear={clearAccounts}
        allLabel="All Accounts"
        disabled={isLoading}
        placeholder="Search accounts…"
        minWidth={260}
        listWidth={340}
      />

      <DateRangePicker value={range} onChange={setRange} />
    </Box>
  );
}

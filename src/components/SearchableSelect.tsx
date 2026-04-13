"use client";
import * as React from "react";
import {
  Box,
  Button,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
  Popover,
  TextField,
  Typography,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import SearchIcon from "@mui/icons-material/Search";
import CheckIcon from "@mui/icons-material/Check";

export type SelectOption = {
  id: string;
  label: string;
  hint?: string;
};

type Props = {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (id: string) => void;
  disabled?: boolean;
  minWidth?: number;
  listWidth?: number;
  placeholder?: string;
  emptyText?: string;
};

export default function SearchableSelect({
  label,
  value,
  options,
  onChange,
  disabled,
  minWidth = 260,
  listWidth = 320,
  placeholder = "Search…",
  emptyText = "No results",
}: Props) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [query, setQuery] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const open = Boolean(anchorEl);
  const selected = options.find((o) => o.id === value);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      (o) => o.label.toLowerCase().includes(q) || (o.hint ?? "").toLowerCase().includes(q)
    );
  }, [options, query]);

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
    setQuery("");
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setQuery("");
  };

  const pick = (id: string) => {
    onChange(id);
    handleClose();
  };

  return (
    <>
      <Button
        onClick={handleOpen}
        disabled={disabled}
        endIcon={<ArrowDropDownIcon />}
        sx={{
          bgcolor: "background.paper",
          color: "text.primary",
          borderColor: "divider",
          border: 1,
          borderStyle: "solid",
          textTransform: "none",
          fontWeight: 400,
          px: 1.5,
          py: 0.5,
          minWidth,
          justifyContent: "space-between",
          "&:hover": { bgcolor: "background.paper", borderColor: "primary.main" },
        }}
      >
        <span style={{ color: "rgba(0,0,0,0.6)", whiteSpace: "nowrap" }}>
          {label}:{" "}
          <b style={{ color: "#2D2A28" }}>{selected?.label ?? ""}</b>
        </span>
      </Button>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{ paper: { sx: { mt: 0.5, borderRadius: 2, width: listWidth } } }}
      >
        <Box sx={{ p: 1, borderBottom: 1, borderColor: "divider" }}>
          <TextField
            size="small"
            fullWidth
            placeholder={placeholder}
            inputRef={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <List sx={{ maxHeight: 320, overflowY: "auto", py: 0 }}>
          {filtered.length === 0 ? (
            <Box sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                {emptyText}
              </Typography>
            </Box>
          ) : (
            filtered.map((o) => {
              const isSelected = o.id === value;
              return (
                <ListItemButton key={o.id} selected={isSelected} onClick={() => pick(o.id)} dense>
                  <ListItemText
                    primary={o.label}
                    secondary={o.hint}
                    primaryTypographyProps={{ sx: { fontWeight: isSelected ? 600 : 400 } }}
                  />
                  {isSelected && <CheckIcon fontSize="small" color="primary" />}
                </ListItemButton>
              );
            })
          )}
        </List>
      </Popover>
    </>
  );
}

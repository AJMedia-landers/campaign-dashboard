"use client";
import * as React from "react";
import {
  Box,
  Button,
  Checkbox,
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

type SingleProps = {
  label: string;
  options: SelectOption[];
  disabled?: boolean;
  minWidth?: number;
  listWidth?: number;
  placeholder?: string;
  emptyText?: string;
  multiple?: false;
  value: string;
  onChange: (id: string) => void;
};

type MultipleProps = {
  label: string;
  options: SelectOption[];
  disabled?: boolean;
  minWidth?: number;
  listWidth?: number;
  placeholder?: string;
  emptyText?: string;
  multiple: true;
  value: string[];
  onChange: (ids: string[]) => void;
  /** Label shown in the button when nothing is selected (e.g., "All Accounts"). */
  allLabel?: string;
  /** Optional action rendered at the top of the list (e.g., a "Clear selection" link). */
  onClear?: () => void;
};

type Props = SingleProps | MultipleProps;

export default function SearchableSelect(props: Props) {
  const {
    label,
    options,
    disabled,
    minWidth = 260,
    listWidth = 320,
    placeholder = "Search…",
    emptyText = "No results",
  } = props;
  const multiple = props.multiple === true;

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [query, setQuery] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const open = Boolean(anchorEl);

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

  const isSelected = (id: string) =>
    multiple ? (props as MultipleProps).value.includes(id) : (props as SingleProps).value === id;

  const pick = (id: string) => {
    if (multiple) {
      const current = (props as MultipleProps).value;
      const next = current.includes(id) ? current.filter((v) => v !== id) : [...current, id];
      (props as MultipleProps).onChange(next);
      // Keep popover open so users can pick more.
    } else {
      (props as SingleProps).onChange(id);
      handleClose();
    }
  };

  const displayText = React.useMemo(() => {
    if (multiple) {
      const value = (props as MultipleProps).value;
      const allLabel = (props as MultipleProps).allLabel ?? "All";
      if (value.length === 0) return allLabel;
      if (value.length === 1) {
        const opt = options.find((o) => o.id === value[0]);
        return opt?.label ?? value[0];
      }
      const first = options.find((o) => o.id === value[0])?.label ?? value[0];
      return `${first} +${value.length - 1}`;
    }
    const value = (props as SingleProps).value;
    return options.find((o) => o.id === value)?.label ?? "";
  }, [multiple, options, props]);

  const onClear = multiple ? (props as MultipleProps).onClear : undefined;
  const multipleValueLen = multiple ? (props as MultipleProps).value.length : 0;

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
          <b style={{ color: "#2D2A28" }}>{displayText}</b>
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
        {multiple && onClear && multipleValueLen > 0 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              px: 1.5,
              py: 0.75,
              borderBottom: 1,
              borderColor: "divider",
            }}
          >
            <Typography variant="caption" color="text.secondary">
              {multipleValueLen} selected
            </Typography>
            <Button
              size="small"
              onClick={() => {
                onClear();
              }}
              sx={{ textTransform: "none" }}
            >
              Clear
            </Button>
          </Box>
        )}
        <List sx={{ maxHeight: 320, overflowY: "auto", py: 0 }}>
          {filtered.length === 0 ? (
            <Box sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                {emptyText}
              </Typography>
            </Box>
          ) : (
            filtered.map((o) => {
              const selected = isSelected(o.id);
              return (
                <ListItemButton key={o.id} selected={selected} onClick={() => pick(o.id)} dense>
                  {multiple && (
                    <Checkbox
                      edge="start"
                      checked={selected}
                      tabIndex={-1}
                      disableRipple
                      size="small"
                      sx={{ mr: 1, p: 0.5 }}
                    />
                  )}
                  <ListItemText
                    primary={o.label}
                    secondary={o.hint}
                    primaryTypographyProps={{ sx: { fontWeight: selected ? 600 : 400 } }}
                  />
                  {!multiple && selected && <CheckIcon fontSize="small" color="primary" />}
                </ListItemButton>
              );
            })
          )}
        </List>
      </Popover>
    </>
  );
}

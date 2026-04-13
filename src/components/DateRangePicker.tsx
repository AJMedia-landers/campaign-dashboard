"use client";
import * as React from "react";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  MenuItem,
  MenuList,
  Paper,
  Popover,
  Typography,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { PickersDay, PickersDayProps } from "@mui/x-date-pickers/PickersDay";
import dayjs, { Dayjs } from "dayjs";

export type DateRange = { start: Dayjs; end: Dayjs };

type PresetKey = "fixed" | "today" | "yesterday" | "thisMonth" | "last7" | "last30" | "advanced";

const PRESETS: { key: PresetKey; label: string }[] = [
  { key: "fixed", label: "Fixed" },
  { key: "today", label: "Today" },
  { key: "yesterday", label: "Yesterday" },
  { key: "thisMonth", label: "This month" },
  { key: "last7", label: "Last 7 days" },
  { key: "last30", label: "Last 30 days" },
  { key: "advanced", label: "Advanced" },
];

function computePreset(key: PresetKey, includeToday: boolean): DateRange | null {
  const today = dayjs().startOf("day");
  const end = includeToday ? today : today.subtract(1, "day");
  switch (key) {
    case "today":
      return { start: today, end: today };
    case "yesterday":
      return { start: today.subtract(1, "day"), end: today.subtract(1, "day") };
    case "thisMonth":
      return { start: today.startOf("month"), end };
    case "last7":
      return { start: end.subtract(6, "day"), end };
    case "last30":
      return { start: end.subtract(29, "day"), end };
    default:
      return null;
  }
}

type RangeDayProps = PickersDayProps & {
  rangeStart?: Dayjs | null;
  rangeEnd?: Dayjs | null;
};

function RangeDay(props: RangeDayProps) {
  const { rangeStart, rangeEnd, day, outsideCurrentMonth, ...other } = props;

  const hasRange = rangeStart && rangeEnd;
  const isStart = rangeStart ? day.isSame(rangeStart, "day") : false;
  const isEnd = rangeEnd ? day.isSame(rangeEnd, "day") : false;
  const inRange =
    hasRange &&
    !outsideCurrentMonth &&
    day.isAfter(rangeStart!.subtract(1, "day")) &&
    day.isBefore(rangeEnd!.add(1, "day"));

  return (
    <PickersDay
      {...other}
      day={day}
      outsideCurrentMonth={outsideCurrentMonth}
      sx={{
        borderRadius: "50%",
        ...(inRange &&
          !isStart &&
          !isEnd && {
            bgcolor: "rgba(191, 142, 113, 0.25)",
            color: "text.primary",
            "&:hover": { bgcolor: "rgba(191, 142, 113, 0.4)" },
          }),
        ...((isStart || isEnd) && {
          bgcolor: "primary.main",
          color: "#fff",
          fontWeight: 700,
          "&:hover": { bgcolor: "primary.dark" },
          "&.Mui-selected": {
            bgcolor: "primary.main",
            color: "#fff",
            "&:hover": { bgcolor: "primary.dark" },
          },
        }),
      }}
    />
  );
}

export default function DateRangePicker({
  value,
  onChange,
}: {
  value: DateRange;
  onChange: (r: DateRange) => void;
}) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [tempStart, setTempStart] = React.useState<Dayjs>(value.start);
  const [tempEnd, setTempEnd] = React.useState<Dayjs>(value.end);
  const [selecting, setSelecting] = React.useState<"start" | "end">("start");
  const [includeToday, setIncludeToday] = React.useState(false);
  const [preset, setPreset] = React.useState<PresetKey>("fixed");

  const [leftMonth, setLeftMonth] = React.useState<Dayjs>(value.start.startOf("month"));
  const rightMonth = leftMonth.add(1, "month");

  const open = Boolean(anchorEl);

  const openPicker = (e: React.MouseEvent<HTMLElement>) => {
    setTempStart(value.start);
    setTempEnd(value.end);
    setSelecting("start");
    setLeftMonth(value.start.startOf("month"));
    setAnchorEl(e.currentTarget);
  };

  const close = () => setAnchorEl(null);

  const apply = () => {
    onChange({ start: tempStart, end: tempEnd });
    close();
  };

  const handleDayChange = (day: Dayjs | null) => {
    if (!day) return;
    setPreset("fixed");
    if (selecting === "start") {
      setTempStart(day);
      if (day.isAfter(tempEnd)) setTempEnd(day);
      setSelecting("end");
    } else {
      if (day.isBefore(tempStart)) {
        setTempEnd(tempStart);
        setTempStart(day);
      } else {
        setTempEnd(day);
      }
      setSelecting("start");
    }
  };

  const applyPreset = (key: PresetKey) => {
    setPreset(key);
    if (key === "fixed" || key === "advanced") return;
    const r = computePreset(key, includeToday);
    if (r) {
      setTempStart(r.start);
      setTempEnd(r.end);
      setLeftMonth(r.start.startOf("month"));
    }
  };

  const toggleIncludeToday = (checked: boolean) => {
    setIncludeToday(checked);
    if (preset !== "fixed" && preset !== "advanced") {
      const r = computePreset(preset, checked);
      if (r) {
        setTempStart(r.start);
        setTempEnd(r.end);
      }
    }
  };

  const fmt = (d: Dayjs) => d.format("D MMM YYYY");
  const currentPresetLabel = PRESETS.find((p) => p.key === preset)?.label ?? "Fixed";

  const slotProps = {
    day: { rangeStart: tempStart, rangeEnd: tempEnd } as any,
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Button
        variant="outlined"
        startIcon={<CalendarTodayIcon fontSize="small" />}
        endIcon={<ArrowDropDownIcon />}
        onClick={openPicker}
        sx={{
          bgcolor: "background.paper",
          color: "text.primary",
          borderColor: "divider",
          textTransform: "none",
          fontWeight: 500,
          px: 2,
          "&:hover": { bgcolor: "background.paper", borderColor: "primary.main" },
        }}
      >
        {fmt(value.start)} - {fmt(value.end)}
      </Button>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={close}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: { sx: { mt: 1, borderRadius: 2, overflow: "hidden" } },
        }}
      >
        <Paper elevation={0}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 2,
              py: 1,
              bgcolor: "primary.light",
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={includeToday}
                  onChange={(e) => toggleIncludeToday(e.target.checked)}
                  sx={{ color: "#fff", "&.Mui-checked": { color: "#fff" } }}
                />
              }
              label={<Typography variant="body2" sx={{ color: "#fff" }}>Include today</Typography>}
            />
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.5,
                bgcolor: "#fff",
                borderRadius: 1,
                px: 1.5,
                py: 0.5,
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              {currentPresetLabel}
            </Box>
          </Box>

          <Box sx={{ display: "flex" }}>
            <Box sx={{ p: 2, pr: 1 }}>
              <Box sx={{ display: "flex", gap: 3 }}>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{ display: "block", fontWeight: 700, color: "text.secondary", mb: 0.5, ml: 2 }}
                  >
                    Start date
                  </Typography>
                  <DateCalendar
                    key={`left-${leftMonth.format("YYYY-MM")}`}
                    value={tempStart}
                    onChange={handleDayChange}
                    referenceDate={leftMonth}
                    views={["day"]}
                    slots={{ day: RangeDay as any }}
                    slotProps={slotProps}
                    sx={{ width: 260 }}
                  />
                </Box>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{ display: "block", fontWeight: 700, color: "text.secondary", mb: 0.5, ml: 2 }}
                  >
                    End date
                  </Typography>
                  <DateCalendar
                    key={`right-${rightMonth.format("YYYY-MM")}`}
                    value={tempEnd}
                    onChange={handleDayChange}
                    referenceDate={rightMonth}
                    views={["day"]}
                    slots={{ day: RangeDay as any }}
                    slotProps={slotProps}
                    sx={{ width: 260 }}
                  />
                </Box>
              </Box>
            </Box>

            <Divider orientation="vertical" flexItem />

            <MenuList sx={{ minWidth: 160, py: 1 }}>
              {PRESETS.map((p) => (
                <MenuItem
                  key={p.key}
                  selected={p.key === preset}
                  onClick={() => applyPreset(p.key)}
                  sx={{
                    fontSize: 14,
                    "&.Mui-selected": { bgcolor: "rgba(191, 142, 113, 0.18)" },
                  }}
                >
                  {p.label}
                </MenuItem>
              ))}
            </MenuList>
          </Box>

          <Divider />
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, px: 2, py: 1.5 }}>
            <Button
              onClick={close}
              sx={{ bgcolor: "transparent", color: "text.primary", "&:hover": { bgcolor: "action.hover" } }}
            >
              Cancel
            </Button>
            <Button variant="contained" onClick={apply}>
              Apply
            </Button>
          </Box>
        </Paper>
      </Popover>
    </LocalizationProvider>
  );
}

"use client";
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { fmtCurrency, fmtCpa, fmtNumber } from "@/lib/format";
import { creatives } from "@/data/mockDashboard";

const headSx = { bgcolor: "primary.main", color: "#fff", fontWeight: 700 };

export default function CreativesTable() {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ ...headSx, width: 32 }} />
            <TableCell sx={headSx} align="center">Image</TableCell>
            <TableCell sx={headSx}>account_name</TableCell>
            <TableCell sx={headSx} align="right">
              Spent <ArrowDropDownIcon fontSize="small" sx={{ verticalAlign: "middle" }} />
            </TableCell>
            <TableCell sx={headSx} align="right">Conversions</TableCell>
            <TableCell sx={headSx} align="right">CPA</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {creatives.map((r) => (
            <TableRow key={r.rank} hover>
              <TableCell sx={{ color: "text.secondary" }}>{r.rank}.</TableCell>
              <TableCell align="center">
                <Box
                  component="img"
                  src={r.image}
                  alt=""
                  sx={{ width: 64, height: 64, borderRadius: 1, objectFit: "cover", display: "block", mx: "auto" }}
                />
              </TableCell>
              <TableCell>{r.account_name}</TableCell>
              <TableCell align="right">{fmtCurrency(r.spent)}</TableCell>
              <TableCell align="right">{fmtNumber(r.conversions)}</TableCell>
              <TableCell align="right">{fmtCpa(r.cpa)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

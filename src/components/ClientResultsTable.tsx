"use client";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { fmtCurrency, fmtCpa, fmtNumber } from "@/lib/format";
import { clientResults } from "@/data/mockDashboard";

const headSx = { bgcolor: "primary.main", color: "#fff", fontWeight: 700 };

export default function ClientResultsTable() {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={headSx}>account_name</TableCell>
            <TableCell sx={headSx} align="right">total_spent</TableCell>
            <TableCell sx={headSx} align="right">total_conversions</TableCell>
            <TableCell sx={headSx} align="right">CPA</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {clientResults.map((r, i) => (
            <TableRow key={i} hover>
              <TableCell>{r.account_name}</TableCell>
              <TableCell align="right">{fmtCurrency(r.total_spent)}</TableCell>
              <TableCell align="right">{fmtNumber(r.total_conversions)}</TableCell>
              <TableCell align="right">{fmtCpa(r.cpa)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

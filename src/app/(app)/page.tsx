import { Box, Container, Typography } from "@mui/material";
import FiltersBar from "@/components/FiltersBar";
import StatCard from "@/components/StatCard";
import ClientResultsTable from "@/components/ClientResultsTable";
import HeadlinesTable from "@/components/HeadlinesTable";
import CreativesTable from "@/components/CreativesTable";
import { lastSync, summary } from "@/data/mockDashboard";

export default function DashboardHome() {
  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <FiltersBar />

      <Box sx={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: "secondary.main" }}>
          NET Client Results
        </Typography>
        <Box sx={{ textAlign: "right" }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
            Last Sync
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {lastSync}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
          gap: 2,
          mb: 3,
        }}
      >
        {summary.map((s) => (
          <StatCard key={s.label} stat={s} />
        ))}
      </Box>

      <Box sx={{ mb: 4 }}>
        <ClientResultsTable />
      </Box>

      <Typography variant="h5" sx={{ fontWeight: 800, color: "secondary.main", mb: 1.5 }}>
        Headlines Performance
      </Typography>
      <Box sx={{ mb: 4 }}>
        <HeadlinesTable />
      </Box>

      <Typography variant="h5" sx={{ fontWeight: 800, color: "secondary.main", mb: 1.5 }}>
        Creatives Performance
      </Typography>
      <Box sx={{ mb: 4 }}>
        <CreativesTable />
      </Box>
    </Container>
  );
}

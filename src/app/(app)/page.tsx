import { Box, Container, Typography } from "@mui/material";
import FiltersBar from "@/components/FiltersBar";
import SummaryCards from "@/components/SummaryCards";
import ClientResultsTable from "@/components/ClientResultsTable";
import HeadlinesTable from "@/components/HeadlinesTable";
import CreativesTable from "@/components/CreativesTable";
import LastSyncIndicator from "@/components/LastSyncIndicator";
import { DashboardFiltersProvider } from "@/lib/DashboardFiltersContext";

export default function DashboardHome() {
  return (
    <DashboardFiltersProvider>
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <FiltersBar />

      <Box sx={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: "secondary.main" }}>
          NET Client Results
        </Typography>
        <LastSyncIndicator />
      </Box>

      <SummaryCards />

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
    </DashboardFiltersProvider>
  );
}

import { Box, Typography } from "@mui/material";

export default function DashboardHome() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Campaign Dashboard
      </Typography>
      <Typography color="text.secondary">
        Welcome to the campaign dashboard.
      </Typography>
    </Box>
  );
}

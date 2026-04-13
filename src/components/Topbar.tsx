"use client";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useRouter } from "next/navigation";

export default function Topbar() {
  const router = useRouter();

  const onLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/signin");
  };

  return (
    <AppBar position="static" elevation={0}>
      <Toolbar sx={{ gap: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Campaign Dashboard
        </Typography>
        <Box sx={{ flex: 1 }} />
        <Button color="inherit" startIcon={<LogoutIcon />} onClick={onLogout} sx={{ bgcolor: "transparent" }}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}

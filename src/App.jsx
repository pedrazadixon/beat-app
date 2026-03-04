import { useState } from "react";
import { Outlet } from "react-router-dom";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { useColorScheme } from "@mui/material/styles";
import Player from "./components/Player";
import QueueDrawer from "./components/QueueDrawer";
import SearchInput from "./components/SearchInput";
import Sidebar, { SIDEBAR_WIDTH } from "./components/Sidebar";
import MobileBottomNav from "./components/MobileBottomNav";

function App() {
  const { mode, setMode } = useColorScheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isDarkMode = mode === "dark";

  const handleMobileToggle = () => setMobileOpen(!mobileOpen);

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Sidebar */}
      <Sidebar mobileOpen={mobileOpen} onMobileToggle={handleMobileToggle} />

      {/* Main content area */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          minWidth: 0,
          height: "100vh",
        }}
      >
        {/* Top bar */}
        <Box
          id="global-header"
          component="header"
          sx={{
            px: { xs: 1.5, sm: 3 },
            py: 1.5,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            gap: { xs: 1, sm: 2 },
            borderBottom: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          {/* Mobile hamburger — only shows on xs */}
          <IconButton
            aria-label="open drawer"
            onClick={handleMobileToggle}
            sx={{
              display: { xs: "inline-flex", sm: "none" },
              color: "text.primary",
            }}
          >
            <MenuRoundedIcon />
          </IconButton>

          <SearchInput />

          <IconButton
            onClick={() => setMode(isDarkMode ? "light" : "dark")}
            sx={{ ml: "auto", color: "text.primary" }}
          >
            {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Box>

        {/* Page content + queue */}
        <Box sx={{ display: "flex", flexGrow: 1, minHeight: 0 }}>
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Outlet />
          </Box>

          {/* Queue drawer — hidden on mobile */}
          <QueueDrawer />
        </Box>

        {/* Player bar */}
        <Box
          sx={{
            flexShrink: 0,
            bgcolor: "background.paper",
            borderTop: "1px solid",
            borderColor: "divider",
            py: { xs: 0.25, sm: 0.5 },
          }}
        >
          <Player />
        </Box>

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav />
      </Box>
    </Box>
  );
}

export default App;

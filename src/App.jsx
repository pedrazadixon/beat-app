import { useState } from "react";
import { Outlet } from "react-router-dom";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { useColorScheme } from "@mui/material/styles";
import Player from "./components/Player";
import { useStore } from "@nanostores/react";
import { playerStore, playerActions } from "./stores/playerStore.js";
import { Drawer, List, ListItem, ListItemText, Typography } from "@mui/material";
import SearchInput from "./components/SearchInput";
import Sidebar, { SIDEBAR_WIDTH } from "./components/Sidebar";

function App() {
  const { isQueueOpen, queue, currentTrackIndex, queueDrawerWidth } = useStore(playerStore);
  const { mode, setMode } = useColorScheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isDarkMode = mode === 'dark';

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
          }}
        >
          {/* Mobile hamburger — only shows on xs */}
          <IconButton
            aria-label="open drawer"
            onClick={handleMobileToggle}
            sx={{ display: { xs: "inline-flex", sm: "none" }, color: "text.primary" }}
          >
            <MenuRoundedIcon />
          </IconButton>

          <SearchInput />

          <IconButton
            onClick={() => setMode(isDarkMode ? 'light' : 'dark')}
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
          <Drawer
            anchor="right"
            variant="persistent"
            open={isQueueOpen}
            sx={{
              display: { xs: "none", sm: "block" },
              width: isQueueOpen ? queueDrawerWidth : 0,
              flexShrink: 0,
              transition: 'width 0.2s',
              "& .MuiDrawer-paper": {
                width: queueDrawerWidth,
                position: 'relative',
                height: "100%",
                boxSizing: "border-box",
                borderLeft: "1px solid",
                borderColor: "divider",
                backgroundImage: "none",
              },
            }}
          >
            <Box sx={{ width: queueDrawerWidth, p: 2 }} role="presentation">
              <Typography variant="h6" component="div" sx={{ mb: 2, fontWeight: 700 }}>
                Queue
              </Typography>
              <List>
                {queue.map((track, index) => (
                  <ListItem
                    key={index}
                    onClick={() => playerActions.playTrack(track)}
                    sx={{
                      borderRadius: 2,
                      mb: 0.5,
                      backgroundColor:
                        currentTrackIndex === index ? "action.selected" : "transparent",
                      cursor: "pointer",
                      transition: "background-color 150ms",
                      "&:hover": { backgroundColor: "action.hover" },
                      ...(currentTrackIndex === index && {
                        borderLeft: "3px solid",
                        borderImage: "linear-gradient(135deg, #7c3aed, #06b6d4) 1",
                      }),
                    }}
                  >
                    <ListItemText
                      primary={track.title}
                      secondary={track.artists[0]?.name}
                      primaryTypographyProps={{
                        noWrap: true,
                        fontWeight: currentTrackIndex === index ? 600 : 400,
                        fontSize: "0.875rem",
                      }}
                      secondaryTypographyProps={{
                        noWrap: true,
                        fontSize: "0.75rem",
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Drawer>
        </Box>

        {/* Player bar */}
        <Box className="player-container" sx={{ flexShrink: 0 }}>
          <Player />
        </Box>
      </Box>
    </Box>
  );
}

export default App;

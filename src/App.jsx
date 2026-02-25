import { Outlet } from "react-router-dom";
import Box from "@mui/material/Box";
import Player from "./components/Player";
import { useStore } from "@nanostores/react";
import { playerStore, playerActions } from "./stores/playerStore.js";
import { Drawer, List, ListItem, ListItemText, Typography } from "@mui/material";
import SearchInput from "./components/SearchInput";

function App() {
  const { isQueueOpen, queue, currentTrackIndex, queueDrawerWidth } = useStore(playerStore);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>

      {/* header */}
      <Box id="global-header" component="header" sx={{ p: 2, flexShrink: 0 }}>
        <SearchInput />
      </Box>

      {/* main content */}
      <Box sx={{ display: "flex", flexGrow: 1, minHeight: 0 }}>
        <Box component="main" sx={{ flexGrow: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
          <Outlet />
        </Box>

        {/* queue drawer */}
        <Drawer
          anchor="right"
          variant="persistent"
          open={isQueueOpen}
          sx={{
            width: isQueueOpen ? queueDrawerWidth : 0,
            flexShrink: 0,
            transition: 'width 0.2s',
            "& .MuiDrawer-paper": {
              width: queueDrawerWidth,
              position: 'relative',
              height: "100%",
              boxSizing: "border-box",
            },
          }}
        >
          <Box sx={{ width: queueDrawerWidth, p: 2 }} role="presentation">
            <Typography variant="h6" component="div" sx={{ mb: 2 }}>
              Queue
            </Typography>
            <List>
              {queue.map((track, index) => (
                <ListItem
                  key={index}
                  onClick={() => playerActions.playTrack(track)}
                  sx={{
                    backgroundColor:
                      currentTrackIndex === index ? "action.selected" : "transparent",
                    cursor: "pointer",
                  }}
                >
                  <ListItemText
                    primary={track.title}
                    secondary={track.artists[0]?.name}
                    primaryTypographyProps={{
                      noWrap: true,
                      fontWeight: currentTrackIndex === index ? "bold" : "normal",
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
      </Box>

      {/* player */}
      <Box className="player-container" sx={{ flexShrink: 0 }}>
        <Player />
      </Box>
    </Box>
  );
}

export default App;

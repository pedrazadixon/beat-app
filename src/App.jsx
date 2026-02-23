import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import Box from "@mui/material/Box";
import Player from "./components/Player";
import { useEffect } from "react";
import { useStore } from "@nanostores/react";
import { playerStore, playerActions } from "./stores/playerStore.js";
import { Drawer, List, ListItem, ListItemText, Typography } from "@mui/material";

function App() {
  const navigate = useNavigate();
  const { isQueueOpen, queue, currentTrackIndex, queueDrawerWidth } = useStore(playerStore);

  useEffect(() => {
    navigate("/search");
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Box sx={{ flexGrow: 1 }}>
        <div style={{ flexGrow: 1, display: "flex" }}>
          <main style={{ flexGrow: 1 }}>
            <Outlet />
          </main>
          <Drawer
            anchor="right"
            variant="persistent"
            open={isQueueOpen}
            sx={{
              width: queueDrawerWidth,
              flexShrink: 0,
              "& .MuiDrawer-paper": {
                width: queueDrawerWidth,
                height: "calc(100% - 86px)",
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
        </div>
      </Box>
      <div className="player-container">
        <Player />
      </div>
    </Box>
  );
}

export default App;

import {
  Drawer,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useStore } from "@nanostores/react";
import { playerStore, playerActions } from "../stores/playerStore.js";

function QueueDrawer() {
  const { isQueueOpen, queue, currentTrackIndex, queueDrawerWidth } =
    useStore(playerStore);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const listContent = (
    <Box sx={{ width: isMobile ? "100vw" : queueDrawerWidth, p: 2 }} role="presentation">
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
          Queue
        </Typography>
        {isMobile && (
          <IconButton onClick={() => playerActions.toggleQueue()} size="small">
            <CloseRoundedIcon />
          </IconButton>
        )}
      </Box>
      <List>
        {queue.map((track, index) => {
          const isCurrentTrack = currentTrackIndex === index;
          return (
            <ListItem
              key={index}
              onClick={() => playerActions.playTrack(track)}
              sx={{
                borderRadius: "0px 10px 10px 0px",
                mb: 0.5,
                backgroundColor: isCurrentTrack
                  ? "action.selected"
                  : "transparent",
                cursor: "pointer",
                transition: "background-color 150ms",
                "&:hover": { backgroundColor: "action.hover" },
                ...(isCurrentTrack && {
                  borderLeft: "3px solid",
                  borderImage:
                    "linear-gradient(135deg, #7c3aed, #06b6d4) 1",
                }),
              }}
            >
              <ListItemText
                primary={track.title}
                secondary={track.artists[0]?.name}
                primaryTypographyProps={{
                  noWrap: true,
                  fontWeight: isCurrentTrack ? 600 : 400,
                  fontSize: "0.875rem",
                }}
                secondaryTypographyProps={{
                  noWrap: true,
                  fontSize: "0.75rem",
                }}
              />
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  // Mobile: temporary full-width bottom drawer
  if (isMobile) {
    return (
      <Drawer
        anchor="bottom"
        variant="temporary"
        open={isQueueOpen}
        onClose={() => playerActions.toggleQueue()}
        sx={{
          "& .MuiDrawer-paper": {
            height: "70vh",
            borderRadius: "16px 16px 0 0",
            backgroundImage: "none",
          },
        }}
      >
        {listContent}
      </Drawer>
    );
  }

  // Desktop: persistent side drawer
  return (
    <Drawer
      anchor="right"
      variant="persistent"
      open={isQueueOpen}
      sx={{
        width: isQueueOpen ? queueDrawerWidth : 0,
        flexShrink: 0,
        transition: "width 0.2s",
        "& .MuiDrawer-paper": {
          width: queueDrawerWidth,
          position: "relative",
          height: "100%",
          boxSizing: "border-box",
          borderLeft: "1px solid",
          borderColor: "divider",
          backgroundImage: "none",
          "&::-webkit-scrollbar": { display: "none" },
        },
      }}
    >
      {listContent}
    </Drawer>
  );
}

export default QueueDrawer;

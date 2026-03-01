import { Drawer, Box, Typography, List, ListItem, ListItemText } from "@mui/material";
import { useStore } from "@nanostores/react";
import { playerStore, playerActions } from "../stores/playerStore.js";

function QueueDrawer() {
    const { isQueueOpen, queue, currentTrackIndex, queueDrawerWidth } = useStore(playerStore);

    return (
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
                "& .MuiDrawer-paper::-webkit-scrollbar": {
                    display: "none",
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
                                borderRadius: "0px 10px 10px 0px",
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
    );
}

export default QueueDrawer;

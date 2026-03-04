// prettier-ignore
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Box, CircularProgress, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import EqualizerIcon from "./EqualizerIcon/EqualizerIcon.jsx";
import { playerStore, playerActions } from "../stores/playerStore.js";
import { useStore } from "@nanostores/react";
import { PROXY_URL } from "../constants";

const trackRowSx = (hideAlbum) => ({
  paddingBlock: "1px",
  borderRadius: 1,
  paddingInline: "12px",
  display: "grid",
  gridTemplateColumns: hideAlbum
    ? { xs: "[index] 24px [title] 1fr [duration] 60px", sm: "[index] 24px [title] minmax(120px, 4fr) [duration] minmax(120px, 1fr)" }
    : { xs: "[index] 24px [title] 1fr", sm: "[index] 24px [title] minmax(120px, 4fr) [album] minmax(120px, 2fr) [duration] minmax(120px, 1fr)" },
  gridGap: { xs: "6px", sm: "10px" },
  alignItems: "center",
  cursor: "pointer",
  transition: "background-color 150ms ease",
  "&:hover": {
    bgcolor: (t) =>
      t.palette.mode === "dark"
        ? "rgba(255,255,255,0.04)"
        : "rgba(0,0,0,0.04)",
  },
});

export default function TrackList({
  tracks,
  hideImage = false,
  hideAlbum = false,
}) {
  const { currentTrack, isPlaying, isLoading } = useStore(playerStore);

  const playTrackItem = (track) => {
    playerActions.playTrack(track, tracks);
  };

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        borderRadius: "12px",
        mb: 1.5,
        p: 1.5,
      }}
    >
      {/* Header row */}
      <Box
        sx={{
          ...trackRowSx(hideAlbum),
          cursor: "default",
          color: "text.secondary",
          fontWeight: "bold",
          position: "sticky",
          top: 0,
          left: 0,
          zIndex: 5,
          p: 1.5,
          borderRadius: 1.5,
          bgcolor: "background.paper",
          "&:hover": { bgcolor: "background.paper" },
        }}
      >
        <Box>#</Box>
        <Box>Title</Box>
        {!hideAlbum && <Box sx={{ display: { xs: "none", sm: "block" } }}>Album</Box>}
        <Box sx={{ justifySelf: "end", display: { xs: hideAlbum ? "block" : "none", sm: "block" } }}>
          Duration
        </Box>
      </Box>

      <List>
        {tracks.map((item, index) => (
          <ListItem
            key={index + "" + item.trackId}
            sx={trackRowSx(hideAlbum)}
            onClick={() => playTrackItem(item)}
          >
            <Box
              sx={{
                color: "text.secondary",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {currentTrack?.trackId === item.trackId ? (
                isLoading ? (
                  <CircularProgress size={16} color="inherit" />
                ) : isPlaying ? (
                  <EqualizerIcon />
                ) : (
                  index + 1
                )
              ) : (
                index + 1
              )}
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", minWidth: 0 }}>
              {!hideImage && (
                <ListItemAvatar sx={{ minWidth: { xs: 40, sm: 56 } }}>
                  <Avatar
                    variant="square"
                    alt={item?.title}
                    src={`${PROXY_URL}${item.thumbnailUrl}`}
                    sx={{ width: { xs: 32, sm: 40 }, height: { xs: 32, sm: 40 } }}
                  />
                </ListItemAvatar>
              )}
              <ListItemText
                primary={item?.title}
                secondary={
                  item.artists &&
                  item.artists.map((artist, i) => (
                    <span key={artist.id || i}>
                      <Link
                        to={`/artist/${artist.id}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                        className="hover-underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {artist.name}
                      </Link>
                      {i < item.artists.length - 1 ? ", " : ""}
                    </span>
                  ))
                }
                primaryTypographyProps={{
                  noWrap: true,
                  fontSize: { xs: "0.8rem", sm: "0.875rem" },
                }}
                secondaryTypographyProps={{
                  noWrap: true,
                  fontSize: { xs: "0.7rem", sm: "0.75rem" },
                }}
              />
            </Box>

            {!hideAlbum && (
              <Box
                title={item.album?.title}
                sx={{
                  color: "text.secondary",
                  fontSize: "0.9rem",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  display: { xs: "none", sm: "block" },
                }}
              >
                {item.album?.albumId ? (
                  <Link
                    to={`/album/${item.album.albumId}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                    className="hover-underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {item.album.title}
                  </Link>
                ) : (
                  item.album?.title
                )}
              </Box>
            )}

            <Box
              sx={{
                color: "text.secondary",
                justifySelf: "end",
                display: { xs: hideAlbum ? "block" : "none", sm: "block" },
                fontSize: "0.85rem",
              }}
            >
              {item.duration.label}
            </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

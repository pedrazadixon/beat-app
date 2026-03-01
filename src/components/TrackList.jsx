// prettier-ignore
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Box, CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";
import EqualizerIcon from "./EqualizerIcon/EqualizerIcon.jsx";
import { playerStore, playerActions } from "../stores/playerStore.js";
import { useStore } from "@nanostores/react";
import { PROXY_URL } from "../constants";

export default function TrackList({
  tracks,
  hideImage = false,
  hideAlbum = false,
}) {
  const { currentTrack, isPlaying, isLoading } = useStore(playerStore);

  const playTrackItem = (track) => {
    playerActions.playTrack(track, tracks);
  };

  const trackRowStyle = {
    paddingBlock: "1px",
    borderRadius: "4px",
    paddingInline: "12px",
    display: "grid",
    gridTemplateColumns: hideAlbum
      ? "[index] 24px [title] minmax(120px, 4fr) [duration] minmax(120px, 1fr)"
      : "[index] 24px [title] minmax(120px, 4fr) [album] minmax(120px, 2fr) [duration] minmax(120px, 1fr)",
    gridGap: "10px",
    alignItems: "center",
    cursor: "pointer",
  };

  return (
    <Box sx={{
      bgcolor: "background.paper",
      borderRadius: "12px",
      marginBottom: "12px",
      padding: "12px",
    }}>
      <Box className="track-list-header" sx={{
        ...trackRowStyle,
        color: "text.secondary",
        cursor: "default",
      }}>
        <Box className="track-index">#</Box>
        <Box className="track-title">Title</Box>
        {!hideAlbum && <Box className="track-album">Album</Box>}
        <Box className="track-duration">Duration</Box>
      </Box>

      <List>
        {tracks.map((item, index) => (
          <ListItem
            className="track-row"
            key={index + "" + item.trackId}
            sx={trackRowStyle}
            onClick={() => playTrackItem(item)}
          >
            <Box className="track-index" sx={{
              color: "text.secondary",
            }}>
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
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {!hideImage && (
                <ListItemAvatar>
                  <Avatar
                    variant="square"
                    alt={item?.title}
                    src={`${PROXY_URL}${item.thumbnailUrl}`}
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
              />
            </Box>

            {!hideAlbum && (
              <Box className="track-album" title={item.album?.title} sx={{
                color: "text.secondary",
                fontSize: "0.9rem",
              }}>
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

            <Box className="track-duration" sx={{
              color: "text.secondary",
            }}>{item.duration.label}</Box>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

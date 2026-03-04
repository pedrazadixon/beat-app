// prettier-ignore
import { PauseRounded, PlayArrowRounded, SkipNextRounded, SkipPreviousRounded, VolumeUpRounded, VolumeOffRounded, QueueMusicRounded, FavoriteRounded, FavoriteBorderRounded } from "@mui/icons-material";
import { playerStore, playerActions } from "../stores/playerStore.js";
import { Slider, IconButton, CircularProgress, Box, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { useStore } from "@nanostores/react";

import { PROXY_URL } from "../constants";
import { isLiked, toggleLike, addRecentPlay } from "../lib/idb";
import audioEl from "../audioEl.js";

const secondsToTime = (seconds) => {
  const totalSeconds = Math.floor(seconds);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
};

const playBtnSx = {
  background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
  color: "#fff",
  transition: "transform 200ms ease, box-shadow 200ms ease",
  "&:hover": {
    background: "linear-gradient(135deg, #6d28d9, #0891b2)",
    transform: "scale(1.08)",
    boxShadow: "0 4px 20px rgba(124, 58, 237, 0.4)",
  },
};

const sliderThumbSx = {
  width: 4,
  height: 4,
  transition: "0.3s cubic-bezier(.47,1.64,.41,.8)",
  "&::before": { boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)" },
  "&::after": { height: 38, width: 38 },
  "&:hover, &.Mui-focusVisible": {
    width: 12,
    height: 12,
    cursor: "pointer",
    boxShadow: "0px 0px 0px 8px rgba(124, 58, 237, 0.16)",
  },
  "&.Mui-active": { width: 16, height: 16 },
};

export default function Player() {
  const { isPlaying, duration, currentTime, currentTrack, isLoading } =
    useStore(playerStore);

  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(100);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    audioEl.muted = muted;
  }, [muted]);

  useEffect(() => {
    audioEl.volume = volume / 100;
  }, [volume]);

  // Check like status & record recent play when track changes
  useEffect(() => {
    if (currentTrack?.trackId) {
      isLiked(currentTrack.trackId).then(setLiked).catch(() => {});
      addRecentPlay(currentTrack).catch(() => {});
    }
  }, [currentTrack?.trackId]);

  const handleToggleLike = async () => {
    if (!currentTrack) return;
    const result = await toggleLike(currentTrack);
    setLiked(result);
  };

  return (
    <Box
      sx={{
        px: { xs: 1, sm: 2 },
        py: { xs: 2, sm: 1 },
        display: "flex",
        gap: { xs: 1, sm: 2 },
        alignItems: "center",
        justifyContent: "space-between",
        minHeight: { xs: 56, sm: 80 },
        flexWrap: { xs: "wrap", sm: "nowrap" },
      }}
    >
      {/* Track info */}
      <Box
        sx={{
          display: "flex",
          gap: { xs: 1, sm: 1.5 },
          alignItems: "center",
          minWidth: { xs: 0, sm: 200 },
          maxWidth: { xs: "none", sm: 300 },
          flex: { xs: "1 1 auto", sm: "0 0 auto" },
        }}
      >
        <Box
          sx={{
            width: { xs: 40, sm: 56 },
            height: { xs: 40, sm: 56 },
            borderRadius: 1,
            overflow: "hidden",
            flexShrink: 0,
            bgcolor: "rgba(148,163,184,0.1)",
          }}
        >
          {currentTrack?.thumbnailUrl && (
            <img
              src={`${PROXY_URL}${currentTrack.thumbnailUrl}`}
              alt="album cover"
              height="100%"
              width="100%"
              style={{ objectFit: "cover" }}
            />
          )}
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              fontSize: "0.9rem",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {currentTrack?.title ?? ""}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              opacity: 0.7,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "block",
            }}
          >
            {currentTrack?.artists[0]?.name ?? ""}
          </Typography>
        </Box>

        <IconButton
          aria-label="like"
          onClick={handleToggleLike}
          size="small"
          sx={{ ml: 0.5 }}
        >
          {liked ? (
            <FavoriteRounded sx={{ color: "#ec4899", fontSize: 20 }} />
          ) : (
            <FavoriteBorderRounded sx={{ color: "text.primary", fontSize: 20 }} />
          )}
        </IconButton>
      </Box>

      {/* Controls */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0,
          flexGrow: 1,
          maxWidth: { xs: "none", sm: 700 },
          order: { xs: -1, sm: 0 },
          width: { xs: "100%", sm: "auto" },
        }}
      >
        <Box sx={{ display: "flex", gap: "5px", alignItems: "center" }}>
          <IconButton
            aria-label="previous song"
            onClick={playerActions.playPrevious}
            size="small"
          >
            <SkipPreviousRounded sx={{ color: "text.primary" }} />
          </IconButton>
          <IconButton
            aria-label={isPlaying ? "pause" : "play"}
            onClick={playerActions.togglePause}
            sx={{
              width: { xs: 36, sm: 42 },
              height: { xs: 36, sm: 42 },
              ...playBtnSx,
            }}
          >
            {isLoading ? (
              <CircularProgress
                size={20}
                sx={{ color: "#fff", padding: "2px" }}
              />
            ) : isPlaying ? (
              <PauseRounded sx={{ fontSize: { xs: "1.4rem", sm: "1.8rem" }, color: "#fff" }} />
            ) : (
              <PlayArrowRounded sx={{ fontSize: { xs: "1.4rem", sm: "1.8rem" }, color: "#fff" }} />
            )}
          </IconButton>
          <IconButton
            aria-label="next song"
            onClick={playerActions.playNext}
            size="small"
          >
            <SkipNextRounded sx={{ color: "text.primary" }} />
          </IconButton>
        </Box>
        {/* Progress bar — hidden on mobile for compact layout */}
        <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            gap: 1,
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Typography
            variant="caption"
            sx={{ color: "text.secondary", minWidth: 32 }}
          >
            {secondsToTime(currentTime)}
          </Typography>
          <Slider
            aria-label="time-indicator"
            size="small"
            value={parseInt(currentTime * 5)}
            min={0}
            step={1}
            max={parseInt(duration * 5)}
            onChange={(_, value) => playerActions.seekTo(value / 5)}
            sx={{
              color: "primary.main",
              height: 4,
              cursor: "default",
              "& .MuiSlider-thumb": sliderThumbSx,
              "& .MuiSlider-rail": { opacity: 0.2 },
            }}
          />
          <Typography
            variant="caption"
            sx={{ color: "text.secondary", minWidth: 32, textAlign: "right" }}
          >
            {secondsToTime(duration)}
          </Typography>
        </Box>
      </Box>

      {/* Volume & extras — desktop only */}
      <Box
        sx={{
          display: "flex",
          gap: 0.5,
          alignItems: "center",
          minWidth: { xs: "auto", md: 180 },
          justifyContent: "flex-end",
        }}
      >
        <IconButton
          aria-label="mute"
          onClick={() => setMuted(!muted)}
          size="small"
        >
          {muted || volume === 0 ? (
            <VolumeOffRounded sx={{ color: "text.primary", fontSize: 20 }} />
          ) : (
            <VolumeUpRounded sx={{ color: "text.primary", fontSize: 20 }} />
          )}
        </IconButton>
        <Slider
          size="small"
          value={muted ? 0 : volume}
          onChange={(_, newValue) => {
            setVolume(newValue);
            if (newValue > 0 && muted) setMuted(false);
            if (newValue === 0 && !muted) setMuted(true);
          }}
          aria-label="Volume"
          sx={{
            color: "primary.main",
            width: 100,
            ml: 1,
            mr: 1,
            display: { xs: "none", md: "block" },
          }}
        />
        <IconButton onClick={() => playerActions.toggleQueue()} size="small">
          <QueueMusicRounded sx={{ color: "text.primary", fontSize: 20 }} />
        </IconButton>
      </Box>
    </Box>
  );
}

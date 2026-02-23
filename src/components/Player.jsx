// prettier-ignore
import { PauseRounded, PlayArrowRounded, SkipNextRounded, SkipPreviousRounded, VolumeUpRounded, VolumeOffRounded, QueueMusicRounded } from "@mui/icons-material";
import { playerStore, playerActions } from "../stores/playerStore.js";
import { Slider, IconButton, CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import { useStore } from "@nanostores/react";
import { useTheme } from "@mui/material/styles";
import { PROXY_URL } from "../constants";
import audioEl from "../audioEl.js";

const secondsToTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export default function Player() {
  const { isPlaying, duration, currentTime, currentTrack, isLoading } =
    useStore(playerStore);
  const theme = useTheme();
  const mainIconColor = theme.palette.mode === "dark" ? "#fff" : "#000";
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(100);

  useEffect(() => {
    audioEl.muted = muted;
  }, [muted]);

  useEffect(() => {
    audioEl.volume = volume / 100;
  }, [volume]);

  return (
    <div className="player-bar">
      <div className="track-info">
        <div
          style={{
            width: "60px",
            height: "60px",
          }}
        >
          {currentTrack?.thumbnailUrl && (
            <img
              src={`${PROXY_URL}${currentTrack.thumbnailUrl}`}
              alt="album cover"
              height="100%"
              width="100%"
            />
          )}
        </div>

        <div>
          <p>{currentTrack?.title ?? ""}</p>
          <p>{currentTrack?.artists[0]?.name ?? ""}</p>
        </div>
      </div>
      <div className="buttons-and-progress">
        <div
          style={{
            display: "flex",
            gap: "5px",
          }}
        >
          <IconButton aria-label="previous song" onClick={playerActions.playPrevious}>
            <SkipPreviousRounded htmlColor={mainIconColor} />
          </IconButton>
          <IconButton
            sx={{ padding: "3px" }}
            aria-label={isPlaying ? "pause" : "play"}
            onClick={playerActions.togglePause}
          >
            {isLoading ? (
              <CircularProgress
                size={40}
                sx={{
                  color: mainIconColor,
                  padding: "4px",
                }}
              />
            ) : isPlaying ? (
              <PauseRounded
                sx={{ fontSize: "2.5rem" }}
                htmlColor={mainIconColor}
              />
            ) : (
              <PlayArrowRounded
                sx={{ fontSize: "2.5rem" }}
                htmlColor={mainIconColor}
              />
            )}
          </IconButton>
          <IconButton aria-label="next song" onClick={playerActions.playNext}>
            <SkipNextRounded htmlColor={mainIconColor} />
          </IconButton>
        </div>
        <div className="progress-and-time">
          <small>{secondsToTime(currentTime)}</small>
          <Slider
            aria-label="time-indicator"
            size="small"
            value={parseInt(currentTime * 5)}
            min={0}
            step={1}
            max={parseInt(duration * 5)}
            onChange={(_, value) => playerActions.seekTo(value / 5)}
            sx={{
              color:
                theme.palette.mode === "dark" ? "#fff" : "rgba(0,0,0,0.87)",
              height: 4,
              cursor: "default",
              "& .MuiSlider-thumb": {
                width: 4,
                height: 4,
                transition: "0.3s cubic-bezier(.47,1.64,.41,.8)",
                "&::before": {
                  boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)",
                },
                "&::after": {
                  height: 38,
                  width: 38,
                },
                "&:hover, &.Mui-focusVisible": {
                  width: 8,
                  height: 8,
                  cursor: "pointer",
                  boxShadow: `0px 0px 0px 8px ${theme.palette.mode === "dark"
                      ? "rgb(255 255 255 / 16%)"
                      : "rgb(0 0 0 / 16%)"
                    }`,
                },
                "&.Mui-active": {
                  width: 20,
                  height: 20,
                },
              },
              "& .MuiSlider-rail": {
                opacity: 0.28,
              },
            }}
          />
          <small>{secondsToTime(duration)}</small>
        </div>
      </div>
      <div className="volume-and-others" style={{ display: "flex", alignItems: "center" }}>
        <IconButton aria-label="mute" onClick={() => setMuted(!muted)}>
          {muted || volume === 0 ? (
            <VolumeOffRounded htmlColor={mainIconColor} />
          ) : (
            <VolumeUpRounded htmlColor={mainIconColor} />
          )}
        </IconButton>
        <Slider
          size="small"
          value={muted ? 0 : volume}
          onChange={(_, newValue) => {
            setVolume(newValue);
            if (newValue > 0 && muted) {
              setMuted(false);
            }
            if (newValue === 0 && !muted) {
              setMuted(true);
            }
          }}
          aria-label="Volume"
          sx={{
            color: theme.palette.mode === "dark" ? "#fff" : "rgba(0,0,0,0.87)",
            width: 100,
            ml: 1,
            mr: 2,
          }}
        />
        <IconButton onClick={() => playerActions.toggleQueue()}>
          <QueueMusicRounded htmlColor={mainIconColor} />
        </IconButton>
      </div>
    </div>
  );
}

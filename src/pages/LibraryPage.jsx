import { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, IconButton } from "@mui/material";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import { getLikedSongs, getRecentPlays } from "../lib/idb";
import { playerActions } from "../stores/playerStore";
import TrackList from "../components/TrackList";
import PageLayout from "../layouts/PageLayout";
import PageContent from "../layouts/PageContent";

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

export default function LibraryPage() {
  const [likedSongs, setLikedSongs] = useState([]);
  const [recentPlays, setRecentPlays] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [liked, recent] = await Promise.all([
        getLikedSongs(),
        getRecentPlays(30),
      ]);
      setLikedSongs(liked);
      setRecentPlays(recent);
      setLoading(false);
    }
    loadData();
  }, []);

  const playAllLiked = () => {
    if (likedSongs.length > 0) {
      playerActions.playTrack(likedSongs[0], likedSongs);
    }
  };

  return (
    <PageLayout>
      <PageContent>
        <Box className="page-enter" sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
            Your Library
          </Typography>

          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
              <CircularProgress sx={{ color: "primary.main" }} />
            </Box>
          )}

          {!loading && (
            <>
              {/* Liked Songs Section */}
              <Box sx={{ mb: 4 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    mb: 2,
                    p: { xs: 2, sm: 3 },
                    borderRadius: 3,
                    background:
                      "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.1))",
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: 48, sm: 64 },
                      height: { xs: 48, sm: 64 },
                      borderRadius: 2,
                      background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <FavoriteRoundedIcon
                      sx={{ color: "#fff", fontSize: { xs: 24, sm: 32 } }}
                    />
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Liked Songs
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {likedSongs.length}{" "}
                      {likedSongs.length === 1 ? "song" : "songs"}
                    </Typography>
                  </Box>
                  {likedSongs.length > 0 && (
                    <IconButton
                      onClick={playAllLiked}
                      sx={{ width: 48, height: 48, ...playBtnSx }}
                    >
                      <PlayArrowRoundedIcon sx={{ fontSize: 28 }} />
                    </IconButton>
                  )}
                </Box>

                {likedSongs.length > 0 && <TrackList tracks={likedSongs} />}

                {likedSongs.length === 0 && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    Songs you like will appear here. Tap the heart icon on the
                    player to save songs.
                  </Typography>
                )}
              </Box>

              {/* Recently Played */}
              {recentPlays.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 2,
                    }}
                  >
                    <HistoryRoundedIcon sx={{ color: "text.secondary" }} />
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Recently Played
                    </Typography>
                  </Box>
                  <TrackList tracks={recentPlays} />
                </Box>
              )}
            </>
          )}
        </Box>
      </PageContent>
    </PageLayout>
  );
}

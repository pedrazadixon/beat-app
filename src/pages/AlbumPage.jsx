// prettier-ignore
import { useEffect, useState } from "react";
import { getAlbum } from "../services/youtube-api";
import { useParams } from "react-router-dom";
import { CircularProgress, Box, Typography, IconButton } from "@mui/material";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import TrackList from "../components/TrackList";
import PageContent from "../layouts/PageContent";
import PageLayout from "../layouts/PageLayout";
import { playerActions } from "../stores/playerStore";
import { PROXY_URL } from "../constants";

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

export default function AlbumPage() {
  const { albumId } = useParams();
  const [loading, setLoading] = useState(false);
  const [album, setAlbum] = useState(null);

  const fetchAlbum = async () => {
    setLoading(true);
    const response = await getAlbum(albumId);
    setAlbum(response);
    setLoading(false);
  };

  useEffect(() => {
    if (album !== null) return;
    fetchAlbum();
  }, []);

  const playAll = () => {
    if (album?.tracks?.length > 0) {
      playerActions.playTrack(album.tracks[0], album.tracks);
    }
  };

  return (
    <PageLayout>
      <PageContent>
        <Box className="page-enter">
          {album && (
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 3,
                p: { xs: 2, sm: 3 },
                alignItems: { xs: "center", sm: "flex-start" },
                background: (theme) =>
                  theme.palette.mode === "dark"
                    ? "linear-gradient(180deg, rgba(124,58,237,0.12) 0%, transparent 100%)"
                    : "linear-gradient(180deg, rgba(124,58,237,0.06) 0%, transparent 100%)",
              }}
            >
              <Box
                sx={{
                  width: { xs: 180, sm: 220 },
                  height: { xs: 180, sm: 220 },
                  borderRadius: 2,
                  overflow: "hidden",
                  flexShrink: 0,
                  boxShadow: "0 8px 10px rgba(0,0,0,0.2)",
                }}
              >
                <img
                  src={`${PROXY_URL}${album.thumbnailUrl}`}
                  alt={album.title}
                  width="100%"
                  height="100%"
                  style={{ objectFit: "cover" }}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: { xs: "center", sm: "end" },
                  alignItems: { xs: "center", sm: "flex-start" },
                  gap: 1,
                  textAlign: { xs: "center", sm: "left" },
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ textTransform: "uppercase", letterSpacing: 1 }}
                >
                  Album
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    lineHeight: 1.2,
                    fontSize: { xs: "1.5rem", sm: "2.125rem" },
                  }}
                >
                  {album.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {album.artist?.name}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <IconButton
                    onClick={playAll}
                    sx={{ width: 48, height: 48, ...playBtnSx }}
                  >
                    <PlayArrowRoundedIcon sx={{ fontSize: 28 }} />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          )}

          <Box>
            {loading && (
              <Box sx={{ display: "flex", justifyContent: "center", m: 5 }}>
                <CircularProgress sx={{ color: "primary.main" }} />
              </Box>
            )}
            {album && <TrackList tracks={album.tracks} hideImage hideAlbum />}
          </Box>
        </Box>
      </PageContent>
    </PageLayout>
  );
}

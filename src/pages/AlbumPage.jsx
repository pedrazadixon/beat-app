// prettier-ignore
import { useEffect, useState } from "react";
import { getAlbum } from "../services/youtube-api";
import { useParams, Link } from "react-router-dom";
import { CircularProgress, Box, Typography, IconButton } from "@mui/material";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import TrackList from "../components/TrackList";
import PageContent from "../layouts/PageContent";
import PageLayout from "../layouts/PageLayout";
import { playerActions } from "../stores/playerStore";
import { PROXY_URL } from "../constants";

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
                gap: 3,
                p: 2,
                background: (theme) =>
                  theme.palette.mode === "dark"
                    ? "linear-gradient(180deg, rgba(124,58,237,0.12) 0%, transparent 100%)"
                    : "linear-gradient(180deg, rgba(124,58,237,0.06) 0%, transparent 100%)",
              }}
            >
              <Box
                sx={{
                  width: 220,
                  height: 220,
                  borderRadius: 2,
                  overflow: "hidden",
                  flexShrink: 0,
                  boxShadow: "0 8px 40px rgba(0,0,0,0.3)",
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
                  justifyContent: "end",
                  gap: 1,
                }}
              >
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 1 }}>
                  Album
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                  {album.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {album.artist?.name}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <IconButton
                    className="play-btn-gradient"
                    onClick={playAll}
                    sx={{ width: 48, height: 48 }}
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

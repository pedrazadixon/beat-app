// prettier-ignore
import { getArtist, getPlaylistTracks, getArtistAlbums } from "../services/youtube-api";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CircularProgress, Box, Button, Typography, IconButton } from "@mui/material";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import TrackList from "../components/TrackList";
import PageContent from "../layouts/PageContent";
import PageLayout from "../layouts/PageLayout";
import AlbumGrid from "../components/AlbumGrid";
import { playerActions } from "../stores/playerStore";
import { PROXY_URL } from "../constants";

export default function ArtistPage() {
  const { artistId } = useParams();
  const [loading, setLoading] = useState(false);
  const [artist, setArtist] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [albums, setAlbums] = useState([]);

  const fetchArtist = async () => {
    setLoading(true);
    const [responseInfo, responseAlbums] = await Promise.all([
      getArtist(artistId),
      getArtistAlbums(artistId),
    ]);
    setArtist(responseInfo);
    setAlbums(responseAlbums.albums);

    if (responseInfo.tracksPlaylistId) {
      const responseTracks = await getPlaylistTracks(responseInfo.tracksPlaylistId);
      responseTracks.tracks = responseTracks.tracks.slice(0, 4);
      setTracks(responseTracks.tracks);
    } else {
      setTracks([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (artist !== null) return;
    fetchArtist();
  }, []);

  const playAllTracks = () => {
    if (tracks.length > 0) playerActions.playTrack(tracks[0], tracks);
  };

  return (
    <PageLayout>
      <PageContent>
        <Box className="page-enter">
          {artist && (
            <Box
              sx={{
                position: "relative",
                height: 320,
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: `url(${PROXY_URL}${artist.thumbnailUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  filter: "blur(2px)",
                  transform: "scale(1.05)",
                }}
              />
              <Box className="hero-gradient-overlay" />
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  p: 3,
                  display: "flex",
                  alignItems: "flex-end",
                  gap: 2,
                }}
              >
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: 1 }}>
                    Artist
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 800, color: "#fff", lineHeight: 1.1 }}>
                    {artist.name}
                  </Typography>
                  {artist.subscribers && (
                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)", mt: 0.5 }}>
                      {artist.subscribers}
                    </Typography>
                  )}
                </Box>
                {tracks.length > 0 && (
                  <IconButton
                    className="play-btn-gradient"
                    onClick={playAllTracks}
                    sx={{ width: 56, height: 56 }}
                  >
                    <PlayArrowRoundedIcon sx={{ fontSize: 32 }} />
                  </IconButton>
                )}
              </Box>
            </Box>
          )}

          <Box sx={{ paddingBlock: 3 }}>
            {tracks.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
                  Top Tracks
                </Typography>
                <TrackList tracks={tracks} hideImage hideAlbum />
              </Box>
            )}

            {loading && (
              <Box sx={{ display: "flex", justifyContent: "center", m: 5 }}>
                <CircularProgress sx={{ color: "primary.main" }} />
              </Box>
            )}

            {albums.length > 0 && (
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  Albums
                </Typography>
                <AlbumGrid albums={albums} onlyOneRow hideArtist />
                <Box sx={{ display: "flex", justifyContent: "center", m: 2 }}>
                  <Button
                    variant="outlined"
                    component={Link}
                    to={`/artist/${artistId}/albums`}
                    sx={{ borderColor: "divider" }}
                  >
                    View all albums
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </PageContent>
    </PageLayout>
  );
}

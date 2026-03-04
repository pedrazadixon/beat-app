import {
  getArtist,
  getArtistAlbums,
  getArtistAlbumsContinuations,
} from "../services/youtube-api";
import { useEffect, useState, useRef, useCallback } from "react";
import AlbumGrid from "../components/AlbumGrid";
import { useParams } from "react-router-dom";
import { CircularProgress, Box, Typography } from "@mui/material";
import PageContent from "../layouts/PageContent";
import PageLayout from "../layouts/PageLayout";
import { PROXY_URL } from "../constants";

export default function ArtistAlbumsPage() {
  const { artistId } = useParams();
  const [loading, setLoading] = useState(false);
  const [albums, setAlbums] = useState([]);
  const [artist, setArtist] = useState(null);
  const [continuation, setContinuation] = useState(null);
  const [vd, setVd] = useState(null);
  const observerTarget = useRef(null);

  const fetchArtistAlbums = async () => {
    setLoading(true);
    const [responseInfo, responseAlbums] = await Promise.all([
      getArtist(artistId),
      getArtistAlbums(artistId),
    ]);
    setArtist(responseInfo);
    setAlbums(responseAlbums.albums);
    setContinuation(responseAlbums.continuation || null);
    setVd(responseAlbums.vd || null);
    setLoading(false);
  };

  const fetchContinuations = useCallback(async () => {
    if (loading || !continuation) return;
    setLoading(true);
    const response = await getArtistAlbumsContinuations(continuation, vd);
    setAlbums((prev) => [...prev, ...response.albums]);
    setContinuation(response.continuation || null);
    setVd(response.vd || null);
    setLoading(false);
  }, [continuation, vd, loading]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && continuation) {
          fetchContinuations();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [loading, continuation, fetchContinuations]);

  useEffect(() => {
    if (albums.length !== 0) return;
    fetchArtistAlbums();
  }, []);

  return (
    <PageLayout>
      <PageContent>
        {artist && (
          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: { xs: 200, sm: 300 },
              overflow: "hidden",
            }}
          >
            {/* Background image */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                backgroundImage: `url(${PROXY_URL}${artist.thumbnailUrl})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            {/* Dark overlay */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                bgcolor: "rgba(0, 0, 0, 0.5)",
              }}
            />
            {/* Bottom gradient + text */}
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                p: { xs: 2, sm: 3 },
                pt: 6,
                color: "white",
                background: "linear-gradient(0deg, black, transparent)",
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  m: 0,
                  fontSize: { xs: "1.8rem", sm: "3rem" },
                }}
              >
                {artist.name}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Artist
              </Typography>
            </Box>
          </Box>
        )}

        {loading && albums.length === 0 && (
          <Box sx={{ display: "flex", justifyContent: "center", m: 5 }}>
            <CircularProgress />
          </Box>
        )}

        {albums.length > 0 && (
          <Box sx={{ px: { xs: 1, sm: 2 } }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, mt: 2, mb: 1, px: 1 }}
            >
              Albums
            </Typography>
            <AlbumGrid albums={albums} hideArtist />
          </Box>
        )}

        {continuation && albums.length > 0 && (
          <Box
            ref={observerTarget}
            sx={{
              display: "flex",
              justifyContent: "center",
              m: 3,
              p: 3,
            }}
          >
            {loading && <CircularProgress />}
          </Box>
        )}
      </PageContent>
    </PageLayout>
  );
}

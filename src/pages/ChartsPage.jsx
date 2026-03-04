import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CircularProgress,
  Avatar,
} from "@mui/material";
import { Link } from "react-router-dom";
import { getCharts } from "../services/home-api";
import { PROXY_URL } from "../constants";
import TrackList from "../components/TrackList";
import HorizontalScroll from "../components/HorizontalScroll";
import PageLayout from "../layouts/PageLayout";
import PageContent from "../layouts/PageContent";

const sectionCardSx = {
  textDecoration: "none",
  bgcolor: "background.paper",
  flexShrink: 0,
  minWidth: { xs: 150, sm: 180 },
  maxWidth: { xs: 150, sm: 180 },
  transition: "transform 200ms ease, box-shadow 200ms ease",
  "&:hover": {
    transform: "scale(1.02)",
    boxShadow: "0 8px 30px rgba(124, 58, 237, 0.12)",
  },
};

export default function ChartsPage() {
  const [chartsData, setChartsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      setLoading(true);
      const data = await getCharts();
      if (mounted) {
        setChartsData(data);
        setLoading(false);
      }
    }
    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  const mapChartTrack = (item) => ({
    trackId: item.videoId || item.id,
    title: item.title,
    artists: item.artists || [],
    album: item.album
      ? {
          title: item.album.name || item.album.title,
          albumId: item.album.id || item.album.browseId,
        }
      : null,
    thumbnailUrl: item.thumbnail,
    duration: { label: item.duration || "0:00" },
    isExplicit: item.explicit || false,
  });

  const trendingSongs = (chartsData?.sections || []).find(
    (s) =>
      s.title?.toLowerCase().includes("song") ||
      s.title?.toLowerCase().includes("track")
  );
  const trendingArtists = (chartsData?.sections || []).find((s) =>
    s.title?.toLowerCase().includes("artist")
  );
  const trendingAlbums = (chartsData?.sections || []).find((s) =>
    s.title?.toLowerCase().includes("album")
  );

  const songs = trendingSongs?.items || chartsData?.songs || [];
  const artists = trendingArtists?.items || chartsData?.artists || [];
  const albums = trendingAlbums?.items || chartsData?.albums || [];

  return (
    <PageLayout>
      <PageContent>
        <Box className="page-enter" sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
            Charts
          </Typography>

          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
              <CircularProgress sx={{ color: "primary.main" }} />
            </Box>
          )}

          {/* Trending Songs */}
          {songs.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                🔥 Trending Songs
              </Typography>
              <TrackList tracks={songs.slice(0, 20).map(mapChartTrack)} />
            </Box>
          )}

          {/* Trending Artists */}
          {artists.length > 0 && (
            <HorizontalScroll title="📈 Top Artists">
              {artists.map((item, i) => (
                <Card
                  key={i}
                  component={Link}
                  to={`/artist/${item.browseId || item.id}`}
                  sx={{ ...sectionCardSx, textAlign: "center" }}
                >
                  <Avatar
                    src={
                      item.thumbnail
                        ? `${PROXY_URL}${item.thumbnail}`
                        : ""
                    }
                    sx={{ width: 150, height: 150, mx: "auto", mt: 2 }}
                  />
                  <CardContent sx={{ pb: "12px !important" }}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600 }}
                      noWrap
                    >
                      {item.title || item.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.subscribers || "Artist"}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </HorizontalScroll>
          )}

          {/* Top Albums */}
          {albums.length > 0 && (
            <HorizontalScroll title="💿 Top Albums">
              {albums.map((item, i) => (
                <Card
                  key={i}
                  component={Link}
                  to={`/album/${item.browseId || item.id}`}
                  sx={sectionCardSx}
                >
                  <CardMedia
                    sx={{ height: { xs: 150, sm: 180 }, width: { xs: 150, sm: 180 } }}
                    image={
                      item.thumbnail
                        ? `${PROXY_URL}${item.thumbnail}`
                        : ""
                    }
                  />
                  <CardContent sx={{ pb: "12px !important" }}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600 }}
                      noWrap
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      noWrap
                    >
                      {item.artists?.[0]?.name || item.year || ""}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </HorizontalScroll>
          )}

          {/* Fallback: render all sections generically */}
          {!trendingSongs &&
            !trendingArtists &&
            !trendingAlbums &&
            !loading &&
            chartsData?.sections?.map((section, idx) => (
              <HorizontalScroll key={idx} title={section.title}>
                {(section.items || []).map((item, i) => (
                  <Card
                    key={i}
                    component={Link}
                    to={
                      item.browseId
                        ? item.type === "artist"
                          ? `/artist/${item.browseId}`
                          : `/album/${item.browseId}`
                        : "#"
                    }
                    sx={sectionCardSx}
                  >
                    <CardMedia
                      sx={{ height: { xs: 150, sm: 180 }, width: { xs: 150, sm: 180 } }}
                      image={
                        item.thumbnail
                          ? `${PROXY_URL}${item.thumbnail}`
                          : ""
                      }
                    />
                    <CardContent sx={{ pb: "12px !important" }}>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600 }}
                        noWrap
                      >
                        {item.title}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </HorizontalScroll>
            ))}
        </Box>
      </PageContent>
    </PageLayout>
  );
}

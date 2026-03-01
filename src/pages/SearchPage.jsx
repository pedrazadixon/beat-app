import { useEffect, useState } from "react";
import { Box, Typography, Chip, CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import { getCharts } from "../services/home-api";
import { PROXY_URL } from "../constants";
import HorizontalScroll from "../components/HorizontalScroll";
import { Card, CardMedia, CardContent, Avatar } from "@mui/material";
import PageLayout from "../layouts/PageLayout";
import PageContent from "../layouts/PageContent";

export default function SearchPage() {
  const [trendingSections, setTrendingSections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function fetchTrending() {
      setLoading(true);
      const data = await getCharts();
      if (mounted) {
        setTrendingSections(data.sections || []);
        setLoading(false);
      }
    }
    fetchTrending();
    return () => { mounted = false; };
  }, []);

  return (
    <PageLayout>
      <PageContent>
        <Box className="page-enter" sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
            <TrendingUpRoundedIcon sx={{ color: "primary.main" }} />
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Trending Now
            </Typography>
          </Box>

          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
              <CircularProgress sx={{ color: "primary.main" }} />
            </Box>
          )}

          {trendingSections.map((section, idx) => (
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
                  className="section-card"
                  sx={{ textDecoration: "none", bgcolor: "background.paper", flexShrink: 0 }}
                >
                  {item.type === "artist" ? (
                    <Avatar
                      src={item.thumbnail ? `${PROXY_URL}${item.thumbnail}` : ""}
                      sx={{ width: 150, height: 150, mx: "auto", mt: 2 }}
                    />
                  ) : (
                    <CardMedia
                      sx={{ height: 180, width: 180 }}
                      image={item.thumbnail ? `${PROXY_URL}${item.thumbnail}` : ""}
                    />
                  )}
                  <CardContent sx={{ pb: "12px !important", pt: 1.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                      {item.title || item.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {item.subtitle || item.subscribers || ""}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </HorizontalScroll>
          ))}

          {!loading && trendingSections.length === 0 && (
            <Box sx={{ textAlign: "center", mt: 8 }}>
              <Typography variant="h6" color="text.secondary">
                Start searching for music above
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Find your favorite tracks, albums, and artists
              </Typography>
            </Box>
          )}
        </Box>
      </PageContent>
    </PageLayout>
  );
}

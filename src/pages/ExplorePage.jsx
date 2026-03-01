import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CircularProgress,
  Chip,
} from "@mui/material";
import { Link } from "react-router-dom";
import { getExplore, getNewReleases } from "../services/home-api";
import { PROXY_URL } from "../constants";
import PageLayout from "../layouts/PageLayout";
import PageContent from "../layouts/PageContent";

export default function ExplorePage() {
  const [explore, setExplore] = useState(null);
  const [newReleases, setNewReleases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      setLoading(true);
      const [exploreData, releases] = await Promise.all([
        getExplore(),
        getNewReleases(),
      ]);
      if (mounted) {
        setExplore(exploreData);
        setNewReleases(releases);
        setLoading(false);
      }
    }
    fetchData();
    return () => { mounted = false; };
  }, []);

  return (
    <PageLayout>
      <PageContent>
        <Box className="page-enter" sx={{ p: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
            Explore
          </Typography>

          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
              <CircularProgress sx={{ color: "primary.main" }} />
            </Box>
          )}

          {/* Mood & Genre Chips from explore */}
          {explore?.sections && (
            <Box sx={{ mb: 4 }}>
              {explore.sections.map((section, idx) => (
                <Box key={idx} sx={{ mb: 3 }}>
                  {section.title && (
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5 }}>
                      {section.title}
                    </Typography>
                  )}
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {(section.items || []).map((item, i) => (
                      <Chip
                        key={i}
                        label={item.title}
                        component={Link}
                        to={item.browseId ? `/search/${encodeURIComponent(item.title)}` : "#"}
                        clickable
                        sx={{
                          fontSize: "0.85rem",
                          fontWeight: 500,
                          py: 2.5,
                          px: 1,
                          bgcolor: item.color || "background.paper",
                          "&:hover": {
                            bgcolor: "primary.dark",
                            color: "white",
                          },
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              ))}
            </Box>
          )}

          {/* New Releases */}
          {newReleases.length > 0 && (
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                New Releases
              </Typography>
              <Box
                className="album-grid"
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                  gap: 2,
                }}
              >
                {newReleases.map((album, idx) => (
                  <Card
                    key={idx}
                    component={Link}
                    to={`/album/${album.browseId || album.id}`}
                    className="album-item"
                    sx={{ textDecoration: "none", bgcolor: "background.paper" }}
                  >
                    <CardMedia
                      sx={{ height: 180, width: "100%" }}
                      image={album.thumbnail ? `${PROXY_URL}${album.thumbnail}` : ""}
                    />
                    <CardContent sx={{ pb: "12px !important" }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                        {album.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" noWrap>
                        {album.artists?.[0]?.name || album.year || ""}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </PageContent>
    </PageLayout>
  );
}

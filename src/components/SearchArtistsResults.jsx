import {
  Card,
  CardMedia,
  Typography,
  CardContent,
  Box,
  CircularProgress,
  Button,
} from "@mui/material";
import {
  searchArtists,
  searchArtistsContinuations,
} from "../services/youtube-api";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { PROXY_URL } from "../constants";

const artistGridSx = (onlyOneRow) => ({
  mt: 2,
  display: "grid",
  p: 1,
  gridTemplateColumns: {
    xs: "repeat(auto-fill, minmax(140px, 1fr))",
    sm: "repeat(auto-fill, minmax(180px, 1fr))",
  },
  gap: { xs: "14px", sm: "0px 16px" },
  gridTemplateRows: "auto",
  ...(onlyOneRow && {
    gridAutoRows: 0,
    overflow: "hidden",
  }),
});

const artistItemSx = {
  textDecoration: "none",
  mb: 2,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
  cursor: "pointer",
  borderRadius: 4,
  bgcolor: (t) =>
    t.palette.mode === "dark"
      ? "rgba(26, 26, 46, 0.6)"
      : "rgba(255, 255, 255, 0.7)",
  border: "1px solid",
  borderColor: (t) =>
    t.palette.mode === "dark"
      ? "rgba(148, 163, 184, 0.08)"
      : "rgba(0, 0, 0, 0.06)",
  backdropFilter: "blur(20px)",
  p: { xs: "14px 8px 10px", sm: "20px 12px 14px" },
  transition: "transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease",
  "&:hover": {
    transform: "scale(1.02)",
    boxShadow: "0 4px 12px rgba(124, 58, 237, 0.18)",
    borderColor: "rgba(124, 58, 237, 0.3)",
  },
  "&:hover .artist-avatar-ring": {
    boxShadow: "0 0 20px rgba(124, 58, 237, 0.35)",
  },
};

export default function SearchArtistsResults({
  hideLoadMore = false,
  onlyOneRow = false,
  showRouterLink = false,
}) {
  const { query } = useParams();
  const [results, setResults] = useState([]);
  const [continuation, setContinuation] = useState(null);
  const [initLoading, setInitLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  async function fetchAlbums() {
    setInitLoading(true);
    setResults([]);
    setContinuation(null);
    const response = await searchArtists(query);
    setResults(response.artists);
    setContinuation(response.continuation || null);
    setInitLoading(false);
  }

  async function fetchContinuations() {
    setLoading(true);
    const response = await searchArtistsContinuations(continuation);
    setResults([...results, ...response.artists]);
    setContinuation(response.continuation || null);
    setLoading(false);
  }

  useEffect(() => {
    fetchAlbums();
  }, [query]);

  return (
    <Box>
      {initLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", m: 5 }}>
          <CircularProgress />
        </Box>
      )}

      {!initLoading && results.length === 0 && (
        <Box sx={{ display: "flex", justifyContent: "center", m: 5 }}>
          <Typography variant="body1" color="text.secondary">
            No results found
          </Typography>
        </Box>
      )}

      <Box sx={artistGridSx(onlyOneRow)}>
        {results.map((item, index) => (
          <Card
            key={index + item.artistId}
            component={Link}
            to={`/artist/${item.artistId}`}
            elevation={0}
            sx={artistItemSx}
          >
            {/* Avatar wrapper – gradient ring */}
            <Box
              className="artist-avatar-ring"
              sx={{
                position: "relative",
                width: { xs: 100, sm: 130 },
                height: { xs: 100, sm: 130 },
                borderRadius: "50%",
                background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
                flexShrink: 0,
                transition: "box-shadow 200ms ease",
              }}
            >
              <CardMedia
                component="img"
                image={`${PROXY_URL}${item.thumbnailUrl}`}
                alt={item.name}
                sx={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            </Box>
            <CardContent
              sx={{
                textAlign: "center",
                p: "12px 4px 8px !important",
                width: "100%",
              }}
            >
              <Typography
                variant="subtitle2"
                component="div"
                noWrap
                title={item.name}
                sx={{ fontWeight: 600, fontSize: "0.875rem", lineHeight: 1.3 }}
              >
                {item.name}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  opacity: 0.55,
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                Artist
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {continuation && results.length > 0 && hideLoadMore !== true && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4, mb: 2 }}>
          <Button
            variant="contained"
            loading={loading}
            onClick={fetchContinuations}
            sx={{
              background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
              borderRadius: "24px",
              px: 4,
              "&:hover": {
                background: "linear-gradient(135deg, #6d28d9, #0891b2)",
              },
            }}
          >
            Load more
          </Button>
        </Box>
      )}

      {!initLoading && results.length > 0 && showRouterLink && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3, mb: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            component={Link}
            to={`/search/${query}/artists`}
            sx={{ borderRadius: "24px", px: 4 }}
          >
            View All Artists
          </Button>
        </Box>
      )}
    </Box>
  );
}

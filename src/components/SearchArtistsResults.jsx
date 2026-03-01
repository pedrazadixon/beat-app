import { Card, CardMedia, Typography, CardContent, Box, CircularProgress, Button } from "@mui/material";
import { searchArtists, searchArtistsContinuations } from "../services/youtube-api";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { PROXY_URL } from "../constants";

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
    <div className="artist-results-wrapper">
      {initLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", m: 5 }}>
          <CircularProgress />
        </Box>
      )}

      {!initLoading && results.length === 0 && (
        <Box sx={{ display: "flex", justifyContent: "center", m: 5 }}>
          <Typography variant="body1" sx={{ opacity: 0.6 }}>
            No results found
          </Typography>
        </Box>
      )}

      <div className={`artist-grid ${onlyOneRow ? "artist-grid--single-row" : ""}`}>
        {results.map((item, index) => (
          <Card
            key={index + item.artistId}
            component={Link}
            to={`/artist/${item.artistId}`}
            className="artist-item"
            elevation={0}
          >
            <div className="artist-avatar-wrapper">
              <CardMedia
                component="img"
                className="artist-avatar"
                image={`${PROXY_URL}${item.thumbnailUrl}`}
                alt={item.name}
              />
            </div>
            <CardContent className="artist-card-content">
              <Typography
                variant="subtitle2"
                component="div"
                className="artist-name"
                noWrap
                title={item.name}
              >
                {item.name}
              </Typography>
              <Typography variant="caption" className="artist-label">
                Artist
              </Typography>
            </CardContent>
          </Card>
        ))}
      </div>

      {continuation && results.length > 0 && hideLoadMore !== true && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4, mb: 2 }}>
          <Button
            variant="contained"
            loading={loading}
            onClick={fetchContinuations}
            className="play-btn-gradient"
            sx={{
              borderRadius: "24px",
              px: 4,
              textTransform: "none",
              fontWeight: 600,
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
            sx={{
              borderRadius: "24px",
              px: 4,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            View All Artists
          </Button>
        </Box>
      )}
    </div>
  );
}

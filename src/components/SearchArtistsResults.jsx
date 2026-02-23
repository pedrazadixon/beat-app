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

  const artistGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr)",
    columnGap: 8,
    rowGap: 6,
    justifyItems: "center",
    marginTop: 20,
  };

  if (onlyOneRow) {
    artistGridStyle.gridTemplateRows = "auto";
    artistGridStyle.gridAutoRows = 0;
    artistGridStyle.gridRowGap = 0;
  }

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
    <div style={{ paddingInline: 10 }}>
      {initLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", m: 5 }}>
          <CircularProgress />
        </Box>
      )}

      {!initLoading && results.length === 0 && (
        <Box sx={{ display: "flex", justifyContent: "center", m: 5 }}>
          <div>No results found</div>
        </Box>
      )}

      <div style={artistGridStyle} className="artist-grid">
        {results.map((item, index) => (
          <Card
            key={index + item.artistId}
            component={Link}
            to={`/artist/${item.artistId}`}
            className="artist-item"
          >
            <CardMedia
              sx={{ height: 150, width: 150, borderRadius: "50%" }}
              image={`${PROXY_URL}${item.thumbnailUrl}`}
            />
            <CardContent>
              <Typography variant="body1" component="div">
                {item.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Artist
              </Typography>
            </CardContent>
          </Card>
        ))}
      </div>

      {continuation && results.length > 0 && hideLoadMore !== true && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            m: 3,
          }}
        >
          <Button
            variant="contained"
            loading={loading}
            onClick={fetchContinuations}
          >
            Load more
          </Button>
        </Box>
      )}

      {!initLoading && results.length > 0 && showRouterLink && (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            variant="outlined"
            color="primary"
            component={Link}
            to={`/search/${query}/artists`}
          >
            View All Artists
          </Button>
        </Box>
      )}
    </div>
  );
}

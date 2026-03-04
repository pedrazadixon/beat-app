// prettier-ignore
import { Box, CircularProgress, Button, Typography } from "@mui/material";
// prettier-ignore
import { searchAlbums, searchAlbumsContinuations } from "../services/youtube-api";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import AlbumGrid from "./AlbumGrid";

export default function SearchAlbumsResults({
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
    const response = await searchAlbums(query);
    setResults(response.albums);
    setContinuation(response.continuation || null);
    setInitLoading(false);
  }

  async function fetchContinuations() {
    setLoading(true);
    const response = await searchAlbumsContinuations(continuation);
    setResults([...results, ...response.albums]);
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

      <AlbumGrid albums={results} onlyOneRow={onlyOneRow} />

      {continuation && results.length > 0 && hideLoadMore !== true && (
        <Box sx={{ display: "flex", justifyContent: "center", m: 3 }}>
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
            to={`/search/${query}/albums`}
          >
            View All Albums
          </Button>
        </Box>
      )}
    </Box>
  );
}

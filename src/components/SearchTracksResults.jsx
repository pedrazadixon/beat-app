// prettier-ignore
import { Box, CircularProgress, Button } from "@mui/material";
// prettier-ignore
import { searchTracks, searchTracksContinuations } from "../services/youtube-api";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import TrackList from "./TrackList";

export default function SearchTracksResults({
  hideLoadMore = false,
  limit = false,
  showRouterLink = false,
}) {
  const { query } = useParams();
  const [results, setResults] = useState([]);
  const [continuation, setContinuation] = useState(null);
  const [initLoading, setInitLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  async function fetchTracks() {
    setInitLoading(true);
    setResults([]);
    setContinuation(null);
    const response = await searchTracks(query);
    setContinuation(response.continuation || null);

    if (limit !== false) {
      response.tracks = response.tracks.slice(0, limit);
    }

    setResults(response.tracks);
    setInitLoading(false);
  }

  async function fetchContinuations() {
    setLoading(true);
    const response = await searchTracksContinuations(continuation);
    setContinuation(response.continuation || null);
    setResults([...results, ...response.tracks]);
    setLoading(false);
  }

  useEffect(() => {
    fetchTracks();
  }, [query]);

  return (
    <div>
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

      {results.length > 0 && <TrackList tracks={results} />}

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
            to={`/search/${query}/tracks`}
          >
            View All Tracks
          </Button>
        </Box>
      )}
    </div>
  );
}

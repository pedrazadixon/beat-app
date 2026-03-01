import { Box, Tabs, Tab } from "@mui/material";
import { Link, useParams, useLocation } from "react-router-dom";

export default function SearchTabs() {
  const { query } = useParams();
  const location = useLocation();

  // Determine the active tab based on the current path
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.endsWith("/tracks")) return "tracks";
    if (path.endsWith("/albums")) return "albums";
    if (path.endsWith("/artists")) return "artists";
    return "all";
  };

  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      <Tabs value={getActiveTab()} aria-label="search tabs">
        <Tab
          label="All"
          value="all"
          component={Link}
          to={`/search/${query}`}
        />
        <Tab
          label="Tracks"
          value="tracks"
          component={Link}
          to={`/search/${query}/tracks`}
        />
        <Tab
          label="Albums"
          value="albums"
          component={Link}
          to={`/search/${query}/albums`}
        />
        <Tab
          label="Artists"
          value="artists"
          component={Link}
          to={`/search/${query}/artists`}
        />
      </Tabs>
    </Box>
  );
}

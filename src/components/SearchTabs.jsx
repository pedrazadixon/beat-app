import { Box, Tabs, Tab } from "@mui/material";
import { Link, useParams } from "react-router-dom";

export default function SearchTabs() {
  const { query } = useParams();

  return (
    <Box sx={{ display: "flex", gap: 2, marginBlock: 1 }}>
      <Tabs value={"/search/:query"} aria-label="lab API tabs example">
        <Tab
          label="All"
          value="/search/:query"
          component={Link}
          to={`/search/${query}`}
        />
        <Tab
          label="Tracks"
          value="/search/:query/tracks"
          component={Link}
          to={`/search/${query}/tracks`}
        />
        <Tab
          label="Albums"
          value="/search/:query/albums"
          component={Link}
          to={`/search/${query}/albums`}
        />
        <Tab
          label="Artists"
          value="/search/:query/artists"
          component={Link}
          to={`/search/${query}/artists`}
        />
      </Tabs>
    </Box>
  );
}

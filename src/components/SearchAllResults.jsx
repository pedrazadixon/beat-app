import { Typography, Box } from "@mui/material";
import SearchAlbumsResults from "./SearchAlbumsResults";
import SearchArtistsResults from "./SearchArtistsResults";
import SearchTracksResults from "./SearchTracksResults";

export default function SearchAllResults() {
  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
        Tracks
      </Typography>
      <SearchTracksResults hideLoadMore showRouterLink limit="4" />

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>
        Artists
      </Typography>
      <SearchArtistsResults hideLoadMore showRouterLink onlyOneRow />

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>
        Albums
      </Typography>
      <SearchAlbumsResults hideLoadMore showRouterLink onlyOneRow />
    </Box>
  );
}

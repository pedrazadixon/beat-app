import App from "./App";
import HomePage from "./pages/HomePage";
import ExplorePage from "./pages/ExplorePage";
import ChartsPage from "./pages/ChartsPage";
import LibraryPage from "./pages/LibraryPage";
import SearchPage from "./pages/SearchPage";
import AlbumPage from "./pages/AlbumPage";
import ArtistPage from "./pages/ArtistPage";
import ArtistAlbumsPage from "./pages/ArtistAlbumsPage";
import SearchAllPage from "./pages/SearchAllPage";
import SearchArtistsPage from "./pages/SearchArtistsPage";
import SearchTracksPage from "./pages/SearchTracksPage";
import SearchAlbumsPage from "./pages/SearchAlbumsPage";
import { Box, Typography } from "@mui/material";

export default [
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "explore",
        element: <ExplorePage />,
      },
      {
        path: "charts",
        element: <ChartsPage />,
      },
      {
        path: "library",
        element: <LibraryPage />,
      },
      {
        path: "library/likes",
        element: <LibraryPage />,
      },
      {
        path: "search/:query",
        element: <SearchAllPage />,
      },
      {
        path: "search/:query/tracks",
        element: <SearchTracksPage />,
      },
      {
        path: "search/:query/albums",
        element: <SearchAlbumsPage />,
      },
      {
        path: "search/:query/artists",
        element: <SearchArtistsPage />,
      },
      {
        path: "search",
        element: <SearchPage />,
      },
      {
        path: "album/:albumId",
        element: <AlbumPage />,
      },
      {
        path: "artist/:artistId/albums",
        element: <ArtistAlbumsPage />,
      },
      {
        path: "artist/:artistId",
        element: <ArtistPage />,
      },
      {
        path: "*",
        element: (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', textAlign: 'center' }}>
            <Typography variant="h2" fontWeight="bold" className="gradient-text">404</Typography>
            <Typography variant="h5" color="text.secondary">Page not found</Typography>
          </Box>
        ),
      },
    ],
  },
];

// prettier-ignore
import { getArtist, getPlaylistTracks, getArtistAlbums } from "../services/youtube-api";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CircularProgress, Box, Button } from "@mui/material";
import TrackList from "../components/TrackList";
import PageContent from "../layouts/PageContent";
import PageHeader from "../layouts/PageHeader";
import PageLayout from "../layouts/PageLayout";
import AlbumGrid from "../components/AlbumGrid";
import { PROXY_URL } from "../constants";

export default function ArtistPage() {
  const { artistId } = useParams();

  const [loading, setLoading] = useState(false);
  const [artist, setArtist] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [albums, setAlbums] = useState([]);

  const fetchArtist = async () => {
    setLoading(true);

    // get artist primary info and albums concurrently
    const [responseInfo, responseAlbums] = await Promise.all([
      getArtist(artistId),
      getArtistAlbums(artistId),
    ]);

    setArtist(responseInfo);
    setAlbums(responseAlbums.albums);

    // get artist top tracks after getting artist info
    if (responseInfo.tracksPlaylistId) {
      const responseTracks = await getPlaylistTracks(
        responseInfo.tracksPlaylistId
      );

      responseTracks.tracks = responseTracks.tracks.slice(0, 4);
      setTracks(responseTracks.tracks);
    } else {
      setTracks([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (artist !== null) return;
    fetchArtist();
  }, []);

  return (
    <PageLayout>
      <PageContent>
        {artist && (
          <>
            <Box>
              <div
                style={{
                  backgroundImage: `url(${PROXY_URL}${artist.thumbnailUrl})`,
                  width: "100%",
                  height: 300,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                  }}
                ></div>
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    paddingTop: 50,
                    color: "white",
                    padding: 10,
                    background: "linear-gradient(0deg, black, transparent)",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "start",
                    }}
                  >
                    <h1 style={{ margin: 0 }}>{artist.name}</h1>
                    <div>Artist</div>
                  </Box>
                </div>
              </div>
            </Box>
          </>
        )}

        {tracks.length > 0 && (
          <>
            <h4>Top Tracks</h4>
            <TrackList tracks={tracks} hideImage hideAlbum />
          </>
        )}

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", m: 5 }}>
            <CircularProgress />
          </Box>
        )}

        {albums.length > 0 && (
          <>
            <h4>Albums</h4>
            <AlbumGrid albums={albums} onlyOneRow hideArtist />
            <Box sx={{ display: "flex", justifyContent: "center", m: 2 }}>
              <Button
                variant="outlined"
                component={Link}
                to={`/artist/${artistId}/albums`}
              >
                View all albums
              </Button>
            </Box>
          </>
        )}
      </PageContent>
    </PageLayout>
  );
}

import { getArtist, getArtistAlbums, getArtistAlbumsContinuations } from "../services/youtube-api";
import { useEffect, useState, useRef, useCallback } from "react";
import AlbumGrid from "../components/AlbumGrid";
import { useParams } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";
import PageContent from "../layouts/PageContent";
import PageLayout from "../layouts/PageLayout";
import { PROXY_URL } from "../constants";

export default function ArtistAlbumsPage() {
  const { artistId } = useParams();
  const [loading, setLoading] = useState(false);
  const [albums, setAlbums] = useState([]);
  const [artist, setArtist] = useState(null);
  const [continuation, setContinuation] = useState(null);
  const [vd, setVd] = useState(null);
  const observerTarget = useRef(null);

  const fetchArtistAlbums = async () => {
    setLoading(true);
    const [responseInfo, responseAlbums] = await Promise.all([
      getArtist(artistId),
      getArtistAlbums(artistId),
    ]);
    // console.log(responseInfo);
    // console.log(responseAlbums);
    setArtist(responseInfo);
    setAlbums(responseAlbums.albums);
    setContinuation(responseAlbums.continuation || null);
    setVd(responseAlbums.vd || null);
    setLoading(false);
  };

  const fetchContinuations = useCallback(async () => {
    if (loading || !continuation) return;
    setLoading(true);
    const response = await getArtistAlbumsContinuations(continuation, vd);
    setAlbums((prev) => [...prev, ...response.albums]);
    setContinuation(response.continuation || null);
    setVd(response.vd || null);
    setLoading(false);
  }, [continuation, vd, loading]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && continuation) {
          fetchContinuations();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [loading, continuation, fetchContinuations]);

  useEffect(() => {
    if (albums.length !== 0) return;
    fetchArtistAlbums();
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

      {loading && albums.length === 0 && (
        <Box sx={{ display: "flex", justifyContent: "center", m: 5 }}>
          <CircularProgress />
        </Box>
      )}
      {albums.length > 0 && (
        <>
          <h4>Albums</h4>
          <AlbumGrid albums={albums} hideArtist />
        </>
      )}

      {continuation && albums.length > 0 && (
        <Box
          ref={observerTarget}
          sx={{
            display: "flex",
            justifyContent: "center",
            m: 3,
            p: 3,
          }}
        >
          {loading && <CircularProgress />}
        </Box>
      )}
      </PageContent>
    </PageLayout>
  );
}

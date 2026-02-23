// prettier-ignore
import { useEffect, useState } from "react";
import { getAlbum } from "../services/youtube-api";
import { useParams } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";
import TrackList from "../components/TrackList";
import PageContent from "../layouts/PageContent";
import PageHeader from "../layouts/PageHeader";
import PageLayout from "../layouts/PageLayout";
import { PROXY_URL } from "../constants";

export default function AlbumPage() {
  const { albumId } = useParams();

  const [loading, setLoading] = useState(false);
  const [album, setAlbum] = useState(null);

  const fetchAlbum = async () => {
    setLoading(true);
    const response = await getAlbum(albumId);
    setAlbum(response);
    setLoading(false);
  };

  useEffect(() => {
    if (album !== null) return;
    fetchAlbum();
  }, []);

  return (
    <PageLayout>
      <PageHeader>
        {album && (
          <Box sx={{ display: "flex" }}>
            <img
              src={`${PROXY_URL}${album.thumbnailUrl}`}
              style={{
                borderRadius: 5,
                boxShadow: "0 0 8px 2px rgba(0, 0, 0, 0.3)",
              }}
              alt={album.title}
              width={200}
              height={200}
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "end",
                paddingLeft: 2,
              }}
            >
              <h2 style={{ margin: 0 }}>{album.title}</h2>
              <div>{album.artist?.name}</div>
            </Box>
          </Box>
        )}
      </PageHeader>
      <PageContent>
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", m: 5 }}>
            <CircularProgress />
          </Box>
        )}
        {album && (
          <>
            <TrackList tracks={album.tracks} hideImage hideAlbum />
          </>
        )}
      </PageContent>
    </PageLayout>
  );
}

import { Card, CardMedia, CardContent, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { PROXY_URL } from "../constants";

export default function AlbumGrid({
  albums = [],
  onlyOneRow = false,
  hideArtist = false,
}) {
  const albumGridStyle = {
    marginTop: 20,
    display: "grid",
    padding: 10,
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: 18,
  };

  if (onlyOneRow) {
    albumGridStyle.gridTemplateRows = "auto";
    albumGridStyle.gridAutoRows = 0;
    albumGridStyle.rowGap = 0;
    albumGridStyle.overflow = "hidden";
  }

  return (
    <div style={albumGridStyle} className="album-grid">
      {albums.map((item, index) => (
        <Card
          key={index + item.albumId}
          component={Link}
          to={`/album/${item.albumId}`}
          className="album-item"
        >
          <CardMedia
            sx={{ height: 200, width: "100%" }}
            image={ `${PROXY_URL}${item.thumbnailUrl}`}
          />
          <CardContent>
            <Typography variant="body1" component="div">
              {item.title}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {item.type}
              {!hideArtist && ` • ${item.artist.name}`}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

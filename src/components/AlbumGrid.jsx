import { Card, CardMedia, CardContent, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { PROXY_URL } from "../constants";

export default function AlbumGrid({
  albums = [],
  onlyOneRow = false,
  hideArtist = false,
}) {
  const albumGridStyle = {
    marginTop: 16,
    display: "grid",
    padding: 8,
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: 16,
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
          sx={{
            textDecoration: "none",
            bgcolor: "background.paper",
            borderRadius: 3,
            overflow: "hidden",
            transition: "transform 200ms ease, box-shadow 200ms ease",
            "&:hover": {
              transform: "translateY(-4px) scale(1.02)",
              boxShadow: "0 8px 30px rgba(124, 58, 237, 0.12)",
            },
          }}
        >
          <CardMedia
            sx={{ height: 200, width: "100%" }}
            image={`${PROXY_URL}${item.thumbnailUrl}`}
          />
          <CardContent sx={{ pb: "12px !important", pt: 1.5 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
              {item.title}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {item.type}
              {!hideArtist && ` • ${item.artist.name}`}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

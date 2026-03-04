import { Card, CardMedia, CardContent, Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { PROXY_URL } from "../constants";

export default function AlbumGrid({
  albums = [],
  onlyOneRow = false,
  hideArtist = false,
}) {
  return (
    <Box
      sx={{
        mt: 2,
        display: "grid",
        p: 1,
        gridTemplateColumns: {
          xs: "repeat(auto-fill, minmax(140px, 1fr))",
          sm: "repeat(auto-fill, minmax(180px, 1fr))",
        },
        gap: 2,
        ...(onlyOneRow && {
          gridTemplateRows: "auto",
          gridAutoRows: 0,
          rowGap: 0,
          overflow: "hidden",
        }),
      }}
    >
      {albums.map((item, index) => (
        <Card
          key={index + item.albumId}
          component={Link}
          to={`/album/${item.albumId}`}
          sx={{
            textDecoration: "none",
            bgcolor: "background.paper",
            borderRadius: 2,
            overflow: "hidden",
            transition: "transform 200ms ease, box-shadow 200ms ease",
            "&:hover": {
              transform: "translateY(-4px) scale(1.02)",
              boxShadow: "0 8px 30px rgba(124, 58, 237, 0.12)",
            },
          }}
        >
          <CardMedia
            sx={{ height: { xs: 140, sm: 200 }, width: "100%" }}
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
    </Box>
  );
}

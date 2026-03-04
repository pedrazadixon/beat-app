import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getHome } from "../services/home-api";
import { PROXY_URL } from "../constants";
import { playerActions } from "../stores/playerStore";
import HorizontalScroll from "../components/HorizontalScroll";
import PageLayout from "../layouts/PageLayout";
import PageContent from "../layouts/PageContent";

const sectionCardSx = {
  bgcolor: "background.paper",
  textDecoration: "none",
  flexShrink: 0,
  cursor: "pointer",
  minWidth: { xs: 150, sm: 180 },
  maxWidth: { xs: 150, sm: 180 },
  transition: "transform 200ms ease, box-shadow 200ms ease",
  "&:hover": {
    transform: "scale(1.02)",
    boxShadow: "0 8px 30px rgba(124, 58, 237, 0.12)",
  },
};

function SectionCard({ item, allSongsInSection }) {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();

    switch (item.type) {
      case "song": {
        const track = {
          trackId: item.id,
          title: item.title,
          artists: item.artists || [],
          thumbnailUrl: item.thumbnail || "",
          album: item.album || null,
          duration: item.duration || { label: "", totalSeconds: 0 },
        };
        const queue = (allSongsInSection || []).map((s) => ({
          trackId: s.id,
          title: s.title,
          artists: s.artists || [],
          thumbnailUrl: s.thumbnail || "",
          album: s.album || null,
          duration: s.duration || { label: "", totalSeconds: 0 },
        }));
        playerActions.playTrack(track, queue);
        break;
      }
      case "playlist":
        if (item.browseId) navigate(`/album/${item.browseId}`);
        break;
      case "artist":
        if (item.browseId) navigate(`/artist/${item.browseId}`);
        break;
      case "album":
        if (item.browseId) navigate(`/album/${item.browseId}`);
        break;
      default:
        if (item.browseId) {
          if (
            item.browseId.startsWith("MPRE") ||
            item.browseId.startsWith("VL")
          ) {
            navigate(`/album/${item.browseId}`);
          } else {
            navigate(`/artist/${item.browseId}`);
          }
        }
        break;
    }
  };

  const subtitle =
    item.subtitle ||
    (item.type === "song" && item.artists
      ? item.artists.map((a) => a.name).join(", ")
      : item.type === "playlist" && item.author
        ? item.author.name
        : null);

  return (
    <Card onClick={handleClick} sx={sectionCardSx}>
      <CardMedia
        sx={{
          height: { xs: 150, sm: 180 },
          width: { xs: 150, sm: 180 },
          borderRadius: item.type === "artist" ? "50%" : undefined,
          mx: item.type === "artist" ? "auto" : undefined,
          mt: item.type === "artist" ? 1.5 : 0,
        }}
        image={item.thumbnail ? `${PROXY_URL}${item.thumbnail}` : ""}
      />
      <CardContent sx={{ pb: "12px !important", pt: 1.5 }}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {item.title}
        </Typography>
        {subtitle && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              display: "block",
            }}
          >
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

export default function HomePage() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      setLoading(true);
      const data = await getHome();
      if (mounted) {
        setSections(data.sections || []);
        setLoading(false);
      }
    }
    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <PageLayout>
      <PageContent>
        <Box className="page-enter" sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
            Good {getGreeting()} 👋
          </Typography>

          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
              <CircularProgress sx={{ color: "primary.main" }} />
            </Box>
          )}

          {!loading && sections.length === 0 && (
            <Box sx={{ textAlign: "center", mt: 8 }}>
              <Typography variant="h6" color="text.secondary">
                No content available right now
              </Typography>
            </Box>
          )}

          {sections.map((section, idx) => {
            const songsInSection = (section.items || []).filter(
              (i) => i.type === "song"
            );
            return (
              <HorizontalScroll key={idx} title={section.title}>
                {(section.items || []).map((item, i) => (
                  <SectionCard
                    key={`${idx}-${i}-${item.id || item.browseId || item.title}`}
                    item={item}
                    allSongsInSection={songsInSection}
                  />
                ))}
              </HorizontalScroll>
            );
          })}
        </Box>
      </PageContent>
    </PageLayout>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
}

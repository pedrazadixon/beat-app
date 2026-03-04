import { useLocation, useNavigate } from "react-router-dom";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Paper from "@mui/material/Paper";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ExploreRoundedIcon from "@mui/icons-material/ExploreRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import LibraryMusicRoundedIcon from "@mui/icons-material/LibraryMusicRounded";

const navItems = [
  { label: "Home", icon: <HomeRoundedIcon />, path: "/" },
  { label: "Explore", icon: <ExploreRoundedIcon />, path: "/explore" },
  { label: "Search", icon: <SearchRoundedIcon />, path: "/search" },
  { label: "Library", icon: <LibraryMusicRoundedIcon />, path: "/library" },
];

export default function MobileBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const getActiveValue = () => {
    const path = location.pathname;
    if (path === "/") return "/";
    if (path.startsWith("/explore") || path.startsWith("/charts")) return "/explore";
    if (path.startsWith("/search")) return "/search";
    if (path.startsWith("/library")) return "/library";
    return "/";
  };

  return (
    <Paper
      elevation={0}
      sx={{
        display: { xs: "block", sm: "none" },
        borderTop: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        flexShrink: 0,
      }}
    >
      <BottomNavigation
        value={getActiveValue()}
        onChange={(_, newValue) => navigate(newValue)}
        showLabels
        sx={{
          bgcolor: "transparent",
          "& .MuiBottomNavigationAction-root": {
            color: "text.secondary",
            transition: "color 200ms ease",
            "&.Mui-selected": {
              color: "primary.light",
            },
          },
        }}
      >
        {navItems.map((item) => (
          <BottomNavigationAction
            key={item.path}
            label={item.label}
            value={item.path}
            icon={item.icon}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
}

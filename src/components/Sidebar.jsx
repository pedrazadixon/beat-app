import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
} from "@mui/material";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ExploreRoundedIcon from "@mui/icons-material/ExploreRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import MusicNoteRoundedIcon from "@mui/icons-material/MusicNoteRounded";

const SIDEBAR_WIDTH = 260;

const navItems = [
  { label: "Home", icon: <HomeRoundedIcon />, path: "/" },
  { label: "Explore", icon: <ExploreRoundedIcon />, path: "/explore" },
  { label: "Charts", icon: <BarChartRoundedIcon />, path: "/charts" },
];

const libraryItems = [
  {
    label: "Liked Songs",
    icon: <FavoriteRoundedIcon />,
    path: "/library/likes",
  },
];

const activeIndicatorSx = {
  content: '""',
  position: "absolute",
  left: 0,
  top: "25%",
  bottom: "25%",
  width: 3,
  borderRadius: "0 3px 3px 0",
  background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
};

export default function Sidebar({ mobileOpen, onMobileToggle }) {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const handleNav = (path) => {
    navigate(path);
    if (onMobileToggle) onMobileToggle();
  };

  const renderNavItem = (item) => (
    <ListItemButton
      key={item.path}
      selected={isActive(item.path)}
      onClick={() => handleNav(item.path)}
      sx={{
        position: "relative",
        py: 1,
        mb: 0.3,
        "&.Mui-selected::before": activeIndicatorSx,
      }}
    >
      <ListItemIcon
        sx={{
          minWidth: 40,
          color: isActive(item.path) ? "primary.light" : "text.secondary",
        }}
      >
        {item.icon}
      </ListItemIcon>
      <ListItemText
        primary={item.label}
        primaryTypographyProps={{
          fontWeight: isActive(item.path) ? 600 : 400,
          fontSize: "0.9rem",
        }}
      />
    </ListItemButton>
  );

  const drawerContent = (
    <>
      {/* Logo */}
      <Box
        sx={{
          p: 2.5,
          pb: 1.5,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: "10px",
            background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MusicNoteRoundedIcon sx={{ color: "#fff", fontSize: 20 }} />
        </Box>
        <Typography
          className="gradient-text"
          variant="h6"
          component="div"
          sx={{ fontWeight: 800, letterSpacing: -0.5, fontSize: "1.6rem" }}
        >
          Beat
        </Typography>
      </Box>

      {/* Main Navigation */}
      <Box sx={{ px: 1, mt: 1 }}>
        <Typography
          variant="overline"
          sx={{
            px: 2,
            color: "text.secondary",
            fontSize: "0.65rem",
            letterSpacing: 1.5,
          }}
        >
          Menu
        </Typography>
        <List sx={{ py: 0.5 }}>{navItems.map(renderNavItem)}</List>
      </Box>

      <Divider sx={{ mx: 2, my: 1 }} />

      {/* Library */}
      <Box sx={{ px: 1 }}>
        <Typography
          variant="overline"
          sx={{
            px: 2,
            color: "text.secondary",
            fontSize: "0.65rem",
            letterSpacing: 1.5,
          }}
        >
          Library
        </Typography>
        <List sx={{ py: 0.5 }}>{libraryItems.map(renderNavItem)}</List>
      </Box>
    </>
  );

  const paperSx = {
    width: SIDEBAR_WIDTH,
    boxSizing: "border-box",
    backgroundImage: "none",
    bgcolor: "background.paper",
    borderRight: "1px solid",
    borderColor: "divider",
  };

  return (
    <Box
      component="nav"
      sx={{ width: { sm: SIDEBAR_WIDTH }, flexShrink: { sm: 0 } }}
    >
      {/* Mobile: temporary drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileToggle}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": paperSx,
        }}
        slotProps={{ root: { keepMounted: true } }}
      >
        {drawerContent}
      </Drawer>
      {/* Desktop: permanent drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": paperSx,
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}

export { SIDEBAR_WIDTH };

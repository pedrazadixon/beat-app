import { useEffect, useState, useRef } from "react";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Paper from "@mui/material/Paper";
import SearchIcon from "@mui/icons-material/Search";

import { useLocation, useNavigate } from "react-router-dom";

export default function SearchInput() {
  const [search, setSearch] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const debounceRef = useRef(null);

  useEffect(() => {
    const match = location.pathname.match(/^\/search\/([^/]+)/);
    if (match) {
      setSearch(decodeURIComponent(match[1]));
    }
  }, [location.pathname]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      if (value.trim()) {
        navigate(`/search/${value.trim()}`);
      }
    }, 500);
  };

  return (
    <Paper
      component="form"
      elevation={0}
      sx={{
        p: "2px 4px",
        display: "flex",
        alignItems: "center",
        maxWidth: 480,
        width: "100%",
        borderRadius: "24px",
        bgcolor: (theme) =>
          theme.palette.mode === "dark"
            ? "rgba(148,163,184,0.08)"
            : "rgba(0,0,0,0.04)",
        border: "1px solid",
        borderColor: "divider",
        transition: "all 200ms ease",
        "&:focus-within": {
          borderColor: "primary.main",
          boxShadow: "0 0 0 3px rgba(124,58,237,0.12)",
        },
      }}
      onSubmit={(e) => e.preventDefault()}
    >
      <IconButton type="button" sx={{ p: "8px" }} aria-label="search" disabled>
        <SearchIcon sx={{ fontSize: 20, color: "text.secondary" }} />
      </IconButton>
      <InputBase
        type="search"
        value={search}
        onChange={handleChange}
        sx={{ ml: 0.5, flex: 1, fontSize: "0.9rem" }}
        placeholder="Search tracks, albums, artists..."
      />
    </Paper>
  );
}

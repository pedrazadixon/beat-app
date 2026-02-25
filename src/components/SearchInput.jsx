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
      sx={{
        p: "2px 4px",
        display: "flex",
        alignItems: "center",
        width: "100%",
      }}
      onSubmit={(e) => e.preventDefault()}
    >
      <IconButton type="button" sx={{ p: "10px" }} aria-label="search" disabled>
        <SearchIcon />
      </IconButton>
      <InputBase
        type="search"
        value={search}
        onChange={handleChange}
        sx={{ ml: 1, flex: 1 }}
        placeholder="Tracks, albums, artists..."
      />
    </Paper>
  );
}

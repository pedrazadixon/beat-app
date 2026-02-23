import { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import SearchIcon from "@mui/icons-material/Search";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { useParams, useNavigate } from "react-router-dom";

export default function SearchInput() {
  const [search, setSearch] = useState("");
  const { query } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (query) {
      setSearch(query);
    }
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search/${search}`);
  };

  return (
    // <Box sx={{ display: "flex" }}>
    //   <IconButton>
    //     <ChevronLeftIcon />
    //   </IconButton>
    //   <IconButton>
    //     <ChevronRightIcon />
    //   </IconButton>
      <Paper
        component="form"
        sx={{
          p: "2px 4px",
          display: "flex",
          alignItems: "center",
          width: "100%",
        }}
        onSubmit={(e) => handleSearch(e)}
      >
        <InputBase
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ ml: 1, flex: 1 }}
          placeholder="Tracks, albums, artists..."
        />
        <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
          <SearchIcon />
        </IconButton>
      </Paper>
    // </Box>
  );
}

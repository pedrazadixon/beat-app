import { Box } from "@mui/material";

export default function PageContent({ children }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1, position: "relative" }}>
      {children}
    </Box>
  );
}

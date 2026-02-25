import { Box } from "@mui/material";

export default function PageLayout({ children }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1, minHeight: "100%" }}>
      {children}
    </Box>
  );
}

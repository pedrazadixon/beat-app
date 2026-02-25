import { Box } from "@mui/material";

export default function PageHeader({ children }) {
  return (
    <Box
      id="page-header"
      className="page-header"
      sx={{ display: "flex", flexDirection: "column", p: 2, flexShrink: 0 }}
    >
      {children}
    </Box>
  );
}

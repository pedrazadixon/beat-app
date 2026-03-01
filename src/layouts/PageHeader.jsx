import { Box } from "@mui/material";

export default function PageHeader({ children, gradient = false }) {
  return (
    <Box
      id="page-header"
      className="page-header"
      sx={{
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}
    >
      {children}
    </Box>
  );
}

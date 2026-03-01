import { Box } from "@mui/material";

export default function PageLayout({ children }) {
  return (
    <Box
      className="page-layout"
      sx={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        minHeight: "100%",
        paddingInline: "12px",
      }}
    >
      {children}
    </Box>
  );
}

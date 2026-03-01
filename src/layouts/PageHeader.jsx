import { Box } from "@mui/material";

export default function PageHeader({ children, gradient = false }) {
  return (
    <Box
      id="page-header"
      className="page-header"
      sx={{
        display: "flex",
        flexDirection: "column",
        p: 2,
        flexShrink: 0,
        ...(gradient && {
          background: (theme) =>
            theme.palette.mode === "dark"
              ? "linear-gradient(180deg, rgba(124,58,237,0.12) 0%, transparent 100%)"
              : "linear-gradient(180deg, rgba(124,58,237,0.06) 0%, transparent 100%)",
        }),
      }}
    >
      {children}
    </Box>
  );
}

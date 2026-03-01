import "./App.css";
import CssBaseline from "@mui/material/CssBaseline";
import ReactDOM from "react-dom/client";
import routes from "./routes";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const theme = createTheme({
  cssVariables: { colorSchemeSelector: "class" },
  colorSchemes: {
    dark: {
      palette: {
        background: {
          default: "#0a0a1a",
          paper: "#1a1a2e",
        },
        primary: {
          main: "#7c3aed",
          light: "#a78bfa",
          dark: "#5b21b6",
        },
        secondary: {
          main: "#06b6d4",
          light: "#22d3ee",
          dark: "#0891b2",
        },
        text: {
          primary: "#f1f5f9",
          secondary: "#94a3b8",
        },
        divider: "rgba(148,163,184,0.12)",
        action: {
          hover: "rgba(124,58,237,0.08)",
          selected: "rgba(124,58,237,0.16)",
        },
      },
    },
    light: {
      palette: {
        background: {
          default: "#f8fafc",
          paper: "#ffffff",
        },
        primary: {
          main: "#7c3aed",
          light: "#a78bfa",
          dark: "#5b21b6",
        },
        secondary: {
          main: "#06b6d4",
          light: "#22d3ee",
          dark: "#0891b2",
        },
      },
    },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundImage: "none",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 24,
          fontWeight: 600,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: "none",
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          margin: "2px 8px",
          "&.Mui-selected": {
            background: "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.2))",
          },
        },
      },
    },
  },
});

const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById("root")).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <RouterProvider router={router} />
  </ThemeProvider>
);

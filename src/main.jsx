import "./App.css";
import CssBaseline from "@mui/material/CssBaseline";
import ReactDOM from "react-dom/client";
import routes from "./routes";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const theme = createTheme({
  colorSchemes: {
    dark: true,
  },
});

const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById("root")).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <RouterProvider router={router} />
  </ThemeProvider>
);

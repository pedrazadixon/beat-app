import "./App.css";
import CssBaseline from "@mui/material/CssBaseline";
import ReactDOM from "react-dom/client";
import routes from "./routes";
import { CssVarsProvider } from "@mui/material/styles";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <CssBaseline />
    <CssVarsProvider>
      <RouterProvider router={router} />
    </CssVarsProvider>
  </>
);

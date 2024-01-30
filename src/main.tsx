import React from "react";
import ReactDOM from "react-dom/client";
import {CssVarsProvider, StyledEngineProvider} from "@mui/joy/styles";
import "./index.css";
import CssBaseline from "@mui/joy/CssBaseline";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {AuthProvider} from "./providers/AuthContext.tsx";
import {BrowserRouter} from "react-router-dom";
import {
  Experimental_CssVarsProvider as MaterialCssVarsProvider,
  experimental_extendTheme as extendMaterialTheme,
  THEME_ID
} from "@mui/material/styles";
import {Main} from "./components/Main.tsx";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";

export const queryClient = new QueryClient();
const materialTheme = extendMaterialTheme();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <QueryClientProvider client={queryClient}>
        <MaterialCssVarsProvider theme={{[THEME_ID]: materialTheme}}>
          <CssVarsProvider>
            <CssBaseline/>
            <AuthProvider>
              <BrowserRouter>
                <DndProvider backend={HTML5Backend}>
                  <Main/>
                </DndProvider>
              </BrowserRouter>
            </AuthProvider>
          </CssVarsProvider>
        </MaterialCssVarsProvider>
      </QueryClientProvider>
    </StyledEngineProvider>
  </React.StrictMode>,
);

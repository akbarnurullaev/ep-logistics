import React from "react";
import ReactDOM from "react-dom/client";
import {CssVarsProvider, extendTheme} from "@mui/joy/styles";
import "./index.css";
import CssBaseline from "@mui/joy/CssBaseline";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {AuthProvider} from "./providers/AuthContext.tsx";
import {BrowserRouter} from "react-router-dom";
import {Main} from "./components/Main.tsx";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import {
  Experimental_CssVarsProvider as MaterialCssVarsProvider,
  experimental_extendTheme as extendMaterialTheme,
  THEME_ID
} from "@mui/material/styles";

export const queryClient = new QueryClient();
const materialTheme = extendMaterialTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          50: "#f6e7ea",
          100: "#eccfd6",
          200: "#e3b6c1",
          300: "#da9eac",
          400: "#d18698",
          500: "#c76e83",
          600: "#be566e",
          700: "#b53d59",
          800: "#ab2545",
          900: "#a20d30",
        }
      }
    }
  }
});
const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          50: "#f6e7ea",
          100: "#eccfd6",
          200: "#e3b6c1",
          300: "#da9eac",
          400: "#d18698",
          500: "#c76e83",
          600: "#be566e",
          700: "#b53d59",
          800: "#ab2545",
          900: "#a20d30",
        },
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <MaterialCssVarsProvider theme={{[THEME_ID]: materialTheme}}>
        <CssVarsProvider theme={theme}>
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
  </React.StrictMode>,
);

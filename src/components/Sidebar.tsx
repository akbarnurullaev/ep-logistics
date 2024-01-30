import GlobalStyles from "@mui/joy/GlobalStyles";
import Box from "@mui/joy/Box";
import IconButton from "@mui/joy/IconButton";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton, {listItemButtonClasses} from "@mui/joy/ListItemButton";
import ListItemContent from "@mui/joy/ListItemContent";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import SupportRoundedIcon from "@mui/icons-material/SupportRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import BrightnessAutoRoundedIcon from "@mui/icons-material/BrightnessAutoRounded";


import ColorSchemeToggle from "./ColorSchemeToggle";
import {closeSidebar} from "../helpers/utils.ts";
import {useLocation, useNavigate} from "react-router-dom";
import {paths} from "./Main.tsx";

export default function Sidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <Sheet
      className="Sidebar"
      sx={{
        position: { xs: "fixed", md: "sticky" },
        transform: {
          xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))",
          md: "none",
        },
        transition: "transform 0.4s, width 0.4s",
        zIndex: 10000,
        height: "100dvh",
        width: "var(--Sidebar-width)",
        top: 0,
        p: 2,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        borderRight: "1px solid",
        borderColor: "divider",
      }}
    >
      <GlobalStyles
        styles={(theme) => ({
          ":root": {
            "--Sidebar-width": "220px",
            [theme.breakpoints.up("lg")]: {
              "--Sidebar-width": "240px",
            },
          },
        })}
      />
      <Box
        className="Sidebar-overlay"
        sx={{
          position: "fixed",
          zIndex: 9998,
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          opacity: "var(--SideNavigation-slideIn)",
          backgroundColor: "var(--joy-palette-background-backdrop)",
          transition: "opacity 0.4s",
          transform: {
            xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--Sidebar-width, 0px)))",
            lg: "translateX(-100%)",
          },
        }}
        onClick={() => closeSidebar()}
      />
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <IconButton variant="soft" color="primary" size="sm">
          <BrightnessAutoRoundedIcon />
        </IconButton>
        <Typography level="title-lg">EP Logistics.</Typography>
        <ColorSchemeToggle sx={{ ml: "auto" }} />
      </Box>
      <Box
        sx={{
          minHeight: 0,
          overflow: "hidden auto",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          [`& .${listItemButtonClasses.root}`]: {
            gap: 1.5,
          },
        }}
      >
        <List
          size="sm"
          sx={{
            gap: 1,
            "--List-nestedInsetStart": "30px",
            "--ListItem-radius": (theme) => theme.vars.radius.sm,
          }}
        >
          {paths.map(({path, title, icon}) => (
            <ListItem key={path}>
              <ListItemButton onClick={() => navigate(path)} selected={pathname === path}>
                {icon}
                <ListItemContent>
                  <Typography level="title-sm">{title}</Typography>
                </ListItemContent>
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <List
          size="sm"
          sx={{
            mt: "auto",
            flexGrow: 0,
            "--ListItem-radius": (theme) => theme.vars.radius.sm,
            "--List-gap": "8px",
            mb: 2,
          }}
        >
          <ListItem>
            <ListItemButton>
              <SupportRoundedIcon />
              Support
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton>
              <SettingsRoundedIcon />
              Settings
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
      {/*<Divider />*/}
      {/*<Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>*/}
      {/*  <Avatar*/}
      {/*    variant="outlined"*/}
      {/*    size="sm"*/}
      {/*    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286"*/}
      {/*  />*/}
      {/*  <Box sx={{ minWidth: 0, flex: 1 }}>*/}
      {/*    <Typography level="title-sm">Siriwat K.</Typography>*/}
      {/*    <Typography level="body-xs">siriwatk@test.com</Typography>*/}
      {/*  </Box>*/}
      {/*  <IconButton size="sm" variant="plain" color="neutral">*/}
      {/*    <LogoutRoundedIcon />*/}
      {/*  </IconButton>*/}
      {/*</Box>*/}
    </Sheet>
  );
}

import GlobalStyles from "@mui/joy/GlobalStyles";
import Box from "@mui/joy/Box";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton, {listItemButtonClasses} from "@mui/joy/ListItemButton";
import ListItemContent from "@mui/joy/ListItemContent";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import SupportRoundedIcon from "@mui/icons-material/SupportRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import {closeSidebar} from "../helpers/utils.ts";
import {useLocation, useNavigate} from "react-router-dom";
import {PathWithChildren, usePaths} from "./Main.tsx";
import logo from "../assets/logo.png";
import {useState} from "react";
import {ToggleButtonGroup} from "@mui/joy";
import IconButton from "@mui/joy/IconButton";
import {Languages, useI18n} from "../logic/i18n.ts";

const ChildrenPaths = ({path}: {path: PathWithChildren}) => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
    
  return <>
    <ListItem onClick={() => setOpen(!open)}>
      <ListItemButton selected={pathname === path.path}>
        {path.icon}
        <ListItemContent>
          <Typography level="title-sm">{path.title}</Typography>
        </ListItemContent>
      </ListItemButton>
    </ListItem>
    {open && path.children.map(({path: childPath, icon, title}) => <ListItem sx={{ ml: 2 }} key={childPath}>
      <ListItemButton onClick={() => navigate(`${path.path}${childPath}`)} selected={pathname === `${path.path}${childPath}`}>
        {icon}
        <ListItemContent>
          <Typography level="title-sm">{title}</Typography>
        </ListItemContent>
      </ListItemButton>
    </ListItem>)}
  </>;
};

const LanguagesToggles = () => {
  const {changeLanguage} = useI18n();
  const [value, setValue] = useState<Languages>("en");
  return (
    <ToggleButtonGroup
      value={value}
      onChange={(_, newValue) => {
        if (newValue) {
          setValue(newValue);
          changeLanguage(newValue);
        }
      }}
    >
      <IconButton disabled={value === "en"} value="en">
        en
      </IconButton>
      <IconButton disabled={value === "cz"} value="cz">
        cz
      </IconButton>
    </ToggleButtonGroup>
  );
};

export default function Sidebar() {
  const { pathname } = useLocation();
  const {paths} = usePaths();
  const navigate = useNavigate();
  const {t} = useI18n();

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
        zIndex: 9,
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
      <Box sx={{display: "flex", gap: 1, mx: 1, alignItems: "center"}}>
        <img
          style={{width: "100%" }}
          src={logo}
          alt="Logo"
        />
        {/*<ColorSchemeToggle sx={{ml: "auto"}}/>*/}
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
          {paths.map((path) => (
            path.children ? <ChildrenPaths key={path.path} path={path}/>
              : <ListItem key={path.path}>
                <ListItemButton onClick={() => navigate(path.path)} selected={pathname === path.path}>
                  {path.icon}
                  <ListItemContent>
                    <Typography level="title-sm">{path.title}</Typography>
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
            <LanguagesToggles/>
          </ListItem>
          <ListItem>
            <ListItemButton>
              <SupportRoundedIcon />
              {t("support")}
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton>
              <SettingsRoundedIcon />
              {t("settings")}
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

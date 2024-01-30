import {Route, Routes, useLocation} from "react-router-dom";
import Header from "./Header.tsx";
import Sidebar from "./Sidebar.tsx";
import Box from "@mui/joy/Box";
import {Orders} from "../pages/Orders.tsx";
import {Planning} from "../pages/Planning.tsx";
import {StaticData} from "../pages/StaticData.tsx";
import {DistanceMatrix} from "../pages/DistanceMatrix.tsx";
import {Dashboard} from "../pages/Dashboard.tsx";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import FormatListNumberedOutlinedIcon from "@mui/icons-material/FormatListNumberedOutlined";
import DataArrayOutlinedIcon from "@mui/icons-material/DataArrayOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";


export const paths = [
  {path: "/", title: "Dashboard", icon: <DashboardOutlinedIcon />, component:  <Dashboard />},
  {path: "/planning", title: "Planning", icon: <AssignmentOutlinedIcon />, component: <Planning />},
  {path: "/orders", title: "Orders", icon: <FormatListNumberedOutlinedIcon />, component: <Orders />},
  {path: "/static-data", title: "Static Data", icon: <DataArrayOutlinedIcon/>, component: <StaticData />},
  {path: "/distance-matrix", title: "Distance Matrix", icon: <MapOutlinedIcon />, component: <DistanceMatrix />},
];

export function Main() {
  const {pathname} = useLocation();
  const title = paths.find(({path}) => path === pathname)?.title;

  return (
    <Box sx={{ display: "flex" }}>
      <Header />
      <Sidebar />
      <Box
        component="main"
        className="MainContent"
        sx={{
          px: { xs: 2, md: 6 },
          pt: {
            xs: "calc(12px + var(--Header-height))",
            sm: "calc(12px + var(--Header-height))",
            md: 5,
          },
          pb: { xs: 2, sm: 2, md: 3 },
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          gap: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            mb: 1,
            gap: 1,
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "start", sm: "center" },
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          <Typography level="h2" component="h1">
            {title}
          </Typography>
          <Button
            color="primary"
            size="lg"
          >
              Add new order
          </Button>
        </Box>
        <Routes>
          {paths.map(({path, component}) => (
            <Route key={path} path={path} element={component}/>
          ))}
        </Routes>
      </Box>
    </Box>
  );
}

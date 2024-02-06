import {Route, Routes, useLocation} from "react-router-dom";
import Header from "./Header.tsx";
import Sidebar from "./Sidebar.tsx";
import Box from "@mui/joy/Box";
import {Orders} from "../pages/Orders.tsx";
import {Planning} from "../pages/Planning.tsx";
import {DistanceMatrix} from "../pages/DistanceMatrix.tsx";
import {Dashboard} from "../pages/Dashboard.tsx";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import FormatListNumberedOutlinedIcon from "@mui/icons-material/FormatListNumberedOutlined";
import DataArrayOutlinedIcon from "@mui/icons-material/DataArrayOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import Typography from "@mui/joy/Typography";
import {ReactNode} from "react";
import {Modal, ModalDialog} from "@mui/joy";
import {Trucks} from "../pages/Trucks.tsx";
import {Clients} from "../pages/Clients.tsx";
import {DistributionCentres} from "../pages/DistributionCentres.tsx";
import {Translations, useI18n} from "../logic/i18n.ts";
import {CreateOrder} from "./forms/CreateOrder.tsx";
import {FormType, useCrudForms} from "../logic/crud-forms.ts";
import {CreateTruck} from "./forms/CreateTruck.tsx";
import {CreateClient} from "./forms/CreateClient.tsx";
import {CreateDistributionCenter} from "./forms/CreateDistributionCenter.tsx";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import Button from "@mui/joy/Button";
import BusinessIcon from "@mui/icons-material/BusinessOutlined";
import FactoryOutlinedIcon from "@mui/icons-material/FactoryOutlined";


export type Path = {
    path: string, title: string, icon: ReactNode, component: ReactNode
}

export type PathWithChildren = {
    path: string, title: string, icon: ReactNode, component?: ReactNode, children: Path[]
}

export const usePaths = () => {
  const {t} = useI18n();
    
  const paths = [
    {path: "/", title: t("dashboard"), icon: <DashboardOutlinedIcon/>, component: <Dashboard/>},
    {path: "/planning", title: t("planning"), icon: <FormatListNumberedOutlinedIcon/>, component: <Planning/>},
    {path: "/orders", title: t("orders"), icon: <AssignmentOutlinedIcon/>, component: <Orders/>},
    {
      path: "/static-data", title: t("staticData"), icon: <DataArrayOutlinedIcon/>,
      children: [
        {path: "/trucks", title: t("trucks"), icon: <LocalShippingIcon/>, component: <Trucks/>},
        {path: "/clients", title: t("clients"), icon: <BusinessIcon/>, component: <Clients/>},
        {
          path: "/distribution-centres",
          title: t("distributionCentres"),
          icon: <FactoryOutlinedIcon/>,
          component: <DistributionCentres/>
        },
      ]
    },
    {path: "/distance-matrix", title: t("distanceMatrix"), icon: <MapOutlinedIcon/>, component: <DistanceMatrix/>},
  ];

  const getTitleFromPaths = (pathname: string) => {
    for (const {path, title, children} of paths) {
      if (path === pathname) {
        return title;
      }

      if (children) {
        const childPath = children.find(({path: childPath}) => `${path}${childPath}` === pathname);

        if (childPath) return childPath.title;
      }
    }
  };

  return {
    paths,
    getTitleFromPaths
  };
};

const FormsMap: Record<FormType, ReactNode> = {
  truck: <CreateTruck/>,
  client: <CreateClient/>,
  distributionCenter: <CreateDistributionCenter/>,
  order: <CreateOrder/>,
};

// TODO: type it
const Buttons: Record<string, {title: keyof Translations, formType: FormType}> = {
  "/": {title: "createNewOrder", formType: "order"},
  "/orders": {title: "createNewOrder", formType: "order"},
  "/planning": {title: "createNewDistributionCenter", formType: "distributionCenter"},
  "/distance-matrix": {title: "createNewOrder", formType: "order"},
  "/static-data/trucks": {title: "createNewTruck", formType: "truck"},
  "/static-data/clients": {title: "createNewClient", formType: "client"},
  "/static-data/distribution-centres": {title: "createNewDistributionCenter", formType: "distributionCenter"},
};

export function Main() {
  const {t} = useI18n();
  const {pathname} = useLocation();
  const {paths, getTitleFromPaths} = usePaths();

  const title = getTitleFromPaths(pathname);

  const {formType, setFormType, setSelectedData} = useCrudForms();

  const open = !!formType;

  return (
    <>
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

            {Buttons[pathname] && <Button color="primary" variant="solid" size="lg"
              onClick={() => setFormType(Buttons[pathname].formType)}>{t(Buttons[pathname].title)}</Button>}
          </Box>
          <Routes>
            {paths.map(({path, component, children}) => (
              children ?
                children.map(({path: childrenPath, component}) => (
                  <Route key={childrenPath} path={`${path}${childrenPath}`} element={component}/>
                )) : <Route key={path} path={path} element={component}/>
            ))}
          </Routes>
        </Box>
      </Box>

      <Modal sx={{
        zIndex: 99990,
      }} open={open} onClose={() => {
        setFormType(null);
        setSelectedData(null);
      }}>
        <ModalDialog sx={{width: 500}}>
          {open && FormsMap[formType]}
        </ModalDialog>
      </Modal>
    </>
  );
}

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
import Button from "@mui/joy/Button";
import * as React from "react";
import {ReactNode, useState} from "react";
import {DialogContent, DialogTitle, FormControl, FormLabel, Input, Modal, ModalDialog, Stack} from "@mui/joy";
import {Order, useOrdersStore} from "../logic/orders.ts";
import {Trucks} from "../pages/Trucks.tsx";
import {Clients} from "../pages/Clients.tsx";
import {DistributionCentres} from "../pages/DistributionCentres.tsx";
import {useI18n} from "../logic/i18n.ts";


interface FormElements extends HTMLFormControlsCollection {
  productType: HTMLInputElement
  volume: HTMLInputElement
  clientName: HTMLInputElement
  deliveryDate: HTMLInputElement
  deliveryTime: HTMLInputElement
}
interface OrderFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

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
    {path: "/planning", title: t("planning"), icon: <AssignmentOutlinedIcon/>, component: <Planning/>},
    {path: "/orders", title: t("orders"), icon: <FormatListNumberedOutlinedIcon/>, component: <Orders/>},
    {
      path: "/static-data", title: t("staticData"), icon: <DataArrayOutlinedIcon/>,
      children: [
        {path: "/trucks", title: t("trucks"), icon: <FormatListNumberedOutlinedIcon/>, component: <Trucks/>},
        {path: "/clients", title: t("clients"), icon: <FormatListNumberedOutlinedIcon/>, component: <Clients/>},
        {
          path: "/distribution-centres",
          title: t("distributionCentres"),
          icon: <FormatListNumberedOutlinedIcon/>,
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



export function Main() {
  const {t} = useI18n();
  const {pathname} = useLocation();
  const {addOrder} = useOrdersStore();
  const {paths, getTitleFromPaths} = usePaths();

  const title = getTitleFromPaths(pathname);

  const [open, setOpen] = useState(false);

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
            <Button
              color="primary"
              size="lg"
              onClick={() => setOpen(true)}
            >
              {t("addNewOrder")}
            </Button>
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
      }} open={open} onClose={() => setOpen(false)}>
        <ModalDialog>
          <DialogTitle>{t("createNewProject")}</DialogTitle>
          <DialogContent>{t("fillInTheInformationOfTheProject")}</DialogContent>
          <form
            onSubmit={(event: React.FormEvent<OrderFormElement>) => {
              event.preventDefault();
              const formElements = event.currentTarget.elements;
              const data = {
                clientName: formElements.clientName.value,
                productType: formElements.productType.value,
                volume: formElements.volume.value,
                deliveryDate: new Date(formElements.deliveryDate.value).toDateString(),
                deliveryTime: new Date(formElements.deliveryTime.value).toLocaleTimeString("en-US"),
              } as Omit<Order, "id">;
              addOrder(data);
              setOpen(false);
            }}
          >
            <Stack spacing={2}>
              <FormControl>
                <FormLabel>{t("clientName")}</FormLabel>
                <Input name="clientName" autoFocus required />
              </FormControl>
              <FormControl>
                <FormLabel>{t("productType")}</FormLabel>
                <Input name="productType" autoFocus required />
              </FormControl>
              <FormControl>
                <FormLabel>{t("volume")}</FormLabel>
                <Input name="volume" required />
              </FormControl>
              <FormControl>
                <FormLabel>{t("deliveryDate")}</FormLabel>
                <Input
                  type="date"
                  name="deliveryDate"
                  slotProps={{
                    input: {
                      max: new Date().toISOString().split("T")[0],
                    },
                  }}
                />
              </FormControl>
              <FormControl>
                <FormLabel>{t("deliveryTime")}</FormLabel>
                <Input
                  type="date"
                  name="deliveryTime"
                  slotProps={{
                    input: {
                      max: new Date().toISOString().split("T")[0],
                    },
                  }}
                />
              </FormControl>
                
              <Button type="submit">{t("submit")}</Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </>
  );
}

import {Card, CardContent} from "@mui/joy";
import Typography from "@mui/joy/Typography";
import Box from "@mui/joy/Box";
import {useI18n} from "../logic/i18n.ts";
import {nextDayOrders, useOrdersStore} from "../logic/orders.ts";
import {useStaticDataStore} from "../logic/static-data.ts";
import Map, {Marker} from "react-map-gl";
import {locations} from "../logic/data.ts";
import Pin from "../components/Pin.tsx";
import {useMemo} from "react";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = "pk.eyJ1IjoiYWtiYXJudXJ1bGxhZXYiLCJhIjoiY2t3a3VtOGduMG10dDJvbXQzcjBrZmRzNyJ9.gz3l4q0pT_ASh-1zb8WGfg";

export const Dashboard = () => {
  const {t, language} = useI18n();
  const {orders} = useOrdersStore();
  const {trucks} = useStaticDataStore();

  const data = [
    {heading: t("totalActiveOrders"), title: orders.length, subtitle: language === "en" ? "+5.2% from yesterday" : "+5.2% ve srovnání s včerejškem"},
    {heading: t("activeOrdersForNextDay"), title: nextDayOrders(orders).length, subtitle: language === "en" ? "+3.5% from yesterday" : "+3.5% ve srovnání s včerejškem"},
    {heading: t("activeVehiclesAvailable"), title: trucks.length, subtitle: language === "en" ? "+0,7% from yesterday" : "+0,7% ve srovnání s včerejškem"},
    {heading: t("ordersAllocatedToDrivers"), title: "23%", subtitle: ""},
    {heading: t("unallocatedOrdersForNextDay"), title: "31", subtitle: language === "en" ? "77% to finish plan" : "77% do dokončeni plánu"},
    {heading: t("totalKilometersPlannedForNextDay"), title: "9438 km", subtitle: ""},
  ];

  const pins = useMemo(
    () =>
      locations.map(({location}, index) => (
        <Marker
          key={`marker-${index}`}
          longitude={location.longitude}
          latitude={location.latitude}
          anchor="bottom"
        >
          <Pin />
        </Marker>
      )),
    []
  );

  return (
    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "space-between", width: "100%" }}>
      {data.map(({heading, title,subtitle}) => (
        <Card key={heading} variant="outlined" sx={{flexBasis: {xl: "calc(33% - 8px)", lg: "calc(50% - 8px)", md: "calc(50% - 8px)", sm: "calc(50% - 8px)", xs: "100%"} }}>
          <CardContent sx={{ display:"flex", justifyContent: "space-between", flexDirection: "column" }}>
            <Typography level="title-md">{heading}</Typography>
            <Typography level="h2">{title}</Typography>
            {subtitle && <Typography textColor="text.tertiary">{subtitle}</Typography>}
          </CardContent>
        </Card>
      ))}

      <Map
        onLoad={() => {
          document.querySelector("#root > div > main > div.MuiBox-root.css-da7bxn > div.mapboxgl-map > div:nth-child(4)")?.remove();
          document.querySelector("#root > div > main > div.MuiBox-root.css-da7bxn > div.mapboxgl-map > div.mapboxgl-control-container > div.mapboxgl-ctrl-bottom-right")?.remove();
        }}
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={{
          longitude: 14.418540,
          latitude: 50.073658,
          zoom: 6,
          bearing: 0,
          pitch: 0
        }}
        style={{width: "100%", height: 550, borderRadius: 8}}
        mapStyle="mapbox://styles/mapbox/streets-v9"
      >
        {pins}
      </Map>
    </Box>
  );
};

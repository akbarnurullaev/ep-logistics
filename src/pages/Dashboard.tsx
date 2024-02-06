import {Card, CardContent} from "@mui/joy";
import Typography from "@mui/joy/Typography";
import Box from "@mui/joy/Box";
import {useI18n} from "../logic/i18n.ts";

export const Dashboard = () => {
  const {t} = useI18n();

  const data = [
    {heading: t("totalActiveOrders"), title: "63", subtitle: "+5.2% from yesterday"},
    {heading: t("activeOrdersForNextDay"), title: "45", subtitle: "+3.5% from yesterday"},
    {heading: t("activeVehiclesAvailable"), title: "124", subtitle: "+0,7% from yesterday"},
    {heading: t("ordersAllocatedToDrivers"), title: "23%", subtitle: ""},
    {heading: t("unallocatedOrdersForNextDay"), title: "31", subtitle: "77% to finish plan"},
    {heading: t("totalKilometersPlannedForNextDay"), title: "9438 km", subtitle: ""},
  ];


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
    </Box>
  );
};

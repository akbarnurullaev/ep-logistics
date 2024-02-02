import {Card, CardContent} from "@mui/joy";
import Typography from "@mui/joy/Typography";
import Box from "@mui/joy/Box";
import {useI18n} from "../logic/i18n.ts";

export const Dashboard = () => {
  const {t} = useI18n();

  const data = [
    {heading: t("totalActiveOrders"), title: "+2350", subtitle: "+180.1% from last month"},
    {heading: t("activeOrdersForNextDay"), title: "+1234", subtitle: "+19% from last month"},
    {heading: t("activeVehiclesAvailable"), title: "+573", subtitle: "+201 since last hour"},
    {heading: t("ordersAllocatedToDrivers"), title: "80%", subtitle: "+5% from last month"},
    {heading: t("unallocatedOrdersForNextDay"), title: "+150", subtitle: "+10% from last month"},
    {heading: t("totalKilometersPlannedForNextDay"), title: "+1234 km", subtitle: "+19% from last month"},
  ];


  return (
    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "space-between", width: "100%" }}>
      {data.map(({heading, title,subtitle}) => (
        <Card key={heading} variant="outlined" sx={{flexBasis: {xl: "calc(33% - 8px)", lg: "calc(50% - 8px)", md: "calc(50% - 8px)", sm: "calc(50% - 8px)", xs: "100%"} }}>
          <CardContent>
            <Typography level="title-md">{heading}</Typography>
            <Typography mt={2} level="h2">{title}</Typography>
            <Typography textColor="text.tertiary">{subtitle}</Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

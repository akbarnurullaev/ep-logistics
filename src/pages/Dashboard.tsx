import {Card, CardContent} from "@mui/joy";
import Typography from "@mui/joy/Typography";
import Box from "@mui/joy/Box";
import {useI18n} from "../logic/i18n.ts";

export const Dashboard = () => {
  const {t, language} = useI18n();

  const data = [
    {heading: t("totalActiveOrders"), title: "63", subtitle: language === "en" ? "+5.2% from yesterday" : "+5.2% ve srovnání s včerejškem"},
    {heading: t("activeOrdersForNextDay"), title: "45", subtitle: language === "en" ? "+3.5% from yesterday" : "+3.5% ve srovnání s včerejškem"},
    {heading: t("activeVehiclesAvailable"), title: "124", subtitle: language === "en" ? "+0,7% from yesterday" : "+0,7% ve srovnání s včerejškem"},
    {heading: t("ordersAllocatedToDrivers"), title: "23%", subtitle: ""},
    {heading: t("unallocatedOrdersForNextDay"), title: "31", subtitle: language === "en" ? "77% to finish plan" : "77% do dokončeni plánu"},
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

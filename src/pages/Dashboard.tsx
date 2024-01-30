import {Card, CardContent} from "@mui/joy";
import Typography from "@mui/joy/Typography";
import Box from "@mui/joy/Box";

const data = [
  {heading: "Total Active Orders", title: "+2350", subtitle: "+180.1% from last month"},
  {heading: "Active Orders for Next Day", title: "+1234", subtitle: "+19% from last month"},
  {heading: "Active Vehicles Available", title: "+573", subtitle: "+201 since last hour"},
  {heading: "Orders Allocated to Drivers", title: "80%", subtitle: "+5% from last month"},
  {heading: "Unallocated Orders for Next Day", title: "+150", subtitle: "+10% from last month"},
  {heading: "Total Kilometers Planned for Next Day", title: "+1234 km", subtitle: "+19% from last month"},
];

export const Dashboard = () => {
  return (
    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "space-between", width: "100%" }}>
      {data.map(({heading, title,subtitle}) => (
        <Card key={heading} variant="outlined" sx={{flexBasis: "32.5%" }}>
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

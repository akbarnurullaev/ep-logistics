import Table from "@mui/joy/Table";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import {useStaticDataStore} from "../logic/static-data.ts";

export const StaticData = () => {
  const {trucks, clients, distributionCenters} = useStaticDataStore();

  return (
    <>
      <Typography level="h3">Trucks</Typography>
      <Sheet
        className="OrderTableContainer"
        variant="outlined"
        sx={{
          display: { xs: "none", sm: "initial" },
          width: "100%",
          borderRadius: "sm",
          overflow: "auto",
          height: 400,
        }}
      >
        <Table
          aria-labelledby="tableTitle"
          stickyHeader
          hoverRow
          sx={{
            "--TableCell-headBackground": "var(--joy-palette-background-level1)",
            "--Table-headerUnderlineThickness": "1px",
            "--TableRow-hoverBackground": "var(--joy-palette-background-level1)",
            "--TableCell-paddingY": "4px",
            "--TableCell-paddingX": "8px",
          }}
        >
          <thead>
            <tr>
              <th style={{ width: 140, padding: "12px 6px" }}>Registration Number</th>
              <th style={{ width: 140, padding: "12px 6px" }}>Max Volume</th>
              <th style={{ width: 240, padding: "12px 6px" }}>Type</th>
              <th style={{ width: 240, padding: "12px 6px" }}>Last Seen (X)</th>
              <th style={{ width: 240, padding: "12px 6px" }}>Last Seen (Y)</th>
            </tr>
          </thead>
          <tbody>
            {trucks.map((row) => (
              <tr key={row.registrationNumber}>
                <td>
                  <Typography level="body-xs">{row.registrationNumber}</Typography>
                </td>
                <td>
                  <Typography level="body-xs">{row.maxVolume}</Typography>
                </td>
                <td>
                  <Typography level="body-xs">{row.type as string}</Typography>
                </td>
                <td>
                  <Typography level="body-xs">{row.lastSeenX}</Typography>
                </td>
                <td>
                  <Typography level="body-xs">{row.lastSeenY}</Typography>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Sheet>

      <Typography mt={2} level="h3">Distribution Centres</Typography>
      <Sheet
        className="OrderTableContainer"
        variant="outlined"
        sx={{
          display: { xs: "none", sm: "initial" },
          width: "100%",
          borderRadius: "sm",
          overflow: "auto",
          height: 400,
          mt: 1
        }}
      >
        <Table
          aria-labelledby="tableTitle"
          stickyHeader
          hoverRow
          sx={{
            "--TableCell-headBackground": "var(--joy-palette-background-level1)",
            "--Table-headerUnderlineThickness": "1px",
            "--TableRow-hoverBackground": "var(--joy-palette-background-level1)",
            "--TableCell-paddingY": "4px",
            "--TableCell-paddingX": "8px",
          }}
        >
          <thead>
            <tr>
              <th style={{ width: 140, padding: "12px 6px" }}>ID</th>
              <th style={{ width: 140, padding: "12px 6px" }}>Name</th>
              <th style={{ width: 240, padding: "12px 6px" }}>Goods</th>
            </tr>
          </thead>
          <tbody>
            {distributionCenters.map((row) => (
              <tr key={row.id}>
                <td>
                  <Typography level="body-xs">{row.id}</Typography>
                </td>
                <td>
                  <Typography level="body-xs">{row.name}</Typography>
                </td>
                <td>
                  <Typography level="body-xs">{row.goods.join(", ")}</Typography>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Sheet>

      <Typography mt={2} level="h3">Clients</Typography>
      <Sheet
        className="OrderTableContainer"
        variant="outlined"
        sx={{
          display: { xs: "none", sm: "initial" },
          width: "100%",
          borderRadius: "sm",
          overflow: "auto",
          height: 400,
          mt: 1
        }}
      >
        <Table
          aria-labelledby="tableTitle"
          stickyHeader
          hoverRow
          sx={{
            "--TableCell-headBackground": "var(--joy-palette-background-level1)",
            "--Table-headerUnderlineThickness": "1px",
            "--TableRow-hoverBackground": "var(--joy-palette-background-level1)",
            "--TableCell-paddingY": "4px",
            "--TableCell-paddingX": "8px",
          }}
        >
          <thead>
            <tr>
              <th style={{ width: 140, padding: "12px 6px" }}>ID</th>
              <th style={{ width: 140, padding: "12px 6px" }}>Company Name</th>
              <th style={{ width: 140, padding: "12px 6px" }}>Goods</th>
              <th style={{ width: 240, padding: "12px 6px" }}>Location</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((row) => (
              <tr key={row.id}>
                <td>
                  <Typography level="body-xs">{row.id}</Typography>
                </td>
                <td>
                  <Typography level="body-xs">{row.companyName as string}</Typography>
                </td>
                <td>
                  <Typography level="body-xs">{row.goods.join(", ")}</Typography>
                </td>
                <td>
                  <Typography level="body-xs">{row.location}</Typography>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Sheet>
    </>
  );
};

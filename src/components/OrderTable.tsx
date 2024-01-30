import * as React from "react";
import {useState} from "react";
import Box from "@mui/joy/Box";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import SearchIcon from "@mui/icons-material/Search";
import {useOrdersStore} from "../logic/orders.ts";

export default function OrderTable() {
  const [search, setSearch] = useState({clientName: "", date: ""});

  const {orders} = useOrdersStore();

  const data = orders.filter((order) => {
    const dateCriteria = search.date ? search.date === order.deliveryDate.toISOString().split("T")[0] : true;
    const clientNameCriteria = order.clientName.toLowerCase().includes(search.clientName.toLowerCase());
    return clientNameCriteria && dateCriteria;
  });

  return (
    <React.Fragment>
      {/*<Sheet*/}
      {/*  className="SearchAndFilters-mobile"*/}
      {/*  sx={{*/}
      {/*    display: { xs: "flex", sm: "none" },*/}
      {/*    my: 1,*/}
      {/*    gap: 1,*/}
      {/*  }}*/}
      {/*>*/}
      {/*  <Input*/}
      {/*    size="sm"*/}
      {/*    placeholder="Search"*/}
      {/*    startDecorator={<SearchIcon />}*/}
      {/*    sx={{ flexGrow: 1 }}*/}
      {/*  />*/}
      {/*  <IconButton*/}
      {/*    size="sm"*/}
      {/*    variant="outlined"*/}
      {/*    color="neutral"*/}
      {/*    onClick={() => setOpen(true)}*/}
      {/*  >*/}
      {/*    <FilterAltIcon />*/}
      {/*  </IconButton>*/}
      {/*  <Modal open={open} onClose={() => setOpen(false)}>*/}
      {/*    <ModalDialog aria-labelledby="filter-modal" layout="fullscreen">*/}
      {/*      <ModalClose />*/}
      {/*      <Typography id="filter-modal" level="h2">*/}
      {/*        Filters*/}
      {/*      </Typography>*/}
      {/*      <Divider sx={{ my: 2 }} />*/}
      {/*      <Sheet sx={{ display: "flex", flexDirection: "column", gap: 2 }}>*/}
      {/*        {renderFilters()}*/}
      {/*        <Button color="primary" onClick={() => setOpen(false)}>*/}
      {/*          Submit*/}
      {/*        </Button>*/}
      {/*      </Sheet>*/}
      {/*    </ModalDialog>*/}
      {/*  </Modal>*/}
      {/*</Sheet>*/}

      <Box
        className="SearchAndFilters-tabletUp"
        sx={{
          borderRadius: "sm",
          py: 2,
          display: { xs: "none", sm: "flex" },
          flexWrap: "wrap",
          gap: 1.5,
          "& > *": {
            minWidth: { xs: "120px", md: "160px" },
          },
        }}
      >
        <FormControl sx={{ flex: 1 }} size="sm">
          <FormLabel>Search by client name</FormLabel>
          <Input size="sm" placeholder="Search" startDecorator={<SearchIcon />} onChange={(e) => {
            setSearch((previousSearch) => ({...previousSearch, clientName: e.target.value}));
          }} />
        </FormControl>

        <FormControl sx={{ flex: 1 }} size="sm">
          <FormLabel>Search by date</FormLabel>
          <Input
            type="date"
            slotProps={{
              input: {
                max: new Date().toISOString().split("T")[0],
              },
            }}
            onChange={(e) => setSearch((previousSearch) => ({...previousSearch, date: e.target.value}))}
          />
        </FormControl>
      </Box>
      <Sheet
        className="OrderTableContainer"
        variant="outlined"
        sx={{
          display: { xs: "none", sm: "initial" },
          width: "100%",
          borderRadius: "sm",
          flexShrink: 1,
          overflow: "auto",
          minHeight: 0,
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
              <th style={{ width: 140, padding: "12px 6px" }}>Order ID</th>
              <th style={{ width: 140, padding: "12px 6px" }}>Product Type</th>
              <th style={{ width: 240, padding: "12px 6px" }}>Volume</th>
              <th style={{ width: 240, padding: "12px 6px" }}>Delivery Date</th>
              <th style={{ width: 240, padding: "12px 6px" }}>Delivery Time</th>
              <th style={{ width: 240, padding: "12px 6px" }}>Client Name</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id}>
                <td>
                  <Typography level="body-xs">{row.id}</Typography>
                </td>
                <td>
                  <Typography level="body-xs">{row.productType as string}</Typography>
                </td>
                <td>
                  <Typography level="body-xs">{row.volume}</Typography>
                </td>
                <td>
                  <Typography level="body-xs">{row.deliveryDate.toDateString()}</Typography>
                </td>
                <td>
                  <Typography level="body-xs">{row.deliveryTime.toDateString()}</Typography>
                </td>
                <td>
                  <Typography level="body-xs">{row.clientName}</Typography>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Sheet>
    </React.Fragment>
  );
}

import {Truck, useStaticDataStore} from "../logic/static-data.ts";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import Table from "@mui/joy/Table";
import {Order, useOrdersStore} from "../logic/orders.ts";
import {useDrag, useDrop} from "react-dnd";
import {useTheme} from "@mui/joy";

export const Planning = () => {
  const {trucks} = useStaticDataStore();
  const {orders} = useOrdersStore();

  return (
    <>
      <Typography level="h3">Available trucks</Typography>
      <Sheet
        className="OrderTableContainer"
        variant="outlined"
        sx={{
          display: {xs: "none", sm: "initial"},
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
              <th style={{width: 140, padding: "12px 6px"}}>Registration Number</th>
              <th style={{width: 140, padding: "12px 6px"}}>Max Volume</th>
              <th style={{width: 240, padding: "12px 6px"}}>Type</th>
              <th style={{width: 240, padding: "12px 6px"}}>Last Seen (X)</th>
              <th style={{width: 240, padding: "12px 6px"}}>Last Seen (Y)</th>
              <th style={{width: 240, padding: "12px 6px"}}>Delivery</th>
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
                <DeliveryRow truck={row} />
              </tr>
            ))}
          </tbody>
        </Table>
      </Sheet>

      <Typography mt={2} level="h3">Orders</Typography>
      <Sheet
        className="OrderTableContainer"
        variant="outlined"
        sx={{
          display: {xs: "none", sm: "initial"},
          width: "100%",
          borderRadius: "sm",
          flexShrink: 1,
          overflow: "auto",
          height: 400
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
              <th style={{width: 140, padding: "12px 6px"}}>Order ID</th>
              <th style={{width: 140, padding: "12px 6px"}}>Product Type</th>
              <th style={{width: 240, padding: "12px 6px"}}>Volume</th>
              <th style={{width: 240, padding: "12px 6px"}}>Delivery Date</th>
              <th style={{width: 240, padding: "12px 6px"}}>Delivery Time</th>
              <th style={{width: 240, padding: "12px 6px"}}>Client Name</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((row) => (
              <OrderRow key={row.id} row={row}/>
            ))}
          </tbody>
        </Table>
      </Sheet>
    </>
  );
};

const OrderRow = ({row}: {row: Order}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "BOX",
    item: row,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    })
  }));
    
  return (
    <tr key={row.id} style={{ opacity: isDragging ? 0.5 : 1 }} role="Handle" ref={drag}>
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
  );
};

const DeliveryRow = ({truck}:{truck: Truck}) => {
  const theme = useTheme();
  const {setOrderToTruckDelivery} = useStaticDataStore();
  const {removeOrder} = useOrdersStore();

  const [{isOver}, drop] = useDrop(() => ({
    accept: "BOX",
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    }),
    drop: (order: Order) => {
      setOrderToTruckDelivery(truck, order);
      removeOrder(order);
    },
  }));

  const deliveryOrderInfo = truck.delivery && `${truck.delivery?.clientName} - ${truck.delivery?.id}`;

  return (
    <td
      ref={drop}
      role="Dustbin"
      style={{ background: isOver ? theme.palette.background.level3 : "" }}>
      <Typography level="body-xs">{deliveryOrderInfo}</Typography>
    </td>
  );
};
import {Truck, useStaticDataStore} from "../logic/static-data.ts";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import Table from "@mui/joy/Table";
import {nextDayOrders, Order, useOrdersStore} from "../logic/orders.ts";
import {useDrag, useDrop} from "react-dnd";
import {useTheme} from "@mui/joy";
import {useI18n} from "../logic/i18n.ts";

export const Planning = () => {
  const {t} = useI18n();
  const {trucks} = useStaticDataStore();
  const {orders: allOrders} = useOrdersStore();

  const orders = nextDayOrders(allOrders);

  return (
    <>
      <Typography level="h3">{t("availableTrucks")}</Typography>
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
              <th style={{ padding: "12px 6px"}}>{t("registrationNumber")}</th>
              <th style={{ padding: "12px 6px"}}>{t("maxLoad")}</th>
              <th style={{ padding: "12px 6px"}}>{t("type")}</th>
              <th style={{ padding: "12px 6px"}}>{t("driverName")}</th>
              <th style={{ padding: "12px 6px"}}>{t("delivery")} 1</th>
              <th style={{ padding: "12px 6px"}}>{t("delivery")} 2</th>
              <th style={{ padding: "12px 6px"}}>{t("delivery")} 3</th>
              <th style={{ padding: "12px 6px"}}>{t("delivery")} 4</th>
            </tr>
          </thead>
          <tbody>
            {trucks.map((row) => (
              <tr key={row.registrationNumber}>
                <td>
                  <Typography level="body-xs">{row.registrationNumber}</Typography>
                </td>
                <td>
                  <Typography level="body-xs">{row.maxLoad}</Typography>
                </td>
                <td>
                  <Typography level="body-xs">{row.types}</Typography>
                </td>
                <td>
                  <Typography level="body-xs">{row.driverName}</Typography>
                </td>
                <DeliveryRow truck={row} index={1}/>
                <DeliveryRow truck={row} index={2}/>
                <DeliveryRow truck={row} index={3}/>
                <DeliveryRow truck={row} index={4}/>
              </tr>
            ))}
          </tbody>
        </Table>
      </Sheet>

      <Typography mt={2} level="h3">{t("orders")}</Typography>
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
              <th style={{width: 140, padding: "12px 6px"}}>{t("orderId")}</th>
              <th style={{width: 140, padding: "12px 6px"}}>{t("productType")}</th>
              <th style={{width: 240, padding: "12px 6px"}}>{t("volume")}</th>
              <th style={{width: 240, padding: "12px 6px"}}>{t("deliveryDate")}</th>
              <th style={{width: 240, padding: "12px 6px"}}>{t("deliveryTime")}</th>
              <th style={{width: 240, padding: "12px 6px"}}>{t("clientName")}</th>
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
        <Typography level="body-xs">{row.deliveryDate}</Typography>
      </td>
      <td>
        <Typography level="body-xs">{row.deliveryTime}</Typography>
      </td>
      <td>
        <Typography level="body-xs">{row.clientName}</Typography>
      </td>
    </tr>
  );
};

const DeliveryRow = ({truck, index}:{truck: Truck, index: 1|2|3|4}) => {
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
      setOrderToTruckDelivery(truck, order, index);
      removeOrder(order);
    },
  }));

  const deliveryOrderInfo =
      truck[`delivery${index}`] && `${truck[`delivery${index}`]?.clientName} - ${truck[`delivery${index}`]?.id}`;

  return (
    <td
      ref={drop}
      role="Dustbin"
      style={{ background: isOver ? theme.palette.background.level3 : "" }}>
      <Typography level="body-xs">{deliveryOrderInfo}</Typography>
    </td>
  );
};
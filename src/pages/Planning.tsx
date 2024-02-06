import {Truck, useStaticDataStore} from "../logic/static-data.ts";
import Typography from "@mui/joy/Typography";
import {nextDayOrders, Order, useOrdersStore} from "../logic/orders.ts";
import {useDrag, useDrop} from "react-dnd";
import {useTheme} from "@mui/joy";
import {useI18n} from "../logic/i18n.ts";
import {CustomDataGrid} from "../components/common/CustomDataGrid.tsx";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import Box from "@mui/joy/Box";

export const Planning = () => {
  const {t} = useI18n();
  const {trucks} = useStaticDataStore();
  const {orders: allOrders} = useOrdersStore();

  const orders = nextDayOrders(allOrders);

  return (
    <>
      <Typography level="h3">{t("availableTrucks")}</Typography>
      <Box sx={{ maxHeight: 600 }}>
        <CustomDataGrid
          getRowId={({registrationNumber}) => registrationNumber}
          rows={trucks}
          columns={[
            {headerName: t("registrationNumber"), field: "registrationNumber", valueGetter: ({row}) => row.registrationNumber, flex: 1},
            {headerName: t("maxLoad"), field: "maxLoad", valueGetter: ({row}) => row.maxLoad, flex: 0.6},
            {headerName: t("type"), field: "type", valueGetter: ({row}) => row.types, flex: 1},
            {headerName: t("driverName"), field: "driverName", valueGetter: ({row}) => row.driverName, flex: 1},
            {headerName: t("allocatedDepot"), field: "allocatedDepot", valueGetter: ({row}) => row.allocatedDepot, flex: 1},
            {headerName: t("lastSeen"), field: "location", valueGetter: ({row}) => row.location, flex: 1},
            {headerName: `${t("delivery")} 1`, field: "delivery1", renderCell: ({row}) => <DeliveryRow truck={row} index={1}/>, flex: 1.5},
            {headerName: `${t("delivery")} 2`, field: "delivery2", renderCell: ({row}) => <DeliveryRow truck={row} index={2}/>, flex: 1.5},
            {headerName: `${t("delivery")} 3`, field: "delivery3", renderCell: ({row}) => <DeliveryRow truck={row} index={3}/>, flex: 1.5},
            {headerName: `${t("delivery")} 4`, field: "delivery4", renderCell: ({row}) => <DeliveryRow truck={row} index={4}/>, flex: 1.5},
          ]}
        />
      </Box>

      <Typography mt={2} level="h3">{t("orders")}</Typography>
      <Box sx={{ maxHeight: 600 }}>
        <CustomDataGrid
          rows={orders}
          columns={[
            {field: "id", headerName: t("id"), valueGetter: ({row}) => row.id, flex: 1, renderCell:({row}) => <OrderIdDnD row={row}/>},
            {field: "productType", headerName: t("productType"), valueGetter: ({row}) => row.productType, flex: 1},
            {field: "volume", headerName: t("volume"), valueGetter: ({row}) => row.volume, flex: 1},
            {field: "deliveryDate", headerName: t("deliveryDate"), valueGetter: ({row}) => row.deliveryDate, flex: 1},
            {field: "deliveryTime", headerName: t("deliveryTime"), valueGetter: ({row}) => row.deliveryTime, flex: 0.8},
            {field: "clientName", headerName: t("clientName"), valueGetter: ({row}) => row.clientName, flex: 1.2},
          ]}
        />
      </Box>
    </>
  );
};

const OrderIdDnD = ({row}: {row: Order}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "BOX",
    item: row,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    })
  }));
    
  return (
    <Box
      role="Handle"
      ref={drag}
      key={row.id}
      sx={{ display: "flex", alignItems: "center" }}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <DragIndicatorIcon sx={{mr: 1}}/>
      <Typography fontSize={14}>
        {row.id}
      </Typography>
    </Box>
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

  const deliveryOrderInfo = truck[`delivery${index}`];

  return (
    <Box
      ref={drop}
      role="Dustbin"
      style={{ background: isOver ? theme.palette.background.level3 : "" }}
      sx={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Typography
        fontSize={12}
        sx={{
          whiteSpace: "wrap",
          overflow: "hidden",
          textOverflow: "balance"
        }}
      >
        {deliveryOrderInfo}
      </Typography>
    </Box>
  );
};
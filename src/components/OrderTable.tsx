import * as React from "react";
import {useState} from "react";
import {DataGrid} from "./common/DataGrid.tsx";
import {nextDayOrders, useOrdersStore} from "../logic/orders.ts";
import {useI18n} from "../logic/i18n.ts";
import Button from "@mui/joy/Button";


export default function OrderTable() {
  const {t} = useI18n();
  const {orders}= useOrdersStore();
  const [showOrdersForTomorrow, setShowOrdersForTomorrow]= useState(false);

  const OrdersForTomorrow = () => {
    return (
      <Button onClick={() => setShowOrdersForTomorrow(!showOrdersForTomorrow)} variant="plain" size="sm">{!showOrdersForTomorrow ? t("ordersForTomorrow") : t("allOrders")}</Button>
    );
  };

  const data = showOrdersForTomorrow ? nextDayOrders(orders) : orders;

  return (
    <React.Fragment>
      <DataGrid
        searchTitle={t("search")}
        data={data}
        addOn={<OrdersForTomorrow/>}
        columns={[
          {title: t("id"), valueGetter: (row) => row.id},
          {title: t("productType"), valueGetter: (row) => row.productType as string},
          {title: t("volume"), valueGetter: (row) => row.volume},
          {title: t("deliveryDate"), valueGetter: (row) => row.deliveryDate},
          {title: t("deliveryTime"), valueGetter: (row) => row.deliveryTime},
          {title: t("clientName"), valueGetter: (row) => row.clientName},
        ]}/>
    </React.Fragment>
  );
}

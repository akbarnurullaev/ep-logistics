import {useState} from "react";
import {nextDayOrders, Order, useOrdersStore} from "../logic/orders.ts";
import {useI18n} from "../logic/i18n.ts";
import Box from "@mui/joy/Box";
import {CustomDataGrid} from "../components/common/CustomDataGrid.tsx";
import {Button} from "@mui/material";
import {useCrudForms} from "../logic/crud-forms.ts";

const fields = [
  {
    label: "id",
    key: "id",
    fieldType: {
      type: "input",
    },
    validations: [
      {
        rule: "required",
        errorMessage: "id is required",
        level: "error",
      },
    ],
  },
  {
    label: "productType",
    key: "productType",
    fieldType: {
      type: "input",
    },
    validations: [
      {
        rule: "required",
        errorMessage: "productType is required",
        level: "error",
      },
    ],
  },
  {
    label: "volume",
    key: "volume",
    fieldType: {
      type: "input",
    },
    validations: [
      {
        rule: "required",
        errorMessage: "volume is required",
        level: "error",
      },
    ],
  },
  {
    label: "clientName",
    key: "clientName",
    fieldType: {
      type: "input",
    },
    validations: [
      {
        rule: "required",
        errorMessage: "clientName is required",
        level: "error",
      },
    ],
  },
  {
    label: "deliveryDate",
    key: "deliveryDate",
    fieldType: {
      type: "input",
    },
    validations: [
      {
        rule: "required",
        errorMessage: "deliveryDate is required",
        level: "error",
      },
    ],
  },
  {
    label: "deliveryTime",
    key: "deliveryTime",
    fieldType: {
      type: "input",
    },
    validations: [
      {
        rule: "required",
        errorMessage: "deliveryTime is required",
        level: "error",
      },
    ],
  },
] as const;

export function Orders() {
  const {t} = useI18n();
  const {orders, updateOrders}= useOrdersStore();
  const {setFormType, setSelectedData} =useCrudForms();
  const [showOrdersForTomorrow, setShowOrdersForTomorrow]= useState(false);

  const data = showOrdersForTomorrow ? nextDayOrders(orders) : orders;

  return (
    <Box sx={{ height: "80vh" }}>
      <CustomDataGrid
        importManagement={{
          onImport: (data) => updateOrders(data.validData as unknown as Order[]),
          fields
        }}
        addOn={(
          <Button sx={{ ml: 2 }} onClick={() => setShowOrdersForTomorrow(!showOrdersForTomorrow)} variant="text">
            {(!showOrdersForTomorrow ? t("ordersForTomorrow") : t("allOrders")).toUpperCase()}
          </Button>
        )}
        rows={data}
        onRowClick={({row: order}) => {
          setFormType("order");
          setSelectedData(order);
        }}
        columns={[
          {field: "id", headerName: t("id"), valueGetter: ({row}) => row.id, flex: 1},
          {field: "productType", headerName: t("productType"), valueGetter: ({row}) => row.productType, flex: 1},
          {field: "volume", headerName: t("volume"), valueGetter: ({row}) => `${row.volume} t.`, flex: 1},
          {field: "deliveryDate", headerName: t("deliveryDate"), valueGetter: ({row}) => row.deliveryDate, flex: 1},
          {field: "deliveryTime", headerName: t("deliveryTime"), valueGetter: ({row}) => row.deliveryTime, flex: 1},
          {field: "clientName", headerName: t("clientName"), valueGetter: ({row}) => row.clientName, flex: 1},
        ]}
      />
    </Box>
  );
}

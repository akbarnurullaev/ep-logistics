import React from "react";
import {Autocomplete, DialogContent, DialogTitle, FormControl, FormLabel, Input, Stack} from "@mui/joy";
import {Order, products, useOrdersStore} from "../../logic/orders.ts";
import {companies} from "../../logic/data.ts";
import Button from "@mui/joy/Button";
import {useI18n} from "../../logic/i18n.ts";
import {useCrudForms} from "../../logic/crud-forms.ts";
import {dateFormatter} from "../../helpers/dateFormatter.ts";

interface FormElements extends HTMLFormControlsCollection {
  productType: HTMLInputElement
  volume: HTMLInputElement
  clientName: HTMLInputElement
  deliveryDate: HTMLInputElement
  deliveryTime: HTMLInputElement
}
interface OrderFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

export const CreateOrder = () => {
  const {t} = useI18n();
  const {addOrder, updateOrder, removeOrder} = useOrdersStore();
  const {setFormType, selectedData, setSelectedData} = useCrudForms();

  const order = selectedData as Order;
  const isEditing = !!selectedData;


  return (
    <>
      <DialogTitle>{t(isEditing ? "updateOrder" : "createNewOrder")}</DialogTitle>
      <DialogContent>{t("fillInTheInformationOfTheOrder")}</DialogContent>
      <form
        onSubmit={(event: React.FormEvent<OrderFormElement>) => {
          event.preventDefault();
          const formElements = event.currentTarget.elements;
          const data = {
            clientName: formElements.clientName.value,
            productType: formElements.productType.value,
            volume: +formElements.volume.value,
            deliveryDate: dateFormatter(new Date(formElements.deliveryDate.value)),
            deliveryTime: formElements.deliveryTime.value,
          } as Omit<Order, "id">;
          if (isEditing) {
            updateOrder({...order, ...data});
          } else {
            addOrder(data);
          }
          setFormType(null);
        }}
      >
        <Stack spacing={2}>
          <FormControl>
            <FormLabel>{t("clientName")}</FormLabel>
            <Autocomplete
              freeSolo
              name="clientName"
              defaultValue={order?.clientName}
              options={companies.map((company) => company.name)}
              slotProps={{
                listbox: {
                  sx: {
                    zIndex: 2147483640
                  }
                }
              }}
            />
          </FormControl>
          <FormControl>
            <FormLabel>{t("productType")}</FormLabel>
            <Autocomplete
              freeSolo
              required
              name="productType"
              defaultValue={order?.productType as string}
              options={products}
              slotProps={{
                listbox: {
                  sx: {
                    zIndex: 2147483640
                  }
                }
              }}
            />
          </FormControl>
          <FormControl>
            <FormLabel>{t("volume")}</FormLabel>
            <Input name="volume" type="number" defaultValue={order?.volume} required />
          </FormControl>
          <FormControl>
            <FormLabel>{t("deliveryDate")}</FormLabel>
            <Input
              type="date"
              name="deliveryDate"
              defaultValue={order?.deliveryDate ? dateFormatter(new Date(order.deliveryDate)) : undefined}
            />
          </FormControl>
          <FormControl>
            <FormLabel>{t("deliveryTime")}</FormLabel>
            <Input
              slotProps={{
                input: {
                  type: "time",
                  id: "appt",
                  name: "deliveryTime",
                  step: "3600"
                },
              }}
              defaultValue={order?.deliveryTime}
            />
          </FormControl>

          <Button type="submit">{t("createNewOrder")}</Button>
          {isEditing && <Button variant="plain" type="submit" onClick={() => {
            removeOrder(order);
            setFormType(null);
            setSelectedData(null);
          }}>{t("delete")}</Button>}
        </Stack>
      </form>
    </>
  );
};
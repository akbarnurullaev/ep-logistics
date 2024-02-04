import React from "react";
import {Autocomplete, DialogContent, DialogTitle, FormControl, FormLabel, Input, Stack} from "@mui/joy";
import {Order, useOrdersStore} from "../../logic/orders.ts";
import {companies} from "../../logic/data.ts";
import Button from "@mui/joy/Button";
import {useI18n} from "../../logic/i18n.ts";
import {useCrudForms} from "../../logic/crud-forms.ts";

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
  const {addOrder} = useOrdersStore();
  const {setFormType} = useCrudForms();

  return (
    <>
      <DialogTitle>{t("createNewOrder")}</DialogTitle>
      <DialogContent>{t("fillInTheInformationOfTheOrder")}</DialogContent>
      <form
        onSubmit={(event: React.FormEvent<OrderFormElement>) => {
          event.preventDefault();
          const formElements = event.currentTarget.elements;
          const data = {
            clientName: formElements.clientName.value,
            productType: formElements.productType.value,
            volume: formElements.volume.value,
            deliveryDate: new Date(formElements.deliveryDate.value).toDateString(),
            deliveryTime: formElements.deliveryTime.value,
          } as Omit<Order, "id">;
          addOrder(data);
          setFormType(null);
        }}
      >
        <Stack spacing={2}>
          <FormControl>
            <FormLabel>{t("clientName")}</FormLabel>
            <Autocomplete
              freeSolo
              name="clientName"
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
            <Input name="productType" autoFocus required />
          </FormControl>
          <FormControl>
            <FormLabel>{t("volume")}</FormLabel>
            <Input name="volume" required />
          </FormControl>
          <FormControl>
            <FormLabel>{t("deliveryDate")}</FormLabel>
            <Input
              type="date"
              name="deliveryDate"
              slotProps={{
                input: {
                  max: new Date().toISOString().split("T")[0],
                },
              }}
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
            />
          </FormControl>

          <Button type="submit">{t("createNewOrder")}</Button>
        </Stack>
      </form>
    </>
  );
};
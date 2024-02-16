import {DialogContent, DialogTitle, FormControl, FormLabel, Input, Stack} from "@mui/joy";
import React from "react";
import Button from "@mui/joy/Button";
import {useI18n} from "../../logic/i18n.ts";
import {useItemsTimelineContext} from "../../pages/Planning.tsx";
import {useForm} from "react-hook-form";

interface FormElements extends HTMLFormControlsCollection {
  id:    HTMLInputElement
  end:   HTMLInputElement;
  start: HTMLInputElement;
}
interface ItemFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

export const allOptions = ["Travel to DC", "Loading", "Delivery", "Unloading"] as const;
const padStartFormatter = (str: number | string) => String(str).padStart(2, "0");

export const CreateItem = ({close}: {close: () => void }) => {
  const {t} = useI18n();
  const {addItem, items, shift} = useItemsTimelineContext();
  const { register, formState, watch } = useForm();
  const {isValid} = formState;

  const lastItem = items[items.length - 1];
  const lastItemIndex = lastItem ? allOptions.indexOf(lastItem.title) : -1;
  const value = allOptions[lastItemIndex + 1];
  const from = watch("start");
  const to = watch("end");

  const min = lastItem ? `${padStartFormatter(lastItem.relevance.end.getHours())}:${padStartFormatter(lastItem.relevance.end.getMinutes())}` : `${padStartFormatter(shift.start.getHours())}:${padStartFormatter(shift.start.getMinutes())}`;
  const max = `${padStartFormatter(shift.end.getHours())}:${padStartFormatter(shift.end.getMinutes())}`;

  return (
    <div>
      <DialogTitle>item</DialogTitle>
      <DialogContent>Values should be within the valid range. From {min} to {max}</DialogContent>
      <form
        onSubmit={(event: React.FormEvent<ItemFormElement>) => {
          event.preventDefault();
          const formElements = event.currentTarget.elements;
          const data = {
            id:    `${formElements.id.value}-${Math.random()}`,
            end:   new Date(new Date().setHours(+formElements.end.value.split(":")[0], +formElements.end.value.split(":")[1], 0)),
            start: new Date(new Date().setHours(+formElements.start.value.split(":")[0], +formElements.start.value.split(":")[1], 0))
          };

          close();
        }}
      >
        <Stack spacing={2}>
          <FormControl>
            <FormLabel>{t("clientName")}</FormLabel>
            <Input
              {...register("id")}
              name="id"
              value={value}
            />
          </FormControl>
          <FormControl>
            <FormLabel>From</FormLabel>
            <Input
              {...register("start", {min, max: to ? to : max, required: true })}
              slotProps={{
                input: {
                  type: "time",
                  id: "appt",
                  name: "start",
                },
              }}
            />
          </FormControl>
          <FormControl>
            <FormLabel>To</FormLabel>
            <Input
              {...register("end", {min: from ? from : min, max, required: true })}
              slotProps={{
                input: {
                  type: "time",
                  id: "appt",
                },
              }}
            />
          </FormControl>

          <Button disabled={!isValid} type="submit">{t("createNewOrder")}</Button>
        </Stack>
      </form>
    </div>
  );
};
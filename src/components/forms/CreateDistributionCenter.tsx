import React from "react";
import {DialogContent, DialogTitle, FormControl, FormLabel, Input, Stack} from "@mui/joy";
import Button from "@mui/joy/Button";
import {useI18n} from "../../logic/i18n.ts";
import {useCrudForms} from "../../logic/crud-forms.ts";
import {DistributionCenter, useStaticDataStore} from "../../logic/static-data.ts";

interface FormElements extends HTMLFormControlsCollection {
    name: HTMLInputElement
    goods: HTMLInputElement
    location: HTMLInputElement
}
interface OrderFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

export const CreateDistributionCenter = () => {
  const {t} = useI18n();
  const {addDistributionCenter, updateDistributionCenter, deleteDistributionCenter} = useStaticDataStore();
  const {setFormType, selectedData, setSelectedData} = useCrudForms();

  const selectedDistributionCenter = selectedData as DistributionCenter;
  const isEditing = !!selectedData;

  const text = {
    title: t(isEditing ? "updateDistributionCenter" : "createNewDistributionCenter"),
    content: t("fillInTheInformationOfTheDistributionCenter"),
    submitButton: t(isEditing ? "updateDistributionCenter" : "createNewDistributionCenter"),
    deleteButton: t("delete")
  };

  return (
    <>
      <DialogTitle>{text.title}</DialogTitle>
      <DialogContent>{text.content}</DialogContent>
      <form
        onSubmit={(event: React.FormEvent<OrderFormElement>) => {
          event.preventDefault();
          const formElements = event.currentTarget.elements;
          const data: Omit<DistributionCenter, "id"> = {
            name: formElements.name.value,
            goods: formElements.goods.value,
            location: formElements.location.value,
          };
          if (isEditing) {
            updateDistributionCenter({...selectedDistributionCenter, ...data});
          } else {
            addDistributionCenter(data);
          }
          setFormType(null);
        }}
      >
        <Stack spacing={2}>
          <FormControl>
            <FormLabel>{t("name")}</FormLabel>
            <Input name="name" defaultValue={selectedDistributionCenter?.name} autoFocus required />
          </FormControl>

          <FormControl>
            <FormLabel>{t("goods")}</FormLabel>
            <Input name="goods" defaultValue={selectedDistributionCenter?.goods} required />
          </FormControl>

          <FormControl>
            <FormLabel>{t("location")}</FormLabel>
            <Input name="location" defaultValue={selectedDistributionCenter?.location} required />
          </FormControl>

          <Button type="submit">{text.submitButton}</Button>
          {isEditing && <Button variant="plain" type="submit" onClick={() => {
            deleteDistributionCenter(selectedDistributionCenter);
            setFormType(null);
            setSelectedData(null);
          }}>{text.deleteButton}</Button>}
        </Stack>
      </form>
    </>
  );
};
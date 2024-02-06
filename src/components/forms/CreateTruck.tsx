import React from "react";
import {Autocomplete, DialogContent, DialogTitle, FormControl, FormLabel, Input, Stack} from "@mui/joy";
import {companies} from "../../logic/data.ts";
import Button from "@mui/joy/Button";
import {useI18n} from "../../logic/i18n.ts";
import {useCrudForms} from "../../logic/crud-forms.ts";
import {Truck, useStaticDataStore} from "../../logic/static-data.ts";

interface FormElements extends HTMLFormControlsCollection {
    registrationNumber: HTMLInputElement
    driverName: HTMLInputElement
    maxLoad: HTMLInputElement
    types: HTMLInputElement
    allocatedDepot: HTMLInputElement
    location: HTMLInputElement
}
interface TruckFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

export const CreateTruck = () => {
  const {t} = useI18n();
  const {addTruck, deleteTruck, updateTruck} = useStaticDataStore();
  const {setFormType, setSelectedData, selectedData} = useCrudForms();

  const selectedTruck = selectedData as Truck;
  const isEditing = !!selectedData;

  const text = {
    title: t(isEditing ? "updateTruck" : "createNewTruck"),
    content: t("fillInTheInformationOfTheTruck"),
    submitButton: t(isEditing ? "updateTruck" : "createNewTruck"),
    deleteButton: t("delete")
  };

  return (
    <>
      <DialogTitle>{text.title}</DialogTitle>
      <DialogContent>{text.content}</DialogContent>
      <form
        onSubmit={(event: React.FormEvent<TruckFormElement>) => {
          event.preventDefault();
          const formElements = event.currentTarget.elements;
          const data: Omit<Truck, "delivery1" | "delivery2" | "delivery3" | "delivery4"> = {
            registrationNumber: formElements.registrationNumber.value,
            driverName: formElements.driverName.value,
            maxLoad: +formElements.maxLoad.value,
            types: formElements.types.value,
            allocatedDepot: formElements.allocatedDepot.value,
            location: formElements.location.value,
          };
          if (isEditing) {
            updateTruck({...selectedTruck, ...data});
          } else {
            addTruck(data);
          }
          setFormType(null);
        }}
      >
        <Stack spacing={2}>
          <FormControl>
            <FormLabel>{t("registrationNumber")}</FormLabel>
            <Input name="registrationNumber" defaultValue={selectedTruck?.registrationNumber} autoFocus required />
          </FormControl>
          <FormControl>
            <FormLabel>{t("driverName")}</FormLabel>
            <Input name="driverName" defaultValue={selectedTruck?.driverName} autoFocus required />
          </FormControl>

          <FormControl>
            <FormLabel>{t("maxLoad")}</FormLabel>
            <Input name="maxLoad" type="number" defaultValue={selectedTruck?.maxLoad} required />
          </FormControl>

          <FormControl>
            <FormLabel>{t("types")}</FormLabel>
            <Input name="types" defaultValue={selectedTruck?.types} required />
          </FormControl>

          <FormControl>
            <FormLabel>{t("location")}</FormLabel>
            <Input name="location" defaultValue={selectedTruck?.location} required />
          </FormControl>
            
          <FormControl>
            <FormLabel>{t("allocatedDepot")}</FormLabel>
            <Autocomplete
              freeSolo
              name="allocatedDepot"
              defaultValue={selectedTruck?.allocatedDepot}
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

          <Button type="submit">{text.submitButton}</Button>
          {isEditing && <Button variant="plain" type="submit" onClick={() => {
            deleteTruck(selectedTruck);
            setFormType(null);
            setSelectedData(null);
          }}>{text.deleteButton}</Button>}
        </Stack>
      </form>
    </>
  );
};
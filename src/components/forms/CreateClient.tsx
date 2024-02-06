import React from "react";
import {DialogContent, DialogTitle, FormControl, FormLabel, Input, Stack} from "@mui/joy";
import Button from "@mui/joy/Button";
import {useI18n} from "../../logic/i18n.ts";
import {useCrudForms} from "../../logic/crud-forms.ts";
import {Client, useStaticDataStore} from "../../logic/static-data.ts";

interface FormElements extends HTMLFormControlsCollection {
    companyName: HTMLInputElement
    goods: HTMLInputElement
    location: HTMLInputElement
}
interface ClientFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

export const CreateClient = () => {
  const {t} = useI18n();
  const {addClient, deleteClient, updateClient} = useStaticDataStore();
  const {setFormType, selectedData, setSelectedData} = useCrudForms();

  const selectedClient = selectedData as Client;
  const isEditing = !!selectedData;

  const text = {
    title: t(isEditing ? "updateClient" : "createNewClient"),
    content: t("fillInTheInformationOfTheClient"),
    submitButton: t(isEditing ? "updateClient" : "createNewClient"),
    deleteButton: t("delete")
  };

  return (
    <>
      <DialogTitle>{text.title}</DialogTitle>
      <DialogContent>{text.content}</DialogContent>
      <form
        onSubmit={(event: React.FormEvent<ClientFormElement>) => {
          event.preventDefault();
          const formElements = event.currentTarget.elements;
          const data: Omit<Client, "id"> = {
            companyName: formElements.companyName.value,
            goods: formElements.goods.value,
            location: formElements.location.value,
          };
          if (isEditing) {
            updateClient({...selectedClient, ...data});
          } else {
            console.log("ewfwefewf");
            addClient(data);
          }
          setFormType(null);
        }}
      >
        <Stack spacing={2}>
          <FormControl>
            <FormLabel>{t("companyName")}</FormLabel>
            <Input name="companyName" defaultValue={selectedClient?.companyName} autoFocus required />
          </FormControl>

          <FormControl>
            <FormLabel>{t("goods")}</FormLabel>
            <Input name="goods" defaultValue={selectedClient?.goods} required />
          </FormControl>

          <FormControl>
            <FormLabel>{t("location")}</FormLabel>
            <Input name="location" defaultValue={selectedClient?.location} required />
          </FormControl>

          <Button type="submit">{text.submitButton}</Button>
          {isEditing && <Button variant="plain" type="submit" onClick={() => {
            deleteClient(selectedClient);
            setFormType(null);
            setSelectedData(null);
          }}>{text.deleteButton}</Button>}
        </Stack>
      </form>
    </>
  );
};
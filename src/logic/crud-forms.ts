import {create} from "zustand";
import {Order} from "./orders.ts";
import {Client, DistributionCenter, Truck} from "./static-data.ts";

type State = {
    formType: FormType | null
    setFormType: (formType: FormType | null) => void
    selectedData: SelectedDataType | null
    setSelectedData: (formType: SelectedDataType | null) => void
}
export type FormType = "truck" | "client" | "order" | "distributionCenter"
export type SelectedDataType = Order | Client | Truck | DistributionCenter


export const useCrudForms = create<State>((set) => ({
  formType: null,
  setFormType: (formType: FormType | null) => set({ formType }),
  selectedData: null,
  setSelectedData: (selectedData: SelectedDataType | null) => set({ selectedData })
}));
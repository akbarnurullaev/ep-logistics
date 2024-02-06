import {create} from "zustand";
import {useI18n} from "./i18n.ts";
import {getDistanceMatrix} from "./data.ts";

export const names = [
  "Josef Svoboda","Petr Horák",
  "Lucie Dvořáková","Anna Svobodová", "Jana Novák",
  "Veronika Horáková","Marie Svobodová","Tomáš Procházková",
  "Petr Němec", "Lucie Černá","Tomáš Procházková",
  "Michaela Horáková","Miroslav Dvořák","Josef Kučerová",
  "Marie Němcová","Jana Veselá","Jana Procházka",
  "Miroslav Procházková", "Jana Nováková","Veronika Dvořák",
  "Jana Dvořák","Tomáš Horák","Petr Novotný",
  "Jiří Novotný", "Miroslav Horáková","Jiří Horák",
  "Pavel Svoboda","Jaroslav Svobodová", "Martin Veselá",
  "Jiří Veselý","Lucie Svoboda","Jana Němec",
  "Jiří Němcová", "Lenka Procházková","Pavel Černá",
  "Marie Němcová","Josef Dvořák", "Marie Kučerová",
  "Anna Dvořáková", "Jan Novák","Miroslav Novotná",
  "Pavel Novák","Pavel Novotná","Jan Horáková",
  "Lucie Novák","František Dvořák", "Josef Kučerová",
  "Veronika Němec", "Petra Novotná","Eva Černý",
  ""
] as const;
export const products = [
  "Cement",
  "Létavý popel",
  "Betonový prášek",
  "Vápno",
  "Písek",
  "Štěrk",
  "Sádrovec",
  "Baryt",
  "Mouka a zrno",
  "Plasty ve formě prášku",
  "Sodná sůl",
  "Granulované nebo práškové krmivo pro zvířata",
  "Sůl",
  "Draselno",
  "Kovové prášky",
  "Pigmenty a barviva",
  "Uhlíkový prach",
  "Hnojiva",
  "Síra",
  "Aluminia"
] as const;

export type ProductType = keyof typeof products

export interface DistanceMatrixEntity {
    id: string
    name: string
    time: string
    distance: string
}

type State = {
    distanceMatrix: DistanceMatrixEntity[]
}

export const useDistanceMatrixStore = () => {
  const {language} = useI18n();
  const distanceMatrix = getDistanceMatrix(language);
  return create<State>(() => ({
    distanceMatrix,
  }))();
};

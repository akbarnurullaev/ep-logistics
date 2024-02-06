import {create} from "zustand";
import {getRandomValue} from "../helpers/utils.ts";
import {dateFormatter} from "../helpers/dateFormatter.ts";

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
export const clientNames  = [
  "Stavební Podnik Praha",
  "Betonové Řešení s.r.o.",
  "Zelená Pole Agro a.s.",
  "Sklárny CrystalTech",
  "InfraStav Polsko",
  "Ekostav Matériały",
  "Budujeme Budoucnost Kft.",
  "TisztaVíz Kezelés Zrt.",
  "VitalKrmivo Solutions",
  "MetalTech Innováció",
  "Barvy a Laky Bright",
  "Polymery HighTech Sp. z o.o.",
  "Bezpečné Sklady s.r.o.",
  "Rychlé Cesty a.s.",
  "Kamenolom SolidStone Kft.",
  "Vysoké Stavby SK",
  "Obnovitelné Zdroje Energii",
  "EcoHnojiva CZ",
  "AquaČistota Vodní Systémy",
  "Globální Obiloviny s.r.o.",
  "Městská Zelená s.r.o.",
  "Domovní Rozvoj SK a.s.",
  "Čistá Energie HU Zrt.",
  "AgroTech Východ s.r.o.",
  "SkloDesign Polska",
  "Inovační Kovové Technologie",
  "Prostor pro Život Kft.",
  "Voda Plus SK",
  "Solární Řešení s.r.o.",
  "Zahrada Budoucnosti Zrt."
];

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

export interface Order {
    id: string
    productType: ProductType
    volume: number
    clientName: string
    deliveryDate: string
    deliveryTime: string
}

type State = {
    orders: Order[]
    addOrder: (order: Omit<Order, "id">) => void
    updateOrder: (order: Order) => void
    removeOrder: (removableOrder: Order) => void
    updateOrders: (newOrders: Order[]) => void
}

export const nextDayOrders = (orders: Order[]) => orders.filter((order) => new Date() < new Date(order.deliveryDate) && new Date(order.deliveryDate) < new Date(Date.now() + (86400000)));

export function getRandomDate() {
  const startDate = new Date(Date.now() - (86400000 * 2));
  const endDate = new Date(Date.now() + (86400000 * 2));
    
  const timeDiff = endDate.getTime() - startDate.getTime();
  const randomTime = Math.random() * timeDiff;

  return new Date(startDate.getTime() + randomTime);
}

let orders = Array.from({length: 50}, () => ({
  id: `ORD-${getRandomValue(0, 99999)}`,
  productType: products[getRandomValue(0, products.length)] as ProductType,
  volume: getRandomValue(2, 20),
  clientName: clientNames[getRandomValue(0, clientNames.length)],
  deliveryDate: dateFormatter(getRandomDate()),
  deliveryTime: `${String(getRandomValue(0, 24)).padStart(2, "0")}:00`
}));
orders = [...new Map(orders.map(item =>
  [item["id"], item])).values()];

const persistedOrders = () => {
  try {
    const jsonpa = JSON.parse(localStorage.getItem("orders") as string);
    return jsonpa.length ? jsonpa : [];
  } catch (e) {
    return [];
  }
};
export const addPersistedOrder = (newOrder: Omit<Order, "id">) => {
  const persistedOrders_ = persistedOrders();
  localStorage.setItem("orders", JSON.stringify([...persistedOrders_, {id: `ORD-${getRandomValue(100, 900)}`, ...newOrder}]));
};

export const useOrdersStore = create<State>((set) => ({
  orders: [...orders, ...persistedOrders()],
  addOrder: (newOrder) => set((state) => ({ orders: [...state.orders, {id: `ORD-${getRandomValue(100, 900)}`, ...newOrder}] })),
  updateOrder: (updatedOrder) => set((state) => {
    const foundOrderIndex = state.orders.findIndex((order) => order.id === updatedOrder.id);
    const orders = [...state.orders];

    orders[foundOrderIndex] = {...orders[foundOrderIndex], ...updatedOrder};

    return {orders};
  }),
  removeOrder: (removableOrder) => {
    set((state) => ({ orders: [...state.orders].filter((order) => order.id !== removableOrder.id) }));
  },
  updateOrders: newOrders => set((state) => ({ orders: [...state.orders, ...newOrders] })),
}));

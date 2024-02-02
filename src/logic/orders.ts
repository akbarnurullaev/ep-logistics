import {create} from "zustand";
import {getRandomValue} from "../helpers/utils.ts";

export const names = ["Alex John", "Vladimir Kriz", "Ricardo Milos", "Vlad Cohen", "Akbar Nurulloev"] as const;
export const companyNames = ["ABC Constructions", "XYZ Builders", "DEF Infrastructure"] as const;
export const products = [
  "Cement",
  " Fly Ash",
  " Concrete Powder",
  " Lime",
  " Sand",
  " Gravel",
  " Gypsum",
  " Barite",
  " Flour and Grain",
  " Plastics in Powder Form",
  " Soda Ash",
  " Pelleted or Powdered Animal Feed",
  " Salt",
  " Potash",
  " Metal Powders",
  " Pigments and Dyes",
  " Coal Dust",
  " Fertilizers",
  " Sulfur",
  " Alumina"
] as const;

export type ProductType = keyof typeof products
export type CompanyName = keyof typeof companyNames

export interface Order {
    id: string
    productType: ProductType
    volume: string
    clientName: string
    deliveryDate: string
    deliveryTime: string
}

type State = {
    orders: Order[]
    addOrder: (order: Omit<Order, "id">) => void
    removeOrder: (removableOrder: Order) => void
}

export const nextDayOrders = (orders: Order[]) => orders.filter((order) => new Date(order.deliveryDate) > new Date());

export function getRandomDate() {
  const startDate = new Date(Date.now() - (86400000 * 2));
  const endDate = new Date(Date.now() + (86400000 * 2));
    
  const timeDiff = endDate.getTime() - startDate.getTime();
  const randomTime = Math.random() * timeDiff;

  return new Date(startDate.getTime() + randomTime);
}

let orders = Array.from({length: 10}, () => ({
  id: `ORD-${getRandomValue(0, 99999)}`,
  productType: products[getRandomValue(0, products.length)] as ProductType,
  volume: `${getRandomValue(1, 20)} tonnes`,
  clientName: names[getRandomValue(0, 4)],
  deliveryDate: getRandomDate().toDateString(),
  deliveryTime: getRandomDate().toLocaleTimeString("en-US")
}));
orders = [...new Map(orders.map(item =>
  [item["id"], item])).values()];

export const useOrdersStore = create<State>((set) => ({
  orders,
  addOrder: (newOrder) => set((state) => ({ orders: [...state.orders, {id: `ORD-${getRandomValue(100, 900)}`, ...newOrder}] })),
  removeOrder: (removableOrder) => {
    set((state) => ({ orders: [...state.orders].filter((order) => order.id !== removableOrder.id) }));
  }
}));

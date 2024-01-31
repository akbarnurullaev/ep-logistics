import {create} from "zustand";
import {getRandomValue} from "../helpers/utils.ts";

export const names = ["Alex John", "Vladimir Kriz", "Ricardo Milos", "Vlad Cohen", "Akbar Nurulloev"];
export const companyNames = ["ABC Constructions", "XYZ Builders", "DEF Infrastructure"];
export const productType = ["Cement", "Fly Ash", "Concrete Powder", "Lime", "Sand"];

export type ProductType = keyof typeof productType
export type CompanyName = keyof typeof companyNames

export interface Order {
    id: string
    productType: ProductType
    volume: string
    clientName: string
    deliveryDate: Date
    deliveryTime: Date
}

type State = {
    orders: Order[]
    addOrder: (order: Omit<Order, "id">) => void
    removeOrder: (removableOrder: Order) => void
}

let orders = Array.from({length: 10}, () => ({
  id: `INV-${getRandomValue(100, 900)}`,
  productType: productType[getRandomValue(0, 4)] as ProductType,
  volume: `${getRandomValue(1, 20)} tonnes`,
  clientName: names[getRandomValue(0, 4)],
  deliveryDate: new Date(new Date().valueOf() - Math.random()*(1e+12)),
  deliveryTime: new Date(new Date().valueOf() - Math.random()*(1e+12))
}));
orders = [...new Map(orders.map(item =>
  [item["id"], item])).values()];

export const useOrdersStore = create<State>((set) => ({
  orders,
  addOrder: (newOrder) => set((state) => ({ orders: [...state.orders, {id: `INV-${getRandomValue(100, 900)}`, ...newOrder}] })),
  removeOrder: (removableOrder) => {
    set((state) => ({ orders: [...state.orders].filter((order) => order.id !== removableOrder.id) }));
  }
}));

import {create} from "zustand";
import {getRandomValue} from "../helpers/utils.ts";
import {names, Order, products} from "./orders.ts";
import {companies, locations} from "./data.ts";

export interface Truck {
    registrationNumber: string
    driverName: string
    maxLoad: string
    types: string
    delivery1?: Order
    delivery2?: Order
    delivery3?: Order
    delivery4?: Order
}

interface DistributionCenter {
    id: string
    name: string
    goods: string
    location: string
}

interface Client {
    id: string
    companyName: string
    goods: string
    location: string
}

type State = {
    trucks: Truck[]
    clients: Client[]
    distributionCenters: DistributionCenter[]
    setOrderToTruckDelivery: (truck: Truck, order: Order, index: 1|2|3|4) => void
}

const getRandomGoods = () => {
  return [products[getRandomValue(0, products.length)], products[getRandomValue(0, products.length)], products[getRandomValue(0, products.length)]].join(", ");
};

let trucks: Truck[] = Array.from({length: 10}, () => ({
  registrationNumber: `TR-${getRandomValue(100, 900)}`,
  driverName: names[getRandomValue(0, 4)],
  maxLoad: `${getRandomValue(0, 20)} tons`,
  types: getRandomGoods(),
}));
trucks = [...new Map(trucks.map(item =>
  [item["registrationNumber"], item])).values()];

let clients = Array.from({length: 10}, () => {
  const company = companies[getRandomValue(0, companies.length)];
  return {
    id: `CL-${getRandomValue(0, 99999)}`,
    companyName: company.name,
    goods: getRandomGoods(),
    location: `${company.location.latitude}, ${company.location.longitude}`,
  };
});
clients = [...new Map(clients.map(item =>
  [item["id"], item])).values()];

let distributionCenters: DistributionCenter[] = Array.from({length: 5}, () => {
  const location = locations[getRandomValue(0, locations.length)];
  return {
    id: `DC-${getRandomValue(0, 999)}`,
    name: names[getRandomValue(0, 4)],
    goods: getRandomGoods(),
    location: location.name
  };
});
distributionCenters = [...new Map(distributionCenters.map(item =>
  [item["id"], item])).values()];

export const useStaticDataStore = create<State>((set) => ({
  trucks,
  clients,
  distributionCenters,
  setOrderToTruckDelivery: (truck, order, index) => {
    set((state) => {
      const trucks = [...state.trucks];
      const foundTruck = trucks.find((truck_) => truck_.registrationNumber === truck.registrationNumber);

      foundTruck![`delivery${index}`] = order;

      return {trucks};
    });
  }
}));

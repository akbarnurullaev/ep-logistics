import {create} from "zustand";
import {getRandomValue} from "../helpers/utils.ts";
import {CompanyName, companyNames, names, Order, ProductType, productType} from "./orders.ts";

export interface Truck {
    registrationNumber: string
    maxVolume: string
    type: ProductType
    lastSeenX: number
    lastSeenY: number
    delivery?: Order
}

interface DistributionCenter {
    id: string
    name: string
    goods: ProductType[]
}

interface Client {
    id: string
    companyName: CompanyName
    goods: ProductType[]
    location: string
}

type State = {
    trucks: Truck[]
    clients: Client[]
    distributionCenters: DistributionCenter[]
    setOrderToTruckDelivery: (truck: Truck, order: Order) => void
}

const trucks: Truck[] = Array.from({length: 40}, () => ({
  registrationNumber: `1Z2 ${getRandomValue(100, 900)}`,
  maxVolume: `${getRandomValue(0, 20)} tons`,
  type: productType[getRandomValue(0, 3)] as ProductType,
  lastSeenX: getRandomValue(-100, 100),
  lastSeenY: getRandomValue(-100, 100),
}));

const clients: Client[] = Array.from({length: 40}, () => ({
  id: `CL ${getRandomValue(100, 900)}`,
  companyName: companyNames[getRandomValue(0, 2)] as CompanyName,
  goods: productType as ProductType[],
  location: "New York"
}));

const distributionCenters: DistributionCenter[] = Array.from({length: 40}, () => ({
  id: `CL ${getRandomValue(100, 900)}`,
  name: names[getRandomValue(0, 4)],
  goods: productType as ProductType[],
}));

export const useStaticDataStore = create<State>((set) => ({
  trucks,
  clients,
  distributionCenters,
  setOrderToTruckDelivery: (truck, order) => {
    set((state) => {
      const foundTruck = state.trucks.find((truck_) => truck_.registrationNumber ===truck.registrationNumber);

      foundTruck!.delivery = order;

      if (foundTruck) {
        return {trucks: [...state.trucks, foundTruck]};
      }

      return {trucks: state.trucks};
    });
  }
}));
import {create} from "zustand";
import {getRandomValue} from "../helpers/utils.ts";
import {names, Order, products} from "./orders.ts";
import {companies, getDistanceMatrix, locations, truckCodes} from "./data.ts";

export interface Truck {
    registrationNumber: string
    driverName: string
    maxLoad: number
    types: string
    allocatedDepot: string
    location: string
    delivery1?: string
    delivery2?: string
    delivery3?: string
    delivery4?: string
}

export interface DistributionCenter {
    id: string
    name: string
    goods: string
    location: string
}

export interface Client {
    id: string
    companyName: string
    goods: string
    location: string
}

type State = {
    trucks: Truck[]
    clients: Client[]
    distributionCenters: DistributionCenter[]

    addClient: (client: Omit<Client, "id" >) => void
    updateClient: (client: Client) => void
    deleteClient: (client: Client) => void

    addTruck: (truck: Omit<Truck, "delivery1" | "delivery2" | "delivery3" | "delivery4">) => void
    updateTruck: (truck: Truck) => void
    deleteTruck: (truck: Truck) => void
    setOrderToTruckDelivery: (truck: Truck, order: Order, index: 1|2|3|4) => void
    resetTruckDeliveries: () => void

    addDistributionCenter: (distributionCenter: Omit<DistributionCenter, "id" >) => void
    updateDistributionCenter: (distributionCenter: DistributionCenter) => void
    deleteDistributionCenter: (distributionCenter: DistributionCenter) => void
}

const getRandomGoods = () => {
  return [products[getRandomValue(0, products.length)], products[getRandomValue(0, products.length)], products[getRandomValue(0, products.length)]].join(", ");
};

let trucks: Truck[] = Array.from({length: 10}, () => {
  const company = companies[getRandomValue(0, companies.length)];
  return {
    registrationNumber: truckCodes[getRandomValue(0, truckCodes.length)],
    driverName: names[getRandomValue(0, names.length - 1)],
    maxLoad: getRandomValue(1, 20),
    types: getRandomGoods(),
    allocatedDepot: company.name,
    location: `${company.location.latitude}, ${company.location.longitude}`,
  };
});
trucks = [...new Map(trucks.map(item =>
  [item["registrationNumber"], item])).values()];

let clients = Array.from({length: 10}, () => {
  const company = companies[getRandomValue(0, companies.length - 1)];
  return {
    id: `CL-${getRandomValue(100, 99999)}`,
    companyName: company.name,
    goods: getRandomGoods(),
    location: `${company.location.latitude}, ${company.location.longitude}`,
  };
});
clients = [...new Map(clients.map(item =>
  [item["id"], item])).values()];

let distributionCenters: DistributionCenter[] = Array.from({length: 5}, () => {
  const location = locations[getRandomValue(0, locations.length - 1)];
  return {
    id: `DC-${getRandomValue(100, 999)}`,
    name: location.name,
    goods: getRandomGoods(),
    location: `${location.location.latitude}, ${location.location.longitude}`
  };
});
distributionCenters = [...new Map(distributionCenters.map(item =>
  [item["id"], item])).values()];

export const useStaticDataStore = create<State>((set) => ({
  trucks,
  clients,
  distributionCenters,

  addClient: (newClient) => set((state) => {
    return {clients: [...state.clients, {id: `CL-${getRandomValue(100, 900)}`, ...newClient}]};
  }),
  deleteClient: (deletedClient) => set((state) => ({clients: state.clients.filter((client) => client.id !== deletedClient.id)})),
  updateClient: (updatedClient) => set((state) => {
    const foundClientIndex = state.clients.findIndex((client) => client.id === updatedClient.id);
    const clients = [...state.clients];

    clients[foundClientIndex] = {...clients[foundClientIndex], ...updatedClient};

    return {clients};
  }),

  addTruck: (newTruck) => set((state) => ({trucks: [...state.trucks, newTruck]})),
  deleteTruck: (deletedTruck) => set((state) => ({trucks: state.trucks.filter((truck) => truck.registrationNumber !== deletedTruck.registrationNumber)})),
  updateTruck: (updatedTruck) => set((state) => {
    const foundTruckIndex = state.trucks.findIndex((truck) => truck.registrationNumber === updatedTruck.registrationNumber);
    const trucks = [...state.trucks];

    trucks[foundTruckIndex] = {...trucks[foundTruckIndex], ...updatedTruck};

    return {trucks};
  }),
  setOrderToTruckDelivery: (truck, order, index) => {
    set((state) => {
      const trucks = [...state.trucks];
      const foundTruck = trucks.find((truck_) => truck_.registrationNumber === truck.registrationNumber);

      const deliveryTime = getDistanceMatrix("cz").find((dm) => dm.name === order.clientName)?.time || "2 hours";

        foundTruck![`delivery${index}`] = `${order.id} - ${order.clientName}: ${deliveryTime}`;

        return {trucks};
    });
  },
  resetTruckDeliveries: () => set(state => {
    const removedDeliveriesTrucks = state.trucks.map((truck) => ({...truck, delivery1: undefined, delivery2: undefined, delivery3: undefined, delivery4: undefined}));
    return {
      trucks: removedDeliveriesTrucks
    };
  }),

  addDistributionCenter: (newDistributionCenter) => set((state) => ({distributionCenters: [...state.distributionCenters, {id: `DC-${getRandomValue(100, 900)}`, ...newDistributionCenter}]})),
  deleteDistributionCenter: (deletedDistributionCenter) => set((state) => ({distributionCenters: state.distributionCenters.filter((distributionCenter) => distributionCenter.id !== deletedDistributionCenter.id)})),
  updateDistributionCenter: (updatedDistributionCenter) => set((state) => {
    const foundDistributionCenterIndex = state.distributionCenters.findIndex((distributionCenter) => distributionCenter.id === updatedDistributionCenter.id);
    const distributionCenters = [...state.distributionCenters];
    distributionCenters[foundDistributionCenterIndex] = {...distributionCenters[foundDistributionCenterIndex], ...updatedDistributionCenter};

    return {distributionCenters};
  }),
}));

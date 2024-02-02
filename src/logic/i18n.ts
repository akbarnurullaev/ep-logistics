import {create} from "zustand";

export type Languages =
    "en" | "cz"
type State = {
    language: Languages
    changeLanguage: (newLanguage: Languages) => void
}
type Translations = {
    dashboard: string
    settings: string
    staticData: string
    planning: string
    addNewOrder: string
    createNewProject: string
    fillInTheInformationOfTheProject: string
    clientName: string
    productType: string
    volume: string
    deliveryDate: string
    deliveryTime: string
    submit: string
    email: string
    password: string
    forgotYourPassword: string
    signIn: string
    id: string
    companyName: string
    goods: string
    location: string
    search: string
    registrationNumber: string
    maxLoad: string
    type: string
    availableTrucks: string
    delivery: string
    orderId: string
    orders: string
    name: string
    totalActiveOrders: string
    activeOrdersForNextDay: string
    activeVehiclesAvailable: string
    ordersAllocatedToDrivers: string
    unallocatedOrdersForNextDay: string
    totalKilometersPlannedForNextDay: string
    trucks: string
    clients: string
    distributionCentres: string
    distanceMatrix: string
    export: string
    import: string
    support: string
    ordersForTomorrow: string
    allOrders: string
    driverName: string
}

const useI18nStore = create<State>((set) => ({
  language: "en",
  changeLanguage: newLanguage => set({ language: newLanguage })
}));

export const useI18n = () => {
  const {language, changeLanguage} = useI18nStore();

  const translations = dictionary[language];

  const t = (key: keyof Translations) => {
    return translations[key];
  };

  return {t, changeLanguage};
};

const dictionary: Record<Languages, Translations> = {
  en: {
    dashboard: "Dashboard",
    settings: "Settings",
    planning: "Planning",
    staticData: "Static Data",
    addNewOrder: "Add new order",
    createNewProject: "Create new project",
    fillInTheInformationOfTheProject: "Fill in the information of the project.",
    clientName: "Client name",
    productType: "Product type",
    volume: "Volume",
    deliveryDate: "Delivery date",
    deliveryTime: "Delivery time (±1 hour)",
    submit: "Submit",
    email: "Email",
    password: "Password",
    forgotYourPassword: "Forgot your password?",
    signIn: "Sign in",
    id: "ID",
    companyName: "Company name",
    goods: "Goods",
    location: "Location",
    search: "Search",
    registrationNumber: "Registration Number",
    maxLoad: "Max Load",
    type: "Type",
    availableTrucks: "Available trucks",
    delivery: "Delivery",
    orderId: "Delivery",
    orders: "Orders",
    name: "Name",
    totalActiveOrders: "Total Active Orders",
    activeOrdersForNextDay: "Active Orders for Next Day",
    activeVehiclesAvailable: "Active Vehicles Available",
    ordersAllocatedToDrivers: "Orders Allocated to Drivers",
    unallocatedOrdersForNextDay: "Unallocated Orders for Next Day",
    totalKilometersPlannedForNextDay: "Total Kilometers Planned for Next Day",
    trucks: "Trucks",
    clients: "Clients",
    distributionCentres: "Distribution Centres",
    distanceMatrix: "Distance Matrix",
    export: "Export",
    import: "Import",
    support: "Support",
    ordersForTomorrow: "Next day orders",
    allOrders: "All orders",
    driverName: "Driver name",
  },
  cz: {
    dashboard: "Nástěnka",
    settings: "Nastavení",
    addNewOrder: "Přidat novou objednávku",
    createNewProject: "Vytvořit nový projekt",
    fillInTheInformationOfTheProject: "Vyplňte informace o projektu.",
    clientName: "Jméno klienta",
    productType: "Typ produktu",
    volume: "Objem",
    deliveryDate: "Datum dodání",
    deliveryTime: "Čas dodání (±1 hodina)",
    submit: "Odeslat",
    email: "Email",
    password: "Heslo",
    forgotYourPassword: "Zapomněli jste heslo?",
    signIn: "Přihlásit se",
    id: "ID",
    companyName: "Název společnosti",
    goods: "Zboží",
    location: "Lokace",
    search: "Hledat",
    registrationNumber: "Registrační číslo",
    maxLoad: "Max. zatížení",
    type: "Typ",
    availableTrucks: "Dostupné kamiony",
    delivery: "Dodání",
    orderId: "ID objednávky",
    orders: "Objednávky",
    name: "Jméno",
    totalActiveOrders: "Celkový počet aktivních objednávek",
    activeOrdersForNextDay: "Aktivní objednávky na příští den",
    activeVehiclesAvailable: "Dostupná vozidla",
    ordersAllocatedToDrivers: "Objednávky přidělené řidičům",
    unallocatedOrdersForNextDay: "Nealokované objednávky na příští den",
    totalKilometersPlannedForNextDay: "Celkový počet kilometrů plánovaných na příští den",
    staticData: "Statická data",
    planning: "Plánování",
    trucks: "Kamiony",
    clients: "Klienti",
    distributionCentres: "Distribuční centra",
    distanceMatrix: "Maticová vzdálenost",
    export: "Vývozní",
    import: "Import",
    support: "Podporovat",
    ordersForTomorrow: "Next day orders",
    allOrders: "All orders",
    driverName: "Driver name",
  }
};
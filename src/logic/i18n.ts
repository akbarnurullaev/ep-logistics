import {create} from "zustand";

export type Languages =
    "en" | "cz"
type State = {
    language: Languages
    changeLanguage: (newLanguage: Languages) => void
}
export type Translations = {
    dashboard: string
    settings: string
    staticData: string
    planning: string
    addNewOrder: string
    createNewOrder: string
    updateRequest: string
    approved: string
    createNewRequest: string
    updateOrder: string
    createNewTruck: string
    createNewClient: string
    updateClient: string
    delete: string
    createNewDistributionCenter: string
    updateDistributionCenter: string
    updateTruck: string
    fillInTheInformationOfTheOrder: string
    fillInTheInformationOfTheRequest: string
    fillInTheInformationOfTheTruck: string
    fillInTheInformationOfTheClient: string
    fillInTheInformationOfTheDistributionCenter: string
    clientName: string
    productType: string
    volume: string
    deliveryDate: string
    deliveryTime: string
    submit: string
    email: string
    password: string
    forgotYourPassword: string
    rememberMe: string
    signIn: string
    id: string
    companyName: string
    distance: string
    time: string
    goods: string
    location: string
    search: string
    registrationNumber: string
    reset: string
    automaticPlaning: string
    maxLoad: string
    types: string
    type: string
    availableTrucks: string
    delivery: string
    unloading: string
    loading: string
    travelToDC: string
    pricePerKm: string
    profit: string
    projectPrice: string
    projectExpenses: string
    tallPrice: string
    pricePerMinute: string
    orderId: string
    orders: string
    requests: string
    name: string
    totalActiveOrders: string
    activeOrdersForNextDay: string
    activeVehiclesAvailable: string
    ordersAllocatedToDrivers: string
    unallocatedOrdersForNextDay: string
    totalKilometersPlannedForNextDay: string
    trucks: string
    addData: string
    clients: string
    distributionCentres: string
    distanceMatrix: string
    export: string
    import: string
    support: string
    ordersForTomorrow: string
    allOrders: string
    driverName: string
    allocatedDepot: string
    lastSeen: string
    hours: string
    minutes: string
    download: string
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

  return {t, changeLanguage, language};
};

const dictionary: Record<Languages, Translations> = {
  en: {
    dashboard: "Dashboard",
    addData: "Add data",
    types: "Types",
    settings: "Settings",
    planning: "Planning",
    staticData: "Static Data",
    addNewOrder: "Add new order",
    createNewOrder: "Create new order",
    updateOrder: "Update order",
    createNewTruck: "Create new truck",
    updateTruck: "Update the truck",
    createNewClient: "Create new client",
    createNewDistributionCenter: "Create new distribution center",
    updateDistributionCenter: "Update the distribution center",
    fillInTheInformationOfTheOrder: "Fill in the information of the order.",
    fillInTheInformationOfTheTruck: "Fill in the information of the truck.",
    fillInTheInformationOfTheClient: "Fill in the information of the client.",
    fillInTheInformationOfTheDistributionCenter: "Fill in the information of the distribution center.",
    clientName: "Client name",
    productType: "Product",
    volume: "Volume",
    deliveryDate: "Delivery date",
    deliveryTime: "Delivery time (±1 hour)",
    submit: "Submit",
    email: "Email",
    password: "Password",
    forgotYourPassword: "Forgot your password?",
    rememberMe: "Remember me",
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
    download: "Download",
    import: "Import",
    support: "Support",
    ordersForTomorrow: "Next day orders",
    allOrders: "All orders",
    driverName: "Driver name",
    allocatedDepot: "Allocated depot",
    updateClient: "Update the client",
    delete: "Delete",
    lastSeen: "Last seen",
    distance: "Distance",
    time: "Time",
    hours: "hours",
    minutes: "minutes",
    reset: "Reset",
    automaticPlaning: "Automatic planning",
    unloading: "Unloading",
    loading: "Loading",
    travelToDC: "Travel to DC",
    pricePerKm: "Price per km",
    profit: "Profit",
    projectPrice: "Delivery price",
    projectExpenses: "Delivery expenses",
    tallPrice: "Tall price",
    pricePerMinute: "Price per minute",
    updateRequest: "Update request",
    approved: "Approved",
    createNewRequest: "Create new request",
    fillInTheInformationOfTheRequest: "Fill in the information of the request",
    requests: "Requests"
  },
  cz: {
    dashboard: "Dashboard",
    settings: "Nastavení",
    types: "Typy",
    addNewOrder: "Vytvořit objednávku",
    createNewOrder: "Vytvořit objednávku",
    createNewTruck: "Přidat kamion",
    createNewClient: "Přidat klienta",
    createNewDistributionCenter: "Přidat distribuční centrum",
    fillInTheInformationOfTheOrder: "Vyplňte informace o objednávce",
    fillInTheInformationOfTheTruck: "Vyplňte informace o kamionu",
    fillInTheInformationOfTheClient: "Vyplňte informace o klientovi",
    fillInTheInformationOfTheDistributionCenter: "Vyplňte informace o distribučním centru",
    clientName: "Název klienta",
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
    registrationNumber: "SPZ",
    maxLoad: "Maximální zatížení",
    type: "Typ",
    availableTrucks: "Dostupné kamiony",
    delivery: "Doručení",
    orderId: "ID objednávky",
    orders: "Objednávky",
    name: "Jméno",
    totalActiveOrders: "Celkový počet aktivních objednávek",
    activeOrdersForNextDay: "Aktivní objednávky na další den",
    activeVehiclesAvailable: "Dostupná vozidla",
    ordersAllocatedToDrivers: "Zaplanované objednávky",
    unallocatedOrdersForNextDay: "Nezaplanované objednávky na další den",
    totalKilometersPlannedForNextDay: "Celkový počet zaplánovaných kilometrů",
    staticData: "Statická data",
    planning: "Plánování",
    trucks: "Kamiony",
    clients: "Zákazníci",
    distributionCentres: "Distribuční centra",
    distanceMatrix: "Vzdálenostní matice",
    export: "Export",
    import: "Import",
    support: "Podpora",
    ordersForTomorrow: "Objednávky na zítřek",
    allOrders: "Všechny objednávky",
    driverName: "Jméno řidiče",
    allocatedDepot: "Přidělené depo",
    addData: "Přidat data",
    updateClient: "Aktualizovat zákazníka",
    delete: "Smazat",
    lastSeen: "Naposledy viděno",
    updateDistributionCenter: "Aktualizovat distribuční centrum",
    updateTruck: "Aktualizovat kamion",
    distance: "Vzdálenost",
    time: "Čas",
    hours: "hodin",
    minutes: "minut",
    rememberMe: "Zapamatuj si mě",
    download: "Stáhnout",
    updateOrder: "Aktualizovat objednávku",
    reset: "Zrušit plánování",
    automaticPlaning: "Automatické plánování",
    unloading: "Vykládka",
    loading: "Nakládka",
    travelToDC: "Cestování do DC",
    pricePerKm: "Cena za kilometr",
    profit: "Zisk",
    projectPrice: "Cena doručení",
    projectExpenses: "Náklady na doručení",
    tallPrice: "Vysoká cena",
    pricePerMinute: "Cena za minutu",
    "updateRequest": "Aktualizovat žádost",
    "approved": "Schváleno",
    "createNewRequest": "Vytvořit novou žádost",
    "fillInTheInformationOfTheRequest": "Vyplnit informace o žádosti",
    "requests": "Žádosti"
  }
};
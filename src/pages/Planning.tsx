import {Shift, Truck, useStaticDataStore} from "../logic/static-data.ts";
import Typography from "@mui/joy/Typography";
import {nextDayOrders, Order, useOrdersStore} from "../logic/orders.ts";
import {useDrag, useDrop} from "react-dnd";
import {Modal, ModalDialog, Snackbar, Tooltip, useTheme} from "@mui/joy";
import {useI18n} from "../logic/i18n.ts";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import Box from "@mui/joy/Box";
import {getRandomValue} from "../helpers/utils.ts";
import {
  GetRelevanceFromDragEvent,
  GetRelevanceFromResizeEvent,
  groupItemsToSubrows,
  ItemDefinition,
  Relevance,
  ResizeEndEvent,
  RowDefinition,
  Timeframe,
  TimelineContext,
  useItem,
  useRow,
  useTimelineContext
} from "dnd-timeline";
import {
  addDays,
  addHours,
  addMilliseconds,
  addMinutes,
  differenceInMilliseconds,
  format,
  hoursToMilliseconds,
  millisecondsToMinutes
} from "date-fns";
import {CustomDataGrid} from "../components/common/CustomDataGrid.tsx";
import {Button} from "@mui/material";
import {
  createContext,
  createRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from "react";
import {allOptions, CreateItem} from "../components/forms/CreateItem.tsx";
import TimeCursor from "../components/TimeCursor.tsx";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const options = [...allOptions, "Delivery"];
const groups = [{ id: 1, title: "group 1" }, { id: 2, title: "group 2" }];
const generateItem = ({newItems, option, shift, orderId, index}: {option: ArrayElement<typeof options>, newItems: ExtendedItemDefinition[], shift: Shift, orderId: string, index: number}, isBigOrder?: boolean) => {
  const lastItem = newItems[index - 1];

  const length = isBigOrder ?
    (option === "Loading" || option === "Unloading") ? 60 : option === "Delivery" ? getRandomInRange(420, 480) : getRandomInRange(60, 100) :
    (option === "Loading" || option === "Unloading") ? 60 : getRandomInRange(60, 120);

  const start = isBigOrder && index === 3 && option === "Delivery" ? addDays(shift.start, 1) :  addMinutes(new Date(lastItem ? lastItem.relevance.end : shift.start), 5);
  const end = isBigOrder && index === 3 && option === "Delivery" ? addMinutes(addDays(shift.start, 1), getRandomInRange(30, 120)) : (isBigOrder && option === "Delivery" && index !== 3) ? addMinutes(shift.end, -5) : addMinutes(new Date(start), length);

  return {
    id: index.toString(),
    relevance: {
      start,
      end
    },
    rowId: "0",
    title: option,
    orderId,
  };
};

export const pricePerKm = 8;
export const pricePerMinute = 20;
export const tallPrice = 20;

export const Planning = () => {
  const {t} = useI18n();
  const {trucks, setOrderToTruckDelivery, resetTruckDeliveries, updateTruck,} = useStaticDataStore();
  const {orders: allOrders, removeOrder, resetOrders} = useOrdersStore();

  const orders = nextDayOrders(allOrders);

  const plan = async () => {
    for (let i = 0; i < trucks.length; i++) {
      const truck = trucks[i];
      const isBigOrder = Math.random() < 0.5;

      if (!truck.items.length) {
        const {items, registrationNumber, shift} = truck;
        const newItems = [...items];

        // const hasSecondOrder = Math.random() < 0.5;
        const orderId1 = `ORD-${getRandomValue(0, 99999)}`;
        const orderId2 = `ORD-${getRandomValue(0, 99999)}`;
        // const options = [...allOptions, ...allOptions];
        const options = isBigOrder ? ["Travel to DC", "Loading", "Delivery", "Delivery", "Unloading"] : [...allOptions];

        for (let i = 0; i < options.length; i++) {
          const option = options[i];
          const isSecondOrder = i > 3;

          if (shift) {
            newItems.push(generateItem({option, newItems, shift, orderId: isSecondOrder ? orderId2 : orderId1, index: i}, isBigOrder));
          }
        }

        const getNewItem = (item: ExtendedItemDefinition) => {
          const distance = differenceInMilliseconds(item.relevance.end, item.relevance.start);
          return {...item, relevance: {start: addDays(shift.start, 1), end: addMilliseconds(addDays(shift.start, 1), distance)}};
        };
        const copiedNewItems = [];
        const e = newItems.map((item, index) => {
          if (item.relevance.end > shift.end) {
            const prevItem = copiedNewItems[index - 1];
            console.log(prevItem);
            if (prevItem) {
              const distance = differenceInMilliseconds(item.relevance.end, item.relevance.start);
              const newItem = {...item, relevance: {start: addMinutes(prevItem.relevance.end, 5), end: addMilliseconds(addMinutes(prevItem.relevance.end, 5), distance)}};

              copiedNewItems.push(newItem);
              return newItem;
            }

            copiedNewItems.push(getNewItem(item));
            return getNewItem(item);
            // if (prevItem.relevance.end < shift.end) {
            // }

            // const prevUpdatedItem = getNewItem(prevItem);
            //
            // const distance = differenceInMilliseconds(item.relevance.end, item.relevance.start);

            // if (newItems[index - 1].relevance.end > shift.end) {
            //   const prevItem = getNewItem(newItems[index - 1]);
            //   const distance = differenceInMilliseconds(item.relevance.end, item.relevance.start);
            //   return {...item, relevance: {start: addMinutes(prevItem.relevance.end, 5), end: addMilliseconds(addMinutes(prevItem.relevance.end, 5), distance)}};
            // }
          } else {
            copiedNewItems.push(undefined);
            return item;
          }
        });
        console.log(e);
        const hasSecondOrder = !(shift && (newItems[newItems.length - 1]?.relevance?.end > shift.end));
        const plannedItems = e;
        // const plannedItems = hasSecondOrder ? newItems : newItems.slice(0, 4);

        const itemsToPush = [];

        for (const item of plannedItems) {
          await sleep(100);

          itemsToPush.push(item);
          updateTruck({registrationNumber, items: itemsToPush});
        }

        if (i < orders.length) {
          removeOrder(orders[i]);
          if (hasSecondOrder) {
            removeOrder(orders[i]);
          }
        }
      }
    }

    // if (items.length >= 4) {
    //   return;
    // }
    // if (!shift) {
    //   return;
    // }
    //
    // const newItems = [...items];
    //
    // if (items.length === 0) {
    //   const start = new Date(new Date(shift?.start).setMinutes(shift?.start.getMinutes() + 5));
    //   const end = new Date(new Date(start).setMinutes(start.getMinutes() + getRandomInRange(30, 60)));
    //   newItems.push({
    //     id: "0",
    //     relevance: {start, end},
    //     rowId: "0",
    //     title: allOptions[0]
    //   });
    // } else {
    //   const previousItem = newItems[newItems.length - 1];
    //   const start = new Date(new Date(previousItem?.relevance.end).setMinutes(previousItem?.relevance.end.getMinutes() + 5));
    //   const end = new Date(new Date(start).setMinutes(start.getMinutes() + getRandomInRange(30, 60)));
    //   const id = `${Number(previousItem?.id) + 1}`;
    //   console.log(id);
    //   newItems.push({
    //     id,
    //     relevance: {start, end},
    //     rowId: "0",
    //     title: allOptions[newItems.length]
    //   });
    // }
    // await sleep(1000);
    // updateTruck({registrationNumber, items: newItems});
    // await planOrdersToTruck(truck);
  };
  // const plan = async () => {
  //   const copiedOrders = [...orders];
  //
  //   for (const truck of trucks) {
  //     const deliveriesCount = getRandomValue(1, 4);
  //
  //     for (let i = 1; i <= deliveriesCount; i++) {
  //       const order = copiedOrders.length ? copiedOrders[copiedOrders.length - 1] : null;
  //       if (order) {
  //         await sleep(1000);
  //         setOrderToTruckDelivery(truck, order, i as 1 | 2 | 3 | 4);
  //         removeOrder(order);
  //         copiedOrders.pop();
  //       }
  //     }
  //   }
  // };


  return (
    <>
      <Typography level="h3">{t("availableTrucks")}</Typography>
      {/*<Box sx={{ width: "100%", display: "flex", height: 500 }}>*/}
      {/*  <TimelinePlanning/>*/}
      {/*</Box>*/}
      <Box sx={{ maxHeight: 800 }}>
        <CustomDataGrid
          getRowId={({registrationNumber}) => registrationNumber}
          rows={trucks}
          getRowHeight={() => "auto"}
          addOn={<>
            <Button sx={{ mr: 2 }} variant="contained" onClick={plan}>{t("automaticPlaning")}</Button>
            <Button sx={{ mr: 2 }} variant="outlined" onClick={() => {
              resetOrders();
              resetTruckDeliveries();
            }}>{t("reset")}</Button>
            <Button variant="text">EXPORT TMS</Button>
          </>}
          columns={[
            {headerName: t("registrationNumber"), field: "registrationNumber", valueGetter: ({row}) => row.registrationNumber, width: 100},
            {headerName: t("maxLoad"), field: "maxLoad", valueGetter: ({row}) => row.maxLoad + " t.", width: 100},
            {headerName: t("type"), field: "type", valueGetter: ({row}) => row.types, width: 310},
            {headerName: t("driverName"), field: "driverName", valueGetter: ({row}) => row.driverName, width: 100},
            {headerName: t("allocatedDepot"), field: "allocatedDepot", valueGetter: ({row}) => row.allocatedDepot, width: 100},
            {headerName: t("lastSeen"), field: "location", valueGetter: ({row}) => row.location, width: 100},
            {headerName: t("delivery"), field: "delivery", renderCell: ({row}) => <TimelinePlanning truck={row} />, width: 1000},
            // {headerName: t("pricePerKm"), field: "pricePerKm", renderCell: () => pricePerKm + " Kč", width: 100},
            // {headerName: t("pricePerMinute"), field: "pricePerMin", renderCell: () => pricePerMinute + " Kč", width: 120},
            // {headerName: t("tallPrice"), field: "tallPrice", renderCell: () => tallPrice + " Kč", width: 80},
            {headerName: t("projectExpenses"), field: "projectExpenses", renderCell: ({row}) => row.projectExpenses + " Kč", width: 120},
            {headerName: t("projectPrice"), field: "projectPrice", renderCell: ({row}) => {
              if (row.items.length) {
                return <b>{row.projectPrice + " Kč"}</b>;
              }
              return 0 + " Kč";
            }, width: 120
            },
            {
              headerName: t("profit"),
              field: "profit",
              renderCell: ({row}) => {
                if (!row.items.length) {
                  return 0 + " Kč";
                }

                const profit = Number(row.projectPrice) - Number(row.projectExpenses);
                const isPositive = profit > 0;
                const backgroundColor = isPositive ? "#c6efcf" : "#ffc7cd";
                const color = isPositive ? "#006200" : "#9b0005";
                return (
                  <Box sx={{ backgroundColor, color, width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    {profit} Kč
                  </Box>
                );
              },
            },
            {headerName: "This week", field: "performanceThisWeek", valueGetter: ({row}) => row.performanceThisWeek + " Kč", width: 120},
            {headerName: "Previous week", field: "performancePreviousWeek", valueGetter: ({row}) => row.performancePreviousWeek + " Kč", width: 120},
            {
              headerName: "Tendency",
              field: "tendency",
              renderCell: ({row}) => {
                const profit = Number(row.performancePreviousWeek) - Number(row.performanceThisWeek);
                const isPositive = profit < 0;
                const backgroundColor = isPositive ? "#c6efcf" : "#ffc7cd";
                const color = isPositive ? "#006200" : "#9b0005";

                const differencePercentage = Math.round(Math.abs(profit)/(row.performancePreviousWeek/100));

                return (
                  <Box sx={{ backgroundColor, color, width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    {isPositive ? "+" : "-"}{differencePercentage}%
                  </Box>
                );
              },
              width: 120 // calcuate the percentage difference also add profit
            },
            // {headerName: "Total expenses", field: "totalExpenses", renderCell: totalExpenses, width: 80},
            // {headerName: `${t("delivery")} 1`, field: "delivery1", renderCell: ({row}) => <DeliveryRow truck={row} index={1}/>, flex: 1.5},
            // {headerName: `${t("delivery")} 2`, field: "delivery2", renderCell: ({row}) => <DeliveryRow truck={row} index={2}/>, flex: 1.5},
            // {headerName: `${t("delivery")} 3`, field: "delivery3", renderCell: ({row}) => <DeliveryRow truck={row} index={3}/>, flex: 1.5},
            // {headerName: `${t("delivery")} 4`, field: "delivery4", renderCell: ({row}) => <DeliveryRow truck={row} index={4}/>, flex: 1.5},
          ]}
        />
      </Box>

      <Typography mt={2} level="h3">{t("orders")}</Typography>
      <Box sx={{ maxHeight: 600 }}>
        <CustomDataGrid
          rows={orders}
          addOn={<Button variant="text">EXPORT TMS</Button>}
          columns={[
            {field: "id", headerName: t("id"), valueGetter: ({row}) => row.id, flex: 1, renderCell:({row}) => <OrderIdDnD row={row}/>},
            {field: "productType", headerName: t("productType"), valueGetter: ({row}) => row.productType, flex: 1},
            {field: "volume", headerName: t("volume"), valueGetter: ({row}) => row.volume, flex: 1},
            {field: "deliveryDate", headerName: t("deliveryDate"), valueGetter: ({row}) => row.deliveryDate, flex: 1},
            {field: "deliveryTime", headerName: t("deliveryTime"), valueGetter: ({row}) => row.deliveryTime, flex: 0.8},
            {field: "clientName", headerName: t("clientName"), valueGetter: ({row}) => row.clientName, flex: 1.2},
          ]}
        />
      </Box>
    </>
  );
};

const OrderIdDnD = ({row}: {row: Order}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "BOX",
    item: row,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    })
  }));

  return (
    <Box
      role="Handle"
      ref={drag}
      key={row.id}
      sx={{ display: "flex", alignItems: "center" }}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <DragIndicatorIcon sx={{mr: 1}}/>
      <Typography fontSize={14}>
        {row.id}
      </Typography>
    </Box>
  );
};

const DeliveryRow = ({truck, index}:{truck: Truck, index: 1|2|3|4}) => {
  const theme = useTheme();
  const {setOrderToTruckDelivery} = useStaticDataStore();
  const {removeOrder} = useOrdersStore();

  const [{isOver}, drop] = useDrop(() => ({
    accept: "BOX",
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    }),
    drop: (order: Order) => {
      setOrderToTruckDelivery(truck, order, index);
      removeOrder(order);
    },
  }));

  const deliveryOrderInfo = truck[`delivery${index}`];

  return (
    <Box
      ref={drop}
      role="Dustbin"
      style={{ background: isOver ? theme.palette.background.level3 : "" }}
      sx={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Typography
        fontSize={12}
        sx={{
          whiteSpace: "wrap",
          overflow: "hidden",
          textOverflow: "balance"
        }}
      >
        {deliveryOrderInfo}
      </Typography>
    </Box>
  );
};

const now = new Date().getTime();
const startOfDay = new Date(now - (now % 86400000));
const endDate = new Date(now - (now % 86400000) + 86400000);

const DEFAULT_TIMEFRAME: Timeframe = {
  start: startOfDay,
  end: endDate,
};

export const generateRows = (count: number, options) => {
  return Array(count)
    .fill(0)
    .map((): RowDefinition => {
      const disabled = options?.disabled;

      let id = `row-${Math.random()}`;
      if (disabled) id += " (disabled)";

      return {
        id,
        disabled,
      };
    });
};

function minutesToMilliseconds(minutes: number) {
  return minutes * 60000; // 1 minute = 60,000 milliseconds
}

const getRandomInRange = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

const DEFAULT_MIN_DURATION = minutesToMilliseconds(60);
const DEFAULT_MAX_DURATION = minutesToMilliseconds(360);

export const generateRandomRelevance = (
  timeframe: Timeframe,
  minDuration: number = DEFAULT_MIN_DURATION,
  maxDuration: number = DEFAULT_MAX_DURATION,
): Relevance => {
  const duration = getRandomInRange(minDuration, maxDuration);

  const start = getRandomInRange(
    timeframe.start.getTime(),
    timeframe.end.getTime() - duration,
  );

  const end = start + duration;

  return {
    start: new Date(start),
    end: new Date(end),
  };
};

interface GenerateItemsOptions {
  disabled?: boolean;
  background?: boolean;
  minDuration?: number;
  maxDuration?: number;
}

type ItemsContext = {
  items: ExtendedItemDefinition[];
  setItems: (items: ExtendedItemDefinition[]) => void;
  addItem: (item: ExtendedItemDefinition) => void;
  truck: Truck,
  shift: {
    start: Date,
    end: Date,
  }
}
export const itemsRef = createRef<ItemsContext>();
const ItemsTimelineContext = createContext<ItemsContext>({
  items: [],
  truck: {} as Truck,
  setItems: () => null,
  addItem: () => {
    // console.log(irme);
  },
  shift: {
    start: new Date(),
    end: new Date(),
  }
});

const timeAxisMarkers: MarkerDefinition[] = [
  {
    value: hoursToMilliseconds(24),
    getLabel: (date: Date) => format(date, "E"),
  },
  {
    value: hoursToMilliseconds(2),
    minTimeframeSize: hoursToMilliseconds(24),
    getLabel: (date: Date) => format(date, "k"),
  },
  {
    value: hoursToMilliseconds(1),
    minTimeframeSize: hoursToMilliseconds(24),
  },
  {
    value: hoursToMilliseconds(1),
    maxTimeframeSize: hoursToMilliseconds(24),
    getLabel: (date: Date) => format(date, "k"),
  },
  {
    value: minutesToMilliseconds(30),
    maxTimeframeSize: hoursToMilliseconds(24),
    minTimeframeSize: hoursToMilliseconds(12),
  },
  {
    value: minutesToMilliseconds(15),
    maxTimeframeSize: hoursToMilliseconds(12),
    getLabel: (date: Date) => format(date, "m"),
  },
  {
    value: minutesToMilliseconds(5),
    maxTimeframeSize: hoursToMilliseconds(6),
    minTimeframeSize: hoursToMilliseconds(3),
  },
  {
    value: minutesToMilliseconds(5),
    maxTimeframeSize: hoursToMilliseconds(3),
    getLabel: (date: Date) => format(date, "m"),
  },
  {
    value: minutesToMilliseconds(1),
    maxTimeframeSize: hoursToMilliseconds(2),
  },
];

export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export const useItemsTimelineContext = () => {
  return useContext(ItemsTimelineContext);
};
export type ExtendedItemDefinition = ItemDefinition & {title: ArrayElement<typeof allOptions>, orderId: string}
const TimelinePlanning = ({truck}: {truck: Truck}) => {
  const cursorStart = useRef(truck.cursorStart).current;
  const cursorEnd = useRef(truck.cursorEnd).current;
  const tomorrowCursorStart = addDays(cursorStart, 1);
  const tomorrowCursorEnd = addDays(cursorEnd, 1);

  const [open, setOpen] = useState(false);
  const [timeframe, setTimeframe] = useState({
    start: addHours(cursorStart, -2.3),
    end: addHours(cursorEnd, 2.3),
  });
  const [items, setLocalItems] = useState<ExtendedItemDefinition[]>([]);
  const {updateTruck} = useStaticDataStore();

  const setItems = (items: ExtendedItemDefinition[]) => {
    setLocalItems(items);
    updateTruck({registrationNumber: truck.registrationNumber, items});
  };

  useEffect(() => {
    // if (truck.items.length === 4) {
    // setLocalItems([...truck.items]);
    // } else {
    //   setItems(truck.items, true);
    // }
    if (truck.items.length !== items.length) {
      setLocalItems([...truck.items]);
    }
  }, [truck]);

  const isOutOfTimeline = (date: Date) => {
    return (date > cursorEnd && date < tomorrowCursorStart) || date > tomorrowCursorEnd || date < cursorStart;
  };

  const onResizeEnd = useCallback(
    (event: ResizeEndEvent) => {
      const getRelevanceFromResizeEvent = event.active.data.current
        ?.getRelevanceFromResizeEvent as GetRelevanceFromResizeEvent;

      const updatedRelevance = getRelevanceFromResizeEvent(event);

      if (!updatedRelevance) return;

      const activeItemId = event.active.id;

      setItems((() => {
        const prevItemsWithoutTheActive = items.filter(item => item.id !== activeItemId);
        for (const {relevance} of prevItemsWithoutTheActive) {
          if (
            updatedRelevance.start > relevance.start && updatedRelevance.end < relevance.end ||
              relevance.end > updatedRelevance.start && relevance.end < updatedRelevance.end ||
              relevance.start > updatedRelevance.start && relevance.start < updatedRelevance.end
          ) {
            return items;
          }
        }

        if (isOutOfTimeline(updatedRelevance.start) || isOutOfTimeline(updatedRelevance.end)) {
          return items;
        }

        return items.map((item) => {
          if (item.id !== activeItemId) return item;
          return {
            ...item,
            relevance: updatedRelevance,
          };
        });
      })());
    },
    [setItems],
  );
  const onDragEnd = useCallback(
    (event) => {
      const activeRowId = event.over?.id as string;

      const getRelevanceFromDragEvent = event.active.data.current
        ?.getRelevanceFromDragEvent as GetRelevanceFromDragEvent;

      const updatedRelevance = getRelevanceFromDragEvent(event);
      if (!updatedRelevance || !activeRowId) return;

      const activeItemId = event.active.id;

      setItems((() => {
        const prevItemsWithoutTheActive = items.filter(item => item.id !== activeItemId);
        for (const {relevance} of prevItemsWithoutTheActive) {
          if (
            updatedRelevance.start > relevance.start && updatedRelevance.end < relevance.end ||
              relevance.end > updatedRelevance.start && relevance.end < updatedRelevance.end ||
              relevance.start > updatedRelevance.start && relevance.start < updatedRelevance.end
          ) {
            return items;
          }
        }

        // if (updatedRelevance.start < cursorStart || updatedRelevance.end > cursorEnd) {
        //   return items;
        // }
        if (isOutOfTimeline(updatedRelevance.start) || isOutOfTimeline(updatedRelevance.end)) {
          return items;
        }

        return items.map((item) => {
          if (item.id !== activeItemId) return item;
          return {
            ...item,
            rowId: activeRowId,
            relevance: updatedRelevance,
          };
        });
      })());
    },
    [setItems],
  );

  const addItem = (item: ExtendedItemDefinition) => {
    setItems([...items, item]);
  };

  const showItemForm = () => {
    setOpen(true);
  };

  const value = {
    items,
    setItems,
    addItem,
    truck,
    shift: {
      start: cursorStart,
      end: cursorEnd,
      tomorrowStart: tomorrowCursorStart,
      tomorrowEnd: tomorrowCursorEnd,
    }
  };

  useImperativeHandle(itemsRef, () => value, [items]);

  useEffect(() => {
    updateTruck({
      registrationNumber: truck.registrationNumber,
      shift: {
        start: cursorStart,
        end: cursorEnd,
      }
    });
  }, []);
  useEffect(() => {
    const projectExpenses = items.reduce(
      (accumulator, currentValueValue) => {
        const timeLength = millisecondsToMinutes(currentValueValue.relevance.end.getTime() - currentValueValue.relevance.start.getTime());

        if (currentValueValue.title === "Travel to DC") {
          const cost = timeLength * 30;
          return accumulator + cost;
        }
        if (currentValueValue.title === "Loading" || currentValueValue.title === "Unloading") {
          const cost = timeLength * 5;
          return accumulator + cost;
        }
        if (currentValueValue.title === "Delivery") {
          const cost = timeLength * 20;
          return accumulator + cost;
        }
        return accumulator;
      },
      0
    );
    updateTruck({projectExpenses, registrationNumber: truck.registrationNumber});
  }, [items]);

  return (
    <ItemsTimelineContext.Provider value={value}>
      <TimelineContext
        onDragEnd={onDragEnd}
        onResizeEnd={onResizeEnd}
        onTimeframeChanged={setTimeframe}
        timeframe={timeframe}
      >
        <Timeline />
        {/*<Button sx={{ml: 2}} onClick={showItemForm}>Add</Button>*/}

        <Modal sx={{
          zIndex: 99990,
        }} open={open} onClose={() => {
          setOpen(false);
        }}>
          <ModalDialog sx={{width: 500}}>
            <CreateItem close={() => setOpen(false)} />
          </ModalDialog>
        </Modal>
      </TimelineContext>
    </ItemsTimelineContext.Provider>
  );
};

function Timeline() {
  const { setTimelineRef, style, timeframe } = useTimelineContext();
  const {shift, truck, items} = useItemsTimelineContext();
  const {updateTruck} = useStaticDataStore();
  const {removeOrder} = useOrdersStore();
  const hasItems = useRef(false);
  const itemsRef = useRef<ExtendedItemDefinition[]>([]);
  const [open, setOpen] = useState(false);

  const [{isOver}, drop] = useDrop(() => ({
    accept: "BOX",
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    }),
    drop: async (order: Order) => {
      if (!hasItems.current) {

        const newItems: ExtendedItemDefinition[] = [];

        for (let i = 0; i < allOptions.length; i++) {
          const option = allOptions[i];

          if (shift) {
            newItems.push(generateItem({option, newItems, shift, orderId: order.id, index: i}));
          }
        }

        hasItems.current = true;
        itemsRef.current = newItems;

        updateTruck({registrationNumber: truck.registrationNumber, items: newItems});
        removeOrder(order);
        setOpen(true);
      } else {
        const lastItem = itemsRef.current[itemsRef.current.length - 1];

        const newItems: ExtendedItemDefinition[] = [];

        for (let i = 0; i < allOptions.length; i++) {
          const option = allOptions[i];

          if (shift) {
            newItems.push(generateItem({option, newItems: newItems, shift: {start: lastItem.relevance.end, end: shift.end}, orderId: order.id, index: i}));
          }
        }

        const hasSecondOrder = !(shift && (newItems[newItems.length - 1]?.relevance?.end > shift.end));

        if (hasSecondOrder) {
          updateTruck({registrationNumber: truck.registrationNumber, items: [...itemsRef.current, ...newItems.map((item) => ({...item, id: `${item.id + 9}`}))]});
          removeOrder(order);
          setOpen(true);
        }
      }
    },
  }));
  // TODO: minutes instead of hours

  const groupedSubrows = useMemo(
    () => groupItemsToSubrows(items, timeframe),
    [items, timeframe],
  );

  return (
    <Box
      ref={drop}
      role="Dustbin"
      style={{ opacity: isOver ? 0.3 : 1 }}
      sx={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div ref={setTimelineRef} style={{...style, width: "100%"}}>
        <TimeAxis markers={timeAxisMarkers}/>
        <TimeCursor position={shift.start} />
        <TimeCursor position={shift.end} />
        <TimeCursor position={addDays(shift.start, 1)} />
        <TimeCursor position={addDays(shift.end, 1)} />

        <Row id="0" sidebar={<></>}>
          {groupedSubrows[0]?.map((subrow, index) => (
            <Subrow key={index}>
              {subrow.map((item) => (
                <Item key={item.id} item={item}/>
              ))}
            </Subrow>
          ))}
        </Row>
      </div>

      <Snackbar
        variant="soft"
        color="success"
        open={open}
        autoHideDuration={2000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        Your message was sent successfully.
      </Snackbar>
    </Box>
  );
}

interface SidebarProps {
  row: RowDefinition;
}

function Sidebar(props: SidebarProps) {
  return (
    <div
      style={{ width: 200, border: "1px solid grey" }}
    >{`Row ${props.row.id}`}</div>
  );
}

interface RowProps extends RowDefinition {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}

function Row(props: RowProps) {
  const {
    setNodeRef,
    setSidebarRef,
    rowWrapperStyle,
    rowStyle,
    rowSidebarStyle,
  } = useRow({ id: props.id });

  return (
    <div style={{ ...rowWrapperStyle, minHeight: 50 }}>
      <div ref={setSidebarRef} style={rowSidebarStyle}>
        {props.sidebar}
      </div>
      <div ref={setNodeRef} style={{ ...rowStyle, border: "1px solid grey", borderRadius: 8, boxShadow: "inset 0px 0px 4px rgba(0,0,0,0.2)"
      }}>
        {props.children}
      </div>
    </div>
  );
}

interface ItemProps {
  item: ExtendedItemDefinition
}

function Item({item}: ItemProps) {
  // const { pixelsToMilliseconds} = useTimelineContext();
  const {t} = useI18n();
  const { setNodeRef, attributes, listeners, itemStyle, itemContentStyle } =
    useItem({
      id: item.id,
      relevance: item.relevance,
    });

  const backgroundColor = item.title === "Delivery" ? "#c5e0b4" : ["Loading", "Unloading"].includes(item.title) ? "#ffbf00" : "grey";
  const text: Record<ArrayElement<typeof allOptions>, string> = {
    "Travel to DC": t("travelToDC"),
    "Loading": t("loading"),
    "Delivery": t("delivery"),
    "Unloading": t("unloading"),
  };
  const abbreviations: Record<ArrayElement<typeof allOptions>, string> = {
    "Travel to DC": "TDC",
    "Loading": "LOAD",
    "Delivery": "TTC",
    "Unloading": "UNLD",
  };
  const tooltipTitle = `${text[item.title]} - ${item.orderId}`;

  //Travel to Distribution Centre (TDC)
  // Loading (LOAD)
  // Travel to Client (TTC)
  // Unloading (UNLD)
  // const minutes = millisecondsToMinutes(pixelsToMilliseconds(itemStyle.width as number));
  // const timeLength = `${Math.floor(minutes/60)} hours, ${minutes%60} minutes`;

  return (
    <Tooltip title={tooltipTitle} variant="outlined">
      <div ref={setNodeRef} style={itemStyle} {...listeners} {...attributes}>
        <div style={itemContentStyle}>
          <div
            style={{
              border: "1px solid white",
              width: "100%",
              overflow: "hidden",
              backgroundColor,
              padding: "4px",
              borderRadius: 4
            }}
          >
            <p style={{ fontSize: 12, margin: 0 }}>{abbreviations[item.title]}</p>
          </div>
        </div>
      </div>
    </Tooltip>
  );
}

interface SubrowProps {
  children: React.ReactNode;
}

function Subrow(props: SubrowProps) {
  return (
    <div style={{ height: 50, position: "relative" }}>{props.children}</div>
  );
}


interface Marker {
  label?: string;
  sideDelta: number;
  heightMultiplier: number;
}

export interface MarkerDefinition {
  value: number;
  maxTimeframeSize?: number;
  minTimeframeSize?: number;
  getLabel?: (time: Date) => string;
}

interface TimeAxisProps {
  markers: MarkerDefinition[];
}

function TimeAxis(props: TimeAxisProps) {
  const { timeframe, timelineDirection, sidebarWidth, millisecondsToPixels } =
    useTimelineContext();

  const side = timelineDirection === "rtl" ? "right" : "left";

  const markers = useMemo(() => {
    const sortedMarkers = [...props.markers];
    sortedMarkers.sort((a, b) => b.value - a.value);

    const delta = sortedMarkers[sortedMarkers.length - 1].value;

    const timeframeSize = timeframe.end.getTime() - timeframe.start.getTime();

    const startTime = Math.floor(timeframe.start.getTime() / delta) * delta;

    const endTime = timeframe.end.getTime();
    const timezoneOffset = minutesToMilliseconds(
      new Date().getTimezoneOffset(),
    );

    const markerSideDeltas: Marker[] = [];

    for (let time = startTime; time <= endTime; time += delta) {
      const multiplierIndex = sortedMarkers.findIndex(
        (marker) =>
          (time - timezoneOffset) % marker.value === 0 &&
          (!marker.maxTimeframeSize ||
            timeframeSize <= marker.maxTimeframeSize) &&
          (!marker.minTimeframeSize ||
            timeframeSize >= marker.minTimeframeSize),
      );

      if (multiplierIndex === -1) continue;

      const multiplier = sortedMarkers[multiplierIndex];

      const label = multiplier.getLabel?.(new Date(time));

      markerSideDeltas.push({
        label,
        heightMultiplier: 1 / (multiplierIndex + 1),
        sideDelta: millisecondsToPixels(time - timeframe.start.getTime()),
      });
    }

    return markerSideDeltas;
  }, [timeframe, millisecondsToPixels, props.markers]);

  return (
    <div
      style={{
        height: "20px",
        position: "relative",
        overflow: "hidden",
        [side === "right" ? "marginRight" : "marginLeft"]: `${sidebarWidth}px`,
      }}
    >
      {markers.map((marker, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            bottom: 0,
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "flex-end",
            height: "100%",
            [side]: `${marker.sideDelta}px`,
          }}
        >
          <div
            style={{
              width: "1px",
              height: `${100 * marker.heightMultiplier}%`,
            }}
          />
          {marker.label ? (
            <div
              style={{
                paddingLeft: "3px",
                alignSelf: "flex-start",
                fontWeight: marker.heightMultiplier * 1000,
              }}
            >
              {marker.label}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

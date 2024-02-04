import {companies} from "../logic/data.ts";
import {getRandomValue} from "../helpers/utils.ts";
import {CustomDataGrid} from "../components/common/CustomDataGrid.tsx";
import {useI18n} from "../logic/i18n.ts";

export const distanceMatrix = companies.map((company) => {
  const distance = getRandomValue(132, 954);
  return {
    id: company.name,
    name: company.name,
    time: `${Math.round(distance/70)} hours - ${Math.round(((distance % 70) / 70) * 60)} minutes`,
    distance: `${distance} km`,
  };
});

export const DistanceMatrix = () => {
  const {t} = useI18n();
  return (
    <div>
      <CustomDataGrid
        rows={distanceMatrix}
        columns={[
          {headerName: t("companyName"), field: "companyName", valueGetter: ({row}) => row.name, flex: 1},
          {headerName: t("distance"), field: "distance", valueGetter: ({row}) => row.distance, flex: 1},
          {headerName: t("time"), field: "time", valueGetter: ({row}) => row.time, flex: 1},
        ]}
      />
    </div>
  );
};
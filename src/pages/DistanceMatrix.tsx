import {CustomDataGrid} from "../components/common/CustomDataGrid.tsx";
import {useI18n} from "../logic/i18n.ts";
import {useDistanceMatrixStore} from "../logic/distance-matrix.ts";

export const DistanceMatrix = () => {
  const {t} = useI18n();
  const {distanceMatrix} = useDistanceMatrixStore();

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
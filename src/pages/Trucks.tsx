import {useStaticDataStore} from "../logic/static-data.ts";
import {DataGrid} from "../components/common/DataGrid.tsx";
import {useI18n} from "../logic/i18n.ts";

export const Trucks = () => {
  const {t} = useI18n();
  const {trucks} = useStaticDataStore();

  return (
    <DataGrid
      searchTitle={t("search")}
      data={trucks}
      columns={[
        {title: t("registrationNumber"), valueGetter: (column) => column.registrationNumber},
        {title: t("maxLoad"), valueGetter: (column) => column.maxLoad},
        {title: t("type"), valueGetter: (column) => column.types},
        {title: t("driverName"), valueGetter: (column) => column.driverName},
      ]}
    />
  );
};
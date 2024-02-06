/* eslint @typescript-eslint/no-unused-vars: 0 */
import {useStaticDataStore} from "../logic/static-data.ts";
import {useI18n} from "../logic/i18n.ts";
import {CustomDataGrid} from "../components/common/CustomDataGrid.tsx";
import {useCrudForms} from "../logic/crud-forms.ts";

export const Trucks = () => {
  const {t} = useI18n();
  const {trucks} = useStaticDataStore();
  const {setFormType, setSelectedData} = useCrudForms();

  return (
    <CustomDataGrid
      getRowId={({registrationNumber}) => registrationNumber}
      rows={trucks.map(({ delivery1, delivery2, delivery3, delivery4, ...truck}) => truck)}
      onRowClick={({row: truck}) => {
        setFormType("truck");
        setSelectedData(truck);
      }}
      columns={[
        {headerName: t("registrationNumber"), field: "registrationNumber", valueGetter: ({row}) => row.registrationNumber, flex: 1},
        {headerName: t("maxLoad"), field: "maxLoad", valueGetter: ({row}) => row.maxLoad, flex: 1},
        {headerName: t("type"), field: "type", valueGetter: ({row}) => row.types, flex: 1},
        {headerName: t("driverName"), field: "driverName", valueGetter: ({row}) => row.driverName, flex: 1},
        {headerName: t("allocatedDepot"), field: "allocatedDepot", valueGetter: ({row}) => row.allocatedDepot, flex: 1},
        {headerName: t("lastSeen"), field: "location", valueGetter: ({row}) => row.location, flex: 1},
      ]}
    />
  );
};
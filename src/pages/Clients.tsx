import {useStaticDataStore} from "../logic/static-data.ts";
import {useI18n} from "../logic/i18n.ts";
import {CustomDataGrid} from "../components/common/CustomDataGrid.tsx";
import {useCrudForms} from "../logic/crud-forms.ts";

export const Clients = () => {
  const {t} = useI18n();
  const { clients} = useStaticDataStore();
  const {setFormType, setSelectedData} =useCrudForms();

  return (
    <CustomDataGrid
      rows={clients}
      onRowClick={({row: client}) => {
        setFormType("client");
        setSelectedData(client);
      }}
      columns={[
        {headerName: t("id"), field: "id", valueGetter: ({row}) => row.id, flex: 1},
        {headerName: t("companyName"), field: "companyName", valueGetter: ({row}) => row.companyName, flex: 1},
        {headerName: t("goods"), field: "goods", valueGetter: ({row}) => row.goods, flex: 1},
        {headerName: t("location"), field: "location", valueGetter: ({row}) => row.location, flex: 1},
      ]}
    />
  );
};
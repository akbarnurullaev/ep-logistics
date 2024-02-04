import {useStaticDataStore} from "../logic/static-data.ts";
import {useI18n} from "../logic/i18n.ts";
import {CustomDataGrid} from "../components/common/CustomDataGrid.tsx";
import {useCrudForms} from "../logic/crud-forms.ts";

export const DistributionCentres = () => {
  const {t} = useI18n();
  const { distributionCenters} = useStaticDataStore();
  const {setFormType, setSelectedData} = useCrudForms();

  return (
    <CustomDataGrid
      rows={distributionCenters}
      onRowClick={({row: distributionCenter}) => {
        setFormType("distributionCenter");
        setSelectedData(distributionCenter);
      }}
      columns={[
        {headerName: t("id"), field: "id", valueGetter: ({row}) => row.id, flex: 1},
        {headerName: t("name"), field: "name", valueGetter: ({row}) => row.name, flex: 1},
        {headerName: t("goods"), field: "goods", valueGetter: ({row}) => row.goods, flex: 1},
        {headerName: t("location"), field: "location", valueGetter: ({row}) => row.location, flex: 1},
      ]}
    />);
};
import {useStaticDataStore} from "../logic/static-data.ts";
import {DataGrid} from "../components/common/DataGrid.tsx";
import {useI18n} from "../logic/i18n.ts";

export const DistributionCentres = () => {
  const {t} = useI18n();
  const { distributionCenters} = useStaticDataStore();

  return (
    <DataGrid
      searchTitle="Search"
      data={distributionCenters}
      columns={[
        {title: t("id"), valueGetter: (column) => column.id},
        {title: t("name"), valueGetter: (column) => column.name},
        {title: t("goods"), valueGetter: (column) => column.goods},
        {title: t("location"), valueGetter: (column) => column.location},
      ]}
    />);
};
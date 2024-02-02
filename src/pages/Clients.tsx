import {useStaticDataStore} from "../logic/static-data.ts";
import {DataGrid} from "../components/common/DataGrid.tsx";
import {useI18n} from "../logic/i18n.ts";

export const Clients = () => {
  const {t} = useI18n();
  const { clients} = useStaticDataStore();

  return (
    <DataGrid
      data={clients}
      columns={[
        {title: t("id"), valueGetter: (column) => column.id},
        {title: t("companyName"), valueGetter: (column) => column.companyName as string},
        {title: t("goods"), valueGetter: (column) => column.goods},
        {title: t("location"), valueGetter: (column) => column.location},
      ]}
      searchTitle={t("search")}/>
  );
};
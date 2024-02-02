import {Typography} from "@mui/joy";
import Table from "@mui/joy/Table";
import Box from "@mui/joy/Box";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/joy/Button";
import Sheet from "@mui/joy/Sheet";
import {ReactNode, useState} from "react";
import {useI18n} from "../../logic/i18n.ts";

type Props<T extends object> = {
    data: T[]
    columns: {title: string, valueGetter: (t: T) => string | undefined | number}[]
    searchTitle: string
    addOn?: ReactNode
}

export const DataGrid = <T extends object,>({data, columns, searchTitle, addOn}: Props<T>) => {
  const {t} = useI18n();
  const [search, setSearch] = useState("");

  const fullTextSearch = <T extends object,>(object: T, criteria: string, caseSensitive?: boolean) => {
    return Object.keys(object).map((key) => {
      const value = String((object as never)[key]);
      return (caseSensitive ? value : value.toLowerCase()).includes(caseSensitive ? criteria : criteria.toLowerCase());
    }).some(Boolean);
  };

  const rows = data.filter((datum) => {
    return fullTextSearch(datum, search);
  });

  return (
    <>
      <Box
        className="SearchAndFilters-tabletUp"
        sx={{
          borderRadius: "sm",
          pb: 2,
          display: {xs: "none", sm: "flex"},
          flexWrap: "wrap",
          gap: 1.5,
          "& > *": {
            minWidth: {xs: "120px", md: "160px"},
          },
          alignItems: "flex-end"
        }}
      >
        <FormControl sx={{flex: 1}} size="sm">
          <FormLabel>{searchTitle}</FormLabel>
          <Input size="sm" placeholder={t("search")} startDecorator={<SearchIcon/>} onChange={(e) => {
            setSearch(e.target.value);
          }}/>
        </FormControl>

        <a href="../assets/logo.png" download >
          <Button sx={{width: "100%"}} variant="plain" size="sm">{t("export")}</Button>
        </a>

        <a href="../assets/logo.png" download >
          <Button sx={{width: "100%"}} variant="plain" size="sm">{t("import")}</Button>
        </a>

        {addOn}
      </Box>
      <Sheet
        className="OrderTableContainer"
        variant="outlined"
        sx={{
          display: { xs: "none", sm: "initial" },
          width: "100%",
          borderRadius: "sm",
          flexShrink: 1,
          overflow: "auto",
          minHeight: 0,
        }}
      >
        <Table
          aria-labelledby="tableTitle"
          stickyHeader
          hoverRow
          sx={{
            "--TableCell-headBackground": "var(--joy-palette-background-level1)",
            "--Table-headerUnderlineThickness": "1px",
            "--TableRow-hoverBackground": "var(--joy-palette-background-level1)",
            "--TableCell-paddingY": "4px",
            "--TableCell-paddingX": "8px",
          }}
        >
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.title} style={{ padding: "12px 6px" }}>{column.title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                {columns.map((column) => (
                  <td key={column.title}>
                    <Typography level="body-xs">{column.valueGetter(row)}</Typography>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </Sheet></>
  );
};
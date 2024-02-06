import {DataGrid, GridToolbarQuickFilter, GridValidRowModel} from "@mui/x-data-grid";
import React, {ReactNode, useState} from "react";
import {useI18n} from "../../logic/i18n.ts";
import * as XLSX from "xlsx";
import {saveAs} from "file-saver";
import exportFromJSON from "export-from-json";
import Box from "@mui/joy/Box";
import {Button, Menu, MenuItem} from "@mui/material";
import {FileDownloadOutlined, PublishOutlined} from "@mui/icons-material";
import {ReactSpreadsheetImport} from "react-spreadsheet-import";
import {Fields, Result} from "react-spreadsheet-import/types/types";
import {DataGridProps} from "@mui/x-data-grid/models/props/DataGridProps";

type Props<T extends GridValidRowModel, R extends string> = {
  addOn?: ReactNode,
  importManagement?: {
    fields: Fields<R>
    onImport: (data: Result<R>, file: File) => void
  }
} & Omit<DataGridProps<T>, "slots">

export const CustomDataGrid = <T extends GridValidRowModel, R extends string>({importManagement, addOn, rows, ...dataGridProps}: Props<T, R>) => {
  const {t} = useI18n();
  const [importFromExcel, setImportFromExcel]= useState(false);

  const CustomToolbar = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    const exportToExcel = () => {
      const worksheet = XLSX.utils.json_to_sheet(rows as never[]);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" });

      saveAs(blob, "download.xlsx");

      handleClose();
    };

    const exportToCSV = () => {
      const fileName = "download";
      const exportType =  exportFromJSON.types.csv;

      exportFromJSON(
        {
          data: rows,
          fileName,
          exportType
        });
      handleClose();
    };


    return (
      <Box sx={{ display:"flex", flexDirection: "row", justifyContent: "space-between", px: 1, pt: 2 }}>
        <GridToolbarQuickFilter />
        <Box>
          {addOn}

          <Button startIcon={<FileDownloadOutlined/>} sx={{ ml: 2 }} onClick={handleClick} variant="text">
            {t("download")}
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem onClick={exportToExcel}>Excel</MenuItem>
            <MenuItem onClick={exportToCSV}>CSV</MenuItem>
          </Menu>

          {importManagement && (
            <Button
              startIcon={<PublishOutlined/>}
              sx={{ml: 2}}
              onClick={() => setImportFromExcel(!importFromExcel)}
              variant="text">
              {t("import")}
            </Button>
          )}
        </Box>
      </Box>
    );
  };


  return (
    <>
      {importManagement && (
        <ReactSpreadsheetImport
          isOpen={importFromExcel}
          fields={importManagement.fields}
          onClose={() => setImportFromExcel(false)}
          onSubmit={importManagement.onImport}
          customTheme={{
            colors: {
              rsi: {
                50: "#f6e7ea",
                100: "#eccfd6",
                200: "#e3b6c1",
                300: "#da9eac",
                400: "#d18698",
                500: "#c76e83",
                600: "#be566e",
                700: "#b53d59",
                800: "#ab2545",
                900: "#a20d30",
              }
            }
          }}
        />
      )}

      <DataGrid
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
        rowSelection={false}
        slots={{ toolbar: CustomToolbar }}
        rows={rows}
        {...dataGridProps}
      />
    </>
  );
};
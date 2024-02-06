import {DataGrid, GridToolbarQuickFilter, GridValidRowModel} from "@mui/x-data-grid";
import React, {ReactNode, useState} from "react";
import {Languages, useI18n} from "../../logic/i18n.ts";
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
  const {t, language} = useI18n();
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
          translations={getTranslations(language)}
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


const getTranslations = (language: Languages) => {
  return language === "en" ?  {
    uploadStep: {
      title: "Upload file",
      manifestTitle: "Data that we expect:",
      manifestDescription: "(You will have a chance to rename or remove columns in next steps)",
      maxRecordsExceeded: (maxRecords: number) => `Too many records. Up to ${maxRecords} allowed`,
      dropzone: {
        title: "Upload .xlsx, .xls or .csv file",
        errorToastDescription: "upload rejected",
        activeDropzoneTitle: "Drop file here...",
        buttonTitle: "Select file",
        loadingTitle: "Processing...",
      },
      selectSheet: {
        title: "Select the sheet to use",
        nextButtonTitle: "Next",
        backButtonTitle: "Back",
      },
    },
    selectHeaderStep: {
      title: "Select header row",
      nextButtonTitle: "Next",
      backButtonTitle: "Back",
    },
    matchColumnsStep: {
      title: "Match Columns",
      nextButtonTitle: "Next",
      backButtonTitle: "Back",
      userTableTitle: "Your table",
      templateTitle: "Will become",
      selectPlaceholder: "Select column...",
      ignoredColumnText: "Column ignored",
      subSelectPlaceholder: "Select...",
      matchDropdownTitle: "Match",
      unmatched: "Unmatched",
      duplicateColumnWarningTitle: "Another column unselected",
      duplicateColumnWarningDescription: "Columns cannot duplicate",
    },
    validationStep: {
      title: "Validate data",
      nextButtonTitle: "Confirm",
      backButtonTitle: "Back",
      noRowsMessage: "No data found",
      noRowsMessageWhenFiltered: "No data containing errors",
      discardButtonTitle: "Discard selected rows",
      filterSwitchTitle: "Show only rows with errors",
    },
    alerts: {
      confirmClose: {
        headerTitle: "Exit import flow",
        bodyText: "Are you sure? Your current information will not be saved.",
        cancelButtonTitle: "Cancel",
        exitButtonTitle: "Exit flow",
      },
      submitIncomplete: {
        headerTitle: "Errors detected",
        bodyText: "There are still some rows that contain errors. Rows with errors will be ignored when submitting.",
        bodyTextSubmitForbidden: "There are still some rows containing errors.",
        cancelButtonTitle: "Cancel",
        finishButtonTitle: "Submit",
      },
      submitError: {
        title: "Error",
        defaultMessage: "An error occurred while submitting data",
      },
      unmatchedRequiredFields: {
        headerTitle: "Not all columns matched",
        bodyText: "There are required columns that are not matched or ignored. Do you want to continue?",
        listTitle: "Columns not matched:",
        cancelButtonTitle: "Cancel",
        continueButtonTitle: "Continue",
      },
      toast: {
        error: "Error",
      },
    },
  } : {
    uploadStep: {
      title: "Nahrát soubor",
      manifestTitle: "Data, která očekáváme:",
      manifestDescription: "(Máte možnost přejmenovat nebo odebrat sloupce v dalších krocích)",
      maxRecordsExceeded: (maxRecords: number) => `Příliš mnoho záznamů. Až ${maxRecords} je povoleno.`,
      dropzone: {
        title: "Nahrát soubor .xlsx, .xls nebo .csv",
        errorToastDescription: "Nahrávání zamítnuto",
        activeDropzoneTitle: "Sem přetáhněte soubor...",
        buttonTitle: "Vybrat soubor",
        loadingTitle: "Zpracování...",
      },
      selectSheet: {
        title: "Vyberte list k použití",
        nextButtonTitle: "Další",
        backButtonTitle: "Zpět",
      },
    },
    selectHeaderStep: {
      title: "Vyberte řádek s hlavičkou",
      nextButtonTitle: "Další",
      backButtonTitle: "Zpět",
    },
    matchColumnsStep: {
      title: "Srovnat sloupce",
      nextButtonTitle: "Další",
      backButtonTitle: "Zpět",
      userTableTitle: "Vaše tabulka",
      templateTitle: "Stane se",
      selectPlaceholder: "Vyberte sloupec...",
      ignoredColumnText: "Sloupec ignorován",
      subSelectPlaceholder: "Vyberte...",
      matchDropdownTitle: "Srovnat",
      unmatched: "Nesouhlasící",
      duplicateColumnWarningTitle: "Další sloupec není vybrán",
      duplicateColumnWarningDescription: "Sloupce nemohou být duplikovány",
    },
    validationStep: {
      title: "Ověření dat",
      nextButtonTitle: "Potvrdit",
      backButtonTitle: "Zpět",
      noRowsMessage: "Nebyla nalezena žádná data",
      noRowsMessageWhenFiltered: "Nebyla nalezena žádná data obsahující chyby",
      discardButtonTitle: "Zahodit vybrané řádky",
      filterSwitchTitle: "Zobrazit pouze řádky s chybami",
    },
    alerts: {
      confirmClose: {
        headerTitle: "Ukončit import",
        bodyText: "Jste si jistí? Vaše aktuální informace nebudou uloženy.",
        cancelButtonTitle: "Zrušit",
        exitButtonTitle: "Ukončit import",
      },
      submitIncomplete: {
        headerTitle: "Zjištěny chyby",
        bodyText: "Stále existují některé řádky obsahující chyby. Řádky s chybami budou při odesílání ignorovány.",
        bodyTextSubmitForbidden: "Stále existují některé řádky obsahující chyby.",
        cancelButtonTitle: "Zrušit",
        finishButtonTitle: "Odeslat",
      },
      submitError: {
        title: "Chyba",
        defaultMessage: "Při odesílání dat došlo k chybě",
      },
      unmatchedRequiredFields: {
        headerTitle: "Neshodují se všechny sloupce",
        bodyText: "Existují povinné sloupce, které nejsou shodovány nebo jsou ignorovány. Chcete pokračovat?",
        listTitle: "Neshodující se sloupce:",
        cancelButtonTitle: "Zrušit",
        continueButtonTitle: "Pokračovat",
      },
      toast: {
        error: "Chyba",
      },
    },
  };
};
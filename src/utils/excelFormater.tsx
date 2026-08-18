import ExcelJS from "exceljs";
import type { OrderResponse } from "../modules/order_manage/types/api-response";

const getExcelColumnName = (index: number) => {
  let result = "";
  let number = index;

  while (number > 0) {
    const remainder = (number - 1) % 26;
    result = String.fromCharCode(65 + remainder) + result;
    number = Math.floor((number - 1) / 26);
  }

  return result;
};

type ColumnProps = {
    header: string;
    key: string;
    width?: number;
}

export const exportExcel = async ({
  data = [],
  columns = [],
  sheetName = "Data",
  fileName = "export.xlsx",
}) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName);

  worksheet.columns = columns.map((column: ColumnProps) => ({
    header: column.header,
    key: column.key,
    width: column.width || 20,
  }));

  data.forEach((item) => {
    const row = {};

    columns.forEach((column) => {
      row[column.key] =
        typeof column.value === "function"
          ? column.value(item)
          : item[column.key];
    });

    worksheet.addRow(row);
  });

  const headerRow = worksheet.getRow(1);

  headerRow.font = {
    bold: true,
  };

  headerRow.alignment = {
    vertical: "middle",
    horizontal: "center",
  };

  headerRow.height = 22;

  worksheet.views = [
    {
      state: "frozen",
      ySplit: 1,
    },
  ];

  if (columns.length > 0) {
    worksheet.autoFilter = {
      from: "A1",
      to: `${getExcelColumnName(columns.length)}1`,
    };
  }

  worksheet.eachRow((row) => {
    row.alignment = {
      vertical: "middle",
    };
  });

  return {
    workbook,
    fileName,
  };
};
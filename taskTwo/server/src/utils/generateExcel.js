// utils/generateExcel.js
import ExcelJS from "exceljs";
import logger from "./logger.js";
import { ApiError } from "./ApiError.js";

export const generateExcel = async (columns, data, sheetName = "Data") => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetName, {
      pageSetup: { paperSize: 9, orientation: "landscape" },
    });

    // ✅ Define columns
    worksheet.columns = columns.map((col) => ({
      header: col.header,
      key: col.key,
      width: col.width || 20,
    }));

    // ✅ Add data rows
    data.forEach((row) => worksheet.addRow(row));

    // ✅ Add border for all cells
    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    // ✅ Return buffer for sending directly
    return await workbook.xlsx.writeBuffer();
  } catch (err) {
    logger.error(`Error in generateExcel: ${err.message}`);
    throw new ApiError(err.message);
  }
};

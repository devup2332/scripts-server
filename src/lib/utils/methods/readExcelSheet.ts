import * as xlsx from 'xlsx';
interface CustomObject {
  [key: string]: string;
}

export const readExcelSheet = (excelToReadDir: string, sheetName: string) => {
  const wb = xlsx.readFile(excelToReadDir);
  const data: object[] = xlsx.utils.sheet_to_json(wb.Sheets[sheetName]);
  return data as CustomObject[];
};

import * as fs from 'fs';
import path from 'path';
interface CSVToJSONResult {
  [key: string]: string;
}

const CSVToJSON = (data: string, delimiter: string = ','): CSVToJSONResult[] => {
  const titles = data.slice(0, data.indexOf('\n')).split(delimiter);
  return data
    .slice(data.indexOf('\n') + 1)
    .split('\n')
    .map((v) => {
      const values = v.split(delimiter);
      return titles.reduce(
        (obj, title, index) => ((obj[title.trim()] = values[index].trim()), obj),
        {} as CSVToJSONResult
      );
    });
};



//   console.log(CSVToJSON('col1,col2\na,b\nc,d'));
// Example usage
const currentDir = __dirname;
// Go one level above (back to 'src')
const srcDir = path.resolve(currentDir, "..");

// Change to 'config' folder
const testdataDir = path.resolve(srcDir, "testdata");
const csvFilePath = `${testdataDir}`;
interface ConvertCsvFileToJsonFileOptions {
  csvFileName: string;
  jsonFileName: string;
  delimiter?: string;
}

export const convertCsvFileToJsonFile = (
  csvFileName: string,
  jsonFileName: string,
  delimiter: string = ','
): void => {
  try {
    // Read the CSV file
    const csvData: string = fs.readFileSync(`${testdataDir}\\${csvFileName}`, 'utf8');

    // Convert CSV to JSON
    const jsonData: CSVToJSONResult[] = CSVToJSON(csvData, delimiter);

    // Write JSON data to a new file
    fs.writeFileSync(`${testdataDir}\\${jsonFileName}`, JSON.stringify(jsonData, null, 2));

    console.log(`Conversion completed. JSON data written to: ${testdataDir}\\${jsonFileName}`);
  } catch (error) {
    console.error('Error converting CSV to JSON:', (error as Error).message);
  }
};
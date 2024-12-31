declare module 'csv-writer' {
  export function createObjectCsvWriter(params: {
    path: string;
    header: { id: string; title: string }[];
  }): {
    writeRecords(records: any[]): Promise<void>;
  };
}

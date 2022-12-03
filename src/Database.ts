import { Table, TableConfig } from "./Table";

export class Database {
  id: string;
  sheets: GoogleAppsScript.Spreadsheet.Spreadsheet;

  constructor(databaseSheetsId: string) {
    this.id = databaseSheetsId;
    this.sheets = SpreadsheetApp.openById(this.id);
  }

  getTable<T>(config: TableConfig<T>): Table<T> {
    const sheet = this.sheets.getSheetByName(config.name);
    const table = new Table<T>(sheet, config);
    return table;
  }

  //   createTable(tableName: string): Table {
  //     const sheet = this.sheets.insertSheet();
  //     sheet.setName(tableName);
  //     const table = new Table(this.sheets, tableName);
  //     return table;
  //   }

  //   static create(databaseName: string): Database {
  //     const dbSheets = SpreadsheetApp.create(databaseName);
  //     const db = new Database(dbSheets.getId());

  //     for (let tableConfig of TABLES) {
  //       const table = db.createTable(tableConfig.TABLE_NAME);
  //     }

  //     Logger.log(`Database SpreadSheet has been created with name: ${dbSheets}`);
  //     Logger.log(`URL: ${dbSheets.getUrl()}`);
  //     return db;
  //   }
}

class Database {
  sheets: GoogleAppsScript.Spreadsheet.Spreadsheet;

  constructor(sheets: GoogleAppsScript.Spreadsheet.Spreadsheet) {
    this.sheets = sheets;
  }

  getTable<T extends Entity>(config: TableConfig<T>): Table<T> {
    const sheet = this.sheets.getSheetByName(config.name);
    if (!sheet) throw Error(`Sheet with name '${config.name}' not found.`);
    const table = new Table<T>(sheet, config);
    return table;
  }
}

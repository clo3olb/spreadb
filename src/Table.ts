import { Entity, EntityTypes } from "./DataTypes";
import { Utils } from "./Utils";

export type TableConfig<T> = {
  name: string;
  entityTypes: EntityTypes<T>;
};

export class Table<T extends Entity> {
  // Primitive
  sheet: GoogleAppsScript.Spreadsheet.Sheet;
  config: TableConfig<T>;

  // states
  range: GoogleAppsScript.Spreadsheet.Range;
  matrix: any[][];

  constructor(sheet: GoogleAppsScript.Spreadsheet.Sheet, config: TableConfig<T>) {
    this.sheet = sheet;
    this.config = config;

    // prettier-ignore
    this.range = this.sheet.getRange(1, 1, this.sheet.getMaxRows(), this.sheet.getMaxColumns());
    this.matrix = this.range.getValues();

    // Check
    this._checkHeaders();
    this._checkValues();
  }

  _checkHeaders() {
    const headerRowValues = this._getHeaderRowValues();
    const headers = this.getHeaders();

    // Check if there is an empty headers among headers.
    for (let i = 0; i < headers.length; i++) {
      if (headers[i] != headerRowValues[i]) {
        // prettier-ignore
        throw new Error(`Table(${this.config.name}) has empty header - Column: ${Utils.toAlphabet(i)}`);
      }
    }

    const headerNames = Object.keys(this.config.entityTypes).map((key) =>
      this.config.entityTypes[key].getName()
    );

    if (Utils.hasSameElements(headerNames, headers) == false) {
      throw new Error(
        `Table(${this.config.name}) has unspecified column header. headerNames: ${headerNames}, header: ${headers}.`
      );
    }
  }

  _checkValues() {
    const allData = this.getAllData();
    allData.forEach((data) => {
      try {
        this._validate(data);
      } catch (error) {
        throw Error(
          `Table(${this.config.name}) has invalid value. data: ${JSON.stringify(data)}. \n${error}`
        );
      }
    });
  }

  _validate(data: T) {
    for (const key in data) {
      try {
        this.config.entityTypes[key].validate(data[key]);
      } catch (error) {
        throw new Error(
          `'${data[key]}' cannot be type of ${this.config.entityTypes[key].getType()}. \n${error}`
        );
      }
    }
  }

  _getHeaderRowValues(): string[] {
    return this.getMatrix()[0];
  }

  findData(key: keyof T, value: any): T[] {
    return this.getAllData().filter((data) => data[key] == value);
  }

  getAllData(): T[] {
    const headers = this.getHeaders();
    const values = this.getValues();

    const dataList = values.map((row) => this.parseData(headers, row));
    return dataList;
  }

  parseData(headers: string[], values: any[]): T {
    const data = {} as T;
    for (let i = 0; i < headers.length; i++) {
      const key = this.headerToKey(headers[i]);
      if (key) {
        data[key] = values[i];
      } else {
      }
    }
    return data as T;
  }

  headerToKey(header: string): keyof T | undefined {
    for (const key in this.config.entityTypes) {
      if (this.config.entityTypes[key].getName() == header) {
        return key;
      }
    }
    return undefined;
  }

  getHeaders(): string[] {
    const headerRows = this._getHeaderRowValues();
    return Utils.compact(headerRows);
  }

  getMatrix(): any[][] {
    return this.matrix;
  }

  getValues(): any[][] {
    const headers = this.getHeaders();
    const values = this.matrix
      .slice(1)
      .map((row) => row.slice(0, headers.length))
      .filter((row) => !Utils.isEmptyArray(row));
    return values;
  }
}

type TableConfig<T extends Entity> = {
  name: string;
  entityTypes: EntityTypes<T>;
};

class Table<T extends Entity> {
  // Primitive
  sheet: GoogleAppsScript.Spreadsheet.Sheet;
  config: TableConfig<T>;

  // states
  range: GoogleAppsScript.Spreadsheet.Range;
  matrix: any[][];
  headerRowIndex: number;

  constructor(sheet: GoogleAppsScript.Spreadsheet.Sheet, config: TableConfig<T>) {
    this.sheet = sheet;
    this.config = config;
    this.headerRowIndex = 0;

    // prettier-ignore
    this._resetRange();
    this._resetMatrix();

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

  paint() {
    this.range.setValues(this.matrix);
  }

  setValuesByIndex(index: number, property: keyof T, value: Value) {
    // validate
    this.config.entityTypes[property].validate(value);
    const indexColumnIndex = this.getColumnIndex("index");
    const columnIndex = this.getColumnIndex(property);
    if (columnIndex < 0) {
      throw new Error(`Cannot find column(${String(property)}) in the Table(${this.config.name}).`);
    }
    const rowIndex = this.matrix.findIndex((row) => row[indexColumnIndex] == index);
    if (rowIndex < 0) {
      throw new Error(
        `Cannot find row with index of (${index}) in the Table(${this.config.name}).`
      );
    }

    this.matrix[rowIndex][columnIndex] = value;
  }

  setValuesByRowIndex(rowIndex: number, property: keyof T, value: Value) {
    // validate
    this.config.entityTypes[property].validate(value);
    const indexColumnIndex = this.getColumnIndex("index");
    const columnIndex = this.getColumnIndex(property);
    if (columnIndex < 0) {
      throw new Error(`Cannot find column(${String(property)}) in the Table(${this.config.name}).`);
      throw new Error(`Cannot find column(${String(property)}) in the Table(${this.config.name}).`);
    }
    if (rowIndex <= 0) {
      throw new Error(`rowIndex must be larger than 0, but got ${rowIndex}}).`);
    }
    if (this.matrix[rowIndex][columnIndex] != "") {
      throw new Error(
        `There is already existing values in row (${rowIndex + 1}) in the Table(${
          this.config.name
        }).`
      );
    }
    this.matrix[rowIndex][columnIndex] = value;
  }

  addEntities(entities: T[]) {
    this.sheet.insertRowsBefore(this.headerRowIndex + 2, entities.length);
    this._resetRange();
    this._resetMatrix();

    const newIndex = this.getNewIndex();
    entities.forEach((entity, i) => {
      entity.index = newIndex + i;
      this._validateValues(entity);
      for (const key in this.config.entityTypes) {
        const rowIndex = this.headerRowIndex + (i + 1);
        this.setValuesByRowIndex(rowIndex, key, entity[key]);
      }
    });
    this.paint();
  }

  _resetRange() {
    this.range = this.sheet.getRange(1, 1, this.sheet.getMaxRows(), this.sheet.getMaxColumns());
  }
  _resetMatrix() {
    this.matrix = this.range.getValues();
  }

  getNewIndex() {
    const indexColumn = this.getColumn("index");
    const newIndex = indexColumn.reduce((max, curr) => (curr > max ? curr : max), 0) + 1;
    return newIndex;
  }

  _checkValues() {
    // Find invalid values
    const allData = this.getAllEntities();
    allData.forEach((data) => {
      try {
        this._validateValues(data);
      } catch (error) {
        throw new Error(
          `Table(${this.config.name}) has invalid value. data: ${JSON.stringify(data)}. \n${error}`
        );
      }
    });

    // Check whether index field is required.
    if (this.config.entityTypes.index.required == false) {
      throw new Error(`Table(${this.config.name}) index field must be required.`);
    }

    // Find duplicate index
    const indexColumn = this.getColumn("index");
    const duplicateIndex = indexColumn
      .sort()
      .find((v, i, values) => (values.length - 1 > i ? v == values[i + 1] : false));
    if (duplicateIndex >= 0) {
      throw new Error(`Table(${this.config.name}) has duplicate index with ${duplicateIndex}.`);
    }
  }

  _validateValues(entity: T) {
    for (const key in entity) {
      try {
        this.config.entityTypes[key].validate(entity[key]);
      } catch (error) {
        throw new Error(
          `'${entity[key]}' cannot be type of ${this.config.entityTypes[key].getType()}. \n${error}`
        );
      }
    }
  }

  _getHeaderRowValues(): string[] {
    return this.getMatrix()[0];
  }

  find(predicate: (value: T, index: number, array: T[]) => boolean): T {
    return this.getAllEntities().find(predicate);
  }

  findAll(predicate: (value: T, index: number, array: T[]) => boolean): T[] {
    return this.getAllEntities().filter(predicate);
  }

  getColumn<K extends keyof T>(property: K): T[K][] {
    const columnIndex = this.getColumnIndex(property);
    const columnValues = this.getValues().map((row) => row[columnIndex]);
    return columnValues;
  }

  getColumnIndex(property: keyof T) {
    const headerName = this.config.entityTypes[property].getName();
    return this.getHeaders().findIndex((h) => h == headerName);
  }

  getAllEntities(): T[] {
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

import { Table } from "./Table";

export class Row {
  table: Table;
  id: string;

  constructor(table: Table, id: string) {
    this.table = table;
    this.id = id;
  }
}

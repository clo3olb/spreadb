import { Utils } from "./Utils";

export type Entity = {
  [property: string]: DataType;
};

export interface DataConverter {
  convert(input: any): any;
}

export abstract class DataType {
  headerName: string;
  required: boolean;

  constructor(headerName: string) {
    this.headerName = headerName;
    this.required = false;
  }

  isRequired() {
    this.required = true;
    return this;
  }

  getName(): string {
    return this.headerName;
  }

  getType(): string {
    throw Error(`getType() is not defined in '${this.headerName}'.`);
  }

  validate(input: any) {
    if (this.required && !input) {
      throw Error(`${this.headerName} is required field, but got no value.`);
    }
  }
}

export class DataText extends DataType {
  constructor(name: string) {
    super(name);
  }

  validate(input: any) {
    super.validate(input);
    if (!this.required && !input) return;

    if (Utils.hasTrailingSpace(input)) {
      throw Error(`${this.headerName}: '${input}' has trailing space.`);
    }
  }

  getType(): string {
    return "DataText";
  }
}

export class DataNumber extends DataType {
  constructor(name: string) {
    super(name);
  }

  validate(input: any) {
    super.validate(input);
    if (!this.required && !input) return;

    if (Utils.hasTrailingSpace(input)) {
      throw Error(`${this.headerName}: '${input}' has trailing space.`);
    }

    if (Number(input) != input) {
      throw Error(`${this.headerName}: '${input}' is not appropriate number format.`);
    }
  }

  getType(): string {
    return "DataNumber";
  }
}

export class DataEmail extends DataText {
  constructor(name: string) {
    super(name);
  }

  validate(input: any) {
    super.validate(input);
    if (!this.required && !input) return;

    if (Utils.isEmail(input) == false) {
      throw Error(`${this.headerName}: '${input}' is not an email.`);
    }
  }

  getType(): string {
    return "DataEmail";
  }
}

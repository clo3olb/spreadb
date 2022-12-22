interface DataConverter {
  convert(input: any): any;
}

abstract class DataType {
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
    if (this.required && (input === "" || input === undefined || input === null)) {
      throw Error(`${this.headerName} is required field, but got no value.`);
    }
  }
}

class DataText extends DataType {
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

class DataNumber extends DataType {
  constructor(name: string) {
    super(name);
  }

  validate(input: any) {
    super.validate(input);
    if (!this.required && !input) return;

    if (Utils.hasTrailingSpace(input)) {
      throw Error(`${this.headerName}: '${input}' has trailing space.`);
    }

    if (Number(input) !== input) {
      throw Error(`${this.headerName}: '${input}' is not appropriate number format.`);
    }
  }

  getType(): string {
    return "DataNumber";
  }
}

class DataEmail extends DataText {
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

class DataGender extends DataText {
  constructor(name: string) {
    super(name);
  }

  validate(input: any) {
    super.validate(input);
    if (!this.required && !input) return;

    if (input != "남" && input != "여") {
      throw Error(
        `${this.headerName}: '${input}' is not a gender. Gender type must be either '남' or '여'.`
      );
    }
  }

  getType(): string {
    return "DataGender";
  }
}

class DataWordTestType extends DataText {
  constructor(name: string) {
    super(name);
  }

  validate(input: any) {
    super.validate(input);
    if (!this.required && !input) return;

    if (input != "TOEFL" && input != "SAT") {
      throw Error(
        `${this.headerName}: '${input}' is not a word test type. Word test type must be either TOEFL or SAT.`
      );
    }
  }

  getType(): string {
    return "DataWordTestType";
  }
}

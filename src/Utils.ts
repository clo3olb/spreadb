class Utils {
  static createUUID(prefix: string = "") {
    return prefix + Utilities.getUuid();
  }

  static compact(array: any[]) {
    var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

    while (++index < length) {
      var value = array[index];
      if (value) {
        result[resIndex++] = value;
      }
    }
    return result;
  }

  static toAlphabet(n: number) {
    const alphabets = [];
    const totalAlphabets = "Z".charCodeAt(0) - "A".charCodeAt(0) + 1;
    let block = n;
    while (block >= 0) {
      alphabets.unshift(String.fromCharCode((block % totalAlphabets) + "A".charCodeAt(0)));
      block = Math.floor(block / totalAlphabets) - 1;
    }
    return alphabets.join("");
  }

  static getA1Notation(row: number, column: number) {
    return `${this.toAlphabet(column)}${row + 1}`;
  }

  static fromAlphabetsToNumber(alphabets: string): number {
    const characters = "Z".charCodeAt(0) - "A".charCodeAt(0) + 1;

    let number = 0;
    alphabets.split("").forEach((char: string) => {
      number *= characters;
      number += char.charCodeAt(0) - "A".charCodeAt(0) + 1;
    });

    return number;
  }

  static values(object: any): any[] {
    const values: any[] = [];
    for (const key in object) {
      values.push(object[key]);
    }
    return values;
  }

  static hasSameElements(arrA: any[], arrB: any[]): boolean {
    if (arrA.length != arrB.length) return false;
    for (let i = 0; i < arrA.length; i++) {
      if (arrB.find((v) => v == arrA[i]) == undefined) {
        return false;
      }
    }
    return true;
  }

  static isEmptyArray(array: any[]) {
    for (let i = 0; i < array.length; i++) {
      if (array[i]) {
        return false;
      }
    }
    return true;
  }

  static hasTrailingSpace(input: any) {
    return String(input).trim() != input;
  }

  static isEmail(email: string) {
    const regex = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g);
    return regex.test(email);
  }
}

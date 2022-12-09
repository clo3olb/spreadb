import { Database } from "./src/Database";
import { DataEmail, DataGender, DataNumber, DataText } from "./src/DataTypes";
import { TableConfig } from "./src/Table";

type Student = {
  index: number;
  name: string;
  email: string;
  gender: string;
};

const STUDENT_TABLE_CONFIG: TableConfig<Student> = {
  name: "students",
  entityTypes: {
    index: new DataNumber("#").isRequired(),
    name: new DataText("이름").isRequired(),
    email: new DataEmail("이메일").isRequired(),
    gender: new DataGender("성별").isRequired(),
  },
};

function main() {
  const DB_SHEETS_ID = "1OR52xHhhuTSLqXALdw2VQ-_tVfsi1pXvOhlI2EoArK8";
  const db = new Database(DB_SHEETS_ID);
  const table = db.getTable(STUDENT_TABLE_CONFIG);

  // Test

  const dataList = table.findData("name", "김현우");
  Logger.log(dataList);
}

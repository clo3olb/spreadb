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

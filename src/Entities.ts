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

type Word = {
  index: number;
  english: string;
  korean: string;
};

const WORD_TABLE_CONFIG: TableConfig<Word> = {
  name: "words",
  entityTypes: {
    index: new DataNumber("#").isRequired(),
    english: new DataText("영어").isRequired(),
    korean: new DataText("한국어").isRequired(),
  },
};

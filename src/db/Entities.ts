type Value = string | number;

type Entity = {
  [property: string]: Value;
  index: number;
};

type EntityTypes<T> = {
  [property in keyof T]: DataType;
};

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
//#	시험 종류	날짜	이름	시작 번호	끝 번호	제출 링크	추가제목	개수 제한
type WordTest = {
  index: number;
  title: string;
  type: WordTestType;
  date: string;
  start: number;
  end: number;
  limit: number;
  link: string;
  id: string;
  score_updated_at: number;
};

const WORD_TEST_TABLE_CONFIG: TableConfig<WordTest> = {
  name: "word_tests",
  entityTypes: {
    index: new DataNumber("#").isRequired(),
    title: new DataText("제목").isRequired(),
    type: new DataWordTestType("유형").isRequired(),
    date: new DataText("날짜").isRequired(),
    start: new DataNumber("시작번호").isRequired(),
    end: new DataNumber("끝번호").isRequired(),
    limit: new DataNumber("개수제한").isRequired(),
    link: new DataText("제출링크"),
    id: new DataText("시험 ID"),
    score_updated_at: new DataText("최종 점수 업데이트"),
  },
};

type WordTestScore = {
  index: number;
  name: string;
  type: WordTestType;
  score: number;
  timestamp: number;
  test_id: string;
};

const WORD_TEST_SCORE_TABLE_CONFIG: TableConfig<WordTestScore> = {
  name: "word_test_scores",
  entityTypes: {
    index: new DataNumber("#").isRequired(),
    name: new DataText("이름").isRequired(),
    type: new DataWordTestType("유형").isRequired(),
    score: new DataNumber("점수").isRequired(),
    timestamp: new DataText("타임스탬프").isRequired(),
    test_id: new DataText("시험 ID").isRequired(),
  },
};

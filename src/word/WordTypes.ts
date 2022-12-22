type Word = {
  index: number;
  question: string;
  definition_en: string;
  definition_ko: string;
  answer: string;
  choice_1: string;
  choice_2: string;
  choice_3: string;
};

const TOEFL_1800_CONFIG: TableConfig<Word> = {
  name: "TOEFL 1800",
  entityTypes: {
    index: new DataNumber("#").isRequired(),
    question: new DataText("question").isRequired(),
    definition_en: new DataText("definition_en").isRequired(),
    definition_ko: new DataText("definition_ko").isRequired(),
    answer: new DataText("answer").isRequired(),
    choice_1: new DataText("choice_1").isRequired(),
    choice_2: new DataText("choice_2").isRequired(),
    choice_3: new DataText("choice_3").isRequired(),
  },
};

const TOEFL_2400_CONFIG: TableConfig<Word> = {
  name: "TOEFL 2400",
  entityTypes: {
    index: new DataNumber("#").isRequired(),
    question: new DataText("question").isRequired(),
    definition_en: new DataText("definition_en"),
    definition_ko: new DataText("definition_ko"),
    answer: new DataText("answer").isRequired(),
    choice_1: new DataText("choice_1").isRequired(),
    choice_2: new DataText("choice_2").isRequired(),
    choice_3: new DataText("choice_3").isRequired(),
  },
};
const SAT_2400_CONFIG: TableConfig<Word> = {
  name: "SAT 2400",
  entityTypes: {
    index: new DataNumber("#").isRequired(),
    question: new DataText("question").isRequired(),
    definition_en: new DataText("definition_en"),
    definition_ko: new DataText("definition_ko"),
    answer: new DataText("answer").isRequired(),
    choice_1: new DataText("choice_1").isRequired(),
    choice_2: new DataText("choice_2").isRequired(),
    choice_3: new DataText("choice_3").isRequired(),
  },
};

type WordTestType = "TOEFL" | "SAT";

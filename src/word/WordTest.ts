const WORD_SHEETS_ID = "14jAsQIrq47AZSwTdmBykL3qL2jbw47BB-Vuv0n8vqdM";
const WORD_TEST_FOLDER_ID = "1XSNUvA85zfDKVVPxnv7iOUTyHfZGhDNp";
const WORD_TEST_TEMPLATE_ID = "1q7vPDYkDQuYS6NYPdm60NkvjS2s1YofFpld1_391Rtc";

function getWordTable(type: WordTestType): Table<Word> {
  const sheets = SpreadsheetApp.openById(WORD_SHEETS_ID);
  const db = new Database(sheets);
  if (type == "SAT") return db.getTable(SAT_2400_CONFIG);
  if (type == "TOEFL") return db.getTable(TOEFL_2400_CONFIG);
}

function createWordTest(
  title: string,
  type: WordTestType,
  startIndex: number,
  endIndex: number,
  limit: number
): GoogleAppsScript.Forms.Form {
  const numberOfQuestions = endIndex - startIndex + 1;
  if (numberOfQuestions < limit) {
    throw new Error(
      `'Cannot create Test(${title}) because number of questions required is larger than all the words from index. Words from ${startIndex} ~ ${endIndex} cannot create ${limit} questions.`
    );
  }
  const table = getWordTable(type);
  const words = table.findAll((word) => word.index >= startIndex && word.index <= endIndex);
  const mixedWords = Utils.randomize(words);
  return createWordTestForm(title, mixedWords.slice(0, numberOfQuestions));
}

function createWordTestForm(title: string, words: Word[]): GoogleAppsScript.Forms.Form {
  // Check existence
  const folder = DriveApp.getFolderById(WORD_TEST_FOLDER_ID);
  if (folder.getFilesByName(title).hasNext()) {
    throw new Error(`'${title} already exists in word test folder: ${folder.getName()}'`);
  }

  // Copy from template and set title
  const formFile = DriveApp.getFileById(WORD_TEST_TEMPLATE_ID).makeCopy();
  const formId = formFile.getId();
  const form = FormApp.openById(formId);
  form.setTitle(title);
  formFile.setName(title);

  // Add form to the folder
  folder.addFile(formFile);

  // Create questions
  words.forEach((word, i) => {
    const mc = form.addMultipleChoiceItem();
    mc.setPoints(1);
    mc.setTitle(`${i + 1}. ${word.question}`);

    const choices = Utils.randomize([word.answer, word.choice_1, word.choice_2, word.choice_3]);
    mc.setChoices(choices.map((choice) => mc.createChoice(choice, word.answer == choice)));
  });

  return form;
}

function getNameFromResponse(response: GoogleAppsScript.Forms.FormResponse): string {
  const itemResponses = response.getItemResponses();
  const NAME_TITLE = "이름";
  const nameItem = itemResponses.find((item) => item.getItem().getTitle() == NAME_TITLE);
  const name = nameItem.getResponse() as string;
  return name;
}

function getTestScoreFromResponse(response: GoogleAppsScript.Forms.FormResponse): number {
  const items = response.getGradableItemResponses();
  const score = items.reduce((totalScore, item) => item.getScore() + totalScore, 0);
  return score;
}

function getTestScoresFromForm(form: GoogleAppsScript.Forms.Form) {
  const responses = form.getResponses();
  const scores = responses.map((response) => {
    const name = getNameFromResponse(response);
    const score = getTestScoreFromResponse(response);
    const testScore = {
      name,
      score,
      timestamp: response.getTimestamp().getTime(),
    };
    return testScore;
  });
  return scores;
}

function UI_backUp() {
  const fileCopy = DriveApp.getFileById(DB_SHEETS_ID).makeCopy();
  const today = new Date();

  fileCopy.setName(`데이터베이스 백업 - ${today.toString()}`);
  DriveApp.getFolderById(BACKUP_FOLDER_ID).addFile(fileCopy);
}

function UI_createWordTest() {
  const mainDB = getMainDB();
  const wordTestTable = mainDB.getTable(WORD_TEST_TABLE_CONFIG);
  const wordTests = wordTestTable.findAll((test) => test.link == "");

  for (let test of wordTests) {
    const form = createWordTest(test.title, test.type, test.start, test.end, test.limit);
    const link = form.getPublishedUrl();
    const id = form.getId();
    wordTestTable.setValuesByIndex(test.index, "link", link);
    wordTestTable.setValuesByIndex(test.index, "id", id);
    wordTestTable.paint();
  }
}

function UI_updateTestScore() {
  const mainDB = getMainDB();
  const wordTestTable = mainDB.getTable(WORD_TEST_TABLE_CONFIG);
  const wordTestScoresTable = mainDB.getTable(WORD_TEST_SCORE_TABLE_CONFIG);
  const wordTests = wordTestTable.findAll((test) => test.id != "");

  wordTests.forEach((test) => {
    const form = FormApp.openById(test.id);
    const formID = form.getId();
    const testScores = getTestScoresFromForm(form);
    const wordTestScores: WordTestScore[] = testScores
      .map((testScore) => ({
        index: 0,
        name: testScore.name,
        type: test.type,
        score: testScore.score,
        timestamp: testScore.timestamp,
        test_id: formID,
      }))
      .filter(
        (
          testScore // 최종 업데이트 이후 제출된 시험만 업데이트
        ) => (test.score_updated_at ? testScore.timestamp > test.score_updated_at : true)
      );
    if (wordTestScores.length > 0) {
      const lastTimestamp = wordTestScores.reduce(
        (last, curr) => (curr.timestamp > last ? curr.timestamp : last),
        0
      );
      wordTestScoresTable.addEntities(wordTestScores);
      wordTestTable.setValuesByIndex(test.index, "score_updated_at", lastTimestamp);
      wordTestTable.paint();
    }
  });
}

function UI_validateData() {
  const mainDB = getMainDB();
  const studentTable = mainDB.getTable(STUDENT_TABLE_CONFIG);
  const wordTestTable = mainDB.getTable(WORD_TEST_TABLE_CONFIG);
  const wordTestScoresTable = mainDB.getTable(WORD_TEST_SCORE_TABLE_CONFIG);
}

function getMainDB() {
  const mainDB_sheets = SpreadsheetApp.openById(DB_SHEETS_ID);
  const mainDB = new Database(mainDB_sheets);
  return mainDB;
}

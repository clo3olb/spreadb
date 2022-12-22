function updateUI() {
  const sheets = SpreadsheetApp.openById(DB_SHEETS_ID);
  ScriptApp.newTrigger("onOpen").forSpreadsheet(sheets).onOpen().create();
}

function onOpen() {
  const ui = SpreadsheetApp.getUi();

  // Main
  const mainMenu = ui.createMenu("관리자");

  // BackUp
  const backUpMenu = ui.createMenu("백업").addItem("수동 백업", "backUp");

  // WordTest
  const wordTestMenu = ui
    .createMenu("단어시험")
    .addItem("단어시험 생성", "UI_createWordTest")
    .addItem("단어시험 점수 데이터 업데이트", "UI_updateTestScore");

  // Data
  const dataMenu = ui.createMenu("데이터").addItem("데이터 검증", "UI_validateData");

  // Render
  mainMenu.addSubMenu(backUpMenu).addSubMenu(dataMenu).addSubMenu(wordTestMenu).addToUi();
}

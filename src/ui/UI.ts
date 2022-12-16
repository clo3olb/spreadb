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

  // Data
  const dataMenu = ui.createMenu("데이터").addItem("데이터 검증", "functionNameHere");

  // Render
  mainMenu.addSubMenu(backUpMenu).addSubMenu(dataMenu).addToUi();
}

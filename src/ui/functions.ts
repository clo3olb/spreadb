function UI_backUp() {
  const fileCopy = DriveApp.getFileById(DB_SHEETS_ID).makeCopy();
  const today = new Date();

  fileCopy.setName(`데이터베이스 백업 - ${today.toString()}`);
  DriveApp.getFolderById(BACKUP_FOLDER_ID).addFile(fileCopy);
}

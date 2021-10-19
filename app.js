// jshint esversion: 9
// jshint laxbreak: true

const onOpen = e => {
  SpreadsheetApp.getUi()
    .createMenu('CLOCKIFY')
    .addItem('Sync Projects', 'main')
    .addItem('Sync Time Entries', 'getTimeEntries')
    .addToUi();
};

const initClockify = () => {
  const { workspaceId, userId, apiKey } = OPTIONS.Clockify;
  return new Clockify({
    workspaceId,
    userId,
    apiKey,
  });
};

const main = () => {
  const clockify = initClockify();
  const projects = clockify.getProjects(false);
  const ws = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    OPTIONS.ProjectsTab
  );
  ws.clearContents()
    .getRange(1, 1, projects.length, projects[0].length)
    .setValues(projects);
  // console.log(JSON.stringify(projects, null, 2));
};

const getTimeEntries = () => {
  const clockify = initClockify();
  const timeEntries = clockify.getTimeEntries();
  // console.log(JSON.stringify(timeEntries, null, 2));
  const ws = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    OPTIONS.TimeEntriesTab
  );
  ws.clearContents()
    .getRange(1, 1, timeEntries.length, timeEntries[0].length)
    .setValues(timeEntries);
};

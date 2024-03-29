const { ipcMain } = require("electron");

module.exports = (mainWindow) =>
  ipcMain.on("re-render", () => {
    mainWindow.reload();
  });

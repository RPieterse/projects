const { ipcMain } = require("electron");
const ini = require("ini");
const fs = require("fs");
const path = require("path");
const iniFilePath = path.join(__dirname, "..", "_c.ini");
const config = ini.parse(fs.readFileSync(iniFilePath, "utf-8"));

module.exports = ipcMain.handle("get-restoration-key", () => {
	const {
		security: { restore_key },
	} = config;

	return restore_key;
});

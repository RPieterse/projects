const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const ini = require("ini");
const fs = require("fs");
require("dotenv").config();
// const {
// 	userHasProductKey,
// 	validateProductKeyAgainstDatabase,
// } = require("./services/scripts/security/validate-product-key");
const { autoUpdater } = require("electron-updater");
const config = ini.parse(
	fs.readFileSync(path.join(__dirname, "_c.ini"), "utf-8")
);

let mainWindow;

// initialize the app
app.on("ready", async () => {
	mainWindow = new BrowserWindow({
		width: 800,
		height: 800,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
		},
	});

	if (process.env.ENVIRONMENT === "development") {
		require("./services/hot-reload")(mainWindow);
	}
	require("./services/security-checks");
	require("./services/activate-product-key");
	require("./services/restore-product-key");
	require("./services/protect-files");
	require("./services/get-restoration-key");

	if (config.global.initialized) {
		// if (
		// 	!userHasProductKey() ||
		// 	!(await validateProductKeyAgainstDatabase())
		// ) {
		// 	mainWindow.loadFile(
		// 		path.join(__dirname, "assets", "pages", "product_key.html")
		// 	);
		// } else {
		mainWindow.loadFile(
			path.join(__dirname, "assets", "pages", "index.html")
		);
		// }
	} else {
		config.global.initialized = true;
		fs.writeFileSync(path.join(__dirname, "_c.ini"), ini.stringify(config));
		mainWindow.loadFile(
			path.join(__dirname, "assets", "pages", "welcome.html")
		);
	}

	mainWindow.on("closed", () => {
		mainWindow = null;
	});

	mainWindow.webContents.on("did-finish-load", () => {
		mainWindow.webContents.send("load-done");
	});

	mainWindow.once("ready-to-show", () => {
		autoUpdater.checkForUpdatesAndNotify();
	});
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

autoUpdater.on("update-available", () => {
	mainWindow.webContents.send("update_available");
});
autoUpdater.on("update-downloaded", () => {
	mainWindow.webContents.send("update_downloaded");
});

ipcMain.on("restart_app", () => {
	autoUpdater.quitAndInstall();
});

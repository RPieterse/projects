const { ipcMain } = require("electron");
const {
	restoreProductKey,
} = require("./scripts/security/validate-product-key");

module.exports = ipcMain.handle("restore-product-key", (_, keys) => {
	return restoreProductKey(keys);
});

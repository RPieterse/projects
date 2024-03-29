const { ipcMain } = require("electron");
const {
	activateProductKey,
} = require("./scripts/security/validate-product-key");

module.exports = ipcMain.handle("activate-product-key", (_, product_key) => {
	return activateProductKey(product_key);
});

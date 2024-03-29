const { ipcMain } = require("electron");
// const {
// 	userHasProductKey,
// 	validateProductKeyAgainstDatabase,
// } = require("./scripts/security/validate-product-key");

module.exports = ipcMain.handle("security-checks", () => {
	// if (!userHasProductKey() || !validateProductKeyAgainstDatabase()) {
	// 	return false;
	// } else {
	// 	return true;
	// }
	return true;
});

// const ini = require("ini");
// const fs = require("fs");
// const path = require("path");
// const axios = require("../../plugins/axios");

// const iniFilePath = path.join(__dirname, "..", "..", "..", "_c.ini");
// const config = ini.parse(fs.readFileSync(iniFilePath, "utf-8"));

// const userHasProductKey = () => {
// 	const {
// 		security: { product_key, security_key },
// 	} = config;
// 	if (!product_key) return false;
// 	if (!security_key) return false;
// 	return true;
// };

// // API
// const activateProductKey = async (product_key) => {
// 	try {
// 		const { data } = await axios.post("/activateProductKey", {
// 			product_key,
// 		});
// 		if (data.success) {
// 			config.security.product_key = data.product_key;
// 			config.security.security_key = data.security_key;
// 			config.security.restore_key = data.restore_key;
// 			config.global.initialized = true;
// 			fs.writeFileSync(iniFilePath, ini.stringify(config));
// 			return;
// 		} else {
// 			return data.message;
// 		}
// 	} catch (err) {
// 		return err.message;
// 	}
// };

// // API
// const restoreProductKey = async (keys) => {
// 	try {
// 		const { data } = await axios.post("/restoreProductKey", keys);
// 		if (data.success) {
// 			config.security.product_key = data.product_key;
// 			config.security.security_key = data.security_key;
// 			config.security.restore_key = data.restore_key;
// 			config.global.initialized = true;
// 			fs.writeFileSync(iniFilePath, ini.stringify(config));
// 			return;
// 		} else {
// 			return data.message;
// 		}
// 	} catch (err) {
// 		return err.message;
// 	}
// };

// // API
// async function validateProductKeyAgainstDatabase() {
// 	const {
// 		security: { product_key, security_key },
// 	} = config;
// 	try {
// 		const { data } = await axios.post("/validateProductKey", {
// 			product_key,
// 			security_key,
// 		});
// 		if (data.success) {
// 			return true;
// 		} else {
// 			return false;
// 		}
// 	} catch (err) {
// 		return false;
// 	}
// }

// module.exports = {
// 	userHasProductKey,
// 	activateProductKey,
// 	restoreProductKey,
// 	validateProductKeyAgainstDatabase,
// };

const ini = require("ini");
const fs = require("fs");
const path = require("path");
const genSecurityKey = require("./genSecurityKey");
const { encrypt, decrypt } = require("./cryptor");

const iniFilePath = path.join(__dirname, "..", "..", "..", "_c.ini");
const mockFilePath = path.join(__dirname, "..", "..", "..", "mock.json");
const config = ini.parse(fs.readFileSync(iniFilePath, "utf-8"));

const userHasProductKey = () => {
	const {
		security: { product_key, security_key },
	} = config;
	if (!product_key) return false;
	if (!security_key) return false;
	return true;
};

// API
const activateProductKey = (product_key) => {
	const mock = fs.readFileSync(mockFilePath, "utf-8");
	const data = JSON.parse(mock);

	const productKeyFound =
		Object.keys(data.product_keys).includes(product_key) &&
		!data.product_keys[product_key].product_key_verified &&
		!data.product_keys[product_key].security_key;

	if (productKeyFound) {
		const security_key = genSecurityKey();
		const restore_key = genSecurityKey();
		data.product_keys[product_key]["product_key_verified"] = true;
		data.product_keys[product_key]["product_key_last_verified"] =
			new Date().toISOString();
		data.product_keys[product_key]["security_key"] = security_key;
		data.product_keys[product_key]["restore_key"] = restore_key;
		fs.writeFileSync(mockFilePath, JSON.stringify(data, null, 2));

		config.security.product_key = encrypt(product_key);
		config.security.security_key = encrypt(security_key);
		config.security.restore_key = restore_key;
		config.global.initialized = true;
		fs.writeFileSync(iniFilePath, ini.stringify(config));
		return false;
	}

	return "Invalid product key.";
};

// API
const restoreProductKey = (keys) => {
	const { product_key, restore_key } = keys;
	const mock = fs.readFileSync(mockFilePath, "utf-8");
	const data = JSON.parse(mock);

	if (!Object.keys(data.product_keys).includes(product_key)) {
		return "Invalid product key.";
	}

	if (!data.product_keys[product_key].restore_key) {
		return "No restore key found.";
	}

	if (data.product_keys[product_key].restore_key !== restore_key) {
		return "Invalid restore key.";
	}

	const productKeyFound =
		data.product_keys[product_key].product_key_verified &&
		data.product_keys[product_key].security_key;

	if (productKeyFound) {
		const security_key = genSecurityKey();
		data.product_keys[product_key]["product_key_last_verified"] =
			new Date().toISOString();
		data.product_keys[product_key]["security_key"] = security_key;
		fs.writeFileSync(mockFilePath, JSON.stringify(data, null, 2));
		config.security.product_key = encrypt(product_key);
		config.security.security_key = encrypt(security_key);
		config.security.restore_key = restore_key;
		config.global.initialized = true;
		fs.writeFileSync(iniFilePath, ini.stringify(config));
		return false;
	}
};

// API
function validateProductKeyAgainstDatabase() {
	const {
		security: { product_key, security_key },
	} = config;
	const mock = fs.readFileSync(mockFilePath, "utf-8");
	const data = JSON.parse(mock);
	const key = data.product_keys[decrypt(product_key)];

	if (
		key &&
		key.product_key_verified &&
		key.security_key === decrypt(security_key)
	) {
		data.product_keys[decrypt(product_key)].product_key_last_verified =
			new Date().toISOString();
		fs.writeFileSync(mockFilePath, JSON.stringify(data, null, 2));
		return true;
	}
	return false;
}

module.exports = {
	userHasProductKey,
	activateProductKey,
	restoreProductKey,
	validateProductKeyAgainstDatabase,
};

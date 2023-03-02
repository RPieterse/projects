const tsconfig = require("./tsconfig.json");
const moduleNameMapperConfig = require("tsconfig-paths-jest")(tsconfig);
require("dotenv").config();

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testTimeout: 10000,
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  moduleNameMapper: {
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",
    "\\.(gif|ttf|eot|svg|png)$": "<rootDir>/tests/__mocks__/fileMock.js",
    ...moduleNameMapperConfig,
  },
};

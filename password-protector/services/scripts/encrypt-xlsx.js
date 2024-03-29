const XlsxPopulate = require("xlsx-populate");

// Password protect XLSX files (similar to the previous script)
module.exports = async function passwordProtectXLSX(
  inputFilePath,
  outputFilePath,
  password
) {
  const workbook = await XlsxPopulate.fromFileAsync(inputFilePath);
  return await workbook.toFileAsync(outputFilePath, { password });
};

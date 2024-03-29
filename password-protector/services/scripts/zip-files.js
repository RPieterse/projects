const JSZip = require("jszip");
const path = require("path");
const fs = require("fs");

// Zip files (similar to the previous script)
module.exports = function zipFiles(directoryPath, zipFilePath) {
	const zip = new JSZip();
	fs.readdirSync(directoryPath).forEach((file) => {
		const filePath = path.join(directoryPath, file);
		const fileData = fs.readFileSync(filePath);
		zip.file(file, fileData);
	});
	zip.generateNodeStream({ type: "nodebuffer", streamFiles: true }).pipe(
		fs.createWriteStream(path.join(zipFilePath))
	);
};

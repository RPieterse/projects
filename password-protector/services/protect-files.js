const { ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const passwordProtectXLSX = require("./scripts/encrypt-xlsx");
const zipFiles = require("./scripts/zip-files");
const passwordProtectPDF = require("./scripts/encrypt-pdf");
const downloadsFolder = require("downloads-folder");
const { app } = require("electron");

function formatDateAndTime() {
	const now = new Date();
	const year = now.getFullYear();
	const month = String(now.getMonth() + 1).padStart(2, "0");
	const day = String(now.getDate()).padStart(2, "0");
	const hours = String(now.getHours()).padStart(2, "0");
	const minutes = String(now.getMinutes()).padStart(2, "0");
	const seconds = String(now.getSeconds()).padStart(2, "0");

	return `${year}-${month}-${day}T${hours}-${minutes}-${seconds}`;
}

// Handle IPC
ipcMain.handle("protect-files", async (event, { files, password, options }) => {
	// create const zipFileName with the date and time appended, not in milliseconds
	let zipFileName = options.zipName || "Protected";
	if (options.appendDate) {
		zipFileName += `(${formatDateAndTime()})`;
	}
	zipFileName += `.zip`;

	const outputZipFile = path.join(downloadsFolder(), zipFileName);
	const tempDirectory = path.join(downloadsFolder(), "temp");
	if (!fs.existsSync(tempDirectory)) {
		fs.mkdirSync(tempDirectory);
	}

	let promises = [];
	files.forEach((file) => {
		const outputFilePath = path.join(tempDirectory, path.basename(file));

		promises.push(
			new Promise((resolve, reject) => {
				if (path.extname(file) === ".xlsx") {
					// If the file is an XLSX file, password protect it
					passwordProtectXLSX(file, outputFilePath, password).then(
						() => {
							resolve();
						}
					);
				} else if (path.extname(file) === ".pdf") {
					passwordProtectPDF(file, outputFilePath, password).then(
						() => {
							resolve();
						}
					);
				} else {
					resolve();
				}
			})
		);
	});

	await Promise.all(promises);

	zipFiles(tempDirectory, outputZipFile);

	fs.rmdirSync(tempDirectory, { recursive: true });

	event.sender.send("files-protected", outputZipFile);

	return false;
});

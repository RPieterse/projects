const csv = require("csvtojson/v2");
const fs = require("fs");
const ora = require("ora");
const chalk = require("chalk");
const nodemailer = require("nodemailer");
require("dotenv").config();

const getArgs = (args) => {
	const parsedArgs = {};
	for (let i = 0; i < args.length; i++) {
		const arg = args[i];
		if (arg.startsWith("-")) {
			parsedArgs[arg] = args[i + 1];
		}
	}
	return parsedArgs;
};

const transporter = nodemailer.createTransport({
	service: process.env.SERVICE,
	auth: {
		user: process.env.EMAIL,
		pass: process.env.PASSWORD,
	},
	port: process.env.PORT,
	tls: process.env.TLS === "true" ? true : false,
});

const mailOptions = (config) => ({
	from: {
		name: "",
		address: "",
	},
	to: config.email,
	subject: config.subject,
	html: config.body,
	attachments: config.attachments,
});

async function execute() {
	const args = getArgs(process.argv)["-t"];
	const spinner = ora(chalk.green("Booting up the email sender...")).start();
	console.log("");

	// get the email data from the excel file
	const results = await csv().fromFile("mails.csv");

	if (args.hasOwnProperty("-t")) {
		console.log(chalk.yellow("Test mode enabled"));
		console.log(" ");
		console.log(results);
		process.exit(0);
	}

	const errors = [];

	try {
		const promises = [];
		const newResults = [];
		results.forEach((result) => {
			if (result.sent === "FALSE") {
				// replace the template tags with the email data
				let templateString = fs.readFileSync(
					`./templates/${result.template}.html`,
					"utf8"
				);
				const tags = templateString.match(/{{(.*?)}}/g);
				tags.forEach((tag) => {
					// replace all occurrences of the tag with the data
					const key = tag.replace("{{", "").replace("}}", "");
					templateString = templateString.replace(
						tag,
						result[key.trim()]
					);
				});

				// replace the subject tags with the email data
				const subjectTags = result.subject.match(/{{(.*?)}}/g);
				let emailSubject = result.subject;
				subjectTags.forEach((tag) => {
					const key = tag.replace("{{", "").replace("}}", "");
					emailSubject = emailSubject.replace(
						tag,
						result[key.trim()]
					);
				});

				// load the attachments
				const attachments = result.attachments
					.split(",")
					.map((attachment) => {
						return {
							path: `./attachment/${attachment}`,
						};
					});

				// send the email
				promises.push(
					new Promise(async (resolve, reject) => {
						return transporter.sendMail(
							mailOptions({
								email: result.email,
								subject: emailSubject,
								body: templateString,
								attachments,
							}),
							(err, info) => {
								if (err) {
									errors.push({ ...result, error: err });
									reject(err);
									newResults.push({
										...result,
										sent: "FALSE",
									});
								} else {
									resolve(info);
									newResults.push({
										...result,
										sent: "TRUE",
									});
								}
							}
						);
					})
				);
			} else {
				newResults.push(result);
			}
		});

		// clear errors.csv
		fs.writeFileSync("errors.csv", "");
		if (errors.length > 0) {
			// write the errors to a csv file
			const csv = errors.map((error) => {
				return `${error.email},${error.template},${error.subject},${error.error}`;
			});
			fs.writeFileSync("errors.csv", csv.join("\n"));
			console.log(chalk.blue("Errors have been written to errors.csv"));
		}

		// wait for all the emails to be sent
		spinner.text = `Emails being sent to ${
			results.filter((i) => i.sent === "FALSE").length
		} recipient(s)...`;
		console.log(" ");
		await Promise.all(promises);

		// overwrite the old results with the new results
		const headers = `sent,email,subject,code,url,template,attachments\n`;
		const csv = newResults.map((result) => {
			return `${result.sent},${result.email},${result.subject},${result.code},${result.url},${result.template},${result.attachments}`;
		});
		fs.writeFileSync("mails.csv", headers + csv.join("\n"));

		// finish the spinner
		spinner.succeed("Emails sent successfully");
	} catch (error) {
		console.log(" ");
		console.log(chalk.red(error));
		spinner.fail("Error sending emails");
		process.exit(1);
	}
}

execute();

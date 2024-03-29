const qpdf = require("node-qpdf");

module.exports = (inputFilePath, outputFilePath, password) => {
  const options = {
    keyLength: 256,
    password,
    outputFile: outputFilePath,
    restrictions: {
      modify: "none",
      extract: "n",
      print: "none",
    },
  };
  return new Promise((resolve, reject) => {
    qpdf.encrypt(inputFilePath, options).then(() => {
      resolve();
    });
  });
};

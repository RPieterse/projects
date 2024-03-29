if (typeof ipcRenderer === "undefined") {
  var { ipcRenderer } = require("electron");
}

if (typeof fs === "undefined") {
  var fs = require("fs");
}

if (typeof path === "undefined") {
  var path = require("path");
}

if (typeof rootPath !== "undefined") {
  rootPath = path.join(__dirname, "..", "..");
} else {
  var rootPath = path.join(__dirname, "..", "..");
}

(async () => {
  // go through all files in the assets directory and assign a watcher to each
  const assetsDir = path.join(rootPath, "assets");
  const files = fs.readdirSync(assetsDir);
  // if the file is a directory, go inside it and assign a watcher to each file
  // if the file is a file, assign a watcher to it
  files.forEach((file) => {
    const filePath = path.join(assetsDir, file);
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      const subFiles = fs.readdirSync(filePath);
      subFiles.forEach((subFile) => {
        const subFilePath = path.join(filePath, subFile);
        const subFileStats = fs.statSync(subFilePath);
        if (subFileStats.isFile()) {
          const watcher = fs.watch(subFilePath);
          watcher.on("change", () => {
            ipcRenderer.send("re-render", subFilePath);
          });
        }
      });
    } else if (stats.isFile()) {
      const watcher = fs.watch(filePath);
      watcher.on("change", () => {
        ipcRenderer.send("re-render", filePath);
      });
    }
  });
})();

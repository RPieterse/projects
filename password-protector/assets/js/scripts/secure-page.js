if (typeof ipcRenderer === "undefined") {
  var { ipcRenderer } = require("electron");
}

document.addEventListener("DOMContentLoaded", function () {
  ipcRenderer.invoke("security-checks").then((result) => {
    if (!result) {
      window.location.href = "product_key.html";
    }
  });
});

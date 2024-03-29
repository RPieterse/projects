if (typeof ipcRenderer === "undefined") {
	var { ipcRenderer } = require("electron");
}
$(document).ready(function () {
	$("#product-key").focus();
	$("#lets-go").click(function (e) {
		e.preventDefault();
		$("#lets-go").text("Activating...");
		$("#product-key").prop("disabled", true);
		setTimeout(function () {
			if ($("#restore-me").is(":checked")) {
				ipcRenderer
					.invoke("restore-product-key", {
						product_key: $("#product-key").val(),
						restore_key: $("#product-key-restore").val(),
					})
					.then((error) => {
						if (!error) {
							window.location.href = "index.html";
						} else {
							$("#product-key").val("");
							$("#product-key-restore").val("");
							alert(error);
						}
					})
					.finally(function () {
						$("#lets-go").text("Let's Go!");
						$("#product-key").prop("disabled", false);
					});
			} else {
				ipcRenderer
					.invoke("activate-product-key", $("#product-key").val())
					.then((error) => {
						if (!error) {
							window.location.href = "index.html";
						} else {
							$("#product-key").val("");
							alert(error);
						}
					})
					.finally(function () {
						$("#lets-go").text("Let's Go!");
						$("#product-key").prop("disabled", false);
					});
			}
		}, 1000);
	});

	$("#restore-me").click(function (e) {
		if (e.target.checked) {
			$("#product-key-restore").prop("hidden", false);
		} else {
			$("#product-key-restore").prop("hidden", true);
		}
	});
});

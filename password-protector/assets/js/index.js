if (typeof ipcRenderer === "undefined") {
	var { ipcRenderer } = require("electron");
}

$(document).ready(function () {
	const fileInput = $("#file-input");
	const fileList = $("#file-list");
	const fileInputLabel = $("#file-input-label");
	const protectButton = $("#protect-btn");

	$("#append-date").prop("checked", true);
	$("#list-card").css("display", "none");

	const selectedFiles = [];

	fileInput.on("change", function () {
		const files = Array.from(fileInput.prop("files"));
		selectedFiles.push(...files);
		updateFileList();
	});

	// Prevent the default behavior of the drop event
	fileInputLabel.on("dragover", function (e) {
		e.preventDefault();
	});

	// Handle the drop event
	fileInputLabel.on("drop", function (e) {
		e.preventDefault();

		const files = e.originalEvent.dataTransfer.files;

		// Add the selected files to the file input
		fileInput[0].files = files;

		selectedFiles.push(...files);

		// Display the list of selected files
		updateFileList();
	});

	function updateFileList() {
		fileList.html("");
		selectedFiles.forEach((file, index) => {
			const li = document.createElement("li");
			li.innerHTML = `
				<div class="flex justify-space-between align-items-center">
					${file.name} 
					<span class="cursor-pointer text-red" data-item-idx="${index}">
						<i class="fas fa-trash ml-sm"></i>
					</span>
				</div>
			`;
			fileList.append(li);
		});
		// set file input value to null
		$("#list-card").css("display", "block");
		fileInput.val("");
	}

	$(document).on("click", "[data-item-idx]", function () {
		const index = $(this).data("item-idx");
		selectedFiles.splice(index, 1);
		updateFileList();
		if (selectedFiles.length === 0) {
			$("#list-card").css("display", "none");
		}
	});

	protectButton.on("click", () => {
		if (selectedFiles.length === 0) {
			alert("Please select files to protect.");
			return;
		}

		const password = $("#password-input").val();

		if (!password) {
			alert("Password is required.");
			return;
		}

		protectButton.attr("aria-busy", "true");
		protectButton.addClass("secondary");

		const paths = selectedFiles.map((f) => f.path);
		ipcRenderer
			.invoke("protect-files", {
				files: paths,
				password,
				options: {
					zipName: $("#zip-folder-name-input").val(),
					appendDate: $("#append-date").is(":checked"),
				},
			})
			.then((error) => {
				if (!error) {
					alert("File saved in Downloads");
					selectedFiles.length = 0;
					$("#password-input").val("");
					updateFileList();
					$("#list-card").css("display", "none");
				} else {
					alert("Error while protecting files.");
				}
			})
			.finally(() => {
				protectButton.attr("aria-busy", "false");
				protectButton.removeClass("secondary");
			});
	});

	const restorationKey = $("#restoration-key");

	ipcRenderer.invoke("get-restoration-key").then((key) => {
		restorationKey.html(key);
	});

	const openInfoButton = $("#info-btn");
	openInfoButton.on("click", function () {
		$("#info-modal").prop("open", true);
	});
	const closeInfoButton = $("#close-info-btn");
	closeInfoButton.on("click", function () {
		$("#info-modal").prop("open", false);
	});

	ipcRenderer.send("app_version");
	ipcRenderer.on("app_version", () => {
		ipcRenderer.removeAllListeners("app_version");
	});

	function closeNotification() {
		notification.classList.add("hidden");
	}
	function restartApp() {
		ipcRenderer.send("restart_app");
	}
	const notification = document.getElementById("notification");
	const message = document.getElementById("message");
	const restartButton = document.getElementById("restart-button");
	ipcRenderer.on("update_available", () => {
		ipcRenderer.removeAllListeners("update_available");
		message.innerText = "A new update is available. Downloading now...";
		notification.classList.remove("hidden");
	});
	ipcRenderer.on("update_downloaded", () => {
		ipcRenderer.removeAllListeners("update_downloaded");
		message.innerText =
			"Update Downloaded. It will be installed on restart. Restart now?";
		restartButton.classList.remove("hidden");
		notification.classList.remove("hidden");
	});
});

import { Box, IconButton, Tooltip, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
	AtSignIcon,
	CloseIcon,
	DownloadIcon,
	EditIcon,
	HamburgerIcon,
	ViewIcon,
} from "@chakra-ui/icons";
import "./fab.css";
import { useAppState } from "../../state/app-state";

function Index({ onSelect }) {
	const [isOpen, setIsOpen] = useState(false);
	const [showPrint, setShowPrint] = useState(false);
	const toast = useToast();
	const app = useAppState();

	function handleAction(action) {
		onSelect(action);
		if (action === "edit") {
			setIsOpen(false);
		}
		if (action === "download") {
			setShowPrint(true);
			setTimeout(() => {
				setShowPrint(false);
			}, 1000);
		}
		if (action === "share") {
			if (navigator.share) {
				navigator
					.share({
						title: "My CV",
						text: "Hello, please check out my cv!",
						url: window.location.href,
					})
					.then(() => {
						setIsOpen(false);
					})
					.catch((error) => {
						toast({
							title: "Oops! Something went wrong",
							description: error.message,
							status: "error",
							duration: 3000,
							isClosable: true,
						});
					});
			} else {
				toast({
					title: "Oh no!",
					description: "Your browser does not support sharing",
					status: "warning",
					duration: 3000,
					isClosable: true,
				});
			}
		}
		if (action === "switch") {
			app.switchView();
		}
	}

	useEffect(() => {
		if (showPrint) {
			window.print();
		}
	}, [showPrint]);

	return (
		!showPrint && (
			<Box position="fixed" bottom="70px" right="50px" zIndex={1}>
				<Box
					position={"relative"}
					display={"flex"}
					justifyContent={"center"}>
					<Tooltip label={"Edit Profile"} placement={"left"}>
						<IconButton
							onClick={() => handleAction("edit")}
							position={"absolute"}
							size={"md"}
							className={"fab" + (isOpen ? " open-1" : "")}
							aria-label={"edit profile"}
							icon={<EditIcon />}
						/>
					</Tooltip>
					<Tooltip label={"Share Profile"} placement={"left"}>
						<IconButton
							onClick={() => handleAction("share")}
							position={"absolute"}
							size={"md"}
							className={"fab" + (isOpen ? " open-2" : "")}
							aria-label={"share profile"}
							icon={<AtSignIcon />}
						/>
					</Tooltip>
					{app.view !== "custom" && (
						<Tooltip label={"Download Profile"} placement={"left"}>
							<IconButton
								onClick={() => handleAction("download")}
								position={"absolute"}
								size={"md"}
								className={"fab" + (isOpen ? " open-4" : "")}
								aria-label={"download profile"}
								icon={<DownloadIcon />}
							/>
						</Tooltip>
					)}
					<Tooltip
						label={
							app.view === "custom"
								? "Switch to basic view"
								: "Switch to custom view"
						}
						placement={"left"}>
						<IconButton
							onClick={() => handleAction("switch")}
							position={"absolute"}
							size={"md"}
							className={"fab" + (isOpen ? " open-3" : "")}
							aria-label={"switch view"}
							icon={<ViewIcon />}
						/>
					</Tooltip>
					<IconButton
						size={"lg"}
						onClick={() => setIsOpen(!isOpen)}
						position={"absolute"}
						aria-label={"open sub menu"}
						colorScheme={"accent"}
						variant={isOpen ? "ghost" : "solid"}
						icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
					/>
				</Box>
			</Box>
		)
	);
}

export default Index;

import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import {
	DatabaseProvider,
	useDatabase,
} from "./AdminModule/database/use-database";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Loading from "./ResumeModule/loader";
import { colorSchemes } from "./AdminModule/constants";
import BasicResume from "./AdminModule/views/resume/basic";
import CustomResume from "./ResumeModule";

// initialize database
import "./AdminModule/database/index";
import { AppProvider, useAppState } from "./AdminModule/state/app-state";

function ResumePage() {
	const { initializing } = useDatabase();
	const { view } = useAppState();

	if (!initializing) {
		if (view === "custom") {
			return <CustomResume />;
		} else {
			return <BasicResume />;
		}
	}
	return <Loading />;
}

function App() {
	const { general } = useDatabase();
	const { setView } = useAppState();
	const theme = extendTheme({
		colors: {
			accent: {
				500: general.getValue("accentColor") || colorSchemes[0],
			},
		},
	});

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const basic = urlParams.get("basic");
		if (basic === "true") {
			setView("basic");
		} else {
			setView("custom");
		}
	}, [setView]);

	return (
		<ChakraProvider theme={theme}>
			<HelmetProvider>
				<Helmet>
					<title>{general.getValue("pageTitle") || "My CV"}</title>
					<link
						rel="icon"
						href={general.getValue("favicon") || "/no-image.png"}
					/>
				</Helmet>
				<ResumePage />
			</HelmetProvider>
		</ChakraProvider>
	);
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<AppProvider>
			<DatabaseProvider>
				<App />
			</DatabaseProvider>
		</AppProvider>
	</React.StrictMode>
);

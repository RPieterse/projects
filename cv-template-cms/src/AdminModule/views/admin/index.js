import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../database";
import Login from "./views/login";
import { Box, Heading, IconButton, Link, Text } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import "./admin.css";
import General from "./views/general";
import PersonalInformation from "./views/personal-information";
import Education from "./views/education";
import WorkHistory from "./views/work-history";
import Projects from "./views/projects";
import References from "./views/references";
import Skills from "./views/skills";
import Languages from "./views/languages";

import { suites } from "../../constants";
import { useAppState } from "../../state/app-state";
import { useDatabase } from "../../database/use-database";
import Awards from "./views/awards";

const views = [
	{ title: "Edit Profile", description: "Select a category to edit", id: "" },
	{
		title: "General",
		description: "Your general settings",
		component: <General />,
		id: suites.GENERAL,
	},
	{
		title: "Personal Information",
		description: "Edit your personal information",
		component: <PersonalInformation />,
		id: suites.PERSONAL_INFORMATION,
	},
	{
		title: "Work History",
		description: "Edit your work history",
		component: <WorkHistory />,
		id: suites.WORK_HISTORY,
	},
	{
		title: "Education",
		description: "Edit your education",
		component: <Education />,
		id: suites.EDUCATION,
	},
	{
		title: "Skills",
		description: "Edit your skills",
		component: <Skills />,
		id: suites.SKILLS,
	},
	{
		title: "Languages",
		description: "Edit your languages",
		component: <Languages />,
		id: suites.LANGUAGES,
	},
	{
		title: "Projects",
		description: "Edit your projects",
		component: <Projects />,
		id: suites.PROJECTS,
	},
	{
		title: "Awards",
		description: "Edit your awards",
		component: <Awards />,
		id: suites.AWARDS,
	},
	{
		title: "References",
		description: "Edit your references",
		component: <References />,
		id: suites.REFERENCES,
	},
];

function Admin({ onClose }) {
	const [view, setView] = useState(views[1]);
	const [animate, setAnimate] = useState(false);
	const { visibleSection, setActiveSuite } = useAppState();
	const { general } = useDatabase();

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			if (user) {
				setView(views[0]);
			} else {
				setView({ title: "login" });
			}
		});
	}, []);

	function selectView(item) {
		setAnimate(true);
		setTimeout(() => {
			setView(item);
			setActiveSuite(item.id);
			setAnimate(false);
		}, 200);
	}

	function handleBackButton() {
		if (view.title === "Edit Profile" || view.title === "login") {
			onClose();
		} else {
			setAnimate(true);
			setTimeout(() => {
				setView(views[0]);
				setActiveSuite("");
				setAnimate(false);
			}, 200);
		}
	}

	function logout() {
		signOut(auth);
	}

	return (
		<main
			style={{
				position: "sticky",
				top: 0,
			}}>
			{view.title === "login" && <Login onClose={handleBackButton} />}
			{view.title !== "login" && (
				<Box height={"100vh"} overflowY={"scroll"}>
					<Box
						className={"bottom-shadow"}
						paddingTop={14}
						position={"sticky"}
						top={0}
						background={"white"}
						zIndex={2}>
						<Box
							display={"flex"}
							justifyContent={"center"}
							alignItems={"center"}
							className={`title ${
								animate ? "inactive-fade" : "active-fade"
							}`}>
							<IconButton
								fontSize={"28px"}
								variant={"ghost"}
								marginRight={6}
								aria-label={"Back"}
								icon={<ArrowBackIcon />}
								onClick={handleBackButton}
							/>
							<Heading as="h1" size="2xl">
								{view.title}
							</Heading>
						</Box>
						<Text
							fontSize="2xl"
							textAlign={"center"}
							className={`${
								animate ? "inactive-fade" : "active-fade"
							}`}>
							{view.description}
						</Text>
						<hr
							style={{ marginTop: "56px", marginBottom: "64px" }}
						/>
					</Box>

					{view.title === "Edit Profile" && (
						<Box
							display={"flex"}
							className={`${
								animate ? "inactive-fade" : "active-fade"
							}`}
							flexDirection={"column"}
							alignItems={"center"}>
							{views.slice(1).map((item) => {
								return (
									<Heading
										className={`heading`}
										marginBottom={16}
										key={item.title}
										style={{
											color:
												item.id === visibleSection
													? general.getValue(
															"accentColor"
													  )
													: null,
										}}
										color={
											item.id === visibleSection
												? "accent"
												: null
										}
										onClick={() => selectView(item)}
										cursor={"pointer"}
										as="h3"
										size="lg">
										{item.title}
									</Heading>
								);
							})}
							<Heading
								className={`heading`}
								marginBottom={16}
								cursor={"pointer"}
								as="h3"
								size="lg">
								<Link onClick={logout}>Sign Out</Link>
							</Heading>
						</Box>
					)}

					<div className={animate ? "active" : "inactive"}>
						{view.title !== "Edit Profile" && view.component}
					</div>
				</Box>
			)}
		</main>
	);
}

export default Admin;

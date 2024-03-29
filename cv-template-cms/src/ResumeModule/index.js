import "./index.css";
import { useDatabase } from "../AdminModule/database/use-database";
import ResumeContainer from "../AdminModule/components/resume-container";
import { Code } from "@chakra-ui/react";

function CustomResume() {
	const {
		personalInformation,
		workHistory,
		skills,
		languages,
		projects,
		references,
		education,
		awards,
	} = useDatabase();

	return (
		<ResumeContainer>
			<div className="example-container">
				<strong className="example-container__box">
					Your Custom CV Goes Here
				</strong>
				<div className="example-container__info">
					Example of personalInformation Object
				</div>
				<div className="example-container__info">
					<Code>
						<pre>
							{JSON.stringify(personalInformation.value, null, 2)}
						</pre>
					</Code>
				</div>
			</div>
		</ResumeContainer>
	);
}

export default CustomResume;

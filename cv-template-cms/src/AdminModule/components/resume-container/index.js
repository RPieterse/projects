import {Box} from "@chakra-ui/react";
import Admin from "../../views/admin";
import Fab from "../fab";
import {useState} from "react";
import './resume-container.css';


function Index({children}) {
    const [showAdmin, setShowAdmin] = useState(false);

    function handleFabAction(action){
        if (action === 'edit') {
            setShowAdmin(!showAdmin);
        }
    }

    return (
    <Box className={"resume"}>
        <Box className={'profile' + (showAdmin ? ' admin-open' : '')}>
            {children}
        </Box>
        <Box className={'admin' + (showAdmin ? ' admin-open' : '')}>
            <Admin onClose={() => setShowAdmin(false)}/>
        </Box>
        {!showAdmin && <Fab onSelect={handleFabAction}/>}
    </Box>
    );
}

export default Index;
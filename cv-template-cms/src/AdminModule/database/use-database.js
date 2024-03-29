import React, {createContext, useContext, useEffect, useState} from 'react';
import usePersonalInformation from "./schemas/personal-information";
import useEducation from "./schemas/education";
import useWorkHistory from "./schemas/work-history";
import { doc, getDoc } from "firebase/firestore";
import {db} from "./index";
import useGeneral from "./schemas/general";
import useProjects from "./schemas/projects";
import useReferences from "./schemas/references";
import useLanguages from "./schemas/languages";
import useSkills from "./schemas/skills";
import useAwards from "./schemas/awards";

const DatabaseContext = createContext();

export function DatabaseProvider({ children }) {

    let general = useGeneral()
    let personalInformation = usePersonalInformation();
    let education = useEducation();
    let projects = useProjects();
    let workHistory = useWorkHistory();
    let references = useReferences();
    let languages = useLanguages();
    let skills = useSkills();
    let awards = useAwards();
    const [initializing, setInitializing] = useState(true);

    useEffect(() => {
        // get profile from database
        const docRef = doc(db, "profile", "data");
        setInitializing(true);
        getDoc(docRef).then((doc) => {
            if (doc.exists()) {
                general.initialize(doc.data()?.general ?? {})
                personalInformation.initialize(doc.data()?.personalInformation ?? {});
                education.initialize(doc.data()?.education ?? []);
                workHistory.initialize(doc.data()?.workHistory ?? []);
                projects.initialize(doc.data()?.projects ?? []);
                references.initialize(doc.data()?.references ?? []);
                languages.initialize(doc.data()?.languages ?? []);
                skills.initialize(doc.data()?.skills ?? []);
                awards.initialize(doc.data()?.awards ?? []);
                setInitializing(false);
            }
        }).catch((e) => {
            console.error('Error loading data:', e);
        }).finally(() => {
            setInitializing(false);
        });
    }, []);


    return (
        <DatabaseContext.Provider value={{
            personalInformation,
            education,
            workHistory,
            general,
            projects,
            references,
            languages,
            skills,
            awards,
            initializing
        }}>
        {children}
        </DatabaseContext.Provider>
    );
}

export function useDatabase() {
    const context = useContext(DatabaseContext);
    if (context === undefined) {
        throw new Error('useDatabase must be used within a DatabaseProvider');
    }
    return context;
}
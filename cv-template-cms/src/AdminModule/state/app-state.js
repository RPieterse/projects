import React, {createContext, useContext, useState} from 'react';
import {suites} from "../constants";

const AppContext = createContext();

export function AppProvider({ children }) {
    const [view, setView] = useState('custom');
    const [activeSuite, setActiveSuite] = useState('');
    const [visibleSection, setVisibleSection] = useState(suites.PERSONAL_INFORMATION);

    function switchView(){
        if (view === 'custom') {
            setView('basic');
        }else{
            setView('custom');
        }
    }


    return (
        <AppContext.Provider value={{
            view,
            setView,
            visibleSection,
            switchView,
            setVisibleSection,
            activeSuite,
            setActiveSuite
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppState() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useDatabase must be used within a DatabaseProvider');
    }
    return context;
}
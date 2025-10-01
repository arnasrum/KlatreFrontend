import React, {useEffect, useState} from "react";
import {ActiveSession} from "../interfaces/ActiveSession.ts";
import SessionContext from "../hooks/useSession.ts";


export default function SessionContextProvider({ children }: { children: React.ReactNode }) {
    const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([]);

    function addSession(session: ActiveSession) {
        // Need extra logic to check if session within the group already exists
        setActiveSessions(prev => [...prev, session])
    }

    function closeSession(id: number) {
        setActiveSessions(prev => prev.filter(session => session.id !== id))
    }

    const contextValue = {
        activeSessions,
        addSession,
        closeSession
    }

    useEffect(() => {
        console.log("updating active sessions")
    }, [activeSessions]);

    return(
        <SessionContext.Provider value={contextValue}>
            {children}
        </SessionContext.Provider>
    )
}
import React, {useEffect, useState} from "react";
import {ActiveSession} from "../interfaces/ActiveSession.ts";
import SessionContext from "../hooks/useSession.ts";
import {RouteAttempt} from "../interfaces/RouteAttempt.ts";


export default function SessionContextProvider({ children }: { children: React.ReactNode }) {
    // Initialize state from localStorage if available
    const [activeSessions, setActiveSessions] = useState<ActiveSession[]>(() => {
        const savedSessions = localStorage.getItem('activeSessions');
        return savedSessions ? JSON.parse(savedSessions) : [];
    });

    function addSession(session: ActiveSession) {
        // Need extra logic to check if session within the group already exists
        if(activeSessions.length >= 1) {
            console.log("Session already exists")
            return
        }
        setActiveSessions(prev => [...prev, session])
    }

    function addRouteAttempt(routeAttempt: RouteAttempt) {
        if(activeSessions.length <= 0) {
            console.error("No active sessions")
            return
        }

        const session = activeSessions[0]
        session.routeAttempts.push(routeAttempt)
        setActiveSessions([session])
    }

    function closeSession(id: string) {
        setActiveSessions(prev => prev.filter(session => session.id !== id))
    }

    const contextValue = {
        activeSessions,
        addRouteAttempt,
        addSession,
        closeSession
    }

    // Save to localStorage whenever activeSessions changes
    useEffect(() => {
        console.log("updating active sessions")
        localStorage.setItem('activeSessions', JSON.stringify(activeSessions));
    }, [activeSessions]);

    return(
        <SessionContext.Provider value={contextValue}>
            {children}
        </SessionContext.Provider>
    )
}
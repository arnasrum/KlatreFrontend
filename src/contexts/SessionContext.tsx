import React, {useEffect, useState} from "react";
import {ActiveSession} from "../interfaces/ActiveSession.ts";
import SessionContext from "../hooks/useSession.ts";
import {RouteAttempt} from "../interfaces/RouteAttempt.ts";
import {apiUrl} from "../constants/global.ts";


export default function SessionContextProvider({ children }: { children: React.ReactNode }) {
    // Initialize state from localStorage if available
    const [activeSessions, setActiveSessions] = useState<ActiveSession[]>(() => {
        const savedSessions = localStorage.getItem('activeSessions');
        return savedSessions ? JSON.parse(savedSessions) : [];
    });


    function addRouteAttempt(routeAttempt: RouteAttempt, groupId: number) {
        const session = activeSessions.find(s => s.groupId === groupId);
        if(!session) {
            console.error("No active session for this group");
            return;
        }
        const updatedSession = {
            ...session,
            routeAttempts: [...session.routeAttempts, routeAttempt]
        };
        setActiveSessions(prev =>
            prev.map(s => s.groupId === groupId ? updatedSession : s)
        );
    }

    function updateSession(activeSession: ActiveSession) {
        setActiveSessions(prev => 
            prev.map(s => s.id === activeSession.id ? activeSession : s)
        );
    }


    const contextValue = {
        activeSessions,
        addRouteAttempt,
        updateSession,
        addSession,
        closeSession
    };

    // Save to localStorage whenever activeSessions changes
    useEffect(() => {
        console.log("new active sessions:", activeSessions)
        localStorage.setItem('activeSessions', JSON.stringify(activeSessions));
    }, [activeSessions]);

    return(
        <SessionContext.Provider value={contextValue}>
            {children}
        </SessionContext.Provider>
    );
}
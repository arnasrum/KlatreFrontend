import {createContext, useContext} from "react";
import { SessionContextType} from "../interfaces/SessionContext.ts";

const SessionContext = createContext<SessionContextType>(null);
function useSessionContext(): SessionContextType {
    const context = useContext(SessionContext);

    // Optional: Add a check to ensure the hook is used inside the Provider
    if (context === null) {
        throw new Error('useSessionContext must be used within a SessionContextProvider');
    }
    return context as SessionContextType
}

export default SessionContext;
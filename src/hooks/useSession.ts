import {createContext, useContext} from "react";
import { SessionContextType} from "../interfaces/SessionContext.ts";

const SessionContext = createContext<SessionContextType>(null);
function useSessionContext(): SessionContextType {
    const context = useContext(SessionContext);

    if (context === null) {
        throw new Error('useSessionContext must be used within a SessionContextProvider');
    }
    return context as SessionContextType
}

export default SessionContext;
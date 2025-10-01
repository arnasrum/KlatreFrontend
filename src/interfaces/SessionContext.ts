import {ActiveSession} from "./ActiveSession.ts";

export type SessionContextType = {
    activeSessions: ActiveSession[];
    addSession: (session: ActiveSession) => void;
    closeSession: (id: number) => void;
}
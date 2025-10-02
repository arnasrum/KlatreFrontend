import {ActiveSession} from "./ActiveSession.ts";
import {RouteAttempt} from "./RouteAttempt.ts";

export type SessionContextType = {
    activeSessions: ActiveSession[];
    addSession: (session: ActiveSession) => void;
    addRouteAttempt: (routeAttempt: RouteAttempt, groupId: number) => void;
    updateSession: (activeSession: ActiveSession) => void;
    closeSession: (id: string) => void;
}
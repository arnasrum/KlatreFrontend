import {RouteAttempt} from "./RouteAttempt.ts";

export type ActiveSession = {
    id: string,
    groupId: number,
    placeId: number,
    dateStarted: string,
    routeAttempts: RouteAttempt[]
}

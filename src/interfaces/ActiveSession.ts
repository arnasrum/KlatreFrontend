import {RouteAttempt} from "./RouteAttempt.ts";

export type ActiveSession = {
    id: string,
    placeId: number,
    dateStarted: string,
    routeAttempts: RouteAttempt[]
}
